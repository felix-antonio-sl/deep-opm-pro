import { useEffect, useRef } from "preact/hooks";
import { autoInvocacionDeProceso } from "../modelo/autoinvocacion";
import { agregacionesInzoomFaltantes, esAtributoDerivado, estadosDeEntidad, relacionesPlegadasEstructurales, relacionesSemiplegadasEstructurales } from "../modelo/operaciones";
import { filasPlegadoParcial, modoPlegadoApariencia, partesDePlegado } from "../modelo/plegado";
import type { Entidad, EstadoCargaSubmodelo, Id, Modelo, OrdenPartesPlegado, SatisfaccionRequisito, SubmodeloReferencia } from "../modelo/tipos";
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
import { primerOpdConEntidad, satisfaccionesDeRequisito, satisfaccionesDeTarget, SeccionCoberturaRequisito, SeccionRequisitosVinculados } from "./inspector/SeccionRequisitos";
import { SeccionTamano } from "./inspector/SeccionTamano";
import { SeccionUrls } from "./inspector/SeccionUrls";

export { OPCIONES_DESPLIEGUE_OBJETO };

interface Props {
  entidad: Entidad;
}

/**
 * Barrel publico del inspector de entidad. Conserva lecturas amplias del store
 * y delega secciones OPM atomicas respaldadas por SSOT 3.7, 3.68, 3.71a y V-1.
 *
 * Ronda Codex v2 / L3 (C9): el contenido dejó de particionarse en tabs y pasó
 * a una **ficha tipográfica continua** — las seis secciones (Semántica →
 * Enlaces → Refinamiento → Extensiones → Apariciones → Tamaño) se apilan verticalmente,
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
    crearEstadosConNombres,
  } = useInspectorEntidadViewModel(entidad.id);
  // L4 ronda 23 (#15): focus auto default brutal al crear objeto/proceso.
  // Lectura directa al store (no se infla `EntityInspectorShellPort` porque
  // la señal es estrictamente UI y de corta vida; pasaría como ruido en el
  // resto del viewmodel).
  const solicitarFocusNombre = useOpmStore((s) => s.solicitarFocusNombre);
  const consumirFocusNombre = useOpmStore((s) => s.consumirFocusNombre);
  const abrirDialogoRequisito = useOpmStore((s) => s.abrirDialogoRequisito);
  const crearRequirementViewSeleccionado = useOpmStore((s) => s.crearRequirementViewSeleccionado);
  const abrirDialogoSubmodelo = useOpmStore((s) => s.abrirDialogoSubmodelo);
  const marcarEstadoSubmodeloSeleccionado = useOpmStore((s) => s.marcarEstadoSubmodeloSeleccionado);
  const desconectarSubmodeloSeleccionado = useOpmStore((s) => s.desconectarSubmodeloSeleccionado);
  const seleccionarEntidad = useOpmStore((s) => s.seleccionarEntidad);
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
  const submodelosEntidad = Object.values(modelo.submodelos ?? {}).filter((ref) => ref.anchorEntidadId === entidad.id);
  const satisfaccionesEntidad = satisfaccionesDeTarget(modelo, { tipo: "entidad", id: entidad.id });
  const satisfaccionesCubiertas = entidad.estereotipo === "requirement" ? satisfaccionesDeRequisito(modelo, entidad.id) : [];
  const abrirEntidadReferenciada = (entidadId: Id) => {
    const destino = primerOpdConEntidad(modelo, entidadId, opdActivoId);
    if (destino && destino !== opdActivoId) cambiarOpdActivo(destino);
    seleccionarEntidad(entidadId);
  };

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
        Ficha continua (Codex C9): las secciones se apilan en orden
        estricto Semántica → Enlaces → Refinamiento → Extensiones → Apariciones → Tamaño.
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
        <FichaSeccion kicker="Extensiones" testid="inspector-panel-extensiones">
          <PanelExtensiones
            entidad={entidad}
            modelo={modelo}
            submodelos={submodelosEntidad}
            satisfaccionesEntidad={satisfaccionesEntidad}
            satisfaccionesCubiertas={satisfaccionesCubiertas}
            onCrearRequisito={() => abrirDialogoRequisito("crear")}
            onMarcarRequisito={() => abrirDialogoRequisito("marcar")}
            onSatisfacerRequisito={() => abrirDialogoRequisito("satisfacer")}
            onRequirementView={crearRequirementViewSeleccionado}
            onSubmodelo={abrirDialogoSubmodelo}
            onEstadoSubmodelo={marcarEstadoSubmodeloSeleccionado}
            onDesconectarSubmodelo={desconectarSubmodeloSeleccionado}
            onAbrirSubmodelo={(opdVistaId) => cambiarOpdActivo(opdVistaId)}
            onAbrirEntidad={abrirEntidadReferenciada}
            onAbrirEnlace={navegarAEnlace}
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
        <FichaSeccion kicker="Tamaño" testid="inspector-panel-tamano">
          {aparienciaActiva ? (
            <SeccionTamano
              apariencia={aparienciaActiva}
              onRedimensionar={redimensionarSeleccionada}
              onAjustarTexto={ajustarSeleccionadaAlTexto}
              onVolverAuto={volverSeleccionadaAAuto}
              onAlternarModo={alternarModoTamanoSeleccionado}
            />
          ) : (
            <p style={style.empty}>La entidad no tiene aparición en el OPD activo.</p>
          )}
        </FichaSeccion>
      </div>
    </>
  );
}

function PanelExtensiones(props: {
  entidad: Entidad;
  modelo: Modelo;
  submodelos: readonly SubmodeloReferencia[];
  satisfaccionesEntidad: readonly SatisfaccionRequisito[];
  satisfaccionesCubiertas: readonly SatisfaccionRequisito[];
  onCrearRequisito: () => void;
  onMarcarRequisito: () => void;
  onSatisfacerRequisito: () => void;
  onRequirementView: () => void;
  onSubmodelo: () => void;
  onEstadoSubmodelo: (refId: Id, estado: EstadoCargaSubmodelo) => void;
  onDesconectarSubmodelo: (refId?: Id) => void;
  onAbrirSubmodelo: (opdVistaId: Id) => void;
  onAbrirEntidad: (entidadId: Id) => void;
  onAbrirEnlace: (enlaceId: Id) => void;
}) {
  const requisito = props.entidad.requisito;
  return (
    <div style={extensionesStyles.body}>
      {props.entidad.estereotipo === "requirement" && requisito ? (
        <div style={extensionesStyles.meta}>
          <span style={extensionesStyles.metaStrong}>{requisito.idLogico}</span>
          <span>{requisito.dureza}</span>
          <span>{requisito.satisfaction ?? "pendiente"}</span>
        </div>
      ) : (
        <SeccionRequisitosVinculados
          modelo={props.modelo}
          satisfacciones={props.satisfaccionesEntidad}
          emptyText="Sin requisitos vinculados a esta cosa."
          onAbrirRequisito={props.onAbrirEntidad}
        />
      )}
      {props.entidad.estereotipo === "requirement" && requisito ? (
        <SeccionCoberturaRequisito
          modelo={props.modelo}
          satisfacciones={props.satisfaccionesCubiertas}
          onAbrirEntidad={props.onAbrirEntidad}
          onAbrirEnlace={props.onAbrirEnlace}
        />
      ) : null}
      <div style={extensionesStyles.actions}>
        <button type="button" style={style.secondaryButton} onClick={props.onCrearRequisito}>
          {props.entidad.estereotipo === "requirement" ? "Crear requisito" : "Crear requisito vinculado"}
        </button>
        <button type="button" style={style.secondaryButton} onClick={props.onMarcarRequisito} disabled={props.entidad.tipo !== "objeto"}>Marcar como requisito</button>
        <button type="button" style={style.secondaryButton} onClick={props.onSatisfacerRequisito}>Vincular requisito existente</button>
        <button type="button" style={style.secondaryButton} onClick={props.onRequirementView} disabled={props.entidad.estereotipo !== "requirement"}>Vista de requisito</button>
        <button type="button" style={style.secondaryButton} onClick={props.onSubmodelo}>Conectar submodelo</button>
      </div>
      {props.submodelos.length > 0 ? (
        <section style={extensionesStyles.refs} data-testid="inspector-submodelos">
          <span class="opm-label-uppercase" style={style.label}>Submodelos</span>
          {props.submodelos.map((ref) => (
            <div key={ref.id} style={extensionesStyles.refRow}>
              <div style={extensionesStyles.refCopy}>
                <span style={extensionesStyles.refName}>{ref.nombre}</span>
                <span style={extensionesStyles.refState}>{ref.modeloId}</span>
              </div>
              <select
                aria-label={`Estado de submodelo ${ref.nombre}`}
                style={extensionesStyles.refSelect}
                value={ref.estado}
                disabled={ref.estado === "desconectado"}
                onChange={(event) => props.onEstadoSubmodelo(ref.id, event.currentTarget.value as EstadoCargaSubmodelo)}
              >
                <option value="descargado">descargado</option>
                <option value="cargado-sincronizado">sincronizado</option>
                <option value="cargado-no-sincronizado">no sincronizado</option>
                {ref.estado === "desconectado" ? <option value="desconectado">desconectado</option> : null}
              </select>
              {ref.opdVistaId ? (
                <button type="button" style={extensionesStyles.inlineButton} onClick={() => props.onAbrirSubmodelo(ref.opdVistaId!)}>
                  Abrir
                </button>
              ) : null}
              {ref.estado !== "desconectado" ? (
                <button type="button" style={extensionesStyles.inlineButton} onClick={() => confirmarDesconexionSubmodelo(ref.nombre, () => props.onDesconectarSubmodelo(ref.id))}>
                  Desconectar
                </button>
              ) : null}
            </div>
          ))}
        </section>
      ) : (
        <p style={style.hint}>Sin submodelo conectado a esta cosa.</p>
      )}
    </div>
  );
}

function confirmarDesconexionSubmodelo(nombre: string, accion: () => void): void {
  const confirmar = typeof globalThis.confirm === "function"
    ? globalThis.confirm(`Desconectar "${nombre}" es irreversible en esta referencia. ¿Continuar?`)
    : true;
  if (confirmar) accion();
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
 * Ajustar texto/Volver auto) vive aparte porque es geometría de aparición, no
 * estructura semántica.
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

const advancedStyles = {
  section: { display: "grid", gap: "8px", marginBottom: "14px" },
} satisfies Record<string, preact.JSX.CSSProperties>;

const extensionesStyles = {
  body: { display: "grid", gap: "10px" },
  actions: { display: "grid", gap: "6px" },
  meta: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: "8px",
    alignItems: "center",
    padding: "8px 10px",
    border: `1px solid ${tokens.colors.ink15}`,
    color: tokens.colors.ink70,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
  },
  metaStrong: { color: tokens.colors.ink, fontWeight: 700 },
  refs: { display: "grid", gap: "6px" },
  refRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(112px, auto) auto auto",
    gap: "8px",
    alignItems: "center",
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
  },
  refCopy: { display: "grid", gap: "2px", minWidth: 0 },
  refName: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 700 },
  refState: { color: tokens.colors.ink50, fontFamily: tokens.typography.fontFamilyMono, fontSize: "10px" },
  refSelect: {
    minWidth: 0,
    height: "28px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "11px",
  },
  inlineButton: {
    border: 0,
    background: "transparent",
    color: tokens.colors.accentDark,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    cursor: "pointer",
    padding: 0,
  },
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
