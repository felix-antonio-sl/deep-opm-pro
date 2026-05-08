import { entidadIdDeExtremo } from "../modelo/extremos";
import { CANON, naturalezaDeEnlace } from "../modelo/constantes";
import { dentroDeApariencia, contenedorRefinamiento } from "../modelo/layout";
import { refrescarEnlacesExternosDerivados } from "../modelo/operaciones/refinamiento/proyeccion";
import { RESIZE_MIN } from "./grid";
import type { Apariencia, Id, Modelo, Posicion, Resultado, TipoEnlace } from "../modelo/tipos";

/**
 * Auto-layout heuristico para el OPD activo.
 *
 * Decision arquitectonica: OPCloud no expone un autolayout global (no usa
 * dagre/elk/cose). Su `arrangeObjects` (uiArrangement.model.ts) solo alinea
 * direccionalmente apariencias seleccionadas. El layout efectivo de OPCloud
 * proviene de heuristicas geometricas locales aplicadas durante operaciones
 * canonicas: `OpmVisualThing.inzoom` (in-zoom), `unfold`/`addAggregations`
 * (despliegue), `beautifyInzoomSubThings` (recentrado de subthings).
 *
 * Replicamos esas heuristicas como autolayout integrado:
 *
 * - **Caso A (OPD con contorno)**: el OPD activo refina otro proceso/objeto.
 *   Aplicamos el patron OPCloud `inzoom`:
 *   - contorno fijo en (150, 90), dimensiones recalculadas para alojar a los
 *     embedded children apilados verticalmente con yOffset=100, gap=30,
 *     centrados en X (igual a `OpmVisualThing.inzoom` y `beautifyInzoomSubThings`).
 *   - externos (apariencias FUERA del bbox del contorno) en dos columnas:
 *     entradas a la izquierda (x=24), salidas a la derecha (x=contorno.right+24).
 *
 * - **Caso B (SD raiz / sin contorno)**: BFS layered top-down sobre enlaces
 *   procedurales (los estructurales se resuelven via despliegue ortogonal y
 *   no constrinen el flujo top-down del SD). Cada nivel se centra horizontal-
 *   mente alrededor del centro X global, con paso configurable. Apariencias
 *   sin enlaces visibles van al ultimo nivel.
 *
 * Refs canon:
 * - opm-extracted/src/app/models/VisualPart/OpmVisualThing.ts:184-244 (inzoom)
 *   y :306-314 (beautifyInzoomSubThings).
 * - opm-extracted/src/app/models/uiArrangement.model.ts (alineacion direccional).
 * - app/src/modelo/operaciones/refinamiento/descomposicion.ts:35-42 (constantes
 *   INZOOM ya replicadas).
 *
 * Funcion pura: no muta el modelo. Quien aplica decide undoability via store.
 */
export interface OpcionesLayoutSugerido {
  /** Coordenada X del primer nivel en caso B. Default 80. */
  origenX?: number;
  /** Coordenada Y del primer nivel en caso B. Default 80. */
  origenY?: number;
  /** Separacion horizontal entre apariencias del mismo nivel. Default 60. */
  gapHorizontal?: number;
  /** Separacion vertical entre niveles. Default 100. */
  gapVertical?: number;
}

export interface PosicionSugerida {
  aparienciaId: Id;
  x: number;
  y: number;
  /** Width/height sugeridos cuando difieren del actual (solo contornos). */
  width?: number;
  height?: number;
}

const INZOOM = {
  /** Padding vertical superior dentro del contorno (espacio para titulo). */
  paddingSuperior: 100,
  /** Padding inferior dentro del contorno (espacio bajo el ultimo subthing). */
  paddingInferior: 65,
  /** Separacion vertical entre subthings apilados dentro del contorno. */
  gapInterno: 30,
  /** Multiplicador de ancho del contorno relativo a `cosaWidth`. */
  multAncho: 3,
  /** Numero minimo de subthings considerado para dimensionar el contorno. */
  minSubthings: 3,
  /** Padding horizontal izq/der de externos respecto al contorno. */
  margenExterno: 24,
  /** Separacion vertical entre externos apilados en cada columna. */
  gapExterno: 32,
} as const;

