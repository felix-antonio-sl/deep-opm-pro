---
epica: "EPICA-10"
titulo: "Canvas — creacion de cosas (proceso, objeto, enlace inicial, afiliacion, esencia)"
doc_fuente: "opcloud-reverse/10-canvas-creacion-cosas.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M0"
hu_emitidas: 22
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta epica cubre el arranque minimo de modelado OPM: crear procesos y objetos,
nombrarlos, conectarlos con un enlace basico, y gestionar los dos ejes ontologicos
(esencia y afiliacion). Las HU se organizan en nucleo OPM semantico (M0) y
afordances UI heredados de OPCloud (M1/S) que pueden divergir en implementacion.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-10.001 | Crear proceso por arrastre desde barra principal | MN | M0 | M | opm-semantica | [V-1] [Glos 3.58] |
| HU-10.002 | Crear objeto por arrastre desde barra principal | MN | M0 | M | opm-semantica | [V-1] [Glos 3.39] |
| HU-10.003 | Nombrar cosa recien creada con dialogo emergente | MN | M0 | S | opm-semantica | [Glos 3.76] |
| HU-10.004 | Editar descripcion opcional | MN | S | XS | opcloud-ui | — |
| HU-10.005 | Confirmar nombre con Enter o boton | MN | M0 | XS | opm-semantica | — |
| HU-10.006 | Preservar capitalizacion exacta desmarcando Auto Format | ME | M1 | XS | opcloud-ui | — |
| HU-10.007 | Iniciar enlace desde borde de cosa | MN | M0 | M | opm-semantica | [V-61] |
| HU-10.008 | Ver solo tipos de enlace validos en tabla | MN | M0 | M | opm-semantica | [V-239] [V-240] |
| HU-10.009 | Ver previsualizacion OPL-ES por tipo de enlace | MN | M1 | S | opcloud-ui | [OPL-ES T1..T3] |
| HU-10.010 | Filtrar Agente cuando objeto no es fisico | ME | M1 | S | opm-semantica | [Glos 3.3] [V-1] |
| HU-10.011 | Confirmar tipo de enlace y cerrar tabla | MN | M0 | XS | opm-semantica | [V-61] |
| HU-10.012 | Cambiar afiliacion con alternador instantaneo | MN | M0 | S | opm-semantica | [V-1] [Glos 3.5] |
| HU-10.013 | Cambiar esencia con alternador instantaneo | MN | M0 | S | opm-semantica | [V-1] [V-124] |
| HU-10.014 | Ver distincion visual de esencia fisica | MN | M0 | XS | opm-semantica | [V-124] [JOYAS §1] |
| HU-10.015 | Ver distincion visual de afiliacion ambiental | MN | M0 | XS | opm-semantica | [V-1] [JOYAS §1] |
| HU-10.016 | Ver eco OPL-ES al crear cosa | MN | M0 | S | opm-semantica | [OPL-ES D1..D4] |
| HU-10.017 | Ver cosa en biblioteca lateral | MN | M1 | S | opcloud-ui | — |
| HU-10.018 | Ver cosa en navegador OPD | MN | M1 | XS | opcloud-ui | — |
| HU-10.019 | Abrir menu contextual de cosa | ME | M1 | S | mixto | — |
| HU-10.020 | Acceder acciones del menu contextual | ME | M1 | S | mixto | — |
| HU-10.021 | Descomposicion de objeto en el mismo diagrama | ME | C | M | opcloud-ui | [§12 doc fuente] |
| HU-10.022 | Ver indicador de modelo no guardado | MN | M1 | XS | opcloud-ui | — |

Total: **22 historias de usuario** (8 opm-semantica, 10 opcloud-ui, 2 mixto).

## Historias de usuario

### HU-10.001 — Crear proceso por arrastre desde barra principal

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME (modelador experto).
**Tipo:** opm-semantica.
**Nivel categorico:** K (kernel) primario; V (render) y U (dialogo emergente) secundarios.
**Superficie UI:** barra-principal + canvas-opd + dialogo-nombre.
**Gesto canonico:** arrastrar icono de proceso desde la barra hasta una posicion del canvas.

**Historia:**
> Como modelador novato, quiero arrastrar el icono de proceso desde la barra al canvas para crear un proceso OPM con un solo gesto y nombrarlo de inmediato.

**Contexto de negocio:**
El arranque del modelado es el momento mas fragil de la adopcion. La SSOT OPM [Glos 3.58] define Proceso como "transformacion de uno o mas objetos". Un solo gesto que combina creacion mas invitacion a nombrar reduce la friccion cognitiva. OPCloud implementa esto como arrastre desde barra (confirmado por transcripcion en `opcloud-reverse/10` §3.1).

**Criterios de aceptacion:**
- **Dado** que estoy en un OPD vacio o con otros elementos, **cuando** arrastro el icono de proceso desde la barra hasta una posicion `(x, y)`, **entonces** se crea una elipse con `tipo=proceso`, `afiliacion=sistemica`, `esencia=informacional`, nombre por defecto `Un Proceso` y posicion `(x, y)`.
- **Dado** que se creo el proceso, **cuando** se renderiza, **entonces** se abre automaticamente un dialogo de nombre con el texto preseleccionado.
- **Dado** que se creo el proceso, **cuando** consulto el panel OPL-ES, **entonces** aparece la oracion: `*Un Proceso* es un proceso informacional y sistemico.` [OPL-ES D1..D4]
- **Dado** que un proceso previo ya usa el nombre por defecto, **cuando** creo un segundo sin renombrar, **entonces** el nuevo toma un nombre serial `Un Proceso 2` (ver HU-1C.012).

**Reglas y restricciones:**
- Valores por defecto: `esencia = informacional`, `afiliacion = sistemica`. [V-1]
- El gesto de creacion es arrastre, no clic simple. [Evidencia OPCloud: transcripcion §3.1]
- Dimensiones canonicas: 135x60 px. [JOYAS §2]
- Borde: `#3BC3FF` (cyan). Fondo: `#fdffff`. [JOYAS §1]
- Tipografia: Arial 14px semibold, text-anchor: middle. [JOYAS §3]

