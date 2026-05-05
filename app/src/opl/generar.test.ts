import { describe, expect, test } from "bun:test";
import { extremoEstado } from "../modelo/extremos";
import { crearAutoInvocacion } from "../modelo/autoinvocacion";
import { renombrarEtiquetaEnlace } from "../modelo/etiquetasEnlace";
import { aplicarEstiloApariencia } from "../modelo/estilos";
import { aplicarModificador, definirDemora, definirProbabilidad } from "../modelo/modificadores";
import { ajustarMultiplicidad, cambiarEsencia, crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, designarEstadoFinal, designarEstadoInicial, descomponerProceso, agregarEstado, desplegarObjeto, estadosDeEntidad, moverApariencia, renombrarEstado } from "../modelo/operaciones";
import { cambiarModoPlegado } from "../modelo/plegado";
import { definirRutaEtiqueta } from "../modelo/rutas";
import type { Apariencia, Modelo, Resultado } from "../modelo/tipos";
import { generarOpl, generarOplInteractivo } from "./generar";

describe("OPL-ES — tipos de enlace canonicos", () => {
  test("agregacion emite consta de", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 180, y: 0 }, "Parte"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Todo"), entidad(modelo, "Parte"), "agregacion"));

    expect(generarOpl(modelo)).toContain("**Todo** consta de **Parte**.");
  });

  test("etiqueta de agregacion es tag adicional y no reemplaza verbo canonico", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 180, y: 0 }, "Parte"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Todo"), entidad(modelo, "Parte"), "agregacion"));
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    modelo = must(renombrarEtiquetaEnlace(modelo, enlaceId, "componente critico"));

    expect(generarOpl(modelo)).toContain("**Todo** consta de **Parte**. [etiqueta: componente critico]");
  });

  test("estilo de apariencia no cambia OPL", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), entidad(modelo, "Procesar"), "consumo"));
    const antes = generarOpl(modelo);
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})
      .find((item) => item.entidadId === entidad(modelo, "Entrada"));
    if (!apariencia) throw new Error("La prueba esperaba apariencia");

    modelo = must(aplicarEstiloApariencia(modelo, modelo.opdRaizId, apariencia.id, {
      fill: "#fef3c7",
      borderColor: "#586d8c",
    }));

    expect(generarOpl(modelo)).toEqual(antes);
  });

  test("agente emite maneja", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Operador"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Rescatar"));
    modelo = must(cambiarEsencia(modelo, entidad(modelo, "Operador"), "fisica"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Operador"), entidad(modelo, "Rescatar"), "agente"));

    expect(generarOpl(modelo)).toContain("**Operador** maneja *Rescatar*.");
  });

  test("instrumento emite requiere", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Volante"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Conducir"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Volante"), entidad(modelo, "Conducir"), "instrumento"));

    expect(generarOpl(modelo)).toContain("*Conducir* requiere **Volante**.");
  });

  test("consumo emite consume", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Ingrediente"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Cocinar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Ingrediente"), entidad(modelo, "Cocinar"), "consumo"));

    expect(generarOpl(modelo)).toContain("*Cocinar* consume **Ingrediente**.");
  });

  test("resultado emite genera", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Cocinar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Plato"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Cocinar"), entidad(modelo, "Plato"), "resultado"));

    expect(generarOpl(modelo)).toContain("*Cocinar* genera **Plato**.");
  });

  test("efecto emite afecta", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Calentar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Agua"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Calentar"), entidad(modelo, "Agua"), "efecto"));

    expect(generarOpl(modelo)).toContain("*Calentar* afecta **Agua**.");
  });

  test("invocacion emite invoca", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Preparar"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Servir"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Preparar"), entidad(modelo, "Servir"), "invocacion"));

    expect(generarOpl(modelo)).toContain("*Preparar* invoca *Servir*.");
  });

  test("modificador evento emite inicia y probabilidad", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Orden"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Aprobar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Orden"), entidad(modelo, "Aprobar"), "consumo"));
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    modelo = must(aplicarModificador(modelo, enlaceId, "evento"));
    modelo = must(definirProbabilidad(modelo, enlaceId, 0.7));

    expect(generarOpl(modelo)).toContain("**Orden** inicia *Aprobar*, que consume **Orden** (probabilidad 0.7).");
  });

  test("modificador NO emite negacion", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Orden"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Aprobar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Orden"), entidad(modelo, "Aprobar"), "consumo"));
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    modelo = must(aplicarModificador(modelo, enlaceId, "no"));

    expect(generarOpl(modelo)).toContain("*Aprobar* no consume **Orden**.");
  });

  test("modificador condicion emite omision condicional", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Orden"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Aprobar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Orden"), entidad(modelo, "Aprobar"), "consumo"));
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    modelo = must(aplicarModificador(modelo, enlaceId, "condicion"));

    expect(generarOpl(modelo)).toContain("*Aprobar* ocurre si **Orden** existe, en cuyo caso *Aprobar* consume **Orden**, de lo contrario *Aprobar* se omite.");
  });

  test("invocacion con demora anexa etiqueta temporal", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Preparar"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Servir"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Preparar"), entidad(modelo, "Servir"), "invocacion"));
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    modelo = must(definirDemora(modelo, enlaceId, "1s"));

    expect(generarOpl(modelo)).toContain("*Preparar* invoca *Servir* despues de 1s.");
  });

  test("auto-invocacion emite IV2 con demora default", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Validar"));
    modelo = must(crearAutoInvocacion(modelo, modelo.opdRaizId, entidad(modelo, "Validar")));

    expect(generarOpl(modelo)).toContain("*Validar* se invoca a sí mismo despues de 1s.");
  });

  test("multiplicidad de agente pluraliza sujeto y verbo", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Conductor"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Conducir"));
    modelo = must(cambiarEsencia(modelo, entidad(modelo, "Conductor"), "fisica"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Conductor"), entidad(modelo, "Conducir"), "agente"));
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    expect(enlaceId).toBeDefined();
    if (!enlaceId) return;
    modelo = must(ajustarMultiplicidad(modelo, enlaceId, "origen", "2"));

    expect(generarOpl(modelo)).toContain("2 **Conductores** manejan *Conducir*.");
  });

  test("multiplicidad de complemento conserva verbo singular y pluraliza z", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Vez"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Contar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Vez"), entidad(modelo, "Contar"), "consumo"));
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    expect(enlaceId).toBeDefined();
    if (!enlaceId) return;
    modelo = must(ajustarMultiplicidad(modelo, enlaceId, "origen", "*"));

    expect(generarOpl(modelo)).toContain("*Contar* consume * **Veces**.");
  });

  test("multiplicidad destino pluraliza vocal en resultado", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Preparar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Recurso"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Preparar"), entidad(modelo, "Recurso"), "resultado"));
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    expect(enlaceId).toBeDefined();
    if (!enlaceId) return;
    modelo = must(ajustarMultiplicidad(modelo, enlaceId, "destino", "1..N"));

    expect(generarOpl(modelo)).toContain("*Preparar* genera 1..N **Recursos**.");
  });

  test("multiplicidad uno mantiene singular explicitando cardinalidad", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Recurso"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Recurso"), entidad(modelo, "Procesar"), "consumo"));
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    expect(enlaceId).toBeDefined();
    if (!enlaceId) return;
    modelo = must(ajustarMultiplicidad(modelo, enlaceId, "origen", "1"));

    expect(generarOpl(modelo)).toContain("*Procesar* consume 1 **Recurso**.");
  });

  test("estado de objeto emite puede ser con disyuncion y designaciones", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    const objetoId = entidad(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, objetoId)).modelo;
    const [primero, segundo] = estadosDeEntidad(modelo, objetoId);
    if (!primero || !segundo) throw new Error("La prueba esperaba dos estados");
    modelo = must(renombrarEstado(modelo, primero.id, "pendiente"));
    modelo = must(renombrarEstado(modelo, segundo.id, "cerrado"));
    modelo = must(designarEstadoInicial(modelo, primero.id));
    modelo = must(designarEstadoFinal(modelo, segundo.id));

    expect(generarOpl(modelo)).toContain("**Pedido** puede ser `pendiente` (inicial) o `cerrado` (final).");
  });

  test("estado inicial y final en la misma capsula verbaliza ambas designaciones", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Orden"));
    const objetoId = entidad(modelo, "Orden");
    modelo = must(crearEstadosIniciales(modelo, objetoId)).modelo;
    const [primero] = estadosDeEntidad(modelo, objetoId);
    if (!primero) throw new Error("La prueba esperaba un estado");
    modelo = must(renombrarEstado(modelo, primero.id, "abierta"));
    modelo = must(designarEstadoInicial(modelo, primero.id));
    modelo = must(designarEstadoFinal(modelo, primero.id));

    expect(generarOpl(modelo)).toContain("**Orden** puede ser `abierta` (inicial y final) o `estado2`.");
  });

  test("tres estados usan coma y o final", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Ticket"));
    const objetoId = entidad(modelo, "Ticket");
    modelo = must(crearEstadosIniciales(modelo, objetoId)).modelo;
    modelo = must(agregarEstado(modelo, objetoId, "resuelto")).modelo;
    const [primero, segundo] = estadosDeEntidad(modelo, objetoId);
    if (!primero || !segundo) throw new Error("La prueba esperaba dos estados");
    modelo = must(renombrarEstado(modelo, primero.id, "nuevo"));
    modelo = must(renombrarEstado(modelo, segundo.id, "en curso"));

    expect(generarOpl(modelo)).toContain("**Ticket** puede ser `nuevo`, `en curso` o `resuelto`.");
  });

  test("consumo desde Estado emite cambio parcial TS4", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "Aprobar"));
    const pedidoId = entidad(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [pendiente] = estadosDeEntidad(modelo, pedidoId);
    if (!pendiente) throw new Error("La prueba esperaba estado");
    modelo = must(renombrarEstado(modelo, pendiente.id, "pendiente"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendiente.id), entidad(modelo, "Aprobar"), "consumo"));

    expect(generarOpl(modelo)).toContain("*Aprobar* cambia **Pedido** de `pendiente`.");
  });

  test("resultado hacia Estado emite cambio parcial TS5", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "Aprobar"));
    const pedidoId = entidad(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [, aprobado] = estadosDeEntidad(modelo, pedidoId);
    if (!aprobado) throw new Error("La prueba esperaba estado");
    modelo = must(renombrarEstado(modelo, aprobado.id, "aprobado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Aprobar"), extremoEstado(aprobado.id), "resultado"));

    expect(generarOpl(modelo)).toContain("*Aprobar* cambia **Pedido** a `aprobado`.");
  });

  test("par consumo-resultado sobre estados emite transicion TS3 unica", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "Aprobar"));
    const pedidoId = entidad(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [pendiente, aprobado] = estadosDeEntidad(modelo, pedidoId);
    if (!pendiente || !aprobado) throw new Error("La prueba esperaba dos estados");
    modelo = must(renombrarEstado(modelo, pendiente.id, "pendiente"));
    modelo = must(renombrarEstado(modelo, aprobado.id, "aprobado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendiente.id), entidad(modelo, "Aprobar"), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Aprobar"), extremoEstado(aprobado.id), "resultado"));

    const lineas = generarOpl(modelo);

    expect(lineas).toContain("*Aprobar* cambia **Pedido** de `pendiente` a `aprobado`.");
    expect(lineas).not.toContain("*Aprobar* cambia **Pedido** de `pendiente`.");
    expect(lineas).not.toContain("*Aprobar* cambia **Pedido** a `aprobado`.");
  });
});

