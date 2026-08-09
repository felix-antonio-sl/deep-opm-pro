# Notas técnicas con referencia viva

Esta carpeta conserva solo aprendizajes que todavía tienen un consumidor verificable o
explican una salvaguarda vigente. No es continuidad de sesión ni fuente de estado.

| Nota | Valor vigente |
|---|---|
| [Invocación implícita](notas-invocacion-implicita.md) | patrones de reverse fail-closed, pruebas no tautológicas y compatibilidad del orden in-zoom |
| [Vitrina](notas-vitrina.md) | base observada, optimistic locking y contrato consumido por `revisionVitrina.ts` |

Las notas de Apuntes/Taller, chrome, mantenimiento documental y reauditoría diagramática
se movieron a `_archivo/` el 2026-08-09: sus cierres viven en contratos, tests y Git.

Una nota nueva solo permanece activa si registra una salvaguarda durable no capturada
mejor por una spec, test, decisión o runbook. Nunca se usa para fijar estado actual.
