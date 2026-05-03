---
epica: "EPICA-20"
titulo: "Estructura — arbol OPD (navegacion, orden, gestion, vistas derivadas)"
doc_fuente: "opcloud-reverse/20-estructura-opd-tree.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M0"
hu_emitidas: 22
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
---

## Resumen

Esta epica cubre la **estructura jerarquica de OPDs** del modelo — el arbol lateral que organiza los diagramas de un modelo OPM como un bosque anclado en la raiz `SD` (Diagrama de Sistema), con hijos automaticos generados por operaciones de refinamiento (descomposicion, despliegue-por-partes, despliegue-por-caracteristicas, despliegue-por-especializacion) y nietos anidados recursivamente. El arbol es a la vez **vista de navegacion** (clic cambia OPD activo) y **estructura administrable** (renombrar, eliminar hojas, reordenar, cortar/pegar, buscar).

El arbol tiene tres comportamientos invariantes:

1. **Sincronizacion con canvas activo** — el OPD mostrado en el canvas corresponde al nodo resaltado del arbol; navegar por el arbol cambia el canvas.
2. **Integridad jerarquica fuerte** — los nodos internos no se pueden eliminar directamente; solo hojas.
3. **Orden acoplado al canvas (opcional)** — en modo `Automatic`, el orden de hermanos y la numeracion `SDx.y` derivan del layout vertical del padre descompuesto.

La epica abarca: arbol como panel lateral, nodos SD/SDn/SDn.m automaticos, doble clic para navegar, badges de tipo de refinamiento, reorder manual vs automatico, rename y delete con cascada, `OPD Tree Management` avanzado (Ctrl+D), navegacion por teclado, busqueda, breadcrumb, y la seccion adyacente de `Views` (Create View / Create Unfolded Tree View) como proyecciones derivadas del modelo complementarias al arbol.

Las HU se numeran siguiendo el orden de aparicion en el doc fuente (§2 superficies, §3 flujos, §5 controles, §11 views). La correspondencia con secciones del doc fuente se documenta en cada HU en `Notas de evidencia`.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-20.001 | Ver arbol OPD persistente en panel lateral izquierdo | MN | M0 | S | mixto | [opm-iso-19450-es.md §Navegacion de OPD] |
| HU-20.002 | Ver nodo raiz SD al abrir modelo nuevo | MN | M0 | XS | opm-semantica | [opm-iso-19450-es.md §Diagrama de Sistema] |
| HU-20.003 | Generar nodo hijo automatico al ejecutar descomposicion | MN | M0 | M | mixto | [opm-iso-19450-es.md §Refinamiento por descomposicion] [V-69] |
| HU-20.004 | Generar nodo hijo automatico al ejecutar despliegue | MN | M0 | M | mixto | [opm-iso-19450-es.md §Refinamiento por despliegue] [V-69] |
| HU-20.005 | Identificar tipo de refinamiento por sufijo del nodo | MN | M0 | S | opcloud-ui | — |
| HU-20.006 | Anidar nietos recursivamente en jerarquia SDn.m | ME | M0 | S | opm-semantica | [opm-iso-19450-es.md §Jerarquia de OPDs] |
| HU-20.007 | Navegar a OPD con clic en nodo del arbol | MN | M0 | S | mixto | [opm-iso-19450-es.md §Navegacion de OPD] |
| HU-20.008 | Sincronizar canvas con nodo seleccionado del arbol | MN | M0 | S | mixto | [opm-iso-19450-es.md §Navegacion de OPD] |
| HU-20.009 | Navegar por teclado con Ctrl+Up / Ctrl+Down | ME | M1 | S | opcloud-ui | — |
| HU-20.010 | Ajustar ancho del panel arbol con divisor arrastrable | ME | M1 | XS | opcloud-ui | — |
| HU-20.011 | Abrir menu contextual del arbol con clic derecho | ME | M1 | S | opcloud-ui | — |
| HU-20.012 | Expandir o colapsar todo el arbol de una vez | ME | M1 | XS | opcloud-ui | — |
| HU-20.013 | Alternar entre Hide Names y Show Names | RV | C | XS | opcloud-ui | — |
| HU-20.014 | Renombrar OPD desde el arbol | ME | M1 | S | mixto | [opm-iso-19450-es.md §Identificacion de OPD] |
| HU-20.015 | Eliminar solo nodos hoja del arbol | ME | M0 | M | opm-semantica | [opm-iso-19450-es.md §Integridad jerarquica] |
| HU-20.016 | Impedir eliminacion de nodos internos con mensaje claro | ME | M0 | S | mixto | [opm-iso-19450-es.md §Integridad jerarquica] |
| HU-20.017 | Reordenar hermanos manualmente con arrastre en el arbol | ME | S | M | opcloud-ui | — |
| HU-20.018 | Reordenar hermanos automaticamente segun canvas del padre | ME | S | M | mixto | [opm-iso-19450-es.md §Orden de refinamiento] |
| HU-20.019 | Configurar modo Automatic vs Manually en preferencias | AO | S | S | opcloud-ui | — |
| HU-20.020 | Abrir OPD Tree Management con Ctrl+D | ME | S | M | opcloud-ui | — |
| HU-20.021 | Buscar OPD por nombre o numero en management | ME | S | S | opcloud-ui | — |
| HU-20.022 | Cortar y pegar nodos en OPD Tree Management | ME | S | L | opcloud-ui | — |

Total: **22 historias de usuario** (4 opm-semantica, 11 opcloud-ui, 7 mixto).

## Historias de usuario

### HU-20.001 — Ver arbol OPD persistente en panel lateral izquierdo

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME (experto — lo usa para saltar), RV (revisor — lo usa para navegar lectura).
**Tipo:** mixto.
**Nivel categorico:** L (lente — lectura derivada del modelo) primario; U (UI panel) secundario.
**Superficie UI:** left-pane + opd-tree.
**Gesto canonico:** ninguno (render persistente).

**Historia:**
> Como modelador, quiero ver el arbol OPD permanentemente en el panel lateral izquierdo para navegar la estructura jerarquica del modelo sin abrir dialogos.

**Contexto de negocio:**
El arbol OPD es el **mapa primario** del modelo. Sin el, el modelador pierde contexto en cuanto hay mas de un OPD: no hay forma rapida de saber donde esta ni que refinamientos existen. Mantenerlo siempre visible es una decision de diseno que convierte al arbol en orientador permanente de la sesion.

**Criterios de aceptacion:**
- **Dado** que abro cualquier modelo, **cuando** se carga la UI, **entonces** el panel izquierdo muestra el arbol OPD de inmediato.
- **Dado** que el arbol esta visible, **cuando** el modelo tiene un solo OPD, **entonces** el arbol muestra solo el nodo raiz `SD`.
- **Dado** que el modelo tiene multiples OPDs, **cuando** se renderiza el arbol, **entonces** cada OPD aparece como nodo con su numeracion jerarquica (`SD`, `SD1`, `SD1.1`, etc.).
- **Dado** que el panel esta visible, **cuando** cambio de OPD desde otro lugar (canvas, shortcut), **entonces** el nodo correspondiente del arbol se resalta.

**Reglas y restricciones:**
- El panel del arbol es **siempre visible** por default; su ancho es ajustable (HU-20.010) pero no se oculta completamente salvo por preferencia explicita.
- El arbol se renderiza como vista pura del modelo; no mantiene estado propio.

**Modelo de datos tocado:**
- Ninguno directo; es lectura de `opd.id`, `opd.parent_id`, `opd.children_order`, `opd.display_name`.

**Dependencias:**
- Bloquea a: HU-20.002, HU-20.003, HU-20.004, HU-20.007, HU-20.008 (todas asumen panel visible).

**Integraciones:**
- Lente del modelo (reactivo a cambios de OPD).
- Tab superior (HU-10.022) para coherencia de identidad de modelo.

**Notas de evidencia:**
- Fuente normativa: [opm-iso-19450-es.md §Navegacion de OPD] — la SSOT exige navegacion entre OPDs; el arbol persistente es implementacion OPCloud.
- Fuente OPCloud: `opcloud-reverse/20-estructura-opd-tree.md` §2 tabla "OPD tree del left pane".
- Frames: 19/frame_00005, 19/frame_00011.
- Clase de afirmacion: observado.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [estructura, ui, panel-lateral, arbol, lente].

---

