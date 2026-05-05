# Prompt mínimo de asignación de línea (ronda 4)

Plantilla genérica para asignar cualquiera de las 5 líneas de la ronda 4 a un agente independiente. Reemplazar `{{LINEA}}` y `{{PATH_BRIEF}}`.

## Plantilla

```text
Implementa la línea de desarrollo {{LINEA}} de deep-opm-pro.

Brief autoridad: {{PATH_BRIEF}}.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda4/README.md.
Working directory: /home/felix/projects/deep-opm-pro.

Antes de codificar:
1. Lee el brief completo. Las HU listadas son contrato.
2. Lee la SSOT citada en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/.
3. Revisa en profundidad opm-extracted/ según el brief: INDEX.md, MODULES.md, README.md, REFACTOR-NOTES.md, assets/INDEX.md y módulos src/ citados.
4. Revisa el estado actual de app/src antes de editar. No asumas que ronda 3 está en el estado del brief histórico; verifica.

Reglas duras no negociables:
- Cambios solo aditivos. No renombrar campos, no cambiar firmas públicas, no romper JSON legacy.
- No tocar archivos fuera del scope declarado en sección 4 del brief.
- No copiar bloques 1:1 desde opm-extracted/. Úsalo como evidencia y guía estructural.
- Cada decisión semántica debe citar SSOT o documento interno trazable.
- No tocar docs/HANDOFF.md ni docs/historias-usuario-v2/.
- Mantener la lógica nueva en helper/módulo de dominio nuevo siempre que el brief lo indique.
- Idiomas: documentación y mensajes en es-CL; identificadores según estilo actual del código.

Loop verde obligatorio antes de cerrar:
- cd app && bun run check
- cd app && bun run browser:smoke    (si tocaste UI/render)
- cd app && bun run build            (si tocaste proyección JointJS pesada)

Forma del entregable:
- Commits en la rama actual, salvo instrucción explícita de worktree/branch.
- Mensajes imperativos con prefijo feat(...) | test(...) | refactor(...).
- Reportar hashes de commits, tests agregados, comandos ejecutados, decisiones tomadas y bloqueos.
- Confirmar que no tocaste HANDOFF ni HU.

Si surge un cambio cross-line fuera del scope, detente y consulta. No lo resuelvas por invasión silenciosa.
```

## Invocaciones concretas

### L1 — Conectores lógicos canónicos O/XOR

```text
Implementa la línea de desarrollo L1 (HU-15.010/HU-15.011, conectores lógicos canónicos O/XOR) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda4/linea-1-conectores-logicos-canonicos.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda4/README.md.
[resto idéntico a la plantilla]
```

### L2 — Gesto directo a cápsula de estado

```text
Implementa la línea de desarrollo L2 (HU-13.014, gesto directo a cápsula de estado) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda4/linea-2-gesto-directo-capsula-estado.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda4/README.md.
[resto idéntico a la plantilla]
```

### L3 — Rutas y abanicos a estados

```text
Implementa la línea de desarrollo L3 (HU-15.013 + HU-15.005/HU-15.007, ramas a estados y rutas) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda4/linea-3-rutas-y-abanicos-a-estados.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda4/README.md.
[resto idéntico a la plantilla]
```

### L4 — Auto-invocación con demora por defecto

```text
Implementa la línea de desarrollo L4 (HU-15.020, auto-invocación con demora default 1s) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda4/linea-4-auto-invocacion-demora.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda4/README.md.
[resto idéntico a la plantilla]
```

### L5 — Plegado parcial nesting y filas activas

```text
Implementa la línea de desarrollo L5 (HU-18.008/HU-18.014/HU-18.015 + Q18.1, plegado nesting y filas activas) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda4/linea-5-plegado-nesting-filas-activas.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda4/README.md.
[resto idéntico a la plantilla]
```

## Notas operativas

- **Aislamiento**: si las líneas corren de verdad en paralelo, usar worktrees por línea. El repo compartido contiene cambios no relacionados en `docs/roadmap/` y skills locales; no revertirlos.
- **Orden de merge**: L1 → L2 → L3 → L4 → L5, con `bun run check` después de cada merge.
- **Reporte unificado**: cada agente debe devolver hashes, tests, decisiones y bloqueos para que la consolidación reescriba un único `docs/HANDOFF.md`.
- **Criterio de rechazo**: una línea que toca archivos fuera de su scope sin consultar debe rebasearse o reescribirse antes de mergear.