**Modelo de datos tocado:**
- `cosa.id` — UUID — persistente.
- `cosa.tipo` — `"proceso"` — persistente.
- `cosa.nombre` — string — persistente.
- `cosa.posicion` — `{x: number, y: number}` — persistente.
- `cosa.afiliacion` — `"sistemica"` (defecto) — persistente.
- `cosa.esencia` — `"informacional"` (defecto) — persistente.

**Dependencias:**
- Bloquea a: HU-10.002 (objeto reutiliza misma mecanica).
- Bloquea a: HU-10.007 (enlace requiere dos cosas creadas).
- Bloquea a: HU-10.012, HU-10.013 (alternadores sobre cosa existente).

**Integraciones:**
- Panel OPL-ES: emite oracion sintetica [OPL-ES D1..D4].
- Panel lateral de cosas: inserta entrada.
- Navegador OPD: actualiza miniatura.
- Indicador de persistencia: transiciona a "Modelo (No guardado)" si es primera creacion.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.58] Proceso; [V-1] valores por defecto.
- Fuente OPCloud: `opcloud-reverse/10-canvas-creacion-cosas.md` §3.1, §5.1, §9.
- Frames: frame_00011, frame_00015, frame_00018.
- Evidencia visual: JOYAS §1 colores, §2 dimensiones, §3 tipografia.
- Clase de afirmacion: confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, proceso, creacion, arrastre, dialogo-nombre, opl-es].

---

### HU-10.002 — Crear objeto por arrastre desde barra principal

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V, U secundarios.
**Superficie UI:** barra-principal + canvas-opd + dialogo-nombre.
**Gesto canonico:** arrastrar icono de objeto desde la barra hasta una posicion del canvas.

**Historia:**
> Como modelador, quiero arrastrar el icono de objeto desde la barra al canvas para crear un objeto OPM con el mismo gesto que uso para procesos.

**Contexto de negocio:**
La SSOT OPM [Glos 3.39] define Objeto como "elemento del modelo que representa una cosa con existencia fisica o informacional potencial". La simetria de gesto (arrastre) entre proceso y objeto reduce la carga cognitiva. Ambos son las dos primitivas fundamentales de OPM; el producto debe tratarlas con afordancias paralelas.

**Criterios de aceptacion:**
- **Dado** que estoy en el canvas, **cuando** arrastro el icono de objeto desde la barra hasta una posicion `(x, y)`, **entonces** se crea un rectangulo con `tipo=objeto`, `afiliacion=sistemica`, `esencia=informacional`, nombre por defecto `Un Objeto` y posicion `(x, y)`.
- **Dado** que se creo el objeto, **cuando** se renderiza, **entonces** se abre el dialogo de nombre.
- **Dado** que se creo el objeto, **cuando** consulto el panel OPL-ES, **entonces** aparece: `**Un Objeto** es un objeto informacional y sistemico.` [OPL-ES D1..D4]
- **Dado** que se creo el objeto, **cuando** consulto el panel lateral, **entonces** aparece en la lista.

**Reglas y restricciones:**
- Valores por defecto identicos a HU-10.001: `informacional`, `sistemica`. [V-1]
- Dimensiones canonicas: 135x60 px. [JOYAS §2]
- Borde: `#70E483` (verde lima). Fondo: `#fdffff`. [JOYAS §1]
- Tipografia: Arial 14px semibold, text-anchor: middle. [JOYAS §3]
- El rectangulo admite sombreado canonico cuando `esencia = fisica`. [V-124]

**Modelo de datos tocado:**
- Mismo esquema que HU-10.001 con `cosa.tipo = "objeto"`.

**Dependencias:**
- Bloqueada por: HU-10.001 (comparte dialogo de nombre y mecanica de creacion).

**Integraciones:** identicas a HU-10.001.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [Glos 3.39] Objeto; [V-1] valores por defecto.
- Fuente OPCloud: §3.2, §9.
- Evidencia visual: JOYAS §1 colores, §2 dimensiones.
- Clase de afirmacion: observado + confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, objeto, creacion, arrastre, dialogo-nombre].

---

### HU-10.003 — Nombrar cosa recien creada con dialogo emergente

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** U primario; K (propaga a `cosa.nombre`).
**Superficie UI:** dialogo-nombre.
**Gesto canonico:** escribir en campo + Enter o boton Aceptar.

**Historia:**
> Como modelador, quiero escribir el nombre de la cosa en el dialogo automatico para asignar identidad semantica apenas la creo.

**Contexto de negocio:**
OPM exige nombres significativos. El dialogo inmediato post-creacion elimina la tentacion de dejar cosas con nombre por defecto, que deterioran la legibilidad del modelo y la calidad OPL. La SSOT no prescribe un mecanismo especifico de nombrado, pero OPCloud implementa un popup inline como afordance efectiva.

**Criterios de aceptacion:**
- **Dado** que el dialogo esta abierto tras crear una cosa, **cuando** escribo texto, **entonces** el nombre previo se actualiza en vivo.
- **Dado** que el dialogo esta abierto, **cuando** confirmo con `Enter` o boton `Aceptar`, **entonces** el nombre queda persistido en `cosa.nombre` y el dialogo se cierra.
- **Dado** que confirme el nombre, **cuando** consulto canvas, OPL-ES y panel lateral, **entonces** los tres muestran el nombre asignado.
- **Dado** que el dialogo esta abierto, **cuando** cancelo (ESC o clic fuera), **entonces** el nombre por defecto se mantiene.

**Reglas y restricciones:**
- El dialogo se ancla visualmente a la cosa recien creada.
- El campo acepta texto libre; reglas de unicidad en HU-1C.012.
- El dialogo no oscurece el canvas completo.

**Modelo de datos tocado:**
- `cosa.nombre` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002 (cosa debe existir).

**Integraciones:**
- Panel OPL-ES se actualiza al confirmar.
- Panel lateral se actualiza.

**Notas de evidencia:**
- Fuente OPCloud: §3.1, §5.1. Frames: frame_00011.
- Clase de afirmacion: observado + confirmado.
- Nota: la SSOT no prescribe el mecanismo de nombrado; esta HU hereda la solucion OPCloud.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, ui, dialogo-nombre, renombrar].

---

### HU-10.004 — Editar descripcion opcional

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** K (nuevo campo `cosa.descripcion`).
**Superficie UI:** dialogo-nombre (campo Descripcion).
**Gesto canonico:** escribir en campo Descripcion del dialogo.