### HU-20.002 — Ver nodo raiz SD al abrir modelo nuevo

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L primario; K (el SD como primitiva estructural).
**Superficie UI:** opd-tree.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador novato, quiero ver el nodo raiz `SD` en el arbol apenas abro un modelo nuevo para tener un punto de inicio claro.

**Contexto de negocio:**
El `SD` (Diagrama de Sistema) es la raiz canonica de todo modelo OPM segun la SSOT. Todo modelo tiene exactamente un SD; los demas OPDs cuelgan de el por refinamiento. Mostrar el SD desde el inicio ancla la mentalidad jerarquica del modelador y deja clara la topologia del bosque (que en realidad es un arbol unico con raiz SD).

**Criterios de aceptacion:**
- **Dado** que abro un modelo nuevo (o ejecuto "New Model"), **cuando** se carga la UI, **entonces** el arbol muestra un unico nodo llamado `SD`.
- **Dado** que el nodo `SD` es el unico, **cuando** miro el arbol, **entonces** no tiene boton de expansion (no hay hijos).
- **Dado** que el modelo esta vacio, **cuando** miro el canvas, **entonces** muestra el OPD `SD` (vacio).
- **Dado** que creo la primera cosa en el canvas, **cuando** la cosa persiste, **entonces** pertenece al OPD `SD` (no genera nodo nuevo en el arbol).

**Reglas y restricciones:**
- El nodo raiz se llama `SD` por convencion OPM canonica.
- El SD es **inmutable como raiz**: no se puede eliminar (ver HU-20.015, HU-20.016) ni mover.
- El SD no puede tener hermanos (no existen "SD2" al nivel raiz).

**Modelo de datos tocado:**
- `opd.id = "sd-root"` (o equivalente) — persistente.
- `opd.parent_id = null` para el SD raiz.
- `opd.display_name = "SD"`.

**Dependencias:**
- Bloqueada por: HU-20.001.
- Bloquea a: HU-20.003, HU-20.004 (refinamientos necesitan una raiz existente).

**Integraciones:**
- Kernel (`src/nucleo/`) define SD como primitiva estructural inicial.
- Persistencia: un modelo nuevo se crea con SD preinicializado.

**Notas de evidencia:**
- Fuente normativa: [opm-iso-19450-es.md §Diagrama de Sistema] — SD es la raiz canonica de todo modelo OPM.
- Fuente OPCloud: §3.1 "arbol lateral lista jerarquia SD, SD1, SD1.1, etc.".
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [estructura, arbol, sd-root, kernel].

---

### HU-20.003 — Generar nodo hijo automatico al ejecutar descomposicion

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario (crea OPD hijo) con side-effects en L (arbol), V (canvas nuevo).
**Superficie UI:** opd-tree (aparicion del nodo) + canvas (OPD hijo visible).
**Gesto canonico:** ninguno (automatico post-descomposicion; el gesto canonico de la descomposicion vive en EPICA-12).

**Historia:**
> Como modelador, quiero que al hacer descomposicion sobre un Proceso se cree automaticamente un nodo hijo `SDn: X descompuesto` en el arbol para reflejar el refinamiento sin gestionar el arbol a mano.

**Contexto de negocio:**
El arbol OPD es un **efecto declarativo** del grafo de refinamientos, no una estructura paralela. Cada operacion de refinamiento (descomposicion, despliegue) genera un OPD nuevo que automaticamente aparece como nodo hijo del OPD donde se ejecuto la operacion. El sufijo del nodo codifica la forma de refinamiento (ver HU-20.005).

**Criterios de aceptacion:**
- **Dado** que estoy en el OPD `SD` con un Proceso `X`, **cuando** ejecuto descomposicion sobre `X` (delegado a EPICA-12), **entonces** se crea un OPD nuevo con nombre `SD1: X descompuesto` y aparece como nodo hijo de `SD` en el arbol.
- **Dado** que ya existen `SD1` y `SD2` como hijos de `SD`, **cuando** hago descomposicion a un tercer Proceso, **entonces** el nodo nuevo recibe numeracion `SD3` (siguiente disponible en el rango del padre).
- **Dado** que hice descomposicion dentro de `SD1`, **cuando** se crea el OPD nieto, **entonces** su numeracion es `SD1.1` (respeta la jerarquia anidada — ver HU-20.006).
- **Dado** que se creo el nodo, **cuando** el arbol se actualiza, **entonces** el padre muestra boton de expansion y el nuevo nodo queda seleccionado (canvas cambia al OPD hijo).

**Reglas y restricciones:**
- Numeracion canonica: `SD`, `SD1`, `SD2`, …, `SD1.1`, `SD1.2`, `SD1.1.1`, etc.
- El sufijo `X descompuesto` usa el nombre actual de la cosa refinada `X`; si `X` se renombra, el sufijo se recalcula (ver HU-20.014).
- El SD raiz usa numeracion sin prefijo adicional; los hijos del SD son `SDn` (no `SD.n`).
- [V-69] La cosa refinada recibe borde grueso en todos los OPDs donde aparece.

**Modelo de datos tocado:**
- `opd.id` — UUID — persistente.
- `opd.parent_id` — UUID del OPD padre — persistente.
- `opd.display_name` — string derivado (numeracion + sufijo) — persistente o computado.
- `opd.refinement_source` — ID de la cosa refinada — persistente.
- `opd.refinement_type` — `"descomposicion"` — persistente.

**Dependencias:**
- Bloqueada por: HU-20.001, HU-20.002.
- Bloqueada por: EPICA-12 (operacion descomposicion canonica).
- Bloquea a: HU-20.005 (sufijo), HU-20.006 (anidamiento), HU-20.018 (orden automatico).

**Integraciones:**
- Kernel OPM (refinamientos generan OPDs nuevos).
- Panel OPL-ES (frase "X from SD se descompone en SDn into …").
- EPICA-12 (descomposicion canonica).

**Notas de evidencia:**
- Fuente normativa: [opm-iso-19450-es.md §Refinamiento por descomposicion] — la SSOT define descomposicion como refinamiento que expone contenido interno en un OPD hijo.
- Fuente OPCloud: §10 tabla "SDn: X in-zoomed" + §3.4 acoplamiento arbol-canvas.
- Frames: 19/frame_00005, 19/frame_00011.
- Clase de afirmacion: observado + confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [estructura, kernel, arbol, descomposicion, sdn, refinamiento].

---

### HU-20.004 — Generar nodo hijo automatico al ejecutar despliegue

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario con side-effects en L, V.
**Superficie UI:** opd-tree + canvas.
**Gesto canonico:** ninguno (automatico post-despliegue; el gesto vive en EPICA-12).

**Historia:**
> Como modelador, quiero que al ejecutar despliegue-por-partes, despliegue-por-caracteristicas o despliegue-por-especializacion se cree un nodo hijo `SDn: X desplegado` en el arbol para reflejar el refinamiento por despliegue sin gestionar el arbol a mano.

**Contexto de negocio:**
OPM distingue cuatro formas de refinamiento: descomposicion (procesos, con orden temporal) y tres variantes de despliegue (agregacion, caracteristicas, especializacion). Las tres variantes de despliegue comparten el sufijo generico `desplegado` en el arbol (hay pregunta abierta sobre como se distinguen visualmente — ver HU-20.005).

**Criterios de aceptacion:**
- **Dado** que tengo un Objeto `X` en `SD`, **cuando** ejecuto despliegue-por-partes sobre `X` (delegado a EPICA-12), **entonces** se crea un OPD nuevo con nombre `SD1: X desplegado` y aparece como hijo de `SD`.
- **Dado** que ejecuto despliegue-por-caracteristicas sobre `X`, **cuando** se genera el OPD, **entonces** tambien aparece con sufijo `desplegado` (mismo sufijo aparente que despliegue-por-partes — ver pregunta abierta).
- **Dado** que ejecuto despliegue-por-especializacion sobre `X`, **cuando** se genera el OPD, **entonces** tambien aparece con sufijo `desplegado`.
- **Dado** que los tres tipos comparten el sufijo visible, **cuando** consulto el panel OPL-ES, **entonces** las frases usan verbos distintos (`se despliega en partes`, `se despliega en caracteristicas`, `se despliega en especializaciones`) que si diferencian la operacion.

**Reglas y restricciones:**
- Numeracion igual que descomposicion (rango SDn continuo en el padre; SDn.m si es anidado).
- El sufijo visible `desplegado` es **ambiguo** entre los tres tipos de despliegue en la presentacion actual del arbol — ver HU-20.005 y pregunta abierta Q20.2.
- `refinement_type` en el modelo distingue las tres variantes aunque el arbol no lo muestre.
- [V-69] La cosa refinada recibe borde grueso.

