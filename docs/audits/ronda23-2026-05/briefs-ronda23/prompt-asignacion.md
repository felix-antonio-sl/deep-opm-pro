# Prompt de asignación — Ronda 23

## Plantilla genérica

```
Sos el ejecutor de la línea {{LINEA}} de la ronda 23 del repo deep-opm-pro.
Brief vinculante: {{PATH_BRIEF}}

Reglas duras (no negociables):
1. Aditividad: solo agregás o reparás; no destruís funcionalidad existente.
2. Scope estricto: si encontrás un bug fuera de tu línea, dejalo documentado en /tmp/ronda23-hallazgos-ortogonales.md.
3. OPL canónico es sagrado: nada en `app/src/leyes/opl*.ts` ni `app/src/modelo/opl*.ts`.
4. IDs de reglas estables: si tocás reglas de diagnóstico (L2), solo cambia `titulo`/`mensaje`, jamás `id`/`codigo`.
5. Loop verde obligatorio antes de declarar cierre:
   cd /home/felix/projects/deep-opm-pro/app && bun run check && bun run browser:smoke
6. Idiomas: castellano con tildes correctas en strings de UI; identificadores en forma original.
7. Co-author footer en cada commit: Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>.
8. NO tocar: docs/HANDOFF.md, docs/roadmap/, docs/historias-usuario-v2/.
9. Antes de implementar lógica nueva, buscá en opm-extracted/ y en el código existente (grep agresivo).

Anti-magia:
- No expandir scope ni proponer features.
- No convertir copy a YAML/i18n.
- No introducir LLM para el wizard.
- No agregar feature flags fuera de los explicitados.
```

## Orden de despacho efectivamente usado

| Ola | Líneas | Razón |
|---|---|---|
| 1 | L1 + L4 paralelas | No comparten archivos críticos línea a línea |
| 2 | L2 | Comparte `PanelDiagnostico.tsx` con L1; espera merge L1 |
| 3 | L3 | Más pesada; sola para evitar conflictos en `Bienvenida.tsx`/`EstadoVacioOpm.tsx` |

## Coherencia metodológica

Las 4 líneas compartieron:

- Estilo de commit imperativo en español con prefijo convencional
- Co-author footer obligatorio
- Tests verdes (1481 unit + 218 smoke) antes de declarar cierre
- Anti-magia compartido (no expandir, no convertir a i18n, no LLM, no feature flags fuera del explicitado)

## Resultado final

- **18 commits** en `main` (3 L4 + 6 L1 + 3 L2 + 6 L3)
- **14 ítems ✅ + 1 ⚠ justificado** de 15 hallazgos del audit
- **3 olas wall-time**: ~3 horas para que 4 agentes ejecutaran de forma autónoma sin intervención del operador (solo el orquestador encadenó las olas y validó)
