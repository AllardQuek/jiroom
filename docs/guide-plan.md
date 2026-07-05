# SG Rental Guide — Planning Document

> Created: 2026-07-05
> Branch: `feature/sg-rental-guide`

## Goal

An interactive, web-based journey map that helps foreign colleagues understand Singapore's rental property landscape. Built as a new route (`/guide`) within the existing JIRoom Next.js app.

## Target Audience

Foreign professionals new to Singapore who need a practical, visual guide to renting — from budgeting and platform selection through TA signing and moving in.

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Narrative framing** | EXPLORE → EVALUATE → EXECUTE | Reference point is signing the TA. Every topic is a decision input. "Before-During-After" was ambiguous — too easy to misinterpret "before/after what?" |
| **Interaction model** | Hybrid: inline expandable cards (free exploration) + zoom transitions (guided tour) | Free exploration is primary (colleagues want to jump to what matters to them); guided tour is opt-in for those who want a walkthrough. Both share the same graph. |
| **Graph library** | `@xyflow/react` (react-flow v12) | Mature, well-supported, built-in zoom/pan/minimap, custom React node support, programmatic `fitView()` for tour mode. |
| **Animation** | `framer-motion` | Smooth zoom-transitions for guided tour steps. Already a common pairing with react-flow. |
| **Location** | `app/[locale]/guide/` in existing Next.js app | Leverages existing i18n, theming, component library, and deployment. Single codebase, users don't need a separate URL. |
| **i18n** | Existing `next-intl` setup | English first; Chinese (zh-CN) later. Content stored in message files. |

## Content Architecture

### EXPLORE — Market knowledge before you start searching

| # | Node | Key Content | 🔗 References |
|---|---|---|---|
| 1 | 💰 Budget & Costs | Live market rents by room type; security deposit; stamp duty formula; renter-side agent fee usually not applicable; utility costs vary with AC use and plan choice | IRAS tenancy agreement page, SP Services tariff page |
| 2 | 📍 Where to Live | CCR (CBD/Orchard/Sentosa), RCR (Queenstown/Kallang), OCR (Tampines/Woodlands); MRT line strategy; neighborhood character | JIRoom commute planner |
| 3 | 🔍 Platforms & Agents | PG vs 99.co vs Carousell vs FB Groups — comparison table with pros/cons; CEA Public Register for vetting agent licenses | CEA register, PG, 99.co, Carousell |

### EVALUATE — Vetting specific properties

| # | Node | Key Content | 🔗 References |
|---|---|---|---|
| 4 | 🏠 Reading Listings | Photo red flags (fish-eye, stock, missing bathroom); 99.co floor plans (layout, room sizes, west sun); URA Space (past transactions, development info, zoning, upcoming construction) | 99.co, URA Space |
| 5 | 🗺️ SLA / INLIS | Brief reference only when floor area, tenure, or property details matter for a specific unit | INLIS portal |
| 6 | 📋 Touring Checklist | Water pressure (all taps); AC (cold? remote?); mold/damp; phone signal; noise (windows open/closed); HDB vs Condo facilities | — |
| 7 | ✅ Verifying Everything | Cross-reference checklist: agent license (CEA) + property details when needed (SLA/INLIS) + listing photos vs reality + TA terms review | CEA, URA Space |

### EXECUTE — Making it official, informed

| # | Node | Key Content | 🔗 References |
|---|---|---|---|
| 8 | 📝 Understanding the TA | Diplomatic clause; early termination penalty; repair cap ($150-200); AC servicing obligation (every 3 months); subletting ban; notice period; reinstatement expectations; deposit return conditions | Sample TA |
| 9 | 🔑 Deposit → Signing → Handover | Security deposit / booking deposit wording, first month's rent, handover inventory walk-through, utility transfer | SP Services |
| 10 | ⚡ Post-Signing Setup | SP Services account (compare regulated tariff vs retail plans); internet providers; AC servicing booking; address change (ICA, MOM, bank) | SP tariff page, Singtel/StarHub/M1 |

## Graph Layout

Three columns, nodes connected left-to-right (exploration flow) and within columns (related topics):

