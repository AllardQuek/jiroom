import type { Node, Edge } from "@xyflow/react";
import type { TopicContent } from "./guide-types";

export const PHASE_CONFIG = {
  explore: {
    label: "EXPLORE",
    emoji: "🔭",
    subtitle: "What to know before searching",
    color: "#3b82f6",
    x: 50,
  },
  evaluate: {
    label: "EVALUATE",
    emoji: "🔍",
    subtitle: "Vetting specific properties",
    color: "#f59e0b",
    x: 420,
  },
  execute: {
    label: "EXECUTE",
    emoji: "✍️",
    subtitle: "Making it official, informed",
    color: "#10b981",
    x: 790,
  },
} as const;

export const PHASE_IDS = Object.keys(PHASE_CONFIG) as Array<
  keyof typeof PHASE_CONFIG
>;

export function phaseHeaderId(phaseId: string) {
  return `phase-${phaseId}`;
}

export interface TopicDef {
  id: string;
  phaseId: keyof typeof PHASE_CONFIG;
  row: number;
  emoji: string;
  label: string;
  content: TopicContent;
}

const TOPICS: TopicDef[] = [
  {
    id: "budget",
    phaseId: "explore",
    row: 0,
    emoji: "💰",
    label: "How much to budget?",
    content: {
      bullets: [
        "Rough guide: SGD 850-1,200/mo common room, SGD 1,300+/mo master room (HDB). Condos cost more.",
        "Utilities depend on HDB/condo, household size, and AC usage — your biggest cost. Check [SP Services tariff](https://www.spgroup.com.sg/our-services/utilities/tariff-information) for rates.",
        "Security deposit: 1 month (1-yr lease) or 2 months (2-yr).",
        "Stamp duty: 0.4% of total rent. Calculate with [IRAS stamp duty calculator](https://mytax.iras.gov.sg/ESVWeb/default.aspx?target=MSDCalculatorIntro).",
        "Agent fee: landlord pays by default, unless you hire your own agent too.",
      ],
      tips: [],

    },
  },
  {
    id: "where-to-live",
    phaseId: "explore",
    row: 1,
    emoji: "📍",
    label: "Where to rent?",
    content: {
      bullets: [
        "Expo is on both the green (EW) and blue (DT) lines. Simei, Tampines, Pasir Ris, and Tanah Merah are your closest options.",
        "Tampines West, Tampines, Upper Changi, and Tampines East are on the blue line — direct train to Expo.",
      ],
      tips: [],

    },
  },
  {
    id: "platforms",
    phaseId: "explore",
    row: 2,
    emoji: "🔍",
    label: "Where to find listings?",
    content: {
      bullets: [],
      tips: [
        "Prepare a tenant profile to send to agents: occupation, nationality, move-in date, budget range, etc.",
      ],
      table: {
        headers: [
          "Platform",
          "Best For",
        ],
        rows: [
          ["[PropertyGuru](https://www.propertyguru.com.sg)", "Largest inventory of rooms and units; mostly agent-listed"],
          ["[99.co](https://www.99.co/singapore)", "**Map** and room search with MRT commute filtering; **floor plans** on most listings"],
          ["[Carousell](https://www.carousell.sg)", "Direct-owner rooms and budget-friendly deals"],
          ["[Facebook](https://www.facebook.com/marketplace/singapore/propertyrental)", "Room shares and sublets (harder to filter)"],
        ],
      },
    },
  },
  {
    id: "touring-checklist",
    phaseId: "evaluate",
    row: 0,
    emoji: "📋",
    label: "How to do viewings?",
    content: {
      notes: [
        "Allocate ~20min for the viewing. If it's a condo, add 10min before/after to check facilities (gym, pool) and access gates.",
        "Photos vs reality — agents sometimes mix photos of all rooms in a listing. That $900 room might really be the $1.2k one.",
        "Take video in addition to photos — it's much easier to revisit conditions realistically.",
      ],
      bullets: [
        "💧 Water pressure — turn on ALL taps, flush the toilet",
        "❄️ Aircon — does it blow cold? Does the remote work?",
        "📶 Signal — some HDBs have dead zones. Test every room.",
        "🧱 Partition walls or real walls? You'll hear everything through thin walls.",
        "📍 Check nearby amenities — supermarket, parks, late-night food options.",
        "🧺 Dryer included? Many HDBs don't have one.",
        "👤 Does the landlord live in? Utilities capped or shared?",
        "👥 Who's staying there? Fellow tenants' profile, landlord living in?",
      ],
      tips: [
        "Walk around the neighbourhood before or after the viewing — grab a meal at a nearby place to get a feel for the area. Try to picture what it might be like at different times of day.",
      ],
    },
  },
  {
    id: "verifying-everything",
    phaseId: "evaluate",
    row: 1,
    emoji: "✅",
    label: "What to verify?",
    content: {
      bullets: [
        "Agent — [CEA register](https://eservices.cea.gov.sg/aceas/public-register). Licensed? Any disciplinary record?",
        "Property — [INLIS](https://app.sla.gov.sg/inlis/) to confirm floor area and tenure.",
        "Listings — [URA Space](https://www.ura.gov.sg/maps). Past prices? Upcoming construction?",
        "LOI vs TA — LOI is non-binding intent with a good-faith deposit; TA is the binding contract. LOI can be skipped for smaller/room rentals.",
      ],
      tips: [],
    },
  },
  {
    id: "understanding-ta",
    phaseId: "execute",
    row: 0,
    emoji: "📝",
    label: "What's in the lease?",
    content: {
      bullets: [
        "Early termination — don't assume a fixed penalty. Check what the TA says.",
        "Repair cap — usually $150–200 per incident if the TA has one.",
        "AC servicing — often required every 3 months. Keep every receipt.",
        "Notice period — typically 1–2 months. Your TA controls this.",
      ],
      tips: [
        "Try negotiating: ~$50 off rent, shorter lease (6mo vs 12mo), earlier move-in, or utilities included.",
      ],
    },
  },
  {
    id: "option-to-handover",
    phaseId: "execute",
    row: 1,
    emoji: "🔑",
    label: "How to move in?",
    content: {
      bullets: [
        "First month's rent — due at signing or move-in. Check the TA.",
        "Booking deposit — get refund and forfeiture terms in writing.",
        "TA signing — both parties sign.",
        "Handover walkthrough — inventory list, photograph EVERYTHING.",
      ],
      tips: [
        "Take a video walkthrough and upload it somewhere safe. You'll thank yourself later.",
      ],
    },
  },
];

