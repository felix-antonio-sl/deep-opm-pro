import type {
  CapabilityId,
  KnowledgeLens,
  TutorContent,
  TutorContentId,
  TutorLensDetail,
  TutorSourceId,
  TutorSourceRef,
} from "./tipos";
import { normalizeKnowledgeLenses } from "./politica";
import { TUTOR_SOURCE_BY_ID } from "./fuentes";

const ALL_LENSES = ["systems", "software", "health"] as const;

export const TUTOR_CONTENT: readonly TutorContent[] = [
  {
    contentId: "content.start.entry",
    capabilityId: "cap.start.workspace",
    moment: "Al crear, abrir o retomar un documento",
    contexts: ["editable", "read-only"],
    authorityPlane: "method",
    now: "Elige si vas a explorar, retomar o preservar una copia.",
    criterion: "Nuevo abre un Apunte; abrir retoma o importa; Guardar como crea otra identidad editable.",
    sourceRefs: refs(
      ref("source.canon.method", "before-seed"),
      ref("source.guide.productive", "enter"),
    ),
    applicableLenses: [],
    action: { kind: "open-existing", actionId: "palette:nuevo-modelo", label: "Nuevo" },
  },
  {
    contentId: "content.lifecycle.regime",
    capabilityId: "cap.lifecycle.regime",
    moment: "Al integrar, graduar o cambiar el rol de Biblioteca",
    contexts: ["editable"],
    authorityPlane: "method",
    now: "Distingue integración, rigor y rol antes de confirmar.",
    criterion: "Adoptar integra; graduar cambia rigor; Biblioteca cambia rol. Ninguno certifica los hechos.",
    sourceRefs: refs(
      ref("source.canon.method", "governing-boundary"),
      ref("source.manual.opforja", "forja-flow"),
      ref("source.guide.productive", "versions"),
    ),
    applicableLenses: [],
    action: { kind: "focus", actionId: "workspace:graduate-model", label: "Revisar consecuencia" },
  },
  {
    contentId: "content.purpose.frontier",
    capabilityId: "cap.purpose.sd-frontier",
    moment: "Al encuadrar propósito, SD y frontera",
    contexts: ["editable"],
    authorityPlane: "method",
    now: "Declara qué transforma el sistema, para quién y dónde termina.",
    criterion: "Usa SD-first si conoces función y frontera; usa Taller si el fragmento concreto llegó primero.",
    sourceRefs: refs(
      ref("source.canon.method", "principle-classification"),
      ref("source.manual.opforja", "forja-flow"),
      ref("source.manual.systems", "purpose"),
    ),
    applicableLenses: ALL_LENSES,
    lensDetails: {
      systems: detail("Separa AS-IS, TO-BE y transición como modelos explícitos.", ref("source.manual.systems", "asis-tobe")),
      software: detail("Formula la frontera entre dominio, interfaz y operación.", ref("source.manual.software", "interfaces")),
      health: detail("Explicita beneficiario, afectado y límite clínico-operacional sin dar consejo clínico.", ref("source.manual.health", "system-frontier")),
    },
    action: { kind: "focus", actionId: "empty-state:choose-entry", label: "Elegir entrada" },
  },
  {
    contentId: "content.entity.kind",
    capabilityId: "cap.entity.kind",
    moment: "Al crear o reclasificar una cosa",
    contexts: ["editable"],
    authorityPlane: "validity",
    now: "Decide si la cosa existe o transforma.",
    criterion: "Un objeto existe durante el tiempo; un proceso transforma objetos o sus estados.",
    sourceRefs: refs(
      ref("source.canon.rules", "ontology-entities"),
      ref("source.manual.opm", "ontology"),
      ref("source.cheatsheet.opm", "entities"),
    ),
    applicableLenses: ALL_LENSES,
    lensDetails: {
      systems: detail("Modela el fenómeno del sistema, no el documento que lo describe.", ref("source.manual.systems", "semantic-table")),
      software: detail("Distingue artefacto persistente de ejecución que lo transforma.", ref("source.manual.software", "domain-representation")),
      health: detail("Distingue recurso o estado clínico-operacional de la actividad que lo cambia.", ref("source.manual.health", "clinical-state")),
    },
    action: { kind: "focus", actionId: "canvas:create-object-process", label: "Elegir objeto o proceso" },
  },
  {
    contentId: "content.entity.properties",
    capabilityId: "cap.entity.properties",
    moment: "Al abrir una propiedad no obvia",
    contexts: ["editable"],
    authorityPlane: "validity",
    now: "Edita el campo propietario sin cambiar otra dimensión.",
    criterion: "Esencia y afiliación tienen semántica OPM; alias, descripción, unidad, valor, URL e imagen son metadatos o realización.",
    sourceRefs: refs(
      ref("source.canon.rules", "ontology-entities"),
      ref("source.canon.opd", "things"),
      ref("source.manual.opforja", "interface"),
    ),
    applicableLenses: [],
    action: { kind: "focus", actionId: "inspector:entity-properties", label: "Ir al campo" },
  },
  {
    contentId: "content.state.lifecycle",
    capabilityId: "cap.state.lifecycle",
    moment: "Al crear estados o marcar initial, final, default o Current",
    contexts: ["editable", "simulation"],
    authorityPlane: "validity",
    now: "Declara un estado posible del objeto y la marca que realmente necesitas.",
    criterion: "Current declarado persiste e inicia el runner; current de runtime es efímero. Sin Current, el fallback es default, initial y luego el primero estable.",
    sourceRefs: refs(
      ref("source.canon.rules", "entity-states"),
      ref("source.canon.opd", "states"),
      ref("source.manual.opm", "states"),
    ),
    applicableLenses: ALL_LENSES,
    lensDetails: {
      systems: detail("Usa estados observables del sistema, no fases de un plan oculto.", ref("source.manual.systems", "transition")),
      software: detail("Separa estado persistido de estado efímero de ejecución.", ref("source.manual.software", "runtime-state")),
      health: detail("No confundas estado clínico con ubicación o responsabilidad operacional.", ref("source.manual.health", "clinical-state")),
    },
    action: { kind: "focus", actionId: "inspector:state-lifecycle", label: "Revisar estado" },
  },
  {
    contentId: "content.link.procedural",
    capabilityId: "cap.link.procedural",
    moment: "Al conectar un proceso con un objeto u otro proceso",
    contexts: ["editable"],
    authorityPlane: "validity",
    now: "Pregunta qué le ocurre al objeto o qué habilita al proceso.",
    criterion: "Consumo, resultado y efecto transforman; agente, instrumento e invocación habilitan o ejecutan con significados distintos.",
    sourceRefs: refs(
      ref("source.canon.rules", "procedural-links"),
      ref("source.manual.opm", "transforming-links"),
      ref("source.manual.opm", "enabling-links"),
    ),
    applicableLenses: [],
    action: { kind: "focus", actionId: "inspector:link-procedural", label: "Elegir tipo de enlace" },
  },
  {
    contentId: "content.link.structural",
    capabilityId: "cap.link.structural",
    moment: "Al relacionar cosas estructuralmente",
    contexts: ["editable"],
    authorityPlane: "validity",
    now: "Elige qué relación estructural expresa el hecho.",
    criterion: "Agregación expresa partes; exhibición atributos; generalización especializaciones; instanciación ejemplares.",
    sourceRefs: refs(
      ref("source.canon.rules", "structural-links"),
      ref("source.canon.opd", "structural-links"),
      ref("source.manual.opm", "structural-links"),
    ),
    applicableLenses: [],
    action: { kind: "focus", actionId: "inspector:link-structural", label: "Elegir relación" },
  },
  {
    contentId: "content.flow.control.decision",
    capabilityId: "cap.flow.control",
    moment: "Ante una decisión, abanico o control activo",
    contexts: ["editable", "simulation"],
    authorityPlane: "validity",
    now: "Declara si se espera, omite o dispara, y cuántas ramas deben ocurrir.",
    criterion: "AND exige todas; XOR exactamente una; OR al menos una. Multiplicidad y umbral temporal son decisiones separadas.",
    sourceRefs: refs(
      ref("source.canon.rules", "logical-fans"),
      ref("source.canon.rules", "control-modifiers"),
      ref("source.cheatsheet.flow-control", "logical-fans"),
      ref("source.manual.opm", "logical-operators"),
    ),
    applicableLenses: [],
    action: { kind: "focus", actionId: "inspector:flow-control", label: "Revisar control" },
  },
  {
    contentId: "content.flow.probabilistic-reference",
    capabilityId: "cap.flow.probabilistic-weights",
    moment: "Al consultar pesos probabilísticos persistidos",
    contexts: ["editable", "simulation", "read-only"],
    authorityPlane: "validity",
    now: "Esta capacidad permanece como referencia programada.",
    criterion: "El uniforme usado por la simulación decide una corrida; no persiste pesos del caso C ni convierte alternativas ordinarias en probabilidades.",
    sourceRefs: refs(
      ref("source.canon.rules", "logical-fans"),
      ref("source.cheatsheet.flow-control", "logical-fans"),
      ref("source.cheatsheet.simulation", "runtime"),
    ),
    applicableLenses: [],
  },
  {
    contentId: "content.appearance.view",
    capabilityId: "cap.appearance.view",
    moment: "Al traer, ocultar, plegar o mover una aparición",
    contexts: ["editable", "read-only"],
    authorityPlane: "opd",
    now: "Estás cambiando la vista de una entidad lógica.",
    criterion: "Una entidad puede aparecer en varios OPDs; visibilidad y layout no crean ni borran el hecho lógico.",
    sourceRefs: refs(
      ref("source.canon.opd", "layout-routing"),
      ref("source.manual.opm", "bimodality"),
      ref("source.manual.opforja", "interface"),
    ),
    applicableLenses: [],
    action: { kind: "focus", actionId: "inspector:appearance", label: "Revisar apariciones" },
  },
  {
    contentId: "content.refinement.question",
    capabilityId: "cap.refinement.advanced",
    moment: "Antes de descomponer, desplegar o adoptar",
    contexts: ["editable"],
    authorityPlane: "method",
    now: "Escribe la pregunta que este OPD responderá.",
    criterion: "Cada refinamiento debe responder una pregunta real, no decorar el árbol.",
    sourceRefs: refs(
      ref("source.canon.method", "refinement"),
      ref("source.canon.opd", "refinement"),
      ref("source.manual.opforja", "refinement"),
    ),
    applicableLenses: ALL_LENSES,
    lensDetails: {
      systems: detail("Pregunta qué parte de función, frontera o cambio debe aclarar el detalle.", ref("source.manual.systems", "purpose")),
      software: detail("Pregunta qué contrato, estado o colaboración debe aclarar el detalle.", ref("source.manual.software", "interfaces")),
      health: detail("Pregunta qué flujo, responsabilidad o estado clínico-operacional debe aclarar el detalle.", ref("source.manual.health", "continuity")),
    },
    action: { kind: "focus", actionId: "opd-header:question-frontier", label: "Editar pregunta" },
  },
  {
    contentId: "content.refinement.confirmed",
    capabilityId: "cap.refinement.advanced",
    moment: "Después de confirmar un refinamiento",
    contexts: ["editable"],
    authorityPlane: "opd",
    now: "El OPD, su vínculo y su pregunta quedaron unidos en un resultado.",
    criterion: "Undo debe restaurar árbol, slot y pregunta anteriores; adoptar integra y no cambia el rigor.",
    sourceRefs: refs(
      ref("source.canon.opd", "refinement"),
      ref("source.canon.method", "refinement"),
      ref("source.manual.opforja", "refinement"),
    ),
    applicableLenses: [],
  },
  {
    contentId: "content.view.derived",
    capabilityId: "cap.view.derived",
    moment: "Al entrar a una vista derivada o de submodelo",
    contexts: ["read-only", "mobile-read"],
    authorityPlane: "opd",
    now: "Lees una proyección sin hechos propios.",
    criterion: "Navega a la entidad propietaria para mutar; una vista genérica no emite OPL ni se trata como refinamiento.",
    sourceRefs: refs(
      ref("source.canon.opd", "opd-tree"),
      ref("source.manual.opforja", "interface"),
    ),
    applicableLenses: [],
    action: { kind: "navigate", actionId: "tree:derived-view", label: "Ir al propietario" },
  },
  {
    contentId: "content.requirement.coverage",
    capabilityId: "cap.requirement.coverage",
    moment: "Al crear o vincular un requisito",
    contexts: ["editable"],
    authorityPlane: "validity",
    now: "Separa el requisito de la evidencia que permitiría juzgarlo.",
    criterion: "Un vínculo de cobertura declara relación en el modelo; no demuestra satisfacción externa ni certifica cumplimiento.",
    sourceRefs: refs(
      ref("source.canon.rules", "modeling-principles"),
      ref("source.manual.software", "requirements"),
      ref("source.manual.systems", "requirements"),
    ),
    applicableLenses: ["systems", "software", "health"],
    lensDetails: {
      systems: detail("Conserva el criterio y la evidencia fuera de una etiqueta binaria.", ref("source.manual.systems", "requirements")),
      software: detail("Vincula requisito con evidencia ejecutable sin confundir test verde con verdad de dominio.", ref("source.manual.software", "requirements")),
      health: detail("No conviertas cobertura en conformidad clínica o regulatoria automática.", ref("source.manual.health", "boundary")),
    },
    action: { kind: "focus", actionId: "requirement:satisfy", label: "Revisar requisito" },
  },
  {
    contentId: "content.ontology.lexical",
    capabilityId: "cap.ontology.lexical",
    moment: "Al normalizar términos organizacionales",
    contexts: ["editable"],
    authorityPlane: "method",
    now: "Registra término canónico, sinónimos y grado de control.",
    criterion: "Esta herramienta normaliza léxico; no construye una ontología formal, no infiere el dominio y todavía no aplica sugerencias ni reemplazos en la UI.",
    sourceRefs: refs(
      ref("source.canon.method", "heuristics"),
      ref("source.cheatsheet.ontology", "controlled-vocabulary"),
      ref("source.manual.opforja", "mental-model"),
    ),
    applicableLenses: [],
    action: { kind: "focus", actionId: "ontology:save", label: "Guardar vocabulario" },
  },
  {
    contentId: "content.opl.delta",
    capabilityId: "cap.opl.forward-reverse",
    moment: "Al leer o aplicar un cambio OPL",
    contexts: ["editable", "read-only"],
    authorityPlane: "opl",
    now: "¿Expresa la nueva decisión?",
    criterion: "Aplica solo líneas reconocidas; una forma sin inversa viva se corrige en el canvas, no mediante una promesa textual.",
    sourceRefs: refs(
      ref("source.canon.opl", "editing"),
      ref("source.manual.opm", "bimodality"),
      ref("source.manual.opforja", "opl-rules"),
    ),
    applicableLenses: [],
    action: { kind: "focus", actionId: "opl:apply-preview", label: "Revisar preview" },
  },
  {
    contentId: "content.diagnostic.integrity",
    capabilityId: "cap.diagnostic.reactive",
    moment: "Cuando un hallazgo de integridad gobierna el gesto",
    contexts: ["editable", "read-only"],
    authorityPlane: "validity",
    now: "El diagnóstico propietario indica el hecho corregible.",
    criterion: "Navega al issue; no dupliques el contador ni esperes un botón Revalidar: el cambio recomputa automáticamente.",
    sourceRefs: refs(
      ref("source.canon.rules", "anti-patterns"),
      ref("source.manual.opforja", "validation"),
      ref("source.cheatsheet.unblocked", "read-rule"),
    ),
    applicableLenses: [],
    action: { kind: "navigate", actionId: "diagnostic:focus-issue", label: "Ir al elemento" },
  },
  {
    contentId: "content.navigation.reasoning",
    capabilityId: "cap.navigation.reasoning",
    moment: "Al buscar, recorrer o derivar impacto",
    contexts: ["editable", "read-only"],
    authorityPlane: "method",
    now: "Usa la estructura viva para localizar el hecho afectado.",
    criterion: "El resultado demuestra dependencia estructural del modelo; no certeza causal, equivalencia conductual ni evidencia del mundo.",
    sourceRefs: refs(
      ref("source.canon.method", "heuristics"),
      ref("source.manual.systems", "verification"),
      ref("source.manual.opforja", "interface"),
    ),
    applicableLenses: ALL_LENSES,
    lensDetails: {
      systems: detail("Sigue frontera, bucles y dependencias antes de intervenir.", ref("source.manual.systems", "verification")),
      software: detail("Distingue impacto estructural de compatibilidad o comportamiento en runtime.", ref("source.manual.software", "interfaces")),
      health: detail("No extrapoles una dependencia de flujo a causalidad clínica.", ref("source.manual.health", "flow")),
    },
    action: { kind: "open-existing", actionId: "palette:buscar-modelo", label: "Buscar en el modelo" },
  },
  {
    contentId: "content.simulation.conceptual.scope",
    capabilityId: "cap.simulation.conceptual",
    moment: "Al iniciar la simulación conceptual",
    contexts: ["simulation"],
    authorityPlane: "validity",
    now: "Ensaya precondiciones, transiciones y resultados del modelo.",
    criterion: "La corrida interpreta hechos OPM; no ejecuta el sistema real ni aporta validación empírica.",
    sourceRefs: refs(
      ref("source.canon.rules", "conceptual-execution"),
      ref("source.cheatsheet.simulation", "falsify"),
      ref("source.manual.opm", "simulation"),
    ),
    applicableLenses: [],
    action: { kind: "focus", actionId: "simulation:step", label: "Revisar primer paso" },
  },
  {
    contentId: "content.simulation.conceptual.blocked",
    capabilityId: "cap.simulation.conceptual",
    moment: "Cuando la corrida queda bloqueada",
    contexts: ["simulation"],
    authorityPlane: "validity",
    now: "El siguiente proceso no cumple sus condiciones vivas.",
    criterion: "Vuelve al hecho que prepara o habilita; no fuerces la corrida para ocultar una precondición.",
    sourceRefs: refs(
      ref("source.canon.rules", "control-modifiers"),
      ref("source.cheatsheet.simulation", "microphases"),
    ),
    applicableLenses: [],
    action: { kind: "navigate", actionId: "simulation:step", label: "Ver causa del bloqueo" },
  },
  {
    contentId: "content.simulation.conceptual.step",
    capabilityId: "cap.simulation.conceptual",
    moment: "Después de un paso conceptual",
    contexts: ["simulation"],
    authorityPlane: "validity",
    now: "El runner aplicó preparación, ejecución y resultado del paso.",
    criterion: "Current de runtime ayuda a leer la corrida y no cambia el Current declarado persistente.",
    sourceRefs: refs(
      ref("source.canon.rules", "conceptual-execution"),
      ref("source.manual.opm", "simulation"),
    ),
    applicableLenses: [],
    action: { kind: "focus", actionId: "simulation:step", label: "Ver hecho activo" },
  },
  {
    contentId: "content.simulation.conceptual.complete",
    capabilityId: "cap.simulation.conceptual",
    moment: "Al completar la corrida conceptual",
    contexts: ["simulation"],
    authorityPlane: "validity",
    now: "La corrida terminó bajo los supuestos del modelo.",
    criterion: "Completitud de corrida no equivale a validez empírica, desempeño ni adopción del sistema.",
    sourceRefs: refs(
      ref("source.canon.rules", "conceptual-execution"),
      ref("source.manual.systems", "verification"),
      ref("source.cheatsheet.simulation", "falsify"),
    ),
    applicableLenses: [],
  },
  {
    contentId: "content.simulation.numeric.scope",
    capabilityId: "cap.simulation.numeric",
    moment: "Al configurar muestreo numérico",
    contexts: ["editable", "simulation"],
    authorityPlane: "method",
    now: "Define atributos, parámetros y semilla del muestreo.",
    criterion: "El CSV contiene valores simulados de atributos; no dinámica de procesos, colas, capacidad, rendimiento ni evidencia real.",
    sourceRefs: refs(
      ref("source.canon.method", "quantitative-requirements-simulation"),
      ref("source.cheatsheet.simulation", "numeric"),
      ref("source.guide.productive", "simulation"),
    ),
    applicableLenses: ALL_LENSES,
    lensDetails: {
      systems: detail("No conviertas una muestra en comportamiento del sistema completo.", ref("source.manual.systems", "verification")),
      software: detail("No la rotules prueba de carga ni benchmark.", ref("source.manual.software", "delivery")),
      health: detail("No la presentes como dato clínico o poblacional observado.", ref("source.manual.health", "population")),
    },
    action: { kind: "focus", actionId: "simulation:numeric-run", label: "Revisar parámetros" },
  },
  {
    contentId: "content.reuse.pieces",
    capabilityId: "cap.reuse.pieces",
    moment: "Al traer una Pieza",
    contexts: ["editable"],
    authorityPlane: "method",
    now: "Decide entre independencia y seguimiento del origen.",
    criterion: "Calcar crea una copia independiente; Anclar crea la copia y conserva una referencia para detectar drift.",
    sourceRefs: refs(
      ref("source.canon.method", "boundary-object-composition"),
      ref("source.cheatsheet.anchor-copy", "choice"),
      ref("source.manual.opforja", "interface"),
    ),
    applicableLenses: [],
    action: { kind: "open-existing", actionId: "palette:vitrina-estereotipos", label: "Elegir Calcar o Anclar" },
  },
  {
    contentId: "content.reuse.anchor-drift",
    capabilityId: "cap.reuse.anchor-drift",
    moment: "Cuando una Pieza anclada diverge",
    contexts: ["editable", "read-only"],
    authorityPlane: "method",
    now: "Elige aceptar la firma actual o perder la vigilancia.",
    criterion: "Re-sincronizar actualiza la firma base sin tocar contenido local; Soltar crea independencia y pierde avisos.",
    sourceRefs: refs(
      ref("source.canon.method", "complexity"),
      ref("source.cheatsheet.anchor-copy", "drift"),
      ref("source.cheatsheet.anchor-copy", "detach"),
      ref("source.manual.opforja", "interface"),
    ),
    applicableLenses: [],
    action: { kind: "focus", actionId: "inspector:anchor-drift", label: "Revisar anclaje" },
  },
  {
    contentId: "content.submodel.reference",
    capabilityId: "cap.submodel.reference",
    moment: "Al conectar otro modelo como referencia",
    contexts: ["editable", "read-only"],
    authorityPlane: "method",
    now: "Consulta el submodelo sin incorporar sus hechos.",
    criterion: "La referencia es solo lectura; para integrar hechos usa composición con interfaz compartida.",
    sourceRefs: refs(
      ref("source.canon.method", "boundary-object-composition"),
      ref("source.manual.systems", "interfaces"),
      ref("source.manual.opforja", "interface"),
    ),
    applicableLenses: [],
    action: { kind: "open-existing", actionId: "submodel:open-reference", label: "Abrir referencia" },
  },
  {
    contentId: "content.composition.choice",
    capabilityId: "cap.composition.interface",
    moment: "Antes de componer modelos",
    contexts: ["editable"],
    authorityPlane: "validity",
    now: "Confirma interfaz, mapeos, procedencia y contenido incorporado.",
    criterion: "Mapeos irresolubles o integridad rota bloquean; una coincidencia es heurística y la linealidad múltiple solo orienta.",
    sourceRefs: refs(
      ref("source.canon.rules", "categorical-composition"),
      ref("source.manual.systems", "interfaces"),
      ref("source.manual.opforja", "interface"),
    ),
    applicableLenses: ["systems", "software"],
    lensDetails: {
      systems: detail("Declara frontera de cada modelo y qué hechos cruzan la interfaz.", ref("source.manual.systems", "interfaces")),
      software: detail("Trata la coincidencia sugerida como compatibilidad por verificar, no equivalencia.", ref("source.manual.software", "interfaces")),
    },
    action: { kind: "focus", actionId: "composition:apply", label: "Revisar composición" },
  },
  {
    contentId: "content.composition.confirmed",
    capabilityId: "cap.composition.interface",
    moment: "Después de aplicar una composición con interfaz resuelta",
    contexts: ["editable"],
    authorityPlane: "validity",
    now: "Los hechos incorporados conservan procedencia y una interfaz explícita.",
    criterion: "El resultado confirma la mutación aplicada; no prueba equivalencia conductual ni validez externa de los modelos.",
    sourceRefs: refs(
      ref("source.canon.rules", "categorical-composition"),
      ref("source.canon.opd", "composition"),
      ref("source.manual.systems", "interfaces"),
    ),
    applicableLenses: ["systems", "software"],
    lensDetails: {
      systems: detail("Revisa qué frontera e interfaz quedaron preservadas.", ref("source.manual.systems", "interfaces")),
      software: detail("Verifica compatibilidad operacional fuera de la equivalencia estructural.", ref("source.manual.software", "interfaces")),
    },
  },
  {
    contentId: "content.composition.preservation",
    capabilityId: "cap.composition.interface",
    moment: "Al explicar preservación en una composición",
    contexts: ["editable", "read-only"],
    authorityPlane: "formal-explanation",
    now: "La interfaz explícita permite razonar qué estructura debe preservarse.",
    criterion: "Esta lente explica composición y preservación; no decide validez, severidad ni equivalencia conductual.",
    sourceRefs: refs(
      ref("source.canon.categorical", "horizontal-composition"),
      ref("source.manual.systems", "interfaces"),
    ),
    applicableLenses: ["systems", "software"],
    lensDetails: {
      systems: detail("Usa la interfaz como frontera explícita de preservación.", ref("source.manual.systems", "interfaces")),
      software: detail("Separa compatibilidad estructural de equivalencia operacional.", ref("source.manual.software", "interfaces")),
    },
  },
  {
    contentId: "content.evidence.dispatch",
    capabilityId: "cap.evidence.notes-anchors",
    moment: "Al registrar evidencia, duda o autoridad",
    contexts: ["editable"],
    authorityPlane: "method",
    now: "Despacha cada afirmación al canal que conserva su autoridad.",
    criterion: "Nota para duda; ledger para procedencia; ancla para norma. RATIFICAR solo refleja una ancla upstream pendiente.",
    sourceRefs: refs(
      ref("source.canon.method", "validation"),
      ref("source.manual.systems", "evidence"),
      ref("source.cheatsheet.skill-interaction", "roles"),
    ),
    applicableLenses: ALL_LENSES,
  },
  {
    contentId: "content.handoff.skill",
    capabilityId: "cap.handoff.skill",
    moment: "Al relevar el modelo a modelamiento-opm",
    contexts: ["editable", "read-only"],
    authorityPlane: "method",
    now: "Copia el contexto o log que el consumidor externo necesita.",
    criterion: "La mesa entrega hechos, pendientes y OPL; la skill re-elicita y devuelve cambios solo con aceptación explícita.",
    sourceRefs: refs(
      ref("source.canon.method", "refinement"),
      ref("source.cheatsheet.skill-interaction", "roles"),
      ref("source.cheatsheet.skill-flow", "agent-loop"),
    ),
    applicableLenses: [],
    action: { kind: "open-existing", actionId: "palette:copiar-contexto-skill", label: "Copiar contexto" },
  },
  {
    contentId: "content.ficha.local",
    capabilityId: "cap.ficha.local",
    moment: "Al completar la ficha o cambiar sus enfoques sin procedencia upstream",
    contexts: ["editable"],
    authorityPlane: "method",
    now: "Declara solo el contexto que ayude a decidir y revisar el modelo.",
    criterion: "La ficha local y sus enfoques orientan el trabajo; no emiten OPL, no bloquean el modelado y no sustituyen evidencia.",
    sourceRefs: refs(
      ref("source.canon.method", "before-seed"),
      ref("source.manual.systems", "work-card"),
      ref("source.manual.opforja", "forja-flow"),
    ),
    applicableLenses: ALL_LENSES,
    lensDetails: {
      systems: detail("Usa la ficha para separar pregunta, frontera, criterio y vida útil.", ref("source.manual.systems", "work-card")),
      software: detail("Conserva la frontera entre dominio, realización y operación.", ref("source.manual.software", "domain-representation")),
      health: detail("Declara escala y responsabilidad sin convertir la ficha en consejo clínico.", ref("source.manual.health", "boundary")),
    },
  },
  {
    contentId: "content.ficha.upstream.limit",
    capabilityId: "cap.ficha.upstream",
    moment: "Cuando el modelo ya tiene procedencia upstream",
    contexts: ["editable", "read-only"],
    authorityPlane: "method",
    now: "La ficha propietaria permanece en el canal upstream.",
    criterion: "No crees una segunda ficha local; el roundtrip exige transporte proto, compilador, bundle y lectura propietaria probados.",
    sourceRefs: refs(
      ref("source.canon.method", "governing-boundary"),
      ref("source.cheatsheet.skill-flow", "provenance"),
      ref("source.manual.opforja", "agent-operation"),
    ),
    applicableLenses: [],
  },
  {
    contentId: "content.history.version",
    capabilityId: "cap.history.review-version",
    moment: "Al recibir revisión o restaurar una versión",
    contexts: ["editable", "read-only"],
    authorityPlane: "method",
    now: "Decide si aceptar evidencia entrante o preservar una copia histórica.",
    criterion: "Una revisión no muta sin aceptación; restaurar crea copia y eliminar una versión es irreversible.",
    sourceRefs: refs(
      ref("source.canon.method", "validation"),
      ref("source.guide.productive", "versions"),
      ref("source.manual.systems", "verification"),
    ),
    applicableLenses: [],
    action: { kind: "open-existing", actionId: "palette:versiones-modelo", label: "Abrir versiones" },
  },
  {
    contentId: "content.history.version-mutation",
    capabilityId: "cap.history.review-version",
    moment: "Al crear, restaurar como copia o eliminar una versión",
    contexts: ["editable"],
    authorityPlane: "method",
    now: "Distingue el efecto persistente y su recuperación antes de confirmarlo.",
    criterion: "Crear agrega historia; restaurar crea otra identidad editable; eliminar es irreversible después del commit.",
    sourceRefs: refs(
      ref("source.canon.method", "validation"),
      ref("source.guide.productive", "versions"),
      ref("source.manual.systems", "verification"),
    ),
    applicableLenses: [],
  },
  {
    contentId: "content.persistence.import-save",
    capabilityId: "cap.persistence.import-save",
    moment: "Al importar, guardar o cambiar identidad",
    contexts: ["editable", "read-only"],
    authorityPlane: "method",
    now: "Declara destino, reemplazo y recuperación antes del efecto externo.",
    criterion: "Importar en activa reemplaza y reinicia historial; pestaña nueva no. Dirty exige Guardar, Descartar e importar o Cancelar.",
    sourceRefs: refs(
      ref("source.canon.method", "opforja-runtime"),
      ref("source.guide.productive", "backup"),
      ref("source.manual.opforja", "interface"),
    ),
    applicableLenses: [],
    action: { kind: "open-existing", actionId: "palette:abrir-importar", label: "Abrir o importar" },
  },
  {
    contentId: "content.export.interchange",
    capabilityId: "cap.export.interchange",
    moment: "Antes de exportar o compartir",
    contexts: ["editable", "read-only"],
    authorityPlane: "method",
    now: "Elige el producto según su destino real.",
    criterion: "JSON preserva el modelo; OPL/Markdown lo comunica; PNG realiza OPDs; contexto/log releva. Exportar no valida.",
    sourceRefs: refs(
      ref("source.canon.method", "validation"),
      ref("source.guide.productive", "export"),
      ref("source.cheatsheet.runbook", "close"),
    ),
    applicableLenses: [],
    action: { kind: "open-existing", actionId: "palette:exportar-json", label: "Elegir exportación" },
  },
  {
    contentId: "content.discovery.corpus",
    capabilityId: "cap.discovery.corpus",
    moment: "Al buscar una referencia desde Ctrl+K",
    contexts: ["editable", "read-only", "simulation", "mobile-read"],
    authorityPlane: "method",
    now: "Busca por decisión, capacidad o término y abre la fuente propietaria.",
    criterion: "La búsqueda usa el registro local; OPM general siempre manda y las lentes solo afinan ejemplos y referencias.",
    sourceRefs: refs(
      ref("source.canon.method", "heuristics"),
      ref("source.cheatsheets.index", "language-patterns"),
      ref("source.manual.opforja", "mental-model"),
    ),
    applicableLenses: ALL_LENSES,
    action: { kind: "open-existing", actionId: "tutor:search", label: "Buscar referencia" },
  },
  {
    contentId: "content.abstraction.outzoom-reference",
    capabilityId: "cap.abstraction.outzoom",
    moment: "Al consultar abstracción automática",
    contexts: ["editable", "read-only"],
    authorityPlane: "method",
    now: "Out-zoom automático permanece como referencia conceptual.",
    criterion: "Puedes leer el fundamento de abstracción, pero opforja no expone una acción viva que la ejecute.",
    sourceRefs: refs(
      ref("source.canon.method", "complexity"),
      ref("source.manual.opm", "refinement"),
    ),
    applicableLenses: [],
  },
  {
    contentId: "content.export.external-limit",
    capabilityId: "cap.export.pdf-diff-merge",
    moment: "Al buscar PDF, diff visual o merge",
    contexts: ["editable", "read-only"],
    authorityPlane: "method",
    now: "Esas capacidades no están disponibles en la mesa.",
    criterion: "Usa JSON, OPL, Markdown, documento canónico, PNG o contexto; no se ofrece un control ficticio.",
    sourceRefs: refs(
      ref("source.canon.method", "governing-boundary"),
      ref("source.guide.productive", "limits"),
    ),
    applicableLenses: [],
  },
  {
    contentId: "content.inference.ai-limit",
    capabilityId: "cap.inference.ai",
    moment: "Al buscar clasificación o modelado automático",
    contexts: ["editable", "read-only"],
    authorityPlane: "method",
    now: "La decisión de modelado sigue siendo humana.",
    criterion: "El tutor no usa red, LLM ni heurísticas de nombres y no anuncia AI Text mientras siga deshabilitado.",
    sourceRefs: refs(
      ref("source.canon.method", "governing-boundary"),
      ref("source.manual.opforja", "limits"),
    ),
    applicableLenses: [],
  },
  {
    contentId: "content.interaction.readonly",
    capabilityId: "cap.interaction.readonly",
    moment: "En móvil o una apertura de solo lectura",
    contexts: ["read-only", "mobile-read"],
    authorityPlane: "method",
    now: "Puedes leer y navegar; la mutación pertenece a una apertura editable compatible.",
    criterion: "La ayuda no renderiza acciones imposibles ni confunde guardia de apertura con rol Biblioteca.",
    sourceRefs: refs(
      ref("source.canon.method", "opforja-runtime"),
      ref("source.guide.productive", "enter"),
      ref("source.manual.opforja", "interface"),
    ),
    applicableLenses: [],
    action: { kind: "navigate", actionId: "mobile:read-context", label: "Ver contexto" },
  },
];

