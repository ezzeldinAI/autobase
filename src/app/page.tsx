"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { visualErrorNotify, visualSuccessNotify } from "@/lib/utils";
import { useTRPC } from "@/server/trpc/client";
import { Logout } from "./logout";

export default function Home() {
  const trpc = useTRPC();

  const testAI = useMutation(
    trpc.testAI.mutationOptions({
      onSuccess: (data) => {
        visualSuccessNotify(data.message);
      },
      onError: (error) => {
        visualErrorNotify(error.message);
      },
    })
  );

  return (
    <section className="flex h-screen flex-col items-center justify-center bg-neutral-100 dark:bg-background">
      <h1 className="font-bold text-3xl">Protected Server Component</h1>
      <div className="mt-4 w-full max-w-[28vw] space-y-4">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <Button disabled={testAI.isPending} onClick={() => testAI.mutate()}>
            {testAI.isPending ? "Testing..." : "Test AI"}
          </Button>
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <Logout />
        </div>
      </div>
    </section>
  );
}
