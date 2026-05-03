---
epica: "EPICA-61"
titulo: "Exportar SVG — exportar diagramas OPD como imagenes vectoriales"
doc_fuente: "opcloud-reverse/61-export-svg.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "C"
hu_emitidas: 26
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta epica cubre la exportacion de uno o mas OPDs del modelo como imagenes vectoriales SVG. El punto de entrada canonico es `Main menu ▸ Exports ▸ Export Model Diagrams`, que abre un modal unico con dos formatos co-primarios (`JPEG` / `SVG`) y tres alcances (`Current OPD`, `OPD Tree`, `SD`). La rama JPEG se menciona solo para contraste — el alcance central de esta epica es la rama SVG.

La exportacion SVG es un acto **puramente de lectura**: no muta el modelo, no persiste estado, y suprime por completo el cromo de la aplicacion (toolbars, paneles, navegador de OPDs). El SVG resultante preserva la gramatica visual OPM — cromatismo por-clase [V-1], drop-shadow semantica [V-124], piruletas, puntas de flecha — pero omite OPL y metadatos del modelo por default (excepto donde se habilita via HU-61.020 y HU-61.021).

La SSOT canon-diagrama [V-0a] establece que el SVG exportado es la **imagen del diagrama** sin cromo de edicion. La invariante es: lo que se ve en canvas como gramatica OPM, se ve identico en SVG. Lo que es UI de edicion (handles, seleccion, toolbar, paneles) se suprime.

Las HU cubren: activacion desde menu, formato del modal, controles (file name, tooltips, resolucion condicional, selector de formato), tres alcances, manejo de descargas del navegador, fidelidad visual entre canvas y SVG, preservacion de estilos, metadatos embebidos, accesibilidad, compatibilidad con editores externos (Inkscape, Illustrator), tests de fidelidad y el export GIF latente en el submenu `Exports`.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-61.001 | Acceder a Export Model Diagrams desde submenu Exports | RV | C | XS | opcloud-ui | — |
| HU-61.002 | Listar las tres salidas del submenu Exports | RV | C | XS | opcloud-ui | — |
| HU-61.003 | Abrir modal Export Model Diagrams con defaults seguros | RV | C | S | opcloud-ui | — |
| HU-61.004 | Editar File name propuesto antes de exportar | RV | C | S | opcloud-ui | — |
| HU-61.005 | Derivar File name del nombre del OPD activo | RV | C | XS | opcloud-ui | — |
| HU-61.006 | Alternar formato entre JPEG y SVG con selector segmentado | RV | C | S | opcloud-ui | — |
| HU-61.007 | Ocultar campo OPDs Image Resolution cuando el formato es SVG | RV | C | XS | opcloud-ui | — |
| HU-61.008 | Exportar OPD actual como un solo archivo SVG | RV | C | M | opm-semantica | [V-0a] canon-diagrama |
| HU-61.009 | Exportar arbol completo de OPDs como paquete SVG | RV | C | L | opcloud-ui | — |
| HU-61.010 | Exportar unicamente el System Diagram como SVG | RV | C | S | opm-semantica | [V-0a] canon-diagrama |
| HU-61.011 | Cancelar modal con ESC o clic fuera sin exportar | RV | C | XS | opcloud-ui | — |
| HU-61.012 | Incluir Computational Processes Tooltips como decoracion SVG | RV | W | M | opm-semantica | [V-0a] [Glos 3.58] |
| HU-61.013 | Generar SVG con viewBox ajustado al bounding box del OPD | RV | C | M | mixto | [V-0a] |
| HU-61.014 | Preservar cromatismo por-clase y drop-shadow semantica en el SVG | RV | C | M | opm-semantica | [V-1] [V-124] [JOYAS §1] |
| HU-61.015 | Suprimir cromo de la aplicacion en el SVG exportado | RV | C | S | opm-semantica | [V-0a] [V-124] |
| HU-61.016 | Preservar estilos autorales custom definidos por el modelador | AD | C | M | opm-semantica | [V-1] [V-63] |
| HU-61.017 | Optimizar SVG eliminando nodos innecesarios y agrupando estilos | ME | C | M | mixto | — |
| HU-61.018 | Embeber fuentes vs referenciar por CSS en el SVG | ME | C | M | mixto | — |
| HU-61.019 | Aplicar background color opcional al SVG exportado | RV | C | S | opcloud-ui | — |
| HU-61.020 | Embeber metadata OPM como atributos XML en el SVG | ME | C | M | opm-semantica | [V-0a] [Glos 3.39] [Glos 3.58] |
| HU-61.021 | Incluir OPL como comentario XML en el SVG | RV | C | S | opm-semantica | [OPL-ES D1..D4] |
| HU-61.022 | Agregar title y desc accesibles para lectores de pantalla | RV | C | S | mixto | — |
| HU-61.023 | Garantizar compatibilidad con Inkscape e Illustrator | ME | C | M | mixto | — |
| HU-61.024 | Mostrar feedback post-descarga y permitir reabrir el modal | RV | C | XS | opcloud-ui | — |
| HU-61.025 | Tests de fidelidad visual entre canvas y SVG exportado | ME | C | L | mixto | — |
| HU-61.026 | Exportar OPD como GIF animado desde submenu Exports | RV | W | XL | opcloud-ui | — |

Total: **26 historias de usuario** (9 opm-semantica, 11 opcloud-ui, 6 mixto).

## Historias de usuario

### HU-61.001 — Acceder a Export Model Diagrams desde submenu Exports

**Actor primario:** RV (revisor).
**Actores secundarios:** MN, ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X (exporta fuera del modelador).
**Superficie UI:** main-menu-hamburguesa + submenu-exports.
**Gesto canonico:** clic en `Main menu ▸ Exports ▸ Export Model Diagrams`.

**Historia:**
> Como revisor de modelos, quiero abrir el dialogo de exportacion de diagramas desde el menu principal para iniciar el flujo de exportar SVG sin memorizar atajos.

**Contexto de negocio:**
El submenu `Exports` concentra las tres salidas externas del modelo (OPL, Diagrams, PDF). Ofrecer un unico punto de entrada reduce ambiguedad y ancla el exportar como operacion de lectura del modelo, no como edicion.

**Criterios de aceptacion:**
- **Dado** que tengo un modelo abierto, **cuando** abro el main menu hamburguesa, **entonces** veo la entrada `Exports ▸` con chevron indicando submenu.
- **Dado** que paso el cursor sobre `Exports ▸`, **cuando** se expande, **entonces** veo `Export Model Diagrams` listado entre `Export OPL` y `Export Model to PDF`.
- **Dado** que hago clic en `Export Model Diagrams`, **cuando** se ejecuta, **entonces** se abre el modal `Export Model Diagrams` sobre el canvas oscurecido.
- **Dado** que el modelo esta vacio (sin OPDs), **cuando** intento abrir el modal, **entonces** se permite el acceso pero los botones de alcance advierten de ausencia de contenido exportable.

**Reglas y restricciones:**
- El submenu `Exports ▸` vive en el penultimo bloque del main menu (convencion observada §7.1 fuente).
- El modal ocupa overlay centrado; el canvas queda oscurecido como telon de fondo.

**Modelo de datos tocado:**
- Ninguno persistente. Solo estado transitorio del dialogo.

**Dependencias:**
- Bloquea a: HU-61.003, HU-61.006, HU-61.008, HU-61.009, HU-61.010.

