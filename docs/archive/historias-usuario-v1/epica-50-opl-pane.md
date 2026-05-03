---
epica: "EPICA-50"
titulo: "Panel OPL-ES — lente bimodal, edicion inversa y sincronizacion con el canvas"
doc_fuente: "opcloud-reverse/50-opl-pane.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M0"
hu_emitidas: 28
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
---

## Resumen

Esta epica cubre el **panel OPL-ES** como segunda mitad de la dualidad OPD↔OPL-ES que sostiene a OPM como lenguaje bimodal. No es una superficie informativa: es la **vista textual del modelo** con capacidad de edicion inversa (popup de nombre, popup de propiedades de enlace, selector multi-enlace), con sincronizacion bidireccional (hover cruzado, filtrado por seleccion), con controles de ventana (minimizar, mover al left pane, numeracion) y con reglas estrictas de verbalizacion por tipo de link, essence, affiliation, estados y descomposicion (in-zoom, part/feature/specialization unfolds).

El OPL-ES es **lente derivada** del modelo — no fuente de verdad — pero cualquier edicion escrita desde el panel propaga a las mismas estructuras que la edicion en canvas. El eco es inmediato, el formato es canonico OPL-ES (`**X** es un objeto informacional y sistemico.`, `**Y** consta de **A**, **B** y **C**.`, etc.), y el render respeta coloreado por clase de token (objeto verde, proceso azul, conectores negros) y convenciones tipograficas SSOT: **Objeto** en negrita, *Proceso* en cursiva, `estado` en monoespaciado.

Las HU estan numeradas siguiendo la aparicion en el doc fuente. Donde la verbalizacion es especifica de otra epica (in-zoom canvas, estados, styling), la HU del panel cubre el **eco**, delegando la primitiva a la epica correspondiente.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-50.001 | Renderizar panel OPL-ES persistente en franja inferior | MN | M0 | M | opcloud-ui | — |
| HU-50.002 | Numerar oraciones OPL-ES con prefijo ordinal | MN | M0 | S | opcloud-ui | — |
| HU-50.003 | Alternar numeracion con toggle `123` | ME | M1 | XS | opcloud-ui | — |
| HU-50.004 | Mover panel OPL-ES al left pane lateral | ME | S | S | opcloud-ui | — |
| HU-50.005 | Minimizar panel OPL-ES y detener su render | ME | M1 | S | opcloud-ui | — |
| HU-50.006 | Restaurar panel OPL-ES desde barra colapsada | ME | M1 | XS | opcloud-ui | — |
| HU-50.007 | Verbalizar essence y affiliation de cada cosa | MN | M0 | S | opm-semantica | [OPL-ES D1..D4] |
| HU-50.008 | Verbalizar enlace estructural consta de | MN | M0 | S | opm-semantica | [OPL-ES §2] |
| HU-50.009 | Verbalizar enlace estructural exhibe | MN | M0 | S | opm-semantica | [OPL-ES §2] |
| HU-50.010 | Verbalizar enlaces procedurales (requiere, genera, consume, afecta, maneja) | MN | M0 | M | opm-semantica | [OPL-ES T1..T5] [OPL-ES §2] |
| HU-50.011 | Verbalizar estados de un objeto stateful | MN | M0 | S | opm-semantica | [OPL-ES S1..S5] |
| HU-50.012 | Verbalizar descomposicion in-zoom sincrona | MN | M0 | M | opm-semantica | [OPL-ES TS1..TS5] [OPL-ES §2] |
| HU-50.013 | Verbalizar part-unfold asincrono (ocurren) | ME | M0 | M | opm-semantica | [OPL-ES TS1..TS5] [OPL-ES §2] |
| HU-50.014 | Verbalizar feature-unfold (exhibe) | ME | M0 | S | opm-semantica | [OPL-ES TS1..TS5] [OPL-ES §2] |
| HU-50.015 | Verbalizar specialization-unfold (es un/una) | ME | M0 | S | opm-semantica | [OPL-ES TS1..TS5] [OPL-ES §2] |
| HU-50.016 | Colorear tokens OPL-ES por clase de cosa | MN | M0 | S | opm-semantica | [OPL-ES §1.7] |
| HU-50.017 | Resaltar cruzado OPL-ES↔OPD en hover | MN | M0 | M | opcloud-ui | — |
| HU-50.018 | Filtrar OPL-ES por seleccion activa en canvas | ME | M0 | M | opcloud-ui | — |
| HU-50.019 | Editar nombre de cosa por doble clic en OPL-ES | ME | M0 | S | opcloud-ui | — |
| HU-50.020 | Editar propiedades de enlace por doble clic en verbo | ME | M0 | M | opcloud-ui | — |
| HU-50.021 | Seleccionar enlace especifico en oracion multi-enlace | ME | M1 | M | opcloud-ui | — |
| HU-50.022 | Propagar edicion OPL-ES al canvas en vivo | ME | M0 | S | mixto | — |
| HU-50.023 | Copiar OPL-ES completo al portapapeles | RV | M1 | XS | opcloud-ui | — |
| HU-50.024 | Exportar OPL-ES a archivo HTML | RV | S | M | opcloud-ui | — |
| HU-50.025 | Buscar texto dentro del panel OPL-ES | RV | S | S | opcloud-ui | — |
| HU-50.026 | Indentar oraciones jerarquicamente por nivel de OPD | RV | S | S | opcloud-ui | — |
| HU-50.027 | Expandir y colapsar bloques OPL-ES jerarquicos | RV | C | S | opcloud-ui | — |
| HU-50.028 | Activar Toggle AI Text para oraciones compuestas | AD | W | M | opcloud-ui | — |

Total: **28 historias de usuario** (10 opm-semantica, 17 opcloud-ui, 1 mixto).

## Historias de usuario

### HU-50.001 — Renderizar panel OPL-ES persistente en franja inferior

**Actor primario:** MN (modelador novato).
**Actores secundarios:** RV (revisor/lector), ME (experto).
**Tipo:** opcloud-ui.
**Nivel categorico:** L (lente OPL-ES) primario; V (render), U (ventana) secundarios.
**Superficie UI:** panel-opl-es (franja inferior del workspace).
**Gesto canonico:** ninguno (persistente al abrir el modelo).

**Historia:**
> Como modelador, quiero ver el panel OPL-ES en la franja inferior del workspace apenas abro el modelo para tener traduccion natural del OPD sin gesto adicional.

**Contexto de negocio:**
La dualidad OPD↔OPL-ES es la promesa central de OPM. Si el OPL-ES requiere un gesto para abrirse, la dualidad se rompe: el usuario trabaja "solo en canvas" y pierde la retroalimentacion pedagogica. Que el panel sea **persistente por defecto** es invariante de producto.

**Criterios de aceptacion:**
- **Dado** que abro un modelo con cosas, **cuando** se renderiza el workspace, **entonces** el panel OPL-ES aparece en la franja inferior con la cabecera `OPL-ES` visible.
- **Dado** que el OPD activo tiene N cosas o enlaces verbalizables, **cuando** miro el panel, **entonces** veo N oraciones (una por unidad verbalizable segun las reglas HU-50.007+).
- **Dado** que el OPD activo esta vacio, **cuando** miro el panel, **entonces** veo cabecera `OPL-ES` y lista vacia, sin error.
- **Dado** que el panel esta visible, **cuando** redimensiono la ventana del navegador, **entonces** el panel se ajusta al ancho completo de la franja inferior.

**Reglas y restricciones:**
- Posicion default: franja inferior. Puede reposicionarse a left pane (HU-50.004).
- El panel no oscurece el canvas; ocupa su propia franja.
- La cabecera `OPL-ES` esta en la esquina superior-izquierda del panel.

**Modelo de datos tocado:**
- Ninguno. El OPL-ES es vista derivada.

**Dependencias:**
- Ninguna directa. Todas las demas HU del panel asumen que el panel esta visible.

