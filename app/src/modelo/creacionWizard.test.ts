// Unit tests del kernel del asistente tras la poda 9→3 (ronda 23 L3 #6).
//
// El wizard ahora captura solo `funcionPrincipal` y `beneficiario`; el SD
// sembrado es mínimo (proceso central + beneficiario físico + objeto
// sistema con exhibición e instrumento). El resto se modela en el inspector.
import { describe, expect, test } from "bun:test";
import {
  calcularPosicionesRadiales,
  datosAsistenteVacio,
  ETAPA_BENEFICIARIO,
  ETAPA_FUNCION,
  ETAPA_SEMBRAR,
  LAYOUT_DEFAULT,
  NOMBRE_SISTEMA_DEFAULT,
  sembrarModeloDesdeAsistente,
  TOTAL_ETAPAS,
  validarDatosAsistente,
  type DatosAsistente,
} from "./creacionWizard";
import type { Id, Modelo } from "./tipos";

// ─── Helpers ─────────────────────────────────────────────────────────

function datasetValido(): DatosAsistente {
  return {
    funcionPrincipal: "Conducir",
    beneficiario: "Conductor",
  };
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((e) => e.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

// ─── Validación ──────────────────────────────────────────────────────

describe("validarDatosAsistente", () => {
  test("rechaza función principal vacía", () => {
    const datos = datosAsistenteVacio();
    const r = validarDatosAsistente(datos, ETAPA_FUNCION);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("función principal");
  });

  test("rechaza función principal mayor a 120 caracteres", () => {
    const datos = datosAsistenteVacio();
    datos.funcionPrincipal = "x".repeat(121);
    const r = validarDatosAsistente(datos, ETAPA_FUNCION);
    expect(r.ok).toBe(false);
  });

  test("acepta función principal válida", () => {
    const datos = datosAsistenteVacio();
    datos.funcionPrincipal = "Conducir";
    const r = validarDatosAsistente(datos, ETAPA_FUNCION);
    expect(r.ok).toBe(true);
  });

  test("rechaza beneficiario vacío", () => {
    const datos = datosAsistenteVacio();
    const r = validarDatosAsistente(datos, ETAPA_BENEFICIARIO);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("beneficiario");
  });

  test("acepta beneficiario válido", () => {
    const datos = datosAsistenteVacio();
    datos.beneficiario = "Conductor";
    const r = validarDatosAsistente(datos, ETAPA_BENEFICIARIO);
    expect(r.ok).toBe(true);
  });

  test("etapa sembrar exige los dos campos obligatorios", () => {
    const vacios = datosAsistenteVacio();
    const r1 = validarDatosAsistente(vacios, ETAPA_SEMBRAR);
    expect(r1.ok).toBe(false);

    const r2 = validarDatosAsistente(datasetValido(), ETAPA_SEMBRAR);
    expect(r2.ok).toBe(true);
  });

  test("expone exactamente 3 etapas", () => {
    expect(TOTAL_ETAPAS).toBe(3);
    expect(ETAPA_FUNCION).toBe(0);
    expect(ETAPA_BENEFICIARIO).toBe(1);
    expect(ETAPA_SEMBRAR).toBe(2);
  });
});

// ─── Layout radial ───────────────────────────────────────────────────

describe("calcularPosicionesRadiales", () => {
  test("posición del proceso es el centro", () => {
    const posiciones = calcularPosicionesRadiales(datasetValido());
    expect(posiciones.get("__proceso__")).toEqual(LAYOUT_DEFAULT.centro);
  });

  test("beneficiario y sistema viven en el anillo interior", () => {
    const posiciones = calcularPosicionesRadiales(datasetValido());
    for (const clave of ["__beneficiario__", "__sistema__"] as const) {
      const p = posiciones.get(clave)!;
      const dx = p.x - LAYOUT_DEFAULT.centro.x;
      const dy = p.y - LAYOUT_DEFAULT.centro.y;
      const distancia = Math.sqrt(dx * dx + dy * dy);
      expect(Math.abs(distancia - LAYOUT_DEFAULT.radioInterior)).toBeLessThan(5);
    }
  });

  test("mismo input produce mismas coordenadas (determinismo)", () => {
    const datos = datasetValido();
    const pos1 = calcularPosicionesRadiales(datos);
    const pos2 = calcularPosicionesRadiales(datos);
    for (const [key, val] of pos1) {
      expect(pos2.get(key)).toEqual(val);
    }
    expect(pos1.size).toBe(pos2.size);
  });
});

// ─── Siembra ─────────────────────────────────────────────────────────

describe("sembrarModeloDesdeAsistente", () => {
  test("dataset mínimo crea modelo con proceso, beneficiario y sistema", () => {
    const datos = datasetValido();
    const resultado = sembrarModeloDesdeAsistente(datos);
    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    const modelo = resultado.value;

    expect(modelo.nombre).toBe(NOMBRE_SISTEMA_DEFAULT);

    const procesoId = entidadPorNombre(modelo, "Conducir");
    const proceso = modelo.entidades[procesoId];
    expect(proceso?.tipo).toBe("proceso");

    const conductorId = entidadPorNombre(modelo, "Conductor");
    const conductor = modelo.entidades[conductorId];
    expect(conductor?.tipo).toBe("objeto");
    expect(conductor?.esencia).toBe("fisica");

    const sistemaId = entidadPorNombre(modelo, NOMBRE_SISTEMA_DEFAULT);
    expect(modelo.entidades[sistemaId]?.tipo).toBe("objeto");

    const enlaces = Object.values(modelo.enlaces);
    const agente = enlaces.find((e) => e.tipo === "agente");
    expect(agente).toBeDefined();
    expect(agente!.origenId.id).toBe(conductorId);
    expect(agente!.destinoId.id).toBe(procesoId);

    const exhib = enlaces.find((e) => e.tipo === "exhibicion" && e.origenId.id === sistemaId);
    expect(exhib).toBeDefined();
    const inst = enlaces.find((e) => e.tipo === "instrumento" && e.origenId.id === sistemaId);
    expect(inst).toBeDefined();
  });

  test("rechaza siembra con datos incompletos", () => {
    const datos = datosAsistenteVacio();
    const r = sembrarModeloDesdeAsistente(datos);
    expect(r.ok).toBe(false);
  });

  test("nombre por defecto del sistema cuando no hay personalización", () => {
    const datos = datasetValido();
    const r = sembrarModeloDesdeAsistente(datos);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.nombre).toBe(NOMBRE_SISTEMA_DEFAULT);
  });

  test("layout es determinista: mismo input produce mismo SD", () => {
    const datos = datasetValido();
    const r1 = sembrarModeloDesdeAsistente(datos);
    const r2 = sembrarModeloDesdeAsistente(datos);
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    if (!r1.ok || !r2.ok) return;

    expect(Object.keys(r1.value.entidades).length).toBe(Object.keys(r2.value.entidades).length);
    expect(Object.keys(r1.value.enlaces).length).toBe(Object.keys(r2.value.enlaces).length);

    const ap1 = Object.values(r1.value.opds[r1.value.opdRaizId]!.apariencias);
    const ap2 = Object.values(r2.value.opds[r2.value.opdRaizId]!.apariencias);
    const ordenar = (a: { x: number; y: number }, b: { x: number; y: number }) => a.y - b.y || a.x - b.x;
    ap1.sort(ordenar);
    ap2.sort(ordenar);
    expect(ap1.length).toBe(ap2.length);
    for (let i = 0; i < ap1.length; i++) {
      expect(ap1[i]!.x).toBe(ap2[i]!.x);
      expect(ap1[i]!.y).toBe(ap2[i]!.y);
    }
  });
});
