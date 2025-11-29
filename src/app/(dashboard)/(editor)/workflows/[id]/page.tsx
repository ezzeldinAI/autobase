import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  Editor,
  EditorError,
  EditorLoading,
} from "@/feature/editor/components/editor";
import { EditorHeader } from "@/feature/editor/components/header";
import { prefetchWorkflow } from "@/feature/workflows/server/prefetch";
import { HydrateClient } from "@/server/trpc/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WorkflowIdPage({ params }: Props) {
  const { id } = await params;
  prefetchWorkflow({ id });

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <EditorHeader workflowId={id} />
          <main className="flex-1">
            <Editor workflowId={id} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
