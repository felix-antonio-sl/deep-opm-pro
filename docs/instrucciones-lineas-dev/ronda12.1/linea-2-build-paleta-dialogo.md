# Línea 2 — Build + bundle + paleta tokens mínima + Dialogo refactor

## 1. Misión

Reducir el chunk principal del build de **211.49 kB → ≤ 200 kB** (objetivo conservador; ideal ≤ 195 kB) e introducir el **módulo `app/src/ui/tokens.ts` mínimo** para separar el acento UI del color semántico de proceso del canvas. Cubrir además **HU-30.037 cobertura Esc** con smokes para los diálogos legados que faltaban evidencia.

Triángulo de cambios:

- **Bundle**: lazy splits de `DialogoTraerConectados` y `DialogoPlantillas` (hoy montados en `Toolbar.tsx` líneas 14, 19, 684-685, NO en `App.tsx` como asumió el brief V1). Convertir imports a `lazy(...)` + envolver montaje en `<Suspense fallback={null}>` directamente en Toolbar.tsx. Ahorro estimado 8-12 kB.
- **Paleta tokens mínima**: nuevo módulo `app/src/ui/tokens.ts` con **solo paleta UI** (`colorAcentoUi = "#3DA8FF"`, `colorAcentoSecundario = "#1a3763"`, `colorChromeNeutral = "#586D8C"`) + alias informativos a paleta canvas (`colorObjetoSemantica = "#70E483"`, etc., **solo para referencia, no para uso UI**). Migración mínima: aplicar **solo en `Dialogo.tsx`** donde hoy hay literal `#3BC3FF`. **No migrar Toolbar.tsx** (eso es ronda 13 dedicada).
- **Dialogo refactor**: agregar prop opcional `size?: "sm" | "md" | "lg" | "xl"` (default `"md"` mantiene comportamiento actual `min(460px, calc(100vw - 32px))`). Aplicar `size="lg"` en `DialogoCargarModelo.tsx` y `DialogoPlantillas.tsx` que hoy hacen overrides ad-hoc.
- **HU-30.037 cobertura Esc**: `Dialogo.tsx` ya captura Esc (líneas 33-35 verificadas); falta solo evidencia en smokes para `DialogoVersiones`, `DialogoArchivados`, `DialogoBuscarGlobal`. Tres smokes nuevos.

Slice mínimo entregable: feature **base UI + bundle** sin invadir Toolbar ni Inspector. Reuso obligatorio de `assets/svg/` ya cableados (no agregar SVGs en L2).

**Fuera de slice**:

- **No migrar Toolbar.tsx a tokens** (~9 literales `#3BC3FF`/`#586D8C`). Ronda 13 dedicada.
- **No migrar Inspector secciones a tokens**.
- **No migrar `MenuContextual*` a tokens**.
- **No introducir `tokens.spacing`, `tokens.radii`, `tokens.shadows`, `tokens.typography`**: ronda 12.1 introduce solo `tokens.colors`. El resto en ronda 13.
- **No agregar regla ESLint** prohibiendo color literales: ronda 13.
- **No tocar dark mode**: ronda 13+.
- **No modificar comportamiento de `Dialogo.tsx`** salvo agregar prop `size?` opcional (default mantiene comportamiento actual).

## 2. Deudas que cierra

