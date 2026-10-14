import { h } from 'preact';
import { useMemo, useRef } from 'preact/hooks';
import type { VNode, Attributes } from 'preact';
import type { NodoSvg } from '../opd/dibujo';
/** Adaptación del único árbol canónico. Los textos se entregan como texto, nunca HTML. */
export function convertirSvg(n: NodoSvg, atributos?: (ref: string) => Record<string, unknown>): VNode<Attributes & Record<string, unknown>> {
    const ref = n.a['data-ref'];
    return h<Record<string, unknown>>(n.t, { ...n.a, ...(typeof ref === 'string' && atributos ? atributos(ref) : {}), ...(n.k ? { key: n.k } : {}) },
        (n.h ?? []).map(x => typeof x === 'string' ? x : convertirSvg(x, atributos)));
}
/** Reutiliza la tinta idéntica por referencia. Sólo conserva el último dibujo de esta instancia. */
export function crearAdaptadorSvg() {
    type Entrada = { firma: string; vnode: ReturnType<typeof convertirSvg> };
    let anteriores = new Map<string, Entrada>(), ultimo: Parameters<typeof convertirSvg>[1];
    return (dibujo: NodoSvg, atributos?: Parameters<typeof convertirSvg>[1]) => {
        const actuales = new Map<string, Entrada>();
        function convertir(n: NodoSvg): ReturnType<typeof convertirSvg> {
            const firma = n.k ? JSON.stringify(n) : '', previo = n.k && atributos === ultimo ? anteriores.get(n.k) : undefined;
            if (previo?.firma === firma) { actuales.set(n.k!, previo); return previo.vnode; }
            const ref = n.a['data-ref'];
            const vnode = h<Record<string, unknown>>(n.t, { ...n.a, ...(typeof ref === 'string' && atributos ? atributos(ref) : {}), ...(n.k ? { key: n.k } : {}) },
                (n.h ?? []).map(x => typeof x === 'string' ? x : convertir(x)));
            if (n.k) actuales.set(n.k, { firma, vnode });
            return vnode;
        }
        const vnode = convertir(dibujo); anteriores = actuales; ultimo = atributos; return vnode;
    };
}
export function SvgPreact(p: { dibujo: NodoSvg; atributos?: (ref: string) => Record<string, unknown> }) {
    const adaptar = useRef<ReturnType<typeof crearAdaptadorSvg>>();
    adaptar.current ??= crearAdaptadorSvg();
    return useMemo(() => adaptar.current!(p.dibujo, p.atributos), [p.dibujo, p.atributos]);
}
