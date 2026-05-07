# Línea 1 — Refactor visual chrome (post-Beta1)

## 1. Misión

Cerrar el bug visual `BUG-20260507T212356Z-692129` ("paneles horribles, refactorizar para que se vean limpios y usables") con un refactor visual de tres superficies de chrome UI: **Inspector vacío + file picker (P1)**, **cabecera del panel OPL (P2)** y **toolbar superior (P3)**. El refactor reagrupa controles por intención, ajusta tipografía y densidad, reemplaza el `<input type=file>` nativo truncado por un picker custom, y normaliza tokens existentes. **No** introduce funcionalidad nueva ni cambia handlers.

**Slice mínimo entregable** (3 pasadas seriales, 3 commits):

- **P1**: `InspectorVacio` con jerarquía clara (título 14px bold + body 13px secundario + card "Atajos"); `<PersistenciaJson />` envuelto en `<details>` colapsado por defecto cuando inspector está vacío; `<input type=file>` reemplazado por label custom con botón `Elegir archivo…` + nombre de archivo con `text-overflow: ellipsis`; bloques `Modelos locales`, `JSON`, `Archivo JSON` con tarjeta sutil (border + radius + padding) y separación.
- **P2**: cabecera del panel OPL en 3 clusters separados por `divider`: chrome (`▾ minimizar`, `↔ posición`) | display (`123`, `AI`, `Editar`) | consulta (input búsqueda, `Copiar`, `HTML`); toggle `Filtrar por selección` al extremo derecho con divider; tipografía 12 (de 11) y altura 28 (de 26); `searchInput.minWidth: 180`.
- **P3**: toolbar superior reorganizada en 5 clusters por intención: Crear (`Objeto`, `Proceso`, `+Atributo`) | Historia (`↶`, `↷` en iconos) | Modelo (`Nuevo`, `Demo▾`, `Guardar`, `Cargar`) | Enlace (`Tipo▾`, `Tipos válidos`, `Biblioteca`) | Vista (`Grid`, `Auto-layout`); `Crear varios objetos/procesos` migran al menú `⋯ Más`; `Config grid` en banda se elimina (ya está en menú); `botonBase` sin `minWidth`, `height: 30`; dividers con margen extra entre clusters.

**Pendientes explícitos** (no entran a este slice):

- Refactor visual de `ToolbarSeleccion.tsx`, `ToolbarMultiseleccion.tsx`, `ToolbarMapaSistema.tsx` (icono "Traer" superpuesto en captura del bug). Se anotará bug nuevo si persiste tras P3.
- A11y audit completo (contraste, navegación teclado, screen reader). Otra ronda.
- Refactor visual del árbol OPD, mapa de sistema, modales mayores. Otra ronda.
- Reescritura de tokens o introducción de design system formal. Esta ronda solo consume `tokens.ts` existente.
- Animaciones, transiciones, microinteracciones. No entran.

## 2. HU base (lectura obligatoria antes de codificar)

| Pasada | HU | Path | Aporte |
|---|---|---|---|
| P1 | HU-30.x (Modelos locales, Importar/Exportar JSON) | `docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | El Inspector vacío comunica atajos correctos para entrar al modelo (Demo, Cargar, Toolbar Objeto/Proceso). El picker de archivo JSON no se trunca y muestra el nombre del archivo seleccionado con ellipsis. |
| P2 | HU-50.001 | `docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` (sección 50.001) | Renderizar panel OPL-ES persistente — esta pasada ajusta exclusivamente la cabecera del panel sin tocar render de oraciones. |
| P2 | HU-50.004–006 | (mismo archivo, 50.004–006) | Mover/minimizar/restaurar panel: el cluster "chrome" agrupa estos controles. |
| P2 | HU-50.018 | (mismo archivo, 50.018) | Filtrar por selección: el toggle queda visible y separado por divider en el extremo derecho. |
| P2 | HU-50.023 | (mismo archivo, 50.023) | Copiar OPL al portapapeles: cluster "consulta" junto a HTML. |
| P2 | HU-50.024 | (mismo archivo, 50.024) | Exportar OPL a HTML: cluster "consulta". |
| P2 | HU-50.025 | (mismo archivo, 50.025) | Buscar texto en panel: input con `minWidth:180 maxWidth:280` para no aplastarse. |
| P3 | EPICA-90 | `docs/historias-usuario-v2/epicas/epica-90-interaccion-shortcuts.md` | Toolbar superior es la principal superficie de invocación; agrupación por intención reduce carga cognitiva. |
| P3 | HU-30.x (Nuevo, Guardar, Cargar) | `docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Cluster "Modelo" reagrupa estas acciones. |

