import type {Page,APIRequestContext} from '@playwright/test';
import {test,expect,TOKEN,abrir,leer,lienzo,cosa,seleccionar,tecla,guardado,modelo} from './soporte';
import {modeloGrande} from './rendimiento-modelo';
import {exportarV0} from '../src/codec/exportar';

async function grande(page:Page,api:APIRequestContext,id:string){
 await page.setViewportSize({width:1733,height:1071});
 const m={...modeloGrande(600),id,nombre:id},r=await api.post('/api/modelos',{headers:{Authorization:`Bearer ${TOKEN}`,'Content-Type':'application/json'},data:exportarV0(m)});
 expect(r.status(),await r.text()).toBe(201);await abrir(page,id);await page.getByRole('button',{name:'Encuadrar',exact:true}).click();await seleccionar(page,'Dato_005');
}

test('T-011 panear y zoom con 600 cosas conserva la tinta y no reconstruye los paneles',async({page,request})=>{
 await grande(page,request,'e2e-rendimiento-camara');const antes=await leer(request,'e2e-rendimiento-camara'),b=(await lienzo(page).boundingBox())!,x=b.x+b.width*.55,y=b.y+b.height*.6;
 await page.mouse.move(x,y);const tinta=lienzo(page).locator('svg.svg-lienzo > g > g').first(),dibujo=await tinta.innerHTML();
 await page.evaluate(()=>{const paneles=[document.querySelector('.inspector')!,document.querySelector('.panel-opl')!],tinta=document.querySelector('svg.svg-lienzo > g > g')!;
  const cuentas=[0,0,0],obs=[...paneles,tinta].map((e,i)=>{const o=new MutationObserver(xs=>cuentas[i]!+=xs.filter(x=>i===2||x.type!=='attributes').length);o.observe(e,{childList:true,attributes:true,characterData:true,subtree:true});return o;});
  (window as unknown as {terminarObservacion:()=>number[]}).terminarObservacion=()=>{obs.forEach(o=>o.disconnect());return cuentas;};
 });
 const transformar=lienzo(page).locator('svg.svg-lienzo > g'),inicio=await transformar.getAttribute('transform');
 await page.mouse.down({button:'middle'});await page.mouse.move(x+110,y+65,{steps:12});await page.mouse.up({button:'middle'});await expect(transformar).not.toHaveAttribute('transform',inicio!);
 await page.keyboard.down('Control');await page.mouse.wheel(0,-110);await page.keyboard.up('Control');await expect(lienzo(page).getByRole('status')).not.toHaveText('20%');
 await page.getByRole('button',{name:'Encuadrar',exact:true}).click();await expect(transformar).toHaveAttribute('transform',inicio!);
 expect(await tinta.innerHTML()).toBe(dibujo);expect(await page.evaluate(()=>(window as unknown as {terminarObservacion:()=>number[]}).terminarObservacion())).toEqual([0,0,0]);
 await guardado(page);expect(await leer(request,'e2e-rendimiento-camara')).toEqual(antes);await expect(page.getByRole('button',{name:'Deshacer',exact:true}).first()).toBeDisabled();
});

test('T-011 un arrastre grande soltado o cancelado antes del frame conserva último puntero y undo exacto',async({page,request})=>{
 const id='e2e-rendimiento-arrastre';await grande(page,request,id);const antes=await leer(request,id),rect=cosa(page,'Dato_005').locator('rect').first(),inicial={x:Number(await rect.getAttribute('x')),y:Number(await rect.getAttribute('y'))};
 const b=(await cosa(page,'Dato_005').boundingBox())!,x=b.x+b.width/2,y=b.y+b.height*.25;
 await page.mouse.move(x,y);await page.mouse.down();
 await page.evaluate(({x,y})=>{const svg=document.querySelector('svg.svg-lienzo')!;for(let i=1;i<=16;i++)svg.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,clientX:x+i*2,clientY:y+i,pointerId:1,pointerType:'mouse',buttons:1}));
  svg.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:x+32,clientY:y+16,pointerId:1,pointerType:'mouse',buttons:0,button:0}));
 },{x,y});await page.mouse.up();await guardado(page);
 const cambiado=modelo(await leer(request,id)),entidad=Object.entries(cambiado.modelo.entidades).find(([,c])=>c.nombre==='Dato_005')![0],app=Object.values(cambiado.modelo.opds[cambiado.modelo.opdRaizId]!.apariencias).find(a=>a.entidadId===entidad)!;
 expect(app.x).toBeGreaterThan(inicial.x);expect(app.y).toBeGreaterThan(inicial.y);
 await expect.poll(async()=>Number(await rect.getAttribute('x'))).toBe(app.x);await expect.poll(async()=>Number(await rect.getAttribute('y'))).toBe(app.y);
 await tecla(page,'Control+z');await guardado(page);expect((await leer(request,id)).texto).toBe(antes.texto);await expect(page.getByRole('button',{name:'Deshacer',exact:true}).first()).toBeDisabled();
 await page.mouse.move(x,y);await page.mouse.down();await page.evaluate(({x,y})=>{const svg=document.querySelector('svg.svg-lienzo')!;
  for(let i=1;i<=16;i++)svg.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,clientX:x+i*2,clientY:y+i,pointerId:1,pointerType:'mouse',buttons:1}));
  svg.parentElement!.dispatchEvent(new KeyboardEvent('keydown',{bubbles:true,key:'Escape'}));
 },{x,y});await page.mouse.up();await guardado(page);await expect(rect).toHaveAttribute('x',String(inicial.x));await expect(rect).toHaveAttribute('y',String(inicial.y));expect((await leer(request,id)).texto).toBe(antes.texto);
});
