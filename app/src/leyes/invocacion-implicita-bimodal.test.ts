import { describe, expect, test } from "bun:test";
import { aplicarLayoutCompleto } from "../autoria/layout";
import { derivarOrdenInzoomDeGeometria } from "../modelo/operaciones/refinamiento";
import { generarOpl } from "../opl/generar";
import { aplicarPatchesOpl, planificarEdicionOplLibre } from "../opl/parser";
import { ejecutarCorrida, iniciarSimulacion } from "../modelo/simulacion/runner";
import type { Apariencia, ContextoRefinamientoApariencia, Id, Modelo, Opd } from "../modelo/tipos";

/**
 * Fase 1·U7 — Leyes de la frontera de invocación implícita bimodal.
 *
 * El orden temporal de los subprocesos de una descomposición vive en el campo
 * declarado `Opd.ordenInzoom: Id[][]` (bandas con cardinalidad), del que derivan
 * AMBAS modalidades sin rayos de invocación: la geometría (banda Y, U2) y el OPL
 * («paralelo… en esa secuencia», U3). El reverse (U4) reconstruye el campo desde
 * el OPL; la simulación (U6) deriva el flujo del campo.
 *
 * Estas leyes defienden los invariantes de la frontera. La equivalencia de flujo
 * de simulación tiene además cobertura unitaria profunda en
 * `modelo/simulacion/plan-orden-inzoom.test.ts` (U6); aquí se enuncia como ley.
 */

