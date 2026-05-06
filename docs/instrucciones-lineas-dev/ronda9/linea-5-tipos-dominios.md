# Línea 5 — Tipos por dominio

## 1. Misión

Romper el archivo de tipos canónicos `app/src/modelo/tipos.ts` (**241 LOC**) en sub-archivos por **dominio del modelo OPM**, conservando el barrel re-export para mantener intactos los **122 archivos consumidores**. La forma OPCloud para este problema es **un archivo por modelo lógico** (`opm-extracted/src/app/models/Logical/AggregationLink.ts`, `models/DrawnPart/Links/EffectLink.ts:117`); destilamos ese patrón a TypeScript con sub-archivos disjuntos por dominio que `app/src/modelo/tipos.ts` re-exporta como barrel.

Cierre arquitectural: `tipos.ts` queda como **barrel agregador** (objetivo: < 100 LOC; tope absoluto: < 150 LOC); todos los tipos viven en `app/src/modelo/tipos/<dominio>.ts`. Los 122 consumidores siguen importando desde `tipos.ts` sin cambio. Tests existentes intactos. Esta es la línea con menor blast técnico (solo declaraciones de tipo) pero **mayor blast cognitivo por fan-in**: cualquier cambio se propaga.

**Slice mínimo entregable**:

11-12 sub-archivos en `app/src/modelo/tipos/`:

- `comunes.ts`: `Id`, `PestanaId`, `Posicion`, `Resultado<T>`. Tipos primitivos compartidos por todo el modelo. ~30 LOC.
- `entidad.ts`: `Entidad`, `TipoEntidad`, `Esencia`, `Afiliacion`, `RefinamientoEntidad`, `TipoRefinamiento`, `ModoDespliegueObjeto`, `UrlObjetoTipada`, `TipoUrlObjeto`. ~40 LOC.
- `estado.ts`: `Estado`, `DesignacionEstado`, `DuracionTemporal`, `UnidadTiempo`. ~20 LOC.
- `apariencia.ts`: `Apariencia`, `EstiloApariencia`, `ModoPlegado`, `OrdenPartesPlegado`, `LayoutEstados`. ~30 LOC.
- `enlace.ts`: `Enlace`, `TipoEnlace`, `EnlaceEstilo`, `Modificador`, `ExtremoEnlace`, `ExtremoKind`, `AparienciaEnlace`, `DerivacionEnlace`, `DerivacionOrigen`. ~40 LOC.
- `abanico.ts`: `Abanico`, `OperadorAbanico`. ~5 LOC.
- `opd.ts`: `Opd`. ~10 LOC.
- `modelo.ts`: `Modelo`, `VersionResumen`. ~20 LOC.
- `pestana.ts`: `Pestana`, `OrigenPestana`, `HistorialEntrada`. ~20 LOC.
- `opl.ts`: `BloqueOplEstado`. ~5 LOC. (Si solo es 1 tipo, considerar dejarlo en `comunes.ts` o crear igual.)
- `ui.ts`: `UiPortapapelesVisual`, `PreferenciasUiUsuario`. ~15 LOC.

Barrel `tipos.ts` reducido:

```ts
// app/src/modelo/tipos.ts (< 100 LOC)
/**
 * Barrel agregador de tipos canónicos del modelo OPM.
 * Re-exporta todos los tipos desde sub-archivos por dominio:
 * comunes, entidad, estado, apariencia, enlace, abanico, opd, modelo, pestana, opl, ui.
 * Consumidores: 122 archivos en app/src/. Las firmas de tipos se preservan
 * sin cambio respecto a la versión monolítica pre-ronda 9.
 */
export type { Id, PestanaId, Posicion, Resultado } from "./tipos/comunes";
export type {
  Entidad, TipoEntidad, Esencia, Afiliacion, RefinamientoEntidad,
  TipoRefinamiento, ModoDespliegueObjeto, UrlObjetoTipada, TipoUrlObjeto,
} from "./tipos/entidad";
export type { Estado, DesignacionEstado, DuracionTemporal, UnidadTiempo } from "./tipos/estado";
export type {
  Apariencia, EstiloApariencia, ModoPlegado, OrdenPartesPlegado, LayoutEstados,
} from "./tipos/apariencia";
export type {
  Enlace, TipoEnlace, EnlaceEstilo, Modificador, ExtremoEnlace, ExtremoKind,
  AparienciaEnlace, DerivacionEnlace, DerivacionOrigen,
} from "./tipos/enlace";
export type { Abanico, OperadorAbanico } from "./tipos/abanico";
export type { Opd } from "./tipos/opd";
export type { Modelo, VersionResumen } from "./tipos/modelo";
export type { Pestana, OrigenPestana, HistorialEntrada } from "./tipos/pestana";
export type { BloqueOplEstado } from "./tipos/opl";
export type { UiPortapapelesVisual, PreferenciasUiUsuario } from "./tipos/ui";
```

**Verificación crítica**: `grep -rln "from.*['\"].*\\bmodelo/tipos['\"]" app/src/ | wc -l` debe seguir devolviendo 122 archivos sin error de import resolution tras el refactor.

**Fuera de slice**:

- **No tocar `app/src/store/tipos.ts`** (territorio L1 ronda 8, ya separado y maduro). El store tiene su propio `tipos.ts` con `OpmStore` y tipos store-locales. NO se mezclan.
- **No introducir tipos nuevos**. La línea es 100% refactor estructural; cualquier tipo nuevo se rechaza.
- **No cambiar firmas de tipos existentes**. Cualquier cambio de campos o cambio de optional/required rompe el funtor faithful.
- **No tocar `app/src/modelo/operaciones.ts`** (territorio L1 ronda 9). Si un tipo emerge de operaciones (ej. `EstadoCreado`, `DescomposicionProceso`), queda en operaciones; no se migra a `tipos.ts`.
- **No tocar otros archivos de `app/src/modelo/`** salvo `tipos.ts`. Helpers, validaciones, etc. siguen importando `tipos.ts` (barrel).
- **No tocar `app/src/render/`, `app/src/store/`, `app/src/serializacion/`, `app/src/opl/`, `app/src/ui/`, `app/src/canvas/`, `app/src/persistencia/`**: todos consumen `tipos.ts` y no necesitan cambios.

## 2. Deudas que cierra

| Deuda | Path absoluto | Aporte |
|---|---|---|
| Tipos canónicos mezclados en archivo único | `/home/felix/projects/deep-opm-pro/app/src/modelo/tipos.ts` (241 LOC) | Reduce a < 100 LOC en barrel; 11 sub-archivos < 50 LOC c/u. |
| Fan-in 122 sin partición conceptual | (122 archivos importan tipos.ts) | Mejora DX: navegación más rápida a tipo específico; tree-shaking más eficiente para builds finales (aunque con `import type` ya es zero-cost). |
| Patrón ronda 8 incompleto sobre la última superficie compartida con fan-in alto | (`docs/HANDOFF.md §Pendientes Inmediatos` lista L5 como candidato bajo blast) | Cierra el patrón canónico; deja el corpus en estado terminado. |

## 3. Anclaje a evidencia

- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md`: glosario y axiomas. Cada tipo (`Entidad`, `Enlace`, `Estado`, `Opd`, `Apariencia`, `Modelo`) corresponde a una definición canónica de la SSOT. La partición por dominio respeta ISO 19450.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/Logical/AggregationLink.ts` y `EffectLink.ts:117` — OPCloud separa tipos de enlace por familia en archivos. Confirma `tipos/enlace.ts` agrupa todos los tipos de enlace + extremos + apariencia de enlace.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/DrawnPart/OpmObject.ts:5-15`, `OpmEntity.ts:6-16` — clases por dominio. Confirma `tipos/entidad.ts` agrupa Entidad + esencia + afiliación + refinamiento + URLs (metadata aditiva ronda 7).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/json.model.ts:6-611` — `JsonModel` separa tipos internos por sección. Confirma el patrón.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/REFACTOR-NOTES.md:13-25` — webcrack divide bundles por path semántico. Justifica modularización por dominio.
  - `/home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/linea-1-store-slices.md` — brief L1 ronda 8 que separó `OpmStore` en slices. Mismo patrón aplicado a `tipos.ts` global.
- **Estado actual del código (post-ronda 8)**:
  - `app/src/modelo/tipos.ts` (241 LOC): 11 dominios mezclados (ver §1 listado).
  - 122 archivos importan `from "../modelo/tipos"` o equivalente (verificado con grep).
  - `app/src/store/tipos.ts` (531 LOC) es **otro archivo distinto** con `OpmStore` y tipos store-locales. NO se confunde con `app/src/modelo/tipos.ts`.
  - Todos los tipos están exportados como `export type` o `export interface`. Ninguno es `export const` (no hay valores en este archivo).

## 4. Archivos permitidos

```text
app/src/modelo/tipos.ts                        EDIT — reducir a barrel < 100 LOC (objetivo) / < 150 LOC (tope)
app/src/modelo/tipos/comunes.ts                NUEVO
app/src/modelo/tipos/entidad.ts                NUEVO
app/src/modelo/tipos/estado.ts                 NUEVO
app/src/modelo/tipos/apariencia.ts             NUEVO
app/src/modelo/tipos/enlace.ts                 NUEVO
app/src/modelo/tipos/abanico.ts                NUEVO
app/src/modelo/tipos/opd.ts                    NUEVO
app/src/modelo/tipos/modelo.ts                 NUEVO
app/src/modelo/tipos/pestana.ts                NUEVO
app/src/modelo/tipos/opl.ts                    NUEVO
app/src/modelo/tipos/ui.ts                     NUEVO
opm-extracted/**                               LECTURA
docs/HANDOFF.md                                LECTURA (no editar)
docs/historias-usuario-v2/**                   LECTURA (no editar)
```

NO se permite editar ningún otro archivo. La línea es 100% refactor de declaraciones de tipo.

## 5. Restricciones de no-colisión

- **No tocar `app/src/store/tipos.ts`** ni ningún otro archivo `tipos.ts` que exista en sub-directorios.
- **No tocar consumidores**: los 122 archivos siguen importando desde `app/src/modelo/tipos` (barrel preserva). Si algún archivo está actualmente importando un tipo que se moverá a sub-archivo, NO actualizar el import; el barrel re-exporta.
- **No introducir tipos nuevos**. Si emerge la tentación de agregar un type alias para conveniencia, contenerse.
- **No cambiar tipos existentes**: ni añadir campos opcionales, ni cambiar required a optional, ni renombrar campos. Cero diff de comportamiento.
- **No introducir `index.ts`** en `tipos/`. El barrel `tipos.ts` es el único punto de entrada.
- **Preservar imports cíclicos cero**: si un tipo de `entidad.ts` necesita uno de `estado.ts` o viceversa, declarar la dependencia explícita. TypeScript permite imports cíclicos entre tipos pero introduce confusión; preferir grafo acíclico (`comunes.ts` no importa de nadie; los demás importan solo de `comunes.ts`; salvo casos legítimos como `Apariencia` que no necesita `Estado`).

## 6. Slice mínimo shippeable

### 6.1 Capa tipos (única capa que toca L5)

Cada sub-archivo abre con un comentario JSDoc del módulo:

```ts
// app/src/modelo/tipos/entidad.ts
/**
 * Tipos canónicos del dominio Entidad (Object/Process en SSOT OPM).
 * Cubre Entidad + variantes (esencia/afiliación), refinamiento y metadata
 * (alias, unidad, descripción, URLs).
 * Refs: SSOT opm-iso-19450-es.md §3.55 (Object), §3.69 (Process), §3.71 (State).
 *       opm-extracted/src/app/models/DrawnPart/OpmObject.ts:5-15.
 */
