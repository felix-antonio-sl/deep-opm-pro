import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import type { AnclaNormativa, Modelo, Resultado } from "../modelo/tipos";
import { exportarContextoSkill } from "./contextoSkill";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

const NOW = new Date("2026-06-09T12:00:00Z");

function anclaPendiente(): AnclaNormativa {
  return {
    id: "an-1",
    claveProto: "ratificar:convenio-ges",
    target: { tipo: "modelo" },
    estado: "pendiente-ratificacion",
    nota: "convenio GES vigente",
    ratificacion: { nivelAutoridad: "mesa", estadoRatificacion: "pendiente" },
  };
}

function modeloConTodo(): Modelo {
  let modelo = crearModelo("HODOM demo");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Paciente"));
  return {
    ...modelo,
    procedencia: { protoHash: "f0bb7875", autoriaVersion: "1", layoutVersion: "2" },
    anclasNormativas: { "an-1": anclaPendiente() },
  };
}

// Ancla pendiente con referencias normativas + fuente de ratificación: el caso
// que w60-01 perdía silenciosamente en el export.
function anclaPendienteConReferencias(): AnclaNormativa {
  return {
    id: "an-ref",
    claveProto: "ratificar:frontera-art17",
    target: { tipo: "modelo" },
    estado: "pendiente-ratificacion",
    nota: "frontera del sistema",
    referencias: [
      { norma: "DS 1/2022", articulos: ["15", "17"], seccion: "§Protocolos clínicos" },
      { norma: "Ley 20.584" },
    ],
    ratificacion: {
      nivelAutoridad: "dt-seremi-legal",
      estadoRatificacion: "anotado-en-mesa",
      fuente: "acta mesa 2026-06-10",
    },
  };
}

// Ancla VIGENTE (ya ratificada) con nota y referencias: w60-02 la dejaba invisible
// en el cuerpo (solo contaba en el resumen).
function anclaVigenteConReferencias(): AnclaNormativa {
  return {
    id: "an-vig",
    claveProto: "ancla:convenio-ges-2024",
    target: { tipo: "modelo" },
    estado: "vigente",
    nota: "convenio GES vigente ratificado",
    referencias: [{ norma: "NT 2024", articulos: ["8"], seccion: "§emergencias" }],
  };
}

// Ancla con claveProto vacío: w60-03 producía un span de inline-code vacío sin traza.
function anclaSinClaveProto(): AnclaNormativa {
  return {
    id: "an-vacia",
    claveProto: "   ",
    target: { tipo: "modelo" },
    estado: "pendiente-ratificacion",
    nota: "pendiente sin clave",
    ratificacion: { nivelAutoridad: "mesa", estadoRatificacion: "pendiente" },
  };
}

