import {test,expect,sembrar,abrir,leer,modelo,lienzo,cosa,seleccionar,navegar,guardado,guardar} from './soporte';
import {importarV0} from '../src/codec/importar';
import {exportarV0} from '../src/codec/exportar';
import {aplicarAccion} from '../src/nucleo/operaciones';

const modos=['agregacion','exhibicion','generalizacion','clasificacion'] as const;
for(const movil of [false,true])for(const [i,modo] of modos.entries())test(`T-071 desplegar objeto externo ${modo} ${movil?'móvil':'escritorio'}`,async({page,request})=>{
 if(movil)await page.setViewportSize({width:390,height:844});
 const id=`e2e-desplegar-externo-${modo}-${movil}`;await sembrar(request,'refinado',id);await abrir(page,id);await navegar(page,/SD1 Procesar/);
 await seleccionar(page,'Pedido');
 if(movil)await page.getByRole('navigation',{name:'Zonas del editor'}).getByRole('button',{name:'Propiedades',exact:true}).click();
 await page.getByRole('button',{name:'Desplegar',exact:true}).click();
 const dialogo=page.getByRole('dialog',{name:'Desplegar por modo',exact:true});await expect(dialogo).toBeVisible();
 await dialogo.getByRole('button',{name:`${i+1} ${modo}`,exact:true}).click();
 const nombre=page.getByRole('textbox',{name:/^Nombre siguiente/});await expect(nombre).toBeVisible();await expect(dialogo).toBeHidden();await expect(nombre).toBeFocused();
 for(const parte of ['Parte primera','Parte segunda']){await nombre.fill(parte);await nombre.press('Enter');}
 await nombre.press('Escape');await guardado(page);
 const v=modelo(await leer(request,id)),hijos=Object.values(v.modelo.opds).filter(o=>o.id!=='sd'&&o.id!=='h');
 expect(hijos).toHaveLength(1);expect(hijos[0]!.padreId).toBe('sd');
 expect(v.modelo.entidades.o!.refinamientos).toEqual({despliegue:{opdId:hijos[0]!.id,modo}});
 expect(Object.values(v.modelo.enlaces).filter(e=>e.tipo===modo)).toHaveLength(2);
 await expect(cosa(page,'Parte primera')).toBeVisible();await expect(cosa(page,'Parte segunda')).toBeVisible();
 await seleccionar(page,'Pedido');
 if(movil)await page.getByRole('navigation',{name:'Zonas del editor'}).getByRole('button',{name:'Propiedades',exact:true}).click();
 await page.getByRole('button',{name:'Volver al origen',exact:true}).click();
 await expect(page.getByRole('navigation',{name:'Ruta de OPD'})).not.toContainText('SD1');await guardado(page);
});

test('T-071 desplegar objeto interno conserva su OPD de origen',async({page,request})=>{
 const id='e2e-desplegar-interno',d=await sembrar(request,'refinado',id),importado=importarV0(d.texto);if(!importado.ok)throw Error('Fixture inválida');
 const interno=aplicarAccion(importado.modelo,{op:'crearCosa',args:{opd:'h',tipo:'objeto',nombre:'Dato interno',x:400,y:170,alcance:'interno'}});if(!interno.ok)throw Error(interno.rechazo.mensaje);
 await guardar(request,id,exportarV0(interno.valor.modelo),d.rev);await abrir(page,id);await navegar(page,/SD1 Procesar/);
 await seleccionar(page,'Dato interno');await page.getByRole('button',{name:'Desplegar',exact:true}).click();
 await page.getByRole('dialog',{name:'Desplegar por modo'}).getByRole('button',{name:'1 agregacion',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Nombre siguiente',exact:true})).toBeFocused();await page.getByRole('textbox',{name:'Nombre siguiente',exact:true}).press('Escape');await guardado(page);
 const v=modelo(await leer(request,id)),c=Object.values(v.modelo.entidades).find(c=>c.nombre==='Dato interno')!,r=c.refinamientos as {despliegue:{opdId:string}};
 expect(v.modelo.opds[r.despliegue.opdId]!.padreId).toBe('h');
});

for(const movil of [false,true])test(`T-078 objeto ya desplegado abre su refinamiento sin duplicar ${movil?'móvil':'escritorio'}`,async({page,request})=>{
 if(movil)await page.setViewportSize({width:390,height:844});
 const id=`e2e-desplegar-existente-${movil}`;await sembrar(request,'refinado',id);await abrir(page,id);await seleccionar(page,'Pedido');
 if(movil)await page.getByRole('navigation',{name:'Zonas del editor'}).getByRole('button',{name:'Propiedades',exact:true}).click();
 await page.getByRole('button',{name:'Desplegar',exact:true}).click();await page.getByRole('dialog',{name:'Desplegar por modo'}).getByRole('button',{name:'1 agregacion',exact:true}).click();
 await page.getByRole('textbox',{name:'Nombre siguiente',exact:true}).press('Escape');await guardado(page);
 const antes=await leer(request,id);await seleccionar(page,'Pedido');
 if(movil)await page.getByRole('navigation',{name:'Zonas del editor'}).getByRole('button',{name:'Propiedades',exact:true}).click();
 await page.getByRole('button',{name:'Desplegar',exact:true}).click();const dialogo=page.getByRole('dialog',{name:'Desplegar por modo'});
 await expect(dialogo.getByText(/ya tiene un despliegue/)).toBeVisible();await dialogo.getByRole('button',{name:'Ir al despliegue',exact:true}).click();
 await expect(dialogo).toBeHidden();await expect(lienzo(page)).toBeVisible();await expect(lienzo(page)).toBeFocused();await expect(cosa(page,'Pedido')).toBeVisible();
 await expect(page.getByRole('textbox',{name:/^Nombre siguiente/})).toHaveCount(0);await guardado(page);expect(await leer(request,id)).toEqual(antes);
});

for(const movil of [false,true])test(`T-011 cancelar y reabrir despliegue conserva modelo y libera lienzo ${movil?'móvil':'escritorio'}`,async({page,request})=>{
 if(movil)await page.setViewportSize({width:390,height:844});
 const id=`e2e-desplegar-cancelar-${movil}`;await sembrar(request,'refinado',id);await abrir(page,id);await navegar(page,/SD1 Procesar/);await seleccionar(page,'Pedido');const antes=await leer(request,id);
 const propiedades=page.getByRole('navigation',{name:'Zonas del editor'}).getByRole('button',{name:'Propiedades',exact:true});
 if(movil)await propiedades.click();
 await page.getByRole('button',{name:'Desplegar',exact:true}).click();const dialogo=page.getByRole('dialog',{name:'Desplegar por modo'});await expect(dialogo).toBeVisible();
 await dialogo.getByRole('button',{name:'Cerrar diálogo',exact:true}).click();await expect(dialogo).toBeHidden();
 await page.getByRole('button',{name:'Desplegar',exact:true}).click();await expect(dialogo).toBeVisible();await page.keyboard.press('Escape');await expect(dialogo).toBeHidden();
 if(movil)await page.getByRole('navigation',{name:'Zonas del editor'}).getByRole('button',{name:'Lienzo',exact:true}).click();
 await expect(lienzo(page)).not.toHaveClass(/modo-gestion-modal/);await seleccionar(page,'Preparar');
 if(movil)await propiedades.click();await expect(page.getByRole('heading',{name:'Preparar',exact:true})).toBeVisible();
 await guardado(page);expect(await leer(request,id)).toEqual(antes);
});
