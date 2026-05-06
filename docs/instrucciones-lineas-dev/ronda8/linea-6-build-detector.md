# Linea 6 — Code splitting Vite + recalibracion del detector

## 1. Mision

Aterrizar **primero** en la ronda como linea de bajo blast que pone los cimientos para las demas. Dos objetivos disjuntos pero coordinados, con cierre en dos fases:

1. **Code splitting de Vite**: configurar `vite.config.ts` con `build.rollupOptions.output.manualChunks` para sacar JointJS del chunk principal y crear chunks lazy para paneles/modales pesados (`MapaSistema`, `AsistenteNuevoModelo`, `DialogoBuscarGlobal`, `DialogoVersiones`, `DialogoArchivados`, `ModalUrlsObjeto`, `ModalDuracionEstado`, `CheatsheetAtajos`). Cierre del HANDOFF "deuda de build: bundle 1045 KB / 295 KB gzip; Vite advierte por chunk grande".
2. **Recalibrar `progress-dashboard.mjs` detector**: L6a agrega reglas declarativas/tolerantes y recalibra paths post-ronda 7 sin perder ninguna regla actual. L6b/consolidacion regenera `--sync-real` despues de L1-L5 y ahi debe subir de 45/49 a >= 50/55 reglas matcheadas. Cierre del HANDOFF "Recalibrar el detector `progress-dashboard.mjs` (deuda inmediata para ronda 8)".

Esta linea aterriza **ANTES** que las demas como L6a (orden L6a → L3 → L2 → L4 → L5 → L1 → L6b/consolidacion) porque:
- El code splitting de Vite es independiente del refactor de codigo. Funciona con la estructura actual y se mantiene cuando los archivos se parten.
- La recalibracion del detector debe agregar reglas para los archivos NUEVOS que las demas lineas crearan, ANTES de que esos archivos existan. Las reglas nuevas estaran en `pendiente` (ok=false) hasta que las lineas correspondientes mergeen y agreguen el codigo. Eso es el comportamiento correcto del detector — la regla ya esta esperando. No presentar ese estado intermedio como cobertura final.

**Slice minimo entregable**:

### A. Code splitting de Vite (`vite.config.ts` + `App.tsx` + `main.tsx`)
- `vite.config.ts` con `manualChunks` que separe:
  - `jointjs` → chunk separado (libreria pesada, importada side-effect en `main.tsx`).
  - `vendor` → preact, zustand, joint deps menores (si aplica).
  - `mapa` → todo el dominio mapa: `MapaSistema.tsx`, `MapaFiltros.tsx`, `MapaPanelEstadisticas.tsx`, `mapaSistema.ts`, `mapaExport.ts`.
  - `asistente` → `AsistenteNuevoModelo.tsx` + asociados.
  - `dialogos-pesados` → `DialogoBuscarGlobal.tsx`, `DialogoVersiones.tsx`, `DialogoArchivados.tsx`, `DialogoCargarModelo.tsx`, `DialogoGuardarComo.tsx`.
  - `modales` → `ModalUrlsObjeto.tsx`, `ModalDuracionEstado.tsx`, `CheatsheetAtajos.tsx`.
- `App.tsx` aditivo para `lazy()` los componentes pesados (con fallback `null` o `<Spinner />` minimal). Preact 10 soporta `lazy()` y `<Suspense />` desde 10.18+.
- Los componentes lazy deben montarse condicionalmente por flags reales del store. Si se renderizan siempre dentro de `<Suspense>`, el chunk se carga en boot y el split no sirve.
- `main.tsx` aditivo si es necesario para preload critico.

### B. Recalibracion del detector (`progress-dashboard.mjs`)
- Recalibrar las 49 reglas existentes para que:
  - 45 que actualmente matchean sigan matcheando (preservar paths exactos).
  - 4 que dejaron de matchear (HU de EPICA-13, EPICA-17, EPICA-90, EPICA-30 segun HANDOFF) se actualicen apuntando a los archivos correctos donde vive el codigo nuevo de ronda 7 (`modelo/objetoMetadata.ts`, `modelo/estadosDesignaciones.ts`, `modelo/objetoDuracion.ts`, `ui/atajosTeclado.ts`, etc.).
