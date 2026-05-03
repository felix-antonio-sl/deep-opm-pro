---
epica: "EPICA-C1"
titulo: "Runtime — External URL (HTTP/REST) como categoria ejecutable de procesos computacionales"
doc_fuente: "opcloud-reverse/c1-runtime-urls.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "W"
hu_emitidas: 26
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta epica cubre la categoria **External** del menu de proceso computacional OPCloud: la facultad de atar un proceso OPM a una invocacion **HTTP/REST** (`fetch(...)`) contra un punto de acceso externo durante la simulacion. Es una de las cinco pestanas (`Predefined | User Defined | External | ROS | MQTT`) introducidas en `b1-simulation-computational.md §3.2` y hermana de `c0-runtime-mqtt` y `c2-runtime-ros`, de las que se distingue porque **no requiere bridge websocket**: el `fetch` corre directo desde el sandbox.

El ejemplo canonico observado es **Country From Name Guessing System**: un objeto `API URL {api}` porta la URL literal (`https://api.nationalize.io`), un objeto `Name Input {userName}` porta la entrada del usuario, un proceso `External Function API Calling ` recibe ambos como instruments y produce un `JSON Result {c}` que un segundo proceso `Json Parsing ` reduce a `Guessed Country = US or IM or IE` — disyuncion literal.

