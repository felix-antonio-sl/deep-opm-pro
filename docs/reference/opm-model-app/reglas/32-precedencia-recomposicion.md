# 32 — Precedencia de enlaces en recomposición

**Alcance**: matriz de precedencia transformadora, precedencia entre transformadores y habilitadores, orden completo de fuerza semántica (12 niveles), combinaciones inválidas, resolución de colisiones.
**Capa SSOT propietaria**: `opm-visual-es.md` §13
**Aplicación en la app**: lógica de out-zooming en `src/render/jointjs/pass-enlaces.ts`, validador.

## Reglas

### R-1300: Matriz de precedencia transformadora

- Enunciado: al recomponer subprocesos en un proceso padre, si dos subprocesos tienen enlaces distintos hacia el mismo objeto, la fuerza semántica determina cuál prevalece:

| B↔P1 \ B↔P2 | Efecto | Resultado | Consumo |
|---|---|---|---|
| **Efecto** | Efecto | Resultado | Consumo |
| **Resultado** | Resultado | **Inválido** | Efecto |
| **Consumo** | Consumo | Efecto | **Inválido** |

- Referencia SSOT: §13.1
- Aplicación en código: al out-zoom, computar el enlace resultante según la matriz.

### R-1301: V-43 — Combinaciones inválidas

- Enunciado: resultado + resultado y consumo + consumo sobre el mismo objeto son **inválidos**. Resultado + consumo NO es inválido: por la matriz R-1300 se abstrae como **efecto**, porque en el nivel recombinado el objeto persiste pero cambia por la combinación de creación/consumo en subprocesos.
- Referencia SSOT: V-43
- Aplicación en código: validador rechaza recomposición que produzca estas combinaciones; pide corregir en el nivel hijo.

### R-1302: V-44 — Transformador prevalece sobre habilitador

- Enunciado: un enlace transformador siempre prevalece sobre un enlace habilitador al recomponer.
- Referencia SSOT: V-44
- Aplicación en código: colisión consumo/resultado/efecto vs agente/instrumento → queda el transformador.

### R-1303: Orden principal de precedencia

- Enunciado:

```
consumo = resultado > efecto > agente > instrumento
```

- Referencia SSOT: §13.3
- Aplicación en código: ordenamiento canónico para resolver colisiones.

### R-1304: Precedencia secundaria por modificador de control

- Enunciado: dentro de cada clase de enlace:

```
evento > sin control > condición
```

- Referencia SSOT: §13.4
- Aplicación en código: el evento fortalece, la condición debilita.

### R-1305: Orden completo de fuerza semántica (12 niveles)

- Enunciado: el orden completo de fuerza semántica:

| Nivel | Enlace |
|---|---|
| 1 | Evento de consumo |
| 2 | Consumo = Resultado |
| 3 | Condición de consumo |
| 4 | Evento de efecto |
| 5 | Efecto |
| 6 | Condición de efecto |
| 7 | Evento de agente |
| 8 | Agente |
| 9 | Condición de agente |
| 10 | Evento de instrumento |
| 11 | Instrumento |
| 12 | Condición de instrumento |

- Referencia SSOT: §13.5
- Notas:
  - Consumo y resultado tienen la misma fuerza (nivel 2)
  - No existen "evento de resultado" ni "condición de resultado" (el resultado no existe antes del proceso)
  - Condición de instrumento (nivel 12) es el enlace más débil
- Aplicación en código: ordenar los enlaces candidatos por nivel ascendente; el de menor nivel gana.

### R-1306: Colisiones admisibles

- Enunciado: solo las colisiones cuya combinación es válida por la matriz §13.1 se resuelven por fuerza semántica. Las inválidas bloquean la recomposición.
- Referencia SSOT: §13.1, V-43
- Aplicación en código: evaluar primero la matriz; si es inválida, error; si es válida, aplicar precedencia.

### R-1307: Uso de precedencia solo para colisiones, no para fusión

- Enunciado: la fuerza semántica solo se usa para resolver colisiones entre hechos candidatos al **mismo** enlace abstracto. NO autoriza a fusionar hechos distintos ni a borrar evidencia semántica legítima.
- Referencia SSOT: `metodologia-opm-es.md` §8.4
- Aplicación en código: la recomposición preserva enlaces hacia objetos distintos; no mezcla.

### R-1308: V-19 revisita — Resultado simple ↔ XOR con estados

