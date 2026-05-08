// Tests del clasificador honesto de edición OPL libre. Stack: bun:test.
// Cubre los 5 estados (aplicable, no-aplicable, ignorada-vacia, sin-cambio) +
// resumen + helper de etiqueta del botón Aplicar.
import { describe, expect, test } from "bun:test";
import type { PrevisualizacionOplReverse } from "./parser";
import { clasificarEdicionOpl, etiquetaBotonAplicar } from "./clasificadorEdicion";

const previewVacia: PrevisualizacionOplReverse = { ast: [], diagnosticos: [], patches: [] };

describe("clasificadorEdicion · líneas vacías y básicos", () => {
  test("texto vacío produce 0 líneas y resumen en cero", () => {
    const r = clasificarEdicionOpl("", previewVacia);
    expect(r.lineas.length).toBe(1); // split("") devuelve [""]
    expect(r.lineas[0]!.estado).toBe("ignorada-vacia");
    expect(r.resumen.aplicables).toBe(0);
    expect(r.resumen.noAplicables).toBe(0);
    expect(r.resumen.ignoradas).toBe(1);
    expect(r.resumen.sinCambio).toBe(0);
  });

  test("líneas en blanco se marcan como ignorada-vacia", () => {
    const r = clasificarEdicionOpl("\n   \n\t\n", previewVacia);
    expect(r.lineas.length).toBe(4);
    for (const linea of r.lineas) expect(linea.estado).toBe("ignorada-vacia");
    expect(r.resumen.ignoradas).toBe(4);
  });
});

describe("clasificadorEdicion · estado aplicable", () => {
  test("línea con un patch propuesto → aplicable con cambioId 0 y descripción", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [],
      patches: [
        { tipo: "renombrar-entidad", linea: 1, entidadId: "e1", anterior: "Entrada", siguiente: "Cliente" },
      ],
    };
    const r = clasificarEdicionOpl("Cliente es un objeto.", preview);
    expect(r.lineas[0]!.estado).toBe("aplicable");
    expect(r.lineas[0]!.cambioId).toBe(0);
    expect(r.lineas[0]!.descripcionCambio).toContain("renombrar Entrada -> Cliente");
    expect(r.resumen.aplicables).toBe(1);
  });

  test("varias líneas con patches: cada una aplicable con su descripción", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [],
      patches: [
        { tipo: "renombrar-entidad", linea: 1, entidadId: "e1", anterior: "A", siguiente: "B" },
        { tipo: "crear-entidad", linea: 2, nombre: "Servicio", entidadTipo: "proceso", esencia: "informacional", afiliacion: "sistemica" },
      ],
    };
    const r = clasificarEdicionOpl("B es un objeto.\nServicio es un proceso.", preview);
    expect(r.lineas[0]!.estado).toBe("aplicable");
    expect(r.lineas[1]!.estado).toBe("aplicable");
    expect(r.resumen.aplicables).toBe(2);
  });

  test("línea con dos patches en la misma linea concatena descripciones", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [],
      patches: [
        { tipo: "renombrar-entidad", linea: 1, entidadId: "e1", anterior: "A", siguiente: "B" },
        { tipo: "cambiar-esencia", linea: 1, entidadId: "e1", anterior: "fisica", siguiente: "informacional" },
      ],
    };
    const r = clasificarEdicionOpl("B es un objeto informacional.", preview);
    expect(r.lineas[0]!.estado).toBe("aplicable");
    expect(r.lineas[0]!.descripcionCambio).toContain("renombrar A -> B");
    expect(r.lineas[0]!.descripcionCambio).toContain("esencia");
    expect(r.resumen.aplicables).toBe(1);
  });
});

