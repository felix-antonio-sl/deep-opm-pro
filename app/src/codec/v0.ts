import type { Modelo, Id, UnidadTiempo, Enlace } from '../nucleo/tipos';
import { extremos } from '../nucleo/tipos';
import { indice } from '../nucleo/indice';
import { proyectar } from '../nucleo/proyeccion';
// Representación de frontera: los valores se validan antes de construir el Modelo tipado.
export type Registro = Record<string, unknown>;
export const registro = (v: unknown): Registro => v !== null && typeof v === 'object' && !Array.isArray(v) ? v as Registro : {};
export const esRegistro = (v: unknown): v is Registro => v !== null && typeof v === 'object' && !Array.isArray(v);
export const texto = (v: unknown, fallback = ''): string => typeof v === 'string' ? v : fallback;
const colacionNatural = new Intl.Collator('en', { numeric: true });
export const natural = (a: string, b: string): number => colacionNatural.compare(a, b) || (a < b ? -1 : a > b ? 1 : 0);
export const ordenar = <T>(r: Readonly<Record<Id, T>>): Record<Id,T> => Object.fromEntries(Object.entries(r).sort(([a],[b]) => natural(a,b)));
export const unidades: readonly UnidadTiempo[] = ['ms','sec','min','hour','day','week','month','year'];
export const unidad = (v: unknown): UnidadTiempo | undefined => {
  const aliases: Record<string, UnidadTiempo> = { ms:'ms',sec:'sec',s:'sec',seg:'sec',segundo:'sec',segundos:'sec',min:'min',minuto:'min',minutos:'min',hour:'hour',h:'hour',hora:'hour',horas:'hour',day:'day',dia:'day',día:'day',dias:'day',días:'day',week:'week',sem:'week',semana:'week',semanas:'week',month:'month',mes:'month',meses:'month',year:'year',año:'year',años:'year' };
  return typeof v === 'string' ? aliases[v] : undefined;
};
export const unidadV0: Record<UnidadTiempo,string> = { ms:'ms',sec:'s',min:'min',hour:'h',day:'dia',week:'sem',month:'mes',year:'año' };
export function opdAbanico(m: Modelo, id: Id): Id {
  const idx = indice(m);
  for (const opd of idx.preorden) if (proyectar(m,opd).abanicos.some(f => f.abanico === id)) return opd;
  const f = m.abanicos[id];
  for (const opd of idx.preorden) if (proyectar(m,opd).enlaces.some(v => v.hechos.some(e => f?.enlaces.includes(e)))) return opd;
  return m.raiz;
}
export function puertoComun(es: readonly Enlace[]): { entidadId: Id; lado: 'origen'|'destino' } | undefined {
  const first = es[0]; if (!first) return undefined;
  const x = extremos(first);
  if (es.every(e => extremos(e).origen === x.origen)) return { entidadId:x.origen,lado:'origen' };
  if (es.every(e => extremos(e).destino === x.destino)) return { entidadId:x.destino,lado:'destino' };
  return undefined;
}