describe("OPL-ES — refinamiento", () => {
  test("descomposicion de proceso emite secuencia ordenada por y", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Atender Paciente"));
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, entidad(modelo, "Atender Paciente")));
    modelo = descompuesto.modelo;

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("*Atender Paciente* se descompone en *Atender Paciente 1*, *Atender Paciente 2* y *Atender Paciente 3* en esa secuencia.");
  });

  test("despliegue de objeto emite se despliega en partes", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const desplegado = must(desplegarObjeto(modelo, modelo.opdRaizId, entidad(modelo, "Vehiculo")));
    modelo = desplegado.modelo;

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("**Vehiculo** se despliega en **Vehiculo parte 1**, **Vehiculo parte 2** y **Vehiculo parte 3**.");
  });

  test("despliegue exhibicion emite exhibe", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const desplegado = must(desplegarObjeto(modelo, modelo.opdRaizId, entidad(modelo, "Vehiculo"), "exhibicion"));
    modelo = desplegado.modelo;

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("**Vehiculo** exhibe **Atributo 1**, **Atributo 2** y **Atributo 3**.");
    expect(generarOpl(modelo, desplegado.opdId)).toContain("**Vehiculo** exhibe **Atributo 1**.");
  });

  test("despliegue generalizacion emite es un", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const desplegado = must(desplegarObjeto(modelo, modelo.opdRaizId, entidad(modelo, "Vehiculo"), "generalizacion"));
    modelo = desplegado.modelo;

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("**Especialización 1**, **Especialización 2** y **Especialización 3** son **Vehiculo**.");
    expect(generarOpl(modelo, desplegado.opdId)).toContain("**Especialización 1** es un **Vehiculo**.");
  });

  test("despliegue clasificacion emite es una instancia de", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const desplegado = must(desplegarObjeto(modelo, modelo.opdRaizId, entidad(modelo, "Vehiculo"), "clasificacion"));
    modelo = desplegado.modelo;

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("**Instancia 1**, **Instancia 2** y **Instancia 3** son instancias de **Vehiculo**.");
    expect(generarOpl(modelo, desplegado.opdId)).toContain("**Instancia 1** es una instancia de **Vehiculo**.");
  });

  test("plegado parcial con mas de tres partes emite contador partes mas", () => {
    let modelo = modeloConVehiculoDesplegado();
    modelo = agregarPartes(modelo, 2);
    const objetoId = entidad(modelo, "Vehiculo");
    const apariencia = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, apariencia.id, "parcial"));

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("**Vehiculo** consiste en **Vehiculo parte 1**, **Vehiculo parte 2** y **Vehiculo parte 3** y 2 partes más.");
  });

  test("plegado parcial con tres partes enumera todo sin contador", () => {
    let modelo = modeloConVehiculoDesplegado();
    const objetoId = entidad(modelo, "Vehiculo");
    const apariencia = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, apariencia.id, "parcial"));

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("**Vehiculo** consiste en **Vehiculo parte 1**, **Vehiculo parte 2** y **Vehiculo parte 3**.");
  });
});

