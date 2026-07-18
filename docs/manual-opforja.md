# Manual de opforja

Manual operativo **integrado** (humanos + agentes) para modelar con OPM/ISO 19450
en opforja/deep-opm-pro. Consolida en un solo documento las dos pistas de uso de
la herramienta sobre un tronco de método común.

- URN repo-local: `urn:fxsl:kb:manual-opforja-es` (working-artifact del repo;
  ver [resolutor repo-local](canon-opm/resolutor-urn.json) → `puente_inverso`).
- Instancia en producción:
  [opforja.sanixai.com](https://opforja.sanixai.com).
- Estado operativo vigente (bloqueantes, pendientes, riesgos):
  [handoff vigente](handoff-2026-07-18.md).

## Contrato del manual

Este manual **enseña a usar la herramienta y el método**. No es la SSOT del
método ni copia su contenido. Cuando una decisión es normativa, se cita su
artefacto propietario **por URN** y se resuelve su ruta vía
[resolutor repo-local](canon-opm/resolutor-urn.json) (lector:
[resolutorUrn.ts](../app/src/canon/resolutorUrn.ts)).
La SSOT viva reside en pneuma bajo `KORA_RAIZ`.

| Plano | Artefacto propietario (URN) | Qué decide |
| --- | --- | --- |
| Validez y severidad | `urn:fxsl:kb:reglas-opm-estrictas-es` | Si un hecho OPD/OPL es válido, condicionado, advertido o prohibido. |
| Método | `urn:fxsl:kb:metodologia-forja-opm-es` | En qué orden modelar, cuándo detenerse, cómo refinar y validar utilidad. |
| OPD | `urn:fxsl:kb:spec-forja-opd-es` | Cómo se realiza visualmente un hecho OPM. |
| OPL | `urn:fxsl:kb:spec-forja-opl-es` | Cómo se genera, lee, parsea, edita y sincroniza OPL-ES. |
| Formal | `urn:fxsl:kb:opm-categorial-es` | Qué lectura estructural explica equivalencia, composición y refinamiento. |
| Operación del agente | `urn:kora:artefacto:modelamiento-opm` | Cómo un agente conduce, valida y serializa un modelo con disciplina dialéctica. |

**Regla editorial dura**: el manual resume criterio y enlaza por URN/ruta.
**Nunca** transcribe matrices de reglas, glifos completos, EBNF, plantillas OPL
ni catálogos exhaustivos de la SSOT — eso envejecería como copia paralela. El
shape JSON del modelo lo definen el
[serializador JSON](../app/src/serializacion/json.ts) y los
[tipos del modelo](../app/src/modelo/tipos/), no la prosa de este manual.

## Tabla de contenidos

- Tronco común: §0 Qué es opforja · §1 Modelo mental · §2 Flujo Forja
- Pista-HUMANO: §3 Interfaz · §4 Construir desde cero · §5 Refinar
- Pista-AGENTE: §A Operar opforja como agente
- Reconvergencia: §6 OPD práctico · §7 OPL práctico · §8 Validación · §9 Patrones
- §10 Ejemplo end-to-end · §L Límites de la mesa · §Apéndices

---

## 0. Qué es opforja

opforja es la realización de OPM en deep-opm-pro: una mesa de trabajo para
construir, leer, validar y serializar modelos OPM bimodales, con OPD como
superficie visual y OPL-ES como superficie textual.

OPM aporta la ontología mínima — objetos, procesos, estados, enlaces. Forja añade
la disciplina operativa: reglas estrictas, método, realización visual, realización
textual, roundtrip y validación. opforja no es un dibujador genérico: una figura
en el canvas vale solo si porta un hecho OPM válido y ese hecho puede expresarse
en OPL. Tampoco descubre la verdad del dominio: las fuentes aportan evidencia e
hipótesis, el dueño humano las ratifica y opforja custodia que el significado
aceptado se exprese con primitivas OPM correctas.

**Audiencia**: modeladores que construyen un sistema desde cero; agentes que
guían, validan o serializan; mantenedores de deep-opm-pro; revisores que necesitan
distinguir error de modelo, error de herramienta y deuda documental.

**Precedencia de lectura**: para uso práctico, este manual. Para resolver una
controversia, el artefacto propietario por URN (validez → reglas; camino →
metodología; visual → spec-opd; textual → spec-opl; formal → categorial). No usar
este manual para arbitrar una disputa normativa.

**Resultado esperado de una sesión**: no "un diagrama bonito" sino un paquete
auditable — propósito y alcance declarados, System Diagram legible, OPL que el
operador confirma, supuestos y brechas explícitos, validación tripartita,
aceptación del dueño de dominio y el siguiente refinamiento o criterio de
suficiencia. Si falta algo, es borrador, no modelo cerrado.

---

## 1. Modelo mental mínimo

**Función antes que forma.** Todo modelo debe converger en qué transformación
entrega valor y para quién; esa función es la semilla conceptual, aunque el primer
hecho se bosqueje bottom-up. Debe ser neutral respecto de la solución ("cruzar el
río" admite puente, ferry o túnel; "construir puente" ya escogió forma).

**Objeto, proceso, estado.** Un objeto existe; un proceso transforma; un estado es
una situación posible de un objeto. La pregunta fundacional es siempre: esto que
nombré, ¿existe o sucede? Palabras como "gestión", "módulo", "sistema",
"procesar" o "manejar" suelen esconder barro si no dicen qué cambia.

**Transformee, agente, instrumento.** El transformee es la cosa que el proceso
consume, produce, crea, destruye o cambia. El agente es exclusivamente una persona
o grupo de personas (R-AG-1; software, IA, sensores y organizaciones abstractas no
lo son — R-AG-1A/R-AG-1B). La responsabilidad ayuda a escoger qué personas
representar; no cambia la ontología. El instrumento habilita pero no se transforma.
Confundir transformee con habilitador es error ontológico, no detalle visual.

**OPD y OPL son dos caras del mismo hecho.** Cada hecho debe poder verse en OPD y
leerse en OPL. Si el OPL no se lee como lenguaje natural controlado, el OPD está
mal o incompleto. La bimodalidad es una forma de pensar, no una exportación tardía.

**Refinamiento.** In-zoom descompone un proceso; out-zoom recompone; unfold
despliega estructura de una cosa; fold la repliega. Una descomposición válida
conserva la firma de frontera del proceso abstracto.

**Barro ontológico.** Cualquier ambigüedad que vuelve caro o falso el siguiente
paso: nombre pobre, proceso sin transformee, agente confundido con instrumento,
esencia no declarada, frontera implícita, refinamiento sin motivo, supuesto
disfrazado de hecho. La conducta correcta no es adivinar: es detenerse, nombrar el
barro, citar la regla en juego y preguntar.

**Preguntas mínimas antes de plasmar una cosa o enlace**: ¿qué función se sirve?
¿qué cosa cambia? ¿existe o sucede? ¿se transforma o habilita? ¿es física o
informacional? ¿está dentro o fuera del sistema? ¿qué oración OPL la dice? Si
alguna no tiene respuesta, no es hecho terminado.

---

## 2. Flujo de modelamiento Forja

El orden de elicitación del SD es propiedad de `urn:fxsl:kb:metodologia-forja-opm-es`
§A2 (etapas 0–11; cada una cierra con un hecho explícito). Este manual no lo copia;
resume su forma:

- **A0 — antes de la semilla**: generar alternativas (al menos tres conceptos si la
  arquitectura no está decidida). Una misma firma de frontera las hace
  indistinguibles respecto de esos observables; no demuestra que sean
  sustituibles en estados, errores, tiempos u otros efectos no modelados.
- **A1 — clasificación del sistema**: artificial, natural, social o sociotécnico.
  La clase cambia cómo se pregunta por propósito, beneficiario, agencia humana y
  ocurrencia del problema.
- **A1.5 — dos arranques hermanos** (bottom-up de primera clase, `metodologia-forja`
  §A1.5 · realización `spec-forja-opd-es` §10.4 R-OPD-REF-20): Forja reconoce dos
  formas de empezar, ambas de primera clase y subordinadas a la función-semilla y a
  la equivalencia OPD↔OPL. **SD-primero** (opción predeterminada del asistente A2): fija la función
  en el SD y refina hacia abajo. **Bottom-up (bosquejo)**: traza **fragmentos sueltos**
  —OPDs sin padre— sin comprometer aún un SD, y reconcílialos después hacia el SD0 por
  **adopción** (verbo «adoptar» del Taller — fija padre + declara refinamiento en un
  gesto, el mismo constructor que el refinamiento top-down, convergente en el vínculo).
  La reconciliación resuelve **dónde pertenece** el fragmento; no cambia su especie.
  El asistente de etapas 0–11 (A2) realiza el arranque SD-primero; el bottom-up entra
  a él durante la reconciliación.
- **A2 — construcción del SD**: etapas 0–11 (clasificación → proceso principal →
  interesado → valor a transformar → función → agencia → frontera → instrumentos →
  resultados → entorno → ocurrencia del problema → compuerta PASA/FALLA §A8). El SD
  no busca completitud total sino una semilla honesta y trazable.
- **A3 — primer refinamiento**: responde una pregunta real, no decora. Cinco o más
  subprocesos al abrir el central = revisar la altitud.
- **A4 — complejidad**: por OPDs conectados, no vistas desconectadas; cada OPD con
  foco claro.
- **A5 — heurísticas**: modelar primero el cambio de valor; nombres que digan qué
  transforma o qué es; no estados sin atributo; registrar supuestos.
- **A6 — control de flujo**: eventos, condiciones, excepciones, invocación existen
  para explicar cuándo un proceso ocurre, se omite o llama a otro. Usar control solo
  cuando responde una pregunta de ejecución.
- **A7 — requisitos/errores/simulación/cuantitativo**: un requisito inferido no es
  norma; marcarlo como inferencia. Lo cuantitativo conserva polaridad, unidad,
  fórmula y procedencia.
- **A8 — validación tripartita**: (1) bloqueos estructurales — no avanzar; (2)
  mejoras metodológicas — avanzar solo con deuda declarada; (3) estilo/legibilidad.
  La validación stakeholder es una marca separada: el dueño humano decide si el
  modelo representa el dominio y sirve a la pregunta. Los barridos de integridad se
  hacen sobre el JSON canónico, no sobre el OPL emitido.

**Apunte y bosquejo (dos ejes de exploración).** Son hermanos por ejes distintos y
conviven — un apunte es el hogar natural del bosquejo bottom-up:
- **Apunte** relaja el **cierre**. Cuando el propósito es **pensar**, no cerrar, se
  marca el modelo como **apunte** ([Uso productivo](uso-productivo.md#apuntes-borradores-sin-rigor)):
  sigue siendo OPM legítimo, pero los gates de **validez** de A8 bajan a
  observación al margen en vez de bloquear. Régimen permisivo de la skill
  (§Regimen apunte).
- **Bosquejo** relaja el **orden de arranque** (A1.5): permite trazar OPDs sueltos sin
  fijar el SD primero, y reconciliar después. Régimen §Regimen bosquejo de la skill.
En ambos la **integridad referencial nunca se relaja**: no se permiten enlaces rotos
ni referencias inexistentes. Un OPD suelto es una deuda de portabilidad distinta:
en un apunte se informa y el export puede conservar la marca de bosquejo; en un
modelo bloquea el export canónico hasta adoptar o reconciliar. **Graduar** cambia el
régimen apunte→modelo y reengancha la severidad de A8; no adopta OPDs sueltos. El
diálogo informa esa severidad, pero deja la decisión final a la persona.

---

## Pista-HUMANO

### 3. Trabajar en la interfaz opforja

La interfaz es mesa de trabajo, no autoridad semántica. Si la UI permite una
operación que contradice el corpus, manda el corpus. Si la UI no implementa una
capacidad canonizada, se registra como brecha (§L y
[registro de conformidad](roadmap/registro-conformidad-ssot.md)), nunca como
atajo falso: toda brecha
de una regla `DEBE` se trata conforme a R-CONF-7 de
`urn:fxsl:kb:reglas-opm-estrictas-es` — deuda exigible o programación declarada; la
brecha silenciosa está prohibida.

La mecánica exacta de entrar, guardar, buscar, gestionar modelos, requisitos,
ontología organizacional, simulación, versiones y exportación vive en
[Uso productivo](uso-productivo.md). Este manual conserva la consecuencia
metodológica: canvas OPD y panel OPL proyectan el mismo hecho; el JSON permite
rehidratarlo; una imagen solo lo comunica; y la identidad de una cosa no cambia por
navegar entre sus apariciones.

El Taller y el régimen apunte se explican en §2; el puente humano-agente, en §A; y
Piezas, Calco y Anclaje, en §9. Los nombres, chips o fechas de una superficie no se
duplican aquí.

### 4. Construir un modelo desde cero

Walkthrough subordinado al orden normativo §A2 (al conducir una sesión A2 manda la
secuencia 0–11). Es recorrido didáctico, no botones concretos. Describe el
arranque **SD-primero**; para el arranque **bottom-up** (bosquejar fragmentos sueltos y
reconciliarlos hacia el SD0 por «adoptar») ver §2/A1.5. Ambos arranques convergen en
un SD coherente; la graduación es una decisión de cierre separada.

1. **Declarar el propósito**: oración verbo-objeto que diga el cambio sin fijar la
   forma ("mejorar disponibilidad de camas", no "crear plataforma"). Prueba útil: si
   esa solución no existiera, ¿qué valor seguiría siendo necesario?
2. **Verificar función transformadora**: identificar qué objeto entra distinto, sale
   distinto, se crea, se destruye o cambia de estado. Sin transformee, no dibujar.
3. **Nombrar el proceso central** como transformación, no como área (R-NOM-PROC-1;
   escala de nombrado §A2.3 — por defecto nominalización, sin mezclar formas).
4. **Identificar beneficiario/affectee**: en sistemas artificiales/sociales, quién
   recibe valor; en naturales, no forzar beneficiario. El beneficiario no siempre es
   el transformee.
5. **Declarar atributo de valor y estados**: el cambio tiene una dimensión auditable
   (estado inicial → estado buscado).
6. **Identificar transformees**: consumo / resultado / efecto.
7. **Añadir agentes e instrumentos** solo después de saber qué cambia (agente =
   persona o grupo de personas; software/sensor = instrumento).
8. **Declarar sistema y frontera**: decide qué es sistémico y qué ambiental; cambiar
   de lado es decisión explícita, no efecto del layout.
9. **Declarar esencia y afiliación**: física/informacional, sistémica/ambiental.
10. **Leer el primer OPL**: si dice algo raro, revisar el hecho, no solo la frase.
11. **Cerrar el SD**: proceso central transformador, frontera explícita, ≥1
    transformee funcional, agentes ≠ instrumentos, esencia/afiliación donde importa,
    sin barro bloqueante, legible en OPL, supuestos y brechas registrados.

Plantilla de cierre de SD (sistema, tipo, propósito, proceso central, beneficiario,
atributo de valor, estado inicial/buscado, transformees, agentes, instrumentos,
frontera, ambientales, supuestos, brechas, primer OPL confirmado).

### 5. Refinar sin romper el modelo

Refinar es hacer visible estructura ya implicada, no cambiar la función sin decirlo.
Cada refinamiento declara: qué se refina, qué pregunta responde, qué frontera
conserva, qué enlaces se distribuyen, qué hechos se expresan/suprimen y qué OPL
confirma la equivalencia.

- **In-zoom y frontera**: los subprocesos explican cómo se realiza el padre; la firma
  de frontera se preserva. Un nuevo input/output neto significa que el padre estaba
  incompleto o que es otra función.
- **Unfold y estructura**: usar el enlace estructural correcto (agregación,
  exhibición-caracterización, generalización-especialización,
  clasificación-instanciación). No usar agregación como cajón universal.
- **Estados expresados y suprimidos**: la supresión es decisión de vista (per-OPD),
  no eliminación del modelo; no suprimir un estado que participa en un enlace visible.
- **Realizaciones hermanas**: alternativas internas comparables si preservan la firma
  de frontera.
- **Adoptar un OPD suelto** (arranque bottom-up, §2/A1.5): declarar un fragmento del
  Taller como in-zoom/unfold de una cosa existente es un acto de refinamiento legítimo —
  fija padre + refinamiento en un gesto, el **mismo constructor** que el refinamiento
  top-down (convergen en el vínculo; el contenido del hijo difiere: el top-down
  auto-andamia, adoptar toma el suelto tal cual).
- **Cuándo no refinar**: SD con barro, refinamiento que repite el padre, detalle por
  curiosidad, vista padre que ya sirve, supuesto de dominio no confirmado, o cuando la
  capacidad de UI requerida no está estabilizada (documentar como brecha).

---

## Pista-AGENTE

### A. Operar opforja como agente

Esta pista describe cómo un agente conduce opforja sin un humano moviendo el mouse,
manteniendo la misma disciplina del tronco común. Aquí “agente” significa ejecutor
software de ingeniería agéntica; dentro de OPD/OPL sigue siendo objeto no humano,
normalmente instrumento. La persona o grupo que autoriza o responde es el agente
OPM. La autoridad de
método y postura dialéctica es la skill `urn:kora:artefacto:modelamiento-opm`
(anti-complaciente: bloquea avance ante barro, fuerza aclaración antes de plasmar).
Este manual no transcribe la skill; la cita por URN.

#### A.1 El loop de modelado del agente

1. **Triaje**: leer el intent y el contexto del operador — sea vía el **puente directo**
   `cd app && bun run mesa pull …` (§A.6), sea vía el markdown "Contexto de modelado" del **puente W6.0 por
   portapapeles**: procedencia, pendientes `[RATIFICAR]`, notas de la mesa, diagnóstico JSON y OPL.
2. **Elicitar / construir**: aplicar el flujo Forja (§2). Ante barro, detenerse y
   preguntar; no construir sobre supuesto.
3. **Serializar**: el camino primario es **proto OPL-ES estricto → compilador de
   autoría**. No fabricar JSON a mano salvo fallback declarado.
4. **Validar el loop**: round-trip, contención de refinamiento, canon y golden-harness
   (§A.4). Una entrega no está lista hasta que el loop cierra.
5. **Revisar visual**: pasada read-through con render headless (§A.3) cuando el OPD
   importa para la decisión.

Pull, diagnóstico, render y validación son **read-through**: no mutan el dominio.
Compilar produce un bundle y `push` crea una revisión; por eso requieren base
fresca, delta explícito y revisión humana.

#### A.2 El DSL de autoría ([código](../app/src/autoria/))

Librería headless dominio-agnóstica para construir un Modelo OPM programáticamente y
emitir un bundle validado. API pública (firmas en
[index.ts](../app/src/autoria/index.ts); el contrato exacto es el código, no esta
prosa):

- `crearAutor(opts)` → `Autor` (DSL imperativo re-entrante: `entidad`, `opd`,
  `estados`, `ver`, `enlazar`, `refDescomp`, …).
- `emitirBundle(autor, opts)` → `{ json, opl, reporte }` con layout canónico y
  política de canon (bloquean solo avisos estructurales).
- `compilarProto(...)` → compilador proto-modelo → Modelo (camino primario;
  determinista, verificador total).
- `construirSello / compararProcedencia` → sello de procedencia con
  `{ protoHash, autoriaVersion, layoutVersion }` y `doctrinaVersion` opcional cuando
  se fijan las cuatro SSOT; permite detectar divergencia.

El bundle es **citable**: lleva procedencia y permite rehidratar/auditar el modelo
fuera de una imagen. El JSON sigue el formato `deep-opm-pro.modelo.v0`
([serializador](../app/src/serializacion/json.ts)).

#### A.3 Render headless (H1)

Desde la raíz del repositorio, usa una de estas dos formas:

- `cd app && bun run render:headless --proto <ruta.md> --out <dir>`
- `cd app && bun run render:headless --modelo <ruta.json> --out <dir>`

Ambas producen PNG (ver) y SVG (diff) por OPD. El render es browser-bound (usa
document/canvas/getBBox vía Vite efímero + Chromium); el hook está gated por
`VITE_HEADLESS_RENDER` y eliminado por DCE en producción. Sirve como pasada visual
read-through del agente.

#### A.4 Reproducibilidad / golden-harness (H2)

Desde la raíz del repositorio, compara la emisión con un golden usando una de estas
formas:

- `cd app && bun run verify:reproducible --proto <ruta.md> --golden <bundle.json>`
- `cd app && bun run verify:reproducible --modelo <ruta.json> --golden <bundle.json>`

El comando compara byte a byte y devuelve `0` si son idénticos, `1` si divergen y
`2` ante uso o entrada inválidos. Reemplaza el `md5sum` artesanal. Antes de fijar
un golden nuevo, la revisión humana debe comprobar que el cambio semántico es
intencional; el harness detecta después cualquier deriva de bytes.

#### A.5 Citas, normas y anclas

El agente identifica citas/normas del proto y propone su estandarización en OPL-ES
estricto; el compilador **no** aprende léxico de dominio ni emite anclas sin
confirmación humana. Hay dos deudas distintas: una afirmación normativa se ratifica
contra su **fuente**; una hipótesis de modelado se resuelve con evidencia, decisión
humana, supuesto explícito o declaración fuera de alcance. No toda duda necesita
una fuente legal. Las anclas normativas `[RATIFICAR]` solo pasan a vigentes vía
re-elicitación de la skill (LogDecisiones v0 exporta con `modeloHash=protoHash` del
sello; bloqueado sin sello).

#### A.6 Puente directo mesa↔skill (CLI)

Además del puente W6.0 por portapapeles, un agente con acceso al host puede operar
opforja **directo contra un backend configurado y compatible**, sin transportar
bytes a mano. No existe
un ejecutable global `mesa`: desde la raíz del repo se usa
`cd app && bun run mesa …`. El script
[mesa-cli.ts](../app/scripts/mesa-cli.ts) lee el token Bearer desde
`~/.config/opforja/agent-token` o desde la ruta indicada por
`OPFORJA_AGENT_TOKEN_FILE`; `MODEL_AGENT_TOKEN` pertenece al servidor, no al CLI.
Ese token es un secreto: el archivo debe tener modo `600` y nunca debe entrar a
Git, prompts, notas de versión ni bundles.

En un backend compatible, ese Bearer está confinado por mínimo privilegio:
puede leer la mesa y crear commits por el endpoint atómico de revisiones; las
escrituras heredadas de modelo, workspace, versión, autosave y borrado responden
`403`. La cookie del operador conserva las acciones propias de la interfaz.

- `cd app && bun run mesa modelos` — lista los modelos del tenant (id · especie · revisión).
- `cd app && bun run mesa pull <modelo>` — compone el mismo contexto de modelado que W6.0 (procedencia,
  `[RATIFICAR]`, notas, diagnóstico, OPL) leyendo el estado vivo; observa tanto
  el guardado como la presencia o ausencia de autosave y emite un
  `Testigo-Base` opaco junto a la fuente elegida.
- `cd app && bun run mesa push <modelo> <bundle.json> --base <Testigo-Base> --nota "…"` —
  valida con el contrato de import y guarda una **nueva revisión** sobre la base
  exacta del `pull`; a un modelo con **sello** exige un bundle con procedencia
  estructural válida —el carril esperado es recompilar el proto—, y un push
  **sin delta** no crea revisión. Al crear un modelo nuevo se omite `--base` y
  se exige `--especie apunte|modelo`. Si la referencia no resuelve por ID o
  nombre, `push` entra al camino de creación: revisa errores tipográficos antes
  de confirmar.

**Garantía del backend compatible.** El `Testigo-Base` identifica el modelo y
las dos ramas observadas por `pull`: revisión y contenido guardados, y contenido
del autosave o su ausencia. El CLI comprueba ese testigo antes de enviar y el
servidor vuelve a comprobarlo dentro de la misma transacción que guarda la
revisión, crea su versión y consolida el autosave. Si cualquiera de esas ramas
cambió, responde `409` y no escribe nada. En una creación, modelo, versión y
especie —incluida la marca de apunte en el workspace— se registran en esa misma
transacción. Solo cuando la fuente elegida por aquel `pull` fue un autosave se
exige confirmación humana mediante `--confirmado-por-operador`. El testigo no es
un secreto ni concede permisos: debe conservarse sin modificar junto al bundle
que originó.

El workspace también porta una revisión monotónica. Cada reemplazo completo
declara la revisión observada y el servidor responde `409` si otra escritura o
una creación atómica avanzó primero. Dentro de una pestaña, las escrituras se
serializan; si el usuario actuó antes de terminar la carga inicial, la mesa
aplica solo ese delta local sobre el índice remoto observado. El bootstrap no
vuelve a guardar el índice que acaba de derivar. Esto evita que una respuesta
vieja borre carpetas o la especie recién creada por el agente. No convierte la
mesa en editor colaborativo: ante conflicto se conserva el estado local, se
informa el rechazo y corresponde recargar/reconciliar, nunca forzar.

Las operaciones del navegador quedan además ligadas a la identidad de sesión
que observaron. Si otra pestaña cambia la cookie de tenant o cualquier operación
recibe `401`, la mesa invalida las respuestas pendientes, purga el contenido
sensible local y vuelve al acceso; no reutiliza datos de un tenant bajo otro.

**Límite de atestación.** El servidor comprueba la presencia y forma del sello,
no una firma criptográfica ni el `protoHash` contra un registro externo; y la
bandera de confirmación es una declaración del caller, no una prueba del gesto
humano. Son defensas contra accidentes. La disciplina operativa sigue siendo:
no copiar ni fabricar procedencia y no suministrar
`--confirmado-por-operador` sin una decisión real del operador.

Esta garantía está implementada en el código fuente actual, pero requiere
desplegar un backend que exponga el commit atómico de revisiones. Ante
`404/405/501`, el CLI aborta sin recurrir al endpoint antiguo y sin escribir.
Hasta comprobar un despliegue compatible en la instancia productiva, se usa el
puente W6.0 manual.

Si la red se corta después de enviar el commit, el resultado puede ser
desconocido aunque la transacción sea atómica. El CLI lo declara: ejecuta
`pull` para comprobar el estado y no reintentes a ciegas.

Reglas del puente (skill vigente, Regla Dura #29): conservar el `Testigo-Base`
del pull que originó el bundle · revisar el delta con una persona · nunca push
sin validación local verde · ante `409`, re-pull y jamás forzar · confirmar
antes de suministrar `--confirmado-por-operador` · nota con procedencia
(`agente·<nota>`) · crear nuevo declara `--especie` (los bosquejos nacen
apunte). En la mesa, el chip **«Revisión del agente»** avisa
cuando el agente empujó. Sin cambios locales ofrece **Recargar**; con cambios,
**Ver la del agente** conserva el trabajo local para comparar y **Descartar los
míos y traer la del agente** declara la acción destructiva. El puente W6.0 por
portapapeles queda como **fallback** cuando no hay acceso al host.

---

## Reconvergencia

### 6. Reglas prácticas de OPD

El OPD comunica con geometría. Los glifos, marcadores y tokens visuales exactos viven
en `urn:fxsl:kb:spec-forja-opd-es`; este manual conserva solo la lectura práctica:
rectángulo = objeto; elipse = proceso; rountangle interno = estado; sombra = esencia
física; contorno discontinuo = afiliación ambiental; enlace transformador = consume /
produce / cambia; piruleta = habilitación (agente o instrumento); triángulo = relación
estructural; rayo = invocación; badge `e`/`c` = evento/condición sobre enlace
permitido.

Regla de lectura: si un elemento visual no puedes traducirlo a una oración OPL clara,
no es hecho terminado. No todo lo visible es modelo — handles, selección, grillas,
halos runtime y mensajes de error son UI transitoria.

### 7. Reglas prácticas de OPL

OPL-ES es lenguaje natural controlado: legible por humanos y suficientemente formal
para roundtrip. Las plantillas y la gramática exactas son propiedad de
`urn:fxsl:kb:spec-forja-opl-es` (no se transcriben aquí). Principios prácticos: una
oración atómica = un hecho; nombres canónicos singulares y específicos; consumo,
resultado y efecto no son sinónimos; agente e instrumento usan predicados distintos.
El parser no es corrector literario: ante frase ambigua, rechaza, suspende o pide
aclaración; no inventa el hecho. Una oración no parseable puede vivir como nota
humana separada del canon, nunca importarse como hecho.

El vocabulario canónico es más amplio que la cobertura de edición inversa de la
aplicación. La bimodalidad garantiza sincronía solo para las plantillas que el
parser declara soportadas; algunas formas canónicas siguen siendo de emisión o
lectura. Verifica el preview y el roundtrip antes de presentar OPL como editable.

### 8. Validación y diagnóstico

Validar combina reglas, método y lectura humana. Un diagnóstico honesto dice qué se
rompe y en qué plano: **validez** (regla estricta), **modalidad OPD** (realización
visual), **modalidad OPL** (oración/parseo/roundtrip), **método** (conforme pero mal
construido o insuficiente), **herramienta** (capacidad no implementada / UI
transitoria / GAP — ver §L), **dominio** (falta evidencia del operador).

Checklist de cierre: cada OPD con foco; cada hecho visible con OPL; cada OPL canónico
apunta a un hecho; sin estados flotantes; entidades con estados clasificadas como
flujo / caracterización / ambiental-observado; sin nombres duplicados ambiguos; sin
agentes no humanos; refinamientos preservan frontera; supuestos separados de hechos;
brechas de app no presentadas como canon; nivel validado declarado.

### 9. Patrones de modelado

Estructura de patrón: intención, cuándo usar, cuándo no usar, OPD mínimo, OPL
esperado, reglas propietarias, brechas, ejemplo. Patrones candidatos: sistemas
sociotécnicos, agente/rol/autoridad, decisión con supervisión humana, interfaz
crítica, control loop, estados ortogonales, composición por interfaz, configuración
y tradeoffs, digital twin. Cada patrón publicable cita sus reglas propietarias por
URN, no las copia.

**Piezas** son el vehículo gobernado para reusar entidades y estados desde modelos
biblioteca. Una Pieza externa se **Calca** —identidad fresca e independiente— o se
**Ancla** —referencia viva vigilada por el Centinela de Drift, R-OPD-ROT-9—. El
Anclaje vigila la firma gobernada de la entidad-pieza y sus estados; no importa
automáticamente cada cambio de contenido. **Re-sincronizar** acepta una nueva firma
como línea base. **Soltar** pierde la vigilancia y convierte el uso en Calco, pero
el gesto inmediato participa en deshacer (`Ctrl+Z`).

La acción de guardar una selección crea una **plantilla local de subgrafo**; no la
promueve por sí sola a Pieza global gobernada. No existe una promoción formal
global/admin en la superficie actual. La marca meta `<<Nombre>>` sigue siendo
opcional en OPL (R-VIS-STEREO-1/R-OPD-ROT-6), no cuenta como cosa ni altera la
validación nuclear. No hay Piezas de enlace. Autoridad:
`urn:fxsl:kb:spec-forja-opd-es`; el campo interno heredado sigue siendo
`Entidad.estereotipoId`.

---

## 10. Ejemplo end-to-end

Dominio deliberadamente simple y abstracto: confirmación y despacho de un pedido.
Sirve para enseñar opforja, no logística. No depende de conocimiento experto.

**Enunciado inicial**: "Quiero modelar el sistema de despacho de pedidos." Barro:
"sistema de despacho" nombra un área, pero no declara qué cambia ni la frontera.
Pregunta: ¿qué objeto entra distinto y sale distinto? Respuesta del ejemplo: un
**Pedido** pasa de `confirmado` a `despachado`; el cliente recibe valor por
disponibilidad de entrega.

**SD inicial** (resumen): sistema sociotécnico; proceso central *Despacho de pedido*;
beneficiario **Cliente** (ambiental); atributo de valor = estado de cumplimiento del
**Pedido**; estado inicial `confirmado`, buscado `despachado`; transformee = **Pedido**;
agente = **Operador de bodega**; instrumento = **Sistema de bodega**; supuesto = el
pago se confirma fuera del modelo.

**Primer OPL** (didáctico; la forma exacta la fija `urn:fxsl:kb:spec-forja-opl-es`):
cada oración debe ser un hecho rastreable — el sistema exhibe el proceso; el proceso
cambia el **Pedido** de `confirmado` a `despachado`; el proceso requiere el instrumento;
el agente maneja el proceso; el **Cliente** es ambiental.

**Primer refinamiento**: ¿cómo se realiza *Despacho de pedido* sin cambiar su frontera?
Subprocesos *Preparación de pedido* → *Entrega de paquete* → *Registro de despacho*. La
frontera se conserva si siguen consumiendo el **Pedido confirmado**, requiriendo los
mismos enablers netos y generando el **Pedido despachado**. Si aparece **Pago
autorizado** como nuevo input neto, se declara fuera de alcance o se corrige la frontera
del padre.

**Validación**: A8 no encuentra bloqueos estructurales; las mejoras metodológicas y
de estilo quedan declaradas. Aparte, el operador confirma que el pago queda fuera y
bodega ejecuta, y acepta que el modelo sirve para enseñar SD, OPL y primer in-zoom.

**Errores intencionales que el ejemplo descarta**: modelar el **Sistema de bodega**
como agente (es instrumento); crear un proceso sin transformee; agregar **Pago
autorizado** en el hijo rompiendo la firma; dibujar **Cliente** dentro del sistema por
cercanía visual (la afiliación no depende del layout).

---

## L. Límites de la mesa

### Brechas de conformidad OPM/Forja

Capacidades **declaradas pero NO implementadas** en la versión vigente, derivadas del
**[registro de conformidad de la herramienta](roadmap/registro-conformidad-ssot.md)**.
Esta sección no inventa su propia lista: refleja las filas que ese registro marca como
**PROGRAMADA**. Toda brecha se trata conforme a R-CONF-7 de
`urn:fxsl:kb:reglas-opm-estrictas-es` (deuda exigible o programación declarada; la
brecha silenciosa está prohibida).

| Capacidad | Estado en el registro | Nota |
| --- | --- | --- |
| **Out-zoom** (recomposición de una descomposición hacia el proceso abstracto) | PROGRAMADA | Sin superficie de autoría; ningún modelo productivo lo demanda aún. Oportunidad anotada: reutilizar `equivalencia/`. |
| **R-FAN-PROB-1 caso C** (abanico probabilístico declarado, pesos pendientes) | PROGRAMADA | El modelo no distingue el caso B (alternativas ordinarias) del caso C; no es divergencia silenciosa (el valor uniforme predeterminado solo se aplica al simular, nunca se persiste). Destino: corte de simulación con demanda nombrada. |

Para el estado canónico y la traza de cada fila, leer el registro. Las capacidades ya
**CERRADAS** (perfiles de export, unicidad de rol, herencia de afiliación, etc.) no
son límites: ver el registro.

### Frontera del producto

Las dos filas anteriores son brechas respecto del canon, no un catálogo completo de
producto. La matriz transversal `IMPLEMENTADO | PROPUESTO | EXTERNO` vive en el
[manual para transformar sistemas](manual-sistemas-opm.md#9-frontera-de-capacidad-de-opforja).
Los manuales de dominio agregan solo consecuencias propias. El estado exacto sigue
en el handoff y el registro de conformidad.

---

## Apéndices

### Apéndice A — Glosario operativo

| Término | Definición |
| --- | --- |
| Barro | Ambigüedad que impide plasmar un hecho sin inventar dominio o violar canon. |
| Firma de frontera | Conjunto de roles netos de entrada, salida y habilitación que un proceso presenta al exterior. |
| Realización hermana | Alternativa interna comparable que realiza la misma función abstracta si preserva firma de frontera. |
| Aparición | Presencia visual local de una cosa en un OPD; no es nueva identidad. |
| Bundle | Paquete serializado (`deep-opm-pro.modelo.v0`) que permite rehidratar/auditar más allá de una imagen. |
| Roundtrip | Ir de OPD a OPL y volver al mismo hecho sin pérdida relevante. |
| Sello de procedencia | `{ protoHash, autoriaVersion, layoutVersion }` que vincula el bundle con su proto; en el flujo legítimo lo emite el compilador, pero el servidor solo comprueba su forma. |
| Gate | Chequeo, regla o revisión que decide si se puede avanzar. |
| GAP / brecha | Carencia explícita de canon, implementación o evidencia; nunca se oculta como comportamiento normal (R-CONF-7). |

### Apéndice B — Mapa de "si el problema es… ir a…"

| Si el problema es… | Ir a (URN) |
| --- | --- |
| ¿Este hecho es válido? ¿Qué severidad tiene? | `urn:fxsl:kb:reglas-opm-estrictas-es` |
| ¿Cómo debería modelarlo? | `urn:fxsl:kb:metodologia-forja-opm-es` |
| ¿Cómo se dibuja? | `urn:fxsl:kb:spec-forja-opd-es` |
| ¿Cómo se dice/parsea en OPL? | `urn:fxsl:kb:spec-forja-opl-es` |
| ¿Qué ley explica equivalencia/composición? | `urn:fxsl:kb:opm-categorial-es` |
| ¿Cómo opera un agente la mesa? | `urn:kora:artefacto:modelamiento-opm` |
| ¿La app no lo soporta? | §L de este manual + [registro de conformidad](roadmap/registro-conformidad-ssot.md) (R-CONF-7) |
| ¿Cómo lo uso en la UI? | [Uso productivo](uso-productivo.md) |

### Apéndice C — Resolución de URN

Las cuatro SSOT de la familia Forja (`reglas-opm-estrictas-es`, `spec-forja-opd-es`,
`spec-forja-opl-es`, `metodologia-forja-opm-es`) se resuelven por URN vía
[resolutor repo-local](canon-opm/resolutor-urn.json) (lector puro de datos
[resolutorUrn.ts](../app/src/canon/resolutorUrn.ts)),
que re-ancla a la SSOT viva en pneuma bajo `KORA_RAIZ` (ruta predeterminada
`/home/felix/kora-pneuma`).
Los [puentes locales](canon-opm/) no copian el canon: solo resuelven URN → path.

`urn:fxsl:kb:opm-categorial-es` (lectura formal) y `urn:kora:artefacto:modelamiento-opm`
(la skill) se citan por URN y residen también en pneuma, pero fuera del mapa de los cuatro
puentes: se resuelven por su ubicación canónica en KORA (`artefactos/conocimiento/fxsl/` y
`artefactos/skills/kora/`, respectivamente), no por `resolutor-urn.json`.

---

## Fuentes y siguiente paso

Este manual se revisa contra las versiones resueltas por
[canon-opm](canon-opm/resolutor-urn.json) y contra el código de la aplicación. Git
conserva su historia editorial.

Continúa con el [manual para transformar sistemas](manual-sistemas-opm.md), un
perfil de dominio o el [índice documental](README.md).
