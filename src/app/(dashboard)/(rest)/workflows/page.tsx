import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  WorkflowContainer,
  WorkflowError,
  WorkflowLoading,
  WorkflowsList,
} from "@/feature/workflows/components/workflows";
import { workflowsParamsLoader } from "@/feature/workflows/server/params-loader";
import { prefetchWorkflows } from "@/feature/workflows/server/prefetch";
import { HydrateClient } from "@/server/trpc/server";

type WorkflowsPageProps = {
  searchParams: Promise<SearchParams>;
};
export default async function WorkflowsPage(props: WorkflowsPageProps) {
  const params = await workflowsParamsLoader(props.searchParams); // Note: don't use this in the future as some sort of validator
  await prefetchWorkflows(params);

  return (
    <WorkflowContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowError />}>
          <Suspense fallback={<WorkflowLoading />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowContainer>
  );
}
