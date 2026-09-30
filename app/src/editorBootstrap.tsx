import { render } from "preact";
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

// Hook de test DEV-only: snapshot serializado del modelo activo para los
// asserts de no-mutación del smoke mobile (e2e/mobile-readonly.spec.ts).
// Antes esos asserts referían a `window.__opmStore`, que nunca existió, y
// pasaban vacuamente. En build de prod `import.meta.env.DEV` es estáticamente
// falso → DCE (mismo patrón que el headless; verificable con grep sobre dist/).
if (import.meta.env.DEV) {
  void import("./serializacion/json").then(({ exportarModelo }) => {
    (window as unknown as { __opmTest?: unknown }).__opmTest = {
      exportarModeloActual: () => exportarModelo(store.getState().modelo),
      // Fixture DEV-only: crea un MODELO plano sin persistir (op interno `nuevoModelo`).
      // La puerta humana «Nuevo» pasó a nacer APUNTES (diseño §3); los e2e que sólo
      // necesitan un lienzo fresco de setup usan esta vía para no acoplarse a la
      // especie apunte. El comportamiento apunte de «Nuevo» se cubre en e2e/41.
      nuevoModeloPlano: () => store.getState().nuevoModelo(),
    };
  });
}
