# Mensaje para abrir la sesión de implementación

## Codex CLI local en h289 (variante en uso)

La delegación sigue la documentación oficial de Codex, revisada el 2026-10-02:

- un solo hilo escribe;
- cada hito es un `/goal`, que persiste entre turnos y se cierra con evidencia;
- un subagente de solo lectura revisa cada ola;
- unas reglas de comandos dejan a git trabajar dentro del sandbox.

Los objetivos son cortos porque Codex admite hasta 4.000 caracteres. El contrato que citan está en la
sección «Con Codex CLI» de [`README.md`](README.md).

### 1. En la terminal, antes de abrir Codex

```bash
cd /home/felix/project/deep-opm-pro      # si no existe: /home/felix/projects/deep-opm-pro
git status --short --untracked-files=no  # debe salir vacío; si no, detente y no descartes nada
git switch main
git pull --ff-only origin main
bun --version                            # 1.3.x
codex --version                          # 0.128.0 o posterior; si no, codex update
codex execpolicy check --pretty --rules .codex/rules/rehacer.rules -- git push origin main
                                         # debe decir "forbidden"
codex --approve-for-me -c sandbox_workspace_write.network_access=true
```

`--approve-for-me` deja el sandbox en `workspace-write` y manda las aprobaciones a la revisión
automática. La red hace falta para `bun install`, Playwright y el push.

### 2. Al abrir Codex

- Si pregunta si confías en el proyecto, responde que sí. Sin confianza, Codex ignora
  `.codex/rules/` y `.codex/agents/`, y el primer commit se detendría a pedir aprobación.
- Con `/status`, comprueba que el sandbox es `workspace-write` y que las aprobaciones van a revisión
  automática.
- Con `/model`, elige el modelo más capaz disponible, con razonamiento alto.
- Si `/goal` no aparece, ejecuta `codex features enable goals` y reinicia Codex.

### 3. Objetivo H1

Pégalo tal cual:

```text
/goal Lleva opforja rehecho hasta el hito H1 de docs/rehacer/plan/. Antes de escribir código lee completos docs/rehacer/plan/README.md y docs/rehacer/plan/plan.json; sigue su protocolo por paquete y su sección «Con Codex CLI», que manda sobre el AGENTS.md vigente. Cierra uno a la vez, en este orden, WP-0, WP-1, WP-2, WP-4p, WP-6, WP-8a, WP-11 y WP-18 (este solo se redacta): un commit semántico por paquete en la rama rehacer, que WP-0 crea desde main con el tag pre-rehacer, y push a origin/rehacer. Hecho significa, con evidencia observada: `cd app && bun run check` verde en la punta de rehacer; la aceptación de cada paquete de plan.json cumplida; los 6 fixtures v0 importan sin error; HANDOFF.md con el progreso al día y los resultados de H1 (qué quedó verde, brechas B-nn registradas, qué sigue). Preserva: el canon son los cuatro documentos de docs/rehacer/canon/; DECISIONS 1–28 no se reabren; ningún contrato de DESIGN cambia por tu cuenta; ninguna prueba se debilita, se salta ni se pone en cuarentena. Límites: solo este checkout y la rama rehacer; sin docker ni ./deploy/deploy.sh; sin producción ni migración real; nada de merge ni push a main; no leas, copies ni muestres .env ni credenciales. Entre paquetes no me preguntes si sigues. Al cerrar cada ola, pide al subagente revisor_rehacer que revise su diff y corrige sus hallazgos. Si HANDOFF.md ya registra paquetes cerrados, retoma desde el primero pendiente. Si te bloquea uno de los casos de «Con Codex CLI», detente y repórtame la evidencia, tu propuesta y lo que necesitas de mí.
```

### 4. En cada hito

Cuando Codex da el objetivo por cumplido, se detiene. Antes de fijar el siguiente:

- lee los resultados del hito en `HANDOFF.md` y `git log --oneline main..origin/rehacer`;
- si quieres otra mirada, usa `/review` con instrucciones propias, por ejemplo «revisa los commits
  de este hito contra docs/rehacer/canon/ y docs/rehacer/design/DESIGN.md».

Después pega el objetivo siguiente en el mismo hilo. También sirve un hilo nuevo, porque cada
objetivo retoma desde `HANDOFF.md`.