**Modelo de datos tocado:**
- Mismo shape que HU-20.003 con `opd.refinement_type ∈ {"despliegue-por-partes", "despliegue-por-caracteristicas", "despliegue-por-especializacion"}`.

**Dependencias:**
- Bloqueada por: HU-20.001, HU-20.002.
- Bloqueada por: EPICA-12 (operacion despliegue canonica).
- Bloquea a: HU-20.005.

**Integraciones:**
- Kernel OPM (despliegues generan OPDs).
- Panel OPL-ES (frases diferenciadas por tipo).
- EPICA-12.

**Notas de evidencia:**
- Fuente normativa: [opm-iso-19450-es.md §Refinamiento por despliegue] — la SSOT define tres variantes de despliegue.
- Fuente OPCloud: §10 tabla completa de cuatro formas de refinamiento.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [estructura, kernel, arbol, despliegue, sdn, refinamiento].

---

### HU-20.005 — Identificar tipo de refinamiento por sufijo del nodo

**Actor primario:** MN.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario (presentacion); L (derivado de tipo).
**Superficie UI:** opd-tree (nodo con sufijo renderizado).
**Gesto canonico:** ninguno (lectura visual).

**Historia:**
> Como modelador, quiero identificar el tipo de refinamiento de cada nodo del arbol por su sufijo (`descompuesto`, `desplegado`) o por un badge distintivo para leer la estructura del modelo de un vistazo.

**Contexto de negocio:**
Saber si un OPD hijo existe por descomposicion o por despliegue (y, dentro de despliegue, por que variante) es informacion estructural clave. La descomposicion tiene orden temporal; los tres despliegues no lo tienen. Si el arbol no diferencia visualmente estos tipos, el modelador debe abrir cada OPD para saber su naturaleza — un costo alto de navegacion.

**Criterios de aceptacion:**
- **Dado** que el arbol tiene un hijo creado por descomposicion, **cuando** miro el nodo, **entonces** lleva sufijo `X descompuesto` visible junto a la numeracion.
- **Dado** que el arbol tiene un hijo creado por cualquier variante de despliegue, **cuando** miro el nodo, **entonces** lleva sufijo `X desplegado` visible.
- **Dado** que el sufijo `desplegado` es ambiguo entre despliegue-por-partes/caracteristicas/especializacion, **cuando** quiero distinguirlos, **entonces** el modelador pasa el cursor sobre el nodo para ver un tooltip con el tipo exacto o cambia a `OPD Tree Management` (HU-20.020).
- **Dado** que OPCloud usa el mismo sufijo generico `unfolded`, **cuando** nuestro modelador lo implemente, **entonces** puede extender con badge diferenciador (propuesta de mejora — sujeta a decision).

**Reglas y restricciones:**
- Formato de nombre del nodo: `SDn: <nombre-cosa> <sufijo>` donde `sufijo ∈ {"descompuesto", "desplegado"}`.
- El sufijo se **recomputa** si se renombra la cosa refinada.
- Nuestra implementacion **puede** diferenciar los tres despliegues con badges (sobre-cumplimiento vs OPCloud) — requiere decision explicita.

**Modelo de datos tocado:**
- `opd.display_name` — string — puede ser derivado o persistido (decision abierta — ver Q20.3).

**Dependencias:**
- Bloqueada por: HU-20.003, HU-20.004.
- Bloquea a: HU-20.014 (rename propaga).

**Integraciones:**
- Renderer del arbol.
- Panel OPL-ES (fuente canonica del verbo de refinamiento).

**Notas de evidencia:**
- Fuente OPCloud: §10 tabla completa + §12 pregunta abierta 5.
- Clase de afirmacion: observado + abierto para diferenciacion de despliegues.
- Etiqueta: `requires-clarification` (sobre como diferenciar los tres despliegues visualmente).

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [estructura, ui, arbol, sufijo, opl, requires-clarification].

---

### HU-20.006 — Anidar nietos recursivamente en jerarquia SDn.m

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; L secundaria.
**Superficie UI:** opd-tree.
**Gesto canonico:** ninguno (consecuencia de refinamientos anidados).

**Historia:**
> Como modelador, quiero que cada refinamiento hecho dentro de un OPD hijo genere nietos `SDn.m` correctamente anidados para modelar sistemas de profundidad arbitraria.

**Contexto de negocio:**
Los sistemas reales tienen multiples niveles de descomposicion. Si el arbol solo soportara un nivel, el modelado se estancaria. La anidacion recursiva `SD → SDn → SDn.m → SDn.m.p → …` es el mecanismo por el cual OPM representa sistemas complejos sin explotar la pantalla: cada nivel vive en su propio OPD.

**Criterios de aceptacion:**
- **Dado** que estoy en el OPD `SD1`, **cuando** hago descomposicion sobre un Proceso contenido, **entonces** se crea `SD1.1` como hijo de `SD1` en el arbol.
- **Dado** que ya existe `SD1.1`, **cuando** hago otro refinamiento dentro de `SD1`, **entonces** el nuevo OPD se numera `SD1.2`.
- **Dado** que estoy en `SD1.2`, **cuando** hago un refinamiento interno, **entonces** se crea `SD1.2.1`.
- **Dado** que tengo `SD1.2.1`, **cuando** miro el arbol expandido, **entonces** la indentacion visual refleja la profundidad (cada nivel indentado bajo su padre).
- **Dado** que un OPD tiene hijos, **cuando** miro el nodo en el arbol, **entonces** muestra chevron/indicador de expansion-colapso.

**Reglas y restricciones:**
- Profundidad soportada: sin limite duro, aunque la usabilidad degrada >5 niveles.
- Numeracion: separador `.` canonico (`SD1.1` no `SD1-1` ni `SD.1.1`).
- Cada OPD tiene `parent_id`; el arbol se reconstruye recursivamente desde la relacion padre-hijo.

**Modelo de datos tocado:**
- `opd.parent_id` — UUID o null — persistente.
- Arbol = clausura transitiva de `parent_id`.

**Dependencias:**
- Bloqueada por: HU-20.003, HU-20.004.

**Integraciones:**
- Kernel OPM.
- Renderer arbol (indentacion por nivel).

**Notas de evidencia:**
- Fuente normativa: [opm-iso-19450-es.md §Jerarquia de OPDs] — la SSOT define la estructura jerarquica recursiva de OPDs.
- Fuente OPCloud: §3.1 "lista jerarquia SD, SD1, SD1.1, etc.".
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [estructura, kernel, arbol, jerarquia-anidada, recursion].

---

### HU-20.007 — Navegar a OPD con clic en nodo del arbol

**Actor primario:** MN.
**Actores secundarios:** RV.
**Tipo:** mixto.
**Nivel categorico:** U primario; L secundaria.
**Superficie UI:** opd-tree + canvas-opd.
**Gesto canonico:** clic (simple o doble — ver regla).

**Historia:**
> Como modelador, quiero hacer clic en un nodo del arbol para navegar al OPD correspondiente sin cerrar el arbol ni usar shortcuts.

**Contexto de negocio:**
Clic es el gesto mas basico y universal. Ninguna otra forma de navegacion en el arbol puede faltar este gesto como punto de entrada. Debe ser inmediato: sin delay, sin dialogo intermedio, sin confirmacion.

**Criterios de aceptacion:**
- **Dado** que el arbol esta visible, **cuando** hago clic en cualquier nodo, **entonces** el canvas cambia al OPD correspondiente.
- **Dado** que hice clic en un nodo, **cuando** termina la transicion, **entonces** el nodo queda resaltado (estilo seleccionado) en el arbol.
- **Dado** que el OPD seleccionado es identico al actual, **cuando** hago clic de nuevo, **entonces** no hay cambio (idempotente, no re-renderiza).
- **Dado** que estoy viendo el OPD `SD1.1`, **cuando** hago clic en `SD` (raiz), **entonces** el canvas sube al SD sin perder el estado del SD1.1 (el OPD persiste, solo cambia el OPD activo).
- **Dado** que el nodo tiene hijos (no-leaf), **cuando** hago un clic simple, **entonces** navega — doble clic es opcional o equivalente (ver regla abierta).

