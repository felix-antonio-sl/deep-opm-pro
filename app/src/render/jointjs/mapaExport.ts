import type { dia } from "jointjs";
import { dia as jointDia } from "jointjs";
import type { Modelo } from "../../modelo/tipos";
import { ordenarOpdsParaOpl } from "../../opl/bloquesJerarquicos";
import { embedirContorno } from "./handlers/drag";
import { ajustarPaperAContenido } from "./handlers/helpers";
import { crearJointCellNamespace, opcionesPaperCodex } from "./jointCanvasAdapter";
import { aplicarRuteoOpcloudEnlaces } from "./opcloudRouting";
import { proyectarModeloAJointCells } from "./proyeccion";

export interface OpcionesExport {
  nombreArchivo?: string;
  paddingPx?: number;
  fondo?: "blanco" | "transparente";
}

export interface OpcionesDescargaOpdPng {
  nombreArchivo?: string;
  fondo?: "blanco" | "transparente";
}

export interface OpcionesDescargaOpdsPngZip {
  nombreArchivo?: string;
  fondo?: "blanco" | "transparente";
}

const PADDING_EXPORT_PNG = 32;

export async function exportarMapa(
  paper: dia.Paper,
  modelo: Modelo,
  opts: OpcionesExport,
): Promise<Blob> {
  void modelo;
  const svg = obtenerSvgPaper(paper, opts);
  return svgAPng(svg, opts.fondo ?? "blanco");
}

export async function descargarMapa(
  paper: dia.Paper,
  modelo: Modelo,
  opts: OpcionesExport,
): Promise<void> {
  const blob = await exportarMapa(paper, modelo, opts);
  descargarBlob(blob, opts.nombreArchivo ?? nombreArchivoMapa(modelo));
}

export async function descargarOpdActualPng(
  paper: dia.Paper,
  modelo: Modelo,
  opdId: string,
  opts: OpcionesDescargaOpdPng = {},
): Promise<void> {
  const opdNombre = modelo.opds[opdId]?.nombre ?? "OPD";
  await descargarMapa(paper, modelo, {
    fondo: opts.fondo ?? "blanco",
    nombreArchivo: opts.nombreArchivo ?? nombreArchivoOpdPng(modelo, opdNombre),
  });
}

export async function descargarTodosLosOpdsPngZip(
  modelo: Modelo,
  opts: OpcionesDescargaOpdsPngZip = {},
): Promise<void> {
  const zip = await exportarTodosLosOpdsPngZip(modelo, opts);
  descargarBlob(zip, opts.nombreArchivo ?? nombreArchivoOpdsPngZip(modelo));
}

export async function exportarTodosLosOpdsPngZip(
  modelo: Modelo,
  opts: Pick<OpcionesDescargaOpdsPngZip, "fondo"> = {},
): Promise<Blob> {
  const entradas = await Promise.all(
    ordenarOpdsParaOpl(modelo).map(async (opdId, index) => {
      const opd = modelo.opds[opdId];
      const blob = await exportarOpdOffscreenPng(modelo, opdId, opts.fondo ?? "blanco");
      return {
        nombre: `${String(index + 1).padStart(2, "0")}-${slugArchivo(opd?.nombre ?? opdId)}.png`,
        blob,
      };
    }),
  );
  return crearZip(entradas);
}

export function nombreArchivoMapa(modelo: Modelo, fecha = new Date()): string {
  const base = slugArchivo(modelo.nombre || "modelo");
  return `${base}-mapa-${fecha.toISOString().slice(0, 10)}.png`;
}

export function nombreArchivoOpdPng(modelo: Modelo, opdNombre: string, fecha = new Date()): string {
  const modeloSlug = slugArchivo(modelo.nombre || "modelo");
  const opdSlug = slugArchivo(opdNombre || "opd");
  return `${modeloSlug}-${opdSlug}-${fecha.toISOString().slice(0, 10)}.png`;
}

export function nombreArchivoOpdsPngZip(modelo: Modelo, fecha = new Date()): string {
  const modeloSlug = slugArchivo(modelo.nombre || "modelo");
  return `${modeloSlug}-opds-png-${fecha.toISOString().slice(0, 10)}.zip`;
}

