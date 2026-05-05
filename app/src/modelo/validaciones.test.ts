import { describe, expect, test } from "bun:test";
import { crearModelo } from "./operaciones";
import type { Apariencia, AparienciaEnlace, Enlace, Entidad, Id, Modelo } from "./tipos";
import type { Aviso } from "./validaciones";
import { validarModelo } from "./validaciones";

describe("validaciones metodologicas pasivas", () => {
  test("modelo limpio retorna lista vacia", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-entrada", "objeto", "Entrada", "informacional"),
        entidad("p-procesar", "proceso", "Procesar", "informacional"),
      ],
      enlaces: [
        enlace("e-consumo", "consumo", "o-entrada", "p-procesar"),
      ],
    });

    expect(validarModelo(modelo, modelo.opdRaizId)).toEqual([]);
  });

  test("agregacion entre objeto fisico e informacional reporta advertencia con cita", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-whole", "objeto", "Motor", "fisica"),
        entidad("o-part", "objeto", "Configuracion", "informacional"),
      ],
      enlaces: [
        enlace("e-agregacion", "agregacion", "o-whole", "o-part"),
      ],
    });

    const avisos = avisosDeRegla(modelo, "agregacion-misma-esencia");

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      reglaId: "agregacion-misma-esencia",
      severidad: "advertencia",
      citaSSOT: "[V-1]",
      elementoTipo: "enlace",
      elementoId: "e-agregacion",
    });
  });

  test("generalizacion objeto a proceso reporta error", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-general", "objeto", "Clase", "informacional"),
        entidad("p-especial", "proceso", "Especializar", "informacional"),
      ],
      enlaces: [
        enlace("e-generalizacion", "generalizacion", "o-general", "p-especial"),
      ],
    });

    const avisos = avisosDeRegla(modelo, "generalizacion-mismo-tipo");

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      reglaId: "generalizacion-mismo-tipo",
      severidad: "error",
      citaSSOT: "[V-239]",
    });
  });

  test("consumo objeto a objeto reporta error procedural", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-entrada", "objeto", "Entrada", "informacional"),
        entidad("o-salida", "objeto", "Salida", "informacional"),
      ],
      enlaces: [
        enlace("e-consumo", "consumo", "o-entrada", "o-salida"),
      ],
    });

    const avisos = validarModelo(modelo, modelo.opdRaizId);

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      reglaId: "procedural-no-objeto-objeto",
      severidad: "error",
      citaSSOT: "[V-239]",
    });
  });

  test("dos agregaciones identicas reportan solo la segunda como duplicada", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-whole", "objeto", "Todo", "informacional"),
        entidad("o-part", "objeto", "Parte", "informacional"),
      ],
      enlaces: [
        enlace("e-agregacion-1", "agregacion", "o-whole", "o-part"),
        enlace("e-agregacion-2", "agregacion", "o-whole", "o-part"),
      ],
    });

    const avisos = validarModelo(modelo, modelo.opdRaizId);

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      reglaId: "estructural-sin-duplicar",
      severidad: "advertencia",
      elementoId: "e-agregacion-2",
    });
  });

  test("subproceso interno enlazado al refinable padre reporta error", () => {
    const modelo = modeloConDescomposicionConEnlaceAlPadre();

    const avisos = validarModelo(modelo, "opd-hijo").filter((aviso) => aviso.reglaId === "subproceso-no-conecta-al-padre");

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      reglaId: "subproceso-no-conecta-al-padre",
      severidad: "error",
      citaSSOT: "[Glos 3.33]",
      opdId: "opd-hijo",
      elementoId: "e-padre-hijo",
    });
  });

  test("agente informacional reporta error con cita SSOT", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-software", "objeto", "Agente software", "informacional"),
        entidad("p-operar", "proceso", "Operar", "informacional"),
      ],
      enlaces: [
        enlace("e-agente", "agente", "o-software", "p-operar"),
      ],
    });

    const avisos = avisosDeRegla(modelo, "agente-requiere-objeto-fisico");

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      severidad: "error",
      citaSSOT: "[Glos 3.3] [Glos 3.39]",
      elementoTipo: "enlace",
      elementoId: "e-agente",
    });
  });

  test("agente fisico no reporta agente-requiere-objeto-fisico", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-operador", "objeto", "Operador", "fisica"),
        entidad("p-operar", "proceso", "Operar", "informacional"),
      ],
      enlaces: [
        enlace("e-agente", "agente", "o-operador", "p-operar"),
      ],
    });

    expect(avisosDeRegla(modelo, "agente-requiere-objeto-fisico")).toHaveLength(0);
  });

  test("instrumento informacional no dispara regla de agente fisico", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-software", "objeto", "Software", "informacional"),
        entidad("p-calcular", "proceso", "Calcular", "informacional"),
      ],
      enlaces: [
        enlace("e-instrumento", "instrumento", "o-software", "p-calcular"),
      ],
    });

    expect(avisosDeRegla(modelo, "agente-requiere-objeto-fisico")).toHaveLength(0);
  });

  test("proceso aislado reporta advertencia sin entrada ni salida", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("p-aislado", "proceso", "Procesar", "informacional"),
      ],
    });

    const avisos = avisosDeRegla(modelo, "proceso-sin-entrada-ni-salida");

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      severidad: "advertencia",
      citaSSOT: "[Glos 3.58] [V-115] [V-239]",
      elementoTipo: "entidad",
      elementoId: "p-aislado",
    });
  });

  test("proceso con enlace operativo no reporta proceso-sin-entrada-ni-salida", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-entrada", "objeto", "Entrada", "informacional"),
        entidad("p-procesar", "proceso", "Procesar", "informacional"),
      ],
      enlaces: [
        enlace("e-consumo", "consumo", "o-entrada", "p-procesar"),
      ],
    });

    expect(avisosDeRegla(modelo, "proceso-sin-entrada-ni-salida")).toHaveLength(0);
  });

  test("proceso refinable descompuesto sin enlaces queda fuera de proceso-sin-entrada-ni-salida", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("p-padre", "proceso", "Atender", "informacional", {
          tipo: "descomposicion",
          opdId: "opd-hijo",
        }),
      ],
    });

    expect(avisosDeRegla(modelo, "proceso-sin-entrada-ni-salida")).toHaveLength(0);
  });

  test("misma entidad como agente e instrumento del mismo proceso reporta advertencia", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-operador", "objeto", "Operador", "fisica"),
        entidad("p-operar", "proceso", "Operar", "informacional"),
      ],
      enlaces: [
        enlace("e-agente", "agente", "o-operador", "p-operar"),
        enlace("e-instrumento", "instrumento", "o-operador", "p-operar"),
      ],
    });

    const avisos = avisosDeRegla(modelo, "instrumento-y-agente-simultaneos");

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      severidad: "advertencia",
      citaSSOT: "[Glos 3.3] [Glos 3.30] [V-239]",
      elementoId: "e-instrumento",
    });
  });

  test("agente e instrumento en procesos distintos no colisionan", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-operador", "objeto", "Operador", "fisica"),
        entidad("p-operar", "proceso", "Operar", "informacional"),
        entidad("p-monitorear", "proceso", "Monitorear", "informacional"),
      ],
      enlaces: [
        enlace("e-agente", "agente", "o-operador", "p-operar"),
        enlace("e-instrumento", "instrumento", "o-operador", "p-monitorear"),
      ],
    });

    expect(avisosDeRegla(modelo, "instrumento-y-agente-simultaneos")).toHaveLength(0);
  });

  test("agentes e instrumentos distintos del mismo proceso no colisionan", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-operador", "objeto", "Operador", "fisica"),
        entidad("o-software", "objeto", "Software", "informacional"),
        entidad("p-operar", "proceso", "Operar", "informacional"),
      ],
      enlaces: [
        enlace("e-agente", "agente", "o-operador", "p-operar"),
        enlace("e-instrumento", "instrumento", "o-software", "p-operar"),
      ],
    });

    expect(avisosDeRegla(modelo, "instrumento-y-agente-simultaneos")).toHaveLength(0);
  });

  test("cadena de clasificacion A a B a C reporta solo-un-nivel-de-instanciacion", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-clase", "objeto", "Clase", "informacional"),
        entidad("o-instancia", "objeto", "Instancia", "informacional"),
        entidad("o-instancia-2", "objeto", "Instancia dos", "informacional"),
      ],
      enlaces: [
        enlace("e-clasificacion-1", "clasificacion", "o-clase", "o-instancia"),
        enlace("e-clasificacion-2", "clasificacion", "o-instancia", "o-instancia-2"),
      ],
    });

    const avisos = avisosDeRegla(modelo, "solo-un-nivel-de-instanciacion");

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      severidad: "advertencia",
      citaSSOT: "[Glos 3.28] [V-239]",
      elementoId: "e-clasificacion-2",
    });
  });

  test("una clase con dos instancias directas no reporta cadena de instanciacion", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-clase", "objeto", "Clase", "informacional"),
        entidad("o-instancia-a", "objeto", "Instancia A", "informacional"),
        entidad("o-instancia-b", "objeto", "Instancia B", "informacional"),
      ],
      enlaces: [
        enlace("e-clasificacion-a", "clasificacion", "o-clase", "o-instancia-a"),
        enlace("e-clasificacion-b", "clasificacion", "o-clase", "o-instancia-b"),
      ],
    });

    expect(avisosDeRegla(modelo, "solo-un-nivel-de-instanciacion")).toHaveLength(0);
  });

  test("generalizacion encadenada no se confunde con clasificacion-instanciacion", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-general", "objeto", "General", "informacional"),
        entidad("o-especial", "objeto", "Especial", "informacional"),
        entidad("o-especial-2", "objeto", "Especial dos", "informacional"),
      ],
      enlaces: [
        enlace("e-generalizacion-1", "generalizacion", "o-general", "o-especial"),
        enlace("e-generalizacion-2", "generalizacion", "o-especial", "o-especial-2"),
      ],
    });

    expect(avisosDeRegla(modelo, "solo-un-nivel-de-instanciacion")).toHaveLength(0);
  });

  test("mismo proceso consume dos veces el mismo objeto y reporta advertencia", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-entrada", "objeto", "Entrada", "informacional"),
        entidad("p-procesar", "proceso", "Procesar", "informacional"),
      ],
      enlaces: [
        enlace("e-consumo-1", "consumo", "o-entrada", "p-procesar"),
        enlace("e-consumo-2", "consumo", "o-entrada", "p-procesar"),
      ],
    });

    const avisos = avisosDeRegla(modelo, "consumo-doble-mismo-objeto");

    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({
      severidad: "advertencia",
      citaSSOT: "[V-43] [V-239]",
      elementoId: "e-consumo-2",
    });
  });

  test("mismo objeto consumido por procesos distintos no es consumo doble", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-entrada", "objeto", "Entrada", "informacional"),
        entidad("p-a", "proceso", "Procesar A", "informacional"),
        entidad("p-b", "proceso", "Procesar B", "informacional"),
      ],
      enlaces: [
        enlace("e-consumo-a", "consumo", "o-entrada", "p-a"),
        enlace("e-consumo-b", "consumo", "o-entrada", "p-b"),
      ],
    });

    expect(avisosDeRegla(modelo, "consumo-doble-mismo-objeto")).toHaveLength(0);
  });

  test("mismo proceso consume objetos distintos sin reportar consumo doble", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-a", "objeto", "Entrada A", "informacional"),
        entidad("o-b", "objeto", "Entrada B", "informacional"),
        entidad("p-procesar", "proceso", "Procesar", "informacional"),
      ],
      enlaces: [
        enlace("e-consumo-a", "consumo", "o-a", "p-procesar"),
        enlace("e-consumo-b", "consumo", "o-b", "p-procesar"),
      ],
    });

    expect(avisosDeRegla(modelo, "consumo-doble-mismo-objeto")).toHaveLength(0);
  });

  test("todos los avisos emitidos declaran cita SSOT no vacia", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-info", "objeto", "Agente software", "informacional"),
        entidad("o-fisico", "objeto", "Operador", "fisica"),
        entidad("p-operar", "proceso", "Operar", "informacional"),
      ],
      enlaces: [
        enlace("e-agente-info", "agente", "o-info", "p-operar"),
        enlace("e-agente", "agente", "o-fisico", "p-operar"),
        enlace("e-instrumento", "instrumento", "o-fisico", "p-operar"),
      ],
    });

    const avisos = validarModelo(modelo, modelo.opdRaizId);

    expect(avisos.length).toBeGreaterThan(0);
    expect(avisos.every((aviso) => aviso.citaSSOT.trim().length > 0)).toBe(true);
  });

  test("combinacion de violaciones conserva todos los avisos", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-fisico", "objeto", "Motor", "fisica"),
        entidad("o-info", "objeto", "Configuracion", "informacional"),
        entidad("o-a", "objeto", "A", "informacional"),
        entidad("o-b", "objeto", "B", "informacional"),
        entidad("p-x", "proceso", "Procesar", "informacional"),
      ],
      enlaces: [
        enlace("e-agregacion", "agregacion", "o-fisico", "o-info"),
        enlace("e-generalizacion", "generalizacion", "o-info", "p-x"),
        enlace("e-consumo", "consumo", "o-a", "o-b"),
        enlace("e-dup-1", "agregacion", "o-a", "o-b"),
        enlace("e-dup-2", "agregacion", "o-a", "o-b"),
        enlace("e-instrumento", "instrumento", "o-fisico", "p-x"),
      ],
    });

    const avisos = validarModelo(modelo, modelo.opdRaizId);

    expect(avisos.map((aviso) => aviso.reglaId)).toEqual([
      "agregacion-misma-esencia",
      "generalizacion-mismo-tipo",
      "procedural-no-objeto-objeto",
      "estructural-sin-duplicar",
    ]);
  });
});

