// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
//
// Ronda 23 L3 #7: el modal de bienvenida con 3 caminos (Asistente / Empezar
// vacío / Abrir ejemplo) se reemplaza por un banner inline arriba del canvas
// que aparece sobre el lienzo cuando el primer paint detecta usuario nuevo:
// el canvas precarga el fixture "System Diagram" y el banner explica que
// está viendo un ejemplo, con accesos rápidos a "Empezar vacío" y "Asistente
// guiado", además de un ✕ que sólo descarta el banner conservando el
// ejemplo.
//
// Convivencia con tests existentes:
//   - El contenedor preserva `data-testid="pantalla-inicio"` y un botón
//     "Empezar vacío" para que `cerrarPantallaInicioSiVisible` siga
//     funcionando con todos los smokes históricos (26 specs).
//   - El componente ya no es overlay/modal: se renderiza dentro del
//     canvas-pane vía App.tsx y respeta `pointerEvents: auto` solo en su
//     superficie.
import { usePantallaInicioViewModel } from "../app/viewmodels/pantallaInicioViewModel";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { tokens } from "./tokens";

export const GLOSA_BIENVENIDA_OPM = [
  { termino: "Cosa", definicion: "objeto o proceso del sistema que modelas." },
  { termino: "OPD", definicion: "diagrama donde dibujas cosas y enlaces." },
  { termino: "Apariencia", definicion: "cómo aparece una cosa en un OPD; la misma cosa puede aparecer en varios OPDs." },
  { termino: "Enlace", definicion: "relación entre dos cosas." },
] as const;
export const DIMENSION_ACCION_BIENVENIDA_PX = 160;

export function PantallaInicio() {
  const confirmarSiDirty = useConfirmarSiDirty();
  const {
    pestanaActivaEsBienvenida,
    pantallaInicioCerrada,
    nuevoModelo,
    cerrarPantallaInicio,
    iniciarAsistente,
  } = usePantallaInicioViewModel("");

  // Sólo aparece cuando la pestaña activa fue precargada con el fixture de
  // bienvenida y el usuario no descartó el banner aún.
  if (!pestanaActivaEsBienvenida || pantallaInicioCerrada) return null;

  const ejecutarNuevo = () => {
    cerrarPantallaInicio();
    confirmarSiDirty(nuevoModelo);
  };
  const ejecutarAsistente = () => {
    cerrarPantallaInicio();
    iniciarAsistente();
  };

  return (
    <aside
      data-testid="pantalla-inicio"
      role="region"
      aria-label="Bienvenida deep-opm-pro"
      style={style.banner}
    >
      <p style={style.copy}>
        <strong style={style.titulo}>Estás viendo un ejemplo: System Diagram.</strong>
      </p>
      <div style={style.acciones}>
        <button type="button" style={style.botonPrimario} onClick={ejecutarAsistente}>
          Asistente guiado
        </button>
        <span aria-hidden="true" style={style.separador}>·</span>
        <button type="button" style={style.botonSecundario} onClick={ejecutarNuevo}>
          Empezar vacío
        </button>
        <button
          type="button"
          aria-label="Descartar banner de bienvenida"
          title="Mantener el ejemplo y ocultar el banner"
          style={style.botonCerrar}
          onClick={cerrarPantallaInicio}
        >
          ×
        </button>
      </div>
    </aside>
  );
}

// Codex v1.1: onboarding como nota editorial top-right del canvas, no como
// banda full-width ni modal. Acciones = links tipográficos inline.
const style = {
  banner: {
    position: "absolute",
    top: 14,
    right: 16,
    zIndex: 5,
    display: "flex",
    alignItems: "baseline",
    justifyContent: "flex-end",
    gap: 10,
    maxWidth: 390,
    padding: 0,
    border: "none",
    borderRadius: 0,
    background: "transparent",
    boxShadow: "none",
    pointerEvents: "auto",
    fontFamily: tokens.typography.serif,
    fontSize: 12,
    fontStyle: "italic",
    color: tokens.colors.inkSoft,
  },
  copy: {
    margin: 0,
    minWidth: 0,
    color: tokens.colors.inkSoft,
    lineHeight: 1.35,
    textAlign: "right",
  },
  titulo: {
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.serif,
    fontSize: 12,
    fontStyle: "italic",
    fontWeight: tokens.typography.weights.regular,
  },
  acciones: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  separador: {
    color: tokens.colors.inkFaint,
    fontFamily: tokens.typography.serif,
    fontSize: 12,
    fontStyle: "normal",
  },
  botonPrimario: {
    minHeight: 24,
    padding: 0,
    border: "none",
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.crimson,
    cursor: "pointer",
    fontFamily: tokens.typography.serif,
    fontSize: 12,
    fontStyle: "italic",
    fontWeight: tokens.typography.weights.regular,
    textDecoration: "underline",
    textUnderlineOffset: "3px",
    transition: tokens.transitions.fast,
  },
  botonSecundario: {
    minHeight: 24,
    padding: 0,
    border: "none",
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.inkMid,
    cursor: "pointer",
    fontFamily: tokens.typography.serif,
    fontSize: 12,
    fontStyle: "italic",
    fontWeight: tokens.typography.weights.regular,
    textDecoration: "underline",
    textUnderlineOffset: "3px",
    transition: tokens.transitions.fast,
  },
  botonCerrar: {
    width: 24,
    height: 24,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.inkSoft,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1,
    transition: tokens.transitions.fast,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