async function exportarOpdOffscreenPng(modelo: Modelo, opdId: string, fondo: "blanco" | "transparente"): Promise<Blob> {
  if (typeof document === "undefined") {
    return new Blob([], { type: "image/png" });
  }
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-100000px";
  host.style.top = "0";
  host.style.width = "1px";
  host.style.height = "1px";
  host.style.overflow = "hidden";
  document.body.appendChild(host);
  const cellNamespace = crearJointCellNamespace();
  const graph = new jointDia.Graph({}, { cellNamespace });
  const paper = new jointDia.Paper({
    el: host,
    model: graph,
    width: 1,
    height: 1,
    cellViewNamespace: cellNamespace,
    async: false,
    frozen: false,
    ...opcionesPaperCodex(),
    linkPinning: false,
    interactive: false,
  });
  try {
    const cells = proyectarModeloAJointCells(modeloParaExportar(modelo), opdId, null, null);
    graph.resetCells(cells as dia.Cell.JSON[]);
    embedirContorno(graph);
    aplicarRuteoOpcloudEnlaces(graph);
    // Canvas infinito: ajusta el paper al bbox real (incluidas coordenadas
    // negativas) tras embeber/rutear, para que el SVG offscreen no recorte
    // contenido a la izquierda/arriba del origen.
    ajustarPaperAContenido(paper, { padding: PADDING_EXPORT_PNG });
    (paper as unknown as { updateViews?: (opt?: { viewport?: () => boolean }) => void }).updateViews?.({ viewport: () => true });
    await esperarFrame();
    return await exportarMapa(paper, modelo, { fondo });
  } finally {
    (paper as unknown as { remove(): void }).remove();
    host.remove();
  }
}

function modeloParaExportar(modelo: Modelo): Modelo {
  return {
    ...modelo,
    estados: modelo.estados ?? {},
    enlaces: modelo.enlaces ?? {},
    entidades: modelo.entidades ?? {},
    opds: modelo.opds ?? {},
    abanicos: modelo.abanicos ?? {},
  };
}

function obtenerSvgPaper(paper: dia.Paper, opts: OpcionesExport): string {
  const paperConEl = paper as unknown as { el?: Element };
  const encuadre = encuadreExportacion(paper, paperConEl.el, opts);
  const svgElement = paperConEl.el?.querySelector?.("svg");
  const svgDom = svgElement ? serializarSvg(svgElement) : "";
  if (svgDom?.includes("<svg")) return normalizarSvg(svgDom, opts, encuadre);

  const paperConToSvg = paper as unknown as {
    toSVG?: (callback?: (svg: string) => void, options?: Record<string, unknown>) => string | void;
    el?: Element;
  };
  if (typeof paperConToSvg.toSVG === "function") {
    const directo = paperConToSvg.toSVG(undefined, { preserveDimensions: true, convertImagesToDataUris: true });
    if (typeof directo === "string" && directo.includes("<svg")) return normalizarSvg(directo, opts, encuadre);
    let capturado = "";
    paperConToSvg.toSVG((svg) => {
      capturado = svg;
    }, { preserveDimensions: true, convertImagesToDataUris: true });
    if (capturado.includes("<svg")) return normalizarSvg(capturado, opts, encuadre);
  }
  return normalizarSvg("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1\" height=\"1\"></svg>", opts);
}

function serializarSvg(svgElement: Element): string {
  if (typeof XMLSerializer !== "undefined") {
    return new XMLSerializer().serializeToString(svgElement);
  }
  return (svgElement as HTMLElement).outerHTML;
}

function normalizarSvg(svg: string, opts: OpcionesExport, encuadre?: EncuadreSvg): string {
  const fondo = opts.fondo ?? "blanco";
  const conXmlns = svg.includes("xmlns=\"http://www.w3.org/2000/svg\"")
    ? svg
    : svg.replace("<svg", "<svg xmlns=\"http://www.w3.org/2000/svg\"");
  const normalizado = normalizarColoresSvg(encuadre ? fijarEncuadreSvg(conXmlns, encuadre) : conXmlns);
  return fondo === "blanco" ? inyectarFondoBlanco(normalizado) : normalizado;
}

interface EncuadreSvg {
  x: number;
  y: number;
  width: number;
  height: number;
}

function encuadreExportacion(paper: dia.Paper, el: Element | undefined, opts: OpcionesExport): EncuadreSvg | undefined {
  const contenido = bboxContenidoPaper(paper) ?? bboxContenidoSvg(el);
  if (contenido) return expandirEncuadre(contenido, opts.paddingPx ?? PADDING_EXPORT_PNG);
  const dimensiones = dimensionesElementoPaper(el);
  return dimensiones ? { x: 0, y: 0, ...dimensiones } : undefined;
}

