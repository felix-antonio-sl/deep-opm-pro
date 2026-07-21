import { useEffect, useRef, useState } from "preact/hooks";
import { autoInvocacionDeProceso } from "../modelo/autoinvocacion";
import { esRequisito } from "../modelo/estereotipos";
import { agregacionesInzoomFaltantes, esAtributoDerivado, estadoSubmodelo, estadosDeEntidad, materializacionEfectivaSubmodelo, relacionesPlegadasEstructurales, relacionesSemiplegadasEstructurales } from "../modelo/operaciones";
import { filasPlegadoParcial, modoPlegadoApariencia, partesDePlegado } from "../modelo/plegado";
import type { Entidad, Id, Modelo, OrdenPartesPlegado, SatisfaccionRequisito, SubmodeloReferencia } from "../modelo/tipos";
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
import { SeccionAnclas } from "./inspector/SeccionAnclas";
import { SeccionAnclaje, debeMostrarSeccionAnclaje } from "./inspector/SeccionAnclaje";
import { SeccionDisclosure } from "./inspector/SeccionDisclosure";
import { SeccionNotasMesa } from "./inspector/SeccionNotasMesa";
import { SeccionEnlaces } from "./inspector/SeccionEnlaces";
import { SeccionImagen } from "./inspector/SeccionImagen";
import { SeccionLayoutEstados } from "./inspector/SeccionLayoutEstados";
import { SeccionRefinamiento, OPCIONES_DESPLIEGUE_OBJETO } from "./inspector/SeccionRefinamiento";
import { primerOpdConEntidad, satisfaccionesDeRequisito, satisfaccionesDeTarget, SeccionCoberturaRequisito, SeccionRequisitosVinculados } from "./inspector/SeccionRequisitos";
import { SeccionTamano } from "./inspector/SeccionTamano";
import { SeccionUrls } from "./inspector/SeccionUrls";
import { deriveElementIntent, runTutorPolicy } from "../tutor";
import { TutorInterventionDetails, mapearLentesTutor } from "./TutorDetails";

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
    fijarLinealidad,
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
  const [focoTutor, setFocoTutor] = useState<"kind" | "properties">(
    solicitarFocusNombre === entidad.id ? "kind" : "properties",
  );
  const abrirDialogoRequisito = useOpmStore((s) => s.abrirDialogoRequisito);
  const crearRequirementViewSeleccionado = useOpmStore((s) => s.crearRequirementViewSeleccionado);
  const abrirDialogoSubmodelo = useOpmStore((s) => s.abrirDialogoSubmodelo);
  const actualizarSubmodeloSeleccionado = useOpmStore((s) => s.actualizarSubmodeloSeleccionado);
  const descargarSubmodeloSeleccionado = useOpmStore((s) => s.descargarSubmodeloSeleccionado);
  const desconectarSubmodeloSeleccionado = useOpmStore((s) => s.desconectarSubmodeloSeleccionado);
  const seleccionarEntidad = useOpmStore((s) => s.seleccionarEntidad);
  const driftMap = useOpmStore((s) => s.driftMap);
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
  const satisfaccionesCubiertas = esRequisito(entidad) ? satisfaccionesDeRequisito(modelo, entidad.id) : [];
  const lentesTutor = mapearLentesTutor(modelo.lentesConocimiento ?? []);
  const intervencionEntidad = runTutorPolicy(focoTutor === "kind"
    ? deriveElementIntent({
        intentId: `entity:${entidad.id}:kind`,
        focus: "kind",
        chosenKind: entidad.tipo === "objeto" ? "object" : "process",
        activeLenses: lentesTutor,
      })
    : deriveElementIntent({
        intentId: `entity:${entidad.id}:properties`,
        focus: "properties",
        property: "essence",
        activeLenses: lentesTutor,
      }));
  // C′·A (M-4): «Anclaje» nace abierta si la biblioteca divergió (pide atención),
  // plegada si está al día — la sección se auto-muestra cuando importa.
  const anclajeAbierto = entidad.anclaje != null && (driftMap[entidad.id] ?? "no-resuelto") !== "sincronizado";
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
          onInput={(event) => {
            setFocoTutor("properties");
            renombrar(event.currentTarget.value);
          }}
          onBlur={() => setFocoTutor("properties")}
          onKeyDown={reenviarComboGlobalDesdeInput}
        />
      </label>
      {!debeMostrarSeccionAnclaje(entidad) ? (
        <TutorInterventionDetails
          intervention={intervencionEntidad}
          testId="tutor-inspector-entidad"
        />
      ) : null}
      {/*
        Ficha continua (Codex C9): las secciones se apilan en orden
        estricto Semántica → Enlaces → Refinamiento → Extensiones → Apariciones → Tamaño.
        Cada bloque conserva su testid `inspector-panel-{id}` para que el
        smoke ubique su contenido sin tabs; ya no hay `role="tabpanel"`.
      */}
      <div data-testid="inspector-ficha" style={style.ficha}>
        <FichaSeccion kicker="Semántica" testid="inspector-panel-semantica" primera colapsable defaultAbierta>
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
            onLineal={fijarLinealidad}
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
        <FichaSeccion kicker="Enlaces" testid="inspector-panel-enlaces" colapsable defaultAbierta>
          <SeccionEnlaces modelo={modelo} entidad={entidad} onNavegarEnlace={navegarAEnlace} />
        </FichaSeccion>
        <FichaSeccion kicker="Refinamiento" testid="inspector-panel-refinamiento" colapsable defaultAbierta={false}>
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
        <FichaSeccion kicker="Extensiones" testid="inspector-panel-extensiones" colapsable defaultAbierta={false}>
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
            onActualizarSubmodelo={actualizarSubmodeloSeleccionado}
            onDescargarSubmodelo={descargarSubmodeloSeleccionado}
            onDesconectarSubmodelo={desconectarSubmodeloSeleccionado}
            onAbrirSubmodelo={(opdVistaId) => cambiarOpdActivo(opdVistaId)}
            onAbrirEntidad={abrirEntidadReferenciada}
            onAbrirEnlace={navegarAEnlace}
          />
        </FichaSeccion>
        {debeMostrarSeccionAnclaje(entidad) ? (
          <FichaSeccion kicker="Anclaje" testid="inspector-panel-anclaje" colapsable defaultAbierta={anclajeAbierto}>
            <SeccionAnclaje entidad={entidad} />
          </FichaSeccion>
        ) : null}
        <FichaSeccion kicker="Apariciones" testid="inspector-panel-apariciones" colapsable defaultAbierta={false}>
          <SeccionApariciones
            modelo={modelo}
            entidad={entidad}
            opdActivoId={opdActivoId}
            onNavegar={cambiarOpdActivo}
          />
        </FichaSeccion>
        <FichaSeccion kicker="Tamaño" testid="inspector-panel-tamano" colapsable defaultAbierta={false}>
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
  onActualizarSubmodelo: (refId?: Id) => void;
  onDescargarSubmodelo: (refId?: Id) => void;
  onDesconectarSubmodelo: (refId?: Id) => void;
  onAbrirSubmodelo: (opdVistaId: Id) => void;
  onAbrirEntidad: (entidadId: Id) => void;
  onAbrirEnlace: (enlaceId: Id) => void;
}) {
  const requisito = props.entidad.requisito;
  return (
    <div style={extensionesStyles.body}>
      {esRequisito(props.entidad) && requisito ? (
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
      {esRequisito(props.entidad) && requisito ? (
        <SeccionCoberturaRequisito
          modelo={props.modelo}
          satisfacciones={props.satisfaccionesCubiertas}
          onAbrirEntidad={props.onAbrirEntidad}
          onAbrirEnlace={props.onAbrirEnlace}
        />
      ) : null}
      <div style={extensionesStyles.actions}>
        <button type="button" style={style.secondaryButton} onClick={props.onCrearRequisito}>
          {esRequisito(props.entidad) ? "Crear requisito" : "Crear requisito vinculado"}
        </button>
        <button type="button" style={style.secondaryButton} onClick={props.onMarcarRequisito} disabled={props.entidad.tipo !== "objeto"}>Marcar como requisito</button>
        <button type="button" style={style.secondaryButton} onClick={props.onSatisfacerRequisito}>Vincular requisito existente</button>
        <button type="button" style={style.secondaryButton} onClick={props.onRequirementView} disabled={!esRequisito(props.entidad)}>Vista de requisito</button>
        <button type="button" style={style.secondaryButton} onClick={props.onSubmodelo}>Conectar submodelo</button>
      </div>
      {props.submodelos.length > 0 ? (
        <section style={extensionesStyles.refs} data-testid="inspector-submodelos">
          <span class="opm-label-uppercase" style={style.label}>Submodelos</span>
          {props.submodelos.map((ref) => {
            const estado = estadoSubmodelo(ref);
            const puedeDescargar = estado !== "descargado" && estado !== "desconectado" && !!materializacionEfectivaSubmodelo(props.modelo, ref);
            return (
              <div key={ref.id} style={extensionesStyles.refRow}>
                <div style={extensionesStyles.refCopy}>
                  <span style={extensionesStyles.refName}>{ref.nombre}</span>
                  <span style={extensionesStyles.refState}>{ref.source?.modeloId ?? ref.modeloId}</span>
                </div>
                <span style={badgeSubmodelo(estado)} title="Estado derivado de la referencia y su materialización local">
                  {labelEstadoSubmodelo(estado)}
                </span>
                <div style={extensionesStyles.refActions}>
                  {ref.opdVistaId ? (
                    <button type="button" style={extensionesStyles.inlineButton} onClick={() => props.onAbrirSubmodelo(ref.opdVistaId!)}>
                      Abrir
                    </button>
                  ) : null}
                  {estado !== "desconectado" ? (
                    <>
                    <button type="button" style={extensionesStyles.inlineButton} onClick={() => props.onActualizarSubmodelo(ref.id)}>
                      Actualizar
                    </button>
                    <button
                      type="button"
                      style={puedeDescargar ? extensionesStyles.inlineButton : extensionesStyles.inlineButtonDisabled}
                      disabled={!puedeDescargar}
                      onClick={() => props.onDescargarSubmodelo(ref.id)}
                    >
                      Descargar
                    </button>
                    <button type="button" style={extensionesStyles.inlineButton} onClick={() => confirmarDesconexionSubmodelo(ref.nombre, () => props.onDesconectarSubmodelo(ref.id))}>
                      Desvincular
                    </button>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
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

function labelEstadoSubmodelo(estado: ReturnType<typeof estadoSubmodelo>): string {
  if (estado === "cargado-sincronizado") return "sincronizado";
  if (estado === "cargado-no-sincronizado") return "desactualizado";
  if (estado === "desconectado") return "desvinculado";
  return "sin cargar";
}

function badgeSubmodelo(estado: ReturnType<typeof estadoSubmodelo>): preact.JSX.CSSProperties {
  if (estado === "cargado-sincronizado") return extensionesStyles.refBadgeOk;
  if (estado === "cargado-no-sincronizado") return extensionesStyles.refBadgeWarn;
  if (estado === "desconectado") return extensionesStyles.refBadgeOff;
  return extensionesStyles.refBadge;
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
  onLineal: (lineal: boolean) => void;
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
      {/* W6.4: procedencia normativa de la cosa (read-only; nace en el proto). */}
      <SeccionAnclas target={{ tipo: "entidad", id: entidad.id }} />
      {/* C′·A (M-4): Notas de mesa (método) y metadatos «Avanzado» (Alias/URLs/
          Imagen) bajan a disclosures cerrados — el núcleo semántico (Descripción,
          Estados, Esencia) queda arriba, a la vista. */}
      <SeccionDisclosure titulo="Notas de mesa" colapsoId="sem.notas">
        <SeccionNotasMesa target={{ tipo: "entidad", id: entidad.id }} />
      </SeccionDisclosure>
      {entidad.tipo === "objeto" ? (
        <SeccionDisclosure titulo="Avanzado" colapsoId="sem.avanzado" testid="inspector-avanzado">
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
        </SeccionDisclosure>
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
        lineal={entidad.lineal ?? false}
        onLineal={props.onLineal}
        mostrarLinealidad={entidad.tipo === "objeto"}
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
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "8px",
    alignItems: "center",
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
  },
  refCopy: { display: "grid", gap: "2px", minWidth: 0 },
  refName: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 700 },
  refState: { color: tokens.colors.ink50, fontFamily: tokens.typography.fontFamilyMono, fontSize: "10px" },
  refActions: { gridColumn: "1 / -1", display: "flex", gap: "10px", flexWrap: "wrap" },
  refBadge: {
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: "10px",
    whiteSpace: "nowrap",
  },
  refBadgeOk: {
    color: tokens.colors.success,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: "10px",
    whiteSpace: "nowrap",
  },
  refBadgeWarn: {
    color: tokens.colors.crimson,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: "10px",
    whiteSpace: "nowrap",
  },
  refBadgeOff: {
    color: tokens.colors.inkFaint,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: "10px",
    whiteSpace: "nowrap",
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
  inlineButtonDisabled: {
    border: 0,
    background: "transparent",
    color: tokens.colors.inkFaint,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    cursor: "not-allowed",
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
