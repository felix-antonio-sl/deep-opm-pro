import { defineConfig, devices } from '@playwright/test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const datosPropios = !process.env.OPFORJA_E2E_DATOS;
const datos = process.env.OPFORJA_E2E_DATOS || mkdtempSync(join(tmpdir(), 'opforja-e2e-'));
process.env.OPFORJA_E2E_DATOS = datos;
if (datosPropios) process.once('exit', () => rmSync(datos, { recursive: true, force: true }));
const argumento = (valor: string) => `'${valor.replaceAll("'", "'\\''")}'`;
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:8787' },
  webServer: {
    command: `env -i PATH="$PATH" OPFORJA_SECRETO=secreto-sintetico-e2e-exclusivo-1234567890 OPFORJA_TOKEN=token-sintetico-e2e-exclusivo-1234567890-1234567890 OPFORJA_VERSION=e2e PORT=8787 OPFORJA_WEB=${argumento(join(import.meta.dir, 'dist'))} bun --no-env-file dist-servidor/principal.js --host 127.0.0.1 --datos ${argumento(datos)}`,
    url: 'http://127.0.0.1:8787/salud',
    reuseExistingServer: false,
  },
});
