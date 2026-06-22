# 87 — Metodología: simulación y ejecución del modelo

**Alcance**: recorrido en profundidad, transición conceptual→computacional, simulación conceptual vs ejecución computacional, tokens visuales, ejecución compuesta cross-model.
**Capa SSOT propietaria**: `metodologia-opm-es.md` §14
**Aplicación en la app**: motor de simulación, control de velocidad, ejecución cross-model.

## Reglas

### R-4700: Recorrido en profundidad para ejecución

- Enunciado: la ejecución animada de un modelo OPM individual sigue un **recorrido en profundidad** de su árbol OPD local. Los tokens fluyen a lo largo de los enlaces: al llegar a un proceso descompuesto, el control se transfiere recursivamente al subproceso más profundo. El control retorna al nivel padre tras completar el último subproceso aplicable.
- Referencia SSOT: `metodologia-opm-es.md` §14.1

### R-4701: Representación visual de tokens

- Enunciado: los tokens se visualizan como valores que se pasan entre objetos y procesos:
  - **consumido**: eliminado del origen
  - **instrumento**: solo lectura, permanece
  - **resultante**: creado en destino

Los tokens computacionales llevan valores numéricos.

- Referencia SSOT: `metodologia-opm-es.md` §14.1

### R-4702: Ejecución cross-model — handoff explícito

- Enunciado: cuando el comportamiento cruza a un sub-modelo, el cruce NO DEBE interpretarse como mera continuación implícita de un árbol global único. DEBE tratarse como **transición explícita** entre fronteras de modelo, gobernada por la composición inter-modelo y por la referencia persistente al sub-modelo correspondiente.
- Referencia SSOT: `metodologia-opm-es.md` §14.1

### R-4703: Consecuencias metodológicas del cross-model

- Enunciado:
  - El orden visible de `SDx.y` ayuda a navegar, pero NO gobierna por sí solo la ejecución compuesta
  - Si la herramienta soporta ejecución compuesta, el modelador DEBE explicitar el punto de handoff entre consumidor y propietario
  - Si la herramienta NO soporta ejecución compuesta, el modelador DEBERÍA ejecutar cada modelo individual por separado y tratar la frontera como punto explícito de coordinación
- Referencia SSOT: `metodologia-opm-es.md` §14.1

### R-4704: Transición conceptual → computacional

- Enunciado: el modelador DEBE reconocer el punto en el árbol OPD donde la transición de modelado conceptual puro a modelado computacional es necesaria. Indicadores:
  - los valores numéricos específicos se vuelven necesarios para decisión de diseño
  - los estudios de compromiso requieren parámetros cuantitativos
  - el proceso físico tiene una fórmula matemática subyacente (ej. `V = V0 - (F/m)*t`)

En este punto, convertir procesos conceptuales a procesos computacionales y usar la realización soportada por la herramienta. La señal visual recuperable de proceso computacional es el uso de `{}` en el OPD.

- Referencia SSOT: `metodologia-opm-es.md` §14.2

### R-4705: Simulación conceptual vs ejecución computacional

- Enunciado:
  - **Simulación conceptual**: animación visual del flujo de tokens para validar orden, precondiciones y cobertura del comportamiento
  - **Ejecución computacional**: corrida efectiva de fórmulas, atributos computacionales y actualización de valores

Reglas operativas:
  - La velocidad de animación DEBERÍA ajustarse para hacer visibles procesos rápidos o bucles
  - Si el orden observado NO coincide con el esperado, el modelador DEBE revisar altura relativa de subprocesos, enlaces de control y condiciones
  - Los tokens computacionales transportan valores; los conceptuales solo evidencian disponibilidad, consumo, creación o cambio de estado

- Referencia SSOT: `metodologia-opm-es.md` §14.3

### R-4706: Ejecutabilidad del modelo

- Enunciado: un modelo OPM puede ser ejecutable. La simulación anima el sistema ejecutando el modelo en un entorno de software. Un modelo con nivel consistente de detalle es implementable como simulación capaz de realizar recursos, usar procesos para transformar objetos y producir valor funcional.
- Referencia SSOT: `opm-iso-19450-es.md` §Dinámica y simulación

### R-4707: Modos de transformación

- Enunciado:

| Modo | Significado |
|---|---|
| Construcción | El objeto es creado o generado |
| Efecto | El objeto cambia de estado y mantiene identidad |
| Consumo | El objeto es eliminado y deja de existir |

**Construcción y consumo son transformaciones más profundas que efecto** porque cambian existencia, no solo estado.

- Referencia SSOT: `opm-iso-19450-es.md` §Modos de transformación

### R-4708: Principio de línea de tiempo

- Enunciado: la línea temporal por defecto en una descomposición fluye de arriba hacia abajo. Subprocesos a la misma altura se ejecutan en paralelo. Un proceso de salida por excepción puede provocar **salida inmediata** sin importar su posición gráfica.
- Referencia SSOT: `opm-iso-19450-es.md` §Principio de línea de tiempo

### R-4709: Eventos temporizados

- Enunciado: los eventos de estado pueden representar eventos temporales. Objetos tipo reloj o temporizador del sistema con valores concretos pueden iniciar procesos en instantes definidos.
- Referencia SSOT: `opm-iso-19450-es.md` §Eventos temporizados

### R-4710: Diagrama de vida útil

- Enunciado: un **diagrama de vida útil** muestra, para cualquier instante:
  - qué objetos existen
  - en qué estado está cada uno
  - qué procesos están activos

Es útil para seguir transiciones a lo largo de la vida del sistema.

