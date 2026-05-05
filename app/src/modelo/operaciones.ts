import { CANON } from "./constantes";
import { contenedorRefinamiento } from "./layout";
import type {
  Afiliacion,
  Apariencia,
  AparienciaEnlace,
  Enlace,
  Entidad,
  Esencia,
  Estado,
  Id,
  ModoDespliegueObjeto,
  Modelo,
  Opd,
  Posicion,
  Resultado,
  TipoEnlace,
  TipoEntidad,
} from "./tipos";

export interface DescomposicionProceso {
  modelo: Modelo;
  opdId: Id;
  creado: boolean;
}

export interface DespliegueObjeto {
  modelo: Modelo;
  opdId: Id;
  creado: boolean;
  modo: ModoDespliegueObjeto;
}

export interface EstadosInicialesObjeto {
  modelo: Modelo;
  estadoIds: [Id, Id];
  creado: boolean;
}

export interface EstadoCreado {
  modelo: Modelo;
  estadoId: Id;
}

export type LadoMultiplicidadEnlace = "origen" | "destino";

const MULTIPLICIDAD_CANONICA_RE = /^\d+$|^\*$|^\d+\.\.\d+$|^\d+\.\.N$/;

const INZOOM = {
  subprocesosIniciales: 3,
  paddingSuperior: 100,
  separacionVertical: 30,
  toleranciaParaleloY: 4,
  contornoWidth: CANON.dims.cosaWidth * 3,
  contornoHeight: (CANON.dims.cosaHeight + 30) * 3 + 100 + 65,
} as const;

const UNFOLD = {
  partesIniciales: 3,
  paddingSuperior: 132,
  separacionHorizontal: 30,
  contornoWidth: CANON.dims.cosaWidth * 3 + 120,
  contornoHeight: CANON.dims.cosaHeight + 132 + 80,
} as const;

export function crearModelo(nombre = "Modelo OPM"): Modelo {
  const opdRaizId = "opd-1";
  return {
    id: "modelo-1",
    nombre,
    opdRaizId,
    opds: {
      [opdRaizId]: {
        id: opdRaizId,
        nombre: "SD",
        padreId: null,
        apariencias: {},
        enlaces: {},
      },
    },
    entidades: {},
    estados: {},
    enlaces: {},
    nextSeq: 1,
  };
}

export function crearObjeto(modelo: Modelo, opdId: Id, posicion: Posicion, nombre = "Objeto"): Resultado<Modelo> {
  return crearEntidad(modelo, opdId, "objeto", posicion, nombre);
}

export function crearProceso(modelo: Modelo, opdId: Id, posicion: Posicion, nombre = "Proceso"): Resultado<Modelo> {
  return crearEntidad(modelo, opdId, "proceso", posicion, nombre);
}

export function descomponerProceso(modelo: Modelo, opdPadreId: Id, procesoId: Id): Resultado<DescomposicionProceso> {
  const opdPadre = modelo.opds[opdPadreId];
  if (!opdPadre) return fallo(`OPD no existe: ${opdPadreId}`);
  const proceso = modelo.entidades[procesoId];
  if (!proceso) return fallo(`Entidad no existe: ${procesoId}`);
  if (proceso.tipo !== "proceso") return fallo("La descomposición requiere un proceso");
  if (!entidadVisibleEnOpd(opdPadre, procesoId)) {
    return fallo("La descomposición requiere que el proceso tenga apariencia en el OPD activo");
  }

  if (proceso.refinamiento?.tipo === "descomposicion") {
    const opdExistente = modelo.opds[proceso.refinamiento.opdId];
    if (!opdExistente) return fallo(`OPD de descomposición no existe: ${proceso.refinamiento.opdId}`);
    return ok({ modelo, opdId: opdExistente.id, creado: false });
  }

  const opdHijoId = siguienteId(modelo, "opd");
  let nextSeq = modelo.nextSeq + 1;
  const aparienciaHijoId = siguienteId({ ...modelo, nextSeq }, "a");
  nextSeq += 1;
  const aparienciaHijo: Apariencia = {
    id: aparienciaHijoId,
    entidadId: procesoId,
    opdId: opdHijoId,
    x: 150,
    y: 90,
    width: INZOOM.contornoWidth,
    height: INZOOM.contornoHeight,
  };
  const aparienciasExternas = aparienciasExtremosExternos(modelo, opdPadre, procesoId, opdHijoId, nextSeq);
  nextSeq = aparienciasExternas.nextSeq;
  const subprocesos = subprocesosInicialesInzoom(modelo, proceso, aparienciaHijo, opdHijoId, nextSeq);
  nextSeq = subprocesos.nextSeq;
  const opdHijo: Opd = {
    id: opdHijoId,
    nombre: siguienteNombreOpdHijo(modelo, opdPadreId),
    padreId: opdPadreId,
    apariencias: {
      [aparienciaHijoId]: aparienciaHijo,
      ...aparienciasExternas.apariencias,
      ...subprocesos.apariencias,
    },
    enlaces: {},
  };
  const base: Modelo = {
    ...modelo,
    nextSeq,
    entidades: {
      ...modelo.entidades,
      [procesoId]: {
        ...proceso,
        refinamiento: {
          tipo: "descomposicion",
          opdId: opdHijoId,
        },
      },
      ...subprocesos.entidades,
    },
    opds: {
      ...modelo.opds,
      [opdHijoId]: opdHijo,
    },
  };
  const siguiente = proyectarEnlacesExternosEnRefinamiento(base, opdHijoId, {
    primeroId: subprocesos.primeroId,
    ultimoId: subprocesos.ultimoId,
  });
  if (!siguiente.ok) return fallo(siguiente.error);

  return ok({ modelo: siguiente.value, opdId: opdHijoId, creado: true });
}

