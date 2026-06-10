# Scoring System — Simplified +1/0/-1 with Configurable Thresholds

## Overview

Replace the current weighted-sum (0–100) scoring with a simpler +1/0/-1 per-criterion system. Weights are removed entirely. Each responded question contributes either +1 (positive), 0 (neutral), or -1 (negative). The score is the percentage of points earned out of points possible.

## Motivation

- The current system assigns score 0 to `select` and `text` criteria (29 of 32 criteria), making the score nearly meaningless
- Weighted math is opaque to users
- +1/0/-1 maps intuitively to positive/neutral/negative sentiment
- Denominator = responded questions avoids penalizing skipped/N/A fields

## Functional Requirements

### FR1: Score Calculation

**Formula:**
```
score = round( (sum of points) / (number of scorable responded criteria) * 100 )
```

- Each scorable criterion with a response contributes either +1, 0, or -1
- Criteria without responses are excluded from both numerator and denominator
- `text`-type criteria are excluded from scoring entirely (informational only)
- N/A responses (`"na"`) are excluded from scoring
- Score is 0–100 integer, or `null` when no scorable responses exist

**Per-type default mapping:**

| Type       | Mapping to -1/0/+1                                                                    |
| ---------- | ------------------------------------------------------------------------------------- |
| `select`   | Defined by per-option `scores` map on the criterion (user-configurable in template)   |
| `checkbox` | Yes → +1, No → -1, N/A → excluded                                                     |
| `rating`   | 1–2 → -1, 3 → 0, 4–5 → +1 (higher rating = worse sharing → lower score applies)      |
| `number`   | Defined by configurable thresholds on the criterion (see FR3)                         |
| `text`     | Excluded from scoring entirely                                                        |

Note: The rating default is fixed and not user-configurable. For bathroom sharing (c15), thresholds are 1–2 → +1, 3 → 0, >=4 → -1.

### FR2: Derived Total Cost

A derived "Total monthly cost" criterion that sums `listing.price + c2 (utility) + c4 (additional)` inside the scoring function. It is not a user-input field — it is computed automatically.

- The individual cost components (c2, c4) are NOT scored directly as separate criteria
- The derived total is scored via configurable thresholds (see FR3)
- Default thresholds for Singapore SGD: `< 1000 → +1`, `1000–1200 → 0`, `> 1200 → -1`

**Schema approach:** The derived criterion has a new field `derivedFrom: string[]` listing the criterion IDs it sums, plus `thresholds` for scoring. It has no `options` and its `type` is `"derived"`.

### FR3: Configurable Thresholds (Number Type)

Each `number`-type criterion may optionally define thresholds for mapping numeric values to -1/0/+1:

```ts
thresholds?: { min?: number; max?: number; score: -1 | 0 | 1 }[];
```

- Thresholds are evaluated in order; the first matching range is used
- If no thresholds are defined, the number criterion is excluded from scoring
- Thresholds are editable in the template editor UI

Default thresholds for built-in criteria:

| Criterion                             | Default thresholds                           |
| ------------------------------------- | -------------------------------------------- |
| Derived total cost                    | `< 1000 → +1`, `1000–1200 → 0`, `> 1200 → -1` |
| c15 — People sharing bathroom         | `1–2 → +1`, `3 → 0`, `>= 4 → -1`            |

### FR4: Template Schema Changes

```ts
interface Criterion {
  id: string;
  name: string;
  description: string;
  type: "checkbox" | "rating" | "number" | "text" | "select" | "derived";
  category: string;
  options?: string[];           // for select type
  scores?: Record<string, -1 | 0 | 1>;  // for select type: option → score
  thresholds?: { min?: number; max?: number; score: -1 | 0 | 1 }[];  // for number type
  derivedFrom?: string[];       // for derived type: IDs of criteria to sum
}
```

**Removed:** `weight` field (entirely removed from schema, types, and UI).

### FR5: Template Editor UI Changes

- Remove the weight selector from CriteriaForm
- For `select` type: show each option inline with a -1/0/+1 picker (three small buttons or a toggle)
- For `number` type: show a "Scoring thresholds" section with add/remove rows, each with min, max, score fields
- For `derived` type: show which criteria it derives from (auto-created alongside cost criteria)
- Scoring mappings are visible at a glance in the criteria list

### FR6: Evaluation Form Changes

- The derived total cost appears as a read-only computed row in the Cost category, acting as a summary/total sum display. Component costs (c2, c4) remain as editable inputs but are not scored individually — only the derived total is scored.
- Score badges per criterion (+1/0/-1) are NOT shown — the UI keeps the current clean look, showing just the overall score at the top of the evaluation section.

### FR7: Score Display Changes

- Display as a simple percentage (0–100), keeping the existing clean look: **"80"** with **"/100"**
- Keep color thresholds: 80+ green, 60–79 yellow, 40–59 orange, <40 red
- The comparison view reuses the same display component — no separate requirements

## Non-Functional Requirements

