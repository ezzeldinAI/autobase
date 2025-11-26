import type { ReactNode } from "react";
import { AuthLayout } from "@/feature/auth/components/layout/auth";

type LayoutProps = {
  children: Readonly<ReactNode>;
};

export default function AuthenticationLayout(props: LayoutProps) {
  return <AuthLayout>{props.children}</AuthLayout>;
}
