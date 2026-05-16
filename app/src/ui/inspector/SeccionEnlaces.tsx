// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { entidadIdDeExtremo, nombreExtremo } from "../../modelo/extremos";
import type { Entidad, Id, Modelo, TipoRefinamiento } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";

type DireccionEnlaceEntidad = "entrante" | "saliente";

export interface FilaEnlaceEntidad {
  enlaceId: Id;
  direccion: DireccionEnlaceEntidad;
  simbolo: "←" | "→" | "↔";
  tipoOpl: string;
  contraparte: string;
  opds: string;
  opdsCount: number;
}

export interface FilaRefinamientoEntidad {
  id: string;
  tipo: TipoRefinamiento;
  etiqueta: string;
  opdNombre: string;
  modo?: string | undefined;
}

export interface ResumenEnlacesEntidad {
  entrantes: FilaEnlaceEntidad[];
  salientes: FilaEnlaceEntidad[];
  refinamientos: FilaRefinamientoEntidad[];
}

interface Props {
  modelo: Modelo;
  entidad: Entidad;
  onNavegarEnlace: (enlaceId: Id) => void;
}

/**
 * IFML §7.5 / CN-MD: el tab Enlaces es un multidetail de la entidad
 * seleccionada. Cada fila expone un SelectEvent que navega al InspectorEnlace.
 */
export function SeccionEnlaces({ modelo, entidad, onNavegarEnlace }: Props) {
  const resumen = listarEnlacesEntidad(modelo, entidad.id);
  const totalEnlaces = resumen.entrantes.length + resumen.salientes.length;
  const totalItems = totalEnlaces + resumen.refinamientos.length;

  if (totalItems === 0) {
    return (
      <div data-testid="inspector-panel-enlaces-contenido">
        <p data-testid="inspector-enlaces-vacio" style={style.aparicionEmpty}>
          {`${entidad.nombre} no participa en enlaces todavía. Usa Conectar ⌖ para agregar.`}
        </p>
      </div>
    );
  }

  return (
    <div data-testid="inspector-panel-enlaces-contenido" style={enlacesStyles.container}>
      <GrupoEnlaces titulo={`Entrantes (${resumen.entrantes.length})`} testid="inspector-enlaces-entrantes">
        {resumen.entrantes.length > 0
          ? resumen.entrantes.map((fila) => (
            <FilaEnlace key={fila.enlaceId} fila={fila} onNavegar={() => onNavegarEnlace(fila.enlaceId)} />
          ))
          : <span style={enlacesStyles.emptyLine}>Sin enlaces entrantes</span>}
      </GrupoEnlaces>
      <GrupoEnlaces titulo={`Salientes (${resumen.salientes.length})`} testid="inspector-enlaces-salientes">
        {resumen.salientes.length > 0
          ? resumen.salientes.map((fila) => (
            <FilaEnlace key={fila.enlaceId} fila={fila} onNavegar={() => onNavegarEnlace(fila.enlaceId)} />
          ))
          : <span style={enlacesStyles.emptyLine}>Sin enlaces salientes</span>}
      </GrupoEnlaces>
      <GrupoEnlaces titulo={`Refinamientos (${resumen.refinamientos.length})`} testid="inspector-enlaces-refinamientos">
        {resumen.refinamientos.length > 0
          ? resumen.refinamientos.map((fila) => (
            <div key={fila.id} style={enlacesStyles.refinementRow}>
              <span style={enlacesStyles.kind}>{fila.etiqueta}</span>
              <span style={enlacesStyles.counterpart}>{fila.opdNombre}</span>
              {fila.modo ? <span style={enlacesStyles.meta}>{fila.modo}</span> : null}
            </div>
          ))
          : <span style={enlacesStyles.emptyLine}>Sin enlaces de refinamiento</span>}
      </GrupoEnlaces>
    </div>
  );
}

export function listarEnlacesEntidad(modelo: Modelo, entidadId: Id): ResumenEnlacesEntidad {
  const entrantes: FilaEnlaceEntidad[] = [];
  const salientes: FilaEnlaceEntidad[] = [];

  for (const enlace of Object.values(modelo.enlaces)) {
    const origenPertenece = entidadIdDeExtremo(modelo, enlace.origenId) === entidadId;
    const destinoPertenece = entidadIdDeExtremo(modelo, enlace.destinoId) === entidadId;
    if (!origenPertenece && !destinoPertenece) continue;

    const direccion: DireccionEnlaceEntidad = destinoPertenece && !origenPertenece ? "entrante" : "saliente";
    const contraparte = direccion === "entrante" ? enlace.origenId : enlace.destinoId;
    const fila: FilaEnlaceEntidad = {
      enlaceId: enlace.id,
      direccion,
      simbolo: origenPertenece && destinoPertenece ? "↔" : direccion === "entrante" ? "←" : "→",
      tipoOpl: etiquetaTipoOpl(enlace.tipo),
      contraparte: nombreExtremo(modelo, contraparte),
      ...opdsDondeVive(modelo, enlace.id),
    };
    if (direccion === "entrante") entrantes.push(fila);
    else salientes.push(fila);
  }

  entrantes.sort(ordenarFilas);
  salientes.sort(ordenarFilas);

  return {
    entrantes,
    salientes,
    refinamientos: listarRefinamientosEntidad(modelo, entidadId),
  };
}

