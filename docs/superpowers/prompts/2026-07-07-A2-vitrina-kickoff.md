# Kickoff — A′-vitrina (chip de revisión + hitos del historial)

> Prompt de arranque autocontenido para la Ola 2 del puente mesa↔skill. Cópialo tal cual para lanzar el corte. Diseño ya aprobado; esto lo ejecuta.

---

Estoy trabajando en el programa «experiencia ágil mesa↔skill» de opforja (deep-opm-pro), para mí (Félix, operador experto que modela en el bucle skill↔mesa).

Necesito que, cuando un agente empuje una revisión al modelo que tengo abierto en la mesa, la vea llegar y pueda traerla **sin perder mi trabajo local sin querer**, y que el historial de versiones **no mienta sobre qué es un hito** (una sesión de agente = un hito colapsable, no diez entradas sueltas).

Con eso en mente: construye **A′-vitrina** — el chip «revisión más nueva» **ramificado** (sin cambios locales → «Recargar»; con cambios locales → «Ver la del agente» no-destructivo, que reusa el visor de versiones existente + «Descartar los míos y traer la del agente», nombrado por su costo), la detección honesta de «cambios locales», y el colapso de las versiones de una sesión de agente en un hito.

Primero, lee estos archivos completos antes de responder:
- `docs/superpowers/specs/2026-07-06-puente-directo-mesa-skill-design.md` — el diseño; §6 (A′-vitrina) y §5 (chip ramificado) son tu spec; §9 nombra el riesgo del dirty-bit.
- `app/src/ui/DialogoVersiones.tsx` — el visor de versiones a REUSAR para «Ver la del agente» (no construir uno nuevo).
- `app/src/ui/ChipPersistencia.tsx` — el patrón del chip de estado existente (dirty/guardado); tu chip vive en la misma familia.
- `app/src/render/jointjs/proyeccion.ts` — el chip de drift del Centinela (hairline en TINTA); **riesgo de colisión de vocabulario visual** — el chip de revisión y el de drift son ambos hairline en TINTA; diferéncialos o pasa `bun run design:governance`.
- `ui-forja/GOVERNANCE.md` — invariante de colores (crimson prohibido como semántica; TINTA para el chip).
- `app/src/store/persistencia.ts` + `app/src/store/pestanas.ts` — de dónde derivar «cambios locales» (revisión-base local < revisión remota + frescura de autosave / pila de undo no vacía); **no existe un dirty-bit limpio, defínelo antes de construir**.
- `docs/superpowers/plans/2026-07-06-puente-mesa-skill-ola1.md` — el patrón del A′-motor ya desplegado (cómo se estructuró el corte hermano).

Referencia de lo que quiero lograr: `2026-07-06-puente-directo-mesa-skill-design.md` §6, párrafo por párrafo (chip ramificado · reuso del visor · colapso de hitos · gobierno visual TINTA).

Este es un problema **difícil**: la detección de «cambios locales» no tiene una primitiva limpia en un backend-only con autosave (el review whole-branch de Ola 1 lo marcó como riesgo top-2). No te subestimes; escópalo como si estuviera en el tope de tu rango.

Cuando tengas suficiente para actuar, actúa. No re-deduzcas lo establecido, no re-litigues mis decisiones ni inventaríes opciones que no vas a seguir. ¿Sopesas una elección? Da una recomendación. Haz lo más simple que funcione bien. Sin features, refactors ni abstracciones extra. Sin manejo de errores para escenarios que no pueden ocurrir. Si estoy describiendo un problema, el entregable es tu evaluación. Reparte subtareas independientes entre subagentes y sigue trabajando. Verifica con un subagente de contexto fresco contra la spec **cada tarea** (el dirty-bit y el chip son quisquillosos; valida cada rama in-vivo). Antes de reportar avance, audita cada afirmación contra un resultado de herramienta de esta sesión. ¿Sin verificar? Dilo. ¿Tests fallando? Muestra la salida. Registra lecciones en `docs/memorias-aprendizajes/notas-vitrina.md` — una por archivo, con resumen de una línea. Actualiza, no dupliques. Borra lo que resulte incorrecto. Pausa solo para: acciones destructivas, cambios reales de alcance, o input que solo yo puedo dar. Si no, procede de punta a punta. Nunca cierres tu turno con una promesa. Abre con el resultado — el TLDR que te pediría. Frases completas, sin cadenas de flechas, sin abreviaturas que no vi antes. Claro le gana a corto.

**Gate del corte**: `cd app && bun run check` verde + `bun run lint` + `bun run design:governance` (chip visual) + `browser:smoke`. Toca UI (Preact) → cambia el bundle → **deploy = gate humano** (`docker compose up -d --build`).
