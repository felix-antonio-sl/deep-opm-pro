// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useState } from "preact/hooks";
import { useOpmStore } from "../../store";
import { tokens } from "../tokens";

/**
 * Vista Modelos del shell mobile-readonly: lista los modelos guardados del
 * tenant autenticado (auth v1) y abre uno en modo lectura. Cierra el hueco
 * que MobileReadonlyApp delegaba a "la futura capa de tenants/auth".
 * Solo lectura: abrir un modelo NO es mutación del modelo (es proyección).
 */
interface Props {
  /** Notifica al shell que un modelo quedó cargado (para saltar al diagrama). */
  onAbierto: () => void;
}

export function VistaModelosLectura(props: Props) {
  const modelosGuardados = useOpmStore((s) => s.modelosGuardados);
  const cargarLocal = useOpmStore((s) => s.cargarLocal);
  const mensaje = useOpmStore((s) => s.mensaje);
  const [abriendoId, setAbriendoId] = useState<string | null>(null);

  const abrir = (id: string) => {
    setAbriendoId(id);
    // cargarLocal es sincrónico en su dispatch; el load real es async y al
    // resolver actualiza modelo+opdActivo en el store. El salto al diagrama
    // es inmediato: el canvas proyecta el modelo cuando llega.
    cargarLocal(id);
    props.onAbierto();
  };

  return (
    <div style={vistaStyles.container} data-testid="mobile-vista-modelos">
      <h2 style={vistaStyles.titulo}>Modelos guardados</h2>
      {modelosGuardados.length === 0 ? (
        <p style={vistaStyles.vacio} data-testid="mobile-modelos-vacio">
          No hay modelos guardados en esta cuenta.
        </p>
      ) : (
        <ul style={vistaStyles.lista}>
          {modelosGuardados.map((modelo) => (
            <li key={modelo.id}>
              <button
                type="button"
                style={vistaStyles.item}
                data-testid="mobile-modelo-item"
                disabled={abriendoId === modelo.id}
                onClick={() => abrir(modelo.id)}
              >
                <span style={vistaStyles.nombre}>{modelo.nombre}</span>
                <span style={vistaStyles.meta}>
                  {abriendoId === modelo.id ? "Abriendo…" : `Actualizado ${modelo.actualizadoEn.slice(0, 10)}`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {mensaje ? <p style={vistaStyles.mensaje} role="status">{mensaje}</p> : null}
    </div>
  );
}

const vistaStyles: Record<string, preact.JSX.CSSProperties> = {
  container: {
    width: "100%",
    height: "100%",
    overflow: "auto",
    padding: `${tokens.spacing.md}px`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: `${tokens.spacing.sm}px`,
  },
  titulo: {
    margin: 0,
    fontSize: `${tokens.typography.fs.fs17}px`,
    fontWeight: tokens.typography.weights.bold,
    color: tokens.colors.ink,
  },
  vacio: {
    margin: 0,
    color: tokens.colors.inkSoft,
    fontSize: `${tokens.typography.fs.fs13}px`,
  },
  lista: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: `${tokens.spacing.xs}px`,
  },
  item: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "2px",
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    textAlign: "left",
    fontFamily: tokens.typography.familyChrome,
  },
  nombre: {
    fontSize: `${tokens.typography.fs.fs14}px`,
    fontWeight: tokens.typography.weights.bold,
  },
  meta: {
    fontSize: `${tokens.typography.fs.fs11}px`,
    color: tokens.colors.inkSoft,
  },
  mensaje: {
    margin: 0,
    color: tokens.colors.inkSoft,
    fontSize: `${tokens.typography.fs.fs11}px`,
  },
};
