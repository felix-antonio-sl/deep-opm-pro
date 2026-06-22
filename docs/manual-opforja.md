# Manual de opforja

Manual operativo **integrado** (humanos + agentes) para modelar con OPM/ISO 19450
en opforja/deep-opm-pro. Consolida en un solo documento las dos pistas de uso de
la herramienta sobre un tronco de método común.

- URN repo-local: `urn:fxsl:kb:manual-opforja-es` (working-artifact del repo;
  ver `docs/canon-opm/resolutor-urn.json` → `puente_inverso`).
- Instancia en producción: `https://opforja.sanixai.com`.
- Estado operativo vigente (bloqueantes, pendientes, riesgos): `docs/HANDOFF.md`.

## Contrato del manual

Este manual **enseña a usar la herramienta y el método**. No es la SSOT del
método ni copia su contenido. Cuando una decisión es normativa, se cita su
artefacto propietario **por URN** y se resuelve su ruta vía
`docs/canon-opm/resolutor-urn.json` (lector: `app/src/canon/resolutorUrn.ts`).
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
shape JSON del modelo lo define el código (`app/src/serializacion/json.ts` +
`app/src/modelo/tipos/`), no la prosa de este manual.

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
en OPL. Tampoco descubre la verdad del dominio: el operador aporta qué hace el
sistema en el mundo; opforja y sus agentes custodian que esa verdad se exprese con
primitivas OPM correctas.

**Audiencia**: modeladores que construyen un sistema desde cero; agentes que
guían, validan o serializan; mantenedores de deep-opm-pro; revisores que necesitan
distinguir error de modelo, error de herramienta y deuda documental.

**Precedencia de lectura**: para uso práctico, este manual. Para resolver una
controversia, el artefacto propietario por URN (validez → reglas; camino →
metodología; visual → spec-opd; textual → spec-opl; formal → categorial). No usar
este manual para arbitrar una disputa normativa.

**Resultado esperado de una sesión**: no "un diagrama bonito" sino un paquete
auditable — propósito y alcance declarados, System Diagram legible, OPL que el
operador confirma, supuestos y brechas explícitos, validación tripartita y el
siguiente refinamiento o el criterio de suficiencia. Si falta algo, es borrador,
no modelo cerrado.

---

## 1. Modelo mental mínimo