- Enunciado: un enlace de resultado simple es semánticamente equivalente a un abanico XOR de resultados con estado especificado. Por tanto, al recomponer, ambas formas colapsan al mismo hecho abstracto.
- Referencia SSOT: V-19
- Aplicación en código: recomposición normaliza a la forma simple cuando todos los estados aparecen.

### R-1309: Precedencia en abstracción vs simulación

- Enunciado: la precedencia aplica a **abstracción** (out-zooming, recomposición), NO a simulación. En simulación, cada enlace mantiene su semántica operativa.
- Referencia SSOT: §13 (implícito)
- Aplicación en código: el motor de simulación NO usa la matriz de precedencia.

### R-1310: Prohibición de mergeo fuera de la matriz

- Enunciado: si la recomposición produce una combinación marcada como **inválida**, el refinamiento DEBE corregirse en el nivel hijo antes de seguir abstrayendo.
- Referencia SSOT: `metodologia-opm-es.md` §8.4
- Aplicación en código: wizard de out-zooming bloquea y guía al corrección en SDn+1.

### R-1311: Efecto como nivel medio

- Enunciado: el efecto se ubica entre consumo/resultado y agente/instrumento en fuerza. Preserva identidad del objeto pero cambia estado.
- Referencia SSOT: `opm-iso-19450-es.md` §Modos de transformación
- Aplicación en código: en colisión efecto vs consumo → prevalece consumo.

### R-1312: Procedimiento out-zooming

- Enunciado: la recomposición en nuevo diagrama ejecuta:
  1. **Abstraer Enlaces** — abstrae los enlaces de los subprocesos según la matriz
  2. **Ocultar Contenido** — oculta el contenido interno, restaurando el OPD padre
- Referencia SSOT: V-62
- Aplicación en código: secuencia explícita en el flujo de out-zooming.

### R-1313: Condición de instrumento como enlace más débil

- Enunciado: la condición de instrumento (nivel 12) es el enlace más débil del sistema. Existe como variante válida (`opm-opl-es` §7.2 CH2, §7.3 CS6) aunque raramente aparece en modelos típicos.
- Referencia SSOT: §13.5 Notas
- Aplicación en código: admitir la variante sin bloquear.

### R-1314: Evento fortalece, condición debilita — regla mnemotécnica

- Enunciado: **el evento fortalece; la condición debilita**. Este principio heurístico se deriva del orden de niveles.
- Referencia SSOT: §13.5 Notas
- Aplicación en código: usar esta regla en docs y tooltips.

### R-1315: Persistencia de enlaces estructurales bajo recomposición

- Enunciado: los enlaces estructurales (agregación, exhibición, generalización, clasificación) NO se abstraen durante recomposición — permanecen tal cual estaban en el padre.
- Referencia SSOT: V-105
- Aplicación en código: out-zooming filtra solo enlaces procedimentales.

## Checklist

- [ ] Matriz §13.1 implementada exactamente
- [ ] Resultado+consumo abstraído como efecto
- [ ] Resultado+resultado y consumo+consumo rechazados
- [ ] Transformador prevalece sobre habilitador
- [ ] Orden principal: consumo=resultado > efecto > agente > instrumento
- [ ] 12 niveles de fuerza semántica respetados
- [ ] Evento fortalece, condición debilita
- [ ] No existen "evento de resultado" ni "condición de resultado"
- [ ] Precedencia solo para colisiones; no para fusión
- [ ] Recomposición bloquea si aparece combinación inválida
- [ ] Simulación no usa la matriz
- [ ] Estructurales no se abstraen durante recomposición

## Antipatrones

- Fusionar enlaces hacia objetos distintos "por simetría"
- Inventar "evento de resultado" como enlace nuevo
- Ignorar una combinación inválida y seguir abstrayendo
- Usar la matriz de precedencia durante simulación
- Aplicar precedencia sin respetar la distinción de niveles (ej. evento de agente no prevalece sobre consumo)

## Referencias cruzadas

- Distribución de enlaces: `31-distribucion-enlaces-descomposicion.md`
- Modificadores de control: `16-modificadores-operadores.md`
- Familias canónicas: `13-enlaces-taxonomia-familias.md`
- Refinamiento general: `30-refinamiento-entre-opds.md`
- OPL plantillas: `71-opl-plantillas-procedimentales.md`
