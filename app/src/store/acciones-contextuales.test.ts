import { describe, expect, test } from "bun:test";
import type { Entidad } from "../modelo/tipos";
import { accionesContextualesEntidad, accionesParaSuperficie } from "./acciones-contextuales";

const objeto: Entidad = { id: "obj-1", tipo: "objeto", nombre: "Objeto", esencia: "informacional", afiliacion: "sistemica" };
const objetoRefinado: Entidad = {
  ...objeto,
  refinamientos: {
    descomposicion: { opdId: "opd-zoom" },
    despliegue: { opdId: "opd-unfold", modo: "agregacion" },
  },
};
const proceso: Entidad = { id: "proc-1", tipo: "proceso", nombre: "Proceso", esencia: "informacional", afiliacion: "sistemica" };

function ids(acciones: readonly { id: string }[]): string[] {
  return acciones.map((accion) => accion.id);
}

describe("accionesContextualesEntidad", () => {
  test("deja copiar/pegar estilo fuera de barra y disponible en menú/paleta", () => {
    const acciones = accionesContextualesEntidad({
      entidad: objeto,
      enlaceEstiloId: "enlace-1",
      hayEstiloEnPortapapeles: true,
      inspectorAbierto: true,
      multi: false,
    });
    const barra = ids(accionesParaSuperficie(acciones, "barra-flotante"));
    const menu = ids(accionesParaSuperficie(acciones, "menu-contextual"));
    const palette = ids(accionesParaSuperficie(acciones, "command-palette"));

    expect(acciones.find((accion) => accion.id === "copiar-estilo")?.visible).toBe(true);
    expect(acciones.find((accion) => accion.id === "pegar-estilo")?.visible).toBe(true);
    expect(barra).not.toContain("copiar-estilo");
    expect(barra).not.toContain("pegar-estilo");
    expect(barra).toContain("mas-opciones");
    expect(menu).toContain("copiar-estilo");
    expect(menu).toContain("pegar-estilo");
    expect(palette).toContain("copiar-estilo");
    expect(palette).toContain("pegar-estilo");
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

  test("migra quitar refinamientos a menú contextual y command palette", () => {
    const acciones = accionesContextualesEntidad({
      entidad: objetoRefinado,
      enlaceEstiloId: null,
      hayEstiloEnPortapapeles: false,
      inspectorAbierto: false,
      multi: false,
    });
    const barra = ids(accionesParaSuperficie(acciones, "barra-flotante"));
    const menu = ids(accionesParaSuperficie(acciones, "menu-contextual"));
    const palette = ids(accionesParaSuperficie(acciones, "command-palette"));

    expect(barra).not.toContain("quitar-descomposicion");
    expect(barra).not.toContain("quitar-despliegue");
    expect(menu).toContain("quitar-descomposicion");
    expect(menu).toContain("quitar-despliegue");
    expect(palette).toContain("quitar-descomposicion");
    expect(palette).toContain("quitar-despliegue");
    expect(acciones.find((accion) => accion.id === "quitar-descomposicion")?.destructiva).toBe(true);
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
