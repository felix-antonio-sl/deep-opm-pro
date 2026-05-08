# L4 — Creación de estados con nombres reales y preview OPL

## 1. Misión

Eliminar el patrón **`estado1 / estado2`** como default de creación de estados y reemplazarlo por un **modal de creación de estados con nombres reales y preview OPL**. Hoy `<SeccionLayoutEstados />` ofrece "Agregar estados" que crea simultáneamente `estado1` y `estado2` (placeholder pobre) o "Agregar estado" que crea uno con nombre genérico. El informe línea 102: "Los estados `estado1` y `estado2` son placeholders pobres para modelamiento serio." Línea 114: "Crear estados debe pedir nombres reales y mostrar preview OPL antes de aplicar."

**Slice mínimo entregable**:

1. Nuevo modal `<ModalCrearEstados />` que se abre desde `<SeccionLayoutEstados />` cuando el objeto **no tiene estados** (primera creación) o cuando el usuario elige "Agregar estado nuevo" (estado adicional).
2. El modal pide:
   - **Nombre estado 1** (obligatorio, min 1 char, validación nominal HU-SHARED-009).
   - **Nombre estado 2** (obligatorio si es primera creación; opcional si es adición).
   - **Designación** opcional por estado: `inicial / final / canónico` (existente, con valores `inicial | final | canonico`).
3. **Preview OPL en vivo** dentro del modal: al typear los nombres, mostrar la oración OPL canónica:
   - Para creación inicial: `**Objeto** se encuentra en uno de los siguientes estados: **estadoUno** o **estadoDos**.` (forma OPL-ES D8).
   - Para adición: `**Objeto** suma estado **nuevoEstado**.`
4. Botón "Agregar" deshabilitado hasta que los nombres son válidos.
5. Si la entidad ya tiene 2 o más estados visibles, el botón "Agregar estado" abre el modal solo para 1 nombre nuevo.
6. **Compat backwards**: `agregarEstadosObjeto()` (que hoy crea `estado1/estado2`) NO se elimina; se mantiene como API interna usable por agentes/scripts. Pero la UI ya no la invoca por default — invoca al modal.
7. Atajo `Esc` cancela; `Enter` confirma si los nombres son válidos.

**Pendientes explícitos fuera de slice**:

- No tocar la lógica de designación de estados (existente, funcional).
- No tocar la duración por estado (modal aparte).
- No tocar la supresión/restauración de estados.
- No tocar el motor `agregarEstadoObjeto`/`agregarEstadosObjeto`/`renombrarEstado`.
- No agregar batch creation (>2 estados a la vez); 1 a la vez tras los iniciales.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-13.050 (NUEVO) | `docs/historias-usuario-v2/epicas/epica-13-canvas-estados.md` (declarar como propuesta) | Modal de creación con nombres reales |
| HU-13.051 (NUEVO) | (idem epic) | Preview OPL en vivo |
| HU-13.052 (NUEVO) | (idem epic) | Validación nominal previa a la creación |
| HU-SHARED-009 (existente) | `docs/historias-usuario-v2/shared/HU-SHARED-009-validacion-nominal.md` | Validación nominal canónica |
| HU-SHARED-007 (existente) | `docs/historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md` | Plantillas OPL-ES |

## 3. Anclaje a evidencia

