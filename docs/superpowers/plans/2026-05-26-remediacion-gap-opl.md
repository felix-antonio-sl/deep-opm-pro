# Remediación del gap OPL — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development o superpowers:executing-plans. Pasos con checkbox (`- [ ]`).

**Goal:** Cerrar los GAPs accionables código↔canon detectados en la auditoría de alineación, alineando la generación/parseo OPL de OPFORJA con `spec-forja-opl.md`.

**Architecture:** Tres olas por blast-radius creciente — (1) 6 bugs de canon en `generadores/` vía TDD; (2) 8 ajustes de redacción en la spec (sin código); (3) fixtures roundtrip con backend ya verificado. Features y parsers ausentes quedan como backlog (no en este plan). Cada cambio de generación actualiza sus tests dorados en el mismo commit.

**Tech Stack:** TypeScript, Bun test (`cd app && bun run check` = typecheck + unit). Gate por tarea: `cd app && bun test <archivo>` focal + `bun run check` antes de commit.

**Fuentes:** auditoría `docs/auditorias/2026-05-26-alineacion-opl/{README.md,auditoria-profunda.md}`; canon `docs/canon-opm/spec-forja-opl.md`.

**Precondición:** `app/src/opl/` limpio (verificar `git status -s app/src/opl/`). Commits aislados; NUNCA `git add -A` (el operador co-implementa en `main`).

---

## Ola 1 — Bugs de canon (TDD, `generadores/`)

Cada tarea: test rojo que exige la conducta canónica → fix mínimo → verde → commit. Actualizar snapshots existentes en el mismo commit.

### Task 1.1 — GAP-PLACEHOLDER-ENTIDAD: cablear supresión de placeholder

**Files:** Modify `app/src/opl/generadores/refsHints.ts:203-206`; Test `app/src/opl/generadores/refsHints.test.ts`.

- [ ] **Step 1 — test rojo**: en `refsHints.test.ts`, test: `entidadOplEsEmitible({tipo:'proceso', nombre:'Proceso'})` (placeholder) → `false`; entidad con nombre canónico → `true`. Importar `esNombreProcesoPlaceholder` para construir el caso.
- [ ] **Step 2 — correr**: `cd app && bun test src/opl/generadores/refsHints.test.ts` → FALLA (hoy retorna `true` siempre).
- [ ] **Step 3 — fix**: en `refsHints.ts`, importar `esNombreProcesoPlaceholder` de `../../modelo/nombresCanonicos` y reemplazar el cuerpo por: para `entidad.tipo === 'proceso'`, `return !esNombreProcesoPlaceholder(entidad.nombre)`; para objeto/estado, retornar `true` salvo predicado de placeholder análogo si existe.
- [ ] **Step 4 — verde**: `bun test src/opl/generadores/refsHints.test.ts` PASA. Luego `bun run check` (revisar si `generar.test.ts` cambia conteos por modelos con placeholders → actualizar).
- [ ] **Step 5 — commit**: `git add app/src/opl/generadores/refsHints.ts app/src/opl/generadores/refsHints.test.ts && git commit -m "fix(opl): suprime entidades placeholder en OPL (GAP-PLACEHOLDER-ENTIDAD)"`.

### Task 1.2 — GAP-EVENTO-RESULTADO + GAP-EVENTO-INVOCACION: evento solo INPUT

**Files:** Modify `app/src/opl/generadores/procedural.ts:262-287` (`oracionEvento`); Test `app/src/opl/generadores/procedural.test.ts`.

- [ ] **Step 1 — test rojo**: en `procedural.test.ts`, tests: un enlace `resultado` con `modificador:'evento'` → la oración NO contiene `inicia ${origen}` (degrada a oración base de resultado `${origen} genera ${destino}`); un enlace `invocacion` con `modificador:'evento'` → NO contiene `inicia e invoca` (degrada a `${origen} invoca ${destino}`).
- [ ] **Step 2 — correr**: `bun test src/opl/generadores/procedural.test.ts` → FALLA.
- [ ] **Step 3 — fix**: en `oracionEvento` (`procedural.ts`), `case "resultado"` y `case "invocacion"`: `return oracionEnlaceSinModificador(modelo, enlace);` (degradar a base). Eliminar las ramas `if (estado)` muertas en `resultado`.
- [ ] **Step 4 — verde**: `bun test src/opl/generadores/procedural.test.ts` PASA; actualizar cualquier snapshot de evento-resultado/invocación. `bun run check`.
- [ ] **Step 5 — commit**: `git add app/src/opl/generadores/procedural.ts app/src/opl/generadores/procedural.test.ts && git commit -m "fix(opl): evento solo sobre INPUT; degrada resultado/invocación (GAP-EVENTO-RESULTADO, GAP-EVENTO-INVOCACION)"`.

