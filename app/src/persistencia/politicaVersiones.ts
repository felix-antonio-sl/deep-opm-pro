import type { Id, VersionResumen } from "../modelo/tipos";

export function aplicarPoliticaLogScaleVersiones(
  versiones: VersionResumen[],
  ahora = new Date(),
  maxTotal = 10,
): VersionResumen[] {
  const preservadas = versiones.filter((version) => version.preservar);
  const candidatas = versiones
    .filter((version) => !version.preservar && Number.isFinite(Date.parse(version.creadoEn)))
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  const buckets: Record<"dia" | "semana" | "mes" | "historico", { max: number; versiones: VersionResumen[] }> = {
    dia: { max: 10, versiones: [] },
    semana: { max: 7, versiones: [] },
    mes: { max: 4, versiones: [] },
    historico: { max: 1, versiones: [] },
  };
  for (const version of candidatas) {
    const edadDias = (ahora.getTime() - Date.parse(version.creadoEn)) / (24 * 60 * 60 * 1000);
    if (edadDias <= 1) buckets.dia.versiones.push(version);
    else if (edadDias <= 7) buckets.semana.versiones.push(version);
    else if (edadDias <= 30) buckets.mes.versiones.push(version);
    else buckets.historico.versiones.push(version);
  }
  return [
    ...preservadas,
    ...buckets.dia.versiones.slice(0, buckets.dia.max),
    ...buckets.semana.versiones.slice(0, buckets.semana.max),
    ...buckets.mes.versiones.slice(0, buckets.mes.max),
    ...buckets.historico.versiones.slice(0, buckets.historico.max),
  ]
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
    .slice(0, Math.max(1, maxTotal));
}

export function idsVersionesPodadas(versionesAntes: VersionResumen[], versionesDespues: VersionResumen[]): Id[] {
  const retenidas = new Set(versionesDespues.map((version) => version.id));
  return versionesAntes.filter((version) => !retenidas.has(version.id)).map((version) => version.id);
}