- SSOT: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opl-es-es.md` plantilla `[OPL-ES D8]` (estados de objeto). Glosario `[Glos 3.66]` axioma "al menos dos estados visibles".
- Corpus reusable:
  - `app/src/ui/inspector/SeccionLayoutEstados.tsx` (~80+ LOC, primer 80 ya leídas).
  - `app/src/store/modelo/acciones-*.ts` para `agregarEstadosObjeto`, `agregarEstadoObjeto`, `renombrarEstado`.
  - `app/src/modelo/operaciones.ts` `estadosDeEntidad`, `validarNombre`.
  - `app/src/opl/generar.ts` para reusar el formateo OPL canónico.
  - `app/src/ui/Dialogo.tsx` o componente modal genérico existente — base para el nuevo modal.
  - `opm-extracted/INDEX.md` clases `StateAddDialogComponent`, `StateNamingComponent`. Si OPCloud tiene un dialog específico para crear estados, replicarlo.
  - Evidencia visual: `docs/audits/opm-app-ux-2026-05-07/screenshots/35-add-states-open-or-applied.png`.
- Estado actual: la creación se dispara desde `<SeccionLayoutEstados />` con dos botones que invocan `onAgregarEstados` y `onAgregarEstado` directamente.

## 4. Archivos permitidos

```
app/src/ui/inspector/SeccionLayoutEstados.tsx              EDIT aditivo (mover botones a "Crear estado(s)" que abre modal)
app/src/ui/inspector/ModalCrearEstados.tsx                 NUEVO
app/src/ui/inspector/ModalCrearEstados.test.tsx            NUEVO
app/src/ui/inspector/previewEstadosOpl.ts                  NUEVO (helper puro de preview)
app/src/ui/inspector/previewEstadosOpl.test.ts             NUEVO
app/src/ui/Dialogo.tsx                                     LECTURA (reusar)
app/src/ui/tokens.ts                                       EDIT aditivo (modal estados)
app/src/store/sliceTypes.ts                                EDIT aditivo (modalCrearEstadosAbierto)
app/src/store/uiPanel.ts                                   EDIT aditivo
app/src/store/modelo/acciones-ui.ts                        EDIT aditivo (abrirModalCrearEstados, cerrarModalCrearEstados)
app/src/modelo/operaciones.ts                              LECTURA (validarNombre)
app/src/opl/generar.ts                                     LECTURA (reusar formato D8)
app/e2e/05-refinamiento-y-plegado.spec.ts                  LECTURA o EDIT aditivo
app/e2e/20-modal-crear-estados.spec.ts (NUEVO)             NUEVO
docs/historias-usuario-v2/...                              NO TOCAR
```

## 5. Restricciones de no-colisión

- **L1 inspector tabs**: L1 mueve `<SeccionLayoutEstados />` al tab Semántica. L4 modifica el contenido de `<SeccionLayoutEstados />` para abrir el modal en vez de crear estados directos. Si L1 cierra antes, L4 trabaja dentro del tab Semántica. Si L4 cierra antes, L1 mueve el componente ya refactorizado al tab.
- **No tocar `agregarEstadosObjeto` / `agregarEstadoObjeto`** del store. Solo se invoca con nombres reales en lugar de defaults.
- **No tocar designaciones**: `SeccionDesignaciones` permanece intocable.

## 6. Slice mínimo shippeable

### `previewEstadosOpl.ts` (puro, testeable)

```ts
import type { Entidad } from "../../modelo/tipos";

export interface PreviewEstadosOpl {
  texto: string;
  esValido: boolean;
  error?: string;
}

export function generarPreviewEstadosIniciales(
  entidad: Entidad,
  nombre1: string,
  nombre2: string,
): PreviewEstadosOpl {
  // Aplica plantilla OPL-ES D8.
  // Si nombre1 o nombre2 vacíos o inválidos: devolver { texto: "", esValido: false, error }.
  // Si válidos: `**${entidad.nombre}** se encuentra en uno de los siguientes estados: **${nombre1}** o **${nombre2}**.`
}

export function generarPreviewEstadoAdicional(
  entidad: Entidad,
  nombreNuevo: string,
): PreviewEstadosOpl {
  // `**${entidad.nombre}** suma el estado **${nombreNuevo}**.`
}

/**
 * Validación nominal específica para estados según HU-SHARED-009.
 * - No vacío.
 * - No solo whitespace.
 * - No duplica nombre de un estado existente del mismo objeto.
 * - Caracteres permitidos: letras, números, guiones, espacios.
 */
export function validarNombreEstado(
  nombre: string,
  estadosExistentes: ReadonlyArray<string>,
): { ok: true } | { ok: false; razon: string } {
  if (!nombre.trim()) return { ok: false, razon: "El nombre no puede estar vacío" };
  if (estadosExistentes.includes(nombre.trim())) return { ok: false, razon: "Ya existe un estado con ese nombre" };
  // ... otros checks de validación nominal canónica
  return { ok: true };
}
```

### `inspector/ModalCrearEstados.tsx`

```tsx
interface Props {
  entidad: Entidad;
  estadosExistentes: ReadonlyArray<Estado>;
  modo: "iniciales" | "adicional";
  onConfirmar: (nombres: string[]) => void;
  onCancelar: () => void;
}

