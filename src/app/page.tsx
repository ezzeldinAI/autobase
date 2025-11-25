import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { trpc } from "@/server/trpc/server";
import { Client } from "./client";

export default async function Home() {
  const queryClient = new QueryClient();

  // biome-ignore lint/complexity/noVoid: prefetching data is not a side effect
  void queryClient.prefetchQuery(trpc.users.getAll.queryOptions());

  return (
    <section className="flex h-screen items-center justify-center bg-neutral-100 dark:bg-background">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense
          fallback={<p className="text-muted-foreground text-xs">Loading...</p>}
        >
          <Client />
        </Suspense>
      </HydrationBoundary>
    </section>
  );
}
