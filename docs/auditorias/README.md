# Auditorías — índice

Carpeta única de auditorías del repo (antes dividida en `docs/audits/` y `docs/auditorias/`; consolidada en español el 2026-05-26).

## Política de no-archivado

**No se conserva lo histórico que no tiene valor real.** Una auditoría vive aquí solo mientras cumpla una de dos condiciones:

1. **Referencia viva**: citada por código, tooling, tests o por una regla normativa (`reglas-opm-estrictas.md`, `cortes-operativos.md`, etc.).
2. **Valor prospectivo**: documenta brechas abiertas, decisiones vigentes o criterios que aún gobiernan el producto.

Cuando una auditoría queda **implementada o superada** (su corte se desplegó, su criterio fue reemplazado), se **elimina** — no se archiva. La historia git es la red de recuperación; no acumulamos lápidas documentales. La narrativa de cortes cerrados vive en `docs/HANDOFF.md`, no en auditorías muertas.

## Contenido vigente

| Artefacto | Por qué vive |
|-----------|--------------|
| `2026-05-07-opl-reverse-ssot-opm-extracted.md` | Citado por `docs/roadmap/cortes-operativos.md` y `progress-dashboard.mjs` como evidencia. |
| `2026-05-07-ssot-opm-extracted.md` | Citado por código vivo (`app/src/modelo/validaciones.ts` §4.4 / RF-3). |
| `opcloud-enlaces-pendientes/` | Documento vivo de roadmap: brechas avanzadas de enlaces aún abiertas (labels, tagged/bidirectional). |
| `2026-05-26-jobs-ifml-opforja-prescriptivo/` | Autoridad vigente sobre la decisión de onboarding/primer paint (ver HANDOFF). |
| `2026-05-26-jobs-web-ux-opforja/` | Auditoría UX reciente acompañante. |
