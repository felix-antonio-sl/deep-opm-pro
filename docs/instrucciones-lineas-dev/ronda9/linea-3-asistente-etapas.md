# Línea 3 — Asistente por etapa

## 1. Misión

Romper el componente `app/src/ui/AsistenteNuevoModelo.tsx` (**935 LOC**) en sub-archivos por **etapa del wizard**, conservando el export público `AsistenteNuevoModelo`, el flujo de etapas y el comportamiento observable. El componente actualmente ya separa internamente **11 funciones `Etapa*`** (más `Bienvenida` y `siguiente`); destilamos esa partición a archivos físicos siguiendo el patrón de **un componente por etapa** con su validación local.

Cierre arquitectural: `AsistenteNuevoModelo.tsx` queda como **barrel agregador < 200 LOC** (objetivo) / < 350 LOC (tope absoluto); cada etapa vive en `app/src/ui/asistente/<NombreEtapa>.tsx`, las validaciones de campos en `app/src/ui/asistente/validaciones.ts` (opcional), los estilos compartidos en `app/src/ui/asistente/estilos.ts` (opcional), y el orquestador del wizard (manejo de etapa actual, navegación, progreso, botones) en `app/src/ui/asistente/Asistente.tsx`.

Beneficio adicional: el chunk lazy `feature-asistente` (248 KB / 64 KB gzip post-ronda 8) puede beneficiarse de tree-shaking más fino si las etapas se importan dinámicamente cuando el wizard avanza. Esto es opcional; la línea principal es la partición estructural.

**Slice mínimo entregable**:

11 sub-archivos de etapa nuevos en `app/src/ui/asistente/`:

- `Bienvenida.tsx`: pantalla inicial con descripción del wizard.
- `EtapaFuncionPrincipal.tsx`: Etapa 2 (obligatoria) — campo de texto único para "función principal del sistema".
- `EtapaBeneficiario.tsx`: Etapa 3 (obligatoria) — campo de texto para "beneficiario".
- `EtapaAtributo.tsx`: Etapa 4 (opcional) — atributo relevante del beneficiario (input).
- `EtapaHandler.tsx`: Etapa 5 (obligatoria) — handler del sistema (radio + nombre opcional).
- `EtapaNombreSistema.tsx`: Etapa 6 (obligatoria) — nombre del sistema.
- `EtapaHerramientas.tsx`: Etapa 7 (opcional) — lista de herramientas (string[]).
- `EtapaEntradas.tsx`: Etapa 8 (opcional) — lista de entradas.
- `EtapaSalidas.tsx`: Etapa 9 (opcional) — lista de salidas.
- `EtapaAmbientales.tsx`: Etapa 10 (opcional) — lista de objetos ambientales.
- `EtapaConfirmar.tsx`: Etapa 11 (obligatoria) — preview del modelo a generar + botón confirmar.

1 archivo orquestador:

- `Asistente.tsx`: orquestador del wizard. Lee `asistente` del store, dispatch a `siguienteEtapa`/`etapaAnterior`/`cancelarAsistente`/`confirmarAsistente`, mapea `etapaActual` al componente `Etapa*` correspondiente, renderiza progress bar, botones Atrás/Siguiente/Saltar/Confirmar/Cancelar.

2 archivos de soporte opcionales:

- `estilos.ts`: objeto `S` actual (estilos en CSS-in-JS Preact) compartido entre etapas. Si todos los estilos quedan locales a cada etapa, omitir.
- `validaciones.ts`: helpers de validación de campos no triviales (ej. trimming, longitud máxima, formato). Si todas las validaciones son delegadas al store (`siguienteEtapa` valida), omitir.

Barrel `AsistenteNuevoModelo.tsx` reducido:

```tsx
// app/src/ui/AsistenteNuevoModelo.tsx (< 200 LOC)
/**
 * Barrel agregador del wizard de creación de modelo.
 * Re-exporta AsistenteNuevoModelo desde asistente/Asistente.tsx.
 * El componente anterior se descompone en asistente/{Bienvenida,Etapa*,Asistente}.tsx.
 */
export { AsistenteNuevoModelo } from "./asistente/Asistente";
```

(Si solo es 1 export, el barrel puede ser de 1 línea. El tope <200 LOC es porque puede haber tipos públicos exportados también. Si no, es trivial.)

