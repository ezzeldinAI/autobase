export const ROUTER_CONSTANTS = {
  BASE: "/workflows",
  AFTER_AUTHENTICATION: "/workflows",
  CREDENTIALS: "/credentials",
  EXECUTIONS: "/executions",
  LOGIN: "/login",
  // UPGRADE: "/upgrade",
} as const;

export type RouterPath =
  (typeof ROUTER_CONSTANTS)[keyof typeof ROUTER_CONSTANTS];
