# Línea 3 — Modificadores e invocación de enlace (EPICA-15)

## 1. Misión

Cubrir tres pendientes M0/M1 de EPICA-15 que no tocan firma de Enlace ni abanicos: **modificadores Evento y NO** sobre enlaces existentes (HU-15.015, 15.016, 15.018) y **enlaces de invocación** entre procesos (HU-15.019). Aporta expresividad procedural sin reescribir cascadas.

**Slice mínimo entregable**:
- `Enlace.modificador?: "evento" | "no"` (la variante `condicion` ya existe vía HU-11.027; reutilizar).
- `Enlace.probabilidad?: number` para enlaces evento (HU-15.018).
- Nuevo valor en `TipoEnlace`: `"invocacion"`.
- Operación `aplicarModificador(enlaceId, modificador)`, `quitarModificador(enlaceId)`, `crearInvocacion(opdId, procesoOrigenId, procesoDestinoId)`.
- Render: badge "E" sobre enlace evento, "¬" sobre NO, zigzag para invocación. Marker SVG canónico cuando exista en `assets/svg/`.
- OPL-ES: cláusulas distintivas para evento ("disparado por evento"), NO ("no consume"), invocación ("invoca").
- Validación: probabilidad solo en evento; rechazar combinaciones inválidas.
- `completitud.test.ts` con `Record<ModificadorEnlace, true>` y `Record<TipoEnlace, true>` extendido.

**Pendientes explícitos** (no entran a este slice):
- HU-15.020 (auto-invocación con demora): viable como sub-slice si tiempo alcanza; documentar como decisión.
- HU-15.017 (sustituir N conexiones por NOT estado): requiere L1 + L3; queda para ronda 4.
- HU-15.022–024 (mover puerto, joint-tools): UX puro; queda para ronda 4 o ronda UX dedicada.
- HU-11.027 modificador `condicion`: ya implementado; verificar coexistencia.

## 2. HU base (lectura obligatoria antes de codificar)

| HU | Path | Aporta |
|---|---|---|
| HU-15.015 | `docs/historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md` (15.015) | Subtipo Evento |
| HU-15.016 | (mismo archivo, 15.016) | Modificador NO |
| HU-15.018 | (mismo archivo, 15.018) | Probabilidad sobre evento |
| HU-15.019 | (mismo archivo, 15.019) | Enlace invocación entre procesos |
| HU-11.027 (referencia) | `docs/historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md` | Subtipo Condición ya existe — coordinar |

Opcional (sub-slice si tiempo alcanza):
- HU-15.020 (auto-invocación con demora) — añadir tipo `"auto-invocacion"` y campo `enlace.demora`.

## 3. Anclaje a evidencia

- **SSOT**:
  - `opm-iso-19450-es.md` — `[V-240]` axiomas de eventos, condiciones, NOT; `[V-61]` enlaces.
  - `opm-opl-es.md` — plantillas de evento, condición, negación, invocación.
  - `opm-visual-es.md` — render del badge sobre enlace.
