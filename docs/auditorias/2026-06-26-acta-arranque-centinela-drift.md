# Acta — decisiones de arranque del corte UI «Centinela de Drift» (Anclaje α)

**Fecha:** 2026-06-26 · **Tipo:** consenso deliberativo (skill `consenso-deliberativo` v1.0.1) · **Modo:** orquestación (3 subagentes reales, independencia epistémica en la fase `proponer`; `criticar/sintetizar/refutar/declarar` orquestadas).
**Panel:** steipete + `mente-omega` (architecture-over-implementation / ship-beats-perfect) · allan-kelly + `mente-omega` (valor validado sobre throughput) · steve-jobs (gusto / sustracción).
**Encargo:** ratificar el plan de arranque (spec `docs/superpowers/specs/2026-06-26-corte-centinela-drift-ui-design.md`) antes de que steipete-implementador toque código, según el protocolo del operador: comité resuelve dudas → steipete implementa → reconvocar ante nueva duda, iterativo.
**Resultado:** **CONSENSO** (1 ciclo; el disenso D-B/D-C se resolvió por distinción de planos, no por promedio).

---

## Decisiones declaradas

### D-A — H1 (`driftMap` como parámetro posicional): RATIFICADO
Los tres ratifican/pasan. `driftMap` entra como 9º parámetro posicional de `proyectarModeloAJointCells` con default `= null`, espejo real de `simulacion` (no campo de `OpcionesProyeccion`). El default confina el blast radius a `JointCanvas.tsx:445`; `mapaExport.ts:138` y los ~70 call sites de test quedan intactos. Sin reparo de valor (allan), sin pelea de gusto (jobs), punto fijo del refactor (steipete).

### D-B — el eval-de-mecanismo del fixture de gist: SE FUNDE EN FASE 1 (no Fase 0 separada, no cuarta amarra)
Disenso de entrada: steipete (disolver en Fase 1) · allan (Fase 0 bloqueante antes de la UI) · jobs (cuarta amarra al cierre, solo el caso Calco-adversarial). **Síntesis resuelta:**

- El eval-de-mecanismo (ley falsable en `app/src/leyes/` sobre el fixture de gist: composabilidad por objeto común del anclaje · **gate duro donde el Calco DEBE fallar** · herencia sensible a mutación, cada una con su mutante que enrojece) **se funde en la Fase 1** como **test-first del resolutor de hash vivo** (`cargarYEvaluarDrift`), porque **ambos consumen el mismo fixture y prueban el mismo eslabón nuevo**. La ley roja precede al resolutor (TDD honesto, steipete).
- Esto preserva la **sustancia** de allan (el eval va **antes** de la UI cara y es **bloqueante**: Fase 1 no cierra sin esa ley verde) cediendo solo el **nombre** «Fase 0 separada» (innecesario: Fase 1 ya es lo primero y ya bloquea la UI).
- Disuelve el miedo de jobs (no es **ceremonia que re-prueba el kernel verde**: prueba el **resolutor**, que no existe, + la composabilidad sobre el fixture, no cubierta por el kernel) cediendo su preferencia de «al cierre». Se **adopta** de jobs: el **caso Calco-adversarial es la aserción central** (una cosa Calcada nunca produce marca; una Anclada a biblioteca mutada sí), y la vigilancia contra inflar el eval.
- **NO sustituye la amarra 2** (HODOM real anclado a gist real, mutación persistida): el eval-de-mecanismo gobierna **CONSTRUIR** (¿la composabilidad es real?); la amarra 2 gobierna **ESCALAR / no-muerte** (¿le ahorra dolor a Félix?). Un mecanismo verde con cero dolor ahorrado **igual muere** (allan + jobs coinciden).

### D-C — punto de corte seguro: distinguir reversibilidad-técnica de hito-de-valor
- **Fin de Fase 1** es un **punto de commit reversible** (verde, aditivo, sin deuda — steipete tiene razón), **pero NO un hito de valor**: el `driftMap` es invisible (jobs: «media plomería»; allan: «capacidad, no outcome»).
- El **primer hito de valor** —el «corte» en sentido de Jobs— es **Fase 1 + Fase 2 («el aviso aparece»)**. El Inspector (Fase 3) es la segunda unidad (actuar); el aviso ya vale sin ella.
- **Honestidad de reporte (allan, vinculante):** el HANDOFF nombra el fin de Fase 1 como **capacidad**, nunca como valor entregado. **No se despliega** algo invisible: el deploy es tras el corte de valor + amarras.

## Refuerzos adoptados (de los tres)
1. **Copiar el fixture al árbol de pruebas de opforja** (test hermético, no leer cross-repo desde `gist-opm/`), con **comment de procedencia** (commit-hash de origen en gist-opm) — steipete.
2. **Sellar en test que el drift se mide contra el backend persistido**, no contra ediciones no-commiteadas de otra pestaña — steipete.
3. **Registrar el veredicto de la amarra 2 como acta fechada en `docs/auditorias/`** (vive/muere + por qué), no en memoria volátil — allan. Sin eso, la condición de no-muerte es decorativa.
4. **El glifo `no-resuelto`**: como no pide acción del curador (pide que vuelva la red), su lugar natural puede ser **solo el Inspector, no el lienzo**; el `?` se revisa en `design:governance` (un glifo que necesita tooltip para significar, no significa) — jobs, a confirmar.

## Refutación adversarial (orquestada)
Objeción más fuerte a la síntesis (jobs puro): «fundir el eval en Fase 1 es ceremonia que retrasa el aviso». **Sobrevive:** el resolutor de hash vivo (Fase 1) es **prerequisito del aviso de todos modos** (el marcador lee el `driftMap` que el resolutor produce); el eval del fixture es su **test-first**, no trabajo extra — no añade retraso, es el TDD del eslabón que igual hay que construir. Sin disenso irreductible.

## Confianza por experto (no promediada)
- **steipete: alta.** La síntesis es su posición casi literal (eval en Fase 1, ley-primero).
- **allan-kelly: alta.** Gana la sustancia (eval antes de UI, bloqueante, 3 aserciones, mecanismo≠adopción, acta fechada); cede el nombre «Fase 0».
- **steve-jobs: media-alta.** Gana no-ceremonia + Calco-adversarial central + corte=aviso-visible + matiz `no-resuelto`; cede su preferencia de «al cierre» ante el argumento de que es TDD del eslabón nuevo, no re-prueba del kernel.

## Metadatos
- Objeciones críticas resueltas: 1 (cuándo/dónde del eval-de-mecanismo → fundido en Fase 1 por identidad de fixture+eslabón).
- No requirió árbitro HITL: el disenso se resolvió por distinción de planos (reversibilidad-técnica vs hito-de-valor; mecanismo vs adopción), no por promedio.
- Próximo: steipete-implementador ejecuta Fase 1 (ley falsable roja → resolutor → tests → `bun run check`). Ante duda de criterio, **para y reporta** para reconvocar el comité.
