# Línea 1 — Núcleo transaccional y ciclo

## 1. Misión

Cerrar los gaps de producto que requieren schema, store o UI compartida: Cortes 1A–3A. El slice mínimo es refinamiento con pregunta atómica, graduación recuperable, entrada inicial y ficha local. Fuera de alcance: crear capacidades OPM nuevas, deploy y transporte upstream de ficha no probado.

## 2. HU base

| Contrato | Path absoluto | Aporte |
| --- | --- | --- |
| Diseño aprobado, Cortes 1A–3A | `/home/felix/projects/deep-opm-pro/docs/superpowers/specs/2026-07-21-tutor-contextual-opforja-design.md` | Criterios, copy, leyes y gates |

No existe una HU viva específica; no se inventa. Este contrato aprobado sustituye el anclaje HU para la ronda.

## 3. Anclaje a evidencia

- SSOT OPD y reglas estrictas citadas en el README maestro.
- `opm-extracted` fue revisado en profundidad: aporta patrones de árbol/render y assets, pero no un tutor contextual transplantable. No copiar su Angular ni crear un segundo modelo de estado.
- Estado actual: `acciones-opd.ts` cruza directamente a dominio; `DialogoGraduar.tsx` informa pero la operación de workspace puede quedar parcial; `EstadoVacioOpm.tsx` solo muestra atajos.

## 4. Archivos permitidos

```text
app/src/modelo/tipos/opd.ts                         EDIT aditivo
app/src/modelo/tipos/modelo.ts                      EDIT aditivo
app/src/modelo/operaciones/**                       EDIT quirúrgico
app/src/serializacion/**                            EDIT aditivo
app/src/store/modelo/acciones-opd.ts                EDIT exclusivo
app/src/store/tipos.ts                              EDIT exclusivo
app/src/store/sliceTypes.ts                         EDIT exclusivo
app/src/store/workspaceMod.ts                       EDIT exclusivo
app/src/ui/App.tsx                                  EDIT integración
app/src/ui/ArbolOpd.tsx                             EDIT integración
app/src/ui/arbol/NodoOpd.tsx                        EDIT pregunta visible
app/src/ui/DialogoRefinamiento.tsx                  NUEVO
app/src/ui/DialogoGraduar.tsx                       EDIT
app/src/ui/EstadoVacioOpm.tsx                       EDIT
app/src/ui/**tutor*focal*.test.*                    NUEVO/EDIT focal
```

## 5. Restricciones de no-colisión

- La línea 2 no toca estos archivos durante el paralelo.
- No refactorizar selección/store; añadir solo el estado discriminado necesario.
- No mover el dueño de issues fuera de `PanelDiagnostico`.
- No alterar parser OPL, composición, simulación o persistencia backend salvo una regresión directa del corte.

## 6. Slice mínimo shippeable

### Modelo

`Opd.preguntaGuia?`, `Modelo.fichaTrabajo?` y `Modelo.lentesConocimiento?`, normalizados sin defaults legacy.

### Operaciones

Los tres caminos de refinamiento reciben metadatos opcionales y producen un único modelo siguiente. Actualizar pregunta es una operación pura propia.

### Serialización

Validar tipos/enums, trim exterior, ausencia canónica, deduplicación/orden y roundtrip estable.

### UX

Gateway inline/modal existente según el seam real, foco/escape/enter accesibles, pregunta visible en OPD y lectura móvil. Graduación declara cambios/no-cambios e issues navegables.

### Cross-capa

Todos los entrypoints de UI usan el gateway. Un undo revierte cada mutación completa. Ficha local solo si `procedencia` está ausente.

## 7. Tests obligatorios

- Dominio: descomponer/desplegar/adoptar × variantes y pregunta.
- Serialización: válido, inválido, legacy, OPL invariante.
- Store: intención no muta, confirmación un commit, cancelar identidad, undo/redo.
- UI: foco, error, pregunta visible/editable, adopción, graduación, entrada inicial.
- E2E: mouse, atajo, Ctrl+K, menús de adopción y viewports exigidos.

## 8. Verificación

```bash
cd /home/felix/projects/deep-opm-pro/app
bun test src/modelo src/serializacion src/store src/ui
bun run check
bun run design:governance
bun run lint
bun run build
bun run browser:smoke
```

## 9. Decisiones bloqueadas

- Pregunta obligatoria solo para gestos interactivos nuevos; opcional en kernel/legacy.
- Unfold sin default silencioso de UI.
- Reordenar no reparenta.
- Graduar no adopta, repara, certifica ni cambia hechos.
- Ficha local no existe en modelos con procedencia.

## 10. Decisiones que tomas vos

- El componente existente exacto que alberga el editor sin ocultar selección y OPL.
- El mínimo estado transitorio que conserva origen de foco y variante de adopción.
- La operación de workspace más simple que garantice rollback real de graduación.

Documentar toda elección en tests y mensaje de commit.

## 11. Forma del entregable

Commits sugeridos: `feat(tutor): gobernar refinamientos con pregunta`, `fix(workspace): hacer graduación recuperable`, `feat(tutor): añadir entrada y ficha local`. No tocar HANDOFF hasta el cierre de la ronda ni incluir cambios ajenos.