**Reglas y restricciones:**
- Gesto por defecto: **clic simple** selecciona y navega.
- Doble clic: comportamiento abierto (podria expandir/colapsar en implementaciones). En OPCloud observado, un solo clic navega.
- Expandir/colapsar un nodo con hijos: **chevron** separado, no el nombre del nodo (evita confusion gesto-funcion).

**Modelo de datos tocado:**
- `ui.activeOpdId` — UUID transitorio del OPD activo en canvas — transitorio (sesion).

**Dependencias:**
- Bloqueada por: HU-20.001.
- Bloquea a: HU-20.008 (sincronizacion).

**Integraciones:**
- Renderer canvas (cambia viewport).
- OPD Navigator (miniatura se actualiza).
- Panel OPL-ES (cambia a OPL del OPD activo).

**Notas de evidencia:**
- Fuente normativa: [opm-iso-19450-es.md §Navegacion de OPD] — la SSOT exige que se pueda navegar entre OPDs del modelo.
- Fuente OPCloud: §3.1 "Hace clic sobre el OPD deseado. El canvas cambia a ese OPD.".
- Clase de afirmacion: observado + confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [estructura, ui, arbol, navegacion, clic].

---

### HU-20.008 — Sincronizar canvas con nodo seleccionado del arbol

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario; L secundaria.
**Superficie UI:** opd-tree + canvas-opd + breadcrumb.
**Gesto canonico:** ninguno (efecto automatico).

**Historia:**
> Como modelador, quiero que el arbol resalte siempre el nodo del OPD activo en el canvas para saber donde estoy en la jerarquia sin ambiguedad.

**Contexto de negocio:**
Sin sincronizacion canvas↔arbol, el modelador pierde orientacion: puede estar viendo un OPD en canvas y otro resaltado en el arbol. Este bug de UX es critico en sistemas grandes. La sincronizacion es una invariante de UI bidireccional.

**Criterios de aceptacion:**
- **Dado** que cambio OPD haciendo clic en el arbol, **cuando** el canvas transita, **entonces** el nodo clicado queda resaltado.
- **Dado** que cambio OPD desde dentro del canvas (p.ej. doble clic en un Proceso descompuesto — delegado a EPICA-12), **cuando** el canvas muestra el nuevo OPD, **entonces** el arbol resalta el nodo correspondiente (y scrolls si es necesario).
- **Dado** que uso shortcuts de teclado (HU-20.009), **cuando** navego al siguiente/anterior, **entonces** el arbol resalta el nodo resultante.
- **Dado** que el OPD activo pertenece a una rama colapsada del arbol, **cuando** se activa, **entonces** la rama se auto-expande para mostrar el nodo (comportamiento abierto — ver regla).
- **Dado** que regreso al SD desde `SD1.1.1`, **cuando** cambia el canvas, **entonces** el arbol resalta `SD` y las ramas previas pueden permanecer expandidas o colapsarse (decision de UX).

**Reglas y restricciones:**
- Invariante: `nodo_resaltado_arbol ↔ opd_activo_canvas` (biyeccion estricta en todo momento).
- Auto-scroll del arbol: el nodo resaltado debe ser visible sin scroll manual.
- Auto-expand de rama: **pregunta abierta** (Q20.6).

**Modelo de datos tocado:**
- `ui.activeOpdId` — transitorio (ya introducido en HU-20.007).

**Dependencias:**
- Bloqueada por: HU-20.007.
- Relacionada: EPICA-12 (navegacion desde canvas).

**Integraciones:**
- Canvas renderer.
- Breadcrumb del OPD actual.
- Panel OPL-ES.

**Notas de evidencia:**
- Fuente normativa: [opm-iso-19450-es.md §Navegacion de OPD] — la SSOT exige consistencia entre vista activa y seleccion.
- Fuente OPCloud: §3.1, §4.3 "highlights, breadcrumbs o viewport persistente al cambiar de OPD".
- Clase de afirmacion: observado + inferido para auto-expand.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [estructura, ui, arbol, canvas-activo, sincronizacion, invariante].

---

### HU-20.009 — Navegar por teclado con Ctrl+Up / Ctrl+Down

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** opd-tree (foco global).
**Gesto canonico:** shortcut de teclado.

**Historia:**
> Como modelador experto, quiero navegar entre OPDs con `Ctrl+Up` y `Ctrl+Down` para recorrer la jerarquia sin mover el cursor al panel del arbol.

**Contexto de negocio:**
Los modeladores expertos operan con las manos sobre el teclado. Un shortcut para saltar entre OPDs contiguos del arbol acelera la exploracion secuencial (tipica en revision de modelos grandes). Es un diferencial de productividad claro.

**Criterios de aceptacion:**
- **Dado** que estoy en un OPD, **cuando** presiono `Ctrl+Down`, **entonces** navego al siguiente nodo del arbol en orden de pre-order (proximo hermano o primer hijo si existe, segun recorrido estandar).
- **Dado** que estoy en un OPD, **cuando** presiono `Ctrl+Up`, **entonces** navego al nodo previo en el mismo orden.
- **Dado** que estoy en el ultimo nodo, **cuando** presiono `Ctrl+Down`, **entonces** el shortcut no hace nada (o envuelve al primero — comportamiento abierto).
- **Dado** que el shortcut navega, **cuando** termina, **entonces** el canvas y el arbol quedan sincronizados (HU-20.008).

**Reglas y restricciones:**
- Orden de recorrido: **pre-order** (padre → primer hijo → siguiente hermano). Alternativa DFS tradicional.
- El shortcut respeta el foco: si hay un input de texto activo, el shortcut no debe dispararse (evitar interferencia con edicion).
- Envolvimiento (primero → ultimo): **pregunta abierta** (Q20.7).

**Modelo de datos tocado:**
- Ninguno (solo cambia `ui.activeOpdId`).

**Dependencias:**
- Bloqueada por: HU-20.007.
- Relaciona: EPICA-90 (shortcuts globales).

**Integraciones:**
- Sistema global de shortcuts.
- Canvas + arbol (sincronizacion).

**Notas de evidencia:**
- Fuente OPCloud: §3.1 + §8 lista de shortcuts (`Ctrl+Up`, `Ctrl+Down`).
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [estructura, ui, arbol, shortcut, navegacion, teclado].

---

### HU-20.010 — Ajustar ancho del panel arbol con divisor arrastrable

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** left-pane (divisor).
**Gesto canonico:** arrastre horizontal del divisor.

**Historia:**
> Como modelador, quiero arrastrar el borde derecho del panel del arbol para ajustar su ancho y ver nombres largos o liberar espacio del canvas.

**Contexto de negocio:**
Los nombres de OPDs son descriptivos y pueden ser largos (`SD2.3: Subsystem Management descompuesto`). Un ancho fijo del panel fuerza a truncar o hace ilegible la jerarquia. Permitir ajuste dinamico es un minimo de usabilidad que OPCloud ofrece de serie.

**Criterios de aceptacion:**
- **Dado** que el panel del arbol esta visible, **cuando** hago `mousedown` sobre su borde derecho y arrastro, **entonces** el ancho cambia en vivo.
- **Dado** que termino el arrastre, **cuando** suelto, **entonces** el ancho persiste para la sesion actual.
- **Dado** que reabro la aplicacion, **cuando** se carga la UI, **entonces** el ancho recuerda el valor de la sesion previa (persistencia de preferencia — ver regla).
- **Dado** que arrastro por debajo de un umbral minimo (p.ej. 50px), **cuando** suelto, **entonces** el ancho se ancla a ese minimo (no permite ocultar accidentalmente).

**Reglas y restricciones:**
- Ancho minimo razonable: ~150px para ver al menos numeracion + inicio de nombre.
- Ancho maximo: ~40% del viewport (evita monopolizar la pantalla).
- Persistencia: preferencia de usuario local (IndexedDB de sesion), no del modelo.

**Modelo de datos tocado:**
- `ui.treePanelWidth` — number (px) — persistente en preferencias de sesion.

**Dependencias:**
- Bloqueada por: HU-20.001.

**Integraciones:**
- Persistencia de preferencias locales (`src/persistencia/`).

**Notas de evidencia:**
- Fuente OPCloud: §2 "Barra de ajuste de ancho — arrastre".
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [estructura, ui, panel-lateral, arrastre, resize, preferencia].

---

### HU-20.011 — Abrir menu contextual del arbol con clic derecho

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** opd-tree + context-menu.
**Gesto canonico:** clic derecho sobre nodo o sobre zona vacia del arbol.

