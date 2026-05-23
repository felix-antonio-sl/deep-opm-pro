// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import templateIcon from "../../../assets/svg/template.svg";
import { useDialogoPlantillasViewModel } from "../app/viewmodels/dialogoPlantillasViewModel";
import { Dialogo } from "./Dialogo";
import { Breadcrumb } from "./panelCarpetas/Breadcrumb";
import { tokens } from "./tokens";

/**
 * Catálogo de plantillas privadas con búsqueda y breadcrumb raíz.
 * Citas SSOT: [Met §8.8] plantillas crean copias locales desacopladas;
 * [JOYAS §1] reuso de icono/estilo visual canónico; [V-52]/[V-123].
 * Evidencia OPCloud: opm-extracted/src/app/dialogs/templates-import/templates-import.ts.
 */

const RAIZ_PLANTILLAS = [{ id: "plantillas-root", nombre: "Mis plantillas", padreId: null, creadoEn: 0 }];

export function DialogoPlantillas() {
  const inputGuardarRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [queryFiltrada, setQueryFiltrada] = useState("");
  const {
    abierto,
    guardarAbierto,
    modeloNombre,
    mensaje,
    cerrar,
    abrirGuardar,
    cerrarGuardar,
    guardar,
    insertar,
    filtradas,
  } = useDialogoPlantillasViewModel(queryFiltrada);
  const guardarAbiertoRef = useRef(guardarAbierto);
  const [nombre, setNombre] = useState(modeloNombre);
  const [descripcion, setDescripcion] = useState("");

  guardarAbiertoRef.current = guardarAbierto;

  useEffect(() => {
    const timeout = window.setTimeout(() => setQueryFiltrada(query.trim().toLocaleLowerCase("es-CL")), 200);
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (abierto) setQuery("");
  }, [abierto]);

  useEffect(() => {
    if (!guardarAbierto) return;
    setNombre(modeloNombre);
    setDescripcion("");
  }, [guardarAbierto, modeloNombre]);

  const confirmarGuardar = () => {
    if (!nombre.trim()) return;
    guardar({ nombre, descripcion, ambito: "privado" });
  };
  const cerrarActivo = useCallback(() => {
    if (guardarAbiertoRef.current) cerrarGuardar();
    else cerrar();
  }, [cerrar, cerrarGuardar]);

  return (
    <Dialogo
      open={abierto}
      title={guardarAbierto ? "Guardar como plantilla" : "Plantillas"}
      onCancel={cerrarActivo}
      {...(guardarAbierto ? { initialFocusRef: inputGuardarRef } : {})}
      size="lg"
      actions={guardarAbierto ? (
        <>
          <button type="button" style={style.secondaryButton} onClick={cerrarGuardar}>Cancelar</button>
          <button
            type="button"
            style={nombre.trim() ? style.primaryButton : style.disabledButton}
            disabled={!nombre.trim()}
            onClick={confirmarGuardar}
            data-testid="guardar-plantilla-confirmar"
          >
            Guardar plantilla
          </button>
        </>
      ) : (
        <>
          <button type="button" style={style.secondaryButton} onClick={cerrar}>Cancelar</button>
          <button type="button" style={style.primaryButton} onClick={abrirGuardar}>Guardar nueva</button>
        </>
      )}
    >
      {guardarAbierto ? (
        <FormularioGuardarPlantilla
          nombre={nombre}
          descripcion={descripcion}
          mensaje={mensaje}
          inputRef={inputGuardarRef}
          onNombre={setNombre}
          onDescripcion={setDescripcion}
          onConfirmar={confirmarGuardar}
        />
      ) : (
        <div style={style.body} data-testid="dialogo-plantillas">
          <div style={style.header}>
            <Breadcrumb
              segmentos={RAIZ_PLANTILLAS}
              carpetaActualId="plantillas-root"
              onNavegarBreadcrumb={() => undefined}
            />
            <input
              aria-label="Buscar plantillas"
              placeholder="Buscar"
              style={style.search}
              value={query}
              onInput={(event) => setQuery(event.currentTarget.value)}
              data-testid="buscar-plantillas"
            />
          </div>
          {filtradas.length === 0 ? (
            <div style={style.empty} data-testid="plantillas-vacio">
              <p style={{ margin: "0 0 12px" }}>Sin plantillas en esta carpeta.</p>
              <button
                type="button"
                style={style.insertButton}
                onClick={abrirGuardar}
                data-testid="plantillas-vacio-cta"
              >
                Guardar modelo actual como plantilla
              </button>
            </div>
          ) : (
            <div style={style.grid}>
              {filtradas.map((plantilla) => (
                <article key={plantilla.id} style={style.tile} data-testid="plantilla-tile">
                  <img src={templateIcon} alt="" style={style.icon} />
                  <div style={style.tileBody}>
                    <strong style={style.name}>{plantilla.nombre}</strong>
                    {plantilla.descripcion ? <span style={style.description}>{plantilla.descripcion}</span> : null}
                    <span style={style.meta}>Privado · {fechaCorta(plantilla.actualizadoEn)}</span>
                  </div>
                  <button
                    type="button"
                    style={style.insertButton}
                    onClick={() => insertar(plantilla.id)}
                    data-testid="insertar-plantilla"
                  >
                    Insertar
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </Dialogo>
  );
}

function FormularioGuardarPlantilla(props: {
  nombre: string;
  descripcion: string;
  mensaje: string | null;
  inputRef: preact.RefObject<HTMLInputElement>;
  onNombre: (nombre: string) => void;
  onDescripcion: (descripcion: string) => void;
  onConfirmar: () => void;
}) {
  return (
    <div style={style.formBody} data-testid="dialogo-guardar-plantilla">
      <label style={style.label}>
        <span>Nombre</span>
        <input
          ref={props.inputRef}
          aria-label="Nombre de plantilla"
          style={style.input}
          value={props.nombre}
          onInput={(event) => props.onNombre(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") props.onConfirmar();
          }}
        />
      </label>
      <label style={style.label}>
        <span>Descripción</span>
        <textarea
          aria-label="Descripción de plantilla"
          style={style.textarea}
          value={props.descripcion}
          onInput={(event) => props.onDescripcion(event.currentTarget.value)}
        />
      </label>
      <label style={style.label}>
        <span>Ámbito</span>
        <select aria-label="Ámbito de plantilla" style={style.input} value="privado" disabled>
          <option value="privado">Privado</option>
        </select>
      </label>
      {props.mensaje ? <p style={style.error}>{props.mensaje}</p> : null}
    </div>
  );
}

function fechaCorta(value: string): string {
  const fecha = new Date(value);
  if (Number.isNaN(fecha.getTime())) return value;
  return fecha.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// Ronda 28 L5: Bauhaus monocromático.
const style = {
  // Ancho gobernado por `<Dialogo size="lg">` (ronda 12.1, [JOYAS §2]).
  body: { display: "grid", gap: "16px" },
  formBody: { display: "grid", gap: "14px", minWidth: "min(420px, calc(100vw - 80px))" },
  header: { display: "grid", gridTemplateColumns: "1fr 220px", gap: "12px", alignItems: "center" },
  label: { display: "grid", gap: "6px", color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 400 },
  search: { height: "34px", border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, padding: "0 10px", background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", caretColor: tokens.colors.accent },
  input: { height: "34px", border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, padding: "0 10px", background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", caretColor: tokens.colors.accent },
  textarea: { minHeight: "76px", border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, padding: "10px", background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", resize: "vertical", caretColor: tokens.colors.accent },
  grid: { display: "grid", gap: "8px", maxHeight: "420px", overflow: "auto" },
  tile: { display: "grid", gridTemplateColumns: "38px minmax(0, 1fr) auto", gap: "12px", alignItems: "center", minHeight: "68px", padding: "12px", border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.paper, transition: tokens.transitions.fast },
  icon: { width: "30px", height: "34px" },
  tileBody: { display: "grid", minWidth: 0, gap: "3px" },
  name: { color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  description: { color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  meta: { color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" },
  error: { margin: 0, color: tokens.colors.accent, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500 },
  empty: { margin: 0, padding: "24px 8px", color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 400, textAlign: "center" },
  insertButton: { minHeight: "30px", padding: "6px 14px", border: `1px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500 },
  primaryButton: { minHeight: "32px", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.ink, color: tokens.colors.paper, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
  secondaryButton: { minHeight: "32px", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
  disabledButton: { minHeight: "32px", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.ink04, color: tokens.colors.ink50, cursor: "not-allowed", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
} satisfies Record<string, preact.JSX.CSSProperties>;