**Historia:**
> Como modelador, quiero agregar una descripcion textual a la cosa desde el dialogo para documentar su semantica sin salir del flujo.

**Contexto de negocio:**
Documentacion inline es critica en modelos tecnicos. OPCloud expone un campo `Description` opcional en el mismo dialogo de nombre. La SSOT OPM no exige descripcion — es una conveniencia de OPCloud. Puede omitirse o diferirse sin afectar la conformidad OPM.

**Criterios de aceptacion:**
- **Dado** que el dialogo esta abierto, **cuando** ingreso texto en el campo `Descripcion`, **entonces** el texto se guarda en `cosa.descripcion` al confirmar.
- **Dado** que dejo `Descripcion` vacio, **cuando** confirmo, **entonces** `cosa.descripcion` queda `null` sin error.
- **Dado** que una cosa tiene descripcion, **cuando** la vuelvo a abrir para renombrar, **entonces** el campo muestra el texto previo para edicion.

**Reglas y restricciones:**
- `Descripcion` es texto libre.
- Pregunta abierta: ¿donde se muestra la descripcion despues? ¿Tooltip? ¿Panel lateral? (fuente OPCloud §11.1).

**Modelo de datos tocado:**
- `cosa.descripcion` — string nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-10.003.

**Notas de evidencia:**
- Fuente OPCloud: §5.1, §11.1.
- Clase de afirmacion: observado (control visible) + abierto (donde se presenta despues).
- Etiqueta: `opcloud-ui`, `requires-clarification`.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [canvas, ui, dialogo-nombre, descripcion, opcloud-ui, requires-clarification].

---

### HU-10.005 — Confirmar nombre con Enter o boton

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** U.
**Superficie UI:** dialogo-nombre.
**Gesto canonico:** `Enter` o clic en boton `Aceptar`.

**Historia:**
> Como modelador, quiero confirmar el nombre con Enter o con el boton Aceptar para elegir entre dos afordances equivalentes segun mi estilo de interaccion.

**Contexto de negocio:**
Dos rutas de confirmacion (teclado y boton) cubren tanto al usuario experto como al novato. Enter acelera el flujo; el boton da afordancia explicita.

**Criterios de aceptacion:**
- **Dado** que el dialogo esta abierto, **cuando** presiono `Enter` en cualquier campo de texto, **entonces** el dialogo confirma y cierra.
- **Dado** que el dialogo esta abierto, **cuando** hago clic en el boton `Aceptar`, **entonces** el dialogo confirma y cierra.
- **Dado** que confirme, **cuando** el dialogo se cierra, **entonces** el foco regresa al canvas.

**Reglas y restricciones:**
- `Enter` y `Aceptar` son equivalentes y siempre estan disponibles.
- No hay confirmacion diferida (no hay borrador).

**Dependencias:**
- Bloqueada por: HU-10.003.

**Notas de evidencia:**
- Fuente OPCloud: §5.1.
- Clase de afirmacion: observado.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [canvas, ui, dialogo-nombre, atajo, enter].

---

### HU-10.006 — Preservar capitalizacion exacta desmarcando Auto Format

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** dialogo-nombre (casilla Auto Format).
**Gesto canonico:** desmarcar casilla.

**Historia:**
> Como modelador experto, quiero desmarcar `Auto Format` para preservar la capitalizacion exacta que escribi (ej. `OnStar`, `iOS`, `eHealth`) sin que el sistema la normalice.

**Contexto de negocio:**
`Auto Format` capitaliza cada palabra al confirmar. Para dominios con nombres no convencionales (marcas, acronimos, terminos tecnicos), imponer capitalizacion automatica deteriora el modelo. Desmarcar la casilla es la via para preservar el casing. Es una afordance OPCloud que la SSOT no prescribe.

**Criterios de aceptacion:**
- **Dado** que el dialogo esta abierto y `Auto Format` esta marcado, **cuando** escribo `onstar system` y confirmo, **entonces** el nombre persistido es `Onstar System`.
- **Dado** que desmarco `Auto Format`, **cuando** escribo `OnStar System` y confirmo, **entonces** el nombre persistido es exactamente `OnStar System`.
- **Dado** que desmarque `Auto Format`, **cuando** confirmo, **entonces** la preferencia aplica solo a esta confirmacion — no persiste globalmente.

**Reglas y restricciones:**
- Por defecto: `Auto Format` marcado.
- El desmarcar aplica solo a la confirmacion actual.

**Dependencias:**
- Bloqueada por: HU-10.003.

**Notas de evidencia:**
- Fuente OPCloud: §5.1, §9.
- Clase de afirmacion: observado + confirmado.
- Etiqueta: `opcloud-ui`.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [canvas, ui, dialogo-nombre, auto-format, capitalizacion, opcloud-ui].

---

### HU-10.007 — Iniciar enlace desde borde de cosa

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** U primario; K (crea enlace) secundario.
**Superficie UI:** canvas-opd + cursor-feedback.
**Gesto canonico:** presionar en borde exterior del shape origen + arrastrar hasta shape destino.

**Historia:**
> Como modelador, quiero iniciar un enlace arrastrando desde el borde de una cosa hasta otra para crear una relacion sin usar un menu separado.

**Contexto de negocio:**
La SSOT define que todo enlace consiste de origen, destino y conector [V-61]. La creacion directa por arrastre es el gesto canonico en OPCloud. El area de borde tiene una zona magnetica estrecha que inicia el enlace; el interior mueve el shape.

**Criterios de aceptacion:**
- **Dado** que hay al menos dos cosas en el canvas, **cuando** presiono en el borde exterior de la cosa A (fuera de los handles de redimension), **entonces** el cursor cambia a forma de enlace.
- **Dado** que inicie el arrastre desde el borde, **cuando** muevo el cursor, **entonces** una linea de previsualizacion me sigue.
- **Dado** que arrastro sobre otra cosa B, **cuando** suelto, **entonces** se abre la tabla `Seleccionar tipo de enlace de A a B` (HU-10.008, HU-10.011).
- **Dado** que inicie arrastre desde el **interior** del shape A, **cuando** muevo, **entonces** arrastro el shape A — no inicio enlace.
- **Dado** que inicie arrastre desde un **handle** de A, **cuando** muevo, **entonces** redimensiono A.

