---
epica: "EPICA-1B"
titulo: "Canvas — operaciones de traer conectados (hidratar OPD con cosas y enlaces existentes)"
slug: "canvas-operaciones-bring"
doc_fuente: "opcloud-reverse/1b-canvas-operaciones-bring.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M1"
hu_emitidas: 16
hu_canonicas: 16
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Operaciones para "traer" cosas y enlaces existentes en otros OPDs al OPD actual sin recrearlos. Materializa apariencias adicionales preservando entidades únicas (HU-12.007). El kernel OPM no exige estas operaciones; son afordances UI para gestión de contexto entre OPDs.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo |
|---|---|---|---|---|---|
| HU-1B.001 | Activar "Traer conectados" desde toolbar contextual | ME | M1 | S | mixto |
| HU-1B.002 | Elegir familias de enlace en diálogo Traer conectados | ME | M1 | M | mixto |
| HU-1B.003 | Materializar cosas conectadas directamente al OPD actual | ME | M1 | M | mixto |
| HU-1B.004 | Respetar conectividad directa sin propagar por jerarquía | ME | M1 | S | mixto |
| HU-1B.005 | Activar "Traer conectados" desde halo con default | ME | M1 | S | mixto |
| HU-1B.006 | Configurar default de "Traer conectados" en preferencias | ME | S | S | opcloud-ui |
| HU-1B.007 | Seleccionar múltiples cosas para habilitar traer-enlaces | ME | M1 | S | mixto |
| HU-1B.008 | Activar "Traer enlaces entre seleccionadas" desde toolbar | ME | M1 | S | mixto |
| HU-1B.009 | Traer únicamente enlaces internos a la selección múltiple | ME | M1 | M | opm-semantica |
| HU-1B.010 | Evitar duplicar apariencia si la cosa ya está visible | ME | M1 | S | opm-semantica |
| HU-1B.011 | Recalcular ruteo y posición de las cosas traídas | ME | M1 | M | mixto |
| HU-1B.012 | Persistir apariencia creada en la sesión del OPD | ME | M1 | M | opm-semantica |
| HU-1B.013 | No generar oraciones OPL nuevas al traer cosa existente | ME | M1 | XS | opm-semantica |
| HU-1B.014 | Ver burbuja sugiriendo contexto relacional oculto | MN | S | S | opcloud-ui |
| HU-1B.015 | Ocultar cosa del OPD actual sin borrarla del modelo (reverso) | ME | M1 | M | opm-semantica |
| HU-1B.016 | No producir cambio si ninguna familia coincide | ME | M1 | XS | opm-semantica |

16 canónicas.

## 3. Historias de usuario

### HU-1B.001 — Activar "Traer conectados" desde toolbar contextual

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** U.
**Historia:** Como modelador experto, quiero invocar "Traer cosas conectadas" sobre una apariencia para hidratar el OPD con entidades relacionadas.
**Criterios:** **Dado** apariencia seleccionada, **cuando** elijo "Traer conectados", **entonces** se abre diálogo de selección de familias (HU-1B.002).
**Patrones:** HU-SHARED-001. **Deps:** Bloqueada por HU-10.001.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, traer, contexto].

---

### HU-1B.002 — Elegir familias de enlace en diálogo

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** U.
**Historia:** Como modelador experto, quiero filtrar qué familias de enlace traer (estructurales, procedurales) para no inundar el OPD.
**Criterios:** **Dado** diálogo abierto, **cuando** marco familias y confirmo, **entonces** se invoca HU-1B.003 con esos filtros.
**Modelo:** UI transitoria. **Deps:** Bloqueada por HU-1B.001.
**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [ui, filtro].

---

### HU-1B.003 — Materializar cosas conectadas directamente al OPD actual

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K primario.
**Historia:** Como modelador experto, quiero que las entidades vecinas (origen/destino de los enlaces seleccionados) aparezcan en el OPD actual.
**Criterios:** **Dado** filtros aplicados, **cuando** confirmo, **entonces** para cada `enlace` con extremo en la apariencia de origen, se crea `apariencia` para la entidad vecina en el OPD actual y `aparienciaEnlace` para el enlace.
**Modelo:** múltiples `apariencia.*`, `aparienciaEnlace.*`.
**Patrones:** HU-SHARED-002, HU-SHARED-007. **Deps:** Bloqueada por HU-1B.002.
**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [kernel, materializacion, contexto].

---

### HU-1B.004 — Respetar conectividad directa sin propagar por jerarquía

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K.
**Historia:** Como modelador, quiero que la operación traiga solo vecinos directos (no transitivamente).
**Criterios:** **Dado** A → B → C, **cuando** traigo conectados de A, **entonces** se materializa B pero no C.
**Deps:** Bloqueada por HU-1B.003. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, scope].

---

### HU-1B.005 — Activar "Traer conectados" desde halo con default

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** U.
**Historia:** Como modelador experto, quiero un acceso rápido desde el halo (botón en cosa seleccionada) que use defaults.
**Criterios:** **Dado** halo activo, **cuando** clico botón "↓ Traer", **entonces** se ejecuta HU-1B.003 con familias del default.
**Deps:** Bloqueada por HU-1B.001.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, halo, atajo].

---

### HU-1B.006 — Configurar default de "Traer conectados" en preferencias

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** C.
**Historia:** Como modelador, quiero configurar qué familias se traen por default sin abrir diálogo.
**Criterios:** preferencias de usuario con familias activas.
**Modelo:** `usuario.preferencias.traerDefault` `[propuesta]`.
**Deps:** Bloqueada por HU-1B.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [config, default].

