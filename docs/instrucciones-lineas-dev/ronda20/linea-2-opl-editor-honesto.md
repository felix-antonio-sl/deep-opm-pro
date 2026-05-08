# L2 — OPL editor honesto: texto vs sentencias reconocidas vs cambios aplicables/no aplicables

## 1. Misión

Hacer **honesto el contrato del editor OPL**. Hoy `Editar OPL` (modo `editorLibre` en `PanelOpl.tsx`) muestra muchas sentencias parseadas como "no aplicables" sin explicar qué se aplicará al modelo y qué es texto libre. El usuario no distingue entre escribir texto, modificar OPL existente o agregar una sentencia que cambie el modelo. La meta del informe línea 147: "antes de aplicar debe quedar claro que cambios modificaran el modelo y cuales son solo texto no accionable."

**Slice mínimo entregable**:

1. El modo edición OPL muestra cuatro grupos visualmente distintos en el panel de previsualización antes de aplicar:
   - **Texto editado**: el textarea libre.
   - **Sentencias reconocidas**: cuántas líneas el parser logró interpretar como OPL (con citas a regla canónica).
   - **Cambios aplicables**: lista de cambios concretos que se aplicarán al modelo cuando se confirme (ej. "Renombra entidad X a Y", "Crea enlace Z").
   - **No aplicables**: líneas que el parser no entiende, mostradas con razón ("forma OPL desconocida", "entidad referida no existe", "cambio ya presente en modelo").
2. Botón "Aplicar" deshabilitado si no hay cambios aplicables, o etiquetado claramente con conteo: `"Aplicar 3 cambios"`.
3. Al hover sobre una línea no aplicable, tooltip explica la razón.
4. Helper puro `clasificarEdicionOplLinea(linea, plan)` que mapea cada línea a `{ estado: "aplicable" | "no-aplicable" | "ignorada-vacia", razon?: string, cambioId?: string }`.
5. La barra del panel OPL minimizado mejora con contador estable: `"OPL · 135 oraciones"` en lugar del rail pobre y truncado actual.

**Pendientes explícitos fuera de slice**:

- No reescribir el parser OPL (`opl/parser.ts`); solo agregar el clasificador de planificación honesta sobre el output existente `PrevisualizacionOplReverse`.
- No implementar undo del aplicado (ya existe via `aplicarEdicionOplLibre` + sistema undo del store).
- No implementar autocompletado/lint en el textarea.
- No tocar la generación OPL (`opl/generar.ts`).
- No reorganizar la posición lateral/inferior del panel (eso queda).

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-50.040 (NUEVO) | `docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` (declarar al final como propuesta) | Editor OPL clasifica cambios aplicables vs texto |
| HU-50.041 (NUEVO) | (idem epic) | Conteo de cambios en botón "Aplicar" |
| HU-50.042 (NUEVO) | (idem epic) | Tooltip de razón en líneas no aplicables |
| HU-50.043 (NUEVO) | (idem epic) | Rail OPL minimizado con contador legible |
| HU-50.022 (existente) | (canónica) | Edición OPL → canvas (se respeta el contrato) |

## 3. Anclaje a evidencia