**Reglas y restricciones:**
- Zonas del shape: interior → mover, handles → redimensionar, borde exterior → iniciar enlace, fuera → desplazar canvas.
- El cursor debe cambiar visualmente al entrar en zona de enlace.
- OPCloud usa el patron wrapper+line: hit area de 15px transparente + linea visible de 2px. [JOYAS §4]
- Puertos: `port-group:aaa`, `r:2`, `magnet:true`. [JOYAS §7]

**Modelo de datos tocado:**
- Pre-enlace: ninguno (el enlace no existe hasta confirmar tipo).
- Post-confirmacion: `enlace.id`, `enlace.tipo`, `enlace.origen`, `enlace.destino` (HU-10.011).

**Dependencias:**
- Bloqueada por: HU-10.001 y HU-10.002.
- Bloquea a: HU-10.008, HU-10.009, HU-10.010, HU-10.011.

**Notas de evidencia:**
- Fuente normativa: [V-61] anatomia formal de enlace; [V-239] familias canonicas.
- Fuente OPCloud: §3.3; doc 11 §10. Frames: frame_00029.
- Evidencia visual: JOYAS §4 wrapper+line, §6 routing manhattan, §7 puertos.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, enlaces, arrastre, cursor-feedback].

---

### HU-10.008 — Ver solo tipos de enlace validos en tabla

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** V primario; K (valida compatibilidad).
**Superficie UI:** modal-tabla-enlaces.
**Gesto canonico:** ninguno (render inmediato al soltar arrastre).

**Historia:**
> Como modelador, quiero que la tabla de tipos de enlace me muestre unicamente los tipos validos segun la direccion del arrastre y los tipos de cosa, para no elegir combinaciones semanticamente invalidas.

**Contexto de negocio:**
La SSOT define cinco familias canonicas de enlace [V-239]. Cada familia tiene firma especifica: transformadora y habilitadora requieren Objeto→Proceso o Proceso→Objeto; estructural fundamental requiere Objeto→Objeto; invocacion requiere Proceso→Proceso [V-240]. Filtrar el selector reduce errores y ensena la gramatica OPM implicitamente.

**Criterios de aceptacion:**
- **Dado** que solte un arrastre de Objeto `O` a Proceso `P` (O→P), **cuando** se abre la tabla, **entonces** se muestran solo los tipos validos: Exhibicion-Caracterizacion, Instrumento (+subtipos), Consumo (+subtipos), Efecto (+subtipos). Agente solo si O es fisico [Glos 3.3].
- **Dado** que solte arrastre P→O, **cuando** se abre la tabla, **entonces** se muestran: Exhibicion-Caracterizacion, Resultado, Efecto.
- **Dado** que solte arrastre O→O, **cuando** se abre la tabla, **entonces** se muestran las 4 estructurales fundamentales + 2 estructurales etiquetadas. [V-239 familias 4 y 5]
- **Dado** que solte arrastre P→P, **cuando** se abre la tabla, **entonces** se muestra Invocacion. [V-239 familia 3]

**Reglas y restricciones:**
- El filtrado deriva de la gramatica OPM, no de UI. [V-239] [V-240]
- La tabla nunca debe mostrar tipos ilegales (fail-safe).
- 5 familias canonicas: transformadora, habilitadora, invocacion, estructural fundamental, estructural etiquetada.

**Dependencias:**
- Bloqueada por: HU-10.007.

**Integraciones:**
- Kernel de validacion aporta la logica de compatibilidad.

**Notas de evidencia:**
- Fuente normativa: [V-239] cinco familias canonicas; [V-240] firma Proceso→Proceso para invocacion; [Glos 3.3] Agente.
- Fuente OPCloud: §3.3, §5.2; doc 11 §10.2.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, ui, tabla-enlaces, validacion, gramatica-opm].

---

### HU-10.009 — Ver previsualizacion OPL-ES por tipo de enlace

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; L (OPL-ES) secundario.
**Superficie UI:** modal-tabla-enlaces.
**Gesto canonico:** ninguno (render inmediato).

**Historia:**
> Como modelador novato, quiero ver la oracion OPL-ES que generara cada tipo de enlace antes de elegir, para aprender la semantica OPM mientras modelo.

**Contexto de negocio:**
La previsualizacion OPL en la tabla convierte el selector en un canal pedagogico. El usuario aprende la gramatica OPM al leer la traduccion natural de cada opcion. Es un diferencial fuerte de OPM como lenguaje bimodal. La SSOT OPL-ES define las plantillas canonicas [OPL-ES T1..T3, TS1..TS5].

**Criterios de aceptacion:**
- **Dado** que la tabla de enlaces esta abierta para O→P, **cuando** miro las filas, **entonces** cada tipo muestra su oracion OPL-ES. Ej: para Instrumento con origen=**Conductor** y destino=*Rescatar*, se muestra `**Conductor** requiere *Rescatar*.` [OPL-ES T5: Instrumento]
- **Dado** que cambio el subtipo (ej. de Instrumento a Instrumento con Condicion), **cuando** actualizo el selector, **entonces** la previsualizacion OPL-ES se actualiza en vivo.
- **Dado** que cambio el modificador a `NOT`, **cuando** actualizo el selector, **entonces** la previsualizacion OPL-ES refleja la negacion.

**Reglas y restricciones:**
- La OPL-ES de previsualizacion debe ser identica a la que el panel OPL-ES emitira al confirmar.
- Usar plantillas canonicas OPL-ES: Objeto en **negrita**, Proceso en *cursiva*, Estado en `monoespaciado`. [OPL-ES §1.7]
- Verbos canonicos: `consume`, `genera`, `afecta`, `maneja`, `requiere`, `invoca`. [OPL-ES §2]

**Dependencias:**
- Bloqueada por: HU-10.008.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES T1..T3] enlaces transformadores basicos; [OPL-ES §2] vocabulario de verbos.
- Fuente OPCloud: §3.3, §5.2.
- Clase de afirmacion: observado + confirmado.
- Etiqueta: `opcloud-ui`.

**Prioridad:** M1 (valor pedagogico alto, no bloquea kernel).
**Tamano:** S.
**Etiquetas:** [canvas, ui, opl-es, tabla-enlaces, previsualizacion, pedagogico, opcloud-ui].

