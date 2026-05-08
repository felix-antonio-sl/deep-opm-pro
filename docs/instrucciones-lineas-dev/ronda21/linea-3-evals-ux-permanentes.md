# L3 — Evals UX permanentes con fixtures, screenshots y métricas

## 1. Misión

Convertir la Fase 3 del informe en infraestructura permanente: fixtures chico/mediano/grande, flujos medidos, screenshots de regresión desktop/tablet/mobile y reporte con tiempos/fallos. Cierra `Fase 3 - Evals UX permanentes` y operacionaliza los "Evals mínimos antes de declarar la app usable".

**Slice mínimo entregable**:

1. Nuevo script `evaluacion-ux-permanente.mjs` que orquesta flujos críticos sobre dev server.
2. Reusar y endurecer `app/scripts/evaluacion-exhaustiva.mjs` en vez de crear otro mundo.
3. Fixtures de evaluación chico/mediano/grande a partir de fixtures existentes, sin versionar capturas.
4. Reporte JSON + MD con estado `OK/WARN/FAIL`, duración, errores JS, screenshots y criterio del informe.
5. Modo `--strict` que sale con código 1 si hay FAIL.
6. Script en `package.json` para correrlo.

**Fuera de slice**: no agregar servicio de CI todavía, no versionar PNGs, no cambiar app productiva.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-SHARED-007 | `docs/historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md` | OPL sincronizado |
| HU-10.001..011 | `docs/historias-usuario-v2/epicas/epica-10-canvas-creacion-cosas.md` | Crear SD y enlaces |
| HU-20.009 | `docs/historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md` | Navegar OPDs |
| HU-30.014+ | `docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Guardar/importar/exportar/descartar/versionar |
| HU-40.001+ | propuesta de `ronda19/L4` | Refinar/navegar OPD hijo |
| HU-42.011+ | `docs/historias-usuario-v2/epicas/epica-42-colaboracion-notas.md` | Comentarios/notas en modo revisión si existe implementación |
| HU-UX-EVAL-001 (NUEVO) | declarar como propuesta | Harness UX permanente |

## 3. Anclaje a evidencia

- Informe: sección `Fase 3 - Evals UX permanentes` y lista `Evals mínimos antes de declarar la app "usable"`.
- `app/scripts/evaluacion-exhaustiva.mjs`: base existente con responsive, axe, perf, screenshots y reporte.
- `app/scripts/in-vivo-test.mjs` e `in-vivo-deep-checks.mjs`: flujos funcionales existentes.
- `fixtures/` y `app/src/modelo/fixtures.ts`: fuente de modelos chico/mediano/grande.
- `docs/roadmap/hu-progress-evidence.json`: no editar, solo citar si se requiere evidencia futura.
- OPCloud: `opm-extracted/assets/png/` como referencia visual, no como baseline pixel-perfect.

## 4. Archivos permitidos

```
app/scripts/evaluacion-exhaustiva.mjs                  EDIT aditivo (exportar helpers o aceptar perfil ux)
app/scripts/evaluacion-ux-permanente.mjs               NUEVO
app/scripts/fixtures-ux-regresion.mjs                  NUEVO
app/scripts/evaluacion-ux-permanente.test.mjs          NUEVO si el runner lo permite
app/package.json                                       EDIT aditivo (script ux:eval)
app/e2e/23-evals-ux-permanentes.spec.ts                NUEVO o LECTURA si se deja solo script
fixtures/ux-regression/README.md                       NUEVO opcional, sin PNGs
docs/audits/regresion/README.md                        NUEVO opcional, explica regeneración
docs/HANDOFF.md                                        NO TOCAR
docs/historias-usuario-v2/...                          NO TOCAR
```

## 5. Restricciones de no-colisión

- L1 y L2 pueden cambiar UI; L3 debe tolerar ambos estados mediante selectors estables y criterios por rol/testid.
- No depender de red externa. Axe por CDN en `evaluacion-exhaustiva.mjs` debe quedar opcional; si falla, WARN, no FAIL.
- No versionar `app/_eval-output/`, `app/test-results/` ni screenshots.
- No reemplazar `browser:smoke`; esto lo complementa.

## 6. Slice mínimo shippeable

### Script

```bash
bun run scripts/evaluacion-ux-permanente.mjs http://127.0.0.1:5173/ --out ronda21 --strict
```

Debe ejecutar:

1. carga inicial y estado vacío;
2. crear SD mínimo;
3. crear link por click-click;
4. crear link por drag source-target si ronda19 L2 ya existe; si no, registrar WARN con prerequisito;
5. cargar fixture/import JSON y comprobar identidad de modelo + OPD activo;
6. crear o activar un refinamiento disponible y navegar el OPD hijo;
7. navegar 8 OPDs y distinguir raíz/inzoom/unfold;
8. leer warning metodológico a 1280x720;
9. seleccionar entidad y filtrar OPL;
10. auto-layout + fit visible;
11. guardar/importar/exportar/descartar/versionar y comprobar chip persistencia si ronda19 L5 existe;
12. mobile 390px: OPD/OPL/issues/selección sin toolbar saturada;
13. mobile 390px: comentarios/notas solo si existe implementación EPICA-42; si no, WARN no bloqueante.

### Reporte JSON

```ts
interface ResultadoUx {
  criterio: string;
  estado: "OK" | "WARN" | "FAIL";
  duracionMs?: number;
  detalle?: unknown;
  screenshot?: string;
}
```

### Reporte MD

Debe ordenar FAIL → WARN → OK y enlazar screenshots relativos.

## 7. Tests obligatorios

- Unit/helper: serialización del reporte y salida strict.
- Smoke/script: correr contra dev server y generar `_evaluacion-ux.json` + `reporte.md`.
- E2E opcional: comprobar que el script puede ejecutarse desde Playwright config sin colgar.

## 8. Verificación

```bash
cd app
bun run check
bun run lint
bun run build
bun run browser:smoke
bun run scripts/evaluacion-ux-permanente.mjs http://127.0.0.1:5173/ --out ronda21 --strict
```

## 9. Decisiones bloqueadas

- No versionar screenshots.
- No meter CI en esta línea.
- No convertir WARN de prerequisito no mergeado en FAIL.
- No usar pixel-perfect contra OPCloud; evaluar contratos UX del informe.

## 10. Decisiones que tomas vos

- Si `evaluacion-exhaustiva.mjs` exporta helpers o se deja como script separado.
- Nombres exactos de los fixtures chico/mediano/grande.
- Umbrales iniciales de tiempo para `OK/WARN/FAIL`, documentados en el reporte.

## 11. Forma del entregable

Commits sugeridos:

- `test(ux): harness permanente con criterios del informe`
- `docs(ux): documenta regeneracion de evals visuales`

No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
