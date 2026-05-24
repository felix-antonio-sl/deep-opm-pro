# L2 — Inspector canónico (CodexInspectSection/Field/Inline + CodexStateRow)

> **Ronda Codex v1 · Ola B (paralela a L3/L4/L5).** Depende del merge de **L1**
> (helpers `OplObj/OplProc/OplState`, dependencia soft de lectura).
> Lee `README.md` (reglas §2, colisiones §5, orden §6) y este brief.

---

## 1. Misión

Dar al Inspector los **componentes tipográficos canónicos** de
`ui-forja/02-components.md §9-§12`, reemplazando las secciones ad-hoc actuales
por primitivas Codex reutilizables — **re-piel, cero pérdida de funcionalidad**:

1. **`CodexInspectSection`** (`§9`): kicker uppercase tracked + slot derecho +
   contenido. Envuelve cada sección del inspector.
2. **`CodexInspectField`** (`§10`): par clave-valor inline (clave italic serif,
   valor mono/normal).
3. **`CodexInspectInline`** (`§11`): segmented control tipográfico (opciones
   separadas por `·`, activa subrayada bold) — reemplaza toggles/switches/pills.
4. **`CodexStateRow`** (`§12`): fila de estado con badge 8×8 + nombre + flags
   (inicial / final / actual / por defecto / duración / supresión) como palabras,
   no pills.

Slice mínimo: las 4 primitivas creadas + el Inspector de objeto y de proceso
migrados a ellas. **Fuera de slice**: pulido fino de cada sub-pestaña densa
(apariencias, enlaces) si excede el corte — migrar al menos las secciones de
identidad/designaciones/estados.

---

## 2. HU base

| HU | Path absoluto | Aporte a esta línea |
|---|---|---|
| EPICA-13 estados | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-13-canvas-estados.md` | `CodexStateRow` preserva flags de estado (inicial/final/actual/default/duración/supresión). |
| HU-SHARED-009 validación nominal | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-009-validacion-nominal.md` | Indicadores de validación nominal sobreviven al cambio visual. |
| HU-SHARED-003 permisos/read-only | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-003-permisos-readonly.md` | La re-piel no puede ocultar estados disabled/read-only. |

---

## 3. Anclaje a evidencia (estado actual)

- **SSOT**: `opm-iso-19450-es.md` (atributos/propiedades, estados §3.71),
  `opm-visual-es.md` (V-202: affordance UI no es gramática OPM — el inspector no
  exporta al canon).
- **Spec**: `ui-forja/02-components.md §9-§12`, `ui-forja/03-scenes.md` escena 04
  (inspector de objeto + OPL filtrada), `ui-forja/screenshots/04-inspector.png`.
- **Corpus reusable**: `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/inspector/opmStyle.ts`
  (`opmStyle`, 77 líneas — qué atributos de estilo expone OPCloud por elemento,
  conceptual) y `attributes-and-instances-dialog.component.ts` (`MODULES.md` L41).
- **Estado del código**:
  - `app/src/ui/Inspector.tsx` — barrel del inspector; `lineaConteos` (L63) ya en
    Codex parcial.
  - `app/src/ui/inspector/InspectorEstado.tsx` — inspector de estado (nombre,
    designaciones, duración, supresión, flechas ↑↓) → destino de `CodexStateRow`.
  - `app/src/ui/inspector/SeccionLayoutEstados.tsx`, `SeccionDesignaciones.tsx` —
    secciones existentes a envolver en `CodexInspectSection`.

---

## 4. Archivos permitidos

```text
app/src/ui/codex/CodexInspectSection.tsx        NUEVO
app/src/ui/codex/CodexInspectField.tsx          NUEVO
app/src/ui/codex/CodexInspectInline.tsx         NUEVO
app/src/ui/codex/CodexStateRow.tsx              NUEVO
app/src/ui/Inspector.tsx                         EDIT
app/src/ui/inspector/**                          EDIT (re-piel, sin lógica nueva)
app/src/ui/inspector/*.test.ts(x)               EDIT (asserts de estilo)
app/e2e/20-inspector-tabs.spec.ts               EDIT opcional si cambia assert visual
app/e2e/15-estado-ciudadano.spec.ts             EDIT opcional si cambia assert visual
LECTURA: app/src/ui/codex/oplTipografia.tsx (L1), tokens.ts, glifos.ts
```

---

## 5. Restricciones de no-colisión

- **NO** tocar `store/seleccion.ts`, `store/modelo/**`, `modelo/operaciones/**`:
  toda la lógica de selección/estados/designaciones ya existe (paquete "Estados
  ciudadanos de primera clase"). Tú solo cambias la piel de los componentes que
  la consumen.
- **NO** romper el invariante de selección (`setSeleccionPorTipo`): el inspector
  lee `seleccionId/enlaceSeleccionId/estadoSeleccionId`, no los muta directo.
- Importa `OplObj/OplProc/OplState` de L1 para mostrar nombres OPM dentro del
  inspector; no redefinas tipografía OPL.
- **NO** tocar diálogos (`Dialogo*.tsx`) — son de L3.

---

## 6. Slice mínimo shippeable

1. **Primitivas** `CodexInspectSection/Field/Inline` (`§9-§11`): kicker uppercase
   `letterSpacing` kicker, hairlines, sin pills/switches/radius. `CodexInspectInline`
   = segmented inline (`palabra · palabra`, activa subrayada).
2. **`CodexStateRow`** (`§12`): badge 8×8 (oliva canon) + nombre serif + flags
   como palabras tipográficas; integra flechas ↑↓ de reorden existentes.
3. **Migrar `Inspector.tsx` + secciones** de objeto/proceso/estado a las
   primitivas. Preservar `data-testid="inspector-pane"`, tabs, y estados
   read-only/disabled (HU-SHARED-003).

---

## 7. Tests obligatorios

- Unit: `CodexInspectField.test.tsx`, `CodexStateRow.test.tsx` (render de
  flags/valores, ~8 expect). Ajustar tests de inspector existentes.
- E2E: `e2e/20-inspector-tabs.spec.ts` y `e2e/15-estado-ciudadano.spec.ts` verdes.
  testIds `inspector-pane`, roles de tab **inmutables**.

---

## 8. Verificación

```bash
cd app
bun run check
bun run lint
bunx playwright test e2e/15-estado-ciudadano.spec.ts e2e/20-inspector-tabs.spec.ts
```

---

## 9. Decisiones bloqueadas (no reabrir)

- V-202: inspector/halo/menú son affordance UI, no gramática OPM — no se exportan
  al canon ni a la SSOT visual.
- Flags de estado como **palabras tipográficas**, no pills (filosofía Codex).
- Badge de estado en oliva canon (`tokens.colors.opm.state`), no crimson.

---

## 10. Decisiones que tomas vos (documentar en commit)

- Granularidad de `CodexInspectSection` (¿una por sub-pestaña o anidadas?).
- Orden de migración de sub-pestañas si no caben todas en el slice.
- Layout exacto de `CodexStateRow` (badge a la izquierda del nombre vs prefijo).

---

## 11. Forma del entregable

- Rama `linea-2-codex-inspector-wip` (worktree propio).
- Commits `style(ui)` / `feat(ui)` para primitivas nuevas. Co-author footer.
- **No tocar**: store, modelo, operaciones, `tokens.ts`, diálogos, `HANDOFF.md`.
- testIds y roles ARIA inmutables.
