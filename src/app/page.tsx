import { requireAuth } from "@/lib/auth-utils";
import { dal } from "@/server/trpc/server";
import { Logout } from "./logout";

export default async function Home() {
  await requireAuth(); // just for better UX
  const data = await dal.users.getAll();

  return (
    <section className="flex h-screen flex-col items-center justify-center bg-neutral-100 dark:bg-background">
      <h1 className="font-bold text-3xl">Protected Server Component</h1>
      <div className="mt-4 space-y-4">
        <pre className="">{JSON.stringify(data, null, 2)}</pre>
        <div className="flex w-full items-center justify-center gap-2">
          <Logout />
        </div>
      </div>
    </section>
  );
}
