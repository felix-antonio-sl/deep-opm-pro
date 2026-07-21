// TDD del compilador proto-modelo → Modelo (W4.2).
//
// Tres frentes:
//   (i)  un proto sintético mínimo (estilo cafetera) compila a un Modelo OPM
//        VÁLIDO — `emitirBundle` PASS sin errores de diagnóstico.
//   (ii) LEY L2: contabilidad completa sin pérdidas silenciosas — ninguna línea
//        del proto sin destino; CON fixture negativo (una línea inventada que no
//        cae en ninguna clase canónica → el ledger DEBE capturarla).
//  (iii) round-trip: `generarOpl` del modelo compilado contiene las oraciones
//        aplicadas (comparando CONJUNTOS de hechos normalizados, no strings).

import { describe, expect, test } from "bun:test";
import { compilarProto } from "./compilador";
import type { ResultadoCompilacion } from "./compilador";
import { emitirBundle } from "../bundle";
import type { Modelo } from "../../modelo/tipos";
import { generarOpl } from "../../opl/generar";
import { parsearParrafoOpl, claveNombre } from "../../opl/parser/parsear";

// ── Fixture sintético mínimo (cafetera): SD + 1 in-zoom + estados + agente/
//    instrumento/TS ──────────────────────────────────────────────────────────

const PROTO_CAFE = `# SD0 — Hacer café (sistema)

Visión sistémica de la cafetera (prosa libre, no compila).

\`\`\`opl
Hacer café es físico y sistémico.
Persona es física y ambiental.
Persona maneja Hacer café.
Cafetera es física y sistémica.
Hacer café requiere Cafetera.
Agua es física y ambiental.
Hacer café consume Agua.
Café es físico y ambiental.
Hacer café genera Café.
Café puede estar 'caliente' o 'frío'.
\`\`\`

Razonamiento del modelador entre bloques.

# SD1 — in-zoom de Hacer café

\`\`\`opl
Hacer café se descompone en Calentar agua y Verter.
Calentar agua y Verter son físicas y sistémicas.
Calentar agua consume Agua.
Calentar agua cambia Café de 'frío' a 'caliente'.
Verter genera Café.
\`\`\`
`;

function compilarCafe(): ResultadoCompilacion {
  return compilarProto(PROTO_CAFE, { id: "cafe", nombre: "Café" });
}

/** Conjunto de claves de hecho de un texto OPL (normalizado: tipo + extremos por clave). */
function hechosDeOpl(lineas: string[]): Set<string> {
  const set = new Set<string>();
  for (const linea of lineas) {
    if (!linea.trim() || linea.startsWith("#")) continue;
    const { ast } = parsearParrafoOpl(linea.trim());
    for (const a of ast) {
      switch (a.kind) {
        case "descripcion-cosa":
          set.add(`cosa:${claveNombre(a.nombre)}:${a.tipoEntidad}`);
          break;
        case "estados":
          set.add(`estados:${claveNombre(a.objeto)}`);
          break;
        case "procedimental":
          set.add(`${a.tipoEnlace}:${claveNombre(a.proceso ?? a.origen ?? "")}:${claveNombre(a.objeto ?? a.destino ?? "")}`);
          break;
        case "estructural":
          for (const d of a.destinos) set.add(`${a.tipoEnlace}:${claveNombre(a.origen)}:${claveNombre(d)}`);
          break;
        default:
          break;
      }
    }
  }
  return set;
}

// ── (i) compila a Modelo válido ────────────────────────────────────────────

