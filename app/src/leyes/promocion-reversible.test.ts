// D7.1 (decisión de consenso D7, spec §3-D7): LEY de reversibilidad y rechazo
// ruidoso de la PROMOCIÓN de bocetos. `promoverBoceto` es una operación PURA: el
// modelo de entrada nunca se muta. Por eso la "reversibilidad" a nivel kernel es
// trivial pero VERIFICABLE: deshacer = descartar el resultado y conservar la
// entrada, que sigue conteniendo el boceto byte-idéntico. (El undo undoable con
// pila vive en el store, sobre snapshots de export; aquí defendemos la base
// kernel sobre la que ese undo se apoya.)
//
// Tres verificaciones del enunciado D7:
//   (a) promover y deshacer restaura el boceto exactamente;
//   (b) firma de enlace ilegal al promover falla ruidoso SIN consumir;
//   (c) nombre colisionante falla ruidoso SIN consumir NI colapsar (auto-sufijo
//       PROHIBIDO en promoción).
//
// Control de no-tautología (load-bearing): un control que SÍ colapsa/auto-renombra
// en silencio (vía `nombreUnicoEntidad`) haría FALLAR la ley. El test de control
// muestra que el camino prohibido produciría un nombre DISTINTO y un consumo del
// boceto — exactamente lo que la ley impide.

import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, promoverBoceto } from "../modelo/operaciones";
import { nombreUnicoEntidad } from "../modelo/operaciones/entidad";
import { exportarModelo } from "../serializacion/json";
import type { Boceto, Id, Modelo, Resultado } from "../modelo/tipos";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const ent = Object.values(modelo.entidades).find((e) => e.nombre === nombre);
  if (!ent) throw new Error(`Entidad no encontrada: ${nombre}`);
  return ent.id;
}

/** Inyecta un boceto en el OPD raíz (la capa de pizarra no pasa por el DSL). */
function conBoceto(modelo: Modelo, boceto: Boceto): Modelo {
  const opd = modelo.opds[modelo.opdRaizId]!;
  return {
    ...modelo,
    opds: { ...modelo.opds, [opd.id]: { ...opd, bocetos: { ...(opd.bocetos ?? {}), [boceto.id]: boceto } } },
  };
}

const BOCETO_FORMA: Boceto = { id: "bz-1", tipo: "forma", x: 40, y: 80, w: 190, h: 72, texto: "Pedido" };

