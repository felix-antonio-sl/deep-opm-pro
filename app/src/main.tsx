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
// A shared revision opens independently of editor authentication and mutable state.
const reviewRoute = /^\/revision\/([^/]+)\/?$/.exec(window.location.pathname);
if (reviewRoute) {
  const token = reviewRoute[1]!;
  void Promise.all([
    import("./ui/review/RevisionReader"),
    import("./persistencia/reviewClient"),
  ]).then(([{ RevisionReader }, { createReviewPort }]) => {
    const root = document.getElementById("app");
    if (root) render(<RevisionReader token={token} port={createReviewPort({ token })} />, root);
  }).catch(() => {
    const root = document.getElementById("app");
    if (root) root.textContent = "No se pudo abrir el lector. Recarga para intentarlo de nuevo.";
  });
} else {
  void import("./editorBootstrap").catch((error) => {
    console.error("No se pudo iniciar el editor", error);
    const root = document.getElementById("app");
    if (root) root.textContent = "No se pudo iniciar el editor. Recarga para intentarlo de nuevo.";
  });
}
