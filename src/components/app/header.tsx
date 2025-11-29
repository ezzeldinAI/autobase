import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 divide-x divide-border border-b bg-background px-4">
      <SidebarTrigger />
    </header>
  );
}
