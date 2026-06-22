# ADR 002 — Deudas aceptadas explícitamente

**Fecha**: 2026-04-21
**Estado**: aceptado
**Categoría**: E-04, F-02, F-04 del BACKLOG (deudas cerradas por aceptación)

## Contexto

Algunas observaciones de la auditoría arquitectónica (§25 errores
detectados al 2026-04-20) no son defectos a corregir sino decisiones
que vale la pena **aceptar explícitamente** como trade-offs calibrados
para el estado actual del proyecto. Documentarlas evita que reaparezcan
como deuda perpetua en auditorías futuras.

Este ADR cierra formalmente 3 items como **deudas aceptadas** con
triggers de revisión claros.

## Decisiones aceptadas

### E-04 — UI vanilla sin framework

**Observación original**: `src/ui/feedback-widget.ts` y `src/ui/
opd-navegador.ts` suman > 900 líneas de DOM manipulation directo
(vanilla TS + CSS inline vía `<style>` tag inyectado). Sin React/Vue/
Svelte/Solid.

**Decisión**: mantenerlo vanilla para el MVP. Las dos razones de peso son:

1. **Cero runtime cost**: el bundle actual es 605 KB (189 KB gzip) con
   todo incluido (JointJS + dagre + dominio KORA + UI). Agregar un
   framework mínimo como Preact suma ~10 KB; uno completo como React
   suma 40-80 KB. En bundles > 500 KB el porcentaje importa.

2. **Dominio UI estable y pequeño**: la UI actual tiene 3 componentes
   (selector de fixtures, panel OPDs, widget feedback). Ni la
   complejidad ni el número de componentes justifican el costo de
   framework + su ergonomía.

**Trigger de revisión**:
- Cuando se implemente FEAT-01 (lente Canvas↔Modelo editable), la UI
  crecerá significativamente (inspector, toolbar, propiedades). Ahí sí
  vale la pena evaluar framework.
- Si `src/ui/` supera las 2000 líneas, abrir issue para re-evaluar.

### F-02 — Persona Steipete flexible

**Observación original**: el INV-01 declara "Steipete NUNCA escribe
código directamente. Solo despacha obreros." En la práctica, Claude
ejecutando como Steipete ha hecho edits directos para:
- Fixes de tipo trivial (ej. `calc(4)` → `x: 4`).
- Close-the-loop mecánico tras obrero que se cortó.
- Docs/configs sin lógica de negocio.
- Commits + push (trabajo de coordinación).

**Decisión**: la excepción "close-the-loop mecánico" es parte del rol
Steipete, no una violación. Se formaliza:

**Regla refinada**: Steipete NO escribe lógica de producto ni inventa
features. SÍ puede ejecutar directo cuando:
- Es config/docs/build sin lógica de negocio.
- Es close-the-loop tras obrero despachado (typecheck fix, snapshot
  update intencional, finish del commit).
- Es coordinación git (add, commit, push, merge, log).
- Es < 20 líneas de cambio mecánico (no interpretativo).

Para todo lo demás, Steipete despacha obrero.

**Trigger de revisión**: si edits directos superan 100 líneas en un
ciclo, revisar si la regla sigue siendo útil o si está ocultando un
bypass.

### F-04 — Fixtures escritos a mano

**Observación original**: los 7 fixtures JSON en `fixtures/ejemplos/`
se escriben a mano. Esto introdujo typos (ej. "Electic" por "Electric"
en ev-ams) y violaciones estructurales resueltas reactivamente.

**Decisión**: aceptar fixtures artesanales como costo razonable del
MVP. Razones:

1. Los fixtures son **obras didácticas** (casos canónicos Dori, OnStar,
   etc.) que benefician de curación humana. Un DSL generador tendría
   que re-codificar todas las convenciones pedagógicas.

2. Volumen manejable: 7 fixtures. No llegará a 70 en corto plazo.

3. **Validator + snapshots + convención SSOT** ya atrapan errores
   estructurales antes del commit (V-5/V-7/V-8, combinaciones de
   extremos, stereotypes canónicos per-profile).

4. El script `agregar-apariencias-estados.ts` ya automatiza **la parte
   mecánica repetible** (Fase A) — apariencias de estados se generan
   sin tocar el JSON base.

**Trigger de revisión**:
- Cuando haya > 20 fixtures activos.
- Cuando se agregue un dominio con > 3 fixtures (ej. D_HSC con varios
  casos clínicos).
- Si los errores de typo/violación aparecen > 2 veces en un ciclo
  tras ser corregidos.

En ese punto: construir un DSL TS que genere fixtures garantizados
SSOT-compliant.

## Consecuencias

- Auditorías futuras NO listan E-04, F-02, F-04 como deudas abiertas.
- Si alguno de los triggers se dispara, este ADR se revisa y se actualiza
  a "superseded by ADR-NNN".

## Referencias

- Auditoría original: conversación del 2026-04-21 (análisis "25 errores
  arquitectónicos").
- BACKLOG.md § DEC-03 para DEC pendientes relacionadas con adapter
  alternativo y code-splitting.
- `CLAUDE.md` del repo para las reglas de commits atómicos (F-01) que
  sí son enforced.
