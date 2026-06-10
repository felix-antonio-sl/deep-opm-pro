import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso, descomponerProceso, desplegarObjeto } from "../../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../../modelo/tipos";
import { calcularBadges, labelTipoBadge, tagAnclasOpd, tagVistaOpd } from "./badges";

describe("badges del arbol OPD", () => {
  test("calcularBadges identifica SD raiz sin refinador", () => {
    const modelo = crearModelo("Badges");

    expect(calcularBadges(modelo, modelo.opdRaizId)).toMatchObject({
      tipo: "raiz",
      refinadorId: null,
      cuentaObjetos: 0,
      cuentaProcesos: 0,
      cuentaEnlaces: 0,
      tieneIssues: false,
    });
  });

  test("calcularBadges identifica inzoom y expone el proceso refinador", () => {
    const base = modeloConProceso();
    const procesoId = entidadPorNombre(base, "Atender").id;
    const refinado = must(descomponerProceso(base, base.opdRaizId, procesoId));

    expect(calcularBadges(refinado.modelo, refinado.opdId)).toMatchObject({
      tipo: "inzoom",
      refinadorId: procesoId,
    });
  });

  test("calcularBadges identifica unfold y expone el objeto refinador", () => {
    const base = modeloConObjeto();
    const objetoId = entidadPorNombre(base, "Sistema").id;
    const refinado = must(desplegarObjeto(base, base.opdRaizId, objetoId, "agregacion"));

    expect(calcularBadges(refinado.modelo, refinado.opdId)).toMatchObject({
      tipo: "unfold",
      refinadorId: objetoId,
    });
  });

  test("calcularBadges cuenta objetos, procesos y enlaces del OPD", () => {
    let modelo = crearModelo("Conteos");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 20 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 20 }, "Procesar"));
    const entrada = entidadPorNombre(modelo, "Entrada").id;
    const procesar = entidadPorNombre(modelo, "Procesar").id;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entrada, procesar, "consumo"));

    expect(calcularBadges(modelo, modelo.opdRaizId)).toMatchObject({
      cuentaObjetos: 1,
      cuentaProcesos: 1,
      cuentaEnlaces: 1,
    });
  });

  test("calcularBadges detecta issues por opdId y destino de navegacion", () => {
    const modelo = crearModelo("Issues");

    expect(calcularBadges(modelo, modelo.opdRaizId, [{ opdId: modelo.opdRaizId }]).tieneIssues).toBe(true);
    expect(calcularBadges(modelo, modelo.opdRaizId, [{ navegarA: { tipo: "opd", id: modelo.opdRaizId } }]).tieneIssues).toBe(true);
  });

  test("calcularBadges resume severidad y primer codigo accionable", () => {
    const modelo = crearModelo("Issues severidad");
    const badges = calcularBadges(modelo, modelo.opdRaizId, [
      { opdId: modelo.opdRaizId, reglaId: "proceso-sin-entrada-ni-salida", severidad: "advertencia" },
      { opdId: modelo.opdRaizId, codigo: "SD_SIN_PROCESO_PRINCIPAL", severidad: "error" },
    ]);

    expect(badges).toMatchObject({
      tieneIssues: true,
      errores: 1,
      advertencias: 1,
      primerAvisoCodigo: "proceso-sin-entrada-ni-salida",
    });
  });

  test("calcularBadges detecta issues de entidad y enlace materializados en el OPD", () => {
    let modelo = crearModelo("Issues entidad enlace");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 20 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 20 }, "Procesar"));
    const entrada = entidadPorNombre(modelo, "Entrada").id;
    const procesar = entidadPorNombre(modelo, "Procesar").id;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entrada, procesar, "consumo"));
    const enlaceId = Object.keys(modelo.enlaces)[0]!;

    expect(calcularBadges(modelo, modelo.opdRaizId, [{ elementoTipo: "entidad", elementoId: entrada }]).tieneIssues).toBe(true);
    expect(calcularBadges(modelo, modelo.opdRaizId, [{ elementoTipo: "enlace", elementoId: enlaceId }]).tieneIssues).toBe(true);
  });

  test("labelTipoBadge usa textos visibles esperados", () => {
    expect(labelTipoBadge("raiz")).toBe("SD");
    expect(labelTipoBadge("inzoom")).toBe("Inzoom");
    expect(labelTipoBadge("unfold")).toBe("Unfold");
  });
});

