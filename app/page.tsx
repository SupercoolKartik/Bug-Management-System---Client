"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log(localStorage.getItem("userId"));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex"></div>
      Welcome to BUG MANAGEMENT SYSTEM
      <Link href="auth/login">login</Link>
      <Link href="auth/signup">signup</Link>
      <div className="mb-32 flex flex-col md:flex-row md:mt-10 mt-4">
        <Link href="projects/myprojects">
          <div className="group rounded-lg border border-transparent px-5 py-10 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              Projects{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              View all the projects you are a part of.
            </p>
          </div>
        </Link>
        <Link href="tickets/mytickets">
          <div className="group rounded-lg border border-transparent px-5 py-6 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 /*flex flex-col justify-center items-center*/">
            <h2 className="mb-3 text-2xl font-semibold">
              Tickets{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              View all the tickets you are assigned to or have assigned.
            </p>
          </div>
        </Link>
      </div>
    </main>
  );
}
