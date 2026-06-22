# 81 — Metodología: SD1 y refinamiento Nivel 1

**Alcance**: refinamiento de proceso síncrono (descomposición) y asíncrono (despliegue), refinamiento de objetos, procedimiento, distribución de enlaces, expresión/supresión de estados, verificación SD1.
**Capa SSOT propietaria**: `metodologia-opm-es.md` §7, §7b
**Aplicación en la app**: asistente de in-zooming, validador SD1.

## Reglas

### R-4100: Refinamiento de proceso síncrono (descomposición)

- Enunciado: aplica cuando los subprocesos tienen un orden fijo y predefinido.

Procedimiento:
1. Crear nuevo OPD etiquetado SD1
2. Inflar el proceso principal en el centro
3. Agregar subprocesos verticalmente según **Principio de Línea de Tiempo de OPM** (primero arriba, último abajo)
4. Cada subproceso DEBE estar conectado a al menos un transformado
5. Verificar agregación-participación implícita por contención gráfica

- Referencia SSOT: `metodologia-opm-es.md` §7.1

### R-4101: Descomposición: en mismo diagrama vs diagrama nuevo

- Enunciado:

| Variante | Usar cuando |
|---|---|
| **En mismo diagrama** | OPD tiene espacio suficiente; pocos subprocesos |
| **En diagrama nuevo** | Caso prevalente; el acercamiento requiere espacio sustancial |

- Referencia SSOT: `metodologia-opm-es.md` §7.1
- Aplicación en código: UI pregunta o decide según espacio.

### R-4102: Identidad semántica de la descomposición

- Enunciado: cuando un proceso se descompone:
  - sus subprocesos = **partes** (agregación-participación + ordenabilidad positiva)
  - los objetos que exhibe (vía exhibición) = **atributos** del proceso
  - objetos que ingresan por migración de enlaces mantienen su identidad independiente y NO son atributos del proceso

Simétricamente, cuando un objeto se descompone:
  - objetos internos = **partes**
  - procesos internos = **operaciones** del objeto
- Referencia SSOT: `metodologia-opm-es.md` §7.1

### R-4103: Refinamiento no trivial (≥ 2 refinadores)

- Enunciado: un proceso descompuesto DEBE contener al menos **2 subprocesos**. Un despliegue DEBE revelar al menos **2 refinadores**. Un refinamiento con un solo elemento hijo NO agrega información al modelo y DEBERÍA eliminarse o postergarse.
- Referencia SSOT: `metodologia-opm-es.md` §7.1
- Aplicación en código: validador rechaza refinamiento con 1 refinador.

### R-4104: Elaboración progresiva de SD1

- Enunciado: secuencia recomendada para construir un OPD hijo:
  1. Inflar el proceso principal (contorno grueso en padre e hijo)
  2. Agregar subprocesos (mínimo 2) en posición vertical según línea de tiempo
  3. Renombrar subprocesos con nombres de dominio significativos (reemplazando placeholders)
  4. Traer elementos externos conectados al proceso padre
  5. Crear objetos internos necesarios
  6. Agregar estados a los objetos que participan en transformaciones
  7. Crear enlaces internos entre subprocesos y objetos
- Referencia SSOT: `metodologia-opm-es.md` §7.1
- Aplicación en código: asistente con estas fases.

### R-4105: Paralelismo implícito

- Enunciado: cuando dos o más subprocesos tienen el borde superior de sus elipses a la misma altura, DEBEN interpretarse como ejecutándose en paralelo. El siguiente subproceso inicia cuando el último de los paralelos termina. OPL usa la palabra clave `en paralelo`.
- Referencia SSOT: `metodologia-opm-es.md` §7.1, V-32
- Aplicación en código: layout valida misma altura.

### R-4106: Refinamiento de proceso asíncrono (despliegue)

- Enunciado: aplica cuando los subprocesos son independientes y PUEDEN ocurrir en cualquier orden.
- Referencia SSOT: `metodologia-opm-es.md` §7.2
- Aplicación en código: distinguir síncrono vs asíncrono en la UI.

### R-4107: Cuatro pares de despliegue-plegado

- Enunciado:

| Relación | Despliegue | Plegado |
|---|---|---|
| Agregación-participación | Exponer partes del todo | Ocultar partes |
| Exhibición-caracterización | Exponer rasgos del exhibidor | Ocultar rasgos |
| Generalización-especialización | Exponer especializaciones | Ocultar especializaciones |
| Clasificación-instanciación | Exponer instancias | Ocultar instancias |

- Referencia SSOT: `metodologia-opm-es.md` §7.2
- Nota: estos son pares de refinamiento-abstracción sobre relaciones estructurales. NO deben confundirse con los cuatro pares canónicos de §8.1 (tres intra-modelo + sub-model inter-modelo).

### R-4108: Decisión agregación vs generalización

- Enunciado:

