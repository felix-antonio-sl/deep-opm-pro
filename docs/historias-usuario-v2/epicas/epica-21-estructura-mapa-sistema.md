---
epica: "EPICA-21"
titulo: "Estructura — mapa del sistema (meta-vista gráfica del árbol de OPDs)"
slug: "estructura-system-map"
doc_fuente: "opcloud-reverse/21-estructura-system-map.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 18
hu_canonicas: 18
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Mapa del sistema: visualización macro del árbol OPDs como meta-grafo con thumbnails y flechas padre-hijo. Útil para modelos grandes. No es OPD: es vista derivada que suspende algunas afordances del modelador (OPL, navegador). Navegación al OPD real con doble clic en thumbnail.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo |
|---|---|---|---|---|---|
| HU-21.001 | Activar Mapa del sistema desde menú | RV | S | S | opcloud-ui |
| HU-21.002 | Ver entrada Mapa en el árbol OPD al generarla | RV | S | XS | opcloud-ui |
| HU-21.003 | Renderizar meta-grafo con thumbnails y flechas padre-hijo | RV | S | M | mixto |
| HU-21.004 | Evitar ruteo OPM en el meta-grafo (es vista, no modelo) | RV | S | S | opcloud-ui |
| HU-21.005 | Mostrar marcadores rojo/verde como anclas de navegación | RV | C | XS | opcloud-ui |
| HU-21.006 | Suspender OPL durante la vista Mapa | RV | S | XS | mixto |
| HU-21.007 | Ocultar OPD Navigator durante la vista Mapa | RV | S | XS | opcloud-ui |
| HU-21.008 | Navegar al OPD real con doble clic en thumbnail | RV | S | S | mixto |
| HU-21.009 | Hacer zoom in / zoom out sobre el meta-grafo | RV | C | S | opcloud-ui |
| HU-21.010 | Hacer pan y scroll para recorrer niveles profundos | RV | S | XS | opcloud-ui |
| HU-21.011 | Mostrar tooltip con metadatos al apuntar a un thumbnail | RV | C | S | opcloud-ui |
| HU-21.012 | Filtrar thumbnails visibles por profundidad o rama | IS | C | M | mixto |
| HU-21.013 | Resaltar thumbnails por tipo de cosa contenida | IS | C | M | mixto |
| HU-21.014 | Mostrar panel de estadísticas del modelo | IS | C | S | mixto |
| HU-21.015 | Refrescar el Mapa bajo demanda | RV | S | S | opcloud-ui |
| HU-21.016 | Regenerar automáticamente al cambiar el árbol OPD | RV | C | M | opcloud-ui |
| HU-21.017 | Exportar el Mapa como imagen independiente (PNG/SVG/PDF) | RV | C | M | mixto |
| HU-21.018 | Persistir estado de la vista (zoom, pan, filtros) | RV | C | S | opcloud-ui |

18 canónicas.

## 3. Historias de usuario

### HU-21.001 — Activar Mapa del sistema desde menú

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como revisor, quiero abrir un Mapa del sistema desde el menú principal.
**Criterios:** **Dado** ítem "Mapa del sistema" en menú "Vista", **cuando** clico, **entonces** se genera la vista (puede tomar segundos).
**Deps:** Bloqueada por HU-20.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, mapa].

---

### HU-21.002 — Ver entrada Mapa en el árbol OPD al generarla

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como revisor, quiero ver el Mapa como entrada del árbol OPD para que sea navegable.
**Criterios:** **Dado** Mapa generado, **cuando** se renderiza, **entonces** aparece nodo "Mapa del sistema" en el árbol como vista especial.
**Deps:** Bloqueada por HU-21.001. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [arbol, mapa].

---

### HU-21.003 — Renderizar meta-grafo con thumbnails y flechas padre-hijo

**Actor primario:** RV. **Tipo:** mixto. **Nivel:** V.
**Historia:** Como revisor, quiero ver miniaturas de cada OPD conectadas por flechas según jerarquía.
**Criterios:** **Dado** Mapa activo, **cuando** se renderiza, **entonces** cada OPD aparece como thumbnail (≤ 200x150 px) con flechas padre-hijo según `modelo.opds`.
**Modelo:** lente derivada. **Deps:** Bloqueada por HU-21.001.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [render, mapa, thumbnail].

---

### HU-21.004 — Evitar ruteo OPM en el meta-grafo (es vista, no modelo)

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como revisor, quiero que las flechas del meta-grafo no parezcan enlaces OPM (no usar wrapper+line ni manhattan).
**Criterios:** flechas con estilo neutro (color gris, línea simple, marker triangular pequeño).
**Deps:** Bloqueada por HU-21.003. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, distincion].

---

### HU-21.005 — Mostrar marcadores rojo/verde como anclas de navegación

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como revisor, quiero marcadores que indiquen el OPD activo (verde) y el último visitado (rojo).
**Criterios:** dos marcadores configurables.
**Deps:** Bloqueada por HU-21.003. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [render, marcador].

---

### HU-21.006 — Suspender OPL durante la vista Mapa

