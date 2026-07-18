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
import { createBaseWitness } from "../mesa/baseWitness";
import { crearModelo } from "../modelo/operaciones";
import { exportarModelo } from "../serializacion/json";

describe("modelPersistence API", () => {
  test("el token de agente solo lee y escribe por el commit atómico", async () => {
    const repo = repoMemoria();
    const handler = crearModelPersistenceFetchHandler({
      repo,
      sessionResolver: {
        async resolve() {
          return {
            ...sesionTest,
            auth: true,
            authKind: "agent",
          };
        },
      },
    });

    expect((await handler(new Request(
      "http://opforja.test/__deep-opm/modelos",
    ))).status).toBe(200);

    const legacyModel = modeloPersistido("agente-legacy", "No permitido");
    const legacyWrites = [
      new Request("http://opforja.test/__deep-opm/modelos", {
        method: "POST",
        body: JSON.stringify({ modelo: legacyModel }),
      }),
      new Request("http://opforja.test/__deep-opm/workspace", {
        method: "PUT",
        body: JSON.stringify({ indice: { modelos: [], carpetas: [], recientes: [] } }),
      }),
      new Request("http://opforja.test/__deep-opm/modelos/agente-legacy/versiones", {
        method: "POST",
        body: JSON.stringify({ version: versionPersistida("v-legacy"), json: legacyModel.json }),
      }),
      new Request("http://opforja.test/__deep-opm/modelos/agente-legacy/autosave", {
        method: "PUT",
        body: JSON.stringify({
          creadoEn: "2026-07-17T10:00:00.000Z",
          json: legacyModel.json,
          revisionBase: 1,
        }),
      }),
      new Request("http://opforja.test/__deep-opm/modelos/agente-legacy", {
        method: "DELETE",
      }),
    ];
    for (const request of legacyWrites) {
      const response = await handler(request);
      expect(response.status).toBe(403);
    }

    const domainModel = { ...crearModelo("Creado por agente"), id: "agente-atomico" };
    const atomicModel = {
      ...modeloPersistido(domainModel.id, domainModel.nombre),
      json: exportarModelo(domainModel),
    };
    const atomic = await handler(new Request(
      `http://opforja.test/__deep-opm/modelos/${domainModel.id}/revisiones`,
      {
        method: "POST",
        body: JSON.stringify({
          model: atomicModel,
          version: versionPersistida("v-atomica"),
          base: { kind: "new" },
          speciesOnCreate: "modelo",
        }),
      },
    ));
    expect(atomic.status).toBe(200);
    expect(await repo.get(sesionTest, domainModel.id)).not.toBeNull();
    await expect(repo.getWorkspace?.(sesionTest)).resolves.toEqual({
      indice: {
        modelos: [{
          id: domainModel.id,
          carpetaId: null,
          versiones: [expect.objectContaining({ id: "v-atomica" })],
        }],
        carpetas: [],
        recientes: [domainModel.id],
      },
      revision: 1,
    });
  });

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
    const modeloGuardado = { ...modelo, revision: 1 };
    await expect(guardado.json()).resolves.toEqual({ modelo: modeloGuardado });

    const listado = await handler(new Request("http://opforja.test/__deep-opm/modelos?includePayload=1"));
    expect(listado.status).toBe(200);
    await expect(listado.json()).resolves.toEqual({ modelos: [modeloGuardado] });

    const cargado = await handler(new Request("http://opforja.test/__deep-opm/modelos/modelo-1"));
    expect(cargado.status).toBe(200);
    await expect(cargado.json()).resolves.toEqual({ modelo: modeloGuardado });
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

  test("un guardado obsoleto no resucita un modelo ya borrado", async () => {
    const repo = repoMemoria();
    const handler = crearModelPersistenceFetchHandler({ repo });
    const modelo = modeloPersistido("modelo-borrado", "Modelo borrado");
    const creado = await handler(new Request("http://opforja.test/__deep-opm/modelos", {
      method: "POST",
      body: JSON.stringify({ modelo }),
    }));
    expect(creado.status).toBe(200);

    const borrado = await handler(new Request(
      "http://opforja.test/__deep-opm/modelos/modelo-borrado",
      { method: "DELETE" },
    ));
    expect(borrado.status).toBe(200);

    const guardadoTardio = await handler(new Request(
      "http://opforja.test/__deep-opm/modelos",
      {
        method: "POST",
        body: JSON.stringify({ modelo: { ...modelo, revision: 1 } }),
      },
    ));
    expect(guardadoTardio.status).toBe(409);
    expect(await repo.get(sesionTest, modelo.id)).toBeNull();
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
    const repo = repoMemoria();
    const handler = crearModelPersistenceFetchHandler({ repo });

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

    const fechaVersionInvalida = await handler(new Request(
      "http://opforja.test/__deep-opm/modelos/m-version-invalida/revisiones",
      {
        method: "POST",
        body: JSON.stringify({
          model: modeloPersistido("m-version-invalida", "Versión inválida"),
          version: {
            ...versionPersistida("v-fecha-invalida"),
            creadoEn: "no-es-una-fecha",
          },
          base: { kind: "new" },
          speciesOnCreate: "modelo",
        }),
      },
    ));
    expect(fechaVersionInvalida.status).toBe(400);
    expect(await repo.get(sesionTest, "m-version-invalida")).toBeNull();

    const health = await handler(new Request("http://opforja.test/healthz"));
    expect(health.status).toBe(200);
    await expect(health.json()).resolves.toEqual({ ok: true });
  });

  test("persiste workspace, versiones y autosave bajo la sesion", async () => {
    const repo = repoMemoria();
    const handler = crearModelPersistenceFetchHandler({ repo });
    const model = modeloPersistido("modelo-3", "Modelo 3");
    const created = await handler(new Request("http://opforja.test/__deep-opm/modelos", {
      method: "POST",
      body: JSON.stringify({ modelo: model }),
    }));
    expect(created.status).toBe(200);
    const indice: WorkspaceIndice = {
      modelos: [{ id: "modelo-3", carpetaId: "carpeta-1" }],
      carpetas: [{ id: "carpeta-1", nombre: "Proyecto", padreId: null, creadoEn: 1 }],
      recientes: ["modelo-3"],
    };
    const workspace = await handler(new Request("http://opforja.test/__deep-opm/workspace", {
      method: "PUT",
      body: JSON.stringify({ indice, revisionBase: 0 }),
    }));
    expect(workspace.status).toBe(200);
    await expect(workspace.json()).resolves.toEqual({ indice, revision: 1 });

    const staleWorkspace = await handler(new Request(
      "http://opforja.test/__deep-opm/workspace",
      {
        method: "PUT",
        body: JSON.stringify({
          indice: { ...indice, recientes: [] },
          revisionBase: 0,
        }),
      },
    ));
    expect(staleWorkspace.status).toBe(409);
    await expect(repo.getWorkspace?.(sesionTest)).resolves.toEqual({
      indice,
      revision: 1,
    });

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
    const colision = await handler(new Request(
      "http://opforja.test/__deep-opm/modelos/modelo-3/versiones",
      {
        method: "POST",
        body: JSON.stringify({
          version: { ...version, nombre: "No debe sobrescribir" },
          json: JSON.stringify({
            formato: "deep-opm-pro.modelo.v0",
            modelo: { id: "modelo-3", alterado: true },
          }),
        }),
      },
    ));
    expect(colision.status).toBe(409);
    const versionOriginal = await handler(new Request(
      "http://opforja.test/__deep-opm/modelos/modelo-3/versiones/v1",
    ));
    await expect(versionOriginal.json()).resolves.toEqual({
      modeloId: "modelo-3",
      version,
      json: JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id: "modelo-3" } }),
    });

    const autosave = await handler(new Request("http://opforja.test/__deep-opm/modelos/modelo-3/autosave", {
      method: "PUT",
      body: JSON.stringify({
        creadoEn: "2026-06-03T00:00:00.000Z",
        json: JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id: "modelo-3", autosave: true } }),
        revisionBase: 1,
      }),
    }));
    expect(autosave.status).toBe(200);
    await expect(autosave.json()).resolves.toEqual({
      modeloId: "modelo-3",
      creadoEn: "2026-06-03T00:00:00.000Z",
      json: JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id: "modelo-3", autosave: true } }),
    });
  });

  test("commit de revisión guarda modelo+etiqueta y consolida autosave como una sola operación", async () => {
    const modeloBase = { ...crearModelo("Base"), id: "modelo-commit" };
    const base = {
      ...modeloPersistido("modelo-commit", "Base"),
      json: exportarModelo(modeloBase),
      revision: 3,
      autosalvado: true,
    };
    const repo = repoMemoria([base]);
    const autosaveJson = exportarModelo({ ...modeloBase, nombre: "Autosave" });
    await repo.saveAutosave!(sesionTest, {
      modeloId: base.id,
      creadoEn: "2026-07-17T10:00:05.000Z",
      json: autosaveJson,
      revisionBase: 3,
    });
    const witness = createBaseWitness({
      modelId: base.id,
      saved: {
        revision: 3,
        updatedAt: base.actualizadoEn,
        json: base.json,
      },
      autosave: {
        createdAt: "2026-07-17T10:00:05.000Z",
        json: autosaveJson,
      },
    });
    const version = versionPersistida("v-commit");
    const model = {
      ...base,
      nombre: "Revisión agente",
      actualizadoEn: "2026-07-17T10:01:00.000Z",
      json: exportarModelo({ ...modeloBase, nombre: "Revisión agente" }),
      autosalvado: false,
    };
    const handler = crearModelPersistenceFetchHandler({ repo });

    const sinConfirmar = await handler(new Request(
      "http://opforja.test/__deep-opm/modelos/modelo-commit/revisiones",
      {
        method: "POST",
        body: JSON.stringify({
          model,
          version,
          base: { kind: "existing", witness },
        }),
      },
    ));
    expect(sinConfirmar.status).toBe(409);
    expect((await repo.get(sesionTest, base.id))?.revision).toBe(3);
    expect(await repo.listVersions!(sesionTest, base.id)).toEqual([]);
    expect(await repo.getAutosave!(sesionTest, base.id)).not.toBeNull();

    const response = await handler(new Request(
      "http://opforja.test/__deep-opm/modelos/modelo-commit/revisiones",
      {
        method: "POST",
        body: JSON.stringify({
          model,
          version,
          base: { kind: "existing", witness },
          confirmedByOperator: true,
        }),
      },
    ));
    expect(response.status).toBe(200);
    const committed = await response.json() as { model: ModeloPersistido; version: VersionResumen };
    expect(committed.model).toEqual(expect.objectContaining({
      id: "modelo-commit",
      revision: 4,
      autosalvado: false,
    }));
    const versionDerivada = {
      ...version,
      modeloPayloadKey: version.id,
      bytes: new TextEncoder().encode(model.json).byteLength,
    };
    expect(committed.version).toEqual(versionDerivada);

    const autosave = await handler(new Request(
      "http://opforja.test/__deep-opm/modelos/modelo-commit/autosave",
    ));
    expect(autosave.status).toBe(404);
    const versions = await handler(new Request(
      "http://opforja.test/__deep-opm/modelos/modelo-commit/versiones",
    ));
    await expect(versions.json()).resolves.toEqual({ versiones: [versionDerivada] });
  });

  test("commit servidor rechaza candidato artesanal sobre un destino sellado", async () => {
    const modeloSellado = {
      ...crearModelo("Emitido desde proto"),
      id: "modelo-sellado",
      procedencia: {
        protoHash: "proto-servidor",
        autoriaVersion: "1.0.0",
        layoutVersion: "1",
      },
    };
    const initial = {
      ...modeloPersistido(modeloSellado.id, modeloSellado.nombre),
      json: exportarModelo(modeloSellado),
      revision: 1,
    };
    const repo = repoMemoria([initial]);
    const handler = crearModelPersistenceFetchHandler({ repo });
    const witness = createBaseWitness({
      modelId: initial.id,
      saved: {
        revision: 1,
        updatedAt: initial.actualizadoEn,
        json: initial.json,
      },
      autosave: null,
    });
    const { procedencia: _procedencia, ...artesanal } = modeloSellado;
    const candidate = {
      ...initial,
      nombre: "Edición artesanal",
      actualizadoEn: "2026-07-17T10:01:00.000Z",
      json: exportarModelo({ ...artesanal, nombre: "Edición artesanal" }),
    };

    const response = await handler(new Request(
      `http://opforja.test/__deep-opm/modelos/${initial.id}/revisiones`,
      {
        method: "POST",
        body: JSON.stringify({
          model: candidate,
          version: versionPersistida("v-artesanal"),
          base: { kind: "existing", witness },
        }),
      },
    ));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "el modelo tiene proto: edita el proto y recompila (bundle sin sello rechazado)",
    });
    expect(await repo.get(sesionTest, initial.id)).toEqual(initial);
    expect(await repo.listVersions!(sesionTest, initial.id)).toEqual([]);
  });

  test("commit servidor no fabrica revisión cuando el bundle no tiene delta", async () => {
    const domainModel = { ...crearModelo("Sin delta"), id: "modelo-sin-delta" };
    const initial = {
      ...modeloPersistido(domainModel.id, domainModel.nombre),
      json: exportarModelo(domainModel),
      revision: 1,
    };
    const repo = repoMemoria([initial]);
    const handler = crearModelPersistenceFetchHandler({ repo });
    const witness = createBaseWitness({
      modelId: initial.id,
      saved: {
        revision: 1,
        updatedAt: initial.actualizadoEn,
        json: initial.json,
      },
      autosave: null,
    });

    const response = await handler(new Request(
      `http://opforja.test/__deep-opm/modelos/${initial.id}/revisiones`,
      {
        method: "POST",
        body: JSON.stringify({
          model: {
            ...initial,
            actualizadoEn: "2026-07-17T11:00:00.000Z",
          },
          version: versionPersistida("v-sin-delta"),
          base: { kind: "existing", witness },
        }),
      },
    ));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "sin cambios: no se crea revisión",
    });
    expect(await repo.get(sesionTest, initial.id)).toEqual(initial);
    expect(await repo.listVersions!(sesionTest, initial.id)).toEqual([]);
  });

  test("autosave retrasado con revisión obsoleta devuelve 409 y no reaparece", async () => {
    const model = { ...modeloPersistido("modelo-auto-stale", "Vigente"), revision: 2, autosalvado: false };
    const repo = repoMemoria([model]);
    const handler = crearModelPersistenceFetchHandler({ repo });

    const response = await handler(new Request(
      "http://opforja.test/__deep-opm/modelos/modelo-auto-stale/autosave",
      {
        method: "PUT",
        body: JSON.stringify({
          creadoEn: "2026-07-17T10:00:00.000Z",
          json: model.json,
          revisionBase: 1,
        }),
      },
    ));

    expect(response.status).toBe(409);
    expect(await repo.getAutosave!(sesionTest, model.id)).toBeNull();
    expect((await repo.get(sesionTest, model.id))?.autosalvado).toBe(false);
  });

  test("normaliza como posterior un autosave cuya zona horaria oculta que es más antiguo", async () => {
    const model = {
      ...modeloPersistido("modelo-auto-offset", "Base con offset"),
      actualizadoEn: "2026-07-18T09:30:00.000-02:00",
      revision: 1,
    };
    const repo = repoMemoria([model]);
    const handler = crearModelPersistenceFetchHandler({ repo });

    const response = await handler(new Request(
      "http://opforja.test/__deep-opm/modelos/modelo-auto-offset/autosave",
      {
        method: "PUT",
        body: JSON.stringify({
          // 11:00Z es treinta minutos ANTES que 09:30-02:00 (=11:30Z),
          // aunque la comparación textual diga lo contrario.
          creadoEn: "2026-07-18T11:00:00.000Z",
          json: model.json,
          revisionBase: 1,
        }),
      },
    ));

    expect(response.status).toBe(200);
    const body = await response.json() as { creadoEn: string };
    expect(body.creadoEn).toBe("2026-07-18T11:30:00.001Z");
  });

  test("un autosave antiguo retrasado no sobrescribe otro más reciente de la misma revisión", async () => {
    const model = { ...modeloPersistido("modelo-autosaves-invertidos", "Autosaves invertidos"), revision: 1 };
    const repo = repoMemoria([model]);
    const handler = crearModelPersistenceFetchHandler({ repo });
    const newerJson = JSON.stringify({
      formato: "deep-opm-pro.modelo.v0",
      modelo: { id: model.id, value: "newer" },
    });

    const newer = await handler(new Request(
      `http://opforja.test/__deep-opm/modelos/${model.id}/autosave`,
      {
        method: "PUT",
        body: JSON.stringify({
          creadoEn: "2026-07-18T12:02:00.000Z",
          json: newerJson,
          revisionBase: 1,
        }),
      },
    ));
    expect(newer.status).toBe(200);

    const older = await handler(new Request(
      `http://opforja.test/__deep-opm/modelos/${model.id}/autosave`,
      {
        method: "PUT",
        body: JSON.stringify({
          creadoEn: "2026-07-18T12:01:00.000Z",
          json: JSON.stringify({
            formato: "deep-opm-pro.modelo.v0",
            modelo: { id: model.id, value: "older" },
          }),
          revisionBase: 1,
        }),
      },
    ));

    expect(older.status).toBe(409);
    expect(await repo.getAutosave!(sesionTest, model.id)).toEqual({
      modeloId: model.id,
      creadoEn: "2026-07-18T12:02:00.000Z",
      json: newerJson,
    });
  });

  test("commit rechaza revisión obsoleta o autosave aparecido después del pull sin escribir", async () => {
    const initial = { ...modeloPersistido("modelo-stale", "Base"), revision: 3 };
    const repo = repoMemoria([initial]);
    const witness = createBaseWitness({
      modelId: initial.id,
      saved: {
        revision: 3,
        updatedAt: initial.actualizadoEn,
        json: initial.json,
      },
      autosave: null,
    });
    const handler = crearModelPersistenceFetchHandler({ repo });
    const version = versionPersistida("v-stale");
    const model = {
      ...initial,
      actualizadoEn: "2026-07-17T10:01:00.000Z",
      json: JSON.stringify({
        formato: "deep-opm-pro.modelo.v0",
        modelo: { id: "modelo-stale", nombre: "Candidato" },
      }),
      autosalvado: false,
    };

    await repo.saveAutosave!(sesionTest, {
      modeloId: initial.id,
      creadoEn: "2026-07-17T09:59:00.000Z",
      json: initial.json,
      revisionBase: 3,
    });
    const response = await handler(new Request(
      "http://opforja.test/__deep-opm/modelos/modelo-stale/revisiones",
      {
        method: "POST",
        body: JSON.stringify({
          model,
          version,
          base: { kind: "existing", witness },
        }),
      },
    ));

    expect(response.status).toBe(409);
    expect((await repo.get(sesionTest, initial.id))?.json).toBe(initial.json);
    expect(await repo.listVersions!(sesionTest, initial.id)).toEqual([]);
    expect(await repo.getAutosave!(sesionTest, initial.id)).not.toBeNull();
  });

  test("commit rechaza biblioteca marcada después del pull sin avanzar modelo ni versión", async () => {
    const initial = { ...modeloPersistido("modelo-toctou-lib", "Base editable"), revision: 1 };
    const repo = repoMemoria([initial]);
    const handler = crearModelPersistenceFetchHandler({ repo });
    const witness = createBaseWitness({
      modelId: initial.id,
      saved: {
        revision: 1,
        updatedAt: initial.actualizadoEn,
        json: initial.json,
      },
      autosave: null,
    });
    const indiceBiblioteca: WorkspaceIndice = {
      modelos: [{ id: initial.id, carpetaId: null, esBiblioteca: true }],
      carpetas: [],
      recientes: [],
    };
    const marcada = await handler(new Request("http://opforja.test/__deep-opm/workspace", {
      method: "PUT",
      body: JSON.stringify({ indice: indiceBiblioteca, revisionBase: 0 }),
    }));
    expect(marcada.status).toBe(200);

    const candidate = {
      ...initial,
      nombre: "Cambio que no debe entrar",
      actualizadoEn: "2026-07-17T10:01:00.000Z",
      json: JSON.stringify({
        formato: "deep-opm-pro.modelo.v0",
        modelo: { id: initial.id, nombre: "Cambio que no debe entrar" },
      }),
    };
    const response = await handler(new Request(
      `http://opforja.test/__deep-opm/modelos/${initial.id}/revisiones`,
      {
        method: "POST",
        body: JSON.stringify({
          model: candidate,
          version: versionPersistida("v-toctou-lib"),
          base: { kind: "existing", witness },
        }),
      },
    ));

    expect(response.status).toBe(409);
    expect(await repo.get(sesionTest, initial.id)).toEqual(initial);
    expect(await repo.listVersions!(sesionTest, initial.id)).toEqual([]);
  });

  test("colisión de id de versión devuelve 409 sin avanzar el modelo", async () => {
    const initial = { ...modeloPersistido("modelo-version-colision", "Base"), revision: 2 };
    const repo = repoMemoria([initial]);
    const existingVersion = versionPersistida("v-repetida");
    await repo.saveVersion!(sesionTest, {
      modeloId: initial.id,
      version: existingVersion,
      json: initial.json,
    });
    const handler = crearModelPersistenceFetchHandler({ repo });
    const witness = createBaseWitness({
      modelId: initial.id,
      saved: {
        revision: 2,
        updatedAt: initial.actualizadoEn,
        json: initial.json,
      },
      autosave: null,
    });
    const candidate = {
      ...initial,
      nombre: "Candidato",
      actualizadoEn: "2026-07-17T10:02:00.000Z",
      json: JSON.stringify({
        formato: "deep-opm-pro.modelo.v0",
        modelo: { id: initial.id, nombre: "Candidato" },
      }),
    };

    const response = await handler(new Request(
      `http://opforja.test/__deep-opm/modelos/${initial.id}/revisiones`,
      {
        method: "POST",
        body: JSON.stringify({
          model: candidate,
          version: existingVersion,
          base: { kind: "existing", witness },
        }),
      },
    ));

    expect(response.status).toBe(409);
    expect(await repo.get(sesionTest, initial.id)).toEqual(initial);
    expect(await repo.listVersions!(sesionTest, initial.id)).toEqual([existingVersion]);
  });

  test("commit falla cerrado ante id de ruta distinto del modelo", async () => {
    const repo = repoMemoria();
    const handler = crearModelPersistenceFetchHandler({ repo });

    const response = await handler(new Request(
      "http://opforja.test/__deep-opm/modelos/id-ruta/revisiones",
      {
        method: "POST",
        body: JSON.stringify({
          model: modeloPersistido("id-body", "Nuevo"),
          version: versionPersistida("v-new"),
          base: { kind: "new" },
        }),
      },
    ));

    expect(response.status).toBe(400);
    expect(await repo.get(sesionTest, "id-body")).toBeNull();
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