describe("OPL-ES interactivo", () => {
  test("conserva texto canonico y ordinales estables", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Orden"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Aprobar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Orden"), entidad(modelo, "Aprobar"), "consumo"));

    const texto = generarOpl(modelo);
    const interactivo = generarOplInteractivo(modelo);

    expect(interactivo.map((linea) => linea.texto)).toEqual(texto);
    expect(interactivo.map((linea) => linea.ordinal)).toEqual(texto.map((_, index) => index + 1));
    expect(interactivo.map((linea) => linea.id)).toEqual(["opl-opd-1-1", "opl-opd-1-2", "opl-opd-1-3"]);
  });

  test("oracion de enlace incluye ref de enlace y tokens de extremos", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), entidad(modelo, "Procesar"), "consumo"));
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    if (!enlaceId) throw new Error("La prueba esperaba enlace");

    const linea = generarOplInteractivo(modelo).find((item) => item.refs.some((ref) => ref.tipo === "enlace" && ref.id === enlaceId));
    expect(linea).toBeDefined();
    if (!linea) return;

    expect(linea.refs).toEqual(expect.arrayContaining([
      { tipo: "enlace", id: enlaceId },
      { tipo: "entidad", id: entidad(modelo, "Entrada") },
      { tipo: "entidad", id: entidad(modelo, "Procesar") },
    ]));
    expect(linea.tokens.filter((token) => token.ref?.tipo === "entidad").map((token) => token.texto)).toEqual(expect.arrayContaining(["**Entrada**", "*Procesar*"]));
    expect(linea.tokens.some((token) => token.ref?.tipo === "enlace" && token.rol === "verbo")).toBe(true);
  });
});

