"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const signupFormSchema = z
  .object({
    firstName: z.string().min(1, {
      message: "First name is required.",
    }),
    lastName: z.string().min(1, {
      message: "Last name is required.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
      message: "Please enter a valid phone no.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters.",
    }),
    // acceptTerms: z.boolean().refine((val) => val === true, {
    //   message: "You must accept the terms and conditions.",
    // }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"], // set the path of the error message to 'confirmPassword'
  });

// export default signupFormSchema;

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

const Signup = () => {
  const router = useRouter();
  // Define your form with useForm
  const form = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      // acceptTerms: false,
    },
  });

  // Extract handleSubmit, register, and formState from the form object
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  // Defining the submit handler
  const onSubmit = async (values: z.infer<typeof signupFormSchema>) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DEPLOYED_BACKEND_URI}/api/auth/createuser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
            password: values.password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      //PUSH USER TO THE LANDING PAGE

      const responseData = await response.json();
      console.log("Signup successful:", responseData);
      localStorage.setItem("userId", responseData.userId);
      localStorage.setItem("firstName", responseData.firstName);
      localStorage.setItem("lastName", responseData.lastName);
      return router.push(`/`, { scroll: false });
      // Handle success (e.g., show a success message, redirect to login page, etc.)
    } catch (error) {
      console.error("Signup failed:", error);
      // Handle error (e.g., show an error message)
    }
  };
  return (
    <div className="container px-5 py-4 mx-auto flex flex-wrap flex-col items-center justify-center">
      <h1 className="font-bold text-purple-800 text-3xl mb-4">
        Bug Management System
      </h1>
      <h3 className="text-purple-600">Sign In to continue</h3>
      <div className="bg-gray-100 rounded-lg p-7 flex flex-col mt-10 md:mt-0">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-800">
                    First Name :
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="First Name"
                      {...field}
                      className="border-purple-400"
                    />
                  </FormControl>
                  <FormMessage>{errors.firstName?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-800">Last Name :</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Last Name"
                      {...field}
                      className="border-purple-400"
                    />
                  </FormControl>
                  <FormMessage>{errors.lastName?.message}</FormMessage>
                </FormItem>
              )}
            />
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
                      className="border-purple-400"
                    />
                  </FormControl>
                  <FormMessage>{errors.email?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-800">Phone :</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0123456789"
                      {...field}
                      className="border-purple-400"
                    />
                  </FormControl>
                  <FormMessage>{errors.phone?.message}</FormMessage>
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
                      className="border-purple-400"
                    />
                  </FormControl>
                  <FormMessage>{errors.password?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-800">
                    Confirm Password :
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="************"
                      {...field}
                      className="border-purple-400"
                    />
                  </FormControl>
                  <FormMessage>{errors.confirmPassword?.message}</FormMessage>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Sign Up
            </Button>
            <FormDescription className="text-purple-800">
              Already have an account?{" "}
              <Link
                href="login"
                className="text-purple-700 hover:text-purple-900"
              >
                Login
              </Link>
            </FormDescription>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
