import type { dia } from "jointjs";
import { dia as jointDia } from "jointjs";
import type { Modelo } from "../../modelo/tipos";
import { ordenarOpdsParaOpl } from "../../opl/bloquesJerarquicos";
import { embedirContorno } from "./handlers/drag";
import { dimensionesPaper, setPaperDimensions } from "./handlers/helpers";
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
    setPaperDimensions(paper, dimensionesPaper(cells as dia.Cell.JSON[]));
    embedirContorno(graph);
    aplicarRuteoOpcloudEnlaces(graph);
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
  const dimensiones = dimensionesElementoPaper(paperConEl.el);
  const svgElement = paperConEl.el?.querySelector?.("svg");
  const svgDom = svgElement ? serializarSvg(svgElement) : "";
  if (svgDom?.includes("<svg")) return normalizarSvg(svgDom, opts, dimensiones);

  const paperConToSvg = paper as unknown as {
    toSVG?: (callback?: (svg: string) => void, options?: Record<string, unknown>) => string | void;
    el?: Element;
  };
  if (typeof paperConToSvg.toSVG === "function") {
    const directo = paperConToSvg.toSVG(undefined, { preserveDimensions: true, convertImagesToDataUris: true });
    if (typeof directo === "string" && directo.includes("<svg")) return normalizarSvg(directo, opts, dimensiones);
    let capturado = "";
    paperConToSvg.toSVG((svg) => {
      capturado = svg;
    }, { preserveDimensions: true, convertImagesToDataUris: true });
    if (capturado.includes("<svg")) return normalizarSvg(capturado, opts, dimensiones);
  }
  return normalizarSvg("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1\" height=\"1\"></svg>", opts);
}

function serializarSvg(svgElement: Element): string {
  if (typeof XMLSerializer !== "undefined") {
    return new XMLSerializer().serializeToString(svgElement);
  }
  return (svgElement as HTMLElement).outerHTML;
}

function normalizarSvg(svg: string, opts: OpcionesExport, dimensiones?: { width: number; height: number }): string {
  const fondo = opts.fondo ?? "blanco";
  const conXmlns = svg.includes("xmlns=\"http://www.w3.org/2000/svg\"")
    ? svg
    : svg.replace("<svg", "<svg xmlns=\"http://www.w3.org/2000/svg\"");
  const normalizado = normalizarColoresSvg(dimensiones ? fijarDimensionesSvg(conXmlns, dimensiones) : conXmlns);
  return fondo === "blanco" ? inyectarFondoBlanco(normalizado) : normalizado;
}

function dimensionesElementoPaper(el?: Element): { width: number; height: number } | undefined {
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

function fijarDimensionesSvg(svg: string, dimensiones: { width: number; height: number }): string {
  const match = /<svg\b([^>]*)>/i.exec(svg);
  if (!match) return svg;
  const attrs = match[1] ?? "";
  const sinDimensiones = attrs
    .replace(/\swidth="[^"]*"/i, "")
    .replace(/\sheight="[^"]*"/i, "")
    .replace(/\sviewBox="[^"]*"/i, "");
  const siguiente = `<svg${sinDimensiones} width="${dimensiones.width}" height="${dimensiones.height}" viewBox="0 0 ${dimensiones.width} ${dimensiones.height}">`;
  return svg.replace(match[0], siguiente);
}

function normalizarColoresSvg(svg: string): string {
  return svg.replace(/="rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)"/g, (_, r: string, g: string, b: string) => `="rgb(${r}, ${g}, ${b})"`);
}

function inyectarFondoBlanco(svg: string): string {
  const match = /<svg\b([^>]*)>/i.exec(svg);
  if (!match) return svg;
  const attrs = match[1] ?? "";
  const width = /width="([^"]+)"/.exec(attrs)?.[1] ?? "100%";
  const height = /height="([^"]+)"/.exec(attrs)?.[1] ?? "100%";
  return svg.replace(match[0], `${match[0]}<rect width="${width}" height="${height}" fill="#ffffff"/>`);
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
