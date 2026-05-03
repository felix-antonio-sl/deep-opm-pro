# Informe — qué haría diferente si partiera desde 0

**Fecha:** 2026-04-28
**HEAD evaluado:** `7036012`
**Magnitud actual:** 27.438 LOC TS en `src/`, 39.082 LOC TS totales, 62 snapshots, 79 archivos de tests, 15 scripts de verificación en `bun run check`, 44 archivos de `docs/reglas/`, 1 fixture canónico vivo (`hodom-completo.json`).

---

## 1. Lo que el repo es hoy (sin adornos)

Un modelador OPM/ISO 19450 funcional en producción con:

- Kernel TypeScript denso y honesto: tipos, validación por 28+ passes, aplicador atómico, Writer log + replay funtorial.
- Render JointJS con 9 passes de layout + 3 passes de adapter + remediaciones ISO M1–M3 + TriangleAgg.
- OPL bidireccional (lente OPL ↔ modelo) con leyes verificadas.
- Persistencia IndexedDB en 3 capas (sesión, workspace, eventos) + JSON canónico v2.3 con dos perfiles (canon estricto + import laxo) y AJV.
- UI vanilla TS con paneles por entidad, breadcrumb, navegador OPD, atajos, tooltips, incidencias.
- Pipeline `bun run check` exhaustivo (typecheck + 14 verificadores + snapshots + build + prod-smoke + e2e).

Lo que funciona, funciona bien. **Pero el costo de llegar acá es mucho mayor que el resultado actual.**

---

## 2. Patrones recurrentes que observé revisando los handoffs

### 2.1 Construcción ameba

`docs/design/deuda-tecnica-2026-04-26.md` lo nombra explícitamente: "el desarrollo se hizo ameba — extendimos UI editorial hasta saturar (~95% cobertura) mientras el validador queda en 30% y a11y/responsive/i18n en 0%". El radar del corte (UI editorial 95%, validador 30%, a11y 0%) es la firma operativa de un proyecto que persiguió señal local en lugar de balance global.

### 2.2 Re-auditorías sobre lo mismo

En 8 días (2026-04-23 → 2026-04-27) se produjeron **10 documentos de auditoría** en `docs/design/`: modelador-core, ssot-visual, fixtures-prod, código-vs-SSOT, visual-360, ISO-19450, json-canónico-post-deuda, deuda-técnica, especificaciones-json, hodom-canónico. Muchas se solapan en hallazgos. La auditoría se convirtió en mecanismo de avance, no en check ocasional.

### 2.3 Ciclo de letras consecutivas (Y..MM)

El backlog y los handoffs muestran ciclos rotulados `Y, Z, AA, BB, CC, DD, EE, FF, GG, HH, II, JJ, KK, LL, MM`. Trece ciclos consecutivos sólo en abril. Cada uno con 2–8 commits + push + deploy + smoke. Es ritmo de trabajo, pero también **fragmentación que dispersa el thread arquitectónico**: cada ciclo arregla síntomas locales que disparan auditorías que generan ciclos siguientes.

### 2.4 Explosión vertical de la verificación

- 15 scripts en `bun run check`.
- 44 archivos en `docs/reglas/` con códigos `R-xxx` propios.
- 55+ invariantes catalogados en `99-invariantes-verificaciones.md` (sólo 28 marcados automáticos, sólo 6 referenciados desde el código).
- Schemas duales (canon + import).
- Hooks pre-commit, prod-smoke, e2e Playwright, snapshots, leyes categoriales.

Se quiso atrapar todo con tipos + tests + AJV + reglas escritas. **El esfuerzo de mantenimiento de la verificación misma se volvió comparable al esfuerzo del código verificado.**

### 2.5 Categorialización aspiracional → eliminada como lastre

`docs/ARQUITECTURA-CATEGORICA.md` declara una constitución 2-categórica con 5 funtores de dominio (D_KORA, D_HSC, D_HDOS, D_OpenClaw, D_GOREOS), correspondencias `Φ_Pac`, leyes de adjunción, etc. Cuatro de cinco se construyeron (`src/suite/`). El 2026-04-27 **se eliminó la 2-categoría DomOPM completa** ("retirada como lastre tras auditoría categorial"). El handoff archivado lo confirma.