Y como referencia (no implementar aquí):

- HU-50.026 (indentar oraciones por nivel de OPD) y HU-50.027 (expandir/colapsar bloques): no entran a P2; P2 sólo toca cabecera, no el contenido del panel.

## 3. Anclaje a evidencia

- **SSOT primaria**:
  - `docs/JOYAS.md` — paleta canvas invariante (el chrome UI **no** debe colisionar con `#3BC3FF` proceso ni `#70E483` objeto). Tokens `colors.canvas.*` ya documentan la frontera; usar `colors.acentoUi*` para chrome.
  - `app/src/ui/tokens.ts` — escala completa de spacing/typography/radii/shadows. **Cita autoridad de esta línea**: cualquier valor visual debe leerse de aquí o agregarse aquí con justificación.
- **`opm-extracted/` (lectura obligatoria antes de inventar)**:
  - `opm-extracted/src/app/rappid-components/rappid-toolbar/rappid-toolbar.component.ts`: patrón de agrupación de acciones y secciones del toolbar OPCloud. Estructural, no copiar.
  - `opm-extracted/src/app/rappid-components/rappid-toolbar/toolbar.component.ts`: distribución de botones y modos.
  - `opm-extracted/src/app/rappid-components/rappid-opl/rappid-opl.component.ts`: cabecera del panel OPL en OPCloud — agrupación numeración + búsqueda + filtro.
  - `opm-extracted/src/app/modules/layout/opl-container/opl-container.component.ts`: contenedor del panel OPL.
  - `opm-extracted/src/app/dialogs/opl-dialog/opl-dialog.component.ts`: chrome del diálogo OPL como referencia de jerarquía.
  - Ejecutar antes de codificar: `rg -i "toolbar|cluster|group|section" opm-extracted/src/app/rappid-components/`.
  - Política: **evidencia y guía estructural, no copiar 1:1**. El stack es Preact con `style={...}` literal y tokens; OPCloud es Angular con SCSS.
- **Estado actual del código** (paths concretos):
  - `app/src/ui/tokens.ts` — escala completa, lectura obligatoria.
  - `app/src/ui/Inspector.tsx` (52 líneas) — `InspectorVacio` inline en líneas 39–52.
  - `app/src/ui/PersistenciaJson.tsx` (303 líneas) — bloque `Modelos locales / JSON / Archivo JSON` en líneas 64–152, estilos en 178–303. El `<input type=file>` problemático en líneas 106–115.
  - `app/src/ui/inspectorStyles.ts` — tokens compartidos del Inspector.
  - `app/src/ui/panelOpl/Toolbar.tsx` (189 líneas) — toolbar OPL completo, JSX en 23–121, estilos en 132–189.
  - `app/src/ui/toolbar/ToolbarBase.tsx` — chrome superior, JSX clave en 228–264, `construirItemsMenuMas` en 353–435.
  - `app/src/ui/toolbar/ToolbarCreacion.tsx` (115 líneas) — selector enlace + Grid + layout en 83–113.
  - `app/src/ui/toolbar/toolbarStyles.ts` — tokens compartidos del toolbar superior. `botonBase()` en 293–307.
  - `app/src/ui/toolbar/ToolbarMas.tsx` — menú accesible ya implementado, no tocar.
- **Bug origen**:
  - `docs/bugs/BUG-20260507T212356Z-692129/report.md` — texto del operador.
  - `docs/bugs/BUG-20260507T212356Z-692129/screenshots/` — 3 capturas que documentan el estado FAIL.

## 4. Archivos permitidos (scope estricto)

