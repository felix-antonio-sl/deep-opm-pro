import { describe, expect, test } from "bun:test";
import {
  checkInzoomContenido,
  checkObjetoNombreSingular,
  checkProcesoNombreFormaVerbal,
  checkProcesoSistemicoConectado,
  checkProcesoTransforma,
  checkUnfoldContenido,
  verificarMetodologia,
} from "./checkers";
import { crearCafetera, fixtureTodos } from "./fixtures";
import {
  cambiarAfiliacion,
  cambiarEsencia,
  crearEnlace,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
  desplegarObjeto,
} from "./operaciones";
import type { Id, Modelo, Resultado } from "./tipos";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function modeloConProceso(nombre: string): Modelo {
  return must(crearProceso(crearModelo("Proceso"), "opd-1", { x: 100, y: 100 }, nombre));
}

function modeloConObjeto(nombre: string): Modelo {
  return must(crearObjeto(crearModelo("Objeto"), "opd-1", { x: 100, y: 100 }, nombre));
}

function modeloTransformador(nombreProceso = "Procesar"): { modelo: Modelo; procesoId: Id } {
  let modelo = crearModelo("Transformador");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Entrada"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 160 }, nombreProceso));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 450, y: 250 }, "Salida"));
  const entrada = entidadPorNombre(modelo, "Entrada");
  const procesoId = entidadPorNombre(modelo, nombreProceso);
  const salida = entidadPorNombre(modelo, "Salida");
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entrada, procesoId, "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesoId, salida, "resultado"));
  return { modelo, procesoId };
}

function dejarCosasEnRefinamiento(modelo: Modelo, entidadId: Id, cantidad: number): Modelo {
  const entidad = modelo.entidades[entidadId];
  const opdId = entidad?.refinamientos?.descomposicion?.opdId;
  const opd = opdId ? modelo.opds[opdId] : undefined;
  if (!opd) throw new Error("Sin OPD de refinamiento");
  const mantener = new Set(
    Object.values(opd.apariencias)
      .filter((apariencia) => apariencia.entidadId !== entidadId)
      .slice(0, cantidad)
      .map((apariencia) => apariencia.id),
  );
  return {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opd.id]: {
        ...opd,
        apariencias: Object.fromEntries(Object.entries(opd.apariencias).filter(([id, apariencia]) => (
          apariencia.entidadId === entidadId || mantener.has(id)
        ))),
      },
    },
  };
}

function dejarEnlacesEnRefinamiento(modelo: Modelo, entidadId: Id, cantidad: number): Modelo {
  const entidad = modelo.entidades[entidadId];
  const opdId = entidad?.refinamientos?.despliegue?.opdId;
  const opd = opdId ? modelo.opds[opdId] : undefined;
  if (!opd) throw new Error("Sin OPD de refinamiento");
  const mantener = new Set(Object.entries(opd.enlaces).slice(0, cantidad).map(([id]) => id));
  return {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opd.id]: {
        ...opd,
        enlaces: Object.fromEntries(Object.entries(opd.enlaces).filter(([id]) => mantener.has(id))),
      },
    },
  };
}

describe("checkProcesoNombreFormaVerbal", () => {
  const validos = [
    "Procesar", "Hacer Cafe", "Diagnosticar", "Inspeccionar", "Entregar Valor",
    "Recibir Pedido", "Preparar Paquete", "Enviar Paquete", "Analizar Necesidad",
    "Disenar Solucion", "Validar Entrega", "Produccion", "Producción", "Montaje",
    "Mantenimiento", "Normalizar", "Driver Rescuing", "Main System Doing",
    "First Processing", "Planificacion", "Operacion", "Gestión", "Sincronizacion",
    "Convertir", "Mover", "Abrir", "Cerrar", "Persistir", "Clasificacion", "Aterrizaje",
  ];
  const invalidos = [
    "Proceso", "Sistema", "Cliente", "ABC", "Control", "Mesa", "Orden",
    "Producto Listo", "Cafe Hecho", "Estado", "Calidad", "Asesor", "Sistema Clinico",
    "Output", "Input", "Paquete", "Pedido", "Logistica", "Servicio", "Valor",
  ];

  for (const nombre of validos) {
    test(`acepta proceso "${nombre}"`, () => {
      expect(checkProcesoNombreFormaVerbal(modeloConProceso(nombre))).toHaveLength(0);
    });
  }

  for (const nombre of invalidos) {
    test(`avisa proceso no verbal "${nombre}"`, () => {
      expect(checkProcesoNombreFormaVerbal(modeloConProceso(nombre))[0]?.codigo).toBe("PROCESO_NOMBRE_FORMA_VERBAL");
    });
  }
});

