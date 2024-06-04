"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// export default loginFormSchema;
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
const Login = () => {
  const router = useRouter();

  // Defining your form with useForm
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Defining the submit handler
  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DEPLOYED_BACKEND_URI}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        // Navigate to the Landing Page
        console.log("Logged in Successfully!");
        localStorage.setItem("userId", responseData.userId);
        localStorage.setItem("firstName", responseData.firstName);
        localStorage.setItem("lastName", responseData.lastName);
        return router.push(`/`, { scroll: false });
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
    <div className="h-screen container mx-auto flex flex-wrap flex-col items-center justify-center bg-purple-50">
      <h1 className="font-bold text-purple-800 absolute top-4 text-3xl">
        Bug Management System
      </h1>
      <h3 className="text-purple-700 mb-4">Login to continue</h3>
      <div className="bg-white shadow-md rounded-lg p-8 flex flex-col items-center w-full max-w-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-800">Email :</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@mail.com"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-800">Password :</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="************"
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
              Login
            </Button>
            <FormDescription className="text-center mt-4">
              Don't have an account?{" "}
              <Link
                href="signup"
                className="text-purple-700 hover:text-purple-900 underline"
              >
                Signup
              </Link>
            </FormDescription>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
