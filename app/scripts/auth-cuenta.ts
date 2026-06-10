// CLI de administración de cuentas (auth v1, docs/specs/auth-identidad-v1.md §5).
// Registro cerrado: las cuentas SOLO se crean aquí. Uso (con DATABASE_URL):
//   bun run auth:cuenta crear <email> [--tenant <tenant-id>]   (adopción con --tenant)
//   bun run auth:cuenta reset <email>
//   bun run auth:cuenta listar
// En el servidor:
//   docker exec -it opforja-model-api bun run scripts/auth-cuenta.ts <comando> ...
// La password se ingresa por stdin (nunca por argv: queda en el history).
import { randomBytes } from "node:crypto";
import { hashPassword } from "../src/server/passwordHash";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL requerido");
  process.exit(1);
}
const sql = new Bun.SQL(DATABASE_URL);

async function leerPassword(prompt: string): Promise<string> {
  process.stdout.write(`${prompt} (mínimo 8 caracteres): `);
  for await (const line of console) {
    const valor = line.trim();
    if (valor.length >= 8) return valor;
    process.stdout.write("Mínimo 8 caracteres. Reintenta: ");
  }
  throw new Error("stdin cerrado sin password");
}

function normalizarEmail(email: string): string {
  const normalizado = email.trim().toLowerCase();
  if (!normalizado.includes("@")) throw new Error(`Email inválido: ${email}`);
  return normalizado;
}

async function crear(emailArg: string, tenantFlag: string | null): Promise<void> {
  const email = normalizarEmail(emailArg);
  const existente = await sql`SELECT id FROM opforja_accounts WHERE email = ${email}`;
  if (existente.length > 0) throw new Error(`Ya existe cuenta para ${email}`);

  const ahora = new Date().toISOString();
  const accountId = `acc-${randomBytes(8).toString("hex")}`;
  const userId = `user-${randomBytes(16).toString("hex")}`;
  let tenantId = tenantFlag;

  if (tenantId) {
    const tenant = await sql`SELECT id FROM opforja_tenants WHERE id = ${tenantId}`;
    if (tenant.length === 0) throw new Error(`Tenant no existe: ${tenantId} (adopción imposible)`);
  } else {
    tenantId = `tenant-${randomBytes(16).toString("hex")}`;
  }

  const passwordHash = hashPassword(await leerPassword(`Password para ${email}`));
  await sql.begin(async (tx) => {
    if (!tenantFlag) await tx`INSERT INTO opforja_tenants (id, creado_en) VALUES (${tenantId}, ${ahora})`;
    await tx`INSERT INTO opforja_users (id, tenant_id, creado_en) VALUES (${userId}, ${tenantId}, ${ahora})`;
    await tx`
      INSERT INTO opforja_accounts (id, email, password_hash, user_id, creado_en)
      VALUES (${accountId}, ${email}, ${passwordHash}, ${userId}, ${ahora})
    `;
    await tx`
      INSERT INTO opforja_account_tenants (account_id, tenant_id, rol, creado_en)
      VALUES (${accountId}, ${tenantId}, 'owner', ${ahora})
    `;
  });
  console.log(`Cuenta creada: ${email} → tenant ${tenantId}${tenantFlag ? " (ADOPTADO)" : ""}`);
}

async function reset(emailArg: string): Promise<void> {
  const email = normalizarEmail(emailArg);
  const rows = await sql`SELECT id FROM opforja_accounts WHERE email = ${email}`;
  if (rows.length === 0) throw new Error(`No existe cuenta para ${email}`);
  const passwordHash = hashPassword(await leerPassword(`Nueva password para ${email}`));
  await sql`UPDATE opforja_accounts SET password_hash = ${passwordHash} WHERE email = ${email}`;
  console.log(`Password reseteada: ${email}`);
}

async function listar(): Promise<void> {
  const rows = await sql`
    SELECT a.email, m.tenant_id, a.creado_en, a.ultimo_login_en
    FROM opforja_accounts a
    LEFT JOIN opforja_account_tenants m ON m.account_id = a.id
    ORDER BY a.creado_en ASC
  `;
  if (rows.length === 0) {
    console.log("(sin cuentas)");
    return;
  }
  for (const row of rows) {
    console.log(`${row.email}\t${row.tenant_id}\tcreada=${row.creado_en}\tlogin=${row.ultimo_login_en ?? "—"}`);
  }
}

const [comando, emailArg] = Bun.argv.slice(2);
const tenantIdx = Bun.argv.indexOf("--tenant");
const tenantFlag = tenantIdx > -1 ? Bun.argv[tenantIdx + 1] ?? null : null;

try {
  if (comando === "crear" && emailArg) await crear(emailArg, tenantFlag);
  else if (comando === "reset" && emailArg) await reset(emailArg);
  else if (comando === "listar") await listar();
  else {
    console.error("Uso: auth:cuenta crear <email> [--tenant <id>] | reset <email> | listar");
    process.exit(1);
  }
  process.exit(0);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
