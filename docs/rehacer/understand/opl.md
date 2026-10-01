# Dossier OPL — `app/src/opl`

Área: generación OPL-ES (forward), parser/planificador/aplicador inverso (reverse), tokens de interacción,
agrupación por OPD, panel derivado, edición inline, exportación Markdown y puente de contexto.
Autoridad normativa consultada: `urn:fxsl:kb:spec-forja-opl-es` v1.4.1
(`kora-knowledge/references/fxsl/spec-forja-opl-es/content.md`, 3136 líneas).
Método: lectura íntegra del código fuente del área, lectura dirigida de la spec (§1–§5, §8–§17, §19),
ejecución de la suite (`bun test src/opl`: 343 pass / 0 fail) y **6 sondas propias** (scripts en
`scratchpad/understand/probe*.test.ts`) que ejercitan roundtrip y auto-reparseo sobre casos borde.
Nada del repo fue editado.

---

## 0. Resumen ejecutivo

- **Qué es**: una lente derivada modelo→texto (OPL-ES con Markdown inline: `**objeto**`, `*proceso*`,
  `` `estado` ``) por OPD, con tokens tipados (`entidad|enlace|estado`) para hover/click/filtrado, y un
  canal reverse "honesto" texto→patches→modelo que nunca borra por ausencia.
- **Tamaño**: 6 882 líneas de fuente + 5 402 de tests + 668 de fixtures (25 archivos de test, 343 tests).
  El núcleo real (generadores + parser) son ~4 900 líneas; el resto es presentación, export y puente.
- **Lo mejor del área** (portar casi tal cual): el modelo de tokens/refs/hints (`interaccion.ts`), la
  separación pase canónico vs pase display (`panel.ts`), el contrato de diagnóstico + clasificación en 4
  estados (`clasificadorEdicion.ts`), la ley *safe-lens* (no borrar por ausencia, preview puro), el
  `PatchRegistry` con claves de identidad de hecho, el aplicador por fases, la verificación por inversa del
  orden de descomposición, y la familia por preestado (extensión declarada con parse/aplicación exactos).
- **Lo peor**: la simetría forward/reverse **no se cumple** en familias corrientes. Las sondas muestran que
  el generador emite oraciones que el propio parser rechaza o malinterpreta (AND agrupado, multiplicidad
  `+`/`*`/`N`, plurales, etiquetados, negación, abanico de instrumento divergente, duración, plegado ≤3
  partes, "se maneja con", vistas de sub-modelo). Como el store bloquea **toda** la aplicación ante un solo
  error (`acciones-canvas.ts:341-367`), el editor libre queda inutilizable en cualquier modelo realista.
- **Riesgo semántico grave**: el planificador identifica "qué entidad se renombró" **por número de línea**
  (`planificar.ts:34`). Insertar una línea nueva desplaza las posiciones y el preview propone renombrar
  entidades equivocadas (sonda 5: agregar `**Cliente**` arriba produce `Pedido→Cliente` y `Factura→Orden`).
  En régimen apunte la desalineación es sistemática (sonda 6: renombrar `*Proceso 2*` propone *crear* un
  proceso nuevo).
- **Acreción visible**: `DETECTOR_OPL_COMPAT` (lista de strings muerta para un detector por grep inexistente),
  hack `manejar/conducir` duplicado en dos archivos, `contextoSkill.ts` (gobernanza de anclas/ratificación en
  la capa OPL), exportaciones sin consumidor, dos órdenes de OPD distintos (BFS panel vs DFS export), rutas
  absolutas a `/home/felix/...` en comentarios, comentarios que citan rondas/bugs/fases.

---

## 1. Inventario de módulos

