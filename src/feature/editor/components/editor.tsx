"use client";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  type ColorMode,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  MiniMap,
  type Node,
  type NodeChange,
  Panel,
  ReactFlow,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/feature/workflows/hooks/use-workflows";
import "@xyflow/react/dist/style.css";
import { MoonIcon, SunIcon } from "lucide-react";
import { AddNodeButton } from "@/components/react-flow/add-node-button";
import { Button } from "@/components/ui/button";
import { nodeComponents } from "@/config/node-components";

export function EditorLoading() {
  return <LoadingView message="Loading editor..." />;
}

export function EditorError() {
  return <ErrorView message="Editor loading editor" />;
}

export function Editor({ workflowId }: { workflowId: string }) {
  const { data } = useSuspenseWorkflow(workflowId);

  const [nodes, setNodes] = useState<Node[]>(data.nodes as Node[]);
  const [edges, setEdges] = useState<Edge[]>(data.edges as Edge[]);
  const [colorMode, setColorMode] = useState<ColorMode>("light");

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  function toggleEditorTheme() {
    if (colorMode !== "light") {
      setColorMode("light");
    } else {
      setColorMode("dark");
    }
  }

  return (
    <div style={{ width: "94vw", height: "94vh", position: "relative" }}>
      <ReactFlow
        colorMode={colorMode}
        edges={edges}
        fitView
        nodes={nodes}
        nodeTypes={nodeComponents}
        onConnect={onConnect}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel className="flex flex-col gap-4" position="top-right">
          <AddNodeButton />
          <Button
            onClick={toggleEditorTheme}
            size={"icon-sm"}
            variant={"secondary"}
          >
            {colorMode === "light" ? (
              <MoonIcon className="size-4" />
            ) : (
              <SunIcon className="size-4" />
            )}
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