describe("OPL-ES — bordes", () => {
  test("modelo vacio produce OPL vacio", () => {
    expect(generarOpl(crearModelo())).toEqual([]);
  });

  test("OPD activo distinto al raiz filtra oraciones por OPD", () => {
    let modelo = crearModelo();
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        "opd-2": {
          id: "opd-2",
          nombre: "SD1",
          padreId: modelo.opdRaizId,
          apariencias: {},
          enlaces: {},
        },
      },
    };
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Raiz"));
    modelo = must(crearProceso(modelo, "opd-2", { x: 0, y: 0 }, "Hijo"));

    expect(generarOpl(modelo, "opd-2")).toEqual(["*Hijo* es un proceso informacional y sistémico."]);
  });

  test("entidad sin enlaces conserva su declaracion", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Nodo"));

    expect(generarOpl(modelo)).toEqual(["**Nodo** es un objeto informacional y sistémico."]);
  });
});

describe("OPL-ES — abanicos logicos", () => {
  test("emite al menos uno de para abanico O", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 200 }, "Procesar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 60 }, "Entrada A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 220 }, "Entrada B"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada A"), entidad(modelo, "Procesar"), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada B"), entidad(modelo, "Procesar"), "consumo"));
    const enlaceIds = Object.values(modelo.enlaces).map((enlace) => enlace.id);
    const { formarAbanico } = require("../modelo/abanicos") as typeof import("../modelo/abanicos");
    modelo = must(formarAbanico(modelo, modelo.opdRaizId, enlaceIds, "O"));

    expect(generarOpl(modelo)).toContain("*Procesar* consume al menos uno de **Entrada A** y **Entrada B**.");
  });

  test("emite exactamente uno de para abanico XOR", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 200 }, "Procesar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 60 }, "Entrada A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 220 }, "Entrada B"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada A"), entidad(modelo, "Procesar"), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada B"), entidad(modelo, "Procesar"), "consumo"));
    const enlaceIds = Object.values(modelo.enlaces).map((enlace) => enlace.id);
    const { formarAbanico } = require("../modelo/abanicos") as typeof import("../modelo/abanicos");
    modelo = must(formarAbanico(modelo, modelo.opdRaizId, enlaceIds, "XOR"));

    expect(generarOpl(modelo)).toContain("*Procesar* consume exactamente uno de **Entrada A** y **Entrada B**.");
  });

  test("emite ramas con Por ruta hacia estados distintos sin perder destino", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 80 }, "Aprobar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 420, y: 80 }, "Pedido"));
    const pedidoId = entidad(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [pendiente, aprobado] = estadosDeEntidad(modelo, pedidoId);
    if (!pendiente || !aprobado) throw new Error("La prueba esperaba dos estados");
    modelo = must(renombrarEstado(modelo, pendiente.id, "rechazado"));
    modelo = must(renombrarEstado(modelo, aprobado.id, "aprobado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Aprobar"), extremoEstado(aprobado.id), "resultado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Aprobar"), extremoEstado(pendiente.id), "resultado"));
    const enlaceIds = Object.values(modelo.enlaces).map((enlace) => enlace.id);
    const { formarAbanico } = require("../modelo/abanicos") as typeof import("../modelo/abanicos");
    modelo = must(formarAbanico(modelo, modelo.opdRaizId, enlaceIds, "XOR"));
    modelo = must(definirRutaEtiqueta(modelo, enlaceIds[0]!, "exitoso"));
    modelo = must(definirRutaEtiqueta(modelo, enlaceIds[1]!, "fallido"));

    const lineas = generarOpl(modelo);

    expect(lineas).toContain("Por ruta exitoso, *Aprobar* genera **Pedido** en `aprobado`.");
    expect(lineas).toContain("Por ruta fallido, *Aprobar* genera **Pedido** en `rechazado`.");
    expect(lineas).not.toContain("*Aprobar* genera exactamente uno de **Pedido** y **Pedido**.");
  });
});