describe("checkObjetoNombreSingular", () => {
  const validos = [
    "Cliente", "Persona", "Cafe Molido", "Agua", "Cafetera", "Cafe Hecho",
    "Analisis", "Análisis", "Crisis", "Tesis", "Gas", "GPS", "VCIM",
    "OnStar System", "Cellular Network", "Sistema Clinico", "Producto",
    "Inspector", "Estandar de Calidad", "Agente IA", "Necesidad",
    "Servicio", "Aprendizaje", "System Tool Set", "Main Output", "Beneficiary Group",
  ];
  const invalidos = [
    "Clientes", "Procesos", "Objetos", "Datos", "Pedidos", "Productos", "Servicios",
    "Personas", "Partes", "Atributos", "Estados", "Sistemas", "Entradas", "Salidas",
    "Herramientas", "Usuarios", "Modelos", "Enlaces", "Cafeteras", "Diagnosticos",
  ];

  for (const nombre of validos) {
    test(`acepta objeto singular "${nombre}"`, () => {
      expect(checkObjetoNombreSingular(modeloConObjeto(nombre))).toHaveLength(0);
    });
  }

  for (const nombre of invalidos) {
    test(`avisa objeto plural "${nombre}"`, () => {
      expect(checkObjetoNombreSingular(modeloConObjeto(nombre))[0]?.codigo).toBe("OBJETO_NOMBRE_SINGULAR");
    });
  }
});

describe("checkInzoomContenido", () => {
  for (const cantidad of [0, 1]) {
    test(`avisa descomposicion con ${cantidad} cosa(s)`, () => {
      const base = modeloTransformador("Procesar Envio");
      const descompuesto = must(descomponerProceso(base.modelo, base.modelo.opdRaizId, base.procesoId));
      const modelo = dejarCosasEnRefinamiento(descompuesto.modelo, base.procesoId, cantidad);
      expect(checkInzoomContenido(modelo)[0]?.codigo).toBe("INZOOM_CONTENIDO_INSUFICIENTE");
    });
  }

  for (const cantidad of [2, 3, 4, 5, 6, 7, 8, 9]) {
    test(`acepta descomposicion con ${cantidad} cosas`, () => {
      const base = modeloTransformador("Procesar Envio");
      const descompuesto = must(descomponerProceso(base.modelo, base.modelo.opdRaizId, base.procesoId));
      const modelo = dejarCosasEnRefinamiento(descompuesto.modelo, base.procesoId, cantidad);
      expect(checkInzoomContenido(modelo)).toHaveLength(0);
    });
  }
});

describe("checkUnfoldContenido", () => {
  for (const cantidad of [0, 1]) {
    test(`avisa despliegue con ${cantidad} refinador(es) estructurales`, () => {
      let modelo = modeloConObjeto("Sistema");
      const sistema = entidadPorNombre(modelo, "Sistema");
      modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, sistema)).modelo;
      modelo = dejarEnlacesEnRefinamiento(modelo, sistema, cantidad);
      expect(checkUnfoldContenido(modelo)[0]?.codigo).toBe("UNFOLD_CONTENIDO_INSUFICIENTE");
    });
  }

  for (const cantidad of [2, 3]) {
    for (const modo of ["agregacion", "exhibicion", "generalizacion", "clasificacion"] as const) {
      test(`acepta despliegue ${modo} con ${cantidad} enlaces`, () => {
        let modelo = modeloConObjeto("Sistema");
        const sistema = entidadPorNombre(modelo, "Sistema");
        modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, sistema, modo)).modelo;
        modelo = dejarEnlacesEnRefinamiento(modelo, sistema, cantidad);
        expect(checkUnfoldContenido(modelo)).toHaveLength(0);
      });
    }
  }
});

