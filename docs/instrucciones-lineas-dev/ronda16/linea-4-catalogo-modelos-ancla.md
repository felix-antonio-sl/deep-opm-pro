# Linea 4 — Catalogo simple y modelos ancla

## 1. Mision

Fijar el eval Beta1 con modelos ancla reales y catalogo simple sin carpetas. El operador debe poder cargar un ancla, modelar, guardar y volver a abrir sin perdida.

Fuera de slice: permisos, carpetas, ACL, colaboracion, versionado remoto.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-30.* subset | `docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Cargar/guardar/catalogo local. |
| EPICA-31 subset | `docs/historias-usuario-v2/epicas/epica-31-persistencia-folders.md` | Solo catalogo simple; no carpetas. |

## 3. Anclaje a evidencia

- Dominios ancla: `/home/felix/projects/hd-dt`, `/home/felix/projects/hdos`, `/home/felix/projects/hdos-app`.
- App actual: `app/src/modelo/fixtures.ts`, `fixtures/demo-models/`, `app/examples/`.
- Corte: `docs/roadmap/cortes-operativos.md` declara catalogo simple Beta1.

## 4. Archivos permitidos

```text
app/src/modelo/fixtures.ts                     EDIT
app/scripts/generar-demos.ts                   EDIT aditivo si aplica
fixtures/demo-models/**                        EDIT/NUEVO
app/examples/**                                EDIT/NUEVO
app/e2e/11-beta1-catalogo-ancla.spec.ts        NUEVO
docs/roadmap/plan-betas-operativo.md           EDIT si se crea evidencia de decision
```

## 5. Restricciones de no-colision

No leer ni copiar codigo de repos ancla como dependencia runtime. Usarlos como corpus de dominio/eval. No crear sistema de carpetas.

## 6. Slice minimo shippeable

- Elegir 1 modelo ancla primario y 1 secundario liviano.
- El ancla primario tiene multiples OPDs, estados, descomposicion y enlaces.
- Catalogo simple permite distinguir demos pedagogicas vs anclas reales.
- Guardar/cargar round-trip sin perdida observable.
- Documentar gaps capturados como bugs si el dominio real expone fallas.

## 7. Tests obligatorios

- Unit: fixture ancla serializa/deserializa.
- Smoke: cargar ancla, guardar como actual, recargar, comparar conteos de entidades/enlaces/OPDs.

## 8. Verificacion

```bash
cd app && bun run check
cd app && bun run browser:smoke -- --grep "catalogo|ancla"
```

## 9. Decisiones bloqueadas

No convertir EPICA-31 completa en Beta1. Sin carpetas/permisos.

## 10. Decisiones a documentar

Elegir ancla primario entre `hd-dt`, `hdos`, `hdos-app` segun disponibilidad de modelo verificable. Si ninguno esta listo, crear ancla KORA/HDOS minimo desde conocimiento local y registrar deuda.

## 11. Entregable

Commits sugeridos:

1. `feat(fixtures): agrega modelos ancla beta1 al catalogo simple`
2. `test(e2e): catalogo carga guarda y recarga modelo ancla`

