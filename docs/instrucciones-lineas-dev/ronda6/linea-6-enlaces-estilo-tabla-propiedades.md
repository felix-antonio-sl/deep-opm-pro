# Linea 6 — Estilo completo, tabla y propiedades de enlaces

## 1. Mision

Cerrar la dimension de "afinado visual del modelo" que L6 ronda 5 inauguro con `Apariencia.estilo?`: agregar estilado de texto sobre cosas (familia, tamano, peso, color, alineacion), estilado completo de enlaces (color, grosor, patron, copy/paste, reset), multiplicidad de enlace (origen y destino, canonica + custom), vertices manuales (insertar, reposicionar, reanclar extremo), borrado en lote y la Tabla de Enlaces global con filtros, ordenamiento, edicion in-place y navegacion al canvas. OPL invariante: ningun cambio de estilo o multiplicidad altera el texto OPL emitido salvo cuando la propia HU lo dicte (multiplicidad si entra al verbo OPL segun §12).

**Slice minimo entregable**: tres modulos de dominio nuevos (`enlaceMultiplicidad.ts`, `enlaceEstilo.ts`, `enlaceVertices.ts`) con helpers puros + tests; reescritura aditiva de `InspectorEnlace.tsx` para integrar multiplicidad/estilo/etiqueta canonica/copy-paste-reset estilo; ampliacion de `InspectorEntidad.tsx` para estilo de texto del rotulo; ampliacion de `StyleControls.tsx` para texto y copy/paste enlaces; nuevo `TablaEnlaces.tsx` con vista global, columnas, filtros, ordenamiento, navegacion y edicion in-place; ampliacion de `proyeccion.ts` (via helper) para aplicar estilo enlace y exponer vertices manuales; entrada "Tabla de enlaces" en `MenuPrincipal.tsx`; serializacion lossless de `enlace.estilo`, `enlace.multiplicidadOrigen`, `enlace.multiplicidadDestino`, `aparienciaEnlace.vertices` (si no existe ya), y `apariencia.estilo` extendido para texto; tests por capa.

