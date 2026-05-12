import { render } from "preact";
import "jointjs/dist/joint.css";
import "./render/jointjs/jointjs.css";
import "./ui/focus.css";
import "./ui/arbol/arbol.css";
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
