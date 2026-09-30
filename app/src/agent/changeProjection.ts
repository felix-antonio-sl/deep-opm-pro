import { diffModel } from "../modelo/changes/apply";
import type { ModelDiff } from "../modelo/changes/types";
import type { Id, Modelo } from "../modelo/tipos";
import { generarOpl } from "../opl/generar";

export interface ProjectedChangeDiff extends ModelDiff {
  opl: Array<{ opdId: Id; before: string[]; after: string[] }>;
}

/** Project the semantic delta for review without making the kernel depend on OPL. */
export function projectChangeDiff(before: Modelo, after: Modelo, diff = diffModel(before, after)): ProjectedChangeDiff {
  const opdIds = new Set([...Object.keys(before.opds), ...Object.keys(after.opds)]);
  const opl = [...opdIds].sort().flatMap((opdId) => {
    const previous = before.opds[opdId] ? generarOpl(before, opdId) : [];
    const next = after.opds[opdId] ? generarOpl(after, opdId) : [];
    return JSON.stringify(previous) === JSON.stringify(next) ? [] : [{ opdId, before: previous, after: next }];
  });
  return { ...diff, opl };
}
