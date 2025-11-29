import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/server/trpc/server";

type prefetchWorkflowsInput = inferInput<typeof trpc.workflows.read.all>;
type prefetchWorkflowInput = inferInput<typeof trpc.workflows.read.one>;

/**
 * Prefetch all workflows
 */
export function prefetchWorkflows(params: prefetchWorkflowsInput) {
  prefetch(trpc.workflows.read.all.queryOptions(params));
}

/**
 * Prefetch single workflow
 */
export function prefetchWorkflow(params: prefetchWorkflowInput) {
  prefetch(trpc.workflows.read.one.queryOptions(params));
}
