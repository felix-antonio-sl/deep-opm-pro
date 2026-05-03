---
epica: "EPICA-15"
titulo: "Canvas — enlaces avanzados (multiplicidad, rutas, XOR/O, Condicion/Evento/NO, invocacion)"
doc_fuente: "opcloud-reverse/15-canvas-enlaces-avanzados.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M1"
hu_emitidas: 25
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
ultima_actualizacion: 2026-04-23
---

## Resumen

Esta epica cubre el **repertorio avanzado de enlaces** en OPCloud: multiplicidades parametricas sobre enlaces procedimentales, etiquetas de ruta sobre ramas a estados especificos, abanicos logicos O/XOR construidos por proximidad geometrica, modificadores `Condicion`/`Evento`/`NO` sobre los tres tipos procedimentales (Instrumento, Consumo, Efecto), invocacion y auto-invocacion con demora, y la infraestructura de edicion fina de enlaces mediante `joint-tools` (vertices, segments, arrowheads, button).

La prioridad predominante es **M1** porque la epica asume resuelto el enlace basico (EPICA-10 para creacion; EPICA-11 para modelado basico) y agrega semantica OPM que eleva el poder expresivo del modelador sin ser primitiva kernel minima. Las HU mas cercanas al kernel OPM (multiplicidad, NO, XOR/O como semantica) suben a M0 porque la SSOT OPM las declara parte del lenguaje canonico; las que son afordances puras de edicion geometrica quedan en M1 o S.

Cada HU mantiene trazabilidad al doc fuente, frames, y a los docs 11 (modelado basico §10), 12 (inzooming), 16 (propiedades de enlace) y 18 (semi-folding) que comparten superficie UI.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-15.001 | Abrir propiedades de enlace por clic derecho sobre la linea | ME | M1 | S | opcloud-ui | — |
| HU-15.002 | Asignar multiplicidad numerica a un enlace procedimental | ME | M0 | S | opm-semantica | [OPL-ES T5] [OPL-ES T2] [Glos 3.60] |
| HU-15.003 | Renderizar etiqueta de multiplicidad sobre la linea del enlace | MN | M0 | XS | opm-semantica | [Glos 3.60] |
| HU-15.004 | Verbalizar multiplicidad en OPL-ES con pluralizacion canonica | MN | M0 | S | opm-semantica | [OPL-ES T5] [OPL-ES T2] |
| HU-15.005 | Definir etiqueta de ruta de texto libre sobre una rama a estado | ME | M0 | S | opm-semantica | [OPL-ES §2] [Glos 3.60] |
| HU-15.006 | Renderizar etiqueta de ruta apoyada sobre la linea | MN | M1 | XS | mixto | [OPL-ES §2] |
| HU-15.007 | Verbalizar etiqueta de ruta en OPL-ES (`por ruta X...`) | MN | M0 | S | opm-semantica | [OPL-ES §2] [Glos 3.60] |
| HU-15.008 | Crear segunda rama sobre el mismo puerto para formar abanico | ME | M0 | M | opm-semantica | [V-3] [V-239] |
| HU-15.009 | Alternar operador logico del abanico entre O y XOR | ME | M0 | S | opm-semantica | [V-3] |
| HU-15.010 | Renderizar triangulito conector de XOR sobre el abanico | MN | M0 | S | mixto | [V-3] |
| HU-15.011 | Renderizar conector curvo/abrazadera de O sobre el abanico | MN | M0 | S | mixto | [V-3] |
| HU-15.012 | Distinguir OPL-ES entre XOR (`exactamente uno de X o Y`) y O (`al menos uno de X o Y`) | MN | M0 | S | opm-semantica | [OPL-ES §2] |
| HU-15.013 | Dirigir ramas de abanico de resultado hacia estados distintos | ME | M1 | M | opm-semantica | [V-3] |
| HU-15.014 | Aplicar subtipo Condicion a un enlace procedimental desde el selector | ME | M0 | S | opm-semantica | [Glos 3.30] [V-239] |
| HU-15.015 | Aplicar subtipo Evento a un enlace procedimental desde el selector | ME | M0 | S | opm-semantica | [Glos 3.30] [V-239] |
| HU-15.016 | Aplicar modificador NO a un enlace procedimental | ME | M0 | S | opm-semantica | [Glos 3.30] |
| HU-15.017 | Sustituir conexion manual de N-1 estados por NO sobre el estado excluido | ME | M1 | S | mixto | [Glos 3.30] |
| HU-15.018 | Ver probabilidad en enlace Evento cuando esta definida | ME | S | S | opcloud-ui | [Glos 3.60] |
| HU-15.019 | Crear enlace de invocacion zigzag entre dos procesos | ME | M0 | M | opm-semantica | [V-240] [V-61] |
| HU-15.020 | Crear auto-invocacion con demora por defecto de 1 segundo | ME | M1 | M | opm-semantica | [V-240] |
| HU-15.021 | Visualizar proceso de espera derivado de la demora de auto-invocacion | RV | S | S | opcloud-ui | [V-240] |
| HU-15.022 | Mover puerto de un enlace existente con dialogo Mover Puerto | ME | M1 | S | opcloud-ui | [V-61] |
| HU-15.023 | Remover relacion existente desde el dialogo Mover Puerto | ME | M1 | XS | mixto | [V-61] |
| HU-15.024 | Editar vertices de un enlace polyline con joint-tools | ME | M1 | S | mixto | [V-61] [JOYAS §7] |
| HU-15.025 | Ver advertencia semantica al intentar consumir dos veces el mismo objeto | MN | S | S | opm-semantica | [V-239] |

Total: **25 historias de usuario** (15 opm-semantica, 4 opcloud-ui, 6 mixto).

## Historias de usuario

### HU-15.001 — Abrir propiedades de enlace por clic derecho sobre la linea

**Actor primario:** ME (modelador experto).
**Actores secundarios:** MN (modelador novato — descubre por tooltip).
**Tipo:** opcloud-ui.
**Nivel categorico:** U (UI/interaccion) primario.
**Superficie UI:** canvas-opd + dialogo-propiedades-enlace.
**Gesto canonico:** clic derecho sobre la linea del enlace.

**Historia:**
> Como modelador, quiero hacer clic derecho sobre un enlace existente para abrir un dialogo de propiedades donde ajustar multiplicidad, ruta y otros atributos sin re-crearlo.

**Contexto de negocio:**
Los enlaces avanzados necesitan edicion post-creacion (multiplicidad, ruta, operador de abanico). Sin una superficie dedicada de propiedades, el usuario recrearia el enlace cada vez que quiera ajustar un atributo, rompiendo identidad del enlace. El dialogo de propiedades es el punto de entrada canonico observado en §2 de la fuente.

**Criterios de aceptacion:**
- **Dado** que tengo un enlace existente en el canvas, **cuando** hago clic derecho sobre su linea, **entonces** se abre un dialogo flotante con secciones `Multiplicidad`, `Ruta` y estilo.
- **Dado** que el dialogo esta abierto, **cuando** hago clic fuera, **entonces** el dialogo se cierra sin aplicar cambios.
- **Dado** que el dialogo esta abierto, **cuando** confirmo un cambio, **entonces** el enlace se actualiza y el panel OPL-ES refleja el nuevo estado.
- **Dado** que hago clic derecho sobre un enlace **no** procedimental (p.ej. Agregacion), **cuando** miro el dialogo, **entonces** los campos especificos de procedimental (multiplicidad, ruta) no aparecen o aparecen deshabilitados.

**Reglas y restricciones:**
- El dialogo se ancla visualmente cerca del punto del clic.
- Si hay multi-seleccion, el dialogo no aplica — opera siempre sobre un solo enlace.
- La superficie de propiedades comparte codigo con EPICA-16 (propiedades de enlace) pero esta HU solo cubre el acceso.

**Modelo de datos tocado:**
- Ninguno directo; es gateway a otras HU.

**Dependencias:**
- Bloqueada por: HU-10.011 (debe existir un enlace para abrir sus propiedades).
- Bloquea a: HU-15.002, HU-15.005, HU-15.009.

**Integraciones:**
- Panel OPL-ES (se actualiza al aplicar cambios).
- EPICA-16 (propiedades extendidas).

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [V-61] anatomia de enlace.
- Fuente OPCloud: `opcloud-reverse/15-canvas-enlaces-avanzados.md` §2 tabla de superficies UI.
- Frames: frame_00005, frame_00080, frame_00085.
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, enlaces, menu-contextual, dialogo].

---

### HU-15.002 — Asignar multiplicidad numerica a un enlace procedimental

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K (kernel) primario; V (render) y L (OPL-ES) secundarios.
**Superficie UI:** dialogo-propiedades-enlace (campo Multiplicidad).
**Gesto canonico:** escritura numerica en input + confirmacion.

**Historia:**
> Como modelador, quiero asignar una multiplicidad numerica (p.ej. `2`, `N`) a un enlace procedimental para expresar cuantas instancias del objeto participan en la relacion.