import type { Id } from "./comunes";

export type TipoEntidad = "objeto" | "proceso";
export type Esencia = "informacional" | "fisica";
export type Afiliacion = "sistemica" | "ambiental";
export type TipoRefinamiento = "descomposicion" | "despliegue";
export type ModoDespliegueObjeto = "agregacion" | "exhibicion" | "generalizacion" | "clasificacion";
export type TipoUrlObjeto = "imagen" | "video" | "articulo" | "texto" | "oslc";

export interface RefinamientoEntidad {
  tipo: TipoRefinamiento;
  opdId: Id;
  modo?: ModoDespliegueObjeto;
}

export interface UrlObjetoTipada {
  id: Id;
  url: string;
  tipo: TipoUrlObjeto;
}

export interface Entidad {
  id: Id;
  tipo: TipoEntidad;
  nombre: string;
  esencia: Esencia;
  afiliacion: Afiliacion;
  refinamiento?: RefinamientoEntidad;
  alias?: string;
  unidad?: string;
  descripcion?: string;
  urls?: UrlObjetoTipada[];
  layoutEstados?: import("./apariencia").LayoutEstados;
}
```

Si un tipo necesita otro de un sub-archivo distinto, usar `import type` explícito o `import("./otro").Tipo` para evitar imports al top-level cíclicos.

### 6.2 Barrel reducido

Ver listado en §1. Cada `export type { ... } from "./tipos/<dominio>"` es explícito (no `export *`) para que el barrel sea greppable y el detector tenga evidencia textual de cada tipo.

### 6.3 Validación post-refactor

```bash
# Verificar que ningún consumidor cambió:
git diff --stat HEAD~1 -- app/src/ | grep -v "modelo/tipos" | wc -l
# debe ser 0 (ninguna línea fuera de modelo/tipos cambió)

# Verificar fan-in preservado:
grep -rln "from.*['\"].*\\bmodelo/tipos['\"]" app/src/ | wc -l
# debe ser 122

