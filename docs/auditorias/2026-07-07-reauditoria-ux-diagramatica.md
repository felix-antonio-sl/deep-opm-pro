# Re-auditoría UX diagramática — canvas · Inspector · barra de simulación (2026-07-07)

**Qué es esto.** Re-evaluación **in-vivo** de los hallazgos abiertos de la auditoría
Jobs `2026-06-12-auditoria-ux-jobs.md` (M-3, M-4, M-6, m-1, m-3, m-4, m-6), aplicados al
estado de **hoy** — después de que se desplegaran modo apunte, gesto de anclar, C4 y el
**Centinela de Drift** (que agregó la sección «Anclaje» al Inspector). No se ejecuta la
lista vieja al pie: primero se falsó cada hallazgo contra el producto corriendo, para
separar lo vigente de lo que se resolvió solo o se superó.

**Este reporte reemplaza la porción abierta** (M-3..m-6) del acta 2026-06-12. Aquella
conserva su valor histórico (registro de C-1 + M-1/M-2 ejecutados el 2026-06-12); no se
elimina hasta que la remediación de aquí aterrice.

**Método.** Sonda dirigida Playwright/Chromium (headless, 1440×900) contra el dev server
local sobre `main` (HEAD `48eb6734`), tres pasadas con refinamiento de sonda (la 1ª tuvo
falsos negativos por foco de input y por un loader de ejemplo que cargó 0 elementos; se
corrigieron y re-corrieron). Cada veredicto se ancla a una medición del DOM o a una
captura de esta sesión, no a memoria. Runtime limpio: 0 pageerror, 0 console.error en las
tres corridas. Evidencia regenerable en `app/test-results/reauditoria/` (gitignored):
`_hallazgos{,2,3}.json` + capturas `s1..s6`, `p2-*`, `p3-*`.

---

## Veredicto ejecutivo

De siete hallazgos re-auditados, **cuatro siguen vivos** (uno agravado por el Centinela),
**uno se resolvió solo** por el rediseño Codex de la anotación, **uno quedó
sustancialmente resuelto** (su premisa ya es falsa) y **ninguno era falso de origen**. El
esfuerzo de remediación se concentra en tres frentes reales: la ilegibilidad del Inspector
(el más costoso, y el que empeoró), el ruido del scaffolding, y la barra de simulación que
se contradice.

| # | Hallazgo | Veredicto hoy | Impacto |
|---|----------|---------------|---------|
| **M-4** | Inspector sin jerarquía de frecuencia | **PERSISTE · AGRAVADO** | Alto |
| **M-3** | Placeholders sembrados y luego denunciados | **PERSISTE** | Alto |
| **M-6** | La barra de simulación se contradice | **PERSISTE** | Medio |
| **m-6** | Inspector vacío ofrece «Notas de mesa» | **PERSISTE** | Bajo |
| **m-4** | El canvas no re-encuadra al cambiar viewport | **PERSISTE** | Bajo |
| **m-1** | Conectar por R aplica el tipo en silencio | **RESUELTO (sustancial)** | — |
| **m-3** | La anotación contextual pisa figuras densas | **RESUELTO** | — |

Hallazgo incidental fuera de la lista pero **en la misma superficie auditada**: tres
residuos de **M-5** (microcopy/jerga) viven aún en el Inspector — ver §Residuos M-5.

---

## Detalle por hallazgo

### M-4 · Inspector sin jerarquía de frecuencia — PERSISTE y EMPEORÓ

**Evidencia in-vivo** (`_hallazgos.json` → `obs.m4`, captura `s2-m4-inspector-objeto.png`):
seleccionar un objeto simple («Cliente») apila **6 secciones de primer nivel siempre
expandidas** (Semántica, Enlaces, Refinamiento, Extensiones, Apariciones, Tamaño), sin
ningún colapso — `FichaSeccion` es una ficha tipográfica continua, no un disclosure
(`app/src/ui/inspector/FichaSeccion.tsx`). La ficha mide **1803 px dentro de un panel de
852 px** = **2,1 pantallas de scroll** para una sola cosa. Solo «Semántica» mide **845 px**
(ocho subsecciones anidadas: Descripción, Anclas, Notas de mesa, Alias, Unidad, URLs,
Imagen, Esencia/Afiliación, Estados), de modo que los campos del 90 % de los gestos —
Estados y Enlaces — quedan enterrados bajo una pantalla completa de metadatos raros.

