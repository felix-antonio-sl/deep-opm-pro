import { describe, expect, test } from "bun:test";
import {
  crearEnlace,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
  desplegarObjeto,
} from "../modelo/operaciones";
import { quitarRefinamientoEntidad } from "../modelo/operaciones/refinamiento";
import { extremoEntidad } from "../modelo/extremos";
import { tieneRefinamiento } from "../modelo/refinamientos";
import {
  firmaFronteraEntidad,
  observarPreservacionFrontera,
  verifyBoundaryCorrespondence,
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

/** Generar --resultado--> Lote --consumo--> Consumir (frontera externa no trivial del objeto Lote). */
function modeloObjetoConFrontera(): Modelo {
  let modelo = crearModelo("Eje vertical de despliegue");
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Generar"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 280, y: 120 }, "Lote"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 520, y: 200 }, "Consumir"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(eid(modelo, "Generar")), extremoEntidad(eid(modelo, "Lote")), "resultado"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(eid(modelo, "Lote")), extremoEntidad(eid(modelo, "Consumir")), "consumo"));
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

/** Apunta un derivado a un enlace padre inexistente. */
function corromperEnlacePadreId(modelo: Modelo, opdHijoId: Id): Modelo {
  const m = clonar(modelo);
  const derivado = enlacesDeOpd(m, opdHijoId).find((e) => e.derivado?.tipo === "enlace-externo-refinamiento");
  if (derivado?.derivado) derivado.derivado.enlacePadreId = "enlace-fantasma";
  return m;
}

/** Borra un derivado de frontera del hijo. */
function removeOneDerivedBoundaryLink(modelo: Modelo, opdHijoId: Id): Modelo {
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

/**
 * Estas pruebas verifican observables operativos del refinamiento: preservación
 * de firma, idempotencia y correspondencia de enlaces derivados. No prueban una
 * adjunción, una fibración, una bisimulación ni una propiedad universal.
 */
describe("LEY F-V1 — round-trip de refinamiento preserva la firma", () => {
  test("out-zoom ∘ in-zoom preserva exactamente la frontera del proceso", () => {
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

  test("in-zoom es idempotente: el refinamiento se crea una sola vez", () => {
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

describe("LEY F-V2 — correspondencia de frontera padre ↔ hijo", () => {
  test("la correspondencia de enlaces derivados es completa y uno-a-uno", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");
    const inZoom = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));

    const correspondence = verifyBoundaryCorrespondence(inZoom.modelo, modelo.opdRaizId, procesoId, inZoom.opdId);
    expect(correspondence.complete).toBe(true);
    expect(correspondence.enlacesFronteraPadre.length).toBe(2); // consumo + resultado
    expect(correspondence.faltantes).toEqual([]);
    expect(correspondence.duplicados).toEqual([]);
    expect(correspondence.huerfanos).toEqual([]);
    expect(correspondence.baseIncoherente).toEqual([]);
  });

  test("un enlace de frontera posterior al in-zoom recibe un derivado coherente", () => {
    let modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");
    const inZoom = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    modelo = inZoom.modelo;
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 280, y: 360 }, "Auditoria"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(procesoId), extremoEntidad(eid(modelo, "Auditoria")), "resultado"));

    const correspondence = verifyBoundaryCorrespondence(modelo, modelo.opdRaizId, procesoId, inZoom.opdId);
    expect(correspondence.enlacesFronteraPadre.length).toBe(3); // consumo + 2 resultados
    expect(correspondence.faltantes).toEqual([]);
    expect(correspondence.complete).toBe(true);
  });

  test("control de no-tautología: un derivado huérfano rompe la correspondencia", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");
    const inZoom = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    const mutilado = corromperEnlacePadreId(inZoom.modelo, inZoom.opdId);

    const correspondence = verifyBoundaryCorrespondence(mutilado, modelo.opdRaizId, procesoId, inZoom.opdId);
    expect(correspondence.complete).toBe(false);
    expect(correspondence.huerfanos.length).toBeGreaterThan(0);
    expect(correspondence.faltantes.length).toBeGreaterThan(0);
  });

  test("control de no-tautología: un derivado faltante rompe la correspondencia", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");
    const inZoom = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    const mutilado = removeOneDerivedBoundaryLink(inZoom.modelo, inZoom.opdId);

    const correspondence = verifyBoundaryCorrespondence(mutilado, modelo.opdRaizId, procesoId, inZoom.opdId);
    expect(correspondence.complete).toBe(false);
    expect(correspondence.faltantes.length).toBeGreaterThan(0);
  });
});

describe("PUENTE F-V1 ↔ F-D2 — ambos observan la misma firma declarada", () => {
  test("el hijo preserva la firma que el round-trip recupera", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");
    const firmaAbstracta = firmaFronteraEntidad(modelo, modelo.opdRaizId, procesoId);

    const inZoom = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    // Cara estática: el hijo preserva la firma del padre.
    expect(observarPreservacionFrontera(inZoom.modelo)).toEqual([]);
    // Cara operacional: out-zoom recupera exactamente esa firma.
    const outZoom = must(quitarRefinamientoEntidad(inZoom.modelo, procesoId, "descomposicion"));
    const firmaRecuperada = firmaFronteraEntidad(outZoom, outZoom.opdRaizId, procesoId);
    expect(igualFirma(firmaRecuperada, firmaAbstracta)).toBe(true);
  });
});

