# Dossier normativo: spec-forja-opd-es v1.4.0

Fuente: `canon/spec-forja-opd-es/content.md` (882 líneas; leídas completas en tres
tramos: 1-300, 301-600, 601-882). Idioma del dossier: es-CL.

Documento del canon: realización visual del OPD (render, canvas, interacción,
edición visual, validación visual, simulación visual, export canónico, bimodalidad
desde el lado OPD).

## 0. Cómo leer este dossier

- **Obligación**: tal como la expresa el canon (DEBE / NO DEBE / DEBERÍA /
  NO DEBERÍA / PUEDE). Si la regla es enunciativa ("existen exactamente", "es",
  "se dibuja") se marca `inferido` junto a la fuerza deducida.
- **Herramienta**: consecuencia para el producto modelador:
  `IMPEDIR` (bloquear antes de persistir), `ADVERTIR` (diagnóstico no bloqueante),
  `GENERAR-OPL`, `PARSEAR-OPL`, `RENDER`, `OPERACIÓN` (soportar una operación o
  gesto), `MODELO-DATOS` (campo o invariante del modelo), `EXPORT`,
  `SOLO-MÉTODO` (juicio humano), `NO-APLICA` (gobierno documental o
  circunstancial).
- **Norma de lectura del catálogo (§18, textual)**: «la **estructura** de cada
  marca (forma, topología, conteo de trazos, dirección) es normativa; los valores
  cromáticos son tokens informativos (R-OPD-COSA-5) y los píxeles son la
  realización vigente (cambiables si preservan la distinción a cualquier zoom)».
  Consecuencia: los párrafos «Realización opforja» (hex, px, `standard.Rectangle`,
  `distance:0.8`, archivos `.ts`) describen la app v0 y **no obligan** a un
  rediseño salvo donde una regla los eleve (p. ej. swallowtail en R-OPD-TR-1).
- **Niveles de canonicidad (textual)**: `canon-iso`, `canon-visual`,
  `prescriptivo`, `metodo`, `libro`, `observacional`, `implementacion`. «Los
  niveles `libro`/`observacional`/`implementacion` informan pero no canonizan:
  cuando el canon calla, la entrada DEBE marcarse `no-canonizado` o `extensión
  declarada`; NO DEBE inventar canon.»
- **Extensión declarada** = opción conforme, no obligación, salvo que la propia
  regla diga DEBE dentro de su alcance.

## 1. Marco documental (Definición, Definiciones, Precedencia, Convenciones)

### 1.1 Alcance y frontera

- Spec «SSOT visual y operativa» del OPD. Frontera: legisla «geometría, canvas,
  interacción visual y export OPD». Validez nuclear y severidad → `reglas-opm-estrictas-es`;
  superficie textual → `spec-forja-opl-es`; método → metodología.
- Autocontención (l.26): «un agente conforme NO DEBE necesitar abrir `opm-visual-es`
  … ni `reglas-opm-estrictas-es` para implementar una entrada». Herramienta:
  NO-APLICA (propiedad del documento). Ver contradicción C-01.
- Frontera modal: lo que `spec-forja-opl-es` legisla (plegado display §12, panel
  §13, interacción §14, bisimetría §19) NO se re-legisla aquí.
- Precedencia: reglas-opm-estrictas-es > (opd-es, opm-es, esta spec) > spec-forja-opl-es
  (solo contraparte textual) > metodología > libro/OPCloud/implementación.
  Esta spec «DEBE mandar» sobre la implementación visual y sobre `ui-forja/GOVERNANCE.md`
  en lo «visualmente significativo OPM». Herramienta: NO-APLICA (gobierno).

### 1.2 Glosario normativo (copia textual de términos operativos)

| Término | Definición |
| --- | --- |
| Cosa | Objeto (rectángulo) o proceso (elipse); las dos únicas clases dibujables de primera categoría. |
| Rountangle | Rectángulo de esquinas redondeadas; glifo del estado, siempre interno a su objeto. |
| Marcador (marker) | Decoración de extremo o de tramo de un enlace que porta su tipo (punta, piruleta, triángulo, rayo, arco, letra). |
| Piruleta (lollipop) | Círculo terminal de enlace habilitador: relleno=agente, vacío=instrumento. |
| Swallowtail | Punta cerrada en cola de golondrina (`M 0 0 L 23 8 L 12 0 L 23 -8 Z`, bbox 23×16); realización opforja/OPCloud de la punta transformadora. |
| Constructo básico | 2 cosas + 1 enlace; unidad mínima de composición y de correspondencia OPD↔OPL. |
| Abanico (fan) | ≥2 enlaces del mismo tipo con un **extremo común** (compartido). El abanico es **convergente** si el extremo común es el destino (N→1) y **divergente** si es el origen (1→N); el arco lógico va siempre en el extremo común. |
| Esencia | **física** (tangible; marca = sombra) o **informacional** (sin sombra; default). |
| Afiliación | **sistémica** (trazo continuo; default) o **ambiental** (trazo discontinuo). |
| Perseverancia | Derivada del tipo: objeto = persistente, proceso = transitorio; sin glifo propio. |
| Pre(P) | Lado de entrada de un proceso P: consumo, efecto-entrada, agente, instrumento (con o sin estado); único lado que admite `e`/`c`. |
| Refinable / refinador | todo/exhibidor/general/clase/contenedor / parte/rasgo/especialización/instancia/subproceso. |
| Contenedor | Cosa refinada agrandada en el OPD hijo que contiene a sus refinadores (in-zoom). |
| Apariencia | Realización local de una cosa en un OPD concreto (posición, tamaño, supresiones); la existencia es única por modelo. |
| Instancia visual | Misma cosa con apariencia en otro OPD (misma identidad); distinta de la instancia lógica (clasificación). |
| Canon-diagrama | Perfil de export por OPD, vectorial, gramática visible + metadato mínimo. |
| Canon-documento | Perfil de export por modelo (multi-OPD), puede añadir OPL, diccionarios, árbol, portada. |
| UI transitoria | Elemento visible en canvas editable que desaparece de ambos perfiles canónicos; afordance, no gramática. |
| Canal reservado | Recurso visual (color, dash, glifo, posición, z) asignado a una familia de significado con separación inequívoca. |
| Display-vs-canónico | Forma visible local (vista, plegado, supresión) vs hecho canónico del modelo. |

Consecuencia MODELO-DATOS directa: separar **Cosa** (existencia única por modelo)
de **Apariencia** (por OPD: posición, tamaño, supresiones).

### 1.3 Convenciones

- Tipografía de ejemplos: **objeto** negrita, *proceso* cursiva, `estado` backticks.
  Herramienta: NO-APLICA (convención editorial; ojo: la tipografía de render es otra, §2.2).
- IDs `R-OPD-<ÁREA>-<n>`; áreas CAN, COSA, EST, TR, HAB, CTL, STR, INV, MUL, REF,
  LAY, ROT, UI, INT, EDIT, CFG, VAL, CAT, BIM, SIM, EXP. Reusa por cita
  `V-0..V-263`, `R-*`/`AP-1..AP-30`, `T1..TS5/H1..HS2/E*/C*/RF1..RF4/SE1..SE5/SSE1..SSE7/CX1..CX8/IV1..IV2/EX1..EX2/D1..D13`.
  NO-APLICA. (Nota: el área CAT no tiene reglas numeradas; §18 no acuña R-OPD-CAT-n.)
- Lenguaje RFC 2119 en es-CL: enum cerrado DEBE, NO DEBE, DEBERÍA, NO DEBERÍA, PUEDE.
- Patrón `Correcto:` / `Incorrecto:` / `Rationale:`; prohibido `Traces to:`. NO-APLICA.

## 2. §1 Regla rectora: canonicidad por persistencia en export

Principio: «La gramática visual conforme de OPFORJA se define por **lo que persiste
en un export canónico declarado**. Lo que aparece solo en el canvas editable es UI
transitoria, no gramática OPM.»

- **R-OPD-CAN-1** — La herramienta declara al menos dos perfiles de export:
  `canon-diagrama` (por OPD, vectorial, gramática visible + metadato mínimo) y
  `canon-documento` (por modelo, multi-OPD; PUEDE incluir OPL, diccionarios, árbol
  de OPDs, portada, vistas derivadas). · DEBE · EXPORT.
- **R-OPD-CAN-2** — Lo que persiste en `canon-diagrama` es gramática visible y
  DEBE estar cubierto por una entrada de la spec; un elemento presente en un solo
  perfil DEBE declararse como atributo de perfil. · DEBE · EXPORT (y control de
  diseño: no emitir en SVG nada fuera del vocabulario).
- **R-OPD-CAN-3** — Lo que desaparece de ambos perfiles es UI transitoria y NO DEBE
  reutilizar sin distinción los canales reservados: formas, contornos, sombra
  semántica, dash de afiliación, contorno grueso de refinamiento, piruletas,
  triángulos, arcos, marcas de estado, marcas de simulación, marcas de validación.
  · NO DEBE · RENDER.
- **R-OPD-CAN-4** — Una captura en modo edición, navegación, modal o simulación
  pausada NO es evidencia de canonicidad. · inferido (declarativo) · NO-APLICA
  (criterio de auditoría).
- **R-OPD-CAN-5** — El canvas DEBE distinguir al menos cinco modos visuales:
  estático-exportable, edición, navegación, gestión-modal, runtime; solo el
  estático-exportable fundamenta conformidad. · DEBE · RENDER / EXPORT.
- «Estado opforja» (perfiles `canon-diagrama`/`canon-documento`/`intercambio`,
  `gateDensidadCanonica`, commit `3a2db18c`): circunstancial, NO-APLICA.

## 3. §2 Cosas: las ocho representaciones

### 3.1 Producto cartesiano canónico (tabla textual)

| Canal | Valores | Marca visual |
| --- | --- | --- |
| Forma | objeto / proceso | rectángulo / elipse |
| Profundidad (esencia) | física / informacional | sombra gris abajo-derecha / plano |
| Contorno (afiliación) | sistémica / ambiental | trazo continuo / trazo discontinuo |

«Toda cosa OPM se renderiza como exactamente UNA de 8 combinaciones de tres canales
ortogonales e independientes.» · DEBE (inferido) · RENDER + MODELO-DATOS (tres
campos: tipo, esencia, afiliación).

- **R-OPD-COSA-1** — Exactamente dos clases dibujables: objeto = rectángulo,
  proceso = elipse. No existen «entidades», «nodos», «actores», «componentes».
  La perseverancia NO tiene glifo. · inferido DEBE / NO DEBE · MODELO-DATOS + RENDER.
- **R-OPD-COSA-2** — Defaults de creación: esencia informacional (sin sombra) +
  afiliación sistémica (continuo). Un preset de sesión PUEDE alterar el default solo
  si la esencia queda serializada y recuperable. · inferido DEBE (default) / PUEDE
  (preset) · MODELO-DATOS.
- **R-OPD-COSA-3** — Sombra ⟺ esencia física; toda sombra decorativa uniforme de UI
  DEBE suprimirse en export canónico; los reforzadores de canvas para fisicidad
  DEBEN diferenciarse de la sombra semántica y no persistir. · DEBE · RENDER + EXPORT.
- **R-OPD-COSA-4** — El contorno (continuo/discontinuo) DEBE persistir en todos los
  niveles de refinamiento. · DEBE · MODELO-DATOS (afiliación es propiedad de la cosa,
  no de la apariencia) + RENDER.
- **R-OPD-COSA-5** — Color informativo, no normativo: la semántica DEBE fijarse por
  forma, contorno, sombra y topología de marcadores, nunca por color. Cualquier paleta
  legible es conforme si preserva las distinciones. · DEBE · RENDER.
- Correcto/Incorrecto textual: «objeto físico ambiental = rectángulo, trazo
  discontinuo, sombra abajo-derecha» / «marcar la fisicidad con un relleno rojo en vez
  de sombra».

### 3.2 Realización opforja (tabla textual; informativa, nivel `implementacion`)

| Atributo | Valor vigente |
| --- | --- |
| Objeto | `standard.Rectangle`, esquinas rectas (`rx:0`), stroke `#27613f` (token `opmObjeto`), strokeWidth 1.5, fill transparente |
| Proceso | `standard.Ellipse`, stroke `#1d3f78` (token `opmProceso`), strokeWidth 1.5, fill transparente |
| Dimensión base | 135×60 px (`cosaWidth`/`cosaHeight`, herencia OPCloud) |
| Ambiental | `strokeDasharray "8 4"` |
| Física | filtro `dropShadow {dx:6, dy:6, blur:2, color: rgba(23,21,17,0.68)}` |
| Refinada | strokeWidth 4 (contorno grueso) |
| Tipografía | `Inria Serif` 17 px, peso 400; proceso en cursiva, objeto normal; color por contraste WCAG (ink `#171511` / blanco) |
| Identificador `o.NN`/`p.NN` | sub-label mono 9.5 px bajo la cosa; afordance UI (V-202), NO persiste en canon |

- **R-OPD-COSA-6** — Rótulo íntegro: autosize EXPANDE la forma; NO se admite
  truncamiento con elipsis ni corte silencioso en canon; rótulo inscrito en el bbox
  visible. · DEBE / NO (se admite) · RENDER.
- **R-OPD-COSA-7** — Dentro de la elipse NO DEBEN dibujarse estados; «iniciado/en
  proceso/terminado» se modelan como subprocesos. · NO DEBE · IMPEDIR (AP-12).
- **R-OPD-COSA-8** — Cosas de igual clase en un OPD DEBEN compartir base cromática y
  tipográfica, salvo variante autoral declarada (R-OPD-ROT-8). · DEBE · RENDER.
- **R-OPD-COSA-9** (extensión declarada, opcional) — Stick figure PUEDE acompañar al
  objeto humano; no sustituye piruleta de agente. No implementada. · PUEDE · RENDER
  (opcional; candidato a omitir).
- Edge cases: cosa mixta física+informacional se clasifica física; la afiliación es
  relativa al modelo. · SOLO-MÉTODO.
- Bimodal: el cambio de cualquiera de los tres canales emite/retira la oración de
  esencia/afiliación (`spec-forja-opl-es §2.7/§2.8`). · DEBE (inferido) · GENERAR-OPL.

## 4. §3 Estados y designaciones

### 4.1 Glifo y contención

