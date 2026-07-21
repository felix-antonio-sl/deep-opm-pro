# Prompt de asignación — ronda tutor contextual

## Plantilla genérica

Trabaja la línea `{{LINEA}}` siguiendo íntegramente `{{PATH_BRIEF}}` y el README maestro de la ronda. Lee antes `CLAUDE.md`, el diseño aprobado y las fuentes exigidas. No amplíes alcance ni edites archivos fuera de la allowlist. Revisa `opm-extracted` en profundidad antes de crear una solución nueva y declara qué reutilizaste o por qué no era transplantable.

Mantén una sola voz contextual, `PanelDiagnostico` como dueño de issues, cero red/LLM y ninguna promesa de capacidad ausente. Ejecuta el loop rojo→verde focal, luego `cd app && bun run check`; añade governance/build/browser cuando corresponda. Entrega hashes o diff, tests ejecutados, decisiones, bloqueos y evidencia de no-colisión. No toques HANDOFF, deploy, DB, mesa remota ni repos vecinos.

## Invocación L1

```text
Línea: L1 — Núcleo transaccional y ciclo
Brief: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/tutor-contextual-2026-07-21/linea-1-nucleo-transaccional.md
Propiedad: raíz integradora; ninguna otra línea edita sus seams.
```

## Invocación L2

```text
Línea: L2 — Registro, corpus y cobertura
Brief: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/tutor-contextual-2026-07-21/linea-2-registro-corpus.md
Propiedad: solo archivos nuevos bajo app/src/tutor y sus tests; no integrar hubs UI.
```

## Invocación L3

```text
Línea: L3 — Verificación adversarial e in-situ
Brief: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/tutor-contextual-2026-07-21/linea-3-verificacion-adversarial.md
Propiedad: solo lectura; veredicto Inevitable o No todavía.
```

## Aislamiento y entrega

- Preferir worktree para una línea con commits propios; si comparte filesystem, respetar la exclusividad por archivo.
- La raíz integra en orden L1 → L2 → L3.
- Cada línea reporta inmediatamente una colisión o ambigüedad; no la resuelve expandiendo scope.
- El reporte final unifica cortes, deltas, commits, tests, in-situ y drift productivo deliberado.