| HU/Objetivo | Estado actual | Aporte L2 |
|---|---|---|
| **Bundle ≤ 200 kB** | 211.49 kB chunk principal | **Corrección post-V1**: los diálogos viven en `Toolbar.tsx` líneas 14, 19 (imports) y 684-685 (montaje), NO en `App.tsx`. Editar `Toolbar.tsx` SOLO en esos 3 puntos: (a) cambiar `import { DialogoTraerConectados } from "./DialogoTraerConectados"` a `const DialogoTraerConectados = lazy(() => import("./DialogoTraerConectados").then((m) => ({ default: m.DialogoTraerConectados })))` (idem DialogoPlantillas); (b) agregar `lazy, Suspense` al import de `preact/compat` si no están; (c) envolver montaje `<DialogoTraerConectados ... />` y `<DialogoPlantillas ... />` en `<Suspense fallback={null}>...</Suspense>`. **NO tocar otros hunks de Toolbar.tsx** — coordinación con L3 (que agrega `title=` aditivos en otros botones distintos) garantiza hunks disjuntos. Ahorro estimado 8-12 kB. Si tras el split el chunk sigue ≥ 200 kB, reportar y proponer próxima medida. |
| **`app/src/ui/tokens.ts` mínimo** | inexistente | Crear módulo nuevo con `export const colors = { acentoUi: "#3DA8FF", acentoSecundario: "#1a3763", chromeNeutral: "#586D8C", canvas: { objeto: "#70E483", proceso: "#3BC3FF", enlace: "#586D8C", fill: "#fdffff", texto: "#000002" } } as const;` + comentario header con rationale (separar acento UI del color de proceso del canvas) y citas `[JOYAS §1]`. Aplicar **solo en `Dialogo.tsx`** sustituyendo literales `#3BC3FF` / `#586D8C` por `colors.acentoUi` / `colors.chromeNeutral` según corresponda semánticamente. |
| **`Dialogo.tsx` size prop** | width fija `min(460px, calc(100vw - 32px))` | Agregar prop opcional `size?: "sm" \| "md" \| "lg" \| "xl"` (default `"md"`). Tabla: `sm = min(360px, calc(100vw - 32px))`, `md = min(460px, calc(100vw - 32px))` (compatibilidad), `lg = min(720px, calc(100vw - 32px))`, `xl = min(960px, calc(100vw - 32px))`. **Comportamiento default invariante**. Aplicar `size="lg"` en `DialogoCargarModelo.tsx` (hoy override `width: "min(820px, calc(100vw - 32px))"` aprox.) y `DialogoPlantillas.tsx` línea 111 override actual. **Verificar visualmente** con `bun run dev` que ambos diálogos siguen renderizando correctamente. |
| HU-30.037 — Cancelar modal Esc | parcial → cubierto | `Dialogo.tsx` ya captura Esc (verificado líneas 33-35). **No modificar Dialogo.tsx para Esc**. Agregar 3 smokes nuevos en `app/e2e/opm-smoke.spec.ts`: Esc cancela `DialogoVersiones` sin commit, Esc cancela `DialogoArchivados` sin commit, Esc cancela `DialogoBuscarGlobal` sin commit. Verificar que el estado del modelo no cambia tras Esc. Si algún diálogo tiene captura Esc propia que no llama `onCancelar`, **reportar bug** (probablemente fuera de scope ronda 12.1). |

**Total esperado**: bundle ≤ 200 kB + módulo tokens.ts mínimo + Dialogo size prop + HU-30.037 cubierta con evidencia smoke.

## 3. Anclaje a evidencia

**Nivel 1 — SSOT (citas obligatorias)**:

- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md`:
  - §6 etapas SD: persistencia. **Cita HU-30.037**: `[Met §6]`.
- `docs/historias-usuario-v2/00-METODOLOGIA.md §6`: jerarquía SSOT.

**Nivel 2 — `app/src/modelo/tipos.ts`**: ronda 12.1 NO modifica tipos kernel.

**Nivel 3 — respaldo técnico (citas obligatorias por contrato visual)**:

- **`docs/JOYAS.md §1`**: paleta canónica canvas. **Cita obligatoria header `tokens.ts`**: `[JOYAS §1]`.
- **`docs/JOYAS.md §2`**: dimensiones canónicas (referencia para size prop).
- **opm-extracted/ verificado**:
  - `opm-extracted/src/styles/` para variables CSS canónicas (verificar con `ls`). **No copiar 1:1**, solo referencia.

**Estado actual del código (post-ronda-12, verificado)**:

- `app/src/ui/Dialogo.tsx` (155 LOC): captura Esc líneas 33-35; width fija `min(460px, calc(100vw - 32px))` línea 126; literal `#3BC3FF` línea 131 (acento UI mal-asignado).
- `app/src/ui/App.tsx`: lazy imports líneas 17-26 con patrón consolidado. **Falta `DialogoTraerConectados` y `DialogoPlantillas`** que entran como import directo (verificar grep).
- `app/src/ui/DialogoCargarModelo.tsx`: probable override de width ad-hoc.
- `app/src/ui/DialogoPlantillas.tsx`: línea 111 override `width` (verificado en auditoría).
- `app/src/ui/tokens.ts`: **NO EXISTE** (verificado con `ls` retornando error 2). Crear desde cero.
- `app/src/ui/Toolbar.tsx`: 9 literales `#3BC3FF`/`#586D8C` líneas 774/823/836/867/930/967/1019/1024/1026. **NO TOCAR EN L2**, ronda 13.