- **R-OPD-EST-1** — Estado = rountangle SIEMPRE contenido en el rectángulo del objeto,
  región inferior. No hay estados flotantes ni de proceso; toda apariencia flotante
  DEBE bloquearse. · DEBE · RENDER + IMPEDIR.
- **R-OPD-EST-2** — El estado es atómico: NO contiene cosas ni otros estados.
  · inferido NO DEBE · IMPEDIR / MODELO-DATOS.
- **R-OPD-EST-3** — Objeto sin estados (s=0) solo puede ser creado o consumido; el
  editor DEBE restringir el enlace de efecto a objetos con ≥1 estado. · DEBE · IMPEDIR.
- **R-OPD-EST-4** — Los valores de un atributo son estados del objeto-atributo y se
  renderizan igual (rountangles): discretos (`sólido`), rangos (`120..240`), valor de
  instancia (`185`). · inferido DEBE · MODELO-DATOS + RENDER.
- Realización opforja (informativa): cápsula `rx:8`, fill `#dedacb` (`estadoFill`),
  stroke `#68711f` (`opmEstado`) 1.2 px, alto 24, minWidth 52, gap 4, región inferior
  34 px; layout horizontal (default) o vertical por `layoutEstados`; etiqueta serif
  itálica 13 px. Radio fijo 8 (deroga «pill» de ui-forja).

### 4.2 Designaciones persistentes (tabla textual)

| Designación | Marca canónica | Cardinalidad | Realización opforja | Estado |
| --- | --- | --- | --- | --- |
| Inicial | borde grueso simple | 0..* | strokeWidth 3 en la cápsula | alineado |
| Final | doble borde concéntrico | 0..* | fill `#d6d2c6` + rect interno padding 3, stroke 1 | alineado |
| Por defecto | flecha diagonal abierta apuntando al estado | 0..1 | glifo `↗` serif 12 px esquina sup. derecha | GAP-OPD-DEFAULT-GLIFO |
| `Current` declarado | glifo externo reservado (pin) | 0..1 | glifo `●` serif 10 px esquina sup. izquierda | GAP-OPD-CURRENT-GLIFO |
| Normal | borde estándar | — | cápsula base | alineado |

Consecuencia MODELO-DATOS: por estado, `inicial: bool`, `final: bool`; por objeto,
a lo sumo un `porDefecto` y a lo sumo un `current` declarado (IMPEDIR el segundo).

- **R-OPD-EST-5** — Un estado PUEDE ser inicial y final a la vez (borde grueso + doble
  borde); duplicar estados para separar inicio/fin es anti-patrón (AP-14). · PUEDE ·
  MODELO-DATOS + ADVERTIR (AP-14: «runtime (diagnóstico)»).
- **R-OPD-EST-6** — `Current` declarado DEBE serializarse como propiedad persistente
  (save/load/export) y DEBE distinguirse de la marca de runtime (§20). · DEBE ·
  MODELO-DATOS + EXPORT.
- **R-OPD-EST-7** — Marca canónica del estado por defecto = flecha diagonal abierta
  entrante; `↗` es aproximación no conforme a corregir o declarar variante de perfil.
  · inferido DEBE · RENDER.

### 4.3 Supresión de estados

- **R-OPD-EST-8** — La supresión es política de vista por OPD: visibilidad efectiva =
  ¬suprimido-global ∧ ¬suprimido-local. Suprimir NO borra el hecho; el conjunto
  completo de estados es la unión a través de todos los OPDs. · inferido DEBE ·
  MODELO-DATOS (dos niveles) + RENDER + GENERAR-OPL.
- **R-OPD-EST-9** — Con estados ocultos, el objeto DEBE exhibir chip `⋯N`
  (rountangle pequeño con elipsis y conteo) en la esquina inferior derecha. «El chip
  pertenece a la gramática auxiliar si persiste en canon.» · DEBE · RENDER (ver G-07).
- **R-OPD-EST-10** — Supresión computada entre niveles: solo en descomposición (no
  despliegue); con varios hijos, suprimido en padre = unión de los suprimidos por cada
  hijo; estados no referenciados por enlaces al refinado NO se suprimen. · inferido
  DEBE · OPERACIÓN.
- Bimodal: el OPL de un OPD enumera solo los estados visibles
  (`spec-forja-opl-es §2.3/§7.4`); el chip refleja `…, y otros estados` (D6).
  · GENERAR-OPL.

## 5. §4 Enlaces transformadores

### 5.1 Familias (textual)

«Seis familias canónicas de enlace, cerradas: transformadora, habilitadora,
invocación, **excepción procedimental** (familia autónoma proceso→proceso, marca
`/`/`//`…), estructural fundamental, estructural etiquetada. Todo enlace pertenece a
exactamente una; categorías adicionales DEBEN declararse como extensión.»
· DEBE · MODELO-DATOS (enum cerrado de 6 familias).

| Tipo | ID | Dirección | Marcador | Significado |
| --- | --- | --- | --- | --- |
| Consumo | T1/TS1 | objeto → proceso | punta cerrada (swallowtail) EN el proceso | el proceso destruye el objeto |
| Resultado | T2/TS2 | proceso → objeto | punta cerrada EN el objeto | el proceso crea el objeto |
| Efecto | T3/TS3 | objeto ↔ proceso | punta cerrada en AMBOS extremos | el proceso cambia el estado del objeto |
| Efecto parcial | TS4 / TS5 | estado → proceso / proceso → estado | UNA punta cerrada (hacia el proceso / hacia el estado destino) | fragmento de entrada / de salida del efecto |

- **R-OPD-TR-1** — Punta transformadora canónica = swallowtail cerrado
  `M 0 0 L 23 8 L 12 0 L 23 -8 Z` (bbox 23×16), fill paper, stroke ink 1. Entre
  transformadores el marcador es el mismo; el tipo lo porta la dirección y el anclaje,
  no el color. La invocación reusa la punta solo como terminal; su tipo lo porta el
  rayo. · inferido DEBE (punta cerrada; swallowtail = «variante conforme») · RENDER.
- **R-OPD-TR-2** — Invertir el extremo cambia el hecho (consumo↔resultado); la
  dirección es semántica. · inferido DEBE · MODELO-DATOS + GENERAR-OPL.
- **R-OPD-TR-3** — Resultado hacia objeto con estado inicial DEBE conectar al
  rectángulo o a un estado distinto del inicial; NUNCA al estado inicial. · DEBE /
  NUNCA · IMPEDIR (AP-04).
- **R-OPD-TR-4** — TS4 sin estado de salida → destino = estado por defecto; si no hay
  defecto, distribución de probabilidad de estados. · inferido · OPERACIÓN
  (semántica de simulación) / GENERAR-OPL.
- **R-OPD-TR-5** — Resultado+consumo sobre el mismo objeto como un solo hecho es
  inválido; resultado+resultado y consumo+consumo también. · inferido NO DEBE ·
  IMPEDIR (ver tensión C-05 con R-OPD-REF-13).
- **R-OPD-TR-8** — Todo proceso explícito DEBE crear, consumir o afectar ≥1 objeto
  (directa o indirectamente); habilitadores NO satisfacen. Excepción: procesos
  persistentes (*Existir*, *Sostener*, *Esperar*…) solo si declaran objeto afectado e
  invariancia neta, atributo o condición mantenida (R-PROC-2A, R-PROC-5..7). · DEBE ·
  ADVERTIR (validación de modelo; es incompletitud, no se puede impedir al editar).

### 5.2 Variantes con estado especificado

- **R-OPD-TR-6** — Enlace con estado especificado ancla al rountangle del estado:
  TS1 consume desde estado; TS2 genera hacia estado; TS3 = par
  (estado-origen→proceso + proceso→estado-destino); TS4 solo-entrada; TS5 solo-salida.
  «El anclaje es portador del hecho.» · inferido DEBE · MODELO-DATOS (extremo
  referencia estado) + RENDER.
- **R-OPD-TR-7** — Al descomponer, el efecto entrada-salida se escinde: temprano recibe
  entrada (saca de `s1`), tardío la salida (pone en `s2`). Único mecanismo; NO existen
  escindidos con modificador de control. · inferido DEBE / NO · OPERACIÓN + IMPEDIR
  (AP-07/08).
- Realización (informativa): consumo/resultado/efecto con ancla `center` + connectionPoint
  `boundary`; extremo a estado `midSide` sobre la cápsula, sticky, z=20; efecto monta
  swallowtail en source y target.
- Edge case: cambio de rol entre niveles (instrumento arriba, afectado abajo) legal
  solo si el cambio neto del proceso abstracto es cero y solo en descomposición.
  · ADVERTIR / SOLO-MÉTODO.
- Bimodal (textual): «T1↔`consume`, T2↔`genera`, T3↔`afecta`/`cambia de … a`,
  TS4/TS5↔fragmentos `de`/`a` (`spec-forja-opl-es §3`)». · GENERAR-OPL + PARSEAR-OPL.

## 6. §5 Enlaces habilitadores

| Tipo | ID | Marcador | Restricción de origen |
| --- | --- | --- | --- |
| Agente | H1/HS1 | piruleta NEGRA (círculo terminal relleno) en el extremo proceso | EXCLUSIVAMENTE humanos o grupos humanos |
| Instrumento | H2/HS2 | piruleta BLANCA (círculo terminal vacío) en el extremo proceso | habilitador no humano |

- **R-OPD-HAB-1** — Robots, software, IA, máquinas DEBEN dibujarse como instrumento,
  nunca agente. · DEBE · IMPEDIR/ADVERTIR (requiere saber si la cosa es humana; ver
  G-03).
- **R-OPD-HAB-2** — Una piruleta DEBE colgar siempre del extremo de una línea visible;
  handles y anclas NO DEBEN ser idénticos a piruletas. · DEBE / NO DEBE · RENDER.
- **R-OPD-HAB-3** — HS1/HS2 parten del rountangle del estado: habilitan solo en ese
  estado. · inferido DEBE · MODELO-DATOS + RENDER.
- **R-OPD-HAB-4** — Unicidad de rol: un objeto (o estado) tiene exactamente UN rol
  respecto de un proceso: transformado O habilitador; el editor DEBE impedir el segundo
  enlace procedimental sobre el mismo par; la recomposición resuelve por fuerza
  semántica (R-OPD-REF-13). · DEBE · IMPEDIR.
- Realización (informativa): path `M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0`
  (palito 7 + círculo r=5 en x=12); agente fill ink, instrumento fill paper, stroke ink.
  Humanidad aproximada por proxy de esencia física (GAP-OPD-AGENTE-HUMANO).
- Bimodal (textual): «H1↔`maneja`, H2↔`requiere`; HS añade `en \`estado\``».
  · GENERAR-OPL + PARSEAR-OPL.

## 7. §6 Modificadores de control, excepciones y operadores lógicos

### 7.1 Marcas `e` / `c` / `¬`

- **R-OPD-CTL-1** — El modificador es letra-anotación sobre un transformador o
  habilitador existente (`e` evento dispara; `c` condición omite si falla/bypass);
  NO agrega cosa ni enlace ni familia. · inferido DEBE · MODELO-DATOS (atributo del
  enlace, no enlace nuevo).
- **R-OPD-CTL-2** — `e`/`c` DEBEN emitirse en minúscula; `¬` como símbolo de negación
  sin caja; la marca va sobre la línea cerca del extremo del proceso. · DEBE · RENDER.
- **R-OPD-CTL-3** — `e`/`c` SOLO en Pre(P): consumo, efecto, agente, instrumento (con o
  sin estado). No existe evento/condición de resultado; NO DEBEN anotar estructural ni
  invocación. El editor DEBE bloquear. · DEBE / NO DEBE · IMPEDIR (AP-01/02/09/10).
- **R-OPD-CTL-4** — El enlace de evento es el segmento objeto/estado→proceso; el
  retorno no es evento. El evento se pierde tras la evaluación aunque la precondición
  falle. · inferido · OPERACIÓN (simulación).
- **R-OPD-CTL-5** (extensión declarada) — Negación `¬` sobre condición/evento (NOT
  desde estado `no-existente` o negación del estado requerido); reduce N condiciones a
  una. · PUEDE · MODELO-DATOS + RENDER (candidato a omitir).
- Realización (informativa): badge circular 18×18 (rx 9), fill paper, stroke ink 1,
  serif 12, distance 0.8 (entrantes al proceso) o 0.2 (proceso origen) offset −20;
  el modelo guarda `C`/`E`/`no` y presenta `c`/`e`/`¬`.

### 7.2 Excepciones temporales (tabla textual)

| Excepción | ID | Marca | Dispara |
| --- | --- | --- | --- |
| Sobretiempo | EX1 | `/` (una barra corta inclinada cruzando el enlace, cerca del manejador) | duración real > duración máxima declarada |
| Subtiempo | EX2 | `//` (par de barras inclinadas paralelas) | duración real < duración mínima declarada |

- **R-OPD-CTL-6** — Excepción: proceso fuente → proceso de manejo; el de manejo DEBE
  ser ambiental (discontinuo). Sobretiempo exige duración máxima declarada; subtiempo,
  mínima; la cota se declara como duración del proceso fuente. · DEBE · IMPEDIR (firma
  proceso→proceso) + ADVERTIR/IMPEDIR (cota ausente, manejador no ambiental).
- Realización (informativa): sobretiempo polyline `4,10 13,-10`; subtiempo
  `4,10 13,-10 8.5,0 17,0 13,10 22,-10`; «existe variante combinada under+over».

### 7.3 Operadores lógicos (tabla textual)

| Operador | Marca canónica | Semántica |
| --- | --- | --- |
| AND | **sin arco** — enlaces separados del mismo tipo que no se tocan | todos simultáneamente (default) |
| XOR | **un** arco discontinuo sobre el abanico | exactamente uno |
| OR | **dos** arcos discontinuos concéntricos | al menos uno |

- **R-OPD-CTL-7** — El arco DEBE ir en el extremo común del abanico; todo abanico es
  convergente (común = destino) o divergente (común = origen); «agente e instrumento
  solo admiten divergente». · DEBE · RENDER + IMPEDIR (abanico convergente de
  habilitadores; ver contradicción C-02).
- **R-OPD-CTL-8** — XOR/OR aplican a todas las familias procedimentales (consumo,
  resultado, efecto, agente, instrumento, invocación). `e`/`c` en abanico van sobre
  cada enlace individual y solo en Pre(P); abanicos de resultado e invocación NO
  admiten `e`/`c`. Cada rama puede tener o no estado. · inferido DEBE / NO · IMPEDIR
  (AP-03) + MODELO-DATOS.
  - Correcto: «abanico XOR de resultados con estado especificado, sin marcas de control».
  - Incorrecto: «abanico XOR de resultados con `c` en cada rama».
