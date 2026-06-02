import { describe, expect, test } from "bun:test";
import type { Enlace, Entidad } from "../modelo/tipos";
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
const enlace: Enlace = {
  id: "enlace-1",
  tipo: "consumo",
  origenId: { kind: "entidad", id: proceso.id },
  destinoId: { kind: "entidad", id: objeto.id },
  etiqueta: "",
};

function ids(acciones: readonly { id: string }[]): string[] {
  return acciones.map((accion) => accion.id);
}

describe("accionesContextualesEntidad", () => {
  test("expone acciones primarias de cosa sin controles de estilo", () => {
    const acciones = accionesContextualesEntidad({
      entidad: objeto,
      inspectorAbierto: true,
      multi: false,
    });
    const barra = ids(accionesParaSuperficie(acciones, "barra-flotante"));
    const menu = ids(accionesParaSuperficie(acciones, "menu-contextual"));
    const palette = ids(accionesParaSuperficie(acciones, "command-palette"));

    expect(barra).toContain("mas-opciones");
    expect(menu).toContain("inzoom");
    expect(menu).toContain("ocultar-apariencia");
    expect(palette).toContain("editar-alias");
  });

  test("expone acciones primarias de enlace en barra", () => {
    const acciones = accionesContextualesEntidad({
      entidad: null,
      enlace,
      inspectorAbierto: false,
      multi: false,
    });
    const barra = ids(accionesParaSuperficie(acciones, "barra-flotante"));
    const palette = ids(accionesParaSuperficie(acciones, "command-palette"));

    expect(barra).toEqual(["cambiar-tipo-enlace", "mas-opciones"]);
    expect(acciones.find((accion) => accion.id === "cambiar-tipo-enlace")?.label).toBe("Editar propiedades del enlace");
    expect(acciones.find((accion) => accion.id === "cambiar-tipo-enlace")?.texto).toBe("Propiedades");
    expect(acciones.find((accion) => accion.id === "mas-opciones")?.texto).toBe("Inspector");
    expect(palette).toContain("cambiar-tipo-enlace");
  });

  test("expone menu contextual sin controles propios de barra", () => {
    const acciones = accionesContextualesEntidad({
      entidad: objeto,
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
      inspectorAbierto: false,
      multi: true,
    });
    const menu = ids(accionesParaSuperficie(acciones, "menu-contextual"));
    const barra = ids(accionesParaSuperficie(acciones, "barra-flotante"));

    expect(menu).toContain("traer-enlaces");
    expect(barra).toContain("traer-enlaces");
    expect(barra).toContain("eliminar-seleccion");
    expect(barra).toContain("agregar-como-partes");
    expect(barra).toContain("alinear-seleccion");
    expect(barra).toContain("distribuir-seleccion");
  });

  test("oculta acciones exclusivas de objeto para procesos y conserva alias habilitado", () => {
    const acciones = accionesContextualesEntidad({
      entidad: proceso,
      inspectorAbierto: false,
      multi: false,
    });
    const palette = ids(accionesParaSuperficie(acciones, "command-palette"));

    expect(palette).not.toContain("agregar-estado");
    expect(palette).not.toContain("editar-imagen");
    expect(palette).toContain("unfold");
    expect(palette).toContain("editar-alias");
    expect(acciones.find((accion) => accion.id === "editar-alias")?.enabled).toBe(true);
  });

  test("expone requisitos y submodelos sólo en menú contextual canónico", () => {
    const acciones = accionesContextualesEntidad({
      entidad: objeto,
      inspectorAbierto: false,
      multi: false,
    });
    const menu = ids(accionesParaSuperficie(acciones, "menu-contextual"));
    const palette = ids(accionesParaSuperficie(acciones, "command-palette"));

    expect(menu).toEqual(expect.arrayContaining(["marcar-requisito", "satisfacer-requisito", "conectar-submodelo"]));
    expect(palette).not.toContain("marcar-requisito");
    expect(palette).not.toContain("satisfacer-requisito");
    expect(palette).not.toContain("conectar-submodelo");
  });

  describe("consultas de razonamiento (Piso 3)", () => {
    test("objeto: ofrece 'qué afecta' e 'impacto de eliminar', no 'qué requiere'", () => {
      const acciones = accionesContextualesEntidad({ entidad: objeto, inspectorAbierto: false, multi: false });
      const menu = ids(accionesParaSuperficie(acciones, "menu-contextual"));
      expect(menu).toContain("razonar-afectan-a");
      expect(menu).toContain("razonar-impacto-eliminar");
      expect(menu).not.toContain("razonar-requerido-por");
    });

    test("proceso: ofrece 'qué requiere' e 'impacto', no 'qué afecta'", () => {
      const acciones = accionesContextualesEntidad({ entidad: proceso, inspectorAbierto: false, multi: false });
      const menu = ids(accionesParaSuperficie(acciones, "menu-contextual"));
      expect(menu).toContain("razonar-requerido-por");
      expect(menu).toContain("razonar-impacto-eliminar");
      expect(menu).not.toContain("razonar-afectan-a");
    });

    test("disponibles también en el command palette", () => {
      const acciones = accionesContextualesEntidad({ entidad: proceso, inspectorAbierto: false, multi: false });
      const palette = ids(accionesParaSuperficie(acciones, "command-palette"));
      expect(palette).toContain("razonar-requerido-por");
      expect(palette).toContain("razonar-impacto-eliminar");
    });

    test("no aparecen en la barra flotante ni sin cosa seleccionada", () => {
      const conObjeto = accionesContextualesEntidad({ entidad: objeto, inspectorAbierto: false, multi: false });
      expect(ids(accionesParaSuperficie(conObjeto, "barra-flotante"))).not.toContain("razonar-afectan-a");
      const sinCosa = accionesContextualesEntidad({ entidad: null, inspectorAbierto: false, multi: false });
      const menu = ids(accionesParaSuperficie(sinCosa, "menu-contextual"));
      expect(menu).not.toContain("razonar-afectan-a");
      expect(menu).not.toContain("razonar-impacto-eliminar");
    });
  });

  describe("verificación de coherencia de descomposición (Piso 2)", () => {
    const procesoDescompuesto: Entidad = { ...proceso, refinamientos: { descomposicion: { opdId: "opd-z" } } };

    test("proceso descompuesto: ofrece verificar coherencia (menú + paleta)", () => {
      const acciones = accionesContextualesEntidad({ entidad: procesoDescompuesto, inspectorAbierto: false, multi: false });
      expect(ids(accionesParaSuperficie(acciones, "menu-contextual"))).toContain("verificar-coherencia-descomposicion");
      expect(ids(accionesParaSuperficie(acciones, "command-palette"))).toContain("verificar-coherencia-descomposicion");
    });

    test("proceso sin descomposición: no la ofrece", () => {
      const acciones = accionesContextualesEntidad({ entidad: proceso, inspectorAbierto: false, multi: false });
      expect(ids(accionesParaSuperficie(acciones, "menu-contextual"))).not.toContain("verificar-coherencia-descomposicion");
    });

    test("no se ofrece en la barra flotante", () => {
      const acciones = accionesContextualesEntidad({ entidad: procesoDescompuesto, inspectorAbierto: false, multi: false });
      expect(ids(accionesParaSuperficie(acciones, "barra-flotante"))).not.toContain("verificar-coherencia-descomposicion");
    });
  });
});
