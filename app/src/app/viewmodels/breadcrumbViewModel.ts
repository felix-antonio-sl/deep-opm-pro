import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";

export function useBreadcrumbViewModel() {
  const { modelo, opdActivoId, cambiarOpdActivo } = useZustandOpdNavigationPort();

  return {
    modelo,
    opdActivoId,
    cambiarOpdActivo,
  };
}

export type BreadcrumbViewModel = ReturnType<typeof useBreadcrumbViewModel>;
