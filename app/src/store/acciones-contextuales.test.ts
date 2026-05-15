import { describe, expect, test } from "bun:test";
import type { Entidad } from "../modelo/tipos";
import { accionesContextualesEntidad, accionesParaSuperficie } from "./acciones-contextuales";

const objeto: Entidad = { id: "obj-1", tipo: "objeto", nombre: "Objeto", esencia: "informacional", afiliacion: "sistemica" };
const proceso: Entidad = { id: "proc-1", tipo: "proceso", nombre: "Proceso", esencia: "informacional", afiliacion: "sistemica" };

function ids(acciones: readonly { id: string }[]): string[] {
  return acciones.map((accion) => accion.id);
}

describe("accionesContextualesEntidad", () => {
  test("preserva en barra las reglas de visibilidad para estilo de enlace", () => {
    const acciones = accionesContextualesEntidad({
      entidad: objeto,
      enlaceEstiloId: null,
      hayEstiloEnPortapapeles: true,
      inspectorAbierto: true,
      multi: false,
    });

    expect(acciones.find((accion) => accion.id === "copiar-estilo")?.visible).toBe(false);
    expect(acciones.find((accion) => accion.id === "pegar-estilo")?.visible).toBe(false);
    expect(ids(accionesParaSuperficie(acciones, "barra-flotante"))).not.toContain("copiar-estilo");
    expect(ids(accionesParaSuperficie(acciones, "barra-flotante"))).toContain("mas-opciones");
  });

  test("expone menu contextual sin controles propios de barra", () => {
    const acciones = accionesContextualesEntidad({
      entidad: objeto,
      enlaceEstiloId: "enlace-1",
      hayEstiloEnPortapapeles: true,
      inspectorAbierto: false,
      multi: false,
    });
    const menu = ids(accionesParaSuperficie(acciones, "menu-contextual"));

    expect(menu).toContain("inzoom");
    expect(menu).toContain("ocultar-apariencia");
    expect(menu).not.toContain("mas-opciones");
    expect(menu).not.toContain("traer-enlaces");
  });

  test("activa traer enlaces solo en multiseleccion", () => {
    const acciones = accionesContextualesEntidad({
      entidad: proceso,
      enlaceEstiloId: "enlace-1",
      hayEstiloEnPortapapeles: false,
      inspectorAbierto: false,
      multi: true,
    });
    const menu = ids(accionesParaSuperficie(acciones, "menu-contextual"));

    expect(menu).toContain("traer-enlaces");
  });

  test("oculta acciones exclusivas de objeto para procesos y conserva alias deshabilitado", () => {
    const acciones = accionesContextualesEntidad({
      entidad: proceso,
      enlaceEstiloId: "enlace-1",
      hayEstiloEnPortapapeles: true,
      inspectorAbierto: false,
      multi: false,
    });
    const palette = ids(accionesParaSuperficie(acciones, "command-palette"));

    expect(palette).not.toContain("agregar-estado");
    expect(palette).not.toContain("editar-imagen");
    expect(palette).toContain("unfold");
    expect(palette).toContain("editar-alias");
    expect(acciones.find((accion) => accion.id === "editar-alias")?.enabled).toBe(false);
  });
});
