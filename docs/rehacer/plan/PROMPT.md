# Mensaje para abrir la sesión de implementación

## Codex CLI local en h289 (variante en uso)

Abre Codex CLI en el repositorio local de h289, con acceso a red en su sandbox (lo necesitan
`git pull` y `push`, `bun install` y Playwright). Pega este bloque tal cual. Si prefieres que avance
sin detenerse en los hitos, borra el párrafo que empieza con «Detente».

```text
Implementa opforja rehecho según el plan empaquetado en docs/rehacer/plan/.

Paso 1, actualizar el repositorio local:
- Trabaja en /home/felix/project/deep-opm-pro (si no existe, en /home/felix/projects/deep-opm-pro).
- Ejecuta git status. Si hay cambios versionados sin commitear, detente y avísame; no los
  descartes ni los guardes en stash.
- git switch main y git pull --ff-only origin main. Comprueba que existen
  docs/rehacer/plan/plan.json y docs/rehacer/plan/README.md.

Paso 2, rama de trabajo: crea la rama `rehacer` desde main (o cámbiate a ella si ya existe), el
tag `pre-rehacer` sobre esa base, y haz push de ambos a origin. Todo el trabajo va en `rehacer`;
haz push de cada paquete cerrado.

Resguardos de esta máquina: no ejecutes docker ni docker compose, no detengas ni reinicies
contenedores, no ejecutes ./deploy/deploy.sh (construye desde este checkout) y no leas, copies ni
muestres .env ni ninguna credencial. Donde el plan diga Chromium en /opt/pw-browsers, usa el
Chromium de Playwright de esta máquina (instálalo para el proyecto si falta). Si Bun no es 1.3.x,
avísame antes de seguir.

Autoridad: lee completos docs/rehacer/plan/README.md y docs/rehacer/plan/plan.json antes de
escribir código. Manda docs/rehacer/canon/ (exactamente esos cuatro documentos; no uses otras capas
de KORA aunque estén instaladas aquí), luego docs/rehacer/DECISIONS.md (decisiones fijas 1–28),
docs/rehacer/understand/CANON.md y docs/rehacer/design/DESIGN.md. Mientras WP-0 no reescriba
AGENTS.md, si el AGENTS.md vigente contradice el plan, manda el plan.

Ejecución con un solo agente: sigue la sección «Con un solo agente» de plan/README.md, un paquete
a la vez en este orden: WP-0, WP-1, WP-2, WP-4p, WP-6, WP-8a, WP-11, WP-18, WP-3a, WP-3b, WP-5,
WP-7, WP-8b, WP-4r, WP-9, WP-13, WP-10, WP-12, WP-14, WP-15, WP-16, WP-17, WP-19. Por paquete: lee
solo sus lecturas de plan.json, escribe primero las pruebas (cada una titulada con su T-ID), toca
solo sus archivos, cierra con `cd app && bun run check` verde más su aceptación, un commit
semántico, tablero de HANDOFF.md al día y push. Al cerrar cada ola, relee su diff contra el canon y
DESIGN (firma, OPL literal, roundtrip, brechas sin registro) y corrige antes de seguir.

Detente en cada hito (H1 tras WP-18, H2 tras WP-13, H3 tras WP-19) y repórtame qué quedó verde,
qué brechas se registraron y qué sigue, antes de continuar.

Límites: no despliegues, no toques producción, no ejecutes la migración real desde PostgreSQL y no
hagas merge a main; WP-19 solo abre el PR rehacer → main. No agregues capacidades fuera de DESIGN
§1.3. Ninguna prueba se debilita, se salta ni se pone en cuarentena para pasar. Si un contrato de
DESIGN necesita cambiar, propónlo en HANDOFF.md y avísame.

Si la sesión se interrumpe, la siguiente retoma desde HANDOFF.md y origin/rehacer con este mismo
mensaje: en ese caso, en el paso 1 cámbiate a `rehacer` y haz git pull --ff-only origin rehacer.
```

## Claude Code con orquestación multiagente (alternativa)

Abre una sesión nueva de Claude Code con el repositorio `felix-antonio-sl/deep-opm-pro` y pega este
bloque.

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
