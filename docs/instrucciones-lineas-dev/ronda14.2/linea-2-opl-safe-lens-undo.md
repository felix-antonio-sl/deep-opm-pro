# Linea 2 — Ley OPL reverse safe lens + undo atomicity

## 1. Mision

Institucionalizar OPL reverse como **lente parcial segura**, no como inversa total:

- `law-opl-safe-lens`: parse/plan/apply no borra hechos por ausencia de linea.
- `law-opl-preview-no-mutation`: planificar no muta el modelo.
- `law-opl-apply-undo-atomicity`: aplicar patches desde store entra como una unidad undoable.

Slice minimo: nuevo `app/src/leyes/opl-reverse.test.ts` y, si conviene, `app/src/leyes/undo.test.ts`. Fixes puntuales solo si una ley revela una regresion real.

Fuera de slice: UI de `PanelOpl`, redesign parser libre, detector dashboard, store slice types.

## 2. HU Base

| HU | Path absoluto | Aporte L2 |
|---|---|---|
| HU-SHARED-007 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md` | Convierte reverse editable en contrato de lente segura. |
| HU-SHARED-002 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-002-undo-redo.md` | Asegura atomicidad undo del apply OPL. |
| HU-50.019/.020/.022 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Refuerza parser/preview/apply como comportamiento verificable. |

## 3. Anclaje A Evidencia

- Auditoria categorial: `docs/roadmap/auditoria-categorial-app.md` F6 y Fase C.
- Auditoria alpha-lock: `docs/auditorias/2026-05-07-opl-reverse-ssot-opm-extracted.md` si existe en repo.
- SSOT OPL: `opm-opl-es.md` §1.7, §10 y plantillas canonicas; etiquetas `SD*` no son identidad persistente.
- ICAS: `urn:fxsl:kb:icas-efectos` (lentes/effects en Kleisli; no ocultar mutacion), `urn:fxsl:kb:icas-preservacion`.
- OPCloud: `opm-extracted/src/app/modules/app/export-opl.service.ts` y dialogos OPL solo aportan forward/export; no hay parser reverse libre que copiar.
- Codigo local:
  - `app/src/opl/parser/parsear.ts`
  - `app/src/opl/parser/parser.test.ts`
  - `app/src/opl/generar.ts`
  - `app/src/store.test.ts`
  - `app/src/ui/PanelOpl.tsx` solo lectura.

## 4. Archivos Permitidos

```text
app/src/leyes/opl-reverse.test.ts              NUEVO
app/src/leyes/undo.test.ts                     NUEVO opcional
app/src/opl/parser/*.ts                        LECTURA / EDIT puntual si ley falla
app/src/opl/parser/parser.test.ts              LECTURA
app/src/opl/generar.ts                         LECTURA
app/src/store.test.ts                          LECTURA / EDIT aditivo solo si helper store existente conviene
app/src/store/*.ts                             LECTURA
app/src/ui/PanelOpl.tsx                        LECTURA
docs/roadmap/auditoria-categorial-app.md       LECTURA
```

## 5. Restricciones De No-Colision

- No tocar `app/src/leyes/proyecciones.test.ts` salvo import de helper exportado por L1.
- No tocar render/serializacion/refinamiento (L1).
- No tocar quality ledger/script (L3).
- No tocar `store/tipos.ts` ni refactor de slices (ronda 14.3).
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/**`.

## 6. Slice Minimo Shippeable

### OPL Reverse

`law-opl-safe-lens` debe probar al menos:

- modelo con objeto, proceso, estados y enlace procedural;
- texto editado que omite una linea existente;
- `planificarEdicionOplLibre` no emite patch de borrado implicito;
- `aplicarPatchesOpl` preserva hechos omitidos.

### Preview No Mutation

Guardar snapshot estructural antes de `planificarEdicionOplLibre`; verificar:

```ts
expect(modelo).toEqual(snapshot)
```

Si se requiere normalizacion, comparar `exportarModelo(modelo)`.

### Undo Atomicity

Usar store real o helper existente para:

1. crear modelo con una entidad;
2. aplicar edicion OPL libre que renombra o crea entidad;
3. verificar que undo revierte todo en un paso;
4. verificar redo re-aplica todo en un paso.

No duplicar una mega-suite de store; el test debe ser puntual.

### Diagnosticos

Agregar ley negativa:

- OPL valido pero no soportado por kernel produce warning/error tipado y **no** muta.

## 7. Tests Obligatorios

- 3-5 tests OPL safe lens.
- 1-2 tests undo atomicity.
- 1 test negativo unsupported-kernel/no mutation.
- Total estimado: 6-8 tests.

No smoke browser nuevo salvo que el test store no alcance a cubrir la atomicidad UI.

## 8. Verificacion

```bash
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## 9. Decisiones Bloqueadas

- No borrar hechos por ausencia de linea.
- No resolver lenguaje natural fuera de OPL-ES canonico.
- No usar `SD*` como identidad persistente interna.
- No reescribir `PanelOpl` ni cambiar UX.
- No mover parser a otra arquitectura en esta linea.

## 10. Decisiones Que Tomas Vos

- Si las leyes viven en un solo archivo o dos (`opl-reverse.test.ts` + `undo.test.ts`).
- Si el test undo usa store global o crea store aislado. Preferir aislado si ya hay patrón.
- Si una falla requiere fix en parser, planner o applicator. Documentar claramente.

## 11. Forma Del Entregable

Commits sugeridos:

1. `test(leyes): OPL reverse es lente parcial segura`
2. `test(leyes): apply OPL entra como undo atomico`
3. `fix(opl): corrige safe-lens <detalle>` solo si aplica.

Entregable final:

- hashes;
- leyes agregadas;
- evidencia de no-mutation/no-delete;
- comandos ejecutados;
- deuda residual para Beta1.
