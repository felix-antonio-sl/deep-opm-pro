# Reporte ejecutivo in-vivo - modelador OPM

**Fecha:** 2026-05-04T16:19:33.298Z
**URL probada:** http://127.0.0.1:5173/
**Driver:** Playwright/Chromium headless
**Script:** `app/scripts/in-vivo-test.mjs`
**Artefactos:** `app/test-results/in-vivo/`
**Politica:** este archivo reemplaza al reporte ejecutivo anterior.

---

## 1. Veredicto

La app esta operativa en el corte auditado. No se detectaron fallos funcionales ni errores de runtime durante la exploracion in-vivo.

| Metrica | Valor |
|---|---:|
| Criterios verificados | 54 |
| OK | 51 |
| FAIL | 0 |
| WARN | 0 |
| INFO | 3 |
| Errores `pageerror` | 0 |
| Errores/warnings consola | 0 |
| Requests fallidos | 0 |

## 2. Cobertura Por Seccion

| Seccion | Criterios | OK | FAIL | WARN | INFO |
|---|---:|---:|---:|---:|---:|
| 1. Carga inicial | 6 | 5 | 0 | 0 | 1 |
| 2. Toolbar | 11 | 11 | 0 | 0 | 0 |
| 3. Demo | 3 | 3 | 0 | 0 | 0 |
| 4. Visual SSOT | 5 | 4 | 0 | 0 | 1 |
| 5. Undo/Redo | 3 | 3 | 0 | 0 | 0 |
| 6. Inspector entidad | 4 | 4 | 0 | 0 | 0 |
| 7. Crear enlace | 5 | 5 | 0 | 0 | 0 |
| 8. Validación firma | 1 | 1 | 0 | 0 | 0 |
| 9. JSON | 2 | 2 | 0 | 0 | 0 |
| 10. Persistencia local | 3 | 3 | 0 | 0 | 0 |
| 11. Árbol OPD | 5 | 5 | 0 | 0 | 0 |
| 12. Agregación | 2 | 2 | 0 | 0 | 0 |
| 13. Drag | 1 | 1 | 0 | 0 | 0 |
| 14. Responsive 1024px | 1 | 0 | 0 | 0 | 1 |
| 15. Eliminar | 2 | 2 | 0 | 0 | 0 |

## 3. Detalle De Criterios

| Seccion | Criterio | Estado | Detalle |
|---|---|---|---|
| 1. Carga inicial | Carga sin error fatal | OK | 1019 ms hasta networkidle |
| 1. Carga inicial | Título de la página | INFO | Modelador OPM |
| 1. Carga inicial | Canvas JointJS visible | OK |  |
| 1. Carga inicial | Árbol OPD visible | OK |  |
| 1. Carga inicial | Inspector con estado vacío | OK |  |
| 1. Carga inicial | Panel OPL visible | OK |  |
| 2. Toolbar | Botón "Objeto" visible | OK |  |
| 2. Toolbar | Botón "Proceso" visible | OK |  |
| 2. Toolbar | Botón "Deshacer" visible | OK |  |
| 2. Toolbar | Botón "Rehacer" visible | OK |  |
| 2. Toolbar | Botón "Demo" visible | OK |  |
| 2. Toolbar | Botón "Guardar" visible | OK |  |
| 2. Toolbar | Botón "Cargar" visible | OK |  |
| 2. Toolbar | Selector de tipo de enlace visible | OK |  |
| 2. Toolbar | Selector de enlace inactivo sin origen | OK |  |
| 2. Toolbar | Deshacer deshabilitado al inicio | OK |  |
| 2. Toolbar | Rehacer deshabilitado al inicio | OK |  |
| 3. Demo | Demo carga 3 cosas (vistas: 3) | OK |  |
| 3. Demo | Demo carga 2 enlaces (vistas: 2) | OK |  |
| 3. Demo | OPL contiene 'Driver Rescuing afecta OnStar System.' | OK |  |
| 4. Visual SSOT | Cosas detectadas: 2 objeto(s) [rect], 1 proceso(s) [ellipse] | INFO | rect@135x60 fill=#fdffff stroke=#70e483 \| rect@135x60 fill=#fdffff stroke=#70e483 \| ellipse@135x60 fill=#fdffff stroke=#3bc3ff |
| 4. Visual SSOT | Fill canónico #fdffff en todas las cosas | OK |  |
| 4. Visual SSOT | Objetos con stroke #70E483 (n=2) | OK |  |
| 4. Visual SSOT | Procesos con stroke #3BC3FF (n=1) | OK |  |
| 4. Visual SSOT | Dimensiones canónicas 135x60 en todas las cosas | OK |  |
| 5. Undo/Redo | Tras Demo, Ctrl+Z mantiene elementos (3=3, historial reseteado por diseño) | OK |  |
| 5. Undo/Redo | Tras crear cosa manual, Ctrl+Z reduce (4→3) | OK |  |
| 5. Undo/Redo | Ctrl+Y restaura (3→4) | OK |  |
| 6. Inspector entidad | Inspector muestra campo Nombre tras seleccionar | OK |  |
| 6. Inspector entidad | Inspector muestra Esencia/Afiliación | OK |  |
| 6. Inspector entidad | Cambio de nombre se refleja en OPL/canvas | OK |  |
| 6. Inspector entidad | Afiliación ambiental aplica stroke-dasharray (8 4) | OK |  |
| 7. Crear enlace | Crear Objeto + Proceso vacíos (vistas: 2) | OK |  |
| 7. Crear enlace | Selector de enlace activo tras seleccionar origen | OK |  |
| 7. Crear enlace | Tras elegir tipo aparece mensaje 'Selecciona la entidad destino' | OK |  |
| 7. Crear enlace | Enlace consumo creado (vistas: 1) | OK |  |
| 7. Crear enlace | OPL contiene texto de consumo | OK |  |
| 8. Validación firma | Firma ilegal no crea enlace (1→1) | OK | Consumo |
| 9. JSON | Export produce JSON válido con formato canónico | OK |  |
| 9. JSON | Import de JSON corrupto muestra mensaje de error | OK |  |
| 10. Persistencia local | Tras Guardar, deja de aparecer '(No guardado)' | OK |  |
| 10. Persistencia local | Tras crear nueva entidad, aparece '(No guardado)' | OK |  |
| 10. Persistencia local | Tras Cargar regresa al estado guardado | OK |  |
| 11. Árbol OPD | Árbol muestra 2 nodos (esperados ≥2) | OK |  |
| 11. Árbol OPD | Click en hijo cambia OPD activo (visible Proceso Hijo) | OK |  |
| 11. Árbol OPD | Descomponer crea nodo derivado SD1 | OK |  |
| 11. Árbol OPD | Quitar descomposición elimina OPD hijo | OK |  |
| 11. Árbol OPD | Quitar descomposición remueve OPL de refinamiento | OK |  |
| 12. Agregación | Triángulo estructural presente (polygons: 1) | OK |  |
| 12. Agregación | Triángulo no expone tool de vértices | OK |  |
| 13. Drag | Entidad arrastrada (Δx=130, Δy=120) | OK |  |
| 14. Responsive 1024px | body scrollWidth/clientWidth = 1024/1024 | INFO |  |
| 15. Eliminar | Entidades 3→2 | OK |  |
| 15. Eliminar | Enlaces (cascada) 2→1 | OK |  |

