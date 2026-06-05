# Linea 1 — Refinamiento Thing hardening

## 1. Mision

Continuar desde el corte **"refinamiento OPM completo sobre Thing"**.

Slice minimo entregable:

- Auditar si la deuda de slots separados
  `refineeInzooming/refineeUnfolding/refineable` requiere cambio de schema ahora
  o si queda como deuda documentada.
- Agregar e2e especificos para **object-inzoom** y **process-unfold**.
- Auditar el OPL especifico de **descomposicion de objeto** contra SSOT; agregar
  tests y corregir generador solo si hay mismatch.

Fuera de slice:

- Migracion completa de `Entidad.refinamiento` a multiples slots.
- OPL reverse de refinamientos desde texto libre.
- Import OPX.
- Paridad total OPCloud de persistencia visual.

## 2. HU Base

| HU/capa | Path | Aporte L1 |
|---|---|---|
| EPICA-12 refinamiento | `docs/historias-usuario-v2/epicas/` | Evidencia UI especifica para object-inzoom y process-unfold. |
| EPICA-50 OPL-ES | `docs/historias-usuario-v2/epicas/` | OPL forward de object decomposition auditado contra gramatica SSOT. |
| Corte operativo 14.1 | `docs/roadmap/cortes-operativos.md` | Hardening previo a Beta1 sobre descomposicion robusta. |

No editar HU canonicas. Si el dashboard necesita nueva regla, reportar en
entregable y dejar al operador/consolidacion.

## 3. Anclaje A Evidencia

SSOT:

- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md`
  - V-69: inzooming y unfolding producen contorno grueso en el refinable.
  - V-79..V-85: OPD hijo clasifica contenedor, internos y externos.
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md`
  - gramatica `oracion_de_descomposicion_objeto_en_diagrama`.
  - gramatica `oracion_de_descomposicion_objeto_en_nuevo_diagrama`.

OPCloud extraido:

- `opm-extracted/src/app/models/VisualPart/OpmVisualThing.ts`: `inzoom(...)`
  clona visual, fija `inzoomed.refineable = this` y `this.refineeInzooming`.
- `opm-extracted/src/app/models/json.model.ts`: reconecta `refineableId`,
  `refineeInzoomingId`, `refineeUnfoldingId`.
- `opm-extracted/src/app/ImportOPX/OPX.API.ts`: `HandleRefineableEntities` y
  `HandleRefineeEntities` reconstruyen relaciones visuales entre OPDs.
- `opm-extracted/src/app/models/modules/attribute-validation/validation-module.ts`:
  contiene plantillas OPL de unfold/inzoom por objeto/proceso; usar como
  evidencia operacional secundaria, no como norma superior a SSOT.

Codigo actual:

- `app/src/modelo/operaciones/refinamiento/descomposicion.ts`
- `app/src/modelo/operaciones/refinamiento/despliegue.ts`
- `app/src/modelo/operaciones/refinamiento/proyeccion.ts`
- `app/src/opl/generadores/refinamiento.ts`
- `app/e2e/05-refinamiento-y-plegado.spec.ts`

## 4. Archivos Permitidos

```text
docs/auditorias/2026-05-07-refinamiento-thing-slots-opl.md  NUEVO
app/e2e/05-refinamiento-y-plegado.spec.ts                   EDIT aditivo
app/src/opl/generadores/refinamiento.ts                     EDIT puntual si SSOT exige
app/src/opl/generadores/refinamiento.test.ts                EDIT aditivo
app/src/opl/generar.test.ts                                 EDIT aditivo
app/src/modelo/operaciones/refinamiento/*.ts                LECTURA
app/src/modelo/operaciones.test.ts                          LECTURA / aditivo si falta kernel test
app/src/modelo/tipos/entidad.ts                             LECTURA
app/src/serializacion/validarEntidades.ts                   LECTURA
```

## 5. Restricciones De No-Colision

- No tocar `docs/HANDOFF.md`.
- No tocar `docs/historias-usuario-v2/**`.
- No tocar `app/src/opl/parser/**`: esta ronda no es OPL reverse.
- No tocar `app/src/ui/toolbar/**` salvo que un smoke requiera selector ya
  existente y la correccion sea estrictamente de `data-testid`.
- No cambiar `Entidad` ni serializacion salvo aprobacion explicita; el default
  es auditoria y decision, no migracion.