describe("(i) proto sintético mínimo compila a Modelo válido", () => {
  test("emitirBundle PASS sin errores de diagnóstico", () => {
    const { autor } = compilarCafe();
    const bundle = emitirBundle(autor, { lanzarEnError: false });
    expect(bundle.avisos.filter((a) => a.severidad === "error")).toHaveLength(0);
    expect(bundle.conteos.opds).toBe(2);
    // 6 entidades (Hacer café, Persona, Cafetera, Agua, Café + Calentar agua, Verter).
    expect(bundle.conteos.entidades).toBe(7);
    // 2 estados (caliente, frío).
    expect(bundle.conteos.estados).toBe(2);
  });

  test("el modelo tiene un raíz y un in-zoom (refDescomp registrado)", () => {
    const { modelo } = compilarCafe();
    const raiz = modelo.opds[modelo.opdRaizId]!;
    expect(raiz.padreId).toBeNull();
    const proceso = Object.values(modelo.entidades).find((e) => e.nombre === "Hacer café");
    expect(proceso?.tipo).toBe("proceso");
    expect(proceso?.refinamientos?.descomposicion).toBeDefined();
  });

  test("los agentes son objetos físicos (firma `agente` legal)", () => {
    const { modelo } = compilarCafe();
    const persona = Object.values(modelo.entidades).find((e) => e.nombre === "Persona")!;
    expect(persona.tipo).toBe("objeto");
    expect(persona.esencia).toBe("fisica");
  });
});

// ── (ii) LEY L2: contabilidad sin pérdidas silenciosas ──────────────────────

describe("(ii) L2 — ninguna línea sin destino", () => {
  test("cada hecho aplicable produce ≥1 hecho; nada se pierde", () => {
    const { ledger, resumen } = compilarCafe();
    // El número de hechos aplicados == número de oraciones aplicables (con la
    // contabilidad de A1: `Calentar agua y Verter son físicas...` se parte en 2).
    expect(resumen.fallos).toBe(0);
    expect(resumen.excluidas).toBe(0);
    expect(resumen.aplicadas).toBeGreaterThan(0);
    // Toda entrada del ledger tiene un `tipo` reconocido (ninguna sin destino).
    const tiposValidos = new Set([
      "aplicada", "estructura", "rechazada", "excluida", "comentario", "estructural-md", "fallo",
    ]);
    for (const e of ledger.entradas) expect(tiposValidos.has(e.tipo)).toBe(true);
    // Cada `aplicada` aporta ≥1 hecho (A1/A6 trazados: una línea→N hechos).
    for (const e of ledger.entradas) {
      if (e.tipo === "aplicada") expect(e.hechos.length).toBeGreaterThanOrEqual(1);
    }
  });

  test("la suma de hechos del resumen == hechos en el ledger (sin doble conteo)", () => {
    const { ledger, resumen } = compilarCafe();
    const hechosLedger = ledger.entradas
      .filter((e) => e.tipo === "aplicada")
      .reduce((acc, e) => acc + (e.tipo === "aplicada" ? e.hechos.length : 0), 0);
    expect(hechosLedger).toBe(resumen.hechos);
  });

  test("fixture negativo: una línea inventada que no cae en ninguna clase → el ledger la captura como fallo o rechazada", () => {
    // `borbotea` no es verbo del catálogo cerrado (R3); el normalizador la rechaza.
    const protoConBarro = `# SD0

\`\`\`opl
Hacer café es físico y sistémico.
Agua es física y ambiental.
La cafetera borbotea misteriosamente el agua del cosmos.
\`\`\`
`;
    const { ledger } = compilarProto(protoConBarro, { id: "x", nombre: "X" });
    const capturada = ledger.entradas.find(
      (e) => e.tipo === "rechazada" || e.tipo === "fallo",
    );
    expect(capturada).toBeDefined();
    // NO desaparece en silencio: queda con su diagnóstico/razón.
    if (capturada?.tipo === "rechazada") {
      expect(capturada.diagnostico.length).toBeGreaterThan(0);
    } else if (capturada?.tipo === "fallo") {
      expect(capturada.razon.length).toBeGreaterThan(0);
    }
  });

  test("fixture negativo 2: comentario y prosa se conservan, no se compilan", () => {
    const proto = `# Encabezado de prueba

Prosa interbloque que es razonamiento, no hecho.

\`\`\`opl
# este es un comentario dentro del bloque
Hacer café es físico y sistémico.
\`\`\`
`;
    const { ledger } = compilarProto(proto, { id: "y", nombre: "Y" });
    expect(ledger.entradas.some((e) => e.tipo === "comentario")).toBe(true);
    expect(ledger.entradas.some((e) => e.tipo === "estructural-md" && e.clase === "prosa")).toBe(true);
    expect(ledger.entradas.some((e) => e.tipo === "estructural-md" && e.clase === "encabezado")).toBe(true);
  });
});

