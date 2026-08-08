import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/listings");
  await page.waitForLoadState("networkidle");
});

test("bottom nav shows all four tabs", async ({ page }) => {
  const nav = page.locator("nav.fixed.bottom-0");
  await expect(nav).toBeVisible();
  await expect(nav.getByRole("link", { name: "My Listings" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Map" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Compare" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "My Schedule" })).toBeVisible();
});

test("Listings tab is active by default", async ({ page }) => {
  const listingsTab = page.getByRole("link", { name: "My Listings" }).first();
  await expect(listingsTab).toHaveClass(/text-primary/);
});

test("navigating to Map tab updates active state", async ({ page }) => {
  await page.getByRole("link", { name: "Map" }).first().click();
  await page.waitForURL("**/map");
  const mapTab = page.getByRole("link", { name: "Map" }).first();
  await expect(mapTab).toHaveClass(/text-primary/);
});

test("navigating to Compare tab", async ({ page }) => {
  await page.getByRole("link", { name: "Compare" }).first().click();
  await page.waitForURL("**/compare");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("heading", { name: "No listings selected" }).first()
  ).toBeVisible();
});

test("navigating to Schedule tab", async ({ page }) => {
  await page.getByRole("link", { name: "My Schedule" }).first().click();
  await page.waitForURL("**/schedule");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("heading", { name: "No viewings scheduled" }).first()
  ).toBeVisible();
});

test("root path redirects to /listings", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("**/listings");
});
