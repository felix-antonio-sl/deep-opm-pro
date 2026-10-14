import type {Page} from '@playwright/test';
import {test,expect,sembrar,abrir,leer,modelo,lienzo,cosa,seleccionar,seleccionarEnlace,tecla,guardado,navegar} from './soporte';

async function iniciarArrastre(page:Page,nombre:string,dx:number,dy:number){
 const titulo=cosa(page,nombre).getByText(nombre,{exact:true}),b=(await titulo.boundingBox())!;
 const desde={x:b.x+b.width/2,y:b.y+b.height/2};
 await page.mouse.move(desde.x,desde.y);await page.mouse.down();await page.mouse.move(desde.x+dx,desde.y+dy,{steps:5});return desde;
}
async function tinta(page:Page,id:string){return lienzo(page).locator(`[data-ref="${id}"]`).first().innerHTML();}

test('T-011 arrastre vivo mueve objeto, estado y flechas antes de soltar; Escape restaura sin guardar',async({page,request})=>{
 const id='e2e-directo-estado';await sembrar(request,'ts3',id);await abrir(page,id);const antes=await leer(request,id),b=(await cosa(page,'Pedido').boundingBox())!,linea=await tinta(page,'enlace:e1');
 await iniciarArrastre(page,'Pedido',55,45);
 await expect.poll(async()=>((await cosa(page,'Pedido').boundingBox())!.x-b.x)).toBeGreaterThan(40);
 expect(await tinta(page,'enlace:e1')).not.toBe(linea);await expect(lienzo(page).locator('.fantasma-ui')).toHaveCount(0);
 expect(await leer(request,id)).toEqual(antes);await page.keyboard.press('Escape');await page.mouse.up();
 await expect.poll(async()=>((await cosa(page,'Pedido').boundingBox())!.x)).toBeCloseTo(b.x,1);expect(await tinta(page,'enlace:e1')).toBe(linea);await guardado(page);expect(await leer(request,id)).toEqual(antes);
});

test('T-011 arrastre de objeto con dos enlaces estructurales redibuja triángulos y confirma en un solo paso',async({page,request})=>{
 const id='e2e-directo-triangulos';await sembrar(request,'estructural',id);await abrir(page,id);const antes=await leer(request,id),b=(await cosa(page,'Sistema').boundingBox())!,lineas=await tinta(page,'simbolo:o:agregacion');
 await iniciarArrastre(page,'Sistema',44,28);const durante=(await cosa(page,'Sistema').boundingBox())!;
 expect(durante.x-b.x).toBeGreaterThan(30);expect(await tinta(page,'simbolo:o:agregacion')).not.toBe(lineas);expect(await leer(request,id)).toEqual(antes);
 await page.mouse.up();await guardado(page);const despues=await leer(request,id);expect(despues.texto).not.toBe(antes.texto);
 const final=(await cosa(page,'Sistema').boundingBox())!;expect(final.x).toBeCloseTo(durante.x,1);expect(final.y).toBeCloseTo(durante.y,1);
 expect(modelo(despues).modelo.enlaces).toEqual(modelo(antes).modelo.enlaces);
 await tecla(page,'Control+z');await guardado(page);expect((await leer(request,id)).texto).toBe(antes.texto);
 await tecla(page,'Control+Shift+z');await guardado(page);expect((await leer(request,id)).texto).toBe(despues.texto);
});

test('T-011 arrastre múltiple previsualiza ambas figuras sin persistir y cancela sin historial',async({page,request})=>{
 const id='e2e-directo-multiple';await sembrar(request,'simple',id);await abrir(page,id);await seleccionar(page,'Pedido');await cosa(page,'Procesar').click({modifiers:['Shift']});
 const antes=await leer(request,id),a=(await cosa(page,'Pedido').boundingBox())!,b=(await cosa(page,'Procesar').boundingBox())!;
 await iniciarArrastre(page,'Pedido',30,25);expect((await cosa(page,'Pedido').boundingBox())!.x-a.x).toBeGreaterThan(20);expect((await cosa(page,'Procesar').boundingBox())!.x-b.x).toBeGreaterThan(20);
 expect(await leer(request,id)).toEqual(antes);await page.keyboard.press('Escape');await page.mouse.up();await guardado(page);expect(await leer(request,id)).toEqual(antes);
 await expect(lienzo(page).locator('.fantasma-ui')).toHaveCount(0);
});

