import { CANON } from "../../../modelo/constantes";
import { rolAparienciaEnRefinamiento } from "../../../modelo/contextoRefinamiento";
import { ANCLAS_RELOJ_ENLACE, puertoRelativoAnclaEnlace, type AnclaRelojEnlace } from "../../../modelo/anclajesEnlace";
import { esAfiliacionEfectivaAmbiental } from "../../../modelo/afiliacionEfectiva";
import { estereotipoDe } from "../../../modelo/estereotipos";
import { designacionesEstado } from "../../../modelo/estadosDesignaciones";
import { nombreCanonicoEntidad, nombreCanonicoEstado } from "../../../modelo/nombresCanonicos";
import { notasDeTarget } from "../../../modelo/notasMesa";
import { formatearNombreCompuesto } from "../../../modelo/objetoMetadata";
import { estadosDeEntidad, relacionesEstructuralesOcultas } from "../../../modelo/operaciones";
import { modoPlegadoApariencia, partesDePlegado } from "../../../modelo/plegado";
import { obtenerRefinamiento, tieneRefinamiento } from "../../../modelo/refinamientos";
import { estadoVisibleEnAparicion } from "../../../modelo/visibilidadEstados";
import type { Apariencia, Entidad, Estado, Id, Modelo } from "../../../modelo/tipos";
import { selectorAnchorEstado, targetsEstado } from "../estadoTargets";
import { filasPlegadoConNesting } from "../plegadoNesting";
import type { FilaPlegadoParcialExtendida } from "../plegadoNesting";
import type { JointCellJson, OpcionesProyeccion, RolApariencia } from "../proyeccionTipos";
import { CODEX, colorEntidadCodex } from "../constantes.codex";
import { colorTextoParaFill } from "./colores";
import { dimensionesConEstados, ESTADOS, rectCapsulaEstadoLocal } from "./estados";
import { puntoHandleEstado } from "../handlers/estadoGeometry";
import { attrsPlegadoParcial, dimensionesPlegadoParcial, markupPlegadoParcial, selectoresPartesPlegadas, textoFilaPlegado, PLEGADO } from "./plegado";

/**
 * Composer de cosas OPM (objetos/procesos): markup, attrs, metadatos,
 * estados embebidos y plegado parcial. Consumidor: proyeccion.ts.
 */