**Contexto de negocio:**
La multiplicidad es una primitiva OPM estandar que convierte un enlace 1:1 en un enlace cuantificado. Sin ella, no se pueden expresar escenarios comunes (`requiere 2 **Conductores**`, `genera N **Ensaladas**`). Es parte del lenguaje OPM canonico, no un feature opcional — por eso es M0. [OPL-ES T5] [OPL-ES T2]

**Criterios de aceptacion:**
- **Dado** que abri propiedades de un enlace procedimental (Instrumento, Consumo, Efecto, Resultado), **cuando** ingreso `2` en el campo `Multiplicidad` y confirmo, **entonces** el enlace persiste `enlace.multiplicidad = 2`.
- **Dado** que ingreso un simbolo parametrico como `N` o `M`, **cuando** confirmo, **entonces** el enlace persiste la multiplicidad como string simbolico.
- **Dado** que vacio el campo, **cuando** confirmo, **entonces** la multiplicidad queda `null` (equivalente a `1` implicito).
- **Dado** que asigne multiplicidad, **cuando** guardo y recargo el modelo, **entonces** el valor persiste.

**Reglas y restricciones:**
- Tipo del campo: string (admite numero o simbolo), no se fuerza a integer.
- Rango no observado; valores negativos o `0` son **pregunta abierta** — marcar como inferencia.
- Multiplicidad solo se ofrece en enlaces procedimentales (Instrumento, Consumo, Efecto, Resultado) y quizas enlaces etiquetados; no en Agregacion/Generalizacion (validar en EPICA-16).

**Modelo de datos tocado:**
- `enlace.multiplicidad` — `string | null` — persistente.

**Dependencias:**
- Bloqueada por: HU-15.001.
- Bloquea a: HU-15.003, HU-15.004.

**Integraciones:**
- Renderer (etiqueta sobre la linea — HU-15.003).
- Panel OPL-ES (pluralizacion — HU-15.004).

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [Glos 3.60] propiedad; `opm-opl-es.md` [OPL-ES T5] Instrumento, [OPL-ES T2] Resultado.
- Fuente OPCloud: §3.1 multiplicidad, §5.2 parametros, §6 modelo de datos (`enlace.multiplicidad`).
- Frames: frame_00008 (multiplicidad visible).
- Transcripcion: ejemplo `Driver → Driving` con multiplicidad `2` y OPL `requiere 2 **Conductores**`.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, enlaces, multiplicidad, procedimental].

---

### HU-15.003 — Renderizar etiqueta de multiplicidad sobre la linea del enlace

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** V primario.
**Superficie UI:** canvas-render.
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como lector del modelo, quiero ver la multiplicidad (p.ej. `2`) renderizada sobre la linea del enlace para captar la cardinalidad de un vistazo sin leer el OPL-ES.

**Contexto de negocio:**
El diagrama OPM es vista completa por diseno: todo lo que existe semanticamente debe ser visible. Dejar la multiplicidad solo en el panel OPL-ES romperia la promesa de "lo que ves es lo que hay". Renderizarla es invariante de la SSOT visual. La SSOT define las propiedades como anotaciones de modelado que distinguen elementos [Glos 3.60].

**Criterios de aceptacion:**
- **Dado** que un enlace tiene `multiplicidad = 2`, **cuando** miro el canvas, **entonces** el numero `2` aparece como etiqueta sobre el tramo de la linea.
- **Dado** que un enlace tiene `multiplicidad = null` o `1`, **cuando** miro el canvas, **entonces** no aparece etiqueta de multiplicidad (se omite el `1` implicito).
- **Dado** que hay varios enlaces con multiplicidad en el mismo diagrama, **cuando** layout se re-ejecuta, **entonces** las etiquetas no colisionan entre si ni con los nodos.
- **Dado** que cambio la multiplicidad en propiedades, **cuando** confirmo, **entonces** la etiqueta se actualiza en vivo.

**Reglas y restricciones:**
- La etiqueta se apoya sobre la linea (no flota suelta).
- Tipografia y offset a definir por SSOT visual (`opm-visual-es.md`).
- No renderizar el valor `1` (es default implicito).

**Dependencias:**
- Bloqueada por: HU-15.002.

**Integraciones:**
- Layout (`src/render/layout/`) para evitar colisiones.
- Renderer JointJS (`src/render/jointjs/`).

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [Glos 3.60] propiedad (cardinalidades).
- Fuente OPCloud: §3.1 paso 4 "el canvas muestra `2` sobre la linea".
- Frames: frame_00008.
- Clase de afirmacion: observado.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [canvas, render, enlaces, multiplicidad, etiqueta].

---

### HU-15.004 — Verbalizar multiplicidad en OPL-ES con pluralizacion canonica

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L (lente OPL-ES) primario.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno (regeneracion automatica).

**Historia:**
> Como modelador, quiero que el OPL-ES verbalice la multiplicidad con plural canonico (`requiere 2 **Conductores**`) para leer la cardinalidad en lenguaje natural sin ambiguedad.

**Contexto de negocio:**
El OPL-ES es el canal natural-language de OPM. Si la multiplicidad no se verbalizara con plural, el lector perderia la cardinalidad al leer. La pluralizacion es parte del motor OPL — incluye numero + conversion singular→plural del nombre del objeto. [OPL-ES T5] [OPL-ES T2]

**Criterios de aceptacion:**
- **Dado** que hay un enlace Instrumento con multiplicidad `2` desde `Conductor` a `Conducir`, **cuando** consulto el panel OPL-ES, **entonces** aparece `Conducir requiere 2 **Conductores**.` (plural canonico).
- **Dado** que la multiplicidad es `N` simbolica, **cuando** consulto OPL-ES, **entonces** aparece `Conducir requiere N **Conductores**.`
- **Dado** que la multiplicidad es `1` o `null`, **cuando** consulto OPL-ES, **entonces** aparece `Conducir requiere un **Conductor**.` (singular, sin numero explicito).
- **Dado** que el objeto tiene nombre irregular (p.ej. `Child → Children`), **cuando** se pluraliza, **entonces**: **pregunta abierta** — reglas de plural irregular en espanol/ingles. Marcar `requires-clarification`.

**Reglas y restricciones:**
- Pluralizacion por defecto: sufijo `s` en ingles; en espanol la SSOT OPL-ES define la regla.
- El numero se inserta entre el verbo y el sustantivo.
- El motor OPL-ES (`src/render/opl-renderer.ts`) es responsable, no el renderer visual.

**Modelo de datos tocado:**
- Ninguno nuevo; consume `enlace.multiplicidad` y `cosa.nombre`.

**Dependencias:**
- Bloqueada por: HU-15.002.
- Relaciona: EPICA-50 (panel OPL-ES).

**Integraciones:**
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente normativa: `opm-opl-es.md` [OPL-ES T5] Instrumento, [OPL-ES T2] Resultado; [OPL-ES §2] verbalizacion de enlaces procedimentales.
- Fuente OPCloud: §3.1 paso 5 "el OPL lo verbaliza en plural (`requiere 2 **Conductores**`)".
- Clase de afirmacion: confirmado por transcripcion.
- Etiqueta: `requires-clarification` (plural irregular).

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, opl-es, enlaces, multiplicidad, pluralizacion, requires-clarification].

---

### HU-15.005 — Definir etiqueta de ruta de texto libre sobre una rama a estado

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V, L secundarios.
**Superficie UI:** dialogo-propiedades-enlace (campo Ruta).
**Gesto canonico:** escritura en input + confirmacion.

**Historia:**
> Como modelador, quiero asignar una etiqueta de ruta (p.ej. `al trabajo`, `al jardin`) a una rama de enlace que apunta a un estado para distinguir alternativas semanticamente equivalentes pero contextualmente distintas.

**Contexto de negocio:**
Cuando un proceso conduce a multiples estados (ej. `Conducir → Ubicacion{trabajo, jardin, supermercado}`), la etiqueta de ruta expresa bajo que condicion se toma cada rama. Sin la etiqueta, el diagrama solo dice "puede ir a cualquiera"; con la etiqueta, dice "va a X cuando el contexto es Y". La SSOT define las etiquetas de ruta como propiedad [Glos 3.60] y su fraseo OPL-ES como `por ruta` [OPL-ES §2].

**Criterios de aceptacion:**
- **Dado** que tengo un enlace de `Conducir` hacia el estado `trabajo` de `Ubicacion`, **cuando** abro propiedades y escribo `al trabajo` en `Ruta`, **entonces** el enlace persiste `enlace.ruta = "al trabajo"`.
- **Dado** que dejo la ruta vacia, **cuando** confirmo, **entonces** `enlace.ruta = null` y no se renderiza etiqueta.
- **Dado** que asigne ruta, **cuando** guardo y recargo, **entonces** el valor persiste.
- **Dado** que dos ramas del mismo proceso tienen rutas iguales (`al trabajo`), **cuando** el validador corre, **entonces** emite una advertencia de ambiguedad (delegar a EPICA-1C).