`Asistente.tsx` puede importar de:
- `Bienvenida.tsx`, `EtapaFuncionPrincipal.tsx`, ..., `EtapaConfirmar.tsx`
- `estilos.ts` (si existe)
- `validaciones.ts` (si existe)
- `../../store` (acciones del wizard)

**Fuera de slice**:

- **No tocar `store/uiPanel.ts`** ni `store/modelo.ts` donde viven `iniciarAsistente`, `siguienteEtapa`, `etapaAnterior`, `cancelarAsistente`, `confirmarAsistente`. La lógica del wizard en el store es fija.
- **No tocar `tipos.ts`** (territorio L5). `EtapaAsistente`, `DatosAsistente`, etc. quedan donde están.
- **No reescribir tests del store** (`store.test.ts:1095..1218` cubre el asistente). Smokes existentes preservados.
- **No alterar el flujo de etapas** (orden, opcionalidad, validaciones). La línea es 100% refactor estructural; el comportamiento observable es idéntico.
- **No tocar `MenuPrincipal.tsx`** (que monta el botón "Nuevo modelo asistido").

## 2. Deudas que cierra

| Deuda | Path absoluto | Aporte |
|---|---|---|
| Componente AsistenteNuevoModelo monolítico con 12 etapas inline | `/home/felix/projects/deep-opm-pro/app/src/ui/AsistenteNuevoModelo.tsx` (935 LOC) | Reduce a < 200 LOC en barrel; 11 etapas + 1 orquestador < 200 LOC c/u; chunk lazy `feature-asistente` puede beneficiarse de import dinámico por etapa. |
| HANDOFF "deuda técnica `AsistenteNuevoModelo.tsx` 935 LOC (no partido)" | `/home/felix/projects/deep-opm-pro/docs/HANDOFF.md §Pendientes Inmediatos` | Cierra el ítem; cada etapa es testeable y reusable. |
| Bundle: chunk lazy 248 KB | `app/dist/assets/feature-asistente-*.js` | L3 puede reducir vía tree-shaking si las etapas se importan dinámicamente. Mejora opcional. |

## 3. Anclaje a evidencia

- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md`: workflow de creación de modelos OPM. El asistente refleja este workflow en 12 etapas (función principal → beneficiario → handler → nombre → entradas/salidas → confirmar).
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §3.55, §3.69: definiciones de Object/Process. El asistente consume estos para producir el modelo inicial.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/elementsFunctionality/draw.view.ts` — registro central de elementos. Confirma que la creación inicial del modelo es OPCloud-driven (no del wizard); el wizard solo recopila datos.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/commands/object-decider.ts:5-127` — decider por tipo. Patrón: cada tipo de input tiene su flujo. Aquí cada etapa tiene su componente.
  - `/home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/linea-5-ui-subcomponentes.md` — brief L5 ronda 8. Mismo patrón: barrel + sub-componentes prop-driven, leaves reciben callbacks acotados.
- **Estado actual del código (post-ronda 8)**:
  - `app/src/ui/AsistenteNuevoModelo.tsx` (935 LOC): 11 funciones `Etapa*` inline + función `Bienvenida` + `siguiente` (función helper) + `AsistenteNuevoModelo` (export principal). Constantes `TOTAL_ETAPAS = 12`, `ETAPA_ATRIBUTO = 3`, `ETAPA_HANDLER = 4`, `ETAPA_HERRAMIENTAS = 6`, `ETAPA_ENTRADAS = 7`, `ETAPA_SALIDAS = 8`, `ETAPA_AMBIENTALES = 9`. Tipo `EtapaAsistente`, `DatosAsistente`. Estado del wizard vive en el store (`asistente: { etapaActual, datos, cancelado } | null`).
  - `app/src/store/uiPanel.ts`: define `iniciarAsistente`, `cancelarAsistente`, `confirmarAsistente`, etc. Tipos `EtapaAsistente`, `DatosAsistente` en `store/tipos.ts`. Estos NO se tocan en L3.
  - Tests: `app/src/store.test.ts:1095..1218` cubre el asistente integrado vía store. No hay test de cada Etapa en aislamiento todavía.
  - Smokes: hay 1 smoke smoke del asistente en `app/e2e/opm-smoke.spec.ts` (verificar `grep -n "asistente\|Asistente" app/e2e/opm-smoke.spec.ts`).

## 4. Archivos permitidos

```text
app/src/ui/AsistenteNuevoModelo.tsx                         EDIT — reducir a barrel < 200 LOC
app/src/ui/asistente/Asistente.tsx                          NUEVO — orquestador del wizard
app/src/ui/asistente/Bienvenida.tsx                         NUEVO
app/src/ui/asistente/EtapaFuncionPrincipal.tsx              NUEVO
app/src/ui/asistente/EtapaBeneficiario.tsx                  NUEVO
app/src/ui/asistente/EtapaAtributo.tsx                      NUEVO
app/src/ui/asistente/EtapaHandler.tsx                       NUEVO
app/src/ui/asistente/EtapaNombreSistema.tsx                 NUEVO
app/src/ui/asistente/EtapaHerramientas.tsx                  NUEVO
app/src/ui/asistente/EtapaEntradas.tsx                      NUEVO
app/src/ui/asistente/EtapaSalidas.tsx                       NUEVO
app/src/ui/asistente/EtapaAmbientales.tsx                   NUEVO
app/src/ui/asistente/EtapaConfirmar.tsx                     NUEVO
app/src/ui/asistente/estilos.ts                             NUEVO opcional
app/src/ui/asistente/validaciones.ts                        NUEVO opcional
app/src/ui/asistente/Asistente.test.tsx                     NUEVO opcional (test del orquestador)
app/src/ui/asistente/EtapaXxx.test.tsx                      NUEVO opcional (1 por etapa)
app/e2e/opm-smoke.spec.ts                                   EDIT aditivo (smoke nuevo si selector cambia)
opm-extracted/**                                            LECTURA
docs/HANDOFF.md                                             LECTURA (no editar)
docs/historias-usuario-v2/**                                LECTURA (no editar)
```

## 5. Restricciones de no-colisión

- **No tocar el store**: `store/uiPanel.ts`, `store/modelo.ts`, `store/runtime.ts`, etc.
- **No tocar tipos**: `EtapaAsistente`, `DatosAsistente`, etc. en `store/tipos.ts`. Si algún tipo necesita re-exportarse desde el asistente para conveniencia, hacerlo localmente y declararlo en commit.
- **No tocar otros componentes UI**: `MenuPrincipal.tsx`, `App.tsx`, `Toolbar.tsx`, etc.
- **No alterar comportamiento observable**: orden de etapas idéntico, opcionalidad idéntica, validaciones idénticas, navegación Atrás/Siguiente/Saltar idéntica, mensajes idénticos, `data-testid` preservados.
- **No introducir librerías UI nuevas**: ni react-hook-form, ni Formik, ni nada. El wizard sigue con Preact + signals + state local controlado por el store.
- **Cleanup correcto**: el orquestador desmonta etapas previas al cambiar; no hay state local persistente cross-etapa (todo va al store).

## 6. Slice mínimo shippeable

### 6.1 Capa UI (única capa que toca L3)

Cada etapa expone una firma simple:

```tsx
// app/src/ui/asistente/EtapaFuncionPrincipal.tsx
import type { ComponentChildren } from "preact";
import { S } from "./estilos"; // opcional

interface Props {
  valor: string;
  onChange: (valor: string) => void;
}

/**
 * Etapa 2 del wizard: Función Principal del sistema.
 * HU base: HU-NUEVOMODELO.* (workflow OPM canónico).
 */
export function EtapaFuncionPrincipal({ valor, onChange }: Props) {
  return (
    <div data-testid="asistente-etapa-funcion-principal">
      <h3 style={S.title}>Etapa 2 de {TOTAL_ETAPAS} — Función Principal</h3>
      {/* ... */}
    </div>
  );
}
```

Cada etapa es **prop-driven**: recibe `valor` (o subset de `DatosAsistente` que necesita) y `onChange` callback. Sin acoplamiento al store directo. El orquestador hace el wiring.

### 6.2 Orquestador

```tsx
// app/src/ui/asistente/Asistente.tsx
import { useOpmStore, store } from "../../store";
import { Bienvenida } from "./Bienvenida";
import { EtapaFuncionPrincipal } from "./EtapaFuncionPrincipal";
// ...
import { EtapaConfirmar } from "./EtapaConfirmar";