Lo que la constitución aporta hoy a `src/` real: la separación Apariencia↔Entidad (E1–E13), el Writer log, replay funtorial. Lo demás eran promesas que cobraron costo de mantenimiento sin retorno equivalente.

### 2.6 Re-monolitización silenciosa

Trazabilidad cuantitativa:

- `src/main.ts`: 839 líneas (pre-corte) → 524 líneas (B-01 partir-main, 2026-04-22) → **1336 líneas hoy** (HEAD `7036012`).
- `crear-link.ts`: 919 líneas. `pass-enlaces.ts`: 796 líneas. `opl-renderer.ts`: 779 líneas. `adapter.ts`: 527.
- El patrón "prepararEstado → passes → sink" salvó algunos archivos, pero los puntos de concentración geométrica de JointJS (linkage, marcadores, routing) volvieron a inflarse.

El refactor "B" no es un estado terminal; es presión que requiere mantenimiento activo o se revierte.

### 2.7 Fixtures: de 10 → 6 → 1

`fixtures-plan-canonico.md` partía con 10 fixtures, podó a 6 ("complejidad excesiva — decisión operador 2026-04-20") y hoy queda **un único fixture canónico** (`hodom-completo.json`). Toda la inversión en `coffee-making`, `driver-rescuing`, `ev-ams`, `object-visual-audit`, `process-control-visual-audit`, `process-visual-audit`, `kora-ciclo-artefacto`, `hsc-ingesta-clinica`, `openclaw-dispatch-pipeline`, `hdos-episodio-domiciliario` cargada como pedagogía OPM canónica fue removida o consolidada. Esto es un eco directo de §2.5 (eliminación dominios) + reorientación tool-first.

### 2.8 OPCloud reverse engineering en dos lugares

`opcloud-reverse/` (corpus de producto, archivado 30+ docs) **y** `research/opcloud/` (trove reciente con findings + assets + screenshots + decompiled). Capas duplicadas: lo viejo no se cerró cuando lo nuevo apareció.

### 2.9 SSOT triplemente representada

- `ssot/` (symlinks al KB KORA, autoridad declarada).
- `docs/reglas/` (44 archivos `R-xxx` que **operacionalizan** la SSOT en clave repo-local).
- `docs/specs/modelo-json-canonico-v2.3.md` + `schemas/*.json` (formalización ejecutable).

El pin `ssot.lock` + `check:ssot` previene drift de ssot/, pero `docs/reglas/` puede driftear con la SSOT y nada lo detecta. **La SSOT se citó tanto que generó su propia ontología.**

### 2.10 Producción canónica como vía única — buen call retroactivamente

DEC-07 (2026-04-23) decretó que `opmodel.sanixai.com` es la única superficie de validación. Antes había bifurcación dev/prod. **Esto fue la mejor decisión del ciclo** porque eliminó una clase entera de incoherencias, pero llegó tarde: ya había gap entre lo que pasaba `bun run check` y lo que fallaba en prod (incidente glob 2026-04-22).

---

## 3. Qué haría diferente partiendo de 0

### 3.1 Primero un núcleo dato + render mínimo, no una constitución

Hoy: 1.300+ líneas de `ARQUITECTURA-CATEGORICA.md` antes de tener un usuario haciendo modelos. Mañana: empezaría con

```
modelo: tipos minimal (Cosa, Estado, Enlace, OPD, Apariencia)
       + serializa/hidrata + 1 fixture vivo
render: JointJS bare con 1 pass de layout dagre
ui: 1 botón "abrir fixture", canvas, panel propiedades
```

y nada más. Tres días de trabajo para tener loop completo desde fixture → render. Toda la ontología categórica se difiere hasta que aparezca presión real para preservar estructura.

**Razón:** la 2-categoría DomOPM se eliminó completa después de meses de inversión. La adjunción Apariencia↔Entidad sí valió la pena — y *se nota* porque resolvió un bug real de C-01/C-02. Lo que sí se necesita aparece como bug; lo que no, se nombra y nunca se traduce.

### 3.2 Una sola fuente normativa, no tres

Hoy: SSOT pinned + 44 reglas locales + spec JSON + ARQUITECTURA + decisiones-axiomáticas. Mañana:

