# Linea 2 — OPL edicion canvas avanzada

## 1. Mision

Profundizar la lente OPL-ES inversa que cerro L1 ronda 5: cubrir generadores faltantes (despliegue "ocurren", especializacion "es un/a"), distinguir multi-enlaces en una misma oracion, propagar edicion textual al canvas mas alla del renombrado de entidades, indentar por nivel de OPD y dar utilidades de copia/export/busqueda al panel.

**Slice minimo entregable**: nuevo helper `app/src/opl/edicionCanvas.ts` que recibe `OplReferencia` + intencion ("editar etiqueta", "abrir inspector enlace", "renombrar estado") y delega a operaciones de modelo existentes; `PanelOpl.tsx` con caja de busqueda, botones "Copiar OPL" y "Exportar HTML", indentacion por profundidad de OPD activo y manejo de tokens individualizados cuando una oracion enlaza varios destinos; `generar.ts` con plantillas TS para despliegue y especializacion; tests unit + smoke por feature.

**Fuera de slice**: parser libre de OPL, edicion estructural completa (cambiar tipo de enlace, multiplicidad o direccion desde texto: queda solo abrir el inspector, no cambiar in-line), HU-50.027 (expandir/colapsar bloques jerarquicos), HU-50.028 (AI text), reubicacion lateral del panel (HU-50.004), minimizar/restaurar (HU-50.005/.006), mover el panel a slot distinto, persistir estado del panel entre sesiones, AI generativa.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-50.013 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Verbalizar despliegue asincrono "ocurren". |
| HU-50.015 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Verbalizar especializacion "es un/una". |
| HU-50.016 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Confirmar coloreado de tokens por clase (objeto verde, proceso cyan, estado gris). Hoy esta semi-cubierto via markdown; consolidar y testear. |
| HU-50.021 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Distinguir cual enlace especifico se selecciona en oraciones multi-enlace. |
| HU-50.022 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Propagacion en vivo: editar etiqueta de enlace y renombrar estado desde OPL. |
| HU-50.023 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Copiar OPL completo al portapapeles. |
| HU-50.024 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Exportar OPL como archivo HTML descargable. |
| HU-50.025 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Buscar texto local en el panel. |
| HU-50.026 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Indentar oraciones por nivel de OPD. |

## 3. Anclaje a evidencia

- **SSOT**: `opm-iso-19450-es.md` define OPL como representacion textual derivada y el alcance de la edicion inversa; `opm-opl-es.md` §1 fija nombres y roundtrip, §3-§10 plantillas (incluyendo D8 estados, TS1 despliegue/especializacion), §17 y Ap. A roundtrip; `metodologia-opm-es.md` §15 invariantes (no se altera el modelo desde una vista derivada salvo cuando la edicion lo refiere explicitamente).
- **Corpus interno reusable**:
  - `opm-extracted/MODULES.md` lista `src/app/rappid-components/rappid-opl/rappid-opl.component.ts`, `src/app/modules/layout/opl-container/opl-container.component.ts`, `src/app/dialogs/opl-dialog/opl-dialog.component.ts` y `OplService` como referencia de panel + servicio + dialogo. Buscar tambien rutinas de copy-to-clipboard y export HTML en `services/`.
  - `opm-extracted/INDEX.md` mapea `RappidOplComponent`, `OplContainerComponent`, `OplDialogComponent`, `OplService`, `OplSettingsComponent`.
  - `docs/JOYAS.md` §9 documenta el motor OPL observado (`generateLinksWithOpl(link)`) y confirma OPL como lente derivada.
