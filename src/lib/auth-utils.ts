import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTER_CONSTANTS } from "@/constants/router";
import { auth } from "@/lib/auth";

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireUnauth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(ROUTER_CONSTANTS.BASE);
  }

  return session;
}
