# L1 — Inspector en tabs Semántica/Enlaces/Refinamiento/Apariciones/Estilo

## 1. Misión

Particionar el Inspector de entidad en **5 tabs por intención**, igual que la toolbar agrupada por clusters en ronda 19 L1. Hoy `InspectorEntidad.tsx` muestra todo al mismo tiempo: header, descripción, alias/URLs/imagen avanzados, esencia/afiliación, tamaño, refinamiento, estados, estilo. Al seleccionar un proceso descompuesto la columna se vuelve un muro operacional (informe líneas 98-103). La meta es: al seleccionar un proceso descompuesto, **la primera pantalla** muestra significado y refinamiento principal **sin scroll excesivo**.

**Slice mínimo entregable**:

1. `<Inspector />` mantiene branch `entidad / enlace / vacio` igual que hoy.
2. Cuando entra en branch `entidad`, se renderiza `<InspectorEntidad />` con un `<InspectorTabs />` arriba que ofrece 5 tabs en orden estricto:
   - **Semántica** (tab default): nombre, descripción, esencia/afiliación, alias, URLs, imagen, atributos, **estados** (movidos desde sección plana actual).
   - **Enlaces**: relaciones actuales y links derivados (cobertura apariencias).
   - **Refinamiento**: in-zoom, unfold, OPD hijo, external links, plegado, auto-invocación.
   - **Apariciones**: en qué OPDs aparece y atajos para navegar.
   - **Estilo**: imagen, color, layout local (`<StyleControls />`).
3. `<InspectorEnlace />` también recibe tabs simétricos (al menos 3): **Propiedades**, **Extremos**, **Estilo**.
4. Tab activo persiste por sesión en `store.uiPanel.tabInspectorActivo: TabInspectorEntidad | TabInspectorEnlace`.
5. Cuando la entidad cambia: si el tab activo no aplica al nuevo tipo (ej. tab `Estados` con un proceso seleccionado), default a `Semántica`.
6. **Apariciones** es un tab nuevo que reemplaza el banner inline `inspector-cobertura-apariencias` actual. El banner se preserva como hint compacto en tab Semántica para no perder contexto cross-OPD.

**Pendientes explícitos fuera de slice**:

- No implementar lazy-render por tab (sería micro-optimización; la entidad cabe en memoria).
- No tocar el contenido de cada `<SeccionXxx />` (solo se mueven a su tab).
- No reescribir `<InspectorEnlace />` desde cero; los tabs simétricos son envoltura.
- No tocar el modal de duración de estado, modal URLs, modal imagen.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-11.030 (NUEVO) | `docs/historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md` (declarar al final como propuesta) | Inspector en tabs por intención |
| HU-11.031 (NUEVO) | (idem epic) | Tab activo persiste por sesión |
| HU-17.050 (NUEVO) | `docs/historias-usuario-v2/epicas/epica-17-canvas-objetos-avanzados.md` | Tab Apariciones con navegación por OPD |
| HU-50.040 (NUEVO) | (relacionado al cross-link OPL→Inspector) | Selección desde OPL respeta el tab apropiado |

Si las HU no existen aún, declararlas en el commit como propuestas con cita literal del informe.

## 3. Anclaje a evidencia

