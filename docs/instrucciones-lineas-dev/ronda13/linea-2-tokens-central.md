# Línea 2 — tokens.ts central completo + ESLint rule + migración archivo por archivo

## 1. Misión

Expandir `app/src/ui/tokens.ts` (mínimo introducido en ronda 12.1 + 2 tokens suaves T1.2 ronda 13.0) a **módulo central completo** con `colors`, `spacing`, `radii`, `shadows`, `typography`. Migrar las **~108 ocurrencias de literales** en `app/src/ui/**/*.{ts,tsx}` (excluye Toolbar.tsx que L1 refactoriza) con commits atómicos por archivo. Introducir **ESLint rule custom** `no-restricted-syntax` con regex `/#[0-9A-Fa-f]{3,8}/` solo en `app/src/ui/**/*.{ts,tsx}` (excluye `tokens.ts`).

Combina T2.2 + T2.4 según auditoría steipete §3.

Slice mínimo entregable: 1 commit `feat(tokens): extension central` + N commits `refactor(<archivo>): migra literales a tokens` + 1 commit `chore(lint): rule no-restricted-syntax color literales`. Total ~30-40 commits según volumen real (cada archivo modificado es un commit visible para reversibilidad simple).

**Fuera de slice**:

- **No tocar `Toolbar.tsx`** (territorio L1; los 5 nuevos archivos `toolbar/*.tsx` post-L1 importan tokens — pero la migración del Toolbar original NO entra en L2 porque L1 lo refactoriza completo).
- **No tocar `BarraHerramientasElemento.tsx`** (L4 lo crea ya con tokens desde el inicio).
- **No tocar `PanelMetodologia.tsx` / `checkers.ts`** (L3 los crea ya con tokens).
- **No tocar paleta canvas** (`#70E483`, `#3BC3FF`, `#586D8C` en composers JointJS, render). El alcance es **chrome UI puro**, no canvas semántico.
- **No introducir dark mode** (sin variables CSS root).
- **No reescribir lógica funcional** de los componentes migrados.

## 2. HU base

| HU | Estado actual | Aporte L2 |
|---|---|---|
| **Sin HU directa** | refactor estructural autorizado por brief steipete §T2.2 + §T2.4 | tokens.ts central + ESLint rule + migración 108 ocurrencias UI. NO cierra HU del backlog. |

L2 NO cierra HU directas. Es **refactor estructural** preparatorio para dark mode futuro, rebrand, ronda 14+. Métrica de éxito:
- `tokens.ts` con `colors` + `spacing` + `radii` + `shadows` + `typography`.
- 0 literales `#xxxxxx` en `app/src/ui/**/*.{ts,tsx}` excepto `tokens.ts` (verificado por `bun run lint`).
- Cero regresión visual (smokes Playwright + visual snapshot manual).

## 3. Anclaje a evidencia

**Nivel 1 — SSOT (citas opcionales)**:

- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/06-PROVENANCE.md §2`: política operativa.

**Nivel 2 — `app/src/modelo/tipos.ts`**: NO se modifica desde L2.

**Nivel 3 — respaldo técnico (cita obligatoria por contrato visual)**:

- **`docs/JOYAS.md`** completo: paleta canónica + dimensiones + tipografía. **Cita obligatoria L2** en header `tokens.ts`.
- **`docs/auditorias/2026-05-07-refactor-radical-steipete.md` §T2.2 + §T2.4**: contrato L2.
- **`opm-extracted/src/styles/`** (verificar con `ls`; si existe, referencia para spacing/radii scales; si no, derivar de patterns observables).
- **Estado actual del código (verificado)**:
  - `app/src/ui/tokens.ts` ronda 12.1 + ronda 13.0: `colors.acentoUi`, `colors.acentoSecundario`, `colors.chromeNeutral`, `colors.canvas` + `colors.acentoUiSuave` + `colors.chromeNeutralSuave` (T1.2).
  - `app/src/ui/tokens.test.ts`: 5 expects (3 ronda 12.1 + 2 ronda 13.0 T1.2).
  - Literales totales en `app/src/ui/**`: ~827 (incluye composers canvas; alcance L2 = chrome UI puro estimado ~108).
  - `app/.eslintrc*` o `eslint.config.js`: NO existe (verificado). L2 introduce config inicial.
  - `app/package.json`: verificar si tiene script `lint` (si no, agregarlo).
  - Inspector secciones (11): `SeccionAlias.tsx`, `SeccionAtributo.tsx`, `SeccionDescripcion.tsx`, `SeccionDesignaciones.tsx`, `SeccionDuracion.tsx`, `SeccionEsenciaAfiliacion.tsx`, `SeccionImagen.tsx`, `SeccionLayoutEstados.tsx`, `SeccionRefinamiento.tsx`, `SeccionTamano.tsx`, `SeccionUrls.tsx`.
  - MenuContextual (3): `MenuContextualEntidad.tsx`, `MenuContextualEnlace.tsx`, `MenuContextualArbol.tsx`.
  - Diálogos (~14): `DialogoCargarModelo`, `DialogoGuardarComo`, `DialogoVersiones`, `DialogoArchivados`, `DialogoBuscarGlobal`, `DialogoBuscarCosas`, `DialogoMoverPuerto`, `DialogoTraerConectados`, `DialogoPlantillas`, `DialogoGuardarPlantilla`, `Dialogo` (wrapper), etc.
  - Modales (~4): `ModalImagenObjeto`, `ModalDuracionEstado`, etc.
  - Otros: `MenuPrincipal.tsx`, `PantallaInicio.tsx`, `ArbolOpd.tsx`, `BibliotecaCosa.tsx`, `arbol/NodoOpd.tsx`, `panelOpl/Bloques.tsx`, `panelOpl/Toolbar.tsx`, `Inspector*`, `PanelAvisos.tsx`, `Cheatsheet*`, etc.

## 4. Archivos permitidos

```text
app/src/ui/tokens.ts                                    EDIT extensión (spacing/radii/shadows/typography aditivos sobre colors existentes)
app/src/ui/tokens.test.ts                               EDIT aditivo (asserts para tokens nuevos)
app/src/ui/inspector/Seccion*.tsx                       EDIT aditivo (~11 archivos: migra literales a tokens; 1 commit por archivo)
app/src/ui/MenuContextual{Entidad,Enlace,Arbol}.tsx    EDIT aditivo (3 archivos)
app/src/ui/Dialogo*.tsx                                 EDIT aditivo (~14 archivos)
app/src/ui/Modal*.tsx                                   EDIT aditivo (~4 archivos)
app/src/ui/MenuPrincipal.tsx                            EDIT aditivo
app/src/ui/PantallaInicio.tsx                           EDIT aditivo
app/src/ui/ArbolOpd.tsx                                 EDIT aditivo
app/src/ui/BibliotecaCosa.tsx                           EDIT aditivo
app/src/ui/arbol/NodoOpd.tsx                            EDIT aditivo
app/src/ui/panelOpl/Bloques.tsx                         EDIT aditivo
app/src/ui/panelOpl/Toolbar.tsx                         EDIT aditivo (NO confundir con app/src/ui/Toolbar.tsx)
app/src/ui/InspectorEntidad.tsx                         EDIT aditivo
app/src/ui/InspectorEnlace.tsx                          EDIT aditivo (si tiene literales)
app/src/ui/PanelAvisos.tsx                              EDIT aditivo
app/src/ui/CheatsheetAtajos.tsx                         EDIT aditivo
app/src/ui/MenuTipoEnlace.tsx                           EDIT aditivo
eslint.config.js                                        NUEVO (config inicial con rule custom)
app/package.json                                        EDIT aditivo (script lint si no existe; dependencia eslint si no instalada)
app/e2e/02-canvas-y-render.spec.ts                      EDIT aditivo (1-2 smokes visual snapshot)
app/e2e/01-carga-y-workspace.spec.ts                    EDIT aditivo (1 smoke visual snapshot dialogos)
opm-extracted/src/styles/                               LECTURA (si existe; referencia spacing/radii)
docs/HANDOFF.md                                         LECTURA
docs/auditorias/2026-05-07-refactor-radical-steipete.md LECTURA
docs/JOYAS.md                                           LECTURA
assets/svg/**                                           LECTURA
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones de no-colisión

- **No tocar `app/src/ui/Toolbar.tsx`** (territorio L1; 1098 LOC en proceso de refactor a orquestador).
- **No tocar `app/src/ui/toolbar/*.tsx`** post-L1 (los 5 nuevos archivos importan tokens desde el inicio; L1 los crea limpios).
- **No tocar `app/src/ui/App.tsx`** (territorio L1 lazy splits).
- **No tocar `app/src/ui/BarraHerramientasElemento.tsx`** (L4 lo crea ya con tokens).
- **No tocar `app/src/ui/PanelMetodologia.tsx`** (L3 lo crea ya con tokens).
- **No tocar `app/src/modelo/checkers.ts`** (L3).
- **No tocar paleta canvas en composers** (`app/src/render/jointjs/composers/*.ts` mantiene literales `#70E483`/`#3BC3FF`/`#586D8C` por contrato JOYAS).
- **No tocar literales en archivos de tests** (`*.test.ts`, `app/e2e/**`) salvo `tokens.test.ts`.
- **No tocar `customShapes.ts`, `in-vivo-test.mjs`** (sueltos del operador).
- **No introducir dependencias nuevas** salvo ESLint y plugins necesarios para la rule custom (validar con operador antes; `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin` son estándar).

## 6. Slice mínimo shippeable

### 6.1 Extensión `tokens.ts`

```typescript
// app/src/ui/tokens.ts (extensión sobre ronda 12.1 + 13.0 T1.2)
// [JOYAS §1-3] paleta + dimensiones + tipografía canónicas (invariante canvas);
// tokens UI separados para chrome.

export const colors = {
  // ronda 12.1 + 13.0 T1.2 (existentes)
  acentoUi: "#3DA8FF",
  acentoSecundario: "#1a3763",
  chromeNeutral: "#586D8C",
  acentoUiSuave: "#eaf8ff",
  chromeNeutralSuave: "#e8eef5",
  canvas: { objeto: "#70E483", proceso: "#3BC3FF", enlace: "#586D8C", fill: "#fdffff", texto: "#000002" },
  // ronda 13 L2 (nuevos derivados de patterns observables)
  fondoChrome: "#ffffff",
  fondoCard: "#f8f9fb",
  bordeSuave: "#e1e6ed",
  textoPrimario: "#1f2937",
  textoSecundario: "#586D8C",
  textoTerciario: "#9ca3af",
  exitoVerde: "#16a34a",
  alertaAmbar: "#f59e0b",
  errorRojo: "#dc2626",
  resaltadoTemporal: "#FFFC7F",  // halo HU-33.010
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 4,
  md: 6,
  lg: 8,
  pill: 9999,
} as const;

export const shadows = {
  card: "0 1px 3px rgba(15, 23, 42, 0.08)",
  dialogo: "0 12px 30px rgba(15, 23, 42, 0.16)",  // [JOYAS §2] repetido en ~8 diálogos
  popover: "0 6px 16px rgba(15, 23, 42, 0.12)",
  flotante: "0 18px 42px rgba(16, 24, 40, 0.24)",
} as const;

export const typography = {
  familyChrome: "Arial, sans-serif",  // [JOYAS §3]
  familyCanvas: "Arial",  // [JOYAS §3] invariante para SVG text labels
  sizeXs: 11,
  sizeSm: 12,
  sizeMd: 13,  // chrome default
  sizeLg: 14,  // diálogos default
  sizeXl: 16,
  weightNormal: 400,
  weightMedium: 500,
  weightBold: 600,
} as const;

export const tokens = { colors, spacing, radii, shadows, typography };
```

### 6.2 Migración archivo por archivo (commits atómicos)

Para cada archivo en §4 lista de migrables:

1. Identificar literales con `grep -nE "#[0-9A-Fa-f]{3,8}|fontSize|padding|borderRadius|boxShadow" <archivo>`.
2. Reemplazar por referencias a `tokens.colors.X` / `tokens.spacing.X` / etc.
3. Verificar visualmente con `bun run dev` (operador o smoke).
4. Commit individual: `refactor(<archivo>): migra literales a tokens (T2.2 steipete)`.

**Cero refactor de lógica**. Solo sustitución de literales por referencias.

### 6.3 ESLint rule custom

```javascript
// eslint.config.js (Flat config — verificar versión ESLint del repo)
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["app/src/ui/**/*.{ts,tsx}"],
    ignores: ["app/src/ui/tokens.ts", "app/src/ui/tokens.test.ts"],
    languageOptions: { parser: tsParser },
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^#[0-9A-Fa-f]{3,8}$/]",
          message: "No usar color literales en app/src/ui/**. Usa tokens desde app/src/ui/tokens.ts. Auditoría steipete §T2.2.",
        },
      ],
    },
  },
];
```

Agregar script en `app/package.json`:

```json
"scripts": {
  "lint": "eslint app/src/ui/"
}
```

Verificar con operador antes de instalar nuevas dependencias `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`.

### 6.4 Visual snapshot Playwright (smoke regresión)

Smoke para `.toolbar`, `.inspector`, `.dialogo` antes/después usando `expect(page).toHaveScreenshot()` o `page.screenshot()` + diff manual. Incluir en `app/e2e/02-canvas-y-render.spec.ts` y `01-carga-y-workspace.spec.ts`.

## 7. Tests obligatorios

**Unit tests (~5-10 nuevos)**: `tokens.test.ts` extendido con asserts para spacing/radii/shadows/typography.

**Smoke browser** (`app/e2e/0X-*.spec.ts`), 2-3 nuevos:

- Visual snapshot toolbar (verificar que migración no rompe rendering).
- Visual snapshot inspector con ≥1 entidad seleccionada.
- Visual snapshot dialogo (cargar modelo o guardar como).

**Lint**: `bun run lint` debe pasar con cero violaciones `no-restricted-syntax` en `app/src/ui/**` excepto `tokens.ts`/`tokens.test.ts`.

## 8. Verificación

```bash
cd app
bun run check          # 675 → ~680 (con tokens.test extendido)
bun run browser:smoke  # 86 → ~89 (con +3 snapshots L2)
bun run build          # main chunk sin crecimiento (cambios son referencias, no bytes nuevos)
bun run lint           # cero violaciones color literales en app/src/ui/** (excepto tokens.ts)
```

## 9. Decisiones bloqueadas (no reabrir)

- **Alcance solo chrome UI**: paleta canvas semántica (`#70E483`/`#3BC3FF`/`#586D8C` en composers) NO se migra. Contrato JOYAS invariante.
- **NO introducir dark mode** ni variables CSS root: ronda 13 introduce solo `tokens.ts` TS exportado; dark mode requiere refactor adicional con event gatillante.
- **NO ESLint rule más amplia** (ej. forbidden imports, naming conventions): solo `no-restricted-syntax` para color literales.
- **NO migrar tests** ni `app/e2e/**` ni `*.test.ts` (literales en tests son OK por contrato de explicit-fixture).
- **NO migrar Toolbar.tsx** (territorio L1; los 5 nuevos archivos `toolbar/*.tsx` ya nacen con tokens).
- **Tokens secundarios derivados de patterns observables**, no inventados: spacing 4/8/12/16/24/32, radii 4/6/8, shadow dialogo `0 12px 30px rgba(15,23,42,0.16)` (literal repetido 8 veces verificado).

## 10. Decisiones que tomas vos (documentar en commit)

- **Hex exactos de tokens nuevos** (`fondoChrome`, `bordeSuave`, etc.): el slice §6.1 propone valores derivados de patterns; ajustar si visualmente queda mal en `bun run dev`. Documentar tabla final.
- **Convención de naming**: `tokens.colors.acentoUi` vs `tokens.acentoUi` (acceso flat). El slice usa anidado; mantener consistencia con ronda 12.1.
- **Si emerge un literal con semántica especial** que no encaja en ningún token (ej. color condicional de un widget único), agregar token específico nombrado por uso (`colors.bordeReadOnly: "#d1d5db"`) en lugar de forzar reuso.
- **Orden de migración de archivos**: el orden sugerido es Inspector secciones → MenuContextual* → Dialogo* → Modal* → otros. Ajustar si surgen dependencias.
- **ESLint Flat config vs legacy `.eslintrc.cjs`**: verificar versión ESLint instalada o instalable. Documentar elección.
- **Si visual snapshot falla por anti-aliasing**: usar `threshold: 0.05` en config Playwright o snapshots solo en CI.

## 11. Forma del entregable

Al cierre de L2, declarar:

- Hash final del último commit en main.
- LOC delta global (`git diff --stat HEAD~30 HEAD` aprox 30+ commits atómicos).
- Output de `bun run check`, `bun run browser:smoke`, `bun run build`, `bun run lint` (último tail).
- Lista de commits en orden + archivo migrado por uno.
- Decisiones declaradas (§10).
- Tabla final de tokens con valores exactos.
- Conteo: literales `#xxxxxx` en `app/src/ui/**` antes (~108) y después (=0 excepto tokens.ts).
- Confirmación archivos no tocados (de §5).

Commits sugeridos (orden):

1. `feat(tokens): tokens central completo con spacing/radii/shadows/typography (T2.2 steipete)`
2. `chore(lint): instala eslint + plugins; rule no-restricted-syntax color literales (T2.2 steipete)`
3-N. `refactor(<archivo>): migra literales a tokens` (uno por archivo en §4 lista)
N+1. `test(tokens): asserts para tokens secundarios (spacing/radii/shadows/typography)`
N+2. `test(e2e): visual snapshot toolbar/inspector/dialogo (T2.2 regresión)`

Cada commit debe dejar la rama verde. Co-author si aplica.

Si dudás de un caso límite: detente y reporta al operador antes de actuar.