- No renombrar `descomponerProceso` / `desplegarObjeto` en este slice.

## 6. Slice Minimo Shippeable

### Modelo / Schema

Auditar la diferencia:

```text
local: entidad.refinamiento?: { tipo: "descomposicion" | "despliegue"; opdId; modo? }
OPCloud visual: refineable + refineeInzooming + refineeUnfolding
```

Entregable esperado:

- `docs/auditorias/2026-05-07-refinamiento-thing-slots-opl.md` con:
  - si el modelo local puede representar el eval Beta1 inmediato;
  - si falta simultaneidad inzoom+unfold en una misma Thing;
  - costo y blast radius de migrar a slots separados;
  - recomendacion: `mantener`, `migrar ahora`, o `schema vNext`.

Default recomendado si no aparece contraejemplo: **mantener schema actual y
dejar slots separados como schema vNext**.

### E2E UI

Agregar dos smokes en `app/e2e/05-refinamiento-y-plegado.spec.ts`:

1. **object-inzoom**:
   - crear o cargar modelo minimo con objeto;
   - seleccionar objeto;
   - ejecutar inzoom desde barra contextual o inspector;
   - verificar export JSON: objeto `refinamiento.tipo === "descomposicion"`;
   - verificar OPD hijo con contorno/partes internas tipo objeto;
   - verificar navegacion al OPD hijo.

2. **process-unfold**:
   - crear o cargar proceso;
   - seleccionar proceso;
   - ejecutar unfold desde inspector;
   - verificar export JSON: proceso `refinamiento.tipo === "despliegue"`;
   - verificar OPD hijo con refinadores tipo proceso y enlaces estructurales;
   - verificar retorno/navegacion.

Si no hay selector accesible estable, agregar solo `data-testid` local y
documentar.

### OPL

Auditar `app/src/opl/generadores/refinamiento.ts` contra SSOT:

- proceso descompuesto: lista de procesos + opcional objetos en zoom.
- objeto descompuesto: lista de objetos + opcional procesos en zoom.

Agregar tests:

- `oracionRefinamiento` para objeto con descomposicion debe emitir formula de
  objeto, no asumir subprocesos.
- `generarOplInteractivo` debe conservar refs/hints correctos para destinos de
  object decomposition.

Si el generador actual emite OPL general correcto, dejar solo tests + auditoria.
Si mezcla lista de procesos con objeto, corregir de forma puntual.

## 7. Tests Obligatorios

- Unit:
  - `app/src/opl/generadores/refinamiento.test.ts`: +1/+2 tests object
    decomposition.
  - `app/src/opl/generar.test.ts`: +1 test interactivo si refs/hints no estan
    cubiertos.
- Browser:
  - `object-inzoom`.
  - `process-unfold`.

No bajar cobertura existente ni borrar screenshots salvo que ya sean
regenerables/ignorados.

## 8. Verificacion

```bash
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
```

Si `browser:smoke` falla por flake preexistente, aislar con Playwright el spec
modificado y reportar el baseline exacto; no ocultar regresiones.

## 9. Decisiones Bloqueadas

- SSOT OPM gobierna semantica de refinamiento; OPCloud no redefine OPM.
- `opm-extracted/` se usa como referencia, no como codigo fuente directo.
- Unico handoff vigente: `docs/HANDOFF.md`; esta linea no lo toca.
- No se reabre alpha-lock OPL reverse.
- No se introduce schema migration sin decision explicita.

## 10. Decisiones Que Tomas Vos

Documentar en commit:

- Si object-inzoom se prueba desde barra contextual o inspector.
- Si process-unfold se prueba con modo `agregacion` u otro modo estructural.
- Si OPL object decomposition queda cubierto por generador actual o requiere
  patch.
- Si la auditoria recomienda mantener schema actual, migrar ahora o preparar
  schema vNext.

## 11. Forma Del Entregable

Commits sugeridos:

1. `docs(auditoria): slots refinamiento Thing contra SSOT y opm-extracted`
2. `test(e2e): cubre object-inzoom y process-unfold`
3. `test(opl): fija descomposicion de objeto contra SSOT`
4. `fix(opl): corrige OPL de object decomposition` solo si aplica.

Entregable final:

- hashes;
- loop verde;
- decision sobre slots;
- tests nuevos;
- si hubo patch OPL, antes/despues de la oracion;
- bloqueos o deuda residual.