- SSOT: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opl-es-es.md` §"sentencias OPL canónicas" + `metodologia-opm-es.md` §"OPL como lente bimodal".
- Corpus reusable:
  - `app/src/opl/parser.ts` — `planificarEdicionOplLibre()` ya retorna un plan; lectura completa antes de modificar.
  - `app/src/opl/generar.ts` — generación; lectura.
  - `app/src/ui/PanelOpl.tsx` (~353 LOC) — orquestación actual del editor libre.
  - `app/src/ui/panelOpl/Toolbar.tsx` — barra de acciones.
  - `opm-extracted/INDEX.md` clases `OplPaneComponent`, `OplEditorComponent`, `OplParserService`. Revisar cómo OPCloud separa preview de aplicación.
  - `opm-extracted/MODULES.md` para encontrar el patrón de "preview before apply" si existe.
  - Evidencia visual: `docs/audits/opm-app-ux-2026-05-07/screenshots/39-opl-edit-mode.png`, `40-opl-search-driver-rescuing.png`, `42-opl-minimized.png`, `43-opl-restore-attempt.png`.
- Estado actual: el editor libre muestra `previewLibre.cambios` y `previewLibre.errores`, pero de forma plana y sin clasificación visual clara.

## 4. Archivos permitidos

```
app/src/opl/parser.ts                                   EDIT aditivo (NO renombrar exports; agregar campos a PrevisualizacionOplReverse si hace falta)
app/src/opl/clasificadorEdicion.ts                      NUEVO (helper puro)
app/src/opl/clasificadorEdicion.test.ts                 NUEVO
app/src/ui/PanelOpl.tsx                                 EDIT aditivo (refactor del bloque editorLibre)
app/src/ui/panelOpl/Toolbar.tsx                         EDIT aditivo (botón "Aplicar N cambios")
app/src/ui/panelOpl/EditorOplHonesto.tsx                NUEVO (componente que renderiza los 4 grupos)
app/src/ui/panelOpl/EditorOplHonesto.test.tsx           NUEVO
app/src/ui/tokens.ts                                    EDIT aditivo (severidades aplicable/no-aplicable/ignorada)
app/src/ui/panelOpl/styles.ts (si existe; sino inline)  EDIT aditivo o NUEVO archivo
app/e2e/03-opl-panel.spec.ts                            EDIT aditivo
app/e2e/20-opl-editor-honesto.spec.ts (NUEVO)           NUEVO
docs/historias-usuario-v2/...                           NO TOCAR
```

## 5. Restricciones de no-colisión

- **L1 inspector tabs**: cuando el usuario aplica un cambio OPL que selecciona una entidad, el Inspector debe activar tab `Semántica`. L2 no toca Inspector; basta con que `aplicarEdicionOplLibre` o el handler de cambio invoque `seleccionarDesdeOpl(...)` (ya existe). L1 garantiza el resto.
- **No tocar `opl/generar.ts`**: la generación es ortogonal a la edición.
- **No tocar `Bloques.tsx` ni `RenderToken.tsx`**: son render de oraciones, no del editor libre.
- **`store/runtime.ts` / `store/modelo/acciones-opl.ts`** (si existe): solo lectura.

## 6. Slice mínimo shippeable

### `opl/clasificadorEdicion.ts` (puro, testeable)

```ts
import type { Modelo } from "../modelo/tipos";
import type { PrevisualizacionOplReverse, CambioOplPlanificado, ErrorOplLinea } from "./parser";

export type EstadoLineaOpl = "aplicable" | "no-aplicable" | "ignorada-vacia" | "sin-cambio";

export interface LineaClasificada {
  numero: number;
  texto: string;
  estado: EstadoLineaOpl;
  /** Cuando estado = "aplicable": id del cambio en preview.cambios. */
  cambioId?: string;
  /** Cuando estado = "no-aplicable": razón canónica. */
  razon?: string;
  /** Cuando estado = "no-aplicable": cita SSOT corta para educar. */
  citaSsot?: string;
}

export interface ResumenClasificacion {
  total: number;
  aplicables: number;
  noAplicables: number;
  ignoradas: number;
  sinCambio: number;
}

export function clasificarEdicionOpl(
  texto: string,
  preview: PrevisualizacionOplReverse | null,
  modelo: Modelo,
): { lineas: LineaClasificada[]; resumen: ResumenClasificacion } {
  // 1. Split texto por líneas, mantener numeración 1-based.
  // 2. Para cada línea: si vacía → ignorada-vacia.
  // 3. Si preview.cambios tiene cambio para esa línea → aplicable, cambioId=...
  // 4. Si preview.errores tiene error para esa línea → no-aplicable, razón formateada.
  // 5. Si no se reconoce ni como cambio ni como error pero el parser la procesó como OPL existente y no produce mutación → sin-cambio.
  // 6. Default → no-aplicable con razón "forma OPL no reconocida".
  // 7. Construir resumen con contadores.
}
```

**Mapeo de razones canónicas** (cerrado, documentar en commit):

| Razón interna | Razón visible | Cita SSOT |
|---|---|---|
| `forma-no-reconocida` | "Forma OPL no reconocida" | OPL-ES D1-D8, T1-T3 |
| `entidad-no-existe` | "La entidad referida no existe en el modelo" | Glos 3.55, 3.69 |
| `cambio-ya-presente` | "Este cambio ya está aplicado al modelo" | — |
| `referencia-ambigua` | "Más de una entidad con ese nombre; usa código" | V-201 unicidad |
| `enlace-invalido-firma` | "Firma de enlace inválida para los participantes" | V-180+ |
| `inversa-no-soportada` | "Edición inversa no soportada para este tipo de oración" | — |

### `panelOpl/EditorOplHonesto.tsx`

```tsx
interface Props {
  texto: string;
  onTexto: (texto: string) => void;
  preview: PrevisualizacionOplReverse | null;
  modelo: Modelo;
  onAplicar: () => void;
  onCancelar: () => void;
}