export function proyectarEntidad(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  entidad: Entidad,
  seleccionada: boolean,
  resaltada: boolean,
  opciones: OpcionesProyeccion,
  // SEL-1 (Codex rev2 §5.1): underline crimson embebido en la celda de la
  // entidad cuando es la selección única. Embebido (no celda-halo aparte) para
  // no inflar el conteo de `.joint-element`.
  seleccionUnica = false,
  estadosSeleccionados: readonly Estado[] = [],
): JointCellJson {
  const stroke = colorEntidadCodex(entidad.tipo);
  // D6.3 / R-VIS-STEREO-1: una cosa con `estereotipoId` aplicado DEBE rotularse en
  // el canvas con su estereotipo en doble ángulo `<<Nombre>>` (evidencia OpCloud
  // R-4604). META: NO emite OPL nuclear (el estereotipo se excluye del conteo
  // desde D6.1). Defensivo: si el id no resuelve (catálogo ausente), no se
  // renderiza badge.
  const estereotipoNombre = entidad.estereotipoId
    ? estereotipoDe(modelo, entidad.estereotipoId)?.nombre
    : undefined;
  const mostrarEstereotipo = estereotipoNombre !== undefined;
  const fillBase = "transparent";
  const fill = resaltada ? CODEX.colores.paperWarm : fillBase;
  const partes = partesDePlegado(modelo, entidad.id);
  const tienePartes = partes.length > 0;
  const modoPlegado = modoPlegadoApariencia(apariencia);
  const modoParcial = modoPlegado === "parcial" && tienePartes;
  const estructuralesOcultas = modoPlegado === "parcial" || modoPlegado === "plegado"
    ? relacionesEstructuralesOcultas(modelo, opdId, entidad.id).faltantes
    : 0;
  const filasParciales = modoParcial ? filasPlegadoConNesting({ modelo, opdId, padreAparienciaId: apariencia.id }) : [];
  const estadosTotales = entidad.tipo === "objeto" && !modoParcial ? estadosDeEntidad(modelo, entidad.id) : [];
  // Predicado efectivo (SELLO 2, `modelo/visibilidadEstados.ts`): un estado es
  // visible en ESTA aparición si no está global-suprimido NI local-suprimido
  // (per-OPD via `apariencia.estadosSuprimidos`). Global domina, local refina.
  const estadosVisibles = estadosTotales.filter((estado) => estadoVisibleEnAparicion(estado, apariencia));
  // SSOT §1.8 / V-192: cuando un objeto tiene estados ocultos no
  // visibles en el OPD activo (por supresión global O local), el canon
  // canonico exige un indicador textual `...` en esquina inferior derecha
  // como gramatica auxiliar de "hay mas, no se muestra todo". Implementado
  // abajo via metadatos.suppressedBadge para reusar la infraestructura de
  // badges. El badge senala supresion por CUALQUIER causa en esta vista.
  const estadosOcultosCount = estadosTotales.length - estadosVisibles.length;
  const tieneEstadosSuprimidos = estadosOcultosCount > 0;
  const notasMesaCount = notasDeTarget(modelo, { tipo: "entidad", id: entidad.id }).length;
  const nombreRender = formatearNombreCompuesto(
    {
      nombre: nombreCanonicoEntidad(entidad),
      ...(entidad.unidad ? { unidad: entidad.unidad } : {}),
      ...(entidad.alias ? { alias: entidad.alias } : {}),
    },
    { aliasVisible: opciones.aliasVisibles !== false },
  );
  const refinada = tieneRefinamiento(entidad);
  // BUG-372334: distinguir descomposicion (inzoom: partes EMBEBIDAS dentro del
  // contorno) vs despliegue (unfold: partes FUERA, conectadas via enlaces
  // estructurales canonicos). Solo descomposicion entra en modo contorno
  // (stroke grueso, label-top, z=0, embedding via embedirContorno). Despliegue
  // renderiza el padre como entidad normal en el OPD hijo; los enlaces
  // estructurales (proyectarRefinamientoEstructural) ya manejan la conexion.
  // Ronda 15.2: la entidad puede tener ambos refinamientos. El contorno
  // aplica solo cuando el OPD activo es el de descomposicion del slot.
  const contornoRefinamiento = obtenerRefinamiento(entidad, "descomposicion")?.opdId === opdId;
  const size = dimensionesEntidadRenderizada(modelo, opdId, apariencia, entidad, opciones);
  const strokeBase = refinada ? 4 : CODEX.strokes.entidad;
  const strokeWidth = strokeBase;
  const strokeColor = stroke;
  // V-6 / R-OPD-STR-13: la afiliación se hereda por la cadena de exhibición —
  // un atributo/operación de cosa ambiental se renderiza discontinuo aunque su
  // campo `afiliacion` directo sea sistémico (hecho derivado; el kernel no muta).
  const dasharrayBase = esAfiliacionEfectivaAmbiental(modelo, entidad.id) ? "8 4" : undefined;
  // BUG-a8c184 / R-CTRN-1 (V-71): el tipo de contorno (sólido vs discontinuo)
  // codifica EXCLUSIVAMENTE la afiliación (sistémica=sólido, ambiental=discontinuo)
  // y DEBE persistir a través de niveles. El refinamiento se marca con stroke
  // GRUESO (strokeBase=4), no con discontinuidad. Antes el contorno de
  // descomposición forzaba `strokeDasharray` a todo proceso refinado, volviendo
  // discontinuo un proceso sistémico — violación de R-CTRN-1. La discontinuidad
  // del contorno de refinamiento solo aplica si la cosa es ambiental.
  const dasharray = dasharrayBase;
  const fillRender = contornoRefinamiento ? CODEX.refinamiento.fill : fill;
  const bodyTag = entidad.tipo === "objeto" ? "rect" : "ellipse";
  const body = {
    fill: fillRender,
    stroke: strokeColor,
    strokeWidth,
    // Atributos opcionales: solo presentes cuando aplican; pasar undefined a JointJS
    // serializa el string literal "undefined" en el SVG.
    ...(dasharray ? { strokeDasharray: dasharray } : {}),
    // SSOT V-124/V-127, JOYAS §8: la sombra de esencia "fisica" es un canal
    // semantico OPM (no decoracion UI). Usamos el filtro `dropShadow` de
    // JointJS que se serializa a `<feDropShadow>` SVG nativo en `<defs>`, en
    // vez del shorthand CSS `filter: "drop-shadow(...)"`. Esto preserva la
    // sombra como propiedad recuperable del canon-diagrama y evita colision
    // perceptual con filtros CSS UI (ver halo de modo enlace, N11).
    // BUG-6ae261: `blur:0` + `color:grey` opaco producía un duplicado duro del
    // contorno (efecto "doble línea"), no una sombra. La fisicidad debe leerse
    // de un vistazo: offset abajo-derecha marcado, blur breve y tinta ink
    // semi-transparente.
    ...(entidad.esencia === "fisica" ? { filter: { name: "dropShadow", args: { dx: 6, dy: 6, blur: 2, color: "rgba(23, 21, 17, 0.68)" } } } : {}),
    cursor: "pointer",
  };
  const attrsBase = {
    body: entidad.tipo === "objeto"
      ? { ...body, width: size.width, height: size.height, rx: 0, ry: 0 }
      : { ...body, cx: size.width / 2, cy: size.height / 2, rx: size.width / 2, ry: size.height / 2 },
    label: {
      text: nombreRender,
      fill: colorTextoParaFill(fill),
      fontFamily: CODEX.fuentes.serif,
      fontSize: 17,
      fontWeight: 400,
      fontStyle: entidad.tipo === "proceso" ? "italic" : "normal",
      textWrap: CODEX.textWrap.entidad,
      refY: refYEtiquetaEntidad(contornoRefinamiento, modoParcial, estadosVisibles.length > 0),
      textVerticalAnchor: contornoRefinamiento || modoParcial ? "top" : "middle",
      textAnchor: "middle",
      pointerEvents: "none",
    },
    index: { display: "none" },
  };
  const metadatos = metadatosEntidad(
    entidad,
    opciones,
    tienePartes || estructuralesOcultas > 0,
    tieneEstadosSuprimidos,
    modoPlegado === "plegado" ? "▸" : "▾",
    estructuralesOcultas > 0
      ? `${estructuralesOcultas} relación(es) estructural(es) plegadas`
      : "Plegado parcial",
    estadosOcultosCount,
    notasMesaCount,
  );
  const renderBase = modoParcial
    ? { markup: markupPlegadoParcial(bodyTag, filasParciales), attrs: attrsPlegadoParcial(attrsBase, size, filasParciales) }
    : estadosVisibles.length > 0
      ? { markup: markupConEstados(bodyTag, estadosVisibles, metadatos, estadosSeleccionados), attrs: attrsConEstados(attrsBase, size, estadosVisibles, metadatos, entidad.layoutEstados, estadosSeleccionados) }
      : tienePartes
        ? { markup: markupConBadge(bodyTag, metadatos), attrs: attrsConBadge(attrsBase, size, metadatos) }
        : metadatos.tieneMetadatos
          ? { markup: markupConBadge(bodyTag, metadatos), attrs: attrsConBadge(attrsBase, size, metadatos) }
          : { attrs: attrsBase };
  // SEL-2 (Codex rev2 §6.2): la selección NO emite resize-handles flotantes.
  // La affordance Codex es solo el underline crimson hairline + la anotación
  // tipográfica HTML (CodexSelectionAnnotation). Los connect-anchors siguen
  // apareciendo en selección porque pertenecen al modo enlace, no al resize.
  const renderConAnchors = {
    ...renderBase,
    markup: markupConConnectAnchors(renderBase.markup ?? markupBase(bodyTag)),
    attrs: attrsConConnectAnchors(renderBase.attrs, size, entidad.tipo, seleccionada),
  };
  // SEL-1: underline crimson embebido bajo la etiqueta en selección única.
  const renderConResize = seleccionUnica
    ? {
        ...renderConAnchors,
        markup: markupConResizeHandles(renderConAnchors.markup),
        attrs: attrsConResizeHandles(renderConAnchors.attrs, size),
      }
    : renderConAnchors;
  const renderConSeleccion = seleccionUnica
    ? {
        ...renderConResize,
        markup: markupConSelectionUnderline(renderConResize.markup),
        attrs: attrsConSelectionUnderline(renderConResize.attrs, size),
      }
    : renderConResize;
  // D6.3: badge de estereotipo aplicado SOBRE el markup ya compuesto. Al ir al
  // final del pipeline sobrevive a TODAS las variantes (base, badge, estados,
  // plegado, selección). Espejo exacto de markupConSelectionUnderline /
  // attrsConSelectionUnderline.
  const render = mostrarEstereotipo
    ? {
        ...renderConSeleccion,
        markup: markupConEstereotipo(renderConSeleccion.markup ?? markupBase(bodyTag), mostrarEstereotipo),
        attrs: attrsConEstereotipo(renderConSeleccion.attrs, size, estereotipoNombre, mostrarEstereotipo, contornoRefinamiento || modoParcial),
      }
    : renderConSeleccion;
  const ports = portsEntidad(apariencia, entidad.tipo);

  return {
    id: apariencia.id,
    type: entidad.tipo === "objeto" ? "standard.Rectangle" : "standard.Ellipse",
    position: { x: apariencia.x, y: apariencia.y },
    size,
    ...render,
    ...(ports ? { ports } : {}),
    opm: {
      kind: "entidad",
      opdId,
      entidadId: entidad.id,
      aparienciaId: apariencia.id,
      rol: rolApariencia(modelo, opdId, apariencia, contornoRefinamiento),
      ...(estadosVisibles.length > 0 ? { estadosInteractivos: targetsEstado(estadosVisibles) } : {}),
      ...(modoParcial ? { partesPlegadas: selectoresPartesPlegadas(filasParciales) } : {}),
    },
    z: contornoRefinamiento ? 0 : 10,
  };
}

