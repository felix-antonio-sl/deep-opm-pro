import { useEffect, useState } from "preact/hooks";
import folderIcon from "../../../assets/svg/folder.svg";
import regFileIcon from "../../../assets/svg/regFile.svg";
import { BREADCRUMB_MODELOS_LOCALES } from "../persistencia/workspace";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";
import { useConfirmarSiDirty } from "./ConfirmacionContext";

export function DialogoCargarModelo() {
  const open = useOpmStore((s) => s.dialogoCargarModeloAbierto);
  const cerrar = useOpmStore((s) => s.cerrarCargarModelo);
  const modelos = useOpmStore((s) => s.modelosGuardados);
  const listar = useOpmStore((s) => s.listarModelosGuardados);
  const cargar = useOpmStore((s) => s.cargarLocalDesdeDialogo);
  const confirmarSiDirty = useConfirmarSiDirty();
  const [seleccionadoId, setSeleccionadoId] = useState("");

  useEffect(() => {
    if (!open) return;
    listar();
  }, [listar, open]);

  useEffect(() => {
    if (!open) return;
    if (!seleccionadoId || !modelos.some((modelo) => modelo.id === seleccionadoId)) {
      setSeleccionadoId(modelos[0]?.id ?? "");
    }
  }, [modelos, open, seleccionadoId]);

  const cargarSeleccionado = () => {
    if (!seleccionadoId) return;
    confirmarSiDirty(() => cargar(seleccionadoId));
  };

  return (
    <Dialogo
      open={open}
      title="Cargar modelo"
      onCancel={cerrar}
      actions={(
        <>
          <button type="button" style={style.secondaryButton} onClick={cerrar}>Cancelar</button>
          <button
            type="button"
            style={seleccionadoId ? style.primaryButton : style.disabledButton}
            disabled={!seleccionadoId}
            onClick={cargarSeleccionado}
          >
            Cargar
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
      <div role="listbox" aria-label="Modelos locales" style={style.grid}>
        {modelos.length === 0 ? (
          <div style={style.empty}>Sin modelos locales.</div>
        ) : modelos.map((modelo) => {
          const seleccionado = modelo.id === seleccionadoId;
          return (
            <button
              key={modelo.id}
              type="button"
              role="option"
              aria-selected={seleccionado}
              style={seleccionado ? style.tileActive : style.tile}
              onClick={() => setSeleccionadoId(modelo.id)}
              onDblClick={() => confirmarSiDirty(() => cargar(modelo.id))}
            >
              <img src={regFileIcon} alt="" style={style.fileIcon} />
              <span style={style.tileName}>{modelo.nombre}</span>
              {modelo.descripcion ? <span style={style.tileDescription}>{modelo.descripcion}</span> : null}
              <span style={style.tileDate}>{new Date(modelo.actualizadoEn).toLocaleString("es-CL")}</span>
            </button>
          );
        })}
      </div>
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
    marginBottom: "12px",
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
  },
  folderIcon: {
    width: "22px",
    height: "22px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "8px",
    maxHeight: "320px",
    overflow: "auto",
  },
  empty: {
    padding: "18px",
    border: "1px dashed #c8d2df",
    borderRadius: "4px",
    color: "#667085",
    fontSize: "13px",
    fontWeight: 700,
  },
  tile: {
    minHeight: "132px",
    display: "grid",
    gridTemplateRows: "28px auto auto 1fr",
    gap: "4px",
    padding: "10px",
    border: "1px solid #d9e0ea",
    borderRadius: "6px",
    background: "#ffffff",
    color: "#1f2937",
    cursor: "pointer",
    textAlign: "left",
  },
  tileActive: {
    minHeight: "132px",
    display: "grid",
    gridTemplateRows: "28px auto auto 1fr",
    gap: "4px",
    padding: "10px",
    border: "1px solid #586D8C",
    borderRadius: "6px",
    background: "#e8eef5",
    color: "#1f2937",
    cursor: "pointer",
    textAlign: "left",
  },
  fileIcon: {
    width: "24px",
    height: "24px",
  },
  tileName: {
    minWidth: 0,
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1.2,
    overflowWrap: "anywhere",
  },
  tileDescription: {
    minWidth: 0,
    color: "#667085",
    fontSize: "12px",
    lineHeight: 1.25,
    overflowWrap: "anywhere",
  },
  tileDate: {
    alignSelf: "end",
    color: "#667085",
    fontSize: "11px",
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

