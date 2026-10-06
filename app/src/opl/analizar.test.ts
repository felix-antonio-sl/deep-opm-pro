import { test, expect } from 'bun:test';
import { analizar } from './analizar';
import { PLANTILLAS } from './plantillas';

const caso = (s: string) => analizar(s)[0]!;
test('T-150 normaliza NFC espacios viñetas y preserva nombres tipados cerrados', () => {
    const l = caso('  - *Validar*\tconsume\u00a0**Cafe\u0301**. ');
    expect(l.diagnosticos).toEqual([]);
    expect(l.hechos).toEqual([{ k: 'enlace', enlace: { tipo: 'consumo', objeto: { nombre: 'Café', tipo: 'objeto' }, proceso: 'Validar' } }]);
});
test('T-151 no inventa entidades y requiere punto y spans cerrados', () => {
    for (const s of ['Validar consume Café.', '*Validar consume **Café**.', '*Validar* consume **Café**']) {
        expect(caso(s).hechos).toEqual([]); expect(caso(s).diagnosticos[0]?.codigo).toBe('syntax-error');
    }
});
test('T-154 listas tipadas distinguen conectores de nombres y estados de cada dueño', () => {
    const l = caso('*Cargar y Validar* consume exactamente uno de **Hierro** en `nuevo` u **Oro** en `listo`.');
    expect(l.diagnosticos).toEqual([]);
    expect(l.hechos).toEqual([{ k: 'abanico', operador: 'XOR', ramas: [
        { tipo: 'consumo', objeto: { nombre: 'Hierro', tipo: 'objeto', estado: 'nuevo' }, proceso: 'Cargar y Validar' },
        { tipo: 'consumo', objeto: { nombre: 'Oro', tipo: 'objeto', estado: 'listo' }, proceso: 'Cargar y Validar' }
    ] }]);
});
test('T-153 condición alternativa y TS3 se reconocen desde la misma plantilla', () => {
    expect(caso('Si **Pedido** existe entonces *Validar* ocurre y consume **Pedido**, de lo contrario se omite *Validar*.').hechos)
        .toEqual([{ k: 'enlace', enlace: { tipo: 'consumo', objeto: { nombre: 'Pedido', tipo: 'objeto' }, proceso: 'Validar', control: 'c' } }]);
    expect(caso('*Validar proceso* cambia **Pedido** de `nuevo` a `listo`.').hechos)
        .toEqual([{ k: 'enlace', enlace: { tipo: 'efecto', objeto: { nombre: 'Pedido', tipo: 'objeto' }, proceso: 'Validar', entrada: 'nuevo', salida: 'listo' } }]);
});
test('T-155 CX mixto conserva bandas y nombres con y dentro del span', () => {
    expect(caso('*Gestionar* se descompone en paralelo *Cargar y Validar* e *Inspeccionar*, *Enviar*, y paralelo *Cobrar* y *Archivar*, en esa secuencia, así como **Registro**.').hechos)
        .toEqual([{ k: 'descomposicion', proceso: 'Gestionar', bandas: [['Cargar y Validar', 'Inspeccionar'], ['Enviar'], ['Cobrar', 'Archivar']], internos: ['Registro'] }]);
});
test('T-156 soporte declarado antes de SE1 residual y no canonizado bloqueante', () => {
    const u = caso('**Registro** es persistente.');
    expect(u.hechos).toEqual([]); expect(u.diagnosticos[0]).toMatchObject({ codigo: 'unsupported-canonical', severidad: 'warning' });
    expect(caso('**A** guarda **B**.').hechos).toEqual([{ k: 'enlace', enlace: { tipo: 'etiquetado', origen: { nombre: 'A', tipo: 'objeto' }, destino: { nombre: 'B', tipo: 'objeto' }, etiqueta: 'guarda' } }]);
    expect(caso('**A** Guarda **B**.').diagnosticos[0]?.codigo).toBe('syntax-error');
});

test('T-100 dimensión informacional explícita no se degrada a mención', () => {
    expect(PLANTILLAS.find(p => p.id === 'D2')!.hacia({ C: { texto: 'Pedido', marca: 'objeto' } })).toEqual([{ k: 'esencia', cosa: { nombre: 'Pedido', tipo: 'objeto' }, valor: 'informacional' }]);
    expect(caso('**Pedido** es informacional.').hechos).toEqual([{ k: 'esencia', cosa: { nombre: 'Pedido', tipo: 'objeto' }, valor: 'informacional' }]);
});
test('T-138 género femenino tiene fuente literal D1/D4 y nunca el nombre', () => {
    expect(caso('**Persona** es física.').hechos).toEqual([{ k: 'esencia', cosa: { nombre: 'Persona', tipo: 'objeto', genero: 'f' }, valor: 'fisica' }]);
    expect(caso('*Persona* es sistémica.').hechos).toEqual([{ k: 'afiliacion', cosa: { nombre: 'Persona', tipo: 'proceso', genero: 'f' }, valor: 'sistemica' }]);
    expect(caso('**Persona** es físico.').hechos).toEqual([{ k: 'esencia', cosa: { nombre: 'Persona', tipo: 'objeto' }, valor: 'fisica' }]);
    expect(caso('**Persona** es informacional.').hechos).toEqual([{ k: 'esencia', cosa: { nombre: 'Persona', tipo: 'objeto' }, valor: 'informacional' }]);
});

