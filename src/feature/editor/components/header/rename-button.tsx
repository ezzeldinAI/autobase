"use client";

import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useSuspenseWorkflow,
  useUpdateWorkflowName,
} from "@/feature/workflows/hooks/use-workflows";
import { cn } from "@/lib/utils";

export function EditorRenameButton({
  workflowId,
  className,
}: {
  workflowId: string;
  className?: string;
}) {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const renameWorkflow = useUpdateWorkflowName();

  const router = useRouter();

  const [name, setName] = useState(workflow.name);

  async function handleRename() {
    try {
      await renameWorkflow.mutateAsync(
        {
          id: workflowId,
          name,
        },
        {
          onSuccess: () => {
            router.refresh();
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn("", className)}
          disabled={false}
          onClick={() => {
            console.log(`save workflow with id ${workflowId}`);
          }}
          size="sm"
          variant="outline"
        >
          <PencilIcon className="size-4" />
          Rename
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Workflow</DialogTitle>
          <DialogDescription>
            Rename your workflow to something more meaningful.
          </DialogDescription>
        </DialogHeader>
        <Input
          onChange={(e) => setName(e.target.value)}
          placeholder={workflow.name}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleRename}>Rename</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
