import type { Apariencia, Entidad, Id, Modelo, ModoPlegado, Opd, Resultado } from "./tipos";

export interface PartePlegada {
  entidadId: Id;
  nombre: string;
}

export function modoPlegadoApariencia(apariencia: Pick<Apariencia, "modoPlegado">): ModoPlegado {
  return apariencia.modoPlegado ?? "completo";
}

export function cambiarModoPlegado(
  modelo: Modelo,
  opdId: Id,
  aparienciaId: Id,
  modo: ModoPlegado,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return fallo(`Apariencia no existe: ${aparienciaId}`);
  const entidad = modelo.entidades[apariencia.entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${apariencia.entidadId}`);
  const partes = partesDePlegado(modelo, entidad.id);

  if (partes.length === 0 && modo === "parcial") {
    return fallo("El plegado parcial requiere una entidad con partes");
  }
  if (modoPlegadoApariencia(apariencia) === modo) return ok(modelo);

  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: {
          ...opd.apariencias,
          [aparienciaId]: {
            ...apariencia,
            modoPlegado: modo,
          },
        },
      },
    },
  });
}

export function tienePartesPlegables(modelo: Modelo, entidadId: Id): boolean {
  return partesDePlegado(modelo, entidadId).length > 0;
}

export function partesDePlegado(modelo: Modelo, entidadId: Id): PartePlegada[] {
  const entidad = modelo.entidades[entidadId];
  if (!entidad?.refinamiento) return [];
  const opd = modelo.opds[entidad.refinamiento.opdId];
  if (!opd) return [];
  const partes = entidad.refinamiento.tipo === "descomposicion"
    ? subprocesosDeDescomposicion(modelo, entidad, opd)
    : partesDeDespliegue(modelo, entidad, opd);

  return partes.sort((a, b) => a.nombre.localeCompare(b.nombre, "es") || a.entidadId.localeCompare(b.entidadId));
}

function subprocesosDeDescomposicion(modelo: Modelo, entidad: Entidad, opd: Opd): PartePlegada[] {
  const contorno = aparienciaDeEntidad(opd, entidad.id);
  if (!contorno) return [];

  return Object.values(opd.apariencias)
    .filter((apariencia) => apariencia.entidadId !== entidad.id)
    .filter((apariencia) => dentroDe(apariencia, contorno))
    .flatMap((apariencia) => {
      const subproceso = modelo.entidades[apariencia.entidadId];
      return subproceso?.tipo === "proceso" ? [{ entidadId: subproceso.id, nombre: subproceso.nombre }] : [];
    });
}

function partesDeDespliegue(modelo: Modelo, entidad: Entidad, opd: Opd): PartePlegada[] {
  const visibles = new Set(Object.values(opd.apariencias).map((apariencia) => apariencia.entidadId));
  return Object.values(opd.enlaces)
    .flatMap((aparienciaEnlace) => {
      const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
      if (enlace?.tipo !== "agregacion" || enlace.origenId !== entidad.id || !visibles.has(enlace.destinoId)) return [];
      const parte = modelo.entidades[enlace.destinoId];
      return parte?.tipo === "objeto" ? [{ entidadId: parte.id, nombre: parte.nombre }] : [];
    });
}

function aparienciaDeEntidad(opd: Opd, entidadId: Id): Apariencia | undefined {
  return Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === entidadId);
}

function dentroDe(apariencia: Apariencia, contorno: Apariencia): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