const ETAPAS_OPCIONALES = new Set([3, 4, 6, 7, 8, 9]); // ETAPA_ATRIBUTO, ETAPA_HANDLER, etc.

export function AsistenteNuevoModelo() {
  const asistente = useOpmStore((s) => s.asistente);
  if (!asistente) return null;

  const etapa = asistente.etapaActual;
  const datos = asistente.datos;

  const siguiente = (parcial: Partial<DatosAsistente>) => store.getState().siguienteEtapa(parcial);
  const atras = () => store.getState().etapaAnterior();
  const cancelar = () => store.getState().cancelarAsistente();
  const confirmar = () => store.getState().confirmarAsistente();
  const saltar = () => { /* lógica original de skip */ };

  let contenido: ComponentChildren = null;
  switch (etapa) {
    case 0: contenido = <Bienvenida />; break;
    case 1: contenido = <EtapaFuncionPrincipal valor={datos.funcionPrincipal ?? ""} onChange={(v) => siguiente({ funcionPrincipal: v })} />; break;
    // ... case 2..10
    case 11: contenido = <EtapaConfirmar datos={datos} />; break;
  }

  return (
    <div data-testid="asistente-nuevo-modelo" /* ... */>
      <progress max={TOTAL_ETAPAS - 1} value={etapa} />
      <span data-testid="asistente-etapa-label">Etapa {etapa + 1} de {TOTAL_ETAPAS}</span>
      {contenido}
      <div>
        {etapa > 0 && <button data-testid="asistente-atras" onClick={atras}>Atrás</button>}
        {ETAPAS_OPCIONALES.has(etapa) && <button data-testid="asistente-saltar" onClick={saltar}>Saltar</button>}
        {etapa < 11 && <button data-testid="asistente-siguiente" onClick={() => siguiente({})}>Siguiente</button>}
        {etapa === 11 && <button data-testid="asistente-confirmar" onClick={confirmar}>Confirmar</button>}
        <button data-testid="asistente-cancelar" onClick={cancelar}>Cancelar</button>
      </div>
    </div>
  );
}
```

(Pseudocódigo; el actual tiene más lógica de validación delegada a `siguiente`.)

### 6.3 Imports dinámicos opcionales (mejora bundle)

Si la línea decide reducir el chunk lazy, las etapas pueden importarse dinámicamente:

```tsx
// app/src/ui/asistente/Asistente.tsx
import { lazy } from "preact/compat";
import { Suspense } from "preact/compat";

const EtapaFuncionPrincipal = lazy(() => import("./EtapaFuncionPrincipal").then(m => ({ default: m.EtapaFuncionPrincipal })));
// ... una por etapa

// En render:
<Suspense fallback={null}>
  {contenido}
