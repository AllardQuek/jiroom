# Singapore Rental Guide - Consolidated Content

> Compiled from the JIRoom rental room rater application
> Last updated: 2026-07-08

---

## Overview

This guide helps foreign professionals new to Singapore understand the rental property landscape, from budgeting and platform selection through tenancy agreement (TA) signing and moving in.

The journey is organized into three phases:

1. **EXPLORE** 🔭 — What to know before searching
2. **EVALUATE** 🔍 — Vetting specific properties  
3. **EXECUTE** ✍️ — Making it official, informed

---

## Phase 1: EXPLORE 🔭
*What to know before searching*

### 💰 How much to budget?

**Key Points:**
- Rough guide: SGD 850-1,200/mo common room, SGD 1,300+/mo master room (HDB). Condos cost more.
- Utilities depend on HDB/condo, household size, and AC usage — your biggest cost. Check [SP Services tariff](https://www.spgroup.com.sg/our-services/utilities/tariff-information) for rates.
- Security deposit: 1 month (1-yr lease) or 2 months (2-yr).
- Stamp duty: 0.4% of total rent. Calculate with [IRAS stamp duty calculator](https://mytax.iras.gov.sg/ESVWeb/default.aspx?target=MSDCalculatorIntro).
- Agent fee: landlord pays by default, unless you hire your own agent too.

---

### 📍 Where to rent?

**Key Points:**
- Expo is on both the green (EW) and blue (DT) lines. Simei, Tampines, Pasir Ris, and Tanah Merah are your closest options.
- Tampines West, Tampines, Upper Changi, and Tampines East are on the blue line — direct train to Expo.

---

### 🔍 Where to find listings?

**Tips:**
- Prepare a tenant profile to send to agents: occupation, nationality, move-in date, budget range, etc.

**Platform Comparison:**

| Platform | Best For |
|----------|----------|
| [PropertyGuru](https://www.propertyguru.com.sg) | Largest inventory of rooms and units; mostly agent-listed |
| [99.co](https://www.99.co/singapore) | **Map** and room search with MRT commute filtering; **floor plans** on most listings |
| [Carousell](https://www.carousell.sg) | Direct-owner rooms and budget-friendly deals |
| [Facebook](https://www.facebook.com/marketplace/singapore/propertyrental) | Room shares and sublets (harder to filter) |

---

## Phase 2: EVALUATE 🔍
*Vetting specific properties*

### 📋 How to do viewings?

**Notes:**
- Allocate ~20min for the viewing. If it's a condo, add 10min before/after to check facilities (gym, pool) and access gates.
- Photos vs reality — agents sometimes mix photos of all rooms in a listing. That $900 room might really be the $1.2k one.
- Take video in addition to photos — it's much easier to revisit conditions realistically.

**Checklist:**
- 💧 Water pressure — turn on ALL taps, flush the toilet
- ❄️ Aircon — does it blow cold? Does the remote work?
- 📶 Signal — some HDBs have dead zones. Test every room.
- 🧱 Partition walls or real walls? You'll hear everything through thin walls.
- 📍 Check nearby amenities — supermarket, parks, late-night food options.
- 🧺 Dryer included? Many HDBs don't have one.
- 👤 Does the landlord live in? Utilities capped or shared?
- 👥 Who's staying there? Fellow tenants' profile, landlord living in?

**Tips:**
- Walk around the neighbourhood before or after the viewing — grab a meal at a nearby place to get a feel for the area. Try to picture what it might be like at different times of day.

---

### ✅ What to verify?

**Key Points:**
- Agent — [CEA register](https://eservices.cea.gov.sg/aceas/public-register). Licensed? Any disciplinary record?
- Property — [INLIS](https://app.sla.gov.sg/inlis/) to confirm floor area and tenure.
- Listings — [URA Space](https://www.ura.gov.sg/maps). Past prices? Upcoming construction?
- LOI vs TA — LOI is non-binding intent with a good-faith deposit; TA is the binding contract. LOI can be skipped for smaller/room rentals.

---

## Phase 3: EXECUTE ✍️
*Making it official, informed*

### 📝 What's in the lease?

**Key Points:**
- Early termination — don't assume a fixed penalty. Check what the TA says.
- Repair cap — usually $150–200 per incident if the TA has one.
- AC servicing — often required every 3 months. Keep every receipt.
- Notice period — typically 1–2 months. Your TA controls this.

**Tips:**
- Try negotiating: ~$50 off rent, shorter lease (6mo vs 12mo), earlier move-in, or utilities included.

---

### 🔑 How to move in?

**Key Points:**
- First month's rent — due at signing or move-in. Check the TA.
- Booking deposit — get refund and forfeiture terms in writing.
- TA signing — both parties sign.
- Handover walkthrough — inventory list, photograph EVERYTHING.

**Tips:**
- Take a video walkthrough and upload it somewhere safe. You'll thank yourself later.

---

## Planning & Development Notes

### Project Goal
An interactive, web-based journey map that helps foreign colleagues understand Singapore's rental property landscape. Built as a new route (`/guide`) within the existing JIRoom Next.js app.

### Target Audience
Foreign professionals new to Singapore who need a practical, visual guide to renting — from budgeting and platform selection through TA signing and moving in.

### Key Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Narrative framing** | EXPLORE → EVALUATE → EXECUTE | Reference point is signing the TA. Every topic is a decision input. |
| **Interaction model** | Hybrid: inline expandable cards + zoom transitions | Free exploration is primary; guided tour is opt-in. |
| **Graph library** | `@xyflow/react` (react-flow v12) | Mature, well-supported, built-in zoom/pan/minimap, custom React node support. |
| **Animation** | `framer-motion` | Smooth zoom-transitions for guided tour steps. |
| **Location** | `app/[locale]/guide/` in existing Next.js app | Leverages existing i18n, theming, component library, and deployment. |
| **i18n** | Existing `next-intl` setup | English first; Chinese (zh-CN) later. |

### File Structure

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

### Implementation Status

| Phase | What | Status |
|---|---|---|
| **1** | Create branch, docs, scaffold /guide route, install deps, empty graph | ✅ Done |
| **2** | Data types + content structure | ✅ Done |
| **3** | Custom nodes (PhaseHeader, Topic collapsed, Topic expanded) | ✅ Done |
| **4** | JourneyMap with columns + edge routing + dynamic positioning | ✅ Done |
| **5** | Expand/collapse interaction + scroll handling + table rendering | ✅ Done |
| **6** | Guided tour overlay (fitView steps, phase transitions, hot close) | ✅ Done |
| **7** | Nav tab, i18n, final content writing | ✅ Done |

---

## External References

### Government & Official Resources
- [IRAS Stamp Duty Calculator](https://mytax.iras.gov.sg/ESVWeb/default.aspx?target=MSDCalculatorIntro)
- [SP Services Tariff Information](https://www.spgroup.com.sg/our-services/utilities/tariff-information)
- [CEA Public Register](https://eservices.cea.gov.sg/aceas/public-register)
- [INLIS Portal](https://app.sla.gov.sg/inlis/)
- [URA Space](https://www.ura.gov.sg/maps)

### Property Platforms
- [PropertyGuru](https://www.propertyguru.com.sg)
- [99.co Singapore](https://www.99.co/singapore)
- [Carousell](https://www.carousell.sg)
- [Facebook Marketplace](https://www.facebook.com/marketplace/singapore/propertyrental)

---

*This guide is part of the JIRoom rental room rater application. For the interactive version with visual journey map and guided tour, visit the /guide route in the application.*
