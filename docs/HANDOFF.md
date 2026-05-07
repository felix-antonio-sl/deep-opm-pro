# HANDOFF - refinamiento OPM completo sobre Thing

**Fecha**: 2026-05-07
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**Corte**: correccion semantica de refinamiento `inzoom`/`unfold` contra SSOT OPM + evidencia OPCloud en `opm-extracted/`.
**Estado**: patch listo para commit atomico en `main`; build, tests, lint y smoke browser verdes.

## Politica De Handoff Unico

`docs/HANDOFF.md` es la unica memoria de traspaso vigente del proyecto. Este
archivo reemplaza y consolida el handoff anterior. No crear handoffs paralelos,
fechados ni duplicados.

## Memoria Consolidada

El modelador OPM vive en `app/` con Bun + Vite + Preact + Zustand + JointJS OSS.
La arquitectura sigue siendo propia: no Angular, no Firebase, no Rappid. La
semantica se ancla en la SSOT OPM/ISO 19450 en
`/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`; OPCloud se usa
como evidencia operacional en `opm-extracted/`, sin copiar codigo 1:1.

La decision principal de este corte: **refinamiento aplica a Thing**, no a una
matriz restringida `proceso -> descomposicion` y `objeto -> despliegue`.
Se conserva el schema actual `entidad.refinamiento` y las APIs publicas legacy
por compatibilidad, pero se corrige su semantica.

## Estado Actual

### Refinamiento

- `descomponerProceso(...)` conserva su nombre publico, pero ahora implementa
  **inzoom/descomposicion de cualquier cosa OPM**.
- En inzoom, los refinadores iniciales se crean del mismo tipo que la cosa
  refinada:
  - proceso -> tres procesos internos.
  - objeto -> tres objetos internos.
- `desplegarObjeto(...)` conserva su nombre publico, pero ahora implementa
  **unfold/despliegue de cualquier cosa OPM**.
- En unfold, los refinadores estructurales iniciales tambien conservan el tipo
  del padre:
  - objeto -> objetos vinculados por agregacion/exhibicion/generalizacion/clasificacion.
  - proceso -> procesos vinculados por agregacion/exhibicion/generalizacion/clasificacion.
- La UI ya no etiqueta un unfold como inzoom:
  - la barra flotante `Inzoom` llama a descomposicion real.
  - el inspector expone descomposicion y despliegue para objetos y procesos.
- La serializacion ya no rechaza `descomposicion` en objetos ni `despliegue`
  en procesos.

### Enlaces Y Cadenas De Efectos

- La firma de `agregacion` permite entidades de la misma clase OPM. Esto habilita
  agregacion proceso->proceso para unfold de procesos.
- La proyeccion de enlaces externos en descomposicion de proceso queda alineada
  con SSOT:
  - `consumo` hacia el proceso refinado -> primer subproceso.
  - `resultado` desde el proceso refinado -> ultimo subproceso.
  - `agente`, `instrumento` y `efecto` basico -> todos los subprocesos.
- La descomposicion de objeto conserva contexto externo visible en el OPD hijo,
  mostrando el enlace original sobre el contorno cuando no aplica distribucion
  procedural.
- Los reanclajes manuales de enlaces derivados siguen teniendo prioridad sobre
  recalculos automaticos.

### Archivos Principales Del Corte

- `app/src/modelo/operaciones/refinamiento/descomposicion.ts`
- `app/src/modelo/operaciones/refinamiento/despliegue.ts`
- `app/src/modelo/operaciones/refinamiento/proyeccion.ts`
- `app/src/modelo/operaciones/refinamiento/helpers.ts`
- `app/src/modelo/operaciones/helpers.ts`
- `app/src/serializacion/validarEntidades.ts`
- `app/src/modelo/checkers.ts`
- `app/src/store/modelo/acciones-opd.ts`
- `app/src/ui/BarraHerramientasElemento.tsx`
- `app/src/ui/inspector/SeccionRefinamiento.tsx`
- `app/src/modelo/operaciones.test.ts`

## Decisiones Vigentes

- **Compatibilidad primero**: no se migro el modelo serializado a
  `refineeInzooming/refineeUnfolding`. El patch corrige semantica sin introducir
  migracion de schema.
