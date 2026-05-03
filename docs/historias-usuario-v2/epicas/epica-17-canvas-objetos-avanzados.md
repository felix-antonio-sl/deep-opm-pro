---
epica: "EPICA-17"
titulo: "Canvas — objetos avanzados (alias, unidad, descripción, URL, plegado parcial, designaciones de estado, duración)"
slug: "canvas-atributos-instancias"
doc_fuente: "opcloud-reverse/17-canvas-atributos-instancias.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M1"
hu_emitidas: 34
hu_canonicas: 28
hu_stubs: 6
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Capacidades avanzadas sobre el símbolo del objeto: descripción enriquecida, atributos tipados (`Nombre [Unidad] {alias}`), instancias visuales, vistas de refinamiento (Show Unfold View, plegado parcial), designaciones persistentes de estado (Inicial, Final, Current, Default) con regla `Current ↔ Default` excluyente, y Duración temporal parametrizada.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-17.001 | Abrir popup de edición con doble clic sobre objeto [absorbida en HU-10.003] | — | — | — | — | — |
| HU-17.002 | Expandir campo Descripción con checkbox desplegable | MN | M1 | S | opcloud-ui | — |
| HU-17.003 | Persistir descripción multi-línea del objeto | MN | M1 | S | opcloud-ui | — |
| HU-17.004 | Ver marca 📄 de descripción en esquina del objeto | MN | M1 | XS | opcloud-ui | — |
| HU-17.005 | Ver tooltip con descripción al pasar el cursor sobre 📄 | RV | M1 | XS | opcloud-ui | — |
| HU-17.006 | Ocultar descripción sin borrarla | ME | S | S | opcloud-ui | — |
| HU-17.007 | Editar alias corto del objeto desde menú contextual | ME | M1 | S | opm-semantica | [Glos 3.7] |
| HU-17.008 | Ver alias renderizado entre llaves en canvas | MN | M1 | XS | opcloud-ui | — |
| HU-17.009 | Ver alias verbalizado tras coma en OPL | MN | M1 | XS | opm-semantica | — |
| HU-17.010 | Alternar visualización del alias con botón de toolbar | ME | S | XS | opcloud-ui | — |
| HU-17.011 | Declarar unidad física entre corchetes en nombre de atributo | AD | M1 | S | opm-semantica | [Glos 3.4] |
| HU-17.012 | Ver sintaxis compuesta `Nombre [Unidad] {alias}` en canvas | AD | M1 | XS | opcloud-ui | — |
| HU-17.013 | Crear atributo del objeto vía exhibición-característica | AD | M0 | M | opm-semantica | [Glos 3.4] [Glos 3.40] |
| HU-17.014 | Distinguir atributos numéricos de atributos objeto | AD | M1 | XS | opm-semantica | [Glos 3.4] |
| HU-17.015 | Declarar slot de valor en atributo numérico | AD | M1 | M | opm-semantica | [Glos 3.4] [V-163] |
| HU-17.016 | OPL `Atributo es valor [Unidad].` para atributo numérico | MN | M1 | S | opm-semantica | [Glos 3.4] |
| HU-17.017 | Asignar valor concreto al slot | AD | S | M | opm-semantica | [V-163] |
| HU-17.018 | Abrir modal Add URL Links desde toolbar contextual | ME | S | S | opcloud-ui | — |
| HU-17.019 | Agregar URL tipada (Imagen / Video / Artículo / Texto / OSLC) | AD | S | S | opcloud-ui | — |
| HU-17.020 | Ver marca 🔗 en esquina del objeto cuando tiene URL | MN | S | XS | opcloud-ui | — |
| HU-17.021 | Abrir URL al clic sobre 🔗 | RV | S | XS | opcloud-ui | — |
| HU-17.022 | Rotar entre múltiples URLs con clics sucesivos | RV | C | S | opcloud-ui | — |
| HU-17.023 | Eliminar fila de URL desde el modal | ME | S | XS | opcloud-ui | — |
| HU-17.024 | Activar vista plegado parcial [absorbida en HU-18.001] | — | — | — | — | — |
| HU-17.025 | Ver rasgos exhibidos como filas interiores en plegado parcial [absorbida en HU-18.002] | — | — | — | — | — |
| HU-17.026 | Extraer rasgo de plegado parcial al canvas con doble clic [absorbida en HU-18.004] | — | — | — | — | — |
| HU-17.027 | OPL `lista A y B como rasgos.` en plegado parcial | ME | S | XS | mixto | — |
| HU-17.028 | Navegar a OPD `SDn: <Obj> desplegado` con Mostrar despliegue | ME | M1 | S | opcloud-ui | [Glos 3.81] |
| HU-17.029 | Mostrar múltiples apariencias del mismo objeto en un OPD | ME | S | M | opm-semantica | [V-95] |
| HU-17.030 | Navegar de entidad a apariencias desde biblioteca con sufijo `de <padre>` | ME | S | S | opcloud-ui | — |
| HU-17.031 | Designar estado como Inicial / Final [absorbida en HU-13.010 + HU-13.011] | — | — | — | — | — |
| HU-17.032 | Designar estado como Current / Default (excluyentes) [absorbida en HU-13.012 + HU-13.013] | — | — | — | — | — |
| HU-17.033 | Permitir Inicial + Final simultáneos en un mismo estado | IS | M1 | XS | opm-semantica | [Glos 3.71a] |
| HU-17.034 | Configurar Duración del estado con unidad + min/nominal/max | IS | S | M | opm-semantica | [Glos 3.71a] |

