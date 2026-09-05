import { describe, expect, test } from "bun:test";
import { crearModelo } from "../../modelo/operaciones";
import { exportarModelo } from "../../serializacion/json";
import { store } from "../../store";

function cargarComo(especie: "apunte" | "modelo" | "biblioteca"): void {
  const modelo = crearModelo(`Store ${especie}`);
  store.getState().activarReadOnly(false);
  store.getState().importarJson(exportarModelo(modelo));
  const entrada = {
    id: modelo.id,
    carpetaId: null,
    ...(especie === "apunte" ? { esApunte: true } : {}),
    ...(especie === "biblioteca" ? { esBiblioteca: true } : {}),
  };
  store.setState((estado) => ({
    modeloPersistidoId: modelo.id,
    indice: { ...estado.indice, modelos: [entrada] },
  }));
}

describe("store · Mesa de exploración", () => {
  test("en un Apunte recorre fuente → trazo → propuesta → hecho con un commit atómico", () => {
    cargarComo("apunte");
    const fuenteId = store.getState().agregarFuenteExploracion({ contenido: "Existe una solicitud" });
    expect(fuenteId).not.toBeNull();
    const trazoId = store.getState().agregarTrazoExploracion({ fuenteIds: [fuenteId!], texto: "una solicitud" });
    expect(trazoId).not.toBeNull();
    const propuestaId = store.getState().crearPropuestaExploracion({
      trazoIds: [trazoId!],
      entidadTipo: "objeto",
      nombre: "Solicitud",
    });
    expect(propuestaId).not.toBeNull();
    expect(Object.keys(store.getState().modelo.entidades)).toHaveLength(0);

    const targetId = store.getState().confirmarPropuestaExploracion(propuestaId!);
    expect(targetId).not.toBeNull();
    expect(store.getState().modelo.entidades[targetId!]?.nombre).toBe("Solicitud");
    expect(Object.keys(store.getState().modelo.mesaExploracion!.confirmaciones)).toHaveLength(1);

    store.getState().deshacer();
    expect(store.getState().modelo.entidades[targetId!]).toBeUndefined();
    expect(Object.keys(store.getState().modelo.mesaExploracion!.confirmaciones)).toHaveLength(0);
    expect(store.getState().modelo.mesaExploracion!.propuestas[propuestaId!]?.estado).toBe("pendiente");
    expect(store.getState().modelo.mesaExploracion!.fuentes[fuenteId!]).toBeDefined();
    expect(store.getState().modelo.mesaExploracion!.trazos[trazoId!]).toBeDefined();

    store.getState().rehacer();
    expect(store.getState().modelo.entidades[targetId!]?.nombre).toBe("Solicitud");
    expect(Object.keys(store.getState().modelo.mesaExploracion!.confirmaciones)).toHaveLength(1);
  });

  test("edita el trazo y la interpretación mientras la propuesta está pendiente", () => {
    cargarComo("apunte");
    const fuenteId = store.getState().agregarFuenteExploracion({ contenido: "texto" })!;
    const trazoId = store.getState().agregarTrazoExploracion({ fuenteIds: [fuenteId], texto: "cosa" })!;
    const propuestaId = store.getState().crearPropuestaExploracion({
      trazoIds: [trazoId],
      entidadTipo: "objeto",
      nombre: "Cosa",
    })!;

    store.getState().editarTrazoExploracion(trazoId, "ocurre una revisión");
    store.getState().editarPropuestaExploracion(propuestaId, { entidadTipo: "proceso", nombre: "Revisar" });

    expect(store.getState().modelo.mesaExploracion!.trazos[trazoId]?.texto).toBe("ocurre una revisión");
    expect(store.getState().modelo.mesaExploracion!.propuestas[propuestaId]?.operacion).toMatchObject({
      entidadTipo: "proceso",
      nombre: "Revisar",
    });
  });

  for (const especie of ["modelo", "biblioteca"] as const) {
    test(`rechaza sin mutación cuando la especie activa es ${especie}`, () => {
      cargarComo(especie);
      const antes = store.getState().modelo;

      const fuenteId = store.getState().agregarFuenteExploracion({ contenido: "texto" });

      expect(fuenteId).toBeNull();
      expect(store.getState().modelo).toBe(antes);
      expect(store.getState().modelo.mesaExploracion).toBeUndefined();
      expect(store.getState().mensaje).toContain("Apunte");
    });
  }

  test("rechaza si el record marcado Apunte no corresponde al modelo vivo", () => {
    cargarComo("apunte");
    store.setState((estado) => ({ modelo: { ...estado.modelo, id: "modelo-distinto" } }));
    const antes = store.getState().modelo;

    const fuenteId = store.getState().agregarFuenteExploracion({ contenido: "texto" });

    expect(fuenteId).toBeNull();
    expect(store.getState().modelo).toBe(antes);
    expect(store.getState().mensaje).toContain("Apunte activo");
  });
});