**Reglas y restricciones:**
- `ruta` es string libre, no se restringe a tokens predefinidos.
- Solo tiene sentido en enlaces hacia estados (EPICA-13) o en ramas de abanico (HU-15.008).
- Si el enlace no apunta a un estado, el campo `Ruta` queda deshabilitado o ausente.

**Modelo de datos tocado:**
- `enlace.ruta` — `string | null` — persistente.

**Dependencias:**
- Bloqueada por: HU-15.001, HU-13.xxx (estados deben existir primero).
- Bloquea a: HU-15.006, HU-15.007.

**Integraciones:**
- Renderer (etiqueta sobre la linea — HU-15.006).
- Panel OPL-ES (HU-15.007).

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [Glos 3.60] propiedad; `opm-opl-es.md` [OPL-ES §2] fraseo `por ruta`.
- Fuente OPCloud: §3.2 rutas sobre estados de ubicacion.
- Frames: frame_00030, frame_00060, frame_00070.
- Transcripcion: ejemplo `al trabajo`, `al jardin`.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, enlaces, ruta, estados].

---

### HU-15.006 — Renderizar etiqueta de ruta apoyada sobre la linea

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** V.
**Superficie UI:** canvas-render.
**Gesto canonico:** ninguno.

**Historia:**
> Como lector, quiero ver la etiqueta de ruta (`al trabajo`) apoyada directamente sobre la linea del enlace para leer la intencion de la rama sin recurrir al OPL-ES.

**Contexto de negocio:**
La etiqueta de ruta es una etiqueta de linea mas, al igual que la multiplicidad. Se apoya sobre la linea (§9 "las etiquetas de ruta se apoyan directamente sobre la linea") — no flota suelta ni se ancla a los nodos. [OPL-ES §2]

**Criterios de aceptacion:**
- **Dado** que un enlace tiene `ruta = "al trabajo"`, **cuando** miro el canvas, **entonces** el texto `al trabajo` aparece apoyado sobre un tramo de la linea.
- **Dado** que el enlace tiene ademas multiplicidad, **cuando** miro el canvas, **entonces** ambas etiquetas (ruta + multiplicidad) coexisten sin superponerse.
- **Dado** que la linea del enlace tiene curvatura o vertices, **cuando** layout posiciona la etiqueta, **entonces** se coloca en un tramo legible (no en una esquina).

**Reglas y restricciones:**
- Etiqueta de ruta y etiqueta de multiplicidad son etiquetas distintas, pueden coexistir.
- Convencion observada: etiquetas de ruta se apoyan sobre la linea, no sobre los extremos.

**Dependencias:**
- Bloqueada por: HU-15.005.

**Integraciones:**
- Layout (posicionamiento sin colision).
- Renderer JointJS.

**Notas de evidencia:**
- Fuente normativa: `opm-opl-es.md` [OPL-ES §2] etiquetas de ruta.
- Fuente OPCloud: §3.2 paso 3, §9.
- Frames: frame_00030, frame_00070.
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [canvas, render, enlaces, ruta, etiqueta].

---

### HU-15.007 — Verbalizar etiqueta de ruta en OPL-ES (`por ruta X...`)

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero que el OPL-ES incluya la etiqueta de ruta con fraseo `por ruta al trabajo...` para leer la rama como narrativa completa.

**Contexto de negocio:**
El OPL-ES traduce cada etiqueta del diagrama a lenguaje natural. Sin verbalizacion de la ruta, el lector perderia la condicion de la rama al leer solo el OPL-ES. Frase canonica: `por ruta <etiqueta>...` [OPL-ES §2].

**Criterios de aceptacion:**
- **Dado** que una rama tiene `ruta = "al trabajo"`, **cuando** consulto OPL-ES, **entonces** aparece una frase que incluye `por ruta al trabajo...` asociada al tramo correspondiente.
- **Dado** que la rama apunta al estado `trabajo` de `Ubicacion`, **cuando** leo el OPL-ES completa, **entonces** se identifica la rama, la ruta y el estado destino.
- **Dado** que la ruta es `null`, **cuando** leo OPL-ES, **entonces** no aparece la frase de ruta.

**Reglas y restricciones:**
- El prefijo canonico es `por ruta ...` (SSOT OPL-ES §2).
- El fraseo final (continuacion de la oracion) depende del tipo de enlace — detalle en EPICA-50.

**Dependencias:**
- Bloqueada por: HU-15.005.

**Integraciones:**
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente normativa: `opm-opl-es.md` [OPL-ES §2] fraseo `por ruta`; `opm-iso-19450-es.md` [Glos 3.60] propiedad.
- Fuente OPCloud: §3.2 paso 4.
- Clase de afirmacion: confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, opl-es, enlaces, ruta].

---

### HU-15.008 — Crear segunda rama sobre el mismo puerto para formar abanico

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V, U secundarios.
**Superficie UI:** canvas-opd.
**Gesto canonico:** arrastre de enlace desde el mismo punto de salida que otro enlace existente, o muy cercano.

**Historia:**
> Como modelador experto, quiero crear una segunda rama desde el mismo puerto de salida de un proceso para que el canvas detecte el patron de abanico y me ofrezca logica O/XOR.

**Contexto de negocio:**
El abanico (O/XOR) en OPCloud no se construye con un editor dedicado — emerge de la proximidad geometrica (§9 "los abanicos se crean por proximidad geometrica, no por un editor separado"). El operador dibuja dos ramas desde el mismo puerto y el sistema las reconoce como un grupo logico. Esta simplicidad de afordance es critica para mantener el flujo de modelado fluido. La SSOT visual define el triangulo conector: su vertice apunta al refinable [V-3]. Las cinco familias canonicas de enlace [V-239] gobiernan la semantica del grupo.

**Criterios de aceptacion:**
- **Dado** que existe un enlace `Conducir → Ubicacion.trabajo`, **cuando** arrastro un segundo enlace desde el mismo puerto de `Conducir` hasta `Ubicacion.jardin`, **entonces** ambas ramas se agrupan logicamente en un grupo de abanico.
- **Dado** que el grupo logico se creo, **cuando** consulto el modelo, **entonces** aparece un `enlace.grupo_logico` compartido entre las dos ramas.
- **Dado** que el operador por defecto es **pregunta abierta** entre XOR y O, **cuando** se genera el grupo, **entonces** se asigna el default canonico (posiblemente XOR — ver §13 Q1) y se marca como abierto.
- **Dado** que solo hay una rama, **cuando** el modelo se consulta, **entonces** no hay grupo logico — un solo enlace no forma abanico.

**Reglas y restricciones:**
- Umbral de "mismo puerto" por proximidad geometrica: a definir (≤N pixeles).
- La deteccion es automatica; el usuario no declara "abro un abanico" explicitamente.
- La semantica (O/XOR) es atributo del grupo, no de cada rama.

**Modelo de datos tocado:**
- `enlace.grupo_logico` — UUID | null — persistente.
- `grupo_logico.operador` — `"O" | "XOR"` — persistente (entidad nueva o campo en primer enlace del grupo — §13 Q1).

**Dependencias:**
- Bloqueada por: HU-10.011 (creacion basica de enlace).
- Bloquea a: HU-15.009, HU-15.010, HU-15.011, HU-15.012.

**Integraciones:**
- Layout (debe agrupar las ramas visualmente).
- Panel OPL-ES (genera oracion compuesta).

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [V-3] vertice del triangulo; [V-239] cinco familias canonicas.
- Fuente OPCloud: §3.3 crear XOR/O sobre el mismo puerto, §9.
- Frames: frame_00025, frame_00050.
- Clase de afirmacion: observado + confirmado.
- Etiqueta: `requires-clarification` (serializacion de `grupo_logico`, cf. §13 Q1).

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, enlaces, xor-o, abanico, arrastre, requires-clarification].

---

### HU-15.009 — Alternar operador logico del abanico entre O y XOR

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V, L secundarios.
**Superficie UI:** dialogo-propiedades-enlace (o menu contextual sobre el abanico).
**Gesto canonico:** alternador o selector binario.

**Historia:**
> Como modelador, quiero alternar el operador de un abanico entre O y XOR para expresar si las ramas son alternativas exclusivas o coexistentes.

**Contexto de negocio:**
- **XOR** (o-exclusivo): exactamente una rama se toma en cada activacion (alternativas).
- **O** (o-inclusivo): una o mas ramas pueden tomarse (coexistencia posible).
La distincion es critica semanticamente — un XOR mal elegido puede cambiar la logica del proceso. El alternador es la afordance observada (§3.3 "el operador puede alternar entre `O` y `XOR`").

**Criterios de aceptacion:**
- **Dado** que tengo un abanico con `operador = XOR`, **cuando** alterno, **entonces** pasa a `O` y el render visual cambia (ver HU-15.010 vs HU-15.011).
- **Dado** que alterno de nuevo, **cuando** ocurre, **entonces** vuelve a `XOR`.
- **Dado** que alterne, **cuando** consulto OPL-ES, **entonces** la oracion refleja el nuevo operador (HU-15.012).
- **Dado** que el abanico tiene 3+ ramas, **cuando** alterno, **entonces** el operador aplica al grupo completo (no se mezcla O y XOR en el mismo grupo).