describe("generarOpl", () => {
  test("genera OPL para cosas y agente", () => {
    let modelo = crearModelo();
    const objeto = crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Operador");
    expect(objeto.ok).toBe(true);
    if (!objeto.ok) return;
    modelo = objeto.value;

    const proceso = crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Rescatar");
    expect(proceso.ok).toBe(true);
    if (!proceso.ok) return;
    modelo = proceso.value;

    const operador = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Operador");
    const rescatar = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Rescatar");
    expect(operador).toBeDefined();
    expect(rescatar).toBeDefined();
    if (!operador || !rescatar) return;

    const fisico = cambiarEsencia(modelo, operador.id, "fisica");
    expect(fisico.ok).toBe(true);
    if (!fisico.ok) return;
    modelo = fisico.value;

    const enlace = crearEnlace(modelo, modelo.opdRaizId, operador.id, rescatar.id, "agente");
    expect(enlace.ok).toBe(true);
    if (!enlace.ok) return;

    expect(generarOpl(enlace.value)).toContain("**Operador** maneja *Rescatar*.");
  });

  test("genera OPL para enlaces basicos", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Whole"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 180, y: 0 }, "Part"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 120 }, "Instrumento"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 240, y: 120 }, "Proceso"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 420, y: 120 }, "Subproceso"));

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Whole"), entidad(modelo, "Part"), "agregacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Instrumento"), entidad(modelo, "Proceso"), "instrumento"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Part"), entidad(modelo, "Proceso"), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Part"), entidad(modelo, "Proceso"), "efecto"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Proceso"), entidad(modelo, "Subproceso"), "invocacion"));

    const lineas = generarOpl(modelo);
    expect(lineas).toContain("**Whole** consta de **Part**.");
    expect(lineas).toContain("*Proceso* requiere **Instrumento**.");
    expect(lineas).toContain("*Proceso* consume **Part**.");
    expect(lineas).toContain("*Proceso* afecta **Part**.");
    expect(lineas).toContain("*Proceso* invoca *Subproceso*.");
  });

  test("limita OPL al OPD solicitado", () => {
    let modelo = crearModelo();
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        "opd-2": {
          id: "opd-2",
          nombre: "SD1",
          padreId: modelo.opdRaizId,
          apariencias: {},
          enlaces: {},
        },
      },
    };
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Raiz"));
    modelo = must(crearProceso(modelo, "opd-2", { x: 0, y: 0 }, "Hijo"));

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("**Raiz** es un objeto informacional y sistémico.");
    expect(generarOpl(modelo, modelo.opdRaizId).join("\n")).not.toContain("Hijo");
    expect(generarOpl(modelo, "opd-2")).toContain("*Hijo* es un proceso informacional y sistémico.");
    expect(generarOpl(modelo, "opd-2").join("\n")).not.toContain("Raiz");
  });

  test("emite OPL de descomposicion para proceso refinado", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Atender Paciente"));
    const procesoId = entidad(modelo, "Atender Paciente");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    modelo = descompuesto.modelo;

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("*Atender Paciente* se descompone en *Atender Paciente 1*, *Atender Paciente 2* y *Atender Paciente 3* en esa secuencia.");
    expect(generarOpl(modelo, descompuesto.opdId)).toContain("*Atender Paciente* se descompone en *Atender Paciente 1*, *Atender Paciente 2* y *Atender Paciente 3* en esa secuencia.");

    modelo = must(crearProceso(modelo, descompuesto.opdId, { x: 200, y: 180 }, "Examinar"));
    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("*Atender Paciente* se descompone en *Examinar*, *Atender Paciente 1*, *Atender Paciente 2* y *Atender Paciente 3* en esa secuencia.");
  });

  test("reordena OPL de descomposicion por Y y agrupa paralelos con misma Y estricta", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Atender Paciente"));
    const procesoId = entidad(modelo, "Atender Paciente");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    modelo = descompuesto.modelo;
    modelo = must(moverApariencia(modelo, descompuesto.opdId, entidad(modelo, "Atender Paciente 3"), { x: 420, y: 280 }));

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("*Atender Paciente* se descompone en *Atender Paciente 1*, *Atender Paciente 2* y *Atender Paciente 3* en paralelo, en esa secuencia.");

    modelo = must(moverApariencia(modelo, descompuesto.opdId, entidad(modelo, "Atender Paciente 1"), { x: 285, y: 420 }));
    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("*Atender Paciente* se descompone en *Atender Paciente 2* y *Atender Paciente 3* en paralelo, *Atender Paciente 1*, en esa secuencia.");
  });

  test("no agrupa paralelos cuando las coordenadas Y son cercanas pero distintas", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Atender Paciente"));
    const procesoId = entidad(modelo, "Atender Paciente");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    modelo = descompuesto.modelo;
    modelo = must(moverApariencia(modelo, descompuesto.opdId, entidad(modelo, "Atender Paciente 3"), { x: 285, y: 282 }));

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("*Atender Paciente* se descompone en *Atender Paciente 1*, *Atender Paciente 2* y *Atender Paciente 3* en esa secuencia.");
  });

  test("emite OPL de despliegue para objeto refinado", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const objetoId = entidad(modelo, "Vehiculo");
    const desplegado = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId));
    modelo = desplegado.modelo;

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("**Vehiculo** se despliega en **Vehiculo parte 1**, **Vehiculo parte 2** y **Vehiculo parte 3**.");
    expect(generarOpl(modelo, desplegado.opdId)).toContain("**Vehiculo** se despliega en **Vehiculo parte 1**, **Vehiculo parte 2** y **Vehiculo parte 3**.");
    expect(generarOpl(modelo, desplegado.opdId)).toContain("**Vehiculo** consta de **Vehiculo parte 1**.");
  });
});