```
# Pasada 1 (Inspector + file picker)
app/src/ui/Inspector.tsx                    EDIT (rediseñar InspectorVacio, envolver PersistenciaJson en details)
app/src/ui/PersistenciaJson.tsx             EDIT (file picker custom, tarjetas, tokens)
app/src/ui/inspectorStyles.ts               aditivo (vacioCard, vacioTitle, vacioBody, vacioCaption)

# Pasada 2 (Toolbar OPL)
app/src/ui/panelOpl/Toolbar.tsx             EDIT (3 clusters, dividers, tipografía 12, height 28)

# Pasada 3 (Toolbar superior)
app/src/ui/toolbar/ToolbarBase.tsx          EDIT (5 clusters, mover Crear varios* a Más)
app/src/ui/toolbar/ToolbarCreacion.tsx      EDIT (quitar label "Enlace", quitar botón Config grid en banda)
app/src/ui/toolbar/toolbarStyles.ts         aditivo (botonBase sin minWidth, height 30, divider.margin)

# Lectura permitida en las 3 pasadas
app/src/ui/tokens.ts                        LECTURA (puede recibir tokens nuevos solo si justificados)
app/src/ui/toolbar/ToolbarMas.tsx           LECTURA
app/src/ui/panelOpl/Bloques.tsx             LECTURA
app/e2e/01-carga-y-workspace.spec.ts        LECTURA (verificar Modelos locales / Archivo JSON)
app/e2e/03-opl-panel.spec.ts                LECTURA (verificar testIds)
app/e2e/14-canvas-fidelity.spec.ts          LECTURA (verificar Sugerir layout y config-grid)
docs/bugs/BUG-20260507T212356Z-692129/      LECTURA (capturas + report)
opm-extracted/                              LECTURA
docs/JOYAS.md                               LECTURA
```

**Lectura permitida**: cualquier archivo de `app/`, `opm-extracted/` y `docs/` para informarse.

**Prohibido**: tocar `app/src/modelo/**`, `app/src/store/**`, `app/src/canvas/**`, `app/src/render/**`, `app/src/serializacion/**`, `app/src/opl/**`, `docs/HANDOFF.md`, `docs/historias-usuario-v2/`, `docs/JOYAS.md` (lectura sí, edición no), `app/src/ui/InspectorEntidad.tsx`, `app/src/ui/InspectorEnlace.tsx`, `app/src/ui/PanelAvisos.tsx`, otros toolbars (`ToolbarSeleccion.tsx`, `ToolbarMultiseleccion.tsx`, `ToolbarMapaSistema.tsx`).

## 5. Restricciones de no-colisión

1. **Cero colisión entre pasadas**: P1, P2 y P3 trabajan archivos disjuntos. Ninguna pasada toca archivos de otra. Si una pasada necesita tocar un archivo de otra, **detenerse y consultar**.
2. **Preservación dura de testIds**: ejecutar antes de cada pasada `rg -n "data-testid=" <archivos-de-la-pasada>` y `rg -n "<testId>" app/e2e` para listar dependencias. Cada testId que viva en un control modificado debe seguir existiendo en el JSX final, en el mismo string. Si una acción se mueve al menú `⋯ Más`, el item del menú reemite el testId con el mismo nombre (precedente: `toolbar-mas-config-grid` ya espeja `config-grid`).
3. **`tokens.ts` es lectura por defecto**: solo agregar tokens nuevos si la justificación entra en commit y cita el problema visual concreto. La preferencia es **no agregar tokens nuevos**: la escala existente cubre todo lo propuesto.
4. **Estilos literales**: cuando un `style={...}` de un componente se modifica, los valores deben venir de `tokens.colors|spacing|radii|shadows|typography`. Está prohibido escribir `padding: "9px 14px"` ad-hoc. Si el valor exacto no está en tokens, redondear al token cercano (P1: spacing.md=12, P2: spacing.sm=8, P3: spacing.xs=4 para divider margins).
5. **Smoke browser intacto**: si un smoke `app/e2e/*.spec.ts` falla, el primer reflejo es restaurar el testId/aria-label correspondiente, **no** modificar el smoke.
6. **Audit visual obligatorio entre pasadas**: P2 no se inicia hasta que el audit de P1 reporte CLEAR para el criterio "Inspector vacío legible y file picker no truncado". P3 no se inicia hasta que P2 cierre.

## 6. Slice mínimo shippeable

### 6.1 Pasada P1 — Inspector vacío + file picker

#### 6.1.1 Rediseñar `InspectorVacio`

`app/src/ui/Inspector.tsx:39-52` se rescribe con jerarquía explícita y card de atajos:

