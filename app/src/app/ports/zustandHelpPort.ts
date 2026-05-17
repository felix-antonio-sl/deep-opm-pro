import { useOpmStore } from "../../store";
import type { HelpPort } from "./helpPort";

export function useZustandHelpPort(): HelpPort {
  const abrirCheatsheetAtajos = useOpmStore((s) => s.abrirCheatsheetAtajos);

  return {
    abrirCheatsheetAtajos,
  };
}
