import type { Id } from '../nucleo/tipos';
export interface AlmacenLocal {
    leer(id: Id): Promise<{
        base: string | null;
        texto: string;
        fecha: number;
    } | null>;
    escribir(id: Id, b: {
        base: string | null;
        texto: string;
        fecha: number;
    }): Promise<void>;
    borrar(id: Id): Promise<void>;
    ids(): Promise<readonly Id[]>; // la Biblioteca marca «cambios sin subir» (CC-15)
}
export function crearAlmacenLocal(o: { indexedDB?: IDBFactory | null; nombre?: string } = {}): AlmacenLocal {
    const memoria = new Map<Id, { base: string | null; texto: string; fecha: number }>();
    const fabrica = o.indexedDB === undefined ? globalThis.indexedDB : o.indexedDB;
    let fallo = !fabrica;
    const abrir = new Promise<IDBDatabase | null>(resolver => {
        if (!fabrica) return resolver(null);
        try {
            const r = fabrica.open(o.nombre ?? 'opforja', 1);
            r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains('borradores')) r.result.createObjectStore('borradores'); };
            r.onsuccess = () => resolver(r.result);
            r.onerror = r.onblocked = () => { fallo = true; resolver(null); };
        } catch { fallo = true; resolver(null); }
    });
    async function transaccion<T>(modo: IDBTransactionMode, hacer: (s: IDBObjectStore) => IDBRequest<T>): Promise<T | undefined> {
        const db = await abrir;
        if (!db || fallo) return undefined;
        return new Promise(resolver => {
            try { const tx = db.transaction('borradores', modo), r = hacer(tx.objectStore('borradores')); let valor: T;
                r.onsuccess = () => { valor = r.result; };
                tx.oncomplete = () => resolver(valor);
                tx.onerror = tx.onabort = () => { fallo = true; resolver(undefined); };
            } catch { fallo = true; resolver(undefined); }
        });
    }
    return {
        async leer(id) { const b = await transaccion('readonly', s => s.get(id)); return b ? { ...b } : memoria.has(id) ? { ...memoria.get(id)! } : null; },
        async escribir(id, b) { memoria.set(id, { ...b }); await transaccion('readwrite', s => s.put({ ...b }, id)); },
        async borrar(id) { memoria.delete(id); await transaccion('readwrite', s => s.delete(id)); },
        async ids() { const ids = await transaccion('readonly', s => s.getAllKeys()); return [...new Set([...(ids ?? []).map(String), ...memoria.keys()])]; },
    };
}
