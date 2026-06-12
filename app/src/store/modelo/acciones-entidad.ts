import { CANON } from "../../modelo/constantes";
import { crearCosaEnPosicion } from "../../modelo/creacionInterna";
import { posicionLibre } from "../../modelo/layout";
import {
  ajustarAlTexto,
  alternarModoTamano,
  asignarValorAtributo,
  cambiarAfiliacion,
  cambiarEsencia,
  cambiarLinealidad,
  cambiarTipoValorAtributo,
  configurarSimulacionAtributo,
  crearAtributoEnObjeto,
  detectarColisionNombre,
  eliminarEntidad,
  redimensionarApariencia,
  renombrarEntidad,
  volverAAutoTamano,
} from "../../modelo/operaciones";
import {
  agregarUrl,
  cambiarModoImagen,
  editarImagen,
  editarAlias,
  editarDescripcion,
  editarUnidad,
  eliminarUrl,
  quitarImagen,
  reordenarUrls,
} from "../../modelo/objetoMetadata";
import { aparienciaDeEntidadEnOpd } from "../../modelo/politicaApariciones";
import type { Apariencia, Id, LayoutEstados, Modelo, ModoImagenEntidad, ParametrosSimulacionEntidad, TipoValorSlot } from "../../modelo/tipos";
import { commitModelo, type GetStore, type SetStore } from "../runtime";
import { addFlash } from "../feedback";
import type { ModeloSlice } from "../tipos";

/**
 * Acciones de creación/edición de entidad: crearObjetoDemo, crearProcesoDemo,
 * crearEntidadEnCanvas, fijarModoCreacion, renombrar/esencia/afiliación,
 * metadata aditiva (alias, unidad, descripción, URLs), layoutEstados, toggles
 * de visibilidad alias/descripciones.
 */
