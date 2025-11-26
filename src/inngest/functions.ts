import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { inngest } from "./client";
import { CONSTANTS } from "./const/events-id";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const askAI = inngest.createFunction(
  { id: CONSTANTS.AI.id },
  { event: CONSTANTS.AI.event },
  async ({ step }) => {
    await step.sleep("sleep-for-5s", 5000);

    const { steps: geniniSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant.",
        prompt: "What's 2 + 2?",
      }
    );

    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openai("gpt-4"),
        system: "You are a helpful assistant.",
        prompt: "What's 2 + 2?",
      }
    );

    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic("claude-sonnet-4-5"),
        system: "You are a helpful assistant.",
        prompt: "What's 2 + 2?",
      }
    );

    return {
      geniniSteps,
      openaiSteps,
      anthropicSteps,
    };
  }
);
