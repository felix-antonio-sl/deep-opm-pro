---
epica: "EPICA-19"
titulo: "Canvas — imágenes incrustadas en cosas (URL, pool, alternar imagen/texto, exportación)"
slug: "canvas-imagenes"
doc_fuente: "opcloud-reverse/19-canvas-imagenes.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 16
hu_canonicas: 16
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Enriquecimiento visual de cosas mediante incrustación de bitmaps. Las imágenes operan en V/U/P/C sin tocar K ni L: toda la épica es opcloud-ui salvo el invariante de OPL que se declara como guarda opm-semantica. Ejes: origen del bitmap (URL pública o pool organizacional con tres ámbitos), render dual por cosa (Imagen/Texto/Imagen+Texto), anulación a nivel OPD, coexistencia con otras features (suprimida en in-zoom/desplegado/estados visibles), persistencia.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-19.001 | Abrir menú de imagen desde barra secundaria con cosa seleccionada | MN | S | S | opcloud-ui | — |
| HU-19.002 | Incrustar imagen en objeto por URL pública | MN | S | M | opcloud-ui | — |
| HU-19.003 | Previsualizar URL antes de confirmar inserción | MN | S | S | opcloud-ui | — |
| HU-19.004 | Insertar imagen desde pool organizacional con selector de ámbito | AD | S | M | opcloud-ui | — |
| HU-19.005 | Guardar imagen en pool con tags obligatorios y ámbito según permisos | AD | S | M | opcloud-ui | — |
| HU-19.006 | Filtrar pool por tag desde caja de búsqueda | AD | S | S | opcloud-ui | — |
| HU-19.007 | Alternar modo Imagen/Texto/Imagen+Texto con clic en insignia | MN | S | S | opcloud-ui | — |
| HU-19.008 | Reabrir ventana de edición con clic derecho sobre insignia | ME | S | S | opcloud-ui | — |
| HU-19.009 | Reemplazar imagen existente desde ventana emergente | ME | S | S | opcloud-ui | — |
| HU-19.010 | Eliminar imagen asociada con botón "Quitar" | ME | S | XS | opcloud-ui | — |
| HU-19.011 | Forzar modo a todo el OPD desde Opciones de Visualización | ME | S | S | opcloud-ui | — |
| HU-19.012 | Suprimir render interior de imagen en cosa con descomposición o desplegado | MN | S | S | opcloud-ui | — |
| HU-19.013 | Resolver exclusión mutua entre imagen y estados visibles | MN | S | S | opcloud-ui | — |
| HU-19.014 | Preservar imágenes en exportación SVG; excluirlas en PDF | RV | C | S | opcloud-ui | — |
| HU-19.015 | Mantener OPL invariante ante estado de imagen | MN | M0 | XS | opm-semantica | [V-63] |
| HU-19.016 | Cachear bitmap remoto y degradar a "Solo texto" ante URL caída | ME | C | M | opcloud-ui | — |

16 canónicas.

## 3. Historias de usuario

### HU-19.001 — Abrir menú de imagen desde barra secundaria con cosa seleccionada

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero un punto de acceso claro al menú de imagen desde la barra secundaria.
**Criterios:** **Dado** cosa seleccionada, **cuando** clico "Imagen" en barra secundaria, **entonces** se abre menú con opciones (URL, pool, eliminar).
**Patrones:** HU-SHARED-008. **Deps:** Bloqueada por HU-10.002.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, imagen, barra].

---

### HU-19.002 — Incrustar imagen en objeto por URL pública con validación de extensión

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** P primario.
**Historia:** Como modelador, quiero pegar una URL pública (PNG/JPG/SVG) para incrustarla.
**Criterios:**
- **Dado** URL ingresada, **cuando** confirmo, **entonces** se valida extensión y `apariencia.imagen = { url, fuente: "publica" }` `[propuesta]`.
- **Dado** extensión inválida, **cuando** confirmo, **entonces** se muestra error.
**Modelo:** `apariencia.imagen` `[propuesta]`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-19.001.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [persistencia, imagen, url].

---

### HU-19.003 — Previsualizar URL antes de confirmar inserción

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero ver una previsualización antes de incrustar.
**Criterios:** **Dado** URL ingresada, **cuando** ingreso URL, **entonces** se muestra previsualización pequeña en el modal.
**Deps:** Bloqueada por HU-19.001.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, previsualizacion].

---

### HU-19.004 — Insertar imagen desde pool organizacional con selector de ámbito

**Actor primario:** AD. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como administrador, quiero insertar imágenes pre-aprobadas del pool organizacional.
**Criterios:**
- **Dado** modal abierto, **cuando** elijo "Pool", **entonces** se muestran imágenes filtradas por ámbito (Privado / Organizacional / Global) según permisos del usuario.
- **Dado** elijo una, **cuando** confirmo, **entonces** `apariencia.imagen = { url, fuente: "pool", ambito }`.
**Modelo:** `apariencia.imagen.fuente`. **Deps:** Bloqueada por HU-19.001, HU-SHARED-003.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [persistencia, pool, ambito].

---

### HU-19.005 — Guardar imagen en pool con tags obligatorios y ámbito según permisos

**Actor primario:** AD. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como administrador, quiero subir imágenes al pool con tags y ámbito controlado.
**Criterios:** **Dado** subo imagen, **cuando** ingreso tags y elijo ámbito, **entonces** se persiste en backend con metadatos.
**Modelo:** `[propuesta]` `pool.imagen`. **Deps:** Bloqueada por HU-19.004.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [admin, pool, propuesta].

---

### HU-19.006 — Filtrar pool por tag desde caja de búsqueda

