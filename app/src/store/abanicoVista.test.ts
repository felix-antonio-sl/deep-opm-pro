import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { crearAutor } from "../autoria";
import { formarAbanico } from "../modelo/abanicos";
import { eliminarOpdHoja } from "../modelo/opdEliminacion";
import {
  compartirAnclaExtremosEnlaces,
  crearEnlace,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
} from "../modelo/operaciones";
import { sincronizarRepresentacionRefinamiento } from "../modelo/operaciones/refinamiento";
import { exportarModelo } from "../serializacion/json";
import type { Id, Modelo, Resultado } from "../modelo/tipos";
import { store } from "../store";
import { commitModelo, fijarRuntimeEffects, resetRuntimeEffects } from "./runtime";
import { RUNTIME_EFFECTS_DEFAULT } from "./runtimeEffects";

describe("custodia de abanicos desde vistas", () => {
  beforeEach(() => {
    fijarRuntimeEffects({
      ...RUNTIME_EFFECTS_DEFAULT,
      confirm: () => true,
    });
    store.setState({ readOnly: false, contextoSimulacion: null });
  });

  afterEach(() => {
    resetRuntimeEffects();
  });

  test("rechaza todas las mutaciones del abanico heredado sin cambiar el modelo", () => {
    const fixture = modeloConAbanicoYVista();
    importar(fixture.modelo);
    store.getState().cambiarOpdActivo(fixture.vistaId);
    store.getState().seleccionarEnlace(fixture.enlaceIds[0]!);
    const antes = exportarModelo(store.getState().modelo);

    const mutaciones = [
      () => store.getState().alternarOperadorAbanicoSeleccionado("O"),
      () => store.getState().definirProbabilidadesAbanicoSeleccionado(undefined),
      () => store.getState().quitarRamaDeAbanicoSeleccionado(),
      () => store.getState().disolverAbanicoSeleccionado(),
    ];
    for (const mutar of mutaciones) {
      mutar();
      expect(exportarModelo(store.getState().modelo)).toBe(antes);
      expect(store.getState().mensaje).toContain("Decisión propietaria");
    }
  });

  test("permite editar el mismo abanico desde su OPD propietario", () => {
    const fixture = modeloConAbanicoYVista();
    importar(fixture.modelo);
    store.getState().cambiarOpdActivo(fixture.propietarioId);
    store.getState().seleccionarEnlace(fixture.enlaceIds[0]!);

    store.getState().alternarOperadorAbanicoSeleccionado("O");

    expect(store.getState().modelo.abanicos?.[fixture.abanicoId]?.operador).toBe("O");
    expect(store.getState().mensaje).toBe("Operador actualizado a O");
  });

  test("deshacer y rehacer conservan la custodia del OPD propietario", () => {
    const fixture = modeloConAbanicoYVista();
    importar(fixture.modelo);
    store.getState().cambiarOpdActivo(fixture.propietarioId);
    store.getState().seleccionarEnlace(fixture.enlaceIds[0]!);
    store.getState().alternarOperadorAbanicoSeleccionado("O");
    store.getState().cambiarOpdActivo(fixture.vistaId);
    const antesDeDeshacer = exportarModelo(store.getState().modelo);

    store.getState().deshacer();

    expect(exportarModelo(store.getState().modelo)).toBe(antesDeDeshacer);
    expect(store.getState().mensaje).toContain("Decisión propietaria");
    store.getState().cambiarOpdActivo(fixture.propietarioId);
    store.getState().deshacer();
    expect(store.getState().modelo.abanicos?.[fixture.abanicoId]?.operador).toBe("XOR");

    store.getState().cambiarOpdActivo(fixture.vistaId);
    const antesDeRehacer = exportarModelo(store.getState().modelo);
    store.getState().rehacer();
    expect(exportarModelo(store.getState().modelo)).toBe(antesDeRehacer);
    expect(store.getState().mensaje).toContain("Decisión propietaria");
    store.getState().cambiarOpdActivo(fixture.propietarioId);
    store.getState().rehacer();
    expect(store.getState().modelo.abanicos?.[fixture.abanicoId]?.operador).toBe("O");
  });

  test("bloquea mutaciones indirectas de una rama heredada", () => {
    const fixture = modeloConAbanicoYVista();
    importar(fixture.modelo);
    store.getState().cambiarOpdActivo(fixture.vistaId);
    store.getState().seleccionarEnlace(fixture.enlaceIds[0]!);
    const antes = exportarModelo(store.getState().modelo);
    const extremo = store.getState().modelo.enlaces[fixture.enlaceIds[0]!]!.origenId;
    if (extremo.kind !== "entidad") throw new Error("La prueba esperaba extremo de entidad");

    const mutaciones = [
      () => store.getState().apuntarExtremoEnlaceSeleccionado("origen", { ...extremo, portId: "port-ajeno" }),
      () => store.getState().moverPuertoEnlaceSeleccionado("destino", store.getState().modelo.enlaces[fixture.enlaceIds[0]!]!.destinoId, true),
      () => store.getState().eliminarSeleccion(),
      () => store.getState().borrarEnlacesEnLote([fixture.enlaceIds[0]!]),
      () => store.getState().eliminarEnlaceDesdeTabla(fixture.enlaceIds[0]!),
    ];

    for (const mutar of mutaciones) {
      mutar();
      expect(exportarModelo(store.getState().modelo)).toBe(antes);
      expect(store.getState().mensaje).toContain("Decisión propietaria");
    }
  });

  test("bloquea una probabilidad aplicada a la rama por fuera del editor del abanico", () => {
    const fixture = modeloConAbanicoYVista({ evento: true });
    const enlaceId = fixture.enlaceIds[0]!;
    importar(fixture.modelo);
    store.getState().cambiarOpdActivo(fixture.vistaId);
    store.getState().seleccionarEnlace(enlaceId);
    expect(store.getState().modelo.enlaces[enlaceId]?.modificador).toBe("evento");
    const antes = exportarModelo(store.getState().modelo);

    store.getState().definirProbabilidadEventoSeleccionada(0.5);

    expect(exportarModelo(store.getState().modelo)).toBe(antes);
    expect(store.getState().mensaje).toContain("Decisión propietaria");
  });

  test("bloquea cambiar o quitar el modificador de una rama heredada", () => {
    const fixture = modeloConAbanicoYVista({ evento: true });
    const enlaceId = fixture.enlaceIds[0]!;
    importar(fixture.modelo);
    store.getState().cambiarOpdActivo(fixture.vistaId);
    store.getState().seleccionarEnlace(enlaceId);
    const antes = exportarModelo(store.getState().modelo);

    store.getState().quitarModificadorEnlaceSeleccionado();
    expect(exportarModelo(store.getState().modelo)).toBe(antes);
    expect(store.getState().mensaje).toContain("Decisión propietaria");

    store.getState().aplicarModificadorEnlaceSeleccionado("condicion");
    expect(exportarModelo(store.getState().modelo)).toBe(antes);
    expect(store.getState().mensaje).toContain("Decisión propietaria");
  });

  test("permite editar una etiqueta global sin alterar el abanico compartido", () => {
    const fixture = modeloConAbanicoYVista();
    const enlaceId = fixture.enlaceIds[0]!;
    importar(fixture.modelo);
    store.getState().cambiarOpdActivo(fixture.vistaId);
    store.getState().seleccionarEnlace(enlaceId);
    const abanicoAntes = JSON.stringify(store.getState().modelo.abanicos?.[fixture.abanicoId]);

    store.getState().renombrarEtiquetaEnlaceSeleccionado("ruta compartida");

    expect(store.getState().modelo.enlaces[enlaceId]?.etiqueta).toBe("ruta compartida");
    expect(JSON.stringify(store.getState().modelo.abanicos?.[fixture.abanicoId])).toBe(abanicoAntes);
    expect(store.getState().modelo.opds[fixture.propietarioId]?.enlaces).toEqual(fixture.modelo.opds[fixture.propietarioId]?.enlaces);
  });

  test("deshacer restaura un OPD propietario eliminado y rehacer exige volver a su contexto", () => {
    const fixture = modeloConAbanicoYVista();
    importar(fixture.modelo);
    store.getState().cambiarOpdActivo(fixture.propietarioId);

    store.getState().eliminarOpdDesdeArbol(fixture.propietarioId);
    expect(store.getState().modelo.opds[fixture.propietarioId]).toBeUndefined();
    expect(store.getState().modelo.abanicos?.[fixture.abanicoId]).toBeUndefined();

    store.getState().deshacer();
    expect(store.getState().modelo.opds[fixture.propietarioId]).toBeDefined();
    expect(store.getState().modelo.abanicos?.[fixture.abanicoId]).toBeDefined();

    const antesDeRehacer = exportarModelo(store.getState().modelo);
    store.getState().rehacer();
    expect(exportarModelo(store.getState().modelo)).toBe(antesDeRehacer);
    expect(store.getState().mensaje).toContain("Decisión propietaria");

    store.getState().cambiarOpdActivo(fixture.propietarioId);
    store.getState().rehacer();
    expect(store.getState().modelo.opds[fixture.propietarioId]).toBeUndefined();
    expect(store.getState().modelo.abanicos?.[fixture.abanicoId]).toBeUndefined();
  });

  test("permite introducir conjuntamente un OPD nuevo y su abanico", () => {
    const fixture = modeloConAbanicoYVista();
    const sinPropietario = must(eliminarOpdHoja(fixture.modelo, fixture.propietarioId)).modelo;
    importar(sinPropietario);

    const aplicado = commitModelo(
      (partial) => store.setState(partial),
      store.getState().modelo,
      fixture.modelo,
      { mensaje: "Refinamiento creado" },
    );

    expect(aplicado).toBe(true);
    expect(store.getState().modelo.opds[fixture.propietarioId]).toBeDefined();
    expect(store.getState().modelo.abanicos?.[fixture.abanicoId]).toBeDefined();
  });

  test("rechaza introducir un abanico en un OPD existente no activo", () => {
    const fixture = modeloConAbanicoYVista();
    const sinAbanico: Modelo = { ...fixture.modelo, abanicos: {} };
    importar(sinAbanico);
    store.getState().cambiarOpdActivo(fixture.vistaId);
    const antes = exportarModelo(store.getState().modelo);

    const aplicado = commitModelo(
      (partial) => store.setState(partial),
      store.getState().modelo,
      fixture.modelo,
    );

    expect(aplicado).toBe(false);
    expect(exportarModelo(store.getState().modelo)).toBe(antes);
    expect(store.getState().mensaje).toContain("Decisión propietaria");
  });

  test("permite proyectar automáticamente un abanico del padre en un hijo existente", () => {
    const fixture = modeloConProyeccionDerivadaPendiente();
    importar(fixture.previo);
    const abanicosAntes = Object.keys(store.getState().modelo.abanicos ?? {});

    const aplicado = commitModelo(
      (partial) => store.setState(partial),
      store.getState().modelo,
      fixture.siguiente,
    );

    expect(aplicado).toBe(true);
    expect(Object.keys(store.getState().modelo.abanicos ?? {})).toHaveLength(abanicosAntes.length + 1);
    const abanicoHijo = Object.values(store.getState().modelo.abanicos ?? {})
      .find((abanico) => abanico.opdId === fixture.hijoId);
    if (!abanicoHijo) throw new Error("La prueba esperaba el abanico derivado");
    const abanicoPadre = Object.values(store.getState().modelo.abanicos ?? {})
      .find((abanico) => abanico.opdId === store.getState().modelo.opdRaizId);
    if (!abanicoPadre) throw new Error("La prueba esperaba el abanico fuente");
    const enlacesPadreIds = abanicoHijo.enlaceIds.map((enlaceId) => (
      store.getState().modelo.enlaces[enlaceId]?.derivado?.enlacePadreId
    ));
    expect(new Set(enlacesPadreIds)).toEqual(new Set(abanicoPadre.enlaceIds));
    expect(enlacesPadreIds).toHaveLength(abanicoPadre.enlaceIds.length);
    expect(abanicoHijo.operador).toBe(abanicoPadre.operador);
    expect(abanicoHijo.decision).toBeUndefined();

    store.getState().deshacer();
    expect(Object.values(store.getState().modelo.abanicos ?? {}).some((abanico) => abanico.opdId === fixture.hijoId)).toBe(false);
    store.getState().rehacer();
    expect(Object.values(store.getState().modelo.abanicos ?? {}).some((abanico) => abanico.opdId === fixture.hijoId)).toBe(true);
  });

  test("rechaza procedencia fabricada sin consumir el historial", () => {
    const casos = [
      "rama manual",
      "decisión hija",
      "padre duplicado",
      "operador distinto",
      "refinamiento mezclado",
      "tipo de rama distinto",
      "refinamiento no vinculado",
      "modificador hijo",
      "estado hijo",
      "extremo no canónico",
      "puerto no canónico",
      "etiqueta divergente",
    ] as const;

    for (const caso of casos) {
      const fixture = modeloConProyeccionDerivadaPendiente();
      importar(fixture.previo);
      const abanicoPadre = Object.values(fixture.previo.abanicos ?? {})
        .find((abanico) => abanico.opdId === fixture.previo.opdRaizId);
      if (!abanicoPadre) throw new Error("La prueba esperaba el abanico fuente");
      const enlacePadreId = abanicoPadre.enlaceIds[0]!;
      store.getState().seleccionarEnlace(enlacePadreId);
      store.getState().renombrarEtiquetaEnlaceSeleccionado("cambio previo legítimo");
      const antesBloqueo = exportarModelo(store.getState().modelo);

      const fabricado = structuredClone(fixture.siguiente);
      const abanicoHijo = Object.values(fabricado.abanicos ?? {})
        .find((abanico) => abanico.opdId === fixture.hijoId);
      if (!abanicoHijo) throw new Error("La prueba esperaba el abanico derivado");
      const ramas = abanicoHijo.enlaceIds.map((id) => fabricado.enlaces[id]!);
      const primeraDerivacion = ramas[0]?.derivado;
      const segundaDerivacion = ramas[1]?.derivado;
      if (!primeraDerivacion || !segundaDerivacion) throw new Error("La prueba esperaba dos ramas derivadas");

      if (caso === "rama manual") {
        ramas[0]!.derivado = { ...primeraDerivacion, origen: "manual" };
      } else if (caso === "decisión hija") {
        abanicoHijo.decision = { modo: "funcion", funcionId: "decision-inventada" };
      } else if (caso === "padre duplicado") {
        ramas[1]!.derivado = { ...segundaDerivacion, enlacePadreId: primeraDerivacion.enlacePadreId };
      } else if (caso === "operador distinto") {
        abanicoHijo.operador = abanicoPadre.operador === "O" ? "XOR" : "O";
      } else if (caso === "refinamiento mezclado") {
        const otroId = Object.keys(fabricado.entidades).find((id) => id !== primeraDerivacion.refinamientoId)!;
        ramas[1]!.derivado = { ...segundaDerivacion, refinamientoId: otroId };
      } else if (caso === "tipo de rama distinto") {
        for (const rama of ramas) rama.tipo = rama.tipo === "resultado" ? "consumo" : "resultado";
      } else if (caso === "refinamiento no vinculado") {
        const refinada = fabricado.entidades[primeraDerivacion.refinamientoId]!;
        fabricado.entidades[refinada.id] = { ...refinada, refinamientos: {} };
      } else if (caso === "modificador hijo") {
        ramas[0]!.modificador = "evento";
        ramas[0]!.subtipoModificador = "E";
      } else if (caso === "estado hijo") {
        ramas[0]!.estadoEntradaId = "estado-inventado";
      } else if (caso === "extremo no canónico") {
        const opdHijo = fabricado.opds[fixture.hijoId]!;
        const aparienciaRefinada = Object.values(opdHijo.apariencias)
          .find((apariencia) => apariencia.entidadId === primeraDerivacion.refinamientoId);
        if (!aparienciaRefinada) throw new Error("La prueba esperaba el contorno refinado");
        opdHijo.apariencias[aparienciaRefinada.id] = {
          ...aparienciaRefinada,
          ports: {
            ...(aparienciaRefinada.ports ?? {}),
            [abanicoHijo.puertoComun.portId]: { x: 1, y: 0.5 },
          },
        };
        abanicoHijo.puertoComun = {
          ...abanicoHijo.puertoComun,
          entidadId: primeraDerivacion.refinamientoId,
        };
        abanicoHijo.puertoEntidadId = primeraDerivacion.refinamientoId;
        for (const rama of ramas) {
          const extremo = { kind: "entidad" as const, id: primeraDerivacion.refinamientoId, portId: abanicoHijo.puertoComun.portId };
          if (abanicoHijo.puertoComun.lado === "origen") rama.origenId = extremo;
          else rama.destinoId = extremo;
        }
      } else if (caso === "puerto no canónico") {
        const opdHijo = fabricado.opds[fixture.hijoId]!;
        const aparienciaComun = Object.values(opdHijo.apariencias)
          .find((apariencia) => apariencia.entidadId === abanicoHijo.puertoComun.entidadId);
        if (!aparienciaComun) throw new Error("La prueba esperaba la apariencia del puerto común");
        opdHijo.apariencias[aparienciaComun.id] = {
          ...aparienciaComun,
          ports: {
            ...(aparienciaComun.ports ?? {}),
            "port-fabricado": { x: 1, y: 0.5 },
          },
        };
        abanicoHijo.puertoComun = { ...abanicoHijo.puertoComun, portId: "port-fabricado" };
        for (const rama of ramas) {
          const campo = abanicoHijo.puertoComun.lado === "origen" ? "origenId" : "destinoId";
          rama[campo] = { ...rama[campo], portId: "port-fabricado" };
        }
      } else {
        ramas[0]!.etiqueta = "etiqueta inventada";
      }

      const aplicado = commitModelo(
        (partial) => store.setState(partial),
        store.getState().modelo,
        fabricado,
      );

      if (aplicado) throw new Error(`La guarda aceptó procedencia fabricada: ${caso}`);
      expect(exportarModelo(store.getState().modelo)).toBe(antesBloqueo);
      store.getState().deshacer();
      expect(store.getState().modelo.enlaces[enlacePadreId]?.etiqueta).toBe("");
    }
  });

  test("solo retira la proyección desde el padre cuando desaparece su fuente", () => {
    const fixture = modeloConProyeccionDerivadaPendiente();
    importar(fixture.siguiente);
    const abanicoPadre = Object.values(fixture.siguiente.abanicos ?? {})
      .find((abanico) => abanico.opdId === fixture.siguiente.opdRaizId);
    const abanicoHijo = Object.values(fixture.siguiente.abanicos ?? {})
      .find((abanico) => abanico.opdId === fixture.hijoId);
    if (!abanicoPadre || !abanicoHijo) throw new Error("La prueba esperaba fuente y proyección");

    const sinFuente = structuredClone(fixture.siguiente);
    delete sinFuente.abanicos?.[abanicoPadre.id];
    delete sinFuente.abanicos?.[abanicoHijo.id];
    const aplicado = commitModelo(
      (partial) => store.setState(partial),
      store.getState().modelo,
      sinFuente,
    );

    expect(aplicado).toBe(true);
    expect(store.getState().modelo.abanicos?.[abanicoPadre.id]).toBeUndefined();
    expect(store.getState().modelo.abanicos?.[abanicoHijo.id]).toBeUndefined();
    store.getState().deshacer();
    expect(store.getState().modelo.abanicos?.[abanicoPadre.id]).toBeDefined();
    expect(store.getState().modelo.abanicos?.[abanicoHijo.id]).toBeDefined();
    store.getState().rehacer();
    expect(store.getState().modelo.abanicos?.[abanicoHijo.id]).toBeUndefined();
  });

  test("bloquea retirar la proyección o mezclar el retiro con juicio local", () => {
    for (const caso of ["solo retiro", "manualización", "probabilidad"] as const) {
      const fixture = modeloConProyeccionDerivadaPendiente();
      importar(fixture.siguiente);
      const abanicoPadre = Object.values(fixture.siguiente.abanicos ?? {})
        .find((abanico) => abanico.opdId === fixture.siguiente.opdRaizId);
      const abanicoHijo = Object.values(fixture.siguiente.abanicos ?? {})
        .find((abanico) => abanico.opdId === fixture.hijoId);
      if (!abanicoPadre || !abanicoHijo) throw new Error("La prueba esperaba fuente y proyección");
      const enlacePadreId = abanicoPadre.enlaceIds[0]!;
      store.getState().seleccionarEnlace(enlacePadreId);
      store.getState().renombrarEtiquetaEnlaceSeleccionado("cambio previo legítimo");
      const antesBloqueo = exportarModelo(store.getState().modelo);

      const fabricado = structuredClone(store.getState().modelo);
      delete fabricado.abanicos?.[abanicoHijo.id];
      const ramaId = abanicoHijo.enlaceIds[0]!;
      const rama = fabricado.enlaces[ramaId]!;
      if (caso === "manualización" && rama.derivado) {
        rama.derivado = { ...rama.derivado, origen: "manual" };
      } else if (caso === "probabilidad") {
        rama.probabilidad = 0.5;
      }

      const aplicado = commitModelo(
        (partial) => store.setState(partial),
        store.getState().modelo,
        fabricado,
      );

      expect(aplicado).toBe(false);
      expect(exportarModelo(store.getState().modelo)).toBe(antesBloqueo);
      store.getState().deshacer();
      expect(store.getState().modelo.enlaces[enlacePadreId]?.etiqueta).toBe("");
    }
  });

  test("una proyección válida no encubre cambios a otro abanico", () => {
    const fixture = modeloConProyeccionDerivadaPendiente({ abanicoLocal: true });
    if (!fixture.abanicoLocalId) throw new Error("La prueba esperaba el abanico local");
    importar(fixture.previo);
    const antes = exportarModelo(store.getState().modelo);
    const mixto = structuredClone(fixture.siguiente);
    const abanicoLocal = mixto.abanicos?.[fixture.abanicoLocalId];
    if (!abanicoLocal) throw new Error("La prueba esperaba conservar el abanico local");
    abanicoLocal.operador = abanicoLocal.operador === "O" ? "XOR" : "O";

    const aplicado = commitModelo(
      (partial) => store.setState(partial),
      store.getState().modelo,
      mixto,
    );

    expect(aplicado).toBe(false);
    expect(exportarModelo(store.getState().modelo)).toBe(antes);
  });

  test("cambiar la fuente exige actualizar, no retirar, su proyección", () => {
    const fixture = modeloConProyeccionDerivadaPendiente();
    const abanicoPadre = Object.values(fixture.siguiente.abanicos ?? {})
      .find((abanico) => abanico.opdId === fixture.siguiente.opdRaizId);
    const abanicoHijo = Object.values(fixture.siguiente.abanicos ?? {})
      .find((abanico) => abanico.opdId === fixture.hijoId);
    if (!abanicoPadre || !abanicoHijo) throw new Error("La prueba esperaba fuente y proyección");

    importar(fixture.siguiente);
    const sinProyeccion = structuredClone(fixture.siguiente);
    sinProyeccion.abanicos![abanicoPadre.id]!.operador = "O";
    delete sinProyeccion.abanicos?.[abanicoHijo.id];
    const antes = exportarModelo(store.getState().modelo);
    expect(commitModelo(
      (partial) => store.setState(partial),
      store.getState().modelo,
      sinProyeccion,
    )).toBe(false);
    expect(exportarModelo(store.getState().modelo)).toBe(antes);

    const actualizado = structuredClone(fixture.siguiente);
    actualizado.abanicos![abanicoPadre.id]!.operador = "O";
    actualizado.abanicos![abanicoHijo.id]!.operador = "O";
    expect(commitModelo(
      (partial) => store.setState(partial),
      store.getState().modelo,
      actualizado,
    )).toBe(true);
    expect(store.getState().modelo.abanicos?.[abanicoHijo.id]?.operador).toBe("O");
  });

  test("permite reemplazar una proyección por su sucesora canónica", () => {
    const fixture = modeloConProyeccionDerivadaPendiente();
    const abanicoPadre = Object.values(fixture.siguiente.abanicos ?? {})
      .find((abanico) => abanico.opdId === fixture.siguiente.opdRaizId);
    const abanicoHijo = Object.values(fixture.siguiente.abanicos ?? {})
      .find((abanico) => abanico.opdId === fixture.hijoId);
    if (!abanicoPadre || !abanicoHijo) throw new Error("La prueba esperaba fuente y proyección");
    importar(fixture.siguiente);

    const fuenteEditada = structuredClone(fixture.siguiente);
    fuenteEditada.enlaces[abanicoPadre.enlaceIds[0]!]!.etiqueta = "resultado actualizado";
    const resincronizado = must(sincronizarRepresentacionRefinamiento(fuenteEditada, fixture.hijoId));
    const sucesor = Object.values(resincronizado.abanicos ?? {})
      .find((abanico) => abanico.opdId === fixture.hijoId);
    if (!sucesor) throw new Error("La prueba esperaba la proyección sucesora");
    expect(sucesor.id).not.toBe(abanicoHijo.id);

    expect(commitModelo(
      (partial) => store.setState(partial),
      store.getState().modelo,
      resincronizado,
    )).toBe(true);
    expect(store.getState().modelo.abanicos?.[abanicoHijo.id]).toBeUndefined();
    expect(store.getState().modelo.abanicos?.[sucesor.id]).toBeDefined();
    store.getState().deshacer();
    expect(store.getState().modelo.abanicos?.[abanicoHijo.id]).toBeDefined();
    store.getState().rehacer();
    expect(store.getState().modelo.abanicos?.[sucesor.id]).toBeDefined();
  });

  test("rechaza un sucesor que conserva ramas automáticas antiguas visibles", () => {
    const fixture = modeloConProyeccionDerivadaPendiente();
    const abanicoPadre = Object.values(fixture.siguiente.abanicos ?? {})
      .find((abanico) => abanico.opdId === fixture.siguiente.opdRaizId);
    const abanicoHijo = Object.values(fixture.siguiente.abanicos ?? {})
      .find((abanico) => abanico.opdId === fixture.hijoId);
    if (!abanicoPadre || !abanicoHijo) throw new Error("La prueba esperaba fuente y proyección");
    importar(fixture.siguiente);
    const antes = exportarModelo(store.getState().modelo);

    const fuenteEditada = structuredClone(fixture.siguiente);
    fuenteEditada.enlaces[abanicoPadre.enlaceIds[0]!]!.etiqueta = "resultado actualizado";
    const residuo = must(sincronizarRepresentacionRefinamiento(fuenteEditada, fixture.hijoId));
    for (const enlaceId of abanicoHijo.enlaceIds) {
      residuo.enlaces[enlaceId] = structuredClone(fixture.siguiente.enlaces[enlaceId]!);
    }
    const aparienciasAntiguas = Object.entries(fixture.siguiente.opds[fixture.hijoId]!.enlaces)
      .filter(([, apariencia]) => abanicoHijo.enlaceIds.includes(apariencia.enlaceId));
    Object.assign(residuo.opds[fixture.hijoId]!.enlaces, Object.fromEntries(aparienciasAntiguas));

    expect(commitModelo(
      (partial) => store.setState(partial),
      store.getState().modelo,
      residuo,
    )).toBe(false);
    expect(exportarModelo(store.getState().modelo)).toBe(antes);
  });

  test("quitar el refinamiento retira y restaura su proyección con el historial", () => {
    const fixture = modeloConProyeccionDerivadaPendiente();
    const refinada = Object.values(fixture.siguiente.entidades).find((entidad) => (
      entidad.refinamientos?.descomposicion?.opdId === fixture.hijoId
    ));
    const abanicoHijo = Object.values(fixture.siguiente.abanicos ?? {})
      .find((abanico) => abanico.opdId === fixture.hijoId);
    if (!refinada || !abanicoHijo) throw new Error("La prueba esperaba refinamiento y proyección");
    importar(fixture.siguiente);
    store.getState().seleccionarEntidad(refinada.id);

    store.getState().quitarDescomposicionSeleccionada();
    expect(store.getState().modelo.opds[fixture.hijoId]).toBeUndefined();
    expect(store.getState().modelo.abanicos?.[abanicoHijo.id]).toBeUndefined();

    store.getState().deshacer();
    expect(store.getState().modelo.opds[fixture.hijoId]).toBeDefined();
    expect(store.getState().modelo.abanicos?.[abanicoHijo.id]).toBeDefined();
    store.getState().rehacer();
    expect(store.getState().modelo.opds[fixture.hijoId]).toBeUndefined();
  });
});

