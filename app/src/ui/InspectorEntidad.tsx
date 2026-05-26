import { useEffect, useRef, useState } from "preact/hooks";
import { autoInvocacionDeProceso } from "../modelo/autoinvocacion";
import { agregacionesInzoomFaltantes, esAtributoDerivado, estadosDeEntidad, relacionesPlegadasEstructurales, relacionesSemiplegadasEstructurales } from "../modelo/operaciones";
import { filasPlegadoParcial, modoPlegadoApariencia, partesDePlegado } from "../modelo/plegado";
import type { Entidad, Id, OrdenPartesPlegado } from "../modelo/tipos";
import { useInspectorEntidadViewModel } from "../app/viewmodels/inspectorEntidadViewModel";
import { useOpmStore } from "../store";
import { identificadorInspector } from "./inspector/identificador";
import { FichaSeccion } from "./inspector/FichaSeccion";
import { inspectorStyles as style } from "./inspectorStyles";
import { tokens } from "./tokens";
import { coberturaApariencias } from "./inspector/aparicionesUtils";
import { SeccionAlias } from "./inspector/SeccionAlias";
import { SeccionApariciones } from "./inspector/SeccionApariciones";
import { SeccionAtributo } from "./inspector/SeccionAtributo";
import { SeccionDescripcion } from "./inspector/SeccionDescripcion";
import { SeccionEsenciaAfiliacion } from "./inspector/SeccionEsenciaAfiliacion";
import { SeccionEnlaces } from "./inspector/SeccionEnlaces";
import { SeccionImagen } from "./inspector/SeccionImagen";
import { SeccionLayoutEstados } from "./inspector/SeccionLayoutEstados";
import { SeccionRefinamiento, OPCIONES_DESPLIEGUE_OBJETO } from "./inspector/SeccionRefinamiento";
import { SeccionTamano } from "./inspector/SeccionTamano";
import { SeccionUrls } from "./inspector/SeccionUrls";
import { StyleControls } from "./StyleControls";

export { OPCIONES_DESPLIEGUE_OBJETO };

interface Props {
  entidad: Entidad;
}

/**
 * Barrel publico del inspector de entidad. Conserva lecturas amplias del store
 * y delega secciones OPM atomicas respaldadas por SSOT 3.7, 3.68, 3.71a y V-1.
 *
 * Ronda Codex v2 / L3 (C9): el contenido dejó de particionarse en tabs y pasó
 * a una **ficha tipográfica continua** — las cinco secciones (Semántica →
 * Enlaces → Refinamiento → Apariciones → Estilo) se apilan verticalmente,
 * cada una bajo un kicker mono uppercase y separada por hairline (ui-forja §9;
 * el apéndice §02:483 prohíbe los tabs con underline-active). Cada `Panel*` es
 * un wrapper local que monta las `Seccion*` existentes — cero cambios al
 * contenido de las secciones.
 */
