import type { Id, Modelo, Opd, SubmodeloReferencia } from "../../modelo/tipos";
import { hintEntidad, nombreOpl, refEntidad, type OplLineaPendiente } from "./refsHints";

export function oracionesComposicionIntermodelo(modelo: Modelo, opd: Opd): OplLineaPendiente[] {
  if (opd.vista?.kind !== "submodel-view") return [];
  const ref = modelo.submodelos?.[opd.vista.submodeloRefId];
  if (!ref) return [];
  const codigo = codigoOpd(opd.nombre);
  const nombreSubmodelo = ref.source?.nombre ?? ref.nombre;
  const lineas: OplLineaPendiente[] = [
    {
      texto: `${codigo} es una vista de sub-modelo de ${nombreSubmodelo}.`,
      refs: [],
      hints: [],
    },
  ];
  const padre = opd.padreId ? modelo.opds[opd.padreId] : undefined;
  if (padre) {
    lineas.push({
      texto: `${codigo} referencia el sub-modelo ${nombreSubmodelo} desde ${codigoOpd(padre.nombre)}.`,
      refs: [],
      hints: [],
    });
  }
  lineas.push(...oracionesReferenciasExternas(modelo, opd, ref, codigo));
  return lineas;
}

function oracionesReferenciasExternas(modelo: Modelo, opd: Opd, ref: SubmodeloReferencia, codigo: string): OplLineaPendiente[] {
  const compartidas = ref.contrato?.compartidas ?? ref.compartidas;
  if (!compartidas) return [];
  const inversaMaterializada = invertir(ref.materializacion?.entidadMap ?? {});
  const lineas: OplLineaPendiente[] = [];
  for (const [sourceId, propietariaId] of Object.entries(compartidas)) {
    const localId = ref.materializacion?.entidadMap[sourceId] ?? inversaMaterializada[sourceId] ?? sourceId;
    const local = modelo.entidades[localId];
    const propietaria = modelo.entidades[propietariaId];
    if (!local || !propietaria) continue;
    lineas.push({
      texto: `${nombreOpl(local)} en ${codigo} es referencia externa a ${nombreOpl(propietaria)} del modelo propietario ${modelo.nombre}.`,
      refs: [refEntidad(local.id), refEntidad(propietaria.id)],
      hints: [hintEntidad(local), hintEntidad(propietaria)],
    });
  }
  if (lineas.length === 0 && Object.keys(compartidas).length > 0) {
    for (const apariencia of Object.values(opd.apariencias)) {
      const entidad = modelo.entidades[apariencia.entidadId];
      if (!entidad || !Object.values(compartidas).includes(entidad.id)) continue;
      lineas.push({
        texto: `${nombreOpl(entidad)} en ${codigo} es referencia externa del modelo propietario ${modelo.nombre}.`,
        refs: [refEntidad(entidad.id)],
        hints: [hintEntidad(entidad)],
      });
    }
  }
  return lineas;
}

function codigoOpd(nombre: string): string {
  return /^SD(?:\d+(?:\.\d+)*)?/.exec(nombre.trim())?.[0] ?? nombre;
}

function invertir(map: Record<Id, Id>): Record<Id, Id> {
  return Object.fromEntries(Object.entries(map).map(([source, local]) => [local, source]));
}
