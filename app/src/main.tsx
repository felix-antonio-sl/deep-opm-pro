import { render } from 'preact';
import { App } from './ui/App';
import '@fontsource/inria-serif/400.css';
import '@fontsource/inria-serif/400-italic.css';
import './ui/estilos.css';
const raiz = document.getElementById('app');
if (!raiz) throw new Error('Falta el punto de montaje de opforja.');
raiz.replaceChildren();
render(<App />, raiz);
