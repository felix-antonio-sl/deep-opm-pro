# 51 — Propiedades de duración del proceso

**Alcance**: propiedades de duración (mínima, esperada, máxima, distribución), representación gráfica dentro de la elipse, unidades temporales, excepciones por sobretiempo/subtiempo.
**Capa SSOT propietaria**: `opm-visual-es.md` §14; `opm-iso-19450-es.md` §Propiedades de duración
**Aplicación en la app**: renderer de proceso, capa de simulación, validador.

## Reglas

### R-2100: Propiedades estándar de duración

- Enunciado: las propiedades de duración de un proceso son:

| Propiedad | Descripción |
|---|---|
| Duración | Tiempo real transcurrido en ejecución |
| Duración mínima | Tiempo mínimo permitido |
| Duración esperada | Media estadística |
| Duración máxima | Tiempo máximo permitido |
| Distribución de duración | Función probabilística: normal, uniforme, exponencial, etc. |

- Referencia SSOT: §14.1
- Aplicación en código: `proceso.duracion: { min, esperada, max, distribucion?: Distribucion }`.

### R-2101: V-45 — Valores dentro de la elipse

- Enunciado: los valores de duración se muestran **dentro de la elipse del proceso**, bajo el nombre y la unidad temporal. Formato: `[unidad] {min, esperada, max} {distribución, parámetros}`.
- Referencia SSOT: V-45
- Aplicación en código: `crear-cosa.ts` (proceso) concatena el bloque de duración al texto interno cuando está declarado.

### R-2102: Unidades temporales válidas

- Enunciado: las unidades temporales válidas son: `ms`, `sec`, `min`, `hour`, `day`, `week`, `month`, `year`. El JSON canónico acepta además abreviaciones históricas equivalentes (`s`, `h`, `d`) por compatibilidad.
- Referencia SSOT: §14.3
- Aplicación en código: validador acepta solo estas unidades.

### R-2103: Unidad temporal del sistema por defecto

- Enunciado: la unidad temporal del sistema es la unidad por defecto para todos los procesos, salvo que se redefina.
- Referencia SSOT: `opm-iso-19450-es.md` §Propiedades de duración
- Aplicación en código: el modelo declara una unidad global; procesos pueden sobreescribir.

### R-2104: Ejemplo canónico de representación

- Enunciado: ejemplo de formato:
  - `Procesar [min] (30.0, 45.6, 60.0)` con distribución `normal, media=45.6, desviación=7.3`
- Referencia SSOT: `opm-iso-19450-es.md` §Ejemplos
- Aplicación en código: renderer imprime este formato; OPL usa plantilla específica.

### R-2105: Excepción por sobretiempo `/`

- Enunciado: el enlace de excepción por sobretiempo se marca con `/` (una barra oblicua). Dispara cuando la duración real supera la duración máxima.
- Referencia SSOT: §4.4
- Aplicación en código: marker textual sobre el enlace fuente→manejador.

### R-2106: Excepción por subtiempo `//`

- Enunciado: el enlace de excepción por subtiempo se marca con `//` (dos barras oblicuas). Dispara cuando la duración real cae por debajo de la duración mínima.
- Referencia SSOT: §4.4
- Aplicación en código: marker textual sobre el enlace.

### R-2107: Proceso de manejo de excepción es ambiental

- Enunciado: los enlaces de excepción conectan un proceso fuente con un proceso de manejo de excepción. El proceso de manejo es **ambiental** (contorno discontinuo).
- Referencia SSOT: §4.4
- Aplicación en código: auto-declarar afiliación ambiental al crear un manejador.

### R-2108: Distribuciones admitidas

- Enunciado: las distribuciones probabilísticas admitidas incluyen:
  - normal (parámetros: media, desviación)
  - uniforme (parámetros: a, b)
  - exponencial (parámetros: lambda)
  - y otras declaradas por la implementación
- Referencia SSOT: §14.1, `opm-iso-19450-es.md` §Ejemplos de duración
- Aplicación en código: tipo `Distribucion` extensible.

### R-2109: Muestreo independiente por instancia

- Enunciado: en ejecución, cada instancia del proceso muestrea su duración independientemente. Sin distribución, todas las instancias ejecutan en exactamente la duración esperada (irrealista para sistemas reales).
- Referencia SSOT: `metodologia-opm-es.md` §12.3
- Aplicación en código: motor de simulación genera muestra por instancia.

### R-2110: Casos de sobretiempo y subtiempo

- Enunciado: ejemplos canónicos de la SSOT:
  - `Procesar [min] (30.0, 45.6, 60.0)` con `uniforme, a=5.0, b=70.0`, duración real `63.3`, instancia `1` → caso de sobretiempo
  - Mismo intervalo de duración, con duración real `23.4` e instancia `2` → caso de subtiempo
