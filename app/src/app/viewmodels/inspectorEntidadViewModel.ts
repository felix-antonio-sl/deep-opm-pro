import type { Id } from "../../modelo/tipos";
import {
  useZustandEntityInspectorMetadataPort,
  useZustandEntityInspectorRefinementPort,
  useZustandEntityInspectorSemanticsPort,
  useZustandEntityInspectorShellPort,
  useZustandEntityInspectorGeometryPort,
  useZustandObjectStatesInspectorPort,
} from "../ports/zustandEntityInspectorPorts";

export function useInspectorEntidadViewModel(entidadId: Id) {
  const shell = useZustandEntityInspectorShellPort();
  const semantics = useZustandEntityInspectorSemanticsPort();
  const metadata = useZustandEntityInspectorMetadataPort();
  const geometry = useZustandEntityInspectorGeometryPort();
  const refinement = useZustandEntityInspectorRefinementPort();
  const states = useZustandObjectStatesInspectorPort(entidadId);

  return {
    ...shell,
    ...semantics,
    ...metadata,
    ...geometry,
    ...refinement,
    ...states,
  };
}

export type InspectorEntidadViewModel = ReturnType<typeof useInspectorEntidadViewModel>;
