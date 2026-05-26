import { estadosDeEntidad } from "../../modelo/operaciones";
import type { Id } from "../../modelo/tipos";
import { store, useOpmStore } from "../../store";
import type {
  EntityInspectorMetadataPort,
  EntityInspectorRefinementPort,
  EntityInspectorSemanticsPort,
  EntityInspectorShellPort,
  EntityInspectorStylePort,
  EstadoRenombrable,
  ObjectStatesInspectorPort,
} from "./entityInspectorPorts";

export function useZustandEntityInspectorShellPort(): EntityInspectorShellPort {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const navegarAEnlace = useOpmStore((s) => s.navegarAEnlaceDesdeTabla);

  return {
    modelo,
    opdActivoId,
    seleccionados,
    cambiarOpdActivo,
    navegarAEnlace,
  };
}

export function useZustandEntityInspectorSemanticsPort(): EntityInspectorSemanticsPort {
  const renombrar = useOpmStore((s) => s.renombrarSeleccionada);
  const fijarEsencia = useOpmStore((s) => s.fijarEsenciaSeleccionada);
  const fijarAfiliacion = useOpmStore((s) => s.fijarAfiliacionSeleccionada);
  const editarAliasEntidad = useOpmStore((s) => s.editarAliasEntidad);
  const editarUnidadEntidad = useOpmStore((s) => s.editarUnidadEntidad);
  const editarDescripcionEntidad = useOpmStore((s) => s.editarDescripcionEntidad);
  const asignarValorAtributo = useOpmStore((s) => s.asignarValorAtributoSeleccionado);
  const cambiarTipoValorAtributo = useOpmStore((s) => s.cambiarTipoValorAtributoSeleccionado);
  const configurarSimulacionAtributo = useOpmStore((s) => s.configurarSimulacionAtributoSeleccionado);

  return {
    renombrar,
    fijarEsencia,
    fijarAfiliacion,
    editarAliasEntidad,
    editarUnidadEntidad,
    editarDescripcionEntidad,
    asignarValorAtributo,
    cambiarTipoValorAtributo,
    configurarSimulacionAtributo,
  };
}

export function useZustandEntityInspectorMetadataPort(): EntityInspectorMetadataPort {
  const abrirModalUrls = useOpmStore((s) => s.abrirModalUrls);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);
  const quitarImagenEntidad = useOpmStore((s) => s.quitarImagenEntidad);

  return {
    abrirModalUrls,
    abrirModalImagen,
    quitarImagenEntidad,
  };
}

export function useZustandEntityInspectorStylePort(): EntityInspectorStylePort {
  const aplicarEstilo = useOpmStore((s) => s.aplicarEstiloSeleccionado);
  const resetearEstilo = useOpmStore((s) => s.resetearEstiloSeleccionado);
  const aplicarEstiloTexto = useOpmStore((s) => s.aplicarEstiloTextoAccion);
  const resetearEstiloTexto = useOpmStore((s) => s.resetEstiloTextoAccion);
  const redimensionarSeleccionada = useOpmStore((s) => s.redimensionarSeleccionada);
  const ajustarSeleccionadaAlTexto = useOpmStore((s) => s.ajustarSeleccionadaAlTexto);
  const volverSeleccionadaAAuto = useOpmStore((s) => s.volverSeleccionadaAAuto);
  const alternarModoTamanoSeleccionado = useOpmStore((s) => s.alternarModoTamanoSeleccionado);
  const aplicarEstiloASeleccion = useOpmStore((s) => s.aplicarEstiloASeleccion);

  return {
    aplicarEstilo,
    resetearEstilo,
    aplicarEstiloTexto,
    resetearEstiloTexto,
    redimensionarSeleccionada,
    ajustarSeleccionadaAlTexto,
    volverSeleccionadaAAuto,
    alternarModoTamanoSeleccionado,
    aplicarEstiloASeleccion,
  };
}