**Historia:**
> Como modelador experto, quiero abrir un menu contextual con clic derecho sobre el arbol para acceder a las operaciones comunes (expand/collapse, hide/show names, remove) sin mover el cursor a otro lugar.

**Contexto de negocio:**
El menu contextual es la afordance estandar para operaciones sobre un objeto en la UI moderna. En el arbol OPD concentra acciones de presentacion (expand/collapse, hide names) y administracion (remove). Sustituye a viajes a la toolbar para estas operaciones.

**Criterios de aceptacion:**
- **Dado** que el arbol esta visible, **cuando** hago clic derecho sobre un nodo, **entonces** aparece un menu contextual posicionado junto al cursor.
- **Dado** que el menu esta abierto, **cuando** miro las opciones, **entonces** veo: `Remove`, `Expand all`, `Collapse all`, `Hide Names`, `Show Names` (segun estado actual, se muestra una u otra alternativamente).
- **Dado** que hago clic fuera del menu, **cuando** se cierra, **entonces** no ocurre ninguna accion.
- **Dado** que hago clic derecho en zona vacia del arbol (fuera de cualquier nodo), **cuando** aparece el menu, **entonces** las opciones especificas de nodo (`Remove`) quedan deshabilitadas o ausentes.

**Reglas y restricciones:**
- Opciones mostradas dependen del contexto (nodo vs zona vacia, hoja vs interno).
- `Hide Names` y `Show Names` son toggles mutuamente excluyentes: solo uno visible segun estado.
- El menu se cierra al ejecutar una accion, al perder foco, o al presionar ESC.

**Modelo de datos tocado:**
- Ninguno (UI transitorio).

**Dependencias:**
- Bloqueada por: HU-20.001.
- Bloquea a: HU-20.012, HU-20.013, HU-20.015 (todas se invocan desde el menu contextual).

**Integraciones:**
- Validacion previa a `Remove` (HU-20.016).

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla "Menu contextual del tree: Remove, Expand all, Collapse all, Hide Names, Show Names".
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [estructura, ui, arbol, context-menu, clic-derecho].

---

### HU-20.012 — Expandir o colapsar todo el arbol de una vez

**Actor primario:** ME.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** context-menu (arbol).
**Gesto canonico:** clic en opcion `Expand all` o `Collapse all`.

**Historia:**
> Como modelador, quiero expandir o colapsar todo el arbol con una sola accion para ver la vista general (todo expandido) o reducir ruido (todo colapsado) sin clicar nodo por nodo.

**Contexto de negocio:**
En modelos grandes (20+ OPDs), expandir manualmente cada rama es tedioso. `Expand all` muestra el bosque completo para busqueda visual; `Collapse all` vuelve a vista alta y deja solo el SD visible (o los primeros niveles segun implementacion).

**Criterios de aceptacion:**
- **Dado** que abro el menu contextual del arbol, **cuando** hago clic en `Expand all`, **entonces** todos los nodos con hijos quedan expandidos.
- **Dado** que abro el menu, **cuando** hago clic en `Collapse all`, **entonces** todos los nodos quedan colapsados mostrando solo el nivel raiz.
- **Dado** que ejecuto `Expand all` en un arbol profundo (5+ niveles), **cuando** termina, **entonces** no hay degradacion visible de performance (<1s en modelos de tamano tipico).
- **Dado** que el arbol esta todo colapsado, **cuando** clico un nodo resaltado (OPD activo), **entonces** se auto-expande la rama hasta el nodo activo para mantener sincronizacion (HU-20.008).

**Reglas y restricciones:**
- El estado expandido/colapsado es **sesion-local** — no se persiste en el modelo.
- `Collapse all` no afecta el OPD activo: su rama puede re-expandirse automaticamente.

**Modelo de datos tocado:**
- `ui.expandedNodes` — Set de UUIDs — transitorio (sesion).

**Dependencias:**
- Bloqueada por: HU-20.011.

**Integraciones:**
- Renderer arbol.

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla, §3.2.
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [estructura, ui, arbol, expand-collapse, batch].

---

### HU-20.013 — Alternar entre Hide Names y Show Names

**Actor primario:** RV (revisor).
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V (presentacion).
**Superficie UI:** context-menu (arbol) + opd-tree.
**Gesto canonico:** clic en opcion `Hide Names` o `Show Names`.

**Historia:**
> Como revisor de modelos, quiero ocultar los nombres de los OPDs y ver solo la numeracion para tener una vista ultracompacta del arbol en modelos extensos.

**Contexto de negocio:**
En modelos con 50+ OPDs y nombres largos, ver solo los numeros (`SD`, `SD1`, `SD1.1`, …) permite captar la **topologia** de la jerarquia sin el ruido de los nombres. Util para revisiones de estructura o para presentar un modelo sin revelar nombres semanticos (confidencialidad).

**Criterios de aceptacion:**
- **Dado** que el arbol muestra nombres, **cuando** ejecuto `Hide Names` desde el menu contextual, **entonces** todos los nodos pasan a mostrar solo su numeracion (ej. `SD1` en vez de `SD1: Patient Admission descompuesto`).
- **Dado** que los nombres estan ocultos, **cuando** ejecuto `Show Names`, **entonces** los nombres vuelven a aparecer.
- **Dado** que oculto los nombres, **cuando** miro el canvas y panel OPL-ES, **entonces** **no** se ocultan alli (la preferencia es solo del arbol).
- **Dado** que cierro y reabro la aplicacion, **cuando** el arbol se recarga, **entonces** la preferencia persiste (sesion o usuario — ver regla).

**Reglas y restricciones:**
- La preferencia afecta **solo** el arbol; el resto de la UI (canvas, panel OPL-ES) no oculta nombres.
- Persistencia: abierto (¿sesion? ¿usuario? ¿modelo? — ver Q20.1).
- Tambien esta expuesta como preferencia en Settings (no solo como accion instantanea — §3.2).

**Modelo de datos tocado:**
- `ui.opdTree.hideNames` — boolean — persistente en preferencias.

**Dependencias:**
- Bloqueada por: HU-20.011.

**Integraciones:**
- Renderer arbol.
- Settings (EPICA-80 o EPICA-81).

**Notas de evidencia:**
- Fuente OPCloud: §3.2, §4.1 "Hide names no altera la identidad del OPD".
- Clase de afirmacion: observado.

**Prioridad:** C (pulido; no bloquea modelado).
**Tamano:** XS.
**Etiquetas:** [estructura, ui, arbol, hide-names, presentacion, toggle].

---

### HU-20.014 — Renombrar OPD desde el arbol

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario (modifica `opd.display_name`); V secundaria (render).
**Superficie UI:** opd-tree (inline edit) o management-screen.
**Gesto canonico:** doble clic sobre nombre del nodo, o accion `Rename` desde menu contextual / management.

**Historia:**
> Como modelador, quiero renombrar un OPD desde el arbol para ajustar su nombre visible sin abrir el canvas ni modificar la cosa refinada.

**Contexto de negocio:**
El nombre del OPD (display_name) es por defecto derivado (`SD1: X descompuesto`), pero el modelador puede querer darle un nombre semanticamente mas rico (`SD1: Admission Workflow`). Renombrar desde el arbol es la via directa. La relacion entre renombrar el OPD y renombrar la cosa refinada es **pregunta abierta** critica (Q20.4).

**Criterios de aceptacion:**
- **Dado** que tengo un nodo seleccionado, **cuando** ejecuto `Rename` (inline o desde management), **entonces** el display_name pasa a modo edicion.
- **Dado** que escribo un nombre nuevo y confirmo (Enter), **cuando** se persiste, **entonces** el arbol muestra el nuevo nombre inmediatamente.
- **Dado** que renombro el OPD, **cuando** consulto la cosa refinada (Proceso `X` descompuesto), **entonces** la cosa **no** cambia su nombre (o si — ver pregunta abierta Q20.4).
- **Dado** que cancelo con ESC durante la edicion, **cuando** se cierra el inline edit, **entonces** el nombre original persiste.
- **Dado** que el nombre incluye sufijo (`descompuesto` / `desplegado`), **cuando** renombro, **entonces** el modelador decide si conserva el sufijo manualmente o si nuestra implementacion lo fuerza (sujeto a decision).

**Reglas y restricciones:**
- Ambito del rename: **pregunta abierta** — ¿solo el nodo-OPD? ¿la cosa refinada? ¿ambos?
- No se permite nombre vacio.
- Reglas de unicidad: abiertas (pueden haber dos OPDs con mismo display_name si tienen numeracion distinta).

