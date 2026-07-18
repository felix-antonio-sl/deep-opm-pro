import type { Id, VersionResumen } from "../modelo/tipos";

export function aplicarPoliticaLogScaleVersiones(
  versiones: VersionResumen[],
  ahora = new Date(),
  maxTotal = 10,
  versionProtegidaId?: Id,
): VersionResumen[] {
  const limite = Math.max(1, maxTotal);
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
  const candidatasPorBucket = [
    ...buckets.dia.versiones.slice(0, buckets.dia.max),
    ...buckets.semana.versiones.slice(0, buckets.semana.max),
    ...buckets.mes.versiones.slice(0, buckets.mes.max),
    ...buckets.historico.versiones.slice(0, buckets.historico.max),
  ]
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  // La cuota regula solo versiones podables. Las preservadas son adicionales:
  // mantenerlas nunca reduce el cupo de la historia ordinaria.
  const cupoOrdinario = limite;
  const retenidasOrdinarias = candidatasPorBucket.slice(0, cupoOrdinario);
  const protegida = versionProtegidaId
    ? versiones.find((version) => version.id === versionProtegidaId)
    : undefined;
  if (protegida &&
    protegida.preservar !== true &&
    !retenidasOrdinarias.some((version) => version.id === protegida.id)) {
    if (cupoOrdinario > 0 && retenidasOrdinarias.length >= cupoOrdinario) {
      retenidasOrdinarias.pop();
    }
    // El hito que acaba de confirmar un commit no puede desaparecer dentro de
    // ese mismo commit: ocupa una plaza ordinaria desplazando la candidata
    // podable más antigua. Las preservadas se agregan fuera de esta cuota.
    retenidasOrdinarias.push(protegida);
  }
  // `preservar` es una promesa fuerte: esas versiones no consumen una plaza
  // podable y pueden hacer que el total supere `maxTotal`.
  return [...preservadas, ...retenidasOrdinarias]
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
}

export function idsVersionesPodadas(versionesAntes: VersionResumen[], versionesDespues: VersionResumen[]): Id[] {
  const retenidas = new Set(versionesDespues.map((version) => version.id));
  return versionesAntes.filter((version) => !retenidas.has(version.id)).map((version) => version.id);
}
