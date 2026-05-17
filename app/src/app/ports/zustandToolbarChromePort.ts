import { useOpmStore } from "../../store";
import type { ToolbarChromePort } from "./toolbarChromePort";

export function useZustandToolbarChromePort(): ToolbarChromePort {
  const abrirMenuPrincipal = useOpmStore((s) => s.abrirMenuPrincipal);
  const cerrarMenuPrincipal = useOpmStore((s) => s.cerrarMenuPrincipal);
  const menuPrincipalAbierto = useOpmStore((s) => s.menuPrincipalAbierto);
  const abrirDialogoComandos = useOpmStore((s) => s.abrirDialogoComandos);

  return {
    abrirMenuPrincipal,
    cerrarMenuPrincipal,
    menuPrincipalAbierto,
    abrirDialogoComandos,
  };
}