| Pregunta | Si → | No → |
|---|---|---|
| ¿Cada subproceso es una variante/tipo del mismo patrón? | Generalización-especialización | Agregación-participación |
| ¿El todo necesita todas las partes para funcionar? | Agregación-participación | Generalización-especialización |

- Referencia SSOT: `metodologia-opm-es.md` §7.2
- **Correcto**: `Road Danger Warning → Vehicle Crash Alerting, Pedestrian Crash Alerting, Lane Deviation Alerting` son *tipos* → generalización.
- **Incorrecto**: Usar agregación para tipos/variantes.

### R-4109: Refinamiento de objetos

- Enunciado: los objetos se refinan vía:
  - **descomposición** (composición espacial/estructural)
  - **despliegue** (taxonomías, rasgos, instancias)

La descomposición de objetos expone partes y operaciones siguiendo el mecanismo formal de §7.1. El despliegue expone refinadores mediante las 4 relaciones estructurales. La posición espacial de constituyentes PUEDE tener significado semántico (disposición física, orden lógico).

- Referencia SSOT: `metodologia-opm-es.md` §7.3

### R-4110: Procesos ambientales (patrón de ciclo de vida)

- Enunciado: cuando un proceso opera sobre el sistema pero NO es parte de su función primaria — típicamente procesos de ciclo de vida (diseño, fabricación, mantenimiento, venta, instalación) — el modelador DEBERÍA modelarlo como **proceso ambiental** (contorno discontinuo).
- Referencia SSOT: `metodologia-opm-es.md` §7.3
- Regla de decisión: si el proceso NO entrega valor funcional directo al beneficiario del sistema, es candidato a proceso ambiental.

### R-4111: Alcance interior vs exterior

- Enunciado: un objeto creado dentro de un proceso descompuesto (objeto **interior**) existe solo en el alcance de ese proceso y se elimina si el proceso padre se elimina. Un objeto creado a nivel SD (objeto **exterior**) existe independientemente.

El modelador DEBE decidir el alcance basándose en si la existencia del objeto depende del proceso (interior) o es independiente (exterior). Mover un objeto exterior dentro de un proceso inflado NO lo convierte en interior — el alcance no cambia por posición visual.

- Referencia SSOT: `metodologia-opm-es.md` §7.3
- Aplicación en código: al crear objeto, declarar alcance.

### R-4112: Distribución de enlaces — tabla operativa

- Enunciado: resumen operativo (fuente canónica: `opm-visual-es.md` §11):

| Tipo de enlace | Contorno exterior | Migración por defecto |
|---|---|---|
| Agente | PERMITIDO (distribuye a todos) | — |
| Instrumento | PERMITIDO (distribuye a todos) | — |
| Efecto | PERMITIDO (distribuye a todos) | — |
| Consumo | PROHIBIDO | Migra al primer subproceso; reasignar |
| Resultado | PROHIBIDO | Migra al último subproceso; reasignar |
| Evento sistémico | PROHIBIDO | — |

Los eventos ambientales SÍ pueden cruzar el límite.

- Referencia SSOT: `metodologia-opm-es.md` §7.4
- Ver detalle: `31-distribucion-enlaces-descomposicion.md`.

### R-4113: Procedimiento de migración de enlaces

- Enunciado:
  1. Al dibujar el primer subproceso `P1`, la herramienta DEBE adjuntar provisionalmente a `P1` los enlaces de consumo y entrada con estado especificado
  2. Al último subproceso, adjuntar los de resultado y salida con estado especificado (V-103)
  3. Al agregar subprocesos subsiguientes, el modelador DEBE reasignar cada enlace transformador al subproceso específico
  4. Los habilitadores DEBEN distribuirse a los subprocesos concretos; si aplican a todos, pueden permanecer al nivel del contorno
  5. Ante conflicto, prevalece `opm-visual-es` §11–§12
- Referencia SSOT: `metodologia-opm-es.md` §7.4
- Aplicación en código: wizard de migración post-descomposición.

### R-4114: Invocación implícita

- Enunciado: invocación implícita por disposición vertical:

| Tipo | Semántica |
|---|---|
| Proceso → primer(os) subproceso(s) | Control transferido al subproceso superior al entrar al contexto |
| Subproceso → siguiente(s) | La terminación del origen inicia el siguiente |
| Último subproceso → proceso contenedor | Control retorna al padre tras terminación del último |

Subprocesos a misma altura inician en paralelo; el último en terminar inicia al siguiente.

- Referencia SSOT: `metodologia-opm-es.md` §7.4

### R-4115: Antipatrón — evento a subproceso no-primero

- Enunciado: el modelador NO DEBERÍA conectar un enlace de evento a un subproceso que NO sea el primero dentro de una descomposición, excepto si ha verificado que todos los subprocesos anteriores pueden omitirse sin dejar precondiciones insatisfechas.
- Referencia SSOT: `metodologia-opm-es.md` §7.4
- Aplicación en código: validador warning ALTA.

