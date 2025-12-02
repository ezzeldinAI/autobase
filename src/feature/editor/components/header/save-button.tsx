"use client";

import { SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EditorSaveButton({
  workflowId,
  className,
}: {
  workflowId: string;
  className?: string;
}) {
  return (
    <Button
      className={cn("", className)}
      disabled={false}
      onClick={() => {
        console.log(`save workflow with id ${workflowId}`);
      }}
      size="sm"
      variant="outline"
    >
      <SaveIcon className="size-4" />
      Save
    </Button>
  );
}
