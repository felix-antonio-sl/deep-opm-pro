import { describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import type { Modelo } from "../modelo/tipos";
import { BreadcrumbView, codigoBreadcrumb, colapsarSegmentosBreadcrumb, rutaBreadcrumbCodex, rutaBreadcrumbOpd } from "./Breadcrumb";
import { tokens } from "./tokens";

type Vnode = { type: unknown; props: Record<string, any> };

function hijos(v: Vnode): Vnode[] {
  const c = v.props.children;
  return (Array.isArray(c) ? c : [c]).filter((x): x is Vnode => !!x && typeof x === "object");
}

function botonesDe(v: Vnode): Vnode[] {
  return hijos(v).map((wrap) => hijos(wrap).find((nodo) => nodo.type === "button")!);
}

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

  test("expone la jerarquia Codex completa para la raiz", () => {
    const modelo = modeloConRuta();

    expect(rutaBreadcrumbCodex(modelo, "opd-1")).toEqual([
      { id: "modelo", nombre: "modelo" },
      { id: "sd", nombre: "sd" },
    ]);
  });

  test("agrega el OPD hijo despues de modelo y sd, con codigo compacto y titulo completo", () => {
    const modelo = modeloConRuta();

    expect(rutaBreadcrumbCodex(modelo, "opd-3")).toEqual([
      { id: "modelo", nombre: "modelo" },
      { id: "sd", nombre: "sd" },
      { id: "opd-2", nombre: "atencion hodom", titulo: "Atencion HODOM" },
      { id: "opd-3", nombre: "visita", titulo: "Visita" },
    ]);
  });

  test("codigoBreadcrumb toma el prefijo canonico antes del separador descriptivo", () => {
    expect(codigoBreadcrumb("SD1.M2.1.R - Realizacion de la atencion (prestaciones)")).toBe("sd1.m2.1.r");
    expect(codigoBreadcrumb("SD1.M2 : Modulo de atencion")).toBe("sd1.m2");
    expect(codigoBreadcrumb("SD")).toBe("sd");
    expect(codigoBreadcrumb("Visita")).toBe("visita");
  });

  test("corta ciclos defensivamente", () => {
    const modelo = modeloConRuta();
    modelo.opds["opd-1"] = { ...modelo.opds["opd-1"]!, padreId: "opd-3" };

    expect(rutaBreadcrumbOpd(modelo, "opd-3").map((segmento) => segmento.id)).toEqual(["opd-1", "opd-2", "opd-3"]);
  });

  test("renderiza breadcrumb completo Codex v1.1 con separadores y jerarquia visual", () => {
    const v = BreadcrumbView({
      segmentos: [
        { id: "modelo", nombre: "modelo" },
        { id: "sd", nombre: "sd" },
        { id: "sd1", nombre: "sd1" },
      ],
      opdActivoId: "sd1",
      cambiarOpdActivo: () => undefined,
    }) as unknown as Vnode;

    const wraps = hijos(v);
    const botones = botonesDe(v);
    const segundoSeparador = hijos(wraps[1]!)[0]!;
    const tercerSeparador = hijos(wraps[2]!)[0]!;

    expect(botones.map((boton) => boton.props.children)).toEqual(["modelo", "sd", "sd1"]);
    expect(segundoSeparador.props.children).toBe("·");
    expect(tercerSeparador.props.children).toBe("·");
    expect(segundoSeparador.props.style.color).toBe(tokens.colors.inkFaint);
    expect(botones[0]!.props.style.color).toBe(tokens.colors.inkMid);
    expect(botones[1]!.props.style.color).toBe(tokens.colors.inkMid);
    expect(botones[2]!.props.style.color).toBe(tokens.colors.ink);
    expect(botones[2]!.props.style.fontWeight).toBe(tokens.typography.weights.bold);
  });

  test("mantiene testIds y navegacion solo en segmentos intermedios", () => {
    const visitados: string[] = [];
    const v = BreadcrumbView({
      segmentos: [
        { id: "modelo", nombre: "modelo" },
        { id: "sd", nombre: "sd" },
        { id: "sd1", nombre: "sd1" },
      ],
      opdActivoId: "sd1",
      cambiarOpdActivo: (id) => visitados.push(id),
    }) as unknown as Vnode;

    const botones = botonesDe(v);

    expect(v.props["data-testid"]).toBe("breadcrumb-opd");
    expect(botones.map((boton) => boton.props["data-testid"])).toEqual([
      "breadcrumb-opd-modelo",
      "breadcrumb-opd-sd",
      "breadcrumb-opd-sd1",
    ]);
    expect(botones[2]!.props["aria-current"]).toBe("page");

    botones[0]!.props.onClick();
    botones[2]!.props.onClick();

    expect(visitados).toEqual(["modelo"]);
  });

  test("colapsa NIVELES con marca … explicita y recorta segmentos largos con ellipsis (excede la barra)", () => {
    const segmentos = colapsarSegmentosBreadcrumb([
      { id: "modelo", nombre: "modelo" },
      { id: "sd", nombre: "sd" },
      { id: "sd1", nombre: "sd1" },
      { id: "sd1-1", nombre: "sd1.1" },
      { id: "sd1-1-1", nombre: "sd1.1.1" },
    ]);

    expect(segmentos.map((segmento) => segmento.nombre)).toEqual([
      "modelo",
      "sd",
      "…",
      "sd1.1",
      "sd1.1.1",
    ]);

    const v = BreadcrumbView({
      segmentos,
      opdActivoId: "sd1-1-1",
      cambiarOpdActivo: () => undefined,
    }) as unknown as Vnode;
    const botones = botonesDe(v).filter(Boolean);

    expect(botones.map((boton) => boton.props.children)).toEqual([
      "modelo",
      "sd",
      "sd1.1",
      "sd1.1.1",
    ]);
    // Colapso de NIVELES = marca «…» explícita (segmento overflow, arriba). El
    // recorte de un segmento largo individual sí usa ellipsis + overflow hidden
    // (solución al exceso de la barra contenedora, BUG-7f09f9).
    expect(botones[0]!.props.style.textOverflow).toBe("ellipsis");
    expect(botones[0]!.props.style.overflow).toBe("hidden");
  });
});

function modeloConRuta(): Modelo {
  const modelo = crearModelo();
  modelo.opds["opd-1"] = { ...modelo.opds["opd-1"]!, nombre: "SD" };
  modelo.opds["opd-2"] = { id: "opd-2", nombre: "Atencion HODOM", padreId: "opd-1", apariencias: {}, enlaces: {} };
  modelo.opds["opd-3"] = { id: "opd-3", nombre: "Visita", padreId: "opd-2", apariencias: {}, enlaces: {} };
  return modelo;
}
