import type { ValorConcreto } from "../tipos";

function celda(valor: ValorConcreto | undefined): string {
  if (valor === undefined) return "";
  const texto = String(valor);
  return /[",\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

export function filasSimulacionACsv(
  filas: Array<Record<string, ValorConcreto | undefined>>,
  columnas: string[],
): string {
  const header = columnas.map(celda).join(",");
  const cuerpo = filas.map((fila) => columnas.map((c) => celda(fila[c])).join(",")).join("\n");
  return filas.length > 0 ? `${header}\n${cuerpo}` : header;
}
