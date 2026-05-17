import { useOpmStore } from "../../store";
import { listarFixtures } from "../../store/runtime";
import type { PersistencePort } from "./persistencePort";

export function useZustandPersistencePort(): PersistencePort {
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const dirty = useOpmStore((s) => s.dirty);
  const ultimoAutosalvado = useOpmStore((s) => s.autosalvado.ultimo);
  const pestanasAbiertas = useOpmStore((s) => s.pestanasAbiertas);
  const pestanaActivaId = useOpmStore((s) => s.pestanaActivaId);
  const indice = useOpmStore((s) => s.indice);
  const modeloNombre = useOpmStore((s) => s.modelo.nombre);
  const abrirGuardarComo = useOpmStore((s) => s.abrirGuardarComo);
  const pestanaActiva = pestanasAbiertas.find((p) => p.id === pestanaActivaId);
  const cargadoDesde = pestanaActiva?.cargadoDesde ?? "nuevo";
  const esFixture = !modeloPersistidoId && listarFixtures().some((fixture) => fixture.modelo.nombre === modeloNombre);
  const versiones = modeloPersistidoId
    ? indice.modelos.find((m) => m.id === modeloPersistidoId)?.versiones?.length ?? 0
    : 0;

  return {
    modeloPersistidoId,
    dirty,
    cargadoDesde,
    esFixture,
    versiones,
    ultimoAutosalvado,
    modeloNombre,
    abrirGuardarComo,
  };
}
