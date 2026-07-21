import type {
  AuthorityPlane,
  TutorSource,
  TutorSourceAnchor,
  TutorSourceId,
  TutorSourceRef,
} from "./tipos";

export const TUTOR_SOURCE_PUBLIC_BASE = "/tutor-sources" as const;

function sourceAnchor(id: string, label: string, heading = label): TutorSourceAnchor {
  return { id, label, heading };
}

export function buildTutorSourceDocumentPath(
  sourceId: TutorSourceId,
): `/tutor-sources/${string}.html` {
  return `${TUTOR_SOURCE_PUBLIC_BASE}/${sourceId}.html`;
}

function canonicalSource(
  sourceId: TutorSourceId,
  title: string,
  ownerPlane: AuthorityPlane,
  locator: string,
  version: string,
  anchors: readonly TutorSourceAnchor[],
): TutorSource {
  return {
    sourceId,
    title,
    sourceClass: "canonical",
    ownerPlane,
    locator,
    documentPath: buildTutorSourceDocumentPath(sourceId),
    sections: anchors.map((anchor) => anchor.label),
    anchors,
    integrity: { kind: "version", value: version },
  };
}

function repositorySource(
  sourceId: TutorSourceId,
  title: string,
  sourceClass: Extract<TutorSource["sourceClass"], "manual" | "guide" | "cheatsheet-index" | "cheatsheet">,
  ownerPlane: Extract<TutorSource["ownerPlane"], "pedagogy" | "operation" | "domain">,
  locator: string,
  sha256: string,
  anchors: readonly TutorSourceAnchor[],
): TutorSource {
  return {
    sourceId,
    title,
    sourceClass,
    ownerPlane,
    locator,
    documentPath: buildTutorSourceDocumentPath(sourceId),
    sections: anchors.map((anchor) => anchor.label),
    anchors,
    integrity: { kind: "sha256", value: sha256 },
  };
}

