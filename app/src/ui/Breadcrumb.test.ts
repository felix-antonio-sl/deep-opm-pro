import { describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import type { Modelo } from "../modelo/tipos";
import { rutaBreadcrumbOpd } from "./Breadcrumb";

describe("Breadcrumb OPD", () => {
  test("devuelve ruta jerarquica desde SD hasta OPD activo", () => {
    const modelo = modeloConRuta();

    expect(rutaBreadcrumbOpd(modelo, "opd-3")).toEqual([
      { id: "opd-1", nombre: "SD" },
      { id: "opd-2", nombre: "Atencion HODOM" },
      { id: "opd-3", nombre: "Visita" },
    ]);
  });

  test("cae a raiz si el OPD activo no existe", () => {
    const modelo = modeloConRuta();

    expect(rutaBreadcrumbOpd(modelo, "missing")).toEqual([
      { id: "opd-1", nombre: "SD" },
    ]);
  });

  test("corta ciclos defensivamente", () => {
    const modelo = modeloConRuta();
    modelo.opds["opd-1"] = { ...modelo.opds["opd-1"]!, padreId: "opd-3" };

    expect(rutaBreadcrumbOpd(modelo, "opd-3").map((segmento) => segmento.id)).toEqual(["opd-1", "opd-2", "opd-3"]);
  });
});

function modeloConRuta(): Modelo {
  const modelo = crearModelo();
  modelo.opds["opd-1"] = { ...modelo.opds["opd-1"]!, nombre: "SD" };
  modelo.opds["opd-2"] = { id: "opd-2", nombre: "Atencion HODOM", padreId: "opd-1", apariencias: {}, enlaces: {} };
  modelo.opds["opd-3"] = { id: "opd-3", nombre: "Visita", padreId: "opd-2", apariencias: {}, enlaces: {} };
  return modelo;
}
