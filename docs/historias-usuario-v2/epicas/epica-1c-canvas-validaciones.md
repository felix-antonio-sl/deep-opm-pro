---
epica: "EPICA-1C"
titulo: "Canvas — validaciones (interior/exterior, nombres duplicados, verificación metodológica, alcance de eliminación)"
slug: "canvas-validaciones"
doc_fuente: "opcloud-reverse/1c-canvas-validaciones.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M1"
hu_emitidas: 22
hu_canonicas: 17
hu_stubs: 5
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Validaciones del kernel OPM: pertenencia interior/exterior en contenedores descompuestos [V-1 §1.2], detección de nombres duplicados [Glos 3.76], panel "Verificación metodológica" con reglas SSOT, y diálogo "Elegir alcance de eliminación" para cosas multi-apariencia. Las validaciones operan como guardas que pueden bloquear, advertir o sugerir según severidad.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo |
|---|---|---|---|---|---|
| HU-1C.001 | Detectar solapamiento de cosa externa sobre contenedor descompuesto | ME | M1 | M | opm-semantica |
| HU-1C.002 | Expulsar con snap correctivo la cosa externa hacia afuera | ME | M1 | S | mixto |
| HU-1C.003 | Mostrar advertencia textual de interior/exterior en esquina | MN | M1 | S | opcloud-ui |
| HU-1C.004 | Crear cosa interna directamente dentro del contenedor | MN | M0 | S | opm-semantica |
| HU-1C.005 | Crear cosa interna arrastrando desde biblioteca | ME | M1 | S | opm-semantica |
| HU-1C.006 | Preservar externalidad al agrandar el contenedor sobre una cosa | ME | M1 | S | opm-semantica |
| HU-1C.007 | Detectar colisión nominal [absorbida en HU-SHARED-009] | — | — | — | — |
| HU-1C.008 | Abrir diálogo de nombre duplicado con lista de OPDs | MN | M1 | M | opcloud-ui |
| HU-1C.009 | Reusar cosa existente con "Usar Existente" | ME | M1 | M | opm-semantica |
| HU-1C.010 | Renombrar la cosa actual [absorbida en HU-SHARED-004] | — | — | — | — |
| HU-1C.011 | Bloquear "Usar Existente" cuando tipo o refinamiento son incompatibles | ME | M1 | S | opm-semantica |
| HU-1C.012 | Serializar nombre por defecto ante colisión [absorbida en HU-SHARED-009] | — | — | — | — |
| HU-1C.013 | Abrir panel "Verificación metodológica" desde toolbar | MN | M1 | S | opcloud-ui |
| HU-1C.014 | Ejecutar 5 reglas metodológicas canónicas OPM | IS | M1 | L | opm-semantica |
| HU-1C.015 | Indicar severidad (error / advertencia / info) con color y símbolo | MN | M1 | S | mixto |
| HU-1C.016 | Abrir lista "Cosas inválidas" con detalle por regla | IS | M1 | M | opcloud-ui |
| HU-1C.017 | Navegar al elemento inválido desde la lista | IS | M1 | S | opcloud-ui |
| HU-1C.018 | Revalidar regla on-demand tras corrección | IS | M1 | S | opm-semantica |
| HU-1C.019 | Citar sección SSOT OPM en cada regla metodológica | MN | M1 | S | opcloud-ui |
| HU-1C.020 | Abrir "Elegir alcance de eliminación" [absorbida en HU-SHARED-005] | — | — | — | — |
| HU-1C.021 | Listar apariciones del elemento con clic-para-enfocar | ME | M1 | S | opcloud-ui |
| HU-1C.022 | Ejecutar los tres scopes del "Elegir alcance" [absorbida en HU-SHARED-005] | — | — | — | — |

19 canónicas, 3 stubs (más HU-1C.020 y HU-1C.022 absorbidas).

## 3. Historias de usuario

### HU-1C.001 — Detectar solapamiento de cosa externa sobre contenedor descompuesto

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K primario; V secundario.
**Historia:** Como modelador experto, quiero que el sistema detecte cuando intento mover una cosa externa al interior de un contenedor descompuesto.
**Criterios:** **Dado** una cosa externa al contenedor, **cuando** la arrastro al interior, **entonces** el sistema detecta el solapamiento y reacciona según severidad (HU-1C.002 o advertencia HU-1C.003).
**Modelo:** validación sobre `apariencia.*` con relación a contenedor padre.
**Deps:** Bloqueada por HU-12.008. **Evidencia:** [V-1]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [validacion, contenedor].

---

