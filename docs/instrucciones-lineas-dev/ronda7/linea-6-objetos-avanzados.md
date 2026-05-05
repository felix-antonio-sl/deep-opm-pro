# Linea 6 — Objetos avanzados, designaciones de estado, plegado parcial

## 1. Mision

Cerrar EPICA-17 (avance 11.1%, 24 HU pendientes) y completar las HU restantes de EPICA-13 (estados con designaciones Inicial/Final/Default/Current y duracion temporal) y EPICA-18 (plegado parcial: persistencia, navegacion y validacion). Esta linea ataca el conjunto de **metadata semantica del objeto** — alias, unidad, descripcion enriquecida, URLs tipadas, designaciones de estado, duracion — que la SSOT prescribe canonicamente y la app aun no expone. Es la linea con mas blast en `tipos.ts`, `serializacion/json.ts`, `opl/generar.ts`, `InspectorEntidad.tsx` y `proyeccion.ts`.

**Slice minimo entregable**:

- Helper `app/src/modelo/objetoMetadata.ts` con `editarAlias`, `editarUnidad`, `editarDescripcion`, `agregarUrl`, `eliminarUrl`, `parsearNombreCompuesto` (parsea `"Temperatura [°C] {iP}"` -> `{nombre: "Temperatura", unidad: "°C", alias: "iP"}`).
- Helper `app/src/modelo/estadosDesignaciones.ts` con `designarInicial`, `designarFinal`, `designarDefault`, `designarCurrent`, `quitarDesignacion`, validaciones de exclusion (Default y Current excluyentes; Inicial+Final coexisten — HU-17.033).
- Helper `app/src/modelo/objetoDuracion.ts` con `fijarDuracion`, `validarDuracion` (min <= nominal <= max, unidad valida).
- Componentes `app/src/ui/ModalUrlsObjeto.tsx` y `app/src/ui/ModalDuracion.tsx`.
- Extension `app/src/ui/InspectorEntidad.tsx`: secciones nuevas "Descripcion" (textarea + checkbox "Mostrar mas detalles"), "Alias", "Unidad", "URLs", "Layout estados" (toggle horizontal/vertical), "Designaciones" (sub-panel cuando entidad es estado), "Duracion".
- Extension `app/src/render/jointjs/proyeccion.ts`: badges 📄 (descripcion) y 🔗 (URL) en esquinas; render compuesto `Nombre [Unidad] {alias}`; marcadores en estados (Inicial/Final/Default/Current).
- Extension `app/src/opl/generar.ts`: oraciones con alias (`tambien iP`), unidad (`[°C]`), designaciones (`es el estado inicial de`, `es el estado final de`, `es el estado por defecto de`), duracion (`${min}, ${nominal}, y ${max} ${unit} Duracion Minima, Esperada y Maxima, respectivamente.`), plegado parcial (`lista A y B como rasgos`).
- Extension `app/src/serializacion/json.ts`: campos opcionales `entidad.alias?`, `entidad.unidad?`, `entidad.descripcion?`, `entidad.urls?`, `estado.designaciones?`, `estado.duracion?`, `estado.suprimido?`, `entidad.layoutEstados?`, `apariencia.modoPlegado?`. Roundtrip lossless.
- Extension `app/src/store.ts`: acciones por dominio.

