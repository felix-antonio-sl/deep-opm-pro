# Prompt minimo de asignacion de linea (ronda 6)

Plantilla generica para asignar cualquiera de las 6 lineas de la ronda 6 a un agente independiente. Reemplazar `{{LINEA}}` y `{{PATH_BRIEF}}`.

## Plantilla

```text
Implementa la linea de desarrollo {{LINEA}} de deep-opm-pro.

Brief autoridad: {{PATH_BRIEF}}.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda6/README.md.
Working directory: /home/felix/projects/deep-opm-pro.

Antes de codificar:
1. Lee el brief completo. Las HU listadas son contrato.
2. Lee la SSOT citada en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/.
3. Revisa en profundidad opm-extracted/ segun el brief: INDEX.md, MODULES.md, README.md, REFACTOR-NOTES.md, assets/INDEX.md y modulos src/ citados.
4. Revisa el estado actual de app/src antes de editar. No asumas que el codigo coincide con rondas historicas (ya hubo 5 rondas); verifica.
5. Revisa assets/svg/ y docs/JOYAS.md antes de redibujar cualquier marcador, icono o shape.
6. Revisa docs/HANDOFF.md (especialmente §Decisiones Vigentes) para no romper contratos heredados de rondas 1-5.

Reglas duras no negociables:
- Cambios solo aditivos. No renombrar campos existentes, no romper JSON legacy, no reordenar APIs publicas sin necesidad.
- No tocar archivos fuera del scope declarado en seccion 4 del brief.
- No copiar bloques 1:1 desde opm-extracted/. Usalo como evidencia y guia estructural.
- Cada decision semantica debe citar SSOT o documento interno trazable.
- No tocar docs/HANDOFF.md ni docs/historias-usuario-v2/.
- Mantener la logica nueva en helper/modulo de dominio nuevo siempre que el brief lo indique. Recordar que app/src/modelo/operaciones.ts mide 1743 LOC y app/src/store.ts mide 1616 LOC; toda capacidad nueva debe vivir en modulo de dominio nuevo, no expandir los monoliticos.
- Idiomas: documentacion y mensajes en es-CL; identificadores segun estilo actual del codigo.
- No introducir backend, Firebase, auth, Rappid ni dependencias nuevas.
- No reabrir contratos de rondas 1-5: workspace local sin jerarquia plana se conserva (L4 lo extiende aditivamente), Importacion JSON no autopersiste, Bus de agregacion derivado en render, Apariencia.estilo invariante a OPL, OPL-ES como lente derivada.

Loop verde obligatorio antes de cerrar:
- cd app && bun run check
- cd app && bun run browser:smoke    (si tocaste UI/render)
- cd app && bun run build            (si tocaste proyeccion JointJS o serializacion)

L1 es la unica excepcion: no toca app/, solo regenera ledger; verificacion = `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`.

Forma del entregable:
- Commits en la rama actual, salvo instruccion explicita de worktree/branch.
- Mensajes imperativos con prefijo feat(...) | test(...) | refactor(...) | chore(...).
- Reportar hashes de commits, tests agregados, comandos ejecutados, decisiones tomadas y bloqueos.
- Confirmar que no tocaste HANDOFF ni HU.

Si surge un cambio cross-line fuera del scope, detente y consulta. No lo resuelvas por invasion silenciosa.
```

## Invocaciones concretas

### L1 — Calibracion del ledger HU

```text
Implementa la linea de desarrollo L1 (recalibrar reglas regex de progress-dashboard.mjs para EPICA-14, 30, 34, 50, 1C, 20 y 11) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda6/linea-1-calibracion-ledger.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda6/README.md.
[resto identico a la plantilla]
```

### L2 — OPL edicion canvas avanzada

```text
Implementa la linea de desarrollo L2 (HU-50.013/.015/.016/.021/.022/.023/.024/.025/.026, OPL edicion canvas avanzada) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda6/linea-2-opl-edicion-canvas.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda6/README.md.
[resto identico a la plantilla]
```

