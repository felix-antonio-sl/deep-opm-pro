import { useState } from "preact/hooks";
import { autoInvocacionDeProceso } from "../modelo/autoinvocacion";
import { esAtributoDerivado, estadosDeEntidad } from "../modelo/operaciones";
import { filasPlegadoParcial, modoPlegadoApariencia, partesDePlegado } from "../modelo/plegado";
import type { Entidad, Id, Modelo, OrdenPartesPlegado } from "../modelo/tipos";
import { store, useOpmStore } from "../store";
import { inspectorStyles as style } from "./inspectorStyles";
import { SeccionAlias } from "./inspector/SeccionAlias";
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

  return (
    <>
      <div style={style.header}>
        <span style={style.kind}>{entidad.tipo === "objeto" ? "Objeto" : "Proceso"}</span>
        <code style={style.id}>{entidad.id}</code>
      </div>
      {cobertura.opdsConEntidad >= 2 ? (
        <p
          data-testid="inspector-cobertura-apariencias"
          style={advancedStyles.cobertura}
          title="Editar nombre, esencia o afiliación afecta a todas las apariencias en todos los OPDs (ver auditoría IFML §10.2)."
        >
          Esta cosa aparece {cobertura.totalApariencias} {cobertura.totalApariencias === 1 ? "vez" : "veces"} en {cobertura.opdsConEntidad} OPDs. Los cambios afectan a todas.
        </p>
      ) : null}
      <label style={style.field}>
        <span style={style.label}>Nombre</span>
        <input style={style.input} value={entidad.nombre} onInput={(event) => renombrar(event.currentTarget.value)} />
      </label>
      <SeccionDescripcion descripcion={entidad.descripcion} onDescripcion={(value) => editarDescripcionEntidad(entidad.id, value)} />
      {entidad.tipo === "objeto" ? (
        <section style={advancedStyles.section} aria-label="Metadatos avanzados">
          <SeccionAlias alias={entidad.alias} unidad={entidad.unidad} onAlias={(value) => editarAliasEntidad(entidad.id, value)} onUnidad={(value) => editarUnidadEntidad(entidad.id, value)} />
          <SeccionUrls entidadId={entidad.id} urls={entidad.urls} onAbrirUrls={abrirModalUrls} />
	          <SeccionImagen entidadId={entidad.id} {...(entidad.imagen ? { imagen: entidad.imagen } : {})} onAbrirImagen={abrirModalImagen} onQuitarImagen={quitarImagenEntidad} />
	        </section>
	      ) : null}
	      {atributoDerivado ? (
	        <SeccionAtributo
	          entidad={entidad}
	          derivado={atributoDerivado}
	          onUnidad={(value) => editarUnidadEntidad(entidad.id, value)}
	          onTipo={cambiarTipoValorAtributo}
	          onValor={asignarValorAtributo}
	        />
	      ) : null}
	      <SeccionEsenciaAfiliacion esencia={entidad.esencia} afiliacion={entidad.afiliacion} onEsencia={fijarEsencia} onAfiliacion={fijarAfiliacion} />
      {aparienciaActiva ? (
        <SeccionTamano
          apariencia={aparienciaActiva}
          onRedimensionar={redimensionarSeleccionada}
          onAjustarTexto={ajustarSeleccionadaAlTexto}
          onVolverAuto={volverSeleccionadaAAuto}
          onAlternarModo={alternarModoTamanoSeleccionado}
        />
      ) : null}
      <SeccionRefinamiento
        entidad={entidad}
        modelo={modelo}
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
        onReasignarEnlaceExterno={reasignarEnlaceExternoManual}
        onCrearAutoInvocacion={crearAutoInvocacion}
        onCambiarModoPlegado={() => cambiarModoPlegado(modoPlegado === "parcial" ? "completo" : "parcial")}
        onCambiarOrdenPartes={(orden: OrdenPartesPlegado) => cambiarOrdenPartes(orden)}
        onExtraer={extraerParte}
        onExtraerTodas={extraerTodasLasPartes}
        onReinsertarParte={reinsertarParte}
      />
      {entidad.tipo === "objeto" ? (
        <SeccionLayoutEstados
          modelo={modelo}
          entidad={entidad}
          entidadId={entidad.id}
          estados={estados}
          layout={entidad.layoutEstados ?? "horizontal"}
          onCrearEstadosConNombres={crearEstadosConNombres}
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

/**
 * Indica cuantas apariencias tiene la entidad y en cuantos OPDs distintos.
 * Hace explicito el contrato apariencia != entidad descrito en la auditoria
 * IFML §10.2: la edicion mediante Inspector se proyecta sobre todas las
 * apariencias, no solo la activa.
 */
function coberturaApariencias(modelo: Modelo, entidadId: Id): { totalApariencias: number; opdsConEntidad: number } {
  let totalApariencias = 0;
  let opdsConEntidad = 0;
  for (const opd of Object.values(modelo.opds)) {
    let aparicionesEnOpd = 0;
    for (const apariencia of Object.values(opd.apariencias)) {
      if (apariencia.entidadId === entidadId) aparicionesEnOpd += 1;
    }
    if (aparicionesEnOpd > 0) {
      totalApariencias += aparicionesEnOpd;
      opdsConEntidad += 1;
    }
  }
  return { totalApariencias, opdsConEntidad };
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
  cobertura: {
    margin: "0 0 12px",
    padding: "6px 8px",
    border: "1px solid rgb(191, 219, 254)",
    borderRadius: "6px",
    background: "rgb(239, 246, 255)",
    color: "rgb(30, 64, 175)",
    fontSize: "11px",
    fontWeight: 600,
    lineHeight: 1.35,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
