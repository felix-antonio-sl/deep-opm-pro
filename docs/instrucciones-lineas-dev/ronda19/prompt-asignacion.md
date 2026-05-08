# Prompt de asignación — Ronda 19 (Fase 1 UX)

## Plantilla genérica

Eres un agente asignado a `{{LINEA}}` de la **ronda 19 — Fase 1 UX** del repo `deep-opm-pro`. Tu brief autocontenido es `{{PATH_BRIEF}}`. El README maestro está en `docs/instrucciones-lineas-dev/ronda19/README.md`.

**Reglas duras inviolables**:

1. Lee primero el README maestro (`ronda19/README.md`) y luego el brief de tu línea. Cita ambos en el commit final.
2. **Lee `docs/HANDOFF.md`** para conocer estado vigente y decisiones que NO debes reabrir.
3. **NO toques** `docs/HANDOFF.md` ni `docs/historias-usuario-v2/` (excepto las HU nuevas autorizadas en tu brief).
4. **No reinventar**: antes de escribir nuevo código, busca en `opm-extracted/`, `assets/svg/`, `app/src/ui/tokens.ts`, `app/src/ui/toolbar/toolbarStyles.ts`, etc. Cita la evidencia encontrada en el commit.
5. **Aditividad**: no renombrar exports, no cambiar firmas públicas, preservar `data-testid` y `aria-label` existentes.
6. **Tokens existentes únicamente**. Si necesitas un valor nuevo, agrégalo a `tokens.ts` con cita en el commit.
7. **Tabla de colisiones** del README es contrato. Si necesitas tocar un archivo no listado en tu brief: detente y propone al operador.
8. **Loop verde obligatorio** antes de cerrar:
   - `cd app && bun run check` (typecheck + 977+ unit pass)
   - `cd app && bun run lint` (clean)
   - `cd app && bun run browser:smoke` (149+ smoke pass)
   - `cd app && bun run build` (`< 320 KB index.js`)
9. **Audit visual obligatorio** con la skill `test-vivo-iterativo-opmkv` antes de cerrar (excepto líneas que NO toquen render visible: ninguna en esta ronda).
10. **Idiomas**: documentos es-CL; código en idioma original.

**Forma del entregable**:

- Commits con prefijos `feat(...)`, `style(...)`, `refactor(...)`, `test(...)`. Cada commit auto-contenido.
- Co-author footer:
  ```
  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  ```
- Reporte final al cerrar:
  - Hash del último commit
  - Métricas de tests (delta unit + delta smoke)
  - Decisiones que tomaste (las del bloque 10 del brief)
  - Bloqueos encontrados
  - Cualquier desviación documentada del brief

**Notas operativas**:

- Si descubres un bug fuera de scope: NO lo arregles. Captura como reporte en `docs/bugs/BUG-<timestamp>-<slug>/` (formato existente).
- Si tu línea bloquea otra (orden de merge): coordina con el operador antes de cerrar.
- Worktree opcional para aislamiento (recomendado para L2 que tiene blast radius alto):
  ```bash
  git worktree add ../deep-opm-pro-l2-modo-enlace -b wip/ronda19-l2
  ```

## Invocaciones concretas

### L1 — Toolbar agrupada por intención

```
Eres el agente asignado a L1 de la ronda 19. Brief:
docs/instrucciones-lineas-dev/ronda19/linea-1-toolbar-agrupada-intencion.md

Reorganiza la toolbar superior en 6 clusters por intencion (Modelo, Modelar,
Conectar, Vista, Validar, Ayuda) con role="group" y aria-label, preservando
todos los testIds existentes. NO reescribir handlers, store ni canvas.

Lee README ronda19, brief L1 y HANDOFF.md. Loop verde + audit visual obligatorio.
```

### L2 — Modo enlace con estado canvas

```
Eres el agente asignado a L2 de la ronda 19. Brief:
docs/instrucciones-lineas-dev/ronda19/linea-2-modo-enlace-canvas.md

Implementa modo enlace canvas: halo origen, destinos validos resaltados,
inválidos atenuados, drag source-target, preview OPL. Reusa
`validarFirmaEnlace`. Crea `canvas/modoEnlace.ts` puro + handler JointJS.

Esta linea tiene blast radius alto: trabaja en worktree
`wip/ronda19-l2`. Loop verde + audit visual obligatorio. Coordinacion con
L1 vía rebase (L1 cierra primero).
```

### L3 — Issues separados por severidad

```
Eres el agente asignado a L3 de la ronda 19. Brief:
docs/instrucciones-lineas-dev/ronda19/linea-3-issues-separados.md

Agrega clasificador `clasificarSeveridad(aviso)` que mapea avisos
existentes a bloqueo/mejora/estilo, y reorganiza PanelMetodologia en 3
secciones colapsables con resumen. NO tocar el motor de validaciones.

Lee README ronda19, brief L3 y HANDOFF.md. Loop verde + audit visual
obligatorio.
```

### L4 — OPD tree como navegación primaria

```
Eres el agente asignado a L4 de la ronda 19. Brief:
docs/instrucciones-lineas-dev/ronda19/linea-4-opd-tree-navegacion-primaria.md

Promueve el arbol OPD: labels claros en es-CL, badges Inzoom/Unfold/SD,
conteos objetos/procesos/enlaces, indicador issues, navegación a refinador.
Reusa helpers `obtenerRefinamiento` y `refinaA`. NO tocar refinamientos.ts.

Loop verde + audit visual obligatorio.
```

### L5 — Chip de persistencia visible

```
Eres el agente asignado a L5 de la ronda 19. Brief:
docs/instrucciones-lineas-dev/ronda19/linea-5-chip-persistencia.md

Crea `<ChipPersistencia />` que comunica estado (Local/Importado/Fixture/
Nuevo + dirty + tiempo último save + version). Tooltip con detalle. Click
abre Guardar como. Monta en cluster Modelo (slot que L1 expone).

Linea más pequeña de la ronda. Loop verde + audit visual obligatorio.
```

## Orden de merge sugerido

`L5 → L4 → L1 → L3 → L2`

- L5 abre con verde rápido.
- L4 bajo riesgo, no toca contrato del store.
- L1 estabiliza toolbar antes de que L2 trabaje sobre ella.
- L3 aditivo en panel separado.
- L2 al final por blast radius alto + dependencia opcional con L1.
