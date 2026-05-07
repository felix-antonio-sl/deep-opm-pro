# Línea 2 — EPICA-17 slot de valor numérico + sintaxis compuesta `Nombre [Unidad]`

## 1. Misión

Abrir **MVP-β fase kernel-aditivo** con la primera capacidad post-MVP-α: **slot de valor numérico canónico** sobre atributos. Cubre **7 HU vivas** de EPICA-17:

- **HU-17.011** unidad física entre corchetes en nombre de atributo (M1, kernel-aditivo).
- **HU-17.012** sintaxis compuesta `Nombre [Unidad] {alias}` renderizada en canvas (M1, render).
- **HU-17.013** crear atributo del objeto vía exhibición-característica (M0, kernel-aditivo).
- **HU-17.014** distinguir atributos numéricos de atributos objeto (M1, kernel).
- **HU-17.015** declarar slot de valor `value` en atributo numérico (M1, kernel-aditivo).
- **HU-17.016** OPL `Atributo es valor [Unidad].` para atributo numérico (M1, OPL aditivo).
- **HU-17.017** asignar valor concreto al slot (S, kernel-aditivo).

Slice mínimo entregable: **kernel-aditivo + lente derivada OPL + inspector**:

- `Entidad.valorSlot?: { tipo: "integer" | "float" | "char" | "string"; placeholder: "value"; valor?: number | string }` — campo opcional aditivo en `tipos/entidad.ts`.
- `Entidad.esAtributo?: boolean` — flag explícito (HU-17.014). Derivable de tener enlace exhibición entrante; el flag explícito es para evitar recálculo costoso en render.
- `Entidad.unidad?: string` — **ya existe** (`tipos/entidad.ts:50`). Solo verificar parsing automático en `validarNombreEntidad` para extraer unidad del nombre `Temperatura [°C]`.
- Nueva oración OPL canónica: `<Atributo> es valor [<Unidad>].` (placeholder) o `<Atributo> es <valor> [<Unidad>].` (valor asignado).
- Nueva sección `SeccionAtributo` en inspector con: tipo (numérico/objeto/texto), unidad, valor concreto.
- Nueva acción Toolbar: "Crear atributo numérico" que materializa `objeto + atributo + enlace exhibición` con `valorSlot` en una operación atómica.

**Fuera de slice**:
- No tocar `etiquetas` o `estilos` de enlace (territorio L1 cierre HU-11.012 si aplica + ronda 11 L4 ya estable).
- No tocar `acciones-canvas.ts` para multi-al-todo (territorio L1 HU-11.007).
- No tocar `Toolbar.tsx` para botones traer conectados / plantillas (territorio L3/L4).
- No introducir validador completo `AttributeValue` con `setRange`/range constraints — se difiere a ronda 13+. Aquí solo el slot mínimo (tipo + valor).
- No tocar parser OPL bidireccional (territorio ronda 14).

## 2. Deudas que cierra

| HU | Estado actual | Aporte L2 |
|---|---|---|
| HU-17.011 | pendiente (`Entidad.unidad?` ya existe pero sin parsing automático) | En `validarNombreEntidad` o en `acciones-entidad.editarNombreEntidad`, detectar patrón `<nombre> [<unidad>]` y extraer a `Entidad.unidad`. Mantener `Entidad.nombre = "Temperatura"` y `Entidad.unidad = "°C"`. Idempotente: si el nombre ya viene con unidad y `unidad` ya está, no duplica. |
| HU-17.012 | pendiente | En render de apariencia (`composer` o componente texto): si `Entidad.unidad` y/o `Entidad.alias`, etiqueta visible es `<nombre> [<unidad>] {<alias>}`. Sin re-renderizar nodos no afectados. Tipografía respeta JOYAS.md §3 (Arial 14px font-weight 600). |
| HU-17.013 | pendiente | Acción `crearAtributoEnObjeto(modelo, opdId, objetoId, nombreAtributo, tipoSlot?)` en `modelo/operaciones/entidad.ts`. Crea entidad atributo + enlace exhibición + apariencia + aparienciaEnlace en la misma operación atómica. Si `tipoSlot` provisto y `tipo === "numerico"`, también inicializa `valorSlot`. Botón Toolbar: "+ Atributo" sobre objeto seleccionado. |
| HU-17.014 | pendiente | Flag `Entidad.esAtributo?: boolean` aditivo. Set explícito por `crearAtributoEnObjeto`. Lente derivada `esAtributoDerivado(modelo, entidadId)` que cruza enlaces exhibición entrantes para entidades antiguas (sin flag explícito). En el panel OPL, atributos numéricos verbalizan diferente que atributos objeto. |
| HU-17.015 | pendiente | `Entidad.valorSlot?: ValorSlot` aditivo. `ValorSlot = { tipo: TipoValorSlot; placeholder: "value"; valor?: ValorConcreto }`. Tipo enum `TipoValorSlot = "integer" \| "float" \| "char" \| "string"`. Default placeholder `"value"`. Persistido en JSON (campo opcional aditivo en serializador). |
| HU-17.016 | pendiente | Nueva oración OPL canónica en `opl/generadores/estructural.ts` o nuevo `opl/generadores/atributo.ts`: para entidad con `esAtributo === true` y `valorSlot.valor === undefined`, emite `<nombreOpl> es valor [<unidad>].` (placeholder); con `valor` definido, emite `<nombreOpl> es <valor> [<unidad>].`. Si no hay unidad, omite los corchetes. |
| HU-17.017 | pendiente | Acción `asignarValorAtributo(modelo, entidadId, valor: number \| string)` en `acciones-entidad.ts`. Valida que `Entidad.esAtributo === true` y `valorSlot` exista. Validación tipo: `tipo === "integer"` rechaza decimales; `tipo === "float"` admite ambos; `tipo === "char"` admite 1 char; etc. Validador inspirado en `opm-extracted/src/app/models/modules/attribute-validation/attribute-value.ts` pero **no copiado 1:1**. |

