import { useEffect, useMemo } from "preact/hooks";
import type { ResumenModeloPersistido } from "../../persistencia/local";
import { listarFixtures } from "../../store/runtime";
import { useZustandModelBootstrapPort } from "../ports/zustandModelBootstrapPort";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandPersistencePort } from "../ports/zustandPersistencePort";
import { useZustandWelcomeScreenPort } from "../ports/zustandWelcomeScreenPort";
import { useZustandWorkspacePort } from "../ports/zustandWorkspacePort";

export function usePantallaInicioViewModel(query: string) {
  const { modelo } = useZustandOpdNavigationPort();
  const {
    modeloPersistidoId,
    listarModelosGuardados: listar,
    cargarLocal: cargar,
    cargarFixtureDemo,
  } = useZustandPersistencePort();
  const { modelosGuardados: modelos } = useZustandWorkspacePort();
  const { nuevoModelo, iniciarAsistente } = useZustandModelBootstrapPort();
  const { pantallaInicioCerrada, cerrarPantallaInicio } = useZustandWelcomeScreenPort();

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