describe("law-promocion-reversible", () => {
  test("(a) promover y deshacer restaura el boceto exactamente (pureza: la entrada no se muta)", () => {
    const base = conBoceto(crearModelo("Pizarra"), BOCETO_FORMA);
    const snapshotEntrada = exportarModelo(base);

    const promovido = must(promoverBoceto(base, base.opdRaizId, "bz-1", { destino: "entidad", tipoEntidad: "objeto" }));

    // El resultado creó la entidad y CONSUMIÓ el boceto.
    expect(promovido.clase).toBe("entidad");
    expect(promovido.modelo.entidades[promovido.hechoId]?.nombre).toBe("Pedido");
    expect(promovido.modelo.opds[base.opdRaizId]?.bocetos).toBeUndefined();

    // "Deshacer" = conservar la entrada. La entrada es byte-idéntica a su snapshot
    // (operación pura: nunca se mutó) y el boceto sigue ahí, exactamente igual.
    expect(exportarModelo(base)).toBe(snapshotEntrada);
    expect(base.opds[base.opdRaizId]?.bocetos?.["bz-1"]).toEqual(BOCETO_FORMA);
  });

  test("(b) firma de enlace ILEGAL al promover falla ruidoso SIN consumir el boceto", () => {
    // Objeto -> Objeto con tipo `agente` es firma ilegal (agente requiere
    // Objeto físico -> Proceso). `promoverBoceto` delega en `crearEnlace`, que
    // rechaza por firma sin consumir nada.
    let m = crearModelo("Pizarra");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Insumo"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 300, y: 0 }, "Producto"));
    const base = conBoceto(m, { id: "bz-flecha", tipo: "flecha", puntos: [{ x: 10, y: 10 }, { x: 280, y: 10 }] });
    const snapshotEntrada = exportarModelo(base);

    const insumoId = entidadPorNombre(base, "Insumo");
    const productoId = entidadPorNombre(base, "Producto");
    const r = promoverBoceto(base, base.opdRaizId, "bz-flecha", {
      destino: "enlace",
      origenId: insumoId,
      destinoId: productoId,
      tipo: "agente",
    });

    expect(r.ok).toBe(false);
    if (r.ok) throw new Error("debió fallar por firma ilegal");
    // SIN consumir: el boceto sigue presente y la entrada no se tocó.
    expect(base.opds[base.opdRaizId]?.bocetos?.["bz-flecha"]).toBeDefined();
    expect(exportarModelo(base)).toBe(snapshotEntrada);
  });

  test("(c) nombre COLISIONANTE falla ruidoso SIN consumir NI colapsar (sin auto-sufijo)", () => {
    // Ya existe "Pedido"; promover un boceto homónimo DEBE fallar ruidoso.
    let m = crearModelo("Pizarra");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    const base = conBoceto(m, { id: "bz-dup", tipo: "forma", x: 200, y: 0, texto: "Pedido" });
    const snapshotEntrada = exportarModelo(base);

    const r = promoverBoceto(base, base.opdRaizId, "bz-dup", { destino: "entidad", tipoEntidad: "objeto" });

    expect(r.ok).toBe(false);
    if (r.ok) throw new Error("debió fallar por nombre colisionante");
    expect(r.error).toContain("Pedido");
    // SIN consumir NI colapsar: el boceto sigue ahí, NO se creó "Pedido_2", y la
    // entrada es byte-idéntica.
    expect(base.opds[base.opdRaizId]?.bocetos?.["bz-dup"]).toBeDefined();
    expect(Object.values(base.entidades).filter((e) => e.nombre.startsWith("Pedido")).length).toBe(1);
    expect(exportarModelo(base)).toBe(snapshotEntrada);
  });

  test("dos bocetos HOMÓNIMOS: promover el primero OK, el segundo falla ruidoso (no auto-sufijo)", () => {
    let m: Modelo = crearModelo("Pizarra");
    m = conBoceto(m, { id: "bz-a", tipo: "forma", x: 0, y: 0, texto: "Trámite" });
    m = conBoceto(m, { id: "bz-b", tipo: "forma", x: 200, y: 0, texto: "Trámite" });

    const primero = must(promoverBoceto(m, m.opdRaizId, "bz-a", { destino: "entidad", tipoEntidad: "proceso" }));
    expect(primero.modelo.entidades[primero.hechoId]?.nombre).toBe("Trámite");

    const segundo = promoverBoceto(primero.modelo, primero.modelo.opdRaizId, "bz-b", { destino: "entidad", tipoEntidad: "proceso" });
    expect(segundo.ok).toBe(false);
    if (segundo.ok) throw new Error("el segundo homónimo debió fallar");
    // El boceto bz-b sigue presente (no consumido).
    expect(primero.modelo.opds[primero.modelo.opdRaizId]?.bocetos?.["bz-b"]).toBeDefined();
  });

  test("promoción a proceso desde el texto del boceto crea un proceso con ese nombre", () => {
    const base = conBoceto(crearModelo("Pizarra"), { id: "bz-p", tipo: "texto", x: 0, y: 0, texto: "Evaluar la solicitud" });
    const r = must(promoverBoceto(base, base.opdRaizId, "bz-p", { destino: "entidad", tipoEntidad: "proceso" }));
    expect(r.modelo.entidades[r.hechoId]).toMatchObject({ tipo: "proceso", nombre: "Evaluar la solicitud" });
    expect(r.modelo.opds[base.opdRaizId]?.apariencias[Object.keys(r.modelo.opds[base.opdRaizId]!.apariencias)[0]!]?.entidadId).toBe(r.hechoId);
  });

  // --- Control de no-tautología -------------------------------------------
  test("control: el camino PROHIBIDO (auto-sufijo) produciría un nombre DISTINTO — por eso la ley no es trivial", () => {
    let m = crearModelo("Pizarra");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    // `nombreUnicoEntidad` (el método PROHIBIDO en promoción) NO falla: colapsa a
    // "Pedido_2". Si `promoverBoceto` lo usara, la verificación (c) no podría
    // distinguir éxito de fallo y la ley sería tautológica. Aquí mostramos que el
    // resultado prohibido es OTRO nombre, evidencia de que el rechazo es real.
    expect(nombreUnicoEntidad(m, "Pedido")).toBe("Pedido_2");
    expect(nombreUnicoEntidad(m, "Pedido")).not.toBe("Pedido");
  });
});
