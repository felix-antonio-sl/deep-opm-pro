// CodexSelectionAnnotation — única voz funcional de la selección (Codex rev2).
//
// ui-forja/02-components §5 + 08-jointjs-styling §6.2. Overlay HTML (NO
// elementTool JointJS, V-202: affordance UI, no gramática OPM) posicionado
// sobre el contenedor del paper (`canvas-pane`) leyendo la transformación de
// coordenadas del adaptador del canvas (`leerBboxOverlayCells`, vía
// CanvasAdapterContext).
//
// Ronda Codex v2 · L4 — «una voz»: esta anotación dejó de ser decorativa y
// absorbió las acciones que vivían en `BarraHerramientasElemento` (la caja de
// chips). Para no romper el contrato e2e/unit existente preserva los mismos
// `data-testid` (`barra-herramientas-elemento`, `barra-<accion>`,
// `barra-resumen-*`, `barra-live-region`), `role="toolbar"`, `aria-label`,
// `aria-keyshortcuts`, y los handlers de cada acción. La presentación es
// tipográfica Codex (palabras separadas por `·`, sin botones-caja) en vez de la
// barra blanca flotante; pero la semántica accesible es idéntica.
//
// Anatomía (§5):
//   ※ descomponer · desplegar · estado · alias · inspector
//     ─────────────────────────────────────────────
//     o.06 · objeto · informacional · sistémico
//
// Toggle del Inspector lateral: en el shell Codex la marginalia (Inspector) es
// persistente por defecto; las acciones `inspector`/`mas-opciones` enfocan y
// hacen scroll al pane en vez de colapsar el chrome (territorio App.tsx, no L4).

import { createPortal } from "preact/compat";
import { useEffect, useMemo, useState } from "preact/hooks";
import type { dia } from "jointjs";
import { useBarraHerramientasElementoViewModel } from "../../app/viewmodels/barraHerramientasElementoViewModel";
import { useZustandEditabilityPort } from "../../app/ports/zustandEditabilityPort";
import {
  accionesParaContextoBarra,
  ariaLabelBarra,
  atajoAria,
  resolverContextoBarra,
  textoLiveBarra,
  textoResumenEnlaceBarra,
  type AccionBarra,
  type AccionBarraId,
  type ContextoBarraSeleccion,
} from "../BarraHerramientasElemento";
import type { Id } from "../../modelo/tipos";
import type { ModoDespliegueObjeto, TipoRefinamiento } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import type { RefinamientoPendiente } from "../../store/tipos";
import { runTutorPolicy } from "../../tutor/politica";
import type { KnowledgeLens, TutorIntervention } from "../../tutor/tipos";
import { useCanvasPaper } from "../CanvasAdapterContext";
import { abrirSeccionesDe } from "../inspector/seccionColapso";
import { tokens } from "../tokens";
import { useTutorContent } from "../useTutorContent";
import { TutorFoundationLinks } from "../TutorDetails";
import { GLIFO_REF, GLIFO_SEP } from "./glifos";

const OFFSET = 10;
const PADDING_VIEWPORT = 8;
const ALTO_ESTIMADO = 46;
const ANCHO_ESTIMADO = 300;
const ALTO_FORMULARIO_REFINAMIENTO = 390;
const ANCHO_FORMULARIO_REFINAMIENTO = 420;

export interface AccionAnotacion {
  label: string;
  /** primaria → italic + bold (§5). */
  primary?: boolean;
  /** destructiva → italic crimson (§5). */
  danger?: boolean;
}

interface PosicionAnotacion {
  left: number;
  top: number;
  placement: "arriba" | "abajo";
}

