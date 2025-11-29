"use client";

import { SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EditorSaveButton({ workflowId }: { workflowId: string }) {
  return (
    <Button
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