- Agregar **al menos 3 reglas nuevas** (para llegar a 52 o mas) cubriendo:
  - Cubrimiento de alias/unidad/descripcion/URLs (HU-17.002-012/.018-023): regla que apunta a `modelo/objetoMetadata.ts`, `ui/inspector/SeccionAlias.tsx`, `ui/inspector/SeccionUrls.tsx` con strings clave.
  - Designaciones de estado (HU-13.010-013, HU-17.033): regla que apunta a `modelo/estadosDesignaciones.ts` con strings `designarInicial`, `designarDefault`, `designarCurrent`.
  - Duracion canonica (HU-17.034): regla que apunta a `modelo/objetoDuracion.ts` y `opl/generadores/duracionMetadata.ts`.
  - Atajos centralizados (HU-90.* completos): regla que apunta a `ui/atajosTeclado.ts` con strings `escucharGlobal`, `registrarAtajo`, `data-atajos-contexto`.
  - Multi-seleccion + batch (HU-SHARED-008, HU-11.007/.008/.023): regla que apunta a `canvas/seleccionMultiple.ts`, `canvas/operacionesBatch.ts`, `store/seleccion.ts` (futuro).
- Las nuevas reglas deben estar OK (matchear) en main post-ronda 8. Pre-ronda 8 (durante el merge) algunas estaran en `pendiente` esperando a que la linea correspondiente aporte el archivo nuevo. Eso es correcto — el detector se sincroniza al final.
- Regenerar `docs/roadmap/hu-progress-evidence.json` y `hu-progress.{json,md,html}` post-merge final con `--sync-real`. En L6a se permite una corrida baseline si se necesita diagnostico, pero la regeneracion que fija metricas de ronda va en consolidacion.

### C. Smokes adicionales (optional)
Si el code splitting cambia el orden de carga de chunks, validar `bun run browser:smoke` no se rompe por chunk no listo. Probable: NO se rompe porque `lazy()` con `<Suspense />` espera el chunk antes de renderizar.

**Fuera de slice**:
- NO refactorizar `store.ts`, `proyeccion.ts`, `serializacion/json.ts`, `opl/generar.ts`, ni UI grandes (territorio L1-L5).
- NO introducir libreria nueva: solo configurar Vite + agregar `lazy()` Preact.
- NO cambiar el formato de output de Vite (sigue produciendo bundles ESM en `dist/`).
- NO cambiar el comportamiento del detector mas alla de recalibrar/agregar reglas. La logica de `auditRealProgress`, `evaluateRule`, `matchesPattern` no se altera.
- NO tocar HU del backlog ni HANDOFF.

## 2. Deudas que cierra

| Deuda | Path absoluto | Aporte |
|---|---|---|
| Bundle 1045 KB / 295 KB gzip; Vite warning chunk grande | `/home/felix/projects/deep-opm-pro/app/vite.config.ts` (sin `manualChunks`) | Chunk JointJS separado (~500 KB / 200 KB gzip estimado); chunk principal < 600 KB / < 240 KB gzip estimado. |
| HANDOFF "Deuda de build: bundle 1045 KB minificado / 295 KB gzip; Vite advierte por chunk grande" | `/home/felix/projects/deep-opm-pro/docs/HANDOFF.md §Pendientes Inmediatos` | Cierra el item explicito. |
| HANDOFF "Recalibrar el detector `progress-dashboard.mjs`" | `/home/felix/projects/deep-opm-pro/docs/HANDOFF.md §Pendientes Inmediatos` | L6a instala reglas tolerantes; L6b/consolidacion cierra el item con detector >= 50/55 reglas. |
| EPICA-13 cae a 2 cubiertas (de 7); EPICA-17 a 0; EPICA-90 a 0%; EPICA-30 a 34.8% | mismo HANDOFF | Recalibracion captura la evidencia real y refleja cobertura real. |

## 3. Anclaje a evidencia

- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/REFACTOR-NOTES.md:13-25` — `tools/extract.mjs` divide `decompiled/` en 16 chunks (deobfuscated.js + 37084.js + 14 lazy-loaded). OPCloud usa code splitting agresivo en produccion. Justifica empiricamente que un modelador OPM grande puede beneficiarse de chunks lazy. Adaptamos la idea a Vite/Rollup.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/README.md:60-85` — quick stats: 349 archivos, 7.8 MiB, 16 chunks. Confirma que el bundle final servible se logra dividiendo por dominios (lazy routes / lazy modules). Nuestro chunk-splitting sigue el mismo principio.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/INDEX.md:1-15` — 486 clases en 349 archivos. Cada categoria (Modelo nucleo, Visual, Drawn, Links, Consistency, Commands, Dialogs, Settings) se beneficiaria de su propio chunk. En nuestro caso, los dialogos pesados (`MapaSistema`, `AsistenteNuevoModelo`) son los candidatos mas obvios.
  - **Vite docs** (no externos a OPCloud, pero los recursos disponibles localmente lo sustentan): `vite.config.ts` con `build.rollupOptions.output.manualChunks` es API estable de Vite 4+/5+/6+. La sintaxis basica es:
    ```ts
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            jointjs: ["jointjs"],
            // ...
          },
        },
      },
    }
    ```
    Tambien soporta `manualChunks: (id) => "chunk-name"` como funcion. Para nuestro caso, ambos sirven; preferimos forma de funcion para mejor control.
- **Estado actual del codigo**:
  - `app/vite.config.ts` (12 LOC): solo `defineConfig({ plugins: [preact()], resolve: { alias: { ... } } })`. Sin `build.rollupOptions`.
  - `app/package.json`: deps `jointjs`, `preact`, `zustand`. No `react`, no React lazy. Preact 10.25+ soporta `lazy()` y `<Suspense />`.
  - `app/src/main.tsx`: `import "jointjs/dist/joint.css"`, `import "./render/jointjs/jointjs.css"`, monta `<App />`. Side-effect imports de CSS NO se mueven a chunks lazy facilmente — quedan en chunk principal o en chunk vendor.
  - `app/src/render/jointjs/JointCanvas.tsx`: `import { dia, linkTools, shapes } from "jointjs"`. Named imports — Vite/Rollup pueden tree-shake si lo permiten. Pero `joint.dia.Paper.prototype.sortViews = function (...)` (similar al patron OPCloud `init-rappid.service.ts:14`) extiende JointJS globalmente; es side-effect y entra en chunk vendor.
  - `app/src/ui/App.tsx` (199 LOC): monta multiples paneles + modales. Candidatos a `lazy()`: `MapaSistema`, `AsistenteNuevoModelo`, los Modales que abren via flags del store.
  - `docs/historias-usuario-v2/tools/progress-dashboard.mjs` (1664 LOC): detector con `autoAuditRules()` (linea 379) que retorna `[ ...49 reglas ]`. Cada regla es objeto con `ids`, `estado`, `confianza`, `nota`, `requires` (array de `{ path, all?, any?, none? }`). Funcion `evaluateRule(rule, sourceIndex)` valida que cada `requires.path` exista y matchee patterns.
- **Reglas detector estado actual** (resumido):
  - 18 reglas apuntan a `app/src/store.ts`.
  - 16 reglas apuntan a `app/src/opl/generar.ts`.
  - 16 reglas apuntan a `app/src/modelo/operaciones.ts`.
  - 11 reglas apuntan a `app/src/serializacion/json.ts`.
  - 10 reglas apuntan a `app/src/render/jointjs/proyeccion.ts`.
  - 8 a `app/src/ui/InspectorEntidad.tsx`, 7 a `InspectorEnlace.tsx`, 6 a `JointCanvas.tsx`, 6 a `operaciones.test.ts`, 5 a `Toolbar.tsx`, etc.

## 4. Archivos permitidos

```text
app/vite.config.ts                                           EDIT — agregar manualChunks + chunkSizeWarningLimit
app/src/ui/App.tsx                                           EDIT aditivo — lazy() de componentes pesados
app/src/main.tsx                                             EDIT aditivo (si necesario para preload)
app/src/ui/Spinner.tsx                                       NUEVO opcional (fallback minimal de Suspense)
docs/historias-usuario-v2/tools/progress-dashboard.mjs       EDIT aditivo (recalibrar reglas + agregar reglas)
docs/roadmap/hu-progress-evidence.json                       EDIT final (solo regeneracion --sync-real de consolidacion)
docs/roadmap/hu-progress.json                                EDIT final (solo regeneracion --sync-real de consolidacion)
docs/roadmap/hu-progress.md                                  EDIT final (solo regeneracion --sync-real de consolidacion)
docs/roadmap/hu-progress.html                                EDIT final (solo regeneracion --sync-real de consolidacion)
opm-extracted/**                                             LECTURA
docs/HANDOFF.md                                              LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

NO tocar `package.json` (deps no cambian). NO tocar `tsconfig.json`. NO tocar `playwright.config.ts`. NO tocar nada en `src/` salvo `App.tsx` y `main.tsx` y opcional `Spinner.tsx`.

## 5. Restricciones de no-colision

- **No tocar `store.ts`** (territorio L1). El refactor de store no tiene relacion con code splitting; los slices viven en mismo chunk.
- **No tocar `proyeccion.ts`** ni composers (territorio L2). El render JointJS sigue agrupado en chunk principal o vendor.
- **No tocar `serializacion/json.ts`** ni validadores (territorio L3). Serializacion va en chunk principal (lo necesita autosalvado, no debe ser lazy).
- **No tocar `opl/generar.ts`** ni generadores (territorio L4). OPL va en chunk principal (lo necesita PanelOpl visible al boot).
- **No tocar UI grandes** ni sub-componentes (territorio L5). Componentes lazy son los candidatos pesados (Mapa, Asistente, modales) — no son los que L5 parte.
- **No introducir librerias nuevas** ni en `package.json` ni en imports. `lazy` y `Suspense` vienen de `preact/compat` (parte de preact ya instalado).
- **No cambiar el comportamiento del detector** mas alla de recalibrar paths y agregar reglas. La logica `evaluateRule` no se altera.
- **No tocar HU del backlog** (`docs/historias-usuario-v2/`). Solo recalibrar las reglas del detector que apuntan a HU.
- **No tocar `docs/HANDOFF.md`** (intacto durante lineas).

## 6. Slice minimo shippeable

### A. Code splitting de Vite

#### `vite.config.ts` extendido

```ts
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      "@app": new URL("./src", import.meta.url).pathname,
    },
  },
  build: {
    chunkSizeWarningLimit: 700, // KB; por encima emite warning
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          // Vendor / libs
          if (id.includes("node_modules/jointjs")) return "vendor-jointjs";
          if (id.includes("node_modules/preact")) return "vendor-preact";
          if (id.includes("node_modules/zustand")) return "vendor-zustand";
          if (id.includes("node_modules")) return "vendor";

          // Dominios pesados de la app
          if (id.includes("/src/ui/MapaSistema") || id.includes("/src/ui/MapaFiltros") || id.includes("/src/ui/MapaPanelEstadisticas") || id.includes("/src/render/jointjs/mapaSistema") || id.includes("/src/render/jointjs/mapaExport")) return "feature-mapa";
          if (id.includes("/src/ui/AsistenteNuevoModelo")) return "feature-asistente";
          if (id.includes("/src/ui/DialogoBuscarGlobal") || id.includes("/src/ui/DialogoVersiones") || id.includes("/src/ui/DialogoArchivados") || id.includes("/src/ui/DialogoCargarModelo") || id.includes("/src/ui/DialogoGuardarComo")) return "feature-dialogos-pesados";
          if (id.includes("/src/ui/ModalUrlsObjeto") || id.includes("/src/ui/ModalDuracion") || id.includes("/src/ui/CheatsheetAtajos")) return "feature-modales";

          // Default: undefined hace que vaya al chunk principal
          return undefined;
        },
      },
    },
  },
});
```

#### `app/src/ui/App.tsx` lazy imports

Agregar al inicio de `App.tsx`:

```tsx
import { lazy, Suspense } from "preact/compat";

// Lazy chunks
const MapaSistema = lazy(() => import("./MapaSistema").then(m => ({ default: m.MapaSistema })));
const AsistenteNuevoModelo = lazy(() => import("./AsistenteNuevoModelo").then(m => ({ default: m.AsistenteNuevoModelo })));
const ModalUrlsObjeto = lazy(() => import("./ModalUrlsObjeto").then(m => ({ default: m.ModalUrlsObjeto })));
const ModalDuracionEstado = lazy(() => import("./ModalDuracionEstado").then(m => ({ default: m.ModalDuracionEstado })));
const DialogoBuscarGlobal = lazy(() => import("./DialogoBuscarGlobal").then(m => ({ default: m.DialogoBuscarGlobal })));
const DialogoVersiones = lazy(() => import("./DialogoVersiones").then(m => ({ default: m.DialogoVersiones })));
const DialogoArchivados = lazy(() => import("./DialogoArchivados").then(m => ({ default: m.DialogoArchivados })));
const DialogoCargarModelo = lazy(() => import("./DialogoCargarModelo").then(m => ({ default: m.DialogoCargarModelo })));
const DialogoGuardarComo = lazy(() => import("./DialogoGuardarComo").then(m => ({ default: m.DialogoGuardarComo })));
const CheatsheetAtajos = lazy(() => import("./CheatsheetAtajos").then(m => ({ default: m.CheatsheetAtajos })));
```

Envolver los montajes con `<Suspense fallback={null}>` (o `<Spinner />` si decidis crear uno):

```tsx
{vistaMapaActiva && <Suspense fallback={null}><MapaSistema /></Suspense>}
{asistenteAbierto && <Suspense fallback={null}><AsistenteNuevoModelo /></Suspense>}
{modalUrlsAbierto !== null && <Suspense fallback={null}><ModalUrlsObjeto /></Suspense>}
{modalDuracionAbierto !== null && <Suspense fallback={null}><ModalDuracionEstado /></Suspense>}
{dialogoGuardarComoAbierto && <Suspense fallback={null}><DialogoGuardarComo /></Suspense>}
{dialogoCargarModeloAbierto && <Suspense fallback={null}><DialogoCargarModelo /></Suspense>}
{/* ... */}
```

Importante: `ModalUrlsObjeto` y `ModalDuracionEstado` leen su id desde el store en la implementacion actual; no inventar props en L6. En `App.tsx` seleccionar los flags reales (`vistaMapaActiva`, `asistente`, `dialogoGuardarComoAbierto`, `dialogoCargarModeloAbierto`, `dialogoBuscarGlobalAbierto`, `dialogoVersionesAbierto`, `dialogoArchivadosAbierto`, `modalUrlsAbierto`, `modalDuracionAbierto`, `cheatsheetAtajosAbierto`) y montar cada lazy solo cuando corresponde.

Nota: cada componente lazy debe **exportar default** O las funciones `import().then(m => ({ default: m.X }))` lo wrappean (segunda opcion preferida si los componentes existentes solo tienen named exports).

#### `Spinner.tsx` opcional (objetivo < 30 LOC)

```tsx
export function Spinner() {
  return (
    <div data-testid="spinner-lazy" style={{ /* loader minimal */ }}>
      Cargando...
    </div>
  );
}
```

Si decidis fallback `null` (mas rapido visualmente, menos pesado), no es necesario crear este archivo.

### B. Recalibracion del detector

#### Auditoria de reglas existentes

Antes de tocar el archivo, ejecutar:

```bash
cd /home/felix/projects/deep-opm-pro
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
cat docs/roadmap/hu-progress-evidence.json | jq '.autoEntries[] | select(.estado == "pendiente" and .fuente == "auto") | {ids, brechas}'
```

Esto lista las 4 reglas que estan fallando con sus `brechas` exactas. Esta corrida puede escribir reportes; si se hace en L6a, reportar que es baseline intermedio y que la regeneracion final queda pendiente de consolidacion. Para cada una:

1. Identificar el path real donde vive el codigo de la HU (post-ronda 7).
2. Actualizar `requires` en la regla para apuntar al path correcto y matchear los strings clave.

#### Regla nueva: alias y unidad y descripcion y URLs

```js
{
  ids: ["HU-17.002", "HU-17.003", "HU-17.004", "HU-17.005", "HU-17.006", "HU-17.007", "HU-17.008", "HU-17.009", "HU-17.010", "HU-17.011", "HU-17.012", "HU-17.018", "HU-17.019", "HU-17.020", "HU-17.021", "HU-17.023"],
  estado: "cubierto",
  confianza: "alta-auto",
  nota: "Auto: alias / unidad / descripcion / URLs implementados en modelo, render, OPL, inspector y modal.",
  requires: [
    { path: "app/src/modelo/objetoMetadata.ts", all: ["editarAlias", "editarUnidad", "editarDescripcion", "agregarUrl", "eliminarUrl", "parsearNombreCompuesto"] },
    { path: "app/src/modelo/tipos.ts", all: ["alias?:", "unidad?:", "descripcion?:", "urls?:"] },
    { path: "app/src/serializacion/json.ts", any: ["alias", "urls", "validarEntidades"] },
    { path: "app/src/render/jointjs/proyeccion.ts", any: ["alias", "[Unidad]", "{alias}", "📄", "🔗"] },
    { path: "app/src/opl/generar.ts", any: ["tambien", "[", "alias"] },
    { path: "app/src/ui/InspectorEntidad.tsx", any: ["SeccionAlias", "SeccionUrls", "SeccionDescripcion", "alias", "URLs"] },
    { path: "app/src/ui/ModalUrlsObjeto.tsx", any: ["UrlObjetoTipada", "tipo"] },
  ],
  evidenciaExtra: ["app/e2e/opm-smoke.spec.ts"],
}
```

#### Regla nueva: designaciones de estado (HU-13.010-013, HU-17.033)

```js
{
  ids: ["HU-13.010", "HU-13.011", "HU-13.012", "HU-13.013", "HU-13.019", "HU-17.033"],
  estado: "cubierto",
  confianza: "alta-auto",
  nota: "Auto: designaciones inicial / final / default / current con exclusiones implementadas en modelo, render, OPL e inspector.",
  requires: [
    { path: "app/src/modelo/estadosDesignaciones.ts", all: ["designarInicial", "designarFinal", "designarDefault", "designarCurrent", "quitarDesignacion"] },
    { path: "app/src/modelo/tipos.ts", all: ["designaciones?:", "DesignacionEstado"] },
    { path: "app/src/serializacion/json.ts", any: ["designaciones", "validarDesignacionesEstado"] },
    { path: "app/src/render/jointjs/proyeccion.ts", any: ["inicial", "final", "default", "current", "V-4", "V-5", "V-6"] },
    { path: "app/src/opl/generar.ts", any: ["inicial", "final", "por defecto", "actual"] },
    { path: "app/src/ui/InspectorEntidad.tsx", any: ["SeccionDesignaciones", "designaciones", "Inicial", "Final", "Default"] },
  ],
}
```

#### Regla nueva: duracion canonica (HU-17.034)

```js
{
  ids: ["HU-17.034"],
  estado: "cubierto",
  confianza: "alta-auto",
  nota: "Auto: duracion temporal con min/nominal/max y unidad implementada en modelo, OPL y modal.",
  requires: [
    { path: "app/src/modelo/objetoDuracion.ts", all: ["fijarDuracion", "validarDuracion"] },
    { path: "app/src/modelo/tipos.ts", all: ["duracion?:", "DuracionTemporal", "UnidadTiempo"] },
    { path: "app/src/serializacion/json.ts", any: ["validarDuracionEstado", "duracion"] },
    { path: "app/src/opl/generar.ts", any: ["Duracion Minima", "respectivamente"] },
    { path: "app/src/ui/ModalDuracionEstado.tsx", any: ["unidad", "min", "nominal", "max"] },
  ],
}
```

#### Regla nueva: atajos centralizados (HU-90.* completos)

```js
{
  ids: ["HU-90.001", "HU-90.002", "HU-90.008", "HU-90.009", "HU-90.010", "HU-90.011", "HU-90.012", "HU-90.013", "HU-90.014", "HU-90.015", "HU-90.016", "HU-90.017", "HU-90.020", "HU-90.021"],
  estado: "cubierto",
  confianza: "alta-auto",
  nota: "Auto: registry central de atajos con contexto, divisor de panel y menu contextual del arbol implementados.",
  requires: [
    { path: "app/src/ui/atajosTeclado.ts", all: ["registrarAtajo", "escucharGlobal", "data-atajos-contexto"] },
    { path: "app/src/ui/divisorPanel.tsx", all: ["clamp", "doble"] },
    { path: "app/src/ui/MenuContextualArbol.tsx", any: ["Renombrar", "Eliminar"] },
  ],
}
```

#### Regla nueva: multi-seleccion + batch (HU-SHARED-008, HU-11.007/.008/.023, HU-14.016)

```js
{
  ids: ["HU-SHARED-008", "HU-11.007", "HU-11.008", "HU-11.023", "HU-14.016", "HU-90.003", "HU-90.004", "HU-90.005", "HU-90.006", "HU-90.007", "HU-90.019"],
  estado: "cubierto",
  confianza: "alta-auto",
  nota: "Auto: multi-seleccion canonica con Ctrl+clic y rubber band Shift, operaciones batch atomicas en undo, copy/paste visual.",
  requires: [
    { path: "app/src/canvas/seleccionMultiple.ts", all: ["agregar", "quitar", "toggle", "interseccionRectangulo", "todasDelOpd"] },
    { path: "app/src/canvas/operacionesBatch.ts", all: ["eliminarBatch", "alinearEnlacesIzquierda", "conectarMultiAlTodo", "aplicarEstiloApariencias", "copiarSeleccion", "pegarSeleccion"] },
    { path: "app/src/store.ts", any: ["seleccionados:", "modoSeleccion", "portapapelesVisual"] },
    { path: "app/src/render/jointjs/JointCanvas.tsx", any: ["ctrlKey", "shiftKey", "rubber"] },
  ],
}
```

#### Regla nueva: workspace cierre (HU-31.011-013, HU-35.001-005, HU-30.029)

```js
{
  ids: ["HU-31.011", "HU-31.012", "HU-31.013", "HU-35.001", "HU-35.002", "HU-35.003", "HU-35.004", "HU-35.005", "HU-30.029"],
  estado: "cubierto",
  confianza: "alta-auto",
  nota: "Auto: mover modelos cut/paste drag-drop, busqueda global con guard, versiones manuales sin log-scale, archivado.",
  requires: [
    { path: "app/src/persistencia/movimientoModelos.ts", any: ["moverModelo", "moverCarpeta", "cortarModelo", "pegarModelo"] },
    { path: "app/src/persistencia/versiones.ts", any: ["crearVersion", "restaurarVersion", "eliminarVersion"] },
    { path: "app/src/persistencia/workspace.ts", any: ["archivarModelo", "archivarCarpeta", "buscarGlobal"] },
    { path: "app/src/ui/DialogoBuscarGlobal.tsx", any: [">= 3", "buscar", "guard"] },
    { path: "app/src/ui/DialogoVersiones.tsx", any: ["version", "snapshot", "restaurar"] },
  ],
}
```

#### Regla nueva: multi-pestana (HU-34.002, HU-34.003)

```js
{
  ids: ["HU-34.002", "HU-34.003"],
  estado: "cubierto",
  confianza: "alta-auto",
  nota: "Auto: multi-pestana sesion-only con N modelos abiertos, drag-reorder, dirty marker.",
  requires: [
    { path: "app/src/store/pestanas.ts", all: ["crearPestanaNueva", "abrirPestana", "cerrarPestana", "cambiarActiva", "reordenarPestanas"] },
    { path: "app/src/ui/BarraPestanas.tsx", any: ["pestana", "asterisco", "draggable"] },
  ],
}
```

#### Verificacion del delta de reglas

Tras editar `progress-dashboard.mjs`:

```bash
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Verificar:
- Total reglas evaluadas: 49 + 6 nuevas (o las que decidas) = 55+.
- Reglas matcheadas en main post-merge L6 (sin L1-L5 mergeadas aun): 45 actuales + alguna fraccion de las nuevas (las que solo dependen de archivos ya en main).
- Reglas matcheadas post-ronda 8 cierre completo: >= 50 / 55. Idealmente >= 52 / 55. (depende de cuantas reglas nuevas declares ok y cuantas dependan de archivos slice que aun no esten en main).
- Reglas nuevas usan `any`/paths alternativos cuando el brief de L1-L5 permite barrel o slice. No hardcodear solo el path futuro si existe evidencia vigente equivalente.