export function dimensionesEntidadRenderizada(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  entidad: Entidad,
  opciones: OpcionesProyeccion,
): { width: number; height: number } {
  const partes = partesDePlegado(modelo, entidad.id);
  const tienePartes = partes.length > 0;
  const modoPlegado = modoPlegadoApariencia(apariencia);
  const modoParcial = modoPlegado === "parcial" && tienePartes;
  const filasParciales = modoParcial ? filasPlegadoConNesting({ modelo, opdId, padreAparienciaId: apariencia.id }) : [];
  const estadosTotales = entidad.tipo === "objeto" && !modoParcial ? estadosDeEntidad(modelo, entidad.id) : [];
  const estadosVisibles = estadosTotales.filter((estado) => estadoVisibleEnAparicion(estado, apariencia));
  const nombreRender = formatearNombreCompuesto(
    {
      nombre: nombreCanonicoEntidad(entidad),
      ...(entidad.unidad ? { unidad: entidad.unidad } : {}),
      ...(entidad.alias ? { alias: entidad.alias } : {}),
    },
    { aliasVisible: opciones.aliasVisibles !== false },
  );
  const sizeBase = modoParcial
    ? dimensionesPlegadoParcial(apariencia, nombreRender, filasParciales)
    : estadosVisibles.length > 0
      ? dimensionesConEstados(apariencia, nombreRender, estadosVisibles, entidad.layoutEstados)
      : dimensionesEntidadSinEstados(apariencia, nombreRender);
  return obtenerRefinamiento(entidad, "descomposicion")?.opdId === opdId
    ? dimensionesContornoConPadding(modelo, opdId, apariencia, sizeBase)
    : sizeBase;
}

function portsEntidad(apariencia: Apariencia, tipo: Entidad["tipo"]): Record<string, unknown> | undefined {
  const ports = apariencia.ports ? Object.entries(apariencia.ports) : [];
  if (ports.length === 0) return undefined;
  if (tipo === "proceso") {
    return {
      groups: Object.fromEntries(ports.map(([id, port]) => [id, {
        ...grupoPuertoBase(),
        position: (_ports: unknown[], elBBox: { width: number; height: number }) => [puntoPuertoElipse(port.x, port.y, elBBox)],
      }])),
      items: ports.map(([id]) => ({ id, group: id })),
    };
  }
  return {
    groups: {
      aaa: {
        ...grupoPuertoBase(),
        position: "absolute",
      },
    },
    items: ports.map(([id, port]) => ({
      id,
      group: "aaa",
      args: {
        x: tipo === "objeto" ? `${port.x * 100}%` : port.x,
        y: tipo === "objeto" ? `${port.y * 100}%` : port.y,
      },
      position: {
        args: {
          x: tipo === "objeto" ? `${port.x * 100}%` : port.x,
          y: tipo === "objeto" ? `${port.y * 100}%` : port.y,
        },
      },
    })),
  };
}