function entidad(modelo: Modelo, nombre: string): string {
  const encontrado = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  expect(encontrado).toBeDefined();
  if (!encontrado) throw new Error(`Entidad no encontrada: ${nombre}`);
  return encontrado.id;
}

function modeloConVehiculoDesplegado(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
  return must(desplegarObjeto(modelo, modelo.opdRaizId, entidad(modelo, "Vehiculo"))).modelo;
}

function agregarPartes(modeloInicial: Modelo, cantidad: number): Modelo {
  let modelo = modeloInicial;
  const objetoId = entidad(modelo, "Vehiculo");
  const opdDespliegueId = modelo.entidades[objetoId]?.refinamiento?.opdId;
  expect(opdDespliegueId).toBeDefined();
  if (!opdDespliegueId) throw new Error("Despliegue no encontrado");

  for (let index = 0; index < cantidad; index += 1) {
    const nombre = `Vehiculo parte ${index + 4}`;
    modelo = must(crearObjeto(modelo, opdDespliegueId, { x: 90 + index * 130, y: 230 }, nombre));
    modelo = must(crearEnlace(modelo, opdDespliegueId, objetoId, entidad(modelo, nombre), "agregacion"));
  }

  return modelo;
}

function aparienciaDeEntidad(modelo: Modelo, opdId: string, entidadId: string): Apariencia {
  const apariencia = Object.values(modelo.opds[opdId]?.apariencias ?? {})
    .find((item) => item.entidadId === entidadId);
  expect(apariencia).toBeDefined();
  if (!apariencia) throw new Error(`Apariencia no encontrada: ${entidadId}`);
  return apariencia;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
