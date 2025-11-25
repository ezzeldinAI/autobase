import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") {
      return "";
    }

    if (process.env.NODE_ENV === "production" && process.env.DOMAIN) {
      return `https://${process.env.DOMAIN}`;
    }
    return "http://localhost:3000";
  })();
  return `${base}/api/trpc`;
}