### Task 1.3 — GAP-CONDICION-RESULTADO + GAP-CONDICION-INVOCACION + GAP-FAN-RESULTADO-COND: erradicar `puede generarse`

**Files:** Modify `app/src/opl/generadores/procedural.ts:313-324` (`oracionCondicion`), `app/src/opl/generadores/abanico.ts:176` (`oracionAbanicoCondicional`); Tests `procedural.test.ts`, `abanico.test.ts`.

- [ ] **Step 1 — test rojo**: tests: enlace `resultado`+`condicion` → oración NO contiene `puede generarse` (degrada a base de resultado); enlace `invocacion`+`condicion` → NO contiene `si ${origen} ocurre` (degrada a invocación base); abanico de salida condicional → NO contiene `puede generarse`.
- [ ] **Step 2 — correr**: `bun test src/opl/generadores/procedural.test.ts src/opl/generadores/abanico.test.ts` → FALLA.
- [ ] **Step 3 — fix**: en `oracionCondicion`, `case "resultado"` y `case "invocacion"` → `return oracionEnlaceSinModificador(modelo, enlace);`. En `abanico.ts·oracionAbanicoCondicional`, rama de salida (`puertoEsOrigen` resultado): degradar a la forma de fan base sin `puede generarse`. Eliminar ramas `estado` muertas en `resultado`.
- [ ] **Step 4 — verde**: ambos tests PASAN; `bun run check`; verificar `parser.condicionesExcepciones.test.ts` no dependía de `puede generarse`.
- [ ] **Step 5 — commit**: `git add app/src/opl/generadores/procedural.ts app/src/opl/generadores/abanico.ts app/src/opl/generadores/procedural.test.ts app/src/opl/generadores/abanico.test.ts && git commit -m "fix(opl): erradica 'puede generarse'; condición solo INPUT (GAP-CONDICION-RESULTADO, GAP-CONDICION-INVOCACION, GAP-FAN-RESULTADO-COND)"`.

### Task 1.4 — GAP-INVOCACION-TILDE: `después de`

**Files:** Modify `app/src/opl/generadores/procedural.ts:187,205`; Test `procedural.test.ts`; verificar normalización en `app/src/opl/parser/parsear.ts`.

- [ ] **Step 1 — verificar parser**: `rg -n 'despu[eé]s de|normaliz' app/src/opl/parser/parsear.ts`. Confirmar que el parser acepta `después de` y, si hay modelos legacy con `despues de`, que se normaliza (§18). Si el parser solo aceptaba `despues de`, ampliar la regex a ambas grafías ANTES del paso 3.
- [ ] **Step 2 — test rojo**: en `procedural.test.ts`, test: invocación con `demora` → oración contiene `después de` (con tilde); autoinvocación idem.
- [ ] **Step 3 — correr**: `bun test src/opl/generadores/procedural.test.ts` → FALLA.
- [ ] **Step 4 — fix**: en `procedural.ts:187` y `:205`, `despues de` → `después de`.
- [ ] **Step 5 — verde**: test PASA; `bun run check`; si tocaste la regex del parser, correr `roundtrip.test.ts`.
- [ ] **Step 6 — commit**: `git add app/src/opl/generadores/procedural.ts app/src/opl/generadores/procedural.test.ts [app/src/opl/parser/parsear.ts] && git commit -m "fix(opl): 'después de' con tilde en invocación (GAP-INVOCACION-TILDE)"`.

### Task 1.5 — GAP-PROB-SUPERFICIE: `Pr=p` canónico (DECIDIDO: solo canónico)

Decisión del operador (2026-05-26): **solo canónico**; se retira `(probabilidad: %)`.

**Files:** Modify `app/src/opl/generadores/procedural.ts:421-422` (`sufijoProbabilidad`) + `app/src/opl/generadores/abanico.ts`; Tests `procedural.test.ts`, `abanico.test.ts`.

- [ ] **Step 1 — test rojo**: fan XOR probabilístico → cada rama emite `Pr=p` (p la probabilidad); la oración NO contiene `(probabilidad:`.
- [ ] **Step 2 — correr**: `bun test src/opl/generadores/procedural.test.ts src/opl/generadores/abanico.test.ts` → FALLA.
- [ ] **Step 3 — fix**: `sufijoProbabilidad` emite `Pr=p` por rama en fan XOR; suprimir `(probabilidad: %)`. Espejo en `abanico.ts`.
- [ ] **Step 4 — verde**: tests PASAN; `bun run check`; confirmar que el parser reconoce `Pr=p` (roundtrip).
- [ ] **Step 5 — commit**: `git add app/src/opl/generadores/procedural.ts app/src/opl/generadores/abanico.ts app/src/opl/generadores/procedural.test.ts app/src/opl/generadores/abanico.test.ts && git commit -m "fix(opl): probabilidad canónica Pr=p en fan XOR (GAP-PROB-SUPERFICIE)"`.