export function desplegarObjeto(
  modelo: Modelo,
  opdPadreId: Id,
  objetoId: Id,
  modo: ModoDespliegueObjeto = "agregacion",
): Resultado<DespliegueObjeto> {
  const opdPadre = modelo.opds[opdPadreId];
  if (!opdPadre) return fallo(`OPD no existe: ${opdPadreId}`);
  const objeto = modelo.entidades[objetoId];
  if (!objeto) return fallo(`Entidad no existe: ${objetoId}`);
  if (objeto.tipo !== "objeto") return fallo("El despliegue requiere un objeto");
  if (!entidadVisibleEnOpd(opdPadre, objetoId)) {
    return fallo("El despliegue requiere que el objeto tenga apariencia en el OPD activo");
  }

  if (objeto.refinamiento?.tipo === "despliegue") {
    const opdExistente = modelo.opds[objeto.refinamiento.opdId];
    if (!opdExistente) return fallo(`OPD de despliegue no existe: ${objeto.refinamiento.opdId}`);
    return ok({ modelo, opdId: opdExistente.id, creado: false, modo: objeto.refinamiento.modo ?? "agregacion" });
  }
  if (objeto.refinamiento) return fallo("El objeto ya tiene otro refinamiento");

  const opdHijoId = siguienteId(modelo, "opd");
  let nextSeq = modelo.nextSeq + 1;
  const aparienciaHijoId = siguienteId({ ...modelo, nextSeq }, "a");
  nextSeq += 1;
  const aparienciaHijo: Apariencia = {
    id: aparienciaHijoId,
    entidadId: objetoId,
    opdId: opdHijoId,
    x: 150,
    y: 90,
    width: UNFOLD.contornoWidth,
    height: UNFOLD.contornoHeight,
  };
  const partes = partesInicialesDespliegue(modelo, objeto, aparienciaHijo, opdHijoId, nextSeq, modo);
  nextSeq = partes.nextSeq;
  const enlacesDespliegue = enlacesEstructuralesDespliegue(modelo, objetoId, partes.parteIds, opdHijoId, nextSeq, modo);
  nextSeq = enlacesDespliegue.nextSeq;
  const opdHijo: Opd = {
    id: opdHijoId,
    nombre: siguienteNombreOpdHijo(modelo, opdPadreId),
    padreId: opdPadreId,
    apariencias: {
      [aparienciaHijoId]: aparienciaHijo,
      ...partes.apariencias,
    },
    enlaces: enlacesDespliegue.aparienciasEnlace,
  };

  return ok({
    modelo: {
      ...modelo,
      nextSeq,
      entidades: {
        ...modelo.entidades,
        [objetoId]: {
          ...objeto,
          refinamiento: {
            tipo: "despliegue",
            opdId: opdHijoId,
            modo,
          },
        },
        ...partes.entidades,
      },
      enlaces: {
        ...modelo.enlaces,
        ...enlacesDespliegue.enlaces,
      },
      opds: {
        ...modelo.opds,
        [opdHijoId]: opdHijo,
      },
    },
    opdId: opdHijoId,
    creado: true,
    modo,
  });
}

export function quitarDescomposicionProceso(modelo: Modelo, procesoId: Id): Resultado<Modelo> {
  const proceso = modelo.entidades[procesoId];
  if (!proceso) return fallo(`Entidad no existe: ${procesoId}`);
  if (proceso.tipo !== "proceso") return fallo("La descomposición requiere un proceso");
  if (proceso.refinamiento?.tipo !== "descomposicion") return fallo("El proceso no tiene descomposición");

  return quitarRefinamientoEntidad(modelo, procesoId);
}

export function quitarDespliegueObjeto(modelo: Modelo, objetoId: Id): Resultado<Modelo> {
  const objeto = modelo.entidades[objetoId];
  if (!objeto) return fallo(`Entidad no existe: ${objetoId}`);
  if (objeto.tipo !== "objeto") return fallo("El despliegue requiere un objeto");
  if (objeto.refinamiento?.tipo !== "despliegue") return fallo("El objeto no tiene despliegue");

  return quitarRefinamientoEntidad(modelo, objetoId);
}

export function renombrarEntidad(modelo: Modelo, entidadId: Id, nombre: string): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  const limpio = nombre.trim();
  if (limpio.length === 0) return fallo("El nombre no puede estar vacío");
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, nombre: limpio },
    },
  });
}

export function cambiarEsencia(modelo: Modelo, entidadId: Id, esencia: Esencia): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, esencia },
    },
  });
}

export function cambiarAfiliacion(modelo: Modelo, entidadId: Id, afiliacion: Afiliacion): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, afiliacion },
    },
  });
}

export function estadosDeEntidad(modelo: Modelo, entidadId: Id): Estado[] {
  return Object.values(modelo.estados ?? {})
    .filter((estado) => estado.entidadId === entidadId)
    .sort((a, b) => ordenEstado(a) - ordenEstado(b) || a.id.localeCompare(b.id));
}

export function crearEstadosIniciales(modelo: Modelo, entidadId: Id): Resultado<EstadosInicialesObjeto> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (entidad.tipo !== "objeto") return fallo("Los estados sólo aplican a objetos");

  const existentes = estadosDeEntidad(modelo, entidadId);
  if (existentes.length > 0) {
    if (existentes.length === 1) return fallo("Un objeto con estados debe tener al menos dos estados");
    const primero = existentes[0]?.id;
    const segundo = existentes[1]?.id;
    if (!primero || !segundo) return fallo("El objeto tiene estados inválidos");
    return ok({ modelo, estadoIds: [primero, segundo], creado: false });
  }

  const estado1Id = siguienteId(modelo, "s");
  const estado2Id = siguienteId({ ...modelo, nextSeq: modelo.nextSeq + 1 }, "s");
  const estado1: Estado = { id: estado1Id, entidadId, nombre: "estado1" };
  const estado2: Estado = { id: estado2Id, entidadId, nombre: "estado2" };

  return ok({
    modelo: {
      ...modelo,
      nextSeq: modelo.nextSeq + 2,
      estados: {
        ...(modelo.estados ?? {}),
        [estado1Id]: estado1,
        [estado2Id]: estado2,
      },
    },
    estadoIds: [estado1Id, estado2Id],
    creado: true,
  });
}

export function agregarEstado(modelo: Modelo, entidadId: Id, nombre?: string): Resultado<EstadoCreado> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (entidad.tipo !== "objeto") return fallo("Los estados sólo aplican a objetos");
  if (estadosDeEntidad(modelo, entidadId).length < 2) {
    return fallo("Agregar un estado requiere que el objeto ya tenga al menos dos estados");
  }

  const limpio = nombre?.trim() || siguienteNombreEstado(modelo, entidadId);
  const validado = validarNombreEstado(modelo, entidadId, limpio);
  if (!validado.ok) return validado;

  const estadoId = siguienteId(modelo, "s");
  const estado: Estado = { id: estadoId, entidadId, nombre: validado.value };
  return ok({
    modelo: {
      ...modelo,
      nextSeq: modelo.nextSeq + 1,
      estados: {
        ...(modelo.estados ?? {}),
        [estadoId]: estado,
      },
    },
    estadoId,
  });
}