**Agravamiento por el Centinela** (código, `app/src/ui/InspectorEntidad.tsx:274`): cuando la
cosa está anclada a una Pieza de biblioteca, `debeMostrarSeccionAnclaje` monta una **7ª
sección** «Anclaje» entre Extensiones y Apariciones, también siempre expandida. (No se pudo
renderizar in-vivo esta sesión — la inyección de `anclaje` vía store falló headless — pero
la condición de montaje está confirmada por código; es exactamente el empeoramiento que se
anticipó.) La sección en sí es sobria y correcta (copy honesto, sin crimson); el problema no
es la sección, es que **se suma a una pila que ya no tiene jerarquía**.

**Lo pedido sigue sin hacerse**: Nombre + Semántica abiertos y el resto colapsado con
memoria de sesión; «Extensiones» tras un solo disclosure; «Tamaño» solo si hay override.

### M-3 · El producto siembra placeholders y luego los denuncia — PERSISTE

**Evidencia in-vivo** (`_hallazgos.json` → `obs.m3`, captura `s3-m3-descomposicion.png`):
descomponer un proceso «Procesar» siembra `Procesar 1`, `Procesar 2`, `Procesar 3` y el
contador de diagnóstico salta de **△ 2 → △ 13 sugerencias** — el producto acusa el
scaffolding que él mismo acaba de crear. Tras descomponer, el foco queda en el botón
`barra-inzoom`, **no** en un primer placeholder en edición de nombre
(`renameEncadenadoInline: false`): renombrar los tres exige seleccionar y editar cada uno.
Ni el rename encadenado inline ni la agrupación de sugerencias («N subprocesos esperan
nombre») se implementaron.

### M-6 · La barra de simulación se contradice — PERSISTE (verbatim)

**Evidencia in-vivo** (`_hallazgos3.json` → `obs.m6sim`, captura `p3-m6-sim-tras-paso.png`):
al simular un proceso, la barra lee `progreso = "Listo para simular · paso 1 de 1 · proceso"`
tanto al entrar como tras pisar «paso» (`contradiccionListoYFase: true`). El texto completo
de la barra mezcla **al mismo tiempo** tres estados incompatibles: «*Listo para simular*»
(ocioso), «**Proceso activo: Hervir** — El proceso está activo» (corriendo) y «proc
**completado** 00 / 01» en el timeline (terminado, con nada consolidado). Causa raíz
(`app/src/ui/simulacion/proyeccionBarra.ts` → `textoProgresoVivo`): en modo manual el prefijo
es **siempre** «Listo para simular», y se le concatena el rótulo de fase (que incluye
«completado»). Es la contradicción exacta que denunció M-6.

### m-6 · El inspector vacío ofrece «Notas de mesa» — PERSISTE

**Evidencia in-vivo** (`_hallazgos.json` → `obs.m6`, captura `s1-m6-inspector-vacio.png`):
sin selección, el inspector muestra «Selecciona un elemento.» e **inmediatamente debajo la
afordancia «Notas de mesa» con caja de texto y botón «Anotar»** (`notasMesaInput: 1`,
`notasMesaBoton: 1`). Es una feature de método antes que de contexto. (Registro Ratificar y
Anclas del modelo/OPD sí aparecen solo si tienen contenido — `registroRatificar: 0`,
`anclasModeloTexto: false` en vacío —; la única que se filtra incondicional es Notas de mesa,
porque `SeccionNotasMesa` renderiza siempre su editor.)

### m-4 · El canvas no re-encuadra al cambiar el viewport — PERSISTE

