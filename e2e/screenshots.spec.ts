import { test, expect } from "@playwright/test";
import { seedLocalStorage } from "./helpers";

const MOBILE_VIEWPORT = { width: 390, height: 844 };
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };

async function seedAndNavigate(page, url, viewport = MOBILE_VIEWPORT) {
  await page.setViewportSize(viewport);
  await page.goto("/map");
  await page.waitForLoadState("domcontentloaded");
  await seedLocalStorage(page);
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
}

test.describe("Screenshots", () => {
  test("01 - Listings (mobile)", async ({ page }) => {
    await seedAndNavigate(page, "/listings");
    await page.screenshot({ path: "screenshots/01-listings-mobile.png", fullPage: true });
  });

  test("02 - Listings (desktop)", async ({ page }) => {
    await seedAndNavigate(page, "/listings", DESKTOP_VIEWPORT);
    await page.screenshot({ path: "screenshots/02-listings-desktop.png", fullPage: true });
  });

  test("03 - Schedule (mobile)", async ({ page }) => {
    await seedAndNavigate(page, "/schedule");
    await page.screenshot({ path: "screenshots/03-schedule-mobile.png", fullPage: true });
  });

  test("04 - Compare (mobile)", async ({ page }) => {
    await seedAndNavigate(page, "/compare");
    await page.screenshot({ path: "screenshots/04-compare-mobile.png", fullPage: true });
  });

  test("05 - Compare (desktop)", async ({ page }) => {
    await seedAndNavigate(page, "/compare", DESKTOP_VIEWPORT);
    await page.screenshot({ path: "screenshots/05-compare-desktop.png", fullPage: true });
  });

  test("06 - Map (mobile)", async ({ page }) => {
    await seedAndNavigate(page, "/map");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "screenshots/06-map-mobile.png", fullPage: true });
  });

  test("07 - Map with filters open (mobile)", async ({ page }) => {
    await seedAndNavigate(page, "/map");
    await page.waitForTimeout(2000);
    await page.locator("button:has(svg.lucide-sliders-horizontal)").first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "screenshots/07-map-filters-mobile.png", fullPage: true });
  });

  test("08 - Map with anchors panel (mobile)", async ({ page }) => {
    await seedAndNavigate(page, "/map");
    await page.waitForTimeout(2000);
    await page.locator("button:has(svg.lucide-menu)").click();
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "Anchors", exact: true }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "screenshots/08-map-anchors-mobile.png", fullPage: true });
  });

  test("09 - Map with filters open (desktop)", async ({ page }) => {
    await seedAndNavigate(page, "/map", DESKTOP_VIEWPORT);
    await page.waitForTimeout(2000);
    await page.getByText("Filters").click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "screenshots/09-map-filters-desktop.png", fullPage: true });
  });

  test("10 - Map with anchors (desktop)", async ({ page }) => {
    await seedAndNavigate(page, "/map", DESKTOP_VIEWPORT);
    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: "Anchors" }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "screenshots/10-map-anchors-desktop.png", fullPage: true });
  });
});