Las HU se numeran en orden de aparicion del doc fuente. La prioridad predominante es **W** (won't-have en el ciclo actual del modelador core): la capa runtime cruza la frontera del modelador, depende de infra ejecutable (sandbox JS, sandbox de red, editor Active4D) y no entrega valor hasta que el modelador core haya cerrado kernel + simulacion conceptual + user-defined functions. Las HU S/M1 cubren solo la superficie **de modelado** (configurar el objeto punto de acceso, atar la URL, declarar parametros, conectar links con modificador `c`) que puede implementarse sin ejecutar nada.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-C1.001 | Activar categoria External en proceso computacional | IR | S | S | opcloud-ui | — |
| HU-C1.002 | Marcar proceso External con sufijo `()` en nombre | IR | M1 | XS | opcloud-ui | — |
| HU-C1.003 | Portar URL literal en objeto string-valued | IR | M1 | M | mixto | [Glos 3.39] |
| HU-C1.004 | Asignar alias al objeto-punto-de-acceso como binding runtime | IR | M1 | S | mixto | — |
| HU-C1.005 | Ver linea OPL del objeto-punto-de-acceso con URL literal | IR | M1 | XS | mixto | [OPL-ES §1.7] |
| HU-C1.006 | Abrir mini-editor URL/Parameters inline sobre canvas | IR | S | M | opcloud-ui | — |
| HU-C1.007 | Configurar campo URL con alias del objeto-punto-de-acceso | IR | S | S | opcloud-ui | — |
| HU-C1.008 | Declarar pares query-key / alias en campo Parameters | IR | S | S | opcloud-ui | — |
| HU-C1.009 | Confirmar mini-editor con Update y persistir configuracion | IR | S | XS | opcloud-ui | — |
| HU-C1.010 | Conectar objeto-punto-de-acceso al proceso External como Instrument | IR | S | S | opm-semantica | [V-239] [V-240] |
| HU-C1.011 | Aplicar modificador `c` al habilitador condicional del refinable padre | IR | S | M | opm-semantica | [V-239] [V-61] |
| HU-C1.012 | Separar fetch (External) de parse (code inline) en cadena de procesos | IR | C | M | mixto | — |
| HU-C1.013 | Abrir editor Active4D para cuerpo JS del proceso External | IR | W | L | opcloud-ui | — |
| HU-C1.014 | Preservar separador runtime `/*-------- Don't edit ... */` inmutable | IR | W | S | opcloud-ui | — |
| HU-C1.015 | Inyectar `aliasArr` auto-generado pre-ejecucion | IR | W | M | opcloud-ui | — |
| HU-C1.016 | Ejecutar `fetch` HTTP y recibir payload JSON en objeto intermedio | IR | W | L | opcloud-ui | — |
| HU-C1.017 | Expandir rectangulo-valor de JSON Result con payload completo | IR | W | M | opcloud-ui | — |
| HU-C1.018 | Renderizar valor final como disyuncion literal `A or B or C` | IR | W | S | opcloud-ui | — |
| HU-C1.019 | Sincronizar OPL pane con valores runtime durante ejecucion | IR | W | M | mixto | [OPL-ES §1.7] |
| HU-C1.020 | Marcar estado activo con punto verde transitorio durante run | IR | W | S | opcloud-ui | — |
| HU-C1.021 | Preservar URL literal como configuracion no sorteable | IR | W | XS | opcloud-ui | — |
| HU-C1.022 | Advertir punto de acceso inalcanzable con feedback visual al autor | IR | C | M | opcloud-ui | — |
| HU-C1.023 | Auditar modelo con verificacion de enlaces por lote de puntos de acceso declarados | IR | C | L | opcloud-ui | — |
| HU-C1.024 | Registrar historia de respuestas HTTP por run de simulacion | IR | C | L | opcloud-ui | — |
| HU-C1.025 | Modelar autenticacion HTTP (headers, Authorization) | IR | W | M | opcloud-ui | — |
| HU-C1.026 | Reabrir mini-editor URL/Parameters para edicion posterior | IR | S | S | opcloud-ui | — |

Total: **26 historias de usuario** (4 opm-semantica, 16 opcloud-ui, 6 mixto).

## Historias de usuario

### HU-C1.001 — Activar categoria External en proceso computacional

**Actor primario:** IR (ingeniero de runtime).
**Actores secundarios:** IS (ingeniero de simulacion), ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; U (barra de pestanas) secundaria.
**Superficie UI:** barra contextual bajo elipse del proceso + tooltip `Computation` sobre halo.
**Gesto canonico:** clic en pestana `External` tras convertir proceso en computational.

**Historia:**
> Como ingeniero de runtime, quiero seleccionar `External` entre las cinco pestanas de categoria de un proceso computacional para atarlo a una invocacion HTTP/REST.

**Contexto de negocio:**
Las cinco pestanas (`Predefined | User Defined | External | ROS | MQTT`) particionan el universo de procesos ejecutables. Elegir `External` compromete al proceso a una semantica fetch-HTTP, distinta de broker pub/sub (MQTT), middleware de robotica (ROS), funcion local (User Defined) o tabla estatica (Predefined). La eleccion es parte del kernel del proceso: define que configuracion se exigira, que render tendra, y que runtime lo ejecutara.

**Criterios de aceptacion:**
- **Dado** un proceso computacional seleccionado, **cuando** abro la barra de pestanas de categoria, **entonces** veo cinco opciones `Predefined | User Defined | External | ROS | MQTT`.
- **Dado** que selecciono `External`, **cuando** se confirma, **entonces** el proceso persiste con `category="External"` y el resto de su configuracion (parametros, punto de acceso, codigo) queda disponible.
- **Dado** que selecciono `External`, **cuando** se renderiza, **entonces** el nombre del proceso muta para agregar el sufijo `()` (ver HU-C1.002).
- **Dado** que el proceso ya tenia `category="Predefined"` con una tabla, **cuando** cambio a `External`, **entonces** la tabla previa se preserva en el modelo como configuracion inactiva (**pregunta abierta** — verificar si OPCloud descarta la otra config).

**Reglas y restricciones:**
- Solo procesos computacionales tienen categoria — un proceso OPM "comun" no la expone.
- El default observado es `Predefined`.
- Cambiar de categoria no elimina los links del proceso; solo la configuracion de ejecucion.

**Modelo de datos tocado:**
- `process.computational` — bool — persistente.
- `process.category` — `"Predefined" | "UserDefined" | "External" | "ROS" | "MQTT"` — persistente.

**Dependencias:**
- Bloqueada por: HU de EPICA-B1 (`computational-process` tab, herencia de b1 §3.2).
- Bloquea a: HU-C1.002 hasta HU-C1.026.

**Integraciones:**
- Render: sufijo `()` se emite en el nombre.
- Validador: cambiar de categoria puede invalidar configuracion previa.

**Notas de evidencia:**
- Fuente: `opcloud-reverse/c1-runtime-urls.md` §2.1.
- Frame: frame 60 (tooltip `Computation`).
- Transcripcion: "las convenciones visuales genericas de simulacion computacional ... se dan por ya descritas en b1".
- Clase de afirmacion: observado (tooltip) + inferido (set completo de pestanas).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [runtime, url, category-tab, computational-process].

---

### HU-C1.002 — Marcar proceso External con sufijo `()` en nombre

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; K (propiedad del proceso) secundaria.
**Superficie UI:** canvas-render (elipse del proceso).
**Gesto canonico:** ninguno (render declarativo post-HU-C1.001).

**Historia:**
> Como ingeniero de runtime, quiero que el nombre del proceso External se renderice con el sufijo `()` para identificar de un vistazo que tiene cuerpo ejecutable.

**Contexto de negocio:**
Los parentesis `()` son **marca sintactica de "proceso con cuerpo editable"**, no contenedor de parametros literales. Los parametros reales viven en el widget URL/Parameters (HU-C1.008) y en el `aliasArr` del editor Active4D (HU-C1.015). La convencion contradice la lectura intuitiva de `nombre(args)` en lenguajes de programacion — esto debe quedar explicito en la SSOT visual.

**Criterios de aceptacion:**
- **Dado** un proceso con `category="External"` y nombre `External Function API Calling`, **cuando** se renderiza, **entonces** el label muestra `External Function API Calling ()`.
- **Dado** que cambio la categoria a `Predefined`, **cuando** se re-renderiza, **entonces** el sufijo `()` desaparece.
- **Dado** que el proceso tiene `category="UserDefined"` o `"ROS"` o `"MQTT"`, **cuando** se renderiza, **entonces** el sufijo `()` tambien aparece (es comun a las 4 categorias ejecutables).

**Reglas y restricciones:**
- El sufijo es **puramente visual**; no se persiste en `process.name`.
- `Predefined` es la unica categoria **sin** `()` (no ejecutable inline, usa tabla).

**Modelo de datos tocado:**
- Ninguno directo; derivado de `process.category` para render.

**Dependencias:**
- Bloqueada por: HU-C1.001.

**Integraciones:**
- Renderer JointJS (factory de label del proceso).
- OPL pane (el sufijo no aparece en OPL, solo en canvas).

**Notas de evidencia:**
- Fuente: §3.3, §9.
- Frames: frame 55, 60, 65 (`External Function API Calling ()`).
- Transcripcion: "los parentesis son marca sintactica de 'hay un cuerpo editable', no contenedor de parametros".
- Clase de afirmacion: confirmado por frames.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [runtime, url, render, signature].

---

### HU-C1.003 — Portar URL literal en objeto string-valued

**Actor primario:** IR.
**Actores secundarios:** IS, ME.
**Tipo:** mixto.
**Nivel categorico:** K primario; V secundario.
**Superficie UI:** canvas-render (rectangulo-valor del objeto).
**Gesto canonico:** escribir URL en rectangulo-valor del objeto computational.

**Historia:**
> Como ingeniero de runtime, quiero colocar la URL literal (`https://api.nationalize.io`) en el rectangulo-valor de un objeto computacional para tener un lugar canonico del punto de acceso que el resto del modelo pueda referir.

**Contexto de negocio:**
El punto de acceso **no vive en el proceso External** sino en un objeto aparte (`API URL`). Esto aplica el principio OPM "una cosa es una cosa": la URL es un dato del dominio, no un atributo interno del proceso. El rectangulo-valor del objeto acepta string libre y lo renderiza con la misma tipografia oliva que un estado discreto. Cuando multiples procesos necesitan el mismo punto de acceso, lo leen del mismo objeto.

**Criterios de aceptacion:**
- **Dado** un objeto computational sin unidad, **cuando** escribo `https://api.nationalize.io` en su rectangulo-valor, **entonces** el valor persiste como string literal en `object.valueState.displayText`.
- **Dado** un objeto con valor URL, **cuando** se renderiza, **entonces** el rectangulo-valor muestra la URL completa con la misma tipografia oliva de los estados discretos.
- **Dado** un objeto con valor URL, **cuando** consulto OPL, **entonces** aparece la linea `<Nombre>, <alias>, is <URL>.` (ver HU-C1.005).
- **Dado** que el objeto tiene unidad entre corchetes `[unit]`, **cuando** se renderiza: **regla** — los objetos portadores de URL NO tienen unidad (la convencion observada es rectangulo-valor puro sin corchetes de unidad).

**Reglas y restricciones:**
- El rectangulo-valor de string no tiene politica de truncado observada; altura y ancho se expanden al contenido (ver HU-C1.017 para caso extremo).
- La URL es cadena libre — validar formato de URL es **pregunta abierta**.

**Modelo de datos tocado:**
- `object.computational` — bool — persistente.
- `object.valueState.displayText` — string — persistente.
- `object.valueState.kind` — `"string" | "numeric" | "discrete-states"` — persistente (inferido).

**Dependencias:**
- Bloqueada por: HU de EPICA-B1 (objeto computational basico).
- Bloquea a: HU-C1.004, HU-C1.007.

**Integraciones:**
- OPL pane.
- Renderer del rectangulo-valor.

**Notas de evidencia:**
- Fuente: §3.1.
- Frames: frame 10, 20 (`API URL {api}` con `https://api.nationalize.io` en rectangulo-valor).
- Clase de afirmacion: observado + inferido (para objetos string-valued la celda acepta texto libre).

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [runtime, url, string-valued, kernel, render].

---

### HU-C1.004 — Asignar alias al objeto-punto-de-acceso como binding runtime

**Actor primario:** IR.
**Tipo:** mixto.
**Nivel categorico:** K primario; V secundario.
**Superficie UI:** canvas-render (label del objeto con `{alias}`).
**Gesto canonico:** asignar alias via toolbar contextual `Edit Alias` (delegado a EPICA-17).

**Historia:**
> Como ingeniero de runtime, quiero asignar el alias `api` al objeto-punto-de-acceso para que el codigo runtime pueda leer su valor por nombre corto desde `aliasArr`.

**Contexto de negocio:**
El alias `{alias}` tras el nombre del objeto es el **contrato canvas↔codigo**. Cada alias visible en el canvas se exporta automaticamente al `aliasArr` del editor Active4D antes de cada ejecucion, permitiendo que el codigo JS lea `api`, `userName`, `c` como variables. Sin alias, el objeto no es direccionable desde codigo — solo desde el modelo.

**Criterios de aceptacion:**
- **Dado** un objeto computational con URL, **cuando** le asigno alias `api`, **entonces** el render del label muestra `API URL {api}`.
- **Dado** un objeto con nombre de dos palabras y alias asignado, **cuando** se renderiza con ancho limitado, **entonces** el salto de linea se da entre palabras y las llaves van tras la segunda palabra (`Name Input\n{userName}` en frame 20).
- **Dado** un objeto con alias, **cuando** guardo el modelo, **entonces** `object.alias` persiste.
- **Dado** que uso el mismo alias `api` en dos objetos distintos: **regla** — **pregunta abierta** si OPCloud previene la colision (no observado).

**Reglas y restricciones:**
- Formato del alias: string corto, tipicamente lowercase, sin espacios.
- Las llaves `{}` son literales en render; no se escriben en el nombre.
- Alias `c` es usado en `JSON Result {c}` — no es reservado.

**Modelo de datos tocado:**
- `object.alias` — string nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-C1.003, HU de EPICA-17 (edit alias).

**Integraciones:**
- Renderer del label.
- OPL pane (incluye alias en plantilla `<Nombre>, <alias>, is <valor>.`).
- `aliasArr` del editor Active4D (HU-C1.015).

**Notas de evidencia:**
- Fuente: §3.1, §9.
- Frames: frame 10, 20.
- Clase de afirmacion: observado + confirmado por `aliasArr` en frame 45.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [runtime, url, alias, binding, computational].

---

### HU-C1.005 — Ver linea OPL del objeto-punto-de-acceso con URL literal

**Actor primario:** IR.
**Tipo:** mixto.
**Nivel categorico:** L (lente OPL).
**Superficie UI:** opl-pane.
**Gesto canonico:** ninguno (actualizacion automatica).

**Historia:**
> Como ingeniero de runtime, quiero ver la oracion OPL `API URL, api, is https://api.nationalize.io.` para confirmar que el punto de acceso esta correctamente declarado en el modelo.

**Contexto de negocio:**
El OPL canonico de un objeto string-valued con alias usa la plantilla de cuatro campos heredada de `b1 §7`: `<Nombre>, <alias>, is <valor>.` — sin unidad final. La linea OPL es el canal de validacion inmediato: si la URL tipeada tiene typo, se vera literal en OPL antes de ejecutar.

**Criterios de aceptacion:**
- **Dado** un objeto `API URL {api}` con valor `https://api.nationalize.io`, **cuando** consulto OPL, **entonces** aparece `API URL, api, is https://api.nationalize.io.`
- **Dado** que cambio la URL, **cuando** confirmo el cambio, **entonces** la linea OPL se actualiza al nuevo valor.
- **Dado** que el objeto NO tiene alias, **cuando** consulto OPL, **entonces** la plantilla cambia a la de tres campos (`<Nombre> is <valor>.`) — comportamiento heredado de b1.

**Reglas y restricciones:**
- OPL regenera desde modelo, sin cache intermedio.
- El valor se escribe literal; no hay truncado para URLs largas.

**Modelo de datos tocado:**
- Ninguno directo; lee `object.name`, `object.alias`, `object.valueState.displayText`.

**Dependencias:**
- Bloqueada por: HU-C1.003, HU-C1.004.

**Integraciones:**
- Motor OPL.

**Notas de evidencia:**
- Fuente: §3.1.
- Frame: frame 10 linea 3.
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [runtime, url, opl, lente].

---

### HU-C1.006 — Abrir mini-editor URL/Parameters inline sobre canvas

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario.
**Superficie UI:** canvas (widget flotante no-modal).
**Gesto canonico:** **pregunta abierta** — posiblemente doble clic sobre el proceso External, posiblemente entrada desde halo (frames 55-60 no capturan el gesto de apertura).

**Historia:**
> Como ingeniero de runtime, quiero abrir un mini-editor inline con campos URL / Parameters / Update encima del proceso External para configurar el punto de acceso sin perder el contexto del canvas.

**Contexto de negocio:**
Este widget es la **primera afordance inline no-modal** del corpus OPCloud: se ancla al objeto destino, no atenua el canvas, se puede ver el OPD alrededor. Otros popups (Auto Format, Edit Alias, Select link kind) son modales sobre overlay. El diseno prioriza la continuidad cognitiva del modelador sobre la captura total de atencion.

**Criterios de aceptacion:**
- **Dado** un proceso External seleccionado, **cuando** activo la edicion del punto de acceso, **entonces** aparece un widget con tres campos (`URL`, `Parameters`, boton `Update`) anclado al objeto receptor del punto de acceso.
- **Dado** que el widget esta abierto, **cuando** miro el canvas, **entonces** el resto del OPD es visible (no hay overlay velado).
- **Dado** que el widget esta abierto, **cuando** hago clic fuera del widget: **regla** — **pregunta abierta** si el widget se cierra o permanece (no observado).
- **Dado** que el widget esta abierto, **cuando** hago clic en `Update`, **entonces** el widget se cierra y la configuracion persiste.

**Reglas y restricciones:**
- El widget se centra sobre el objeto receptor del punto de acceso (`JSON Result {c}` en el ejemplo).
- No es un modal — no hay backdrop, no hay ESC global que lo cierre (pregunta abierta).
- La posicion es fija respecto al objeto, no arrastrable (inferido).

**Modelo de datos tocado:**
- Ninguno durante la apertura; solo persiste al confirmar (HU-C1.009).

**Dependencias:**
- Bloqueada por: HU-C1.001.
- Bloquea a: HU-C1.007, HU-C1.008, HU-C1.009.

**Integraciones:**
- Renderer del canvas (el widget se dibuja sobre el layer del canvas).

**Notas de evidencia:**
- Fuente: §2.2.
- Frame: frame 65.
- Transcripcion: "no es un modal: el canvas no se atenua, no hay overlay velado".
- Clase de afirmacion: observado (widget) + abierto (gesto de apertura).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [runtime, url, widget-inline, non-modal].

---

### HU-C1.007 — Configurar campo URL con alias del objeto-punto-de-acceso

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario (binding); U secundario.
**Superficie UI:** mini-editor URL/Parameters.
**Gesto canonico:** escritura en campo `URL` del widget.

**Historia:**
> Como ingeniero de runtime, quiero escribir el alias (`api`) en el campo `URL` del widget para que el proceso External lea la URL literal desde el objeto portador por referencia.

**Contexto de negocio:**
El campo `URL` no contiene la URL en si — contiene **el alias** del objeto que la porta. Esta indireccion es clave: si la URL cambia (p.ej. sandbox → produccion), se edita en un solo lugar (el rectangulo-valor del objeto `API URL`) y todos los procesos que la refieran por alias leen el nuevo valor. El alias es el vinculo de lectura del punto de acceso.

**Criterios de aceptacion:**
- **Dado** el widget URL/Parameters abierto, **cuando** escribo `api` en el campo `URL`, **entonces** el proceso External se configura para leer el valor del objeto con alias `api`.
- **Dado** que escribo un alias que NO existe en el canvas, **cuando** confirmo: **regla** — **pregunta abierta** si se rechaza, se acepta con warning, o se acepta silenciosamente hasta runtime.
- **Dado** que escribo una URL literal (no alias) en el campo: **regla** — **pregunta abierta** si OPCloud resuelve ambos casos o solo alias.

**Reglas y restricciones:**
- El campo es texto libre; no hay autocompletado observado.
- La convencion narrada es alias, no URL literal.

**Modelo de datos tocado:**
- `process.endpoint.urlAlias` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-C1.006, HU-C1.004 (alias del objeto existir primero).

**Integraciones:**
- Resolucion runtime: `aliasArr` mapea `api → "https://..."`.

**Notas de evidencia:**
- Fuente: §2.2, §3.3.
- Frame: frame 65 (`URL=api`).
- Transcripcion: "el valor del campo URL es un alias, no la URL en si".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [runtime, url, widget-inline, alias].

---

### HU-C1.008 — Declarar pares query-key / alias en campo Parameters

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** mini-editor URL/Parameters.
**Gesto canonico:** escritura en campo `Parameters`.

**Historia:**
> Como ingeniero de runtime, quiero declarar `(name, userName)` en el campo Parameters para mapear la query-key HTTP `name` al alias del objeto OPM `userName` que la puebla.

**Contexto de negocio:**
Los parentesis externos del campo `Parameters` son **literales** — la lista contiene pares `(queryKey, alias)` separados por coma. El orden de lectura sugerido: primer item es la llave del query-string HTTP (lo que el servidor espera), segundo item es el alias del objeto OPM que aporta el valor. La semantica exacta (siempre pares, siempre 2, admite 3+, POST body vs query-string) es inferida y tiene preguntas abiertas.

**Criterios de aceptacion:**
- **Dado** el widget abierto con URL configurada, **cuando** escribo `(name, userName)` en Parameters, **entonces** al ejecutar `fetch` se emite `?name=<valor de userName>`.
- **Dado** el campo Parameters vacio, **cuando** ejecuto, **entonces** el fetch se emite sin query-string.
- **Dado** que escribo `(a, b, c, d)`: **regla** — **pregunta abierta** si se interpretan como 2 pares (a,b) + (c,d) o como 4 argumentos.
- **Dado** que quiero POST body en vez de query-string: **regla** — **pregunta abierta** si hay sintaxis distinta (no observada).

**Reglas y restricciones:**
- Los parentesis son literales; escribir `name, userName` sin parentesis — comportamiento abierto.
- Sin escape de caracteres especiales observado.

**Modelo de datos tocado:**
- `process.endpoint.parameters` — `Array<{queryKey: string, alias: string}>` — persistente (estructura inferida).

**Dependencias:**
- Bloqueada por: HU-C1.006.

**Integraciones:**
- Runtime `fetch` (HU-C1.016).

**Notas de evidencia:**
- Fuente: §2.2, §3.3.
- Frame: frame 65 (`Parameters=(name, userName)`).
- Transcripcion: "los parentesis externos del campo Parameters son literales; la lista contiene nombres de parametro que la llamada HTTP insertara como query-string o como parametros POST".
- Clase de afirmacion: observado + inferido (semantica exacta).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [runtime, url, widget-inline, parameters].

---

### HU-C1.009 — Confirmar mini-editor con Update y persistir configuracion

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** P primario (persiste); U secundario.
**Superficie UI:** boton `Update` del widget.
**Gesto canonico:** clic en `Update`.

**Historia:**
> Como ingeniero de runtime, quiero confirmar la configuracion del widget con `Update` para persistir URL y Parameters en el modelo y cerrar el widget.

**Contexto de negocio:**
La confirmacion es atomica: ambos campos (URL y Parameters) se validan y persisten juntos, o se descartan juntos (si se cancela con clic fuera — pregunta abierta). No hay draft intermedio observable.

**Criterios de aceptacion:**
- **Dado** el widget abierto con URL y Parameters llenos, **cuando** hago clic en `Update`, **entonces** `process.endpoint.urlAlias` y `process.endpoint.parameters` persisten y el widget se cierra.
- **Dado** que confirmo con `Update` sin URL: **regla** — **pregunta abierta** si se rechaza o se permite (inferencia: presumiblemente se permite y la ejecucion fallara, §4 fuente).
- **Dado** que confirme, **cuando** reabro el widget (HU-C1.026), **entonces** los campos muestran los valores persistidos.

**Reglas y restricciones:**
- `Update` es el unico camino de confirmacion observado.
- No hay `Cancel` observado en el widget (pregunta abierta: ¿como se descarta?).

**Modelo de datos tocado:**
- `process.endpoint.urlAlias` — string — persistente.
- `process.endpoint.parameters` — array — persistente.

**Dependencias:**
- Bloqueada por: HU-C1.006, HU-C1.007, HU-C1.008.

**Integraciones:**
- Persistencia del modelo (autosave o save explicito).

**Notas de evidencia:**
- Fuente: §2.2.
- Frame: frame 65.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [runtime, url, widget-inline, persistencia].

---

### HU-C1.010 — Conectar objeto-punto-de-acceso al proceso External como Instrument

**Actor primario:** IR.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V secundario.
**Superficie UI:** canvas-render (link de Instrument).
**Gesto canonico:** drag del borde del objeto `API URL {api}` hacia el proceso External.

**Historia:**
> Como ingeniero de runtime, quiero conectar el objeto portador de URL al proceso External con un link Instrument para que el modelo OPM haga explicito que la URL es un recurso usado por el proceso durante su ejecucion.

**Contexto de negocio:**
El link Instrument (circulo blanco abierto en punto de acceso) es el tipo OPM correcto: el proceso External **usa** la URL (no la consume ni la produce). La relacion debe aparecer en el OPD aunque el mini-editor tambien la declare internamente — redundancia deliberada: el OPD es el contrato legible, el widget es la configuracion ejecutable. Ambos deben estar alineados (ver HU-C1.011 para consistencia).

**Criterios de aceptacion:**
- **Dado** un objeto `API URL {api}` y un proceso External, **cuando** creo un link Instrument del objeto al proceso, **entonces** el link se renderiza con circulo blanco abierto en el punto de acceso del proceso.
- **Dado** un objeto `Name Input {userName}`, **cuando** lo conecto como Instrument al mismo proceso External, **entonces** ambos inputs quedan visibles en el OPD.
- **Dado** que declaro un parametro en Parameters (`userName`) pero NO conecto el objeto como Instrument: **regla** — **pregunta abierta** si OPCloud detecta la inconsistencia. Observacion: no hay warning visible.

**Reglas y restricciones:**
- El link Instrument sigue las reglas OPM generales (EPICA-10, EPICA-15).
- El objeto portador de URL puede ser Instrument de multiples procesos External.

**Modelo de datos tocado:**
- `link.type` — `"Instrument"` — persistente.
- `link.source` — id del objeto — persistente.
- `link.target` — id del proceso — persistente.

**Dependencias:**
- Bloqueada por: HU-C1.003, HU-C1.001, HU de EPICA-10 (creacion de links).

**Integraciones:**
- Validador de links.
- OPL pane.

**Notas de evidencia:**
- Fuente: §3.4.
- Frames: frame 55, 60.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [runtime, url, links, instrument].

---

### HU-C1.011 — Aplicar modificador `c` al habilitador condicional del refinable padre

**Actor primario:** IR.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V secundario.
**Superficie UI:** canvas-render (modificador `c` en punto de acceso de link).
**Gesto canonico:** aplicar modificador `c` al link condicional del proceso padre.

**Historia:**
> Como ingeniero de runtime, quiero marcar con `c` el habilitador condicional del proceso refinable padre para que la rama External solo se ejecute cuando el estado origen esta activo.

**Contexto de negocio:**
El modificador `c` (condition) aparece en el proceso **padre** refinable (`Country Name By External Function Guessing`), no en el proceso External interno. Semanticamente significa: "ejecuta esta rama refinable si y solo si el estado origen esta activo". La `c` se renderiza junto al circulo blanco de anclaje del lado del proceso (punto de acceso), no al origen — convencion que distingue a OPCloud de otras notaciones OPM.

**Criterios de aceptacion:**
- **Dado** un estado `Selected Lookup Method.external` y un proceso refinable padre `Country Name By External Function Guessing`, **cuando** conecto el estado al proceso con link Condition, **entonces** el modificador `c` se renderiza junto al circulo blanco del punto de acceso (lado del proceso).
- **Dado** un link con modificador `c`, **cuando** se ejecuta el modelo, **entonces** la rama solo corre si el estado origen esta activo.
- **Dado** que cambio el tipo de link de Condition a Instrument, **cuando** se re-renderiza, **entonces** el `c` desaparece (el modificador es especifico de Condition).
- **Dado** el render del `c`, **cuando** miro cerca, **entonces** es minuscula cursiva, tamano igual al texto secundario del canvas.

**Reglas y restricciones:**
- Posicion del `c`: destino (punto de acceso del proceso), no origen.
- El `c` es consecuencia visual del tipo `Condition`, no independiente.
- Aplica al proceso **refinable padre**, no al proceso External interno (el External recibe sus instruments sin `c`).

**Modelo de datos tocado:**
- `link.modifier` — `"c" | null` — persistente.
- `link.type` — `"Condition"` — persistente.

**Dependencias:**
- Bloqueada por: HU de EPICA-15 (enlaces avanzados), HU de EPICA-13 (estados).

**Integraciones:**
- Validador: `c` solo en links de tipo Condition.
- Renderer: posicion de glyph.

**Notas de evidencia:**
- Fuente: §3.4, §9.
- Frames: frame 40, 55, 60.
- Transcripcion: "ejecuta la rama External si y solo si el metodo seleccionado esta en estado `external`".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [runtime, url, links, condition, modificador-c].

---

### HU-C1.012 — Separar fetch (External) de parse (code inline) en cadena de procesos

**Actor primario:** IR.
**Actores secundarios:** AD (autor de dominio).
**Tipo:** mixto.
**Nivel categorico:** D (patron de modelado); K secundario.
**Superficie UI:** canvas (cadena visible).
**Gesto canonico:** ninguno especifico (patron de modelado).

**Historia:**
> Como ingeniero de runtime, quiero separar el proceso `External Function API Calling` del proceso `Json Parsing` para hacer explicita la pieza JSON como objeto intermedio del OPD.

**Contexto de negocio:**
El patron canonico observado es **fetch + parse** como dos procesos encadenados con un objeto intermedio `JSON Result {c}`. Podria coalescerse en un unico proceso External con el parseo dentro del mismo `fetch(...).then(r => r.json).then(parse)`, pero separar hace el JSON visible en OPL, permite debug, permite reusar el parser y respeta el axioma OPM de "un proceso = un verbo semantico". Es **patron recomendado**, no obligacion.

**Criterios de aceptacion:**
- **Dado** el canvas con `External Function API Calling`, **cuando** miro el OPD, **entonces** hay un objeto intermedio `JSON Result {c}` que recibe Result del External y es Instrument del `Json Parsing` siguiente.
- **Dado** el proceso `Json Parsing`, **cuando** miro su categoria, **entonces** es `User Defined` (tipicamente) con codigo inline — no `External`.
- **Dado** la cadena, **cuando** consulto OPL, **entonces** aparecen lineas OPL separadas para cada proceso y para el objeto intermedio.
- **Dado** que decido coalescer en un unico External, **cuando** elimino el parse intermedio, **entonces** el modelo sigue ejecutando pero pierde la visibilidad del JSON (consecuencia de diseno).

**Reglas y restricciones:**
- Patron recomendado, no enforced por OPCloud.
- El objeto intermedio debe ser string-valued para alojar el payload.

**Modelo de datos tocado:**
- Ninguno especifico; es composicion de procesos/objetos/links ya definidos.

**Dependencias:**
- Bloqueada por: HU-C1.001 a HU-C1.011, HU de EPICA-B2 (User Defined).

**Integraciones:**
- Patron documentable en `docs/design/patron-dominios-funtor.md` (delegado).

**Notas de evidencia:**
- Fuente: §3.5.
- Frames: frame 55, 60.
- Transcripcion: "la separacion fetch (External) + parse (code inline) es patron recomendado, no obligacion".
- Clase de afirmacion: confirmado.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [runtime, url, patron, cadena].

---

### HU-C1.013 — Abrir editor Active4D para cuerpo JS del proceso External

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X (integracion externa) secundario.
**Superficie UI:** popup centrado con editor de codigo.
**Gesto canonico:** clic en boton `Computation` del halo o entrada equivalente.

**Historia:**
> Como ingeniero de runtime, quiero abrir el editor Active4D para escribir el cuerpo JavaScript que ejecuta `fetch(...)` y procesa la respuesta del punto de acceso.

**Contexto de negocio:**
El editor Active4D es **transversal a las cuatro categorias ejecutables** (User Defined, External, ROS, MQTT). Es un popup centrado modal con selector de tema (default `Active4D`), numeracion de lineas, syntax highlighting, botones Update/Cancel. Divide el espacio editable en cuerpo libre (arriba) e infraestructura runtime auto-inyectada (abajo). Para External especificamente, el cuerpo tipico incluye `fetch(...)`, `Promise`, `.then()`, `.map()`, `.join()`.

**Criterios de aceptacion:**
- **Dado** un proceso External, **cuando** activo la edicion de codigo, **entonces** se abre un popup centrado con editor.
- **Dado** el editor abierto, **cuando** miro arriba a la izquierda, **entonces** veo botones `Update` y `Cancel`.
- **Dado** el editor abierto, **cuando** miro arriba a la derecha, **entonces** veo un dropdown `Theme: Active4D`.
- **Dado** el editor abierto, **cuando** escribo codigo JS valido y hago `Update`, **entonces** `process.codeBody` persiste.
- **Dado** el editor abierto, **cuando** hago `Cancel`, **entonces** los cambios se descartan y el popup se cierra.

**Reglas y restricciones:**
- El editor es modal (a diferencia del widget URL/Parameters inline).
- Sintaxis aceptada: JavaScript (no TypeScript observado).
- Tamano del popup: grande, casi pantalla completa.

**Modelo de datos tocado:**
- `process.codeBody` — string (codigo JS) — persistente.
- `process.theme` — string — persistente (inferido).

**Dependencias:**
- Bloqueada por: HU-C1.001.
- Relacionada: HU de EPICA-B2 (User Defined tambien usa este editor).

**Integraciones:**
- Motor de ejecucion sandbox JS.
- Persistencia (codigo va al modelo).

**Notas de evidencia:**
- Fuente: §2.3.
- Frames: frame 35, 45.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** L.
**Etiquetas:** [runtime, url, active4d, popup, code-editor].

---

### HU-C1.014 — Preservar separador runtime `/*-------- Don't edit ... */` inmutable

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K (proteccion) secundario.
**Superficie UI:** editor Active4D.
**Gesto canonico:** ninguno (invariante de edicion).

**Historia:**
> Como ingeniero de runtime, quiero que la linea `/*-------- Don't edit or change the lines below here. These are runtime variables... */` separe visualmente el cuerpo editable de la infraestructura runtime para evitar corromper el binding con el canvas.

**Contexto de negocio:**
El editor divide el contenido en **cuerpo editable** (arriba) + **infraestructura runtime inmutable** (abajo). La linea separadora `/*-------- ... */` marca el limite. Bajo la linea viven: `let userInput = undefined;`, `function updateValue(alias, value) {}`, y el `aliasArr` (HU-C1.015). Editarlas rompe el contrato runtime — el separador es un contrato social reforzado por comentario, presumiblemente no bloqueado por el editor (pregunta abierta).

**Criterios de aceptacion:**
- **Dado** el editor abierto para un proceso ejecutable, **cuando** miro su contenido, **entonces** veo la linea separadora con texto `Don't edit or change the lines below here. These are runtime variables...`.
- **Dado** que intento editar el bloque bajo la linea: **regla** — **pregunta abierta** si el editor lo bloquea, lo permite con warning, o lo permite silenciosamente.
- **Dado** que guardo el modelo, **cuando** recargo, **entonces** la linea separadora se mantiene intacta y la infraestructura runtime tambien.

**Reglas y restricciones:**
- La linea es literal, no generada cada vez.
- La posicion del separador depende del contenido del cuerpo (no en offset fijo).

**Modelo de datos tocado:**
- Ninguno directo; es convencion del contenido de `process.codeBody`.

**Dependencias:**
- Bloqueada por: HU-C1.013.

**Integraciones:**
- Sandbox runtime lee el contenido completo incluyendo infraestructura.

**Notas de evidencia:**
- Fuente: §2.3.
- Frames: frame 35, 45.
- Transcripcion: "el editor no guarda el codigo como bloque libre; lo divide en cuerpo editable + runtime infrastructure inmutable".
- Clase de afirmacion: observado + inferido (enforcement exacto).
- Etiqueta: `requires-clarification`.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, url, active4d, runtime-infra, inmutable].

