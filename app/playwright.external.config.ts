import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Las amarras importan módulos /src/ desde Vite y leen bundles externos elegidos
// por el operador. Reutilizan solo el servidor desktop, con backend efímero.
const desktopServer = (Array.isArray(base.webServer) ? base.webServer[0] : base.webServer)!;

export default defineConfig({
  ...base,
  webServer: { ...desktopServer, reuseExistingServer: false },
  projects: [{
    ...base.projects!.find((project) => project.name === "chromium")!,
    testMatch: /amarra-.*\.preview\.spec\.ts/,
    testIgnore: [],
  }],
});