**Reglas y restricciones:**
- Un grupo logico tiene **un solo operador** uniforme.
- Mezclar O y XOR en el mismo abanico requiere dos grupos logicos distintos (fuera de alcance de esta HU).
- Alternador instantaneo, sin confirmacion.

**Modelo de datos tocado:**
- `grupo_logico.operador` — `"O" | "XOR"` — persistente.

**Dependencias:**
- Bloqueada por: HU-15.008.
- Bloquea a: HU-15.010, HU-15.011, HU-15.012.

**Integraciones:**
- Renderer (cambia el marcador visual).
- Panel OPL-ES.

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [V-3] marcadores visuales de divergencia.
- Fuente OPCloud: §3.3 paso 4.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, enlaces, xor-o, alternador].

---

### HU-15.010 — Renderizar triangulito conector de XOR sobre el abanico

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** V.
**Superficie UI:** canvas-render.
**Gesto canonico:** ninguno.

**Historia:**
> Como lector, quiero ver el triangulito caracteristico de XOR abrazando las ramas del abanico para identificar la exclusion a simple vista.

**Contexto de negocio:**
La SSOT visual OPM define un marcador grafico especifico para XOR (tipicamente un triangulito que abraza las ramas en el punto de divergencia). Sin el, el diagrama no distingue XOR de O, rompiendo la legibilidad semantica. [V-3]

**Criterios de aceptacion:**
- **Dado** que un grupo logico tiene `operador = XOR`, **cuando** miro el canvas, **entonces** aparece un triangulito conector en el punto de divergencia de las ramas.
- **Dado** que cambio a O, **cuando** el alternador ocurre, **entonces** el triangulito desaparece y aparece el conector de O (HU-15.011).
- **Dado** que las ramas se mueven (layout), **cuando** se re-renderiza, **entonces** el triangulito acompana al punto de divergencia.

**Reglas y restricciones:**
- El triangulito se posiciona en el punto de union comun de las ramas (no sobre cada rama individual).
- Estilo visual exacto sujeto a SSOT visual (`opm-visual-es.md` [V-3]).

**Dependencias:**
- Bloqueada por: HU-15.009.

**Integraciones:**
- Renderer JointJS.
- Layout (posicionamiento del marcador).

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [V-3] triangulo conector; vertice apunta al refinable.
- Fuente OPCloud: §3.3, §5.1 tipos y variantes observados.
- Frames: frame_00050.
- Clase de afirmacion: observado.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, render, xor, triangulito, visual].

---

### HU-15.011 — Renderizar conector curvo/abrazadera de O sobre el abanico

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** V.
**Superficie UI:** canvas-render.
**Gesto canonico:** ninguno.

**Historia:**
> Como lector, quiero ver el conector caracteristico de O (curva o abrazadera) sobre las ramas del abanico para distinguirlo visualmente de XOR.

**Contexto de negocio:**
El O y el XOR deben ser visualmente distinguibles; de lo contrario el diagrama induce a error semantico. La convencion OPM canonica marca O con una curva o abrazadera (versus triangulito del XOR). [V-3]

**Criterios de aceptacion:**
- **Dado** que un grupo logico tiene `operador = O`, **cuando** miro el canvas, **entonces** aparece la abrazadera/curva caracteristica sobre el punto de divergencia.
- **Dado** que cambio a XOR, **cuando** el alternador ocurre, **entonces** la abrazadera desaparece y aparece el triangulito (HU-15.010).
- **Dado** que hay 3 ramas en O, **cuando** miro, **entonces** la abrazadera abarca las 3 ramas.

**Reglas y restricciones:**
- Estilo visual exacto sujeto a SSOT visual.
- El conector O abarca todas las ramas del grupo, no una por rama.

**Dependencias:**
- Bloqueada por: HU-15.009.

**Integraciones:**
- Renderer JointJS.
- Layout.

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [V-3] marcadores visuales de divergencia.
- Fuente OPCloud: §3.3.
- Clase de afirmacion: observado + inferido por SSOT visual OPM.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, render, o, abrazadera, visual].

---

### HU-15.012 — Distinguir OPL-ES entre XOR (`exactamente uno de X o Y`) y O (`al menos uno de X o Y`)

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador novato, quiero que el OPL-ES verbalice XOR como `exactamente uno de X o Y` y O como `al menos uno de X o Y` para aprender la distincion semantica al leer.

**Contexto de negocio:**
El OPL-ES es canal pedagogico. Si XOR y O se verbalizaran igual, el modelador novato no aprenderia la distincion. Las frases canonicas OPM diferencian los dos operadores explicitamente. [OPL-ES §2]

**Criterios de aceptacion:**
- **Dado** que un grupo XOR agrupa ramas hacia `trabajo` y `jardin`, **cuando** consulto OPL-ES, **entonces** aparece algo como `Conducir genera exactamente uno de **Ubicacion** en trabajo o **Ubicacion** en jardin.`
- **Dado** que el grupo es O, **cuando** consulto OPL-ES, **entonces** aparece algo como `Conducir genera al menos uno de **Ubicacion** en trabajo o **Ubicacion** en jardin.`
- **Dado** que alterno el operador, **cuando** el alternador ocurre, **entonces** la oracion OPL-ES se regenera con el fraseo correspondiente.

**Reglas y restricciones:**
- Frase canonica exacta definida por la SSOT OPL-ES (`opm-opl-es.md` §2: `exactamente uno de`, `al menos uno de`).
- Motor OPL-ES debe distinguir operador del grupo al generar la oracion compuesta.

**Modelo de datos tocado:**
- Ninguno nuevo; consume `grupo_logico.operador`.

**Dependencias:**
- Bloqueada por: HU-15.009.

**Integraciones:**
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente normativa: `opm-opl-es.md` [OPL-ES §2] cuantificadores `exactamente uno de` y `al menos uno de`.
- Fuente OPCloud: §3.3, §7.1 ("aqui el OPL es especialmente importante porque varias diferencias geometricas son sutiles").
- Clase de afirmacion: inferido por SSOT OPM + transcripcion que resalta importancia de OPL en esta feature.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, opl-es, xor-o, pedagogico].

---

### HU-15.013 — Dirigir ramas de abanico de resultado hacia estados distintos

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V, L secundarios.
**Superficie UI:** canvas-opd.
**Gesto canonico:** arrastre de enlace desde proceso a estado especifico dentro de objeto con estados.

**Historia:**
> Como modelador, quiero que cada rama de un abanico de resultado apunte a un estado distinto del mismo objeto (ej. `Ensalada` con `tomate`, `cebolla`, `pepino`) para modelar resultados alternativos o composicionales.

**Contexto de negocio:**
En el caso `Preparar Ensalada` (§3.4), el proceso produce `Ensalada` en distintos estados segun ingredientes. Cada rama del abanico de resultado apunta a un estado especifico. OPCloud infiere la exclusion o alternativa segun el patron geometrico del abanico (§3.4 paso 4). Es un patron expresivo fuerte de OPM: resultados parametricos a nivel de estado.

**Criterios de aceptacion:**
- **Dado** que tengo un proceso `Preparar Ensalada` y un objeto `Ensalada` con estados `tomate`, `cebolla`, `pepino`, **cuando** creo ramas de resultado desde `Preparar Ensalada` a cada uno de los 3 estados, **entonces** el modelo registra 3 enlaces Resultado con target de estado especifico (no del objeto completo).
- **Dado** que las 3 ramas parten del mismo puerto, **cuando** se agrupan, **entonces** forman un grupo logico (HU-15.008) con operador inferido.
- **Dado** que cambio el operador, **cuando** alterno O/XOR, **entonces** el OPL-ES refleja si los 3 estados son alternativos o combinables.

**Reglas y restricciones:**
- El target del enlace es el `estado.id`, no el `objeto.id` — kernel debe soportar targeting de estado (EPICA-13 confirma).
- El operador inferido por OPCloud al crear el abanico es **pregunta abierta** (§13 Q1) — default XOR probable pero a validar.

**Modelo de datos tocado:**
- `enlace.destino` puede ser `estado.id` (ademas de `cosa.id`) — persistente.

**Dependencias:**
- Bloqueada por: HU-13.xxx (estados), HU-15.008 (abanico).
- Relaciona: EPICA-13.

**Integraciones:**
- Validador del kernel (destino debe ser estado valido del objeto).
- Panel OPL-ES.

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [V-3] vertice apunta al refinable.
- Fuente OPCloud: §3.4 resultados hacia estados especificos.
- Frames: frame_00045, frame_00060.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, enlaces, resultado, estados, alternativa].

---

### HU-15.014 — Aplicar subtipo Condicion a un enlace procedimental desde el selector

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; L secundario.
**Superficie UI:** modal-tabla-enlaces (doc 11 §10) con dropdown de subtipo.
**Gesto canonico:** seleccion en dropdown antes de confirmar el enlace.