export function calcularLayoutSugerido(
  modelo: Modelo,
  opdId: Id,
  opciones: OpcionesLayoutSugerido = {},
): PosicionSugerida[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const apariencias = Object.values(opd.apariencias);
  if (apariencias.length === 0) return [];

  const contorno = contenedorRefinamiento(modelo, opdId);
  if (contorno) {
    return layoutConContorno(modelo, opdId, contorno, apariencias);
  }
  return layoutLayered(modelo, opdId, apariencias, opciones);
}

/**
 * Caso A: OPD refina otro proceso/objeto. Aplica patron `inzoom` OPCloud.
 *
 * - Embedded children (apariencias dentro del bbox del contorno) se apilan
 *   verticalmente, centrados en X, con yOffset=100 y gap=30.
 * - Contorno mantiene xPos canonico (150, 90) por convencion (descomposicion.ts:71)
 *   y se redimensiona para alojar a los embedded reales (no los iniciales).
 * - Externos quedan en dos columnas: entradas a la izquierda, salidas a la derecha.
 */
function layoutConContorno(
  modelo: Modelo,
  opdId: Id,
  contorno: { id: Id; entidadId: Id; x: number; y: number; width: number; height: number },
  apariencias: Apariencia[],
): PosicionSugerida[] {
  const posiciones: PosicionSugerida[] = [];

  // Particiona apariencias en embedded vs externos via bbox del contorno.
  const embedded: Apariencia[] = [];
  const externos: Apariencia[] = [];
  for (const apariencia of apariencias) {
    if (apariencia.id === contorno.id) continue;
    if (dentroDeApariencia(apariencia, contorno)) embedded.push(apariencia);
    else externos.push(apariencia);
  }

  // Orden estable embedded: por orden de creacion (id alfabetico) preserva el
  // orden temporal de subprocesos generados via descomponerProceso.
  embedded.sort((a, b) => a.id.localeCompare(b.id, "es-CL"));

  // Dimensiones canonicas del contorno (estilo OpmVisualThing.inzoom):
  //   width = cosaWidth * 3
  //   height = (cosaHeight + gapInterno) * max(N, minSubthings) + paddingSuperior + paddingInferior
  const subthings = Math.max(INZOOM.minSubthings, embedded.length);
  const contornoWidth = CANON.dims.cosaWidth * INZOOM.multAncho;
  const contornoHeight = (CANON.dims.cosaHeight + INZOOM.gapInterno) * subthings + INZOOM.paddingSuperior + INZOOM.paddingInferior;

  // Origen del contorno: respeta la posicion previa si era razonable; si no,
  // colapsa al canonico (150, 90) heredado de descomposicion.ts.
  const contornoX = Number.isFinite(contorno.x) && contorno.x >= 0 ? Math.min(contorno.x, 150) : 150;
  const contornoY = Number.isFinite(contorno.y) && contorno.y >= 0 ? Math.min(contorno.y, 90) : 90;

  posiciones.push({
    aparienciaId: contorno.id,
    x: contornoX,
    y: contornoY,
    width: contornoWidth,
    height: contornoHeight,
  });

  // Embedded children: vertical column, centrados horizontal, yOffset=100.
  const childCenterX = contornoX + contornoWidth / 2;
  let yCursor = contornoY + INZOOM.paddingSuperior;
  for (const child of embedded) {
    const x = Math.round(childCenterX - child.width / 2);
    const y = Math.round(yCursor);
    posiciones.push({ aparienciaId: child.id, x, y });
    yCursor += child.height + INZOOM.gapInterno;
  }

  // Externos: clasifica por direccion del enlace en el OPD activo.
  // - entradas a la izquierda (x = contornoX - cosaWidth - margenExterno)
  // - salidas a la derecha (x = contornoX + contornoWidth + margenExterno)
  //
  // Para descomposicion de procesos los enlaces externos del SD raiz se
  // proyectan a subprocesos individuales (proyectarEnlacesExternosEnRefinamiento),
  // NO al contorno. Por eso clasificamos contra el conjunto {contorno U embedded}:
  // un externo que es origen de algun enlace hacia ese conjunto es "entrada",
  // y destino de algun enlace desde ese conjunto es "salida".
  const referenciaIds = new Set<Id>([contorno.entidadId, ...embedded.map((a) => a.entidadId)]);
  const { entradas, salidas } = clasificarExternosPorDireccion(modelo, opdId, referenciaIds, externos);

  const xIzq = Math.max(0, contornoX - CANON.dims.cosaWidth - INZOOM.margenExterno);
  const xDer = contornoX + contornoWidth + INZOOM.margenExterno;

  // Distribucion vertical: centra el bloque de cada columna alrededor del
  // centro vertical del contorno para no apilar todos arriba.
  posicionarColumna(entradas, xIzq, contornoY, contornoHeight, INZOOM.gapExterno, posiciones);
  posicionarColumna(salidas, xDer, contornoY, contornoHeight, INZOOM.gapExterno, posiciones);

  return posiciones;
}

