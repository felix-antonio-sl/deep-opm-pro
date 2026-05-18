import type { dia } from "jointjs";
import type { Modelo } from "../../modelo/tipos";

export type FormatoExport = "png" | "svg";

export interface OpcionesExport {
  formato: FormatoExport;
  nombreArchivo?: string;
  paddingPx?: number;
  fondo?: "blanco" | "transparente";
}

export interface OpcionesDescargaOpdSvg {
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
  if (opts.formato === "svg") {
    return new Blob([svg], { type: "image/svg+xml" });
  }
  return svgAPng(svg, opts.fondo ?? "blanco");
}

export async function descargarMapa(
  paper: dia.Paper,
  modelo: Modelo,
  opts: OpcionesExport,
): Promise<void> {
  const blob = await exportarMapa(paper, modelo, opts);
  if (typeof document === "undefined") return;
  const nombre = opts.nombreArchivo ?? nombreArchivoMapa(modelo, opts.formato);
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = nombre;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function descargarOpdActualSvg(
  paper: dia.Paper,
  modelo: Modelo,
  opdId: string,
  opts: OpcionesDescargaOpdSvg = {},
): Promise<void> {
  const opdNombre = modelo.opds[opdId]?.nombre ?? "OPD";
  await descargarMapa(paper, modelo, {
    formato: "svg",
    fondo: opts.fondo ?? "blanco",
    nombreArchivo: opts.nombreArchivo ?? nombreArchivoOpd(modelo, opdNombre),
  });
}

export function nombreArchivoMapa(modelo: Modelo, formato: FormatoExport, fecha = new Date()): string {
  const base = slugArchivo(modelo.nombre || "modelo");
  return `${base}-mapa-${fecha.toISOString().slice(0, 10)}.${formato}`;
}

export function nombreArchivoOpd(modelo: Modelo, opdNombre: string, fecha = new Date()): string {
  const modeloSlug = slugArchivo(modelo.nombre || "modelo");
  const opdSlug = slugArchivo(opdNombre || "opd");
  return `${modeloSlug}-${opdSlug}-${fecha.toISOString().slice(0, 10)}.svg`;
}

function obtenerSvgPaper(paper: dia.Paper, opts: OpcionesExport): string {
  const paperConEl = paper as unknown as { el?: Element };
  const svgDom = paperConEl.el?.querySelector?.("svg")?.outerHTML;
  if (svgDom?.includes("<svg")) return normalizarSvg(svgDom, opts);

  const paperConToSvg = paper as unknown as {
    toSVG?: (callback?: (svg: string) => void, options?: Record<string, unknown>) => string | void;
    el?: Element;
  };
  if (typeof paperConToSvg.toSVG === "function") {
    const directo = paperConToSvg.toSVG(undefined, { preserveDimensions: true, convertImagesToDataUris: true });
    if (typeof directo === "string" && directo.includes("<svg")) return normalizarSvg(directo, opts);
    let capturado = "";
    paperConToSvg.toSVG((svg) => {
      capturado = svg;
    }, { preserveDimensions: true, convertImagesToDataUris: true });
    if (capturado.includes("<svg")) return normalizarSvg(capturado, opts);
  }
  return normalizarSvg("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1\" height=\"1\"></svg>", opts);
}

function normalizarSvg(svg: string, opts: OpcionesExport): string {
  const fondo = opts.fondo ?? "blanco";
  if (svg.includes("xmlns=\"http://www.w3.org/2000/svg\"")) {
    return fondo === "blanco" ? inyectarFondoBlanco(svg) : svg;
  }
  const normalizado = svg.replace("<svg", "<svg xmlns=\"http://www.w3.org/2000/svg\"");
  return fondo === "blanco" ? inyectarFondoBlanco(normalizado) : normalizado;
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
    const img = await cargarImagen(url);
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

function cargarImagen(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo rasterizar el SVG del mapa"));
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

function slugArchivo(input: string): string {
  return input
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-CL")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "modelo";
}
