// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import folderIcon from "../../../assets/svg/folder.svg";
import type { Id } from "../modelo/tipos";
import { useZustandPersistencePort } from "../app/ports/zustandPersistencePort";
import { useZustandWorkspacePort } from "../app/ports/zustandWorkspacePort";
import { Dialogo } from "./Dialogo";
import { PanelCarpetas, type VistaModo } from "./PanelCarpetas";
import { tokens } from "./tokens";

export function DialogoGuardarComo() {
  const persistencia = useZustandPersistencePort();
  const workspace = useZustandWorkspacePort();
  const inputRef = useRef<HTMLInputElement>(null);
  const [nombre, setNombre] = useState(workspace.workspaceLocal.nombre);
  const [descripcion, setDescripcion] = useState(workspace.workspaceLocal.descripcion);
  const [crearVersionAlGuardar, setCrearVersionAlGuardar] = useState(false);
  const [modo, setModo] = useState<VistaModo>("lista");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!persistencia.dialogoGuardarComoAbierto) return;
    setNombre(workspace.workspaceLocal.nombre);
    setDescripcion(workspace.workspaceLocal.descripcion);
    setCrearVersionAlGuardar(false);
    setQuery("");
  }, [
    persistencia.dialogoGuardarComoAbierto,
    workspace.workspaceLocal.descripcion,
    workspace.workspaceLocal.nombre,
  ]);

  const breadcrumb = useMemo(
    () => workspace.rutaCarpetaActual(),
    [workspace.indice, workspace.carpetaActualId],
  );

  const hijos = useMemo(() => {
    return workspace.listarHijosActuales();
  }, [workspace.indice, workspace.carpetaActualId, workspace.modelosGuardados]);

  const validacion = useMemo(
    () => workspace.validarNombreModelo(nombre),
    [workspace.modelosGuardados, nombre],
  );

  const navegarBreadcrumb = useCallback((carpetaId: Id | null, _segmentIndex: number) => {
    workspace.abrirCarpeta(carpetaId);
  }, [workspace]);

  return (
    <Dialogo
      open={persistencia.dialogoGuardarComoAbierto}
      title="Guardar como"
      onCancel={persistencia.cerrarGuardarComo}
      initialFocusRef={inputRef}
      actions={(
        <>
          <button type="button" style={style.secondaryButton} onClick={persistencia.cerrarGuardarComo}>Cancelar</button>
          <button
            type="button"
            style={validacion.ok ? style.primaryButton : style.disabledButton}
            disabled={!validacion.ok}
            onClick={() => persistencia.guardarComoLocalConDescripcion({ nombre, descripcion, crearVersionAlGuardar })}
          >
            Guardar
          </button>
        </>
      )}
    >
      <div style={style.container}>
        {/* Carpeta destino actual */}
        <div style={style.folderLine}>
          <img src={folderIcon} alt="" style={style.folderIcon} />
          <span>
            Destino: {breadcrumb.length > 0
              ? breadcrumb.map((c) => c.nombre).join(" / ")
              : "Inicio / Modelos locales"}
          </span>
        </div>

        {/* Selector de carpeta colapsable */}
        <details style={style.folderSelector}>
          <summary style={style.folderSummary}>Cambiar carpeta destino</summary>
          <div style={style.folderPickerBody}>
            <PanelCarpetas
              hijos={hijos}
              breadcrumb={breadcrumb}
              carpetaActualId={workspace.carpetaActualId}
              vista={modo}
              query={query}
              onQueryChange={setQuery}
              onVistaChange={setModo}
              onAbrirCarpeta={(cId) => workspace.abrirCarpeta(cId)}
              onNavegarBreadcrumb={navegarBreadcrumb}
              onCrearCarpeta={workspace.crearCarpetaEnActual}
              onRenombrarCarpeta={workspace.renombrarCarpetaEnIndice}
              onEliminarCarpeta={(cId) => { void workspace.eliminarCarpetaEnIndice(cId, { cascada: false }); }}
              onAbrirModelo={() => {}} // En modo selector, no se abren modelos
              mostrarVersiones={workspace.mostrarVersiones}
              recientes={[]}
              modoOperacion="selector"
            />
          </div>
        </details>

        <label style={style.label}>
          <span>Nombre del modelo</span>
          <input
            ref={inputRef}
            aria-label="Nombre del modelo"
            style={style.input}
            value={nombre}
            onInput={(event) => setNombre(event.currentTarget.value)}
          />
        </label>
        <label style={style.label}>
          <span>Descripción</span>
          <textarea
            aria-label="Descripción"
            style={style.textarea}
            value={descripcion}
            onInput={(event) => setDescripcion(event.currentTarget.value)}
          />
        </label>
        <label style={style.checkLine}>
          <input
            type="checkbox"
            checked={crearVersionAlGuardar}
            onChange={(event) => setCrearVersionAlGuardar(event.currentTarget.checked)}
          />
          Crear versiones en guardados manuales
        </label>
        {!validacion.ok ? <div role="alert" style={style.error}>{validacion.error}</div> : null}
      </div>
    </Dialogo>
  );
}

const style = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  folderLine: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px",
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    fontWeight: 700,
  },
  folderIcon: {
    width: "22px",
    height: "22px",
  },
  folderSelector: {
    border: `1px solid ${tokens.colors.bordeIntermedio}`,
    borderRadius: tokens.radii.sm,
    padding: "6px 10px",
    background: tokens.colors.fondoCard,
  },
  folderSummary: {
    color: tokens.colors.chromeNeutral,
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
  folderPickerBody: {
    marginTop: "8px",
    maxHeight: "240px",
    overflow: "auto",
  },
  label: {
    display: "grid",
    gap: "5px",
    color: tokens.colors.textoSecundario,
    fontSize: "13px",
    fontWeight: 700,
  },
  input: {
    height: "34px",
    border: `1px solid ${tokens.colors.bordeInput}`,
    borderRadius: tokens.radii.sm,
    padding: "0 10px",
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
  },
  textarea: {
    minHeight: "72px",
    resize: "vertical",
    border: `1px solid ${tokens.colors.bordeInput}`,
    borderRadius: tokens.radii.sm,
    padding: "8px 10px",
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    fontFamily: tokens.typography.familyChrome,
  },
  error: {
    color: tokens.colors.errorTexto,
    fontSize: "12px",
    fontWeight: 700,
  },
  checkLine: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    color: tokens.colors.textoSecundario,
    fontSize: "13px",
    fontWeight: 700,
  },
  primaryButton: {
    height: "34px",
    padding: "0 14px",
    border: `1px solid ${tokens.colors.chromeNeutral}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.chromeNeutral,
    color: tokens.colors.fondoChrome,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
  },
  secondaryButton: {
    height: "34px",
    padding: "0 14px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
  },
  disabledButton: {
    height: "34px",
    padding: "0 14px",
    border: `1px solid ${tokens.colors.bordeIntermedio}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoDeshabilitado,
    color: tokens.colors.textoDeshabilitado,
    fontSize: "13px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
