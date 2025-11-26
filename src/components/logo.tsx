import Image from "next/image";
import Link from "next/link";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { ROUTER_CONSTANTS } from "@/constants/router";

export const Logo = () => (
  <SidebarMenuButton
    asChild
    className="h-10 gap-x-4 bg-foreground/5 px-4 ring ring-foreground/10 transition-all hover:bg-foreground/10 hover:ring-2 hover:ring-foreground/60"
  >
    <Link
      className="flex items-center gap-x-2"
      href={ROUTER_CONSTANTS.BASE}
      prefetch
    >
      <Image alt="" height={20} src="/logo.svg" width={20} />
      <p className="font-semibold text-xs">Autobase</p>
    </Link>
  </SidebarMenuButton>
);
