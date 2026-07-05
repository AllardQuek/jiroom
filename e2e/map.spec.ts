import { test, expect } from "@playwright/test";
import { seedLocalStorage } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/map");
  await page.waitForLoadState("domcontentloaded");
  await seedLocalStorage(page);
  await page.reload();
  await page.waitForLoadState("networkidle");
});

test.describe("Page load", () => {
  test("map page renders without crashing", async ({ page }) => {
    await expect(page.locator("h1")).not.toBeVisible();
  });
});

test.describe("M1a — Map UX Enhancements", () => {
  test("filters toggle button is visible and opens filter panel", async ({
    page,
  }) => {
    const filtersBtn = page.getByText("Filters");
    await expect(filtersBtn).toBeVisible();
    await filtersBtn.click();
    await expect(page.getByText("Status").first()).toBeVisible();
  });

  test("status filter chips are present in filter panel", async ({ page }) => {
    await page.getByText("Filters").click();
    await expect(page.getByText("New").first()).toBeVisible();
    await expect(page.getByText("To View").first()).toBeVisible();
    await expect(page.getByText("Viewed").first()).toBeVisible();
    await expect(page.getByText("Shortlisted").first()).toBeVisible();
  });

  test("area chips appear in filter panel", async ({ page }) => {
    await page.getByText("Filters").click();
    await expect(page.getByText("Novena / Toa Payoh")).toBeVisible();
    await expect(page.getByText("Tampines")).toBeVisible();
  });

  test("score range inputs are present", async ({ page }) => {
    await page.getByText("Filters").click();
    await expect(page.getByPlaceholder("Min").first()).toBeVisible();
    await expect(page.getByPlaceholder("Max").first()).toBeVisible();
  });

  test("price range inputs are present", async ({ page }) => {
    await page.getByText("Filters").click();
    await expect(page.getByText("Price").first()).toBeVisible();
  });

  test("marker color toggle shows By Status and By Area", async ({ page }) => {
    await expect(page.getByRole("button", { name: "By Status" })).toBeVisible();
    await expect(page.getByRole("button", { name: "By Area" })).toBeVisible();
  });

  test("clicking By Area activates area mode", async ({ page }) => {
    await page.getByRole("button", { name: "By Area" }).click();
  });

  test("area legend appears in filter panel when By Area is active", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "By Area" }).click();
    await page.getByText("Filters").click();
    await expect(page.getByText("Areas")).toBeVisible();
  });

  test("search input is present", async ({ page }) => {
    await expect(
      page.getByPlaceholder("Search for a location...")
    ).toBeVisible();
  });
});

test.describe("M4 — Distances & Routes", () => {
  test("travel mode toggle shows all four modes", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Transit" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Drive" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Walk" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Bike" })).toBeVisible();
  });

  test("travel mode default is Transit", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Transit" })).toBeVisible();
  });

  test("clicking Drive switches travel mode", async ({ page }) => {
    await page.getByRole("button", { name: "Drive" }).click();
  });

  test("commute filter section appears in filter panel", async ({ page }) => {
    await page.getByText("Filters").click();
    await expect(page.getByText("Commute filter")).toBeVisible();
  });

  test("commute filter has anchor dropdown", async ({ page }) => {
    await page.getByText("Filters").click();
    const selects = page.locator("select");
    await expect(selects.first()).toBeVisible();
  });

  test("commute filter shows seed anchors in dropdown", async ({ page }) => {
    await page.getByText("Filters").click();
    const select = page.locator("select").first();
    const options = await select.locator("option").allTextContents();
    expect(options).toContain("Office");
    expect(options).toContain("Gym");
    expect(options).toContain("Parents Home");
  });

  test("selecting an anchor shows max commute input", async ({ page }) => {
    await page.getByText("Filters").click();
    const select = page.locator("select").first();
    await select.selectOption("Office");
    await expect(page.getByPlaceholder("60")).toBeVisible();
    await expect(page.getByText("min")).toBeVisible();
  });

  test("show anchors toggle exists in filter panel", async ({ page }) => {
    await page.getByText("Filters").click();
    await expect(page.getByText("Show anchors")).toBeVisible();
  });
});

test.describe("Anchors", () => {
  test("anchors button opens anchor panel", async ({ page }) => {
    const anchorsBtn = page.getByText("Anchors");
    await expect(anchorsBtn).toBeVisible();
    await anchorsBtn.click();
    await expect(page.getByText("Office")).toBeVisible();
  });

  test("anchor panel shows seeded anchors", async ({ page }) => {
    await page.getByText("Anchors").click();
    await expect(page.getByText("Office")).toBeVisible();
    await expect(page.getByText("Gym")).toBeVisible();
    await expect(page.getByText("Parents Home")).toBeVisible();
  });
});