- **Estado actual del codigo (post-ronda 5)**:
  - `app/src/opl/interaccion.ts` (115 LOC) ya define `OplLineaInteractiva`, `OplToken` con roles `texto | nombre | verbo | estado` y markdown `objeto | proceso | estado`, hint matching basico. Hoy una oracion como "**Carro** consta de **Rueda** y **Asiento**" puede generar varios tokens si los hints estan bien construidos; verificar y endurecer.
  - `app/src/opl/generar.ts` (841 LOC) emite oraciones por tipo de enlace, estados, despliegue parcial y abanicos. Falta plantilla "ocurren" para despliegue completo (HU-50.013) y "es un/a" para especializacion (HU-50.015).
  - `app/src/ui/PanelOpl.tsx` (232 LOC) ya tiene numeracion, filtro por seleccion, hover bidireccional, doble clic para renombrar entidad y seleccionar enlace, coloreado por markdown. Falta caja de busqueda, copy-to-clipboard, export HTML, indentacion y manejo explicito de "abrir inspector enlace" desde verbo.
  - `app/src/store.ts` ya tiene `seleccionarDesdeOpl`, `renombrarEntidadDesdeOpl`, `fijarFiltroOplPorSeleccion`, `fijarHoverOpl`. Faltan `editarEtiquetaEnlaceDesdeOpl`, `abrirInspectorEnlaceDesdeOpl`, `renombrarEstadoDesdeOpl`, `fijarBusquedaOpl`, `setOpdProfundidad` (si no existe ya la profundidad como derivada).
  - `app/src/modelo/etiquetasEnlace.ts` (de L4 ronda 5) ya expone una operacion para fijar etiqueta. Reusarla; no duplicar.

## 4. Archivos permitidos

```text
app/src/opl/generar.ts                       EDIT aditivo
app/src/opl/generar.test.ts                  EDIT aditivo
app/src/opl/interaccion.ts                   EDIT aditivo (extender hints, no cambiar API)
app/src/opl/edicionCanvas.ts                 NUEVO
app/src/opl/edicionCanvas.test.ts            NUEVO
app/src/ui/PanelOpl.tsx                      EDIT aditivo fuerte
app/src/ui/InspectorEnlace.tsx               EDIT aditivo (boton "Editar OPL" opcional al final)
app/src/store.ts                             EDIT aditivo
app/src/store.test.ts                        EDIT aditivo
app/src/render/jointjs/JointCanvas.tsx       EDIT aditivo (selector token-vs-enlace si hace falta)
app/src/render/jointjs/proyeccion.ts         LECTURA o aditivo acotado
app/e2e/opm-smoke.spec.ts                    EDIT aditivo
docs/JOYAS.md                                LECTURA
opm-extracted/**                             LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar dialogos de archivo (L4), wizard (L3), tabla de enlaces ni controles de estilo (L6), `MapaSistema.tsx` ni `GestionArbolOpd.tsx` (L5), ni el detector (L1).
- No reordenar bloques de `store.ts` existentes; agregar acciones agrupadas al final del bloque OPL.
- No cambiar firma publica de `generarOpl`, `generarOplInteractivo`, `crearLineaOplInteractiva`, `OplToken` ni `OplReferencia`. Si necesitas extender, agregar campos opcionales con defaults.
- No tocar `Inspector.tsx`, `InspectorEntidad.tsx`, `Toolbar.tsx`, `MenuPrincipal.tsx`, `ArbolOpd.tsx`, `serializacion/json.ts` ni archivos de persistencia.
- No introducir libreria de export HTML; usar generacion manual de string + `Blob` + `<a download>` con DOM nativo.
- Coordinar con L6 sobre `InspectorEnlace.tsx`: L6 reescribe el panel para multiplicidad/estilo/etiqueta canonica; L2 solo agrega un boton "Editar OPL" al final que dispara el flujo nuevo. Si llegas despues de L6 al merge, ajustar al layout que dejo L6 sin tocar campos.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.

## 6. Slice minimo shippeable

### Modelo

Sin nuevos constructos OPM. Toda edicion delega a operaciones existentes (`renombrarEntidad`, `renombrarEstado`, `fijarEtiquetaEnlace`, `seleccionarEnlace`).

### Operaciones

Helper nuevo `app/src/opl/edicionCanvas.ts`:

```ts
export type IntencionEdicionOpl =
  | { tipo: "renombrar-entidad"; id: Id; nombre: string }
  | { tipo: "renombrar-estado"; estadoId: Id; nombre: string }
  | { tipo: "fijar-etiqueta-enlace"; enlaceId: Id; etiqueta: string }
  | { tipo: "abrir-inspector-enlace"; enlaceId: Id };