## 4. Archivos permitidos

```text
app/src/ui/tokens.ts                               NUEVO (módulo paleta UI mínima + alias canvas para referencia)
app/src/ui/Dialogo.tsx                             EDIT aditivo (size prop opcional + token acento UI; default invariante)
app/src/ui/App.tsx                                 LECTURA (NO se toca; corrección post-V1: lazy imports van en Toolbar.tsx)
app/src/ui/Toolbar.tsx                             EDIT aditivo restringido (SOLO líneas 14, 19 imports → lazy; líneas 684-685 montaje → <Suspense>; NO otros hunks; coordinación L3)
app/src/ui/DialogoTraerConectados.tsx              LECTURA (verificar export `DialogoTraerConectados` para lazy en Toolbar.tsx; NO modificar)
app/src/ui/DialogoPlantillas.tsx                   EDIT aditivo (aplicar size="lg" + remover override ad-hoc width; verificar visual)
app/src/ui/DialogoCargarModelo.tsx                 EDIT aditivo (aplicar size="lg" + remover override ad-hoc width; verificar visual)
app/src/ui/DialogoVersiones.tsx                    LECTURA (smoke valida Esc; NO editar)
app/src/ui/DialogoArchivados.tsx                   LECTURA (smoke valida Esc; NO editar)
app/src/ui/DialogoBuscarGlobal.tsx                 LECTURA (smoke valida Esc; NO editar)
app/e2e/opm-smoke.spec.ts                          EDIT aditivo (~3 smokes Esc cobertura HU-30.037 al final del archivo)
opm-extracted/**                                   LECTURA
docs/HANDOFF.md                                    LECTURA
docs/historias-usuario-v2/**                       LECTURA
docs/JOYAS.md                                      LECTURA
assets/svg/**                                      LECTURA
```

Cualquier otro archivo es **fuera de scope**.

### Nota arquitectónica

- **`tokens.ts` mínimo, no central**: el alcance es **solo paleta UI nueva + aliases informativos a paleta canvas**. NO incluir `spacing`, `radii`, `shadows`, `typography` (ronda 13). NO incluir export con regla "todos deben usar". Solo expone constantes; el uso es opcional.
- **Migración a tokens solo en `Dialogo.tsx`**: se sustituyen literales `#3BC3FF` (líneas con acento UI) por `colors.acentoUi`. Otros literales (canvas semántico) quedan intactos. **Toolbar.tsx queda fuera** (ronda 13).
- **Lazy splits no rompen tests**: el patrón consolidado en `App.tsx` líneas 17-26 envuelve los componentes en `<Suspense>` — replicar el mismo patrón directamente en `Toolbar.tsx`. Verificar que el smoke de DialogoTraerConectados y DialogoPlantillas (si existen, ronda 12 los cubrió) sigue pasando.
- **Toolbar.tsx editado en hunks restringidos**: corrección post-V1. El brief original asumió que App.tsx montaba ambos diálogos; auditoría L2 reveló que viven en Toolbar.tsx (líneas 14, 19, 684-685). Autorización CONCEDIDA con scope mínimo (~10-15 LOC en 3 puntos disjuntos a los hunks de L3). Cualquier edición fuera de esos 3 puntos es out-of-scope.
- **Verificación visual obligatoria**: tras aplicar `size="lg"`, abrir `bun run dev` y validar que `DialogoCargarModelo` y `DialogoPlantillas` se renderizan con dimensiones esperadas (no comprimidos). Documentar en commit.

## 5. Restricciones de no-colisión