**Total esperado**: 7 HU cubiertas (todas pendientes pasan a cubierto).

## 3. Anclaje a evidencia

- **JOYAS** (`docs/JOYAS.md`):
  - §1 paleta: atributo numérico tiene mismo color de Object por defecto (`#70E483` stroke).
  - §3 tipografía: Arial 14px font-weight 600 para texto en canvas.
  - §2 dimensiones: atributo conserva 135×60 px o se ajusta a contenido si la sintaxis compuesta excede.
- **Assets canónicos** (`assets/svg/`):
  - `editAlias.svg`, `editUnits.svg`: botones inspector `SeccionAtributo` para editar alias/unidad.
  - `objectDrag.svg`: usar variante visual para botón Toolbar "Crear atributo numérico" (drag desde Toolbar al objeto target).
- **opm-extracted/ verificado**:
  - `opm-extracted/src/app/models/modules/attribute-validation/attribute-value.ts`: clase `AttributeValue` con `setRange(type, range, stereotypeValidator)`, `validate(value)`, `getDefault()`, `getType()`, `getRange()`. Enum `ValueAttributeType.INTEGER \| FLOAT \| CHAR`. **Reuso semántico**: tipos enum + interfaz validador (`validate`, `getDefault`); **no copiar** la clase entera (depende de stereotypes que no aplican).
  - `opm-extracted/src/app/models/modules/attribute-validation/char-range.ts`: `CharRange` con `validate(value) { return value.length === 1 }`. Patrón validador simple.
  - `opm-extracted/src/app/models/modules/attribute-validation/validation-module.ts`: módulo orquestador (lectura para entender ciclo).
  - `opm-extracted/src/app/models/DrawnPart/OpmObject.ts`: render de objeto con alias/unidad inline (lectura).
- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §3.4 "Attribute": un atributo es una característica de un objeto representada como objeto exhibido vía característica. Caso especial: atributo numérico con slot de valor `[V-163]`.
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md` §V-163: notación visual `<nombre> [<unidad>] {<alias>}`.
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md`: oraciones canónicas para atributos. La oración `<Atributo> es <valor> [<Unidad>].` debe seguir la sintaxis OPL formal con conector "es".
- **Estado actual del código (post-ronda-11)**:
  - `app/src/modelo/tipos/entidad.ts`: ya tiene `alias?`, `unidad?`, `descripcion?`, `urls?`, `imagen?`. **L2 agrega `valorSlot?` y `esAtributo?`** aditivos.
  - `app/src/opl/generadores/estructural.ts`: tiene oraciones para `agregacion/exhibicion/generalizacion/clasificacion`. **L2 agrega caso "atributo numérico → es valor [unidad]"**.
  - `app/src/opl/generadores/refinamiento.ts:`: tiene "exhibe" como verbo. L2 NO toca este archivo (refinamiento es para OPDs, no oraciones de atributo en línea).
  - `app/src/modelo/operaciones/entidad.ts`: ya tiene `renombrarEntidad`, `validarNombreEntidad` (ronda 11 L5). **L2 extiende con `crearAtributoEnObjeto` y `asignarValorAtributo`**.
  - `app/src/ui/inspector/`: ya tiene `SeccionDescripcion`, `SeccionEstilo`, `SeccionTamano`, `SeccionImagen`, etc. **L2 agrega `SeccionAtributo` nueva**.
  - `app/src/ui/InspectorEntidad.tsx`: ya monta secciones por tipo. **L2 monta `SeccionAtributo` cuando `entidad.esAtributo === true`**.