---

### HU-10.010 — Filtrar Agente cuando objeto no es fisico

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario (regla OPM); V secundaria.
**Superficie UI:** modal-tabla-enlaces.
**Gesto canonico:** ninguno (filtrado automatico).

**Historia:**
> Como modelador experto, quiero que la tabla de enlaces oculte `Agente` cuando el objeto origen no tiene esencia fisica, respetando la regla OPM de que los agentes son fisicos.

**Contexto de negocio:**
La SSOT OPM [Glos 3.3] define Agente como "habilitador que es una persona o un grupo de personas". Por definicion, las personas son fisicas. Un objeto informacional no puede ser agente. Exponerlo como opcion violaria la gramatica.

**Criterios de aceptacion:**
- **Dado** que tengo un objeto `O` con `esencia=informacional` y un proceso `P`, **cuando** arrastro O→P y se abre la tabla, **entonces** `Agente` NO aparece como opcion.
- **Dado** que cambio `O.esencia` a `fisica`, **cuando** arrastro O→P de nuevo, **entonces** `Agente` SI aparece.
- **Dado** que estoy en un arrastre O→P, **cuando** evaluo la regla, **entonces** se aplica solo al origen del arrastre.

**Reglas y restricciones:**
- Regla dura SSOT: Agente ⊂ Habilitador ∧ Agente.origen.esencia = fisica. [Glos 3.3] [V-1]
- El filtrado ocurre en validador del kernel, no en UI.

**Dependencias:**
- Bloqueada por: HU-10.008, HU-10.013 (alternador esencia).

**Notas de evidencia:**
- Fuente normativa: [Glos 3.3] Agente; [Glos 3.17] Habilitador.
- Fuente OPCloud: §5.2.
- Clase de afirmacion: confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, enlaces, validacion, esencia, agente].

---

### HU-10.011 — Confirmar tipo de enlace y cerrar tabla

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K (crea enlace).
**Superficie UI:** modal-tabla-enlaces.
**Gesto canonico:** clic en fila.

**Historia:**
> Como modelador, quiero confirmar la eleccion del tipo de enlace con un clic en la fila para crear el enlace y cerrar la tabla en un solo gesto.

**Contexto de negocio:**
Cada fila de la tabla representa una eleccion atomica. La SSOT [V-61] define que todo enlace consiste de origen, destino, conector y opcionalmente etiqueta. Un clic confirma e inserta el enlace en el modelo; no hay paso intermedio.

**Criterios de aceptacion:**
- **Dado** que la tabla de enlaces esta abierta, **cuando** hago clic en una fila, **entonces** se crea un enlace con el tipo de esa fila, origen=A, destino=B, y la tabla se cierra.
- **Dado** que elegi un subtipo antes de confirmar, **cuando** hago clic, **entonces** el enlace persiste con el subtipo elegido.
- **Dado** que elegi `NOT` como modificador, **cuando** confirmo, **entonces** el enlace persiste con el modificador.
- **Dado** que cree el enlace, **cuando** consulto OPL-ES, **entonces** aparece la oracion correspondiente (coincide con la previsualizacion).
- **Dado** que cancelo con el boton `x`, **cuando** cierro la tabla, **entonces** NO se crea enlace.

**Reglas y restricciones:**
- La confirmacion es irreversible sin deshacer.
- Un solo clic, no requiere doble clic.

**Modelo de datos tocado:**
- `enlace.id` — UUID — persistente.
- `enlace.tipo` — enum OPM — persistente.
- `enlace.subtipo` — enum opcional — persistente.
- `enlace.modificador` — `"None" | "NOT"` — persistente.
- `enlace.origen` — ID de cosa — persistente.
- `enlace.destino` — ID de cosa — persistente.

**Dependencias:**
- Bloqueada por: HU-10.008, HU-10.009.

**Notas de evidencia:**
- Fuente normativa: [V-61] anatomia de enlace; [V-239] familias canonicas.
- Fuente OPCloud: §3.3; doc 11 §10.3.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [canvas, kernel, enlaces, creacion, tabla-enlaces].

---

### HU-10.012 — Cambiar afiliacion con alternador instantaneo

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V secundaria.
**Superficie UI:** barra-contextual (boton `Cambiar Afiliacion`).
**Gesto canonico:** clic unico.

**Historia:**
> Como modelador, quiero cambiar la afiliacion de una cosa con un solo clic para alternar entre sistemica y ambiental sin abrir dialogo.

**Contexto de negocio:**
La SSOT [V-1] define dos valores de afiliacion: sistemica (borde solido) y ambiental (borde discontinuo). La afiliacion ambiental marca la frontera del sistema [Glos 3.5]. Como solo tiene dos valores, un alternador es la afordance correcta; un dialogo seria sobre-ingenieria.

**Criterios de aceptacion:**
- **Dado** que tengo seleccionada una cosa con `afiliacion=sistemica`, **cuando** hago clic en `Cambiar Afiliacion`, **entonces** pasa a `ambiental` y el borde se renderiza discontinuo en `#70E483`. [JOYAS §1]
- **Dado** que `afiliacion=ambiental`, **cuando** hago clic de nuevo, **entonces** vuelve a `sistemica` con borde solido.
- **Dado** que hice el cambio, **cuando** consulto OPL-ES, **entonces** la oracion refleja la nueva afiliacion. [OPL-ES D3..D4]
- **Dado** que hice el cambio, **cuando** guardo y recargo, **entonces** el valor persiste.

**Reglas y restricciones:**
- Por defecto al crear: `sistemica`. [V-1]
- El alternador no requiere confirmacion.
- Render: discontinuo = ambiental, solido = sistemico. Color `#70E483`. [JOYAS §1]

**Modelo de datos tocado:**
- `cosa.afiliacion` — `"sistemica" | "ambiental"` — persistente.

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002.

**Integraciones:**
- Renderizador (estilo de borde).
- Panel OPL-ES.

**Notas de evidencia:**
- Fuente normativa: [V-1] valores por defecto y atributos de contorno; [Glos 3.5] Comportamiento/contexto.
- Fuente OPCloud: §3.4, §10.2. Frames: frame_00034.
- Evidencia visual: JOYAS §1 color `#70E483` para borde de objeto.
- Clase de afirmacion: confirmado por transcripcion + observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, afiliacion, barra-contextual, alternador].