function topicId(id: string) {
  return `topic-${id}`;
}

export const ROW_HEIGHT = 220;
export const PHASE_HEADER_HEIGHT = 90;

export const BASELINE_POSITIONS: Record<string, { x: number; y: number }> = {};

const PHASE_HEADER_NODES: Node[] = PHASE_IDS.map((id) => ({
  id: phaseHeaderId(id),
  type: "phaseHeader",
  position: {
    x: PHASE_CONFIG[id].x + 10,
    y: 20,
  },
  data: {
    label: `${PHASE_CONFIG[id].emoji}  ${PHASE_CONFIG[id].label}`,
    emoji: PHASE_CONFIG[id].emoji,
    phaseId: id,
    subtitle: PHASE_CONFIG[id].subtitle,
  },
  style: { width: 340 },
  draggable: false,
  selectable: false,
}));

const LANE_NODES: Node[] = PHASE_IDS.map((id) => {
  const col = PHASE_CONFIG[id];
  const maxRows = Math.max(
    ...TOPICS.filter((t) => t.phaseId === id).map((t) => t.row),
    0,
  );
  const laneHeight = PHASE_HEADER_HEIGHT + 20 + (maxRows + 1) * ROW_HEIGHT + 60;
  return {
    id: `lane-${id}`,
    type: "phaseLane",
    position: { x: col.x, y: 10 },
    data: {
      color: col.color,
      phaseId: id,
      label: "",
      emoji: "",
    },
    style: {
      width: 360,
      height: laneHeight,
    },
    draggable: false,
    selectable: false,
  };
});

export const INITIAL_NODES: Node[] = [
  ...LANE_NODES,
  ...PHASE_HEADER_NODES,
  ...TOPICS.map((t) => {
    const phase = PHASE_CONFIG[t.phaseId];
    const pos = {
      x: phase.x + 35,
      y: PHASE_HEADER_HEIGHT + 20 + t.row * ROW_HEIGHT,
    };
    const id = topicId(t.id);
    BASELINE_POSITIONS[id] = pos;
    return {
      id,
      type: "topic",
      position: { ...pos },
      data: {
        label: t.label,
        emoji: t.emoji,
        content: t.content,
        expanded: false,
        highlighted: false,
        phaseId: t.phaseId,
        row: t.row,
      },
      draggable: false,
    };
  }),
];

const EDGE_DEFS: [string, string][] = [
  ["budget", "where-to-live"],
  ["where-to-live", "platforms"],
  ["platforms", "touring-checklist"],
  ["touring-checklist", "verifying-everything"],
  ["verifying-everything", "understanding-ta"],
  ["understanding-ta", "option-to-handover"],

];

export const INITIAL_EDGES: Edge[] = EDGE_DEFS.map(([from, to]) => ({
  id: `edge-${from}-${to}`,
  source: topicId(from),
  target: topicId(to),
  style: { stroke: "var(--border)", strokeWidth: 2, opacity: 0.5 },
  animated: false,
}));

export function getNodeId(topicIdStr: string) {
  return `topic-${topicIdStr}`;
}