function grupoPuertoBase(): Record<string, unknown> {
  return {
    markup: [{ tagName: "rect", selector: "portBody" }],
    attrs: {
      portBody: {
        width: 8,
        height: 8,
        x: -4,
        y: -4,
        fill: "transparent",
        stroke: "transparent",
        magnet: true,
      },
    },
  };
}

function puntoPuertoElipse(refX: number, refY: number, elBBox: { width: number; height: number }): { x: number; y: number; angle: number } {
  const rx = elBBox.width / 2;
  const ry = elBBox.height / 2;
  const cx = rx;
  const cy = ry;
  const dx = refX * elBBox.width - cx;
  const dy = refY * elBBox.height - cy;
  const denom = Math.sqrt((dx * dx) / (rx * rx || 1) + (dy * dy) / (ry * ry || 1));
  if (denom === 0) return { x: cx + rx, y: cy, angle: 0 };
  const t = 1 / denom;
  return { x: cx + dx * t, y: cy + dy * t, angle: 0 };
}

function markupBase(bodyTag: "rect" | "ellipse"): Array<Record<string, unknown>> {
  return [
    { tagName: bodyTag, selector: "body" },
    { tagName: "text", selector: "label" },
    { tagName: "text", selector: "index" },
  ];
}

/**
 * Identificador canonico `o.NN`/`p.NN`/`s.NN` (ui-forja/08 §1.3, SSOT
 * opm-visual-es §identificadores). Lectura pura del `id` interno de la entidad
 * (`o-N`/`p-N`), no muta modelo ni proyeccion semantica (frontera dura L5).
 *
 * Limitacion documentada (commit/decision §10): el modelo asigna `id` como
 * secuencia global monotona (`siguienteId` + prefijo `o`/`p`), no como ordinal
 * por tipo. El identificador visible refleja esa secuencia (`o.03`, no un
 * conteo `o.01` per-tipo): el read-side no expone un ordinal por tipo sin
 * cruzar a proyeccion/modelo. El prefijo (`o`/`p`) y el formato `.NN`
 * (zero-pad a 2) son la pieza canonica V-202 que SI vive en presentacion.
 */
export function identificadorCanonicoEntidad(entidad: Entidad): string {
  const prefijo = entidad.tipo === "proceso" ? "p" : "o";
  const seq = secuenciaDesdeId(entidad.id);
  return `${prefijo}.${seq}`;
}

export function identificadorCanonicoApariencia(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  entidad: Entidad,
): string {
  const contexto = apariencia.contextoRefinamiento;
  if (contexto?.tipo !== "descomposicion" || contexto.rol !== "interno") {
    return identificadorCanonicoEntidad(entidad);
  }
  const padre = modelo.entidades[contexto.refinableEntidadId];
  const opd = modelo.opds[opdId];
  if (!padre || !opd) return identificadorCanonicoEntidad(entidad);
  const hermanos = Object.values(opd.apariencias)
    .filter((item) => item.contextoRefinamiento?.tipo === "descomposicion")
    .filter((item) => item.contextoRefinamiento?.rol === "interno")
    .filter((item) => item.contextoRefinamiento?.refinableEntidadId === contexto.refinableEntidadId)
    .filter((item) => modelo.entidades[item.entidadId]?.tipo === entidad.tipo)
    .sort((a, b) => a.y - b.y || a.x - b.x || a.id.localeCompare(b.id));
  const ordinal = Math.max(0, hermanos.findIndex((item) => item.id === apariencia.id)) + 1;
  return `${identificadorCanonicoEntidad(padre)}.${ordinal}`;
}

function secuenciaDesdeId(id: Id): string {
  const sufijo = id.includes("-") ? id.slice(id.lastIndexOf("-") + 1) : id.replace(/^[a-zA-Z]+/, "");
  const n = Number.parseInt(sufijo, 10);
  if (!Number.isFinite(n)) return sufijo || "01";
  return String(n).padStart(2, "0");
}

function dimensionesEntidadSinEstados(apariencia: Apariencia, nombreRender: string): { width: number; height: number } {
  const anchoTexto = Array.from(nombreRender).length * 8 + 28;
  const palabraMasLarga = Math.max(...nombreRender.split(/\s+/).map((palabra) => Array.from(palabra).length), 0) * 10 + 28;
  return {
    width: Math.max(apariencia.width, CANON.dims.cosaWidth, anchoTexto, palabraMasLarga),
    height: Math.max(apariencia.height, CANON.dims.cosaHeight),
  };
}

function dimensionesContornoConPadding(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  sizeBase: { width: number; height: number },
): { width: number; height: number } {
  const opd = modelo.opds[opdId];
  if (!opd) return sizeBase;
  const padding = 16;
  const internas = Object.values(opd.apariencias).filter((item) => (
    item.id !== apariencia.id &&
    item.contextoRefinamiento?.tipo === "descomposicion" &&
    item.contextoRefinamiento.rol === "interno" &&
    item.contextoRefinamiento.refinableEntidadId === apariencia.entidadId
  ));
  if (internas.length === 0) return sizeBase;
  const right = Math.max(...internas.map((item) => item.x + item.width - apariencia.x + padding));
  const bottom = Math.max(...internas.map((item) => item.y + item.height - apariencia.y + padding));
  return {
    width: Math.max(sizeBase.width, right),
    height: Math.max(sizeBase.height, bottom),
  };
}

