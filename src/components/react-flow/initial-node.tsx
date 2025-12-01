"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo } from "react";
import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { WorkflowNode } from "@/components/workflow-node";

export const InitialNode = memo((props: NodeProps) => (
  <WorkflowNode showToolbar={false}>
    <PlaceholderNode
      {...props}
      // onClick={() => {}}
    >
      <div className="flex cursor-pointer items-center justify-center">
        <PlusIcon className="size-4" />
      </div>
    </PlaceholderNode>
  </WorkflowNode>
));

InitialNode.displayName = "InitialNode";