// ── (iii) round-trip: generarOpl ⊇ hechos aplicados ─────────────────────────

describe("(iii) round-trip — el OPL del modelo compilado contiene los hechos aplicados", () => {
  test("los hechos del SD0 sobreviven el round-trip (comparando conjuntos)", () => {
    const { autor, modelo } = compilarCafe();
    // Aplica layout/canon (no muta los hechos) para emitir el OPL canónico.
    emitirBundle(autor, { lanzarEnError: false });
    const oplRaiz = generarOpl(modelo, modelo.opdRaizId);
    const hechos = hechosDeOpl(oplRaiz);

    // Hechos esperados del SD0 (forma canónica por clave; el orden/forma no importa).
    const esperados = [
      "agente:hacer cafe:persona",
      "instrumento:hacer cafe:cafetera",
      "consumo:hacer cafe:agua",
      "resultado:hacer cafe:cafe",
      "estados:cafe",
    ];
    for (const h of esperados) expect(hechos).toContain(h);
  });

  test("el in-zoom emite sus subprocesos y sus enlaces", () => {
    const { autor, modelo } = compilarCafe();
    emitirBundle(autor, { lanzarEnError: false });
    const inzoom = Object.values(modelo.opds).find((o) => o.padreId !== null)!;
    const opl = generarOpl(modelo, inzoom.id);
    const hechos = hechosDeOpl(opl);
    expect(hechos).toContain("consumo:calentar agua:agua");
    // Verter genera Café — debe aparecer en el in-zoom.
    expect(hechos).toContain("resultado:verter:cafe");
  });
});

// ── Resolución de las 17 tensiones del piloto (W4.3) ────────────────────────

/** Busca el enlace entre dos entidades por nombre (origen→destino) de un tipo. */
function enlaceEntre(
  modelo: ResultadoCompilacion["modelo"],
  origenNombre: string,
  destinoNombre: string,
  tipo: string,
) {
  const idDe = (n: string) => Object.values(modelo.entidades).find((e) => e.nombre === n)?.id;
  const oid = idDe(origenNombre);
  const did = idDe(destinoNombre);
  return Object.values(modelo.enlaces).filter((l) => {
    if (l.tipo !== tipo) return false;
    const o = l.origenId.kind === "entidad" ? l.origenId.id : undefined;
    const d = l.destinoId.kind === "entidad" ? l.destinoId.id : undefined;
    // El origen puede ser un estado de la entidad (instrumento-evento con gatillo).
    const oEnt = l.origenId.kind === "estado" ? modelo.estados[l.origenId.id]?.entidadId : o;
    return oEnt === oid && d === did;
  });
}

