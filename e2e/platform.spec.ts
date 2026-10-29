import { test, expect } from "@playwright/test";
test("catalog, responsive navigation, metadata and unavailable routes", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(
    "Nayaro Games — Browser games by Nayaro Technology",
  );
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Games from Nayaro.",
  );
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await page.getByRole("link", { name: "Games", exact: true }).click();
  await expect(page).toHaveURL(/#games$/);
  await page.screenshot({
    path: testInfo.outputPath("homepage.png"),
    fullPage: true,
  });
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <= window.visualViewport!.width,
      ),
      `No overflow at ${width}px`,
    ).toBe(true);
  }
  await page.getByRole("link", { name: "Play MergeFinity" }).click();
  await expect(
    page.getByText("Saves from mergefinity.vercel.app", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Play MergeFinity" }),
  ).toHaveAttribute("href", "/mergefinity/");
  const missing = await page.goto("/play/unreleased/");
  expect(missing?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
  const unknown = await page.goto("/not-a-game/");
  expect(unknown?.status()).toBe(404);
  const sitemap = await page.request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain(
    "https://games.nayaro.tech/play/mergefinity/",
  );
  expect((await page.request.get("/robots.txt")).status()).toBe(200);
  const og = await page.request.get("/opengraph-image");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
  expect(errors).toEqual([]);
});
test("proxied game loads, saves, refreshes offline and releases hub navigation", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  const failures: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      failures.push(`${response.status()} ${response.url()}`);
  });
  const canonical = await page.request.get("/mergefinity", { maxRedirects: 0 });
  expect(canonical.status()).toBe(308);
  expect(canonical.headers().location).toBe("/mergefinity/");
  await page.goto("/play/mergefinity/");
  await page.getByRole("link", { name: "Play MergeFinity" }).click();
  await expect(
    page.getByRole("heading", { name: "Mergefinity." }),
  ).toBeVisible();
  const scope = await page.evaluate(
    async () => (await navigator.serviceWorker.ready).scope,
  );
  expect(new URL(scope).pathname).toBe("/mergefinity/");
  const worker = await page.request.get("/mergefinity/sw.js");
  expect(worker.headers()["content-type"]).toContain("application/javascript");
  expect(worker.headers()["cache-control"]).toContain("no-store");
  expect(worker.headers()["service-worker-allowed"]).toBe("/mergefinity/");
  expect(await worker.text()).toContain("nayaro-hub-mergefinity-");
  await page.getByRole("button", { name: /Let’s play/ }).click();
  await expect(page.locator("canvas")).toBeVisible();
  await page.locator(".board").focus();
  for (const direction of ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"])
    await page.keyboard.press(direction);
  const saved = await page.evaluate(() =>
    localStorage.getItem("mergefinity.v1"),
  );
  expect(JSON.parse(saved!).session.current.moves).toBeGreaterThan(0);
  await page.reload();
  await page.getByRole("button", { name: "Continue playing" }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("mergefinity.v1")),
  ).toBe(saved);
  // These are deliberately outside the game's path but still inside its origin.
  const hub = await page.evaluate(async () => (await fetch("/")).text());
  expect(hub).toContain("Games from Nayaro.");
  expect(hub).not.toContain("Preparing Mergefinity");
  await context.setOffline(true);
  await page.reload();
  await page.getByRole("button", { name: "Continue playing" }).click();
  await expect(page.locator("canvas")).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("mergefinity.v1")),
  ).toBe(saved);
  await context.setOffline(false);
  // Force a document navigation from the controlled game, not Next client routing.
  await page.evaluate(() => {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Verify a real document transition from an independently deployed app.
    location.href = "/";
  });
  await expect(
    page.getByRole("heading", { name: "Games from Nayaro." }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => navigator.serviceWorker.controller?.scriptURL ?? null,
      ),
    )
    .toBe(null);
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
});
