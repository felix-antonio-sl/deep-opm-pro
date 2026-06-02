# UX ad-hoc de la capa categorial (Fs) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Pasos checkbox. Una capacidad por sesión (no las tres de una tanda).

**Goal:** Dar superficie de UX op-forja a cada kernel de los Fs que aún no la tiene. **Linealidad ya tiene UX completa** (toggle en Inspector `fea7ae7` + diagnóstico `21889b5`) — sirve de plantilla validada. Faltan: **Razonamiento (F3), Equivalencia (F2), Composición (F1)**.

**Patrón op-forja validado (úsalo idéntico):** `store action → contrato → port → viewmodel → CommandPalette / Inspector → (diagnóstico)`. Gobernanza: `cd app && bun run design:governance` (sin hex; usar primitivas Codex `CodexInspect*`). Gate: `bun run check` + design:governance + e2e afectado (apagar dev server antes de `browser:smoke`; `PW_PORT` libre).

**No tocar:** simulación (dominio de otro agente); testids de e2e existentes; firmas de `construirAccionesMenuCommandPalette`. Añadir, no modificar.

---

## Capacidad 1 — Razonamiento (F3) · consultas derivadas  ✅ HECHA (commit d1c1edd)

**Entregada por una ruta MEJOR que la planeada.** En vez de editar `CommandPalette.tsx`
(que estaba en WIP del operador con el feature export-SVG-ZIP), se modelaron las 3
consultas como **acciones contextuales** (`store/acciones-contextuales.ts`). El catálogo
de acciones es una sola estructura (IFML §7.3) que se proyecta a 3 superficies: barra
flotante, menú contextual y command palette. Al registrar el hecho ahí, aparece en menú
contextual + Cmd+K **sin tocar el render** → cero colisión con el WIP, y semánticamente
más limpio. Lección para Capacidad 2 y 3: usar también acción contextual para el comando
de apertura del diálogo, evitando `CommandPalette.tsx`.

**Corrección del plan (Ψ):** `idsResaltadosTemporales` NO existía. La proyección correcta
del subgrafo derivado es la **selección múltiple** (`estadoSeleccionDesdeIds` / `setSeleccion`):
el halo de selección del canvas YA es el resaltado.

**Lo implementado:**
- `store/modelo/acciones-capacidades.ts::consultarRazonamiento(consulta)`: afectan-a /
  requerido-por → seleccionan el subgrafo de COSAS + toast con conteo; impacto-de-eliminar
  → toast-advertencia (sus resultados son enlaces, que no encajan en multiselección singular).
- `acciones-contextuales.ts`: `razonar-afectan-a` (objeto), `razonar-requerido-por` (proceso),
  `razonar-impacto-eliminar` (cualquier cosa); categoría `navegacion`; superficies
  `["menu-contextual","command-palette"]` (fuera de la barra: son exploración, no manipulación).
- `ejecutarAccionContextual.ts` + `contextualActionExecutionPort` (+ wiring zustand): dispatch
  con validación de tipo de selección.
- `MenuContextualEntidad.tsx`: grupo propio `"razonamiento"` con separador + orden.
- TDD: `razonamiento-ux.test.ts` (4), `acciones-contextuales.test.ts` (+4), `ejecutarAccionContextual.test.ts` (+3).
- Gate: 1862 unit pass, typecheck limpio, design:governance OK.
- [ ] **Pendiente menor (reconciliación):** e2e — añadir a `12-*.spec.ts` cuando el WIP de
  Felix en ese spec esté commiteado (no tocar su archivo en vuelo).

---

## Capacidad 2 — Equivalencia (F2)  ✅ HECHA (commit 14af2d2)

**Replanteada por reachability (Ψ).** El plan original ("comparar realizaciones
hermanas en un diálogo") NO era reachable: opforja no permite autorear dos
descomposiciones de un mismo proceso → el diálogo no tendría qué comparar. La
aplicación reachable del MISMO kernel es la **ley in-zoom ↔ out-zoom**: la
descomposición de un proceso debe ser frontera-equivalente al proceso abstracto.
Esto existe para todo proceso descompuesto y detecta errores reales de modelado.

**Verificación empírica (en vez de asumir):** `descomponerProceso` siembra los
enlaces de contorno → el inzoom recién creado es coherente → cero falsos positivos.

**Lo implementado:**
- `equivalencia/preservacion.ts::observarPreservacionFrontera(modelo)`: por proceso
  descompuesto, `verificarEquivalencia(opdPadre, opdHijo)`; devuelve solo las
  incoherentes (`{procesoId, opdAbstractoId, opdDescomposicionId, diferencias}`).
- Checker `DESCOMPOSICION_NO_PRESERVA_FRONTERA` (navegable, severidad `mejora`) en
  `PanelMetodologia` — pasivo, surge solo si el modelador rompe la frontera del hijo.
- Acción contextual `verificar-coherencia-descomposicion` (proceso con inzoom) →
  toast con veredicto; menú contextual + Cmd+K, grupo `razonamiento`.
- TDD: 9 tests (helper, checker, acción de store, visibilidad, dispatch).
- Gate: 1882 unit pass, typecheck limpio, design:governance OK.

**Nota:** "realizaciones alternativas" (autoría de variantes + diálogo comparador)
queda como épica futura aparte; requiere un cambio de modelo de datos (lista de
realizaciones por proceso), no es "UX ad-hoc" de un kernel ya hecho.

---

## Capacidad 3 — Composición (F1) · componer con otro modelo por interfaz

**Kernel listo:** `modelo/composicion::componerModelos(a, b, compartidas)` (pushout; ya corregido en `3515f5f`).

**Superficie:** reusar el patrón de **submodelos LF-04** (`DialogoSubmodelo` ya selecciona un modelo del catálogo).
- Comando Cmd+K "Componer con modelo…" → diálogo de catálogo (como LF-04) para elegir B + mapeo de interfaz (`compartidas`: auto-match por nombre/identidad + ajuste manual) → `componerModelos` → materializar el compuesto.
- Render: cosas compartidas transparentes (el pendiente ya anotado en HANDOFF LF-04).

**Cableado:** comando-con-diálogo (mayor esfuerzo: el mapeo de interfaz es UI nueva). Reusar `materializacion`/`compartidas` de submodelos. Tests + e2e. **Es la más compleja — hacerla al final.**

---

## Orden recomendado y criterio

1. **Razonamiento** (aditiva, bajo riesgo) → 2. **Equivalencia** (diálogo medio) → 3. **Composición** (diálogo + mapeo, alta).
Cada una: una sesión, TDD/tests reales (no tautológicos), gate + design:governance + e2e, commit aislado (`git add` específico; working tree de Felix activo). No tocar simulación.

## Self-review
- Plantilla validada: la UX de Linealidad (toggle + diagnóstico) ya recorrió este patrón con gate + governance verdes; las 3 restantes lo replican.
- Riesgo decreciente si se sigue el orden (aditivo → diálogo simple → diálogo con mapeo).
