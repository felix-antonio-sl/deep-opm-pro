import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../modelo/tipos";
import { derivarPanelOpl, referenciaSeleccionada } from "./panel";

describe("panel OPL como capacidad", () => {
  test("deriva lineas, texto y bloques sin alterar frases OPL", () => {
    const { modelo } = modeloBasico();

    const derivado = derivarPanelOpl({
      modelo,
      opdActivoId: modelo.opdRaizId,
      seleccionId: null,
      enlaceSeleccionId: null,
      filtroActivo: false,
      busquedaOpl: "",
      editorLibre: false,
      textoLibre: "",
    });

    expect(derivado.textoOplActual).toContain("*Procesar* consume **Entrada**.");
    expect(derivado.textoOplActual).toBe(derivado.lineas.map((linea) => linea.texto).join("\n"));
    expect(derivado.bloques.map((bloque) => bloque.opdId)).toEqual([modelo.opdRaizId]);
    expect(derivado.visibles).toHaveLength(derivado.lineas.length);
    expect(derivado.visiblesPorId.size).toBe(derivado.lineas.length);
    expect(derivado.previewLibre).toBeNull();
  });

  test("aplica filtro por seleccion y busqueda como derivacion pura", () => {
    const { modelo, procesarId } = modeloBasico();

    const derivado = derivarPanelOpl({
      modelo,
      opdActivoId: modelo.opdRaizId,
      seleccionId: procesarId,
      enlaceSeleccionId: null,
      filtroActivo: true,
      busquedaOpl: "consume",
      editorLibre: false,
      textoLibre: "",
    });

    expect(derivado.seleccionRef).toEqual({ tipo: "entidad", id: procesarId });
    expect(derivado.visibles.length).toBeGreaterThan(0);
    expect(derivado.visibles.every((linea) => linea.texto.toLowerCase().includes("consume"))).toBe(true);
    expect(derivado.visibles.every((linea) => linea.refs.some((ref) => ref.tipo === "entidad" && ref.id === procesarId))).toBe(true);
    expect(derivado.primeraVisibleSeleccionada?.texto).toContain("consume");
  });

  test("calcula preview libre solo cuando el editor esta activo", () => {
    const { modelo } = modeloBasico();
    const base = derivarPanelOpl({
      modelo,
      opdActivoId: modelo.opdRaizId,
      seleccionId: null,
      enlaceSeleccionId: null,
      filtroActivo: false,
      busquedaOpl: "",
      editorLibre: false,
      textoLibre: "",
    });

    const conEditor = derivarPanelOpl({
      modelo,
      opdActivoId: modelo.opdRaizId,
      seleccionId: null,
      enlaceSeleccionId: null,
      filtroActivo: false,
      busquedaOpl: "",
      editorLibre: true,
      textoLibre: base.textoOplActual.replace("Entrada", "Cliente"),
    });

    expect(base.previewLibre).toBeNull();
    expect(conEditor.previewLibre?.diagnosticos.filter((diagnostico) => diagnostico.severidad === "error")).toHaveLength(0);
    expect(conEditor.previewLibre?.patches.length).toBeGreaterThan(0);
  });

  test("prioriza referencia de enlace sobre entidad seleccionada", () => {
    expect(referenciaSeleccionada("entidad-1", "enlace-1")).toEqual({ tipo: "enlace", id: "enlace-1" });
  });

  test("doble pase: textoOplActual es canónico aunque visibilidad oculte esencia en display", () => {
    // Modelo mínimo con un objeto Sensor (esencia=informacional por defecto)
    let modelo = crearModelo("sensor-test");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Sensor"));

    const out = derivarPanelOpl({
      modelo,
      opdActivoId: modelo.opdRaizId,
      seleccionId: null,
      enlaceSeleccionId: null,
      filtroActivo: false,
      busquedaOpl: "",
      editorLibre: false,
      textoLibre: "",
      visibilidad: { esencia: "oculta" },
    });

    // Las líneas de display NO deben contener la oración de esencia
    expect(out.visibles.some((l) => l.texto.includes("es informacional"))).toBe(false);
    // El texto canónico SÍ debe contener la oración de esencia (roundtrip protegido)
    expect(out.textoOplActual.includes("es informacional")).toBe(true);
  });
});

function modeloBasico(): { modelo: Modelo; procesarId: Id } {
  let modelo = crearModelo("OPL");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Entrada"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Procesar"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 400, y: 0 }, "Salida"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), entidad(modelo, "Procesar"), "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Procesar"), entidad(modelo, "Salida"), "resultado"));
  return { modelo, procesarId: entidad(modelo, "Procesar") };
}

function entidad(modelo: Modelo, nombre: string): Id {
  const encontrada = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!encontrada) throw new Error(`Entidad no encontrada: ${nombre}`);
  return encontrada.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
