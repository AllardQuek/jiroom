import { Criterion, Template } from "@/types/evaluation";

/**
 * Checks if a response value has been provided
 * @param value - The response value to check (number, string, or undefined)
 * @returns true if the value is defined and not an empty string
 */
export const hasResponse = (value: number | string | undefined) =>
  value !== undefined && value !== "";

/**
 * Groups criteria by their category
 * @param template - The template containing criteria to group
 * @returns An object mapping category names to arrays of criteria
 */
export const groupCriteriaByCategory = (template: Template) =>
  template.criteria.reduce(
    (groups, criterion) => {
      if (!groups[criterion.category]) {
        groups[criterion.category] = [];
      }
      groups[criterion.category].push(criterion);
      return groups;
    },
    {} as Record<string, Criterion[]>
  );
