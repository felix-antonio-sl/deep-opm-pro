import { useOpmStore } from "../../store";

export function useBreadcrumbViewModel() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);

  return {
    modelo,
    opdActivoId,
    cambiarOpdActivo,
  };
}

export type BreadcrumbViewModel = ReturnType<typeof useBreadcrumbViewModel>;