### 5. Objetivo H2

```text
/goal Lleva opforja rehecho hasta el hito H2 de docs/rehacer/plan/, con el contrato de docs/rehacer/plan/README.md (protocolo por paquete y sección «Con Codex CLI», que manda sobre AGENTS.md). Cierra uno a la vez, en este orden, WP-3a, WP-3b, WP-5, WP-7, WP-8b, WP-4r, WP-9 y WP-13, cada uno con su commit semántico en la rama rehacer y push a origin/rehacer. Hecho significa, con evidencia observada: `cd app && bun run check` verde en la punta de rehacer; la aceptación de cada paquete de plan.json cumplida; el roundtrip estricto por enumeración de la matriz en verde (R-§19-SIM-3); HANDOFF.md con el progreso al día y los resultados de H2. Preserva: el canon son los cuatro documentos de docs/rehacer/canon/; DECISIONS 1–28 no se reabren; ningún contrato de DESIGN cambia por tu cuenta; ninguna prueba se debilita, se salta ni se pone en cuarentena. Límites: solo este checkout y la rama rehacer; sin docker ni ./deploy/deploy.sh; sin producción ni migración real; nada de merge ni push a main; no leas, copies ni muestres .env ni credenciales. Entre paquetes no me preguntes si sigues. Al cerrar cada ola, pide al subagente revisor_rehacer que revise su diff y corrige sus hallazgos. Retoma desde el primer paquete pendiente de HANDOFF.md. Si te bloquea uno de los casos de «Con Codex CLI», detente y repórtame la evidencia, tu propuesta y lo que necesitas de mí.
```

### 6. Objetivo H3

```text
/goal Lleva opforja rehecho hasta el hito H3 de docs/rehacer/plan/, con el contrato de docs/rehacer/plan/README.md (protocolo por paquete y sección «Con Codex CLI», que manda sobre AGENTS.md). Cierra uno a la vez, en este orden, WP-10, WP-12, WP-14, WP-15, WP-16, WP-17 y WP-19, cada uno con su commit semántico en la rama rehacer y push a origin/rehacer; verifica la imagen de WP-18 después de WP-14 y mira cada golden SVG nuevo o cambiado. Hecho significa, con evidencia observada: `bun run check`, `bun run e2e` (26 escenarios) y `bun run build` verdes desde un clon limpio de origin/rehacer; la aceptación de cada paquete de plan.json cumplida; nada desplegado; el PR rehacer → main abierto con gh si está autenticado o, si no, su título y cuerpo en tu mensaje final. WP-19 retira HANDOFF.md, así que los resultados de H3 van en el cuerpo del PR. Preserva: el canon son los cuatro documentos de docs/rehacer/canon/; DECISIONS 1–28 no se reabren; ningún contrato de DESIGN cambia por tu cuenta; ninguna prueba se debilita, se salta ni se pone en cuarentena. Límites: solo este checkout y la rama rehacer; sin docker ni ./deploy/deploy.sh; sin producción ni migración real; nada de merge ni push a main; no leas, copies ni muestres .env ni credenciales. Entre paquetes no me preguntes si sigues. Al cerrar cada ola, pide al subagente revisor_rehacer que revise su diff y corrige sus hallazgos. Retoma desde el primer paquete pendiente de HANDOFF.md. Si te bloquea uno de los casos de «Con Codex CLI», detente y repórtame la evidencia, tu propuesta y lo que necesitas de mí.
```

### Pausas, cortes y reanudación

- `/goal` muestra el objetivo vigente. `/goal pause` lo pausa y `/goal resume` lo reanuda. Un
  mensaje en el mismo hilo corrige el rumbo sin cancelar el objetivo.
- Si la revisión automática deniega algo razonable, `/approve` lo reintenta una vez.
- Si la sesión se corta por un límite de uso o porque se cerró la terminal, retómala con
  `codex resume --last --approve-for-me -c sandbox_workspace_write.network_access=true` y luego
  `/goal resume`.
- Si el hilo se pierde, ejecuta en la terminal `git switch rehacer` y
  `git pull --ff-only origin rehacer`. Después abre Codex como en el paso 1 y pega el objetivo del
  hito abierto, que retoma desde `HANDOFF.md`.

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
