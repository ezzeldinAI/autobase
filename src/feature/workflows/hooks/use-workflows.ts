import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { visualErrorNotify, visualSuccessNotify } from "@/lib/utils";
import { useTRPC } from "@/server/trpc/client";

/**
 * Hook to fetch all workflows using suspense
 */
export function useSuspenseWorkflows() {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.workflows.read.all.queryOptions()).data;
}

/**
 * Hook to create a new workflow
 */
export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: ({ data }) => {
        visualSuccessNotify(`Workflow "${data.name}" created successfully`);
        queryClient.invalidateQueries(trpc.workflows.read.all.queryOptions());
      },
      onError: (error) => {
        visualErrorNotify(`Failed to create workflow: ${error.message}`);
      },
    })
  );
}
