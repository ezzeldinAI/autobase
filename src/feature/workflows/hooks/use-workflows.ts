import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTER_CONSTANTS } from "@/constants/router";
import { useWorkflowsParams } from "@/feature/workflows/hooks/use-workflows-params";
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
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: ({ workflow }) => {
        queryClient.invalidateQueries(trpc.workflows.read.all.queryOptions({}));
        toast.success(`Successfully created a ${workflow.name}`);
        router.push(`${ROUTER_CONSTANTS.BASE}/${workflow.id}`);
      },
      onError: (error) => {
        toast.error(`Failed to create workflow: ${error.message}`);
        console.error(error);
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
        toast.error(`Failed to remove workflow: ${error.message}`);
      },
    })
  );
}

/**
 * Hook to fetch a single workflow using suspense
 */
export function useSuspenseWorkflow(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.workflows.read.one.queryOptions({
      id,
      includeNodes: true,
      includeEdges: true,
    })
  );
}

/**
 * Hook to update a workflow name
 */
export function useUpdateWorkflowName() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.update.name.mutationOptions({
      onSuccess: ({ updatedWorkflow }) => {
        // Note: the following is useful for default better UX experience (but might be a better developer practice to explicitly dictate the message to be visually displayed)
        toast.success(
          `Workflow "${updatedWorkflow.name}" updated successfully`
        );
        queryClient.invalidateQueries(trpc.workflows.read.all.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to update workflow: ${error.message}`);
      },
    })
  );
}

/**
 * Hook to save workflow state (nodes and edges)
 */
export function useSaveWorkflow() {
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.update.state.mutationOptions({
      onSuccess: () => {
        // Optional: Add a subtle notification or just rely on UI state
        // visualSuccessNotify("Workflow saved");
      },
      onError: (error) => {
        toast.error(`Failed to save workflow: ${error.message}`);
      },
    })
  );
}
