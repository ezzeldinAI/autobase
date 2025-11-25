import type { ReactNode } from "react";
import { requireUnauth } from "@/lib/auth-utils";

type LayoutProps = {
  children: Readonly<ReactNode>;
};

export default async function AuthenticationLayout(props: LayoutProps) {
  await requireUnauth(); // just for better UX

  return (
    <section className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md">{props.children}</div>
    </section>
  );
}
