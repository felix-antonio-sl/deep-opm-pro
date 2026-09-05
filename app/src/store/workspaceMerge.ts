import type { Id } from "../modelo/tipos";
import { type WorkspaceIndice } from "../persistencia/workspace";

/**
 * Anti-race del bootstrap del workspace: el load async del backend
 * (`sincronizarListadoBackend`) puede resolver DESPUÉS de que el usuario haya
 * cambiado una preferencia (p.ej. visibilidad de esencia OPL) en los primeros
 * ms de sesión. Sin esto, el `set({ indice })` del bootstrap pisaría ese cambio
 * con el `preferenciasUi` del backend (que aún no lo tenía).
 *
 * Fusiona dando precedencia POR CLAVE a las preferencias locales (cambios
 * en-sesión) sobre las del backend. En un load fresco el índice local es
 * `indiceVacio()` (sin `preferenciasUi`), así que el backend gana intacto; tras
 * un cambio del usuario, esa clave gana y el resto del backend se conserva.
 */
export function fusionarPreferenciasBootstrap(
  indiceBackend: WorkspaceIndice,
  indiceLocal: WorkspaceIndice,
): WorkspaceIndice {
  const prefsLocales = indiceLocal.preferenciasUi;
  if (!prefsLocales || Object.keys(prefsLocales).length === 0) return indiceBackend;
  return {
    ...indiceBackend,
    preferenciasUi: { ...(indiceBackend.preferenciasUi ?? {}), ...prefsLocales },
  };
}

/**
 * Aplica al snapshot remoto únicamente el delta ocurrido localmente desde la
 * base observada. Así el bootstrap conserva cambios tempranos sin borrar
 * carpetas/modelos remotos que el estado inicial todavía no conocía.
 */
export function mergeWorkspaceBootstrap(
  backendIndex: WorkspaceIndice,
  baseIndex: WorkspaceIndice,
  localIndex: WorkspaceIndice,
): WorkspaceIndice {
  return {
    modelos: mergeCollectionById(
      backendIndex.modelos,
      baseIndex.modelos,
      localIndex.modelos,
    ),
    carpetas: mergeCollectionById(
      backendIndex.carpetas,
      baseIndex.carpetas,
      localIndex.carpetas,
    ),
    recientes: areEqual(baseIndex.recientes, localIndex.recientes)
      ? backendIndex.recientes
      : localIndex.recientes,
    ...mergeOptionalField(
      "busquedaGlobalUltima",
      backendIndex.busquedaGlobalUltima,
      baseIndex.busquedaGlobalUltima,
      localIndex.busquedaGlobalUltima,
    ),
    ...mergeOptionalField(
      "preferenciasUi",
      backendIndex.preferenciasUi,
      baseIndex.preferenciasUi,
      localIndex.preferenciasUi,
    ),
  };
}

function mergeCollectionById<T extends { id: Id }>(
  remoteItems: T[],
  base: T[],
  localItems: T[],
): T[] {
  const result = new Map(remoteItems.map((item) => [item.id, item]));
  const baseById = new Map(base.map((item) => [item.id, item]));
  const localById = new Map(localItems.map((item) => [item.id, item]));
  for (const id of new Set([...baseById.keys(), ...localById.keys()])) {
    const baseItem = baseById.get(id);
    const localItem = localById.get(id);
    if (areEqual(baseItem, localItem)) continue;
    if (!localItem) {
      result.delete(id);
      continue;
    }
    const remoteItem = result.get(id);
    result.set(
      id,
      baseItem && remoteItem
        ? mergeRecord(remoteItem, baseItem, localItem)
        : localItem,
    );
  }
  return [...result.values()];
}

function mergeRecord<T extends object>(remote: T, base: T, local: T): T {
  const result = { ...remote } as Record<string, unknown>;
  const baseRecord = base as Record<string, unknown>;
  const localRecord = local as Record<string, unknown>;
  for (const key of new Set([...Object.keys(baseRecord), ...Object.keys(localRecord)])) {
    if (areEqual(baseRecord[key], localRecord[key])) continue;
    if (localRecord[key] === undefined) delete result[key];
    else result[key] = localRecord[key];
  }
  return result as T;
}

function mergeOptionalField<K extends string, T>(
  key: K,
  remote: T | undefined,
  base: T | undefined,
  local: T | undefined,
): Partial<Record<K, T>> {
  if (areEqual(base, local)) {
    return remote === undefined ? {} : { [key]: remote } as Record<K, T>;
  }
  if (local === undefined) return {};
  if (isPlainObject(remote) && isPlainObject(local)) {
    return {
      [key]: mergeRecord(
        remote,
        isPlainObject(base) ? base : {},
        local,
      ) as T,
    } as Record<K, T>;
  }
  return { [key]: local } as Record<K, T>;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function areEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