---

### HU-C1.015 — Inyectar `aliasArr` auto-generado pre-ejecucion

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario (integracion runtime); K secundario.
**Superficie UI:** editor Active4D (seccion inferior).
**Gesto canonico:** ninguno (inyeccion automatica).

**Historia:**
> Como ingeniero de runtime, quiero que OPCloud inyecte automaticamente el `aliasArr` con `{alias, value}` por cada objeto computational del canvas antes de cada ejecucion para que el codigo JS pueda leer valores por alias sin setup manual.

**Contexto de negocio:**
El `aliasArr` es el contrato runtime. Cada objeto computational visible en el canvas exporta una entrada: `{"alias": "api", "value": "https://api.nationalize.io"}`. El codigo del usuario accede al valor como `aliasArr.find(a => a.alias === "api").value`. Es el mecanismo de binding entre el modelo OPM visual y el codigo JS ejecutable — sin el, el codigo no podria leer nada del canvas.

**Criterios de aceptacion:**
- **Dado** un canvas con objetos computational con alias, **cuando** se abre el editor de un proceso ejecutable, **entonces** el `aliasArr` se renderiza en la seccion inferior con una entrada por objeto aliased.
- **Dado** que agrego un objeto computational con alias nuevo al canvas, **cuando** reabro el editor, **entonces** el `aliasArr` incluye la nueva entrada.
- **Dado** que cambio el valor de un objeto computational entre runs, **cuando** ejecuto de nuevo, **entonces** el `aliasArr` refleja el nuevo valor en la proxima inyeccion.
- **Dado** que elimino un objeto del canvas, **cuando** reabro el editor, **entonces** su entrada desaparece del `aliasArr`.