describe("U7 · leyes de invocación implícita bimodal", () => {
  // ── Ley de compat: OPL(campo) == OPL(geometría equivalente) (U3) ──────────
  test("OPL(campo) == OPL(geometría equivalente): el orden se lee igual desde el campo o desde la banda Y", () => {
    // Campo [[evaluar,registrar],[cerrar]] con geometría DELIBERADAMENTE revuelta.
    const conCampo = modeloInzoom([["evaluar", "registrar"], ["cerrar"]], {
      geometria: { evaluar: { x: 20, y: 200 }, registrar: { x: 120, y: 50 }, cerrar: { x: 20, y: 10 } },
    });
    // Misma banda por GEOMETRÍA (evaluar/registrar a la misma Y; cerrar debajo), sin campo.
    const porGeometria = modeloInzoom(undefined, {
      geometria: { evaluar: { x: 20, y: 20 }, registrar: { x: 120, y: 20 }, cerrar: { x: 20, y: 120 } },
    });

    const oracionCampo = lineaDescomposicion(generarOpl(conCampo));
    const oracionGeo = lineaDescomposicion(generarOpl(porGeometria));

    expect(oracionCampo).toBe("*Atender* se descompone en paralelo *Evaluar* y *Registrar*, *Cerrar*, en esa secuencia.");
    expect(oracionCampo).toBe(oracionGeo);
  });

  // ── Ley de layout: las bandas Y derivan del campo y lo OVERRIDEAN (U2) ─────
  test("layout(ordenInzoom) produce las bandas correctas aunque la geometría inicial las contradiga", () => {
    // Geometría inicial INVERTIDA (cerrar arriba, evaluar/registrar abajo); el campo manda.
    const modelo = modeloInzoom([["evaluar", "registrar"], ["cerrar"]], {
      geometria: { cerrar: { x: 20, y: 20 }, evaluar: { x: 20, y: 200 }, registrar: { x: 120, y: 200 } },
    });

    aplicarLayoutCompleto(modelo, new Map([["hijo", new Set(["evaluar", "registrar", "cerrar"])]]));

    const ap = (id: Id) => Object.values(modelo.opds.hijo!.apariencias).find((a) => a.entidadId === id)!;
    expect(ap("evaluar").y).toBe(ap("registrar").y); // misma banda (anticadena = paralelo)
    expect(ap("cerrar").y).toBeGreaterThan(ap("evaluar").y); // banda siguiente (secuencia), pese a estar arriba en la geometría inicial
  });

  // ── Ley de roundtrip estricto: forward→reverse→forward idéntico, SIN rayos ──
  for (const caso of [
    { nombre: "CX1 pura secuencia", orden: [["evaluar"], ["registrar"], ["cerrar"]] as Id[][] },
    { nombre: "CX2 puro paralelo", orden: [["evaluar", "registrar", "cerrar"]] as Id[][] },
    { nombre: "CX-mixta paralelo dentro de secuencia", orden: [["evaluar", "registrar"], ["cerrar"]] as Id[][] },
  ]) {
    test(`roundtrip estricto sobre el campo (${caso.nombre}) sin enlaces de invocación`, () => {
      const conCampo = modeloInzoom(caso.orden);
      // Premisa de la frontera: el orden se porta SIN rayos.
      expect(Object.values(conCampo.enlaces).filter((e) => e.tipo === "invocacion")).toEqual([]);

      const opl1 = generarOpl(conCampo);
      const sinCampo = clonarSinOrden(conCampo);
      const preview = planificarEdicionOplLibre(sinCampo, opl1.join("\n"), { opdActivoId: sinCampo.opdRaizId });
      expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toEqual([]);

      const aplicado = aplicarPatchesOpl(sinCampo, preview.patches, sinCampo.opdRaizId);
      if (!aplicado.ok) throw new Error(aplicado.error);

      // El campo se reconstruye idéntico desde el texto…
      expect(aplicado.value.opds.hijo!.ordenInzoom).toEqual(caso.orden);
      // …y el forward del modelo recuperado es byte-idéntico al original.
      expect(generarOpl(aplicado.value)).toEqual(opl1);
    });
  }

  // ── Ley de sección (U8): derivar ∘ layout = id_O (canvas→campo recupera el campo) ──
  // `layout : O → G` (campo→geometría, cara 3) es una SECCIÓN del cociente
  // `derivar : G → O` (geometría→campo, cara 4). Partiendo de un campo en forma
  // normal, realizarlo en geometría y volver a derivar recupera el MISMO campo.
  for (const orden of [
    [["evaluar"], ["registrar"], ["cerrar"]] as Id[][], // CX1 secuencia
    [["evaluar", "registrar"], ["cerrar"]] as Id[][],     // CX-mixta paralelo dentro de secuencia
  ]) {
    test(`derivar ∘ layout = id_O para ${JSON.stringify(orden)} (la geometría inicial revuelta no importa)`, () => {
      // Geometría inicial DELIBERADAMENTE revuelta: si la ley pasara con la
      // geometría ya correcta sería tautológica. El layout debe REALIZAR el campo.
      const modelo = modeloInzoom(orden, {
        geometria: { cerrar: { x: 20, y: 20 }, evaluar: { x: 120, y: 240 }, registrar: { x: 20, y: 200 } },
      });
      aplicarLayoutCompleto(modelo, new Map([["hijo", new Set(["evaluar", "registrar", "cerrar"])]]));
      // El cociente recupera exactamente el campo de partida (intra-banda por X).
      expect(derivarOrdenInzoomDeGeometria(modelo, "hijo")).toEqual(orden);

      // Refuerzo de conmutatividad OPL(geometría) = OPL(campo)∘derivar: el OPL de la
      // geometría realizada (campo borrado, leído por Y) == OPL del campo declarado.
      const soloGeometria = clonarSinOrden(modelo);
      expect(lineaDescomposicion(generarOpl(soloGeometria))).toBe(lineaDescomposicion(generarOpl(modelo)));
    });
  }

  // La INVERSA `layout ∘ derivar = id_G` es FALSA por diseño y NO se enuncia como
  // ley: `derivar` colapsa toda geometría dentro de ±4px a un mismo campo (cociente),
  // y `layout` re-centra/re-espacia con su propia métrica — el roundtrip por G NO
  // recupera los píxeles del usuario. Es un retracto (split mono/epi), no un iso.

  // ── Ley de simulación: flujo desde el campo == flujo desde rayos equivalentes ──
  test("flujo de simulación desde el campo (sin rayos) == flujo desde enlaces de invocación equivalentes", () => {
    const desdeCampo = modeloSimulable({ orden: [["evaluar"], ["registrar"], ["cerrar"]] });
    const desdeRayos = modeloSimulable({ rayos: ["evaluar", "registrar", "cerrar"] });

    const flujo = (modelo: Modelo) => ejecutarCorrida(modelo, iniciarSimulacion(modelo, "hijo"))
      .trace.map((entrada) => entrada.procesoId);

    expect(flujo(desdeCampo)).toEqual(["evaluar", "registrar", "cerrar"]);
    expect(flujo(desdeCampo)).toEqual(flujo(desdeRayos));
  });
});

function lineaDescomposicion(opl: string[]): string {
  return opl.find((linea) => linea.includes("se descompone")) ?? "";
}

function clonarSinOrden(modelo: Modelo): Modelo {
  const opds: Record<string, Opd> = {};
  for (const [id, opd] of Object.entries(modelo.opds)) {
    const { ordenInzoom: _omit, ...resto } = opd;
    opds[id] = { ...resto };
  }
  return { ...modelo, opds };
}

