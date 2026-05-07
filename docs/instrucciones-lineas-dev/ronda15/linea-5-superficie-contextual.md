# Línea 5 — Cierre UX contextual de superficie única

## 1. Misión

Cerrar la coherencia del workbench como superficie única de modelado diario: BarraHerramientasElemento, Inspector, Panel OPL, árbol OPD y futura Tabla de Enlaces deben responder a la misma selección, navegación y lenguaje visual.

Slice mínimo:

- Revisar journeys principales de selección/edición/refinamiento/OPL.
- Corregir incoherencias visibles de estado, foco, affordance o navegación.
- Definir contrato UX para TablaEnlaces Beta1 sin implementarla completa.

Fuera de slice: implementar TablaEnlaces Beta1, búsqueda intra-modelo Beta1, simulación.

## 2. HU Base

| HU/corte | Aporte |
|---|---|
| Beta0 foundation | Superficie diaria coherente antes de features Beta1. |
| EPICA-16 Tabla de Enlaces | Contrato de integración futura con selección/Inspector/OPL. |
| EPICA-35 búsqueda intra-modelo | Preparar navegación a resultados sin implementarla. |
| IFML CN-MD/CN-MMD | Árbol -> Canvas -> Inspector/OPL/Paneles como master-detail multidetalle. |

## 3. Anclaje A Evidencia

- `docs/auditorias/2026-05-07-auditoria-ifml.md` §3, §4, §10.
- `app/src/ui/BarraHerramientasElemento.tsx`
- `app/src/ui/Inspector*.tsx`, `app/src/ui/inspector/**`
- `app/src/ui/PanelOpl.tsx`, `app/src/ui/panelOpl/**`
- `app/src/ui/ArbolOpd.tsx`, `app/src/ui/arbol/**`
- `app/src/ui/PanelMetodologia.tsx`, `app/src/ui/PanelAvisos.tsx`

## 4. Archivos Permitidos

```text
app/src/ui/BarraHerramientasElemento.tsx        EDIT
app/src/ui/Inspector.tsx                        EDIT acotado
app/src/ui/InspectorEntidad.tsx                 EDIT acotado
app/src/ui/InspectorEnlace.tsx                  EDIT acotado
app/src/ui/inspector/**                         EDIT acotado
app/src/ui/PanelOpl.tsx                         EDIT acotado
app/src/ui/panelOpl/**                          EDIT acotado
app/src/ui/ArbolOpd.tsx                         EDIT acotado
app/src/ui/arbol/**                             EDIT acotado
app/src/ui/PanelMetodologia.tsx                 EDIT acotado
app/src/ui/PanelAvisos.tsx                      EDIT acotado
app/e2e/15-superficie-contextual.spec.ts        NUEVO
```

## 5. Restricciones De No Colisión

- Esperar merge de L2 y L4.
- No tocar Toolbar overflow ni Dialogo.
- No crear TablaEnlaces completa.
- No introducir nuevos patrones visuales si tokens/JOYAS ya cubren el caso.

## 6. Slice Mínimo Shippeable

### Journey 1: selección

- Seleccionar cosa/enlace en canvas actualiza Inspector, barra contextual y OPL de forma visible.
- Árbol mantiene contexto OPD y no compite con selección de cosa.

### Journey 2: refinamiento

- Inzoom/unfold desde barra contextual o Inspector dejan claro qué OPD se creó y dónde navegar.

### Journey 3: OPL

- Hover/click o selección cruzada con Panel OPL no contradice Inspector.
- Si hay unsupported OPL reverse, diagnóstico se entiende como limitación del parser, no del modelo.

### Contrato TablaEnlaces

- Documento corto dentro del entregable: columnas mínimas, selección bidireccional, acción de editar enlace y navegación a extremos.
- No implementar feature completa salvo micro-slot preparatorio sin UI visible.

## 7. Tests Obligatorios

- Smoke `15-superficie-contextual.spec.ts`:
  - seleccionar cosa actualiza barra contextual e Inspector;
  - seleccionar enlace actualiza Inspector/OPL;
  - refinamiento navega/expone OPD hijo;
  - PanelMetodologia/PanelAvisos no ocultan información crítica.

## 8. Verificación

```bash
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
cd app && bun run scripts/evaluacion-exhaustiva.mjs
```

## 9. Decisiones Bloqueadas

- No implementar Beta1 funcional.
- No mover mapa del sistema a Beta1.
- No reemplazar Panel OPL ni Inspector.
- No crear onboarding/tutorial app.

## 10. Decisiones Que Tomas Vos

- Qué incoherencias UX corrige esta línea y cuáles deja como Beta1.
- Si el contrato TablaEnlaces se expresa como comentario técnico, test pendiente o doc en entregable.
- Si una mejora visual pertenece a L4, entregar patch a L4 o reportar.

## 11. Forma Del Entregable

Commits sugeridos:

1. `ux(superficie): alinea seleccion entre barra inspector opl y arbol`
2. `test(e2e): journey contextual pre-beta`
3. `docs(beta1): contrato UX para TablaEnlaces`