**Integraciones:**
- Main menu (compartido con `Export OPL` y `Export Model to PDF`).

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/61-export-svg.md` §2, §7.1.
- Frames: frame_00005.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [export-svg, ui, menu, hamburger-menu].

---

### HU-61.002 — Listar las tres salidas del submenu Exports

**Actor primario:** RV (revisor).
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** submenu-exports.
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como revisor, quiero ver las tres salidas (`Export OPL`, `Export Model Diagrams`, `Export Model to PDF`) juntas en el submenu para elegir el formato adecuado al destino.

**Contexto de negocio:**
Agrupar los tres exports refuerza la triple naturaleza de salida del modelo: textual (OPL), visual (SVG/JPEG por OPD) y documental (PDF). Un usuario que busca "sacar algo del modelo" encuentra las tres opciones sin navegar.

**Criterios de aceptacion:**
- **Dado** que abro el submenu `Exports ▸`, **cuando** se despliega, **entonces** veo exactamente tres entradas: `Export OPL`, `Export Model Diagrams`, `Export Model to PDF`.
- **Dado** que el submenu esta abierto, **cuando** reviso el orden, **entonces** sigue el orden observado (OPL, Diagrams, PDF).
- **Dado** que hay un GIF planeado (HU-61.026), **cuando** se active, **entonces** aparece una cuarta entrada `Export Model to GIF` sin romper el orden existente.

**Reglas y restricciones:**
- Las tres entradas deben ser visibles aun cuando no hay contenido (el vacio se maneja dentro del modal).

**Dependencias:**
- Bloqueada por: HU-61.001.
- Relaciona: EPICA-50 (Export OPL), EPICA-60 (Export Model to PDF).

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla, §7.1.
- Frames: frame_00005.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [export-svg, ui, menu, submenu].

---

### HU-61.003 — Abrir modal Export Model Diagrams con defaults seguros

**Actor primario:** RV (revisor).
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-export-model-diagrams.
**Gesto canonico:** ninguno (efecto del clic previo).

**Historia:**
> Como revisor, quiero que el modal de exportacion aparezca con defaults razonables para poder exportar sin tocar nada salvo el boton de alcance.

**Contexto de negocio:**
Minimizar la friccion del exportar es el objetivo principal del modal. Los defaults deben reflejar el uso mas comun: `File name = <OPD activo>`, tooltips desmarcados, formato inicial preservado y resolucion 3 en JPEG.

**Criterios de aceptacion:**
- **Dado** que abro `Export Model Diagrams`, **cuando** el modal se renderiza, **entonces** veo el titulo `Export Model Diagrams` y la nota `Note: Downloading might take few minutes`.
- **Dado** que el modal se abre, **cuando** reviso los defaults, **entonces** `File name = System Diagram (SD)` (o el nombre del OPD activo), `Include Computational Processes Tooltips` **desmarcado**, formato inicial `JPEG`, `OPDs Image Resolution = 3`.
- **Dado** que el modal esta abierto, **cuando** miro los botones de alcance, **entonces** veo `Current OPD`, `OPD Tree`, `SD` en fila inferior sin preseleccion.
- **Dado** que reabro el modal en la misma sesion, **cuando** lo inspecciono, **entonces** pregunta abierta (§11.8 fuente): ¿recuerda el ultimo formato elegido o vuelve a default?

**Reglas y restricciones:**
- El modal no tiene boton `Cancel` explicito observado (§9 fuente).
- El canvas queda oscurecido como overlay durante todo el ciclo.
- Al cerrarse, la seleccion y layout del canvas se preservan intactos.

**Modelo de datos tocado:**
- Transitorio: `exportDialog.state = { fileName, format, resolution, includeTooltips, scope }`.

**Dependencias:**
- Bloqueada por: HU-61.001.
- Bloquea a: HU-61.004 – HU-61.011.

**Integraciones:**
- Canvas queda como telon oscurecido.

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla, §5.1, §11.8.
- Frames: frame_00006.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-svg, ui, modal, defaults].

---

### HU-61.004 — Editar File name propuesto antes de exportar

**Actor primario:** RV (revisor).
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-export-model-diagrams (campo File name).
**Gesto canonico:** escritura en input de texto.

**Historia:**
> Como revisor, quiero editar el nombre del archivo antes de exportar para ajustarlo a la convencion de archivos de mi proyecto.

**Contexto de negocio:**
El nombre propuesto deriva del OPD activo, pero en contextos editoriales (papers, reportes, repositorios) el nombre canonico del archivo sigue convenciones externas. Permitir edicion evita renombres post-descarga.

**Criterios de aceptacion:**
- **Dado** que el modal esta abierto, **cuando** hago clic en el campo `File name`, **entonces** entro en modo edicion con el default preseleccionado.
- **Dado** que sobrescribo el nombre con `mi-diagrama-v3`, **cuando** presiono un boton de alcance, **entonces** el archivo descargado se llama `mi-diagrama-v3.svg`.
- **Dado** que dejo el campo vacio, **cuando** intento exportar, **entonces** se revierte al default del OPD (no se permite nombre vacio).
- **Dado** que el alcance es `OPD Tree`, **cuando** hay multiples archivos, **entonces** pregunta abierta (§11.4 fuente): ¿el `File name` se usa como prefijo, se ignora o se auto-genera por OPD? Implementacion: usar como prefijo seguido de `-<OPD>.svg`.

**Reglas y restricciones:**
- Caracteres prohibidos en file name: `/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|` (por compatibilidad con filesystems comunes).
- Extension `.svg` la agrega el sistema; si el usuario la escribe, no se duplica.

**Modelo de datos tocado:**
- Transitorio: `exportDialog.fileName: string`.

**Dependencias:**
- Bloqueada por: HU-61.003, HU-61.005.

**Integraciones:**
- Descargador del navegador recibe el nombre final.

**Notas de evidencia:**
- Fuente OPCloud: §4.5, §11.4.
- Clase de afirmacion: hipotesis (editable) + observado (campo existe, cursor nunca entra en frames).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-svg, ui, modal, file-name, requires-clarification].

---

### HU-61.005 — Derivar File name del nombre del OPD activo

**Actor primario:** RV (revisor).
**Tipo:** opcloud-ui.
**Nivel categorico:** L.
**Superficie UI:** modal-export-model-diagrams (campo File name prellenado).
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero que el nombre del archivo se proponga automaticamente desde el OPD activo para no escribirlo a mano cada vez.

**Contexto de negocio:**
Derivar el nombre del OPD reduce friccion y mantiene consistencia entre el contenido del archivo y su titulo. El patron observado incluye el codigo del OPD entre parentesis (`System Diagram (SD)`).

**Criterios de aceptacion:**
- **Dado** que el OPD activo es `System Diagram` con codigo `SD`, **cuando** abro el modal, **entonces** `File name = System Diagram (SD)`.
- **Dado** que el OPD activo es un hijo in-zoomed llamado `Treating Patient` con codigo `SD1`, **cuando** abro el modal, **entonces** `File name = Treating Patient (SD1)`.
- **Dado** que el OPD tiene caracteres no-ASCII en el nombre, **cuando** se deriva el file name, **entonces** se preservan (unicode valido en filesystems modernos) o se sanean segun politica — pregunta abierta.

**Reglas y restricciones:**
- El nombre deriva del **OPD**, no del modelo (convencion observada — el tab muestra `<<OPM Example Model>>` pero el file name es `System Diagram (SD)`).
- Formato: `<nombre-opd> (<codigo-opd>)`.

**Modelo de datos tocado:**
- Solo lectura de `opd.name` y `opd.code`.

**Dependencias:**
- Bloqueada por: HU-61.003.
- Bloquea a: HU-61.004.

**Integraciones:**
- Arbol OPD (EPICA-20) provee nombre y codigo.

**Notas de evidencia:**
- Fuente OPCloud: §4.5, §6.3, §9.
- Frames: frame_00006.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [export-svg, ui, file-name, opd-naming].

---

### HU-61.006 — Alternar formato entre JPEG y SVG con selector segmentado

**Actor primario:** RV (revisor).
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-export-model-diagrams (selector Exported Images Format).
**Gesto canonico:** clic en pastilla `JPEG` o `SVG`.

**Historia:**
> Como revisor, quiero alternar entre JPEG y SVG con un selector segmentado para elegir el formato adecuado al destino (web, paper, impresion).

**Contexto de negocio:**
JPEG sirve para destinos rasterizados con tamano conocido; SVG para destinos que requieren escalabilidad sin perdida (papers, web responsive, impresion de gran formato). El selector segmentado comunica que son alternativas mutuamente excluyentes.

**Criterios de aceptacion:**
- **Dado** que el modal esta abierto con `JPEG` activo, **cuando** hago clic en la pastilla `SVG`, **entonces** `SVG` queda resaltada y `JPEG` desactivada.
- **Dado** que `SVG` esta activo, **cuando** hago clic en `JPEG`, **entonces** alterna de vuelta sin perder otros campos del modal.
- **Dado** que cambio de formato, **cuando** ocurre la alternancia, **entonces** el campo `OPDs Image Resolution` aparece/desaparece segun corresponda (ver HU-61.007).
- **Dado** que alterno formato, **cuando** observo los botones de alcance, **entonces** mantienen su estado y disponibilidad.

**Reglas y restricciones:**
- Solo dos valores: `JPEG` y `SVG`. No hay un tercer formato (PNG, PDF por diagrama, etc.).
- Visual: pastilla activa con fondo gris mas claro; la inactiva oscura.
- Label del selector: `Exported Images Format` (plural, convencion heredada §9 fuente).

**Modelo de datos tocado:**
- Transitorio: `exportDialog.format: "JPEG" | "SVG"`.

**Dependencias:**
- Bloqueada por: HU-61.003.
- Bloquea a: HU-61.007.

**Integraciones:**
- Ninguna externa; solo estado del modal.

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla, §5.1.
- Frames: frame_00006 (JPEG), frames 07–11 (SVG).
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-svg, ui, modal, format-selector, toggle].

---

### HU-61.007 — Ocultar campo OPDs Image Resolution cuando el formato es SVG

**Actor primario:** RV (revisor).
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-export-model-diagrams (campo condicional).
**Gesto canonico:** reactivo al selector de formato.

**Historia:**
> Como revisor, quiero que el campo de resolucion desaparezca al elegir SVG para que la UI no pida datos irrelevantes al formato vectorial.

**Contexto de negocio:**
SVG es vectorial: no tiene pixeles objetivo. Mostrar un campo de resolucion seria enganoso —confirmaria la percepcion de que SVG es "una imagen de alta calidad" en vez de "un formato conceptualmente distinto del raster".

**Criterios de aceptacion:**
- **Dado** que el modal esta con `JPEG` activo, **cuando** miro el layout, **entonces** veo el campo `OPDs Image Resolution` con valor `3` y asterisco `*` obligatorio.
- **Dado** que cambio a `SVG`, **cuando** se actualiza el modal, **entonces** el campo `OPDs Image Resolution` desaparece y el modal compacta su altura.
- **Dado** que vuelvo a `JPEG`, **cuando** se actualiza, **entonces** el campo reaparece con el ultimo valor valido (por default `3`).
- **Dado** que el campo esta visible, **cuando** ingreso un valor no numerico, **entonces** muestra error o revierte al valor anterior.

**Reglas y restricciones:**
- Campo condicional: aparece solo si `format === "JPEG"`.
- Valor por default: `3` (entero).
- Asterisco `*` marca campo obligatorio (unica marca de este tipo observada).

**Modelo de datos tocado:**
- Transitorio: `exportDialog.resolution: number` (solo activo en JPEG).

**Dependencias:**
- Bloqueada por: HU-61.006.

**Integraciones:**
- Ninguna; afecta solo layout del modal.

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla, §5.1, §5.2, §9.
- Frames: frame_00006 (visible), frames 07–11 (ausente).
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [export-svg, ui, modal, conditional-field, resolution].

---

### HU-61.008 — Exportar OPD actual como un solo archivo SVG

**Actor primario:** RV (revisor).
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** X primario (salida del modelador); V (render SVG).
**Superficie UI:** modal-export-model-diagrams (boton Current OPD) + barra descarga navegador.
**Gesto canonico:** clic en boton `Current OPD` con formato `SVG` activo.

**Historia:**
> Como revisor, quiero exportar solo el OPD que estoy viendo como un archivo SVG unico para incrustarlo en un documento sin arrastrar todo el modelo.

**Contexto de negocio:**
`Current OPD` es el alcance mas usado para publicacion puntual: un figure individual en un paper, un snippet en un blog, un componente en un deck. Debe producir un archivo unico, nombrado y descargable sin ceremonia. La SSOT canon-diagrama [V-0a] establece que el SVG es la imagen del diagrama: preserva la gramatica OPM sin cromo.

**Criterios de aceptacion:**
- **Dado** que el formato es `SVG` y estoy viendo un OPD in-zoomed `Treating Patient (SD1)`, **cuando** hago clic en `Current OPD`, **entonces** se descarga `Treating Patient (SD1).svg` con el grafo de ese OPD unicamente.
- **Dado** que el OPD esta vacio (sin things ni links), **cuando** hago clic en `Current OPD`, **entonces** se produce un SVG valido con solo el fondo (no crash).
- **Dado** que el OPD tiene 200 elementos, **cuando** hago clic en `Current OPD`, **entonces** la nota `Downloading might take few minutes` es pertinente y el archivo se genera sin exceder el limite razonable (≤10MB para 200 elementos).
- **Dado** que se descargo el archivo, **cuando** lo abro en el navegador, **entonces** se renderiza el grafo completo del OPD sin cromo de la aplicacion.

**Reglas y restricciones:**
- El OPD "actual" es el que esta visible en el canvas al momento del clic.
- Un solo archivo, sin empaquetado.
- El archivo se produce aunque el OPD sea el SD — en ese caso es equivalente a `SD` salvo por el file name derivado (en `Current OPD` viene del OPD visible, en `SD` del root).

**Modelo de datos tocado:**
- Solo lectura: `opd.things`, `opd.links`, `thing.*`, `link.*`.

**Dependencias:**
- Bloqueada por: HU-61.003, HU-61.006, HU-61.013, HU-61.014, HU-61.015.

**Integraciones:**
- Renderer JointJS (genera SVG del canvas).
- Navegador (API de descarga).
- OPL renderer: NO participa (SVG no incluye OPL salvo HU-61.021).

**Notas de evidencia:**
- Fuente normativa: [V-0a] canon-diagrama — el SVG exportado es la imagen del OPD sin cromo.
- Fuente OPCloud: §3.2, §5.2, §7.2 tabla.
- Clase de afirmacion: inferido (boton observado, no pulsado) + hipotesis de nombre.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-svg, render, current-opd, download].

---

### HU-61.009 — Exportar arbol completo de OPDs como paquete SVG

**Actor primario:** RV (revisor).
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; V secundaria.
**Superficie UI:** modal-export-model-diagrams (boton OPD Tree).
**Gesto canonico:** clic en boton `OPD Tree` con formato `SVG` activo.

**Historia:**
> Como revisor, quiero exportar todos los OPDs del modelo en un solo paquete zip de SVGs para llevar la documentacion visual completa a una carpeta.

**Contexto de negocio:**
Un modelo OPM tipico tiene decenas de OPDs (SD + inzooms + unfolds). Exportarlos uno a uno es tedioso. Un paquete zip con naming derivado de cada OPD es la afordance correcta para alcance masivo.

**Criterios de aceptacion:**
- **Dado** que el modelo tiene 5 OPDs (`SD`, `SD1`, `SD2`, `SD1.1`, `SD2.1`) y el formato es `SVG`, **cuando** hago clic en `OPD Tree`, **entonces** se descarga un archivo `.zip` con 5 archivos `.svg`, uno por OPD.
- **Dado** que el paquete es `.zip`, **cuando** lo extraigo, **entonces** cada archivo tiene el nombre `<OPD name> (<code>).svg`.
- **Dado** que el modelo tiene un solo OPD (solo SD), **cuando** hago clic en `OPD Tree`, **entonces** el resultado es equivalente a `SD` (§4.2 fuente), posiblemente sin zip.
- **Dado** que el usuario edito `File name = mi-modelo`, **cuando** exporta `OPD Tree`, **entonces** el zip se llama `mi-modelo.zip` y los archivos internos mantienen el naming por OPD (o usan prefijo — ver HU-61.004).
- **Dado** que la generacion del zip toma tiempo, **cuando** el usuario espera, **entonces** la nota `Downloading might take few minutes` es visible hasta que el zip esta listo.

**Reglas y restricciones:**
- Formato del empaquetado: `.zip` (hipotesis del doc fuente §3.2 no resuelta; aqui se adopta).
- Alternativa **descartada**: multiples descargas separadas (rompe el flujo del usuario).
- Alternativa **descartada**: `.svg` combinado multi-pagina (SVG no tiene concepto nativo de paginas).

**Modelo de datos tocado:**
- Solo lectura del arbol completo de OPDs.

**Dependencias:**
- Bloqueada por: HU-61.003, HU-61.006, HU-61.008.
- Bloquea a: nada.

**Integraciones:**
- Renderer JointJS por cada OPD.
- Libreria de zip (eleccion tecnica abierta: JSZip u otra).

**Notas de evidencia:**
- Fuente OPCloud: §3.2, §4.2, §5.2.
- Clase de afirmacion: inferido (hipotesis explicita en fuente).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** L.
**Etiquetas:** [export-svg, render, opd-tree, batch, zip, requires-clarification].

---

### HU-61.010 — Exportar unicamente el System Diagram como SVG

**Actor primario:** RV (revisor).
**Tipo:** opm-semantica.
**Nivel categorico:** X primario; V secundaria.
**Superficie UI:** modal-export-model-diagrams (boton SD).
**Gesto canonico:** clic en boton `SD` con formato `SVG` activo.

**Historia:**
> Como revisor, quiero exportar especificamente el System Diagram raiz como SVG para publicar la vista de alto nivel del sistema sin exponer detalle de inzooms.

**Contexto de negocio:**
El SD (System Diagram) es el OPD-raiz canonico: representa el alcance del sistema en un golpe de vista [V-0a]. En publicaciones, reportes ejecutivos y presentaciones de overview, es el artefacto mas usado. `SD` como boton explicito evita navegar al SD antes de exportar `Current OPD`.

**Criterios de aceptacion:**
- **Dado** que el formato es `SVG` y estoy viendo un OPD in-zoomed, **cuando** hago clic en `SD`, **entonces** se descarga `System Diagram (SD).svg` con el SD raiz, no con el OPD visible.
- **Dado** que ya estoy viendo el SD, **cuando** hago clic en `SD`, **entonces** el resultado es identico a `Current OPD` salvo por el file name (que usa siempre el SD).
- **Dado** que el modelo no tiene SD explicito (edge-case OPM), **cuando** hago clic en `SD`, **entonces** se muestra error o se resuelve al primer OPD del arbol.

**Reglas y restricciones:**
- El SD se identifica por posicion root del arbol OPD, no por nombre.
- Flow canonico del video (§3.1 fuente) — unico boton pulsado.

**Modelo de datos tocado:**
- Solo lectura del SD.

**Dependencias:**
- Bloqueada por: HU-61.003, HU-61.006.

**Integraciones:**
- Arbol OPD (EPICA-20).
- Renderer JointJS.

**Notas de evidencia:**
- Fuente normativa: [V-0a] canon-diagrama — el SD es el OPD raiz canonico.
- Fuente OPCloud: §2 tabla, §3.1, §5.2.
- Frames: frame_00010 (clic sobre SD), frame_00012 (descarga).
- Clase de afirmacion: observado + confirmado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-svg, render, sd, download].

---

### HU-61.011 — Cancelar modal con ESC o clic fuera sin exportar

**Actor primario:** RV (revisor).
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-export-model-diagrams.
**Gesto canonico:** tecla `ESC` o clic fuera del modal.

**Historia:**
> Como revisor, quiero cancelar el dialogo de exportacion con ESC o clic fuera para cambiar de idea sin disparar una descarga.

**Contexto de negocio:**
El modal no tiene boton `Cancel` explicito (§9 fuente). Ofrecer ESC y clic-fuera sigue la convencion de los otros modales del producto (Save, Load) y evita descargas accidentales.

**Criterios de aceptacion:**
- **Dado** que el modal esta abierto, **cuando** presiono `ESC`, **entonces** el modal se cierra sin disparar export y el canvas se restaura.
- **Dado** que el modal esta abierto, **cuando** hago clic fuera del area del modal, **entonces** el modal se cierra sin export.
- **Dado** que cancele el modal, **cuando** reabro `Export Model Diagrams`, **entonces** se muestra con los defaults (o el ultimo estado si HU-61.024 aplica).

**Reglas y restricciones:**
- La cancelacion no produce archivo ni toast ni feedback.
- Clic **dentro** del modal en zona neutral (no input, no boton) NO cierra.

**Dependencias:**
- Bloqueada por: HU-61.003.

**Integraciones:**
- Convencion heredada de `Save Model` (EPICA-30 §4.5).

**Notas de evidencia:**
- Fuente OPCloud: §4.1, §11.3.
- Clase de afirmacion: hipotesis (consistencia con Save/Load).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [export-svg, ui, modal, cancel, requires-clarification].

---

### HU-61.012 — Incluir Computational Processes Tooltips como decoracion SVG

**Actor primario:** RV (revisor).
**Actores secundarios:** IS (ingeniero de simulacion).
**Tipo:** opm-semantica.
**Nivel categorico:** V primario; D (depende de modelo computacional).
**Superficie UI:** modal-export-model-diagrams (checkbox Include Computational Processes Tooltips).
**Gesto canonico:** marcar checkbox antes de pulsar boton de alcance.

**Historia:**
> Como revisor, quiero marcar `Include Computational Processes Tooltips` para que el SVG exportado incluya las decoraciones semanticas de procesos computacionales.

**Contexto de negocio:**
Los procesos computacionales [Glos 3.58] (EPICA-B1) tienen una capa visual opcional (tooltip, marcador permanente, anotacion) que ayuda al lector a identificar que parte del modelo es ejecutable. Permitir incluirlos o no en el export es util para segmentar audiencia: version semantica vs version visual pura.

**Criterios de aceptacion:**
- **Dado** que el modal esta abierto, **cuando** marco `Include Computational Processes Tooltips`, **entonces** el checkbox queda marcado.
- **Dado** que la casilla esta marcada y exporto, **cuando** abro el SVG resultante, **entonces** los procesos computacionales muestran la decoracion anadida (marcador visible, distintiva de procesos conceptuales).
- **Dado** que la casilla esta desmarcada, **cuando** exporto, **entonces** el SVG es identico al canvas sin la decoracion extra.
- **Dado** que el modelo no tiene procesos computacionales, **cuando** marco la casilla, **entonces** el export no falla pero no anade nada.

**Reglas y restricciones:**
- Default: **desmarcado** (confirmado por observacion en todos los frames).
- El efecto visual exacto **no esta observado** en ningun frame (§11.1 fuente).
- SSOT gap 33.2 registra esta decoracion como potencial "9ª representacion de cosa" si la decoracion es persistente.

**Modelo de datos tocado:**
- Transitorio: `exportDialog.includeTooltips: boolean`.
- Solo lectura: `process.isComputational` (depende de EPICA-B1).

**Dependencias:**
- Bloqueada por: HU-61.003.
- Relaciona: EPICA-B1 (simulation computational).

**Integraciones:**
- Renderer de procesos computacionales (EPICA-B1).

**Notas de evidencia:**
- Fuente normativa: [V-0a] canon-diagrama; [Glos 3.58] Proceso.
- Fuente OPCloud: §2 tabla, §3.4, §11.1.
- Frames: frame_00006 (desmarcado), frame_00009 (cursor sobre casilla, sin marcar).
- Clase de afirmacion: observado (control) + abierto (efecto visual).
- Etiqueta: `requires-clarification`.

**Prioridad:** W (diferida — depende de EPICA-B1 que no esta en scope MVP-α).
**Tamano:** M.
**Etiquetas:** [export-svg, ui, modal, tooltips, computational, requires-clarification].

---

### HU-61.013 — Generar SVG con viewBox ajustado al bounding box del OPD

**Actor primario:** RV (revisor).
**Tipo:** mixto.
**Nivel categorico:** V.
**Superficie UI:** n/a (archivo SVG generado).
**Gesto canonico:** ninguno (efecto del export).

**Historia:**
> Como revisor, quiero que el SVG generado tenga viewBox y dimensiones ajustadas al bounding box del OPD para que el archivo se visualice bien a cualquier tamano sin margenes excesivos ni recorte.

**Contexto de negocio:**
El viewBox SVG define el espacio de coordenadas visible. Si se copia directo el viewport del canvas sin ajustar, el SVG tendra margenes vacios de scroll o content recortado. Ajustar al bounding box produce un archivo canonicamente dimensionado [V-0a].

**Criterios de aceptacion:**
- **Dado** que el OPD tiene elementos en coordenadas `[(x₁,y₁), (x₂,y₂)]`, **cuando** se exporta, **entonces** el `<svg>` raiz tiene `viewBox="x_min-pad y_min-pad width+2·pad height+2·pad"`.
- **Dado** que el OPD esta vacio, **cuando** se exporta, **entonces** el SVG tiene viewBox `"0 0 800 600"` o similar sensato (no NaN).
- **Dado** que se exporta SVG, **cuando** se inspecciona el markup, **entonces** el `<svg>` tiene `width="..."` y `height="..."` explicitos o bien relativos (`100%`) para comportamiento responsive.
- **Dado** que el SVG se abre en el navegador a zoom 800%, **cuando** se renderiza, **entonces** los bordes son nitidos sin artefactos raster (observado frame_00013).

**Reglas y restricciones:**
- Padding default: 20px a cada lado del bounding box.
- `preserveAspectRatio="xMidYMid meet"` como default.

**Modelo de datos tocado:**
- Solo lectura: `thing.position`, `thing.size`, `link.path`.

**Dependencias:**
- Bloqueada por: HU-61.008.
- Bloquea a: HU-61.014, HU-61.015.

**Integraciones:**
- Layout algoritmico (`src/render/layout/`) provee posiciones finales.

**Notas de evidencia:**
- Fuente normativa: [V-0a] canon-diagrama — bounding box ajusta el espacio de coordenadas canonicas.
- Fuente OPCloud: §5.2, §6.2.
- Frames: frame_00013 (zoom 800% sin pixelado), frame_00014 (tamano natural).
- Clase de afirmacion: confirmado por observacion visual (bordes nitidos).

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-svg, render, viewbox, bounding-box, vector].

---

### HU-61.014 — Preservar cromatismo por-clase y drop-shadow semantica en el SVG

**Actor primario:** RV (revisor).
**Tipo:** opm-semantica.
**Nivel categorico:** V.
**Superficie UI:** n/a (archivo SVG generado).
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero que el SVG conserve el cromatismo por-clase (verde cosa, oliva estado, azul refinable) y la drop-shadow sobre cosas fisicas para que el archivo preserve la semantica OPM grafica.

**Contexto de negocio:**
La SSOT visual [V-1] define el cromatismo y la sombra semantica [V-124] como parte de la gramatica, no como UI. El SVG es la **prueba canonica** de que es gramatica: lo que se preserva es semantica; lo que se suprime es UI. Las ocho representaciones de cosa surgen del producto cartesiano Forma × Contorno × Profundidad [V-1].

**Criterios de aceptacion:**
- **Dado** que el canvas muestra un rectangulo de objeto con borde verde claro `#70E483`, **cuando** se exporta a SVG, **entonces** el `<rect>` tiene el atributo `stroke` con el mismo hex verde del canvas [JOYAS §1].
- **Dado** que un objeto es `essence=physical`, **cuando** se exporta, **entonces** el `<g>` del objeto incluye un `<filter>` de drop-shadow equivalente al del canvas [V-124].
- **Dado** que un objeto es `essence=informatical`, **cuando** se exporta, **entonces** NO tiene drop-shadow (discriminacion semantica [V-124]).
- **Dado** que una elipse es `refinable`, **cuando** se exporta, **entonces** tiene contorno bold azul claro `#3BC3FF` preservado [JOYAS §1].
- **Dado** que un estado tiene borde oliva, **cuando** se exporta, **entonces** el estado preserva color y grosor.
- **Dado** que hay piruletas blancas (instrument) y negras (agent) sobre borde de elipse, **cuando** se exporta, **entonces** las piruletas persisten con sus `<circle>` correspondientes (observado frame_00014).
- **Dado** que hay triangulos de aggregation rellenos azul oscuro `#586D8C`, **cuando** se exporta, **entonces** los `<polygon>` persisten [JOYAS §1].

