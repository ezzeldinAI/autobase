import { useQueryStates } from "nuqs";
import { workflowsParams } from "@/feature/workflows/params";

export function useWorkflowsParams() {
  return useQueryStates(workflowsParams);
}