**Historia:**
> Como modelador, quiero elegir el subtipo `Instrumento con Condicion` / `Consumo con Condicion` / `Efecto con Condicion` desde el selector para expresar precondiciones que pueden no cumplirse sin que haya error.

**Contexto de negocio:**
La semantica Condicion significa que el enlace actua como precondicion verificable: si se cumple, el proceso se activa; si no, el proceso no ocurre pero el modelo sigue siendo valido (§10.1). Es la expresion OPM canonica de "este recurso es opcional-bloqueante". La SSOT define Instrumento como habilitador no humano [Glos 3.30]; la Condicion es una de sus variantes en las cinco familias canonicas [V-239].

**Criterios de aceptacion:**
- **Dado** que estoy en la tabla de enlaces para O→P con Instrumento elegido, **cuando** abro el dropdown de subtipo y selecciono `Instrumento con Condicion`, **entonces** el OPL-ES preview cambia a la forma condicional.
- **Dado** que confirmo con `Instrumento con Condicion`, **cuando** el enlace se crea, **entonces** `enlace.subtipo = "Condicion"` persistente.
- **Dado** que el subtipo es Condicion, **cuando** miro el canvas, **entonces** el enlace tiene la marca visual canonica OPM (letra `c` o analogo — SSOT visual define).
- **Dado** que confirme, **cuando** consulto OPL-ES, **entonces** la oracion incluye el fraseo condicional (frase exacta: **pregunta abierta** §13 Q4).

**Reglas y restricciones:**
- Subtipo Condicion aplica a los 3 tipos procedimentales: Instrumento, Consumo, Efecto.
- El default del dropdown es la variante regular (sin subtipo).
- La marca visual sobre el enlace sigue la SSOT OPM (no hardcodear).

**Modelo de datos tocado:**
- `enlace.subtipo` — `"Condicion" | "Evento" | null` — persistente.

**Dependencias:**
- Bloqueada por: HU-10.008 (tabla de enlaces), HU-10.011 (confirmar).
- Bloquea a: HU-15.016 (modificador NO puede combinarse).

**Integraciones:**
- Validador.
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [Glos 3.30] Instrumento; `opm-visual-es.md` [V-239] cinco familias canonicas.
- Fuente OPCloud: §10.1 subtipos por fila de enlace procedimental.
- Clase de afirmacion: observado + inferido (OPL exacta marcada como pendiente §10.1 "OPL exacta por subtipo no se capturo integralmente").
- Etiqueta: `requires-clarification` (OPL exacta).

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, enlaces, condicion, tabla-enlaces, requires-clarification].

---

### HU-15.015 — Aplicar subtipo Evento a un enlace procedimental desde el selector

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; L secundario.
**Superficie UI:** modal-tabla-enlaces.
**Gesto canonico:** seleccion en dropdown.

**Historia:**
> Como modelador, quiero elegir `Instrumento con Evento` / `Consumo con Evento` / `Efecto con Evento` desde el selector para modelar enlaces que disparan el proceso al producirse un cambio observable.

**Contexto de negocio:**
Evento significa que el enlace actua como trigger: el proceso se activa al detectarse un cambio relevante. Es complementario a Condicion (precondicion) — Evento es disparador. Es la expresion OPM canonica para procesos reactivos. La SSOT define Instrumento como habilitador no humano [Glos 3.30]; el Evento es una de sus variantes dentro de las cinco familias canonicas [V-239].

**Criterios de aceptacion:**
- **Dado** que estoy en la tabla de enlaces con Efecto elegido, **cuando** selecciono `Efecto con Evento` en el dropdown, **entonces** el OPL-ES preview cambia a la forma de disparador.
- **Dado** que confirmo, **cuando** el enlace se crea, **entonces** `enlace.subtipo = "Evento"` persistente.
- **Dado** que el subtipo es Evento, **cuando** miro el canvas, **entonces** el enlace tiene la marca visual canonica (letra `e` o analogo — SSOT visual).
- **Dado** que dos enlaces tienen subtipo Evento y comparten destino, **cuando** el proceso se modela, **entonces** ambos son triggers validos (cualquiera dispara).

**Reglas y restricciones:**
- Subtipo Evento aplica a los 3 tipos procedimentales.
- Combinable con NO (HU-15.016).
- Marca visual por SSOT.

**Modelo de datos tocado:**
- `enlace.subtipo` — `"Condicion" | "Evento" | null` — persistente (compartido con HU-15.014).

**Dependencias:**
- Bloqueada por: HU-10.008, HU-10.011.

**Integraciones:**
- Validador.
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [Glos 3.30] Instrumento; `opm-visual-es.md` [V-239] cinco familias canonicas.
- Fuente OPCloud: §10.1.
- Clase de afirmacion: observado + inferido (OPL pendiente §13 Q4).
- Etiqueta: `requires-clarification`.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, enlaces, evento, tabla-enlaces, requires-clarification].

---

### HU-15.016 — Aplicar modificador NO a un enlace procedimental

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V, L secundarios.
**Superficie UI:** modal-tabla-enlaces (segundo dropdown: Ninguno | NO).
**Gesto canonico:** seleccion en dropdown de modificador.

**Historia:**
> Como modelador, quiero aplicar el modificador `NO` a un enlace procedimental para expresar negacion semantica (la **ausencia** del objeto es lo que condiciona o dispara el proceso).

**Contexto de negocio:**
`NO` niega la semantica del enlace (§10.2). Ejemplo: `Instrumento con NO` = el proceso requiere la **ausencia** del objeto como precondicion. Es una primitiva poderosa: sin ella, modelar "X ocurre cuando Y no esta" requeriria enumerar manualmente todos los estados alternativos (ver HU-15.017 para ese patron de ergonomia). La SSOT define Instrumento como habilitador no humano [Glos 3.30].

**Criterios de aceptacion:**
- **Dado** que estoy en la tabla de enlaces, **cuando** abro el dropdown de modificador y selecciono `NO`, **entonces** el OPL-ES preview se actualiza con fraseo negativo.
- **Dado** que confirmo con `NO`, **cuando** el enlace se crea, **entonces** `enlace.modificador = "NO"` persistente.
- **Dado** que el enlace tiene NO, **cuando** miro el canvas, **entonces** aparece el marcador visual canonico de negacion (tipografia o simbolo — SSOT visual).
- **Dado** que combino NO con Condicion o Evento, **cuando** el enlace se crea, **entonces** ambos atributos (`subtipo` y `modificador`) coexisten en el enlace.

**Reglas y restricciones:**
- Default: `modificador = "Ninguno"`.
- `NO` se combina con Instrumento/Consumo/Efecto (y sus subtipos Condicion/Evento).
- Comportamiento de NO sobre enlaces estructurales (Agregacion, Generalizacion) no observado — fuera de alcance.

**Modelo de datos tocado:**
- `enlace.modificador` — `"Ninguno" | "NO"` — persistente (ya declarado en HU-10.011).
- `enlace.negado` (alias en §6 fuente) — **conciliar nomenclatura** con `enlace.modificador`. Probablemente uno es persistente y el otro derivado.

**Dependencias:**
- Bloqueada por: HU-10.008, HU-10.011.
- Bloquea a: HU-15.017 (patron de ergonomia).

**Integraciones:**
- Validador.
- Motor OPL-ES (fraseo de negacion).

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [Glos 3.30] Instrumento; [Glos 3.3] Agente.
- Fuente OPCloud: §10.2 polaridad Ninguno/NO, §6 `enlace.negado`.
- Transcripcion: "`NO` evita tener que conectar manualmente todos los estados alternativos salvo uno" (§3.5).
- Clase de afirmacion: confirmado por transcripcion.
- Etiqueta: `requires-clarification` (OPL exacta §13 Q5 + conciliar `modificador` vs `negado`).

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, enlaces, no, modificador, requires-clarification].

---

### HU-15.017 — Sustituir conexion manual de N-1 estados por NO sobre el estado excluido

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario.
**Superficie UI:** modal-tabla-enlaces + canvas.
**Gesto canonico:** crear un solo enlace con modificador NO.

**Historia:**
> Como modelador experto, quiero expresar "el proceso ocurre para todos los estados menos uno" con un unico enlace NO hacia el estado excluido, en vez de dibujar N-1 enlaces positivos manualmente.

**Contexto de negocio:**
La transcripcion §3.5 hace explicito el valor ergonomico de NO: "evita tener que conectar manualmente todos los estados alternativos salvo uno". En un objeto con 10 estados, declarar 9 enlaces positivos es tedioso y fragil; un solo enlace `NO` hacia el excluido expresa lo mismo con menos superficie. Es el caso de uso canonico de NO en OPCloud. La SSOT define Instrumento como habilitador no humano [Glos 3.30].

