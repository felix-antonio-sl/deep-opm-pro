import { useEffect, useState } from "preact/hooks";
import { useOpmStore } from "../store";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

export function DialogoSubmodelo() {
  const abierto = useOpmStore((s) => s.dialogoSubmodeloAbierto);
  const modelo = useOpmStore((s) => s.modelo);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const cerrar = useOpmStore((s) => s.cerrarDialogoSubmodelo);
  const conectar = useOpmStore((s) => s.conectarSubmodeloSeleccionado);
  const entidad = seleccionId ? modelo.entidades[seleccionId] : undefined;
  const [modeloId, setModeloId] = useState("");
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    if (!abierto) return;
    setModeloId("");
    setNombre(entidad ? `${entidad.nombre} detalle` : "");
  }, [abierto, entidad]);

  const guardar = () => conectar({ modeloId: modeloId.trim(), nombre: nombre.trim() });
  const disabled = !seleccionId || !modeloId.trim() || !nombre.trim();

  return (
    <Dialogo
      open={abierto}
      title="Conectar submodelo"
      onCancel={cerrar}
      size="md"
      testId="dialogo-submodelo"
      actions={(
        <>
          <DialogoAccion onClick={cerrar}>Cancelar</DialogoAccion>
          <DialogoAccion tono="primaria" disabled={disabled} onClick={guardar}>Conectar</DialogoAccion>
        </>
      )}
    >
      <div style={formStyles.body}>
        <p style={formStyles.hint}>Ancla: {entidad?.nombre ?? "sin selección"}</p>
        <label style={formStyles.field}>
          <span style={formStyles.label}>Modelo ID</span>
          <input style={formStyles.input} value={modeloId} onInput={(event) => setModeloId(event.currentTarget.value)} />
        </label>
        <label style={formStyles.field}>
          <span style={formStyles.label}>Nombre</span>
          <input style={formStyles.input} value={nombre} onInput={(event) => setNombre(event.currentTarget.value)} />
        </label>
      </div>
    </Dialogo>
  );
}

const formStyles = {
  body: { display: "grid", gap: "14px", width: "100%" },
  field: { display: "grid", gridTemplateColumns: "96px minmax(0, 1fr)", alignItems: "center", gap: "10px" },
  label: { color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" },
  input: { height: "32px", minWidth: 0, border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`, borderRadius: 0, padding: "0 10px", background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px" },
  hint: { margin: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "12px" },
} satisfies Record<string, preact.JSX.CSSProperties>;
