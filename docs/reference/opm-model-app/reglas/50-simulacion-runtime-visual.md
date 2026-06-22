# 50 — Simulación y runtime visual

**Alcance**: marcas de proceso activo, estado actual runtime, tokens transitorios, estados operacionales del proceso, modos síncrono/asíncrono, identificación de snapshot, headless.
**Capa SSOT propietaria**: `opm-visual-es.md` §17
**Aplicación en la app**: futura capa de simulación, export `snapshot` distinguible de canon estático.

## Reglas

### R-2000: V-53 revisada — Marca de proceso activo reservada

- Enunciado: un proceso en ejecución DEBE exhibir una marca visual **reservada de actividad**, distinta de cualquier otra marca persistente de la gramática, en especial del **contorno grueso de refinamiento**.

La implementación puede materializar la marca por cualquiera de estos tres canales:
  - relleno sólido reservado
  - contorno reforzado en color reservado
  - halo externo reservado

- Referencia SSOT: V-53 revisada
- Aplicación en código: la marca de actividad NO es la elipse rellena estricta de v1; puede variar.

### R-2001: V-132 — Actividad distinguible de refinable

- Enunciado: el canal visual reservado al proceso activo NO puede coincidir exactamente con el canal del refinable definido por V-33 y V-69. Si una implementación usa ambos como contornos reforzados, DEBE diferenciar **color**, **halo** o **distintivo auxiliar**.
- Referencia SSOT: V-132
- Aplicación en código: si "activo" usa contorno reforzado, "refinable" usa stroke-width=3 con color distinto.

### R-2002: V-54 revisada — Estado actual runtime con glifo externo

- Enunciado: el estado actual durante simulación se marca con un **glifo externo reservado** al borde del estado, distinto de:
  - borde grueso de estado inicial
  - doble borde de estado final
  - flecha diagonal de estado por defecto
- Referencia SSOT: V-54 revisada
- Aplicación en código: marca externa al rountangle del estado actual.

### R-2003: V-133 — Pin/gota como glifo recomendado

- Enunciado: el glifo recomendado para estado actual es un **pin o gota externa** anclada al borde del rectángulo redondeado del estado. Cualquier implementación que use un glifo distinto DEBE preservar la misma separación visual respecto de las designaciones persistentes de §2.2, incluida `Current` declarada.
- Referencia SSOT: V-133
- Aplicación en código: marker `MARKER_PIN_CURRENT` aplicado como decoración externa.

### R-2004: V-134 — `Current` declarado vs runtime en serialización

- Enunciado: `Current` como designación persistente (§2.2, V-237) y la marca de estado actual de runtime (V-54) pueden **coincidir visualmente**, pero la serialización del modelo DEBE distinguirlas. Una herramienta que reutilice el mismo glifo para ambos DEBE exponer, en el metadato recuperable del modelo, el **origen de la marca** (declaración persistente vs inducción por runtime).
- Referencia SSOT: V-134
- Aplicación en código: metadato `"origen": "declarado" | "runtime"`.

### R-2005: V-135 — Tokens transitorios de flujo

- Enunciado: un enlace activo puede mostrar un **token transitorio** de flujo durante simulación. Ese token NO forma parte de la gramática estática del OPD y NO debe confundirse con piruletas, handles o puntos de anclaje.
- Referencia SSOT: V-135
- Aplicación en código: tokens en capa separada, removidos al detener simulación.

### R-2006: V-136 — Tokens omitidos en canon-diagrama ordinario

- Enunciado: los tokens transitorios de flujo son marcadores de runtime. NO pertenecen al canon-diagrama salvo que el export se declare explícitamente como **snapshot de simulación**. En un canon-diagrama ordinario DEBEN omitirse.
- Referencia SSOT: V-136
- Aplicación en código: export por defecto filtra tokens runtime; export de snapshot los preserva con declaración.

### R-2007: V-137 — Otros estados operacionales del proceso

- Enunciado: la implementación PUEDE distinguir, además del estado activo, otros estados operacionales del proceso durante simulación (suspendido esperando input, completado recientemente). Si lo hace, DEBE usar marcas reservadas **distintas** de las de activo y estado actual.
- Referencia SSOT: V-137
- Aplicación en código: canales visuales adicionales declarados en ADR.

