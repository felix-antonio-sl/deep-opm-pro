import { beforeEach, describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import { exportarModelo } from "../serializacion/json";
import { borrarModeloLocal, cargarModeloLocal, guardarModeloLocal, listarModelosLocales } from "./local";

describe("persistencia local estructurada", () => {
  beforeEach(() => {
    instalarLocalStorage();
  });

  test("lista, guarda, carga y borra modelos locales", () => {
    const modelo = crearModelo("Modelo persistente");
    const guardado = guardarModeloLocal({
      nombre: modelo.nombre,
      descripcion: "corte local",
      json: exportarModelo(modelo),
    });
    expect(guardado.ok).toBe(true);
    if (!guardado.ok) return;

    const listado = listarModelosLocales();
    expect(listado.ok).toBe(true);
    if (!listado.ok) return;
    expect(listado.value).toEqual([
      expect.objectContaining({
        id: guardado.value.id,
        nombre: "Modelo persistente",
        descripcion: "corte local",
      }),
    ]);

    const cargado = cargarModeloLocal(guardado.value.id);
    expect(cargado.ok).toBe(true);
    if (!cargado.ok) return;
    expect(cargado.value.json).toBe(exportarModelo(modelo));

    const borrado = borrarModeloLocal(guardado.value.id);
    expect(borrado.ok).toBe(true);
    expect(listarModelosLocales()).toEqual({ ok: true, value: [] });
  });

  test("guardar con id existente actualiza sin duplicar el indice", () => {
    const modelo = crearModelo("Modelo incremental");
    const inicial = guardarModeloLocal({ nombre: modelo.nombre, json: exportarModelo(modelo) });
    expect(inicial.ok).toBe(true);
    if (!inicial.ok) return;

    const actualizadoModelo = crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 });
    expect(actualizadoModelo.ok).toBe(true);
    if (!actualizadoModelo.ok) return;
    const actualizado = guardarModeloLocal({
      id: inicial.value.id,
      nombre: "Modelo incremental actualizado",
      json: exportarModelo(actualizadoModelo.value),
    });
    expect(actualizado.ok).toBe(true);
    if (!actualizado.ok) return;

    const listado = listarModelosLocales();
    expect(listado.ok).toBe(true);
    if (!listado.ok) return;
    expect(listado.value).toHaveLength(1);
    expect(listado.value[0]?.id).toBe(inicial.value.id);
    expect(listado.value[0]?.nombre).toBe("Modelo incremental actualizado");
    expect(cargarModeloLocal(inicial.value.id)).toEqual(expect.objectContaining({
      ok: true,
      value: expect.objectContaining({ json: exportarModelo(actualizadoModelo.value) }),
    }));
  });

  test("tolera entradas legacy sin descripcion en indice y documento", () => {
    const modelo = crearModelo("Modelo legacy");
    const json = exportarModelo(modelo);
    const ahora = "2026-05-05T00:00:00.000Z";
    localStorage.setItem("deep-opm-pro:persistencia:index", JSON.stringify({
      formato: "deep-opm-pro.persistencia.local.v1",
      modelos: [{
        id: "legacy-1",
        nombre: "Modelo legacy",
        creadoEn: ahora,
        actualizadoEn: ahora,
      }],
    }));
    localStorage.setItem("deep-opm-pro:persistencia:modelo:legacy-1", JSON.stringify({
      formato: "deep-opm-pro.persistencia.local.v1",
      modelo: {
        id: "legacy-1",
        nombre: "Modelo legacy",
        creadoEn: ahora,
        actualizadoEn: ahora,
        json,
      },
    }));

    expect(listarModelosLocales()).toEqual({
      ok: true,
      value: [expect.objectContaining({ id: "legacy-1", descripcion: "" })],
    });
    expect(cargarModeloLocal("legacy-1")).toEqual({
      ok: true,
      value: expect.objectContaining({ id: "legacy-1", descripcion: "", json }),
    });
  });
});