export function renombrarEstado(modelo: Modelo, estadoId: Id, nombre: string): Resultado<Modelo> {
  const estado = modelo.estados?.[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  const validado = validarNombreEstado(modelo, estado.entidadId, nombre, estadoId);
  if (!validado.ok) return validado;
  if (estado.nombre === validado.value) return ok(modelo);

  return ok({
    ...modelo,
    estados: {
      ...(modelo.estados ?? {}),
      [estadoId]: { ...estado, nombre: validado.value },
    },
  });
}

export function eliminarEstado(modelo: Modelo, estadoId: Id): Resultado<Modelo> {
  const estado = modelo.estados?.[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  const estados = estadosDeEntidad(modelo, estado.entidadId);
  if (estados.length <= 2) {
    return fallo("Un objeto con estados debe conservar al menos dos estados; usa quitar estados para eliminar el conjunto completo");
  }

  const siguientes = { ...(modelo.estados ?? {}) };
  delete siguientes[estadoId];
  return ok({ ...modelo, estados: siguientes });
}

export function quitarEstadosObjeto(modelo: Modelo, entidadId: Id): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (entidad.tipo !== "objeto") return fallo("Los estados sólo aplican a objetos");
  const siguientes = Object.fromEntries(
    Object.entries(modelo.estados ?? {}).filter(([, estado]) => estado.entidadId !== entidadId),
  ) as Record<Id, Estado>;
  if (Object.keys(siguientes).length === Object.keys(modelo.estados ?? {}).length) return ok(modelo);
  return ok({ ...modelo, estados: siguientes });
}

export function designarEstadoInicial(modelo: Modelo, estadoId: Id): Resultado<Modelo> {
  return designarEstado(modelo, estadoId, "esInicial");
}

export function designarEstadoFinal(modelo: Modelo, estadoId: Id): Resultado<Modelo> {
  return designarEstado(modelo, estadoId, "esFinal");
}

export function moverApariencia(modelo: Modelo, opdId: Id, entidadId: Id, posicion: Posicion): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = Object.values(opd.apariencias).find((item) => item.entidadId === entidadId);
  if (!apariencia) return fallo(`Apariencia no existe para entidad: ${entidadId}`);

  return moverAparienciaPorId(modelo, opdId, apariencia.id, posicion);
}

export function moverAparienciaPorId(modelo: Modelo, opdId: Id, aparienciaId: Id, posicion: Posicion): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return fallo(`Apariencia no existe: ${aparienciaId}`);
  if (apariencia.x === posicion.x && apariencia.y === posicion.y) return ok(modelo);

  const contorno = contenedorRefinamiento(modelo, opdId);
  const esContorno = contorno !== null && contorno.id === aparienciaId;

  let nuevasApariencias: Record<Id, Apariencia>;
  if (esContorno) {
    // Mover contorno arrastra a las apariencias internas (centro dentro del
    // bbox del contorno: subprocesos, partes refinadoras, objetos internos).
    // Las apariencias proxy de externos (objetos del padre que aparecen en
    // el OPD hijo conectados por enlaces derivados) viven FUERA del bbox
    // del contorno por diseno y deben mantener su posicion absoluta — son
    // anclas visuales del contexto del padre, no contenido del refinamiento
    // (HU-12.008 contenedor envolvente; HU-12.010 externos parciales).
    const dx = posicion.x - apariencia.x;
    const dy = posicion.y - apariencia.y;
    nuevasApariencias = {};
    for (const [id, ap] of Object.entries(opd.apariencias)) {
      if (id === aparienciaId) {
        nuevasApariencias[id] = { ...ap, x: posicion.x, y: posicion.y };
        continue;
      }
      const centerX = ap.x + ap.width / 2;
      const centerY = ap.y + ap.height / 2;
      const dentroDelContorno = centerX >= apariencia.x
        && centerX <= apariencia.x + apariencia.width
        && centerY >= apariencia.y
        && centerY <= apariencia.y + apariencia.height;
      nuevasApariencias[id] = dentroDelContorno
        ? { ...ap, x: ap.x + dx, y: ap.y + dy }
        : ap;
    }
  } else if (contorno) {
    // Apariencia interna: clamp al bbox del contorno (HU-12.020 restriccion
    // interior). Margen 36px en lados; tope superior respeta header del
    // contorno; tope inferior deja 24px de aire.
    const minX = contorno.x + 36;
    const maxX = contorno.x + contorno.width - apariencia.width - 36;
    const minY = contorno.y + 60;
    const maxY = contorno.y + contorno.height - apariencia.height - 24;
    const clampX = Math.max(minX, Math.min(maxX, posicion.x));
    const clampY = Math.max(minY, Math.min(maxY, posicion.y));
    nuevasApariencias = {
      ...opd.apariencias,
      [apariencia.id]: { ...apariencia, x: clampX, y: clampY },
    };
  } else {
    // OPD raiz o sin refinable: comportamiento sin restriccion.
    nuevasApariencias = {
      ...opd.apariencias,
      [apariencia.id]: { ...apariencia, x: posicion.x, y: posicion.y },
    };
  }

  const movido: Modelo = {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: nuevasApariencias,
      },
    },
  };

  return refrescarEnlacesExternosDerivados(movido, opdId);
}

export function actualizarVerticesEnlace(
  modelo: Modelo,
  opdId: Id,
  aparienciaEnlaceId: Id,
  vertices: Posicion[],
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.enlaces[aparienciaEnlaceId];
  if (!apariencia) return fallo(`Apariencia de enlace no existe: ${aparienciaEnlaceId}`);
  const normalizados = vertices.map((vertice) => ({ x: vertice.x, y: vertice.y }));
  if (mismosVertices(apariencia.vertices, normalizados)) return ok(modelo);

  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: {
          ...opd.enlaces,
          [aparienciaEnlaceId]: { ...apariencia, vertices: normalizados },
        },
      },
    },
  });
}

export function validarMultiplicidad(texto: string): boolean {
  return MULTIPLICIDAD_CANONICA_RE.test(texto);
}

export function ajustarMultiplicidad(
  modelo: Modelo,
  enlaceId: Id,
  lado: LadoMultiplicidadEnlace,
  texto: string,
): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  if (texto !== "" && !validarMultiplicidad(texto)) {
    return fallo("Multiplicidad inválida: usa 1, *, 2..N o 1..5");
  }

  const campo = lado === "origen" ? "multiplicidadOrigen" : "multiplicidadDestino";
  if (enlace[campo] === texto || (texto === "" && enlace[campo] === undefined)) return ok(modelo);

  const actualizado: Enlace = { ...enlace };
  if (texto === "") {
    delete actualizado[campo];
  } else {
    actualizado[campo] = texto;
  }

  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlaceId]: actualizado,
    },
  });
}

