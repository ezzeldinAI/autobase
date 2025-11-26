"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { visualErrorNotify, visualSuccessNotify } from "@/lib/utils";
import { useTRPC } from "@/server/trpc/client";

export default function SubscriptionPage() {
  const trpc = useTRPC();
  const { mutate: testAI, isPending } = useMutation(
    trpc.testAI.mutationOptions({
      onSuccess: ({ message }) => {
        visualSuccessNotify(message);
      },
      onError: () => {
        visualErrorNotify("Failed to queue AI job");
      },
    })
  );

  return (
    <Button disabled={isPending} onClick={() => testAI()}>
      {isPending ? (
        <>
          <Spinner className="size-4" />
          <p className="ml-2 text-xs">Queueing...</p>
        </>
      ) : (
        "Queue AI"
      )}
    </Button>
  );
}