### C. Smokes y validacion build

```bash
cd app && bun run build
# Verificar output: deberian existir chunks
# `vendor-jointjs.<hash>.js` (~500 KB / 200 KB gzip estimado)
# `vendor-preact.<hash>.js` (~30 KB / 12 KB gzip)
# `feature-mapa.<hash>.js`, `feature-asistente.<hash>.js`, etc.
# `index.<hash>.js` (chunk principal, < 600 KB / < 240 KB gzip estimado)
ls -la dist/assets/ | sort -k5 -n
```

```bash
bun run browser:smoke
# Los 40 smokes deben pasar; lazy() puede agregar latencia inicial pero Suspense espera el chunk
```

## 7. Tests obligatorios

- Build verde: `bun run build` debe completar sin errores. Vite no advierte por chunk grande con `chunkSizeWarningLimit: 700`.
- Smokes verdes: 40 actuales pasan sin modificar el spec.
- Detector L6a: no caen las 45 reglas matcheadas actuales; las nuevas pueden quedar pendientes si dependen de L1-L5. Detector post-ronda/consolidacion: `--sync-real` reporta >= 50/55 reglas matcheadas.
- Bundle size validation:
  - Chunk principal: < 600 KB minificado, < 240 KB gzip.
  - Chunk JointJS: separado, < 700 KB minificado, < 250 KB gzip.
  - Suma total: similar al actual (~1045 KB / ~295 KB gzip) o ligeramente mejor (porque los chunks lazy permiten cache mejor pero el tamano total no baja drasticamente).