test('T-081 mover el contenedor previsualiza sus internos y la posición soltada coincide con la confirmada',async({page,request})=>{
 const id='e2e-directo-contenedor';await sembrar(request,'refinado',id);await abrir(page,id);await navegar(page,/SD1 Procesar/);
 const antes=await leer(request,id),a=(await cosa(page,'Procesar').boundingBox())!,b=(await cosa(page,'Preparar').boundingBox())!;
 await iniciarArrastre(page,'Procesar',50,32);const p=(await cosa(page,'Procesar').boundingBox())!,q=(await cosa(page,'Preparar').boundingBox())!;
 expect(p.x-a.x).toBeGreaterThan(30);expect(q.x-b.x).toBeCloseTo(p.x-a.x,1);expect(q.y-b.y).toBeCloseTo(p.y-a.y,1);expect(await leer(request,id)).toEqual(antes);
 await page.mouse.up();await guardado(page);expect((await cosa(page,'Preparar').boundingBox())!.x).toBeCloseTo(q.x,1);
 await tecla(page,'Control+z');await guardado(page);expect((await leer(request,id)).texto).toBe(antes.texto);
});

for(const tipo of ['objeto','proceso'] as const)test(`T-252 arrastrar ${tipo} desde paleta sigue al puntero y pide nombre sólo al soltar`,async({page,request})=>{
 const id='e2e-paleta-'+tipo;await sembrar(request,'vacio',id);await abrir(page,id);const antes=await leer(request,id),b=(await lienzo(page).boundingBox())!,boton=(await page.getByRole('button',{name:tipo==='objeto'?'Objeto O':'Proceso P',exact:true}).boundingBox())!;
 const fin={x:b.x+b.width*.55,y:b.y+b.height*.45};await page.mouse.move(boton.x+boton.width/2,boton.y+boton.height/2);await page.mouse.down();await page.mouse.move(fin.x-25,fin.y+20,{steps:4});await page.mouse.move(fin.x,fin.y);
 await expect(lienzo(page).locator('.fantasma-ui')).toHaveCount(1);await expect(page.getByRole('textbox',{name:`Nombre del ${tipo}`,exact:true})).toHaveCount(0);expect(await leer(request,id)).toEqual(antes);
 await page.mouse.up();const campo=page.getByRole('textbox',{name:`Nombre del ${tipo}`,exact:true});await expect(campo).toBeVisible();expect(await leer(request,id)).toEqual(antes);
 await campo.fill(tipo==='objeto'?'Registro':'Registrar');await campo.press('Enter');await guardado(page);const nombre=tipo==='objeto'?'Registro':'Registrar',c=(await cosa(page,nombre).boundingBox())!;
 expect(c.x).toBeCloseTo(fin.x,0);expect(c.y).toBeCloseTo(fin.y,0);expect(Object.keys(modelo(await leer(request,id)).modelo.entidades)).toHaveLength(1);
 await tecla(page,'Control+z');await guardado(page);expect((await leer(request,id)).texto).toBe(antes.texto);
});

test('T-252 arrastre de paleta cancelado, soltado fuera o perdido no deja preview ni editor; clic sigue funcionando',async({page,request})=>{
 const id='e2e-paleta-cancelar';await sembrar(request,'vacio',id);await abrir(page,id);const antes=await leer(request,id),b=(await lienzo(page).boundingBox())!;
 const boton=page.getByRole('button',{name:'Objeto O',exact:true}),r=(await boton.boundingBox())!;
 for(const salida of ['Escape','fuera','cancelacion']){
  await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.down();await page.mouse.move(b.x+200,b.y+180,{steps:4});
  await expect(lienzo(page).locator('.fantasma-ui')).toHaveCount(1);
  if(salida==='Escape')await page.keyboard.press('Escape');else if(salida==='fuera')await page.mouse.move(30,b.y+100);else await lienzo(page).dispatchEvent('pointercancel');
  await page.mouse.up();await expect(lienzo(page).locator('.fantasma-ui')).toHaveCount(0);await expect(page.getByRole('textbox',{name:'Nombre del objeto',exact:true})).toHaveCount(0);
  await guardado(page);expect(await leer(request,id)).toEqual(antes);
 }
 await boton.click();await expect(page.getByRole('textbox',{name:'Nombre del objeto',exact:true})).toBeVisible();await page.keyboard.press('Escape');
 await boton.focus();await page.keyboard.press('Enter');await expect(page.getByRole('textbox',{name:'Nombre del objeto',exact:true})).toBeVisible();await page.keyboard.press('Escape');
 expect(await leer(request,id)).toEqual(antes);
});

