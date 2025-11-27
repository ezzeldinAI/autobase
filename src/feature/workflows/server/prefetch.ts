import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/server/trpc/server";

type Input = inferInput<typeof trpc.workflows.read.all>;

/**
 * Prefetch all workflows
 */
export function prefetchWorkflows(params: Input) {
  prefetch(trpc.workflows.read.all.queryOptions(params));
}
