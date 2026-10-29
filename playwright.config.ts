import { defineConfig, devices } from "@playwright/test";
const live = process.env.E2E_LIVE === "1";
export default defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: live
    ? {
        command: "npm start -- --hostname 127.0.0.1 --port 4173",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: false,
      }
    : [
        {
          command: "node scripts/serve-game.mjs",
          url: "http://127.0.0.1:4174",
          reuseExistingServer: !process.env.CI,
        },
        {
          command: "npm run dev -- --hostname 127.0.0.1 --port 4173",
          env: { MERGEFINITY_ORIGIN: "http://127.0.0.1:4174" },
          url: "http://127.0.0.1:4173",
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
        },
      ],
});