### R-2008: V-138 — Suspendido distinguible de inactivo

- Enunciado: un proceso suspendido esperando input externo NO puede ser visualmente indistinguible de un proceso inactivo si el artefacto se presenta como snapshot de simulación. DEBE exhibir una marca propia o un distintivo de modo equivalente.
- Referencia SSOT: V-138
- Aplicación en código: marca de "esperando input" reservada.

### R-2009: V-55 — Tiempo fluye arriba→abajo en simulación

- Enunciado: el tiempo fluye de arriba hacia abajo dentro de la descomposición de un proceso. Esta regla rige tanto en edición como en simulación.
- Referencia SSOT: V-55
- Aplicación en código: motor de simulación respeta orden vertical.

### R-2010: V-139 — Síncrono: máx 1 activo por hilo

- Enunciado: en modo **síncrono**, la simulación puede exhibir como máximo **una marca de proceso activo por hilo de ejecución visible** — entendido como la secuencia de subprocesos consecutivos invocados implícitamente por posición vertical dentro de un mismo padre descompuesto (§11.2, V-59).

En modo **asíncrono** pueden coexistir múltiples procesos activos si la estructura del OPD los habilita por paralelismo.

- Referencia SSOT: V-139
- Aplicación en código: el motor declara el modo activo y aplica la restricción.

### R-2011: V-140 — Modo headless no altera gramática

- Enunciado: el modo headless o equivalente pertenece al ecosistema de simulación, no a la gramática visible del OPD. La ausencia de animación o de marcas runtime en ese modo NO altera la semántica estática del diagrama.
- Referencia SSOT: V-140
- Aplicación en código: simulación sin render visual es opción válida.

### R-2012: V-141 — Snapshot declarado explícitamente

- Enunciado: todo export que pretenda representar un estado de simulación DEBE declararlo explícitamente como **snapshot de runtime**. Si NO existe esa declaración, el artefacto se interpreta como canon-diagrama estático.
- Referencia SSOT: V-141
- Aplicación en código: exporter agrega metadato `"tipo": "snapshot_runtime"` cuando aplica.

### R-2013: V-238 — Distinción declarado vs runtime

- Enunciado: `Current` declarado como designación persistente es distinta del estado actual runtime. La marca visual PUEDE coincidir, pero la serialización DEBE distinguirlas.
- Referencia SSOT: V-238
- Aplicación en código: campos separados `declarado: boolean` y `runtimeActual: boolean`.

### R-2014: Objeto consumido desaparece al inicio

- Enunciado: el objeto consumido desaparece al **inicio** del proceso, no al final (V-49).
- Referencia SSOT: V-49
- Aplicación en código: el motor remueve el token del origen al inicio del subproceso.

### R-2015: Afectado en transición

- Enunciado: mientras un proceso afecta un objeto, el objeto está "en transición" entre estado de entrada y salida. Su estado es **indeterminado** y NO disponible para uso por otros procesos.
- Referencia SSOT: `metodologia-opm-es.md` §7.5
- Aplicación en código: motor expone `estado: "indeterminado"` durante el proceso.

### R-2016: Habilitador ausente detiene proceso

- Enunciado: si un habilitador deja de existir durante la ejecución, el proceso se detiene y el estado del afectado queda indeterminado (V-10).
- Referencia SSOT: V-10
- Aplicación en código: motor pausa/aborta si habilitador desaparece.

### R-2017: Tokens computacionales vs conceptuales

- Enunciado: durante simulación, los tokens pueden ser:
  - **conceptuales**: evidencian disponibilidad, consumo, creación o cambio de estado
  - **computacionales**: transportan valores numéricos u otros tipos
- Referencia SSOT: `metodologia-opm-es.md` §14.3
- Aplicación en código: distinguir visualmente (ej. color o texto adicional).

### R-2018: Distinción simulación conceptual vs ejecución computacional

