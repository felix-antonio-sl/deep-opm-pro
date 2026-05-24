# Prompt de asignación — Ronda Codex v1

Plantilla genérica + invocaciones concretas para rutear cada línea a un agente
independiente (worktree propio). Las líneas L2/L3/L4/L5 corren en paralelo tras
el merge de L1.

---

## Plantilla genérica

```
Trabajas en el repo /home/felix/projects/deep-opm-pro (modelador OPM, Preact +
Zustand + JointJS). Ejecutas la línea {{LINEA}} de la "Ronda Codex v1": cierre de
cumplimiento de la spec de diseño ui-forja/ v1.0.

Lee EN ORDEN antes de tocar código:
1. docs/instrucciones-lineas-dev/ronda-codex-v1/README.md (reglas duras §2,
   tabla de colisiones §5, orden de merge §6).
2. docs/instrucciones-lineas-dev/ronda-codex-v1/{{PATH_BRIEF}} (tu brief).
3. Los docs de ui-forja/ que tu brief cita.

Reglas duras no negociables (del README §2):
- Solo chrome/tokens/attrs visuales. NO tocar store, modelo, proyección semántica,
  opcloudRouting, anchors, multiplicidad, parser/generador OPL (salvo lectura),
  persistencia, leyes, ViewModels de datos. Si crees necesitarlo, CRUZASTE a
  lógica → detente y reporta.
- Tokens solo desde app/src/ui/tokens.ts (lectura); glifos desde
  app/src/ui/codex/glifos.ts (import, no redefinir). Cero hex/fuente hard-coded.
- Canon V-63/V-203; crimson es canal UI exclusivo, nunca semántica OPM.
- NO reincorporar Mapa del sistema ni Biblioteca dock (pausados).
- testIds y roles ARIA INMUTABLES; solo cambia la piel.
- Scope estricto a los archivos de la sección 4 de tu brief. Cero edición fuera
  de tu dominio (ver tabla de colisiones §5).
- Cada decisión visual cita ui-forja/<doc>§<n>; cada decisión semántica cita la
  SSOT (/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/).
- Revisa opm-extracted/ (INDEX.md, MODULES.md, el módulo que cita tu brief §3)
  antes de crear de novo; declara qué evidencia reutilizaste.

Loop verde obligatorio antes de cerrar (desde app/):
  bun run check    # typecheck + unit — GATE
  bun run lint
  + los e2e que tu brief lista en §7/§8 (dev server apagado).

Entregable:
- Worktree/rama propia (ver §11 de tu brief).
- Commits con el prefijo de tu brief (style(ui)/style(render)/feat(ui)) y
  co-author footer del operador.
- Reporte final: hashes de commit, resultado del loop verde (conteos de tests),
  decisiones tomadas (§10), y cualquier bloqueo encontrado.
- NO tocar docs/HANDOFF.md ni docs/historias-usuario-v2/.
```

---

## Invocaciones concretas

### L1 — OPL canónico (Ola A, mergea primero)

```
Ejecuta la línea L1 de la Ronda Codex v1.
Brief: docs/instrucciones-lineas-dev/ronda-codex-v1/linea-1-opl-canonico.md
Entregas: helpers OplObj/OplProc/OplState (ui/codex/oplTipografia.tsx),
CodexOPLNote (ui/codex/CodexOplNote.tsx) y marginalia de validación en el panel
OPL. Contrato consumido por L2/L3 — API estable. No tocar generadores/parser OPL.
```

### L2 — Inspector canónico (Ola B, tras L1)

```
Ejecuta la línea L2 de la Ronda Codex v1.
Brief: docs/instrucciones-lineas-dev/ronda-codex-v1/linea-2-inspector-canonico.md
Entregas: CodexInspectSection/Field/Inline + CodexStateRow y migración del
Inspector a esas primitivas. Importa OplObj/OplProc/OplState de L1. No tocar
store/selección/operaciones.
```

### L3 — Diálogos Codex (Ola B, tras L1)

```
Ejecuta la línea L3 de la Ronda Codex v1.
Brief: docs/instrucciones-lineas-dev/ronda-codex-v1/linea-3-dialogos-codex.md
Entregas: re-piel de Dialogo.tsx base (primero) + 15 modales. Acciones como
palabras separadas por ·, sin pills/radius/shadows. No tocar la lógica que los
diálogos invocan.
```

### L4 — Selección emergente + canvas chrome + mobile (Ola B)

```
Ejecuta la línea L4 de la Ronda Codex v1.
Brief: docs/instrucciones-lineas-dev/ronda-codex-v1/linea-4-seleccion-mobile.md
Entregas: CodexSelectionAnnotation (portal sobre el canvas, posicionado vía
localToPaperRect), header de CodexCanvasMount y re-piel ligera de mobile. NO
editar App.tsx ni CodexFrame.tsx; NO tocar render/routing del paper.
```

### L5 — Fidelidad JointJS (Ola B)

```
Ejecuta la línea L5 de la Ronda Codex v1.
Brief: docs/instrucciones-lineas-dev/ronda-codex-v1/linea-5-fidelidad-canvas.md
Entregas: index labels o.NN/p.NN/s.NN, highlighter underline crimson y cobertura
de markers por tipo. SOLO attrs visuales en render/jointjs/composers + assets.
FRONTERA DURA: NO tocar proyeccion.ts, opcloudRouting.ts, anchors ni vértices.
```

---

## Notas operativas

- **Aislamiento**: cada línea en su worktree (`using-git-worktrees`). L2/L3/L4/L5
  arrancan tras el merge de L1 a `main` (consumen el helper OPL / o leen contratos
  estables).
- **Coherencia metodológica**: el revisor verifica contra la tabla de colisiones
  §5 que ninguna línea editó archivos fuera de su dominio.
- **Micro-fidelidad de fundaciones** (§7 del README): NO es una línea de agente;
  la aplica el operador (o un agente dedicado) en un commit único tras la Ola B,
  porque toca archivos-contrato (`tokens.ts`, `CommandPalette.tsx`,
  `CodexFooterKey.tsx`, `atajosTeclado.ts`).
- **Reporte unificado**: al cierre de la ronda, consolidar en un solo resumen los
  hashes, loops verdes y decisiones de las 5 líneas; el operador actualiza
  `docs/HANDOFF.md` (las líneas no lo tocan).
- **Deuda v1.1** (proceso activo, asistente wizard, sub-modelos, lengua OPL, dark
  mode): fuera de esta ronda por decisión de `ui-forja/README §7`.
