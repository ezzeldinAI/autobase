"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { type ReactNode, useState } from "react";
import { BaseNode } from "@/components/react-flow/base-node";
import { NodeSelector } from "@/components/react-flow/node-selector";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
  onClick?: () => void;
};

export function PlaceholderNode({ children, onClick }: PlaceholderNodeProps) {
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);

  return (
    <NodeSelector onOpenChange={setSelectorOpen} open={selectorOpen}>
      <BaseNode
        className="h-auto w-auto cursor-pointer border-foreground-400 border-dashed p-4 text-center hover:border-solid"
        onClick={onClick}
      >
        {children}
        <Handle
          isConnectable={false}
          position={Position.Top}
          style={{ visibility: "hidden" }}
          type="target"
        />
        <Handle
          isConnectable={false}
          position={Position.Bottom}
          style={{ visibility: "hidden" }}
          type="source"
        />
      </BaseNode>
    </NodeSelector>
  );
}
