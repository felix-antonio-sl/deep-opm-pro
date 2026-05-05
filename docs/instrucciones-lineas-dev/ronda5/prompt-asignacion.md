# Prompt minimo de asignacion de linea (ronda 5)

Plantilla generica para asignar cualquiera de las 6 lineas de la ronda 5 a un agente independiente. Reemplazar `{{LINEA}}` y `{{PATH_BRIEF}}`.

## Plantilla

```text
Implementa la linea de desarrollo {{LINEA}} de deep-opm-pro.

Brief autoridad: {{PATH_BRIEF}}.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda5/README.md.
Working directory: /home/felix/projects/deep-opm-pro.

Antes de codificar:
1. Lee el brief completo. Las HU listadas son contrato.
2. Lee la SSOT citada en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/.
3. Revisa en profundidad opm-extracted/ segun el brief: INDEX.md, MODULES.md, README.md, REFACTOR-NOTES.md, assets/INDEX.md y modulos src/ citados.
4. Revisa el estado actual de app/src antes de editar. No asumas que el codigo coincide con rondas historicas; verifica.
5. Revisa assets/svg/ y docs/JOYAS.md antes de redibujar cualquier marcador, icono o shape.

Reglas duras no negociables:
- Cambios solo aditivos. No renombrar campos existentes, no romper JSON legacy, no reordenar APIs publicas sin necesidad.
- No tocar archivos fuera del scope declarado en seccion 4 del brief.
- No copiar bloques 1:1 desde opm-extracted/. Usalo como evidencia y guia estructural.
- Cada decision semantica debe citar SSOT o documento interno trazable.
- No tocar docs/HANDOFF.md ni docs/historias-usuario-v2/.
- Mantener la logica nueva en helper/modulo de dominio nuevo siempre que el brief lo indique.
- Idiomas: documentacion y mensajes en es-CL; identificadores segun estilo actual del codigo.
- No introducir backend, Firebase, auth, Rappid ni dependencias nuevas.

Loop verde obligatorio antes de cerrar:
- cd app && bun run check
- cd app && bun run browser:smoke    (si tocaste UI/render)
- cd app && bun run build            (si tocaste proyeccion JointJS o serializacion)

Forma del entregable:
- Commits en la rama actual, salvo instruccion explicita de worktree/branch.
- Mensajes imperativos con prefijo feat(...) | test(...) | refactor(...).
- Reportar hashes de commits, tests agregados, comandos ejecutados, decisiones tomadas y bloqueos.
- Confirmar que no tocaste HANDOFF ni HU.

Si surge un cambio cross-line fuera del scope, detente y consulta. No lo resuelvas por invasion silenciosa.
```

## Invocaciones concretas

### L1 — OPL interactivo inverso

```text
Implementa la linea de desarrollo L1 (HU-50.002/HU-50.017/HU-50.018/HU-50.019/HU-50.020/HU-50.022, OPL interactivo inverso) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda5/linea-1-opl-interactivo-inverso.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda5/README.md.
[resto identico a la plantilla]
```

### L2 — Workspace local y dialogos de archivo

```text
Implementa la linea de desarrollo L2 (HU-30.001/HU-30.005/HU-30.006/HU-30.009/HU-30.010/HU-30.013/HU-30.015/HU-30.018 + HU-34.001/HU-34.004-HU-34.008, workspace local y dialogos de archivo) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda5/linea-2-workspace-persistencia-local.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda5/README.md.
[resto identico a la plantilla]
```

### L3 — Eliminacion segura de OPDs hoja

```text
Implementa la linea de desarrollo L3 (HU-20.015/HU-20.016, eliminacion segura de OPDs hoja) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda5/linea-3-eliminacion-segura-opds.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda5/README.md.
[resto identico a la plantilla]
```

### L4 — Bus de agregacion y etiquetas de enlace

```text
Implementa la linea de desarrollo L4 (HU-11.004/HU-11.014, bus de agregacion y etiquetas de enlace) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda5/linea-4-bus-agregacion-etiquetas.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda5/README.md.
[resto identico a la plantilla]
```

### L5 — Creacion interna correcta en contenedor

```text
Implementa la linea de desarrollo L5 (HU-1C.004, creacion interna correcta en contenedor) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda5/linea-5-creacion-interna-contenedor.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda5/README.md.
[resto identico a la plantilla]
```

### L6 — Estilo visual editable de cosas

```text
Implementa la linea de desarrollo L6 (HU-14.001/HU-14.002/HU-14.003/HU-14.015/HU-14.017, estilo visual editable de cosas) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda5/linea-6-estilo-visual-cosas.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda5/README.md.
[resto identico a la plantilla]
```

## Notas operativas

- **Aislamiento**: si las lineas corren de verdad en paralelo, usar worktrees por linea. El repo compartido puede contener cambios no relacionados; no revertirlos.
- **Orden de merge**: L2 -> L3 -> L5 -> L4 -> L6 -> L1, con `bun run check` despues de cada merge.
- **Coherencia metodologica**: toda linea debe reciclar evidencia de `opm-extracted/` y SSOT antes de crear una solucion propia.
- **Reporte unificado**: cada agente debe devolver hashes, tests, decisiones y bloqueos para que la consolidacion reescriba un unico `docs/HANDOFF.md`.
- **Criterio de rechazo**: una linea que toca archivos fuera de su scope sin consultar debe rebasearse o reescribirse antes de mergear.
