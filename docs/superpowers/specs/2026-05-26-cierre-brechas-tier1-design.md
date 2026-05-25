# Diseño — Cierre de brechas Tier 1 (visibilidad OPL · reuso por nombre · simulación numérica)

**Fecha:** 2026-05-26
**Repo:** `deep-opm-pro`
**Corte:** Tier 1 del cierre de brechas reales contra `docs/manual-simulado-opcloud-capacidades.md`
**Estado:** diseño validado, pendiente plan de implementación.
**Autoridad superior (precedencia):** `docs/canon-opm/reglas-opm-estrictas.md` (canon OPM/OPL) → `ui-forja/GOVERNANCE.md` (diseño visual) → `CLAUDE.md` / `docs/HANDOFF.md` → implementación.

## 1. Objetivo

Cerrar tres brechas funcionales acotadas, de bajo riesgo y alto valor, detectadas
en la auditoría de cobertura Opforja vs. manual simulado OPCloud:

- **A — Visibilidad configurable del OPL**: toggle de esencia (siempre / solo-difiere
  / oculta). **Unidades/alias diferidos** (ver §4.1): están tejidos en la capa de
  nombres (`refsHints.ts` `nombreOpl`/`nombreOplBase`) usada por todos los generadores
  y por los hints de hover/parser; ocultarlos con consistencia no es bajo riesgo y
  merece su propio corte.
- **B — Diálogo colisión de nombre**: reutilizar-vs-renombrar en creación y rename.
- **F — Simulación numérica conectada**: cablear `generarDatosSimulados` a UI + export CSV.

Quedan **fuera** de este corte (cada una con su propio ciclo spec→plan): switcher de
idioma OPL (deuda Codex v1.1), herencia de generalización, condiciones/loops
ejecutables, y el cableado del runtime sociotécnico.

## 2. Punto de partida (lo que ya existe y NO se rehace)

- **OPL forward**: `app/src/opl/generadores/estructural.ts` (`oracionEntidad` emite
  esencia+afiliación en dos oraciones; `oracionValorAtributo` emite valor con unidad
  inline `[unidad]`), `duracionMetadata.ts` (emite alias/unidad de duración).
  `app/src/opl/generar.ts` (`generarOplInteractivo`), `app/src/opl/panel.ts`
  (`derivarPanelOpl` deriva `textoOplActual` de las mismas líneas que muestra).
- **Defaults canónicos** (`creacion.ts:72-73`): `esencia="informacional"`,
  `afiliacion="sistemica"`.
- **Prefs UI**: `app/src/modelo/tipos/ui.ts` (`PreferenciasUiUsuario`, ya con
  `oplNumeracionVisible`, `oplMinimizado`, `gridConfig`). No pertenece al JSON OPM.
- **Config UI**: `app/src/ui/DialogoConfiguracion.tsx` (ya aloja la config de grid).
- **Creación/colisión**: `app/src/modelo/operaciones/creacion.ts` (`crearEntidad`
  retorna `fallo` genérico en colisión), `operaciones/entidad.ts`
  (`nombreEntidadDisponible`, `entidadPorNombreCanonico`, `nombreUnicoEntidad`,
  `renombrarEntidad`). Reuso de aparición: `crearAparienciaEntidadEnCanvas`
  (handlers/seleccion.ts) ya existe (usado por el drag de biblioteca).
- **Simulación numérica**: `app/src/modelo/simulacion/parametros.ts`
  (`generarDatosSimulados(modelo, N, rng)` puro y testeado; columnas = atributos con
  `esAtributo && valorSlot && simulacion.simulable`). Selección por atributo ya vive
  en `SeccionAtributo.tsx` (toggle "Simulación").
- **Command palette**: `app/src/ui/CommandPalette.tsx` (doctrina ⌘K-only del HANDOFF).

## 3. Invariantes y restricciones de diseño

1. **Canon intacto**: la visibilidad OPL es **solo de presentación**. El texto
   canónico (`textoOplActual`) que alimenta el editor libre y el parser **siempre**
   se genera con todas las opciones visibles. Hacer lo contrario rompería el
   roundtrip (las unidades van inline; sembrar el editor con texto filtrado
   perdería unidades al re-parsear). Defienden esto `roundtrip.test.ts` y
   `fixtures-roundtrip.ts`.