# Verificar typecheck:
cd app && bun run typecheck
# debe pasar sin error
```

## 7. Tests obligatorios

- **Suites existentes intactas**: 558 tests / 2357 expects verde sin reescribir.
- **Smokes existentes intactos**: 40/40 verde.
- **Tests aditivos NO obligatorios**: los tipos no tienen comportamiento runtime (son borrados en compilación). No hay tests de tipos por defecto. Si se decide agregar `tsd` tests para verificar firmas, declarar; pero **es deuda menor y no bloqueante**.

La validación principal es `bun run typecheck`: si pasa, los 122 consumidores siguen consumiendo los tipos correctamente.

## 8. Verificación

```bash
cd app
bun run typecheck                              # crítico — debe pasar
bun run test src/                              # suite completa, sin reescribir
bun run check                                  # typecheck + tests
# bun run browser:smoke no es obligatorio (los tipos no afectan runtime)
# bun run build no es obligatorio (los tipos son zero-cost)
```

Detector: L5 no toca `progress-dashboard.mjs` directamente. L_scaffolding declara reglas tolerantes para `tipos/*` con paths nuevos (las reglas que evidencian tipos como `"alias?:"`, `"unidad?:"`, `"DesignacionEstado"`, etc. siguen matcheando porque el barrel re-exporta los tipos en su archivo correspondiente).

## 9. Decisiones bloqueadas (no reabrir)

- **Firmas de tipos**: idénticas. Cero diff de campos, cero diff de optional/required, cero rename.
- **`app/src/store/tipos.ts`** (511 LOC) NO se toca. Es territorio L1 ronda 8 y aloja `OpmStore` (estado del store). Conceptualmente distinto al modelo OPM.
- **Tipos de operaciones**: tipos como `DescomposicionProceso`, `DespliegueObjeto`, `EstadoCreado`, `EstadosInicialesObjeto`, `LadoMultiplicidadEnlace`, `LadoExtremoEnlace` viven en `app/src/modelo/operaciones.ts` (territorio L1 ronda 9). No se migran a `tipos.ts`.
- **No introducir Generics nuevos**: `Resultado<T>` es el único genérico actual. No agregar más.
- **No usar `branded types`** (nominal types). Los `Id` son string puros; no convertir a `Id & { __brand }` en esta línea.
- **No introducir Zod, io-ts, ni schema validators**: la validación runtime vive en `app/src/serializacion/validar*.ts` (territorio L3 ronda 8).

## 10. Decisiones que tomas vos (documentar en commit)

- **Archivo `tipos/opl.ts` con un solo tipo (`BloqueOplEstado`)**: crear o fusionar con `comunes.ts` o `ui.ts`. Recomendado: crear (mantiene granularidad por dominio).
- **`tipos/abanico.ts` con dos tipos**: crear o fusionar con `enlace.ts`. Recomendado: crear (Abanico es un dominio canónico OPM separado, ronda 4).
- **Granularidad de `tipos/comunes.ts`**: si crece más allá de 50 LOC, considerar partir en `comunes/` con sub-archivos. Probablemente queda < 30 LOC; no necesario.
- **Imports entre sub-archivos**: si emerge dependencia cíclica (ej. `Apariencia` necesita `LayoutEstados` que está en `apariencia.ts` mismo, y `Entidad` necesita `LayoutEstados`), resolver con `import type { LayoutEstados } from "./apariencia"` en `entidad.ts`. Documentar las dependencias entre sub-archivos en el commit.
- **`export type` vs `export interface`**: mantener el estilo actual del archivo (TypeScript permite ambos). Si emerge la duda, `export type` para uniones/aliases y `export interface` para shapes.
- **JSDoc por sub-archivo**: obligatorio el header del módulo (responsabilidad + refs SSOT/OPCloud). Por tipo individual, opcional pero recomendado para tipos no triviales.

## 11. Forma del entregable

Commit sugerido:

```
refactor(modelo): extrae tipos canónicos por dominio

- 11 sub-archivos en tipos/{comunes,entidad,estado,apariencia,enlace,abanico,opd,modelo,pestana,opl,ui}.ts
- tipos.ts reducido a barrel < 100 LOC
- 122 consumidores intactos (firmas preservadas)
- Cero diff runtime (tipos son zero-cost)
- typecheck verde

Refs: opm-extracted/src/app/models/DrawnPart/OpmObject.ts:5-15,
      models/Logical/AggregationLink.ts,
      SSOT opm-iso-19450-es.md §3.55, §3.69, §3.71

Co-Authored-By: <implementador-externo> <noreply@...>
```

**Reporte de cierre obligatorio**:

- Hash final del último commit en main.
- LOC final de `tipos.ts` + cada `tipos/*.ts`.
- Output de `bun run typecheck` (debe pasar).
- Output de `bun run check` (último tail).
- Output de `wc -l app/src/modelo/tipos.ts app/src/modelo/tipos/*.ts`.
- Output de `grep -rln "from.*['\"].*\\bmodelo/tipos['\"]" app/src/ | wc -l` (debe ser 122).
- Output de `git diff --stat HEAD~1 -- app/src/ | grep -v "modelo/tipos" | wc -l` (debe ser 0).
- Decisiones declaradas (de §10).

**Qué NO tocar**:

- `docs/HANDOFF.md`, `docs/historias-usuario-v2/`, `docs/JOYAS.md`, `docs/instrucciones-lineas-dev/ronda1..8/`.
- `app/src/store/tipos.ts` (otro archivo, otra línea).
- `app/src/modelo/operaciones.ts` (territorio L1 ronda 9).
- Cualquier consumidor: `app/src/render/*`, `app/src/store/*`, `app/src/serializacion/*`, `app/src/opl/*`, `app/src/ui/*`, `app/src/canvas/*`, `app/src/persistencia/*`, otros archivos de `app/src/modelo/*`.
- `app/scripts/in-vivo-test.mjs`, `app/src/render/jointjs/customShapes.ts`, `home/`.