30 canónicas, 4 stubs.

## 3. Historias de usuario

### HU-17.001 — Abrir popup de edición con doble clic [absorbida en HU-10.003]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-10.003.

---

### HU-17.002 — Expandir campo Descripción con checkbox desplegable

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero un campo Descripción colapsable en el popup de edición para tener más espacio cuando lo necesito.
**Criterios:** **Dado** popup abierto, **cuando** activo "Más detalles", **entonces** aparece campo "Descripción" multi-línea.
**Modelo:** UI. **Deps:** Bloqueada por HU-10.003.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, descripcion].

---

### HU-17.003 — Persistir descripción multi-línea del objeto

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** K.
**Historia:** Como modelador, quiero que la descripción multi-línea se persista en `entidad.descripcion`.
**Criterios:** **Dado** descripción ingresada, **cuando** confirmo, **entonces** `entidad.descripcion` se actualiza con saltos de línea preservados.
**Modelo:** `entidad.descripcion: string` `[propuesta]`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-17.002. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [persistencia, descripcion, propuesta].

---

### HU-17.004 — Ver marca 📄 de descripción en esquina del objeto

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero ver una marca pequeña 📄 cuando un objeto tiene descripción para identificar de un vistazo cuáles documentaron.
**Criterios:** **Dado** `entidad.descripcion ≠ ""`, **cuando** se renderiza, **entonces** aparece icono 📄 en esquina superior derecha de la apariencia.
**Modelo:** lente derivada. **Deps:** Bloqueada por HU-17.003.
**Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [render, descripcion, badge].

---

### HU-17.005 — Ver tooltip con descripción al pasar el cursor sobre 📄

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como revisor, quiero ver la descripción sin abrir el popup de edición.
**Criterios:** **Dado** apunto a 📄, **cuando** transcurren 500ms, **entonces** aparece tooltip con descripción.
**Deps:** Bloqueada por HU-17.004. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [ui, tooltip].

---

### HU-17.006 — Ocultar descripción sin borrarla (toggle de visibilidad)

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador experto, quiero ocultar todas las marcas 📄 del OPD para reducir clutter.
**Criterios:** **Dado** activo "Ocultar descripciones" en preferencias del OPD, **cuando** la acción termina, **entonces** ningún 📄 se renderiza pero los datos se preservan.
**Modelo:** `[propuesta]` `ui.descripcionesVisibles: boolean`. **Deps:** Bloqueada por HU-17.004.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, toggle, descripcion].

---

### HU-17.007 — Editar alias corto del objeto desde menú contextual

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como modelador, quiero asignar un alias corto al objeto (ej. `iPhone` → alias `iP`) para usarlo en oraciones OPL densas.
**Criterios:** **Dado** elijo "Editar alias", **cuando** ingreso `iP` y confirmo, **entonces** `entidad.alias = "iP"`.
**Modelo:** `entidad.alias: string` `[propuesta]`. **Patrones:** HU-SHARED-001, HU-SHARED-002.
**Deps:** Bloqueada por HU-10.002. **Evidencia:** [Glos 3.7]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, alias].

---

