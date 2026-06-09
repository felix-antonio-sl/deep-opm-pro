import { render } from "preact";
// Codex: Inria Serif (cuerpo/titulos/OPL/labels OPM) + Inria Sans
// (kickers). Inria no tiene variable font: se cargan pesos estaticos.
//
// L6 — pesos descolapsados: el design system expresa 500 (medium) y 600
// (semibold). Inria (serif y sans) SOLO tiene masters 300/400/700; los pesos
// 500/600 quedan sintetizados por el navegador en chrome. Los contextos que
// necesitan 500/600 nativos usan JetBrains Mono Variable (cubre 100–800),
// cargado mas abajo. No existe @fontsource/inria-sans/600.css que importar.
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

// Render headless (H1, consumidor agente): monta `window.__opmRenderHeadless__`
// SOLO bajo el flag. En el build de prod el flag no se define → la condición es
// estáticamente falsa → Vite elimina por DCE este `if` y el import dinámico:
// la superficie no existe en el bundle desplegado (verificable con grep sobre dist/).
if (import.meta.env.VITE_HEADLESS_RENDER === "true") {
  void import("./render/jointjs/headlessRender").then((m) => m.montarHeadlessRender());
}