- Ejecucion validacion: `bun run dev` y verificar que paneles lazy cargan con un pequeno delay sin congelar la UI.
- Lazy coverage: abrir al menos una vez cada componente lazy (`MapaSistema`, asistente, guardar/cargar, buscar global, versiones, archivados, URLs, duracion, cheatsheet) durante smoke manual o Playwright aditivo para comprobar que el chunk existe y no hay error runtime.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

```bash
cd /home/felix/projects/deep-opm-pro
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
# L6a: no caer bajo las 45 reglas actuales; cierre de ronda completa: >= 50 / 55+ reglas matcheadas
```

Para verificar el bundle:

```bash
cd app && bun run build
ls -la dist/assets/ | awk '{ printf "%9s %s\n", $5, $9 }'
gzip -l dist/assets/*.js | awk 'NR > 1 { printf "%s %s%% %s\n", $2, int(100 - $3/$2*100), $4 }' | head
```

## 9. Decisiones bloqueadas (no reabrir)

- **NO introducir librerias nuevas**: ni `pdf-lib`, ni `papaparse`, ni `react`, ni `react-router`. Solo Vite config + Preact lazy/Suspense (parte de preact compat).
- **Preact 10 + `preact/compat` para `lazy` y `Suspense`**: ya disponible en deps actuales.
- **Vite manualChunks como funcion**: mas flexible que objeto. Decision arquitectural — mantener.
- **Side-effect imports CSS** (`jointjs/dist/joint.css`) van al chunk vendor-jointjs o al chunk principal — Vite decide. NO forzar a chunk lazy (CSS de JointJS es global y debe cargar antes del primer render JointJS).
- **Detector preserva las 49 reglas actuales**: NO eliminar reglas existentes salvo que apunten a HU descartadas (EPICA-70, EPICA-91 no debieran estar en el detector — verificar y eliminar si aparecen).
- **Detector NO reescribe la logica de matching**: solo cambia datos (paths, patterns).
- **Reglas nuevas son aditivas**: extender el array de `autoAuditRules()`. NO refactorizar la estructura de la funcion.
- **`hu-progress-evidence.json` se regenera con `--sync-real`**: NO escribir manualmente entries. El flag `--sync-real` autoescribe `autoEntries`.
- **No Goodhart del detector**: comentarios en barrels pueden ser transitorios de compatibilidad, pero una regla se acepta solo si apunta a implementacion/test/golden real o a path alternativo que ya contiene la evidencia.
- **NO modificar HU del backlog**: el detector consume el backlog readonly.

