# Reglas OPM para opm-model-app

Transformación ejecutable de la SSOT OPM (`ssot/opm-{visual,iso-19450,opl,metodologia}-es.md`) a listas de reglas accionables, organizadas por etapa/proceso de la app. Cada archivo agrupa reglas cohesionadas y las presenta en forma de checklist aplicable por el kernel, el renderer, el layout, la UI y los tests de conformidad.

## Propósito

La SSOT vive como prosa normativa densa (~5500 líneas, 263 reglas `V-*`, decenas de plantillas OPL, 16 capítulos metodológicos). Este directorio la re-serializa en **reglas atómicas accionables**, indexadas por etapa de la app, para que cualquier cambio de código pueda citar la(s) regla(s) que implementa y cualquier revisión de conformidad pueda chequearlas mecánicamente.

## Autoridad y precedencia

Estos artefactos son **derivados de la SSOT**. En caso de conflicto entre un artefacto aquí y la SSOT, **prevalece la SSOT**. El pin vive en `ssot.lock`. Cualquier regla citada debe recuperarse contra el archivo canónico correspondiente.

Orden de precedencia del corpus:

1. `opm-iso-19450-es.md` — núcleo conceptual y ontológico
2. `opm-opl-es.md` — superficie textual canónica
3. `opm-visual-es.md` — gramática visual del OPD
4. `metodologia-opm-es.md` — procedimiento de modelado

## Organización

Los artefactos están numerados por bloque semántico:

| Rango | Bloque | Cobertura |
|---|---|---|
| `00-01` | Meta y canon | Precedencia, canon-diagrama/documento |
| `10-16` | Primitivas visuales | Cosas, estados, enlaces, decoraciones, marcas, operadores |
| `20-21` | Layout y tiempo | Composición OPD, paralelismo, orden |
| `30-35` | Refinamiento | In-zooming, unfolding, distribución, precedencia, supresión |
| `40-42` | Navegación y metamodelo | Árbol OPD, identidad, sub-modelos |
| `50-53` | Runtime y extensiones | Simulación, duración, estereotipos, computacional |
| `60-64` | UI y validación | Afordances, estilado, validación, export, Bring |
| `70-73` | OPL | Plantillas textuales canónicas |
| `80-87` | Metodología | SD, SD1, complejidad, heurísticas |
| `99` | Invariantes | Checklist de verificación global |

## Convención de cada artefacto

Cada archivo sigue el patrón:

```
# Título

**Alcance**: qué cubre y qué no
**Capa SSOT propietaria**: archivo(s) canónico(s) y sección
**Aplicación en la app**: qué módulo(s) de `src/` implementan

## Reglas

### R-xxx: Título breve
- Enunciado
- Referencia SSOT: V-xx | §N.M
- Aplicación en código: ruta y función
- Antipatrón: error común a evitar

## Checklist
## Antipatrones
## Referencias cruzadas
```

El ID `R-xxx` es **local al artefacto** para orquestación; la autoridad canónica de la regla vive en su referencia `V-*` o `§N.M` de la SSOT.

## Uso

1. **Desarrollo de features**: ubicar el artefacto del bloque correspondiente y usar su checklist.
2. **Review de PRs**: verificar que cada cambio visible cite las reglas que modifica o implementa.
3. **Auditoría de conformidad**: el archivo `99-invariantes-verificaciones.md` consolida los invariantes obligatorios de toda capa, con severidad y aplicabilidad automática/manual.
4. **Onboarding**: leer `INDEX.md` primero, luego los bloques correspondientes al área de trabajo.

## Cobertura total

- 263 reglas `V-*` mapeadas
- 80+ plantillas OPL-ES (D, T, TS, H, HS, ET, EH, ETS, EHS, CT, CH, CS, EX, IV, SE, RF, SSE, CX, CM)
- 16 capítulos metodológicos
- 6 principios OPM
- 2 invariantes de §15, ~40 verificaciones de §16

## Mantenimiento

Cuando la SSOT cambie:

1. Actualizar `ssot.lock` vía `bun run scripts/verificar-ssot-pin.ts`.
2. Identificar secciones afectadas en la SSOT.
3. Actualizar artefactos derivados, preservando referencias `V-*`.
4. Documentar breaking changes en un ADR si el cambio altera implementación.