- Referencia SSOT: `opm-iso-19450-es.md` §Ejemplos de duración
- Aplicación en código: tests de simulación usan estos ejemplos.

### R-2111: Resolución de estado indeterminado tras excepción

- Enunciado: todo afectado en transición durante un proceso activo permanece en estado indeterminado si el proceso falla. Los manejadores de excepciones (sobretiempo/subtiempo) DEBEN resolver el objeto a un estado permisible. Sin manejo de excepciones, el objeto queda indefinido y el modelo es incompleto para simulación.
- Referencia SSOT: `metodologia-opm-es.md` §11.3
- Aplicación en código: validador emite warning cuando un proceso con duración mínima/máxima no tiene manejador.

### R-2112: Undertime como detector de omisión

- Enunciado: un enlace de excepción por subtiempo en un proceso con duración mínima detecta cuando el proceso NO se ejecutó (duración efectiva = 0 < mínimo positivo), activando lógica de recuperación. Esto provee un mecanismo formal para "proceso no ejecutado".
- Referencia SSOT: `metodologia-opm-es.md` §11.2
- Aplicación en código: patrón aplicable para detección de skip.

### R-2113: Duración real ≠ propiedad declarada

- Enunciado: la duración real es propiedad de ejecución; las duraciones mínima/esperada/máxima son propiedades declaradas del modelo.
- Referencia SSOT: `metodologia-opm-es.md` §12.1
- Aplicación en código: distinguir en el modelo de runtime.

### R-2114: Tasa de transformación como propiedad opcional

- Enunciado: cuando consumo, creación o cambio de estado ocurre como flujo continuo u operación multiunidad en el tiempo, el modelador DEBERÍA asignar una propiedad de **tasa de transformación** al enlace procedimental relevante. Tres especializaciones:
  - tasa de consumo
  - tasa de generación
  - tasa de efecto
- Referencia SSOT: `metodologia-opm-es.md` §12.1
- Aplicación en código: campo opcional `tasa` en enlaces procedimentales.

### R-2115: Excepción temporal no es parte del flujo normal

- Enunciado: un proceso de salida por excepción puede provocar salida inmediata sin importar su posición gráfica.
- Referencia SSOT: `opm-iso-19450-es.md` §Principio de línea de tiempo
- Aplicación en código: motor maneja excepción como salto de control.

### R-2116: Duración en renderer es opcional

- Enunciado: si el proceso no declara duración, la elipse no muestra bloque de duración. La ausencia es admisible para modelos conceptuales iniciales.
- Referencia SSOT: V-45 implícito
- Aplicación en código: renderer omite el bloque cuando no hay datos.

### R-2117: Plantillas OPL para excepciones

- Enunciado: las plantillas OPL-ES para excepciones son:
  - EX1 (sobretiempo): `*Manejo* ocurre si duración de *Fuente* excede máx-duración unidades-tiempo.`
  - EX2 (subtiempo): `*Manejo* ocurre si duración de *Fuente* es menor que mín-duración unidades-tiempo.`
- Referencia SSOT: `opm-opl-es.md` §8.1
- Aplicación en código: generador OPL emite estas plantillas.

## Checklist

- [ ] Propiedades de duración soportadas: min, esperada, max, distribución
- [ ] Duración renderizada dentro de la elipse bajo el nombre
- [ ] Formato `[unidad] {min, esperada, max} {distribución, params}`
- [ ] Unidades válidas: ms/sec/min/hour/day/week/month/year
- [ ] Excepción sobretiempo = `/`; subtiempo = `//`
- [ ] Proceso de manejo de excepción es ambiental
- [ ] Distribuciones soportadas: normal/uniforme/exponencial/...
- [ ] Muestreo independiente por instancia
- [ ] Manejadores resuelven estado indeterminado
- [ ] Subtiempo detecta omisión (duración = 0)
- [ ] Tasa de transformación admitida como propiedad de enlace
- [ ] Ausencia de duración admisible en modelos conceptuales
- [ ] OPL EX1/EX2 para excepciones

## Antipatrones

- Duración fuera de la elipse (pierde asociación)
- Unidades ad hoc fuera de la lista canónica
- Manejador de excepción con afiliación sistémica
- Proceso con duración mínima/máxima sin manejador de excepción
- Ignorar estado indeterminado tras fallo sin resolución

## Referencias cruzadas

- Modificadores (excepciones): `16-modificadores-operadores.md`
- Simulación runtime: `50-simulacion-runtime-visual.md`
- Metodología errores: `85-metodologia-errores-simulacion.md`
- Metodología simulación: `87-metodologia-simulacion-ejecucion.md`
- OPL EX: `71-opl-plantillas-procedimentales.md`
