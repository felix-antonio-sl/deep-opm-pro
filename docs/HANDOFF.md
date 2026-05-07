# HANDOFF - Alpha real cerrado + pre-beta law-first

**Fecha**: 2026-05-07
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**Corte**: rondas 14.2 y 14.3 integradas sobre el cierre 14.1 de refinamiento OPM completo sobre Thing.
**Estado**: alpha real cerrado por ledger operativo: OPL reverse editable ya no queda como parcial; MVP-alpha **100.0%**.

## Politica De Handoff Unico

`docs/HANDOFF.md` es la unica memoria de traspaso vigente del proyecto. Este
archivo reemplaza y consolida el handoff anterior. No crear handoffs paralelos,
fechados ni duplicados.

## Contexto Normativo

El modelador OPM vive en `app/` con Bun + Vite + Preact + Zustand + JointJS OSS.
La arquitectura sigue siendo propia: no Angular, no Firebase, no Rappid.

Autoridad semantica:

- SSOT OPM/ISO 19450: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`
- Evidencia operacional OPCloud: `opm-extracted/`
- Evidencia visual canonica: `assets/svg/`, `assets/png/`, `docs/JOYAS.md`
- Backlog vivo: `docs/historias-usuario-v2/`
- Corte operativo vivo: `docs/roadmap/`

OPCloud operacionaliza OPM, pero no redefine la semantica. Cualquier solucion
nueva debe buscar primero en `assets/`, `docs/JOYAS.md`, `opm-extracted/` y la
SSOT antes de inventar.

## Memoria Consolidada Del Corte

La ronda 14.1 corrigio el bloque semantico de refinamiento:
**inzoom/descomposicion** y **unfold/despliegue** aplican a **Thing** (objeto o
proceso), no a la matriz historica restringida objeto-unfold/proceso-inzoom. Se
conservo el schema actual `entidad.refinamiento` y los nombres publicos legacy
por compatibilidad, pero el comportamiento ya cubre la matriz completa.

La ronda 14.2 agrego una capa **law-first** antes de seguir hacia beta:

- leyes de identidad para proyecciones JSON/render/refinamiento;
- leyes de seguridad para OPL reverse editable;
- ley de preview sin mutacion;
- ley de undo atomico para aplicar OPL;
- ledger de calidad ejecutable.

La ronda 14.3 hizo explicitas fronteras arquitectonicas que estaban implicitas:

- contratos de slices de store con `Pick<OpmStore, ...>` en vez de aliases
  `Partial<OpmStore>`;
- frontera de efectos runtime (`confirm`, storage, reloj, UUID/random);
- opciones de proyeccion explicitables sin depender de globals legacy;
- adaptadores legacy aislados para compatibilidad UI.

## Commits Del Corte Actual

| Ronda | Commit | Aporte |
|---|---|---|
| 14.2 L1 | `b97e088` | `test(leyes): proyecciones preservan identidad OPM` |
| 14.2 L2 | `3d645e2` | `test(leyes): OPL reverse es lente segura y undoable` |
| 14.2 L3 | `8455318` | `docs(quality): agrega ledger law-first pre-beta` |
| 14.3 L1 | `306e202` | `refactor(store): explicita contratos de slices` |
| 14.3 L2 | `7076784` | `refactor(runtime+render): explicita effects y opciones de proyeccion` |

La consolidacion final actualiza el dashboard, reemplaza este HANDOFF y publica
todo sobre `origin/main`.

## Estado De Alpha

**MVP-alpha: 100.0% ponderado**

- 121 HU alpha cubiertas.
- 0 parciales.
- 0 pendientes.
- Detector: 102/102 reglas matched.

La HU que bloqueaba el cierre real, **HU-SHARED-007 / OPL reverse editable**, ya
queda tratada como cerrada en el corte operativo. Ronda 14.2 no solo acepta el
cierre funcional: lo rodea con leyes que protegen la semantica de lente segura.

Garantias nuevas:

- El parser inverso no borra por ausencia de linea.
- El preview OPL no muta el modelo.
- Las oraciones OPL validas pero aun no soportadas producen diagnostico, no
  mutacion silenciosa.
- Aplicar OPL crea una unidad undo atomica.

## Verificacion Final Ejecutada

Desde `app/`:

```bash
bun run check
# 903 pass / 0 fail / 3545 expect() / 90 archivos

