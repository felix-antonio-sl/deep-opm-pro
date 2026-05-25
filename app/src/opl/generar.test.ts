import { describe, expect, test } from "bun:test";
import { extremoEstado } from "../modelo/extremos";
import { crearAutoInvocacion } from "../modelo/autoinvocacion";
import { renombrarEtiquetaEnlace } from "../modelo/etiquetasEnlace";
import { aplicarEstiloApariencia } from "../modelo/estilos";
import { aplicarModificador, definirDemora, definirProbabilidad } from "../modelo/modificadores";
import { ajustarMultiplicidad, cambiarEsencia, crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, definirBackwardTag, definirTiempoExcepcionEnlace, designarEstadoFinal, designarEstadoInicial, descomponerProceso, agregarEstado, desplegarObjeto, estadosDeEntidad, moverApariencia, renombrarEstado } from "../modelo/operaciones";
import { cambiarModoPlegado } from "../modelo/plegado";
import { definirRutaEtiqueta } from "../modelo/rutas";
import type { Apariencia, Modelo, Resultado } from "../modelo/tipos";
import { generarOplEstructurado, generarOplTexto } from "../modelo/opl/generador-opl";
import { ordenarOpdsParaOpl } from "./bloquesJerarquicos";
import { generarOpl, generarOplInteractivo } from "./generar";

