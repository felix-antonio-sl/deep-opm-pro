import { refinaA } from "./refinamientos";
import type { Id, Modelo, Opd, Resultado } from "./tipos";

// ─── Ayudantes privados ────────────────────────────────────────────

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}

function hijoDe(modelo: Modelo, opdId: Id | null): Opd[] {
  return Object.values(modelo.opds).filter((opd) => opd.padreId === opdId);
}

function descendientes(modelo: Modelo, opdId: Id): Set<Id> {
  const resultado = new Set<Id>();
  const pila = [opdId];
  while (pila.length > 0) {
    const actual = pila.pop()!;
    for (const hijo of hijoDe(modelo, actual)) {
      if (!resultado.has(hijo.id)) {
        resultado.add(hijo.id);
        pila.push(hijo.id);
      }
    }
  }
  return resultado;
}

function esRaiz(modelo: Modelo, opdId: Id): boolean {
  return opdId === modelo.opdRaizId;
}

/** Copia superficial de todos los OPDs del modelo. */
function cloneOpds(modelo: Modelo): Record<Id, Opd> {
  return Object.fromEntries(
    Object.entries(modelo.opds).map(([id, opd]) => [id, { ...opd }]),
  ) as Record<Id, Opd>;
}

/** Reemplaza un OPD en el record clonado, preservando campos obligatorios. */
function setOpd(
  opds: Record<Id, Opd>,
  opd: Opd,
  patch: Partial<Pick<Opd, "padreId" | "ordenLocal">>,
): Opd {
  const actualizado: Opd = { ...opd, ...patch };
  opds[opd.id] = actualizado;
  return actualizado;
}

// ─── API pública ────────────────────────────────────────────────────

/**
 * Lista los ids de los hermanos de `opdId` (opds que comparten `padreId`).
 * Ordenados según `ordenLocal` si existe; si no, alfabético por id.
 */
export function listarHermanos(modelo: Modelo, opdId: Id): Id[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const hermanos = Object.values(modelo.opds).filter(
    (otro) => otro.padreId === opd.padreId,
  );
  return ordenarHermanos(hermanos);
}

/**
 * Ordena opds por `ordenLocal` si todos lo tienen; si no, alfabético por id.
 */
export function ordenarHermanos(hermanos: Opd[]): Id[] {
  const todosConOrden = hermanos.every((h) => h.ordenLocal !== undefined);
  if (todosConOrden) {
    return [...hermanos]
      .sort((a, b) => (a.ordenLocal ?? 0) - (b.ordenLocal ?? 0))
      .map((h) => h.id);
  }
  return [...hermanos]
    .sort((a, b) => a.id.localeCompare(b.id, "es"))
    .map((h) => h.id);
}

/**
 * Reordena los hermanos de `padreId` según el orden dado en `ordenNuevo`.
 * Valida que `ordenNuevo` contenga exactamente los mismos ids que los hermanos actuales.
 * HU-20.017, HU-20.018.
 */
export function reordenarHermanos(
  modelo: Modelo,
  padreId: Id | null,
  ordenNuevo: Id[],
): Resultado<Modelo> {
  const hermanosActuales = Object.values(modelo.opds).filter(
    (opd) => opd.padreId === padreId,
  );
  const idsActuales = new Set(hermanosActuales.map((h) => h.id));

  if (ordenNuevo.length !== idsActuales.size) {
    return fallo(
      `El orden contiene ${ordenNuevo.length} ids; se esperaban ${idsActuales.size} hermanos`,
    );
  }

  // Verificar que no hay duplicados
  const idsNuevos = new Set(ordenNuevo);
  if (idsNuevos.size !== ordenNuevo.length) {
    return fallo("El orden contiene ids duplicados");
  }

  // Verificar que el conjunto es el mismo
  for (const id of idsNuevos) {
    if (!idsActuales.has(id)) {
      return fallo(`El id ${id} no está entre los hermanos del padre ${padreId ?? "raíz"}`);
    }
  }
  for (const id of idsActuales) {
    if (!idsNuevos.has(id)) {
      return fallo(`El id ${id} falta en el orden dado`);
    }
  }

  const opds = cloneOpds(modelo);
  ordenNuevo.forEach((id, idx) => {
    const existente = opds[id];
    if (existente) {
      opds[id] = { ...existente, ordenLocal: idx };
    }
  });

  return ok({ ...modelo, opds });
}

/**
 * Mueve un OPD a un nuevo padre, opcionalmente en una posición.
 * Rechaza ciclos (no moverse bajo descendiente propio).
 * Rechaza mover el SD raíz.
 * HU-20.022.
 */
