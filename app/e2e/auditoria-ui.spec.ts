import {test,expect,sembrar,abrir,leer,modelo,guardar,lienzo,cosa,seleccionar,seleccionarEnlace,tecla,navegar,guardado,editarOpl,entrar,conectar} from './soporte';

test('T-011 UI-02 Escape desde el lienzo cierra el menú sin cambiar selección ni historial',async({page,request})=>{
 const id='e2e-ui02';await sembrar(request,'simple',id);await abrir(page,id);await cosa(page,'Pedido').click({button:'right'});
 await expect(page.getByRole('menu',{name:'Acciones de selección'})).toBeVisible();await lienzo(page).focus();await page.keyboard.press('Escape');
 await expect(page.getByRole('menu',{name:'Acciones de selección'})).toBeHidden();await expect(page.getByRole('heading',{name:'Pedido',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Deshacer',exact:true}).first()).toBeDisabled();
});

test('T-231 UI-03 doble clic de figura entra al hijo y vuelve al origen sin crear',async({page,request})=>{
 const id='e2e-ui03';await sembrar(request,'refinado',id);await abrir(page,id);const antes=await leer(request,id);
 await cosa(page,'Procesar').dblclick();await expect(page.getByRole('navigation',{name:'Ruta de OPD'})).toContainText('SD1');
 await expect(page.getByRole('textbox',{name:'Nombre del objeto',exact:true})).toHaveCount(0);
 await cosa(page,'Procesar').getByText('Procesar',{exact:true}).click();await expect(page.getByRole('button',{name:'Volver al origen',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Volver al origen',exact:true}).click();await expect(cosa(page,'Preparar')).toHaveCount(0);
 await cosa(page,'Procesar').dblclick();await cosa(page,'Procesar').getByText('Procesar',{exact:true}).dblclick();await expect(cosa(page,'Preparar')).toHaveCount(0);
 await cosa(page,'Pedido').dblclick();await expect(page.getByRole('textbox',{name:'Renombrar cosa',exact:true})).toBeVisible();await page.keyboard.press('Escape');
 await guardado(page);expect((await leer(request,id)).texto).toBe(antes.texto);expect((await leer(request,id)).rev).toBe(antes.rev);
});

test('T-011 UI-04 selección y temblor del puntero conservan bytes revisión e historial',async({page,request})=>{
 const id='e2e-ui04';await sembrar(request,'simple',id);await abrir(page,id);const antes=await leer(request,id);await seleccionar(page,'Pedido');
 await expect(page.getByRole('button',{name:'Deshacer',exact:true}).first()).toBeDisabled();
 const b=(await cosa(page,'Pedido').boundingBox())!;await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2+1,b.y+b.height/2+1);await page.mouse.up();
 await expect(page.getByRole('button',{name:'Deshacer',exact:true}).first()).toBeDisabled();await guardado(page);expect(await leer(request,id)).toEqual(antes);
});

for(const movil of [false,true])test(`T-243 UI-05 aviso de solape conserva su OPD ${movil?'móvil':'escritorio'}`,async({page,request},info)=>{
 if(movil)await page.setViewportSize({width:390,height:844});const id=`e2e-ui05-${movil}`;const d=await sembrar(request,'refinado',id),v=modelo(d),h=v.modelo.opds.h!;
 h.apariencias['a-h-o']!.x=370;h.apariencias['a-h-o']!.y=70;await guardar(request,id,JSON.stringify(v),d.rev);await abrir(page,id);await navegar(page,/SD1 Procesar/);
 if(movil)await page.getByLabel('Más acciones').click();await page.getByRole('button',{name:/^Exportar/}).last().click();const dialog=page.getByRole('dialog',{name:'Exportar',exact:true});
 await dialog.locator('p').filter({hasText:'Dos cosas se solapan.'}).getByRole('button',{name:'Ver',exact:true}).first().click();
 await expect(page.getByRole('navigation',{name:'Ruta de OPD'})).toContainText('SD1');await expect(lienzo(page)).toBeVisible();await expect(cosa(page,'Preparar')).toBeVisible();
 if(movil)await expect(page.getByRole('navigation',{name:'Zonas del editor'}).getByRole('button',{name:'Lienzo',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.screenshot({path:info.outputPath('solape-destino.png')});
});

test('T-243 UI-06 Ir desde diagnóstico móvil muestra el destino',async({page,request},info)=>{
 await page.setViewportSize({width:390,height:844});const id='e2e-ui06';await sembrar(request,'refinado',id);await abrir(page,id);
 await page.getByRole('navigation',{name:'Zonas del editor'}).getByRole('button',{name:/^Diagnóstico/}).click();
 const articulo=page.locator('.panel-diagnostico article').filter({hasText:'Preparar'}).first();await articulo.getByRole('button',{name:'Ir',exact:true}).click();
 await expect(lienzo(page)).toBeVisible();await expect(cosa(page,'Preparar')).toBeVisible();await expect(page.getByRole('navigation',{name:'Ruta de OPD'})).toContainText('SD1');
 await page.screenshot({path:info.outputPath('diagnostico-destino.png')});
});

for(const movil of [false,true])test(`T-011 UI-08 crear desde barra queda fuera de ella ${movil?'móvil':'escritorio'}`,async({page,request},info)=>{
 if(movil)await page.setViewportSize({width:390,height:844});const id=`e2e-ui08-${movil}`;await sembrar(request,'simple',id);await abrir(page,id);
 const barra=lienzo(page).locator('.paleta-lienzo');await barra.getByRole('button',{name:/^Proceso/}).click();const input=page.getByRole('textbox',{name:'Nombre del proceso',exact:true});
 await input.fill('Procesamiento');await input.press('Enter');const b=(await cosa(page,'Procesamiento').boundingBox())!,paleta=(await barra.boundingBox())!,host=(await lienzo(page).boundingBox())!;
 expect(b.y).toBeGreaterThan(paleta.y+paleta.height);expect(b.x).toBeGreaterThanOrEqual(host.x);expect(b.y+b.height).toBeLessThanOrEqual(host.y+host.height);
 await page.screenshot({path:info.outputPath('creacion-visible.png')});
});