export function InspectorEntidad({ entidad }: Props) {
  const {
    modelo,
    opdActivoId,
    cambiarOpdActivo,
    navegarAEnlace,
    renombrar,
    fijarEsencia,
    fijarAfiliacion,
    reasignarEnlaceExternoManual,
    crearAutoInvocacion,
    cambiarModoPlegado,
    cambiarOrdenPartes,
    aplicarEstilo,
    resetearEstilo,
    aplicarEstiloTexto,
    resetearEstiloTexto,
    redimensionarSeleccionada,
    ajustarSeleccionadaAlTexto,
    volverSeleccionadaAAuto,
    alternarModoTamanoSeleccionado,
    extraerParte,
    extraerTodasLasPartes,
    reinsertarParte,
    quitarSemiplegadoEstructural,
    quitarPlegadoCompletoEstructural,
    traerAgregacionesInzoom,
    eliminarEstado,
    quitarEstados,
    renombrarEstado,
    designarEstadoComo,
    quitarDesignacion,
    suprimirEstadoPorId,
    restaurarEstadoPorId,
    abrirModalDuracion,
    abrirModalUrls,
    abrirModalImagen,
    quitarImagenEntidad,
    editarAliasEntidad,
    editarUnidadEntidad,
    editarDescripcionEntidad,
    asignarValorAtributo,
    cambiarTipoValorAtributo,
    configurarSimulacionAtributo,
    crearAtributo,
    fijarLayoutEstadosEntidad,
    seleccionados,
    aplicarEstiloASeleccion,
    crearEstadosConNombres,
  } = useInspectorEntidadViewModel(entidad.id);
  const [aplicarABatch, setAplicarABatch] = useState(false);
  // L4 ronda 23 (#15): focus auto default brutal al crear objeto/proceso.
  // Lectura directa al store (no se infla `EntityInspectorShellPort` porque
  // la señal es estrictamente UI y de corta vida; pasaría como ruido en el
  // resto del viewmodel).
  const solicitarFocusNombre = useOpmStore((s) => s.solicitarFocusNombre);
  const consumirFocusNombre = useOpmStore((s) => s.consumirFocusNombre);
  const inputNombreRef = useRef<HTMLInputElement | null>(null);
  const aparienciaActiva = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {}).find((apariencia) => apariencia.entidadId === entidad.id);
  const partesPlegables = partesDePlegado(modelo, entidad.id);
  const modoPlegado = aparienciaActiva ? modoPlegadoApariencia(aparienciaActiva) : "completo";
  const filasParciales = aparienciaActiva && modoPlegado === "parcial" ? filasPlegadoParcial(modelo, opdActivoId, aparienciaActiva.id) : [];
  const semiplegadasEstructurales = aparienciaActiva && modoPlegado === "parcial"
    ? relacionesSemiplegadasEstructurales(modelo, opdActivoId, entidad.id).faltantes
    : 0;
  const plegadasEstructurales = aparienciaActiva && modoPlegado === "plegado"
    ? relacionesPlegadasEstructurales(modelo, opdActivoId, entidad.id).faltantes
    : 0;
  const agregacionesInzoomPendientes = aparienciaActiva
    ? agregacionesInzoomFaltantes(modelo, opdActivoId, entidad.id).faltantes
    : 0;
  const estados = entidad.tipo === "objeto" ? estadosDeEntidad(modelo, entidad.id) : [];
  const atributoDerivado = entidad.tipo === "objeto" && esAtributoDerivado(modelo, entidad.id);
  const autoInvocacion = entidad.tipo === "proceso" ? autoInvocacionDeProceso(modelo, opdActivoId, entidad.id) : undefined;
  const cobertura = coberturaApariencias(modelo, entidad.id);

  // L4 ronda 23 (#15): consume la señal `solicitarFocusNombre` cuando la
  // entidad montada coincide. Default brutal: enfoca y selecciona el texto
  // ("Objeto" → renombrar a "Cliente" con un solo tipeo). Doble guarda:
  // `requestAnimationFrame` para sobrevivir el primer paint y `select()` para
  // seleccionar el texto. Tras consumir, limpia el flag para que no vuelva a
  // dispararse en re-renders posteriores.
  useEffect(() => {
    if (solicitarFocusNombre !== entidad.id) return;
    const input = inputNombreRef.current;
    if (!input) return;
    const raf = typeof requestAnimationFrame === "function"
      ? requestAnimationFrame
      : (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0);
    const cancel = typeof cancelAnimationFrame === "function"
      ? cancelAnimationFrame
      : clearTimeout;
    const token = raf(() => {
      input.focus();
      try { input.select(); } catch { /* algunos inputs no soportan select, ignorar */ }
      consumirFocusNombre();
    });
    return () => cancel(token as number);
  }, [solicitarFocusNombre, entidad.id, consumirFocusNombre]);

  return (
    <>
      {/*
        Header editorial — kind como heading (Inria Serif 700/15, NO uppercase).
        Identificador canónico de punto (`o.11`, `p.03`) en mono 10 ink-30 a la
        derecha, alineado con el rótulo del canvas (Codex v2 / L3: antes mostraba
        el `id` interno con guion `o-11`). El `data-entidad-id` preserva el id
        interno crudo para deeplink/debug; el title también.
      */}
      <div style={style.header} data-entidad-id={entidad.id}>
        <span style={style.kind}>{entidad.tipo === "objeto" ? "Objeto" : "Proceso"}</span>
        <span style={style.id} title={entidad.id}>{identificadorInspector(entidad.id)}</span>
      </div>
      <label style={style.field}>
        <span class="opm-label-uppercase" style={style.label}>Nombre</span>
        <input
          ref={inputNombreRef}
          data-testid="inspector-entidad-nombre"
          style={style.input}
          value={entidad.nombre}
          onInput={(event) => renombrar(event.currentTarget.value)}
          onKeyDown={reenviarComboGlobalDesdeInput}
        />
      </label>
      {/*
        Ficha continua (Codex C9): las cinco secciones se apilan en orden
        estricto Semántica → Enlaces → Refinamiento → Apariciones → Estilo.
        Cada bloque conserva su testid `inspector-panel-{id}` para que el
        smoke ubique su contenido sin tabs; ya no hay `role="tabpanel"`.
      */}
      <div data-testid="inspector-ficha" style={style.ficha}>
        <FichaSeccion kicker="Semántica" testid="inspector-panel-semantica" primera>
          <PanelSemantica
            entidad={entidad}
            cobertura={cobertura}
            atributoDerivado={atributoDerivado || null}
            estados={estados}
            modelo={modelo}
            layout={entidad.layoutEstados ?? "horizontal"}
            onDescripcion={(value) => editarDescripcionEntidad(entidad.id, value)}
            onAlias={(value) => editarAliasEntidad(entidad.id, value)}
            onUnidad={(value) => editarUnidadEntidad(entidad.id, value)}
            onTipoAtributo={cambiarTipoValorAtributo}
            onValorAtributo={asignarValorAtributo}
            onSimulacionAtributo={configurarSimulacionAtributo}
            onCrearAtributo={() => crearAtributo({ nombre: "Valor [u]", tipoSlot: "float" })}
            onAbrirUrls={abrirModalUrls}
            onAbrirImagen={abrirModalImagen}
            onQuitarImagen={quitarImagenEntidad}
            onEsencia={fijarEsencia}
            onAfiliacion={fijarAfiliacion}
            onCrearEstadosConNombres={crearEstadosConNombres}
            onEliminarEstado={eliminarEstado}
            onQuitarEstados={quitarEstados}
            onRenombrarEstado={renombrarEstado}
            onDesignarEstadoComo={designarEstadoComo}
            onQuitarDesignacionEstado={quitarDesignacion}
            onSuprimirEstadoPorId={suprimirEstadoPorId}
            onRestaurarEstadoPorId={restaurarEstadoPorId}
            onAbrirModalDuracion={abrirModalDuracion}
            onLayoutEstados={(value) => fijarLayoutEstadosEntidad(entidad.id, value)}
          />
          {/* Preserva testid `inspector-entidad-acciones` para procesos. En
              objeto lo emite SeccionUrls; en proceso este placeholder lo
              sostiene dentro de la sección Semántica. */}
          {entidad.tipo !== "objeto" ? <div data-testid="inspector-entidad-acciones" /> : null}
        </FichaSeccion>
        <FichaSeccion kicker="Enlaces" testid="inspector-panel-enlaces">
          <SeccionEnlaces modelo={modelo} entidad={entidad} onNavegarEnlace={navegarAEnlace} />
        </FichaSeccion>
        <FichaSeccion kicker="Refinamiento" testid="inspector-panel-refinamiento">
          <PanelRefinamiento
            entidad={entidad}
            modelo={modelo}
            autoInvocacion={autoInvocacion}
            tienePartesPlegables={partesPlegables.length > 0 && !!aparienciaActiva}
            modoPlegado={modoPlegado}
            ordenPartes={aparienciaActiva?.ordenPartes}
            filasParciales={filasParciales}
            semiplegadasEstructurales={semiplegadasEstructurales}
            plegadasEstructurales={plegadasEstructurales}
            agregacionesInzoomFaltantes={agregacionesInzoomPendientes}
            padreAparienciaId={aparienciaActiva?.id}
            parteExtraidaDe={aparienciaActiva?.parteExtraidaDe}
            onReasignarEnlaceExterno={reasignarEnlaceExternoManual}
            onCrearAutoInvocacion={crearAutoInvocacion}
            onCambiarModoPlegado={() => cambiarModoPlegado(modoPlegado === "parcial" ? "completo" : "parcial")}
            onCambiarOrdenPartes={(orden: OrdenPartesPlegado) => cambiarOrdenPartes(orden)}
            onExtraer={extraerParte}
            onExtraerTodas={extraerTodasLasPartes}
            onReinsertarParte={reinsertarParte}
            onQuitarSemiplegadoEstructural={quitarSemiplegadoEstructural}
            onQuitarPlegadoCompletoEstructural={quitarPlegadoCompletoEstructural}
            onTraerAgregacionesInzoomFaltantes={traerAgregacionesInzoom}
          />
        </FichaSeccion>
        <FichaSeccion kicker="Apariciones" testid="inspector-panel-apariciones">
          <SeccionApariciones
            modelo={modelo}
            entidad={entidad}
            opdActivoId={opdActivoId}
            onNavegar={cambiarOpdActivo}
          />
        </FichaSeccion>
        <FichaSeccion kicker="Estilo" testid="inspector-panel-estilo">
          <PanelEstilo
            apariencia={aparienciaActiva}
            seleccionMultipleCount={seleccionados.length}
            aplicarABatch={aplicarABatch}
            onCambiarAplicarABatch={setAplicarABatch}
            onApply={(patch) => (aplicarABatch ? aplicarEstiloASeleccion(patch) : aplicarEstilo(patch))}
            onReset={resetearEstilo}
            onApplyText={(textPatch) => {
              if (!aparienciaActiva) return;
              if (aplicarABatch) aplicarEstiloASeleccion(textPatch);
              else aplicarEstiloTexto(aparienciaActiva.id, textPatch);
            }}
            onResetText={() => {
              if (aparienciaActiva) resetearEstiloTexto(aparienciaActiva.id);
            }}
            onRedimensionar={redimensionarSeleccionada}
            onAjustarTexto={ajustarSeleccionadaAlTexto}
            onVolverAuto={volverSeleccionadaAAuto}
            onAlternarModo={alternarModoTamanoSeleccionado}
          />
        </FichaSeccion>
      </div>
    </>
  );
}

