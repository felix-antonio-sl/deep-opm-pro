import { useEffect, useState } from "preact/hooks";
import { abanicoDeEnlace } from "../modelo/abanicos";
import { esEnlaceEstructuralFundamental } from "../modelo/constantes";
import { etiquetaEnlaceNormalizada, validarEtiquetaEnlace } from "../modelo/etiquetasEnlace";
import { entidadDeExtremo, entidadIdDeExtremo, nombreExtremo } from "../modelo/extremos";
import { relacionesEstructuralesFaltantes, validarMultiplicidad } from "../modelo/operaciones";
import { anclajeRefinableSimbolo, anclajeRefinadorSimbolo, limitarAnclajeSimbolo, normalizarAnclajeSimbolo } from "../modelo/simboloEstructural";
import { useOpmStore, store } from "../store";
import type { AnclajeSimboloEstructural, AnclajesSimboloEstructural, AparienciaEnlace, Enlace, Entidad, Id, Modelo, Modificador, TipoEnlace, UnidadTiempo } from "../modelo/tipos";
import type { TabInspectorEnlace } from "../store/tipos";
import { inspectorStyles as style } from "./inspectorStyles";
import { InspectorTabs, type InspectorTabDef } from "./inspector/InspectorTabs";
import { SeccionAbanico } from "./inspectorEnlace/SeccionAbanico";
import { SeccionEstilo } from "./inspectorEnlace/SeccionEstilo";
import { SeccionEstiloEnlace } from "./inspectorEnlace/SeccionEstiloEnlace";
import { SeccionExtremos } from "./inspectorEnlace/SeccionExtremos";
import { SeccionEtiquetaEnlace, SeccionMultiplicidad, probabilidadValida } from "./inspectorEnlace/SeccionMultiplicidad";
import { SeccionMetadatosOpcloud } from "./inspectorEnlace/SeccionMetadatosOpcloud";
import { SeccionReanclaje, contextoReanclaje } from "./inspectorEnlace/SeccionReanclaje";
import { SeccionRuta } from "./inspectorEnlace/SeccionRuta";
import { DialogoEstiloEnlace } from "./DialogoEstiloEnlace";
import { DialogoMoverPuerto } from "./DialogoMoverPuerto";
import { tokens } from "./tokens";

interface Props {
  enlace: Enlace;
}

/**
 * L1 ronda 20: tabs por intención del Inspector de enlace. 3 tabs simétricos
 * a la partición de entidad: Propiedades / Extremos / Estilo. Default
 * `propiedades`.
 */
const TABS_ENLACE: ReadonlyArray<InspectorTabDef<TabInspectorEnlace>> = [
  { id: "propiedades", label: "Propiedades", testid: "inspector-enlace-tab-propiedades" },
  { id: "extremos", label: "Extremos", testid: "inspector-enlace-tab-extremos" },
  { id: "estilo", label: "Estilo", testid: "inspector-enlace-tab-estilo" },
];

/**
 * Barrel publico del inspector de enlace. Mantiene acciones Zustand exactas y
 * delega secciones alineadas con SSOT: multiplicidad, rutas y abanicos.
 *
 * Contrato TablaEnlaces Beta1 (ronda 15 L5): TablaEnlaces debe compartir
 * data-binding y validators con este Inspector (validarEtiquetaEnlace,
 * validarMultiplicidad, ajustarMultiplicidadSeleccionada). El acuerdo
 * formal se documenta en `app/e2e/15-superficie-contextual.spec.ts`
 * bajo el describe.skip "Contrato TablaEnlaces Beta1".
 *
 * L1 ronda 20: el contenido se particiona en 3 tabs por intención
 * (Propiedades / Extremos / Estilo). El tab activo persiste en
 * `store.uiPanel.tabInspectorEnlaceActivo`. Cero cambios en la lógica de
 * cada `Seccion*`; solo se reorganizan en su tab.
 */
