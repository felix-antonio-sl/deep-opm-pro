import { useEffect, useMemo } from "preact/hooks";
import type { ResumenModeloPersistido } from "../../persistencia/local";
import { useOpmStore } from "../../store";
import { listarFixtures } from "../../store/runtime";

export function usePantallaInicioViewModel(query: string) {
  const modelo = useOpmStore((s) => s.modelo);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const pantallaInicioCerrada = useOpmStore((s) => s.pantallaInicioCerrada);
  const modelos = useOpmStore((s) => s.modelosGuardados);
  const listar = useOpmStore((s) => s.listarModelosGuardados);
  const cargar = useOpmStore((s) => s.cargarLocal);
  const nuevoModelo = useOpmStore((s) => s.nuevoModelo);
  const cargarFixtureDemo = useOpmStore((s) => s.cargarFixtureDemo);
  const cerrarPantallaInicio = useOpmStore((s) => s.cerrarPantallaInicio);
  const iniciarAsistente = useOpmStore((s) => s.iniciarAsistente);

  const demos = useMemo(() => listarFixtures(), []);
  const recientes = useMemo(() => filtrarRecientesPantallaInicio(modelos, query), [modelos, query]);

  useEffect(() => {
    listar();
  }, [listar]);

  return {
    modelo,
    modeloPersistidoId,
    pantallaInicioCerrada,
    recientes,
    demos,
    cargar,
    nuevoModelo,
    cargarFixtureDemo,
    cerrarPantallaInicio,
    iniciarAsistente,
  };
}

export function filtrarRecientesPantallaInicio(modelos: ResumenModeloPersistido[], query: string): ResumenModeloPersistido[] {
  const q = query.trim().toLocaleLowerCase("es-CL");
  return [...modelos]
    .filter((modelo) => !modelo.archivado)
    .filter((modelo) => !q || modelo.nombre.toLocaleLowerCase("es-CL").includes(q))
    .sort((a, b) => fechaUsoPantallaInicio(b).localeCompare(fechaUsoPantallaInicio(a)))
    .slice(0, 5);
}

export function fechaUsoPantallaInicio(modelo: ResumenModeloPersistido): string {
  return modelo.ultimaApertura ?? modelo.actualizadoEn ?? modelo.creadoEn;
}

export type PantallaInicioViewModel = ReturnType<typeof usePantallaInicioViewModel>;
