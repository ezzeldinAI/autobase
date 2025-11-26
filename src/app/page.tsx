"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { visualErrorNotify, visualSuccessNotify } from "@/lib/utils";
import { useTRPC } from "@/server/trpc/client";
import { Logout } from "./logout";

export default function Home() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(
    trpc.users.getAllWorkflows.queryOptions()
  );

  const create = useMutation(
    trpc.users.createWorkflow.mutationOptions({
      onSuccess: (res) => {
        queryClient.invalidateQueries(
          trpc.users.getAllWorkflows.queryOptions()
        );
        visualSuccessNotify(
          res.success ? res.message : "Failed to create workflow"
        );
      },
      onError: () => {
        visualErrorNotify("Failed to create workflow");
      },
    })
  );

  return (
    <section className="flex h-screen flex-col items-center justify-center bg-neutral-100 dark:bg-background">
      <h1 className="font-bold text-3xl">Protected Server Component</h1>
      <div className="mt-4 w-full max-w-[28vw] space-y-4">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          {isLoading ? (
            <Spinner className="size-4" />
          ) : (
            <pre className="">{JSON.stringify(data, null, 2)}</pre>
          )}
          <Button disabled={create.isPending} onClick={() => create.mutate()}>
            {create.isPending ? "Creating..." : "Create Workflow"}
          </Button>
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <Logout />
        </div>
      </div>
    </section>
  );
}
