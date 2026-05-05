import { describe, expect, test } from "bun:test";
import {
  calcularPosicionesRadiales,
  datosAsistenteVacio,
  ETAPA_BENEFICIARIO,
  ETAPA_CONFIRMAR,
  ETAPA_FUNCION,
  ETAPA_HANDLER,
  ETAPA_NOMBRE_SISTEMA,
  LAYOUT_DEFAULT,
  sembrarModeloDesdeAsistente,
  validarDatosAsistente,
  type DatosAsistente,
  type EtapaAsistente,
} from "./creacionWizard";
import { crearModelo } from "./operaciones";
import type { Id, Modelo } from "./tipos";

// ─── Helpers ─────────────────────────────────────────────────────────

function datasetMinimo(): DatosAsistente {
  return {
    funcionPrincipal: "Conducir",
    beneficiario: "Conductor",
    atributo: null,
    beneficiarioEsHandler: true,
    agentesAdicionales: [],
    nombreSistema: "Sistema de Conduccion",
    herramientas: [],
    entradas: [],
    salidas: [],
    ambientales: [],
  };
}

function datasetCompleto(): DatosAsistente {
  return {
    funcionPrincipal: "Procesar Pedidos",
    beneficiario: "Cliente",
    atributo: {
      nombre: "Satisfaccion",
      estadoEntrada: "insatisfecho",
      estadoSalida: "satisfecho",
    },
    beneficiarioEsHandler: false,
    agentesAdicionales: ["Operador", "Supervisor"],
    nombreSistema: "Sistema de Pedidos",
    herramientas: ["Software ERP", "Impresora"],
    entradas: ["Orden", "Pago"],
    salidas: [
      { nombre: "Factura", verbo: "creates" },
      { nombre: "Notificacion", verbo: "affects" },
    ],
    ambientales: ["Software ERP"],
  };
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((e) => e.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(r: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

// ─── Validacion ──────────────────────────────────────────────────────

describe("validarDatosAsistente", () => {
  test("rechaza funcion principal vacia en etapa 1", () => {
    const datos = datosAsistenteVacio();
    datos.funcionPrincipal = "";

    const r = validarDatosAsistente(datos, ETAPA_FUNCION);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("funcion principal");
  });

  test("rechaza funcion principal > 120 chars en etapa 1", () => {
    const datos = datosAsistenteVacio();
    datos.funcionPrincipal = "x".repeat(121);

    const r = validarDatosAsistente(datos, ETAPA_FUNCION);
    expect(r.ok).toBe(false);
  });

  test("acepta funcion principal valida en etapa 1", () => {
    const datos = datosAsistenteVacio();
    datos.funcionPrincipal = "Conducir";

    const r = validarDatosAsistente(datos, ETAPA_FUNCION);
    expect(r.ok).toBe(true);
  });

  test("rechaza beneficiario vacio en etapa 2", () => {
    const datos = datosAsistenteVacio();
    datos.beneficiario = "";

    const r = validarDatosAsistente(datos, ETAPA_BENEFICIARIO);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("beneficiario");
  });

  test("acepta beneficiario valido en etapa 2", () => {
    const datos = datosAsistenteVacio();
    datos.beneficiario = "Conductor";

    const r = validarDatosAsistente(datos, ETAPA_BENEFICIARIO);
    expect(r.ok).toBe(true);
  });

  test("rechaza nombre de sistema vacio en etapa 5", () => {
    const datos = datosAsistenteVacio();
    datos.nombreSistema = "";

    const r = validarDatosAsistente(datos, ETAPA_NOMBRE_SISTEMA);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("nombre del sistema");
  });

  test("acepta nombre de sistema valido en etapa 5", () => {
    const datos = datosAsistenteVacio();
    datos.nombreSistema = "Sistema X";

    const r = validarDatosAsistente(datos, ETAPA_NOMBRE_SISTEMA);
    expect(r.ok).toBe(true);
  });

  test("rechaza handler sin agentes si beneficiario no es handler", () => {
    const datos = datosAsistenteVacio();
    datos.beneficiarioEsHandler = false;
    datos.agentesAdicionales = [];

    const r = validarDatosAsistente(datos, ETAPA_HANDLER);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("handler");
  });

  test("acepta handler con agentes si beneficiario no es handler", () => {
    const datos = datosAsistenteVacio();
    datos.beneficiarioEsHandler = false;
    datos.agentesAdicionales = ["Operador"];

    const r = validarDatosAsistente(datos, ETAPA_HANDLER);
    expect(r.ok).toBe(true);
  });

  test("etapa confirmar valida todos los campos obligatorios", () => {
    const datos = datosAsistenteVacio();

    // Faltan todos los obligatorios
    const r1 = validarDatosAsistente(datos, ETAPA_CONFIRMAR);
    expect(r1.ok).toBe(false);

    // Dataset completo
    const r2 = validarDatosAsistente(datasetMinimo(), ETAPA_CONFIRMAR);
    expect(r2.ok).toBe(true);
  });

  test("etapas opcionales siempre validan ok", () => {
    const etapas: EtapaAsistente[] = [6, 7, 8, 9];
    for (const etapa of etapas) {
      const r = validarDatosAsistente({}, etapa);
      expect(r.ok).toBe(true);
    }
  });
});

// ─── Layout radial ───────────────────────────────────────────────────

describe("calcularPosicionesRadiales", () => {
  test("posicion del proceso es el centro", () => {
    const posiciones = calcularPosicionesRadiales(datasetMinimo());
    const proc = posiciones.get("__proceso__");
    expect(proc).toEqual(LAYOUT_DEFAULT.centro);
  });

  test("beneficiario esta en el anillo interior (radio aprox)", () => {
    const posiciones = calcularPosicionesRadiales(datasetMinimo());
    const ben = posiciones.get("__beneficiario__")!;
    const dx = ben.x - LAYOUT_DEFAULT.centro.x;
    const dy = ben.y - LAYOUT_DEFAULT.centro.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);
    // Debe estar cerca del radio interior (tolerancia de 5px por redondeo)
    expect(Math.abs(distancia - LAYOUT_DEFAULT.radioInterior)).toBeLessThan(5);
  });

  test("mismo input produce mismas coordenadas (determinismo)", () => {
    const datos = datasetCompleto();
    const pos1 = calcularPosicionesRadiales(datos);
    const pos2 = calcularPosicionesRadiales(datos);

    // Comparar todas las posiciones
    for (const [key, val] of pos1) {
      const val2 = pos2.get(key);
      expect(val2).toEqual(val);
    }
    expect(pos1.size).toBe(pos2.size);
  });

  test("posiciones no se solapan dentro de tolerancia minima", () => {
    const datos = datasetCompleto();
    const posiciones = calcularPosicionesRadiales(datos);
    const puntos = Array.from(posiciones.values());

    const tolerancia = 50; // 50px de tolerancia
    for (let i = 0; i < puntos.length; i++) {
      for (let j = i + 1; j < puntos.length; j++) {
        const dx = puntos[i]!.x - puntos[j]!.x;
        const dy = puntos[i]!.y - puntos[j]!.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        expect(dist).toBeGreaterThan(tolerancia);
      }
    }
  });

  test("con dataset completo crea posiciones para todas las categorias", () => {
    const datos = datasetCompleto();
    const pos = calcularPosicionesRadiales(datos);

    expect(pos.has("__proceso__")).toBe(true);
    expect(pos.has("__beneficiario__")).toBe(true);
    expect(pos.has("__atributo__")).toBe(true);
    expect(pos.has("__sistema__")).toBe(true);
    // Agentes: 2
    expect(pos.has("__agente_0")).toBe(true);
    expect(pos.has("__agente_1")).toBe(true);
    // Herramientas: 2
    expect(pos.has("__herr_0")).toBe(true);
    expect(pos.has("__herr_1")).toBe(true);
    // Entradas: 2
    expect(pos.has("__entrada_0")).toBe(true);
    expect(pos.has("__entrada_1")).toBe(true);
    // Salidas: 2
    expect(pos.has("__salida_0")).toBe(true);
    expect(pos.has("__salida_1")).toBe(true);
    // Ambientales: 1
    expect(pos.has("__amb_0")).toBe(true);
  });
});

// ─── Siembra ─────────────────────────────────────────────────────────

describe("sembrarModeloDesdeAsistente", () => {
  test("dataset minimo crea modelo con proceso y beneficiario", () => {
    const datos = datasetMinimo();
    const resultado = sembrarModeloDesdeAsistente(datos);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    const modelo = resultado.value;

    // El modelo tiene nombre del sistema
    expect(modelo.nombre).toBe("Sistema de Conduccion");

    // Debe tener un proceso "Conducir"
    const procesoId = entidadPorNombre(modelo, "Conducir");
    const proceso = modelo.entidades[procesoId];
    expect(proceso).toBeDefined();
    expect(proceso!.tipo).toBe("proceso");

    // Debe tener un objeto "Conductor"
    const conductorId = entidadPorNombre(modelo, "Conductor");
    const conductor = modelo.entidades[conductorId];
    expect(conductor).toBeDefined();
    expect(conductor!.tipo).toBe("objeto");

    // Debe tener enlace agente: Conductor -> Conducir
    const enlaces = Object.values(modelo.enlaces);
    const agente = enlaces.find((e) => e.tipo === "agente");
    expect(agente).toBeDefined();
    expect(agente!.origenId.id).toBe(conductorId);
    expect(agente!.destinoId.id).toBe(procesoId);
  });

  test("dataset minimo tiene sistema con exhibicion e instrumento", () => {
    const datos = datasetMinimo();
    const r = sembrarModeloDesdeAsistente(datos);
    expect(r.ok).toBe(true);
    if (!r.ok) return;

    const modelo = r.value;
    const sistemaId = entidadPorNombre(modelo, "Sistema de Conduccion");
    const procesoId = entidadPorNombre(modelo, "Conducir");

    // Exhibicion: sistema -> proceso
    const exhib = Object.values(modelo.enlaces).find(
      (e) => e.tipo === "exhibicion" && e.origenId.id === sistemaId && e.destinoId.id === procesoId,
    );
    expect(exhib).toBeDefined();

    // Instrumento: sistema -> proceso
    const inst = Object.values(modelo.enlaces).find(
      (e) => e.tipo === "instrumento" && e.origenId.id === sistemaId && e.destinoId.id === procesoId,
    );
    expect(inst).toBeDefined();
  });

  test("dataset completo crea todas las entidades y enlaces esperados", () => {
    const datos = datasetCompleto();
    const r = sembrarModeloDesdeAsistente(datos);
    expect(r.ok).toBe(true);
    if (!r.ok) return;

    const modelo = r.value;

    // Entidades esperadas
    expect(entidadPorNombre(modelo, "Procesar Pedidos")).toBeTruthy();
    expect(entidadPorNombre(modelo, "Cliente")).toBeTruthy();
    expect(entidadPorNombre(modelo, "Satisfaccion")).toBeTruthy();
    expect(entidadPorNombre(modelo, "Sistema de Pedidos")).toBeTruthy();
    expect(entidadPorNombre(modelo, "Operador")).toBeTruthy();
    expect(entidadPorNombre(modelo, "Supervisor")).toBeTruthy();
    expect(entidadPorNombre(modelo, "Software ERP")).toBeTruthy();
    expect(entidadPorNombre(modelo, "Impresora")).toBeTruthy();
    expect(entidadPorNombre(modelo, "Orden")).toBeTruthy();
    expect(entidadPorNombre(modelo, "Pago")).toBeTruthy();
    expect(entidadPorNombre(modelo, "Factura")).toBeTruthy();
    expect(entidadPorNombre(modelo, "Notificacion")).toBeTruthy();

    // Estados del atributo
    const estados = Object.values(modelo.estados).map((e) => e.nombre);
    expect(estados).toContain("insatisfecho");
    expect(estados).toContain("satisfecho");

    // Enlaces: verificar tipos esperados
    const enlaces = Object.values(modelo.enlaces);
    const tipos = enlaces.map((e) => e.tipo);
    expect(tipos).toContain("agente");
    expect(tipos).toContain("exhibicion");
    expect(tipos).toContain("instrumento");
    expect(tipos).toContain("consumo");
    expect(tipos).toContain("resultado");
    expect(tipos).toContain("efecto");

    // Al menos 2 agentes (Operador, Supervisor)
    const agentes = enlaces.filter((e) => e.tipo === "agente").length;
    expect(agentes).toBeGreaterThanOrEqual(2);

    // Al menos 2 consumos (Orden, Pago)
    const consumos = enlaces.filter((e) => e.tipo === "consumo").length;
    expect(consumos).toBeGreaterThanOrEqual(2);

    // Una salida creates -> resultado, una affects -> efecto
    const resultados = enlaces.filter((e) => e.tipo === "resultado").length;
    expect(resultados).toBeGreaterThanOrEqual(1);
    const efectos = enlaces.filter((e) => e.tipo === "efecto").length;
    expect(efectos).toBeGreaterThanOrEqual(1);
  });

  test("ambiental tiene afiliacion correcta", () => {
    const datos = datasetCompleto();
    const r = sembrarModeloDesdeAsistente(datos);
    expect(r.ok).toBe(true);
    if (!r.ok) return;

    const modelo = r.value;
    const erpId = entidadPorNombre(modelo, "Software ERP");
    const erp = modelo.entidades[erpId];
    expect(erp).toBeDefined();
    expect(erp!.afiliacion).toBe("ambiental");
  });

  test("nombre del modelo coincide con nombreSistema", () => {
    const datos = datasetMinimo();
    datos.nombreSistema = "Mi Sistema Personalizado";
    const r = sembrarModeloDesdeAsistente(datos);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.nombre).toBe("Mi Sistema Personalizado");
  });

  test("rechaza siembra con datos incompletos", () => {
    const datos = datosAsistenteVacio();
    const r = sembrarModeloDesdeAsistente(datos);
    expect(r.ok).toBe(false);
  });

  test("nombres duplicados reciben sufijo automatico", () => {
    const datos = datasetMinimo();
    datos.herramientas = ["Motor", "Motor"]; // duplicado

    const r = sembrarModeloDesdeAsistente(datos);
    expect(r.ok).toBe(true);
    if (!r.ok) return;

    const modelo = r.value;
    const entidades = Object.values(modelo.entidades).map((e) => e.nombre);
    expect(entidades).toContain("Motor");
    expect(entidades).toContain("Motor 2");
  });

  test("layout es determinista: mismo input produce mismo SD", () => {
    const datos = datasetCompleto();
    const r1 = sembrarModeloDesdeAsistente(datos);
    const r2 = sembrarModeloDesdeAsistente(datos);

    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    if (!r1.ok || !r2.ok) return;

    // Comparar entidades (nombres e IDs no deterministicos pero estructura si)
    expect(Object.keys(r1.value.entidades).length).toBe(Object.keys(r2.value.entidades).length);
    expect(Object.keys(r1.value.enlaces).length).toBe(Object.keys(r2.value.enlaces).length);

    // Las apariencias deben tener las mismas posiciones
    const ap1 = Object.values(r1.value.opds[r1.value.opdRaizId]!.apariencias);
    const ap2 = Object.values(r2.value.opds[r2.value.opdRaizId]!.apariencias);

    // Ordenar por posicion para comparar
    const ordenar = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      a.y - b.y || a.x - b.x;
    ap1.sort(ordenar);
    ap2.sort(ordenar);

    expect(ap1.length).toBe(ap2.length);
    for (let i = 0; i < ap1.length; i++) {
      expect(ap1[i]!.x).toBe(ap2[i]!.x);
      expect(ap1[i]!.y).toBe(ap2[i]!.y);
    }
  });
});