```tsx
function InspectorVacio() {
  return (
    <div style={style.vacioContainer} data-testid="inspector-vacio">
      <h3 style={style.vacioTitle}>Sin selección</h3>
      <p style={style.vacioBody}>
        Selecciona una cosa o un enlace en el canvas, el árbol OPD o el panel OPL para inspeccionar y editar.
      </p>
      <div style={style.vacioCard}>
        <p style={style.vacioCaption}>Atajos para empezar</p>
        <ul style={style.vacioList}>
          <li>Toolbar <kbd>Objeto</kbd> o <kbd>Proceso</kbd> → inserta una cosa.</li>
          <li><kbd>Demo</kbd> → carga un modelo de ejemplo.</li>
          <li><kbd>Cargar</kbd> → abre modelos guardados.</li>
        </ul>
      </div>
    </div>
  );
}
```

Estilos nuevos en `inspectorStyles.ts` (aditivo):

```ts
vacioContainer: { color: tokens.colors.textoTerciario, fontSize: tokens.typography.sizes.md },
vacioTitle:     { margin: `0 0 ${tokens.spacing.sm}px`, color: tokens.colors.textoPrimario,
                  fontSize: tokens.typography.sizes.lg, fontWeight: tokens.typography.weights.bold },
vacioBody:      { margin: `0 0 ${tokens.spacing.md}px`, color: tokens.colors.textoSecundario,
                  fontSize: tokens.typography.sizes.md, lineHeight: 1.5 },
vacioCard:      { padding: tokens.spacing.md, border: `1px solid ${tokens.colors.bordeChrome}`,
                  borderRadius: tokens.radii.md, background: tokens.colors.fondoCard },
vacioCaption:   { margin: `0 0 ${tokens.spacing.sm}px`, color: tokens.colors.textoSecundario,
                  fontSize: tokens.typography.sizes.xs, fontWeight: tokens.typography.weights.semibold,
                  textTransform: "uppercase", letterSpacing: "0.04em" },
vacioList:      { margin: 0, paddingLeft: tokens.spacing.lg, lineHeight: 1.6,
                  fontSize: tokens.typography.sizes.md },
```

Mantener `data-testid="inspector-vacio"` en el contenedor exterior.

#### 6.1.2 Envolver `<PersistenciaJson />` en `<details>` cuando vacío

`Inspector.tsx:34` cambia:

```tsx
{modo === "vacio" ? (
  <details style={style.vacioPersistenciaWrapper}>
    <summary style={style.vacioPersistenciaSummary}>Importar / Exportar JSON</summary>
    <PersistenciaJson />
  </details>
) : (
  <PersistenciaJson />
)}
```

Razón: cuando no hay selección, los bloques `Modelos locales / JSON / Archivo JSON` compiten con el call-to-action. Colapsado por defecto baja densidad visual y el operador puede expandir si los necesita.

#### 6.1.3 File picker custom

`PersistenciaJson.tsx:104-116` se reemplaza por:

```tsx
<label style={style.filePicker}>
  <span style={style.fileLabel}>Archivo JSON</span>
  <span style={style.filePickerRow}>
    <span style={style.filePickerButton}>Elegir archivo…</span>
    <span style={style.filePickerName} title={archivoNombre || "Sin archivo"}>
      {archivoNombre || "Sin archivo"}
    </span>
    <input
      aria-label="Archivo JSON"
      style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
      type="file"
      accept="application/json,.json"
      onChange={(event) => {
        void manejarArchivo(event.currentTarget.files?.[0] ?? null);
        event.currentTarget.value = "";
      }}
    />
  </span>
</label>
```

Estilos nuevos (en `style` local de `PersistenciaJson.tsx`):

```ts
filePickerRow:    { display: "flex", alignItems: "center", gap: tokens.spacing.sm,
                    border: `1px solid ${tokens.colors.bordeControl}`,
                    borderRadius: tokens.radii.sm, padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
                    background: tokens.colors.fondoInput, position: "relative" },
filePickerButton: { display: "inline-block", padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
                    border: `1px solid ${tokens.colors.bordeControl}`,
                    borderRadius: tokens.radii.sm, background: tokens.colors.fondoCard,
                    color: tokens.colors.textoPrimario, fontSize: tokens.typography.sizes.sm,
                    fontWeight: tokens.typography.weights.semibold, whiteSpace: "nowrap",
                    cursor: "pointer" },
filePickerName:   { flex: "1 1 auto", minWidth: 0, color: tokens.colors.textoSecundario,
                    fontSize: tokens.typography.sizes.sm,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
```

**Crítico**: el `aria-label="Archivo JSON"` se preserva en el `<input type=file>` aunque visualmente esté oculto. Smoke `01-carga-y-workspace.spec.ts` lo busca por aria-label.

#### 6.1.4 Tarjetas para los tres bloques

