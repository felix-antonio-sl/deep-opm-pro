---
urn: urn:fxsl:kb:spec-forja-opd-es
nombre: spec-forja-opd-es
version: 1.4.0
estado: publicado
descripcion: "Spec-forja OPD — SSOT de la realización visual de OPFORJA: render, canvas y materialización de la gramática OPD en el modelador deep-opm-pro."
fuente: "SSOT OPM v1.1.2. Re-sincronizado desde la bestia (~/kora) artifacts/knowledge/fxsl/opm/opm-ssot-es/spec-forja-opd-es.md (sha256:3349443a65f4a036836f58d9554060f23d30b58d35d1c5bafea8011da69c94ce) el 2026-06-16 (commit bestia fccd1f51); cuerpo byte-fiel. DECISION HITL 2026-06-15: pneuma toma la posta como SSOT viva de OPM (urn:kora:kb:regimen-de-ley); la bestia queda como ultimo origen historico, ya no SSOT viva. Reemplaza la migracion snapshot del 2026-06-12 (v1.0.4) y el re-sync v1.1.1 del 2026-06-15; incorpora los deltas v1.4.0 del corpus consolidado (6.a familia de enlace Excepcion, abanicos convergentes de habilitadores, ruta sobre habilitadores, R-FAN-PROB-1 A/B/C, R-NOM-PROC-1 deverbal, co-enmiendas de bases) y el delta v1.1.2: R-OPD-INV-9 §8.1, espejo visual de R-INV-2D (frontera implicito/explicito de la invocacion entre subprocesos). Enmienda v1.2.0 del 2026-07-06 (HITL custodio): R-OPD-ROT-6 ampliada (estereotipos opforja: mencion OPL PUEDE con ausencia conforme, prohibicion de estereotipos de enlace, catalogo/vitrinas/injerto como extension declarada) + R-OPD-ROT-9 nueva (Anclaje a Pieza / Centinela de Drift: chip 3 estados, estatuto meta sin OPL nuclear, anclar no muta esencia, snapshot evolutivo a grano biblioteca/Pieza, edicion local de esencia legislada laxa); ratifica los working-artifacts de deep-opm-pro 2026-06-22-estereotipos-vitrinas-ssot-skill.md y 2026-06-29-anclaje-forma-doctrina.md. Enmienda v1.3.0 del 2026-07-07 (HITL custodio): §10.4 R-OPD-REF-20 nueva (Taller bottom-up de primera clase — OPD suelto padreId:null≠raiz, verbo «adoptar» = fijar padre + declarar refinamiento en un gesto convergente con el top-down A NIVEL DEL VINCULO no del contenido, «OPD sin adoptar» como condicion del gate de export canonico existente no severidad nueva, integridad nunca degrada, banda «Taller» y raiz «Hoja» como proyeccion de navegacion) + R-OPD-REF-14 acotada («nace en SD» es el default guiado; bottom-up admite sueltos, invariante SD exigido al graduar) + R-OPD-ROT-2 (rotulos de bosquejo como proyeccion de edicion); realiza la doctrina bottom-up RESUELTA 2026-07-06 y el working-artifact deep-opm-pro 2026-07-06-apuntes-taller-design.md."
autor: FS
creado: 2026-06-04
lang: es
tags: [opd, opforja, spec, visual, gramatica-grafica, render, canvas, jointjs]
familia: bok
depende: [urn:fxsl:kb:reglas-opm-estrictas-es, urn:fxsl:kb:opd-es, urn:fxsl:kb:opm-es]
refina: [urn:fxsl:kb:opd-es]
cita: [urn:fxsl:kb:spec-forja-opl-es, urn:fxsl:kb:metodologia-forja-opm-es, urn:fxsl:kb:opm-categorial-es, urn:fxsl:kb:opl-es]
---

# Spec-forja OPD — SSOT de la realización visual de OPFORJA

## Definición

Esta spec es la SSOT **visual** y **operativa** de OPFORJA. Gobierna, para el modelador deep-opm-pro, la realización gráfica del OPD: primitivas y sus ocho representaciones, estados y designaciones, las seis familias de enlace y sus marcadores (incluida la excepción procedimental como familia autónoma, `reglas §5.1`), modificadores de control y operadores lógicos, relaciones estructurales, refinamiento y navegación entre OPDs, layout/routing, canvas e interacción, edición visual, configuración, validación visual, simulación visual, exportación canónica y equivalencia bimodal con OPL.

La audiencia primaria son los agentes de desarrollo de OPFORJA y los agentes que proyectan, auditan o regeneran el renderer (`app/src/render/jointjs`, `app/src/canvas`).

Esta spec es autocontenida: un agente conforme NO DEBE necesitar abrir `opm-visual-es` (`urn:fxsl:kb:opd-es`) ni `reglas-opm-estrictas-es` para implementar una entrada. Las geometrías, marcas, restricciones y catálogos necesarios DEBEN aparecer en esta spec. La procedencia a esas fuentes se expresa con `Rationale:` citando el ID propietario (`V-n`, `R-*`, `AP-n`).

Es la hermana visual de `spec-forja-opl-es` (`urn:fxsl:kb:spec-forja-opl-es`): juntas cubren las dos modalidades del mismo hecho OPM. Lo que aquella legisla del puente OPD↔OPL (display, panel, interacción texto) esta spec lo cita, no lo re-legisla.

Frontera documental: esta spec legisla geometría, canvas, interacción visual y export OPD. La validez nuclear y severidad pertenecen a `reglas-opm-estrictas-es`; la superficie textual pertenece a `spec-forja-opl-es`; el método pertenece a `metodologia-forja-es`; la lectura formal pertenece a `opm-categorial-es`. Esta spec PUEDE citar esos artefactos, pero NO DEBE copiar sus reglas completas salvo lo necesario para que una entrada visual sea aplicable sin abrir otra fuente.

## Definiciones

| Término | Definición |
| --- | --- |
| Cosa | Objeto (rectángulo) o proceso (elipse); las dos únicas clases dibujables de primera categoría. |
| Rountangle | Rectángulo de esquinas redondeadas; glifo del estado, siempre interno a su objeto. |
| Marcador (marker) | Decoración de extremo o de tramo de un enlace que porta su tipo (punta, piruleta, triángulo, rayo, arco, letra). |
| Piruleta (lollipop) | Círculo terminal de enlace habilitador: relleno=agente, vacío=instrumento. |
| Swallowtail | Punta cerrada en cola de golondrina (`M 0 0 L 23 8 L 12 0 L 23 -8 Z`, bbox 23×16); realización opforja/OPCloud de la punta transformadora. |
| Constructo básico | 2 cosas + 1 enlace; unidad mínima de composición y de correspondencia OPD↔OPL. |
| Abanico (fan) | ≥2 enlaces del mismo tipo con un **extremo común** (compartido). El abanico es **convergente** si el extremo común es el destino (N→1) y **divergente** si es el origen (1→N); el arco lógico va siempre en el extremo común. |
| Esencia | Propiedad genérica de toda cosa: **física** (tangible; marca = sombra) o **informacional** (sin sombra; default). |
| Afiliación | Propiedad genérica de toda cosa: **sistémica** (dentro de la frontera del sistema; trazo continuo; default) o **ambiental** (del entorno; trazo discontinuo). |
| Perseverancia | Propiedad derivada del tipo: objeto = persistente, proceso = transitorio; sin glifo propio (la porta la forma). |
| Pre(P) | Lado de entrada de un proceso P: consumo, efecto-entrada, agente, instrumento (con o sin estado); único lado que admite `e`/`c`. |
| Refinable / refinador | Cosa que se refina (todo/exhibidor/general/clase/contenedor) / cosa que la refina (parte/rasgo/especialización/instancia/subproceso). |
| Contenedor | Cosa refinada agrandada en el OPD hijo que contiene a sus refinadores (in-zoom). |
| Apariencia | Realización local de una cosa en un OPD concreto (posición, tamaño, supresiones); la existencia es única por modelo. |
| Instancia visual | Misma cosa con apariencia en otro OPD (misma identidad); distinta de la instancia lógica (clasificación). |
| Canon-diagrama | Perfil de export por OPD, vectorial, que conserva solo gramática visible + metadato mínimo. |
| Canon-documento | Perfil de export por modelo (multi-OPD), que puede añadir OPL, diccionarios, árbol, portada. |
| UI transitoria | Elemento visible en canvas editable que desaparece de ambos perfiles canónicos; afordance, no gramática. |
| Canal reservado | Recurso visual (color, dash, glifo, posición, z) asignado a una familia de significado con separación inequívoca; otra familia NO puede reutilizarlo sin distinción perceptible. |
| Display-vs-canónico | Distinción entre la forma visible local (vista, plegado, supresión) y el hecho canónico del modelo. |

## Precedencia

Esta spec DEBE mandar sobre la implementación visual de OPFORJA (`app/src/render/jointjs`, `app/src/canvas`, composers, assets de canvas) y sobre `ui-forja/GOVERNANCE.md` y sus specs `01..08` en todo lo **visualmente significativo OPM**: formas, contornos, sombras semánticas, marcadores, estados y designaciones, triángulos, arcos lógicos, refinamiento, layout semántico (verticalidad temporal), supresiones y marcas de simulación.

`ui-forja/GOVERNANCE.md` CONSERVA la autoridad sobre estética, chrome, tokens, tipografía y componentes de interfaz **no portadores de semántica OPM**, y queda subordinado a esta spec donde ambas materias se crucen. Ante conflicto entre `ui-forja/0X` y esta spec, manda esta spec y el documento ui-forja DEBE corregirse (ver §22, GAP-OPD-UIFORJA-*).

Esta spec DEBE quedar **bajo** el canon prescriptivo `reglas-opm-estrictas-es` (`urn:fxsl:kb:reglas-opm-estrictas-es`): ante conflicto sobre qué es una cosa, un enlace, un estado, una relación, una severidad o una extensión declarada, prevalece ese documento.

Esta spec es SSOT primaria de la modalidad OPD operativa. Debe quedar compatible con la SSOT visual externa (`urn:fxsl:kb:opd-es`) y la semántica (`urn:fxsl:kb:opm-es`): ante conflicto de gramática visual base no declarado como restricción local, debe abrirse corrección documental. Esta spec la operacionaliza, la restringe o declara extensiones marcadas; NO DEBE relajarla.

Frontera modal: lo que `spec-forja-opl-es` legisla del lado textual y del puente (plegado display §12, panel §13, interacción §14, bisimetría §19) NO se re-legisla aquí; esta spec gobierna el lado OPD del puente y cita el ID del otro lado.

Rationale: la autoridad semántica del proyecto es la SSOT OPM, no la herramienta; OPFORJA realiza el OPD pero no redefine OPM. La subordinación de ui-forja en semántica visual fue decisión del operador (2026-06-04).

## Convenciones

### Tipografía

En los ejemplos de esta spec, un **objeto** se escribe en negrita, un *proceso* en cursiva y un `estado`/`valor` entre backticks (convención compartida con `spec-forja-opl-es`).

### Esquema de IDs

Las reglas nuevas de esta spec usan el esquema `R-OPD-<ÁREA>-<n>` (áreas: CAN, COSA, EST, TR, HAB, CTL, STR, INV, MUL, REF, LAY, ROT, UI, INT, EDIT, CFG, VAL, CAT, BIM, SIM, EXP). Los huecos de alineación usan `GAP-OPD-*`. Esta spec REUSA por cita, sin re-acuñar: `V-0..V-263` (opd-es), `R-*`/`AP-1..AP-30` (reglas-opm-estrictas-es), `T1..TS5/H1..HS2/E*/C*/RF1..RF4/SE1..SE5/SSE1..SSE7/CX1..CX8/IV1..IV2/EX1..EX2/D1..D13` (constructos canónicos compartidos con spec-forja-opl-es). Los IDs nuevos NO DEBEN colisionar con los existentes.

### Lenguaje de obligación

Las obligaciones DEBEN usar keywords RFC 2119 en es-CL mayúsculas, enum cerrado: DEBE, NO DEBE, DEBERÍA, NO DEBERÍA, PUEDE. El hedging NO DEBE reemplazar una keyword.

### Patrón regla + ejemplo + traza

Toda regla con más de una condición o riesgo de mala lectura DEBE anclarse con `Correcto:` / `Incorrecto:` y cerrar con `Rationale:`.

Correcto: `marca de agente = círculo terminal RELLENO colgando de línea visible en el extremo proceso.`
Incorrecto: `el agente se dibuja con un circulito.`
Rationale: la geometría del marcador es portadora de tipo; sin precisión, agente e instrumento colapsan.

### Convención de trazabilidad

La procedencia conceptual DEBE expresarse con `Rationale:`. Esta spec NO DEBE usar `Traces to:`, reservado a la Formal Layer categorial de KORA.

### Cómo leer una entrada

Cada entrada del cuerpo normativo DEBE estructurarse con los campos del esquema, en este orden cuando apliquen: **ID, Glifo/Geometría, Render, Anclaje, Layout, Supresión visual, Interacción, Bimodal, Edge cases, Traza a código, Procedencia**.

### Niveles de canonicidad

Todo hecho de esta spec hereda exactamente un nivel: `canon-iso` (ISO 19450 / opm-es / figuras), `canon-visual` (opd-es), `prescriptivo` (reglas-opm-estrictas-es), `metodo` (metodologías), `libro` (Dov Dori curado), `observacional` (OPCloud en pantalla), `implementacion` (código/assets de deep-opm-pro). Los niveles `libro`/`observacional`/`implementacion` informan pero no canonizan: cuando el canon calla, la entrada DEBE marcarse `no-canonizado` o `extensión declarada`; NO DEBE inventar canon. La decisión de canonicidad y severidad se delega a `reglas-opm-estrictas-es`.

### Precedencia de fuentes

1. `reglas-opm-estrictas-es` decide validez, severidad y extensión declarada.
2. `opd-es`, `opm-es` y esta spec deciden gramática visual, geometría, canvas, export y restricciones de modalidad OPD.
3. `spec-forja-opl-es` decide solo la contraparte textual cuando una entrada OPD cruza el puente OPD<->OPL.
4. `metodologia-forja-es` decide solo el método de modelamiento; `opm-categorial-es` decide solo la explicación formal bajo superficie.
5. El libro de Dori, videos/tutoriales OPCloud y la implementación opforja informan auditoría; ante divergencia con el canon se registra `GAP-OPD-*`, nunca se elevan a canon por sí solos.

## §1 Regla rectora: canonicidad por persistencia en export

La gramática visual conforme de OPFORJA se define por **lo que persiste en un export canónico declarado**. Lo que aparece solo en el canvas editable es UI transitoria, no gramática OPM.

- **R-OPD-CAN-1**: OPFORJA DEBE declarar al menos dos perfiles de export: `canon-diagrama` (por OPD, vectorial, gramática visible + metadato mínimo) y `canon-documento` (por modelo, multi-OPD; PUEDE incluir OPL, diccionarios, árbol de OPDs, portada, vistas derivadas). *(Rationale: V-0a, V-225, V-226, R-VIS-EXP-1/2.)*
- **R-OPD-CAN-2**: si un elemento persiste en `canon-diagrama`, pertenece a la gramática visible del OPD y DEBE quedar cubierto por una entrada de esta spec. Un elemento presente en un solo perfil DEBE declararse como atributo de perfil. *(Rationale: V-0b, V-0d.)*
- **R-OPD-CAN-3**: un elemento que desaparece de ambos perfiles canónicos es UI transitoria y NO DEBE reutilizar sin distinción los canales visuales reservados a la gramática (formas, contornos, sombra semántica, dash de afiliación, contorno grueso de refinamiento, piruletas, triángulos, arcos, marcas de estado, marcas de simulación, marcas de validación). *(Rationale: V-0c, V-202, V-203.)*
- **R-OPD-CAN-4**: una captura de pantalla en modo edición, navegación, modal o simulación pausada NO es evidencia de canonicidad. *(Rationale: V-0e.)*
- **R-OPD-CAN-5**: el canvas DEBE distinguir al menos cinco modos visuales — estático-exportable, edición, navegación, gestión-modal, runtime — y solo el estático-exportable fundamenta la conformidad. *(Rationale: V-200, V-201, R-VIS-MODO-1.)*

**Estado opforja** *(enmienda 2026-06-12, auditoría de coherencia del corpus)*: perfiles declarados y ejecutables en `serializacion/perfilesExport.ts` (`PERFILES_EXPORT` = `canon-diagrama`/`canon-documento`/`intercambio`, `ATRIBUTOS_DE_PERFIL`), con gate de densidad (`gateDensidadCanonica`) y documento canónico emitible desde la paleta. Cierre 2026-06-11 (`3a2db18c`; registro-conformidad-ssot R-OPD-CAN-1).

Rationale: V-0 es la regla rectora de `opd-es` y el criterio que separa gramática de afordance; sin perfiles declarados, la conformidad de todo lo demás queda sin testigo material.

## §2 Cosas: las ocho representaciones

### §2.1 Producto cartesiano canónico

Toda cosa OPM se renderiza como exactamente UNA de 8 combinaciones de tres canales ortogonales e independientes:

| Canal | Valores | Marca visual |
| --- | --- | --- |
| Forma | objeto / proceso | rectángulo / elipse |
| Profundidad (esencia) | física / informacional | sombra gris abajo-derecha / plano |
| Contorno (afiliación) | sistémica / ambiental | trazo continuo / trazo discontinuo |

- **R-OPD-COSA-1**: existen exactamente dos clases de cosa dibujables: **objeto** = rectángulo, *proceso* = elipse. No existen "entidades", "nodos", "actores" ni "componentes" como clases dibujables. La perseverancia (persistente/transitoria) NO tiene glifo: la porta la forma. *(Rationale: R-COSA-1/2, V-2.)*
- **R-OPD-COSA-2**: defaults de creación: esencia **informacional** (sin sombra) + afiliación **sistémica** (trazo continuo). Un preset de sesión PUEDE alterar el default solo si la esencia queda serializada y recuperable. *(Rationale: V-1, R-OBJ-3/5.)*
- **R-OPD-COSA-3**: la sombra DEBE corresponder exclusivamente a esencia física (presente ⟺ física); toda sombra decorativa uniforme de UI DEBE suprimirse en export canónico. Los reforzadores de canvas para fisicidad DEBEN diferenciarse perceptualmente de la sombra semántica y no persistir en canon. *(Rationale: V-124, V-126, V-127, R-SOMB-1/2/3.)*
- **R-OPD-COSA-4**: el tipo de contorno (continuo/discontinuo) DEBE persistir a través de todos los niveles de refinamiento: una cosa ambiental sigue ambiental en todo OPD donde aparezca. *(Rationale: V-71, R-CTRN-1.)*
- **R-OPD-COSA-5**: el color es **informativo, no normativo**: la semántica DEBE fijarse por forma, contorno, sombra y topología interna de marcadores, nunca por color. Cualquier paleta legible es conforme si preserva sin ambigüedad esas distinciones. *(Rationale: V-63, R-COLOR-1/2/3.)*

Correcto: objeto físico ambiental = rectángulo, trazo discontinuo, sombra abajo-derecha.
Incorrecto: marcar la fisicidad con un relleno rojo en vez de sombra.
Rationale: las 8 representaciones son producto cartesiano cerrado (V-1, §1.4 de opd-es; figuras ISO C.10/C.11); el color quedó fuera del producto deliberadamente.

### §2.2 Realización opforja

| Atributo | Valor vigente | Traza |
| --- | --- | --- |
| Objeto | `standard.Rectangle`, esquinas rectas (`rx:0`), stroke `#27613f` (token `opmObjeto`), strokeWidth 1.5, fill transparente | `composers/entidad.ts` |
| Proceso | `standard.Ellipse`, stroke `#1d3f78` (token `opmProceso`), strokeWidth 1.5, fill transparente | `composers/entidad.ts` |
| Dimensión base | 135×60 px (`cosaWidth`/`cosaHeight`, herencia OPCloud) | `modelo/constantes.ts` |
| Ambiental | `strokeDasharray "8 4"` | `entidad.ts` |
| Física | filtro `dropShadow {dx:6, dy:6, blur:2, color: rgba(23,21,17,0.68)}` | `entidad.ts`; excepción documentada GOVERNANCE §4 (dropShadow esencia física) |
| Refinada | strokeWidth 4 (contorno grueso) | `entidad.ts`; V-33/V-69 |
| Tipografía | `Inria Serif` 17 px, peso 400; proceso en cursiva, objeto normal; color por contraste WCAG (ink `#171511` / blanco) | `entidad.ts`, `colores.ts` |
| Identificador `o.NN`/`p.NN` | sub-label mono 9.5 px bajo la cosa; afordance UI (V-202), NO persiste en canon | `entidad.ts` |

- **R-OPD-COSA-6**: el rótulo de la cosa DEBE permanecer íntegro: el autosize EXPANDE la forma para contener el texto; NO se admite truncamiento con elipsis ni corte silencioso en canon. El rótulo DEBE quedar inscrito en el bounding box visible. *(Rationale: V-194, V-195, V-211, V-212, AP-23.)*
- **R-OPD-COSA-7**: dentro de la elipse de un proceso NO DEBEN dibujarse rountangles de estado: los procesos no tienen estados; «iniciado/en proceso/terminado» se modelan como subprocesos. *(Rationale: AP-12; opm-es §2.2.)*
- **R-OPD-COSA-8**: cosas de igual clase semántica en un mismo OPD DEBEN compartir base cromática y tipográfica, salvo variante autoral explícitamente declarada (§12, R-OPD-ROT-8). *(Rationale: V-209.)*
- **R-OPD-COSA-9** (extensión declarada, opcional): una figura humana (stick figure) PUEDE acompañar al objeto humano como distintivo; no es gramática nuclear y no sustituye la piruleta de agente. No implementada en opforja. *(Rationale: libro Dori 03/13; no-canonizado en ISO.)*

Edge cases: cosa con partes físicas e informacionales se clasifica física (esencia dominante tangible; metodologia §9.11). Un mismo objeto PUEDE ser sistémico en un modelo y ambiental en otro: la afiliación es relativa al modelo.

Bimodal: el cambio de cualquiera de los tres canales emite/retira la oración de esencia/afiliación correspondiente (`spec-forja-opl-es §2.7/§2.8`); forma=tipo de cosa es portadora del tipo tipográfico OPL.

## §3 Estados y designaciones

### §3.1 Glifo y contención

- **R-OPD-EST-1**: el estado se dibuja como **rountangle** (rectángulo redondeado) SIEMPRE contenido dentro del rectángulo de su objeto propietario, en la región inferior. No existen estados flotantes ni estados de proceso; toda apariencia flotante DEBE bloquearse como inválida. *(Rationale: V-4, R-EST-1, R-VIS-EST-1.)*
- **R-OPD-EST-2**: el estado es atómico: NO contiene cosas ni otros estados. *(Rationale: reglas §3.11.)*
- **R-OPD-EST-3**: un objeto sin estados (s=0) no puede ser afectado: solo creado (resultado) o consumido (consumo); el editor DEBE restringir el enlace de efecto a objetos con ≥1 estado. *(Rationale: V-5, V-7, R-OBJ-2, R-EFE-1.)*
- **R-OPD-EST-4**: los **valores** de un atributo son estados del objeto-atributo y se renderizan igual (rountangles): discretos (`sólido`), rangos (`120..240`), valor concreto de instancia (`185`). *(Rationale: V-58, R-ATR-2, R-VIS-EST-2.)*

Realización opforja: cápsula interna `rx:8`, fill `#dedacb` (token `estadoFill`), stroke `#68711f` (token `opmEstado`) 1.2 px, alto 24, minWidth 52, gap 4, región inferior 34 px; layout horizontal (default) o vertical por `layoutEstados`; etiqueta serif itálica 13 px. *(Traza: `composers/estados.ts`, `entidad.ts`. El radio fijo 8 sigue el canon rountangle — corrige la prescripción "pill `rx:calc(h/2)`" de ui-forja §08-§3: GAP-OPD-UIFORJA-08a, resuelto a favor del canon.)*

### §3.2 Designaciones persistentes

| Designación | Marca canónica | Cardinalidad | Realización opforja | Estado |
| --- | --- | --- | --- | --- |
| Inicial | borde grueso simple | 0..* | strokeWidth 3 en la cápsula | alineado |
| Final | doble borde concéntrico | 0..* | fill `#d6d2c6` + rect interno padding 3, stroke 1 | alineado |
| Por defecto | flecha diagonal abierta apuntando al estado | 0..1 | glifo `↗` serif 12 px esquina sup. derecha | GAP-OPD-DEFAULT-GLIFO |
| `Current` declarado | glifo externo reservado (pin) | 0..1 | glifo `●` serif 10 px esquina sup. izquierda | glifo: GAP-OPD-CURRENT-GLIFO (interno en la cápsula, no externo al borde) · serialización declarada-vs-runtime: alineado |
| Normal | borde estándar | — | cápsula base | alineado |

- **R-OPD-EST-5**: un estado PUEDE ser simultáneamente inicial y final (borde grueso + doble borde a la vez); duplicar estados para separar inicio/fin es anti-patrón. Los ciclos cerrados usan una sola cosa-estado con doble designación. *(Rationale: V-6, R-EST-3, AP-14.)*
- **R-OPD-EST-6**: la designación `Current` declarada DEBE serializarse como propiedad persistente (sobrevive save/load y export) y DEBE distinguirse de la marca de estado actual de runtime (§20), aunque compartan familia de glifo. *(Rationale: V-237, V-238, V-134, R-EST-4.)*
- **R-OPD-EST-7**: la marca canónica del estado por defecto es la **flecha diagonal abierta entrante**; el glifo `↗` actual es aproximación no conforme a corregir o a declarar como variante de perfil. *(Rationale: V-6/§2.2 opd-es; figuras ISO «routangle pointed to by open arrow».)*

### §3.3 Supresión de estados

- **R-OPD-EST-8**: la supresión de estados es política de **vista por OPD**: visibilidad efectiva = ¬suprimido-global ∧ ¬suprimido-local (global domina, local refina). Suprimir NO borra el hecho; el conjunto completo de estados del objeto es la unión a través de todos los OPDs. *(Rationale: V-86..V-90, R-VIS-SUPR-1, R-OPL-TOTAL-4/5.)*
- **R-OPD-EST-9**: cuando hay estados ocultos en la vista, el objeto DEBE exhibir el indicador de supresión: chip `⋯N` (rountangle pequeño con elipsis y conteo) en la esquina inferior derecha. El chip pertenece a la gramática auxiliar si persiste en canon. *(Rationale: V-192, §1.8/§10.6 opd-es; libro «small state symbol with ellipsis».)*
- **R-OPD-EST-10**: la supresión computada entre niveles aplica solo a descomposición (no a despliegue); con múltiples OPDs hijo, el conjunto suprimido en el padre = **unión** de los suprimidos por cada hijo; estados no referenciados por enlaces al refinado NO se suprimen. *(Rationale: V-86..V-89.)*

Realización opforja: doble nivel `estado.suprimido` (global) + `apariencia.estadosSuprimidos` (per-OPD); chip `⋯N` hairline paper/ink, radius alto/2, tooltip con conteo. Alineado. *(Traza: `modelo/visibilidadEstados.ts`, `entidad.ts`.)*

Bimodal: el OPL de un OPD enumera solo los estados visibles en ese OPD (`spec-forja-opl-es §2.3/§7.4`); el chip refleja la frase `…, y otros estados` (D6 de aquella spec).

## §4 Enlaces transformadores

### §4.1 Familia y direcciones

Seis familias canónicas de enlace, cerradas: transformadora, habilitadora, invocación, **excepción procedimental** (familia autónoma proceso→proceso, marca `/`/`//`; extensión Forja sobre la base `V-239`, ver `reglas §5.1`), estructural fundamental, estructural etiquetada. Todo enlace pertenece a exactamente una; categorías adicionales DEBEN declararse como extensión. *(Rationale: `reglas §5.1`; V-239 base cierra en cinco, V-241; la excepción la promueve Forja a familia por paridad con la invocación V-240.)*

| Tipo | ID | Dirección | Marcador | Significado |
| --- | --- | --- | --- | --- |
| Consumo | T1/TS1 | objeto → proceso | punta cerrada (swallowtail) EN el proceso | el proceso destruye el objeto |
| Resultado | T2/TS2 | proceso → objeto | punta cerrada EN el objeto | el proceso crea el objeto |
| Efecto | T3/TS3 | objeto ↔ proceso | punta cerrada en AMBOS extremos | el proceso cambia el estado del objeto |
| Efecto parcial | TS4 / TS5 | estado → proceso / proceso → estado | UNA punta cerrada (hacia el proceso / hacia el estado destino) | fragmento de entrada / de salida del efecto |

- **R-OPD-TR-1**: la punta transformadora canónica de OPFORJA es el **swallowtail cerrado** `M 0 0 L 23 8 L 12 0 L 23 -8 Z` (bbox 23×16), fill paper, stroke ink 1. Es variante conforme de la punta cerrada que el canon exige; entre los **transformadores** (consumo/resultado/efecto) el marcador es el mismo y el tipo lo porta la **dirección y el anclaje**, no el color. La invocación reusa esta punta solo como terminal de su línea en zigzag: su tipo lo porta el **rayo** (R-OPD-INV-1), nunca la dirección sola. *(Rationale: §1.5 opd-es; figuras ISO closed arrowhead; V-240; JOYAS swallowtail; `linkAssets.ts`.)*
- **R-OPD-TR-2**: invertir el extremo de un transformador cambia el hecho (consumo↔resultado); la dirección es semántica, nunca ornamental. *(Rationale: spec-forja-opl §3; R-BI-TAB-1.)*
- **R-OPD-TR-3**: un enlace de resultado hacia un objeto con estado inicial DEBE conectar al rectángulo del objeto o a un estado distinto del inicial; NUNCA directamente al estado inicial. *(Rationale: V-8, R-RES-1, AP-04; figuras ISO Fig 10.)*
- **R-OPD-TR-4**: efecto solo-entrada (TS4) sin estado de salida especificado → el destino es el estado por defecto del objeto, o la distribución de probabilidad de estados si no hay defecto. *(Rationale: V-9, R-EFE-3.)*
- **R-OPD-TR-5**: resultado+consumo sobre el mismo objeto como un solo hecho es inválido; resultado+resultado y consumo+consumo también (validación de conflicto, §17). *(Rationale: V-43, AP-30.)*
- **R-OPD-TR-8**: todo proceso explícito DEBE crear, consumir o afectar al menos un objeto (directa o indirectamente); los habilitadores NO satisfacen este requisito. Excepción: procesos persistentes que mantienen una condición (*Existir*, *Sostener*, *Esperar*…), que siguen siendo elipses normales solo si satisfacen el cierre canónico de R-PROC-2A: declarar objeto afectado e invariancia neta, atributo o condición mantenida, conforme a R-PROC-5..7. *(Rationale: V-115; opm-es §321; libro 9/10; reglas-opm-estrictas R-PROC-2A/5..7.)*

### §4.2 Variantes con estado especificado

- **R-OPD-TR-6**: el enlace con estado especificado ancla su extremo al **rountangle del estado**, no al rectángulo del objeto: TS1 consume desde estado; TS2 genera hacia estado; TS3 = par entrada-salida (estado-origen→proceso + proceso→estado-destino); TS4 solo-entrada; TS5 solo-salida. El anclaje es portador del hecho. *(Rationale: §3.2 opd-es; opm-es 3.27/3.47; spec-forja-opl §3.4-§3.6.)*
- **R-OPD-TR-7**: al descomponer el proceso, el efecto entrada-salida se **escinde**: el subproceso temprano recibe la flecha de entrada (saca de `s1`) y el tardío la de salida (pone en `s2`). La escisión es el único mecanismo; NO existen escindidos con modificador de control. *(Rationale: V-40, V-41, V-110, AP-07/08.)*

Realización opforja: consumo/resultado/efecto van con ancla `center` + connectionPoint `boundary` (recorte en el perímetro real de la forma); el extremo a estado usa ancla `midSide` sobre el sub-rect de la cápsula, sticky, z=20. El efecto monta el swallowtail en source y target. Alineado. *(Traza: `composers/enlace.ts`, `markers.ts`.)*

Edge cases: el cambio de rol entre niveles (instrumento en OPD abstracto, afectado en el detallado) es legal solo si el cambio neto entrada-salida del proceso abstracto es cero y solo en descomposición. *(Rationale: V-42, V-111, V-112, R-ROL-1/2.)*

Bimodal: T1↔`consume`, T2↔`genera`, T3↔`afecta`/`cambia de … a`, TS4/TS5↔fragmentos `de`/`a` (`spec-forja-opl-es §3`).

## §5 Enlaces habilitadores

| Tipo | ID | Marcador | Restricción de origen |
| --- | --- | --- | --- |
| Agente | H1/HS1 | piruleta NEGRA (círculo terminal relleno) en el extremo proceso | EXCLUSIVAMENTE humanos o grupos humanos |
| Instrumento | H2/HS2 | piruleta BLANCA (círculo terminal vacío) en el extremo proceso | habilitador no humano |

- **R-OPD-HAB-1**: robots, software, IA y máquinas DEBEN dibujarse como instrumento (piruleta blanca), nunca como agente, aunque la prosa de dominio los llame «agentes». *(Rationale: R-AG-1/1A/1B, AP-05.)*
- **R-OPD-HAB-2**: una piruleta DEBE colgar siempre del extremo de una **línea visible**; un círculo aislado no es piruleta (es UI, token de runtime o error de render). Handles y anclas de UI NO DEBEN ser visualmente idénticos a las piruletas (distinguir por color UI reservado, posición o tamaño). *(Rationale: V-190, V-191, R-DEC-1/2.)*
- **R-OPD-HAB-3**: el habilitador con estado especificado (HS1/HS2) parte del rountangle del estado concreto: habilita solo en ese estado. *(Rationale: §3.4 opd-es.)*
- **R-OPD-HAB-4**: unicidad de rol — un objeto (o estado) tiene exactamente UN rol respecto de un proceso enlazado: transformado O habilitador; el editor DEBE impedir el segundo enlace procedimental sobre el mismo par y la recomposición resuelve colisiones por fuerza semántica (§10.3, R-OPD-REF-13). *(Rationale: V-11, R-ROL-UNIC-1; libro procedural-link-uniqueness.)*