- **R-OPD-CTL-9** — m-de-f: para f>2, «exactamente m de f» (XOR) o «al menos m de f»
  (OR), m<f; m DEBE anotarse fuera y junto al arco. · DEBE · MODELO-DATOS + RENDER +
  IMPEDIR (m≥f). (GAP-OPD-FAN-M en v0.)
- **R-OPD-CTL-10** — Abanico probabilístico: cada rama `Pr=p`; suma DEBE ser 1.0;
  SIEMPRE XOR; sin anotación, uniforme 1/n; `Pr=p` fuera de abanico no canónico.
  Realización `Pr = p`, p ∈ [0,1]; espaciado no normativo. · DEBE · IMPEDIR/ADVERTIR
  (suma ≠ 1, Pr sin abanico, Pr en OR) + RENDER.
- **R-OPD-CTL-11** — Equivalencia: resultado simple hacia objeto con estados ≡ abanico
  XOR de resultados con estado especificado, uno por estado. · inferido · GENERAR-OPL /
  bisimetría (no duplicar hechos).
- Realización (informativa): arcos stroke ink 1.5, `strokeDasharray "4 1"`, linecap
  round; XOR = 1 arco r=30; OR = 2 arcos r=30/35; el arco se abre evitando el mayor hueco
  angular; dock por intersección recta-forma hacia el centroide.

### 7.4 Etiquetas de ruta y escenarios

- **R-OPD-CTL-12** — Etiqueta de ruta = texto sobre un enlace procedimental que
  desambigua entrada→salida: se sigue la trayectoria cuya etiqueta de salida coincide
  EXACTAMENTE con la de entrada. Escenario = conjunto de etiquetas de ruta. Semántica
  propia de esta spec (asimetría declarada); `spec-forja-opl-es §11` solo la superficie
  `Por ruta L,`. · inferido DEBE · MODELO-DATOS + OPERACIÓN (simulación) + GENERAR/
  PARSEAR-OPL (`Por ruta L,`).
- Realización (informativa): serif 12 inkMid en `distance:0.33`.

## 8. §7 Enlaces estructurales

### 8.1 Fundamentales: topología del triángulo (tabla textual)

| Relación | ID | Triángulo (canal NORMATIVO) | Dirección vértice→base |
| --- | --- | --- | --- |
| Agregación-participación | RF1 | interior **completamente relleno** | Todo → Partes |
| Exhibición-caracterización | RF2 | **triángulo interior** distinguible | Exhibidor → Rasgos |
| Generalización-especialización | RF3 | **vacío** (sin interior) | General → Especializaciones |
| Clasificación-instanciación | RF4 | **círculo interior** distinguible | Clase → Instancias |

- **R-OPD-STR-1** — La distinción reside en la topología interna, no en el color;
  colapsarla = NO conforme; símbolos importados DEBEN preservarla. · DEBE · RENDER.
- **R-OPD-STR-2** — Vértice al refinable; base a refinadores; en canon todo triángulo
  DEBE conectar por línea visible al refinable y ≥1 refinador; triángulos auxiliares de
  edición DEBEN distinguirse. · DEBE · RENDER.
- **R-OPD-STR-3** — Salvo exhibición, refinable y refinadores DEBEN tener la misma
  perseverancia (objeto-objeto, proceso-proceso). Exhibición admite las 4 combinaciones.
  · DEBE · IMPEDIR.
- **R-OPD-STR-4** — Colección incompleta = barra horizontal corta bajo la base del
  triángulo; clasificación-instanciación NO lleva barra. · inferido DEBE (reforzado por
  R-OPD-EDIT-6) · MODELO-DATOS (flag/derivado) + RENDER.
- **R-OPD-STR-5** (extensión declarada) — Palabra `ordered` junto al triángulo/abanico;
  con regla: `ordered by` + criterio. · PUEDE · RENDER + GENERAR-OPL (orden canonizado
  en OPL).
- **R-OPD-STR-6** — Enlaces heredados por generalización NO se dibujan como duplicados;
  herencia múltiple y discriminante aplican aunque no se dibujen. · inferido NO DEBE ·
  RENDER (no materializar) / SOLO-MÉTODO (inferencia).
- **R-OPD-STR-13** — La afiliación se hereda por la cadena estructural: atributos/
  operaciones de una cosa ambiental son ambientales y se renderizan discontinuos
  automáticamente. · inferido DEBE · OPERACIÓN (propagar) + RENDER.
- Realización (informativa): `standard.Polygon` 30×30, refPoints `15,0 30,30 0,30`,
  stroke ink 1.2; agregación fill ink; generalización fill paper; exhibición = contorno
  + triángulo interior 12×12 relleno en (+9,+12); clasificación = vacío + círculo r=4 en
  (15,20). Triángulo = nodo real con puertos `in`/`out`; con ≥2 ramas del mismo
  refinable+tipo se comparte UN triángulo (bus); con <2, triángulo propio.

### 8.2 Estructurales etiquetados (tabla textual)

| Variante | ID | Geometría | Etiquetas |
| --- | --- | --- | --- |
| Unidireccional | SE1 | línea con **punta abierta** en destino | etiqueta itálica sobre la línea |
| Unidireccional nulo | SE2 | igual | sin etiqueta → semántica `se relaciona con` |
| Bidireccional | SE3 | **arpones** (media punta) en ambos extremos | dos etiquetas independientes (ida/vuelta) |
| Recíproco | SE4/SE5 | arpones | una etiqueta o ninguna (`se relacionan`) |

- **R-OPD-STR-7** — Bidireccional con dos etiquetas idénticas ≡ recíproco con esa
  etiqueta. · inferido · GENERAR-OPL (normalización) / MODELO-DATOS.
- **R-OPD-STR-8** — Etiqueta de usuario en itálica sobre el eje; texto del modelador,
  no frase reservada. · inferido DEBE · RENDER.
- **R-OPD-STR-9** — SSE1..SSE7: estado en origen, destino o ambos; bidireccional y
  recíproco NO existen con estado solo-en-destino (DEBE bloquearse). · DEBE · IMPEDIR
  (AP-11).
- **R-OPD-STR-10** — Relación unaria = enlace a sí misma; n-arias se descomponen en
  binarias. Un proceso que solo preserva estado sin esfuerzo sostenido ni condición
  mantenida DEBE reemplazarse por tagged estructural (o atributo/estado) y su
  persistencia como elipse DEBE reportarse; el persistente canónico se realiza como
  efecto entrada=salida (`P cambia A de s a s`). · DEBE · ADVERTIR (AP-25) +
  MODELO-DATOS (autolazo tagged).
- Realización (informativa): tagged uni polyline `0,0 20,-10 0,0 20,10`; bidireccional
  arpón `0.5,0 20,±10` en source+target; etiqueta uni `distance:0.5`, bi 0.8 (ida) y 0.2
  (vuelta), serif 12 itálica.

### 8.3 Semi-plegado

- **R-OPD-STR-11** — Semi-plegado muestra refinadores dentro del rectángulo del todo
  (filas/íconos con nombre); por refinador y por OPD; el indicador cuenta los ocultos,
  no el total; enlaces procedimentales PUEDEN conectar a un refinador semi-plegado.
  · inferido DEBE / PUEDE · RENDER + OPERACIÓN (toggle de vista).
- **R-OPD-STR-12** — El semi-plegado NO tiene plantilla OPL nuclear. · inferido NO ·
  GENERAR-OPL (no emitir).
- Realización (informativa): filas con separadores, nombres clicables, contadores
  itálicos; badge `▸` (total) / `▾` (parcial) serif 16 bold; parte extraída tachado +
  opacity 0.64; triángulo compactado DEBE anclarse a la cosa visible (V-193).
- Bimodal: «el plegado parcial emite `al menos otro/a` (`spec-forja-opl-es §7.2/§12`);
  el semi-plegado estricto no emite OPL». Ver G-08 (plegado parcial vs semi-plegado).

## 9. §8 Invocación, tiempo y duración

### 9.1 Invocación

- **R-OPD-INV-1** — Invocación (IV1) proceso→proceso: línea en zigzag (rayo) con punta
  cerrada en el invocado; autoinvocación (IV2) = rayo en bucle. `e`/`c` sobre
  invocación PROHIBIDOS. · inferido DEBE / PROHIBIDO · RENDER + IMPEDIR (AP-10).
- **R-OPD-INV-2** — Invocación implícita en descomposición: la terminación de un
  subproceso invoca al inmediatamente inferior por posición vertical; NO se dibuja
  enlace. Puntos superiores de elipse a la misma altura (con tolerancia) = paralelo;
  el último en terminar inicia el siguiente nivel. Solo en descomposición de proceso.
  · inferido DEBE · MODELO-DATOS (orden derivado de Y) + OPERACIÓN (simulación) +
  GENERAR-OPL (secuencia). Ver G-10 (tolerancia no cuantificada).
- **R-OPD-INV-3** — Subprocesos activados por eventos desde estados distintos: asíncronos
  e independientes; un evento por subproceso, sin verticalidad temporal forzada.
  · inferido · OPERACIÓN (simulación).
- **R-OPD-INV-4** — La invocación PUEDE sustituir un objeto transitorio; bucle =
  invocación del último subproceso al padre, con *Esperar* si hay intervalo.
  · PUEDE · SOLO-MÉTODO.
- **R-OPD-INV-5** — Demora = etiqueta temporal sobre el rayo (`después de <demora>`);
  extensión local conforme; el parser acepta legacy sin tilde; forma canónica
  `después de`; roundtrip estricto cubre invocación y autoinvocación con demora.
  · PUEDE (extensión) / DEBE (roundtrip si existe) · RENDER + GENERAR-OPL + PARSEAR-OPL.
- **R-OPD-INV-9** (espejo de `reglas R-INV-2D`) — Frontera de cinco clases (ocho casos):
  **implícito** (bandas con cardinalidad, sin rayo: secuencial, paralelo, AND-join
  síncrono total); **explícito por evento** (reactivo, no rayo); **explícito por rayo**
  (autoinvocación/bucle, salto fuera de orden, invocación cross-OPD); **demora
  disuelta** en *Esperar* (`después de` solo sobre rayo ya-explícito); **join
  parcial/OR fuera del orden simple** (abanico explícito). El orden es atributo
  declarado de la descomposición y la banda Y lo realiza; un rayo entre hermanos que
  repite una transición de banda adyacente ya declarada es doble vara (R-INV-2B).
  · inferido DEBE · ADVERTIR (rayo redundante) + MODELO-DATOS (orden declarado).
- Realización (informativa): rayo 4 vértices, offset perpendicular
  `min(22, max(12, len·0.08))` + swallowtail en destino; autoinvocación lazo 2 tramos
  del borde inferior, pico `max(56, h·0.55)`, ramas ±35°, marker solo en el retorno;
  demora serif 11 inkMid `distance:0.5`.

### 9.2 Duración

- **R-OPD-INV-6** — Duración min/esperada/max (+ distribución) se muestra DENTRO de la
  elipse, bajo el nombre: `[unidad] {min, esperada, max} {distribución, parámetros}`.
  Unidades válidas: `ms, sec, min, hour, day, week, month, year`. La realización
  textual la gobierna `spec-forja-opl-es §5.3`. Unidad del sistema es default. Sin
  distribución NO se emite placeholder. · inferido DEBE / NO · RENDER + MODELO-DATOS.
- **R-OPD-INV-7** — opforja v0 realiza min/max/tasa como etiquetas sobre el enlace
  (`Min:`, `Max:`, `Rate =`): GAP-OPD-DURACION-ELIPSE. · NO-APLICA (registro de
  divergencia; un rediseño DEBERÍA seguir INV-6).
- **R-OPD-INV-8** — Objeto-reloj con estado-valor temporal PUEDE disparar procesos vía
  evento; sin símbolo nuevo. · PUEDE · SOLO-MÉTODO.

## 10. §9 Multiplicidad y cardinalidad (tabla textual)

| Símbolo | Rango | Lectura |
| --- | --- | --- |
| `?` | 0..1 | opcional |
| `*` | 0..* | opcional (cero o más) |
| (sin símbolo) | 1..1 | exactamente uno (default) |
| `+` | 1..* | al menos uno |

- **R-OPD-MUL-1** — Multiplicidad junto al extremo (o cerca del refinador en
  estructurales); aplica a etiquetados, agregación y procedimentales; NUNCA al extremo
  proceso. · NUNCA · IMPEDIR + RENDER.
- **R-OPD-MUL-2** — Rangos `qmín..qmáx`; intervalos `[a..b] (a..b] [a..b) (a..b)`;
  listas `[1..10],[20..30]` (sin espacio); `*` extremo abierto; paramétricas (`2`,
  `3*n; n<=4`) con restricciones tras `;`. Nombres de parámetro DEBEN ser únicos en el
  modelo. · DEBE · MODELO-DATOS + PARSEAR (gramática de multiplicidad) + IMPEDIR
  (parámetro duplicado).
- **R-OPD-MUL-3** — Operadores normativos ASCII (`= != < <= >= in {}`); `≠ ≤ ≥ ∈` son
  visualización y DEBEN normalizarse o declararse extensión. · DEBE · PARSEAR-OPL
  (normalizar) + RENDER.
- **R-OPD-MUL-4** — Cardinalidades, etiquetas y etiquetas de ruta son propiedades del
  enlace, no atributos; no se renderizan como estados ni cambian en simulación.
  · inferido · MODELO-DATOS.
- **R-OPD-MUL-5** — Tasa de transformación anotada sobre el enlace con unidades; sin tasa,
  inmediata. · inferido PUEDE · MODELO-DATOS + RENDER (candidato a omitir).
- Realización (informativa): serif 12 ink; origen `distance:0.1` (procedimental) / `0.2`
  (estructural), destino `0.9`.
- Bimodal (textual): «`?`↔`un/una opcional`, `*`↔`opcional (cero o más)`, `+`↔`al menos
  un/una`, sin símbolo↔implícito» (sede `spec-forja-opl-es §10.1`). · GENERAR/PARSEAR-OPL.

## 11. §10 Refinamiento y gestión de contexto

