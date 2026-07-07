# Kickoff — C′ re-auditoría diagramática (auditoría PRIMERO, luego plan)

> Prompt de arranque autocontenido. Cópialo tal cual. **Este corte NO empieza construyendo: empieza re-auditando in-vivo, porque la lista de pendientes es del 2026-06-12 y el Inspector cambió con el Centinela.** El plan sale de los hallazgos.

---

Estoy trabajando en el programa «experiencia ágil mesa↔skill» de opforja (deep-opm-pro), para mí (Félix, operador experto).

Necesito que la agilidad **diagramática** dentro del canvas y el Inspector esté al día: hay una lista de pendientes UX (M-3 placeholders sembrados-y-denunciados · M-4 Inspector sin jerarquía de frecuencia · M-6 barra de simulación contradictoria · m-1/m-3/m-4/m-6) de una auditoría de hace casi un mes — pero desde entonces se desplegaron modo apunte, gesto de anclar, C4 y el Centinela, que **agregó una sección «Anclaje» al Inspector**, así que M-4 probablemente empeoró y algunos hallazgos pueden estar obsoletos o mal-priorizados.

Con eso en mente: **primero re-audita in-vivo** el estado actual del canvas/Inspector/barra de simulación contra los criterios de la auditoría Jobs, produce un reporte de hallazgos vigentes (qué sigue roto, qué se resolvió solo, qué empeoró, qué es nuevo), y **desde ese reporte escribe el plan** de los cortes de remediación. NO ejecutes la lista vieja al pie.

Primero, lee estos archivos completos antes de responder:
- `docs/auditorias/2026-06-12-auditoria-ux-jobs.md` — la lista original (M-3..M-6, m-1..m-6); C-1 y M-1/M-2 ya se ejecutaron, el resto es lo que re-auditas.
- `docs/superpowers/specs/2026-07-06-chrome-gestion-design.md` §3 — declara que C′ empieza por la re-pasada in-vivo (m-2/m-5 ya salieron con D).
- `docs/HANDOFF.md` §Frentes abiertos frente 5 (UX diferidos) — el estado declarado de F1.9/F1.21/F1.22/M-3..M-6.
- `app/src/ui/inspector/` (todos los `Seccion*.tsx`) — el Inspector actual, **incluida la sección Anclaje del Centinela** que M-4 debe reconsiderar.
- La barra de simulación (busca `BarraSimulacion`/`simulacion` en `app/src/ui/`) — para M-6 (estados contradictorios).

Herramienta obligatoria: la skill `test-vivo-iterativo-opmkv` (conduce un navegador headless contra el dev server, batería de criterios visuales/UX, capturas, refina iterativamente). Úsala para la re-auditoría; el reporte reemplaza al previo.

Referencia de lo que quiero lograr: los criterios de la auditoría Jobs 2026-06-12, aplicados al estado **de hoy** (no al de junio).

Este es un problema **difícil de juicio** (distinguir lo vigente de lo obsoleto en una lista añeja, con gusto de diseño). No te subestimes; el valor está en no gastar esfuerzo en lo que ya se resolvió solo. El deliverable de la primera fase es **tu evaluación** (el reporte de hallazgos vigentes); la construcción viene después de que yo vea ese reporte.

Cuando tengas suficiente para actuar, actúa. No re-deduzcas lo establecido, no re-litigues mis decisiones ni inventaríes opciones que no vas a seguir. ¿Sopesas una elección? Da una recomendación. Haz lo más simple que funcione bien. Sin features, refactors ni abstracciones extra. Sin manejo de errores para escenarios que no pueden ocurrir. **Si estoy describiendo un problema, el entregable es tu evaluación** (esta fase lo es). Reparte subtareas independientes entre subagentes y sigue trabajando. Verifica con un subagente de contexto fresco contra los criterios **cada tanda de hallazgos**. Antes de reportar avance, audita cada afirmación contra un resultado de herramienta de esta sesión (captura in-vivo, no memoria). ¿Sin verificar? Dilo. ¿Tests fallando? Muestra la salida. Registra lecciones en `docs/memorias-aprendizajes/notas-reauditoria-diagramatica.md` — una por archivo, con resumen de una línea. Actualiza, no dupliques. Borra lo que resulte incorrecto. Pausa solo para: acciones destructivas, cambios reales de alcance, o input que solo yo puedo dar (**tras el reporte de hallazgos, para priorizar los cortes**). Si no, procede de punta a punta. Nunca cierres tu turno con una promesa. Abre con el resultado — el TLDR que te pediría. Frases completas, sin cadenas de flechas, sin abreviaturas que no vi antes. Claro le gana a corto.

**Gate de cada corte de remediación posterior**: `cd app && bun run check` + `lint` + `design:governance` + `browser:smoke`. Toca UI → cambia el bundle → **deploy = gate humano**.