describe("OPL-ES — tipos de enlace canonicos", () => {
  test("lineas interactivas exponen opdId para bloques jerarquicos", () => {
    let modelo = crearModelo("Metadatos OPL");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Sistema"));

    const [linea] = generarOplInteractivo(modelo);

    expect(linea?.opdId).toBe(modelo.opdRaizId);
    expect(linea?.opdNombre).toBe("SD");
    expect(linea?.opdProfundidad).toBe(0);
  });

  test("R-NOM-OBJ-1 normaliza underscores internos a nombre canonico legible", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Hospitalización_domiciliaria"));

    const texto = generarOpl(modelo).join("\n");

    expect(texto).toContain("**Hospitalización Domiciliaria** es informacional.");
    expect(texto).toContain("**Hospitalización Domiciliaria** es sistémico.");
    expect(texto).not.toContain("Hospitalización_domiciliaria");
  });

  test("R-NOM-PROC-1 no emite OPL para procesos placeholder", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Proceso"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "Resultado_clínico"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Proceso"), entidad(modelo, "Resultado_clínico"), "resultado"));

    const texto = generarOpl(modelo).join("\n");

    expect(texto).not.toContain("*Proceso*");
    expect(texto).not.toContain("genera");
    expect(texto).toContain("**Resultado Clínico** es informacional.");
  });

  test("R-NOM-EST-1 suprime estados placeholder de la OPL canonica", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    const objetoId = entidad(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, objetoId)).modelo;

    const texto = generarOpl(modelo).join("\n");

    expect(texto).not.toContain("puede estar");
    expect(texto).not.toContain("estado1");
    expect(texto).not.toContain("estado2");
  });

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

  test("etiquetado estructural unidireccional usa tag como verbo y default OPCloud", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Sistema"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 180, y: 0 }, "Requisito"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Sistema"), entidad(modelo, "Requisito"), "etiquetado"));
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");

    expect(generarOpl(modelo)).toContain("**Sistema** se relaciona con **Requisito**.");

    modelo = must(renombrarEtiquetaEnlace(modelo, enlaceId, "satisface"));
    expect(generarOpl(modelo)).toContain("**Sistema** satisface **Requisito**.");
  });

  test("etiquetado estructural bidireccional emite forward y backward tag", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 180, y: 0 }, "Parte"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Todo"), entidad(modelo, "Parte"), "etiquetadoBidireccional"));
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    modelo = must(renombrarEtiquetaEnlace(modelo, enlaceId, "contiene"));
    modelo = must(definirBackwardTag(modelo, enlaceId, "pertenece a"));

    expect(generarOpl(modelo)).toContain("**Todo** contiene **Parte**, y **Parte** pertenece a **Todo**.");
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

  test("imagen de objeto no cambia OPL", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Entrada"));
    const antes = generarOpl(modelo);
    const entrada = entidad(modelo, "Entrada");

    modelo = {
      ...modelo,
      entidades: {
        ...modelo.entidades,
        [entrada]: {
          ...modelo.entidades[entrada]!,
          imagen: { url: "https://example.com/entrada.png", modo: "imagen-texto" },
        },
      },
    };

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

  test("excepciones temporales emiten OPL canonico de sobretiempo y subtiempo", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Preparar"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Manejar Demora"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 400, y: 0 }, "Manejar Omision"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Preparar"), entidad(modelo, "Manejar Demora"), "excepcionSobretiempo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Preparar"), entidad(modelo, "Manejar Omision"), "excepcionSubtiempo"));
    const sobre = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "excepcionSobretiempo")?.id;
    const sub = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "excepcionSubtiempo")?.id;
    if (!sobre || !sub) throw new Error("La prueba esperaba enlaces de excepcion temporal");
    modelo = must(definirTiempoExcepcionEnlace(modelo, sobre, { tiempoMaximo: "30", unidadTiempoMaximo: "s" }));
    modelo = must(definirTiempoExcepcionEnlace(modelo, sub, { tiempoMinimo: "5", unidadTiempoMinimo: "s" }));

    expect(generarOpl(modelo)).toContain("*Manejar Demora* ocurre si duración de *Preparar* excede 30 s.");
    expect(generarOpl(modelo)).toContain("*Manejar Omision* ocurre si duración de *Preparar* es menor que 5 s.");
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

    expect(generarOpl(modelo)).toContain("**Orden** inicia *Aprobar*, que consume **Orden** (probabilidad: 70%).");
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

    expect(generarOpl(modelo)).toContain("*Aprobar* ocurre si **Orden** existe, en cuyo caso **Orden** se consume, de lo contrario *Aprobar* se omite.");
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

  test("estado de objeto emite puede estar con disyuncion y designaciones", () => {
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

    expect(generarOpl(modelo)).toContain("**Pedido** puede estar `pendiente` (inicial) o `cerrado` (final).");
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

    const lineas = generarOpl(modelo);
    expect(lineas).not.toContain("**Orden** puede estar `abierta` (inicial y final) o `estado2`.");
    expect(lineas).toContain("**Orden** en `abierta` es inicial.");
    expect(lineas).toContain("**Orden** en `abierta` es final.");
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

    expect(generarOpl(modelo)).toContain("**Ticket** puede estar `nuevo`, `en curso` o `resuelto`.");
  });

  test("consumo desde Estado conserva consumo y califica estado", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "Aprobar"));
    const pedidoId = entidad(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [pendiente] = estadosDeEntidad(modelo, pedidoId);
    if (!pendiente) throw new Error("La prueba esperaba estado");
    modelo = must(renombrarEstado(modelo, pendiente.id, "pendiente"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendiente.id), entidad(modelo, "Aprobar"), "consumo"));

    expect(generarOpl(modelo)).toContain("*Aprobar* consume **Pedido** en `pendiente`.");
  });

  test("resultado hacia Estado conserva resultado y califica estado", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "Aprobar"));
    const pedidoId = entidad(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [, aprobado] = estadosDeEntidad(modelo, pedidoId);
    if (!aprobado) throw new Error("La prueba esperaba estado");
    modelo = must(renombrarEstado(modelo, aprobado.id, "aprobado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Aprobar"), extremoEstado(aprobado.id), "resultado"));

    expect(generarOpl(modelo)).toContain("*Aprobar* genera **Pedido** en `aprobado`.");
  });

  test("BUG-20260520T190141Z-a054e1 no emite cambios parciales entre estados de objetos distintos", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Objeto_4"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 120 }, "Procesar 2"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 440, y: 0 }, "Objeto_8"));
    const objetoEntradaId = entidad(modelo, "Objeto_4");
    const objetoSalidaId = entidad(modelo, "Objeto_8");
    modelo = must(crearEstadosIniciales(modelo, objetoEntradaId)).modelo;
    modelo = must(crearEstadosIniciales(modelo, objetoSalidaId)).modelo;
    const [estadoEntrada] = estadosDeEntidad(modelo, objetoEntradaId);
    const [estadoSalida] = estadosDeEntidad(modelo, objetoSalidaId);
    if (!estadoEntrada || !estadoSalida) throw new Error("La prueba esperaba estados");
    modelo = must(renombrarEstado(modelo, estadoSalida.id, "e1"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(estadoEntrada.id), entidad(modelo, "Procesar 2"), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Procesar 2"), extremoEstado(estadoSalida.id), "resultado"));

    const lineas = generarOpl(modelo);

    expect(lineas).not.toContain("*Procesar 2* consume **Objeto 4** en `estado1`.");
    expect(lineas).toContain("*Procesar 2* genera **Objeto 8** en `e1`.");
    expect(lineas).not.toContain("*Procesar 2* cambia **Objeto 4** de `estado1`.");
    expect(lineas).not.toContain("*Procesar 2* cambia **Objeto 8** a `e1`.");
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

  test("abanico de resultados hacia estados agrupa estados sin repetir el objeto", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 60 }, "Objeto_2"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 220 }, "Procesar"));
    const objetoId = entidad(modelo, "Objeto_2");
    const procesoId = entidad(modelo, "Procesar");

    const estados = must(crearEstadosIniciales(modelo, objetoId));
    modelo = estados.modelo;
    const [e1Id, e2Id] = estados.estadoIds;
    modelo = must(renombrarEstado(modelo, e1Id, "e1"));
    modelo = must(renombrarEstado(modelo, e2Id, "e2"));
    const e3 = must(agregarEstado(modelo, objetoId, "e3"));
    modelo = e3.modelo;

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(e1Id), procesoId, "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesoId, extremoEstado(e2Id), "resultado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesoId, extremoEstado(e3.estadoId), "resultado"));
    const resultados = Object.values(modelo.enlaces)
      .filter((enlace) => enlace.tipo === "resultado")
      .map((enlace) => enlace.id);
    modelo = {
      ...modelo,
      enlaces: Object.fromEntries(Object.entries(modelo.enlaces).map(([id, enlace]) => [
        id,
        resultados.includes(id) && enlace.origenId.kind === "entidad"
          ? { ...enlace, origenId: { ...enlace.origenId, portId: "port-fan-resultados-estados" } }
          : enlace,
      ])),
    };
    modelo = {
      ...modelo,
      abanicos: {
        "ab-resultados-estados": {
          id: "ab-resultados-estados",
          opdId: modelo.opdRaizId,
          puertoComun: { entidadId: procesoId, lado: "origen", portId: "port-fan-resultados-estados" },
          puertoEntidadId: procesoId,
          operador: "O",
          enlaceIds: resultados,
        },
      },
    };

    const lineas = generarOpl(modelo);
    expect(lineas).toContain("*Procesar* cambia **Objeto 2** a al menos uno de `e2` y `e3`.");
    expect(lineas).not.toContain("*Proceso* genera al menos uno de **Objeto 2** y **Objeto 2**.");

    const lineaInteractiva = generarOplInteractivo(modelo).find((linea) => linea.texto.includes("cambia **Objeto 2** a al menos uno de"));
    expect(lineaInteractiva).toBeDefined();
    expect(lineaInteractiva?.tokens.some((token) => token.markdown === "estado" && token.texto === "`e2`")).toBe(true);
    expect(lineaInteractiva?.tokens.some((token) => token.markdown === "estado" && token.texto === "`e3`")).toBe(true);
  });

  test("abanico XOR de resultados a estados no emite transicion determinista paralela", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 60 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 220 }, "Aprobar"));
    const pedidoId = entidad(modelo, "Pedido");
    const procesoId = entidad(modelo, "Aprobar");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [pendiente, aprobado] = estadosDeEntidad(modelo, pedidoId);
    if (!pendiente || !aprobado) throw new Error("La prueba esperaba dos estados");
    modelo = must(renombrarEstado(modelo, pendiente.id, "pendiente"));
    modelo = must(renombrarEstado(modelo, aprobado.id, "aprobado"));
    const rechazado = must(agregarEstado(modelo, pedidoId, "rechazado"));
    modelo = rechazado.modelo;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendiente.id), procesoId, "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesoId, extremoEstado(aprobado.id), "resultado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesoId, extremoEstado(rechazado.estadoId), "resultado"));
    const resultados = Object.values(modelo.enlaces)
      .filter((enlace) => enlace.tipo === "resultado")
      .map((enlace) => enlace.id);
    const { formarAbanico } = require("../modelo/abanicos") as typeof import("../modelo/abanicos");
    modelo = must(formarAbanico(modelo, modelo.opdRaizId, resultados, "XOR"));

    const lineas = generarOpl(modelo);

    expect(lineas).toContain("*Aprobar* cambia **Pedido** a exactamente uno de `aprobado` y `rechazado`.");
    expect(lineas).not.toContain("*Aprobar* cambia **Pedido** de `pendiente` a `aprobado`.");
    expect(lineas).not.toContain("*Aprobar* cambia **Pedido** de `pendiente` a `rechazado`.");
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

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("**Vehiculo** se lista con **Vehiculo parte 1**, **Vehiculo parte 2** y **Vehiculo parte 3** y 2 partes más como rasgos.");
  });

  test("plegado parcial con tres partes enumera todo sin contador", () => {
    let modelo = modeloConVehiculoDesplegado();
    const objetoId = entidad(modelo, "Vehiculo");
    const apariencia = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, apariencia.id, "parcial"));

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("**Vehiculo** se lista con **Vehiculo parte 1**, **Vehiculo parte 2** y **Vehiculo parte 3** como rasgos.");
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
    expect(interactivo.map((linea) => linea.id)).toEqual(["opl-opd-1-1", "opl-opd-1-2", "opl-opd-1-3", "opl-opd-1-4", "opl-opd-1-5"]);
  });

  test("texto plano e interactivo son identicos por OPD", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Atender Paciente"));
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, entidad(modelo, "Atender Paciente")));
    modelo = descompuesto.modelo;
    modelo = must(crearObjeto(modelo, descompuesto.opdId, { x: 210, y: 140 }, "Ficha"));
    modelo = must(crearEnlace(modelo, descompuesto.opdId, entidad(modelo, "Ficha"), entidad(modelo, "Atender Paciente 1"), "consumo"));

    for (const opdId of ordenarOpdsParaOpl(modelo)) {
      expect(generarOpl(modelo, opdId)).toEqual(
        generarOplInteractivo(modelo, opdId).map((linea) => linea.texto),
      );
    }
  });

  test("generador legacy delega al texto canonico por OPD", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), entidad(modelo, "Procesar"), "consumo"));

    const bloquesEsperados = ordenarOpdsParaOpl(modelo).map((opdId) => ({
      opdId,
      opdNombre: modelo.opds[opdId]!.nombre,
      sentencias: generarOpl(modelo, opdId),
    }));

    expect(generarOplEstructurado(modelo)).toEqual(bloquesEsperados);
    expect(generarOplTexto(modelo)).toBe(`${bloquesEsperados.flatMap((bloque) => bloque.sentencias).join("\n")}\n`);
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

    expect(generarOpl(modelo, "opd-2")).toEqual(["*Hijo* es informacional.", "*Hijo* es sistémico."]);
  });

  test("entidad sin enlaces conserva su declaracion", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Nodo"));

    expect(generarOpl(modelo)).toEqual(["**Nodo** es informacional.", "**Nodo** es sistémico."]);
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
    modelo = fijarPuertoCompartidoEnlaces(modelo, enlaceIds, "destino");
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
    modelo = fijarPuertoCompartidoEnlaces(modelo, enlaceIds, "destino");
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
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 240, y: 120 }, "Procesar"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 420, y: 120 }, "Subprocesar"));

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Whole"), entidad(modelo, "Part"), "agregacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Instrumento"), entidad(modelo, "Procesar"), "instrumento"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Part"), entidad(modelo, "Procesar"), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Part"), entidad(modelo, "Procesar"), "efecto"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Procesar"), entidad(modelo, "Subprocesar"), "invocacion"));

    const lineas = generarOpl(modelo);
    expect(lineas).toContain("**Whole** consta de **Part**.");
    expect(lineas).toContain("*Procesar* requiere **Instrumento**.");
    expect(lineas).toContain("*Procesar* consume **Part**.");
    expect(lineas).toContain("*Procesar* afecta **Part**.");
    expect(lineas).toContain("*Procesar* invoca *Subprocesar*.");
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

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("**Raiz** es informacional.");
    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("**Raiz** es sistémico.");
    expect(generarOpl(modelo, modelo.opdRaizId).join("\n")).not.toContain("Hijo");
    expect(generarOpl(modelo, "opd-2")).toContain("*Hijo* es informacional.");
    expect(generarOpl(modelo, "opd-2")).toContain("*Hijo* es sistémico.");
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

    const contorno = aparienciaDeEntidad(modelo, descompuesto.opdId, procesoId);
    modelo = must(crearProceso(modelo, descompuesto.opdId, { x: contorno.x + 50, y: contorno.y + 90 }, "Examinar"));
    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("*Atender Paciente* se descompone en *Examinar*, *Atender Paciente 1*, *Atender Paciente 2* y *Atender Paciente 3* en esa secuencia.");
  });

  test("emite OPL de descomposicion para objeto refinado con componentes", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, entidad(modelo, "Vehiculo")));
    modelo = descompuesto.modelo;

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("**Vehiculo** se descompone en **Vehiculo 1**, **Vehiculo 2** y **Vehiculo 3** en esa secuencia.");
    expect(generarOpl(modelo, descompuesto.opdId)).toContain("**Vehiculo** se descompone en **Vehiculo 1**, **Vehiculo 2** y **Vehiculo 3** en esa secuencia.");
  });

  test("descomposicion de objeto en OPL interactivo separa refs y hints de operaciones internas", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const vehiculoId = entidad(modelo, "Vehiculo");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, vehiculoId));
    modelo = descompuesto.modelo;
    const contornoVehiculo = aparienciaDeEntidad(modelo, descompuesto.opdId, vehiculoId);
    modelo = must(crearProceso(modelo, descompuesto.opdId, { x: contornoVehiculo.x + 155, y: contornoVehiculo.y + 260 }, "Inspeccionar"));

    const interactivo = generarOplInteractivo(modelo, descompuesto.opdId);
    const linea = interactivo.find((item) => item.texto.includes("Vehiculo") && item.texto.includes("se descompone en"));
    expect(linea?.texto).toBe("**Vehiculo** se descompone en **Vehiculo 1**, **Vehiculo 2** y **Vehiculo 3** en esa secuencia, así como *Inspeccionar*.");
    expect(linea?.refs).toEqual(expect.arrayContaining([
      expect.objectContaining({ tipo: "entidad", id: entidad(modelo, "Vehiculo") }),
      expect.objectContaining({ tipo: "entidad", id: entidad(modelo, "Vehiculo 1") }),
      expect.objectContaining({ tipo: "entidad", id: entidad(modelo, "Inspeccionar") }),
    ]));
    expect(linea?.tokens).toEqual(expect.arrayContaining([
      expect.objectContaining({ texto: "**Vehiculo 1**", markdown: "objeto" }),
      expect.objectContaining({ texto: "*Inspeccionar*", markdown: "proceso" }),
    ]));
  });

  test("reordena OPL de descomposicion por Y y agrupa paralelos con tolerancia", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Atender Paciente"));
    const procesoId = entidad(modelo, "Atender Paciente");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    modelo = descompuesto.modelo;
    const contorno = aparienciaDeEntidad(modelo, descompuesto.opdId, procesoId);
    modelo = must(moverApariencia(modelo, descompuesto.opdId, entidad(modelo, "Atender Paciente 3"), { x: contorno.x + 270, y: contorno.y + 190 }));

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("*Atender Paciente* se descompone en *Atender Paciente 1*, paralelo *Atender Paciente 2* y *Atender Paciente 3*, en esa secuencia.");

    modelo = must(moverApariencia(modelo, descompuesto.opdId, entidad(modelo, "Atender Paciente 1"), { x: contorno.x + 135, y: contorno.y + 330 }));
    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("*Atender Paciente* se descompone en paralelo *Atender Paciente 2* y *Atender Paciente 3*, *Atender Paciente 1*, en esa secuencia.");
  });

  test("no agrupa paralelos cuando las coordenadas Y exceden la tolerancia", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Atender Paciente"));
    const procesoId = entidad(modelo, "Atender Paciente");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    modelo = descompuesto.modelo;
    const contorno = aparienciaDeEntidad(modelo, descompuesto.opdId, procesoId);
    modelo = must(moverApariencia(modelo, descompuesto.opdId, entidad(modelo, "Atender Paciente 3"), { x: contorno.x + 135, y: contorno.y + 195 }));

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
  const opdDespliegueId = modelo.entidades[objetoId]?.refinamientos?.despliegue?.opdId;
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

function fijarPuertoCompartidoEnlaces(modelo: Modelo, enlaceIds: string[], lado: "origen" | "destino"): Modelo {
  const campo = lado === "origen" ? "origenId" : "destinoId";
  const enlaces = { ...modelo.enlaces };
  for (const enlaceId of enlaceIds) {
    const enlace = enlaces[enlaceId];
    if (!enlace) continue;
    const extremo = enlace[campo];
    if (extremo.kind !== "entidad") continue;
    enlaces[enlaceId] = { ...enlace, [campo]: { ...extremo, portId: `port-test-${lado}` } };
  }
  return { ...modelo, enlaces };
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

// ── HU-50.013: Despliegue "se despliega en" ──

describe("HU-50.013 despliegue interactivo", () => {
  test("emite oracion 'se despliega en' con tokens nombre por destino", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const desplegado = must(desplegarObjeto(modelo, modelo.opdRaizId, entidad(modelo, "Vehiculo")));
    modelo = desplegado.modelo;

    // Colocar hijos DENTRO del contorno de Vehiculo (200,120, 135x60 → x:200-335, y:120-180)
    modelo = must(crearObjeto(modelo, desplegado.opdId, { x: 210, y: 140 }, "Motor"));
    modelo = must(crearObjeto(modelo, desplegado.opdId, { x: 280, y: 140 }, "Rueda"));
    modelo = must(crearEnlace(modelo, desplegado.opdId, entidad(modelo, "Vehiculo"), entidad(modelo, "Motor"), "agregacion"));
    modelo = must(crearEnlace(modelo, desplegado.opdId, entidad(modelo, "Vehiculo"), entidad(modelo, "Rueda"), "agregacion"));

    // En el OPD hijo, el refinamiento genera la oración de despliegue
    const interactivoHijo = generarOplInteractivo(modelo, desplegado.opdId);
    const lineaDespliegue = interactivoHijo.find((linea) => linea.texto.includes("se despliega en"));
    expect(lineaDespliegue).toBeDefined();

    // Cada destino debe tener su propio token nombre
    const tokensNombres = lineaDespliegue!.tokens.filter((t) => t.rol === "nombre");
    expect(tokensNombres.length).toBeGreaterThanOrEqual(2);
  });

  test("emite oracion despliegue con enlace refs para multi-destino", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const desplegado = must(desplegarObjeto(modelo, modelo.opdRaizId, entidad(modelo, "Vehiculo")));
    modelo = desplegado.modelo;

    modelo = must(crearObjeto(modelo, desplegado.opdId, { x: 210, y: 140 }, "Parte A"));
    modelo = must(crearObjeto(modelo, desplegado.opdId, { x: 280, y: 140 }, "Parte B"));
    modelo = must(crearEnlace(modelo, desplegado.opdId, entidad(modelo, "Vehiculo"), entidad(modelo, "Parte A"), "agregacion"));
    modelo = must(crearEnlace(modelo, desplegado.opdId, entidad(modelo, "Vehiculo"), entidad(modelo, "Parte B"), "agregacion"));

    // En el OPD hijo el refinamiento identifica los hijos y emite refs de enlace
    const interactivoHijo = generarOplInteractivo(modelo, desplegado.opdId);
    const lineaDespliegue = interactivoHijo.find((linea) => linea.texto.includes("se despliega en"));
    expect(lineaDespliegue).toBeDefined();

    // HU-50.021: cada destino debe llevar ref del enlace especifico
    const refsEnlace = lineaDespliegue!.refs.filter((ref) => ref.tipo === "enlace");
    expect(refsEnlace.length).toBeGreaterThanOrEqual(2);
  });
});

