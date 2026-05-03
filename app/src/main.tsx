import { render } from "preact";
import "jointjs/dist/joint.css";
import "./render/jointjs/jointjs.css";
import { App } from "./ui/App";

const root = document.getElementById("app");
if (root) render(<App />, root);
