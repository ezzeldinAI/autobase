import "server-only";

import { createTRPCClient, httpLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { getUrl } from "@/lib/utils";
import { createTRPCContext } from "@/server/trpc/init";
import { makeQueryClient } from "@/server/trpc/query-client";
import { appRouter } from "@/server/trpc/routers/_app";

export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

createTRPCOptionsProxy({
  client: createTRPCClient({
    links: [httpLink({ url: getUrl() })],
  }),
  queryClient: getQueryClient,
});

export const dal = appRouter.createCaller(createTRPCContext);