// ── HU-50.015: Especializacion "es un/una" ──

describe("HU-50.015 especializacion interactiva", () => {
  test("emite 'es un' para generalizacion en enlace individual", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const desplegado = must(desplegarObjeto(modelo, modelo.opdRaizId, entidad(modelo, "Vehiculo"), "generalizacion"));
    modelo = desplegado.modelo;

    // Colocar hijo DENTRO del contorno de Vehiculo
    modelo = must(crearObjeto(modelo, desplegado.opdId, { x: 220, y: 140 }, "Auto"));
    modelo = must(crearEnlace(modelo, desplegado.opdId, entidad(modelo, "Vehiculo"), entidad(modelo, "Auto"), "generalizacion"));

    // Buscar en las oraciones de enlace individual (no en la de refinamiento que
    // incluye las partes por defecto creadas por desplegarObjeto)
    const interactivoHijo = generarOplInteractivo(modelo, desplegado.opdId);
    const lineaEnlace = interactivoHijo.find(
      (linea) =>
        linea.texto.includes("es un") &&
        linea.refs.some((ref) => ref.tipo === "enlace"),
    );
    expect(lineaEnlace).toBeDefined();
  });

  test("emite token verbo 'es un' con ref de enlace", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Vehiculo"));
    const desplegado = must(desplegarObjeto(modelo, modelo.opdRaizId, entidad(modelo, "Vehiculo"), "generalizacion"));
    modelo = desplegado.modelo;

    modelo = must(crearObjeto(modelo, desplegado.opdId, { x: 220, y: 140 }, "Auto"));
    const enlaceId = Object.keys(modelo.enlaces).find(
      (id) => modelo.enlaces[id]?.tipo === "generalizacion",
    );

    const interactivoHijo = generarOplInteractivo(modelo, desplegado.opdId);
    // Buscar en la oración de enlace individual (no en la de refinamiento)
    const lineaEnlace = interactivoHijo.find(
      (linea) =>
        linea.texto.includes("es un") &&
        linea.refs.some((ref) => ref.tipo === "enlace"),
    );
    expect(lineaEnlace).toBeDefined();

    // Debe tener token verbo
    const tokenVerbo = lineaEnlace!.tokens.find((t) => t.rol === "verbo");
    expect(tokenVerbo).toBeDefined();
    if (tokenVerbo?.ref) {
      expect(tokenVerbo.ref.tipo).toBe("enlace");
    }
  });
});