function posicionarColumna(
  lista: Apariencia[],
  x: number,
  contornoY: number,
  contornoHeight: number,
  gap: number,
  acumulador: PosicionSugerida[],
): void {
  if (lista.length === 0) return;
  const alturaTotal = lista.reduce((sum, a) => sum + a.height, 0) + gap * (lista.length - 1);
  // Centra verticalmente respecto al contorno; si no cabe arriba, alinea al top.
  let yCursor = Math.max(contornoY, contornoY + (contornoHeight - alturaTotal) / 2);
  for (const apariencia of lista) {
    acumulador.push({ aparienciaId: apariencia.id, x: Math.round(x), y: Math.round(yCursor) });
    yCursor += apariencia.height + gap;
  }
}

function clasificarExternosPorDireccion(
  modelo: Modelo,
  opdId: Id,
  referenciaIds: Set<Id>,
  externos: Apariencia[],
): { entradas: Apariencia[]; salidas: Apariencia[] } {
  const opd = modelo.opds[opdId];
  if (!opd) return { entradas: [], salidas: externos };

  // entradaPara: externo aparece como ORIGEN de un enlace hacia algun nodo
  //   del conjunto referencia (contorno + embedded) -> el externo "entra".
  // salidaPara: externo aparece como DESTINO de un enlace desde algun nodo
  //   del conjunto referencia -> el externo "sale".
  const entradaPara = new Set<Id>();
  const salidaPara = new Set<Id>();
  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (!origen || !destino) continue;
    if (origen && referenciaIds.has(destino)) entradaPara.add(origen);
    if (destino && referenciaIds.has(origen)) salidaPara.add(destino);
  }

  const entradas: Apariencia[] = [];
  const salidas: Apariencia[] = [];
  for (const externo of externos) {
    const esEntrada = entradaPara.has(externo.entidadId);
    const esSalida = salidaPara.has(externo.entidadId);
    if (esEntrada && !esSalida) entradas.push(externo);
    else if (esSalida && !esEntrada) salidas.push(externo);
    else if (esEntrada && esSalida) {
      // Caso ambiguo (efecto): por convencion canonica OPCloud, el efecto
      // (read-modify) se renderiza al lado del proceso. Sin senal mas fuerte,
      // lo dejamos a la derecha para no apilarlo con las entradas puras.
      salidas.push(externo);
    } else entradas.push(externo);
  }
  // Orden estable.
  entradas.sort((a, b) => a.id.localeCompare(b.id, "es-CL"));
  salidas.sort((a, b) => a.id.localeCompare(b.id, "es-CL"));
  return { entradas, salidas };
}

/**
 * Caso B: OPD raiz o sin contorno. BFS layered top-down sobre enlaces
 * procedurales del OPD, con cada nivel centrado horizontal alrededor del
 * centro X global del nivel mas ancho. Estructurales (agregacion/exhibicion/
 * generalizacion/clasificacion) se ignoran para el ranking porque su
 * semantica se materializa en OPDs de despliegue, no en orden top-down.
 */
