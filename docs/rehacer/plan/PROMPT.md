# Mensaje para abrir la sesión de implementación

Abre una sesión nueva de Claude Code con el repositorio `felix-antonio-sl/deep-opm-pro` y pega el
bloque de abajo tal cual. Si prefieres que avance sin detenerse en los hitos, borra la línea que
empieza con «Detente».

```text
Implementa opforja rehecho según el plan empaquetado en docs/rehacer/plan/.

Antes de cualquier otra cosa, lee completos docs/rehacer/plan/README.md y
docs/rehacer/plan/plan.json. Respeta la autoridad que fijan: docs/rehacer/canon/ (manda ante
cualquier conflicto), docs/rehacer/DECISIONS.md (decisiones fijas, no se reabren),
docs/rehacer/understand/CANON.md y docs/rehacer/design/DESIGN.md.

Rama: trabaja en la rama `rehacer`. Créala desde main si no existe, con el tag `pre-rehacer`
sobre esa base, y haz push de cada paquete cerrado a origin/rehacer. Te autorizo a usar esa rama
en lugar de la que asigne la sesión.

Ejecución: usa un workflow multiagente por ola, siguiendo plan.json. Cada paquete de trabajo va
a un agente en un worktree aislado; tú integras en el orden de la ola, con `bun run check` verde
tras cada integración y una revisión adversarial del diff al cerrar cada ola. Un commit semántico
por paquete y el tablero en HANDOFF.md al día.

Detente en cada hito (H1 tras la ola 1, H2 tras la ola 3, H3 tras la ola 5) y repórtame qué
quedó verde, qué brechas se registraron y qué sigue, antes de continuar.

Límites: no despliegues, no toques producción, no ejecutes la migración real desde PostgreSQL y
no hagas merge a main; WP-19 solo abre el PR rehacer → main. No agregues capacidades fuera de
DESIGN §1.3. Ninguna prueba se debilita para pasar. Si un contrato de DESIGN necesita cambiar,
propónlo en HANDOFF.md y avísame.

Si la sesión se interrumpe por límite, la siguiente retoma desde HANDOFF.md y origin/rehacer.
```
