import { COMANDOS } from '../editor/comandos';
import { Dialogo } from './Dialogo';
export function Ayuda(p: { cerrar: () => void }) { return <Dialogo titulo="Ayuda" cerrar={p.cerrar}><p>Un modelo, dos expresiones: OPD y OPL.</p><dl class="atajos">{COMANDOS.filter(c => c.atajo).map(c => <div key={c.id}><dt>{c.titulo} <small>{c.contexto}</small></dt><dd><kbd>{c.atajo}</kbd></dd></div>)}</dl><p>Objeto: nombre en negrita. Proceso: nombre en cursiva. Estado: nombre dentro de una cápsula. El carmesí identifica controles del editor y no agrega hechos al modelo.</p></Dialogo>; }
