# UX ad-hoc de la capa categorial (Fs) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Pasos checkbox. Una capacidad por sesión (no las tres de una tanda).

**Goal:** Dar superficie de UX op-forja a cada kernel de los Fs que aún no la tiene. **Linealidad ya tiene UX completa** (toggle en Inspector `fea7ae7` + diagnóstico `21889b5`) — sirve de plantilla validada. Faltan: **Razonamiento (F3), Equivalencia (F2), Composición (F1)**.

**Patrón op-forja validado (úsalo idéntico):** `store action → contrato → port → viewmodel → CommandPalette / Inspector → (diagnóstico)`. Gobernanza: `cd app && bun run design:governance` (sin hex; usar primitivas Codex `CodexInspect*`). Gate: `bun run check` + design:governance + e2e afectado (apagar dev server antes de `browser:smoke`; `PW_PORT` libre).

**No tocar:** simulación (dominio de otro agente); testids de e2e existentes; firmas de `construirAccionesMenuCommandPalette`. Añadir, no modificar.

---

## Capacidad 1 — Razonamiento (F3) · consultas en Cmd+K  [recomendada primero: aditiva, bajo riesgo]

**Kernel listo:** `modelo/razonamiento::derivar(modelo, consulta)` (consultas `afectan-a` / `requerido-por` / `impacto-de-eliminar`), todo `inferido:true`.

**Superficie:** 3 comandos contextuales en CommandPalette (sección nueva `RAZONAR`), habilitados cuando hay entidad seleccionada:
- "¿Qué afecta a esta cosa?" → `derivar({tipo:"afectan-a", entidadId: seleccionId})`
- "¿Qué requiere este proceso?" → `derivar({tipo:"requerido-por", procesoId: seleccionId})` (solo si la selección es proceso)
- "Impacto de eliminar esta cosa" → `derivar({tipo:"impacto-de-eliminar", elementoId: seleccionId})`

**Resultado (elige una, mínimo riesgo primero):** resaltar el subgrafo derivado en canvas vía `idsResaltadosTemporales` (patrón existente) **y/o** toast con el conteo (`set({ mensaje: "N procesos afectan a X" })`). Distinguir visualmente "inferido" (no es hecho declarado).

**Cableado (receta validada en linealidad):**
- [ ] `store/modelo/acciones-capacidades.ts`: acción `consultarRazonamiento(consulta)` que llama `derivar` y hace `set({ idsResaltadosTemporales, mensaje })`. Puro respecto al modelo (derivar no muta).
- [ ] `store/tipos.ts` + `store/modelo/contrato.ts`: registrar la acción.
- [ ] `app/ports/zustandCommandPalettePort.ts` + `viewmodels/commandPaletteViewModel.ts`: exponer.
- [ ] `ui/CommandPalette.tsx`: 3 ítems en `construirAccionesMenuCommandPalette` + sección `RAZONAR` en `seccionesPorAccionMenu` + deps (`haySeleccion`, `seleccionEsProceso`).
- [ ] Tests: `CommandPalette.test.ts` (los ítems aparecen con selección) + e2e en `12-command-palette.spec.ts` (ejecutar una consulta y verificar resaltado/toast).
- [ ] Gate: check + design:governance + e2e.

---

## Capacidad 2 — Equivalencia (F2) · declarar y verificar realizaciones alternativas

**Kernel listo:** `modelo/equivalencia::verificarEquivalencia(modelo, {padreId, opdA, opdB})` (firma de frontera; devuelve `{equivalente, diferencias?}`).

**Superficie (op-forja):** dos OPDs hermanos del mismo padre se comparan como realizaciones alternativas.
- Comando Cmd+K "Comparar realizaciones del proceso…" (selección = proceso descompuesto con ≥2 hijos) → abre `DialogoEquivalencia` que lista los OPD hijos, deja elegir A y B, y muestra el veredicto (`equivalente` / lista de `diferencias`).
- Resultado al `PanelMetodologia` como aviso si NO equivalentes (reusar el patrón de aviso navegable).

**Cableado:** igual que linealidad/ontología (comando-con-diálogo: `abrirDialogoEquivalencia` en acciones-capacidades + `DialogoEquivalencia.tsx` montado en AppShell + `verificarEquivalencia` invocado al elegir A/B). Tests: unit del viewmodel + e2e del diálogo. Líneas rojas: patrón `Dialogo` existente (testid propio).

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
