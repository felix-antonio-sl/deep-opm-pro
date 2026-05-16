import { useEffect, useState } from "preact/hooks";
import { autoInvocacionDeProceso } from "../modelo/autoinvocacion";
import { agregacionesInzoomFaltantes, esAtributoDerivado, estadosDeEntidad, relacionesPlegadasEstructurales, relacionesSemiplegadasEstructurales } from "../modelo/operaciones";
import { filasPlegadoParcial, modoPlegadoApariencia, partesDePlegado } from "../modelo/plegado";
import type { Entidad, Id, OrdenPartesPlegado } from "../modelo/tipos";
import type { TabInspectorEntidad } from "../store/tipos";
import { store, useOpmStore } from "../store";
import { inspectorStyles as style } from "./inspectorStyles";
import { coberturaApariencias } from "./inspector/aparicionesUtils";
import { InspectorTabs, type InspectorTabDef } from "./inspector/InspectorTabs";
import { SeccionAlias } from "./inspector/SeccionAlias";
import { SeccionApariciones } from "./inspector/SeccionApariciones";
import { SeccionAtributo } from "./inspector/SeccionAtributo";
import { SeccionDescripcion } from "./inspector/SeccionDescripcion";
import { SeccionEsenciaAfiliacion } from "./inspector/SeccionEsenciaAfiliacion";
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
 * L1 ronda 20: tabs por intención del Inspector de entidad. Orden estricto.
 * Cada tab encapsula un cluster semántico del informe UI/UX 2026-05-07.
 */
const TABS_ENTIDAD: ReadonlyArray<InspectorTabDef<TabInspectorEntidad>> = [
  { id: "semantica", label: "Semántica", testid: "inspector-tab-semantica" },
  { id: "enlaces", label: "Enlaces", testid: "inspector-tab-enlaces" },
  { id: "refinamiento", label: "Refinamiento", testid: "inspector-tab-refinamiento" },
  { id: "apariciones", label: "Apariciones", testid: "inspector-tab-apariciones" },
  { id: "estilo", label: "Estilo", testid: "inspector-tab-estilo" },
];

/**
 * Barrel publico del inspector de entidad. Conserva lecturas amplias del store
 * y delega secciones OPM atomicas respaldadas por SSOT 3.7, 3.68, 3.71a y V-1.
 *
 * L1 ronda 20: el contenido se particiona en 5 tabs (Semántica / Enlaces /
 * Refinamiento / Apariciones / Estilo). El tab activo persiste en
 * `store.uiPanel.tabInspectorEntidadActivo`. Cada `Panel*` es un wrapper
 * local que monta las `Seccion*` existentes en su tab — cero cambios al
 * contenido de las secciones. El tab Apariciones es nuevo (cross-OPD nav).
 */