export const TUTOR_SOURCES = [
  canonicalSource(
    "source.canon.rules",
    "Reglas OPM estrictas",
    "validity",
    "urn:fxsl:kb:reglas-opm-estrictas-es",
    "1.4.2",
    [
      sourceAnchor("ontology-entities", "Ontología de entidades", "2. Ontología de entidades"),
      sourceAnchor("modeling-principles", "Principios de modelado como reglas", "Principios de modelado como reglas"),
      sourceAnchor("entity-states", "Estados", "2.6 Estados (3.68)"),
      sourceAnchor("conceptual-execution", "Modelo conceptual, ejecución y realización", "2.8 Modelo conceptual, ejecución y realización"),
      sourceAnchor("opd-visual-rules", "Reglas visuales del OPD", "3. Reglas visuales del OPD"),
      sourceAnchor("opl-grammar", "Reglas gramaticales OPL-ES", "4. Reglas gramaticales OPL-ES"),
      sourceAnchor("procedural-links", "Enlaces transformadores", "5.2 Enlaces transformadores (`SSOT-iso §Enlaces transformadores`)"),
      sourceAnchor("structural-links", "Enlaces estructurales fundamentales", "5.5 Enlaces estructurales fundamentales (`SSOT-iso §Enlaces estructurales`)"),
      sourceAnchor("control-modifiers", "Modificadores y combinaciones", "6. Modificadores y combinaciones"),
      sourceAnchor("logical-fans", "Abanicos lógicos XOR / OR", "7. Abanicos lógicos (XOR / OR)"),
      sourceAnchor("refinement", "Refinamiento", "8. Refinamiento"),
      sourceAnchor("opd-opl-bimodality", "Relación OPD↔OPL", "9. Relación OPD↔OPL (bisimetría)"),
      sourceAnchor("anti-patterns", "Anti-patrones", "11. Anti-patrones — reglas de prohibición"),
      sourceAnchor("categorical-composition", "Extensión categorial y composición", "Anexo C — Extensión categorial de opforja (linealidad, equivalencia funcional, composición)"),
    ],
  ),
  canonicalSource(
    "source.canon.method",
    "Metodología Forja OPM",
    "method",
    "urn:fxsl:kb:metodologia-forja-opm-es",
    "1.6.1",
    [
      sourceAnchor("before-seed", "Antes de la semilla", "A0. Antes de la semilla (fase pre-SD)"),
      sourceAnchor("principle-classification", "Principio rector y clasificación", "A1. Principio rector y clasificación"),
      sourceAnchor("sd-construction", "Construcción del SD", "A2. Construcción del SD (asistente agnóstico, 11 etapas)"),
      sourceAnchor("refinement", "Refinamiento SD1", "A3. Refinamiento (SD1)"),
      sourceAnchor("complexity", "Gestión de complejidad", "A4. Gestión de complejidad (niveles 2+)"),
      sourceAnchor("heuristics", "Heurísticas de modelado", "A5. Heurísticas de modelado"),
      sourceAnchor("flow-control", "Control de flujo", "A6. Control de flujo (compilación; canon en `opl-es` §7)"),
      sourceAnchor("quantitative-requirements-simulation", "Cuantitativo, errores, requisitos y simulación", "A7. Cuantitativo · errores · requisitos · simulación (condensado)"),
      sourceAnchor("validation", "Invariantes y validación tripartita", "A8. Invariantes y validación tripartita"),
      sourceAnchor("governing-boundary", "Frontera rectora", "Frontera rectora (antes del catálogo)"),
      sourceAnchor("boundary-object-composition", "Objeto-frontera entre sistemas composables", "LF-04 — Objeto-frontera congelado entre sistemas composables · Estado: consolidada"),
      sourceAnchor("opforja-runtime", "Runtime opforja", "F.2 Runtime opforja — condiciones y bucles (estado verificado 2026-06-03)"),
    ],
  ),
  canonicalSource(
    "source.canon.opd",
    "Especificación Forja OPD",
    "opd",
    "urn:fxsl:kb:spec-forja-opd-es",
    "1.3.1",
    [
      sourceAnchor("persistence-rule", "Canonicidad por persistencia", "§1 Regla rectora: canonicidad por persistencia en export"),
      sourceAnchor("things", "Cosas: las ocho representaciones", "§2 Cosas: las ocho representaciones"),
      sourceAnchor("states", "Estados y designaciones", "§3 Estados y designaciones"),
      sourceAnchor("transforming-links", "Enlaces transformadores", "§4 Enlaces transformadores"),
      sourceAnchor("structural-links", "Enlaces estructurales", "§7 Enlaces estructurales"),
      sourceAnchor("refinement", "Refinamiento y gestión de contexto", "§10 Refinamiento y gestión de contexto"),
      sourceAnchor("opd-tree", "Árbol de OPDs, identidad y categorías", "§10.4 Árbol de OPDs, identidad y categorías"),
      sourceAnchor("layout-routing", "Layout y routing", "§11 Layout y routing"),
      sourceAnchor("composition", "Composición del OPD y rotulado", "§12 Composición del OPD y rotulado"),
      sourceAnchor("interaction", "Canvas, modos e interacción", "§13 Canvas, modos e interacción"),
      sourceAnchor("diagnostics", "Fallos, validación y marcas de diagnóstico", "§17 Fallos, validación y marcas de diagnóstico"),
      sourceAnchor("bimodal-equivalence", "Equivalencia bimodal y frontera modal", "§19 Equivalencia bimodal y frontera modal"),
      sourceAnchor("simulation", "Simulación visual", "§20 Simulación visual"),
      sourceAnchor("export", "Exportación canónica", "§21 Exportación canónica"),
    ],
  ),
  canonicalSource(
    "source.canon.opl",
    "Especificación Forja OPL-ES",
    "opl",
    "urn:fxsl:kb:spec-forja-opl-es",
    "1.4.1",
    [
      sourceAnchor("entities", "Entidades", "§2 Entidades"),
      sourceAnchor("refinement", "Refinamiento y gestión de contexto", "§7 Refinamiento / gestión de contexto"),
      sourceAnchor("sentence-composition", "Composición de oraciones y prosa OPL", "§9 Composición de oraciones y prosa OPL"),
      sourceAnchor("opd-interaction", "Interacción OPL↔OPD", "§14 Interacción OPL↔OPD"),
      sourceAnchor("editing", "Edición de OPL", "§15 Edición de OPL"),
      sourceAnchor("failures", "Modos de fallo, validación y ambigüedad", "§17 Modos de fallo, validación y ambigüedad"),
      sourceAnchor("roundtrip", "Roundtrip, bisimetría e invariantes", "§19 Roundtrip, bisimetría e invariantes de equivalencia"),
      sourceAnchor("model-composition", "Composición por interfaz", "§24 Composición por interfaz (modelo ∘ modelo)"),
    ],
  ),
  canonicalSource(
    "source.canon.categorical",
    "OPM categorial",
    "formal-explanation",
    "urn:fxsl:kb:opm-categorial-es",
    "1.3.0",
    [
      sourceAnchor("typed-boundary", "Qué es y qué no es este artefacto", "0. Qué es y qué no es este artefacto"),
      sourceAnchor("category-map", "Mapa OPM y teoría de categorías", "1. Mapa OPM <-> teoría de categorías"),
      sourceAnchor("horizontal-composition", "Eje horizontal de composición", "2. El eje horizontal: dónde la lectura categorial aporta"),
      sourceAnchor("simulation-reasoning", "Dualidad entre simulación y razonamiento", "3. La dualidad central: simulación y razonamiento"),
      sourceAnchor("use-rule", "Regla de uso", "5. Regla de uso"),
    ],
  ),
  repositorySource(
    "source.manual.opm",
    "Manual de OPM puro — de las bases al uso avanzado",
    "manual",
    "pedagogy",
    "docs/manual-opm-puro.md",
    "6609bb84bff0fbec2109fb8e5acb3df2bc76555891d181d3071f22c3735fd752",
    [
      sourceAnchor("ontology", "La ontología mínima", "§1 La ontología mínima: cosas, objetos, procesos"),
      sourceAnchor("frontier", "Propiedades genéricas y frontera", "§2 Propiedades genéricas y frontera del sistema"),
      sourceAnchor("states", "Estados, designaciones, atributos y valores", "§3 Estados, designaciones, atributos y valores"),
      sourceAnchor("bimodality", "Principio bimodal", "§5 El principio bimodal: un hecho, dos proyecciones"),
      sourceAnchor("transforming-links", "Enlaces transformadores", "§9 Enlaces transformadores: consumo, resultado, efecto"),
      sourceAnchor("enabling-links", "Enlaces habilitadores", "§10 Enlaces habilitadores: agentes e instrumentos"),
      sourceAnchor("control", "Control", "§11 Control: eventos, condiciones, excepciones"),
      sourceAnchor("structural-links", "Enlaces estructurales", "§13 Enlaces estructurales: la anatomía de lo estable"),
      sourceAnchor("logical-operators", "Operadores lógicos", "§14 Operadores lógicos: AND, XOR, OR y probabilidad"),
      sourceAnchor("refinement", "Refinamiento y abstracción", "§15 Los cuatro pares de refinamiento-abstracción"),
      sourceAnchor("composition", "Composición inter-modelo", "§18 Composición inter-modelo (avanzado)"),
      sourceAnchor("method", "Construcción del SD", "§20 Construcción del SD: el protocolo de etapas 0–11"),
      sourceAnchor("simulation", "Ejecución y simulación", "§24 Del modelo conceptual a la ejecución"),
      sourceAnchor("anti-patterns", "Anti-patrones", "§23 Anti-patrones: el catálogo de los errores con nombre"),
    ],
  ),
  repositorySource(
    "source.manual.opforja",
    "Manual de opforja",
    "manual",
    "operation",
    "docs/manual-opforja.md",
    "aa9e890d26d7503c7062bee541112acabfc30a842c78fa9d3327d20f6a29404a",
    [
      sourceAnchor("what-is", "Qué es opforja", "0. Qué es opforja"),
      sourceAnchor("mental-model", "Modelo mental mínimo", "1. Modelo mental mínimo"),
      sourceAnchor("forja-flow", "Flujo de modelamiento Forja", "2. Flujo de modelamiento Forja"),
      sourceAnchor("interface", "Trabajar en la interfaz", "3. Trabajar en la interfaz opforja"),
      sourceAnchor("build-from-scratch", "Construir un modelo desde cero", "4. Construir un modelo desde cero"),
      sourceAnchor("refinement", "Refinar sin romper el modelo", "5. Refinar sin romper el modelo"),
      sourceAnchor("agent-operation", "Operar opforja como agente", "A. Operar opforja como agente"),
      sourceAnchor("opd-rules", "Reglas prácticas de OPD", "6. Reglas prácticas de OPD"),
      sourceAnchor("opl-rules", "Reglas prácticas de OPL", "7. Reglas prácticas de OPL"),
      sourceAnchor("validation", "Validación y diagnóstico", "8. Validación y diagnóstico"),
      sourceAnchor("limits", "Frontera del producto", "Frontera del producto"),
    ],
  ),
  repositorySource(
    "source.manual.systems",
    "Manual de opforja para transformar sistemas",
    "manual",
    "domain",
    "docs/manual-sistemas-opm.md",
    "7501f0a2e0fad028a47bb1114dfbe3ab647efac8005d12d43cb87d67fb3cd4e3",
    [
      sourceAnchor("semantic-table", "Mesa semántica", "1.1 Una mesa semántica, no el sistema ejecutor"),
      sourceAnchor("evidence", "Base documental y evidencia", "2.1 La base documental es evidencia, no OPM crudo"),
      sourceAnchor("work-card", "Ficha de trabajo", "2.3 Ficha de trabajo"),
      sourceAnchor("purpose", "Brújula de cinco preguntas", "3.1 La brújula de cinco preguntas"),
      sourceAnchor("entry-strategy", "SD primero o middle-out", "3.2 SD primero cuando la función está clara"),
      sourceAnchor("asis-tobe", "AS-IS y TO-BE", "3.4 AS-IS y TO-BE no son versiones del mismo dibujo"),
      sourceAnchor("requirements", "Requisitos y evidencia", "3.6 Requisitos y evidencia"),
      sourceAnchor("interfaces", "Interfaces y objetos-frontera", "4.3 Interfaces y objetos-frontera"),
      sourceAnchor("agent-work", "Paralelizar ejecución, serializar significado", "5.3 Paralelizar ejecución, serializar significado"),
      sourceAnchor("adoption", "Adopción es parte del sistema", "6.4 Adopción es parte del sistema"),
      sourceAnchor("verification", "Verificar y validar", "7.2 Verificar y validar"),
      sourceAnchor("transition", "Modelo de transición", "8.3 Modelo de transición"),
      sourceAnchor("capability-boundary", "Frontera de capacidad", "9. Frontera de capacidad de opforja"),
    ],
  ),
  repositorySource(
    "source.manual.software",
    "Manual de opforja para ingeniería de software",
    "manual",
    "domain",
    "docs/manual-software-opm.md",
    "77718d20d7d0a3a1cf3742c2e907bdf7649e26db7157ee9e10bd8b75b05bb6f5",
    [
      sourceAnchor("domain-representation", "Objeto de dominio y representación", "2.2 Objeto de dominio frente a representación técnica"),
      sourceAnchor("requirements", "Requisitos, cobertura y evidencia", "2.4 Requisitos, cobertura y evidencia ejecutable"),
      sourceAnchor("interfaces", "Responsabilidades e interfaces", "3.1 Responsabilidades e interfaces"),
      sourceAnchor("runtime-state", "Tiempo, fallos e idempotencia", "3.4 Tiempo, fallos e idempotencia"),
      sourceAnchor("reuse-drift", "Reutilización y límite del drift", "3.5 Reutilización y límite del drift"),
      sourceAnchor("agent-contract", "Contrato de implementación", "4.1 Contrato de implementación"),
      sourceAnchor("parallelism", "Paralelismo en Git e integración", "4.4 Paralelismo en Git e integración"),
      sourceAnchor("model-to-code", "Del modelo al código", "4.6 Del modelo al código, sin generación mágica"),
      sourceAnchor("delivery", "Entrega, CI/CD y release", "5. Entrega, CI/CD y release"),
      sourceAnchor("operation", "Telemetría e incidentes", "6.1 Telemetría e incidentes"),
    ],
  ),
  repositorySource(
    "source.manual.health",
    "Manual sanitario de opforja",
    "manual",
    "domain",
    "docs/manual-sanitarios-opm.md",
    "d2d81b3e6e85074e799502b314d44da54e2c23eee59a8bf0bd6637c012eab7f6",
    [
      sourceAnchor("boundary", "Contrato, frontera y ruteo", "0. Contrato, frontera y ruteo"),
      sourceAnchor("clinical-state", "Estado clínico y estado administrativo", "P2 · Estado clínico y estado administrativo no comparten eje `[asistencial · unidad–establecimiento]`"),
      sourceAnchor("roles", "Quién actúa", "P4 · Quién actúa: equipo, cuidador, organización `[asistencial · unidad–establecimiento]`"),
      sourceAnchor("flow", "Capacidad, recurso y flujo", "P8 · La cola: ¿estado del paciente u objeto propio? `[gestión · establecimiento–territorio]`"),
      sourceAnchor("system-frontier", "Dónde termina el sistema", "P11 · ¿Dónde termina MI sistema? `[sistémica · establecimiento–red]`"),
      sourceAnchor("continuity", "Derivación e interfaz", "P12 · La derivación y su vuelta son una interfaz `[sistémica · red]`"),
      sourceAnchor("flow-control", "Triaje y estratificación", "P13 · Triaje y estratificación son un abanico, no una cadena de IFs `[sistémica/gestión · establecimiento–territorio]`"),
      sourceAnchor("population", "Escala poblacional", "6. La escala poblacional — las tres lentes suben de escala"),
      sourceAnchor("information-system", "El sistema de información jamás atiende", "P21 · El sistema de información jamás atiende `[transversal · todas las escalas]`"),
      sourceAnchor("limits", "Cuando la mesa no llega", "9. Cuando la mesa no llega"),
    ],
  ),
  repositorySource(
    "source.guide.productive",
    "Uso productivo de opforja",
    "guide",
    "operation",
    "docs/uso-productivo.md",
    "a923efa7054f97301a284151e9bb0cb0018818d61906eb316ed898961fa5c523",
    [
      sourceAnchor("enter", "Entrar", "Entrar"),
      sourceAnchor("start-model", "Empezar un modelo", "Empezar un modelo"),
      sourceAnchor("drafts", "Apuntes", "Apuntes — borradores sin rigor"),
      sourceAnchor("daily-operations", "Tres operaciones diarias", "Tres operaciones diarias"),
      sourceAnchor("requirements", "Requisitos y cobertura", "Requisitos y cobertura"),
      sourceAnchor("ontology", "Ontología organizacional", "Ontología organizacional"),
      sourceAnchor("simulation", "Simulación", "Simulación"),
      sourceAnchor("versions", "Versiones", "Versiones"),
      sourceAnchor("backup", "Respaldo manual", "Respaldo manual"),
      sourceAnchor("export", "Exportar y compartir", "Exportar y compartir"),
      sourceAnchor("limits", "Límites honestos", "Límites honestos"),
    ],
  ),
  repositorySource(
    "source.cheatsheets.index",
    "Hojas rápidas de opforja",
    "cheatsheet-index",
    "pedagogy",
    "docs/cheatsheets/README.md",
    "7a8a733f2f9d84c8da66ac224df6d27631e040394e65e37dda744a232b7f0b90",
    [
      sourceAnchor("start-operate", "Empezar y operar"),
      sourceAnchor("language-patterns", "Lenguaje y patrones"),
      sourceAnchor("human-agent", "Trabajo humano-agente"),
      sourceAnchor("systems-domains", "Ciclo de sistemas y dominios"),
    ],
  ),
  repositorySource("source.cheatsheet.opm", "OPM puro — hoja rápida", "cheatsheet", "pedagogy", "docs/cheatsheets/opm-puro.html", "c1c96dd37f25ea6e8a5e69863933a6e8935ccc78c2a234e4f1ea91c43567763b", [
    sourceAnchor("entities", "Dos cosas, y nada más"), sourceAnchor("states", "«Puede estar» y designaciones"),
    sourceAnchor("transforming-links", "Consumo · resultado · efecto"), sourceAnchor("enabling-links", "Agente y instrumento"),
    sourceAnchor("control", "Evento, condición, espera"), sourceAnchor("structural-links", "Los cuatro triángulos"),
    sourceAnchor("logical-operators", "AND · XOR · OR · Pr"), sourceAnchor("refinement", "Refinar y abstraer"),
    sourceAnchor("bimodality", "Un hecho, dos proyecciones"),
  ]),
  repositorySource("source.cheatsheet.basic", "opforja — Uso básico", "cheatsheet", "operation", "docs/cheatsheets/opforja-basico.html", "52830dadde1f7c80b3fe11888a1a3b53df82d4aba938f4fbe7467035966b06ce", [
    sourceAnchor("enter", "Entrar"), sourceAnchor("create", "Crear en el canvas"), sourceAnchor("save", "Guardar"), sourceAnchor("export", "Exportar para compartir"),
  ]),
  repositorySource("source.cheatsheet.advanced", "opforja — Uso avanzado", "cheatsheet", "operation", "docs/cheatsheets/opforja-avanzado.html", "c74b0fefe4d99859dce76724d21c7f7377488b2be5693f6dae74b4918e3d5aae", [
    sourceAnchor("bimodality", "Bimodalidad OPD ↔ OPL"), sourceAnchor("refinement", "Refinar sin romper"), sourceAnchor("states", "Estados y designaciones"), sourceAnchor("simulation", "Simulación por microfases"),
  ]),
  repositorySource("source.cheatsheet.ontology", "opforja — Uso de ontología", "cheatsheet", "pedagogy", "docs/cheatsheets/opforja-ontologia.html", "0ae0b9161688d5a778ade027b67dfe748c5725ecc7c288cd4f443dab3d4dfeb3", [
    sourceAnchor("controlled-vocabulary", "Vocabulario controlado"), sourceAnchor("normalization-limit", "Normalización, no taxonomía"),
  ]),
  repositorySource("source.cheatsheet.flow-control", "opforja — Control de flujo OR/XOR", "cheatsheet", "pedagogy", "docs/cheatsheets/opforja-control-flujo.html", "35cc0dd6a71d4fa25e0b4d4648321bc5eeeb89921f29e6f34456e33d782ab0c0", [
    sourceAnchor("logical-fans", "AND · XOR · OR"), sourceAnchor("control-marks", "c · e · ¬"), sourceAnchor("execution-question", "Control = pregunta de ejecución"),
  ]),
  repositorySource("source.cheatsheet.simulation", "opforja — Simulación conceptual", "cheatsheet", "pedagogy", "docs/cheatsheets/opforja-simulacion.html", "b086cf52b468523d508078444132d511a1995527921a3022d8017f6cce9c358d", [
    sourceAnchor("microphases", "Las microfases"), sourceAnchor("runtime", "Runtime, no persistente"), sourceAnchor("numeric", "Simulación numérica"), sourceAnchor("falsify", "Falsar, no «validar»"), sourceAnchor("des-limit", "No es un motor DES"),
  ]),
  repositorySource("source.cheatsheet.patterns", "opforja — Patrones y antipatrones", "cheatsheet", "pedagogy", "docs/cheatsheets/opforja-patrones.html", "60464dc573d2d86b07709177653a0d456f9a047ece77b956600ec8a18c5f5b14", [
    sourceAnchor("pattern-structure", "Estructura de un patrón"), sourceAnchor("process-object", "Proceso vs objeto"), sourceAnchor("bad-refinement", "Refinar mal"),
  ]),
  repositorySource("source.cheatsheet.systems", "opforja — Transformar sistemas", "cheatsheet", "domain", "docs/cheatsheets/opforja-sistemas.html", "8ced5b8939b69f991066c68553e5263d7242bca277fd27db46e3f54e663f4b9a", [
    sourceAnchor("purpose", "Pregunta antes que modelo"), sourceAnchor("entry", "SD-primero o middle-out"), sourceAnchor("transition", "AS-IS ≠ TO-BE ≠ transición"), sourceAnchor("adoption", "El sistema incluye a quienes cambian"),
  ]),
  repositorySource("source.cheatsheet.software", "opforja — Ingeniería de software", "cheatsheet", "domain", "docs/cheatsheets/opforja-software.html", "b5e372e7670f10980cf4e75ccd4a5d30b816537af42ebf8f2f175e95e55b5b63", [
    sourceAnchor("requirements", "Cobertura visible"), sourceAnchor("interfaces", "Contextos e interfaces"), sourceAnchor("agent-contract", "Contrato de implementación"), sourceAnchor("delivery", "Modela CI/CD; ejecútalo fuera"),
  ]),
  repositorySource("source.cheatsheet.health-management", "opforja — Sanitario, gestión y asistencial", "cheatsheet", "domain", "docs/cheatsheets/opforja-sanitarios-gestion.html", "58b349fb11381a454ae0f7e5ffa227b2e621954f27b383ab4c646138610c7eae", [
    sourceAnchor("lenses", "Tres lentes, un foco por OPD"), sourceAnchor("clinical-state", "Transformar el estado clínico"), sourceAnchor("continuity", "Continuidad por interfaz"), sourceAnchor("flow", "Control de flujo con propósito"),
  ]),
  repositorySource("source.cheatsheet.sociosanitary", "opforja — Sistemas sociosanitarios", "cheatsheet", "domain", "docs/cheatsheets/opforja-sociosanitarios.html", "d24eabee32114950e5db09b64e21fe2b2247b25c72ae779ed7f80d2aba52b051", [
    sourceAnchor("classification", "Clasifica el sistema real"), sourceAnchor("frontier", "Frontera explícita"), sourceAnchor("middle-out", "Middle-out"), sourceAnchor("states", "Estados, no organigrama"),
  ]),
  repositorySource("source.cheatsheet.runbook", "opforja — Runbook de cero a modelo completo", "cheatsheet", "operation", "docs/cheatsheets/opforja-runbook.html", "46b94b28d0353f52042b05e9508f55e771aef4d347843b75d159bf3e4f23ac25", [
    sourceAnchor("before-seed", "Antes de la semilla"), sourceAnchor("build-sd", "Construir el SD raíz"), sourceAnchor("refinement", "Refinar por niveles"), sourceAnchor("close", "Cerrar el modelo"),
  ]),
  repositorySource("source.cheatsheet.unblocked", "opforja — Uso avanzado sin bloqueo", "cheatsheet", "operation", "docs/cheatsheets/opforja-no-bloqueado.html", "c3582b0865927281d9cee7643802ad8a72b43db0b30e4de22c51e80c6153b440", [
    sourceAnchor("two-gates", "Dos gates, dos naturalezas"), sourceAnchor("read-rule", "Lee la regla, no fuerces"), sourceAnchor("record", "Registra en vez de trabarte"),
  ]),
  repositorySource("source.cheatsheet.anchor-copy", "opforja — Anclar y calcar", "cheatsheet", "operation", "docs/cheatsheets/opforja-anclar-calcar.html", "d153e7adbaa43f105f953ee3fd50d6a0aa4db5070f862e9109c7f068dfbe7b59", [
    sourceAnchor("choice", "Calcar vs Anclar"), sourceAnchor("drift", "Centinela de Drift"), sourceAnchor("detach", "Soltar pierde la vigilancia"),
  ]),
  repositorySource("source.cheatsheet.skill-interaction", "opforja — Hablar con la skill", "cheatsheet", "operation", "docs/cheatsheets/opforja-interaccion-skill.html", "feb2bb13a115a72a2a17609d26de00691a0a02ac0d42cc7cf41cd19fc06fa69d", [
    sourceAnchor("roles", "El reparto"), sourceAnchor("purpose", "Dale un propósito claro"), sourceAnchor("limits", "No pidas lo imposible"),
  ]),
  repositorySource("source.cheatsheet.skill-flow", "opforja y skill — Flujo de trabajo", "cheatsheet", "operation", "docs/cheatsheets/opforja-skill-flujo.html", "e44ef9eb36983d06ddeda90d58a1bad5b4dc81636996e61b2b47b4dc9ff1ec9c", [
    sourceAnchor("agent-loop", "Loop de modelado del agente"), sourceAnchor("push-rules", "Reglas del push"), sourceAnchor("provenance", "La procedencia decide"), sourceAnchor("limits", "Límites de la mesa"),
  ]),
] as const satisfies readonly TutorSource[];