Realización opforja: path único `M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0` (palito 7 px + círculo r=5 en x=12); agente fill ink, instrumento fill paper, ambos stroke ink. La restricción de humanidad se aproxima por **proxy de esencia física** (`validarFirmaEnlace` solo ofrece agente desde objeto físico): el kernel no tiene tipo «humano», por lo que la exclusividad humana estricta no es exigible hoy — GAP-OPD-AGENTE-HUMANO. *(Traza: `linkAssets.ts`, `markers.ts`, `modelo/operaciones/helpers.ts`.)*

Bimodal: H1↔`maneja`, H2↔`requiere`; HS añade `en \`estado\`` (`spec-forja-opl-es §4`).

## §6 Modificadores de control, excepciones y operadores lógicos

### §6.1 Marcas de control `e` / `c` / `¬`

- **R-OPD-CTL-1**: el modificador de control es una **letra-anotación** sobre un enlace transformador o habilitador existente: `e`=evento (dispara), `c`=condición (omite si falla, bypass). NO agrega cosa ni enlace, NO altera la cardinalidad del constructo básico, NO es familia de enlace adicional. *(Rationale: R-ECA-4, R-MOD-NAT-1; opm-es 3.13.)*
- **R-OPD-CTL-2**: las marcas literales `e`/`c` DEBEN emitirse en **minúscula**; `¬` se emite como símbolo de negación (sin caja). La marca se coloca sobre la línea, cerca del extremo del proceso. *(Rationale: §1.6/§4.1 opd-es «cerca del extremo del proceso»; figuras ISO.)*
- **R-OPD-CTL-3**: `e`/`c` aplican SOLO al lado de entrada Pre(P): consumo, efecto, agente, instrumento, con o sin estado. NO existen «evento de resultado» ni «condición de resultado» (el resultado no existe antes del proceso; R-MOD-1..4, AP-01/02); NO DEBEN anotar un enlace estructural ni uno de invocación (error de categoría; R-ECA-4, reglas §6.4, AP-09/10). El editor DEBE bloquear estas combinaciones. *(Rationale: R-MOD-1..4 para resultado; R-ECA-4 y reglas §6.4 para estructural/invocación; opm-es §restricción absoluta.)*
- **R-OPD-CTL-4**: el enlace de evento es el segmento objeto/estado→proceso; el segmento de retorno (consumo, efecto) NO es enlace de evento. El evento se pierde tras la evaluación, incluso si la precondición falla. *(Rationale: V-12, V-13.)*
- **R-OPD-CTL-5** (extensión declarada): la **negación** `¬` sobre la marca de condición/evento (enlace NOT desde el estado `no-existente` o negación del estado requerido) es extensión opforja/OPCloud conforme; reduce N enlaces de condición a uno. *(Rationale: metodologia §NOT; markers `*Negation` OPCloud; no-canonizado en ISO.)*

Realización opforja: badge circular 18×18 (rx 9), fill paper, stroke ink 1, texto serif 12 ink, en distance 0.8 (enlaces entrantes al proceso: consumo/agente/instrumento) o 0.2 (proceso como origen: efecto) con offset −20 — junto al extremo del proceso; el modelo guarda `C`/`E`/`no` y presenta `c`/`e`/`¬`. Sin canal cromático propio. *(Traza: `markers.ts`, `enlace.ts·distanciaProcesoParaModificador`.)*

### §6.2 Excepciones temporales

| Excepción | ID | Marca | Dispara |
| --- | --- | --- | --- |
| Sobretiempo | EX1 | `/` (una barra corta inclinada cruzando el enlace, cerca del manejador) | duración real > duración máxima declarada |
| Subtiempo | EX2 | `//` (par de barras inclinadas paralelas) | duración real < duración mínima declarada |

- **R-OPD-CTL-6**: el enlace de excepción conecta proceso fuente → proceso de manejo, y el proceso de manejo DEBE ser **ambiental** (contorno discontinuo). Sobretiempo exige duración máxima declarada; subtiempo, mínima; la cota se declara como duración del proceso fuente (§8.2, R-OPD-INV-6). *(Rationale: R-EXC-1/1A/2/3; §4.4 opd-es; figuras ISO D.7/D.8.)*

Realización opforja: polylines ink en el destino — sobretiempo `4,10 13,-10`; subtiempo `4,10 13,-10 8.5,0 17,0 13,10 22,-10`; existe variante combinada under+over. Alineado. *(Traza: `linkAssets.ts`, `markers.ts`.)*

### §6.3 Operadores lógicos AND / XOR / OR

| Operador | Marca canónica | Semántica |
| --- | --- | --- |
| AND | **sin arco** — enlaces separados del mismo tipo que no se tocan | todos simultáneamente (default) |
| XOR | **un** arco discontinuo sobre el abanico | exactamente uno |
| OR | **dos** arcos discontinuos concéntricos | al menos uno |

- **R-OPD-CTL-7**: el arco DEBE posicionarse en el **extremo común** (compartido) del abanico. Todo abanico se clasifica como convergente (N fuentes→1 destino: el común es el destino) o divergente (1 fuente→N destinos: el común es el origen); agente e instrumento solo admiten divergente. *(Rationale: V-14..V-17, R-FAN-GEO-1/2, R-VIS-FAN-1.)*
- **R-OPD-CTL-8**: XOR/OR aplican a todas las familias procedimentales (consumo, resultado, efecto, agente, instrumento, invocación). Las marcas `e`/`c` de un abanico, cuando la familia las admite (solo Pre(P): consumo, efecto, agente, instrumento — R-OPD-CTL-3), van sobre **cada enlace individual**; los abanicos de **resultado** e **invocación** NO admiten `e`/`c` (AP-03, AP-10). Cada rama puede tener o no estado especificado independientemente. *(Rationale: V-15, §5.6/§5.7 opd-es; AP-03.)*

 Correcto: abanico XOR de resultados con estado especificado, sin marcas de control.
 Incorrecto: abanico XOR de resultados con `c` en cada rama.
 Rationale: el resultado pertenece a Post(P); el control de flujo proceso→proceso usa nodo de decisión booleano, no `e`/`c` sobre la flecha.
- **R-OPD-CTL-9**: m-de-f combinatorio — para f>2, «exactamente m de f» (XOR) o «al menos m de f» (OR), con m<f; el número m DEBE anotarse fuera y junto al arco. *(Rationale: R-FAN-M-1..4; libro 23.)*
- **R-OPD-CTL-10**: abanico probabilístico — cada rama se anota `Pr=p`; la suma DEBE ser 1.0; el abanico probabilístico es SIEMPRE XOR; sin anotación, distribución uniforme 1/n. `Pr=p` fuera de un abanico no es canónico. Realización opforja: `Pr = p` con p decimal en [0,1] (el espaciado `Pr = p` vs `Pr=p` es no-normativo). Alineado. *(Rationale: V-18, V-19, R-PROB-1, R-FAN-PROB-1; `enlace.ts·textoProbabilidad`.)*
- **R-OPD-CTL-11**: equivalencia visual — enlace de resultado simple hacia objeto con estados ≡ abanico XOR de resultados con estado especificado, uno por estado. *(Rationale: V-19; figuras ISO Fig 40.)*

Realización opforja: arcos construidos dinámicamente, stroke ink 1.5, `strokeDasharray "4 1"`, linecap round; XOR = 1 arco r=30; OR = 2 arcos r=30/35; el arco se abre evitando el mayor hueco angular entre ramas; dock por intersección recta-forma hacia el centroide de los extremos. Alineado (radios herencia OPCloud). *(Traza: `abanicoOverlay.ts`, `customShapes.ts`.)*

### §6.4 Etiquetas de ruta y escenarios

- **R-OPD-CTL-12**: la etiqueta de ruta (path label) es texto sobre un enlace procedimental que desambigua qué entrada mapea a qué salida: al ejecutar se sigue la trayectoria cuya etiqueta de salida coincide con la de entrada (coincidencia EXACTA). Un **escenario** = conjunto de etiquetas de ruta que define una variante de ejecución. La semántica de coincidencia exacta y el concepto de escenario son legislación PROPIA de esta spec (asimetría modal declarada, R-OPD-BIM-4): `spec-forja-opl-es §11` solo gobierna la superficie textual `Por ruta L,`. *(Rationale: V-20, R-VIS-RUTA-1; §6 opd-es.)*

Realización opforja: etiqueta serif 12 inkMid en `distance:0.33`. Bimodal: `Por ruta L,` (`spec-forja-opl-es §11`, solo superficie).

## §7 Enlaces estructurales

### §7.1 Relaciones fundamentales: topología interna del triángulo

| Relación | ID | Triángulo (canal NORMATIVO) | Dirección vértice→base |
| --- | --- | --- | --- |
| Agregación-participación | RF1 | interior **completamente relleno** | Todo → Partes |
| Exhibición-caracterización | RF2 | **triángulo interior** distinguible | Exhibidor → Rasgos |
| Generalización-especialización | RF3 | **vacío** (sin interior) | General → Especializaciones |
| Clasificación-instanciación | RF4 | **círculo interior** distinguible | Clase → Instancias |

- **R-OPD-STR-1**: la distinción semántica entre las cuatro relaciones reside en la **topología interna del triángulo**, no en el color. Eliminar, invertir o colapsar la decoración interior hasta volver indistinguibles exhibición/clasificación de generalización = NO conforme. Símbolos importados DEBEN preservar la topología interna (la retipificación cromática es admisible). *(Rationale: V-128, V-131, R-TRI-2/3, AP-20.)*
- **R-OPD-STR-2**: el vértice apunta al refinable; la base conecta con los refinadores. En render canónico todo triángulo DEBE conectar por línea visible al refinable (vértice) y al menos un refinador (base); un triángulo sin líneas es error de render. Triángulos auxiliares de edición DEBEN distinguirse (tamaño, color UI, ubicación). *(Rationale: V-3, V-129, V-130, R-TRI-1, R-VIS-TRI-1/2.)*
- **R-OPD-STR-3**: salvo exhibición-caracterización, refinable y refinadores DEBEN tener la misma perseverancia. Exhibición es la única estructural que conecta objetos con procesos: las 4 combinaciones exhibidor×rasgo son válidas (atributo se dibuja como objeto; operación como proceso). *(Rationale: V-24..V-26, R-STRF-1/2.)*
- **R-OPD-STR-4**: colección incompleta = **barra horizontal corta bajo la base del triángulo** (existen refinadores no mostrados). Clasificación-instanciación NO la distingue (no lleva barra). No implementada en opforja: GAP-OPD-COLECCION-INCOMPLETA. *(Rationale: §1.8 opd-es; V-27, R-STRF-3; figuras ISO Fig 17.)*
- **R-OPD-STR-5** (extensión declarada): el refinamiento «ordered» se marca con la palabra `ordered` junto al triángulo/abanico (símbolo gráfico de OPD, no frase OPL); con regla: `ordered by` + criterio. *(Rationale: la semántica de orden está canonizada en OPL por reglas-opm-estrictas R-OPL-SE-4/opm-opl-es A.7; la marca visual junto al triángulo es la extensión — no-canonizado en ISO; libro 15/17; implementado como etiqueta `ordered`.)*
- **R-OPD-STR-6**: enlaces heredados por generalización NO se dibujan como duplicados explícitos (aplican semánticamente); su efecto se infiere del árbol general-especialización. La herencia múltiple y el atributo discriminante aplican aunque no se dibujen localmente. *(Rationale: V-28, V-29, V-72, V-73, R-HER-8, AP-29.)*
- **R-OPD-STR-13**: la **afiliación se hereda por la cadena estructural**: los atributos/operaciones de una cosa ambiental son ambientales y se renderizan con contorno discontinuo automáticamente. *(Rationale: V-74, R-OBJ-6/7.)*

Realización opforja: triángulo `standard.Polygon` 30×30, refPoints `15,0 30,30 0,30`, stroke ink 1.2; agregación fill ink; generalización fill paper; **exhibición = triángulo exterior contorno + triángulo interior 12×12 relleno** en (+9,+12); **clasificación = triángulo vacío + círculo r=4** en (15,20). El triángulo es **nodo real** con puertos `in` (arriba) / `out` (abajo); con ≥2 ramas del mismo refinable+tipo se comparte UN triángulo central (bus estructural); con <2, triángulo propio por enlace. *(Traza: `markers.ts`, `agregacionBus.ts`, `enlace.ts`.)*

Arbitraje: `ui-forja/08 §4.2/§10` prescribía exhibición=cuadrado outline 10×10 y clasificación=círculo outline 8×8; esa prescripción CONTRADICE V-128/figuras ISO y queda **derogada por esta spec**: la realización canónica es la topología triangular interior descrita arriba (la app ya es conforme). GAP-OPD-UIFORJA-08b: corregir el documento ui-forja.

### §7.2 Estructurales etiquetados (tagged)

| Variante | ID | Geometría | Etiquetas |
| --- | --- | --- | --- |
| Unidireccional | SE1 | línea con **punta abierta** en destino | etiqueta itálica sobre la línea |
| Unidireccional nulo | SE2 | igual | sin etiqueta → semántica `se relaciona con` |
| Bidireccional | SE3 | **arpones** (media punta) en ambos extremos | dos etiquetas independientes (ida/vuelta) |
| Recíproco | SE4/SE5 | arpones | una etiqueta o ninguna (`se relacionan`) |

- **R-OPD-STR-7**: un bidireccional con dos etiquetas idénticas ≡ recíproco con esa etiqueta (representaciones intercambiables). *(Rationale: V-56.)*
- **R-OPD-STR-8**: la etiqueta de usuario se renderiza en **itálica** sobre el eje del enlace; es texto del modelador, no frase reservada. *(Rationale: §1.6 opd-es; figuras ISO; libro «tag en negrita» queda subordinado a la convención itálica de opd-es.)*
- **R-OPD-STR-9**: estructurales con estado especificado (SSE1..SSE7): el estado puede anclarse en origen, destino o ambos; las variantes bidireccional y recíproco NO existen para estado solo-en-destino (DEBE bloquearse). *(Rationale: V-30, AP-11, R-EST-SSE-1.)*
- **R-OPD-STR-10**: relación unaria = enlace de la cosa a sí misma; relaciones n-arias se descomponen en binarias. Un proceso que solo preserva estado (`soporta`, `contiene`) sin esfuerzo sostenido ni condición mantenida que forme parte del hecho (R-PROC-5/7) DEBE reemplazarse por tagged estructural (o atributo/estado) y su persistencia como elipse DEBE reportarse como mala clasificación metodológica; el persistente canónico que declara objeto afectado e invariancia neta conserva la elipse y se realiza como efecto con entrada=salida (`P cambia A de s a s`). *(Rationale: R-PROC-2A/5/6/7, AP-25; libro 14; metodologia §9.1 y su excepción «esfuerzo no trivial».)*

Realización opforja: tagged uni = polyline abierta `0,0 20,-10 0,0 20,10`; bidireccional = arpón `0.5,0 20,±10` en source+target; etiqueta uni en `distance:0.5`, bi en 0.8 (ida) y 0.2 (vuelta), serif 12 ink en itálica (R-OPD-STR-8). Alineado. *(Traza: `linkAssets.ts`, `markers.ts`, `enlace.ts·etiquetaTextoTagged`.)*

### §7.3 Semi-plegado

- **R-OPD-STR-11**: el semi-plegado muestra refinadores **dentro** del rectángulo del todo (filas/íconos con nombre) en lugar de entidades separadas; es por refinador y por OPD (vistas independientes del mismo hecho); el indicador numérico cuenta los refinadores **ocultos**, no el total; los enlaces procedimentales PUEDEN conectar directamente a un refinador semi-plegado (la flecha entra al borde del padre y apunta al nombre). *(Rationale: V-116..V-120, R-VIS-SEMI-1.)*
- **R-OPD-STR-12**: el semi-plegado NO tiene plantilla OPL nuclear: es expresión exclusivamente visual; esta spec es su única descripción normativa (asimetría modal declarada, §19). *(Rationale: §10.12 opd-es; R-BR-1.)*

Realización opforja (plegado parcial): filas internas con separadores, nombres de parte clicables, contadores itálicos; badge `▸` (total) / `▾` (parcial) serif 16 bold; parte extraída = tachado + opacity 0.64; triángulo compactado DEBE anclarse a la cosa visible (V-193). *(Traza: `composers/plegado.ts`, `entidad.ts`.)*

Bimodal: el plegado parcial emite `al menos otro/a` (`spec-forja-opl-es §7.2/§12`); el semi-plegado estricto no emite OPL.

## §8 Invocación, tiempo y duración

### §8.1 Invocación

