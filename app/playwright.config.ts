import { defineConfig, devices } from '@playwright/test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const datosPropios = !process.env.OPFORJA_E2E_DATOS;
const datos = process.env.OPFORJA_E2E_DATOS || mkdtempSync(join(tmpdir(), 'opforja-e2e-'));
process.env.OPFORJA_E2E_DATOS = datos;
if (datosPropios) process.once('exit', () => rmSync(datos, { recursive: true, force: true }));
const argumentoDatos = `'${datos.replaceAll("'", "'\\''")}'`;
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:8787' },
  webServer: {
    command: `bun dist/servidor/principal.js --datos ${argumentoDatos}`,
    url: 'http://127.0.0.1:8787/salud',
    reuseExistingServer: false,
  },
});