### HU-1C.002 — Expulsar con snap correctivo la cosa externa hacia afuera

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** V.
**Historia:** Como modelador, quiero que al detectar solapamiento la cosa se expulse automáticamente al borde exterior.
**Criterios:** **Dado** detección (HU-1C.001), **cuando** suelto, **entonces** la apariencia se reposiciona automáticamente fuera del contenedor.
**Modelo:** ajuste de `apariencia.x`, `apariencia.y`. **Deps:** Bloqueada por HU-1C.001.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [validacion, snap, contenedor].

---

### HU-1C.003 — Mostrar advertencia textual de interior/exterior en esquina superior

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador novato, quiero ver advertencia explicativa cuando hay conflicto interior/exterior.
**Criterios:** texto en esquina superior describiendo la regla violada con cita SSOT [V-1].
**Deps:** Bloqueada por HU-1C.001. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, advertencia, validacion].

---

### HU-1C.004 — Crear cosa interna correcta directamente dentro del contenedor

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como modelador, quiero crear cosas internas con el gesto correcto desde el inicio.
**Criterios:** **Dado** arrastro al interior del contenedor desde la barra principal, **cuando** la creación termina, **entonces** la `apariencia.opdId = opdHijo.id` y la cosa queda interna sin advertencia.
**Modelo:** ver HU-12.018. **Deps:** Bloqueada por HU-12.003.
**Evidencia:** [V-1], [Glos 3.31]. Clase: confirmado.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [kernel, creacion, contenedor].

---

### HU-1C.005 — Crear cosa interna arrastrando desde biblioteca

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como modelador experto, quiero traer cosas existentes al interior de un contenedor.
**Criterios:** **Dado** arrastro desde biblioteca al interior, **cuando** suelto, **entonces** se crea `apariencia` interna preservando entidad única.
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-10.017.
**Evidencia:** [V-1]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, biblioteca].

---

### HU-1C.006 — Preservar externalidad al agrandar el contenedor sobre una cosa

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como modelador, quiero que al agrandar un contenedor, las cosas externas no queden "absorbidas" automáticamente.
**Criterios:** **Dado** una cosa externa adyacente, **cuando** agrando contenedor sobre ella, **entonces** la cosa se mantiene externa (no migra a `opdHijo.id`).
**Deps:** Bloqueada por HU-12.021. **Evidencia:** [V-1]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, validacion, externalidad].

---

### HU-1C.007 — Detectar colisión nominal [absorbida en HU-SHARED-009]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-SHARED-009.

---

### HU-1C.008 — Abrir diálogo de nombre duplicado con lista de OPDs existentes

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero ver dónde existe la cosa con el mismo nombre antes de decidir reusar o renombrar.
**Criterios:** **Dado** nombre colisiona, **cuando** confirmo creación, **entonces** se abre diálogo con lista de OPDs donde existe la cosa colisionada.
**Patrones:** HU-SHARED-009. **Deps:** Bloqueada por HU-SHARED-009.
**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [ui, validacion, duplicado].

---

### HU-1C.009 — Reusar cosa existente con "Usar Existente"

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como modelador experto, quiero, ante colisión nominal, reusar la entidad existente en lugar de crear duplicado.
**Criterios:** **Dado** diálogo HU-1C.008, **cuando** elijo "Usar Existente", **entonces** se cancela la creación y se materializa una `apariencia` adicional para la entidad existente (HU-12.007).
**Modelo:** nueva `apariencia.entidadId = existente.id`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-1C.008. **Evidencia:** [V-1], [V-95]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [kernel, reuso, apariencia].

---

### HU-1C.010 — Renombrar la cosa actual [absorbida en HU-SHARED-004]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-SHARED-004.

---

### HU-1C.011 — Bloquear "Usar Existente" cuando tipo o refinamiento son incompatibles

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como modelador experto, quiero que el sistema no me deje reusar una cosa cuando los tipos no coinciden (ej. existe `Vehículo` como objeto pero quiero crear `Vehículo` como proceso).
**Criterios:** **Dado** colisión con tipo distinto, **cuando** abro diálogo, **entonces** "Usar Existente" está deshabilitado con explicación.
**Deps:** Bloqueada por HU-1C.008. **Evidencia:** [V-239], [V-240]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, validacion, tipo].

---

### HU-1C.012 — Serializar nombre por defecto [absorbida en HU-SHARED-009]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-SHARED-009.

---

### HU-1C.013 — Abrir panel "Verificación metodológica" desde toolbar

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero un panel donde se ejecuten las reglas metodológicas OPM y se reporten violaciones.
**Criterios:** **Dado** ítem "Verificación" en menú, **cuando** clico, **entonces** se abre panel lateral con lista de reglas y resultados.
**Deps:** Bloqueada por HU-10.001. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, panel, validacion].

---

### HU-1C.014 — Ejecutar 5 reglas metodológicas canónicas OPM