### 11.1 Pares refinamiento↔abstracción (tabla textual)

| Par | Refina | Abstrae | Naturaleza |
| --- | --- | --- | --- |
| Expresión ↔ Supresión de estados | revela estados | oculta estados | per-OPD (§3.3) |
| Despliegue (unfold) ↔ Plegado (fold) | revela refinadores estructurales | los oculta | asíncrono, 4 relaciones |
| Descomposición (in-zoom) ↔ Recomposición (out-zoom) | expone subprocesos en contenedor | restaura el padre | síncrono, semántica de agregación |
| Sub-modelo (referencia) ↔ Desconexión | cruza la frontera del modelo | la corta | inter-modelo (V-242) |

- **R-OPD-REF-1** — En descomposición la cosa refinada aparece agrandada como
  contenedor en el OPD hijo (elipse inflada / rectángulo), con contorno grueso en padre
  y en hijo; el despliegue en nuevo diagrama también marca contorno grueso; el
  despliegue intradiagrama NO. · inferido DEBE · RENDER.
- **R-OPD-REF-2** — En descomposición de proceso el tiempo fluye de arriba hacia abajo;
  Y de subprocesos = secuencia; misma altura = paralelo; el layout vertical ES semántico
  (edición y simulación). En descomposición de objeto la posición NO es tiempo.
  · inferido DEBE · MODELO-DATOS + GENERAR-OPL (orden) + OPERACIÓN (simulación).
- **R-OPD-REF-3** — In-zoom en dos fases: Mostrar Contenido → Refinar Enlaces (OPD
  semidescompuesto intermedio); out-zoom: Abstraer Enlaces → Ocultar Contenido.
  · inferido · OPERACIÓN (puede ser un solo gesto con estado intermedio).
- **R-OPD-REF-4** — Al crear el OPD hijo, las cosas conectadas al refinado se copian como
  elementos externos (conservan esencia, contorno, estados; posición recalculada). En
  descomposición: TODAS las conectadas por cualquier enlace; en despliegue: SOLO hijos
  estructurales directos. Un externo NO se refina desde ese hijo. · inferido DEBE ·
  OPERACIÓN + IMPEDIR (refinar externo desde el hijo).
- **R-OPD-REF-5** — Internos (creados en la descomposición) se eliminan en cascada con el
  padre; externos persisten. Mover un externo dentro del contenedor NO cambia su alcance;
  la herramienta DEBE advertir o rebotar. · DEBE · OPERACIÓN + ADVERTIR.
- **R-OPD-REF-6** — Visibilidad en OPD hijo: estructurales al contenedor visibles;
  procedimentales al contenedor NO visibles directamente (se distribuyen); entre
  internos visibles; los que no tocan contenedor ni internos invisibles. · inferido ·
  RENDER.
- **R-OPD-REF-7** — Descomposición DEBE tener ≥2 subprocesos y despliegue ≥2
  refinadores; con un solo hijo no cierra ni exporta como canónico (placeholder de
  edición tipificado). · DEBE · ADVERTIR (edición) + EXPORT (gate) (AP-13).
- **R-OPD-REF-8** — PROHIBICIÓN de ciclos: no refinar una cosa desde dentro de su propio
  árbol; chequeo transitivo sobre ancestros. · PROHIBIDO · IMPEDIR (AP-16).
- **R-OPD-REF-9** — Esencia, perseverancia y nombre NO cambian a través del
  refinamiento; un hecho en un OPD no puede contradecir a otro; importancia ∝ OPD más
  alto donde aparece. · inferido NO DEBE · MODELO-DATOS (propiedades en la cosa, no en
  la apariencia, garantiza por construcción) + ADVERTIR (contradicciones).
- **R-OPD-REF-10** — La descomposición DEBE preservar la firma de frontera del proceso
  abstracto (roles netos de entrada/salida). Condición necesaria, no prueba de
  equivalencia. · DEBE · ADVERTIR (checker `DESCOMPOSICION_NO_PRESERVA_FRONTERA`).

### 11.2 Distribución y escisión de enlaces (tabla textual)

| Enlace al contorno del proceso descompuesto | Política |
| --- | --- |
| Consumo / entrada con estado | PROHIBIDO en contorno exterior → migra al **primer** subproceso (Y mín) |
| Resultado / salida con estado | PROHIBIDO en contorno → migra al **último** subproceso (Y máx) |
| Efecto básico (sin estado) | permitido al contorno = se distribuye a **todos** |
| Efecto entrada-salida | se **escinde** (TS4 al temprano, TS5 al tardío) |
| Agente / Instrumento | permitido al contorno = a **todos** los subprocesos |
| Estructural | NO se distribuye; permanece en el contenedor |
| Evento desde objeto sistémico | PROHIBIDO cruzar la frontera |
| Evento desde objeto ambiental | PUEDE cruzar, modelando la contingencia |

- **R-OPD-REF-11** — Un enlace al contorno del contenedor se interpreta distributivamente
  («paréntesis algebraico»). Sin subprocesos aún, el enlace al contenedor es respaldo
  temporal. Distribución y restricciones solo en descomposición. · inferido DEBE ·
  OPERACIÓN + IMPEDIR (AP-06, AP-21) + GENERAR-OPL.
- **R-OPD-REF-12** — Si una condición omite un subproceso, el control pasa al siguiente
  subproceso secuencial aplicable. · inferido · OPERACIÓN (simulación).

### 11.3 Precedencia de recomposición

- **R-OPD-REF-13** — Colisiones al recomponer (out-zoom/plegar/suprimir) sobre el mismo
  par objeto-proceso se resuelven por fuerza semántica. Textual: «orden principal
  `consumo = resultado > efecto > agente > instrumento`; secundario `evento > sin
  control > condición` (12 niveles; condición de instrumento es el más débil). Matriz
  transformadora: efecto×efecto=efecto; efecto×resultado=resultado;
  efecto×consumo=consumo; resultado×consumo=efecto (solo con continuidad de
  identidad/estados); resultado×resultado y consumo×consumo INVÁLIDOS. Un transformador
  SIEMPRE prevalece sobre un habilitador.» · inferido DEBE · OPERACIÓN (vista abstraída
  / OPL del padre) + IMPEDIR (AP-30).

### 11.4 Árbol de OPDs, identidad y categorías

- **R-OPD-REF-14** — El SD (raíz, nivel 0) contiene exactamente un proceso sistémico;
  PUEDE contener procesos ambientales. Excepción: Vista de Sub-modelo si declara selección
  parcial. El árbol nace en SD (default guiado SD-primero); el arranque bottom-up admite
  Bocetos antes del SD (R-OPD-REF-20). En régimen Apunte la ausencia de SD conforme se
  observa; en régimen Modelo es deuda de cierre exigible. Profundidad típica 5-10
  (referencia). · inferido DEBE · ADVERTIR (según régimen; sin bloquear edición).
- **R-OPD-REF-15** — Etiquetas `SD/SD1/SD1.1` son proyección de navegación, NO
  identidad. Todo OPD DEBE tener identificador persistente estable (UUID/slug/URI) y
  toda referencia externa DEBE usarlo. · DEBE · MODELO-DATOS (AP-17).
- **R-OPD-REF-16** — Tres categorías de OPD mutuamente excluyentes, declaradas en
  metadato: jerárquico (por refinamiento; eliminable solo si es hoja; internos
  protegidos), vista anclada (Sub-modelo, Mapa del Sistema, Vista de Requisitos; solo
  lectura respecto de hechos), vista ad hoc (eliminable libremente). Una vista NO crea
  hechos OPM. · inferido DEBE · MODELO-DATOS + IMPEDIR (eliminar OPD jerárquico no hoja).
  Ver sobreingeniería S-06.
- **R-OPD-REF-17** — Instancia visual ≠ lógica: una cosa PUEDE aparecer en N OPDs;
  eliminar una apariencia no elimina la cosa; NO se puede crear instancia visual entre
  tipos distintos (objeto↔proceso). La cosa duplicada en el mismo OPD se marca con
  silueta desplazada detrás del símbolo. · inferido DEBE / NO · MODELO-DATOS + IMPEDIR
  (AP-15) + RENDER (silueta; GAP-OPD-DUPLICADO).
- **R-OPD-REF-18** — Composición inter-modelo: un modelo contiene 1..* OPDs, 1..* párrafos
  OPL y 0..* referencias a sub-modelos en DAG; clausura OPD↔OPL local; toda cosa
  referenciable cross-model expone URI persistente; marcas cross-model son vista; ciclo
  de carga (`cargado y sincronizado` / `no sincronizado` / `no cargado`) es propiedad de
  la referencia; desconectar cambia explícitamente el estado. · inferido DEBE (si hay
  sub-modelos) · MODELO-DATOS + EXPORT. Ver S-04.
- **R-OPD-REF-19** — Operaciones auxiliares (`traer conectadas`, `traer enlaces entre
  seleccionadas`) materializan apariencias de hechos ya declarados; no crean semántica;
  DEBEN ser reversibles o acotadas; resultado canónico indistinguible de uno manual;
  PUEDEN dejar supresores `…`. · DEBE (si existen; existencia inferida PUEDE) · OPERACIÓN.
- **R-OPD-REF-20** (extensión declarada) — Bocetos e integración reversible:
  - Boceto = OPD con `padreId = null` que NO es la raíz (`opdRaizId`), fuera del árbol;
    estado legítimo, no error; sus hechos emiten OPL normal.
  - **Integrar como…**: declara el Boceto como descomposición o despliegue de una cosa
    existente; fija padre y slot en un gesto; converge con el top-down en el vínculo, no
    en el contenido (Integrar conserva el contenido autorado y solo materializa la
    apariencia derivada necesaria); respeta ciclos, dueño único y firma de frontera.
  - **Devolver a Bocetos**: inversa preservante (libera slot, `padreId = null` «solo en la
    raíz elegida», conserva ID, hechos, geometría, pregunta guía y descendientes).
    **Eliminar refinamiento** es destructiva distinta y NO DEBE presentarse como inversa
    de Integrar.
  - Gate delegado a `reglas-opm-estrictas-es` R-CAN-BOCETO-1..4. «Integrar no gradúa;
    Graduar no integra; la edición nunca se bloquea por la sola presencia de Bocetos.»
  - Banda «Bocetos» en la navegación; «Taller» reservado al espacio de documentos Apunte;
    la raíz no se renombra «Hoja». Banda, espacios y acciones son UI.
  · PUEDE (extensión) con DEBE/NO DEBE internos · OPERACIÓN + MODELO-DATOS + EXPORT
  (gate). Ver S-05 y C-03.
- Realización (informativa): in-zoom modo contorno (padding 16, fill
  `rgba(250,250,248,0.96)`, stroke 4, label arriba, z=0; ids internos `padre.ordinal`);
  unfold con partes fuera y triángulos; árbol por `padreId` acíclico; `Opd.vista`
  (`requirement-view`/`submodel-view` read-only, `generic-view`); «traer conectados»
  radial (minDistance 12); proxy de parte extraída dashed `5 4` gris `#98a2b3` sin markers.
  Identificadores internos `adoptarOpd`, `gateOpdsSinAdoptar`,
  `contextoRefinamiento.origen:"adopcion"`, constructor `establecerRefinamiento`.
- Bimodal: `se descompone en` / `se despliega en` / aristas `se refina por …`
  (`spec-forja-opl-es §7`); «el reverse OPL NO reconstruye el árbol de OPDs
  (GAP-CX-PARSER…): el árbol se materializa por estructura del modelo». · GENERAR-OPL;
  PARSEAR-OPL no reconstruye árbol.

## 12. §11 Layout y routing

- **R-OPD-LAY-1** — No oclusión entre cosas (excepción: plegado en puertos); enlaces no
  atraviesan áreas ocupadas; minimizar enlaces y cruces. Si un re-ruteo automático sin
  cambio semántico elimina cruces, el export DEBE aplicarlo o reportar advertencia.
  · DEBE (export) / inferido DEBERÍA (layout) · RENDER + ADVERTIR + EXPORT.
- **R-OPD-LAY-2** — Máximo 20-25 cosas por OPD. Gate: advertir entre 21 y 25; BLOQUEAR
  el export canónico con >25 salvo vista tipificada o refinamiento declarado (extensión
  canonizada en `reglas R-LAY-1`). Por OPD lógico, no por lienzo. · DEBE (inferido del
  gate) · ADVERTIR + EXPORT (bloqueo canónico, no de edición).
- **R-OPD-LAY-3** — Grid = decoración opcional de edición: no pertenece al modelo, DEBE
  suprimirse en export canónico, snap transparente (equivalencia bajo cuantización).
  Smart-guides usan canal UI y NO reutilizan el dash de afiliación. · DEBE / NO ·
  RENDER + EXPORT.
- **R-OPD-LAY-4** — Routing por familia: procedimentales rectos (sin router);
  estructurales fundamentales ortogonal (manhattan: nunca diagonal, evitando bbox);
  invocación y abanicos con vértices explícitos. · inferido DEBE (el rationale lo cita
  como libro/OPCloud) · RENDER. Ver C-06 (tensión con LAY-1).
- **R-OPD-LAY-5** — Anclaje canónico: extremo al centro con recorte en el perímetro real
  (elipse: intersección exacta con la curva); puerto explícito con ancla dedicada; los
  enlaces no pueden quedar sueltos (`linkPinning:false`). · inferido DEBE · RENDER +
  IMPEDIR (enlace sin extremo).
- **R-OPD-LAY-6** — Cruces inevitables PUEDEN dibujarse con salto en arco (`jumpover`),
  degradando a recto en OPDs densos (>35 enlaces); presentación, no semántica. · PUEDE ·
  RENDER (candidato a omitir).
- **R-OPD-LAY-7** — Símbolos estructurales que colisionan (<44 px) se separan (50 px,
  carriles alternados); tras drag, el orden de terminales estructurales PUEDE
  re-permutarse (≤7 enlaces). · PUEDE / inferido · RENDER (candidato a omitir).
- **R-OPD-LAY-8** — El export DEBE auto-ajustar el viewport para no recortar símbolos,
  rótulos ni decoraciones. · DEBE · EXPORT.
- **R-OPD-LAY-9** — Posiciones por defecto: objeto-arriba/proceso-abajo en
  transformadores; todo-arriba/partes-abajo en estructurales (triángulo en el tramo
  central); origen común del abanico geométricamente significativo. · DEBERÍA (explícito:
  «DEBERÍA, no DEBE») · RENDER (auto-layout al crear).
