"use client";

import { ArrowUpRightIcon, ChevronDownIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSuspenseWorkflows } from "@/feature/workflows/hooks/use-workflows";

export function EditorHeaderBreadcrumbsNavigator({
  workflowId,
}: {
  workflowId: string;
}) {
  const workflows = useSuspenseWorkflows();
  const activeWorkflow = workflows.data.items.find(
    (workflow) => workflow.id === workflowId
  );

  return (
    <BreadcrumbItem>
      <BreadcrumbPage>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1">
            {activeWorkflow?.name}
            <ChevronDownIcon className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {workflows.data.items.map((workflow) => (
              <DropdownMenuSub key={workflow.id}>
                <DropdownMenuSubTrigger>{workflow.name}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem asChild>
                    <Link
                      className="inert:opacity-50"
                      href={`/workflows/${workflow.id}`}
                      inert={workflow.id === workflowId}
                    >
                      <span className="flex-1">Navigate to</span>
                      <ArrowUpRightIcon className="size-4" />
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <span className="flex flex-1 gap-2">
                      <span className="rounded-sm bg-foreground p-0.5 text-background text-xs">
                        TODO
                      </span>
                      Delete
                    </span>
                    <Trash2Icon className="size-4" />
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbPage>
    </BreadcrumbItem>
  );
}
