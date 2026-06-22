# 11 — Estados y designaciones persistentes

**Alcance**: representación gráfica de estados (rountangles), contención dentro del objeto propietario, las cuatro designaciones persistentes (inicial, final, por defecto, `Current` declarado), valores de atributo, objetos específicos de estado.
**Capa SSOT propietaria**: `opm-visual-es.md` §2; `opm-iso-19450-es.md` (estados de objeto)
**Aplicación en la app**: `src/render/jointjs/crear-estado.ts`, `src/render/layout/pass-estados-franja-inferior.ts`, `src/nucleo/` (modelo de cosas con estados).

## Reglas

### R-300: Representación canónica del estado

- Enunciado: los estados se representan como **rectángulos redondeados** (rountangles) contenidos dentro del rectángulo del objeto propietario, dispuestos horizontalmente en la zona inferior del objeto.
- Referencia SSOT: §2.1
- Aplicación en código: `crear-estado.ts` usa `joint.shapes.standard.Rectangle` con `rx` y `ry` positivos; `pass-estados-franja-inferior.ts` dispone los estados en fila al pie del objeto.
- Antipatrón: estados como rectángulos sin redondeo, o elipses.

### R-301: V-4 — Contención obligatoria

- Enunciado: un estado NO existe fuera de su objeto propietario. No hay estados flotantes.
- Referencia SSOT: V-4 (`opm-visual-es.md` §2.1)
- Aplicación en código: el modelo rechaza estados sin `cosaPropietaria`; el renderer embebe estados vía `embed()` de JointJS.
- Antipatrón: un rountangle suelto conectado a varios objetos.

### R-302: V-5 — Objeto sin estados: solo creado o destruido

- Enunciado: un objeto sin estados NO puede ser afectado; solo puede ser **creado** (resultado) o **destruido** (consumo).
- Referencia SSOT: V-5
- Aplicación en código: la validación del kernel rechaza un enlace de efecto a objeto sin estados. Sugerencia UX: "para modelar cambio de estado, agregue al menos un estado al objeto".

### R-303: Las cuatro designaciones persistentes

- Enunciado: un estado puede tener hasta cuatro designaciones persistentes simultáneas:

| Designación | Marca gráfica canónica | Significado |
|---|---|---|
| **Inicial** | Borde grueso simple (bold-contour) | Estado en la creación del objeto |
| **Final** | Doble borde concéntrico (double-contour) | Estado en el momento de ser consumido |
| **Por defecto** | Flecha diagonal abierta apuntando al estado | Estado más probable al inspeccionar aleatoriamente |
| **`Current` declarado** | Marca externa reservada (pin/gota) | Estado declarado como actual persistente |
| (Normal) | Borde estándar | Estado sin designación especial |

- Referencia SSOT: §2.2 (`opm-visual-es.md`), V-6 revisada, V-237
- Aplicación en código: la tabla es **descriptiva** (define qué significa cada marca cuando se renderiza), no mandato de renderizado. El modelador opmodel-app, conforme con la convención de OPCloud, renderiza solo `Inicial` (borde grueso) y `Final` (doble borde) en el canvas de autoría. `porDefecto` y `actualPersistente` se preservan como designaciones del modelo (`crear-estado.ts` solo aplica `body`/`outline`); sus glifos quedan reservados para el motor de simulación runtime, donde V-54/V-133 sí exigen marca visible distinguible.

### R-304: V-6 revisada — Cardinalidad de designaciones

- Enunciado: un objeto puede tener:
  - **cero o más** estados iniciales
  - **cero o más** estados finales
  - **como máximo uno** por defecto
  - **como máximo uno** `Current` declarado
- Referencia SSOT: V-6 revisada
- Aplicación en código: validador de modelo verifica cardinalidades; UI bloquea la asignación de `porDefecto=true` o `currentDeclarado=true` si ya existe.

### R-305: Ejemplo canónico — estado cíclico (inicial Y final)

- Enunciado: un estado PUEDE ser simultáneamente inicial Y final, modelando objetos que retornan a su estado original tras un ciclo completo de vida. NO es un error.
- Referencia SSOT: `metodologia-opm-es.md` §9.19
- Aplicación en código: el renderer combina borde grueso + doble borde cuando ambos son verdaderos.
- Antipatrón: duplicar estados (`empty_start`, `empty_end`) para evitar la coexistencia → introduce sinónimo falso y rompe coherencia.

### R-306: V-237 — `Current` declarado es serializable

- Enunciado: la designación `Current` es declarable por el modelador y se serializa en el modelo como propiedad persistente del estado correspondiente. La herramienta que la ofrezca en edición DEBE garantizar que sobreviva al ciclo save/load y al export canónico.
- Referencia SSOT: V-237
- Aplicación en código: `src/persistencia/` incluye el flag `currentDeclarado` en la serialización.