**Modelo de datos tocado:**
- `opd.display_name` — string — persistente.
- Potencialmente: `thing.name` (cosa refinada) si el rename propaga — ver Q20.4.

**Dependencias:**
- Bloqueada por: HU-20.003 o HU-20.004 (necesita un OPD refinado).
- Relaciona: HU-20.022 (management tiene `Rename`).

**Integraciones:**
- Kernel (actualizacion de display_name).
- Panel OPL-ES (si propaga, las frases se regeneran con el nombre nuevo).

**Notas de evidencia:**
- Fuente normativa: [opm-iso-19450-es.md §Identificacion de OPD] — la SSOT requiere que cada OPD tenga un identificador/nombre unico en el modelo.
- Fuente OPCloud: §5.3 "Rename", §12 pregunta abierta 2.
- Clase de afirmacion: observado (control) + abierto (alcance).
- Etiqueta: `requires-clarification`.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [estructura, ui, arbol, renombrar, requires-clarification].

---

### HU-20.015 — Eliminar solo nodos hoja del arbol

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario (borra OPD); L secundaria (arbol se actualiza).
**Superficie UI:** opd-tree (menu contextual) o management-screen.
**Gesto canonico:** clic en `Remove` tras seleccionar nodo hoja.

**Historia:**
> Como modelador, quiero eliminar un OPD del arbol cuando ya no lo necesito para limpiar la estructura, pero solo si es hoja (sin hijos).

**Contexto de negocio:**
El arbol OPD debe mantener integridad jerarquica. Eliminar un nodo interno implicaria decidir que hacer con sus hijos (reparentar, eliminar en cascada) — una decision que OPCloud delega al modelador: exige primero eliminar los hijos. Esto mantiene el arbol como estructura limpia y previene perdidas accidentales masivas.

**Criterios de aceptacion:**
- **Dado** que tengo un nodo hoja seleccionado (sin hijos en el arbol), **cuando** ejecuto `Remove`, **entonces** el OPD se elimina y el arbol se actualiza.
- **Dado** que el OPD eliminado era el activo, **cuando** desaparece del arbol, **entonces** el canvas cambia al padre del OPD eliminado (navegacion automatica).
- **Dado** que elimino un OPD, **cuando** consulto las cosas refinadas, **entonces** la cosa original (el Proceso descompuesto) permanece en el OPD padre, pero pierde su refinamiento detallado (vuelve a ser "no refinada").
- **Dado** que acabo de eliminar un OPD, **cuando** ejecuto `Undo`, **entonces** el OPD se restaura con su contenido (§3.3 confirma que el Undo restaura).

**Reglas y restricciones:**
- `Remove` en nodos internos: **rechaza** con mensaje (HU-20.016).
- `Remove` del SD raiz: **siempre** rechaza (el modelo debe tener al menos el SD).
- Undo es soportado inmediatamente tras el delete (EPICA-90 o EPICA-1C).

**Modelo de datos tocado:**
- `opd` — tupla completa — se elimina.
- `thing.refinements` — de la cosa padre — se actualiza para reflejar que ya no tiene OPD refinante.

**Dependencias:**
- Bloqueada por: HU-20.001.
- Relaciona: HU-20.016 (validacion), EPICA-1C (validaciones y undo).

**Integraciones:**
- Kernel (borrado con integridad).
- Panel OPL-ES (la frase de refinamiento desaparece).
- Undo stack.

**Notas de evidencia:**
- Fuente normativa: [opm-iso-19450-es.md §Integridad jerarquica] — la SSOT exige que no se rompa la cadena de refinamientos al eliminar.
- Fuente OPCloud: §3.3, §5.3 "Remove".
- Clase de afirmacion: observado + confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [estructura, kernel, arbol, delete, integridad-jerarquica, undo].

---

### HU-20.016 — Impedir eliminacion de nodos internos con mensaje claro

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario (UI de rechazo); K (regla de validacion).
**Superficie UI:** toast o modal de error + opd-tree.
**Gesto canonico:** intento de `Remove` sobre nodo interno.

**Historia:**
> Como modelador, quiero ver un mensaje claro cuando intente eliminar un nodo interno para entender por que no se permite y que pasos tomar.

**Contexto de negocio:**
Permitir eliminar nodos internos sin advertencia implicaria perdida silenciosa de estructura (todos los hijos quedarian huerfanos o se eliminarian en cascada sin consentimiento). El mensaje explicito `You are not allowed to remove the inner nodes` comunica la regla y sugiere implicitamente la ruta: eliminar los hijos primero.

**Criterios de aceptacion:**
- **Dado** que selecciono un nodo con hijos, **cuando** ejecuto `Remove`, **entonces** aparece un mensaje con el texto `You are not allowed to remove the inner nodes` (o equivalente localizado).
- **Dado** que recibi el mensaje, **cuando** lo cierro, **entonces** el nodo permanece sin cambios.
- **Dado** que elimino todos los descendientes primero (recursivamente), **cuando** el nodo queda como hoja, **entonces** puedo proceder a eliminarlo (HU-20.015).
- **Dado** que la localizacion es relevante, **cuando** traducimos, **entonces** el mensaje en es-CL es equivalente: `No se permite eliminar nodos internos; elimina primero los descendientes.`

**Reglas y restricciones:**
- El mensaje es bloqueante (modal ligero o toast no dismissible sin accion).
- La validacion ocurre en el kernel: la UI simplemente presenta el error.
- El texto es estable para que herramientas de test puedan verificarlo.

**Modelo de datos tocado:**
- Ninguno (solo se muestra error).

**Dependencias:**
- Bloqueada por: HU-20.015.

**Integraciones:**
- Validador del kernel.
- Sistema de toasts/mensajes de la UI.

**Notas de evidencia:**
- Fuente normativa: [opm-iso-19450-es.md §Integridad jerarquica] — la SSOT establece que la jerarquia de refinamientos debe mantenerse consistente.
- Fuente OPCloud: §3.3 "You are not allowed to remove the inner nodes".
- Clase de afirmacion: observado (texto literal del mensaje) + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [estructura, ui, arbol, validacion, mensaje, integridad-jerarquica].

---

### HU-20.017 — Reordenar hermanos manualmente con arrastre en el arbol

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario (modifica `children_order`); L secundaria.
**Superficie UI:** opd-tree o management-screen.
**Gesto canonico:** arrastre vertical de nodo dentro del mismo padre.

**Historia:**
> Como modelador experto, quiero arrastrar un nodo arriba o abajo entre sus hermanos para imponer un orden manual que refleje la importancia o secuencia logica de los OPDs.

**Contexto de negocio:**
Cuando el modo de arrangement es `Manually` (HU-20.019), el arbol no se auto-reordena segun el canvas. En ese modo, el modelador necesita controlar el orden explicitamente. El arrastre es la afordance canonica de reorder en listas jerarquicas.

**Criterios de aceptacion:**
- **Dado** que el modo es `Manually`, **cuando** arrastro un nodo hermano hacia arriba, **entonces** el orden entre hermanos se actualiza persistentemente.
- **Dado** que arrastro un nodo fuera de su padre (a otro padre), **cuando** suelto, **entonces** el comportamiento es abierto: puede rechazarse (arrastre solo reordena hermanos) o puede reparentarse (cambiar `parent_id`) — ver pregunta abierta Q20.8.
- **Dado** que el modo es `Automatic`, **cuando** intento arrastrar, **entonces** el arrastre es ignorado o el sistema advierte que el reorder manual esta desactivado (ver regla).
- **Dado** que reordene, **cuando** consulto la numeracion `SDx.y`, **entonces** **puede** recalcularse segun el nuevo orden (ver Q20.5).

**Reglas y restricciones:**
- Reorder manual requiere `opd.arrangement_mode = "Manually"` o equivalente.
- El arrastre entre hermanos es canonico; arrastre a otro padre (reparenting) es abierto (Q20.8).
- Si la numeracion se recalcula, puede romper enlaces externos que citen `SD1.2`.

**Modelo de datos tocado:**
- `opd.children_order` — array de IDs de hijos ordenados — persistente en el padre.

**Dependencias:**
- Bloqueada por: HU-20.001, HU-20.019.

**Integraciones:**
- Kernel.
- Renderer arbol.
- Numeracion `SDx.y` (potencialmente).

