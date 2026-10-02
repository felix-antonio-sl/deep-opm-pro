import {test,expect} from 'bun:test';
import {Sesiones} from './sesion';
import {hashPassword} from './cuenta';
const secreto='secreto-sintetico-de-prueba-'.repeat(3),token='token-sintetico-'.repeat(5),clave="Solo-prueba-WP11-2026";
const cuenta={email:'prueba@example.test',hashClave:"scrypt$16384$8$1$X4SjTVHnKHoxcZYA7vLQjA$s_YgLWfNWaoyEzhJYpjkWMOUH6z6DSC4kFGXkxbxmLd_H6WgAQCcB9vHnD53Rp9ux6Ppl2zoq8CptXel4X31Ew",versionCredencial:1};
function preparar(conToken=true){let ahora=Date.UTC(2026,0,1),version=1;const s=new Sesiones({secreto,...(conToken?{token}:{}),cuenta:async()=>({...cuenta,versionCredencial:version}),ahora:()=>ahora});return {s,avanzar:(ms:number)=>ahora+=ms,revocar:()=>version++};}
function req(headers:HeadersInit={},path='/api/modelos',method='GET'){return new Request('http://localhost'+path,{headers,method});}
test('WP-11 §8.2 login uniforme, cookie firmada y Secure solo omitido localhost',async()=>{
 const {s}=preparar();const r=await s.login(cuenta.email,clave,'ip-1','localhost');expect(r.estado).toBe(204);expect(r.cookie).toContain('HttpOnly');expect(r.cookie).toContain('SameSite=Strict');expect(r.cookie).toContain('Max-Age=2592000');expect(r.cookie).not.toContain('Secure');
 expect((await s.login(cuenta.email,clave,'ip-1','example.test')).cookie).toContain('Secure');
 const a=await s.login('otro@example.test',clave,'ip-1','localhost'),b=await s.login(cuenta.email,'incorrecta','ip-2','localhost');expect(a.estado).toBe(401);expect(b.estado).toBe(401);expect(a.error).toBe('Credenciales inválidas');expect(b.error).toBe(a.error);
});
test('WP-11 §8.2 cookie adulterada, expirada y versión antigua no autentican',async()=>{
 const p=preparar();const cookie=(await p.s.login(cuenta.email,clave,'ip','localhost')).cookie!.split(';')[0]!;
 expect((await p.s.autenticar(req({cookie}),'ip')).ok).toBe(true);
 expect((await p.s.autenticar(req({cookie:cookie+'x'}),'ip')).estado).toBe(401);
 p.avanzar(30*24*3600*1000+1);expect((await p.s.autenticar(req({cookie}),'ip')).estado).toBe(401);
 const q=preparar();const vieja=(await q.s.login(cuenta.email,clave,'ip','localhost')).cookie!.split(';')[0]!;q.revocar();expect((await q.s.autenticar(req({cookie:vieja}),'ip')).estado).toBe(401);
});
test('WP-11 §8.2 CSRF exige X-Opforja y valida Origin presente; ausente permitido',async()=>{
 const {s}=preparar();const cookie=(await s.login(cuenta.email,clave,'ip','localhost')).cookie!.split(';')[0]!;
 expect((await s.autenticar(req({cookie},'/api/modelos','POST'),'ip',{mutacion:true})).estado).toBe(403);
 expect((await s.autenticar(req({cookie,'X-Opforja':'1'},'/api/modelos','POST'),'ip',{mutacion:true})).ok).toBe(true);
 expect((await s.autenticar(req({cookie,'X-Opforja':'1',origin:'http://otro.test'},'/api/modelos','POST'),'ip',{mutacion:true})).estado).toBe(403);
 expect((await s.autenticar(req({cookie,'X-Opforja':'1',origin:'http://localhost'},'/api/modelos','POST'),'ip',{mutacion:true})).ok).toBe(true);
});
test('WP-11 §8.2 Bearer válido sin CSRF y precedencia sobre cookie; sesión específica',async()=>{
 const {s}=preparar();expect((await s.autenticar(req({authorization:'Bearer '+token},'/api/modelos','PUT'),'ip',{mutacion:true})).auth).toBe('bearer');
 const cookie=(await s.login(cuenta.email,clave,'ip','localhost')).cookie!.split(';')[0]!;
 expect((await s.autenticar(req({cookie,authorization:'Bearer incorrecto'}),'ip')).estado).toBe(401);
 expect((await s.autenticar(req({authorization:'Bearer '+token},'/api/sesion'),'ip',{sesion:true})).estado).toBe(401);
 expect((await s.autenticar(req({authorization:'Bearer '+token},'/api/sesion','DELETE'),'ip',{sesion:true,mutacion:true})).estado).toBe(400);
 const sin=preparar(false);expect((await sin.s.autenticar(req({authorization:'Bearer '+token}),'ip')).estado).toBe(401);
 expect(()=>new Sesiones({secreto,token:'corto',cuenta:async()=>cuenta})).toThrow();
});
test('WP-11 §8.2 cinco fallos IP y veinte globales bloquean quince minutos; Bearer cuenta',async()=>{
 const p=preparar();for(let i=0;i<5;i++)await p.s.login(cuenta.email,'incorrecta','ip','localhost');
 let r=await p.s.login(cuenta.email,clave,'ip','localhost');expect(r.estado).toBe(429);expect(r.reintentarEn).toBe(900);
 p.avanzar(15*60*1000+1);expect((await p.s.login(cuenta.email,clave,'ip','localhost')).estado).toBe(204);
 const q=preparar();for(let i=0;i<20;i++)await q.s.autenticar(req({authorization:'Bearer incorrecto'}),'ip-'+i);
 expect((await q.s.autenticar(req({authorization:'Bearer '+token}),'otra-ip')).estado).toBe(429);q.avanzar(15*60*1000+1);expect((await q.s.autenticar(req({authorization:'Bearer '+token}),'otra-ip')).ok).toBe(true);
});

test('WP-11 §8.2 Origin coincide con host HTTPS tras proxy, puertos distintos se rechazan',async()=>{
 const {s}=preparar();const cookie=(await s.login(cuenta.email,clave,'ip','localhost')).cookie!.split(';')[0]!;
 expect((await s.autenticar(req({cookie,'X-Opforja':'1',origin:'https://localhost'},'/api/modelos','POST'),'ip',{mutacion:true})).ok).toBe(true);
 expect((await s.autenticar(req({cookie,'X-Opforja':'1',origin:'https://localhost:444'},'/api/modelos','POST'),'ip',{mutacion:true})).estado).toBe(403);
});
