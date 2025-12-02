"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import type React from "react";
import { useCallback } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NodeType } from "@/server/db/schema";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description:
      "Runs the flow on clicking a button. Good for getting started quickly",
    icon: MousePointerIcon,
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an HTTP request",
    icon: GlobeIcon,
  },
];

type NodeSelectorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  type?: "triggers" | "executions" | "both";
};

export function NodeSelector({
  children,
  open,
  onOpenChange,
  type = "triggers",
}: NodeSelectorProps) {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      const selectedManualTrigger = selection.type === NodeType.MANUAL_TRIGGER; // helper var to store the condition of when should a selection node be considered a manual node

      if (selectedManualTrigger) {
        const nodes = getNodes();
        // 1. Store in a var if there's a manual trigger node already or not
        const hasManualTrigger = nodes.some(
          (existing_node) => existing_node.type === NodeType.MANUAL_TRIGGER
        );

        // 2. If there's already a manual trigger, notify the user that only one manual trigger per workflow is allowed then break out of the func
        if (hasManualTrigger) {
          toast.error("Only one manual trigger is allowed per workflow");
          return;
        }
      }

      // 3. Spawn in the selected node
      setNodes((nodes) => {
        // Store the value that tells us if this is the very first trigger node in this specific workflow
        const hasInitialTrigger = nodes.some(
          (existing_node) => existing_node.type === NodeType.INITIAL
        );

        // The following lines are to spawn in the new node in exactly the center of where the user is currently looking at
        // without this, the user would always be forced to scroll back to the center of the editor (not where he's currently looking) itself to find the new spawned node

        // stores the x & y values of the current viewport using vanilla browser api
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // takes the previously obtained coords and converts it to coords the editor can understand
        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        // helper var that stores the new node to spawn
        const newNode = {
          id: createId(),
          data: {}, // modify this if you find, through telemetry data you collect, a pattern/preference users usually end up repeatedly setting up (to enhance UX)
          position: flowPosition,
          type: selection.type,
        };

        // if has initial trigger return the new node
        if (hasInitialTrigger) {
          return [newNode];
        }

        // else just pass things back to the consumer
        return [...nodes, newNode];
      });

      onOpenChange(false);
    },
    [setNodes, getNodes, onOpenChange, screenToFlowPosition]
  );

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md" side="right">
        <SheetHeader>
          <SheetTitle>
            {type === "both"
              ? "Can't add new nodes?"
              : type === "triggers"
                ? "What triggers this workflow?"
                : "What actions should happen in this workflow"}{" "}
          </SheetTitle>
          <SheetDescription>
            {type === "both"
              ? "Add any new node."
              : type === "triggers"
                ? "A trigger is a node that starts your workflow."
                : "A action is a node that takes action in your workflow, each node and it's action type"}
          </SheetDescription>
        </SheetHeader>

        {type === "both" ? (
          <>
            {/* Trigger Node Section Begins Here */}
            <SheetTitle className="mx-4 font-medium text-muted-foreground text-sm">
              Trigger Nodes
            </SheetTitle>
            <div>
              {triggerNodes.map((node) => {
                const Icon = node.icon;

                return (
                  <div
                    className="h-auto w-full cursor-pointer justify-start rounded-none border-transparent border-l-2 px-4 py-5 hover:border-l-primary"
                    key={node.type}
                    onClick={() => handleNodeSelect(node)}
                  >
                    <div className="flex w-full items-center gap-6 overflow-hidden">
                      {typeof Icon === "string" ? (
                        <img
                          alt={node.label}
                          className="size-5 rounded-sm object-contain"
                          src={Icon}
                        />
                      ) : (
                        <Icon />
                      )}
                      <div className="flex flex-col items-start gap-1 text-left">
                        <span className="font-medium text-sm">
                          {node.label}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {node.description}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Trigger Node Section Ends Here */}
            <Separator />

            {/* Execution Node Section Begins Here */}
            <SheetTitle className="mx-4 font-medium text-muted-foreground text-sm">
              Action Nodes
            </SheetTitle>
            
            <div>
              {executionNodes.map((node) => {
                const Icon = node.icon;

                return (
                  <div
                    className="h-auto w-full cursor-pointer justify-start rounded-none border-transparent border-l-2 px-4 py-5 hover:border-l-primary"
                    key={node.type}
                    onClick={() => handleNodeSelect(node)}
                  >
                    <div className="flex w-full items-center gap-6 overflow-hidden">
                      {typeof Icon === "string" ? (
                        <img
                          alt={node.label}
                          className="size-5 rounded-sm object-contain"
                          src={Icon}
                        />
                      ) : (
                        <Icon />
                      )}
                      <div className="flex flex-col items-start gap-1 text-left">
                        <span className="font-medium text-sm">{node.label}</span>
                        <span className="text-muted-foreground text-xs">
                          {node.description}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Execution Node Section Ends Here */}
            
          </>
        ) : type === "triggers" ? (
          <>
            {/* Trigger Node Section Begins Here */}
            <SheetTitle className="mx-4 font-medium text-muted-foreground text-sm">
              Trigger Nodes
            </SheetTitle>
            <div>
              {triggerNodes.map((node) => {
                const Icon = node.icon;

                return (
                  <div
                    className="h-auto w-full cursor-pointer justify-start rounded-none border-transparent border-l-2 px-4 py-5 hover:border-l-primary"
                    key={node.type}
                    onClick={() => handleNodeSelect(node)}
                  >
                    <div className="flex w-full items-center gap-6 overflow-hidden">
                      {typeof Icon === "string" ? (
                        <img
                          alt={node.label}
                          className="size-5 rounded-sm object-contain"
                          src={Icon}
                        />
                      ) : (
                        <Icon />
                      )}
                      <div className="flex flex-col items-start gap-1 text-left">
                        <span className="font-medium text-sm">
                          {node.label}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {node.description}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Trigger Node Section Ends Here */}
          </>
        ) : (
          <>
            <SheetTitle className="mx-4 font-medium text-muted-foreground text-sm">
        Action Nodes
      </SheetTitle>
      <div>
        {executionNodes.map((node) => {
          const Icon = node.icon;

          return (
            <div
              className="h-auto w-full cursor-pointer justify-start rounded-none border-transparent border-l-2 px-4 py-5 hover:border-l-primary"
              key={node.type}
              onClick={() => handleNodeSelect(node)}
            >
              <div className="flex w-full items-center gap-6 overflow-hidden">
                {typeof Icon === "string" ? (
                  <img
                    alt={node.label}
                    className="size-5 rounded-sm object-contain"
                    src={Icon}
                  />
                ) : (
                  <Icon />
                )}
                <div className="flex flex-col items-start gap-1 text-left">
                  <span className="font-medium text-sm">{node.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {node.description}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}