**Actor primario:** IS. **Tipo:** opm-semantica. **Nivel:** K primario.
**Historia:** Como ingeniero de simulación, quiero ejecutar reglas SSOT clave para validar el modelo.
**Criterios:**
- **Dado** clic en "Ejecutar verificación", **cuando** termina, **entonces** se reportan resultados de las 5 reglas:
  1. Cosa con estados ⇒ ≥ 2 estados [V-237], [V-238].
  2. Tipo de enlace válido para par origen/destino [V-239], [V-240].
  3. Agente requiere objeto físico [Glos 3.3].
  4. Procesos descompuestos preservan entidad única [V-95]–[V-97].
  5. Nombres únicos por tipo dentro del modelo [Glos 3.76].
- Cada regla reporta lista de elementos en violación con severidad.

**Modelo:** lente derivada de validaciones. **Deps:** Bloqueada por HU-1C.013.
**Evidencia:** [V-239], [V-240], [Glos 3.39], [Glos 3.58], [Glos 3.71a]. Clase: confirmado por SSOT.
**Prioridad:** M1. **Tamaño:** L. **Etiquetas:** [kernel, validacion, metodologia].

---

### HU-1C.015 — Indicar severidad (error / advertencia / info) con color y símbolo

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** V.
**Historia:** Como modelador, quiero distinguir visualmente la severidad de cada violación.
**Criterios:** rojo para error, ámbar para advertencia, azul para info; con símbolos ⛔ ⚠ ℹ.
**Deps:** Bloqueada por HU-1C.014. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, severidad, color].

---

### HU-1C.016 — Abrir lista "Cosas inválidas" con detalle por regla

**Actor primario:** IS. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como ingeniero, quiero ver la lista detallada de cosas que violan cada regla.
**Criterios:** click en una regla expande lista con elementos, ID y descripción de la violación.
**Deps:** Bloqueada por HU-1C.014. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [ui, lista, violacion].

---

### HU-1C.017 — Navegar al elemento inválido desde "Cosas inválidas"

**Actor primario:** IS. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como ingeniero, quiero saltar al elemento en el canvas con un clic.
**Criterios:** clic en una entrada → cambia OPD activo, hace zoom-fit y selecciona apariencia.
**Patrones:** HU-SHARED-008. **Deps:** Bloqueada por HU-1C.016.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [navegacion, validacion].

---

### HU-1C.018 — Revalidar regla on-demand tras corrección del modelo

**Actor primario:** IS. **Tipo:** mixto. **Nivel:** K.
**Historia:** Como ingeniero, quiero ejecutar la verificación de nuevo después de corregir.
**Criterios:** botón "Revalidar" rerun y refresca lista. Optionalmente revalidación automática tras cada cambio.
**Deps:** Bloqueada por HU-1C.014. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [validacion, revalidar].

---

### HU-1C.019 — Citar sección SSOT OPM en cada regla metodológica

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero saber qué regla SSOT respalda cada validación para entender la base teórica.
**Criterios:** cada regla muestra cita formato `[V-xxx]` o `[Glos 3.x]` con link a la sección SSOT.
**Deps:** Bloqueada por HU-1C.014. **Evidencia:** [V-239]. Clase: observado + canonizado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, ssot, trazabilidad].

---

### HU-1C.020 — Abrir "Elegir alcance de eliminación" [absorbida en HU-SHARED-005]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-SHARED-005.

---

### HU-1C.021 — Listar apariciones del elemento con clic-para-enfocar

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador experto, quiero ver todas las apariencias de una entidad antes de decidir alcance de eliminación.
**Criterios:** **Dado** diálogo de eliminación, **cuando** se renderiza, **entonces** lista todas las `apariencia` con OPD y clic navega.
**Patrones:** HU-SHARED-005. **Deps:** Bloqueada por HU-SHARED-005.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, lista, apariciones].

---

### HU-1C.022 — Ejecutar los tres scopes [absorbida en HU-SHARED-005]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-SHARED-005.

---

## 4. Preguntas abiertas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q1C.1 | ¿Las 5 reglas metodológicas son fijas o configurables por organización? | HU-1C.014 |
| Q1C.2 | ¿Revalidación automática tras cada cambio o solo on-demand? | HU-1C.018 |
| Q1C.3 | ¿Severidad de "Agente requiere objeto físico" es error o advertencia (HU-10.013/Q10.4)? | HU-1C.014 |

## 5. Referencias cruzadas

- Patrones: HU-SHARED-002, HU-SHARED-004, HU-SHARED-005, HU-SHARED-008, HU-SHARED-009.
- Bloqueada por: EPICA-10, EPICA-11, EPICA-12.
- Bloquea a: EPICA-A0, EPICA-A1 (validaciones de stereotypes/requirements).