export function accionesEntidad(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
    crearObjetoDemo() {
      const { modelo, opdActivoId } = get();
      const resultado = crearCosaEnPosicion(modelo, opdActivoId, "objeto", posicionLibre(modelo, opdActivoId, "objeto"));
      if (resultado.ok) {
        const nueva = resultado.value.entidadId;
        // L4 ronda 23 (#15): default brutal — pedir focus al input Nombre del
        // Inspector. Lo consume `InspectorEntidad` via efecto al confirmar la
        // selección. La señal lleva la `Id` para que el efecto matchee y no
        // dispare con seleccciones anteriores residuales.
        const commiteado = commitModelo(set, modelo, resultado.value.modelo, { seleccionId: nueva, seleccionados: [nueva], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: null, solicitarFocusNombre: nueva });
        if (commiteado) addFlash("✓ Objeto creado");
      }
    },

    crearProcesoDemo() {
      const { modelo, opdActivoId } = get();
      const resultado = crearCosaEnPosicion(modelo, opdActivoId, "proceso", posicionLibre(modelo, opdActivoId, "proceso"));
      if (resultado.ok) {
        const nueva = resultado.value.entidadId;
        // L4 ronda 23 (#15): default brutal — pedir focus al input Nombre. Ver
        // comentario en `crearObjetoDemo`.
        const commiteado = commitModelo(set, modelo, resultado.value.modelo, { seleccionId: nueva, seleccionados: [nueva], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: null, solicitarFocusNombre: nueva });
        if (commiteado) addFlash("✓ Proceso creado");
      }
    },

    crearEntidadEnCanvas(tipo, posicion) {
      const { modelo, opdActivoId } = get();
      const resultado = crearCosaEnPosicion(modelo, opdActivoId, tipo, posicion);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const entidadCreada = resultado.value.modelo.entidades[resultado.value.entidadId];
      const nombre = entidadCreada?.nombre ?? "Cosa";
      // L4 ronda 23 (#15): este flujo abre un modal inline (`nuevaCosaPendiente`)
      // en ToolbarBase y NO el inspector con input Nombre; por eso aquí no se
      // emite la señal de focus del Inspector. El modal ya enfoca su propio
      // input al montar (responsabilidad de `ToolbarBase`).
      const commiteado = commitModelo(set, modelo, resultado.value.modelo, {
        seleccionId: resultado.value.entidadId,
        seleccionados: [resultado.value.entidadId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        modoCreacion: tipo,
        mensaje: null,
        // IFML H-3 / Ronda 15 L3: NavigationFlow explícito al sub-ViewContainer
        // "modal nombre cosa". Reemplaza el SystemEvent global previo.
        nuevaCosaPendiente: { entidadId: resultado.value.entidadId, aparienciaId: resultado.value.aparienciaId, nombre },
      });
      if (commiteado) addFlash(`✓ ${tipo === "objeto" ? "Objeto" : "Proceso"} creado`);
    },

    confirmarNombreNuevaCosa(nombre) {
      const pendiente = get().nuevaCosaPendiente;
      if (!pendiente) return;
      const { modelo, opdActivoId } = get();

      // B3: Detectar colisión antes de aplicar el nombre al objeto provisional.
      const entidadProv = modelo.entidades[pendiente.entidadId];
      const tipoProv = entidadProv?.tipo ?? "objeto";
      const colision = detectarColisionNombre(modelo, nombre, tipoProv, pendiente.entidadId);
      if (colision) {
        // Hallar la posición de la apariencia provisional para reusar en resolución.
        const aparienciasProv = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {});
        const apProv = aparienciasProv.find((a) => a.entidadId === pendiente.entidadId);
        const posicion = apProv ? { x: apProv.x, y: apProv.y } : { x: 100, y: 100 };
        // Suspender: no renombrar aún; abrir el diálogo de colisión.
        set({
          nuevaCosaPendiente: null,
          colisionPendiente: {
            contexto: "creacion",
            tipo: tipoProv,
            opdId: opdActivoId,
            posicion,
            colision,
            entidadProvId: pendiente.entidadId,
          },
        });
        return;
      }

      const resultado = renombrarEntidad(modelo, pendiente.entidadId, nombre);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: pendiente.entidadId,
        seleccionados: [pendiente.entidadId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
        nuevaCosaPendiente: null,
      });
    },

    descartarNuevaCosaPendiente() {
      if (!get().nuevaCosaPendiente) return;
      set({ nuevaCosaPendiente: null });
    },

    crearAparienciaEntidadEnCanvas(entidadId, posicion) {
      const { modelo, opdActivoId } = get();
      const entidad = modelo.entidades[entidadId];
      const opd = modelo.opds[opdActivoId];
      if (!entidad || !opd) {
        set({ mensaje: "La cosa no existe en el modelo activo" });
        return;
      }
      const existente = aparienciaDeEntidadEnOpd(opd, entidadId);
      if (existente) {
        set({
          seleccionId: entidadId,
          seleccionados: [entidadId],
          modoSeleccion: "simple",
          enlaceSeleccionId: null,
          modoEnlace: null,
          mensaje: "La cosa ya aparece en este OPD",
        });
        return;
      }
      const aparienciaId = `a-${modelo.nextSeq}`;
      const apariencia: Apariencia = {
        id: aparienciaId,
        entidadId,
        opdId: opdActivoId,
        x: Math.round(posicion.x),
        y: Math.round(posicion.y),
        width: CANON.dims.cosaWidth,
        height: CANON.dims.cosaHeight,
      };
      const siguiente: Modelo = {
        ...modelo,
        nextSeq: modelo.nextSeq + 1,
        opds: {
          ...modelo.opds,
          [opdActivoId]: {
            ...opd,
            apariencias: {
              ...opd.apariencias,
              [aparienciaId]: apariencia,
            },
          },
        },
      };
      const commiteado = commitModelo(set, modelo, siguiente, {
        seleccionId: entidadId,
        seleccionados: [entidadId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
      if (commiteado) addFlash("✓ Apariencia creada");
    },

    fijarModoCreacion(tipo) {
      // P1-5 ronda 4: activar sticky o cancelar todo descarta el editor inline.
      // El badge "Modo sticky" debe ser la unica senal de modo activa.
      set({
        modoCreacion: tipo,
        modoEnlace: null,
        nuevaCosaPendiente: null,
        mensaje: tipo ? `Haz clic en el canvas para crear ${tipo === "objeto" ? "un objeto" : "un proceso"}` : null,
      });
    },

    renombrarSeleccionada(nombre) {
      const { modelo, seleccionId } = get();
      if (!seleccionId) return;

      // B4: Detectar colisión antes de aplicar el rename.
      const entidad = modelo.entidades[seleccionId];
      if (entidad) {
        const colision = detectarColisionNombre(modelo, nombre, entidad.tipo, seleccionId);
        if (colision) {
          // Suspender rename: abrir el diálogo de colisión.
          set({
            colisionPendiente: {
              contexto: "rename",
              entidadId: seleccionId,
              colision,
            },
          });
          return;
        }
      }

      const resultado = renombrarEntidad(modelo, seleccionId, nombre);
      if (resultado.ok) commitModelo(set, modelo, resultado.value, { mensaje: null });
      else set({ mensaje: resultado.error });
    },

    crearAtributoEnObjetoSeleccionado(input = {}) {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona un objeto para crear atributo" });
        return;
      }
      const entidad = modelo.entidades[seleccionId];
      if (!entidad || entidad.tipo !== "objeto") {
        set({ mensaje: "Selecciona un objeto para crear atributo" });
        return;
      }
      const nombre = input.nombre ?? "Valor [u]";
      const resultado = crearAtributoEnObjeto(modelo, opdActivoId, seleccionId, nombre, {
        tipoSlot: input.tipoSlot ?? "float",
        ...(input.unidad ? { unidad: input.unidad } : {}),
      });
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value.modelo, {
        seleccionId: resultado.value.atributoId,
        seleccionados: [resultado.value.atributoId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
    },

	    asignarValorAtributoSeleccionado(valor) {
	      const { modelo, seleccionId } = get();
	      if (!seleccionId) return;
	      const resultado = asignarValorAtributo(modelo, seleccionId, valor);
	      if (!resultado.ok) {
	        set({ mensaje: resultado.error });
	        return;
	      }
	      commitModelo(set, modelo, resultado.value, { seleccionId, seleccionados: [seleccionId], enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
	    },

	    cambiarTipoValorAtributoSeleccionado(tipo: TipoValorSlot) {
	      const { modelo, seleccionId } = get();
	      if (!seleccionId) return;
	      const resultado = cambiarTipoValorAtributo(modelo, seleccionId, tipo);
	      if (!resultado.ok) {
	        set({ mensaje: resultado.error });
	        return;
	      }
	      commitModelo(set, modelo, resultado.value, { seleccionId, seleccionados: [seleccionId], enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
	    },

	    configurarSimulacionAtributoSeleccionado(parametros: ParametrosSimulacionEntidad | undefined) {
	      const { modelo, seleccionId } = get();
	      if (!seleccionId) return;
	      const resultado = configurarSimulacionAtributo(modelo, seleccionId, parametros);
	      if (!resultado.ok) {
	        set({ mensaje: resultado.error });
	        return;
	      }
	      commitModelo(set, modelo, resultado.value, { seleccionId, seleccionados: [seleccionId], enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
	    },

	    fijarEsenciaSeleccionada(esencia) {
      const { modelo, seleccionId } = get();
      if (!seleccionId) return;
      const resultado = cambiarEsencia(modelo, seleccionId, esencia);
      if (resultado.ok) commitModelo(set, modelo, resultado.value, { mensaje: null });
    },

    fijarAfiliacionSeleccionada(afiliacion) {
      const { modelo, seleccionId } = get();
      if (!seleccionId) return;
      const resultado = cambiarAfiliacion(modelo, seleccionId, afiliacion);
      if (resultado.ok) commitModelo(set, modelo, resultado.value, { mensaje: null });
    },

    fijarLinealidadSeleccionada(lineal) {
      const { modelo, seleccionId } = get();
      if (!seleccionId) return;
      const resultado = cambiarLinealidad(modelo, seleccionId, lineal);
      if (resultado.ok) commitModelo(set, modelo, resultado.value, { mensaje: null });
    },

    redimensionarSeleccionada(width, height) {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) return;
      const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
        .find((item) => item.entidadId === seleccionId);
      if (!apariencia) {
        set({ mensaje: "La entidad seleccionada no tiene apariencia en el OPD activo" });
        return;
      }
      const resultado = redimensionarApariencia(modelo, opdActivoId, apariencia.id, width, height);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId, seleccionados: [seleccionId], modoSeleccion: "simple", mensaje: null });
    },

    redimensionarAparienciaEnCanvas(aparienciaId, x, y, width, height) {
      const { modelo, opdActivoId } = get();
      const apariencia = modelo.opds[opdActivoId]?.apariencias[aparienciaId];
      const resultado = redimensionarApariencia(modelo, opdActivoId, aparienciaId, width, height, { x, y });
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: apariencia?.entidadId ?? null,
        seleccionados: apariencia?.entidadId ? [apariencia.entidadId] : [],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
    },

    ajustarSeleccionadaAlTexto() {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) return;
      const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
        .find((item) => item.entidadId === seleccionId);
      if (!apariencia) return;
      const resultado = ajustarAlTexto(modelo, opdActivoId, apariencia.id);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId, seleccionados: [seleccionId], modoSeleccion: "simple", mensaje: null });
    },

    volverSeleccionadaAAuto() {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) return;
      const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
        .find((item) => item.entidadId === seleccionId);
      if (!apariencia) return;
      const resultado = volverAAutoTamano(modelo, opdActivoId, apariencia.id);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId, seleccionados: [seleccionId], modoSeleccion: "simple", mensaje: null });
    },

    alternarModoTamanoSeleccionado() {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) return;
      const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
        .find((item) => item.entidadId === seleccionId);
      if (!apariencia) return;
      const resultado = alternarModoTamano(modelo, opdActivoId, apariencia.id);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId, seleccionados: [seleccionId], modoSeleccion: "simple", mensaje: null });
    },

    editarAliasEntidad(entidadId, alias) {
      const { modelo } = get();
      const resultado = editarAlias(modelo, entidadId, alias);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
    },

    editarUnidadEntidad(entidadId, unidad) {
      const { modelo } = get();
      const resultado = editarUnidad(modelo, entidadId, unidad);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
    },

    editarDescripcionEntidad(entidadId, descripcion) {
      const { modelo } = get();
      const resultado = editarDescripcion(modelo, entidadId, descripcion);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
    },

    agregarUrlAEntidad(entidadId, url) {
      const { modelo } = get();
      const resultado = agregarUrl(modelo, entidadId, {
        id: `url-${modelo.nextSeq}`,
        tipo: url.tipo,
        url: url.url,
      });
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, { ...resultado.value, nextSeq: modelo.nextSeq + 1 }, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
    },

    eliminarUrlDeEntidad(entidadId, urlId) {
      const { modelo } = get();
      const resultado = eliminarUrl(modelo, entidadId, urlId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
    },

    reordenarUrlsEntidad(entidadId, urlIds) {
      const { modelo } = get();
      const resultado = reordenarUrls(modelo, entidadId, urlIds);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
    },

    editarImagenEntidad(entidadId, imagen) {
      const { modelo } = get();
      const resultado = editarImagen(modelo, entidadId, imagen);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const modoForzado = resultado.value.entidades[entidadId]?.imagen?.modo === "texto" && imagen.modo !== "texto";
      commitModelo(set, modelo, resultado.value, {
        seleccionId: entidadId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        modalImagenAbierto: null,
        mensaje: modoForzado ? "Imagen guardada en modo texto por estados visibles o URL caída" : null,
      });
    },

    quitarImagenEntidad(entidadId) {
      const { modelo } = get();
      const resultado = quitarImagen(modelo, entidadId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, modalImagenAbierto: null, mensaje: null });
    },

    cambiarModoImagenEntidad(entidadId, modo) {
      const { modelo } = get();
      const resultado = cambiarModoImagen(modelo, entidadId, modo);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const modoForzado = resultado.value.entidades[entidadId]?.imagen?.modo === "texto" && modo !== "texto";
      commitModelo(set, modelo, resultado.value, {
        seleccionId: entidadId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: modoForzado ? "Imagen en modo texto por estados visibles o URL caída" : null,
      });
    },

    alternarModoImagenEntidad(entidadId) {
      const entidad = get().modelo.entidades[entidadId];
      if (!entidad?.imagen) return;
      get().cambiarModoImagenEntidad(entidadId, siguienteModoImagen(entidad.imagen.modo));
    },

    fijarLayoutEstadosEntidad(entidadId, layout: LayoutEstados) {
      const { modelo } = get();
      const entidad = modelo.entidades[entidadId];
      if (!entidad || entidad.tipo !== "objeto") return;
      const siguiente: Modelo = {
        ...modelo,
        entidades: {
          ...modelo.entidades,
          [entidadId]: { ...entidad, layoutEstados: layout },
        },
      };
      commitModelo(set, modelo, siguiente, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
    },

    toggleAliasVisibles() {
      const { uiAliasVisibles, modelo } = get();
      const aliasVisibles = !uiAliasVisibles;
      set({ uiAliasVisibles: aliasVisibles, modelo: { ...modelo } });
    },

    toggleDescripcionesVisibles() {
      const { uiDescripcionesVisibles, modelo } = get();
      const descripcionesVisibles = !uiDescripcionesVisibles;
      set({ uiDescripcionesVisibles: descripcionesVisibles, modelo: { ...modelo } });
    },

    // ── Brecha B3/B4: resolución de colisión de nombre ───────────────────────

    resolverColisionReutilizar() {
      const { colisionPendiente, modelo } = get();
      if (!colisionPendiente || colisionPendiente.contexto !== "creacion") {
        set({ colisionPendiente: null });
        return;
      }
      if (!colisionPendiente.colision.mismoTipo) {
        set({ colisionPendiente: null, mensaje: "No se puede reutilizar una entidad de tipo diferente" });
        return;
      }
      const { entidadProvId, colision, posicion } = colisionPendiente;
      const eliminado = eliminarEntidad(modelo, entidadProvId);
      if (!eliminado.ok) {
        set({ colisionPendiente: null, mensaje: eliminado.error });
        return;
      }
      const modeloBase = eliminado.value;
      const opd = modeloBase.opds[colisionPendiente.opdId];
      if (!opd) {
        set({ colisionPendiente: null, mensaje: "El OPD de origen ya no existe" });
        return;
      }
      const existenteEnOpd = aparienciaDeEntidadEnOpd(opd, colision.entidadExistenteId);
      const siguiente: Modelo = existenteEnOpd
        ? modeloBase
        : {
            ...modeloBase,
            nextSeq: modeloBase.nextSeq + 1,
            opds: {
              ...modeloBase.opds,
              [opd.id]: {
                ...opd,
                apariencias: {
                  ...opd.apariencias,
                  [`a-${modeloBase.nextSeq}`]: {
                    id: `a-${modeloBase.nextSeq}`,
                    entidadId: colision.entidadExistenteId,
                    opdId: opd.id,
                    x: Math.round(posicion.x),
                    y: Math.round(posicion.y),
                    width: CANON.dims.cosaWidth,
                    height: CANON.dims.cosaHeight,
                  },
                },
              },
            },
          };
      const commiteado = commitModelo(set, modelo, siguiente, {
        opdActivoId: opd.id,
        seleccionId: colision.entidadExistenteId,
        seleccionados: [colision.entidadExistenteId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        nuevaCosaPendiente: null,
        colisionPendiente: null,
        mensaje: existenteEnOpd ? "La cosa existente ya aparece en este OPD" : null,
      });
      if (commiteado && !existenteEnOpd) addFlash("✓ Apariencia creada");
    },

    resolverColisionRenombrar(nuevoNombre) {
      const { colisionPendiente, modelo } = get();
      if (!colisionPendiente) return;

      if (colisionPendiente.contexto === "creacion") {
        const { entidadProvId } = colisionPendiente;
        set({ colisionPendiente: null });
        // Aplicar el nuevo nombre a la entidad provisional ya existente.
        const resultado = renombrarEntidad(modelo, entidadProvId, nuevoNombre);
        if (!resultado.ok) {
          set({ mensaje: resultado.error });
          return;
        }
        const commiteado = commitModelo(set, modelo, resultado.value, {
          seleccionId: entidadProvId,
          seleccionados: [entidadProvId],
          modoSeleccion: "simple",
          enlaceSeleccionId: null,
          modoEnlace: null,
          mensaje: null,
          nuevaCosaPendiente: null,
          colisionPendiente: null,
        });
        if (commiteado) addFlash(`✓ ${colisionPendiente.tipo === "objeto" ? "Objeto" : "Proceso"} creado`);
        return;
      }

      if (colisionPendiente.contexto === "rename") {
        const { entidadId } = colisionPendiente;
        set({ colisionPendiente: null });
        const resultado = renombrarEntidad(modelo, entidadId, nuevoNombre);
        if (!resultado.ok) {
          set({ mensaje: resultado.error });
          return;
        }
        commitModelo(set, modelo, resultado.value, { mensaje: null });
      }
    },

    resolverColisionCancelar() {
      const { colisionPendiente, modelo } = get();
      if (!colisionPendiente) return;
      if (colisionPendiente.contexto === "creacion") {
        // Eliminar la entidad provisional (fue creada pero el operador cancela).
        const eliminado = eliminarEntidad(modelo, colisionPendiente.entidadProvId);
        if (eliminado.ok) {
          commitModelo(set, modelo, eliminado.value, {
            seleccionId: null,
            seleccionados: [],
            modoSeleccion: "simple",
            enlaceSeleccionId: null,
            colisionPendiente: null,
            mensaje: null,
          });
          return;
        }
      }
      set({ colisionPendiente: null });
    },

    irAUbicacionColision(opdId) {
      set({ colisionPendiente: null });
      get().cambiarOpdActivo(opdId);
    },
  };
}

function siguienteModoImagen(modo: ModoImagenEntidad): ModoImagenEntidad {
  if (modo === "imagen-texto") return "imagen";
  if (modo === "imagen") return "texto";
  return "imagen-texto";
}