function modeloConAbanicoYVista(opciones: { evento?: boolean } = {}): {
  modelo: Modelo;
  abanicoId: Id;
  propietarioId: Id;
  vistaId: Id;
  enlaceIds: Id[];
} {
  const autor = crearAutor({ id: "store-fan-vista", nombre: "Store fan en vista" });
  autor.opd("sd0", "SD0", null);
  autor.opd("propietario", "Decisión propietaria", "sd0");
  autor.opd("vista", "Escenario", "sd0");
  autor.vistaGenerica("vista");
  autor.entidad("p", "proceso", "Decidir", "fisica", "sistemica");
  autor.entidad("a", "objeto", "Resultado A", "informacional", "sistemica");
  autor.entidad("b", "objeto", "Resultado B", "informacional", "sistemica");
  for (const opd of ["propietario", "vista"] as const) {
    autor.ver(opd, "p", 200, 200);
    autor.ver(opd, "a", 100, 0);
    autor.ver(opd, "b", 300, 0);
  }
  const enlaceA = opciones.evento
    ? autor.enlazar("propietario", "a", "p", "consumo", { modificador: "evento" })
    : autor.enlazar("propietario", "p", "a", "resultado");
  const enlaceB = opciones.evento
    ? autor.enlazar("propietario", "b", "p", "consumo", { modificador: "evento" })
    : autor.enlazar("propietario", "p", "b", "resultado");
  if (!enlaceA || !enlaceB) throw new Error("La prueba esperaba dos enlaces");
  const enlaceIds = [enlaceA, enlaceB];
  const abanicoId = autor.abanico("propietario", enlaceIds, "XOR");
  autor.aparecerEnlacePorId("vista", enlaceA);
  autor.aparecerEnlacePorId("vista", enlaceB);
  return {
    modelo: autor.modelo,
    abanicoId,
    propietarioId: autor.idOpd("propietario"),
    vistaId: autor.idOpd("vista"),
    enlaceIds,
  };
}

