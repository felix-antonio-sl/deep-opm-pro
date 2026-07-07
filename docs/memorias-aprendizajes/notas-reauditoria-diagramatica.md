# Notas — re-auditoría diagramática (canvas · Inspector · barra de simulación)

Lecciones del bucle de re-auditar in-vivo una lista de hallazgos UX añeja (Jobs
2026-06-12) contra el estado de hoy. Una entrada por lección, resumen de una línea arriba.

## Método: falsar antes de planear
**Re-auditar ≠ ejecutar la lista vieja.** El valor está en separar persiste / resuelto-solo /
empeorado ANTES de escribir el plan. De 7 hallazgos, 2 ya no eran ciertos (m-3 lo resolvió un
rediseño de la anotación; m-1 dejó de ser «silencioso» porque la toolbar anuncia «Conectando:
Consumo» en vivo). Gastar un corte en cualquiera de esos dos habría sido esfuerzo tirado.

## Sonda: el foco de input se traga los atajos de teclado
**`page.keyboard.press("r")` no engancha si el foco quedó en un `<input>`.** Tras `crearCosa` el
Nombre queda focuseado (default-brutal #15). Para probar el gesto R (modo enlace) hay que
seleccionar el origen y hacer `document.activeElement.blur()` (o entrar por el botón). Además el
botón «Relación» vive en el cluster «Conectar», que **solo se monta con un origen seleccionado**:
un `getByRole("button",{name:/Relaci/})` sin selección previa devuelve 0.

## Sonda: densidad real vía descomposición, no vía loader de ejemplo
**`cargarEjemplo("System Diagram")` cargó 0 elementos** (el flujo menú→diálogo→selectOption ya no
calza). Para un diagrama denso reproducible, descomponer un proceso (contorno elíptico + 3
subprocesos apilados) es más robusto y controlado que el loader.

## Sonda: `[data-testid^="inspector-panel-"]` sobre-cuenta
**El prefijo matchea el `inspector-panel-enlaces-contenido` anidado** dentro del bloque «Enlaces»,
inflando el conteo a 7 para un objeto que tiene 6 secciones de primer nivel. Contar por
`FichaSeccion` (atributo `data-inspector-seccion` no nulo), no por prefijo de testid. La señal
dura de M-4 no es el conteo sino el volumen: ficha 1803 px en panel de 852 px (2,1 viewports).

## Entorno: el `rg` del host corrompe el resaltado de coincidencias
**El `grep`→`rg` aliaseado (con config del host) colapsa el substring coincidente** — «keydown»
salió como «ln», identificadores como «n». No fiarse del resaltado: usar
`RIPGREP_CONFIG_PATH=/dev/null` (o `command rg --color=never`), o Read directo del archivo.

## Sonda: inyectar el store headless para forzar estados no llegó
**`import('/src/store.ts')` → `store.getState()` falló headless** (`sin store.getState`): el store
no se expone así en el bundle de dev. Para renderizar la sección «Anclaje» (que exige
`entidad.anclaje != null`) hace falta el flujo real de anclar o un import de modelo con el anclaje
ya puesto; la condición de montaje se confirmó por código (`InspectorEntidad.tsx:274`).