describe("Tensión 1 — evento sin portador → instrumento-evento (con adjunción)", () => {
  test("`Objeto en `s` inicia Proceso` crea un instrumento-evento objeto→proceso (no invocación ilegal)", () => {
    const proto = `# SD0
\`\`\`opl
Atender es un proceso físico y sistémico.
Paciente es un objeto físico y ambiental.
Paciente puede estar 'estable' o 'crítico'.
Paciente en \`crítico\` inicia Atender.
\`\`\`
`;
    const { autor, modelo } = compilarProto(proto, { id: "t1", nombre: "T1" });
    const bundle = emitirBundle(autor, { lanzarEnError: false });
    expect(bundle.avisos.filter((a) => a.severidad === "error")).toHaveLength(0);
    const instr = enlaceEntre(modelo, "Paciente", "Atender", "instrumento");
    expect(instr).toHaveLength(1);
    expect(instr[0]!.modificador).toBe("evento");
    // El gatillo va en el extremo origen (estado del objeto).
    expect(instr[0]!.origenId.kind).toBe("estado");
    // NO se creó una invocación ilegal objeto→proceso.
    expect(enlaceEntre(modelo, "Paciente", "Atender", "invocacion")).toHaveLength(0);
  });

  test("iniciador PROCESO conserva la invocación proceso→proceso base", () => {
    const proto = `# SD0
\`\`\`opl
Ajustar es un proceso físico y sistémico.
Prescribir es un proceso físico y sistémico.
Ajustar inicia Prescribir.
\`\`\`
`;
    const { autor, modelo } = compilarProto(proto, { id: "t1b", nombre: "T1b" });
    emitirBundle(autor, { lanzarEnError: false });
    const inv = enlaceEntre(modelo, "Ajustar", "Prescribir", "invocacion");
    expect(inv).toHaveLength(1);
    expect(inv[0]!.modificador).toBeUndefined();
  });

  test("ADJUNCIÓN: un `requiere` coexistente NO duplica — el evento adjunta evento al instrumento existente", () => {
    // El evento (antes) y el `requiere` (después) describen el MISMO enlace X→P.
    const proto = `# SD0
\`\`\`opl
Operar es un proceso físico y sistémico.
Paciente es un objeto físico y ambiental.
Paciente puede estar 'ingresado' o 'egresado'.
Paciente en \`ingresado\` inicia Operar.
Operar requiere Paciente en estado 'ingresado'.
\`\`\`
`;
    const { autor, modelo } = compilarProto(proto, { id: "t1c", nombre: "T1c" });
    emitirBundle(autor, { lanzarEnError: false });
    // UN solo instrumento Paciente→Operar (no dos), y es evento.
    const instr = enlaceEntre(modelo, "Paciente", "Operar", "instrumento");
    expect(instr).toHaveLength(1);
    expect(instr[0]!.modificador).toBe("evento");
  });

  test("objeto-evento de UN solo estado → instrumento-evento SIN gatillo (estado único no es representable)", () => {
    const proto = `# SD0
\`\`\`opl
Reaccionar es un proceso físico y sistémico.
Alarma es un objeto físico y sistémico.
Alarma en estado 'activa' inicia Reaccionar.
\`\`\`
`;
    const { autor, modelo } = compilarProto(proto, { id: "t1d", nombre: "T1d" });
    const bundle = emitirBundle(autor, { lanzarEnError: false });
    expect(bundle.avisos.filter((a) => a.severidad === "error")).toHaveLength(0);
    const instr = enlaceEntre(modelo, "Alarma", "Reaccionar", "instrumento");
    expect(instr).toHaveLength(1);
    expect(instr[0]!.modificador).toBe("evento");
    // Sin state set ≥2, el gatillo no va en el origen (entidad pelada).
    expect(instr[0]!.origenId.kind).toBe("entidad");
  });
});

