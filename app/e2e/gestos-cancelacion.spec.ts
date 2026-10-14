import type { Page } from '@playwright/test';
import { test, expect, sembrar, abrir, leer, modelo, lienzo, cosa, seleccionar, tecla, guardado, conectar } from './soporte';

async function fondo(page: Page) {
 const b=(await lienzo(page).boundingBox())!;
 return {x:b.x+b.width-35,y:b.y+140};
}

test('T-183 perder foco confirma el nombre válido una sola vez y permite deshacer',async({page,request})=>{
 const id='e2e-gesto-nombre-blur';await sembrar(request,'simple',id);await abrir(page,id);const antes=await leer(request,id);
 await cosa(page,'Pedido').dblclick();const input=page.getByRole('textbox',{name:'Renombrar cosa',exact:true});await input.fill('Pedido revisado');
 const p=await fondo(page);await page.mouse.click(p.x,p.y);
 await expect(input).toHaveCount(0);await expect(cosa(page,'Pedido revisado')).toBeVisible();await guardado(page);
 expect(modelo(await leer(request,id)).modelo.entidades.o!.nombre).toBe('Pedido revisado');
 await tecla(page,'Control+z');await guardado(page);expect((await leer(request,id)).texto).toBe(antes.texto);await expect(cosa(page,'Pedido')).toBeVisible();
});

test('T-183 Escape y el botón Cancelar descartan sin confirmar al perder foco',async({page,request})=>{
 const id='e2e-gesto-nombre-cancelar';await sembrar(request,'simple',id);await abrir(page,id);const antes=await leer(request,id);
 for(const boton of [false,true]){
  await cosa(page,'Pedido').dblclick();const input=page.getByRole('textbox',{name:'Renombrar cosa',exact:true});await input.fill('Pedido descartado');
  if(boton)await page.getByRole('button',{name:'Cancelar ⎋',exact:true}).click();else await input.press('Escape');
  await expect(input).toHaveCount(0);await guardado(page);expect(await leer(request,id)).toEqual(antes);
 }
 await seleccionar(page,'Procesar');await expect(page.getByRole('heading',{name:'Procesar',exact:true})).toBeVisible();
});

test('T-183 el nombre duplicado no se guarda al salir y Escape desde el lienzo cierra el editor',async({page,request})=>{
 const id='e2e-gesto-nombre-duplicado';await sembrar(request,'simple',id);await abrir(page,id);const antes=await leer(request,id);
 await cosa(page,'Pedido').dblclick();const input=page.getByRole('textbox',{name:'Renombrar cosa',exact:true});await input.fill('Procesar');
 const p=await fondo(page);await page.mouse.click(p.x,p.y);await expect(input).toBeVisible();expect(await leer(request,id)).toEqual(antes);
 await tecla(page,'Escape');await expect(input).toHaveCount(0);await guardado(page);expect(await leer(request,id)).toEqual(antes);
});

test('T-011 soltar el tirador en vacío elimina la guía sin historial y conserva conectar por clic',async({page,request})=>{
 const id='e2e-gesto-enlace-soltar';await sembrar(request,'simple',id);await abrir(page,id);const antes=await leer(request,id);await seleccionar(page,'Pedido');
 const asa=(await lienzo(page).locator('[data-ui="conectar"][data-ref="cosa:o"]').boundingBox())!,p=await fondo(page);
 await page.mouse.move(asa.x+asa.width/2,asa.y+asa.height/2);await page.mouse.down();await page.mouse.move(p.x,p.y,{steps:8});
 await expect(lienzo(page).locator('.guia-ui')).toBeVisible();await page.mouse.up();
 await expect(lienzo(page).locator('.guia-ui')).toHaveCount(0);await expect(lienzo(page).getByText(/^Enlace:/)).toHaveCount(0);
 await guardado(page);expect(await leer(request,id)).toEqual(antes);await expect(page.getByRole('button',{name:'Deshacer',exact:true}).first()).toBeDisabled();
 await conectar(page,'Pedido','Procesar',/consumo · directo/);await guardado(page);expect(Object.keys(modelo(await leer(request,id)).modelo.enlaces)).toHaveLength(1);
});

test('T-011 un clic en vacío cancela la conexión iniciada por teclado',async({page,request})=>{
 const id='e2e-gesto-enlace-clic';await sembrar(request,'simple',id);await abrir(page,id);const antes=await leer(request,id);await seleccionar(page,'Pedido');await tecla(page,'r');
 const p=await fondo(page);await page.mouse.move(p.x,p.y);await expect(lienzo(page).locator('.guia-ui')).toBeVisible();await page.mouse.click(p.x,p.y);
 await expect(lienzo(page).locator('.guia-ui')).toHaveCount(0);await guardado(page);expect(await leer(request,id)).toEqual(antes);
});

test('T-011 el menú contextual cabe junto al borde y se cierra al alejar el puntero sin mutar',async({page,request})=>{
 await page.setViewportSize({width:1100,height:760});const id='e2e-gesto-menu-salida';await sembrar(request,'simple',id);await abrir(page,id);await seleccionar(page,'Pedido');const antes=await leer(request,id);
 const b=(await lienzo(page).boundingBox())!;await page.mouse.click(b.x+b.width-20,b.y+b.height-24,{button:'right'});
 const menu=page.getByRole('menu',{name:'Acciones de selección'});await expect(menu).toBeVisible();await expect(menu).toHaveCount(1);
 const q=(await menu.boundingBox())!;expect(q.x).toBeGreaterThanOrEqual(b.x);expect(q.y).toBeGreaterThanOrEqual(b.y);expect(q.x+q.width).toBeLessThanOrEqual(b.x+b.width);expect(q.y+q.height).toBeLessThanOrEqual(b.y+b.height);
 await page.mouse.move(q.x+q.width/2,q.y+12);await page.mouse.move(b.x+20,b.y+100,{steps:3});
 await expect(menu).toHaveCount(0);await expect(lienzo(page).getByRole('button',{name:'Seleccionar',exact:true})).toBeEnabled();await guardado(page);expect(await leer(request,id)).toEqual(antes);
});