- **R-OPD-LAY-10** (extensión declarada) — Canvas conceptualmente ilimitado (crece en 4
  direcciones); al cambiar de OPD la vista DEBE centrar el bbox real del contenido.
  · PUEDE (lienzo infinito) / DEBE (centrar) · OPERACIÓN + RENDER.

## 13. §12 Composición del OPD y rotulado

- **R-OPD-ROT-1** — Rótulo centrado en la forma (multilínea); en `canon-diagrama` los
  rótulos en negro por defecto: el cromatismo de clase vive en bordes, líneas y
  decoraciones. · inferido DEBE · RENDER + EXPORT.
- **R-OPD-ROT-2** — Alias decorativo entre paréntesis (`Sistema de Turborreactor (str)`);
  llaves `{alias}` EXCLUSIVAMENTE para binding computacional; unidad dimensional entre
  corchetes `[u]` tras el nombre (no es multiplicidad); `[]` vacío es placeholder de
  edición suprimido en canon salvo confirmación. Banda «Bocetos» y espacios Taller/Modelos
  son proyecciones de edición; la raíz no se renombra «Hoja». · inferido DEBE ·
  MODELO-DATOS (nombre, alias, unidad separados) + RENDER + PARSEAR-OPL (desambiguar
  `()`, `{}`, `[]`).
- **R-OPD-ROT-3** — La política léxica de nombres (singular, capitalización,
  Conjunto/Grupo, proceso en infinitivo/nominalización, estados en minúscula) pertenece
  a la capa textual/método; la capa visual la hereda sin política paralela. · inferido ·
  NO-APLICA aquí (sede OPL/método).
- **R-OPD-ROT-4** — Instancia lógica rotulada `NombreInstancia : NombreClase`; la clase
  muestra atributos con rangos y la instancia con valores concretos. · inferido DEBE ·
  RENDER + GENERAR-OPL.
- **R-OPD-ROT-5** — Normalización léxica, alias de casing o reescritura del rótulo NO se
  aplican silenciosamente; conflicto de unicidad nominal se resuelve explícitamente
  (reusar existente / renombrar / descartar); NO reescritura silenciosa. · NO (se
  admite) · OPERACIÓN (diálogo de resolución) + IMPEDIR (duplicado nominal silencioso)
  (AP-22).
- **R-OPD-ROT-6** — Estereotipos: sintaxis visible `<<Nombre>>` en el rótulo o distintivo
  equivalente; la condición estereotipada NO se oculta del canon; no sustituye la clase
  base. `<<Requirement>>` = objeto estereotipado (Name, ID, Requirement Essence,
  Satisfaction, Description; `Requirement Essence` ≠ esencia física/informacional); se
  vincula al diseño por tagged `satisface`, nunca procedimental. Mención OPL `«Nombre»`
  PUEDE; su ausencia es conforme. Estereotipo se aplica a cosas o se materializa como
  plantilla de subgrafo injertable; marcar un enlace con estereotipo NO DEBE (sexta
  familia encubierta). Catálogo/vitrinas/injerto 1-clic = extensión declarada opforja.
  · PUEDE (función completa) / NO DEBE (estereotipo de enlace) · MODELO-DATOS + RENDER +
  IMPEDIR. Ver S-02.
- **R-OPD-ROT-7** — Notas y anotaciones libres son meta: no son cosa OPM, no emiten OPL
  nuclear, no reutilizan canales semánticos; si se exportan, se marcan meta. Notas de mesa
  excluidas de `canon-diagrama`. · inferido DEBE · MODELO-DATOS + EXPORT (PUEDE tener
  notas; si las tiene, estas reglas).
- **R-OPD-ROT-8** — Estilado autoral admisible solo si no colisiona con canales
  reservados; el export canónico normaliza el estilado salvo perfil contrario; el tamaño
  autoral no puede impedir legibilidad; bitmap decorativo PUEDE ir dentro de una cosa sin
  ocluir contorno/sombra/estados/rótulo. El estilado NO reutiliza rojo/amarillo/verde
  como semántica tácita, discontinuidad de borde, cromatismo de simulación ni marcas de
  validación. · PUEDE / NO · RENDER + EXPORT (candidato a omitir entero).
- **R-OPD-ROT-9** (extensión declarada) — Anclaje a Pieza / Centinela de Drift: chip de
  estado en la esquina en tres fases `sincronizado` · `no-resuelto` (`?`) · `divergente`
  (`⟳`), en TINTA, jamás crimson; el chip no nombra la Pieza (eso va al Inspector); no
  emite OPL nuclear; anclar no muta esencia; referencia-a-snapshot evolutivo a grano
  biblioteca (`frozenAtHash`) o Pieza (`frozenAtPieza`, vecindad RADIO-1); edición local
  de esencia PUEDE (drift visible, no bloqueado); **Soltar** desancla irreversiblemente;
  **Calcar** copia desacoplada. · PUEDE (extensión) con DEBE interno (chip) ·
  NO-APLICA a herramienta simple (sobreingeniería S-03).

## 14. §13 Canvas, modos e interacción

- **R-OPD-UI-1** — Todo elemento de interacción (handles, halos, anclas, marquee, menús,
  toasts, ghosts, smart-guides, resaltados de búsqueda) es UI transitoria con canal
  reservado no ambiguo y NO persiste en canon. En OPFORJA el canal UI es **crimson**
  `#8e2a2e` + grises; crimson PROHIBIDO como marca semántica OPM. · inferido DEBE /
  PROHIBIDO · RENDER + EXPORT.
- **R-OPD-UI-2** — Selección única: subrayado crimson hairline bajo la etiqueta;
  múltiple: celda-halo aparte (z=30); hover: variante 1 px opacity 0.5. La selección NO
  redibuja el borde semántico. · inferido NO DEBE (redibujar borde) · RENDER.
- **R-OPD-UI-3** — Afordances de manipulación (resize, anclas de conexión, marquee,
  vértices, reanclaje) usan canal UI y NO persisten; el drag de un subproceso embebido
  DEBE quedar confinado al interior del contenedor. Detalle opforja (extensión): 8
  handles 8×8 solo en selección única; 12 anclas r=5 (opacity 0→1 al hover/modo enlace,
  cursor crosshair); marquee Shift+drag (Ctrl+Shift acumula); vértices crimson r=4.
  · DEBE (confinamiento) / informativo (detalle) · OPERACIÓN + RENDER.
- **R-OPD-UI-4** (extensión declarada) — Cápsulas de estado interactivas de primera clase
  (hover, selección, foco, drag); feedback DEBE usar variantes del canal UI sin tocar el
  oliva semántico. · PUEDE / DEBE (si existe) · OPERACIÓN + RENDER.
- **R-OPD-UI-5** — Feedback de destinos válidos/inválidos del modo enlace DEBE usar el
  canal UI reservado (v0 usa paleta legacy OPCloud `#70E483/#3BC3FF/#586D8C`:
  GAP-OPD-FEEDBACK-LEGACY). · DEBE · RENDER.
- **R-OPD-UI-6** — Grid configurable (paso, color, grosor, escala, snap) PUEDE activarse
  en edición; supresión en export obligatoria. Activación por defecto = materia de
  ui-forja. · PUEDE / DEBE (supresión) · RENDER + EXPORT.

## 15. §14 Interacción OPD↔OPL (lado canvas)

Puente legislado en `spec-forja-opl-es §14` (tokens con referencia tipada, hover
bidireccional, click→foco, filtrado por selección, resolución por sub-span).

- **R-OPD-INT-1** — Resaltado entrante (hover sobre OPL) sobre la cosa con fill cálido
  (`paperWarm`) + subrayado hover; estados y enlaces con sus variantes. Por referencia
  tipada (tipo+id), nunca por coincidencia textual. · inferido DEBE / NUNCA · RENDER +
  MODELO-DATOS (tokens OPL con referencia tipada).
- **R-OPD-INT-2** — Click en token OPL navega/enfoca en canvas sin mutar el modelo; la
  selección activa en canvas filtra el panel OPL. · inferido DEBE · OPERACIÓN.
- **R-OPD-INT-3** — El color NO es vehículo del cruce modal (a diferencia del sync-color
  OPCloud). · inferido NO DEBE · RENDER.

## 16. §15 Edición visual

- **R-OPD-EDIT-1** — DEBE validar la firma antes de crear un enlace (legalidad del par
  por familia) y el extremo de estado antes de anclar. Solo se ofrecen los enlaces
  legales para el par. · DEBE · IMPEDIR (menú contextual filtrado).
- **R-OPD-EDIT-2** — Un cambio que afecta contorno, sombra, forma, marcador, triángulo o
  estado cambia el hecho y su OPL; estilo autoral no cambia OPL. Cambiar el tipo de cosa
  recalcula perseverancia y revisa enlaces afectados; si una oración OPL cambia el tipo
  ontológico de una cosa existente, se bloquea y se pide decisión explícita. · inferido
  DEBE · GENERAR-OPL + PARSEAR-OPL (bloqueo por conflicto de tipo) + OPERACIÓN.
- **R-OPD-EDIT-3** — Mover una cosa entre OPDs preserva identidad y emite solo cambios de
  apariencia. · inferido DEBE · OPERACIÓN + MODELO-DATOS.
- **R-OPD-EDIT-4** — Toda acción que genere una combinación prohibida (tabla AP) DEBE
  bloquearse antes de persistir o marcarse como error estructural recuperable; toda
  edición ambigua se bloquea hasta resolver identidad, firma o alcance. · DEBE · IMPEDIR.
- **R-OPD-EDIT-5** — Al insertar subprocesos, los enlaces del padre migran
  automáticamente (o la herramienta valida y alerta): consumo al primero, resultado al
  último, el resto según §10.2; el modelador reasigna. · inferido DEBE · OPERACIÓN +
  ADVERTIR.
- **R-OPD-EDIT-6** — DEBE rastrear refinadores de cada refinable y ajustar
  automáticamente el símbolo (colección incompleta, contadores de plegado) y las
  oraciones OPL cuando cambia la colección. · DEBE · OPERACIÓN + GENERAR-OPL + RENDER.
- **R-OPD-EDIT-7** — DEBE permitir reanclar los extremos de un estructural fundamental
  (compuesto triangular). v0 solo por inspector; drag roto (GAP-OPD-DRAG-TRIANGULO).
  · DEBE · OPERACIÓN.

## 17. §16 Configuración que afecta al OPD

- **R-OPD-CFG-1** — Ninguna opción de presentación altera el hecho canónico (proyección
  recortable). · inferido DEBE · MODELO-DATOS (vista separada del hecho).
- **R-OPD-CFG-2** — Toggles de vista por OPD admitidos: supresión de estados
  (global+local), plegado (normal/parcial/plegado), alias visibles, descripciones
  visibles, modo imagen; el OPL local refleja la vista. · PUEDE (admitidos) / DEBE
  (reflejo OPL, inferido) · OPERACIÓN + GENERAR-OPL.
- **R-OPD-CFG-3** — La densidad PUEDE degradar presentación (>35 enlaces → connector
  recto; minimizar panel OPL). · PUEDE · RENDER.
- **R-OPD-CFG-4** — Preset de esencia primaria PUEDE fijar el default; NO sobrescribe
  esencia explícita; exige serialización recuperable. · PUEDE / NO · MODELO-DATOS.

## 18. §17 Fallos, validación y marcas de diagnóstico

- **R-OPD-VAL-1** — Canvas limpio (default): la validación no deja marcas persistentes
  en el OPD estático; el resultado vive en un panel de diagnóstico. Si se usan distintivos
  persistentes, se declaran gramática de vista separada. · inferido DEBE (default) ·
  RENDER (panel de diagnóstico).
- **R-OPD-VAL-2** — Cinco familias de validación distinguibles: invalidez gramatical,
  advertencia metodológica, conflicto de unicidad/identidad, conflicto de
  contención/pertenencia, sugerencia automática/inferida. Metodológicas y sugerencias son
  vistas derivadas, no parte del OPD. · inferido DEBE · ADVERTIR (clasificar
  diagnósticos). Ver S-08.
- **R-OPD-VAL-3** — Durante arrastre/creación, un enlace inválido PUEDE exhibir marcador
  transitorio de rechazo (p. ej. `×`), fuera de canon. Canales de validación NO
  reutilizan dash de afiliación, contorno grueso, marcas de simulación ni decoraciones de
  enlace. · PUEDE / NO · RENDER.
- **R-OPD-VAL-4** — Zona laxa: lo no prohibido ni canonizado se clasifica `no-canonizado`
  o `extensión declarada`, NUNCA prohibición; el bloqueo se reserva a contradicción SSOT
  explícita o error de categoría. · NUNCA (prohibir lo no prohibido) · política de
  IMPEDIR (no sobrebloquear).
- **R-OPD-VAL-5** — Anti-patrones con realización en canvas/export que DEBEN bloquearse o
  reportarse (subconjunto; catálogo completo en `reglas §11.1`; AP-18 fuera de alcance):