// ── Panel: Semántica ───────────────────────────────────────────────────────

interface PanelSemanticaProps {
  entidad: Entidad;
  cobertura: { totalApariencias: number; opdsConEntidad: number };
  atributoDerivado: ReturnType<typeof esAtributoDerivado> | null;
  estados: import("../modelo/tipos").Estado[];
  modelo: import("../modelo/tipos").Modelo;
  layout: import("../modelo/tipos").LayoutEstados;
  onDescripcion: (value: string) => void;
  onAlias: (value: string) => void;
  onUnidad: (value: string) => void;
  onTipoAtributo: (tipo: import("../modelo/tipos").TipoValorSlot) => void;
  onValorAtributo: (valor: import("../modelo/tipos").ValorConcreto) => void;
  onSimulacionAtributo: (parametros: import("../modelo/tipos").ParametrosSimulacionEntidad | undefined) => void;
  onCrearAtributo: () => void;
  onAbrirUrls: (entidadId: Id) => void;
  onAbrirImagen: (entidadId: Id) => void;
  onQuitarImagen: (entidadId: Id) => void;
  onEsencia: (esencia: import("../modelo/tipos").Esencia) => void;
  onAfiliacion: (afiliacion: import("../modelo/tipos").Afiliacion) => void;
  onCrearEstadosConNombres: (nombres: string[]) => void;
  onEliminarEstado: (estadoId: Id) => void;
  onQuitarEstados: () => void;
  onRenombrarEstado: (estadoId: Id, nombre: string) => void;
  onDesignarEstadoComo: (estadoId: Id, designacion: import("../modelo/tipos").DesignacionEstado) => void;
  onQuitarDesignacionEstado: (estadoId: Id, designacion: import("../modelo/tipos").DesignacionEstado) => void;
  onSuprimirEstadoPorId: (estadoId: Id) => void;
  onRestaurarEstadoPorId: (estadoId: Id) => void;
  onAbrirModalDuracion: (estadoId: Id) => void;
  onLayoutEstados: (layout: import("../modelo/tipos").LayoutEstados) => void;
}

