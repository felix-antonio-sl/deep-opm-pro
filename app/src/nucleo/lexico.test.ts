import { test, expect, afterEach } from 'bun:test';
import { validarNombreCosa, validarNombreEstado, validarEtiqueta, sugerirNombre, conjuncionY, conjuncionO } from './lexico';
import { modeloCon } from '../pruebas/constructores';
import { validarForma } from './forma';
const m = modeloCon({ objetos: [['Alfa', []]] });
afterEach(() => expect(validarForma(m)).toEqual([]));
test('T-025 EBNF nombres: letras españolas, dígitos internos, espacios exactos', () => {
    for (const s of ['Árbol', 'Ñandú Uno_2', 'Ünico-1', 'Alfa uno'])
        expect(validarNombreCosa(s)).toBeNull();
    for (const s of ['alfa', ' Alfa', 'Alfa ', 'Alfa  Uno', '2Alfa', 'Alfa Uno!'])
        expect(validarNombreCosa(s)).not.toBeNull();
    for (const s of ['listo', 'á1', 'ñandú_2'])
        expect(validarNombreEstado(s)).toBeNull();
    for (const s of ['Listo', 'muy listo', '2listo'])
        expect(validarNombreEstado(s)).not.toBeNull();
    expect(validarEtiqueta('relaciona')).toBeNull();
    expect(validarEtiqueta('')).not.toBeNull();
});
test('T-025 sugerencia normaliza solo al solicitar y evita colisiones', () => { expect(sugerirNombre(m, ' alfa ', 'cosa')).toBe('Alfa-2'); expect(sugerirNombre(m, '2 extraño!', 'cosa')).toBe('Extraño'); expect(sugerirNombre(m, 'Muy Listo', 'estado')).toBe('muy-listo'); });
test('T-025 alomorfos y/e, o/u dependen del inicio de la palabra siguiente', () => {
    for (const s of ['Irene', 'Hijo', 'Índice', 'Hígado'])
        expect(conjuncionY(s)).toBe('e');
    for (const s of ['Hielo', 'Hierro', 'Yodo'])
        expect(conjuncionY(s)).toBe('y');
    for (const s of ['Otro', 'Hombre', 'Órbita'])
        expect(conjuncionO(s)).toBe('u');
    expect(conjuncionO('Alfa')).toBe('o');
});
test('T-266 etiqueta de relación es frase no capitalizada y nunca se autocorrige', () => { for (const nombre of ['Relaciona', 'Árbol relaciona']) {
    const r = validarEtiqueta(nombre);
    expect(r).not.toBeNull();
    expect(r?.codigo).toBe('lexico');
} for (const nombre of ['relaciona', 'árbol relaciona', 'tiene Parte'])
    expect(validarEtiqueta(nombre)).toBeNull(); });
