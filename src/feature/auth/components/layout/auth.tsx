import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type LayoutProps = {
  children: Readonly<ReactNode>;
};

export function AuthLayout(props: LayoutProps) {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center bg-muted">
      <section className="flex w-full max-w-md flex-col gap-6">
        <Link
          className="flex items-center gap-2 self-center rounded-xl font-medium opacity-100 transition-all hover:bg-accent hover:px-4 hover:py-2"
          href={"/"}
        >
          <Image alt="AutoBase" height={30} src="/logo.svg" width={30} />
          <span>Autobase</span>
        </Link>
        {props.children}
      </section>
    </section>
  );
}
