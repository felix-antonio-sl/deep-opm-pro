import { describe, expect, test } from "bun:test";
import type { ModeloPersistido } from "../persistencia/modelos";
import type { WorkspaceIndice } from "../persistencia/workspace";
import type { VersionResumen } from "../modelo/tipos";
import {
  crearModelPersistenceFetchHandler,
  PersistenciaConflictError,
  type ModelPersistenceRepository,
  type PersistenciaSesion,
} from "./modelPersistence";
import { crearRepoMemoria } from "./repoMemoria";

describe("modelPersistence API", () => {
  test("guarda, lista con payload y carga un modelo persistido", async () => {
    const repo = repoMemoria();
    const handler = crearModelPersistenceFetchHandler({ repo });
    const modelo = modeloPersistido("modelo-1", "Modelo servidor");

    const guardado = await handler(new Request("http://opforja.test/__deep-opm/modelos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ modelo }),
    }));
    expect(guardado.status).toBe(200);
    await expect(guardado.json()).resolves.toEqual({ modelo });

    const listado = await handler(new Request("http://opforja.test/__deep-opm/modelos?includePayload=1"));
    expect(listado.status).toBe(200);
    await expect(listado.json()).resolves.toEqual({ modelos: [modelo] });

    const cargado = await handler(new Request("http://opforja.test/__deep-opm/modelos/modelo-1"));
    expect(cargado.status).toBe(200);
    await expect(cargado.json()).resolves.toEqual({ modelo });
  });

  test("lista sin payload como resumen y borra por id", async () => {
    const modelo = modeloPersistido("modelo-2", "Modelo resumen");
    const repo = repoMemoria([modelo]);
    const handler = crearModelPersistenceFetchHandler({ repo });

    const listado = await handler(new Request("http://opforja.test/__deep-opm/modelos"));
    expect(listado.status).toBe(200);
    await expect(listado.json()).resolves.toEqual({
      modelos: [expect.objectContaining({ id: "modelo-2", nombre: "Modelo resumen" })],
    });

    const borrado = await handler(new Request("http://opforja.test/__deep-opm/modelos/modelo-2", { method: "DELETE" }));
    expect(borrado.status).toBe(200);
    await expect(borrado.json()).resolves.toEqual({ ok: true });
    expect(await repo.get(sesionTest, "modelo-2")).toBeNull();
  });

  test("preserva esBiblioteca en el roundtrip POST -> GET (whitelist)", async () => {
    const repo = repoMemoria();
    const handler = crearModelPersistenceFetchHandler({ repo });
    const modelo: ModeloPersistido = { ...modeloPersistido("modelo-lib", "Biblioteca gist"), esBiblioteca: true };

    const guardado = await handler(new Request("http://opforja.test/__deep-opm/modelos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ modelo }),
    }));
    expect(guardado.status).toBe(200);

    const cargado = await handler(new Request("http://opforja.test/__deep-opm/modelos/modelo-lib"));
    expect(cargado.status).toBe(200);
    const payload = await cargado.json() as { modelo: ModeloPersistido };
    expect(payload.modelo.esBiblioteca).toBe(true);

    // Un modelo sin el flag no lo gana en el roundtrip (omisión, no falso por defecto).
    const sinFlag = modeloPersistido("modelo-normal", "Modelo normal");
    await handler(new Request("http://opforja.test/__deep-opm/modelos", {
      method: "POST",
      body: JSON.stringify({ modelo: sinFlag }),
    }));
    const cargadoSinFlag = await handler(new Request("http://opforja.test/__deep-opm/modelos/modelo-normal"));
    const payloadSinFlag = await cargadoSinFlag.json() as { modelo: ModeloPersistido };
    expect(payloadSinFlag.modelo.esBiblioteca).toBeUndefined();
  });

  test("rechaza payload invalido y expone health", async () => {
    const handler = crearModelPersistenceFetchHandler({ repo: repoMemoria() });

    const invalido = await handler(new Request("http://opforja.test/__deep-opm/modelos", {
      method: "POST",
      body: JSON.stringify({ modelo: { id: "" } }),
    }));
    expect(invalido.status).toBe(400);
    await expect(invalido.json()).resolves.toEqual({ error: "Modelo persistido invalido: id" });

    const jsonInvalido = await handler(new Request("http://opforja.test/__deep-opm/modelos", {
      method: "POST",
      body: JSON.stringify({ modelo: { ...modeloPersistido("m-json", "JSON invalido"), json: "{" } }),
    }));
    expect(jsonInvalido.status).toBe(400);
    await expect(jsonInvalido.json()).resolves.toEqual({ error: "Modelo persistido invalido: json" });

    const health = await handler(new Request("http://opforja.test/healthz"));
    expect(health.status).toBe(200);
    await expect(health.json()).resolves.toEqual({ ok: true });
  });

  test("persiste workspace, versiones y autosave bajo la sesion", async () => {
    const repo = repoMemoria();
    const handler = crearModelPersistenceFetchHandler({ repo });
    const indice: WorkspaceIndice = {
      modelos: [{ id: "modelo-3", carpetaId: "carpeta-1" }],
      carpetas: [{ id: "carpeta-1", nombre: "Proyecto", padreId: null, creadoEn: 1 }],
      recientes: ["modelo-3"],
    };
    const workspace = await handler(new Request("http://opforja.test/__deep-opm/workspace", {
      method: "PUT",
      body: JSON.stringify({ indice }),
    }));
    expect(workspace.status).toBe(200);
    await expect(workspace.json()).resolves.toEqual({ indice });

    const version = versionPersistida("v1");
    const guardada = await handler(new Request("http://opforja.test/__deep-opm/modelos/modelo-3/versiones", {
      method: "POST",
      body: JSON.stringify({
        version,
        json: JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id: "modelo-3" } }),
      }),
    }));
    expect(guardada.status).toBe(200);
    await expect(guardada.json()).resolves.toEqual({
      modeloId: "modelo-3",
      version,
      json: JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id: "modelo-3" } }),
    });

    const autosave = await handler(new Request("http://opforja.test/__deep-opm/modelos/modelo-3/autosave", {
      method: "PUT",
      body: JSON.stringify({
        creadoEn: "2026-06-03T00:00:00.000Z",
        json: JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id: "modelo-3", autosave: true } }),
      }),
    }));
    expect(autosave.status).toBe(200);
    await expect(autosave.json()).resolves.toEqual({
      modeloId: "modelo-3",
      creadoEn: "2026-06-03T00:00:00.000Z",
      json: JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id: "modelo-3", autosave: true } }),
    });
  });

  test("emite cookie de sesion y aisla por tenant", async () => {
    const repo = repoMemoria();
    let llamadas = 0;
    const handler = crearModelPersistenceFetchHandler({
      repo,
      sessionResolver: {
        async resolve() {
          llamadas += 1;
          if (llamadas <= 2) {
            return { tenantId: "tenant-a", userId: "user-a", setCookie: "opforja_session=a; Path=/; HttpOnly" };
          }
          return { tenantId: "tenant-b", userId: "user-b" };
        },
      },
    });

    const sesion = await handler(new Request("http://opforja.test/__deep-opm/session"));
    expect(sesion.status).toBe(200);
    expect(sesion.headers.get("set-cookie")).toContain("opforja_session=a");

    const modelo = modeloPersistido("modelo-tenant", "Tenant A");
    await handler(new Request("http://opforja.test/__deep-opm/modelos", {
      method: "POST",
      body: JSON.stringify({ modelo }),
    }));

    const listadoTenantB = await handler(new Request("http://opforja.test/__deep-opm/modelos?includePayload=1"));
    await expect(listadoTenantB.json()).resolves.toEqual({ modelos: [] });
  });

  test("devuelve 409 cuando el repositorio detecta conflicto de revision", async () => {
    const repo = repoMemoria();
    repo.save = async () => {
      throw new PersistenciaConflictError();
    };
    const handler = crearModelPersistenceFetchHandler({ repo });

    const respuesta = await handler(new Request("http://opforja.test/__deep-opm/modelos", {
      method: "POST",
      body: JSON.stringify({ modelo: modeloPersistido("modelo-conflicto", "Conflicto") }),
    }));

    expect(respuesta.status).toBe(409);
    await expect(respuesta.json()).resolves.toEqual({
      error: "Modelo desactualizado; recarga antes de guardar",
    });
  });
});

const sesionTest: PersistenciaSesion = { tenantId: "tenant-test", userId: "user-test" };

function modeloPersistido(id: string, nombre: string): ModeloPersistido {
  return {
    id,
    nombre,
    descripcion: "Persistido en servidor",
    creadoEn: "2026-06-02T00:00:00.000Z",
    actualizadoEn: "2026-06-02T00:00:01.000Z",
    carpetaId: null,
    json: JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id, nombre } }),
  };
}

function repoMemoria(inicial: ModeloPersistido[] = []): ModelPersistenceRepository {
  // Delega en el repositorio en memoria compartido (src/server/repoMemoria.ts),
  // que también consume el middleware dev de vite. Mantener una sola fuente
  // evita drift entre lo que el smoke valida y lo que el dev server sirve.
  return crearRepoMemoria(inicial, sesionTest);
}

function versionPersistida(id: string): VersionResumen {
  return {
    id,
    creadoEn: "2026-06-03T00:00:00.000Z",
    nombre: "Snapshot",
    modeloPayloadKey: `modelo-3:${id}`,
    bytes: 10,
  };
}