function layoutLayered(
  modelo: Modelo,
  opdId: Id,
  apariencias: Apariencia[],
  opciones: OpcionesLayoutSugerido,
): PosicionSugerida[] {
  const origenX = opciones.origenX ?? 80;
  const origenY = opciones.origenY ?? 80;
  const gapH = opciones.gapHorizontal ?? 60;
  const gapV = opciones.gapVertical ?? 100;

  const opd = modelo.opds[opdId];
  if (!opd) return [];

  const aparienciaPorEntidad = new Map<Id, Apariencia>();
  for (const apariencia of apariencias) aparienciaPorEntidad.set(apariencia.entidadId, apariencia);

  // Grafo dirigido entidad->entidad solo con enlaces procedurales del OPD.
  // Estructurales se descartan: su orden top-down no aplica al SD.
  const aristas: Array<{ origen: Id; destino: Id; tipo: TipoEnlace }> = [];
  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    if (naturalezaDeEnlace(enlace.tipo) !== "procedural") continue;
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (!origen || !destino || origen === destino) continue;
    if (!aparienciaPorEntidad.has(origen) || !aparienciaPorEntidad.has(destino)) continue;
    aristas.push({ origen, destino, tipo: enlace.tipo });
  }

  const entradasPorEntidad = new Map<Id, number>();
  const salidasPorEntidad = new Map<Id, Id[]>();
  for (const apariencia of apariencias) {
    entradasPorEntidad.set(apariencia.entidadId, 0);
    salidasPorEntidad.set(apariencia.entidadId, []);
  }
  for (const arista of aristas) {
    entradasPorEntidad.set(arista.destino, (entradasPorEntidad.get(arista.destino) ?? 0) + 1);
    salidasPorEntidad.get(arista.origen)?.push(arista.destino);
  }

  // BFS por niveles: arranca con todas las raices conectadas.
  const nivelPorEntidad = new Map<Id, number>();
  const cola: Id[] = [];
  for (const apariencia of apariencias) {
    const entradas = entradasPorEntidad.get(apariencia.entidadId) ?? 0;
    const salidas = (salidasPorEntidad.get(apariencia.entidadId) ?? []).length;
    if (entradas === 0 && salidas > 0) {
      nivelPorEntidad.set(apariencia.entidadId, 0);
      cola.push(apariencia.entidadId);
    }
  }
  while (cola.length > 0) {
    const actual = cola.shift()!;
    const nivelActual = nivelPorEntidad.get(actual) ?? 0;
    const vecinos = salidasPorEntidad.get(actual) ?? [];
    for (const vecino of vecinos) {
      const nivelExistente = nivelPorEntidad.get(vecino);
      const candidato = nivelActual + 1;
      if (nivelExistente === undefined || candidato > nivelExistente) {
        nivelPorEntidad.set(vecino, candidato);
        cola.push(vecino);
      }
    }
  }

  // Apariencias sin alcance (ciclos puros, huerfanas) caen al ultimo nivel.
  let nivelMaximo = 0;
  for (const nivel of nivelPorEntidad.values()) {
    if (nivel > nivelMaximo) nivelMaximo = nivel;
  }
  const huerfanas: Id[] = [];
  for (const apariencia of apariencias) {
    if (!nivelPorEntidad.has(apariencia.entidadId)) huerfanas.push(apariencia.entidadId);
  }
  if (huerfanas.length > 0) {
    nivelMaximo += 1;
    for (const id of huerfanas) nivelPorEntidad.set(id, nivelMaximo);
  }

  // Agrupa apariencias por nivel; orden intra-nivel: procesos al centro,
  // objetos a izquierda y derecha alternados (mejor lectura SD).
  const aparienciasPorNivel = new Map<number, Apariencia[]>();
  for (const apariencia of apariencias) {
    const nivel = nivelPorEntidad.get(apariencia.entidadId) ?? 0;
    if (!aparienciasPorNivel.has(nivel)) aparienciasPorNivel.set(nivel, []);
    aparienciasPorNivel.get(nivel)!.push(apariencia);
  }
  for (const lista of aparienciasPorNivel.values()) {
    lista.sort((a, b) => ordenIntraNivel(modelo, a, b));
  }

  // Calcula ancho de cada nivel para centrar todos alrededor del centro X
  // del nivel mas ancho. Esto evita el efecto "todos pegados a la izquierda"
  // y produce simetria visual estilo SD canonico.
  let anchoMaximo = 0;
  const anchoPorNivel = new Map<number, number>();
  for (const [nivel, lista] of aparienciasPorNivel) {
    const ancho = lista.reduce((sum, a) => sum + a.width, 0) + gapH * Math.max(0, lista.length - 1);
    anchoPorNivel.set(nivel, ancho);
    if (ancho > anchoMaximo) anchoMaximo = ancho;
  }
  const centroX = origenX + anchoMaximo / 2;

  const posiciones: PosicionSugerida[] = [];
  for (const [nivel, lista] of [...aparienciasPorNivel.entries()].sort((a, b) => a[0] - b[0])) {
    const y = origenY + nivel * gapV;
    const ancho = anchoPorNivel.get(nivel) ?? 0;
    let x = centroX - ancho / 2;
    for (const apariencia of lista) {
      posiciones.push({ aparienciaId: apariencia.id, x: Math.round(x), y: Math.round(y) });
      x += apariencia.width + gapH;
    }
  }

  return posiciones;
}

