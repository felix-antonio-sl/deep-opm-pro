import { render } from "preact";
import "@fontsource/inria-serif/300.css";
import "@fontsource/inria-serif/400.css";
import "@fontsource/inria-serif/700.css";
import "@fontsource/inria-sans/300.css";
import "@fontsource/inria-sans/400.css";
import "@fontsource/inria-sans/700.css";
import "@fontsource-variable/jetbrains-mono";
import "jointjs/dist/joint.css";
import "../render/jointjs/jointjs.css";
import { PortableReaderPage } from "../ui/portable/PortableReaderPage";

const root = document.getElementById("portable-reader-root");
if (root) render(<PortableReaderPage />, root);