function instalarLocalStorage(): void {
  const datos = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => datos.get(key) ?? null,
      setItem: (key: string, value: string) => datos.set(key, value),
      removeItem: (key: string) => datos.delete(key),
      clear: () => datos.clear(),
    },
  });
}

// ── Operaciones de workspace (L4: jerarquía de carpetas) ───────────

import { describe as describe2, expect as expect2, test as test2 } from "bun:test";
import {
  crearCarpeta,
  eliminarCarpeta,
  indiceVacio,
  listarHijosDeCarpeta,
  moverModeloACarpeta,
  renombrarCarpeta,
  rutaDeCarpeta,
} from "./workspace";

describe2("workspace carpetas (L4)", () => {
  test2("crearCarpeta con padre nulo crea carpeta raíz", () => {
    const indice = indiceVacio();
    const r = crearCarpeta(indice, "Proyectos", null);
    expect2(r.ok).toBe(true);
    if (!r.ok) return;
    expect2(r.value.carpeta.nombre).toBe("Proyectos");
    expect2(r.value.carpeta.padreId).toBeNull();
    expect2(r.value.indice.carpetas).toHaveLength(1);
  });

  test2("crearCarpeta con duplicado en mismo padre falla", () => {
    const indice = indiceVacio();
    const r1 = crearCarpeta(indice, "Demo", null);
    expect2(r1.ok).toBe(true);
    if (!r1.ok) return;
    const r2 = crearCarpeta(r1.value.indice, "Demo", null);
    expect2(r2.ok).toBe(false);
    if (!r2.ok) {
      expect2(r2.error).toContain("Ya existe");
    }
  });

  test2("renombrarCarpeta valida unicidad por padre", () => {
    const indice = indiceVacio();
    const r = crearCarpeta(indice, "A", null);
    expect2(r.ok).toBe(true);
    if (!r.ok) return;
    const r2 = crearCarpeta(r.value.indice, "B", null);
    expect2(r2.ok).toBe(true);
    if (!r2.ok) return;

    const rRename = renombrarCarpeta(r2.value.indice, r2.value.carpeta.id, "A");
    expect2(rRename.ok).toBe(false);
    if (!rRename.ok) {
      expect2(rRename.error).toContain("Ya existe");
    }
  });

  test2("renombrarCarpeta acepta nombre vacío como error", () => {
    const indice = indiceVacio();
    const r = crearCarpeta(indice, "X", null);
    expect2(r.ok).toBe(true);
    if (!r.ok) return;
    const rRename = renombrarCarpeta(r.value.indice, r.value.carpeta.id, "   ");
    expect2(rRename.ok).toBe(false);
  });

  test2("eliminarCarpeta sin cascada falla si tiene hijos", () => {
    let indice = indiceVacio();
    const r = crearCarpeta(indice, "Padre", null);
    expect2(r.ok).toBe(true);
    if (!r.ok) return;
    indice = r.value.indice;
    const r2 = crearCarpeta(indice, "Hija", r.value.carpeta.id);
    expect2(r2.ok).toBe(true);
    if (!r2.ok) return;
    indice = r2.value.indice;

    const rDel = eliminarCarpeta(indice, r.value.carpeta.id, { cascada: false });
    expect2(rDel.ok).toBe(false);
    if (!rDel.ok) {
      expect2(rDel.error).toContain("no está vacía");
    }
  });

  test2("eliminarCarpeta con cascada elimina recursivamente y modelos quedan en raíz", () => {
    let indice = indiceVacio();
    const rPadre = crearCarpeta(indice, "Padre", null);
    expect2(rPadre.ok).toBe(true);
    if (!rPadre.ok) return;
    indice = rPadre.value.indice;

    const rHija = crearCarpeta(indice, "Hija", rPadre.value.carpeta.id);
    expect2(rHija.ok).toBe(true);
    if (!rHija.ok) return;
    indice = rHija.value.indice;

    indice = {
      ...indice,
      modelos: [{ id: "model-1", carpetaId: rHija.value.carpeta.id }],
    };

    const rDel = eliminarCarpeta(indice, rPadre.value.carpeta.id, { cascada: true });
    expect2(rDel.ok).toBe(true);
    if (!rDel.ok) return;
    expect2(rDel.value.carpetas).toHaveLength(0);
    const modelo = rDel.value.modelos[0];
    expect2(modelo).toBeDefined();
    if (modelo) expect2(modelo.carpetaId).toBeNull();
  });

  test2("moverModeloACarpeta cambia carpetaId", () => {
    let indice = indiceVacio();
    const r = crearCarpeta(indice, "Destino", null);
    expect2(r.ok).toBe(true);
    if (!r.ok) return;
    indice = {
      ...r.value.indice,
      modelos: [{ id: "model-1", carpetaId: null }],
    };

    const rMov = moverModeloACarpeta(indice, "model-1", r.value.carpeta.id);
    expect2(rMov.ok).toBe(true);
    if (!rMov.ok) return;
    const modelo = rMov.value.modelos.find((m) => m.id === "model-1");
    expect2(modelo?.carpetaId).toBe(r.value.carpeta.id);
  });

  test2("moverModeloACarpeta con carpeta inexistente falla", () => {
    const indice = { ...indiceVacio(), modelos: [{ id: "model-1", carpetaId: null }] };
    const rMov = moverModeloACarpeta(indice, "model-1", "no-existe");
    expect2(rMov.ok).toBe(false);
  });

  test2("listarHijosDeCarpeta(null) devuelve hijos de raíz orden alfabético", () => {
    let indice = indiceVacio();
    const r1 = crearCarpeta(indice, "Beta", null);
    const r2 = crearCarpeta(r1.ok ? r1.value.indice : indice, "Alfa", null);
    if (!r1.ok || !r2.ok) return;
    indice = r2.value.indice;

    const hijos = listarHijosDeCarpeta(indice, null);
    expect2(hijos.carpetas).toHaveLength(2);
    const c0 = hijos.carpetas[0]!;
    const c1 = hijos.carpetas[1]!;
    expect2(c0.nombre).toBe("Alfa");
    expect2(c1.nombre).toBe("Beta");
  });

  test2("listarHijosDeCarpeta incluye modelos de la carpeta", () => {
    let indice = indiceVacio();
    const r = crearCarpeta(indice, "F", null);
    if (!r.ok) return;
    indice = {
      ...r.value.indice,
      modelos: [{ id: "m1", carpetaId: r.value.carpeta.id }],
    };

    const hijos = listarHijosDeCarpeta(indice, r.value.carpeta.id);
    expect2(hijos.modelos).toHaveLength(1);
    const m0 = hijos.modelos[0]!;
    expect2(m0.id).toBe("m1");
  });

  test2("rutaDeCarpeta devuelve breadcrumb correcto en jerarquía de >= 3 niveles", () => {
    let indice = indiceVacio();
    const rA = crearCarpeta(indice, "A", null);
    if (!rA.ok) return;
    const rB = crearCarpeta(rA.value.indice, "B", rA.value.carpeta.id);
    if (!rB.ok) return;
    const rC = crearCarpeta(rB.value.indice, "C", rB.value.carpeta.id);
    if (!rC.ok) return;

    const ruta = rutaDeCarpeta(rC.value.indice, rC.value.carpeta.id);
    expect2(ruta).toHaveLength(3);
    const [ra, rb, rc] = ruta as [typeof ruta[0], typeof ruta[0], typeof ruta[0]];
    expect2(ra!.nombre).toBe("A");
    expect2(rb!.nombre).toBe("B");
    expect2(rc!.nombre).toBe("C");
    expect2(rc!.id).toBe(rC.value.carpeta.id);
  });

  test2("rutaDeCarpeta(null) devuelve array vacío", () => {
    const ruta = rutaDeCarpeta(indiceVacio(), null);
    expect2(ruta).toEqual([]);
  });
});
