import { describe, expect, test } from "bun:test";
import { anotarAnclaEnMesa, construirLogDecisiones, ratificarAnclaConFuente } from "./logDecisiones";
import { crearModelo } from "./operaciones";
import type { AnclaNormativa, Modelo, Resultado } from "./tipos";

// W6.5-b: registro [RATIFICAR] tipificado (C1) + LogDecisiones v0 (C2).
// La app REGISTRA transiciones (pendiente → anotado-en-mesa → ratificado-con-
// fuente); el ancla OPM (estado pendiente-ratificacion → vigente) solo cambia
// vía re-elicitación de la skill (estado `re-elicitar`, consumidor comprometido
// del log — sin consumidor no se construye el export).

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

const HOY = "2026-06-10";
const SELLO = { protoHash: "abc123", autoriaVersion: "1", layoutVersion: "2" };

function anclaPendiente(clave: string, id: string): AnclaNormativa {
  return {
    id,
    claveProto: clave,
    target: { tipo: "modelo" },
    estado: "pendiente-ratificacion",
    nota: "convenio GES",
    ratificacion: { nivelAutoridad: "mesa", estadoRatificacion: "pendiente" },
  };
}

function modeloConPendiente(): Modelo {
  return {
    ...crearModelo("Registro"),
    procedencia: SELLO,
    anclasNormativas: { "an-1": anclaPendiente("ratificar:convenio-ges", "an-1") },
  };
}

describe("logDecisiones — kernel W6.5-b (C1)", () => {
  test("anotarAnclaEnMesa: pendiente → anotado-en-mesa con fecha y responsable", () => {
    const m = must(anotarAnclaEnMesa(modeloConPendiente(), "ratificar:convenio-ges", HOY, "F. Sanhueza"));
    const ancla = m.anclasNormativas!["an-1"]!;
    expect(ancla.ratificacion?.estadoRatificacion).toBe("anotado-en-mesa");
    expect(ancla.ratificacion?.anotadoEn).toBe(HOY);
    expect(ancla.ratificacion?.responsable).toBe("F. Sanhueza");
    // El ancla OPM NO transiciona en la app (solo la skill al re-emitir).
    expect(ancla.estado).toBe("pendiente-ratificacion");
  });

  test("ratificarAnclaConFuente exige fuente no vacía (C1)", () => {
    expect(ratificarAnclaConFuente(modeloConPendiente(), "ratificar:convenio-ges", "  ", HOY).ok).toBe(false);
    const m = must(ratificarAnclaConFuente(modeloConPendiente(), "ratificar:convenio-ges", "Acta mesa 2026-06-10", HOY));
    const ancla = m.anclasNormativas!["an-1"]!;
    expect(ancla.ratificacion?.estadoRatificacion).toBe("ratificado-con-fuente");
    expect(ancla.ratificacion?.fuente).toBe("Acta mesa 2026-06-10");
    expect(ancla.ratificacion?.ratificadoEn).toBe(HOY);
    expect(ancla.estado).toBe("pendiente-ratificacion");
  });

  test("clave inexistente rechaza ruidoso", () => {
    expect(anotarAnclaEnMesa(modeloConPendiente(), "ratificar:fantasma", HOY).ok).toBe(false);
  });

  test("anotar sobre un ancla ya ratificada rechaza (no retrocede el registro)", () => {
    const ratificada = must(ratificarAnclaConFuente(modeloConPendiente(), "ratificar:convenio-ges", "Acta X", HOY));
    expect(anotarAnclaEnMesa(ratificada, "ratificar:convenio-ges", HOY).ok).toBe(false);
  });
});

