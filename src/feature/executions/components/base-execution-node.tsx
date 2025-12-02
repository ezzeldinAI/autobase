"use client";

import { type NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type { PropsWithChildren } from "react";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { WorkflowNode } from "@/components/workflow-node";

type BaseExecutionNodeProps = NodeProps &
  PropsWithChildren & {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    onSettings?: () => void;
    // status?: NodeStatus
    onDoubleClick?: () => void;
  };

export function BaseExecutionNode({
  children,
  icon: Icon,
  name,
  description,
  onSettings,
  onDoubleClick,
}: BaseExecutionNodeProps) {
  // TODO: add delete functionality
  function handleDelete() {
    console.log("Hola Mundo");
  }

  return (
    // TODO: Wrap within NodeStatusIndicator
    <WorkflowNode
      description={description}
      name={name}
      onDelete={handleDelete}
      onSettings={onSettings}
    >
      <BaseNode onDoubleClick={onDoubleClick}>
        <BaseNodeContent>
          {typeof Icon === "string" ? (
            <Image alt={name} height={16} src={Icon} width={16} />
          ) : (
            <Icon className="size-4 text-muted-foreground" />
          )}
          {children}
          <BaseHandle id="target-1" position={Position.Left} type="target" />

          <BaseHandle id="source-1" position={Position.Right} type="source" />
        </BaseNodeContent>
      </BaseNode>
    </WorkflowNode>
  );
}