- **R-OPD-INV-1**: la invocación (IV1) es familia autónoma con firma **proceso → proceso**, dibujada como línea en zigzag (**rayo**) con punta cerrada en el invocado. La autoinvocación (IV2) es el rayo en bucle que sale y regresa al mismo proceso. Modificadores `e`/`c` sobre invocación están PROHIBIDOS (error de categoría). *(Rationale: V-239, V-240, R-INV-1A, AP-10; §9 opd-es.)*
- **R-OPD-INV-2**: invocación **implícita** dentro de una descomposición — la terminación de un subproceso invoca al inmediatamente inferior por posición vertical; NO se dibuja enlace. Subprocesos cuyos puntos superiores de elipse están a la misma altura (con tolerancia) inician en **paralelo**; el último en terminar inicia el siguiente nivel. Solo aplica a descomposición de proceso. *(Rationale: V-31, V-32, V-77, R-INV-2/2A; figuras ISO 1087-1112.)*
- **R-OPD-INV-3**: subprocesos activados individualmente por eventos desde estados distintos se ejecutan asincrónica e independientemente (sistemas reactivos): un enlace de evento por subproceso, sin verticalidad temporal forzada. *(Rationale: V-59, R-VIS-ASYNC-1; metodologia LF-06.)*
- **R-OPD-INV-4**: la invocación PUEDE sustituir un objeto transitorio (creado y consumido de inmediato sin observación); el patrón bucle usa invocación del último subproceso al padre, con proceso *Esperar* intermedio si hay intervalo. *(Rationale: libro 10/22; metodologia §9.2.)*
- **R-OPD-INV-5**: la **demora** se realiza como etiqueta temporal sobre el enlace de invocación (`después de <demora>`); extensión local conforme. `spec-forja-opl-es §5.4` emite y parsea la demora; el parser acepta legacy sin tilde, pero la forma canónica es `después de`. El roundtrip estricto cubre invocación y autoinvocación con demora. *(Rationale: spec-forja-opl-es §5.4; R-OPD-BIM-4.)*
- **R-OPD-INV-9** (espejo de `reglas R-INV-2D`, frontera implícito/explícito): la realización visual del orden de subprocesos sigue, bajo la suprema, una frontera de cinco clases (que cubren los ocho casos numerados) — **implícito** (bandas con cardinalidad, sin rayo: secuencial, paralelo R-OPD-INV-2, AND-join síncrono total); **explícito por evento** (reactivo, R-OPD-INV-3, no rayo); **explícito por rayo** (autoinvocación/bucle, salto fuera de orden, invocación cross-OPD, R-OPD-INV-1/4); **demora disuelta** en subproceso *Esperar* (R-OPD-INV-4; `después de` solo sobre rayo ya-explícito, R-OPD-INV-5); join parcial/OR **fuera del orden simple** (abanico explícito). El orden es atributo **declarado** de la descomposición y la banda Y lo realiza (R-IDP-0A); un rayo entre hermanos que repite una transición de banda adyacente ya declarada es doble vara (R-INV-2B). *(Rationale: reglas R-INV-2D, R-INV-2B, R-IDP-0A.)*

Realización opforja: rayo de 4 vértices calculados (offset perpendicular `min(22, max(12, len·0.08))`) + swallowtail en destino; autoinvocación = lazo de 2 tramos colgando del borde inferior, pico a `max(56, h·0.55)`, ramas a ±35°, marker solo en el retorno; demora serif 11 inkMid en `distance:0.5`. Alineado. *(Traza: `enlace.ts`, `autoinvocacionLoop.ts`, `linkAssets.ts`.)*

### §8.2 Duración

- **R-OPD-INV-6**: la duración del proceso se especializa en mínima, esperada, máxima (+ distribución); el formato canónico se muestra **dentro de la elipse, bajo el nombre**: `[unidad] {min, esperada, max} {distribución, parámetros}`. Unidades válidas (enum de la capa base, V-45/§14.3): `ms, sec, min, hour, day, week, month, year`. La realización textual de la unidad la gobierna `spec-forja-opl-es §5.3` (metavariable `<unidad>`); este enum fija solo la superficie visual. La unidad del sistema es default; un proceso con unidad distinta la declara. Sin distribución declarada NO se emite placeholder. *(Rationale: V-45, R-EXC-4/5, R-VIS-DUR-1/2; figuras ISO D.5/D.6.)*
- **R-OPD-INV-7**: opforja realiza min/max/tasa como **etiquetas sobre el enlace** (`Min:`, `Max:`, `Rate =`), no dentro de la elipse: GAP-OPD-DURACION-ELIPSE (divergencia a converger o a declarar como variante de perfil).
- **R-OPD-INV-8**: un objeto-reloj (System Clock) con estado-valor temporal PUEDE disparar procesos vía evento en instantes definidos; no introduce símbolo nuevo (es objeto + `e`). *(Rationale: figuras ISO D.2; libro 24.)*

## §9 Multiplicidad y cardinalidad

| Símbolo | Rango | Lectura |
| --- | --- | --- |
| `?` | 0..1 | opcional |
| `*` | 0..* | opcional (cero o más) |
| (sin símbolo) | 1..1 | exactamente uno (default) |
| `+` | 1..* | al menos uno |

- **R-OPD-MUL-1**: la multiplicidad se coloca como anotación junto al **extremo** del enlace (o cerca del refinador en estructurales); aplica a etiquetados, agregación-participación y procedimentales; NUNCA al extremo proceso (el proceso siempre es cantidad 1). *(Rationale: V-21..V-23, R-MULT-1/1A, R-VIS-MULT-1.)*
- **R-OPD-MUL-2**: rangos `qmín..qmáx`; intervalos `[a..b] (a..b] [a..b) (a..b)`; listas separadas por coma (`[1..10],[20..30]`, forma canónica sin espacio — `spec-forja-opl-es §10.2`); `*` como extremo abierto; expresiones paramétricas (`2`, `3*n; n<=4`) con restricciones tras `;`. Los nombres de parámetros DEBEN ser únicos en todo el modelo. *(Rationale: §7.2 opd-es, R-MULT-2; libro 15/17 PPC.)*
- **R-OPD-MUL-3**: la superficie normativa de operadores es ASCII (`= != < <= >= in {}`); los glifos Unicode `≠ ≤ ≥ ∈` son visualización y DEBEN normalizarse o declararse como extensión de visualización. *(Rationale: R-OPL-RANGO-3.)*
- **R-OPD-MUL-4**: cardinalidades, etiquetas y etiquetas de ruta son **propiedades** del enlace, no atributos: no se renderizan como estados ni cambian en simulación. *(Rationale: R-ATR-6; opm-es §195.)*
- **R-OPD-MUL-5**: la tasa de transformación (consumo/generación/efecto a lo largo del tiempo) se anota sobre el enlace con unidades; sin tasa, la transformación es inmediata. *(Rationale: opm-es §428; libro 22.)*

Realización opforja: etiquetas serif 12 ink; origen en `distance:0.1` (procedimental) / `0.2` (estructural), destino en `0.9` (fracciones de path, herencia OPCloud). Alineado. *(Traza: `enlace.ts`.)*

Bimodal: las frases OPL de cardinalidad tienen su sede en `spec-forja-opl-es §10.1`: `?`↔`un/una opcional`, `*`↔`opcional (cero o más)`, `+`↔`al menos un/una`, sin símbolo↔implícito.

## §10 Refinamiento y gestión de contexto

### §10.1 Los cuatro pares refinamiento↔abstracción

| Par | Refina | Abstrae | Naturaleza |
| --- | --- | --- | --- |
| Expresión ↔ Supresión de estados | revela estados | oculta estados | per-OPD (§3.3) |
| Despliegue (unfold) ↔ Plegado (fold) | revela refinadores estructurales | los oculta | asíncrono, 4 relaciones |
| Descomposición (in-zoom) ↔ Recomposición (out-zoom) | expone subprocesos en contenedor | restaura el padre | síncrono, semántica de agregación |
| Sub-modelo (referencia) ↔ Desconexión | cruza la frontera del modelo | la corta | inter-modelo (V-242) |

- **R-OPD-REF-1**: en descomposición, la cosa refinada aparece **agrandada como contenedor** en el OPD hijo (elipse inflada para subprocesos; rectángulo para componentes), con **contorno grueso en padre y en hijo**. El despliegue en nuevo diagrama también marca contorno grueso; el despliegue **intradiagrama NO** lo produce. *(Rationale: V-33, V-34, V-69, V-70, V-79, R-ANID-1, R-CTRN-2.)*
- **R-OPD-REF-2**: dentro de la descomposición de proceso, el **tiempo fluye de arriba hacia abajo**: la coordenada vertical de los subprocesos determina la secuencia; misma altura = paralelo. El layout vertical ES semántico, en edición y en simulación. En descomposición de objeto la posición codifica disposición espacial/lógica, NO tiempo. *(Rationale: V-35, V-55, V-77, V-78, R-LAY-4, R-IDP-0A.)*
- **R-OPD-REF-3**: el in-zoom procede en dos fases — Mostrar Contenido → Refinar Enlaces (OPD semidescompuesto como intermedio); el out-zoom invierte (Abstraer Enlaces → Ocultar Contenido). *(Rationale: V-62; figuras ISO C.19/C.20.)*
- **R-OPD-REF-4**: al crear el OPD hijo, las cosas conectadas al refinado en el padre se copian como **elementos externos** (mantienen esencia, contorno y estados; posición recalculada). En descomposición se copian TODAS las conectadas por cualquier enlace; en despliegue SOLO los hijos estructurales directos. Un elemento externo NO se refina desde ese OPD hijo. *(Rationale: V-80..V-83, R-HIJO-3/4/5.)*
- **R-OPD-REF-5**: objetos internos (creados en la descomposición, sin apariencia en el padre) se eliminan en cascada con el proceso padre; los externos persisten independientes. Mover gráficamente un objeto externo dentro del contenedor NO cambia su alcance (envolvimiento sin efecto semántico; la herramienta DEBE advertir o rebotar). *(Rationale: V-84, V-85; metodologia §A3; OPCloud enveloping.)*
- **R-OPD-REF-6**: visibilidad de enlaces en OPD hijo — estructurales al contenedor: visibles; procedimentales al contenedor: NO visibles directamente (se distribuyen, §10.2); entre internos: visibles; los que no tocan contenedor ni internos: invisibles. *(Rationale: V-91..V-94, R-VIS-HIJO-1.)*
- **R-OPD-REF-7**: refinamiento no trivial — una descomposición DEBE tener ≥2 subprocesos y un despliegue ≥2 refinadores; con un solo hijo no cierra ni exporta como canónico (placeholder de edición tipificado). *(Rationale: R-REF-NTRIV-1/2/3, AP-13.)*
- **R-OPD-REF-8**: PROHIBICIÓN de ciclos — no se puede refinar una cosa desde dentro de su propio árbol de refinamiento; chequeo transitivo sobre toda la cadena de ancestros. *(Rationale: V-100, R-REF-1, AP-16.)*
- **R-OPD-REF-9**: invariantes inter-nivel — esencia, perseverancia y nombre NO cambian a través del refinamiento; un hecho en un OPD no puede contradecir a otro (refinar no es contradecir); la importancia de una cosa es proporcional al OPD más alto donde aparece. *(Rationale: V-95..V-99, R-REF-4, R-CONSIST-1/2, R-IMP-1.)*
- **R-OPD-REF-10**: la descomposición DEBE preservar la **firma de frontera** del proceso abstracto (mismos roles de entrada/salida netos); añadir o quitar un rol cambia la función visible. Conservarla es condición necesaria, no prueba equivalencia conductual ni sustituibilidad total. *(Rationale: metodologia-forja §A0.4; checker `DESCOMPOSICION_NO_PRESERVA_FRONTERA`.)*

### §10.2 Distribución y escisión de enlaces

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

- **R-OPD-REF-11**: un enlace que toca el contorno del contenedor se interpreta distributivamente («paréntesis algebraico»: aplica a cada subproceso). Sin subprocesos aún, el enlace al contenedor es respaldo temporal. La distribución y las restricciones de frontera aplican SOLO a descomposición. *(Rationale: V-36..V-39, V-103..V-109, R-DIST-1, AP-06/21; libro 21/22.)*
- **R-OPD-REF-12**: si una condición omite un subproceso, el control pasa al siguiente subproceso secuencial aplicable. *(Rationale: V-39, R-VIS-CTRL-1.)*

### §10.3 Precedencia de recomposición

- **R-OPD-REF-13**: al recomponer (out-zoom/plegar/suprimir), las colisiones de enlaces sobre el mismo par objeto-proceso se resuelven por **fuerza semántica**: orden principal `consumo = resultado > efecto > agente > instrumento`; secundario `evento > sin control > condición` (12 niveles; condición de instrumento es el más débil). Matriz transformadora: efecto×efecto=efecto; efecto×resultado=resultado; efecto×consumo=consumo; resultado×consumo=efecto (solo con continuidad de identidad/estados); resultado×resultado y consumo×consumo INVÁLIDOS. Un transformador SIEMPRE prevalece sobre un habilitador. *(Rationale: §13 opd-es, V-43, V-44, R-PREC-1..5, R-FUERZA-2; figuras ISO Tabla 27.)*

### §10.4 Árbol de OPDs, identidad y categorías

- **R-OPD-REF-14**: el SD (raíz, nivel 0) contiene **exactamente un proceso sistémico** (la función del sistema); PUEDE contener procesos ambientales. Excepción canónica: una Vista de Sub-modelo PUEDE no contener exactamente un proceso sistémico si declara la selección parcial o el criterio de vista que la originó (V-186). El árbol de procesos OPD nace en SD; cada nodo es un OPD por refinamiento; es el mecanismo principal de navegación; profundidad típica 5-10 niveles (referencia, no invariante). «El árbol nace en SD» es el default del **arranque guiado** (SD-primero, metodologia §A2); el arranque **bottom-up** (metodologia §A1.5) admite **Bocetos** antes de decidir el SD y los sitúa después mediante Integrar (R-OPD-REF-20). En régimen Apunte, la ausencia de un SD conforme se observa; en régimen Modelo vuelve a ser deuda de cierre exigible. Graduar con pendientes no repara ni satisface por sí solo este invariante. *(Rationale: V-46, V-186, R-SD-4, R-VIS-SD-1, R-CAN-BOCETO-1..4; opm-es §823/§861; metodologia §A1.5.)*
- **R-OPD-REF-15**: las etiquetas `SD/SD1/SD1.1` son **proyección humana de navegación**, NO identidad: pueden mutar por reordenamiento/inserción. Todo OPD DEBE tener un identificador persistente estable (UUID/slug/URI) y toda referencia externa DEBE usarlo, no `SDx.y`. El acoplamiento coordenada-vertical / orden-árbol / orden-OPL es de proyección, no de identidad. *(Rationale: V-246..V-250, R-IDP-1, R-ARB-1/2/3.)*
- **R-OPD-REF-16**: tres categorías de OPD mutuamente excluyentes, declaradas en metadato: **jerárquico** (nace por refinamiento; eliminable solo si es hoja; internos protegidos), **vista anclada** (Sub-modelo, Mapa del Sistema, Vista de Requisitos; política propia, puede regenerarse; solo lectura respecto de los hechos que proyecta), **vista ad hoc** (colección editorial transitoria; eliminable libremente). Una vista NO crea hechos OPM nuevos. *(Rationale: V-113, V-114, V-244, V-245, V-254, V-255, R-VIEW-1..4.)*
- **R-OPD-REF-17**: instancia visual ≠ instancia lógica — la visual es la misma cosa con otra apariencia (cualquier cosa puede aparecer en N OPDs; eliminar una apariencia no elimina la cosa); NO se puede crear instancia visual entre tipos distintos (objeto↔proceso). La cosa duplicada en el mismo OPD se marca con silueta desplazada detrás del símbolo. *(Rationale: V-52, V-101, V-102, V-123, R-INS-2, R-REF-2, AP-15; §1.8 opd-es.)*
- **R-OPD-REF-18**: composición inter-modelo — un modelo contiene 1..* OPDs, 1..* párrafos OPL y 0..* referencias a sub-modelos formando un **DAG**; la clausura OPD↔OPL es local a cada modelo; toda cosa referenciable cross-model expone URI/handle persistente; las marcas cross-model (atenuación, distintivo, alias) son gramática de vista, no nuclear; el ciclo de carga (`cargado y sincronizado` / `no sincronizado` / `no cargado`) es propiedad de la referencia. Desconectar un sub-modelo cambia explícitamente el estado del vínculo (sin ambigüedad visual). *(Rationale: V-64, V-176..V-189, V-251..V-256, R-VIS-MODELO-1, R-VIS-XMODEL-1.)*
- **R-OPD-REF-19**: operaciones auxiliares (`traer conectadas`, `traer enlaces entre seleccionadas`) **materializan apariencias de hechos ya declarados**: no crean semántica, DEBEN ser reversibles o acotadas, su resultado canónico es indistinguible de un OPD manual (sin marcas de «cosa traída») y PUEDEN dejar supresores `…` de enlaces no materializados. NO son refinamiento ontológico. *(Rationale: V-243, V-257..V-263, R-BRING-1.)*
- **R-OPD-REF-20** (extensión declarada): **Bocetos e integración
  reversible.** Realiza visualmente el arranque bottom-up de primera clase
  (metodologia §A1.5) bajo el gate propietario R-CAN-BOCETO-1..4.
  - **Boceto**: OPD con `padreId = null` que **NO es la raíz** del modelo
    (`opdRaizId`), todavía fuera del árbol de refinamiento. Es un estado legítimo
    de organización del componente, no error ontológico ni referencia rota. Sus
    hechos OPM emiten OPL como los de cualquier OPD.
  - **Integrar como…** (verbo visible de autoría): declara el Boceto como
    descomposición o despliegue de una cosa existente; fija padre y slot de
    refinamiento en un gesto. Converge con el refinamiento top-down en el mismo
    constructor y estado del **vínculo**, no en el contenido: el top-down
    auto-andamia (R-OPD-REF-4/R-OPD-REF-11), mientras Integrar conserva el
    contenido autorado del Boceto y solo materializa la apariencia derivada
    necesaria. Respeta ciclos (R-OPD-REF-8), dueño único y firma de frontera
    (R-OPD-REF-10).
  - **Devolver a Bocetos** es la inversa preservante: libera el slot, deja
    `padreId = null` solo en la raíz elegida y conserva ID, hechos, geometría,
    pregunta guía y descendientes. **Eliminar refinamiento** es una operación
    destructiva distinta que elimina el subárbol; NO DEBE presentarse como
    inversa de Integrar.
  - **Gate delegado**: la condición, severidad y conducta por régimen pertenecen
    a `reglas-opm-estrictas-es` R-CAN-BOCETO-1..4. Esta spec solo realiza su
    superficie. Integrar no gradúa; Graduar no integra; la edición nunca se
    bloquea por la sola presencia de Bocetos.
  - **Proyección de navegación**: los componentes no integrados se agrupan bajo
    la **banda «Bocetos»**. «Taller» queda reservado al espacio global de
    documentos Apunte. La raíz conserva su nombre y rol; no recibe una
    pseudoidentidad «Hoja». Banda, espacios y acciones son UI (R-OPD-REF-15),
    no identidad ni hecho OPM. *(Rationale: metodologia §A1.5;
    R-CAN-BOCETO-1..4; R-OPD-REF-8/10/14/15; contrato de producto deep-opm-pro
    `2026-07-27-taller-modelos-ciclo-reversible-design.md`.)*