## 10. Decisiones que tomas vos (documentar en commit)

- **Si crear `Spinner.tsx`** o usar `fallback={null}` en `<Suspense>`. Recomendado: `null` (mas rapido visualmente; los chunks chicos cargan en < 100ms en local).
- **Si separar `vendor-preact` y `vendor-zustand`** o juntar en `vendor`. Recomendado: separar (mejor cache).
- **Si chunkear `customShapes.ts`** y `linkAssets.ts` con JointJS o como app-render. Recomendado: con JointJS (`vendor-jointjs`) — son extension de la libreria.
- **Si agregar `chunkSizeWarningLimit: 700`** o ajustar otro valor. Recomendado: 700 KB (deja margen para `vendor-jointjs` que estara cerca de eso).
- **Si crear regla "ronda 8 refactor"** que matchee la existencia de slices/composers/generadores. Recomendado: NO; el detector mide cobertura de HU, no de refactor estructural.
- **Si la regla de alias/unidad/URL/descripcion** lista TODAS las HU de EPICA-17 o solo las cubiertas. Recomendado: solo las cubiertas (HU-17.014/.015-017 slot de valor sigue diferida — NO incluir).
- **Si agregar reglas para EPICA-90 individuales** (HU-90.001 / HU-90.005 / HU-90.014, etc.) o una regla agrupada. Recomendado: agrupada (las reglas pueden contener multiples ids).
- **Como manejar reglas que dependen de archivos que L1-L5 crearan post-L6**: las reglas pueden estar en estado "pendiente" hasta que se mergeen. Recomendado: declararlas tolerantes con paths actuales + futuros cuando sea posible. Aceptar que al cierre de L6 algunas esten en `pendiente` y se moveran a `cubierto` post-L1-L5. El detector reporta "rulesUnmatched" — eso es OK durante el merge, no como cierre final.
- **Si la regla nueva multi-seleccion apunta a `app/src/store.ts` o a `app/src/store/seleccion.ts`**: si L1 mergeo despues, sera `seleccion.ts`; si L1 mergeo antes, todavia. Recomendado: regla con `any` que tolere ambos paths usando `evidenciaExtra` con multiples paths posibles.

