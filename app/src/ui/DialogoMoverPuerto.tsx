import { useEffect, useMemo, useState } from "preact/hooks";
import { extremoEntidad, extremoEstado, nombreExtremo } from "../modelo/extremos";
import { estadosDeEntidad } from "../modelo/operaciones";
import type { Enlace, ExtremoEnlace, Id, Modelo } from "../modelo/tipos";
import { Dialogo } from "./Dialogo";
import { inspectorStyles as style } from "./inspectorStyles";

interface Props {
  open: boolean;
  modelo: Modelo;
  opdId: Id;
  enlace: Enlace;
  onCancel: () => void;
  onMover: (lado: "origen" | "destino", extremo: ExtremoEnlace) => void;
  onRemover: () => void;
}

export function DialogoMoverPuerto(props: Props) {
  const opciones = useMemo(() => opcionesExtremo(props.modelo, props.opdId), [props.modelo, props.opdId]);
  const [lado, setLado] = useState<"origen" | "destino">("destino");
  const [value, setValue] = useState(() => serializarExtremo(props.enlace.destinoId));
  const extremoActual = lado === "origen" ? props.enlace.origenId : props.enlace.destinoId;
  const extremoSeleccionado = parsearExtremo(value) ?? extremoActual;

  useEffect(() => {
    if (!props.open) return;
    setLado("destino");
    setValue(serializarExtremo(props.enlace.destinoId));
  }, [props.open, props.enlace.id, props.enlace.destinoId]);

  return (
    <Dialogo
      open={props.open}
      title="Mover Puerto"
      onCancel={props.onCancel}
      actions={(
        <>
          <button type="button" style={dangerButtonStyle} onClick={props.onRemover}>Remover relación</button>
          <button type="button" style={style.secondaryButton} onClick={props.onCancel}>Cancelar</button>
          <button type="button" style={style.primaryButton} onClick={() => props.onMover(lado, extremoSeleccionado)}>Mover</button>
        </>
      )}
    >
      <div data-testid="dialogo-mover-puerto" style={bodyStyle}>
        <label style={style.field}>
          <span style={style.label}>Puerto</span>
          <select
            style={style.input}
            value={lado}
            onChange={(event) => {
              const siguiente = event.currentTarget.value as "origen" | "destino";
              setLado(siguiente);
              setValue(serializarExtremo(siguiente === "origen" ? props.enlace.origenId : props.enlace.destinoId));
            }}
          >
            <option value="origen">Origen: {nombreExtremo(props.modelo, props.enlace.origenId)}</option>
            <option value="destino">Destino: {nombreExtremo(props.modelo, props.enlace.destinoId)}</option>
          </select>
        </label>
        <label style={style.field}>
          <span style={style.label}>Nuevo extremo</span>
          <select
            data-testid="mover-puerto-extremo-select"
            style={style.input}
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
          >
            {opciones.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
            ))}
          </select>
        </label>
      </div>
    </Dialogo>
  );
}

function opcionesExtremo(modelo: Modelo, opdId: Id): Array<{ value: string; label: string }> {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  return Object.values(opd.apariencias).flatMap((apariencia) => {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (!entidad) return [];
    return [
      { value: serializarExtremo(extremoEntidad(entidad.id)), label: entidad.nombre },
      ...estadosDeEntidad(modelo, entidad.id).map((estado) => ({
        value: serializarExtremo(extremoEstado(estado.id)),
        label: `${entidad.nombre} [${estado.nombre}]`,
      })),
    ];
  });
}

function serializarExtremo(extremo: ExtremoEnlace): string {
  return `${extremo.kind}:${extremo.id}`;
}

function parsearExtremo(value: string): ExtremoEnlace | null {
  const [kind, id] = value.split(":");
  if (!id) return null;
  if (kind === "entidad") return extremoEntidad(id);
  if (kind === "estado") return extremoEstado(id);
  return null;
}

const bodyStyle = { display: "grid", gap: "10px" } satisfies preact.JSX.CSSProperties;
const dangerButtonStyle = { ...style.dangerButton, marginRight: "auto" } satisfies preact.JSX.CSSProperties;