**Reglas y restricciones:**
- `aliasArr` es auto-generado; no se edita manualmente (vive bajo el separador, HU-C1.014).
- Solo objetos computational con alias exportan al `aliasArr`.
- **Pregunta abierta**: entre runs sucesivos, ¿se preserva el ultimo `aliasArr`? ¿Si cambio el valor del objeto sin tocar el codigo, se re-sincroniza?

**Modelo de datos tocado:**
- `process.runtimeAliasArr` — array — transitorio/derivado.

**Dependencias:**
- Bloqueada por: HU-C1.013, HU-C1.004.

**Integraciones:**
- Sandbox de ejecucion.

**Notas de evidencia:**
- Fuente: §2.3, §6.
- Frames: frame 45 (`aliasArr = [{"alias":"api","value":"https://api.nationalize.io"}...]`).
- Transcripcion: "los alias del canvas se vuelcan al aliasArr abajo antes de cada ejecucion".
- Clase de afirmacion: observado.
- Etiqueta: `requires-clarification` (persistencia entre runs).

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [runtime, url, active4d, aliasArr, binding].

---

### HU-C1.016 — Ejecutar `fetch` HTTP y recibir payload JSON en objeto intermedio

**Actor primario:** IR.
**Actores secundarios:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario (runtime externo); K secundario.
**Superficie UI:** canvas durante simulacion.
**Gesto canonico:** `Play ▶` en la barra de simulacion.