function avisosDeRegla(modelo: Modelo, reglaId: string): Aviso[] {
  return validarModelo(modelo, modelo.opdRaizId).filter((aviso) => aviso.reglaId === reglaId);
}

function modeloCon(params: { entidades: Entidad[]; enlaces?: Enlace[] }): Modelo {
  const base = crearModelo("Modelo validaciones");
  const opdRaiz = base.opds[base.opdRaizId];
  if (!opdRaiz) throw new Error("OPD raiz ausente");
  const enlaces = params.enlaces ?? [];

  return {
    ...base,
    nextSeq: 100,
    entidades: Object.fromEntries(params.entidades.map((item) => [item.id, item])),
    enlaces: Object.fromEntries(enlaces.map((item) => [item.id, item])),
    opds: {
      [base.opdRaizId]: {
        ...opdRaiz,
        apariencias: Object.fromEntries(params.entidades.map((item, index) => [
          `a-${item.id}`,
          apariencia(`a-${item.id}`, item.id, base.opdRaizId, index),
        ])),
        enlaces: Object.fromEntries(enlaces.map((item) => [
          `ae-${item.id}`,
          aparienciaEnlace(`ae-${item.id}`, item.id, base.opdRaizId),
        ])),
      },
    },
  };
}

function modeloConDescomposicionConEnlaceAlPadre(): Modelo {
  const base = crearModelo("Modelo inzoom");
  const opdRaiz = base.opds[base.opdRaizId];
  if (!opdRaiz) throw new Error("OPD raiz ausente");

  const padre = entidad("p-padre", "proceso", "Atender", "informacional", {
    tipo: "descomposicion",
    opdId: "opd-hijo",
  });
  const hijo = entidad("p-hijo", "proceso", "Examinar", "informacional");
  const enlacePadreHijo = enlace("e-padre-hijo", "generalizacion", padre.id, hijo.id);

  return {
    ...base,
    nextSeq: 100,
    entidades: {
      [padre.id]: padre,
      [hijo.id]: hijo,
    },
    enlaces: {
      [enlacePadreHijo.id]: enlacePadreHijo,
    },
    opds: {
      [base.opdRaizId]: {
        ...opdRaiz,
        apariencias: {
          "a-padre-raiz": {
            id: "a-padre-raiz",
            entidadId: padre.id,
            opdId: base.opdRaizId,
            x: 100,
            y: 100,
            width: 135,
            height: 60,
          },
        },
        enlaces: {},
      },
      "opd-hijo": {
        id: "opd-hijo",
        nombre: "SD1",
        padreId: base.opdRaizId,
        apariencias: {
          "a-padre-hijo": {
            id: "a-padre-hijo",
            entidadId: padre.id,
            opdId: "opd-hijo",
            x: 100,
            y: 80,
            width: 420,
            height: 280,
          },
          "a-subproceso": {
            id: "a-subproceso",
            entidadId: hijo.id,
            opdId: "opd-hijo",
            x: 150,
            y: 140,
            width: 135,
            height: 60,
          },
        },
        enlaces: {
          "ae-padre-hijo": aparienciaEnlace("ae-padre-hijo", enlacePadreHijo.id, "opd-hijo"),
        },
      },
    },
  };
}

function entidad(
  id: Id,
  tipo: Entidad["tipo"],
  nombre: string,
  esencia: Entidad["esencia"],
  refinamiento?: Entidad["refinamiento"],
): Entidad {
  return {
    id,
    tipo,
    nombre,
    esencia,
    afiliacion: "sistemica",
    ...(refinamiento ? { refinamiento } : {}),
  };
}

function enlace(id: Id, tipo: Enlace["tipo"], origenId: Id, destinoId: Id): Enlace {
  return {
    id,
    tipo,
    origenId,
    destinoId,
    etiqueta: "",
  };
}

function apariencia(id: Id, entidadId: Id, opdId: Id, index: number): Apariencia {
  return {
    id,
    entidadId,
    opdId,
    x: 40 + index * 180,
    y: 80,
    width: 135,
    height: 60,
  };
}

function aparienciaEnlace(id: Id, enlaceId: Id, opdId: Id): AparienciaEnlace {
  return {
    id,
    enlaceId,
    opdId,
    vertices: [],
  };
}
