# Notas — Chrome de gestión (higiene del gestor + paleta de 3 estratos)

Lecciones del corte **D-higiene + paleta** (2026-07-07), que ejecutó m-2/m-5/M-5 de la
auditoría UX Jobs sobre `DialogoCargarModelo.tsx` (gestor) y `CommandPalette.tsx` (paleta).
Una lección por asunto; el detalle vive en Git y el estado en `docs/handoff-2026-07-21.md`.

## Radio disjunto ≠ blast-radius disjunto (el caso «Importar»)

- **Lección (1 línea):** un botón nuevo cuyo *nombre accesible* contiene como substring el
  de un botón existente rompe en silencio TODOS los `getByRole("button",{name:"X"})` sin `exact`.
- Al renombrar la sección «JSON» del gestor a una **acción de encabezado** «Importar JSON»
  (+ un CTA «Importar JSON» en el estado vacío), aparecieron DOS botones cuyo nombre contiene
  «Importar». Playwright empareja `{name:"Importar"}` por substring → `strict mode violation:
  resolved to 3 elements`. **51 sitios** en 15 specs (el patrón canónico de importar un modelo
  en un test) cayeron. El helper `importarModeloJson` NO cayó porque ya usaba `exact: true`.
- **Cómo se arregló:** `{ name: "Importar" }` → `{ name: "Importar", exact: true }` en los 51
  sitios (selector correcto; el no-exact funcionaba solo por ser el único «Importar»). Se
  preservó el label «Importar JSON» que el spec §1 pide. **Por qué:** el fix correcto es el
  selector exacto, no renombrar la UII para acomodar al test.
- **Regla:** al introducir un label que es prefijo/substring de otro botón, buscar
  `getByRole("button",{name:"<substring>"})` sin `exact` en TODO `e2e/` antes de cerrar.

## El testid de una superficie consumido por un helper compartido es un contrato de alto radio

- **Lección (1 línea):** migrar `<details><summary>` → acción de encabezado obliga a migrar el
  helper compartido preservando el testid interno y su `textarea`, no solo el componente.
- `panel-json-abrir-importar` lo consume `_smoke-helpers.ts::abrirDialogoJson` (y por él,
  `importarModeloJson`, usado por decenas de specs). La migración preservó el testid en el
  contenedor revelado + `textarea[spellcheck="false"]` + `import-preview` + botón «Importar»,
  y cambió el helper de «leer `details.open` + click en `summary`» a «click en el botón
  `abrir-importar-json` con guard idempotente». Sin esa preservación se cae media suite.

## Quitar un componente compartido de UN diálogo repercute en los specs que lo ejercían ahí

- **Lección (1 línea):** `PanelCarpetas` sigue vivo (lo usa `DialogoGuardarComo`); retirar su
  *uso* en el gestor rompió el e2e de mover-modelos que probaba su menú Cortar/Pegar.
- El movimiento migró a **arrastre del tile a la carpeta de la sidebar** (`moverModeloDirecto`),
  con `DataTransfer` compartido dragstart/dragover/drop (contrato de `handlersDragDrop`; el
  mouse-drag de Playwright no transporta el `dataTransfer`).

## Un test de taxonomía debe alimentarse del catálogo REAL, no de un stub

- **Lección (1 línea):** el test de «CONTEXTUAL solo con selección» era ciego porque alimentaba
  `[inzoom]`, nunca el output real de `accionesContextualesEntidad({entidad:null})`.
- `componer-modelo` es una `accion-contextual` *always-on* (compone el modelo entero, no la
  selección). La regla «`accion-contextual` → CONTEXTUAL» la colaba en «Para la selección» sin
  selección (viola spec §4). El fix: reclasificarla a CREAR (verbo a nivel-modelo), gateado por
  una prueba que alimenta el conjunto contextual real sin selección y exige CONTEXTUAL vacío.
- **Regla:** la ley cabecera de un invariante se prueba contra el productor real, no un fixture
  hecho a mano que confirma lo que ya crees.

## La deduplicación de la paleta es por `combo|label`, no por handler

