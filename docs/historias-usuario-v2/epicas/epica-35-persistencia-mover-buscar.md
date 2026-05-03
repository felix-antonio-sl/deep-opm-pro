---
epica: "EPICA-35"
titulo: "Persistencia — mover modelos y buscar cosas (Ctrl+F intra-modelo)"
slug: "persistencia-move-search"
doc_fuente: "opcloud-reverse/35-persistencia-move-search.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M1"
hu_emitidas: 20
hu_canonicas: 20
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Dos operaciones secundarias críticas: mover modelos entre carpetas (cut/paste o drag) y buscar cosas dentro del modelo activo (Ctrl+F). Búsqueda intra-modelo es M0 para velocidad de modelado.

## 2. HU canónicas

### HU-35.001 — Cortar un modelo desde el diálogo "Cargar"
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Mover modelo entre carpetas. **Criterios:** menú contextual "Cortar" marca pendiente. **Modelo:** `ui.portapapelesModelo`.  **Patrones:** HU-SHARED-001 (mecánica detectada por audit-hu.mjs). **Deps:** Bloqueada por HU-30.018. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [cut, modelo].

### HU-35.002 — Pegar un modelo cortado en carpeta destino con confirmación
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Completar movimiento. **Criterios:** **Dado** portapapeles activo, **cuando** elijo carpeta destino y "Pegar Modelo", **entonces** confirmación + movimiento. **Patrones:** HU-SHARED-002, HU-SHARED-003. **Deps:** Bloqueada por HU-35.001. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [paste, modelo].

### HU-35.003 — Habilitar "Pegar Modelo" solo con corte pendiente y permisos
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** UX coherente con permisos. **Criterios:** botón habilitado solo si hay portapapeles + permiso de escritura en destino. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-35.002. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [permisos].

### HU-35.004 — Mover modelo por arrastrar-y-soltar entre tiles
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Alternativa al cut/paste. **Criterios:** drag de tile a tile de carpeta. **Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-30.018. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [drag].

### HU-35.005 — Arrastrar versiones y autosalvados junto al modelo movido
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Preservar historial. **Criterios:** versiones se mueven con el modelo. **Deps:** Bloqueada por HU-35.002. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [versiones, mover].

### HU-35.006 — Ver carpeta `<Modelo> Versiones` post-mover con toggle activo
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Confirmar visualmente. **Criterios:** carpeta visible cuando "Mostrar Versiones" activo. **Deps:** Bloqueada por HU-30.023, HU-35.005. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [versiones].

### HU-35.007 — Preservar ACL del modelo y unir permisos con carpeta destino
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Historia:** Mantener integridad de permisos al mover. **Criterios:** análogo a HU-31.014. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-35.002. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [permisos].

### HU-35.008 — Abrir diálogo "Buscar Cosas del Modelo" con Ctrl+F
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Atajo universal. **Criterios:** Ctrl+F (Cmd+F en macOS) abre diálogo de búsqueda intra-modelo. **Deps:** Bloqueada por HU-10.001. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [busqueda, atajo].

### HU-35.009 — Abrir diálogo "Buscar Cosas" desde barra secundaria
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Acceso visible. **Criterios:** botón en barra secundaria abre el mismo diálogo. **Deps:** Bloqueada por HU-35.008. **Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [ui].

### HU-35.010 — Filtrar resultados incrementalmente por nombre (subcadena)
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Búsqueda en vivo. **Criterios:** **Dado** caja de búsqueda, **cuando** escribo, **entonces** la lista de resultados se filtra en cada keystroke. **Modelo:** búsqueda case-insensitive sobre `entidad.nombre`. **Deps:** Bloqueada por HU-35.008. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [busqueda, filtro].

### HU-35.011 — Filtrar resultados por tipo (Todos/Procesos/Objetos)
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Filtrar por tipo de entidad. **Criterios:** dropdown con tres opciones. **Deps:** Bloqueada por HU-35.010. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [filtro, tipo].

### HU-35.012 — Ver tabla "Elemento | Ubicación" con una fila por aparición
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Cada apariencia es una fila. **Criterios:** tabla muestra `entidad.nombre`, `opd.nombre`, posición. **Deps:** Bloqueada por HU-35.010. **Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [busqueda, tabla].

### HU-35.013 — Conservar color semántico del tipo en columna "Elemento"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Distinguir visualmente tipo. **Criterios:** color verde lima (objeto) o cyan (proceso) en cada fila. [JOYAS §1] **Deps:** Bloqueada por HU-35.012. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [render].

### HU-35.014 — Navegar al OPD del resultado con clic en la fila
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Saltar al elemento. **Criterios:** **Dado** clic en fila, **cuando** la acción termina, **entonces** `ui.opdActivoId = opd.id`, zoom-fit y selección de la apariencia. **Patrones:** HU-SHARED-008. **Deps:** Bloqueada por HU-35.012. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [navegacion].

### HU-35.015 — Cerrar diálogo sin navegar con "Cerrar" o ESC
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Cancelar. **Criterios:** ESC o botón cierra sin efectos. **Deps:** Bloqueada por HU-35.008. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [cancelar].

### HU-35.016 — Filtrar panel "Cosas arrastrables" con caja "Buscar" lateral
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Filtrar la biblioteca lateral. **Criterios:** caja en panel lateral filtra entradas. **Deps:** Bloqueada por HU-10.017. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [busqueda, biblioteca].

### HU-35.017 — Abrir búsqueda pre-cargada desde panel lateral con clic derecho
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Pivotar de biblioteca a búsqueda completa. **Criterios:** clic derecho → "Buscar todas las apariciones". **Patrones:** HU-SHARED-001. **Deps:** Bloqueada por HU-35.008. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [pivotar].

### HU-35.018 — Definir política de marca visual post-salto de búsqueda
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Resaltar elemento al saltar. **Criterios:** halo temporal de 3s sobre la apariencia destino tras HU-35.014. **Deps:** Bloqueada por HU-35.014. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [feedback, render].

### HU-35.019 — Mostrar tabla vacía silenciosa cuando no hay resultados
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Estado vacío explícito. **Criterios:** mensaje "Sin resultados". **Deps:** Bloqueada por HU-35.012. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [empty-state].

### HU-35.020 — Actualizar panel OPL-ES al saltar al OPD del resultado
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** OPL refleja OPD activo. **Criterios:** post-salto, panel OPL-ES muestra oraciones del OPD destino. **Patrones:** HU-SHARED-007. **Deps:** Bloqueada por HU-35.014. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [opl, sync].

## 3. Preguntas abiertas

| Q | Pregunta | Bloquea |
|---|---|---|
| Q35.1 | ¿La búsqueda incluye estados, atributos o solo entidades? | HU-35.010 |
| Q35.2 | Política de marca visual: ¿highlight 1s, 3s, hasta clic? | HU-35.018 |

## 4. Referencias

- Patrones: HU-SHARED-001, HU-SHARED-002, HU-SHARED-003, HU-SHARED-007, HU-SHARED-008.
- Bloqueada por: EPICA-30, EPICA-31.
