import { describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import type { Modelo } from "../modelo/tipos";
import { BreadcrumbView, rutaBreadcrumbOpd } from "./Breadcrumb";
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

  test("corta ciclos defensivamente", () => {
    const modelo = modeloConRuta();
    modelo.opds["opd-1"] = { ...modelo.opds["opd-1"]!, padreId: "opd-3" };

    expect(rutaBreadcrumbOpd(modelo, "opd-3").map((segmento) => segmento.id)).toEqual(["opd-1", "opd-2", "opd-3"]);
  });

  test("renderiza breadcrumb completo Codex v1.1 con separadores y jerarquia visual", () => {
    const v = BreadcrumbView({
      segmentos: [
        { id: "sistema", nombre: "sistema" },
        { id: "system-diagram", nombre: "system diagram" },
        { id: "sd1", nombre: "sd1" },
      ],
      opdActivoId: "sd1",
      cambiarOpdActivo: () => undefined,
    }) as unknown as Vnode;

    const wraps = hijos(v);
    const botones = botonesDe(v);
    const segundoSeparador = hijos(wraps[1]!)[0]!;
    const tercerSeparador = hijos(wraps[2]!)[0]!;

    expect(botones.map((boton) => boton.props.children)).toEqual(["sistema", "system diagram", "sd1"]);
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
        { id: "sistema", nombre: "sistema" },
        { id: "system-diagram", nombre: "system diagram" },
        { id: "sd1", nombre: "sd1" },
      ],
      opdActivoId: "sd1",
      cambiarOpdActivo: (id) => visitados.push(id),
    }) as unknown as Vnode;

    const botones = botonesDe(v);

    expect(v.props["data-testid"]).toBe("breadcrumb-opd");
    expect(botones.map((boton) => boton.props["data-testid"])).toEqual([
      "breadcrumb-opd-sistema",
      "breadcrumb-opd-system-diagram",
      "breadcrumb-opd-sd1",
    ]);
    expect(botones[2]!.props["aria-current"]).toBe("page");

    botones[0]!.props.onClick();
    botones[2]!.props.onClick();

    expect(visitados).toEqual(["sistema"]);
  });
});

function modeloConRuta(): Modelo {
  const modelo = crearModelo();
  modelo.opds["opd-1"] = { ...modelo.opds["opd-1"]!, nombre: "SD" };
  modelo.opds["opd-2"] = { id: "opd-2", nombre: "Atencion HODOM", padreId: "opd-1", apariencias: {}, enlaces: {} };
  modelo.opds["opd-3"] = { id: "opd-3", nombre: "Visita", padreId: "opd-2", apariencias: {}, enlaces: {} };
  return modelo;
}
