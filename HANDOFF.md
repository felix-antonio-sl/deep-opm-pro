# Continuidad del producto integrado

El candidato se consolida en `main` al 2026-09-30, a partir de
`07fddc1ec47950a53144e800d795d9e8405091eb`, mediante commits semánticos.
La sincronización con `origin/main` se verifica al publicar. No se ha desplegado
el candidato. No hay subagentes trabajando. El contrato, la evidencia y la
aceptación pendiente están en
[implementación del producto integrado](docs/roadmap/implementacion-producto-integrado.md);
la [especificación](docs/specs/opforja-producto-integrado.md) conserva A01–A24.

## Próxima acción que desbloquea la aceptación

El usuario eligió `mimo-v2.6-pro` y autorizó usar la clave de su portapapeles.
No se pudo acceder al portapapeles desde esta sesión; ya se pidió guardar
`OPFORJA_AGENT_API_KEY` en el `.env` raíz o indicar un archivo local accesible.
No confundir `OPFORJA_AGENT_TOKEN`/`IDENTITY` con una credencial de inferencia.
No imprimir claves ni probarlas contra proveedores distintos para adivinar su origen.
El candidato utiliza la ruta directa `xiaomi-mimo`; verificar la ruta de la clave
si el usuario indica que pertenece a un intermediario.

Con la credencial disponible, ejecutar desde `app/`:

```bash
bun --env-file=../.env run scripts/probe-agent-provider.ts --provider xiaomi-mimo --model mimo-v2.6-pro --synthetic
```

Después, comprobar el recorrido real con herramientas, propuesta/incorporación,
recibos, Detener/Continuar y recuperación dentro del presupuesto. No hubo
inferencia real con MiMo en esta ejecución. El circuito se comprobó con transporte
controlado y PostgreSQL aislado.

## Evidencia alcanzada y límites

- `bun run check`: 3.682 pruebas, cero fallos, 14.929 aserciones; typecheck y pruebas
  contra PostgreSQL 16 aislado incluidos.
  El contenedor temporal de pruebas se detuvo al terminar; no se modificó producción.
- 16 escenarios focales de navegador correctos, incluidos el arranque del build
  de producción, el lector portátil sin red, reapertura del editor tras cerrar
  Chromium con API inaccesible, conflictos, propuestas humanas y XOR.
- Build y gobierno visual correctos. Inspección móvil a 390 × 844 sin desborde;
  canvas de 447 px tras plegar acciones secundarias.
- [Jev](docs/auditorias/2026-09-23-evaluacion-jev.md): tres llamadas reales,
  24 coincidencias sintéticas. No está en la ruta obligatoria del producto y esos
  resultados no acreditan calibración ni ahorro en dominio.
- Quedan aceptación humana, latencias y rollback según el plan. El build advierte
  un chunk del editor de alrededor de 1 MB minificado. El editor aún necesita su
  servidor estático; el lector portátil sí se comprobó completamente sin red.

No ampliar el alcance para solventar la ausencia de credencial. Conservar el
kernel y el gateway comunes. Si se autoriza despliegue, usar exclusivamente
`./deploy/deploy.sh`. Retirar este archivo cuando se cierre el trabajo pendiente.

## Propuesta de rehacer opforja (pendiente de aprobación)

El 2026-09-30 el dueño encargó rehacer opforja sobre el canon entregado:
`reglas-opm-estrictas-es` 1.5.0, `spec-forja-opd-es` 1.4.0, `spec-forja-opl-es` 1.4.1 y
`metodologia-forja-opm-es` 1.7.0, «ni más ni menos», con servidor mínimo sobre archivos. Pidió
detenerse antes de implementar. El estudio, la especificación derivada del canon y el diseño final
están en [docs/rehacer/](docs/rehacer/README.md). No se implementó ni desplegó nada; `app/` solo
recibió la corrección independiente `96b398e`.

Próxima acción: revisión del dueño. Si aprueba, se ejecuta el plan de
`docs/rehacer/design/DESIGN.md` §12 en la rama asignada. Ese plan retira el agente integrado, así
que la aprobación dejaría obsoleto el pendiente de credencial descrito arriba.
