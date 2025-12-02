"use client";

import type { NodeProps } from "@xyflow/react";
import { MousePointerClickIcon } from "lucide-react";
import { memo } from "react";
import { BaseTriggerNode } from "@/feature/triggers/components/base-trigger-node";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <>
      {/* ... */}
      <BaseTriggerNode
        {...props}
        icon={MousePointerClickIcon}
        id={props.id}
        name="When clicking 'Execute workflow'"
        // status={nodeStatus}
        // onSettings={handleOpenSettings}
        // onDoubleClick={handleOpenSettings}
      />
    </>
  );
});
