"use client";
import { useState, useEffect } from "react";

interface Project {
  _id: string;
  projectName: string;
  creatorsId: string;
  creatorsFirstName: string;
  creatorsLastName: string;
  tickets: string[];
}

const MyProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DEPLOYED_BACKEND_URI}/api/projects/fetchallprojects/${userId}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching projects: ${response.statusText}`);
        }
        const responseData = await response.json();
        setProjects(responseData);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-6">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-purple-700 mb-4">MyProjects</h1>
        {error ? (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            Error: {error}
          </div>
        ) : (
          <ul className="space-y-2">
            {projects &&
              projects.map((project) => (
                <li
                  key={project._id}
                  className="p-2 bg-purple-100 text-purple-700 rounded-lg shadow-sm hover:bg-purple-200"
                >
                  {project.projectName}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