### R-307: V-238 — Current declarado ≠ estado actual runtime

- Enunciado: `Current` como designación persistente (§2.2) es **distinta** del estado actual de runtime durante simulación (V-54, V-133). La marca visual puede coincidir, pero la serialización del modelo DEBE distinguir explícitamente entre designación declarada y marca inducida por ejecución.
- Referencia SSOT: V-238
- Aplicación en código: el modelo persiste `currentDeclarado: boolean` por estado; el motor de simulación mantiene estado actual runtime en una capa separada.
- Ver: `50-simulacion-runtime-visual.md`.

### R-308: V-134 — Metadato de origen del glifo `Current`

- Enunciado: una herramienta que reutilice el mismo glifo para `Current` declarado y `Current` runtime DEBE exponer, en el metadato recuperable del modelo, el origen de la marca (declaración persistente vs inducción por runtime).
- Referencia SSOT: V-134
- Aplicación en código: exportar metadato `"origen": "declarado" | "runtime"` junto al glifo.

### R-309: V-133 — Glifo recomendado para `Current`

- Enunciado: el glifo recomendado para estado actual (runtime o declarado) es un **pin o gota externa** anclada al borde del rectángulo redondeado del estado. Cualquier implementación con glifo distinto DEBE preservar la misma separación visual respecto de las designaciones de borde grueso (inicial), doble borde (final) y flecha diagonal (por defecto).
- Referencia SSOT: V-133
- Aplicación en código: el modelador opmodel-app NO renderiza glifo para `actualPersistente` declarado en estado de autoría. La designación queda en el modelo (R-306) y disponible como metadato (R-308). Conforme con la convención visual de OPCloud, que solo emplea borde grueso (inicial) y doble borde (final) sobre la rountangle. Cuando se incorpore el motor de simulación runtime, la marca de estado actual runtime DEBERÁ usar pin/gota externo anclado al borde y respetar la separación visual exigida por V-133.

### R-310: V-7 — Enlace de efecto requiere estado

- Enunciado: un enlace de efecto requiere que el objeto tenga al menos un estado definido.
- Referencia SSOT: V-7
- Aplicación en código: la validación del kernel rechaza un efecto a objeto sin estados.

### R-311: V-8 — Resultado no conecta directamente al estado inicial

- Enunciado: un enlace de resultado hacia un objeto con estado inicial DEBE conectar al rectángulo del objeto, nunca directamente al estado inicial.
- Referencia SSOT: V-8
- Aplicación en código: `pass-enlaces.ts` resuelve el anchor del resultado al objeto completo si el estado destino es inicial. El resultado puede conectar a otro estado específico distinto del inicial.

### R-312: V-9 — Efecto solo-entrada resuelve a estado por defecto

- Enunciado: en un efecto solo-entrada sin estado de salida especificado, el destino es el estado por defecto del objeto, o la distribución de probabilidad de estados si no hay defecto.
- Referencia SSOT: V-9
- Aplicación en código: la ejecución conceptual y la generación OPL asumen esta resolución; el renderer NO dibuja flecha de salida explícita.

### R-313: V-67 — Objetos con vs sin estados

- Enunciado: todo objeto exhibe un conjunto de estados. Si el tamaño del conjunto es `s = 0`, el objeto es sin estados. Si `s ≥ 1`, el objeto es con estados.
- Referencia SSOT: V-67 (`opm-visual-es.md` §18.4)
- Aplicación en código: el modelo incluye `estados: Estado[]` con `length >= 0`.

### R-314: V-68 — Objeto específico de estado

- Enunciado: un objeto con `s` estados deriva un conjunto de `s` **objetos específicos de estado**. Cada uno se nombra concatenando el nombre del estado con el nombre del objeto original (ej. `Producto Diseñado` para estado `diseñado` de `Producto`).
- Referencia SSOT: V-68, `opm-iso-19450-es.md` §Modelo de cosa
- Aplicación en código: utilidad del kernel para proyectar `estado → objetoEspecificoDeEstado` cuando sea necesario para enlaces con estado especificado.

### R-315: Valores de atributo como estados

- Enunciado: los valores de un atributo son estados del objeto-atributo. Pueden expresarse como:
  - valores discretos: `sólido`, `líquido`, `gas`
  - rangos numéricos: `120..240`
  - valor concreto (en instancias): `185`
- Referencia SSOT: §2.3
- Aplicación en código: el kernel admite `estado.valor?: string | number | Intervalo`.

### R-316: Distinción slot de valor vs estado cualitativo

- Enunciado: cuando un objeto combina estados cualitativos y un slot de valor computacional, ambos DEBEN poder distinguirse por al menos uno de los siguientes canales:
  - **posición** (el slot de valor se coloca separado del cluster de estados) — recomendado
  - **rotulado** (prefijo o etiqueta explícita del slot)
  - **estilo auxiliar** (marca gráfica distintiva reservada al slot)