// ── HU-50.021: Tokens multi-destino con refs distintas ──

describe("HU-50.021 tokens multi-destino", () => {
  test("oracion de refinamiento con N destinos emite tokens nombre por cada destino", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Todo"));
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, entidad(modelo, "Todo")));
    modelo = descompuesto.modelo;

    // Colocar 3 hijos DENTRO del contorno de Todo
    modelo = must(crearProceso(modelo, descompuesto.opdId, { x: 210, y: 140 }, "Parte A"));
    modelo = must(crearProceso(modelo, descompuesto.opdId, { x: 280, y: 140 }, "Parte B"));
    modelo = must(crearProceso(modelo, descompuesto.opdId, { x: 210, y: 170 }, "Parte C"));
    modelo = must(crearEnlace(modelo, descompuesto.opdId, entidad(modelo, "Todo"), entidad(modelo, "Parte A"), "invocacion"));
    modelo = must(crearEnlace(modelo, descompuesto.opdId, entidad(modelo, "Todo"), entidad(modelo, "Parte B"), "invocacion"));
    modelo = must(crearEnlace(modelo, descompuesto.opdId, entidad(modelo, "Todo"), entidad(modelo, "Parte C"), "invocacion"));

    const interactivo = generarOplInteractivo(modelo, descompuesto.opdId);
    const lineaRefinamiento = interactivo.find((linea) => linea.texto.includes("se descompone en"));
    expect(lineaRefinamiento).toBeDefined();

    const tokensNombres = lineaRefinamiento!.tokens.filter((t) => t.rol === "nombre");
    // Debe haber al menos 3 tokens nombre (uno para cada destino)
    expect(tokensNombres.length).toBeGreaterThanOrEqual(3);
  });

  test("enlace en oracion multi-destino lleva ref en el token nombre del destino", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Todo"));
    const todoId = entidad(modelo, "Todo");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, todoId));
    modelo = descompuesto.modelo;

    const contornoTodo = aparienciaDeEntidad(modelo, descompuesto.opdId, todoId);
    modelo = must(crearProceso(modelo, descompuesto.opdId, { x: contornoTodo.x + 70, y: contornoTodo.y + 50 }, "Parte X"));
    modelo = must(crearProceso(modelo, descompuesto.opdId, { x: contornoTodo.x + 140, y: contornoTodo.y + 50 }, "Parte Y"));
    modelo = must(crearEnlace(modelo, descompuesto.opdId, entidad(modelo, "Todo"), entidad(modelo, "Parte X"), "invocacion"));
    modelo = must(crearEnlace(modelo, descompuesto.opdId, entidad(modelo, "Todo"), entidad(modelo, "Parte Y"), "invocacion"));

    const interactivo = generarOplInteractivo(modelo, descompuesto.opdId);
    const lineaRefinamiento = interactivo.find((linea) => linea.texto.includes("se descompone en"));
    expect(lineaRefinamiento).toBeDefined();

    // La linea debe tener refs de enlace (multi-enlace) - HU-50.021
    const refsEnlace = lineaRefinamiento!.refs.filter((ref) => ref.tipo === "enlace");
    expect(refsEnlace.length).toBeGreaterThanOrEqual(2);

    // Los tokens nombre de los destinos deben tener ref de enlace
    const tokensConRefEnlace = lineaRefinamiento!.tokens.filter(
      (t) => t.rol === "nombre" && t.ref?.tipo === "enlace",
    );
    expect(tokensConRefEnlace.length).toBeGreaterThanOrEqual(2);
  });
});