`PersistenciaJson.tsx:178-190` (`block`) se cambia a:

```ts
block: { display: "grid", gap: tokens.spacing.md, marginTop: tokens.spacing.lg,
         padding: tokens.spacing.md, border: `1px solid ${tokens.colors.bordeChrome}`,
         borderRadius: tokens.radii.md, background: tokens.colors.fondoCard },
```

(Quita `paddingTop` y `borderTop` actuales, sustituye por tarjeta completa.)

### 6.2 Pasada P2 — Cabecera panel OPL

#### 6.2.1 Reorganizar JSX en 3 clusters

`panelOpl/Toolbar.tsx:23-121` se reordena con dividers entre clusters. Orden final del JSX:

```tsx
<div style={style.toolbar} data-testid="panel-opl-toolbar">
  {/* Cluster 1: chrome del contenedor */}
  <button data-testid="panel-opl-minimizar" …>▾</button>
  <button data-testid="panel-opl-posicion" …>{svg}</button>
  <span style={style.divider} />

  {/* Cluster 2: display y modos */}
  <button data-testid="panel-opl-toggle-numeracion" …>123</button>
  <button data-testid="panel-opl-ai-text" …>AI</button>
  <button data-testid="panel-opl-editar-libre" …>Editar</button>
  <span style={style.divider} />

  {/* Cluster 3: consulta y exportación */}
  <input data-testid="panel-opl-buscar" placeholder="Buscar en OPL…" … />
  <button data-testid="panel-opl-copiar" …>Copiar</button>
  <button data-testid="panel-opl-exportar-html" …>HTML</button>
  <span style={style.divider} />

  {/* Toggle independiente al extremo derecho */}
  <label style={style.toggle}>
    <input type="checkbox" … /> Filtrar por selección
  </label>
</div>
```

#### 6.2.2 Tokens visuales

`panelOpl/Toolbar.tsx:132-189` se ajusta:

- `toolbar.gap`: `tokens.spacing.sm` (8) en vez de 6.
- `iconButton.height` y `toolbarBtn.height`: 28 (de 26).
- `iconButton.fontSize` y `toolbarBtn.fontSize`: `tokens.typography.sizes.sm` (12) en vez de 11.
- `searchInput.minWidth`: 180 (de 120). `searchInput.maxWidth`: 280 (de 240).
- Agregar:
  ```ts
  divider: { width: 1, height: 18, flex: "0 0 auto", margin: `0 ${tokens.spacing.xs}px`,
             background: tokens.colors.bordeChrome },
  ```

#### 6.2.3 Tipografía y colores con tokens

Reemplazar literales `"11px"`, `"12px"`, `"#586D8C"`, etc. por `tokens.typography.sizes.*` y `tokens.colors.*`. **Cero literales fuera de tokens** después de la pasada (excepto unidades `px` integradas y SVG inline).

### 6.3 Pasada P3 — Toolbar superior

#### 6.3.1 Reorganizar JSX en 5 clusters

`toolbar/ToolbarBase.tsx:241-264` (`<div style={style.actions}>...`) se reescribe con clusters explícitos:

```tsx
<div style={style.actions}>
  {/* Cluster Crear */}
  <button data-testid="toolbar-drag-objeto" …>Objeto</button>
  <button data-testid="toolbar-drag-proceso" …>Proceso</button>
  <button data-testid="toolbar-crear-atributo-numerico" …>+ Atributo</button>
  <span style={style.divider} />

  {/* Cluster Historia */}
  <button title="Deshacer · Ctrl+Z" aria-label="Deshacer" …>↶</button>
  <button title="Rehacer · Ctrl+Shift+Z" aria-label="Rehacer" …>↷</button>
  <span style={style.divider} />

  {/* Cluster Modelo */}
  <button onClick={handleNuevoModelo} …>Nuevo</button>
  <select aria-label="Cargar modelo de ejemplo" …><option disabled>Demo</option>…</select>
  <button onClick={guardarLocal} …>{readOnly ? <img …/> : null}Guardar</button>
  {readOnly ? <span data-testid="indicador-readonly">Solo lectura</span> : null}
  <button onClick={() => confirmarSiDirty(abrirCargarModelo)} …>Cargar</button>
  <span style={style.divider} />

  {/* Children: Cluster Enlace + Cluster Vista (los aporta ToolbarCreacion) */}
  {children}

  {/* Más */}
  <ToolbarMas items={masItems} />
</div>
```