describe("LEY F-V1 (despliegue) — el round-trip preserva la frontera del objeto", () => {
  // OPM: desplegar un objeto muestra su estructura parte-todo (agregacion/exhibicion/...), NO
  // redistribuye sus enlaces externos. El round-trip preserva la frontera EXTERNA
  // del objeto, que vive en el padre y el despliegue no toca.

  test("out-zoom ∘ in-zoom(despliegue) preserva la frontera externa del objeto", () => {
    const modelo = modeloObjetoConFrontera();
    const objetoId = eid(modelo, "Lote");
    const firmaAntes = firmaFronteraEntidad(modelo, modelo.opdRaizId, objetoId);
    expect(firmaAntes.size).toBeGreaterThan(0); // resultado(Generar) + consumo(Consumir)

    const inZoom = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId, "agregacion"));
    const outZoom = must(quitarRefinamientoEntidad(inZoom.modelo, objetoId, "despliegue"));
    const firmaDespues = firmaFronteraEntidad(outZoom, outZoom.opdRaizId, objetoId);

    expect(igualFirma(firmaDespues, firmaAntes)).toBe(true);
    expect(tieneRefinamiento(outZoom.entidades[objetoId]!)).toBe(false);
  });

  test("distinción con descomposición: despliegue no crea derivados de frontera", () => {
    const modelo = modeloObjetoConFrontera();
    const objetoId = eid(modelo, "Lote");
    const inZoom = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId, "agregacion"));

    const correspondence = verifyBoundaryCorrespondence(inZoom.modelo, modelo.opdRaizId, objetoId, inZoom.opdId);
    // Los dos enlaces externos siguen en el padre; despliegue no los proyecta como derivados.
    expect(correspondence.enlacesFronteraPadre.length).toBe(2);
    expect(correspondence.faltantes.length).toBe(2);
    expect(correspondence.huerfanos).toEqual([]);
  });

  test("desplegar dos veces no re-crea el OPD hijo", () => {
    const modelo = modeloObjetoConFrontera();
    const objetoId = eid(modelo, "Lote");
    const z1 = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId, "agregacion"));
    const z2 = must(desplegarObjeto(z1.modelo, modelo.opdRaizId, objetoId, "agregacion"));
    expect(z1.creado).toBe(true);
    expect(z2.creado).toBe(false);
    expect(z2.opdId).toBe(z1.opdId);
  });

  test("control de no-tautología: frontera mutilada se detecta tras el round-trip", () => {
    const modelo = modeloObjetoConFrontera();
    const objetoId = eid(modelo, "Lote");
    const firmaAntes = firmaFronteraEntidad(modelo, modelo.opdRaizId, objetoId);

    const inZoom = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId, "agregacion"));
    const outZoom = must(quitarRefinamientoEntidad(inZoom.modelo, objetoId, "despliegue"));
    const mutilado = quitarEnlaceFronteraDe(outZoom, objetoId, "consumo");
    const firmaMutilada = firmaFronteraEntidad(mutilado, mutilado.opdRaizId, objetoId);

    expect(igualFirma(firmaMutilada, firmaAntes)).toBe(false);
    const perdidos = [...firmaAntes].filter((f) => !firmaMutilada.has(f));
    expect(perdidos.some((f) => f.includes("consumo"))).toBe(true);
  });
});