**Notas de evidencia:**
- Fuente OPCloud: §3.5 "Cuando queda en manual, el arbol no vuelve a alinearse solo", §5.3 "arrastre".
- Clase de afirmacion: observado + abierto (reparenting).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [estructura, ui, arbol, arrastre, reorder, manual, requires-clarification].

---

### HU-20.018 — Reordenar hermanos automaticamente segun canvas del padre

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario (derivacion automatica); V secundaria.
**Superficie UI:** opd-tree (efecto observable) + canvas del padre.
**Gesto canonico:** ninguno directo (ocurre al mover un subproceso verticalmente en el canvas padre).

**Historia:**
> Como modelador, quiero que al mover subprocesos verticalmente en un OPD descompuesto, el orden de los OPDs hijos en el arbol se reordene automaticamente para reflejar la secuencia temporal que exprese visualmente.

**Contexto de negocio:**
En modo `Automatic`, el layout vertical del OPD padre dicta el orden del arbol. Esto acopla fuertemente la geometria con la estructura jerarquica: el modelador expresa orden temporal moviendo shapes en el canvas, y el arbol refleja eso sin intervencion manual. Es una eleccion de producto elegante cuando funciona, pero vuelve al arbol parcialmente dependiente del layout geometrico.

**Criterios de aceptacion:**
- **Dado** que el modo es `Automatic`, **cuando** muevo un subproceso arriba/abajo en el canvas del padre, **entonces** el orden de los OPDs hijos en el arbol se recalcula.
- **Dado** que cambio el orden automatico, **cuando** consulto el panel OPL-ES del refinamiento, **entonces** la frase `se descompone en SDn into A, B, C` se reordena coherentemente.
- **Dado** que cambio la numeracion `SDx.y`, **cuando** consulto referencias externas (breadcrumbs, exports), **entonces** todo queda consistente con la numeracion nueva.
- **Dado** que el modo cambia a `Manually` mientras trabajo, **cuando** muevo subprocesos en el canvas, **entonces** el arbol **no** se reordena (HU-20.017).

**Reglas y restricciones:**
- El acoplamiento es **solo vertical**: mover horizontalmente no cambia orden.
- La numeracion `SDx.y` puede no ser estable si el modo es automatico — es una consecuencia, no un bug (§9 convenciones).
- Debe haber debouncing para evitar recalculos excesivos durante arrastres.

**Modelo de datos tocado:**
- `opd.children_order` — derivado del layout cuando `arrangement_mode = "Automatic"`.
- `thing.position.y` del canvas del padre — fuente del orden.

**Dependencias:**
- Bloqueada por: HU-20.003, HU-20.019.
- Relaciona: EPICA-12 (descomposicion), EPICA-50 (panel OPL-ES reorder).

**Integraciones:**
- Kernel (derivacion children_order).
- Canvas layout.
- Panel OPL-ES.

**Notas de evidencia:**
- Fuente normativa: [opm-iso-19450-es.md §Orden de refinamiento] — la SSOT define orden temporal para procesos descompuestos.
- Fuente OPCloud: §3.4 "Si el modo es Automatic, el orden del arbol se recalcula segun ese orden visual", §7.2 panel OPL-ES reorder.
- Clase de afirmacion: confirmado por transcripcion (Intro 25) + confirmado por SSOT.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [estructura, kernel, arbol, reorder, automatic, acoplamiento, opl].

---

### HU-20.019 — Configurar modo Automatic vs Manually en preferencias

**Actor primario:** AO (admin de organizacion).
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** C (config).
**Superficie UI:** settings (preferencias de usuario, organizacion, o modelo).
**Gesto canonico:** seleccion en dropdown/radio.

**Historia:**
> Como admin de organizacion, quiero configurar el modo de arrangement del arbol OPD (`Automatic`, `Manually`, `Inherited From Modeler General Preferences`) a nivel organizacion, usuario o modelo para imponer el estilo de trabajo adecuado al contexto.

**Contexto de negocio:**
Tres niveles de control permiten resolver tensiones entre preferencias individuales, estandares organizacionales y necesidades especificas por modelo. La herencia (`Inherited From Modeler General Preferences`) es el default recomendado: respeta al modelador sin imponer.

**Criterios de aceptacion:**
- **Dado** que abro settings de usuario, **cuando** busco `OPD Tree Processes Arrangement`, **entonces** veo dropdown con opciones `Automatic`, `Manually`.
- **Dado** que abro settings de un modelo especifico, **cuando** busco el mismo, **entonces** veo las tres opciones (incluye `Inherited`).
- **Dado** que elijo `Manually` a nivel modelo, **cuando** guardo, **entonces** ese modelo no se auto-reordena aunque el default de usuario sea `Automatic`.
- **Dado** que elijo `Inherited`, **cuando** cambia el default del usuario, **entonces** el comportamiento del modelo refleja el nuevo default sin reconfiguracion.

**Reglas y restricciones:**
- Precedencia: modelo > usuario > organizacion.
- `Inherited` en un nivel significa "delega al nivel superior".
- Cambiar de `Automatic` a `Manually` **no** reordena retroactivamente — congela el orden actual.
- Cambiar de `Manually` a `Automatic` **reordena** inmediatamente al orden del canvas.

**Modelo de datos tocado:**
- `user.preferences.opdArrangement` — enum `{"Automatic", "Manually"}`.
- `model.settings.opdArrangement` — enum `{"Automatic", "Manually", "Inherited"}`.
- `organization.defaults.opdArrangement` — enum.

**Dependencias:**
- Bloqueada por: HU-20.001.
- Relaciona: HU-20.017, HU-20.018, EPICA-80 (config user), EPICA-82 (config org).

**Integraciones:**
- Settings (EPICA-80/81/82).
- Kernel (consulta el modo efectivo al derivar orden).

**Notas de evidencia:**
- Fuente OPCloud: §3.5, §5.2.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [estructura, config, preferencias, arrangement, organizacion].

---

### HU-20.020 — Abrir OPD Tree Management con Ctrl+D

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; L secundaria.
**Superficie UI:** modal-opd-tree-management.
**Gesto canonico:** shortcut `Ctrl+D` o clic en boton dedicado.

**Historia:**
> Como modelador experto, quiero abrir `OPD Tree Management` con `Ctrl+D` o con un boton para acceder a una vista completa del arbol con busqueda, arrastre, cut/paste y apertura directa.

**Contexto de negocio:**
El arbol del panel lateral es para navegacion rapida, pero operaciones pesadas (busqueda, reorganizacion amplia, operaciones batch) requieren una superficie mas amplia. El modal `OPD Tree Management` es esa segunda capa administrativa.

**Criterios de aceptacion:**
- **Dado** que estoy en cualquier parte de la app, **cuando** presiono `Ctrl+D`, **entonces** se abre el modal `OPD Tree Management`.
- **Dado** que hago clic en el boton dedicado (toolbar principal o menu), **cuando** lo activo, **entonces** se abre el mismo modal.
- **Dado** que el modal esta abierto, **cuando** miro el contenido, **entonces** veo el arbol completo con controles adicionales: busqueda, botones `Open`, `Cut`, `Remove`, `Rename`, `Close`.
- **Dado** que el navegador intercepta `Ctrl+D` (bookmark), **cuando** el shortcut no llega a la app, **entonces** el boton dedicado sigue funcionando como alternativa (degradacion graceful).

**Reglas y restricciones:**
- El shortcut puede **colisionar** con el bookmark del navegador — documentado como limitacion conocida.
- El modal es grande pero no fullscreen; permite ver canvas/arbol detras si es necesario.
- Acciones dentro del modal afectan el arbol lateral inmediatamente (consistencia).

**Modelo de datos tocado:**
- Ninguno directo (modal es UI); las acciones subyacentes si lo tocan.

**Dependencias:**
- Bloqueada por: HU-20.001.
- Bloquea a: HU-20.021, HU-20.022.

**Integraciones:**
- Kernel (todas las acciones de management operan sobre el modelo).
- Sistema global de shortcuts.

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla "OPD Tree Management: dialogo/modal grande, boton dedicado o Ctrl+D", §3.6.
- Clase de afirmacion: observado + confirmado por transcripcion (nota del `Ctrl+D` conflicto navegador).

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [estructura, ui, modal, management, shortcut].

---

### HU-20.021 — Buscar OPD por nombre o numero en management

**Actor primario:** ME.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; L secundaria.
**Superficie UI:** modal-opd-tree-management (campo de busqueda).
**Gesto canonico:** escritura en campo de busqueda.

