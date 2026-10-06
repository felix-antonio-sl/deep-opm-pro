import { h } from 'preact';
import type { VNode, Attributes } from 'preact';
import type { NodoSvg } from '../opd/dibujo';
/** Adaptación del único árbol canónico. Los textos se entregan como texto, nunca HTML. */
export function convertirSvg(n: NodoSvg, atributos?: (ref: string) => Record<string, unknown>): VNode<Attributes & Record<string, unknown>> {
    const ref = n.a['data-ref'];
    return h<Record<string, unknown>>(n.t, { ...n.a, ...(typeof ref === 'string' && atributos ? atributos(ref) : {}), ...(n.k ? { key: n.k } : {}) },
        (n.h ?? []).map(x => typeof x === 'string' ? x : convertirSvg(x, atributos)));
}
export function SvgPreact(p: { dibujo: NodoSvg; atributos?: (ref: string) => Record<string, unknown> }) { return convertirSvg(p.dibujo, p.atributos); }