**Evidencia in-vivo** (`_hallazgos2.json` → `obs.m4resize`, capturas `p2-m4-*.png`): con tres
cosas visibles a 1440 px de ancho, angostar el viewport a 780 px deja el panel del canvas en
`right = 474` mientras el contenido permanece en `maxRight = 952` sin reacomodarse
(`contenidoReacomodado: false`): **los 3 elementos quedan recortados** fuera del área visible
(`elementosRecortadosTrasEncoger: 3`). No hay `fitToContent` cableado al evento `resize`; el
canvas infinito no re-encuadra. El contenido no se pierde (es pan-eable), pero desaparece de
la vista sin aviso.

### m-1 · Conectar por R aplica el tipo en silencio — RESUELTO (sustancial)

**Evidencia in-vivo** (`_hallazgos3.json` → `obs.m1`): con el origen seleccionado, `r` activa
el modo enlace y la toolbar anuncia **en vivo** «**Conectando: Consumo** · selecciona destino
· Esc cancela» (`hintConectandoDurante`). El tipo por defecto ya **no** se aplica en silencio:
se nombra junto al gesto, mientras ocurre. El enlace se crea (`enlaceCreado: true`) y la OPL
lo verbaliza. La premisa original de m-1 («en silencio») ya es falsa. Residuo mínimo: no hay
un anuncio **posterior** a la creación con el atajo «cambia el tipo desde el Inspector»
(`anuncioPostTipoYComoCambiar: false`) — polish trivial, no urgente.

### m-3 · La anotación contextual pisa figuras densas — RESUELTO

**Evidencia in-vivo** (`_hallazgos2.json` → `obs.m3collision`, captura `p2-m3-anotacion-densa.png`):
en un in-zoom denso (contorno elíptico + 3 subprocesos apilados), seleccionar el subproceso
central posa la anotación **abajo** (`placement: "abajo"`) en espacio vacío bajo el contorno,
con **0 colisiones** (>6 px) contra cualquier figura (`colisionesConFiguras: 0`). El rediseño
Codex rev2 (`app/src/ui/codex/CodexSelectionAnnotation.tsx`) reemplazó la caja blanca flotante
por un overlay tipográfico **transparente** posicionado bajo/sobre el bbox de la selección y
acotado al viewport (`posicionarAnotacion`) — logra el objetivo de m-3 (no ocluir) sin la
detección-de-colisión que se había propuesto. Se resolvió por otra vía; no re-abrir.

---

## Residuos M-5 (microcopy / jerga) — incidentales, en la superficie auditada

M-5 salió nominalmente con el corte D (higiene del gestor), pero D tocó el **diálogo del
gestor**, no el chrome del Inspector. Estos tres ítems de M-5 siguen visibles en el Inspector
que acabo de auditar (capturas `s1`, `s2`, `s3`) y son correcciones de segundos:

- Header del Inspector: «INSPECTOR / **Selection**» → «Selección» (bilingüismo).
- Kicker del panel OPL: «**MARGINALIA** / OPL» → «OPL» a secas (MARGINALIA es jerga del design system).
- Timeline del Inspector: «Procesar 1 · **Y 2483**» → «1.º Procesar 1» (la coordenada Y cruda no se muestra jamás).
- (Relacionado) placeholder de Notas de mesa: «Anotar para la re-elicitación…» → «Anotar duda o pendiente…».

---

## Plan de cortes de remediación (propuesto — la priorización es HITL)

Agrupados por superficie y radio de impacto, no por severidad suelta. La secuencia sugerida
va de mayor valor/mayor costo a barrido barato; **la elección y el orden los decide el operador.**

### Corte C′·A — «Inspector legible» (M-4 + m-6 + residuos M-5) — el grande
- **M-4**: dar colapso a `FichaSeccion` con memoria de sesión; abrir Nombre + Semántica, colapsar
  Enlaces/Refinamiento/Extensiones/Apariciones/Tamaño; «Extensiones» entera tras un disclosure;
  «Tamaño» solo si la aparición tiene override manual. Decidir la política de «Anclaje»
  (abierto-por-defecto cuando hay drift, colapsado si está al día).
- **m-6**: en el inspector vacío, solo la frase; Notas de mesa (y anclas/ratificar) tras un
  disclosure o solo con contenido.