- **Lección (1 línea):** dos registros del mismo gesto con rótulos distintos no colapsan; el
  arreglo es alinear la `etiqueta`, no inventar una segunda vía de dedupe.
- `Ctrl+T` se registraba como atajo global «Abrir pestaña nueva» y como acción de menú «Abrir
  como pestaña». Alinear la `etiqueta` del registro global al label del menú hace que
  `claveAtajoPalette` coincida y el atajo quede subsumido (una sola fila).

## Agentes constructores en paralelo se confunden con las ediciones en vuelo del otro

- **Lección (1 línea):** un agente que corre `typecheck` repo-wide mientras otro edita ve
  archivos a medio escribir y los reporta como «errores pre-existentes» — verificar con
  `git status` (aquí: solo los 6 archivos propios) y un `typecheck` limpio tras integrar.
- Ambos constructores reportaron «9 errores pre-existentes en src/mesa/store»; eran vistas
  transitorias del otro radio. El árbol integrado tipa limpio (EXIT 0).

## Flake pre-existente de backend compartido (BUG-142989)

- **Lección (1 línea):** los specs comparten un Postgres sin reset por-test; los que dependen de
  un refresh de `modelosGuardados` post-guardado flaquean cuando el catálogo crece (timeout 5s).
- `BUG-142989` (aviso «variante independiente» de `DialogoGuardarComo`) NO es regresión de este
  corte: la **prueba de stash** (revertir SOLO el árbol a HEAD, backend idéntico) lo cazó fallando
  también en HEAD. Es un fallo pre-existente del `main` commiteado, ajeno al gestor/paleta.
- Corolario operativo: `git stash push -- <paths>` + correr + `git stash pop` es el árbitro
  «¿mi cambio o pre-existente?». Y `pkill -f "bun run dev"` cerca de Playwright dispara exit 144;
  usar stash sin pkill, o matar el dev server por PID.

## La puerta de gusto arbitra alcance, no solo estética

- **Lección (1 línea):** `steve-jobs` asesora con un veredicto afilado; el orquestador decide qué
  entra al corte y qué se difiere — sustracción low-risk sí, cambios de contrato no.
- El veredicto («arreglado, no inevitable») trajo 6 arreglos. Se aplicaron los cuatro de
  sustracción/des-jerga low-risk: (1) ocultar la barra de catálogo en el vacío genuino —el buscador
  y los toggles no tienen sobre qué actuar— moviendo el testid `abrir-importar-json` del encabezado
  al CTA (mutuamente excluyentes → el helper `abrirDialogoJson` sigue hallando exactamente uno);
  (2) quitar el chip de categoría de la paleta (el estrato ya agrupa, el atajo es el único meta que
  gana su lugar a la derecha); (3) guardar el segundo renglón que repetía el label; (4) des-jergar
  `<<Requirement>>` → «requisito».
- Se DIFIRIERON tres (con nota al operador) por romper contratos/ser decisión de producto: quitar la
  vista tarjetas (rompe `modelo-tile-cargar`), quitar el botón «Abrir {nombre}» por fila (rompe
  `reciente-modelo`), renombrar «Abrir modelo»→«Modelos» (rompe el `getByRole(dialog, name)` de
  decenas de specs). El gusto no autoriza saltarse el análisis de blast-radius.
- **El operador autorizó los 3 → ejecutados.** Catálogo como **lista única** (la lista domina a
  las tarjetas: columnas ordenables + tamaño; el ícono de tarjeta era el mismo genérico para
  todas), sin botón «Abrir {nombre}» por fila (se abre por doble-click de fila o por el footer),
  diálogo renombrado «Modelos». **LECCIÓN de migración**: al retirar un testid consumido por un
  helper compartido (`cargarPrimerModelo`, `abrirDialogoCargarModelo`), migrar el helper + TODOS
  sus consumidores de una (sed del testid + arreglo de la lógica donde cambia: el `.click()` de la
  fila ahora SELECCIONA, no abre → `.dblclick()`), no spec por spec. Re-gate: check 3078/0 + smoke 294/0.
