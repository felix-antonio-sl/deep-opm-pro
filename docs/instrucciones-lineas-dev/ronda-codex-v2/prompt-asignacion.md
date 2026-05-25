# Prompt de asignación — Ronda Codex v2

## Plantilla genérica

> Eres el ejecutor de **{{LINEA}}** de la Ronda Codex v2 en el repo `deep-opm-pro` (editor OPM "OpForja").
> Lee tu brief completo: `docs/instrucciones-lineas-dev/ronda-codex-v2/{{PATH_BRIEF}}` y el README de la ronda (`README.md` del mismo dir), que fija las reglas duras y la tabla de colisiones.
> Fuente de desviaciones: `/home/felix/_TEMP_BORRAR/OpForja_diff.pdf` (rev2, §05). Spec de diseño: `ui-forja/`. SSOT canon OPM: `docs/canon-opm/reglas-opm-estrictas.md`.
> **Reglas duras**: scope estricto a los archivos permitidos del brief; aditividad; reuso del corpus interno antes de inventar; cada commit cita el ID de desviación; es-CL en docs/commits.
> **Loop verde obligatorio**: `cd app && bun run check` (typecheck + unit) verde + `bun run lint` limpio antes de entregar. Si tocas build, `bun run build`.
> No toques archivos fuera de tu scope. Si necesitas un cambio en archivo de otra línea, decláralo en tu reporte; no lo hagas.
> Entrega: commits atómicos con prefijo y co-author footer; reporte final con hashes, conteo de tests, decisiones tomadas y cualquier colisión detectada.

## Invocaciones concretas

- **L1 Canon OPL** → brief `linea-1-canon-opl.md`. Ola 1. Dominio `opl/`. Cierra C1, G2.
- **L2 Chrome shell** → brief `linea-2-chrome-shell.md`. Ola 1, **mergea primera**. Dueño único de `App.tsx`. Cierra CRÍT-Footer, wordmark, botones-caja, breadcrumb, tree-header.
- **L3 Inspector ficha** → brief `linea-3-inspector-ficha.md`. Ola 1. Dominio `Inspector*`. Cierra C9, contadores, o-11.
- **L6 Tokens/pulido** → brief `linea-6-tokens-pulido.md`. Ola 1. Tokens + misc disjunto. Cierra pesos, anchos, color legacy, sombras, chip filtro.
- **L4 Canvas selección** → brief `linea-4-canvas-seleccion.md`. **Ola 2** (tras L2). Cierra SEL-1, SEL-2, multi-select una voz.
- **L5 Comandos palette** → brief `linea-5-comandos-palette.md`. **Ola 2** (tras L2). Cierra hamburguesa→palette, ⌘1-9, atajos plataforma.

## Notas operativas
- Aislamiento por worktree; merge a `main` con gate verde en orden: L2 → {L1, L3, L6} → {L4, L5}.
- Coherencia metodológica: TDD donde el cambio sea de comportamiento; reuso de componentes `codex/` existentes.
- Reporte unificado por el orquestador al cierre de cada ola.
