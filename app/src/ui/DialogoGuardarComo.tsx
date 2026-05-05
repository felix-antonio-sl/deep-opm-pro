import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import folderIcon from "../../../assets/svg/folder.svg";
import type { Id } from "../modelo/tipos";
import type { CarpetaIndice } from "../persistencia/workspace";
import { rutaDeCarpeta, listarHijosDeCarpeta, validarNombreModeloLocal } from "../persistencia/workspace";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";
import { PanelCarpetas, type VistaModo } from "./PanelCarpetas";

export function DialogoGuardarComo() {
  const open = useOpmStore((s) => s.dialogoGuardarComoAbierto);
  const cerrar = useOpmStore((s) => s.cerrarGuardarComo);
  const guardarComoLocal = useOpmStore((s) => s.guardarComoLocal);
  const workspace = useOpmStore((s) => s.workspaceLocal);
  const modelosGuardados = useOpmStore((s) => s.modelosGuardados);
  const indice = useOpmStore((s) => s.indice);
  const carpetaActualId = useOpmStore((s) => s.carpetaActualId);
  const abrirCarpeta = useOpmStore((s) => s.abrirCarpeta);
  const crearCarpeta = useOpmStore((s) => s.crearCarpetaEnActual);
  const renombrarCarpeta = useOpmStore((s) => s.renombrarCarpetaEnIndice);
  const eliminarCarpeta = useOpmStore((s) => s.eliminarCarpetaEnIndice);
  const mostrarVersiones = useOpmStore((s) => s.mostrarVersiones);
  const inputRef = useRef<HTMLInputElement>(null);
  const [nombre, setNombre] = useState(workspace.nombre);
  const [descripcion, setDescripcion] = useState(workspace.descripcion);
  const [crearVersionAlGuardar, setCrearVersionAlGuardar] = useState(false);
  const [modo, setModo] = useState<VistaModo>("lista");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    setNombre(workspace.nombre);
    setDescripcion(workspace.descripcion);
    setCrearVersionAlGuardar(false);
    setQuery("");
  }, [open, workspace.descripcion, workspace.nombre]);

  const breadcrumb = useMemo(
    () => rutaDeCarpeta(indice, carpetaActualId),
    [indice, carpetaActualId],
  );

  const hijos = useMemo(() => {
    const raw = listarHijosDeCarpeta(indice, carpetaActualId);
    const modelosFiltrados = raw.modelos
      .map((m) => modelosGuardados.find((gm) => gm.id === m.id))
      .filter((m) => m !== undefined);
    return {
      carpetas: raw.carpetas,
      modelos: modelosFiltrados as typeof modelosGuardados,
    };
  }, [indice, carpetaActualId, modelosGuardados]);

  const validacion = useMemo(
    () => validarNombreModeloLocal(nombre, modelosGuardados),
    [modelosGuardados, nombre],
  );

  const navegarBreadcrumb = useCallback((carpetaId: Id | null, _segmentIndex: number) => {
    abrirCarpeta(carpetaId);
  }, [abrirCarpeta]);

  return (
    <Dialogo
      open={open}
      title="Guardar como"
      onCancel={cerrar}
      initialFocusRef={inputRef}
      actions={(
        <>
          <button type="button" style={style.secondaryButton} onClick={cerrar}>Cancelar</button>
          <button
            type="button"
            style={validacion.ok ? style.primaryButton : style.disabledButton}
            disabled={!validacion.ok}
            onClick={() => guardarComoLocal({ nombre, descripcion, crearVersionAlGuardar })}
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
              carpetaActualId={carpetaActualId}
              vista={modo}
              query={query}
              onQueryChange={setQuery}
              onVistaChange={setModo}
              onAbrirCarpeta={(cId) => abrirCarpeta(cId)}
              onNavegarBreadcrumb={navegarBreadcrumb}
              onCrearCarpeta={crearCarpeta}
              onRenombrarCarpeta={renombrarCarpeta}
              onEliminarCarpeta={(cId) => { void eliminarCarpeta(cId, { cascada: false }); }}
              onAbrirModelo={() => {}} // En modo selector, no se abren modelos
              mostrarVersiones={mostrarVersiones}
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
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
  },
  folderIcon: {
    width: "22px",
    height: "22px",
  },
  folderSelector: {
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    padding: "6px 10px",
    background: "#f9fbfd",
  },
  folderSummary: {
    color: "#586D8C",
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
    color: "#475467",
    fontSize: "13px",
    fontWeight: 700,
  },
  input: {
    height: "34px",
    border: "1px solid #b9c5d4",
    borderRadius: "4px",
    padding: "0 10px",
    color: "#1f2937",
    fontSize: "13px",
  },
  textarea: {
    minHeight: "72px",
    resize: "vertical",
    border: "1px solid #b9c5d4",
    borderRadius: "4px",
    padding: "8px 10px",
    color: "#1f2937",
    fontSize: "13px",
    fontFamily: "Arial, sans-serif",
  },
  error: {
    color: "#b42318",
    fontSize: "12px",
    fontWeight: 700,
  },
  checkLine: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    color: "#475467",
    fontSize: "13px",
    fontWeight: 700,
  },
  primaryButton: {
    height: "34px",
    padding: "0 14px",
    border: "1px solid #586D8C",
    borderRadius: "4px",
    background: "#586D8C",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
  },
  secondaryButton: {
    height: "34px",
    padding: "0 14px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    background: "#ffffff",
    color: "#475467",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
  },
  disabledButton: {
    height: "34px",
    padding: "0 14px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#f2f4f7",
    color: "#98a2b3",
    fontSize: "13px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
