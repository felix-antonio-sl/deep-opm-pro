# Prompt minimo de asignacion de linea (ronda 8)

Plantilla generica para asignar cualquiera de las 6 lineas de la ronda 8 a un agente independiente. Reemplazar `{{LINEA}}` y `{{PATH_BRIEF}}`.

## Plantilla

```text
Implementa la linea de desarrollo {{LINEA}} de deep-opm-pro.

Brief autoridad: {{PATH_BRIEF}}.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/README.md.
Working directory: /home/felix/projects/deep-opm-pro.

Esta es una **ronda de refactor radical**: NO se agregan features. NO se reabren contratos. NO se rompen APIs publicas. La forma del repo es lo que escala.

Antes de codificar:
1. Lee el brief completo. Las "deudas que cierra" son contrato.
2. Lee `/home/felix/projects/deep-opm-pro/docs/HANDOFF.md` (especialmente §Decisiones Vigentes y §Cascadas Gestionadas y §Pendientes Inmediatos) para no romper contratos heredados de rondas 1-7.
3. Lee la SSOT citada en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/.
4. Revisa en profundidad opm-extracted/ segun el brief: INDEX.md, MODULES.md, README.md, REFACTOR-NOTES.md y modulos src/ citados con paths absolutos desde repo root + numero de linea.
5. Revisa el estado actual de app/src antes de editar. Hay 122 archivos fuente, ya hubo 7 rondas y la forma del repo cambia rapido; verifica.
6. Revisa el README ronda 8 §4 (diagnostico estructural) y §7 (mapa de archivos por linea) para entender que tocas y que NO tocas.
7. Revisa los briefs de las otras 5 lineas en docs/instrucciones-lineas-dev/ronda8/ para entender el orden de merge sugerido y las dependencias declaradas.
8. Declara tu contrato observable antes de mover codigo: exports publicos, consumidores actuales, tests/goldens que deben permanecer identicos y salidas observables de tu capa (JSON, OPL, `JointCellJson`, `data-testid`, acciones Zustand, chunks Vite o reglas detector).

Reglas duras no negociables (refactor):

- **APIs publicas estables**: NO renombrar funciones exportadas existentes. Si reemplazas una API publica por una nueva, entregas adaptador con misma firma temporalmente y declaras el call site count en commit. NO romper consumidores en commits intermedios.
- **Patron barrel re-export**: los archivos publicos top-level (`store.ts`, `proyeccion.ts`, `serializacion/json.ts`, `opl/generar.ts`, los componentes UI grandes) se reducen a barrel agregador. Su contenido nuevo es importar de los slices y re-exportar. Las APIs publicas no cambian. Esto preserva superficie de importacion, pero no prueba comportamiento. Debes demostrar equivalencia con tests/goldens; comentarios solo para regex del detector no cuentan como evidencia real.
- **Tests existentes intactos**: tests de `store.test.ts`, `proyeccion.test.ts`, `serializacion/json.test.ts`, `opl/generar.test.ts` siguen vivos sin reescribir. Tests aditivos en archivos nuevos. Si un test existente falla post-refactor, es bug — corregir antes de commitear.
- **JSON lossless**: roundtrip permanece intacto. Formato emitido y aceptado no cambia.
- **OPL no importa render**: L4 y cualquier helper OPL derivan desde modelo/OPL, no desde `render/`, `proyeccion.ts`, `JointCellJson` ni JointJS.
- **Idiomas**: documentacion y mensajes en es-CL; identificadores segun estilo actual (camelCase TS, kebab-case data-testid).
- **No introducir librerias nuevas**: ni Zod, jspdf, pdf-lib, react, react-router, papaparse, ni nada. Excepcion en L6: `vite.config.ts` extendido con `manualChunks` (config nativa de Vite, no dep nueva) y `lazy()`/`<Suspense />` desde `preact/compat` (ya esta).
- **Scope estricto**: solo tocar archivos permitidos por el brief §4. Si aparece un cambio cross-line no previsto, detenerse y reportar (no resolver por invasion silenciosa).
- **No tocar archivos sueltos del operador** en working tree raiz, ni `app/scripts/in-vivo-test.mjs` (modified) ni `app/src/render/jointjs/customShapes.ts` ni el directorio `home/`. Son WIP del operador.
- **No copiar bloques 1:1 desde opm-extracted/**. Usalo como evidencia, UX y trazabilidad; cita paths absolutos con lineas cuando aplique.
- **Cada decision arquitectural cita SSOT o documento canonico interno con id de seccion**.
- **No tocar docs/HANDOFF.md, docs/historias-usuario-v2/, docs/JOYAS.md ni docs/instrucciones-lineas-dev/ronda1..7/**.
- **No reabrir contratos de rondas 1-7**: multi-seleccion canonica, modo barra creacion sticky, mapa = vista derivada extendida, multi-pestana sesion-only, bloques OPL jerarquicos, workspace single-user, designaciones de estado, alias/unidad/descripcion/URLs, duracion canonica, plegado parcial persistido, atajos centralizados, divisor arbol/canvas, dialogos custom con captura, OPL-ES como lente derivada, Mapa = vista neutra, abanicos OR/XOR canonicos r=30/r=35.
- **EPICA-70 (OPCAT) y EPICA-91 (tutorial) descartadas del proyecto** desde 2026-05-05. NO incluir.

Loop verde obligatorio antes de cerrar:

- cd app && bun run check
- cd app && bun run browser:smoke    (si tocaste UI/render)
- cd app && bun run build            (si tocaste proyeccion JointJS, serializacion, OPL, vite.config, o cualquier modulo en chunk principal)
- cd /home/felix/projects/deep-opm-pro && node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real (si tocaste el detector — solo L6)

Forma del entregable:

- Commits en la rama actual, salvo instruccion explicita de worktree/branch.
- Mensajes imperativos con prefijo refactor(...) | feat(...) | test(...) | chore(...) en es-CL sin tildes en el subject. La gran mayoria seran `refactor(...)`.
- Reportar hashes de commits, LOC final del barrel, LOC de cada slice/composer/generador/sub-componente, comandos ejecutados, decisiones tomadas (especialmente las de §10 del brief), bloqueos.
- Confirmar que no tocaste HANDOFF, HU, los archivos sueltos del operador ni los briefs de otras lineas.
- Confirmar que ningun test existente se rompio (regresion zero).
- Confirmar que las APIs publicas siguen exactas (verificar consumidores con grep).

Si surge un cambio cross-line fuera del scope, detente y consulta. No lo resuelvas por invasion silenciosa. Si descubris un bug fuera de scope, entregar como patch a /tmp/ y NO commitear (regla del operador).
```