Realización opforja: in-zoom = modo contorno (padding 16, fill `rgba(250,250,248,0.96)`, stroke 4, label arriba, z=0; internas con id jerárquico `padre.ordinal`); unfold = partes fuera con triángulos; árbol por `padreId` con aciclicidad validada; categorías de OPD en `Opd.vista` (`OpdVista`: requirement-view/submodel-view read-only, generic-view; jerárquico = vista ausente; `tipos/extensiones.ts`); supresión per-OPD; «traer conectados» con layout radial (anillo, minDistance 12). Proxy de parte extraída = enlace dashed `5 4` gris `#98a2b3` sin markers (GAP-OPD-PROXY-TOKEN: hex fuera de tokens). Pendiente: identidad persistente de OPD frente a ids posicionales del DSL de autoría (GAP-OPD-VERIFY-IDS; acta 2026-06-04). Bocetos (R-OPD-REF-20): Boceto = `padreId=null ∧ id≠opdRaizId`; la UI dice **Integrar** y **Devolver a Bocetos**, mientras compatibilidad interna conserva `adoptarOpd`, `gateOpdsSinAdoptar` y `contextoRefinamiento.origen:"adopcion"`. El constructor único `establecerRefinamiento` sirve a top-down (`descomponerProceso`/`desplegarObjeto`) e Integrar; la inversa libera el slot sin borrar el subárbol. El gate R-CAN-BOCETO-1..4 rige documento + PNG + PNG-ZIP y la banda «Bocetos» se deriva en `construirArbol`. *(Traza: `entidad.ts`, `enlace.ts`, `layoutRadial.ts`, `modelo/*`, `modelo/operaciones/refinamiento/establecer.ts`, `modelo/opdSueltos.ts`, `serializacion/perfilesExport.ts`, `ui/arbol/togglesArbol.ts`.)*

Bimodal: `se descompone en` / `se despliega en` / aristas del árbol `se refina por …` (`spec-forja-opl-es §7`); el reverse OPL NO reconstruye el árbol de OPDs (GAP-CX-PARSER de aquella spec): el árbol se materializa por estructura del modelo.

## §11 Layout y routing

- **R-OPD-LAY-1**: invariantes de composición — no debe haber oclusión entre cosas (excepción tipificada: plegado en puertos); los enlaces no atraviesan áreas ocupadas por cosas; minimizar número de enlaces y cruces por OPD. Si un re-ruteo automático sin cambio semántico elimina cruces, el export DEBE aplicarlo o reportar advertencia. *(Rationale: V-51, R-LAY-2.)*
- **R-OPD-LAY-2**: límite de legibilidad — máximo 20-25 cosas por OPD (V-50, guía de la capa base). El gate operativo (advertir entre 21 y 25; BLOQUEAR el export canónico con >25 salvo vista tipificada o refinamiento declarado) es la **extensión deep-opm-pro ya canonizada** en `reglas-opm-estrictas-es R-LAY-1`, no derivada de V-50. El límite es **por OPD lógico**, no por tamaño físico del lienzo: el canvas infinito es conforme mientras este gate rija el export. *(Rationale: V-50; R-LAY-1 (extensión opforja); libro 21 «congestion limit».)*
- **R-OPD-LAY-3**: la grid del canvas es **decoración opcional de edición**: no pertenece al modelo, DEBE suprimirse en exportaciones canónicas, y el snap es transparente (dos OPDs con idéntica topología y diferencias de posición explicables solo por cuantización son equivalentes). Las smart-guides usan canal UI reservado y NO reutilizan el patrón discontinuo de afiliación ambiental. *(Rationale: V-196..V-198, R-LAY-3, R-VIS-LAYOUT-1.)*
- **R-OPD-LAY-4**: routing por familia — los enlaces procedimentales van **rectos** (sin router); los estructurales fundamentales usan router **ortogonal** (manhattan: nunca diagonal, evitando bbox de entidades y triángulos); invocación y abanicos usan vértices explícitos. *(Rationale: libro 16 «ortonormales, nunca diagonales»; herencia OPCloud manhattan padding 5/step 11; `opcloudRouting.ts`.)*
- **R-OPD-LAY-5**: anclaje canónico — extremo al **centro** de la cosa con recorte en el perímetro real (`boundary`; para la elipse, intersección geométrica exacta con la curva); el puerto explícito usa ancla dedicada; los enlaces no pueden quedar sueltos (`linkPinning:false`). *(Rationale: evidencia OPCloud `init-rappid` + JOYAS §7; `enlace.ts`.)*
- **R-OPD-LAY-6**: los cruces inevitables PUEDEN dibujarse con salto en arco (`jumpover`), degradando a recto en OPDs densos (>35 enlaces); es presentación de legibilidad, no semántica. La prescripción `straight`-only de ui-forja §08-§0 queda matizada por esta regla (excepción documentada). *(Rationale: V-51; `proyeccion.ts`; GAP-OPD-UIFORJA-08c declarativo.)*
- **R-OPD-LAY-7**: símbolos estructurales que colisionan (<44 px) se separan (50 px, carriles alternados); tras un drag, el orden de terminales de enlaces estructurales PUEDE re-permutarse para minimizar cruces (≤7 enlaces). *(Rationale: V-51 operacionalizado; `agregacionBus.ts`, `sortStructuralLinks.ts`.)*
- **R-OPD-LAY-8**: el export DEBE auto-ajustar el viewport para no recortar símbolos, rótulos ni decoraciones (ningún símbolo huérfano). *(Rationale: V-199, V-234, R-VIS-LAYOUT-1.)*
- **R-OPD-LAY-9**: posiciones por defecto — disposición vertical objeto-arriba/proceso-abajo en transformadores; todo-arriba/partes-abajo en estructurales (triángulo en el tramo central); abanico con origen común geométricamente significativo. *(Rationale: figuras ISO Fig 7/16; DEBERÍA, no DEBE: heurística de claridad.)*
- **R-OPD-LAY-10** (extensión declarada): el canvas es conceptualmente ilimitado — el área de dibujo crece en las cuatro direcciones según el contenido — y al cambiar de OPD la vista DEBE centrar el bbox real del contenido. Realización opforja: pan como scroll del viewport con compensación de origen. *(Rationale: conforme con V-50/R-OPD-LAY-2 — el límite de legibilidad es por OPD lógico, no por lienzo; el canon calla sobre el lienzo infinito, nivel `implementacion`. Traza: `JointCanvas.tsx`.)*

## §12 Composición del OPD y rotulado

- **R-OPD-ROT-1**: el rótulo va centrado dentro de la forma (multilínea admitida); en `canon-diagrama` los rótulos del grafo permanecen en **negro** por defecto: el cromatismo de clase vive en bordes, líneas y decoraciones, no en el texto. *(Rationale: V-228, R-ROT-3; figuras ISO.)*
- **R-OPD-ROT-2**: alias decorativo entre paréntesis (`Sistema de Turborreactor (str)`); las llaves `{alias}` se reservan EXCLUSIVAMENTE al binding computacional; la unidad dimensional va entre corchetes `[u]` tras el nombre (en ese contexto los corchetes no son multiplicidad); `[]` vacío es placeholder de edición que se suprime en canon salvo confirmación. La banda «Bocetos» y los espacios Taller/Modelos son **proyecciones de edición y gestión** (R-OPD-REF-15/20): no portan identidad ni hecho OPM. La raíz conserva su nombre y rol; la UI no la renombra «Hoja» por el régimen documental. *(Rationale: V-122, V-158..V-162, R-ROT-4, R-VIS-COMP-1; R-CAN-BOCETO-1..4; R-OPD-REF-15/20.)*
- **R-OPD-ROT-3**: la política léxica de nombres (singular, capitalización, sufijos Conjunto/Grupo, proceso en infinitivo/nominalización, estados en minúscula) pertenece a la capa textual y al método; la capa visual la hereda sin política paralela y exige solo render sin ambigüedad respecto de la cosa referida. *(Rationale: V-47, V-121; spec-forja-opl-es §2; metodologia-forja §nombrado.)*
- **R-OPD-ROT-4**: instancia lógica se rotula `NombreInstancia : NombreClase`; la clase muestra atributos con rangos y la instancia los mismos con valores concretos. *(Rationale: V-58, R-INS-3.)*
- **R-OPD-ROT-5**: normalización léxica organizacional, alias de casing o reescritura automática del rótulo NO se aplican silenciosamente: deben ser trazables como política o metadato reversible. Todo conflicto de unicidad nominal se resuelve explícitamente (reusar cosa existente / renombrar / descartar); NO se admite reescritura silenciosa. *(Rationale: V-216, V-222, R-VIS-AUTOR; metodologia §9.14.)*
- **R-OPD-ROT-6**: estereotipos — sintaxis visible `<<Nombre>>` embebida en el rótulo o distintivo equivalente; la condición de estereotipada NO se oculta del artefacto canónico; el estereotipo no sustituye la clase base (objeto sigue objeto). El estereotipo canónico `<<Requirement>>` es un objeto estereotipado (atributos mínimos: Name, ID, Requirement Essence, Satisfaction, Description; `Requirement Essence` ≠ esencia física/informacional); el requisito se vincula al diseño por enlace estructural etiquetado `satisface`, nunca procedimental. En OPL la mención `«Nombre»` es PUEDE (R-VIS-STEREO-1): su ausencia del OPL nuclear es conforme y NO altera el conteo ni la bisimetría (roundtrip); opforja v1 la omite deliberadamente. Un estereotipo se aplica a **cosas** (objeto/proceso) o se materializa como **plantilla de subgrafo** injertable (cosas+estados+enlaces reales, clonada con identidad fresca); marcar un *enlace* con estereotipo sería una sexta familia de enlace encubierta — NO DEBE. Realización opforja (extensión declarada): catálogo aditivo `Modelo.estereotipos?` = contenido meta del autor (mismo estatuto que R-OPD-ROT-7: fuera de `validarModelo` nuclear y del conteo OPL); la aplicación `Entidad.estereotipoId` sí es dato del modelo, realizada `<<Nombre>>` en canvas; vitrinas con injerto 1-clic y captura de selección como estereotipo nuevo; contrato de import duro (un `estereotipoId` que no resuelve a fábrica ni catálogo rechaza); el `propositoDeModelado` del estereotipo es el owner de valor del catálogo. Traza: `modelo/estereotipos.ts`, `modelo/operaciones/injertoEstereotipo.ts`, `modelo/tipos/extensiones.ts`. *(Rationale: V-142..V-157, R-VIS-STEREO-1/2, R-VIS-REQ-1; metodologia LF-07; evidencia OpCloud `cloneStereotypeToOpd`/`replaceClonedStereotypeToActualThing`, `regFileStereotype{G,NonG}.svg`; enmienda v1.2.0 HITL custodio 2026-07-06, working-artifact deep-opm-pro `2026-06-22-estereotipos-vitrinas-ssot-skill.md`.)*
- **R-OPD-ROT-7**: notas y anotaciones libres son contenido **meta** del autor: no son cosa OPM, no emiten OPL nuclear, y su morfología no reutiliza canales semánticos; si se exportan, se marcan como meta. Realización opforja (extensión declarada): las **notas de mesa** realizan este contenido meta/auxiliar y quedan excluidas del perfil `canon-diagrama`. *(Rationale: V-204, R-BR-4. Traza: `modelo/notasMesa.ts`.)*
- **R-OPD-ROT-8**: estilado autoral — capa paralela admisible solo si no colisiona con canales reservados (gramática, simulación, validación, UI); en su ausencia, la implementación converge al esquema por defecto; el export canónico **normaliza** el estilado autoral salvo perfil contrario; el tamaño autoral de una cosa no puede impedir legibilidad ni contención del rótulo; imagen bitmap decorativa PUEDE ir dentro de una cosa sin ocluir contorno/sombra/estados/rótulo (ante conflicto prevalece la geometría OPM). El estilado autoral NO reutiliza: rojo/amarillo/verde como semántica tácita, discontinuidad de borde, cromatismo de simulación ni marcas de validación. *(Rationale: V-207..V-217, R-VIS-AUTOR-1/2.)*
- **R-OPD-ROT-9** (extensión declarada): **Anclaje a Pieza** — una cosa PUEDE estar anclada (referencia viva) a una **Pieza** de una biblioteca gobernada; el **Centinela de Drift** la vigila contra la versión viva de la biblioteca. Canvas (DEBE): la cosa anclada porta un **chip de estado** en su esquina, en tres fases — `sincronizado` (marca de amarre, peso mínimo) · `no-resuelto` (`?`) · `divergente` (`⟳`) — en **TINTA**, jamás crimson (R-OPD-UI-1); el chip declara *que* está atada y su salud, NO el nombre de la Pieza (eso vive en el Inspector: el lienzo dice que está atada, el Inspector dice a qué). Bimodal (PUEDE): el Anclaje NO emite OPL nuclear (contenido meta, mismo estatuto que R-OPD-ROT-6/ROT-7); su ausencia del OPL es conforme y no altera el conteo ni la bisimetría. Anclar **no muta esencia**: es view+validate; la cosa anclada conserva la esencia de su Pieza (más conservador que OpCloud, que muta esencia vía el estereotipo Sensor). El anclaje congela una **referencia-a-snapshot evolutivo** al momento de anclar — a grano **biblioteca** (`frozenAtHash`, firma semántica del modelo-biblioteca) o, presente `frozenAtPieza`, a grano **Pieza** (vecindad RADIO-1: la entidad + sus estados + sus enlaces incidentes, vecinos por id) —; el Centinela re-leva contra la versión viva (base evolutiva, no congelada-ciega). Edición local de esencia (**legislada, vista laxa**): una cosa anclada PUEDE editar su esencia localmente; la divergencia resultante NO se bloquea — el Centinela la hace visible como drift; el rigor estricto (view-only, editar exige Soltar) PUEDE adoptarse a futuro solo como restricción aditiva. **Soltar** desancla irreversiblemente (pierde comparabilidad); **Calcar** produce copia desacoplada sin vigilancia. Traza: `modelo/operaciones/anclaje.ts`, `modelo/submodelos/firmaSemantica.ts`, `store/modelo/acciones-anclaje.ts`. *(Rationale: acta de nominación deep-opm-pro `2026-06-24-acta-nominacion-reuso-tipos-opforja.md` (Calcar/Anclar/Pieza/Soltar, invariantes i-v); enmienda v1.2.0 HITL custodio 2026-07-06, working-artifact `2026-06-29-anclaje-forma-doctrina.md`.)*

## §13 Canvas, modos e interacción

