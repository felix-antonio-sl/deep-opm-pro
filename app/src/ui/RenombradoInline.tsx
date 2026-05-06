import { useEffect, useRef, useState } from "preact/hooks";

interface Props {
  nombre: string;
  rect: { x: number; y: number; width: number; height: number };
  onConfirmar: (nombre: string) => void;
  onCancelar: () => void;
}

export function RenombradoInline(props: Props) {
  const [valor, setValor] = useState(props.nombre);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValor(props.nombre);
  }, [props.nombre]);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [props.rect.x, props.rect.y]);

  const confirmar = () => {
    const limpio = valor.trim();
    if (limpio.length > 0 && limpio !== props.nombre) props.onConfirmar(limpio);
    else props.onCancelar();
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
        if (event.key === "Enter") confirmar();
        if (event.key === "Escape") props.onCancelar();
      }}
      style={{
        position: "absolute",
        left: `${props.rect.x + 8}px`,
        top: `${props.rect.y + props.rect.height / 2 - 15}px`,
        width: `${Math.max(80, props.rect.width - 16)}px`,
        height: "30px",
        zIndex: 5,
        border: "2px solid #3BC3FF",
        borderRadius: "4px",
        background: "#ffffff",
        color: "#1f2937",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        fontWeight: 700,
        textAlign: "center",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
}