describe("Tensión 3 — nombre con ` en ` declarado gana sobre la lectura objeto+estado", () => {
  test("`P genera Resumen en domicilio` con el nombre completo declarado → resultado al nombre entero", () => {
    const proto = `# SD0
\`\`\`opl
Episodio es un objeto físico y sistémico.
Consolidar es un proceso físico y sistémico.
Episodio consta de Resumen clínico en domicilio.
Consolidar genera Resumen clínico en domicilio.
\`\`\`
`;
    const { autor, modelo } = compilarProto(proto, { id: "t3", nombre: "T3" });
    const bundle = emitirBundle(autor, { lanzarEnError: false });
    expect(bundle.avisos.filter((a) => a.severidad === "error")).toHaveLength(0);
    // La entidad COMPLETA existe; no se creó un objeto `Resumen clínico` + estado.
    expect(Object.values(modelo.entidades).some((e) => e.nombre === "Resumen clínico en domicilio")).toBe(true);
    expect(Object.values(modelo.entidades).some((e) => e.nombre === "Resumen clínico")).toBe(false);
    expect(enlaceEntre(modelo, "Consolidar", "Resumen clínico en domicilio", "resultado")).toHaveLength(1);
  });

  test("si el nombre completo NO está declarado, ` en X` SÍ se lee como estado (sin merge espurio)", () => {
    const proto = `# SD0
\`\`\`opl
Mover es un proceso físico y sistémico.
Caja es un objeto físico y sistémico.
Caja puede estar 'origen' o 'destino'.
Mover genera Caja en estado 'destino'.
\`\`\`
`;
    const { modelo } = compilarProto(proto, { id: "t3b", nombre: "T3b" });
    // `Caja en destino` NO es entidad conocida → se mantiene Caja + estado destino.
    expect(Object.values(modelo.entidades).some((e) => e.nombre === "Caja")).toBe(true);
    expect(Object.values(modelo.entidades).some((e) => e.nombre === "Caja en destino")).toBe(false);
  });
});

describe("Tensión 4 — agregación homogénea: partes heredan la clase del todo", () => {
  test("partes con ` y ` interno (re-juntadas) y sin clase propia heredan la clase del todo", () => {
    const proto = `# SD0
\`\`\`opl
Plan es un objeto físico y sistémico.
Plan consta de Tratamiento médico, Vigilancia y monitorización clínica y Educación del cuidador.
\`\`\`
`;
    const { autor, modelo } = compilarProto(proto, { id: "t4", nombre: "T4" });
    const bundle = emitirBundle(autor, { lanzarEnError: false });
    expect(bundle.avisos.filter((a) => a.severidad === "error")).toHaveLength(0);
    // El nombre compuesto NO se fragmentó: existe la entidad entera (objeto).
    const vig = Object.values(modelo.entidades).find((e) => e.nombre === "Vigilancia y monitorización clínica");
    expect(vig?.tipo).toBe("objeto");
    expect(enlaceEntre(modelo, "Plan", "Vigilancia y monitorización clínica", "agregacion")).toHaveLength(1);
  });

  test("NEGATIVO: parte declarada EXPLÍCITAMENTE con clase contraria → diagnóstico (no silencio)", () => {
    const proto = `# SD0
\`\`\`opl
Plan es un objeto físico y sistémico.
Cocinar es un proceso físico y sistémico.
Plan consta de Cocinar.
\`\`\`
`;
    const { ledger } = compilarProto(proto, { id: "t4b", nombre: "T4b" });
    const fallo = ledger.entradas.find(
      (e) => e.tipo === "fallo" && /heterogénea/.test(e.razon),
    );
    expect(fallo).toBeDefined();
  });
});

describe("Tensión 5 — el agente (sujeto de `maneja`) es objeto, no proceso", () => {
  test("un sujeto de `genera` que ADEMÁS es agente (`maneja`) se resuelve a objeto", () => {
    const proto = `# SD0
\`\`\`opl
Autoridad es física y ambiental.
Documento es un objeto informacional y ambiental.
Fiscalizar es un proceso físico y sistémico.
Autoridad genera Documento.
Autoridad maneja Fiscalizar.
\`\`\`
`;
    const { modelo } = compilarProto(proto, { id: "t5", nombre: "T5" });
    const autoridad = Object.values(modelo.entidades).find((e) => e.nombre === "Autoridad");
    expect(autoridad?.tipo).toBe("objeto");
    // El enlace `agente` Autoridad→Fiscalizar es legal (origen objeto físico).
    expect(enlaceEntre(modelo, "Autoridad", "Fiscalizar", "agente")).toHaveLength(1);
  });
});