- Referencia SSOT: `opm-iso-19450-es.md` §Diagrama de vida útil

### R-4711: Control animado de simulación

- Enunciado: la UI de simulación DEBERÍA ofrecer:
  - play / pause / step
  - control de velocidad
  - breakpoints por proceso o transición de estado
  - inspección de estado de cosas
- Referencia SSOT: `metodologia-opm-es.md` §14.3
- Aplicación en código: controles estándar de debug.

### R-4712: Escenarios como rutas materializadas

- Enunciado: una ejecución concreta materializa un **escenario** del repertorio de comportamiento. El modelador PUEDE definir escenarios de prueba (conjuntos de etiquetas de ruta) y ejecutar cada uno.
- Referencia SSOT: `opm-iso-19450-es.md` §Escenarios
- Aplicación en código: selección de escenario en la UI de simulación.

### R-4713: Modelos conceptuales vs modelos de ejecución

- Enunciado: el modelo conceptual describe patrones de estructura y comportamiento. El modelo de ejecución representa instancias operacionales durante una simulación. Un modelo con nivel consistente de detalle es **implementable como simulación**; ese es el criterio formal de completitud.
- Referencia SSOT: `opm-iso-19450-es.md` §Modelos conceptuales vs modelos de ejecución

### R-4714: Instancias operacionales como ocurrencia concreta

- Enunciado: la presencia de ocurrencias de cosas traduce el modelo conceptual abstracto en forma concreta de ejecución. El comportamiento del sistema modelado solo ocurre cuando existen **instancias operacionales**. Un enlace entre dos cosas NO implica comportamiento hasta que existan instancias operacionales.
- Referencia SSOT: `opm-iso-19450-es.md` §Modelos conceptuales vs modelos de ejecución

### R-4715: Realización del modelo

- Enunciado: un modelo que expresa detalle consistente es implementable como simulación capaz de:
  - realizar recursos
  - usar procesos para transformar objetos
  - producir valor funcional para un beneficiario

Esta es la **capacidad de realización** del modelo.

- Referencia SSOT: `opm-iso-19450-es.md` §Realización del modelo

### R-4716: Distribución de duración por instancia

- Enunciado: en ejecución, cada instancia del proceso muestrea su duración **independientemente** si hay distribución declarada. Sin distribución, todas ejecutan en exactamente la duración esperada.
- Referencia SSOT: `metodologia-opm-es.md` §12.3

### R-4717: Revisión de orden si observado ≠ esperado

- Enunciado: si el orden observado durante simulación NO coincide con el esperado, el modelador DEBE revisar:
  - altura relativa de subprocesos (V-31, V-32)
  - enlaces de control (`e`, `c`)
  - condiciones
- Referencia SSOT: `metodologia-opm-es.md` §14.3
- Aplicación en código: panel de diagnóstico de ejecución.

### R-4718: Ejecución headless

- Enunciado: el modo headless o equivalente pertenece al ecosistema de simulación, no a la gramática visible del OPD. La ausencia de animación o de marcas runtime en ese modo NO altera la semántica estática del diagrama.
- Referencia SSOT: V-140

### R-4719: Simulación por modelo individual cuando no hay compuesta

- Enunciado: si la herramienta NO soporta ejecución compuesta, el modelador DEBERÍA:
  - ejecutar cada modelo individual por separado
  - tratar la frontera como punto explícito de coordinación
  - registrar el handoff en un ADR o log
- Referencia SSOT: `metodologia-opm-es.md` §14.1

### R-4720: Animación como validación

- Enunciado: la simulación conceptual sirve para validar:
  - orden temporal
  - precondiciones
  - cobertura del comportamiento

No reemplaza tests de modelo, pero sí los complementa.

- Referencia SSOT: `metodologia-opm-es.md` §14.3

## Checklist

- [ ] Ejecución recorre en profundidad el árbol local
- [ ] Tokens diferenciados (consumido/instrumento/resultante)
- [ ] Handoff cross-model explícito
- [ ] `SDx.y` no gobierna ejecución compuesta por sí solo
- [ ] Transición conceptual→computacional explícita cuando aplica
- [ ] `{}` marca proceso computacional
- [ ] Simulación conceptual vs ejecución computacional distinguidas
- [ ] Velocidad de animación ajustable
- [ ] Excepciones producen salida inmediata
- [ ] Eventos temporizados admitidos
- [ ] Diagrama de vida útil disponible
- [ ] Controles play/pause/step con breakpoints
- [ ] Escenarios seleccionables
- [ ] Muestreo independiente por instancia con distribución
- [ ] Revisión de Y/eventos/condiciones ante orden inesperado
- [ ] Modo headless sin afectar gramática estática

## Antipatrones

- Ejecución compuesta tratada como continuación implícita
- Simulación determinista sin distribución para procesos reales
- Token de consumido permaneciendo en origen tras inicio del proceso
- Orden de ejecución distinto del orden vertical declarado
- Simulación sin capacidad de inspeccionar estado
- Excepción que espera orden vertical (debe ser inmediata)

## Referencias cruzadas

- Simulación runtime visual: `50-simulacion-runtime-visual.md`
- Duración: `51-duracion-proceso.md`
- Control de flujo: `84-metodologia-control-flujo.md`
- Errores temporales y cuantitativo: `85-metodologia-errores-simulacion.md`
- Sub-modelos y handoff: `42-sub-modelos-inter-modelo.md`
- Capa computacional: `53-capa-computacional.md`
- Tiempo y paralelismo: `21-tiempo-paralelismo-orden.md`