`ToolbarCreacion.tsx:83-113` reemite:

```tsx
return (
  <>
    {/* Cluster Enlace */}
    <label style={style.linkPicker}>
      {/* Quitar el <span>Enlace</span>, dejar solo el select con placeholder "Tipo de enlace…" */}
      <select aria-label="Tipo de enlace" …>
        <option value="">Tipo de enlace…</option>
        {TIPOS_ENLACE.map(item => <option key={item.tipo} value={item.tipo}>{item.label}</option>)}
      </select>
    </label>
    {modoEnlace ? <button … onClick={cancelarEnlace}>Cancelar</button> : null}
    <button data-testid="abrir-menu-tipo-enlace" …>Tipos válidos</button>
    <button data-testid="abrir-biblioteca-cosa" …>Biblioteca</button>
    {modoCreacion ? (
      <>
        <span style={style.stickyBadge} data-testid="indicador-modo-sticky">
          Modo sticky: {modoCreacion === "objeto" ? "Objeto" : "Proceso"}
        </span>
        <button … onClick={handleCancelarCreacion}>Cancelar creación</button>
      </>
    ) : null}
    <span style={style.divider} />

    {/* Cluster Vista */}
    <button data-testid="toggle-grid" …>Grid</button>
    <button data-testid="toolbar-aplicar-layout" …>Auto-layout</button>

    {/* Modal config grid: solo se invoca desde el menú "Más" ahora */}
    <ModalConfiguracionGrid abierto={gridModalAbierto} … />
    {bibliotecaAbierta ? <BibliotecaCosa … /> : null}
    {menuTiposAbierto ? <MenuTipoEnlace … /> : null}
  </>
);
```

#### 6.3.2 Mover `Crear varios objetos/procesos` al menú `⋯ Más`

En `ToolbarBase.tsx:248-249`: eliminar los dos botones `Crear varios objetos`/`Crear varios procesos` del JSX en banda.

En `construirItemsMenuMas` (`ToolbarBase.tsx:353+`): agregar al inicio:

```ts
items.push({ kind: "separador", id: "sep-modos", label: "Modos creación" });
items.push({
  kind: "accion",
  id: "modo-creacion-objeto",
  label: modoCreacion === "objeto" ? "Salir de modo crear objetos" : "Crear varios objetos",
  activo: modoCreacion === "objeto",
  title: "Cada clic en canvas inserta un objeto · Ctrl+clic para salir",
  onClick: () => fijarModoCreacion(modoCreacion === "objeto" ? null : "objeto"),
  testId: "toolbar-modo-creacion-objeto",
});
items.push({
  kind: "accion",
  id: "modo-creacion-proceso",
  label: modoCreacion === "proceso" ? "Salir de modo crear procesos" : "Crear varios procesos",
  activo: modoCreacion === "proceso",
  title: "Cada clic en canvas inserta un proceso · Ctrl+clic para salir",
  onClick: () => fijarModoCreacion(modoCreacion === "proceso" ? null : "proceso"),
  testId: "toolbar-modo-creacion-proceso",
});
```

`construirItemsMenuMas` recibe un parámetro `modoCreacion` y `fijarModoCreacion` adicionales (extender `ParametrosItemsMas` aditivamente).

#### 6.3.3 Eliminar `Config grid` en banda

`ToolbarCreacion.tsx:106` (botón con testId `config-grid`) se elimina. El item del menú `⋯ Más` ya tiene `testId: "toolbar-mas-config-grid"` y reemite la acción.

**Validación previa obligatoria**: ejecutar `rg -n 'data-testid="config-grid"' app/e2e` para confirmar que ningún smoke depende del en-banda. Si depende, **dejar el botón en banda y solo aliviar la toolbar moviendo otras acciones**, documentar la decisión en commit.

#### 6.3.4 Tokens visuales

`toolbar/toolbarStyles.ts:293-307` (`botonBase`) se ajusta:

```ts
function botonBase(): preact.JSX.CSSProperties {
  return {
    height: 30,
    padding: `0 ${tokens.spacing.md}px`,
    border: `1px solid ${tokens.colors.bordeInput}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: tokens.typography.sizes.md,
    fontWeight: tokens.typography.weights.semibold,
    whiteSpace: "nowrap",
  };
}
```

(Quita `minWidth: 76`, baja height de 34 a 30, usa tokens.)

`divider` (líneas 179-184) se ajusta:

```ts
divider: { width: 1, height: 22, flex: "0 0 auto",
           margin: `0 ${tokens.spacing.xs}px`,
           background: tokens.colors.bordeChrome },
