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
    <div className="h-screen container mx-auto flex flex-wrap flex-col items-center justify-center">
      <h1 className="font-bold absolute top-2">Bug Management System</h1>
      <h3>Login to continue</h3>
      <div className="bg-gray-100 rounded-lg p-7 flex flex-col ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email :</FormLabel>
                  <FormControl>
                    <Input placeholder="example@mail.com" {...field} />
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
                  <FormLabel>Password :</FormLabel>
                  <FormControl>
                    <Input placeholder="************" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Login</Button>
            <FormDescription>
              Don't have an account?{" "}
              <Link
                href="signup"
                className="text-underline text-purple-700 hover:text-purple-900"
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
