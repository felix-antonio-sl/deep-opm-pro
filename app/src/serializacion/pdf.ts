import { calcularMetricasComplejidad } from "../modelo/metricasComplejidad";
import type { Modelo } from "../modelo/tipos";

export function exportarModeloPdf(modelo: Modelo): Blob {
  const metricas = calcularMetricasComplejidad(modelo);
  const lineas = [
    modelo.nombre,
    `Entidades: ${metricas.entidades}`,
    `Enlaces: ${metricas.enlaces}`,
    `OPDs: ${metricas.opds}`,
  ];
  return new Blob([pdfMinimo(lineas)], { type: "application/pdf" });
}

function pdfMinimo(lineas: string[]): string {
  const texto = lineas.map(escaparTextoPdf).join(") Tj T* (");
  const stream = `BT /F1 12 Tf 50 780 Td (${texto}) Tj ET`;
  const objetos = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let i = 0; i < objetos.length; i += 1) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objetos[i]}\nendobj\n`;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return pdf;
}

function escaparTextoPdf(texto: string): string {
  return texto.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