---

### HU-10.013 — Cambiar esencia con alternador instantaneo

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V secundaria.
**Superficie UI:** barra-contextual (boton `Cambiar Esencia`).
**Gesto canonico:** clic unico.

**Historia:**
> Como modelador, quiero cambiar la esencia de una cosa con un solo clic para alternar entre informacional y fisica sin abrir dialogo.

**Contexto de negocio:**
La SSOT [V-1] define dos valores de esencia: informacional (sin sombra) y fisica (con sombreado canonico). El canal visual del sombreado es semantico [V-124]: su presencia o ausencia codifica esencia. Un alternador inmediato es la afordance correcta.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa con `esencia=informacional`, **cuando** hago clic en `Cambiar Esencia`, **entonces** pasa a `fisica` y el render agrega sombreado canonico (sombra gris desplazada abajo-derecha). [V-124] [JOYAS §2]
- **Dado** que `esencia=fisica`, **cuando** hago clic, **entonces** vuelve a `informacional` y la sombra desaparece.
- **Dado** que hice el cambio, **cuando** consulto OPL-ES, **entonces** la oracion refleja la nueva esencia. [OPL-ES D1..D2]

**Reglas y restricciones:**
- Por defecto al crear: `informacional`. [V-1]
- La sombra en el canon-diagrama DEBE corresponder exclusivamente a esencia fisica [V-124]. Sombras decorativas de UI no deben persistir en export.
- La esencia no puede perderse visualmente al refinar [V-125].

**Modelo de datos tocado:**
- `cosa.esencia` — `"informacional" | "fisica"` — persistente.

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002.

**Integraciones:**
- Renderizador (sombreado canonico).
- Panel OPL-ES.
- Validador (afecta filtrado de Agente — HU-10.010).

**Notas de evidencia:**
- Fuente normativa: [V-1] valores por defecto; [V-124] sombreado como canal semantico.
- Fuente OPCloud: §10.1. Transcripcion: "Y Processing is an informatical and systemic process → physical and systemic" en un clic.
- Evidencia visual: JOYAS §2 dimensiones; drop shadow en `decompiled/28258.js` [JOYAS §8].
- Clase de afirmacion: confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, esencia, barra-contextual, alternador].

---

### HU-10.014 — Ver distincion visual de esencia fisica

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** V.
**Superficie UI:** canvas-render.
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como modelador, quiero distinguir visualmente las cosas fisicas de las informacionales para leer el modelo de un vistazo.

**Contexto de negocio:**
La SSOT [V-124] establece que el sombreado canonico (sombra gris desplazada abajo-derecha) codifica esencia fisica. Sin esta distincion, el eje esencia queda invisible hasta leer el OPL-ES, rompiendo la promesa del diagrama como vista completa. Las ocho representaciones de cosa surgen del producto cartesiano Forma × Contorno × Profundidad [V-1].

**Criterios de aceptacion:**
- **Dado** que una cosa tiene `esencia=fisica`, **cuando** miro el canvas, **entonces** tiene sombreado canonico (sombra gris desplazada abajo-derecha). [V-124]
- **Dado** que una cosa tiene `esencia=informacional`, **cuando** miro el canvas, **entonces** tiene render plano sin sombra.
- **Dado** que cambio la esencia con el alternador, **cuando** ocurre el cambio, **entonces** el render se actualiza en vivo.
- **Dado** que una cosa fisica aparece en el canon-diagrama, **cuando** exporto, **entonces** la sombra persiste en el export. [V-124]

**Reglas y restricciones:**
- Sombreado canonico: sombra gris desplazada abajo-derecha. [V-124]
- La implementacion DEBE suprimir en export toda sombra decorativa de UI. [V-124]
- Tres origenes de sombra posibles: declaracion del modelador, estereotipo, preset de sesion. En export, los tres colapsan al mismo resultado: sombra si y solo si es fisica. [V-126]
- Reforzadores de canvas en edicion deben diferenciarse de la sombra semantica. [V-127]

**Dependencias:**
- Bloqueada por: HU-10.013.

**Notas de evidencia:**
- Fuente normativa: [V-124] a [V-127]; [V-1] ocho representaciones de cosa; [Glos 3.25] Informacional.
- Evidencia OPCloud: JOYAS §8 drop shadow de `decompiled/28258.js`.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [canvas, render, esencia, visual, sombreado].

---

### HU-10.015 — Ver distincion visual de afiliacion ambiental

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** V.
**Superficie UI:** canvas-render.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero ver las cosas ambientales con borde discontinuo para identificar el alcance del sistema de un vistazo.

**Contexto de negocio:**
La SSOT [V-1 §1.2] establece: contorno continuo = sistemico, discontinuo = ambiental. Esta distincion es crucial para mostrar la frontera del sistema — una de las decisiones mas importantes del modelador OPM. El color del borde es informativo, no normativo [V-63].

**Criterios de aceptacion:**
- **Dado** que una cosa tiene `afiliacion=ambiental`, **cuando** miro el canvas, **entonces** se renderiza con borde discontinuo. OPCloud usa `#70E483` para objetos y `#3BC3FF` para procesos. [JOYAS §1]
- **Dado** que una cosa tiene `afiliacion=sistemica`, **cuando** miro el canvas, **entonces** se renderiza con borde solido.
- **Dado** que cambio la afiliacion, **cuando** ocurre el alternador, **entonces** el render se actualiza en vivo.
- **Dado** que un objeto ambiental se refina, **cuando** aparece en OPD hijo, **entonces** mantiene contorno discontinuo. [V-71]

**Reglas y restricciones:**
- Continuo = sistemico, discontinuo = ambiental. [V-1 §1.2]
- El tipo de contorno persiste en todos los niveles de refinamiento. [V-71]
- El color es informativo, no normativo [V-63]; una implementacion puede usar otra paleta mientras la topologia sea clara.

**Dependencias:**
- Bloqueada por: HU-10.012.

**Notas de evidencia:**
- Fuente normativa: [V-1 §1.2]; [V-63] colores informativos; [V-71] persistencia de contorno en refinamiento.
- Fuente OPCloud: §10.2. Frames: frame_00034.
- Evidencia visual: JOYAS §1 colores.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [canvas, render, afiliacion, borde-discontinuo, visual].

