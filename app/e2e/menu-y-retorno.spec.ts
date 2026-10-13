import type {Page} from '@playwright/test';
import {test,expect,sembrar,abrir,leer,lienzo,cosa,tecla,navegar,guardado} from './soporte';

async function abrirMenu(page:Page) {
 const b=await lienzo(page).boundingBox();expect(b).not.toBeNull();
 await page.mouse.click(b!.x+35,b!.y+b!.height-75,{button:'right'});
 await expect(page.getByRole('menu',{name:'Acciones de selección'})).toBeVisible();
 return b!;
}

test('T-011 tools: cerrar menú con clic de lienzo no inicia creación ni cambia el modelo',async({page,request},info)=>{
 const errores:string[]=[];page.on('pageerror',e=>errores.push(e.message));
 const id='e2e-tools-captura-6ace9ce3';await sembrar(request,'vacio',id);await abrir(page,id);page.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errores.push(m.text());});
 await expect(page).toHaveTitle('OpForja');const antes=await leer(request,id),b=await abrirMenu(page);
 await page.screenshot({path:info.outputPath('tools-abierto.png')});
 await page.mouse.click(b.x+b.width-35,b.y+b.height-200);
 await expect(page.getByRole('menu',{name:'Acciones de selección'})).toBeHidden({timeout:1500});
 await expect(page.getByRole('textbox',{name:'Nombre del objeto',exact:true})).toHaveCount(0);
 await expect(lienzo(page).getByRole('button',{name:'Seleccionar',exact:true})).toBeEnabled();
 await guardado(page);const despues=await leer(request,id);expect(despues.texto).toBe(antes.texto);expect(despues.rev).toBe(antes.rev);
 await tecla(page,'o');await expect(page.getByRole('textbox',{name:'Nombre del objeto',exact:true})).toBeVisible();await page.keyboard.press('Escape');
 await expect(page.getByRole('textbox',{name:'Nombre del objeto',exact:true})).toHaveCount(0);expect(errores).toEqual([]);
 await page.screenshot({path:info.outputPath('tools-cerrado.png')});
});

test('T-231 origen: salir de refinamiento con menú abierto recupera el lienzo editable sin mutar',async({page,request},info)=>{
 const errores:string[]=[];page.on('pageerror',e=>errores.push(e.message));
 const id='e2e-origen-captura-6ace9d3c';await sembrar(request,'refinado',id);await abrir(page,id);page.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errores.push(m.text());});await navegar(page,/SD1 Procesar/);
 const antes=await leer(request,id);await abrirMenu(page);await page.screenshot({path:info.outputPath('refinamiento-menu.png')});
 await page.getByRole('navigation',{name:'Ruta de OPD'}).getByRole('button',{name:/^SD E2E/}).click();
 await expect(page.getByRole('navigation',{name:'Ruta de OPD'})).not.toContainText('SD1');
 await expect(cosa(page,'Preparar')).toHaveCount(0);await expect(cosa(page,'Procesar')).toBeVisible();
 await expect(lienzo(page).getByRole('button',{name:'Seleccionar',exact:true})).toBeEnabled({timeout:1500});
 await tecla(page,'o');await expect(page.getByRole('textbox',{name:'Nombre del objeto',exact:true})).toBeVisible();await page.keyboard.press('Escape');
 await guardado(page);const despues=await leer(request,id);expect(despues.texto).toBe(antes.texto);expect(despues.rev).toBe(antes.rev);expect(errores).toEqual([]);
 await page.screenshot({path:info.outputPath('origen-editable.png')});
});
