# 15 — Enlaces con estado especificado

**Alcance**: enlaces procedimentales (transformadores y habilitadores) con estado especificado en origen, destino o ambos; enlaces estructurales con estado especificado; anclaje al rountangle del estado.
**Capa SSOT propietaria**: `opm-visual-es.md` §3.2, §3.4, §8.5
**Aplicación en la app**: `src/render/jointjs/pass-enlaces.ts`, `src/nucleo/` (modelo de enlace con estado).

## Reglas

### R-700: Anclaje al rountangle del estado

- Enunciado: cuando un enlace declara estado de origen o destino específico, DEBE anclarse al **rountangle del estado**, NO al bounding box del objeto padre.
- Referencia SSOT: V-8, V-9, §3.2
- Aplicación en código: `pass-enlaces.ts` resuelve `source.id`/`target.id` a `estado::<id>` cuando el estado es visible.
- Estado actual: deuda declarada — enlaces anclan al padre. Ver `docs/design/archive/auditoria-ssot-visual-2026-04-23.md` §2.3.

### R-701: Cinco variantes de enlace transformador con estado

- Enunciado: las variantes canónicas de enlace transformador con estado especificado son:

| Variante | Geometría | OPL |
|---|---|---|
| Consumo con estado | Flecha desde el estado específico del objeto hacia el proceso | TS1 |
| Resultado con estado | Flecha desde el proceso hacia el estado específico del objeto | TS2 |
| Efecto entrada-salida | Flecha de entrada desde estado-origen + flecha de salida desde el proceso hacia estado-destino | TS3 |
| Efecto solo entrada | Flecha desde el estado-origen hacia el proceso (sin flecha de salida) | TS4 |
| Efecto solo salida | Flecha desde el proceso hacia el estado-destino (sin flecha de entrada) | TS5 |

- Referencia SSOT: §3.2
- Aplicación en código: el renderer elige entre las cinco geometrías según los campos `estadoOrigen`/`estadoDestino` del enlace.

### R-702: V-9 — Efecto solo entrada resuelve al estado por defecto

- Enunciado: en un efecto solo-entrada sin estado de salida especificado, el **destino** es el estado por defecto del objeto, o la distribución de probabilidad de estados si no hay defecto.
- Referencia SSOT: V-9
- Aplicación en código: el motor y el generador OPL aplican esta resolución al simular/documentar.

### R-703: V-8 — Resultado no conecta al estado inicial directamente

- Enunciado: un enlace de resultado hacia un objeto con estado inicial DEBE conectar al **rectángulo del objeto** o a un estado distinto del inicial, nunca directamente al estado inicial.
- Referencia SSOT: V-8
- Aplicación en código: validador rechaza `resultado → estado inicial`; sugiere conectar al objeto o a otro estado.

### R-704: Enlaces habilitadores con estado especificado

- Enunciado: los enlaces habilitadores pueden restringirse a un estado específico del habilitador:
  - Agente con estado: HS1 — el agente habilita solo cuando está en el estado declarado
  - Instrumento con estado: HS2 — el instrumento habilita solo cuando está en el estado declarado

- Referencia SSOT: §3.4
- Aplicación en código: geometría idéntica al habilitador básico, pero con anchor al rountangle del estado.

### R-705: Escisión de enlaces en descomposición

- Enunciado: cuando un efecto entrada-salida (TS3) se descompone en subprocesos, se escinde en:
  - TS4 en el subproceso **temprano** (saca al objeto del estado de entrada)
  - TS5 en el subproceso **tardío** (pone al objeto en el estado de salida)
- Referencia SSOT: V-40, TS3→TS4/TS5
- Aplicación en código: `pass-enlaces.ts` + lógica de distribución aplica escisión al detectar descomposición con múltiples subprocesos.
- Ver detalle: `31-distribucion-enlaces-descomposicion.md`.

### R-706: V-41 — Escisión no admite modificadores de control

- Enunciado: los enlaces escindidos con modificador de control (`e` o `c`) NO están permitidos. Saltear un subproceso de una escisión distorsionaría la semántica del efecto.
- Referencia SSOT: V-41
- Aplicación en código: validador rechaza combinación escisión + `e` / `c`.

### R-707: V-110 — Escisión es el único mecanismo de resolución

- Enunciado: la escisión es el **único** mecanismo para resolver la subespecificación de enlaces de efecto entrada-salida en descomposición. NO hay alternativa.
- Referencia SSOT: V-110
- Aplicación en código: no se admite omisión silenciosa; la UI debe forzar al modelador a escindir si hay descomposición.

### R-708: Enlaces estructurales con estado especificado