**Fuera de slice**: HU-17.014 distinguir atributos numericos de objeto (parcial — solo parser, no UI completo); HU-17.015-017 slot de valor `valueSlot.*` (requiere kernel separado para "atributo numerico"; se documenta como deuda); HU-17.022 rotar entre URLs (S, opcional dentro de slice si tiempo); HU-17.029 multiples apariencias del mismo objeto en un OPD (parcial — el modelo ya lo soporta, solo agregar test); HU-17.030 biblioteca con sufijo `de <padre>` (depende de biblioteca lateral, fuera); HU-13.014 enlaces a estado especifico (parcial — el modelo ya lo soporta con `ExtremoEnlace = { kind: "estado", id }`, refuerza con tests); HU-13.015 convertir efecto a par entrada-salida (operacion compleja, dejar fuera); HU-18.013 navegar a OPD desplegado desde plegado (S, simple, incluir si cabe).

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-17.002 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-17-canvas-objetos-avanzados.md` | Expandir Descripcion con checkbox. |
| HU-17.003 | idem | Persistir descripcion multi-linea. |
| HU-17.004 | idem | Marca 📄 en esquina del objeto. |
| HU-17.005 | idem | Tooltip con descripcion al hover. |
| HU-17.006 | idem | Ocultar 📄 sin borrar. |
| HU-17.007 | idem | Editar alias desde menu contextual. |
| HU-17.008 | idem | Render alias entre llaves. |
| HU-17.009 | idem | Alias verbalizado tras coma en OPL. |
| HU-17.010 | idem | Toggle visibilidad alias. |
| HU-17.011 | idem | Unidad fisica entre corchetes. |
| HU-17.012 | idem | Sintaxis compuesta `Nombre [Unidad] {alias}`. |
| HU-17.018 | idem | Modal Add URL Links. |
| HU-17.019 | idem | URL tipada. |
| HU-17.020 | idem | Marca 🔗 cuando tiene URL. |
| HU-17.021 | idem | Abrir URL al clic. |
| HU-17.023 | idem | Eliminar fila URL. |
| HU-17.027 | idem | OPL plegado parcial "lista A y B como rasgos". |
| HU-17.028 | idem | Navegar a OPD desplegado (refuerza ronda 6). |
| HU-17.033 | idem | Inicial + Final simultaneos en mismo estado. |
| HU-17.034 | idem | Duracion con unidad + min/nominal/max. |
| HU-13.007 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-13-canvas-estados.md` | Suprimir estado no conectado. |
| HU-13.010 | idem | Designar Inicial. |
| HU-13.011 | idem | Designar Final. |
| HU-13.012 | idem | Designar Default. |
| HU-13.013 | idem | Designar Current con eco simulacion. |
| HU-13.019 | idem | Alinear estados horizontal/vertical. |
| HU-18.011 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-18-canvas-plegado-parcial.md` | Persistir vista plegado por OPD. |
| HU-18.013 | idem | Navegar a OPD desplegado desde plegado (opcional). |
| HU-18.014 | idem | Bloquear plegado parcial sin partes. |
| HU-18.015 | idem | Preservar orden compacto. |

## 3. Anclaje a evidencia

- **SSOT**:
  - `opm-iso-19450-es.md §Glos 3.7 alias`, `§Glos 3.4 atributo` (unidad), `§Glos 3.68 estado`, `§Glos 3.71a designaciones` (Inicial/Final/Default/Current), `§Glos 3.81 despliegue`.
  - `opm-visual-es.md V-1` (objeto basico), `V-4` (estado inicial — linea de entrada), `V-5` (estado final — linea de salida), `V-6` (estado default — borde grueso), `V-237` (axioma >=2 estados), `V-238` (estados como capsulas), `V-95` (multiples apariencias misma entidad), `V-163` (slot de valor).
  - `opm-opl-es.md D5` (`X es el estado inicial de Y`), `D6` (`X es el estado final de Y`), `D7` (`X es el estado por defecto de Y`), `D8` (`Y puede ser X1, X2 o X3`), `T1-T3`, `TS1` (despliegue), `TS3` (transicion entre estados), [JOYAS §9 duracion]: formato canonico `${min}, ${nominal}, y ${max} ${unit} Duracion Minima, Esperada y Maxima, respectivamente.`, `JOYAS §1` colores cosa (verde lima objeto / cyan proceso / gris estados), `JOYAS §10` capsulas estado.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/LogicalPart/components/aliasing-module.ts` lineas 5-33: `AliasingModule.getText()` render `{alias}`, `isActive()` con settings (Show only when applicable / Always show). Patron exacto para HU-17.008 + HU-17.010.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/LogicalPart/components/units-text-module.ts` lineas 5-32: `UnitsTextModule.getText()` render `[units]`. Patron para HU-17.011/.012.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/commands/edit-alias.ts` lineas 5-42: `EditAliasCommand`, `EditAliasAction.act()` -> `cell.editAliasPopup()`. Patron de comando + popup.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/commands/edit-units.ts` analogo.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/DrawnPart/components/alias/alias.popup.ts` lineas 5-60: `aliasValidation()` (no reservadas, no espacios/_, no .), `AliasPopup` con keypress Enter y boton Update. Patron de validacion para HU-17.007.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/commands/set-process-time-duration.ts` lineas 5-46: `SetProcessTimeDurationCommand`, abre `getDurationManager()` popup con digits setting. Patron para HU-17.034 / `ModalDuracion`.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/commands/set-state-time-duration.ts` analogo para estados.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/DrawnPart/OpmObject.ts` linea 5469 `OpmState`, linea 5425 `URLarray` getter/setter, lineas 1816-1875 `descriptionStatus` field + defaultDescriptionStatus (visible / hidden). Patron para HU-17.003-006 + HU-17.018-023.
  - Iconos: usar emoji `📄` y `🔗` o equivalente del corpus si hay (`assets/svg/`); revisar y decidir.
- **Estado actual del codigo (post-ronda 6)**:
  - `app/src/modelo/tipos.ts` (158 LOC) tiene `entidad`, `estado`, `apariencia`, `enlace` con campos basicos (nombre, color, etc.). Aditivo masivo (varios `?` opcionales).
  - `app/src/modelo/operaciones.ts` (1743 LOC, congelado): no tocar; nuevas operaciones viven en `objetoMetadata.ts`, `estadosDesignaciones.ts`, `objetoDuracion.ts`.
  - `app/src/render/jointjs/proyeccion.ts` (1116 LOC) ya proyecta apariencias y enlaces. Aditivo: badges en esquinas, render compuesto `Nombre [Unidad] {alias}`, marcadores de designacion sobre capsulas estado.
  - `app/src/opl/generar.ts` (988 LOC) emite oraciones canonicas. Aditivo: incluir alias, unidad, designaciones, duracion, plegado parcial.
  - `app/src/serializacion/json.ts` ya hidrata campos opcionales con defaults; aditivo: agregar campos nuevos como opcionales.
  - `app/src/ui/InspectorEntidad.tsx` (522 LOC) edita nombre, color, esencia, afiliacion, multiplicidad, posicion. Aditivo: nuevas secciones para descripcion/alias/unidad/URLs/designaciones/duracion/layoutEstados.

## 4. Archivos permitidos

```text
app/src/modelo/tipos.ts                          EDIT aditivo (campos opcionales nuevos)
app/src/modelo/objetoMetadata.ts                 NUEVO
app/src/modelo/objetoMetadata.test.ts            NUEVO
app/src/modelo/estadosDesignaciones.ts           NUEVO
app/src/modelo/estadosDesignaciones.test.ts      NUEVO
app/src/modelo/objetoDuracion.ts                 NUEVO
app/src/modelo/objetoDuracion.test.ts            NUEVO
app/src/modelo/operaciones.ts                    LECTURA o wrapper minimo (NO crecer)
app/src/render/jointjs/proyeccion.ts             EDIT aditivo (badges, render compuesto, marcadores estado)
app/src/render/jointjs/proyeccion.test.ts        EDIT aditivo
app/src/opl/generar.ts                           EDIT aditivo (alias, unidad, designaciones, duracion, plegado)
app/src/opl/generar.test.ts                      EDIT aditivo
app/src/serializacion/json.ts                    EDIT aditivo (campos opcionales)
app/src/serializacion/json.test.ts               EDIT aditivo (roundtrip lossless)
app/src/persistencia/local.ts                    LECTURA (sin cambios estructurales — usa serializacion JSON)
app/src/store.ts                                 EDIT aditivo (slice "Objetos avanzados / estados / plegado" al final)
app/src/store.test.ts                            EDIT aditivo
app/src/ui/InspectorEntidad.tsx                  EDIT aditivo masivo (secciones nuevas)
app/src/ui/ModalUrlsObjeto.tsx                   NUEVO
app/src/ui/ModalDuracion.tsx                     NUEVO
app/src/ui/MenuPrincipal.tsx                     EDIT aditivo (entradas en menu contextual de cosa)
app/src/ui/Toolbar.tsx                           EDIT aditivo (toggles "Mostrar alias" / "Mostrar descripciones")
app/src/ui/App.tsx                               EDIT aditivo (montar ModalUrlsObjeto, ModalDuracion)
app/e2e/opm-smoke.spec.ts                        EDIT aditivo
opm-extracted/**                                 LECTURA
docs/JOYAS.md                                    LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar `app/src/canvas/seleccionMultiple.ts`, `operacionesBatch.ts` (territorio L1). Esta linea consume `seleccionados: Id[]` (si L1 mergeo, orden sugerido: si) para batch styling/aliasing si tiempo permite, pero el slice minimo no requiere multi-seleccion para alias/unidad/descripcion (es 1 entidad a la vez).
- No tocar `app/src/render/jointjs/mapaSistema.ts`, `mapaExport.ts`, `MapaSistema.tsx`, `MapaPanelEstadisticas.tsx`, `MapaFiltros.tsx` (territorio L2). El render del mapa no muestra alias/badges (es vista neutra).
- No tocar `app/src/store/pestanas.ts`, `BarraPestanas.tsx`, `opl/bloquesJerarquicos.ts`, `PanelOpl.tsx` (territorio L3). El generador OPL es de esta linea (`opl/generar.ts`), pero `PanelOpl.tsx` solo lee oraciones; no requiere cambios aqui.
- No tocar `app/src/persistencia/movimientoModelos.ts`, `versiones.ts`, `DialogoBuscarGlobal.tsx`, `DialogoVersiones.tsx`, `DialogoArchivados.tsx`, `PanelCarpetas.tsx`, `DialogoCargarModelo.tsx` (territorio L4). El menu contextual de cosa puede agregar item "Versiones..." apuntando a accion de L4 si esta presente, pero no es obligatorio.
- No tocar `app/src/ui/atajosTeclado.ts`, `divisorPanel.tsx`, `MenuContextualArbol.tsx`, `ArbolOpd.tsx`, `CheatsheetAtajos.tsx` (territorio L5). Esta linea **registra atajos** locales del modal URL/Duracion (Esc cierra, Enter confirma) usando el registry si esta disponible; si L5 no mergeo, usa `addEventListener` directo. Coordinacion: registrar via `registrarAtajo({ combo: "Escape", ctx: "modal-input", ...})` cuando registry presente.
- No tocar `app/src/render/jointjs/JointCanvas.tsx`. Los gestos de canvas siguen igual; los modales se invocan desde `Inspector` y menu contextual.
- No tocar `app/src/modelo/operaciones.ts` (1743 LOC). Nuevas operaciones viven en helpers nuevos.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
- No introducir libreria de validacion (usar funciones puras).

## 6. Slice minimo shippeable

### Modelo

`tipos.ts` (aditivo, todos opcionales):

```ts
export interface Entidad {
  // ... campos existentes
  alias?: string;
  unidad?: string;                                    // ej. "°C", "kg/s", libre o catalogo
  descripcion?: string;                                // multilinea preservada
  urls?: UrlObjetoTipada[];                           // ordenadas
  layoutEstados?: "horizontal" | "vertical";          // default segun apariencia (lo que ronda 5/6 hace ya)
}

export interface UrlObjetoTipada {
  id: Id;
  url: string;
  tipo: "imagen" | "video" | "articulo" | "texto" | "oslc";
}

export interface Estado {
  // ... campos existentes (id, nombre, entidadId)
  designaciones?: DesignacionEstado[];                 // array, vacio = sin designaciones
  duracion?: DuracionTemporal;
  suprimido?: boolean;                                  // default false
}

export type DesignacionEstado = "inicial" | "final" | "default" | "current";

export interface DuracionTemporal {
  unidad: UnidadTiempo;
  min: number;
  nominal: number;
  max: number;
}

export type UnidadTiempo = "ms" | "s" | "min" | "h" | "dia" | "sem" | "mes" | "año";

export interface Apariencia {
  // ... campos existentes
  modoPlegado?: "plegado" | "parcial" | "desplegado"; // default segun ronda existente
  ordenPartes?: "alfabetico" | "creacion";            // HU-18.015
}
```

### Helpers de dominio

`modelo/objetoMetadata.ts` (nuevo):

```ts
export function editarAlias(modelo: Modelo, entidadId: Id, alias: string): Resultado<Modelo>;
export function editarUnidad(modelo: Modelo, entidadId: Id, unidad: string): Resultado<Modelo>;
export function editarDescripcion(modelo: Modelo, entidadId: Id, descripcion: string): Resultado<Modelo>;

export function agregarUrl(modelo: Modelo, entidadId: Id, url: UrlObjetoTipada): Resultado<Modelo>;
export function eliminarUrl(modelo: Modelo, entidadId: Id, urlId: Id): Resultado<Modelo>;
export function reordenarUrls(modelo: Modelo, entidadId: Id, idsOrdenados: Id[]): Resultado<Modelo>;

export interface NombreCompuesto {
  nombre: string;
  unidad?: string;
  alias?: string;
}

export function parsearNombreCompuesto(input: string): NombreCompuesto;
export function formatearNombreCompuesto(parts: NombreCompuesto): string;          // produce "Temperatura [°C] {iP}"

export function validarAlias(alias: string): Resultado<void>;                       // sin espacios, sin _, sin .
export function validarUnidad(unidad: string): Resultado<void>;                     // texto libre, max 20 chars, sin saltos
export function validarUrl(url: string): Resultado<void>;                           // URL absoluta http/https/data/file
```

Reglas:
- `parsearNombreCompuesto("Temperatura [°C] {iP}")` -> `{ nombre: "Temperatura", unidad: "°C", alias: "iP" }`. El parser tolera variantes con espacios y orden alterno (`{alias} [unidad] nombre` no soportado — solo el orden canonico).
- `formatearNombreCompuesto({ nombre: "Temperatura" })` -> `"Temperatura"`. Si `unidad` y `alias` presentes, format completo.
- `editarAlias` valida con `validarAlias`; si invalido, retorna error.
- Roundtrip lossless: `formatear(parsear(s)) === s` para inputs validos.

`modelo/estadosDesignaciones.ts` (nuevo):

```ts
export function designarInicial(modelo: Modelo, estadoId: Id): Resultado<Modelo>;
export function designarFinal(modelo: Modelo, estadoId: Id): Resultado<Modelo>;
export function designarDefault(modelo: Modelo, estadoId: Id): Resultado<Modelo>;
export function designarCurrent(modelo: Modelo, estadoId: Id): Resultado<Modelo>;
export function quitarDesignacion(modelo: Modelo, estadoId: Id, designacion: DesignacionEstado): Resultado<Modelo>;

export function suprimirEstado(modelo: Modelo, estadoId: Id): Resultado<Modelo>;          // HU-13.007
export function restaurarEstado(modelo: Modelo, estadoId: Id): Resultado<Modelo>;
```

Reglas:
- `designarInicial` agrega "inicial" al array. **Coexiste con "final"** (HU-17.033) — no exclusion.
- `designarFinal` analogo.
- `designarDefault`: solo UN estado por entidad puede ser default. Si ya existe otro, **lo reemplaza automaticamente** (HU-13.012).
- `designarCurrent`: solo UNO por entidad. Reemplaza si ya existe.
- **Exclusion Default <-> Current**: si un estado tiene "default", `designarCurrent` falla con error explicito (HU-13.013, Q13.2 -> bloqueante). Para hacer el cambio, primero `quitarDesignacion(default)`.
- `suprimirEstado` solo si el estado no tiene enlaces incidentes (HU-13.007). Setea `estado.suprimido = true`. El estado sigue apareciendo en OPL D8 (la supresion es de render, no semantica).

`modelo/objetoDuracion.ts` (nuevo):

```ts
export function fijarDuracion(modelo: Modelo, estadoId: Id, dur: DuracionTemporal): Resultado<Modelo>;
export function quitarDuracion(modelo: Modelo, estadoId: Id): Resultado<Modelo>;
export function validarDuracion(dur: DuracionTemporal): Resultado<void>;
```

Reglas:
- `validarDuracion`: `min >= 0`, `nominal >= min`, `max >= nominal`, `unidad` en lista valida.
- `fijarDuracion` valida y aplica.

### Render

`proyeccion.ts` (aditivo):

- Render label compuesto: `${nombre}${unidad ? ` [${unidad}]` : ""}${alias && uiAliasVisibles ? ` {${alias}}` : ""}`.
- Badge 📄 en esquina superior derecha cuando `entidad.descripcion?.length && uiDescripcionesVisibles`. Usar emoji o svg interno. Tooltip al hover via `<title>` SVG nativo o overlay propio.
- Badge 🔗 en esquina superior izquierda cuando `entidad.urls?.length`. Click sobre badge abre primera URL en nueva pestana via `window.open(url, "_blank", "noopener,noreferrer")`.
- Marcadores de estado:
  - **Inicial** (V-4): linea de entrada (flecha o triangulo) en lado izquierdo de la capsula.
  - **Final** (V-5): linea de salida (cuadrado pequeno) en lado derecho.
  - **Default** (V-6): borde grueso (3 px) sobre la capsula del estado.
  - **Current**: anillo verde (color simulacion) alrededor de la capsula.
- Estado **suprimido**: capsula no se renderiza (omitir el cell).
- `entidad.layoutEstados`: si "vertical", redistribuir capsulas verticalmente dentro del rectangulo objeto (existe ronda 5? — verificar; aditivo si no existe). Si "horizontal", layout actual.

`proyeccion.test.ts` (aditivo): asegurar que apariencia con `entidad.alias = "iP"` y `uiAliasVisibles = true` produce label `"Nombre {iP}"`; con visible false -> sin alias. Idem unidad y descripcion.

### OPL

`generar.ts` (aditivo):

- Para cada entidad con `alias`, agregar "tambien iP" tras la primera mencion en cada oracion (HU-17.009): `**Conductor**, tambien iP, maneja *Conducir*.` cuando `uiAliasVisibles && incluirAliasEnOpl`. Decidir: incluir siempre o solo cuando settings activa. Recomendado: siempre (alias es semantico — es nombre alternativo canonico).
- Para entidad atributo con `unidad`, formato `**Atributo** es valor [°C].` (HU-17.016 plantilla parcial — el slot de valor `valueSlot` no se introduce, "valor" es placeholder textual).
- Para estados con designaciones:
  - "inicial" -> emit oracion adicional `\`estado1\` es el estado inicial de **Objeto**.` (D5).
  - "final" -> `\`estadoN\` es el estado final de **Objeto**.` (D6).
  - "default" -> `\`estadoX\` es el estado por defecto de **Objeto**.` (D7).
  - "current" -> oracion lente derivada: `\`estadoY\` es el estado actual de **Objeto**.` (no en D5-D7 canonicos; documentar como propuesta).
- Para estado con `duracion`, emitir oracion canonica:
  - `${min}, ${nominal}, y ${max} ${unit} Duracion Minima, Esperada y Maxima de \`${nombreEstado}\`, respectivamente.` ([JOYAS §9]).
- Plegado parcial (HU-17.027): `**Padre** lista **A** y **B** como rasgos.` cuando `apariencia.modoPlegado === "parcial"`.
- Plegado parcial con N>=3 partes: `**Padre** lista **A**, **B** y N partes mas.` (HU-18.010).

### Serializacion

`json.ts` (aditivo):

- Hidratar `entidad.alias?: string` opcional, default `undefined`.
- `entidad.unidad?: string`, `entidad.descripcion?: string`, `entidad.urls?: UrlObjetoTipada[]`, `entidad.layoutEstados?: "horizontal" | "vertical"`.
- `estado.designaciones?: DesignacionEstado[]`, `estado.duracion?: DuracionTemporal`, `estado.suprimido?: boolean`.
- `apariencia.modoPlegado?`, `apariencia.ordenPartes?`.
- Roundtrip lossless: cargar JSON sin estos campos no falla; valores default `undefined`/`false`.

### Store

```ts
// Bloque "Objetos avanzados / estados / plegado" (al final)
uiAliasVisibles: boolean;                  // default true
uiDescripcionesVisibles: boolean;          // default true

modalUrlsAbierto: { entidadId: Id } | null;
modalDuracionAbierto: { estadoId: Id } | null;

editarAliasEntidad(entidadId: Id, alias: string): void;
editarUnidadEntidad(entidadId: Id, unidad: string): void;
editarDescripcionEntidad(entidadId: Id, descripcion: string): void;

abrirModalUrls(entidadId: Id): void;
cerrarModalUrls(): void;
agregarUrlAEntidad(entidadId: Id, url: UrlObjetoTipada): void;
eliminarUrlDeEntidad(entidadId: Id, urlId: Id): void;

designarEstadoComo(estadoId: Id, designacion: DesignacionEstado): void;
quitarDesignacionEstado(estadoId: Id, designacion: DesignacionEstado): void;
suprimirEstadoPorId(estadoId: Id): void;
restaurarEstadoPorId(estadoId: Id): void;

abrirModalDuracion(estadoId: Id): void;
cerrarModalDuracion(): void;
fijarDuracionEstado(estadoId: Id, dur: DuracionTemporal): void;
quitarDuracionEstado(estadoId: Id): void;

fijarLayoutEstadosEntidad(entidadId: Id, layout: "horizontal" | "vertical"): void;
fijarModoPlegadoApariencia(apariencaId: Id, modo: "plegado" | "parcial" | "desplegado"): void;
fijarOrdenPartesApariencia(apariencaId: Id, orden: "alfabetico" | "creacion"): void;

toggleUiAliasVisibles(): void;
toggleUiDescripcionesVisibles(): void;
```

### UX

`InspectorEntidad.tsx` (aditivo masivo) — agregar secciones colapsables:

- **Descripcion** (siempre visible): textarea (max 1000 chars). Checkbox "Mostrar mas detalles" (HU-17.002) que expande la textarea (max 5000). Boton "Guardar" o save-on-blur. Boton "Limpiar".
- **Alias**: input de 1 linea con validacion (placeholder `"ej. iP"`); boton "Aplicar". Si `uiAliasVisibles === false`, mostrar nota.
- **Unidad** (visible solo si entidad es atributo o el usuario explicita): input 1 linea, max 20 chars (`"ej. °C, kg/s"`).
- **URLs**: lista compacta con `tipo + url` (max 3 visibles); boton "Gestionar URLs..." abre `ModalUrlsObjeto`.
- **Layout estados** (visible si entidad tiene `>=2` estados): toggle horizontal/vertical (HU-13.019).
- **Designaciones del estado** (visible solo cuando `entidad` es estado): lista de checkboxes `Inicial / Final / Default / Current` con validaciones (Default + Current excluyentes). HU-17.033 permite Inicial+Final.
- **Duracion del estado** (visible cuando entidad es estado): boton "Configurar duracion..." abre `ModalDuracion`. Si ya hay duracion, mostrar resumen `min, nom, max [unit]` + boton "Editar" / "Quitar".
- **Suprimir estado** (visible cuando entidad es estado y sin enlaces): boton toggle "Suprimir" / "Restaurar".

Slot estable `data-testid="inspector-entidad-acciones"` que L1 dejo se mantiene; L6 lo puebla con sus acciones (URL, Duracion).

`ModalUrlsObjeto.tsx` (nuevo):

- Modal central con titulo "URLs de '<nombre entidad>'".
- Tabla: tipo (dropdown imagen/video/articulo/texto/oslc), url (input), accion eliminar.
- Boton "Agregar URL" agrega fila vacia.
- Boton "Cerrar" persiste cambios (debounced o on save).
- `data-testid="modal-urls-objeto"`.

`ModalDuracion.tsx` (nuevo):

- Modal central con titulo "Duracion de '<nombre estado>'".
- Inputs: unidad (dropdown), min, nominal, max.
- Validacion en vivo: `min <= nominal <= max`.
- Boton "Aplicar" valida y persiste; "Cancelar" cierra sin cambios; "Quitar" elimina la duracion.
- `data-testid="modal-duracion"`.

`MenuPrincipal.tsx` (aditivo) — items contextuales sobre cosa seleccionada:
- "Editar alias..." (atajo desde Inspector tambien).
- "Agregar URL...".
- "Agregar descripcion..." (cuando sin descripcion existente).
- "Agregar estados" (HU-13.001 ya existe).
- "Designar inicial/final/default/current" (cuando entidad es estado).

`Toolbar.tsx` (aditivo): toggles "Mostrar alias" y "Mostrar descripciones" con iconos (ojo + letra A para alias, ojo + 📄 para descripcion). Estado de los toggles persiste en `WorkspaceIndice.preferenciasUi` (gestionado por L5 si presente, o ad-hoc local).

`App.tsx` (aditivo): montar `<ModalUrlsObjeto />` y `<ModalDuracion />` controlados por flags del store.

### Cross-capa

- L1 multi-seleccion: si presente (orden de merge L1 antes de L6), las acciones de Inspector pueden tener "Aplicar a seleccion" para alias/descripcion en batch (opcional dentro de slice). El slot `data-testid="inspector-entidad-acciones"` se respeta.
- L2 mapa: la vista mapa NO muestra alias/badges (es vista neutra). Confirmado.
- L3 multi-pestana: cada pestana tiene su propio modelo; alias/URLs no cruzan pestanas.
- L4 workspace: las versiones (snapshots) preservan los campos opcionales nuevos.
- L5 atajos: el modal URL/Duracion registra atajos locales `Esc` (cerrar) y `Enter` (confirmar) usando el registry si esta disponible.

## 7. Tests obligatorios

- Unit `objetoMetadata.test.ts`:
  - `editarAlias` valida sin espacios, sin `_`, sin `.`.
  - `parsearNombreCompuesto("Temperatura [°C] {iP}")` -> `{ nombre, unidad, alias }`.
  - `formatear(parsear(s)) === s` para inputs canonicos.
  - `agregarUrl` con tipo invalido falla; con valido agrega.
  - `eliminarUrl` quita; `reordenarUrls` valida que `idsOrdenados` contiene exactamente los presentes.
- Unit `estadosDesignaciones.test.ts`:
  - `designarInicial` agrega "inicial"; idempotente.
  - `designarFinal` coexiste con "inicial" (HU-17.033) — array `["inicial", "final"]`.
  - `designarDefault` reemplaza otro default si existe; deja Default unico por entidad.
  - `designarCurrent` con default presente -> error (HU-13.013 Q13.2).
  - `designarCurrent` con default ausente -> ok; reemplaza Current previo.
  - `quitarDesignacion` con designacion ausente -> no-op.
  - `suprimirEstado` con enlaces incidentes -> error; sin enlaces -> setea suprimido.
- Unit `objetoDuracion.test.ts`:
  - `validarDuracion({min: 0, nominal: 5, max: 10, unidad: "s"})` ok.
  - `min > nominal` -> error.
  - `nominal > max` -> error.
  - `unidad: "fortnights"` -> error.
- Unit serializacion: roundtrip lossless con todos los campos opcionales nuevos. Modelo legacy sin `alias/unidad/descripcion/urls/designaciones/duracion/suprimido/layoutEstados/modoPlegado` carga sin error y campos quedan `undefined`.
- Unit OPL `generar.test.ts`:
  - Entidad con `alias: "iP"`: oraciones incluyen "tambien iP" tras primera mencion.
  - Entidad atributo con `unidad: "°C"`: oracion `**X** es valor [°C].`.
  - Estado con `["inicial"]`: emit `\`X\` es el estado inicial de **Y**.`.
  - Estado con `["inicial", "final"]`: emit ambas oraciones.
  - Estado con `duracion: {unidad: "s", min: 1, nominal: 5, max: 10}`: emit oracion canonica de duracion.
  - Plegado parcial con 2 partes: `**Padre** lista **A** y **B** como rasgos.`; con 5 partes: `**Padre** lista **A**, **B** y 3 partes mas.`.
- Render `proyeccion.test.ts`:
  - Label compuesto `Nombre [Unidad] {alias}` con todos presentes.
  - Badge `📄` aparece cuando `descripcion` no vacia y `uiDescripcionesVisibles`.
  - Badge `🔗` aparece cuando `urls.length >= 1`.
  - Estado con designacion "inicial" tiene marcador V-4.
  - Estado suprimido no se renderiza.
- Store: `editarAliasEntidad` invoca el helper; `agregarUrlAEntidad` agrega; `designarEstadoComo("default")` reemplaza default previo.
- Component/UI: Inspector muestra todas las secciones; modal URL agrega/elimina; modal Duracion valida en vivo.
- Smoke browser: cargar modelo demo; seleccionar objeto, abrir Inspector, agregar descripcion "Test", verificar `📄` en canvas, hover muestra tooltip; editar alias "iP", verificar `Nombre {iP}`; agregar URL imagen `https://example.com/img.png`, verificar `🔗`, click abre nueva pestana; seleccionar estado, designar inicial, verificar marcador; configurar duracion 1/5/10 s, verificar OPL.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- Todos los campos nuevos son **opcionales** en JSON. Modelos legacy hidratan sin error con valores `undefined` o defaults seguros.
- Alias va en oracion OPL siempre tras primera mencion (HU-17.009); la visibilidad UI (`uiAliasVisibles`) controla solo el render canvas, no el OPL.
- Designaciones Default y Current son **excluyentes** (HU-13.013 Q13.2 -> bloqueante).
- Designaciones Inicial y Final **coexisten** (HU-17.033).
- Default y Current son **unicos por entidad** (un solo estado por entidad puede ser default; uno solo current).
- `suprimirEstado` requiere ausencia de enlaces incidentes; OPL D8 sigue listando el estado (la supresion es de render).
- Duracion canonica formato OPL [JOYAS §9] no se altera.
- Sin slot de valor `valueSlot.*` (HU-17.015-017 fuera) — el OPL emite "valor" como placeholder textual.
- Modal URL acepta cualquier URL absoluta (`http`, `https`, `data:`, `file:`); validacion strict puede bloquear casos legitimos — relax a "no vacio + tiene `:` y `/`" si validador completo es muy restrictivo.
- Marcadores de estado siguen V-4/V-5/V-6 SSOT; Current no esta en SSOT canonico — aplicar anillo verde como propuesta documentada.
- Plegado parcial OPL truncado: hasta 3 partes inline + "y N partes mas" (HU-18.010, parcial — Q18.2).
- HU-17.014/.015-017 slot de valor numerico fuera de slice — documentar deuda explicita.
- HU-13.014 enlaces a estado especifico ya cubierto por modelo `ExtremoEnlace { kind: "estado" }` (ronda 1-5); aqui solo se asegura que las designaciones interactuan correctamente con esos enlaces (test).

## 10. Decisiones que tomas vos (documentar en commit)

- Si el badge `📄` y `🔗` usan emoji o svg de `assets/svg/`. Recomendado: revisar assets/, si existen iconos relevantes usarlos; si no, emoji para velocidad.
- Si "Mostrar/Ocultar alias" es preferencia per-OPD o global. Recomendado: global (consistente con OPCloud).
- Si la URL se abre en pestana nueva siempre o respeta target. Recomendado: pestana nueva con `noopener,noreferrer`.
- Si Default reemplaza silenciosamente o pide confirmacion. Recomendado: silente con toast informativo.
- Si Current cuando ya hay Default lanza dialogo o falla. Recomendado: falla con error explicito (mas seguro para simulacion futura).
- Si layout estados horizontal/vertical aplica a todos los estados de la entidad o por estado. Recomendado: por entidad (consistente con SSOT).
- Si modoPlegado se serializa por apariencia o por entidad. Recomendado: por apariencia (HU-18.011 explicita "por OPD").
- Si la duracion tiene presets (`muy corta / corta / media / larga`) o solo input numerico. Recomendado: solo numerico para precision.
- Si la unidad de atributo tiene autocomplete. Recomendado: no en MVP (HU-17.011 Q17.1 abierto sobre catalogo).
- Si Inspector muestra todas las secciones siempre o las oculta cuando vacias. Recomendado: ocultas hasta primera edicion + boton "Agregar".

## 11. Forma del entregable

Commits sugeridos:

- `feat(modelo): introduce alias unidad descripcion y urls tipadas en entidad`
- `feat(modelo): designaciones de estado inicial final default current con exclusiones`
- `feat(modelo): duracion temporal con min nominal max y unidad por estado`
- `feat(render): badges descripcion url y render compuesto Nombre [Unidad] {alias}`
- `feat(render): marcadores de estado inicial final default current sobre capsulas`
- `feat(opl): emite alias unidad designaciones duracion y plegado parcial`
- `feat(ui): inspector con secciones descripcion alias unidad urls layout designaciones duracion`
- `feat(ui): modales gestionar urls y configurar duracion del estado`
- `test(metadata): cubre alias unidad parser urls designaciones y duracion roundtrip`

Co-author footer estandar si aplica al implementador externo. No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas, HU parcialmente cubiertas (HU-17.014/.015-017 slot de valor diferidos como deuda explicita; HU-17.022 rotar URLs opcional; HU-17.029-030 multi-apariencia y biblioteca con sufijo fuera) y bloqueos. Si descubris bug fuera de scope al implementar, entregar como patch a `/tmp/`.
