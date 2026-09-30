# Dossier — Experiencia en vivo de opforja (UX observada en navegador)

Área: **experiencia en vivo**. Método: levantar la app de desarrollo y manejarla con Playwright como
lo haría un modelador OPM experto; capturar, medir y describir. Complementa (no repite) los dossiers
de código `ui-shell.md`, `ui-subdirs.md`, `render-canvas.md` y `opl.md` del mismo directorio: aquí lo
que cuenta es **lo que se ve, lo que cuesta y lo que falla** cuando se usa.

Pantallazos: `screens/NN-*.png` (67 capturas, numeradas en el orden del recorrido). Scripts del
recorrido: `lib.mjs`, `s2.mjs`…`s36.mjs`, `m1.mjs`…`m3.mjs` (mismo directorio). Modelo exportado del
recorrido: `modelo-antes-opl.json` / `modelo-despues-opl.json`.

---

## 0. Ficha del experimento

| Aspecto | Valor |
|---|---|
| Servidor | `vite --host 127.0.0.1 --port 5199` (desktop/mobile-edición) y `VITE_MOBILE_READONLY=true vite --port 5200` (shell móvil de producción) |
| Backend | middleware dev `src/server/devModelPersistence.ts`: mismo handler de producción sobre `crearRepoMemoria()`; sin Postgres, sin login (salvo `MODEL_REQUIRE_AUTH=true`) |
| Navegador | Chromium headless 1194 (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) vía CDP; Playwright 1.59 de `app/node_modules` (su headless-shell 1217 no está instalado → hay que pasar `executablePath`) |
| Viewports | 1440×900 (principal), 1920×1080, 1280×800, 1024×768, 390×844 (móvil, `isMobile`, `hasTouch`, DPR 2) |
| Modelo del recorrido | «Hervidor de agua»: objeto `Agua` {`fría`,`caliente`}, proceso `Hervir` que cambia `Agua` de `fría` a `caliente`, in-zoom con `Llenar`/`Calentar`/`Verificar` |
| Límites | Dev server (no build de producción); corpus del tutor ausente (ver §2); headless (sin táctil real, sin fuentes del SO); sin agente IA configurado; evaluación de una persona experta, no test con usuarios |

---

## 1. Resumen ejecutivo

**Veredicto.** El núcleo OPM funciona y en varios puntos es **muy bueno**: la semántica que el
canvas produce es correcta (consumo/resultado, par de estados fusionado en «cambia … de … a …»,
distribución de enlaces al in-zoom, orden temporal «en esa secuencia»), la OPL aparece al instante,
el renombrado encadenado de subprocesos es un acierto y la tabla de enlaces es útil. Pero la
**experiencia está sepultada bajo cromo, gobernanza y superficies de circunstancia**: a 1440×900 el
lienzo recibe ~42 % de la pantalla, la barra de creación se desborda y oculta el botón «Relación»,
conviven **cuatro indicadores de guardado que se contradicen**, y el editor OPL —la mitad «reverse»
de la bimodalidad— **no es idempotente**: al abrirlo sin tocar nada propone 4 cambios y, al aplicar,
**duplica un hecho OPM en otro encoding y en el OPD equivocado**.

**Diez hallazgos que más pesan (verificados en vivo):**

1. **Editor OPL no idempotente → escritura espuria** (crítico, rompe simetría OPD↔OPL): en un modelo
   con in-zoom y enlaces a estados, abrir «editar» sin cambios muestra «4 aplicables»; aplicar crea un
   `efecto` compacto `Hervir→Agua` (`estadoEntradaId: s-7`, `estadoSalidaId: s-8`) duplicando el par
   `e-5`/`e-9` y colgándolo del contorno en SD1 (§4.10, capturas 22–26).
2. **Toolbar de creación desbordada**: a 1440 px «Relación» queda bajo la meta del header (el clic cae
   en `codex-header-meta`); tras la primera cosa aparece scroll horizontal (`scrollWidth 628 / clientWidth 303`);
   a 1280 px «Relación» invisible; **a 1024 px la toolbar de creación mide 0 px** (§3.2, §5.1).
3. **El indicador de modo de conexión es invisible**: «Conectando: Consumo · selecciona destino · Esc
   cancela» vive dentro de la toolbar desbordada (x=1658 en viewport de 1440) (§4.4).
4. **Cuatro señales de persistencia contradictorias**: chip «● Sin guardar ⌃S / ○ Guardado», «● Auto»,
   meta «sin guardar», y `DocumentPersistenceStatus` «Guardado aquí / Sin guardar aquí». Tras «Guardar
   como», el chip dice «Guardado» y el diálogo del documento dice «Sin guardar aquí. El servidor aún no
   confirmó esta revisión local.» (§4.16, capturas 31, 63).
5. **Panel del agente permanente sobre el lienzo**: «Trabajo del documento» + fila de acciones
   documentales ocupan ~165 px fijos en desktop y ~40 % de la altura en móvil, aunque el agente esté
   «no disponible» (§3.1, capturas 01, 50).
6. **Gestión de vista frágil**: el zoom salta solo (100 %→160 %), las cosas nacen parcialmente fuera
   del lienzo, tras el renombrado encadenado el lienzo queda en blanco (scroll perdido) y la única
   salida es `Ctrl+0`, que no tiene botón visible (§4.3, §4.8, capturas 04, 19, 21).
7. **Refinar exige escribir una «pregunta guía»**: «Crear y abrir OPD» deshabilitado hasta tipear
   texto libre; es una puerta metodológica local, no una regla ISO 19450 (§4.8, captura 16).
8. **Paleta de comandos contaminada y con duplicados**: 60 ítems visibles sin consulta; «Descomponer» y
   «Crear inzoom…» (mismo Shift+I), dos «Buscar en el modelo», nueve «Ir a pestaña N», «Delete» y
   «Backspace»; búsquedas como «mapa» o «valid» devuelven solo referencias del tutor (§4.12).
9. **Rendering OPL con backticks literales** (`` `fría` ``) en panel, móvil y editor; el propio
   texto de ayuda del editor contradice la sintaxis real (dice *itálica* para estados; el texto usa
   backticks y *itálica* para procesos) (§4.9–4.10).
10. **Móvil**: el modo de producción (`VITE_MOBILE_READONLY=true`) es lectura; muestra «No hay modelos
    guardados» con un modelo abierto, el diagrama no se encuadra, el panel OPL ofrece «editar», y
    `Ctrl+K → Abrir/importar` **reemplaza el modelo** dentro del shell de solo lectura (§5.2).

**Qué conservar a toda costa**: la gramática visual OPM del canvas, la generación OPL inmediata con
tokens navegables (clic en nombre → selecciona en canvas y filtra OPL), la creación con teclado
(O/P/S/R), los estados como cápsulas con renombrado inline, el in-zoom con 3 subprocesos y renombrado
encadenado, la distribución de enlaces al refinar, la tabla de enlaces, el diagnóstico con «Ir a…»,
la simulación paso a paso, y el undo transaccional (una aplicación OPL = un Ctrl+Z).

---

## 2. Cómo se levanta en local (lo que una reescritura debe simplificar)

