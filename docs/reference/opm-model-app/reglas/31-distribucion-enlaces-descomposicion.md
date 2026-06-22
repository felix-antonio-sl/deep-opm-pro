# 31 — Distribución y escisión de enlaces en descomposición

**Alcance**: reglas de distribución de enlaces del contorno del proceso descompuesto a subprocesos, restricciones de frontera, escisión de enlaces de efecto entrada-salida, cambio de rol entre niveles.
**Capa SSOT propietaria**: `opm-visual-es.md` §11, §12
**Aplicación en la app**: `src/render/jointjs/pass-enlaces.ts`, lógica de migración de enlaces en edición.

## Reglas

### R-1200: V-36 — Distribución de enlaces en contorno exterior

- Enunciado: los enlaces conectados al contorno exterior de un proceso descompuesto se **distribuyen** a todos los subprocesos. Los enlaces de agente e instrumento conectados al proceso padre aplican a todos los subprocesos.
- Referencia SSOT: V-36, `opm-iso-19450-es.md` §14.2.2.4
- Aplicación en código: al entrar a SDn+1, `pass-enlaces.ts` aplica la distribución.

### R-1201: Tabla de distribución por tipo

- Enunciado: los enlaces procedimentales del padre se distribuyen según su tipo:

| Tipo | Destino de distribución | Justificación |
|---|---|---|
| Consumo (+ enlace de entrada) | **Primer** subproceso (Y mínima) | El consumo ocurre al inicio |
| Resultado (+ enlace de salida) | **Último** subproceso (Y máxima) | La producción ocurre al final |
| Agente, Instrumento | **Todos** los subprocesos | Habilitador distribuido |
| Efecto (básico, sin estado especificado) | **Todos** los subprocesos | Afecta a todos |
| Efecto entrada-salida | **Enlace escindido** (ver R-1208) | Resolución de subespecificación |
| Estructural | **No se distribuye**, permanece en contenedor | Invariante temporal |

- Referencia SSOT: V-103, V-104, V-105
- Aplicación en código: aplicar la tabla al hacer in-zooming.

### R-1202: V-103 — Distribución posicional de transformadores

- Enunciado: los enlaces de consumo e input se distribuyen al primer subproceso en orden de posición vertical (Y mínimo). Los de resultado y output, al último subproceso (Y máximo).
- Referencia SSOT: V-103
- Aplicación en código: ordenar subprocesos por Y ascendente; asignar consumos a subprocesos[0], resultados a subprocesos[n-1].

### R-1203: V-104 — Distribución a todos

- Enunciado: los enlaces de efecto **básico** (sin estado especificado) se distribuyen a todos los subprocesos, al igual que los de agente e instrumento. Cuando el efecto tiene estado especificado (entrada-salida), la distribución se realiza mediante **enlace escindido** (ver R-1208).
- Referencia SSOT: V-104
- Aplicación en código: efecto básico → N copias en subprocesos; efecto con estado → escisión TS4/TS5.

### R-1204: V-105 — Estructurales no se distribuyen

- Enunciado: los enlaces estructurales NO se distribuyen — permanecen asociados al contenedor.
- Referencia SSOT: V-105
- Aplicación en código: `pass-enlaces.ts` distingue estructurales y los deja en el envelope.

### R-1205: V-106 — Respaldo temporal al contenedor

- Enunciado: si NO hay subprocesos aún dentro de la descomposición, el enlace se muestra conectado al contenedor directamente como respaldo temporal.
- Referencia SSOT: V-106
- Aplicación en código: al crear SDn+1 vacío, los enlaces permanecen en el envelope hasta que se agreguen subprocesos.

### R-1206: V-107 — Distribución solo en descomposición

- Enunciado: la distribución de enlaces solo aplica a **descomposición**. El despliegue NO tiene distribución de enlaces.
- Referencia SSOT: V-107
- Aplicación en código: saltar la distribución cuando el mecanismo es unfolding.

### R-1207: V-37 — Consumo/resultado NO en contorno exterior

- Enunciado: los enlaces de consumo y resultado NO DEBEN conectarse al contorno exterior de un proceso descompuesto. DEBEN conectarse directamente al subproceso específico que consume o produce.
- Referencia SSOT: V-37
- Aplicación en código: validador rechaza esta configuración post-descomposición; provee warning durante migración.

### R-1208: V-40 — Escisión de enlace de efecto

