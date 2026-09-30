import { expect, test } from "bun:test";
import { encodeSessionIdentity, SESSION_IDENTITY_HEADER } from "../persistencia/sessionIdentity";
import { crearModelPersistenceFetchHandler, type PersistenciaSesion } from "./modelPersistence";
import { crearRepoMemoria } from "./repoMemoria";

test("capability readers never bootstrap an editor session; grant administration requires the operator", async () => {
  let resolved = 0;
  let session: PersistenciaSesion = { tenantId: "tenant", userId: "reader" };
  const handler = crearModelPersistenceFetchHandler({
    repo: crearRepoMemoria(),
    sessionResolver: { async resolve() { resolved++; return session; } },
    reviewPublicHandler: async () => Response.json({ fixedRevision: 3 }),
    reviewOperatorHandler: async (_request, actor) => Response.json({ userId: actor.userId }),
  });
  const read = await handler(new Request("https://opforja.test/__deep-opm/review/synthetic-token"));
  expect(await read.json()).toEqual({ fixedRevision: 3 });
  expect(resolved).toBe(0);
  expect(read.headers.has("set-cookie")).toBe(false);

  const grants = "https://opforja.test/__deep-opm/review/grants";
  expect((await handler(new Request(grants))).status).toBe(401);
  session = { ...session, auth: true, authKind: "agent" };
  expect((await handler(new Request(grants))).status).toBe(403);
  session = { ...session, authKind: "operator" };
  expect((await handler(new Request(grants))).status).toBe(401);
  const operator = await handler(new Request(grants, {
    headers: { [SESSION_IDENTITY_HEADER]: encodeSessionIdentity(session) },
  }));
  expect(await operator.json()).toEqual({ userId: "reader" });
});
