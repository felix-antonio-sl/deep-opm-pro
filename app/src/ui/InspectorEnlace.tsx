import { useOpmStore } from "../store";
import type { Enlace } from "../modelo/tipos";
import { inspectorStyles as style } from "./inspectorStyles";

interface Props {
  enlace: Enlace;
}

export function InspectorEnlace({ enlace }: Props) {
  const modelo = useOpmStore((s) => s.modelo);
  const eliminar = useOpmStore((s) => s.eliminarSeleccion);
  const origen = modelo.entidades[enlace.origenId];
  const destino = modelo.entidades[enlace.destinoId];

  return (
    <>
      <div style={style.header}>
        <span style={style.kind}>Enlace {capitalizar(enlace.tipo)}</span>
        <code style={style.id}>{enlace.id}</code>
      </div>

      <div style={style.summary}>
        <span>{origen?.nombre ?? enlace.origenId}</span>
        <span style={style.arrow}>{"->"}</span>
        <span>{destino?.nombre ?? enlace.destinoId}</span>
      </div>

      <button type="button" style={style.dangerButton} onClick={eliminar}>Eliminar enlace</button>
    </>
  );
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
