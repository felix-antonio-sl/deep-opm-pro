// Layout engine orden-canónico (dominio-agnóstico). Extraído del generador de hd-opm (R22-R26).
// Deriva la geometría del ORDEN de las invocaciones (nivel topológico → banda Y), dispone externos
// por rol (Dori), dimensiona el contorno al contenido (fix E), ancho de caja por texto (fix F),
// colocación ADAPTIVA de objetos internos (R26: fila-abajo vs columna-derecha, la de menor área).
// Implementación por closure: una sola función pública captura `modelo` + `internosInzoom`; los
// helpers son cierres internos. Pura: muta las apariencias del modelo en sitio.
//
// W3.1 (H1, parte 2 — núcleo compartido NO extraído, deuda diferida): este motor (bandas
// topológicas del bundle) y `canvas/layoutSugerido.ts` (grilla densa del OPD activo) son el MISMO
// funtor Modelo→Geometría implementado dos veces, pero con HEURÍSTICAS DISTINTAS: aquí el ancho de
// caja se deriva del TEXTO (8 px/char + cápsulas de estado, `anchoPorTexto`) y el contorno se
// dimensiona al contenido (`maxX + MARGEN`); allá se usa el `width` REAL de cada apariencia y el
// contorno sigue la fórmula canónica. Externos: aquí por ROL (agente/entrada/salida/instrumento,
// `rolYAnchorExterno`); allá por DIRECCIÓN del enlace. Fusionar estas heurísticas CAMBIARÍA bytes
// del bundle y píxeles del layout interactivo, por lo que NO se extrae hoy (regla W3.1: si extraer
// cambia un byte/píxel, no se extrae). Las CONSTANTES de in-zoom sí se unificaron (ver
// `canvas/constantesInzoom`). TODO(D5 del acta de consenso): converger ambos motores a un único
// funtor parametrizado (métrica de ancho + estrategia de externos como parámetros) — mejora de
// comportamiento, requiere re-pin del golden.
import type { Apariencia, ExtremoEnlace, Id, Modelo, Opd, TipoEnlace } from "../modelo/tipos";

/** Constantes de layout (tuneables): gaps, alto de banda, origen, márgenes. */
export const LAYOUT = { GAP_H: 90, GAP_SUB: 70, ROWH: 200, X0: 80, Y0: 150, GAP_OBJ: 50, MARGEN: 80 };

/**
 * Versión declarada del motor de layout canónico (W5.3/L6, componente del
 * `SelloProcedencia`). Se incrementa SOLO con un cambio deliberado de geometría
 * (protocolo re-pin del golden hd-opm); un bundle sellado con otra versión
 * reporta divergencia de procedencia sin tocar bytes.
 */
export const LAYOUT_VERSION = "1";
const TRANSFORMADORES = new Set<TipoEnlace>(["consumo", "resultado", "efecto"]);
const ESTRUCTURALES = new Set<TipoEnlace>(["agregacion", "exhibicion", "generalizacion", "clasificacion"]);

/**
 * Aplica el layout canónico completo sobre el modelo (muta en sitio): ajuste de anchos por texto →
 * orden-canónico (in-zoom de proceso / unfold / raíz plana) → normalización de contextos de
 * refinamiento (interno/externo) → centrado en el canvas. Requiere el mapa `internosInzoom` que el
 * autor pobló al consumir las agregaciones contorno→subproceso.
 */