export interface ResolvedTutorLensDetail extends TutorLensDetail {
  lens: KnowledgeLens;
}

export type ResolvedTutorContent = Omit<TutorContent, "lensDetails"> & {
  activeLenses: readonly KnowledgeLens[];
  lensDetails: readonly ResolvedTutorLensDetail[];
};

const CONTENT_BY_ID = new Map<TutorContentId, TutorContent>(
  TUTOR_CONTENT.map((content) => [content.contentId, content]),
);

export function getTutorContent(contentId: TutorContentId): TutorContent | null {
  return CONTENT_BY_ID.get(contentId) ?? null;
}

export function getTutorContentForCapability(
  capabilityId: CapabilityId,
  lenses: readonly KnowledgeLens[] = [],
): ResolvedTutorContent[] {
  return TUTOR_CONTENT
    .filter((content) => content.capabilityId === capabilityId)
    .map((content) => resolveContent(content, lenses))
    .sort((a, b) => a.contentId.localeCompare(b.contentId, "en"));
}

export function resolveTutorContent(
  contentId: TutorContentId,
  lenses: readonly KnowledgeLens[] = [],
): ResolvedTutorContent | null {
  const content = getTutorContent(contentId);
  return content ? resolveContent(content, lenses) : null;
}

export function searchTutorContent(
  query: string,
  lenses: readonly KnowledgeLens[] = [],
): ResolvedTutorContent[] {
  const terms = normalizeSearchText(query).split(" ").filter(Boolean);
  return TUTOR_CONTENT
    .filter((content) => {
      const searchable = normalizeSearchText([
        content.contentId,
        content.capabilityId,
        content.moment,
        content.now,
        content.criterion,
        content.action?.label ?? "",
        content.action?.actionId ?? "",
        ...content.sourceRefs.flatMap((ref) => {
          const source = TUTOR_SOURCE_BY_ID.get(ref.sourceId);
          return source ? [source.title, source.locator, ...source.sections] : [];
        }),
      ].join(" "));
      return terms.every((term) => searchable.includes(term));
    })
    .map((content) => resolveContent(content, lenses))
    .sort((a, b) => a.contentId.localeCompare(b.contentId, "en"));
}

function resolveContent(content: TutorContent, lenses: readonly KnowledgeLens[]): ResolvedTutorContent {
  const activeLenses = normalizeKnowledgeLenses(lenses)
    .filter((lens) => content.applicableLenses.includes(lens));
  const { lensDetails, ...base } = content;
  return {
    ...base,
    activeLenses,
    lensDetails: activeLenses.flatMap((lens) => {
      const value = lensDetails?.[lens];
      return value ? [{ lens, ...value }] : [];
    }),
  };
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function ref(sourceId: TutorSourceId, anchor: string): TutorSourceRef {
  return { sourceId, anchor };
}

function refs(...sourceRefs: readonly TutorSourceRef[]): TutorSourceRef[] {
  return [...sourceRefs];
}

function detail(criterion: string, sourceRef: TutorSourceRef): TutorLensDetail {
  return { criterion, sourceRefs: [sourceRef] };
}
