import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BASE, TOKEN, EMAIL, PASSWORD } from './soporte';
export default async function setup() {
 const salud=await fetch(`${BASE}/salud`);if(!salud.ok||salud.headers.get('X-Opforja-Version')!=='e2e')throw new Error('El servidor compilado de la corrida no tiene versión e2e');
 const env={PATH:process.env.PATH!,OPFORJA_VERSION:'e2e'};
 const build=spawnSync('bun',['--no-env-file','node_modules/vite/bin/vite.js','build'],{cwd:resolve('.'),env,encoding:'utf8'});
 if(build.status!==0)throw new Error(`Build web genuino falló: ${build.stderr}\n${build.stdout}`);
 const datos=process.env.OPFORJA_E2E_DATOS;if(!datos)throw new Error('Falta destino exclusivo del servidor');
 const cuenta=spawnSync('bun',['--no-env-file','dist-servidor/cuenta.js','crear',EMAIL,'--datos',datos],{env,input:`${PASSWORD}\n${PASSWORD}\n`,encoding:'utf8'});
 if(cuenta.status!==0)throw new Error(`No se creó la cuenta sintética (${cuenta.status})`);
 for(const archivo of ['System_Diagram','Modelo_Vacio','sintetico','OnStar_System','SD_Sync','SD_Async','OPM_Structure_Meta_Model']){
  const doc=JSON.parse(readFileSync(resolve('fixtures/v0',`${archivo}.json`),'utf8'));doc.modelo.id=`e2e-archivo-${archivo}`;
  const r=await fetch(`${BASE}/api/modelos`,{method:'POST',headers:{Authorization:`Bearer ${TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(doc)});
  if(archivo==='OPM_Structure_Meta_Model'){
   const cuerpo=await r.json();if(r.status!==422||JSON.stringify(cuerpo.informe?.descartado?.map((x:{ruta:string;regla:string})=>[x.ruta,x.regla]))!==JSON.stringify([['enlaces.e-33.etiqueta','R-OPL-1'],['enlaces.e-49.etiqueta','R-OPL-1']])||cuerpo.informe.rechazos.length!==0)throw new Error('El metamodelo original no conserva su rechazo con Informe esperado');
   const ausente=await fetch(`${BASE}/api/modelos/${doc.modelo.id}`,{headers:{Authorization:`Bearer ${TOKEN}`}});if(ausente.status!==404)throw new Error('Un POST422 instaló el metamodelo descartado');
  }else if(!r.ok)throw new Error(`Fixture archivada ${archivo}: HTTP${r.status} ${await r.text()}`);
 }
}