**Reglas y restricciones:**
- La SSOT visual es la fuente de verdad — cualquier divergencia es bug del renderer.
- La invariante es: **lo que se ve en canvas como gramatica, se ve identico en SVG**.
- Excepciones legitimas: cromo UI (handles de seleccion, cursor), ver HU-61.015.
- Tres origenes de sombra posibles: declaracion del modelador, estereotipo, preset de sesion. En export, los tres colapsan al mismo resultado: sombra si y solo si es fisica [V-126].

**Modelo de datos tocado:**
- Solo lectura de atributos visuales derivados de kernel + SSOT.

**Dependencias:**
- Bloqueada por: HU-61.008, HU-61.013.
- Bloquea a: HU-61.025 (tests de fidelidad).

**Integraciones:**
- `src/render/jointjs/` (factories de shape).
- `ssot/opm-visual-es.md` §1.1b, §1.3, §1.5.

**Notas de evidencia:**
- Fuente normativa: [V-1] ocho representaciones de cosa; [V-124] sombreado canonico; [V-126] colapso de origenes de sombra.
- Fuente OPCloud: §5.3 tabla detallada.
- Evidencia visual: JOYAS §1 colores `#70E483`, `#3BC3FF`, `#586D8C`.
- Frames: frame_00014 (SVG exportado con cromatismo preservado).
- Clase de afirmacion: observado + confirmado.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-svg, render, ssot-visual, fidelity, cromatismo, drop-shadow].

