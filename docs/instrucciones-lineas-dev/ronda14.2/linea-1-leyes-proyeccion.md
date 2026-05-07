# Linea 1 — Leyes JSON/render/refinement

## 1. Mision

Crear una suite de leyes ejecutables para las proyecciones centrales del modelo OPM:

- `law-json-roundtrip`
- `law-render-stable-metadata`
- `law-refinement-thing-matrix`
- `law-refinement-removal`

Slice minimo: nuevo `app/src/leyes/proyecciones.test.ts` con modelos de prueba que atraviesan serializacion JSON, render JointJS y refinamiento `Thing` sin perder identidad ni metadata. Si una ley revela una falla real, aplicar fix puntual y documentarlo.

Fuera de slice: OPL reverse safe lens, store slice refactor, runtime effects, migracion a slots separados, detector dashboard.

## 2. HU Base

| HU | Path absoluto | Aporte L1 |
|---|---|---|
| HU-12.003 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md` | Ley matrix crea refinamientos proceso/objeto sin rechazo. |
| HU-12.007 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md` | Verifica identidad unica de la cosa refinada tras JSON/render. |
| HU-12.027 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md` | Ley de removal evita OPDs/enlaces/estados huerfanos. |
| HU-SHARED-007 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md` | Solo como dualidad forward: OPD y metadata preservada antes de OPL reverse. |

## 3. Anclaje A Evidencia

- Auditoria categorial: `docs/roadmap/auditoria-categorial-app.md` F2, F6, F7 y Fase C.
- Auditoria 14.1: `docs/auditorias/2026-05-07-refinamiento-thing-slots-opl.md`.
- SSOT visual: V-65, V-69, V-79/V-85, V-95/V-98, V-100.
- ICAS: `urn:fxsl:kb:icas-preservacion` (functor preserva identidad/composicion) y `urn:fxsl:kb:icas-comparacion` (naturalidad: distintos caminos de proyeccion deben conmutar).
- OPCloud: `opm-extracted/src/app/models/VisualPart/OpmVisualThing.ts` y `opm-extracted/src/app/ImportOPX/OPX.API.ts` para slots/refinement; no copiar codigo.
- Codigo local:
  - `app/src/serializacion/json.ts`
  - `app/src/render/jointjs/proyeccion.ts`
  - `app/src/modelo/operaciones/refinamiento/**`
  - `app/src/opl/generadores/refinamiento.test.ts`

## 4. Archivos Permitidos

```text
app/src/leyes/proyecciones.test.ts                 NUEVO
app/src/serializacion/json.ts                      LECTURA / EDIT puntual si ley falla
app/src/render/jointjs/proyeccion.ts               LECTURA / EDIT puntual si ley falla
app/src/modelo/operaciones/refinamiento/*.ts       LECTURA / EDIT puntual si ley falla
app/src/modelo/operaciones.ts                      LECTURA
app/src/modelo/tipos/*.ts                          LECTURA
app/src/serializacion/json.test.ts                 LECTURA
app/src/render/jointjs/proyeccion.test.ts          LECTURA
docs/roadmap/auditoria-categorial-app.md           LECTURA
```

## 5. Restricciones De No-Colision

- No tocar `app/src/opl/parser/**` (L2).
- No tocar `app/src/store/tipos.ts` ni `store/runtime.ts` (ronda 14.3).
- No tocar `docs/roadmap/quality-ledger.md` ni `app/scripts/quality-ledger.mjs` (L3).
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/**`.
- Si una ley falla por OPL reverse, reportar a L2; no arreglar en L1.

## 6. Slice Minimo Shippeable

### Modelo

Crear helpers de test locales:

```ts
function modeloRefinamientoThing(tipo: "objeto" | "proceso", refinamiento: "descomposicion" | "despliegue"): Modelo
```

La matriz debe cubrir:

| Thing | In-zoom / descomposicion | Unfold / despliegue |
|---|---|---|
| Proceso | `descomponerProceso` | `desplegarObjeto` si el kernel lo permite sobre proceso; si no, documentar ley esperada y usar API actual que 14.1 haya cerrado. |
| Objeto | `descomponerProceso` legacy sobre cosa u API equivalente actual | `desplegarObjeto` |

No crear APIs nuevas si el kernel ya resolvio 14.1 con nombres legacy.

### Serializacion

`law-json-roundtrip`: `hidratarModelo(exportarModelo(modelo))` preserva:

- ids de entidades, estados, enlaces, OPDs;
- `refinamiento.opdId`;
- `opd.padreId`;
- apariencias contorno del refinable;
- ausencia de referencias huerfanas.

### Render

`law-render-stable-metadata`: `proyectarModeloAJointCells` preserva metadata OPM:

- `cell.opm.kind`;
- `cell.opm.entidadId` / `enlaceId`;
- OPD activo;
- contorno refinado visible para V-69;
- esencia/afiliacion en metadata cuando aplique.

### Refinamiento

`law-refinement-thing-matrix`: las cuatro combinaciones que el kernel declare soportadas atraviesan JSON + render sin rechazo. Si una combinacion no esta soportada por diseño, la prueba debe expresar el diagnostico esperado y citar SSOT/decision 14.1.

`law-refinement-removal`: retirar refinamiento remueve el OPD hijo y no deja enlaces/estados/apariencias colgantes.

## 7. Tests Obligatorios

- 1 test por ley minima (4).
- 4 subcasos matrix Thing/refinamiento.
- 2 casos removal: proceso y objeto.
- Total estimado: 8-12 tests.

No smoke browser nuevo salvo que una ley exponga bug UI no cubierto por los smokes 14.1.

## 8. Verificacion

```bash
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## 9. Decisiones Bloqueadas

- No migrar schema a `refinamientos.inzoom/unfold`.
- No renombrar publicamente `descomponerProceso`/`desplegarObjeto` en esta linea.
- No convertir el detector en fuente primaria de verdad.
- No cambiar semantica OPM para que un test pase.

## 10. Decisiones Que Tomas Vos

- Nombre exacto de helpers de test.
- Si `law-refinement-thing-matrix` usa tabla generativa o tests separados.
- Si un fix puntual pertenece a JSON, render o refinamiento. Documentar con antes/despues.
- Si alguna combinacion queda como diagnostico esperado por restriccion intencional vigente.

## 11. Forma Del Entregable

Commits sugeridos:

1. `test(leyes): json/render/refinement preservan identidad OPM`
2. `fix(<capa>): corrige ley <nombre>` solo si aparece bug real.

Entregable final:

- hashes;
- lista de leyes agregadas;
- matriz Thing/refinement con pass/skip-diseño;
- pruebas ejecutadas;
- cualquier deuda residual para 14.3/Beta1.