function attrsIndiceEntidad(modelo: Modelo, opdId: Id, apariencia: Apariencia, entidad: Entidad): Record<string, unknown> {
  return {
    text: identificadorCanonicoApariencia(modelo, opdId, apariencia, entidad),
    fontFamily: CODEX.fuentes.mono,
    fontSize: CODEX.index.fontSize,
    fontWeight: CODEX.index.fontWeight,
    fill: CODEX.colores.inkSoft,
    letterSpacing: CODEX.index.letterSpacing,
    textAnchor: "start",
    refX: 0,
    refY: `calc(h + ${CODEX.index.offsetY})`,
    pointerEvents: "none",
  };
}

// SEL-1: underline crimson hairline embebido (selección única). Espejo de
// composers/halos.ts → proyectarHaloSeleccion (mismo trazo 1.2 crimson, misma
// geometría: ancho = max(24, w-16), centrado horizontal, justo bajo el centro
// vertical), pero como sub-elemento de la celda en vez de celda aparte.
function markupConSelectionUnderline(markup: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  return [...markup, { tagName: "path", selector: "selectionUnderline" }];
}

function attrsConSelectionUnderline(
  attrsBase: Record<string, unknown>,
  size: { width: number; height: number },
): Record<string, unknown> {
  const ancho = Math.max(24, size.width - 16);
  const x = (size.width - ancho) / 2;
  const y = size.height / 2 + 6;
  return {
    ...attrsBase,
    selectionUnderline: {
      d: `M ${x} ${y} L ${x + ancho} ${y}`,
      fill: "none",
      stroke: CODEX.colores.crimson,
      strokeWidth: CODEX.strokes.seleccion,
      pointerEvents: "none",
    },
  };
}

// D6.3 / R-VIS-STEREO-1: badge de estereotipo `<<Nombre>>` embebido en la celda.
// Espejo exacto de markupConSelectionUnderline / attrsConSelectionUnderline: opera
// sobre el markup ya compuesto, por eso sobrevive a todas las variantes de render.
// Tinta CODEX (inkSoft) — crimson PROHIBIDO (UI-only para foco/selección, ui-forja/06).
function markupConEstereotipo(
  markup: Array<Record<string, unknown>>,
  mostrar: boolean,
): Array<Record<string, unknown>> {
  if (!mostrar) return markup;
  return [...markup, { tagName: "text", selector: "stereotypeBadge" }];
}

function attrsConEstereotipo(
  attrsBase: Record<string, unknown>,
  size: { width: number; height: number },
  nombre: string | undefined,
  mostrar: boolean,
  labelArriba = false,
): Record<string, unknown> {
  if (!mostrar || nombre === undefined) return attrsBase;
  // Sin estados el label va centrado (refYEtiquetaEntidad="50%"): un badge a y=11
  // en caja default de 60px (centro 30) no solapa. En variantes con label arriba
  // (contorno/parcial, refY="8%"≈top), el nombre ya ocupa la franja superior:
  // empuja el badge bajo el borde inferior para no pisarlo.
  const y = labelArriba ? Math.max(11, size.height - 9) : 11;
  return {
    ...attrsBase,
    stereotypeBadge: {
      text: `<<${nombre}>>`,
      x: size.width / 2,
      y,
      fill: CODEX.colores.inkSoft,
      fontFamily: CODEX.fuentes.serif,
      fontSize: 11,
      fontWeight: 600,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      pointerEvents: "none",
    },
  };
}

// BUG-20260605T010727Z-916191 (hallazgo B): resize SOLO en las 4 esquinas.
// Los handles cardinales (n/e/s/w) se dibujaban exactamente sobre los
// connect-anchors N/E/S/O (mismo punto, z superior en el markup) y tapaban
// el inicio de conexión cuando la entidad/estado estaba en selección única.
const RESIZE_HANDLES = ["nw", "ne", "se", "sw"] as const;
type ResizeHandle = typeof RESIZE_HANDLES[number];

function markupConResizeHandles(markup: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  return [
    ...markup,
    ...RESIZE_HANDLES.map((handle) => ({ tagName: "rect", selector: `resize-${handle}` })),
  ];
}

function attrsConResizeHandles(
  attrsBase: Record<string, unknown>,
  size: { width: number; height: number },
): Record<string, unknown> {
  return {
    ...attrsBase,
    ...Object.fromEntries(RESIZE_HANDLES.map((handle) => [`resize-${handle}`, attrsResizeHandle(puntoResizeHandle(size, handle), cursorResize(handle))])),
  };
}

function puntoResizeHandle(size: { width: number; height: number }, handle: ResizeHandle): { x: number; y: number } {
  const cx = handle.includes("w") ? 0 : handle.includes("e") ? size.width : size.width / 2;
  const cy = handle.includes("n") ? 0 : handle.includes("s") ? size.height : size.height / 2;
  return { x: cx - 4, y: cy - 4 };
}

function attrsResizeHandle(point: { x: number; y: number }, cursor: string): Record<string, unknown> {
  return {
    x: point.x,
    y: point.y,
    width: 8,
    height: 8,
    rx: 0,
    ry: 0,
    fill: CODEX.colores.paper,
    stroke: CODEX.colores.crimson,
    strokeWidth: 1,
    cursor,
    pointerEvents: "visiblePainted",
  };
}

function cursorResize(handle: ResizeHandle): string {
  if (handle === "nw" || handle === "se") return "nwse-resize";
  return "nesw-resize";
}

export function rolApariencia(modelo: Modelo, opdId: Id, apariencia: Apariencia, esContorno: boolean): RolApariencia {
  return rolAparienciaEnRefinamiento(modelo, opdId, apariencia, esContorno);
}

export function refYEtiquetaEntidad(contornoRefinamiento: boolean, modoParcial: boolean, tieneEstados: boolean): string {
  if (contornoRefinamiento || modoParcial) return "8%";
  if (tieneEstados) return "34%";
  return "50%";
}

