import { describe, expect, test } from "bun:test";
import {
  checkDescomposicionSinSubprocesos,
  checkInvocacionRedundanteConOrden,
  checkInzoomContenido,
  checkInzoomNombresPlaceholderHijos,
  checkObjetoAmbientalSinContornoDiscontinuo,
  checkObjetoNombreSingular,
  checkProcesoNombreFormaVerbal,
  checkProcesoSistemicoConectado,
  checkProbabilidadFueraDeAbanico,
  checkProcesoTransforma,
  checkSdSinProcesoPrincipal,
  checkUnfoldContenido,
  verificarMetodologia,
} from "./checkers";
import { definirProbabilidadesAbanico, formarAbanico } from "./abanicos";
import { aplicarModificador, definirProbabilidad } from "./modificadores";
import { crearSystemDiagramFixture, fixtureTodos } from "./fixtures";
import {
  cambiarAfiliacion,
  cambiarEsencia,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
  desplegarObjeto,
  renombrarEntidad,
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
    // B-6 (calibracion es-CL): nominalizaciones deverbales de dominio, con la
    // cabeza deverbal en posicion inicial del compuesto.
    "Ingreso HODOM", "Cierre del episodio HODOM", "Apertura del episodio HODOM",
    "Transporte de medicamento al domicilio", "Vigilancia de eventos adversos",
    "Retiro de residuos clínicos", "Toma de muestra", "Ajuste terapéutico",
    "Monitoreo del censo", "Despacho de recursos", "Traslado del paciente a examen",
    "Estudio diagnóstico", "Registro del formulario de ingreso",
    "Interconsulta de especialidad", "Recarga de oxígeno", "Entrega en domicilio",
    "Respuesta clínica al emergente", "Retorno de equipamiento médico", "Turnado",
    // S2 (solicitud upstream skill 2026-06-11): familia deverbal en -e átona.
    "Despliegue", "Despliegue a runtime", "Repliegue de equipos", "Desagüe del estanque",
    "Deslinde de responsabilidades", "Embarque de insumos",
  ];
  const invalidos = [
    "Proceso", "Sistema", "Cliente", "ABC", "Control", "Mesa", "Orden",
    "Producto Listo", "Cafe Hecho", "Estado", "Calidad", "Asesor", "Sistema Clinico",
    "Output", "Input", "Paquete", "Pedido", "Logistica", "Servicio", "Valor",
    // B-6 guarda adversarial: cabeza no-deverbal + complemento no-verbal sigue acusada.
    "Producto de calidad",
    // S2 guarda adversarial: sustantivos en -e que NO son deverbales siguen acusados.
    "Parque", "Bosque nativo",
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
    // B-6 (calibracion es-CL): compuestos con cabeza singular + complemento
    // preposicional plural (de/para/segun/y). La singularidad se juzga sobre la
    // cabeza, no sobre el complemento.
    "Agenda de visitas", "Cartera de prestaciones", "Carta de derechos y deberes",
    "Plan terapéutico y de cuidados", "Programa de mantención de vehículos",
    "Registro de administración de medicamentos", "Requerimiento de prestaciones",
    "Competencia para las tareas delegadas", "Documento de indicaciones para emergencias",
    "Otro profesional según prestaciones", "Capacidad de prestaciones",
    // B-6: cláusula relativa ("que ...") es modificador post-cabeza; la cabeza
    // singular gobierna.
    "Establecimiento que otorga prestaciones",
  ];
  const invalidos = [
    "Clientes", "Procesos", "Objetos", "Datos", "Pedidos", "Productos", "Servicios",
    "Personas", "Partes", "Atributos", "Estados", "Sistemas", "Entradas", "Salidas",
    "Herramientas", "Usuarios", "Modelos", "Enlaces", "Cafeteras", "Diagnosticos",
    // B-6 guarda adversarial: cabeza PLURAL en un compuesto sigue acusada.
    "Pacientes de la red",
    // B-6 frontera: plural fijo de dominio ("Cuidados ...") es cabeza plural real;
    // el checker lo acusa honesto — la exención de dominio es territorio de B-5 (waiver).
    "Cuidados de enfermería",
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
  test("delega descomposicion sin subprocesos al checker especifico", () => {
    const base = modeloTransformador("Procesar Envio");
    const descompuesto = must(descomponerProceso(base.modelo, base.modelo.opdRaizId, base.procesoId));
    const modelo = dejarCosasEnRefinamiento(descompuesto.modelo, base.procesoId, 0);
    expect(checkInzoomContenido(modelo)).toHaveLength(0);
    expect(checkDescomposicionSinSubprocesos(modelo)[0]?.codigo).toBe("DESCOMPOSICION_SIN_SUBPROCESOS");
  });

  test("avisa descomposicion con 1 cosa", () => {
    const base = modeloTransformador("Procesar Envio");
    const descompuesto = must(descomponerProceso(base.modelo, base.modelo.opdRaizId, base.procesoId));
    const modelo = dejarCosasEnRefinamiento(descompuesto.modelo, base.procesoId, 1);
    expect(checkInzoomContenido(modelo)[0]?.codigo).toBe("INZOOM_CONTENIDO_INSUFICIENTE");
  });

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
      if (tipo === "efecto") {
        // R-OPD-EST-3: el objeto afectado debe declarar estados.
        modelo = must(crearEstadosIniciales(modelo, objetoId)).modelo;
      }
      modelo = tipo === "resultado" || tipo === "efecto"
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
  test("System Diagram sandbox ejecuta checkers sin excepcion", () => {
    expect(Array.isArray(verificarMetodologia(crearSystemDiagramFixture().modelo))).toBe(true);
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

  test("ronda 16 L3: cada aviso emitido lleva ssotRef no vacio", () => {
    let modelo = crearModelo("ssot");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Datos"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 160 }, "Proceso"));
    const avisos = verificarMetodologia(modelo);
    expect(avisos.length).toBeGreaterThan(0);
    expect(avisos.every((aviso) => typeof aviso.ssotRef === "string" && aviso.ssotRef.trim().length > 0)).toBe(true);
    // las refs visibles apuntan a la SSOT KORA, no a nombres de archivo puente.
    expect(avisos.every((aviso) => /urn:fxsl:kb:/.test(aviso.ssotRef ?? ""))).toBe(true);
  });

  test("ronda 16 L3: cada aviso lleva accionesSugeridas no vacias para corrigibilidad", () => {
    let modelo = crearModelo("acciones");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Datos"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 160 }, "Proceso"));
    const avisos = verificarMetodologia(modelo);
    expect(avisos.every((aviso) => Array.isArray(aviso.accionesSugeridas) && aviso.accionesSugeridas.length > 0)).toBe(true);
  });
});

describe("checkSdSinProcesoPrincipal", () => {
  test("avisa SD con solo objetos (sin proceso sistemico)", () => {
    let modelo = crearModelo("Solo objetos");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Cliente"));
    const avisos = checkSdSinProcesoPrincipal(modelo);
    expect(avisos.map((aviso) => aviso.codigo)).toContain("SD_SIN_PROCESO_PRINCIPAL");
    expect(avisos[0]?.opdId).toBe(modelo.opdRaizId);
    expect(avisos[0]?.navegarA).toEqual({ tipo: "opd", id: modelo.opdRaizId });
  });

  test("acepta SD con proceso sistemico", () => {
    expect(checkSdSinProcesoPrincipal(modeloTransformador("Procesar").modelo)).toHaveLength(0);
  });

  test("acepta SD vacio (modelador todavia no empezo)", () => {
    const modelo = crearModelo("Vacio");
    expect(checkSdSinProcesoPrincipal(modelo)).toHaveLength(0);
  });

  test("avisa cuando todos los procesos son ambientales", () => {
    let modelo = crearModelo("Solo ambientales");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Externo"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 160 }, "Auditar"));
    const auditar = entidadPorNombre(modelo, "Auditar");
    modelo = must(cambiarAfiliacion(modelo, auditar, "ambiental"));
    expect(checkSdSinProcesoPrincipal(modelo).map((aviso) => aviso.codigo)).toContain("SD_SIN_PROCESO_PRINCIPAL");
  });
});

describe("checkInzoomNombresPlaceholderHijos", () => {
  test("avisa cuando hijos del refinamiento mantienen nombres placeholder", () => {
    const base = modeloTransformador("Procesar Pedido");
    const descompuesto = must(descomponerProceso(base.modelo, base.modelo.opdRaizId, base.procesoId));
    // descomponer crea placeholders Proceso/Proceso_2; los dejamos sin renombrar.
    const avisos = checkInzoomNombresPlaceholderHijos(descompuesto.modelo);
    expect(avisos.length).toBeGreaterThan(0);
    expect(avisos.every((aviso) => aviso.codigo === "INZOOM_NOMBRES_PLACEHOLDER_HIJOS")).toBe(true);
    expect(avisos[0]?.opdId).toBeDefined();
    expect(avisos[0]?.severidad).toBe("sugerencia");
  });

  test("no avisa si todos los hijos fueron renombrados con vocabulario de dominio", () => {
    const base = modeloTransformador("Procesar Pedido");
    const descompuesto = must(descomponerProceso(base.modelo, base.modelo.opdRaizId, base.procesoId));
    const opdHijoId = descompuesto.modelo.entidades[base.procesoId]?.refinamientos?.descomposicion?.opdId;
    if (!opdHijoId) throw new Error("Sin OPD hijo");
    const opdHijo = descompuesto.modelo.opds[opdHijoId];
    if (!opdHijo) throw new Error("OPD hijo no existe");
    let modelo = descompuesto.modelo;
    // Renombrar cada hijo placeholder ("Procesar Pedido 1", etc.) a nombre de dominio.
    const verbos = ["Recibir Pedido", "Validar Inventario", "Despachar"];
    let counter = 0;
    for (const apariencia of Object.values(opdHijo.apariencias)) {
      if (apariencia.entidadId === base.procesoId) continue;
      const hijo = modelo.entidades[apariencia.entidadId];
      if (!hijo) continue;
      const nombreNuevo = verbos[counter] ?? `Operacion ${counter + 1}`;
      counter += 1;
      modelo = must(renombrarEntidad(modelo, hijo.id, nombreNuevo));
    }
    expect(checkInzoomNombresPlaceholderHijos(modelo)).toHaveLength(0);
  });
});

describe("checkObjetoAmbientalSinContornoDiscontinuo", () => {
  test("avisa objeto ambiental consumido por proceso sistemico", () => {
    let modelo = crearModelo("Ambiental incongruente");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Externo"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 160 }, "Procesar"));
    const externo = entidadPorNombre(modelo, "Externo");
    const procesar = entidadPorNombre(modelo, "Procesar");
    modelo = must(cambiarAfiliacion(modelo, externo, "ambiental"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, externo, procesar, "consumo"));
    const avisos = checkObjetoAmbientalSinContornoDiscontinuo(modelo);
    expect(avisos.map((aviso) => aviso.codigo)).toContain("OBJETO_AMBIENTAL_SIN_CONTORNO_DISCONTINUO");
    expect(avisos[0]?.entidadId).toBe(externo);
  });

  test("acepta objeto ambiental conectado solo via agente", () => {
    let modelo = crearModelo("Ambiental coherente");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Cliente"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 160 }, "Procesar"));
    const cliente = entidadPorNombre(modelo, "Cliente");
    const procesar = entidadPorNombre(modelo, "Procesar");
    modelo = must(cambiarAfiliacion(modelo, cliente, "ambiental"));
    modelo = must(cambiarEsencia(modelo, cliente, "fisica"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, cliente, procesar, "agente"));
    expect(checkObjetoAmbientalSinContornoDiscontinuo(modelo)).toHaveLength(0);
  });

  test("acepta objeto sistemico transformado por proceso sistemico", () => {
    const modelo = modeloTransformador("Procesar").modelo;
    expect(checkObjetoAmbientalSinContornoDiscontinuo(modelo)).toHaveLength(0);
  });

  test("acepta objeto ambiental transformado solo por proceso ambiental", () => {
    let modelo = crearModelo("Ambiental por ambiental");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Lluvia"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 160 }, "Llover"));
    const lluvia = entidadPorNombre(modelo, "Lluvia");
    const llover = entidadPorNombre(modelo, "Llover");
    modelo = must(cambiarAfiliacion(modelo, lluvia, "ambiental"));
    modelo = must(cambiarAfiliacion(modelo, llover, "ambiental"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, llover, lluvia, "resultado"));
    expect(checkObjetoAmbientalSinContornoDiscontinuo(modelo)).toHaveLength(0);
  });
});

describe("ronda 16 L3: navegarA emitido por checkers", () => {
  test("INZOOM_CONTENIDO_INSUFICIENTE navega al OPD hijo cuando existe", () => {
    const base = modeloTransformador("Procesar Pedido");
    const descompuesto = must(descomponerProceso(base.modelo, base.modelo.opdRaizId, base.procesoId));
    const modelo = dejarCosasEnRefinamiento(descompuesto.modelo, base.procesoId, 1);
    const avisos = checkInzoomContenido(modelo);
    expect(avisos[0]?.navegarA?.tipo).toBe("opd");
    const opdHijoId = modelo.entidades[base.procesoId]?.refinamientos?.descomposicion?.opdId;
    expect(avisos[0]?.navegarA?.id).toBe(opdHijoId ?? "");
  });

  test("UNFOLD_CONTENIDO_INSUFICIENTE navega al OPD hijo cuando existe", () => {
    let modelo = modeloConObjeto("Sistema");
    const sistema = entidadPorNombre(modelo, "Sistema");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, sistema, "agregacion")).modelo;
    modelo = dejarEnlacesEnRefinamiento(modelo, sistema, 1);
    const avisos = checkUnfoldContenido(modelo);
    expect(avisos[0]?.navegarA?.tipo).toBe("opd");
  });

  test("PROCESO_NOMBRE_FORMA_VERBAL navega a la entidad", () => {
    const avisos = checkProcesoNombreFormaVerbal(modeloConProceso("Sistema"));
    expect(avisos[0]?.entidadId).toBeDefined();
    // PROCESO_NOMBRE_FORMA_VERBAL no setea navegarA explicito; el panel
    // resuelve con entidadId. Ese es el contrato esperado.
    expect(avisos[0]?.navegarA).toBeUndefined();
  });
});