2. **Sin fusión de entidades**: renombrar hacia un nombre existente nunca fusiona
   dos entidades lógicas. El diálogo en rename ofrece renombrar/cancelar, no reusar.
3. **Tipos incompatibles no se reutilizan**: reuso de aparición solo si el tipo
   coincide (objeto↔objeto, proceso↔proceso). Caso del manual "impedir fusionar
   tipos incompatibles".
4. **Governance visual**: la toolbar OPL es palabras inline sin cajas/checkboxes
   (corte Codex). Por eso los toggles de visibilidad van a `DialogoConfiguracion`,
   no a la toolbar OPL. La simulación numérica entra por command palette, no por
   chrome nuevo. Todo cambio visual pasa `bun run design:governance`.
5. **Sin backend, sin dependencias nuevas**: CSV se genera con función pura propia;
   nada de Excel/SheetJS ni workers.

## 4. Diseño por brecha

### 4.1 A — Visibilidad configurable del OPL (solo esencia en este corte)

**Modelo de preferencias** (`tipos/ui.ts`, aditivo, fuera del JSON OPM):
```ts
oplEsenciaVisibilidad?: "siempre" | "solo-difiere" | "oculta";
```
Default (ausente o `"siempre"`) = comportamiento actual byte-a-byte.

**Generación con opciones** (`VisibilidadOpl`):
- `generarOplInteractivo(modelo, opdId, opciones?)` → `generarLineasOpl(modelo, opd,
  opciones?)` → `oracionEntidad(entidad, opciones?)` reciben `VisibilidadOpl`
  (default = todo visible). Parámetro opcional retrocompatible.
- `oracionEntidad`: las dos oraciones de esencia/afiliación (`X es informacional.` /
  `X es sistémico.`) se omiten cuando `opciones.esencia==="oculta"`; cuando
  `==="solo-difiere"`, se omite la de esencia si `esencia==="informacional"` y la de
  afiliación si `afiliacion==="sistemica"` (defaults canónicos de `creacion.ts:72`);
  `"siempre"` = como hoy. El caso atributo-con-valor (`oracionValorAtributo`) no se
  toca.

**Diferido (NO entra)**: visibilidad de unidades/alias. Viven en `nombreOpl`/
`nombreOplBase` (`refsHints.ts:172-200`), usados por todos los generadores y por los
hints que alinean tokens de hover OPL↔canvas y la delimitación del parser. Ocultarlos
con consistencia exige enhebrar la opción por toda la capa de nombres + regresión de
hover/parser/roundtrip → corte propio.

**Panel** (`derivarPanelOpl`):
- Genera **canónico** (opciones default) → `textoOplActual`, editor, parser, bloques.
  Invariante #1.
- Genera **display** (con `oplEsenciaVisibilidad`) → líneas read-only renderizadas.
- **Optimización**: si la pref es `"siempre"` (default), un solo pase (display ===
  canónico).

**UI**: sección compacta "OPL" en `DialogoConfiguracion`: un select de esencia
(siempre / solo si difiere / oculta). Persistencia por la misma vía que
`oplNumeracionVisible`.

### 4.2 B — Diálogo colisión de nombre (creación + rename)

**Operación pura — resultado discriminado** (en vez de `fallo` genérico):
```ts
type ColisionNombre = {
  tipo: "colision-nombre";
  nombre: string;
  entidadExistenteId: Id;
  mismoTipo: boolean;
  ubicaciones: Array<{ opdId: Id; aparienciaId: Id }>; // de la entidad existente
};
```
- `crearEntidad` (creacion.ts): al colisionar, en vez de `fallo(...)` retorna un
  resultado que la capa de acciones reconoce como colisión y propaga a UI con el
  contexto `ColisionNombre`.
- `renombrarEntidad` (entidad.ts): mismo patrón al renombrar hacia un nombre
  existente.
- Helpers reusados: `entidadPorNombreCanonico`, ubicaciones desde las apariciones
  de la entidad existente.