interface MetadatosEntidadRender {
  foldBadge: boolean;
  foldBadgeText: string;
  foldBadgeTitle: string;
  descripcion?: string;
  url?: string;
  suppressedBadge: boolean;
  /** Cantidad de estados ocultos en esta vista (global O local). Alimenta el chip `⋯N`. */
  suppressedCount: number;
  noteBadge: boolean;
  noteCount: number;
  tieneMetadatos: boolean;
}

export function metadatosEntidad(
  entidad: Entidad,
  opciones: OpcionesProyeccion,
  tienePartes: boolean,
  tieneEstadosSuprimidos = false,
  foldBadgeText = "▾",
  foldBadgeTitle = "Plegado parcial",
  estadosOcultosCount = 0,
  notasMesaCount = 0,
): MetadatosEntidadRender {
  const descripcion = opciones.descripcionesVisibles !== false ? entidad.descripcion?.trim() : undefined;
  const url = entidad.urls?.[0]?.url;
  return {
    foldBadge: tienePartes,
    foldBadgeText,
    foldBadgeTitle,
    ...(descripcion ? { descripcion } : {}),
    ...(url ? { url } : {}),
    suppressedBadge: tieneEstadosSuprimidos,
    suppressedCount: estadosOcultosCount,
    noteBadge: notasMesaCount > 0,
    noteCount: notasMesaCount,
    tieneMetadatos: tienePartes || !!descripcion || !!url || tieneEstadosSuprimidos || notasMesaCount > 0,
  };
}

function markupConConnectAnchors(markup: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  return [
    ...markup,
    ...ANCLAS_RELOJ_ENLACE.map((anchor) => ({
      tagName: "circle",
      selector: `connect-anchor-${anchor.toLowerCase()}`,
    })),
  ];
}

function attrsConConnectAnchors(
  attrsBase: Record<string, unknown>,
  size: { width: number; height: number },
  tipo: Entidad["tipo"],
  visible: boolean,
): Record<string, unknown> {
  const points = Object.fromEntries(ANCLAS_RELOJ_ENLACE.map((anchor) => {
    const point = puntoAnchorConexion(size, tipo, anchor);
    return [`connect-anchor-${anchor.toLowerCase()}`, point];
  }));
  const anchors = Object.fromEntries(Object.entries(points).map(([selector, point]) => [
    selector,
    {
      ...point,
      r: 5,
      fill: CODEX.colores.paper,
      stroke: CODEX.colores.ink,
      strokeWidth: 1,
      cursor: "crosshair",
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? "visiblePainted" : "none",
      "data-opm-connect-anchor": selector.replace("connect-anchor-", "").toUpperCase(),
    },
  ]));
  return { ...attrsBase, ...anchors };
}

function puntoAnchorConexion(
  size: { width: number; height: number },
  tipo: Entidad["tipo"],
  anchor: AnclaRelojEnlace,
): { cx: number; cy: number } {
  const rel = puertoRelativoAnclaEnlace(anchor);
  if (tipo === "proceso") {
    const point = puntoPuertoElipse(rel.x, rel.y, size);
    return { cx: point.x, cy: point.y };
  }
  return { cx: rel.x * size.width, cy: rel.y * size.height };
}

export function markupConBadge(bodyTag: "rect" | "ellipse", metadatos: MetadatosEntidadRender): Array<Record<string, unknown>> {
  return [
    { tagName: bodyTag, selector: "body" },
    { tagName: "text", selector: "label" },
    { tagName: "text", selector: "index" },
    ...(metadatos.foldBadge ? [{ tagName: "text", selector: "foldBadge" }] : []),
    ...(metadatos.descripcion ? [{ tagName: "text", selector: "descBadge" }] : []),
    ...(metadatos.url ? [{
      tagName: "a",
      selector: "urlLink",
      children: [{ tagName: "text", selector: "urlBadge" }],
    }] : []),
    ...(metadatos.noteBadge ? [{ tagName: "rect", selector: "noteBadgeChip" }, { tagName: "text", selector: "noteBadge" }] : []),
    ...(metadatos.suppressedBadge ? [{ tagName: "rect", selector: "suppressedBadgeChip" }, { tagName: "text", selector: "suppressedBadge" }] : []),
  ];
}

export function markupConEstados(
  bodyTag: "rect" | "ellipse",
  estados: Estado[],
  metadatos: MetadatosEntidadRender,
  estadosSeleccionados: readonly Estado[] = [],
): Array<Record<string, unknown>> {
  const seleccionados = new Set(estadosSeleccionados.map((estado) => estado.id));
  const capsulas = estados.flatMap((estado, index) => [
    { tagName: "rect", selector: `stateCapsule${index}` },
    { tagName: "rect", selector: `stateFinalInner${index}` },
    { tagName: "text", selector: `stateLabel${index}` },
    { tagName: "text", selector: `stateDefaultMarker${index}` },
    { tagName: "text", selector: `stateCurrentMarker${index}` },
    ...ANCLAS_RELOJ_ENLACE.map((anchor) => ({ tagName: "circle", selector: selectorAnchorEstado(index, anchor) })),
    ...(seleccionados.has(estado.id)
      ? RESIZE_HANDLES.map((handle) => ({ tagName: "rect", selector: `resize-state${index}-${handle}` }))
      : []),
  ]);
  return [
    { tagName: bodyTag, selector: "body" },
    { tagName: "text", selector: "label" },
    { tagName: "text", selector: "index" },
    ...capsulas,
    ...(metadatos.foldBadge ? [{ tagName: "text", selector: "foldBadge" }] : []),
    ...(metadatos.descripcion ? [{ tagName: "text", selector: "descBadge" }] : []),
    ...(metadatos.url ? [{
      tagName: "a",
      selector: "urlLink",
      children: [{ tagName: "text", selector: "urlBadge" }],
    }] : []),
    ...(metadatos.noteBadge ? [{ tagName: "rect", selector: "noteBadgeChip" }, { tagName: "text", selector: "noteBadge" }] : []),
    ...(metadatos.suppressedBadge ? [{ tagName: "rect", selector: "suppressedBadgeChip" }, { tagName: "text", selector: "suppressedBadge" }] : []),
  ];
}