import { NO_SOPORTADAS, NO_CANONIZADAS } from './no-soportadas';
const limites = [
 ['**A** puede ser **B** o **C**.','unsupported-canonical'],
 ['**A** se descompone en **B** y **C**, en esa secuencia.','unsupported-canonical'],
 ['**A** y **B** consumen **C**.','unsupported-canonical'],
 ['*Procesar* consume exactamente un **Pedido**.','unsupported-canonical'],
 ['**A** se despliega por partes en SD1 en **B** y **C**.','unsupported-canonical'],
 ['Por ruta Uno, *Procesar* requiere **Pedido**.','unsupported-canonical'],
 ['**Pedido** es persistente.','unsupported-canonical'],
 ['**Pedido** es de tipo integer.','unsupported-canonical'],
 ['**Pedido** tiene un **Color** opcional.','unsupported-canonical'],
 ['*Procesar* consume **A** y genera **B**.','unsupported-canonical'],
 ['*Archivar* ocurre si duración de *Procesar* excede 1 minuto y es menor que 3 minutos.','unsupported-canonical'],
 ['*Procesar* es persistente.','non-canonical'],
 ['**Pedido** es transitoria.','non-canonical'],
 ['**A** puede ser **B** en `nuevo` o **C** en `listo`.','non-canonical'],
 ['*Procesar* inicia e invoca *Guardar*.','non-canonical'],
 ['**Pedido** puede generarse.','non-canonical'],
 ['*Procesar* invoca *Guardar* si *Guardar* ocurre.','non-canonical'],
 ['**Pedido** Pr=0.3.','non-canonical'],
 ['*Procesar* consume exactamente uno de **Pedido** Pr=0.3 o **Registro** Pr=0.7.','unsupported-canonical'],
 ['**Pedido** inicia *Procesar* ocurre si **Pedido** existe.','non-canonical'],
 ['*Procesar* ocurre si **Pedido** está en `listo`, en cuyo caso *Procesar* afecta **Pedido**, de lo contrario *Procesar* se omite.','non-canonical']
] as const;
for(const [texto,codigo] of limites)test(`T-156 T-157 límite ${texto}`,()=>{const l=caso(texto);expect(l.hechos).toEqual([]);expect(l.diagnosticos[0]?.codigo).toBe(codigo);expect(l.diagnosticos[0]?.regla).toBeTruthy();});
test('T-001 cada límite inverso tiene regla y registro',()=>{for(const r of [...NO_SOPORTADAS,...NO_CANONIZADAS]){expect(r.regla).toBeTruthy();expect(r.registro).toMatch(/^B-\d\d$/);}});

test('T-152 análisis puro memoizado conserva líneas y hechos ante intercalación y contaminación',()=>{
 const t='**Pedido** es físico.\n*Validar* consume **Pedido**.',ls=analizar(t),antes=JSON.stringify(ls);
 for(let i=0;i<260;i++)analizar(`**Objeto_${i}** es informacional.`);
 expect(analizar(t)).toEqual(ls);expect(JSON.stringify(ls)).toBe(antes);expect(Object.isFrozen(ls)).toBe(true);expect(Reflect.set(ls[1]!.hechos[0]!,'k','contaminado')).toBe(false);expect(Reflect.set(ls[0]!,'texto','contaminado')).toBe(false);
 expect(analizar('\n**Pedido** es físico.')[1]?.numero).toBe(2);expect(analizar('\n??.')[1]?.diagnosticos[0]?.linea).toBe(2);expect(analizar('??.')[0]?.diagnosticos[0]?.linea).toBe(1);
});

 test('T-150 sólo fuera de spans normaliza comillas curvas y operadores Unicode',()=>{
  const l=caso('**Nombre “≤”** “conoce” **Otro** ∈.');expect(l.texto).toBe('**Nombre “≤”** "conoce" **Otro** in.');
  expect(caso('*Validar* ≤ ≥ ≠ ∈ **Pedido**.').texto).toBe('*Validar* <= >= != in **Pedido**.');
 });
 test('T-151 residual SE1 exige extremos del mismo tipo tipográfico',()=>{
  for(const s of ['**Pedido** guarda *Validar*.','*Validar* guarda **Pedido**.']){expect(caso(s).hechos).toEqual([]);expect(caso(s).diagnosticos[0]?.codigo).toBe('syntax-error');}
 });
 test('T-151 flexibilidad inicial no convierte literales interiores en dialecto',()=>{
  expect(caso('*Validar* cambia **Pedido** DE `nuevo` a `listo`.').hechos).toEqual([]);expect(caso('*Validar* cambia **Pedido** DE `nuevo` a `listo`.').diagnosticos[0]?.codigo).toBe('syntax-error');
  expect(caso('*Validar* Cambia **Pedido** de `nuevo` a `listo`.').diagnosticos).toEqual([]);
 });