---

### HU-61.015 — Suprimir cromo de la aplicacion en el SVG exportado

**Actor primario:** RV (revisor).
**Tipo:** opm-semantica.
**Nivel categorico:** V.
**Superficie UI:** n/a (archivo SVG generado).
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero que el SVG no incluya toolbars, paneles, handles de seleccion ni otros elementos de UI para que el archivo sea canonicamente el diagrama, no el screenshot.

**Contexto de negocio:**
El canvas muestra cromo util en edicion (toolbar, panel OPL, halo, handles, cursor pan) que no pertenece al diagrama. La SSOT [V-0a] establece que el SVG exportado es la imagen del canon-diagrama sin cromo de edicion. Incluirlos contaminaria publicaciones y romperia la invariante "SVG = gramatica pura".

**Criterios de aceptacion:**
- **Dado** que hay una cosa seleccionada en canvas con handles de seleccion visibles, **cuando** se exporta el SVG, **entonces** los handles NO aparecen en el archivo.
- **Dado** que el canvas muestra la main toolbar azul, panel OPL, OPD Navigator, tabs, **cuando** se exporta, **entonces** ninguno persiste en el SVG.
- **Dado** que el cursor es pan-hand sobre el canvas, **cuando** se exporta, **entonces** el cursor no se plasma en SVG.
- **Dado** que hay una underline-bar gris bajo una cosa fisica (canvas-only, §5.3 fuente), **cuando** se exporta, **entonces** la barra NO persiste.
- **Dado** que hay halo radial visible, **cuando** se exporta, **entonces** el halo NO persiste.

