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
| `2026-06-04-persistencia-backend.md` | Auditoría viva de persistencia: cortes 1-4 desplegados, storage navegador retirado del runtime OPM; pendientes auth/tenants real y deudas operativas menores. |
| `2026-06-04-acta-mesa-flujo-canonico-dominio-opforja.md` | **Acta de consenso vigente** (mesa Besto/Resto, orquestación, 3 ciclos): arquitectura unificada de las dos líneas (hd-opm autoría ↔ OpForja), flujo canónico E0-E6, leyes L1-L8, plan F0-F5 NO implementado. HITL resueltas en adenda (laxitud=bastante libre; re-pin aprobado; backlog contingencial → `docs/roadmap/backlog-contingencial.md`). |
| `2026-06-04-acta-mesa-equilibrio-encarnacion.md` | **Acta de consenso vigente** (mesa Asto/Besto/Resto, encarnación, DOS deliberaciones): (1) realización EQUILIBRIO validada con C1-C5 (registro [RATIFICAR] tipificado — la app registra, no decide; L9; paquete `deep-opm-pro.paquete.v0`; **gate de release: sin paquetes en instancia pública sin re-protección** — HITL abierta); (2) **distribución del LLM ratificada por naturaleza del juicio** (matriz E0-E6: dialéctica+corpus=skill, "IA de la app"=capa de lenguaje determinista; puente W6.0 con contador; gatillos falsables g1/g2/g3). |
| `2026-05-07-opl-reverse-ssot-opm-extracted.md` | Citado por `docs/roadmap/cortes-operativos.md` como evidencia. |
| `2026-05-07-ssot-opm-extracted.md` | Citado por código vivo (`app/src/modelo/validaciones.ts` §4.4 / RF-3). |
| `opcloud-enlaces-pendientes/` | Documento vivo de roadmap: brechas avanzadas de enlaces aún abiertas (labels, tagged/bidirectional). |
| `2026-05-26-jobs-ifml-opforja-prescriptivo/` | Autoridad vigente sobre la decisión de onboarding/primer paint (ver HANDOFF). |
| `2026-05-26-jobs-web-ux-opforja/` | Auditoría UX reciente acompañante. |
