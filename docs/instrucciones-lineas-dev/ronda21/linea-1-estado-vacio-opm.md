# L1 — Estado vacío OPM con inicio compacto

## 1. Misión

Convertir el canvas vacío en un inicio OPM compacto que lleve al usuario al primer SD con valor real sin buscar en menús. Cierra el pendiente `P2 - Estado vacio demasiado neutral` y el eval mínimo "Desde canvas vacio, crear proceso + objeto + link resultado en menos de 60 segundos".

**Slice mínimo entregable**:

1. Mostrar un bloque discreto dentro del canvas vacío, no una landing page.
2. Ofrecer acciones primarias: `Crear proceso central`, `Agregar objeto transformado`, `Agregar agente/instrumento`, `Abrir asistente`.
3. Crear proceso/objeto usando las operaciones existentes y el diálogo de nombre actual.
4. Al crear el segundo elemento, ofrecer `Conectar como resultado` si la firma es legal o abrir el selector de tipos válidos.
5. Mantener el canvas como superficie principal: el empty state desaparece al existir la primera apariencia.
6. No implementar tutorial mode ni overlays guiados.

**Fuera de slice**: no crear plantillas nuevas, no rediseñar el asistente de nuevo modelo completo, no modificar reglas de enlace.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-10.001 | `docs/historias-usuario-v2/epicas/epica-10-canvas-creacion-cosas.md` | Crear proceso |
| HU-10.002 | `docs/historias-usuario-v2/epicas/epica-10-canvas-creacion-cosas.md` | Crear objeto |
| HU-10.007..011 | `docs/historias-usuario-v2/epicas/epica-10-canvas-creacion-cosas.md` | Enlace inicial y tipos válidos |
| HU-34.030 (NUEVO) | `docs/historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md` | Inicio OPM compacto desde canvas vacío |
| HU-SHARED-007 | `docs/historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md` | Eco OPL tras crear |

## 3. Anclaje a evidencia

- Informe: `docs/audits/opm-app-ux-2026-05-07/informe-final-ui-ux.md` §P2 estado vacío y §Evals mínimos.
- SSOT: `opm-iso-19450-es.md` para cosa/proceso/objeto/enlace; `opm-opl-es.md` para eco OPL.
- `docs/JOYAS.md`: dimensiones 135x60, colores, tipografía.
- `app/src/modelo/fixtures.ts`: patrones de SD mínimo ya usados en fixtures.
- `app/src/store/modelo/acciones-canvas.ts`: operaciones existentes de creación.
- `opm-extracted/INDEX.md` y `MODULES.md`: revisar componentes de wizard/new model si existen antes de diseñar.

## 4. Archivos permitidos

```
app/src/ui/EstadoVacioOpm.tsx                         NUEVO
app/src/ui/EstadoVacioOpm.test.tsx                    NUEVO
app/src/ui/App.tsx                                    EDIT aditivo (mount cuando canvas vacío)
app/src/ui/tokens.ts                                  EDIT aditivo (empty state)
app/src/store/modelo/acciones-canvas.ts               EDIT aditivo (helpers de creación centrada si faltan)
app/src/store/modelo/acciones-ui.ts                   EDIT aditivo (abrir asistente desde empty state)
app/src/store/sliceTypes.ts                           EDIT aditivo (si se requiere estado UI mínimo)
app/src/store/uiPanel.ts                              EDIT aditivo (si se requiere estado UI mínimo)
app/e2e/21-estado-vacio-opm.spec.ts                   NUEVO
docs/historias-usuario-v2/...                         NO TOCAR
```

## 5. Restricciones de no-colisión

- Ronda 19 L1 puede mover toolbar; esta línea no depende de toolbar.
- Ronda 19 L2 define modo enlace; si ya existe, usarlo para `Conectar como resultado`. Si no existe, abrir `Tipos válidos` como fallback.
- No tocar EPICA-91 ni crear tutorial.
- No cambiar defaults canónicos de proceso/objeto.

## 6. Slice mínimo shippeable

### Modelo

Agregar helper puro o acción existente reutilizable:

```ts
crearProcesoCentralDesdeVacio();
crearObjetoTransformadoCercaDelProceso();
prepararEnlaceResultadoEntreSeleccionados();
```

Si ya existen operaciones equivalentes, solo envolverlas desde UI.

### UX

`EstadoVacioOpm` debe ser compacto:

- título corto: `Iniciar SD`
- 3 botones de creación con iconos existentes/lucide si ya está instalado
- botón secundario `Abrir asistente`
- contador de progreso local opcional: proceso creado / objeto creado / enlace pendiente

No usar hero, cards anidadas ni texto largo.

### OPL

Cada operación debe actualizar OPL por el flujo existente. No generar OPL local ad hoc.

## 7. Tests obligatorios

- Unit: renderiza acciones correctas cuando OPD activo está vacío.
- Unit/store: crear proceso central desde vacío produce apariencia 135x60 y dirty.
- E2E: desde canvas vacío crear proceso + objeto + enlace resultado en menos de 60s medido con `performance.now()`.
- E2E: empty state desaparece tras crear primera apariencia.

## 8. Verificación

```bash
cd app
bun run check
bun run lint
bun run build
bun run browser:smoke
bun run scripts/evaluacion-exhaustiva.mjs http://127.0.0.1:5173/ --out ronda21-l1
```

## 9. Decisiones bloqueadas

- No tutorial mode.
- No crear entidades por atajo de teclado.
- No inventar dimensiones, colores ni tipografía de canvas.
- No convertir el empty state en landing page.

## 10. Decisiones que tomas vos

- Si el bloque vacío vive dentro de `App.tsx` o junto al canvas.
- Si `Conectar como resultado` aparece tras dos entidades o solo si hay selección clara.
- Texto exacto de botones, manteniéndolo breve.

## 11. Forma del entregable

Commits sugeridos:

- `feat(empty-state): inicio opm compacto desde canvas vacio`
- `test(e2e): crear sd minimo desde estado vacio`

No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
