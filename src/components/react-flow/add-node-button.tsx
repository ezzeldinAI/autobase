"use client";

import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { NodeSelector } from "@/components/react-flow/node-selector";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AddNodeButton = memo(({ className }: { className?: string }) => {
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);

  return (
    <NodeSelector
      onOpenChange={setSelectorOpen}
      open={selectorOpen}
      type="both"
    >
      <Button className={cn("", className)} size="icon-sm" variant="secondary">
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