**Historia:**
> Como ingeniero de runtime, quiero que al ejecutar el proceso External se emita el `fetch` HTTP real y el payload JSON se escriba en el objeto intermedio `JSON Result {c}` para que la simulacion refleje datos externos reales.

**Contexto de negocio:**
La diferencia entre External y MQTT/ROS es **quien inicia la conexion**: External usa `fetch` global del sandbox de OPCloud (cliente HTTP directo); MQTT/ROS requieren un websocket bridge configurado en `Preferences → OPCloud Settings → websocket`. External **no requiere bridge** — el `fetch` del sandbox se encarga. Esta es la frontera del modelador: depende de ejecucion real de JS y red.

**Criterios de aceptacion:**
- **Dado** el modelo configurado y con `Play ▶`, **cuando** llega el turno del proceso External, **entonces** se emite `fetch(<URL>?<queryString>)` al punto de acceso declarado.
- **Dado** la respuesta HTTP 200 con JSON, **cuando** se parsea, **entonces** el payload se asigna al objeto intermedio `JSON Result {c}` y su rectangulo-valor se actualiza en canvas.
- **Dado** la respuesta HTTP, **cuando** se completa, **entonces** el siguiente proceso (`Json Parsing`) se dispara.
- **Dado** un fallo de red o HTTP 4xx/5xx: **regla** — **pregunta abierta** (fuente §4, §11.6) si hay convencion visual de "proceso External fallo" y si el `fetch` tiene timeout por defecto o requiere `Promise wait5Seconds` manual.

**Reglas y restricciones:**
- El `fetch` corre en el sandbox del browser OPCloud; sujeto a CORS del punto de acceso.
- Sin timeout automatico observado — el codigo del usuario incluye timeout manual en el ejemplo (`wait5Seconds` en frame 45).
- No requiere websocket bridge.

**Modelo de datos tocado:**
- Objeto intermedio — `object.valueState.displayText` — actualizado runtime.
- Historial de respuestas (HU-C1.024).

**Dependencias:**
- Bloqueada por: HU-C1.001 a HU-C1.015.

**Integraciones:**
- Sandbox fetch del browser.
- Simulacion (EPICA-B1, `Play/Pause/Stop`).

**Notas de evidencia:**
- Fuente: §3.6, §7.
- Frames: frame 75, 85, 88.
- Transcripcion: "External usa fetch global del sandbox de OPCloud (cliente HTTP directo); MQTT/ROS requieren websocket bridge intermedio".
- Clase de afirmacion: observado (frames de ejecucion) + inferido (detalles de error handling).
- Etiqueta: `requires-clarification` (CORS, timeouts, errores).

**Prioridad:** W.
**Tamano:** L.
**Etiquetas:** [runtime, url, fetch, ejecucion].

---

### HU-C1.017 — Expandir rectangulo-valor de JSON Result con payload completo

**Actor primario:** IR.
**Actores secundarios:** IS, RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario.
**Superficie UI:** canvas-render (rectangulo-valor del objeto intermedio).
**Gesto canonico:** ninguno (render reactivo a valor).

**Historia:**
> Como ingeniero de runtime, quiero ver el payload JSON completo literal en el rectangulo-valor del objeto intermedio para poder depurar la respuesta del punto de acceso durante la simulacion.

**Contexto de negocio:**
El rectangulo-valor se **expande en ambas dimensiones** al recibir payload grande. No hay politica de truncado ni scroll interno observada; si el contenido es mayor al ancho del objeto, el rectangulo rompe el bounding box y se extiende sobre el area libre del canvas. Esto es una **brecha visual** (`§N.4` del doc fuente): ¿empuja vecinos?, ¿se superpone?, ¿hay scroll al exportar?

**Criterios de aceptacion:**
- **Dado** el proceso External devuelve JSON con 3 paises, **cuando** se asigna al objeto, **entonces** el rectangulo-valor muestra el payload completo con wrap a varias lineas.
- **Dado** el payload excede el ancho del objeto, **cuando** se renderiza, **entonces** el rectangulo-valor se extiende hacia la derecha sobre area libre del canvas, rompiendo el bounding del objeto padre.
- **Dado** el rectangulo expandido, **cuando** miro cerca, **entonces** no hay scroll interno, no hay elipsis, no hay boton de expand.
- **Dado** la simulacion se detiene, **cuando** miro el canvas, **entonces** el payload permanece visible en el objeto (no se limpia automaticamente).

