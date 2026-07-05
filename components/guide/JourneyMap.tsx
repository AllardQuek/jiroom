"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { TopicNode } from "./nodes/TopicNode";
import { PhaseHeaderNode } from "./nodes/PhaseHeaderNode";
import { PhaseLaneNode } from "./nodes/PhaseLaneNode";
import { BASELINE_POSITIONS } from "@/data/guide-content";
import {
  MeasuredHeightContext,
  type MeasuredHeightMap,
} from "./HeightContext";
import {
  COLLAPSED_NODE_HEIGHT,
  estimateExpandedNodeHeight,
  type GuideNodeData,
} from "@/data/guide-types";

const nodeTypes = {
  topic: TopicNode,
  phaseHeader: PhaseHeaderNode,
  phaseLane: PhaseLaneNode,
};

interface JourneyMapProps {
  nodes: Node[];
  edges: Edge[];
  expandedNodeIds: Set<string>;
  onNodeClick: (nodeId: string) => void;
}

function computeLayout(
  nodes: Node[],
  expandedNodeIds: Set<string>,
  measuredHeights: MeasuredHeightMap
): Node[] {
  try {
    const cols = new Map<string, { node: Node; row: number }[]>();
    const result: Node[] = [];

    for (const node of nodes) {
      if (node.type !== "topic") {
        result.push(node);
        continue;
      }
      const d = node.data as GuideNodeData;
      const phaseId = d.phaseId;
      if (phaseId) {
        const col = cols.get(phaseId) ?? [];
        col.push({ node, row: d.row ?? 0 });
        cols.set(phaseId, col);
      }
    }

    const shifts = new Map<string, number>();
    const verticalGap = 24;

    for (const [, items] of cols) {
      items.sort((a, b) => a.row - b.row);
      let nextY: number | null = null;
      for (const item of items) {
        const base = BASELINE_POSITIONS[item.node.id];
        const baseY = base?.y ?? item.node.position.y;
        const estimateH = estimateExpandedNodeHeight(
          (item.node.data as GuideNodeData).content
        );
        const displayedHeight = expandedNodeIds.has(item.node.id)
          ? (measuredHeights.get(item.node.id) ?? estimateH)
          : COLLAPSED_NODE_HEIGHT;
        const desiredY: number =
          nextY === null ? baseY : Math.max(baseY, nextY);
        shifts.set(item.node.id, desiredY - baseY);
        nextY = desiredY + displayedHeight + verticalGap;
      }
    }

    const maxBottomByPhase = new Map<string, number>();

    for (const node of nodes) {
      if (node.type !== "topic") continue;
      const shift = shifts.get(node.id) ?? 0;
      const base = BASELINE_POSITIONS[node.id];
      const d = node.data as GuideNodeData;
      const displayedHeight = expandedNodeIds.has(node.id)
        ? (measuredHeights.get(node.id) ??
            estimateExpandedNodeHeight(d.content))
        : COLLAPSED_NODE_HEIGHT;
      const y = (base?.y ?? node.position.y) + shift;
      const bottom = y + displayedHeight;
      if (d.phaseId) {
        const current = maxBottomByPhase.get(d.phaseId) ?? 0;
        if (bottom > current) maxBottomByPhase.set(d.phaseId, bottom);
      }
      result.push({
        ...node,
        width: expandedNodeIds.has(node.id) ? 290 : 280,
        height: displayedHeight,
        position: {
          x: base?.x ?? node.position.x,
          y,
        },
        data: {
          ...d,
          expanded: expandedNodeIds.has(node.id),
        },
      });
    }

    for (let i = 0; i < result.length; i++) {
      const node = result[i];
      if (node.type !== "phaseLane") continue;
      const d = node.data as GuideNodeData;
      const phaseId = d.phaseId;
      if (phaseId) {
        const maxBottom = maxBottomByPhase.get(phaseId);
        if (maxBottom) {
          result[i] = {
            ...node,
            style: {
              ...(node.style as Record<string, unknown>),
              height: maxBottom - node.position.y + 40,
            },
          };
        }
      }
    }

    return result;
  } catch {
    return nodes;
  }
}

function FlowInner({
  nodes,
  edges,
  expandedNodeIds,
  onNodeClick,
}: JourneyMapProps) {
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === "topic") {
        onNodeClick(node.id);
      }
    },
    [onNodeClick]
  );

  const measuredHeights = useRef<MeasuredHeightMap>(new Map());
  const [measureKey, setMeasureKey] = useState(0);

  const reportHeight = useCallback((nodeId: string, totalHeight: number) => {
    const prev = measuredHeights.current.get(nodeId);
    if (prev !== totalHeight) {
      measuredHeights.current.set(nodeId, totalHeight);
      setMeasureKey((k) => k + 1);
    }
  }, []);

  const displayNodes = useMemo(
    () =>
      computeLayout(
        nodes,
        expandedNodeIds,
        measuredHeights.current
      ),
    [nodes, expandedNodeIds, measureKey]
  );

  const { fitView } = useReactFlow();

  useEffect(() => {
    fitView({ duration: 0, padding: 0.15 });
  }, [fitView]);

  const defaultViewport = { x: 0, y: 0, zoom: 0.72 };

  return (
    <MeasuredHeightContext.Provider value={{ reportHeight }}>
      <ReactFlow
        nodes={displayNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        minZoom={0.3}
        maxZoom={2}
        fitView={false}
        panOnDrag
        selectionOnDrag={false}
        panOnScroll={false}
        zoomOnScroll
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        onNodeClick={handleNodeClick}
        noPanClassName="guide-scrollable"
        noWheelClassName="guide-scrollable"
        className="guide-flow"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="var(--border)"
        />
        <Controls
          position="top-left"
          showInteractive={false}
          className="!bg-card !border-border/40 !rounded-lg !shadow-panel"
        />
      </ReactFlow>
    </MeasuredHeightContext.Provider>
  );
}

export function JourneyMap(props: JourneyMapProps) {
  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <FlowInner {...props} />
      </ReactFlowProvider>
    </div>
  );
}
