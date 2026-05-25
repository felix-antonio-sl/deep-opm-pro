import { defineConfig, devices } from "@playwright/test";

// El puerto del dev server es configurable por env para permitir correr el
// smoke de un worktree aislado sin colisionar con otra instancia en 5173.
const PORT = process.env.PW_PORT ?? "5173";
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  testIgnore: /.*\.preview\.spec\.ts/,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `bun run dev --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `${BASE_URL}/`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
