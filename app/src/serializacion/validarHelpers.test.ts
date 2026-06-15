import { afterEach, describe, expect, mock, test } from "bun:test";
import type { Id, Modelo } from "../modelo/tipos";
import { esNumeroFinito, esRecord, esTipoEntidad } from "./validarHelpers";
import { validarReferenciasOpd } from "./validarIntegridad";
import { normalizarModelo, normalizarVersiones } from "./validarNormalizacion";

describe("validarHelpers", () => {
  test("esRecord distingue objetos de null y arrays", () => {
    expect(esRecord(null)).toBe(false);
    expect(esRecord([])).toBe(false);
    expect(esRecord({})).toBe(true);
  });

  test("guards de entidad y numeros finitos", () => {
    expect(esTipoEntidad("objeto")).toBe(true);
    expect(esTipoEntidad("foo")).toBe(false);
    expect(esNumeroFinito(Number.NaN)).toBe(false);
    expect(esNumeroFinito(Infinity)).toBe(false);
    expect(esNumeroFinito(0)).toBe(true);
  });

  test("normalizarVersiones descarta array invalido", () => {
    expect(normalizarVersiones("no-array")).toEqual([]);
    expect(normalizarVersiones([{ id: "v1" }])).toEqual([]);
  });

  test("validarReferenciasOpd falla si una apariencia apunta a enlace inexistente", () => {
    const modelo: Modelo = {
      id: "m-1",
      nombre: "Modelo",
      opdRaizId: "opd-1",
      nextSeq: 1,
      entidades: {},
      estados: {},
      enlaces: {},
      abanicos: {},
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {},
          enlaces: {
            "ae-1": { id: "ae-1", enlaceId: "missing", opdId: "opd-1", vertices: [] },
          },
        },
      },
    };

    const resultado = validarReferenciasOpd(modelo);

    expect(resultado.ok).toBe(false);
  });
});

/**
 * Integridad referencial de `Opd.ordenInzoom` en la hidratación dura
 * (import-01 + anclas-01). El validador per-OPD (`validarOpds`) solo verifica
 * forma + anticadena; aquí se exige que cada id del orden declarado sea un
 * subproceso INTERNO del contorno de su OPD (cross-check con entidades +
 * refinamiento + apariencias), igual que anclas/notasMesa rechazan target
 * irresoluble.
 */
describe("validarReferenciasOpd · integridad de ordenInzoom (import-01 + anclas-01)", () => {
  function modeloConInzoom(opciones: {
    subprocesos: Id[];
    ordenInzoom?: Id[][];
    externos?: Id[];
    conContorno?: boolean; // default true
  }): Modelo {
    const opdHijoId = "opd-hijo";
    const padreId = "p-padre";
    const conContorno = opciones.conContorno ?? true;
    const entidades: Modelo["entidades"] = {};
    if (conContorno) {
      entidades[padreId] = {
        id: padreId,
        tipo: "proceso",
        nombre: "Procesar Pedido",
        esencia: "informacional",
        afiliacion: "sistemica",
        refinamientos: { descomposicion: { opdId: opdHijoId } },
      };
    }
    const apariencias: Record<Id, import("../modelo/tipos").Apariencia> = {};
    if (conContorno) {
      // El refinamiento exige que el contorno aparezca en su OPD de descomposición.
      apariencias[`a-${padreId}`] = {
        id: `a-${padreId}`,
        entidadId: padreId,
        opdId: opdHijoId,
        x: 0,
        y: 0,
        width: 400,
        height: 300,
        contextoRefinamiento: { tipo: "descomposicion", refinableEntidadId: padreId, rol: "contorno" },
      };
    }
    for (const id of opciones.subprocesos) {
      entidades[id] = { id, tipo: "proceso", nombre: `Sub ${id}`, esencia: "informacional", afiliacion: "sistemica" };
      apariencias[`a-${id}`] = { id: `a-${id}`, entidadId: id, opdId: opdHijoId, x: 0, y: 0, width: 100, height: 60 };
    }
    for (const id of opciones.externos ?? []) {
      entidades[id] = { id, tipo: "proceso", nombre: `Ext ${id}`, esencia: "informacional", afiliacion: "sistemica" };
      apariencias[`a-${id}`] = {
        id: `a-${id}`,
        entidadId: id,
        opdId: opdHijoId,
        x: 0,
        y: 0,
        width: 100,
        height: 60,
        contextoRefinamiento: { tipo: "descomposicion", refinableEntidadId: padreId, rol: "externo" },
      };
    }
    return {
      id: "m",
      nombre: "integridad-ordenInzoom",
      opdRaizId: "opd-raiz",
      nextSeq: 100,
      entidades,
      estados: {},
      enlaces: {},
      abanicos: {},
      opds: {
        "opd-raiz": { id: "opd-raiz", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} },
        [opdHijoId]: {
          id: opdHijoId,
          nombre: "SD1",
          padreId: "opd-raiz",
          apariencias,
          enlaces: {},
          ...(opciones.ordenInzoom ? { ordenInzoom: opciones.ordenInzoom } : {}),
        },
      },
    };
  }

  test("acepta ordenInzoom con solo subprocesos internos válidos", () => {
    const modelo = modeloConInzoom({ subprocesos: ["a", "b", "c"], ordenInzoom: [["a", "b"], ["c"]] });
    expect(validarReferenciasOpd(modelo).ok).toBe(true);
  });

  test("rechaza ordenInzoom con id inexistente (referencia fantasma)", () => {
    const modelo = modeloConInzoom({ subprocesos: ["a", "b"], ordenInzoom: [["a"], ["z"]] });
    const resultado = validarReferenciasOpd(modelo);
    expect(resultado.ok).toBe(false);
    if (resultado.ok) return;
    expect(resultado.error).toContain("ordenInzoom");
    expect(resultado.error).toContain("z");
  });

  test("rechaza ordenInzoom con id de un externo (contexto de refinamiento, no subproceso interno)", () => {
    const modelo = modeloConInzoom({ subprocesos: ["a"], externos: ["x"], ordenInzoom: [["a"], ["x"]] });
    expect(validarReferenciasOpd(modelo).ok).toBe(false);
  });

  test("rechaza ordenInzoom en un OPD que no es la descomposición de ningún proceso", () => {
    const modelo = modeloConInzoom({ subprocesos: ["a", "b"], ordenInzoom: [["a"], ["b"]], conContorno: false });
    const resultado = validarReferenciasOpd(modelo);
    expect(resultado.ok).toBe(false);
    if (resultado.ok) return;
    expect(resultado.error).toContain("ordenInzoom");
  });

  test("rechaza ordenInzoom cuyo id es un objeto (no proceso interno)", () => {
    const modelo = modeloConInzoom({ subprocesos: ["a", "b"], ordenInzoom: [["a"], ["b"]] });
    // Convierte 'b' en objeto: deja de ser subproceso interno del in-zoom.
    modelo.entidades["b"] = { id: "b", tipo: "objeto", nombre: "Objeto B", esencia: "fisica", afiliacion: "sistemica" };
    expect(validarReferenciasOpd(modelo).ok).toBe(false);
  });

  test("acepta OPD sin ordenInzoom (retrocompat)", () => {
    const modelo = modeloConInzoom({ subprocesos: ["a", "b"] });
    expect(validarReferenciasOpd(modelo).ok).toBe(true);
  });
});