**Reglas y restricciones:**
- Regla: cualquier elemento que no sea Thing, Link, State, o decoracion semantica OPM, se suprime.
- La distincion gramatica/UI se arbitra por la SSOT [V-0a] y [V-124]; en caso de ambiguedad se prefiere suprimir.
- La implementacion DEBE suprimir en export toda sombra decorativa de UI, preservando solo la sombra semantica de esencia fisica [V-124] [V-127].

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-61.008, HU-61.014.

**Integraciones:**
- `src/render/jointjs/` debe exponer un modo "export" que desactive cromo.

**Notas de evidencia:**
- Fuente normativa: [V-0a] canon-diagrama; [V-124] sombra semantica vs decorativa; [V-127] reforzadores de canvas.
- Fuente OPCloud: §5.3 tabla ("Barra de herramientas, panel de OPL, main toolbar azul, OPD Navigator: **no**").
- Frames: frame_00014 (SVG sin cromo).
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-svg, render, chrome-cleanup, ui-vs-gramatica].

---

### HU-61.016 — Preservar estilos autorales custom definidos por el modelador

**Actor primario:** AD (autor de dominio).
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** V primario; D (profile de dominio).
**Superficie UI:** n/a (archivo SVG generado).
**Gesto canonico:** ninguno.

**Historia:**
> Como autor de dominio, quiero que el SVG respete los estilos custom que defini (via styling autorial o stereotypes) para que la publicacion conserve la identidad visual del profile.

**Contexto de negocio:**
OPM permite customizar estilos por profile (EPICA-14 styling, EPICA-A0 stereotypes). La SSOT [V-1] define las ocho representaciones canonicas de cosa pero [V-63] establece que los colores son informativos, no normativos. Un profile de dominio (ej. salud, ingenieria, kora) define colores y afordances propias. Ignorarlos en el export romperia la promesa de dominios.

**Criterios de aceptacion:**
- **Dado** que un stereotype `kora:concept` define borde morado, **cuando** exporto un OPD con cosas de ese stereotype, **entonces** el SVG muestra el borde morado, no el verde default.
- **Dado** que el modelador aplico un estilo custom via `Styling` (EPICA-14) a una cosa, **cuando** exporta, **entonces** el estilo persiste.
- **Dado** que no hay estilos custom, **cuando** exporta, **entonces** se usan los defaults [V-1] de la SSOT visual.
- **Dado** que hay un conflicto entre stereotype y styling autorial, **cuando** se resuelve, **entonces** prevalece el styling autorial (stereotype es default de clase, styling es override de instancia).

**Reglas y restricciones:**
- La resolucion de estilos sigue la cascada: SSOT default [V-1] → stereotype → styling autorial → (eventualmente: organization default §82).
- El SVG debe reflejar la cascada aplicada, no el default.
- El color es informativo, no normativo [V-63]; una implementacion puede usar otra paleta mientras la topologia sea clara.

**Modelo de datos tocado:**
- Solo lectura: `thing.stereotype`, `thing.styleOverride`, profile activo.

**Dependencias:**
- Bloqueada por: HU-61.014.
- Relaciona: EPICA-14, EPICA-A0, EPICA-81.

**Integraciones:**
- Resolver de estilos (compartido con canvas).

**Notas de evidencia:**
- Fuente normativa: [V-1] representaciones canonicas; [V-63] colores informativos.
- Fuente OPCloud: §7.5 (hipotesis explicita: "preserva; la carpeta 08 deberia aclararlo").
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-svg, render, styling, stereotypes, requires-clarification].

---

### HU-61.017 — Optimizar SVG eliminando nodos innecesarios y agrupando estilos

**Actor primario:** ME (modelador experto).
**Tipo:** mixto.
**Nivel categorico:** V.
**Superficie UI:** n/a (archivo SVG generado).
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador experto, quiero que el SVG este optimizado (sin nodos vacios, con estilos agrupados en CSS/defs) para que el archivo sea lo mas liviano posible sin perder fidelidad.

**Contexto de negocio:**
SVGs generados desde librerias de canvas (JointJS incluido) tienden a tener nodos redundantes, atributos inline repetidos y grupos wrap innecesarios. Un pase de optimizacion reduce tamano 30–60% sin cambio visual, critico para incrustar en web o papers con limite de peso.

**Criterios de aceptacion:**
- **Dado** que el SVG tiene grupos `<g>` sin atributos ni hijos, **cuando** pasa por optimizador, **entonces** se eliminan.
- **Dado** que multiples elementos tienen `stroke="#00AA00" stroke-width="2"`, **cuando** pasa por optimizador, **entonces** se extrae a una clase CSS dentro de `<defs><style>`.
- **Dado** que hay atributos con valores default, **cuando** pasa por optimizador, **entonces** se eliminan (ej. `opacity="1"`, `fill="black"` cuando es el default heredado).
- **Dado** que el SVG original pesa 120KB, **cuando** se optimiza, **entonces** pesa ≤80KB sin cambio visual perceptible.

**Reglas y restricciones:**
- La optimizacion debe ser **lossless visual** — un diff pixel a pixel del render debe ser identico.
- Librerias candidatas: SVGO (node), optimizador custom.
- Toggle opcional: activado por default, desactivable para debugging.

**Modelo de datos tocado:**
- Ninguno (operacion sobre markup).

**Dependencias:**
- Bloqueada por: HU-61.008, HU-61.014.

**Integraciones:**
- Pipeline de render (post-paso de optimizacion).

