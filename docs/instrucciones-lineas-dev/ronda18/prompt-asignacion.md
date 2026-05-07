# Prompt mínimo de asignación de pasada (ronda 18)

Plantilla genérica para asignar las pasadas P1 / P2 / P3 de la única línea de la ronda 18 (`L1 — Refactor visual chrome (post-Beta1)`) a un agente independiente. Reemplazar `{{PASADA}}` y los placeholders antes de invocar.

> **Particularidad de la ronda 18**: una sola línea con 3 pasadas seriales. La plantilla se aplica una vez por pasada, en orden P1 → P2 → P3, con audit visual obligatorio entre pasada y pasada antes de avanzar.

---

## Plantilla

```
Implementa la pasada {{PASADA}} de la línea L1 (refactor visual chrome) de deep-opm-pro.

Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda18/linea-1-refactor-visual-chrome.md (sección 6.{{N}}).
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda18/README.md.
Bug origen: /home/felix/projects/deep-opm-pro/docs/bugs/BUG-20260507T212356Z-692129/.
Working directory: /home/felix/projects/deep-opm-pro.

Antes de codificar:
1. Lee el brief completo, especialmente la sección 6.{{N}} de la pasada y la sección 4 (archivos permitidos).
2. Lee el bug origen (report.md + screenshots) para entender el FAIL visual concreto.
3. Lee tokens.ts en /home/felix/projects/deep-opm-pro/app/src/ui/tokens.ts. Es la SSOT de esta línea.
4. Revisa los módulos de opm-extracted/ indicados en sección 3 del brief. Política: evidencia y guía estructural, no copiar 1:1.
5. Antes de tocar código, ejecuta:
     rg -n "data-testid=" <archivos-de-la-pasada>
     rg -n "<testId-relevante>" app/e2e
   para mapear dependencias smoke. Cada testId que viva en un control modificado debe seguir existiendo en el JSX final.

Reglas duras (no negociables):
- Cambios solo aditivos en API: no renombrar exports, no cambiar firmas de componentes.
- Preservar todos los data-testid y aria-label actuales. Si una acción se mueve al menú "⋯ Más", el testId se reemite desde el item del menú con el mismo nombre.
- Tokens existentes únicamente. Cero hex literales nuevos fuera de tokens.ts.
- No tocar archivos fuera de la sección 4 del brief. Si surge cambio cross-pasada, DETÉN Y CONSULTA.
- No tocar dominio funcional (modelo, store, canvas, render, serialización, opl).
- Reusa opm-extracted/ como evidencia, no copies 1:1.
- Idiomas: comunicación es-CL; identificadores de código tal como están.

Loop verde obligatorio antes de cerrar la pasada:
- cd app && bun run check         (typecheck + 283 unit verde)
- cd app && bun run browser:smoke (34 smoke verde)
- cd app && bun run build         (~843 KB ± 5%)

Audit visual in-vivo OBLIGATORIO antes de mergear la pasada:
- Skill: test-vivo-iterativo-opmkv
- Foco: <superficie de la pasada (ver brief sección 7)>
- Criterios: derivados de BUG-20260507T212356Z-692129 + mockup del brief sección 6.{{N}}
- Salida esperada: reporte ejecutivo con verdict CLEAR para los criterios de la pasada, sin nuevos FAIL.

Si el audit reporta FAIL/WARN: itera dentro de la misma pasada hasta cerrar el criterio. NO avances a la siguiente pasada con audit en rojo.

Forma del entregable:
- 1 commit en main (rama actual, no crear branch nueva salvo instrucción explícita).
- Mensaje en imperativo con prefijo style(...) | refactor(...). Estructura propuesta en sección 11 del brief.
- Cierra parcial o totalmente el bug ID en el cuerpo del commit, con referencia al audit visual.
- Co-author footer: "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>" o el footer correspondiente al agente que ejecuta.
- NO tocar docs/HANDOFF.md ni docs/historias-usuario-v2/.

Reporte al cerrar la pasada:
- Hash del commit creado.
- Loop verde: check / smoke / build con resultados.
- Audit visual: ruta del reporte generado por test-vivo-iterativo-opmkv y verdict.
- Decisiones tomadas (de la sección 10 del brief) con rationale.
- Bloqueos pendientes si los hay.

Si encuentras un cambio cross-pasada necesario que choca con scope de otra pasada: DETÉN Y CONSULTA. No mergear "a ciegas".
```

---

## Invocaciones concretas (copia-pega)