export function aplicarLayoutCompleto(modelo: Modelo, internosInzoom: Map<Id, Set<Id>>): void {
  const opdsLayoutExterno = new Set<Id>();

  function entidadIdExtremo(extremo: ExtremoEnlace): Id | null {
    if (extremo.kind === "entidad") return extremo.id;
    return modelo.estados[extremo.id]?.entidadId ?? null;
  }

  function contornoLocal(opdId: Id): Apariencia | undefined {
    return Object.values(modelo.opds[opdId]!.apariencias).find((apariencia) => {
      const entidad = modelo.entidades[apariencia.entidadId];
      return entidad?.refinamientos?.descomposicion?.opdId === opdId;
    });
  }

  function anchoPorTexto(entidadId: Id): number {
    const e = modelo.entidades[entidadId];
    if (!e) return 190;
    const nombreW = e.nombre.length * 7.4 + 34;
    const estados = Object.values(modelo.estados).filter((s) => s.entidadId === entidadId);
    // Metrica alineada al render (BUG-7ae086 / pasada F3): capsula = 8 px/char + 12 de
    // padding (+6 si designada inicial/final, por el stroke grueso), gap 4 entre capsulas
    // y 16 de padding lateral de la region. Antes (6 px/char + cap 560) las cajas del
    // bundle nacian mas angostas que su render y la app las inflaba en vivo.
    const capsW = (s: { nombre: string; esInicial?: boolean; esFinal?: boolean; designaciones?: readonly string[] }) =>
      Math.max(52, s.nombre.length * 8 + 12 + (s.esInicial || s.esFinal || (s.designaciones ?? []).length > 0 ? 6 : 0));
    const estadosW = estados.length
      ? estados.reduce((acc, s) => acc + capsW(s), 0) + (estados.length - 1) * 4 + 16
      : 0;
    return Math.min(820, Math.ceil(Math.max(190, nombreW, estadosW)));
  }

  // Alto real de la caja en render: con estados visibles lleva la region de capsulas
  // (cosaHeight 60 + regionHeight 34 + padding ≈ 100). Declararlo en el bundle evita que
  // el render infle alturas que los colocadores no consideraron (solapes visuales tipo
  // V16-7 que el checker de cajas declaradas no ve).
  function altoPorTexto(entidadId: Id): number {
    const tieneEstados = Object.values(modelo.estados).some((s) => s.entidadId === entidadId);
    return tieneEstados ? 100 : 72;
  }

  function dimensionarPorTexto(ap: Apariencia): void {
    ap.width = anchoPorTexto(ap.entidadId);
    ap.height = Math.max(ap.height, altoPorTexto(ap.entidadId));
  }

  function ajustarAnchosPorTexto(): void {
    for (const opd of Object.values(modelo.opds)) {
      const contorno = contornoLocal(opd.id);
      if (!contorno || modelo.entidades[contorno.entidadId]?.tipo !== "proceso") continue;
      for (const ap of Object.values(opd.apariencias)) {
        if (ap.id === contorno.id) continue;
        dimensionarPorTexto(ap);
      }
    }
  }

  function nivelTopologicoInvocacion(subIds: Id[], invs: Array<[Id, Id]>): Map<Id, number> {
    const preds = new Map<Id, Id[]>();
    for (const id of subIds) preds.set(id, []);
    for (const [o, d] of invs) if (preds.has(d)) preds.get(d)!.push(o);
    const nivel = new Map<Id, number>();
    const enCurso = new Set<Id>();
    const calc = (id: Id): number => {
      if (nivel.has(id)) return nivel.get(id)!;
      if (enCurso.has(id)) return 0;
      enCurso.add(id);
      const ps = preds.get(id) ?? [];
      const n = ps.length === 0 ? 0 : Math.max(...ps.map(calc)) + 1;
      enCurso.delete(id);
      nivel.set(id, n);
      return n;
    };
    for (const id of subIds) calc(id);
    return nivel;
  }

  function subConectadoDe(opd: Opd, objId: Id, subIds: Set<Id>): Id {
    for (const ae of Object.values(opd.enlaces)) {
      const e = modelo.enlaces[ae.enlaceId];
      if (!e) continue;
      const o = entidadIdExtremo(e.origenId);
      const d = entidadIdExtremo(e.destinoId);
      if (o === objId && d && subIds.has(d)) return d;
      if (d === objId && o && subIds.has(o)) return o;
    }
    return "";
  }

  // Rol del externo respecto al subproceso que conecta + ancla de proximidad (flujo Dori).
  function rolYAnchorExterno(opd: Opd, objId: Id, subIds: Set<Id>): { zona: "top" | "left" | "right" | "bottom"; anchorEnt: Id | null } {
    let agente: Id | null = null, entrada: Id | null = null, salida: Id | null = null, instrumento: Id | null = null, cualquiera: Id | null = null;
    for (const ae of Object.values(opd.enlaces)) {
      const e = modelo.enlaces[ae.enlaceId];
      if (!e) continue;
      const o = entidadIdExtremo(e.origenId);
      const d = entidadIdExtremo(e.destinoId);
      if (o === objId && d && subIds.has(d)) {
        cualquiera = cualquiera ?? d;
        if (e.tipo === "agente") agente = agente ?? d;
        else if (e.tipo === "instrumento") instrumento = instrumento ?? d;
        else if (e.tipo === "consumo") entrada = entrada ?? d;
      } else if (d === objId && o && subIds.has(o)) {
        cualquiera = cualquiera ?? o;
        if (e.tipo === "resultado" || e.tipo === "efecto") salida = salida ?? o;
      }
    }
    if (agente) return { zona: "top", anchorEnt: agente };
    if (entrada) return { zona: "left", anchorEnt: entrada };
    if (salida) return { zona: "right", anchorEnt: salida };
    if (instrumento) return { zona: "bottom", anchorEnt: instrumento };
    return { zona: "bottom", anchorEnt: cualquiera };
  }

  function colocarExternosPorRol(opd: Opd, contorno: Apariencia, externos: Apariencia[], subIds: Set<Id>, posSub: Map<Id, { x: number; y: number }>): void {
    const M = 120;
    const GV = 48;
    const cx0 = contorno.x, cy0 = contorno.y, W = contorno.width, H = contorno.height;
    const esSecuencial = new Set([...posSub.values()].map((p) => p.y)).size > 1;
    const items = externos.map((ap) => {
      const { zona, anchorEnt } = rolYAnchorExterno(opd, ap.entidadId, subIds);
      const a = anchorEnt ? posSub.get(anchorEnt) : undefined;
      return {
        ap,
        sx: a ? a.x + 95 : cx0 + W / 2,
        sy: a ? a.y + 36 : cy0 + H / 2,
        lado: (zona === "right" ? "right" : "left") as "left" | "right",
        vert: (zona === "top" || zona === "left" ? "top" : "bottom") as "top" | "bottom",
      };
    });
    if (esSecuencial) {
      for (const lado of ["left", "right"] as const) {
        let cursor = cy0 - GV;
        for (const it of items.filter((i) => i.lado === lado).sort((a, b) => a.sy - b.sy)) {
          it.ap.y = Math.max(it.sy - it.ap.height / 2, cursor + GV);
          it.ap.x = lado === "left" ? cx0 - M - it.ap.width : cx0 + W + M;
          cursor = it.ap.y + it.ap.height;
        }
      }
    } else {
      for (const vert of ["top", "bottom"] as const) {
        let cursor = -Infinity;
        for (const it of items.filter((i) => i.vert === vert).sort((a, b) => a.sx - b.sx)) {
          const x = Math.max(it.sx - it.ap.width / 2, cursor + LAYOUT.GAP_H);
          it.ap.x = x;
          it.ap.y = vert === "top" ? cy0 - M - it.ap.height : cy0 + H + M;
          cursor = x + it.ap.width;
        }
      }
    }
    opdsLayoutExterno.add(opd.id);
  }

  function refinableDespliegueLocal(opd: Opd): Apariencia | undefined {
    return Object.values(opd.apariencias).find(
      (a) => modelo.entidades[a.entidadId]?.refinamientos?.despliegue?.opdId === opd.id,
    );
  }

  // Layout de UNFOLD (despliegue de objeto). V-78: posición = disposición espacial, no orden temporal.
  function layoutUnfold(opd: Opd, refinable: Apariencia): void {
    const refId = refinable.entidadId;
    const apById = new Map(Object.values(opd.apariencias).map((a) => [a.entidadId, a] as const));
    const partesIds = new Set<Id>();
    for (const ae of Object.values(opd.enlaces)) {
      const e = modelo.enlaces[ae.enlaceId];
      if (!e || !ESTRUCTURALES.has(e.tipo)) continue;
      const o = entidadIdExtremo(e.origenId);
      const d = entidadIdExtremo(e.destinoId);
      if (o === refId && d && apById.has(d)) partesIds.add(d);
    }
    const partes = [...partesIds].map((id) => apById.get(id)!);
    const otros = Object.values(opd.apariencias).filter((a) => a.id !== refinable.id && !partesIds.has(a.entidadId));
    for (const a of [...partes, ...otros]) dimensionarPorTexto(a);
    const MAXW = 2200, GAPx = 70, GAPy = 150;
    refinable.width = anchoPorTexto(refId);
    refinable.height = Math.max(refinable.height, 84);
    refinable.x = 80;
    refinable.y = 40;
    // filaWrap registra las filas resultantes para el post-proceso de drops (V16-5).
    const filaWrap = (items: Apariencia[], yStart: number, filas: Apariencia[][]): number => {
      let x = 80, y = yStart, hRow = 72;
      let fila: Apariencia[] = [];
      for (const a of items) {
        if (x > 80 && x + a.width > MAXW) {
          filas.push(fila); fila = [];
          x = 80; y += GAPy + Math.max(0, hRow - 72); hRow = 72;
        }
        a.x = x; a.y = y;
        x += a.width + GAPx; hRow = Math.max(hRow, a.height);
        fila.push(a);
      }
      if (fila.length) filas.push(fila);
      return y + hRow;
    };
    // V16-5: el drop vertical del bus de refinamiento baja en x = centro de cada caja.
    // Para cajas de filas 2+, ese drop atravesaba las cajas de la fila superior (visto
    // en U4 del bundle HODOM). Se corre cada caja hacia la derecha lo minimo necesario
    // para que su CENTRO caiga en un hueco de la fila inmediatamente superior.
    const alinearDropsAHuecos = (filas: Apariencia[][]): void => {
      for (let i = 1; i < filas.length; i++) {
        const sup = filas[i - 1]!;
        const inf = filas[i]!;
        const MARGEN = 14;
        const intervalos = sup
          .map((a) => [a.x - MARGEN, a.x + a.width + MARGEN] as const)
          .sort((p, q) => p[0] - q[0]);
        let xMin = 80;
        for (const a of inf) {
          let x = Math.max(a.x, xMin);
          let cx = x + a.width / 2;
          for (const [i0, i1] of intervalos) {
            if (cx > i0 && cx < i1) {
              cx = i1; // primer punto libre a la derecha del bloque superior
              x = cx - a.width / 2;
              if (x < xMin) { x = xMin; cx = x + a.width / 2; }
            }
          }
          a.x = Math.max(x, xMin);
          xMin = a.x + a.width + GAPx;
        }
      }
    };
    const filasPartes: Apariencia[][] = [];
    const filasOtros: Apariencia[][] = [];
    const yTrasPartes = filaWrap(partes, refinable.y + refinable.height + 150, filasPartes);
    filaWrap(otros, yTrasPartes + 150, filasOtros);
    alinearDropsAHuecos(filasPartes);
    alinearDropsAHuecos(filasOtros);
  }

  // SD raíz PLANO (sin refinable local): proceso central + objetos alrededor por rol.
  function layoutRaizPlana(opd: Opd): void {
    const aps = Object.values(opd.apariencias);
    if (aps.length === 0) return;
    for (const a of aps) dimensionarPorTexto(a);
    const grado = (a: Apariencia) =>
      Object.values(opd.enlaces).filter((ae) => {
        const e = modelo.enlaces[ae.enlaceId];
        return e && (entidadIdExtremo(e.origenId) === a.entidadId || entidadIdExtremo(e.destinoId) === a.entidadId);
      }).length;
    const procesos = aps.filter((a) => modelo.entidades[a.entidadId]?.tipo === "proceso");
    const central = (procesos.length ? procesos : aps.slice()).sort((a, b) => grado(b) - grado(a))[0]!;
    central.width = Math.max(anchoPorTexto(central.entidadId), 260);
    central.height = Math.max(central.height, 100);
    const CX = 900, CY = 520, M = 160, GV = 50, GH = 80;
    central.x = CX; central.y = CY;
    const ccx = CX + central.width / 2, ccy = CY + central.height / 2;
    const subIds = new Set([central.entidadId]);
    const zonas: Record<string, Apariencia[]> = { top: [], left: [], right: [], bottom: [] };
    for (const a of aps) {
      if (a === central) continue;
      zonas[rolYAnchorExterno(opd, a.entidadId, subIds).zona]!.push(a);
    }
    const fila = (items: Apariencia[], yOf: (a: Apariencia) => number) => {
      const total = items.reduce((s, a) => s + a.width + GH, 0) - GH;
      let x = ccx - total / 2;
      for (const a of items) { a.x = x; a.y = yOf(a); x += a.width + GH; }
    };
    const columna = (items: Apariencia[], xOf: (a: Apariencia) => number) => {
      const total = items.reduce((s, a) => s + a.height + GV, 0) - GV;
      let y = ccy - total / 2;
      for (const a of items) { a.x = xOf(a); a.y = y; y += a.height + GV; }
    };
    fila(zonas.top!, (a) => CY - M - a.height);
    fila(zonas.bottom!, () => CY + central.height + M);
    columna(zonas.left!, (a) => CX - M - a.width);
    columna(zonas.right!, () => CX + central.width + M);
  }

  function aplicarLayoutOrdenCanonico(): void {
    for (const opd of Object.values(modelo.opds)) {
      const contorno = contornoLocal(opd.id);
      if (!contorno || modelo.entidades[contorno.entidadId]?.tipo !== "proceso") {
        const refUnfold = refinableDespliegueLocal(opd);
        if (refUnfold) layoutUnfold(opd, refUnfold);
        else layoutRaizPlana(opd);
        continue;
      }

      const internosDeclarados = internosInzoom.get(opd.id) ?? new Set<Id>();
      const externosPadre = externosConectadosAlRefinableEnPadre(opd, contorno.entidadId);
      const internos = Object.values(opd.apariencias).filter(
        (a) => a.id !== contorno.id && esInternoDeInzoom(opd.id, a, internosDeclarados, externosPadre),
      );
      const subs = internos.filter((a) => modelo.entidades[a.entidadId]?.tipo === "proceso");
      const objs = internos.filter((a) => modelo.entidades[a.entidadId]?.tipo === "objeto");

      const subIdSet = new Set(subs.map((a) => a.entidadId));
      const invs: Array<[Id, Id]> = [];
      for (const ae of Object.values(opd.enlaces)) {
        const e = modelo.enlaces[ae.enlaceId];
        if (!e || e.tipo !== "invocacion") continue;
        const o = entidadIdExtremo(e.origenId);
        const d = entidadIdExtremo(e.destinoId);
        if (o && d && subIdSet.has(o) && subIdSet.has(d)) invs.push([o, d]);
      }
      const nivel = nivelTopologicoInvocacion([...subIdSet], invs);
      const esReactivo = (a: Apariencia) =>
        (nivel.get(a.entidadId) ?? 0) === 0 &&
        Object.values(opd.enlaces).some((ae) => {
          const e = modelo.enlaces[ae.enlaceId];
          return e?.modificador === "evento" && entidadIdExtremo(e.destinoId) === a.entidadId;
        });
      const reactivos = new Set(subs.filter(esReactivo).map((a) => a.entidadId));
      const maxNivelBase = Math.max(0, ...subs.filter((a) => !reactivos.has(a.entidadId)).map((a) => nivel.get(a.entidadId) ?? 0));
      const nivelEf = (a: Apariencia) => (reactivos.has(a.entidadId) ? maxNivelBase + 1 : nivel.get(a.entidadId) ?? 0);

      const maxNivel = subs.length ? Math.max(0, ...subs.map(nivelEf)) : -1;
      const bandas: Apariencia[][] = Array.from({ length: Math.max(0, maxNivel + 1) }, () => []);
      for (const a of subs) bandas[nivelEf(a)]!.push(a);
      const posSub = new Map<Id, { x: number; y: number }>();
      bandas.forEach((fila, b) => {
        let x = LAYOUT.X0;
        const y = LAYOUT.Y0 + b * LAYOUT.ROWH;
        for (const a of fila) {
          a.x = x;
          a.y = y;
          posSub.set(a.entidadId, { x, y });
          x += a.width + LAYOUT.GAP_SUB;
        }
      });

      const objsOrden = objs
        .map((o) => ({ o, subX: posSub.get(subConectadoDe(opd, o.entidadId, subIdSet))?.x ?? 1e9 }))
        .sort((p, q) => p.subX - q.subX)
        .map(({ o }) => o);
      const maxBandLen = Math.max(0, ...bandas.map((f) => f.length));
      let spineRight = LAYOUT.X0;
      for (const a of subs) spineRight = Math.max(spineRight, a.x + a.width);
      const spineBottom = LAYOUT.Y0 + (maxNivel + 1) * LAYOUT.ROWH;
      type Pos = { o: Apariencia; x: number; y: number };
      // (R26 fix F2 anti-aireado) dos estrategias; se elige por OPD la de contorno más chico.
      const filaAbajo = (): Pos[] => {
        const yObj = spineBottom + (subs.length ? LAYOUT.GAP_OBJ : 0);
        const maxCols = Math.max(4, maxBandLen);
        const out: Pos[] = [];
        let ox = LAYOUT.X0, oy = yObj, col = 0;
        for (const o of objsOrden) {
          if (col >= maxCols) { ox = LAYOUT.X0; oy += LAYOUT.ROWH; col = 0; }
          out.push({ o, x: ox, y: oy });
          ox += o.width + LAYOUT.GAP_H; col += 1;
        }
        return out;
      };
      const columnaDerecha = (): Pos[] => {
        const out: Pos[] = [];
        let cx = spineRight + LAYOUT.GAP_H, cy = LAYOUT.Y0, colW = 0;
        for (const o of objsOrden) {
          if (cy + o.height > spineBottom && cy > LAYOUT.Y0) { cx += colW + LAYOUT.GAP_H; cy = LAYOUT.Y0; colW = 0; }
          out.push({ o, x: cx, y: cy });
          cy += o.height + LAYOUT.GAP_OBJ; colW = Math.max(colW, o.width);
        }
        return out;
      };
      const areaDe = (place: Pos[]): number => {
        let mx = spineRight, my = spineBottom;
        for (const a of subs) { mx = Math.max(mx, a.x + a.width); my = Math.max(my, a.y + a.height); }
        for (const p of place) { mx = Math.max(mx, p.x + p.o.width); my = Math.max(my, p.y + p.o.height); }
        return mx * my;
      };
      const candA = filaAbajo();
      const candB = objsOrden.length ? columnaDerecha() : candA;
      const elegido = (objsOrden.length && areaDe(candB) < areaDe(candA)) ? candB : candA;
      for (const p of elegido) { p.o.x = p.x; p.o.y = p.y; }

      const externos = Object.values(opd.apariencias).filter((a) => a.id !== contorno.id && !internos.includes(a));
      const esSecuencial = bandas.filter((f) => f.length).length > 1;
      let hLadoMax = 0;
      if (esSecuencial) {
        const alt: Record<string, number> = { left: 0, right: 0 };
        for (const e of externos) {
          const z = rolYAnchorExterno(opd, e.entidadId, subIdSet).zona;
          alt[z === "right" ? "right" : "left"]! += (e.height || 72) + 48;
        }
        hLadoMax = Math.max(alt.left!, alt.right!);
      }

      const todos = [...subs, ...objs];
      const maxX = todos.length ? Math.max(...todos.map((a) => a.x + a.width)) : LAYOUT.X0 + 220;
      const maxY = todos.length ? Math.max(...todos.map((a) => a.y + a.height)) : LAYOUT.Y0 + 60;
      contorno.x = 40;
      contorno.y = 30;
      contorno.width = Math.max(maxX + LAYOUT.MARGEN - 40, 420);
      contorno.height = Math.max(maxY + LAYOUT.MARGEN - 30, 240, hLadoMax + 40);

      colocarExternosPorRol(opd, contorno, externos, subIdSet, posSub);
    }
  }

  function apareceEnAncestro(opdId: Id, entidadId: Id): boolean {
    let p = modelo.opds[opdId]?.padreId;
    while (p) {
      const ancestro = modelo.opds[p];
      if (!ancestro) break;
      if (Object.values(ancestro.apariencias).some((a) => a.entidadId === entidadId)) return true;
      p = ancestro.padreId;
    }
    return false;
  }

  function esInternoDeInzoom(opdId: Id, apariencia: Apariencia, internosDeclarados: Set<Id>, externosPadre: Set<Id>): boolean {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (!entidad) return false;
    if (internosDeclarados.has(entidad.id)) return true;
    if (entidad.tipo !== "objeto") return false;
    if (entidad.afiliacion === "ambiental") return false;
    if (externosPadre.has(entidad.id)) return false;
    if (apareceEnAncestro(opdId, entidad.id)) return false;
    return objetoTransformadoPorInterno(opdId, entidad.id, internosDeclarados);
  }

  function externosConectadosAlRefinableEnPadre(opd: Opd, refinableId: Id): Set<Id> {
    const externos = new Set<Id>();
    const padre = opd.padreId ? modelo.opds[opd.padreId] : undefined;
    if (!padre) return externos;
    for (const aparienciaEnlace of Object.values(padre.enlaces)) {
      const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
      if (!enlace) continue;
      const origenId = entidadIdExtremo(enlace.origenId);
      const destinoId = entidadIdExtremo(enlace.destinoId);
      if (origenId === refinableId && destinoId && destinoId !== refinableId) externos.add(destinoId);
      if (destinoId === refinableId && origenId && origenId !== refinableId) externos.add(origenId);
    }
    return externos;
  }

  function objetoTransformadoPorInterno(opdId: Id, objetoId: Id, internosDeclarados: Set<Id>): boolean {
    const opd = modelo.opds[opdId]!;
    return Object.values(opd.enlaces).some((aparienciaEnlace) => {
      const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
      if (!enlace || !TRANSFORMADORES.has(enlace.tipo)) return false;
      const origenId = entidadIdExtremo(enlace.origenId);
      const destinoId = entidadIdExtremo(enlace.destinoId);
      return (
        (origenId === objetoId && destinoId !== null && internosDeclarados.has(destinoId)) ||
        (destinoId === objetoId && origenId !== null && internosDeclarados.has(origenId))
      );
    });
  }

  function posicionExterna(contorno: Apariencia, apariencia: Apariencia, lado: "left" | "right", indice: number): { x: number; y: number } {
    const separacion = 132;
    const margenContorno = 96;
    const margenEntreCols = 40;
    const anchoColumna = 300;
    const capacidadColumna = Math.max(1, Math.floor((contorno.height - 64) / separacion));
    const columna = Math.floor(indice / capacidadColumna);
    const indiceEnColumna = indice % capacidadColumna;
    const offsetColumna = columna * (anchoColumna + margenEntreCols);
    return {
      x: lado === "left"
        ? contorno.x - apariencia.width - margenContorno - offsetColumna
        : contorno.x + contorno.width + margenContorno + offsetColumna,
      y: contorno.y + 64 + indiceEnColumna * separacion,
    };
  }

  // Normaliza el contexto de refinamiento (interno/externo) de cada apariencia en sitio.
  function normalizarContextosInzoom(): void {
    for (const opd of Object.values(modelo.opds).sort((a, b) => (a.ordenLocal ?? 0) - (b.ordenLocal ?? 0))) {
      const contorno = contornoLocal(opd.id);
      if (!contorno) continue;
      const internosDeclarados = internosInzoom.get(opd.id) ?? new Set<Id>();
      const externosPadre = externosConectadosAlRefinableEnPadre(opd, contorno.entidadId);
      const indicesPorLado = { left: 0, right: 0 };
      for (const [id, apariencia] of Object.entries(opd.apariencias)) {
        if (id === contorno.id) continue;
        if (esInternoDeInzoom(opd.id, apariencia, internosDeclarados, externosPadre)) {
          apariencia.contextoRefinamiento = {
            tipo: "descomposicion",
            refinableEntidadId: contorno.entidadId,
            rol: "interno",
            contenedorAparienciaId: contorno.id,
          };
          continue;
        }
        const yaColocado = opdsLayoutExterno.has(opd.id);
        const lado: "left" | "right" = indicesPorLado.left <= indicesPorLado.right ? "left" : "right";
        const indice = indicesPorLado[lado]++;
        if (!yaColocado) {
          const pos = posicionExterna(contorno, apariencia, lado, indice);
          apariencia.x = pos.x;
          apariencia.y = pos.y;
        }
        apariencia.contextoRefinamiento = {
          tipo: "descomposicion",
          refinableEntidadId: contorno.entidadId,
          rol: "externo",
          contenedorAparienciaId: contorno.id,
        };
      }
    }
  }

  // Desplaza cada OPD para centrar su bbox en el canvas (3600,2600 sobre paper 7200x5200).
  function centrarOpdsEnCanvas(): void {
    const CENTRO_CANVAS_X = 3600;
    const CENTRO_CANVAS_Y = 2600;
    for (const opd of Object.values(modelo.opds)) {
      const apariencias = Object.values(opd.apariencias);
      if (apariencias.length === 0) continue;
      let xMin = Infinity, yMin = Infinity, xMax = -Infinity, yMax = -Infinity;
      for (const ap of apariencias) {
        xMin = Math.min(xMin, ap.x);
        yMin = Math.min(yMin, ap.y);
        xMax = Math.max(xMax, ap.x + ap.width);
        yMax = Math.max(yMax, ap.y + ap.height);
      }
      const dx = CENTRO_CANVAS_X - (xMin + xMax) / 2;
      const dy = CENTRO_CANVAS_Y - (yMin + yMax) / 2;
      if (dx === 0 && dy === 0) continue;
      for (const ap of apariencias) { ap.x += dx; ap.y += dy; }
    }
  }

  ajustarAnchosPorTexto();
  aplicarLayoutOrdenCanonico();
  normalizarContextosInzoom();
  centrarOpdsEnCanvas();
}
