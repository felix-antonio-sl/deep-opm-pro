import { defineConfig, devices } from "@playwright/test";

// El puerto del dev server es configurable por env para permitir correr el
// smoke de un worktree aislado sin colisionar con otra instancia en 5173.
const PORT = process.env.PW_PORT ?? "5173";
const BASE_URL = `http://127.0.0.1:${PORT}`;

// El shell mobile-readonly solo se monta con el build flag VITE_MOBILE_READONLY
// === "true" (App.tsx) Y un viewport mobile. Ese flag no puede coexistir con la
// app productiva en un mismo server, así que el project `mobile` corre contra un
// segundo dev server dedicado en PORT+1 con el flag activo.
const PORT_MOBILE = String(Number(PORT) + 1);
const BASE_URL_MOBILE = `http://127.0.0.1:${PORT_MOBILE}`;

// Auth v1: el gate de login (MODEL_REQUIRE_AUTH) cambia el comportamiento de
// TODO el backend dev, así que el lane auth corre contra un tercer dev server
// dedicado en PORT+2 (mismo patrón que mobile).
const PORT_AUTH = String(Number(PORT) + 2);
const BASE_URL_AUTH = `http://127.0.0.1:${PORT_AUTH}`;

const MOBILE_SPEC = /mobile-readonly\.spec\.ts/;
const AUTH_SPEC = /auth\.spec\.ts/;

export default defineConfig({
  testDir: "./e2e",
  testIgnore: /.*\.preview\.spec\.ts/,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: `bun run dev --host 127.0.0.1 --port ${PORT} --strictPort`,
      url: `${BASE_URL}/`,
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: `VITE_MOBILE_READONLY=true bun run dev --host 127.0.0.1 --port ${PORT_MOBILE} --strictPort`,
      url: `${BASE_URL_MOBILE}/`,
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: `MODEL_REQUIRE_AUTH=true bun run dev --host 127.0.0.1 --port ${PORT_AUTH} --strictPort`,
      url: `${BASE_URL_AUTH}/`,
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
  projects: [
    {
      name: "chromium",
      // El smoke productivo excluye el shell mobile-readonly y el lane auth:
      // cada uno corre en su propio project contra el server con su flag activo.
      testIgnore: [MOBILE_SPEC, AUTH_SPEC],
      use: { ...devices["Desktop Chrome"], baseURL: BASE_URL },
    },
    {
      name: "mobile",
      testMatch: MOBILE_SPEC,
      use: { ...devices["Desktop Chrome"], baseURL: BASE_URL_MOBILE },
    },
    {
      name: "auth",
      testMatch: AUTH_SPEC,
      use: { ...devices["Desktop Chrome"], baseURL: BASE_URL_AUTH },
    },
  ],
});