describe("clasificadorEdicion · estado no-aplicable", () => {
  test("syntax-error sin punto → razón puntuacion-faltante", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [
        { codigo: "syntax-error", severidad: "error", linea: 1, columna: 1, mensaje: "La oracion OPL-ES debe terminar en punto." },
      ],
      patches: [],
    };
    const r = clasificarEdicionOpl("Cliente es un objeto", preview);
    expect(r.lineas[0]!.estado).toBe("no-aplicable");
    expect(r.lineas[0]!.razon?.codigo).toBe("puntuacion-faltante");
    expect(r.lineas[0]!.razon?.citaSsot).toContain("OPL-ES");
  });

  test("syntax-error genérico → razón forma-no-reconocida", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [
        { codigo: "syntax-error", severidad: "error", linea: 1, columna: 1, mensaje: "La oracion OPL-ES no calza con ninguna sentencia canonica." },
      ],
      patches: [],
    };
    const r = clasificarEdicionOpl("hola mundo.", preview);
    expect(r.lineas[0]!.estado).toBe("no-aplicable");
    expect(r.lineas[0]!.razon?.codigo).toBe("forma-no-reconocida");
  });

  test("unknown-symbol → razón entidad-no-existe", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [
        { codigo: "unknown-symbol", severidad: "error", linea: 1, columna: 1, mensaje: "No existe 'Marciano'." },
      ],
      patches: [],
    };
    const r = clasificarEdicionOpl("Marciano consume Espacio.", preview);
    expect(r.lineas[0]!.estado).toBe("no-aplicable");
    expect(r.lineas[0]!.razon?.codigo).toBe("entidad-no-existe");
    expect(r.lineas[0]!.razon?.citaSsot).toContain("3.55");
  });

  test("ambiguous-symbol → razón referencia-ambigua", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [
        { codigo: "ambiguous-symbol", severidad: "error", linea: 1, columna: 1, mensaje: "Ambiguo" },
      ],
      patches: [],
    };
    const r = clasificarEdicionOpl("Cliente es un objeto.", preview);
    expect(r.lineas[0]!.razon?.codigo).toBe("referencia-ambigua");
  });

  test("patch-conflict → razón conflicto-patches", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [
        { codigo: "patch-conflict", severidad: "error", linea: 2, columna: 1, mensaje: "Conflicto" },
      ],
      patches: [],
    };
    const r = clasificarEdicionOpl("ok.\nconflicto.", preview);
    expect(r.lineas[1]!.estado).toBe("no-aplicable");
    expect(r.lineas[1]!.razon?.codigo).toBe("conflicto-patches");
  });
});

describe("clasificadorEdicion · estado sin-cambio", () => {
  test("línea reconocida que no muta el modelo → sin-cambio", () => {
    // Línea 1 sin patch, sin error de severidad error: el parser la entendió
    // pero el modelo ya está consistente.
    const r = clasificarEdicionOpl("Entrada es un objeto.", previewVacia);
    expect(r.lineas[0]!.estado).toBe("sin-cambio");
    expect(r.resumen.sinCambio).toBe(1);
  });

  test("warning no-delete-by-absence (info) no marca como no-aplicable", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [
        { codigo: "no-delete-by-absence", severidad: "info", linea: 2, columna: 1, mensaje: "info" },
      ],
      patches: [],
    };
    const r = clasificarEdicionOpl("Entrada es un objeto.\n", preview);
    // Línea 2 está vacía → ignorada
    expect(r.lineas[1]!.estado).toBe("ignorada-vacia");
  });
});

describe("clasificadorEdicion · resumen agregado", () => {
  test("cuenta total/aplicables/no-aplicables/ignoradas/sinCambio correctamente", () => {
    const preview: PrevisualizacionOplReverse = {
      ast: [],
      diagnosticos: [
        { codigo: "syntax-error", severidad: "error", linea: 4, columna: 1, mensaje: "La oracion OPL-ES debe terminar en punto." },
      ],
      patches: [
        { tipo: "renombrar-entidad", linea: 1, entidadId: "e1", anterior: "A", siguiente: "B" },
        { tipo: "crear-entidad", linea: 2, nombre: "X", entidadTipo: "objeto", esencia: "informacional", afiliacion: "sistemica" },
      ],
    };
    // Línea 1 aplicable, 2 aplicable, 3 sin-cambio, 4 no-aplicable, 5 vacía
    const texto = [
      "B es un objeto.",
      "X es un objeto.",
      "Entrada es un objeto.",
      "basura sin punto",
      "",
    ].join("\n");
    const r = clasificarEdicionOpl(texto, preview);
    expect(r.resumen.total).toBe(5);
    expect(r.resumen.aplicables).toBe(2);
    expect(r.resumen.noAplicables).toBe(1);
    expect(r.resumen.ignoradas).toBe(1);
    expect(r.resumen.sinCambio).toBe(1);
  });
});

describe("etiquetaBotonAplicar", () => {
  test("0 aplicables → 'Sin cambios aplicables'", () => {
    expect(etiquetaBotonAplicar(0)).toBe("Sin cambios aplicables");
    expect(etiquetaBotonAplicar(-1)).toBe("Sin cambios aplicables");
  });

  test("1 aplicable → singular", () => {
    expect(etiquetaBotonAplicar(1)).toBe("Aplicar 1 cambio");
  });

  test("N>1 → plural", () => {
    expect(etiquetaBotonAplicar(3)).toBe("Aplicar 3 cambios");
    expect(etiquetaBotonAplicar(135)).toBe("Aplicar 135 cambios");
  });
});