- `bun run dev` = `bun run tutor:corpus && vite`. **Falla** fuera de la máquina del operador:
  `scripts/generar-corpus-tutor.ts:59` lee `docs/canon-opm/resolutor-urn.json` → `kora_raiz_default`
  (`/home/felix/kora-knowledge/...`) y aborta con `ENOENT`. Arranque real: `./node_modules/.bin/vite`
  directo (o `TUTOR_CANON_ROOT=…`). Sin corpus, el tutor queda sin contenido y aparece un 404 en consola
  en el primer arranque. **Olor**: el arranque del producto depende de un repositorio externo de
  gobernanza; contradice `AGENTS.md` («no hardcodees rutas a repositorios de dominio»).
- Persistencia dev: `vite.config.ts` monta `instalarModelPersistenceDevMiddleware` para
  `/__deep-opm/{session,workspace,modelos,auth,agent,review}` sobre repositorio en memoria; cada contexto
  de navegador obtiene tenant aleatorio (cookie firmada con secreto dev).
- Flags de build que cambian el producto: `VITE_MOBILE_READONLY` (shell móvil de lectura; **activo en
  `docker-compose.yml:8`**, es decir, en producción), `VITE_HEADLESS_RENDER`, `MODEL_REQUIRE_AUTH`
  (backend dev con login; cuenta sembrada `dev@opforja.local`), `VITE_OPFORJA_BUILD`.
- Hooks de prueba DEV-only (`editorBootstrap.tsx`): `window.__opmTest.exportarModeloActual()` (devuelve
  **string** JSON) y `nuevoModeloPlano()`; `window.__opmJointAdapter` (usado por e2e).
- Tiempo a toolbar visible: 9,0 s en frío (grafo Vite sin caché), 1,3 s en caliente; ~250 módulos en
  dev. En el arranque solo se observa `GET /__deep-opm/session`.
- Selectores estables útiles para una suite futura (de `e2e/_smoke-helpers.ts` y del recorrido):
  `toolbar-root`, `canvas-pane`, `opl-pane`, `tree-pane`, `inspector-pane`, `toolbar-drag-objeto`,
  `toolbar-drag-proceso`, `toolbar-crear-estado`, `abrir-menu-tipo-enlace`, `menu-tipo-enlace-<tipo>`,
  `indicador-modo-canonico`, `inspector-entidad-nombre`, `halo-estado-rename-input`,
  `extremo-origen-estado-select`, `tutor-refinamiento{,-pregunta,-confirmar}`, `renombrado-inline`,
  `panel-opl-editar-libre`, `panel-opl-editor-{textarea,aplicar,cancelar}`, `editor-opl-resumen`,
  `bloque-opl-<opdId>`, `opl-line`, `[data-opl-token="entidad:<id>"]`, `command-palette`,
  `command-palette-item-<id>`, `chip-persistencia`, `mobile-tab-*`. Los e2e mantienen helpers
  «no-op» por compatibilidad (`irATabRefinamiento`, `clickToolbarMasItem`→paleta): huellas de
  rediseños sucesivos.

---

## 3. Anatomía de la pantalla (1440×900)

### 3.1 Zonas y medidas (captura `01-inicial-1440.png`)

```
y=0   ┌ Opforja │ [Modelo]  + │ modelo · sd │ ● Sin guardar ⌃S ● Auto │ □Objeto O ○Proceso P ◇Estado S →Relación R │ editor vacío · ⌘K ┐  48 px
y=48  ├ OPL (240 px)       ├ TRABAJO DEL DOCUMENTO (agente) ~110 px ───────────────┤ ÍNDICE · OPDs (≈300 px alto) ┤
      │ plegar▾ nº editar  │ Actividad y resultados                                 │  SD                            │
      │ [Buscar en OPL…]   ├ Sin guardar aquí · Compartir revisión… · Proponer…    │  + Nuevo boceto OPD            │
      │ copiar md · filtrar│   Reutilizar pieza… · Paquete portátil…   ~26 px       ├ INSPECTOR · Selección          │
      │ (oraciones)        ├ SD · OPD RAÍZ ……………………… zoom · 100%   32 px          │  Selecciona un elemento.       │
      │                    │                                                        │  FICHA DE TRABAJO ▸            │
      │                    │   LIENZO  ≈ 830 × 640 px                               │  NOTA DEL MODELO ▸             │
      │ ▸ Diagnóstico      │   «¿Qué tienes más claro ahora?» (dos entradas)        │                                │
y=900 └────────────────────┴────────────────────────────────────────────────────────┴────────────────────────────────┘
```

- Lienzo útil ≈ 830×640 px ≈ **42 % del viewport**; en SD1 aparece además la fila «PREGUNTA GUÍA»
  (+30 px) y en simulación la barra de simulación (+~280 px), dejando **~330 px de alto** de diagrama
  (captura 42).
- Columna OPL fija en 240 px incluso a 1920 px (captura `60-desktop-1920.png`): cada oración ocupa 2–3
  líneas; la cabecera de bloque «SD en foco · nivel 0 (1 oraciones)» se rompe en 3 líneas (y tiene el
  error de concordancia «1 oraciones»).
- Controles interactivos visibles (conteo DOM): **33** al inicio, **49** con una cosa seleccionada,
  **58** con estados, **80** en SD1 con selección, **86** en simulación. En el shell móvil de lectura: 6.

### 3.2 Header y toolbar

- Grid del header (`ui/codex/CodexFrame.tsx:143`): `auto minmax(140px,340px) minmax(130px,320px)
  minmax(0,1fr) auto auto` → pestañas y breadcrumb se llevan hasta 660 px; la toolbar recibe el
  remanente (`minmax(0,1fr)`) y su contenedor `actions` tiene `overflowX: "auto"`
  (`ui/toolbar/toolbarStyles.ts:85-91`). Resultado medido:

| Viewport | `scrollWidth/clientWidth` de acciones | «Relación» visible |
|---|---|---|
| 1920×1080 | 507/507 | sí |
| 1440×900 inicial | — | **no** (tapado por `codex-header-meta`) |
| 1440×900 con modelo | 628/303 | no (hay que desplazar la toolbar) |
| 1280×800 | 507/227 | no |
| 1024×768 | 507/**0** | no: Objeto/Proceso/Estado/Relación desaparecen |

- La etiqueta de modo («Conectando: …», «Insertando objetos · Esc para salir», botón «Cancelar») se
  renderiza **dentro** del mismo clúster desbordado (`ToolbarCreacion.tsx`, bloque `indicador-modo-canonico`).
- Atajos mostrados con glifos Mac (`⌃S`, `⌘K`) también en Linux.
- El breadcrumb dice «modelo · sd · sd1» en minúsculas y no refleja el nombre del modelo tras
  guardarlo como «Hervidor de agua».

---

## 4. Recorrido tarea por tarea

Notación: **acciones** = clics + teclas significativas (tipear un nombre = 1 acción).

### 4.1 Pantalla inicial (`01`, `02`)

Se ve: wordmark «Opforja» en serif itálica, una pestaña «Modelo», breadcrumb, estado «● Sin guardar»
(el modelo vacío ya aparece «sucio»), toolbar, y en el centro, **antes que el lienzo**, el formulario
del agente («Qué quieres conseguir», «Alcance», «Autorizar edición directa…», «Iniciar encargo»,
«Agente no disponible · Guarda el documento para iniciar un encargo») y una fila de cinco acciones
documentales (revisión, propuesta de refinamiento, pieza, paquete portátil). Al pie del lienzo:
«¿Qué tienes más claro ahora? — Función y frontera · empezar por SD — Fragmento concreto · empezar en
Taller — Son dos entradas legítimas dentro del mismo Apunte.»

Jerarquía visual: el botón más saturado de la pantalla es **«Iniciar encargo»** (rojo, relleno), no
Objeto/Proceso. Un modelador entra y lo primero que lee es un formulario de IA deshabilitado y
vocabulario interno («Apunte», «Taller», «encargo», «pieza», «paquete portátil»). El panel derecho
muestra «FICHA DE TRABAJO» y «NOTA DEL MODELO» plegados sin explicación.

### 4.2 Crear un objeto (`03`)

- 1 clic en «Objeto» → aparece `Objeto` centrado en el lienzo, con anclas, y el foco salta al campo
  **Nombre del Inspector** (no a una edición inline sobre la figura). Tipear + Enter → «Agua».
  **2 acciones.** Bien.
- OPL inmediata: «**Agua** es un objeto informacional y sistémico.» con banda «OPL actualizada · 1 línea
  nueva o modificada». Diagnóstico «△ 1 mejora».
- Bajo la figura aparece la **anotación de selección** (`CodexSelectionAnnotation.tsx`, 917 líneas):
  «※ Descomp. · Desplegar · estado · Img · Alias · Inspector» + línea meta «Agua · objeto ·
  informacional · sistémico». Útil pero visualmente pesada; en SD1 se superpone a otras figuras y a la
  barra de acciones del documento (capturas 17, 29).
- El Inspector de la cosa abre con textos del tutor («Decide si la cosa existe o transforma.»,
  «Criterio», «Fundamento», «SEMÁNTICA ▾») antes de esencia/afiliación.
- **Fricción inmediata**: la toolbar ya se desborda (scroll horizontal) y «Estado» queda cortado.

### 4.3 Crear un proceso (`04`)

- Clic en lienzo (para foco de contexto `canvas`) + `P` → `Proceso` nace **a la izquierda de Agua y
  parcialmente fuera del lienzo**; el zoom pasa de 100 % a **160 %** sin acción explícita. Renombrar
  en Inspector → «Hervir». **3 acciones.**
- Mientras el proceso conserva el nombre por defecto no aparece en la OPL (queda como «cosa pendiente»);
  al nombrarlo aparece «*Hervir* es un proceso informacional y sistémico.». Coherente, pero no se explica.
- Aparece un nudge útil: «Siguiente paso: conectar **Hervir** que produce **Agua**. [Conectar como
  resultado]» (`EstadoVacioOpm.tsx`, `sugerirEnlaceResultado`).
- Diagnóstico «! 1 bloqueo»: «Proceso no transforma ningún objeto» (regla R-PROC-2).

### 4.4 Enlazar (consumo) (`05`, `06`)

- Seleccionar `Agua` + `R` → entra en modo conexión con **tipo sugerido «Consumo»**
  (`canvas/modoEnlace.ts:113`, prioridad `consumo, resultado, agente…` en `:19`). Clic en `Hervir` →
  enlace creado. **3 acciones.** OPL: «*Hervir* consume **Agua**.» Semántica y flecha correctas
  (punta en el proceso).
- **Pero** no hay feedback visible del modo: el texto «Conectando: Consumo · selecciona destino · Esc
  cancela» está en x=1658 (fuera del viewport de 1440). Tampoco se ve el menú «Relación» (tapado). Un
  usuario sin conocer `R` no puede enlazar con botones a 1440 px sin descubrir el scroll de la toolbar.

### 4.5 Estados (`07`–`10`)

- Seleccionar `Agua` + `S` → se crean **dos** estados `estado1` y `estado2` de una vez
  (`store/modelo/acciones-estados.ts:84-107`: si hay <2 estados, `crearEstadosIniciales`; OPM exige ≥2).
  OPL: «**Agua** puede estar `` `estado1` `` o `` `estado2` ``.» (backticks visibles).
- Aparece una caja de renombrado sobre `estado1`, **pero sin foco** (el foco queda en `BODY`): hay que
  hacer clic en ella. El segundo estado se renombra con doble clic en la cápsula (ahí sí recibe foco).
- Nombrar dos estados: seleccionar + S + clic caja + tipear/Enter + doble clic + tipear/Enter = **~6
  acciones**. Resultado visual limpio: cápsulas `fría` `caliente` dentro de `Agua`.

### 4.6 Inspector de enlace y reanclaje a estado (`11`, `12`)

- Seleccionar el enlace exige apuntar a una línea de ~1 px (JointJS `wrapper`); al seleccionarlo, la
  anotación «※ Enlace: Consumo · Propiedades · Inspector» y el rectángulo punteado se superponen al
  nombre `Agua`.
- El Inspector de enlace tiene **12 secciones** (`InspectorEnlace.tsx`): tutor («Pregunta qué le ocurre
  al objeto o qué habilita al proceso», Criterio, Fundamento), Etiqueta (placeholder «componente
  crítico», impropio para un consumo), Multiplicidad («Tabla filtrada por dirección y tipo vigente»),
  Modificador (Ninguno/Condición/Evento/NO), **Metadatos de enlace** (TASA, UNIDADES, SATISFIED
  TEXTUAL), Requisitos vinculados, Notas de mesa, Extremos («Anclaje exacto», «Puerto exacto ·
  21:00», `port-e-5-origen`), «Sin fan exacto», selector de estado por extremo, «Reanclar extremo»,
  «Eliminar enlace», «Editar OPL». Densidad alta; los identificadores internos (`port-e-5-origen`) y la
  notación horaria de puertos se exponen al usuario.
- Cambiar el origen a `fría` con el `select` «(toda la entidad) / fría / caliente»: OPL
  «*Hervir* consume **Agua** en `` `fría` ``.» — **verificar** con el canon OPL español si «en» es la
  forma canónica (ISO 19450 en inglés: «Boiling consumes cold Water»). **3–4 acciones** con scroll.

### 4.7 Resultado hacia un estado vía menú «Relación» (`13`, `13a`, `14`, `15`)

- Hay que **desplazar la toolbar** para ver «Relación». Con `Hervir` seleccionado, el menú muestra
  «Conectar Hervir → destino», pestañas «SALIDA / ENTRADA», y solo los tipos válidos por firma
  (Exhibición, Resultado, Efecto) con glifo (E, R, Ef).
- El menú promete: «…o selecciona otra cosa para filtrar por firma y previsualizar OPL». **Falla con
  estados**: al hacer clic en la cápsula `caliente` el menú se cierra y queda seleccionado el estado
  (la invariante «selección de estado excluye selección de entidad» borra el origen).
- Camino que sí funciona: menú → «Resultado» → clic en `caliente`. OPL resultante, correcta y
  elegante: «*Hervir* cambia **Agua** de `` `fría` `` a `` `caliente` ``.» **5 acciones** (incluido el scroll).
- Render: la flecha de resultado y la de consumo nacen/llegan cerca del borde común de las cápsulas;
  la línea desde `fría` atraviesa el texto de `caliente` (parece salir de `caliente`). Legibilidad baja
  justo en el patrón OPM más característico (cambio de estado).

### 4.8 In-zoom (`16`–`21`)

- Seleccionar `Hervir` → «Descomp.» → diálogo «Descomponer «Hervir»» con campo obligatorio
  «¿Qué pregunta buscas responder con este refinamiento?» (+ Criterio/Fundamento). **«Crear y abrir OPD»
  deshabilitado hasta escribir.** Puerta metodológica local, no regla OPM.
- Al confirmar: SD1 con contorno ampliado de `Hervir` y **tres subprocesos por defecto** «Hervir 1/2/3»
  apilados verticalmente; el foco queda en `renombrado-inline` sobre el primero y **Enter avanza al
  siguiente** (encadenado). Excelente: `Llenar` ↵ `Calentar` ↵ `Verificar` ↵.
- Semántica correcta: el consumo desde `fría` se distribuye a `Llenar` y el resultado a `caliente` sale
  de `Verificar` (`modelo/operaciones/refinamiento/proyeccion.ts:153-204`); OPL «*Hervir* se descompone
  en *Llenar*, *Calentar* y *Verificar* en esa secuencia.»; aparece **Timeline** en el Inspector (1.º,
  2.º, 3.º); el árbol muestra «SD1: Hervir descompuesto»; la fila «PREGUNTA GUÍA · ¿Cómo se calienta el
  agua? · Editar».
- Vista: zoom sigue en 160 % → el contorno desborda el lienzo, `Agua` queda cortada; al terminar el
  renombrado encadenado **el lienzo queda en blanco** (el scroll siguió a la edición). `Ctrl+0`
  («Ajustar OPD activo a pantalla», solo en paleta/atajo) lo arregla (122 %). No hay control de zoom
  visible; «zoom · 160%» es solo texto.
- Un badge «▼» dentro del contorno es `foldBadge` «Plegado parcial» (solo explicado por `<title>`).
- **Pasos in-zoom completo**: seleccionar + Descomp. + pregunta + confirmar + 3 renombres + Ctrl+0 =
  **~8 acciones**. Sin la pregunta y con encuadre automático serían 5.

### 4.9 Panel OPL: lectura y navegación (`27`–`29`)

- Encabezado «OPL COMPLETO · TODOS LOS OPDS»; bloques por OPD con «en foco · nivel N (k oraciones)»;
  controles «plegar ▾», «nº», «editar», buscador, «copiar md», «filtrar por selección».
- Clic en una **oración** completa: no selecciona nada (ni enlace ni cosas). Clic en un **token** de
  nombre (`[data-opl-token="entidad:p-15"]`, rol `button`, «Pulsa Enter o F2 para editar el
  nombre»): selecciona la cosa en el lienzo **y** filtra la OPL a sus oraciones («filtrado · p.15 ·
  3/14 ×»). Muy bueno como puente OPL→OPD.
- «filtrar por selección» sin selección muestra «filtrado · 14/14» **dos veces** (header y barra).
- Estados renderizados como `<code>` con los backticks visibles; procesos en *itálica* subrayada
  punteada, objetos en **negrita** subrayada. En móvil la OPL se lee mejor que en la columna de 240 px
  del escritorio (captura 54/56).

### 4.10 Edición OPL (reverse) — defecto crítico (`22`–`26`)

- «editar» convierte la columna de 240 px en editor: ayuda de sintaxis, aviso de familias no editables,
  `textarea` monoespaciada, y tres listas («Sentencias reconocidas», «Cambios aplicables», «No
  aplicables») con contadores; pie «N aplicables · M bloqueadas · Cancelar · Aplicar N cambios».
- **Ayuda incorrecta**: dice «**negritas** para cosas (objetos, procesos) y *itálicas* para estados»;
  el texto generado usa **negrita = objeto**, *itálica* = proceso y `` `backticks` `` = estado.
- El textarea contiene **todo el modelo** (bloques SD y SD1 concatenados, con oraciones repetidas).
- **Sin editar nada**, tanto en SD como en SD1: «4 aplicables · 0 bloqueadas»:
  `L4 … se descompone en … en esa secuencia.` → «orden de descomposición (3 bandas)»;
  `L5 *Hervir* cambia **Agua** de `fría` a `caliente`.` → «crear enlace efecto»;
  `L13 *Llenar* consume **Agua** en `fría`.` → «crear enlace consumo»;
  `L14 *Verificar* genera **Agua** en `caliente`.` → «crear enlace resultado».
- Añadí dos líneas («**Tetera** es un objeto físico y sistémico.», «**Calentar** requiere **Tetera**.»)
  y apliqué «6 cambios». Resultado en el JSON exportado: se crearon `Tetera` e `instrumento` (bien) **y**
  `e-26 efecto {entidad p-3} → {entidad o-1}` con `estadoEntradaId: "s-7"`, `estadoSalidaId: "s-8"`:
  el mismo hecho que ya expresaban `e-5 consumo s-7→p-3` + `e-9 resultado p-3→s-8`, ahora en encoding
  «TS3 compacto», y ubicado en SD1 contra el contorno. El diagnóstico lo delata al instante
  («Transformador no se proyecta al subproceso», «Descomposición no preserva su frontera»). `Tetera`
  nació fuera del área visible.
- Causas visibles: (a) el modelo admite **dos encodings** del mismo cambio de estado (par
  consumo+resultado vs. `efecto` con `estadoEntradaId/estadoSalidaId`, ambos con fixture estricta en
  `opl/fixtures-roundtrip.ts:395-455`, pero solo en un OPD); (b) el editor mezcla oraciones de varios
  OPD y el clasificador las evalúa contra el OPD activo; (c) las oraciones con `en `estado`` no se
  reconocen como ya existentes. Complementa la matriz de `opl.md` §6 (que lo detectó por sondas, no en
  navegador y sin la escritura duplicada).
- Lo bueno: **un Ctrl+Z revierte toda la aplicación** (transacción única), y la clasificación previa
  por línea es una idea valiosa («honesta»).

### 4.11 Diagnóstico (`19`)

- Panel plegable al pie de la columna OPL: «! 1 bloqueo» → tarjeta «Proceso no transforma ningún
  objeto — El proceso "Calentar" no consume, produce ni afecta ningún objeto… — Ir a Calentar —
  Criterio». Mensajes claros y accionables. Anunciador ARIA «Diagnóstico actualizado: 1 hallazgo
  nuevo» tras cada cambio.
- Severidad discutible: un subproceso recién creado y aún sin enlaces es estado normal de trabajo pero
  figura como **bloqueo** (rojo). Al expandirse, el diagnóstico se come la mitad de la columna OPL.

### 4.12 Paleta de comandos (`20`)

- `Ctrl+K` es la **única** puerta a menús (no hay menú visible): 60 ítems sin consulta, agrupados
  «Para la selección / Crear / Recientes», **dos regiones con scroll propio** dentro del modal.
- Duplicados: «Descomponer (Shift+I)» y «Crear inzoom de la cosa seleccionada (Shift+I)»;
  «Desplegar (Shift+U)» y «Desplegar selección (Shift+U)»; «Buscar cosas en el modelo» y «Buscar en el
  modelo» (ambos Ctrl+F); «Eliminar selección» ×2 (Delete/Backspace); «Ir a pestaña 1…9».
- Superficies de gobierno del propio repo expuestas al usuario final: «Bugs y features» (ledger local),
  «Capturar bug», «Copiar contexto para la skill», «Copiar log de decisiones para la skill», «Cerrar
  sesión» (en un entorno sin login).
- Búsqueda contaminada por el tutor: «mapa» → solo «Referencia · …» y «Fuente · …»; «valid» → solo
  referencias. El «Mapa del sistema» existe en código pero está apagado (`app/features.ts:8`
  `mapaSistema: false`).

### 4.13 Guardar, gestor y diálogos (`30`–`41`)

| Diálogo | Cómo se abre | Qué se ve / fricción |
|---|---|---|
| Guardar como (`30`,`31`) | `Ctrl+S` | Destino «Inicio / Modelos locales», «Cambiar carpeta destino», Nombre, Descripción, «Crear versiones en guardados manuales» + dos párrafos que explican Variante vs Versión. 3 acciones. Tras guardar: pestaña «Hervidor de agua», chip «○ Guardado», agente «No autenticado». |
| Trabajo de modelado (`32`,`33`) | Ctrl+K → «Abrir / importar» | Carpetas + 4 espacios (Taller, Modelos, Bibliotecas, Archivo), búsqueda, «Importar JSON», grupo «CON PENDIENTES · Modelo reconocido · requiere cierre adicional», fila con «1 PENDIENTE», **TAMAÑO 0** (con contenido), MARCAS (punto azul sin leyenda), «Acciones ▾»; abrir = doble clic (no hay botón por fila). |
| Configuración (`34`) | paleta | Nombre del modelo, cuadrícula (paso, color, grosor, escala, snap), OPL esencia (Siempre / Solo si difiere / Oculta). Compacto y correcto. |
| Atajos (`35`) | paleta | Lista larga (≈60) por categoría; **Escape no lo cierra** (solo ×). Muestra duplicados (Ctrl+D ×2, Ctrl+Arrow ×2 por contexto). |
| Tabla de enlaces (`36`) | paleta | Excelente: filtro por texto/tipo, Todos/Procedurales/Estructurales, columnas Tipo/Origen/Destino (con `Agua.fría`)/Etiqueta/Mult./OPDs, acciones «← Origen», «Destino →», «Eliminar». |
| Versiones (`37`) | paleta | «Crear version ahora» (sin tilde), «Mostrar versiones», «Versiones ocultas.», bloque tutor. |
| Piezas (`38`) | paleta | Estereotipos/marcadores (`<<Requirement>>`), «Guardar selección como estereotipo». |
| Buscar cosas (`39`) | `Ctrl+F` | Filtros Todos/Objetos/Procesos/Estados/Enlaces. Correcto. |
| Gestión del árbol (`40`) | `Ctrl+D` | Duplica el índice ya visible; **Escape no lo cierra**; «Cortar» por fila. |
| Menú contextual (`41`) | clic derecho sobre `Llenar` | 12 entradas: Descomponer, Desplegar, Satisfacer requisito, Editar alias, Conectar submodelo, Componer con modelo…, «Traer conectados…» **y** «Traer conectados», Mostrar qué requiere, Calcular impacto de eliminar, Ver impacto aguas abajo, Ocultar de este OPD. **Faltan** Renombrar, Eliminar, Agregar estado, Esencia/Afiliación, Conectar. |

### 4.14 Simulación conceptual (`42`, `43`)

- Ctrl+K → «Simulación conceptual». La toolbar desaparece; la barra de simulación ocupa ~280 px:
  «Listo para simular · paso 1 de 3 · Llenar», explicación («Inicio del proceso: consume Agua: fría ->
  sin estado»), Criterio/Fundamento, reproducir/paso/correr/reiniciar/rápido/salir,
  determinista/muestreo/exhaustivo, seed, ½x–4x, contadores «cons proc completado 00/03», «Escenario
  Sin fijar».
- «paso» avanza por fases (1/3 → 2/3); el subproceso activo recibe halo rojo punteado; `Agua` se marca
  como en transición. Funciona y comunica la semántica temporal del in-zoom. «salir» restaura la toolbar.
- Fricción: la barra se apila **debajo** del panel del agente (no lo reemplaza): el diagrama queda en
  ~330 px de alto.

### 4.15 Taller, bocetos y pestañas (`61`, `62`)

- «Fragmento concreto · empezar en Taller» crea «Boceto 1» («BOCETOS · 1 OPD AÚN SIN INTEGRAR. SUS
  HECHOS YA EMITEN OPL.», kicker «BOCETO 1 · BOCETO NO INTEGRADO», «Este OPD no tiene pregunta guía ·
  Añadir pregunta», toast «Boceto OPD creado»), **pero la misma pregunta «¿Qué tienes más claro ahora?»
  sigue en pantalla**: el usuario no sabe si ya eligió. Concepto de producto (OPD suelto no
  integrado al árbol) sin correlato en ISO 19450.
- «+» junto a la pestaña crea una segunda pestaña «Modelo» idéntica (sin nombre distintivo).

### 4.16 Persistencia duplicada (`31`, `63`, `65`)

- Indicadores simultáneos: (1) `chip-persistencia` («● Sin guardar ⌃S» / «○ Guardado», backend
  `/__deep-opm/modelos`), (2) «● Auto» (autosalvado), (3) meta del header («N oraciones · sin guardar ·
  ⌘K»), (4) `DocumentPersistenceStatus` («Guardado aquí» / «Sin guardar aquí», documento local-first
  con «Guardar aquí», «Sincronizar ahora», «Descargar recuperación» y resolución de ramas en conflicto).
- Observado: (4) alterna entre «Sin guardar aquí» y «Guardado aquí» sin acción del usuario; después de
  «Guardar como» (1) dice «Guardado» y (4) «Sin guardar aquí. El servidor aún no confirmó esta revisión
  local.». Para el usuario, **dos verdades sobre si su trabajo está a salvo**.

---

## 5. Responsive

### 5.1 Desktop (`60-desktop-*`)

- 1920: todo cabe; el lienzo gana ancho (1308 px) pero la OPL sigue en 240 px.
- 1280: lienzo 668 px; «Relación» fuera de vista.
- 1024 (aún «desktop»: `BREAKPOINT_TABLET_MAX = 1024`, `ui/layoutResponsive.ts:21-33`): lienzo **412 px**,
  toolbar de creación con 0 px visibles; el agente se reorganiza en dos filas y empuja el lienzo más
  abajo; zoom 55 %. La única forma de crear es con teclado (O/P).

### 5.2 Móvil 390×844

**a) Build por defecto (`VITE_MOBILE_READONLY` ausente) — «edición» móvil** (`50`–`54`):
- Header con chip de persistencia y «Auto», pestaña, **formulario del agente ocupando ~40 % de la
  altura**, fila «Sin guardar aquí · ▸ Acciones del documento», lienzo y tabs inferiores
  Canvas/OPDs/OPL/Diagnóstico. 16 controles.
- No hay herramientas de creación (la toolbar pesada se omite en `esMobile`), no hay estado vacío ni
  mensaje: lienzo en blanco. Con modelo importado, el diagrama aparece sin encuadrar (cortado a la derecha).
- La pestaña OPL es la mejor lectura OPL de toda la app (ancho completo, tipografía grande).

**b) Build de producción (`VITE_MOBILE_READONLY=true`, `docker-compose.yml:8`)** (`51`–`57`):
- Shell `MobileReadonlyApp`: título del OPD («SD»), lupa, tabs Modelos/Diagrama/OPDs/OPL/Acerca. 6
  controles. Limpio.
- «Modelos guardados — No hay modelos guardados. Para crear o editar, abre opforja en escritorio o
  tablet.» con un modelo recién importado (la lista no refleja el modelo abierto).
- Diagrama: sin encuadre (gran vacío superior, `Agua` cortada); «Acerca»: «Modelo OPM en modo lectura…
  la mutación pertenece a una apertura editable compatible» + Criterio/Fundamento.
- OPL: muestra el botón **«editar»** en modo lectura.
- `Ctrl+K → Abrir / importar → Importar y reemplazar pestaña activa` **funciona** dentro del shell de
  lectura (mutación del modelo abierto en un modo declarado solo lectura).

---

## 6. Pasos por tarea (hoy vs. objetivo razonable)

| Tarea | Acciones hoy | Obstáculos | Objetivo |
|---|---|---|---|
| Crear y nombrar objeto | 2 | foco al Inspector, no inline | 2 (inline en figura) |
| Crear y nombrar proceso | 3 (clic lienzo + P + nombre) | nace fuera de vista, zoom salta | 2 |
| Enlazar consumo | 3 con `R`; ~5 con menú | «Relación» oculto, modo invisible | 2 (arrastrar desde ancla) |
| Dos estados con nombre | ~6 | caja de renombre sin foco | 3 (S → nombre ↵ nombre ↵) |
| Cambiar extremo a estado | 3–4 + scroll | select al fondo del Inspector | 1 (soltar sobre cápsula) |
| Resultado a estado (menú) | 5 | scroll toolbar, menú se cierra al clicar estado | 2 |
| In-zoom con 3 subprocesos | ~8 | pregunta obligatoria, Ctrl+0 oculto | 5 |
| Añadir oración OPL | 3 (editar, tipear, aplicar) | **aplica cambios fantasma** | 3, idempotente |
| Guardar | 3 (Ctrl+S, nombre, Guardar) | estados contradictorios después | 2 + un solo indicador |
| Encuadrar diagrama | 1 (Ctrl+0) | sin botón, sin auto-encuadre | 0 (auto) / 1 botón visible |

---

## 7. Catálogo de defectos verificados en vivo

| ID | Sev. | Defecto | Reproducción | Origen probable |
|---|---|---|---|---|
| UX-01 | Crítica | Editor OPL no idempotente y escritura duplicada | Modelo con in-zoom + enlaces a estado → «editar» → sin cambios «4 aplicables»; aplicar crea `efecto` compacto duplicado | `opl/clasificadorEdicion`, parser/aplicador reverse; dos encodings de TS3 |
| UX-02 | Alta | «Relación» tapado/oculto; toolbar 0 px a 1024 | 1440 inicial; cualquier modelo a 1280/1024 | `CodexFrame.tsx:143`, `toolbarStyles.ts:85-91` |
| UX-03 | Alta | Indicador de modo conexión/inserción fuera de vista | `R` con cosa seleccionada | `ToolbarCreacion.tsx` (indicador dentro del clúster desbordado) |
| UX-04 | Alta | Señales de persistencia contradictorias | Guardar como → chip «Guardado» vs «Sin guardar aquí» | `ToolbarPersistenceStatus` vs `DocumentPersistenceStatus.tsx` |
| UX-05 | Media | Auto-zoom y colocación fuera de vista; lienzo en blanco tras renombrado encadenado | Crear 2ª cosa; in-zoom + renombres | adaptador JointJS / scroll-to-edit; coordenadas ~(3400,2400) en papel enorme |
| UX-06 | Media | Menú «Relación» se cierra al clicar un estado destino | Menú abierto → clic cápsula | invariante selección estado ⇒ entidad nula |
| UX-07 | Media | Caja de renombre de estado sin foco | `S` sobre objeto | `HaloEstado.tsx:85` (foco solo si `renombradoInline`) |
| UX-08 | Media | Backticks literales en OPL; ayuda del editor contradice sintaxis | Cualquier estado | render de tokens `<code>`; `EditorOplHonesto.tsx` (texto de ayuda) |
| UX-09 | Media | Shell móvil de lectura permite importar/reemplazar vía Ctrl+K; muestra «editar» | 390×844 build prod | paleta y panel OPL montados sin guardia de solo lectura |
| UX-10 | Media | Lista «Modelos guardados» vacía con modelo abierto; diagrama sin encuadre en móvil | 390×844 | `MobileReadonlyApp` / `VistaModelosLectura` |
| UX-11 | Baja | Escape no cierra «Atajos» ni «Gestión del árbol» | abrir y pulsar Esc | handlers de diálogo propios |
| UX-12 | Baja | Pregunta de entrada persiste tras elegir «Taller» | clic «empezar en Taller» | `EstadoVacioOpm` condiciona a SD vacío |
| UX-13 | Baja | «(1 oraciones)», «Crear version», breadcrumb «modelo», «TAMAÑO 0», glifos Mac en Linux | varios | textos/formatos |
| UX-14 | Baja | Duplicados en paleta y menú contextual («Traer conectados…» + «Traer conectados») | Ctrl+K / clic derecho | registro de atajos + catálogo de acciones sin deduplicar |
| UX-15 | Baja | Anotación de selección se superpone a figuras vecinas y a la barra documental | seleccionar en SD1 | `CodexSelectionAnnotation.tsx` |

---

## 8. Reglas OPM observadas en vivo (sagradas; ubicación en código)

Solo las que el recorrido ejerció; el catálogo completo está en `canon-reglas-*.md`, `opl.md` §8 y
`render-canvas.md` §4.

1. **Firmas de enlace** — `modelo/operaciones/helpers.ts:58-147` (`validarFirmaEnlace`): consumo y
   instrumento Objeto→Proceso; resultado Proceso→Objeto; agente Objeto **físico**→Proceso; efecto
   Proceso→Objeto (o Estado→Proceso de entrada, u Objeto→Proceso solo como rama de abanico); invocación
   Proceso→Proceso; excepciones temporales Proceso→Proceso con manejador **ambiental** (R-EXC-1A);
   estructurales fundamentales sin extremos Estado; agregación/generalización/clasificación/etiquetado
   entre la misma clase OPM. Visto en vivo: el menú «Relación» desde un proceso ofrece solo
   Exhibición/Resultado/Efecto.
2. **Tipos permitidos por par y dirección** — `modelo/opcionesEnlace.ts:12` (`TIPOS_ENLACE_CANONICOS`),
   `:45` (`evaluarTiposEnlacePermitidos`), `:100` (`tiposEnlacePermitidos`).
3. **Tipo inicial sugerido** — `canvas/modoEnlace.ts:19` (`PRIORIDAD_TIPO_INICIAL`: consumo, resultado,
   agente, …) y `:113` (`tipoInicialConexionDesdeEntidad`): desde `Agua` sugirió Consumo.
4. **Un objeto con estados tiene al menos dos** — `store/modelo/acciones-estados.ts:84-107`
   (`agregarEstadoSmart` → `crearEstadosIniciales` si hay <2).
5. **Cambio de estado = par entrada/salida** — consumo desde estado + resultado a estado (o `efecto`
   con `estadoEntradaId/estadoSalidaId`) se verbaliza «P cambia O de a a b»; fixtures estrictas en
   `opl/fixtures-roundtrip.ts:395-455`. **La dualidad de encoding es la raíz de UX-01**: la reescritura
   debe elegir una representación canónica.
6. **In-zoom de proceso** — `modelo/operaciones/refinamiento/descomposicion.ts:72` (`descomponerProceso`,
   `subcosasInicialesInzoom`: 3 subprocesos) y proyección/distribución de enlaces externos
   `refinamiento/proyeccion.ts:153-269` (`proyeccionesCanonicasEnlaceExternoRefinado`,
   `distribuirEnlaceExternoEnRefinamiento`, `redistribuirEnlacesExternosSiPrimerSubproceso`); orden
   temporal por posición vertical («en esa secuencia»); apariencias con `contextoRefinamiento`
   `{tipo:"descomposicion", rol:"contorno"|"interno", contenedorAparienciaId}`.
7. **Diagnósticos metodológicos** — «Proceso no transforma ningún objeto» (`modelo/tituloRegla.ts:37`,
   severidad R-PROC-2 en `modelo/diagnosticoSeveridad.ts:27`); «Descomposición no preserva su
   frontera» (`modelo/checkers.ts:138`, `tituloRegla.ts:41`); «Transformador no se proyecta al
   subproceso» (`tituloRegla.ts:91`, regla `visual-transformador-contorno-no-distribuido` en
   `refinamiento/proyeccion.ts:283` / `diagnosticoVisual.ts`).
8. **Valores por defecto de cosa** — esencia `informacional`, afiliación `sistemica`; la OPL los
   verbaliza siempre salvo configuración «OPL · Esencia» (Siempre / Solo si difiere / Oculta).
9. **Simulación conceptual** — consumo destruye (`fría -> sin estado`), proceso activo deja objetos «en
   transición hasta el resultado», fases por subproceso en el orden del in-zoom.

---

## 9. Contratos observados en vivo

- **Formato exportado** (`__opmTest.exportarModeloActual()`, igual al de «Exportar JSON»):

```json
{
  "formato": "deep-opm-pro.modelo.v0",
  "modelo": {
    "id": "modelo-1", "nombre": "Modelo", "opdRaizId": "opd-1", "nextSeq": 24,
    "entidades": { "p-3": { "id": "p-3", "tipo": "proceso", "nombre": "Hervir",
      "esencia": "informacional", "afiliacion": "sistemica",
      "refinamientos": { "descomposicion": { "opdId": "opd-11" } } } },
    "estados": { "s-7": { "id": "s-7", "entidadId": "o-1", "nombre": "fría" } },
    "enlaces": { "e-5": { "tipo": "consumo",
      "origenId": { "kind": "estado", "id": "s-7" },
      "destinoId": { "kind": "entidad", "id": "p-3", "portId": "port-e-5-destino" } } },
    "opds": { "opd-11": { "id": "opd-11", "nombre": "SD1", "padreId": "opd-1", "preguntaGuia": "…",
      "apariencias": { "a-14": { "id": "a-14", "entidadId": "p-13", "opdId": "opd-11",
        "x": 3533, "y": 2483, "width": 135, "height": 60,
        "contextoRefinamiento": { "tipo": "descomposicion", "refinableEntidadId": "p-3",
          "rol": "interno", "contenedorAparienciaId": "a-12" },
        "ports": { "port-e-20-destino": { "x": 0, "y": 0 } } } },
      "enlaces": { "ae-21": { "id": "ae-21", "enlaceId": "e-20", "opdId": "opd-11", "vertices": [] } } } },
    "abanicos": {}
  }
}
```

  Observaciones para migrar: IDs secuenciales con prefijo por clase (`o-`, `p-`, `s-`, `e-`, `a-`,
  `ae-`, `opd-`) y `nextSeq` global; extremos tipados `{kind, id, portId?}`; enlaces de modelo separados
  de sus apariciones por OPD (`opds[*].enlaces`); coordenadas absolutas grandes (~3400, 2400); puertos
  por apariencia; `preguntaGuia` persistida en el OPD.
- **HTTP** (dev = prod): `/__deep-opm/session`, `/workspace`, `/modelos`, `/auth`, `/agent`, `/review`,
  `/__deep-opm/bug-reports` (capturador). Detalle en `server-deploy.md`.
- **Texto OPL** con marcas: `**objeto**`, `*proceso*`, `` `estado` ``; una oración por línea; bloques por OPD.
- **Registro de atajos** (`app/ports/globalShortcutsPort.ts:221-340`): O, P, S, R, Shift+I, Shift+U,
  Ctrl+0, Ctrl+K, Ctrl+S, Ctrl+Z/Y, Ctrl+F, Ctrl+D, Ctrl+H, F2/D/T (estado), flechas (nudge), Space (sim).

---

## 10. Capacidades vistas en vivo (valor)

| Capacidad | Valor | Evidencia |
|---|---|---|
| Crear objeto/proceso/estado por botón y teclado | núcleo | 4.2–4.5 |
| Enlaces procedurales con firma validada y tipo sugerido | núcleo | 4.4, 4.7 |
| Extremos a estado; fusión OPL «cambia de/a» | núcleo | 4.6–4.7 |
| In-zoom con 3 subprocesos, distribución de enlaces, orden temporal | núcleo | 4.8 |
| Árbol OPD + breadcrumb | núcleo | 4.8 |
| OPL en vivo por OPD con tokens navegables y filtro por selección | núcleo | 4.9 |
| Edición OPL reverse con clasificación previa | núcleo (hoy defectuoso) | 4.10 |
| Undo/redo transaccional | núcleo | 4.10 |
| Guardar/abrir/importar/exportar JSON | núcleo | 4.13 |
| Diagnóstico accionable | importante | 4.11 |
| Tabla de enlaces | importante | 4.13 |
| Buscar cosas (Ctrl+F) | importante | 4.13 |
| Simulación conceptual | importante | 4.14 |
| Exportar PNG / OPL markdown | importante | paleta |
| Configuración (cuadrícula, esencia OPL) | importante | 4.13 |
| Versiones | marginal | 4.13 |
| Pestañas múltiples | marginal | 4.15 |
| Lector móvil | marginal (bien encaminado) | 5.2 |
| Timeline en Inspector | marginal | 4.8 |
| Panel del agente («encargo») siempre montado | acreción en su forma actual | 3.1, 4.1 |
| Acciones documentales (revisión, propuesta, pieza, paquete portátil) en el cromo | acreción | 4.1, 4.16 |
| Doble sistema de persistencia visible | acreción | 4.16 |
| Tutor «Criterio / Fundamento» en casi todo panel | acreción | 4.2, 4.6, 4.8, 4.14 |
| Pregunta guía obligatoria para refinar | acreción | 4.8 |
| Taller / Bocetos / Apunte / Mesa / Biblioteca / Archivo | acreción (conceptos de producto no OPM) | 4.15, 4.13 |
| Requisitos, notas de mesa, metadatos «OPCloud» (tasa, unidades, satisfied) | marginal | 4.6 |
| Bug ledger, capturador, «copiar contexto para la skill» | acreción | 4.12 |
| Mapa del sistema (dormido, 1 552 líneas) | acreción | 4.12 |
| Gestión del árbol (Ctrl+D) | duplicación | 4.13 |

---

## 11. Sobreingeniería y lastre visibles en la UI (ejemplos concretos)

1. **Cromo antes que lienzo**: agente + acciones documentales + kicker + pregunta guía + barra de
   simulación apilados sobre el canvas; el canvas nunca recibe más de ~42 % del viewport de 1440.
2. **Cuatro indicadores de persistencia** y dos backends de guardado conceptualmente paralelos
   (`chip-persistencia` vs `DocumentPersistenceStatus` con ramas en conflicto).
3. **Tutor omnipresente**: bloques «Criterio / Fundamento» (componente `TutorDetails`, referenciado
   desde 26 archivos de UI) en Inspector, enlace, refinamiento, versiones, simulación, diagnóstico y
   «Acerca» móvil; la paleta mezcla comandos con «Referencia · …» y «Fuente · …».
4. **Inspector de 17 secciones** de entidad (`InspectorEntidad.tsx`) y 12 de enlace: Alias,
   Anclaje, Anclas, Apariciones, Atributo, Cobertura de requisito, Descripción, Enlaces, Esencia/Afiliación,
   Imagen, Layout de estados, Notas de mesa, Refinamiento, Requisitos vinculados, Tamaño, URLs, …
   Esencia/afiliación (lo más OPM) aparece bajo el pliegue.
5. **Vocabulario interno en la interfaz**: Apunte, Taller, Boceto, Mesa, Pieza, Encargo, Biblioteca,
   Archivo, «Modelo reconocido · requiere cierre adicional», «Puerto exacto · 21:00»,
   `port-e-5-origen`, «Sin fan exacto».
6. **Rediseños superpuestos**: comentarios con rondas «Codex v2 L2», «Ronda 25 L1 III.A», helpers e2e
   convertidos en no-op, testids heredados (`toolbar-drag-objeto` para un botón de clic), mapa del
   sistema apagado por flag pero compilado en su propio chunk (`vite.config.ts`, `feature-mapa`).
7. **Puertas metodológicas como fricción obligatoria** (pregunta guía) en lugar de sugerencia.
8. **Dos shells móviles** (edición móvil sin herramientas vs lectura de producción) seleccionados por
   flag de build.
9. **Paleta como única puerta** a >60 comandos, con duplicados y sin menú descubrible.

---

## 12. Piezas de alta calidad (portar casi tal cual, a nivel de comportamiento)

- **Semántica de creación/enlace**: `validarFirmaEnlace` + `evaluarTiposEnlacePermitidos` + tipo
  inicial sugerido; el menú que muestra solo tipos válidos por firma y dirección (idea, no layout).
- **In-zoom**: 3 subprocesos por defecto + **renombrado encadenado con Enter** + distribución de
  enlaces externos + Timeline de orden.
- **Estados**: creación de dos iniciales, cápsulas dentro del objeto, doble clic para renombrar.
- **OPL viva**: banda «OPL actualizada · N líneas», bloques por OPD, **tokens navegables** (clic →
  selección + filtro), numeración opcional, copiar markdown.
- **Nudge contextual** «Siguiente paso: conectar P que produce O · Conectar como resultado».
- **Diagnóstico** con mensaje causal y «Ir a…», anunciador ARIA de deltas.
- **Tabla de enlaces** (filtros, navegación a extremos).
- **Undo transaccional** de operaciones compuestas (aplicación OPL).
- **Simulación conceptual** paso a paso con fases y explicación.
- **Clasificación previa del editor OPL** (reconocidas / aplicables / no aplicables), una vez sea idempotente.
- **Shell móvil de lectura** como concepto (tabs Diagrama/OPDs/OPL): limpio y liviano.
- **Configuración** compacta.

---

## 13. Recomendaciones keep / simplify / cut por superficie

| Superficie | Rec. | Justificación |
|---|---|---|
| Canvas + gramática visual OPM | keep | correcta y legible; arreglar ruteo en cápsulas de estado |
| Toolbar de creación | simplify | 4 botones fijos siempre visibles (paleta flotante o columna vertical en el lienzo); indicador de modo junto al cursor/lienzo |
| Header (pestañas, breadcrumb, meta) | simplify | una sola línea con nombre del modelo, ruta OPD y **un** estado de guardado |
| Panel del agente «Trabajo del documento» | cut del cromo por defecto | mostrar solo si hay agente configurado, como panel invocable |
| Acciones documentales (revisión, propuesta, pieza, paquete) | cut del cromo | mover a menú Archivo/Compartir; evaluar si sobreviven |
| `DocumentPersistenceStatus` vs chip | simplify | un modelo de persistencia y un indicador |
| Columna OPL | keep + simplify | ancho redimensionable real, más ancha por defecto; ocultar controles secundarios |
| Editor OPL libre | keep + fix | alcance = OPD activo; idempotencia como invariante probada en navegador; ayuda de sintaxis correcta |
| Inspector de entidad | simplify | 4–5 secciones visibles (nombre, esencia/afiliación, estados, descripción, refinamiento); resto bajo «Avanzado» |
| Inspector de enlace | simplify | tipo, extremos (con estado), multiplicidad, etiqueta; ocultar puertos/IDs/metadatos OPCloud |
| Anotación de selección on-canvas | simplify | 2–3 acciones, sin línea meta, sin superponer |
| Pregunta guía obligatoria | cut como obligación | opcional/sugerida |
| Tutor «Criterio/Fundamento» | simplify | ayuda contextual bajo demanda (un «?»), fuera de la paleta de comandos |
| Paleta de comandos | keep + simplify | deduplicar, separar búsqueda de referencias, añadir menú visible mínimo |
| Menú contextual de entidad | simplify | Renombrar, Eliminar, Estado, Conectar, Refinar, Ocultar primero |
| Diagnóstico | keep | revisar severidades (trabajo en curso ≠ bloqueo) |
| Tabla de enlaces, Buscar, Configuración | keep | útiles y sobrios |
| Gestión del árbol (Ctrl+D) | cut | duplica el índice |
| Simulación conceptual | keep + simplify | barra compacta de una línea; modos avanzados plegados |
| Taller/Bocetos/Apunte/Mesa/Biblioteca/Archivo | cut o posponer | conceptos de producto que no son OPM; complican el gestor y la entrada |
| Gestor «Trabajo de modelado» | simplify | lista de modelos + importar; sin espacios ni «pendientes» |
| Versiones | keep mínimo | «guardar versión / restaurar» |
| Bug ledger, capturador, contexto skill, log de decisiones | cut del producto | herramientas del equipo, no del modelador |
| Mapa del sistema dormido | cut | código muerto tras flag |
| Móvil: dos shells | simplify | un único lector móvil (el de producción), con encuadre automático |

---

## 14. Principios de UX para la reescritura (derivados de lo observado)

1. **El lienzo y la OPL son el producto**: ≥70 % del viewport a 1440 para lienzo+OPL; nada fijo encima
   del lienzo salvo una barra de ruta de ~32 px.
2. **Cuatro verbos siempre visibles** (Objeto, Proceso, Estado, Enlace) a cualquier ancho ≥768 px; el
   modo activo se anuncia en el lienzo.
3. **Una sola verdad de guardado**, visible y consistente con cualquier diálogo.
4. **Idempotencia bimodal como invariante verificable**: generar OPL → reparsear → 0 cambios, en
   navegador, con in-zoom y estados; un único encoding canónico por hecho OPM.
5. **Vista que se cuida sola**: auto-encuadre al crear/navegar/refinar; botón de encuadre visible.
6. **Metodología como sugerencia, no como puerta**: nudges y diagnóstico sí; campos obligatorios no.
7. **Vocabulario OPM, no de proyecto**: objeto, proceso, estado, enlace, OPD, refinamiento.
8. **Profundidad progresiva**: Inspector corto por defecto; lo raro, plegado.

---

## 15. Límites de esta evaluación

- Dev server con backend en memoria; no se probó el build de producción ni Postgres ni login real.
- Sin corpus del tutor: los textos «Referencia/Fuente» del tutor aparecían igualmente en la paleta,
  pero el contenido de ayuda pudo diferir del de producción.
- Chromium headless; sin interacción táctil real (tap/drag en móvil no evaluados), sin arrastre desde
  anclas (gesto documentado por el nudge «arrastra desde un anchor ◉»; no probado).
- No se probaron: unfold/desplegar, enlaces estructurales, abanicos, modificadores (condición/evento),
  simulación numérica, composición de modelos, revisión compartida, agente IA, exportación PNG/ZIP.
- La severidad es juicio de una persona experta en OPM; suite verde ≠ validación con usuarios reales.
- Procesos lanzados (Vite 5199/5200, Chromium CDP 9333) terminados al cierre; el repositorio no se modificó.
