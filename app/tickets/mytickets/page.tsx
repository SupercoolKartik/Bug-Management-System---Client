"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const MyTickets = () => {
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
      created: string; // Date type can also be used
      dueDate: string; // Date type can also be used
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const toDoTickets = tickets.filter((ticket) => ticket.status === "To Do");
  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  );
  const doneTickets = tickets.filter((ticket) => ticket.status === "Done");

  useEffect(() => {
    const fetchTickets = async () => {
      const userId = localStorage.getItem("userId");

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

    fetchTickets();
  }, []);

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
      <h1 className="flex items-center justify-center text-2xl font-serif font-bold mb-4">
        My Tickets
      </h1>
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