**Fuera de slice**: HU-14.009 (posicionamiento manual texto X/Y); HU-14.016 (multi-seleccion bloqueada por HU-SHARED-008 fuera de roadmap); HU-11.026 (tabla de tipos extendida con familias O/O/O/P/P/O/P/P); HU-11.027 (subtipo Condicion/Evento + modificador NOT); HU-11.007 (multi-seleccion conectar al todo); HU-11.008 (alinear enlaces); HU-16.022 ("Apply to all similar"); HU-15.* (multiplicidad mas alla de origen/destino tipico). Estilado de fondo de OPD, defaults globales por organizacion (EPICA-81) y plantillas quedan fuera.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-14.004 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-14-canvas-styling.md` | Familia tipografica del rotulo. |
| HU-14.005 | idem | Tamano de tipografia. |
| HU-14.006 | idem | Negrita / cursiva. |
| HU-14.007 | idem | Color del texto del rotulo. |
| HU-14.008 | idem | Alineacion del texto. |
| HU-14.012 | idem | Patron de trazo del enlace. |
| HU-14.013 | idem | Copy Style sobre enlace. |
| HU-14.014 | idem | Paste Style sobre enlace. |
| HU-14.015 | idem | Reset estilo (consolidar para enlaces — apariencia ya cubierta ronda 5). |
| HU-14.017 | idem | Persistir overrides de estilo (ampliar a enlace y texto). |
| HU-16.001 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-16-canvas-enlaces-propiedades.md` | Abrir Tabla de Enlaces global. |
| HU-16.002 | idem | Listar todos los enlaces. |
| HU-16.003 | idem | Columnas Origen/Destino/Tipo/Etiqueta/Multiplicidad. |
| HU-16.004 | idem | Filtrar por tipo. |
| HU-16.005 | idem | Ordenar por columna. |
| HU-16.006 | idem | Navegar al enlace en canvas. |
| HU-16.007 | idem | Editar in-place desde la tabla. |
| HU-16.010 | idem | Etiqueta canonica de lista para enlace etiquetado. |
| HU-16.012 | idem | Multiplicidad canonica selector. |
| HU-16.013 | idem | Multiplicidad custom con validacion. |
| HU-16.014 | idem | Multiplicidad destino. |
| HU-16.015 | idem | Panel de estilo del enlace. |
| HU-16.016 | idem | Cambiar color del enlace. |
| HU-16.017 | idem | Cambiar grosor. |
| HU-16.018 | idem | Cambiar patron de trazo. |
| HU-16.021 | idem | Reset estilo enlace. |
| HU-11.015 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md` | Configurar multiplicidad origen/destino. |
| HU-11.018 | idem | Insertar vertice por click sobre la linea. |
| HU-11.019 | idem | Reposicionar vertice arrastrandolo. |
| HU-11.020 | idem | Reanclar extremo del enlace. |
| HU-11.023 | idem | Borrar varios enlaces seleccionados. |
| HU-11.025 | idem | Iniciar enlace desde zona de borde con handles. |

## 3. Anclaje a evidencia

- **SSOT**:
  - `opm-iso-19450-es.md` glosario 3.60 multiplicidad; `opm-opl-es.md` §12 fija como aparece la multiplicidad en OPL ("**A** consume m..n **B**").
  - `opm-visual-es.md` V-1, V-61, V-63, V-129, V-239, V-240. V-63 declara los colores como informativos (la paleta no es normativa, pero el styling no debe romper las convenciones de afiliacion/esencia).
  - `metodologia-opm-es.md` §15 invariantes (estilo no altera modelo logico).
  - `opm-opl-es.md` Ap. A roundtrip: OPL es invariante a estilo visual (HU-14.017).
- **Corpus interno reusable**:
  - `opm-extracted/MODULES.md` lista `src/app/dialogs/style-element-dialog/`, `src/app/dialogs/styleCopyingDialog/`, `src/app/models/components/properties/multiplicity*` y `src/app/dialogs/links-table/links-table.component.ts` (o equivalente).
  - `opm-extracted/INDEX.md` mapea `StyleElementDialogComponent`, `StyleCopyingDialogComponent`, `LinksTableComponent`, `MultiplicityEditorComponent`.
  - `assets/svg/styleElement.svg`, `assets/svg/styleEnlace.svg` (si existe), markers de vertices y reanclaje en `assets/svg/links/`. No redibujar.
  - `docs/JOYAS.md` §1 paleta cosas, §3 tipografia, §4 wrapper+line de enlaces, §13 triangulo agregacion. Toda decision de render cita JOYAS.
- **Estado actual del codigo (post-ronda 5)**:
  - `app/src/modelo/estilos.ts`, `app/src/modelo/estilos.test.ts` (de L6 ronda 5) ya manejan `apariencia.estilo` con `fill?` y `borderColor?`. Extender para texto (`fontFamily?`, `fontSize?`, `fontWeight?`, `fontStyle?`, `textColor?`, `textAnchor?`).
  - `app/src/ui/StyleControls.tsx` ya muestra swatches de fill/border y reset. Extender con controles de texto y copy/paste enlace (NO modificar la firma existente, agregar tab o seccion).
  - `app/src/ui/InspectorEnlace.tsx` actualmente cubre etiqueta de enlace (de L4 ronda 5). L6 lo amplia con multiplicidad, estilo y etiqueta canonica de lista.
  - `app/src/modelo/etiquetasEnlace.ts` ya tiene la operacion para etiqueta libre; etiqueta canonica reusa la misma operacion (la lista canonica vive en UI o en helper aparte).
  - `app/src/render/jointjs/proyeccion.ts` proyecta enlaces con marker dinamico, wrapper+line. La aplicacion de `enlace.estilo` debe respetar `strokeDasharray` ambiental existente y no reemplazarlo (HU-14.012 nota: "ambiental sigue siendo discontinuo").
  - `app/src/render/jointjs/JointCanvas.tsx` tiene los listeners de pointerclick; debe agregar `link:pointerdown` sobre wrapper para insertar vertices (HU-11.018) y `link:vertex:dragend` para reposicionar (HU-11.019).
  - `app/src/serializacion/json.ts` ya hidrata `apariencia.estilo`; agregar `enlace.estilo?`, `enlace.multiplicidadOrigen?`, `enlace.multiplicidadDestino?`, `aparienciaEnlace.vertices?` (si no existe ya).

## 4. Archivos permitidos

```text
app/src/modelo/enlaceMultiplicidad.ts        NUEVO
app/src/modelo/enlaceMultiplicidad.test.ts   NUEVO
app/src/modelo/enlaceEstilo.ts               NUEVO
app/src/modelo/enlaceEstilo.test.ts          NUEVO
app/src/modelo/enlaceVertices.ts             NUEVO
app/src/modelo/enlaceVertices.test.ts        NUEVO
app/src/modelo/estilos.ts                    EDIT aditivo (extender campos texto)
app/src/modelo/estilos.test.ts               EDIT aditivo
app/src/modelo/tipos.ts                      EDIT aditivo (`enlace.estilo?`, `enlace.multiplicidad{Origen,Destino}?`, `apariencia.estilo` extendido, `aparienciaEnlace.vertices?` si falta)
app/src/serializacion/json.ts                EDIT aditivo
app/src/serializacion/json.test.ts           EDIT aditivo
app/src/render/jointjs/proyeccion.ts         EDIT aditivo (estilo enlace + render multiplicidad)
app/src/render/jointjs/proyeccion.test.ts    EDIT aditivo
app/src/render/jointjs/JointCanvas.tsx       EDIT aditivo (vertices + reanclaje extremos + zona handles)
app/src/opl/generar.ts                       EDIT aditivo (multiplicidad en oraciones segun §12)
app/src/opl/generar.test.ts                  EDIT aditivo
app/src/store.ts                             EDIT aditivo
app/src/store.test.ts                        EDIT aditivo
app/src/ui/InspectorEnlace.tsx               EDIT aditivo fuerte
app/src/ui/InspectorEntidad.tsx              EDIT aditivo (estilo texto)
app/src/ui/StyleControls.tsx                 EDIT aditivo (texto, swatches extendidos, copy/paste enlace)
app/src/ui/TablaEnlaces.tsx                  NUEVO
app/src/ui/MenuPrincipal.tsx                 EDIT aditivo (entrada Tabla de enlaces)
app/src/ui/App.tsx                           EDIT aditivo (montar TablaEnlaces como modal)
app/e2e/opm-smoke.spec.ts                    EDIT aditivo
assets/svg/styleElement.svg                  LECTURA canonica
assets/svg/links/**                          LECTURA canonica
docs/JOYAS.md                                LECTURA
opm-extracted/**                             LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar `PanelOpl.tsx` (excepto pasivamente al testear que multiplicidad aparece en oraciones); `app/src/opl/interaccion.ts` ni `edicionCanvas.ts` (L2). Coordinacion con L2: el boton "Editar OPL" que L2 quiere agregar al final del Inspector se respeta como punto de extension; documentar en commit que dejas un slot al pie del Inspector libre.
- No tocar `AsistenteNuevoModelo.tsx` (L3), `DialogoCargarModelo.tsx`, `DialogoGuardarComo.tsx`, `DialogoBuscarCosas.tsx`, `PanelCarpetas.tsx`, `persistencia/workspace.ts`, `persistencia/autosalvado.ts` (L4), `MapaSistema.tsx`, `GestionArbolOpd.tsx`, `ArbolOpd.tsx`, `mapaSistema.ts`, `opdReorden.ts` (L5), ni el detector (L1).
- `proyeccion.ts` lo tocan tambien L2 y L5; extraer logica de estilo enlace a helper nuevo `enlaceEstilo.ts` (modulo dominio o render-helper segun corresponda) y consumir desde `proyeccion.ts` solo como punto de composicion.
- Estilo de enlace **no debe reemplazar** `strokeDasharray` ambiental (heredado por afiliacion); el render compone wrapper canonico + estilo override, no sobrescribe el patron base.
- Multiplicidad si entra al texto OPL segun [OPL-ES §12]; documentar formula. OPL sigue invariante a estilo visual, color de texto y patron de trazo.
- No introducir libreria de color picker; reusar swatches + input HEX manual.
- No introducir libreria de tabla; usar `<table>` nativa con CSS.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.

## 6. Slice minimo shippeable

### Modelo

`tipos.ts` (aditivo):

```ts
export interface EnlaceEstilo {
  color?: string;          // HEX validado
  strokeWidth?: number;    // 1-6 px
  dashArray?: string;      // "" | "4 4" | "2 4" | ...
}

export interface Enlace {
  // ... campos existentes
  multiplicidadOrigen?: string;     // "1" | "0..1" | "N" | "0..N" | "m..n" | "*"
  multiplicidadDestino?: string;
  estilo?: EnlaceEstilo;
}

export interface AparienciaEstilo {
  // ... campos existentes (fill?, borderColor?)
  fontFamily?: string;
  fontSize?: number;        // 8-24
  fontWeight?: number | "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textColor?: string;
  textAnchor?: "start" | "middle" | "end";
}

export interface AparienciaEnlace {
  // ... campos existentes
  vertices?: { x: number; y: number }[];
}
```

`enlaceMultiplicidad.ts`:

```ts
export const MULTIPLICIDADES_CANONICAS = ["1", "0..1", "N", "0..N", "*"] as const;
export function validarMultiplicidad(valor: string): Resultado<void>;     // regex ^\d+(\.\.\d+|\.\.\*)?$|^\*$|^N$|^0\.\.N$
export function fijarMultiplicidadOrigen(modelo: Modelo, enlaceId: Id, valor: string): Resultado<Modelo>;
export function fijarMultiplicidadDestino(modelo: Modelo, enlaceId: Id, valor: string): Resultado<Modelo>;
export function quitarMultiplicidad(modelo: Modelo, enlaceId: Id, lado: "origen" | "destino"): Resultado<Modelo>;
```

`enlaceEstilo.ts`:

```ts
export function aplicarEstiloEnlace(modelo: Modelo, enlaceId: Id, estilo: Partial<EnlaceEstilo>): Resultado<Modelo>;
export function resetEstiloEnlace(modelo: Modelo, enlaceId: Id): Resultado<Modelo>;
export function copiarEstiloEnlace(modelo: Modelo, enlaceId: Id): EnlaceEstilo;
export function pegarEstiloEnlace(modelo: Modelo, enlaceId: Id, estilo: EnlaceEstilo): Resultado<Modelo>;
```

`enlaceVertices.ts`:

```ts
export function insertarVerticeApariencia(modelo: Modelo, aparienciaEnlaceId: Id, posicion: { x: number; y: number }): Resultado<Modelo>;
export function reposicionarVerticeApariencia(modelo: Modelo, aparienciaEnlaceId: Id, indice: number, posicion: { x: number; y: number }): Resultado<Modelo>;
export function reanclarExtremoEnlace(modelo: Modelo, enlaceId: Id, lado: "origen" | "destino", nuevoExtremo: ExtremoEnlace): Resultado<{ modelo: Modelo; advertencia?: string }>;
```

Reglas:
- `validarMultiplicidad`: rechaza vacios, formato libre, valores con espacios; acepta canonicas y custom dentro del regex.
- `aplicarEstiloEnlace`: HEX validado (3 o 6 chars con `#`), strokeWidth en [1, 6], dashArray solo si esta en lista permitida (`""`, `"4 4"`, `"2 4"`, `"6 4 2 4"`).
- `insertarVerticeApariencia`: posicion debe estar entre dos vertices existentes (o entre extremos); ordena automaticamente.
- `reanclarExtremoEnlace`: usa filtros de firma (HU-10.008/.010); si la nueva conexion rompe filtros, retorna error con mensaje y `aparienciaEnlace` queda intacta (HU-11.020).

### Operaciones

Sin operaciones nuevas en `operaciones.ts`. Todo vive en los modulos de dominio.

### Serializacion

`json.ts` (aditivo): roundtrip lossless de `enlace.multiplicidadOrigen`, `enlace.multiplicidadDestino`, `enlace.estilo`, `aparienciaEnlace.vertices`, y campos extendidos de `apariencia.estilo`. Hidratacion conservadora: ausentes -> `undefined`.

### OPL

`generar.ts` (aditivo): cuando un enlace tiene `multiplicidadOrigen` o `multiplicidadDestino` no vacios, incluirlos en la oracion segun [OPL-ES §12]:

- Consumo: "**Conductor** (1) consume **Combustible** (m..n)."
- Agregacion: "**Carro** (1) consta de **Rueda** (4)."
- Etc.

Si ambos son `undefined`, oracion es identica al texto actual (compatibilidad). El estilo visual no aparece en OPL.

### Render

`proyeccion.ts` (aditivo via `enlaceEstilo` helper):

- Aplica `enlace.estilo.color` al `stroke` del cuerpo del enlace, preservando wrapper transparente 15px (JOYAS §4).
- Aplica `enlace.estilo.strokeWidth` al cuerpo (1-6 px); wrapper inalterado.
- Aplica `enlace.estilo.dashArray` solo si la afiliacion del par origen-destino no impone uno; si impone (ambiental), preserva el patron base.
- Renderiza multiplicidad como anotacion proxima a cada extremo (HU-16.012/.014).

`JointCanvas.tsx` (aditivo):

- Listener `link:pointerdown` sobre wrapper -> `insertarVerticeAccion(aparienciaEnlaceId, posicion)`.
- Listener `link:vertex:dragend` -> `reposicionarVerticeAccion(...)`.
- Listener `link:end:dragend` -> `reanclarExtremoAccion(enlaceId, lado, nuevoExtremo)`; si error, revertir visual.
- Zona handles 8px de tolerancia para iniciar enlace (HU-11.025): solo dentro de wrapper de cada apariencia; documentar.
- Borrado en lote (HU-11.023): si seleccion multiple no esta cableada (HU-SHARED-008 fuera), implementar via comando store que tome lista de `enlaceId[]` y delegue a HU-SHARED-005 una vez por enlace en una sola entrada de undo (atomicidad).

### Store

```ts
// Multiplicidad
fijarMultiplicidadEnlace(enlaceId: Id, lado: "origen" | "destino", valor: string): void;
quitarMultiplicidadEnlace(enlaceId: Id, lado: "origen" | "destino"): void;

// Estilo enlace
aplicarEstiloEnlaceAccion(enlaceId: Id, estilo: Partial<EnlaceEstilo>): void;
resetEstiloEnlaceAccion(enlaceId: Id): void;
copiarEstiloEnlaceAlPortapapeles(enlaceId: Id): void;        // ui.estiloEnlacePortapapeles
pegarEstiloEnlaceDesdePortapapeles(enlaceId: Id): void;

// Estilo texto
aplicarEstiloTextoAccion(aparienciaId: Id, estilo: Partial<AparienciaEstilo>): void;
resetEstiloTextoAccion(aparienciaId: Id): void;

// Vertices y reanclaje
insertarVerticeAccion(aparienciaEnlaceId: Id, posicion: { x: number; y: number }): void;
reposicionarVerticeAccion(aparienciaEnlaceId: Id, indice: number, posicion: { x: number; y: number }): void;
reanclarExtremoAccion(enlaceId: Id, lado: "origen" | "destino", nuevoExtremo: ExtremoEnlace): void;

// Borrado lote
borrarEnlacesEnLote(enlaceIds: Id[]): void;

// Tabla de enlaces
tablaEnlacesAbierta: boolean;
tablaEnlacesFiltroTipo: TipoEnlace | "todos";
tablaEnlacesOrden: { columna: string; direccion: "asc" | "desc" } | null;
abrirTablaEnlaces(): void;
cerrarTablaEnlaces(): void;
fijarFiltroTablaEnlaces(tipo: TipoEnlace | "todos"): void;
fijarOrdenTablaEnlaces(columna: string): void;            // toggle asc/desc
navegarAEnlaceDesdeTabla(enlaceId: Id): void;
```

### UX

`InspectorEnlace.tsx` (aditivo fuerte):

- Mantener seccion "Etiqueta" existente; ofrecer dropdown "Etiqueta canonica" con valores ["controla", "se relaciona con", "se comunica via", "Personalizada"] cuando el enlace es estructural etiquetado (HU-16.010). Si el usuario elige canonica, la etiqueta se fija con la canonica; "Personalizada" muestra input texto libre.
- Nueva seccion "Multiplicidad" con dos campos (origen, destino), cada uno selector canonico + opcion "Custom" que abre input con validacion (HU-16.012/.013/.014).
- Nueva seccion "Estilo" con: color (swatches + HEX manual), grosor (slider 1-6), patron (selector "solido"/"discontinuo"/"punteado"/"mixto"), boton "Reset", boton "Copiar estilo", boton "Pegar estilo" (deshabilitado si no hay portapapeles).
- Footer: dejar slot vacio al final para que L2 monte boton "Editar OPL" en su merge.

`InspectorEntidad.tsx` (aditivo):

- Nueva pestana o seccion "Texto del rotulo" con: familia (dropdown web-safe + reset), tamano (slider 8-24), peso (negrita on/off), estilo (cursiva on/off), color (swatches + HEX), alineacion (izq/centro/der).
- Boton "Reset texto" que limpia campos de texto manteniendo fill/border existentes.

`StyleControls.tsx` (aditivo):

- Mantener swatches de fill/border de ronda 5.
- Agregar tab o seccion "Texto" para invocar acciones de `InspectorEntidad`.
- Agregar acciones globales "Copy style enlace" / "Paste style enlace" cuando el contexto es enlace.

`TablaEnlaces.tsx` (NUEVO):

- Modal nuevo, ocupa ~80% pantalla.
- Tabla con filas = enlaces del modelo (no apariencias), columnas: Origen, Destino, Tipo, Etiqueta, Mult. origen, Mult. destino. Color por tipo (objeto verde / proceso cyan, JOYAS §1).
- Filtro por tipo: dropdown "Todos / agregacion / instrumento / agente / consumo / efecto / resultado / etiquetado" (HU-16.004).
- Ordenamiento: clic en cabecera alterna asc/desc, case-insensitive (HU-16.005).
- Edicion in-place (HU-16.007): doble clic en celda Etiqueta o Multiplicidad abre input inline.
- Navegacion: clic simple en fila selecciona; doble clic en fila navega al primer OPD donde el enlace tiene apariencia y selecciona la apariencia (HU-16.006).
- Footer: cerrar (boton + ESC).

`MenuPrincipal.tsx`: agregar entrada "Tabla de enlaces".

### Cross-capa

- Cada accion store usa `commitModelo` para entrar a undo.
- La paleta inicial (HU-14.002/.003 ronda 5) se mantiene; los nuevos campos heredan mecanica analoga.
- `enlaceEstilo` helper aplicado en `proyeccion.ts` debe ejecutarse despues de la composicion canonica (wrapper + line + marker), no antes; el override no rompe markers ni wrapper.

## 7. Tests obligatorios

- Unit enlaceMultiplicidad: `validarMultiplicidad("1")`, `("0..1")`, `("m..n")` con `m`, `n` enteros, `("*")`, `("0..N")` ok; rechaza `("1..")`, `("..2")`, `("abc")`, `("")`.
- Unit enlaceMultiplicidad: `fijarMultiplicidadOrigen` y `fijarMultiplicidadDestino` actualizan campos sin tocar otros; OPL emite con multiplicidad cuando ambos lados o uno presente.
- Unit enlaceEstilo: `aplicarEstiloEnlace` valida HEX, strokeWidth y dashArray; rechaza fuera de rango.
- Unit enlaceEstilo: `resetEstiloEnlace` deja `enlace.estilo === undefined`.
- Unit enlaceEstilo: copy/paste roundtrip identica.
- Unit enlaceVertices: insertar entre dos extremos crea vertice; reposicionar actualiza coordenadas; reanclar a destino invalido falla con mensaje.
- Unit estilos texto: `aplicarEstiloApariencia` extendido valida fontSize en [8,24], textAnchor en lista, fontWeight valido.
- Unit serializacion: roundtrip lossless de todos los campos nuevos; legacy hidrata como `undefined`.
- Unit OPL: enlace con multiplicidad emite oracion segun [OPL-ES §12]; sin multiplicidad emite identico al actual.
- Render: estilo enlace aplica color/grosor/dash; ambiental conserva dash base; wrapper sigue 15px.
- Render: multiplicidad se renderiza como anotacion en cada extremo.
- Store: cada accion entra al stack undo correctamente; `borrarEnlacesEnLote([a, b, c])` deshace los tres en una operacion.
- Store: tabla abre/cierra; filtro reduce filas; ordenamiento alterna; navegacion cambia `opdActivoId` y selecciona enlace.
- Component/UI: `InspectorEnlace` muestra todas las secciones; selector multiplicidad canonica + custom; copy/paste estilo deshabilitado sin portapapeles; reset funciona.
- Component/UI: `InspectorEntidad` con seccion texto; reset solo afecta texto.
- Component/UI: `TablaEnlaces` con edicion in-place; doble clic navega.
- Smoke: crear modelo, modificar texto y estilo de cosa, ajustar grosor y patron de enlace, fijar multiplicidad, abrir Tabla de enlaces, filtrar y navegar; verificar OPL refleja multiplicidad y mantiene invariancia visual.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- OPL es invariante a estilo visual; multiplicidad si entra al texto OPL segun [OPL-ES §12].
- Estilo de enlace respeta convenciones SSOT: ambiental sigue discontinuo aunque el usuario elija "solido" (la decision es: dash override solo se aplica si afiliacion no impone uno).
- Multiplicidad se valida con regex restrictivo; "Custom" no admite cualquier texto.
- Vertices manuales se almacenan en `aparienciaEnlace.vertices`; reanclaje muta `enlace.origenId`/`enlace.destinoId` solo si pasa filtros.
- Borrado en lote es una sola entrada de undo.
- Tabla de enlaces es vista derivada; edicion in-place dispara mutaciones canonicas, no edita el JSON directamente.
- Copy/paste estilo enlace persiste en `ui.estiloEnlacePortapapeles` (sesion); no sobrevive recarga.
- HU-14.016 (multi-seleccion) y HU-11.026/.027 (subtipos condicion/evento/NOT) quedan fuera; multi-seleccion para borrado en lote se simula via comando store que recibe lista, sin gesto UI nuevo.

## 10. Decisiones que tomas vos (documentar en commit)

- Si el dropdown "Familia tipografica" expone solo web-safe (Arial, Helvetica, Times, Courier, Verdana) o tambien Google Fonts. Recomendado web-safe + reset a default.
- Si la multiplicidad se renderiza con badge cuadrado o solo texto pequeno proximo al extremo. Documentar.
- Si dashArray ofrece 3 o 4 patrones predefinidos.
- Si la Tabla de Enlaces lista tambien apariencias (un enlace con N apariencias = N filas) o solo enlaces logicos. HU-16.002 dice "uno por enlace"; preferir uno por enlace logico, navegar al primer OPD.
- Si edicion in-place soporta cambio de tipo o solo etiqueta y multiplicidad. Recomendado solo etiqueta y multiplicidad; tipo fuera.
- Si el slot que dejas en `InspectorEnlace.tsx` para L2 es comentario `{/* L2: boton editar OPL */}` o seccion vacia con id estable. Preferir seccion estable con id "inspector-enlace-footer".
- Como aplicar el override sin romper la composicion canonica de `proyeccion.ts`: extraer estilo en un helper `aplicarOverrideEnlace(view, enlace)` invocado al final de la composicion.
- Si "Reset estilo enlace" tambien resetea `multiplicidad` o solo color/grosor/dash. Recomendado solo estilo visual; multiplicidad tiene su propio "Quitar".

## 11. Forma del entregable

Commits sugeridos:

- `feat(modelo): introduce multiplicidad, estilo y vertices de enlace`
- `feat(modelo): extiende estilo de apariencia para texto`
- `feat(opl): emite multiplicidad en oraciones cuando aplica`
- `feat(render): aplica estilo de enlace y vertices manuales sin romper convenciones SSOT`
- `feat(ui): reescribe inspector de enlace con multiplicidad, estilo y etiqueta canonica`
- `feat(ui): agrega controles de estilo de texto en inspector de cosas`
- `feat(ui): introduce tabla global de enlaces con filtros y navegacion`
- `test(enlaces): cubre multiplicidad, estilo, vertices, tabla y persistencia`

Co-author footer estandar si aplica al implementador. No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas, HU parcialmente cubiertas y bloqueos.
