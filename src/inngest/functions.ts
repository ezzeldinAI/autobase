import { db } from "@/lib/db";
import { workflowsTable } from "@/server/db/schema";
import { inngest } from "./client";
import { CONSTANTS } from "./const/events-id";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: CONSTANTS.BASE.event },
  async ({ event, step }) => {
    await step.sleep("wait-a-while", "10s");

    await step.run("create-workflow", async () => {
      await db.insert(workflowsTable).values({
        name: "New Workflow",
      });
      return {
        message: `User with Id ${event.data.userID} successfully created a new workflow!`,
      };
    });
  }
);
