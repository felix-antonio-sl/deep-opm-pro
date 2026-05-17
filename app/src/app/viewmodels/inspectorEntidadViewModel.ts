import type { Id } from "../../modelo/tipos";
import {
  useZustandEntityInspectorMetadataPort,
  useZustandEntityInspectorRefinementPort,
  useZustandEntityInspectorSemanticsPort,
  useZustandEntityInspectorShellPort,
  useZustandEntityInspectorStylePort,
  useZustandObjectStatesInspectorPort,
} from "../ports/zustandEntityInspectorPorts";

export function useInspectorEntidadViewModel(entidadId: Id) {
  const shell = useZustandEntityInspectorShellPort();
  const semantics = useZustandEntityInspectorSemanticsPort();
  const metadata = useZustandEntityInspectorMetadataPort();
  const style = useZustandEntityInspectorStylePort();
  const refinement = useZustandEntityInspectorRefinementPort();
  const states = useZustandObjectStatesInspectorPort(entidadId);

  return {
    ...shell,
    ...semantics,
    ...metadata,
    ...style,
    ...refinement,
    ...states,
  };
}

export type InspectorEntidadViewModel = ReturnType<typeof useInspectorEntidadViewModel>;