describe("checkProbabilidadFueraDeAbanico (A6-2 / V-18, reglas §11.2)", () => {
  test("acusa un enlace evento con Pr fuera de todo abanico XOR", () => {
    let modelo = crearModelo("prob-suelta");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Pedido"), entidadPorNombre(modelo, "Procesar"), "consumo"));
    const enlaceId = Object.values(modelo.enlaces).find((e) => e.tipo === "consumo")!.id;
    modelo = must(aplicarModificador(modelo, enlaceId, "evento"));
    modelo = must(definirProbabilidad(modelo, enlaceId, 0.7));

    const avisos = checkProbabilidadFueraDeAbanico(modelo);
    expect(avisos.map((a) => a.codigo)).toEqual(["PROBABILIDAD_FUERA_DE_ABANICO"]);
    expect(avisos[0]?.severidad).toBe("sugerencia");
  });

  test("NO acusa una rama de abanico XOR con probabilidades (caso canónico A)", () => {
    let modelo = crearModelo("prob-xor");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 40, y: 80 }, "P"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 20 }, "A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 140 }, "B"));
    const p = entidadPorNombre(modelo, "P");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, p, entidadPorNombre(modelo, "A"), "resultado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, p, entidadPorNombre(modelo, "B"), "resultado"));
    const ramas = Object.values(modelo.enlaces).filter((e) => e.tipo === "resultado").map((e) => e.id);
    // Las ramas de un abanico comparten puerto (la acción de UI lo fija al agrupar).
    modelo = {
      ...modelo,
      enlaces: Object.fromEntries(
        Object.entries(modelo.enlaces).map(([id, e]) =>
          ramas.includes(id) && e.origenId.kind === "entidad"
            ? [id, { ...e, origenId: { ...e.origenId, portId: "port-xor" } }]
            : [id, e],
        ),
      ),
    };
    modelo = must(formarAbanico(modelo, modelo.opdRaizId, ramas, "XOR"));
    const abanicoId = Object.keys(modelo.abanicos ?? {})[0]!;
    modelo = must(definirProbabilidadesAbanico(modelo, abanicoId, { [ramas[0]!]: 0.6, [ramas[1]!]: 0.4 }));

    expect(checkProbabilidadFueraDeAbanico(modelo)).toEqual([]);
  });

  test("NO acusa un enlace evento sin probabilidad", () => {
    let modelo = crearModelo("evento-sin-prob");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Pedido"), entidadPorNombre(modelo, "Procesar"), "consumo"));
    const enlaceId = Object.values(modelo.enlaces).find((e) => e.tipo === "consumo")!.id;
    modelo = must(aplicarModificador(modelo, enlaceId, "evento"));

    expect(checkProbabilidadFueraDeAbanico(modelo)).toEqual([]);
  });
});