- Enunciado:
  - **Simulación conceptual**: animación visual del flujo de tokens para validar orden, precondiciones y cobertura del comportamiento
  - **Ejecución computacional**: corrida efectiva de fórmulas, atributos computacionales y actualización de valores
- Referencia SSOT: `metodologia-opm-es.md` §14.3
- Aplicación en código: dos modos distinguibles en el motor.

### R-2019: Velocidad de animación ajustable

- Enunciado: la velocidad de animación DEBERÍA ajustarse para hacer visibles procesos rápidos o bucles.
- Referencia SSOT: `metodologia-opm-es.md` §14.3
- Aplicación en código: control de velocidad en UI.

### R-2020: Propiedades de duración guían runtime

- Enunciado: las propiedades de duración (mínima, esperada, máxima, distribución) se usan durante simulación. Cada instancia del proceso muestrea su duración independientemente si hay distribución declarada.
- Referencia SSOT: `metodologia-opm-es.md` §12.3
- Ver detalle: `51-duracion-proceso.md`.

### R-2021: Ejecución compuesta con handoff explícito

- Enunciado: cuando la ejecución cruza a un sub-modelo, el cruce DEBE tratarse como transición explícita, NO continuación implícita.
- Referencia SSOT: `metodologia-opm-es.md` §14.1
- Ver: `42-sub-modelos-inter-modelo.md`.

### R-2022: Probabilidades por defecto

- Enunciado: cuando un proceso produce un objeto con `n` estados y NO se especifica qué estado asignar (sin enlace de resultado con estado especificado), cada estado tiene probabilidad `1/n` por defecto. Para forzar determinismo, el modelador DEBE conectar el enlace a un estado específico. Para probabilidades distintas, DEBE usar un abanico XOR con anotaciones `Pr=p`.
- Referencia SSOT: `metodologia-opm-es.md` §10.10
- Aplicación en código: motor aplica distribución uniforme por defecto.

### R-2023: Diagrama de vida útil

- Enunciado: un **diagrama de vida útil** muestra, para cualquier instante:
  - qué objetos existen
  - en qué estado está cada uno
  - qué procesos están activos

Es útil para seguir transiciones a lo largo de la vida del sistema.

- Referencia SSOT: `opm-iso-19450-es.md` §Diagrama de vida útil
- Aplicación en código: vista temporal opcional del modelo.

## Checklist

- [ ] Proceso activo usa canal visual reservado, no confundible con refinable
- [ ] Estado actual runtime marcado con glifo externo (pin/gota)
- [ ] `Current` declarado vs runtime distinguidos en serialización
- [ ] Tokens transitorios solo en snapshot declarado, no canon estático
- [ ] Estados operacionales adicionales (suspendido, completado) con marcas propias
- [ ] Suspendido distinguible de inactivo en snapshot
- [ ] Modo síncrono: máx 1 activo por hilo
- [ ] Modo asíncrono: múltiples activos admitidos
- [ ] Modo headless no altera gramática estática
- [ ] Snapshot de runtime declarado explícitamente en export
- [ ] Consumo desaparece al inicio del proceso
- [ ] Afectado en transición = estado indeterminado
- [ ] Habilitador ausente detiene proceso
- [ ] Distinción tokens conceptuales vs computacionales
- [ ] Handoff cross-model explícito

## Antipatrones

- Usar elipse rellena estricta como única marca de activo (V-53 v1 legacy)
- Contorno grueso compartido entre activo y refinable sin distintivo adicional
- Tokens runtime en canon-diagrama ordinario
- Estado "suspendido" indistinguible de "inactivo" en snapshot
- Export de snapshot sin declarar tipo
- Continuación implícita de ejecución cross-model

## Referencias cruzadas

- Estados y designaciones: `11-estados-designaciones.md`
- Proceso y refinable: `10-primitivas-cosas.md`
- Duración y excepciones: `51-duracion-proceso.md`
- Sub-modelos: `42-sub-modelos-inter-modelo.md`
- Exportación y canon: `01-canon-exportacion.md`, `63-exportacion-canonica.md`
- Metodología simulación: `87-metodologia-simulacion-ejecucion.md`
