import type { Modelo } from '../nucleo/tipos';
import { extremos } from '../nucleo/tipos';
import { indice } from '../nucleo/indice';
import { proyectar } from '../nucleo/proyeccion';
import { ordenar, opdAbanico, puertoComun, unidadV0 } from './v0';
import type { Registro } from './v0';
export function exportarV0(m: Modelo): string {
    const idx=indice(m), entidades:Record<string,Registro>=Object.create(null), estados:Record<string,Registro>=Object.create(null), enlaces:Record<string,Registro>=Object.create(null), abanicos:Record<string,Registro>=Object.create(null), opds:Record<string,Registro>=Object.create(null);
    const extremo=(id:string,estado?:string) => estado ? {kind:'estado',id:estado}:{kind:'entidad',id};
    for(const [id,c] of Object.entries(ordenar(m.cosas))) {
        const refs=idx.refinamientosDe.get(id), refinamientos:Registro={};
        if(refs?.descomposicion)refinamientos.descomposicion={opdId:refs.descomposicion};
        if(refs?.despliegue){const o=m.opds[refs.despliegue];refinamientos.despliegue={opdId:refs.despliegue,...(o?.tipo==='despliegue'?{modo:o.modo}:{})};}
        entidades[id]={id,tipo:c.tipo,nombre:c.nombre,esencia:c.esencia,afiliacion:c.afiliacion,
            ...(c.descripcion!==undefined?{descripcion:c.descripcion}:{}),...(c.genero?{genero:c.genero}:{}),
            ...(c.tipo==='objeto'&&c.valor!==undefined?{valorSlot:{tipo:'string',placeholder:'value',valor:c.valor}}:{}),
            ...(c.incompleta?.length?{coleccionIncompleta:c.incompleta}:{}),
            ...(c.tipo==='proceso'&&c.duracion?{duracion:{...(c.duracion.min!==undefined?{min:c.duracion.min}:{}),...(c.duracion.esperada!==undefined?{esperada:c.duracion.esperada}:{}),...(c.duracion.max!==undefined?{max:c.duracion.max}:{}),...(c.duracion.unidad?{unidad:c.duracion.unidad}:{})}}:{}),
            ...(Object.keys(refinamientos).length?{refinamientos}:{}),
        };
        if(c.tipo==='objeto')c.estados.forEach((s,orden)=> {
            const des=[...(c.porDefecto===s.id?['default']:[]),...(c.current===s.id?['current']:[])];
            estados[s.id]={id:s.id,entidadId:id,nombre:s.nombre,orden,...(s.inicial?{esInicial:true}:{}),...(s.final?{esFinal:true}:{}),...(des.length?{designaciones:des}:{}),...(s.suprimido?{suprimido:true}:{})};
        });
    }
    for(const [id,e] of Object.entries(ordenar(m.enlaces))) {
        const x=extremos(e); let origenId=extremo(x.origen),destinoId=extremo(x.destino),tipo:string=e.tipo;
        if('estado'in e&&e.estado) {if(e.tipo==='resultado')destinoId=extremo(x.destino,e.estado);else origenId=extremo(x.origen,e.estado);}
        if(e.tipo==='generalizacion'&&e.estados){origenId=extremo(e.refinable,e.estados.general);destinoId=extremo(e.refinador,e.estados.especializacion);}
        if(e.tipo==='etiquetado'||e.tipo==='etiquetadoBidireccional'){if(e.estadoOrigen)origenId=extremo(e.origen,e.estadoOrigen);if(e.tipo==='etiquetado'&&e.estadoDestino)destinoId=extremo(e.destino,e.estadoDestino);}
        if(e.tipo==='reciproco'){tipo='etiquetadoBidireccional';if(e.estados){origenId=extremo(e.origen,e.estados.origen);if(e.estados.destino)destinoId=extremo(e.destino,e.estados.destino);}}
        const fila:Registro={id,tipo,origenId,destinoId,etiqueta:'etiqueta'in e?e.etiqueta??'':''};
        if(e.tipo==='etiquetadoBidireccional')fila.backwardTag=e.inversa;
        if(e.tipo==='reciproco')fila.backwardTag=e.etiqueta??'';
        if(e.tipo==='efecto') {
            if(e.entrada)fila.estadoEntradaId=e.entrada;if(e.salida)fila.estadoSalidaId=e.salida;
            if(e.escision){const padre=e.escision.mitad==='entrada'?id:e.escision.par;fila.efectoEscindido={grupoId:padre,enlacePadreId:padre,rol:e.escision.mitad,modo:'par'};}
        }
        if('control'in e&&e.control)fila.modificador=e.control==='e'?'evento':'condicion';
        if('mult'in e&&e.mult)fila[e.tipo==='consumo'||e.tipo==='agente'||e.tipo==='instrumento'?'multiplicidadOrigen':'multiplicidadDestino']=e.mult;
        if('multOrigen'in e&&e.multOrigen)fila.multiplicidadOrigen=e.multOrigen;
        if('multDestino'in e&&e.multDestino)fila.multiplicidadDestino=e.multDestino;
        if('ruta'in e&&e.ruta!==undefined)fila.rutaEtiqueta=e.ruta;
        if(e.tipo==='excepcionSobretiempo'||e.tipo==='excepcionSubtiempo') {
            const c=m.cosas[e.origen],d=c?.tipo==='proceso'?c.duracion:undefined;
            const max=e.tipo==='excepcionSobretiempo',v=max?d?.max:d?.min;
            if(v!==undefined){fila[max?'tiempoMaximo':'tiempoMinimo']=String(v);fila[max?'unidadTiempoMaximo':'unidadTiempoMinimo']=unidadV0[d?.unidad??m.unidadTiempo];}
        }
        enlaces[id]=fila;
    }
    for(const [id,f] of Object.entries(ordenar(m.abanicos))) {
        const es=f.enlaces.map(e=>m.enlaces[e]!).filter(Boolean),comun=puertoComun(es);
        abanicos[id]={id,opdId:opdAbanico(m,id),puertoComun:comun?{...comun,portId:`puerto-${id}`}:{portId:`puerto-${id}`},puertoEntidadId:comun?.entidadId??'',operador:f.operador==='OR'?'O':'XOR',enlaceIds:f.enlaces};
    }
    for(const [id,o] of Object.entries(ordenar(m.opds))) {
        const apariencias:Record<string,Registro>=Object.create(null), aparienciasEnlace:Record<string,Registro>=Object.create(null);
        const internos=o.tipo==='descomposicion'?new Set([...o.bandas.flat(),...o.objetosInternos]):new Set<string>();
        for(const [c,a] of Object.entries(ordenar(o.apariciones))) {
            const aid=`a-${id}-${c}`;
            apariencias[aid]={id:aid,entidadId:c,opdId:id,x:Math.round(a.x),y:Math.round(a.y),width:Math.round(a.ancho),height:Math.round(a.alto),
                ...(a.ocultos?.length?{estadosSuprimidos:a.ocultos}:{}),
                ...(o.tipo==='descomposicion'?{contextoRefinamiento:{tipo:'descomposicion',refinableEntidadId:o.cosa,rol:c===o.cosa?'contorno':internos.has(c)?'interno':'externo'}}:{}),
            };
        }
        const directos=new Set(proyectar(m,id).enlaces.filter(e=>!e.abstraido).flatMap(e=>e.hechos));
        for(const e of Object.keys(ordenar(m.enlaces)))if(directos.has(e)){const aid=`ae-${id}-${e}`;aparienciasEnlace[aid]={id:aid,enlaceId:e,opdId:id,vertices:[]};}
        opds[id]={id,nombre:idx.etiqueta.get(id)??'SD',padreId:o.tipo==='raiz'?null:o.padre,
            ...(o.tipo!=='raiz'?{ordenLocal:o.orden}:{}),...(o.tipo==='descomposicion'?{ordenInzoom:o.bandas}:{}),apariencias,enlaces:aparienciasEnlace};
    }
    return JSON.stringify({formato:'deep-opm-pro.modelo.v0',modelo:{id:m.id,nombre:m.nombre,...(m.descripcion!==undefined?{descripcion:m.descripcion}:{}),unidadTiempo:m.unidadTiempo,opdRaizId:m.raiz,nextSeq:m.secuencia,entidades,estados:ordenar(estados),enlaces,abanicos,opds}},null,2)+'\n';
}