### R-4116: Escisión de enlace con estado especificado

- Enunciado: cuando `*P* cambia **A** de \`s1\` a \`s2\`` se descompone en P1 y P2:
  - `*P1* cambia **A** de \`s1\`.` (TS4 — escisión de entrada)
  - `*P2* cambia **A** a \`s2\`.` (TS5 — escisión de salida)

Los enlaces escindidos con modificador de control NO están permitidos.

- Referencia SSOT: `metodologia-opm-es.md` §7.4
- Aplicación en código: al descomponer, aplicar escisión automáticamente.

### R-4117: Expresión y supresión de estados

- Enunciado:
  - Los estados DEBERÍAN **suprimirse** en el SD cuando no están conectados a ningún proceso
  - Los estados DEBERÍAN **expresarse** en SD1 donde se conectan a subprocesos
- Referencia SSOT: `metodologia-opm-es.md` §7.5

### R-4118: Estado indeterminado durante proceso activo

- Enunciado: mientras un proceso que afecta está activo, el afectado está "en transición" entre estado de entrada y salida. Su estado es **indeterminado** y NO disponible para uso por otros procesos. Si el proceso se detiene prematuramente, el afectado permanece en estado indeterminado a menos que un manejador de excepciones lo resuelva.
- Referencia SSOT: `metodologia-opm-es.md` §7.5

### R-4119: Verificación de SD1

- Enunciado:

| Verificación | Condición | Severidad |
|---|---|---|
| Subprocesos transforman | Cada subproceso ≥ 1 transformado | CRÍTICA |
| Refinamiento correcto | Síncrono → descomposición; asíncrono → despliegue | ALTA |
| Enlaces distribuidos | Consumo/resultado NO en contorno exterior | CRÍTICA |
| Sin evento a no-primero | Enlaces de evento solo al primer subproceso (o justificación) | ALTA |
| Enlaces escindidos resueltos | Ningún efecto subespecificado en descomposición múltiple | ALTA |
| Estados expresados | Estados relevantes visibles y conectados | ALTA |
| Sin redundancia | Sin duplicación innecesaria de hechos del SD | MEDIA |

- Referencia SSOT: `metodologia-opm-es.md` §7.6
- Aplicación en código: checklist ejecutable tras crear SD1.

### R-4120: Sin hardcodeo de layout

- Enunciado: fixes de layout/visual siempre deben ser **algorítmicos** (en `src/render/layout/`, renderer), nunca coords hardcodeadas por caso en fixtures.
- Referencia SSOT: no es parte del SSOT; es feedback del proyecto (`feedback_no_hardcodeo_layout.md`)
- Aplicación en código: fixtures no contienen `x, y` fijos por decisión visual.

## Checklist

- [ ] SD1 se crea como descendiente de SD (contorno grueso en padre e hijo)
- [ ] Mínimo 2 subprocesos/refinadores
- [ ] Subprocesos en orden vertical (arriba→abajo)
- [ ] Paralelos a misma altura
- [ ] Cada subproceso con ≥ 1 transformado
- [ ] Decisión síncrono (descomposición) vs asíncrono (despliegue) clara
- [ ] Agregación vs generalización elegida según regla de decisión
- [ ] Elementos externos traídos al OPD hijo
- [ ] Objetos interiores/exteriores declarados explícitamente
- [ ] Procesos de ciclo de vida como ambientales
- [ ] Migración de enlaces con reasignación manual por el modelador
- [ ] Escisión TS4/TS5 aplicada
- [ ] Eventos solo al primer subproceso (o justificados)
- [ ] Eventos sistémicos no cruzan límite
- [ ] Estados suprimidos/expresados según uso
- [ ] Verificación SD1 pasa
- [ ] Sin coords hardcodeadas en fixtures

## Antipatrones

- SD1 con un solo subproceso
- Subproceso sin transformado
- Evento a subproceso intermedio sin verificación
- Consumo conectado al contorno del refinable
- Usar agregación para tipos/variantes
- Objeto exterior "convertido" en interior por mover dentro del envelope
- Proceso de fabricación como sistémico cuando no entrega valor al beneficiario
- Fixture con coords fijas por caso

## Referencias cruzadas

- Refinamiento general: `30-refinamiento-entre-opds.md`
- Distribución de enlaces: `31-distribucion-enlaces-descomposicion.md`
- Supresión/expresión de estados: `33-supresion-expresion-estados.md`
- Invariantes entre niveles: `35-invariantes-entre-niveles.md`
- Tiempo y paralelismo: `21-tiempo-paralelismo-orden.md`
- Layout: `20-layout-visual-opd.md`
- OPL CX1..CX8: `73-opl-plantillas-contexto-y-multiplicidad.md`
