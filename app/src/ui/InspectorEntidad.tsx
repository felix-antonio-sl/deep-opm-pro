import { useState } from "preact/hooks";
import { autoInvocacionDeProceso } from "../modelo/autoinvocacion";
import { estadosDeEntidad } from "../modelo/operaciones";
import { filasPlegadoParcial, modoPlegadoApariencia, partesDePlegado } from "../modelo/plegado";
import type { Entidad, OrdenPartesPlegado } from "../modelo/tipos";
import { useOpmStore } from "../store";
import { inspectorStyles as style } from "./inspectorStyles";
import { SeccionAlias } from "./inspector/SeccionAlias";
import { SeccionDescripcion } from "./inspector/SeccionDescripcion";
import { SeccionEsenciaAfiliacion } from "./inspector/SeccionEsenciaAfiliacion";
import { SeccionLayoutEstados } from "./inspector/SeccionLayoutEstados";
import { SeccionRefinamiento, OPCIONES_DESPLIEGUE_OBJETO } from "./inspector/SeccionRefinamiento";
import { SeccionUrls } from "./inspector/SeccionUrls";
import { StyleControls } from "./StyleControls";

export { OPCIONES_DESPLIEGUE_OBJETO };

interface Props {
  entidad: Entidad;
}

/**
 * Barrel publico del inspector de entidad. Conserva lecturas amplias del store
 * y delega secciones OPM atomicas respaldadas por SSOT 3.7, 3.68, 3.71a y V-1.
 */