export const TUTOR_SOURCE_BY_ID = new Map<TutorSourceId, TutorSource>(
  TUTOR_SOURCES.map((source) => [source.sourceId, source]),
);

export function getTutorSource(sourceId: TutorSourceId): TutorSource | null {
  return TUTOR_SOURCE_BY_ID.get(sourceId) ?? null;
}

export function resolveTutorSourceDocument(
  sourceId: TutorSourceId,
): { source: TutorSource; href: string } | null {
  const source = getTutorSource(sourceId);
  return source ? { source, href: source.documentPath } : null;
}

export function resolveTutorSourceRef(
  ref: TutorSourceRef,
): { source: TutorSource; anchor: TutorSourceAnchor; href: string } | null {
  const source = getTutorSource(ref.sourceId);
  const anchor = source?.anchors.find((candidate) => candidate.id === ref.anchor);
  if (!source || !anchor) return null;
  return {
    source,
    anchor,
    href: `${source.documentPath}#${anchor.id}`,
  };
}

export function buildTutorSourceManifest(): TutorSource[] {
  return [...TUTOR_SOURCES].sort((a, b) => a.sourceId.localeCompare(b.sourceId, "en"));
}

export function searchTutorSources(query: string): TutorSource[] {
  const terms = normalizeSourceSearchText(query).split(" ").filter(Boolean);
  return TUTOR_SOURCES
    .filter((source) => {
      const searchable = normalizeSourceSearchText([
        source.sourceId,
        source.title,
        source.locator,
        ...source.sections,
        ...source.anchors.flatMap((anchor) => [anchor.id, anchor.heading]),
      ].join(" "));
      return terms.every((term) => searchable.includes(term));
    })
    .sort((a, b) => a.sourceId.localeCompare(b.sourceId, "en"));
}

function normalizeSourceSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