export function ModalCrearEstados(props: Props) {
  const [nombre1, setNombre1] = useState("");
  const [nombre2, setNombre2] = useState("");
  const nombresExistentes = useMemo(
    () => props.estadosExistentes.map((e) => e.nombre),
    [props.estadosExistentes],
  );

  const validacion1 = validarNombreEstado(nombre1, nombresExistentes);
  const validacion2 = props.modo === "iniciales"
    ? validarNombreEstado(nombre2, [...nombresExistentes, nombre1.trim()])
    : { ok: true } as const;

  const preview = props.modo === "iniciales"
    ? generarPreviewEstadosIniciales(props.entidad, nombre1, nombre2)
    : generarPreviewEstadoAdicional(props.entidad, nombre1);

  const puedeConfirmar = validacion1.ok && validacion2.ok &&
    (props.modo === "iniciales" ? nombre2.trim().length > 0 : true);

  const confirmar = () => {
    if (!puedeConfirmar) return;
    if (props.modo === "iniciales") props.onConfirmar([nombre1.trim(), nombre2.trim()]);
    else props.onConfirmar([nombre1.trim()]);
  };

  return (
    <Dialogo
      data-testid="modal-crear-estados"
      titulo={props.modo === "iniciales" ? "Crear estados iniciales" : "Agregar estado"}
      onCerrar={props.onCancelar}
    >
      <p style={style.intro}>
        {props.modo === "iniciales"
          ? `${props.entidad.nombre} debe tener al menos dos estados (axioma OPM Glos 3.66).`
          : `Agregar un estado más a ${props.entidad.nombre}.`}
      </p>

      <label style={style.field}>
        <span style={style.label}>{props.modo === "iniciales" ? "Estado 1" : "Nombre del estado"}</span>
        <input
          type="text"
          value={nombre1}
          onInput={(e) => setNombre1(e.currentTarget.value)}
          data-testid="modal-crear-estados-nombre1"
          aria-invalid={!validacion1.ok}
          autoFocus
        />
        {!validacion1.ok && nombre1.length > 0 ? <span style={style.error}>{validacion1.razon}</span> : null}
      </label>

      {props.modo === "iniciales" ? (
        <label style={style.field}>
          <span style={style.label}>Estado 2</span>
          <input
            type="text"
            value={nombre2}
            onInput={(e) => setNombre2(e.currentTarget.value)}
            data-testid="modal-crear-estados-nombre2"
            aria-invalid={!validacion2.ok}
          />
          {!validacion2.ok && nombre2.length > 0 ? <span style={style.error}>{validacion2.razon}</span> : null}
        </label>
      ) : null}

      <div style={style.previewBlock} data-testid="modal-crear-estados-preview">
        <span style={style.previewLabel}>Preview OPL</span>
        <p style={preview.esValido ? style.previewTexto : style.previewTextoVacio}>
          {preview.esValido ? preview.texto : "(escribe los nombres para ver la oración OPL)"}
        </p>
      </div>

      <footer style={style.footer}>
        <button
          type="button"
          onClick={confirmar}
          disabled={!puedeConfirmar}
          data-testid="modal-crear-estados-confirmar"
          style={puedeConfirmar ? style.btnPrimario : style.btnPrimarioDisabled}
        >
          Agregar
        </button>
        <button type="button" onClick={props.onCancelar} data-testid="modal-crear-estados-cancelar" style={style.btnSecundario}>
          Cancelar
        </button>
      </footer>
    </Dialogo>
  );
}
```

### Cambios en `SeccionLayoutEstados.tsx`

Reemplazar:

```tsx
{props.estados.length === 0 ? (
  <button onClick={props.onAgregarEstados}>Agregar estados</button>
) : ...
```

Por:

```tsx
const abrirModalCrear = useOpmStore((s) => s.abrirModalCrearEstados);

{props.estados.length === 0 ? (
  <button onClick={() => abrirModalCrear(props.entidadId, "iniciales")} data-testid="abrir-modal-crear-estados">
    Crear estados
  </button>
) : (
  <>
    {/* ... lista existente */}
    <button onClick={() => abrirModalCrear(props.entidadId, "adicional")}>Agregar estado nuevo</button>
  </>
)}
```

El modal vive a nivel App (lazy-mount como otros modales) y observa el store; al confirmar, despacha:

```ts
// store action
async crearEstadosDesdeModal(entidadId: Id, nombres: string[]) {
  if (nombres.length === 2) {
    // crear ambos con renombre
    this.agregarEstadosObjeto(entidadId);
    const estados = estadosDeEntidad(this.modelo, entidadId);
    if (estados[0]) this.renombrarEstado(estados[0].id, nombres[0]);
    if (estados[1]) this.renombrarEstado(estados[1].id, nombres[1]);
  } else if (nombres.length === 1) {
    this.agregarEstadoObjeto(entidadId);
    const estados = estadosDeEntidad(this.modelo, entidadId);
    const ultimo = estados[estados.length - 1];
    if (ultimo) this.renombrarEstado(ultimo.id, nombres[0]);
  }
  this.cerrarModalCrearEstados();
}
```

(Implementación interna del store puede mejorarse para evitar el `agregar+renombrar` doble paso si hay API directa; la idea es no romper el motor.)

## 7. Tests obligatorios

- Unit (~10 tests nuevos):
  - `validarNombreEstado` con vacío → error.
  - `validarNombreEstado` con whitespace solo → error.
  - `validarNombreEstado` con nombre que duplica existente → error.
  - `validarNombreEstado` con nombre válido → ok.
  - `generarPreviewEstadosIniciales` con nombres válidos → texto OPL D8 correcto.
  - `generarPreviewEstadosIniciales` con nombre vacío → esValido=false.
  - `generarPreviewEstadoAdicional` con nombre válido → texto correcto.
  - `<ModalCrearEstados />` (preact-testing-library):
    - Renderiza modo "iniciales" con 2 inputs.
    - Renderiza modo "adicional" con 1 input.
    - Botón "Agregar" deshabilitado con nombres vacíos.
    - Click confirmar → invoca `onConfirmar` con array de nombres.
- Smoke (~2 tests nuevos en `e2e/20-modal-crear-estados.spec.ts`):
  - Crear objeto sin estados, click "Crear estados" → modal abre, escribir 2 nombres, ver preview OPL, confirmar → estados creados con esos nombres exactos.
  - Click "Agregar estado nuevo" sobre objeto con estados → modal modo adicional con 1 input, confirmar → nuevo estado con nombre real.

## 8. Verificación

```bash
cd app
bun run check
bun run lint
bun run browser:smoke
bun run build
```

Audit visual con `test-vivo-iterativo-opmkv`:

- Cargar fixture o crear objeto nuevo.
- Click en Inspector "Crear estados" → modal aparece.
- Verificar criterio del informe línea 114: "Crear estados debe pedir nombres reales y mostrar preview OPL antes de aplicar." → modal muestra inputs + preview OPL en vivo + botón con conteo.
- Confirmar → estados con nombres reales (no `estado1/estado2`) en canvas e Inspector.
- Comparar con `35-add-states-open-or-applied.png` del audit.

## 9. Decisiones bloqueadas (no reabrir)

- **Nombres reales obligatorios** desde la UI; el store API mantiene compat para no romper tests existentes que dependen de `estado1/estado2`.
- **Preview OPL siempre visible** mientras el modal está abierto, aunque los nombres no sean válidos (mostrar placeholder en ese caso).
- **Plantilla canónica D8** del SSOT, no inventar formato propio.
- **Mínimo 2 estados** al crear iniciales (axioma Glos 3.66); el modal lo enforce.

## 10. Decisiones que tomas vos (documentar en commit)

- Si el modal permite designar inicial/final/canónico al crear o solo después (recomendado: solo después, para no sobrecargar el modal).
- Si "Agregar estado nuevo" reemplaza al botón "Agregar estado" existente o convive (recomendado: reemplaza para mantener una sola vía).
- Si los inputs tienen autocomplete con sugerencias del SSOT (recomendado: no, scope creep).
- Si el modal lleva ejemplos de nombres canónicos en placeholder (recomendado: sí; placeholder `"ej: rotando, detenido"`).

## 11. Forma del entregable

- Commit 1: `feat(estados): preview OPL puro D8 + validacion nominal de estados` — `previewEstadosOpl.ts` + tests.
- Commit 2: `feat(inspector): modal de creacion de estados con nombres reales` — `ModalCrearEstados.tsx` + integración SeccionLayoutEstados.
- Commit 3: `test(e2e): crear estados con nombres reales y preview OPL`.
- Co-author footer estándar.
- No tocar HANDOFF.md ni motor de estados.