### L3 — Asistente nuevo modelo (12 etapas)

```text
Implementa la linea de desarrollo L3 (HU-34.010 a HU-34.028, asistente nuevo modelo de 12 etapas con siembra radial) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda6/linea-3-asistente-nuevo-modelo.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda6/README.md.
[resto identico a la plantilla]
```

### L4 — Workspace jerarquico, busqueda y autosalvado

```text
Implementa la linea de desarrollo L4 (HU-31.002-007/.009-010/.022-023/.026 + HU-35.008-015/.018-020 + HU-30.011/.013/.028/.034/.035, workspace jerarquico, busqueda Ctrl+F y autosalvado) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda6/linea-4-workspace-jerarquia-busqueda.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda6/README.md.
[resto identico a la plantilla]
```

### L5 — Mapa del sistema y gestion del arbol OPD

```text
Implementa la linea de desarrollo L5 (HU-21.001-011/.015 + HU-20.014/.017-022, mapa del sistema y gestion del arbol OPD) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda6/linea-5-mapa-sistema-drag-drop-opd.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda6/README.md.
[resto identico a la plantilla]
```

### L6 — Estilo completo, tabla y propiedades de enlaces

```text
Implementa la linea de desarrollo L6 (HU-14.004-008/.012-014, HU-16.001-007/.010/.012-018/.021, HU-11.015/.018-020/.023/.025, estilo completo, tabla y propiedades de enlaces) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda6/linea-6-enlaces-estilo-tabla-propiedades.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda6/README.md.
[resto identico a la plantilla]
```

## Notas operativas

- **Aislamiento**: si las lineas corren de verdad en paralelo, usar worktrees por linea. El repo compartido puede contener cambios no relacionados; no revertirlos.
- **Orden de merge sugerido**: L1 -> L4 -> L3 -> L5 -> L6 -> L2, con `bun run check` (y smoke si toco UI/render) despues de cada merge. Rationale completo en README §6.
- **Coherencia metodologica**: toda linea debe reciclar evidencia de `opm-extracted/` y SSOT antes de crear una solucion propia.
- **Cascadas anticipadas**:
  - `MenuPrincipal.tsx` lo tocan L3, L4, L5 y L6 (cada una agrega una entrada). Resolver via append en orden de merge; no reorganizar.
  - `proyeccion.ts` lo tocan L2, L5 y L6. Cada una extrae a helper nuevo; el archivo solo queda como punto de composicion. Si dos colisionan, hacer rebase trivial.
  - `serializacion/json.ts` lo tocan L3, L4, L5 y L6 (campos opcionales). Roundtrip lossless garantizado por tests aditivos.
  - `store.ts` lo tocan todas excepto L1. Cada una agrupa acciones por dominio y NO reordena bloques existentes.
  - `InspectorEnlace.tsx` lo tocan L2 y L6. L6 deja un slot estable al pie ("inspector-enlace-footer"); L2 monta su boton en ese slot.
- **Atajos globales coordinados**: Ctrl+F = L4 (Buscar Cosas del Modelo). L2 puede usar Ctrl+Shift+F para busqueda local en panel OPL. Ctrl+D = L5 (Gestion del Arbol). Ctrl+S = ya cableado por L2 ronda 5; L4 lo respeta tal cual.
- **Reporte unificado**: cada agente debe devolver hashes, tests, decisiones y bloqueos para que la consolidacion reescriba un unico `docs/HANDOFF.md`.
- **Criterio de rechazo**: una linea que toca archivos fuera de su scope sin consultar debe rebasearse o reescribirse antes de mergear.
- **Verificacion final post-ronda 6**: ejecutar `cd app && bun run check && bun run browser:smoke && bun run build`, luego `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real` (que ya deberia reflejar la realidad gracias a L1) y registrar el delta de avance HU.
