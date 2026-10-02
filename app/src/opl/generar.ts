import type { Modelo, Id, EnlaceNuevo } from '../nucleo/tipos';
import type { OpcionesOpl, LineaOpl } from './linea';
export function generarBloque(m: Modelo, opd: Id, o?: OpcionesOpl): readonly LineaOpl[] { throw new Error('pendiente: WP-7'); }
export function generarModelo(m: Modelo, o?: OpcionesOpl): readonly LineaOpl[] { throw new Error('pendiente: WP-7'); }
export function textoCanonico(lineas: readonly LineaOpl[]): string { throw new Error('pendiente: WP-7'); }
export function lineaDeEnlace(m: Modelo, opd: Id, candidato: EnlaceNuevo): LineaOpl | null { throw new Error('pendiente: WP-7'); }
