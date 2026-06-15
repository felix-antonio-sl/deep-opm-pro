// Render headless del modelo a imágenes por OPD para un consumidor agente
// (H1, upstream hd-opm). Se monta en `window.__opmRenderHeadless__` SOLO bajo el
// flag `VITE_HEADLESS_RENDER` (ver main.tsx) — superficie cero en producción por
// DCE. La cadena de export (proyección + embed + ruteo + ajuste) es idéntica a la
// del canvas: el render es FIEL a lo que opforja muestra, no una aproximación.
// La herramienta es read-through: nunca escribe de vuelta al modelo ni al dominio.
import { ordenarOpdsParaOpl } from "../../opl/bloquesJerarquicos";
import { hidratarModelo } from "../../serializacion/json";
import { exportarOpdOffscreenSvgPng } from "./mapaExport";

export interface OpdRenderizado {
  opdId: string;
  nombre: string;
  /** Posición 1-based en el orden BFS canónico (`ordenarOpdsParaOpl`). */
  orden: number;
  svg: string;
  /** PNG rasterizado, codificado en base64 (sin prefijo data:). */
  pngBase64: string;
}

export interface ResultadoRenderHeadless {
  ok: boolean;
  error?: string;
  opds: OpdRenderizado[];
}

export interface OpcionesRenderHeadless {
  fondo?: "blanco" | "transparente";
}

async function blobABase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binario = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binario += String.fromCharCode(bytes[i]!);
  }
  return typeof btoa === "function" ? btoa(binario) : "";
}

/**
 * Hidrata el JSON del modelo y renderiza cada OPD (orden BFS) a SVG + PNG.
 * Devuelve `{ ok: false, error: "render-sin-DOM" }` fuera del navegador.
 */
export async function renderModeloHeadless(
  modeloJson: string,
  opts: OpcionesRenderHeadless = {},
): Promise<ResultadoRenderHeadless> {
  const hidratado = hidratarModelo(modeloJson);
  if (!hidratado.ok) {
    return { ok: false, error: hidratado.error, opds: [] };
  }
  if (typeof document === "undefined") {
    return { ok: false, error: "render-sin-DOM", opds: [] };
  }
  // Fidelidad: JointJS dimensiona shapes y calcula el bbox midiendo texto en el
  // DOM. Sin las fuentes Inria cargadas, el navegador mediría con un fallback y
  // el encuadre/wrapping divergirían de lo que ve el humano en opforja.
  await document.fonts?.ready;
  const modelo = hidratado.value;
  const ids = ordenarOpdsParaOpl(modelo);
  const opds: OpdRenderizado[] = [];
  for (let i = 0; i < ids.length; i += 1) {
    const opdId = ids[i]!;
    const res = await exportarOpdOffscreenSvgPng(modelo, opdId, opts);
    if (!res) {
      return { ok: false, error: "render-sin-DOM", opds };
    }
    opds.push({
      opdId,
      nombre: modelo.opds[opdId]?.nombre ?? opdId,
      orden: i + 1,
      svg: res.svg,
      pngBase64: await blobABase64(res.png),
    });
  }
  return { ok: true, opds };
}

/** Expone el render headless en `window` para que Playwright lo invoque vía evaluate. */
export function montarHeadlessRender(): void {
  (globalThis as { __opmRenderHeadless__?: typeof renderModeloHeadless }).__opmRenderHeadless__ = renderModeloHeadless;
}

/** Forma mínima que necesita {@link seleccionarOpds} de cada OPD renderizado. */
export interface OpdSeleccionable {
  opdId: string;
}

/** Resultado de filtrar los OPDs renderizados por `--solo-opd`. */
export interface SeleccionOpds<T extends OpdSeleccionable> {
  /** OPDs que pasan el filtro (todos si no hubo `--solo-opd`). */
  seleccion: T[];
  /** Mensaje de error cuando `--solo-opd` no resuelve ningún OPD (H1H2-04). */
  error?: string;
}

/**
 * Filtra los OPDs renderizados por `--solo-opd`. Si se pidió un OPD inexistente,
 * la selección queda vacía y se devuelve un `error` enumerando los OPDs
 * disponibles, para que el CLI deje rastro en `error.txt` en vez de un no-op
 * silencioso (exit 0 con índice vacío) — H1H2-04.
 */
export function seleccionarOpds<T extends OpdSeleccionable>(
  opds: T[],
  soloOpd?: string,
): SeleccionOpds<T> {
  if (!soloOpd) return { seleccion: opds };
  const seleccion = opds.filter((o) => o.opdId === soloOpd);
  if (seleccion.length === 0) {
    const disponibles = opds.map((o) => o.opdId).join(", ") || "(ninguno)";
    return { seleccion, error: `OPD ${soloOpd} no existe; disponibles: ${disponibles}` };
  }
  return { seleccion };
}