**Criterios de aceptacion:**
- **Dado** que tengo un objeto con estados `[s1, s2, s3, s4, s5]` y necesito expresar "el proceso ocurre para todo estado ≠ s3", **cuando** creo un enlace NO hacia `s3`, **entonces** la semantica es equivalente a 4 enlaces positivos hacia `s1, s2, s4, s5`.
- **Dado** que aplique NO sobre el estado excluido, **cuando** consulto OPL-ES, **entonces** la oracion es algo como `Proceso X ocurre cuando Objeto NO esta en estado s3.` (fraseo exacto: §13 Q5).
- **Dado** que la validacion corre, **cuando** el validador detecta ambos patrones (NO + positivos para los otros estados), **entonces** emite advertencia de redundancia (delegar a EPICA-1C).

**Reglas y restricciones:**
- Esta HU es ergonomia, no una nueva primitiva — el mecanismo es `enlace.modificador = "NO"` (HU-15.016).
- La presencia de ambos patrones redundantes se marca como advertencia (no error).

**Dependencias:**
- Bloqueada por: HU-15.016.
- Relaciona: EPICA-1C (validaciones).

**Integraciones:**
- Validador del kernel.
- Panel OPL-ES.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [Glos 3.30] Instrumento.
- Fuente OPCloud: §3.5 transcripcion explicita.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, enlaces, no, estados, ergonomia].

---

### HU-15.018 — Ver probabilidad en enlace Evento cuando esta definida

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; K secundario (campo opcional).
**Superficie UI:** canvas-render (etiqueta) + dialogo-propiedades-enlace.
**Gesto canonico:** escritura numerica en campo Probabilidad del dialogo.

**Historia:**
> Como ingeniero de simulacion, quiero asignar una probabilidad (`0.3`) a un enlace Evento y verla renderizada sobre la linea para modelar disparos estocasticos.

**Contexto de negocio:**
En OPM con extension simulacional (EPICA-B0/B1/B4), los enlaces Evento pueden llevar probabilidad para modelar disparos estocasticos o ramas probabilisticas. No es parte del OPM canonico basico, pero si del OPCloud avanzado. Las propiedades como las etiquetas son anotaciones de modelado [Glos 3.60]. Esta HU es S (should-have) porque eleva poder expresivo en simulacion sin bloquear modelado basico.

**Criterios de aceptacion:**
- **Dado** que un enlace tiene subtipo Evento, **cuando** abro propiedades, **entonces** aparece un campo `Probabilidad` editable.
- **Dado** que ingreso `0.3` y confirmo, **cuando** el enlace se actualiza, **entonces** persiste `enlace.probabilidad = 0.3`.
- **Dado** que un enlace Evento tiene probabilidad, **cuando** miro el canvas, **entonces** aparece la etiqueta `0.3` (o `30%`) sobre la linea.
- **Dado** que la probabilidad es `null`, **cuando** miro canvas, **entonces** no aparece etiqueta de probabilidad.

**Reglas y restricciones:**
- Rango valido: `[0, 1]` — validacion por EPICA-B3.
- La suma de probabilidades en las ramas de un abanico de Evento deberia ser `1` — advertencia si no (delegar EPICA-B3).
- Campo disponible solo cuando `enlace.subtipo = "Evento"`.

**Modelo de datos tocado:**
- `enlace.probabilidad` — `number | null` — persistente.

**Dependencias:**
- Bloqueada por: HU-15.015.
- Relaciona: EPICA-B0, EPICA-B1, EPICA-B3, EPICA-B4.

**Integraciones:**
- Renderer (etiqueta).
- Validador de rangos (EPICA-B3).

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [Glos 3.60] propiedad (anotacion de modelado).
- Fuente OPCloud: §10.1 Evento + contexto OPCloud simulacion (inferencia cruzada con EPICA-B*).
- Clase de afirmacion: inferido (no observado directo en frames de esta feature, pero consistente con vocabulario Evento/probabilistico del reverse).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, render, evento, probabilidad, etiqueta, requires-clarification].

---

### HU-15.019 — Crear enlace de invocacion zigzag entre dos procesos

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V secundario.
**Superficie UI:** canvas-opd + tabla-enlaces (tipo Invocacion).
**Gesto canonico:** arrastre de un proceso a otro + seleccion de `Invocacion` en el selector.

**Historia:**
> Como modelador, quiero crear un enlace de invocacion con estilo zigzag entre dos procesos para expresar que un proceso invoca a otro.

**Contexto de negocio:**
Invocacion es una relacion Proceso→Proceso donde A dispara la ejecucion de B. La SSOT define la firma canonica Proceso→Proceso como familia autonoma [V-240] [V-61]. El estilo visual zigzag (§9 "la invocacion observada es vertical descendente") lo distingue de otros enlaces procedimentales. Es parte del repertorio OPM avanzado (§5.1).

**Criterios de aceptacion:**
- **Dado** que hay dos procesos `A` y `P` en el canvas, **cuando** arrastro de A a P y selecciono `Invocacion` en el selector, **entonces** se crea un enlace con `tipo = "invocacion"`, estilo zigzag.
- **Dado** que el enlace es Invocacion, **cuando** miro el canvas, **entonces** la linea se renderiza con patron zigzag (vertical descendente por convencion observada).
- **Dado** que cree el enlace, **cuando** consulto OPL-ES, **entonces** aparece algo como `A invoca P.` [OPL-ES §2].
- **Dado** que origen y destino son del mismo proceso, **cuando** se crea, **entonces** se tipifica como auto-invocacion (HU-15.020).

**Reglas y restricciones:**
- Invocacion es Proceso→Proceso. Intentarlo Proceso→Objeto u Objeto→* deberia filtrarse del selector (regla gramatica OPM).
- Estilo visual zigzag sujeto a SSOT visual.
- Fraseo OPL-ES: `invoca` [OPL-ES §2].

**Modelo de datos tocado:**
- `enlace.tipo` incluye valor `"invocacion"` — persistente.

**Dependencias:**
- Bloqueada por: HU-10.001 (proceso), HU-10.008 (selector), HU-10.011 (confirmacion).

**Integraciones:**
- Renderer (estilo zigzag).
- Validador (Proceso→Proceso).

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [V-240] firma Proceso→Proceso; [V-61] anatomia de enlace; `opm-opl-es.md` [OPL-ES §2] `invoca`.
- Fuente OPCloud: §3.6 invocacion, §5.1 tipos observados, §9 convenciones.
- Frames: frame_00090 invocacion en zigzag.
- Clase de afirmacion: observado.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, enlaces, invocacion, zigzag].

---

### HU-15.020 — Crear auto-invocacion con demora por defecto de 1 segundo

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V secundario.
**Superficie UI:** canvas-opd + halo/barra-contextual (accion `Auto-Invocacion`).
**Gesto canonico:** clic en accion auto-invocacion desde halo del proceso, o arrastre sobre si mismo.

**Historia:**
> Como modelador, quiero crear un enlace de auto-invocacion en un proceso para expresar que el proceso se invoca a si mismo, con una demora por defecto de 1 segundo.

**Contexto de negocio:**
Auto-invocacion modela recursion o reinicio temporizado. OPCloud agrega por convencion (§3.6 paso 3) una demora por defecto de 1 segundo — un valor finito evita loops inmediatos sin significado temporal. La SSOT define la firma canonica Proceso→Proceso como familia autonoma [V-240].

**Criterios de aceptacion:**
- **Dado** que tengo un proceso `P` seleccionado, **cuando** ejecuto `Auto-Invocacion` desde el halo o barra contextual, **entonces** se crea un enlace con `origen = P, destino = P, tipo = "invocacion", demora_invocacion = 1000` (ms) por default.
- **Dado** que cree auto-invocacion, **cuando** miro canvas, **entonces** la linea sale y regresa al mismo proceso con estilo zigzag.
- **Dado** que abro propiedades de la auto-invocacion, **cuando** modifico la demora, **entonces** persiste el nuevo valor en `enlace.demora_invocacion`.
- **Dado** que la demora es `0`, **cuando** el validador corre, **entonces** emite advertencia (demora `0` puede causar loop infinito — delegar EPICA-1C).

**Reglas y restricciones:**
- Default demora: `1` segundo (= `1000ms`).
- Unidad de la demora: milisegundos (inferido; unidad explicita: **pregunta abierta**).
- La auto-invocacion es una forma especial de invocacion, no un tipo de enlace separado — comparte `enlace.tipo = "invocacion"`.

**Modelo de datos tocado:**
- `enlace.demora_invocacion` — `number | null` — persistente (en ms).

**Dependencias:**
- Bloqueada por: HU-15.019.
- Bloquea a: HU-15.021.

**Integraciones:**
- Renderer (ciclo cerrado visual).
- Validador (advertencia demora 0).

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [V-240] firma Proceso→Proceso.
- Fuente OPCloud: §3.6 pasos 2-3, §6 `enlace.demora_invocacion`.
- Frames: frame_00100 caso de auto-invocacion/espera.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, enlaces, auto-invocacion, demora].

---

### HU-15.021 — Visualizar proceso de espera derivado de la demora de auto-invocacion

**Actor primario:** RV (revisor).
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; L secundario.
**Superficie UI:** canvas-render (en el ciclo de la auto-invocacion).
**Gesto canonico:** ninguno (render derivado).

