import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EditorRenameButton } from "@/feature/editor/components/header/rename-button";
import { EditorSaveButton } from "@/feature/editor/components/header/save-button";

export function MobileHeaderButtonsControls({
  workflowId,
}: {
  workflowId: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="ml-auto flex md:hidden"
          size={"icon-sm"}
          variant={"outline"}
        >
          <MenuIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="flex flex-col justify-between">
          <SheetTitle>Controls</SheetTitle>
          <SheetDescription>
            Execute operations on this specific workflow
          </SheetDescription>
        </SheetHeader>

        <div className="mx-2 flex-1 space-y-4 bg-foreground/5 p-4">
          <EditorSaveButton className="w-full" workflowId={workflowId} />
          <EditorRenameButton className="w-full" workflowId={workflowId} />
        </div>

        <SheetFooter>
          <SheetClose>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