export function EditorOplHonesto(props: Props) {
  const clasificacion = useMemo(
    () => clasificarEdicionOpl(props.texto, props.preview, props.modelo),
    [props.texto, props.preview, props.modelo],
  );

  return (
    <div data-testid="editor-opl-honesto" style={style.layout}>
      <section style={style.grupo} data-grupo="texto">
        <h4 style={style.titulo}>Texto editado</h4>
        <textarea
          data-testid="editor-opl-textarea"
          style={style.textarea}
          value={props.texto}
          onInput={(e) => props.onTexto(e.currentTarget.value)}
        />
      </section>

      <section style={style.grupo} data-grupo="reconocidas">
        <h4 style={style.titulo}>
          Sentencias reconocidas <span style={style.contador}>{clasificacion.resumen.total - clasificacion.resumen.ignoradas}</span>
        </h4>
        <ul style={style.lista}>
          {clasificacion.lineas.map((linea) =>
            linea.estado !== "ignorada-vacia"
              ? <LineaItem key={linea.numero} linea={linea} compacta />
              : null
          )}
        </ul>
      </section>

      <section style={style.grupo} data-grupo="aplicables">
        <h4 style={style.titulo}>
          Cambios aplicables <span style={style.contadorVerde}>{clasificacion.resumen.aplicables}</span>
        </h4>
        <ul style={style.lista}>
          {clasificacion.lineas
            .filter((l) => l.estado === "aplicable")
            .map((linea) => <LineaItem key={linea.numero} linea={linea} mostrarCambio cambios={props.preview?.cambios ?? []} />)}
        </ul>
      </section>

      <section style={style.grupo} data-grupo="no-aplicables">
        <h4 style={style.titulo}>
          No aplicables <span style={style.contadorAmbar}>{clasificacion.resumen.noAplicables}</span>
        </h4>
        <ul style={style.lista}>
          {clasificacion.lineas
            .filter((l) => l.estado === "no-aplicable")
            .map((linea) => <LineaItem key={linea.numero} linea={linea} mostrarRazon />)}
        </ul>
      </section>

      <footer style={style.footer}>
        <button
          type="button"
          data-testid="editor-opl-aplicar"
          disabled={clasificacion.resumen.aplicables === 0}
          onClick={props.onAplicar}
          style={clasificacion.resumen.aplicables > 0 ? style.aplicarActivo : style.aplicarInactivo}
        >
          {clasificacion.resumen.aplicables > 0
            ? `Aplicar ${clasificacion.resumen.aplicables} ${clasificacion.resumen.aplicables === 1 ? "cambio" : "cambios"}`
            : "Sin cambios aplicables"}
        </button>
        <button type="button" data-testid="editor-opl-cancelar" onClick={props.onCancelar} style={style.cancelar}>
          Cancelar
        </button>
      </footer>
    </div>
  );
}
```

### Rail minimizado

Cuando `preferenciasOpl.oplMinimizado === true`, el panel mostraba un rail pobre. Reemplazar por:

```tsx
<button
  data-testid="opl-rail-restore"
  onClick={restaurarOpl}
  style={style.rail}
  aria-label={`Restaurar panel OPL — ${oraciones} oraciones`}
>
  <span style={style.railLabel}>OPL</span>
  <span style={style.railContador}>{oraciones} oraciones</span>