**Función antes que forma.** Todo modelo empieza por: qué transformación entrega
valor y para quién. Una función debe ser neutral respecto de la solución ("cruzar
el río" admite puente, ferry o túnel; "construir puente" ya escogió forma).

**Objeto, proceso, estado.** Un objeto existe; un proceso transforma; un estado es
una situación posible de un objeto. La pregunta fundacional es siempre: esto que
nombré, ¿existe o sucede? Palabras como "gestión", "módulo", "sistema",
"procesar" o "manejar" suelen esconder barro si no dicen qué cambia.

**Transformee, agente, instrumento.** El transformee es la cosa que el proceso
consume, produce, crea, destruye o cambia. El agente es persona u organización de
humanos responsable (R-AG-1; software/IA/sensor son siempre instrumentos —
R-AG-1A/R-AG-1B). El instrumento habilita pero no se transforma. Confundir
transformee con habilitador es error ontológico, no detalle visual.

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
§A2 (11 etapas; cada una cierra con un hecho explícito). Este manual no lo copia;
resume su forma:

- **A0 — antes de la semilla**: generar alternativas (al menos tres conceptos si la
  arquitectura no está decidida). Equivalencia funcional = misma firma de frontera.
- **A1 — clasificación del sistema**: artificial, natural, social o sociotécnico.
  La clase cambia cómo se pregunta por propósito, beneficiario, agencia humana y
  ocurrencia del problema.
- **A2 — construcción del SD**: 11 etapas (clasificación → proceso principal →
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
- **A8 — validación tripartita**: bien formado (cumple reglas), representa (el
  operador confirma que dice lo que ocurre), sirve (responde al propósito). No decir
  "validado" sin decir cuál de los tres niveles. Los barridos de integridad se hacen
  sobre el JSON canónico, no sobre el OPL emitido.

---

## Pista-HUMANO

### 3. Trabajar en la interfaz opforja

La interfaz es mesa de trabajo, no autoridad semántica. Si la UI permite una
operación que contradice el corpus, manda el corpus. Si la UI no implementa una
capacidad canonizada, se registra como brecha (§L y
`docs/roadmap/registro-conformidad-ssot.md`), nunca como atajo falso: toda brecha
de una regla `DEBE` se trata conforme a R-CONF-7 de
`urn:fxsl:kb:reglas-opm-estrictas-es` — deuda exigible o programación declarada; la
brecha silenciosa está prohibida.

La guía de usuario operativa de la app (entrar, guardar, buscar, command palette,
importar/exportar JSON, exportar PNG, atajos, límites de sesión) vive en
**`docs/uso-productivo.md`**. Este manual no la duplica. En resumen:

- **Canvas OPD**: compone hechos visuales; cada forma/enlace/marcador es portador de
  semántica OPM o UI transitoria claramente separada.
- **Panel OPL**: lee el modelo como lenguaje natural controlado; editar OPL es
  seguro solo dentro del vocabulario y plantillas que el parser reconoce.
- **Selección y navegación**: preservan identidad — seleccionar una cosa o su
  aparición en otro OPD no crea cosas nuevas (ver "Regla de apariciones" en
  `docs/uso-productivo.md`).
- **Exportación y persistencia**: el bundle JSON conserva hechos, identidad, OPDs,
  OPL y trazas para rehidratar/auditar. Una imagen sola comunica, pero no sustituye
  el bundle canónico.
- **Vitrina de estereotipos**: galería de estereotipos injertables (objetos, enlaces,
  patrones compuestos) más el guardado de una selección como estereotipo reusable. Un
  estereotipo es una marca de modelado **meta** (no emite OPL nuclear; se rotula
  `<<Nombre>>` en canvas) y/o una **plantilla de subgrafo OPM** que se clona-e-injerta
  como cosas+enlaces reales. La realización visual la gobierna
  `urn:fxsl:kb:spec-forja-opd-es` (R-VIS-STEREO-1, propuesta vigente en
  `docs/solicitudes-upstream/`); ver §9.

### 4. Construir un modelo desde cero

Walkthrough subordinado al orden normativo §A2 (al conducir una sesión A2 manda la
secuencia de 11 etapas). Es recorrido didáctico, no botones concretos.

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
   humano/organización responsable; software/sensor = instrumento).
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
- **Cuándo no refinar**: SD con barro, refinamiento que repite el padre, detalle por
  curiosidad, vista padre que ya sirve, supuesto de dominio no confirmado, o cuando la
  capacidad de UI requerida no está estabilizada (documentar como brecha).

---

## Pista-AGENTE

### A. Operar opforja como agente

**Estado:** vivo. Esta pista describe cómo un agente conduce opforja sin un humano
moviendo el mouse, manteniendo la misma disciplina del tronco común. La autoridad de
método y postura dialéctica es la skill `urn:kora:artefacto:modelamiento-opm`
(anti-complaciente: bloquea avance ante barro, fuerza aclaración antes de plasmar).
Este manual no transcribe la skill; la cita por URN.

#### A.1 El loop de modelado del agente

1. **Triaje**: leer el intent y el contexto del operador (en su caso, el markdown
   "Contexto de modelado" del puente W6.0: procedencia, pendientes `[RATIFICAR]`,
   notas de la mesa, diagnóstico JSON y OPL).
2. **Elicitar / construir**: aplicar el flujo Forja (§2). Ante barro, detenerse y
   preguntar; no construir sobre supuesto.
3. **Serializar**: el camino primario es **proto OPL-ES estricto → compilador de
   autoría**. No fabricar JSON a mano salvo fallback declarado.
4. **Validar el loop**: round-trip, contención de refinamiento, canon y golden-harness
   (§A.4). Una entrega no está lista hasta que el loop cierra.
5. **Revisar visual**: pasada read-through con render headless (§A.3) cuando el OPD
   importa para la decisión.

Las herramientas del agente son **read-through**: no mutan el proto ni el dominio.

#### A.2 El DSL de autoría (`app/src/autoria/`)

Librería headless dominio-agnóstica para construir un Modelo OPM programáticamente y
emitir un bundle validado. API pública (firmas en `app/src/autoria/index.ts`; el
contrato exacto es el código, no esta prosa):

- `crearAutor(opts)` → `Autor` (DSL imperativo re-entrante: `entidad`, `opd`,
  `estados`, `ver`, `enlazar`, `refDescomp`, …).
- `emitirBundle(autor, opts)` → `{ json, opl, reporte }` con layout canónico y
  política de canon (bloquean solo avisos estructurales).
- `compilarProto(...)` → compilador proto-modelo → Modelo (camino primario;
  determinista, verificador total).
- `construirSello / compararProcedencia` → sello de procedencia de 3 componentes
  `{ protoHash, autoriaVersion, layoutVersion }` y detección de divergencia.

El bundle es **citable**: lleva procedencia y permite rehidratar/auditar el modelo
fuera de una imagen. El JSON sigue el formato `deep-opm-pro.modelo.v0`
(`app/src/serializacion/json.ts`).

#### A.3 Render headless (H1)

`cd app && bun run render:headless --proto <md>|--modelo <json> --out <dir>` produce
PNG (ver) y SVG (diff) por OPD. Es browser-bound (usa document/canvas/getBBox vía
Vite efímero + Chromium); el hook está gated por `VITE_HEADLESS_RENDER` y eliminado
por DCE en producción. Sirve como pasada visual read-through del agente.

#### A.4 Reproducibilidad / golden-harness (H2)

`cd app && bun run verify:reproducible` verifica que la emisión sea reproducible
(exit 0/1/2). Reemplaza el `md5sum` artesanal. Un re-pin byte-estable se logra
crear-y-borrar (nextSeq/IDs intactos) y se verifica por contenido semántico, no por
git-diff (los puertos inflan el texto).

#### A.5 Citas, normas y anclas

El agente identifica citas/normas del proto y propone su estandarización en OPL-ES
estricto; el compilador **no** aprende léxico de dominio ni emite anclas sin
confirmación humana. Las anclas `[RATIFICAR]` solo pasan a vigentes vía
re-elicitación de la skill (LogDecisiones v0 exporta con `modeloHash=protoHash` del
sello; bloqueado sin sello).

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

**Estereotipos y vitrinas** son el vehículo para empaquetar y reusar estos patrones.
Un estereotipo es: (a) una **marca meta** sobre una cosa (p.ej. `requirement` de
fábrica) que se rotula `<<Nombre>>` en canvas (DEBE) y es opcional en OPL (PUEDE,
R-VIS-STEREO-1); y/o (b) una **plantilla de subgrafo OPM** (cosas+estados+enlaces con
un ancla) que se **clona-e-injerta** creando identidad fresca e independiente. La
vitrina los ofrece agrupados (objetos / enlaces / patrones compuestos); guardar una
selección como estereotipo es el gesto de curaduría del conocedor de dominio. NO hay
estereotipos de enlace (sería una sexta familia encubierta). El estereotipo es
contenido meta del autor (mismo estatuto que las anclas normativas): no cuenta como
cosa ni altera la validación nuclear. Autoridad: `urn:fxsl:kb:spec-forja-opd-es`.

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

**Validación tripartita**: bien formado (sin agentes no humanos, sin estados flotantes,
sin enlace ambiguo); representa (el operador confirma que el pago queda fuera y bodega
ejecuta); sirve (enseña SD, OPL y primer in-zoom).

**Errores intencionales que el ejemplo descarta**: modelar el **Sistema de bodega**
como agente (es instrumento); crear un proceso sin transformee; agregar **Pago
autorizado** en el hijo rompiendo la firma; dibujar **Cliente** dentro del sistema por
cercanía visual (la afiliación no depende del layout).

---

## L. Límites de la mesa

Capacidades **declaradas pero NO implementadas** en la versión vigente, derivadas del
**registro de conformidad de la herramienta** (`docs/roadmap/registro-conformidad-ssot.md`).
Esta sección no inventa su propia lista: refleja las filas que ese registro marca como
**PROGRAMADA**. Toda brecha se trata conforme a R-CONF-7 de
`urn:fxsl:kb:reglas-opm-estrictas-es` (deuda exigible o programación declarada; la
brecha silenciosa está prohibida).

| Capacidad | Estado en el registro | Nota |
| --- | --- | --- |
| **Out-zoom** (recomposición de una descomposición hacia el proceso abstracto) | PROGRAMADA | Sin superficie de autoría; ningún modelo productivo lo demanda aún. Oportunidad anotada: reutilizar `equivalencia/`. |
| **R-FAN-PROB-1 caso C** (abanico probabilístico declarado, pesos pendientes) | PROGRAMADA | El modelo no distingue el caso B (alternativas ordinarias) del caso C; no es divergencia silenciosa (el default uniforme solo se aplica al simular, nunca se persiste). Destino: corte de simulación con demanda nombrada. |

Para el estado canónico y la traza de cada fila, leer el registro. Las capacidades ya
**CERRADAS** (perfiles de export, unicidad de rol, herencia de afiliación, etc.) no
son límites: ver el registro.

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
| Sello de procedencia | `{ protoHash, autoriaVersion, layoutVersion }` que ata el bundle a su proto; lo emite solo el compilador de autoría. |
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
| ¿La app no lo soporta? | §L de este manual + `docs/roadmap/registro-conformidad-ssot.md` (R-CONF-7) |
| ¿Cómo lo uso en la UI? | `docs/uso-productivo.md` |

### Apéndice C — Resolución de URN

Las cuatro SSOT de la familia Forja (`reglas-opm-estrictas-es`, `spec-forja-opd-es`,
`spec-forja-opl-es`, `metodologia-forja-opm-es`) se resuelven por URN vía
`docs/canon-opm/resolutor-urn.json` (lector puro de datos `app/src/canon/resolutorUrn.ts`),
que re-ancla a la SSOT viva en pneuma bajo `KORA_RAIZ` (default `/home/felix/kora-pneuma`).
Los puentes locales de `docs/canon-opm/` no copian el canon: solo resuelven URN → path.

`urn:fxsl:kb:opm-categorial-es` (lectura formal) y `urn:kora:artefacto:modelamiento-opm`
(la skill) se citan por URN y residen también en pneuma, pero FUERA del mapa de los cuatro
puentes: se resuelven por su ubicación canónica en KORA (`artefactos/conocimiento/fxsl/` y
`artefactos/skills/kora/`, respectivamente), no por `resolutor-urn.json`.

---

## Bitácora

| Fecha | Cambio |
| --- | --- |
| 2026-06-22 | Manual integrado al repo (corte D4 / decisión D-MANUAL): consolidación de los dos shards de la bestia en un solo documento delgado y derivado, con doble pista (humano §3-§5 + agente §A) sobre tronco común, citas por URN sin transcripción, §L derivada del registro de conformidad y testigo de cierre `manual:limites`. |
| 2026-06-22 | Corte D6 (estereotipos + vitrinas): §3 suma la vitrina de estereotipos; §9 suma estereotipos/plantillas como vehículo de patrones reusables (marca meta `<<Nombre>>` + plantilla de subgrafo clonada-e-injertada; sin estereotipos de enlace). Cita R-VIS-STEREO-1 por URN; propuesta a custodio-kora en `docs/solicitudes-upstream/2026-06-22-estereotipos-vitrinas-ssot-skill.md`. |
