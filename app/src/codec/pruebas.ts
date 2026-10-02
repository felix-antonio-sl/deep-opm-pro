// Documentos de prueba v0, sin reglas ni funciones de producción.
export type Raw = Record<string, any>;
export const entidad = (id: string, tipo = 'objeto', extra: Raw = {}): Raw => ({ id, tipo, nombre: id, esencia: 'informacional', afiliacion: 'sistemica', ...extra });
export const extremo = (id: string, kind = 'entidad') => ({ kind, id });
export const enlace = (id: string, tipo: string, origen: string, destino: string, extra: Raw = {}): Raw => ({ id, tipo, origenId: extremo(origen), destinoId: extremo(destino), etiqueta: '', ...extra });
export const apariencia = (entidadId: string, opdId = 'opd-1', extra: Raw = {}): Raw => ({ id: `a-${opdId}-${entidadId}`, entidadId, opdId, x: 0, y: 0, width: 135, height: 60, ...extra });
export function documento(entidades: Raw[] = [], enlaces: Raw[] = [], estados: Raw[] = []): Raw {
  return { formato: 'deep-opm-pro.modelo.v0', modelo: { id: 'm-test', nombre: 'Códec', unidadTiempo: 'min', opdRaizId: 'opd-1', nextSeq: 1000,
    entidades: Object.fromEntries(entidades.map(e => [e.id, e])), estados: Object.fromEntries(estados.map(e => [e.id, e])),
    enlaces: Object.fromEntries(enlaces.map(e => [e.id, e])), abanicos: {},
    opds: { 'opd-1': { id: 'opd-1', nombre: 'SD', padreId: null,
      apariencias: Object.fromEntries(entidades.map(e => { const a = apariencia(e.id); return [a.id, a]; })),
      enlaces: Object.fromEntries(enlaces.map(e => [`ae-${e.id}`, { id: `ae-${e.id}`, enlaceId: e.id, opdId: 'opd-1', vertices: [] }])) } },
  } };
}
export function refinado(enlaces: Raw[] = []): Raw {
  const d = documento([entidad('o-1'), entidad('p-2', 'proceso', { refinamientos: { descomposicion: { opdId: 'opd-3' } } }), entidad('p-4', 'proceso'), entidad('p-5', 'proceso')], enlaces);
  delete d.modelo.opds['opd-1'].apariencias['a-opd-1-p-4']; delete d.modelo.opds['opd-1'].apariencias['a-opd-1-p-5'];
  d.modelo.opds['opd-3'] = { id: 'opd-3', nombre: 'SD1', padreId: 'opd-1', ordenLocal: 0, ordenInzoom: [['p-4'], ['p-5']],
    apariencias: Object.fromEntries(['o-1', 'p-2', 'p-4', 'p-5'].map(id => { const a = apariencia(id, 'opd-3', { y: id === 'p-4' ? 100 : 200, contextoRefinamiento: { tipo: 'descomposicion', refinableEntidadId: 'p-2', rol: id === 'p-2' ? 'contorno' : id === 'o-1' ? 'externo' : 'interno' } }); return [a.id, a]; })), enlaces: {},
  };
  return d;
}