---

## Ola 2 — Ajustes de redacción en la spec (sin código)

### Task 2.1 — Aplicar los 8 ajustes `relajar/ajustar-spec`

**Files:** Modify `docs/canon-opm/spec-forja-opl.md`.

- [ ] **Step 1**: aplicar las ediciones de la tabla §3 de `auditoria-profunda.md`:
  - §5.3: nota de realización concreta de unidades de tiempo (GAP-EXC-UNIDADES-LITERAL).
  - §8.3.1/§8.3.2: colisión de rol/precedencia viven en kernel, sin generador OPL (GAP-COL-RESOLUCION).
  - §9.3: guard de no-coordinación en refinamiento = por construcción / no-aplicable hasta capa de composición (GAP-COMP-GUARDA).
  - §7.2: entrada a `emitirDespliegueOcurren`.
  - §6.3: entrada a `emitirEspecializacion` como emisor del hecho `es un`.
  - §2.5/§5: entrada a formateadores inline de duración o marca no normativa.
  - §12–§13: entrada a la mecánica de colapso de bloques como display.
  - §14: el handler click→foco vive en UI, fuera de la capa OPL.
- [ ] **Step 2 — gate KORA**: `rg -n 'idealmente|sería bueno' docs/canon-opm/spec-forja-opl.md` = 0; estilo RFC 2119 intacto.
- [ ] **Step 3 — actualizar §20**: marcar como `alineado`/`cerrado` las filas correspondientes en la tabla de trazabilidad; reclasificar GAP-XOR a backlog-feature (ver auditoría §2).
- [ ] **Step 4 — commit**: `git add docs/canon-opm/spec-forja-opl.md && git commit -m "docs(spec-forja): ajustes de redacción de alineación (8 GAP relajar-spec) + reclasifica GAP-XOR"`.

---

## Ola 3 — Fixtures roundtrip (backend ya verificado)

### Task 3.1 — Fixtures con generador+parser existentes

**Files:** Modify `app/src/opl/fixtures-roundtrip.ts`; Test `app/src/opl/roundtrip.test.ts`.

- [ ] **Step 1 — añadir fixtures** (uno por familia ya cubierta por gen+parser): efecto básico (`afecta`), cambio de estado TS3 (`cambia O de \`s1\` a \`s2\``), TS4 (`cambia O de \`s\``, parser CS3 confirmado), TS5 (`cambia O a \`s\``, parser CS4 confirmado), habilitador con estado (HS1/HS2), exhibición (`exhibe`), clasificación (`es una instancia de`). Evento canónico e invocación: añadir SOLO tras Ola 1 (texto estabilizado).
- [ ] **Step 2 — correr**: `cd app && bun test src/opl/roundtrip.test.ts`. Cada fixture debe roundtripear; si alguno falla bisimetría, marcar `bisimetricaEstricta:false` y abrir GAP de parser (no forzar).
- [ ] **Step 3 — `bun run check`**.
- [ ] **Step 4 — commit**: `git add app/src/opl/fixtures-roundtrip.ts && git commit -m "test(opl): fixtures roundtrip de familias con backend verificado (GAP-FIXTURE-*)"`.

---

## Cierre

- [ ] **Gate final**: `cd app && bun run check` verde; `bun run lint`; si tocó proyección visual, `bun run design:governance` (no aplica aquí, es OPL puro).
- [ ] **Actualizar §20** de la spec: filas de bugs Ola 1 → `alineado`.
- [ ] **Actualizar HANDOFF** y memoria: gap OPL remediado (olas 1-3); backlog restante (features/parsers) documentado en `auditoria-profunda.md §4`.
- [ ] **No incluido**: features (GAP-VARIA/TIPO/REFINA/PLIEGA/RECOMPONE/FAN-EVENTO/FAN-M/COMPOSICION/XOR), parsers ausentes (TAG/SSE/CX/XOR/COMP-REVERSE/ABANICO-AGENTE), y sus fixtures — backlog de cortes posteriores.

## Resumen de cobertura

- **Ola 1**: 7 bugs de canon (Task 1.1–1.5; GAP-PROB-SUPERFICIE decidido solo-canónico).
- **Ola 2**: 8 ajustes de spec + reclasificación GAP-XOR.
- **Ola 3**: ~7 fixtures (incluye TS4/TS5 ahora confirmados).
- **Diferido**: ~17 features/parsers (auditoría §4).
