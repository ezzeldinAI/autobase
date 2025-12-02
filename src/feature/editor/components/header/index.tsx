import { SidebarTrigger } from "@/components/ui/sidebar";
import { EditorHeaderBreadcrumbs } from "@/feature/editor/components/header/breadcrumbs";
import { EditorRenameButton } from "@/feature/editor/components/header/rename-button";
import { EditorSaveButton } from "@/feature/editor/components/header/save-button";
import { MobileHeaderButtonsControls } from "./mobile-control";

export function EditorHeader({ workflowId }: { workflowId: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 divide-x divide-border border-b bg-background px-4">
      <SidebarTrigger />
      <EditorHeaderBreadcrumbs className="flex-1" workflowId={workflowId} />
      <EditorSaveButton className="hidden md:flex" workflowId={workflowId} />
      <EditorRenameButton className="hidden md:flex" workflowId={workflowId} />
      <MobileHeaderButtonsControls workflowId={workflowId} />
    </header>
  );
}