- **`app/src/ui/Toolbar.tsx` con scope restringido (corrección post-V1)**: editar SOLO 3 puntos (imports líneas 14/19 → `lazy(...)`; montaje líneas 684-685 → `<Suspense>`). NO migrar a tokens (ronda 13). NO refactor. NO tocar tooltips (territorio L3 en otros botones; hunks disjuntos garantizados). Cualquier edición fuera de esos 3 puntos es bloqueante.
- **No tocar `app/src/ui/inspector/*`** (territorio L3 íconos).
- **No tocar `app/src/ui/MenuContextual*.tsx`** (L1 toca enlace HU-11.012; L3 toca entidad/arbol íconos).
- **No tocar `app/src/ui/ArbolOpd.tsx`, `BibliotecaCosa.tsx`** (territorio L3 list-logical).
- **No tocar `acciones-canvas.ts`, `acciones-ui.ts`, `acciones-entidad.ts`, `store/tipos.ts`** (territorio L1 si aplica).
- **No tocar serializadores ni JSON canónico**.
- **No tocar `progress-dashboard.mjs`** (consolidación operador).
- **No modificar `Dialogo.tsx` salvo aditivo `size?` prop + token acento**: comportamiento default invariante.
- **No modificar `DialogoTraerConectados.tsx`**: solo lectura para verificar export. L3 agrega conteo en este archivo (sin conflicto con L2 porque L2 NO lo edita).

## 6. Comportamiento esperado

- **`app/src/ui/tokens.ts`**:
  ```typescript
  // [JOYAS §1] paleta canvas invariante; tokens UI separados para evitar colisión
  // semántica con color de proceso (#3BC3FF) en chrome.
  export const colors = {
    acentoUi: "#3DA8FF",
    acentoSecundario: "#1a3763",
    chromeNeutral: "#586D8C",
    canvas: {
      objeto: "#70E483",
      proceso: "#3BC3FF",
      enlace: "#586D8C",
      fill: "#fdffff",
      texto: "#000002",
    },
  } as const;
  ```
- **`Dialogo.tsx` size prop**:
  ```typescript
  type DialogoSize = "sm" | "md" | "lg" | "xl";
  interface DialogoProps {
    // ... props existentes
    size?: DialogoSize; // default "md" mantiene comportamiento actual
  }
  // ... mapeo de size a width
  const widthBySize: Record<DialogoSize, string> = {
    sm: "min(360px, calc(100vw - 32px))",
    md: "min(460px, calc(100vw - 32px))", // default actual
    lg: "min(720px, calc(100vw - 32px))",
    xl: "min(960px, calc(100vw - 32px))",
  };
  ```
- **`DialogoCargarModelo.tsx`**: `<Dialogo size="lg" ...>`. Remover override ad-hoc width si existe.
- **`DialogoPlantillas.tsx`**: `<Dialogo size="lg" ...>`. Remover override ad-hoc línea 111.
- **`Toolbar.tsx` lazy edits restringidos** (corrección post-V1; los diálogos NO viven en App.tsx sino en Toolbar.tsx):
  - Líneas 14, 19 (imports estáticos): cambiar `import { DialogoTraerConectados } from "./DialogoTraerConectados"` (idem `DialogoPlantillas`) a:
  ```typescript
  const DialogoTraerConectados = lazy(() => import("./DialogoTraerConectados").then((m) => ({ default: m.DialogoTraerConectados })));
  const DialogoPlantillas = lazy(() => import("./DialogoPlantillas").then((m) => ({ default: m.DialogoPlantillas })));
  ```
  - Agregar `lazy, Suspense` al import de `preact/compat` en Toolbar.tsx si no están presentes.
  - Líneas 684-685 (montaje JSX): envolver `<DialogoTraerConectados ... />` y `<DialogoPlantillas ... />` en `<Suspense fallback={null}>...</Suspense>`.
  - **NO tocar otros hunks de Toolbar.tsx** — coordinación con L3 garantiza que sus `title=` aditivos van en botones distintos.
  - Patrón referencia: `App.tsx` líneas 17-26 (AsistenteNuevoModelo, CheatsheetAtajos, DialogoArchivados, etc.) — mismo idioma, replicado en Toolbar.tsx.
- **HU-30.037**: smokes ejecutan flujo Versiones/Archivados/BuscarGlobal: abrir diálogo → modificar input → presionar Esc → verificar que el modelo no cambió (estado pre-modal restaurado).

## 7. Pruebas requeridas

**Unit tests (~0-1 nuevos)**: ronda corta, los lazy + size prop son verificados por smokes y build.

- (opcional) `tokens.test.ts` mínimo: verificar que `colors.canvas.proceso === "#3BC3FF"` (contrato JOYAS).

**Smoke browser (`app/e2e/opm-smoke.spec.ts`), ~3 nuevos**:

- "HU-30.037: Esc cancela DialogoVersiones sin persistir cambios".
- "HU-30.037: Esc cancela DialogoArchivados sin persistir cambios".
- "HU-30.037: Esc cancela DialogoBuscarGlobal sin persistir cambios".

