# Baseline HU v2 — 2026-05-16

Este corte compara el estado completo del proyecto contra `docs/historias-usuario-v2/`.
Usa dos niveles:

- **Piso script:** resultado reproducible de `progress-dashboard.mjs --sync-real`.
- **Overlay LLM mínimo probado:** arbitraje semántico sobre divergencias de alto impacto donde hay evidencia directa de implementación + test/smoke, pero el script no matchea la UI/código actual.

## Resultado Ejecutivo

| Lectura | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---:|---:|---:|---:|---:|---:|
| Piso script | 1126 | 246 | 10 | 492 | 378 | 22.0% |
| Overlay LLM mínimo probado | 1126 | 313 | 20 | 415 | 378 | 28.1% |

El baseline reproducible del repositorio hoy es el piso script. El estado funcional real no está en 22.0%: el arbitraje prueba al menos 67 HU adicionales cubiertas y 10 parciales que el script deja como pendientes. Por tanto, el corte honesto queda en una banda conservadora: **22.0% auditado automáticamente, 28.1% mínimo funcional probado**.

## Cortes

| Corte | Piso script | Overlay LLM mínimo probado |
|---|---:|---:|
| MVP-alpha | 80.4% | 85.3% |
| MVP-beta | 38.7% | 52.4% |
| MVP-gamma | 16.7% | 25.0% |
| MVP-delta | 0.0% | 0.0% |

## Prioridades

| Prioridad | Piso script | Overlay LLM mínimo probado |
|---|---:|---:|
| M0 | 70.9% | 85.1% |
| M1 | 52.6% | 63.5% |
| S | 15.6% | 21.0% |
| C | 3.9% | 8.0% |
| W | 0.0% | 0.0% |

## Diagnóstico Del Auditor

- El dashboard se regeneró el 2026-05-16T20:25:38.868Z.
- La auditoría automática matcheó 79/102 reglas sobre 529 archivos fuente.
- Hay un warning de backlog: `HU-13.005` está duplicada entre `docs/historias-usuario-v2/epicas/epica-13-canvas-estados.md:118` y `docs/historias-usuario-v2/shared/HU-SHARED-001-menu-contextual.md:91`; el script conserva la ocurrencia de épica 13.
- La caída del dashboard respecto a cortes anteriores es mayormente subreporte de reglas obsoletas, no regresión funcional comprobada.

## Arbitraje LLM Principal