**Historia:**
> Como modelador experto, quiero buscar un OPD por nombre o por numero dentro del `OPD Tree Management` para localizar rapido un nodo en modelos grandes sin recorrer el arbol manualmente.

**Contexto de negocio:**
En modelos con 30+ OPDs, recorrer manualmente el arbol es lento incluso en management. La busqueda por nombre o numero (`SD2.1`) es la forma canonica de localizar. Soportar ambas modalidades cubre los dos modelos mentales del modelador: por semantica (nombre) o por topologia (numeracion).

**Criterios de aceptacion:**
- **Dado** que el modal esta abierto, **cuando** escribo texto en el campo de busqueda, **entonces** el arbol filtra nodos cuyo nombre contenga el texto (substring case-insensitive).
- **Dado** que escribo un numero como `SD1.2`, **cuando** aplico busqueda, **entonces** el arbol filtra por coincidencia de numeracion.
- **Dado** que encuentro coincidencias, **cuando** miro el arbol filtrado, **entonces** los nodos coincidentes se resaltan (color o borde), y los ancestros quedan visibles para mantener contexto jerarquico.
- **Dado** que borro el campo, **cuando** la busqueda se limpia, **entonces** el arbol vuelve a mostrarse completo.

**Reglas y restricciones:**
- Busqueda es **substring case-insensitive** por default.
- Modo avanzado (regex, fuzzy) es **abierto** — no documentado en el fuente.
- Resultados preservan la jerarquia: mostrar un hijo coincidente implica mostrar sus ancestros.

**Modelo de datos tocado:**
- Ninguno (busqueda es cliente-side, sobre datos ya cargados).

**Dependencias:**
- Bloqueada por: HU-20.020.

**Integraciones:**
- Lente del arbol (filtrado reactivo).

**Notas de evidencia:**
- Fuente OPCloud: §3.6 "Puede buscar por: nombre, numero de OPD", §5.3.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [estructura, ui, modal, busqueda, management, filtro].

---

### HU-20.022 — Cortar y pegar nodos en OPD Tree Management

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario (modifica jerarquia); L secundaria.
**Superficie UI:** modal-opd-tree-management (botones `Cut`, `Paste` o analogo).
**Gesto canonico:** clic en `Cut` tras seleccionar + destino + confirmacion.

**Historia:**
> Como modelador experto, quiero cortar un nodo del arbol y pegarlo en otra posicion para reorganizar jerarquias profundas sin tener que reconstruir manualmente los refinamientos.

**Contexto de negocio:**
Reorganizaciones grandes (mover una rama completa de un padre a otro) son operaciones costosas si hay que hacerlas nodo por nodo. `Cut/Paste` permite reparenting explicito. El alcance exacto (si reordena apariencias en canvas, si recalcula refinamientos) es **pregunta abierta** critica (Q20.8).

**Criterios de aceptacion:**
- **Dado** que selecciono un nodo en management, **cuando** ejecuto `Cut`, **entonces** el nodo queda marcado como "en clipboard" (feedback visual).
- **Dado** que tengo un nodo en clipboard, **cuando** selecciono un padre destino y confirmo pegado, **entonces** el nodo y sus descendientes se reparentan al nuevo padre.
- **Dado** que el reparenting rompe relaciones de refinamiento en el canvas (p.ej. `X` ya no tiene `X descompuesto` como hijo directo), **cuando** ocurre, **entonces** el comportamiento es **abierto**: ¿se elimina la cosa refinada? ¿se crea una apariencia huerfana? — ver Q20.8.
- **Dado** que cancelo el cut sin pegar, **cuando** cierro el modal, **entonces** el nodo vuelve a su posicion original.
- **Dado** que complete un cut/paste, **cuando** ejecuto Undo, **entonces** la jerarquia vuelve al estado previo.

**Reglas y restricciones:**
- El alcance exacto de `Cut` sobre apariencias, refinamientos y canvas es **pregunta abierta** (Q20.8 y §12 pregunta 1).
- Operacion es costosa; debe ser explicita (no arrastre silencioso).
- Undo debe soportar la reversion completa.

**Modelo de datos tocado:**
- `opd.parent_id` — se modifica para el nodo cortado.
- `opd.children_order` — se ajusta en ambos padres (origen y destino).
- Posiblemente: `thing.refinements` — si el reparenting implica cambiar la cosa refinada.

**Dependencias:**
- Bloqueada por: HU-20.020.

**Integraciones:**
- Kernel (reparenting).
- Canvas (si cambia la estructura de refinamientos).
- Undo stack.

**Notas de evidencia:**
- Fuente OPCloud: §3.6 "Cut", §5.3, §12 pregunta abierta 1 ("Si Cut mueve solo el nodo del arbol o tambien recomputa apariencias y jerarquia de refinamiento en el canvas").
- Clase de afirmacion: observado (control) + abierto (alcance).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** L (implica decisiones de diseno sobre alcance).
**Etiquetas:** [estructura, kernel, modal, cut-paste, management, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §12 doc fuente)

- **Q20.1**: Persistencia exacta de `Hide Names` / `Show Names` (sesion, usuario, modelo). No documentada explicitamente en el fuente. Afecta HU-20.013.
- **Q20.2**: Como distingue el arbol visualmente `despliegue-por-partes` vs `despliegue-por-caracteristicas` vs `despliegue-por-especializacion` (los tres usan sufijo generico `desplegado`). §12 pregunta 5. Afecta HU-20.005.
- **Q20.3**: Si `opd.display_name` se persiste o se deriva en cada render. Si se persiste, rename explicito (HU-20.014) es directo; si se deriva, hay que decidir cuando "congelarlo" al renombrar. Relacion con §12 pregunta 3.
- **Q20.4**: Si `Rename` sobre un nodo OPD actua sobre la cosa refinada, sobre el display_name solo, o sobre ambos. §12 pregunta 2. Afecta HU-20.014.
- **Q20.5**: Si la numeracion `SDx.y` se persiste como identificador fuerte o se recalcula cada vez que cambia el orden automatico. §12 pregunta 3. Impacto en enlaces externos, exports, citas cruzadas.
- **Q20.6**: Comportamiento de auto-expand de rama cuando el OPD activo esta en rama colapsada (HU-20.008).
- **Q20.7**: Comportamiento de `Ctrl+Up/Down` al alcanzar primero/ultimo nodo (envolvimiento o stop).
- **Q20.8**: Alcance de `Cut` en `OPD Tree Management`: solo reordena el arbol o tambien recomputa apariencias y refinamientos en canvas. §12 pregunta 1. Afecta HU-20.017, HU-20.022.
- **Q20.9**: Si `Create View` y `Create Unfolded Tree View` (§11) agregan nodos persistentes al arbol OPD o generan vistas transitorias. §12 pregunta 4. **No cubierta por HU** en este archivo — candidata para HU-20.023+ o para epica separada sobre "Views" derivadas.

## Referencias cruzadas

- Fuente normativa: `opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`.
- Evidencia OPCloud: `JOYAS.md`, `sandbox-data/`, `assets/svg/`, `decompiled/`.
- Doc fuente original: `opcloud-reverse/20-estructura-opd-tree.md`.
- Epicas que producen OPDs hijos (y por lo tanto nodos en este arbol): **EPICA-12** (descomposicion y sus tres variantes de despliegue).
- Epicas que dependen de esta: **EPICA-50** (panel OPL-ES — sus frases reflejan el orden del arbol), **EPICA-30/31/32** (persistencia — guardar y recuperar la jerarquia), **EPICA-60/61** (exports — respetan la jerarquia del arbol).
- Relacion con validaciones: **EPICA-1C** (undo de delete OPD, integridad jerarquica).
- Relacion con shortcuts: **EPICA-90** (`Ctrl+Up`, `Ctrl+Down`, `Ctrl+D`).
- Relacion con config: **EPICA-80** (preferencias de usuario), **EPICA-81** (style defaults), **EPICA-82** (organization ontology) — particularmente `OPD Tree Processes Arrangement`.
- Relacion con "Views" (§11 del fuente): candidato de epica separada o extension futura de EPICA-20. Dejado fuera de este lote de HU hasta clarificar Q20.9.
- Invariantes del repo: `src/nucleo/tipos.ts` debe modelar `Opd` con `parent_id` y `children_order`; `src/ui/opd-navegador.ts` (ya presente en el repo) consume este arbol como vista; potencial `src/ui/opd-tree.ts` como superficie nueva si no existe; `src/persistencia/` para el ancho del panel y preferencias de arrangement.