describe("exportarContextoSkill — puente W6.0 app → skill", () => {
  test("compone las cuatro secciones: procedencia, pendientes, diagnóstico y OPL", () => {
    const md = exportarContextoSkill(modeloConTodo(), NOW);

    expect(md.startsWith("# Contexto de modelado — HODOM demo")).toBe(true);
    expect(md).toContain("## Procedencia");
    expect(md).toContain("## Pendientes [RATIFICAR]");
    expect(md).toContain("## Diagnóstico");
    expect(md).toContain("## OPL");
    // Orden: el OPL al final (la sección más larga; el contexto accionable primero).
    expect(md.indexOf("## Procedencia")).toBeLessThan(md.indexOf("## Pendientes [RATIFICAR]"));
    expect(md.indexOf("## Pendientes [RATIFICAR]")).toBeLessThan(md.indexOf("## Diagnóstico"));
    expect(md.indexOf("## Diagnóstico")).toBeLessThan(md.indexOf("## OPL"));
  });

  test("la procedencia expone el sello de 3 componentes (post-G2)", () => {
    const md = exportarContextoSkill(modeloConTodo(), NOW);
    expect(md).toContain("`f0bb7875`");
    expect(md).toContain("autoriaVersion");
    expect(md).toContain("layoutVersion");
    expect(md).not.toContain("glosarioHash");
  });

  test("sin sello de procedencia lo declara en vez de omitir la sección", () => {
    let modelo = crearModelo("Suelto");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Cosa"));
    const md = exportarContextoSkill(modelo, NOW);
    expect(md).toContain("## Procedencia");
    expect(md).toContain("Sin sello de procedencia");
  });

  test("los pendientes [RATIFICAR] llevan claveProto, autoridad y estado de ratificación", () => {
    const md = exportarContextoSkill(modeloConTodo(), NOW);
    expect(md).toContain("`ratificar:convenio-ges`");
    expect(md).toContain("mesa");
    expect(md).toContain("pendiente");
    expect(md).toContain("convenio GES vigente");
  });

  test("sin pendientes lo declara explícitamente", () => {
    let modelo = crearModelo("Limpio");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Cosa"));
    const md = exportarContextoSkill(modelo, NOW);
    expect(md).toContain("Sin pendientes de ratificación");
  });

  test("el diagnóstico viaja como bloque JSON con fecha determinista inyectada", () => {
    const md = exportarContextoSkill(modeloConTodo(), NOW);
    expect(md).toContain("```json");
    expect(md).toContain('"fecha": "2026-06-09"');
  });

  test("el OPL del modelo completo viaja al final (frases en Markdown inline)", () => {
    const md = exportarContextoSkill(modeloConTodo(), NOW);
    expect(md).toContain("- **Paciente**");
  });

  test("es determinista: dos invocaciones con el mismo now producen el mismo texto", () => {
    const modelo = modeloConTodo();
    expect(exportarContextoSkill(modelo, NOW)).toBe(exportarContextoSkill(modelo, NOW));
  });

  // W6.5-a: las notas de mesa viajan como insumo de re-elicitación, con el
  // nombre del target resuelto (la skill no conoce los ids internos).
  test("las notas de mesa viajan en su sección con target resuelto por nombre", async () => {
    const { agregarNotaMesa } = await import("../modelo/notasMesa");
    let modelo = modeloConTodo();
    const objetoId = Object.values(modelo.entidades).find((e) => e.nombre === "Paciente")!.id;
    modelo = must(agregarNotaMesa(modelo, { tipo: "entidad", id: objetoId }, "¿dividir en dos?", "2026-06-10"));
    modelo = must(agregarNotaMesa(modelo, { tipo: "modelo" }, "revisar frontera", "2026-06-10"));

    const md = exportarContextoSkill(modelo, NOW);
    expect(md).toContain("## Notas de la mesa");
    expect(md).toContain("Paciente");
    expect(md).toContain("¿dividir en dos?");
    expect(md).toContain("revisar frontera");
    // Orden: las notas van junto a los pendientes (contexto accionable), antes del diagnóstico.
    expect(md.indexOf("## Notas de la mesa")).toBeLessThan(md.indexOf("## Diagnóstico"));
  });

  test("sin notas de mesa lo declara explícitamente", () => {
    const md = exportarContextoSkill(modeloConTodo(), NOW);
    expect(md).toContain("## Notas de la mesa");
    expect(md).toContain("Sin notas de mesa");
  });

  test("una nota sobre un enlace resuelve origen→destino por nombre (ExtremoEnlace es objeto)", async () => {
    const { agregarNotaMesa } = await import("../modelo/notasMesa");
    const { crearProceso, crearEnlace } = await import("../modelo/operaciones");
    let modelo = modeloConTodo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 40 }, "Atender"));
    const paciente = Object.values(modelo.entidades).find((e) => e.nombre === "Paciente")!.id;
    const atender = Object.values(modelo.entidades).find((e) => e.nombre === "Atender")!.id;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, paciente, atender, "consumo"));
    const enlaceId = Object.keys(modelo.enlaces)[0]!;
    modelo = must(agregarNotaMesa(modelo, { tipo: "enlace", id: enlaceId }, "¿es instrumento, no consumo?", "2026-06-10"));

    const md = exportarContextoSkill(modelo, NOW);
    expect(md).toContain("enlace consumo Paciente→Atender");
    expect(md).not.toContain("[object Object]");
  });

  // w60-01: las referencias normativas (norma + artículos + sección) y la fuente
  // de ratificación deben viajar en el export — antes se perdían silenciosamente.
  test("un pendiente con referencias normativas anexa cada norma, artículos, sección y fuente", () => {
    let modelo = modeloConTodo();
    modelo = { ...modelo, anclasNormativas: { "an-ref": anclaPendienteConReferencias() } };
    const md = exportarContextoSkill(modelo, NOW);

    expect(md).toContain("`ratificar:frontera-art17`");
    // Primera referencia: norma + artículos + sección.
    expect(md).toContain("DS 1/2022");
    expect(md).toContain("15, 17");
    expect(md).toContain("§Protocolos clínicos");
    // Segunda referencia: norma sin artículos ni sección.
    expect(md).toContain("Ley 20.584");
    // Fuente de ratificación.
    expect(md).toContain("acta mesa 2026-06-10");
  });

  // w60-02: las anclas vigentes (ya ratificadas) deben ser visibles en el cuerpo,
  // no solo contadas en el resumen — la mesa necesita saber qué normas ya viajan.
  test("las anclas vigentes con referencias viajan en el cuerpo, no solo en el resumen", () => {
    let modelo = modeloConTodo();
    modelo = {
      ...modelo,
      anclasNormativas: { "an-vig": anclaVigenteConReferencias(), "an-1": anclaPendiente() },
    };
    const md = exportarContextoSkill(modelo, NOW);

    expect(md).toContain("`ancla:convenio-ges-2024`");
    expect(md).toContain("convenio GES vigente ratificado");
    expect(md).toContain("NT 2024");
    expect(md).toContain("§emergencias");
    // El resumen sigue presente y refleja el total.
    expect(md).toContain("Total anclas normativas: 2");
  });

  // w60-03: un claveProto vacío no debe colapsar a un span inline vacío sin traza;
  // debe emitir un marcador explícito que conserve el id.
  test("un claveProto vacío emite un marcador explícito en vez de un span vacío", () => {
    let modelo = modeloConTodo();
    modelo = { ...modelo, anclasNormativas: { "an-vacia": anclaSinClaveProto() } };
    const md = exportarContextoSkill(modelo, NOW);

    expect(md).toContain("sin claveProto");
    expect(md).toContain("an-vacia");
    // No debe quedar un inline-code vacío al inicio de la línea (- `` ...).
    expect(md).not.toContain("- ``");
  });
});