**Build**: `bun run build` verifica que el chunk principal cae a ≤ 200 kB. Output documentado en commit.

**Detector**: L2 declara las reglas siguientes para consolidación operador (~1 regla):

- HU-30.037: regla agrupada con paths `Dialogo.tsx` (captura Esc línea 33+) + smokes en `opm-smoke.spec.ts` cubriendo los 3 diálogos legados.

## 8. Métricas esperadas

- **Tests aditivos**: ~0-1 unit + 3 smokes nuevos.
- **HU cerradas L2 directas**: 1 (HU-30.037).
- **Reglas detector que esta línea aporta**: ~1 regla.
- **Build**: chunk principal 211.49 kB → **≤ 200 kB** (objetivo conservador). Ideal ≤ 195 kB. `feature-dialogos-pesados-*.js` o nuevo lazy chunk gana ~8-12 kB.
- **Smoke browser**: 81 → ~84.

## 9. Loop verde y commits

```bash
cd app
bun run check          # 659 → ~660 unit (sin tests significativos nuevos)
bun run browser:smoke  # 81 → ~84
bun run build          # main chunk objetivo ≤ 200 kB / ≤ 53 kB gzip
```

Commits sugeridos (orden):

1. `feat(ui): tokens.ts mínimo separa acento UI de paleta canvas (#3DA8FF vs #3BC3FF)`
2. `refactor(ui): Dialogo prop size? aplicada en DialogoCargarModelo y DialogoPlantillas`
3. `chore(build): lazy DialogoTraerConectados + DialogoPlantillas in-place en Toolbar.tsx (chunk -8 kB)`
4. `test(e2e): Esc cancela diálogos legados sin persistir (HU-30.037)`

Cada commit debe dejar la rama verde. Co-author si aplica.

## 10. Decisiones que tomas vos (documentar en commit)

- **Tabla exacta de widths por size**: el listado §6 es propuesta; ajustar `lg`/`xl` si visualmente queda mal en `bun run dev`. Documentar valores finales.
- **Si lazy splits no logran ≤ 200 kB**: reportar y proponer adicional (ej. lazy `MapaSistema` adicional, code-split de algún módulo). NO ejecutar la propuesta sin validación operador.
- **Si DialogoTraerConectados o DialogoPlantillas tienen estado global compartido que rompe lazy**: reportar y mantener import directo. NO forzar lazy si rompe smokes.
- **Edición restringida en Toolbar.tsx (corrección post-V1)**: el operador autorizó editar Toolbar.tsx SOLO en 3 puntos (imports líneas 14/19 + montaje 684-685) por descubrimiento de que los diálogos no viven en App.tsx. Documentar en commit message la tensión: "Edited Toolbar.tsx with restricted scope: only lazy imports + Suspense wrapper for the two dialogs (lines 14, 19, 684-685). L3 territory (title= in other buttons) untouched. Hunks disjoint."
- **Migración tokens en Dialogo.tsx alcance exacto**: si hay literales que NO son acento UI (ej. fondo, borde estructural), dejarlos intactos. Migrar solo el acento.
- **Si algún DialogoVersiones/Archivados/BuscarGlobal tiene captura Esc propia que sobrescribe `Dialogo.tsx`**: reportar bug fuera de scope (NO arreglar en L2).

## 11. Forma del entregable

Al cierre de L2, declarar:

- Hash final del último commit en main.
- LOC nuevos por archivo (`wc -l app/src/ui/tokens.ts app/src/ui/Dialogo.tsx`).
- Output de `bun run check`, `bun run browser:smoke`, `bun run build` (último tail con tabla de chunks).
- Lista de tests aditivos creados + conteo.
- Lista de smokes aditivos + conteo.
- Decisiones declaradas (§10).
- HU cerradas con id (de §2).
- Reglas detector declaradas para consolidación operador (§7 final).
- **Citas SSOT agregadas en headers** (`[JOYAS §1]`, `[Met §6]`) — RF-2 remediation.
- Bloqueos o desviaciones explícitas con rationale.
- Confirmación de archivos no tocados (de §5 lista).
- **Diff numérico chunk principal** (antes vs después de lazy splits).

Si dudás de un caso límite: detente y reporta al operador antes de actuar. Mejor pausar que invadir scope.

Co-author footer en commits si corresponde.
