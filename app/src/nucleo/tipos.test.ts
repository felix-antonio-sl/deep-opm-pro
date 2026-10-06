import { test, expect } from 'bun:test';
import { esProcedimental, extremos } from './tipos';
import type { Cosa, Enlace, EnlaceNuevo, EnlaceDe, Excepcion } from './tipos';
import type { CodigoDiagnostico } from './diagnostico';
// Sonda compilada: las ausencias son restricciones de tipo, no validadores UI.
function comprobarFirmas(): void {
    // @ts-expect-error Proceso no tiene estados.
    const proceso: Cosa = { id: 'p-1', tipo: 'proceso', nombre: 'Procesar', esencia: 'informacional', afiliacion: 'sistemica', estados: [] };
    // @ts-expect-error Resultado nunca tiene control.
    const resultado: Enlace = { id: 'e-1', tipo: 'resultado', objeto: 'o-1', proceso: 'p-1', control: 'e' };
    // @ts-expect-error Las menciones de alcance del gate no son códigos del catálogo cerrado.
    const codigo: CodigoDiagnostico = 'alcance {opd}';
    const excepcion: Excepcion = { id: 'e-1', tipo: 'excepcionSobretiempo', origen: 'p-1', destino: 'p-2' };
    // @ts-expect-error Conserva limitación de Extract del contrato: selección por literal individual = never.
    const individual: EnlaceDe<'excepcionSobretiempo'> = excepcion;
    // @ts-expect-error T-012 sólo objeto o proceso; no tipo visual tercero.
    const tercero: Cosa = { id: 'x', tipo: 'atributo', nombre: 'Peso', esencia: 'informacional', afiliacion: 'sistemica' };
    // @ts-expect-error T-026 enlace binario requiere el proceso destino.
    const incompleto: EnlaceNuevo = { tipo: 'consumo', objeto: 'o' };
    // @ts-expect-error T-026 no hay lista de destinos como extremo nuclear.
    const hiper: EnlaceNuevo = { tipo: 'consumo', objeto: 'o', proceso: ['p', 'q'] };
    // @ts-expect-error T-027 e y c son un único modificador, no una lista.
    const controles: EnlaceNuevo = { tipo: 'consumo', objeto: 'o', proceso: 'p', control: ['e', 'c'] };
    // @ts-expect-error T-027 no se admite un segundo modificador persistido.
    const doble: EnlaceNuevo = { tipo: 'consumo', objeto: 'o', proceso: 'p', control: 'e', condicion: 'c' };
    void tercero; void incompleto; void hiper; void controles; void doble;
    void proceso;
    void resultado;
    void codigo;
    void individual;
}
void comprobarFirmas;
test('T-022 extremos de las seis familias conservan dirección v0, con y sin id', () => {
    const pares: readonly (readonly [
        EnlaceNuevo,
        string,
        string
    ])[] = [
        [{ tipo: 'consumo', objeto: 'o', proceso: 'p' }, 'o', 'p'], [{ tipo: 'resultado', objeto: 'o', proceso: 'p' }, 'p', 'o'], [{ tipo: 'efecto', objeto: 'o', proceso: 'p' }, 'p', 'o'], [{ tipo: 'agregacion', refinable: 'a', refinador: 'b' }, 'a', 'b'], [{ tipo: 'invocacion', origen: 'a', destino: 'b' }, 'a', 'b'], [{ tipo: 'excepcionSubtiempo', origen: 'a', destino: 'b' }, 'a', 'b'], [{ tipo: 'etiquetado', origen: 'a', destino: 'b' }, 'a', 'b']
    ];
    for (const [e, origen, destino] of pares) {
        expect(extremos(e)).toEqual({ origen, destino });
        expect(extremos({ ...e, id: 'e-1' })).toEqual({ origen, destino });
    }
    expect(esProcedimental(pares[0]![0])).toBe(true);
    expect(esProcedimental(pares[3]![0])).toBe(false);
});
