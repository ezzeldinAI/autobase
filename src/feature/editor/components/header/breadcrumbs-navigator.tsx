"use client";

import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  PlusSquareIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { ROUTER_CONSTANTS } from "@/constants/router";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflow,
  useSuspenseWorkflows,
} from "@/feature/workflows/hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import type { Workflow } from "@/server/db/types";

export function EditorHeaderBreadcrumbsNavigator({
  workflowId,
}: {
  workflowId: string;
}) {
  const removeWorkflow = useRemoveWorkflow();
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  const workflows = useSuspenseWorkflows();
  const activeWorkflow = useSuspenseWorkflow(workflowId);
  const router = useRouter();
  const pathname = usePathname();

  function handleCreate() {
    createWorkflow.mutate(
      {},
      {
        onError: (error) => {
          handleError(error);
        },
      }
    );
  }

  function handleRemove({
    id,
    name,
  }: {
    id: Workflow["id"];
    name: Workflow["name"];
  }) {
    removeWorkflow.mutate(
      { id },
      {
        onSuccess: () => {
          const pathSegments = pathname.split("/").filter(Boolean);
          const activeWorkflowId =
            pathSegments[pathSegments.indexOf("workflows") + 1] || null;

          if (activeWorkflowId === id) {
            router.push(ROUTER_CONSTANTS.BASE);
          }
          toast.success(`Workflow "${name}" removed successfully`);
        },
        onError: (error) => {
          toast.error(`Failed to remove workflow: ${error.message}`);
        },
      }
    );
  }

  return (
    <>
      {modal}
      <BreadcrumbItem>
        <BreadcrumbPage>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              {activeWorkflow.data.name}
              <ChevronDownIcon className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {workflows.data.items.map((workflow) => {
                const isActiveWorkflow = workflow.id === workflowId;
                return (
                  <DropdownMenuSub key={workflow.id}>
                    <DropdownMenuSubTrigger>
                      {workflow.name}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {isActiveWorkflow ? null : (
                        <DropdownMenuItem asChild>
                          <Link
                            className="inert:opacity-50"
                            href={`/workflows/${workflow.id}`}
                          >
                            <span className="flex-1">Navigate to</span>
                            <ArrowUpRightIcon className="size-4" />
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        onClick={() =>
                          handleRemove({
                            id: workflow.id,
                            name: workflow.name,
                          })
                        }
                      >
                        <span className="flex flex-1 gap-2">Delete</span>
                        <Trash2Icon className="size-4" />
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                );
              })}
              <DropdownMenuItem onClick={handleCreate}>
                <span className="flex flex-1 gap-2">Create</span>
                <PlusSquareIcon className="size-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}
