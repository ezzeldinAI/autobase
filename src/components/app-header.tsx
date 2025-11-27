import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 divide-x divide-border border-b bg-background px-4">
      <SidebarTrigger />
      {/* Add a Breadcrumb like navigator to allows the user to navigate between the workflows without having to return to "/workflows"  */}
      {/* ie he click on the current workflow name to show a dropdown of the workflows and onClick it navigates to that workflow */}
    </header>
  );
}