function listarRefinamientosEntidad(modelo: Modelo, entidadId: Id): FilaRefinamientoEntidad[] {
  const entidad = modelo.entidades[entidadId];
  if (!entidad?.refinamientos) return [];
  const filas: FilaRefinamientoEntidad[] = [];
  for (const tipo of ["descomposicion", "despliegue"] as const) {
    const slot = entidad.refinamientos[tipo];
    if (!slot) continue;
    filas.push({
      id: `${tipo}:${slot.opdId}`,
      tipo,
      etiqueta: tipo === "descomposicion" ? "inzoom" : "despliegue",
      opdNombre: modelo.opds[slot.opdId]?.nombre ?? slot.opdId,
      modo: slot.modo ? etiquetaTipoOpl(slot.modo) : undefined,
    });
  }
  return filas;
}

function opdsDondeVive(modelo: Modelo, enlaceId: Id): { opds: string; opdsCount: number } {
  const opds = Object.values(modelo.opds)
    .filter((opd) => Object.values(opd.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId))
    .map((opd) => opd.nombre)
    .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
  return { opds: opds.length > 0 ? opds.join(", ") : "sin OPD", opdsCount: opds.length };
}

function etiquetaTipoOpl(tipo: string): string {
  return tipo
    .replace(/([a-záéíóúñ])([A-Z])/g, "$1 $2")
    .replace(/sub sobretiempo/i, "sub/sobretiempo")
    .toLocaleLowerCase("es");
}

function ordenarFilas(a: FilaEnlaceEntidad, b: FilaEnlaceEntidad): number {
  return a.tipoOpl.localeCompare(b.tipoOpl, "es", { sensitivity: "base" }) ||
    a.contraparte.localeCompare(b.contraparte, "es", { sensitivity: "base" }) ||
    a.enlaceId.localeCompare(b.enlaceId, "es", { sensitivity: "base" });
}

function GrupoEnlaces(props: { titulo: string; testid: string; children: preact.ComponentChildren }) {
  return (
    <section data-testid={props.testid} style={enlacesStyles.group} aria-label={props.titulo}>
      <h4 style={enlacesStyles.heading}>{props.titulo}</h4>
      <div style={enlacesStyles.rows}>{props.children}</div>
    </section>
  );
}

function FilaEnlace({ fila, onNavegar }: { fila: FilaEnlaceEntidad; onNavegar: () => void }) {
  return (
    <button
      type="button"
      style={enlacesStyles.linkRow}
      onClick={onNavegar}
      data-testid={`inspector-enlaces-fila-${fila.enlaceId}`}
      data-ifml-event="SelectEvent"
      data-ifml-flow="NavigationFlow"
      title={`Ir al enlace ${fila.tipoOpl} en ${fila.opds}`}
      aria-label={`Ir al enlace ${fila.tipoOpl} con ${fila.contraparte}`}
    >
      <span style={enlacesStyles.direction}>{fila.simbolo}</span>
      <span style={enlacesStyles.kind}>{fila.tipoOpl}</span>
      <span style={enlacesStyles.counterpart}>{fila.contraparte}</span>
      <span style={enlacesStyles.meta}>{fila.opdsCount === 0 ? "sin OPD" : fila.opds}</span>
    </button>
  );
}

const enlacesStyles = {
  container: {
    display: "grid",
    gap: tokens.spacing.md,
  },
  group: {
    display: "grid",
    gap: tokens.spacing.xs,
  },
  heading: {
    margin: 0,
    color: tokens.colors.textoPrimario,
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.bold,
  },
  rows: {
    display: "grid",
    gap: tokens.spacing.xs,
  },
  linkRow: {
    display: "grid",
    gridTemplateColumns: "18px minmax(70px, 0.85fr) minmax(0, 1fr)",
    alignItems: "center",
    gap: tokens.spacing.xs,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    border: `1px solid ${tokens.colors.bordeChrome}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    font: "inherit",
    textAlign: "left",
  },
  refinementRow: {
    display: "grid",
    gridTemplateColumns: "minmax(92px, 0.9fr) minmax(0, 1fr)",
    alignItems: "center",
    gap: tokens.spacing.xs,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    border: `1px solid ${tokens.colors.bordeChrome}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoPrimario,
  },
  direction: {
    color: tokens.colors.chromeNeutral,
    fontSize: `${tokens.typography.sizes.md}px`,
    fontWeight: tokens.typography.weights.bold,
  },
  kind: {
    color: tokens.colors.textoPrimario,
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.bold,
  },
  counterpart: {
    minWidth: 0,
    overflow: "hidden",
    color: tokens.colors.textoPrimario,
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.semibold,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  meta: {
    gridColumn: "2 / -1",
    minWidth: 0,
    overflow: "hidden",
    color: tokens.colors.textoSecundario,
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.semibold,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  emptyLine: {
    color: tokens.colors.textoTerciario,
    fontSize: `${tokens.typography.sizes.sm}px`,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
