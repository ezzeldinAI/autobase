import type { PropsWithChildren } from "react";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireAuth } from "@/lib/auth-utils";

type LayoutProps = PropsWithChildren & {};

export default async function DashboardLayout(props: LayoutProps) {
  await requireAuth();

  return (
    <SidebarProvider
      className="flex h-screen overflow-hidden"
      defaultOpen={false}
    >
      <AppSidebar />

      <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-accent/20">
        <AppHeader />
        <div className="flex-1 overflow-auto p-4">{props.children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
