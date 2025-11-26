"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function Logout() {
  return (
    <Button
      className="w-full"
      onClick={() => authClient.signOut()}
      variant={"ghost"}
    >
      Logout
    </Button>
  );
}