export function useZustandEntityInspectorRefinementPort(): EntityInspectorRefinementPort {
  const reasignarEnlaceExternoManual = useOpmStore((s) => s.reasignarEnlaceExternoManual);
  const crearAutoInvocacion = useOpmStore((s) => s.crearAutoInvocacionSeleccionada);
  const cambiarModoPlegado = useOpmStore((s) => s.cambiarModoPlegadoSeleccionado);
  const cambiarOrdenPartes = useOpmStore((s) => s.cambiarOrdenPartesSeleccionado);
  const extraerParte = useOpmStore((s) => s.extraerParteDePlegado);
  const extraerTodasLasPartes = useOpmStore((s) => s.extraerTodasLasPartesSeleccionadas);
  const reinsertarParte = useOpmStore((s) => s.reinsertarParteExtraidaSeleccionada);
  const quitarSemiplegadoEstructural = useOpmStore((s) => s.quitarSemiplegadoEstructuralSeleccionado);
  const quitarPlegadoCompletoEstructural = useOpmStore((s) => s.quitarPlegadoCompletoEstructuralSeleccionado);
  const traerAgregacionesInzoom = useOpmStore((s) => s.traerAgregacionesInzoomFaltantesSeleccionadas);

  return {
    reasignarEnlaceExternoManual,
    crearAutoInvocacion,
    cambiarModoPlegado,
    cambiarOrdenPartes,
    extraerParte,
    extraerTodasLasPartes,
    reinsertarParte,
    quitarSemiplegadoEstructural,
    quitarPlegadoCompletoEstructural,
    traerAgregacionesInzoom,
  };
}

export function useZustandObjectStatesInspectorPort(entidadId: Id): ObjectStatesInspectorPort {
  const agregarEstados = useOpmStore((s) => s.agregarEstadosObjeto);
  const agregarEstado = useOpmStore((s) => s.agregarEstadoObjeto);
  const eliminarEstado = useOpmStore((s) => s.eliminarEstado);
  const quitarEstados = useOpmStore((s) => s.quitarEstadosObjetoSeleccionado);
  const renombrarEstado = useOpmStore((s) => s.renombrarEstadoSeleccionado);
  const designarEstadoComo = useOpmStore((s) => s.designarEstadoComo);
  const quitarDesignacion = useOpmStore((s) => s.quitarDesignacionEstado);
  const suprimirEstadoPorId = useOpmStore((s) => s.suprimirEstadoPorId);
  const restaurarEstadoPorId = useOpmStore((s) => s.restaurarEstadoPorId);
  const abrirModalDuracion = useOpmStore((s) => s.abrirModalDuracion);
  const fijarLayoutEstadosEntidad = useOpmStore((s) => s.fijarLayoutEstadosEntidad);

  const crearEstadosConNombres = (nombres: string[]) => {
    if (nombres.length === 2) {
      agregarEstados();
      const creados = estadosDeEntidad(store.getState().modelo, entidadId).slice(0, 2);
      renombrarEstadosCreados(creados, nombres, renombrarEstado);
      return;
    }
    if (nombres.length === 1) {
      const previos = new Set(estadosDeEntidad(store.getState().modelo, entidadId).map((estado) => estado.id));
      agregarEstado();
      const creado = estadosDeEntidad(store.getState().modelo, entidadId).find((estado) => !previos.has(estado.id));
      if (creado) renombrarEstadosCreados([creado], nombres, renombrarEstado);
    }
  };

  return {
    eliminarEstado,
    quitarEstados,
    renombrarEstado,
    designarEstadoComo,
    quitarDesignacion,
    suprimirEstadoPorId,
    restaurarEstadoPorId,
    abrirModalDuracion,
    fijarLayoutEstadosEntidad,
    crearEstadosConNombres,
  };
}

function renombrarEstadosCreados(
  estados: readonly EstadoRenombrable[],
  nombres: readonly string[],
  renombrarEstado: (estadoId: Id, nombre: string) => void,
): void {
  const deseados = new Map(estados.map((estado, index) => [estado.id, nombres[index] ?? estado.nombre]));
  const nombresDeseados = new Set(Array.from(deseados.values()).map((nombre) => nombre.trim().toLocaleLowerCase("es")));
  estados.forEach((estado, index) => {
    const deseadoPropio = deseados.get(estado.id)?.trim().toLocaleLowerCase("es");
    const nombreActual = estado.nombre.trim().toLocaleLowerCase("es");
    if (deseadoPropio !== nombreActual && nombresDeseados.has(nombreActual)) {
      renombrarEstado(estado.id, `estado-temporal-${index + 1}`);
    }
  });
  estados.forEach((estado, index) => {
    const nombre = nombres[index];
    if (nombre) renombrarEstado(estado.id, nombre);
  });
}