## 4. Archivos permitidos

```text
app/src/modelo/tipos/entidad.ts                    EDIT aditivo (TipoValorSlot, ValorSlot, Entidad.valorSlot?, Entidad.esAtributo?)
app/src/modelo/tipos/opl.ts                        EDIT aditivo (TokenValor, TokenUnidad opcionales)
app/src/modelo/operaciones/entidad.ts              EDIT extiende (crearAtributoEnObjeto, asignarValorAtributo, parseo nombre+unidad)
app/src/modelo/operaciones/entidad.test.ts         EDIT aditivo
app/src/modelo/validadores/valorSlot.ts            NUEVO (valida valor por tipo: integer/float/char/string)
app/src/modelo/validadores/valorSlot.test.ts       NUEVO
app/src/modelo/operaciones.ts                      EDIT aditivo (re-export crearAtributoEnObjeto, asignarValorAtributo)
app/src/opl/generadores/estructural.ts             EDIT aditivo (oración atributo numérico)
app/src/opl/generadores/estructural.test.ts        EDIT aditivo (test HU-17.016)
app/src/render/jointjs/composer*.ts                EDIT aditivo (sintaxis compuesta nombre+unidad+alias en label)
app/src/store/tipos.ts                             EDIT aditivo (3 acciones nuevas)
app/src/store/modelo/acciones-entidad.ts           EDIT extiende (asignarValorAtributoSeleccionado, crearAtributoEnObjetoSeleccionado)
app/src/ui/inspector/SeccionAtributo.tsx           NUEVO (tipo + unidad + valor concreto + placeholder)
app/src/ui/inspector/inspectorStyles.ts            EDIT aditivo si se requiere para la nueva sección
app/src/ui/InspectorEntidad.tsx                    EDIT aditivo (montar SeccionAtributo cuando esAtributo)
app/src/ui/Toolbar.tsx                             EDIT aditivo (botón "Crear atributo numérico" con drag)
app/src/persistencia/local.test.ts                 EDIT aditivo (roundtrip JSON con valorSlot/esAtributo)
app/e2e/opm-smoke.spec.ts                          EDIT aditivo (~3 smokes valor numérico)
opm-extracted/**                                   LECTURA
docs/HANDOFF.md                                    LECTURA
docs/historias-usuario-v2/**                       LECTURA
docs/JOYAS.md                                      LECTURA
assets/svg/**                                      LECTURA
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones de no-colisión

- **No tocar `acciones-canvas.ts`** (territorio L1 multi-al-todo + L3 traer + L4 plantillas).
- **No tocar `acciones-ui.ts`** (territorio L1 read-only redirect + L3 abrir traer + L4 abrir plantillas).
- **No tocar `MenuPrincipal.tsx`** (territorio L4 plantillas).
- **No tocar `MenuContextualEntidad.tsx`** (territorio L3, archivo nuevo).
- **No tocar `Dialogo*.tsx` excepto los del repo previo** (territorio L1/L3/L4).
- **No tocar `canvas/operacionesBatch.ts`** (territorio L3 + L4).
- **No tocar `progress-dashboard.mjs`** (territorio L5).
- **`tipos/entidad.ts`**: solo L2 toca (aditivos `valorSlot?`, `esAtributo?`).
- **`opl/generadores/estructural.ts`**: solo L2 toca. Si L1 necesita HU-11.012, lo hace en `RenombradoInline.tsx` y `acciones-enlace.ts`, no aquí.
- **`Toolbar.tsx`**: L2 (botón crear atributo numérico), L1 (indicador modo sticky), L3 (botón traer conectados), L4 (botón plantillas). Hunks disjuntos por sección JSX.
- **`InspectorEntidad.tsx`**: solo L2 toca para montar `SeccionAtributo`. L1 NO toca (HU-10.004 va a `SeccionDescripcion` directamente).

## 6. Comportamiento esperado

- **Entidad como atributo numérico**:
  - Se crea via `crearAtributoEnObjeto(modelo, opdId, objetoPadreId, "Temperatura", { tipo: "float", unidad: "°C" })`.
  - Resultado: nueva entidad con `nombre="Temperatura"`, `unidad="°C"`, `esAtributo=true`, `valorSlot={ tipo: "float", placeholder: "value" }` + enlace `exhibicion(objetoPadre, atributo)` + apariencias.
- **Sintaxis compuesta render** (HU-17.012):
  - Si `unidad` y `alias`, label = `Temperatura [°C] {T}`.
  - Si solo `unidad`, label = `Temperatura [°C]`.
  - Si solo `alias`, label = `Temperatura {T}` (ronda 7 vigente).
  - Si nada, label = `Temperatura`.
- **OPL canónica** (HU-17.016):
  - Sin valor: `Temperatura es valor [°C].`
  - Con valor: `Temperatura es 25 [°C].` (entero) / `Temperatura es 25.5 [°C].` (float).
  - Sin unidad: `Temperatura es valor.` o `Temperatura es 25.`
- **Asignar valor** (HU-17.017):
  - Acción `asignarValorAtributoSeleccionado(valor)` desde `SeccionAtributo`.
  - Validación: si `tipo === "integer"` rechaza no-enteros con mensaje "El atributo es entero; usa un número entero.".
  - Si `tipo === "char"` requiere `value.length === 1`.
  - Si valor inválido, no commit; mensaje en panel de avisos.
- **Distinguir atributo numérico** (HU-17.014):
  - `Entidad.esAtributo === true` + `valorSlot.tipo` distingue numérico de objeto/texto.
  - En árbol OPD y biblioteca de cosas, atributos pueden tener icono distinto (variante de `assets/svg/object.svg` con badge numérico). **Decisión**: no agregar icono nuevo en ronda 12; render como objeto normal con sintaxis compuesta.
- **Parseo automático nombre+unidad** (HU-17.011):
  - En `editarNombreEntidad`, si el nuevo nombre matchea `^(.+?) \[(.+?)\]$`, se parsea: `nombre = match[1]`, `unidad = match[2]`. Idempotente.
  - Permitir desactivar parsing si el operador escapa los corchetes (raro, no en MVP-β temprano).

## 7. Pruebas requeridas

**Unit tests**:

- `entidad.test.ts`: `crearAtributoEnObjeto` crea entidad atributo + enlace exhibición + apariencias atómicamente.
- `entidad.test.ts`: `asignarValorAtributo` con valor válido commit; con valor inválido falla con mensaje específico.
- `entidad.test.ts`: parseo automático `Temperatura [°C]` extrae unidad. Idempotente al reaplicar.
- `validadores/valorSlot.test.ts`: `validarValorSlot(tipo, valor)` retorna ok/fallo por tipo (integer/float/char/string).
- `opl/generadores/estructural.test.ts`: HU-17.016 oración `Atributo es valor [Unidad].` con placeholder; oración con valor; oración sin unidad.
- `persistencia/local.test.ts`: roundtrip JSON con `valorSlot` y `esAtributo` lossless.

**Smoke browser** (`app/e2e/opm-smoke.spec.ts`), ~3 nuevos:

- "HU-17.013/.015/.016: crear atributo numérico desde Toolbar emite oración OPL `Atributo es valor [Unidad].`": click sobre objeto, botón "+ Atributo" en Toolbar, modal pide nombre `Temperatura [°C]` + tipo `float`, confirma, verifica entidad atributo + enlace exhibición + oración OPL.
- "HU-17.012: render de objeto con unidad y alias muestra `Nombre [Unidad] {alias}`": editar entidad con unidad y alias, verificar label canvas = sintaxis compuesta.
- "HU-17.017: asignar valor concreto al slot reemplaza placeholder en OPL": en SeccionAtributo, ingresar `25`, verificar OPL `Temperatura es 25 [°C].`.

**Detector**: L2 declara las reglas siguientes para consolidación L5 (~5 reglas):

- HU-17.011/.012: regla agrupada `app/src/modelo/operaciones/entidad.ts` string `unidad` parseo + `app/src/render/jointjs/composer*.ts` sintaxis compuesta.
- HU-17.013: `app/src/modelo/operaciones/entidad.ts` string `crearAtributoEnObjeto` + `app/src/store/modelo/acciones-entidad.ts` string `crearAtributoEnObjetoSeleccionado`.
- HU-17.014: `app/src/modelo/tipos/entidad.ts` string `esAtributo`.
- HU-17.015: `app/src/modelo/tipos/entidad.ts` strings `valorSlot`, `TipoValorSlot`, `ValorSlot`.
- HU-17.016/.017: regla agrupada `app/src/opl/generadores/estructural.ts` string `es valor` + `app/src/store/modelo/acciones-entidad.ts` string `asignarValorAtributo`.

## 8. Métricas esperadas

- **Tests aditivos**: ~14 unit + 3 smokes nuevos.
- **HU cerradas L2**: 7 HU pendientes → cubiertas.
- **Reglas detector ronda 12 que esta línea aporta**: ~5 reglas nuevas.
- **Build**: chunk principal + ~3-5 KB (`SeccionAtributo` + validadores + composer extendido). Razonable.
- **Smoke browser**: 72 → ~75 (independiente de L1).

## 9. Loop verde y commits

```bash
cd app
bun run check          # 624 → ~638 unit
bun run browser:smoke  # 72 → 75
bun run build          # main chunk objetivo < 190 KB / < 52 KB gzip
```

Commits sugeridos (orden):

1. `feat(modelo): TipoValorSlot, ValorSlot, Entidad.valorSlot?/esAtributo? aditivos (HU-17.014/.015)`
2. `feat(modelo): validador valorSlot por tipo integer/float/char/string`
3. `feat(operaciones): crearAtributoEnObjeto + parseo nombre [unidad] (HU-17.011/.013)`
4. `feat(opl): oración Atributo es valor [Unidad] canónica (HU-17.016)`
5. `feat(render): sintaxis compuesta Nombre [Unidad] {alias} en canvas (HU-17.012)`
6. `feat(inspector): SeccionAtributo con tipo + unidad + valor (HU-17.017)`
7. `feat(toolbar): botón Crear atributo numérico drag (HU-17.013 UI)`
8. `test(persistencia): roundtrip lossless con valorSlot/esAtributo (HU-30.008 reforzado)`
9. `test(e2e): smokes valor numérico L2 (~3 nuevos)`

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **`valorSlot` rompe roundtrip JSON pre-ronda-12**: si el serializador no maneja el campo opcional, JSON viejo no carga. | Campo opcional aditivo (`?:`); validador acepta ausencia. Tests roundtrip explícitos con JSON pre-ronda-12 + JSON post-ronda-12. |
| **Parseo automático `Temperatura [°C]` interfiere con nombres legítimos que tienen corchetes**: si alguien quiere literal `Tipo [especial]` como nombre. | Parseo idempotente: si ya hay `Entidad.unidad`, ignora corchetes en nombre. Permitir escape vía caracter `\[`. Documentar comportamiento. |
| **`esAtributo` flag puede desincronizarse del enlace exhibición**: si el operador elimina el enlace pero el flag queda `true`. | `esAtributoDerivado` lente verifica enlaces exhibición entrantes; en `editarEnlace`/`eliminarEnlace`, si el último enlace exhibición a la entidad se elimina, set `esAtributo = false` automáticamente. Test cubre. |
| **OPL para atributo numérico choca con OPL existente "exhibe"**: una entidad atributo tiene enlace exhibición + ahora oración propia "es valor". | El generador `estructural.ts` para enlace exhibición sigue emitiendo `Objeto exhibe Atributo.`; el generador nuevo emite adicionalmente `Atributo es valor [Unidad].` por la entidad atributo. Dos oraciones complementarias. Smoke verifica ambas. |
| **Validador `AttributeValue` de OPCloud trae stereotypes complejos**: copiarlo entero infla código. | Reuso semántico: tipos enum + función `validar(tipo, valor)` simple. Stereotypes diferidos a ronda futura. |
| **Sintaxis compuesta puede romper layout si label muy largo**: `Temperatura [°C] {T}` vs box 135×60 px. | Algoritmo `refactorText` ya existente (`docs/JOYAS.md §3`) reflowa. Si excede, font-size se reduce o caja crece. |
| **Botón Toolbar "+ Atributo" requiere objeto seleccionado**: si no hay selección, no aplica. | Botón disabled cuando no hay selección de tipo `objeto`; tooltip explica. Patrón ya usado para otros botones contextuales. |

## 11. Salida esperada

Al cierre de L2, el operador debe poder:

- Crear atributo numérico sobre un objeto con un solo gesto (Toolbar + nombre + tipo).
- Ver el atributo renderizado con sintaxis compuesta `Nombre [Unidad] {alias}`.
- Leer en panel OPL la oración canónica `Temperatura es valor [°C].` o `Temperatura es 25 [°C].`.
- Asignar un valor concreto al slot desde inspector.
- Distinguir atributo numérico de atributo objeto en el inspector.
- Cargar y guardar modelos con atributos numéricos sin perder datos.

**MVP-β fase kernel-aditivo iniciada**. EPICA-17 cierra al menos 7/30 HU canónicas, dejando el camino abierto para HU-17.018..023 (URLs tipadas) y HU-17.027..029 (rasgos / múltiples apariencias) en rondas futuras.
