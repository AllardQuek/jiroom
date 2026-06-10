import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/listings");
  await page.waitForLoadState("networkidle");
});

test("bottom nav shows all four tabs", async ({ page }) => {
  const nav = page.locator("nav.fixed.bottom-0");
  await expect(nav).toBeVisible();
  await expect(nav.getByRole("link", { name: "Listings" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Map" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Compare" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Schedule" })).toBeVisible();
});

test("Listings tab is active by default", async ({ page }) => {
  const listingsTab = page.locator("nav a[href='/listings']");
  await expect(listingsTab).toHaveClass(/text-primary/);
});

test("navigating to Map tab updates active state", async ({ page }) => {
  await page.locator("nav a[href='/map']").click();
  await page.waitForURL("**/map");
  const mapTab = page.locator("nav a[href='/map']");
  await expect(mapTab).toHaveClass(/text-primary/);
});

test("navigating to Compare tab", async ({ page }) => {
  await page.locator("nav a[href='/compare']").click();
  await page.waitForURL("**/compare");
  await expect(page.locator("h1")).toContainText(/compare/i);
});

test("navigating to Schedule tab", async ({ page }) => {
  await page.locator("nav a[href='/schedule']").click();
  await page.waitForURL("**/schedule");
  await expect(page.locator("h1")).toContainText(/schedule/i);
});

test("root path redirects to /listings", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("**/listings");
});