export function moverNodo(
  modelo: Modelo,
  opdId: Id,
  nuevoPadreId: Id | null,
  posicion?: number,
): Resultado<Modelo> {
  // Rechazar mover SD raíz
  if (esRaiz(modelo, opdId)) {
    return fallo("No se puede mover el OPD raíz SD");
  }

  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);

  // Validar que el nuevo padre existe (salvo null = raíz)
  if (nuevoPadreId !== null && !modelo.opds[nuevoPadreId]) {
    return fallo(`OPD padre no existe: ${nuevoPadreId}`);
  }

  // Validar sin ciclo
  const ciclo = validarMovimientoSinCiclo(modelo, opdId, nuevoPadreId);
  if (!ciclo.ok) return ciclo;

  // Si el nuevo padre es el mismo, solo cambia posición
  if (nuevoPadreId === opd.padreId) {
    if (posicion !== undefined && Number.isFinite(posicion)) {
      const hermanosActuales = hijoDe(modelo, nuevoPadreId);
      const otros = hermanosActuales.filter((h) => h.id !== opdId);
      const opds = cloneOpds(modelo);
      const idx = Math.max(0, Math.min(posicion, otros.length));
      const reordenados = [...otros.slice(0, idx), opd, ...otros.slice(idx)];
      reordenados.forEach((hermano, i) => {
        const existente = opds[hermano.id];
        if (existente) {
          opds[hermano.id] = { ...existente, ordenLocal: i };
        }
      });
      return ok({ ...modelo, opds });
    }
    return ok(modelo);
  }

  // Mover a nuevo padre
  const opds = cloneOpds(modelo);
  const opdActual = opds[opdId];
  if (!opdActual) return fallo(`OPD no encontrado en clon: ${opdId}`);
  opds[opdId] = { ...opdActual, padreId: nuevoPadreId };

  // Asignar ordenLocal a los hermanos en el destino
  const hermanosDestino = Object.values(opds).filter(
    (o) => o.padreId === nuevoPadreId,
  );
  if (posicion !== undefined && Number.isFinite(posicion)) {
    const idx = Math.max(0, Math.min(posicion, hermanosDestino.length - 1));
    hermanosDestino.forEach((h, i) => {
      if (h.id === opdId) return;
      const orden = i >= idx ? i + 1 : i;
      const existente = opds[h.id];
      if (existente) {
        opds[h.id] = { ...existente, ordenLocal: orden };
      }
    });
    const opdMovido = opds[opdId];
    if (opdMovido) {
      opds[opdId] = { ...opdMovido, ordenLocal: idx };
    }
  } else {
    // Al final
    hermanosDestino.forEach((h, i) => {
      if (h.id === opdId) return;
      const existente = opds[h.id];
      if (existente) {
        opds[h.id] = { ...existente, ordenLocal: i };
      }
    });
    const opdMovido = opds[opdId];
    if (opdMovido) {
      opds[opdId] = {
        ...opdMovido,
        ordenLocal: hermanosDestino.length - 1,
      };
    }
  }

  return ok({ ...modelo, opds });
}

/**
 * Valida que mover `opdId` bajo `nuevoPadreId` no cree un ciclo.
 * HU-20.022: corte de ciclo.
 */
export function validarMovimientoSinCiclo(
  modelo: Modelo,
  opdId: Id,
  nuevoPadreId: Id | null,
): Resultado<void> {
  if (nuevoPadreId === null) return ok(undefined);
  if (nuevoPadreId === opdId) {
    return fallo("Un OPD no puede ser su propio padre");
  }

  const desc = descendientes(modelo, opdId);
  if (desc.has(nuevoPadreId)) {
    return fallo(
      "No se puede mover un OPD bajo uno de sus descendientes (crearía un ciclo)",
    );
  }

  return ok(undefined);
}

/**
 * Ordena los hermanos de `padreId` según la posición vertical (y) de
 * los subprocesos dentro del OPD padre en el canvas.
 * HU-20.018: orden automático según canvas del padre.
 */
export function ordenSegunCanvasPadre(
  modelo: Modelo,
  padreId: Id,
): Resultado<Id[]> {
  const padre = modelo.opds[padreId];
  if (!padre) return fallo(`OPD padre no existe: ${padreId}`);

  const hijos = hijoDe(modelo, padreId);
  if (hijos.length === 0) return ok([]);

  interface HijoConY {
    id: Id;
    y: number;
  }

  const conY: HijoConY[] = [];

  for (const hijo of hijos) {
    const refinador = Object.values(modelo.entidades).find(
      (entidad) => refinaA(entidad, hijo.id) !== null,
    );
    if (!refinador) {
      conY.push({ id: hijo.id, y: Number.POSITIVE_INFINITY });
      continue;
    }
    const apariencia = Object.values(padre.apariencias).find(
      (ap) => ap.entidadId === refinador.id,
    );
    if (!apariencia) {
      conY.push({ id: hijo.id, y: Number.POSITIVE_INFINITY });
    } else {
      conY.push({ id: hijo.id, y: apariencia.y });
    }
  }

  conY.sort((a, b) => a.y - b.y);
  return ok(conY.map((item) => item.id));
}