export function InspectorEnlace({ enlace }: Props) {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const tabActivo = useOpmStore((s) => s.tabInspectorEnlaceActivo);
  const cambiarTab = useOpmStore((s) => s.cambiarTabInspectorEnlace);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const ajustarMultiplicidad = useOpmStore((s) => s.ajustarMultiplicidadSeleccionada);
  const apuntarExtremo = useOpmStore((s) => s.apuntarExtremoEnlaceSeleccionado);
  const reanclarEnlaceExternoDerivado = useOpmStore((s) => s.reanclarEnlaceExternoDerivado);
  const volverEnlaceExternoDerivadoAAutomatico = useOpmStore((s) => s.volverEnlaceExternoDerivadoAAutomatico);
  const splitEffect = useOpmStore((s) => s.splitEffectSeleccionado);
  const alternarOperadorAbanico = useOpmStore((s) => s.alternarOperadorAbanicoSeleccionado);
  const quitarRamaDeAbanico = useOpmStore((s) => s.quitarRamaDeAbanicoSeleccionado);
  const disolverAbanico = useOpmStore((s) => s.disolverAbanicoSeleccionado);
  const aplicarModificador = useOpmStore((s) => s.aplicarModificadorEnlaceSeleccionado);
  const aplicarSubtipoModificador = useOpmStore((s) => s.aplicarSubtipoModificadorEnlaceSeleccionado);
  const quitarModificador = useOpmStore((s) => s.quitarModificadorEnlaceSeleccionado);
  const definirProbabilidadEvento = useOpmStore((s) => s.definirProbabilidadEventoSeleccionada);
  const definirDemoraInvocacion = useOpmStore((s) => s.definirDemoraInvocacionSeleccionada);
  const definirBackwardTag = useOpmStore((s) => s.definirBackwardTagSeleccionado);
  const definirRequisitosEnlace = useOpmStore((s) => s.definirRequisitosEnlaceSeleccionado);
  const definirTasaEnlace = useOpmStore((s) => s.definirTasaEnlaceSeleccionada);
  const definirTiempoExcepcionEnlace = useOpmStore((s) => s.definirTiempoExcepcionEnlaceSeleccionado);
  const moverPuerto = useOpmStore((s) => s.moverPuertoEnlaceSeleccionado);
  const renombrarEtiquetaEnlace = useOpmStore((s) => s.renombrarEtiquetaEnlaceSeleccionado);
  const definirRutaEtiqueta = useOpmStore((s) => s.definirRutaEtiquetaSeleccionada);
  const cambiarTipoGrupoEstructural = useOpmStore((s) => s.cambiarTipoGrupoEstructuralSeleccionado);
  const fijarOrdenGrupoEstructural = useOpmStore((s) => s.fijarOrdenGrupoEstructuralSeleccionado);
  const actualizarAnclajesSimboloEstructural = useOpmStore((s) => s.actualizarAnclajesSimboloEstructural);
  const resetearAnclajesSimboloEstructural = useOpmStore((s) => s.resetearAnclajesSimboloEstructural);
  const separarGrupoEstructural = useOpmStore((s) => s.separarGrupoEstructuralSeleccionado);
  const volverGrupoEstructuralAutomatico = useOpmStore((s) => s.volverGrupoEstructuralAutomaticoSeleccionado);
  const traerRelacionesEstructuralesFaltantes = useOpmStore((s) => s.traerRelacionesEstructuralesFaltantesSeleccionadas);
  const plegarGrupoEstructural = useOpmStore((s) => s.plegarGrupoEstructuralSeleccionado);
  const plegarCompletoGrupoEstructural = useOpmStore((s) => s.plegarCompletoGrupoEstructuralSeleccionado);
  const eliminar = useOpmStore((s) => s.eliminarSeleccion);
  const aplicarEstiloEnlaceAccion = useOpmStore((s) => s.aplicarEstiloEnlaceAccion);
  const resetEstiloEnlaceAccion = useOpmStore((s) => s.resetEstiloEnlaceAccion);
  const copiarEstiloAlPortapapeles = useOpmStore((s) => s.copiarEstiloEnlaceAlPortapapeles);
  const pegarEstiloDesdePortapapeles = useOpmStore((s) => s.pegarEstiloEnlaceDesdePortapapeles);
  const enlaceEstiloPortapapeles = useOpmStore((s) => s.enlaceEstiloPortapapeles);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const aplicarEstiloASeleccion = useOpmStore((s) => s.aplicarEstiloASeleccion);
  const abanico = abanicoDeEnlace(modelo, enlace.id);
  const origen = entidadDeExtremo(modelo, enlace.origenId);
  const destino = entidadDeExtremo(modelo, enlace.destinoId);
  const endpointActual = contextoReanclaje(modelo, opdActivoId, enlace)?.endpointActualId ?? "";
  const [multiplicidadOrigen, setMultiplicidadOrigen] = useState(enlace.multiplicidadOrigen ?? "");
  const [multiplicidadDestino, setMultiplicidadDestino] = useState(enlace.multiplicidadDestino ?? "");
  const [probabilidad, setProbabilidad] = useState(enlace.probabilidad === undefined ? "" : String(enlace.probabilidad));
  const [demora, setDemora] = useState(enlace.demora ?? "");
  const [etiqueta, setEtiqueta] = useState(enlace.etiqueta);
  const [rutaEtiqueta, setRutaEtiqueta] = useState(enlace.rutaEtiqueta ?? "");
  const [backwardTag, setBackwardTag] = useState(enlace.backwardTag ?? "");
  const [requisitos, setRequisitos] = useState(enlace.requisitos ?? "");
  const [mostrarRequisitos, setMostrarRequisitos] = useState(enlace.mostrarRequisitos ?? false);
  const [tasa, setTasa] = useState(enlace.tasa ?? "");
  const [unidadesTasa, setUnidadesTasa] = useState(enlace.unidadesTasa ?? "");
  const [tiempoMinimo, setTiempoMinimo] = useState(enlace.tiempoMinimo ?? "");
  const [unidadTiempoMinimo, setUnidadTiempoMinimo] = useState<UnidadTiempo | "">((enlace.unidadTiempoMinimo as UnidadTiempo | undefined) ?? "");
  const [tiempoMaximo, setTiempoMaximo] = useState(enlace.tiempoMaximo ?? "");
  const [unidadTiempoMaximo, setUnidadTiempoMaximo] = useState<UnidadTiempo | "">((enlace.unidadTiempoMaximo as UnidadTiempo | undefined) ?? "");
  const [endpointSeleccionado, setEndpointSeleccionado] = useState(endpointActual);
  const [dialogoMoverPuertoAbierto, setDialogoMoverPuertoAbierto] = useState(false);
  const [dialogoEstiloAbierto, setDialogoEstiloAbierto] = useState(false);

  useEffect(() => {
    setMultiplicidadOrigen(enlace.multiplicidadOrigen ?? "");
    setMultiplicidadDestino(enlace.multiplicidadDestino ?? "");
  }, [enlace.id, enlace.multiplicidadDestino, enlace.multiplicidadOrigen]);
  useEffect(() => {
    setProbabilidad(enlace.probabilidad === undefined ? "" : String(enlace.probabilidad));
    setDemora(enlace.demora ?? "");
    setEtiqueta(enlace.etiqueta);
    setRutaEtiqueta(enlace.rutaEtiqueta ?? "");
    setBackwardTag(enlace.backwardTag ?? "");
    setRequisitos(enlace.requisitos ?? "");
    setMostrarRequisitos(enlace.mostrarRequisitos ?? false);
    setTasa(enlace.tasa ?? "");
    setUnidadesTasa(enlace.unidadesTasa ?? "");
    setTiempoMinimo(enlace.tiempoMinimo ?? "");
    setUnidadTiempoMinimo((enlace.unidadTiempoMinimo as UnidadTiempo | undefined) ?? "");
    setTiempoMaximo(enlace.tiempoMaximo ?? "");
    setUnidadTiempoMaximo((enlace.unidadTiempoMaximo as UnidadTiempo | undefined) ?? "");
  }, [enlace.id, enlace.probabilidad, enlace.demora, enlace.etiqueta, enlace.rutaEtiqueta, enlace.backwardTag, enlace.requisitos, enlace.mostrarRequisitos, enlace.tasa, enlace.unidadesTasa, enlace.tiempoMinimo, enlace.unidadTiempoMinimo, enlace.tiempoMaximo, enlace.unidadTiempoMaximo]);
  useEffect(() => setEndpointSeleccionado(endpointActual), [enlace.id, endpointActual]);
  useEffect(() => {
    if (!TABS_ENLACE.some((t) => t.id === tabActivo)) cambiarTab("propiedades");
  }, [tabActivo, cambiarTab]);

  const cambiarMultiplicidad = (lado: "origen" | "destino", valor: string) => {
    if (lado === "origen") setMultiplicidadOrigen(valor);
    if (lado === "destino") setMultiplicidadDestino(valor);
    if (valor === "" || validarMultiplicidad(valor)) ajustarMultiplicidad(lado, valor);
  };
  const cambiarModificador = (valor: string) => {
    if (valor === "") {
      quitarModificador();
      return;
    }
    aplicarModificador(valor as Modificador);
  };
  const cambiarProbabilidad = (valor: string) => {
    setProbabilidad(valor);
    if (valor === "") {
      definirProbabilidadEvento(undefined);
      return;
    }
    if (probabilidadValida(valor)) definirProbabilidadEvento(Number(valor));
  };
  const cambiarDemora = (valor: string) => {
    setDemora(valor);
    definirDemoraInvocacion(valor.trim() === "" ? undefined : valor);
  };
  const cambiarEtiqueta = (valor: string) => {
    setEtiqueta(valor);
    const normalizada = etiquetaEnlaceNormalizada(valor);
    if (validarEtiquetaEnlace(enlace, normalizada).ok) renombrarEtiquetaEnlace(valor);
  };
  const cambiarRutaEtiqueta = (valor: string) => {
    setRutaEtiqueta(valor);
    definirRutaEtiqueta(valor.trim() === "" ? undefined : valor);
  };
  const cambiarBackwardTag = (valor: string) => {
    setBackwardTag(valor);
    definirBackwardTag(valor.trim() === "" ? undefined : valor);
  };
  const cambiarRequisitos = (valor: string, mostrar: boolean) => {
    setRequisitos(valor);
    setMostrarRequisitos(valor.trim().length > 0 ? mostrar : false);
    definirRequisitosEnlace(valor.trim() === "" ? undefined : valor, valor.trim().length > 0 && mostrar);
  };
  const cambiarTasa = (valor: string, unidades: string) => {
    setTasa(valor);
    setUnidadesTasa(unidades);
    definirTasaEnlace(valor.trim() === "" ? undefined : valor, unidades.trim() === "" ? undefined : unidades);
  };
  const cambiarTiempoExcepcion = (valores: {
    tiempoMinimo: string;
    unidadTiempoMinimo: UnidadTiempo | "";
    tiempoMaximo: string;
    unidadTiempoMaximo: UnidadTiempo | "";
  }) => {
    setTiempoMinimo(valores.tiempoMinimo);
    setUnidadTiempoMinimo(valores.unidadTiempoMinimo);
    setTiempoMaximo(valores.tiempoMaximo);
    setUnidadTiempoMaximo(valores.unidadTiempoMaximo);
    definirTiempoExcepcionEnlace({
      tiempoMinimo: valores.tiempoMinimo.trim() === "" ? undefined : valores.tiempoMinimo,
      unidadTiempoMinimo: valores.unidadTiempoMinimo || undefined,
      tiempoMaximo: valores.tiempoMaximo.trim() === "" ? undefined : valores.tiempoMaximo,
      unidadTiempoMaximo: valores.unidadTiempoMaximo || undefined,
    });
  };

  const opdsDelEnlace = opdsConEnlace(modelo, enlace.id);
  const enlaceFueraDelOpdActivo = opdsDelEnlace.length > 0 && !opdsDelEnlace.includes(opdActivoId);
  const opdDestinoNavegacion = enlaceFueraDelOpdActivo ? opdsDelEnlace[0] : null;

  return (
    <>
      <div style={style.header}>
        <span style={style.kind}>Enlace {capitalizar(enlace.tipo)}</span>
        <code style={style.id}>{enlace.id}</code>
      </div>
      <div style={style.summary}>
        <span>{origen ? nombreExtremo(modelo, enlace.origenId) : enlace.origenId.id}</span>
        <span style={style.arrow}>{"->"}</span>
        <span>{destino ? nombreExtremo(modelo, enlace.destinoId) : enlace.destinoId.id}</span>
      </div>
      {enlaceFueraDelOpdActivo && opdDestinoNavegacion ? (
        <button
          type="button"
          data-testid="inspector-enlace-ir-opd"
          style={enlaceStyles.irOpd}
          title="Cambia al OPD donde aparece el enlace seleccionado"
          onClick={() => cambiarOpdActivo(opdDestinoNavegacion)}
        >
          Ir al OPD donde aparece este enlace ({modelo.opds[opdDestinoNavegacion]?.nombre ?? opdDestinoNavegacion})
        </button>
      ) : null}
      <InspectorTabs
        tabs={TABS_ENLACE}
        activo={tabActivo}
        onCambiar={cambiarTab}
        ariaLabel="Inspector enlace"
        panelIdPrefix="inspector-panel-enlace"
      />
      <div
        role="tabpanel"
        id={`inspector-panel-enlace-${tabActivo}`}
        data-testid={`inspector-panel-enlace-${tabActivo}`}
        style={style.tabPanel}
      >
        {tabActivo === "propiedades" ? (
          <>
            <SeccionEtiquetaEnlace enlace={enlace} etiqueta={etiqueta} onEtiqueta={cambiarEtiqueta} />
            <SeccionMultiplicidad
              enlace={enlace}
              multiplicidadOrigen={multiplicidadOrigen}
              multiplicidadDestino={multiplicidadDestino}
              probabilidad={probabilidad}
              demora={demora}
              onMultiplicidad={cambiarMultiplicidad}
              onModificador={cambiarModificador}
              onSubtipoModificador={aplicarSubtipoModificador}
              onProbabilidad={cambiarProbabilidad}
              onDemora={cambiarDemora}
            />
            <SeccionMetadatosOpcloud
              enlace={enlace}
              backwardTag={backwardTag}
              requisitos={requisitos}
              mostrarRequisitos={mostrarRequisitos}
              tasa={tasa}
              unidadesTasa={unidadesTasa}
              tiempoMinimo={tiempoMinimo}
              unidadTiempoMinimo={unidadTiempoMinimo}
              tiempoMaximo={tiempoMaximo}
              unidadTiempoMaximo={unidadTiempoMaximo}
              onBackwardTag={cambiarBackwardTag}
              onRequisitos={cambiarRequisitos}
              onTasa={cambiarTasa}
              onTiempoExcepcion={cambiarTiempoExcepcion}
            />
            {/* Ronda 20 L1 ajuste post-merge: el operador del Abanico es propiedad
                lógica del enlace (igual que multiplicidad/modificador), por lo que
                vive en Propiedades. Smokes 02-canvas-y-render lo asumen visible al
                seleccionar el enlace. */}
            <SeccionAbanico abanico={abanico} onAlternarOperador={alternarOperadorAbanico} onQuitarRama={quitarRamaDeAbanico} onDisolver={disolverAbanico} />
            <SeccionGrupoEstructural
              modelo={modelo}
              opdId={opdActivoId}
              enlace={enlace}
              seleccionados={seleccionados}
              onTipo={cambiarTipoGrupoEstructural}
              onOrdenado={fijarOrdenGrupoEstructural}
              onAnclajes={actualizarAnclajesSimboloEstructural}
              onResetAnclajes={resetearAnclajesSimboloEstructural}
              onSeparar={separarGrupoEstructural}
              onAutomatico={volverGrupoEstructuralAutomatico}
              onTraerFaltantes={traerRelacionesEstructuralesFaltantes}
              onPlegar={plegarGrupoEstructural}
              onPlegarCompleto={plegarCompletoGrupoEstructural}
            />
          </>
        ) : null}
        {tabActivo === "extremos" ? (
          <>
            <SeccionExtremos modelo={modelo} enlace={enlace} onApuntarExtremo={apuntarExtremo} onAbrirMoverPuerto={() => setDialogoMoverPuertoAbierto(true)} />
            <SeccionRuta modelo={modelo} enlace={enlace} rutaEtiqueta={rutaEtiqueta} onRutaEtiqueta={cambiarRutaEtiqueta} />
            <SeccionReanclaje
              modelo={modelo}
              opdActivoId={opdActivoId}
              enlace={enlace}
              endpointSeleccionado={endpointSeleccionado}
              onEndpointSeleccionado={setEndpointSeleccionado}
              onAplicar={reanclarEnlaceExternoDerivado}
              onAutomatico={volverEnlaceExternoDerivadoAAutomatico}
            />
            {enlace.tipo === "efecto" ? <button type="button" style={style.secondaryButton} onClick={splitEffect} title="Convierte el efecto en consumo + objeto intermedio + resultado">Split en par</button> : null}
          </>
        ) : null}
        {tabActivo === "estilo" ? (
          <>
            <SeccionEstilo
              enlace={enlace}
              hayPortapapeles={!!enlaceEstiloPortapapeles}
              onAbrirDialogo={() => setDialogoEstiloAbierto(true)}
              onCopiar={copiarEstiloAlPortapapeles}
              onPegar={pegarEstiloDesdePortapapeles}
              onReset={resetEstiloEnlaceAccion}
              onAplicar={aplicarEstiloEnlaceAccion}
            />
            <SeccionEstiloEnlace
              enlace={enlace}
              modelo={modelo}
              seleccionados={seleccionados}
              enlaceEstiloPortapapeles={enlaceEstiloPortapapeles}
              onAplicarEstilo={aplicarEstiloEnlaceAccion}
              onReset={resetEstiloEnlaceAccion}
              onCopiar={copiarEstiloAlPortapapeles}
              onPegar={pegarEstiloDesdePortapapeles}
              onAplicarSeleccion={aplicarEstiloASeleccion}
            />
          </>
        ) : null}
      </div>
      <DialogoEstiloEnlace
        abierto={dialogoEstiloAbierto}
        enlace={enlace}
        onCerrar={() => setDialogoEstiloAbierto(false)}
        onAplicar={aplicarEstiloEnlaceAccion}
      />
      <DialogoMoverPuerto
        open={dialogoMoverPuertoAbierto}
        modelo={modelo}
        opdId={opdActivoId}
        enlace={enlace}
        onCancel={() => setDialogoMoverPuertoAbierto(false)}
        onMover={(lado, extremo) => {
          moverPuerto(lado, extremo);
          setDialogoMoverPuertoAbierto(false);
        }}
        onRemover={() => {
          moverPuerto("destino", enlace.destinoId, true);
          setDialogoMoverPuertoAbierto(false);
        }}
      />
      <button type="button" style={style.dangerButton} onClick={eliminar}>Eliminar enlace</button>
      <button type="button" style={style.oplEditButton} onClick={() => store.getState().abrirInspectorEnlaceDesdeOpl(enlace.id)} title="Editar este enlace desde el panel OPL-ES">
        Editar OPL
      </button>
    </>
  );
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Devuelve los IDs de OPDs que contienen una apariencia de este enlace.
 * Se usa para ofrecer navegacion explicita "Ir al OPD del enlace" cuando el
 * usuario seleccionan un enlace via OPL/Tabla y el OPD activo no lo contiene.
 */
function opdsConEnlace(modelo: Modelo, enlaceId: Id): Id[] {
  const ids: Id[] = [];
  for (const opd of Object.values(modelo.opds)) {
    if (Object.values(opd.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId)) {
      ids.push(opd.id);
    }
  }
  return ids;
}

function SeccionGrupoEstructural(props: {
  modelo: Modelo;
  opdId: Id;
  enlace: Enlace;
  seleccionados: readonly Id[];
  onTipo: (tipo: TipoEnlace) => void;
  onOrdenado: (ordenado: boolean) => void;
  onAnclajes: (aparienciaEnlaceIds: Id[], anclajes: AnclajesSimboloEstructural) => void;
  onResetAnclajes: (aparienciaEnlaceIds: Id[]) => void;
  onSeparar: () => void;
  onAutomatico: () => void;
  onTraerFaltantes: () => void;
  onPlegar: () => void;
  onPlegarCompleto: () => void;
}) {
  if (!esEnlaceEstructuralFundamental(props.enlace.tipo)) return null;
  const separado = !!props.enlace.grupoEstructuralId;
  const grupo = grupoEstructuralInspector(props.modelo, props.enlace, props.seleccionados);
  const ordenado = grupo.refinable?.orderedFundamentalTypes?.includes(props.enlace.tipo) ?? false;
  const faltantes = relacionesEstructuralesFaltantes(props.modelo, props.opdId, grupo.ids).faltantes;
  const aparienciasGrupo = aparienciasEnlaceGrupo(props.modelo, props.opdId, grupo.ids);
  const aparienciaEnlaceIds = aparienciasGrupo.map((apariencia) => apariencia.id);
  const anclajes = anclajesGrupo(aparienciasGrupo);
  const editarAnclaje = (rol: keyof AnclajesSimboloEstructural, eje: keyof AnclajeSimboloEstructural, valor: string) => {
    const numero = Number(valor);
    if (!Number.isFinite(numero) || aparienciaEnlaceIds.length === 0) return;
    const actual = anclajes[rol] ?? anclajeDefault(rol);
    props.onAnclajes(aparienciaEnlaceIds, {
      ...anclajes,
      [rol]: limitarAnclajeSimbolo({ ...actual, [eje]: numero }),
    });
  };
  const desplazar = (rol: keyof AnclajesSimboloEstructural, dx: number) => {
    if (aparienciaEnlaceIds.length === 0) return;
    const actual = anclajes[rol] ?? anclajeDefault(rol);
    props.onAnclajes(aparienciaEnlaceIds, {
      ...anclajes,
      [rol]: limitarAnclajeSimbolo({ ...actual, dx }),
    });
  };
  const resetearAnclajes = () => {
    if (aparienciaEnlaceIds.length === 0) return;
    props.onResetAnclajes(aparienciaEnlaceIds);
  };
  return (
    <div style={style.field}>
      <span style={style.label}>Grupo estructural</span>
      <label style={style.label}>
        Tipo
        <select
          aria-label="Tipo estructural"
          data-testid="tipo-grupo-estructural"
          style={style.input}
          value={props.enlace.tipo}
          onChange={(event) => props.onTipo(event.currentTarget.value as TipoEnlace)}
        >
          <option value="agregacion">Agregación</option>
          <option value="exhibicion">Exhibición</option>
          <option value="generalizacion">Generalización</option>
          <option value="clasificacion">Clasificación</option>
        </select>
      </label>
      <label style={enlaceStyles.checkRow}>
        <input
          type="checkbox"
          data-testid="orden-grupo-estructural"
          checked={ordenado}
          onChange={(event) => props.onOrdenado(event.currentTarget.checked)}
        />
        <span>Ordenado</span>
      </label>
      <span style={enlaceStyles.help}>
        {grupo.ids.length > 1 ? `${grupo.ids.length} ramas asociadas al símbolo.` : "Una rama estructural asociada al símbolo."}
        {faltantes > 0 ? ` ${faltantes} relación(es) plegada(s) disponibles.` : ""}
      </span>
      <div style={enlaceStyles.anclasPanel}>
        <span style={style.label}>Anclas del símbolo</span>
        <FilaAnclaje
          label="Entrada"
          anclaje={anclajes.refinable}
          disabled={aparienciaEnlaceIds.length === 0}
          onDx={(valor) => editarAnclaje("refinable", "dx", valor)}
          onDy={(valor) => editarAnclaje("refinable", "dy", valor)}
          onIzquierda={() => desplazar("refinable", -10)}
          onCentro={() => desplazar("refinable", 0)}
          onDerecha={() => desplazar("refinable", 10)}
        />
        <FilaAnclaje
          label="Salida"
          anclaje={anclajes.refinador}
          disabled={aparienciaEnlaceIds.length === 0}
          onDx={(valor) => editarAnclaje("refinador", "dx", valor)}
          onDy={(valor) => editarAnclaje("refinador", "dy", valor)}
          onIzquierda={() => desplazar("refinador", -10)}
          onCentro={() => desplazar("refinador", 0)}
          onDerecha={() => desplazar("refinador", 10)}
        />
        <button
          type="button"
          data-testid="reset-anclas-simbolo-estructural"
          style={style.secondaryButton}
          disabled={aparienciaEnlaceIds.length === 0}
          onClick={resetearAnclajes}
        >
          Auto anclas
        </button>
      </div>
      <button
        type="button"
        data-testid="traer-faltantes-grupo-estructural"
        style={style.secondaryButton}
        onClick={props.onTraerFaltantes}
        title="Trae al OPD activo las relaciones estructurales del mismo refinable que existen en otros OPDs"
      >
        Traer faltantes
      </button>
      <button
        type="button"
        data-testid="plegar-grupo-estructural"
        style={style.secondaryButton}
        onClick={props.onPlegar}
        title="Oculta las ramas visibles bajo el refinable usando el plegado parcial"
      >
        Semiplegar grupo
      </button>
      <button
        type="button"
        data-testid="plegar-completo-grupo-estructural"
        style={style.secondaryButton}
        onClick={props.onPlegarCompleto}
        title="Oculta las ramas visibles bajo el refinable sin mostrar filas internas"
      >
        Plegar completo
      </button>
      <button
        type="button"
        data-testid="separar-grupo-estructural"
        style={style.secondaryButton}
        onClick={props.onSeparar}
        title="Separa el enlace seleccionado, o la selección compatible, en un grupo estructural manual"
      >
        Separar grupo
      </button>
      {separado ? (
        <button
          type="button"
          data-testid="grupo-estructural-automatico"
          style={style.secondaryButton}
          onClick={props.onAutomatico}
          title="Devuelve este enlace al agrupamiento automático por tipo y refinable"
        >
          Usar grupo automático
        </button>
      ) : null}
    </div>
  );
}

function FilaAnclaje(props: {
  label: string;
  anclaje: AnclajeSimboloEstructural;
  disabled: boolean;
  onDx: (valor: string) => void;
  onDy: (valor: string) => void;
  onIzquierda: () => void;
  onCentro: () => void;
  onDerecha: () => void;
}) {
  return (
    <div style={enlaceStyles.anclaFila}>
      <span style={enlaceStyles.anclaLabel}>{props.label}</span>
      <label style={enlaceStyles.anclaInputLabel}>
        dx
        <input
          type="number"
          min={-15}
          max={15}
          step={1}
          data-testid={`ancla-${props.label.toLowerCase()}-dx`}
          style={enlaceStyles.anclaInput}
          value={props.anclaje.dx}
          disabled={props.disabled}
          onChange={(event) => props.onDx(event.currentTarget.value)}
        />
      </label>
      <label style={enlaceStyles.anclaInputLabel}>
        dy
        <input
          type="number"
          min={-15}
          max={15}
          step={1}
          data-testid={`ancla-${props.label.toLowerCase()}-dy`}
          style={enlaceStyles.anclaInput}
          value={props.anclaje.dy}
          disabled={props.disabled}
          onChange={(event) => props.onDy(event.currentTarget.value)}
        />
      </label>
      <div style={enlaceStyles.anclaSlots}>
        <button type="button" style={enlaceStyles.slotButton} disabled={props.disabled} onClick={props.onIzquierda}>-10</button>
        <button type="button" style={enlaceStyles.slotButton} disabled={props.disabled} onClick={props.onCentro}>0</button>
        <button type="button" style={enlaceStyles.slotButton} disabled={props.disabled} onClick={props.onDerecha}>+10</button>
      </div>
    </div>
  );
}

const TIPOS_ESTRUCTURALES: readonly TipoEnlace[] = ["agregacion", "exhibicion", "generalizacion", "clasificacion"];

function grupoEstructuralInspector(modelo: Modelo, enlace: Enlace, seleccionados: readonly Id[]): { ids: Id[]; refinable?: Entidad } {
  const baseOrigen = entidadIdDeExtremo(modelo, enlace.origenId);
  const baseDestino = entidadIdDeExtremo(modelo, enlace.destinoId);
  const ids = [enlace.id, ...seleccionados.filter((id) => id !== enlace.id)]
    .filter((id, index, todos) => todos.indexOf(id) === index)
    .filter((id) => {
      const actual = modelo.enlaces[id];
      if (!actual || actual.tipo !== enlace.tipo || !TIPOS_ESTRUCTURALES.includes(actual.tipo)) return false;
      const origen = entidadIdDeExtremo(modelo, actual.origenId);
      const destino = entidadIdDeExtremo(modelo, actual.destinoId);
      return (!!baseOrigen && origen === baseOrigen) || (!!baseDestino && destino === baseDestino);
    });
  const refinableId = ids.length > 1 && baseOrigen ? baseOrigen : (baseOrigen ?? baseDestino ?? undefined);
  const refinable = refinableId ? modelo.entidades[refinableId] : undefined;
  return refinable ? { ids, refinable } : { ids };
}

function aparienciasEnlaceGrupo(modelo: Modelo, opdId: Id, enlaceIds: readonly Id[]): AparienciaEnlace[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const ids = new Set(enlaceIds);
  return Object.values(opd.enlaces).filter((apariencia) => ids.has(apariencia.enlaceId));
}

function anclajesGrupo(apariencias: readonly AparienciaEnlace[]): Required<AnclajesSimboloEstructural> {
  return {
    refinable: promedioAnclaje(
      apariencias.map((apariencia) => normalizarAnclajeSimbolo(apariencia.symbolAnchors?.refinable)),
      anclajeRefinableSimbolo(),
    ),
    refinador: promedioAnclaje(
      apariencias.map((apariencia) => normalizarAnclajeSimbolo(apariencia.symbolAnchors?.refinador)),
      anclajeRefinadorSimbolo(0, 1),
    ),
  };
}

function promedioAnclaje(
  anclajes: Array<AnclajeSimboloEstructural | null>,
  fallback: AnclajeSimboloEstructural,
): AnclajeSimboloEstructural {
  const validos = anclajes.filter((anclaje): anclaje is AnclajeSimboloEstructural => !!anclaje);
  if (validos.length === 0) return fallback;
  return limitarAnclajeSimbolo({
    dx: validos.reduce((total, anclaje) => total + anclaje.dx, 0) / validos.length,
    dy: validos.reduce((total, anclaje) => total + anclaje.dy, 0) / validos.length,
  });
}

function anclajeDefault(rol: keyof AnclajesSimboloEstructural): AnclajeSimboloEstructural {
  return rol === "refinable" ? anclajeRefinableSimbolo() : anclajeRefinadorSimbolo(0, 1);
}

const enlaceStyles = {
  irOpd: {
    width: "100%",
    minHeight: "30px",
    marginBottom: "12px",
    padding: "5px 10px",
    border: "1px solid rgb(191, 219, 254)",
    borderRadius: "6px",
    background: "rgb(239, 246, 255)",
    color: "rgb(30, 64, 175)",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
    textAlign: "left",
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    fontWeight: 700,
    color: tokens.colors.textoPrimario,
  },
  help: {
    color: tokens.colors.textoSecundario,
    fontSize: "11px",
    lineHeight: 1.35,
  },
  anclasPanel: {
    display: "grid",
    gap: "8px",
    padding: "8px",
    border: `1px solid ${tokens.colors.bordeSuave}`,
    borderRadius: "6px",
    background: tokens.colors.fondoElevado,
  },
  anclaFila: {
    display: "grid",
    gridTemplateColumns: "52px minmax(54px, 1fr) minmax(54px, 1fr)",
    gap: "6px",
    alignItems: "center",
  },
  anclaLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: tokens.colors.textoPrimario,
  },
  anclaInputLabel: {
    display: "grid",
    gap: "2px",
    fontSize: "10px",
    fontWeight: 700,
    color: tokens.colors.textoSecundario,
  },
  anclaInput: {
    minWidth: 0,
    height: "26px",
    padding: "3px 5px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: "4px",
    fontSize: "11px",
  },
  anclaSlots: {
    gridColumn: "2 / 4",
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "4px",
  },
  slotButton: {
    minHeight: "24px",
    padding: "2px 4px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: "4px",
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
