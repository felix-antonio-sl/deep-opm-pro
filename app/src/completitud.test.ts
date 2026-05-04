// Tests cross-capa de exhaustividad / completitud.
//
// Verifican que cuando una union tipada (TipoEnlace, ModoDespliegueObjeto)
// se extiende, todos los puntos de entrada del usuario y todas las capas
// que la consumen quedan cubiertos. Sin esta red de seguridad,
// extensiones del kernel pueden quedar invisibles desde la UI o el render
// (caso historico: exhibicion/generalizacion/clasificacion estaban en
// kernel/render/OPL pero el dropdown del Toolbar no las exponia).
//
// El truco TypeScript: declarar `Record<Union, ...>` con todas las claves
// hace que cualquier nuevo miembro del union obligue a actualizar el test
// en compile-time, no en runtime. Si TS te pide agregar una clave aqui,
// significa que tambien hay que cubrirla en cada capa enumerada abajo.

import { describe, expect, test } from "bun:test";
import {
  crearEnlace,
  crearModelo,
  crearObjeto,
  crearProceso,
  desplegarObjeto,
  validarFirmaEnlace,
} from "./modelo/operaciones";
import type {
  Entidad,
  Esencia,
  Id,
  ModoDespliegueObjeto,
  Modelo,
  Posicion,
  Resultado,
  TipoEnlace,
  TipoEntidad,
} from "./modelo/tipos";
import { generarOpl } from "./opl/generar";
import { LINK_ASSETS } from "./render/jointjs/linkAssets";
import { proyectarModeloAJointCells } from "./render/jointjs/proyeccion";
import { OPCIONES_DESPLIEGUE_OBJETO } from "./ui/InspectorEntidad";
import { TIPOS_ENLACE } from "./ui/Toolbar";

// Records que TS exige completos. Si se agrega un miembro al union en
// modelo/tipos.ts, este archivo deja de compilar hasta cubrirlo.
const TODOS_LOS_TIPOS_ENLACE: Record<TipoEnlace, true> = {
  agregacion: true,
  exhibicion: true,
  generalizacion: true,
  clasificacion: true,
  agente: true,
  instrumento: true,
  consumo: true,
  resultado: true,
  efecto: true,
  invocacion: true,
};

const TODOS_LOS_MODOS_DESPLIEGUE: Record<ModoDespliegueObjeto, true> = {
  agregacion: true,
  exhibicion: true,
  generalizacion: true,
  clasificacion: true,
};

const TIPOS_ENLACE_LISTA = Object.keys(TODOS_LOS_TIPOS_ENLACE) as TipoEnlace[];
const MODOS_DESPLIEGUE_LISTA = Object.keys(TODOS_LOS_MODOS_DESPLIEGUE) as ModoDespliegueObjeto[];

describe("completitud / Toolbar dropdown de TipoEnlace", () => {
  test("TIPOS_ENLACE expone todos los TipoEnlace canonicos", () => {
    const tiposEnDropdown = new Set(TIPOS_ENLACE.map((entry) => entry.tipo));
    for (const tipo of TIPOS_ENLACE_LISTA) {
      expect(tiposEnDropdown.has(tipo)).toBe(true);
    }
  });

  test("TIPOS_ENLACE no contiene duplicados ni tipos desconocidos", () => {
    const tiposEnDropdown = TIPOS_ENLACE.map((entry) => entry.tipo);
    expect(new Set(tiposEnDropdown).size).toBe(tiposEnDropdown.length);
    expect(tiposEnDropdown.length).toBe(TIPOS_ENLACE_LISTA.length);
  });

  test("cada entrada de TIPOS_ENLACE tiene label no vacio", () => {
    for (const entry of TIPOS_ENLACE) {
      expect(entry.label.length).toBeGreaterThan(0);
    }
  });
});

describe("completitud / Inspector menu de despliegue", () => {
  test("OPCIONES_DESPLIEGUE_OBJETO expone todos los ModoDespliegueObjeto", () => {
    const modosEnMenu = new Set(OPCIONES_DESPLIEGUE_OBJETO.map((entry) => entry.modo));
    for (const modo of MODOS_DESPLIEGUE_LISTA) {
      expect(modosEnMenu.has(modo)).toBe(true);
    }
  });

  test("OPCIONES_DESPLIEGUE_OBJETO no contiene duplicados", () => {
    const modos = OPCIONES_DESPLIEGUE_OBJETO.map((entry) => entry.modo);
    expect(new Set(modos).size).toBe(modos.length);
    expect(modos.length).toBe(MODOS_DESPLIEGUE_LISTA.length);
  });
});

describe("completitud / LINK_ASSETS por tipo de enlace", () => {
  test("cada TipoEnlace tiene una entrada en LINK_ASSETS (procedural o estructural)", () => {
    const procedurales = LINK_ASSETS.procedural as Record<string, unknown>;
    const estructurales = LINK_ASSETS.structural as Record<string, unknown>;
    for (const tipo of TIPOS_ENLACE_LISTA) {
      const tieneEntrada = procedurales[tipo] !== undefined || estructurales[tipo] !== undefined;
      expect(tieneEntrada).toBe(true);
    }
  });
});

