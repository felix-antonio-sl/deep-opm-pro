import { afterEach, expect, test } from "bun:test";
import { copyFileSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const directories: string[] = [];
afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

function deploy(environment: Record<string, string> = {}) {
  const directory = mkdtempSync(join(tmpdir(), "opforja-deploy-test-"));
  directories.push(directory);
  mkdirSync(join(directory, "deploy"));
  mkdirSync(join(directory, "bin"));
  copyFileSync(resolve(import.meta.dir, "../../deploy/deploy.sh"), join(directory, "deploy/deploy.sh"));
  const stub = join(directory, "stub.mjs");
  writeFileSync(stub, `
import { appendFileSync, writeFileSync } from "node:fs";
const command = process.env.TEST_COMMAND;
const args = process.argv.slice(2);
const env = process.env;
if (command === "git") {
  process.stdout.write(args[0] === "rev-parse" ? "abc12345\\n" : (env.TEST_GIT_STATUS ?? ""));
} else if (command === "docker") {
  appendFileSync(env.TEST_DEPLOY_LOG, args.join(" ") + " build=" + env.OPFORJA_BUILD + "\\n");
  process.exit(Number(env.TEST_COMPOSE_EXIT ?? "0"));
} else if (command === "curl") {
  const url = args.find(arg => arg.startsWith("http://"));
  let body = "";
  if (url.endsWith("/healthz")) body = "ok";
  else if (url.endsWith("/session")) body = env.TEST_SESSION_STATUS ?? "401";
  else if (url.endsWith(".js")) body = 'const build="' + (env.TEST_SERVED_BUILD ?? "abc12345") + '";';
  else body = '<script src="/assets/index-test.js"></script>';
  const output = args.indexOf("-o");
  if (args.includes("-w")) process.stdout.write(body);
  else if (output !== -1) writeFileSync(args[output + 1], body);
  else process.stdout.write(body);
}
`);
  for (const command of ["git", "docker", "curl"]) {
    writeFileSync(join(directory, "bin", command),
      `#!/bin/sh\nTEST_COMMAND=${command} exec "$TEST_BUN" "$TEST_STUB" "$@"\n`,
      { mode: 0o755 });
  }
  // Corpus generation is outside this test: the deployed artifacts are verified
  // against their version, while the normal build covers corpus materialization.
  writeFileSync(join(directory, "bin/bun"), "#!/bin/sh\nexit 0\n", { mode: 0o755 });
  const log = join(directory, "compose.log");
  const result = Bun.spawnSync(["bash", join(directory, "deploy/deploy.sh")], {
    env: {
      ...process.env,
      PATH: `${join(directory, "bin")}:${process.env.PATH}`,
      OPFORJA_URL: "http://deploy-test.invalid",
      TEST_DEPLOY_LOG: log,
      TEST_BUN: process.execPath,
      TEST_STUB: stub,
      ...environment,
    },
  });
  return {
    status: result.exitCode,
    output: result.stdout.toString() + result.stderr.toString(),
    compose: existsSync(log) ? readFileSync(log, "utf8") : "",
  };
}

test("despliegue espera los servicios y confirma SHA y acceso obligatorio", () => {
  const result = deploy();
  expect(result.status, result.output).toBe(0);
  expect(result.compose).toContain("up -d --build --wait --wait-timeout 120 build=abc12345");
  expect(result.output).toContain("build abc12345 confirmado");
});

test("un fallo de salud de Compose impide declarar éxito", () => {
  const result = deploy({ TEST_COMPOSE_EXIT: "42" });
  expect(result.status).toBe(42);
  expect(result.output).not.toContain("confirmado");
});

test("un bundle viejo o una sesión pública impiden declarar éxito", () => {
  expect(deploy({ TEST_SERVED_BUILD: "deadbeef" }).status).toBe(1);
  const publicSession = deploy({ TEST_SESSION_STATUS: "200" });
  expect(publicSession.status).toBe(1);
  expect(publicSession.output).toContain("se esperaba 401");
});

test("cambios de código se identifican como dirty; reportes runtime no alteran el SHA", () => {
  const dirty = deploy({ TEST_GIT_STATUS: " M app/src/main.tsx\n", TEST_SERVED_BUILD: "abc12345-dirty" });
  expect(dirty.status).toBe(0);
  expect(dirty.compose).toContain("build=abc12345-dirty");
  const report = deploy({ TEST_GIT_STATUS: "?? docs/bugs/BUG-test/report.md\n" });
  expect(report.status).toBe(0);
  expect(report.compose).not.toContain("-dirty");
});