**UI** `DialogoColisionNombre`: muestra el nombre en colisión y la **ubicación** de
la cosa existente (OPD + "ir a"). Acciones según contexto:
- **Creación · mismo tipo**: *Reutilizar* (→ `crearAparienciaEntidadEnCanvas` de la
  entidad existente en el OPD/posición destino) · *Renombrar* (campo con autosufijo
  `nombreUnicoEntidad` editable) · *Cancelar*.
- **Creación · tipo distinto**: *Renombrar* · *Cancelar* (sin reuso — invariante #3).
- **Rename**: *Renombrar a otro* · *Cancelar* (mantiene nombre previo — invariante
  #2). Sin reuso.

### 4.3 F — Simulación numérica conectada + CSV

**Kernel intacto**: `generarDatosSimulados(modelo, N)` se reusa tal cual.

**CSV puro** — nueva función en `app/src/modelo/simulacion/`:
```ts
filasSimulacionACsv(
  filas: Array<Record<string, ValorConcreto | undefined>>,
  columnas: string[],
): string
```
Columnas = nombres de atributos simulables; celdas vacías para `undefined`; escape
de comas/comillas/saltos. Sin dependencias.

**UI** `DialogoSimulacionNumerica` (abierto desde command palette → "Simulación
numérica"):
- Lista de atributos incluidos (los `simulacion.simulable`); si no hay ninguno,
  estado vacío con guía ("marca atributos como simulables en el inspector").
- Input N (corridas), botón **Ejecutar** (síncrono), tabla de resultados.
- Botón **Descargar CSV** (Blob + `a[download]`, patrón ya usado por export
  SVG/JSON).
- Sin async, sin Excel (decisiones tomadas).

## 5. Testing (TDD)

- **A**: unit en `opl/` — `oracionEntidad` con cada valor de esencia-visibilidad
  produce las líneas esperadas; `solo-difiere` omite solo cuando coincide con el
  default; **roundtrip intacto** (parser sigue recibiendo texto canónico). e2e:
  cambiar el select en `DialogoConfiguracion` y verificar el panel OPL.
- **B**: unit — `crearEntidad`/`renombrarEntidad` retornan `ColisionNombre` con
  `mismoTipo`/ubicaciones correctos; reuso crea aparición de la entidad existente
  (no nueva entidad); tipo distinto no permite reuso. e2e: crear cosa con nombre
  existente → diálogo → reutilizar / renombrar.
- **F**: unit — `filasSimulacionACsv` (escape, columnas, vacíos); N corridas;
  determinismo con rng fijo. e2e: abrir desde palette, ejecutar, descargar.

**Gate de cierre**: `cd app && bun run check && bun run lint && bun run build &&
bun run design:governance` + subset Playwright de los flujos tocados (OPL panel,
creación/inspector, command palette/simulación).

## 6. Archivos previstos (orientativo, el plan lo detalla)

- A: `tipos/ui.ts`, `opl/generar.ts`, `opl/generadores/estructural.ts`,
  `opl/panel.ts`, `ui/DialogoConfiguracion.tsx` + setter de prefs (+ tests).
- B: `operaciones/creacion.ts`, `operaciones/entidad.ts`, capa de acciones del store,
  nuevo `ui/DialogoColisionNombre.tsx` (+ tests).
- F: nuevo `modelo/simulacion/csv.ts`, `ui/CommandPalette.tsx`, nuevo
  `ui/DialogoSimulacionNumerica.tsx` (+ tests).

## 7. Riesgos y mitigación

- **Roundtrip OPL** (A): mitigado por invariante #1 (canónico siempre completo) +
  tests de roundtrip existentes.
- **Enhebrar opciones por la cadena de generadores** (A): parámetro opcional con
  default = todo visible → cambio retrocompatible, llamadas existentes intactas.
- **Reuso accidental que duplique entidad lógica** (B): el reuso usa la ruta de
  aparición existente, nunca crea entidad; cubierto por unit.
- **N grande bloquea el hilo** (F): síncrono por decisión; se acota N con un máximo
  razonable en UI y aviso.