/**
 * Proceso «Atender» descompuesto en {Evaluar, Registrar, Cerrar} dentro del OPD
 * hijo. Geometría por defecto: los tres dentro del contorno (criterio espacial).
 * `orden` setea `ordenInzoom`; `opts.geometria` sobreescribe posiciones para las
 * leyes que enfrentan campo vs geometría.
 */
function modeloInzoom(
  orden?: Id[][],
  opts: { geometria?: Record<string, { x: number; y: number }> } = {},
): Modelo {
  const geo = opts.geometria ?? {
    evaluar: { x: 20, y: 20 }, registrar: { x: 120, y: 20 }, cerrar: { x: 20, y: 120 },
  };
  const ap = (id: string): Apariencia => ({ id, entidadId: id, opdId: "hijo", x: geo[id]!.x, y: geo[id]!.y, width: 80, height: 40 });
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: {
      opd: {
        id: "opd", nombre: "SD", padreId: null,
        apariencias: { ap: { id: "ap", entidadId: "padre", opdId: "opd", x: 0, y: 0, width: 200, height: 120 } },
        enlaces: {},
      },
      hijo: {
        id: "hijo", nombre: "SD1", padreId: "opd",
        apariencias: {
          contorno: { id: "contorno", entidadId: "padre", opdId: "hijo", x: 0, y: 0, width: 400, height: 300 },
          evaluar: ap("evaluar"), registrar: ap("registrar"), cerrar: ap("cerrar"),
        },
        enlaces: {},
        ...(orden ? { ordenInzoom: orden } : {}),
      },
    },
    entidades: {
      padre: { id: "padre", tipo: "proceso", nombre: "Atender", esencia: "informacional", afiliacion: "sistemica", refinamientos: { descomposicion: { opdId: "hijo" } } },
      evaluar: { id: "evaluar", tipo: "proceso", nombre: "Evaluar", esencia: "informacional", afiliacion: "sistemica" },
      registrar: { id: "registrar", tipo: "proceso", nombre: "Registrar", esencia: "informacional", afiliacion: "sistemica" },
      cerrar: { id: "cerrar", tipo: "proceso", nombre: "Cerrar", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {},
    nextSeq: 1,
  };
}

/**
 * Variante simulable: el contorno se marca con rol «contorno» (la planificación
 * de simulación lo salta) para que el plan del OPD hijo sean solo los tres
 * subprocesos. `orden` lo porta el campo; `rayos` lo porta una cadena de enlaces
 * de invocación (modelo legacy equivalente). La geometría es consistente con el
 * orden para que ambos coincidan en el plan base.
 */
function modeloSimulable(opts: { orden?: Id[][]; rayos?: string[] }): Modelo {
  // Modelo-rayos: geometría CONSISTENTE con la cadena (el runner arranca en
  // plan[0] y sigue los rayos desde ahí). Modelo-campo: geometría INVERTIDA, de
  // modo que el flujo correcto solo emerge porque el plan lee `ordenInzoom` (U6);
  // sin U6 el plan ordenaría por Y y el flujo diferiría — así la ley NO es tautológica.
  const secuenciaGeom = opts.rayos ?? ["cerrar", "registrar", "evaluar"];
  const geometria = Object.fromEntries(secuenciaGeom.map((id, i) => [id, { x: 20, y: 20 + i * 100 }]));
  const modelo = modeloInzoom(opts.orden, { geometria });
  const contornoRol: ContextoRefinamientoApariencia = {
    tipo: "descomposicion", refinableEntidadId: "padre", rol: "contorno", contenedorAparienciaId: "contorno",
  };
  modelo.opds.hijo!.apariencias.contorno!.contextoRefinamiento = contornoRol;
  if (opts.rayos) {
    opts.rayos.forEach((origen, i) => {
      const destino = opts.rayos![i + 1];
      if (!destino) return;
      const enlaceId = `inv-${origen}-${destino}`;
      modelo.enlaces[enlaceId] = {
        id: enlaceId, tipo: "invocacion", etiqueta: "",
        origenId: { kind: "entidad", id: origen }, destinoId: { kind: "entidad", id: destino },
      };
      modelo.opds.hijo!.enlaces[enlaceId] = { id: `ae-${enlaceId}`, enlaceId, opdId: "hijo", vertices: [] };
    });
  }
  return modelo;
}
