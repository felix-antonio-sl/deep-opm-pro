# Experimento de falsación de generalidad — segundo dominio (permiso de edificación)

**Pregunta:** ¿la gramática v0.2 + familia V generaliza más allá del estilo HODOM?
**Insumo:** `docs/proto-modelo/segundo-dominio/proto-permiso-edificacion.md` (v0.1, escrito con naturalidad de dominio, SIN ajustar a la gramática).
**Método:** mismo `compilarProto()`, gramática INTACTA. Los rechazos/fallos son el dato del experimento — los mapeos nuevos son decisión del operador (como la familia V).
**Regenerar:** `cd app && bun run scripts/experimento-segundo-dominio.ts`. Este reporte reemplaza al previo.

## 1. Resultado global vs referencia HODOM

- Oraciones aplicadas                              : 55
- Rechazadas (T3)                                  : 2
- Fallos de emisión                                : 0
- Excluidas (clase sin primitiva)                  : 0
- Cobertura (aplicadas / intentadas)               : 96.5%
- Duplicados por absorción (corrupción silenciosa) : 0
- Cobertura SANA (descuenta corrupciones)          : 96.5%
- — Referencia HODOM (piloto)                      : 98.9% (444 aplicadas, 5 rechazadas, 0 fallos)
- Hechos emitidos                                  : 47
- OPDs                                             : 4
- Bundle emite (validarModelo)                     : SÍ
- Entidades/Estados/Enlaces (bundle)               : 29/15/29
- Avisos error                                     : 0
- Sello L6 en bundle, sin divergencia              : SÍ
- Anclas detectadas/compiladas/candidatas          : 3/3/0

## 2. Reglas de la gramática ejercitadas (¿la familia V generaliza?)

- `A1`: 6
- `A2`: 1
- `A4`: 1
- `A6`: 2
- `A9`: 1
- `AESS`: 18
- `V12`: 3
- `V16`: 1
- `V17`: 1
- `V5`: 1
- `V7`: 1

## 2b. Auditoría familia-V (F3 — migrable-estricto vs requiere-decisión)

- Líneas por familia V (total)        : 7
-   · migrable-estricto (V3/V4/V5/V7) : 2 [V5×1, V7×1]
-   · requiere-decisión (12 reglas)   : 5 [V12×3, V16×1, V17×1]

## 3. Rechazos T3 — oración :: categoría :: diagnóstico

- `Planos de arquitectura son informacionales y ambientales.`
  - **R8** :: Nombre plural sin sufijo Conjunto/Grupo (R-NOM-OBJ-1/2): renombra "Planos de arquitectura" como "Conjunto de planos de arquitectura" (inanim
- `Especificaciones técnicas son informacionales y ambientales.`
  - **R8** :: Nombre plural sin sufijo Conjunto/Grupo (R-NOM-OBJ-1/2): renombra "Especificaciones técnicas" como "Conjunto de especificaciones técnicas" (

## 4. Fallos de emisión — oración :: razón

- (sin fallos)

## 5. Hallazgos, adjudicación y remediación (ciclo completo 2026-06-05)

La PRIMERA corrida (proto v0.1, gramática pre-adjudicación) arrojó 93.0% con 4 rechazos y dos
defectos de borde; el operador convocó a **dov-dori**, cuya adjudicación
(`adjudicacion-dov-dori-2026-06-05.md`) fue IMPLEMENTADA el mismo día. Resolución por hallazgo:

| # | Hallazgo (1ª corrida) | Adjudicación | Estado |
|---|---|---|---|
| (a) | `Planos de arquitectura son…` → R3 | **R8**: plural sin Conjunto/Grupo se RECHAZA con sugerencia (R-NOM-OBJ-1/2) — jamás se normaliza en silencio | implementado (rechazo correcto: el barro vuelve al modelador) |
| (b) | alfabeto cerrado `DS\|NT\|DTO\|Ley\|Decreto` | detector por **LOCALIZADOR** (`art./§/inc./letra/N°`, conjunto cerrado) + cuerpo-con-numeración legal; el alfabeto de cuerpos es ABIERTO y no se enumera | implementado (`(LGUC art. 116)`, `(OGUC §5.1.6)` ahora compilan a ancla) |
| (c) | cita absorbida al nombre → entidad DUPLICADA silenciosa | guard **R9** en el punto de creación (residuo no nominal ⇒ fallo con diagnóstico) + check `detectarDuplicadosPorAbsorcion` | implementado (BLOQUEANTE, fue primero) |
| (d) | `está acotada por un plazo de 30 días` → R7 | **V17** bifurcado por firma de extremos: temporal→`exhibe Plazo`+cola; abstracto↔abstracto→etiquetado «está acotado por». Destraba la ex-en-reflexión #2 de HODOM | implementado |
| (e) | `notifica al Solicitante` → R3 | **V16**: `genera Notificación` + etiquetado «dirigido a» (+contenido como cola). El enum de verbos NUNCA se infla | implementado |

**Los números de §1-§4 de este reporte reflejan la gramática POST-adjudicación.** Los rechazos
residuales esperados del proto v0.1 son los R8 (plurales mal formados que el AUTOR debe renombrar
`Conjunto de…` — rechazo correcto, no sobreajuste).

**Veredicto de fondo (dov-dori §2, pendiente de ratificación del operador como P3):** la gramática
determinista NO es utopía — la que pretende enumerar léxico de dominio SÍ lo es. Frontera recomendada:
el léxico abierto (mapeos verbo-de-dominio, citas, morfología) sube al LLM en E2 (propone, humano
confirma); el compilador queda como VERIFICADOR TOTAL sobre el enum cerrado + emisor reproducible.
El LLM nunca toca el bundle; el compilador nunca adivina semántica de dominio.