function bboxContenidoPaper(paper: dia.Paper): EncuadreSvg | null {
  const paperConBBox = paper as unknown as {
    getContentBBox?: (options?: { useModelGeometry?: boolean }) => { x: number; y: number; width: number; height: number } | null;
  };
  if (typeof paperConBBox.getContentBBox !== "function") return null;
  try {
    return normalizarEncuadre(paperConBBox.getContentBBox());
  } catch {
    return null;
  }
}

function bboxContenidoSvg(el?: Element): EncuadreSvg | null {
  const svg = el?.querySelector?.("svg");
  const target = svg?.querySelector?.(".joint-viewport, .joint-cells-layer, g") ?? svg;
  if (!target || typeof SVGGraphicsElement === "undefined" || !(target instanceof SVGGraphicsElement)) return null;
  try {
    return normalizarEncuadre(target.getBBox());
  } catch {
    return null;
  }
}

function normalizarEncuadre(bbox?: { x: number; y: number; width: number; height: number } | null): EncuadreSvg | null {
  if (!bbox) return null;
  const { x, y, width, height } = bbox;
  if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) return null;
  return { x, y, width, height };
}

function expandirEncuadre(bbox: EncuadreSvg, paddingPx: number): EncuadreSvg {
  const padding = Math.max(0, Number.isFinite(paddingPx) ? paddingPx : PADDING_EXPORT_PNG);
  return {
    x: Math.floor(bbox.x - padding),
    y: Math.floor(bbox.y - padding),
    width: Math.max(1, Math.ceil(bbox.width + padding * 2)),
    height: Math.max(1, Math.ceil(bbox.height + padding * 2)),
  };
}

function dimensionesElementoPaper(el?: Element): Pick<EncuadreSvg, "width" | "height"> | undefined {
  if (!el) return undefined;
  const elemento = el as Element & {
    clientWidth?: number;
    clientHeight?: number;
    style?: { width?: string; height?: string };
  };
  const width = parseDimension(elemento.style?.width ?? "") || elemento.clientWidth || 0;
  const height = parseDimension(elemento.style?.height ?? "") || elemento.clientHeight || 0;
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return undefined;
  return { width: Math.ceil(width), height: Math.ceil(height) };
}

function parseDimension(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function fijarEncuadreSvg(svg: string, encuadre: EncuadreSvg): string {
  const match = /<svg\b([^>]*)>/i.exec(svg);
  if (!match) return svg;
  const attrs = match[1] ?? "";
  const sinDimensiones = attrs
    .replace(/\swidth="[^"]*"/i, "")
    .replace(/\sheight="[^"]*"/i, "")
    .replace(/\sviewBox="[^"]*"/i, "");
  const siguiente = `<svg${sinDimensiones} width="${fmtSvg(encuadre.width)}" height="${fmtSvg(encuadre.height)}" viewBox="${fmtSvg(encuadre.x)} ${fmtSvg(encuadre.y)} ${fmtSvg(encuadre.width)} ${fmtSvg(encuadre.height)}">`;
  return svg.replace(match[0], siguiente);
}

function fmtSvg(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, "");
}

function normalizarColoresSvg(svg: string): string {
  return svg.replace(/="rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)"/g, (_, r: string, g: string, b: string) => `="rgb(${r}, ${g}, ${b})"`);
}

function inyectarFondoBlanco(svg: string): string {
  const match = /<svg\b([^>]*)>/i.exec(svg);
  if (!match) return svg;
  const attrs = match[1] ?? "";
  const viewBox = parseViewBox(attrs);
  if (viewBox) {
    return svg.replace(match[0], `${match[0]}<rect x="${fmtSvg(viewBox.x)}" y="${fmtSvg(viewBox.y)}" width="${fmtSvg(viewBox.width)}" height="${fmtSvg(viewBox.height)}" fill="#ffffff"/>`);
  }
  const width = /width="([^"]+)"/.exec(attrs)?.[1] ?? "100%";
  const height = /height="([^"]+)"/.exec(attrs)?.[1] ?? "100%";
  return svg.replace(match[0], `${match[0]}<rect width="${width}" height="${height}" fill="#ffffff"/>`);
}

