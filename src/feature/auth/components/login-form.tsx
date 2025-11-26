"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
  type LoginSchemaValues,
  loginDefaultValues,
  loginResolver,
} from "@/feature/auth/schemas/login";
import { authClient } from "@/lib/auth-client";
import { visualErrorNotify, visualSuccessNotify } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginSchemaValues>({
    resolver: loginResolver,
    defaultValues: loginDefaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  const onSubmit = async (data: LoginSchemaValues) => {
    await authClient.signIn.email(
      {
        ...data,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          visualSuccessNotify("Account created successfully, redirecting...");
          router.push("/");
        },
        onError: ({ error: { message } }) => {
          visualErrorNotify(message);
        },
      }
    );
  };
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Login to continue</CardDescription>
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
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </div>
                <div className="rounded-md bg-accent p-2 text-center text-sm">
                  Don't have an account?{" "}
                  <Link
                    className="underline underline-offset-4"
                    href="/register"
                  >
                    Register
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