</Suspense>
```

Esto rompe el chunk lazy `feature-asistente` en sub-chunks por etapa. Ganancia esperada: ~50-100 KB menos en first paint del wizard. **Opcional**; declarar en commit si se aplica.

## 7. Tests obligatorios

- **`store.test.ts:1095..1218` intacto**: el wizard integrado vía store sigue verde sin tocar.
- **Smokes existentes intactos**: 40/40 verde post-refactor. Si hay smoke específico del asistente, sigue pasando.
- **Tests aditivos por etapa (recomendados)**:
  - `Bienvenida.test.tsx`: render smoke. ~1 test / ~3 expects.
  - `EtapaFuncionPrincipal.test.tsx`: render + onChange. ~2 tests / ~5 expects.
  - ... (similar para cada etapa)
  - `Asistente.test.tsx`: render orquestador, navegación entre etapas, cancelar, confirmar. ~5 tests / ~15 expects.
- **Total esperado**: ~25-30 tests aditivos / ~60-80 expects nuevos.

Tests usan `@testing-library/preact` o `@happy-dom/global-registrator` (lo que ya use el repo). Si no hay infra de tests UI todavía, declarar y dejar tests aditivos como deuda menor.

## 8. Verificación

```bash
cd app
bun run typecheck
bun run test src/ui/asistente/
bun run test src/                          # suite completa
bun run check                              # typecheck + tests
bun run browser:smoke                      # 40/40 verde
bun run build                              # bundle, verificar chunks
```

Verificar tamaño del chunk `feature-asistente`:

```bash
ls -lah app/dist/assets/feature-asistente-*.js
```

Esperado: igual o menor que el actual (~248 KB / ~64 KB gzip). Si se aplicó imports dinámicos, esperar reducción.


## 9. Decisiones bloqueadas (no reabrir)

- **Orden de etapas y opcionalidad**: idéntico a hoy. No agregar ni quitar etapas.
- **Estado del wizard vive en el store**: ningún state local cross-etapa. Cada etapa es controlled por props.
- **Validaciones**: delegadas al store (`siguienteEtapa(parcial)`). No mover validación al componente.
- **`data-testid`**: preservar todos los existentes. Si se agregan nuevos, deben ser aditivos (no reemplazar previos).
- **Estilo CSS-in-JS Preact**: igual que hoy. No introducir Tailwind, CSS modules, styled-components, etc.
- **Sin librerías de wizard / sin librerías de forms**: continúa el patrón de inputs nativos.
- **Lógica de `siguiente()` y `saltar()` (Asistente)**: el orquestador puede mover la función `siguiente` (línea 649 actual) a un helper local, pero la semántica es idéntica.

## 10. Decisiones que tomas vos (documentar en commit)

- **Imports dinámicos por etapa**: aplicar o no. Si aplicas, declarar la mejora de bundle medida.
- **`estilos.ts`**: crear si los estilos `S` se reusan en 3+ etapas; omitir si cada etapa tiene su estilo local.
- **`validaciones.ts`**: crear si emergen helpers compartidos (ej. `trimAndLimit(s, 100)`); omitir si todas las validaciones están en el store.
- **Granularidad del orquestador**: si `Asistente.tsx` queda > 250 LOC, considerar separar el switch de etapas a un mapper `etapaAComponente.ts`. Documentar.
- **Tests UI**: si la infra de tests Preact UI no existe todavía, declarar como deuda y dejar tests aditivos para otra ronda. No bloqueante.
- **Si emergen `data-testid` nuevos** (ej. cada etapa tiene `data-testid="asistente-etapa-N"`): documentar en commit como nuevos selectores aditivos.

## 11. Forma del entregable

Commit sugerido:

```
refactor(ui): extrae asistente en sub-componentes por etapa

- 11 sub-componentes en asistente/{Bienvenida,Etapa*}.tsx
- Asistente.tsx orquestador con switch por etapa
- AsistenteNuevoModelo.tsx reducido a barrel
- estilos.ts opcional, validaciones.ts opcional
- Comportamiento observable idéntico (data-testid preservados)
- Chunk feature-asistente: <reportar tamaño>
- Tests aditivos por etapa ~25 tests / ~60-80 expects

Refs: opm-extracted/src/app/configuration/elementsFunctionality/draw.view.ts (registro central)

Co-Authored-By: <implementador-externo> <noreply@...>
```

**Reporte de cierre obligatorio**:

- Hash final del último commit en main.
- LOC final de `AsistenteNuevoModelo.tsx` + cada `asistente/*.tsx`.
- Output de `bun run check` (último tail).
- Output de `bun run browser:smoke` (40/40 esperado).
- Output de `bun run build` con tamaño del chunk `feature-asistente` (antes/después si aplica).
- Lista de tests aditivos creados + conteo.
- Decisiones declaradas (de §10).
- Confirmación de archivos no tocados: `store/*`, `tipos.ts`, otros componentes UI, smokes (excepto aditivos).

**Qué NO tocar**:

- `docs/HANDOFF.md`, `docs/historias-usuario-v2/`, `docs/JOYAS.md`, `docs/instrucciones-lineas-dev/ronda1..8/`.
- `app/src/store/*`, `app/src/modelo/*`, `app/src/serializacion/*`, `app/src/opl/*`, `app/src/render/*`, `app/src/canvas/*`, `app/src/persistencia/*`.
- Otros archivos en `app/src/ui/` que no sean `AsistenteNuevoModelo.tsx` y `asistente/*`.
- `app/scripts/in-vivo-test.mjs`, `home/`.
