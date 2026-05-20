# Briefs — Ronda 23

Orquestamiento original producido por el agente `steipete` a partir del audit jobs-web-ux. Los briefs vinculantes que leyó cada ejecutor antes de tocar código.

## Filosofía operativa (no negociable)

1. **Aditividad**: cada línea agrega o repara; no destruye funcionalidad existente.
2. **Scope estricto**: si un agente encuentra un bug fuera de su línea, lo deja documentado pero no lo corrige.
3. **OPL canónico es sagrado**: los strings OPL emitidos por templates (`Objeto es un objeto informacional y sistémico.`) NO se tocan; tienen tests literales.
4. **IDs de reglas estables**: `proceso-sin-entrada-ni-salida` es un ID interno usado por tests y serialización; solo cambia el `titulo`/`mensaje` visible al usuario.
5. **Loop verde obligatorio** por línea: `cd app && bun run check` + `bun run browser:smoke` antes de declarar cierre.
6. **Anti-magia**: no expandir scope, no convertir copy a YAML/i18n, no introducir LLM para el wizard, no añadir feature flags.

## Mapa de colisiones por archivo

| Archivo | L1 | L2 | L3 | L4 |
|---|---|---|---|---|
| `app/src/ui/panelOpl/Toolbar.tsx` | aditivo | — | — | — |
| `app/src/ui/CommandPalette.tsx` | aditivo | — | — | — |
| `app/src/ui/BarraHerramientasElemento.tsx` | aditivo | — | — | — |
| `app/src/ui/PanelDiagnostico.tsx` | aditivo (#9 conteo) | aditivo (#8 agrupar) | — | — |
| `app/src/modelo/validaciones.ts` | — | aditivo | — | — |
| `app/src/modelo/diagnostico.ts` | — | aditivo | — | — |
| `app/src/ui/Inspector.tsx` | — | — | — | aditivo |
| `app/src/ui/InspectorEntidad.tsx` | aditivo (strings/icons) | — | — | aditivo (estructura) |
| `app/src/ui/asistente/*` | lectura (tildes) | — | aditivo / borra | — |
| `app/src/ui/Bienvenida.tsx` (eliminado en L3) | — | — | aditivo→delete | — |
| `app/src/modelo/creacionWizard.ts` | — | — | aditivo | — |
| `app/src/modelo/operaciones.ts` | — | — | — | aditivo (señal focus) |

## Olas de ejecución

| Ola | Líneas | Razón |
|---|---|---|
| 1 | L1 + L4 paralelas | No comparten archivos críticos línea a línea |
| 2 | L2 | Comparte `PanelDiagnostico.tsx` con L1; espera merge L1 |
| 3 | L3 | Más pesada (9 archivos borrados); sola para evitar conflictos |

## Resultado por línea

| Línea | Commits aplicados | Items | Comentario |
|---|---|---|---|
| L1 | `8c13b6c`, `3151a0e`, `9b0668b`, `edd62ca`, `18dc021`, `b96d5ce` | 8 ✅ + 1 ⚠ (#12) | #12 cerrado parcial; el render ya no usaba "···", justificación documentada |
| L4 | `b02a5f3`, `5e6d09b`, `fef743b` | 2 ✅ | Mecanismo focus: bus en store (Opción A) |
| L2 | `4c8bd2b`, `d1f5cc6`, `1259160` | 2 ✅ | 43 reglas renombradas (mucho más que las 3 mínimas del brief). `agruparIssuesDiagnostico` ya existía; extendieron contrato |
| L3 | `1bc0316`, `b69a893`, `23e4b37`, `ac6e797`, `6eca4d5`, `a631742` | 2 ✅ | 9 archivos eliminados (Bienvenida, EtapaAmbientales, EtapaAtributo, EtapaConfirmar, EtapaEntradas, EtapaHandler, EtapaHerramientas, EtapaNombreSistema, EtapaSalidas) + 1 nuevo (`EtapaSembrar.tsx`) |

Total: **18 commits, 14 ítems ✅ + 1 ⚠ justificado de los 15 hallazgos del audit**.