export function attrsConBadge(
  attrsBase: Record<string, unknown>,
  size: { width: number; height: number },
  metadatos: MetadatosEntidadRender,
): Record<string, unknown> {
  const attrs: Record<string, unknown> = {
    ...attrsBase,
  };
  if (metadatos.foldBadge) {
    attrs.foldBadge = {
      text: metadatos.foldBadgeText,
      x: size.width - 14,
      y: 17,
      fill: CODEX.colores.ink,
      fontFamily: CODEX.fuentes.serif,
      fontSize: 16,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      cursor: "pointer",
      title: metadatos.foldBadgeTitle,
    };
  }
  aplicarMetadatosAttrs(attrs, size, metadatos);
  return attrs;
}

export function attrsConEstados(
  attrsBase: Record<string, unknown>,
  size: { width: number; height: number },
  estados: Estado[],
  metadatos: MetadatosEntidadRender,
  layout: Entidad["layoutEstados"],
  estadosSeleccionados: readonly Estado[] = [],
): Record<string, unknown> {
  const seleccionados = new Set(estadosSeleccionados.map((estado) => estado.id));
  const attrs: Record<string, unknown> = {
    ...attrsBase,
    label: {
      ...(attrsBase.label as Record<string, unknown>),
      textWrap: { width: size.width - 24, height: size.height - ESTADOS.regionHeight - 8, ellipsis: false },
    },
  };
  if (metadatos.foldBadge) attrs.foldBadge = attrsConBadge(attrsBase, size, metadatos).foldBadge;
  aplicarMetadatosAttrs(attrs, size, metadatos);
  for (const [index, estado] of estados.entries()) {
    const rect = rectCapsulaEstadoLocal(size, estados, layout, index);
    if (!rect) continue;
    const { x, y, width, height } = rect;
    const designaciones = designacionesEstado(estado);
    attrs[`stateCapsule${index}`] = {
      x,
      y,
      width,
      height,
      // BUG-9e3b9b / canon §3.2 (línea 224): el estado OPM es un ROUNTANGLE
      // (rectángulo redondeado), NO un stadium/pill. La evidencia OPCloud
      // (export-legend-dialog `rx="5"` sobre h≈24-30; OpmObject.innerOuter rx:5)
      // confirma esquinas de radio fijo moderado. `calc(h/2)` producía píldoras
      // completas (semicírculos en los extremos) — forma no canónica. Usamos el
      // radio fijo `ESTADOS.radius` para el rountangle correcto.
      rx: ESTADOS.radius,
      ry: ESTADOS.radius,
      fill: designaciones.includes("final") ? CODEX.colores.estadoFinalFill : CODEX.colores.estadoFill,
      stroke: CODEX.colores.opmEstado,
      strokeWidth: designaciones.includes("inicial") ? 3 : CODEX.strokes.estado,
      pointerEvents: "auto",
      cursor: "grab",
      // Paquete "Estados ciudadanos de primera clase" (2026-05-23): los
      // estados son ciudadanos visualmente identificables en la cápsula.
      // El CSS (jointjs.css) reacciona a estos atributos para hover/focus/
      // selected/dragging usando tokens Codex.
      // V-202: estos atributos son affordance UI, no gramática OPM; no se
      // exportan al canon. data-estado-id alimenta el handler de click.
      "data-estado-id": estado.id,
      "data-estado-index": String(index),
      "data-cap-rol": "estado",
      "data-selected": seleccionados.has(estado.id) ? "true" : undefined,
    };
    attrs[`stateFinalInner${index}`] = {
      x: x + 3,
      y: y + 3,
      width: Math.max(0, width - 6),
      height: Math.max(0, height - 6),
      rx: Math.max(0, ESTADOS.radius - 2),
      ry: Math.max(0, ESTADOS.radius - 2),
      fill: "transparent",
      stroke: CODEX.colores.opmEstado,
      strokeWidth: designaciones.includes("final") ? 1 : 0,
      pointerEvents: "none",
      display: designaciones.includes("final") ? undefined : "none",
    };
    attrs[`stateLabel${index}`] = {
      text: nombreCanonicoEstado(estado),
      x: x + width / 2,
      y: y + height / 2,
      fill: CODEX.colores.ink,
      fontFamily: CODEX.fuentes.serif,
      fontSize: ESTADOS.fontSize,
      fontWeight: 400,
      fontStyle: "italic",
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      textWrap: { width: width - ESTADOS.paddingHorizontal * 2, height: height - 4, ellipsis: false },
      pointerEvents: "auto",
      cursor: "grab",
    };
    attrs[`stateDefaultMarker${index}`] = {
      text: "↗",
      x: x + width - 10,
      y: y + 7,
      fill: CODEX.colores.ink,
      fontFamily: CODEX.fuentes.serif,
      fontSize: 12,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      pointerEvents: "none",
      display: designaciones.includes("default") ? undefined : "none",
    };
    attrs[`stateCurrentMarker${index}`] = {
      text: "●",
      x: x + 10,
      y: y + 7,
      fill: CODEX.colores.ink,
      fontFamily: CODEX.fuentes.serif,
      fontSize: 10,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      pointerEvents: "none",
      display: designaciones.includes("current") ? undefined : "none",
    };
    for (const anchor of ANCLAS_RELOJ_ENLACE) {
      const selector = selectorAnchorEstado(index, anchor);
      attrs[selector] = attrsAnchorEstado(
        { width, height },
        x,
        y,
        anchor,
        estado.id,
      );
    }
    if (seleccionados.has(estado.id)) {
      for (const handle of RESIZE_HANDLES) {
        attrs[`resize-state${index}-${handle}`] = attrsResizeHandle(puntoHandleEstado({ x, y, width, height }, handle), cursorResize(handle));
      }
    }
  }
  return attrs;
}