export function InspectorEntidad({ entidad }: Props) {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const tabActivo = useOpmStore((s) => s.tabInspectorEntidadActivo);
  const cambiarTab = useOpmStore((s) => s.cambiarTabInspectorEntidad);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const renombrar = useOpmStore((s) => s.renombrarSeleccionada);
  const fijarEsencia = useOpmStore((s) => s.fijarEsenciaSeleccionada);
  const fijarAfiliacion = useOpmStore((s) => s.fijarAfiliacionSeleccionada);
  const descomponer = useOpmStore((s) => s.descomponerSeleccionada);
  const desplegar = useOpmStore((s) => s.desplegarSeleccionada);
  const quitarDescomposicion = useOpmStore((s) => s.quitarDescomposicionSeleccionada);
  const quitarDespliegue = useOpmStore((s) => s.quitarDespliegueSeleccionado);
  const reasignarEnlaceExternoManual = useOpmStore((s) => s.reasignarEnlaceExternoManual);
  const crearAutoInvocacion = useOpmStore((s) => s.crearAutoInvocacionSeleccionada);
  const cambiarModoPlegado = useOpmStore((s) => s.cambiarModoPlegadoSeleccionado);
  const cambiarOrdenPartes = useOpmStore((s) => s.cambiarOrdenPartesSeleccionado);
  const aplicarEstilo = useOpmStore((s) => s.aplicarEstiloSeleccionado);
  const resetearEstilo = useOpmStore((s) => s.resetearEstiloSeleccionado);
  const aplicarEstiloTexto = useOpmStore((s) => s.aplicarEstiloTextoAccion);
  const resetearEstiloTexto = useOpmStore((s) => s.resetEstiloTextoAccion);
  const redimensionarSeleccionada = useOpmStore((s) => s.redimensionarSeleccionada);
  const ajustarSeleccionadaAlTexto = useOpmStore((s) => s.ajustarSeleccionadaAlTexto);
  const volverSeleccionadaAAuto = useOpmStore((s) => s.volverSeleccionadaAAuto);
  const alternarModoTamanoSeleccionado = useOpmStore((s) => s.alternarModoTamanoSeleccionado);
  const extraerParte = useOpmStore((s) => s.extraerParteDePlegado);
  const extraerTodasLasPartes = useOpmStore((s) => s.extraerTodasLasPartesSeleccionadas);
  const reinsertarParte = useOpmStore((s) => s.reinsertarParteExtraidaSeleccionada);
  const quitarSemiplegadoEstructural = useOpmStore((s) => s.quitarSemiplegadoEstructuralSeleccionado);
  const quitarPlegadoCompletoEstructural = useOpmStore((s) => s.quitarPlegadoCompletoEstructuralSeleccionado);
  const traerAgregacionesInzoom = useOpmStore((s) => s.traerAgregacionesInzoomFaltantesSeleccionadas);
  const agregarEstados = useOpmStore((s) => s.agregarEstadosObjeto);
  const agregarEstado = useOpmStore((s) => s.agregarEstadoObjeto);
  const eliminarEstado = useOpmStore((s) => s.eliminarEstado);
  const quitarEstados = useOpmStore((s) => s.quitarEstadosObjetoSeleccionado);
  const renombrarEstado = useOpmStore((s) => s.renombrarEstadoSeleccionado);
  const designarEstadoComo = useOpmStore((s) => s.designarEstadoComo);
  const quitarDesignacion = useOpmStore((s) => s.quitarDesignacionEstado);
  const suprimirEstadoPorId = useOpmStore((s) => s.suprimirEstadoPorId);
  const restaurarEstadoPorId = useOpmStore((s) => s.restaurarEstadoPorId);
  const abrirModalDuracion = useOpmStore((s) => s.abrirModalDuracion);
  const abrirModalUrls = useOpmStore((s) => s.abrirModalUrls);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);
  const quitarImagenEntidad = useOpmStore((s) => s.quitarImagenEntidad);
  const editarAliasEntidad = useOpmStore((s) => s.editarAliasEntidad);
  const editarUnidadEntidad = useOpmStore((s) => s.editarUnidadEntidad);
  const editarDescripcionEntidad = useOpmStore((s) => s.editarDescripcionEntidad);
  const asignarValorAtributo = useOpmStore((s) => s.asignarValorAtributoSeleccionado);
  const cambiarTipoValorAtributo = useOpmStore((s) => s.cambiarTipoValorAtributoSeleccionado);
  const configurarSimulacionAtributo = useOpmStore((s) => s.configurarSimulacionAtributoSeleccionado);
  const fijarLayoutEstadosEntidad = useOpmStore((s) => s.fijarLayoutEstadosEntidad);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const aplicarEstiloASeleccion = useOpmStore((s) => s.aplicarEstiloASeleccion);
  const [aplicarABatch, setAplicarABatch] = useState(false);
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
  const crearEstadosConNombres = (nombres: string[]) => {
    if (nombres.length === 2) {
      agregarEstados();
      const creados = estadosDeEntidad(store.getState().modelo, entidad.id).slice(0, 2);
      renombrarEstadosCreados(creados, nombres);
      return;
    }
    if (nombres.length === 1) {
      const previos = new Set(estados.map((estado) => estado.id));
      agregarEstado();
      const creado = estadosDeEntidad(store.getState().modelo, entidad.id).find((estado) => !previos.has(estado.id));
      if (creado) renombrarEstadosCreados([creado], nombres);
    }
  };

  const cobertura = coberturaApariencias(modelo, entidad.id);
  // L1 ronda 20: si la entidad cambia y el tab actual no aplica, caer a
  // default. En este slice los 5 tabs aplican a objeto y proceso por igual,
  // pero los tabs `apariciones` y `enlaces` pueden no tener contenido
  // accionable; aun así son tabs válidos y siguen activos.
  useEffect(() => {
    // Aterrizaje seguro: cualquier valor heredado fuera de TABS_ENTIDAD
    // (por ejemplo tras una migración futura) se normaliza a `semantica`.
    if (!TABS_ENTIDAD.some((t) => t.id === tabActivo)) cambiarTab("semantica");
  }, [tabActivo, cambiarTab]);

  return (
    <>
      <div style={style.header}>
        <span style={style.kind}>{entidad.tipo === "objeto" ? "Objeto" : "Proceso"}</span>
        <code style={style.id}>{entidad.id}</code>
      </div>
      <label style={style.field}>
        <span style={style.label}>Nombre</span>
        <input style={style.input} value={entidad.nombre} onInput={(event) => renombrar(event.currentTarget.value)} />
      </label>
      <InspectorTabs
        tabs={TABS_ENTIDAD}
        activo={tabActivo}
        onCambiar={cambiarTab}
        ariaLabel="Inspector entidad"
        panelIdPrefix="inspector-panel-entidad"
      />
      <div
        role="tabpanel"
        id={`inspector-panel-entidad-${tabActivo}`}
        data-testid={`inspector-panel-${tabActivo}`}
        style={style.tabPanel}
      >
        {tabActivo === "semantica" ? (
          <PanelSemantica
            entidad={entidad}
            cobertura={cobertura}
            onClickCobertura={() => cambiarTab("apariciones")}
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
        ) : null}
        {tabActivo === "enlaces" ? (
          <PanelEnlaces cobertura={cobertura} />
        ) : null}
        {tabActivo === "refinamiento" ? (
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
            aparienciaActivaPresente={!!aparienciaActiva}
            onDescomponer={descomponer}
            onDesplegar={desplegar}
            onQuitarDescomposicion={quitarDescomposicion}
            onQuitarDespliegue={quitarDespliegue}
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
            onRedimensionar={redimensionarSeleccionada}
            onAjustarTexto={ajustarSeleccionadaAlTexto}
            onVolverAuto={volverSeleccionadaAAuto}
            onAlternarModo={alternarModoTamanoSeleccionado}
            apariencia={aparienciaActiva}
          />
        ) : null}
        {tabActivo === "apariciones" ? (
          <SeccionApariciones
            modelo={modelo}
            entidad={entidad}
            opdActivoId={opdActivoId}
            onNavegar={cambiarOpdActivo}
          />
        ) : null}
        {tabActivo === "estilo" ? (
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
          />
        ) : null}
      </div>
      {/*
        Preserva testid `inspector-entidad-acciones` para procesos. En objeto
        este testid lo emite SeccionUrls dentro del tab Semántica (no se
        toca su contenido). El placeholder en proceso solo está vivo cuando
        el tab Semántica está activo, igual que pre-ronda 20 que solo lo
        rendía en flujo entidad. Los smokes que hoy no lo consultan no se
        afectan; si en el futuro un smoke lo necesita, este placeholder
        sigue presente en tab Semántica.
      */}
      {entidad.tipo !== "objeto" && tabActivo === "semantica" ? <div data-testid="inspector-entidad-acciones" /> : null}
    </>
  );
}

