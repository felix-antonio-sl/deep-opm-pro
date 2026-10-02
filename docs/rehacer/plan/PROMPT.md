# Mensaje para abrir la sesión de implementación

Sesión en h289, sobre `~/projects/deep-opm-pro`. El mismo mensaje sirve para cada hito y para
retomar tras un corte: siempre avanza hasta el siguiente hito pendiente.

```text
Implementa opforja rehecho según docs/rehacer/plan/ hasta el siguiente hito pendiente (H1, H2 o H3) y detente ahí.

Trabaja en ~/projects/deep-opm-pro. Si hay cambios versionados sin commitear, detente y avísame; no los descartes. Actualiza main con git pull --ff-only origin main. Trabaja en la rama rehacer; si no existe, créala desde main con el tag pre-rehacer y haz push de ambos; si existe, cámbiate a ella y haz git pull --ff-only origin rehacer.

Antes de escribir código, lee completos docs/rehacer/plan/README.md y docs/rehacer/plan/plan.json, y sigue su protocolo por paquete. Autoridad: docs/rehacer/canon/ manda; luego docs/rehacer/DECISIONS.md (1–28, no se reabren), docs/rehacer/understand/CANON.md y docs/rehacer/design/DESIGN.md. Si el AGENTS.md vigente contradice el plan, manda el plan.

Cierra los paquetes uno a la vez, en el orden lineal del plan, con un commit semántico por paquete y push a origin/rehacer. Si HANDOFF.md ya registra paquetes cerrados, retoma desde el primero pendiente. Entre paquetes no me preguntes si sigues.

Hecho significa: los paquetes del hito cerrados, con `cd app && bun run check` verde y su aceptación de plan.json cumplida, y HANDOFF.md al día con los resultados del hito (qué quedó verde, qué brechas B-nn se registraron y qué sigue). En H3, además, `bun run e2e` y `bun run build` verdes y el PR rehacer → main abierto.

Límites: no despliegues, no toques producción ni contenedores, no ejecutes la migración real desde PostgreSQL, no hagas merge ni push a main y no leas ni muestres .env ni credenciales. Ninguna prueba se debilita, se salta ni se pone en cuarentena. Si un contrato de DESIGN debe cambiar, propónlo en HANDOFF.md y detente.
```