describe("checkProcesoTransforma", () => {
  for (const tipo of ["consumo", "resultado", "efecto"] as const) {
    test(`acepta proceso con enlace ${tipo}`, () => {
      let modelo = crearModelo("Transforma");
      modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Objeto"));
      modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 160 }, "Procesar"));
      const objetoId = entidadPorNombre(modelo, "Objeto");
      const procesoId = entidadPorNombre(modelo, "Procesar");
      modelo = tipo === "resultado"
        ? must(crearEnlace(modelo, modelo.opdRaizId, procesoId, objetoId, tipo))
        : must(crearEnlace(modelo, modelo.opdRaizId, objetoId, procesoId, tipo));
      expect(checkProcesoTransforma(modelo)).toHaveLength(0);
    });
  }

  for (const tipo of ["agente", "instrumento", "invocacion"] as const) {
    test(`avisa proceso solo con enlace ${tipo}`, () => {
      let modelo = crearModelo("No transforma");
      modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Objeto"));
      modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 160 }, "Procesar"));
      const objetoId = entidadPorNombre(modelo, "Objeto");
      const procesoId = entidadPorNombre(modelo, "Procesar");
      modelo = must(cambiarEsencia(modelo, objetoId, "fisica"));
      if (tipo === "invocacion") {
        modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 420, y: 160 }, "Validar"));
        modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesoId, entidadPorNombre(modelo, "Validar"), tipo));
      } else {
        modelo = must(crearEnlace(modelo, modelo.opdRaizId, objetoId, procesoId, tipo));
      }
      expect(checkProcesoTransforma(modelo).map((aviso) => aviso.codigo)).toContain("PROCESO_NO_TRANSFORMA");
    });
  }

  for (const nombre of ["Proceso", "Revisar", "Mantener", "Esperar", "Coordinar", "Aprobar", "Enviar"]) {
    test(`avisa proceso sin transformador "${nombre}"`, () => {
      expect(checkProcesoTransforma(modeloConProceso(nombre))[0]?.codigo).toBe("PROCESO_NO_TRANSFORMA");
    });
  }

  test("acepta proceso padre si algun hijo transforma", () => {
    const base = modeloTransformador("Procesar Pedido");
    let modelo = must(descomponerProceso(base.modelo, base.modelo.opdRaizId, base.procesoId)).modelo;
    const opdHijoId = modelo.entidades[base.procesoId]?.refinamientos?.descomposicion?.opdId ?? "";
    const hijo = Object.values(modelo.entidades).find((entidad) => entidad.tipo === "proceso" && entidad.id !== base.procesoId && Object.values(modelo.opds[opdHijoId]?.apariencias ?? {}).some((apariencia) => apariencia.entidadId === entidad.id));
    if (!hijo) throw new Error("Sin hijo");
    modelo = must(crearObjeto(modelo, opdHijoId, { x: 520, y: 160 }, "Objeto Interno"));
    modelo = must(crearEnlace(modelo, opdHijoId, hijo.id, entidadPorNombre(modelo, "Objeto Interno"), "resultado"));
    expect(checkProcesoTransforma(modelo).some((aviso) => aviso.entidadId === base.procesoId)).toBe(false);
  });
});

