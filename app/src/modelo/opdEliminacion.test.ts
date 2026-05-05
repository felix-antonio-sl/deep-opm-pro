import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso, descomponerProceso } from "./operaciones";
import { diagnosticarEliminacionOpd, eliminarOpdHoja, MENSAJE_ELIMINAR_DESCENDIENTES } from "./opdEliminacion";
import type { ExtremoEnlace, Id, Modelo, Resultado } from "./tipos";

describe("eliminacion segura de OPDs hoja", () => {
  test("diagnostico bloquea raiz SD", () => {
    const modelo = crearModelo();

    const diagnostico = diagnosticarEliminacionOpd(modelo, modelo.opdRaizId);

    expect(diagnostico.ok).toBe(true);
    if (!diagnostico.ok) return;
    expect(diagnostico.value).toMatchObject({
      hoja: false,
      hijos: [],
      motivoBloqueo: "No se puede eliminar el OPD raíz SD",
    });
  });

  test("diagnostico bloquea OPD con hijo y lista hijos", () => {
    const { modelo, opdHijoId, opdNietoId } = modeloConHojaAnidada();

    const diagnostico = diagnosticarEliminacionOpd(modelo, opdHijoId);

    expect(diagnostico.ok).toBe(true);
    if (!diagnostico.ok) return;
    expect(diagnostico.value.hoja).toBe(false);
    expect(diagnostico.value.hijos).toEqual([opdNietoId]);
    expect(diagnostico.value.motivoBloqueo).toContain(MENSAJE_ELIMINAR_DESCENDIENTES);
  });

  test("eliminar hoja remueve OPD, limpia refinamiento y evita referencias huerfanas", () => {
    const { modelo, opdHijoId, procesoId, externoId, internoId } = modeloConOpdHoja();

    const eliminado = eliminarOpdHoja(modelo, opdHijoId);

    expect(eliminado.ok).toBe(true);
    if (!eliminado.ok) return;
    expect(eliminado.value.entidadRefinadaId).toBe(procesoId);
    expect(eliminado.value.opdActivoSugerido).toBe(modelo.opdRaizId);
    expect(eliminado.value.modelo.opds[opdHijoId]).toBeUndefined();
    expect(eliminado.value.modelo.entidades[procesoId]?.refinamiento).toBeUndefined();
    expect(eliminado.value.modelo.entidades[externoId]).toBeDefined();
    expect(eliminado.value.modelo.entidades[internoId]).toBeUndefined();
    assertSinReferenciasHuerfanas(eliminado.value.modelo);
  });
});

function modeloConOpdHoja(): { modelo: Modelo; opdHijoId: Id; procesoId: Id; externoId: Id; internoId: Id } {
  let modelo = crearModelo("Eliminar hoja");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 120 }, "Entrada"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 240, y: 120 }, "Procesar"));
  const externoId = entidadPorNombre(modelo, "Entrada");
  const procesoId = entidadPorNombre(modelo, "Procesar");
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, externoId, procesoId, "consumo"));
  const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
  modelo = descompuesto.modelo;
  modelo = must(crearObjeto(modelo, descompuesto.opdId, { x: 80, y: 220 }, "Interno"));
  const internoId = entidadPorNombre(modelo, "Interno");
  const subprocesoId = entidadPorNombre(modelo, "Procesar 2");
  modelo = must(crearEnlace(modelo, descompuesto.opdId, internoId, subprocesoId, "consumo"));

  return { modelo, opdHijoId: descompuesto.opdId, procesoId, externoId, internoId };
}

function modeloConHojaAnidada(): { modelo: Modelo; opdHijoId: Id; opdNietoId: Id } {
  let modelo = crearModelo("Eliminar interna");
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 240, y: 120 }, "Procesar"));
  const procesoId = entidadPorNombre(modelo, "Procesar");
  const hijo = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
  modelo = hijo.modelo;
  const subprocesoId = entidadPorNombre(modelo, "Procesar 1");
  const nieto = must(descomponerProceso(modelo, hijo.opdId, subprocesoId));
  return { modelo: nieto.modelo, opdHijoId: hijo.opdId, opdNietoId: nieto.opdId };
}

function assertSinReferenciasHuerfanas(modelo: Modelo): void {
  for (const opd of Object.values(modelo.opds)) {
    for (const apariencia of Object.values(opd.apariencias)) {
      expect(modelo.entidades[apariencia.entidadId]).toBeDefined();
      expect(apariencia.opdId).toBe(opd.id);
    }
    for (const apariencia of Object.values(opd.enlaces)) {
      expect(modelo.enlaces[apariencia.enlaceId]).toBeDefined();
      expect(apariencia.opdId).toBe(opd.id);
    }
  }
  for (const enlace of Object.values(modelo.enlaces)) {
    expectExtremoValido(modelo, enlace.origenId);
    expectExtremoValido(modelo, enlace.destinoId);
  }
}

function expectExtremoValido(modelo: Modelo, extremo: ExtremoEnlace): void {
  if (extremo.kind === "entidad") {
    expect(modelo.entidades[extremo.id]).toBeDefined();
    return;
  }
  expect(modelo.estados[extremo.id]).toBeDefined();
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