**Actor primario:** AD. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como administrador con cientos de imágenes, quiero filtrar por tag.
**Criterios:** caja de búsqueda con autocompletado de tags.
**Deps:** Bloqueada por HU-19.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, filtro, pool].

---

### HU-19.007 — Alternar modo Imagen/Texto/Imagen+Texto con clic en insignia

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero alternar entre tres modos de render con un clic.
**Criterios:** **Dado** insignia visible, **cuando** clico izquierdo, **entonces** rota entre `Imagen → Texto → Imagen+Texto → Imagen`.
**Modelo:** `apariencia.modoRender: "imagen" | "texto" | "ambos"` `[propuesta]`.
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-19.002.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, alternador].

---

### HU-19.008 — Reabrir ventana de edición con clic derecho sobre insignia de cámara

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador experto, quiero reabrir el modal con clic derecho.
**Criterios:** **Dado** insignia visible, **cuando** clic derecho, **entonces** se abre modal en modo edición.
**Deps:** Bloqueada por HU-19.002.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, contextual].

---

### HU-19.009 — Reemplazar imagen existente desde ventana emergente en modo edición

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador, quiero reemplazar la imagen sin eliminar antes.
**Criterios:** **Dado** modal en edición, **cuando** ingreso nueva URL, **entonces** la imagen se reemplaza atómicamente.
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-19.008.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [persistencia, reemplazar].

---

### HU-19.010 — Eliminar imagen asociada con botón "Quitar"

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador, quiero quitar la imagen y volver al render textual.
**Criterios:** **Dado** modal en edición, **cuando** clico "Quitar", **entonces** `apariencia.imagen = undefined`.
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-19.008.
**Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [eliminar, imagen].

---

### HU-19.011 — Forzar modo Imagen/Texto/Imagen+Texto a todo el OPD desde Opciones de Visualización

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador experto, quiero forzar el modo de render para todas las cosas del OPD activo.
**Criterios:** **Dado** activo "Forzar modo Imagen", **cuando** la operación termina, **entonces** todas las apariencias del OPD muestran imagen (si la tienen) ignorando `apariencia.modoRender`.
**Modelo:** `opd.modoRenderForzado` `[propuesta]`. **Deps:** Bloqueada por HU-19.007.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, opd, forzar].

---

### HU-19.012 — Suprimir render interior de imagen en cosa con descomposición o desplegado

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero que la imagen no se renderice cuando la cosa tiene descomposición o despliegue activos.
**Criterios:** **Dado** cosa con descomposición y `modoRender = "imagen"`, **cuando** se renderiza, **entonces** la imagen se oculta y se prioriza el render del refinamiento.
**Modelo:** lente con prioridad. **Deps:** Bloqueada por HU-12.008, HU-19.007.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, prioridad, refinamiento].

---

### HU-19.013 — Resolver exclusión mutua entre imagen y estados visibles

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero que cuando un objeto tiene estados visibles, la imagen no se renderice (estados ganan).
**Criterios:** **Dado** objeto con estados, **cuando** modoRender = "imagen", **entonces** estados se renderizan y la imagen se suprime.
**Deps:** Bloqueada por HU-13.001, HU-19.007.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, prioridad, estados].

---

### HU-19.014 — Preservar imágenes en exportación SVG; excluirlas en PDF

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** X.
**Historia:** Como revisor, quiero que las imágenes se preserven al exportar como SVG (vector con `<image>` embed), pero se excluyan en PDF para evitar peso.
**Criterios:** comportamiento configurable; default según ámbito.
**Deps:** Bloqueada por EPICA-60, EPICA-61, HU-19.002.
**Prioridad:** C. **Tamaño:** S. **Etiquetas:** [export, imagen].

---

### HU-19.015 — Mantener OPL invariante ante estado de imagen

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** L.
**Historia:** Como modelador, quiero que la OPL no se altere por presencia o ausencia de imagen — el OPL refleja semántica, no apariencia.
**Criterios:** **Dado** OPL emitido, **cuando** comparo entre estados (imagen on/off), **entonces** el OPL es idéntico.
**Patrones:** HU-SHARED-007.
**Evidencia:** [V-63] colores informativos, no normativos. Por extensión, imagen tampoco. Clase: confirmado por SSOT.
**Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [opl, invariante, separacion-semantica].

---

### HU-19.016 — Cachear bitmap remoto y degradar a "Solo texto" ante URL caída

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P primario.
**Historia:** Como modelador, quiero que las imágenes remotas se cacheen y, si la URL falla, se degrade automáticamente.
**Criterios:**
- **Dado** URL falla al cargar, **cuando** la cache también falla, **entonces** la apariencia se renderiza solo con texto y un icono de advertencia.
- **Dado** la URL vuelve a estar disponible, **cuando** se reintenta, **entonces** la imagen se restaura.
**Modelo:** `[propuesta]` cache local. **Deps:** Bloqueada por HU-19.002.
**Prioridad:** C. **Tamaño:** M. **Etiquetas:** [persistencia, fallback, cache].

---

## 4. Preguntas abiertas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q19.1 | ¿Tamaño máximo de imagen embebida (KB) y política de compresión? | HU-19.002 |
| Q19.2 | ¿Política de privacidad de imágenes en pool entre orgs? | HU-19.005 |
| Q19.3 | ¿La imagen se redimensiona al cambiar tamaño de la apariencia o se preserva? | HU-19.002 |

## 5. Referencias cruzadas

- Patrones: HU-SHARED-002, HU-SHARED-007, HU-SHARED-008.
- Bloqueada por: EPICA-10, EPICA-12 (descomposición), EPICA-13 (estados).
- Bloquea a: EPICA-60, EPICA-61 (exportación con imágenes).