describe("checkProcesoSistemicoConectado", () => {
  test("acepta un unico proceso sistemico transformador en SD", () => {
    expect(checkProcesoSistemicoConectado(modeloTransformador("Procesar").modelo)).toHaveLength(0);
  });

  test("avisa proceso sistemico aislado", () => {
    let modelo = modeloTransformador("Procesar").modelo;
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 560, y: 160 }, "Auditar"));
    expect(checkProcesoSistemicoConectado(modelo).map((aviso) => aviso.entidadId)).toContain(entidadPorNombre(modelo, "Auditar"));
  });

  test("ignora proceso ambiental aislado", () => {
    let modelo = modeloTransformador("Procesar").modelo;
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 560, y: 160 }, "Auditar"));
    const auditar = entidadPorNombre(modelo, "Auditar");
    modelo = must(cambiarAfiliacion(modelo, auditar, "ambiental"));
    expect(checkProcesoSistemicoConectado(modelo)).toHaveLength(0);
  });

  test("acepta proceso conectado por cadena estructural con agregacion entre objetos", () => {
    let modelo = modeloTransformador("Procesar").modelo;
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 520, y: 80 }, "Modulo A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 680, y: 80 }, "Modulo B"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 680, y: 180 }, "Auditar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Modulo A"), entidadPorNombre(modelo, "Procesar"), "exhibicion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Modulo A"), entidadPorNombre(modelo, "Modulo B"), "agregacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Modulo B"), entidadPorNombre(modelo, "Auditar"), "exhibicion"));
    expect(checkProcesoSistemicoConectado(modelo)).toHaveLength(0);
  });

  for (const tipo of ["exhibicion", "generalizacion", "clasificacion"] as const) {
    test(`acepta proceso conectado por ${tipo}`, () => {
      let modelo = modeloTransformador("Procesar").modelo;
      modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 560, y: 160 }, "Auditar"));
      modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Procesar"), entidadPorNombre(modelo, "Auditar"), tipo));
      expect(checkProcesoSistemicoConectado(modelo)).toHaveLength(0);
    });
  }

  for (const nombre of ["Auditar", "Coordinar", "Monitorear", "Mantener", "Validar", "Reportar", "Preparar", "Publicar"]) {
    test(`detecta desconexion sistemica de ${nombre}`, () => {
      let modelo = modeloTransformador("Procesar").modelo;
      modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 560, y: 160 }, nombre));
      expect(checkProcesoSistemicoConectado(modelo)[0]?.codigo).toBe("PROCESO_SISTEMICO_DESCONECTADO");
    });
  }
});

describe("verificarMetodologia", () => {
  test("Cafetera Domestica canonica no produce avisos metodologicos", () => {
    expect(verificarMetodologia(crearCafetera().modelo)).toEqual([]);
  });

  test("modelo invalido conserva avisos de todos los dominios", () => {
    let modelo = crearModelo("Invalido");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Clientes"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 160 }, "Proceso"));
    const codigos = verificarMetodologia(modelo).map((aviso) => aviso.codigo);
    expect(codigos).toContain("OBJETO_NOMBRE_SINGULAR");
    expect(codigos).toContain("PROCESO_NOMBRE_FORMA_VERBAL");
    expect(codigos).toContain("PROCESO_NO_TRANSFORMA");
  });

  for (const fixture of fixtureTodos()) {
    test(`fixture ${fixture.modelo.nombre} ejecuta checkers sin excepcion`, () => {
      expect(Array.isArray(verificarMetodologia(fixture.modelo))).toBe(true);
    });
  }

  test("todos los avisos declaran rationale SSOT", () => {
    let modelo = crearModelo("Rationale");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Datos"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 160 }, "Proceso"));
    expect(verificarMetodologia(modelo).every((aviso) => aviso.rationale && aviso.rationale.length > 0)).toBe(true);
  });

  test("AvisoMetodologico no se agrega al JSON del modelo", () => {
    const modelo = modeloTransformador("Procesar").modelo;
    verificarMetodologia(modelo);
    expect(JSON.stringify(modelo)).not.toContain("AvisoMetodologico");
  });
});
