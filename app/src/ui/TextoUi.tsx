/** Tipografía del léxico OPL en mensajes humanos. Preact escapa el texto; no se interpreta HTML. */
export function textoUi(texto:string) {
 return texto.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g).map(t=>t.startsWith('**')&&t.endsWith('**')?<strong>{t.slice(2,-2)}</strong>:t.startsWith('*')&&t.endsWith('*')?<em>{t.slice(1,-1)}</em>:t.startsWith('`')&&t.endsWith('`')?<code>{t.slice(1,-1)}</code>:t);
}
export function textoPlano(texto:string) {return texto.replace(/\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|`([^`\n]+)`/g,(_,a:string|undefined,b:string|undefined,c:string|undefined)=>a??b??c??'');}