// ── Panel: Semántica ───────────────────────────────────────────────────────

interface PanelSemanticaProps {
  entidad: Entidad;
  cobertura: { totalApariencias: number; opdsConEntidad: number };
  onClickCobertura: () => void;
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
        <button
          type="button"
          data-testid="inspector-cobertura-apariencias"
          style={style.coberturaHint}
          title="Aparece en varios OPDs. Click para ver el tab Apariciones."
          onClick={props.onClickCobertura}
        >
          {`Aparece en ${cobertura.opdsConEntidad} OPDs (${cobertura.totalApariencias} ${cobertura.totalApariencias === 1 ? "vez" : "veces"}). Los cambios afectan a todas.`}
        </button>
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

// ── Panel: Enlaces ─────────────────────────────────────────────────────────

interface PanelEnlacesProps {
  cobertura: { totalApariencias: number; opdsConEntidad: number };
}

function PanelEnlaces({ cobertura }: PanelEnlacesProps) {
  // Slice mínimo: el panel Enlaces es por ahora un placeholder honesto que
  // muestra cobertura cross-OPD y delega al canvas la selección de enlaces.
  // Iteración futura (ver brief §1): listar enlaces in/out con su tipo y
  // contraparte. Mantenemos el panel presente para que el tab "Enlaces"
  // siempre tenga afordancia legible, evitando un tab vacío.
  return (
    <div data-testid="inspector-panel-enlaces-contenido">
      <p style={style.empty}>
        Selecciona un enlace en el canvas o en el panel OPL para inspeccionarlo y editarlo.
      </p>
      {cobertura.opdsConEntidad >= 2 ? (
        <p style={style.empty}>
          {`Esta cosa participa en enlaces visibles en ${cobertura.opdsConEntidad} OPDs distintos.`}
        </p>
      ) : null}
    </div>
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
  aparienciaActivaPresente: boolean;
  apariencia: import("../modelo/tipos").Apariencia | undefined;
  onDescomponer: () => void;
  onDesplegar: (modo?: import("../modelo/tipos").ModoDespliegueObjeto) => void;
  onQuitarDescomposicion: () => void;
  onQuitarDespliegue: () => void;
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
  onRedimensionar: (width: number, height: number) => void;
  onAjustarTexto: () => void;
  onVolverAuto: () => void;
  onAlternarModo: () => void;
}

function PanelRefinamiento(props: PanelRefinamientoProps) {
  return (
    <>
      {props.apariencia ? (
        <SeccionTamano
          apariencia={props.apariencia}
          onRedimensionar={props.onRedimensionar}
          onAjustarTexto={props.onAjustarTexto}
          onVolverAuto={props.onVolverAuto}
          onAlternarModo={props.onAlternarModo}
        />
      ) : null}
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
        onDescomponer={props.onDescomponer}
        onDesplegar={props.onDesplegar}
        onQuitarDescomposicion={props.onQuitarDescomposicion}
        onQuitarDespliegue={props.onQuitarDespliegue}
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
    </>
  );
}

// ── Panel: Estilo ──────────────────────────────────────────────────────────

interface PanelEstiloProps {
  apariencia: import("../modelo/tipos").Apariencia | undefined;
  seleccionMultipleCount: number;
  aplicarABatch: boolean;
  onCambiarAplicarABatch: (valor: boolean) => void;
  onApply: (patch: import("../modelo/tipos").EstiloApariencia) => void;
  onReset: () => void;
  onApplyText: (patch: import("../modelo/tipos").EstiloApariencia) => void;
  onResetText: () => void;
}

function PanelEstilo(props: PanelEstiloProps) {
  if (!props.apariencia) {
    return <p style={style.empty}>El tab Estilo solo aplica cuando la entidad tiene apariencia en el OPD activo.</p>;
  }
  return (
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
  );
}

function renombrarEstadosCreados(estados: readonly { id: Id; nombre: string }[], nombres: readonly string[]): void {
  const deseados = new Map(estados.map((estado, index) => [estado.id, nombres[index] ?? estado.nombre]));
  const nombresDeseados = new Set(Array.from(deseados.values()).map((nombre) => nombre.trim().toLocaleLowerCase("es")));
  estados.forEach((estado, index) => {
    const deseadoPropio = deseados.get(estado.id)?.trim().toLocaleLowerCase("es");
    const nombreActual = estado.nombre.trim().toLocaleLowerCase("es");
    if (deseadoPropio !== nombreActual && nombresDeseados.has(nombreActual)) {
      store.getState().renombrarEstadoSeleccionado(estado.id, `estado-temporal-${index + 1}`);
    }
  });
  estados.forEach((estado, index) => {
    const nombre = nombres[index];
    if (nombre) store.getState().renombrarEstadoSeleccionado(estado.id, nombre);
  });
}

const advancedStyles = {
  section: { display: "grid", gap: "8px", marginBottom: "14px" },
} satisfies Record<string, preact.JSX.CSSProperties>;