export function eliminarEntidad(modelo: Modelo, entidadId: Id): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (entidad.refinamiento) {
    const sinRefinamiento = quitarRefinamientoEntidad(modelo, entidadId);
    if (!sinRefinamiento.ok) return sinRefinamiento;
    return eliminarEntidad(sinRefinamiento.value, entidadId);
  }

  const entidades = { ...modelo.entidades };
  delete entidades[entidadId];
  const estados = Object.fromEntries(
    Object.entries(modelo.estados ?? {}).filter(([, estado]) => estado.entidadId !== entidadId),
  ) as Record<Id, Estado>;

  const enlacesEliminados = new Set(
    Object.values(modelo.enlaces)
      .filter((enlace) => enlace.origenId === entidadId || enlace.destinoId === entidadId)
      .map((enlace) => enlace.id),
  );
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).filter(([id]) => !enlacesEliminados.has(id)),
  );

  const opds = Object.fromEntries(
    Object.entries(modelo.opds).map(([opdId, opd]) => [
      opdId,
      {
        ...opd,
        apariencias: Object.fromEntries(
          Object.entries(opd.apariencias).filter(([, apariencia]) => apariencia.entidadId !== entidadId),
        ),
        enlaces: Object.fromEntries(
          Object.entries(opd.enlaces).filter(([, apariencia]) => !enlacesEliminados.has(apariencia.enlaceId)),
        ),
      },
    ]),
  );

  return ok({ ...modelo, entidades, estados, enlaces, opds });
}

export function eliminarEnlace(modelo: Modelo, enlaceId: Id): Resultado<Modelo> {
  if (!modelo.enlaces[enlaceId]) return fallo(`Enlace no existe: ${enlaceId}`);
  const enlacesEliminados = new Set(
    Object.values(modelo.enlaces)
      .filter((enlace) => enlace.id === enlaceId || enlace.derivado?.enlacePadreId === enlaceId)
      .map((enlace) => enlace.id),
  );
  const enlaces = { ...modelo.enlaces };
  for (const id of enlacesEliminados) delete enlaces[id];

  const opds = Object.fromEntries(
    Object.entries(modelo.opds).map(([opdId, opd]) => [
      opdId,
      {
        ...opd,
        enlaces: Object.fromEntries(
          Object.entries(opd.enlaces).filter(([, apariencia]) => !enlacesEliminados.has(apariencia.enlaceId)),
        ),
      },
    ]),
  );

  return ok({ ...modelo, enlaces, opds });
}

export function crearEnlace(
  modelo: Modelo,
  opdId: Id,
  origenId: Id,
  destinoId: Id,
  tipo: TipoEnlace,
  etiqueta = "",
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const origen = modelo.entidades[origenId];
  const destino = modelo.entidades[destinoId];
  if (!origen) return fallo(`Origen no existe: ${origenId}`);
  if (!destino) return fallo(`Destino no existe: ${destinoId}`);
  if (origenId === destinoId) return fallo("El enlace requiere dos entidades distintas en Sprint 0");

  const legal = validarFirmaEnlace(tipo, origen, destino);
  if (!legal.ok) return legal;
  if (!entidadVisibleEnOpd(opd, origenId) || !entidadVisibleEnOpd(opd, destinoId)) {
    return fallo("El enlace requiere que origen y destino tengan apariencia en el OPD");
  }

  const enlaceId = siguienteId(modelo, "e");
  const aparienciaId = siguienteId({ ...modelo, nextSeq: modelo.nextSeq + 1 }, "ae");
  const enlace: Enlace = { id: enlaceId, tipo, origenId, destinoId, etiqueta };
  const apariencia: AparienciaEnlace = { id: aparienciaId, enlaceId, opdId, vertices: [] };

  return ok({
    ...modelo,
    nextSeq: modelo.nextSeq + 2,
    enlaces: { ...modelo.enlaces, [enlaceId]: enlace },
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: { ...opd.enlaces, [aparienciaId]: apariencia },
      },
    },
  });
}

export function entidadesDelOpd(modelo: Modelo, opdId: Id): Entidad[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  return Object.values(opd.apariencias)
    .map((apariencia) => modelo.entidades[apariencia.entidadId])
    .filter((entidad): entidad is Entidad => entidad !== undefined);
}

export function reanclarEnlaceExternoDerivado(
  modelo: Modelo,
  opdId: Id,
  aparienciaEnlaceId: Id,
  nuevoEndpointEntidadId: Id,
): Resultado<Modelo> {
  const validado = validarReanclajeEnlaceExterno(modelo, opdId, aparienciaEnlaceId, nuevoEndpointEntidadId);
  if (!validado.ok) return validado;
  const { enlace, lado } = validado.value;
  const actualizado: Enlace = {
    ...enlace,
    [lado === "origen" ? "origenId" : "destinoId"]: nuevoEndpointEntidadId,
    derivado: {
      ...enlace.derivado!,
      origen: "manual",
    },
  };
  const origen = modelo.entidades[actualizado.origenId];
  const destino = modelo.entidades[actualizado.destinoId];
  if (!origen || !destino) return fallo("Endpoint de reanclaje inválido");
  const firma = validarFirmaEnlace(actualizado.tipo, origen, destino);
  if (!firma.ok) return fallo("El subproceso elegido no admite la firma del enlace derivado");
  if (
    enlace.origenId === actualizado.origenId &&
    enlace.destinoId === actualizado.destinoId &&
    enlace.derivado?.origen === "manual"
  ) {
    return ok(modelo);
  }
  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlace.id]: actualizado,
    },
  });
}

export function volverEnlaceExternoDerivadoAAutomatico(
  modelo: Modelo,
  opdId: Id,
  aparienciaEnlaceId: Id,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.enlaces[aparienciaEnlaceId];
  if (!apariencia) return fallo(`Apariencia de enlace no existe: ${aparienciaEnlaceId}`);
  const enlace = modelo.enlaces[apariencia.enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${apariencia.enlaceId}`);
  if (!enlace.derivado) return fallo("El enlace no es derivado");
  const automatico: Modelo = {
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlace.id]: {
        ...enlace,
        derivado: {
          ...enlace.derivado,
          origen: "automatico",
        },
      },
    },
  };
  return refrescarEnlacesExternosDerivados(automatico, opdId);
}

type LadoEndpointDerivado = "origen" | "destino";

function validarReanclajeEnlaceExterno(
  modelo: Modelo,
  opdId: Id,
  aparienciaEnlaceId: Id,
  nuevoEndpointEntidadId: Id,
): Resultado<{ enlace: Enlace; lado: LadoEndpointDerivado }> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const aparienciaEnlace = opd.enlaces[aparienciaEnlaceId];
  if (!aparienciaEnlace) return fallo(`Apariencia de enlace no existe: ${aparienciaEnlaceId}`);
  const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${aparienciaEnlace.enlaceId}`);
  if (!enlace.derivado) return fallo("El enlace no es derivado");
  if (enlace.derivado.tipo !== "enlace-externo-refinamiento") return fallo("El enlace derivado no es de refinamiento externo");

  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  if (!contorno || contorno.entidad.id !== enlace.derivado.refinamientoId) {
    return fallo("El enlace derivado no pertenece al OPD activo");
  }
  const endpoint = modelo.entidades[nuevoEndpointEntidadId];
  if (!endpoint) return fallo(`Entidad no existe: ${nuevoEndpointEntidadId}`);
  if (endpoint.tipo !== "proceso") return fallo("El endpoint debe ser un subproceso");
  const subproceso = subprocesosOrdenadosDeRefinamiento(modelo, opd, contorno.entidad.id)
    .find((apariencia) => apariencia.entidadId === nuevoEndpointEntidadId);
  if (!subproceso) return fallo("El endpoint debe ser un subproceso visible del refinamiento activo");

  const enlacePadre = modelo.enlaces[enlace.derivado.enlacePadreId];
  if (!enlacePadre) return fallo(`Enlace padre no existe: ${enlace.derivado.enlacePadreId}`);
  const lado = ladoReanclableDerivado(enlace, enlacePadre, contorno.entidad.id);
  if (!lado) return fallo("No se pudo determinar el endpoint reanclable del enlace derivado");
  return ok({ enlace, lado });
}

