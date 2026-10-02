import { expect, test } from 'bun:test';
import * as t from './tokens';
test('T-203 tokens semánticos preservan la paleta de DESIGN sin crimson UI', () => {
  expect(t.COLORES).toEqual({ paper: '#fafaf8', paperWarm: '#eeece2', ink: '#171511', inkMid: '#5a564c', inkSoft: '#807b6e', opmObjeto: '#27613f', opmProceso: '#1d3f78', opmEstado: '#68711f', estadoFill: '#dedacb', estadoFinalFill: '#d6d2c6' });
  expect(t.CRIMSON_UI).toBe('#8e2a2e'); expect(Object.values(t.COLORES)).not.toContain(t.CRIMSON_UI);
});
test('T-201 sombra física y T-200 afiliación preservan magnitudes exactas', () => {
  expect(t.SOMBRA_FISICA).toEqual({ dx: 6, dy: 6, stdDeviation: 1, flood: 'rgba(23,21,17,.68)' });
  expect(t.DASH_AMBIENTAL).toBe('8 4'); expect(t.TRAZOS).toEqual({ cosa: 1.5, estado: 1.2, enlace: 1, estructural: 1.2, inicial: 3, refinada: 4, arco: 1.5 });
});