function PanelSemantica(props: PanelSemanticaProps) {
  const { entidad, cobertura, atributoDerivado, estados, modelo, layout } = props;
  return (
    <>
      {cobertura.opdsConEntidad >= 2 ? (
        <p
          data-testid="inspector-cobertura-apariencias"
          style={style.coberturaHint}
          title="Aparece en varios OPDs. La sección Apariciones (más abajo) lista cada OPD."
        >
          {`Aparece en ${cobertura.opdsConEntidad} OPDs (${cobertura.totalApariencias} ${cobertura.totalApariencias === 1 ? "vez" : "veces"}). Los cambios afectan a todas.`}
        </p>
      ) : null}
      <SeccionDescripcion descripcion={entidad.descripcion} onDescripcion={props.onDescripcion} />
      {entidad.tipo === "objeto" ? (
        <section style={advancedStyles.section} aria-label="Metadatos avanzados">
          <SeccionAlias
            alias={entidad.alias}
            unidad={entidad.unidad}
            onAlias={props.onAlias}
            onUnidad={props.onUnidad}
          />
          <SeccionUrls entidadId={entidad.id} urls={entidad.urls} onAbrirUrls={props.onAbrirUrls} />
          <SeccionImagen
            entidadId={entidad.id}
            {...(entidad.imagen ? { imagen: entidad.imagen } : {})}
            onAbrirImagen={props.onAbrirImagen}
            onQuitarImagen={props.onQuitarImagen}
          />
        </section>
      ) : null}
      {atributoDerivado ? (
        <SeccionAtributo
          entidad={entidad}
          derivado={atributoDerivado}
          onUnidad={props.onUnidad}
          onTipo={props.onTipoAtributo}
          onValor={props.onValorAtributo}
          onSimulacion={props.onSimulacionAtributo}
        />
      ) : null}
      {/*
        BUG-...738f53: affordance directa para crear un atributo desde el
        inspector (antes solo existía en la toolbar superior). Un atributo OPM
        = objeto exhibido por la cosa portadora (relación de exhibición); la
        acción reusa `crearAtributoEnObjetoSeleccionado` (dominio
        `crearAtributoEnObjeto`). Se ofrece solo cuando la cosa seleccionada
        es un objeto que no es ya un atributo de otra cosa, para no anidar
        slots de valor sobre slots.
      */}
      {entidad.tipo === "objeto" && !atributoDerivado ? (
        <button
          type="button"
          style={atributoCtaStyles.button}
          onClick={props.onCrearAtributo}
          data-testid="inspector-crear-atributo"
          title="Crear un atributo (objeto exhibido) en este objeto"
        >
          + Atributo
        </button>
      ) : null}
      <SeccionEsenciaAfiliacion
        esencia={entidad.esencia}
        afiliacion={entidad.afiliacion}
        onEsencia={props.onEsencia}
        onAfiliacion={props.onAfiliacion}
      />
      {entidad.tipo === "objeto" ? (
        <SeccionLayoutEstados
          modelo={modelo}
          entidad={entidad}
          entidadId={entidad.id}
          estados={estados}
          layout={layout}
          onCrearEstadosConNombres={props.onCrearEstadosConNombres}
          onEliminar={props.onEliminarEstado}
          onQuitarEstados={props.onQuitarEstados}
          onRenombrar={props.onRenombrarEstado}
          onDesignar={props.onDesignarEstadoComo}
          onQuitarDesignacion={props.onQuitarDesignacionEstado}
          onSuprimir={props.onSuprimirEstadoPorId}
          onRestaurar={props.onRestaurarEstadoPorId}
          onAbrirDuracion={props.onAbrirModalDuracion}
          onLayout={props.onLayoutEstados}
        />
      ) : null}
    </>
  );
}

