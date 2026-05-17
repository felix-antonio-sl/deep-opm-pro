import { useOpmStore } from "../../store";
import type { ModelBootstrapPort } from "./modelBootstrapPort";

export function useZustandModelBootstrapPort(): ModelBootstrapPort {
  const nuevoModelo = useOpmStore((s) => s.nuevoModelo);
  const iniciarAsistente = useOpmStore((s) => s.iniciarAsistente);

  return {
    nuevoModelo,
    iniciarAsistente,
  };
}