- Enunciado: el enlace de efecto entrada-salida se **escinde** en dos enlaces:
  - el subproceso **temprano** recibe la flecha de entrada (saca al objeto de `s1`)
  - el subproceso **tardío** recibe la flecha de salida (coloca al objeto en `s2`)
- Referencia SSOT: V-40
- Aplicación en código: en descomposición con múltiples subprocesos, reemplazar TS3 (efecto entrada-salida) por par TS4 (solo entrada) + TS5 (solo salida).

### R-1209: V-41 — Escisión sin modificadores de control

- Enunciado: NO existen versiones con modificador de control de los enlaces escindidos.
- Referencia SSOT: V-41
- Aplicación en código: validador rechaza TS4/TS5 con `e` o `c`.

### R-1210: V-110 — Escisión única vía de resolución

- Enunciado: la escisión es el **único** mecanismo para resolver la subespecificación de enlaces de efecto entrada-salida en descomposición. NO hay alternativa.
- Referencia SSOT: V-110

### R-1211: V-42 — Cambio de rol entre niveles

- Enunciado: un objeto puede ser **instrumento en un nivel abstracto** y **afectado en un nivel detallado**. Esto es válido si a nivel abstracto los estados inicial y final del objeto coinciden (cambio neto = cero).
- Referencia SSOT: V-42
- Ejemplo canónico: `Dishwasher` es instrumento en SD (sin cambio aparente) y afectado en SD1 (`empty → loaded → empty`). Es válido porque `empty = empty` entre niveles.
- Aplicación en código: admitir esta reasignación al bajar de abstracción.

### R-1212: V-111 — Estados intermedios en OPD hijo

- Enunciado: en el OPD hijo (nivel detallado), el objeto con cambio de rol muestra estados intermedios que NO son visibles en el OPD padre.
- Referencia SSOT: V-111
- Aplicación en código: la vista de SD1 muestra estados nuevos (ej. `loaded`) que SD oculta.

### R-1213: V-112 — Cambio de rol solo en descomposición

- Enunciado: el cambio de rol solo aplica a **descomposición**, no a despliegue.
- Referencia SSOT: V-112
- Aplicación en código: validador restringe la operación.

### R-1214: V-38 — Eventos sistémicos no cruzan límite

- Enunciado: los enlaces de evento desde objetos sistémicos NO DEBEN cruzar el límite de la descomposición para iniciar subprocesos.
- Referencia SSOT: V-38
- Aplicación en código: validador rechaza evento sistémico-externo → subproceso interno.

### R-1215: V-108 — Eventos ambientales PUEDEN cruzar

- Enunciado: los enlaces de evento desde objetos **ambientales** pueden cruzar el límite de la descomposición si se modela contingencia explícita. Esta es una excepción a V-38.
- Referencia SSOT: V-108
- Aplicación en código: la herramienta guía al modelador a declarar contingencia.

### R-1216: V-39 — Condición que omite pasa al siguiente

- Enunciado: si un enlace de condición causa que un subproceso se omita, el control pasa al siguiente subproceso en la secuencia.
- Referencia SSOT: V-39
- Aplicación en código: motor de simulación aplica skip + avance.

### R-1217: V-109 — Restricciones de frontera solo en descomposición

- Enunciado: las restricciones de frontera (V-37, V-38, V-39) aplican solo a **descomposición**, no a despliegue.
- Referencia SSOT: V-109

### R-1218: Procedimiento de migración de enlaces

- Enunciado: al hacer descomposición:
  1. Al dibujar el primer subproceso `P1` dentro de `P`, la herramienta DEBE adjuntar provisionalmente a `P1` los enlaces de consumo y entrada con estado especificado, y al último subproceso los enlaces de resultado y salida con estado especificado (V-103)
  2. Al agregar subprocesos subsiguientes, el modelador DEBE reasignar cada enlace transformador al subproceso específico
  3. Los enlaces habilitadores DEBEN distribuirse a los subprocesos concretos donde el habilitador es necesario; si aplican a todos, pueden permanecer al nivel del contorno
  4. Ningún resumen operativo sustituye la regla canónica: ante conflicto, prevalece `opm-visual-es` §11–§12
- Referencia SSOT: `metodologia-opm-es.md` §7.4
- Aplicación en código: wizard de migración tras descomposición.

### R-1219: Enlaces habilitadores distribuidos individualmente

