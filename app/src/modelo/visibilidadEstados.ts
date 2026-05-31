import { estadoTieneEnlaces } from "./estadosDesignaciones";
import { estadosDeEntidad } from "./operaciones/estados";
import type { Apariencia, Estado, Id, Modelo, Opd, Resultado } from "./tipos";

/**
 * Supresión de estados POR APARICIÓN (per-OPD) como refinamiento de la
 * supresión GLOBAL `Estado.suprimido`. SSOT del predicado de visibilidad
 * efectivo y de las operaciones puras que mutan `Apariencia.estadosSuprimidos`.
 *
 * ── Decisiones SELLADAS (cat-thinking, skill `/home/felix/.claude/skills/cat-thinking`) ──
 *
 * SELLO 1 — DÓNDE VIVE EL DATO (`urn:fxsl:kb:icas-topoi`): la visibilidad de
 *   estados es un presheaf `Vis : OPD^op → Set`. Cada `Apariencia` realiza la
 *   FIBRA del objeto en su OPD, así que el dato local vive en la fibra
 *   (`Apariencia.estadosSuprimidos`), NO en `Estado` (que colapsaría todas las
 *   fibras a una sección global, justo lo que ya hace `Estado.suprimido`).
 *   Fibras ortogonales → sin invariante cruzado O(N²); una lista por aparición
 *   basta (lectura más débil que cumple). No requiere discriminado central
 *   como el coproducto tagged de selección, porque no hay invariante sellado
 *   entre apariciones que escalar.
 *
 * SELLO 2 — PREDICADO EFECTIVO = MEET EN Ω (`urn:fxsl:kb:icas-topoi`,
 *   clasificador de subobjetos): `visible = ¬global_suprimido ∧ ¬local_suprimido`
 *   es el meet en el álgebra de Heyting del topos de presheaves sobre el sitio
 *   de OPDs. "Global domina" = la sección global, restringida a la fibra, se
 *   mete (∧) con la local: si la global oculta, el resultado es falso sin
 *   importar la local. Conclusión FORMAL (definición de ∧ en Ω), no heurística.
 *
 * SELLO 3 — IDEMPOTENCIA Y ORTOGONALIDAD (`urn:fxsl:kb:icas-topoi`): global y
 *   local son secciones a distinto nivel del sitio (global ≈ sección sobre
 *   todos los OPD; local = sección sobre un OPD), dimensiones ORTOGONALES.
 *   Suprimir-local de un estado ya global-suprimido SE PERMITE (registra el
 *   flag aunque sea visualmente redundante); quitar la global después NO
 *   resucita lo ocultado localmente. Idempotente: `a ∧ a = a` (lista sin
 *   duplicados; restaurar lo no suprimido = no-op referencial).
 *
 * SELLO 4 — OPL (RESUELTO, incremento 2, operador aprobó "reflejar en OPL"):
 *   el canon (R-OPL-TOTAL-4/5, R-CX-EST-1/2) prescribe que el OPL de un OPD
 *   exprese solo los estados visibles en ESE OPD. La generación es por-OPD
 *   (`opl/generar.ts` itera `opd.apariencias`), así que enumera por la FIBRA
 *   usando `estadoVisibleEnAparicion`. Bisimetría preservada: el parser reverse
 *   NO borra estados por omisión y alinea posición→id por refs/nombre, de modo
 *   que un OPL con estados ocultos por supresión local hace roundtrip sin
 *   corromper ni renombrar el estado oculto (ver tests "incremento 2" en
 *   `opl/generar.test.ts`). Este módulo (kernel de visibilidad) sigue sin
 *   importar de la capa OPL: es `generar.ts` quien consume el predicado.
 *
 * Evidencia OPCloud (semántica, no clonada): `OpmVisualState.suppress()`
 * (`opm-extracted/.../VisualPart/OpmVisualState.ts:72`) saca el visual del OPD
 * activo (supresión = ausencia del visual en esa apariencia) y crea la elipsis;
 * `suppressAll`/`expressAll` (`OpmVisualObject.ts:319,338`) operan por objeto en
 * un OPD; `R-VIS-SUPR-1` confirma que múltiples OPDs hijo combinan supresiones
 * por unión. Nuestro modelo guarda el subconjunto oculto en vez de borrar el
 * visual (los estados no tienen geometría propia: las cápsulas se calculan).
 */

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}

