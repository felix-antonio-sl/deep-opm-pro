import { test, expect } from 'bun:test';
import { importarOpl, generarDocumentoOpl } from './documento';
import { validarForma } from '../nucleo/forma';

test('T-301 importación canónica de estados designados TS3 y VAL conserva el texto regenerado', () => {
    const t = '# Prueba\n\n## SD\n**Pedido** puede estar `nuevo` o `listo`.\nEstado `nuevo` de **Pedido** es inicial.\nEstado `listo` de **Pedido** es final.\n*Validar* cambia **Pedido** de `nuevo` a `listo`.\n**Color** de **Producto** es rojo.';
    const r = importarOpl('Prueba', t); expect(r.ok).toBe(true); if (!r.ok) return;
    expect(validarForma(r.valor.modelo)).toEqual([]); expect(r.valor.plan.resumen.noAplicables).toBe(0);
    const otra = importarOpl('Prueba', generarDocumentoOpl(r.valor.modelo)); expect(otra.ok).toBe(true);
    if (otra.ok) expect(generarDocumentoOpl(otra.valor.modelo)).toBe(generarDocumentoOpl(r.valor.modelo));
});

import {analizar} from './analizar';
import {generarModelo} from './generar';
import {planificar} from './planificar';
const filas92:readonly {nombre:string;texto:string;tipo?:string;plantilla:string;campo?:Record<string,unknown>}[]=[
 {nombre:'rectángulo con sombra',texto:'**Cuenta** es física.',plantilla:'D1',campo:{tipo:'objeto',esencia:'fisica',genero:'f'}},
 {nombre:'rectángulo sin sombra default',texto:'**Cuenta** es informacional.',plantilla:'D2',campo:{tipo:'objeto',esencia:'informacional'}},
 {nombre:'rectángulo punteado',texto:'**Cuenta** es ambiental.',plantilla:'D3',campo:{tipo:'objeto',afiliacion:'ambiental'}},
 {nombre:'elipse con sombra',texto:'*Gestionar* es físico.',plantilla:'D1',campo:{tipo:'proceso',esencia:'fisica'}},
 {nombre:'estado dentro de objeto',texto:'**Cuenta** puede estar `nuevo`, `abierto` o `cerrado`.',plantilla:'D5'},
 {nombre:'estado borde grueso',texto:'Estado `nuevo` de **Cuenta** es inicial.',plantilla:'D7'},
 {nombre:'estado doble borde',texto:'Estado `nuevo` de **Cuenta** es final.',plantilla:'D8'},
 {nombre:'estado flecha diagonal',texto:'Estado `nuevo` de **Cuenta** es por defecto.',plantilla:'D9'},
 {nombre:'estado inicial y final',texto:'Estado `nuevo` de **Cuenta** es inicial y final.',plantilla:'D10'},
 {nombre:'flecha consumo',texto:'*Validar* consume **Pedido**.',tipo:'consumo',plantilla:'T1'},
 {nombre:'flecha resultado',texto:'*Validar* genera **Pedido**.',tipo:'resultado',plantilla:'T2'},
 {nombre:'flecha efecto',texto:'**Pedido** puede estar `nuevo` o `listo`.\n*Validar* afecta **Pedido**.',tipo:'efecto',plantilla:'T3'},
 {nombre:'flechas entrada y salida TS3',texto:'*Validar* cambia **Pedido** de `nuevo` a `listo`.',tipo:'efecto',plantilla:'TS3'},
 {nombre:'piruleta negra',texto:'**Agente** es físico.\n**Agente** maneja *Validar*.',tipo:'agente',plantilla:'H1'},
 {nombre:'piruleta blanca',texto:'*Validar* requiere **Instrumento**.',tipo:'instrumento',plantilla:'H2'},
 {nombre:'e consumo',texto:'**Pedido** inicia *Validar*, que consume **Pedido**.',tipo:'consumo',plantilla:'ET1',campo:{control:'e'}},
 {nombre:'c consumo',texto:'*Validar* ocurre si **Pedido** existe, en cuyo caso **Pedido** se consume, de lo contrario *Validar* se omite.',tipo:'consumo',plantilla:'CT1',campo:{control:'c'}},
 {nombre:'rayo invocación',texto:'*Invocador* invoca *Invocado*.',tipo:'invocacion',plantilla:'IV1'},
 {nombre:'triángulo agregación',texto:'**Todo** consta de **Parte_1**, **Parte_2** y **Parte_3**.',tipo:'agregacion',plantilla:'RF1'},
 {nombre:'triángulo exhibición',texto:'**Exhibidor** exhibe **Atributo_1** y **Atributo_2**.',tipo:'exhibicion',plantilla:'RF2'},
 {nombre:'triángulo generalización',texto:'**Especial_1** y **Especial_2** son **General**.',tipo:'generalizacion',plantilla:'RF3'},
 {nombre:'triángulo clasificación',texto:'**Instancia** es una instancia de **Clase**.',tipo:'clasificacion',plantilla:'RF4'},
 {nombre:'proceso inflado secuencial',texto:'## SD1\n*Gestionar* se descompone en *Preparar* y *Completar*, en esa secuencia.',plantilla:'CX1'},
 {nombre:'arco simple XOR',texto:'*Validar* consume exactamente uno de **Pedido** o **Registro**.',plantilla:'FAN-consumo-convergente-XOR'},
 {nombre:'arco doble OR',texto:'*Validar* consume al menos uno de **Pedido** o **Registro**.',plantilla:'FAN-consumo-convergente-OR'},
 {nombre:'marca excepción temporal',texto:'*Recuperar* ocurre si duración de *Gestionar* excede 5 minutos.',tipo:'excepcionSobretiempo',plantilla:'EX1'}
];
for(const f of filas92)test(`T-301 Tabla9.2 ${f.nombre}`,()=>{
 expect(analizar(f.texto).flatMap(l=>l.diagnosticos)).toEqual([]);expect(analizar(f.texto).map(l=>l.plantilla)).toContain(f.plantilla);
 const r=importarOpl('Tabla',f.texto);expect(r.ok).toBe(true);if(!r.ok)return;const m=r.valor.modelo;
 expect(r.valor.plan.resumen.noAplicables).toBe(0);expect(validarForma(m)).toEqual([]);expect(generarModelo(m).map(l=>l.plantilla)).toContain(f.plantilla);
 if(f.tipo){const es=Object.values(m.enlaces);expect(es.length).toBeGreaterThan(0);expect(es.every(e=>e.tipo===f.tipo)).toBe(true);if(f.campo)expect(es[0]).toMatchObject(f.campo);}else if(f.campo)expect(Object.values(m.cosas)[0]).toMatchObject(f.campo);
 const owner=Object.values(m.cosas).find(c=>c.tipo==='objeto');if(owner?.tipo==='objeto'){
  if(f.plantilla==='D5')expect(owner.estados.map(s=>s.nombre)).toEqual(['nuevo','abierto','cerrado']);
  if(['D7','D8','D10'].includes(f.plantilla)){expect(owner.estados[0]).toMatchObject({...(['D7','D10'].includes(f.plantilla)?{inicial:true}:{}),...(['D8','D10'].includes(f.plantilla)?{final:true}:{})});}
  if(f.plantilla==='D9')expect(owner.porDefecto).toBe(owner.estados[0]!.id);
 }
 if(f.plantilla.includes('FAN-'))expect(Object.values(m.abanicos)).toEqual([expect.objectContaining({operador:f.plantilla.endsWith('XOR')?'XOR':'OR',enlaces:expect.any(Array)})]);
 if(f.plantilla==='EX1')expect(Object.values(m.cosas).find(c=>c.nombre==='Gestionar')).toMatchObject({duracion:{max:5,unidad:'min'}});
 const doc=generarDocumentoOpl(m);expect(planificar(m,'modelo',doc).acciones).toEqual([]);const rr=importarOpl(m.nombre,doc);expect(rr.ok).toBe(true);if(rr.ok)expect(generarDocumentoOpl(rr.valor.modelo)).toBe(doc);
});