test('T-152 análisis acotado conserva entradas intercaladas evicción y textos excesivos',()=>{
 const texto='**Pedido** puede estar `nuevo` o `listo`.',a=analizar(texto),snapshot=JSON.stringify(a);
 for(let i=0;i<4200;i++)expect(analizar(`**Objeto_${i}** es físico.`)[0]!.diagnosticos).toEqual([]);
 expect(analizar(texto)).toEqual(a);expect(JSON.stringify(a)).toBe(snapshot);
 const largo='# '+ 'a'.repeat(2_000_001),b=analizar(largo);expect(b[0]!.hechos).toEqual([]);expect(b[0]!.diagnosticos).toEqual([]);expect(analizar(largo)).toEqual(b);expect(analizar(texto)).toEqual(a);
});


import {modeloCon as modeloNombresReservados} from '../pruebas/constructores';
import {validarForma as formaNombresReservados} from '../nucleo/forma';
import {erroresContexto as contextoNombresReservados} from '../nucleo/matriz';
import {validarNombreCosa as nombreReservado} from '../nucleo/lexico';
import {generarDocumentoOpl as docNombresReservados,importarOpl as importNombresReservados} from './documento';
test('T-150 nombres tipados con palabras de límites preservan núcleo y estricto',()=>{
 for(const nombre of ['Modelo XOR','Registro AND','Modelo puede ser','Modelo no consume']){expect(nombreReservado(nombre)).toBeNull();const m=modeloNombresReservados({objetos:[[nombre,[]]]}),before=JSON.stringify(m);expect(formaNombresReservados(m)).toEqual([]);expect(contextoNombresReservados(m)).toEqual([]);const texto=docNombresReservados(m);expect(analizar(texto).flatMap(l=>l.diagnosticos)).toEqual([]);const r=importNombresReservados(m.nombre,texto);expect(r.ok).toBe(true);if(r.ok)expect(docNombresReservados(r.valor.modelo)).toBe(texto);expect(JSON.stringify(m)).toBe(before);}
 const m=modeloNombresReservados({procesos:['Validar OR']});expect(nombreReservado('Validar OR')).toBeNull();expect(analizar('*Validar OR* es físico.')[0]!.diagnosticos).toEqual([]);expect(importNombresReservados(m.nombre,docNombresReservados(m)).ok).toBe(true);
});
test('T-150 límites no interpretan palabras dentro estado o ruta fiel y sí fuera del span',()=>{
 const m=modeloNombresReservados({objetos:[['Pedido',['estado-OR']]],procesos:['Validar'],enlaces:[['consumo','Pedido','Validar']]}),e=Object.values(m.enlaces)[0]!;if(e.tipo!=='consumo')throw Error('fixture');const r={...m,enlaces:{[e.id]:{...e,ruta:'OR'}}};expect(formaNombresReservados(r)).toEqual([]);expect(contextoNombresReservados(r)).toEqual([]);const texto=docNombresReservados(r);expect(analizar(texto).flatMap(l=>l.diagnosticos)).toEqual([]);const importado=importNombresReservados(r.nombre,texto);expect(importado.ok).toBe(true);if(importado.ok)expect(docNombresReservados(importado.valor.modelo)).toBe(texto);
 for(const s of ['**Pedido** XOR **Registro**.','*Validar* consume AND **Pedido**.','*Validar* consume **Pedido** Pr=0.5.'])expect(caso(s).diagnosticos[0]?.codigo).toBe('non-canonical');expect(caso('**Pedido** puede ser **Registro**.').diagnosticos[0]?.codigo).toBe('unsupported-canonical');
});

test('T-170 SE1 residual requiere dos nombres tipados del mismo tipo y frase no capitalizada',()=>{
 expect(caso('**Cuenta** pertenece a **Registro**.').hechos).toEqual([{k:'enlace',enlace:{tipo:'etiquetado',origen:{nombre:'Cuenta',tipo:'objeto'},destino:{nombre:'Registro',tipo:'objeto'},etiqueta:'pertenece a'}}]);
 expect(caso('**Cuenta** pertenece a *Registrar*.').hechos).toEqual([]);expect(caso('**Cuenta** Pertenece a **Registro**.').hechos).toEqual([]);
});

for(const texto of ['**Cuenta** puede ser **Registro**.','??.'])test(`T-152 salida de límite readonly no contamina hechos compartidos ${texto}`,()=>{
 const l=analizar(texto)[0]!,antes=JSON.stringify(l),h=caso('**Testigo** es informacional.').hechos[0]!;
 expect(l.diagnosticos).not.toHaveLength(0);expect(Object.isFrozen(l.hechos)).toBe(true);expect(Reflect.set(l.hechos,'0',h)).toBe(false);expect(analizar('\n'+texto)[1]!.hechos).toEqual([]);expect(JSON.stringify(l)).toBe(antes);
});