function ladoReanclableDerivado(enlace: Enlace, enlacePadre: Enlace, refinamientoId: Id): LadoEndpointDerivado | null {
  if (enlace.tipo !== enlacePadre.tipo) return null;
  if (enlacePadre.destinoId === refinamientoId && enlace.origenId === enlacePadre.origenId) return "destino";
  if (enlacePadre.origenId === refinamientoId && enlace.destinoId === enlacePadre.destinoId) return "origen";
  return null;
}

function designarEstado(modelo: Modelo, estadoId: Id, campo: "esInicial" | "esFinal"): Resultado<Modelo> {
  const estado = modelo.estados?.[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  const estados = { ...(modelo.estados ?? {}) };

  for (const actual of estadosDeEntidad(modelo, estado.entidadId)) {
    const actualizado: Estado = { ...actual };
    if (actual.id === estadoId) {
      actualizado[campo] = true;
    } else {
      delete actualizado[campo];
    }
    estados[actual.id] = actualizado;
  }

  return ok({ ...modelo, estados });
}

function validarNombreEstado(modelo: Modelo, entidadId: Id, nombre: string, estadoId?: Id): Resultado<string> {
  const limpio = nombre.trim();
  if (limpio.length === 0) return fallo("El nombre del estado no puede estar vacío");
  const normalizado = normalizarNombreEstado(limpio);
  const duplicado = estadosDeEntidad(modelo, entidadId)
    .some((estado) => estado.id !== estadoId && normalizarNombreEstado(estado.nombre) === normalizado);
  if (duplicado) return fallo("El nombre del estado debe ser único dentro del objeto");
  return ok(limpio);
}

function siguienteNombreEstado(modelo: Modelo, entidadId: Id): string {
  const estados = estadosDeEntidad(modelo, entidadId);
  const indices = estados
    .map((estado) => /^estado(\d+)$/i.exec(estado.nombre.trim())?.[1])
    .filter((valor): valor is string => valor !== undefined)
    .map((valor) => Number.parseInt(valor, 10))
    .filter((valor) => Number.isSafeInteger(valor));
  const maximo = indices.length > 0 ? Math.max(...indices) : estados.length;
  return `estado${maximo + 1}`;
}

function normalizarNombreEstado(nombre: string): string {
  return nombre.trim().toLocaleLowerCase("es");
}

function ordenEstado(estado: Estado): number {
  const secuencia = /-(\d+)$/.exec(estado.id)?.[1];
  return secuencia ? Number.parseInt(secuencia, 10) : Number.MAX_SAFE_INTEGER;
}

function crearEntidad(
  modelo: Modelo,
  opdId: Id,
  tipo: TipoEntidad,
  posicion: Posicion,
  nombre: string,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);

  const entidadId = siguienteId(modelo, tipo === "objeto" ? "o" : "p");
  const aparienciaId = siguienteId({ ...modelo, nextSeq: modelo.nextSeq + 1 }, "a");
  const entidad: Entidad = {
    id: entidadId,
    tipo,
    nombre: nombre.trim() || (tipo === "objeto" ? "Objeto" : "Proceso"),
    esencia: "informacional",
    afiliacion: "sistemica",
  };
  const apariencia: Apariencia = {
    id: aparienciaId,
    entidadId,
    opdId,
    x: posicion.x,
    y: posicion.y,
    width: CANON.dims.cosaWidth,
    height: CANON.dims.cosaHeight,
  };

  const nextOpd: Opd = {
    ...opd,
    apariencias: { ...opd.apariencias, [aparienciaId]: apariencia },
  };

  const base: Modelo = {
    ...modelo,
    nextSeq: modelo.nextSeq + 2,
    entidades: { ...modelo.entidades, [entidadId]: entidad },
    opds: { ...modelo.opds, [opdId]: nextOpd },
  };

  return tipo === "proceso" ? redistribuirEnlacesExternosSiPrimerSubproceso(base, opdId, entidadId) : ok(base);
}

export function validarFirmaEnlace(tipo: TipoEnlace, origen: Entidad, destino: Entidad): Resultado<true> {
  if (tipo === "agregacion") {
    return origen.tipo === "objeto" && destino.tipo === "objeto"
      ? ok(true)
      : fallo("Agregación requiere Objeto -> Objeto en Sprint 0");
  }
  if (tipo === "exhibicion") {
    return ok(true);
  }
  if (tipo === "generalizacion") {
    return origen.tipo === destino.tipo
      ? ok(true)
      : fallo("Generalización requiere entidades de la misma clase OPM");
  }
  if (tipo === "clasificacion") {
    return origen.tipo === destino.tipo
      ? ok(true)
      : fallo("Clasificación requiere entidades de la misma clase OPM");
  }
  if (tipo === "agente") {
    return origen.tipo === "objeto" && destino.tipo === "proceso" && origen.esencia === "fisica"
      ? ok(true)
      : fallo("Agente requiere Objeto físico -> Proceso");
  }
  if (tipo === "instrumento") {
    return origen.tipo === "objeto" && destino.tipo === "proceso"
      ? ok(true)
      : fallo("Instrumento requiere Objeto -> Proceso");
  }
  if (tipo === "consumo") {
    return origen.tipo === "objeto" && destino.tipo === "proceso"
      ? ok(true)
      : fallo("Consumo requiere Objeto -> Proceso");
  }
  if (tipo === "resultado") {
    return origen.tipo === "proceso" && destino.tipo === "objeto"
      ? ok(true)
      : fallo("Resultado requiere Proceso -> Objeto");
  }
  if (tipo === "efecto") {
    return origen.tipo !== destino.tipo && (origen.tipo === "objeto" || destino.tipo === "objeto")
      ? ok(true)
      : fallo("Efecto requiere Objeto <-> Proceso");
  }
  if (tipo === "invocacion") {
    return origen.tipo === "proceso" && destino.tipo === "proceso"
      ? ok(true)
      : fallo("Invocación requiere Proceso -> Proceso");
  }
  return fallo(`Tipo de enlace no soportado: ${tipo satisfies never}`);
}

