import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";

export const createTRPCContext = cache(() => ({ userId: "user_123" }));

export const t = initTRPC.create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: {
      ...ctx,
      auth: session,
    },
  });
});

export const premiumProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    const hasActiveSubscription = customer.activeSubscriptions.length > 0;

    if (!hasActiveSubscription) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Active Subscription required",
      });
    }

    return next({
      ctx: {
        ...ctx,
        customer,
      },
    });
  }
);

// TODO Add Sentry Monitoring, Tracing, Breadcrumbs, and Metering to have a Bird's eye view of everything
// also include the userId to and useful contextual data for better debuggability