- **`ssot/`** (autoridad invariante, citas con `V-xx`).
- **`docs/reglas/`** se borra; lo que necesite operacionalización vive como **comentarios JSDoc en los passes** que la enforcean. Cada pass cita su `V-xx`.
- **`schemas/*.json`** sí, pero **derivados de los tipos TS** (vía `ts-json-schema-generator` o equivalente), no escritos a mano en paralelo.
- ARQUITECTURA-CATEGORICA se vuelve un appendix corto (≤500 líneas) que sólo nombra lo que está **EJECUTADO**. Si una construcción no es `[EJECUTADO]`, no entra.

**Razón:** docs/reglas/ se construyó como *espejo* de la SSOT. Espejos drift, dañan, generan trabajo de sincronización que nadie verifica.

### 3.3 Un JointJS adapter más delgado, o sin JointJS

`crear-link.ts` con 919 líneas + `pass-enlaces.ts` con 796 + `markers.ts` con 258 = **2000 líneas para dibujar enlaces correctamente**. JointJS es flexible pero peleó tres clases de problemas:

- Marcadores OPM canónicos (triángulos estructurales, lollipops, e/c marks, flecha porDefecto) que JointJS no provee → custom markup SVG.
- Routing OPM (zigzag invocación, anclas a estados, exclusión de extremos) → conectores custom.
- Layout OPM (envelope refinable, in-zoom bandas, semi-plegado) → 9 passes propios sobre dagre.

Si arrancara hoy evaluaría seriamente:

- **Opción A (mismo costo, mejor encaje):** SVG directo + un layout solver propio. JointJS aporta `paper`, `link.appendLabel()` y poco más que no se haya custom-implementado.
- **Opción B:** mantener JointJS pero **encapsular cada decoración OPM como una primitiva nombrada** (`crear-flecha-pordefecto`, `crear-arco-xor`, `crear-triangle-agg`) en archivos ≤80 líneas y prohibir que crezcan con cada caso nuevo.

DEC-03 (DEC abierta hace 9 días) preguntaba "¿adapter alternativo (tldraw/reactflow)?". La respuesta hoy es: el adapter pattern existe (`src/render/adapter.ts`) pero **nunca se ejercitó con un segundo backend** — sin presión real, el pattern sin uso es deuda. Empezaría con SVG directo y JointJS sólo si aparece un caso (drag interactivo complejo, multi-paper) que lo justifique.

### 3.4 Validación: 1 invariante = 1 pass + 1 snapshot, no más

Hoy: 28 passes + 17 operaciones + 14 verificaciones doc-level + 55 invariantes catalogados con cobertura no mapeada. Mañana:

- Un único registro `invariantes.ts` que mapea `id → pass-fn → fixture de prueba`.
- Cada invariante nuevo añade exactamente 3 cosas: una función de pass, una entrada en el registro, un snapshot. Sin docs paralelos. La docstring del pass *es* la spec.
- `verificar-cobertura-invariantes.ts` se reduce a iterar el registro.

**Razón:** D-01 de la auditoría 2026-04-26 ya identificó que "el script verificar-invariantes-reglas.ts valida la documentación, no el código que implementa cada invariante". Es síntoma del split documento/implementación.

### 3.5 Un solo script de verificación, no quince

`bun run check` invoca 15 verificadores. Cada uno es un binario Bun que arranca, lee archivos, reporta. La latencia y el costo cognitivo (recordar qué hace cada uno) acumula. Mañana: **un solo `verify.ts`** que orquesta passes en una sola lectura de árbol + un solo runtime. Sub-5s vs sub-30s actual.

### 3.6 Persistencia: empezar en Capa 2 directo

ADR-003 propuso 3 capas (sesión, workspace, backend) + Capa 2.5 (Writer). Capa 1 (snapshot debounce) se construyó *antes* que Capa 2 (workspace). Para single-user local, Capa 1 sin Capa 2 es soledad: cada refresh trae el último modelo, sin ruta para tener varios modelos. **Empezar directo en workspace IndexedDB con `[modelo, modelo, modelo]` y hacer del "modelo activo" un puntero**, así desde el primer commit hay multimodel UX.

El Writer log (Capa 2.5) lo difería hasta tener undo/redo real demandado. Hoy se construyó *como precondición* para FEAT-01 — y se justificó. Pero tomó dos ciclos cerrar `idCreado` preservation + replay exhaustivo (DEUDA-10, DEUDA-11). **Replay funtorial bien hecho desde el primer día evita un ciclo entero de remediaciones.**

### 3.7 Fixtures: 1 canónico vivo + N "ejemplos pedagógicos" diferenciados