export function aplicarEdicionOpl(modelo: Modelo, intencion: IntencionEdicionOpl): Resultado<Modelo>;
```

Tipos `Resultado` y `Modelo` ya existen. Cada caso delega al helper de modelo correspondiente; `abrir-inspector-enlace` no muta el modelo, solo se traduce a una accion store.

### Store

```ts
editarEtiquetaEnlaceDesdeOpl(enlaceId: Id, etiqueta: string): void;
renombrarEstadoDesdeOpl(estadoId: Id, nombre: string): void;
abrirInspectorEnlaceDesdeOpl(enlaceId: Id): void;
fijarBusquedaOpl(texto: string): void;
copiarOplActualAlPortapapeles(): Promise<void>;
exportarOplActualHtml(): Promise<void>;
```

`fijarBusquedaOpl` solo actualiza estado UI. `copiarOplActualAlPortapapeles` usa `navigator.clipboard.writeText(opl)`. `exportarOplActualHtml` genera HTML usando los tokens y dispara descarga via `Blob` + `URL.createObjectURL` + `<a download>`.

### Serializacion

Sin cambios. La capa OPL es derivada.

### OPL — Generador

Agregar:

```ts
function emitirDespliegueOcurren(...): OplLineaInteractiva;   // HU-50.013: "**A** se despliega en **B** y **C**."
function emitirEspecializacion(...): OplLineaInteractiva;     // HU-50.015: "**Subtipo** es un **Supertipo**."
```

Asegurar que oraciones con varios destinos generen un token `nombre` por destino (con `ref: { tipo: "entidad", id: ... }`) en lugar de un unico token con varios nombres concatenados. Esto ya es soportado por `tokenizarConHints`; verificar que los hints emitidos por el generador incluyen un hint por cada destino y que el match prioriza el mas largo (ya implementado).

Para multi-enlaces (HU-50.021): si la misma oracion atraviesa N enlaces (ej. bus de agregacion fusionado en render pero N enlaces en modelo), incluir en `linea.refs` los N enlaces y emitir un token `verbo` por enlace si el texto natural lo permite (caso comun: una sola conjuncion "consta de"; mantener entonces un unico verbo + tokens nombre por destino, donde cada token nombre lleva la `ref` del enlace correspondiente). Documentar la decision exacta en commit.

### OPL — Interaccion

Extender `OplTokenHint` opcionalmente con un alias para resolver casos donde el texto visible difiere del campo `nombre` (estados con nombre con tildes, etc.). No cambiar la firma actual; solo permitir un campo opcional `alias?: string`.

### Render

Sin cambios obligatorios en `proyeccion.ts`. Si la indentacion (HU-50.026) o el highlight visual (multi-enlace) requiere reflejar algo en canvas, hacerlo via `proyeccion.ts` con un highlight aditivo que respete el ya existente para `seleccionId`/`enlaceSeleccionId`.

### UX (PanelOpl)

- **Caja de busqueda**: input de texto en barra superior del panel; filtra `linea.texto.toLowerCase().includes(query)`. Combina con filtro por seleccion (AND).
- **Botones "Copiar OPL" y "Exportar HTML"**: al lado de la caja; deshabilitados si `lineas.length === 0`.
- **Indentacion**: anteponer `padding-left` proporcional a `opd.profundidad` cuando el panel renderiza varios OPDs (caso futuro). Para el slice actual el panel solo muestra el OPD activo, asi que indentacion se mantiene constante; introducir el calculo de profundidad ya, dejando codigo listo para HU-50.027.
- **Multi-enlace**: cada token enlace abre su propio inspector via `abrirInspectorEnlaceDesdeOpl(enlaceId)`. Hacer hover token enlace highlightee solo ese enlace en canvas, no todos los del bus.
- **Doble clic en verbo**: hoy selecciona el enlace; ampliar a "selecciona y abre inspector" usando la nueva accion `abrirInspectorEnlaceDesdeOpl`.
- **Doble clic en estado**: nuevo input inline para renombrar estado (analogo al de entidad). Si el doble clic en token con `markdown: "estado"` no tenia handler, agregarlo.
- **Indicador edicion**: cuando el agente esta editando un token, mostrar un foco visible y permitir Enter/Escape (ya implementado para entidad).

### Cross-capa

- `aplicarEdicionOpl` se invoca en `store.ts`; el store usa `commitModelo` para integrar undo/redo.
- Cualquier highlight nuevo del canvas (multi-enlace) debe respetar `enlaceSeleccionId` previo.
- La caja de busqueda no toca el modelo ni reescribe el OPL emitido; solo filtra `visibles`.

## 7. Tests obligatorios

- Unit OPL: `generarOplInteractivo` emite oracion "se despliega en" cuando hay `enlace.tipo = "despliegue"` y multiples destinos (HU-50.013).
- Unit OPL: emite "es un" / "es una" cuando hay `enlace.tipo = "generalizacion"` (HU-50.015).
- Unit OPL: oracion con N destinos genera N tokens `nombre` con `ref` distinta.
- Unit OPL: oracion multi-enlace (varios `enlace.id` con misma firma estructural) lleva `linea.refs.length === N` y los tokens `nombre` por destino llevan la ref del enlace correspondiente.
- Unit edicionCanvas: cada `IntencionEdicionOpl` produce `Resultado.ok` cuando los ids son validos y `Resultado.error` con mensaje claro cuando no lo son.
- Store: `editarEtiquetaEnlaceDesdeOpl` cambia `enlace.etiqueta`, OPL re-emite con la etiqueta nueva, y la operacion entra al stack undo.
- Store: `renombrarEstadoDesdeOpl` cambia `estado.nombre`, valida vacio/duplicado.
- Store: `fijarBusquedaOpl("rueda")` filtra `lineasVisibles` (verificar via selector publico o rendering).
- Store: `copiarOplActualAlPortapapeles` invoca `navigator.clipboard.writeText` con todas las lineas concatenadas (mockear clipboard).
- Store: `exportarOplActualHtml` produce un `Blob` con MIME `text/html` y dispara descarga; usar mock para el DOM.
- Component/UI smoke: caja de busqueda filtra; boton copiar muestra toast; boton exportar dispara download (pseudo-test); doble clic en estado abre input inline; multi-enlace highlightea correctamente.
- Smoke browser: oracion compuesta con 3 destinos -> click en cada nombre selecciona la entidad correcta y el enlace asociado.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- OPL-ES sigue siendo lente derivada; no se vuelve fuente de verdad.
- La edicion inversa cubre nombres (entidad y estado) y etiqueta de enlace; cambios estructurales (tipo, direccion, multiplicidad) se delegan al inspector via `abrir-inspector-enlace`.
- El panel sigue en su slot inferior fijo; HU-50.004/.005/.006 quedan fuera de slice.
- No se introduce libreria de OPL parser, AI ni rich-text editor.
- HU-50.016 ya esta cubierta a nivel visual via markdown; consolidarla con un test, sin reescribir el styling.

## 10. Decisiones que tomas vos (documentar en commit)

- Si la barra de busqueda y los botones copy/export viven en una misma toolbar superior o se separan en dos filas (toolbar + footer).
- Si el atajo Ctrl+F dentro del panel intercepta busqueda local; preferir Ctrl+Shift+F si Ctrl+F lo reclama L4 para "Buscar cosas del modelo" (verificar L4 antes de elegir).
- Como representar visualmente el token enlace cuando hay multiples enlaces: subrayado distinto, color sutil, badge con numero de enlace; preferir mininimo (subrayado punteado).
- Si la indentacion ya se aplica en el slice o solo se deja "calculada y lista" para HU-50.027 (queda fuera). Preferir aplicar indentacion 0 para OPD activo unico, dejando el calculo cableado.
- Si `aplicarEdicionOpl` retorna el modelo nuevo o el store invoca el helper directamente; preferir retornar `Resultado` puro y dejar el commit en store.

## 11. Forma del entregable

Commits sugeridos:

- `feat(opl): emite oraciones de despliegue y especializacion`
- `feat(opl): habilita edicion inversa de etiqueta de enlace y nombre de estado`
- `feat(ui): agrega busqueda, copia y export al panel opl`
- `feat(opl): distingue tokens en oraciones multi-enlace`
- `test(opl): cubre edicion canvas y multi-enlace`

Co-author footer estandar si aplica al implementador. No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas, HU parcialmente cubiertas y bloqueos.
