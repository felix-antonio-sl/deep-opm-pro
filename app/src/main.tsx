import { render } from "preact";
// Ronda 28 L1: fuentes self-hosted Bauhaus (Inter Tight variable + JetBrains
// Mono variable). Reemplazan el "Inter" system-ui del corporate UI por la
// nueva tipografia chrome fundacional. Bundle: ~792 KB combinado.
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/jetbrains-mono";
import "jointjs/dist/joint.css";
import "./render/jointjs/jointjs.css";
import "./ui/focus.css";
import "./ui/arbol/arbol.css";
import "./ui/toolbar/toolbar.css";
import "./ui/menus.css";
import { store } from "./store";
import { App } from "./ui/App";

const root = document.getElementById("app");
if (root) render(<App />, root);

const bloquearSalidaConCambios = (event: BeforeUnloadEvent) => {
  event.preventDefault();
  event.returnValue = "";
};

let beforeUnloadActivo = false;

function sincronizarBeforeUnload(dirty: boolean): void {
  if (dirty && !beforeUnloadActivo) {
    window.addEventListener("beforeunload", bloquearSalidaConCambios);
    beforeUnloadActivo = true;
    return;
  }
  if (!dirty && beforeUnloadActivo) {
    window.removeEventListener("beforeunload", bloquearSalidaConCambios);
    beforeUnloadActivo = false;
  }
}

sincronizarBeforeUnload(store.getState().dirty);
const unsubscribeBeforeUnload = store.subscribe((state) => sincronizarBeforeUnload(state.dirty));

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    unsubscribeBeforeUnload();
    if (beforeUnloadActivo) window.removeEventListener("beforeunload", bloquearSalidaConCambios);
  });
}
