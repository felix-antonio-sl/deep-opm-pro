// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import type { Entidad, Id, Modelo } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { etiquetaRefinamiento, listarApariciones } from "./aparicionesUtils";

/**
 * L1 ronda 20 — Tab Apariciones del Inspector de entidad.
 *
 * Lista plana de OPDs donde aparece la entidad (decisión §10 brief). Cada
 * fila navega al OPD destino y selecciona la apariencia correspondiente,
 * manteniendo la selección semántica cross-OPD (informe UI/UX 2026-05-07
 * §P1 inspector líneas 98-114).
 *
 * El item correspondiente al OPD activo se marca como activo (no clickeable)
 * para evitar navegación redundante.
 */

interface Props {
  modelo: Modelo;
  entidad: Entidad;
  opdActivoId: Id;
  onNavegar: (opdId: Id) => void;
}

export function SeccionApariciones({ modelo, entidad, opdActivoId, onNavegar }: Props) {
  const apariciones = listarApariciones(modelo, entidad.id, opdActivoId);
  if (apariciones.length === 0) {
    return (
      <p data-testid="seccion-apariciones-vacio" style={style.aparicionEmpty}>
        Sin apariciones registradas en el modelo.
      </p>
    );
  }
  return (
    <div data-testid="seccion-apariciones" style={style.aparicionesList}>
      {apariciones.map((item) => (
        <button
          key={item.aparienciaId}
          type="button"
          data-testid={`aparicion-${item.opdId}`}
          aria-current={item.esActivo ? "page" : undefined}
          disabled={item.esActivo}
          style={item.esActivo ? style.aparicionItemActivo : style.aparicionItem}
          onClick={() => {
            if (!item.esActivo) onNavegar(item.opdId);
          }}
        >
          <span style={style.aparicionOpdNombre}>{item.opdNombre}</span>
          <span style={style.aparicionMeta}>
            {etiquetaRefinamiento(item.refinamientoTipo)}
            {item.esActivo ? " · activo" : ""}
          </span>
        </button>
      ))}
    </div>
  );
}