## Invocaciones concretas

### L1 — Slices del store

```text
Implementa la linea de desarrollo L1 (refactor radical de app/src/store.ts de 4006 LOC en 9 slices Zustand por dominio: modelo, seleccion, enlaces, workspaceMod, carpetas, uiPanel, mapa, persistencia, pestanas; `store/tipos.ts` obligatorio para `OpmStore`; `store/runtime.ts` obligatorio para singletons undo/redo/dirty/autosalvado; barrel agregador < 500 LOC; preserva las 18 reglas del detector que apuntan a store.ts; NO toca modelo/operaciones.ts congelado; NO altera APIs publicas) de deep-opm-pro.

Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/linea-1-store-slices.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/README.md.
[resto identico a la plantilla]
```

### L2 — Composers de render

```text
Implementa la linea de desarrollo L2 (refactor radical de app/src/render/jointjs/proyeccion.ts de 1382 LOC en 7 composers por familia: entidad, estados, plegado, enlace, halos, markers, colores; barrel agregador < 200 LOC; preserva tipos publicos RolApariencia/OpmJointMetadata/JointCellJson/OpcionesProyeccion; conserva orden/id/type/selectores/metadata opm de JointCellJson; preserva las 10 reglas del detector que apuntan a proyeccion.ts; NO toca JointCanvas.tsx ni mapaSistema.ts ni abanicoOverlay.ts; NO altera APIs publicas) de deep-opm-pro.

Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/linea-2-render-composers.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/README.md.
[resto identico a la plantilla]
```

