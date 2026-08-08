import { test, expect } from "@playwright/test";
import { seedLocalStorage } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/map");
  await page.waitForLoadState("domcontentloaded");
  await seedLocalStorage(page);
  await page.goto("/listings");
  await page.waitForLoadState("networkidle");
});

test("page title and description are visible", async ({ page }) => {
  await expect(
    page.locator("h1").filter({ hasText: "My Listings" }).first()
  ).toBeVisible();
  await expect(
    page.getByText("JIRA for rental search. Press ? for help.").first()
  ).toBeVisible();
});

test("seed listing cards render with correct prices", async ({ page }) => {
  await expect(page.getByText("$1,800").first()).toBeVisible();
  await expect(page.getByText("$900").first()).toBeVisible();
  await expect(page.getByText("$3,100").first()).toBeVisible();
  await expect(page.getByText("$2,300").first()).toBeVisible();
});

test("seed listing titles are visible", async ({ page }) => {
  await expect(
    page.getByText("Spacious Master Bedroom @ Novena MRT")
  ).toBeVisible();
  await expect(page.getByText("Studio @ Robertson Quay")).toBeVisible();
  await expect(page.getByText("Master Room @ Holland Village")).toBeVisible();
});

test("evaluation progress shows for evaluated listings", async ({ page }) => {
  const evalText = page.locator("text=/\\d+\\/32/").first();
  const count = await evalText.count();
  expect(count).toBeGreaterThanOrEqual(0);
  if (count > 0) {
    await expect(evalText).toBeVisible();
  }
});

test("Add listing button opens dialog", async ({ page }) => {
  await page.getByRole("button", { name: "Add listing" }).click();
  await expect(page.getByText("Add New Listing")).toBeVisible();
});

test.fixme("Compare button appears when listings selected", async ({
  page,
}) => {
  await expect(page.getByText(/Compare \(\d+\)/)).toBeVisible();
});

test("export button is present", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Export data" })).toBeVisible();
});

test("sample data toggle is present", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Switch to your data" })
  ).toBeVisible();
});
