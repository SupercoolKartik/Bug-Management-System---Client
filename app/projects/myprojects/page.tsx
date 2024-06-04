"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//Create Project Form Schema
const createProjectSchema = z.object({
  projectName: z.string().min(1, {
    message: "Project name is required.",
  }),
  projectDescription: z.string().min(1, {
    message: "Project description is required.",
  }),
});

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Project {
  _id: string;
  projectId: string;
  projectName: string;
  creatorsId: string;
  creatorsFirstName: string;
  creatorsLastName: string;
  tickets: string[];
}

const MyProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const userId = localStorage.getItem("userId");
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

  const addUserToProject = async (
    userProjectData: {
      projectId: string;
      projectName: string;
      userId: string | null;
      firstName: string | null;
      lastName: string | null;
    }[]
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DEPLOYED_BACKEND_URI}/api/projects/addusers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userProjectData),
        }
      );

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error adding users to project:", error);
    }
  };

  // Defining your form with useForm
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
    },
  });

  // Defining the submit handler
  const onSubmit = async (values: z.infer<typeof createProjectSchema>) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DEPLOYED_BACKEND_URI}/api/projects/createproject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectName: values.projectName,
            projectDescription: values.projectDescription,
            creatorsId: localStorage.getItem("userId"),
            creatorsFirstName: localStorage.getItem("firstName"),
            creatorsLastName: localStorage.getItem("lastName"),
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        console.log("Project Created Successfully!");
        console.log("🌈", responseData.projectId);

        //Adding the entry in the User-Project table too
        await addUserToProject([
          {
            projectId: responseData.projectId,
            projectName: values.projectName,
            userId: localStorage.getItem("userId"),
            firstName: localStorage.getItem("firstName"),
            lastName: localStorage.getItem("lastName"),
          },
        ]);
        setIsDialogOpen(false); // Close the dialog
        fetchProjects();
      } else {
        // Handle server error messages
        // console.error("Error:", responseData.error);
        throw new Error(responseData.error || "Unknown error occurred");
      }
    } catch (error: any) {
      console.error("Error:", error.message); // It will catch the error thrown above iff any
    }
  };

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
                  key={project.projectId}
                  className="p-2 bg-purple-100 text-purple-700 rounded-lg shadow-sm hover:bg-purple-200"
                >
                  <Link href={`/projects/project/${project.projectId}`}>
                    <h1 className="block">{project.projectName}</h1>
                  </Link>
                </li>
              ))}
            <li className="p-2 bg-purple-50 text-purple-700 rounded-lg shadow-sm hover:bg-purple-200">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger
                  className="font-semibold text-sm"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Create new project +
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new project</DialogTitle>
                    <DialogDescription>
                      Enter the project details below.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-3"
                    >
                      <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Name:</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter project name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="projectDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Description:</FormLabel>
                            <FormControl>
                              <textarea
                                rows={4} // Adjust the number of rows as needed
                                placeholder="Enter project description"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
