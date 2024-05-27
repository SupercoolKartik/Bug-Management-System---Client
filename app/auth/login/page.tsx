"use client";
import Link from "next/link";

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
  // Defining your form with useForm
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Defining the submit handler
  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    // Do something with the form values
    // This will be type-safe and validated
    console.log(values);
  };
  return (
    <div className="container px-5 py-24 mx-auto flex flex-wrap items-center justify-center">
      <div className="bg-gray-100 rounded-lg p-7 flex flex-col mt-10 md:mt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