| AP | Construcción prohibida | Regla | Enforcement |
| --- | --- | --- | --- |
| AP-01/02 | `e`/`c` sobre resultado | R-OPD-CTL-3 | runtime |
| AP-03 | abanico XOR/OR de resultado con `e`/`c` | R-OPD-CTL-8 | runtime |
| AP-04 | resultado al estado inicial | R-OPD-TR-3 | runtime |
| AP-05 | agente hacia no-humano | R-OPD-HAB-1 | runtime (proxy esencia física) |
| AP-06 | consumo/resultado en contorno exterior de descompuesto | R-OPD-REF-11 | runtime |
| AP-07/08 | efecto entrada-salida sin escindir / escisión con `e`/`c` | R-OPD-TR-7 | runtime |
| AP-09/10 | `e`/`c` sobre estructural / sobre invocación | R-OPD-CTL-3 | runtime |
| AP-11 | bidireccional/recíproco con estado solo-en-destino | R-OPD-STR-9 | runtime |
| AP-12 | estados dentro de proceso | R-OPD-COSA-7 | runtime |
| AP-13 | refinamiento de 1 hijo | R-OPD-REF-7 | runtime |
| AP-14 | duplicar estados para separar inicio/fin | R-OPD-EST-5 | runtime (diagnóstico) |
| AP-15 | instancia visual entre tipos distintos | R-OPD-REF-17 | runtime |
| AP-16 | refinamiento cíclico | R-OPD-REF-8 | runtime |
| AP-17 | `SDx.y` como identificador externo estable | R-OPD-REF-15 | manual (auditoría de referencias) |
| AP-19 | sombra decorativa en cosa informacional | R-OPD-COSA-3 | lint (design:governance) |
| AP-20 | triángulo sin topología interna distinguible | R-OPD-STR-1 | eval (tests de markers) |
| AP-21 | evento sistémico cruzando frontera de descomposición | R-OPD-REF-11 | runtime |
| AP-22 | sinónimos múltiples / unicidad nominal sin resolver | R-OPD-ROT-5 | runtime (diagnóstico) |
| AP-23 | truncamiento silencioso de rótulo | R-OPD-COSA-6 | eval |
| AP-24 | reutilizar canales semánticos para UI/validación | R-OPD-CAN-3 | lint (design:governance) |
| AP-25 | proceso de soporte/mantenimiento sin esfuerzo sostenido ni condición mantenida relevante (R-PROC-5..7) como elipse | R-OPD-STR-10 | runtime (diagnóstico) |
| AP-27 | evento a subproceso intermedio sin justificación | R-OPD-REF-11/R-OPD-INV-3 | runtime (advertencia) |
| AP-30 | resultado+resultado / consumo+consumo al recomponer | R-OPD-REF-13 | runtime |

  · DEBE · IMPEDIR (runtime) / ADVERTIR (diagnóstico) / tests (eval, lint).
  Clasificación práctica para la herramienta: IMPEDIR al editar = AP-01/02, 03, 04,
  06, 07/08, 09/10, 11, 12, 15, 16, 21, 30 (y AP-05 si se modela humanidad); ADVERTIR =
  AP-13 (bloquea export), 14, 22, 25, 27; garantizar por construcción del renderer =
  AP-19, 20, 23, 24; por modelo de datos = AP-17.
- **R-OPD-VAL-6** — DEBERÍA detectar inconsistencias inter-OPD, advertir el cruce de
  eventos sistémicos, notificar inclusión múltiple de un refinador y señalar sub/sobre-
  especificación de enlaces (generales redundantes junto a especializados). · DEBERÍA ·
  ADVERTIR.

## 19. §18 Catálogo formal normativo (copia textual)

### 19.1 Paleta (tokens Codex; informativa)

| Token | Hex | Uso |
| --- | --- | --- |
| paper | `#fafaf8` | fondo, fill de markers huecos |
| paperWarm | `#eeece2` | resaltado bimodal entrante |
| ink | `#171511` | enlaces, markers, texto |
| inkMid / inkSoft | `#5a564c` / `#807b6e` | etiquetas secundarias / identificadores |
| opmObjeto | `#27613f` | stroke de objeto |
| opmProceso | `#1d3f78` | stroke de proceso |
| opmEstado / estadoFill / estadoFinalFill | `#68711f` / `#dedacb` / `#d6d2c6` | estado |
| crimson / crimsonSuave | `#8e2a2e` / `rgba(142,42,46,0.06)` | canal UI reservado (selección, foco); la simulación comparte el hue con separación por dash/glifo/z (§20, R-§23-OPD-CANAL) |
| legacy OPCloud | `#70E483 #3BC3FF #586D8C #fdffff` | solo compat de apariencias antiguas (GOVERNANCE §4, excepción aliases legacy); prohibido en superficies nuevas |

### 19.2 Trazos, dashes y radios

| Magnitud | Valor | Significado |
| --- | --- | --- |
| stroke entidad / estado / enlace / estructural | 1.5 / 1.2 / 1 / 1.2 | base |
| stroke estado inicial | 3 | designación inicial |
| estado final | doble contorno (fill + rect interno stroke 1, padding 3) | designación final |
| stroke cosa refinada | 4 | contorno grueso de refinamiento |
| arco de abanico | 1.5, dash `4 1` | XOR=1 arco r30; OR=2 arcos r30/35 |
| afiliación ambiental | dash `8 4` | contorno discontinuo |
| proxy de extracción | dash `5 4` | enlace de vista inter-OPD |
| simulación: proceso activo / involucrada / estado current / estado resultado / enlace activo | dash `6 3` sw3 / `4 3` sw2 / `4 2` sw2 / `7 3` sw2 / `7 4` linecap round | canal runtime (crimson; resultado en color de objeto) |
| radio estado / badge control / chip `⋯N` | 8 / 9 (círculo 18×18) / alto÷2 | rountangle / letra `c·e·¬` / supresión |
| sombra física | dropShadow dx6 dy6 blur2 `rgba(23,21,17,0.68)` | esencia física |
| hit-area de enlace | wrapper transparente 15 px | interacción |

### 19.3 Marcadores (paths literales)

| Marcador | Geometría | Relleno |
| --- | --- | --- |
| Punta transformadora (consumo/resultado/efecto; terminal del rayo de invocación) | `M 0 0 L 23 8 L 12 0 L 23 -8 Z` (swallowtail, bbox 23×16) | paper, stroke ink |
| Piruleta agente / instrumento | `M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0` (palito 7 + círculo r5) | ink / paper |
| Triángulo estructural | `standard.Polygon` 30×30, refPoints `15,0 30,30 0,30` | agregación: ink; generalización: paper; exhibición: + triángulo interior 12×12 ink en (+9,+12); clasificación: + círculo r4 ink en (15,20) |
| Tagged unidireccional / bidireccional | polyline `0,0 20,-10 0,0 20,10` / arpón `0.5,0 20,±10` | abierto |
| Sobretiempo / subtiempo | polyline `4,10 13,-10` / `4,10 13,-10 8.5,0 17,0 13,10 22,-10` | trazo ink |
| Rayo de invocación | 4 vértices, offset perpendicular `min(22, max(12, len·0.08))`; autoinvocación: lazo a ±35°, pico `max(56, h·0.55)` | — |
| Glifos de estado | inicial: stroke 3 · final: doble contorno · default: flecha abierta entrante (vigente `↗`, GAP-OPD-DEFAULT-GLIFO) · current **declarado**: `●` interno en la cápsula (vigente; canon = glifo externo reservado pin, GAP-OPD-CURRENT-GLIFO; la marca de runtime NO es glifo: es anillo del canal de simulación) | — |

### 19.4 Z-order y tipografía

| Capa | z | Texto | Valor |
| --- | --- | --- | --- |
| contorno de refinamiento / proxy | 0 | rótulo de cosa | Inria Serif 17, proceso itálica |
| autoinvocación / enlace / bus | 1 / 4 / 4 | etiqueta de estado | serif itálica 13 |
| overlay abanico | 5 | etiquetas de enlace (verbo, multiplicidad, ruta, demora) | serif 11-12, ink/inkMid |
| entidad / triángulo / ramas | 10 / 12 / 13 | identificador `o.NN` | JetBrains Mono 9.5 (UI) |
| enlace a estado | 20 | badge control | serif 12 |
| halo selección / halos sim / halo selección de estado (UI) | 30 / 33-36 / 37 | wrap | >18 chars envuelve a ~132 px, sin elipsis |

Consecuencia RENDER: reproducir la **estructura** de cada marca (conteo de arcos,
relleno/vacío, interior triangular/circular, punta cerrada vs abierta vs arpón, dash
vs continuo, doble borde, stroke grueso); hex y px son libres si la distinción se
preserva «a cualquier zoom».

## 20. §19 Equivalencia bimodal y frontera modal

- **R-OPD-BIM-1** — OPD y OPL son dos proyecciones del mismo hecho: toda afirmación
  gráfica es reproducible como OPL y toda oración OPL representable como constructo OPD;
  el constructo básico es la unidad de correspondencia; clausura local a cada modelo.
  · inferido DEBE · GENERAR-OPL + PARSEAR-OPL + MODELO-DATOS (un solo modelo, dos vistas).
- **R-OPD-BIM-2** — El renderer nunca es fuente de verdad: proyecta el modelo; toda
  mutación entra por operaciones de modelo; celdas del motor gráfico son adaptador
  desechable. «Un parse sin firma OPD canónica se rechaza, no se inventa grafo.»
  · inferido DEBE · MODELO-DATOS (arquitectura) + PARSEAR-OPL (rechazar).
- **R-OPD-BIM-3** — Frontera semántico/ornamental. Semánticos (su cambio DEBE cambiar el
  hecho y su OPL): forma, contorno, sombra física, marcador/decoración de extremo,
  topología interna del triángulo, anclaje a estado, dirección del enlace, designaciones
  de estado, verticalidad de subprocesos en descomposición. Ornamentales (no emiten OPL):
  grid, handles, sombras decorativas, tokens de simulación, notas, alias decorativos,
  identificadores `o.NN`, etiqueta `SDx.y`, numeración, posición no-vertical-temporal,
  jumpover, estilado autoral. · DEBE · GENERAR-OPL (qué cambia OPL y qué no).
- **R-OPD-BIM-4** — Asimetrías declaradas: semi-plegado y marcas runtime sin plantilla
  OPL; perseverancia sin glifo. · inferido · GENERAR-OPL (no emitir).
- **R-OPD-BIM-5** — Equivalencias que el resaltado cruzado DEBE respetar:
  resultado-simple ≡ fan XOR por estados (V-19); bidireccional con tags idénticos ≡
  recíproco (V-56); todos-los-estados ≡ estados-suprimidos (mismo hecho, distinta vista).
  · DEBE · RENDER (resaltado) + GENERAR-OPL.
- **R-OPD-BIM-6** — La tabla de bisimetría de `reglas-opm-estrictas-es §9.2` es el gate
  mínimo del roundtrip OPD↔OPL: toda construcción visual emite la plantilla indicada y
  toda plantilla reconstruye el mismo hecho nuclear. · inferido DEBE · GENERAR-OPL +
  PARSEAR-OPL (tests de roundtrip).

## 21. §20 Simulación visual

- **R-OPD-SIM-1** — Proceso en ejecución DEBE exhibir marca reservada de actividad
  distinta de toda marca persistente (en especial del contorno grueso). Realización:
  halo elipse crimson sw3 dash `6 3` (z=35). · DEBE · RENDER (runtime).
- **R-OPD-SIM-2** — Estado actual de runtime con canal reservado, distinto de
  inicial/final/default/`Current` declarado; la serialización DEBE distinguir designación
  declarada vs marca de ejecución. Realización: anillo crimson dash `4 2` sw2 sobre la
  cápsula; estado inicial = pin gota oliva-sim `#6B7B2A` desplazado; z 33-37. · DEBE ·
  RENDER + MODELO-DATOS (estado de simulación fuera del modelo).
- **R-OPD-SIM-3** — Tokens de flujo sobre enlaces activos son runtime: NO pertenecen a
  canon-diagrama salvo snapshot de simulación declarado; no confundibles con piruletas/
  handles. Realización: token circular r5-6 animado; enlace activo crimson +1.5.
  · inferido NO · RENDER.
- **R-OPD-SIM-4** — Estados operacionales adicionales (suspendido, completado reciente)
  con marcas propias; suspendido ≠ inactivo en snapshot. Síncrono: máximo una marca
  activa por hilo visible; asíncrono: múltiples. Headless no altera la gramática.
  · inferido DEBE · RENDER (runtime).
- **R-OPD-SIM-5** — Semántica visible: consumido desaparece al INICIO del proceso;
  afectado sale del estado de entrada al inicio y entra al de salida al completarse
  (en transición = indeterminado); resultante existe al completarse; condición incumplida
  = paso omitido en la traza; bucle sin salida se corta por límite de seguridad con
  diagnóstico visible. · inferido DEBE · OPERACIÓN (motor de simulación) + RENDER.
- **R-OPD-SIM-6** — El estado de runtime NO se persiste como canon salvo snapshot
  declarado. · NO (inferido NO DEBE) · MODELO-DATOS + EXPORT.
- **R-OPD-SIM-7** — Si un habilitador deja de existir durante la ejecución, el proceso se
  detiene y DEBE perder su marca de actividad; el afectado queda indeterminado salvo
  excepción. · DEBE · OPERACIÓN + RENDER.

Nota: ninguna regla dice explícitamente «la herramienta DEBE tener simulación»; lo
implica R-OPD-CAN-5 (modo runtime). Ver G-11.

## 22. §21 Exportación canónica

- **R-OPD-EXP-1** — Tres familias de salida: `canon-documento` (por modelo: portada,
  índice, árbol, diagramas, OPL, diccionarios, vistas derivadas), `canon-diagrama` (por
  OPD, preferentemente vectorial, sin handles/grid/overlays/toasts/chrome),
  previsualización raster (no canónica). Si un perfil rasteriza, declara resolución
  mínima que preserve dash, contornos, triángulos y rótulos. · inferido DEBE · EXPORT.
- **R-OPD-EXP-2** — Export parcial declarado como tal e identifica el subconjunto;
  watermarks/overlays no ocluyen primitivas; recursos dependientes (bitmaps, sub-modelos,
  descripciones, código) se embeben, se referencian persistentemente o se declara su
  ausencia; export de modelo compuesto declara cómo resuelve referencias externas.
  · inferido DEBE · EXPORT.
- **R-OPD-EXP-3** — En export canónico el estilado autoral se normaliza (salvo perfil
  contrario); rótulos en negro; viewport auto-ajustado. · inferido DEBE · EXPORT.
- «Estado opforja» (triple superficie del gate de densidad, `mapaExport.ts`,
  `normalizarColoresSvg`, `removerChromeEdicionSvg`, residual de exención no realizada):
  circunstancial.

## 23. §22 Trazabilidad y gaps (resumen)

- **R-OPD-AUD-1** — Toda fila con `GAP-OPD-*` DEBE resolverse en la auditoría de
  alineación (cerrar código, corregir ui-forja, añadir test o reclasificar). · DEBE ·
  NO-APLICA (gobierno de proyecto).
- Leyenda: `alineado` · `alineado-variante` · `GAP-código` · `GAP-doc` · `GAP-VERIFY`.
- Tabla maestra §22.1: mapa regla→archivo de la app v0 (`composers/entidad.ts`,
  `linkAssets.ts`, `markers.ts`, `abanicoOverlay.ts`, etc.). NO-APLICA a un rediseño
  salvo como lista de lo que v0 ya cumplía.
- Índice de GAPs (§22.2), con lo que significa para la herramienta nueva:

| GAP | Descripción (resumen) | Lectura para el rediseño |
| --- | --- | --- |
| GAP-OPD-AGENTE-HUMANO | humanidad del agente aproximada por esencia física | decidir: flag «humano» en objeto o proxy declarado |
| GAP-OPD-DEFAULT-GLIFO | `↗` en vez de flecha abierta entrante | implementar la flecha canónica desde el inicio |
| GAP-OPD-CURRENT-GLIFO | `●` interno en vez de pin externo | implementar pin externo o declarar variante |
| GAP-OPD-VERIFY | cobertura matriz de distribución no confirmada | cubrir §10.2 con tests |
| GAP-OPD-FAN-M | sin anotación m de m-de-f | implementar o declarar fuera de alcance |
| GAP-OPD-COLECCION-INCOMPLETA | barra bajo triángulo no realizada | implementar (EDIT-6 lo exige) |
| GAP-OPD-DURACION-ELIPSE | duración sobre enlace en vez de en elipse | implementar en la elipse |
| GAP-OPD-CATEGORIAS-OPD | categoría jerárquica implícita; Mapa del Sistema efímero | simplificar categorías |
| GAP-OPD-VERIFY-IDS | ids de OPD posicionales en el DSL | UUID de OPD desde el inicio |
| GAP-OPD-SUBMODELO-REF | referencia viva a sub-modelos no implementada | fuera de alcance mínimo |
| GAP-OPD-DUPLICADO | silueta de duplicado en mismo OPD no soportada | implementar o prohibir duplicado |
| GAP-OPD-FEEDBACK-LEGACY | feedback de modo enlace con paleta OPCloud | usar canal UI desde el inicio |
| GAP-OPD-DRAG-TRIANGULO | arrastre de extremos estructurales roto | implementar reanclaje directo |
| GAP-OPD-PROXY-TOKEN | gris hex directo fuera de tokens | tokenizar |
| GAP-OPD-UIFORJA-08a/b/c | ui-forja/08 contradecía estado-pill, marcadores, straight-only | NO-APLICA (documento externo) |

- Filas «no-canonizado»: diagrama de vida útil (lifespan, vista derivada opcional) y port
  folding (extensión futura). NO-APLICA.
- §22.3 Cobertura inversa: superficie auditada `app/src/render/jointjs/**`,
  `app/src/canvas/**`; «`GAP-spec` = 0». NO-APLICA.

## 24. §23 Invariantes

### 24.1 Prescriptivos del documento (NO-APLICA a la herramienta)

R-§23-PRESC-CONS (consistencia interna), R-§23-PRESC-AUTO (auto-suficiencia),
R-§23-PRESC-CIRC (no-circularidad), R-§23-PRESC-LANG (es-CL; anglicismos inevitables
`swallowtail`, `marker`, `fan`), R-§23-PRESC-ENF (toda tabla de validación con columna
`Enforcement`), R-§23-PRESC-INTEG (tríada Invariantes→Validación→Migración).

### 24.2 Visuales del dominio (textual; aplican a la herramienta)

| Invariante | Enunciado |
| --- | --- |
| **R-§23-OPD-VOCAB** Vocabulario visual cerrado | Formas, contornos, sombras, marcadores y marcas pertenecen a un conjunto cerrado; ningún glifo libre es gramática. |
| **R-§23-OPD-TOPO** Color informativo, topología normativa | La semántica vive en forma, contorno, sombra, dirección y topología interna; nunca solo en el color. |
| **R-§23-OPD-CANAL** Canales reservados | Gramática, simulación, validación y UI usan canales separados sin ambigüedad; reutilizar un recurso sin distinción perceptible es no conforme. UI y simulación PUEDEN compartir el hue crimson porque se separan por dash, glifo, posición y z, y porque la simulación no persiste en canon (snapshot declarado). |
| **R-§23-OPD-EXPORT** Canon por persistencia | Es gramática lo que persiste en export canónico declarado; lo demás es afordance. |
| **R-§23-OPD-TIEMPO** Verticalidad temporal | En descomposición de proceso la coordenada vertical ES el tiempo; todo layout la preserva. |
| **R-§23-OPD-PROY** Proyección, no verdad | El renderer proyecta el modelo; identidad ≠ etiqueta de navegación ≠ posición. |
| **R-§23-OPD-BIM** Dualidad bimodal | Todo hecho visual semántico tiene espejo OPL salvo asimetrías declaradas (semi-plegado, runtime). |

Consecuencia: R-§23-OPD-TIEMPO implica que el auto-layout NO DEBE reordenar
verticalmente subprocesos sin que el usuario lo entienda como cambio del hecho
(orden temporal).

## 25. §24 Validación (verificación del producto)

Enforcement: `schema`, `lint`, `runtime`, `eval`, `manual`. Tabla (resumen):
geometría y marcas → unit sobre composers/markers (eval); leyes de proyección y undo
(`app/src/leyes/*.test.ts`, eval); refinamiento y distribución → unit de kernel (eval);
interacción y canvas → e2e Playwright (eval); estética y canal UI →
`bun run design:governance` (lint); conformidad in-vivo → `bun run visual:audit` /
`visual:deep` (runtime); AP → diagnóstico del kernel + bloqueos (runtime); GAPs →
auditoría (manual); KORA/MD → `kora check --strict` (lint, manual).

- **R-§24-ENF-1** — Toda fila de tabla de validación DEBE declarar su `Enforcement`.
  · DEBE · NO-APLICA (documental).

Lectura para la herramienta: el canon espera tests unitarios de geometría de marcas,
tests de kernel de refinamiento y tests e2e de interacción; los nombres de scripts y
rutas son circunstanciales de v0.

## 26. §25 Migración (NO-APLICA salvo lo indicado)

- Historial de versiones 1.0.0 → 1.4.0 (1.4.0: Bocetos / Integrar como… / Devolver a
  Bocetos; Taller reservado a Apunte; canonicidad delegada a R-CAN-BOCETO-1..4).
- **R-§25-MIG-1** — La implementación DEBE alinearse contra esta spec usando §22; toda
  divergencia es deuda. · DEBE · NO-APLICA directo (proceso), pero implica que el rediseño
  parte sin los GAP de v0.
- **R-§25-MIG-2** — `ui-forja/08` DEBE corregirse (cumplida la mitad documental).
  NO-APLICA.
- **R-§25-MIG-3** — Los `GAP-OPD-*` se cierran vía código+tests. · DEBE · NO-APLICA.
- **R-§25-DEP-1/2** — Se deprecia consultar fuentes dispersas; NO SE ADMITE redactar
  reglas visuales nuevas fuera de esta spec. NO-APLICA (gobierno documental).

## 27. Apéndices

- **A. Mapa de cobertura V-0..V-263**: NO-APLICA (trazabilidad con opd-es, fuera del
  canon entregado). Declara no operacionalizadas: capa computacional plena
  (V-163..V-175), vistas de requisitos completas, perfil v1-compat. Consecuencia: la
  herramienta NO necesita slots/código computacional ni vistas de requisitos completas.
- **B. Ejemplo end-to-end «Lavado de Platos»** (normativo como caso de prueba visual):
  SD: **Usuario Doméstico** (físico sistémico: sombra, trazo continuo) maneja *Lavar
  Platos* (piruleta negra); *Lavar Platos* requiere **Lavavajillas** (piruleta blanca) y
  consume **Jabón** (swallowtail hacia la elipse); afecta **Conjunto de Platos**
  (swallowtail doble) con estados `sucio` y `limpio` (`sucio` inicial = borde grueso).
  SD1: *Lavar Platos* contenedor (stroke 4): *Cargar* arriba, *Limpiar* al medio,
  *Descargar* abajo (tiempo ↓); efecto escindido `sucio`→*Cargar* y *Descargar*→`limpio`;
  **Lavavajillas** (externo) distribuye su piruleta blanca a los tres; el evento del
  usuario no cruza la frontera. Chip `⋯N` en SD si `limpio` se suprime allí y se expresa
  en SD1. OPL espejo en `spec-forja-opl-es` Apéndice A. · Uso: escenario e2e / fixture.
  (Nota: el ejemplo menciona «el evento del usuario» pero el SD descrito no marca `e`
  en el agente; ver G-12.)
- **C. Índice de IDs**: CAN-1..5, COSA-1..9, EST-1..10, TR-1..8, HAB-1..4, CTL-1..12,
  STR-1..13, INV-1..9, MUL-1..5, REF-1..20, LAY-1..10, ROT-1..9, UI-1..6, INT-1..3,
  EDIT-1..7, CFG-1..4, VAL-1..6, BIM-1..6, SIM-1..7, EXP-1..3, AUD-1, R-§23-*,
  R-§24-ENF-1, R-§25-*. Verificado: todos los IDs del índice aparecen en el cuerpo.

## 28. Puente OPL citado desde esta spec (correspondencias textuales)

| Constructo OPD | Superficie OPL citada | Sede |
| --- | --- | --- |
| Esencia / afiliación | oración de esencia/afiliación | opl §2.7/§2.8 |
| Estados visibles / chip `⋯N` | enumeración de visibles; `…, y otros estados` (D6) | opl §2.3/§7.4 |
| T1 / T2 / T3 | `consume` / `genera` / `afecta` o `cambia de … a` | opl §3 |
| TS4 / TS5 | fragmentos `de` / `a` | opl §3.4-§3.6 |
| H1 / H2 / HS | `maneja` / `requiere` / + `en \`estado\`` | opl §4 |
| Ruta | `Por ruta L,` | opl §11 |
| Demora | `después de <demora>` (parser acepta legacy sin tilde) | opl §5.4 |
| Duración (unidad) | metavariable `<unidad>` | opl §5.3 |
| Multiplicidad | `?`↔`un/una opcional`, `*`↔`opcional (cero o más)`, `+`↔`al menos un/una`, sin símbolo↔implícito | opl §10.1 |
| Listas de rangos | `[1..10],[20..30]` sin espacio | opl §10.2 |
| SE2 / SE4-SE5 nulos | `se relaciona con` / `se relacionan` | (tabla §7.2) |
| Persistente canónico | `P cambia A de s a s` | (R-OPD-STR-10) |
| Requisito | tagged `satisface` | (R-OPD-ROT-6) |
| Orden estructural | `ordered` / `ordered by` + criterio | reglas R-OPL-SE-4 |
| Refinamiento | `se descompone en` / `se despliega en` / `se refina por …` | opl §7 |
| Plegado parcial | `al menos otro/a` | opl §7.2/§12 |
| Estereotipo | mención `«Nombre»` PUEDE (opforja v1 la omite) | R-VIS-STEREO-1 |
| Semi-plegado, runtime, perseverancia | sin OPL | §19 BIM-4 |

## 29. (a) Sobreingeniería o circunstancial para una herramienta simple

- **S-01 Referencias a la app v0 y su historia**: todos los párrafos «Realización
  opforja», «Estado opforja», la tabla maestra §22.1, commits (`3a2db18c`, `2766eb74`,
  `58b752e5`, `ce690057`), BUG-fb6c2c, rutas `app/src/render/jointjs`, nombres de
  símbolos (`gateDensidadCanonica`, `establecerRefinamiento`, `adoptarOpd`…), y
  primitivas JointJS (`standard.Rectangle`, `standard.Polygon`, `linkPinning`,
  `jumpover`, `manhattan`, `embed`+`restrictTranslate`, `distance:0.8`). Informativo; un
  rediseño no está atado a JointJS ni a esos nombres.
- **S-02 Estereotipos con catálogo, vitrinas, injerto 1-clic, captura de selección y
  contrato de import duro** (R-OPD-ROT-6). Extensión declarada PUEDE; `<<Requirement>>`
  con 5 atributos.
- **S-03 Anclaje a Pieza / Centinela de Drift / Soltar / Calcar / `frozenAtHash` /
  `frozenAtPieza` / RADIO-1** (R-OPD-ROT-9). Extensión declarada; depende de «biblioteca
  gobernada» fuera del canon.
- **S-04 Composición inter-modelo en DAG, URIs cross-model, ciclo de carga de 3 estados,
  referencia viva** (R-OPD-REF-18, GAP-OPD-SUBMODELO-REF, par Sub-modelo↔Desconexión).
- **S-05 Bocetos / Integrar como… / Devolver a Bocetos / banda «Bocetos» / espacios
  Taller-Modelos / régimen Apunte vs Modelo / Graduar** (R-OPD-REF-14/20, ROT-2).
  Extensión declarada con gate delegado.
- **S-06 Tres categorías de OPD** (jerárquico / vista anclada con Sub-modelo, Mapa del
  Sistema, Vista de Requisitos / vista ad hoc) (R-OPD-REF-16). Para lo mínimo basta
  «jerárquico».
- **S-07 Cinco modos visuales** (R-OPD-CAN-5) y **dos perfiles + raster + snapshot de
  simulación** (CAN-1, EXP-1, SIM-3): un producto simple puede reducirse a «edición» vs
  «export» (+ runtime si hay simulación), pero el DEBE nombra cinco.
- **S-08 Cinco familias de validación** (R-OPD-VAL-2): basta error vs advertencia con
  categoría.
- **S-09 Estilado autoral, bitmaps decorativos, modo imagen, alias/descripciones visibles**
  (R-OPD-ROT-8, CFG-2): todo PUEDE.
- **S-10 Detalle de interacción tipo OPCloud**: 8 handles, 12 anclas, marquee
  Shift/Ctrl+Shift, smart-guides, jumpover (>35 enlaces), carriles estructurales 44/50 px,
  re-permutación ≤7 enlaces, layout radial «traer conectados» (R-OPD-UI-3, LAY-6/7,
  REF-19).
- **S-11 Paleta legacy OPCloud** (`#70E483 #3BC3FF #586D8C #fdffff`) solo compat: un
  producto nuevo no la necesita.
- **S-12 Precedencia sobre `ui-forja/GOVERNANCE.md`** y GAP-OPD-UIFORJA-08a/b/c,
  R-§25-MIG-2: documento externo al canon entregado.
- **S-13 Extensiones opcionales de baja prioridad**: stick figure (COSA-9), negación `¬`
  (CTL-5), `ordered` (STR-5), tasa de transformación (MUL-5), expresiones paramétricas de
  multiplicidad `3*n; n<=4` con unicidad global de parámetros (MUL-2), m-de-f (CTL-9),
  objeto-reloj (INV-8), semi-plegado (STR-11/12).