- Enunciado: los enlaces habilitadores DEBEN distribuirse a los subprocesos concretos donde el habilitador es necesario. Si aplican a **todos** los subprocesos, pueden permanecer al nivel del contorno del refinable.
- Referencia SSOT: V-104, `metodologia-opm-es.md` §7.4
- Aplicación en código: distinguir entre habilitador "a todos" vs "específico de subproceso".

### R-1220: Antipatrón — evento a subproceso no-primero

- Enunciado: el modelador NO DEBERÍA conectar un enlace de evento a un subproceso que NO sea el primero dentro de una descomposición, excepto si ha verificado que todos los subprocesos anteriores pueden omitirse sin dejar precondiciones insatisfechas.
- Referencia SSOT: `metodologia-opm-es.md` §7.4
- Aplicación en código: warning `ALTA` en esta configuración.

### R-1221: Instancias operacionales — restricciones

- Enunciado: como consecuencia de la distribución de enlaces:
  1. Cada instancia operacional de un **consumido** en el conjunto previo al proceso DEBE dejar de existir al inicio del subproceso más detallado que lo consume
  2. Cada instancia operacional de un **afectado** que cambia de estado DEBE salir de su estado de entrada al inicio del subproceso más detallado que cambia al afectado
  3. Cada instancia operacional de un **afectado** DEBE entrar en su estado de salida al completarse el subproceso más detallado que lo cambia
  4. Cada instancia operacional de un **resultante** DEBE comenzar a existir al completarse el subproceso más detallado que lo genera
- Referencia SSOT: `opm-iso-19450-es.md` §Instancias operacionales
- Aplicación en código: motor de simulación implementa estas restricciones temporales.

### R-1222: Invocación implícita en distribución

- Enunciado: la distribución también define enlaces de invocación implícita entre el proceso padre y los subprocesos:
  - Proceso padre → primer subproceso al entrar al contexto descompuesto
  - Subproceso → siguiente subproceso: la terminación del origen inicia el siguiente
  - Último subproceso → proceso padre: control retorna tras la terminación del último
- Referencia SSOT: `metodologia-opm-es.md` §7.4 (tabla de invocación implícita)
- Aplicación en código: motor de simulación infiere estos flujos.

### R-1223: Efecto básico vs efecto con estado — distribución distinta

- Enunciado: la distribución de un efecto varía:
  - efecto **básico** (sin estado): se distribuye a **todos** los subprocesos
  - efecto **con estado especificado** (entrada-salida): se escinde en TS4 temprano + TS5 tardío
- Referencia SSOT: V-104
- Aplicación en código: `pass-enlaces.ts` discrimina al distribuir.

## Checklist

- [ ] Consumo / input → primer subproceso (Y mínima)
- [ ] Resultado / output → último subproceso (Y máxima)
- [ ] Agente e instrumento → todos (o subprocesos específicos si aplica)
- [ ] Efecto básico → todos; efecto con estado → escisión
- [ ] Estructurales NO se distribuyen
- [ ] Respaldo temporal al contenedor si no hay subprocesos
- [ ] Distribución solo en descomposición (no en unfolding)
- [ ] Consumo/resultado no permanecen en contorno exterior post-migración
- [ ] Escisión TS4/TS5 sin modificadores de control
- [ ] Cambio de rol admitido si estado neto = 0 en abstracto
- [ ] Estados intermedios visibles en OPD hijo
- [ ] Eventos sistémicos no cruzan límite
- [ ] Eventos ambientales pueden cruzar con contingencia
- [ ] Habilitadores "a todos" pueden permanecer en contorno
- [ ] Invocación implícita padre ↔ primer/último subproceso

## Antipatrones

- Consumo conectado al contorno del proceso descompuesto
- Efecto entrada-salida sin escindir en descomposición
- Escisión con `c` (bypass) aplicado a TS4 o TS5
- Evento a subproceso intermedio sin verificación
- Cambio de rol instrumento→afectado cuando el estado neto ≠ 0 en abstracto
- No migrar enlaces al agregar subprocesos subsiguientes

## Referencias cruzadas

- Refinamiento general: `30-refinamiento-entre-opds.md`
- Estado especificado: `15-enlaces-estado-especificado.md`
- Precedencia en recomposición: `32-precedencia-recomposicion.md`
- Modificadores de control: `16-modificadores-operadores.md`
- Supresión de estados: `33-supresion-expresion-estados.md`
- Metodología SD1: `81-metodologia-sd1-descomposicion.md`
- Control de flujo: `84-metodologia-control-flujo.md`