El plan canónico arrancó con 10 fixtures escritos a mano y terminó con 1. Lección: los fixtures pedagógicos (Dori, OnStar, café) y los fixtures de regresión (visual audits, OPDs densos) **tienen ciclos de vida distintos** y no deben mezclarse en `fixtures/ejemplos/`.

Mañana:
- `fixtures/canonico/` — 1 fixture vivo, denso, evolutivo (hodom es buen candidato).
- `fixtures/regresion/` — micro-fixtures de 1–3 cosas para snapshots de bugs específicos. Generados por DSL TS, no escritos a mano (el trigger de revisión de ADR-002 F-04 ya está disparado).
- `fixtures/pedagogia/` — opcional, archivo de ejemplos OPCloud reproducibles. No corren en `check`.

### 3.8 OPCloud research: una sola carpeta, one-shot

`opcloud-reverse/` (30+ docs de producto archivados) y `research/opcloud/` (trove reciente con assets/screenshots/scripts) son trabajo legítimo pero **dos veces consolidado en árboles distintos**. Mañana: una sola carpeta `research/opcloud/` con sub-secciones (`producto/`, `assets/`, `decompiled/`, `findings/`). Cuando un finding se traduce a una decisión del modelador, se *cita* desde el código y se cierra el frente activo de research. No hay revisita.

### 3.9 UI: framework liviano desde el día 1

ADR-002 E-04 aceptó UI vanilla TS porque "el dominio UI era estable y pequeño (3 componentes)". Hoy hay **20 archivos en `src/ui/`** sumando 5.000+ LOC de DOM imperativo. El trigger de revisión ("> 2000 líneas") se cruzó hace tiempo y el ADR no se actualizó.

Mañana: **Preact (10KB) o lit-html** desde el primer panel. La razón no es tecnología, es **tener un patrón único de wiring estado→DOM**. Hoy cada panel reinventa su propio render-on-state-change con `subscribe` + setters tipados. El patrón es bueno (inversión de control) pero es **un framework hecho a mano y mal nombrado**.

### 3.10 La persona Steipete + ciclos de letras

Esto es meta, no técnico, pero impacta el resultado:

- 13 ciclos consecutivos rotulados con letras alfabéticas hablan de **un loop muy productivo en lo táctico y muy débil en lo estratégico**: no hay momentos donde el operador se baje y pregunte "¿estoy construyendo lo que necesito?". El círculo de compensación 2026-04-26 (paquetes JJ, KK, LL, MM) fue el primer intento de bajarse del loop, y aún así produjo más ciclos.

Mañana sugiero: **no más de 3 ciclos seguidos sin un audit estratégico de 24h** que pregunte (a) ¿quién usa esto?, (b) ¿qué se eliminaría sin que nadie lo note?, (c) ¿qué dolor real cierra el siguiente ciclo? La eliminación de DomOPM 2026-04-27 fue consecuencia de un audit así — y debió pasar antes.

### 3.11 No construir para usuarios hipotéticos

Lo que hoy no se usa:
- `D_GOREOS` (diferido formalmente, pero el patrón de funtor que lo soportaba se eliminó).
- ~~Las correspondencias `Φ_Pac` HDOS↔HSC~~ (eliminadas).
- Los abanicos XOR/OR/AND **renderizados** (cubiertos por validación, render parcial, sin caso de uso real en producción).
- 6/10 de los fixtures originales.
- Buena parte de docs/reglas/ con códigos R-xxx no referenciados desde código.

Lo que sí se usa por el operador (Felix solo): editar HoDom, navegar OPDs, generar OPL, exportar JSON. **Si arrancara hoy: HoDom como caso vivo desde el commit 1.** Todo lo demás es generalización aspiracional que cobra costo de mantenimiento sin presión múltiple (la presión múltiple nunca apareció — D_GOREOS es trigger explícito que no se disparó).

### 3.12 OPL como ciudadano de primera, no como lente

La lente OPL llegó tarde (ciclo 2026-04-22) y se construyó sobre un OPL renderer ya escrito. Si OPL es 50% de la dualidad OPM, debió ser superficie principal desde el primer canvas. El patrón ideal:

- Cada operación produce **simultáneamente** un evento de modelo, una mutación de canvas, y una mutación textual de OPL.
- El "panel OPL" es la vista principal alterna del modelo, no una proyección textual de lectura.
- Edición OPL no se filtra por "subconjunto soportado"; el subconjunto **es** el editor.

