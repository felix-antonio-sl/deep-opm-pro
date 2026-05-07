# Linea 2 — Busqueda intra-modelo y navegacion

## 1. Mision

Cerrar busqueda Beta1 como herramienta diaria: Ctrl/Cmd+F, filtro, una fila por aparicion, salto al OPD, seleccion visible y sincronizacion con OPL/Inspector.

Fuera de slice: busqueda full-text en OPL, busqueda por regex, carpetas/modelos externos.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-35.008..020 | `docs/historias-usuario-v2/epicas/epica-35-persistencia-mover-buscar.md` | Ctrl+F, filtro, tabla de apariciones, navegacion, highlight y OPL sync. |

## 3. Anclaje a evidencia

- App actual: `app/src/ui/DialogoBuscarCosas.tsx` ya busca entidades y lista `Elemento | Ubicacion`.
- OPCloud: `opm-extracted/src/app/dialogs/search-items-dialog/search-items-dialog.component.ts`.
- SSOT: una Thing puede aparecer en multiples OPDs; la busqueda debe operar por apariencia, no solo por entidad.

## 4. Archivos permitidos

```text
app/src/ui/DialogoBuscarCosas.tsx              EDIT
app/src/store/uiPanel.ts                       EDIT aditivo si falta estado
app/src/store/modelo/acciones-ui.ts            EDIT aditivo si falta accion
app/src/render/jointjs/JointCanvas.tsx         EDIT minimo si highlight requiere hook
app/e2e/11-beta1-busqueda.spec.ts              NUEVO
```

## 5. Restricciones de no-colision

No tocar `TablaEnlaces` salvo lectura. No modificar parser OPL. No introducir indice global persistente: calcular derivado desde `modelo` salvo evidencia de performance real.

## 6. Slice minimo shippeable

- Atajo Ctrl/Cmd+F abre busqueda sin capturar inputs activos.
- Resultado = una fila por apariencia, con `entidad`, `tipo`, `OPD`, posicion si existe.
- Click navega a OPD, selecciona apariencia y activa halo temporal.
- Panel OPL refleja el OPD destino.
- Estado vacio y sin resultados claros.

## 7. Tests obligatorios

- Unit: derivador de resultados por aparicion.
- Smoke: Ctrl+F, filtrar, saltar a OPD hijo, verificar seleccion y OPL actualizado.

## 8. Verificacion

```bash
cd app && bun run check
cd app && bun run browser:smoke -- --grep "Busqueda"
```

## 9. Decisiones bloqueadas

No implementar busqueda en catalogo externo. No agregar fuzzy search.

## 10. Decisiones a documentar

Politica de highlight: duracion recomendada 3s o hasta nueva seleccion. Documentar si se elige otra.

## 11. Entregable

Commits sugeridos:

1. `feat(busqueda): navega por apariciones y sincroniza OPL`
2. `test(e2e): busqueda intra-modelo salta a OPD y selecciona`

