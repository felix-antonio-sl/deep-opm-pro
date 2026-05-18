import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { dia } from "jointjs";
import type { JointCanvasAdapter } from "../render/jointjs/jointCanvasAdapter";

export const CanvasAdapterContext = createContext<JointCanvasAdapter | null>(null);

export function useCanvasAdapter(): JointCanvasAdapter | null {
  return useContext(CanvasAdapterContext);
}

export function useCanvasPaper(): dia.Paper | null {
  return useCanvasAdapter()?.paper ?? null;
}