- **R-OPD-UI-1**: todo elemento de interacción (handles, halos, anclas, marquee, menús, toasts, ghosts de drag, smart-guides, resaltados de búsqueda) es UI transitoria: usa **canal reservado** no ambiguo respecto de la gramática (§1) y NO persiste en canon. En OPFORJA el canal UI reservado es el **crimson** `#8e2a2e` + grises de interfaz; crimson está PROHIBIDO como marca semántica OPM en el OPD. *(Rationale: V-127, V-200..V-206, R-VIS-MODO-1; GOVERNANCE §2 (invariante de colores); tokens Codex.)*
- **R-OPD-UI-2**: selección — única: subrayado crimson hairline bajo la etiqueta embebido en la celda (no infla el conteo de elementos); múltiple: celda-halo aparte (z=30); hover: variante 1 px opacity 0.5. La selección NO redibuja el borde semántico de la cosa. *(Rationale: V-202/V-203 operacionalizados; `halos.ts`, `entidad.ts`.)*
- **R-OPD-UI-3**: las afordances de manipulación directa (handles de resize, anclas de conexión, marquee, vértices de edición de enlace, reanclaje de extremos por arrowhead-tools) usan el canal UI reservado (R-OPD-UI-1) y NO persisten en canon; el drag de un subproceso embebido DEBE quedar confinado al interior de su contenedor (preserva la contención del in-zoom, §10). Realización opforja (extensión declarada de detalle): 8 handles de resize 8×8 solo en selección única, stroke crimson; 12 anclas de conexión r=5 (opacity 0→1 al hover/modo enlace, cursor crosshair); marquee Shift+drag (borde crimson, fondo crimsonSuave; Ctrl+Shift acumula); vértices crimson r=4; confinamiento por embed+restrictTranslate. *(Rationale: R-OPD-UI-1/R-OPD-CAN-3 — canal reservado; V-33/R-OPD-REF-1 — contención; los mecanismos son nivel `implementacion`, no canonizados.)*
- **R-OPD-UI-4** (extensión declarada): las cápsulas de estado son objeto de interacción de primera clase (hover, selección, foco, drag); su feedback DEBE usar variantes del canal UI reservado sin tocar el canal semántico oliva del estado. *(Rationale: R-OPD-UI-1/R-OPD-CAN-3 — separación de canales; la primera-clase de interacción es nivel `implementacion`. Traza: `jointjs.css`.)*
- **R-OPD-UI-5**: el feedback de destinos válidos/inválidos del modo enlace DEBE usar el canal UI reservado; la realización vigente usa la paleta legacy OPCloud (`#70E483/#3BC3FF/#586D8C`): GAP-OPD-FEEDBACK-LEGACY (deuda visual viva, alias permitidos por GOVERNANCE §4 (excepción: aliases legacy) solo como compat). *(Rationale: R-OPD-CAN-3; `modoEnlace.ts`, `coloresCanon.ts`.)*
- **R-OPD-UI-6**: la grid de edición es configurable (paso, color, grosor, escala, snap) y PUEDE estar activa en modo edición como preferencia; su supresión en export es obligatoria (R-OPD-LAY-3). La activación por defecto es materia de ui-forja (estética de edición), no de esta spec. *(Rationale: V-196/V-197; resolución de la tensión con ui-forja §08-§0/§14.)*

## §14 Interacción OPD↔OPL (lado canvas)

El puente texto↔canvas está legislado en `spec-forja-opl-es §14` (tokens con referencia tipada, hover bidireccional, click→foco, filtrado por selección, resolución por sub-span). Esta sección fija solo el lado OPD:

- **R-OPD-INT-1**: el resaltado entrante (hover sobre OPL) se realiza sobre la cosa con cambio de fill al tono cálido (`paperWarm`) + subrayado hover; sobre estados y enlaces con sus variantes hover. El resaltado es por **referencia tipada** (tipo+id), nunca por coincidencia textual del nombre. *(Rationale: spec-forja-opl-es R-OPL-INT-3; `halos.ts`, `entidad.ts`.)*
- **R-OPD-INT-2**: el click en token OPL navega/enfoca el elemento en canvas sin mutar el modelo; la selección activa en canvas filtra el panel OPL. *(Rationale: spec-forja-opl-es R-OPL-INT-4/5.)*
- **R-OPD-INT-3**: el color NO es el vehículo del cruce modal en OPFORJA (a diferencia del sync-color OPCloud): la correspondencia se porta por referencia tipada y resaltado reservado. *(Rationale: V-63; evidencia OPCloud declarada observacional.)*

## §15 Edición visual

- **R-OPD-EDIT-1**: la herramienta DEBE validar la **firma** antes de crear un enlace (legalidad del par origen-destino por familia, §17) y validar el extremo de estado antes de anclar. Solo se ofrecen los enlaces legales para el par. *(Rationale: R-EDIT-1/2; matriz de pares OPCloud como evidencia.)*
- **R-OPD-EDIT-2**: un cambio visual que afecta contorno, sombra, forma, marcador, triángulo o estado **cambia el hecho** y su OPL; uno que solo afecta estilo autoral NO cambia OPL nuclear. Cambiar el tipo de cosa recalcula perseverancia y revisa los enlaces afectados; si una oración OPL cambia el tipo ontológico de una cosa existente, se bloquea y se pide decisión explícita. *(Rationale: R-EDIT-3/6/7, R-IMPORT-7.)*
- **R-OPD-EDIT-3**: mover una cosa entre OPDs preserva la identidad y emite solo cambios de **apariencia**. *(Rationale: R-EDIT-4.)*
- **R-OPD-EDIT-4**: toda acción que genere una combinación prohibida (tabla AP, §17) DEBE bloquearse antes de persistir o marcarse como error estructural recuperable; toda edición ambigua se bloquea hasta resolver identidad, firma o alcance. *(Rationale: R-EDIT-8, R-ESC-OP-3/4, R-APP-4.)*
- **R-OPD-EDIT-5**: al insertar subprocesos en una descomposición, los enlaces del padre migran automáticamente (o la herramienta valida y alerta): consumo al primero, resultado al último, el resto según §10.2; el modelador reasigna al subproceso real. Olvidar la migración crea enlaces superfluos que invalidan el modelo. *(Rationale: V-103/V-104; libro 21/22; metodologia §A3.)*
- **R-OPD-EDIT-6**: la herramienta DEBE rastrear los refinadores de cada refinable y ajustar automáticamente el símbolo (colección incompleta, contadores de plegado) y las oraciones OPL cuando la colección cambia. *(Rationale: opm-es notas de implementador; libro 17.)*
- **R-OPD-EDIT-7**: la herramienta DEBE permitir reanclar los extremos de un enlace estructural fundamental (compuesto triangular); la realización vigente lo ofrece solo vía inspector (sección Extremos) y el arrastre directo sobre el canvas es divergente: GAP-OPD-DRAG-TRIANGULO. *(Rationale: R-OPD-UI-3 — reanclaje por arrowhead-tools; V-129/V-130.)*

## §16 Configuración que afecta al OPD

- **R-OPD-CFG-1**: invariante rector — ninguna opción de presentación altera el hecho canónico: toda preferencia visual es proyección recortable (display-vs-canónico). *(Rationale: spec-forja-opl-es §16; V-0.)*
- **R-OPD-CFG-2**: toggles de vista por OPD admitidos: supresión de estados (global+local), plegado (normal/parcial/plegado), alias visibles, descripciones visibles, modo imagen; el OPL local refleja la vista. *(Rationale: V-86..V-90, V-116..V-120; implementación vigente.)*
- **R-OPD-CFG-3**: la densidad PUEDE degradar presentación sin tocar semántica (>35 enlaces → connector recto; minimizar el panel OPL en diagramas saturados). *(Rationale: R-OPD-LAY-6; spec-forja-opl-es R-OPL-PANEL-6.)*
- **R-OPD-CFG-4**: un preset de esencia primaria del sistema PUEDE fijar el default de esencia (reduce marcas redundantes); NO sobrescribe esencia explícita y exige serialización recuperable. *(Rationale: V-1, R-OBJ-5; metodologia §esencia-primaria.)*

## §17 Fallos, validación y marcas de diagnóstico

- **R-OPD-VAL-1**: política de **canvas limpio** (default): la validación no deja marcas persistentes sobre el OPD estático; el resultado vive en vistas auxiliares (panel de diagnóstico). Si una implementación opta por distintivos persistentes, los declara como gramática de vista separada, sin mezclarlos con designaciones de estado, simulación ni afordances de edición. *(Rationale: V-219, V-220, R-VIS-VAL-1.)*
- **R-OPD-VAL-2**: cinco familias de validación distinguibles: invalidez gramatical, advertencia metodológica, conflicto de unicidad/identidad, conflicto de contención/pertenencia, sugerencia automática/inferida. Las comprobaciones metodológicas y sugerencias (incl. inferidas) son vistas DERIVADAS, no parte del OPD canónico. *(Rationale: V-218, V-223.)*
- **R-OPD-VAL-3**: durante arrastre/creación, un enlace inválido PUEDE exhibir marcador transitorio de rechazo (p. ej. `×`); ese marcador NO pertenece al canon. Los canales de validación NO reutilizan: dash de afiliación, contorno grueso de refinamiento, marcas de simulación, decoraciones de enlace. *(Rationale: V-221, V-224.)*
- **R-OPD-VAL-4**: zona laxa — una construcción no prohibida ni canonizada se clasifica `no-canonizado` o `extensión declarada`, NUNCA como prohibición ontológica; el bloqueo se reserva a contradicción SSOT explícita o error de categoría. *(Rationale: R-APP-5, R-ZNC-1/2, R-AP-0C.)*
- **R-OPD-VAL-5**: anti-patrones del canon con realización en canvas/export que DEBEN bloquearse o reportarse (subconjunto visualmente significativo; el catálogo normativo completo AP-01..AP-30 vive en `reglas-opm-estrictas-es §11.1`; AP-18 — modificar referencia externa en el modelo consumidor — queda fuera de alcance hasta GAP-OPD-SUBMODELO-REF):

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

- **R-OPD-VAL-6**: la herramienta DEBERÍA detectar inconsistencias inter-OPD (un hecho que contradice a otro), advertir el cruce de eventos sistémicos, notificar la inclusión múltiple de un refinador y señalar la sub/sobre-especificación de enlaces (generales redundantes junto a especializados). *(Rationale: opm-es §815-§817/§1230; libro 20/21.)*

## §18 Catálogo formal normativo

Geometrías y valores vigentes de OPFORJA. Norma de lectura: la **estructura** de cada marca (forma, topología, conteo de trazos, dirección) es normativa; los valores cromáticos son tokens informativos (R-OPD-COSA-5) y los píxeles son la realización vigente (cambiables si preservan la distinción a cualquier zoom).

### §18.1 Paleta (tokens Codex)

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

### §18.2 Trazos, dashes y radios

| Magnitud | Valor | Significado |
| --- | --- | --- |
| stroke entidad / estado / enlace / estructural | 1.5 / 1.2 / 1 / 1.2 | base |
| stroke estado inicial | 3 | designación inicial |
| estado final | doble contorno (fill + rect interno stroke 1, padding 3) | designación final |
| stroke cosa refinada | 4 | contorno grueso de refinamiento |
| arco de abanico | 1.5, dash `4 1` | XOR=1 arco r30; OR=2 arcos r30/35 |
| afiliación ambiental | dash `8 4` | contorno discontinuo |
| proxy de extracción | dash `5 4` | enlace de vista inter-OPD |
| simulación: proceso activo / involucrada / estado current / estado resultado / enlace activo | dash `6 3` sw3 / `4 3` sw2 / `4 2` sw2 / `7 3` sw2 / `7 4` linecap round | canal runtime (crimson; resultado en color de objeto). *Enmienda 2026-06-11 (V-7): valores reconciliados con la realización vigente (`composers/halos.ts`, `composers/enlace.ts`).* |
| radio estado / badge control / chip `⋯N` | 8 / 9 (círculo 18×18) / alto÷2 | rountangle / letra `c·e·¬` / supresión |
| sombra física | dropShadow dx6 dy6 blur2 `rgba(23,21,17,0.68)` | esencia física |
| hit-area de enlace | wrapper transparente 15 px | interacción |

### §18.3 Marcadores (paths literales)

| Marcador | Geometría | Relleno |
| --- | --- | --- |
| Punta transformadora (consumo/resultado/efecto; terminal del rayo de invocación) | `M 0 0 L 23 8 L 12 0 L 23 -8 Z` (swallowtail, bbox 23×16) | paper, stroke ink |
| Piruleta agente / instrumento | `M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0` (palito 7 + círculo r5) | ink / paper |
| Triángulo estructural | `standard.Polygon` 30×30, refPoints `15,0 30,30 0,30` | agregación: ink; generalización: paper; exhibición: + triángulo interior 12×12 ink en (+9,+12); clasificación: + círculo r4 ink en (15,20) |
| Tagged unidireccional / bidireccional | polyline `0,0 20,-10 0,0 20,10` / arpón `0.5,0 20,±10` | abierto |
| Sobretiempo / subtiempo | polyline `4,10 13,-10` / `4,10 13,-10 8.5,0 17,0 13,10 22,-10` | trazo ink |
| Rayo de invocación | 4 vértices, offset perpendicular `min(22, max(12, len·0.08))`; autoinvocación: lazo a ±35°, pico `max(56, h·0.55)` | — |
| Glifos de estado | inicial: stroke 3 · final: doble contorno · default: flecha abierta entrante (vigente `↗`, GAP-OPD-DEFAULT-GLIFO) · current **declarado**: `●` interno en la cápsula (vigente; canon = glifo externo reservado pin, GAP-OPD-CURRENT-GLIFO; la marca de runtime NO es glifo: es anillo del canal de simulación, §18.2 y R-OPD-SIM-2) | — |

### §18.4 Z-order y tipografía

| Capa | z | Texto | Valor |
| --- | --- | --- | --- |
| contorno de refinamiento / proxy | 0 | rótulo de cosa | Inria Serif 17, proceso itálica |
| autoinvocación / enlace / bus | 1 / 4 / 4 | etiqueta de estado | serif itálica 13 |
| overlay abanico | 5 | etiquetas de enlace (verbo, multiplicidad, ruta, demora) | serif 11-12, ink/inkMid |
| entidad / triángulo / ramas | 10 / 12 / 13 | identificador `o.NN` | JetBrains Mono 9.5 (UI) |
| enlace a estado | 20 | badge control | serif 12 |
| halo selección / halos sim / halo selección de estado (UI) | 30 / 33-36 / 37 | wrap | >18 chars envuelve a ~132 px, sin elipsis |

## §19 Equivalencia bimodal y frontera modal

- **R-OPD-BIM-1**: OPD y OPL son dos **proyecciones del mismo hecho** (no dos modelos): toda afirmación gráfica es reproducible como OPL y toda oración OPL representable como constructo OPD; el constructo básico es la unidad de correspondencia. El conjunto de OPDs y la spec OPL son duales dentro del modelo; la clausura es local a cada modelo. *(Rationale: V-64, V-65, V-251, R-BI-0, R-BI-DUAL-1.)*
- **R-OPD-BIM-2**: el renderer **nunca es fuente de verdad**: proyecta el modelo a celdas; toda mutación entra por operaciones de modelo. Las celdas JointJS son adaptador desechable. *(Rationale: arquitectura deep-opm-pro; R-BI-2 — un parse sin firma OPD canónica se rechaza, no se inventa grafo.)*
- **R-OPD-BIM-3**: frontera semántico/ornamental. **Semánticos** (un cambio DEBE cambiar el hecho y su OPL): forma, contorno, sombra física, marcador/decoración de extremo, topología interna del triángulo, anclaje a estado, dirección del enlace, designaciones de estado, verticalidad de subprocesos en descomposición. **Ornamentales** (no emiten OPL): grid, handles, sombras decorativas, tokens de simulación, notas, alias decorativos, identificadores `o.NN`, etiqueta `SDx.y`, numeración, posición no-vertical-temporal, jumpover, estilado autoral. *(Rationale: R-EDIT-6/7, R-BR-3/4/5, R-BI-3; spec-forja-opl-es §19 display-vs-canónico.)*
- **R-OPD-BIM-4**: asimetrías modales declaradas — el **semi-plegado** y las marcas runtime no tienen plantilla OPL nuclear (expresión exclusivamente visual: esta spec es su única ley); a la inversa, la perseverancia no tiene glifo (la porta la forma). *(Rationale: V-116..V-120, R-BR-1/3.)*
- **R-OPD-BIM-5**: equivalencias visuales que el resaltado cruzado DEBE respetar: resultado-simple ≡ fan XOR por estados (V-19); bidireccional con tags idénticos ≡ recíproco (V-56); todos-los-estados ≡ estados-suprimidos (mismo hecho, distinta vista). *(Rationale: V-19, V-56, V-90; figuras ISO Fig 15/40/45.)*
- **R-OPD-BIM-6**: la tabla de bisimetría de `reglas-opm-estrictas-es §9.2` es el gate mínimo del roundtrip OPD↔OPL: toda construcción visual de esta spec emite la plantilla indicada y toda plantilla reconstruye el mismo hecho nuclear. *(Rationale: R-BI-TAB-1; enforcement en spec-forja-opl-es §19/§22.)*