- **opm-extracted/**:
  - `rg -i "event|invocation|negation|not.*link|invoke" opm-extracted/src/app/`.
  - `opm-extracted/src/app/models/components/` — buscar `OpmEventLink`, `OpmInvocationLink`, `OpmNotLink`.
  - `opm-extracted/src/app/models/consistency/behavioral.rules.ts` — reglas relacionadas a probabilidad y eventos.
  - Markers existentes: `assets/svg/links/procedural/` — verificar invocación zigzag canónico, evento, NOT.
- **Estado actual**:
  - `app/src/modelo/tipos.ts` — `TipoEnlace`, `Enlace`. Aquí se agregan campos.
  - `app/src/modelo/operaciones.ts` — lectura. Lógica nueva en `modificadores.ts`.
  - `app/src/opl/generar.ts` — agregar plantillas.
  - `app/src/render/jointjs/linkAssets.ts` — agregar markers si faltan.
  - `app/src/render/jointjs/JointCanvas.tsx` — badge sobre línea.

## 4. Archivos permitidos (scope estricto)

```
app/src/modelo/tipos.ts                     EDIT aditivo (TipoEnlace +"invocacion", Modificador, Enlace.modificador, Enlace.probabilidad, Enlace.demora opcional)
app/src/modelo/modificadores.ts             NUEVO (aplicar, quitar, crearInvocacion, validar)
app/src/modelo/modificadores.test.ts        NUEVO
app/src/modelo/operaciones.ts               LECTURA
app/src/serializacion/json.ts               EDIT aditivo
app/src/serializacion/json.test.ts          EDIT aditivo
app/src/opl/generar.ts                      EDIT aditivo
app/src/opl/generar.test.ts                 EDIT aditivo
app/src/render/jointjs/linkAssets.ts        EDIT aditivo (markers si faltan)
app/src/render/jointjs/JointCanvas.tsx      EDIT aditivo (badges, zigzag)
app/src/render/jointjs/factory.ts           EDIT aditivo
app/src/store.ts                            EDIT aditivo (acciones)
app/src/ui/Inspector.tsx (o partials)       EDIT aditivo (sección Modificador, sección Probabilidad si evento)
app/src/ui/Toolbar.tsx                      EDIT aditivo (botón "Crear invocación" entre procesos)
app/src/completitud.test.ts                 EDIT aditivo
assets/svg/links/procedural/                EDIT solo si falta marker canónico
```

**Prohibido**: tocar `operaciones.ts`, `validaciones.ts`, `abanicos.ts` (L2), `plegado.ts` (L5), `PanelAvisos.tsx` (L4), `Enlace.origenId/destinoId` (L1), `HANDOFF`, HU.

## 5. Restricciones de no-colisión

1. **No tocar firma de Enlace.origenId/destinoId**. L3 solo agrega campos al lado.
2. **`tipos.ts`**: agregar `Modificador`, ampliar `TipoEnlace` con `"invocacion"` (y `"auto-invocacion"` si entra al sub-slice). Agregar `Enlace.modificador?`, `Enlace.probabilidad?`, `Enlace.demora?`. Bloque al final.
3. **HU-11.027 ya define `condicion` como modificador**: si está en código, **leer y reutilizar**. Si no está, **detenerse y consultar** porque puede haber prerrequisito incumplido. Documentar el hallazgo en commit.
4. **Probabilidad solo en evento**: validar en `aplicarModificador`. Si modificador != "evento", `enlace.probabilidad` debe ser `undefined`.
5. **`crearInvocacion`** crea enlace con `tipo: "invocacion"`, ambos extremos `kind: "entidad"` con `id` apuntando a procesos. Validar que ambos sean procesos.
6. **Render zigzag invocación**: si `assets/svg/links/procedural/invocation.svg` ya existe (verificar), reutilizar. Sino, generar.

## 6. Slice mínimo shippeable

### 6.1 Modelo
- `tipos.ts`:
  ```ts
  // TipoEnlace extendido (ojo con completitud.test.ts):
  export type TipoEnlace =
    | "agente" | "instrumento" | "consumo" | "resultado" | "efecto"
    | "agregacion" | "exhibicion" | "generalizacion" | "clasificacion"
    | "invocacion"; // NUEVO

  export type Modificador = "condicion" | "evento" | "no";
  export interface Enlace {
    // ...existentes
    modificador?: Modificador;
    probabilidad?: number;     // [0,1]; solo válido si modificador === "evento"
    demora?: string;            // opcional para sub-slice auto-invocación; ej "1s"
  }
  ```

### 6.2 Operaciones (`modificadores.ts`)
```ts
export function aplicarModificador(modelo: Modelo, enlaceId: Id, modificador: Modificador): Modelo;
export function quitarModificador(modelo: Modelo, enlaceId: Id): Modelo;
export function definirProbabilidad(modelo: Modelo, enlaceId: Id, probabilidad: number): Modelo;
export function crearInvocacion(modelo: Modelo, opdId: Id, procesoOrigenId: Id, procesoDestinoId: Id): Modelo;
// sub-slice opcional:
// export function crearAutoInvocacion(modelo, opdId, procesoId, demora): Modelo;
```

Validaciones internas:
- `aplicarModificador`: rechaza modificador inválido para tipo de enlace si SSOT lo exige (ej. `evento` solo en consumo o invocación; consultar `[V-240]`).
- `definirProbabilidad`: rechaza si modificador != "evento", o si valor fuera de [0,1].
- `crearInvocacion`: rechaza si origen o destino no son procesos.

### 6.3 Serialización
- Round-trip de `modificador`, `probabilidad`, `demora`. Modelos legacy sin estos campos cargan con `modificador: undefined`.

### 6.4 OPL-ES
Plantillas nuevas o extensiones:
- Evento: `*P* es disparado por evento **O**.` (consultar plantilla canónica en `opm-opl-es.md`).
- NO: prefijo `no` en cláusula de consumo o transición. Ej. `*P* no consume **O**.`
- Invocación: `*ProcesoA* invoca *ProcesoB*.`
- Probabilidad: anexa `(probabilidad 0.7)` o equivalente al final de la oración de evento.
- Citar `[OPL-ES ...]` específica en el código y commit.

### 6.5 Render JointJS
- Badge "E" sobre línea de enlace cuando `modificador === "evento"`. Posición: punto medio del enlace, fuera de la línea.
- Badge "¬" o "NOT" cuando `modificador === "no"`.
- Badge con texto de probabilidad cerca del badge "E" si `probabilidad !== undefined`. Formato `70%`.
- Invocación: enlace con marker zigzag canónico. Reutilizar SVG si existe.
- Coexistencia con `condicion`: si HU-11.027 ya define render, no duplicar.

### 6.6 UX inspector
- Sección "Modificador" en inspector cuando enlace seleccionado:
  - Toggle entre `(ninguno) | condición | evento | NO`.
  - Si `evento`: input de probabilidad con regex `^0(\.\d+)?$|^1(\.0+)?$` o slider 0–1.
- Toolbar: botón "Crear invocación" activo cuando hay 2 procesos seleccionados o 2 procesos seleccionables consecutivamente.

### 6.7 Cross-capa
- `completitud.test.ts`:
  - `Record<TipoEnlace, true>` extendido con `invocacion: true`.
  - `Record<Modificador, true>` nuevo.
  - Si entra sub-slice `auto-invocacion`, también ahí.

## 7. Tests obligatorios

### Unit tests (estimado +12 tests)
- `modificadores.test.ts`:
  - `aplicarModificador("evento")` válido en consumo; rechaza en agregación.
  - `aplicarModificador("no")` válido en consumo, resultado, efecto.
  - `definirProbabilidad(0.7)` válido en evento; falla sin evento; falla fuera [0,1].
  - `quitarModificador` borra modificador y probabilidad.
  - `crearInvocacion` crea enlace tipo "invocacion" entre dos procesos.
  - `crearInvocacion` falla si origen no es proceso.
- `json.test.ts`:
  - Round-trip `modificador`, `probabilidad`, `demora`.
  - Modelo legacy sin modificador deserializa con `modificador: undefined`.
- `generar.test.ts`:
  - OPL evento: "es disparado por evento".
  - OPL NO: prefijo "no".
  - OPL invocación: "invoca".
  - OPL evento + probabilidad: incluye `(probabilidad 0.7)`.
- `completitud.test.ts`:
  - `Record<Modificador, true>` y `Record<TipoEnlace, true>` extendidos completos.

### Smoke browser (estimado +1 test)
- Crear enlace consumo → aplicar modificador "evento" + probabilidad 0.5 → verificar badge "E" y "50%" → OPL emergente → guardar y recargar.
- Crear enlace invocación entre dos procesos → verificar zigzag y OPL.

## 8. Verificación

```bash
cd app
bun run check          # +12 unit tests
bun run browser:smoke  # +1 smoke
bun run build          # verde
```

## 9. Decisiones bloqueadas (no reabrir)

- `Modificador` es campo opcional sobre `Enlace`, no clase aparte. Razón: consistencia con `multiplicidadOrigen` ya implementada.
- `TipoEnlace` flat (sin dimensión "naturaleza"); `invocacion` se agrega al union, infiriendo procedural.
- `probabilidad` solo en evento. Fuera de evento, undefined.
- Reutilizar `condicion` ya implementada vía HU-11.027.

## 10. Decisiones que tomás vos (documentar en commit)

- Combinaciones permitidas de modificador y tipo de enlace: definir tabla en `modificadores.ts` con cita SSOT. Documentar.
- Render del badge: text en `<text>` JointJS vs SVG marker. Elegir y documentar.
- Auto-invocación con demora (sub-slice opcional): incluir o postergar. Documentar.
- Comportamiento al cambiar tipo de enlace de proceso a estructural: descartar modificador silencioso o advertir. Documentar.

## 11. Forma del entregable

Commits sugeridos:
- `feat(modelo): tipo Modificador y campos de evento/NO/probabilidad/demora`.
- `feat(modelo): TipoEnlace +invocacion y crearInvocacion en modificadores.ts`.
- `feat(serializacion): round-trip modificador y probabilidad`.
- `feat(opl): plantillas evento, NO, invocacion`.
- `feat(render): badges E/NO y marker zigzag invocacion`.
- `feat(ui): seccion modificador y boton invocacion`.
- `test(...)` separado o integrado.

Co-author footer estándar.