**Historia:**
> Como lector del modelo, quiero ver un `proceso de espera` intercalado en el ciclo de la auto-invocacion para identificar visualmente que hay una demora temporal.

**Contexto de negocio:**
La demora de la auto-invocacion es informacion semantica que OPM puede representar graficamente como un proceso de espera intercalado (§3.6 paso 4). Sin esta visualizacion, la demora solo seria un numero en propiedades; con ella, el diagrama muestra el loop temporal directamente. La SSOT define la firma Proceso→Proceso [V-240]. Si es vista o entidad persistida es **pregunta abierta** (§13 Q2).

**Criterios de aceptacion:**
- **Dado** que una auto-invocacion tiene `demora > 0`, **cuando** miro el canvas, **entonces** aparece un pequeno elemento tipo "proceso de espera" en el ciclo del enlace.
- **Dado** que la demora es `null` o `0`, **cuando** miro canvas, **entonces** no aparece proceso de espera.
- **Dado** que cambio la demora, **cuando** confirmo, **entonces** el proceso de espera aparece/desaparece segun corresponda.
- **Dado** que consulto OPL-ES, **cuando** hay proceso de espera, **entonces**: **pregunta abierta** si el OPL-ES lo menciona.

**Reglas y restricciones:**
- Proceso de espera es **vista** (derivado de la demora), no una entidad editable por el usuario — **a validar** (§13 Q2).
- Si se decide persistirlo como entidad, se agrega complejidad — prefiere ser vista.

**Dependencias:**
- Bloqueada por: HU-15.020.

**Integraciones:**
- Renderer (genera elemento derivado).
- Lente (si fuese persistido, seria parte del modelo).

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [V-240] firma Proceso→Proceso.
- Fuente OPCloud: §3.6 paso 4, §13 Q2.
- Frames: frame_00100.
- Clase de afirmacion: observado + abierto (naturaleza vista vs entidad).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, render, auto-invocacion, espera, requires-clarification].

---

### HU-15.022 — Mover puerto de un enlace existente con dialogo Mover Puerto

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V secundario.
**Superficie UI:** dialogo-mover-puerto.
**Gesto canonico:** clic derecho sobre enlace existente + opcion `Mover Puerto`.

**Historia:**
> Como modelador, quiero mover el puerto de conexion de un enlace existente en el shape para ajustar el layout visual sin reconectar el enlace.

**Contexto de negocio:**
El puerto donde se ancla el enlace en el shape afecta la alineacion visual (transcripcion HU-10.007 "conectar al centro o a un puerto especifico cambia la alineacion"). Reconectar el enlace supondria borrarlo y recrearlo perdiendo sus atributos — Mover Puerto permite re-anclar preservando identidad. La SSOT define la anatomia de enlace [V-61].

**Criterios de aceptacion:**
- **Dado** que hago clic derecho sobre un enlace existente, **cuando** se abre el dialogo, **entonces** aparece la opcion `Mover Puerto`.
- **Dado** que selecciono `Mover Puerto`, **cuando** arrastro el extremo del enlace a otro punto del mismo shape, **entonces** el enlace se re-ancla al nuevo punto conservando todos sus atributos (tipo, subtipo, multiplicidad, ruta).
- **Dado** que intento anclar a otro shape distinto, **cuando** suelto, **entonces**: **pregunta abierta** (§13 Q3 "que limites exactos impone `Mover Puerto`"). Marcar `requires-clarification`.
- **Dado** que cancelo el movimiento, **cuando** el dialogo se cierra sin confirmacion, **entonces** el puerto original permanece.

**Reglas y restricciones:**
- Mover Puerto preserva el enlace — no es eliminar+crear.
- El alcance (mismo shape vs cualquier shape) es abierto.
- Se invoca desde clic derecho, no desde halo (enlaces no tienen halo radial — §11).

**Modelo de datos tocado:**
- `enlace.puerto` — string | null — persistente (identificador del puerto especifico).

**Dependencias:**
- Bloqueada por: HU-10.011.
- Relaciona: EPICA-16 (propiedades de enlace).

**Integraciones:**
- Renderer (re-rutea la linea).
- Layout.

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [V-61] anatomia de enlace (origen, destino, conector).
- Fuente OPCloud: §2 dialogo `Mover Puerto`, §5.2 parametros (`puerto`), §6 `enlace.puerto`, §13 Q3.
- Frames: frame_00085 edicion contextual de puerto.
- Clase de afirmacion: observado + abierto (alcance).
- Etiqueta: `requires-clarification`.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, enlaces, mover-puerto, menu-contextual, requires-clarification].

---

### HU-15.023 — Remover relacion existente desde el dialogo Mover Puerto

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K (elimina enlace).
**Superficie UI:** dialogo-mover-puerto (boton `Remover Relacion`).
**Gesto canonico:** clic en boton `Remover Relacion`.

**Historia:**
> Como modelador, quiero eliminar un enlace desde el mismo dialogo de Mover Puerto con el boton `Remover Relacion` para no buscar la accion en otra superficie UI.

**Contexto de negocio:**
El mismo dialogo que permite mover el puerto expone tambien `Remover Relacion` (§2 tabla). Centralizar eliminacion de enlace en el contexto del enlace evita viajes de cursor y reduce friccion. La SSOT define la anatomia de enlace [V-61], y su eliminacion es una operacion sobre ella.

**Criterios de aceptacion:**
- **Dado** que el dialogo Mover Puerto esta abierto, **cuando** hago clic en `Remover Relacion`, **entonces** el enlace se elimina del modelo.
- **Dado** que elimine el enlace, **cuando** consulto OPL-ES, **entonces** la oracion correspondiente desaparece.
- **Dado** que elimine el enlace, **cuando** consulto el canvas, **entonces** la linea desaparece.
- **Dado** que existe undo (EPICA-90), **cuando** presiono `Ctrl+Z`, **entonces** el enlace vuelve a aparecer.

**Reglas y restricciones:**
- Eliminacion es inmediata, sin confirmacion (consistente con EPICA-1C para enlaces).
- Si el enlace era rama de un abanico logico (HU-15.008), el grupo se recalcula: si queda una sola rama, el abanico se colapsa.

**Modelo de datos tocado:**
- `enlace` — eliminado (del modelo).

**Dependencias:**
- Bloqueada por: HU-15.022.
- Relaciona: EPICA-90 (undo).

**Integraciones:**
- Panel OPL-ES.
- Renderer.
- Layout (re-flujo si hay abanico).

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [V-61] anatomia de enlace.
- Fuente OPCloud: §2 tabla superficies UI, dialogo `Mover Puerto` permite `Remover Relacion`.
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [canvas, kernel, enlaces, remover, menu-contextual].

---

### HU-15.024 — Editar vertices de un enlace polyline con joint-tools

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario; V secundario.
**Superficie UI:** joint-tools sobre enlace seleccionado.
**Gesto canonico:** clic sobre enlace para seleccionar + arrastre sobre puntos de vertices/segments.

**Historia:**
> Como modelador, quiero agregar, mover y eliminar vertices intermedios de un enlace polyline usando los `joint-tools` estandar para controlar el ruteo visual sin tocar el modelo semantico.

**Contexto de negocio:**
Los enlaces en OPCloud usan `joint-tools` estandar de JointJS (§11 de la fuente). Las herramientas disponibles son `vertices`, `segments`, `source-arrowhead`, `target-arrowhead`, `button`. Un enlace simple muestra 3 herramientas (`vertices`, `target-arrowhead`, `button`); un enlace polyline muestra 5 (agrega `segments` y `source-arrowhead`). La SSOT define la anatomia de enlace [V-61] y JOYAS documenta los puertos y routing [JOYAS §7].

**Criterios de aceptacion:**
- **Dado** que selecciono un enlace simple, **cuando** miro las herramientas, **entonces** veo 3 tools: `vertices`, `target-arrowhead`, `button`.
- **Dado** que selecciono un enlace polyline (con vertices manuales), **cuando** miro las herramientas, **entonces** veo 5 tools: los 3 anteriores + `segments` + `source-arrowhead`.
- **Dado** que uso `vertices`, **cuando** hago clic en un tramo y arrastro, **entonces** se crea/mueve un vertice y la linea se re-rutea.
- **Dado** que uso `segments`, **cuando** arrastro un segmento, **entonces** se manipula el tramo completo.
- **Dado** que uso `target-arrowhead`, **cuando** arrastro el extremo destino, **entonces** el enlace se re-ancla al nuevo shape destino (con validacion: si no hay destino compatible, reverte).
- **Dado** que uso `source-arrowhead`, **cuando** arrastro el extremo origen, **entonces** el enlace se re-ancla al nuevo shape origen.
- **Dado** que los vertices manuales se eliminan a la posicion cero, **cuando** el enlace se recalcula, **entonces** vuelve a enlace simple (3 tools).

