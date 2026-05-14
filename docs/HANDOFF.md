# HANDOFF — Enlaces OPCloud avanzados

**Fecha**: 2026-05-14
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**Corte**: enlaces de excepción temporal OPCloud (`Overtime`, `Undertime`, `OvertimeUndertime`) integrados al kernel, UI, OPL, JSON y renderer JointJS OSS.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. Este archivo reemplaza y consolida el handoff anterior.

## Fuentes Normativas Y Técnicas

- SSOT OPM: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Roadmap vivo de enlaces: `docs/audits/opcloud-enlaces-pendientes/README.md`.
- OPCloud operacional:
  - `opm-extracted/src/app/models/DrawnPart/Links/OvertimeExceptionLink.ts`
  - `opm-extracted/src/app/models/DrawnPart/Links/UndertimeExceptionLink.ts`
  - `opm-extracted/src/app/models/DrawnPart/Links/OvertimeUndertimeExceptionLink.ts`
  - `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/shared.ts` (`timeMin`, `timeMax`, `timeMinVal`, `timeMaxVal`).
- JointJS OSS consultado:
  - `https://docs.jointjs.com/learn/features/diagram-basics/links/`

## Estado Actual

Quedó implementado el siguiente bloque del roadmap:

- **Exception/time links OPCloud**: nuevos `TipoEnlace` `excepcionSobretiempo`, `excepcionSubtiempo` y `excepcionSubSobretiempo`.
- **Semántica SSOT**: las excepciones temporales son enlaces procedurales estrictos `Proceso -> Proceso`. No admiten estados como extremos.
- **Markers OPCloud**: se usan los SVG canónicos de `assets/svg/links/procedural/` y las geometrías observadas en OPCloud para `/`, `//` y el marcador combinado.
- **Metadatos temporales**: `tiempoMinimo`, `unidadTiempoMinimo`, `tiempoMaximo`, `unidadTiempoMaximo` se validan según el tipo de excepción. Las unidades no se aceptan sin valor asociado.
- **Labels visuales**: los umbrales se proyectan como labels independientes (`Min`, `Max`) sobre el enlace. Para el combinado se distribuyen a 0.35/0.65 del path para evitar solapamiento.
- **OPL**: se generan las frases SSOT para excepción por sobretiempo, subtiempo y rango min/max; cuando falta un umbral se emite texto conservador sin inventar duración.
- **Serialización estricta**: JSON conserva y normaliza campos temporales válidos y rechaza metadatos temporales en enlaces no temporales.
- **UI/store**: toolbar, menú de tipos, tabla de enlaces, Inspector y acción Zustand exponen creación/edición de excepción temporal.
- **Refinamiento**: enlaces externos de excepción desde procesos refinados se proyectan desde el último subproceso; enlaces hacia handler refinado se proyectan al primer subproceso, coherente con el patrón procedural existente.

## Artefactos Modificados

- Modelo/operaciones: `app/src/modelo/tipos/enlace.ts`, `app/src/modelo/constantes.ts`, `app/src/modelo/enlaceMetadatos.ts`, `app/src/modelo/operaciones/helpers.ts`, `app/src/modelo/operaciones.ts`, `app/src/modelo/modificadores.ts`, `app/src/modelo/validaciones.ts`.
- Render JointJS: `app/src/render/jointjs/linkAssets.ts`, `app/src/render/jointjs/composers/markers.ts`, `app/src/render/jointjs/composers/enlace.ts`, `app/src/render/jointjs/labelLayout.ts`.
- UI/store: `app/src/ui/InspectorEnlace.tsx`, `app/src/ui/inspectorEnlace/SeccionMetadatosOpcloud.tsx`, `app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx`, `app/src/ui/MenuTipoEnlace.tsx`, `app/src/ui/TablaEnlaces.tsx`, `app/src/ui/toolbar/ToolbarCreacion.tsx`, `app/src/store/{tipos,sliceTypes}.ts`, `app/src/store/modelo/acciones-enlace.ts`.
- OPL/serialización/canvas: `app/src/opl/generadores/{procedural,refsHints}.ts`, `app/src/modelo/opl/generador-opl.ts`, `app/src/serializacion/{json,validarGuards,validarEnlaces,validarNormalizacion}.ts`, `app/src/canvas/modoEnlace.ts`, `app/src/modelo/operaciones/refinamiento/proyeccion.ts`.
- Tests: `app/src/completitud.test.ts`, `app/src/modelo/operaciones.test.ts`, `app/src/opl/generar.test.ts`, `app/src/serializacion/json.test.ts`, `app/src/render/jointjs/proyeccion.test.ts`, `app/src/store/enlaces.test.ts`, `app/src/canvas/modoEnlace.test.ts`.

## Verificación Final

Ejecutado en `app/`:

```bash
bun run typecheck
# clean

bun run test
# 1266 pass / 0 fail / 4897 expect() / 118 files

bun run build
# clean

bun run browser:smoke
# 173 pass / 0 fail
```

Antes del smoke se limpió Vite con:

```bash
pgrep -af vite | grep -v eval | awk '{print $1}' | xargs -r kill
```

## Pendientes

- **Forked tagged links**: OPCloud sincroniza enlaces unidireccionales con mismo source+tag; todavía no emulamos ese comportamiento de fork.
- **Smoke UI específico**: agregar prueba browser que cree/edite tagged/bidirectional y exception/time desde UI y verifique Inspector + OPL + JSON.
- **Proceso ambiental handler**: la SSOT visual indica handler ambiental para excepción temporal; la app valida `Proceso -> Proceso`, pero aún no fuerza ni sugiere afiliación ambiental.
- **Duración de proceso como dato formal**: los umbrales viven en el enlace como OPCloud; queda pendiente decidir si el proceso fuente debe tener duración semántica propia.
- **Import/export OPX real**: los campos nuevos están en JSON local, pero no hay mapeo OPX productivo.

## Supuestos Y Riesgos

- Los links de excepción temporal son procedurales operacionales: participan en conectividad de procesos, pero no en buses estructurales ni en sort de fundamentales.
- Los labels `Min`/`Max` son una adaptación local basada en metadatos OPCloud y OPL SSOT; OPCloud persiste los tiempos pero no siempre los muestra como label visible en la misma superficie.
- El tipo combinado conserva ambos umbrales en un solo enlace para seguir `OvertimeUndertimeExceptionLink`; separar en dos enlaces queda como decisión del operador, no como normalización automática.

## Prompt De Continuación

Retomar desde `docs/HANDOFF.md` y `docs/audits/opcloud-enlaces-pendientes/README.md`. Siguiente bloque recomendado: sincronización OPCloud de forked tagged links y smoke UI específico para tagged/bidirectional + exception/time. Mantener el principio: revisar `opm-extracted` primero, respetar SSOT para semántica y adaptar a nuestra arquitectura Preact/Zustand/JointJS OSS sin copiar Rappid.
