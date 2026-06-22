import { describe, expect, test } from "bun:test";
import {
  capturarPlantilla,
  crearEstereotipoDesdeSeleccion,
  injertarEstereotipo,
} from "./injertoEstereotipo";
import { crearModelo, crearObjeto, crearProceso } from "../operaciones";
import { agregarEstado } from "./estados";
import { crearEnlace } from "./enlaces";
import { extremoEntidad } from "../extremos";
import { estereotipoDe } from "../estereotipos";
import { descomponerProceso } from "./refinamiento";
import { exportarModelo, hidratarModelo } from "../../serializacion/json";
import type { Estereotipo, Id, Modelo, PlantillaEstereotipo, Resultado } from "../tipos";

/**
 * TDD D6.2 — motor de clonado-e-injerto de subgrafo de estereotipo.
 *
 * Espeja la materialización de submodelos (`materializarSnapshotSubmodelo`):
 * clona un subgrafo con remapeo total de ids creando cosas FRESCAS. A diferencia
 * de `pegarSeleccion` (apariciones de las mismas entidades), el injerto CLONA
 * identidad. El ancla recibe el `estereotipoId` (D6.3 renderiza `<<Nombre>>`).
 */

function debeOk<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Esperaba ok, recibí: ${resultado.error}`);
  return resultado.value;
}

function debeFallar<T>(resultado: Resultado<T>): string {
  if (resultado.ok) throw new Error("Esperaba fallo, recibí ok");
  return resultado.error;
}

/** Estereotipo con plantilla de 2 cosas (objeto ancla + proceso) + 1 enlace. */
function plantillaDosCosasUnEnlace(): PlantillaEstereotipo {
  return {
    entidades: {
      "o-1": { id: "o-1", tipo: "objeto", nombre: "Documento", esencia: "informacional", afiliacion: "sistemica" },
      "p-1": { id: "p-1", tipo: "proceso", nombre: "Tramitar", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {
      "e-1": {
        id: "e-1",
        tipo: "consumo",
        origenId: { kind: "entidad", id: "o-1" },
        destinoId: { kind: "entidad", id: "p-1" },
        etiqueta: "",
      },
    },
    apariencias: {
      "o-1": { x: 0, y: 0, width: 120, height: 60 },
      "p-1": { x: 200, y: 0, width: 120, height: 60 },
    },
    anclaLocalId: "o-1",
  };
}

function modeloConEstereotipo(plantilla: PlantillaEstereotipo, estId: Id = "est-1", nombre = "Trámite"): Modelo {
  const base = crearModelo();
  const estereotipo: Estereotipo = { id: estId, nombre, plantilla };
  // nextSeq alto: garantiza que los ids FRESCOS (o-100, p-101, …) no colisionen
  // por coincidencia con los ids LOCALES de la plantilla (o-1/p-1/e-1).
  return { ...base, nextSeq: 100, estereotipos: { [estId]: estereotipo } };
}

describe("injertarEstereotipo (D6.2)", () => {
  test("1. clona identidad FRESCA: ids nuevos, cosas existentes intactas", () => {
    let modelo = modeloConEstereotipo(plantillaDosCosasUnEnlace());
    // Una cosa preexistente que NO debe tocarse.
    modelo = debeOk(crearObjeto(modelo, modelo.opdRaizId, { x: 500, y: 500 }, "Cosa previa"));
    const entidadesPrevias = new Set(Object.keys(modelo.entidades));
    const enlacesPrevios = new Set(Object.keys(modelo.enlaces));

    const res = debeOk(injertarEstereotipo(modelo, "est-1", modelo.opdRaizId, { x: 100, y: 100 }));

    // 2 entidades NUEVAS (≠ ids de plantilla "o-1"/"p-1" y ≠ preexistentes).
    expect(res.entidadesCreadas).toHaveLength(2);
    for (const id of res.entidadesCreadas) {
      expect(id).not.toBe("o-1");
      expect(id).not.toBe("p-1");
      expect(entidadesPrevias.has(id)).toBe(false);
      expect(res.modelo.entidades[id]).toBeDefined();
    }
    // 1 enlace nuevo.
    const enlacesNuevos = Object.keys(res.modelo.enlaces).filter((id) => !enlacesPrevios.has(id));
    expect(enlacesNuevos).toHaveLength(1);
    // La cosa preexistente sigue ahí, sin cambios.
    const previa = Object.values(modelo.entidades).find((e) => e.nombre === "Cosa previa")!;
    expect(res.modelo.entidades[previa.id]).toEqual(previa);
    // Apariencias en el OPD destino, desplazadas por la posición.
    const opd = res.modelo.opds[modelo.opdRaizId]!;
    const apariciones = Object.values(opd.apariencias).filter((a) => res.entidadesCreadas.includes(a.entidadId));
    expect(apariciones).toHaveLength(2);
    const anclaApariencia = apariciones.find((a) => a.entidadId === res.anclaId)!;
    expect(anclaApariencia.x).toBe(100); // posicion.x + apariencia.x(0)
    expect(anclaApariencia.y).toBe(100);
  });

  test("2. el ancla recibe el estereotipoId aplicado", () => {
    const modelo = modeloConEstereotipo(plantillaDosCosasUnEnlace());
    const res = debeOk(injertarEstereotipo(modelo, "est-1", modelo.opdRaizId, { x: 0, y: 0 }));
    expect(res.anclaId).toBeDefined();
    const ancla = res.modelo.entidades[res.anclaId!]!;
    expect(ancla.estereotipoId).toBe("est-1");
    expect(estereotipoDe(res.modelo, ancla.estereotipoId!)?.id).toBe("est-1");
    // La cosa NO-ancla no porta estereotipoId.
    const otra = res.entidadesCreadas.find((id) => id !== res.anclaId)!;
    expect(res.modelo.entidades[otra]!.estereotipoId).toBeUndefined();
  });

  test("3. los enlaces reconectan por remapeo a las entidades clonadas", () => {
    const modelo = modeloConEstereotipo(plantillaDosCosasUnEnlace());
    const res = debeOk(injertarEstereotipo(modelo, "est-1", modelo.opdRaizId, { x: 0, y: 0 }));
    const enlaceClonado = Object.values(res.modelo.enlaces).find((e) => e.tipo === "consumo")!;
    const creadas = new Set(res.entidadesCreadas);
    expect(creadas.has(enlaceClonado.origenId.id)).toBe(true);
    expect(creadas.has(enlaceClonado.destinoId.id)).toBe(true);
    // NO apunta a los ids locales de la plantilla.
    expect(enlaceClonado.origenId.id).not.toBe("o-1");
    expect(enlaceClonado.destinoId.id).not.toBe("p-1");
  });

  test("4. idempotencia de identidad: dos injertos crean cosas distintas, sin colisión", () => {
    const modelo = modeloConEstereotipo(plantillaDosCosasUnEnlace());
    const primero = debeOk(injertarEstereotipo(modelo, "est-1", modelo.opdRaizId, { x: 0, y: 0 }));
    const segundo = debeOk(injertarEstereotipo(primero.modelo, "est-1", primero.modelo.opdRaizId, { x: 300, y: 300 }));
    const idsPrimero = new Set(primero.entidadesCreadas);
    for (const id of segundo.entidadesCreadas) {
      expect(idsPrimero.has(id)).toBe(false);
    }
    // 4 entidades distintas en total.
    expect(Object.keys(segundo.modelo.entidades)).toHaveLength(4);
    // nextSeq avanzó.
    expect(segundo.modelo.nextSeq).toBeGreaterThan(primero.modelo.nextSeq);
    expect(primero.modelo.nextSeq).toBeGreaterThan(modelo.nextSeq);
  });

  test("5. modelo resultante válido: round-trip export→hidratar (incluye contrato duro D6.1)", () => {
    const modelo = modeloConEstereotipo(plantillaDosCosasUnEnlace());
    const res = debeOk(injertarEstereotipo(modelo, "est-1", modelo.opdRaizId, { x: 50, y: 50 }));
    const hidratado = hidratarModelo(exportarModelo(res.modelo));
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    // El ancla clonada resuelve su estereotipoId contra el catálogo (contrato duro).
    const ancla = hidratado.value.entidades[res.anclaId!]!;
    expect(ancla.estereotipoId).toBe("est-1");
  });

  test("falla si el estereotipo no existe", () => {
    const modelo = crearModelo();
    expect(debeFallar(injertarEstereotipo(modelo, "est-fantasma", modelo.opdRaizId, { x: 0, y: 0 }))).toContain("est-fantasma");
  });

  test("falla si el estereotipo no tiene plantilla injertable (marcador puro)", () => {
    const base = crearModelo();
    const modelo: Modelo = { ...base, estereotipos: { "est-marca": { id: "est-marca", nombre: "Marca" } } };
    const error = debeFallar(injertarEstereotipo(modelo, "est-marca", modelo.opdRaizId, { x: 0, y: 0 }));
    expect(error).toContain("plantilla");
  });

  test("falla si el OPD destino no existe", () => {
    const modelo = modeloConEstereotipo(plantillaDosCosasUnEnlace());
    expect(debeFallar(injertarEstereotipo(modelo, "est-1", "opd-fantasma", { x: 0, y: 0 }))).toContain("opd-fantasma");
  });
});

describe("capturarPlantilla + crearEstereotipoDesdeSeleccion (D6.2)", () => {
  /** Modelo con 2 cosas + 1 enlace en el OPD raíz. */
  function modeloConSubgrafo(): { modelo: Modelo; objetoId: Id; procesoId: Id } {
    let modelo = crearModelo();
    modelo = debeOk(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Insumo"));
    modelo = debeOk(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 60 }, "Procesar"));
    const objetoId = Object.values(modelo.entidades).find((e) => e.nombre === "Insumo")!.id;
    const procesoId = Object.values(modelo.entidades).find((e) => e.nombre === "Procesar")!.id;
    modelo = debeOk(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(objetoId), extremoEntidad(procesoId), "consumo"));
    return { modelo, objetoId, procesoId };
  }

  test("6. captura ∘ injerto reproduce el subgrafo (topología equivalente)", () => {
    const { modelo, objetoId, procesoId } = modeloConSubgrafo();
    const plantilla = debeOk(capturarPlantilla(modelo, modelo.opdRaizId, [objetoId, procesoId], objetoId));
    expect(Object.keys(plantilla.entidades)).toHaveLength(2);
    expect(Object.keys(plantilla.enlaces)).toHaveLength(1);
    // ids locales estables (no comparten espacio con el bundle).
    expect(Object.keys(plantilla.apariencias)).toHaveLength(2);

    const creado = debeOk(crearEstereotipoDesdeSeleccion(modelo, modelo.opdRaizId, [objetoId, procesoId], "Trámite", { anclaId: objetoId }));
    expect(creado.estereotipoId).toMatch(/^est-/);
    // No colisiona con el id de fábrica.
    expect(creado.estereotipoId).not.toBe("est:requirement");

    const res = debeOk(injertarEstereotipo(creado.modelo, creado.estereotipoId, creado.modelo.opdRaizId, { x: 600, y: 600 }));
    expect(res.entidadesCreadas).toHaveLength(2);
    const enlacesNuevos = Object.values(res.modelo.enlaces).filter((e) => !modelo.enlaces[e.id]);
    expect(enlacesNuevos).toHaveLength(1);
    expect(enlacesNuevos[0]!.tipo).toBe("consumo");
    // Round-trip válido.
    expect(hidratarModelo(exportarModelo(res.modelo)).ok).toBe(true);
  });

  test("captura normaliza el layout relativo a (0,0)", () => {
    const { modelo, objetoId, procesoId } = modeloConSubgrafo();
    const plantilla = debeOk(capturarPlantilla(modelo, modelo.opdRaizId, [objetoId, procesoId]));
    const xs = Object.values(plantilla.apariencias).map((a) => a.x);
    const ys = Object.values(plantilla.apariencias).map((a) => a.y);
    expect(Math.min(...xs)).toBe(0);
    expect(Math.min(...ys)).toBe(0);
  });

  test("crearEstereotipoDesdeSeleccion guarda propositoDeModelado cuando se da", () => {
    const { modelo, objetoId, procesoId } = modeloConSubgrafo();
    const creado = debeOk(crearEstereotipoDesdeSeleccion(modelo, modelo.opdRaizId, [objetoId, procesoId], "Trámite", {
      propositoDeModelado: "Patrón de trámite documental.",
    }));
    expect(creado.modelo.estereotipos?.[creado.estereotipoId]?.propositoDeModelado).toBe("Patrón de trámite documental.");
  });

  test("captura rechaza selección vacía", () => {
    const { modelo } = modeloConSubgrafo();
    expect(debeFallar(capturarPlantilla(modelo, modelo.opdRaizId, []))).toBeTruthy();
  });

  test("8. fuera de alcance: capturar una selección con refinamiento es rechazado con mensaje claro", () => {
    let modelo = crearModelo();
    modelo = debeOk(crearProceso(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Atender"));
    const procesoId = Object.values(modelo.entidades).find((e) => e.nombre === "Atender")!.id;
    modelo = debeOk(descomponerProceso(modelo, modelo.opdRaizId, procesoId)).modelo;
    const error = debeFallar(capturarPlantilla(modelo, modelo.opdRaizId, [procesoId]));
    expect(error.toLowerCase()).toMatch(/refinamiento|alcance/);
  });
});

void (null as unknown as Estereotipo);
