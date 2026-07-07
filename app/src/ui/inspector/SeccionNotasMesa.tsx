// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { notasDeTarget } from "../../modelo/notasMesa";
import type { TargetAncla } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";
import { useState } from "preact/hooks";

/**
 * W6.5-a: notas de mesa del componente seleccionado (o del modelo, en la rama
 * vacía). A diferencia de la Descripción (qué ES la cosa), la nota registra qué
 * se PREGUNTA la mesa sobre ella: viaja en el contexto W6.0 como insumo de
 * re-elicitación y se elimina al resolverse — no se fosiliza como definición.
 */
interface Props {
  target: TargetAncla;
}

export function SeccionNotasMesa(props: Props) {
  const modelo = useOpmStore((s) => s.modelo);
  const agregarNotaMesa = useOpmStore((s) => s.agregarNotaMesa);
  const eliminarNotaMesa = useOpmStore((s) => s.eliminarNotaMesa);
  const [borrador, setBorrador] = useState("");
  const notas = notasDeTarget(modelo, props.target);

  const anotar = () => {
    const texto = borrador.trim();
    if (!texto) return;
    agregarNotaMesa(props.target, texto);
    setBorrador("");
  };

  return (
    <div style={style.field} data-testid="inspector-seccion-notas-mesa">
      <span class="opm-label-uppercase" style={style.label}>Notas de mesa</span>
      {notas.map((nota) => (
        <div key={nota.id} style={notasStyles.item} data-testid="nota-mesa-item">
          <span style={notasStyles.texto} title={`Anotada el ${nota.fecha}`}>{nota.texto}</span>
          <button
            type="button"
            style={notasStyles.eliminar}
            title="Eliminar nota (resuelta)"
            aria-label={`Eliminar nota: ${nota.texto}`}
            data-testid="nota-mesa-eliminar"
            onClick={() => eliminarNotaMesa(nota.id)}
          >
            ×
          </button>
        </div>
      ))}
      <div style={notasStyles.editor}>
        <textarea
          data-testid="nota-mesa-input"
          style={notasStyles.textarea}
          placeholder="Anotar duda o pendiente…"
          value={borrador}
          onInput={(event) => setBorrador(event.currentTarget.value)}
        />
        <button
          type="button"
          style={notasStyles.agregar}
          data-testid="nota-mesa-agregar"
          disabled={!borrador.trim()}
          onClick={anotar}
        >
          Anotar
        </button>
      </div>
    </div>
  );
}

const notasStyles = {
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: `${tokens.spacing.xs}px`,
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
  },
  texto: {
    flex: 1,
    color: tokens.colors.ink,
    fontSize: `${tokens.typography.sizes.base}px`,
    lineHeight: 1.4,
    whiteSpace: "pre-wrap" as const,
  },
  eliminar: {
    border: 0,
    background: "transparent",
    color: tokens.colors.ink50,
    cursor: "pointer",
    fontSize: `${tokens.typography.sizes.md}px`,
    lineHeight: 1,
    padding: 0,
  },
  editor: {
    display: "flex",
    gap: `${tokens.spacing.xs}px`,
    alignItems: "flex-end",
  },
  textarea: {
    flex: 1,
    minHeight: "44px",
    padding: "7px 10px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    outlineColor: tokens.colors.focus,
    caretColor: tokens.colors.accent,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    resize: "vertical" as const,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.sizes.base}px`,
    lineHeight: 1.5,
    boxSizing: "border-box" as const,
  },
  agregar: {
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    fontSize: `${tokens.typography.sizes.base}px`,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
