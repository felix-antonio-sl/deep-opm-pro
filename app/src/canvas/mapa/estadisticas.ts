import type { Modelo } from "../../modelo/tipos";
import { construirDescriptorMapa } from "./descriptor";
import type { EstadisticasModelo } from "./tipos";

/**
 * Cálculo de estadísticas agregadas del modelo: totales por tipo, profundidad
 * máxima, ramas finales, agrupación por familia de enlace.
 *
 * HU-21.* mapa panel estadísticas.
 */
export function calcularEstadisticas(modelo: Modelo): EstadisticasModelo {
  const descriptor = construirDescriptorMapa(modelo);
  const totalEntidades = Object.keys(modelo.entidades).length;
  const totalEnlaces = Object.keys(modelo.enlaces).length;
  const opdsConHijos = new Set(descriptor.aristas.map((arista) => arista.desdeOpdId));
  const procesos = Object.values(modelo.entidades).filter((entidad) => entidad.tipo === "proceso").length;
  const objetos = Object.values(modelo.entidades).filter((entidad) => entidad.tipo === "objeto").length;
  const enlaces = Object.values(modelo.enlaces);

  return {
    totalEntidades,
    totalEnlaces,
    totalOpds: descriptor.nodos.length,
    profundidadMaxima: descriptor.nodos.reduce((max, nodo) => Math.max(max, nodo.profundidad), 0),
    totalRamas: descriptor.nodos.filter((nodo) => !opdsConHijos.has(nodo.opdId)).length,
    porTipoCosa: {
      proceso: procesos,
      objeto: objetos,
      estados: Object.keys(modelo.estados).length,
    },
    porFamiliaEnlace: {
      agregacion: enlaces.filter((enlace) =>
        enlace.tipo === "agregacion" ||
        enlace.tipo === "exhibicion" ||
        enlace.tipo === "generalizacion" ||
        enlace.tipo === "clasificacion"
      ).length,
      etiquetado: enlaces.filter((enlace) =>
        enlace.tipo === "etiquetado" ||
        enlace.tipo === "etiquetadoBidireccional"
      ).length,
      procedural: enlaces.filter((enlace) =>
        enlace.tipo === "agente" ||
        enlace.tipo === "instrumento" ||
        enlace.tipo === "consumo" ||
        enlace.tipo === "resultado" ||
        enlace.tipo === "efecto" ||
        enlace.tipo === "invocacion"
      ).length,
      logico: Object.keys(modelo.abanicos ?? {}).length,
    },
  };
}