/**
 * import-02: el saneamiento de `padreId` colgante NO debe ser silencioso. Se
 * preserva la reparación (retrocompat: el árbol se cuelga de la raíz), pero la
 * reparación de un padreId NO benigno (dangling/self-ref) se hace VISIBLE con un
 * aviso. El caso benigno (padreId ausente en documentos legacy) NO emite ruido.
 */
describe("normalizarModelo · saneamiento visible de padreId colgante (import-02)", () => {
  function modeloBase(opdsExtra: Record<string, { padreId?: string | null }>): Modelo {
    const opds: Modelo["opds"] = {
      "opd-raiz": { id: "opd-raiz", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} },
    };
    for (const [id, extra] of Object.entries(opdsExtra)) {
      opds[id] = { id, nombre: id, padreId: extra.padreId ?? null, apariencias: {}, enlaces: {} };
    }
    return {
      id: "m", nombre: "import-02", opdRaizId: "opd-raiz", nextSeq: 1,
      entidades: {}, estados: {}, enlaces: {}, abanicos: {}, opds,
    };
  }

  let spy: ReturnType<typeof mock> | undefined;
  afterEach(() => {
    spy?.mockRestore();
    spy = undefined;
  });

  test("repara (NO rompe) y avisa cuando padreId apunta a un OPD inexistente", () => {
    spy = mock(() => {});
    const original = console.warn;
    console.warn = spy as unknown as typeof console.warn;
    try {
      const normalizado = normalizarModelo(modeloBase({ "opd-2": { padreId: "opd-fantasma" } }));
      // Backward-compat: el árbol se sana colgando de la raíz.
      expect(normalizado.opds["opd-2"]?.padreId).toBe("opd-raiz");
      // Visibilidad: el saneamiento del padreId colgante se avisó.
      expect(spy).toHaveBeenCalledTimes(1);
      const mensaje = String(spy.mock.calls[0]?.[0] ?? "");
      expect(mensaje).toContain("opd-2");
      expect(mensaje).toContain("opd-fantasma");
    } finally {
      console.warn = original;
    }
  });

  test("NO avisa cuando padreId está ausente (documento legacy benigno)", () => {
    spy = mock(() => {});
    const original = console.warn;
    console.warn = spy as unknown as typeof console.warn;
    try {
      const base = modeloBase({ "opd-2": { padreId: null } });
      // Simula documento legacy: sin padreId declarado.
      delete (base.opds["opd-2"] as { padreId?: string | null }).padreId;
      const normalizado = normalizarModelo(base);
      expect(normalizado.opds["opd-2"]?.padreId).toBe("opd-raiz");
      expect(spy).not.toHaveBeenCalled();
    } finally {
      console.warn = original;
    }
  });

  test("avisa cuando padreId es auto-referencia (corrupción)", () => {
    spy = mock(() => {});
    const original = console.warn;
    console.warn = spy as unknown as typeof console.warn;
    try {
      const normalizado = normalizarModelo(modeloBase({ "opd-2": { padreId: "opd-2" } }));
      expect(normalizado.opds["opd-2"]?.padreId).toBe("opd-raiz");
      expect(spy).toHaveBeenCalledTimes(1);
    } finally {
      console.warn = original;
    }
  });
});
