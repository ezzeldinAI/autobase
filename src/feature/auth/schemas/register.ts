import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type RegisterSchemaValues = z.infer<typeof registerSchema>;

export const registerResolver = zodResolver(registerSchema);

export const registerDefaultValues = {
  name: "",
  email: "",
  password: "",
} satisfies RegisterSchemaValues;
