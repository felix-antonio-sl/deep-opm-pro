// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useRef, useState } from "preact/hooks";
import { tokens } from "./tokens";

interface Props {
  nombre: string;
  rect: { x: number; y: number; width: number; height: number };
  onConfirmar: (nombre: string) => void;
  onCancelar: () => void;
}

export function RenombradoInline(props: Props) {
  const [valor, setValor] = useState(props.nombre);
  const inputRef = useRef<HTMLInputElement>(null);
  const cerrandoRef = useRef(false);

  useEffect(() => {
    cerrandoRef.current = false;
    setValor(props.nombre);
  }, [props.nombre]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
    inputRef.current?.select();
  }, [props.rect.x, props.rect.y]);

  const confirmar = () => {
    if (cerrandoRef.current) return;
    cerrandoRef.current = true;
    const limpio = valor.trim();
    if (limpio.length > 0) props.onConfirmar(limpio);
    else props.onCancelar();
  };

  const cancelar = () => {
    if (cerrandoRef.current) return;
    cerrandoRef.current = true;
    props.onCancelar();
  };

  return (
    <input
      ref={inputRef}
      aria-label="Renombrar subproceso inline"
      data-testid="renombrado-inline"
      value={valor}
      onInput={(event) => setValor(event.currentTarget.value)}
      onBlur={confirmar}
      onMouseDown={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          confirmar();
        }
        if (event.key === "Escape") {
          event.preventDefault();
          cancelar();
        }
      }}
      style={{
        position: "absolute",
        left: `${props.rect.x + 8}px`,
        top: `${props.rect.y + props.rect.height / 2 - 15}px`,
        width: `${Math.max(80, props.rect.width - 16)}px`,
        height: "30px",
        zIndex: 5,
        // Codex L6 (C-04): borde de edición inline = crimson editorial (foco UI),
        // no el cyan semántico del canvas.
        border: `1px solid ${tokens.colors.crimson}`,
        borderRadius: tokens.radii.none,
        background: tokens.colors.fondoChrome,
        color: tokens.colors.textoPrimario,
        fontFamily: tokens.typography.familyChrome,
        fontSize: "14px",
        fontWeight: 700,
        textAlign: "center",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
}