// ── Panel: Refinamiento ────────────────────────────────────────────────────

interface PanelRefinamientoProps {
  entidad: Entidad;
  modelo: import("../modelo/tipos").Modelo;
  autoInvocacion?: unknown | undefined;
  tienePartesPlegables: boolean;
  modoPlegado: import("../modelo/tipos").ModoPlegado;
  ordenPartes?: OrdenPartesPlegado | undefined;
  filasParciales: import("../modelo/plegado").FilaPlegadoParcial[];
  semiplegadasEstructurales: number;
  plegadasEstructurales: number;
  agregacionesInzoomFaltantes: number;
  padreAparienciaId?: Id | undefined;
  parteExtraidaDe?: { padreAparienciaId: Id; parteEntidadId: Id } | undefined;
  onReasignarEnlaceExterno: (opdId: Id, aparienciaEnlaceId: Id, nuevoSubprocesoId: Id) => void;
  onCrearAutoInvocacion: () => void;
  onCambiarModoPlegado: () => void;
  onCambiarOrdenPartes: (orden: OrdenPartesPlegado) => void;
  onExtraer: (padreAparienciaId: Id, parteEntidadId: Id) => void;
  onExtraerTodas: () => void;
  onReinsertarParte: () => void;
  onQuitarSemiplegadoEstructural: () => void;
  onQuitarPlegadoCompletoEstructural: () => void;
  onTraerAgregacionesInzoomFaltantes: () => void;
}