## 4. Runtime

- `pageerror`: 0
- `console.error/warning`: 0
- `requestfailed`: 0

## 5. Artefactos Generados

- `app/test-results/in-vivo/01-carga-inicial.png`
- `app/test-results/in-vivo/03-demo-canvas.png`
- `app/test-results/in-vivo/03-demo-fullpage.png`
- `app/test-results/in-vivo/05-undo-redo.png`
- `app/test-results/in-vivo/06-inspector-entidad.png`
- `app/test-results/in-vivo/06b-rename.png`
- `app/test-results/in-vivo/06c-esencia-fisica.png`
- `app/test-results/in-vivo/06d-afiliacion-ambiental.png`
- `app/test-results/in-vivo/07-enlace-consumo.png`
- `app/test-results/in-vivo/08-firma-ilegal.png`
- `app/test-results/in-vivo/09-export-json.png`
- `app/test-results/in-vivo/09b-import-corrupto.png`
- `app/test-results/in-vivo/10-persistencia-local.png`
- `app/test-results/in-vivo/11-arbol-opd.png`
- `app/test-results/in-vivo/11b-opd-hijo.png`
- `app/test-results/in-vivo/11c-quitar-descomposicion.png`
- `app/test-results/in-vivo/12-agregacion.png`
- `app/test-results/in-vivo/13-drag-entidad.png`
- `app/test-results/in-vivo/14-viewport-1024x700.png`
- `app/test-results/in-vivo/14b-viewport-1920x1080.png`
- `app/test-results/in-vivo/15-cascada-borrado.png`
- `app/test-results/in-vivo/deep-A-descomposicion.png`
- `app/test-results/in-vivo/deep-B-objeto-en-hijo.png`
- `app/test-results/in-vivo/deep-C1-padre-con-enlaces.png`
- `app/test-results/in-vivo/deep-C2-hijo-con-redistribucion.png`
- `app/test-results/in-vivo/deep-D-marcadores-routing.png`
- `app/test-results/in-vivo/deep-E-link-tools.png`
- `app/test-results/in-vivo/deep-G-self-link.png`
- `app/test-results/in-vivo/deep-H-posicion-libre.png`

## 6. Lectura Del Corte

- El selector de tipo de enlace queda inactivo hasta que exista una entidad origen seleccionada.
- La validacion de firma OPM ilegal se trata como criterio bloqueante: si crea un enlace, el script sale con codigo distinto de cero.
- El reporte se genera automaticamente desde el mismo resumen JSON que alimenta las capturas, evitando divergencia entre `docs/REPORTE-EJECUTIVO.md` y `app/test-results/in-vivo/_resumen.json`.
- Los PNG y `_resumen.json` quedan en `app/test-results/in-vivo/`, directorio ignorado por git como salida de prueba.

## 7. Reproduccion

```bash
cd app
bun run visual:audit -- http://127.0.0.1:5173/
```