## §20 Simulación visual

- **R-OPD-SIM-1**: el proceso en ejecución DEBE exhibir marca reservada de actividad distinta de toda marca persistente — en especial del contorno grueso de refinamiento; si ambos refuerzan contorno, DEBEN diferir en color/halo/distintivo. Realización opforja: halo elipse crimson sw3 dash `6 3` (z=35). *(Rationale: V-53, V-132, R-VIS-RUN-1.)*
- **R-OPD-SIM-2**: el estado actual de runtime se marca con canal visual reservado del runtime, distinto de inicial/final/default/`Current` declarado; la serialización DEBE distinguir designación declarada vs marca inducida por ejecución. Realización vigente *(enmienda 2026-06-11, V-7)*: current de runtime = anillo crimson dash `4 2` sw2 sobre la cápsula del estado (el pin ámbar/crimson fue retirado de canon); estado inicial = pin gota oliva-sim `#6B7B2A` desplazado para no solapar con el anillo current; canal runtime en z 33-37. *(Rationale: V-54, V-133, V-134, R-VIS-RUN-2.)*
- **R-OPD-SIM-3**: tokens transitorios de flujo sobre enlaces activos son runtime: NO pertenecen al canon-diagrama salvo export declarado como **snapshot de simulación**; no se confunden con piruletas/handles/anclas. Realización: token circular r5-6 animado por el path; enlace activo stroke crimson +1.5. *(Rationale: V-135, V-136, V-141, R-VIS-RUN-3A.)*
- **R-OPD-SIM-4**: estados operacionales adicionales (suspendido esperando input, completado reciente) usan marcas reservadas propias; un proceso suspendido NO es indistinguible de uno inactivo en snapshot. Modo síncrono: máximo una marca activa por hilo visible; asíncrono: múltiples. El modo headless no altera la gramática estática. *(Rationale: V-137..V-140, R-VIS-RUN-3B/3C/3E.)*
- **R-OPD-SIM-5**: semántica visible de la animación — el consumido desaparece al **inicio** del proceso; el afectado sale del estado de entrada al inicio y entra al de salida al completarse (en transición = indeterminado); el resultante existe al completarse; la condición incumplida se ve como paso **omitido** en la traza; el bucle sin salida se corta por límite de seguridad con diagnóstico visible (política de runtime, no hecho OPM). *(Rationale: V-49, R-VIS-CONS-1, R-EJEC-10; opm-es §746-751; metodologia §simulación-conceptual.)*
- **R-OPD-SIM-6**: el estado de runtime NO se persiste como canon conceptual salvo snapshot declarado; toda captura de simulación pausada no es evidencia de canonicidad (R-OPD-CAN-4). *(Rationale: R-EJEC-3, R-VIS-EXP-6.)*
- **R-OPD-SIM-7**: si un habilitador deja de existir durante la ejecución, el proceso se detiene y DEBE perder su marca de actividad (la elipse deja de exhibir el canal de proceso activo); el afectado queda en estado indeterminado salvo manejo de excepción. *(Rationale: V-10; opm-es §338.)*

## §21 Exportación canónica

- **R-OPD-EXP-1**: tres familias de salida — `canon-documento` (artefacto documental por modelo: portada, índice, árbol, diagramas, OPL, diccionarios, vistas derivadas), `canon-diagrama` (por OPD, preferentemente vectorial, sin handles/grid/overlays/toasts/chrome), previsualización raster (no canónica). Si un perfil rasteriza, declara resolución mínima que preserve dash, contornos, triángulos y rótulos. *(Rationale: V-225..V-233.)*
- **R-OPD-EXP-2**: el export parcial se declara como tal e identifica el subconjunto; watermarks/overlays editoriales no ocluyen primitivas; los recursos dependientes (bitmaps, sub-modelos, descripciones, código) se embeben, se referencian persistentemente o se declara su ausencia; el export de un modelo compuesto declara cómo resuelve referencias externas (sin depender de filesystem/sesión implícitos). *(Rationale: V-231, V-235, V-236, V-187, V-188.)*
- **R-OPD-EXP-3**: en el export canónico el estilado autoral se normaliza al esquema por defecto (salvo perfil contrario); los rótulos del grafo van en negro; el viewport se auto-ajusta (R-OPD-LAY-8). *(Rationale: V-217, V-228.)*

**Estado opforja** *(enmienda 2026-06-12, auditoría de coherencia del corpus)*: perfiles canónicos declarados (`serializacion/perfilesExport.ts`: `canon-diagrama`/`canon-documento`/`intercambio`, atributos por perfil); gate de densidad sobre export en triple superficie (`gateDensidadCanonica` subordina `exportarModeloConPerfil`/`emitirDocumentoCanonico`; `validarDensidadCanonDiagrama` cableado a `validarModelo`; la paleta deshabilita PNG/ZIP en OPD bloqueado); normalización de estilado en `mapaExport.ts` (`normalizarColoresSvg`, `removerChromeEdicionSvg`; verificación formal R-VIS-EXPORT-1A..1E/V-228, 2026-06-12). Residual: la exención «vista tipificada o refinamiento declarado» de R-OPD-LAY-2 no está realizada — el gate bloquea conservadoramente todo OPD >25 (depende de GAP-OPD-CATEGORIAS-OPD).

## §22 Trazabilidad y gaps

Esta sección consolida las trazas a implementación y los marcadores `GAP-OPD-*` de §1–§21. Es el insumo directo de la auditoría de alineación posterior (no de esta spec).

**R-OPD-AUD-1**: toda fila con estado `GAP-OPD-*` DEBE resolverse en la auditoría de alineación — cerrando el código, corrigiendo el documento subordinado (ui-forja), añadiendo el test, o reclasificando el hecho —. Ninguna fila se resuelve dentro de esta spec.

Leyenda: `alineado` (canon y realización coinciden) · `alineado-variante` (realización conforme dentro del margen que el canon permite) · `GAP-código` (canon sin realización o realización divergente) · `GAP-doc` (documento subordinado contradice esta spec) · `GAP-VERIFY` (traza declarada no confirmada).

### §22.1 Tabla maestra

| Sección | Constructo / Regla | Realización (archivo·símbolo) | Estado |
| --- | --- | --- | --- |
| §1 | Perfiles canon-diagrama/canon-documento (R-OPD-CAN-1) | `serializacion/perfilesExport.ts` (`PERFILES_EXPORT`, `ATRIBUTOS_DE_PERFIL`, `gateDensidadCanonica`, `emitirDocumentoCanonico`) | alineado (cierre 2026-06-11, `3a2db18c`) |
| §2 | 8 representaciones (forma×sombra×dash) | `composers/entidad.ts` | alineado |
| §2 | Rótulo íntegro con autosize (R-OPD-COSA-6) | `entidad.ts` (`ellipsis:false`, expansión) | alineado |
| §2 | Stick figure opcional para humanos (R-OPD-COSA-9) | — | no-canonizado · extensión opcional |
| §3 | Rountangle rx 8 + región inferior + layouts h/v | `composers/estados.ts` | alineado (deroga ui-forja §08 «pill») |
| §3 | Designación inicial / final | `entidad.ts` (sw3 / doble contorno) | alineado |
| §3 | Designación por defecto = flecha abierta entrante | `entidad.ts` (glifo `↗`) | GAP-OPD-DEFAULT-GLIFO (severidad baja/cosmética) |
| §3 | `Current` declarado: glifo externo reservado (pin) | `entidad.ts` (glifo `●` interno en la cápsula) | GAP-OPD-CURRENT-GLIFO |
| §3 | `Current` declarado: serialización distinta de runtime | `modelo/estadosDesignaciones.ts` (designación persistida, exclusión default/current) + `serializacion/validarEstados.ts` (unicidad por objeto) + round-trip `json-roundtrip-campos.test.ts`; runtime separado en `simulacion/tipos.ts·ContextoSimulacion.estadosCurrent` | alineado (V-237/V-238) |
| §3 | Supresión global+local + chip `⋯N` | `modelo/visibilidadEstados.ts`, `entidad.ts` | alineado |
| §4 | Swallowtail T1/T2/T3 + anclaje center+boundary | `linkAssets.ts`, `enlace.ts` | alineado |
| §4 | TS1..TS5 anclados a cápsula | `enlace.ts` (midSide sticky) | alineado |
| §5 | Piruletas agente/instrumento | `markers.ts`, `linkAssets.ts` | alineado |
| §5 | Restricción de agente a humanos | oferta condicionada por **esencia física** (proxy; sin tipo humano en el kernel) | GAP-OPD-AGENTE-HUMANO (alineado-variante) |
| §6 | Marcas `c/e/¬` minúsculas en badge | `markers.ts` | alineado-variante |
| §6 | Posición de la marca cerca del extremo proceso | `enlace.ts·distanciaProcesoParaModificador` (0.8 entrantes / 0.2 proceso-origen) | alineado (cierre 2026-06-11, `2766eb74`; residual estrecho: el efecto de entrada estado→proceso recibe 0.2 — junto al estado — porque la heurística decide por tipo, no por dirección) |
| §6 | Excepciones `/` y `//` | `linkAssets.ts` polylines | alineado |
| §6 | Arcos XOR (1) / OR (2) dashed en extremo común | `abanicoOverlay.ts` | alineado |
| §6 | Probabilidad de rama `Pr=p` | `enlace.ts·textoProbabilidad` (render `Pr = p`) | alineado (cierre 2026-06-11, `2766eb74`) |
| §6 | m-de-f junto al arco | — | GAP-OPD-FAN-M (sin anotación m) |
| §7 | Topología interna de los 4 triángulos | `markers.ts` | alineado (deroga ui-forja §08 cuadrado/círculo) |
| §7 | Colección incompleta (barra bajo triángulo) | — | GAP-OPD-COLECCION-INCOMPLETA |
| §7 | Marca `ordered` junto al triángulo (R-OPD-STR-5) | `composers/enlace.ts·etiquetaOrdenEstructural`, `agregacionBus.ts` | alineado · extensión declarada |
| §7 | Tagged uni/bi/recíproco + SSE (geometría) | `linkAssets.ts`, `enlace.ts` | alineado |
| §7 | Etiqueta de tagged en itálica (R-OPD-STR-8) | `enlace.ts·etiquetaTextoTagged` (fontStyle italic) | alineado (cierre 2026-06-11, `58b752e5`) |
| §7 | Plegado parcial + badge ▸/▾ + contadores | `composers/plegado.ts` | alineado-variante (filas en vez de íconos) |
| §8 | Rayo + autoinvocación ±35° + demora | `autoinvocacionLoop.ts`, `enlace.ts` | alineado |
| §8 | Duración dentro de la elipse (R-OPD-INV-6) | etiquetas `Min:/Max:/Rate` sobre enlace | GAP-OPD-DURACION-ELIPSE |
| §9 | Símbolos `? * +` y rangos en extremos | `enlace.ts` (distance 0.1/0.9) | alineado |
| §10 | Contenedor in-zoom (stroke 4, padding 16) + unfold externo | `entidad.ts` | alineado |
| §10 | Distribución/escisión por matriz §10.2 | `modelo/*` (migración al descomponer) | GAP-OPD-VERIFY (cobertura de matriz completa) |
| §10 | Identidad persistente de OPD vs `SDx.y` | árbol por `padreId`; ids DSL posicionales | GAP-OPD-VERIFY-IDS (acta 2026-06-04) |
| §10 | Categorías de OPD en metadato (V-244) | `Opd.vista` (`OpdVista`: requirement-view / submodel-view / generic-view) + `padreId` | alineado-variante (parcial) — residuo GAP-OPD-CATEGORIAS-OPD |
| §10 | Sub-modelo por referencia (DAG, V-176..) | fusión por interfaz (`modelo/composicion/interfaz.ts`) + referencia por snapshot materializado con ciclo de carga `syncState` per R-OPD-REF-18 (`modelo/submodelos.ts`, vista anclada read-only); referencia VIVA auto-sincronizada no | GAP-OPD-SUBMODELO-REF (techo T3) |
| §10 | Cosa duplicada en mismo OPD (silueta) | — | GAP-OPD-DUPLICADO |
| §11 | Router por familia + manhattan estructural | `enlace.ts`, `opcloudRouting.ts` | alineado |
| §11 | Grid suprimida en export canónico | grid = chrome DOM fuera del `<svg>` (el export serializa solo el svg: `mapaExport.ts·obtenerSvgPaper`); chrome interno removido por `removerChromeEdicionSvg` | alineado (verificación V-227, 2026-06-12, `ce690057`) |
| §11 | Gate de densidad sobre export (R-OPD-LAY-2) | `perfilesExport.ts·gateDensidadCanonica` + `perfilDiagrama.ts·perfilCanonDiagrama` (banda 21/25) + `validaciones.ts·validarDensidadCanonDiagrama` + paleta PNG/ZIP | alineado-variante (cierre 2026-06-11, `3a2db18c`; exención vista tipificada/refinamiento no realizada — depende de GAP-OPD-CATEGORIAS-OPD) |
| §11 | Canvas infinito + compensación de scroll | `JointCanvas.tsx` | alineado |
| §12 | Notas de mesa = contenido meta del autor (R-OPD-ROT-7) | `modelo/notasMesa.ts` (excluidas del perfil `canon-diagrama`) | alineado · extensión declarada |
| §12 | Estereotipos: `<<Nombre>>` + catálogo/vitrinas/injerto (R-OPD-ROT-6) | `modelo/estereotipos.ts`, `modelo/operaciones/injertoEstereotipo.ts`, `composers/entidad.ts` | alineado · extensión declarada (D6, verificado en vivo 2026-06-23) |
| §12 | Anclaje a Pieza + chip Centinela 3 estados (R-OPD-ROT-9) | `modelo/operaciones/anclaje.ts`, `modelo/submodelos/firmaSemantica.ts`, `store/modelo/acciones-anclaje.ts` | alineado · extensión declarada (Centinela+PUERTA+C4, desplegados 2026-06-29/30) |
| §13 | Canal UI crimson + selección/marquee/anclas | `halos.ts`, `rubberBand.ts`, `entidad.ts` | alineado |
| §13 | Feedback de modo enlace en canal reservado | paleta legacy OPCloud en `modoEnlace.ts` | GAP-OPD-FEEDBACK-LEGACY |
| §14 | Resaltado cruzado por referencia tipada | `halos.ts` + spec-forja-opl-es §14 | alineado |
| §15 | Validación de firma + bloqueo de AP | operaciones de modelo + diagnóstico | alineado |
| §15 | Drag de extremos de estructurales en canvas | inspector Extremos OK; drag roto | GAP-OPD-DRAG-TRIANGULO (BUG-fb6c2c) |
| §10/§15 | Proxy de extracción tokenizado | hex `#98a2b3` directo | GAP-OPD-PROXY-TOKEN |
| §20 | Marcas de simulación (halo, pines, token) | `halos.ts`, `enlace.ts` | alineado |
| §21 | Normalización de estilado en export | `mapaExport.ts·normalizarColoresSvg` / `removerChromeEdicionSvg` | alineado (verificación R-VIS-EXPORT-1A..1E/V-228, 2026-06-12) |
| — | ui-forja/08 §3 estado pill · §4.2/§10 exhibición-cuadrado/instancia-círculo · §0 straight-only | documento subordinado | GAP-OPD-UIFORJA-08a/b/c (mitad doc cumplida 2026-06-12: ui-forja/08 reconciliado por remisión; residual: realización en código) |
| — | Diagrama de vida útil (lifespan) | — | no-canonizado-pendiente (vista derivada opcional) |
| — | Port folding (operación al contorno del exhibidor) | — | no-canonizado · extensión futura declarada |

### §22.2 Índice de GAPs