**Reglas y restricciones:**
- Sin truncado.
- Sin scroll interno.
- Expansion libre — puede superponerse a otros objetos.
- **Pregunta abierta**: politica de export (PDF/SVG) cuando el rectangulo rompe el bounding.

**Modelo de datos tocado:**
- `object.valueState.displayText` — string (JSON completo) — persistente durante run.

**Dependencias:**
- Bloqueada por: HU-C1.016, HU-C1.003.

**Integraciones:**
- Renderer.
- Export (EPICA-60, EPICA-61).

**Notas de evidencia:**
- Fuente: §3.6, §4, §9.
- Frames: frame 85 (rectangulo expandido con payload de 3 paises).
- Transcripcion: "el rectangulo-valor del objeto intermedio se expande durante simulacion para alojar el payload completo".
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [runtime, url, render, overflow, json].

---

### HU-C1.018 — Renderizar valor final como disyuncion literal `A or B or C`

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario.
**Superficie UI:** canvas-render (rectangulo-valor del objeto destino).
**Gesto canonico:** ninguno (render reactivo).

**Historia:**
> Como ingeniero de runtime, quiero ver el valor final del objeto destino como disyuncion literal `US or IM or IE` con separador ` or ` para leer de un vistazo los candidatos sin abrir el JSON crudo.

**Contexto de negocio:**
La disyuncion literal (separador " or " con espacios) **no** se expande a tres estados apilados tipo XOR. La convencion aplana valores N>1 a string unico; la multiplicidad se pierde en la representacion visual. Es el output pedagogicamente mas simple, pero ocluye la semantica XOR que un modelador OPM puro esperaria.

**Criterios de aceptacion:**
- **Dado** el proceso `Json Parsing` produce un valor con multiples candidatos, **cuando** se asigna al objeto destino, **entonces** el rectangulo-valor muestra `US or IM or IE`.
- **Dado** el separador, **cuando** miro, **entonces** es ` or ` (espacio-or-espacio), literal.
- **Dado** que hay un unico candidato, **cuando** se asigna, **entonces** el rectangulo muestra el valor sin separador (`US`).
- **Dado** el valor persistido, **cuando** consulto OPL, **entonces** aparece `Guessed Country is US or IM or IE.` (plantilla de tres campos, sin alias aunque el objeto lo tenga).

**Reglas y restricciones:**
- Separador fijo ` or ` — no configurable observado.
- Valores aplanados; pierde estructura de probabilidades.
- **Alternativa abierta**: modelar como tres objetos paralelos con XOR entre si vs string unico (§11.7 fuente).

**Modelo de datos tocado:**
- `object.valueState.displayText` — string — persistente runtime.

**Dependencias:**
- Bloqueada por: HU-C1.016, HU-C1.017.

**Integraciones:**
- Renderer.
- OPL.

**Notas de evidencia:**
- Fuente: §3.6, §9.
- Frames: frame 88, 93.
- Transcripcion: "la disyuncion literal US or IM or IE sugiere un N generico — no se observa el corte".
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, url, render, disyuncion, string].

---

### HU-C1.019 — Sincronizar OPL pane con valores runtime durante ejecucion

**Actor primario:** IR.
**Actores secundarios:** IS, RV.
**Tipo:** mixto.
**Nivel categorico:** L primario.
**Superficie UI:** opl-pane.
**Gesto canonico:** ninguno (actualizacion automatica durante run).

**Historia:**
> Como ingeniero de runtime, quiero ver el OPL pane actualizarse paso a paso con los valores reales (`is John`, `is {"name":"John",...}`, `is US or IM or IE`) para seguir la ejecucion leyendo lenguaje natural en vez de debugear el JSON crudo.

**Contexto de negocio:**
El OPL dinamico es el **canal linguistico del runtime**. Las lineas estaticas (`is a physical object`, `consists of`) permanecen; las lineas de estado y valor mutan al compas de la simulacion. El OPL captura payload JSON completo como literal en una sola linea — sin resumen ni truncado. Es la traza textual completa del run, leible sin necesidad de abrir objetos.

**Criterios de aceptacion:**
- **Dado** una simulacion activa, **cuando** el usuario tipea `John` en `Name Input`, **entonces** OPL muestra `Name Input, userName, is John.` reemplazando `is value.`
- **Dado** el External devuelve JSON, **cuando** se asigna a `JSON Result {c}`, **entonces** OPL agrega `JSON Result, c, is {"name":"John","country":[...]}.` (payload completo literal).
- **Dado** el objeto-punto-de-acceso `API URL`, **cuando** el run termina, **entonces** `API URL, api, is https://api.nationalize.io.` **no muta** (URL es configuracion, no valor sorteado).
- **Dado** un estado activo, **cuando** cambia, **entonces** aparece linea adicional `<Objeto> is currently at state <estado>.`
- **Dado** la simulacion se detiene, **cuando** miro OPL, **entonces** las ultimas lineas persisten.

**Reglas y restricciones:**
- Lineas estaticas permanentes.
- Lineas de valor mutan in-place.
- Lineas de estado activo son adicionales, no reemplazan.
- **Desfase observable** (§11.2 fuente): frame 75 muestra `external` con punto verde pero OPL dice `is currently at state user defined` — ¿OPL un paso atras o delante?

**Modelo de datos tocado:**
- Ninguno directo; lee del modelo + estado runtime.

**Dependencias:**
- Bloqueada por: HU-C1.016.

**Integraciones:**
- OPL pane, motor OPL runtime-aware.

**Notas de evidencia:**
- Fuente: §3.7, §7, §11.2.
- Frames: frame 75, 80, 85.
- Transcripcion: "lineas de valor mutan: `Name Input, userName, is John.` reemplaza `is value.`".
- Clase de afirmacion: observado + abierto (desfase).
- Etiqueta: `requires-clarification` (desfase OPL-render).

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [runtime, url, opl, ejecucion, lente].

---

### HU-C1.020 — Marcar estado activo con punto verde transitorio durante run

**Actor primario:** IR.
**Actores secundarios:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario.
**Superficie UI:** canvas-render (estado + elipse).
**Gesto canonico:** ninguno (render reactivo a simulacion).

**Historia:**
> Como ingeniero de runtime, quiero ver un punto verde pequeno en el borde del estado o proceso activo para seguir visualmente el flujo de ejecucion en el canvas.

**Contexto de negocio:**
Marca transitoria durante ejecucion — ~6px, relleno verde saturado, pegado al borde izquierdo del rectangulo del estado o al borde de la elipse del proceso. **Sin documentar en la SSOT** (§9 fuente). Coexiste ambigüamente con handles de seleccion (negros, cuadrados) y puntos de anclaje (blancos, circulos) — hay riesgo de confusion visual que la SSOT deberia resolver.

**Criterios de aceptacion:**
- **Dado** la simulacion activa, **cuando** un estado se vuelve el estado activo, **entonces** aparece un punto verde ~6px pegado al borde izquierdo del rectangulo del estado.
- **Dado** un proceso se vuelve el proceso en ejecucion, **cuando** miro, **entonces** su elipse tiene punto verde igual.
- **Dado** la simulacion pasa al siguiente estado/proceso, **cuando** ocurre la transicion, **entonces** el punto verde se mueve.
- **Dado** la simulacion termina, **cuando** miro, **entonces** el punto verde desaparece de todos los elementos.

**Reglas y restricciones:**
- Marca puramente visual; no afecta el modelo.
- Color verde saturado fijo (no configurable observado).
- **Convencion sin documentar en SSOT visual** — candidato a V-nueva.

**Modelo de datos tocado:**
- Ninguno; estado runtime transitorio.

**Dependencias:**
- Bloqueada por: HU-C1.016.

**Integraciones:**
- Renderer durante simulacion.

**Notas de evidencia:**
- Fuente: §3.6, §9.
- Frames: frame 70 (punto sobre elipse `Name Origin Guessing`), 75 (sobre estado `external`).
- Transcripcion: "punto verde pequeno, ~6px, relleno verde saturado, pegado al borde izquierdo... marca transitoria durante ejecucion".
- Clase de afirmacion: observado + abierto (convencion).
- Etiqueta: `requires-clarification` (formalizar en SSOT).

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, url, render, estado-activo, simulacion].

---

### HU-C1.021 — Preservar URL literal como configuracion no sorteable

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario (invariante de simulacion).
**Superficie UI:** barra de simulacion (dado `Simulated Elements`).
**Gesto canonico:** ninguno (invariante).

**Historia:**
> Como ingeniero de runtime, quiero que la URL del punto de acceso NO sea sorteable por `Simulated Elements` aunque otros objetos string si lo sean para distinguir configuracion estable (URL) de variables aleatorias de test (Name Input).

**Contexto de negocio:**
El `dado Simulated Elements` permite sortear valores en objetos string (opcion `Textual Value`, pares `texto:peso`). Pero el punto de acceso es configuracion, no variable de test — sortearlo entre runs destruiria la reproducibilidad. La convencion observada: el `API URL {api}` **no muta** entre runs (§3.7 fuente), aunque sea string-valued como `Name Input {userName}`. La distincion es intencional.