bun run lint
# eslint src/ui/ OK

bun run build
# vite build OK
# main bundle: 233.48 kB / 62.78 kB gzip

bun run browser:smoke
# 106 passed

bun run scripts/quality-ledger.mjs --markdown
# Canonical laws: 6/6
# Compat detectors: 1
# MVP-alpha: 121/121 (100%)
# Auto rules: 102/102 matched
```

Desde la raiz:

```bash
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
# HU vivas: 1126
# Total: 28.5% ponderado (313 cubiertas, 22 parciales, 413 pendientes, 378 diferidas)
# MVP-alpha: 100.0% ponderado (121 cubiertas, 0 parciales, 0 pendientes)
# 102/102 reglas matched
```

Diagnostico vivo: 1 advertencia ledger heredada (`HU-13.005` duplicate-id,
legado pre-ronda-8). No bloquea este corte.

## Decisiones Nuevas

### Law-first antes de beta

Antes de abrir beta funcional se fijo una base de leyes ejecutables. Las leyes
no reemplazan pruebas unit/e2e; definen invariantes que deben sobrevivir a
refactors de UX, render y OPL:

- `law-json-roundtrip`
- `law-render-stable-metadata`
- `law-refinement-thing-matrix`
- `law-refinement-removal`
- `law-opl-safe-lens`
- `law-opl-preview-no-mutation`
- alias operativo: `law-opl-apply-undo-atomicity` como evidencia de
  `law-store-undo-atomicity`

### Store slices como contrato explicito

`app/src/store/sliceTypes.ts` define las superficies de cada slice con
`Pick<OpmStore, ...>`. Ya no hay aliases `type *Slice = Partial<OpmStore>`.

Se agregaron checks de cobertura:

- `OpmStoreSliceMissingKeys`
- `OpmStoreSliceExtraKeys`

El tipo `CrearSlice<T>` conserva `Partial<OpmStore>` solo como detalle de
compatibilidad con Zustand `set`, no como contrato publico de slice.

### Runtime effects aislados

`app/src/store/runtimeEffects.ts` concentra los efectos del runtime:

- `now()`
- `confirm(message)`
- `readLocalStorage(key)`
- `writeLocalStorage(key, value)`
- `randomUUID()`
- `random()`

`app/src/store/runtime.ts` ya no lee `globalThis.confirm`, `globalThis.localStorage`,
`globalThis.crypto` ni `Date.now()` directamente. El fallback de ID local usa
tambien `runtimeEffects.random()`, no `Math.random()` directo.

### Proyeccion sin globals obligatorios

`app/src/render/jointjs/proyeccionOpciones.ts` separa:

- defaults canonicos de proyeccion;
- normalizacion de opciones explicitas;
- adaptador legacy para los globals `__deepOpmUi*`.

`proyectarModeloAJointCells(...)` puede recibir opciones explicitas y, en ese
modo, no lee ni hereda estado global. Los globals sobreviven solo como puente
legacy para la UI actual.

## Cascadas Gestionadas

| Cascada | Resolucion |
|---|---|
| 14.2 L1/L2 agregan leyes sobre codigo ya estabilizado por 14.1. | Se commitearon como tests puros, sin cambios de dominio. `bun run check` subio de 888/898 a 903 tras 14.3. |
| OPL reverse editable paso de cierre funcional a cierre con leyes. | Se fijaron lente segura, preview sin mutacion, unsupported no-op y undo atomico. |
| Dashboard necesitaba re-scan tras nuevos archivos. | `--sync-real` actualizo timestamps y conteo de fuentes 381 -> 388; reglas siguen 102/102. |
| Store tenia contratos de slices demasiado laxos. | Se introdujo `sliceTypes.ts` y se eliminaron aliases `Slice = Partial<OpmStore>`. |
| Runtime/render mezclaban logica pura con entorno browser. | Se aislaron adaptadores en `runtimeEffects.ts` y `proyeccionOpciones.ts`; archivos core ya no tienen `globalThis` directo. |
| Bundle sigue sobre objetivo historico. | Documentado como deuda viva: 233.48 kB / 62.78 kB gzip. No bloquear alpha; tratar en corte de performance/UX posterior. |

## Estado Por Dominio

- **Modelo/kernel**: estable tras 14.1. Refinamiento sobre Thing cubierto y
  rodeado por leyes 14.2.
- **OPL**: reverse editable cerrado para alpha; parser inverso sigue siendo
  incremental, no parser completo de todo OPL. Unsupported debe diagnosticar sin
  mutar.
- **Render JointJS**: proyeccion con opciones explicitables; metadata estable
  cubierta por ley.
- **Store**: contratos de slices explicitos; undo atomico preservado.
- **Runtime/browser effects**: frontera injectable; `runtime.ts` sin acceso
  directo a browser globals.
- **Dashboard HU**: alpha 100%; total backlog 28.5%.
- **Quality ledger**: disponible como `cd app && bun run scripts/quality-ledger.mjs --markdown`.

## Pendientes Reales Antes De Beta

Beta no debe arrancar como "mas features OPCloud". Los cortes oficiales son de
producto; las rondas arquitectonicas son internas.

### Corte Recomendado: Beta-0 Foundation

Objetivo: modelar KORA/HDOS/GOREOS con UX suficientemente estable para trabajo
real, sin prometer simulacion completa.

Incluye:

- normalizacion IFML pendiente;
- bugs visuales y UX de modelado diario;
- autolayout asistido como vista sugerida/aplicar layout, no motor obligatorio;
- apariencia exacta de shapes/enlaces/anclaje/cruces desde `opm-extracted/` +
  SSOT visual;
- validacion metodologica como nucleo;
- catalogo simple, sin carpetas/workspace complejo;
- capturador de bugs integrado con imagen + texto + codigo referenciable para
  agentes.

### Corte Recomendado: Beta-1 Dominio Real

Objetivo: un modelo ancla mediano (KORA/HDOS/GOREOS) debe poder sostenerse con:

- Tabla de Enlaces como herramienta real de auditoria y edicion;
- busqueda intra-modelo;
- descomposicion/refinamiento/estados suficientemente ergonomicos;
- validacion metodologica accionable;
- OPL reverse confiable dentro del subset soportado.

### Corte Posterior: Beta-2 Simulacion

La simulacion queda fuera de Beta-0/Beta-1 salvo que un modelo ancla la requiera
como eval. No subir A0 estereotipos ni asistente de 12 etapas a beta: A0 queda
fuera y el asistente se resuelve como skill, no como requisito del producto.

## Proximos Pasos Operativos

1. Actualizar `docs/roadmap/cortes-operativos.md` sin editar HU originales.
2. Incorporar la auditoria IFML como ronda 13.1/15 foundation, no como parche
   lateral.
3. Definir evals de Beta-0/Beta-1 contra modelos ancla:
   - `/home/felix/projects/hd-dt`
   - `/home/felix/projects/hdos`
   - `/home/felix/projects/hdos-app`
4. Antes de nuevas features, revisar con profundidad SSOT OPM + `opm-extracted/`
   para apariencia, enlaces, anclaje, routing y cruces.
5. Mantener el loop:
   - `cd app && bun run check`
   - `cd app && bun run lint`
   - `cd app && bun run build`
   - `cd app && bun run browser:smoke`
   - `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`

## Prompt De Continuacion Breve

Usa `docs/HANDOFF.md` como memoria unica. El alpha real esta cerrado: OPL reverse
editable ya no queda parcial y las leyes 14.2 lo protegen. Continua con la capa
operativa de cortes (`docs/roadmap/cortes-operativos.md`) y la normalizacion
pre-beta: IFML, UX visual, autolayout sugerido, apariencia/enlaces/anclaje desde
SSOT + `opm-extracted/`, y capturador de bugs integrado.