/**
 * L4 ronda 23 (#11): Refinamiento contiene SOLO operaciones semánticas OPM
 * (inzoom/desplegar/estados/navegación). La sección Tamaño (Ancho/Alto/
 * Ajustar texto/Volver auto) se trasladó al tab Estilo porque pertenece a
 * presentación, no a estructura semántica.
 */
function PanelRefinamiento(props: PanelRefinamientoProps) {
  return (
    <SeccionRefinamiento
      entidad={props.entidad}
      modelo={props.modelo}
      autoInvocacion={props.autoInvocacion}
      tienePartesPlegables={props.tienePartesPlegables}
      modoPlegado={props.modoPlegado}
      ordenPartes={props.ordenPartes}
      filasParciales={props.filasParciales}
      semiplegadasEstructurales={props.semiplegadasEstructurales}
      plegadasEstructurales={props.plegadasEstructurales}
      agregacionesInzoomFaltantes={props.agregacionesInzoomFaltantes}
      padreAparienciaId={props.padreAparienciaId}
      parteExtraidaDe={props.parteExtraidaDe}
      onReasignarEnlaceExterno={props.onReasignarEnlaceExterno}
      onCrearAutoInvocacion={props.onCrearAutoInvocacion}
      onCambiarModoPlegado={props.onCambiarModoPlegado}
      onCambiarOrdenPartes={props.onCambiarOrdenPartes}
      onExtraer={props.onExtraer}
      onExtraerTodas={props.onExtraerTodas}
      onReinsertarParte={props.onReinsertarParte}
      onQuitarSemiplegadoEstructural={props.onQuitarSemiplegadoEstructural}
      onQuitarPlegadoCompletoEstructural={props.onQuitarPlegadoCompletoEstructural}
      onTraerAgregacionesInzoomFaltantes={props.onTraerAgregacionesInzoomFaltantes}
    />
  );
}

// ── Panel: Estilo ──────────────────────────────────────────────────────────

/**
 * L4 ronda 23 (#11): además de las propiedades visuales (StyleControls), el
 * panel Estilo aloja la sección Tamaño (Ancho/Alto/Ajustar texto/Volver
 * auto), que vivía en Refinamiento. Esto separa semántica OPM (Refinamiento)
 * de presentación (Estilo).
 */
interface PanelEstiloProps {
  apariencia: import("../modelo/tipos").Apariencia | undefined;
  seleccionMultipleCount: number;
  aplicarABatch: boolean;
  onCambiarAplicarABatch: (valor: boolean) => void;
  onApply: (patch: import("../modelo/tipos").EstiloApariencia) => void;
  onReset: () => void;
  onApplyText: (patch: import("../modelo/tipos").EstiloApariencia) => void;
  onResetText: () => void;
  onRedimensionar: (width: number, height: number) => void;
  onAjustarTexto: () => void;
  onVolverAuto: () => void;
  onAlternarModo: () => void;
}

