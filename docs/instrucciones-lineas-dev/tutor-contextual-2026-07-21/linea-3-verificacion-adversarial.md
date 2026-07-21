# Línea 3 — Verificación adversarial e in-situ

## 1. Misión

Evaluar el producto integrado contra el diseño completo, sin editar código. El entregable por corte es un veredicto exclusivo `INEVITABLE` o `NO TODAVÍA`, con evidencia reproducible y correcciones mínimas priorizadas.

## 2. HU base

| Contrato | Path absoluto | Aporte |
| --- | --- | --- |
| Diseño aprobado, §§13–15 | `/home/felix/projects/deep-opm-pro/docs/superpowers/specs/2026-07-21-tutor-contextual-opforja-design.md` | Leyes, gates y terminado |

No se crea HU. La evaluación arbitra el contrato aprobado y el producto vivo.

## 3. Anclaje a evidencia

- Comparar código, tests, DOM, screenshots, errores runtime y copy con SSOT/manuales.
- Usar `opm-extracted` solo para contrastar patrones/activos previamente inventariados.
- Verificar que la interfaz no promete más que el kernel.

## 4. Archivos permitidos

```text
app/src/**                                  LECTURA
app/e2e/**                                  LECTURA
docs/superpowers/specs/**                   LECTURA
docs/canon-opm/**                           LECTURA
docs/manual-*.md                            LECTURA
docs/cheatsheets/**                         LECTURA
/tmp/**                                     NUEVO efímero
docs/reports/tutor-contextual-*.md          NUEVO solo al cierre si la raíz lo solicita
```

## 5. Restricciones de no-colisión

- No editar producto, tests ni documentos contractuales.
- No aceptar green tests como sustituto de recorrido observable.
- No emitir aprobación cortés ni promedio de confianza.

## 6. Slice mínimo shippeable

### Dominio

Probar atomicidad, compatibilidad legacy, preservación OPL y límites honestos.

### UX

Probar teclado, foco, aria, copy, una voz, ausencia de duplicados y viewports.

### Operación

Verificar local/origin, build, estado in-situ y drift deliberado con producción.

### Resultado

Por corte: evidencia, fallo si existe, corrección mínima y veredicto binario.

## 7. Tests obligatorios

- Focales declarados por cada corte.
- `check`, lint, build y governance.
- Browser smoke y recorridos 390×844, 640×800 y 1280×720.
- Búsqueda de consola/runtime y referencias rotas.

## 8. Verificación

```bash
cd /home/felix/projects/deep-opm-pro/app
bun run check
bun run lint
bun run build
bun run design:governance
bun run browser:smoke
bun run cordon:estado
```

## 9. Decisiones bloqueadas

- Producción no se despliega.
- Ningún corte posterior compensa un loop abierto.
- Solo `INEVITABLE` permite cerrar el corte.
- El estado productivo `b1502882` es drift deliberado, no un fallo a “corregir”.

## 10. Decisiones que tomas vos

- Selección adversarial de fixtures y recorridos.
- Severidad de hallazgos según impacto en las leyes, no preferencia estética.
- Si un problema exige código o solo evidencia/documentación.

## 11. Forma del entregable

Reporte corto con tabla criterio/evidencia/veredicto, rutas y comandos exactos. Cero commits salvo solicitud explícita de la raíz; jamás tocar HANDOFF.

