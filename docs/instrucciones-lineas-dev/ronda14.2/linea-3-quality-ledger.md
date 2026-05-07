# Linea 3 — Quality ledger + trazabilidad law-first

## 1. Mision

Crear una capa de calidad operativa versionada que mida lo que importa antes de Beta1:

- bundle principal;
- `bun run check`;
- `bun run lint`;
- `browser:smoke`;
- law tests activos;
- comentarios detector legacy;
- deuda arquitectonica aceptada.

Slice minimo: `docs/roadmap/quality-ledger.md` + `app/scripts/quality-ledger.mjs` opcional para generar mediciones reproducibles. Esta linea no modifica el dashboard HU ni las HU canonicas.

Fuera de slice: fixes de leyes L1/L2, cambios de parser/render/store, HANDOFF.

## 2. HU Base

| HU | Path absoluto | Aporte L3 |
|---|---|---|
| Capa operativa de cortes | `/home/felix/projects/deep-opm-pro/docs/roadmap/cortes-operativos.md` | Define gate medible 14.2 antes de Beta1. |
| HU-SHARED-007 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md` | Se registra como ley, no solo como detector matched. |
| HU-SHARED-002 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-002-undo-redo.md` | Se registra `law-store-undo-atomicity`. |

## 3. Anclaje A Evidencia

- Auditoria categorial: `docs/roadmap/auditoria-categorial-app.md` F7/F8 y Fase F.
- ICAS: `urn:fxsl:kb:icas-calidad-riesgo`: calidad como medicion versionada, no como comentario.
- Repo: `docs/roadmap/hu-progress.md/json/html`, `docs/roadmap/cortes-operativos.md`, `app/package.json`.
- Scripts existentes: usar comandos reales del repo; no inventar CI.
- OPCloud: no aporta ledger de calidad reutilizable; solo evidencia de alcance visual/semantico.

## 4. Archivos Permitidos

```text
docs/roadmap/quality-ledger.md              NUEVO
app/scripts/quality-ledger.mjs              NUEVO opcional
app/package.json                            LECTURA / EDIT solo si se agrega script npm/bun justificado
docs/roadmap/cortes-operativos.md           LECTURA
docs/roadmap/auditoria-categorial-app.md    LECTURA
docs/roadmap/hu-progress.*                  LECTURA
app/src/leyes/*.test.ts                     LECTURA
```

## 5. Restricciones De No-Colision

- No tocar `docs/historias-usuario-v2/tools/progress-dashboard.mjs`.
- No tocar `docs/HANDOFF.md`.
- No tocar codigo productivo `app/src/**` salvo lectura de tests law.
- Si L1/L2 aun no merged, crear ledger con placeholders explicitos y actualizar tras merge; no bloquear leyes.
- No imponer umbrales irreales de bundle; el bundle ya está documentado como deuda.

## 6. Slice Minimo Shippeable

### Ledger

`docs/roadmap/quality-ledger.md` debe incluir:

- baseline de ronda 14.1:
  - `bun run check`: 888 pass / 0 fail / 2976 expect;
  - `browser:smoke`: 106 passed;
  - build: 233.48 kB / 62.79 gzip;
  - dashboard: MVP-alpha 100%, 102/102 rules matched.
- lista de leyes activas tras L1/L2:
  - `law-json-roundtrip`;
  - `law-render-stable-metadata`;
  - `law-refinement-thing-matrix`;
  - `law-refinement-removal`;
  - `law-opl-safe-lens`;
  - `law-store-undo-atomicity`.
- umbrales iniciales:
  - tests verdes obligatorios;
  - smoke completo verde;
  - bundle no crece > +5 kB gzip sin nota;
  - 0 regresiones MVP-alpha;
  - cada comentario `Compat detector` nuevo requiere issue/deuda declarada.

### Script Opcional

`app/scripts/quality-ledger.mjs` puede:

- leer `dist/assets/*.js` tras build;
- contar `law-` en `app/src/**/*.test.ts`;
- contar comentarios `Compat detector`;
- imprimir reporte JSON/markdown.

No debe ejecutar tests por si mismo si eso complica runtime; puede ser lector.

### Cortes

No editar cortes salvo que falte 14.2/14.3 en `cortes-operativos.md`. Si ya está actualizado, solo leer.

## 7. Tests Obligatorios

- Si se crea script: test mínimo por ejecución directa o smoke de salida estable.
- Si solo ledger markdown: no unit test obligatorio.

## 8. Verificacion

```bash
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Si agregas script:

```bash
cd app && bun run scripts/quality-ledger.mjs
```

## 9. Decisiones Bloqueadas

- No convertir el ledger en CI obligatorio sin instruccion.
- No editar HU canonicas.
- No ocultar deuda de bundle bajo un nuevo objetivo arbitrario.
- No reemplazar dashboard HU; complementarlo.

## 10. Decisiones Que Tomas Vos

- Markdown only vs markdown + script. Recomendado: markdown + script lector si cabe en <100 LOC.
- Si registrar baseline 14.1 o post-L1/L2. Recomendado: ambos si L1/L2 ya merged.
- Formato de tabla de riesgos.

## 11. Forma Del Entregable

Commits sugeridos:

1. `docs(quality): agrega ledger de calidad pre-beta`
2. `chore(quality): script lector de metricas law-first` si aplica.

Entregable final:

- hashes;
- baseline registrado;
- lista de leyes activas;
- comandos ejecutados;
- deuda/umbrales que quedan para Beta1.