```
          EXPLORE                    EVALUATE                    EXECUTE
       ─────────────             ──────────────              ─────────────
    ┌──────────────────┐    ┌──────────────────┐      ┌──────────────────┐
    │ 💰 Budget &     │    │ 🏠 Reading       │      │ 📝 Understanding │
    │ Costs            │───▶│ Listings         │──────▶│ the TA           │
    └──────────────────┘    │ & Floor Plans    │      └──────────────────┘
    ┌──────────────────┐    │ + URA Space      │      ┌──────────────────┐
    │ 📍 Where to     │    └──────────────────┘      │ 🔑 Process:     │
    │ Live             │───▶┌──────────────────┐──────▶│ Deposit → TA →   │
    └──────────────────┘    │ 📋 Touring       │      │ Handover         │
    ┌──────────────────┐    └──────────────────┘      └──────────────────┘
    │ 🔍 Platforms    │    ┌──────────────────┐      ┌──────────────────┐
    │ & Agents        │───▶│ 📋 Touring       │──────▶│ ⚡ Post-Signing │
    └──────────────────┘    │ Checklist        │      │ Setup            │
                            └──────────────────┘      └──────────────────┘
                            ┌──────────────────┐
                            │ ✅ Verifying     │
                            │ Everything       │──▶
                            └──────────────────┘
```

## Interaction Design

| Action | Behavior |
|---|---|
| **Click a topic node** | Expands inline — shows bullet content, tips, links. Previous expanded node collapses. |
| **Pan / zoom** | Standard @xyflow/react — drag canvas, scroll to zoom |
| **Minimap** | Bottom-right corner showing overview; click to jump |
| **"Start tour" button** | Activates overlay mode. Steps through nodes one-by-one with `fitView()` zoom + highlight + tooltip. Next/Back/Exit controls. |
| **Tour path** | 1→2→3→(pause: EXPLORE done)→4→7→6→8→5→9→10→(end: full map overview with "good luck" message) |

## Guided Tour Sequence

1. Zoom to full map → "Welcome — this is the SG Rental Journey in 3 phases"
2. Highlight EXPLORE column → "First, understand the landscape before you search"
3. 💰 Budget & Costs (expand + tooltip)
4. 📍 Where to Live
5. 🔍 Platforms & Agents
6. Transition animation → EVALUATE column
7. 🏠 Reading Listings + URA Space
8. 📋 Touring Checklist
9. ✅ Verifying Everything (highlight as the "checkpoint" node)
10. Transition animation → EXECUTE column
11. 📝 Understanding the TA
12. 🔑 Deposit → Signing → Handover
13. ⚡ Post-Signing Setup
14. Zoom to full map → "That's it — bookmark this page and happy hunting! 🏡"

## File Structure

```
app/[locale]/guide/
  page.tsx                     ← Server component with Suspense

components/guide/
  GuidePage.tsx                ← "use client" — main wrapper
  JourneyMap.tsx               ← @xyflow/react wrapper
  TourOverlay.tsx              ← Guided tour controls
  node-content.tsx             ← Content renderer for each node
  nodes/
    PhaseHeaderNode.tsx        ← Column title (EXPLORE / EVALUATE / EXECUTE)
    TopicNode.tsx              ← Collapsed topic card
    TopicDetail.tsx            ← Expanded topic card

data/
  guide-content.ts             ← Node definitions, edges, tour path
  guide-types.ts               ← TypeScript types

messages/
  en/guide.json                ← English content
  zh-CN/guide.json             ← Chinese content (future)
```

## Implementation Phases

| Phase | What | Status |
|---|---|---|---|
| **1** | Create branch, docs, scaffold /guide route, install deps, empty graph | ✅ Done |
| **2** | Data types + content structure | ✅ Done |
| **3** | Custom nodes (PhaseHeader, Topic collapsed, Topic expanded) | ✅ Done |
| **4** | JourneyMap with columns + edge routing + dynamic positioning | ✅ Done |
| **5** | Expand/collapse interaction + scroll handling + table rendering | ✅ Done |
| **6** | Guided tour overlay (fitView steps, phase transitions, hot close) | ✅ Done |
| **7** | Nav tab, i18n, final content writing | ✅ Done |

## Related Files to Modify

- `app/[locale]/guide/page.tsx` — new
- `components/Navigation.tsx` — add `Compass` icon tab for /guide
- `messages/en.json` — add `"guide"` and `"navigation.guide"` keys
- `messages/zh-CN.json` — same

## Open Questions

- zh-CN localization: do we translate all content, or launch with English-only first?
- Should the guided tour auto-play (like a video) or be click-to-advance?
- Any specific images/graphics to embed (e.g., MRT map, CCR/RCR/OCR map)?