export function InspectorEntidad({ entidad }: Props) {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const renombrar = useOpmStore((s) => s.renombrarSeleccionada);
  const fijarEsencia = useOpmStore((s) => s.fijarEsenciaSeleccionada);
  const fijarAfiliacion = useOpmStore((s) => s.fijarAfiliacionSeleccionada);
  const descomponer = useOpmStore((s) => s.descomponerSeleccionada);
  const desplegar = useOpmStore((s) => s.desplegarSeleccionada);
  const quitarDescomposicion = useOpmStore((s) => s.quitarDescomposicionSeleccionada);
  const quitarDespliegue = useOpmStore((s) => s.quitarDespliegueSeleccionado);
  const crearAutoInvocacion = useOpmStore((s) => s.crearAutoInvocacionSeleccionada);
  const cambiarModoPlegado = useOpmStore((s) => s.cambiarModoPlegadoSeleccionado);
  const cambiarOrdenPartes = useOpmStore((s) => s.cambiarOrdenPartesSeleccionado);
  const aplicarEstilo = useOpmStore((s) => s.aplicarEstiloSeleccionado);
  const resetearEstilo = useOpmStore((s) => s.resetearEstiloSeleccionado);
  const aplicarEstiloTexto = useOpmStore((s) => s.aplicarEstiloTextoAccion);
  const resetearEstiloTexto = useOpmStore((s) => s.resetEstiloTextoAccion);
  const extraerParte = useOpmStore((s) => s.extraerParteDePlegado);
  const reinsertarParte = useOpmStore((s) => s.reinsertarParteExtraidaSeleccionada);
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
  const editarAliasEntidad = useOpmStore((s) => s.editarAliasEntidad);
  const editarUnidadEntidad = useOpmStore((s) => s.editarUnidadEntidad);
  const editarDescripcionEntidad = useOpmStore((s) => s.editarDescripcionEntidad);
  const fijarLayoutEstadosEntidad = useOpmStore((s) => s.fijarLayoutEstadosEntidad);
  const eliminar = useOpmStore((s) => s.eliminarSeleccion);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const aplicarEstiloASeleccion = useOpmStore((s) => s.aplicarEstiloASeleccion);
  const [aplicarABatch, setAplicarABatch] = useState(false);
  const aparienciaActiva = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {}).find((apariencia) => apariencia.entidadId === entidad.id);
  const partesPlegables = partesDePlegado(modelo, entidad.id);
  const modoPlegado = aparienciaActiva ? modoPlegadoApariencia(aparienciaActiva) : "completo";
  const filasParciales = aparienciaActiva && modoPlegado === "parcial" ? filasPlegadoParcial(modelo, opdActivoId, aparienciaActiva.id) : [];
  const estados = entidad.tipo === "objeto" ? estadosDeEntidad(modelo, entidad.id) : [];
  const autoInvocacion = entidad.tipo === "proceso" ? autoInvocacionDeProceso(modelo, opdActivoId, entidad.id) : undefined;

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
      {entidad.tipo === "objeto" ? (
        <section style={advancedStyles.section} aria-label="Metadatos avanzados">
          <SeccionAlias alias={entidad.alias} unidad={entidad.unidad} onAlias={(value) => editarAliasEntidad(entidad.id, value)} onUnidad={(value) => editarUnidadEntidad(entidad.id, value)} />
          <SeccionDescripcion descripcion={entidad.descripcion} onDescripcion={(value) => editarDescripcionEntidad(entidad.id, value)} />
          <SeccionUrls entidadId={entidad.id} urls={entidad.urls} onAbrirUrls={abrirModalUrls} />
        </section>
      ) : null}
      <SeccionEsenciaAfiliacion esencia={entidad.esencia} afiliacion={entidad.afiliacion} onEsencia={fijarEsencia} onAfiliacion={fijarAfiliacion} />
      <SeccionRefinamiento
        entidad={entidad}
        autoInvocacion={autoInvocacion}
        tienePartesPlegables={partesPlegables.length > 0 && !!aparienciaActiva}
        modoPlegado={modoPlegado}
        ordenPartes={aparienciaActiva?.ordenPartes}
        filasParciales={filasParciales}
        padreAparienciaId={aparienciaActiva?.id}
        parteExtraidaDe={aparienciaActiva?.parteExtraidaDe}
        onDescomponer={descomponer}
        onDesplegar={desplegar}
        onQuitarDescomposicion={quitarDescomposicion}
        onQuitarDespliegue={quitarDespliegue}
        onCrearAutoInvocacion={crearAutoInvocacion}
        onCambiarModoPlegado={() => cambiarModoPlegado(modoPlegado === "parcial" ? "completo" : "parcial")}
        onCambiarOrdenPartes={(orden: OrdenPartesPlegado) => cambiarOrdenPartes(orden)}
        onExtraer={extraerParte}
        onReinsertarParte={reinsertarParte}
      />
      {entidad.tipo === "objeto" ? (
        <SeccionLayoutEstados
          modelo={modelo}
          entidadId={entidad.id}
          estados={estados}
          layout={entidad.layoutEstados ?? "horizontal"}
          onAgregarEstados={agregarEstados}
          onAgregarEstado={agregarEstado}
          onEliminar={eliminarEstado}
          onQuitarEstados={quitarEstados}
          onRenombrar={renombrarEstado}
          onDesignar={designarEstadoComo}
          onQuitarDesignacion={quitarDesignacion}
          onSuprimir={suprimirEstadoPorId}
          onRestaurar={restaurarEstadoPorId}
          onAbrirDuracion={abrirModalDuracion}
          onLayout={(layout) => fijarLayoutEstadosEntidad(entidad.id, layout)}
        />
      ) : null}
      {aparienciaActiva ? (
        <StyleControls
          estilo={aparienciaActiva.estilo}
          onApply={(patch) => (aplicarABatch ? aplicarEstiloASeleccion(patch) : aplicarEstilo(patch))}
          onReset={resetearEstilo}
          showText
          onApplyText={(textPatch) => (aplicarABatch ? aplicarEstiloASeleccion(textPatch) : aplicarEstiloTexto(aparienciaActiva.id, textPatch))}
          onResetText={() => resetearEstiloTexto(aparienciaActiva.id)}
          seleccionMultipleCount={seleccionados.length}
          aplicarASeleccion={aplicarABatch}
          onCambiarAplicarASeleccion={setAplicarABatch}
        />
      ) : null}
      {entidad.tipo !== "objeto" ? <div data-testid="inspector-entidad-acciones" /> : null}
      <button type="button" style={style.dangerButton} onClick={eliminar}>Eliminar entidad</button>
    </>
  );
}

const advancedStyles = {
  section: { display: "grid", gap: "8px", marginBottom: "14px" },
} satisfies Record<string, preact.JSX.CSSProperties>;