### HU-17.008 — Ver alias renderizado entre llaves en canvas

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero ver `iPhone {iP}` en el canvas cuando hay alias.
**Criterios:** **Dado** `entidad.alias`, **cuando** se renderiza, **entonces** la etiqueta muestra `<nombre> {<alias>}`.
**Deps:** Bloqueada por HU-17.007.
**Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [render, alias].

---

### HU-17.009 — Ver alias verbalizado tras coma en OPL

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** L.
**Historia:** Como modelador, quiero que el OPL incluya el alias para densificar la verbalización.
**Criterios:** **Dado** alias `iP`, **cuando** OPL emite, **entonces** se incluye `**iPhone**, también iP, ...`.
**Patrones:** HU-SHARED-007. **Deps:** Bloqueada por HU-17.007.
**Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [opl, alias].

---

### HU-17.010 — Alternar visualización del alias con botón de toolbar

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero ocultar/mostrar todos los alias del OPD con un botón.
**Criterios:** `ui.aliasVisibles: boolean`.
**Deps:** Bloqueada por HU-17.008. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [ui, toggle, alias].

---

### HU-17.011 — Declarar unidad física entre corchetes en nombre de atributo

**Actor primario:** AD. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como diseñador de dominio, quiero declarar la unidad de un atributo numérico (`Temperatura [°C]`) para precisión semántica.
**Criterios:**
- **Dado** un atributo, **cuando** ingreso nombre `Temperatura [°C]`, **entonces** se parsea: `entidad.nombre = "Temperatura"`, `entidad.unidad = "°C"` `[propuesta]`.
- **Dado** OPL emite, **entonces** la oración incluye la unidad.
**Modelo:** `entidad.unidad: string` `[propuesta]`. **Patrones:** HU-SHARED-007.
**Evidencia:** [Glos 3.4]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, atributo, unidad].

---

### HU-17.012 — Ver sintaxis compuesta `Nombre [Unidad] {alias}` en canvas

**Actor primario:** AD. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como diseñador, quiero ver la sintaxis compuesta completa renderizada para validar visualmente.
**Criterios:** **Dado** `nombre`, `unidad`, `alias`, **cuando** se renderiza, **entonces** la etiqueta es `<nombre> [<unidad>] {<alias>}`.
**Deps:** Bloqueada por HU-17.008, HU-17.011.
**Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [render, atributo, unidad, alias].

---

### HU-17.013 — Crear atributo del objeto vía exhibición-característica

**Actor primario:** AD. **Tipo:** opm-semantica. **Nivel:** K primario.
**Historia:** Como diseñador, quiero crear atributos del objeto que cuelgan vía exhibición-característica para representar propiedades.
**Criterios:**
- **Dado** un objeto `Vehículo`, **cuando** elijo "Agregar atributo" y nombro "Color", **entonces** se crea entidad `Color` y enlace exhibición-característica `Vehículo → Color`.
- **Dado** OPL emite, **entonces** aparece: `**Vehículo** exhibe **Color**.`
**Modelo:** `enlace.tipo = "exhibicion"` `[propuesta]`, `entidad.*` para el atributo.
**Patrones:** HU-SHARED-002, HU-SHARED-007.
**Evidencia:** [Glos 3.4], [V-239]. Clase: confirmado.
**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [kernel, atributo, exhibicion].

---

### HU-17.014 — Distinguir atributos numéricos de atributos objeto

**Actor primario:** AD. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como diseñador, quiero distinguir un atributo numérico (con slot de valor) de un atributo objeto (con sub-objeto completo).
**Criterios:** atributo numérico tiene slot `value`; atributo objeto es entidad propia con sus enlaces.
**Modelo:** `entidad.esAtributo: boolean` `[propuesta]`.
**Evidencia:** [Glos 3.4]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [kernel, atributo, distincion].

---

### HU-17.015 — Declarar slot de valor en atributo numérico

**Actor primario:** AD. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como diseñador, quiero declarar un placeholder `value` en el atributo numérico para que la SSOT lo trate como slot de valor [V-163].
**Criterios:** **Dado** atributo numérico `Temperatura [°C]`, **cuando** se persiste, **entonces** existe `valueSlot.entidadId = atributo.id`, `valueSlot.placeholder = "value"`.
**Modelo:** `[propuesta]` `valueSlot.*`.
**Evidencia:** [Glos 3.4], [V-163]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [kernel, slot, valor, propuesta].