## 11. Forma del entregable

Commits sugeridos:

- `feat(build): introduce code splitting de Vite con chunks vendor jointjs preact y feature mapa asistente dialogos modales`
- `feat(ui): lazy y Suspense de Preact para paneles y modales pesados`
- `chore(ledger): recalibra detector de progress-dashboard a paths post-ronda 7`
- `chore(ledger): agrega reglas de detector para alias unidad descripcion URLs`
- `chore(ledger): agrega reglas de detector para designaciones duracion canonica atajos centralizados`
- `chore(ledger): agrega reglas de detector para multi-seleccion batch workspace cierre y multi-pestana`
- `chore(ledger): regenera evidencia hu-progress post-recalibracion`

Co-author footer estandar si aplica.

NO tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar:

- Hashes de commits.
- Tamano del bundle (chunks separados con sizes), comparar contra base.
- Numero total de reglas evaluadas (esperado: 49 + 6 nuevas = 55).
- Numero matcheado (esperado al cierre L6: >= 47; al cierre de ronda 8 completa: >= 50).
- Resultado de `bun run check`, `browser:smoke`, `build`.
- Decisiones tomadas en §10.
- Bloqueos: si una regla nueva no logra matchear porque la linea correspondiente no aporto evidencia esperada.
- Si decidiste crear `Spinner.tsx` o no.

Si descubris bug fuera de scope (ej. import de Mapa que carga eagerly por algun side-effect), entregar como patch a `/tmp/` y NO commitear.