function importar(modelo: Modelo): void {
  store.getState().importarJson(exportarModelo(modelo));
}

function modeloConProyeccionDerivadaPendiente(
  opciones: { abanicoLocal?: boolean } = {},
): { previo: Modelo; siguiente: Modelo; hijoId: Id; abanicoLocalId?: Id } {
  let modelo = crearModelo("Fan derivado posterior");
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 240, y: 180 }, "Procesar"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Resultado A"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 560, y: 80 }, "Resultado B"));
  const proceso = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Procesar");
  const resultadoA = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Resultado A");
  const resultadoB = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Resultado B");
  if (!proceso || !resultadoA || !resultadoB) throw new Error("La prueba esperaba sus tres entidades");

  const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, proceso.id));
  modelo = descompuesto.modelo;
  let abanicoLocalId: Id | undefined;
  if (opciones.abanicoLocal) {
    modelo = must(crearProceso(modelo, descompuesto.opdId, { x: 300, y: 260 }, "Resolver local"));
    modelo = must(crearObjeto(modelo, descompuesto.opdId, { x: 120, y: 420 }, "Local A"));
    modelo = must(crearObjeto(modelo, descompuesto.opdId, { x: 480, y: 420 }, "Local B"));
    const procesoLocal = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Resolver local");
    const localA = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Local A");
    const localB = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Local B");
    if (!procesoLocal || !localA || !localB) throw new Error("La prueba esperaba las entidades locales");
    modelo = must(crearEnlace(modelo, descompuesto.opdId, procesoLocal.id, localA.id, "resultado"));
    modelo = must(crearEnlace(modelo, descompuesto.opdId, procesoLocal.id, localB.id, "resultado"));
    const enlacesLocales = Object.values(modelo.opds[descompuesto.opdId]?.enlaces ?? {})
      .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
      .filter((enlace) => enlace?.origenId.kind === "entidad" && enlace.origenId.id === procesoLocal.id)
      .map((enlace) => enlace!.id);
    modelo = must(compartirAnclaExtremosEnlaces(modelo, descompuesto.opdId, enlacesLocales, "origen", "E"));
    modelo = must(formarAbanico(modelo, descompuesto.opdId, enlacesLocales, "XOR"));
    abanicoLocalId = Object.values(modelo.abanicos ?? {})
      .find((abanico) => abanico.opdId === descompuesto.opdId)?.id;
  }
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, proceso.id, resultadoA.id, "resultado"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, proceso.id, resultadoB.id, "resultado"));
  const enlacesPadre = Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((enlace) => enlace?.tipo === "resultado")
    .map((enlace) => enlace!.id);
  modelo = must(compartirAnclaExtremosEnlaces(modelo, modelo.opdRaizId, enlacesPadre, "origen", "E"));
  modelo = must(formarAbanico(modelo, modelo.opdRaizId, enlacesPadre, "XOR"));
  const previo = modelo;
  const siguiente = must(sincronizarRepresentacionRefinamiento(previo, descompuesto.opdId));
  return { previo, siguiente, hijoId: descompuesto.opdId, ...(abanicoLocalId ? { abanicoLocalId } : {}) };
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
