import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginSchemaValues = z.infer<typeof loginSchema>;

export const loginResolver = zodResolver(loginSchema);

export const loginDefaultValues = {
  email: "",
  password: "",
} satisfies LoginSchemaValues;