**Criterios de aceptacion:**
- **Dado** el objeto `API URL {api}` con valor, **cuando** abro `Simulated Elements`: **regla** — **pregunta abierta** si aparece o no en la lista de objetos sorteables.
- **Dado** que ejecuto multiples runs seguidos, **cuando** miro el objeto punto de acceso, **entonces** su valor permanece `https://api.nationalize.io` sin variacion.
- **Dado** que el usuario modifica explicitamente la URL entre runs, **cuando** ejecuto, **entonces** el nuevo valor aplica — la invariante es "no sortear", no "no editar".

**Reglas y restricciones:**
- Invariante implicita: URLs son estables dentro de una sesion de simulacion.
- El criterio exacto que excluye un objeto del sorteo es **pregunta abierta** (¿tipo de contenido?, ¿flag de usuario?, ¿por alias convencional?).

**Modelo de datos tocado:**
- **Pregunta abierta**: `object.simulatable` — bool — persistente — como flag explicito.

**Dependencias:**
- Bloqueada por: HU-C1.003, HU de EPICA-B1 (simulated elements).

**Integraciones:**
- Motor de simulacion.

**Notas de evidencia:**
- Fuente: §3.7.
- Transcripcion: "`API URL, api, is https://api.nationalize.io.` no muta — el punto de acceso se toma como dato de configuracion, no como valor sorteado".
- Clase de afirmacion: observado + abierto (mecanismo exacto).
- Etiqueta: `requires-clarification`.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [runtime, url, simulacion, invariante].

---

### HU-C1.022 — Advertir punto de acceso inalcanzable con feedback visual al autor

**Actor primario:** IR.
**Actores secundarios:** IA (analista de modelo).
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario (feedback); X secundario.
**Superficie UI:** canvas-render del proceso External + notification bar.
**Gesto canonico:** ninguno (feedback automatico post-fallo).

**Historia:**
> Como ingeniero de runtime, quiero ver un feedback visual claro cuando el punto de acceso asociado al proceso External falla (network, CORS, 4xx/5xx) para reparar el modelo antes de un run completo.

**Contexto de negocio:**
Fallos de red y errores HTTP son comunes en runtime real. Actualmente el doc fuente no observa convencion visual para "proceso External fallo" (§11.6 pregunta abierta). El valor de esta HU esta en **cerrar el gap** detectado en el reverse: el modelador deberia tener feedback inmediato, no solo silencio o error en consola JS.

**Criterios de aceptacion:**
- **Dado** un run que emite `fetch` a un punto de acceso, **cuando** el fetch falla por network error, **entonces** el proceso External se renderiza con indicador visual (p.ej. borde rojo o badge de error) y el rectangulo-valor del objeto intermedio queda con `error: <mensaje>` o analogo.
- **Dado** un HTTP 4xx, **cuando** el fetch retorna, **entonces** el feedback distingue "HTTP error" de "network error".
- **Dado** un CORS block, **cuando** el fetch se rechaza, **entonces** el feedback sugiere la causa (ej. "CORS blocked — endpoint needs to allow origin").
- **Dado** el run falla, **cuando** reintento con punto de acceso corregido, **entonces** el indicador de error se limpia.

**Reglas y restricciones:**
- Feedback debe distinguir categorias: network, HTTP status, CORS, timeout, JSON parse.
- Mensaje de error accesible (al hover o en panel dedicado, no solo en consola).
- Convencion visual nueva — requiere decision de SSOT (V-nueva).

**Modelo de datos tocado:**
- `process.lastRun.error` — `{kind: string, message: string, status?: number}` — transitorio.

**Dependencias:**
- Bloqueada por: HU-C1.016.

**Integraciones:**
- Runtime fetch.
- Renderer.
- Notification bar (si existe).

**Notas de evidencia:**
- Fuente: §11.6 (pregunta abierta).
- Clase de afirmacion: abierto (HU propositiva que cierra gap).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [runtime, url, error, warning, requires-clarification].

---

### HU-C1.023 — Auditar modelo con verificacion de enlaces por lote de puntos de acceso declarados

**Actor primario:** IR.
**Actores secundarios:** IA, AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X secundario.
**Superficie UI:** modal o panel de auditoria.
**Gesto canonico:** clic en boton `Check puntos de acceso`.

**Historia:**
> Como ingeniero de runtime, quiero ejecutar una verificacion de enlaces por lote de todos los puntos de acceso declarados en el modelo para detectar URLs caidas antes de un run de simulacion completo.

**Contexto de negocio:**
Un modelo puede declarar varios `API URL {aliasN}`. Una verificacion de enlaces por lote emite HEAD (o GET si HEAD no soportado) a cada punto de acceso, recolecta status codes, y reporta. Evita la sorpresa de descubrir el fallo a media simulacion. No observado en OPCloud (pregunta derivada); candidato de extension del modelador core.

**Criterios de aceptacion:**
- **Dado** un modelo con 3 objetos `API URL {api1,api2,api3}`, **cuando** clic en `Check puntos de acceso`, **entonces** se emite HEAD a cada URL y se reporta status.
- **Dado** el reporte, **cuando** miro, **entonces** veo una tabla `alias | URL | status | tiempo`.
- **Dado** un punto de acceso con status 200, **cuando** lo veo en la tabla, **entonces** esta marcado OK.
- **Dado** un punto de acceso con error (4xx/5xx/timeout), **cuando** lo veo, **entonces** esta marcado con color de alerta y el mensaje de error.
- **Dado** el reporte, **cuando** clic en una fila, **entonces** se me lleva al objeto correspondiente en el canvas.

**Reglas y restricciones:**
- HEAD-first con fallback a GET cuando el servidor no soporta HEAD.
- Timeout configurable (default 5-10s).
- Respeta CORS — si CORS bloquea, reporta "CORS blocked".
- Opcional para el usuario — no es validacion del kernel.

**Modelo de datos tocado:**
- Ninguno persistente; reporte transitorio.

**Dependencias:**
- Bloqueada por: HU-C1.003 (objetos punto de acceso), HU-C1.016 (semanticamente depende del runtime fetch).

**Integraciones:**
- Runtime fetch.
- Panel de auditoria / analisis (candidato EPICA-D0 o D1).

**Notas de evidencia:**
- Fuente: derivada — no observada en OPCloud.
- Clase de afirmacion: propuesta (cierre de gap del modelador core).

**Prioridad:** C.
**Tamano:** L.
**Etiquetas:** [runtime, url, batch, link-check, analisis].

---

### HU-C1.024 — Registrar historia de respuestas HTTP por run de simulacion

**Actor primario:** IR.
**Actores secundarios:** IS, RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** P primario (persistencia); X secundario.
**Superficie UI:** panel de historia / inspector de run.
**Gesto canonico:** abrir panel `Run History`.

**Historia:**
> Como ingeniero de runtime, quiero consultar la historia de respuestas HTTP de cada run (URL, status, tiempo, payload) para depurar comportamientos y comparar runs sucesivos.

**Contexto de negocio:**
Los runs de simulacion con External son efimeros: al terminar, solo queda el ultimo valor en el rectangulo-valor. Para depurar, analisis post-hoc, o comparar runs, se necesita un log persistente. No observado en OPCloud (§11.8 fuente — persistencia del `aliasArr` entre runs es pregunta abierta; este HU la extiende).

**Criterios de aceptacion:**
- **Dado** varios runs consecutivos, **cuando** abro `Run History`, **entonces** veo lista cronologica con `runId, timestamp, punto de acceso, status, duration, payload_summary`.
- **Dado** una entrada de la lista, **cuando** expando, **entonces** veo el payload completo, headers, request params.
- **Dado** dos runs de la misma sesion, **cuando** los comparo, **entonces** se marcan diferencias en payloads.
- **Dado** que persisto el modelo, **cuando** recargo: **regla** — **decision abierta** si el historial sobrevive (probablemente no por defecto, pero con opcion de exportar).

**Reglas y restricciones:**
- Persistencia en memoria por sesion; export opcional a JSON.
- Tamano limitado (ej. ultimos 50 runs) para no inflar.
- Privacy: no registrar headers de autenticacion si los hubiera (HU-C1.025).

**Modelo de datos tocado:**
- `runHistory[]` — array transitorio de sesion — no persistente por defecto.

**Dependencias:**
- Bloqueada por: HU-C1.016.

**Integraciones:**
- Motor de ejecucion.
- Panel dedicado.

**Notas de evidencia:**
- Fuente: §11.8 (persistencia aliasArr pregunta abierta — extendida).
- Clase de afirmacion: propuesta.

**Prioridad:** C.
**Tamano:** L.
**Etiquetas:** [runtime, url, historial, auditoria, persistencia].

---

### HU-C1.025 — Modelar autenticacion HTTP (headers, Authorization)

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; X secundario.
**Superficie UI:** mini-editor URL/Parameters + editor Active4D.
**Gesto canonico:** escritura de header en editor o nuevo panel dedicado.

**Historia:**
> Como ingeniero de runtime, quiero modelar headers HTTP (Authorization, API-Key) del punto de acceso para soportar APIs no publicas en el runtime External.

