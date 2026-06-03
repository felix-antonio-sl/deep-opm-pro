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

/** Generar --resultado--> Lote --consumo--> Consumir (frontera externa no trivial del objeto Lote). */
function modeloObjetoConFrontera(): Modelo {
  let modelo = crearModelo("Eje vertical unfold");
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

describe("LEY F-V1 (despliegue) — round-trip de unfold ⊣ fold preserva la frontera del objeto", () => {
  // OPM: desplegar un objeto muestra su estructura parte-todo (agregacion/exhibicion/...), NO
  // redistribuye sus enlaces externos. La adjunción del eje vertical aplica igual: el round-trip
  // preserva la frontera EXTERNA del objeto, que vive en el padre y unfold no toca.

  test("F-V1 unfold: out-zoom ∘ in-zoom(despliegue) preserva la frontera externa del objeto", () => {
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

  test("F-V1 unfold (distinción con descomposición): la lectura cartesiana de frontera es vacía en unfold", () => {
    const modelo = modeloObjetoConFrontera();
    const objetoId = eid(modelo, "Lote");
    const inZoom = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId, "agregacion"));

    const lift = verificarLiftCartesianoFrontera(inZoom.modelo, modelo.opdRaizId, objetoId, inZoom.opdId);
    // los 2 enlaces externos siguen en el padre, pero unfold NO los proyecta como derivados:
    // su fibración es sobre los enlaces estructurales parte-todo, no sobre la frontera externa.
    expect(lift.enlacesFronteraPadre.length).toBe(2);
    expect(lift.faltantes.length).toBe(2); // ningún derivado de frontera → lift cartesiano de frontera vacío
    expect(lift.huerfanos).toEqual([]);
  });

  test("F-V1 unfold idempotencia: desplegar dos veces no re-crea el OPD hijo", () => {
    const modelo = modeloObjetoConFrontera();
    const objetoId = eid(modelo, "Lote");
    const z1 = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId, "agregacion"));
    const z2 = must(desplegarObjeto(z1.modelo, modelo.opdRaizId, objetoId, "agregacion"));
    expect(z1.creado).toBe(true);
    expect(z2.creado).toBe(false);
    expect(z2.opdId).toBe(z1.opdId);
  });

  test("F-V1 unfold control de no-tautología: frontera mutilada se detecta tras el round-trip", () => {
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

describe("LEY F-V1-tri — identidades triangulares: el round-trip es operador clausura", () => {
  // icas-adjunciones: ε_{Ld} ∘ L(η_d) = id_{Ld}. Observable verificable (no la naturalidad plena):
  // T = out-zoom ∘ in-zoom es un OPERADOR CLAUSURA (idempotente sobre la frontera, corpus §Galois),
  // y el refinamiento libre es REPRODUCIBLE: re-refinar tras un round-trip da la misma estructura.

  test("triangular: re-refinar tras out-zoom reproduce el mismo lift cartesiano y la misma frontera", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");

    const z1 = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    const lift1 = verificarLiftCartesianoFrontera(z1.modelo, modelo.opdRaizId, procesoId, z1.opdId);
    const firma1 = firmaFronteraEntidad(z1.modelo, modelo.opdRaizId, procesoId);

    const tModelo = must(quitarRefinamientoEntidad(z1.modelo, procesoId, "descomposicion"));
    const z2 = must(descomponerProceso(tModelo, modelo.opdRaizId, procesoId));
    const lift2 = verificarLiftCartesianoFrontera(z2.modelo, modelo.opdRaizId, procesoId, z2.opdId);
    const firma2 = firmaFronteraEntidad(z2.modelo, modelo.opdRaizId, procesoId);

    expect(lift1.cartesiano).toBe(true);
    expect(lift2.cartesiano).toBe(true);
    expect(lift2.enlacesFronteraPadre.length).toBe(lift1.enlacesFronteraPadre.length);
    expect(igualFirma(firma2, firma1)).toBe(true);
  });

  test("triangular (idempotencia del operador clausura): T(T(M)) preserva la frontera igual que T(M)", () => {
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
    expect(igualFirma(firmaTT, firmaT)).toBe(true); // T² = T sobre la frontera
  });

  test("triangular control de no-tautología: mutilar entre round-trips impide reproducir el lift", () => {
    const modelo = modeloEntradaProcesoSalida();
    const procesoId = eid(modelo, "Procesar");

    const z1 = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    const lift1 = verificarLiftCartesianoFrontera(z1.modelo, modelo.opdRaizId, procesoId, z1.opdId);

    const tModelo = must(quitarRefinamientoEntidad(z1.modelo, procesoId, "descomposicion"));
    const tMutilado = quitarEnlaceFronteraDe(tModelo, procesoId, "consumo"); // rompe la frontera antes de re-refinar
    const z2 = must(descomponerProceso(tMutilado, modelo.opdRaizId, procesoId));
    const lift2 = verificarLiftCartesianoFrontera(z2.modelo, modelo.opdRaizId, procesoId, z2.opdId);

    expect(lift2.enlacesFronteraPadre.length).toBeLessThan(lift1.enlacesFronteraPadre.length);
  });
});
