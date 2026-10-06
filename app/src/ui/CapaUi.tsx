import type { Escena, Rect, Punto } from '../opd/escena';
import type { Seleccion } from '../editor/estado';
import type { Gesto } from '../editor/gestos';
import type { Modelo, Ref } from '../nucleo/tipos';
export function CapaUi(p:{modelo:Modelo;escena:Escena;seleccion:Seleccion;hover:Ref|null;realce:readonly Ref[];gesto:Gesto;zoom:number;legal:(ref:Ref)=>boolean}) {
    const box=(r:Rect,ref:Ref,selected:boolean)=> <g data-ref={`${ref.tipo}:${ref.id}`}><rect class={selected?'seleccion-ui':'hover-ui'} x={r.x-4} y={r.y-4} width={r.ancho+8} height={r.alto+8} rx={ref.tipo==='estado'?10:0} pointer-events="none" />
        <path class="ancla-ui" data-ui="conectar" data-ref={`${ref.tipo}:${ref.id}`} d={`M ${r.x+r.ancho-6} ${r.y+r.alto/2} l 6 -6 l 6 6 l -6 6 Z`} />
        {selected&&ref.tipo==='cosa'&&<rect class="asa-ui" data-ui="resize" data-ref={`cosa:${ref.id}`} x={r.x+r.ancho-4} y={r.y+r.alto-4} width={8} height={8} />}</g>;
    const activo=(ref:Ref)=>p.hover?.id===ref.id&&p.hover.tipo===ref.tipo||p.realce.some(r=>r.id===ref.id&&r.tipo===ref.tipo);
    const seleccionado=(ref:Ref)=>ref.tipo==='cosa'?p.seleccion.cosas.includes(ref.id):ref.tipo==='estado'?p.seleccion.estados.includes(ref.id):false;
    const extremos=p.escena.aristas.filter(a=>p.seleccion.enlaces.includes(a.ref.id)).flatMap(a=>a.tramos.flatMap(t=>[{p:t.puntos[0]!,extremo:p.modelo.enlaces[a.ref.id]?.tipo==='efecto'&&t.estados?.[0]?'destino':'origen'},{p:t.puntos.at(-1)!,extremo:p.modelo.enlaces[a.ref.id]?.tipo==='efecto'&&t.estados?.[0]?'origen':'destino'}].map(x=>({...x,enlace:a.ref.id}))));
    const inicio=()=>{if(p.gesto.k!=='conectando')return null;const r=p.gesto.desde;const n=p.escena.nodos.find(n=>n.ref.id===r.cosa);const b=r.estado?n?.estados.find(s=>s.ref.id===r.estado)?.caja:n?.caja;return b?{x:b.x+b.ancho,y:b.y+b.alto/2}:null;};
    const a=inicio(),g=p.gesto;
    const recta=(a:Punto,b:Punto)=><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} class="guia-ui" pointer-events="none" />;
    return <g data-capa-ui="1" stroke-width={1.2/p.zoom}>
        {p.escena.nodos.map(n=><g>{g.k==='conectando'&&!p.legal(n.ref)&&<text x={n.caja.x+n.caja.ancho+10} y={n.caja.y+12} class="no-destino-ui" pointer-events="none">×</text>}{(activo(n.ref)||seleccionado(n.ref)||g.k==='conectando'&&p.legal(n.ref))&&box(n.caja,n.ref,seleccionado(n.ref))}{n.estados.map(s=>(activo(s.ref)||seleccionado(s.ref)||g.k==='conectando'&&p.legal(s.ref))&&box(s.caja,s.ref,seleccionado(s.ref)))}</g>)}
        {extremos.map(x=><rect data-ui="reanclar" data-enlace={x.enlace} data-extremo={x.extremo} x={x.p.x-4} y={x.p.y-4} width={8} height={8} class="asa-ui" />)}
        {p.escena.simbolos.filter(s=>p.seleccion.simbolo===s.clave).flatMap(s=>s.peine.slice(3,3+s.ramas.length).map((rama,i)=><rect class="asa-ui" data-ui="reanclar" data-enlace={s.ramas[i]} data-extremo="destino" x={rama.at(-1)!.x-4} y={rama.at(-1)!.y-4} width={8} height={8} />))}
        {a&&g.k==='conectando'&&recta(a,g.punto)}{g.k==='reanclando'&&<circle cx={g.punto.x} cy={g.punto.y} r={6} class="seleccion-ui" pointer-events="none" />}
        {g.k==='arrastrando'&&p.escena.nodos.filter(n=>g.cosas.includes(n.ref.id)).map(n=><rect x={n.caja.x+g.delta.x} y={n.caja.y+g.delta.y} width={n.caja.ancho} height={n.caja.alto} class="fantasma-ui" pointer-events="none" />)}
        {g.k==='redimensionando'&&<rect x={g.caja.x} y={g.caja.y} width={g.caja.ancho} height={g.caja.alto} class="fantasma-ui" pointer-events="none" />}
        {g.k==='creando'&&<g pointer-events="none">{g.tipo==='objeto'?<rect x={g.en.x} y={g.en.y} width={135} height={60} class="fantasma-ui" />:<ellipse cx={g.en.x+67.5} cy={g.en.y+30} rx={67.5} ry={30} class="fantasma-ui" />}</g>}
        {g.k==='encadenando'&&g.bandas.flatMap((b,i)=>b.map((nombre,j)=>{const n=p.escena.nodos.find(n=>n.contenedor),x=(n?.caja.x??0)+50+j*170,y=(n?.caja.y??0)+64+i*100;return <g pointer-events="none"><ellipse cx={x+67.5} cy={y+30} rx={67.5} ry={30} class="fantasma-ui"/><text x={x+67.5} y={y+34} text-anchor="middle" class="nombre-fantasma">{nombre}</text></g>;}))}
        {g.k==='banda'&&p.escena.nodos.filter(n=>!n.contenedor&&n.tipo==='proceso').map(n=>recta({x:p.escena.caja.x,y:n.caja.y},{x:p.escena.caja.x+p.escena.caja.ancho,y:n.caja.y}))}
    </g>;
}
