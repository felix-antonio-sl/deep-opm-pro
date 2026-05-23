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
      <div style={style.copy}>
        <strong style={style.titulo}>Estás viendo un ejemplo: System Diagram.</strong>
        <span style={style.subtitulo}>
          Empieza vacío o sembrá un modelo con el asistente cuando lo necesites.
        </span>
      </div>
      <div style={style.acciones}>
        <button type="button" style={style.botonPrimario} onClick={ejecutarAsistente}>
          Asistente guiado
        </button>
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

// Ronda 28 L5: bienvenida Bauhaus — banner inline full-width arriba del
// canvas, paper bg + border-bottom 1.5px ink, padding 16/24. Botones
// alineados a la derecha [Asistente guiado] primario, [Empezar vacío]
// secundario, [×] cerrar.
const style = {
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "16px 24px",
    border: "none",
    borderBottom: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    boxShadow: "none",
    pointerEvents: "auto",
    fontFamily: tokens.typography.familyChrome,
  },
  copy: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    flex: 1,
    minWidth: 0,
  },
  titulo: {
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: 14,
    fontWeight: 500,
  },
  subtitulo: {
    color: tokens.colors.ink70,
    fontFamily: tokens.typography.familyChrome,
    fontSize: 13,
    fontWeight: 400,
  },
  acciones: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  botonPrimario: {
    minHeight: 32,
    padding: "8px 18px",
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: 13,
    fontWeight: 500,
    transition: tokens.transitions.fast,
  },
  botonSecundario: {
    minHeight: 32,
    padding: "8px 18px",
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: 13,
    fontWeight: 500,
    transition: tokens.transitions.fast,
  },
  botonCerrar: {
    width: 32,
    height: 32,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${tokens.colors.ink15}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 1,
    transition: tokens.transitions.fast,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
