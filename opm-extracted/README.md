# opm-extracted

**Directorio paralelo y versionable** que contiene el código OPM útil
extraído y refactorizado desde `decompiled/` (que sigue siendo material
regenerable y gitignored), más los assets canónicos copiados desde `assets/`.

Esta carpeta es la única forma navegable de la lógica OPCloud que un agente o
humano debería usar como **referencia para construir `app/`**: nombres legibles,
estructura jerárquica espejo del repositorio Angular original, sin ruido webpack.

> No es una app ejecutable. Es código fuente Angular + TypeScript de OPCloud
> reconstruido para lectura y consulta. Ver [Política y licencia](#política-y-licencia)
> antes de copiar bloque a bloque.

---

## Layout

```
opm-extracted/
├── README.md             # este archivo
├── INDEX.md              # 486 clases OPM -> archivo (orden alfabético + por categoría)
├── MODULES.md            # 349 archivos -> símbolos top-level (clases, funciones, consts)
├── REFACTOR-NOTES.md     # decisiones del pipeline de extracción
├── tools/                # scripts de regeneración
│   ├── extract.mjs       # splitter de decompiled/ -> src/<path>
│   ├── refactor.mjs      # pasada de limpieza webpack
│   └── build-index.mjs   # genera INDEX.md / MODULES.md / assets/INDEX.md
├── src/                  # 349 archivos OPM (espejo de ./src/app/ de OPCloud)
│   ├── _index.json       # mapa procedencia file -> source chunk
│   └── app/
│       ├── models/       # núcleo OPM: BasicOpmModel, OpmModel, OpmOpd, links, consistency...
│       ├── ImportOPX/    # 7 archivos para parser/importador OPX
│       ├── dialogs/      # ~75 dialogs Angular (referencia visual)
│       ├── modules/      # layout, shared, Settings/, app/
│       ├── configuration/
│       ├── rappid-components/
│       ├── database/
│       ├── services/
│       └── ...
├── assets/               # 73 SVG + 11 PNG canónicos + INDEX.md (cross-reference)
│   ├── INDEX.md
│   ├── svg/
│   │   ├── links/{structural,procedural}/   # markers de enlaces OPM
│   │   ├── list-logical/                    # iconos de tree de cosas
│   │   ├── toolbar/
│   │   └── *.svg                            # halos, estados, archivos, branding...
│   └── png/
│       ├── icons/
│       └── modelWizard/                     # 8 páginas del wizard de creación
└── _raw/                 # 14 chunks OPM-core decompilados originales (auditoría)
```

---

## Quick stats

| Métrica | Valor |
|---|---|
| Archivos OPM extraídos | **349** |
| Líneas totales | **~165,000** |
| Bytes totales | **7.8 MiB** |
| Clases OPM distintas | **486** |
| Assets canónicos (SVG + PNG) | **84** |
| Chunks decompilados procesados | **16** (deobfuscated.js + 37084.js + 14 chunks pequeños) |

---

## Cómo está construido

1. **Origen**: `decompiled/` contiene 810 módulos `.js` post-`webcrack`. Sólo
   16 contienen código OPM real (paths `./src/app/...`); el resto son
   bibliotecas npm (Angular, RxJS, msal, Material) que deliberadamente
   **no extraemos**.
2. **`tools/extract.mjs`** localiza marcadores `// CONCATENATED MODULE: <path>`,
   trunca el preámbulo del módulo siguiente, des-indenta el closure webpack y
   emite un archivo por path bajo `src/`. Ante colisión entre fuentes (chunks
   lazy-loaded duplican el mismo path), gana la versión más larga.
3. **`tools/refactor.mjs`** aplica seis pasadas de limpieza:
   - resolver `name /* RealName */.exportkey` → `RealName` (webcrack incrusta
     el nombre canónico como comentario; lo recuperamos);
   - limpiar residuo `_X__WEBPACK_IMPORTED_MODULE_N__` → `X`;
   - renombrar variables prefijadas con basename (`BasicOpmModel_uuid` → `uuid`);
   - eliminar self-assignments `var x = x;` resultantes;
   - sacar `var X = __webpack_require__(N)` redundantes;
   - cabecera `// requires (webpack module ids): ...` para trazabilidad.
4. **`tools/build-index.mjs`** recorre `src/`, recolecta `class X (extends Y)?`,
   `function`, `const`, `enum`, `interface`, `type` top-level y genera
   `INDEX.md`, `MODULES.md` y `assets/INDEX.md` con cross-reference asset → uso.

Regeneración completa idempotente:

```bash
cd opm-extracted
node tools/extract.mjs && node tools/refactor.mjs && node tools/build-index.mjs
```

---

## Cómo navegar

### Buscar una clase

```bash
grep "^| \`AggregationLink\`" INDEX.md
# -> apunta a src/app/models/DrawnPart/Links/AggregationLink.ts
```

O abrir directamente `INDEX.md` y usar Ctrl-F.

### Ver toda la red de un dominio

`INDEX.md` agrupa por categoría:

- **Modelo lógico (LogicalPart)** — entidades atemporales: `OpmLogicalThing`,
  `OpmLogicalObject`, `OpmLogicalProcess`, `OpmLogicalState`, `OpmLogicalEntity`.
- **Modelo visual (VisualPart)** — instancias por OPD: `OpmVisualThing`,
  `OpmVisualObject`, `OpmVisualProcess`, `OpmVisualState`, `OpmVisualEllipsis`.
- **Modelo dibujado (DrawnPart)** — celdas JointJS/Rappid: `OpmEntity`,
  `OpmEntityRappid`, `OpmObject`, `OpmProcess`, `TextBlock`, `Note`.
- **Links (DrawnPart/Links)** — markers, geometría y semántica de enlaces:
  Aggregation, Exhibition, Generalization, Instantiation, Agent, Instrument,
  Effect, Consumption, Result, Invocation, SelfInvocation, Tagged, Blank,
  Overtime/Undertime exception.
- **Consistency** — reglas estructurales, comportamentales y consistional;
  validators que prohíben ciertas conexiones (Object↔Object procedural, etc.).
- **Commands & Actions** — patrón Command para undo/redo y deciders por tipo.

### Ver qué SVG usa una clase

`assets/INDEX.md` cruza cada SVG/PNG con los archivos de `src/` que lo
referencian por nombre. Útil para identificar qué SVG canónico es el de un
link, halo o icono de toolbar.

### Auditar la procedencia

Cada archivo en `src/` empieza con un header:

```ts
// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/AggregationLink.ts
// Extracted by opm-extracted/tools/extract.mjs
// requires (webpack module ids): 12345, 67890
```

Y `src/_index.json` contiene el mapa completo (incluyendo colisiones resueltas).

Los chunks originales viven en `_raw/` para auditoría puntual.

---

## Política y licencia

**Estatus legal**: este directorio contiene código de OPCloud Ltd.
(Technion → MIT) extraído y refactorizado desde el bundle público de
producción. La extracción pasa de "fair use observacional" a un derivado
curado **versionable y trazable**, cuya finalidad explícita es servir como
referencia técnica para construir un modelador OPM ISO 19450 propio (`app/`).

**Reglas operativas** (alineadas con `AGENTS.md`):

1. **No copiar bloques tal cual a `app/`**. La meta es divergir: stack distinto
   (Bun + Vite + Preact + Zustand + JointJS core), licencia limpia, arquitectura
   propia. Lo extraído sirve para entender semántica, no para clonar.
2. **Sí copiar SVGs canónicos**: `assets/svg/` y `assets/png/` son material
   visual del CDN público y se reutilizan directamente para preservar fidelidad
   a OPCloud (ver `docs/JOYAS.md` por dimensiones y colores canónicos).
3. **Sí leer y citar reglas de consistency, OPL templates y algoritmos** para
   asegurar conformidad con OPM/ISO 19450 — pero la implementación es
   reescrita desde cero usando estos archivos como spec ejecutable.
4. **No reusar componentes Angular** (`dialogs/`, `modules/Settings/`,
   `rappid-components/`). Esos quedan como referencia de afordances para
   diseñar equivalentes Preact, no como código portable.

---

## Qué NO está aquí

- Bibliotecas npm decompiladas (Angular, RxJS, Material, msal, Rappid). Se
  filtran en `extract.mjs` por path (`./node_modules/...` se descarta).
- Backend (Express + GAE) — no es público.
- Source maps TypeScript — `--source-map=false` en el build de OPCloud.
- Tests — no aparecen en el bundle de producción.
- Schema Firestore — bloqueado por auth (ver `docs/handoff-2026-07-18.md`).
- Archivos `.gif` y assets bajo `gifs/`, `icons/essenceAffil/`,
  `codeEditorThemes/`, `monaco/` — aparecen referenciados en código pero no
  se descargaron desde el CDN. Ver `assets/INDEX.md` § Wishlist.

---

## Trazabilidad inversa

Si necesitas regenerar todo desde cero:

```bash
# 1. Repoblar decompiled/ desde el bundle de OPCloud (requiere internet + npx webcrack)
cd .. && bash setup.sh

# 2. Regenerar opm-extracted/
cd opm-extracted
node tools/extract.mjs
node tools/refactor.mjs
node tools/build-index.mjs

# 3. Verificar
diff <(ls src/app/models/) <(git show HEAD:opm-extracted/src/app/models/) || true
```
