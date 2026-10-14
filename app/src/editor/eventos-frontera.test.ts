import { expect, test } from 'bun:test';
import { crearEditor } from './estado';
import { configuracion, dependencias, ciclos } from './pruebas.test';
import { must, porNombre } from '../pruebas/constructores';
import { descomponer } from '../nucleo/refinamiento';
import { crearEnlace } from '../nucleo/enlaces';
import { traerCosa } from '../nucleo/cosas';
import { exportarV0 } from '../codec/exportar';

test('T-060 T-011 evento exterior rechazado conserva selección, modelo e historial; condición legal tiene un solo deshacer', async () => {
    const d = dependencias();
    const refinado = must(descomponer(d.m, { opd: d.m.raiz, cosa: 'p-5', bandas: [['Inspeccionar'], ['Aceptar']] }));
    const hijo = refinado.creados[0]!, interno = porNombre(refinado.modelo, 'Inspeccionar').id;
    const visible = must(traerCosa(refinado.modelo, { opd: hijo, cosa: 'o-2', x: -220, y: 70 }));
    const creado = must(crearEnlace(visible.modelo, { opd: hijo, candidato: { tipo: 'instrumento', objeto: 'o-2', proceso: interno } }));
    const enlace = creado.creados[0]!; d.documento(exportarV0(creado.modelo));
    const ed = crearEditor(configuracion(d));
    try {
        await ed.abrir(d.m.id); ed.navegar(hijo);
        ed.seleccionar({ cosas: [], estados: [], enlaces: [enlace], abanicos: [] });
        const antes = ed.obtener(), texto = exportarV0(antes.modelo!);
        const rechazo = ed.ejecutar({ op: 'fijarControl', args: { enlace, control: 'e' } });
        expect(rechazo.ok).toBe(false); if (!rechazo.ok) expect(rechazo.rechazo.regla).toBe('R-CX-DIST-2');
        expect(ed.obtener().modelo).toBe(antes.modelo); expect(exportarV0(ed.obtener().modelo!)).toBe(texto);
        expect(ed.obtener().seleccion).toEqual(antes.seleccion); expect(ed.obtener().pasado).toEqual(antes.pasado);
        expect(ed.obtener().futuro).toEqual(antes.futuro); expect(ed.obtener().franja).toMatchObject({ tipo: 'rechazo', regla: 'R-CX-DIST-2' });
        expect(ed.ejecutar({ op: 'fijarControl', args: { enlace, control: 'c' } }).ok).toBe(true);
        expect(ed.obtener().pasado).toHaveLength(1); expect(ed.obtener().modelo!.enlaces[enlace]).toMatchObject({ id: enlace, control: 'c' });
        ed.deshacer(); expect(ed.obtener().modelo).toBe(antes.modelo); expect(exportarV0(ed.obtener().modelo!)).toBe(texto);
    } finally { ed.cerrar(); await ciclos(); }
});