### NFR1: Backward Compatibility & Migration

- Existing evaluations in localStorage will have responses referencing the old template with `weight` fields
- On first load with the new schema, weight is ignored
- Old criteria without `scores`/`thresholds` will score 0 (effectively excluded from scoring)
- **Migration:** On app load, existing evaluations and the default template are migrated:
  1. The default template is replaced with the new schema (removing `weight`, adding `scores`/`thresholds`/`derivedFrom`)
  2. Seed data evaluations are updated to the new schema
  3. User-created custom templates: `weight` field is dropped; criteria without `scores`/`thresholds` will not contribute to score until user configures them via the template editor

### NFR2: Type Safety

- All changes use TypeScript
- Zod schemas updated for new Criterion shape
- `scores` and `thresholds` validated at the schema level

## Technical Notes

### Scoring Function Algorithm

```
function calculateScore(responses, template, listingPrice):
  let totalPoints = 0
  let totalPossible = 0

  for criterion in template.criteria:
    response = responses[criterion.id]
    if response is undefined or response == "": continue
    if criterion.type == "text": continue
    if criterion.type == "derived":
      // compute sum of referenced criteria + listingPrice
      value = listingPrice
      for depId in criterion.derivedFrom:
        value += Number(responses[depId] ?? 0)
      points = scoreFromThresholds(value, criterion.thresholds)
      if points != null: totalPoints += points; totalPossible += 1
      continue
    if response == "na": continue

    switch criterion.type:
      case "checkbox":
        points = response == "true" ? 1 : -1
      case "rating":
        points = response <= 2 ? -1 : response == 3 ? 0 : 1
      case "select":
        points = criterion.scores?.[response] ?? 0
      case "number":
        points = scoreFromThresholds(Number(response), criterion.thresholds)
        if points == null: continue  // no thresholds configured

    totalPoints += points
    totalPossible += 1

  if totalPossible == 0: return null
  return Math.round((totalPoints + totalPossible) / (2 * totalPossible) * 100)
  // shift from -1..+1 range to 0..100:
  // (sum + count) / (2 * count) * 100
```

### Files to Modify

| File                                            | Change                                          |
| ----------------------------------------------- | ----------------------------------------------- |
| `types/evaluation.ts`                           | Update Criterion interface — add scores, thresholds, derivedFrom; remove weight |
| `lib/schemas/templateSchema.ts`                 | Update Zod schemas                              |
| `lib/utils/calculateScore.ts`                   | Rewrite with +1/0/-1 logic                      |
| `lib/data/defaultTemplate.ts`                   | Add scores/thresholds to criteria; remove weights; add derived total cost |
| `components/template/CriteriaForm.tsx`          | Remove weight; add scores UI for select; add thresholds UI for number |
| `components/template/CriteriaItem.tsx`          | Remove weight badge; show score mapping         |
| `components/evaluation/EvaluationSection.tsx`   | Add score contribution badges; show derived total cost |
| `components/verdict/ScoreDisplay.tsx`           | Show fraction + percent                         |
| `components/comparison/ComparisonColumn.tsx`    | Align score display format                      |
| `components/listings/ListingCard.tsx`           | Align score display format                      |

## Acceptance Criteria

- [ ] AC1: Score is calculated as percentage of +1/0/-1 points earned out of responded scorable criteria
- [ ] AC2: Select-type criteria show -1/0/+1 mappings in template editor and use them in scoring
- [ ] AC3: Number-type criteria with thresholds score correctly
- [ ] AC4: Derived total cost is computed from listing price + utility + additional costs
- [ ] AC5: Weight field is removed from schema, types, and all UI
- [ ] AC6: Derived total cost appears as read-only computed row in Cost category
- [ ] AC7: Score displays as percentage /100 (e.g. "80 /100")
- [ ] AC8: Text and N/A responses are excluded from scoring
- [ ] AC9: TypeScript compilation passes
- [ ] AC10: Existing localStorage data doesn't crash on load

## Remaining Decisions

~~The following points from the original discussion still need resolution:~~

~~1. **Rating type (1–5)** — Mapped 1–2 → -1, 3 → 0, 4–5 → +1. OK, or keep more granular? (Currently flagged as fixed — not configurable.)~~
~~2. **Where does the derived total cost appear?** — As a read-only computed row in the Cost category during evaluation? Or just in the score breakdown?~~
~~3. **Score display detail** — Show individual criterion contributions (+1/0/-1) in the score breakdown, or just the overall percentage?~~
~~4. **Migration strategy for existing evaluations** — Old evaluations have responses for c2/c4 (number) which will suddenly score 0 without thresholds. Should we auto-apply default thresholds on existing data, or leave them unscored until user configures?~~
~~5. **Comparison view** — The comparison table shows per-criteria color coding; does the -1/0/+1 map directly to the green/amber/red colors there?~~

**All decisions resolved.** See the discussions above for each resolution. The comparison view reuses the same display component from the listings evaluation view — no separate requirements.
