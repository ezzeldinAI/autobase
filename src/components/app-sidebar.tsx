"use client";

import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  type LucideIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ROUTER_CONSTANTS, type RouterPath } from "@/constants/router";
import { authClient } from "@/lib/auth-client";

const menuItems: {
  title: string;
  items: {
    title: string;
    icon: LucideIcon;
    href: RouterPath;
  }[];
}[] = [
  {
    title: "Workflows",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        href: ROUTER_CONSTANTS.BASE,
      },
      {
        title: "Credentials",
        icon: KeyIcon,
        href: ROUTER_CONSTANTS.CREDENTIALS,
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        href: ROUTER_CONSTANTS.EXECUTIONS,
      },
    ],
  },
];

export function AppSidebar() {
  //   const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarRail />
      <SidebarHeader>
        <SidebarMenuItem>
          <Logo />
        </SidebarMenuItem>
      </SidebarHeader>
      <div className="mx-2">
        <Separator />
      </div>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent className="space-y-3">
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="h-10 gap-x-4 px-4"
                    isActive={
                      item.href === ROUTER_CONSTANTS.BASE
                        ? pathname === ROUTER_CONSTANTS.BASE
                        : pathname.startsWith(item.href)
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.href} prefetch>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <div className="mx-2">
        <Separator />
      </div>

      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="h-10 gap-x-4 px-4"
            // onClick={() => {}}
            tooltip={"Upgrade to Pro"}
          >
            <StarIcon />
            <span className="flex flex-1 items-center gap-2 text-xs">
              Upgrade to Pro
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            className="h-10 gap-x-4 px-4"
            // onClick={() => {}}
            tooltip={"Billing Portal"}
          >
            <CreditCardIcon />
            <span className="flex flex-1 items-center gap-2 text-xs">
              Billing Portal
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem className="flex max-h-12 items-center overflow-hidden">
          <SidebarMenuButton
            className="h-10 gap-x-4 bg-destructive/25 px-4 text-destructive hover:bg-destructive/35 hover:text-destructive"
            onClick={() => {
              authClient.signOut();
            }}
            tooltip={"Logout"}
          >
            <LogOutIcon />
            <span className="flex flex-1 items-center gap-2 text-xs">
              Logout
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