**Notas de evidencia:**
- Fuente: inferencia derivada de practicas comunes; no hay evidencia en doc fuente.
- Clase de afirmacion: inferido.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-svg, render, optimization, svgo, performance].

---

### HU-61.018 — Embeber fuentes vs referenciar por CSS en el SVG

**Actor primario:** ME (modelador experto).
**Tipo:** mixto.
**Nivel categorico:** V.
**Superficie UI:** n/a (archivo SVG generado).
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador experto, quiero elegir entre embeber fuentes en el SVG o referenciarlas por nombre para equilibrar fidelidad tipografica y tamano del archivo.

**Contexto de negocio:**
Si el SVG referencia una fuente (`font-family: "Inter"`) que no esta instalada en el sistema del lector, el navegador o editor sustituye por fallback y el layout del texto cambia. Embeber la fuente garantiza fidelidad pero agrega 100–500KB al archivo. La decision depende del destino.

**Criterios de aceptacion:**
- **Dado** que el modelo usa una fuente custom `Inter`, **cuando** exporto con opcion "embed fonts" activa, **entonces** el SVG incluye `<defs><style>@font-face{...}</style></defs>` con la fuente codificada en base64.
- **Dado** que exporto con "embed fonts" desactivado, **cuando** inspecciono el SVG, **entonces** solo hay referencia `font-family: "Inter"` sin embedding.
- **Dado** que embevo la fuente, **cuando** abro el SVG en un sistema sin `Inter` instalado, **entonces** el texto se renderiza con la fuente embebida.
- **Dado** que no embevo, **cuando** abro en ese sistema, **entonces** el navegador usa fallback (aceptable con advertencia).

**Reglas y restricciones:**
- Default recomendado: embeber fuentes cuando el SVG es para publicacion (paper, web externa); no embeber para uso interno.
- Configuracion: posible toggle futuro en modal o setting de organizacion (§82).
- Considerar licencia de la fuente antes de embeber (fonts con restricciones de embedding violarian licencia).

**Modelo de datos tocado:**
- Config: `settings.exportSvg.embedFonts: boolean`.

**Dependencias:**
- Bloqueada por: HU-61.008.
- Relaciona: EPICA-80 (config user-org), EPICA-81 (style defaults).

**Integraciones:**
- Resolver de fuentes del sistema de estilos.

**Notas de evidencia:**
- Fuente: inferencia (no observado en frames).
- Clase de afirmacion: inferido.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-svg, render, fonts, embed, base64, requires-clarification].

---

### HU-61.019 — Aplicar background color opcional al SVG exportado

**Actor primario:** RV (revisor).
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** n/a (archivo SVG generado).
**Gesto canonico:** ninguno (opcional: toggle en modal futuro).

**Historia:**
> Como revisor, quiero poder agregar un background color al SVG (blanco, transparente o custom) para que se vea correctamente al incrustar en documentos con fondo oscuro o light.

**Contexto de negocio:**
Por default el SVG es **transparente** (sin `<rect>` de fondo). Al incrustar en un PDF oscuro, los textos negros desaparecen. Ofrecer la opcion de agregar fondo blanco (o custom) previene este problema.

**Criterios de aceptacion:**
- **Dado** que el default es transparente, **cuando** exporto sin tocar background, **entonces** el SVG no tiene rect de fondo (observado frame_00014 — fondo blanco del navegador, no del SVG).
- **Dado** que activo `Background: white` en el modal futuro, **cuando** exporto, **entonces** el SVG incluye `<rect width="100%" height="100%" fill="white"/>` como primera capa.
- **Dado** que activo `Background: custom` y elijo `#1a1a1a`, **cuando** exporto, **entonces** el rect usa ese color.
- **Dado** que el fondo es oscuro y los textos son negros, **cuando** se exporta, **entonces** el sistema advierte del conflicto de contraste (warning no-bloqueante).

**Reglas y restricciones:**
- Default historico observado: transparente (frame_00014 no tiene fill explicito; el blanco viene del navegador).
- Implementacion: toggle adicional en el modal o setting global.

**Modelo de datos tocado:**
- Transitorio: `exportDialog.background: "transparent" | "white" | string (hex)`.

**Dependencias:**
- Bloqueada por: HU-61.008.

**Integraciones:**
- Ninguna fuera del render.

**Notas de evidencia:**
- Fuente OPCloud: observacion indirecta del frame_00014 (fondo blanco no esta en SVG).
- Clase de afirmacion: inferido.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-svg, render, background, transparency].

---

### HU-61.020 — Embeber metadata OPM como atributos XML en el SVG

**Actor primario:** ME (modelador experto).
**Tipo:** opm-semantica.
**Nivel categorico:** V primario; X (interop).
**Superficie UI:** n/a (archivo SVG generado).
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador experto, quiero que el SVG incluya metadata OPM (id, tipo, essence, affiliation) en atributos XML custom para permitir inspeccion semantica sin abrir el modelo completo.

**Contexto de negocio:**
Un SVG inerte es solo grafico. Embeber metadata OPM en atributos `data-opm-*` permite que herramientas downstream (scripts, validadores, re-importadores) reconstruyan informacion semantica desde el archivo visual [V-0a]. La SSOT define Objeto [Glos 3.39] y Proceso [Glos 3.58] como entidades con identidad, tipo y atributos ontologicos. Es el primer paso hacia SVG como canal de intercambio ligero.

**Criterios de aceptacion:**
- **Dado** que exporto un OPD, **cuando** inspecciono el SVG, **entonces** cada `<g>` de cosa tiene atributos `data-opm-id="uuid"`, `data-opm-type="process|object"`, `data-opm-essence="informatical|physical"`, `data-opm-affiliation="systemic|environmental"`, `data-opm-name="..."`.
- **Dado** que exporto, **cuando** inspecciono un link, **entonces** tiene `data-opm-type="instrument|consumption|result|..."`, `data-opm-source="uuid"`, `data-opm-target="uuid"`.
- **Dado** que el SVG raiz, **cuando** se inspecciona, **entonces** tiene `data-opm-opd-id`, `data-opm-opd-code`, `data-opm-model-id`, `data-opm-exported-at` (ISO 8601).
- **Dado** que el SVG se incluye en un documento HTML, **cuando** un script lo parsea, **entonces** puede recuperar toda la metadata OPM sin acceso al modelo original.

**Reglas y restricciones:**
- Opcion A: atributos `data-opm-*` (HTML-compatible, universal).
- Opcion B: namespace XML `xmlns:opm="https://opm.example.org/ns"` con atributos `opm:id`.
- Decision: adoptar Opcion A por compatibilidad con herramientas web no-XML.
- Metadata NO incluye contenido sensible ni OPL completo (ese va en HU-61.021).

**Modelo de datos tocado:**
- Solo lectura.

**Dependencias:**
- Bloqueada por: HU-61.008.

**Integraciones:**
- Potencial re-importador (EPICA-70 interop-opcat) futuro.

**Notas de evidencia:**
- Fuente normativa: [V-0a] canon-diagrama como artefacto de intercambio; [Glos 3.39] Objeto; [Glos 3.58] Proceso.
- Fuente OPCloud: §11.7 pregunta abierta ("¿incluye OPCloud algun metadato OPM dentro del `<svg>`?").
- Clase de afirmacion: hipotesis (feature nueva para nuestro modelador, no observable en OPCloud).

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-svg, render, metadata, data-attributes, interop].

---

### HU-61.021 — Incluir OPL como comentario XML en el SVG

**Actor primario:** RV (revisor).
**Tipo:** opm-semantica.
**Nivel categorico:** V primario; L (OPL).
**Superficie UI:** n/a (archivo SVG generado).
**Gesto canonico:** ninguno (opcional: toggle en modal futuro).

**Historia:**
> Como revisor, quiero que el SVG incluya la OPL del OPD como comentario XML para que el archivo sea auto-contenido y documentado sin archivo externo.

**Contexto de negocio:**
El SVG de OPCloud **no incluye OPL** (§5.2, §6.4, §7.3 fuente). Esto fuerza al usuario a acudir a `Export OPL` o al PDF. La SSOT establece que "todo modelo OPM individual se expresa en dos formas equivalentes: OPD y OPL-ES" [OPL-ES D1..D4]. Incluir OPL como comentario XML (`<!-- OPL: ... -->`) hace el SVG auto-contenido sin afectar el render visual.

**Criterios de aceptacion:**
- **Dado** que exporto un OPD con OPL, **cuando** inspecciono el SVG, **entonces** al inicio hay un comentario XML multi-linea con las oraciones OPL del OPD.
- **Dado** que el OPD cambia, **cuando** reexporto, **entonces** el comentario refleja el estado actual del OPL.
- **Dado** que el toggle `Include OPL as comment` esta desactivado (hipotetico), **cuando** exporta, **entonces** el SVG no tiene el comentario.
- **Dado** que la OPL es multi-parrafo, **cuando** se embebe, **entonces** se preserva con saltos de linea y escapando `--` (ilegal en comentarios XML).

