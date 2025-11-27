import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Spinner } from "@/components/ui/spinner";
import {
  WorkflowContainer,
  WorkflowsList,
} from "@/feature/workflows/components/workflows";
import { prefetchWorkflows } from "@/feature/workflows/server/prefetch";
import { HydrateClient } from "@/server/trpc/server";

export default async function WorkflowsPage() {
  await prefetchWorkflows();

  return (
    <WorkflowContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<div>Error!</div>}>
          <Suspense fallback={<Spinner className="size-4" />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowContainer>
  );
}