function parseViewBox(attrs: string): EncuadreSvg | null {
  const raw = /viewBox="([^"]+)"/i.exec(attrs)?.[1];
  if (!raw) return null;
  const partes = raw.trim().split(/[\s,]+/).map(Number);
  if (partes.length !== 4 || partes.some((valor) => !Number.isFinite(valor))) return null;
  return normalizarEncuadre({ x: partes[0]!, y: partes[1]!, width: partes[2]!, height: partes[3]! });
}

async function svgAPng(svg: string, fondo: "blanco" | "transparente"): Promise<Blob> {
  if (typeof document === "undefined" || typeof Image === "undefined") {
    return new Blob([svg], { type: "image/png" });
  }

  const svgBlob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);
  try {
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    const img = await cargarImagen(dataUrl)
      .catch(() => cargarImagen(url))
      .catch(() => null);
    if (!img) return pngFallback();
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, img.naturalWidth || img.width || 1600);
    canvas.height = Math.max(1, img.naturalHeight || img.height || 1200);
    const ctx = canvas.getContext("2d");
    if (!ctx) return new Blob([svg], { type: "image/png" });
    if (fondo === "blanco") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    return await canvasToBlob(canvas);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function cargarImagen(url: string, timeoutMs = 2000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timeout = window.setTimeout(() => reject(new Error("Timeout al rasterizar el SVG del mapa")), timeoutMs);
    img.onload = () => {
      window.clearTimeout(timeout);
      resolve(img);
    };
    img.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error("No se pudo rasterizar el SVG del mapa"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob ?? new Blob([], { type: "image/png" }));
    }, "image/png");
  });
}

async function pngFallback(): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvasToBlob(canvas);
}

function descargarBlob(blob: Blob, nombreArchivo: string): void {
  if (typeof document === "undefined") return;
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function crearZip(entradas: Array<{ nombre: string; blob: Blob }>): Promise<Blob> {
  const encoder = new TextEncoder();
  const locales: Uint8Array[] = [];
  const centrales: Uint8Array[] = [];
  let offset = 0;
  const fecha = fechaDos(new Date());

  for (const entrada of entradas) {
    const nombreBytes = encoder.encode(entrada.nombre);
    const datos = await blobToUint8Array(entrada.blob);
    const crc = crc32(datos);
    const comprimido = await deflateRaw(datos);
    const metodo = comprimido === datos ? 0 : 8;

    const local = new Uint8Array(30 + nombreBytes.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0, true);
    localView.setUint16(8, metodo, true);
    localView.setUint16(10, fecha.time, true);
    localView.setUint16(12, fecha.date, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, comprimido.byteLength, true);
    localView.setUint32(22, datos.byteLength, true);
    localView.setUint16(26, nombreBytes.length, true);
    local.set(nombreBytes, 30);
    locales.push(local, comprimido);

    const central = new Uint8Array(46 + nombreBytes.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, metodo, true);
    centralView.setUint16(12, fecha.time, true);
    centralView.setUint16(14, fecha.date, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, comprimido.byteLength, true);
    centralView.setUint32(24, datos.byteLength, true);
    centralView.setUint16(28, nombreBytes.length, true);
    centralView.setUint32(42, offset, true);
    central.set(nombreBytes, 46);
    centrales.push(central);

    offset += local.byteLength + comprimido.byteLength;
  }

  const centralOffset = offset;
  const centralSize = centrales.reduce((acc, item) => acc + item.byteLength, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, entradas.length, true);
  endView.setUint16(10, entradas.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, centralOffset, true);

  return new Blob([...locales, ...centrales, end].map(uint8ArrayAArrayBuffer), { type: "application/zip" });
}

async function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer());
}

async function deflateRaw(datos: Uint8Array): Promise<Uint8Array> {
  return datos;
}

function esperarFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function uint8ArrayAArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function fechaDos(fecha: Date): { time: number; date: number } {
  return {
    time: (fecha.getHours() << 11) | (fecha.getMinutes() << 5) | Math.floor(fecha.getSeconds() / 2),
    date: ((fecha.getFullYear() - 1980) << 9) | ((fecha.getMonth() + 1) << 5) | fecha.getDate(),
  };
}

const CRC_TABLE = crearTablaCrc32();

function crc32(datos: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of datos) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff]! ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function crearTablaCrc32(): Uint32Array {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
}

function slugArchivo(input: string): string {
  return input
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-CL")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "modelo";
}
