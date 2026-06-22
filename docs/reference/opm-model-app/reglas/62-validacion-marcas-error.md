# 62 — Validación y marcas de error

**Alcance**: familias de validación, política de canvas limpio, marcadores transitorios de rechazo, conflicto de unicidad nominal, sugerencias automáticas, separación visual de canales.
**Capa SSOT propietaria**: `opm-visual-es.md` §24
**Aplicación en la app**: validador del kernel, panel de validación, UI de feedback.

## Reglas

### R-2600: V-218 — Familias de validación

- Enunciado: la implementación puede distinguir, al menos, estas familias de validación:
  - **Invalidez gramatical**
  - **Advertencia metodológica**
  - **Conflicto de unicidad o identidad**
  - **Conflicto de contención o pertenencia**
  - **Sugerencia automática o inferida**
- Referencia SSOT: V-218
- Aplicación en código: cada hallazgo declara `familia` del conjunto anterior.

### R-2601: V-219 — Política canvas limpio

- Enunciado: en ausencia de declaración contraria, esta adaptación adopta la **política de canvas limpio**: la validación NO deja marcas persistentes sobre el OPD estático una vez cerrado el diálogo o panel de validación. El resultado de validación vive en vistas auxiliares, NO en la gramática nuclear del diagrama.
- Referencia SSOT: V-219
- Aplicación en código: panel lateral o vista auxiliar muestra hallazgos; el canvas no se marca por defecto.

### R-2602: V-220 — Distintivos persistentes como gramática de vista

- Enunciado: si una implementación opta por dejar distintivos persistentes de validación sobre el canvas, DEBE declararlos como **gramática de vista separada** y NO puede mezclarlos con:
  - designaciones de estado
  - actividad de simulación
  - afordances de edición
- Referencia SSOT: V-220
- Aplicación en código: si se habilita modo "persistente", usar capa reservada con estilo único.

### R-2603: V-221 — Marcador `×` transitorio durante edición

- Enunciado: durante operaciones de arrastre o creación, un enlace inválido puede exhibir un marcador transitorio de rechazo, como `×` roja sobre el conector. Ese marcador NO pertenece al canon-diagrama.
- Referencia SSOT: V-221
- Aplicación en código: `×` solo en modo edición, removido al exportar.

### R-2604: V-222 — Conflicto de unicidad explícito

- Enunciado: todo conflicto de unicidad nominal DEBE resolverse de manera explícita por el modelador o por una opción de **autorrenombrado visible**. NO se admite reescritura silenciosa del nombre como mecanismo de conformidad por defecto.
- Referencia SSOT: V-222
- Aplicación en código: al detectar colisión, UI pide resolución; no renombrar silenciosamente.

### R-2605: V-223 — Sugerencias automáticas como vista derivada

- Enunciado: las comprobaciones metodológicas y las sugerencias automáticas, incluidas las inferidas por analítica o ML, son **vistas derivadas** del modelo. NO forman parte del OPD canónico salvo que una revisión futura de la SSOT les asigne notación propia sobre el canvas.
- Referencia SSOT: V-223
- Aplicación en código: sugerencias en panel de insights, no en canvas.

### R-2606: V-224 — Canales de validación distintos

- Enunciado: los canales de validación, advertencia y sugerencia NO pueden reutilizar sin distinción:
  - el borde discontinuo de afiliación ambiental
  - el contorno grueso de refinamiento
  - las marcas de simulación
  - las decoraciones de enlace
- Referencia SSOT: V-224
- Aplicación en código: estilos de validación usan color/forma reservados exclusivos.

### R-2607: Severidad de hallazgos

- Enunciado: la metodología usa la escala **CRÍTICA / ALTA / MEDIA / BAJA** para hallazgos, alineada aproximadamente con `DEBE / DEBERÍA / PUEDE`.

| Severidad | Correspondencia aproximada |
|---|---|
| CRÍTICA | Regla `DEBE` violada |
| ALTA | Regla `DEBERÍA` violada |
| MEDIA | Advertencia metodológica |
| BAJA | Sugerencia estética o de estilo |

- Referencia SSOT: `metodologia-opm-es.md` §6.11
- Aplicación en código: cada hallazgo tiene `severidad`.

### R-2608: Detección de sinónimos y homónimos

- Enunciado: OPM exige correspondencia 1:1 entre cosas y nombres canónicos. El modelador DEBE usar este formalismo para detectar:
  - **sinónimos** (múltiples palabras para mismo concepto)
  - **homónimos** (misma palabra para conceptos distintos)

Cada sinónimo DEBE resolverse eligiendo un término canónico. Las variantes de superficie admitidas por OPL-ES pueden coexistir editorialmente, pero DEBEN mapear al mismo nombre canónico interno. Cada homónimo DEBE resolverse creando cosas separadas con nombres distintos.

- Referencia SSOT: `metodologia-opm-es.md` §9.15
- Aplicación en código: validador detecta patrones y sugiere resolución.

### R-2609: Detección de inconsistencias texto-diagrama

- Enunciado: el modelado OPM de un documento existente produce como subproducto la detección de inconsistencias entre el texto y sus diagramas. El modelador DEBERÍA documentar estas como hallazgos de calidad.
- Referencia SSOT: `metodologia-opm-es.md` §9.16
- Aplicación en código: salida del validador como reporte de inconsistencias.

### R-2610: Enlaces de precedencia faltantes

- Enunciado: el validador DEBERÍA identificar enlaces de precedencia faltantes (invocación implícita sin orden claro, subprocesos sin transformado).
- Referencia SSOT: `metodologia-opm-es.md` §8.7
- Aplicación en código: regla de validación `SubprocesoSinTransformado`.

