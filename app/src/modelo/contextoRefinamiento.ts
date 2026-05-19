import { obtenerRefinamiento } from "./refinamientos";
import { contenedorRefinamiento, dentroDeApariencia } from "./layout";
import type {
  Apariencia,
  ContextoRefinamientoApariencia,
  Id,
  Modelo,
  RolContextoRefinamiento,
} from "./tipos";

export function contextoContornoDescomposicion(refinableEntidadId: Id): ContextoRefinamientoApariencia {
  return { tipo: "descomposicion", refinableEntidadId, rol: "contorno" };
}

export function contextoInternoDescomposicion(
  refinableEntidadId: Id,
  contenedorAparienciaId: Id,
): ContextoRefinamientoApariencia {
  return { tipo: "descomposicion", refinableEntidadId, rol: "interno", contenedorAparienciaId };
}

export function contextoExternoDescomposicion(
  refinableEntidadId: Id,
  contenedorAparienciaId: Id,
  enlacesPadreIds: Id[] = [],
): ContextoRefinamientoApariencia {
  return {
    tipo: "descomposicion",
    refinableEntidadId,
    rol: "externo",
    contenedorAparienciaId,
    ...(enlacesPadreIds.length > 0 ? { enlacesPadreIds } : {}),
  };
}

export function contextoRefinamientoValido(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
): ContextoRefinamientoApariencia | null {
  const contexto = apariencia.contextoRefinamiento;
  if (!contexto || contexto.tipo !== "descomposicion") return null;
  const refinable = modelo.entidades[contexto.refinableEntidadId];
  if (!refinable || obtenerRefinamiento(refinable, "descomposicion")?.opdId !== opdId) return null;
  return contexto;
}

export function rolAparienciaEnRefinamiento(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  esContornoDerivado = false,
): RolContextoRefinamiento {
  if (esContornoDerivado) return "contorno";
  const contexto = contextoRefinamientoValido(modelo, opdId, apariencia);
  if (contexto) {
    if (contexto.rol === "interno" && aparienciaFueraDelContorno(modelo, opdId, apariencia)) return "externo";
    return contexto.rol;
  }
  if (aparienciaFueraDelContorno(modelo, opdId, apariencia)) return "externo";
  return entidadApareceEnOtroOpd(modelo, opdId, apariencia.entidadId) ? "externo" : "interno";
}

export function aparienciaEsExternaDeRefinamiento(modelo: Modelo, opdId: Id, apariencia: Apariencia): boolean {
  const contexto = contextoRefinamientoValido(modelo, opdId, apariencia);
  if (contexto) return contexto.rol === "externo";
  return entidadApareceEnOtroOpd(modelo, opdId, apariencia.entidadId);
}

export function aparienciaEsInternaDeRefinamiento(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  contorno?: Apariencia,
): boolean {
  const contexto = contextoRefinamientoValido(modelo, opdId, apariencia);
  if (contexto) return contexto.rol === "interno" && aparienciaDentroDelContorno(modelo, opdId, apariencia, contorno);
  if (aparienciaEsExternaDeRefinamiento(modelo, opdId, apariencia)) return false;
  return aparienciaDentroDelContorno(modelo, opdId, apariencia, contorno);
}

function entidadApareceEnOtroOpd(modelo: Modelo, opdId: Id, entidadId: Id): boolean {
  for (const otroOpdId of Object.keys(modelo.opds)) {
    if (otroOpdId === opdId) continue;
    const otroOpd = modelo.opds[otroOpdId];
    if (!otroOpd) continue;
    if (Object.values(otroOpd.apariencias).some((apariencia) => apariencia.entidadId === entidadId)) return true;
  }
  return false;
}

function aparienciaDentroDelContorno(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  contorno: Apariencia | undefined,
): boolean {
  const limite = contorno ?? contenedorRefinamiento(modelo, opdId);
  return limite ? dentroDeApariencia(apariencia, limite) : true;
}

function aparienciaFueraDelContorno(modelo: Modelo, opdId: Id, apariencia: Apariencia): boolean {
  const contorno = contenedorRefinamiento(modelo, opdId);
  if (!contorno || contorno.id === apariencia.id) return false;
  return !dentroDeApariencia(apariencia, contorno);
}
