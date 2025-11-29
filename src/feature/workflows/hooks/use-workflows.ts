import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useWorkflowsParams } from "@/feature/workflows/hooks/use-workflows-params";
import { visualErrorNotify, visualSuccessNotify } from "@/lib/utils";
import { useTRPC } from "@/server/trpc/client";

/**
 * Hook to fetch all workflows using suspense
 */
export function useSuspenseWorkflows() {
  const trpc = useTRPC();

  const [params] = useWorkflowsParams();

  return useSuspenseQuery(trpc.workflows.read.all.queryOptions(params));
}

/**
 * Hook to create a new workflow
 */
export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      // onSuccess: ({ data }) => {
      onSuccess: () => {
        // Note: the following is useful for default better UX experience (but might be a better developer practice to explicitly dictate the message to be visually displayed)
        // visualSuccessNotify(`Workflow "${data.name}" created successfully`);
        queryClient.invalidateQueries(trpc.workflows.read.all.queryOptions({}));
      },
      onError: (error) => {
        visualErrorNotify(`Failed to create workflow: ${error.message}`);
      },
    })
  );
}

/**
 * Hook to remove a workflow
 */
export function useRemoveWorkflow() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.workflows.read.all.queryOptions({}));
      },
      onError: (error) => {
        visualErrorNotify(`Failed to remove workflow: ${error.message}`);
      },
    })
  );
}

/**
 * Hook to fetch a single workflow using suspense
 */
export function useSuspenseWorkflow(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflows.read.one.queryOptions({ id }));
}

/**
 * Hook to update a workflow name
 */
export function useUpdateWorkflowName() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.update.name.mutationOptions({
      onSuccess: ({ data }) => {
        // Note: the following is useful for default better UX experience (but might be a better developer practice to explicitly dictate the message to be visually displayed)
        visualSuccessNotify(`Workflow "${data.name}" updated successfully`);
        queryClient.invalidateQueries(trpc.workflows.read.all.queryOptions({}));
      },
      onError: (error) => {
        visualErrorNotify(`Failed to update workflow: ${error.message}`);
      },
    })
  );
}