**Reglas y restricciones:**
- El `button` tool aparece en todos los enlaces; su accion exacta (eliminar directo, abrir selector, modal propiedades) es **pregunta abierta** (§13 Q6) — HU separada o delegacion.
- La edicion de vertices es puramente visual; no modifica atributos semanticos.
- Reanchar con arrowheads revalida compatibilidad — si ilegal, se cancela el cambio.

**Modelo de datos tocado:**
- `enlace.vertices` — `Array<{x,y}> | null` — persistente.
- Reanchar cambia `enlace.origen` o `enlace.destino` — persistente.

**Dependencias:**
- Bloqueada por: HU-10.011.
- Relaciona: EPICA-16 (propiedades), EPICA-14 (styling).

**Integraciones:**
- JointJS link tools.
- Renderer.
- Validador (compatibilidad al reanchar).

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [V-61] anatomia de enlace; `JOYAS.md` [JOYAS §7] puertos y routing.
- Fuente OPCloud: §11 Tools JointJS por tipo de Enlace, §13 Q6.
- Clase de afirmacion: observado + abierto (accion del `button`).
- Etiqueta: `requires-clarification` (accion de `button`).

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, enlaces, joint-tools, vertices, jointjs, requires-clarification].

---

### HU-15.025 — Ver advertencia semantica al intentar consumir dos veces el mismo objeto

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** L (validacion como lente); reporta a U (widget advertencia).
**Superficie UI:** tabla-enlaces o panel-validacion.
**Gesto canonico:** intento de crear un segundo enlace Consumo sobre el mismo objeto.

**Historia:**
> Como modelador, quiero recibir una advertencia semantica (no bloqueante) cuando intento consumir dos veces el mismo objeto para evitar modelos inconsistentes sin perder flexibilidad en casos excepcionales.

**Contexto de negocio:**
La fuente §4.1 explicita: "OPCloud puede advertir, sin bloquear del todo, que un objeto no deberia consumirse mas de una vez en ciertos contextos". La advertencia es soft — respeta autonomia del modelador pero senaliza riesgo semantico. La SSOT define las cinco familias canonicas [V-239] que gobiernan la validez de los enlaces. Combinar con §4.2 (errores por incompatibilidad fisica/informatica — bloqueo por ausencia en selector).

**Criterios de aceptacion:**
- **Dado** que ya existe un enlace Consumo de `Objeto X` a `Proceso P1`, **cuando** intento crear otro Consumo de `Objeto X` a `Proceso P2`, **entonces** aparece advertencia (no error) avisando que X se consumiria dos veces.
- **Dado** que acepto la advertencia, **cuando** confirmo, **entonces** el segundo enlace se crea y ambos persisten.
- **Dado** que intento una combinacion fisicamente imposible (ej. Agente desde objeto informacional — HU-10.010), **cuando** miro la tabla de enlaces, **entonces** el tipo no aparece — bloqueo duro, no advertencia.
- **Dado** que hay una advertencia activa, **cuando** corro el validador global (EPICA-1C), **entonces** la advertencia aparece en el reporte.

**Reglas y restricciones:**
- Advertencias son no-bloqueantes (el usuario puede ignorarlas); errores son bloqueantes (el selector los oculta).
- La clasificacion advertencia vs error depende de la regla OPM:
  - advertencia: consumo duplicado, redundancia NO+positivos, multiplicidad `0`.
  - error: incompatibilidad esencia/afiliacion, Agente sin fisica.
- Delegar catalogo completo a EPICA-1C.

**Modelo de datos tocado:**
- Ninguno directo (advertencias son derivados del modelo).

**Dependencias:**
- Bloqueada por: HU-10.011.
- Relaciona: EPICA-1C (validaciones completas), HU-10.010 (Agente filtrado).

**Integraciones:**
- Validador (`src/nucleo/validacion/`).
- Widget de advertencia (UI).

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [V-239] cinco familias canonicas de enlace.
- Fuente OPCloud: §4.1 advertencias semanticas, §4.2 error por incompatibilidad.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, validacion, enlaces, advertencia, consumo].

---

## Preguntas abiertas derivadas (trazabilidad con §13 doc fuente)

- **Q15.1**: ¿El operador logico del abanico se serializa como atributo compartido (en una entidad `grupo_logico`) o como relacion explicita entre ramas? (cf. §13 Q1, HU-15.008, HU-15.009). Marcada `requires-clarification`.
- **Q15.2**: ¿El proceso de espera de auto-invocacion es una vista derivada de la demora o una entidad persistida? (cf. §13 Q2, HU-15.021). Marcada `requires-clarification`.
- **Q15.3**: ¿Que limites exactos impone `Mover Puerto`? ¿Permite re-anclar a otro shape o solo a otro puerto del mismo? (cf. §13 Q3, HU-15.022). Marcada `requires-clarification`.
- **Q15.4**: OPL-ES exacta de `Condicion` y `Evento` para los 3 tipos procedimentales (Instrumento/Consumo/Efecto). (cf. §13 Q4, HU-15.014, HU-15.015). Marcada `requires-clarification`.
- **Q15.5**: Semantica precisa del modificador `NO` en cada tipo y como se verbaliza en OPL-ES. Conciliar nomenclatura `enlace.modificador` vs `enlace.negado` (cf. §13 Q5, §6 fuente, HU-15.016). Marcada `requires-clarification`.
- **Q15.6**: Comportamiento exacto del tool `button` en un enlace seleccionado (¿eliminar directo? ¿abre selector de tipo? ¿modal de propiedades?) (cf. §13 Q6, HU-15.024). Marcada `requires-clarification`.
- **Q15.7** (derivada): Reglas de pluralizacion de `enlace.multiplicidad` en OPL-ES (plural irregular en ingles/espanol) — HU-15.004.
- **Q15.8** (derivada): Default del operador de abanico al crearse (XOR implicito vs O implicito) — HU-15.008.
- **Q15.9** (derivada): ¿Probabilidad en enlace Evento es parte del OPM core de OPCloud o solo de la extension de simulacion? — HU-15.018. Relaciona EPICA-B*.
- **Q15.10** (derivada): Unidad canonica de la `demora_invocacion` (ms, s) y precision soportada — HU-15.020.

## Referencias cruzadas

- **Doc fuente:** `opcloud-reverse/15-canvas-enlaces-avanzados.md`.
- **Docs fuente relacionados:**
  - `opcloud-reverse/11-canvas-modelado-basico.md` §10 (selector de enlace con dropdowns subtipo y modificador).
  - `opcloud-reverse/12-canvas-inzooming.md` (contexto de in-zooming y alternado de enlaces sobre procesos refinados — §7.2 de la fuente).
  - `opcloud-reverse/16-canvas-enlaces-propiedades.md` (superficie compartida de propiedades de enlace).
  - `opcloud-reverse/18-canvas-semi-folding.md` (semi-folding de enlaces en modelos densos).
- **Epicas que esta depende:**
  - **EPICA-10** (creacion de cosas + enlace basico con tabla de enlaces y modificadores Ninguno/NO y subtipo).
  - **EPICA-13** (estados como destinos de ramas y rutas).
  - **EPICA-11** (modelado basico como contexto del selector de enlace §10).
- **Epicas que dependen de esta:**
  - **EPICA-16** (extiende propiedades de enlace).
  - **EPICA-1C** (catalogo completo de validaciones/advertencias incluyendo los casos de esta epica).
  - **EPICA-50** (panel OPL-ES consume los fraseos de Condicion/Evento/NO/XOR/O).
  - **EPICA-B0/B1/B3/B4** (simulacion consume probabilidades de Evento y demoras de auto-invocacion).
  - **EPICA-90** (shortcuts incluyen atajos de edicion de enlace — no observados aqui pero probables).
- **Invariantes del repo:**
  - `src/nucleo/tipos.ts` — agrega `enlace.subtipo`, `enlace.modificador`, `enlace.multiplicidad`, `enlace.ruta`, `enlace.grupo_logico`, `enlace.probabilidad`, `enlace.demora_invocacion`, `enlace.puerto`, `enlace.vertices`.
  - `src/nucleo/validacion/` — reglas de compatibilidad para Condicion/Evento/NO, advertencias por consumo duplicado, incompatibilidad de Agente.
  - `src/render/jointjs/` — shape factories para triangulito XOR, abrazadera O, zigzag invocacion, etiqueta de multiplicidad y ruta.
  - `src/render/layout/` — posicionamiento de etiquetas de linea sin colision.
  - `src/render/opl-renderer.ts` — pluralizacion, fraseo XOR/O, Condicion/Evento/NO, rutas.
- **SSOT aplicable:**
  - `opm-visual-es.md` [V-3] triangulo conector con vertice al refinable; [V-61] anatomia de enlace; [V-239] cinco familias canonicas; [V-240] firma Proceso→Proceso para invocacion.
  - `opm-iso-19450-es.md` [Glos 3.30] Instrumento; [Glos 3.3] Agente; [Glos 3.60] propiedad.
  - `opm-opl-es.md` [OPL-ES T5] Instrumento; [OPL-ES T2] Resultado; [OPL-ES §2] invoca, por ruta, exactamente uno de, al menos uno de.