/**
 * PREDICADO EFECTIVO (SELLO 2). SSOT de visibilidad de un estado en una
 * aparición concreta. Reúsalo en todos los consumidores (render, layout, OPL si
 * se conecta). `visible(estado, aparición) = ¬estado.suprimido ∧ ¬local`.
 */
export function estadoVisibleEnAparicion(estado: Estado, apariencia: Apariencia): boolean {
  if (estado.suprimido) return false;
  return !(apariencia.estadosSuprimidos?.includes(estado.id) ?? false);
}

/**
 * IDs de estado realmente suprimidos localmente en la aparición, saneados:
 * solo IDs que existen, pertenecen al objeto de la aparición y están en la
 * lista. Sirve como normalización de lectura (ignora colgantes/ajenos sin
 * mutar el modelo).
 */
export function estadosSuprimidosLocalmente(modelo: Modelo, entidadId: Id, apariencia: Apariencia): Id[] {
  const lista = apariencia.estadosSuprimidos;
  if (!lista || lista.length === 0) return [];
  const propios = new Set(estadosDeEntidad(modelo, entidadId).map((estado) => estado.id));
  return lista.filter((id) => propios.has(id));
}

/** Estados del objeto VISIBLES en la aparición, en orden canónico. */
export function estadosVisiblesEnAparicion(modelo: Modelo, entidadId: Id, apariencia: Apariencia): Estado[] {
  return estadosDeEntidad(modelo, entidadId).filter((estado) => estadoVisibleEnAparicion(estado, apariencia));
}

/**
 * ¿La aparición oculta algún estado por CUALQUIER causa (global o local)?
 * Gobierna el badge/elipsis "hay más, no se muestra todo" en esta vista.
 */
export function hayEstadosOcultosEnAparicion(modelo: Modelo, entidadId: Id, apariencia: Apariencia): boolean {
  const todos = estadosDeEntidad(modelo, entidadId);
  if (todos.length === 0) return false;
  return todos.some((estado) => !estadoVisibleEnAparicion(estado, apariencia));
}

/**
 * Suprime un estado en UNA aparición (per-OPD). Registra el id en
 * `Apariencia.estadosSuprimidos`. Inmutable e idempotente. Permite registrar el
 * flag aunque el estado ya esté global-suprimido (SELLO 3, ortogonalidad).
 * Rechaza estados con enlaces incidentes (paridad con la supresión global) y
 * estados ajenos al objeto de la aparición.
 */
export function suprimirEstadoEnAparicion(modelo: Modelo, opdId: Id, aparienciaId: Id, estadoId: Id): Resultado<Modelo> {
  const ctx = resolverContexto(modelo, opdId, aparienciaId, estadoId);
  if (!ctx.ok) return ctx;
  const { opd, apariencia } = ctx.value;
  if (estadoTieneEnlaces(modelo, estadoId)) {
    return fallo("El estado no puede ocultarse en esta vista porque tiene enlaces incidentes");
  }
  if (apariencia.estadosSuprimidos?.includes(estadoId)) return ok(modelo);
  const siguienteLista = [...(apariencia.estadosSuprimidos ?? []), estadoId];
  return ok(conApariencia(modelo, opd, { ...apariencia, estadosSuprimidos: siguienteLista }));
}

/**
 * Restaura (muestra) un estado en UNA aparición: lo quita de la lista local. No
 * toca la supresión global. No-op referencial si no estaba local-suprimido.
 */
