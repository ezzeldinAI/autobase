import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
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

function notify(msg: string, type: "success" | "error" | "warning" | "info") {
  switch (type) {
    case "success": {
      return toast.success(msg);
    }
    case "error": {
      return toast.error(msg);
    }
    case "warning": {
      return toast.warning(msg);
    }
    case "info": {
      return toast.info(msg);
    }
    default: {
      return toast(msg);
    }
  }
}

export function visualSuccessNotify(msg: string) {
  notify(msg, "success");
}

export function visualErrorNotify(msg: string) {
  notify(msg, "error");
}

export function visualWarningNotify(msg: string) {
  notify(msg, "warning");
}

export function visualInfoNotify(msg: string) {
  notify(msg, "info");
}