- Referencia SSOT: V-166 (§20.3)
- Aplicación en código: `pass-estados-franja-inferior.ts` dispone estados cualitativos en la franja inferior; un slot de valor va en la franja superior o lateral derecho, documentado en ADR.

### R-317: V-86 — Supresión de estados por demanda

- Enunciado: un estado `s` de una cosa T se suprime en el OPD padre cuando:
  - existe un OPD hijo de descomposición donde T aparece como externo, **y**
  - existe un enlace entre T y la cosa refinada que referencia `s` como estado de origen o destino.
- Referencia SSOT: V-86
- Aplicación en código: la supresión se computa bajo demanda, NO se almacena en el modelo.
- Ver detalle: `33-supresion-expresion-estados.md`.

### R-318: Estados ordenados horizontalmente

- Enunciado: los estados dentro de un objeto se ordenan horizontalmente. Las referencias SSOT no prescriben un orden semántico único, pero la convención operativa es:
  - iniciales a la izquierda
  - finales a la derecha
  - por defecto cerca del centro
  - `Current` declarado sin prescripción posicional
- Referencia SSOT: §2.1 (layout implícito)
- Aplicación en código: `pass-estados-franja-inferior.ts` aplica este orden cuando no hay Y explícita.

### R-319: Rótulo de estado en minúsculas

- Enunciado: los identificadores de estado se escriben en **minúsculas**, con forma pasiva o descriptiva del objeto que los contiene. Ejemplos: `pintado`, `inspeccionado`, `pre-cortado`, `vacío`, `cargado`, `satisfecho`.
- Referencia SSOT: `opm-opl-es.md` §1.3
- Aplicación en código: el renderer imprime el rótulo tal cual el modelo lo declare; el validador advierte (no bloquea) si el rótulo inicia con mayúscula.

### R-320: Anclaje de enlaces al rountangle del estado

- Enunciado: cuando un enlace declara estado de origen o destino específico, DEBE anclarse al rountangle del estado, NO al bounding box del objeto padre.
- Referencia SSOT: V-8, V-9, §3.2
- Aplicación en código: `pass-enlaces.ts` debe resolver `source.id`/`target.id` a `estado::<id>` en vez de `cosa::<id>` cuando el estado esté visible.
- Estado actual: deuda declarada en `pass-enlaces.ts:6` (ver `docs/design/archive/auditoria-ssot-visual-2026-04-23.md` §2.3).

### R-321: Supresor visual de estados ocultos

- Enunciado: cuando un objeto tiene más estados que los mostrados (por supresión de estados, V-86), se indica con un símbolo `...` en un rountangle de la esquina inferior derecha del objeto.
- Referencia SSOT: §1.8
- Aplicación en código: el renderer agrega un rountangle mini con `...` si `estadosVisibles.length < estadosTotal.length`.

## Checklist

- [ ] Los estados se dibujan como rountangles contenidos en su objeto propietario
- [ ] No hay estados flotantes fuera de objetos
- [ ] Un objeto sin estados solo acepta enlaces de consumo/resultado, no de efecto
- [ ] Las 4 designaciones persistentes (inicial, final, defecto, `Current`) se marcan con glifos distintos
- [ ] Las cardinalidades se respetan: 0..* iniciales, 0..* finales, 0..1 defecto, 0..1 `Current`
- [ ] Estado cíclico (inicial+final simultáneo) es admisible
- [ ] `Current` declarado se serializa; distingue de runtime en metadato
- [ ] Efecto solo-entrada sin salida resuelve a estado por defecto
- [ ] Enlaces con estado especificado anclan al rountangle, no al objeto
- [ ] Supresor `...` presente cuando hay estados ocultos
- [ ] Rótulos de estado en minúsculas

## Antipatrones

- Dibujar un estado como elipse o rectángulo sin redondeo
- Permitir un estado "flotante" sin objeto propietario
- Dos estados `porDefecto=true` en el mismo objeto
- Anclar una flecha de efecto al rectángulo del objeto cuando el estado estaba especificado en el enlace
- Duplicar estados (`empty_start`, `empty_end`) en lugar de usar el patrón cíclico
- Confundir glifo de `Current` declarado con el de estado actual runtime en serialización
- Usar "inicial" en lugar de "inicial" (con mayúscula o tilde incorrecta) — ver R-319

## Referencias cruzadas

- Cosas: `10-primitivas-cosas.md`
- Enlaces con estado especificado: `15-enlaces-estado-especificado.md`
- Supresión: `33-supresion-expresion-estados.md`
- Simulación runtime: `50-simulacion-runtime-visual.md`
- Slot de valor computacional: `53-capa-computacional.md`
- OPL plantillas D7..D13: `70-opl-convenciones-y-plantillas-cosa-estado.md`
