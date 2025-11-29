import { ChevronsRightIcon } from "lucide-react";
import Link from "next/link";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTER_CONSTANTS } from "@/constants/router";
import { cn } from "@/lib/utils";
import { EditorHeaderBreadcrumbsNavigator } from "./breadcrumbs-navigator";

export function EditorHeaderBreadcrumbs({
  workflowId,
  className,
}: {
  workflowId: string;
  className?: string;
}) {
  return (
    <BreadcrumbList
      className={cn("flex w-full flex-row items-center gap-x-4", className)}
    >
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={ROUTER_CONSTANTS.BASE} prefetch>
            Workflows
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <ChevronsRightIcon className="size-4" />
      </BreadcrumbSeparator>

      <EditorHeaderBreadcrumbsNavigator workflowId={workflowId} />
    </BreadcrumbList>
  );
}
