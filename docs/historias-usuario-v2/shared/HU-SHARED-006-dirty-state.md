---
id: "HU-SHARED-006"
titulo: "Estado dirty del modelo (cambios sin guardar)"
fecha: 2026-05-03
estado: "activo"
tipo_patron: "transversal-kernel-ui"
absorbe: ["HU-10.022", "HU-30.004"]
---

## 1. Problema que resuelve

EPICA-30 (persistencia) menciona "indicador dirty" sin definir cuándo se activa, cuándo se limpia, cómo se renderiza, qué pasa al cargar y cómo interactúa con stack undo. EPICA-10 introduce HU-10.022 ("Modelo (No guardado)") sin contrato. Este patrón canoniza el contrato.

## 2. HU canónica

### HU-SHARED-006 — Estado dirty del modelo

**Actor primario:** MN, ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** K primario (estado computado); U secundario (indicador).
**Superficie UI:** barra superior (título del modelo), botón guardar, diálogo de cierre.
**Gesto canónico:** ninguno explícito; el estado es derivado.

**Historia:**
> Como modelador, quiero saber en todo momento si tengo cambios sin guardar, para no perder progreso al cerrar el modelador o navegar a otro modelo.

**Contexto de negocio:**
Cualquier editor con persistencia necesita un indicador de cambios pendientes. OPCloud lo muestra como "Model (Not Saved)" en la pestaña. La canonización define qué cuenta como "cambio" y cuándo el indicador se limpia.

**Criterios de aceptación:**
- **Dado** que cargo un modelo, **cuando** la carga termina, **entonces** `ui.dirty = false` y el indicador no se muestra.
- **Dado** que ejecuto una operación que entra al stack undo (HU-SHARED-002), **cuando** la operación termina, **entonces** `ui.dirty = true` y el indicador "(No guardado)" se muestra junto al nombre del modelo.
- **Dado** que el modelo está dirty, **cuando** invoco guardar y la operación termina con éxito, **entonces** `ui.dirty = false` y el indicador desaparece.
- **Dado** que el modelo está dirty, **cuando** deshago todas las operaciones hasta el último estado guardado, **entonces** `ui.dirty = false` y el indicador desaparece (estado computado, no flag monotónico).
- **Dado** que el modelo está dirty, **cuando** intento cerrar el modelador o navegar a otro modelo, **entonces** se muestra un diálogo "Hay cambios sin guardar. ¿Guardar / Descartar / Cancelar?".
- **Dado** que el modo es read-only (HU-SHARED-003), **cuando** se renderiza, **entonces** el indicador dirty está oculto (no debería poder activarse, pero por defensa).

**Reglas y restricciones:**
- `dirty` es un estado **computado**: `dirty == (snapshotActual ≠ snapshotGuardado)`, no un flag monotónico que crece.
- El cómputo puede ser eficiente (hash del snapshot) o incremental (contador de operaciones desde el último guardado, decrementado por undos).
- Operaciones que **NO** activan dirty: scroll, zoom, selección, navegación entre OPDs, expandir árbol, abrir/cerrar panel OPL-ES.
- El indicador acompaña al nombre: `Mi Modelo *(No guardado)`.
- En auto-save (si está habilitado), el indicador desaparece tras cada save automático.

**Modelo de datos tocado:**
- `ui.dirty: boolean` — transitorio.
- `ui.snapshotGuardado: hash | snapshot-ref` — transitorio.

**Dependencias:**
- Bloqueada por: HU-10.001 (existencia de modelo), HU-30.001 (persistencia básica).

**Integraciones:**
- HU-SHARED-002 (cada operación reversible se suma).
- HU-SHARED-003 (read-only oculta).
- EPICA-30 (save resetea).

**Notas de evidencia:**
- Fuente OPCloud: indicador "(Not Saved)" observable en sandbox.
- Clase de afirmación: observado + canonizado.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [ux, transversal, persistencia, dirty].

## 3. HU absorbidas

- `HU-10.022` — Ver indicador de modelo no guardado.
- `HU-30.NNN` — Indicador dirty al guardar.
- (Otras detectadas durante la refactorización.)