- SSOT: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md` §"interfaz: significado vs vista" + `opm-iso-19450-es.md` §"refinamiento descomp/despliegue" §"estados".
- Corpus reusable:
  - `opm-extracted/INDEX.md`, `opm-extracted/MODULES.md` clases `InspectorComponent`, `InspectorTabComponent`, `InspectorEntityComponent`. Revisar layout original de OPCloud para tabs antes de inventar.
  - `opm-extracted/assets/svg/` — iconos por tab si conviene.
  - `app/src/ui/InspectorEntidad.tsx` (~228 LOC) — lectura completa antes de modificar.
  - `app/src/ui/InspectorEnlace.tsx` — lectura completa.
  - `app/src/ui/inspector/Seccion*.tsx` — secciones existentes.
  - `app/src/ui/inspectorEnlace/Seccion*.tsx` — secciones de enlace.
  - `app/src/ui/inspectorStyles.ts` (~233 LOC) — estilos centralizados.
- Estado actual: `Inspector.tsx` orquesta vacio/entidad/enlace; `InspectorEntidad.tsx` renderiza todas las secciones en orden plano; el banner `inspector-cobertura-apariencias` aparece inline cuando hay cobertura ≥2 OPDs.

## 4. Archivos permitidos

```
app/src/ui/Inspector.tsx                                    EDIT aditivo (sin cambios estructurales)
app/src/ui/InspectorEntidad.tsx                             EDIT aditivo (envolver secciones en tabs)
app/src/ui/InspectorEnlace.tsx                              EDIT aditivo (envolver secciones en tabs)
app/src/ui/inspector/InspectorTabs.tsx                      NUEVO (componente genérico de tabs)
app/src/ui/inspector/InspectorTabs.test.tsx                 NUEVO
app/src/ui/inspector/SeccionApariciones.tsx                 NUEVO (extrae lógica de cobertura)
app/src/ui/inspector/SeccionApariciones.test.tsx            NUEVO
app/src/ui/inspector/aparicionesUtils.ts                    NUEVO (helpers puros)
app/src/ui/inspector/aparicionesUtils.test.ts               NUEVO
app/src/ui/inspectorStyles.ts                               EDIT aditivo (tabs styles)
app/src/ui/tokens.ts                                        EDIT aditivo (tabs)
app/src/store/uiPanel.ts                                    EDIT aditivo (tabInspectorActivo)
app/src/store/sliceTypes.ts                                 EDIT aditivo (tipo TabInspector*)
app/src/store/modelo/acciones-ui.ts                         EDIT aditivo (cambiarTabInspector)
app/e2e/01-carga-y-workspace.spec.ts                        LECTURA
app/e2e/15-superficie-contextual.spec.ts                    LECTURA o EDIT aditivo
app/e2e/20-inspector-tabs.spec.ts (NUEVO)                   NUEVO
docs/historias-usuario-v2/... (NO TOCAR)                    LECTURA
```

## 5. Restricciones de no-colisión

- **L4 toca `SeccionLayoutEstados`**: agrega un modal de creación de estados y reemplaza la creación con `estado1/estado2`. L1 solo mueve `<SeccionLayoutEstados />` al tab Semántica del Inspector — **no toca su lógica interna**. Si L4 cierra antes, el modal vive dentro del tab; si L1 cierra antes, L4 toca un componente que vive en su tab y modifica solo su contenido.
- **L2 OPL editor**: cuando OPL editor honesto aplica un cambio que selecciona una entidad, el tab default `Semántica` debe mostrar el cambio. Coordinación por contrato leve: `seleccionarDesdeOpl(...)` ya existe; basta que L1 garantice que `cambiarTabInspector("semantica")` se invoque al cambiar la selección desde OPL si el tab actual no aplica.
- **L3 biblioteca dock**: ortogonal. Cero colisión.

## 6. Slice mínimo shippeable

### Tipos en `sliceTypes.ts`

```ts
export type TabInspectorEntidad = "semantica" | "enlaces" | "refinamiento" | "apariciones" | "estilo";
export type TabInspectorEnlace = "propiedades" | "extremos" | "estilo";

export interface UiPanelSlice {
  // ... existentes
  tabInspectorEntidadActivo: TabInspectorEntidad;
  tabInspectorEnlaceActivo: TabInspectorEnlace;
  cambiarTabInspectorEntidad(tab: TabInspectorEntidad): void;
  cambiarTabInspectorEnlace(tab: TabInspectorEnlace): void;
}
```

### `inspector/InspectorTabs.tsx`

```tsx
interface Props<T extends string> {
  tabs: ReadonlyArray<{ id: T; label: string; testid: string }>;
  activo: T;
  onCambiar: (tab: T) => void;
  ariaLabel: string;
}

