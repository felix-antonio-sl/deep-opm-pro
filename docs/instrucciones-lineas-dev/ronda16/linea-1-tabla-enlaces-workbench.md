# Linea 1 — Tabla de Enlaces como workbench Beta1

## 1. Mision

Convertir `TablaEnlaces` de modal util a superficie Beta1 para auditar y editar relaciones de un dominio real. Slice minimo: columnas completas, edicion segura de etiqueta/multiplicidad, navegacion robusta al enlace y evidencia smoke.

Fuera de slice: estilos avanzados masivos, export, tabla de nodos, permisos.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-16.001..007 | `docs/historias-usuario-v2/epicas/epica-16-canvas-enlaces-propiedades.md` | Abrir, listar, filtrar, ordenar, navegar y editar enlaces. |
| HU-16.010/.012/.013/.014 | mismo | Etiquetas canonicas y multiplicidades validables. |

## 3. Anclaje a evidencia

- SSOT: relaciones estructurales/procedurales y multiplicidad en `opm-iso-19450-es.md`.
- App actual: `app/src/ui/TablaEnlaces.tsx` ya lista, filtra, ordena y edita inputs inline.
- OPCloud: usar `opm-extracted` como referencia de auditoria tabular de relaciones, sin copiar Angular/Rappid.

## 4. Archivos permitidos

```text
app/src/ui/TablaEnlaces.tsx                    EDIT
app/src/store/modelo/acciones-enlace.ts        EDIT aditivo si falta accion atomica
app/src/modelo/etiquetasEnlace.ts              EDIT aditivo
app/src/modelo/validadores/*.ts                NUEVO opcional
app/e2e/11-beta1-tabla-enlaces.spec.ts         NUEVO
```

## 5. Restricciones de no-colision

No tocar `DialogoBuscarCosas`, `PanelMetodologia`, fixtures ni simulacion. Si hace falta navegacion compartida, exportar helper pequeno desde store sin mover contratos de L2.

## 6. Slice minimo shippeable

- Etiqueta: selector canonico + custom si el tipo lo permite.
- Multiplicidad: opciones `1`, `0..1`, `N`, `0..N`, custom validado.
- Navegacion: fila selecciona enlace, cambia OPD si corresponde y deja foco visual.
- Undo: cada edicion confirmada produce una unidad atomica.
- Empty state: tabla explicita cuando no hay enlaces.

## 7. Tests obligatorios

- Unit: validacion de multiplicidad y etiqueta canonica.
- Smoke: abrir tabla, filtrar por tipo, editar multiplicidad, navegar al enlace.

## 8. Verificacion

```bash
cd app && bun run check
cd app && bun run browser:smoke -- --grep "Tabla de Enlaces"
```

## 9. Decisiones bloqueadas

No agregar export CSV ni estilo masivo. No convertir la tabla en spreadsheet general.

## 10. Decisiones a documentar

Definir si el commit de input inline es por `blur`, `Enter` o debounce. Preferencia: `Enter`/`blur` con undo atomico.

## 11. Entregable

Commits sugeridos:

1. `feat(tabla-enlaces): edicion canonica de etiqueta y multiplicidad`
2. `test(e2e): tabla enlaces navega y edita propiedades beta1`