/**
 * Orden intra-nivel: procesos al centro, objetos alrededor.
 *
 * Heuristica: ordenamos por (tipo, id). Procesos primero, luego objetos.
 * Caller centra el bloque. Esto coloca procesos al centro de su banda y
 * objetos a los flancos cuando hay mezcla.
 */
function ordenIntraNivel(modelo: Modelo, a: Apariencia, b: Apariencia): number {
  const ea = modelo.entidades[a.entidadId];
  const eb = modelo.entidades[b.entidadId];
  const ta = ea?.tipo === "proceso" ? 0 : 1;
  const tb = eb?.tipo === "proceso" ? 0 : 1;
  if (ta !== tb) return ta - tb;
  return a.id.localeCompare(b.id, "es-CL");
}

/**
 * Aplica las posiciones (y dimensiones para contornos) sugeridas al modelo
 * en un solo batch. Devuelve el modelo modificado (Resultado<Modelo>) sin
 * tocar el store; el caller decide si commitear (undoable) o descartar.
 *
 * Implementacion: muta directamente el OPD activo con todas las posiciones a
 * la vez para evitar que el clamp interno de `moverAparienciaPorId` (HU-12.020,
 * apariencias.ts:63-72) re-encierre apariencias que el layout deliberadamente
 * coloca FUERA del bbox del contorno (caso A: externos en columnas izq/der).
 * Ese clamp es correcto para drag interactivo, pero contraproducente cuando
 * el algoritmo ya conoce las dimensiones canonicas del contorno y necesita
 * posicionar externos por fuera de el. Tras el batch se invoca
 * `refrescarEnlacesExternosDerivados` igual que las operaciones canonicas.
 */
export function aplicarLayoutSugerido(
  modelo: Modelo,
  opdId: Id,
  opciones: OpcionesLayoutSugerido = {},
): Resultado<Modelo> {
  const posiciones = calcularLayoutSugerido(modelo, opdId, opciones);
  if (posiciones.length === 0) return { ok: true, value: modelo };

  const opd = modelo.opds[opdId];
  if (!opd) return { ok: false, error: `OPD no existe: ${opdId}` };

  const nuevasApariencias: Record<Id, Apariencia> = { ...opd.apariencias };
  let huboCambio = false;
  for (const pos of posiciones) {
    const apariencia = nuevasApariencias[pos.aparienciaId];
    if (!apariencia) continue;
    const nx = pos.x;
    const ny = pos.y;
    const nw = pos.width !== undefined ? Math.max(RESIZE_MIN.width, pos.width) : apariencia.width;
    const nh = pos.height !== undefined ? Math.max(RESIZE_MIN.height, pos.height) : apariencia.height;
    if (
      apariencia.x === nx &&
      apariencia.y === ny &&
      apariencia.width === nw &&
      apariencia.height === nh
    ) continue;
    huboCambio = true;
    nuevasApariencias[pos.aparienciaId] = {
      ...apariencia,
      x: nx,
      y: ny,
      width: nw,
      height: nh,
    };
  }

  if (!huboCambio) return { ok: true, value: modelo };

  const siguiente: Modelo = {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: nuevasApariencias,
      },
    },
  };
  return refrescarEnlacesExternosDerivados(siguiente, opdId);
}

/** Helper: dimension total que ocuparia el preview (sin mutar). */
export function dimensionesLayoutSugerido(
  modelo: Modelo,
  opdId: Id,
  opciones: OpcionesLayoutSugerido = {},
): { width: number; height: number; nivelesUsados: number } {
  const posiciones = calcularLayoutSugerido(modelo, opdId, opciones);
  if (posiciones.length === 0) return { width: 0, height: 0, nivelesUsados: 0 };
  const opd = modelo.opds[opdId];
  let maxX = 0;
  let maxY = 0;
  const nivelesY = new Set<number>();
  for (const pos of posiciones) {
    const apariencia = opd?.apariencias[pos.aparienciaId];
    const w = pos.width ?? apariencia?.width ?? CANON.dims.cosaWidth;
    const h = pos.height ?? apariencia?.height ?? CANON.dims.cosaHeight;
    nivelesY.add(pos.y);
    if (pos.x + w > maxX) maxX = pos.x + w;
    if (pos.y + h > maxY) maxY = pos.y + h;
  }
  return { width: maxX, height: maxY, nivelesUsados: nivelesY.size };
}

export type Posicion2D = Posicion;
