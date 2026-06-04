import type { Id, ModoImagenEntidad, TipoEnlace } from "../../modelo/tipos";
import type { EstadoTarget } from "./estadoTargets";

export type RolApariencia = "contorno" | "interno" | "externo";

export type OpmJointMetadata =
  | {
      kind: "entidad";
      opdId: Id;
      entidadId: Id;
      aparienciaId: Id;
      rol: RolApariencia;
      estadosInteractivos?: EstadoTarget[];
      partesPlegadas?: Array<{ selector: string; entidadId: Id }>;
    }
  | {
      kind: "enlace";
      opdId: Id;
      enlaceId: Id;
      aparienciaEnlaceId: Id;
      tipo: TipoEnlace;
      enlaceIds?: Id[];
      aparienciaEnlaceIds?: Id[];
      rolEstructural?: "refinable" | "rama" | "simbolo";
      rolInvocacion?: "auto-salida" | "auto-retorno";
      ladoRefinable?: "origen" | "destino";
    }
  | {
      kind: "grupo-enlaces";
      tipoGrupo: "estructural";
      opdId: Id;
      grupoId: Id;
      tipo: TipoEnlace;
      refinableId: Id;
      enlaceIds: Id[];
      aparienciaEnlaceIds: Id[];
      ladoRefinable: "origen" | "destino";
    }
  | {
      kind: "proxy-plegado";
      opdId: Id;
      padreAparienciaId: Id;
      parteAparienciaId: Id;
      parteEntidadId: Id;
    }
  | {
      kind: "overlay-abanico";
      opdId: Id;
      abanicoId: Id;
      operador: "O" | "XOR";
    }
  | {
      kind: "imagen-overlay";
      opdId: Id;
      entidadId: Id;
      aparienciaId: Id;
    }
  | {
      kind: "imagen-insignia";
      opdId: Id;
      entidadId: Id;
      aparienciaId: Id;
    }
  | {
      kind: "selection-halo";
      opdId: Id;
      targetId: Id;
      targetKind?: "entidad" | "estado";
    }
  | {
      kind: "simulacion-halo";
      opdId: Id;
      targetId: Id;
      tipo: "proceso-activo" | "estado-current" | "estado-resultado" | "entidad-involucrada" | "estado-inicial";
    };

export interface JointCellJson {
  id: Id;
  type:
    | "standard.Rectangle"
    | "standard.Ellipse"
    | "standard.Link"
    | "standard.Polygon"
    | "standard.Path"
    | "standard.Circle"
    | "standard.Image"
    | "opm.AbanicoArc";
  opm: OpmJointMetadata;
  z: number;
  [key: string]: unknown;
}

export interface OpcionesProyeccion {
  aliasVisibles?: boolean;
  descripcionesVisibles?: boolean;
  modoImagenGlobal?: ModoImagenEntidad | null;
}