| Alcance | Script | LLM mínimo | Evidencia | Motivo de divergencia |
|---|---:|---:|---|---|
| `HU-SHARED-007` Eco OPL-ES | pendiente | cubierto | `app/src/ui/PanelOpl.tsx:37`, `app/src/ui/PanelOpl.tsx:69`, `app/src/ui/PanelOpl.tsx:165`, `app/e2e/03-opl-panel.spec.ts:94` | Regla busca `panel-opl-editor-libre`, pero la UI actual usa `panel-opl-editar-libre` y aplica preview + cambios al canvas. |
| EP16 Tabla de Enlaces | 0/17 cubiertas | 13 cubiertas, 2 parciales, 2 pendientes | `app/src/ui/TablaEnlaces.tsx:200`, `app/src/ui/TablaEnlaces.tsx:326`, `app/src/ui/TablaEnlaces.tsx:593`, `app/src/ui/TablaEnlaces.tsx:612`, `app/e2e/11-beta1-tabla-enlaces.spec.ts:55`, `app/e2e/11-beta1-tabla-enlaces.spec.ts:141`, `app/e2e/11-beta1-tabla-enlaces.spec.ts:182`, `app/e2e/11-beta1-tabla-enlaces.spec.ts:258` | No hay reglas automáticas para la tabla densa actual; cubre listado, filtros, edición, borrado, navegación y foco visual. Parcial: selector canónico de etiqueta/multiplicidad no es aún selector formal. |
| EP21 Mapa del Sistema | 0/18 cubiertas | 16 cubiertas, 2 parciales | `app/src/render/jointjs/mapaSistema.test.ts:67`, `app/src/render/jointjs/mapaSistema.test.ts:119`, `app/src/render/jointjs/mapaSistema.test.ts:131`, `app/e2e/04-arbol-y-pestanas.spec.ts:150` | El mapa existe con descriptor, thumbnails, filtros, estadísticas, export SVG y smoke browser; el dashboard no tiene regla efectiva para EP21. |
| EP33 Plantillas | 0/22 cubiertas | 12 cubiertas, 10 pendientes | `app/e2e/08-mvp-alpha-residual.spec.ts:394`, `app/e2e/08-mvp-alpha-residual.spec.ts:429`, `app/e2e/08-mvp-alpha-residual.spec.ts:463`, `app/e2e/08-mvp-alpha-residual.spec.ts:480` | Regla espera rutas/tokens antiguos; los smokes prueban guardar, catálogo, búsqueda, inserción, sufijos, sub-OPD, foco y cancelación. |
| EP35 Buscar Cosas | 0/20 cubiertas | 8 cubiertas, 3 parciales, 9 pendientes | `app/src/ui/MenuPrincipal.tsx:75`, `app/e2e/11-beta1-busqueda.spec.ts:19`, `app/e2e/11-beta1-busqueda.spec.ts:63`, `app/e2e/11-beta1-busqueda.spec.ts:106`, `app/e2e/11-beta1-busqueda.spec.ts:157` | Ctrl+F intra-modelo está implementado y probado para entidades, estados, enlaces, salto de OPD y selección; quedan pendientes flujos de mover modelos/workspace. |
| EP1C Validaciones | 0/17 cubiertas | 7 cubiertas, 1 parcial | `app/src/modelo/checkers.ts:53`, `app/src/modelo/checkers.ts:67`, `app/e2e/11-beta1-validacion-metodologica.spec.ts:19`, `app/e2e/11-beta1-validacion-metodologica.spec.ts:94`, `app/e2e/11-beta1-validacion-metodologica.spec.ts:239` | Regla busca `PanelAvisos`; la implementación vigente es `PanelDiagnostico` + `ErrorBadge` + checkers SSOT. |
| EP34 / `HU-30.017` Nuevo Modelo | parcialmente detectado | +5 cubiertas, +2 parciales | `app/src/store/modelo/acciones-ui.ts:456`, `app/src/ui/MenuPrincipal.tsx:65`, `app/src/store.test.ts:172`, `app/src/store.test.ts:188` | El flujo existe por menú y store, con test de SD único/canvas/OPL vacíos; falta alinear literales exactos de algunas HU. |
| Falsos negativos M0 seleccionados | pendientes | cubiertos | `app/src/render/jointjs/proyeccion.test.ts:711`, `app/src/opl/generar.test.ts:702`, `app/src/modelo/creacionInterna.test.ts:9`, `app/e2e/05-refinamiento-y-plegado.spec.ts:628` | Bus estructural, orden Y/paralelo y creación interna están probados, pero las reglas no reconocen la implementación modular actual. |

## Pendientes Que Sí Parecen Reales

- Exportación PDF/SVG como flujos completos de producto (`EP60`, `EP61`) sigue esencialmente pendiente, salvo export SVG puntual del mapa.
- Interoperabilidad OPX/CSV (`EP70`, `EP71`) sigue pendiente.
- Carpetas/permisos/sub-modelos colaborativos (`EP31`, `EP32`, `EP40`, `EP41`) siguen fuera del corte funcional principal.
- Notas adhesivas (`EP42`) siguen pendientes y el handoff vigente las declara no disponibles.
- Simulación, runtime, análisis avanzado y extensiones (`A*`, `B*`, `C*`, `D*`) siguen diferidos o sin implementación funcional.
- En EP16 quedan deudas UX canónicas: selector de etiqueta/multiplicidad formal, reset/aplicar estilo a similares según HU exacta.
- En EP35 quedan pendientes los flujos de workspace/mover modelos; Ctrl+F intra-modelo está cubierto.

## Siguiente Paso Recomendado

Primero actualizar `progress-dashboard.mjs` para que el baseline automático deje de subreportar lo ya probado. Prioridad de reglas: `HU-SHARED-007`, EP16, EP21, EP33, EP35, EP1C y nuevo modelo. Después regenerar `hu-progress.*`; eso debería mover el baseline reproducible hacia el rango LLM mínimo sin tocar producto.

Luego conviene cerrar los 21 M0 que quedan pendientes tras el overlay conservador, empezando por los que son literales/UI pequeños: botones/literales de guardar/cargar/nuevo, menú contextual de descomposición/estados y algunos gestos de borde/handles.
