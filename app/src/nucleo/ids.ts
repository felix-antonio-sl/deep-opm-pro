import type { Id } from './tipos';
export const ID_ELEMENTO = /^[A-Za-z0-9._:~-]{1,80}$/;
export const ID_MODELO = /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/;
export function idModelo(): Id { const bytes = crypto.getRandomValues(new Uint8Array(6)); return 'm-' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join(''); }
export function sufijoId(id: Id): number { const n = /-(\d+)$/.exec(id)?.[1]; return n === undefined ? 0 : Number(n); }
