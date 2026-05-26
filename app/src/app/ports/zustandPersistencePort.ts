import { store, useOpmStore } from "../../store";
import type { PersistencePort } from "./persistencePort";

export function useZustandPersistencePort(): PersistencePort {
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const dirty = useOpmStore((s) => s.dirty);
  const dirtyModelo = useOpmStore((s) => s.dirtyModelo);
  const dialogoGuardarComoAbierto = useOpmStore((s) => s.dialogoGuardarComoAbierto);
  const dialogoCargarModeloAbierto = useOpmStore((s) => s.dialogoCargarModeloAbierto);
  const ultimoAutosalvado = useOpmStore((s) => s.autosalvado.ultimo);
  const autosalvadoEnCurso = useOpmStore((s) => s.autosalvado.salvando);
  const pestanasAbiertas = useOpmStore((s) => s.pestanasAbiertas);
  const pestanaActivaId = useOpmStore((s) => s.pestanaActivaId);
  const indice = useOpmStore((s) => s.indice);
  const modeloNombre = useOpmStore((s) => s.modelo.nombre);
  const abrirGuardarComo = useOpmStore((s) => s.abrirGuardarComo);
  const abrirCargarModelo = useOpmStore((s) => s.abrirCargarModelo);
  const abrirDialogoImportarExportarJson = useOpmStore((s) => s.abrirDialogoImportarExportarJson);
  const cerrarGuardarComo = useOpmStore((s) => s.cerrarGuardarComo);
  const cerrarCargarModelo = useOpmStore((s) => s.cerrarCargarModelo);
  const guardarLocal = useOpmStore((s) => s.guardarLocal);
  const guardarComoLocalConDescripcion = useOpmStore((s) => s.guardarComoLocalConDescripcion);
  const listarModelosGuardados = useOpmStore((s) => s.listarModelosGuardados);
  const cargarLocal = useOpmStore((s) => s.cargarLocal);
  const borrarLocal = useOpmStore((s) => s.borrarLocal);
  const exportarJson = useOpmStore((s) => s.exportarJson);
  const importarJson = useOpmStore((s) => s.importarJson);
  const pestanaActiva = pestanasAbiertas.find((p) => p.id === pestanaActivaId);
  const cargadoDesde = pestanaActiva?.cargadoDesde ?? "nuevo";
  const versiones = modeloPersistidoId
    ? indice.modelos.find((m) => m.id === modeloPersistidoId)?.versiones?.length ?? 0
    : 0;

  return {
    modeloPersistidoId,
    dirty,
    dirtyModelo,
    dialogoGuardarComoAbierto,
    dialogoCargarModeloAbierto,
    cargadoDesde,
    versiones,
    ultimoAutosalvado,
    autosalvadoEnCurso,
    modeloNombre,
    abrirGuardarComo,
    abrirCargarModelo,
    abrirDialogoImportarExportarJson,
    cerrarGuardarComo,
    cerrarCargarModelo,
    guardarLocal,
    guardarComoLocalConDescripcion,
    listarModelosGuardados,
    cargarLocal,
    borrarLocal,
    exportarJson,
    importarJson,
    hayDirty: () => store.getState().dirty,
    hayDirtyModelo: () => store.getState().dirtyModelo,
  };
}
