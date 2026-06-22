# 80 — Metodología: clasificación de sistema y construcción del SD

**Alcance**: clasificación del sistema (artificial/natural/social/socio-técnico), asistente agnóstico de construcción del SD, 11 etapas, verificación del SD, patrones por categoría.
**Capa SSOT propietaria**: `metodologia-opm-es.md` §5, §6, §6b
**Aplicación en la app**: futuro asistente de construcción, checklist del SD.

## Reglas

### R-4000: Clasificación del sistema (obligatoria antes del SD)

- Enunciado: antes de construir el SD, el modelador DEBE clasificar el sistema. La clasificación determina qué componentes del SD aplican.

Categorías y reglas prescriptivas:

| Categoría | Modelar |
|---|---|
| **Artificial** | 5 componentes completos |
| **Natural** | SIN propósito (usar "resultado"); SIN ocurrencia del problema; SIN agentes humanos (solo instrumentos) |
| **Social** | 5 componentes completos; puede usar enlaces habilitadores con estado especificado para condiciones ambientales |
| **Socio-técnico** | 5 componentes completos; puede usar enlaces estructurales etiquetados para relaciones no fundamentales |

- Referencia SSOT: `metodologia-opm-es.md` §5
- Aplicación en código: UI fuerza selección de categoría antes de iniciar asistente.

### R-4001: Patrones de referencia por categoría

- Enunciado:

| Categoría | Patrón | Lección |
|---|---|---|
| Artificial | `Airplane Flying`, `Battery Charging` | Propósito explícito, ocurrencia del problema, agentes humanos, objeto proveedor de beneficio |
| Natural | `Fetus Developing`, `Rain Storm Forming` | Resultado en vez de propósito; sin agentes humanos |
| Social | `Conference Occurring` | Condiciones ambientales con estado especificado (ej. `good Weather`) |
| Socio-técnico | `Online Professional Identity Managing` | Enlaces estructurales etiquetados para relaciones no fundamentales |
| Físico con partes informacionales | `Baggage Transporting` | Sigue clasificándose físico si la transformación dominante es física |

- Referencia SSOT: `metodologia-opm-es.md` §5.1
- Aplicación en código: la UI ofrece ejemplos por categoría.

### R-4002: Asistente agnóstico — 11 etapas obligatorias

- Enunciado:

| Etapa | Objetivo | Salida mínima |
|---|---|---|
| 0 | Clasificar sistema | Tipo: artificial / natural / social / socio-técnico |
| 1 | Fijar proceso principal | Nombre canónico |
| 2 | Identificar interesado primario | Grupo beneficiario |
| 3 | Fijar valor a transformar | Atributo del beneficiario + estados entrada/salida |
| 4 | Fijar función principal | Objeto proveedor de beneficio + atributo funcional |
| 5 | Resolver agencia humana | Agentes válidos o declaración explícita de ausencia |
| 6 | Delimitar el sistema | Nombre del sistema + exhibición del proceso |
| 7 | Identificar habilitadores no humanos | Instrumentos |
| 8 | Fijar transformados y resultados | Entradas, afectados, salidas |
| 9 | Delimitar contexto externo | Objetos/procesos del entorno |
| 10 | Modelar problema inicial si aplica | Ocurrencia o decisión de no-aplicación |
| 11 | Cerrar con compuerta de consistencia | Verificación SD `PASA/FALLA` |

- Referencia SSOT: `metodologia-opm-es.md` §6.0
- Aplicación en código: wizard con 12 puntos de control.

### R-4003: Semántica de cierre por etapa

- Enunciado:
  - Si una etapa NO puede cerrarse, el asistente DEBE retroceder a la etapa anterior que bloquea la decisión
  - Si el sistema es **natural**, la etapa 10 DEBE cerrarse como `NO APLICA`, no como omisión silenciosa
  - Si el sistema transforma múltiples objetos, la etapa 4 DEBE dejar explicitado el **Objeto Proveedor de Beneficio**
  - Si no existen agentes humanos, la etapa 5 DEBE registrar `sin agentes humanos` en vez de forzar un marcador de posición
- Referencia SSOT: `metodologia-opm-es.md` §6.0
- Aplicación en código: validación por etapa; retroceso automático.

### R-4004: Nombre del proceso principal (acción transformadora)

- Enunciado: antes de aceptar un nombre, el modelador DEBE validar que expresa **acción transformadora**, no clase de objeto ni etiqueta administrativa.
- Referencia SSOT: `metodologia-opm-es.md` §6.1
- **Correctos**: `Battery Charging`, `Airplane Flying`, `Preparar Empanadas`, `Verificación de Identidad`
- **Incorrectos**: `Charge Battery`, `Fly Airplane`, `Batería`, `Proceso Principal`
- Aplicación en código: validador de nombres con heurística.

### R-4005: Grupo beneficiario en singular + colectivo

