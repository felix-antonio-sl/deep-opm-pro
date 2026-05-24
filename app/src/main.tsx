import { render } from "preact";
// Codex: Inria Serif (cuerpo/titulos/OPL/labels OPM) + Inria Sans
// (kickers). Inria no tiene variable font: se cargan pesos estaticos.
import "@fontsource/inria-serif/300.css";
import "@fontsource/inria-serif/300-italic.css";
import "@fontsource/inria-serif/400.css";
import "@fontsource/inria-serif/700.css";
import "@fontsource/inria-serif/400-italic.css";
import "@fontsource/inria-serif/700-italic.css";
import "@fontsource/inria-sans/300.css";
import "@fontsource/inria-sans/300-italic.css";
import "@fontsource/inria-sans/400.css";
import "@fontsource/inria-sans/700.css";
import "@fontsource/inria-sans/400-italic.css";
import "@fontsource/inria-sans/700-italic.css";
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
