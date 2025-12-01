"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { CogIcon, Trash2Icon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";

type WorkflowNodeProps = PropsWithChildren & {
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
  // depending on future updates (near future update is adding an info button to give new users more context)
  // on....?: () => void
  name?: string;
  description?: string;
};

export function WorkflowNode({
  children,
  showToolbar = true,
  onDelete,
  onSettings,
  name,
  description,
}: WorkflowNodeProps) {
  return (
    <>
      {showToolbar ? (
        <NodeToolbar>
          <Button onClick={onSettings} size={"icon-sm"} variant={"ghost"}>
            <CogIcon className="size-4" />
          </Button>
          <Button onClick={onDelete} size={"icon-sm"} variant={"ghost"}>
            <Trash2Icon className="size-4" />
          </Button>
        </NodeToolbar>
      ) : null}
      {children}
      {name ? (
        <NodeToolbar
          className="max-w-[200px] text-center"
          isVisible
          position={Position.Bottom}
        >
          <p className="font-medium">{name}</p>
          {description ? (
            <p className="truncate text-muted-foreground text-xs">
              {description}
            </p>
          ) : null}
        </NodeToolbar>
      ) : null}
    </>
  );
}