function quitarRefinamientoEntidad(modelo: Modelo, entidadId: Id): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad?.refinamiento) return fallo("La entidad no tiene refinamiento");
  const removidos = idsSubarbolOpd(modelo, entidad.refinamiento.opdId);
  if (!removidos.has(entidad.refinamiento.opdId)) {
    return fallo(`OPD de refinamiento no existe: ${entidad.refinamiento.opdId}`);
  }

  const opds = Object.fromEntries(
    Object.entries(modelo.opds).filter(([opdId]) => !removidos.has(opdId)),
  );
  const entidadesVisibles = new Set(
    Object.values(opds).flatMap((opd) => Object.values(opd.apariencias).map((apariencia) => apariencia.entidadId)),
  );
  const entidades = Object.fromEntries(
    Object.entries(modelo.entidades)
      .filter(([id]) => entidadesVisibles.has(id))
      .map(([id, item]) => [id, sinRefinamientoRemovido(item, removidos)]),
  ) as Record<Id, Entidad>;
  const estados = Object.fromEntries(
    Object.entries(modelo.estados ?? {}).filter(([, estado]) => entidades[estado.entidadId]),
  ) as Record<Id, Estado>;
  const enlacesVisibles = new Set(
    Object.values(opds).flatMap((opd) => Object.values(opd.enlaces).map((apariencia) => apariencia.enlaceId)),
  );
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).filter(([enlaceId, enlace]) => (
      enlacesVisibles.has(enlaceId) && entidades[enlace.origenId] && entidades[enlace.destinoId]
    )),
  );
  const opdsSinEnlacesHuerfanos = Object.fromEntries(
    Object.entries(opds).map(([opdId, opd]) => [
      opdId,
      {
        ...opd,
        enlaces: Object.fromEntries(
          Object.entries(opd.enlaces).filter(([, apariencia]) => enlaces[apariencia.enlaceId]),
        ),
      },
    ]),
  );

  return ok({ ...modelo, entidades, estados, enlaces, opds: opdsSinEnlacesHuerfanos });
}

function entidadVisibleEnOpd(opd: Opd, entidadId: Id): boolean {
  return Object.values(opd.apariencias).some((apariencia) => apariencia.entidadId === entidadId);
}

function aparienciasExtremosExternos(
  modelo: Modelo,
  opdPadre: Opd,
  procesoId: Id,
  opdHijoId: Id,
  nextSeqInicial: number,
): { apariencias: Record<Id, Apariencia>; nextSeq: number } {
  const externos = enlacesExternosDelProceso(modelo, opdPadre, procesoId);
  const existentes = new Set<Id>([procesoId]);
  const apariencias: Record<Id, Apariencia> = {};
  let nextSeq = nextSeqInicial;
  let entradas = 0;
  let salidas = 0;

  for (const { enlace, externoId, aparienciaPadre } of externos) {
    if (existentes.has(externoId)) continue;
    existentes.add(externoId);
    const id = siguienteId({ ...modelo, nextSeq }, "a");
    nextSeq += 1;
    const entrada = enlace.destinoId === procesoId;
    const fila = entrada ? entradas : salidas;
    if (entrada) entradas += 1;
    else salidas += 1;
    apariencias[id] = {
      ...aparienciaPadre,
      id,
      opdId: opdHijoId,
      x: entrada ? 24 : 610,
      y: 112 + fila * 92,
    };
  }

  return { apariencias, nextSeq };
}

function subprocesosInicialesInzoom(
  modelo: Modelo,
  proceso: Entidad,
  contorno: Apariencia,
  opdHijoId: Id,
  nextSeqInicial: number,
): { entidades: Record<Id, Entidad>; apariencias: Record<Id, Apariencia>; primeroId: Id; ultimoId: Id; nextSeq: number } {
  const entidades: Record<Id, Entidad> = {};
  const apariencias: Record<Id, Apariencia> = {};
  let nextSeq = nextSeqInicial;
  let primeroId = "";
  let ultimoId = "";
  const x = contorno.x + (contorno.width - CANON.dims.cosaWidth) / 2;
  let y = contorno.y + INZOOM.paddingSuperior;

  for (let index = 1; index <= INZOOM.subprocesosIniciales; index += 1) {
    const entidadId = siguienteId({ ...modelo, nextSeq }, "p");
    nextSeq += 1;
    const aparienciaId = siguienteId({ ...modelo, nextSeq }, "a");
    nextSeq += 1;
    if (!primeroId) primeroId = entidadId;
    ultimoId = entidadId;
    entidades[entidadId] = {
      id: entidadId,
      tipo: "proceso",
      nombre: `${proceso.nombre} ${index}`,
      esencia: proceso.esencia,
      afiliacion: proceso.afiliacion,
    };
    apariencias[aparienciaId] = {
      id: aparienciaId,
      entidadId,
      opdId: opdHijoId,
      x,
      y,
      width: CANON.dims.cosaWidth,
      height: CANON.dims.cosaHeight,
    };
    y += CANON.dims.cosaHeight + INZOOM.separacionVertical;
  }

  return { entidades, apariencias, primeroId, ultimoId, nextSeq };
}

function partesInicialesDespliegue(
  modelo: Modelo,
  objeto: Entidad,
  contorno: Apariencia,
  opdHijoId: Id,
  nextSeqInicial: number,
  modo: ModoDespliegueObjeto,
): { entidades: Record<Id, Entidad>; apariencias: Record<Id, Apariencia>; parteIds: Id[]; nextSeq: number } {
  const entidades: Record<Id, Entidad> = {};
  const apariencias: Record<Id, Apariencia> = {};
  const parteIds: Id[] = [];
  let nextSeq = nextSeqInicial;
  const totalWidth = CANON.dims.cosaWidth * UNFOLD.partesIniciales + UNFOLD.separacionHorizontal * (UNFOLD.partesIniciales - 1);
  let x = contorno.x + (contorno.width - totalWidth) / 2;
  const y = contorno.y + UNFOLD.paddingSuperior;

  for (let index = 1; index <= UNFOLD.partesIniciales; index += 1) {
    const entidadId = siguienteId({ ...modelo, nextSeq }, "o");
    nextSeq += 1;
    const aparienciaId = siguienteId({ ...modelo, nextSeq }, "a");
    nextSeq += 1;
    entidades[entidadId] = {
      id: entidadId,
      tipo: "objeto",
      nombre: nombreInicialDespliegue(objeto, modo, index),
      esencia: objeto.esencia,
      afiliacion: objeto.afiliacion,
    };
    parteIds.push(entidadId);
    apariencias[aparienciaId] = {
      id: aparienciaId,
      entidadId,
      opdId: opdHijoId,
      x,
      y,
      width: CANON.dims.cosaWidth,
      height: CANON.dims.cosaHeight,
    };
    x += CANON.dims.cosaWidth + UNFOLD.separacionHorizontal;
  }

  return { entidades, apariencias, parteIds, nextSeq };
}