---

### HU-17.016 — OPL `Atributo es valor [Unidad].` para atributo numérico

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** L.
**Historia:** Como modelador, quiero la oración OPL canónica para atributos numéricos.
**Criterios:** **Dado** `Temperatura [°C]`, **cuando** OPL emite, **entonces** aparece: `**Temperatura** es valor [°C].` (placeholder `value` se mantiene hasta asignar real).
**Patrones:** HU-SHARED-007. **Deps:** Bloqueada por HU-17.015.
**Evidencia:** [Glos 3.4]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [opl, atributo, valor].

---

### HU-17.017 — Asignar valor concreto al slot

**Actor primario:** AD. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como diseñador, quiero asignar un valor concreto (`25`) al slot, reemplazando el placeholder.
**Criterios:** **Dado** un slot, **cuando** asigno `25`, **entonces** `valueSlot.valor = 25` y OPL: `**Temperatura** es 25 [°C].`
**Modelo:** `valueSlot.valor`. **Deps:** Bloqueada por HU-17.015.
**Evidencia:** [V-163]. Clase: confirmado.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [kernel, valor].

---

### HU-17.018 — Abrir modal Add URL Links desde toolbar contextual

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero abrir un modal para asociar URLs al objeto.
**Criterios:** **Dado** objeto seleccionado, **cuando** elijo "Agregar URL", **entonces** se abre modal con campos URL y tipo.
**Deps:** Bloqueada por HU-10.002.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, url].

---

### HU-17.019 — Agregar URL tipada (Imagen / Video / Artículo / Texto / OSLC)

**Actor primario:** AD. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como diseñador, quiero clasificar la URL por tipo (imagen, video, artículo, texto, OSLC).
**Criterios:** **Dado** modal abierto, **cuando** elijo tipo y agrego URL, **entonces** `entidad.urls` agrega entrada `{ tipo, url }`.
**Modelo:** `entidad.urls: Array<{ tipo, url }>` `[propuesta]`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-17.018.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [persistencia, url, propuesta].

---

### HU-17.020 — Ver marca 🔗 en esquina del objeto cuando tiene URL

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero saber qué objetos tienen URLs asociadas.
**Criterios:** badge 🔗 en esquina cuando `entidad.urls.length > 0`.
**Deps:** Bloqueada por HU-17.019.
**Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [render, badge, url].

---

### HU-17.021 — Abrir URL al clic sobre 🔗

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** X.
**Historia:** Como revisor, quiero abrir la URL haciendo clic en 🔗.
**Criterios:** **Dado** clic en 🔗, **cuando** la acción termina, **entonces** se abre la primera URL en nueva pestaña.
**Deps:** Bloqueada por HU-17.020.
**Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [ux, url].

---

### HU-17.022 — Rotar entre múltiples URLs con clics sucesivos

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** X.
**Historia:** Como revisor con varias URLs en el objeto, quiero rotar entre ellas.
**Criterios:** **Dado** N URLs, **cuando** clic sucesivo en 🔗, **entonces** se abre la siguiente (módulo N).
**Deps:** Bloqueada por HU-17.021.
**Prioridad:** C. **Tamaño:** S. **Etiquetas:** [ux, rotacion].

---

### HU-17.023 — Eliminar fila de URL desde el modal

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador, quiero eliminar URLs ya no útiles.
**Criterios:** **Dado** clic en "Eliminar" en una fila, **cuando** la acción termina, **entonces** la URL se quita de `entidad.urls`.
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-17.018.
**Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [ui, eliminar, url].

---

### HU-17.024 — Activar vista plegado parcial [absorbida en HU-18.001]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-18.001.

---

### HU-17.025 — Ver rasgos exhibidos como filas interiores [absorbida en HU-18.002]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-18.002.

---

### HU-17.026 — Extraer rasgo de plegado parcial al canvas [absorbida en HU-18.004]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-18.004.

---

### HU-17.027 — OPL `lista A y B como rasgos.` en plegado parcial

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** L.
**Historia:** Como modelador experto, quiero que el OPL describa el plegado parcial en una sola oración.
**Criterios:** **Dado** plegado parcial activo con N rasgos, **cuando** OPL emite, **entonces** aparece: `**Padre** lista **A**, **B** y **C** como rasgos.`
**Patrones:** HU-SHARED-007. **Deps:** Bloqueada por HU-18.001.
**Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [opl, plegado-parcial].