export function mostrarEstadoEnAparicion(modelo: Modelo, opdId: Id, aparienciaId: Id, estadoId: Id): Resultado<Modelo> {
  const ctx = resolverContexto(modelo, opdId, aparienciaId, estadoId);
  if (!ctx.ok) return ctx;
  const { opd, apariencia } = ctx.value;
  if (!apariencia.estadosSuprimidos?.includes(estadoId)) return ok(modelo);
  const siguienteLista = apariencia.estadosSuprimidos.filter((id) => id !== estadoId);
  return ok(conApariencia(modelo, opd, normalizarLista({ ...apariencia, estadosSuprimidos: siguienteLista })));
}

/**
 * Suprime TODOS los estados del objeto en esta aparición (suppressAll por
 * fibra). Omite los estados con enlaces incidentes (no se pueden suprimir, igual
 * que OpmVisualState.canBeSuppressed). Idempotente.
 */
export function suprimirTodosLosEstadosEnAparicion(modelo: Modelo, opdId: Id, aparienciaId: Id): Resultado<Modelo> {
  const ctx = resolverAparicion(modelo, opdId, aparienciaId);
  if (!ctx.ok) return ctx;
  const { opd, apariencia } = ctx.value;
  const supribles = estadosDeEntidad(modelo, apariencia.entidadId)
    .filter((estado) => !estadoTieneEnlaces(modelo, estado.id))
    .map((estado) => estado.id);
  const siguienteLista = [...new Set([...(apariencia.estadosSuprimidos ?? []), ...supribles])];
  if (siguienteLista.length === (apariencia.estadosSuprimidos?.length ?? 0)) return ok(modelo);
  return ok(conApariencia(modelo, opd, { ...apariencia, estadosSuprimidos: siguienteLista }));
}

/**
 * Muestra TODOS los estados en esta aparición (expressAll por fibra): vacía la
 * lista local. No toca la supresión global. No-op si ya estaba vacía.
 */
export function mostrarTodosLosEstadosEnAparicion(modelo: Modelo, opdId: Id, aparienciaId: Id): Resultado<Modelo> {
  const ctx = resolverAparicion(modelo, opdId, aparienciaId);
  if (!ctx.ok) return ctx;
  const { opd, apariencia } = ctx.value;
  if (!apariencia.estadosSuprimidos || apariencia.estadosSuprimidos.length === 0) return ok(modelo);
  return ok(conApariencia(modelo, opd, normalizarLista({ ...apariencia, estadosSuprimidos: [] })));
}

// ───────────────────────────── helpers internos ─────────────────────────────

interface ContextoAparicion {
  opd: Opd;
  apariencia: Apariencia;
}

function resolverAparicion(modelo: Modelo, opdId: Id, aparienciaId: Id): Resultado<ContextoAparicion> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return fallo(`Apariencia no existe en ${opdId}: ${aparienciaId}`);
  return ok({ opd, apariencia });
}

function resolverContexto(modelo: Modelo, opdId: Id, aparienciaId: Id, estadoId: Id): Resultado<ContextoAparicion> {
  const ctx = resolverAparicion(modelo, opdId, aparienciaId);
  if (!ctx.ok) return ctx;
  const estado = modelo.estados?.[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  if (estado.entidadId !== ctx.value.apariencia.entidadId) {
    return fallo(`El estado ${estadoId} no pertenece al objeto de la aparición ${aparienciaId}`);
  }
  return ctx;
}

/** Quita el campo cuando la lista queda vacía (representación normalizada). */
function normalizarLista(apariencia: Apariencia): Apariencia {
  if (apariencia.estadosSuprimidos && apariencia.estadosSuprimidos.length === 0) {
    const copia = { ...apariencia };
    delete copia.estadosSuprimidos;
    return copia;
  }
  return apariencia;
}

function conApariencia(modelo: Modelo, opd: Opd, apariencia: Apariencia): Modelo {
  return {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opd.id]: {
        ...opd,
        apariencias: { ...opd.apariencias, [apariencia.id]: apariencia },
      },
    },
  };
}