function nombreInicialDespliegue(objeto: Entidad, modo: ModoDespliegueObjeto, index: number): string {
  if (modo === "agregacion") return `${objeto.nombre} parte ${index}`;
  if (modo === "exhibicion") return `Atributo ${index}`;
  if (modo === "generalizacion") return `Especialización ${index}`;
  return `Instancia ${index}`;
}

function tipoEnlaceDespliegue(modo: ModoDespliegueObjeto): TipoEnlace {
  if (modo === "agregacion") return "agregacion";
  if (modo === "exhibicion") return "exhibicion";
  if (modo === "generalizacion") return "generalizacion";
  return "clasificacion";
}

function enlacesEstructuralesDespliegue(
  modelo: Modelo,
  objetoId: Id,
  parteIds: Id[],
  opdId: Id,
  nextSeqInicial: number,
  modo: ModoDespliegueObjeto,
): { enlaces: Record<Id, Enlace>; aparienciasEnlace: Record<Id, AparienciaEnlace>; nextSeq: number } {
  const enlaces: Record<Id, Enlace> = {};
  const aparienciasEnlace: Record<Id, AparienciaEnlace> = {};
  let nextSeq = nextSeqInicial;
  const tipo = tipoEnlaceDespliegue(modo);

  for (const parteId of parteIds) {
    const enlaceId = siguienteId({ ...modelo, nextSeq }, "e");
    nextSeq += 1;
    const aparienciaId = siguienteId({ ...modelo, nextSeq }, "ae");
    nextSeq += 1;
    enlaces[enlaceId] = {
      id: enlaceId,
      tipo,
      origenId: objetoId,
      destinoId: parteId,
      etiqueta: "",
    };
    aparienciasEnlace[aparienciaId] = { id: aparienciaId, enlaceId, opdId, vertices: [] };
  }

  return { enlaces, aparienciasEnlace, nextSeq };
}

function redistribuirEnlacesExternosSiPrimerSubproceso(modelo: Modelo, opdId: Id, subprocesoId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return ok(modelo);
  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  if (!contorno) return ok(modelo);
  const procesosInternos = subprocesosOrdenadosDeRefinamiento(modelo, opd, contorno.entidad.id);
  if (procesosInternos.length !== 1 || procesosInternos[0]?.entidadId !== subprocesoId) return ok(modelo);

  return proyectarEnlacesExternosEnRefinamiento(modelo, opdId, {
    primeroId: subprocesoId,
    ultimoId: subprocesoId,
  });
}

function refrescarEnlacesExternosDerivados(modelo: Modelo, opdId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return ok(modelo);
  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  if (!contorno) return ok(modelo);
  const subprocesos = subprocesosOrdenadosDeRefinamiento(modelo, opd, contorno.entidad.id);
  const primero = subprocesos[0];
  const ultimo = subprocesos[subprocesos.length - 1];
  if (!primero || !ultimo) return ok(modelo);

  const limpio = limpiarEnlacesDerivadosAutomaticos(modelo, opdId, contorno.entidad.id);
  return proyectarEnlacesExternosEnRefinamiento(limpio, opdId, {
    primeroId: primero.entidadId,
    ultimoId: ultimo.entidadId,
  });
}

function proyectarEnlacesExternosEnRefinamiento(
  modelo: Modelo,
  opdId: Id,
  subprocesos: { primeroId: Id; ultimoId: Id },
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return ok(modelo);
  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  if (!contorno) return ok(modelo);
  const padre = modelo.opds[opd.padreId];
  if (!padre) return ok(modelo);
  const externos = enlacesExternosDelProceso(modelo, padre, contorno.entidad.id)
    .filter(({ externoId }) => entidadVisibleEnOpd(opd, externoId));
  if (externos.length === 0) return ok(modelo);
  let nextSeq = modelo.nextSeq;
  const enlaces = { ...modelo.enlaces };
  const aparienciasEnlace: Record<Id, AparienciaEnlace> = { ...opd.enlaces };

  for (const { enlace } of externos) {
    if (enlaceDerivadoManualExisteParaPadre(enlaces, aparienciasEnlace, enlace.id, contorno.entidad.id)) {
      continue;
    }
    const proyeccion = proyeccionEnlaceExterno(enlace, contorno.entidad.id, subprocesos);
    if (proyeccion.tipo === "contorno") {
      if (!aparienciaEnlaceExiste(aparienciasEnlace, enlace.id)) {
        const aparienciaId = siguienteId({ ...modelo, nextSeq }, "ae");
        nextSeq += 1;
        aparienciasEnlace[aparienciaId] = { id: aparienciaId, enlaceId: enlace.id, opdId, vertices: [] };
      }
    } else {
      const origen = modelo.entidades[proyeccion.origenId];
      const destino = modelo.entidades[proyeccion.destinoId];
      if (!origen || !destino) continue;
      const firma = validarFirmaEnlace(enlace.tipo, origen, destino);
      if (!firma.ok) continue;
      if (enlaceDerivadoExiste(enlaces, aparienciasEnlace, enlace.tipo, proyeccion.origenId, proyeccion.destinoId)) {
        continue;
      }
      const enlaceId = siguienteId({ ...modelo, nextSeq }, "e");
      nextSeq += 1;
      const aparienciaId = siguienteId({ ...modelo, nextSeq }, "ae");
      nextSeq += 1;
      enlaces[enlaceId] = {
        id: enlaceId,
        tipo: enlace.tipo,
        origenId: proyeccion.origenId,
        destinoId: proyeccion.destinoId,
        etiqueta: enlace.etiqueta,
        derivado: {
          tipo: "enlace-externo-refinamiento",
          refinamientoId: contorno.entidad.id,
          enlacePadreId: enlace.id,
          origen: "automatico",
        },
      };
      aparienciasEnlace[aparienciaId] = {
        id: aparienciaId,
        enlaceId,
        opdId,
        vertices: [],
      };
    }
  }

  if (nextSeq === modelo.nextSeq) return ok(modelo);
  return ok({
    ...modelo,
    nextSeq,
    enlaces,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: aparienciasEnlace,
      },
    },
  });
}

function proyeccionEnlaceExterno(
  enlace: Enlace,
  procesoRefinadoId: Id,
  subprocesos: { primeroId: Id; ultimoId: Id },
): { tipo: "derivado"; origenId: Id; destinoId: Id } | { tipo: "contorno" } {
  if (enlace.tipo === "consumo" && enlace.destinoId === procesoRefinadoId) {
    return { tipo: "derivado", origenId: enlace.origenId, destinoId: subprocesos.primeroId };
  }
  if ((enlace.tipo === "resultado" || enlace.tipo === "invocacion") && enlace.origenId === procesoRefinadoId) {
    return { tipo: "derivado", origenId: subprocesos.ultimoId, destinoId: enlace.destinoId };
  }
  return { tipo: "contorno" };
}