test('T-251 quitar el padre refinado explica cómo continuar y conserva jerarquía y documento',async({page,request})=>{
 const id='e2e-quitar-refinado';await sembrar(request,'refinado',id);await abrir(page,id);const antes=await leer(request,id);await seleccionar(page,'Procesar');await tecla(page,'Delete');
 await expect(page.getByRole('main',{name:'Lienzo',exact:true})).toContainText('Conserva la aparición o elimina primero el refinamiento');await expect(cosa(page,'Procesar')).toBeVisible();await guardado(page);expect(await leer(request,id)).toEqual(antes);
});

test('T-015 arrastrar estado reordena dentro de su objeto con enlaces vivos y un solo deshacer',async({page,request})=>{
 const id='e2e-directo-estado-orden';await sembrar(request,'ts3',id);await abrir(page,id);const antes=await leer(request,id);
 const origen=cosa(page,'Pedido').getByText('pendiente',{exact:true}),destino=cosa(page,'Pedido').getByText('pagado',{exact:true}),a=(await origen.boundingBox())!,b=(await destino.boundingBox())!,linea=await tinta(page,'enlace:e1');
 await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:4});
 const durante=(await origen.boundingBox())!;expect(Math.hypot(durante.x-a.x,durante.y-a.y)).toBeGreaterThan(5);expect(await tinta(page,'enlace:e1')).not.toBe(linea);expect(await leer(request,id)).toEqual(antes);
 await page.mouse.up();await guardado(page);expect(modelo(await leer(request,id)).modelo.estados['o-s1']!['orden']).toBe(1);
 await tecla(page,'Control+z');await guardado(page);expect((await leer(request,id)).texto).toBe(antes.texto);
});

test('T-015 arrastrar estado al borde o fuera conserva dueño y muestra cómo reordenar sin jitter ni historial',async({page,request})=>{
 const id='e2e-directo-estado-borde';await sembrar(request,'ts3',id);await abrir(page,id);const antes=await leer(request,id);
 const estado=cosa(page,'Pedido').getByText('pendiente',{exact:true}),a=(await estado.boundingBox())!,objeto=(await cosa(page,'Pedido').boundingBox())!;
 await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(objeto.x+objeto.width+30,objeto.y+objeto.height/2,{steps:4});
 await expect(lienzo(page)).toContainText('Los estados permanecen dentro de su objeto');expect((await estado.boundingBox())!.x).toBeCloseTo(a.x,1);
 await page.mouse.move(objeto.x+objeto.width+32,objeto.y+objeto.height/2-2);expect((await estado.boundingBox())!.x).toBeCloseTo(a.x,1);
 await page.mouse.up();await guardado(page);expect(await leer(request,id)).toEqual(antes);await expect(lienzo(page).locator('.fantasma-ui')).toHaveCount(0);
});

test('T-251 Backspace elimina enlace con su marcador y un deshacer restaura el documento',async({page,request})=>{
 const id='e2e-enlace-backspace';await sembrar(request,'entrada',id);await abrir(page,id);const antes=await leer(request,id);await seleccionarEnlace(page,'e1');await tecla(page,'Backspace');
 await expect(lienzo(page).locator('[data-ref="enlace:e1"]')).toHaveCount(0);await guardado(page);expect(modelo(await leer(request,id)).modelo.enlaces).toEqual({});
 await tecla(page,'Control+z');await guardado(page);expect((await leer(request,id)).texto).toBe(antes.texto);
});
