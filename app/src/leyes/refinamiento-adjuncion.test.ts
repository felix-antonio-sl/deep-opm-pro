import { describe, expect, test } from "bun:test";
import {
  crearEnlace,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
} from "../modelo/operaciones";
import { quitarRefinamientoEntidad } from "../modelo/operaciones/refinamiento";
import { extremoEntidad } from "../modelo/extremos";
import { tieneRefinamiento } from "../modelo/refinamientos";
import {
  firmaFronteraEntidad,
  observarPreservacionFrontera,
  verificarLiftCartesianoFrontera,
} from "../modelo/equivalencia";
import type { Enlace, Id, Modelo, Resultado } from "../modelo/tipos";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Fixture fail: ${resultado.error}`);
  return resultado.value;
}

function eid(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((it) => it.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

/** Entrada --consumo--> Procesar --resultado--> Salida (frontera no trivial de Procesar). */
function modeloEntradaProcesoSalida(): Modelo {
  let modelo = crearModelo("Eje vertical");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 120 }, "Entrada"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 120 }, "Procesar"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 560, y: 120 }, "Salida"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(eid(modelo, "Entrada")), extremoEntidad(eid(modelo, "Procesar")), "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(eid(modelo, "Procesar")), extremoEntidad(eid(modelo, "Salida")), "resultado"));
  return modelo;
}

function igualFirma(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const f of a) if (!b.has(f)) return false;
  return true;
}

function clonar(modelo: Modelo): Modelo {
  return JSON.parse(JSON.stringify(modelo)) as Modelo;
}

function enlacesDeOpd(modelo: Modelo, opdId: Id): Enlace[] {
  return Object.values(modelo.opds[opdId]?.enlaces ?? {})
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((enlace): enlace is Enlace => Boolean(enlace));
}

// --- Mutiladores para controles de no-tautología (deben romper la ley) ---

/** Simula un out-zoom defectuoso: borra un enlace de frontera original del proceso. */
function quitarEnlaceFronteraDe(modelo: Modelo, entidadId: Id, tipo: string): Modelo {
  const m = clonar(modelo);
  const blanco = Object.values(m.enlaces).find(
    (enlace) => enlace.tipo === tipo && !enlace.derivado &&
      (enlace.origenId.id === entidadId || enlace.destinoId.id === entidadId),
  );
  if (!blanco) return m;
  delete m.enlaces[blanco.id];
  for (const opd of Object.values(m.opds)) {
    opd.enlaces = Object.fromEntries(Object.entries(opd.enlaces).filter(([, a]) => a.enlaceId !== blanco.id));
  }
  return m;
}

/** Corrompe el lift: apunta el derivado a un enlace padre inexistente (lift huérfano). */
function corromperEnlacePadreId(modelo: Modelo, opdHijoId: Id): Modelo {
  const m = clonar(modelo);
  const derivado = enlacesDeOpd(m, opdHijoId).find((e) => e.derivado?.tipo === "enlace-externo-refinamiento");
  if (derivado?.derivado) derivado.derivado.enlacePadreId = "enlace-fantasma";
  return m;
}

/** Borra un derivado de frontera del hijo (lift faltante). */
function quitarUnLift(modelo: Modelo, opdHijoId: Id): Modelo {
  const m = clonar(modelo);
  const derivado = enlacesDeOpd(m, opdHijoId).find((e) => e.derivado?.tipo === "enlace-externo-refinamiento");
  if (!derivado) return m;
  delete m.enlaces[derivado.id];
  const opd = m.opds[opdHijoId];
  if (opd) {
    opd.enlaces = Object.fromEntries(Object.entries(opd.enlaces).filter(([, a]) => a.enlaceId !== derivado.id));
  }
  return m;
}

describe("LEY F-V1 — refinamiento como adjunción in-zoom ⊣ out-zoom", () => {
  test("F-V1 unit: out-zoom ∘ in-zoom preserva exactamente la frontera del proceso", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");
    const firmaAntes = firmaFronteraEntidad(modelo, modelo.opdRaizId, procesoId);
    expect(firmaAntes.size).toBeGreaterThan(0); // frontera no trivial: la ley no es vacía

    const inZoom = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    const outZoom = must(quitarRefinamientoEntidad(inZoom.modelo, procesoId, "descomposicion"));
    const firmaDespues = firmaFronteraEntidad(outZoom, outZoom.opdRaizId, procesoId);

    expect(igualFirma(firmaDespues, firmaAntes)).toBe(true);
    expect(tieneRefinamiento(outZoom.entidades[procesoId]!)).toBe(false);
  });

  test("F-V1 idempotencia: in-zoom es la unit aplicada una sola vez", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");
    const z1 = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    const z2 = must(descomponerProceso(z1.modelo, modelo.opdRaizId, procesoId));
    expect(z1.creado).toBe(true);
    expect(z2.creado).toBe(false);
    expect(z2.opdId).toBe(z1.opdId);
  });

  test("F-V1 control de no-tautología: la igualdad de firmas detecta una frontera mutilada", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");
    const firmaAntes = firmaFronteraEntidad(modelo, modelo.opdRaizId, procesoId);

    const inZoom = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    const outZoom = must(quitarRefinamientoEntidad(inZoom.modelo, procesoId, "descomposicion"));
    const mutilado = quitarEnlaceFronteraDe(outZoom, procesoId, "consumo");
    const firmaMutilada = firmaFronteraEntidad(mutilado, mutilado.opdRaizId, procesoId);

    expect(igualFirma(firmaMutilada, firmaAntes)).toBe(false);
    const perdidos = [...firmaAntes].filter((f) => !firmaMutilada.has(f));
    expect(perdidos.some((f) => f.includes("consumo"))).toBe(true);
  });
});

describe("LEY F-V2 — árbol de OPDs como fibración (lift cartesiano de frontera)", () => {
  test("F-V2 cartesiano: la proyección de frontera es biyección padre ↔ hijo", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");
    const inZoom = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));

    const lift = verificarLiftCartesianoFrontera(inZoom.modelo, modelo.opdRaizId, procesoId, inZoom.opdId);
    expect(lift.cartesiano).toBe(true);
    expect(lift.enlacesFronteraPadre.length).toBe(2); // consumo + resultado
    expect(lift.faltantes).toEqual([]);
    expect(lift.duplicados).toEqual([]);
    expect(lift.huerfanos).toEqual([]);
    expect(lift.baseIncoherente).toEqual([]);
  });

  test("F-V2 cambio de base funtorial: un enlace de frontera posterior al in-zoom recibe su lift", () => {
    let modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");
    const inZoom = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    modelo = inZoom.modelo;
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 280, y: 360 }, "Auditoria"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(procesoId), extremoEntidad(eid(modelo, "Auditoria")), "resultado"));

    const lift = verificarLiftCartesianoFrontera(modelo, modelo.opdRaizId, procesoId, inZoom.opdId);
    expect(lift.enlacesFronteraPadre.length).toBe(3); // consumo + 2 resultados
    expect(lift.faltantes).toEqual([]);
    expect(lift.cartesiano).toBe(true);
  });

  test("F-V2 control de no-tautología: un lift huérfano rompe la cartesianidad", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");
    const inZoom = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    const mutilado = corromperEnlacePadreId(inZoom.modelo, inZoom.opdId);

    const lift = verificarLiftCartesianoFrontera(mutilado, modelo.opdRaizId, procesoId, inZoom.opdId);
    expect(lift.cartesiano).toBe(false);
    expect(lift.huerfanos.length).toBeGreaterThan(0);
    expect(lift.faltantes.length).toBeGreaterThan(0); // el enlace padre real quedó sin lift
  });

  test("F-V2 control de no-tautología: un lift faltante rompe la cartesianidad", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");
    const inZoom = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    const mutilado = quitarUnLift(inZoom.modelo, inZoom.opdId);

    const lift = verificarLiftCartesianoFrontera(mutilado, modelo.opdRaizId, procesoId, inZoom.opdId);
    expect(lift.cartesiano).toBe(false);
    expect(lift.faltantes.length).toBeGreaterThan(0);
  });
});

describe("PUENTE F-V1 ↔ F-D2 — la bisimulación descansa sobre la adjunción", () => {
  test("la frontera que la bisimulación ejerce es la que la adjunción preserva", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");
    const firmaAbstracta = firmaFronteraEntidad(modelo, modelo.opdRaizId, procesoId);

    const inZoom = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    // cara estática (base de la bisimulación F-D2): el hijo es frontera-equivalente al padre
    expect(observarPreservacionFrontera(inZoom.modelo)).toEqual([]);
    // cara operacional (adjunción F-V1): out-zoom recupera exactamente esa frontera
    const outZoom = must(quitarRefinamientoEntidad(inZoom.modelo, procesoId, "descomposicion"));
    const firmaRecuperada = firmaFronteraEntidad(outZoom, outZoom.opdRaizId, procesoId);
    expect(igualFirma(firmaRecuperada, firmaAbstracta)).toBe(true);
  });
});
