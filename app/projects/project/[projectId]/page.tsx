"use client";
import { useEffect, useState } from "react";

const Product = ({ params }: { params: { projectId: string } }) => {
  const [projectData, setProjectData] = useState<{
    projectName: string;
    projectDescription: string;
    creatorsFirstName: string;
    creatorsLastName: string;
  } | null>(null);
  const [users, setUsers] = useState<
    { userId: string; firstName: string; lastName: string }[]
  >([]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DEPLOYED_BACKEND_URI}/api/projects/getprojectdata/${params.projectId}`
        );
        const data = await response.json();
        setProjectData(data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [params.projectId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DEPLOYED_BACKEND_URI}/api/projects/fetchallusers/${params.projectId}`
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [params.projectId]);

  if (!projectData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-purple-200 h-32 w-32 mb-4"></div>
          <div className="text-2xl text-purple-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 p-6 rounded-lg shadow-md">
      <div className="details md:w-1/2 p-4 bg-white rounded-lg shadow-md mb-4 md:mb-0 md:mr-4">
        <h1 className="text-3xl font-bold text-purple-700 mb-2">
          {projectData.projectName}
        </h1>
        <p className="text-purple-600 mb-4">{projectData.projectDescription}</p>
        <p className="text-purple-500">
          Creator: {projectData.creatorsFirstName}{" "}
          {projectData.creatorsLastName}
        </p>
      </div>
      <div className="users md:w-1/2 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-purple-700 mb-2">Users</h2>
        {users.length > 0 ? (
          <ul className="list-disc list-inside text-purple-600">
            {users.map((user) => (
              <li key={user.userId} className="mb-2">
                {user.firstName} {user.lastName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-purple-500">No users found for this project.</p>
        )}
      </div>
    </div>
  );
};

export default Product;
