/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: biome is correct for
 * pointing this out, we need to find a better to code this ternary mess, common we ain't junior devs
 */
"use client";

import {
  ArrowUpRightIcon,
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  type LucideIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/primitives/logo";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ROUTER_CONSTANTS, type RouterPath } from "@/constants/router";
import { useHasActiveSubscription } from "@/feature/payments/hooks/use-subscription";
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
  const router = useRouter();
  const pathname = usePathname();
  const [isBillingPortalButtonLoading, setIsBillingPortalButtonLoading] =
    useState<boolean>(false);
  const [isUpgradeButtonLoading, setIsUpgradeButtonLoading] =
    useState<boolean>(false);
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  return (
    <Sidebar collapsible="icon">
      <SidebarRail />
      <SidebarHeader>
        <SidebarMenuItem>
          <Logo />
        </SidebarMenuItem>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent className="space-y-3">
              {group.items.map((item) => {
                if (pathname === item.href) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        className="h-10 gap-x-4 px-4"
                        isActive
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="h-10 gap-x-4 px-4"
                      isActive={false}
                      tooltip={item.title}
                    >
                      <Link href={item.href} prefetch>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        {isLoading ? (
          <SidebarMenuItem>
            <Skeleton className="flex h-10 w-full items-center justify-start gap-2 px-2">
              <Spinner className="size-4 group-data-[collapsible=icon]:flex group-data-[!collapsible=icon]:hidden" />
              <p className="h-4 text-muted-foreground text-xs group-data-[!collapsible=icon]:flex group-data-[collapsible=icon]:hidden">
                Getting Billing Status...
              </p>
            </Skeleton>
          </SidebarMenuItem>
        ) : hasActiveSubscription ? (
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-10 gap-x-4 px-4"
              disabled={isBillingPortalButtonLoading}
              onClick={() => {
                setIsBillingPortalButtonLoading(true);
                authClient.customer.portal();
              }}
              tooltip={"Billing Portal"}
            >
              {isBillingPortalButtonLoading ? (
                <Spinner className="size-4" />
              ) : (
                <CreditCardIcon />
              )}
              <span className="flex flex-1 items-center gap-2 text-xs">
                {isBillingPortalButtonLoading
                  ? "Redirecting..."
                  : "Billing Portal"}
              </span>
              <ArrowUpRightIcon />
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-10 gap-x-4 px-4"
              disabled={isUpgradeButtonLoading}
              onClick={() => {
                setIsUpgradeButtonLoading(true);
                authClient.checkout({ slug: "pro" });
              }}
              tooltip={"Upgrade to Pro"}
            >
              {isUpgradeButtonLoading ? (
                <Spinner className="size-4" />
              ) : (
                <StarIcon />
              )}
              <span className="flex flex-1 items-center gap-2 text-xs">
                {isUpgradeButtonLoading ? "Redirecting..." : "Upgrade to Pro"}
              </span>
              <ArrowUpRightIcon />
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        <SidebarMenuItem className="flex max-h-12 items-center overflow-hidden">
          <SidebarMenuButton
            className="h-10 gap-x-4 bg-destructive/25 px-4 text-destructive hover:bg-destructive/35 hover:text-destructive"
            disabled={isLoggingOut}
            onClick={() => {
              setIsLoggingOut(true);
              authClient.signOut();
              setIsLoggingOut(false);
              router.push(ROUTER_CONSTANTS.LOGIN);
            }}
            tooltip={"Logout"}
          >
            {isLoggingOut ? (
              <>
                <Spinner className="size-4" />
                <span className="flex flex-1 items-center gap-2 text-xs">
                  Logging out...
                </span>
              </>
            ) : (
              <>
                <LogOutIcon />
                <span className="flex flex-1 items-center gap-2 text-xs">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              </>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}

function SidebarSeparator() {
  return (
    <div className="mx-2">
      <Separator />
    </div>
  );
}