// W6.3: distinción visual de la vista derivada (kernel E-1 generic-view) en el árbol.
describe("tagVistaOpd — chip de vista derivada", () => {
  test("OPD generic-view editable produce tag Vista sin nota de solo lectura", () => {
    const modelo = crearModelo("Vistas");
    const opd = { ...modelo.opds[modelo.opdRaizId]!, vista: { kind: "generic-view" as const } };

    const tag = tagVistaOpd(opd);
    expect(tag?.label).toBe("Vista");
    expect(tag?.title).toContain("Vista derivada");
    expect(tag?.title).not.toContain("solo lectura");
  });

  test("OPD generic-view readOnly anota solo lectura en el title", () => {
    const modelo = crearModelo("Vistas");
    const opd = { ...modelo.opds[modelo.opdRaizId]!, vista: { kind: "generic-view" as const, readOnly: true } };

    const tag = tagVistaOpd(opd);
    expect(tag?.label).toBe("Vista");
    expect(tag?.title).toContain("solo lectura");
  });

  test("OPD sin vista o con vista de otro kind no produce tag (submodel ya tiene SM)", () => {
    const modelo = crearModelo("Vistas");
    const sinVista = modelo.opds[modelo.opdRaizId]!;
    expect(tagVistaOpd(sinVista)).toBeNull();

    const submodelo = { ...sinVista, vista: { kind: "submodel-view" as const, submodeloRefId: "sm-1", readOnly: true as const, syncState: "cargado-sincronizado" as const } };
    expect(tagVistaOpd(submodelo)).toBeNull();
  });
});

// W6.4: chip de anclas normativas en el árbol — espejo del tag Vista (W6.3).
describe("tagAnclasOpd — chip de anclas normativas del OPD", () => {
  test("OPD con anclas target opd produce chip con cuenta y claves en el title", () => {
    const modelo = crearModelo("Anclas");
    const conAnclas: Modelo = {
      ...modelo,
      anclasNormativas: {
        "an-1": { id: "an-1", claveProto: "ancla:frontera-art17", target: { tipo: "opd", id: modelo.opdRaizId }, estado: "vigente" },
        "an-2": { id: "an-2", claveProto: "ratificar:convenio-ges", target: { tipo: "opd", id: modelo.opdRaizId }, estado: "pendiente-ratificacion" },
      },
    };

    const tag = tagAnclasOpd(conAnclas, modelo.opdRaizId);
    expect(tag?.label).toBe("Anclas 2");
    expect(tag?.title).toContain("ancla:frontera-art17");
    expect(tag?.title).toContain("ratificar:convenio-ges");
  });

  test("anclas de otros targets (modelo/entidad) no producen chip en el OPD", () => {
    const modelo = crearModelo("Anclas otros");
    const conAnclas: Modelo = {
      ...modelo,
      anclasNormativas: {
        "an-1": { id: "an-1", claveProto: "ancla:global", target: { tipo: "modelo" }, estado: "vigente" },
        "an-2": { id: "an-2", claveProto: "ancla:cosa", target: { tipo: "entidad", id: "ent-1" }, estado: "vigente" },
      },
    };

    expect(tagAnclasOpd(conAnclas, modelo.opdRaizId)).toBeNull();
  });

  test("modelo sin extensión de anclas no produce chip", () => {
    const modelo = crearModelo("Sin anclas");
    expect(tagAnclasOpd(modelo, modelo.opdRaizId)).toBeNull();
  });
});

function modeloConProceso(): Modelo {
  let modelo = crearModelo("Proceso");
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Atender"));
  return modelo;
}

function modeloConObjeto(): Modelo {
  let modelo = crearModelo("Objeto");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Sistema"));
  return modelo;
}

function entidadPorNombre(modelo: Modelo, nombre: string): { id: Id } {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