describe("logDecisiones — export v0 (C2)", () => {
  test("construirLogDecisiones emite schema versionado + modeloHash del sello", () => {
    let m = must(anotarAnclaEnMesa(modeloConPendiente(), "ratificar:convenio-ges", HOY));
    const log = must(construirLogDecisiones(m, HOY));

    expect(log.schema).toBe("deep-opm-pro.log-decisiones.v0");
    expect(log.modeloHash).toBe("abc123");
    expect(log.entradas).toHaveLength(1);
    const entrada = log.entradas[0]!;
    expect(entrada.claveAncla).toBe("ratificar:convenio-ges");
    expect(entrada.transicion).toEqual({ de: "pendiente", a: "anotado-en-mesa" });
    expect(entrada.nivelAutoridad).toBe("mesa");
    expect(entrada.fecha).toBe(HOY);
    expect(entrada.modeloHash).toBe("abc123");
  });

  test("la entrada ratificada lleva fuente y transición completa", () => {
    const m = must(ratificarAnclaConFuente(modeloConPendiente(), "ratificar:convenio-ges", "Acta mesa", HOY, "F.S."));
    const log = must(construirLogDecisiones(m, HOY));
    const entrada = log.entradas[0]!;
    expect(entrada.transicion).toEqual({ de: "pendiente", a: "ratificado-con-fuente" });
    expect(entrada.fuente).toBe("Acta mesa");
    expect(entrada.responsable).toBe("F.S.");
  });

  test("ratificación en dos pasos reporta de:'anotado-en-mesa' (fidelidad del registro)", () => {
    let m = must(anotarAnclaEnMesa(modeloConPendiente(), "ratificar:convenio-ges", "2026-06-09"));
    m = must(ratificarAnclaConFuente(m, "ratificar:convenio-ges", "Acta mesa", HOY));
    const entrada = must(construirLogDecisiones(m, HOY)).entradas[0]!;
    expect(entrada.transicion).toEqual({ de: "anotado-en-mesa", a: "ratificado-con-fuente" });
  });

  test("sin sello de procedencia el export se bloquea (no hay hash que anclar)", () => {
    const { procedencia: _sello, ...sinSello } = modeloConPendiente();
    const resultado = construirLogDecisiones(must(anotarAnclaEnMesa(sinSello, "ratificar:convenio-ges", HOY)), HOY);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toContain("procedencia");
  });

  test("anclas con registro aún 'pendiente' no generan entrada (nada que reportar)", () => {
    const log = must(construirLogDecisiones(modeloConPendiente(), HOY));
    expect(log.entradas).toHaveLength(0);
  });

  test("logdec-02: claveProto duplicada entre anclas que generan entrada rechaza ruidoso (el log sería ambiguo para re-elicitar)", () => {
    // Dos anclas DISTINTAS (id diferente) con la misma claveProto, ambas anotadas
    // en mesa. La skill matchea por claveAncla (no posicional): dos entradas con la
    // misma claveAncla son indistinguibles al re-elicitar → fallo app-side.
    let m: Modelo = {
      ...crearModelo("Registro"),
      procedencia: SELLO,
      anclasNormativas: {
        "an-1": anclaPendiente("ratificar:convenio-ges", "an-1"),
        "an-2": anclaPendiente("ratificar:convenio-ges", "an-2"),
      },
    };
    m = must(anotarAnclaEnMesa(m, "ratificar:convenio-ges", HOY));
    // anotarAnclaEnMesa toca la PRIMERA por claveProto; anotamos la segunda por id directo.
    m = {
      ...m,
      anclasNormativas: {
        ...m.anclasNormativas!,
        "an-2": {
          ...m.anclasNormativas!["an-2"]!,
          ratificacion: { nivelAutoridad: "mesa", estadoRatificacion: "anotado-en-mesa", anotadoEn: HOY },
        },
      },
    };
    const resultado = construirLogDecisiones(m, HOY);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(resultado.error).toContain("ratificar:convenio-ges");
      expect(resultado.error.toLowerCase()).toContain("duplicada");
    }
  });

  test("logdec-02: claveProto duplicada NO rechaza si solo una genera entrada (el otro registro sigue 'pendiente')", () => {
    // Dos anclas con la misma clave, pero solo una anotada en mesa: el log tiene una
    // sola entrada para esa clave → no hay ambigüedad → pasa.
    let m: Modelo = {
      ...crearModelo("Registro"),
      procedencia: SELLO,
      anclasNormativas: {
        "an-1": anclaPendiente("ratificar:convenio-ges", "an-1"),
        "an-2": anclaPendiente("ratificar:convenio-ges", "an-2"),
      },
    };
    m = must(anotarAnclaEnMesa(m, "ratificar:convenio-ges", HOY));
    const log = must(construirLogDecisiones(m, HOY));
    expect(log.entradas).toHaveLength(1);
    expect(log.entradas[0]!.claveAncla).toBe("ratificar:convenio-ges");
  });

  test("L9 app-side: un ancla ya vigente (re-elicitada) no reaparece ni en pendientes ni en el log", async () => {
    const { anclasPendientes } = await import("./anclasNormativas");
    let m = must(ratificarAnclaConFuente(modeloConPendiente(), "ratificar:convenio-ges", "Acta", HOY));
    // Simula la re-emisión de la skill: el ancla transiciona a vigente.
    m = {
      ...m,
      anclasNormativas: {
        "an-1": { ...m.anclasNormativas!["an-1"]!, estado: "vigente" },
      },
    };
    expect(anclasPendientes(m)).toHaveLength(0);
    expect(must(construirLogDecisiones(m, HOY)).entradas).toHaveLength(0);
  });
});
