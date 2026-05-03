---
id: "HU-SHARED-005"
titulo: "Eliminar con scope (apariencia / OPD / modelo)"
fecha: 2026-05-03
estado: "activo"
tipo_patron: "transversal-kernel-ui"
absorbe: ["HU-11.021", "HU-11.022", "HU-1C.020", "HU-1C.022"]
---

## 1. Problema que resuelve

OPCloud distingue tres niveles de eliminación: borrar la apariencia (mantener entidad y otras apariencias), borrar la entidad de un OPD específico, borrar la entidad del modelo entero (con cascada a apariencias y enlaces incidentes). EPICA-1C define el "Choose Remove Operation" sin canonizar la mecánica para todas las cosas (entidades, enlaces, estados, sub-modelos). Este patrón fija el contrato.

## 2. HU canónica

### HU-SHARED-005 — Eliminar con selector de scope

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** mixto.
**Nivel categórico:** K primario (cascada y referencias); U secundario (selector).
**Superficie UI:** diálogo de eliminación, menú contextual, atajo `Delete`.
**Gesto canónico:** seleccionar elemento + `Delete` o acción "Eliminar" en menú contextual.

**Historia:**
> Como modelador, quiero eliminar elementos con conciencia explícita del scope (esta vista, este OPD, todo el modelo) para no perder accidentalmente apariciones útiles en otros OPDs.

**Contexto de negocio:**
La SSOT no define la afordancia de "scope de eliminación", pero sí define la cosa como independiente de su apariencia [Glos 3.76, 3.40]. La distinción entre eliminar apariencia y eliminar entidad es semánticamente importante: una entidad puede aparecer en múltiples OPDs (descomposición). OPCloud canoniza tres opciones; este patrón las nombra y especifica.

**Criterios de aceptación:**
- **Dado** que selecciono un elemento y presiono `Delete`, **cuando** el elemento tiene apariciones en más de un OPD, **entonces** se abre un diálogo "Elegir alcance de eliminación" con tres opciones según contexto.
- **Dado** que selecciono un elemento con apariencia única, **cuando** presiono `Delete`, **entonces** la eliminación procede sin diálogo (alcance implícito = "modelo").
- **Dado** que el diálogo está abierto, **cuando** elijo "Solo esta vista", **entonces** la apariencia se elimina del OPD actual y la entidad permanece en el modelo y en otros OPDs.
- **Dado** que el diálogo está abierto, **cuando** elijo "Este OPD y descendientes", **entonces** las apariencias del elemento en el OPD actual y todos sus OPDs hijos se eliminan; la entidad permanece en otros OPDs.
- **Dado** que el diálogo está abierto, **cuando** elijo "Modelo entero", **entonces** la entidad se elimina del modelo y se cascada a todos los enlaces incidentes y todas sus apariencias.
- **Dado** que la eliminación afectaría enlaces, **cuando** se confirma, **entonces** los enlaces incidentes se eliminan y se registra en el toast "N enlaces eliminados".
- **Dado** que cancelo el diálogo, **cuando** clico fuera o presiono `Esc`, **entonces** no se elimina nada.
- **Dado** que el modo es read-only (HU-SHARED-003), **cuando** intento eliminar, **entonces** la acción es no-op.

**Reglas y restricciones:**
- Toda eliminación entra al stack undo (HU-SHARED-002) como una sola operación reversible.
- Cascada por scope:
  - **apariencia**: elimina solo la `apariencia` y la `aparienciaEnlace` de enlaces que tocan la apariencia (en el OPD actual).
  - **OPD + descendientes**: elimina apariencias en el OPD y sus descendientes (vía descomposición).
  - **modelo**: elimina la `entidad` y cascada a todas sus apariencias, todos los `enlace` incidentes y sus apariencias.
- La eliminación de un proceso descompuesto en otro OPD requiere confirmación adicional ("Este proceso tiene un OPD hijo. ¿Eliminar también el OPD hijo?").
- La eliminación de un objeto con estados elimina los estados con el objeto.

**Modelo de datos tocado:**
- `apariencia.*`, `aparienciaEnlace.*` (operación delete por id).
- `entidad.*`, `enlace.*` (operación delete por id, scope = modelo).
- `opd.apariencias[id]`, `opd.enlaces[id]` (índice).

**Dependencias:**
- Bloquea a: HU específicas de eliminación en cada épica.
- Bloqueada por: HU-10.001/002, HU-11.NNN (creación previa).

**Integraciones:**
- HU-SHARED-002 (stack).
- HU-SHARED-003 (read-only bloquea).
- HU-SHARED-006 (dirty state se activa).
- HU-SHARED-007 (panel OPL-ES se actualiza).

**Notas de evidencia:**
- Fuente OPCloud: "Choose Remove Operation" en `opcloud-reverse/1c-canvas-validaciones.md` y `opcloud-reverse/11-canvas-modelado-basico.md`.
- Clase de afirmación: observado + canonizado.

**Prioridad:** M0.
**Tamaño:** L.
**Etiquetas:** [kernel, ux, transversal, eliminar, cascada, scope].

## 3. Tabla de scopes por tipo de elemento

| Elemento | Scope "vista" | Scope "OPD" | Scope "modelo" |
|---|---|---|---|
| Entidad (cosa) | Eliminar `apariencia` | Apariencias del OPD + descendientes | `entidad` + cascada |
| Enlace | Eliminar `aparienciaEnlace` | Apariencias del enlace en OPD + descendientes | `enlace` + apariencias |
| Estado | (no aplica; siempre dentro de objeto) | (no aplica) | Eliminar estado del objeto |
| Sub-modelo (referencia) | Eliminar referencia visual | (no aplica) | Desvincular del modelo |
| OPD (en árbol) | (no aplica) | Eliminar OPD | Eliminar OPD y descomposición padre |

## 4. HU absorbidas

- `HU-11.021` — Eliminar entidad con cascada.
- `HU-1C.NNN` — "Choose Remove Operation" diálogo.
- (Otras detectadas durante la refactorización.)