---

### HU-17.028 — Navegar a OPD `SDn: <Obj> desplegado` con Mostrar despliegue

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador experto, quiero abrir el OPD del despliegue estructural del objeto.
**Criterios:** **Dado** objeto con despliegue, **cuando** elijo "Mostrar despliegue", **entonces** se navega al OPD hijo `SDn: <Obj> desplegado`.
**Patrones:** análogo a HU-12.025. **Deps:** Bloqueada por HU-10.002.
**Evidencia:** [Glos 3.81]. Clase: observado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [navegacion, despliegue].

---

### HU-17.029 — Mostrar múltiples apariencias del mismo objeto en un OPD

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como modelador experto, quiero tener varias apariencias de la misma entidad en un OPD para reducir cruces de enlaces.
**Criterios:**
- **Dado** una entidad, **cuando** arrastro otra apariencia desde biblioteca, **entonces** se crea segunda `apariencia` con mismo `entidadId`.
- **Dado** renombro la entidad, **cuando** la operación termina, **entonces** todas las apariencias muestran el nuevo nombre.
**Modelo:** múltiples `apariencia` con mismo `entidadId`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-10.001/002.
**Evidencia:** [V-95]. Clase: confirmado.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [kernel, apariencia, multi-instancia].

---

### HU-17.030 — Navegar de entidad a apariencias desde biblioteca con sufijo `de <padre>`

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador experto, quiero ver las apariencias listadas en biblioteca con sufijo del OPD donde residen.
**Criterios:** **Dado** una entidad con N apariencias, **cuando** la biblioteca se renderiza, **entonces** aparecen N entradas `Nombre (de SD2)` etc.
**Deps:** Bloqueada por HU-17.029.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, biblioteca, navegacion].

---

### HU-17.031 — Designar estado como Inicial / Final [absorbida]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-13.010 + HU-13.011.

---

### HU-17.032 — Designar estado como Current / Default [absorbida]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-13.012 + HU-13.013.

---

### HU-17.033 — Permitir Inicial + Final simultáneos en un mismo estado

**Actor primario:** IS. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como ingeniero de simulación, quiero que un estado pueda ser Inicial y Final a la vez (objetos transientes).
**Criterios:** **Dado** un estado con `designaciones = ["inicial", "final"]`, **cuando** valido, **entonces** la operación pasa (no exclusión).
**Modelo:** `estado.designaciones`. **Deps:** Bloqueada por HU-13.010, HU-13.011.
**Evidencia:** [Glos 3.71a]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [kernel, designacion, combinacion].

---

### HU-17.034 — Configurar Duración del estado con unidad + min/nominal/max

**Actor primario:** IS. **Tipo:** opm-semantica. **Nivel:** K primario.
**Historia:** Como ingeniero de simulación, quiero parametrizar la duración temporal de un estado con valores mínimo, nominal y máximo.
**Criterios:**
- **Dado** un estado, **cuando** configuro `duracion = { unidad: "s", min: 1, nominal: 5, max: 10 }`, **entonces** el campo se persiste.
- **Dado** OPL emite, **entonces** aparece formato canónico `${min}, ${nominal}, y ${max} ${unit} Duración Mínima, Esperada y Máxima, respectivamente.` [JOYAS §9]
**Modelo:** `estado.duracion: { unidad, min, nominal, max }` `[propuesta]`. **Patrones:** HU-SHARED-002.
**Evidencia:** [Glos 3.71a]. [JOYAS §9]. Clase: confirmado.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [kernel, estado, duracion].

---

## 4. Preguntas abiertas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q17.1 | Política de unidades: ¿catálogo controlado o texto libre? | HU-17.011 |
| Q17.2 | ¿OSLC requiere autenticación remota o solo URL? | HU-17.019 |
| Q17.3 | ¿Múltiples apariencias se renombran automáticamente o requieren acción explícita? | HU-17.029 |

## 5. Referencias cruzadas

- Patrones: HU-SHARED-001, HU-SHARED-002, HU-SHARED-007.
- Bloqueada por: EPICA-10, EPICA-11, EPICA-13, EPICA-18.
- Bloquea a: EPICA-A0 (estereotipos), EPICA-B0 (simulación), EPICA-C1 (URL runtime).
