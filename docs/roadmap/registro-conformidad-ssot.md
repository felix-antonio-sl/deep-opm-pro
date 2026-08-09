# Registro de conformidad SSOT

- **Regla rectora:** R-CONF-7
- **Última revisión documental:** 2026-08-09

Toda regla `DEBE` conocida de la SSOT sin implementación vigente se declara aquí como
programada, parcial o remitida a una enmienda de su fuente. El registro contiene brechas
activas; los cierres históricos viven en Git.

La cobertura deriva de auditorías previas, leyes ejecutables y revisión de los contratos
vigentes. No es una certificación línea por línea de toda la SSOT.

## Declaraciones vigentes

| Regla / familia | Exigencia | Estado | Declaración R-CONF-7 |
|---|---|---|---|
| Out-zoom | mecanismo canónico de recomposición | **PROGRAMADA** | Sin superficie de autoría. Abrir solo ante un modelo o flujo nombrado; debe preservar frontera, roundtrip y persistencia. |
| R-FAN-PROB-1 caso C | distinguir «probabilístico declarado, pesos pendientes» de alternativas ordinarias | **PROGRAMADA** | El valor uniforme se aplica solo durante simulación y no se persiste como hecho. Implementar exige variante de modelo, serialización, UI, OPL y diagnóstico. |
| GAPs `spec-forja-opd-es` §22 (`GAP-OPD-UIFORJA-08*`) | realizar divergencias visuales pendientes | **PARCIAL** | La precedencia documental está resuelta. Las brechas de realización se abren solo por incumplimiento de gate o evidencia de uso. |
| Control plane del compuesto | visibilidad de fuente, canon, skill y despliegue | **CERRADA 2026-07-18** | `bun run cordon:estado` observa los órganos, salud pública y deriva desplegable sin instalar un daemon ni crear otra fuente de estado. |

La fila cerrada se conserva como control de no-tautología de
`app/src/leyes/manual-limites.test.ts`; no representa backlog.

## Fronteras sin testigo completo

1. **SSOT ↔ skill desplegada.** El sello prueba identidad, versión, target y
   procedencia. La equivalencia semántica integral aún requiere revisión humana.
2. **`docs/uso-productivo.md` ↔ app.** Existen leyes editoriales y E2E parciales,
   pero no un comparador de todas las afirmaciones de la guía contra la interfaz.

Estas fronteras se reportan explícitamente; no se presentan como conformidad plena.

## Mapeo de gates categoriales

| Regla del Anexo C | Gate ejecutable | Ubicación |
|---|---|---|
| R-CAT-LIN-2 | `law-composicion-respeta-lineal` | `app/src/leyes/composicion.test.ts` |
| R-CAT-EQ-2 | `compareBoundarySignature`, rotulado `boundary-signature` | `app/src/modelo/equivalencia/` y `app/src/leyes/equivalencia.test.ts` |
| R-CAT-EQ-3 | `DESCOMPOSICION_NO_PRESERVA_FRONTERA` | `app/src/modelo/diagnosticoSeveridad.ts` y pruebas de preservación |
| R-CAT-COMP-2 | leyes de no duplicación, referencias, asociatividad y tipado | `app/src/leyes/composicion.test.ts` y `app/src/modelo/composicion/` |

Los nombres describen observables. Igualdad de firma de frontera no demuestra identidad,
bisimulación, adjunción ni equivalencia matemática total.

## Mantenimiento

- Una brecha nueva se agrega en el corte que la descubre o se resuelve en la fuente
  normativa correspondiente.
- Una fila cerrada se elimina en el siguiente saneo, salvo que una ley ejecutable la use
  como control explícito.
- Git y los resultados de verificación conservan la evidencia; este archivo no acumula cronología.