### P1 — Inspector vacío + file picker
```
Implementa la pasada P1 de la línea L1 (refactor visual chrome) de deep-opm-pro.
Pasada: Inspector vacío + file picker (sección 6.1 del brief).
Archivos: app/src/ui/Inspector.tsx, app/src/ui/PersistenciaJson.tsx, app/src/ui/inspectorStyles.ts.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda18/linea-1-refactor-visual-chrome.md (sección 6.1).
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda18/README.md.
Bug origen: /home/felix/projects/deep-opm-pro/docs/bugs/BUG-20260507T212356Z-692129/.

Foco audit visual P1: "Inspector vacío legible (jerarquía título / body / card de atajos visible) y file picker con nombre de archivo no truncado".

[resto idéntico a la plantilla, reemplazando {{PASADA}}=P1, {{N}}=1]
```

### P2 — Cabecera panel OPL
```
Implementa la pasada P2 de la línea L1 (refactor visual chrome) de deep-opm-pro.
Pasada: Cabecera panel OPL (sección 6.2 del brief).
Archivos: app/src/ui/panelOpl/Toolbar.tsx.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda18/linea-1-refactor-visual-chrome.md (sección 6.2).
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda18/README.md.
Bug origen: /home/felix/projects/deep-opm-pro/docs/bugs/BUG-20260507T212356Z-692129/.

Precondición: P1 mergeada y su audit visual CLEAR.

Foco audit visual P2: "Cabecera OPL en 3 clusters separados visualmente (chrome | display | consulta), search input ≥180px, toggle Filtrar por selección con divider, sin solapamiento ni truncamiento".

[resto idéntico a la plantilla, reemplazando {{PASADA}}=P2, {{N}}=2]
```

### P3 — Toolbar superior
```
Implementa la pasada P3 de la línea L1 (refactor visual chrome) de deep-opm-pro.
Pasada: Toolbar superior (sección 6.3 del brief).
Archivos: app/src/ui/toolbar/ToolbarBase.tsx, app/src/ui/toolbar/ToolbarCreacion.tsx, app/src/ui/toolbar/toolbarStyles.ts.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda18/linea-1-refactor-visual-chrome.md (sección 6.3).
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda18/README.md.
Bug origen: /home/felix/projects/deep-opm-pro/docs/bugs/BUG-20260507T212356Z-692129/.

Precondición: P1 y P2 mergeadas y sus audits visuales CLEAR.

Verificación previa obligatoria antes de eliminar el botón "Config grid" en banda:
   rg -n 'data-testid="config-grid"' app/e2e
Si algún smoke depende del en-banda, dejar el botón y aliviar la toolbar moviendo otras acciones; documentar la decisión en commit.

Foco audit visual P3: "Toolbar superior en clusters legibles (Crear · Historia · Modelo · Enlace · Vista · Más), sin truncamiento de Auto-layout, sin Crear varios * en banda, dividers visibles, tipografía consistente".

[resto idéntico a la plantilla, reemplazando {{PASADA}}=P3, {{N}}=3]
```

---

## Notas operativas

- **Aislamiento**: las 3 pasadas son **seriales sobre `main`**, no paralelas. No usar `git worktree` salvo que el operador pida explícitamente paralelismo. Razón: cada pasada cierra con audit visual obligatorio antes de la siguiente, y el orden P1 → P2 → P3 está dictado por blast radius creciente.
- **Coherencia metodológica**: el README es la única fuente de reglas comunes. El brief hereda del README sin repetir su contenido. Si una pasada propone violar una regla común, **detenerse y consultar** antes de codificar — la reescritura del README requiere consenso explícito.
- **Reporte mínimo unificado al cierre de la línea**: tres reportes (uno por pasada) con hash, loop verde, audit visual, decisiones, bloqueos. Esto permite consolidar la ronda en `docs/HANDOFF.md` reescrito al cierre con la nota "BUG-20260507T212356Z-692129 cerrado por L1 ronda 18".
- **Si un audit visual reporta un nuevo problema fuera del scope de la pasada** (ej. icono "Traer" superpuesto en `ToolbarMapaSistema.tsx`): se anota como bug nuevo en `docs/bugs/`, **no se mete a esta ronda**. El operador decide si entra a la siguiente.
- **Si una pasada se atasca en audit FAIL repetido**: documentar el FAIL persistente en el commit y consultar al operador antes de seguir iterando. No avanzar a la siguiente pasada con FAIL no resuelto.
