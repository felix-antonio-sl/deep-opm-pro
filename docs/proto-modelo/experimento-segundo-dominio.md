# Experimento de falsación de generalidad — segundo dominio (permiso de edificación)

**Pregunta:** ¿la gramática v0.2 + familia V generaliza más allá del estilo HODOM?
**Insumo:** `docs/proto-modelo/segundo-dominio/proto-permiso-edificacion.md` (v0.1, escrito con naturalidad de dominio, SIN ajustar a la gramática).
**Método:** mismo `compilarProto()`, gramática INTACTA. Los rechazos/fallos son el dato del experimento — los mapeos nuevos son decisión del operador (como la familia V).
**Regenerar:** `cd app && bun run scripts/experimento-segundo-dominio.ts`. Este reporte reemplaza al previo.

## 1. Resultado global vs referencia HODOM

- Oraciones aplicadas                     : 53
- Rechazadas (T3)                         : 4
- Fallos de emisión                       : 0
- Excluidas (clase sin primitiva)         : 0
- Cobertura (aplicadas / intentadas)      : 93.0%
- — Referencia HODOM (piloto)             : 98.9% (444 aplicadas, 5 rechazadas, 0 fallos)
- Hechos emitidos                         : 44
- OPDs                                    : 4
- Bundle emite (validarModelo)            : SÍ
- Entidades/Estados/Enlaces (bundle)      : 28/15/26
- Avisos error                            : 0
- Sello L6 en bundle, sin divergencia     : SÍ
- Anclas detectadas/compiladas/candidatas : 1/1/0

## 2. Reglas de la gramática ejercitadas (¿la familia V generaliza?)

- `A1`: 6
- `A2`: 1
- `A4`: 1
- `A6`: 2
- `A9`: 1
- `AESS`: 18
- `V12`: 3
- `V5`: 1
- `V7`: 1

## 3. Rechazos T3 — oración :: categoría :: diagnóstico

- `Resolución del permiso está acotada por un plazo de 30 días (LGUC art. 118).`
  - **R7** :: Relación no primitiva ('acotada por'): usa un enlace etiquetado canónico o una exhibición.
- `Resolución del permiso notifica al Solicitante la resolución adoptada.`
  - **R3** :: No se reconoce un verbo OPM canónico en la oración: reformúlala con una plantilla del catálogo.
- `Planos de arquitectura son informacionales y ambientales.`
  - **R3** :: No se reconoce un verbo OPM canónico en la oración: reformúlala con una plantilla del catálogo.
- `Especificaciones técnicas son informacionales y ambientales.`
  - **R3** :: No se reconoce un verbo OPM canónico en la oración: reformúlala con una plantilla del catálogo.

## 4. Fallos de emisión — oración :: razón

- (sin fallos)

## 5. Análisis de generalidad (adjudicación 2026-06-05 sobre el proto v0.1)

**Lo que GENERALIZÓ** (núcleo confirmado): las reglas T2 (A1 listas, A2 estados, A4, A6 multi-destino,
A9 exhibe-como, AESS) y la familia V ejercitada (V5 `detecta`, V7 `precede a`, V12 colas `cuando`)
operaron sin fricción sobre un dominio ajeno; el lector de estructura armó los 4 OPDs (raíz + 2
in-zoom + 1 despliegue) con la misma convención; el bundle valida y porta sello L6.

**SOBREAJUSTE CONFIRMADO** (2 hallazgos léxicos de borde — mapeos candidatos, DECISIÓN DEL OPERADOR):

1. **Esencia plural de entidad singular**: `Planos de arquitectura son informacionales y ambientales`
   → R3 (×2). La ruta singular de esencia exige `es`; la plural existe solo para LISTAS (A1). Un
   dominio con entidades de nombre gramaticalmente plural (Planos, Especificaciones) no puede declarar
   esencia. HODOM casi no las tiene (cf. cola «Otros profesionales» en-reflexión). Mapeo candidato:
   `X son <esencia-pl> y <afiliacion-pl>` con X sin separadores de lista → esencia singular.
2. **Alfabeto cerrado de normas** (`ANCLA_PAREN_NORMA_RE`: `DS|NT|DTO|Ley|Decreto`): `(LGUC art. 116)`
   y `(OGUC §…)` NO se reconocen como ancla — el vocabulario normativo está sobreajustado a HODOM.
   Candidatos: LGUC, OGUC, DFL, Res. Ex., Circular (o patrón genérico `<SIGLA> art./§ N`).

**HALLAZGO SERIO — degradación SILENCIOSA** (peor que un rechazo): la cita no reconocida NO se rechaza —
se pega al NOMBRE: el bundle contiene `Permiso de edificación (LGUC art. 116)` **Y** `Permiso de
edificación` como DOS entidades distintas (SD0 genera la primera; SD1 referencia la segunda). Modelo
válido pero semánticamente corrupto, sin diagnóstico. Viola el espíritu de L2/L8 («nada se pierde en
silencio») por la rendija del nombre. Guard candidato (decisión del operador): paréntesis con patrón
`art./§` y sigla NO reconocida → diagnóstico, no absorber al nombre.

**Rechazos correctos (NO sobreajuste)**: `está acotada por un plazo de 30 días` (R7) COLISIONA con la
oración en-reflexión de HODOM `está-acotado-por` — el patrón es TRANSVERSAL a dominios, lo que sube la
prioridad de esa reflexión del operador. `notifica al Solicitante` (R3) es verbo nuevo legítimo,
candidato a familia V futura. Ambos con diagnóstico útil.

**Honestidad de la métrica**: la cobertura de §1 SOBRESTIMA — la oración del art. 116 cuenta como
`aplicada` pero produjo la entidad duplicada (corrupción silenciosa). Cobertura sana real: 52/57.

**Veredicto**: la gramática NUCLEAR generaliza; el sobreajuste vive en los BORDES LÉXICOS (alfabeto
normativo, morfología plural) + 1 bug de silencio en la absorción de citas. Ninguno se corrige sin el
operador (los mapeos son decisiones de dialecto, como la familia V).