---

### HU-1B.007 — Seleccionar múltiples cosas para habilitar traer-enlaces

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** U.
**Historia:** Como modelador experto, quiero que con multi-selección aparezca la opción de traer enlaces internos.
**Criterios:** **Dado** ≥ 2 apariencias seleccionadas, **cuando** abro menú, **entonces** aparece opción "Traer enlaces entre seleccionadas".
**Patrones:** HU-SHARED-008. **Deps:** Bloqueada por HU-SHARED-008.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, multi-seleccion].

---

### HU-1B.008 — Activar "Traer enlaces entre seleccionadas" desde toolbar

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K.
**Historia:** Como modelador experto, quiero materializar todos los enlaces que existen entre las cosas que ya seleccioné.
**Criterios:** **Dado** selección de N cosas con M enlaces entre ellas no visibles, **cuando** confirmo, **entonces** los M enlaces aparecen como `aparienciaEnlace` en el OPD actual.
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-1B.007.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, traer, enlace].

---

### HU-1B.009 — Traer únicamente enlaces internos a la selección múltiple

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K.
**Historia:** Como modelador experto, quiero que se traigan solo los enlaces cuyo origen y destino están en la selección, ignorando los que conectan a cosas fuera.
**Criterios:** **Dado** selección de A, B, C y enlaces A→B (interno), B→D (externo), **cuando** confirmo, **entonces** se trae solo A→B.
 **Patrones:** HU-SHARED-008 (mecánica detectada por audit-hu.mjs). **Deps:** Bloqueada por HU-1B.008. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [kernel, scope, traer].

---

### HU-1B.010 — Evitar duplicar apariencia si la cosa ya está visible

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K.
**Historia:** Como modelador, quiero que traer no duplique apariencias para una entidad que ya está visible en el OPD actual.
**Criterios:** **Dado** entidad X tiene `apariencia` en el OPD actual, **cuando** se ejecuta traer, **entonces** se omite la creación duplicada y solo se traen los enlaces que la conectan.
**Deps:** Bloqueada por HU-1B.003. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, idempotencia].

---

### HU-1B.011 — Recalcular ruteo y posición de las cosas traídas

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** V.
**Historia:** Como modelador, quiero que las cosas traídas se posicionen automáticamente cerca del origen sin solapar.
**Criterios:** **Dado** se traen N cosas, **cuando** se renderizan, **entonces** se distribuyen radialmente alrededor de la apariencia origen, evitando solapamientos.
**Deps:** Bloqueada por HU-1B.003. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [render, layout].

---

### HU-1B.012 — Persistir apariencia creada en la sesión del OPD

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** P.
**Historia:** Como modelador, quiero que las apariencias traídas se preserven al guardar.
**Criterios:** las nuevas `apariencia.*` y `aparienciaEnlace.*` se persisten con el modelo.
**Deps:** Bloqueada por HU-1B.003, HU-30.001. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [persistencia, traer].

---

### HU-1B.013 — No generar oraciones OPL nuevas al traer cosa existente

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** L.
**Historia:** Como modelador, quiero que el OPL no duplique oraciones cuando se trae una cosa que ya tenía oración generada.
**Criterios:** **Dado** OPL ya emite oración para entidad X, **cuando** traigo X a otro OPD, **entonces** OPL del OPD destino genera la oración correspondiente sin duplicar.
**Patrones:** HU-SHARED-007.
**Deps:** Bloqueada por HU-1B.003. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [opl, idempotencia].

---

### HU-1B.014 — Ver burbuja sugiriendo contexto relacional oculto

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador novato, quiero ver una burbuja "..." cerca de una cosa cuando tiene relaciones no visibles para descubrir traer.
**Criterios:** **Dado** entidad con N enlaces no visibles en OPD actual, **cuando** se renderiza, **entonces** aparece badge "···" o número.
**Deps:** Bloqueada por HU-1B.003. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, descubrimiento, badge].

---

### HU-1B.015 — Ocultar cosa del OPD actual sin borrarla del modelo (reverso)

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K.
**Historia:** Como modelador experto, quiero ocultar una apariencia traída sin afectar el modelo.
**Criterios:** **Dado** apariencia, **cuando** elijo "Ocultar de este OPD", **entonces** la `apariencia` se elimina (HU-SHARED-005 scope vista) sin afectar la entidad.
**Patrones:** HU-SHARED-005. **Deps:** Bloqueada por HU-1B.003.
**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [kernel, ocultar].

---

### HU-1B.016 — No producir cambio si ninguna familia coincide con enlaces existentes

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K.
**Historia:** Como modelador, quiero que la operación sea no-op silenciosa si no hay enlaces para traer.
**Criterios:** **Dado** ninguna familia seleccionada coincide con enlaces existentes, **cuando** confirmo, **entonces** no se crea nada y se muestra mensaje "Sin cambios".
**Deps:** Bloqueada por HU-1B.003. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [kernel, no-op].

---

## 4. Preguntas abiertas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q1B.1 | Default de familias para "Traer conectados" desde halo. | HU-1B.005 |
| Q1B.2 | ¿La operación traer es por OPD o también puede traer entre niveles de descomposición? | HU-1B.003 |
| Q1B.3 | Layout automático de cosas traídas: ¿radial, fuerza, o el usuario decide? | HU-1B.011 |

## 5. Referencias cruzadas

- Patrones: HU-SHARED-001, HU-SHARED-002, HU-SHARED-005, HU-SHARED-007, HU-SHARED-008.
- Bloqueada por: EPICA-10, EPICA-11, EPICA-12 (entidades únicas).
