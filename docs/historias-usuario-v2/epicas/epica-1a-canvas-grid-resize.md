---
epica: "EPICA-1A"
titulo: "Canvas — cuadrícula, imán, redimensión y alineación"
slug: "canvas-grid-resize"
doc_fuente: "opcloud-reverse/1a-canvas-grid-resize.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M1"
hu_emitidas: 18
hu_canonicas: 18
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Cuadrícula ortogonal, imán de cuantización, redimensión manual/automática de cosas con preservación del rótulo, y alineación/distribución de selección múltiple. La SSOT no prescribe estos comportamientos — son afordances UI estándar. Persistencia de preferencias por modelo (no por organización).

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo |
|---|---|---|---|---|---|
| HU-1A.001 | Crear cosa con tamaño mínimo por defecto en auto-sizing | MN | M0 | S | opcloud-ui |
| HU-1A.002 | Ajustar cosa a su rótulo con "Ajustar al texto" | MN | M1 | S | opcloud-ui |
| HU-1A.003 | Pasar cosa a modo manual con "Alternar auto-tamaño" | ME | M1 | S | opcloud-ui |
| HU-1A.004 | Redimensionar cosa arrastrando handle lateral | ME | M1 | M | opcloud-ui |
| HU-1A.005 | Redimensionar cosa arrastrando handle de esquina | ME | M1 | M | opcloud-ui |
| HU-1A.006 | Proteger rótulo contra compresión excesiva en manual | ME | M1 | S | opcloud-ui |
| HU-1A.007 | Volver a auto-tamaño preservando contenido | ME | M1 | XS | opcloud-ui |
| HU-1A.008 | Persistir ancho, alto y modo de tamaño por cosa | ME | M0 | S | opcloud-ui |
| HU-1A.009 | Activar cuadrícula ortogonal con toggle | ME | M1 | S | opcloud-ui |
| HU-1A.010 | Cuantizar movimiento de cosa al paso de cuadrícula | ME | M1 | M | opcloud-ui |
| HU-1A.011 | Configurar tamaño de cuadrícula como incremento del imán | ME | S | S | opcloud-ui |
| HU-1A.012 | Configurar color y grosor de la cuadrícula | AO | C | S | opcloud-ui |
| HU-1A.013 | Configurar factor de escala de la cuadrícula | AO | C | S | opcloud-ui |
| HU-1A.014 | Persistir preferencias de cuadrícula fuera del diagrama exportado | ME | S | S | opcloud-ui |
| HU-1A.015 | Redimensionar multi-selección preservando modo por cosa | ME | S | M | opcloud-ui |
| HU-1A.016 | Bloquear relación de aspecto durante redimensión con Shift | ME | C | S | opcloud-ui |
| HU-1A.017 | Alinear cosas seleccionadas por eje (izq/centro/der/sup/medio/inf) | ME | S | M | opcloud-ui |
| HU-1A.018 | Distribuir cosas seleccionadas con espaciado uniforme | ME | S | M | opcloud-ui |

18 canónicas.

## 3. Historias de usuario

### HU-1A.001 — Crear cosa con tamaño mínimo por defecto en auto-sizing

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero que las cosas nuevas tengan tamaño mínimo automático calculado al rótulo.
**Criterios:** **Dado** creo cosa, **cuando** se renderiza, **entonces** `apariencia.modoTamano = "auto"` `[propuesta]` y dimensiones calculadas por `getParagraphWidth`/`getParagraphHeight`. [JOYAS §3]
**Modelo:** `apariencia.modoTamano: "auto" | "manual"` `[propuesta]`. **Deps:** Bloqueada por HU-10.001.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [render, autosizing].

---

### HU-1A.002 — Ajustar cosa a su rótulo con "Ajustar al texto"

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero ajustar el tamaño de una cosa al exacto del rótulo.
**Criterios:** **Dado** elijo "Ajustar al texto", **cuando** la operación termina, **entonces** dimensiones se calculan al rótulo y `modoTamano = "auto"`.
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-1A.001.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [render, fit].

---

### HU-1A.003 — Pasar cosa a modo manual con "Alternar auto-tamaño"

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador experto, quiero pasar a modo manual para luego redimensionar libremente.
**Criterios:** `apariencia.modoTamano = "manual"`. **Deps:** Bloqueada por HU-1A.001.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [render, manual].

---

### HU-1A.004 — Redimensionar cosa arrastrando handle lateral

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador experto, quiero arrastrar handles laterales para cambiar solo ancho o alto.
**Criterios:** **Dado** modo manual, **cuando** arrastro handle de borde, **entonces** se ajusta solo la dimensión correspondiente.
**Modelo:** `apariencia.width` o `apariencia.height`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-1A.003. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [render, redimension].

---

### HU-1A.005 — Redimensionar cosa arrastrando handle de esquina

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador experto, quiero arrastrar handle de esquina para ajustar ancho y alto a la vez.
**Criterios:** análogo a HU-1A.004 con ambas dimensiones.
**Deps:** Bloqueada por HU-1A.003. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [render, redimension].

---

### HU-1A.006 — Proteger rótulo contra compresión excesiva en manual

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador experto, quiero que el sistema impida reducir la cosa a un tamaño menor al del rótulo.
**Criterios:** **Dado** intento reducir bajo el mínimo del texto, **cuando** la operación termina, **entonces** la dimensión se clampa al mínimo calculado.
**Deps:** Bloqueada por HU-1A.004. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [render, proteccion, rotulo].

---