function attrsAnchorEstado(
  size: { width: number; height: number },
  offsetX: number,
  offsetY: number,
  anchor: AnclaRelojEnlace,
  estadoId: Id,
): Record<string, unknown> {
  const rel = puertoRelativoAnclaEnlace(anchor);
  return {
    cx: offsetX + rel.x * size.width,
    cy: offsetY + rel.y * size.height,
    r: 5,
    fill: CODEX.colores.paper,
    stroke: CODEX.colores.ink,
    strokeWidth: 1,
    cursor: "crosshair",
    opacity: 0,
    pointerEvents: "none",
    magnet: true,
    "data-opm-connect-anchor": anchor,
    "data-opm-connect-state-id": estadoId,
  };
}

export function aplicarMetadatosAttrs(
  attrs: Record<string, unknown>,
  size: { width: number; height: number },
  metadatos: MetadatosEntidadRender,
): void {
  let x = 14;
  if (metadatos.descripcion) {
    // CANON-V2: badge "i" descripcion en ink puro (antes #586D8C slate).
    attrs.descBadge = {
      text: "i",
      x,
      y: 17,
      fill: CODEX.colores.ink,
      fontFamily: CODEX.fuentes.serif,
      fontSize: 12,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      pointerEvents: "none",
      title: metadatos.descripcion,
    };
    x += 16;
  }
  if (metadatos.url) {
    attrs.urlLink = {
      href: metadatos.url,
      xlinkHref: metadatos.url,
      target: "_blank",
      rel: "noopener noreferrer",
      cursor: "pointer",
    };
    // CANON-V2: badge URL en ink puro (antes #3BC3FF azul proceso V1).
    attrs.urlBadge = {
      text: "↗",
      x,
      y: 17,
      fill: CODEX.colores.ink,
      fontFamily: CODEX.fuentes.serif,
      fontSize: 13,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      cursor: "pointer",
      title: metadatos.url,
    };
    x += 16;
  }
  if (metadatos.noteBadge) {
    const count = metadatos.noteCount;
    const titulo = `${count} ${count === 1 ? "nota de mesa" : "notas de mesa"} en esta cosa`;
    const chipAncho = 20 + String(count).length * 7;
    attrs.noteBadgeChip = {
      x: size.width - chipAncho - 4,
      y: 4,
      width: chipAncho,
      height: 15,
      rx: 0,
      ry: 0,
      fill: CODEX.colores.paper,
      stroke: CODEX.colores.ink,
      strokeWidth: 1,
      pointerEvents: "none",
      title: titulo,
    };
    attrs.noteBadge = {
      text: `?${count}`,
      x: size.width - chipAncho / 2 - 4,
      y: 12,
      fill: CODEX.colores.ink,
      fontFamily: CODEX.fuentes.serif,
      fontSize: 10,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      pointerEvents: "none",
      title: titulo,
    };
  }
  if (metadatos.foldBadge && !attrs.foldBadge) {
    attrs.foldBadge = {
      text: metadatos.foldBadgeText,
      x: size.width - 14,
      y: 17,
      fill: CODEX.colores.ink,
      fontFamily: CODEX.fuentes.serif,
      fontSize: 16,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      cursor: "pointer",
      title: metadatos.foldBadgeTitle,
    };
  }
  if (metadatos.suppressedBadge) {
    // SSOT §1.8 / V-192: indicador en esquina inferior derecha de "hay estados
    // ocultos en este OPD" (por supresión global O local). Codex: chip hairline
    // en TINTA (crimson es UI-only, reservado a foco/selección — no puede marcar
    // semántica en el OPD, ui-forja/06 §100). El conteo `⋯N` hace explícito
    // cuántos estados están ocultos en la vista.
    const count = metadatos.suppressedCount;
    const titulo = `${count} ${count === 1 ? "estado oculto" : "estados ocultos"} en este OPD`;
    const chipAlto = 15;
    const chipAncho = 16 + String(count).length * 7;
    const chipX = size.width - chipAncho - 4;
    const chipY = size.height - chipAlto - 4;
    attrs.suppressedBadgeChip = {
      x: chipX,
      y: chipY,
      width: chipAncho,
      height: chipAlto,
      rx: chipAlto / 2,
      ry: chipAlto / 2,
      fill: CODEX.colores.paper,
      stroke: CODEX.colores.ink,
      strokeWidth: 1,
      pointerEvents: "none",
      title: titulo,
    };
    attrs.suppressedBadge = {
      text: `⋯${count}`,
      x: chipX + chipAncho / 2,
      y: chipY + chipAlto / 2 + 0.5,
      fill: CODEX.colores.ink,
      fontFamily: CODEX.fuentes.serif,
      fontSize: 10,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      pointerEvents: "none",
      title: titulo,
    };
  }
}

export { dimensionesConEstados, ESTADOS } from "./estados";
export { dimensionesPlegadoParcial, PLEGADO, attrsPlegadoParcial, markupPlegadoParcial, selectoresPartesPlegadas, textoFilaPlegado } from "./plegado";