</button>
```

`oraciones` se calcula de `lineas.length` (ya disponible). El testid existente `panel-opl-restore` o equivalente debe preservarse — verificar antes de modificar.

### Cambios mínimos en `parser.ts`

`PrevisualizacionOplReverse` puede necesitar exponer `lineaNumero: number` por cambio y por error para que el clasificador haga el mapeo. **Si ya lo expone, no tocar**. Si no, agregar campo opcional sin romper consumers existentes.

## 7. Tests obligatorios

- Unit (~14 tests nuevos):
  - `clasificarEdicionOpl` para texto vacío → todas líneas `ignorada-vacia`.
  - `clasificarEdicionOpl` con 1 cambio aplicable → estado correcto y `cambioId` presente.
  - `clasificarEdicionOpl` con 1 línea no reconocida → estado `no-aplicable` con razón `forma-no-reconocida`.
  - `clasificarEdicionOpl` con entidad no existente → estado `no-aplicable` con razón `entidad-no-existe`.
  - `clasificarEdicionOpl` con cambio ya presente → estado `sin-cambio`.
  - `clasificarEdicionOpl` resumen cuenta correctamente cada caso.
  - `<EditorOplHonesto />` (preact-testing-library):
    - Renderiza 4 grupos con sus contadores.
    - Botón "Aplicar" deshabilitado cuando `aplicables === 0`.
    - Botón muestra "Aplicar 3 cambios" cuando hay 3.
    - Botón muestra "Aplicar 1 cambio" cuando hay 1.
- Smoke (~4 tests nuevos en `e2e/20-opl-editor-honesto.spec.ts`):
  - Abrir `Editar OPL`, escribir texto válido (renombrar 1 entidad) → ver "Cambios aplicables: 1" y botón "Aplicar 1 cambio".
  - Escribir texto inválido (oración basura) → ver "No aplicables: 1" con razón visible.
  - Botón "Aplicar" deshabilitado cuando no hay cambios.
  - Minimizar panel OPL → rail muestra "OPL · N oraciones" no truncado.

## 8. Verificación

```bash
cd app
bun run check
bun run lint
bun run browser:smoke
bun run build       # ≤ 340 KB; este componente agrega ~3-5 KB
```

Audit visual con `test-vivo-iterativo-opmkv`:

- Cargar fixture grande (App modeladora, OnStar).
- Abrir `Editar OPL`.
- Escribir 3 líneas con mezcla aplicable/no aplicable.
- Verificar criterio del informe línea 147: "antes de aplicar debe quedar claro que cambios modificaran el modelo y cuales son solo texto no accionable" → 4 grupos visibles, contadores legibles, botón Aplicar con conteo.
- Minimizar OPL: rail debe leer "OPL · N oraciones" completo a 1280x720 sin truncamiento.

## 9. Decisiones bloqueadas (no reabrir)

- **4 grupos visuales fijos**: texto, reconocidas, aplicables, no-aplicables. No agregar más.
- **Botón "Aplicar" siempre incluye conteo** cuando hay aplicables.
- **No bloquear edición** si hay líneas no aplicables; solo no aplicar las no aplicables al confirmar (comportamiento actual del parser).
- **Citas SSOT en razones de no-aplicable** son cortas (≤ 40 chars), no bloque entero.
- **Tipografía monoespaciada en textarea** (consistencia con OPL).

## 10. Decisiones que tomas vos (documentar en commit)

- Si los grupos son `<details>` colapsables o secciones planas (recomendado: planas para que el usuario vea todo de un vistazo).
- Si la línea no aplicable muestra el numero de línea + cita corta + razón (recomendado: `"L3: Forma OPL no reconocida (OPL-ES D1)"`).
- Si el rail minimizado lleva además un dot indicador de "hay cambios sin aplicar" (recomendado: no, scope creep).
- Layout exacto de los 4 grupos: stack vertical vs grid 2x2 (recomendado: stack vertical para que el textarea quede arriba y la previsualización debajo, fluyente).

## 11. Forma del entregable

- Commit 1: `feat(opl): clasificador de edicion aplicable/no-aplicable/ignorada` — `clasificadorEdicion.ts` + tests.
- Commit 2: `feat(opl): editor honesto con 4 grupos y boton de conteo` — `EditorOplHonesto.tsx` + integración en `PanelOpl.tsx`.
- Commit 3: `style(opl): rail minimizado con contador estable` — refactor del rail.
- Commit 4: `test(e2e): editor OPL honesto cubre clasificacion y conteo`.
- Co-author footer estándar.
- No tocar HANDOFF.md ni motor OPL (parser/generar más allá del campo opcional `lineaNumero`).