**Integraciones:**
- Renderer OPL-ES (`src/render/opl-renderer.ts`).
- Layout del workspace.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/50-opl-pane.md` §1, §2, §3.1.
- Frames: frame_00001, frame_00004.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [opl-es, ui, lente, render, persistente].

---

### HU-50.002 — Numerar oraciones OPL-ES con prefijo ordinal

**Actor primario:** MN.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** V (render) primario; L secundario.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como modelador, quiero que cada oracion OPL-ES aparezca con un prefijo numerico para poder referenciar oraciones por indice en conversacion, revision o documentacion.

**Contexto de negocio:**
La numeracion transforma al OPL-ES en un documento citable. En revisiones ("la oracion 14 dice …") y en clases pedagogicas, el indice es imprescindible. Es default on.

**Criterios de aceptacion:**
- **Dado** que el OPD tiene N oraciones, **cuando** miro el panel con numeracion activa, **entonces** veo `1.`, `2.`, … `N.` como prefijo de cada oracion.
- **Dado** que cambio el orden de render del OPD (p.ej. traigo una cosa nueva), **cuando** se re-numera, **entonces** los prefijos se reasignan segun el orden actual, sin saltos.
- **Dado** que elimino la oracion 3, **cuando** se re-numera, **entonces** las oraciones posteriores se desplazan: antigua `4` pasa a ser `3`.

**Reglas y restricciones:**
- Numeracion es **transitoria**: deriva del render order del OPD activo, no persiste.
- El orden del OPD es el orden canonico OPL-ES — no alfabetico, no de creacion.
- Default: numeracion activa (configurable en EPICA-81).

**Modelo de datos tocado:**
- Ninguno persistente. Indice calculado por render.

**Dependencias:**
- Bloqueada por: HU-50.001.

**Integraciones:**
- Renderer OPL-ES.

**Notas de evidencia:**
- Fuente OPCloud: §2, §3.1, §5.1, §9.
- Frames: frame_00001, frame_00004.
- Clase de afirmacion: observado.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [opl-es, numeracion, render, lente].

---

### HU-50.003 — Alternar numeracion con toggle `123`

**Actor primario:** ME.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V secundario.
**Superficie UI:** panel-opl-es (boton `123` en esquina superior-derecha).
**Gesto canonico:** clic unico.

**Historia:**
> Como modelador experto, quiero alternar la numeracion del OPL-ES con un clic para obtener una vista limpia sin indices cuando estoy presentando o exportando visualmente.

**Contexto de negocio:**
En presentaciones, la numeracion distrae. Un toggle por clic permite el cambio instantaneo sin abrir settings globales. Duplicado semantico existe en el footer (`Hide Numbering`) — ambos controles actuan sobre el mismo flag.

**Criterios de aceptacion:**
- **Dado** que la numeracion esta activa, **cuando** hago clic en `123`, **entonces** los prefijos desaparecen de todas las oraciones.
- **Dado** que la numeracion esta desactivada, **cuando** hago clic en `123`, **entonces** los prefijos reaparecen.
- **Dado** que apago la numeracion, **cuando** miro las oraciones, **entonces** el orden de las oraciones no cambia (solo desaparece el prefijo).
- **Dado** que el toggle `Hide Numbering` del footer y el boton `123` del header actuan sobre el mismo estado, **cuando** uso uno, **entonces** el otro refleja el estado actualizado.

**Reglas y restricciones:**
- Estado del toggle se recuerda por sesion de usuario.
- No altera el modelo.

**Modelo de datos tocado:**
- `preferencias-usuario.opl.numeracion` — boolean — persistente por sesion.

**Dependencias:**
- Bloqueada por: HU-50.002.

**Integraciones:**
- Settings globales (EPICA-81) define el default.

**Notas de evidencia:**
- Fuente OPCloud: §2, §3.1, §3.2ter.
- Clase de afirmacion: observado + confirmado por tooltip.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [opl-es, ui, toggle, numeracion].

---

### HU-50.004 — Mover panel OPL-ES al left pane lateral

**Actor primario:** ME.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario.
**Superficie UI:** panel-opl-es + left-pane.
**Gesto canonico:** clic en boton "mover a left pane".

**Historia:**
> Como modelador experto, quiero mover el OPL-ES al panel izquierdo para ganar altura en el canvas cuando el OPD es vertical o denso.

**Contexto de negocio:**
El canvas demanda mas altura en modelos con in-zoom profundo o con muchos layers apilados. Desplazar el OPL-ES a la columna izquierda libera vertical, a cambio de horizontal. Es una decision de layout por usuario.

**Criterios de aceptacion:**
- **Dado** que el OPL-ES esta en la franja inferior, **cuando** hago clic en el boton "mover a left pane", **entonces** el OPL-ES se re-renderiza como columna lateral izquierda y el canvas gana altura.
- **Dado** que el OPL-ES esta en left pane, **cuando** hago clic en el boton de volver a inferior, **entonces** regresa a franja inferior.
- **Dado** que muevo el panel, **cuando** ocurre el cambio, **entonces** el contenido (oraciones, numeracion, filtrado) se preserva.

**Reglas y restricciones:**
- Default: franja inferior.
- Preferencia de sesion (inferido).
- Coexistencia con panel de notas (EPICA-42): si ambos piden left pane, el comportamiento exacto es **pregunta abierta** (§11.X).

**Modelo de datos tocado:**
- `preferencias-usuario.opl.posicion` — `"inferior" | "izquierda"` — persistente por sesion.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Relaciona: EPICA-42 (notes usan el mismo pane).

**Integraciones:**
- Layout del workspace.
- Panel de notas.

**Notas de evidencia:**
- Fuente OPCloud: §2, §3.1.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [opl-es, ui, layout-ventana, toggle-posicion].

---

### HU-50.005 — Minimizar panel OPL-ES y detener su render

**Actor primario:** ME.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V (performance) secundario.
**Superficie UI:** panel-opl-es (boton minimizar, extremo derecho del header).
**Gesto canonico:** clic unico.

**Historia:**
> Como modelador experto, quiero minimizar el panel OPL-ES para trabajar en canvas sin la carga de render del OPL-ES en diagramas densos.

**Contexto de negocio:**
En modelos grandes, regenerar el OPL-ES en cada cambio puede ser costoso. Minimizar **detiene el render**, no solo lo oculta — es una optimizacion explicita. La transcripcion lo confirma: "this will stop rendering the OPL and help us have a smoother OPD environment."

**Criterios de aceptacion:**
- **Dado** que el OPL-ES esta expandido, **cuando** hago clic en minimizar, **entonces** el panel colapsa a una barra con rotulo `OPL-ES` y el render del OPL-ES se detiene.
- **Dado** que el panel esta minimizado, **cuando** edito el modelo, **entonces** el OPL-ES no se regenera hasta que restaure el panel.
- **Dado** que el panel esta minimizado, **cuando** hago hover sobre elementos OPD, **entonces** no hay highlight cruzado en OPL-ES (porque no hay OPL-ES renderizado).
- **Dado** que el panel esta minimizado, **cuando** el canvas esta visible, **entonces** ocupa el espacio adicional liberado por el OPL-ES.

**Reglas y restricciones:**
- Minimizar ≠ ocultar: ambos son validos pero minimizar detiene el render (performance).
- La barra `OPL-ES` queda visible como punto de anclaje para restaurar.
- Estado de minimizado se recuerda por sesion (inferido).

**Modelo de datos tocado:**
- `preferencias-usuario.opl.minimizado` — boolean — persistente por sesion.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Bloquea a: HU-50.006 (restaurar).

**Integraciones:**
- Renderer OPL-ES (puede pausarse).

**Notas de evidencia:**
- Fuente OPCloud: §2, §3.1, §4.1.
- Frames: frame_00008.
- Transcripcion: "We can minimize the OPL pane, this will stop rendering the OPL".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [opl-es, ui, performance, minimizar].

---

### HU-50.006 — Restaurar panel OPL-ES desde barra colapsada

**Actor primario:** ME.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** panel-opl-es minimizado (barra colapsada).
**Gesto canonico:** clic unico sobre la barra.

**Historia:**
> Como modelador, quiero restaurar el panel OPL-ES con un solo clic sobre la barra colapsada para reactivar la dualidad OPD↔OPL-ES sin viajar a settings.

**Contexto de negocio:**
La accion inversa de minimizar debe ser simetrica y reversible sin perdida: el OPL-ES que se re-renderiza debe ser identico al que estaba antes (mismo orden, misma numeracion, mismo coloreado, mismo filtrado activo si lo habia).

**Criterios de aceptacion:**
- **Dado** que el panel esta minimizado, **cuando** hago clic sobre la barra `OPL-ES`, **entonces** el panel se expande y el OPL-ES se re-renderiza desde el modelo actual.
- **Dado** que hice cambios mientras el panel estaba minimizado, **cuando** restauro, **entonces** las oraciones reflejan los cambios (no muestran el OPL-ES viejo).
- **Dado** que la numeracion estaba activa antes de minimizar, **cuando** restauro, **entonces** la numeracion sigue activa.

**Reglas y restricciones:**
- Restaurar es reversible: no hay perdida de estado.
- El re-render parte del modelo, no de un cache.

**Modelo de datos tocado:**
- `preferencias-usuario.opl.minimizado` — boolean — flip a false.

**Dependencias:**
- Bloqueada por: HU-50.005.

**Integraciones:**
- Renderer OPL-ES.

**Notas de evidencia:**
- Fuente OPCloud: §2, §3.1, §4.1.
- Frames: frame_00010.
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [opl-es, ui, toggle, restaurar].

---

### HU-50.007 — Verbalizar essence y affiliation de cada cosa

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L primario; V secundario.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno (render declarativo al crear/modificar cosa).

**Historia:**
> Como modelador novato, quiero que cada cosa genere una oracion OPL-ES declarando su essence y affiliation para aprender los dos ejes ontologicos leyendo el modelo.

**Contexto de negocio:**
Las oraciones de essence (`*P* es un proceso informacional y sistemico.`) son la declaracion ontologica de la cosa. Son la puerta de entrada al OPL-ES: el lector comprende que es cada cosa antes de ver sus relaciones. El orden canonico es `esencia y afiliacion` (convencion Dori), con el tipo al final.

**Criterios de aceptacion:**
- **Dado** que creo un proceso `P` con defaults, **cuando** miro el OPL-ES, **entonces** aparece `*P* es un proceso informacional y sistemico.`.
- **Dado** que creo un objeto `O` con defaults, **cuando** miro el OPL-ES, **entonces** aparece `**O** es un objeto informacional y sistemico.`.
- **Dado** que toggleo `O.esencia` a `fisica`, **cuando** miro el OPL-ES, **entonces** la oracion cambia a `**O** es un objeto fisico y sistemico.`.
- **Dado** que toggleo `O.afiliacion` a `ambiental`, **cuando** miro el OPL-ES, **entonces** la oracion cambia a `**O** es un objeto fisico y ambiental.`.
- **Dado** que el toggle global `mostrar oraciones de esencia` esta en off (EPICA-81), **cuando** miro el OPL-ES, **entonces** estas oraciones no aparecen.

**Reglas y restricciones:**
- Formato canonico: `<NombreCosa> es un/a <esencia> y <afiliacion> <tipo-cosa>.`. [OPL-ES D1..D4]
- Uso de `un` vs `una` segun genero del sustantivo que sigue (proceso, objeto).
- Orden: esencia antes que afiliacion.
- Convenciones tipograficas: Objeto en **negrita**, Proceso en *cursiva*. [OPL-ES §1.7]
- La primera oracion del OPD suele ser la declaracion de esencia del sistema raiz.

**Modelo de datos tocado:**
- Ninguno persistente; deriva de `thing.esencia`, `thing.afiliacion`, `thing.tipo`, `thing.nombre`.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Bloquea a: HU-50.008+ (todas las demas verbalizaciones asumen esta base).

**Integraciones:**
- Motor OPL-ES.
- EPICA-10 (creacion), EPICA-81 (toggle global de visibilidad).

**Notas de evidencia:**
- Fuente normativa: [OPL-ES D1..D4] declaracion de propiedades genericas.
- Fuente OPCloud: §3.4, §6, §9.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [opl-es, kernel, essence, affiliation, declaracion].

---

### HU-50.008 — Verbalizar enlace estructural consta de (aggregation)

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L primario; V secundario.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero que un Aggregation-Participation genere una oracion `consta de` para leer la descomposicion whole-part en lenguaje natural.

**Contexto de negocio:**
El link de agregacion es la columna vertebral de la descomposicion estructural. Su verbalizacion (`**X** consta de **A**, **B** y **C**.`) es inmediata y familiar: coincide con el lenguaje ordinario, reforzando la legibilidad del OPL-ES.

**Criterios de aceptacion:**
- **Dado** que `X` tiene agregacion con `A`, `B`, `C`, **cuando** miro el OPL-ES, **entonces** aparece `**X** consta de **A**, **B** y **C**.`.
- **Dado** que solo hay una parte `A`, **cuando** miro el OPL-ES, **entonces** aparece `**X** consta de **A**.`.
- **Dado** que hay dos partes `A` y `B`, **cuando** miro el OPL-ES, **entonces** aparece `**X** consta de **A** y **B**.` (sin coma previa al `y` con dos elementos).
- **Dado** que agrego una cuarta parte `D`, **cuando** se re-renderiza, **entonces** la oracion se actualiza con las cuatro partes separadas por comas y `y` antes del ultimo.

**Reglas y restricciones:**
- Formato: `<Todo> consta de <partes separadas por coma y "y" final>.`. [OPL-ES §2]
- Orden de las partes: render order del OPD activo (consistente con HU-50.002).
- Coma de Oxford con tres o mas elementos; omitida con dos.

**Modelo de datos tocado:**
- Ninguno persistente; deriva de `link.tipo="aggregation"`, source, targets.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Relaciona: EPICA-11 (creacion de aggregation), EPICA-18 (semi-folding).

**Integraciones:**
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §2] vocabulario de verbos estructurales; `consta de` es el verbo canonico para agregacion.
- Fuente OPCloud: §5.4, §9.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [opl-es, kernel, aggregation, consta-de, links].

---

### HU-50.009 — Verbalizar enlace estructural exhibe (characterization)

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L primario; V secundario.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero que un Exhibition-Characterization genere una oracion `exhibe` para leer la caracteristica/atributo en lenguaje natural.

**Contexto de negocio:**
Exhibition es la relacion whole-attribute (una cosa exhibe propiedades u objetos caracteristicos). Su verbalizacion (`**X** exhibe **A**, **B** y **C**.`) es paralela a `consta de` pero con semantica distinta — la caracteristica no es parte estructural.

**Criterios de aceptacion:**
- **Dado** que `X` exhibe `A`, `B`, `C`, **cuando** miro el OPL-ES, **entonces** aparece `**X** exhibe **A**, **B** y **C**.`.
- **Dado** que un objeto `Gas Properties` exhibe varios atributos (`R`, `cp_cold`, `cp_hot`, `gam_cold`, `gam_hot`), **cuando** miro el OPL-ES, **entonces** aparece una sola oracion con todos los atributos listados.
- **Dado** que un atributo tiene alias (p.ej. `cp_cold` alias `cp_c`), **cuando** se verbaliza, **entonces** el alias aparece junto al nombre (ver convenciones §5.4).

**Reglas y restricciones:**
- Formato: `<Exhibidor> exhibe <atributos separados por coma y "y">.`. [OPL-ES §2]
- Mismo patron gramatical que `consta de` pero verbo distinto.
- Aggregation vs Exhibition es semantica, no sintactica — el OPL-ES diferencia por verbo.

**Modelo de datos tocado:**
- Ninguno persistente; deriva de `link.tipo="exhibition"`.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Relaciona: EPICA-11, EPICA-17 (atributos).

**Integraciones:**
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §2] vocabulario de verbos; `exhibe` es el verbo canonico para caracterizacion.
- Fuente OPCloud: §3.5, §5.4, frame_00020.
- Clase de afirmacion: observado.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [opl-es, kernel, characterization, exhibe, links].

---

### HU-50.010 — Verbalizar enlaces procedurales (requiere, genera, consume, afecta, maneja)

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L primario; V secundario.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero que cada link procedural genere la oracion OPL-ES correspondiente segun el verbo canonico para leer el comportamiento del sistema en prosa.

**Contexto de negocio:**
Los links procedurales son los actuadores del modelo: que consume un proceso, que produce, que usa como instrumento, que afecta. Cada uno tiene verbo canonico OPL-ES que el motor debe emitir correctamente — este es el vocabulario base del lenguaje.

**Criterios de aceptacion:**
- **Dado** que un Instrument link va de objeto `I` a proceso `P`, **cuando** miro el OPL-ES, **entonces** aparece `**I** requiere *P*.`.
- **Dado** que un Consumption link va de objeto `C` a proceso `P`, **cuando** miro el OPL-ES, **entonces** aparece `**C** consume *P*.`.
- **Dado** que un Result link va de proceso `P` a objeto `R`, **cuando** miro el OPL-ES, **entonces** aparece `*P* genera **R**.`.
- **Dado** que un Effect link bidireccional conecta `E` y proceso `P`, **cuando** miro el OPL-ES, **entonces** aparece `*P* afecta **E**.`.
- **Dado** que un Agent link va de objeto fisico `A` a proceso `P`, **cuando** miro el OPL-ES, **entonces** aparece `**A** maneja *P*.`.
- **Dado** que un link tiene modificador `NOT`, **cuando** miro la oracion, **entonces** el verbo se niega segun regla canonica (p.ej. `*P* no genera **R**.` — **pregunta abierta**: forma exacta, §11.X).

**Reglas y restricciones:**
- Vocabulario controlado OPL-ES: `requiere`, `genera`, `consume`, `afecta`, `maneja`. No se permiten sinonimos. [OPL-ES T1..T5] [OPL-ES §2]
- Subtipos (Instrument Condition, Consumption Event, etc.) agregan matices: ver §EPICA-15 y §EPICA-16.
- El verbo no se traduce al coloreado (queda negro), pero los tokens si (HU-50.016).
- El sujeto gramatical es la fuente del enlace; el verbo se conjuga hacia el destino.

**Modelo de datos tocado:**
- Ninguno persistente; deriva de `link.tipo`, `link.subtipo`, `link.modificador`.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Relaciona: EPICA-10 (creacion de links), EPICA-15 (links avanzados).

**Integraciones:**
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES T1..T5] plantillas de enlaces procedurales; [OPL-ES §2] vocabulario canonico de verbos.
- Fuente OPCloud: §3.4, §5.4, §9.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [opl-es, kernel, links, procedural, verbo-canonico].

---

### HU-50.011 — Verbalizar estados de un objeto stateful

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L primario; V secundario.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero que un objeto con estados genere una oracion OPL-ES que los liste para leer la dinamica de estados del objeto en prosa.

**Contexto de negocio:**
Los estados son una propiedad estructural del objeto: un objeto stateful tiene ≥2 estados alternos. El OPL-ES los verbaliza con la forma `puede estar` (o analoga), integrando la dinamica de estados al lenguaje natural.

**Criterios de aceptacion:**
- **Dado** que `O` tiene estados `s1` y `s2`, **cuando** miro el OPL-ES, **entonces** aparece `**O** puede estar `s1` o `s2`.` (forma canonica a confirmar contra SSOT OPL-ES).
- **Dado** que `O` tiene un estado inicial marcado, **cuando** se verbaliza, **entonces** la oracion indica el estado inicial (p.ej. `**O** es inicialmente `s1`.`).
- **Dado** que una transicion entre estados viene desencadenada por un proceso `P`, **cuando** se verbaliza, **entonces** aparece una oracion que conecta `P` con la transicion (ver EPICA-13 para detalle).

**Reglas y restricciones:**
- Formato exacto pendiente de cruce con SSOT OPL-ES; borrador `**O** puede estar `s1` o `s2`, …, o `sn`.`.
- Estados se separan con coma; ultimo con `o`.
- Estados en `monoespaciado`. [OPL-ES §1.7]
- La verbalizacion de transiciones es competencia de EPICA-13; esta HU cubre solo la declaracion de estados.

**Modelo de datos tocado:**
- Ninguno persistente; deriva de `thing.estados[]`.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Relaciona: EPICA-13 (creacion de estados).

**Integraciones:**
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES S1..S5] plantillas de estados; [OPL-ES §2] `puede estar`, `es inicial`.
- Fuente OPCloud: §6 implicito, referencia a estados.
- Clase de afirmacion: inferido (forma exacta pendiente de cruce con SSOT).
- Etiqueta: `requires-clarification`.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [opl-es, kernel, states, requires-clarification].

---

### HU-50.012 — Verbalizar descomposicion in-zoom sincrona

**Actor primario:** MN.
**Actores secundarios:** RV.
**Tipo:** opm-semantica.
**Nivel categorico:** L primario; V secundario.
**Superficie UI:** panel-opl-es (en el OPD padre o en el OPD hijo segun contexto).
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero que un in-zoom sincrono genere una oracion OPL-ES con la secuencia temporal (`que ocurren en esa secuencia temporal`) para leer la dinamica del proceso descompuesto.

**Contexto de negocio:**
In-zoom es la descomposicion procedural por excelencia: un proceso padre se abre en sub-procesos. Cuando la descomposicion es **sincrona** (los sub-procesos ocurren en secuencia temporal fija), el OPL-ES lo explicita con la clausula "que ocurren en esa secuencia temporal". Esta precision distingue in-zoom de part-unfold (HU-50.013).

**Criterios de aceptacion:**
- **Dado** que `P` esta in-zoomed en `P1`, `P2`, `P3` sincronos, **cuando** miro el OPL-ES, **entonces** aparece `*P* se descompone en *P1*, *P2* y *P3*, que ocurren en esa secuencia temporal.`.
- **Dado** que el SD2 es in-zoom de `Turbojet Engine Operating` dentro del sistema, **cuando** miro el OPL-ES, **entonces** la primera oracion del SD2 incluye `desde SD se descompone en SD1 en …` (referencia al OPD padre).
- **Dado** que el in-zoom se reorganiza (cambia el orden de sub-procesos), **cuando** se re-renderiza, **entonces** el orden en la oracion refleja el nuevo orden temporal.
- **Dado** que hay solo un sub-proceso `P1`, **cuando** miro el OPL-ES, **entonces** aparece `*P* se descompone en *P1*.` (sin clausula temporal porque no hay secuencia).

**Reglas y restricciones:**
- La clausula "que ocurren en esa secuencia temporal" es **marcador de sincronia**. [OPL-ES TS1..TS5]
- In-zoom es sincrono por default; asincrono se configura explicitamente (ver HU-50.013).
- Formato: `<Padre> se descompone en <sub1>, <sub2> y <subN>, que ocurren en esa secuencia temporal.`.

**Modelo de datos tocado:**
- Ninguno persistente; deriva de `in-zoom` relationship + `sincronia` flag.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Relaciona: EPICA-12 (canvas in-zoom).

**Integraciones:**
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES TS1..TS5] plantillas de descomposicion procedural; [OPL-ES §2] `se descompone en`, `que ocurren en esa secuencia temporal`.
- Fuente OPCloud: §3.4, frame_00016.
- Clase de afirmacion: observado + confirmado contra SSOT OPL.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [opl-es, kernel, inzoom, sincronia, time-sequence].

---

### HU-50.013 — Verbalizar part-unfold asincrono (ocurren)

**Actor primario:** ME.
**Actores secundarios:** RV.
**Tipo:** opm-semantica.
**Nivel categorico:** L primario; V secundario.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador experto, quiero que un part-unfold asincrono use el verbo `consta de` con la clausula `que ocurren` sin indicar secuencia temporal para distinguir descomposiciones sin orden fijo de las sincronas.

**Contexto de negocio:**
El contraste entre `que ocurren en esa secuencia temporal` (sincronia, HU-50.012) y `que ocurren` simple (part-unfold asincrono) es la sutileza linguistica que permite leer la concurrencia del modelo directamente en el OPL-ES. Part-unfold lista partes procedurales sin orden temporal.

**Criterios de aceptacion:**
- **Dado** que `P` tiene part-unfold asincrono con sub-procesos `P1`, `P2`, `P3`, **cuando** miro el OPL-ES, **entonces** aparece `*P* consta de *P1*, *P2* y *P3*, que ocurren.` (sin "en esa secuencia temporal").
- **Dado** que el part-unfold es sincrono, **cuando** miro el OPL-ES, **entonces** aparece con la clausula temporal completa (ver HU-50.012).
- **Dado** que un Object tiene part-unfold, **cuando** miro el OPL-ES, **entonces** aparece la forma estructural `**X** consta de **A**, **B** y **C**.` **sin** clausula temporal (objetos no tienen secuencia).

**Reglas y restricciones:**
- Verbo `que ocurren` sin secuencia temporal = asincrono. [OPL-ES TS1..TS5]
- Verbo `que ocurren en esa secuencia temporal` = sincrono (in-zoom).
- Object-part-unfold usa `consta de` sin clausula temporal.
- Diferencia confirmada contra SSOT OPL-ES: sync=in-zoom, async=part-unfold (doc reverse y convencion Dori).

**Modelo de datos tocado:**
- Ninguno persistente; deriva de `unfold.tipo="part"` + `unfold.sincronia`.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Relaciona: HU-50.012, EPICA-12.

**Integraciones:**
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES TS1..TS5] plantillas de descomposicion; [OPL-ES §2] `consta de`, `que ocurren`.
- Fuente OPCloud: §3.4 discusion sobre sync vs async, convencion Dori/SSOT OPL-ES.
- Clase de afirmacion: confirmado contra SSOT OPL.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [opl-es, kernel, unfold, parts, asincrono, ocurren].

---

### HU-50.014 — Verbalizar feature-unfold (exhibe)

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** L primario; V secundario.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador experto, quiero que un feature-unfold genere una oracion `exhibe` para leer la descomposicion por atributos/caracteristicas en prosa.

**Contexto de negocio:**
Feature-unfold es uno de los tres unfolds canonicos OPM (junto con part y specialization). Su verbalizacion reutiliza el verbo `exhibe` (mismo que Exhibition-Characterization) porque semanticamente lista caracteristicas.

**Criterios de aceptacion:**
- **Dado** que `X` tiene feature-unfold con features `F1`, `F2`, `F3`, **cuando** miro el OPL-ES, **entonces** aparece `**X** exhibe **F1**, **F2** y **F3**.`.
- **Dado** que `X` tiene aggregation + feature-unfold simultaneos, **cuando** miro el OPL-ES, **entonces** aparecen dos oraciones (una `consta de`, otra `exhibe`) sin conflicto.

**Reglas y restricciones:**
- Verbo: `exhibe`. [OPL-ES TS1..TS5]
- Misma gramatica de lista que `consta de` (coma + `y` final).
- Feature-unfold vs Exhibition-Characterization: el link es distinto pero el verbo coincide — el OPL-ES abstrae la distincion.

**Modelo de datos tocado:**
- Ninguno persistente; deriva de `unfold.tipo="feature"`.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Relaciona: HU-50.009, EPICA-12.

**Integraciones:**
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES TS1..TS5] plantillas de descomposicion estructural; [OPL-ES §2] `exhibe`.
- Fuente OPCloud: §3.4 (tres unfolds canonicos), SSOT OPL-ES.
- Clase de afirmacion: confirmado contra SSOT OPL.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [opl-es, kernel, unfold, features, exhibe].

---

### HU-50.015 — Verbalizar specialization-unfold (es un/una)

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** L primario; V secundario.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador experto, quiero que un specialization-unfold genere oraciones `es un`/`es una` para leer la taxonomia (hipernim/hiponim) en prosa.

**Contexto de negocio:**
Specialization es la tercera descomposicion canonica: un tipo general se especializa en subtipos. El OPL-ES lo expresa con la forma `*S1* es un/una **G**.`, generando una oracion por especializacion (no una lista).

**Criterios de aceptacion:**
- **Dado** que `G` se especializa en `S1`, `S2`, `S3`, **cuando** miro el OPL-ES, **entonces** aparecen tres oraciones: `*S1* es un **G**.`, `*S2* es un **G**.`, `*S3* es un **G**.` (una por especializacion).
- **Dado** que `G` tiene una sola especializacion `S1`, **cuando** miro el OPL-ES, **entonces** aparece `*S1* es un **G**.`.
- **Dado** que el nombre de `G` es femenino (p.ej. `**Una Cosa**`), **cuando** se verbaliza, **entonces** el articulo se ajusta (`*S1* es una **Cosa**.`).
- **Dado** que el nombre de `G` es masculino, **cuando** se verbaliza, **entonces** aparece con `un`.

**Reglas y restricciones:**
- Formato: `<subtipo> es un/una <supertipo>.`, una oracion por especializacion. [OPL-ES TS1..TS5]
- No se agrupan las especializaciones en una sola oracion (distingue del `consta de`).
- Articulo `un` vs `una` segun genero del supertipo. [OPL-ES §2]

**Modelo de datos tocado:**
- Ninguno persistente; deriva de `unfold.tipo="specialization"`.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Relaciona: EPICA-12.

**Integraciones:**
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES TS1..TS5] plantillas de descomposicion; [OPL-ES §2] `es un/una`.
- Fuente OPCloud: §3.4 (tres unfolds), SSOT OPL-ES.
- Clase de afirmacion: confirmado contra SSOT OPL.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [opl-es, kernel, unfold, specialization, es-un].

---

### HU-50.016 — Colorear tokens OPL-ES por clase de cosa

**Actor primario:** MN.
**Actores secundarios:** RV.
**Tipo:** opm-semantica.
**Nivel categorico:** V primario.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero que los nombres de objetos, procesos y sistemas aparezcan coloreados en el OPL-ES para identificar visualmente la clase de cada token sin releer.

**Contexto de negocio:**
El coloreado convierte al OPL-ES en un texto **enriquecido semanticamente**: el lector ve `Turbojet Engine` en verde y sabe que es objeto sin tener que buscar la declaracion de esencia. Es la mitad visual del lenguaje controlado. El coloreado esta normado por OPL-ES, no es libre del usuario.

**Criterios de aceptacion:**
- **Dado** que una oracion menciona un objeto `O`, **cuando** miro el OPL-ES, **entonces** el token `O` aparece en verde.
- **Dado** que una oracion menciona un proceso `P`, **cuando** miro el OPL-ES, **entonces** el token `P` aparece en azul.
- **Dado** que una oracion menciona el sistema raiz / agregado, **cuando** miro el OPL-ES, **entonces** el token aparece en azul mas oscuro.
- **Dado** que una oracion incluye alias (`{tes}`), **cuando** miro el OPL-ES, **entonces** el alias entre llaves aparece con el mismo color que el portador.
- **Dado** que una oracion incluye conectores (`es`, `de`, `y`, `exhibe`, `consta de`, `afecta`, `requiere`), **cuando** miro el OPL-ES, **entonces** los conectores aparecen en negro (sin coloreado).
- **Dado** que una oracion menciona la misma cosa dos veces, **cuando** hago hover sobre una mencion, **entonces** ambas menciones se subrayan sincronicamente.

**Reglas y restricciones:**
- Color verde: objeto.
- Color azul: proceso.
- Color azul oscuro: sistema raiz / agregado.
- Color negro: conectores del lenguaje controlado (verbos OPL-ES y particulas).
- Alias: mismo color del portador.
- Convenciones tipograficas: **Objeto** en negrita, *Proceso* en cursiva, `estado` en monoespaciado. [OPL-ES §1.7]
- Toggle `sync color of OPL and OPD` (EPICA-81) controla si cambios manuales de color en canvas propagan al OPL-ES.

**Modelo de datos tocado:**
- Ninguno persistente; coloreado deriva de `thing.tipo` al render.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Relaciona: EPICA-81 (settings de color).

**Integraciones:**
- Motor OPL-ES.
- Renderer (CSS o inline styles).

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §1.7] convenciones tipograficas y de color.
- Fuente OPCloud: §5.4.
- Frames: frame_00004.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [opl-es, render, coloreado, pedagogico, tokens].

---

### HU-50.017 — Resaltar cruzado OPL-ES↔OPD en hover

**Actor primario:** MN.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; L secundario.
**Superficie UI:** panel-opl-es + canvas-opd.
**Gesto canonico:** hover (mouseover).

**Historia:**
> Como modelador, quiero que al pasar el cursor sobre un elemento en OPD o en OPL-ES se resalten los elementos correspondientes en la otra superficie para ver la equivalencia bimodal sin seleccionar.

**Contexto de negocio:**
La dualidad OPD↔OPL-ES exige que el usuario pueda cruzar entre las dos superficies sin gesto explicito. El hover es el cruce mas ligero posible: sin seleccion, sin mutacion, sin ruido.

**Criterios de aceptacion:**
- **Dado** que paso el cursor sobre una cosa `X` en el canvas, **cuando** hago hover, **entonces** todas las oraciones OPL-ES que mencionan `X` se resaltan.
- **Dado** que paso el cursor sobre una oracion OPL-ES, **cuando** hago hover, **entonces** los elementos OPD mencionados en esa oracion se resaltan en el canvas.
- **Dado** que retiro el cursor, **cuando** el hover termina, **entonces** los resaltados desaparecen.
- **Dado** que hago hover sobre un token especifico dentro de una oracion (p.ej. `**X**` dentro de `**X** requiere *Y*.`), **cuando** hago hover, **entonces** se resalta `X` en canvas pero no `Y`.
- **Dado** que el panel OPL-ES esta minimizado, **cuando** hago hover en canvas, **entonces** no hay highlight cruzado en OPL-ES (no hay OPL-ES renderizado — HU-50.005).

**Reglas y restricciones:**
- Hover no altera el modelo.
- El highlight es transitorio; no persiste al quitar el cursor.
- El cruce es bidireccional, simetrico.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Relaciona: HU-50.018 (filtrado por seleccion, diferente a hover).

**Integraciones:**
- Renderer OPL-ES.
- Renderer canvas.

**Notas de evidencia:**
- Fuente OPCloud: §2, §3.2.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [opl-es, ui, sincronia, hover, bimodal].

---

### HU-50.018 — Filtrar OPL-ES por seleccion activa en canvas

**Actor primario:** ME.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; L secundario.
**Superficie UI:** panel-opl-es + canvas-opd.
**Gesto canonico:** clic en elemento del canvas (seleccion).

**Historia:**
> Como modelador experto, quiero que al seleccionar un elemento en canvas el OPL-ES se filtre para mostrar solo las oraciones que lo mencionan para enfocarme en la semantica del elemento sin leer todo el OPL-ES.

**Contexto de negocio:**
Distinto del hover (HU-50.017): la **seleccion** es persistente y aplica filtro. Esto transforma al OPL-ES en un **panel de inspeccion contextual** — la seleccion es el filtro del OPL-ES, sin necesidad de controles explicitos. Es propiedad UX central de OPCloud.

**Criterios de aceptacion:**
- **Dado** que selecciono el objeto `OPD` en el canvas del modelo `OPM structure meta-model`, **cuando** miro el OPL-ES, **entonces** solo aparecen las oraciones que mencionan `OPD` (ej. 6, 25, 26, 28, 34 — 5 de las 39 completas).
- **Dado** que tengo un elemento seleccionado, **cuando** hago clic en zona vacia del canvas, **entonces** la seleccion se limpia y el OPL-ES vuelve a mostrar todas las oraciones.
- **Dado** que selecciono un link en vez de una cosa, **cuando** miro el OPL-ES, **entonces** aparece solo la oracion de ese link.
- **Dado** que selecciono multiples elementos (multi-seleccion), **cuando** miro el OPL-ES, **entonces** aparecen las oraciones que mencionan **cualquiera** de los elementos seleccionados (union).
- **Dado** que el filtrado esta activo, **cuando** miro la numeracion, **entonces** los prefijos preservan los indices originales (no se re-numeran al filtrar).

**Reglas y restricciones:**
- Filtrado es render transitorio; no altera el modelo.
- Seleccion unica: filtro por esa entidad.
- Multi-seleccion: union (ver arriba).
- Deseleccionar (clic en zona vacia): restablece lista completa.
- La numeracion mantiene los indices originales del OPD completo (no re-numera a `1, 2, 3` con el subconjunto).

**Modelo de datos tocado:**
- Ninguno persistente; deriva de la seleccion activa.

**Dependencias:**
- Bloqueada por: HU-50.001, HU-50.002.
- Relaciona: EPICA-10 (seleccion en canvas).

**Integraciones:**
- Motor OPL-ES.
- Estado de seleccion del canvas.

**Notas de evidencia:**
- Fuente OPCloud: §3.2bis (verificado en sandbox con `OPM structure meta-model`).
- Clase de afirmacion: confirmado en sandbox.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [opl-es, ui, sincronia, filtrado, seleccion, bimodal].

---

### HU-50.019 — Editar nombre de cosa por doble clic en OPL-ES

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K (propaga a `thing.nombre`) secundario.
**Superficie UI:** panel-opl-es + popup-auto-format.
**Gesto canonico:** doble clic sobre token de cosa en una oracion OPL-ES.

**Historia:**
> Como modelador, quiero editar el nombre de una cosa haciendo doble clic sobre su mencion en el OPL-ES para renombrar desde la vista textual sin viajar al canvas.

**Contexto de negocio:**
El OPL-ES no es solo lectura: edita. Doble clic sobre el token invoca el **mismo popup** que la creacion en canvas (`Auto Format / Descripcion / Actualizar`), cumpliendo la invariante de controles coherentes entre superficies. El cambio se propaga a canvas, biblioteca y todas las menciones OPL-ES simultaneamente.

**Criterios de aceptacion:**
- **Dado** que la oracion 5 menciona `Turbojet Engine Operating`, **cuando** hago doble clic sobre ese token, **entonces** se abre el popup `Auto Format / Descripcion / Actualizar` con el nombre actual preseleccionado.
- **Dado** que el popup esta abierto tras doble clic en OPL-ES, **cuando** cambio el nombre y confirmo con `Actualizar` o `Enter`, **entonces** el nombre cambia en canvas, biblioteca y todas las oraciones OPL-ES que lo mencionan.
- **Dado** que hago doble clic sobre un conector (`de`, `y`, `es`), **cuando** hago doble clic, **entonces** no se abre ningun popup (solo tokens coloreados son activos).
- **Dado** que el popup esta abierto, **cuando** cierro con `Esc` o clic fuera, **entonces** los cambios se descartan (inferido, ver HU-50.XX cancelacion).
- **Dado** que confirme cambio de nombre, **cuando** consulto el canvas, **entonces** el canvas refleja el nuevo nombre sin refresh manual.

**Reglas y restricciones:**
- Popup identico al de creacion en canvas (ver HU-10.003) — invariante de controles.
- Solo tokens coloreados (objetos, procesos, sistema raiz) son activos.
- Alias tambien editables por doble clic (pendiente de confirmacion contra §6).
- Los conectores OPL-ES (`de`, `y`, `es`, `exhibe`, `requiere`, etc.) no son activos en doble clic (HU-50.020 los maneja en clic simple sobre verbo).

**Modelo de datos tocado:**
- `thing.nombre` — string — persistente.
- `thing.descripcion` — string nullable — persistente (si se edita el campo).

**Dependencias:**
- Bloqueada por: HU-50.001.
- Relaciona: HU-10.003 (popup de creacion), HU-50.022 (propagacion).

**Integraciones:**
- Popup de creacion/rename.
- Renderer canvas, biblioteca lateral, OPD navigator.

**Notas de evidencia:**
- Fuente OPCloud: §3.3, §4.3.
- Frames: frame_00013.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [opl-es, ui, rename, popup-inline, edicion-inversa].

---

### HU-50.020 — Editar propiedades de enlace por doble clic en verbo

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K (modifica `link.*`) secundario.
**Superficie UI:** panel-opl-es + popup-link-properties.
**Gesto canonico:** doble clic sobre verbo del link (`requiere`, `exhibe`, `afecta`, `consta de`, `genera`, `consume`, `maneja`).

**Historia:**
> Como modelador experto, quiero editar las propiedades de un enlace (multiplicidad, ordered, path, probabilidad, estilo) haciendo doble clic sobre su verbo OPL-ES para modificar sin viajar a canvas.

**Contexto de negocio:**
El verbo OPL-ES es el ancla del link. Doble clic abre el **mismo popup** de propiedades que se abre desde la link table en canvas — coherencia total entre superficies. Campos presentes: `Multiplicidad Origen`, `Multiplicidad Destino`, `Ordenado`, `Path`, `Probabilidad`, `Actualizar`, `Estilo`, `Copiar Estilo`.

**Criterios de aceptacion:**
- **Dado** que una oracion OPL-ES contiene el verbo `requiere`, **cuando** hago doble clic sobre ese verbo, **entonces** se abre el popup de propiedades del link correspondiente.
- **Dado** que el popup esta abierto, **cuando** miro los campos, **entonces** veo `Multiplicidad Origen`, `Multiplicidad Destino`, checkbox `Ordenado`, boton `Actualizar`, boton `Estilo`, boton `Copiar Estilo`.
- **Dado** que el link es probabilistico o tiene path, **cuando** el popup se abre, **entonces** incluye ademas los campos `Path` y `Probabilidad`.
- **Dado** que modifico `Multiplicidad Destino` y hago `Actualizar`, **cuando** se aplica, **entonces** el cambio se refleja en canvas (multiplicidad visible en el link) y en la oracion OPL-ES.
- **Dado** que hago clic en `Estilo`, **cuando** se abre, **entonces** me lleva al editor de estilo del link (EPICA-14).
- **Dado** que hago clic en `Copiar Estilo`, **cuando** copio, **entonces** el estilo queda disponible para aplicar a otros links (mecanismo de portapapeles de estilo, ver EPICA-14).

**Reglas y restricciones:**
- Popup identico al de link table desde canvas (EPICA-16).
- Campos condicionales: `Path` y `Probabilidad` solo para tipos que los soportan.
- Confirmacion: `Actualizar` aplica; `Esc`/clic fuera descarta (inferido).
- No hay paso intermedio: el popup escribe directo al modelo al confirmar.

**Modelo de datos tocado:**
- `link.multiplicidad_origen` — string/number — persistente.
- `link.multiplicidad_destino` — string/number — persistente.
- `link.ordenado` — boolean — persistente.
- `link.path` — string — persistente (cuando aplica).
- `link.probabilidad` — number — persistente (cuando aplica).
- `link.estilo` — objeto — persistente.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Relaciona: EPICA-16 (popup de propiedades de link), EPICA-14 (styling).

**Integraciones:**
- Popup de propiedades de link.
- Renderer OPL-ES + canvas.

**Notas de evidencia:**
- Fuente OPCloud: §3.4, §5.3.
- Frames: frame_00021.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [opl-es, ui, links, popup, edicion-inversa, multiplicidad].

---

### HU-50.021 — Seleccionar enlace especifico en oracion multi-enlace

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario.
**Superficie UI:** panel-opl-es + popup-selector-multi-enlace.
**Gesto canonico:** doble clic sobre oracion con multiples links codificados.

**Historia:**
> Como modelador experto, quiero elegir que enlace especifico editar cuando una oracion OPL-ES compacta varios links para acceder a cada uno sin ambiguedad.

**Contexto de negocio:**
Cuando una cosa tiene varios links del mismo tipo (p.ej. `**Gas Properties** exhibe **R**, **cp_cold**, **cp_hot**, **gam_cold** y **gam_hot**`), el OPL-ES compacta la oracion en una sola. Para editar un link especifico, hace falta desambiguar: el selector aparece como popup intermedio con un boton por enlace.

**Criterios de aceptacion:**
- **Dado** que una oracion compacta N links (p.ej. `exhibe R, cp_cold, cp_hot, gam_cold y gam_hot`), **cuando** hago doble clic en esa oracion, **entonces** se abre un popup con N botones tipo `Gas Prope... -> cp_cold [...]`, `-> cp_hot [...]`, etc.
- **Dado** que el popup selector esta abierto, **cuando** hago clic en uno de los botones, **entonces** se abre el popup de propiedades de ese enlace especifico (HU-50.020).
- **Dado** que el popup selector esta abierto, **cuando** cierro sin elegir, **entonces** no se abre ningun popup de propiedades.
- **Dado** que la oracion tiene un solo link, **cuando** hago doble clic, **entonces** se abre directamente el popup de propiedades (sin selector intermedio).

**Reglas y restricciones:**
- El selector aparece solo cuando hay ambiguedad (≥2 links en la oracion).
- Los botones muestran un resumen del link (origen → destino, tipo).
- ¿El gesto exacto es doble clic o clic simple? **Pregunta abierta** (§11.3 doc fuente).

**Modelo de datos tocado:**
- Ninguno directo; navegacion a edicion.

**Dependencias:**
- Bloqueada por: HU-50.001, HU-50.020.

**Integraciones:**
- Popup selector + popup de propiedades.

**Notas de evidencia:**
- Fuente OPCloud: §3.5.
- Frames: frame_00020.
- Transcripcion: "it will show me which link I want to select to edit; clicking on it will open that multiplicity."
- Clase de afirmacion: confirmado por transcripcion.
- Etiqueta: `requires-clarification` (gesto: clic vs doble clic).

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [opl-es, ui, links, selector, multi-enlace, requires-clarification].

---

### HU-50.022 — Propagar edicion OPL-ES al canvas en vivo

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario (consistencia del modelo); V, L secundarios.
**Superficie UI:** panel-opl-es + canvas-opd (ambos se actualizan).
**Gesto canonico:** ninguno (consecuencia de confirmar edicion OPL-ES).

**Historia:**
> Como modelador, quiero que cualquier edicion que haga desde el OPL-ES se refleje inmediatamente en el canvas para mantener la dualidad OPD↔OPL-ES sin boton `Aplicar a OPD`.

**Contexto de negocio:**
No debe haber "modo OPL-ES" separado del modelo. Toda edicion OPL-ES escribe sobre las mismas estructuras que las ediciones canvas. La propagacion es sincronica: apenas confirmo `Actualizar`, todo se actualiza. No hay boton `Aplicar a OPD` separado.

**Criterios de aceptacion:**
- **Dado** que cambio el nombre de una cosa desde OPL-ES, **cuando** confirmo con `Actualizar`, **entonces** el nombre cambia en canvas, biblioteca lateral, OPD navigator y otras oraciones OPL-ES que lo mencionan, todo en el mismo frame de render.
- **Dado** que cambio la multiplicidad de un link desde OPL-ES, **cuando** confirmo, **entonces** el numero de multiplicidad aparece en el link del canvas en vivo.
- **Dado** que activo `Ordenado` desde OPL-ES, **cuando** confirmo, **entonces** el link en canvas se renderiza con el marcador de ordered y la oracion OPL-ES lo refleja.
- **Dado** que edito el estilo de un link desde OPL-ES, **cuando** confirmo, **entonces** el link en canvas se re-renderiza con el nuevo estilo.

**Reglas y restricciones:**
- Sin boton `Aplicar a OPD`: `Actualizar` del popup es suficiente.
- Propagacion es sincronica en el mismo tick de render.
- La propagacion incluye todas las apariencias de la cosa/link (si aparece en multiples OPDs).

**Modelo de datos tocado:**
- Deriva de HU-50.019 (thing.*) y HU-50.020 (link.*).

**Dependencias:**
- Bloqueada por: HU-50.019, HU-50.020.

**Integraciones:**
- Event bus del modelo.
- Renderer OPL-ES + canvas + biblioteca + navigator.

**Notas de evidencia:**
- Fuente normativa: [opm-iso-19450-es.md §Representacion bimodal] la edicion debe ser coherente entre ambas modalidades.
- Fuente OPCloud: §3.6.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [opl-es, kernel, sincronia, propagacion, render].

---

### HU-50.023 — Copiar OPL-ES completo al portapapeles

**Actor primario:** RV.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X (integracion con SO).
**Superficie UI:** panel-opl-es (boton `Copiar texto OPL-ES al portapapeles` en footer).
**Gesto canonico:** clic unico.

**Historia:**
> Como revisor, quiero copiar el OPL-ES completo al portapapeles con un clic para pegarlo en un documento, email o chat sin export formal.

**Contexto de negocio:**
El OPL-ES es texto plano. Copiarlo al portapapeles cubre el caso de uso de compartir rapidamente el contenido sin abrir el export PDF. Es el "camino corto" a exportacion informal.

**Criterios de aceptacion:**
- **Dado** que el panel OPL-ES tiene oraciones, **cuando** hago clic en `Copiar texto OPL-ES al portapapeles`, **entonces** el texto completo del OPL-ES (con o sin numeracion segun el toggle actual) se copia al portapapeles del sistema.
- **Dado** que hay filtrado por seleccion activo (HU-50.018), **cuando** copio, **entonces** se copia **solo el subconjunto filtrado** (comportamiento a confirmar — inferido por coherencia con la vista).
- **Dado** que el OPL-ES esta vacio, **cuando** hago clic en copiar, **entonces** se copia texto vacio (sin error).
- **Dado** que copie, **cuando** miro el panel, **entonces** recibo feedback visual (toast "OPL-ES copiado" o analogo).

**Reglas y restricciones:**
- Formato del copiado: texto plano, una oracion por linea.
- La numeracion se incluye si esta activa en el panel al momento de copiar.
- El coloreado no se copia (portapapeles es texto plano).

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-50.001.

**Integraciones:**
- API del portapapeles del navegador.

**Notas de evidencia:**
- Fuente OPCloud: §3.2ter (tooltip confirmado).
- Clase de afirmacion: observado + confirmado por tooltip.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [opl-es, ui, export, clipboard].

---

### HU-50.024 — Exportar OPL-ES a archivo HTML

**Actor primario:** RV.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario (integracion export); U secundario.
**Superficie UI:** panel-opl-es (accion `Exportar OPL-ES como HTML` en menu del panel).
**Gesto canonico:** clic en opcion de menu.

**Historia:**
> Como revisor, quiero exportar el OPL-ES a un archivo HTML para conservarlo con coloreado, numeracion y enlaces navegables como documento autocontenido.

**Contexto de negocio:**
El copiado al portapapeles (HU-50.023) pierde formato. El export HTML preserva el coloreado por clase de token, la numeracion, la estructura visual del panel — ideal para anexar a reportes, auditorias o documentacion tecnica sin depender del PDF.

**Criterios de aceptacion:**
- **Dado** que el panel OPL-ES tiene oraciones, **cuando** invoco `Exportar OPL-ES como HTML`, **entonces** se descarga un archivo `.html` con el OPL-ES completo, coloreado por clase y numerado.
- **Dado** que el HTML se abre en navegador, **cuando** lo visualizo, **entonces** los objetos aparecen en verde, procesos en azul, sistema raiz en azul oscuro, conectores en negro (coherente con HU-50.016).
- **Dado** que hay filtrado por seleccion activo, **cuando** exporto, **entonces** el HTML incluye solo el subconjunto filtrado (coherente con HU-50.023).
- **Dado** que el modelo tiene un nombre, **cuando** se genera el archivo, **entonces** el nombre sugerido es `<Modelo>-opl.html`.

**Reglas y restricciones:**
- El HTML es autocontenido (CSS inline o `<style>`).
- No incluye scripts dinamicos — solo texto estatico con formato.
- La numeracion sigue el toggle activo.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-50.001, HU-50.016.
- Relaciona: EPICA-60 (export PDF), EPICA-61 (export SVG).

**Integraciones:**
- Export engine.

**Notas de evidencia:**
- Fuente OPCloud: §7.5 (export toggle independiente); extension de la accion `Copy OPL Text`.
- Clase de afirmacion: inferido (HU nueva derivada del patron de export; OPCloud no la expone explicita en la feature revisada).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [opl-es, export, html, requires-clarification].

---

### HU-50.025 — Buscar texto dentro del panel OPL-ES

**Actor primario:** RV.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario.
**Superficie UI:** panel-opl-es (input de busqueda, tipicamente Ctrl+F local).
**Gesto canonico:** escritura en input de busqueda.

**Historia:**
> Como revisor, quiero buscar texto dentro del panel OPL-ES para localizar menciones de una cosa o verbo sin leer todo el listado.

**Contexto de negocio:**
En modelos grandes, el OPL-ES puede tener cientos de oraciones. Buscar por texto (parte del nombre, alias, verbo) es mas rapido que scroll. Complementa al filtrado por seleccion (HU-50.018), que requiere tener el elemento visible en canvas.

**Criterios de aceptacion:**
- **Dado** que el OPL-ES tiene muchas oraciones, **cuando** escribo `Turbojet` en el input de busqueda, **entonces** solo las oraciones que contienen esa subcadena se muestran (o se resaltan, segun implementacion).
- **Dado** que escribo una busqueda vacia, **cuando** borro el input, **entonces** el OPL-ES vuelve a mostrar todas las oraciones.
- **Dado** que la busqueda no tiene resultados, **cuando** miro el panel, **entonces** aparece un mensaje "sin resultados".
- **Dado** que la busqueda coincide con varios tokens, **cuando** miro los resultados, **entonces** cada coincidencia se resalta (highlight interno en la oracion).

**Reglas y restricciones:**
- Busqueda case-insensitive por default.
- Coincidencia parcial (substring) por default; regex es mejora opcional.
- La busqueda se combina con el filtrado por seleccion (HU-50.018): ambos aplican como filtros acumulativos (AND).
- Busqueda no altera el modelo.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-50.001.

**Integraciones:**
- Render del panel.

**Notas de evidencia:**
- Fuente: no observada explicitamente en el doc reverse; inferencia por patron de uso en modelos grandes.
- Clase de afirmacion: inferido.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [opl-es, ui, busqueda, requires-clarification].

---

### HU-50.026 — Indentar oraciones jerarquicamente por nivel de OPD

**Actor primario:** RV.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero ver las oraciones OPL-ES indentadas segun la jerarquia del OPD (SD1 → SD2 → SD3) para leer la estructura de descomposicion sin reconstruirla mentalmente.

**Contexto de negocio:**
Cuando el OPL-ES agrupa oraciones de varios OPDs (root + in-zooms + unfolds), la indentacion revela la estructura de descomposicion. Es la version textual del arbol OPD (EPICA-20).

**Criterios de aceptacion:**
- **Dado** que el OPL-ES muestra oraciones de SD1 y SD2 (in-zoom de un proceso de SD1), **cuando** miro el panel, **entonces** las oraciones de SD2 aparecen con indentacion mayor que las de SD1.
- **Dado** que hay multiples niveles de in-zoom anidados (SD1 → SD2 → SD3), **cuando** miro el panel, **entonces** la indentacion crece progresivamente por nivel.
- **Dado** que el OPL-ES del OPD activo es unico (no hay descomposicion visible), **cuando** miro el panel, **entonces** todas las oraciones aparecen al mismo nivel de indentacion.
- **Dado** que hay encabezados por bloque (p.ej. `SD2: Turbojet Engine Operating of Turbojet Engine System in-zoomed`), **cuando** miro el panel, **entonces** los encabezados actuan como separadores visuales.

**Reglas y restricciones:**
- La indentacion refleja la jerarquia del modelo, no el orden de render flat.
- Cada nivel OPD adicional = 1 incremento de indentacion.
- El render jerarquico es configurable por toggle global (EPICA-81) — default a definir.

**Modelo de datos tocado:**
- Ninguno persistente; deriva del arbol OPD.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Relaciona: EPICA-20 (arbol OPD).

**Integraciones:**
- Motor OPL-ES + metadata OPD.

**Notas de evidencia:**
- Fuente OPCloud: §3.4, frame_00016 (oracion 1 con `from SD zooms in SD1 into …`).
- Clase de afirmacion: observado parcialmente; regla de indentacion inferida.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [opl-es, render, jerarquia, requires-clarification].

---

### HU-50.027 — Expandir y colapsar bloques OPL-ES jerarquicos

**Actor primario:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario.
**Superficie UI:** panel-opl-es (controles por bloque).
**Gesto canonico:** clic en carets/toggles por nivel.

**Historia:**
> Como revisor, quiero expandir y colapsar bloques del OPL-ES por nivel de OPD para enfocarme en una parte del modelo sin leer el resto.

**Contexto de negocio:**
Complementa a la indentacion (HU-50.026). En modelos grandes, navegar por bloques expandibles es mas rapido que scroll infinito. Es patron estandar de tree-view aplicado al OPL-ES.

**Criterios de aceptacion:**
- **Dado** que el OPL-ES tiene bloques jerarquicos con encabezados, **cuando** hago clic en el caret de un bloque, **entonces** el bloque se colapsa ocultando sus oraciones.
- **Dado** que un bloque esta colapsado, **cuando** hago clic en el caret de nuevo, **entonces** el bloque se expande.
- **Dado** que colapso un bloque padre, **cuando** se colapsa, **entonces** los bloques hijos tambien se ocultan (colapso recursivo).
- **Dado** que colapso un bloque, **cuando** uso la busqueda (HU-50.025) y hay coincidencias en bloques colapsados, **entonces** esos bloques se expanden automaticamente.

**Reglas y restricciones:**
- Default: todos los bloques expandidos.
- Estado de colapso: transitorio, no persiste entre sesiones (inferido).
- Colapso recursivo: padre colapsa hijos.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-50.026.

**Integraciones:**
- Render del panel.

**Notas de evidencia:**
- Fuente: no observada explicitamente.
- Clase de afirmacion: inferido.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [opl-es, ui, navegacion, requires-clarification].

---

### HU-50.028 — Activar Toggle AI Text para oraciones compuestas

**Actor primario:** AD (autor de dominio).
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario (integracion genai); L secundario.
**Superficie UI:** panel-opl-es (toggle `Toggle AI Text` en footer).
**Gesto canonico:** clic en toggle.

**Historia:**
> Como autor de dominio, quiero activar la generacion OPL-ES asistida por IA para que las oraciones compuestas se expresen en lenguaje mas natural y contextualizado.

**Contexto de negocio:**
El OPL-ES canonico es controlado y a veces rigido. La IA puede generar oraciones compuestas que agrupan verbalizaciones dispersas en prosa mas legible para audiencias no tecnicas (ejecutivos, clinicos, legales). Esta feature es diferida (W) en el ciclo actual del modelador core — se integra con EPICA-A2.

**Criterios de aceptacion:**
- **Dado** que el toggle `Toggle AI Text` esta off, **cuando** miro el OPL-ES, **entonces** veo oraciones canonicas OPL-ES.
- **Dado** que activo `Toggle AI Text`, **cuando** el servicio de IA responde, **entonces** el OPL-ES se re-renderiza con oraciones compuestas generadas por IA.
- **Dado** que el modelo cambia, **cuando** el toggle esta activo, **entonces** la IA regenera el texto (con posible debouncing por costo).
- **Dado** que el servicio de IA no esta disponible, **cuando** activo el toggle, **entonces** aparece un mensaje de fallback (p.ej. "servicio IA no disponible") y el OPL-ES canonico se preserva.

**Reglas y restricciones:**
- Integracion con EPICA-A2 (Generative AI).
- El toggle es por sesion; no persiste por modelo (inferido).
- Requiere conexion al backend de IA — fuera del alcance del modelador core.

**Modelo de datos tocado:**
- Ninguno persistente; render transitorio por IA.

**Dependencias:**
- Bloqueada por: HU-50.001.
- Bloqueada por: EPICA-A2 (feature genai integrada).

**Integraciones:**
- Backend de IA (externo).
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente OPCloud: §3.2ter (tooltip).
- Clase de afirmacion: observado + confirmado por tooltip.

**Prioridad:** W (diferida al ciclo actual).
**Tamano:** M.
**Etiquetas:** [opl-es, ui, genai, integracion, externa, deferred].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q50.1**: ¿Existe gesto para **reordenar** manualmente las oraciones del OPL-ES, o el orden siempre deriva del render del OPD? (§11.1.) Ninguna HU cubre reordenamiento manual — si existe, sera HU-50.029+.
- **Q50.2**: Contrato exacto del toggle `sync color of OPL and OPD` (EPICA-81): bidireccional o unidireccional. Afecta a HU-50.016.
- **Q50.3**: El popup selector de multi-enlace (HU-50.021): ¿se abre con clic simple o doble clic? Transcripcion ambigua. Marcada `requires-clarification`.
- **Q50.4**: `Copy Style` sobre un enlace: ¿herramienta persistente (formato al siguiente link) o portapapeles one-shot? Inferido portapapeles, pendiente. Afecta a HU-50.020.
- **Q50.5**: Campo `Descripcion` del popup de nombre: ¿alimenta al element dictionary del export PDF (EPICA-60)? Probable si. Afecta a HU-50.019.
- **Q50.6**: OPL-ES cuando canvas esta vacio o cuando se abre OPD heredado solo por in-zoom: ¿renderiza oracion `desde SD se descompone en SD1 en …`? Observado parcialmente en SD2 (si). Afecta a HU-50.012, HU-50.026.
- **Q50.7**: Forma exacta de verbalizacion de modificador `NOT` en link: ¿`*P* no genera **R**.`, `*P* NOT genera **R**.`, otra? Afecta a HU-50.010.
- **Q50.8**: Forma canonica de verbalizacion de estados (HU-50.011): pendiente de cruce con SSOT OPL-ES para confirmar `puede estar`/`es inicialmente`/`cambia de … a …`.
- **Q50.9**: Coexistencia de OPL-ES y panel de notas en left pane cuando ambos piden esa posicion (HU-50.004, EPICA-42).
- **Q50.10**: Comportamiento del filtrado por seleccion (HU-50.018) en combinacion con edicion OPL-ES: ¿la edicion mantiene el filtro activo? Inferido si (filtro transitorio de render).

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/50-opl-pane.md`.
- Epicas que alimentan a esta: **EPICA-10** (creacion de cosas y popup compartido), **EPICA-11** (modelado basico), **EPICA-12** (in-zoom, unfolds), **EPICA-13** (estados), **EPICA-14** (styling de links), **EPICA-15** (links avanzados), **EPICA-16** (popup de propiedades de link), **EPICA-17** (atributos y alias).
- Epicas que dependen de esta: **EPICA-20** (arbol OPD reusa metadata de niveles), **EPICA-60** (export PDF usa el OPL-ES), **EPICA-61** (export SVG), **EPICA-81** (config style defaults controla toggles globales).
- Epicas integradas diferidas: **EPICA-A2** (generative AI — HU-50.028), **EPICA-42** (notes — comparte left pane con HU-50.004).
- Invariantes del repo: `src/render/opl-renderer.ts` (motor OPL-ES), `src/nucleo/tipos.ts` (Thing, Link, Unfold), `src/nucleo/validacion/` (verbos canonicos por tipo), `ssot/opm-opl-es.md` (SSOT OPL-ES).
- Constitucion categorica: el OPL-ES es el **funtor lente textual** del kernel (ver ecuaciones E1–E13 en `docs/ARQUITECTURA-CATEGORICA.md`). La invariante "lente sin mutacion del modelo" se honra excepto por las HU-50.019 y HU-50.020, que son **edicion inversa** — y en esos casos la edicion escribe sobre el mismo kernel que el canvas, nunca sobre una copia.