describe("checkInvocacionRedundanteConOrden (U5 · R-INV-2B / §5.4)", () => {
  /**
   * Construye un modelo mínimo: un proceso padre con descomposición, un OPD hijo
   * con subprocesos (a/b[/c]), una `ordenInzoom` y una apariencia de enlace de
   * invocación entre dos subprocesos. Controla directamente las bandas para
   * cubrir la frontera adyacente / salto / paralelo / sin-campo sin depender del
   * sembrado de `descomponerProceso`.
   */
  function modeloConInvocacion(opciones: {
    ordenInzoom?: Id[][];
    invocacion: { de: Id; a: Id };
    subprocesos: Id[];
  }): Modelo {
    const opdHijoId = "opd-hijo";
    const padreId = "p-padre";
    const enlaceId = "e-inv";
    const aparienciaEnlaceId = "ae-inv";

    const entidades: Modelo["entidades"] = {
      [padreId]: {
        id: padreId,
        tipo: "proceso",
        nombre: "Procesar Pedido",
        esencia: "informacional",
        afiliacion: "sistemica",
        refinamientos: { descomposicion: { opdId: opdHijoId } },
      },
    };
    const apariencias: Record<Id, import("./tipos").Apariencia> = {};
    for (const id of opciones.subprocesos) {
      entidades[id] = {
        id,
        tipo: "proceso",
        nombre: `Sub ${id}`,
        esencia: "informacional",
        afiliacion: "sistemica",
      };
      apariencias[`a-${id}`] = {
        id: `a-${id}`,
        entidadId: id,
        opdId: opdHijoId,
        x: 0,
        y: 0,
        width: 100,
        height: 60,
      };
    }

    const enlaces: Modelo["enlaces"] = {
      [enlaceId]: {
        id: enlaceId,
        tipo: "invocacion",
        origenId: { kind: "entidad", id: opciones.invocacion.de },
        destinoId: { kind: "entidad", id: opciones.invocacion.a },
        etiqueta: "",
      },
    };

    const opdHijo: import("./tipos").Opd = {
      id: opdHijoId,
      nombre: "SD1",
      padreId: "opd-raiz",
      apariencias,
      enlaces: {
        [aparienciaEnlaceId]: { id: aparienciaEnlaceId, enlaceId, opdId: opdHijoId, vertices: [] },
      },
    };
    if (opciones.ordenInzoom) opdHijo.ordenInzoom = opciones.ordenInzoom;

    return {
      id: "m",
      nombre: "U5",
      opdRaizId: "opd-raiz",
      opds: {
        "opd-raiz": { id: "opd-raiz", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} },
        [opdHijoId]: opdHijo,
      },
      entidades,
      estados: {},
      enlaces,
      nextSeq: 100,
    };
  }

  test("adyacente: invocación a→b sobre bandas [[a],[b]] EMITE aviso", () => {
    const modelo = modeloConInvocacion({
      ordenInzoom: [["a"], ["b"]],
      invocacion: { de: "a", a: "b" },
      subprocesos: ["a", "b"],
    });
    const avisos = checkInvocacionRedundanteConOrden(modelo);
    expect(avisos.map((aviso) => aviso.codigo)).toEqual(["INVOCACION_REDUNDANTE_CON_ORDEN"]);
    expect(avisos[0]?.severidad).toBe("sugerencia");
    expect(avisos[0]?.entidadId).toBe("a");
    expect(avisos[0]?.opdId).toBe("opd-hijo");
  });

  test("salto: invocación a→c sobre bandas [[a],[b],[c]] NO emite (salto fuera de orden = explícito)", () => {
    const modelo = modeloConInvocacion({
      ordenInzoom: [["a"], ["b"], ["c"]],
      invocacion: { de: "a", a: "c" },
      subprocesos: ["a", "b", "c"],
    });
    expect(checkInvocacionRedundanteConOrden(modelo)).toEqual([]);
  });

  test("misma banda (paralelo): invocación a→b sobre bandas [[a,b]] NO emite", () => {
    const modelo = modeloConInvocacion({
      ordenInzoom: [["a", "b"]],
      invocacion: { de: "a", a: "b" },
      subprocesos: ["a", "b"],
    });
    expect(checkInvocacionRedundanteConOrden(modelo)).toEqual([]);
  });

  test("sin campo: invocación a→b sin ordenInzoom NO emite", () => {
    const modelo = modeloConInvocacion({
      invocacion: { de: "a", a: "b" },
      subprocesos: ["a", "b"],
    });
    expect(checkInvocacionRedundanteConOrden(modelo)).toEqual([]);
  });
});