- Enunciado: tres familias por posición de la especificación de estado:

| Posición | Geometría |
|---|---|
| Estado en origen | El enlace parte de un estado específico del objeto origen |
| Estado en destino | El enlace llega a un estado específico del objeto destino |
| Estado en origen y destino | Ambos extremos conectan a estados específicos |

- Referencia SSOT: §8.5
- Aplicación en código: siete subvariantes (SSE1..SSE7 en OPL-ES) cubren las combinaciones por direccionalidad.

### R-709: V-30 — Bidireccional/recíproco no aplican a estado-solo-en-destino

- Enunciado: las variantes bidireccional y recíproco NO existen para el caso de estado solo en destino.
- Referencia SSOT: V-30
- Aplicación en código: el validador rechaza esta combinación; la UI solo ofrece variantes válidas.

### R-710: V-59 — Activación asincrónica por estados

- Enunciado: cuando subprocesos dentro de una descomposición son activados individualmente por enlaces de evento desde estados distintos de un objeto, se ejecutan de forma asincrónica e independiente (V-59).
- Referencia SSOT: V-59
- Aplicación en código: el motor de simulación activa cada subproceso cuando el estado correspondiente ocurre.

### R-711: Modificadores de control sobre enlaces con estado

- Enunciado: los modificadores `e` y `c` pueden combinarse con enlaces con estado especificado. El enlace parte del estado concreto del objeto y lleva la marca `e` o `c` sobre la línea.
- Referencia SSOT: §4.3
- Aplicación en código: el renderer posiciona la marca cerca del extremo proceso, sobre la línea que parte del rountangle del estado.

### R-712: Precedencia del enlace en abanicos con estado

- Enunciado: los enlaces del abanico pueden partir de o llegar a estados específicos de los objetos. Cada enlace individual del abanico puede tener o no estado especificado independientemente.
- Referencia SSOT: §5.7
- Aplicación en código: la estructura del abanico admite heterogeneidad en especificación de estado entre ramas.

### R-713: V-19 — Equivalencia resultado-XOR

- Enunciado: un enlace de resultado simple hacia un objeto con estados es **semánticamente equivalente** a un abanico XOR de enlaces de resultado con estado especificado, uno por cada estado posible del objeto.
- Referencia SSOT: V-19
- Aplicación en código: el generador OPL puede proyectar la forma simple o la explícita; el validador las considera equivalentes.

### R-714: Estado por defecto como destino implícito

- Enunciado: cuando un efecto solo-entrada no especifica estado de salida y el objeto tiene estado por defecto, el destino es el estado por defecto.
- Referencia SSOT: V-9
- Aplicación en código: resolución automática durante simulación; el canon-diagrama no dibuja flecha a estado por defecto salvo que se haga explícito.

### R-715: Enlaces con estado en OPD hijo

- Enunciado: los estados suprimidos en el OPD padre (SDn) se revelan en el OPD hijo (SDn+1) vinculados a subprocesos específicos (mecanismo inverso de supresión, V-90).
- Referencia SSOT: V-90
- Aplicación en código: al entrar a SDn+1, `pass-enlaces.ts` revela estados relevantes y ancla enlaces a los rountangles visibles.

## Checklist

- [ ] Enlaces con estado especificado anclan al rountangle, no al objeto padre
- [ ] Efecto solo-entrada sin destino resuelve al estado por defecto
- [ ] Resultado no se conecta directamente al estado inicial
- [ ] Habilitadores con estado especificado anclan al estado del habilitador
- [ ] Efecto entrada-salida en descomposición se escinde en TS4 temprano + TS5 tardío
- [ ] Escisión no admite modificadores de control
- [ ] Estructurales con estado especificado cubren las 7 subvariantes
- [ ] Bidireccional/recíproco no combinan con estado-solo-en-destino
- [ ] Estados suprimidos en padre se revelan en OPD hijo vinculados a subprocesos

## Antipatrones

- Anclar una flecha de efecto al rectángulo del objeto cuando el estado estaba especificado (deuda actual)
- Dibujar flecha explícita al estado por defecto como destino
- Aplicar `c` a enlace escindido (viola V-41)
- Omitir escisión y dejar efecto entrada-salida en el contorno del proceso descompuesto
- Crear bidireccional etiquetado con estado solo en destino

## Referencias cruzadas

- Familias de enlace: `13-enlaces-taxonomia-familias.md`
- Estados: `11-estados-designaciones.md`
- Descomposición y escisión: `31-distribucion-enlaces-descomposicion.md`
- Supresión y expresión de estados: `33-supresion-expresion-estados.md`
- OPL TS1..TS5: `71-opl-plantillas-procedimentales.md`