### HU-1A.007 — Volver a auto-tamaño preservando contenido

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador experto, quiero volver a auto-tamaño después de manual.
**Criterios:** `modoTamano = "auto"` y dimensiones se recalculan.
**Deps:** Bloqueada por HU-1A.003. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [render, auto].

---

### HU-1A.008 — Persistir ancho, alto y modo de tamaño por cosa

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador, quiero que dimensiones y modo se preserven entre sesiones.
**Criterios:** `apariencia.width`, `apariencia.height`, `apariencia.modoTamano` se persisten.
**Deps:** Bloqueada por HU-1A.001, HU-30.001.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [persistencia, dimensiones].

---

### HU-1A.009 — Activar cuadrícula ortogonal con toggle

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador experto, quiero activar/desactivar cuadrícula visible.
**Criterios:** `ui.cuadriculaActiva: boolean` toggle desde menú "Vista".
**Deps:** Bloqueada por HU-10.001. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [render, cuadricula, toggle].

---

### HU-1A.010 — Cuantizar movimiento de cosa al paso de cuadrícula

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador experto, quiero que arrastrar cuantice al paso para alinear de forma consistente.
**Criterios:** **Dado** cuadrícula activa con `paso = N`, **cuando** arrastro, **entonces** `apariencia.x` y `apariencia.y` se redondean al múltiplo de N.
**Modelo:** `ui.cuadriculaPaso: number` `[propuesta]`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-1A.009. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [render, snap, cuantizacion].

---

### HU-1A.011 — Configurar tamaño de cuadrícula como incremento del imán

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** C.
**Historia:** Como modelador, quiero ajustar el paso de la cuadrícula (10, 20, 50 px).
**Criterios:** input numérico en panel "Vista". Default 10px.
**Deps:** Bloqueada por HU-1A.009. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [config, cuadricula].

---

### HU-1A.012 — Configurar color y grosor de la cuadrícula

**Actor primario:** AO. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como administrador, quiero personalizar visual de la cuadrícula.
**Criterios:** `ui.cuadriculaColor`, `ui.cuadriculaGrosor` configurables.
**Deps:** Bloqueada por HU-1A.009. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [config, render, cuadricula].

---

### HU-1A.013 — Configurar factor de escala de la cuadrícula

**Actor primario:** AO. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como administrador, quiero un factor multiplicador para la cuadrícula (cada N pasos línea más gruesa).
**Criterios:** parámetro `cuadriculaEscalaFactor`.
**Deps:** Bloqueada por HU-1A.011. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [config].

---

### HU-1A.014 — Persistir preferencias de cuadrícula fuera del diagrama exportado

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador, quiero que la cuadrícula sea solo de edición y no aparezca en exportes (PDF/SVG).
**Criterios:** `cuadriculaActiva` se preserva en sesión pero se filtra del exporte.
**Deps:** Bloqueada por HU-1A.009, EPICA-60.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [persistencia, export, separacion].

---

### HU-1A.015 — Redimensionar multi-selección preservando modo por cosa

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador experto, quiero redimensionar varias cosas a la vez sin alterar el modo (auto/manual) de cada una.
**Criterios:** **Dado** multi-selección, **cuando** redimensiono, **entonces** las cosas con `modoTamano = "auto"` no se alteran y solo las "manual" se ajustan.
**Patrones:** HU-SHARED-002, HU-SHARED-008. **Deps:** Bloqueada por HU-1A.004.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [batch, redimension].

---

### HU-1A.016 — Bloquear relación de aspecto durante redimensión con Shift

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador experto, quiero mantener proporciones durante redimensión sosteniendo Shift.
**Criterios:** **Dado** redimensiono con Shift, **cuando** la acción termina, **entonces** se preserva `width / height` original.
**Deps:** Bloqueada por HU-1A.005. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [redimension, aspecto, atajo].

---

### HU-1A.017 — Alinear cosas seleccionadas por eje (izq/centro/der/sup/medio/inf)

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero alinear varias cosas a un mismo eje.
**Criterios:**
- **Dado** multi-selección, **cuando** elijo "Alinear izquierda", **entonces** todas las apariencias adoptan el `x` mínimo del conjunto.
- Los seis ejes (left/center/right/top/middle/bottom) son acciones independientes en menú "Alinear".
**Modelo:** `apariencia.x` o `apariencia.y` de cada seleccionada.
**Patrones:** HU-SHARED-002, HU-SHARED-008. **Deps:** Bloqueada por HU-SHARED-008.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [alineacion, batch].

---

### HU-1A.018 — Distribuir cosas seleccionadas con espaciado uniforme

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero distribuir uniformemente las apariencias en horizontal o vertical.
**Criterios:** **Dado** ≥ 3 apariencias seleccionadas, **cuando** elijo "Distribuir horizontal", **entonces** la separación entre ellas es uniforme.
**Patrones:** HU-SHARED-002, HU-SHARED-008. **Deps:** Bloqueada por HU-SHARED-008.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [distribucion, batch].

---

## 4. Preguntas abiertas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q1A.1 | Default del paso de cuadrícula (10/15/20px). | HU-1A.011 |
| Q1A.2 | ¿La cuadrícula se persiste por modelo o por preferencias del usuario? | HU-1A.014 |
| Q1A.3 | ¿"Distribuir" considera tamaños de las apariencias o solo posiciones? | HU-1A.018 |

## 5. Referencias cruzadas

- Patrones: HU-SHARED-002, HU-SHARED-008.
- Bloqueada por: EPICA-10, EPICA-30 (persistencia).
