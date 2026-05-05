# Prompt mínimo de asignación de línea (ronda 3)

Plantilla genérica para asignar cualquiera de las 5 líneas de la ronda 3 a un agente independiente. Reemplazar `{{LINEA}}` y `{{PATH_BRIEF}}` antes de invocar.

---

## Plantilla

```
Implementa la línea de desarrollo {{LINEA}} de deep-opm-pro.

Brief autoridad: {{PATH_BRIEF}}.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda3/README.md.
Working directory: /home/felix/projects/deep-opm-pro.

Antes de codificar:
1. Lee el brief completo. Las HU listadas son contrato.
2. Lee la SSOT citada (archivos en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/).
3. Revisa los módulos de opm-extracted/ indicados en sección 3 del brief. Política: evidencia y guía estructural, no copiar 1:1.

Reglas duras (no negociables):
- Cambios solo aditivos. No renombrar campos, no cambiar firmas, no romper round-trip JSON con modelos legacy.
- No tocar archivos fuera del scope declarado en sección 4 del brief. Si surge cambio cross-line, DETÉN Y CONSULTA antes de hacerlo.
- Reusa opm-extracted/ como evidencia, no copies bloques 1:1.
- Anclaje SSOT obligatorio en cada decisión semántica con cita explícita.
- Idiomas: comunicación es-CL; código en español/inglés tal como ya está en el codebase.

Loop verde obligatorio antes de cerrar:
- cd app && bun run check    (typecheck + unit tests verde)
- cd app && bun run browser:smoke    (si tocaste UI o render; verde)
- cd app && bun run build    (si tocaste render pesado; verde)

Forma del entregable:
- Commits en la rama actual (no crear branch nueva salvo instrucción explícita).
- Mensajes en imperativo con prefijo feat(...) | test(...) | refactor(...) siguiendo el estilo de git log.
- Co-author footer: "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>" o el footer correspondiente al agente que ejecuta.
- NO tocar docs/HANDOFF.md ni docs/historias-usuario-v2/.

Reporte al cerrar la línea:
- Hashes de commits creados.
- Tests agregados (cantidad + archivos).
- Decisiones documentadas en commit (las listadas en sección 10 del brief).
- Bloqueos pendientes si los hay.
- Confirmación de loop verde.

Si encuentras una HU ambigua: ver "preguntas abiertas" al final de su épica y elegir el camino que minimiza retrabajo, documentando la elección en el commit.

Si encuentras un cambio cross-line necesario que choca con scope de otra línea: DETÉN Y CONSULTA. No mergear "a ciegas".
```

---

## Invocaciones concretas (copia-pega)

### L1 — Firma de Enlace con extremo Estado
```
Implementa la línea de desarrollo L1 (HU-13.014 cascada M0) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda3/linea-1-firma-enlace-estado.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda3/README.md.
[resto idéntico a la plantilla]
```

### L2 — Abanicos lógicos O/XOR
```
Implementa la línea de desarrollo L2 (HU-15.008-012, abanicos O/XOR) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda3/linea-2-abanicos-logicos.md.
[...]
```

### L3 — Modificadores e invocación
```
Implementa la línea de desarrollo L3 (HU-15.015, 15.016, 15.018, 15.019) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda3/linea-3-modificadores-enlace.md.
[...]
```

### L4 — Validaciones BehaviouralRule extendidas
```
Implementa la línea de desarrollo L4 (HU-1C.013-019, 4-5 reglas BehaviouralRule extendidas) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda3/linea-4-validaciones-behavioural.md.
[...]
```

### L5 — Plegado parcial avanzado
```
Implementa la línea de desarrollo L5 (HU-18.004-006, 18.009, 18.010) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda3/linea-5-plegado-parcial-avanzado.md.
[...]
```

---

## Notas operativas

- **Aislamiento**: cada línea trabaja sobre `main`. Si dos líneas se desarrollan en serial, no se requiere branch dedicada. Si se desarrollan en paralelo (agentes simultáneos), considerar `git worktree` para evitar interferencia local. La consolidación final se hace siguiendo el "Protocolo de conciliación" del README (sección 6) — orden de merge: L4 → L1 → L5 → L2 → L3.
- **Coherencia metodológica**: el README es la única fuente de reglas comunes. Los briefs heredan del README sin repetir su contenido. Si una línea propone violar una regla común, la reescritura del README requiere consenso explícito.
- **Reporte mínimo unificado**: cada agente reporta hashes, tests, decisiones y bloqueos. Esto permite consolidar la ronda en un único `docs/HANDOFF.md` reescrito al cierre.