**Contexto de negocio:**
El punto de acceso del ejemplo canonico es publico. APIs reales casi siempre requieren autenticacion: Bearer token, API key, OAuth. No observado en OPCloud (§11.5 fuente pregunta abierta). Esta HU abre la decision: ¿se modela en el codigo Active4D (actual), en un panel nuevo, o como objeto `Auth Credentials {token}` aliased analogo a `API URL {api}`?

**Criterios de aceptacion:**
- **Dado** que necesito Authorization, **cuando** abro el mini-editor: **decision** — o se agrega campo `Headers`, o se agrega objeto `Auth Credentials {token}` con alias y link Instrument.
- **Dado** un token en el modelo, **cuando** ejecuto, **entonces** el `fetch` incluye el header `Authorization: Bearer <token>`.
- **Dado** el historial de runs (HU-C1.024), **cuando** miro, **entonces** el header de auth **no** se registra (privacy).
- **Dado** que el token caduca, **cuando** lo actualizo en el modelo, **entonces** el siguiente run usa el nuevo.

**Reglas y restricciones:**
- **Decision abierta**: mecanismo canonico (objeto aliased vs campo de widget vs solo codigo Active4D).
- Privacy: tokens no deben persistir en clear text en el modelo guardado (pregunta abierta).
- Escapado correcto en headers.

**Modelo de datos tocado:**
- **Pregunta abierta**: `process.endpoint.headers` — map<string, string> — persistente — o modelado como objeto separado.

**Dependencias:**
- Bloqueada por: HU-C1.016.

**Integraciones:**
- Runtime fetch.
- Potencialmente storage de secretos (pregunta abierta).

**Notas de evidencia:**
- Fuente: §11.5 (pregunta abierta).
- Transcripcion: "¿Como se modelan headers (Authorization, API-Key)? ¿Se editan en el codigo Active4D manualmente o hay un panel dedicado?".
- Clase de afirmacion: abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [runtime, url, auth, headers, requires-clarification].

---

### HU-C1.026 — Reabrir mini-editor URL/Parameters para edicion posterior

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario.
**Superficie UI:** canvas (widget inline).
**Gesto canonico:** **pregunta abierta** — ¿doble clic sobre el proceso External? ¿entrada desde halo? ¿accion de toolbar contextual?

**Historia:**
> Como ingeniero de runtime, quiero reabrir el mini-editor URL/Parameters de un proceso External ya configurado para editar el punto de acceso o los parametros sin crear un proceso nuevo.

**Contexto de negocio:**
Los frames 55-60 muestran el proceso External **sin** el widget; el 65 lo muestra abierto. El gesto exacto de apertura (y por tanto de reapertura) **no quedo capturado** en el reverse (§11.1 fuente). Esta HU abre la decision: ¿cual es la afordance canonica de edicion posterior? Es critico para ciclos de iteracion del modelo.

**Criterios de aceptacion:**
- **Dado** un proceso External ya configurado, **cuando** ejecuto el gesto canonico de edicion (a definir), **entonces** el mini-editor se abre pre-poblado con los valores actuales.
- **Dado** el mini-editor reabierto, **cuando** cambio URL o Parameters y hago `Update`, **entonces** la nueva configuracion reemplaza la anterior.
- **Dado** que hago `Cancel` (si existe): **regla** — los cambios se descartan y el widget cierra.
- **Dado** el gesto: **decision** — se documenta como doble clic sobre el proceso (candidato, analogo a edit alias de objeto), o como entrada dedicada de halo, o como item de toolbar contextual.

**Reglas y restricciones:**
- El gesto debe ser consistente con otros editores del producto.
- No debe colisionar con la seleccion/drag del proceso.

**Modelo de datos tocado:**
- Ninguno durante apertura.

**Dependencias:**
- Bloqueada por: HU-C1.006.

**Integraciones:**
- Halo / toolbar contextual / detector de doble clic.

**Notas de evidencia:**
- Fuente: §11.1 (pregunta abierta).
- Clase de afirmacion: abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [runtime, url, widget-inline, edicion, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **QC1.1** (§11.1) — Gesto exacto de apertura / reapertura del mini-editor URL/Parameters. Cubierta por HU-C1.006 y HU-C1.026 con etiqueta `requires-clarification`.
- **QC1.2** (§11.2) — Desfase OPL-render durante simulacion: frame 75 muestra estado `external` activo con punto verde pero OPL dice `is currently at state user defined`. ¿OPL un paso atras o adelante? Afecta HU-C1.019, HU-C1.020.
- **QC1.3** (§11.3) — Politica de overflow del rectangulo-valor con JSON grande: ¿empuja vecinos?, ¿se superpone?, ¿scroll al exportar? Afecta HU-C1.017.
- **QC1.4** (§11.4) — Semantica exacta de `(name, userName)` en Parameters: ¿siempre pares `(queryKey, alias)`?, ¿admite POST body?, ¿multiples fuentes? Afecta HU-C1.008.
- **QC1.5** (§11.5) — Autenticacion HTTP (headers Authorization, API-Key): mecanismo canonico. Cubierta por HU-C1.025.
- **QC1.6** (§11.6) — Convencion visual para "proceso External fallo" (network, 4xx/5xx, timeout). Cubierta por HU-C1.022.
- **QC1.7** (§11.7) — Disyuncion literal `A or B or C` vs multiplicidad XOR entre estados apilados: ¿cuando conviene cada representacion? Afecta HU-C1.018.
- **QC1.8** (§11.8) — Persistencia del `aliasArr` entre runs sucesivos y re-sincronizacion al cambiar valores de objetos sin tocar el codigo. Afecta HU-C1.015, HU-C1.024.
- **QC1.9** (§11.9) — Composicion simulacion combinada External + `Simulated Elements`: ¿orden de sorteo/fetch?, ¿el sorteo se propaga al `userName` antes del `fetch`? Afecta HU-C1.021.
- **QC1.10** — (derivada) CORS y sandbox de red del browser OPCloud: ¿que puntos de acceso son alcanzables desde el sandbox? Afecta HU-C1.016, HU-C1.022.
- **QC1.11** — (derivada) Colision de alias (dos objetos con alias `api`): ¿OPCloud previene, permite con warning, o silencia? Afecta HU-C1.004.
- **QC1.12** — (derivada) Enforcement del separador `/*-------- Don't edit */` en editor Active4D: ¿se bloquea edicion bajo el separador? Afecta HU-C1.014.

## Referencias cruzadas

- **Doc fuente:** `opcloud-reverse/c1-runtime-urls.md`.
- **Hermanos runtime:** `c0-runtime-mqtt.md` (EPICA-C0, pub/sub con broker + websocket bridge), `c2-runtime-ros.md` (EPICA-C2, ROS + websocket bridge). Los tres comparten editor Active4D y convencion de alias, difieren en superficie UI de configuracion.
- **Dependencias upstream:**
  - **EPICA-B1** (`simulation-computational`): pestanas de categoria, objeto computational, rectangulo-valor, barra de simulacion (`→ b1 §2–§3, §7`).
  - **EPICA-B2** (`simulation-user-functions`): editor Active4D compartido; categoria User Defined usa el mismo `aliasArr`.
  - **EPICA-10** (`canvas-creacion-cosas`): creacion base de objetos/procesos.
  - **EPICA-15** (`canvas-enlaces-avanzados`): modificador `c`, links Condition.
  - **EPICA-17** (`canvas-atributos-instancias`): edit alias.
  - **EPICA-50** (`opl-pane`): OPL dinamico durante simulacion.
- **Dependencias downstream:**
  - **EPICA-D0** (`analysis-missing-knowledge`): verificacion de enlaces por lote podria integrarse con el analizador de gaps.
  - **EPICA-60/61** (`export-pdf/svg`): politica de export con rectangulos-valor expandidos (HU-C1.017).
  - **EPICA-30** (`persistencia-save-load`): persistencia de `process.codeBody`, `process.endpoint.*`, y potencialmente `runHistory`.
- **Invariantes del repo:**
  - Si se llega a implementar runtime External, vive bajo `src/runtime/external/` o equivalente — **no en el kernel** (`src/nucleo/`). El kernel permanece inmutable salvo que emerja presion cruzada (≥2 dominios lo requieran, per CLAUDE.md del repo).
  - El editor de codigo (Active4D en OPCloud) requeriria decision de tooling JS: Monaco / CodeMirror / otro. Delegada a handoff del ciclo runtime.
  - CORS y sandboxing de red: el modelador core del repo (opmodel.sanixai.com) serve estatico; habilitar fetch desde el frontend exige politica de CSP y de proxy a definir.
- **Notas SSOT:**
  - Convencion `()` como marca de proceso ejecutable (HU-C1.002): candidata a V-nueva en `ssot/opm-visual-es.md`.
  - Punto verde de estado activo (HU-C1.020): candidata a V-nueva.
  - Modificador `c` en punto de acceso (HU-C1.011): ya cubierto por convencion OPM estandar pero la **posicion en punto de acceso** es especifica de OPCloud — vale nota.
- **Prioridad global de la epica:** **W** (won't-have en el ciclo actual del modelador core). Las HU S/M1 cubren solo la superficie **de modelado** (configurar objeto punto de acceso, alias, declarar parametros, links) que puede implementarse sin ejecutar. La ejecucion real (`fetch`, editor Active4D, sandbox) se difiere a ciclo runtime dedicado cuando el modelador core este cerrado.
