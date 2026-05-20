# Línea 2 — Reglas de diagnóstico

## Misión

Convertir títulos visibles de reglas (kebab-case crudo) en mensajes humanos. Agrupar issues idénticos en la UI.

## Items que cierra

1. **#2** Slugs internos filtrados a UI. Cambiar `titulo`/`mensaje`; **NO cambiar `id`/`codigo`** (contratos de tests/serialización).
2. **#8** Agrupar issues idénticos. Si 3 procesos sin entrada/salida → 1 entrada con badge "3" y lista expandible.

## Convención de copy

Castellano natural, sin guiones, capitalizado, tildes RAE. Patrón: **Sujeto + verbo + complemento**.

Ejemplos mínimos (extender al descubrir más reglas):

| ID interno (NO cambia) | Título nuevo |
|---|---|
| `sd-sin-proceso-principal` | SD sin proceso principal |
| `proceso-sin-entrada-ni-salida` | Proceso sin entradas ni salidas |
| `proceso-nombre-forma-verbal` | Nombre de proceso no es un verbo |

## Verificación crítica antes de implementar

```bash
grep -n "agruparIssues\|groupIssues" app/src/modelo/
```

Si `agruparIssuesDiagnostico` ya existe (memoria del operador lo sugería): NO duplicar implementación, revisar contrato y fixar el render en `PanelDiagnostico.tsx`. Si no existe: implementar según el contrato del brief.

## Archivos permitidos

- `app/src/modelo/validaciones.ts`
- `app/src/modelo/diagnostico.ts`
- `app/src/modelo/checkers.ts`
- `app/src/modelo/diagnosticoVisual.ts`
- `app/src/app/viewmodels/panelDiagnosticoViewModel.ts`
- `app/src/ui/PanelDiagnostico.tsx`
- Tests asociados (`*.test.ts`)

## NO tocar

- IDs/codigos de reglas
- Lógica de detección (qué se considera issue)
- Archivos de L1, L3, L4

## Resultado obtenido

**43 reglas renombradas** (15 estructurales + 9 checkers + 19 visuales). `agruparIssuesDiagnostico` ya existía pero solo separaba por severidad; extendieron contrato para agrupar por `reglaId` dentro de cada severidad.

## Commits sugeridos

```
refactor(validaciones): titulos y mensajes humanos en reglas de diagnostico (ronda23/L2 #2)
feat(diagnostico): agrupa issues identicos en panel (ronda23/L2 #8)
test(diagnostico): actualiza aserciones a titulos humanos (ronda23/L2 #2 #8)
```
