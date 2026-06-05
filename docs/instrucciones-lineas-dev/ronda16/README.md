# Ronda 16 — Beta1: modelado de dominio real

**Fecha**: 2026-05-07  
**Supuesto base**: ronda 15 implementada de forma perfecta y cerrada: dialogos estables, Toolbar sin overflow, IFML/evaluacion visual operativo, canvas fidelity suficiente y superficie contextual coherente.  
**Objetivo**: cerrar el corte **Beta1** como producto: modelar un dominio real mediano sin workaround de desarrollo, con Tabla de Enlaces, busqueda intra-modelo, validacion metodologica accionable, catalogo simple y eval ancla.

## 1. Filosofia operativa

- Producto antes que paridad OPCloud: cada linea debe reducir el tiempo entre "tengo un dominio real" y "puedo modelarlo, validarlo, corregirlo y guardar/cargar sin editar JSON".
- La ronda no abre simulacion: Beta2 queda para ronda 17.
- No se editan HU canonicas. Esta ronda opera sobre `docs/roadmap/cortes-operativos.md`.
- Antes de inventar, revisar SSOT OPM y `opm-extracted/`. OPCloud aporta patrones, no autoridad semantica.
- Cada linea debe poder evaluarse sobre al menos un modelo ancla: `hd-dt`, `hdos`, `hdos-app` o familia KORA/HDOS/HODOM/GOREOS.

## 2. Reglas duras comunes

- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/**` desde las lineas.
- No mover Beta2 a esta ronda: sin modo simulacion, sin runner, sin user functions.
- No introducir carpetas/permisos: Beta1 acepta catalogo simple, no workspace colaborativo.
- Todo cambio semantico cita SSOT: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es`.
- Todo cambio visual/canvas consulta `assets/svg/`, `docs/JOYAS.md` y `opm-extracted/` antes de crear geometria nueva.
- Loop verde por linea: `cd app && bun run check`; si toca UI/render, `bun run browser:smoke`; si toca bundle/proyeccion, `bun run build`.
- Si una linea detecta deuda estructural mayor que impide cerrar, entrega bug capturable bajo `docs/bugs/<ID>/` y no degrada alcance de Beta1 silenciosamente.

## 3. Stack y comandos

```bash
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
```

## 4. Vision general

| Linea | Titulo | HU/corte eje | Riesgo | Dominio nuevo |
|---|---|---|---|---|
| L1 | Tabla de Enlaces workbench | EPICA-16 | Medio | `ui/TablaEnlaces` + acciones de enlace |
| L2 | Busqueda intra-modelo y navegacion | EPICA-35 | Bajo | `ui/DialogoBuscarCosas` |
| L3 | Validacion metodologica accionable | EPICA-1C | Medio | `modelo/checkers` + `PanelMetodologia` |
| L4 | Catalogo simple + modelos ancla | EPICA-30/31 subset | Medio | fixtures/evals de dominio |
| L5 | Cierre semantico dominio real | EPICA-12/13/15/1B residual | Medio | smokes/eval Beta1 |

## 5. Mapa de archivos por linea

| Archivo | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|
| `app/src/ui/TablaEnlaces.tsx` | EDIT | lectura | — | — | lectura |
| `app/src/store/modelo/acciones-enlace.ts` | EDIT | — | — | — | lectura |
| `app/src/ui/DialogoBuscarCosas.tsx` | — | EDIT | lectura | — | lectura |
| `app/src/store/uiPanel.ts` | lectura | EDIT | lectura | — | lectura |
| `app/src/modelo/checkers.ts` | lectura | lectura | EDIT | lectura | lectura |
| `app/src/ui/PanelMetodologia.tsx` | lectura | lectura | EDIT | — | lectura |
| `app/src/modelo/fixtures.ts` | — | lectura | lectura | EDIT | lectura |
| `fixtures/demo-models/**` | — | — | lectura | EDIT | lectura |
| `app/examples/**` | — | — | — | EDIT | lectura |
| `app/e2e/11-beta1-*.spec.ts` | aditivo | aditivo | aditivo | aditivo | NUEVO agregador/eval |
| `app/src/modelo/operaciones/refinamiento/**` | lectura | — | lectura | lectura | EDIT si hay residuo |
| `app/src/modelo/operaciones/estados.ts` | lectura | — | lectura | lectura | EDIT si hay residuo |
| `app/src/canvas/reglasTraer.ts` | lectura | — | lectura | lectura | EDIT si hay residuo |

## 6. Protocolo de conciliacion

Orden sugerido: **L4 -> L3 -> L1 -> L2 -> L5 -> consolidacion operador**.

Rationale: L4 fija modelos/evals ancla; L3 define validacion que las demas consumen; L1 y L2 mejoran superficies de inspeccion/navegacion; L5 ejecuta el cierre sobre un flujo real y solo toca residuos.

## 7. Anclaje obligatorio

- Corte: `docs/roadmap/cortes-operativos.md` §6 Beta1.
- HU: EPICA-16, EPICA-35, EPICA-1C, EPICA-12, EPICA-13, EPICA-15, EPICA-1B, EPICA-30/31 subset.
- SSOT: `opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`.
- OPCloud reusable: `opm-extracted/src/app/dialogs/search-items-dialog/`, `methodological-checking-dialog/`, assets SVG de enlaces y patrones de tabla/seleccion.

## 8. Briefs

- [L1 Tabla de Enlaces workbench](linea-1-tabla-enlaces-workbench.md)
- [L2 Busqueda intra-modelo](linea-2-busqueda-intra-modelo.md)
- [L3 Validacion metodologica accionable](linea-3-validacion-metodologica.md)
- [L4 Catalogo simple + modelos ancla](linea-4-catalogo-modelos-ancla.md)
- [L5 Eval Beta1 dominio real](linea-5-eval-beta1-dominio-real.md)

## 9. Verificacion de cierre

Gate Beta1:

- `bun run check`, `lint`, `build`, `browser:smoke` verdes.
- Al menos un smoke `beta1-dominio-real` construye/carga un modelo ancla con multiples OPDs.
- Tabla de Enlaces permite inspeccionar, navegar y editar propiedades sin abrir JSON.
- Busqueda encuentra apariciones y salta al OPD con seleccion visible.
- PanelMetodologia muestra avisos con cita SSOT y permite navegar/corregir/revalidar.
- Catalogo simple lista modelos ancla y guarda/carga sin perdida.
- Dashboard preserva alpha 100%.