export function CodexSelectionAnnotation() {
  const {
    modelo,
    opdActivoId,
    seleccionId,
    enlaceSeleccionId,
    seleccionados,
    agregarEstadoSmart,
    descomponer,
    desplegar,
    abrirModalImagen,
    eliminarSeleccion,
    conectarSeleccionAlTodo,
    traerEnlacesEntreSeleccionadas,
    alinearSeleccion,
    distribuirSeleccion,
  } = useBarraHerramientasElementoViewModel();
  const paper = useCanvasPaper();
  const [posicion, setPosicion] = useState<PosicionAnotacion | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const refinamientoPendiente = useOpmStore((s) => s.refinamientoPendiente);
  const confirmarRefinamientoPendiente = useOpmStore((s) => s.confirmarRefinamientoPendiente);
  const cancelarRefinamientoPendiente = useOpmStore((s) => s.cancelarRefinamientoPendiente);

  const contexto = useMemo(
    () => resolverContextoBarra(modelo, opdActivoId, seleccionId, enlaceSeleccionId, seleccionados),
    [enlaceSeleccionId, modelo, opdActivoId, seleccionados, seleccionId],
  );

  // El shell Codex monta la marginalia (Inspector) de forma persistente; estas
  // acciones la enfocan en vez de colapsar el chrome (App.tsx, fuera de L4).
  const abrirInspector = () => enfocarSeccionInspector("inspector-pane");
  // Ley silencio-cero (C-1): en solo lectura (modo simulación, vista derivada)
  // la anotación no ofrece acciones de edición — invitarían a gestos que el
  // commit rechazaría.
  const { readOnly } = useZustandEditabilityPort();
  const acciones = useMemo(
    () => accionesParaContextoBarra(contexto, true, readOnly).filter((a) => a.visible),
    [contexto, readOnly],
  );

  const entidad = contexto?.tipo === "entidad" ? contexto.entidad : null;
  const enlace = contexto?.tipo === "enlace" ? contexto.enlace : null;

  // El portal se ancla al `canvas-pane`, localizado desde el host del paper.
  useEffect(() => {
    setHost(canvasPaneDePaper(paper));
  }, [paper]);

  useEffect(() => {
    if (!paper || !host || !contexto || acciones.length === 0) {
      setPosicion(null);
      return undefined;
    }
    let cancelado = false;
    const actualizar = () => {
      if (cancelado) return;
      // Coordenadas en píxeles de cliente leídas de las vistas DOM de las celdas
      // ancla, convertidas a coords relativas al `canvas-pane` (host del portal)
      // restando su bounding rect. Evita razonar sobre el sistema de coordenadas
      // del paper (scroll del viewport + transform de zoom) y se mantiene exacto
      // bajo scroll/zoom.
      const rectCliente = rectClienteDeCeldas(paper, contexto.anchorCellIds);
      if (!rectCliente) {
        setPosicion(null);
        return;
      }
      const h = host.getBoundingClientRect();
      const visible =
        rectCliente.bottom > h.top &&
        rectCliente.top < h.bottom &&
        rectCliente.right > h.left &&
        rectCliente.left < h.right;
      if (!visible) {
        setPosicion(null);
        return;
      }
      const rectEnHost = {
        x: rectCliente.left - h.left,
        y: rectCliente.top - h.top,
        width: rectCliente.width,
        height: rectCliente.height,
      };
      setPosicion(posicionarAnotacion(rectEnHost, host.clientHeight, {
        anchoCanvas: host.clientWidth,
        anchoEstimado: refinamientoPendiente ? ANCHO_FORMULARIO_REFINAMIENTO : ANCHO_ESTIMADO,
        altoEstimado: refinamientoPendiente ? ALTO_FORMULARIO_REFINAMIENTO : ALTO_ESTIMADO,
      }));
    };
    const onFrame = () => requestAnimationFrame(actualizar);
    actualizar();
    const paperEvents = paper as unknown as { on(e: string, cb: () => void): void; off(e: string, cb: () => void): void };
    paperEvents.on("render:done scale translate transform resize", actualizar);
    window.addEventListener("resize", onFrame);
    const viewport = viewportDePaper(paper);
    viewport?.addEventListener("scroll", onFrame, { passive: true });
    return () => {
      cancelado = true;
      paperEvents.off("render:done scale translate transform resize", actualizar);
      window.removeEventListener("resize", onFrame);
      viewport?.removeEventListener("scroll", onFrame);
    };
  }, [acciones.length, contexto, host, paper, refinamientoPendiente]);

  if (!contexto || !posicion || !host) return null;

  const handlers: Record<AccionBarraId, () => void> = {
    "cambiar-tipo-enlace": () => {
      if (!enlace) return;
      abrirInspector();
      enfocarSeccionInspector("inspector-panel-enlace-propiedades");
    },
    "agregar-estado": () => {
      if (entidad?.tipo === "objeto") agregarEstadoSmart();
    },
    inzoom: () => descomponer(),
    unfold: () => desplegar(),
    "editar-alias": () => {
      if (!entidad) return;
      abrirInspector();
      enfocarSeccionInspector("inspector-seccion-alias");
    },
    "editar-imagen": () => {
      if (entidad?.tipo === "objeto") abrirModalImagen(entidad.id);
    },
    "eliminar-seleccion": () => eliminarSeleccion(),
    "agregar-como-partes": () => {
      if (seleccionados.length < 2) return;
      const todo = seleccionados[seleccionados.length - 1];
      if (todo) conectarSeleccionAlTodo(todo, "agregacion");
    },
    "traer-enlaces": () => traerEnlacesEntreSeleccionadas(),
    "alinear-seleccion": () => alinearSeleccion("izq"),
    "distribuir-seleccion": () => distribuirSeleccion("horizontal"),
    "mas-opciones": () => abrirInspector(),
  };

  const { marca, marcaGrande } = marcaDeContexto(contexto);

  if (refinamientoPendiente) {
    return createPortal(
      <FormularioRefinamiento
        key={claveRefinamientoPendiente(refinamientoPendiente)}
        pendiente={refinamientoPendiente}
        modelo={modelo}
        posicion={posicion}
        onConfirmar={confirmarRefinamientoPendiente}
        onCancelar={() => {
          const testId = refinamientoPendiente.tipo === "descomposicion"
            ? "barra-inzoom"
            : refinamientoPendiente.tipo === "despliegue"
              ? "barra-unfold"
              : `tree-node-${refinamientoPendiente.opdSueltoId}`;
          cancelarRefinamientoPendiente();
          if (testId) requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-testid="${testId}"]`)?.focus());
        }}
      />,
      host,
    );
  }

  return createPortal(
    <div
      aria-label={ariaLabelBarra(contexto)}
      data-placement={posicion.placement}
      data-testid="barra-herramientas-elemento"
      role="toolbar"
      style={{
        ...style.barra,
        left: `${posicion.left}px`,
        top: `${posicion.top}px`,
      }}
    >
      <span aria-live="polite" data-testid="barra-live-region" style={style.srOnly}>
        {textoLiveBarra(contexto)}
      </span>
      <div style={style.fila}>
        <span style={marcaGrande ? style.marcaGrande : style.marca}>{marca}</span>
        {contexto.tipo === "multi" ? (
          <span data-testid="barra-resumen-multiseleccion" style={style.resumen}>
            {contexto.cantidad} seleccionadas
          </span>
        ) : null}
        {contexto.tipo === "enlace" ? (
          <span data-testid="barra-resumen-enlace" style={style.resumen}>
            {textoResumenEnlaceBarra(contexto.enlace)}
          </span>
        ) : null}
        <span style={style.acciones}>
          {acciones.map((accion, i) => (
            <span key={accion.id}>
              {i > 0 ? <span style={style.sep}>{` ${GLIFO_SEP} `}</span> : null}
              <button
                type="button"
                aria-label={accion.label}
                aria-keyshortcuts={atajoAria(accion.atajo)}
                data-testid={accion.testId}
                disabled={!accion.enabled}
                onClick={handlers[accion.id]}
                style={estiloBotonAccion(accion)}
                title={tituloAccion(accion)}
              >
                {etiquetaAccion(accion)}
              </button>
            </span>
          ))}
        </span>
      </div>
      <div style={style.hairline} />
      <span style={style.meta}>{metaDeContexto(contexto)}</span>
    </div>,
    host,
  );
}

// ---------------------------------------------------------------------------
// Etiqueta visible Codex (palabra). Usa el texto corto del catálogo cuando
// existe (p.ej. "Propiedades", "Inspector"), o el label en minúscula como
// palabra editorial Codex.
// ---------------------------------------------------------------------------

function etiquetaAccion(accion: AccionBarra): string {
  if (accion.texto) return accion.texto;
  return ETIQUETAS_CODEX[accion.id] ?? accion.label.toLocaleLowerCase("es");
}

const ETIQUETAS_CODEX: Partial<Record<AccionBarraId, string>> = {
  inzoom: "descomponer",
  unfold: "desplegar",
  "agregar-estado": "estado",
  "editar-alias": "alias",
  "editar-imagen": "imagen",
  "mas-opciones": "inspector",
  "eliminar-seleccion": "eliminar",
};

function tituloAccion(accion: AccionBarra): string {
  return accion.atajo ? `${accion.label} (${accion.atajo})` : accion.label;
}

// ---------------------------------------------------------------------------
// Coordenadas y posicionamiento.
// ---------------------------------------------------------------------------

export function posicionarAnotacion(
  rect: { x: number; y: number; width: number; height: number },
  altoCanvas: number,
  opciones: { anchoCanvas?: number; anchoEstimado?: number; altoEstimado?: number } = {},
): PosicionAnotacion {
  const leftBase = rect.x + rect.width / 2;
  const medioAncho = (opciones.anchoEstimado ?? ANCHO_ESTIMADO) / 2;
  const left = opciones.anchoCanvas && opciones.anchoCanvas > 0
    ? Math.min(
        opciones.anchoCanvas - PADDING_VIEWPORT - medioAncho,
        Math.max(PADDING_VIEWPORT + medioAncho, leftBase),
      )
    : leftBase;
  const yAbajo = rect.y + rect.height + OFFSET;
  const altoEstimado = opciones.altoEstimado ?? ALTO_ESTIMADO;
  if (altoCanvas > 0 && yAbajo + altoEstimado > altoCanvas - PADDING_VIEWPORT) {
    return { left, top: Math.max(PADDING_VIEWPORT, rect.y - OFFSET - altoEstimado), placement: "arriba" };
  }
  return { left, top: yAbajo, placement: "abajo" };
}

interface FormularioRefinamientoProps {
  pendiente: RefinamientoPendiente;
  modelo: ReturnType<typeof useBarraHerramientasElementoViewModel>["modelo"];
  posicion: PosicionAnotacion;
  onConfirmar: (input: {
    preguntaGuia: string;
    entidadId?: Id;
    tipo?: TipoRefinamiento;
    modo?: ModoDespliegueObjeto;
  }) => void;
  onCancelar: () => void;
}

function FormularioRefinamiento(props: FormularioRefinamientoProps) {
  const inicial = props.pendiente;
  const [pregunta, setPregunta] = useState(inicial.tipo === "adopcion" ? inicial.preguntaInicial ?? "" : "");
  const [entidadId, setEntidadId] = useState(inicial.entidadId);
  const [tipo, setTipo] = useState<TipoRefinamiento>(inicial.tipo === "adopcion" ? inicial.refinamiento : inicial.tipo);
  const [modo, setModo] = useState<ModoDespliegueObjeto | "">(
    inicial.tipo === "despliegue" || inicial.tipo === "adopcion" ? inicial.modo ?? "" : "",
  );
  const lentesTutor = (props.modelo.lentesConocimiento ?? []).map<KnowledgeLens>((lente) => {
    if (lente === "sistemas") return "systems";
    if (lente === "salud") return "health";
    return "software";
  });
  const intervencionTutor = resolverIntervencionTutorRefinamiento(inicial, pregunta, lentesTutor);
  const vistaTutor = useTutorContent(
    intervencionTutor.kind !== "silent" ? intervencionTutor.contentId : null,
    intervencionTutor.kind !== "silent" ? intervencionTutor.activeLenses : [],
  );
  const contenidoTutor = vistaTutor?.contenido ?? null;

  const esAdopcion = inicial.tipo === "adopcion";
  const requiereRelacion = tipo === "despliegue";
  const valido = pregunta.trim().length > 0 && (!requiereRelacion || modo !== "");
  const titulo = inicial.tipo === "adopcion"
    ? `Adoptar «${inicial.opdNombre}»`
    : inicial.tipo === "descomposicion"
      ? `Descomponer «${inicial.entidadNombre}»`
      : `Desplegar «${inicial.entidadNombre}»`;
  const nombreEntidad = props.modelo.entidades[entidadId]?.nombre ?? entidadId;
  const rotuloPregunta = esAdopcion
    ? `¿Qué pregunta responde este OPD al refinar «${nombreEntidad}»?`
    : "¿Qué pregunta buscas responder con este refinamiento?";
  const entidadesElegibles = Object.values(props.modelo.opds[inicial.opdPadreId]?.apariencias ?? {})
    .map((apariencia) => props.modelo.entidades[apariencia.entidadId])
    .filter((entidad): entidad is NonNullable<typeof entidad> => !!entidad)
    .filter((entidad, index, todas) => todas.findIndex((otra) => otra.id === entidad.id) === index);

  const confirmar = () => {
    props.onConfirmar({
      preguntaGuia: pregunta,
      ...(esAdopcion ? { entidadId, tipo } : {}),
      ...(requiereRelacion && modo ? { modo } : {}),
    });
  };

  return (
    <form
      aria-label={titulo}
      data-atajos-local="true"
      data-placement={props.posicion.placement}
      data-testid="tutor-refinamiento"
      style={{ ...style.formulario, left: `${props.posicion.left}px`, top: `${props.posicion.top}px` }}
      onSubmit={(event) => {
        event.preventDefault();
        if (valido) confirmar();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          props.onCancelar();
        }
      }}
    >
      <div style={style.formularioTitulo}>{titulo}</div>

      {esAdopcion ? (
        <>
          <label style={style.campoFormulario}>
            <span style={style.rotuloFormulario}>Elemento que refina</span>
            <select
              aria-label="Elemento que refina"
              data-testid="tutor-refinamiento-entidad"
              style={style.controlFormulario}
              value={entidadId}
              onChange={(event) => setEntidadId(event.currentTarget.value)}
            >
              {entidadesElegibles.map((entidad) => <option key={entidad.id} value={entidad.id}>{entidad.nombre}</option>)}
            </select>
          </label>
          <label style={style.campoFormulario}>
            <span style={style.rotuloFormulario}>Tipo de refinamiento</span>
            <select
              aria-label="Tipo de refinamiento"
              data-testid="tutor-refinamiento-tipo"
              style={style.controlFormulario}
              value={tipo}
              onChange={(event) => {
                const siguiente = event.currentTarget.value as TipoRefinamiento;
                setTipo(siguiente);
                if (siguiente === "descomposicion") setModo("");
              }}
            >
              <option value="descomposicion">Descomposición</option>
              <option value="despliegue">Despliegue</option>
            </select>
          </label>
        </>
      ) : null}

      {requiereRelacion ? (
        <label style={style.campoFormulario}>
          <span style={style.rotuloFormulario}>Relación estructural</span>
          <select
            aria-label="Relación estructural"
            data-testid="tutor-refinamiento-modo"
            style={style.controlFormulario}
            value={modo}
            onChange={(event) => setModo(event.currentTarget.value as ModoDespliegueObjeto | "")}
          >
            <option value="">Elige una relación…</option>
            <option value="agregacion">Partes (agregación)</option>
            <option value="exhibicion">Atributos (exhibición)</option>
            <option value="generalizacion">Especializaciones</option>
            <option value="clasificacion">Instancias</option>
          </select>
        </label>
      ) : null}

      <label style={style.campoFormulario}>
        <span style={style.rotuloFormulario}>{rotuloPregunta}</span>
        <input
          autoFocus
          aria-describedby="tutor-refinamiento-apoyo tutor-refinamiento-error"
          aria-label="Pregunta guía"
          data-testid="tutor-refinamiento-pregunta"
          placeholder="Escribe la pregunta…"
          style={style.controlFormulario}
          value={pregunta}
          onInput={(event) => setPregunta(event.currentTarget.value)}
        />
      </label>
      <span id="tutor-refinamiento-apoyo" style={style.apoyoFormulario}>
        {contenidoTutor?.now} Quedará visible en el OPD hijo; no forma parte del OPL.
      </span>
      {esAdopcion ? (
        <span style={style.apoyoFormulario}>Adoptar integra este OPD al árbol. El rigor del Apunte o Modelo no cambia.</span>
      ) : null}
      <span id="tutor-refinamiento-error" role="alert" aria-live="assertive" style={style.errorFormulario}>
        {inicial.error ?? ""}
      </span>
      <details style={style.porqueFormulario}>
        <summary>Criterio</summary>
        <p style={style.porqueTexto}>{contenidoTutor?.criterion}</p>
        {contenidoTutor?.lensDetails.map((detalle) => (
          <p key={detalle.lens} style={style.porqueTexto}>{detalle.criterion}</p>
        ))}
      </details>
      <details style={style.porqueFormulario}>
        <summary>Fundamento</summary>
        <p style={style.fundamentoTexto}>
          <TutorFoundationLinks referencias={vistaTutor?.referencias ?? []} inline />
        </p>
      </details>
      <div style={style.accionesFormulario}>
        <button type="button" style={style.accionSecundariaFormulario} onClick={props.onCancelar}>Cancelar</button>
        <button
          type="submit"
          data-testid="tutor-refinamiento-confirmar"
          disabled={!valido}
          style={valido ? style.accionPrimariaFormulario : style.accionPrimariaDeshabilitadaFormulario}
        >
          {esAdopcion ? "Adoptar y abrir OPD" : "Crear y abrir OPD"}
        </button>
      </div>
      <span style={style.srOnly}>Refinando {nombreEntidad}</span>
    </form>
  );
}

export function resolverIntervencionTutorRefinamiento(
  pendiente: RefinamientoPendiente,
  pregunta: string,
  activeLenses: readonly KnowledgeLens[],
): TutorIntervention {
  const base = {
    kind: "refine",
    intentId: `refinement:${claveRefinamientoPendiente(pendiente)}`,
    surface: "selection-annotation",
    interactionMode: "editable",
    stage: "question",
    questionComplete: pregunta.trim().length > 0,
    integrityBlocked: false,
    activeLenses,
  } as const;
  if (pendiente.tipo === "adopcion") {
    return runTutorPolicy({ ...base, actionId: "tree:adopt-refinement", mode: "adoption" });
  }
  if (pendiente.tipo === "descomposicion") {
    return runTutorPolicy({ ...base, actionId: "contextual:inzoom", mode: "decomposition" });
  }
  return runTutorPolicy({ ...base, actionId: "contextual:unfold", mode: "unfold" });
}

function claveRefinamientoPendiente(pendiente: RefinamientoPendiente): string {
  if (pendiente.tipo === "adopcion") {
    return `${pendiente.tipo}:${pendiente.opdSueltoId}:${pendiente.entidadId}:${pendiente.refinamiento}`;
  }
  return `${pendiente.tipo}:${pendiente.opdPadreId}:${pendiente.entidadId}`;
}

function canvasPaneDePaper(paper: dia.Paper | null): HTMLElement | null {
  if (!paper) return null;
  const el = (paper as unknown as { el?: Element }).el;
  return el?.closest<HTMLElement>('[data-testid="canvas-pane"]') ?? null;
}

function viewportDePaper(paper: dia.Paper): HTMLElement | null {
  const el = (paper as unknown as { el?: Element }).el;
  return el?.closest<HTMLElement>('[role="img"][aria-label="OPD activo"]') ?? null;
}

interface RectCliente {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/** Bounding rect (px de cliente) que une las vistas DOM de las celdas ancla. */
function rectClienteDeCeldas(paper: dia.Paper, cellIds: readonly Id[]): RectCliente | null {
  const graph = (paper as unknown as { model?: { getCell(id: string): unknown }; options?: { model?: { getCell(id: string): unknown } } });
  const model = graph.model ?? graph.options?.model;
  if (!model) return null;
  const rects: DOMRect[] = [];
  for (const cellId of cellIds) {
    const cell = model.getCell(cellId);
    if (!cell) continue;
    const view = paper.findViewByModel(cell as Parameters<dia.Paper["findViewByModel"]>[0]);
    const el = (view as unknown as { el?: Element } | undefined)?.el;
    const rect = el?.getBoundingClientRect();
    if (rect && (rect.width > 0 || rect.height > 0)) rects.push(rect);
  }
  if (rects.length === 0) return null;
  const left = Math.min(...rects.map((r) => r.left));
  const top = Math.min(...rects.map((r) => r.top));
  const right = Math.max(...rects.map((r) => r.right));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  return { left, top, right, bottom, width: right - left, height: bottom - top };
}

function enfocarSeccionInspector(testId: string): void {
  // C′·A (M-4): la sección puede estar plegada (display:none). Expandir sus
  // ancestros con `data-colapso-key` ANTES de enfocar; el objetivo sigue en el
  // DOM (queryable) aunque esté oculto. rAF doble deja a Preact re-renderizar el
  // disclosure abierto antes de mover el foco.
  const objetivo = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
  abrirSeccionesDe(objetivo);
  const enfocar = () => {
    const seccion = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
    const foco = seccion?.querySelector<HTMLElement>("input, textarea, button, select");
    foco?.focus();
    seccion?.scrollIntoView({ block: "nearest" });
  };
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => requestAnimationFrame(enfocar));
  } else {
    window.setTimeout(enfocar, 0);
  }
}

// ---------------------------------------------------------------------------
// Mapeo de contexto de selección → marca / acciones / metaline.
// (Helpers puros: cubiertos por CodexSelectionAnnotation.test.tsx.)
// ---------------------------------------------------------------------------

export function marcaDeContexto(contexto: ContextoBarraSeleccion): { marca: string; marcaGrande: boolean } {
  if (contexto.tipo === "multi") return { marca: String(contexto.cantidad), marcaGrande: true };
  return { marca: GLIFO_REF, marcaGrande: false };
}

export function accionesDeContexto(contexto: ContextoBarraSeleccion): AccionAnotacion[] {
  if (contexto.tipo === "multi") {
    return [
      { label: "eliminar", danger: true },
      { label: "partes" },
      { label: "alinear" },
      { label: "inspector", primary: true },
    ];
  }
  if (contexto.tipo === "enlace") {
    return [
      { label: "tipo", primary: true },
      { label: "inspector" },
    ];
  }
  if (contexto.entidad.tipo === "objeto") {
    return [
      { label: "descomponer", primary: true },
      { label: "desplegar" },
      { label: "estado" },
      { label: "alias" },
      { label: "inspector" },
    ];
  }
  return [
    { label: "descomponer", primary: true },
    { label: "desplegar" },
    { label: "alias" },
    { label: "inspector" },
  ];
}

export function metaDeContexto(contexto: ContextoBarraSeleccion): string {
  if (contexto.tipo === "multi") return `${contexto.cantidad} cosas ${GLIFO_SEP} selección múltiple`;
  if (contexto.tipo === "enlace") return `enlace ${GLIFO_SEP} ${contexto.enlace.tipo}`;
  const e = contexto.entidad;
  return [e.nombre, e.tipo, esenciaMeta(e.esencia), afiliacionMeta(e.afiliacion)]
    .join(` ${GLIFO_SEP} `);
}

function esenciaMeta(esencia: string): string {
  return esencia === "fisica" ? "física" : esencia;
}

function afiliacionMeta(afiliacion: string): string {
  return afiliacion === "sistemica" ? "sistémico" : afiliacion;
}

// ---------------------------------------------------------------------------
// Estilo: palabras Codex clicables. Primaria → italic+bold; destructiva →
// italic crimson; resto inkMid. Botón transparente, sin caja (§6.2).
// ---------------------------------------------------------------------------

function estiloBotonAccion(accion: AccionBarra): preact.JSX.CSSProperties {
  const base = { ...style.boton };
  if (!accion.enabled) return { ...base, color: tokens.colors.inkFaint, cursor: "not-allowed" };
  if (accion.destructiva) return { ...base, ...style.botonDanger };
  if (esPrimaria(accion.id)) return { ...base, ...style.botonPrimary };
  return base;
}

function esPrimaria(id: AccionBarraId): boolean {
  return id === "inzoom" || id === "cambiar-tipo-enlace" || id === "mas-opciones";
}

const style = {
  formulario: {
    position: "absolute",
    zIndex: 14,
    transform: "translateX(-50%)",
    width: `min(${ANCHO_FORMULARIO_REFINAMIENTO}px, calc(100% - 16px))`,
    maxHeight: "min(560px, calc(100% - 16px))",
    overflow: "auto",
    display: "grid",
    gap: "10px",
    padding: "14px 16px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    boxShadow: tokens.shadows.none,
    pointerEvents: "auto",
    fontFamily: tokens.typography.serif,
  },
  formularioTitulo: {
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs17}px`,
    fontWeight: tokens.typography.weights.bold,
  },
  campoFormulario: {
    display: "grid",
    gap: "5px",
  },
  rotuloFormulario: {
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs13}px`,
    lineHeight: tokens.typography.lh.body,
  },
  controlFormulario: {
    width: "100%",
    minHeight: "36px",
    boxSizing: "border-box",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
    borderRadius: 0,
    padding: "7px 9px",
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.fs.fs13}px`,
  },
  apoyoFormulario: {
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.fs.fs11}px`,
    lineHeight: tokens.typography.lh.body,
  },
  errorFormulario: {
    minHeight: "16px",
    color: tokens.colors.crimson,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.fs.fs11}px`,
  },
  porqueFormulario: {
    paddingTop: "6px",
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.fs.fs11}px`,
  },
  porqueTexto: {
    margin: "7px 0 3px",
    lineHeight: tokens.typography.lh.body,
  },
  fundamentoTexto: {
    margin: 0,
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs9}px`,
    lineHeight: tokens.typography.lh.body,
  },
  accionesFormulario: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "14px",
    paddingTop: "4px",
  },
  accionSecundariaFormulario: {
    minHeight: "34px",
    border: 0,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.inkSoft}`,
    borderRadius: 0,
    padding: "4px 1px",
    background: "transparent",
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs13}px`,
    cursor: "pointer",
  },
  accionPrimariaFormulario: {
    minHeight: "36px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    padding: "7px 12px",
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs13}px`,
    fontWeight: tokens.typography.weights.bold,
    cursor: "pointer",
  },
  accionPrimariaDeshabilitadaFormulario: {
    minHeight: "36px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
    borderRadius: 0,
    padding: "7px 12px",
    background: tokens.colors.paperWarm,
    color: tokens.colors.inkFaint,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs13}px`,
    fontWeight: tokens.typography.weights.bold,
    cursor: "not-allowed",
  },
  barra: {
    position: "absolute",
    zIndex: 13,
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    maxWidth: "min(620px, 92%)",
    pointerEvents: "auto",
    userSelect: "none",
    background: "transparent",
    fontFamily: tokens.typography.serif,
  },
  fila: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
    flexWrap: "wrap",
    whiteSpace: "normal",
    maxWidth: "100%",
    rowGap: "2px",
  },
  marca: {
    color: tokens.colors.crimson,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs20}px`,
    fontWeight: tokens.typography.weights.regular,
    lineHeight: 1,
  },
  marcaGrande: {
    color: tokens.colors.crimson,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs22}px`,
    fontWeight: tokens.typography.weights.bold,
    lineHeight: 1,
  },
  resumen: {
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs13}px`,
    fontWeight: tokens.typography.weights.bold,
    lineHeight: tokens.typography.lh.tight,
  },
  acciones: {
    display: "inline-flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    maxWidth: "100%",
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs13}px`,
    lineHeight: tokens.typography.lh.tight,
  },
  boton: {
    appearance: "none",
    border: "none",
    background: "transparent",
    padding: 0,
    margin: 0,
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs13}px`,
    fontStyle: "normal",
    fontWeight: tokens.typography.weights.regular,
    lineHeight: tokens.typography.lh.tight,
    cursor: "pointer",
  },
  botonPrimary: {
    color: tokens.colors.ink,
    fontStyle: "italic",
    fontWeight: tokens.typography.weights.bold,
  },
  botonDanger: {
    color: tokens.colors.crimson,
    fontStyle: "italic",
    fontWeight: tokens.typography.weights.regular,
  },
  sep: {
    color: tokens.colors.inkFaint,
  },
  hairline: {
    height: 0,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
  },
  meta: {
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs9}px`,
    letterSpacing: tokens.typography.ls.meta,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  srOnly: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
