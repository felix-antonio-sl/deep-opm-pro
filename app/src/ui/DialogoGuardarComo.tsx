import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import folderIcon from "../../../assets/svg/folder.svg";
import { BREADCRUMB_MODELOS_LOCALES, validarNombreModeloLocal } from "../persistencia/workspace";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";

export function DialogoGuardarComo() {
  const open = useOpmStore((s) => s.dialogoGuardarComoAbierto);
  const cerrar = useOpmStore((s) => s.cerrarGuardarComo);
  const guardarComoLocal = useOpmStore((s) => s.guardarComoLocal);
  const workspace = useOpmStore((s) => s.workspaceLocal);
  const modelosGuardados = useOpmStore((s) => s.modelosGuardados);
  const inputRef = useRef<HTMLInputElement>(null);
  const [nombre, setNombre] = useState(workspace.nombre);
  const [descripcion, setDescripcion] = useState(workspace.descripcion);

  useEffect(() => {
    if (!open) return;
    setNombre(workspace.nombre);
    setDescripcion(workspace.descripcion);
  }, [open, workspace.descripcion, workspace.nombre]);

  const validacion = useMemo(
    () => validarNombreModeloLocal(nombre, modelosGuardados),
    [modelosGuardados, nombre],
  );

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
            onClick={() => guardarComoLocal({ nombre, descripcion })}
          >
            Guardar
          </button>
        </>
      )}
    >
      <div style={style.breadcrumbBar}>
        <button type="button" disabled style={style.backButton} aria-label="Atrás">{"<"}</button>
        <nav aria-label="Ubicación" style={style.breadcrumb}>
          {BREADCRUMB_MODELOS_LOCALES.map((parte, index) => (
            <span key={parte} style={style.breadcrumbPart}>
              {index > 0 ? <span style={style.separator}>/</span> : null}
              <button type="button" disabled={index === BREADCRUMB_MODELOS_LOCALES.length - 1} style={style.breadcrumbButton}>
                {parte}
              </button>
            </span>
          ))}
        </nav>
      </div>
      <div style={style.folderLine}>
        <img src={folderIcon} alt="" style={style.folderIcon} />
        <span>Modelos locales</span>
      </div>
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
      {!validacion.ok ? <div role="alert" style={style.error}>{validacion.error}</div> : null}
    </Dialogo>
  );
}

const style = {
  breadcrumbBar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  backButton: {
    width: "30px",
    height: "30px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#f2f4f7",
    color: "#98a2b3",
    fontWeight: 700,
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    minWidth: 0,
    flexWrap: "wrap",
    gap: "4px",
  },
  breadcrumbPart: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  separator: {
    color: "#98a2b3",
  },
  breadcrumbButton: {
    border: 0,
    padding: 0,
    background: "transparent",
    color: "#475467",
    fontSize: "13px",
    fontWeight: 700,
  },
  folderLine: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "14px",
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
  },
  folderIcon: {
    width: "22px",
    height: "22px",
  },
  label: {
    display: "grid",
    gap: "5px",
    marginTop: "10px",
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
    marginTop: "8px",
    color: "#b42318",
    fontSize: "12px",
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

