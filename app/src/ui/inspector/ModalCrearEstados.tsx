import type { RefObject } from "preact";
import { useMemo, useRef, useState } from "preact/hooks";
import type { Entidad, Estado } from "../../modelo/tipos";
import { Dialogo } from "../Dialogo";
import { tokens } from "../tokens";
import {
  generarPreviewEstadoAdicional,
  generarPreviewEstadosIniciales,
  normalizarNombreEstado,
  validarNombreEstado,
} from "./previewEstadosOpl";

export type ModoCrearEstados = "iniciales" | "adicional";

interface Props {
  entidad: Entidad;
  estadosExistentes: ReadonlyArray<Estado>;
  modo: ModoCrearEstados;
  onConfirmar: (nombres: string[]) => void;
  onCancelar: () => void;
}

export function ModalCrearEstados(props: Props) {
  const [nombre1, setNombre1] = useState("");
  const [nombre2, setNombre2] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const nombresExistentes = useMemo(
    () => props.estadosExistentes.map((estado) => estado.nombre),
    [props.estadosExistentes],
  );
  const validacion1 = validarNombreEstado(nombre1, nombresExistentes);
  const validacion2 = props.modo === "iniciales"
    ? validarNombreEstado(nombre2, [...nombresExistentes, normalizarNombreEstado(nombre1)])
    : ({ ok: true, nombre: "" } as const);
  const preview = props.modo === "iniciales"
    ? generarPreviewEstadosIniciales(props.entidad, nombre1, nombre2, nombresExistentes)
    : generarPreviewEstadoAdicional(props.entidad, nombre1, nombresExistentes);
  const puedeConfirmar = validacion1.ok && validacion2.ok;

  const confirmar = () => {
    if (!puedeConfirmar) return;
    props.onConfirmar(props.modo === "iniciales"
      ? [validacion1.nombre, validacion2.nombre]
      : [validacion1.nombre]);
  };

  const manejarKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    confirmar();
  };

  return (
    <Dialogo
      open
      title={props.modo === "iniciales" ? "Crear estados iniciales" : "Agregar estado nuevo"}
      onCancel={props.onCancelar}
      initialFocusRef={inputRef as RefObject<HTMLElement>}
      testId="modal-crear-estados"
      actions={(
        <>
          <button type="button" style={style.secondaryButton} onClick={props.onCancelar} data-testid="modal-crear-estados-cancelar">
            Cancelar
          </button>
          <button
            type="button"
            style={puedeConfirmar ? style.primaryButton : style.primaryButtonDisabled}
            onClick={confirmar}
            disabled={!puedeConfirmar}
            data-testid="modal-crear-estados-confirmar"
          >
            Agregar
          </button>
        </>
      )}
    >
      <div style={style.body} onKeyDown={manejarKeyDown}>
        <p style={style.intro}>
          {props.modo === "iniciales"
            ? `${props.entidad.nombre} requiere al menos dos estados visibles.`
            : `Agregar un estado visible a ${props.entidad.nombre}.`}
        </p>
        <label style={style.field}>
          <span style={style.label}>{props.modo === "iniciales" ? "Nombre estado 1" : "Nombre del estado"}</span>
          <input
            ref={inputRef}
            type="text"
            value={nombre1}
            onInput={(event) => setNombre1(event.currentTarget.value)}
            aria-invalid={nombre1.length > 0 && !validacion1.ok}
            aria-label={props.modo === "iniciales" ? "Nombre estado 1" : "Nombre del estado"}
            placeholder="ej: activo"
            style={style.input}
            data-testid="modal-crear-estados-nombre1"
          />
          {nombre1.length > 0 && !validacion1.ok ? <span style={style.error}>{validacion1.razon}</span> : null}
        </label>
        {props.modo === "iniciales" ? (
          <label style={style.field}>
            <span style={style.label}>Nombre estado 2</span>
            <input
              type="text"
              value={nombre2}
              onInput={(event) => setNombre2(event.currentTarget.value)}
              aria-invalid={nombre2.length > 0 && !validacion2.ok}
              aria-label="Nombre estado 2"
              placeholder="ej: detenido"
              style={style.input}
              data-testid="modal-crear-estados-nombre2"
            />
            {nombre2.length > 0 && !validacion2.ok ? <span style={style.error}>{validacion2.razon}</span> : null}
          </label>
        ) : null}
        <div style={style.previewBlock} data-testid="modal-crear-estados-preview" aria-live="polite">
          <span style={style.previewLabel}>Preview OPL</span>
          <p style={preview.esValido ? style.previewText : style.previewEmpty}>
            {preview.esValido ? preview.texto : "(escribe nombres válidos para ver la oración OPL)"}
          </p>
        </div>
      </div>
    </Dialogo>
  );
}

const style = {
  body: { display: "grid", gap: "12px" },
  intro: { margin: 0, color: tokens.colors.textoSecundario, fontSize: "13px", fontWeight: 600, lineHeight: 1.4 },
  field: { display: "grid", gap: "5px" },
  label: { color: tokens.colors.textoControl, fontSize: "12px", fontWeight: 700 },
  input: {
    height: "34px",
    padding: "0 9px",
    border: `1px solid ${tokens.colors.bordeInput}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoInput,
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    fontWeight: 600,
    outlineColor: tokens.colors.acentoUi,
  },
  error: { color: tokens.colors.errorTexto, fontSize: "11px", fontWeight: 700 },
  previewBlock: {
    display: "grid",
    gap: "5px",
    padding: "10px",
    border: `1px solid ${tokens.colors.oplBorde}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.oplFondo,
  },
  previewLabel: { color: tokens.colors.verdeOpl, fontSize: "11px", fontWeight: 800, textTransform: "uppercase" },
  previewText: { margin: 0, color: tokens.colors.textoPrimario, fontSize: "13px", fontWeight: 700, lineHeight: 1.45 },
  previewEmpty: { margin: 0, color: tokens.colors.textoDeshabilitado, fontSize: "13px", fontWeight: 600, lineHeight: 1.45 },
  primaryButton: {
    minHeight: "32px",
    padding: "0 12px",
    border: `1px solid ${tokens.colors.acentoSecundario}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.acentoSecundario,
    color: tokens.colors.fondoChrome,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 800,
  },
  primaryButtonDisabled: {
    minHeight: "32px",
    padding: "0 12px",
    border: `1px solid ${tokens.colors.bordeIntermedio}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoDeshabilitado,
    color: tokens.colors.textoDeshabilitado,
    cursor: "not-allowed",
    fontSize: "12px",
    fontWeight: 800,
  },
  secondaryButton: {
    minHeight: "32px",
    padding: "0 12px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
