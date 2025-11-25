import { db } from "@/lib/db";
import { usersTable } from "@/server/db/schema";

export default async function Home() {
  const users = await db.select().from(usersTable);

  return (
    <section className="flex min-h-screen items-center justify-center bg-neutral-100 dark:bg-background">
      {JSON.stringify(users)}
    </section>
  );
}