export function InspectorTabs<T extends string>(props: Props<T>) {
  return (
    <div role="tablist" aria-label={props.ariaLabel} style={style.tabsRow}>
      {props.tabs.map((tab) => {
        const seleccionado = tab.id === props.activo;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={seleccionado}
            aria-controls={`inspector-panel-${tab.id}`}
            data-testid={tab.testid}
            style={seleccionado ? style.tabActive : style.tab}
            onClick={() => props.onCambiar(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
```

### Tab map

```ts
const TABS_ENTIDAD: ReadonlyArray<{ id: TabInspectorEntidad; label: string; testid: string }> = [
  { id: "semantica", label: "Semántica", testid: "inspector-tab-semantica" },
  { id: "enlaces", label: "Enlaces", testid: "inspector-tab-enlaces" },
  { id: "refinamiento", label: "Refinamiento", testid: "inspector-tab-refinamiento" },
  { id: "apariciones", label: "Apariciones", testid: "inspector-tab-apariciones" },
  { id: "estilo", label: "Estilo", testid: "inspector-tab-estilo" },
];
```

### Estructura de InspectorEntidad

```tsx
<>
  <Header entidad={entidad} />
  <CoberturaHint cobertura={cobertura} /> {/* solo si cobertura ≥ 2 OPDs */}
  <InspectorTabs tabs={TABS_ENTIDAD} activo={tabActivo} onCambiar={cambiarTab} ariaLabel="Inspector entidad" />
  <div role="tabpanel" id={`inspector-panel-${tabActivo}`} style={style.tabPanel}>
    {tabActivo === "semantica" ? <PanelSemantica entidad={entidad} ... /> : null}
    {tabActivo === "enlaces" ? <PanelEnlaces entidad={entidad} ... /> : null}
    {tabActivo === "refinamiento" ? <PanelRefinamiento entidad={entidad} ... /> : null}
    {tabActivo === "apariciones" ? <SeccionApariciones modelo={modelo} entidad={entidad} ... /> : null}
    {tabActivo === "estilo" ? <PanelEstilo entidad={entidad} ... /> : null}
  </div>
</>
```

Cada `Panel*` es **wrapper local** que monta las `Seccion*` existentes en su tab. No hay reescritura de secciones. Lo único nuevo es:

- Reordenar: `SeccionDescripcion`, `SeccionEsenciaAfiliacion`, `SeccionAlias`, `SeccionUrls`, `SeccionImagen`, `SeccionAtributo`, `SeccionLayoutEstados` → tab Semántica.
- `SeccionRefinamiento`, `SeccionTamano` → tab Refinamiento.
- `<StyleControls />` → tab Estilo.
- Tab Apariciones es nuevo y muestra: lista de OPDs donde la entidad aparece, conteo, click → navegar.
- Tab Enlaces es nuevo y muestra: enlaces actuales (in/out) con su tipo, contraparte, OPD; click → seleccionar enlace en canvas.

### `SeccionApariciones.tsx`

```tsx
interface Props {
  modelo: Modelo;
  entidad: Entidad;
  onNavegar: (opdId: Id, aparienciaId: Id) => void;
}

export function SeccionApariciones({ modelo, entidad, onNavegar }: Props) {
  const apariciones = useMemo(() => listarApariciones(modelo, entidad.id), [modelo, entidad.id]);
  if (apariciones.length === 0) {
    return <p style={style.empty}>Sin apariencias en otros OPDs.</p>;
  }
  return (
    <div data-testid="seccion-apariciones" style={style.list}>
      {apariciones.map((item) => (
        <button
          key={`${item.opdId}-${item.aparienciaId}`}
          onClick={() => onNavegar(item.opdId, item.aparienciaId)}
          style={style.aparienciaItem}
          data-testid={`aparicion-${item.opdId}`}
        >
          <span style={style.opdName}>{item.opdNombre}</span>
          <span style={style.aparienciaInfo}>{item.refinamientoTipo ?? "raíz"}</span>
        </button>
      ))}
    </div>
  );
}
```

### Persistencia de tab activo

- Default tab al cambiar selección: si la nueva entidad es proceso → `semantica`. Si es objeto → `semantica`. Default genérico = `semantica`.
- Si el usuario cambia de entidad **del mismo tipo**, mantener tab activo.
- Si cambia de tipo (proceso → objeto) y el tab actual no aplica (no hay tabs específicos por tipo en este slice; los 5 aplican a ambos), mantener tab.

### Ajuste mínimo en banner cobertura

El banner `inspector-cobertura-apariencias` se preserva como **hint compacto** en tab Semántica (1 línea: `"Aparece en 3 OPDs"` con click → tab Apariciones). Esto no rompe el smoke que lo localiza por testId.

## 7. Tests obligatorios

- Unit (~12 tests nuevos):
  - `InspectorTabs` renderiza N tabs con `role="tablist"` y cada tab tiene `aria-selected` correcto.
  - Click en tab dispara `onCambiar(id)` con el id correcto.
  - `aparicionesUtils.listarApariciones` devuelve 0 cuando la entidad no aparece, ≥1 con OPDs ordenados, incluye refinamientoTipo correcto.
  - `acciones-ui.cambiarTabInspectorEntidad` actualiza store.
  - `acciones-ui.cambiarTabInspectorEnlace` actualiza store.
- Smoke (~3 tests nuevos en `e2e/20-inspector-tabs.spec.ts`):
  - Seleccionar proceso → 5 tabs visibles, default `Semántica`, descripción + esencia/afiliación visibles sin scroll.
  - Click tab `Refinamiento` → secciones de refinamiento visibles, secciones semánticas ocultas.
  - Click tab `Apariciones` con entidad multi-OPD → lista de OPDs, click en uno navega.
- Smoke 15 (`superficie-contextual`) ajustado si el banner cobertura cambió de testid (no debería).

## 8. Verificación

```bash
cd app
bun run check                                    # 977+ unit a no romper
bun run lint                                     # clean
bun run browser:smoke                            # 149+ smoke a no romper
bun run build                                    # < 340 KB
```

Audit visual con `test-vivo-iterativo-opmkv`:

- Cargar fixture con proceso descompuesto (App modeladora, OnStar).
- Verificar criterio de salida del informe línea 114: "Al seleccionar un proceso descompuesto, la primera pantalla del inspector debe mostrar significado y refinamiento principal sin scroll excesivo." → tab Semántica visible sin scroll a 1280x720; refinamiento accesible con 1 click.
- Comparar lado a lado con screenshot `33-after-process-decompose.png` del audit 2026-05-07.
- Verificar que en cada tab los smokes existentes que lo apuntan siguen verdes (testIds preservados).

## 9. Decisiones bloqueadas (no reabrir)

- **5 tabs entidad / 3 tabs enlace exactos**. No agregar más.
- **Default tab = Semántica** para entidades. **Default tab = Propiedades** para enlaces.
- **Tab activo persiste en store, no en localStorage** (ya hay slice `uiPanel`; agregar otro localStorage es scope creep).
- **No tocar contenido de Seccion***. Solo se mueven al tab correspondiente.
- **No agregar lazy-render por tab** (ver §1 fuera de slice).

## 10. Decisiones que tomas vos (documentar en commit)

- Si los tabs llevan icono además de texto (recomendado: solo texto, fontWeight=600 cuando activo).
- Si el divisor entre tabs es línea sólida o gap mayor.
- Si el tab `Estilo` muestra `<StyleControls />` directamente o lo envuelve en un wrapper que muestra resumen "Personalización: ninguna" cuando no hay overrides.
- Si la sección `Apariciones` muestra cobertura por OPD (`SD: 1, SD1: 2`) o lista plana.

## 11. Forma del entregable

- Commit 1: `feat(inspector): tabs Semantica/Enlaces/Refinamiento/Apariciones/Estilo` — InspectorTabs + InspectorEntidad refactor + InspectorEnlace tabs.
- Commit 2: `feat(inspector): tab Apariciones con navegacion cross-OPD` — SeccionApariciones nueva.
- Commit 3: `test(inspector): cubre tabs entidad/enlace y persistencia de tab activo`.
- Co-author: `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` o el agente correspondiente.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
