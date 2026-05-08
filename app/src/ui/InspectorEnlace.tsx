import { useEffect, useState } from "preact/hooks";
import { abanicoDeEnlace } from "../modelo/abanicos";
import { etiquetaEnlaceNormalizada, validarEtiquetaEnlace } from "../modelo/etiquetasEnlace";
import { entidadDeExtremo, nombreExtremo } from "../modelo/extremos";
import { validarMultiplicidad } from "../modelo/operaciones";
import { useOpmStore, store } from "../store";
import type { Enlace, Id, Modelo, Modificador } from "../modelo/tipos";
import type { TabInspectorEnlace } from "../store/tipos";
import { inspectorStyles as style } from "./inspectorStyles";
import { InspectorTabs, type InspectorTabDef } from "./inspector/InspectorTabs";
import { SeccionAbanico } from "./inspectorEnlace/SeccionAbanico";
import { SeccionEstilo } from "./inspectorEnlace/SeccionEstilo";
import { SeccionEstiloEnlace } from "./inspectorEnlace/SeccionEstiloEnlace";
import { SeccionExtremos } from "./inspectorEnlace/SeccionExtremos";
import { SeccionEtiquetaEnlace, SeccionMultiplicidad, probabilidadValida } from "./inspectorEnlace/SeccionMultiplicidad";
import { SeccionReanclaje, contextoReanclaje } from "./inspectorEnlace/SeccionReanclaje";
import { SeccionRuta } from "./inspectorEnlace/SeccionRuta";
import { DialogoEstiloEnlace } from "./DialogoEstiloEnlace";
import { DialogoMoverPuerto } from "./DialogoMoverPuerto";

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
  const moverPuerto = useOpmStore((s) => s.moverPuertoEnlaceSeleccionado);
  const renombrarEtiquetaEnlace = useOpmStore((s) => s.renombrarEtiquetaEnlaceSeleccionado);
  const definirRutaEtiqueta = useOpmStore((s) => s.definirRutaEtiquetaSeleccionada);
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
  }, [enlace.id, enlace.probabilidad, enlace.demora, enlace.etiqueta, enlace.rutaEtiqueta]);
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
            {/* Ronda 20 L1 ajuste post-merge: el operador del Abanico es propiedad
                lógica del enlace (igual que multiplicidad/modificador), por lo que
                vive en Propiedades. Smokes 02-canvas-y-render lo asumen visible al
                seleccionar el enlace. */}
            <SeccionAbanico abanico={abanico} onAlternarOperador={alternarOperadorAbanico} onQuitarRama={quitarRamaDeAbanico} onDisolver={disolverAbanico} />
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
} satisfies Record<string, preact.JSX.CSSProperties>;
