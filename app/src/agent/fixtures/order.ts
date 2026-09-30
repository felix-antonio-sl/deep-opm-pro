import { formarAbanico } from "../../modelo/abanicos";
import { descomponerProceso } from "../../modelo/operaciones/refinamiento/descomposicion";
import { agregarEstado, compartirAnclaExtremosEnlaces, crearEnlace, crearModelo, crearObjeto, crearProceso, crearEstadosIniciales } from "../../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../../modelo/tipos";

export interface OrderFixture {
  model: Modelo;
  ids: {
    order: Id;
    prepare: Id;
    chooseRoute: Id;
    pickup: Id;
    delivery: Id;
    pickupLink: Id;
    deliveryLink: Id;
    initialState: Id;
    readyState: Id;
    refinementOpd: Id;
  };
}

/** Synthetic kernel fixture: route alternatives are XOR; preparation is refined. */
export function createOrderFixture(): OrderFixture {
  let model = crearModelo("Pedido sintético");
  model = value(crearObjeto(model, model.opdRaizId, { x: 80, y: 150 }, "Pedido"));
  const order = byName(model, "Pedido");
  const initial = value(crearEstadosIniciales(model, order.id));
  model = initial.modelo;
  const extra = value(agregarEstado(model, order.id, "Listo"));
  model = extra.modelo;

  model = value(crearProceso(model, model.opdRaizId, { x: 380, y: 90 }, "Preparar pedido"));
  const prepare = byName(model, "Preparar pedido");
  model = value(crearProceso(model, model.opdRaizId, { x: 650, y: 220 }, "Elegir ruta"));
  const chooseRoute = byName(model, "Elegir ruta");
  model = value(crearProceso(model, model.opdRaizId, { x: 920, y: 100 }, "Retiro presencial"));
  const pickup = byName(model, "Retiro presencial");
  model = value(crearProceso(model, model.opdRaizId, { x: 920, y: 340 }, "Reparto"));
  const delivery = byName(model, "Reparto");

  model = value(crearEnlace(model, model.opdRaizId, chooseRoute.id, pickup.id, "invocacion"));
  const pickupLink = newestLink(model);
  model = value(crearEnlace(model, model.opdRaizId, chooseRoute.id, delivery.id, "invocacion"));
  const deliveryLink = newestLink(model);
  model = value(compartirAnclaExtremosEnlaces(model, model.opdRaizId, [pickupLink, deliveryLink], "origen", "E"));
  model = value(formarAbanico(model, model.opdRaizId, [pickupLink, deliveryLink], "XOR"));

  const refined = value(descomponerProceso(model, model.opdRaizId, prepare.id));
  model = refined.modelo;
  return {
    model,
    ids: {
      order: order.id,
      prepare: prepare.id,
      chooseRoute: chooseRoute.id,
      pickup: pickup.id,
      delivery: delivery.id,
      pickupLink,
      deliveryLink,
      initialState: initial.estadoIds[0],
      readyState: extra.estadoId,
      refinementOpd: refined.opdId,
    },
  };
}

function byName(model: Modelo, name: string) {
  const entity = Object.values(model.entidades).find((item) => item.nombre === name);
  if (!entity) throw new Error(`Fixture inválido: falta ${name}`);
  return entity;
}

function newestLink(model: Modelo): Id {
  const link = Object.values(model.enlaces).at(-1);
  if (!link) throw new Error("Fixture inválido: falta enlace");
  return link.id;
}

function value<T>(result: Resultado<T>): T {
  if (!result.ok) throw new Error(`Fixture inválido: ${result.error}`);
  return result.value;
}
