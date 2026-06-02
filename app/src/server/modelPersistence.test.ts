import { describe, expect, test } from "bun:test";
import type { ModeloPersistido, ResumenModeloPersistido } from "../persistencia/local";
import { crearModelPersistenceFetchHandler, type ModelPersistenceRepository } from "./modelPersistence";

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
    expect(await repo.get("modelo-2")).toBeNull();
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
});

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
  const datos = new Map(inicial.map((modelo) => [modelo.id, modelo]));
  return {
    async list(includePayload = false) {
      const modelos = [...datos.values()].sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn));
      return includePayload ? modelos : modelos.map(({ json: _json, ...resumen }) => resumen satisfies ResumenModeloPersistido);
    },
    async get(id) {
      return datos.get(id) ?? null;
    },
    async save(modelo) {
      datos.set(modelo.id, modelo);
      return modelo;
    },
    async delete(id) {
      return datos.delete(id);
    },
    async health() {
      return true;
    },
  };
}
