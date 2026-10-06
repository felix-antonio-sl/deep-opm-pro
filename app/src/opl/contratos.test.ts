import { test, expect } from 'bun:test';
import { modeloCon } from '../pruebas/constructores';
import type { Modelo, Id, EnlaceNuevo } from '../nucleo/tipos';
import type { LineaOpl, OpcionesOpl } from './linea';
import type { Respuesta } from '../nucleo/resultado';
import type { Plan } from './planificar';
import * as generar from './generar';
import * as documento from './documento';
test('T-100 contratos OPL conservan las seis firmas y verifican su comportamiento', () => {
    const bloque: (m: Modelo, opd: Id, o?: OpcionesOpl) => readonly LineaOpl[] = generar.generarBloque;
    const modelo: (m: Modelo, o?: OpcionesOpl) => readonly LineaOpl[] = generar.generarModelo;
    const texto: (ls: readonly LineaOpl[]) => string = generar.textoCanonico;
    const previa: (m: Modelo, opd: Id, c: EnlaceNuevo) => LineaOpl | null = generar.lineaDeEnlace;
    const doc: (m: Modelo) => string = documento.generarDocumentoOpl;
    const importar: (nombre: string, texto: string) => Respuesta<{
        modelo: Modelo;
        plan: Plan;
    }> = documento.importarOpl;
    const m = modeloCon();
    for (const f of [bloque, modelo, texto, previa, doc, importar])
        expect(typeof f).toBe('function');
    expect(bloque(m, m.raiz)).toEqual([]);
    expect(modelo(m).map(l => [l.texto, l.opd, l.etiquetaOpd, l.profundidad, l.soloDisplay, l.hechos]))
        .toEqual([['## SD', 'opd-1', 'SD', 0, true, []]]);
    expect(texto([])).toBe('');
    expect(previa(m, m.raiz, { tipo: 'consumo', objeto: 'o-2', proceso: 'p-3' })).toBeNull();
    expect(doc(m).split('\n').filter(linea => linea !== '')).toEqual(['# Prueba', '## SD']);
    expect(importar('Prueba', '')).toMatchObject({ok:true,valor:{modelo:{nombre:'Prueba',cosas:{},enlaces:{},abanicos:{},secuencia:2},plan:{acciones:[],resumen:{total:1,ignoradas:1,noAplicables:0}}}});
});