---

## 4. Lo que mantendría sin cambios

Para no ser sólo crítico:

1. **Apariencia↔Entidad como adjunción explícita (C-01/C-02).** Es el invariante arquitectónico que más rinde: `claveApariencia: ${entidad}:${id}::${opd}`, layouts separados, cascada de eliminación. Esto vale lo que cuesta.
2. **JSON canónico v2.3 con dos perfiles + AJV + round-trip.** Gran movimiento. La separación canon/import resuelve el problema clásico "¿qué validamos al exportar vs al importar?".
3. **Producción como única superficie (DEC-07).** Mata una clase entera de incoherencias; debería ser política desde el día 1 en cualquier proyecto similar.
4. **Snapshot tests + pre-commit hook.** El gate de regresión funciona y atrapa cosas reales.
5. **Bun como runtime único.** No hay Python ni Node mezclado; un solo intérprete para todo.
6. **`scripts/verificar-imports.ts` con reglas cross-capa.** Pequeño, cierra una clase concreta de errores estructurales (jointjs fuera de render/jointjs/, dagre fuera de layout/).

---

## 5. La forma del repo si arrancara hoy

Concreto, ejecutable:

```
opm-model-app/
├── src/
│   ├── modelo/         # tipos + serializa + aplicador + writer log
│   ├── validacion/     # 1 archivo registro + N passes + tests inline
│   ├── render/         # SVG directo o JointJS encapsulado <80LOC por archivo
│   ├── opl/            # forward + backward + parser bidireccional
│   ├── ui/             # Preact + 1 componente por entidad
│   └── persistencia/   # workspace IndexedDB desde commit 1
├── ssot/               # symlinks (única autoridad ontológica)
├── fixtures/
│   ├── canonico/       # 1 fixture denso vivo
│   └── regresion/      # micro-fixtures DSL-generados
├── tests/
│   ├── snapshots/
│   ├── invariantes.ts  # 1 archivo: registry → pass → fixture
│   └── e2e/
├── schemas/            # generados desde tipos TS, no escritos a mano
├── verify.ts           # un binario, no quince
└── docs/
    ├── README.md
    ├── ARQUITECTURA.md (≤500 líneas, sólo [EJECUTADO])
    └── decisiones/     # ADRs cortos, fechados
```

**Sin** `docs/reglas/` (44 archivos), **sin** `src/suite/`, **sin** `correspondencias/`, **sin** `D_xxx`, **sin** Python intermedio, **sin** dual research/opcloud + opcloud-reverse, **sin** vanilla DOM con framework hecho a mano.

Tamaño esperado: **~10.000 LOC TS** vs los 39.000 actuales. Mismo modelador, sin la suite categorial aspiracional ni la verificación duplicada.

---

## 6. Lección estratégica única

Si tuviera que destilar todo a una frase:

> **El repo persiguió rigor como sustituto de presión real**. Cuando no hay usuario que reclame, el rigor categórico, la triple verificación normativa y el ciclo cerrado de auditorías llenan el vacío. Pero el rigor sin presión es inversión sin retorno: el 60% del LOC actual no resolvió ningún problema observado y fue construido para problemas hipotéticos que nunca aparecieron.

Lo que la app hace bien hoy, lo hace porque resolvió bugs concretos (Apariencia↔Entidad, glob literal, replay con idCreado, prod-smoke). Lo que la app construye y luego elimina (DomOPM, 9 fixtures, correspondencias Φ_Pac) lo construyó porque **una constitución pidió que existiera, no porque alguien lo necesitara**.

La regla operativa más útil que sacaría de este proyecto para el siguiente:

> **"Presión múltiple antes de generalizar"** ya está en el CLAUDE.md ("esperar ≥2 dominios pidan tocar el kernel"). La regla complementaria que falta: **"Presión observada antes de instanciar"** — no construir el primer dominio, ni el primer profile, ni el primer funtor de correspondencia, hasta que un caso de uso real (no aspiracional) lo demande. Si esa regla hubiera estado vigente desde el día 1, este repo tendría 10.000 LOC, 1 fixture, 5 paneles, y haría exactamente lo que hace hoy en producción.

— *Claude, post-revisión exhaustiva, 2026-04-28.*