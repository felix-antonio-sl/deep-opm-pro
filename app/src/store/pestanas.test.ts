import { describe, expect, test } from "bun:test";
import { crearObjeto } from "../modelo/operaciones";
import { crearPestanaDesdeModelo, crearPestanaNueva, abrirPestana, cambiarActiva, cerrarPestana, etiquetaPestana, reordenarPestanas } from "./pestanas";
import type { Modelo } from "../modelo/tipos";

const modeloFalso = (nombre: string): Modelo => ({
  id: `m-${nombre}`,
  nombre,
  entidades: {},
  enlaces: {},
  estados: {},
  opds: { "opd-1": { id: "opd-1", nombre: "SD", padreId: null, refinadorId: null, apariencias: {}, aparienciasEnlaces: {} } },
  opdRaizId: "opd-1",
  metadatos: {},
} as unknown as Modelo);

describe("etiquetaPestana - identidad UNIFICADA P0-1", () => {
  // Corte 3.5 sustracción de chrome: la etiqueta retorna solo el nombre
  // del modelo (o "Modelo" como placeholder). El estado dirty/persistido
  // vive exclusivamente en ChipPersistencia.
  test("modelo persistido devuelve nombre limpio", () => {
    expect(etiquetaPestana({ nombre: "System Diagram", modeloId: "modelo-1" })).toBe("System Diagram");
  });

  test("modelo no persistido con nombre real devuelve solo el nombre", () => {
    expect(etiquetaPestana({ nombre: "OnStar System", modeloId: null })).toBe("OnStar System");
  });

  test("modelo no persistido sin nombre cae en placeholder 'Modelo'", () => {
    expect(etiquetaPestana({ nombre: "", modeloId: null })).toBe("Modelo");
    expect(etiquetaPestana({ nombre: "  ", modeloId: null })).toBe("Modelo");
    expect(etiquetaPestana({ nombre: undefined, modeloId: null })).toBe("Modelo");
  });

  test("modelo persistido sin nombre cae en placeholder 'Modelo'", () => {
    expect(etiquetaPestana({ nombre: "", modeloId: "modelo-1" })).toBe("Modelo");
  });
});

describe("slice de pestanas de sesion", () => {
  test("crearPestanaNueva retorna pestana con etiqueta 'Modelo'", () => {
    const pestana = crearPestanaNueva();

    expect(pestana.etiqueta).toBe("Modelo");
    expect(pestana.modeloId).toBeNull();
    expect(pestana.cargadoDesde).toBe("nuevo");
    expect(pestana.dirty).toBe(false);
    expect(Object.values(pestana.modelo.entidades)).toHaveLength(0);
  });

  test("crearPestanaDesdeModelo importado preserva nombre real sin sufijo", () => {
    const pestana = crearPestanaDesdeModelo(modeloFalso("OnStar System"), {
      modeloId: null,
      nombre: "OnStar System",
      cargadoDesde: "importado",
      dirty: false,
    });

    expect(pestana.etiqueta).toBe("OnStar System");
    expect(pestana.modeloId).toBeNull();
    expect(pestana.cargadoDesde).toBe("importado");
  });

  test("crearPestanaDesdeModelo persistido devuelve el nombre del modelo", () => {
    const pestana = crearPestanaDesdeModelo(modeloFalso("System Diagram"), {
      modeloId: "modelo-1",
      nombre: "System Diagram",
      cargadoDesde: "persistido",
      dirty: false,
    });

    expect(pestana.etiqueta).toBe("System Diagram");
  });

  test("abrirPestana agrega y deja la nueva como activa", () => {
    const primera = crearPestanaNueva();
    const segunda = crearPestanaNueva();

    const estado = abrirPestana({ pestanas: [primera], activa: primera.id }, segunda);

    expect(estado.pestanas.map((p) => p.id)).toEqual([primera.id, segunda.id]);
    expect(estado.activa).toBe(segunda.id);
  });

  test("cerrarPestana protege la ultima y confirma dirty", () => {
    const primera = crearPestanaNueva();
    expect(cerrarPestana({ pestanas: [primera], activa: primera.id }, primera.id).ok).toBe(false);

    const dirty = { ...crearPestanaNueva(), dirty: true };
    const estado = { pestanas: [primera, dirty], activa: dirty.id };
    expect(cerrarPestana(estado, dirty.id).ok).toBe(false);
    expect(cerrarPestana(estado, dirty.id, { forzar: true }).ok).toBe(true);
  });

  test("cerrar activa selecciona la derecha o la izquierda disponible", () => {
    const a = crearPestanaNueva();
    const b = crearPestanaNueva();
    const c = crearPestanaNueva();

    const cerrandoB = cerrarPestana({ pestanas: [a, b, c], activa: b.id }, b.id, { forzar: true });
    expect(cerrandoB.ok).toBe(true);
    if (!cerrandoB.ok) return;
    expect(cerrandoB.value.activa).toBe(c.id);

    const cerrandoC = cerrarPestana({ pestanas: [a, c], activa: c.id }, c.id, { forzar: true });
    expect(cerrandoC.ok).toBe(true);
    if (!cerrandoC.ok) return;
    expect(cerrandoC.value.activa).toBe(a.id);
  });

  test("cambiarActiva no-op si id no existe y cambia si existe", () => {
    const a = crearPestanaNueva();
    const b = crearPestanaNueva();

    expect(cambiarActiva({ pestanas: [a, b], activa: a.id }, "missing").activa).toBe(a.id);
    expect(cambiarActiva({ pestanas: [a, b], activa: a.id }, b.id).activa).toBe(b.id);
  });

  test("reordenarPestanas valida faltantes duplicados y reordena", () => {
    const a = crearPestanaNueva();
    const b = crearPestanaNueva();
    const estado = { pestanas: [a, b], activa: a.id };

    expect(reordenarPestanas(estado, [a.id]).ok).toBe(false);
    expect(reordenarPestanas(estado, [a.id, a.id]).ok).toBe(false);
    const reordenado = reordenarPestanas(estado, [b.id, a.id]);
    expect(reordenado.ok).toBe(true);
    if (!reordenado.ok) return;
    expect(reordenado.value.pestanas.map((p) => p.id)).toEqual([b.id, a.id]);
  });

  test("cada pestana posee su propio modelo clonado", () => {
    const primera = crearPestanaNueva();
    const segunda = crearPestanaNueva();
    const actualizado = crearObjeto(primera.modelo, primera.modelo.opdRaizId, { x: 0, y: 0 }, "A");
    expect(actualizado.ok).toBe(true);
    if (!actualizado.ok) return;
    primera.modelo = actualizado.value;

    expect(Object.values(primera.modelo.entidades)).toHaveLength(1);
    expect(Object.values(segunda.modelo.entidades)).toHaveLength(0);
  });
});
