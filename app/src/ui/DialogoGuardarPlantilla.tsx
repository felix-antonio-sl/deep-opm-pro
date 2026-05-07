import { useEffect, useRef, useState } from "preact/hooks";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";

/**
 * Diálogo para guardar el modelo activo como plantilla privada.
 * Citas SSOT: [Met §8.8] plantillas como artefactos reutilizables; ámbitos
 * privados/org/global, con org/global diferidos en MVP beta.
 * Evidencia OPCloud: opm-extracted/src/app/dialogs/submodel-name-dialog/.
 */

export function DialogoGuardarPlantilla() {
  const abierto = useOpmStore((s) => s.dialogoGuardarPlantillaAbierto);
  const modelo = useOpmStore((s) => s.modelo);
  const cerrar = useOpmStore((s) => s.cerrarDialogoGuardarPlantilla);
  const guardar = useOpmStore((s) => s.guardarComoPlantillaConfirmar);
  const mensaje = useOpmStore((s) => s.mensaje);
  const inputRef = useRef<HTMLInputElement>(null);
  const [nombre, setNombre] = useState(modelo.nombre);
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (!abierto) return;
    setNombre(modelo.nombre);
    setDescripcion("");
  }, [abierto, modelo.nombre]);

  const confirmar = () => {
    if (!nombre.trim()) return;
    guardar({ nombre, descripcion, ambito: "privado" });
  };

  return (
    <Dialogo
      open={abierto}
      title="Guardar como plantilla"
      onCancel={cerrar}
      initialFocusRef={inputRef}
      actions={(
        <>
          <button type="button" style={style.secondaryButton} onClick={cerrar}>Cancelar</button>
          <button
            type="button"
            style={nombre.trim() ? style.primaryButton : style.disabledButton}
            disabled={!nombre.trim()}
            onClick={confirmar}
            data-testid="guardar-plantilla-confirmar"
          >
            Guardar plantilla
          </button>
        </>
      )}
    >
      <div style={style.body} data-testid="dialogo-guardar-plantilla">
        <label style={style.label}>
          <span>Nombre</span>
          <input
            ref={inputRef}
            aria-label="Nombre de plantilla"
            style={style.input}
            value={nombre}
            onInput={(event) => setNombre(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") confirmar();
            }}
          />
        </label>
        <label style={style.label}>
          <span>Descripción</span>
          <textarea
            aria-label="Descripción de plantilla"
            style={style.textarea}
            value={descripcion}
            onInput={(event) => setDescripcion(event.currentTarget.value)}
          />
        </label>
        <label style={style.label}>
          <span>Ámbito</span>
          <select aria-label="Ámbito de plantilla" style={style.input} value="privado" disabled>
            <option value="privado">Privado</option>
          </select>
        </label>
        {mensaje ? <p style={style.error}>{mensaje}</p> : null}
      </div>
    </Dialogo>
  );
}

const style = {
  body: { display: "grid", gap: "12px", minWidth: "min(420px, calc(100vw - 80px))" },
  label: { display: "grid", gap: "6px", color: "#475467", fontSize: "13px", fontWeight: 700 },
  input: { height: "34px", border: "1px solid #b9c5d4", borderRadius: "4px", padding: "0 10px", fontSize: "13px", fontWeight: 600 },
  textarea: { minHeight: "76px", border: "1px solid #b9c5d4", borderRadius: "4px", padding: "8px 10px", fontSize: "13px", fontWeight: 600, resize: "vertical" },
  error: { margin: 0, color: "#CC0A0E", fontSize: "12px", fontWeight: 700 },
  primaryButton: { height: "34px", padding: "0 14px", border: "1px solid #586D8C", borderRadius: "4px", background: "#586D8C", color: "#ffffff", cursor: "pointer", fontSize: "13px", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 14px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#ffffff", color: "#475467", cursor: "pointer", fontSize: "13px", fontWeight: 700 },
  disabledButton: { height: "34px", padding: "0 14px", border: "1px solid #d9e0ea", borderRadius: "4px", background: "#f2f4f7", color: "#98a2b3", fontSize: "13px", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