| Archivo | Líneas | Propósito | Consumidores externos | Veredicto |
|---|---:|---|---|---|
| `generar.ts` | 465 | Barrel/orquestador: recorre apariencias y enlaces del OPD, decide agrupaciones (abanico, transición, AND, exhibición opcional, instrumento "natural", familias) y produce `OplLineaPendiente[]`; `generarOpl` (strings) y `generarOplInteractivo` (tokens). | ~20 (UI, agent, autoria, server, mesa, tests) | **simplify** (núcleo; reescribir como pipeline declarativo) |
| `generadores/refsHints.ts` | 286 | Helpers: refs/hints, `nombreOpl*`, multiplicidad/plural, listas, emitibilidad (R-ENT-2), verbos para hint. | generadores | **simplify** (partir: naming vs refs) |
| `generadores/procedural.ts` | 498 | Oraciones procedimentales: T1–T3, TS1–TS5, H1/H2/HS, eventos, condiciones, negación, invocación, autoinvocación, excepciones, etiquetados, rutas, pares consumo+resultado → "cambia". | generar, abanico | **simplify** (núcleo, con ramas duplicadas) |
| `generadores/estructural.ts` | 97 | Clasificación esencia/afiliación (R-ENT-3), atributo-valor, agregación/exhibición/generalización/clasificación. | generar, render test | **keep** (+ agrupar destinos) |
| `generadores/abanico.ts` | 349 | Abanicos XOR/OR: forma directa/pasiva, estados agrupados (R-FAN-5), TS3 entrada común (R-FAN-5A), condición y evento. | generar | **simplify** |
| `generadores/refinamiento.ts` | 401 | Oraciones de descomposición/despliegue, orden temporal (`ordenInzoom` o geometría), refs/hints de refinamiento, código SD canónico. | generar, planificar, modelo helpers | **simplify** (cortar 3 funciones muertas) |
| `generadores/duracionMetadata.ts` | 70 | `puede estar`, designaciones, unidad, duración. | generar, designaciones | **simplify** (cortar 3 muertas; corregir duración) |
| `generadores/designaciones.ts` | 39 | Re-export + wrapper interactivo de estados. | generar | **cut** (fundir en duracionMetadata/estados) |
| `generadores/plegado.ts` | 24 | Plegado parcial "se lista con … como rasgos". | refinamiento, generar | **keep** (corregir reverse) |
| `generadores/composicionIntermodelo.ts` | 65 | Líneas para `submodel-view` y referencias externas. | generar | **marginal/simplify** |
| `opciones.ts` | 21 | `VisibilidadOpl {esencia, esApunte}` y default. | store, UI, config | **keep** |
| `interaccion.ts` | 144 | Tipos `OplReferencia/OplToken/OplLineaInteractiva/OplTokenHint`, tokenización por hints, filtro por ref. | UI, render JointJS, store, ports | **keep casi tal cual** |
| `bloquesJerarquicos.ts` | 94 | Agrupación por OPD, orden BFS de OPDs, profundidad, helpers de colapso. | UI, render (mapa, headless) | **keep** (unificar orden) |
| `panel.ts` | 130 | `derivarPanelOpl`: pase canónico + pase display + filtro/búsqueda + preview reverse; `derivarDeltaLineasOpl`. | VM del panel | **keep** (corregir alcance/régimen del preview) |
| `clasificadorEdicion.ts` | 256 | Clasificación de líneas (aplicable/no-aplicable/ignorada/sin-cambio), razones cerradas, rótulo del botón, descripción de patches. | UI editor | **keep casi tal cual** |
| `edicionCanvas.ts` | 69 | `IntencionEdicionOpl` (renombrar entidad/estado, etiqueta, abrir inspector). | store, ports | **simplify** (el store ya tiene acciones equivalentes) |
| `exportarMarkdown.ts` | 82 | Export Markdown por OPD y modelo completo; `opdsEnOrden` (DFS). | store, perfilesExport, bundle | **keep** (unificar orden) |
| `estructurado.ts` | 25 | `generarOplEstructurado/Texto` (bloques por OPD). | solo `scripts/generar-demos.ts` + test | **cut** (duplica exportarMarkdown) |
| `contextoSkill.ts` | 171 | Markdown "puente W6.0" para skill externa: procedencia, anclas `[RATIFICAR]`, notas de mesa, diagnóstico JSON, OPL. | store, mesa | **cut de opl/** (mover a `mesa/` o eliminar con esa capa) |
| `parser/index.ts` | 13 | Barrel público del parser. | varios | keep |
| `parser/tipos.ts` | 403 | AST (`OracionOplAst`, 14 kinds), `PatchOplPropuesto` (13 tipos), `DiagnosticoOpl`, preview. | autoria/compilar (emisor) | **keep/simplify** (contrato) |
| `parser/text.ts` | 199 | Normalización léxica: markdown, etiqueta `[etiqueta: …]`, ruta, multiplicidad prefija, clave de nombre, listas. | parsear, groups | **keep/simplify** |
| `parser/parsear.ts` | 955 | Cadena de ~15 reconocedores regex por familia → AST. | planificar, autoria (normalizador, emisor, resolutor, estructura) | **simplify** (derivar del generador) |
| `parser/groups.ts` | 344 | Reconocedores de abanicos y familia por preestado. | parsear | **simplify** (cortar formas prohibidas) |
| `parser/planificar.ts` | 1105 | AST → patches: resolución por nombre, heurística posicional de renombrado, idempotencia, orden in-zoom con verificación inversa, `PatchRegistry`. | panel, store | **simplify** (reemplazar identidad posicional) |
| `parser/aplicar.ts` | 577 | Patches → modelo en 4 fases vía operaciones del kernel. | store, tests | **keep/simplify** |
| `fixtures-roundtrip.ts` | 668 | Catálogo de fixtures bisimétricas. | roundtrip.test | keep (reescribir como tabla generada) |

Tests por archivo (cantidad de `test(`): `generar.test.ts` 82, `procedural.test.ts` 25, `parsear.test.ts` 20,
`parser.test.ts` 19, `parser.condicionesExcepciones.test.ts` 19, `clasificadorEdicion.test.ts` 17,
`abanico.test.ts` 16, `orden-inzoom.test.ts` 14, `contextoSkill.test.ts` 14, `parser.designacionesPlegado.test.ts` 13,
resto ≤11. Fuera del área: `leyes/opl-reverse.test.ts` (ley safe-lens), `leyes/invocacion-implicita-bimodal.test.ts`,
`leyes/manual-*.test.ts`, `autoria/compilar/*.test.ts`.

---

## 2. Arquitectura y flujos

### 2.1 Forward (modelo → OPL de un OPD) — `generar.ts:70-183`

Orden de emisión dentro de un OPD (determinista, pero dependiente del orden de inserción de claves en
`opd.apariencias` / `opd.enlaces`):

1. `generic-view` → `[]` (vista ad-hoc no crea hechos) — `generar.ts:76`.
2. Por cada **apariencia** (`generar.ts:81-126`):
   1. clasificación esencia/afiliación o atributo-valor (`estructural.ts:35-56`), si la cosa es emitible (R-ENT-2).
   2. enumeración de estados **visibles** en esa aparición (`¬suprimido global ∧ ¬suprimido local`,
      `generar.ts:95`), todo-o-nada (`generar.ts:97`).
   3. unidad, designaciones y duración de estados (`duracionMetadata.ts:17-31`).
   4. refinamiento: si la aparición está plegada parcialmente, una oración de plegado; si no, una por slot
      (`descomposicion`, `despliegue`) — `generar.ts:107-124`.
3. Líneas de sub-modelo (`composicionIntermodelo.ts:4`), sólo en `submodel-view`.
4. **Abanicos** del OPD (consumen sus enlaces) — `generar.ts:130-134`.
5. **Transiciones** consumo-desde-estado + resultado-a-estado del mismo par proceso/objeto → "cambia de/a"
   (`procedural.ts:79-131`, emparejamiento por `rutaEtiqueta` en `elegirResultadoParaPath:133-144`).
6. **Exhibición opcional agrupada** por exhibidor (`generar.ts:138-146`, 351-372).
7. **AND procedimental agrupado** por (tipo, sujeto) (`generar.ts:148-156`, 244-341).
8. Enlaces restantes, uno por `AparienciaEnlace`: transición, "instrumento natural", o
   `oracionEnlaceConRuta` (`generar.ts:158-174`).
9. **Familias de efectos por preestado** del OPD (`generar.ts:176-180`, 185-234).

La versión interactiva (`generarOplInteractivo:54-68`) envuelve cada línea con id `opl-${opdId}-${n}`
(posicional), ordinal, `opdId/opdNombre/opdProfundidad`, refs deduplicadas y tokens.

### 2.2 Panel — `panel.ts:71-121`

- `opds` = sólo el OPD activo si es "boceto suelto" sin vista; si no, todos en orden `ordenarOpdsParaOpl` (BFS).
- **Pase canónico**: esencia `siempre` + régimen `esApunte` ⇒ `textoOplActual` (lo que se carga al abrir el
  editor libre).
- **Pase display**: re-genera sólo si la preferencia de esencia difiere (`panel.ts:88-91`).
- Filtro por selección (ref de enlace tiene precedencia sobre entidad), búsqueda por substring minúsculas.
- Si el editor está abierto: `planificarEdicionOplLibre(modelo, textoLibre, {opdActivoId, opdIdsAlcance: opds})`
  en **cada tecla** (recalcula de nuevo todo el OPL dentro del planificador).
- `derivarDeltaLineasOpl`: diff por id posicional + texto para resaltar líneas cambiadas.

### 2.3 Reverse (texto → patches → modelo)

```
texto ─normalizarLineas─▶ LineaOplNormalizada[] ─parsearOracion (cadena de reconocedores)─▶ OracionOplAst[]
      ─planificarAst (+ línea "anterior" por posición)─▶ PatchOplPropuesto[] + DiagnosticoOpl[]
      ─clasificarEdicionOpl─▶ 4 estados por línea (UI)
      ─aplicarPatchesOpl (4 fases, fail-fast)─▶ Resultado<Modelo>
```

- Aplicación desde la UI: `store/modelo/acciones-canvas.ts:341-367` re-planifica (¡sin `opdIdsAlcance` ni
  `esApunte`!), **aborta todo si existe cualquier diagnóstico `error`**, y si no aplica todos los patches.
- Canal inline aparte (`edicionCanvas.ts`) para renombrar/etiquetar desde tokens; el store tiene además
  acciones directas equivalentes (`renombrarEntidadDesdeOpl`, `renombrarEstadoDesdeOpl`,
  `editarEtiquetaEnlaceDesdeOpl`, `abrirInspectorEnlaceDesdeOpl`) que no pasan por `aplicarEdicionOpl`.

### 2.4 Export

- `exportarOplOpdMarkdown` / `exportarOplModeloMarkdown` (`exportarMarkdown.ts:26-47`): `# modelo — OPD`,
  cita de alcance, viñetas `- oración`. Orden de OPDs **DFS** (`opdsEnOrden:50`), distinto del panel (BFS).
- `generarOplTexto` (`estructurado.ts:23`): texto plano, orden BFS; sólo lo usa `scripts/generar-demos.ts`.
- `exportarContextoSkill` (`contextoSkill.ts:20`): documento de contexto para una skill externa.

---

## 3. Contratos de datos (a respetar o migrar)

### 3.1 Tokens de interacción (`interaccion.ts:3-35`) — contrato con UI, render JointJS, store y ports

```ts
export type OplReferencia =
  | { tipo: "entidad"; id: Id }
  | { tipo: "enlace"; id: Id }
  | { tipo: "estado"; id: Id };

export interface OplToken {
  id: string;
  texto: string;
  rol: "texto" | "nombre" | "verbo" | "estado";
  ref?: OplReferencia;
  markdown?: "objeto" | "proceso" | "estado";
}

export interface OplLineaInteractiva {
  id: string;            // `opl-${opdId}-${ordinal}` (posicional, no estable ante inserciones)
  texto: string;
  ordinal: number;
  opdId?: Id; opdNombre?: string; opdProfundidad?: number;
  refs: OplReferencia[]; // únicas por tipo:id, orden de 1ª aparición
  tokens: OplToken[];
}

export interface OplTokenHint {
  texto: string; ref: OplReferencia;
  rol: Exclude<OplToken["rol"], "texto">;
  markdown?: OplToken["markdown"];
  alias?: string;        // no lo usa ningún generador
}
```

Semántica relevante: `tokenizarConHints` ubica cada hint con `indexOf` (todas las ocurrencias), ordena por
posición, gana el más largo en empate y descarta solapados. `referenciaEnlaceEspecifico(linea, pos)`
(`interaccion.ts:69-81`) resuelve el enlace de un token de entidad mirando la ref **inmediatamente previa**
en `linea.refs` — acopla la UI al orden interno `[enlace, origen, destino, …]` de `refsEnlace`
(`refsHints.ts:27-36`); para el destino la ref previa es el origen y devuelve `null`.

### 3.2 Opciones (`opciones.ts:9-21`)

```ts
export interface VisibilidadOpl {
  esencia: EsenciaVisibilidad;   // "siempre" | "solo-difiere" | "oculta" — DISPLAY
  esApunte?: boolean;            // RÉGIMEN: excepción de apunte a R-ENT-2
}
export const VISIBILIDAD_OPL_DEFAULT: VisibilidadOpl = { esencia: "siempre" };
```

Nota: `esencia` gobierna en realidad toda la oración de clasificación (esencia **y** afiliación).

### 3.3 AST del parser (`parser/tipos.ts:57-296`) — contrato con `autoria/compilar/emisor.ts` y `normalizador.ts`

14 variantes de `OracionOplAst` (todas con `linea` y `etiqueta?`):
`descripcion-cosa {nombre, tipoEntidad, esencia?, afiliacion?}` · `estados {objeto, estados[]}` ·
`procedimental {…AstProcedimentalBase}` · `evento {iniciador, iniciadorEstado?, proceso, base?}` ·
`estructural {tipoEnlace, origen, destinos[], multiplicidadDestino?}` ·
`contexto {familia, sujeto, bandasNombres?, ordenTemporalTexto?}` · `metadata {sujeto, campo: unidad|descripcion|valor, valor}` ·
`designacion-estado {entidad, estado, designacion}` · `plegado-parcial {entidad, partesExplicitas, partesElididas, rol}` ·
`condicion {proceso, condicionante, condicionanteEstado?, base, estadoSalida?, sinConsecuencia, rutaEtiqueta?}` ·
`abanico {proceso, operador, tipoEnlace, otros[], otrosEstados?, estadoEntradaComun?, puertoEsOrigen, modificador?}` ·
`excepcion {proceso, fuente, limite: {tipo:max|min, valor, unidad} | {tipo:minmax, min, max}}` ·
`familia-efectos-preestado {familiaId, cobertura, proceso, objeto, dominioEstados[], miembros[]}` · `unsupported {texto}`.

```ts
export interface AstProcedimentalBase {
  tipoEnlace: Extract<TipoEnlace, "agente" | "instrumento" | "consumo" | "resultado" | "efecto" | "invocacion">;
  proceso?: string; objeto?: string; origen?: string; destino?: string;
  estadoEntrada?: string; estadoSalida?: string;
  multiplicidadOrigen?: string; multiplicidadDestino?: string;
  rutaEtiqueta?: string; demora?: string;
}
```

Todos los extremos del AST son **nombres** (strings normalizados), nunca ids. En `abanico`, el campo
`proceso` guarda el **puerto común**, que puede ser un objeto (fuente del bug §8.4-b).

### 3.4 Patches (`parser/tipos.ts:304-397`)

```ts
export type ReferenciaEntidadPatch =
  | { tipo: "id"; id: Id }
  | { tipo: "nombre"; nombre: string; entidadTipo?: TipoEntidad };
```

13 tipos: `renombrar-entidad`, `cambiar-esencia`, `cambiar-afiliacion`, `crear-entidad {nombre, entidadTipo, esencia?, afiliacion?}`,
`sincronizar-estados {objeto: Ref, nombres[]}`, `renombrar-estado`, `crear-enlace {tipoEnlace, origen, destino, etiqueta?, modificador?,
tiempoMaximo?, unidadTiempoMaximo?, tiempoMinimo?, unidadTiempoMinimo?, estadoEntrada?, estadoSalida?, demora?, multiplicidadOrigen?,
multiplicidadDestino?, rutaEtiqueta?}` (también usado como "actualizar metadatos" idempotente), `fijar-etiqueta-enlace`,
`aplicar-designacion-estado`, `crear-refinamiento`, `set-orden-inzoom {opdId, ordenInzoom: Id[][]}`,
`crear-abanico {operador, tipoEnlace, procesoRef, procesoEsOrigen, ramas[{origen,destino,estadoEntrada?,estadoSalida?}], modificador?}`,
`crear-familia-efectos-preestado`. Todos llevan `linea` (usado por el clasificador).

### 3.5 Diagnósticos y clasificación

```ts
export interface DiagnosticoOpl {
  codigo: "syntax-error" | "unknown-symbol" | "ambiguous-symbol" | "type-mismatch"
        | "unsupported-kernel" | "no-delete-by-absence" | "patch-conflict";
  severidad: "info" | "warning" | "error"; linea: number; columna: number; // columna siempre 1
  mensaje: string; sugerencia?: string;
}
export type EstadoLineaOpl = "aplicable" | "no-aplicable" | "ignorada-vacia" | "sin-cambio";
export type RazonNoAplicable = "forma-no-reconocida" | "entidad-no-existe" | "cambio-ya-presente"
  | "referencia-ambigua" | "enlace-invalido-firma" | "inversa-no-soportada" | "conflicto-patches" | "puntuacion-faltante";
```

`type-mismatch` nunca se emite en el parser (la validación de firma ocurre al aplicar y aborta la cadena);
`cambio-ya-presente` no se produce nunca (una línea consistente cae en `sin-cambio`).

### 3.6 Edición inline (`edicionCanvas.ts:14-18`)

```ts
export type IntencionEdicionOpl =
  | { tipo: "renombrar-entidad"; id: Id; nombre: string }
  | { tipo: "renombrar-estado"; estadoId: Id; nombre: string }
  | { tipo: "fijar-etiqueta-enlace"; enlaceId: Id; etiqueta: string }
  | { tipo: "abrir-inspector-enlace"; enlaceId: Id };
```

### 3.7 Campos del modelo que el OPL lee (dependencia de `modelo/tipos`)

Entidad: `tipo, nombre, esencia, afiliacion, alias, unidad, valorSlot{valor}, refinamientos{descomposicion|despliegue:{opdId, modo?}}`.
Estado: `nombre, entidadId, suprimido, designaciones[], esInicial, esFinal, duracion{min,nominal,max,unidad}`.
Enlace: `tipo, origenId/destinoId {kind: entidad|estado, id, portId?}, etiqueta, backwardTag, multiplicidadOrigen/Destino,
modificador, probabilidad, demora, rutaEtiqueta, tiempoMaximo/Minimo + unidades, estadoEntradaId/estadoSalidaId (TS3 compacto),
efectoEscindido`. OPD: `nombre, padreId, ordenLocal, apariencias, enlaces, vista{generic-view|submodel-view|requirement-view}, ordenInzoom`.
Apariencia: `entidadId, x, y, width, height, modoPlegado, estadosSuprimidos`. Modelo: `abanicos{puertoComun, operador, enlaceIds}`,
`familiasEfectosPreestado`, `submodelos`. Tipos muertos en `modelo/tipos/opl.ts`: `TokenValor`, `TokenUnidad`
(sin uso), `BloqueOplEstado` (sólo re-exportado).

### 3.8 Formatos de salida (contrato con usuarios/documentos)

- Línea OPL = Markdown inline; sufijo de etiqueta de usuario `… [etiqueta: X]` (`procedural.ts:274-278`);
  prefijo de ruta `Por ruta L, …` (`procedural.ts:35`); probabilidad `` `Pr=0.3` `` (`procedural.ts:492-498`).
- Export modelo: `# {modelo}\n\n> Alcance: …\n\n## {OPD}\n\n- …`.

---

## 4. Catálogo de plantillas forward (español) por tipo de hecho

Notación: `P` proceso (`*P*`), `O` objeto (`**O**`), `s,e` estados, `L` lista `listarOpl` ("A, B y C"),
`Q` cuantificador (`exactamente uno de` XOR / `al menos uno de` OR), `Pr` sufijo `` `Pr=p` ``.

### 4.1 Cosas y estados

| Hecho | Plantilla emitida | Ubicación | Notas |
|---|---|---|---|
| Clasificación (R-ENT-3) | `O es un objeto {físico\|informacional} y {sistémico\|ambiental}.` / `P es un proceso …` | `estructural.ts:48` | `solo-difiere`: sólo dimensiones ≠ default (informacional/sistémica) → `O es un objeto físico.` (no parseable, §8); `oculta`: nada |
| Nombre con alias | `**O** {alias}` | `refsHints.ts:172-175` | alias nunca se aplica en reverse |
| Nombre con unidad | `**O [kg]**` | `refsHints.ts:206-210` | el parser borra `[…]` |
| Atributo con valor | `**Atr** es {valor}[ [u]].` (default "valor") | `estructural.ts:51-56` | spec: `**Atr** de **Obj** es valor.` |
| Unidad | `O tiene unidad \`u\`.` | `duracionMetadata.ts:21` | redundante con `[u]` en el nombre |
| Enumeración de estados (D5) | `O puede estar \`s1\` (inicial y final), \`s2\` (default) o \`s3\`.` | `duracionMetadata.ts:65-69, 37-40` | designaciones inline entre paréntesis |
| Designación (D7–D9, D13) | `Estado \`s\` de O es {inicial\|final\|Default\|Current}.` una por designación | `duracionMetadata.ts:33-34, 59-63` | spec: `por defecto`, `declarado \`Current\``, D10 combinada `inicial y final` en **una** oración |
| Duración de estado | `{min}, {nom}, y {max} {u} Duracion Minima, Esperada y Maxima de \`s\`, respectivamente.` | `duracionMetadata.ts:42-45` | sin tildes, coma de Oxford, sin verbo, sin reverse |

### 4.2 Transformadores y habilitadores (sin modificador)

| Hecho | Plantilla | Ubicación |
|---|---|---|
| T1 consumo | `P consume[n] O.` | `procedural.ts:226` |
| TS1 consumo desde estado | `P consume O en \`s\`.` | `procedural.ts:199,226` + `refsHints.ts:182-188` |
| T2 resultado | `P genera[n] O.` | `procedural.ts:228` |
| TS2 resultado a estado | `P genera O en \`s\`.` | `procedural.ts:46-48,228` |
| T3 efecto | `P afecta[n] O.` | `procedural.ts:458` |
| TS3 compacto (metadato en enlace) | `P cambia O de \`e\` a \`s\`.` · sólo entrada `P cambia O de \`e\`.` · sólo salida `P cambia O a \`s\`.` | `procedural.ts:412-433` |
| TS4 (estado→proceso) | `P cambia O de \`e\`.` | `procedural.ts:436-442` |
| TS5 (proceso→estado) | `P cambia O a \`s\`.` | `procedural.ts:443-449` |
| Par consumo-desde-estado + resultado-a-estado | `[Por ruta R, ]P cambia O de \`e\` a \`s\`.` | `procedural.ts:146-176` |
| H1/HS1 agente | `O[ en \`s\`] maneja[n] P.` | `procedural.ts:219` |
| H2/HS2 instrumento | `P requiere[n] O[ en \`s\`].` | `procedural.ts:223` |
| Instrumento "posesivo" (hack) | `**Coche** se maneja con **Volante**.` si el proceso empieza por `manejar`/`conducir` y hay efecto sobre un objeto | `procedural.ts:461-490` y **duplicado** `generar.ts:395-448` |
| AND agrupado (≥2 enlaces simples mismo tipo y sujeto) | `P requiere A y B.` · `P consume A y B.` · `P genera A y B.` · `P afecta A y B.` · `P invoca Q y R.` | `generar.ts:244-341` |
| Exhibición opcional agrupada | `O tiene A y B opcionales.` | `generar.ts:365-372` |

### 4.3 Modificadores

| Hecho | Plantilla | Ubicación |
|---|---|---|
| EH1 evento agente | `O inicia y maneja P[ Pr].` | `procedural.ts:291` |
| EH2 evento instrumento | `O inicia P, que requiere O[ Pr].` | `procedural.ts:293` |
| ET1/ETS1 evento consumo | `O[ en \`s\`] inicia P, que consume O[ en \`s\`][ Pr].` (dos ramas idénticas) | `procedural.ts:294-298` |
| ET2 evento efecto | `O inicia P, que afecta O[ Pr].` — **ignora estados TS3** | `procedural.ts:301-305` |
| Evento en par de transición (ETS2) | `O en \`e\` inicia P, que cambia O de \`e\` a \`s\`[ Pr].` | `procedural.ts:167-168` |
| Evento sobre resultado/invocación | degrada a la oración base (R-MOD-INPUT-2, R-IV-3) | `procedural.ts:299-309` |
| CH1/CS5 condición agente | `O maneja P si O {existe\|está en \`s\`}, de lo contrario P se omite.` | `procedural.ts:322-326` |
| CH2/CS6 condición instrumento | `P ocurre si O {existe\|está en \`s\`}, de lo contrario P se omite.` | `procedural.ts:327-331` |
| CT1 condición consumo | `P ocurre si O existe, en cuyo caso O se consume, de lo contrario P se omite.` | `procedural.ts:335` |
| CS1 condición consumo en estado | `P ocurre si O está en \`s\`, en cuyo caso P consume O en \`s\`, de lo contrario P se omite.` — viola R-COND-RAMA-2 (`se consume`) | `procedural.ts:334` |
| CS2/CS4/CT2 condición efecto | `P ocurre si O está en \`e\`, en cuyo caso P cambia O de \`e\` a \`s\`, …` · `… si O existe, en cuyo caso P cambia O a \`s\`, …` · `P ocurre si O existe, en cuyo caso P afecta O, …` | `procedural.ts:339-359` |
| Condición en par de transición | `P ocurre si O está en \`e\`, en cuyo caso P cambia O de \`e\` a \`s\`, de lo contrario P se omite.` | `procedural.ts:169-170` |
| Negación (modificador `no`) | `O no maneja P.` · `P no requiere O.` · `P no consume O.` · `P no genera O.` · `P no afecta O.` · par: `P no cambia O de \`e\` a \`s\`.` | `procedural.ts:367-400, 171-172` |

### 4.4 Invocación, excepción, etiquetados, rutas, etiqueta de usuario

| Hecho | Plantilla | Ubicación |
|---|---|---|
| IV1 | `P invoca[n] Q[ después de d].` | `procedural.ts:232` |
| IV2 | `P se invoca a sí mismo[ después de d].` | `procedural.ts:213-215` |
| EX1 | `M ocurre si duración de F excede {v u \| su duración máxima}.` | `procedural.ts:233-234, 244-259` |
| EX2 | `M ocurre si duración de F es menor que {v u \| su duración mínima}.` | `procedural.ts:235-236` |
| EX combinada | `M ocurre si duración de F es menor que {min} o excede {max}.` | `procedural.ts:237-238` |
| Etiquetado unidireccional | `O {tag} D.` / `O se relaciona con D.` | `procedural.ts:266-268` |
| Etiquetado bidireccional | `O {tag} D, y D {backTag} O.` / `O y D son {tag}.` / `O y D se relacionan.` | `procedural.ts:269-271` |
| Ruta | `Por ruta L, {oración procedimental}` | `procedural.ts:31-36` |
| Etiqueta de usuario | `{oración} [etiqueta: X]` | `procedural.ts:274-278` |

### 4.5 Estructurales

| Hecho | Plantilla | Ubicación |
|---|---|---|
| RF1 agregación | `O consta[n] de P.` — **una oración por enlace**, nunca lista | `estructural.ts:69` |
| RF2 exhibición | `O exhibe[n] A.` · opcional `O tiene un A opcional.` | `estructural.ts:70-74` |
| RF3 generalización | `E es un G.` / `Es son G.` | `estructural.ts:76` |
| RF4 clasificación | `I es una instancia de C.` / `Is son instancias de C.` | `estructural.ts:78` |

### 4.6 Multiplicidad (`refsHints.ts:190-204, 241-253`)

| Valor | Emisión | Plural del sustantivo / verbo |
|---|---|---|
| `?`, `0..1` | `un **X** opcional` (siempre masculino) | no |
| `+`, `1..*`, `1..N` | `al menos un **X**` | no |
| `*`, `0..*` | `**Xs**` (sin marca; spec pide `opcional (cero o más)`) | sí |
| `N` | `N **Xs**` (glifo crudo) | sí |
| `2` | `2 **Xs**` | sí |
| `2..*`, `2..N` | `2..* **X**` (glifo crudo, singular — bug de `multiplicidadPlural`) | no (debería) |
| `1..5` | `1..5 **Xs**` | sí |

Pluralización ingenua: `z→ces`, vocal→`s`, consonante→`es` (`refsHints.ts:235-239`). La multiplicidad también
se aplica al proceso (contra R-MULT-1A) y cambia la concordancia del verbo.

### 4.7 Abanicos XOR/OR (`abanico.ts`)

| Caso | Plantilla | Ubicación |
|---|---|---|
| Consumo convergente | `P consume Q A y B.` | `abanico.ts:139-142` |
| Consumo divergente (objeto común) | `O es consumido por Q P1 y P2.` | idem |
| Resultado divergente / convergente | `P genera Q A y B.` / `O es generado por Q P1 y P2.` | `abanico.ts:143-146` |
| Instrumento convergente / divergente | `P requiere Q A y B.` / `O es requerido por Q P1 y P2.` | `abanico.ts:135-138` |
| Agente | `O maneja Q P1 y P2.` / `P es manejado por Q A y B.` | `abanico.ts:131-134` |
| Invocación | `P invoca Q R1 y R2.` / `R es invocado por Q P1 y P2.` | `abanico.ts:155-158` |
| Efecto objeto común ↔ procesos | `O es afectado por Q P1 y P2.` · evento: `O inicia Q P1 y P2, y es afectado por el proceso que ocurre.` · condición: `Q P1 y P2 ocurre si O existe, en cuyo caso afecta O, de lo contrario se omite.` (capitalizado) | `abanico.ts:116-124` |
| Efecto proceso común | `P afecta Q A y B.` | `abanico.ts:147-154` |
| Estados agrupados (R-FAN-5) | `P cambia O a Q \`s1\` y \`s2\`.` / `P cambia O de Q \`s1\` y \`s2\`.` | `abanico.ts:273-310` |
| TS3 entrada común (R-FAN-5A) | `P cambia O de \`e\` a Q \`s1\` y \`s2\`.`; si no representable ⇒ **`throw`** | `abanico.ts:61-73, 164-219` |
| Condición (todas las ramas `c`, mismo tipo) | instrumento: `P ocurre si Q A y B existe, de lo contrario P se omite.` / `Q P1 y P2 ocurre si O existe, de lo contrario se omite.` (minúscula inicial); consumo: `P ocurre si Q A y B existe, en cuyo caso P consume A y B, …`; agente; efecto | `abanico.ts:241-271` |
| Rama con probabilidad (sólo XOR) | `A \`Pr=0.3\`` | `abanico.ts:340-349` |
| Con rutas (sin TS3) | se abandona el abanico y se emite una oración por enlace | `abanico.ts:20-25` |
| Dedupe a 1 extremo | oración individual del primer enlace | `abanico.ts:97-99` |

Evento en abanicos que no son efecto: **se descarta silenciosamente** (sonda: fan XOR de consumo con `e` emite
el mismo texto que sin `e`).

### 4.8 Refinamiento, plegado, vistas, familias

| Hecho | Plantilla | Ubicación |
|---|---|---|
| Descomposición de proceso | `P se descompone en P1, paralelo P2 y P3 y P4, en esa secuencia, así como O1.` | `refinamiento.ts:82-103, 249-308` |
| Descomposición de objeto | `O se descompone en A y B en esa secuencia, así como P1.` | `refinamiento.ts:89-94` |
| Despliegue | agregación `O se despliega en L.` · exhibición `O exhibe L.` · generalización `L es un/son O.` · clasificación `L es una instancia/son instancias de O.` (sin miembros: código `SD1.2`) | `refinamiento.ts:72-80, 365-382` |
| Plegado parcial | `O se lista con A, B y C y N partes más como rasgos.` / `O se lista con A y B como rasgos.` | `plegado.ts:11-23` |
| Vista de sub-modelo | `SD1 es una vista de sub-modelo de X.` · `SD1 referencia el sub-modelo X desde SD.` · `O en SD1 es referencia externa a O' del modelo propietario M.` | `composicionIntermodelo.ts:12-50` |
| Familia por preestado (extensión declarada) | `[Extensión declarada: F] La familia {total\|parcial} indexada por preestado de P sobre O tiene dominio {\`a\`; \`b\`} y comprende \`a\` —ruta \`r\`→ \`b\`; …; exactamente un miembro aplica para el preestado real.` | `generar.ts:185-234` |

---

## 5. Parser inverso

### 5.1 Normalización léxica (`parser/text.ts`)

- Línea: quita numeración `1.`/`1)`/`-`/`•`, extrae sufijo `[etiqueta: X]` (`text.ts:5,115-127`), quita markdown
  (`**…**`, `*…*`, `` `…` ``). Se conservan tres versiones: texto limpio, texto "marcado" (con backticks, para
  desambiguar `de`/`a` en TS3, `text.ts:144-149`) y original (para la ruta, `text.ts:136-141`).
- Exige punto final salvo que haya etiqueta (`parsear.ts:20`).
- `normalizarNombreOpl` (`text.ts:98-106`): quita multiplicidad prefija numérica/`*`, `Pr=`, **cualquier `[…]`
  y `{…}`** (unidad y alias se pierden). `claveNombre` (`text.ts:108-113`): sin diacríticos, minúsculas.
- Multiplicidad prefija (`text.ts:17`): `\d+(..\d+|N|*)?`, `N`, `+`, `*`, `un X opcional(es)`, `una X opcional(es)`.
  **No** reconoce `al menos un X` ni despluraliza.
- Ruta (`text.ts:27-47`): `Por ruta L, …`; admite etiqueta con backticks o con comas internas buscando la
  primera coma seguida de un sujeto marcado en Markdown.

### 5.2 Cadena de reconocedores (precedencia, `parsear.ts:45-83`)

1. prefijo `Por ruta` → recursión y `aplicarRutaAlAst` (sólo procedimental, evento con base, condición).
2. `parsearFamiliaEfectosPreestado` (sobre texto marcado; `groups.ts:22-58`).
3. `parsearDescripcion`: `^(.+?) es un (objeto|proceso) (físic[oa]|informacional) y (sistémic[oa]|ambiental)$` (`parsear.ts:108-123`).
4. `parsearClasificacionRasgo` (D1–D4): `X es física|informacional|sistémica|ambiental`; tipo inferido del Markdown (`parsear.ts:132-156`).
5. `parsearEstados`: `X puede estar a, b o c` (`parsear.ts:158-171`); quita `(…)` de cada estado.
6. `parsearAbanicoEvento`: `O inicia Q L, y es afectado por el proceso que ocurre` y legacy `que afecta al proceso que ocurre` (`groups.ts:104-122`).
7. `parsearEvento`: `X inicia y maneja Y`, `X inicia e invoca Y` (forma prohibida por R-IV-3), `X [en s] inicia Y[, que <sub>]`
   con sub-cláusulas consume/genera/requiere/afecta/cambia de-a/de/a/maneja/invoca (`parsear.ts:394-548`). Descarta `Pr`.
8. `parsearExcepcion`: combinada, sobretiempo, subtiempo (`parsear.ts:177-218`); exige valor numérico (el respaldo
   "su duración máxima" no se reconoce).
9. `parsearAbanico` (antes de condición/procedimental): resultado-condicional `puede generarse` e invocación-condicional
   `invoca Q L si P ocurre` (ambas prohibidas por R-MOD-INPUT-2 / R-MOD-CAT-1 y nunca emitidas), condicional genérico,
   directo (`cambia … de \`e\` a Q`, `cambia … a|de Q`, `es afectado por Q`, legacy `afecta a Q`, tabla de 11 verbos activos/pasivos) (`groups.ts:97-313`).
10. `parsearCondicion`: `CONDICION_AGENTE_RE` y `CONDICION_OCURRE_RE` + clasificación de sub-cláusula (`se consume`,
    `consume`, `afecta`, `cambia de-a/de/a`) con verificación de que el proceso omitido coincide (`parsear.ts:245-360`).
11. `parsearProcedimental`: rechaza negación con `unsupported-kernel` **severidad error** (`parsear.ts:571-583`);
    autoinvocación; `consumen?`, `generan?`, `afectan?`, `cambia de-a/de/a` (marcado y limpio), `manejan?`, `requieren?`,
    `invocan? … [después de d]` (`parsear.ts:584-696`).
12. `parsearEstructural`: `consta[n] de`, `exhibe[n]`, `tiene un X opcional`, `tiene L opcionales`, `es un`, `son`,
    `es una instancia de`, `son instancias de` (`parsear.ts:707-725`). Listas por `,`/`y`.
13. `parsearDesignacionEstado`: canónica `Estado s de X es (inicial|final|default|current|por defecto|actual)` y legacy `X en s es …` (`parsear.ts:732-764`).
14. `parsearPlegadoParcial`: sólo la forma con `y N (partes|rasgos) más como …` (`parsear.ts:769-800`), informativa.
15. `parsearMetadata`: `tiene unidad`, `se describe como "…"` (nunca emitido), y **catch-all** `^(.+?) es (.+)$` → valor (`parsear.ts:802-810`).
16. `parsearContexto`: `se descompone en | se despliega en | se pliega en` + orden temporal (`parsear.ts:812-943`).
17. fallback `unsupported` + `syntax-error`.

El orden es frágil: la corrección depende de que regexes laxas (`^(.+?) consume (.+)$`, `^(.+?) es (.+)$`) no
capturen antes; hay comentarios que advierten "DEBE correr antes de …".

### 5.3 Planificación (`parser/planificar.ts`)

- Recalcula `lineasActuales` = OPL interactivo de todo el alcance **en régimen riguroso** (`planificar.ts:29-30`,
  no recibe `esApunte`) y toma `anterior = lineasActuales[ast.linea - 1]` (`:34`) — identidad **posicional**.
- Resolución de nombres global al modelo (no por OPD) con `claveNombre`, filtro opcional por tipo; >1 candidato ⇒
  `ambiguous-symbol` (`planificar.ts:923-948`). Pendientes del mismo texto vía `PatchRegistry.refEntidadPendiente`
  (crear-entidad o renombrado previo, `:1023-1058`).
- Descripción: si el nombre no existe y la línea "anterior" refiere a una única entidad del mismo tipo ⇒
  **renombrado**; si no ⇒ crear (`planificar.ts:291-330`).
- Estados: crear/sincronizar si hay más nombres que estados; si no, renombrar por posición usando refs de la línea
  anterior (`:332-384`). Nunca borra estados.
- Enlaces: `buscarEnlace` por (tipo, entidad-origen, entidad-destino) **ignorando estados** (`:965-972`); si no
  existe ⇒ `crear-enlace`; si existe y trae modificador sin conflicto ⇒ `crear-enlace` con modificador; si trae
  multiplicidad/ruta/estado/demora ⇒ `crear-enlace` "idempotente" **aunque ya coincida** (fuente de patches
  fantasma); etiqueta distinta ⇒ `fijar-etiqueta-enlace` (`:493-582`).
- Abanico: N enlaces + `crear-abanico` **siempre**, aunque el abanico ya exista (`:657-740`).
- Contexto: crea refinamiento vacío si no existe (con info), o `set-orden-inzoom` con verificación por inversa
  (re-emite el orden y lo compara normalizado; `:168-249`) — pieza de alta calidad; pero emite el patch cuando
  `ordenInzoom` está ausente aunque el orden implícito coincida (patch fantasma).
- `no-delete-by-absence` (info) si hay menos líneas que las actuales (`:38-47`).
- `PatchRegistry.add` (`:987-1017`): clave de hecho por tipo (`patchKey:1067-1099`); fusiona `crear-entidad`
  escindido (G2); conflicto sólo si difieren más allá de `linea`.

### 5.4 Aplicación (`parser/aplicar.ts:33-68`)

Fases: (1) no-enlace: entidades (posición libre `posicionLibre`), esencia/afiliación, estados, designaciones,
refinamientos (`descomponerProceso`/`desplegarObjeto`), orden in-zoom; (2) enlaces y etiquetas: resuelve extremos
a estado según tipo (`resolverExtremosPatch:351-384`), reutiliza enlace existente (`buscarEnlaceCon:292-329`, con
regla especial para efecto TS3), autoinvocación, luego modificador/tiempos/demora/multiplicidad/ruta vía
operaciones validadas; (3) abanicos: fuerza un `portId` común `port-fan-opl-${linea}-${procesoId}` y llama
`formarAbanico`; (4) familias por preestado (exige TS3 y ruta exactos; conflicto si difiere). Fail-fast.
Tres resolvedores de nombre casi idénticos (`resolverRef`, `resolverRefSinCreadas`, y `resolverRefId` en el
planificador).

---

## 6. Simetría forward/reverse — matriz observada

Leyenda: **✔** roundtrip estricto desde modelo vacío y auto-reparseo con 0 patches · **≈** reparsea sin error
pero pierde información o produce patch fantasma · **✘** el propio texto generado produce `error` ·
**⚠** mal-parseo silencioso (AST equivocado sin error).

| Familia | Estado | Evidencia |
|---|---|---|
| Clasificación, estados (sin designación), T1/T2/T3, H1/H2, RF1–RF4 binarias, IV1/IV2 con demora, evento consumo | ✔ | `fixtures-roundtrip.ts` (23 fixtures) |
| TS3 compacto, TS4/TS5, par con ruta, HS, exhibición `0..1`, multiplicidad `2..*` | ≈ (roundtrip ok, **1 patch fantasma** al auto-reparsear) | sondas 1 |
| Condición TS3 / CT / CH | ✔ | sonda 1, tests |
| Evento sobre TS3 compacto | ≈ **forward pierde los estados**: `**Puerta** inicia *Abrir*, que afecta **Puerta**.` | sonda 1 |
| Evento con probabilidad | ≈ `Pr` se pierde en reverse sin diagnóstico | sonda 1 |
| Designaciones | ≈ desde modelo vacío falla (`unknown-symbol`: no usa referencias pendientes); duplicación inline + oración | sondas 1–2 |
| Multiplicidad `+`/`1..*` (`al menos un X`) | ✘ `No existe la cosa 'al menos un Pedido'` | sonda 1 |
| Multiplicidad `*`, `N`, `2`, rangos (sustantivo pluralizado) | ✘ `No existe la cosa 'Pedidos'` | sonda 1 |
| AND agrupado `P consume A y B.` | ✘ `No existe la cosa 'Harina y Agua'` | sonda 1 |
| Etiquetado con tag `O usa D.` / `se relaciona con` | ✘ `syntax-error` | sonda 1 |
| Negación (todas) | ✘ `unsupported-kernel` **error** (spec R-§19-SIM-2 pide warning) | sondas 1–2 |
| Abanico instrumento divergente `O es requerido por Q …` | ✘ el planificador busca el puerto como proceso | sonda 1 |
| Abanico condicional divergente (`exactamente uno de *A* y *B* ocurre si …`) | ✘ `syntax-error` | sonda 1 |
| Abanico XOR consumo (con/sin `c`) | ≈ roundtrip ok, `crear-abanico` fantasma en cada reparseo | sonda 1 |
| Abanico con evento (no efecto) | ≈ forward descarta el evento | sonda 1 |
| Unidad / alias | ≈ unidad → warning no aplicado; alias se pierde en silencio | sonda 1 |
| Duración de estado | ✘ `syntax-error` | sonda 3 |
| Plegado parcial con ≤3 partes | ✘ `syntax-error` | sonda 3 |
| Instrumento "se maneja con" | ⚠ agente `objeto:"Coche se" → proceso:"con Volante"` | sonda 3 |
| Vista sub-modelo / referencia externa | ⚠ `metadata valor` (warning) por el catch-all `X es Y` | sonda 3 |
| Descomposición | ≈ `set-orden-inzoom` fantasma cuando `ordenInzoom` ausente | sonda 2 |
| Clasificación `solo-difiere` (`O es un objeto físico.`) | ⚠ generalización con origen `"objeto físico"` | sonda 1 (sólo display; el canónico usa `siempre`) |
| Duplicado de apariencia en el mismo OPD | forward emite la oración dos veces | sonda 4 |

Consecuencia combinada: en cualquier modelo con, p. ej., dos consumos al mismo proceso o una multiplicidad `*`,
abrir el editor libre y cambiar una sola palabra produce ≥1 línea `no-aplicable` **no tocada**; el botón muestra
"Aplicar N cambios" pero `aplicarEdicionOplLibre` aborta con "OPL no aplicado: linea k" (`acciones-canvas.ts:344-347`).
Esto contradice R-OPL-FALLO-7 (partial-parse) y R-§19-SIM-1 (todo lo generado debe parsear sin error).

---

## 7. Casos borde (estado actual)

- **Familias por preestado** (`FamiliaEfectosPreestado`, extensión declarada): forward exige cada miembro TS3
  con entrada, salida y ruta; si falta cualquiera, la línea no se emite en silencio (`generar.ts:193-202`). Reverse
  exacto: `splitFamilyItems` respeta `;` dentro de backticks (`groups.ts:7-20`); el aplicador exige que los TS3 y
  rutas existan y compara la familia completa (`aplicar.ts:501-561`). Pieza cerrada y correcta; la oración es
  larga y "burocrática" pero legislada.
- **XOR/OR**: requiere puerto exacto compartido (`puertoExactoCompartidoDeAbanico`); el lado del puerto define
  voz activa/pasiva. Lista con conector `y` (spec usa `o`: "exactamente uno de **A**, **B** o **C**"). Probabilidad
  sólo en ramas XOR. TS3 no representable ⇒ `throw` dentro del generador puro (sin `try/catch` en panel/export/
  planificador): un abanico mal formado puede tumbar la lente completa.
- **Rutas**: prefijo `Por ruta L,`; empareja consumo/resultado del par sólo si ambas rutas coinciden; si un abanico
  tiene rutas se degrada a oraciones individuales; el parser admite etiquetas con comas o backticks.
- **Modificadores**: evento/condición sólo INPUT (degradación para resultado/invocación); negación forward sí,
  reverse no; `c`+`e` no se valida en OPL (depende del kernel). El parser todavía acepta `inicia e invoca`,
  `puede generarse` e `invoca … si … ocurre`, formas que la spec prohíbe construir.
- **Multiplicidad**: ver §4.6; pluralización morfológica ingenua; no hay concordancia de género; la spec pide prosa
  (`al menos una **Olla**`, `opcional (cero o más)`), no glifos.
- **Estados**: sólo los visibles en la aparición; enumeración todo-o-nada (pero `estadoOplEsEmitible` es sólo
  `!!estado`, así que R-ENT-2 de estados placeholder **no** está implementado: se emite `` `estado1` ``);
  designaciones duplicadas (inline + oración). Estados suprimidos se filtran dos veces (`generar.ts:95` y
  `duracionMetadata.ts:23,69`).
- **Refinamiento**: la pertenencia al in-zoom se decide por contención geométrica `dentroDe` (`refinamiento.ts:141-148`),
  mientras el modelo y el planificador usan `aparienciaEsInternaDeRefinamiento` (contexto explícito + geometría,
  `modelo/contextoRefinamiento.ts:78-88`). Dos definiciones de "interno". Orden temporal: `opd.ordenInzoom` o
  bandas por Y ±4px.
- **Régimen apunte**: el generador lo respeta; el planificador no (sonda 6).
- **Vistas**: `generic-view` no emite; `submodel-view` emite líneas propias no reversibles; `requirement-view` no tiene tratamiento.

---

## 8. Reglas OPM codificadas (catálogo con ubicación) — sagradas

Reglas de fondo OPM/ISO 19450 y de la spec que el código implementa hoy (preservar en la reescritura):

| Regla | Implementación | Ubicación |
|---|---|---|
| R-ENT-1: sólo objeto/proceso son cosas | tipos + markdown `**`/`*` | `refsHints.ts:206-210` |
| R-ENT-2: proceso placeholder no emite OPL canónica | `entidadOplEsEmitible` + `esNombreProcesoPlaceholder` | `refsHints.ts:212-218`; enlaces `:224-233` |
| R-ENT-2-APUNTE: en apunte sí emite (todas las superficies) | `esApunte` en `VisibilidadOpl` | `opciones.ts:19`, `generar.ts:79`, `panel.ts:83` |
| R-ENT-3: esencia+afiliación en una oración | `oracionEntidad` | `estructural.ts:35-49` |
| R-VERB-EST-1/2: estados con `puede estar`, nunca `puede ser` | `oracionEstados` | `duracionMetadata.ts:65-69` |
| R-ENT-EST-2 / R-ENT-ATR-2: estados sólo de objetos | `entidad.tipo === "objeto"` | `generar.ts:89` |
| Supresión local de estados por aparición (no borra del modelo) | `estadoVisibleEnAparicion` | `generar.ts:95` |
| Enumeración de estados todo-o-nada | condición | `generar.ts:97` |
| TS3/TS4/TS5 = `cambia … de … a` / `de` / `a` | `oracionEfecto`, `oracionTransicionEstados` | `procedural.ts:407-459, 146-176` |
| Par consumo(estado)+resultado(estado) del mismo objeto = transición; emparejamiento por ruta, sin reutilizar resultados | `transicionesEstadoBase`, `elegirResultadoParaPath` | `procedural.ts:79-144` |
| R-MOD-INPUT-2: resultado no porta `e`/`c` (degrada) | ramas `resultado` → `oracionEnlaceSinModificador` | `procedural.ts:299-300, 337-338` |
| R-MOD-CAT-1 / R-IV-3: invocación sin `e`/`c` (degrada) | ramas `invocacion` | `procedural.ts:306-307, 360-361` |
| R-MOD-NAT-2: condición ⇒ rama `de lo contrario P se omite`; evento ⇒ `inicia` | plantillas | `procedural.ts:313-365, 280-311` |
| R-COND-RAMA-2: consumo condicional con `se consume` | sólo sin estado | `procedural.ts:335` (violado en `:334`) |
| EX1/EX2: dirección de cota `excede` vs `es menor que`; respaldo sin cota | `formatoTiempo*` + `enlaceAdmiteTiempo*` | `procedural.ts:233-259` |
| IV1/IV2 + demora `después de` | | `procedural.ts:213-215, 232` |
| R-FAN-2: cuantificador en el extremo del fan; voz según lado del puerto | `oracionAbanico` | `abanico.ts:58-59, 130-161` |
| R-FAN-3: condición en fan sólo si **todas** las ramas son `c` y mismo tipo | `todosCondicionales && mismoTipo` | `abanico.ts:113-128` |
| R-FAN-4: fan efecto objeto común bajo evento | | `abanico.ts:116-119` |
| R-FAN-5: fan que difiere sólo por estado ⇒ `cambia O a/de Q s1, s2` | `oracionAbanicoEstados` | `abanico.ts:273-310` |
| R-FAN-5A/5B: TS3 entrada común; fail-closed; inversa por fact-set | | `abanico.ts:164-219`; `groups.ts:179-204`; `planificar.ts:671-706` |
| R-FAN-6: `Pr` sólo en ramas XOR | `nombreRamaAbanico` | `abanico.ts:340-349` |
| Dedupe de extremos de fan (no emitir "X y X") | | `abanico.ts:75-99` |
| R-COMB (efecto sin objeto común): "O es afectado por", nunca "O afecta a" | | `abanico.ts:116-124, 148-150`; legacy aceptado en parser `groups.ts:183-184` |
| Descomposición síncrona: orden declarado (`ordenInzoom`) > geometría; `paralelo` = anticadena; `en esa secuencia` | `describirProcesosTemporales`, `agruparPorOrdenInzoom` | `refinamiento.ts:249-296` |
| Despliegue por modo (agregación/exhibición/generalización/clasificación) | `modoDespliegue` | `refinamiento.ts:72-80, 109-126` |
| Plegado parcial es display (el reverse no muta) | info `unsupported-kernel` | `plegado.ts`, `parsear.ts:766-800`, `planificar.ts:80-83` |
| R-OPL-DISP / vista genérica no crea hechos | | `generar.ts:76` |
| OPL por OPD: cada OPD emite sus apariencias (hecho repetido por OPD es deliberado) | | `generar.ts:81` |
| R-OPL-EDIT-4 / R-§19-LENS-1: ausencia no borra | `no-delete-by-absence` | `planificar.ts:38-47` |
| R-§19-LENS-2: preview puro | planificador sin mutación | `planificar.ts:21-50` |
| R-OPL-EDIT-6: creación de enlace idempotente | `buscarEnlaceCon` | `aplicar.ts:175-186, 292-329` |
| R-OPL-FALLO-2: aplicación fail-fast | | `aplicar.ts:33-68` |
| R-OPL-FALLO-4/5/6: ambigüedad, inexistencia, conflicto ⇒ error | `resolverEntidad`, `PatchRegistry` | `planificar.ts:923-948, 987-1017` |
| Un objeto con estados necesita ≥2 estados | | `planificar.ts:340-349`, `aplicar.ts:412` |
| R-§19-CFG / R-OPL-CFG-2: esencia es display; canónico con `siempre` | dos pases | `panel.ts:80-91`, `exportarMarkdown.ts:29,42` |
| R-OPL-INT-1/2: tokens tipados, refs únicas | | `interaccion.ts:37-54, 134-144` |
| R-OPL-EDIT-1/2/3: 4 estados, rótulo honesto, razones cerradas | | `clasificadorEdicion.ts:78-222` |
| Familia por preestado: exactamente un miembro por preestado real; no es AND/XOR/OR | | `generar.ts:185-234`, `aplicar.ts:536-547` |

---

## 9. Divergencias código ↔ SSOT (`spec-forja-opl-es` v1.4.1)

1. **AND agrupado sin inversa** (`generar.ts:244-341`): R-FAN-1 (AND = una oración por enlace) y R-COMP-ZP-3
   (no emitir compuestas que el parser no descomponga). Se introdujo por BUG-923dcf/f897bc (paridad visual con OPCloud).
2. **Estructurales no agrupados** (`estructural.ts:69-78`): R-COMP-EJE-3 pide `**Auto** consta de **Motor**, **Chasis** y **Rueda**.`;
   la spec §9.6 afirma que `oracionEstructural` ya lo hace — no es cierto. Inversión exacta: se agrupa lo prohibido y no lo exigido.
3. **Multiplicidad**: R-MULT-1 prohíbe glifos crudos (`2..* **X**`, `N **Xs**`) y pide `opcional (cero o más)` para `*`,
   concordancia de género; R-MULT-1A prohíbe multiplicidad sobre procesos; el reverse (§10.3) debe reconstruir el rango.
4. **Designaciones**: `Default`/`Current` en inglés (spec: `por defecto`, `declarado \`Current\``); D10 debe ser una sola
   oración `inicial y final`; además la enumeración repite la designación inline.
5. **Atributo-valor**: spec `**Atributo** de **Objeto** es valor.`; código `**Atributo** es valor.`
6. **CS1**: rama positiva debe ser `**Objeto** se consume` (R-COND-RAMA-2), código `P consume O en \`s\``.
7. **ETS2 sobre TS3 compacto**: spec exige estados; código emite `inicia …, que afecta` (pérdida semántica en forward).
8. **Conector de abanico**: spec `exactamente uno de A, B o C`; código `… A y B`.
9. **Alternancia y/e, o/u** (R-VERB-KW-2): no implementada (`refsHints.ts:259-274`).
10. **R-ENT-2 para estados placeholder**: no implementado (`estadoOplEsEmitible` trivial, `refsHints.ts:220-222`).
11. **Vocabulario cerrado §1.1**: `se maneja con` no pertenece al enum (y sustituye la oración canónica H2).
12. **Negación**: reverse con severidad `error`, la spec (R-§19-SIM-2) pide `warning` para lo reconocible-no-aplicable.
13. **Parser acepta formas prohibidas** (`inicia e invoca`, `puede generarse`, `invoca … si … ocurre`): R-MOD-INPUT-2/R-MOD-CAT-1
    dicen "el parser NO DEBE construir…".
14. **Partial-parse** (R-OPL-FALLO-7): el store bloquea todo ante un error.
15. **Orden de OPDs** (R-OPL-DISP-2): panel BFS vs export DFS.
16. **Duración**: sin reverse, sin tildes, con coma de Oxford (R-COMP-EJE-1).

Observación de gobernanza: la spec está escrita *desde* el código (cita funciones y líneas "~253–287"); una
reescritura romperá sus "trazas a código" aunque no sus reglas R-*. Las reglas R-* son el contrato; las trazas son
informativas y deberán re-sincronizarse vía KORA (no editar la spec en este repo).

---

## 10. Olores de sobreingeniería y acreción (ejemplos concretos)

- **`DETECTOR_OPL_COMPAT`** (`generar.ts:456-465`): array de strings (`"maneja"`, `"[etiqueta:"`, nombres de funciones
  que ya no existen como `oracionDespliegue` en ese archivo) + `void` para mantenerlos vivos; ningún script lo lee. Lastre puro.
- **Hack léxico `manejar/conducir`** duplicado (`generar.ts:395-448` y `procedural.ts:461-490`): feature de circunstancia
  (BUG-bf4e25 "debería decir El coche se maneja con el volante"), hardcodea dos verbos, suprime la oración canónica del
  instrumento, fuera del vocabulario cerrado y mal-parseada en reverse. Ambas copias usan heurísticas distintas para
  encontrar el objeto afectado (una restringida al OPD, la otra a todo el modelo).
- **Dos "esMultiplicidadOpcional"** con semántica distinta: `generar.ts:450-452` incluye `0..*`; `estructural.ts:84-86` no.
- **Ramas muertas/duplicadas**: `oracionEvento` consumo con `if (estado) return X; return X;` (`procedural.ts:294-298`);
  `oracionProcedimentalParaRuta` re-implementa lo que `oracionEnlaceSinEtiqueta` ya produce (`procedural.ts:46-53`);
  `oracionTagged` alcanzable desde dos sitios (`:179-181` y `:195-197`); `transicionesEstado` vs `transicionesEstadoInteractivo`.
- **Exportaciones sin consumidor de producción**: `emitirDespliegueOcurren`, `emitirEspecializacion` (re-exportadas en
  `generar.ts:454`), `oracionesRefinamiento`, `oracionParalelo`, `oracionesAbanico`, `agregarEntidadInteractiva`,
  `oracionEnlaceEstructuralInteractivo`, `formatearAliasInline`, `formatearDescripcionInline`, `oracionDesignacionEstado`
  (wrapper de otro wrapper), `chevronEstadoBloque/togglearColapsoBloque/aplanarBloquesOpl` (sólo tests), `OplTokenHint.alias`,
  `extremoEntidad` mantenido con `void` (`planificar.ts:1105`), `estructurado.ts` completo.
- **Capas de indirección sin valor**: `designaciones.ts` re-exporta `duracionMetadata.ts` y envuelve una función con otra de
  firma idéntica; `endpointsProcedimentales` sólo delega a `endpointsBase`; `parser/index.ts` + re-export en `parsear.ts:12`.
- **Tres resolvedores de nombre** (planificador `resolverRefId`, aplicador `resolverRef` y `resolverRefSinCreadas`) y tres
  funciones `codigoOpd` (dos en OPL, más helpers de modelo).
- **Dos órdenes de OPD** (`bloquesJerarquicos.ts:67-82` BFS vs `exportarMarkdown.ts:50-82` DFS) con comparadores diferentes.
- **Parser gramaticalmente más ancho que el generador**: formas legacy/dictado (`X en s es inicial`, `por defecto`/`actual`,
  `se describe como "…"`, `afecta a Q`, `que afecta al proceso que ocurre`, `se pliega en`) sin productor; cada una exige
  regex y orden de precedencia. Algunas están prohibidas por la spec.
- **Catch-all `X es Y` → metadata valor** (`parsear.ts:807-808`): convierte cualquier línea con " es " en warning, ocultando errores reales.
- **Planificador recalcula todo el OPL en cada tecla** (`planificar.ts:29-30`) además del que ya calculó el panel; O(N·M) en resoluciones.
- **`crear-enlace` sobrecargado** como "crear o actualizar metadatos" → patches fantasma y clasificación engañosa.
- **Comentarios-burocracia**: "Ronda 26 / L6 B1", "Fase 1·U4", "W6.0 (acta mesa equilibrio, delib. 2)", "SELLO 4",
  "BUG-20260519T200211Z-62ee85", "JOYAS §1-3", "brief L2 ronda 20 §6", rutas `/home/felix/projects/deep-opm-pro/opm-extracted/…`
  (`generar.ts:45`, `refsHints.ts:12`, `duracionMetadata.ts:14`). Ruido de procedencia que no explica el *qué*.
- **`contextoSkill.ts`** en la capa OPL: compone procedencia (`protoHash`), anclas normativas `[RATIFICAR]` con autoridad/
  responsable, notas de mesa y diagnóstico JSON para una skill externa. Es gobernanza/metodología, no OPL.
- **Aviso UI desactualizado** y ejemplo de ayuda que viola la spec (`ui/panelOpl/EditorOplHonesto.tsx`): dice que eventos,
  condiciones y abanicos no son editables (sí lo son) y enseña `**Bomba** puede ser *encendida* o *apagada*.` (verbo
  prohibido, estados en itálica) que el parser rechaza.
- **Comentario falso en fixtures** ("default fisico+sistemico" para un objeto que sale informacional, `fixtures-roundtrip.ts:91`).

---

## 11. Defectos confirmados y plausibles (priorizados)

1. **CONFIRMADO — identidad posicional en renombrado** (`planificar.ts:34, 291-330, 370-383`): insertar una línea
   desplaza la correspondencia; el preview propone renombrar entidades distintas a las editadas (sonda 5).
2. **CONFIRMADO — el editor libre no aplica nada si hay un error en cualquier línea** (`acciones-canvas.ts:344-347`),
   combinado con ✘ de §6 en líneas no tocadas.
3. **CONFIRMADO — régimen apunte desalineado en el planificador** (`planificar.ts:29-30` sin `esApunte`; el store tampoco
   pasa `opdIdsAlcance`): renombrar un placeholder propone crear otra entidad (sonda 6).
4. **CONFIRMADO — el generador emite texto que el parser rechaza/malinterpreta** (§6: AND, multiplicidad, etiquetados,
   negación, fan instrumento divergente, fan condicional divergente, duración, plegado ≤3, "se maneja con", sub-modelo).
5. **CONFIRMADO — pérdida semántica forward**: evento sobre TS3 (estados), evento sobre abanicos no-efecto, probabilidad en reverse.
6. **CONFIRMADO — patches fantasma** (TS3/TS4-5/rutas/multiplicidad/abanicos/orden in-zoom) ⇒ "Aplicar N cambios" sin cambio real.
7. **CONFIRMADO — duplicación de oraciones** si una cosa tiene dos apariencias en el mismo OPD (sonda 4).
8. **CONFIRMADO — `multiplicidadPlural("2..*") === false`** (`refsHints.ts:247-250`).
9. **PLAUSIBLE — `throw` en `oracionAbanico`** (`abanico.ts:70-72`) no capturado por panel/planificador/export: un fan TS3
   heterogéneo puede romper toda la lente OPL.
10. **PLAUSIBLE — divergencia de pertenencia a in-zoom** (geometría en OPL vs contexto explícito en modelo/planificador).
11. **PLAUSIBLE — ids de línea posicionales** (`opl-${opdId}-${n}`): `derivarDeltaLineasOpl` marca como "cambiadas" todas las
    líneas posteriores a una inserción (el resaltado de delta pierde precisión).

---

## 12. Calidad del código

**Fortalezas (portar casi tal cual):**
- `interaccion.ts` completo: tipos mínimos, función pura de tokenización, filtros por ref. Único punto flojo:
  `referenciaEnlaceEspecifico` depende del orden de `refs`.
- Idea de dos pases canónico/display (`panel.ts`) y `derivarDeltaLineasOpl` (diff honesto por id+texto).
- `clasificadorEdicion.ts`: enum cerrado de estados y razones, resumen, rótulo del botón; puro y testeable.
- Ley safe-lens (sin borrado por ausencia, preview puro) y aplicador por fases sobre operaciones validadas del kernel.
- `PatchRegistry` con `patchKey` de identidad de hecho y fusión de dimensiones escindidas.
- `planificarOrdenInzoom` con verificación por inversa (rechaza en vez de corromper ante ambigüedad) y
  `parsearBandasOrden` (tokenizador explícito del doble rol de "y").
- Familia por preestado: extensión declarada con forward/reverse/aplicación exactos y fail-closed.
- `extractRoutePrefix`: resuelve comas dentro de etiquetas de ruta con un criterio explicable.
- Tipos discriminados completos (AST, patches, diagnósticos) y `Resultado<T>` en toda la cadena.

**Debilidades:**
- Forward y reverse son **dos gramáticas escritas a mano** (template strings vs ~60 regex) sin fuente común; la simetría
  se "espera" y sólo se verifica en 23 fixtures + tests de casos. Cada nueva plantilla exige tocar 3–4 archivos
  (generador, parser, planificador, aplicador) y ordenar regexes.
- Funciones largas con ramas por tipo × modificador × estado × lado (p. ej. `oracionCondicion`, `oracionAbanico` 110 líneas,
  `planificarEnlace`), repetición de "¿cuál es el proceso y cuál el objeto?" en ≥6 sitios (`procedural.ts:302-303, 340-349,
  393-394, 415-420, 450-457`).
- Nombres del modelo acoplados al texto: el AST porta nombres, la resolución es global por clave de nombre (no por OPD ni
  por id), lo que hace frágil cualquier modelo con homónimos entre OPDs.
- Suite amplia (343 tests) pero con puntos ciegos exactamente donde están los bugs: el framework de roundtrip nunca prueba
  "auto-reparseo = 0 patches y 0 errores" sobre modelos compuestos, ni inserción de líneas.

---

## 13. Recomendación por pieza (keep / simplify / cut)

| Pieza | Recomendación | Justificación |
|---|---|---|
| Tokens/refs/hints (`interaccion.ts`) | **keep** | Contrato limpio consumido por UI y render; sólo cambiar `referenciaEnlaceEspecifico` a hint-por-enlace explícito. |
| Plantillas forward (`generadores/*`) | **simplify** | Reescribir como **tabla declarativa de familias** (hecho → plantilla con huecos tipados) que sirva a la vez para generar y reconocer; eliminar ramas duplicadas; corregir divergencias §9. |
| AND agrupado procedimental | **cut** (o reimplementar con inversa) | Viola R-FAN-1/R-COMP-ZP-3 y rompe el editor; si se quiere prosa compuesta, hacerlo como opción display con descomposición reversible (§9). |
| Agrupación estructural de destinos | **añadir** | Exigida por R-COMP-EJE-3; el parser ya la soporta. |
| Hack `manejar/conducir` | **cut** | Circunstancial, duplicado, fuera del vocabulario cerrado, no reversible. |
| Multiplicidad | **simplify** | Una sola tabla símbolo→frase→símbolo (bidireccional), prosa sin glifos, sin pluralización morfológica en el canónico (o con despluralización reversible), sin multiplicidad sobre procesos. |
| Designaciones / duración / unidad | **simplify** | Una oración por estado con designaciones combinadas en español; duración con plantilla reversible; unidad sólo en un sitio. |
| Abanicos | **simplify** | Conservar R-FAN-2..6; lista con `o`; evento para todos los roles INPUT; reemplazar `throw` por diagnóstico; `crear-abanico` idempotente. |
| Refinamiento / orden in-zoom | **keep/simplify** | Conservar semántica y verificación inversa; usar el predicado de pertenencia del modelo (no `dentroDe`); cortar funciones muertas. |
| Familias por preestado | **keep** | Cerrada y exacta. |
| Composición inter-modelo | **simplify/marginal** | Marcar como display (no parseable) de forma explícita en vez de caer al catch-all. |
| Parser (`parsear.ts`, `groups.ts`) | **simplify** | Derivar reconocedores de la tabla forward; eliminar formas prohibidas y catch-all; negación como `warning`; reconocer todo lo emitido. |
| Planificador | **simplify** (rediseño de identidad) | Sustituir la heurística posicional por anclas estables (editor que conserve refs por línea, o renombrado sólo inline/por token) y comparar por **fact-set**; no emitir patches cuando el hecho ya coincide. |
| Aplicador | **keep/simplify** | Conservar fases y operaciones del kernel; un solo resolvedor de nombres; separar `crear-enlace` de `actualizar-enlace`. |
| Clasificador de edición | **keep** | Con partial-apply real en el store (aplicar sólo líneas `aplicable`). |
| `edicionCanvas.ts` | **simplify** | Una sola vía inline (hoy el store tiene acciones directas paralelas). |
| Panel derivado | **keep** | Pasar el mismo régimen/alcance al planificador; no recalcular OPL dos veces. |
| `bloquesJerarquicos.ts` + `exportarMarkdown.ts` | **keep, unificar** | Un solo orden de OPD para panel y export. |
| `estructurado.ts` | **cut** | Duplica export; sólo lo usa un script. |
| `contextoSkill.ts` | **cut de opl/** | Gobernanza de mesa/anclas; si la capa "mesa" sobrevive, que viva allí y consuma `exportarOplModeloMarkdown`. |
| `DETECTOR_OPL_COMPAT`, comentarios de ronda, rutas `/home/felix` | **cut** | Lastre sin consumidor. |
| `fixtures-roundtrip.ts` | **keep/simplify** | Convertir en generador de casos a partir de la tabla de familias + propiedad "auto-reparseo sin error ni patches". |

---

## 14. Esbozo para la reescritura (sólo orientación)

1. **Una gramática, dos direcciones**: definir cada familia como `{id, cuando(hecho), plantilla: partes[] (literal |
   hueco-cosa | hueco-estado | hueco-lista | hueco-cuantificador | hueco-multiplicidad), refs}`; el generador rellena
   huecos, el reconocedor intenta las plantillas en orden de especificidad y devuelve hechos, no nombres sueltos.
   La simetría pasa a ser propiedad por construcción y se prueba con *property-based testing* sobre modelos aleatorios.
2. **Roundtrip por fact-set** (como ya exige R-FAN-5B y R-COMP-REV-2): `hechos(parsear(generar(M))) ⊆ hechos(M)` y
   `generar ∘ parsear ∘ generar = generar`; invariante de producto: el texto canónico reparsea con **0 errores y 0 patches**.
3. **Identidad estable**: el editor libre mantiene por línea las refs de la línea origen (o se limita la edición libre a
   *añadir/modificar hechos* y el renombrado ocurre sobre tokens), eliminando `lineasActuales[linea-1]`.
4. **Partial apply**: aplicar exactamente las líneas `aplicable`; las `no-aplicable` se quedan en el texto con su razón.
5. **Display vs canónico explícito**: marcar líneas solo-display (plegado, sub-modelo) con un flag en `OplLineaInteractiva`
   para que el parser las ignore sin error.
6. **Conservar sin cambios de contrato**: `OplReferencia`, `OplToken`, `OplLineaInteractiva` (con id estable por hecho en
   lugar de posicional), `VisibilidadOpl`, `EstadoLineaOpl`/`RazonNoAplicable`, formato Markdown de export. El AST
   `OracionOplAst` puede migrar si `autoria/compilar` se adapta (es su segundo consumidor).

---

## 15. Acoplamientos externos relevantes

- `autoria/compilar/{emisor,normalizador,resolutor,estructura}.ts` importan `parsearParrafoOpl`, `claveNombre` y el tipo
  `OracionOplAst` directamente de `opl/parser/parsear` / `tipos` (salta el barrel). El compilador de autoría depende de la
  gramática OPL como DSL de entrada: cambiar el parser impacta la autoría headless.
- `store/modelo/acciones-canvas.ts` (aplicación reverse, copiar Markdown, contexto skill), `app/viewmodels/panelOplViewModel.ts`,
  `ui/PanelOpl.tsx`, `ui/panelOpl/*` (tokens, editor honesto), `render/jointjs/*` (hover OPL↔OPD, halos, mapa/headless usan
  `ordenarOpdsParaOpl`), `server/agent/context.ts` y `agent/changeProjection.ts` (usan `generarOpl` como vista textual para el
  agente), `ui/mobile`, `ui/review`, `ui/portable`, `serializacion/perfilesExport.ts`, `mesa/contextoPull.ts`.
- Dependencias hacia el modelo (dirección correcta modelo→opl): `extremos`, `abanicos`, `autoinvocacion`, `rutas`,
  `etiquetasEnlace`, `nombresCanonicos`, `plegado`, `refinamientos`, `visibilidadEstados`, `estadosDesignaciones`,
  `operaciones/*`, `modificadores`, `layout.posicionLibre`, `contextoRefinamiento` (sólo vía helpers). `contextoSkill.ts`
  arrastra además `anclasNormativas`, `notasMesa`, `exportarDiagnostico`.
- SSOT externa: `spec-forja-opl-es` (KORA) cita funciones y líneas de este directorio; toda reestructuración requiere
  re-sincronizar sus trazas por el circuito KORA.
