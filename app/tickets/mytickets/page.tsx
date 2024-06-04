"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const userId = localStorage.getItem("userId");

const createTicketSchema = z.object({
  summary: z.string().min(1, {
    message: "Summary is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  projectId: z.string().min(1, {
    message: "Project ID is required.",
  }),
  status: z.string(),
  assigneeId: z.string().min(1, {
    message: "Assignee ID is required.",
  }),
  priority: z.string(),
  dueDate: z.string(),
});

const formatDate = (date: any) => {
  return date.toISOString().split("T")[0]; // Format date to 'YYYY-MM-DD'
};

const MyTickets = () => {
  // tickets state to store all the tickets data after fething it from the database
  const [tickets, setTickets] = useState<
    {
      _id: string;
      summary: string;
      description: string;
      projectId: string;
      status: "To Do" | "In Progress" | "Done";
      reporterId: string;
      assigneeId: string;
      priority: "High" | "Medium" | "Low";
      created: Date;
      dueDate: Date;
    }[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //States to filter all the tickets according to their statuses
  const toDoTickets = tickets.filter((ticket) => ticket.status === "To Do");
  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  );
  const doneTickets = tickets.filter((ticket) => ticket.status === "Done");

  const fetchTickets = async () => {
    if (!userId) {
      setError("User ID not found in local storage");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DEPLOYED_BACKEND_URI}/api/tickets/fetchalltickets/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const form = useForm({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      summary: "",
      description: "",
      projectId: "",
      status: "To Do",
      assigneeId: "",
      priority: "Medium",
      dueDate: formatDate(new Date()),
    },
  });

  const onSubmit = async (values: z.infer<typeof createTicketSchema>) => {
    try {
      setIsDialogOpen(false);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DEPLOYED_BACKEND_URI}/api/tickets/createticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: values.summary,
            description: values.description,
            projectId: values.projectId,
            status: values.status,
            reporterId: userId,
            assigneeId: values.assigneeId,
            priority: values.priority,
            created: formatDate(new Date()),
            dueDate: values.dueDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Ticket created successfully:", data);

      fetchTickets(); //In case you assign ticket to yourself, it will be displayed immediately
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-purple-200 h-32 w-32 mb-4"></div>
          <div className="text-2xl text-purple-500">Loading...</div>
        </div>
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="container mx-auto p-4 bg-purple-100">
      <div className="flex justify-between mb-4 px-1">
        <h1 className="flex  text-2xl font-serif font-bold ">My Tickets</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            onClick={() => setIsDialogOpen(true)}
            className="px-2 py-2 flex items-center justify-center bg-purple-50 text-purple-700 rounded-lg shadow-sm hover:bg-purple-200 "
          >
            Create a new ticket +
          </DialogTrigger>
          <DialogContent className="max-h-screen overflow-scroll my-4">
            <DialogHeader>
              <DialogTitle>Create a New Ticket</DialogTitle>
              <DialogDescription>
                Please fill out the details below to create a new ticket.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-1 w-full "
              >
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800">
                        Summary:
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter summary"
                          {...field}
                          className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800">
                        Description:
                      </FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Enter description"
                          {...field}
                          className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800">
                        Project ID:
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter project ID"
                          {...field}
                          className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800">Status:</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assigneeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800">
                        Assignee ID:
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter assignee ID"
                          {...field}
                          className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800">
                        Priority:
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800">
                        Due Date:
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
                >
                  Submit
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-100 p-4 rounded-sm shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-red-600">To Do</h2>
          {toDoTickets.length > 0 ? (
            <ul className="space-y-2">
              {toDoTickets.map((ticket) => (
                <li
                  key={ticket._id}
                  className="bg-red-200 hover:bg-red-300 p-4 rounded-lg shadow-md"
                >
                  <Link href={`/tickets/ticket/${ticket._id}`}>
                    <h3 className="text-lg font-semibold">{ticket.summary}</h3>
                    <p className="text-sm">Description: {ticket.description}</p>

                    <p>Priority: {ticket.priority}</p>
                    <p>
                      Due Date: {new Date(ticket.dueDate).toLocaleDateString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tickets found</p>
          )}
        </div>
        <div className="bg-yellow-100 p-4 rounded-sm shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-yellow-600">
            In Progress
          </h2>
          {inProgressTickets.length > 0 ? (
            <ul className="space-y-2">
              {inProgressTickets.map((ticket) => (
                <li
                  key={ticket._id}
                  className="bg-yellow-200 hover:bg-yellow-300 p-4 rounded-lg shadow-md"
                >
                  <Link href={`/tickets/ticket/${ticket._id}`}>
                    <h3 className="text-lg font-semibold">{ticket.summary}</h3>
                    <p className="text-sm">Description: {ticket.description}</p>

                    <p>Priority: {ticket.priority}</p>
                    <p>
                      Due Date: {new Date(ticket.dueDate).toLocaleDateString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tickets found</p>
          )}
        </div>
        <div className="bg-green-100 p-4 rounded-sm shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-green-600">Done</h2>
          {doneTickets.length > 0 ? (
            <ul className="space-y-2">
              {doneTickets.map((ticket) => (
                <li
                  key={ticket._id}
                  className="bg-green-200 hover:bg-green-300 p-4 rounded-lg shadow-md"
                >
                  <Link href={`/tickets/ticket/${ticket._id}`}>
                    <h3 className="text-lg font-semibold">{ticket.summary}</h3>
                    <p className="text-sm">Description: {ticket.description}</p>
                    <p>Priority: {ticket.priority}</p>
                    <p>
                      Due Date: {new Date(ticket.dueDate).toLocaleDateString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tickets found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