// ── HU-50.016: coloracion de tokens por clase ──

describe("HU-50.016 coloreado de tokens", () => {
  test("objeto recibe markdown 'objeto' con color verde", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "ObjetoTest"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 100 }, "ProcesoTest"));

    const interactivo = generarOplInteractivo(modelo, modelo.opdRaizId);
    const tokenObjeto = interactivo
      .flatMap((linea) => linea.tokens)
      .find((t) => t.markdown === "objeto" && t.texto.includes("ObjetoTest"));
    expect(tokenObjeto).toBeDefined();

    const tokenProceso = interactivo
      .flatMap((linea) => linea.tokens)
      .find((t) => t.markdown === "proceso" && t.texto.includes("ProcesoTest"));
    expect(tokenProceso).toBeDefined();
  });

  test("estado recibe markdown 'estado'", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Ticket"));
    const objId = entidad(modelo, "Ticket");
    const resultado = crearEstadosIniciales(modelo, objId);
    modelo = must(resultado).modelo;
    const [primero, segundo] = estadosDeEntidad(modelo, objId);
    if (!primero || !segundo) throw new Error("La prueba esperaba estados");
    modelo = must(renombrarEstado(modelo, primero.id, "nuevo"));
    modelo = must(renombrarEstado(modelo, segundo.id, "cerrado"));

    const interactivo = generarOplInteractivo(modelo, modelo.opdRaizId);
    const tokenEstado = interactivo
      .flatMap((linea) => linea.tokens)
      .find((t) => t.markdown === "estado");
    expect(tokenEstado).toBeDefined();
  });
});
