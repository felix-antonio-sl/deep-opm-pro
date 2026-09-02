import type { FamiliaEfectosPreestado, Id, Modelo } from "../../modelo/tipos";
import { CODEX } from "./constantes.codex";
import type { JointCellJson } from "./proyeccionTipos";

const ANCHO = 760;
const ALTO = 112;

export function proyectarOverlaysFamiliasPreestado(modelo: Modelo, opdId: Id): JointCellJson[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const enlacesVisibles = new Set(Object.values(opd.enlaces).map((apariencia) => apariencia.enlaceId));
  return Object.values(modelo.familiasEfectosPreestado ?? {})
    .filter((familia) => familia.opdId === opdId || familia.enlaceIds.every((id) => enlacesVisibles.has(id)))
    .flatMap((familia) => {
      const procesoApariencia = Object.values(opd.apariencias).find(
        (apariencia) => apariencia.entidadId === familia.procesoId,
      );
      const texto = textoFamilia(modelo, familia);
      if (!procesoApariencia || !texto) return [];
      const apariencias = Object.values(opd.apariencias);
      const minX = Math.min(...apariencias.map((apariencia) => apariencia.x));
      const maxX = Math.max(...apariencias.map((apariencia) => apariencia.x + apariencia.width));
      const maxY = Math.max(...apariencias.map((apariencia) => apariencia.y + apariencia.height));
      const centroX = (minX + maxX) / 2;
      return [{
        id: `overlay-familia-preestado-${opdId}-${familia.id}`,
        type: "standard.Rectangle",
        position: {
          x: Math.max(12, Math.round(centroX - ANCHO / 2)),
          y: Math.round(maxY + 56),
        },
        size: { width: ANCHO, height: ALTO },
        attrs: {
          body: {
            fill: CODEX.colores.paperWarm,
            fillOpacity: 0.96,
            stroke: CODEX.colores.inkFaint,
            strokeWidth: 1,
            rx: 5,
            ry: 5,
            pointerEvents: "none",
          },
          label: {
            text: texto,
            fill: CODEX.colores.inkMid,
            fontFamily: CODEX.fuentes.mono,
            fontSize: 10.5,
            fontWeight: 500,
            lineHeight: "1.35em",
            textAnchor: "middle",
            textVerticalAnchor: "middle",
            textWrap: { width: -18, height: -12, ellipsis: false },
            pointerEvents: "none",
          },
        },
        opm: {
          kind: "overlay-familia-preestado",
          opdId,
          familiaId: familia.id,
          enlaceIds: [...familia.enlaceIds],
          cobertura: familia.cobertura,
        },
        z: 24,
      } satisfies JointCellJson];
    });
}

function textoFamilia(modelo: Modelo, familia: FamiliaEfectosPreestado): string | null {
  const triples = familia.enlaceIds.map((enlaceId) => {
    const enlace = modelo.enlaces[enlaceId];
    const entrada = enlace?.estadoEntradaId ? modelo.estados[enlace.estadoEntradaId] : undefined;
    const salida = enlace?.estadoSalidaId ? modelo.estados[enlace.estadoSalidaId] : undefined;
    const ruta = enlace?.rutaEtiqueta?.trim();
    return entrada && salida && ruta ? `${entrada.nombre} → ${ruta} → ${salida.nombre}` : null;
  });
  if (triples.some((triple) => triple === null)) return null;
  return [
    `EXTENSIÓN DECLARADA · ${familia.id} · partición ${familia.cobertura} por preestado`,
    triples.join(" · "),
    "exactamente 1 miembro aplica para el preestado real",
  ].join("\n");
}