### L3 — Validadores de serializacion

```text
Implementa la linea de desarrollo L3 (refactor radical de app/src/serializacion/json.ts de 877 LOC en validadores por dominio: validarEntidades, validarEstados, validarOpds, validarApariencias, validarEnlaces, validarHelpers; si validarHelpers crece, partir en validarGuards/validarNormalizacion/validarIntegridad; barrel agregador < 200 LOC; preserva DocumentoModelo/exportarModelo/hidratarModelo/carpetaIdDeJson y las 11 reglas del detector que apuntan a json.ts; NO toca tipos.ts ni persistencia/* ni nada en modelo/; NO altera el formato JSON emitido ni el roundtrip lossless) de deep-opm-pro.

Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/linea-3-serializacion-validadores.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/README.md.
[resto identico a la plantilla]
```

### L4 — Generadores OPL

```text
Implementa la linea de desarrollo L4 (refactor radical de app/src/opl/generar.ts de 1031 LOC en 7 generadores por familia OPL: estructural, procedural, designaciones, refinamiento, duracionMetadata, abanico, plegado; mas refsHints.ts compartido; barrel agregador < 200 LOC; preserva las 16 reglas del detector que apuntan a generar.ts y exports publicos como generarOpl/generarOplInteractivo/emitirDespliegueOcurren/emitirEspecializacion si existen; NO toca PanelOpl.tsx ni bloquesJerarquicos.ts; NO importa desde render/proyeccion; NO altera el formato OPL emitido) de deep-opm-pro.

Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/linea-4-opl-generadores.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/README.md.
[resto identico a la plantilla]
```

### L5 — UI grandes a sub-componentes

```text
Implementa la linea de desarrollo L5 (refactor radical de 5 componentes UI grandes a sub-componentes con responsabilidad acotada: PanelCarpetas 829 LOC en 4 sub-componentes, ArbolOpd 698 LOC en 3, InspectorEntidad 665 LOC en 8 secciones, InspectorEnlace 715 LOC en 6 secciones, PanelOpl 515 LOC en 2; cada barrel TSX < 350 LOC; preserva TODOS los data-testid existentes; NO altera comportamiento UI ni acciones invocadas del store; mantiene disciplina de selectores: barrels leen amplio, leaves props/callbacks o selector por id acotado; PanelCarpetas queda prop-driven; NO introduce libreria CSS-in-JS) de deep-opm-pro.

Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/linea-5-ui-subcomponentes.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/README.md.
[resto identico a la plantilla]
```

### L6 — Code splitting Vite + recalibracion del detector

```text
Implementa la linea de desarrollo L6a (code splitting de Vite con manualChunks que separa vendor-jointjs vendor-preact vendor-zustand y feature-mapa feature-asistente feature-dialogos-pesados feature-modales; lazy y Suspense de Preact para componentes pesados montados solo por flags reales; recalibracion declarativa del detector progress-dashboard.mjs preservando las 45 reglas matcheadas actuales y agregando reglas tolerantes para alias/unidad/descripcion/URLs designaciones de estado duracion canonica atajos centralizados multi-seleccion+batch workspace+pestanas; objetivo L6a: no caer bajo 45 reglas; objetivo post-consolidacion L6b: detector >= 50/55; bundle objetivo < 600 KB chunk principal + chunk JointJS separado; aterriza PRIMERO de la ronda) de deep-opm-pro.

Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/linea-6-build-detector.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/README.md.
[resto identico a la plantilla]
```

## Notas operativas