**Reglas y restricciones:**
- Formato: `<!-- OPL\n<linea 1>\n<linea 2>\n...\n-->` al inicio del SVG, dentro de `<svg>` o antes.
- Default recomendado: activado (el costo en tamano es bajo; el beneficio en auto-contencion es alto).
- Escaping: reemplazar `--` por `- -` o encodear.

**Modelo de datos tocado:**
- Solo lectura: OPL generada.

**Dependencias:**
- Bloqueada por: HU-61.008.
- Relaciona: EPICA-50 (OPL pane).

**Integraciones:**
- Motor OPL (`src/render/opl-renderer.ts`).

**Notas de evidencia:**
- Fuente normativa: [OPL-ES D1..D4] propiedades genericas y oraciones canonicas.
- Fuente OPCloud: §5.2, §6.4, §7.3 (OPCloud NO incluye OPL); esta HU es **extension divergente** al usar el SVG como canal documental.
- Clase de afirmacion: inferido (feature nuestra).

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-svg, opl, metadata, comment, auto-contained].

---

### HU-61.022 — Agregar title y desc accesibles para lectores de pantalla

**Actor primario:** RV (revisor).
**Tipo:** mixto.
**Nivel categorico:** V.
**Superficie UI:** n/a (archivo SVG generado).
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero que el SVG incluya elementos `<title>` y `<desc>` para que lectores de pantalla y herramientas accesibles puedan presentar el diagrama a usuarios con discapacidad visual.

**Contexto de negocio:**
SVG accesible es un estandar WCAG 2.1. Un `<title>` al inicio del `<svg>` provee el nombre del diagrama; `<desc>` provee una descripcion textual que puede derivarse de la OPL. Para modelos usados en contextos educativos o institucionales (salud, politica), la accesibilidad es un requisito no opcional.

**Criterios de aceptacion:**
- **Dado** que exporto un OPD `System Diagram (SD)`, **cuando** inspecciono el SVG, **entonces** contiene `<title>System Diagram (SD)</title>` como primer hijo de `<svg>`.
- **Dado** que exporto, **cuando** inspecciono `<desc>`, **entonces** contiene un resumen del OPD (cantidad de things, links principales, o la OPL completa).
- **Dado** que el SVG se lee con NVDA o VoiceOver, **cuando** se enfoca, **entonces** el lector anuncia el titulo y la descripcion.
- **Dado** que hay things con nombres, **cuando** se inspecciona cada `<g>` de thing, **entonces** tiene su propio `<title>` con el nombre de la cosa para navegacion accesible.

**Reglas y restricciones:**
- `<title>` y `<desc>` deben ir al comienzo del elemento donde aplican.
- `<desc>` derivada de OPL si existe; sino, descripcion generica.
- WCAG 2.1 Nivel AA como objetivo.

**Modelo de datos tocado:**
- Solo lectura.

**Dependencias:**
- Bloqueada por: HU-61.008, HU-61.021 (la OPL puede servir como `<desc>`).

**Integraciones:**
- Motor OPL.

**Notas de evidencia:**
- Fuente OPCloud: §11.11 pregunta abierta ("¿incluye `<title>` / `<desc>` para lectores de pantalla? No observable").
- Clase de afirmacion: hipotesis (feature nuestra, extension de accesibilidad).

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-svg, render, accessibility, a11y, wcag].

---

### HU-61.023 — Garantizar compatibilidad con Inkscape e Illustrator

**Actor primario:** ME (modelador experto).
**Actores secundarios:** AD.
**Tipo:** mixto.
**Nivel categorico:** V primario; X secundario.
**Superficie UI:** n/a (archivo SVG generado).
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador experto, quiero abrir el SVG exportado en Inkscape o Adobe Illustrator sin perder fidelidad ni ver errores para poder hacer ajustes manuales previos a publicacion.

**Contexto de negocio:**
Inkscape (OSS) y Illustrator (Adobe) son los editores SVG mas comunes para post-produccion. Features SVG validas pero poco soportadas (filtros complejos, foreignObject, CSS avanzado) rompen la compatibilidad. El SVG exportado debe restringirse al subset ampliamente soportado.

**Criterios de aceptacion:**
- **Dado** que exporto un OPD, **cuando** abro el SVG en Inkscape 1.x, **entonces** el render es visualmente identico al navegador sin warnings.
- **Dado** que abro el SVG en Illustrator CC, **cuando** se importa, **entonces** los elementos son seleccionables individualmente (no rasterizados) y las capas de JointJS se preservan como grupos navegables.
- **Dado** que uso `<filter>` para drop-shadow, **cuando** abro en Inkscape, **entonces** el filtro se respeta (no se sustituye por sombra simple).
- **Dado** que el SVG usa features nuevas (SVG 2 como `<mesh>`), **cuando** se importa en editores con soporte SVG 1.1, **entonces** se evita o se degrada gracefully.

**Reglas y restricciones:**
- Subset: SVG 1.1 Full + SVG 2 solo para features ampliamente soportadas.
- Features prohibidas en el export: `<foreignObject>` con HTML, `<script>`, animaciones SMIL (a menos que se justifiquen para GIF en HU-61.026).
- Filtros complejos (drop-shadow) deben usar primitivas estandar: `<feGaussianBlur>`, `<feOffset>`, `<feMerge>`.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-61.008, HU-61.014, HU-61.017.

**Integraciones:**
- Suite de tests con Inkscape y Illustrator (manual o automatizada).

**Notas de evidencia:**
- Fuente: inferencia (no observado en doc, buena practica de export SVG).
- Clase de afirmacion: inferido.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-svg, render, compatibility, inkscape, illustrator, editors].

---

### HU-61.024 — Mostrar feedback post-descarga y permitir reabrir el modal

**Actor primario:** RV (revisor).
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** barra-descarga-navegador + eventual toast in-app.
**Gesto canonico:** ninguno (reactivo al exito del export).

**Historia:**
> Como revisor, quiero recibir feedback claro cuando el export termina para saber que la descarga ya disparo, sin tener que buscar en la barra del navegador.

**Contexto de negocio:**
En OPCloud el feedback de exito es **solo la barra del navegador** (§9 fuente — no hay toast propio). Para usuarios con multiples descargas o con la barra minimizada, es facil perder el evento. Un toast in-app reduce la ambiguedad.

**Criterios de aceptacion:**
- **Dado** que disparo el export y termina con exito, **cuando** se descarga el archivo, **entonces** aparece un toast `Exported <filename>` durante 3s en la esquina inferior.
- **Dado** que el export falla (error de render, memoria), **cuando** ocurre el fallo, **entonces** se muestra un toast de error con motivo y se mantiene el modal abierto.
- **Dado** que el toast esta visible, **cuando** hago clic en el, **entonces** se reabre el modal con los ultimos parametros (nombre, formato, scope).
- **Dado** que cierro el modal normalmente, **cuando** reabro `Export Model Diagrams` en la misma sesion, **entonces** los parametros se preservan (HU-61.003 §pregunta abierta).

**Reglas y restricciones:**
- El feedback in-app es **adicional** al del navegador, no sustituto.
- Persistencia del estado del modal entre aperturas: por sesion, no entre recargas (consistente con otros modales).

**Modelo de datos tocado:**
- Sesion: `session.lastExportState`.

**Dependencias:**
- Bloqueada por: HU-61.003.

**Integraciones:**
- Sistema de toasts existente.

**Notas de evidencia:**
- Fuente OPCloud: §9, §11.8.
- Clase de afirmacion: hipotesis (feature propia, divergencia justificada).

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [export-svg, ui, feedback, toast, session-state].

---

### HU-61.025 — Tests de fidelidad visual entre canvas y SVG exportado

**Actor primario:** ME (modelador experto).
**Actores secundarios:** Tester/CI.
**Tipo:** mixto.
**Nivel categorico:** V primario (validacion de render).
**Superficie UI:** n/a (test harness).
**Gesto canonico:** ninguno (automatizado).

**Historia:**
> Como modelador experto, quiero una suite de tests que compare el canvas con el SVG exportado para garantizar que ningun cambio de render rompa la fidelidad visual.

**Contexto de negocio:**
El SVG debe ser **render identico al canvas** menos cromo. Sin tests, cualquier refactor de JointJS o del layout puede introducir regresiones invisibles hasta que un usuario abre el SVG y descubre que falta una sombra o un color se cambio. La invariante [V-0a] exige que lo que esta en el canon-diagrama se preserva en el SVG.

**Criterios de aceptacion:**
- **Dado** que hay N fixtures OPM, **cuando** se corre `bun run tests/run.ts`, **entonces** se genera un SVG por fixture y se compara contra un snapshot de referencia.
- **Dado** que un snapshot SVG difiere del de referencia, **cuando** se ejecutan tests, **entonces** falla con diff visual claro (diff de markup + eventual diff pixel tras render headless).
- **Dado** que un cambio intencional de render, **cuando** se ejecuta con `UPDATE_SNAPSHOTS=1`, **entonces** se regeneran los snapshots SVG.
- **Dado** que se ejecuta el test de fidelidad canvas-vs-SVG, **cuando** se comparan, **entonces** las diferencias estan solo en cromo UI (handles, seleccion) y no en gramatica OPM.
- **Dado** que los fixtures tienen cosas con sombra fisica, **cuando** se valida el SVG, **entonces** las sombras estan presentes con filtro SVG equivalente.