**Actor primario:** RV. **Tipo:** mixto. **Nivel:** L.
**Historia:** Como revisor, quiero que el panel OPL se suspenda durante el Mapa porque no aplica.
**Criterios:** `ui.opdActivoId = mapaId` ⇒ panel OPL muestra "Vista mapa: OPL no disponible".
**Deps:** Bloqueada por HU-21.001. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [opl, mapa].

---

### HU-21.007 — Ocultar OPD Navigator durante la vista Mapa

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como revisor, quiero ocultar la mini-miniatura porque ya estoy en el Mapa.
**Criterios:** durante Mapa, mini-navegador no se renderiza.
**Deps:** Bloqueada por HU-21.001. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [ui, mapa].

---

### HU-21.008 — Navegar al OPD real por doble clic en thumbnail y cerrar la vista

**Actor primario:** RV. **Tipo:** mixto. **Nivel:** L.
**Historia:** Como revisor, quiero saltar al OPD real con doble clic.
**Criterios:** **Dado** doble clic en thumbnail, **cuando** la acción termina, **entonces** `ui.opdActivoId = opd.id`, panel OPL reanuda y la vista Mapa se oculta.
**Deps:** Bloqueada por HU-21.003. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [navegacion, mapa].

---

### HU-21.009 — Hacer zoom in / zoom out sobre el meta-grafo

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como revisor, quiero zoom para examinar detalles o tener vista panorámica.
**Criterios:** Ctrl+rueda hace zoom; rango 25%-200%. **Deps:** Bloqueada por HU-21.003.
**Prioridad:** C. **Tamaño:** S. **Etiquetas:** [zoom].

---

### HU-21.010 — Hacer pan y scroll para recorrer niveles profundos

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como revisor, quiero pan con click+drag para recorrer mapas grandes.
**Criterios:** click sostenido + drag mueve viewport. Scroll vertical y horizontal.
**Deps:** Bloqueada por HU-21.003. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [pan, scroll].

---

### HU-21.011 — Mostrar tooltip con metadatos al apuntar a un thumbnail

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como revisor, quiero ver metadatos (nombre, tipo refinamiento, conteo cosas) al apuntar.
**Criterios:** tooltip con `opd.nombre`, conteos.
**Deps:** Bloqueada por HU-21.003. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [tooltip].

---

### HU-21.012 — Filtrar thumbnails visibles por profundidad o rama

**Actor primario:** IS. **Tipo:** mixto. **Nivel:** L.
**Historia:** Como ingeniero, quiero ocultar profundidades > N o ramas específicas.
**Criterios:** controles "Profundidad ≤ N" y selector de raíz para sub-grafo.
**Deps:** Bloqueada por HU-21.003. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [filtro, mapa].

---

### HU-21.013 — Resaltar thumbnails por tipo de cosa contenida

**Actor primario:** IS. **Tipo:** mixto. **Nivel:** V.
**Historia:** Como ingeniero, quiero colorear thumbnails según predominancia (proceso vs objeto vs estados).
**Criterios:** color de borde refleja predominancia.
**Deps:** Bloqueada por HU-21.003. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [render, resaltado].

---

### HU-21.014 — Mostrar panel de estadísticas del modelo

**Actor primario:** IS. **Tipo:** mixto. **Nivel:** L.
**Historia:** Como ingeniero, quiero ver estadísticas globales (conteos de cosas, enlaces, OPDs, profundidad max).
**Criterios:** panel lateral con métricas.
**Deps:** Bloqueada por HU-21.001. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [estadisticas, panel].

---

### HU-21.015 — Refrescar el Mapa bajo demanda con acción explícita

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como revisor, quiero refrescar manualmente cuando el modelo cambió.
**Criterios:** botón "Refrescar". **Deps:** Bloqueada por HU-21.001.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [refresco].

---

### HU-21.016 — Regenerar automáticamente cuando cambia el árbol OPD

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como revisor, quiero que el Mapa se actualice solo cuando agregue/elimine OPDs.
**Criterios:** auto-refresh tras HU-12.003, HU-20.015. Toggle activable.
**Deps:** Bloqueada por HU-21.015. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [auto-refresh].

---

### HU-21.017 — Exportar el Mapa como imagen independiente (PNG/SVG/PDF)

**Actor primario:** RV. **Tipo:** mixto. **Nivel:** X.
**Historia:** Como revisor, quiero exportar el Mapa para presentaciones.
**Criterios:** formatos PNG/SVG/PDF; botón "Exportar".
**Deps:** Bloqueada por HU-21.001, EPICA-60, EPICA-61. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [export].

---

### HU-21.018 — Persistir estado de la vista (zoom, pan, filtros)

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como revisor, quiero que mi configuración del Mapa se preserve al cambiar de OPD y volver.
**Criterios:** `ui.mapa.{zoom,pan,filtros}` preservado en sesión.
**Deps:** Bloqueada por HU-21.009. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [persistencia, ux].

---

## 4. Preguntas abiertas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q21.1 | Tamaño máximo de thumbnail (¿debe ser legible o decorativo?). | HU-21.003 |
| Q21.2 | ¿Auto-refresh debilita la performance en modelos grandes? | HU-21.016 |

## 5. Referencias cruzadas

- Patrones: HU-SHARED-002.
- Bloqueada por: EPICA-20 (árbol).
- Bloquea a: EPICA-60, EPICA-61 (export del Mapa).
