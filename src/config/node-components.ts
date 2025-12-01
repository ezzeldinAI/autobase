import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/react-flow/initial-node";
import NodeType from "@/server/db/schema";

/*
 
   _   _           _             _____          _                   
  | \ | | ___   __| | ___  ___  |  ___|_ _  ___| |_ ___  _ __ _   _ 
  |  \| |/ _ \ / _` |/ _ \/ __| | |_ / _` |/ __| __/ _ \| '__| | | |
  | |\  | (_) | (_| |  __/\__ \ |  _| (_| | (__| || (_) | |  | |_| |
  |_| \_|\___/ \__,_|\___||___/ |_|  \__,_|\___|\__\___/|_|   \__, |
                                                              |___/ 
 
*/

export const nodeComponents: NodeTypes = {
  [NodeType.INITIAL]: InitialNode,
} as const;

export type RegisteredNodeType = keyof typeof nodeComponents;
