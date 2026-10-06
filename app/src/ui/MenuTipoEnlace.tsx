import { useState } from 'preact/hooks';
import { tiposLegales } from '../nucleo/matriz';
import type { DatosEtiquetas, OpcionTipo } from '../nucleo/matriz';
import type { Modelo, Id } from '../nucleo/tipos';
import { reducirGesto } from '../editor/gestos';
import type { Gesto } from '../editor/gestos';
import { lineaDeEnlace } from '../opl/generar';
import { Dialogo } from './Dialogo';
export function confirmarDatos(m: Modelo, opd: Id, g: Extract<Gesto,{k:'menuTipo'}>, eleccion: OpcionTipo, etiquetas: DatosEtiquetas, enlace?: Id) {
    const opciones = tiposLegales(m,{opd,desde:g.desde,hacia:g.hacia,etiquetas});
    const indice = opciones.findIndex(o=>o.tipo===eleccion.tipo&&o.sentido===eleccion.sentido&&o.legal===true);
    if (indice < 0) return {gesto:g,acciones:[]};
    if (enlace) return {gesto:{k:'reposo'} as const,acciones:[{op:'cambiarTipoEnlace' as const,args:{enlace,tipo:eleccion.tipo,etiquetas}}]};
    return reducirGesto(m,opd,{...g,opciones},{k:'elegir',indice});
}
export function MenuTipoEnlace(p: { modelo: Modelo; opd: Id; gesto: Extract<Gesto,{k:'menuTipo'}>; cambio?: boolean; elegir: (indice: number, operador?: 'XOR'|'OR') => void; datos: (o: OpcionTipo, d: DatosEtiquetas) => boolean; tecla: (e: KeyboardEvent) => void; cancelar: () => void }) {
    const [pendiente, editar] = useState<OpcionTipo | null>(null), [etiqueta, nombrar] = useState(''), [inversa, invertir] = useState(''), [error, fallar] = useState('');
    const disponibles=p.gesto.opciones.map((o,i)=>({o,i})).filter(({o})=>o.legal!==false||o.alternativa), no=p.gesto.opciones.filter(o=>o.legal===false&&!o.alternativa);
    const nombre=(id:string)=>p.modelo.cosas[id]?.nombre??id;
    return <Dialogo titulo={`Enlace: ${nombre(p.gesto.desde.cosa)} → ${nombre(p.gesto.hacia.cosa)}`} cerrar={p.cancelar}>
        <div class="menu-tipo" onKeyDown={e=>{if(!e.isComposing&&!e.defaultPrevented&&!e.currentTarget.querySelector('input:focus')){const i=e.key==='Enter'?(p.gesto.elegida??0):/^[1-9]$/.test(e.key)?Number(e.key)-1:-1;const o=p.gesto.opciones[i];if(o?.legal==='pendiente'){e.preventDefault();e.stopPropagation();editar(o);fallar('');}else p.tecla(e);}}}>
        {!pendiente ? <><div role="menu" aria-label="Tipo de enlace">{disponibles.map(({o,i})=><div class={`opcion-tipo ${p.gesto.elegida===i?'elegida':''}`}>
            <button role="menuitem" onClick={()=>{if(o.legal==='pendiente'){editar(o);fallar('');}else p.elegir(i);}}><kbd>{i<9?i+1:''}</kbd><span>{o.tipo} · {o.sentido}</span><span class="previa-opl">{o.legal===true?lineaDeEnlace(p.modelo,p.opd,o.candidato)?.tokens.map(t=>t.marca==='objeto'?<strong>{t.texto}</strong>:t.marca==='proceso'?<em>{t.texto}</em>:t.marca==='estado'?<code>{t.texto}</code>:t.texto):o.legal==='pendiente'?`Requiere ${o.requiere.join(' y ')}`:o.motivo.mensaje}</span></button>
            {o.legal===false&&o.alternativa&&o.alternativa.k==='abanicoCon'&&<div><button onClick={()=>p.elegir(i,'XOR')}>Abanico XOR</button><button onClick={()=>p.elegir(i,'OR')}>Abanico OR</button></div>}
        </div>)}</div><details><summary>{no.length} tipos no disponibles</summary>{no.map(o=><p>{o.tipo} · {o.sentido}: {o.legal===false?`${o.motivo.regla}: ${o.motivo.mensaje}`:''}</p>)}</details><p class="ayuda-gesto">↑↓ elegir · 1–9 · ↵ confirmar · Tab otra orientación · ⎋</p></> : <form onSubmit={e=>{e.preventDefault();if(p.datos(pendiente,{etiqueta,...(pendiente.tipo==='etiquetadoBidireccional'?{inversa}:{})}))editar(null);else fallar('Los datos no admiten este enlace; revisa las etiquetas.');}}>
            <label>Etiqueta<input autoFocus value={etiqueta} onInput={e=>nombrar(e.currentTarget.value)} /></label>{pendiente.tipo==='etiquetadoBidireccional'&&<label>Etiqueta inversa<input value={inversa} onInput={e=>invertir(e.currentTarget.value)} /></label>}
            {error&&<p role="alert">{error}</p>}<button>{p.cambio?'Aplicar cambio':'Crear enlace'}</button><button type="button" onClick={()=>editar(null)}>Volver</button>
        </form>}</div>
    </Dialogo>;
}