function aparienciaEnlaceExiste(apariencias: Record<Id, AparienciaEnlace>, enlaceId: Id): boolean {
  return Object.values(apariencias).some((apariencia) => apariencia.enlaceId === enlaceId);
}

function enlaceDerivadoExiste(
  enlaces: Record<Id, Enlace>,
  apariencias: Record<Id, AparienciaEnlace>,
  tipo: TipoEnlace,
  origenId: Id,
  destinoId: Id,
): boolean {
  return Object.values(enlaces).some((existente) => (
    existente.tipo === tipo &&
    existente.origenId === origenId &&
    existente.destinoId === destinoId &&
    aparienciaEnlaceExiste(apariencias, existente.id)
  ));
}

function enlaceDerivadoManualExisteParaPadre(
  enlaces: Record<Id, Enlace>,
  apariencias: Record<Id, AparienciaEnlace>,
  enlacePadreId: Id,
  refinamientoId: Id,
): boolean {
  return Object.values(enlaces).some((existente) => (
    existente.derivado?.tipo === "enlace-externo-refinamiento" &&
    existente.derivado.refinamientoId === refinamientoId &&
    existente.derivado.enlacePadreId === enlacePadreId &&
    existente.derivado.origen === "manual" &&
    aparienciaEnlaceExiste(apariencias, existente.id)
  ));
}

function limpiarEnlacesDerivadosAutomaticos(modelo: Modelo, opdId: Id, procesoRefinadoId: Id): Modelo {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return modelo;
  const candidatos = new Set(
    Object.values(modelo.enlaces)
      .filter((enlace) => enlace.derivado?.tipo === "enlace-externo-refinamiento")
      .filter((enlace) => enlace.derivado?.refinamientoId === procesoRefinadoId)
      .filter((enlace) => enlace.derivado?.origen !== "manual")
      .map((enlace) => enlace.id),
  );
  if (candidatos.size === 0) return modelo;

  const enlacesOpd = Object.fromEntries(
    Object.entries(opd.enlaces).filter(([, apariencia]) => !candidatos.has(apariencia.enlaceId)),
  );
  const idsAunVisibles = new Set(
    Object.values(modelo.opds)
      .flatMap((item) => Object.values(item.id === opdId ? enlacesOpd : item.enlaces))
      .map((apariencia) => apariencia.enlaceId),
  );
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).filter(([enlaceId]) => !candidatos.has(enlaceId) || idsAunVisibles.has(enlaceId)),
  );

  return {
    ...modelo,
    enlaces,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: enlacesOpd,
      },
    },
  };
}

function subprocesosOrdenadosDeRefinamiento(modelo: Modelo, opd: Opd, procesoRefinadoId: Id): Apariencia[] {
  const contorno = Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === procesoRefinadoId);
  if (!contorno) return [];
  return Object.values(opd.apariencias)
    .filter((apariencia) => apariencia.entidadId !== procesoRefinadoId)
    .filter((apariencia) => modelo.entidades[apariencia.entidadId]?.tipo === "proceso")
    .filter((apariencia) => dentroDe(apariencia, contorno))
    .sort((a, b) => compararOrdenTemporal(a, b));
}

function dentroDe(apariencia: Apariencia, contorno: Apariencia): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

function compararOrdenTemporal(a: Apariencia, b: Apariencia): number {
  return a.y - b.y || a.x - b.x || a.id.localeCompare(b.id);
}

function procesoDescompuestoEnOpd(modelo: Modelo, opd: Opd): { entidad: Entidad; apariencia: Apariencia } | null {
  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (entidad?.tipo === "proceso" && entidad.refinamiento?.tipo === "descomposicion" && entidad.refinamiento.opdId === opd.id) {
      return { entidad, apariencia };
    }
  }
  return null;
}

function enlacesExternosDelProceso(
  modelo: Modelo,
  opdPadre: Opd,
  procesoId: Id,
): Array<{ enlace: Enlace; externoId: Id; aparienciaPadre: Apariencia }> {
  const aparienciasPadre = new Map(Object.values(opdPadre.apariencias).map((apariencia) => [apariencia.entidadId, apariencia]));
  const externos: Array<{ enlace: Enlace; externoId: Id; aparienciaPadre: Apariencia }> = [];
  for (const aparienciaEnlace of Object.values(opdPadre.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    const externoId = enlace.origenId === procesoId ? enlace.destinoId : enlace.destinoId === procesoId ? enlace.origenId : null;
    if (!externoId) continue;
    const aparienciaPadre = aparienciasPadre.get(externoId);
    if (!aparienciaPadre) continue;
    externos.push({ enlace, externoId, aparienciaPadre });
  }
  return externos;
}

function siguienteNombreOpdHijo(modelo: Modelo, opdPadreId: Id): string {
  const opdPadre = modelo.opds[opdPadreId];
  const codigoPadre = codigoOpd(opdPadre?.nombre ?? "SD");
  const usados = new Set(
    Object.values(modelo.opds)
      .filter((opd) => opd.padreId === opdPadreId)
      .map((opd) => codigoOpd(opd.nombre)),
  );

  for (let index = 1; index < Number.MAX_SAFE_INTEGER; index += 1) {
    const candidato = codigoPadre === "SD" ? `SD${index}` : `${codigoPadre}.${index}`;
    if (!usados.has(candidato)) return candidato;
  }
  return codigoPadre === "SD" ? "SD1" : `${codigoPadre}.1`;
}

function codigoOpd(nombre: string): string {
  return /^SD(?:\d+(?:\.\d+)*)?/.exec(nombre.trim())?.[0] ?? nombre;
}

function idsSubarbolOpd(modelo: Modelo, raizId: Id): Set<Id> {
  const removidos = new Set<Id>();
  const pendientes = [raizId];
  while (pendientes.length > 0) {
    const actual = pendientes.pop();
    if (!actual || removidos.has(actual) || !modelo.opds[actual]) continue;
    removidos.add(actual);
    for (const opd of Object.values(modelo.opds)) {
      if (opd.padreId === actual) pendientes.push(opd.id);
    }
  }
  return removidos;
}

function sinRefinamientoRemovido(entidad: Entidad, removidos: Set<Id>): Entidad {
  if (!entidad.refinamiento || !removidos.has(entidad.refinamiento.opdId)) return entidad;
  const { refinamiento: _refinamiento, ...sinRefinamiento } = entidad;
  return sinRefinamiento;
}

function mismosVertices(a: Posicion[], b: Posicion[]): boolean {
  return a.length === b.length && a.every((vertice, index) => vertice.x === b[index]?.x && vertice.y === b[index]?.y);
}

function siguienteId(modelo: Modelo, prefijo: string): Id {
  return `${prefijo}-${modelo.nextSeq}`;
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