// ── S1 (solicitud upstream skill modelamiento-opm, 2026-06-11) ──────────────
// `X se descompone en A y B` debe registrar los miembros como INTERNOS del
// OPD hijo: el layout los contiene dentro del contorno (semántica visual del
// in-zoom, spec-forja-opd-es) y el checker LF-19 no acusa falso positivo.
// Vía: el compilador emite las agregaciones contorno→miembro que el DSL ya
// consume (dsl.ts registrarInternoInzoom) — sin tocar layout.ts ni el DSL.
describe("S1 — `se descompone en` contiene a sus miembros en el in-zoom", () => {
  const PROTO_TE = `# SD0 — Preparar té

\`\`\`opl
Preparar té es físico y sistémico.
Agua es física y ambiental.
Preparar té consume Agua.
\`\`\`

# SD1 — in-zoom de Preparar té

\`\`\`opl
Preparar té se descompone en Hervir agua y Servir.
Hervir agua consume Agua.
\`\`\`
`;

  function compilarTe() {
    const { autor } = compilarProto(PROTO_TE, { id: "s1", nombre: "S1" });
    const bundle = emitirBundle(autor, { lanzarEnError: false });
    // La UI importa el campo `.json` del ResultadoBundle; el modelo viaja dentro.
    const modelo = (JSON.parse(bundle.json) as { modelo: Modelo }).modelo;
    return { bundle, modelo };
  }

  test("los miembros quedan geométricamente DENTRO del contorno en el OPD hijo", () => {
    const { modelo } = compilarTe();
    const opdHijo = Object.values(modelo.opds).find((opd) => opd.padreId)!;
    expect(opdHijo).toBeDefined();
    const contorno = Object.values(modelo.entidades).find((e) => e.nombre === "Preparar té")!;
    const apContorno = Object.values(opdHijo.apariencias).find((a) => a.entidadId === contorno.id)!;
    expect(apContorno).toBeDefined();

    for (const nombre of ["Hervir agua", "Servir"]) {
      const entidad = Object.values(modelo.entidades).find((e) => e.nombre === nombre);
      expect(entidad).toBeDefined();
      const aparicion = Object.values(opdHijo.apariencias).find((a) => a.entidadId === entidad!.id);
      expect(aparicion).toBeDefined();
      expect(aparicion!.x).toBeGreaterThan(apContorno.x);
      expect(aparicion!.y).toBeGreaterThan(apContorno.y);
      expect(aparicion!.x + aparicion!.width).toBeLessThan(apContorno.x + apContorno.width);
      expect(aparicion!.y + aparicion!.height).toBeLessThan(apContorno.y + apContorno.height);
    }
  });

  test("la membresía no inventa enlaces de agregación en el bundle (el DSL la consume)", () => {
    const { modelo: modeloAgg } = compilarTe();
    const agregaciones = Object.values(modeloAgg.enlaces).filter((e) => e.tipo === "agregacion");
    expect(agregaciones).toHaveLength(0);
  });

  test("el checker DESCOMPOSICION_SIN_SUBPROCESOS no acusa falso positivo", () => {
    const { bundle } = compilarTe();
    expect(bundle.avisos.filter((a) => a.codigo === "DESCOMPOSICION_SIN_SUBPROCESOS")).toHaveLength(0);
  });

  test("un miembro declarado SOLO en la lista (sin hechos propios) existe como proceso interno", () => {
    const { modelo: modeloServir } = compilarTe();
    const servir = Object.values(modeloServir.entidades).find((e) => e.nombre === "Servir");
    expect(servir?.tipo).toBe("proceso");
  });
});