- **Aislamiento**: si las lineas corren de verdad en paralelo, usar worktrees por linea (`git worktree add ../deep-opm-pro-l1 main`). El repo compartido puede contener cambios no relacionados; no revertirlos. Los archivos sueltos del operador y `customShapes.ts` se ignoran en cada worktree.
- **Orden de merge sugerido**: **L6a → L3 → L2 → L4 → L5 → L1 → L6b/consolidacion**, con `bun run check` (y smoke si toco UI/render, y build si toco bundle) despues de cada merge. Rationale completo en README §8. Reservar el ultimo commit del ciclo para una capa explicita de **cascadas resueltas** (rondas 6 y 7 demostraron que es ineludible: ajustes de imports, fixes de tests que esperaban paths viejos, tipos compartidos, detector final, etc.).
- **Coherencia metodologica**: toda linea debe reciclar evidencia de `opm-extracted/` y SSOT antes de crear una solucion propia. La cita debe ser path absoluto desde repo root + lineas cuando aplique.
- **Cascadas anticipadas en consolidacion**:
  - **Imports rotos**: si un consumidor importaba un nombre interno (no publico) que ahora vive en otro modulo. Solucion: dejarlo re-exportado desde el barrel.
  - **Tests existentes que esperan substrings exactos**: el barrel debe preservarlos. Si un test mira `expect(modulo).toContain("foo")` y `foo` ahora esta en un slice, el test sigue pasando si el barrel re-exporta el slice (TS lo une transparentemente). Si el test mira la salida JSON o un string, no se altera.
  - **Tipos cross-modulo**: si dos slices definen tipos auxiliares con el mismo nombre. Solucion: prefijar tipos locales (`SeleccionPortapapelesInterno`) o promoverlos a `tipos.ts` (con cuidado, NO se modifica salvo que sea contrato).
  - **Side-effect imports en chunks lazy**: si un componente lazy depende de un side-effect (ej. extender `joint.dia.Paper.prototype`), debe garantizarse que ese side-effect ya corrio antes de que el chunk se evalue. Solucion: side-effects globales en `main.tsx` o `App.tsx` (chunk principal); chunks lazy solo contienen UI puro.
  - **Detector cae 1-2 reglas**: si una regla esperaba un string en un archivo monolitico y ese string ahora vive en un slice. Solucion: actualizar la regla para usar `any`/`evidenciaExtra` con multiples paths posibles, o restaurar el string en el barrel via comentario documental + re-export temporal. El comentario no reemplaza evidencia real.
- **Atajos globales coordinados** (heredados ronda 7, no se reabren):
  - `Ctrl+S/Z/Y/Shift+Z`, `Ctrl+F/Shift+F/D/T/W/Tab`, `Ctrl+0`, `Ctrl+rueda`, `Ctrl+arrows`, `Ctrl+A/C/V`, `Delete/Esc/Flechas/Shift+Flechas` ya estan registrados en `ui/atajosTeclado.ts`. NO duplicar registro en sub-componentes.
- **Reporte unificado**: cada agente debe devolver hashes, LOC, tests, decisiones y bloqueos para que la consolidacion reescriba un unico `docs/HANDOFF.md`.
- **Criterio de rechazo**: una linea que toca archivos fuera de su scope sin consultar debe rebasearse o reescribirse antes de mergear. Una linea que rompe APIs publicas o el roundtrip lossless o un test existente debe corregirse antes de mergear.
- **Verificacion final post-ronda 8**: ejecutar `cd app && bun run check && bun run browser:smoke && bun run build`, luego `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real` y registrar el delta de cobertura HU. Linea base post-ronda 7: 481 unit tests / 2206 expect, 40/40 smoke (44.3 s), bundle 1045 KB / 295 KB gzip, detector 45/49 reglas. Objetivo conservador post-ronda 8:
  - Unit tests >= 510 verdes (sin regresion).
  - Smoke >= 40 verdes (sin regresion).
  - Bundle: chunk principal < 600 KB / < 240 KB gzip; chunk JointJS separado < 700 KB / < 250 KB gzip.
  - Detector >= 50 / 55 reglas matcheadas (post-merge final).
  - LOC: store.ts < 500 (tope < 1500), proyeccion.ts < 200 (tope < 600), generar.ts < 200 (tope < 500), serializacion/json.ts < 200 (tope < 400). UI grandes: PanelCarpetas < 350, ArbolOpd < 300, InspectorEntidad < 300, InspectorEnlace < 300, PanelOpl < 200.
  - Cada linea cumple los objetivos de su brief o declara desviaciones explicitas con rationale.
  - APIs publicas sin cambios; consumidores funcionando sin patch.
  - `docs/HANDOFF.md` permanece intacto durante las lineas; se actualiza solo en consolidacion final.