- **M-5**: «Selección», «OPL» sin MARGINALIA, Timeline «1.º …» sin coordenada Y, placeholder llano.
- Radio: `InspectorEntidad.tsx`, `FichaSeccion.tsx`, `Inspector.tsx`, `SeccionNotasMesa.tsx`,
  `inspectorStyles.ts`, componente Timeline. **Mediano.**

### Corte C′·B — «Scaffolding sin ruido» (M-3)
- Al sembrar (descomponer/estados): rename encadenado inline (primer placeholder en edición,
  Enter salta al siguiente) + agrupar las sugerencias de placeholders intactos en una sola
  («N subprocesos esperan nombre») para que el diagnóstico no explote por scaffolding propio.
- Radio: kernel de siembra (`descomponerProceso` / estados), diagnóstico/checkers (agrupación),
  UI de rename inline. **Mediano-alto** (toca modelo + diagnóstico + UI).

### Corte C′·C — «Barra de simulación honesta + re-encuadre» (M-6 + m-4)
- **M-6**: estados mutuamente exclusivos en `textoProgresoVivo` — «Listo para simular» solo en
  `preparado` sin fase; corriendo → «Simulando · paso X de Y · fase: Z»; el rótulo de fase nunca
  donde se lea como estado de la corrida.
- **m-4**: cablear `fitToContent` (ya existe en el kernel del canvas infinito) al evento `resize`
  para que el canvas re-encuadre al angostar el viewport (sobre todo mobile).
- Radio: `proyeccionBarra.ts` (chico) + listener de resize en `JointCanvas.tsx` (chico). **Bajo.**

### No tocar
- **m-3** (resuelto por el rediseño de la anotación) y **m-1** (premisa ya falsa; el hint
  «cambia desde el Inspector» es polish opcional que cabría de refilón en C′·A).

**Gate de cada corte**: `cd app && bun run check` + `lint` + `design:governance` + `browser:smoke`.
Todo toca UI → cambia el bundle → **deploy = gate humano**.

---

## Cruce adversarial (verificador de contexto fresco, 2026-07-07)

Un segundo agente sin contexto re-clasificó desde la evidencia cruda. **Confirma los siete
veredictos.** Tres refinamientos que se incorporan:

- **M-3**: la explosión es *un aviso por cada hijo placeholder* desde
  `checkInzoomNombresPlaceholderHijos` (`app/src/modelo/checkers.ts`), solo mitigada
  parcialmente porque `diagnosticoSeveridad.ts` la degrada al tier «mejora» — pero el conteo
  sigue creciendo uno-por-uno. **El fix de C′·B debe agregar el aviso** («N subprocesos esperan
  nombre»), no solo re-severizarlo.
- **m-1**: el verificador lo rotula **PARCIAL** (no RESUELTO): el hint «Conectando: Consumo»
  rompe el silencio del default, pero falta el copy «cambia el tipo desde el Inspector». Sustancia
  idéntica a la de arriba; el nombre del veredicto es cuestión de vara. No amerita corte propio.
- **m-3**: caveat reforzado — `posicionarAnotacion` solo evita el bbox de la **selección** + los
  bordes del viewport, **no** hace detección general contra otras figuras/enlaces. Las 0 colisiones
  son de *un* layout denso; un layout adverso distinto podría colisionar. Es «no reproducido», no
  «imposible». Si se quiere cerrar con certeza, un probe con vecinos apretados lo confirmaría.

## Cómo reproducir

```bash
cd app && bun run dev                       # dev server en :5173
node test-results/reauditoria/probe.mjs  http://localhost:5173/   # S1-S6 (m-6, M-4, M-3, m-1*, m-3*, m-4*)
node test-results/reauditoria/probe2.mjs http://localhost:5173/   # m-1, m-3-colisión, m-4-resize (refinados)
node test-results/reauditoria/probe3.mjs http://localhost:5173/   # M-6 (barra sim) + m-1 (R con origen)
# Evidencia: app/test-results/reauditoria/_hallazgos{,2,3}.json + capturas PNG
```
