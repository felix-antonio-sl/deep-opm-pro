import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import type { Id } from "../modelo/tipos";
import type { CarpetaIndice } from "../persistencia/workspace";
import { rutaDeCarpeta, listarHijosDeCarpeta } from "../persistencia/workspace";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { PanelCarpetas, type VistaModo } from "./PanelCarpetas";

export function DialogoCargarModelo() {
  const open = useOpmStore((s) => s.dialogoCargarModeloAbierto);
  const cerrar = useOpmStore((s) => s.cerrarCargarModelo);
  const modelos = useOpmStore((s) => s.modelosGuardados);
  const indice = useOpmStore((s) => s.indice);
  const carpetaActualId = useOpmStore((s) => s.carpetaActualId);
  const recientes = useOpmStore((s) => s.modelosRecientes);
  const listar = useOpmStore((s) => s.listarModelosGuardados);
  const cargar = useOpmStore((s) => s.cargarLocal);
  const abrirCarpeta = useOpmStore((s) => s.abrirCarpeta);
  const crearCarpeta = useOpmStore((s) => s.crearCarpetaEnActual);
  const renombrarCarpeta = useOpmStore((s) => s.renombrarCarpetaEnIndice);
  const eliminarCarpeta = useOpmStore((s) => s.eliminarCarpetaEnIndice);
  const confirmarSiDirty = useConfirmarSiDirty();
  const [modo, setModo] = useState<VistaModo>("tiles");
  const [query, setQuery] = useState("");
  const [breadcrumb, setBreadcrumb] = useState<CarpetaIndice[]>([]);

  useEffect(() => {
    if (!open) return;
    listar();
    setQuery("");
  }, [listar, open]);

  useEffect(() => {
    setBreadcrumb(rutaDeCarpeta(indice, carpetaActualId));
  }, [indice, carpetaActualId]);

  // Filtrar modelos por carpeta actual
  const hijos = useMemo(() => {
    const raw = listarHijosDeCarpeta(indice, carpetaActualId);
    const modelosFiltrados = raw.modelos
      .map((m) => modelos.find((gm) => gm.id === m.id))
      .filter((m) => m !== undefined);
    return {
      carpetas: raw.carpetas,
      modelos: modelosFiltrados as typeof modelos,
    };
  }, [indice, carpetaActualId, modelos]);

  const navegarBreadcrumb = useCallback((carpetaId: Id | null, _segmentIndex: number) => {
    abrirCarpeta(carpetaId);
  }, [abrirCarpeta]);

  return (
    <Dialogo
      open={open}
      title="Cargar modelo"
      onCancel={cerrar}
      actions={(
        <button type="button" style={style.secondaryButton} onClick={cerrar}>Cancelar</button>
      )}
    >
      <div style={style.container}>
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
          onAbrirModelo={(mId) => confirmarSiDirty(() => cargar(mId))}
          recientes={recientes}
          modoOperacion="carga"
        />
      </div>
    </Dialogo>
  );
}

const style = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "300px",
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
} satisfies Record<string, preact.JSX.CSSProperties>;