- Enunciado: el nombre DEBE ser singular según el Principio del Nombre Singular de OPM:
  - EN: sufijo "Group" para humanos, "Set" para inanimados
  - ES: sufijo "Grupo" para humanos, "Conjunto" para inanimados

El grupo beneficiario DEBE representarse como **objeto físico**.

- Referencia SSOT: `metodologia-opm-es.md` §6.2

### R-4006: Atributo del beneficiario con 2 estados

- Enunciado: el modelador DEBERÍA definir un atributo **informacional** del beneficiario con exactamente dos estados:
  - **Estado de entrada** (actual/problemático)
  - **Estado de salida** (deseado/mejorado)

OPL-ES: `*Proceso Principal* cambia **Atributo del Beneficiario** de **Grupo Beneficiario** de \`entrada\` a \`salida\`.` (TS3)

- Referencia SSOT: `metodologia-opm-es.md` §6.3
- Aplicación en código: plantilla de atributo del beneficiario.

### R-4007: Función principal — transformado principal

- Enunciado: el modelador DEBE identificar el transformado principal (objeto proveedor de beneficio) y DEBERÍA agregar un atributo cuyo valor cambia de problemático a satisfactorio.

Cuando el proceso transforma múltiples transformados, solo el objeto proveedor de beneficio define la función. Otros transformados DEBEN modelarse pero NO son parte de la función.

- Referencia SSOT: `metodologia-opm-es.md` §6.4
- Aplicación en código: marcar explícitamente el objeto proveedor.

### R-4008: Agentes solo para humanos

- Enunciado: el término "agente" y el enlace de agente (piruleta negra) DEBEN usarse **exclusivamente** para humanos o grupos humanos. Robots, agentes de software y sistemas IA DEBEN usar enlace de instrumento.
- Referencia SSOT: `metodologia-opm-es.md` §6.5, `opm-iso-19450-es.md` §3.3
- Aplicación en código: validador rechaza agente a objeto no-humano.

### R-4009: Beneficiario también agente — resolución

- Enunciado: cuando el beneficiario es también agente del proceso, el modelador DEBE elegir el enlace según la precedencia semántica del corpus: si el beneficiario es transformado, el enlace transformador prevalece sobre el habilitador. La identidad humana del beneficiario se preserva en el nombre de la cosa y en su ubicación en el OPD, NO mediante un segundo enlace procedimental simultáneo al mismo proceso.
- Referencia SSOT: `metodologia-opm-es.md` §6.5

### R-4010: Doble rol en procesos distintos admitido

- Enunciado: un objeto PUEDE ser agente de un proceso y transformado de otro proceso distinto simultáneamente. Ejemplo: *Learner* es agente de *MOOC Learning* pero también transformado (*Knowledge Level* cambia).
- Referencia SSOT: `metodologia-opm-es.md` §6.5
- Distinción: es distinto de la colisión agente-afectado en el **mismo** proceso, donde prevalece el rol transformador.

### R-4011: Sistema exhibe proceso principal

- Enunciado: el nombre por defecto del sistema DEBERÍA ser el nombre del proceso + "Sistema". El proceso principal DEBE modelarse como **operación del sistema** vía exhibición-caracterización.
- Referencia SSOT: `metodologia-opm-es.md` §6.6
- Aplicación en código: plantilla genera enlace `Sistema exhibe *Proceso Principal*`.

### R-4012: Reclasificación de instrumentos por desgaste

- Enunciado: cuando el desgaste, degradación o amortización de un instrumento es relevante al alcance del sistema, el modelador DEBE reclasificarlo como **afectado**, agregando un atributo (ej. Amortization Level) que el proceso cambia. Se DEBE modelar un proceso de mantenimiento separado.
- Referencia SSOT: `metodologia-opm-es.md` §6.7
- **Correcto**: Machine es afectado (Amortization Level cambia); Machine Maintaining es proceso separado.
- **Incorrecto**: Machine es instrumento cuando su desgaste es relevante.

### R-4013: Objetos de entrada/salida

- Enunciado: cada objeto consumido → enlace de consumo; cada creado → enlace de resultado. Si un objeto es afectado (no consumido), DEBE conectarse vía par entrada-salida especificando la transición de estados.
- Referencia SSOT: `metodologia-opm-es.md` §6.8
- Aplicación en código: asistente categoriza objetos por rol.

### R-4014: Objetos ambientales con contorno discontinuo

- Enunciado: los objetos ambientales DEBEN representarse con contorno discontinuo. Un mismo objeto PUEDE ser sistémico en un modelo y ambiental en otro.
- Referencia SSOT: `metodologia-opm-es.md` §6.9
- Aplicación en código: campo `afiliacion` del modelo.

### R-4015: Ocurrencia del problema (artificiales y sociales)

- Enunciado: para sistemas artificiales y sociales, el modelador DEBE modelar la **ocurrencia del problema** — imagen espejo del propósito. Se DEBE agregar un proceso ambiental que causa el estado problemático. Para sistemas naturales, NO DEBE modelarse.
- Referencia SSOT: `metodologia-opm-es.md` §6.10
- Aplicación en código: plantilla de ocurrencia del problema.

