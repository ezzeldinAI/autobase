"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  type RegisterSchemaValues,
  registerDefaultValues,
  registerResolver,
} from "@/feature/auth/schemas/register";
import { authClient } from "@/lib/auth-client";

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterSchemaValues>({
    resolver: registerResolver,
    defaultValues: registerDefaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  const onSubmit = async (data: RegisterSchemaValues) => {
    await authClient.signUp.email(
      {
        ...data,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully, redirecting...");
          router.push("/");
        },
        onError: ({ error: { message } }) => {
          toast.error(message);
        },
      }
    );
  };
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Get Started</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    className="w-full"
                    disabled={isSubmitting}
                    type="button"
                    variant={"outline"}
                  >
                    <Image
                      alt="github-logo"
                      height={20}
                      src={"./github.svg"}
                      width={20}
                    />
                    Continue with GitHub
                  </Button>

                  <Button
                    className="w-full"
                    disabled={isSubmitting}
                    type="button"
                    variant={"outline"}
                  >
                    <Image
                      alt="google-logo"
                      height={20}
                      src={"./google.svg"}
                      width={20}
                    />
                    Continue with Google
                  </Button>
                </div>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John Doe"
                            type="text"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="m@example.com"
                            type="email"
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="********"
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    className="w-full"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? "Creating account..." : "Register"}
                  </Button>
                </div>
                <div className="rounded-md bg-accent p-2 text-center text-sm">
                  Already have an account?{" "}
                  <Link className="underline underline-offset-4" href="/login">
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