function PanelEstilo(props: PanelEstiloProps) {
  if (!props.apariencia) {
    return <p style={style.empty}>El tab Estilo solo aplica cuando la entidad tiene apariencia en el OPD activo.</p>;
  }
  return (
    <>
      <SeccionTamano
        apariencia={props.apariencia}
        onRedimensionar={props.onRedimensionar}
        onAjustarTexto={props.onAjustarTexto}
        onVolverAuto={props.onVolverAuto}
        onAlternarModo={props.onAlternarModo}
      />
      <StyleControls
        estilo={props.apariencia.estilo}
        onApply={props.onApply}
        onReset={props.onReset}
        showText
        onApplyText={props.onApplyText}
        onResetText={props.onResetText}
        seleccionMultipleCount={props.seleccionMultipleCount}
        aplicarASeleccion={props.aplicarABatch}
        onCambiarAplicarASeleccion={props.onCambiarAplicarABatch}
      />
    </>
  );
}

const advancedStyles = {
  section: { display: "grid", gap: "8px", marginBottom: "14px" },
} satisfies Record<string, preact.JSX.CSSProperties>;

const atributoCtaStyles = {
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    width: "fit-content",
    height: "30px",
    padding: "0 12px",
    marginBottom: "14px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoPrimario,
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

/**
 * L4 ronda 23 (#15): el input Nombre del Inspector queda focuseado tras
 * crear objeto/proceso (default brutal). Como es un `HTMLInputElement`, el
 * sistema global de atajos (`atajosTeclado.ts#esEditable`) lo trata como
 * `modal-input` y descarta todos los atajos salvo Escape/Enter — eso rompe
 * Ctrl+Z/Ctrl+S/Delete etc. mientras el operador aún no empezó a tipear.
 *
 * Estrategia: cualquier keydown con modificador Ctrl/Meta (típicamente
 * atajos no-tipeo) y la tecla `Delete` se re-dispatchan al document via
 * `dispatchEvent` con `composed:true`, dejando que el sistema global lo
 * resuelva como si el target fuera el body. Las teclas alfanuméricas y de
 * edición de texto puro siguen llegando al input intactas. El undo nativo
 * del browser sobre el input se pierde, pero como `onInput` ya hace
 * `renombrarSeleccionada` (commit al modelo) en cada tecla, deshacer el
 * modelo equivale a deshacer la edición del input. Compatible con tests
 * que asumen "Ctrl+Z tras crear deshace el modelo".
 */
function reenviarComboGlobalDesdeInput(
  event: preact.JSX.TargetedKeyboardEvent<HTMLInputElement>,
): void {
  const ctrl = event.ctrlKey || event.metaKey;
  // Sólo redirige combos Ctrl/Meta (atajos) y Delete (acción global). Las
  // teclas de tipeo, navegación del cursor, Backspace y selección quedan
  // intactas para el input. Tab también queda intacto (focus management).
  const esDelete = !ctrl && !event.altKey && !event.shiftKey && event.key === "Delete";
  if (!ctrl && !esDelete) return;
  // Sin tecla útil (sólo modificador) → no redirigir.
  if (event.key === "Control" || event.key === "Meta" || event.key === "Shift" || event.key === "Alt") return;
  // Construye un KeyboardEvent equivalente y lo dispara en el window. El
  // sistema global de atajos escucha en `window` (capture), así que esto
  // alcanza al registry tal como si el body fuera el target. `composed:true`
  // permite cruzar shadow boots si existieran.
  const clon = new KeyboardEvent("keydown", {
    key: event.key,
    code: event.code,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
    altKey: event.altKey,
    bubbles: true,
    cancelable: true,
    composed: true,
  });
  event.preventDefault();
  event.stopPropagation();
  // Despachar al window así el target del clon es el body (no el input).
  // El sistema global filtra por target, así que despachar desde el window
  // hace que `e.target` sea el window (no editable) → atajo se evalúa.
  window.dispatchEvent(clon);
}