### R-4016: Verificación del SD

- Enunciado:

| Verificación | Condición | Severidad |
|---|---|---|
| Propósito definido | Beneficiario + atributo + transición estados | CRÍTICA |
| Función definida | Proceso principal + transformado principal | CRÍTICA |
| Habilitadores presentes | ≥1 agente o instrumento | ALTA |
| Entorno identificado | ≥1 objeto ambiental | MEDIA |
| Ocurrencia del problema (si aplica) | Proceso ambiental causa estado negativo | MEDIA |
| OPL legible | Sentencias OPL correctas | ALTA |
| Nombres conformes | Política léxica conforme | ALTA |
| Exhibición | Sistema exhibe proceso como operación | ALTA |
| Agentes = humanos | Ningún instrumento con enlace de agente | ALTA |

- Referencia SSOT: `metodologia-opm-es.md` §6.11
- Aplicación en código: checklist ejecutable.

### R-4017: Escala de severidad y correspondencia con DEBE/DEBERÍA

- Enunciado: la escala `CRÍTICA / ALTA / MEDIA / BAJA` refleja peso operativo y NO es equivalente estricto a `DEBE / DEBERÍA / PUEDE`:
  - CRÍTICA ~ DEBE
  - ALTA ~ DEBERÍA
  - MEDIA ~ advertencia
  - BAJA ~ sugerencia estética
- Referencia SSOT: `metodologia-opm-es.md` §6.11
- Aplicación en código: validador usa esta escala.

### R-4018: Contrato de salida del asistente

- Enunciado: un asistente agnóstico correcto entrega, como mínimo:
  1. tipo de sistema
  2. proceso principal
  3. beneficiario/afectado
  4. atributo de valor + transición de estados
  5. función principal
  6. agentes
  7. sistema + exhibición
  8. instrumentos
  9. conjunto de entradas/salidas
  10. entorno
  11. ocurrencia del problema o no-aplicación
  12. verificación SD

Una herramienta PUEDE dividir o fusionar etapas, pero NO DEBE perder ninguna salida.

- Referencia SSOT: `metodologia-opm-es.md` §6.0
- Aplicación en código: contrato del estado final del SD.

### R-4019: Implementaciones válidas del asistente

- Enunciado: implementaciones válidas incluyen:
  - entrevista guiada
  - formulario estructurado
  - lista de verificación operativa
  - asistente conversacional
  - complemento de modelado
  - flujo de trabajo humano moderado
- Referencia SSOT: `metodologia-opm-es.md` §6.0
- Aplicación en código: el asistente puede ser conversacional o formulario.

### R-4020: Principio rector del modelado

- Enunciado: el modelado DEBE comenzar por la **función del sistema**, continuar con la delimitación de su valor, agentes, entorno y transformados, y solo después profundizar en estructura, control, simulación y gobernanza.
- Referencia SSOT: `metodologia-opm-es.md` §4
- Consecuencias:
  - La función es la semilla del modelo
  - El SD precede a cualquier refinamiento
  - La claridad local del OPD no puede lograrse violando completitud global del conjunto de OPDs
  - Toda heurística está subordinada a la equivalencia OPD-OPL

## Checklist

- [ ] Clasificación obligatoria antes del SD
- [ ] Las 12 etapas del asistente cubiertas
- [ ] Nombre del proceso principal como acción transformadora
- [ ] Beneficiario singular con sufijo colectivo
- [ ] Atributo del beneficiario con 2 estados
- [ ] Objeto proveedor de beneficio explícito
- [ ] Agentes solo para humanos
- [ ] Doble rol admitido en procesos distintos
- [ ] Sistema exhibe proceso principal
- [ ] Instrumentos con desgaste reclasificados como afectados
- [ ] Objetos ambientales con contorno discontinuo
- [ ] Ocurrencia del problema modelada si aplica
- [ ] Verificación SD pasa
- [ ] Asistente retrocede si etapa no cierra
- [ ] Salida completa del asistente (12 decisiones)

## Antipatrones

- Nombre de proceso = "Sistema" o "Proceso Principal" (no es acción)
- SD sin beneficiario declarado
- Robot marcado como agente
- SD con proceso principal sin transformado
- Naturales con propósito declarado
- Omitir ocurrencia del problema en artificiales
- Grupo beneficiario en plural sin "Grupo de"

## Referencias cruzadas

- Primitivas: `10-primitivas-cosas.md`
- Enlaces y familias: `13-enlaces-taxonomia-familias.md`
- Estados: `11-estados-designaciones.md`
- OPL plantillas: `70-opl-convenciones-y-plantillas-cosa-estado.md`, `71-opl-plantillas-procedimentales.md`
- SD1 refinamiento: `81-metodologia-sd1-descomposicion.md`
- Heurísticas: `83-metodologia-heuristicas-avanzadas.md`
- Invariantes globales: `99-invariantes-verificaciones.md`