---

### HU-10.016 — Ver eco OPL-ES al crear cosa

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L (lente OPL-ES).
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno (actualizacion automatica).

**Historia:**
> Como modelador novato, quiero ver la oracion OPL-ES apenas creo una cosa para aprender la gramatica OPM mientras modelo.

**Contexto de negocio:**
El eco OPL inmediato es el mecanismo pedagogico central de OPM como lenguaje bimodal. La SSOT establece que "todo modelo OPM individual se expresa en dos formas equivalentes: OPD y OPL-ES" [opm-iso-19450-es.md §Representacion bimodal]. Cada gesto en el canvas debe tener traduccion natural inmediata en OPL-ES.

**Criterios de aceptacion:**
- **Dado** que creo un proceso, **cuando** consulto el panel OPL-ES, **entonces** aparece: `*NombreProceso* es un proceso informacional y sistemico.` [OPL-ES D1..D4]
- **Dado** que creo un objeto, **cuando** consulto el panel OPL-ES, **entonces** aparece: `**NombreObjeto** es un objeto informacional y sistemico.` [OPL-ES D1..D4]
- **Dado** que cambio esencia o afiliacion, **cuando** el alternador ocurre, **entonces** la oracion OPL-ES se actualiza para reflejar el nuevo estado.
- **Dado** que elimino la cosa, **cuando** desaparece del canvas, **entonces** la oracion OPL-ES desaparece del panel.

**Reglas y restricciones:**
- Formato canonico: `<tipo> es un/a <esencia> y <afiliacion> <tipo-cosa>.` [OPL-ES D1..D4]
- Convenciones tipograficas: Objeto en **negrita**, Proceso en *cursiva*, Estado en `monoespaciado`. [OPL-ES §1.7]
- OPL-ES se regenera desde modelo, no por evento — invariante: sin cache intermedio.

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES D1..D4] propiedades genericas; [OPL-ES §1.7] convenciones tipograficas.
- Fuente OPCloud: §3.1 paso 5, §7.1.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, opl-es, lente, kernel, pedagogico].

---

### HU-10.017 — Ver cosa en biblioteca lateral

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** L.
**Superficie UI:** panel-biblioteca-lateral.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero ver cada cosa creada en un panel lateral para llevar un inventario visible del modelo.

**Contexto de negocio:**
OPCloud ofrece un panel `Draggable OPM Things` como vista derivada del modelo. Refuerza el principio "entidad unica, multiples apariencias": la biblioteca lista la entidad, no sus apariciones en cada OPD. No es requisito SSOT — es una afordance de navegacion que puede implementarse de forma diferente.

**Criterios de aceptacion:**
- **Dado** que creo una cosa, **cuando** consulto el panel biblioteca, **entonces** aparece una entrada con su nombre y tipo.
- **Dado** que renombro la cosa, **cuando** confirmo el nombre, **entonces** la entrada se actualiza.
- **Dado** que elimino la cosa del modelo, **cuando** confirmo la eliminacion, **entonces** la entrada desaparece.
- **Dado** que la cosa aparece en varios OPDs, **cuando** miro la biblioteca, **entonces** hay una sola entrada (no una por apariencia).

**Reglas y restricciones:**
- La biblioteca es vista derivada; no mantiene estado propio.
- Orden de la lista: insercion (pregunta abierta §11 fuente OPCloud).

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002.

**Notas de evidencia:**
- Fuente OPCloud: §2 inventario UI, §7.2.
- Clase de afirmacion: observado.
- Etiqueta: `opcloud-ui`.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, biblioteca-lateral, lente, opcloud-ui].

---

### HU-10.018 — Ver cosa en navegador OPD

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** L.
**Superficie UI:** navegador-opd (miniatura).
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero ver la miniatura del OPD actualizarse al crear cosas para orientarme en modelos grandes.

**Contexto de negocio:**
El navegador OPD es un mapa de contexto. En modelos grandes es la forma rapida de saber donde estas. Es una vista derivada — no es requisito SSOT. Puede diferirse o implementarse de forma distinta a OPCloud.

**Criterios de aceptacion:**
- **Dado** que creo o elimino una cosa, **cuando** ocurre el cambio, **entonces** la miniatura se actualiza (<500ms).
- **Dado** que muevo una cosa, **cuando** termina el arrastre, **entonces** la miniatura refleja la nueva posicion.

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002.

**Notas de evidencia:**
- Fuente OPCloud: §2, §7.3.
- Clase de afirmacion: observado.
- Etiqueta: `opcloud-ui`.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [canvas, ui, navegador, lente, opcloud-ui].

---

### HU-10.019 — Abrir menu contextual de cosa

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U.
**Superficie UI:** menu-contextual (junto a la seleccion).
**Gesto canonico:** clic en boton de menu.

**Historia:**
> Como modelador, quiero abrir un menu contextual con las acciones principales de la cosa seleccionada para acceder rapido sin moverme a la barra principal.

**Contexto de negocio:**
La necesidad de un menu contextual proximo a la seleccion es generica (no es especifica de OPCloud). OPCloud implementa un halo radial con clase `joint-halo pie type-element animate`. La implementacion puede divergir: el concepto "menu contextual con acciones frecuentes" es el requisito; el halo radial es una implementacion posible.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada, **cuando** aparece el boton de menu junto a la seleccion, **entonces** puedo hacer clic para abrirlo.
- **Dado** que abri el menu, **cuando** miro, **entonces** veo las acciones disponibles para el tipo de cosa (eliminar, descomponer, desplegar, traer conectados, agregar estado, editar alias).
- **Dado** que el menu esta abierto, **cuando** hago clic fuera, **entonces** se cierra sin accion.

**Reglas y restricciones:**
- Acciones disponibles dependen del tipo de cosa (objeto vs proceso).
- La implementacion visual puede divergir de OPCloud (no requiere halo radial especificamente).

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002.

**Notas de evidencia:**
- Fuente OPCloud: §11. Clases observadas: `joint-halo pie type-element animate`, `pie-toggle`.
- Clase de afirmacion: confirmado en sandbox.
- Etiqueta: `mixto` — la necesidad es generica, la implementacion es referencial.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, menu-contextual, mixto].

