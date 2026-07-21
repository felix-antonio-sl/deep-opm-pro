import { beforeEach, describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import { crearOpdSuelto } from "../modelo/operaciones/opdSuelto";
import type { Modelo, Resultado } from "../modelo/tipos";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store.js";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

beforeEach(() => {
  store.getState().importarJson(exportarModelo(crearModelo("Tutor")));
});

describe("gateway transaccional de refinamiento", () => {
  test("iniciar descomposición prepara intención sin mutar modelo ni historial", () => {
    const base = must(crearProceso(store.getState().modelo, store.getState().modelo.opdRaizId, { x: 20, y: 20 }, "Atender"));
    store.getState().importarJson(exportarModelo(base));
    const id = entidadId(store.getState().modelo, "Atender");
    store.getState().seleccionarEntidad(id);
    const antes = exportarModelo(store.getState().modelo);
    const undoAntes = store.getState().puedeDeshacer;

    store.getState().descomponerSeleccionada();

    expect(exportarModelo(store.getState().modelo)).toBe(antes);
    expect(store.getState().puedeDeshacer).toBe(undoAntes);
    expect(store.getState().refinamientoPendiente).toMatchObject({
      tipo: "descomposicion",
      entidadId: id,
      opdPadreId: base.opdRaizId,
    });
  });

  test("confirmar descomposición exige pregunta y un undo revierte OPD, vínculo y pregunta", () => {
    const base = must(crearProceso(store.getState().modelo, store.getState().modelo.opdRaizId, { x: 20, y: 20 }, "Atender"));
    store.getState().importarJson(exportarModelo(base));
    const id = entidadId(store.getState().modelo, "Atender");
    store.getState().seleccionarEntidad(id);
    store.getState().descomponerSeleccionada();
    const antes = exportarModelo(store.getState().modelo);

    store.getState().confirmarRefinamientoPendiente({ preguntaGuia: "   " });
    expect(exportarModelo(store.getState().modelo)).toBe(antes);
    expect(store.getState().refinamientoPendiente?.error).toBe("Escribe una pregunta antes de crear el refinamiento.");

    store.getState().confirmarRefinamientoPendiente({ preguntaGuia: "  ¿Cómo se atiende?  " });
    const hijoId = store.getState().opdActivoId;
    expect(store.getState().modelo.opds[hijoId]?.preguntaGuia).toBe("¿Cómo se atiende?");
    expect(store.getState().refinamientoPendiente).toBeNull();
    expect(store.getState().mensaje).toBeNull();

    store.getState().deshacer();
    expect(exportarModelo(store.getState().modelo)).toBe(antes);
    store.getState().rehacer();
    expect(Object.values(store.getState().modelo.opds).some((opd) => opd.preguntaGuia === "¿Cómo se atiende?")).toBe(true);
  });

  test("despliegue no elige agregación implícita y confirma la relación seleccionada", () => {
    const base = must(crearObjeto(store.getState().modelo, store.getState().modelo.opdRaizId, { x: 20, y: 20 }, "Sistema"));
    store.getState().importarJson(exportarModelo(base));
    const id = entidadId(store.getState().modelo, "Sistema");
    store.getState().seleccionarEntidad(id);
    store.getState().desplegarSeleccionada();

    expect(store.getState().refinamientoPendiente).toMatchObject({ tipo: "despliegue", modo: null });
    store.getState().confirmarRefinamientoPendiente({ preguntaGuia: "¿Qué atributos importan?" });
    expect(store.getState().refinamientoPendiente?.error).toBe("Elige una relación antes de crear el refinamiento.");

    store.getState().confirmarRefinamientoPendiente({
      preguntaGuia: "¿Qué atributos importan?",
      modo: "exhibicion",
    });
    expect(store.getState().modelo.entidades[id]?.refinamientos?.despliegue?.modo).toBe("exhibicion");
  });

  test("adoptar cancela como identidad y undo devuelve el OPD al Taller con su pregunta previa", () => {
    let base = must(crearProceso(store.getState().modelo, store.getState().modelo.opdRaizId, { x: 20, y: 20 }, "Resolver"));
    const suelto = crearOpdSuelto(base, "Hipótesis");
    base = {
      ...suelto.modelo,
      opds: {
        ...suelto.modelo.opds,
        [suelto.opdId]: { ...suelto.modelo.opds[suelto.opdId]!, preguntaGuia: "¿Pregunta previa?" },
      },
    };
    store.getState().importarJson(exportarModelo(base));
    const id = entidadId(store.getState().modelo, "Resolver");
    store.getState().cambiarOpdActivo(base.opdRaizId);
    store.getState().seleccionarEntidad(id);
    const antes = exportarModelo(store.getState().modelo);

    store.getState().adoptarOpdEnSeleccion(suelto.opdId, "descomposicion");
    store.getState().cancelarRefinamientoPendiente();
    expect(exportarModelo(store.getState().modelo)).toBe(antes);

    store.getState().adoptarOpdEnSeleccion(suelto.opdId, "descomposicion");
    store.getState().confirmarRefinamientoPendiente({
      entidadId: id,
      tipo: "descomposicion",
      preguntaGuia: "¿Pregunta adoptada?",
    });
    expect(store.getState().modelo.opds[suelto.opdId]?.preguntaGuia).toBe("¿Pregunta adoptada?");

    store.getState().deshacer();
    expect(exportarModelo(store.getState().modelo)).toBe(antes);
    expect(store.getState().modelo.opds[suelto.opdId]?.preguntaGuia).toBe("¿Pregunta previa?");
  });
});