// ── Secuencia del in-zoom (feedback operador 2026-06-11) ────────────────────
// `… en esa secuencia` (A10) debe traducirse a la LÍNEA DE TIEMPO del in-zoom:
// los subprocesos se apilan verticalmente en el orden declarado (ISO 19450:
// el eje vertical del contorno es temporal; misma altura = paralelo). La
// bisimetría cierra: el OPL generado desde el bundle vuelve a decir
// `en esa secuencia` (deriva de las y vía agruparSubprocesosParalelos).
describe("secuencia — `en esa secuencia` apila los subprocesos en la línea de tiempo", () => {
  function compilarCafeSecuencial(marcador: string) {
    const proto = `# SD0 — Hacer café

\`\`\`opl
Hacer café es físico y sistémico.
Agua es física y ambiental.
Hacer café consume Agua.
\`\`\`

# SD1 — in-zoom de Hacer café

\`\`\`opl
Hacer café se descompone en Calentar agua y Verter${marcador}.
Calentar agua consume Agua.
\`\`\`
`;
    const { autor } = compilarProto(proto, { id: "seq", nombre: "Seq" });
    const bundle = emitirBundle(autor, { lanzarEnError: false });
    const modelo = (JSON.parse(bundle.json) as { modelo: Modelo }).modelo;
    const opdHijo = Object.values(modelo.opds).find((opd) => opd.padreId)!;
    const ap = (nombre: string) => {
      const ent = Object.values(modelo.entidades).find((e) => e.nombre === nombre)!;
      return Object.values(opdHijo.apariencias).find((a) => a.entidadId === ent.id)!;
    };
    return { bundle, ap };
  }

  test("con `en esa secuencia`: Calentar agua queda ARRIBA de Verter (orden declarado)", () => {
    const { ap } = compilarCafeSecuencial(" en esa secuencia");
    expect(ap("Calentar agua").y + ap("Calentar agua").height).toBeLessThanOrEqual(ap("Verter").y);
  });

  test("con `en esa secuencia`: el OPL generado del bundle reexpresa la secuencia (bisimetría)", () => {
    const { bundle } = compilarCafeSecuencial(" en esa secuencia");
    expect(bundle.opl).toContain("en esa secuencia");
  });

  test("sin marcador: misma banda (paralelo, comportamiento vigente)", () => {
    const { ap, bundle } = compilarCafeSecuencial("");
    expect(ap("Calentar agua").y).toBe(ap("Verter").y);
    expect(bundle.opl).not.toContain("en esa secuencia");
  });
});

describe("abanicos con estados", () => {
  test("compila estados implícitos, dos ramas y un XOR sin exclusión L2", () => {
    const proto = `# SD0

\`\`\`opl
Grado es informacional y ambiental.
Procesar es físico y sistémico.
Procesar cambia Grado a exactamente uno de \`insuficiente\` o \`nulo\`.
\`\`\`
`;
    const { modelo, resumen, ledger } = compilarProto(proto, { id: "fan-estados", nombre: "Fan estados" });

    expect(resumen.excluidas).toBe(0);
    expect(resumen.fallos).toBe(0);
    expect(ledger.entradas.some((entrada) => entrada.tipo === "excluida")).toBe(false);
    expect(Object.values(modelo.estados).map((estado) => estado.nombre).sort()).toEqual(["insuficiente", "nulo"]);
    expect(Object.values(modelo.enlaces)).toHaveLength(2);
    expect(Object.values(modelo.abanicos ?? {})).toHaveLength(1);
  });

  test("compila un abanico TS3 con entrada común como dos efectos", () => {
    const proto = `# SD0

\`\`\`opl
Grado de Cobertura es informacional y ambiental.
Procesar es físico y sistémico.
Procesar cambia Grado de Cobertura de \`suficiente\` a exactamente uno de \`insuficiente\` o \`nulo\`.
\`\`\`
`;
    const { modelo, resumen } = compilarProto(proto, { id: "fan-ts3", nombre: "Fan TS3" });
    const enlaces = Object.values(modelo.enlaces);

    expect(resumen.excluidas).toBe(0);
    expect(resumen.fallos).toBe(0);
    expect(Object.values(modelo.estados).map((estado) => estado.nombre).sort()).toEqual(["insuficiente", "nulo", "suficiente"]);
    expect(enlaces).toHaveLength(2);
    expect(enlaces.every((enlace) => enlace.tipo === "efecto" && enlace.estadoEntradaId && enlace.estadoSalidaId)).toBe(true);
    expect(Object.values(modelo.abanicos ?? {})).toHaveLength(1);
  });
});