```

`iconButton` (33-44) baja a `height: 30, width: 30, fontSize: tokens.typography.sizes.lg` (14, no 18) — armoniza con botón.

#### 6.3.5 Iconos para Deshacer/Rehacer

Sustituir labels textuales por unicode `↶`/`↷` (precedente: `☰`, `▾`, `123` en otros toolbars usan caracteres). Mantener `title` y agregar `aria-label` explícito para accesibilidad. Los testIds existentes (si los hay) se preservan.

### 6.4 Cross-pasada — verificación de tokens

Tras P3, ejecutar `rg -n '"#[0-9a-fA-F]{3,8}"' app/src/ui/{toolbar,panelOpl,Inspector,PersistenciaJson,inspectorStyles}*` y confirmar que los únicos hex literales que sobreviven son los que ya existen en `tokens.ts` (cita o `tokens.colors.canvas.*` de paleta canvas, que es invariante). Si aparece un hex nuevo, mover a `tokens.colors`.

## 7. Tests obligatorios

Esta línea **no agrega unit tests nuevos** ni modifica los existentes. El refactor es puramente visual y los unit tests vigentes (283) siguen verde sin cambios.

**Smoke browser** (34, no agregar ni quitar):

- Verificar manualmente con `rg` que los testIds usados en `app/e2e/` siguen presentes en el JSX final tras cada pasada.
- Si un smoke falla post-pasada, **restaurar testId/aria-label**, no editar el smoke.

**Audit visual in-vivo** (obligatorio entre pasadas):

- Tras P1: skill `test-vivo-iterativo-opmkv` con criterio "Inspector vacío legible (jerarquía título/body/atajos visible) y file picker con nombre archivo no truncado".
- Tras P2: skill `test-vivo-iterativo-opmkv` con criterio "Cabecera OPL en 3 clusters separados visualmente, sin solapamiento, search input ≥180px".
- Tras P3: skill `test-vivo-iterativo-opmkv` con criterio "Toolbar superior en clusters legibles, sin truncamiento de `Auto-layout`, sin `Crear varios *` en banda".

Cada audit produce un reporte ejecutivo + screenshots actualizados. La evidencia se referencia desde el commit de la pasada.

## 8. Verificación

```bash
cd /home/felix/projects/deep-opm-pro/app

# Antes de empezar la pasada: snapshot del estado de testIds afectados
rg -n "data-testid=" src/ui/<archivos-de-la-pasada>
rg -n "<testId>" e2e/

# Loop verde por pasada (obligatorio antes de commit)
bun run check                 # typecheck + 283 unit
bun run browser:smoke         # 34 smoke

# Audit visual in-vivo entre pasadas (obligatorio)
# Invocar skill: test-vivo-iterativo-opmkv