| GAP | Origen | Descripción de una línea |
| --- | --- | --- |
| GAP-OPD-AGENTE-HUMANO | §5 | La exclusividad humana del agente se aproxima por esencia física; el kernel no tiene tipo humano (enforcement estricto no exigible hoy). |
| GAP-OPD-DEFAULT-GLIFO | §3 | Estado por defecto con `↗` en vez de flecha abierta entrante canónica (severidad baja/cosmética). |
| GAP-OPD-CURRENT-GLIFO | §3 | `Current` declarado con glifo `●` interno en la cápsula en vez del glifo externo reservado (pin) canónico; a converger o a declarar como variante de perfil (espejo de GAP-OPD-DEFAULT-GLIFO). |
| GAP-OPD-VERIFY | §10 | Traza no confirmada: cobertura completa de la matriz de distribución. |
| GAP-OPD-FAN-M | §6 | Sin anotación `m` junto al arco para «exactamente/al menos m de f». |
| GAP-OPD-COLECCION-INCOMPLETA | §7 | Barra horizontal corta bajo el triángulo no realizada. |
| GAP-OPD-DURACION-ELIPSE | §8 | Duración como etiquetas de enlace; canon = dentro de la elipse `[u] {min, esp, max}`. |
| GAP-OPD-CATEGORIAS-OPD | §10 | Residuo: la categoría jerárquica es implícita (vista ausente; la exclusividad mutua la garantiza el campo discriminado) y Mapa del Sistema no está realizado como OPD-con-metadato (es vista de workbench efímera). |
| GAP-OPD-VERIFY-IDS | §10 | Identidad persistente de OPD frente a ids posicionales del DSL de autoría (V-248/V-249; acta 2026-06-04). |
| GAP-OPD-SUBMODELO-REF | §10 | Referencia viva a sub-modelos (DAG cross-model auto-sincronizado) no implementada; existen fusión por interfaz y referencia por snapshot congelado con detección de obsolescencia (`syncState`). |
| GAP-OPD-DUPLICADO | §10 | Apariencia duplicada de la misma cosa en un mismo OPD (silueta desplazada) no soportada. |
| GAP-OPD-FEEDBACK-LEGACY | §13 | Feedback de modo enlace con paleta OPCloud brillante fuera del canal UI reservado. |
| GAP-OPD-DRAG-TRIANGULO | §15 | Arrastre de extremos de estructurales fundamentales roto en canvas (BUG-fb6c2c). |
| GAP-OPD-PROXY-TOKEN | §10/§15 | Proxy de extracción con gris hex directo fuera de tokens. |
| GAP-OPD-UIFORJA-08a/b/c | Precedencia | ui-forja/08 contradecía el canon en estado-pill, marcadores de exhibición/instanciación y connector straight-only. Mitad documental CUMPLIDA 2026-06-12 (ui-forja/08 reconciliado por remisión a esta spec; GOVERNANCE v1.2); residual: realización en código (estado-pill, marcadores exhibición/instancia, straight-only). |

### §22.3 Cobertura inversa

Superficie auditada: `app/src/render/jointjs/**` (composers, linkAssets, markers, abanicoOverlay, autoinvocacionLoop, opcloudRouting, sortStructuralLinks, agregacionBus, plegado, halos, grid, rubberBand, JointCanvas) y `app/src/canvas/**` (grid, layoutRadial, modoEnlace, coloresCanon). Todos los símbolos visuales exportados quedaron trazados en §2–§21; no se detectaron símbolos sin entrada (`GAP-spec` = 0). Los assets de evidencia (`assets/svg/**`, `opm-extracted/**`) son referencia de ingeniería inversa, no superficie de conformidad.

## §23 Invariantes

### §23.1 Invariantes prescriptivos del documento

| Invariante | Enunciado | Verificación |
| --- | --- | --- |
| **R-§23-PRESC-CONS** Consistencia interna | NO DEBEN coexistir reglas incompatibles sin cláusula de precedencia explícita. | manual |
| **R-§23-PRESC-AUTO** Auto-suficiencia | Cada regla DEBE entenderse con su contexto local (sección + `Rationale:`). | manual |
| **R-§23-PRESC-CIRC** No-circularidad | Toda cadena de remisión DEBE terminar en fuente sustantiva (SSOT, figura ISO, código, test). | manual |
| **R-§23-PRESC-LANG** Idioma | es-CL; anglicismos solo para términos técnicos inevitables (`swallowtail`, `marker`, `fan`). | lint/manual |
| **R-§23-PRESC-ENF** Enforcement declarado | Toda tabla de validación DEBE incluir columna `Enforcement`. | lint |
| **R-§23-PRESC-INTEG** Integridad del perfil | Cierre con tríada Invariantes→Validación→Migración; trazabilidad solo con `Rationale:`. | manual |

### §23.2 Invariantes visuales del dominio

| Invariante | Enunciado | Origen |
| --- | --- | --- |
| **R-§23-OPD-VOCAB** Vocabulario visual cerrado | Formas, contornos, sombras, marcadores y marcas pertenecen a un conjunto cerrado; ningún glifo libre es gramática. | §1–§9 |
| **R-§23-OPD-TOPO** Color informativo, topología normativa | La semántica vive en forma, contorno, sombra, dirección y topología interna; nunca solo en el color. | §2, §7 |
| **R-§23-OPD-CANAL** Canales reservados | Gramática, simulación, validación y UI usan canales separados sin ambigüedad; reutilizar un recurso sin distinción perceptible es no conforme. UI y simulación PUEDEN compartir el hue crimson porque se separan por dash, glifo, posición y z, y porque la simulación no persiste en canon (snapshot declarado): la disyunción exigida se cumple en el plano canónico. | §1, §13, §17, §20 |
| **R-§23-OPD-EXPORT** Canon por persistencia | Es gramática lo que persiste en export canónico declarado; lo demás es afordance. | §1, §21 |
| **R-§23-OPD-TIEMPO** Verticalidad temporal | En descomposición de proceso la coordenada vertical ES el tiempo; todo layout la preserva. | §8, §10, §11 |
| **R-§23-OPD-PROY** Proyección, no verdad | El renderer proyecta el modelo; identidad ≠ etiqueta de navegación ≠ posición. | §10, §19 |
| **R-§23-OPD-BIM** Dualidad bimodal | Todo hecho visual semántico tiene espejo OPL salvo asimetrías declaradas (semi-plegado, runtime). | §19 |

## §24 Validación

Valores de `Enforcement`: `schema`, `lint`, `runtime`, `eval`, `manual`.

| Clase de regla | Cómo se verifica | Artefacto | Enforcement |
| --- | --- | --- | --- |
| Geometría y marcas (§2–§9, §18) | unit sobre composers/markers: paths, dashes, strokes, designaciones | `app/src/render/jointjs/**/*.test.ts` | eval |
| Leyes de proyección (renderer no-fuente-de-verdad, §19) | leyes ejecutables de proyección y undo | `app/src/leyes/*.test.ts` | eval |
| Refinamiento y distribución (§10) | unit de kernel (visibilidad, supresión, frontera, aciclicidad) | `app/src/modelo/**/*.test.ts` | eval |
| Interacción y canvas (§13–§15) | smoke e2e Playwright | `app/e2e/*.spec.ts` | eval |
| Estética y canal UI (§13, §18) | gate de governance de diseño | `bun run design:governance` | lint |
| Conformidad in-vivo (§2–§13) | auditoría visual sobre dev server | `bun run visual:audit` / `visual:deep` | runtime |
| Anti-patrones AP (§17) | diagnóstico del kernel + bloqueos de edición | `modelo/diagnostico*`, validadores | runtime |
| Cobertura de GAPs (§22) | rastreo de `GAP-OPD-*` contra cierres | auditoría de alineación | manual |
| Conformidad KORA/MD familia `spec` (§23.1) | tríada presente; frontmatter; `Rationale:` | `kora check --strict` + revisión | lint, manual |

- **R-§24-ENF-1**: toda fila de toda tabla de validación DEBE declarar su `Enforcement`; los enforcement automáticos apuntan a un artefacto ejecutable concreto y `manual` nombra el procedimiento.

## §25 Migración

Major bump **1.0.0**: esta spec consolida en un documento autoritativo lo que vivía disperso, y cambia la fuente de verdad operativa de lo visual en OPFORJA.

Minor bump **1.1.0** (enmienda 2026-06-12, auditoría de coherencia del corpus; precedente formal de la enmienda V-7/1.0.4): cierre de GAPs ya implementados (PERFIL-EXPORT, EXPORT-GATE, TAGGED-ITALIC, PROB-NOTACION, POS-MODIFICADOR) con traza de código y commits; verificación de trazas GAP-OPD-VERIFY (serialización `Current` declarado, supresión de grid en export); reclasificación GAP-OPD-CURRENT-GLIFO (espejo del trato a DEFAULT-GLIFO); saneo anti-postmortem de R-OPD-EDIT-7 y separación kernel/realización en R-OPD-LAY-10 y R-OPD-UI-3/4; alineación de R-OPD-TR-8/R-OPD-STR-10/AP-25 con reglas R-PROC-2A/5..7; marca de extensión declarada en R-OPD-STR-5; declaración de las notas de mesa como contenido meta excluido de `canon-diagrama` (R-OPD-ROT-7).

Minor bump **1.2.0** (enmienda 2026-07-06, HITL custodio; ratifica los working-artifacts de deep-opm-pro `2026-06-22-estereotipos-vitrinas-ssot-skill.md` y `2026-06-29-anclaje-forma-doctrina.md`): ampliación de R-OPD-ROT-6 (estereotipos: mención OPL PUEDE con ausencia conforme del OPL nuclear, prohibición de estereotipos de enlace como sexta familia encubierta, realización opforja del catálogo/vitrinas/injerto como extensión declarada con traza) y alta de R-OPD-ROT-9 (Anclaje a Pieza: chip Centinela de tres estados en TINTA, estatuto meta sin OPL nuclear, anclar no muta esencia, referencia-a-snapshot evolutivo a grano biblioteca/`frozenAtPieza`, edición local de esencia legislada en vista laxa — el drift la hace visible, el rigor estricto queda como adopción aditiva futura).

Minor bump **1.3.0** (enmienda 2026-07-07): incorpora el arranque bottom-up
como OPDs no raíz con `padreId:null`, originalmente proyectados con la voz
«Taller / Adoptar». Esa voz queda como antecedente histórico y es reemplazada
por 1.4.0.

Minor bump **1.4.0** (enmienda 2026-07-27): alinea R-OPD-REF-14/20 y
R-OPD-ROT-2 con el contrato reversible de producto. La UI reserva Taller para
documentos Apunte y usa Bocetos, Integrar como… y Devolver a Bocetos para el
estado local del OPD; Eliminar refinamiento permanece destructivo. La
canonicidad ya no se legisla aquí: se delega a
`reglas-opm-estrictas-es` R-CAN-BOCETO-1..4. Los identificadores internos
`adoptarOpd`, `gateOpdsSinAdoptar` y `origen:"adopcion"` se conservan por
compatibilidad.

### §25.1 Qué cambia

| Antes | Ahora |
| --- | --- |
| Lo visual repartido entre `opd-es` (gramática general), `reglas-opm-estrictas` (prescripciones), ui-forja/08 (apariencia JointJS) y el código | `spec-forja-opd-es` es la SSOT visual operativa única de OPFORJA |
| ui-forja/08 legislaba marcadores y formas sin subordinación declarada | ui-forja conserva estética/chrome; en semántica visual OPM queda bajo esta spec |
| La implementación se alineaba contra canon implícito | se alinea contra esta spec vía la tabla §22 |

### §25.2 Qué migrar

- **R-§25-MIG-1**: la implementación (`app/src/render/jointjs`, `app/src/canvas`) DEBE alinearse contra esta spec usando §22; toda divergencia es deuda a cerrar. Ante conflicto, `reglas-opm-estrictas-es` sigue por encima (regla de oro 1 del proyecto).
- **R-§25-MIG-2**: `ui-forja/08-jointjs-styling.md` (y GOVERNANCE donde corresponda) DEBE corregirse según GAP-OPD-UIFORJA-08a/b/c, declarando la subordinación de su materia OPM-semántica a esta spec. *(Cumplida en su mitad documental 2026-06-12: `ui-forja/08` reconciliado por remisión y GOVERNANCE elevado a v1.2 con esta spec en su cadena de precedencia; el residual es de realización en código.)*
- **R-§25-MIG-3**: los `GAP-OPD-*` entran al backlog de alineación como corte propio; se cierran vía código+tests (§24), no vía notas sueltas.

### §25.3 Qué se deprecia

- **R-§25-DEP-1**: SE DEPRECIA consultar fuentes dispersas (`opd-es` + `reglas` + ui-forja/08) como ruta primaria para resolver lo visual de OPFORJA. Esas fuentes SE CONSERVAN como canon superior y `Rationale:`; la ruta operativa primaria es este documento.
- **R-§25-DEP-2**: NO SE ADMITE redactar reglas visuales nuevas de OPFORJA fuera de esta spec; toda regla nueva entra aquí con su `Rationale:` y su `Enforcement`.

## Apéndice A — Mapa de cobertura contra opd-es (V-0..V-263)

| Rango V | Materia | Sección de esta spec |
| --- | --- | --- |
| V-0..V-0e | regla rectora, perfiles, UI transitoria | §1 |
| V-1..V-3, V-63, V-124..V-131 | cosas, color, sombra, triángulos | §2, §7 |
| V-4..V-9, V-67/V-68, V-237/V-238 | estados, designaciones, state-specific | §3 |
| V-10..V-13, V-49 | habilitadores, eventos, consumo temporal | §5, §6, §20 (V-10 → R-OPD-SIM-7) |
| V-47, V-115 | rotulado sin ambigüedad; proceso transformador mínimo | §12 (R-OPD-ROT-3/5), §4 (R-OPD-TR-8) |
| V-14..V-23 | lógicos, rutas, multiplicidad | §6, §9 |
| V-24..V-30, V-56..V-58, V-72..V-76 | estructurales, herencia, instancias | §7 |
| V-31..V-46, V-53..V-55, V-59..V-62 | invocación, duración, timeline, in-zoom, SD | §8, §10 |
| V-50..V-52 | densidad, oclusión, apariencias | §11, §10 |
| V-64..V-66, V-251 | modelo, constructos, dualidad | §19, §10.4 |
| V-69..V-71, V-77..V-120 | refinamiento completo, distribución, escisión, supresión, semi-plegado | §10, §7.3, §3.3 |
| V-121..V-123 | rotulado, alias, existencia/apariencia | §12, §10.4 |
| V-132..V-141 | simulación visual | §20 |
| V-142..V-175 | estereotipos, slots, computacional, requisitos | §12 (R-OPD-ROT-6; capa computacional citada, no re-legislada) |
| V-176..V-189, V-252..V-256 | composición inter-modelo | §10.4 |
| V-190..V-199 | piruletas/handles, grid, viewport | §5, §11, §13 |
| V-200..V-224 | modos, UI, estilado, validación | §1, §13, §12, §17 |
| V-225..V-236 | exportación canónica | §21 |
| V-239..V-250 | familias, identidad de OPD, canales | §4, §10.4 |
| V-257..V-263 | operaciones auxiliares (Bring) | §10.4 (R-OPD-REF-19) |

Reglas de opd-es NO operacionalizadas aquí (siguen vigentes en la capa general, fuera del alcance opforja actual): capa computacional plena (V-163..V-175 detalle de slots/código), vistas de requisitos completas (V-254/V-255 más allá del estereotipo), perfil v1-compat. Su adopción futura entra por minor bump.

## Apéndice B — Ejemplo end-to-end (visual)

Modelo «Lavado de Platos», SD: **Usuario Doméstico** (rect verde, físico sistémico: sombra, trazo continuo) maneja *Lavar Platos* (elipse azul, piruleta negra); *Lavar Platos* requiere **Lavavajillas** (piruleta blanca) y consume **Jabón** (swallowtail hacia la elipse); afecta **Conjunto de Platos** (swallowtail doble) cuyo rountangle muestra `sucio` y `limpio` (cápsulas oliva; `sucio` inicial = borde grueso). En SD1, *Lavar Platos* aparece como contenedor (stroke 4, elipse inflada): *Cargar* arriba, *Limpiar* al medio, *Descargar* abajo (tiempo ↓); el efecto se escinde — `sucio`→*Cargar* y *Descargar*→`limpio`; **Lavavajillas** (externo) distribuye su piruleta blanca a los tres; el evento del usuario no cruza la frontera. El chip `⋯N` aparece en SD si `limpio` se suprime allí y se expresa en SD1. El OPL espejo de cada hecho es el de `spec-forja-opl-es` Apéndice A.

## Apéndice C — Índice de IDs de esta spec

| Área | IDs | Sección |
| --- | --- | --- |
| R-OPD-CAN-1..5 | regla rectora y perfiles | §1 |
| R-OPD-COSA-1..9 | cosas | §2 |
| R-OPD-EST-1..10 | estados | §3 |
| R-OPD-TR-1..8 | transformadores | §4 |
| R-OPD-HAB-1..4 | habilitadores | §5 |
| R-OPD-CTL-1..12 | control y lógica | §6 |
| R-OPD-STR-1..13 | estructurales | §7 |
| R-OPD-INV-1..9 | invocación y tiempo | §8 |
| R-OPD-MUL-1..5 | multiplicidad | §9 |
| R-OPD-REF-1..20 | refinamiento y contexto | §10 |
| R-OPD-LAY-1..10 | layout y routing | §11 |
| R-OPD-ROT-1..9 | composición y rotulado | §12 |
| R-OPD-UI-1..6 | canvas e interacción | §13 |
| R-OPD-INT-1..3 | puente OPD↔OPL (lado canvas) | §14 |
| R-OPD-EDIT-1..7 | edición visual | §15 |
| R-OPD-CFG-1..4 | configuración | §16 |
| R-OPD-VAL-1..6 | validación visual | §17 |
| R-OPD-BIM-1..6 | equivalencia bimodal | §19 |
| R-OPD-SIM-1..7 | simulación visual | §20 |
| R-OPD-EXP-1..3 | exportación | §21 |
| R-OPD-AUD-1 · R-§23-* · R-§24-ENF-1 · R-§25-* | trazabilidad, invariantes, validación, migración | §22–§25 |