### R-2611: Informatividad del modelo (OPPL)

- Enunciado: las sentencias OPPL (Object-Process Pseudo-Language) se clasifican en: **Definición, Estructural, Procedimental, Meta, Desconocida**. Métricas:
  - nivel informativo
  - puntaje ponderado
  - promedio INF
  - total de sentencias OPPL
- Referencia SSOT: `metodologia-opm-es.md` §8.7, `opm-iso-19450-es.md` (glosario E1)
- Aplicación en código: clasificación periódica opcional.

### R-2612: Aplicación de ontología organizacional

- Enunciado: la aplicación de ontología en tres niveles:
  - **Ninguno**: sin restricción terminológica
  - **Sugerir**: sugiere término estándar; el modelador puede ignorar
  - **Forzar**: impide confirmar términos no estandarizados sin elegir una forma canónica
- Referencia SSOT: `metodologia-opm-es.md` §8.7
- Aplicación en código: nivel configurable por proyecto.

### R-2613: Sustitución motivada por ontología trazable

- Enunciado: toda sustitución motivada por ontología organizacional DEBE ser trazable como política de normalización o como metadato reversible. NO debe confundirse con estilado ni con corrección ortográfica silenciosa.
- Referencia SSOT: `metodologia-opm-es.md` §8.7
- Aplicación en código: cada sustitución deja registro.

### R-2614: Familias de validación reflejadas en panel

- Enunciado: el panel de validación DEBERÍA agrupar hallazgos por familia (V-218) y severidad.
- Referencia SSOT: V-218
- Aplicación en código: UI con filtros por familia/severidad.

### R-2615: Edición abortada no invalida el modelo

- Enunciado: si una operación de edición produce un estado inválido transitorio, la herramienta PUEDE rechazar la operación o exhibir el marcador transitorio `×` (V-221). Una vez confirmada, los hallazgos viven en el panel según política canvas limpio.
- Referencia SSOT: V-219, V-221
- Aplicación en código: rollback automático o notificación + hallazgo.

### R-2616: Sugerencia NO forzada

- Enunciado: las sugerencias (incluidas generadas por ML o analítica) requieren **revisión manual**. La salida NO se integra automáticamente al corpus ni al modelo.
- Referencia SSOT: `metodologia-opm-es.md` §13.4
- Aplicación en código: sugerencia como propuesta, requiere `aceptar`.

### R-2617: Comparación de versiones como medio de seguimiento

- Enunciado: el modelador DEBERÍA comparar versiones del modelo para seguimiento de mejoras y detección de regresiones.
- Referencia SSOT: `metodologia-opm-es.md` §8.7
- Aplicación en código: diff entre snapshots del modelo.

### R-2618: Invariantes globales como reglas automáticas

- Enunciado: el validador implementa los invariantes de `metodologia-opm-es.md` §15 marcados como `automático`. Los marcados como `manual` quedan como checklist humano.
- Referencia SSOT: `metodologia-opm-es.md` §15
- Ver: `99-invariantes-verificaciones.md`.

### R-2619: Mensajes de validación con capa propietaria

- Enunciado: cada hallazgo DEBERÍA identificar la capa propietaria de la regla (opm-es / opl-es / opd-es / manual) para facilitar trazabilidad.
- Referencia SSOT: `metodologia-opm-es.md` §15 columna "Capa propietaria"
- Aplicación en código: campo `capa` en cada hallazgo.

### R-2620: Cierre de brecha objeto-proceso

- Enunciado: el modelador DEBE conectar vistas de estructura y comportamiento. Documentos orientados a procesos frecuentemente omiten objetos implícitos; forzar la pregunta "¿qué objeto transforma este proceso?" revela entidades críticas.
- Referencia SSOT: `metodologia-opm-es.md` §8.5
- Aplicación en código: regla `ProcesoSinObjetosImplicitos`.

## Checklist

- [ ] Familias de validación: invalidez/advertencia/unicidad/contención/sugerencia
- [ ] Política canvas limpio implementada
- [ ] Distintivos persistentes como gramática de vista separada si aplica
- [ ] Marcador `×` solo en edición, no en canon
- [ ] Conflicto de unicidad resuelto explícitamente
- [ ] Sugerencias automáticas como vistas derivadas
- [ ] Canales de validación no reutilizan canales reservados
- [ ] Escala de severidad CRÍTICA/ALTA/MEDIA/BAJA
- [ ] Detección de sinónimos y homónimos
- [ ] Aplicación de ontología configurable (Ninguno/Sugerir/Forzar)
- [ ] Sustituciones por ontología trazables
- [ ] Hallazgos agrupados por familia/severidad
- [ ] Sugerencias requieren aceptación humana
- [ ] Invariantes `automáticos` en validador

## Antipatrones

- Marcar un enlace inválido con borde rojo persistente (viola canvas limpio sin declaración)
- Renombrar silenciosamente al detectar colisión
- Sugerencia ML integrada automáticamente sin revisión
- Usar borde discontinuo para marcar "inválido" (colisiona con ambiental)
- Validación que mezcla enlaces con marcas de simulación
- Sugerencias como canon del modelo

## Referencias cruzadas

- UI y canal reservado: `60-ui-afordances-canvas.md`
- Estilado autoral: `61-estilado-autoral.md`
- Nombres y unicidad: `41-metamodelo-apariencia-existencia.md`, `70-opl-convenciones-y-plantillas-cosa-estado.md`
- Heurísticas (sinónimos/homónimos): `83-metodologia-heuristicas-avanzadas.md`
- Invariantes globales: `99-invariantes-verificaciones.md`
- Gobernanza: `82-metodologia-complejidad-gobernanza.md`