- **Un refinamiento activo por entidad**: el modelo local conserva un unico
  `entidad.refinamiento`. OPCloud puede mantener inzoom y unfold separados por
  visual thing; esa paridad queda como mejora futura.
- **Distribucion automatica solo para proceso descompuesto**: para objeto
  descompuesto se preserva contexto externo, pero no se inventa split procedural.
- **Nombres publicos legacy se mantienen**: `descomponerProceso` y
  `desplegarObjeto` siguen exportados para evitar una refactorizacion amplia de
  consumidores. Su documentacion interna aclara que operan sobre Thing.
- **Tests actualizan la norma**: se reemplazaron tests que fijaban el rechazo de
  process-unfold/object-inzoom por tests positivos de la matriz completa.

Decisiones previas que siguen vigentes:

- `assets/svg/` y `docs/JOYAS.md` son fuente canonica visual.
- `opm-extracted/` es referencia semantica operacional, no fuente a copiar.
- OPL-ES sigue siendo lente derivada.
- JSON OPM debe permanecer lossless.
- No Firebase, no Rappid.
- `docs/HANDOFF.md` es handoff unico.

## Verificacion Ejecutada

Desde `app/`:

```bash
bun run check
# tsc --noEmit
# bun test src
# 884 pass / 0 fail / 2964 expect() / 87 archivos

bun run build
# vite build OK

bun run lint
# eslint src/ui/ OK

bun run browser:smoke
# 104 passed
```

`app/dist/` se elimino despues del build para respetar la politica de repo
liviano.

## Pendientes

### Refinamiento

- Migrar, si se decide necesario, desde un unico `entidad.refinamiento` a slots
  separados equivalentes a OPCloud:
  - `refineeInzooming`
  - `refineeUnfolding`
  - `refineable`
- Agregar e2e especificos para:
  - inzoom de objeto desde inspector y barra.
  - unfold de proceso desde inspector.
  - distribucion agente/instrumento/efecto visible en UI, no solo kernel.
- Revisar OPL de object decomposition con partes + operaciones internas. El
  generador actual ya emite descomposicion general, pero falta profundizar
  plantillas especificas de objeto descompuesto.
- Implementar split de efecto con estados especificos segun SSOT cuando haya
  transiciones de estado refinadas.

### Deuda General Viva

- Bundle principal sigue sobre el objetivo historico de 195 kB; medir antes de
  mover mas chunks.
- Ronda 13.1 IFML flow cleanup sigue pendiente:
  - modal-stack LIFO real.
  - reemplazo de CustomEvents legacy.
  - breadcrumbs.
  - TablaEnlaces como vista XOR.
- Ronda 14 OPL reverse profundo / EPICA-50 sigue viva.

## Supuestos

- La correccion apunta a paridad semantica suficiente con OPCloud para
  refinamiento, no a paridad exacta de persistencia interna.
- El schema actual de un solo refinamiento por entidad es aceptable para este
  incremento por reversibilidad y blast radius.
- Los fixtures existentes no modelan aun process-unfold ni object-inzoom con
  profundidad suficiente; la cobertura nueva queda principalmente en unit tests
  de kernel y en smokes existentes de regresion.

## Riesgos

- El nombre legacy `descomponerProceso` puede inducir errores futuros si alguien
  asume de nuevo que solo acepta procesos. La documentacion interna lo corrige,
  pero una renombrada publica requeriria migracion amplia.
- La UI ahora permite las cuatro combinaciones, pero algunos textos historicos
  del backlog/HU pueden seguir hablando de "objeto desplegable" o "proceso
  descomponible". Auditar wording antes de nuevas HU.
- La falta de slots separados impide, por ahora, que una misma entidad tenga
  simultaneamente inzoom y unfold como en OPCloud.
- La distribucion de `invocacion` se mantiene como comportamiento previo
  `ultimo -> externo`; revisar contra SSOT/OPCloud antes de ampliar reglas.

## Prompt De Continuacion Breve

Usa `docs/HANDOFF.md` como memoria unica. Continua desde el corte
"refinamiento OPM completo sobre Thing": revisar deuda de slots separados
`refineeInzooming/refineeUnfolding/refineable`, agregar e2e para object-inzoom y
process-unfold, y auditar OPL especifico de descomposicion de objeto contra SSOT
OPM + `opm-extracted/`.
