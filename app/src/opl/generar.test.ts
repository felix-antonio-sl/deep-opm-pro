import { describe, expect, test } from "bun:test";
import { cambiarEsencia, crearEnlace, crearModelo, crearObjeto, crearProceso, descomponerProceso, desplegarObjeto, moverApariencia } from "../modelo/operaciones";
import type { Modelo, Resultado } from "../modelo/tipos";
import { generarOpl } from "./generar";

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

  test("reordena OPL de descomposicion por Y y agrupa paralelos con tolerancia", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Atender Paciente"));
    const procesoId = entidad(modelo, "Atender Paciente");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    modelo = descompuesto.modelo;
    modelo = must(moverApariencia(modelo, descompuesto.opdId, entidad(modelo, "Atender Paciente 3"), { x: 285, y: 282 }));

    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("*Atender Paciente* se descompone en *Atender Paciente 1*, *Atender Paciente 2* y *Atender Paciente 3* en paralelo.");

    modelo = must(moverApariencia(modelo, descompuesto.opdId, entidad(modelo, "Atender Paciente 1"), { x: 285, y: 420 }));
    expect(generarOpl(modelo, modelo.opdRaizId)).toContain("*Atender Paciente* se descompone en *Atender Paciente 2* y *Atender Paciente 3* en paralelo, *Atender Paciente 1*.");
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

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