- **S-14 Simulación visual completa** (§20: halos, tokens animados, modos
  síncrono/asíncrono, suspendido, límite de bucle): pesada para una herramienta simple;
  ver G-11 sobre si es obligatoria.
- **S-15 Aparato documental KORA**: `Rationale:` vs `Traces to:`, niveles de canonicidad,
  §23.1, §24 (`kora check --strict`, `design:governance`, `visual:audit`), §25,
  Apéndice A (V-0..V-263), referencias a `opd-es`, `opm-es`, `opm-categorial-es`, libro
  Dori, figuras ISO: NO-APLICA a la herramienta.
- **S-16 Dimensión base 135×60 «herencia OPCloud», radios de arco r30/35, offsets del
  rayo**: valores de implementación, no obligación.

## 30. (b) GAPs y contradicciones internas detectadas

- **C-01 Autocontención declarada vs delegación real**: l.26 dice que un agente conforme
  NO DEBE necesitar abrir `reglas-opm-estrictas-es`; pero R-OPD-TR-8 (R-PROC-2A/5..7),
  R-OPD-INV-9 (R-INV-2D/2B, R-IDP-0A), R-OPD-REF-14/20 (R-CAN-BOCETO-1..4, «régimen
  Apunte/Modelo», «Graduar»), R-OPD-VAL-5 (catálogo AP completo en reglas §11.1),
  R-OPD-BIM-6 (tabla de bisimetría reglas §9.2) y R-OPD-LAY-2 (R-LAY-1) dependen de
  reglas no transcritas. Dentro del canon de 4 documentos es resoluble (reglas está en el
  canon), pero la spec no es autocontenida.
- **C-02 Abanicos de habilitadores**: el frontmatter (v1.4.0) dice que incorpora
  «abanicos convergentes de habilitadores» y «ruta sobre habilitadores»; el cuerpo
  (R-OPD-CTL-7) dice «agente e instrumento solo admiten divergente». Contradicción
  directa sobre qué abanicos de habilitadores permitir/impedir. Además, con la dirección
  objeto→proceso, «divergente» = un objeto habilita N procesos, lo que excluye «A o B
  maneja P» (N agentes → 1 proceso). Debe resolverse contra reglas-opm-estrictas-es.
- **C-03 Frontmatter desactualizado respecto de 1.4.0**: la descripción del frontmatter
  (enmienda 1.3.0) habla de «OPD suelto padreId:null≠raiz, verbo «adoptar»», «banda
  «Taller»» y «raiz «Hoja» como proyeccion de navegacion»; el cuerpo 1.4.0 (R-OPD-REF-20,
  ROT-2, §25) usa «Bocetos», «Integrar como…», reserva «Taller» para Apunte y prohíbe
  renombrar la raíz «Hoja». Además R-OPD-REF-20 cita un working-artifact
  `2026-07-27-...` no mencionado en el frontmatter.
- **C-04 Unicidad de rol vs abanicos por estado**: R-OPD-HAB-4 ordena impedir el segundo
  enlace procedimental sobre el mismo par objeto-proceso, y R-OPD-TR-5 declara inválido
  resultado+resultado; pero R-OPD-CTL-11/BIM-5 legitiman un abanico XOR de resultados
  con estado especificado «uno por estado» sobre el mismo objeto y proceso, y TS3 es un
  par de dos enlaces. Queda implícito que el «par» es (estado, proceso) o que el abanico
  XOR/el par TS3 cuentan como un solo hecho; no está escrito.
- **C-05 Resultado+consumo**: R-OPD-TR-5 dice «resultado+consumo sobre el mismo objeto
  como un solo hecho es inválido»; R-OPD-REF-13 dice «resultado×consumo=efecto (solo con
  continuidad de identidad/estados)» al recomponer. Compatible solo si TR-5 se lee como
  edición directa y REF-13 como vista abstraída; no se explicita.
- **C-06 Rutas rectas vs no atravesar cosas**: R-OPD-LAY-4 fija procedimentales «rectos
  (sin router)» y R-OPD-LAY-1 exige que «los enlaces no atraviesan áreas ocupadas por
  cosas». Un enlace recto sin router puede atravesar una cosa; no se dice cuál cede.
- **C-07 Fuerza semántica de 12 niveles incluye combinaciones imposibles**: R-OPD-REF-13
  cruza `consumo = resultado > efecto > agente > instrumento` con `evento > sin control
  > condición` (4×3 = 12), pero el resultado no admite `e`/`c` (R-OPD-CTL-3); los niveles
  «resultado con evento/condición» no existen.
- **C-08 Perfiles de export inconsistentes**: R-OPD-CAN-1 exige dos perfiles
  (`canon-diagrama`, `canon-documento`); «Estado opforja» nombra un tercero
  `intercambio`; R-OPD-EXP-1 dice «tres familias de salida» siendo la tercera
  «previsualización raster (no canónica)»; R-OPD-SIM-3/SIM-6 añaden «snapshot de
  simulación» declarado. No hay lista cerrada de perfiles ni se define el formato de
  intercambio (JSON del modelo).
- **C-09 Chip `⋯N` con estatus condicional**: R-OPD-EST-9 dice que el chip «pertenece a
  la gramática auxiliar si persiste en canon» sin decidir si persiste; por R-OPD-CAN-1/2
  esa decisión es obligatoria. Lo mismo aplica al chip de Anclaje (ROT-9) y a la silueta
  de duplicado (REF-17).
- **C-10 Tolerancia de paralelismo no cuantificada**: R-OPD-INV-2/REF-2 hacen semántica
  la coordenada Y («misma altura (con tolerancia)») sin fijar la tolerancia, siendo un
  canal que cambia el hecho y el OPL (R-OPD-BIM-3). La herramienta necesita un criterio
  determinista (p. ej. orden declarado explícito, que INV-9 sugiere con «el orden es
  atributo declarado»); entre «Y determina» y «orden declarado que la banda Y realiza»
  hay tensión sobre cuál es la fuente de verdad.
- **C-11 Duración: ubicación y «Rate»**: R-OPD-INV-6 pone la duración dentro de la elipse;
  R-OPD-INV-7 registra que v0 la pone sobre el enlace junto con `Rate =`, mezclando
  duración de proceso (propiedad del proceso) con tasa de transformación (propiedad del
  enlace, R-OPD-MUL-5). Además el enum de unidades está en inglés (`ms, sec, min, hour,
  day, week, month, year`) en una spec es-CL, remitiendo la superficie a OPL §5.3.
- **C-12 Humanidad del agente sin soporte en el modelo**: R-OPD-HAB-1 y AP-05 exigen
  agente exclusivamente humano, pero el modelo de cosas (§2: forma, esencia, afiliación)
  no tiene atributo «humano»; el proxy «esencia física» es admitido solo como GAP.
  Requiere decisión de modelo de datos.
- **C-13 Tokens fuera de paleta**: R-OPD-SIM-2 usa «pin gota oliva-sim `#6B7B2A`» y el
  proxy usa `#98a2b3`; ninguno está en §18.1 (el segundo se reconoce como
  GAP-OPD-PROXY-TOKEN; el primero no).
- **C-14 Crimson compartido UI/simulación**: R-OPD-UI-1 reserva crimson para UI y lo
  prohíbe como marca semántica; §20 usa crimson para simulación. R-§23-OPD-CANAL lo
  admite por separación de dash/glifo/z y no persistencia; coherente pero frágil (el
  «estado resultado» de simulación va «en color de objeto», otro canal reutilizado).
- **C-15 Orden de numeración**: R-OPD-TR-8 aparece antes de TR-6/7; R-OPD-STR-13 antes
  de STR-7; R-OPD-INV-9 antes de INV-6..8. Solo cosmético, pero el índice sugiere orden.
- **C-16 Simulación: ¿obligatoria?**: ver G-11 abajo.
- **C-17 Devolver a Bocetos**: «deja `padreId = null` solo en la raíz elegida» es ambiguo
  (¿raíz del subárbol devuelto?); y «dueño único» se usa sin definir en esta spec.
- **C-18 Excepción: familia sin marcador de extremo definido**: §4.1 la declara familia
  autónoma proceso→proceso, pero §18.3 solo da las barras `/`, `//` (y «variante
  combinada under+over» sin path) y no dice si el enlace de excepción lleva punta en el
  manejador ni si admite XOR/OR (R-OPD-CTL-8 no la lista).
- **C-19 Precedencia «esta spec manda» vs «queda bajo reglas»**: consistente en jerarquía,
  pero la frase «Esta spec es SSOT primaria de la modalidad OPD operativa» junto a
  «ante conflicto … prevalece [reglas]» y «NO DEBE relajarla [opd-es]» deja a opd-es
  (fuera del canon entregado) como límite superior; bajo la interpretación de alcance del
  dueño, ese límite no es verificable.

GAPs de cobertura (el canon calla y la herramienta necesita decidir):

- **G-01** Formato del perfil de intercambio/persistencia del modelo (JSON) no
  especificado aquí.
- **G-02** Criterio geométrico de «colisión» y de oclusión (LAY-1) no cuantificado salvo
  44/50 px para estructurales.
- **G-03** Cómo se marca/decide «humano» (ver C-12).
- **G-04** No se especifica la marca de ruta/escenario más allá de la etiqueta de texto
  ni cómo se elige escenario en simulación.
- **G-05** Parámetros de m-de-f y probabilidad: dónde viven (enlace vs abanico) no se
  define como modelo de datos; el «abanico» no está definido como entidad del modelo
  (¿agrupación explícita o inferida por extremo común + tipo?).
- **G-06** Undo/redo: §24 menciona «leyes de proyección y undo» como verificación, pero
  ninguna regla R-OPD exige undo.
- **G-07** Persistencia del chip `⋯N` (ver C-09).
- **G-08** Plegado parcial vs semi-plegado: §7.3 los trata como casi sinónimos
  («Realización opforja (plegado parcial)») pero uno emite OPL (`al menos otro/a`) y el
  otro no; la frontera no está definida.
- **G-09** Posición de `e`/`c` en el efecto de entrada estado→proceso: reconocido como
  residual en §22.1 (heurística por tipo, no por dirección).
- **G-10** Tolerancia de paralelismo (ver C-10).
- **G-11** Ninguna regla obliga explícitamente a tener simulación; CAN-5 exige un modo
  runtime y §20 usa DEBE condicionado. Para una herramienta simple, la decisión de
  incluir simulación debe tomarse contra la metodología (fuera de este tramo).
- **G-12** Apéndice B menciona «el evento del usuario no cruza la frontera» pero el SD
  descrito no declara `e` en el enlace de agente; el ejemplo queda subespecificado.

## 31. Núcleo mínimo derivado (lo que el canon OPD exige a la herramienta)

Sin extensiones declaradas ni detalle de v0:

1. Modelo: Cosa (objeto|proceso; esencia física|informacional; afiliación
   sistémica|ambiental; nombre; alias opcional; unidad opcional; duración en procesos)
   separada de Apariencia por OPD (posición, tamaño, supresión local de estados, plegado).
   Estado atómico con inicial/final (0..*), por defecto (0..1), current declarado (0..1),
   supresión global. OPD con UUID, `padreId`, cosa refinada, tipo de refinamiento.
   Enlace con familia (6, cerradas), tipo, extremos (cosa o estado), modificador
   (`e`|`c`|ninguno), multiplicidades, etiqueta, etiqueta de ruta, demora (invocación),
   probabilidad (rama de abanico XOR), operador de abanico (AND/XOR/OR).
2. Render de las 8 representaciones, rountangles internos con designaciones, swallowtail
   (uno/dos extremos), piruletas llena/vacía, letras `e`/`c` minúsculas cerca del
   proceso, rayo de invocación y autoinvocación, barras `/` `//`, arcos XOR (1) y OR (2)
   en el extremo común, cuatro triángulos con topología interna, barra de colección
   incompleta, tagged con punta abierta y arpones, multiplicidad junto al extremo,
   contenedor in-zoom con contorno grueso, chip `⋯N`, duración en la elipse, rótulos
   íntegros sin elipsis.
3. Impedir (edición): firmas ilegales (solo ofrecer lo legal), efecto sobre objeto sin
   estados, estados en procesos o flotantes, resultado a estado inicial, `e`/`c` fuera de
   Pre(P) y en abanicos de resultado/invocación, segundo rol sobre el mismo par,
   perseverancia distinta en estructurales no-exhibición, tagged bi/recíproco con estado
   solo-destino, consumo/resultado al contorno de descompuesto, evento sistémico cruzando
   frontera, ciclos de refinamiento, instancia visual objeto↔proceso, externo refinado
   desde hijo, multiplicidad en extremo proceso, excepción con firma no proceso→proceso,
   cambio silencioso de tipo por OPL, reescritura silenciosa de nombre.
4. Advertir: proceso sin transformación, refinamiento de 1 hijo (bloquea export
   canónico), firma de frontera no preservada, SD sin exactamente un proceso sistémico,
   21-25 cosas (bloquea export canónico >25), suma de probabilidades ≠ 1, manejador de
   excepción no ambiental o sin cota, duplicación inicio/fin, proceso preservante como
   elipse, rayo redundante con orden vertical, mover externo dentro del contenedor,
   inconsistencias inter-OPD (DEBERÍA).
5. Operaciones: descomponer (in-zoom) y desplegar (unfold) con copia de externos,
   distribución/escisión §10.2 y migración al primero/último; recomposición por fuerza
   semántica; supresión de estados global/local con unión entre hijos; reanclar extremos
   (incluido estructural triangular); mover entre OPDs preservando identidad; centrar
   vista al cambiar de OPD; drag de subproceso confinado al contenedor.
6. Bimodal: OPL generado desde el modelo (no desde el render), resaltado cruzado por
   referencia tipada, click en OPL enfoca sin mutar, selección filtra OPL; frontera
   semántico/ornamental de R-OPD-BIM-3; roundtrip por tabla de bisimetría de reglas §9.2.
7. Export: `canon-diagrama` SVG por OPD sin UI/grid/chrome, rótulos negros, viewport
   ajustado, estilado normalizado; `canon-documento` por modelo (OPD + OPL como mínimo);
   raster no canónico con resolución suficiente; gates (densidad, refinamiento trivial).
8. Canales: UI en canal reservado propio (no reutiliza dash, grosor, sombra, piruletas,
   triángulos, arcos); validación en panel (canvas limpio); simulación (si existe) en
   canal propio no persistente.
