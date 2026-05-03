---
id: "HU-SHARED-002"
titulo: "Pila de deshacer / rehacer (undo / redo)"
fecha: 2026-05-03
estado: "activo"
tipo_patron: "transversal-kernel"
absorbe: ["HU-90.008", "HU-90.009"]
---

## 1. Problema que resuelve

149 menciones a "undo / redo" se distribuyen en las 48 épicas sin que exista una HU central que defina el contrato del stack. Cada épica asume su existencia y comportamiento. Falta normar:

- Qué operaciones entran al stack (cuáles no).
- Cuál es la profundidad del stack y su política de purga.
- Cómo se interactúa con el modo read-only.
- Qué pasa con la persistencia (`HU-SHARED-006` dirty state).
- Cómo se invierten cambios sobre apariencias vs entidades.

Esta HU canoniza el contrato. Las HU específicas de gesto (`Ctrl+Z`, botón en barra) viven en EPICA-90 y citan este patrón.

## 2. HU canónica

### HU-SHARED-002 — Pila de deshacer / rehacer

**Actor primario:** ME, MN.
**Tipo:** mixto.
**Nivel categórico:** K primario; U secundario.
**Superficie UI:** canvas-OPD, paneles, diálogos.
**Gesto canónico:** atajo `Ctrl+Z` / `Ctrl+Y` o botón en barra principal.

**Historia:**
> Como modelador, quiero deshacer cualquier operación de edición y rehacerla si decido revertir, para experimentar sin miedo a perder progreso.

**Contexto de negocio:**
La SSOT OPM no prescribe undo/redo. Es un requisito UX universal de cualquier editor. OPCloud lo implementa pero no lo documenta normativamente. La canonización fija el contrato y permite que cada épica que introduce una operación nueva declare si entra al stack y cómo.

**Criterios de aceptación:**
- **Dado** que ejecuté una operación reversible, **cuando** invoco deshacer (`Ctrl+Z` o botón), **entonces** el modelo regresa al estado inmediatamente anterior y el stack `undo` decrece en uno y `redo` crece en uno.
- **Dado** que deshice una operación, **cuando** invoco rehacer (`Ctrl+Y` o botón), **entonces** el modelo regresa al estado posterior y los stacks se intercambian.
- **Dado** que ejecuto una operación nueva, **cuando** existe un stack `redo`, **entonces** el stack `redo` se purga (no se rehacen ramas divergentes).
- **Dado** que el stack `undo` está vacío, **cuando** invoco deshacer, **entonces** la operación es no-op y el botón aparece deshabilitado.
- **Dado** que el modo es read-only, **cuando** intento deshacer una operación de escritura, **entonces** el atajo es no-op y el botón está oculto. Ver HU-SHARED-003.
- **Dado** que el stack `undo` alcanza la profundidad máxima (default 100), **cuando** ejecuto una nueva operación, **entonces** la operación más antigua se descarta del stack.

**Reglas y restricciones:**
- Profundidad por defecto: 100. Configurable globalmente; persistente entre sesiones.
- Operaciones que **entran** al stack: crear/eliminar/renombrar entidad, crear/eliminar enlace, mover apariencia, cambiar afiliación, cambiar esencia, agregar/quitar estado, aplicar/quitar estereotipo, edición desde panel OPL-ES.
- Operaciones que **NO entran** al stack: navegación entre OPDs, expandir/colapsar árbol, abrir/cerrar menú contextual, scroll, zoom, selección, save/load, dirty toggle, abrir/cerrar diálogos, pasar el cursor.
- El stack es por modelo, no global. Al cambiar de modelo, los stacks del anterior se descartan.
- Save no purga el stack; las operaciones siguen reversibles después de guardar.

**Modelo de datos tocado:**
- Estado UI transitorio: `ui.stackUndo: Operacion[]`, `ui.stackRedo: Operacion[]` — transitorio, no persistente.
- `Operacion` es un objeto inverso ejecutable que sabe cómo aplicar y revertir el cambio.

**Dependencias:**
- Bloquea a: cualquier HU que asuma reversibilidad (la mayoría de las de canvas).

**Integraciones:**
- HU-SHARED-006 (dirty state se recalcula tras deshacer/rehacer).
- HU-SHARED-003 (modo read-only deshabilita).
- EPICA-90 HU-90.008/009 citan este patrón con su gesto específico (`Ctrl+Z` / `Ctrl+Y`).

**Notas de evidencia:**
- Fuente OPCloud: observado en sandbox; no documentado normativamente en `opcloud-reverse/`.
- Clase de afirmación: inferido + canonizado por necesidad UX universal.

**Prioridad:** M0.
**Tamaño:** L.
**Etiquetas:** [kernel, ux, transversal, undo, redo].

## 3. Operaciones reversibles — taxonomía

| Categoría | Operación | Inversa | Notas |
|---|---|---|---|
| Entidad | Crear entidad | Eliminar entidad | Cascada: elimina apariencias y enlaces incidentes. |
| Entidad | Renombrar entidad | Restaurar nombre previo | Ver HU-SHARED-004. |
| Entidad | Cambiar afiliación | Restaurar valor previo | [V-1]. |
| Entidad | Cambiar esencia | Restaurar valor previo | [V-1]. |
| Apariencia | Mover apariencia | Restaurar `(x, y)` previa | Apariencia, no entidad. |
| Apariencia | Redimensionar | Restaurar `(width, height)` previas | EPICA-1A. |
| Enlace | Crear enlace | Eliminar enlace | Borra apariencias asociadas. |
| Enlace | Cambiar tipo | Restaurar tipo previo | EPICA-15, EPICA-16. |
| Enlace | Cambiar etiqueta | Restaurar etiqueta previa | — |
| Estado | Agregar estado | Eliminar estado | EPICA-13. |
| Estado | Designar inicial / final / Current | Restaurar designaciones previas | [V-237]. |
| Estereotipo | Aplicar estereotipo | Quitar aplicación | EPICA-A0. |
| OPD | Crear OPD por descomposición | Eliminar OPD hijo | EPICA-12; cascada parcial. |
| OPL | Editar oración OPL-ES → propaga al canvas | Restaurar canvas previo | EPICA-50. |

## 4. HU absorbidas

- `HU-90.008` — Atajo `Ctrl+Z` para deshacer.
- `HU-90.009` — Atajo `Ctrl+Y` (o `Ctrl+Shift+Z`) para rehacer.

(EPICA-90 mantiene HU canónicas con stub corto que apunta a HU-SHARED-002 + especialización del gesto.)