# Build final tras P3 (validar peso esperado)
bun run build                 # ~843 KB ± 5%
```

Criterio de cierre por pasada:

1. `bun run check` verde.
2. `bun run browser:smoke` verde, con la misma cantidad de tests que la base (34).
3. Audit visual in-vivo CLEAR para los criterios de la pasada.
4. Cero hex literales nuevos fuera de `tokens.ts`.
5. Cero testIds eliminados (rg de cobertura limpia).
6. Commit con mensaje descriptivo + footer co-author + referencia al bug ID.

## 9. Decisiones bloqueadas (no reabrir)

- **Tokens**: usar exclusivamente `app/src/ui/tokens.ts` existente. No introducir Tailwind ni CSS modules ni styled-components.
- **Stack**: Preact con `style={...}` literal. No reescribir como CSS modules en esta ronda.
- **Paleta canvas**: invariante por `docs/JOYAS.md`. El chrome UI usa `colors.acentoUi*`, `colors.chrome*`, `colors.borde*`, `colors.texto*`, **nunca** `colors.canvas.proceso/objeto/enlace`.
- **Tres pasadas seriales, no paralelas**: P1 → P2 → P3 en ese orden, cada una con su audit visual antes de la siguiente.
- **Preservación de testIds y aria-labels**: dura. Mover acciones no implica eliminar testIds.
- **`ToolbarMas` no se modifica**: ya implementa el patrón de menú accesible. P3 sólo agrega items vía `construirItemsMenuMas`.
- **Demo se mantiene como `<select>`**: aunque visualmente parezca botón, es un select con placeholder. P3 no convierte a botón — solo lo deja en cluster Modelo.

## 10. Decisiones que tomas vos (documentar en commit)

- **Iconos para Deshacer/Rehacer**: caracteres unicode `↶`/`↷`, SVG inline, o emoji. Recomendación: unicode por simplicidad y precedente (`☰`, `▾`).
- **Etiqueta del botón de layout**: `Auto-layout`, `Layout`, o icono `⤺`. Recomendación: `Auto-layout` (preserva legibilidad y elimina truncamiento).
- **Placeholder del select de enlace**: `Tipo de enlace…`, `Crear enlace…`, o solo `Enlace…`. Recomendación: `Tipo de enlace…`.
- **Colapso de `<details>` para `PersistenciaJson` cuando inspector vacío**: por defecto colapsado (recomendado) o expandido. Si el operador objeta el colapso por defecto, alternativa: tarjeta compacta sin `<details>`.
- **Si `Config grid` en banda no se puede eliminar por dependencia smoke**: alternativa documentada — dejarlo en banda en cluster Vista junto a Grid, con etiqueta más corta `Grid…` o icono `⚙`.
- **Dividers en cluster mappings**: si un audit visual reporta que los dividers son demasiado prominentes, bajar `height: 22` a `18` o usar `background: tokens.colors.bordeSuave`.
- **Tipografía y peso del título `InspectorVacio`**: 14/700 recomendado, alternativa 16/700 si audit lo pide.

## 11. Forma del entregable

Tres commits exactos en `main` (rama actual, no crear branch nueva salvo instrucción explícita), uno por pasada, en este orden:

```
style(inspector): rediseña Inspector vacío con jerarquía y reemplaza file picker truncado

Cierra parcialmente BUG-20260507T212356Z-692129 (P1).
- InspectorVacio con título, body secundario y card "Atajos para empezar".
- PersistenciaJson envuelto en <details> colapsado cuando inspector vacío.
- <input type=file> reemplazado por label custom + nombre con ellipsis.
- Bloques Modelos locales / JSON / Archivo JSON en tarjeta con tokens.
Audit: docs/bugs/BUG-20260507T212356Z-692129/ — P1 CLEAR.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

```
style(opl-pane): agrupa cabecera del panel OPL en 3 clusters con dividers

Cierra parcialmente BUG-20260507T212356Z-692129 (P2).
- Cluster chrome (▾, ↔), cluster display (123, AI, Editar), cluster consulta (búsqueda, Copiar, HTML).
- Toggle Filtrar por selección al extremo derecho con divider.
- Tipografía 12 (de 11), height 28 (de 26), search input minWidth 180.
- Tokens centralizados; cero hex literales nuevos.
Audit: docs/bugs/BUG-20260507T212356Z-692129/ — P2 CLEAR.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

```
refactor(toolbar): reorganiza toolbar superior en 5 clusters por intención

Cierra BUG-20260507T212356Z-692129 (P3).
- Clusters Crear · Historia · Modelo · Enlace · Vista, separados por dividers.
- Crear varios objetos/procesos migran al menú ⋯ Más, testIds preservados.
- Config grid en banda eliminado (queda solo en menú ⋯ Más).
- Deshacer/Rehacer como iconos ↶/↷ con aria-label explícito.
- botonBase sin minWidth, height 30, padding y tipografía con tokens.
- Auto-layout reemplaza Sugerir layout (cabe sin truncamiento).
Audit: docs/bugs/BUG-20260507T212356Z-692129/ — P3 CLEAR.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

**Qué no tocar en commits**:

- `docs/HANDOFF.md` (lo actualiza el cierre de ronda).
- `docs/historias-usuario-v2/`.
- `docs/JOYAS.md`.
- Archivos de modelo, store, render, serialización, opl.
- Otros toolbars no listados en sección 4.

**Reporte mínimo al cerrar la línea** (todas las pasadas):

- 3 hashes de commits (P1, P2, P3).
- Audit visual: 3 reportes generados por `test-vivo-iterativo-opmkv` con verdict CLEAR.
- Smoke: 34/34 verde.
- Unit: 283/283 verde.
- Build: tamaño antes vs después.
- Decisiones tomadas (sección 10) con rationale en cada commit.
- Bloqueos pendientes si los hay.
- Confirmación de loop verde por pasada.