---

### HU-10.020 — Acceder acciones del menu contextual

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario; K (delega a comandos).
**Superficie UI:** menu-contextual.
**Gesto canonico:** clic en accion del menu.

**Historia:**
> Como modelador, quiero ejecutar desde el menu contextual las acciones de edicion frecuentes para construir y editar sin viajar a la barra.

**Contexto de negocio:**
Cada accion del menu es un atajo a comandos disponibles en otras vias (barra, atajos), concentrados junto a la seleccion. Acciones tipicas: eliminar, descomponer, desplegar, traer conectados, agregar estado, editar alias. La mayoria se delegan a otras epicias.

**Criterios de aceptacion:**
- **Dado** que el menu esta abierto sobre un objeto, **cuando** miro las opciones, **entonces** veo las acciones aplicables: eliminar, descomponer, desplegar, traer conectados, agregar estado, editar alias.
- **Dado** que hago clic en `eliminar`, **cuando** se ejecuta, **entonces** si la cosa aparece en un solo OPD se elimina directo; si aparece en varios, se abre dialogo de alcance (EPICA-1C).
- **Dado** que hago clic en `agregar estado` sobre un objeto, **cuando** se ejecuta, **entonces** se crean dos estados por defecto (`estado1`, `estado2`) consistente con "objeto con estados ≥ 2 estados" (EPICA-13).

**Reglas y restricciones:**
- Acciones disponibles difieren entre objeto y proceso.
- Cada accion abre sub-flujos documentados en otras epicias.

**Dependencias:**
- Bloqueada por: HU-10.019.
- Integra: EPICA-12, EPICA-13, EPICA-1B, EPICA-1C, EPICA-17.

**Notas de evidencia:**
- Fuente OPCloud: §11. Confirmado en sandbox.
- Clase de afirmacion: confirmado.
- Etiqueta: `mixto`.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, menu-contextual, integracion-epicas, mixto].

---

### HU-10.021 — Descomposicion de objeto en el mismo diagrama

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; V secundaria.
**Superficie UI:** barra-contextual-objeto.
**Gesto canonico:** clic en accion.

**Historia:**
> Como modelador experto, quiero usar descomposicion en el mismo diagrama para expandir un objeto y mostrar sus partes sin crear un OPD hijo, cuando la descomposicion es compacta.

**Contexto de negocio:**
OPCloud ofrece `Object In-Diagram In-Zooming` como variante de descomposicion que mantiene el detalle en el OPD actual. La SSOT define la descomposicion como refinamiento que "expone contenido interno de una cosa en un OPD hijo" [opm-iso-19450-es.md §Tabla de equivalencia]. Esta variante intra-diagrama no esta normada por la SSOT y es una extension de OPCloud.

**Criterios de aceptacion:**
- **Dado** que tengo un objeto seleccionado, **cuando** abro la barra contextual, **entonces** veo la opcion de descomposicion en diagrama.
- **Dado** que activo la opcion, **cuando** se ejecuta, **entonces** el objeto se expande visualmente mostrando partes en su interior.
- **Dado** que active la descomposicion en diagrama, **cuando** agrego partes, **entonces** se dibujan dentro del rectangulo padre.

**Reglas y restricciones:**
- Semantica exacta vs descomposicion clasica (OPD hijo): pregunta abierta (§12 fuente OPCloud).
- Efecto sobre el modelo (¿crea agregacion implicita?): a validar contra SSOT.

**Dependencias:**
- Bloqueada por: HU-10.001/002.
- Relaciona: EPICA-12 (descomposicion clasica).

**Notas de evidencia:**
- Fuente normativa: [opm-iso-19450-es.md §Tabla de equivalencia] descomposicion como OPD hijo. Esta variante no esta en la SSOT.
- Fuente OPCloud: §11 tabla + §12 preguntas abiertas.
- Clase de afirmacion: observado + abierto (semantica no confirmada contra SSOT).
- Etiqueta: `opcloud-ui`, `requires-clarification`.

**Prioridad:** C (no es requisito SSOT; requiere clarificacion semantica).
**Tamano:** M.
**Etiquetas:** [canvas, ui, descomposicion, opcloud-ui, requires-clarification].

---

### HU-10.022 — Ver indicador de modelo no guardado

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; P (indicador de persistencia).
**Superficie UI:** pestana-superior.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero ver un indicador de que el modelo no tiene identidad persistente para saber que mis cambios estan volatiles.

**Contexto de negocio:**
El estado de persistencia debe ser siempre visible. Un modelo sin guardar es vulnerable a perdida. OPCloud muestra `Model (Not Saved)` en la pestana. Es un indicador transitorio de UI que puede implementarse de diversas formas.

**Criterios de aceptacion:**
- **Dado** que abri un modelo nuevo, **cuando** miro la pestana, **entonces** muestra un indicador de "no guardado".
- **Dado** que guardo y asigno nombre, **cuando** cierra el dialogo, **entonces** la pestana muestra el nombre del modelo sin sufijo.

**Dependencias:**
- Relaciona: HU-10.001 (creacion inicial), EPICA-30 (guardar/cargar).

**Notas de evidencia:**
- Fuente OPCloud: §4.1.
- Clase de afirmacion: observado.
- Etiqueta: `opcloud-ui`.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [canvas, ui, pestana, persistencia-indicador, opcloud-ui].

---

## Preguntas abiertas derivadas

- **Q10.1**: Reglas exactas de `Descripcion` y donde reaparece (cf. HU-10.004). Marcada `requires-clarification`.
- **Q10.4**: Semantica de `set-computation` sobre un objeto. Delegada a EPICA-B1.
- **Q10.5**: Semantica exacta de descomposicion en el mismo diagrama vs descomposicion clasica (OPD hijo). Marcada `requires-clarification` en HU-10.021.

## Referencias cruzadas

- Fuente normativa: `opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`.
- Evidencia OPCloud: `JOYAS.md`, `sandbox-data/`, `assets/svg/`, `decompiled/`.
- Doc fuente original: `opcloud-reverse/10-canvas-creacion-cosas.md`.
- Epicas dependientes: EPICA-11, EPICA-12, EPICA-13, EPICA-1B, EPICA-1C, EPICA-17, EPICA-20, EPICA-50.
