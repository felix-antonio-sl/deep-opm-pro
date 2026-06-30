# Procedencia — docs/reference/

Material de **referencia histórica** absorbido durante el decommission de los
repos legados `opmodel` y `opm-model-app` (2026-06-22). `deep-opm-pro` (opforja)
es su sucesor operacional. Estos documentos se conservan **verbatim** como
referencia arquitectónica; **no son canon**. El canon OPM vivo está en
`docs/canon-opm/` (documentos puente con frontmatter propio, no symlinks; fuente real en `~/kora-pneuma/artefactos/conocimiento/fxsl/`, ver `docs/canon-opm/resolutor-urn.json`).

> Naturaleza: copia de solo-lectura. Si un documento contradice el canon o el
> código actual de opforja, **manda el canon y el código**, no esta referencia.

## Origen

| Repo legado | Último commit | Fecha | Backup completo |
|-------------|---------------|-------|-----------------|
| `opmodel` | `8534249` | 2026-06-15 | `~/decommission-opm-legacy-2026-06-22/opmodel.bundle` (+ worktree.tar.gz) |
| `opm-model-app` | `2051417` | 2026-06-15 | `~/decommission-opm-legacy-2026-06-22/opm-model-app.bundle` (+ worktree.tar.gz) |

Los bundles `git --all` contienen la **historia completa verificada** de ambos
repos (todas las ramas, tags y stash). Lo no absorbido aquí vive ahí.

## Qué se absorbió y por qué

### `opmodel/` — decisiones de arquitectura OPL-first
- `opl-first/` — los 4 ADRs vinculantes (ADR-003 isomorfismo categorial, ADR-004
  effective visual slice, ADR-005 OPM Graph Generator, ADR-008 JointJS renderer),
  el plan ejecutivo JointJS, el mapping SSOT-visual (123 reglas V-*), el contrato
  pre-render, la gramática OPL y el handoff operativo. Valor: criterio operacional
  del isomorfismo OPL↔OPD con leyes verificables.
- `ssot/candidate-extensions.md` — 13 hallazgos candidatos a retornar al SSOT de
  kora (compound name order-dependency, ambigüedad de link types, gaps de cobertura,
  disyuntivas V-54/V-115). Complementa el canal vivo `docs/solicitudes-upstream/`.

### `opm-model-app/` — formalización categórica y reglas derivadas
- `ARQUITECTURA-CATEGORICA.md` — constitución categórica (funtores, adjunciones,
  ecuaciones E1-E13 del kernel, mónadas de efectos, lentes Canvas↔OPL).
- `reglas/` — 44 archivos, 263 reglas OPM accionables, cada una con cita V-xx al canon.
- `historias-usuario/00-METODOLOGIA-HU.md` + `MATRIZ-HU-REGLAS-SSOT.md` — metodología
  de revisión de HU y matriz cruzada 48 HU × 263 reglas.
- `adr/` — versionado de schema JSON (ADR-001), deudas aceptadas (ADR-002),
  persistencia en 3 capas (ADR-003).
- `design/ssot-decisiones-axiomaticas.md` — 6 decisiones de alcance ontológico (D1-D6).
- `specs/modelo-json-canonico-v2.3.md` — especificación formal del JSON canónico.

## Qué se omitió deliberadamente (vive solo en el bundle)

| Omitido | Por qué |
|---------|---------|
| `opm-model-app/research/opcloud/` y `opcloud-reverse/` (~95MB) | La ingeniería inversa de OpCloud **ya está destilada** en `docs/JOYAS.md` de opforja. La observación cruda queda en el bundle/tar. |
| `opm-model-app/docs/historias-usuario/epica-*.md` (48 épicas) | Migradas y reordenadas a `docs/roadmap/` de opforja durante la transición. |
| Código fuente, tests, fixtures `.opmodel` de ambos repos | opforja tiene su propio kernel, tests y `fixtures/`; sin linaje de código compartido. |
| `BACKLOG.md`, `docs/evidence/`, auditorías y handoffs fechados | Histórico operativo; preservado en el bundle. |
| Toda la historia git (ramas, tags, stash) | Capturada íntegra en los `.bundle` verificados. |