describe("LEY F-V1-repeat — repetibilidad del round-trip", () => {
  // Observable verificable: re-refinar tras un round-trip reproduce la
  // correspondencia de frontera y repetir el ciclo conserva la misma firma.

  test("re-refinar tras out-zoom reproduce la correspondencia y la firma", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");

    const z1 = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    const correspondence1 = verifyBoundaryCorrespondence(z1.modelo, modelo.opdRaizId, procesoId, z1.opdId);
    const firma1 = firmaFronteraEntidad(z1.modelo, modelo.opdRaizId, procesoId);

    const tModelo = must(quitarRefinamientoEntidad(z1.modelo, procesoId, "descomposicion"));
    const z2 = must(descomponerProceso(tModelo, modelo.opdRaizId, procesoId));
    const correspondence2 = verifyBoundaryCorrespondence(z2.modelo, modelo.opdRaizId, procesoId, z2.opdId);
    const firma2 = firmaFronteraEntidad(z2.modelo, modelo.opdRaizId, procesoId);

    expect(correspondence1.complete).toBe(true);
    expect(correspondence2.complete).toBe(true);
    expect(correspondence2.enlacesFronteraPadre.length).toBe(correspondence1.enlacesFronteraPadre.length);
    expect(igualFirma(firma2, firma1)).toBe(true);
  });

  test("repetir el round-trip preserva la misma firma", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");
    const firma0 = firmaFronteraEntidad(modelo, modelo.opdRaizId, procesoId);

    const tModelo = must(quitarRefinamientoEntidad(
      must(descomponerProceso(modelo, modelo.opdRaizId, procesoId)).modelo, procesoId, "descomposicion"));
    const ttModelo = must(quitarRefinamientoEntidad(
      must(descomponerProceso(tModelo, modelo.opdRaizId, procesoId)).modelo, procesoId, "descomposicion"));

    const firmaT = firmaFronteraEntidad(tModelo, tModelo.opdRaizId, procesoId);
    const firmaTT = firmaFronteraEntidad(ttModelo, ttModelo.opdRaizId, procesoId);
    expect(igualFirma(firmaT, firma0)).toBe(true);
    expect(igualFirma(firmaTT, firmaT)).toBe(true);
  });

  test("control de no-tautología: mutilar entre ciclos cambia la correspondencia", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");

    const z1 = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    const correspondence1 = verifyBoundaryCorrespondence(z1.modelo, modelo.opdRaizId, procesoId, z1.opdId);

    const tModelo = must(quitarRefinamientoEntidad(z1.modelo, procesoId, "descomposicion"));
    const tMutilado = quitarEnlaceFronteraDe(tModelo, procesoId, "consumo"); // rompe la frontera antes de re-refinar
    const z2 = must(descomponerProceso(tMutilado, modelo.opdRaizId, procesoId));
    const correspondence2 = verifyBoundaryCorrespondence(z2.modelo, modelo.opdRaizId, procesoId, z2.opdId);

    expect(correspondence2.enlacesFronteraPadre.length).toBeLessThan(correspondence1.enlacesFronteraPadre.length);
  });
});