**Reglas y restricciones:**
- El renderizado headless puede usar JSDOM, happy-dom o Playwright.
- Comparacion: markup diff (mas rapido, robusto) + opcional pixel diff para cambios sutiles.
- Los snapshots viven en `tests/snapshots/svg/` paralelamente a los existentes.

**Modelo de datos tocado:**
- Ninguno productivo; afecta tests.

**Dependencias:**
- Bloqueada por: HU-61.008, HU-61.014, HU-61.015.

**Integraciones:**
- `tests/run.ts`.
- CI (`bun run check`).

**Notas de evidencia:**
- Fuente normativa: [V-0a] canon-diagrama — el SVG debe reflejar fielmente el OPD.
- Fuente: invariante del repo ("55+ snapshots deben pasar"); extension logica a SVG.
- Clase de afirmacion: inferido.

**Prioridad:** C.
**Tamano:** L.
**Etiquetas:** [export-svg, tests, snapshot, fidelity, ci].

---

### HU-61.026 — Exportar OPD como GIF animado desde submenu Exports

**Actor primario:** RV (revisor).
**Actores secundarios:** PD (facilitador pedagogico), IS (ingeniero de simulacion).
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; V secundario.
**Superficie UI:** submenu-exports (entrada futura `Export Model to GIF`).
**Gesto canonico:** clic en `Main menu ▸ Exports ▸ Export Model to GIF`.

**Historia:**
> Como revisor, quiero exportar una animacion del OPD como GIF para compartir rotaciones de simulacion o transiciones de estado en plataformas que no soportan SVG.

**Contexto de negocio:**
La carpeta 02 del reverse menciona una entrada `Export Model to GIF` en el submenu `Exports` (doc fuente §1 — listado fuera del scope actual). Esta opcion no se observa en la carpeta 33 (§1 fuente: "la exportacion como GIF mencionada en el submenu `Exports` de la carpeta 02 — no se observa en esta carpeta"). El GIF es pertinente para:
- Animar simulacion conceptual/computacional (EPICA-B0, B1).
- Mostrar transiciones entre estados de un Object.
- Documentacion pedagogica en plataformas que no renderizan SVG animado.

**Criterios de aceptacion:**
- **Dado** que abro `Main menu ▸ Exports`, **cuando** veo el submenu, **entonces** aparece la entrada `Export Model to GIF` (diferida a implementacion futura).
- **Dado** que hago clic en `Export Model to GIF`, **cuando** se ejecuta, **entonces** se abre un modal analogo a `Export Model Diagrams` con controles especificos de GIF (duracion por frame, loop, calidad).
- **Dado** que el modelo tiene una simulacion ejecutable, **cuando** exporto a GIF, **entonces** se animan los frames de la simulacion.
- **Dado** que el modelo no tiene simulacion pero tiene states, **cuando** exporto a GIF, **entonces** se genera animacion rotatoria de los estados posibles de cada Object.
- **Dado** que el GIF supera tamano limite (ej. 50MB), **cuando** se genera, **entonces** se advierte al usuario y se sugiere bajar calidad o duracion.

**Reglas y restricciones:**
- Depende fuertemente de EPICA-B0/B1 (simulacion) para contenido animable.
- Alternativa para modelos estaticos: pan+zoom automatizado (menos util).
- Librerias candidatas: gif.js, gifenc.
- Diferido hasta que simulacion este disponible.

**Modelo de datos tocado:**
- Solo lectura.

**Dependencias:**
- Bloqueada por: HU-61.003.
- Bloqueada por: EPICA-B0 (simulation-conceptual).
- Bloqueada por: EPICA-B1 (simulation-computational).

**Integraciones:**
- Motor de simulacion (EPICA-B0, B1).

**Notas de evidencia:**
- Fuente OPCloud: §1 mencion fuera de scope ("la exportacion como GIF mencionada en el submenu `Exports` de la carpeta 02 — no se observa en esta carpeta").
- Clase de afirmacion: hipotesis (feature mencionada sin implementacion observada).
- Etiqueta: `requires-clarification`, `deferred`.

**Prioridad:** W (diferida — depende de simulacion).
**Tamano:** XL (requiere motor de simulacion + encoder GIF + controles).
**Etiquetas:** [export-svg, export-gif, roadmap, deferred, simulation, requires-clarification].

---

## Preguntas abiertas derivadas

- **Q61.1** (Q11.1 fuente): Efecto visual exacto de `Include Computational Processes Tooltips` — ¿marcador permanente, texto, filtro SVG? Afecta HU-61.012.
- **Q61.2** (Q11.2 fuente): Empaquetado de `OPD Tree` — ¿zip, archivo combinado o descargas multiples? Resolucion propuesta en HU-61.009: adoptar `.zip`.
- **Q61.3** (Q11.3 fuente): Existencia de boton `Cancel` en el modal. Resolucion propuesta en HU-61.011: usar ESC + clic fuera.
- **Q61.4** (Q11.4 fuente): Editabilidad de `File name` y semantica con `OPD Tree`. Resolucion propuesta en HU-61.004: editable, prefijo en tree.
- **Q61.5** (Q11.5 fuente): Default `JPEG` vs `SVG` — ¿configurable por organizacion? Afecta HU-61.006 y EPICA-82.
- **Q61.6** (Q11.7 fuente): Embebido de metadata OPM en el SVG — cubierto por HU-61.020 como feature nueva.
- **Q61.7** (Q11.8 fuente): Persistencia del estado del dialogo entre aperturas. Cubierto parcialmente por HU-61.024 (por sesion).
- **Q61.8** (Q11.9 fuente): Conformidad con estilos autorales custom. Cubierto por HU-61.016 con etiqueta `requires-clarification`.
- **Q61.9** (Q11.11 fuente): Accesibilidad del SVG. Cubierto por HU-61.022 como feature nueva.
- **Q61.10** (Q11.12 fuente): Re-importacion del SVG. Resolucion: **no implementar** — acudir a EPICA-70 (OPCAT) y EPICA-71 (CSV). La metadata de HU-61.020 es inspeccion, no round-trip.
- **Q61.11**: Como se maneja el export si el layout esta siendo recalculado (carrera entre layout y export). Hipotesis: esperar al layout estable antes de exportar.
- **Q61.12**: Licencias de fuentes embebibles (HU-61.018). Depende de fuentes elegidas; requiere politica de fuentes del proyecto.

## Referencias cruzadas

- Fuente normativa: `opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`.
- Evidencia OPCloud: `JOYAS.md`, `sandbox-data/`, `assets/svg/`, `decompiled/`.
- Doc fuente original: `opcloud-reverse/61-export-svg.md`.
- Epicas de las que depende:
  - **EPICA-20** (`20-estructura-opd-tree.md`) — arbol OPD provee scope `OPD Tree` y naming de archivos.
  - **EPICA-14** (`14-canvas-styling.md`) — estilos autorales (HU-61.016).
  - **EPICA-50** (`50-opl-pane.md`) — motor OPL embebido como comentario (HU-61.021) y `<desc>` (HU-61.022).
  - **EPICA-60** (`60-export-pdf.md`) — par canonico con este export; arbitraje gramatica vs UI se hace comparando ambos.
  - **EPICA-A0** (`a0-extension-stereotypes.md`) — stereotypes en estilos custom (HU-61.016).
  - **EPICA-B0, B1** (simulacion) — contenido animable para GIF (HU-61.026).
  - **EPICA-B1** (simulation-computational) — procesos computacionales para tooltips (HU-61.012).
  - **EPICA-80, 81, 82** — config user/org, style defaults, ontologia (defaults persistibles).
- Epicas que consumen esta: ninguna (export es salida terminal).
- Invariantes del repo tocados:
  - `src/render/jointjs/` — renderer JointJS debe exponer modo "export" sin cromo.
  - `src/render/layout/` — bounding box para viewBox (HU-61.013).
  - `src/render/opl-renderer.ts` — OPL como comentario y `<desc>`.
  - `ssot/opm-visual-es.md` §1.1b, §1.3, §1.5 — cromatismo, sombra, piruletas.
  - `tests/snapshots/` — extension a `tests/snapshots/svg/` (HU-61.025).
- Principios categoricos aplicables:
  - El export SVG es un **morfismo terminal** del funtor render hacia un objeto externo (archivo); no tiene dual (no hay re-import desde SVG — ver Q61.10).
  - Preservacion de cromatismo (HU-61.014) corresponde a una **invariante del funtor visual**: el SVG es una imagen (en el sentido categorico) del canvas menos cromo [V-0a].
