import type { ReactNode } from "react";
import { AuthLayout } from "@/feature/auth/components/layout/auth";
import { requireUnauth } from "@/lib/auth-utils";

type LayoutProps = {
  children: Readonly<ReactNode>;
};

export default async function AuthenticationLayout(props: LayoutProps) {
  await requireUnauth(); // just for better UX

  return <AuthLayout>{props.children}</AuthLayout>;
}