describe("completitud / validarFirmaEnlace responde a cada tipo", () => {
  test("validarFirmaEnlace acepta la firma canonica de cada TipoEnlace", () => {
    for (const tipo of TIPOS_ENLACE_LISTA) {
      const [origen, destino] = entidadesValidasPara(tipo);
      const resultado = validarFirmaEnlace(tipo, origen, destino);
      expect(resultado.ok).toBe(true);
    }
  });
});

describe("completitud / kernel desplegarObjeto por modo", () => {
  test("desplegarObjeto produce OPD hijo con tres refinadores para cada ModoDespliegueObjeto", () => {
    for (const modo of MODOS_DESPLIEGUE_LISTA) {
      let modelo = crearModelo();
      modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, `Padre-${modo}`));
      const objetoId = entidadConNombre(modelo, `Padre-${modo}`);
      const resultado = desplegarObjeto(modelo, modelo.opdRaizId, objetoId, modo);
      expect(resultado.ok).toBe(true);
      if (!resultado.ok) continue;
      const hijo = resultado.value.modelo.opds[resultado.value.opdId];
      expect(hijo).toBeDefined();
      const enlacesHijo = Object.values(resultado.value.modelo.enlaces).filter(
        (enlace) => enlace.tipo === modo && enlace.origenId === objetoId,
      );
      expect(enlacesHijo).toHaveLength(3);
    }
  });
});

describe("completitud / OPL por tipo de enlace", () => {
  test("generar(modelo) emite alguna oracion para cada TipoEnlace canonico", () => {
    for (const tipo of TIPOS_ENLACE_LISTA) {
      const modelo = modeloConEnlaceDe(tipo);
      const oraciones = generarOpl(modelo, modelo.opdRaizId);
      expect(oraciones.length).toBeGreaterThan(0);
    }
  });
});

describe("completitud / render por tipo de enlace", () => {
  test("proyectarModeloAJointCells genera celdas para cada TipoEnlace canonico", () => {
    for (const tipo of TIPOS_ENLACE_LISTA) {
      const modelo = modeloConEnlaceDe(tipo);
      const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);
      const links = cells.filter((cell) => cell.type === "standard.Link");
      expect(links.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------

interface EntidadDeTest {
  tipo: TipoEntidad;
  esencia: Esencia;
  nombre: string;
}

function entidadesValidasPara(tipo: TipoEnlace): [Entidad, Entidad] {
  const config = configuracionPara(tipo);
  return [
    sinteticoEntidad(config[0]),
    sinteticoEntidad(config[1]),
  ];
}

function configuracionPara(tipo: TipoEnlace): [EntidadDeTest, EntidadDeTest] {
  if (tipo === "agente") {
    return [
      { tipo: "objeto", esencia: "fisica", nombre: "Agente" },
      { tipo: "proceso", esencia: "informacional", nombre: "Proceso" },
    ];
  }
  if (tipo === "instrumento" || tipo === "consumo") {
    return [
      { tipo: "objeto", esencia: "informacional", nombre: "Recurso" },
      { tipo: "proceso", esencia: "informacional", nombre: "Proceso" },
    ];
  }
  if (tipo === "resultado") {
    return [
      { tipo: "proceso", esencia: "informacional", nombre: "Proceso" },
      { tipo: "objeto", esencia: "informacional", nombre: "Producto" },
    ];
  }
  if (tipo === "efecto") {
    return [
      { tipo: "objeto", esencia: "informacional", nombre: "Estado" },
      { tipo: "proceso", esencia: "informacional", nombre: "Cambio" },
    ];
  }
  if (tipo === "invocacion") {
    return [
      { tipo: "proceso", esencia: "informacional", nombre: "Disparador" },
      { tipo: "proceso", esencia: "informacional", nombre: "Disparado" },
    ];
  }
  // estructurales: agregacion, exhibicion, generalizacion, clasificacion
  // todos aceptan objeto-objeto.
  return [
    { tipo: "objeto", esencia: "informacional", nombre: "Origen" },
    { tipo: "objeto", esencia: "informacional", nombre: "Destino" },
  ];
}

function sinteticoEntidad(config: EntidadDeTest): Entidad {
  return {
    id: `ent-${config.nombre.toLowerCase()}`,
    tipo: config.tipo,
    nombre: config.nombre,
    esencia: config.esencia,
    afiliacion: "sistemica",
  };
}

function modeloConEnlaceDe(tipo: TipoEnlace): Modelo {
  const config = configuracionPara(tipo);
  let modelo = crearModelo();
  modelo = construirEntidad(modelo, config[0], { x: 60, y: 60 });
  modelo = construirEntidad(modelo, config[1], { x: 320, y: 160 });
  if (config[0].esencia === "fisica") {
    const id = entidadConNombre(modelo, config[0].nombre);
    const entidad = modelo.entidades[id];
    if (entidad) modelo.entidades[id] = { ...entidad, esencia: "fisica" };
  }
  const origenId = entidadConNombre(modelo, config[0].nombre);
  const destinoId = entidadConNombre(modelo, config[1].nombre);
  return must(crearEnlace(modelo, modelo.opdRaizId, origenId, destinoId, tipo));
}

function construirEntidad(modelo: Modelo, config: EntidadDeTest, posicion: Posicion): Modelo {
  if (config.tipo === "objeto") {
    return must(crearObjeto(modelo, modelo.opdRaizId, posicion, config.nombre));
  }
  return must(crearProceso(modelo, modelo.opdRaizId, posicion, config.nombre));
}

function entidadConNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
