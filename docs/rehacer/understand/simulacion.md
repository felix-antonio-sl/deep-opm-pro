# Dossier — Simulación (conceptual, escenarios, numérica, timeline)

Área estudiada (lectura completa del código, no solo nombres):

- `app/src/modelo/simulacion/*` (3.340 líneas fuente + 2.447 de tests)
- `app/src/ui/simulacion/*` (`BarraSimulacion.tsx` 1.171, `PanelEscenarioSimulacion.tsx` 377, `proyeccionBarra.ts` 400)
- `app/src/store/simulacion.ts` (293)
- `app/src/ui/DialogoSimulacionNumerica.tsx` (360) y su viewmodel/port
- `app/src/ui/Timeline.tsx` (370) y `app/src/app/viewmodels/timelineViewModel.ts`
- `app/scripts/generar-laboratorio-simulacion.ts` (491)
- e2e: `12-beta2-modo-simulacion.spec.ts` (480), `30-simulacion-numerica.spec.ts` (118), `scenario-explanation.spec.ts` (114)
- Leyes: `src/leyes/simulacion-{unfold,modos,ramas}.test.ts`, `integracion-ss-fs.test.ts`, `tiempo-enriquecimiento.test.ts`, `enriquecimiento-cost.test.ts`
- Corpus de autoridad consultado: `kora-knowledge/versions/fxsl/reglas-opm-estrictas-es/.../content.md` (R-EJEC-1..10, R-ECA-1..4, R-EXC-2..4A, R-INV-1/2, R-FAN-PROB-1, R-PROC-3), `spec-forja-opd-es` (R-OPD-SIM-1..7, R-OPD-CTL-4), `opd-es` (V-13), `docs/manual-opm-puro.md` §24.

Todo hallazgo marcado **[verificado]** fue reproducido con sondas `bun` en el scratchpad (sin tocar el repo). Los marcados **[lectura]** salen de leer el código sin ejecución.

---

## 1. Resumen ejecutivo

1. El núcleo es un **intérprete lineal de un solo hilo** sobre un plan aplanado de procesos (orden `ordenInzoom` → Y → nombre, con in-zoom expandido en profundidad). Cada paso evalúa, en este orden: **evento → condición → habilitadores (agente/instrumento) → estado de entrada de los afectados/consumidos → transiciones → copias de valor → duración/excepción temporal → siguiente paso (excepción | invocación | secuencial)**. Es puro, inmutable y determinista salvo el modo `muestreo` con semilla. Esta pieza tiene buena calidad y vale portarla con recortes.
2. El diseño **distingue con cuidado ocho resultados de paso** (`avance`, `espera`, `omision`, `evento-no-ocurrido`, `evento-perdido`, `indeterminado`, `no-soportado`, `truncado`) y adjunta evidencia (enlaces, estados, ids de reglas). Ese vocabulario es valioso y OPM-fiel (R-EJEC-7/8, V-13). Hay que conservarlo.
3. El último incremento (`a047d53`, "escenarios") introdujo conocimiento epistémico (`conocido/desconocido`, presencia `presente/ausente`), pero **solo como hechos estáticos del escenario**: la presencia de objetos **no evoluciona** durante la corrida. Con eso se rompió el caso por defecto: **cualquier proceso con un agente o instrumento sin estados queda "Indeterminado" en el primer paso cuando no hay escenario**, incluido el modelo canónico de laboratorio del propio motor **[verificado]**.
4. Hay brechas semánticas OPM reales: la existencia de objetos sin estados no se rastrea (consumo y resultado no la cambian), el modificador de negación `no` se ejecuta como enlace positivo, el efecto compacto TS3 no transiciona, la duración es de **estado** y no de **proceso**, los abanicos OR se ignoran y los XOR de entrada se tratan como decisiones de salida (sección 6).
5. Alrededor del núcleo hay mucha **acreción**: un runtime "sociotécnico" completo sin ningún consumidor, módulos de teoría de categorías (Cost-category, "sección del haz F0") usados solo por tests, `lifeline`, un barrel `index.ts` que nadie importa, puertos y viewmodels de paso directo, 113 aserciones que fijan valores CSS, y comentarios de arqueología de bugs dentro del JSX. Es alrededor del 40 % del área.
6. La **simulación numérica** es un muestreador independiente de atributos (Monte Carlo de valores iniciales, sin dinámica). Es útil y está bien validada, pero tiene un defecto de contrato: indexa columnas por **nombre** de entidad, con colisiones **[lectura]**.
7. `Timeline.tsx` no es de simulación. Es un editor del **orden temporal de subprocesos de un in-zoom**, y el plan depende de él. Mueve la Y **sin actualizar `ordenInzoom`**, la fuente de verdad que declara R-IDP-0A, así que Timeline, plan y OPL pueden divergir **[lectura]**.

Forma mínima que conserva valor (detalle en la sección 13): un kernel de unas 900 líneas (plan + paso ECA + conocimiento runtime unificado de existencia y estado + XOR + invocación/excepción + traza con resultado y evidencia), una sola barra de UI con "condiciones iniciales" integradas, y el muestreo numérico reducido a un diálogo pequeño indexado por id.

---

## 2. Inventario de módulos

Leyenda de valor: **core** = semántica OPM ejecutable / contrato; **important** = UX central de la función; **marginal** = útil pero prescindible; **accretion** = sin consumidor productivo o burocracia.

| Archivo | Líneas | Propósito real | Consumidores productivos | Valor | Veredicto |
|---|---|---|---|---|---|
| `modelo/simulacion/runner.ts` | 890 | Paso ECA, XOR, invocación, excepción temporal, límite, reinicio, árbol exhaustivo | store, proyeccionBarra, script | core | **simplify** (portar el pipeline, quitar coalgebra/árbol, código muerto post-validación) |
| `modelo/simulacion/plan.ts` | 291 | Planificación del OPD: orden, in-zoom recursivo, inferencia de transiciones consumo↔resultado, rutas, estado inicial | runner, PanelEscenario | core | **keep** (casi tal cual; revisar fallback "primer estado por id") |
| `modelo/simulacion/tipos.ts` | 150 | Contratos del runtime (`PasoSimulacion`, `ContextoSimulacion`, `EntradaTraceSim`…) | todo | core | **simplify** (quitar opcionales "legacy", renombrar `resultadoEscenario`) |
| `modelo/simulacion/enablers.ts` | 142 | Evaluación de agente/instrumento contra conocimiento (presencia/estado) | runner | core | **keep** con cambio: leer conocimiento **runtime** de existencia, no del escenario |
| `modelo/simulacion/scenario.ts` | 130 | Tipos `Conocimiento<T>`, `EscenarioSimulacion`, validación, proyección a conocimiento runtime | runner, store, UI | important | **simplify** (reducir a "condiciones iniciales"; quitar `revisionBase` string, `capacidadesSoportadas`, `alcanceIds`, `parametros`) |
| `modelo/simulacion/fases.ts` | 198 | Microfases observables (preparación/consumo/proceso/resultado/cierre), enlaces por fase, estados visuales por fase | runner, foco, barra, tokens | important | **keep** (bien diseñado; R-OPD-SIM-5) |
| `modelo/simulacion/foco.ts` | 266 | Proyección pura "qué resaltar" (proceso activo, enlaces, estados origen/resultado, current visual) | JointCanvas, panel OPL | important | **keep** (quitar `enlacesInvolucradosEnPaso`/`entidadesInvolucradasEnPaso` si quedan sin uso) |
| `modelo/simulacion/animacionTokens.ts` | 39 | Gate de animación + dirección del token por fase | JointCanvas | important | **keep** (fusionar con foco) |
| `modelo/simulacion/tiempo.ts` | 117 | Conversión de unidades a segundos, duración del paso, detección sobre/subtiempo | runner | core (parcial) | **simplify** + corregir semántica (duración de **proceso**) |
| `modelo/simulacion/valores.ts` | 110 | Valores runtime iniciales (copia/muestreo) y copia atributo→atributo | runner | marginal | **simplify** (copia A→B es heurística, no semántica OPM declarada) |
| `modelo/simulacion/parametros.ts` | 336 | Normalización/validación de `ParametrosSimulacionEntidad` + 7 distribuciones + generación de filas | serialización, inspector, diálogo numérico, valores | important (contrato persistido) | **keep** (validador) / **simplify** (muestreo) |
| `modelo/simulacion/rng.ts` | 14 | mulberry32 sembrado | runner, parametros | core | **keep tal cual** |
| `modelo/simulacion/efecto.ts` | 25 | `Efecto<T>`/`Sucesor<T>` ("coalgebra") | runner | accretion | **cut** (una lista de sucesores basta) |
| `modelo/simulacion/csv.ts` | 16 | CSV con escape RFC-4180 mínimo | diálogo numérico | marginal | **keep** |
| `modelo/simulacion/lifeline.ts` | 39 | "Sección del sheaf temporal": fotogramas por paso | **ninguno** (solo barrel + test) | accretion | **cut** |
| `modelo/simulacion/sociotecnico.ts` | 235 | Runtime de actores/agentes IA, políticas de autonomía, efectos `http/python/mqtt/sql/ros/genai` | **ninguno** (solo barrel + test) | accretion | **cut** |
| `modelo/simulacion/costoCategoria.ts` | 116 | "Cost-category de Lawvere", Floyd-Warshall (min,+) sobre estados | solo `leyes/enriquecimiento-cost.test.ts` | accretion | **cut** |
| `modelo/simulacion/integracionHechos.ts` | 166 | "Ss↔Fs": hechos ejercidos, firma de frontera ejercida | solo `leyes/integracion-ss-fs.test.ts` | accretion (con un grano útil) | **cut** del producto; la comparación de firma de frontera puede vivir como test del kernel |
| `modelo/simulacion/enriquecimiento.ts` | 54 | Resumen de duración/eventos de N corridas | solo `leyes/tiempo-enriquecimiento.test.ts` | accretion | **cut** (o reescribir si se construye "N corridas") |
| `modelo/simulacion/index.ts` | 6 | Barrel (`runner, tipos, scenario, enablers, lifeline, sociotecnico`) | **nadie lo importa** | accretion | **cut** |
| `store/simulacion.ts` | 293 | Slice zustand: entrar/salir (readOnly), paso/fase, rama, correr, reiniciar, autoavance, velocidad, headless, modo, semilla, escenario, invalidación por cambio de base | UI | important | **simplify** (guardia de base repetida 5 veces; navegación) |
| `ui/simulacion/BarraSimulacion.tsx` | 1.171 | Barra: estado, narrativa, tutor, controles, XOR, modo, semilla, velocidad, fases, traza, panel de escenario | App | important | **simplify** fuerte (≈60 % son estilos inline y comentarios BUG-…) |
| `ui/simulacion/proyeccionBarra.ts` | 400 | Proyecciones puras: progreso, narrativa, XOR rotulado, conclusión de escenario con límites | Barra, Panel | important | **keep** (lógica pura testeable; recortar duplicados de rótulos) |
| `ui/simulacion/PanelEscenarioSimulacion.tsx` | 377 | Editor de escenario (propósito, presencia/estado por objeto, supuestos) + conclusión con evidencia y límites | Barra | important | **simplify** → panel "Condiciones iniciales" |
| `ui/simulacion/BarraSimulacion.styles.test.ts` | 320 | 113 `expect` sobre valores CSS literales | — | accretion | **cut** |
| `ui/DialogoSimulacionNumerica.tsx` | 360 | Diálogo N ejecuciones, tabla, CSV | App | marginal/important | **simplify** |
| `app/viewmodels/dialogoSimulacionNumericaViewModel.ts` + `ports/zustandSimulacionNumericaDialogPort.ts` + `ports/simulacionNumericaDialogPort.ts` | ~40 | Tres capas de paso directo | diálogo | accretion | **cut** (leer store directo) |
| `app/ports/simulationPort.ts` + `zustandSimulationPort.ts` | ~65 | `SimulationPort` = subconjunto literal de `OpmStore` | Barra, JointCanvas | accretion | **cut** |
| `ui/Timeline.tsx` + `timelineViewModel.ts` | 370 + 90 | Orden de subprocesos de in-zoom por drag (antes/paralelo/después) | App | important (no es simulación) | **simplify** y corregir: debe editar `ordenInzoom` |
| `scripts/generar-laboratorio-simulacion.ts` | 491 | Construye el modelo "Laboratorio v3", corre sanidad y opcionalmente lo sube a producción | manual | marginal | **simplify** → fixture de test; **cut** `--subir` |

Referencias rotas en comentarios: `docs/historias-usuario-v2/...` (HU-B0.005/013/027) no existe; `opm-extracted/src/app/...` (código OPCloud) no está en el repo; `store/simulacion.ts:19` remite a "HANDOFF tras cierre Beta2", que no contiene nada de simulación.

---

## 3. Contratos de datos

### 3.1 Contratos persistidos en el JSON del modelo (hay que respetarlos o migrarlos)

La simulación **no persiste runtime** (R-EJEC-3, R-OPD-SIM-6): `store/persistencia.ts:819` fuerza `contextoSimulacion: null`. Los escenarios **tampoco se persisten** y se pierden al salir del modo. Lo que sí se lee del modelo persistido:

```ts
// modelo/tipos/estado.ts
export type UnidadTiempo = "ms" | "s" | "min" | "h" | "dia" | "sem" | "mes" | "año";
export interface DuracionTemporal { unidad: UnidadTiempo; min: number; nominal: number; max: number; }
// Estado.duracion?: DuracionTemporal   ← única fuente de duración (no existe duración de proceso)
// Estado.esInicial?/esFinal? + designaciones (current/default/inicial vía estadosDesignaciones.tieneDesignacion)
// Estado.suprimido?
```

```ts
// modelo/tipos/entidad.ts — contrato de simulación numérica (validado en serializacion/validarEntidades.ts:150-154)
export type DistribucionSimulacion = "uniform" | "normal" | "bernoulli" | "geometric" | "poisson" | "exponential" | "binomial";
export interface FilaTextualSimulacion { texto: string; porcentaje: number; }
export interface ConfiguracionSimulacionNumerica {
  modo: "numerica"; distribucion: DistribucionSimulacion; entero?: boolean;
  rangoMin?: number; rangoMax?: number; uniformMin?: number; uniformMax?: number;
  normalMu?: number; normalSigma?: number; probabilidad?: number;
  binomialN?: number; binomialP?: number; lambda?: number;
}
export interface ConfiguracionSimulacionTextual { modo: "textual"; valores: FilaTextualSimulacion[]; }
export type ConfiguracionSimulacionEntidad = ConfiguracionSimulacionNumerica | ConfiguracionSimulacionTextual;
export interface ParametrosSimulacionEntidad { simulable: boolean; configuracion?: ConfiguracionSimulacionEntidad; }
// Entidad.simulacion?: ParametrosSimulacionEntidad  (requiere Entidad.valorSlot)
// ValorSlot { tipo: "integer"|"float"|"char"|"string"; placeholder: "value"; valor?: number|string }
```

Invariantes que impone `normalizarParametrosSimulacion` (`parametros.ts:72-199`): numérica solo sobre `integer|float`; `rangoMin ≤ rangoMax`; `uniformMin ≤ uniformMax`; bernoulli/geometric con `p ∈ (0,1]`; binomial con `n` entero ≥ 0 y `p ∈ [0,1]`; poisson/exponential con `λ > 0`; normal con `σ > 0`; textual con porcentajes que suman 100 (±1e-9) y textos válidos para el tipo del slot. Es un contrato de importación: un JSON que no lo cumple **se rechaza**.

Campos de `Enlace` que el runner interpreta (`modelo/tipos/enlace.ts`): `tipo`, `origenId/destinoId` (`ExtremoEnlace {kind:"entidad"|"estado"; id; portId?}`), `modificador?: "condicion"|"evento"|"no"`, `probabilidad?`, `rutaEtiqueta?`, `etiqueta`, `tiempoMaximo?/unidadTiempoMaximo?/tiempoMinimo?/unidadTiempoMinimo?` (strings). **Ignora** `demora`, `tasa/unidadesTasa`, `multiplicidad*`, `estadoEntradaId/estadoSalidaId` (efecto TS3) y el significado de `modificador:"no"`.

`Abanico` (`modelo/tipos/abanico.ts`): `{ id, opdId, puertoComun:{entidadId, lado:"origen"|"destino", portId}, puertoEntidadId, operador:"O"|"XOR", enlaceIds, decision?: DecisionPolicy }`, con
`DecisionPolicy = {modo:"estado-fijo";estadoId} | {modo:"uniforme";objetoId} | {modo:"probabilidades";pesos} | {modo:"funcion";funcionId;fallback?}` (`tipos/extensiones.ts:548`).

`Opd.ordenInzoom?: Id[][]` (`tipos/opd.ts:36`): bandas de subprocesos (anticadenas). Es la **fuente de verdad del orden temporal** (R-IDP-0A, R-INV-2/2A) y el plan la consulta en `plan.ts:77-88`.

### 3.2 Contratos del runtime (no persistidos; un reescritor puede redefinirlos)

Citas textuales de `modelo/simulacion/tipos.ts`:

```ts
export interface TransicionEstadoSim {
  entidadId: Id;
  estadoAntesId: Id | null;   // null = creación
  estadoDespuesId: Id | null; // null = terminación / consumo sin reemplazo
  rutaEtiqueta?: string;
}

export interface PasoSimulacion {
  opdId: Id; opdNombre: string; profundidad: number; procesoPadreId?: Id;
  procesoId: Id; procesoNombre: string; ordenY: number;
  opdHijoId?: Id; opdHijoNombre?: string;
  enlacesEntradaIds: Id[]; enlacesSalidaIds: Id[];
  transicionesPlanificadas: TransicionEstadoSim[];
}

export type FaseSimulacion = "preparacion" | "consumo" | "proceso" | "resultado" | "cierre";
export type EstadoSimulacion = "preparado" | "ejecutando" | "completado" | "bloqueado";
export type ModoSimulacion = "determinista" | "muestreo" | "exhaustivo";

export interface ContextoSimulacion {
  modeloId: Id; opdId: Id; plan: PasoSimulacion[];
  pasoActual: number; faseActual?: FaseSimulacion | undefined;
  estado: EstadoSimulacion;
  estadosCurrent: Record<Id, Id>;
  valoresRuntime: Record<Id, ValorConcreto>;
  trace: EntradaTraceSim[];
  modo?: ModoSimulacion; semilla?: number; reloj?: number;
  escenario?: EscenarioSimulacion;
}

export interface EntradaTraceSim {
  numero: number; opdId: Id; opdNombre: string; procesoId: Id; procesoNombre: string;
  transicionesAplicadas: TransicionEstadoSim[];
  cambiosValor: CambioValorRuntime[];
  diagnostico?: string; omitido?: boolean;
  ventanaDuracion?: DuracionTemporal; duracion?: number;
  eventosTemporales?: EventoTemporalSim[];
  resultadoEscenario?: ResultadoPasoEscenario;
  evidenciaEscenario?: ReferenciaEvidenciaEscenario[];
}
```

De `scenario.ts`:

```ts
export type Conocimiento<T> = { estado: "conocido"; valor: T } | { estado: "desconocido"; motivo?: string };
export type PresenciaEscenario = "presente" | "ausente";
export interface ConocimientoRuntimeEscenario {
  presencia: Readonly<Record<Id, Conocimiento<PresenciaEscenario>>>;
  estadosCurrent: Readonly<Record<Id, Conocimiento<Id>>>;
}
export interface EscenarioSimulacion {
  id: string; modeloId: Id; revisionBase: string | number; proposito: string;
  alcanceIds: readonly Id[]; conocimientoInicial: ConocimientoRuntimeEscenario;
  supuestos: readonly SupuestoEscenario[]; parametros: Readonly<Record<string, ParametroEscenario>>;
  capacidadesSoportadas: readonly string[];
}
export type ResultadoPasoEscenario =
  | "avance" | "espera" | "omision" | "evento-no-ocurrido" | "evento-perdido"
  | "indeterminado" | "no-soportado" | "truncado";
export interface ReferenciaEvidenciaEscenario { tipo: "declaracion" | "estado" | "enlace" | "supuesto" | "regla"; id: Id | string; }
```

De `EscenarioSimulacion`, el runner solo consume `modeloId` (guardia) y `conocimientoInicial`. `revisionBase` (string `local:${modelo.id}:${nextSeq}`, `PanelEscenarioSimulacion.tsx:104`), `alcanceIds`, `parametros`, `capacidadesSoportadas` y `supuestos[].referencias` son **metadatos decorativos**: se muestran o se validan, pero no cambian la ejecución. La invalidación "la base cambió" usa la **identidad referencial** `modeloBaseSimulacion !== modelo` (`store/simulacion.ts:95,127,155,174,191`), no `revisionBase`.

### 3.3 API de store (contrato hacia la UI)

`SimulacionSlice` (`store/sliceTypes.ts:287-307`, `store/tipos.ts:906-935`): estado `contextoSimulacion`, `modeloBaseSimulacion`, `readOnlyPrevSimulacion`, `autoAvanceSimulacionActivo`, `velocidadSimulacion` (0,25–4), `headlessSimulacion`; acciones `iniciarModoSimulacion`, `aplicarEscenarioSimulacion(escenario|null) → error|null`, `salirModoSimulacion`, `ejecutarPasoSimulacion` (avanza **una microfase**), `resolverRamaSimulacionActual(enlaceId)`, `ejecutarCorridaSimulacion`, `reiniciarSimulacionActual`, `iniciar/pausarAutoAvanceSimulacion`, `fijarVelocidadSimulacion`, `asignarValorRuntimeSimulacion`, `alternarHeadlessSimulacion`, `fijarModoSimulacion`, `fijarSemillaSimulacion`. Aparte: `dialogoSimulacionNumericaAbierto` + abrir/cerrar, y `configurarSimulacionAtributoSeleccionado` (inspector).

Efectos laterales al entrar (`store/simulacion.ts:29-52`): fuerza `readOnly=true` (guardando el previo), cierra Mapa (mutuamente excluyentes, también en `store/mapa.ts:27-45`), cancela modos enlace/creación y el editor inline, y navega al OPD del primer paso.

### 3.4 APIs HTTP

El área no expone endpoints. Solo el script de laboratorio **consume** `POST {base}/__deep-opm/auth/login`, `GET/POST {base}/__deep-opm/modelos`, con `base = "https://opforja.sanixai.com"` fijo y credenciales leídas de `~/.opforja-operator-credentials` (`scripts/generar-laboratorio-simulacion.ts:437-470`). Eso es circunstancial y contradice el espíritu de AGENTS.md (nada de hardcodear destinos; desplegar solo por `deploy.sh`).

---

## 4. Semántica de ejecución implementada

### 4.1 Planificación (`plan.ts`)

- **Entran al plan** solo las apariencias de `proceso` del OPD. Se excluyen `contextoRefinamiento.rol === "contorno" | "externo"` (`plan.ts:36-39`), es decir, el contorno del proceso en su propio in-zoom y los externos.
- **Enlaces del paso**: todo enlace **con apariencia en ese OPD** cuyo destino (entrada) u origen (salida) es el proceso o un estado suyo (`plan.ts:44-49`, `extremoAfectaA` en `140-144`). Consecuencia: el plan es **por vista**. Un enlace que existe en el modelo pero no se dibuja en el OPD no participa.
- **Orden** (`plan.ts:77-88`): bandas de `opd.ordenInzoom` si existen (los listados van primero y los no listados después), luego `apariencia.y` ascendente, luego nombre `localeCompare("es-CL")`.
- **In-zoom** (`plan.ts:52-53, 89-94`): si el proceso tiene refinamiento `descomposicion`, sus subprocesos se insertan **inmediatamente después** del padre (DFS), con `profundidad+1` y `procesoPadreId`. La guardia `visitados` (`plan.ts:31`) evita ciclos. El despliegue de **objetos** no se simula.
- **Inferencia de transiciones** (`plan.ts:161-227`):
  - entradas `consumo|efecto` **desde un estado** y salidas `resultado|efecto` **hacia un estado** del mismo objeto se emparejan como `antes → después`;
  - consumo de estado sin par da `después = null` (terminación de estado); resultado a estado sin par da `antes = null` (creación en estado);
  - emparejamiento por `rutaEtiqueta` (`elegirResultadoParaRuta`, `229-239`): si el consumo tiene ruta, exige el resultado con la misma ruta; sin ruta, toma el único resultado sin ruta, o el único candidato.
  - Los enlaces entre **entidades** (sin estado) **no producen transiciones**; agente, instrumento e invocación no transicionan.
- **Expansión por rutas** (`plan.ts:247-263`): si **todas** las transiciones del paso tienen ruta, son completas (antes y después no nulos) y pertenecen a **un** objeto, el paso se **replica una vez por ruta**, encadenadas por estado (`ordenarCadenaRuteada`). Así se modela "el proceso repite por cada tramo de la cadena" (test `runner.test.ts:216`).
- **Estado inicial** (`plan.ts:98-138`). Hay dos perfiles:
  - `estadosCurrentIniciales` (sin escenario): designación `current` > `default` > `inicial` > **primer estado por `id.localeCompare`** (fallback "histórico" que **inventa** un estado; con ids `s-10` y `s-9` elige `s-10`);
  - `estadosCurrentDeclarados` (con escenario): igual, pero sin el fallback. Sin designación, el estado queda desconocido.

### 4.2 Paso de ejecución (`runner.ts:58-369`, `pasoEfecto`)

Orden exacto de evaluación, coherente con el ciclo ECA del manual (§24.2):

0. Guardias: `bloqueado` → identidad; `pasoActual ≥ plan.length` → `completado`; escenario de otro modelo → `no-soportado` (`66-75`).
1. **Eventos** (`77-103`): `evaluarModificadores(..., "evento")` sobre enlaces `consumo|efecto|agente|instrumento` (`TIPOS_CONDICION_EJECUTABLES`, `588`) con `modificador === "evento"`.
   - Ninguno satisfecho, al menos uno incumplido y ninguno desconocido → **omitir** con `evento-no-ocurrido` (reglas R-EJEC-7).
   - Ninguno satisfecho y alguno desconocido → **bloquear** con `indeterminado`.
   - Con **al menos uno** satisfecho el proceso sigue (semántica OR de disparadores).
2. **Condiciones** (`105-144`): cualquier condición incumplida → **omitir** (bypass, R-EJEC-7; OR de la omisión, R-EJEC-8). Si además hubo evento satisfecho, el evento **se consume** (V-13, `consumirEventosEvaluados` `653-666`: borra el current del objeto si seguía en el estado disparador). Una condición desconocida → bloquear `indeterminado`, o `evento-perdido` si hubo evento.
3. **Habilitadores base** (`146-201`, `enablers.ts`): cada `agente|instrumento` entrante se evalúa `satisfecha|incumplida|desconocida`. El resultado global es `impedidos` → bloquear `espera` (o `evento-perdido`), `no-conocidos` → `indeterminado`, `no-soportado` → `no-soportado`.
4. **Filtro de transiciones efectivas** (`203-214`): vacío si el paso **delega al refinamiento** (V-37/R-DIST-1: la frontera del padre la realizan los hijos). Excluye las transiciones hacia estados de ramas de un XOR de salida (se aplican por rama) y las transiciones desde estados de **eventos no ocurridos** cuando otro evento sí ocurrió.
5. **Estado de entrada** (`215-234`, `validarEstadosDeEntrada` `469-499`): por objeto, alguna transición con `antes` debe coincidir con el current. Si el current es desconocido → `indeterminado`; si es otro → `espera` (R-EJEC-6/R-ECA-2).
6. **Aplicación** (`257-283`): se agrupa por entidad. Con alternativas, se aplican solo las compatibles con el current. `después ≠ null` asigna el current; `después = null` con `antes ≠ null` **borra** el current (el objeto "sale del estado").
7. **Valores** (`286-289`): copia atributo→atributo (sección 4.6). Sus fallos van a `motivosBloqueo` como "No simulable: …" pero **no bloquean**: el paso avanza secuencialmente e **inhibe** la invocación o excepción (`319-323`).
8. **Duración y excepción temporal** (`302-313`, `tiempo.ts`): la duración sale de la `duracion` del **estado** destino (o del de origen) de la primera transición aplicada que la tenga. `determinista` usa `nominal`; `muestreo` usa `U(min, max)`. Si `duración > tiempoMaximo` del enlace de excepción saliente → `sobretiempo`; si `< tiempoMinimo` → `subtiempo`.
9. **Siguiente paso** (`319-323`): primer evento temporal → índice del proceso de manejo (`785-794`); si no, **invocación** explícita saliente, la primera por `id` (`759-783`, R-EJEC-9); si no, `pasoActual+1` (invocación implícita por orden, R-INV-2). Un proceso omitido **no** dispara invocaciones (`omitirPaso` siempre usa `+1`, `590-621`), como exige R-EJEC-9.
10. **Reloj** acumulado (`324`) y consumo de eventos satisfechos (`330-332`).
11. **Abanico XOR de salida** (`338-368`):
    - `exhaustivo`: un sucesor por rama con peso `1/n`;
    - `muestreo`: `resolverDecisionAbanico` (política declarada > `Pr` de enlaces > uniforme por objeto). Si nada es resoluble, uniforme sobre ramas. La semilla **evoluciona** (`361`) para que abanicos sucesivos no queden correlacionados;
    - `determinista`: la rama con mayor `probabilidad` (empate: la primera de `enlaceIds`). **Ignora `abanico.decision`**.
    - `aplicarTransicionDeRama` (`540-574`) aplica el estado destino de la rama y **reescribe el `diagnostico`** de la última entrada con `rama «…» · modo (Pr) semilla`.

Límite de seguridad: `LIMITE_PASOS_SIMULACION = 200` (`runner.ts:15`). Rige tanto para `ejecutarPaso` (`375-381`) como para `desplegar` (`800-811`); al alcanzarlo, el estado pasa a `bloqueado` con `resultadoEscenario: "truncado"` (`813-842`, R-EJEC-10). `desplegarArbol` (`871-890`) explora el árbol completo hasta 200 nodos, pero **solo lo usan tests**.

### 4.3 Evaluación de precondiciones (`runner.ts:697-757`, `enablers.ts`)

- El extremo condicionante es el lado opuesto al proceso. Para un `efecto` de salida hacia un estado se evalúa la **existencia del objeto**, no el estado destino (`749-751`; test `runner.test.ts:356`).
- Presencia declarada `ausente` → incumplida. Un estado requerido se compara con el current conocido; un estado suprimido o inválido cuenta como desconocido.
- Un objeto sin estado requerido se satisface con presencia `presente` **o** con cualquier current conocido ("un current explícito es evidencia de presencia", `enablers.ts:96-106`).
- **Agente no físico** → `no-soportado` (`enablers.ts:54-58`). Eso es una regla OPM: el agente es humano o grupo, por lo tanto físico.
- Enlace agente/instrumento cuyo origen no es un objeto, o cuyo destino no es el proceso → `no-soportado` (`enablers.ts:43-53`).
- **Precedencia**: `no-soportado` > `impedidos` > `no-conocidos` > `satisfechos` (`enablers.ts:126-141`).

### 4.4 Microfases observables (`fases.ts`, `runner.ts:421-441`)

`fasesDelPasoSimulacion`: `preparacion` solo si hay habilitadores o modificadores c/e; con descomposición, solo `[preparacion?, proceso]`; si no, `consumo` (si hay consumo/efecto o transición con `antes`) + `proceso` + (`resultado` o `cierre`). `ejecutarFaseSimulacion` avanza una fase y, **al cerrar la última**, delega en `ejecutarPaso`. El efecto semántico completo se aplica de una vez al final. Las fases son **solo visuales**: `estadosCurrentVisualesFase` (`fases.ts:138-156`) quita el estado de entrada en `proceso` ("en transición") y muestra el de salida en `resultado`. Implementa R-OPD-SIM-5: el consumido desaparece al inicio y el afectado queda indeterminado durante el proceso.

Detalle fino y bien resuelto: el primer avance desde `preparado` **activa** la fase inicial en vez de saltarla (`runner.ts:433-435`), y el frame de inicio muestra solo enlaces de preparación (`foco.ts:54-71`).

### 4.5 Foco visual y tokens (`foco.ts`, `animacionTokens.ts`, `JointCanvas.tsx:465-611`)

Proyección pura por fase: proceso activo (halo crimson, R-OPD-SIM-1), current runtime (anillo, R-OPD-SIM-2, distinto del `current` declarado), estados de origen y resultado, enlaces involucrados filtrados por **ruta activa**. Hay tokens viajeros por enlace (3 por enlace, desfasados), en sentido semántico: el efecto en consumo viaja en `reverse`; color por tipo (`composers/enlace.ts:279-284`). El modo headless los desactiva y solo se animan en el OPD visible. El panel OPL resalta la oración del proceso activo con `procesoActivoId` (`panelOplViewModel.ts:129-133`), lo que realiza la simetría bimodal en modo lectura.

### 4.6 Valores runtime (`valores.ts`)

- Al iniciar: se copia `valorSlot.valor`; los atributos `simulable` se **muestrean**. Sin semilla, el muestreo usa `Math.random`, así que el modo "determinista" deja de ser reproducible si hay atributos simulables (`runner.ts:28,46`).
- Por paso: **copia A→B** entre atributos con `valorSlot`: entrada `consumo|efecto|instrumento` desde el atributo A y salida `resultado|efecto` al atributo B. Exige el mismo tipo de slot y el valor validado; un B no recibe dos escrituras. No hay fórmulas. Es una **heurística de herramienta** sin respaldo explícito en el corpus: OPM no dice que "consumir A y generar B" copie el valor.
- La UI permite editar valores runtime a mano (`asignarValorRuntimeSimulacion`), pero la barra no lo expone. Solo lo usan tests (`valores.test.ts:201`).

### 4.7 Escenario y explicación ("escenarios")

- **Qué es**: un conjunto de hechos iniciales `presencia[objeto]` y `estadosCurrent[objeto]` con valor `conocido|desconocido`, más propósito y supuestos en texto. `aplicarEscenarioSimulacion` lo valida (`scenario.ts:82-116`) y **reinicia** la corrida con él (`store/simulacion.ts:54-77`). En ese caso `iniciarSimulacion` usa el perfil declarado (sin inventar el primer estado) y sobreescribe con los hechos del escenario (`runner.ts:29-37`).
- **Cómo se explica**: `proyectarConclusionEscenario` (`proyeccionBarra.ts:44-57`) toma **la última entrada de traza** como conclusión, con rótulo, referencias de evidencia (enlaces y estados con nombre, reglas por id) y **límites epistémicos** por tipo de resultado (`84-112`). Por ejemplo, "Los datos no permiten decidir este paso; lo desconocido no se convierte en ausencia ni en un estado de dominio". Si la base cambió, la conclusión se marca invalidada y la corrida se bloquea como `no-soportado` (`store/simulacion.ts:270-293`).
- **Alcance del editor** (`PanelEscenarioSimulacion.tsx:300-318`): los objetos que aparecen en enlaces o transiciones del plan.
- **Lo valioso**: la disciplina "desconocido ≠ ausente ≠ estado de dominio" y el vocabulario de resultados con límites. **Lo débil**: el escenario no se persiste y no evoluciona (la presencia es estática). La conclusión solo existe con escenario fijado, aunque la traza trae `resultadoEscenario` siempre. Hay además metadatos sin efecto.
- Homonimia: "escenario" también designa los `TUTOR_SCENARIOS` de auditoría del tutor (`src/tutor/escenarios.ts`, 1.060 líneas), un concepto distinto (casos de prueba del tutor), y los "escenarios focales de navegador" (e2e). Una reescritura debería reservar un solo nombre: por ejemplo "condiciones iniciales" para la simulación.

### 4.8 Simulación numérica

`generarDatosSimulados(modelo, N, semilla|rng)` (`parametros.ts:103-120`): N filas, una columna por atributo simulable, muestreo independiente. No ejecuta procesos. Distribuciones (`sampleNumerico`, `238-286`): uniforme; normal por Box-Muller; bernoulli; geométrica (soporte ≥1); binomial por N ensayos; exponencial por inversión; Poisson por Knuth. El muestreo con rango usa rechazo (hasta 100.000 intentos, luego `undefined`), y la textual usa porcentajes acumulados. El diálogo limita N a 1–10.000, avisa desde 5.000 y descarga `simulacion.csv`. La semilla se toma de `contextoSimulacion?.semilla` si hay simulación activa y si no de `Math.random`. `docs/uso-productivo.md:219-229` declara el límite con honestidad: "no ejecuta la dinámica del proceso".

---

## 5. Catálogo de reglas OPM codificadas (sagradas)

| # | Regla (corpus) | Qué hace el código | Ubicación |
|---|---|---|---|
| 1 | R-EJEC-1/3, R-OPD-SIM-6: runtime ≠ canon; no persistir runtime | Contexto separado del modelo; `valoresRuntime` separado de `valorSlot.valor`; modo readOnly; `contextoSimulacion: null` al hidratar | `tipos.ts` (`ContextoSimulacion`), `valores.ts:6-11`, `store/simulacion.ts:29-52`, `store/persistencia.ts:819` |
| 2 | R-INV-2 / R-IDP-0A: orden temporal declarado, realizado por Y | Plan ordena por `ordenInzoom` > Y > nombre | `plan.ts:77-88` |
| 3 | Descomposición síncrona: subprocesos tras el padre | DFS de in-zoom en el plan | `plan.ts:89-94`, guardia de ciclo `plan.ts:31` |
| 4 | V-37 / R-DIST-1: la frontera del proceso descompuesto la realizan los hijos (consumo al primero, resultado al último) | Paso padre con `opdHijoId` no aplica transiciones ni copias de valor; fases del padre `[preparacion?, proceso]` | `runner.ts:203,211,244-249,286-288`; `fases.ts:34-40` |
| 5 | Transformación por estados (in-out specified effect escindido TS4/TS5, consumo/resultado de estado) | Emparejamiento consumo↔resultado por objeto; creación/terminación de estado | `plan.ts:161-227` |
| 6 | Rutas (path labels) emparejan entrada y salida | `elegirResultadoParaRuta`, `rutaCompartida`, expansión por rutas, filtrado de enlaces por ruta activa | `plan.ts:229-291`; `fases.ts:111-136,180-194`; `foco.ts:118-136` |
| 7 | R-ECA-1: evento iniciador; disparadores en OR | Con al menos un evento satisfecho se continúa; sin ninguno se omite (`evento-no-ocurrido`) o queda `indeterminado` | `runner.ts:77-103` |
| 8 | V-13 / R-OPD-CTL-4: el evento se pierde tras la evaluación aunque falle la precondición | `consumirEventosEvaluados` en omisión, espera e indeterminación posteriores, y tras ejecutar | `runner.ts:120-122,140-142,162-164,184-186,230-232,330-332,653-666` |
| 9 | R-EJEC-7: `c` sobre consumo, efecto, agente o instrumento se evalúa **antes** de transiciones, duración, valores o salidas; si falla, **bypass** (no espera) | Condiciones antes que habilitadores y estado de entrada; `omitirPaso` sin efectos, sin duración y sin invocación | `runner.ts:105-124,588,590-621`; test `condition-precedence.test.ts:128` |
| 10 | R-EJEC-8: AND para ejecutar, OR para omitir; la omisión precede a la espera | Cualquier condición incumplida omite, antes de evaluar habilitadores | `runner.ts:105-124` vs `146` |
| 11 | R-ECA-2 / R-EJEC-6: Pre(P) completo (consumidos, afectados en su estado de entrada, habilitadores) o **espera** | `evaluateEnablers` + `validarEstadosDeEntrada`; `espera` bloquea (plan de un hilo: nada puede liberar la espera) | `runner.ts:146-234,469-499`; `enablers.ts` |
| 12 | Agente = objeto físico (humano o grupo) | `no-soportado` si la esencia no es `fisica` | `enablers.ts:54-58` |
| 13 | R-OPD-SIM-7 / V-10: sin habilitador no hay ejecución | Habilitador ausente → espera o indeterminado; no se aplica ningún efecto | `runner.ts:146-201` |
| 14 | R-EJEC-9 / R-INV-1: tras terminar con invocación explícita Proceso→Proceso, el invocado es el siguiente paso; la autoinvocación es un bucle; un proceso omitido no invoca | `resolverSiguientePasoPorInvocacion` (primera por id si hay varias); `omitirPaso` usa `+1` | `runner.ts:759-783,599` |
| 15 | R-EJEC-10: límite de seguridad como política de runtime, con diagnóstico visible | 200 pasos, `truncado`, mensaje "Bloqueado: límite de 200 pasos alcanzado" | `runner.ts:15,375-381,800-842` |
| 16 | R-EXC (EX1/EX2): el manejador ocurre si la duración excede el máximo o no llega al mínimo | `detectarEventosTemporalesPaso` + salto al proceso de manejo | `tiempo.ts:57-102`; `runner.ts:311-322,785-794` |
| 17 | R-PROB-1 / R-FAN-PROB-1: abanico probabilístico XOR; default `1/n` **solo al simular**, nunca persistido | Uniforme en `muestreo` cuando no hay política; no escribe en el modelo | `runner.ts:346-364`; `decision.ts` |
| 18 | XOR = exactamente una rama | Solo la rama elegida aplica su estado destino; las transiciones hacia estados de rama se excluyen del paso base | `runner.ts:204-214,540-574` |
| 19 | R-OPD-SIM-5: el consumido desaparece al inicio, el afectado queda "en transición" y el resultante aparece al completarse; la condición incumplida se ve como omitida | Fases visuales + `estadosCurrentVisualesFase` + rótulo "omitido" en la traza | `fases.ts:24-51,138-156`; `proyeccionBarra.ts:217-233` |
| 20 | R-OPD-SIM-1/2/3: marcas de runtime reservadas y distintas de las persistentes; tokens no son canon | Halos `data-opm-sim=*`, anillo del current runtime distinto del `current` declarado, tokens transitorios | `render/jointjs/composers/halos.ts:114-342`; `JointCanvas.tsx:564-611` |
| 21 | Estado inicial por designaciones (current > default > inicial) | `estadosCurrentConPerfil` | `plan.ts:107-138` |
| 22 | Disciplina epistémica (hecho ≠ supuesto; desconocido ≠ ausente) | `Conocimiento<T>`, validación (no ausente con estado), límites en la conclusión | `scenario.ts:1-116`; `proyeccionBarra.ts:84-112` |
| 23 | Invariantes de parámetros de distribución | `normalizarParametrosSimulacion` | `parametros.ts:72-199` |
| 24 | Validación de duración `0 ≤ min ≤ nominal ≤ max` (contrato de `Estado.duracion`) | `validarDuracion` (fuera del área, consumido aquí) | `modelo/objetoDuracion.ts:34-41` |

---

## 6. Brechas y desviaciones semánticas respecto del corpus

1. **La existencia de objetos no se rastrea en runtime [verificado]**. La presencia viene solo del escenario, es estática, y el current sirve como sustituto únicamente para objetos con estados. Por eso: (a) el consumo de un objeto sin estados no exige ni quita presencia; (b) un resultado no hace existir al objeto. Probado: `Redactar` genera `Informe` y `Revisar`, que requiere `Informe` como instrumento, queda "Indeterminado: Informe no tiene presencia declarada"; con escenario "Informe ausente", queda "En espera" incluso después de generarlo. Viola el ciclo ECA (§24.2 pasos 4 y 6) y R-ECA-2/3.
2. **Regresión del caso por defecto [verificado]**. Sin escenario, `presencia = {}`, así que todo agente o instrumento **sin estados** da `desconocida` y la corrida se bloquea en el primer proceso. El modelo `construirLaboratorio()` (fixture canónico del motor) termina hoy en `bloqueado` en el paso 1, con "Evento perdido; Indeterminado: Técnico no tiene presencia declarada en el escenario", y el `sanear()` del script lanzaría excepción. Los e2e de simulación no lo detectan porque usan modelos sin habilitadores sin estados. Además, el perfil sin escenario es **incoherente**: inventa el primer estado (`plan.ts:132-136`), pero no presume la presencia.
3. **El modificador de negación `no` se ignora [verificado]**. "Abrir no requiere Llave en estado2" se ejecuta como requisito positivo y bloquea con "En espera: … el enlace requiere estado2". El OPL la emite negada (`opl/generadores/procedural.ts:210,367-392`), así que se rompe la simetría OPL↔ejecución. Queda decidir contra el corpus la semántica exacta de `no`; mientras tanto, lo honesto es `no-soportado`.
4. **Efecto compacto TS3 (`efecto` P→O con `estadoEntradaId/estadoSalidaId`) no transiciona**. `inferirTransiciones` solo ve extremos `kind:"estado"`. El propio script lo admite: "gap conocido del motor" (`scripts/generar-laboratorio-simulacion.ts:19-21`). Solo funciona tras `splitEffectEnPar`.
5. **La duración es de estado, no de proceso**. El corpus define la duración como propiedad del **proceso** (R-PROC-3, R-EXC-2/3/4/4A, V-45, manual §24.3). El modelo solo tiene `Estado.duracion`, y el runner la toma del estado destino u origen de la primera transición (`tiempo.ts:34-54`). Un proceso sin transiciones de estado no tiene duración, y la excepción de sobretiempo compara contra un umbral **en el enlace** (estilo OPCloud `timeMax`).
6. **`muestreo` muestrea `U(min,max)` sin distribución declarada** (`tiempo.ts:49-51`). El manual dice: "sin [distribución], toda instancia dura exactamente lo esperado". Introduce semántica externa silenciosa (R-EJEC-6).
7. **Demora de invocación ignorada**: `enlace.demora` no suma al reloj, aunque el script de laboratorio anuncia "invocación con demora → salto post-terminación".
8. **Abanicos**:
   - los **OR** (`operador:"O"`) se ignoran: se aplican todas las transiciones como AND;
   - `abanicoXorDeSalida` (`runner.ts:443-447`) no mira `puertoComun.lado`, así que un XOR **de entrada** (convergente en el proceso) se presenta como decisión "decidir" de salida;
   - con varios XOR en el mismo proceso solo se usa el primero encontrado, sin filtrar por `opdId`;
   - `determinista` ignora `abanico.decision` (política `estado-fijo`).
9. **V-19** (un resultado simple a un objeto con estados equivale a un XOR de resultados por estado) no se implementa: el current previo se conserva.
10. **Condición y evento sobre enlaces sin apariencia en el OPD** quedan fuera del paso (plan por vista, `plan.ts:44-49`). Un OPD que oculta un habilitador lo simula como ausente de la precondición. Es un riesgo de fidelidad: la simulación debería operar sobre el **modelo**, con la vista solo para la proyección visual.
11. **La tasa y la multiplicidad no se simulan**. Es aceptable si se declara como límite.

---

## 7. Defectos verificados o de alta confianza (fuera de las brechas OPM)

| Defecto | Evidencia | Estado |
|---|---|---|
| Resolver una rama XOR inline **cambia en silencio el modo a `exhaustivo`** para el resto de la corrida | `runner.ts:411` pasa `{...contexto, modo:"exhaustivo"}` y el sucesor hereda el modo. Sonda: `modo tras rama: exhaustivo` | verificado |
| El modo `exhaustivo` de la UI no explora nada: `ejecutarPaso` toma `sucesores[0]`, es decir, "siempre la primera rama" | `runner.ts:342-345,380`; segmented en `BarraSimulacion.tsx:369` | verificado (lectura + sonda) |
| El diagnóstico de rama muestra el **id** del enlace si no hay etiqueta ("rama «e2»") | `runner.ts:528-531` | verificado |
| `resolverRamaSimulacion` elige el sucesor por **etiqueta**; dos ramas con igual etiqueta resuelven a la primera | `runner.ts:412` | lectura |
| La simulación numérica indexa por `entidad.nombre`: atributos homónimos de objetos distintos colisionan en una columna (y generan claves duplicadas en la tabla y cabecera repetida en el CSV) | `parametros.ts:116`; `zustandSimulacionNumericaDialogPort.ts:13` | lectura |
| Poisson por Knuth satura cerca de λ≈745 (`exp(-λ)` → 0) | `parametros.ts:276-285` | lectura |
| Timeline reordena por Y **sin** re-derivar `ordenInzoom`, cosa que sí hace el drag del canvas; si hay `ordenInzoom`, Timeline muestra un orden distinto del que usan plan y OPL | `store/modelo/acciones-canvas.ts:852-876` vs `772-781`; `timelineViewModel.ts` ordena solo por Y | lectura |
| `ejecutarCorridaSimulacion` navega al OPD del **último paso del plan** aunque se haya bloqueado antes, en otro OPD | `store/simulacion.ts:160-168` | lectura |
| El botón "reiniciar" promete "reversible con Ctrl+Z", pero el reinicio no pasa por historial | `BarraSimulacion.tsx:337`; `store/simulacion.ts:171-186` | lectura |
| El reloj se muestra como `${reloj}u` sin formato, aunque la unidad canónica es segundos (flotantes largos en muestreo) | `BarraSimulacion.tsx:443,453`; `tiempo.ts:6` | lectura |
| Sin semilla, "determinista" no es reproducible si hay atributos simulables (`Math.random` en `iniciarValoresRuntime`) | `runner.ts:28,46`; `valores.ts:12` | lectura |
| Los fallos de copia de valor producen "No simulable" pero el paso **avanza** y **suprime** la invocación o excepción: un diagnóstico de datos altera el flujo de control | `runner.ts:289,315-323` | lectura |
| Código muerto tras `validarEstadosDeEntrada`: las ramas `motivoSinRutaVigente` y "no está en estado" del bucle ya no pueden dispararse | `runner.ts:257-275,510-525` | lectura |
| Test tautológico: construye un `Set` de 7 literales distintos y comprueba que tiene tamaño 7 | `scenario.test.ts:124-135` | verificado |

---

## 8. Flujos principales

1. **Entrar**: Command Palette "Simulación conceptual" o toolbar "Más → simulación" → `iniciarModoSimulacion` → `iniciarSimulacion(modelo, opdActivo)` (plan + current iniciales + valores) → readOnly y navegación al OPD del primer paso → `BarraSimulacion` monta sobre el canvas (`CodexCanvasMount.topbar`).
2. **Paso**: botón "paso" o atajo → `ejecutarPasoSimulacion` → `ejecutarFaseSimulacion` (microfase o paso completo) → si el siguiente paso vive en otro OPD, `patchNavegacionSimulacion` cambia de OPD y limpia la selección → `JointCanvas` recalcula el foco, los halos y los tokens; el panel OPL resalta la oración.
3. **Autoavance**: `iniciarAutoAvanceSimulacion` activa un flag; `BarraSimulacion` programa `setTimeout(ejecutarPaso, 900/velocidad)` por cada cambio de fase o paso (`BarraSimulacion.tsx:38-42`). El reloj de UI no se relaciona con el reloj de simulación.
4. **Decisión XOR**: si hay XOR de salida y no hay autoavance, `proyectarDecisionXorSimulacion` ofrece chips → `resolverRamaSimulacionActual(enlaceId)` → `resolverRamaSimulacion` (con el defecto de modo de la sección 7).
5. **Correr**: `ejecutarCorridaSimulacion` → `desplegar` hasta completar, bloquear o llegar al límite.
6. **Escenario**: el panel `<details>` "Escenario" → borrador (presencia y estado por objeto del alcance, propósito, supuestos) → `crearEscenario` + `validarEscenario` → `aplicarEscenarioSimulacion` → reinicio con los hechos → la conclusión se muestra bajo la barra.
7. **Salir**: `salirModoSimulacion` restaura el readOnly previo y descarta el contexto y el escenario. El mapa también descarta la simulación al abrirse.
8. **Numérica**: palette → `abrirDialogoSimulacionNumerica` → columnas = atributos simulables → "Ejecutar N" → tabla → CSV. La configuración se edita en el inspector (`SeccionAtributo.tsx`, 396 líneas) y se persiste en `Entidad.simulacion`.

---

## 9. Acoplamientos

- **Kernel → modelo**: `extremos.ts` (`entidadIdDeExtremo`, `nombreExtremo`), `estadosDesignaciones.ts` (`tieneDesignacion`), `refinamientos.ts` (`obtenerRefinamiento`), `rutas.ts` (`rutaEtiquetaNormalizada`), `decision.ts` (`resolverDecisionAbanico`), `constantes.ts` (`esEnlaceExcepcionTemporal`, `enlaceAdmiteTiempoMax/Min`), `objetoDuracion.ts` (`esUnidadTiempo`), `validadores/valorSlot.ts`. La dirección es correcta (modelo → store → app).
- `integracionHechos.ts` acopla la simulación con `hechos`, `equivalencia/frontera` y `razonamiento`, **solo** para tests de "leyes". Es acoplamiento sin beneficio de producto.
- **UI → tutor**: `BarraSimulacion` ejecuta `runTutorPolicy` en cada render para construir intents (`BarraSimulacion.tsx:43-89`) e inyecta el contenido del tutor en la narrativa. El tutor audita "scenario.simulation.*" (`tutor/capacidades.ts:743-744`). Quitar o cambiar la barra rompe auditorías del tutor.
- **UI → store** a través de `SimulationPort`, que es un subconjunto literal de `OpmStore` y no abstrae nada. `JointCanvas` también lo usa para `headless` y `velocidad`.
- **Store ↔ otras slices**: readOnly (runtime.ts:1082-1090 da el mensaje de bloqueo), mapa (exclusión mutua), selección y navegación (`patchNavegacionSimulacion`), `InspectorEstado` (muestra `runtimeCurrent`).
- **Persistencia**: `validarEntidades` depende de `parametros.normalizarParametrosSimulacion`. Es la única dependencia de persistencia hacia el área.
- **Timeline ↔ plan**: el plan ordena por `ordenInzoom`/Y; Timeline escribe Y. Hay acoplamiento implícito con la divergencia descrita en la sección 7.
- `agent/capabilityProfile.ts` cita `runner.test.ts` y `store/simulacion.test.ts` como "evidencia" de capacidades (`scenario: cell(true, ...)`). Es burocracia que ata rutas de archivos de test.

---

## 10. Olores de sobreingeniería y acreción (ejemplos concretos)

1. **Runtime sociotécnico sin consumidor** (`sociotecnico.ts`, 235 líneas + 141 de test): actores, agentes, políticas de autonomía `bloqueado|requiere-aprobacion|autonomo` y efectos `http|python|mqtt|sql|ros|genai`. Nada fuera del barrel lo importa, y el barrel tampoco tiene importadores. Es una feature especulativa.
2. **Teoría como código de producto**: `costoCategoria.ts` ("Cost = ([0,∞], ≥, 0, +) es el espacio métrico de Lawvere", Floyd-Warshall tropical), `integracionHechos.ts` ("LEY S⊑F0", "sección del haz"), `lifeline.ts` ("sección del sheaf temporal") y `efecto.ts` ("coalgebra"). Solo los consume `src/leyes/*.test.ts`. Validan propiedades del propio vocabulario, no del producto.
3. **Modo `exhaustivo`** expuesto en la UI sin exploración real (sección 7). `desplegarArbol` existe pero solo se usa en tests.
4. **Metadatos de escenario sin efecto**: `revisionBase` string, `capacidadesSoportadas` (calculadas en la UI y mostradas como "Capacidades: transiciones, habilitadores…"), `alcanceIds`, `parametros` ("Parámetros: ninguno | conservados"), y `supuestos[].referencias` que siempre es "todo el alcance". Es gobernanza visible sin semántica.
5. **Arqueología de bugs en el JSX y los estilos**: 28 bloques `BUG-2026…` (`BarraSimulacion.tsx`), con narrativas de rondas ("ronda 2 (F1.12 + F1.1)", "ronda 3 (F1.10)") que describen decisiones de UI pasadas dentro del render.
6. **Tests que fijan CSS literal**: `BarraSimulacion.styles.test.ts`, 113 `expect` sobre `padding`, `minHeight`, `borderLeft` y similares. Congelan diseño en lugar de comportamiento.
7. **Capas de indirección de paso directo**: `SimulationPort`/`useZustandSimulationPort` (18 selectores reexpuestos 1:1); `DialogoSimulacionNumerica` → `useDialogoSimulacionNumericaViewModel` (devuelve lo mismo) → `SimulacionNumericaDialogPort` → `useZustandSimulacionNumericaDialogPort`; lo mismo con Timeline (3 puertos para 4 valores).
8. **Guardia duplicada**: `if (contextoSimulacion.escenario && modeloBaseSimulacion !== modelo) { … bloquearEscenarioPorCambioBase … }`, cinco copias en `store/simulacion.ts`.
9. **Tres constructores de entrada de traza casi idénticos** (`omitirPaso`, `bloquearPaso`, `bloquearPorLimite`, más `bloquearEscenarioPorCambioBase` en el store). Además, `bloquearPaso` se llama 7 veces con listas de evidencia armadas a mano y repetidas ("…eventos.satisfechas.map(...)", `R-EJEC-6`, `V-13`).
10. **Rótulos duplicados**: fases con rótulo en `fases.ts:12-18` (`ROTULOS_FASE`), `proyeccionBarra.ts:371-387` (`tituloFase`, `rotuloProgresoFase`) y `BarraSimulacion.tsx:517-531` (`rotuloCortoFase`, `rotuloFase`), cinco tablas para cinco valores.
11. **Estilos inline gigantes** (unas 600 líneas de `s: EstilosBarra` con 61 claves tipadas a mano) más un `<style>` inyectado con pseudo-clases.
12. **Script de laboratorio con subida a producción**: URL de producción fija, credenciales parseadas por regex de un archivo del home y un modelo con id fijo `lab-sim-opm-v3`. Además está roto con el motor actual (sección 6.2).
13. **Referencias a documentos inexistentes** (HU-B0.x en `docs/historias-usuario-v2`, rutas OPCloud extraídas), que no permiten verificar las justificaciones.
14. **Doble perfil de estado inicial** (`estadosCurrentIniciales` "compatibilidad histórica" frente a `estadosCurrentDeclarados`): dos semánticas conviven por retrocompatibilidad de callers, no por necesidad OPM.
15. `agent/capabilityProfile.ts` usa rutas de tests como evidencia de capacidades: gobernanza autorreferente.

---

## 11. Partes de alta calidad para portar casi tal cual

- **`rng.ts`** (mulberry32): tal cual.
- **`plan.ts`**: inferencia de transiciones con rutas, expansión por rutas, orden por bandas, DFS de in-zoom con guardia de ciclo. Es compacto y correcto. Único cambio: operar sobre enlaces del **modelo** (no solo de la vista) o declararlo, y eliminar el fallback "primer estado".
- **El pipeline ECA de `pasoEfecto`**: su **orden** es el activo (evento → condición → habilitador → estado de entrada → efecto → tiempo → siguiente). Hay que portarlo como tabla de etapas con un constructor único de "resultado + evidencia".
- **`enablers.ts`**: la matriz satisfecha/incumplida/desconocida con precedencia `no-soportado > impedidos > no-conocidos` y la regla del agente físico.
- **`consumirEventosEvaluados`** (V-13) y la regla "un proceso omitido no invoca".
- **`fases.ts` + `foco.ts` + `animacionTokens.ts`**: proyecciones puras, testeables, fieles a R-OPD-SIM-1..5. El beat inicial "quieto" es un buen detalle de UX.
- **Vocabulario de resultados + límites epistémicos** (`ResultadoPasoEscenario`, `limitesConclusionEscenario` en `proyeccionBarra.ts:84-112`): es texto de producto honesto; conviene reusarlo.
- **`parametros.ts` (normalizador)**: validación estricta y mensajes claros. El muestreo es correcto salvo Poisson con λ grande.
- **`csv.ts`**: mínimo y correcto.
- Tests con valor semántico real: `condition-precedence.test.ts`, `enablers.test.ts`, `runner.test.ts` (condiciones, eventos, invocación, autoinvocación, límite, delegación V-37), `plan*.test.ts`, `simulacion-ramas.test.ts` (inmutabilidad entre ramas, semilla evolutiva), `valores.test.ts`, y e2e `12-beta2` (visual y tokens) y `scenario-explanation`.

---

## 12. Recomendación por pieza (keep / simplify / cut)

| Pieza | Recomendación | Justificación |
|---|---|---|
| Pipeline ECA (`runner.pasoEfecto`) | **simplify** | Conservar el orden y los 8 resultados; unificar constructores de traza; quitar código muerto; separar "resultado del paso" de "cómo avanza el cursor". |
| `Efecto<T>/Sucesor<T>`, `tomarUnico`, `desplegarArbol` | **cut** | Basta con `siguiente(ctx) → ctx` más `ramasXor(ctx) → Rama[]` para la decisión. El árbol solo tiene sentido si se construye un explorador real. |
| Modo `exhaustivo` en la UI | **cut** (o reconstruir como "Explorar ramas" que muestre N trazas) | Hoy engaña al usuario. |
| Modos `determinista` / `muestreo` + semilla | **keep** | La reproducibilidad es valiosa; mostrar la semilla solo en muestreo. |
| Conocimiento runtime | **simplify y ampliar** | Un solo mapa `existencia[obj]: presente/ausente/?` y otro `estado[obj]: id/?` **que evolucionan** (consumo → ausente, resultado → presente, transición → estado). Corrige las brechas 6.1 y 6.2. |
| `EscenarioSimulacion` | **simplify** → `CondicionesIniciales { existencia, estados, supuestos?: string[], proposito?: string }` | Quitar `revisionBase`, `capacidadesSoportadas`, `alcanceIds`, `parametros`, `id`. Invalidar por identidad de modelo o número de revisión real. Decidir si se persiste (sin ser canon, R-EJEC-3: snapshot declarado aparte). |
| Perfil sin escenario | **simplify** | Un solo perfil: designaciones → conocido. Sin designación → desconocido, pero **presentar antes de correr** "N datos sin declarar" con acción "asumir presentes o estado inicial". Nunca inventar el primer estado por id. |
| `plan.ts` | **keep** | Ver sección 11. |
| `fases`, `foco`, `animacionTokens` | **keep** (fusionar en un módulo "proyección runtime") | Puros y fieles. |
| `tiempo.ts` | **simplify + migrar** | Introducir `Proceso.duracion {min, esperada, max, distribucion?}` (contrato nuevo, migración de `Estado.duracion`) y umbrales derivados; sin distribución, usar la esperada. |
| `valores.ts` (copia A→B) | **simplify** o **cut** | No es semántica OPM declarada; mantenerla solo si se documenta como convención de herramienta. Valores iniciales: sí. |
| `parametros.ts` | **keep** (normalizador) / **simplify** (generador indexado por id, etiqueta "Objeto.atributo") | Contrato persistido. |
| `sociotecnico.ts`, `lifeline.ts`, `costoCategoria.ts`, `integracionHechos.ts`, `enriquecimiento.ts`, `index.ts` y sus tests-ley | **cut** | Sin consumidor. Si se quiere, la comparación de firma de frontera ejercida (F2↔S) puede quedar como test de integración del kernel. |
| `store/simulacion.ts` | **simplify** | Una guardia `conBaseVigente(fn)`; navegar al OPD del paso **actual**; reinicio sin promesa de undo. |
| `BarraSimulacion.tsx` | **simplify** (a unas 300 líneas) | Una fila: estado + proceso, controles (▶/⏸, paso, correr, reiniciar, salir), velocidad, muestreo y semilla en un menú, chips XOR, narrativa de una línea y traza desplegable. Estilos en CSS del design system; sin arqueología de bugs. |
| `PanelEscenarioSimulacion.tsx` | **simplify** → "Condiciones iniciales" | La misma tabla presencia/estado; propósito y supuestos opcionales; conclusión con evidencia y límites, **también sin escenario**. |
| `proyeccionBarra.ts` | **keep** (depurar rótulos duplicados) | Lógica pura bien testeada. |
| `BarraSimulacion.styles.test.ts` | **cut** | Fija CSS; la regresión visual la cubren los e2e. |
| Ports y viewmodels de simulación, numérica y timeline | **cut** | Paso directo. |
| `DialogoSimulacionNumerica.tsx` | **simplify** | Mantener N, tabla y CSV; indexar por id; sin tres capas. |
| `Timeline.tsx` | **simplify + corregir** | Editar `ordenInzoom` (bandas) directamente y dejar que el layout derive la Y; es el editor natural del orden declarado (R-IDP-0A). |
| `scripts/generar-laboratorio-simulacion.ts` | **simplify** → fixture de test que corra en `bun test`; **cut** `--subir` | Hoy está roto y no lo vigila ningún gate. |
| Integración tutor en la barra | **simplify** | Un único hook `useTutor("simulation", fase)`; no calcular intents en cada render dentro del componente. |

---

## 13. Forma mínima que conserva valor

**Kernel (~800–1.000 líneas, puro):**

```ts
type Saber<T> = { conocido: true; valor: T } | { conocido: false; motivo?: string };

interface Runtime {
  cursor: number;                       // índice en plan
  fase?: Fase;                          // solo visual
  existencia: Record<ObjId, Saber<"presente" | "ausente">>;
  estado: Record<ObjId, Saber<EstadoId>>;
  valores: Record<AtribId, ValorConcreto>;
  reloj: number;                        // segundos
  traza: Paso[];
  modo: "determinista" | "muestreo"; semilla?: number;
  terminado?: "completado" | "bloqueado";
}

type Resultado = "avance" | "espera" | "omision" | "evento-no-ocurrido"
               | "evento-perdido" | "indeterminado" | "no-soportado" | "truncado";

interface Paso { n: number; procesoId: Id; opdId: Id; resultado: Resultado;
  transiciones: TransicionEstadoSim[]; existencias: {obj: Id; antes?: string; despues: string}[];
  valores?: CambioValorRuntime[]; duracion?: number; excepcion?: EventoTemporalSim;
  motivo?: string; evidencia: { tipo: "enlace"|"estado"|"regla"|"supuesto"; id: string }[]; }
```

Funciones: `planificar(modelo, opdId)` (actual), `iniciar(modelo, opdId, condiciones?)`, `avanzar(modelo, rt, eleccionXor?)`, `ramasPendientes(modelo, rt)`, `correr(modelo, rt, limite=200)`, `proyectarFoco(modelo, rt)`. Etapas del paso como lista ordenada `[evento, condicion, habilitadores, precondicionEstado/existencia, aplicar, tiempo, siguiente]`, cada una devolviendo `continuar | {resultado, evidencia, consumirEventos?}`.

**Distinciones que no se pueden perder** (anti-sobresimplificación): omisión frente a espera (R-EJEC-7/8), evento no ocurrido frente a perdido (V-13), desconocido frente a ausente, no soportado frente a indeterminado, truncado frente a completado, delegación de frontera en in-zoom (V-37), invocación explícita y el hecho de que un proceso omitido no invoca (R-EJEC-9), rutas, XOR con elección manual y `1/n` solo al simular (R-FAN-PROB-1), marcas de runtime distintas de las persistentes (R-OPD-SIM-1..3), y runtime no persistido como canon (R-EJEC-3).

**UI mínima:** barra única con ▶/⏸ · paso · correr · reiniciar · salir · velocidad; chips XOR cuando hay decisión; una línea de narrativa "Fase: Proceso — detalle"; traza desplegable con resultado y evidencia; panel "Condiciones iniciales" (presencia y estado por objeto del plan, prellenado con designaciones y con los desconocidos marcados) accesible **antes** del primer paso. Muestreo y semilla dentro de un menú "Aleatoriedad". Numérica: diálogo con N, tabla y CSV por id.

---

## 14. Tests: qué conservar al reescribir

- Conservar como especificación ejecutable, reescritos contra la nueva API: precedencia de condición (`condition-precedence.test.ts`); habilitadores (`enablers.test.ts`, incluido "evento perdido" y "evento alternativo"); runner (condición, evento, excepción temporal, invocación, autoinvocación con salida y límite, delegación V-37, rutas); plan (orden Y y `ordenInzoom`, AND-join, in-zoom, transiciones y rutas); ramas (inmutabilidad entre sucesores, reproducibilidad por semilla, independencia entre abanicos); valores iniciales y semilla; foco por rutas.
- Añadir los casos que hoy fallan (sección 6): existencia dinámica (resultado → presente → habilitador satisfecho), agente sin estados sin escenario (debe pedir el dato, no bloquear en silencio), negación, efecto TS3, XOR de entrada frente a salida, abanico OR, modo que no cambia tras elegir una rama, colisión de nombres en la numérica, y Timeline que actualiza `ordenInzoom`.
- Eliminar: `BarraSimulacion.styles.test.ts`, la tautología de `scenario.test.ts:124`, `sociotecnico.test.ts`, `lifeline.test.ts`, y las leyes `enriquecimiento-cost`, `integracion-ss-fs` (salvo el caso de firma de frontera) y `tiempo-enriquecimiento` (salvo el sobretiempo, ya cubierto en `runner.test.ts:287`).
- e2e: conservar `12-beta2` (entrar/paso/correr/salir, XOR inline, tokens y halos, edición sellada) y `scenario-explanation` (desconocido ≠ ausente, espera por recurso), y reducir `30-simulacion-numerica`.

---

## 15. Decisiones abiertas (requieren criterio humano o del corpus)

1. ¿Qué presunción de existencia aplica sin condiciones iniciales? Opciones: (a) desconocido y pedirlo antes de correr (honesto, más fricción); (b) presentes todos los objetos que ningún proceso del plan genera, y ausentes los que algún proceso genera antes de su primer uso (inferencia estructural, declarada como supuesto visible). Recomendación: (b), mostrada como supuesto editable. Se apoya en R-INS-1: crear una cosa implica que *puede* existir una instancia.
2. Semántica ejecutable del modificador `no` según el corpus (¿negación de condición? ¿"no requiere" como ausencia de requisito?).
3. Migración de `Estado.duracion` a duración de proceso (R-PROC-3, R-EXC-2..4A) y de los umbrales de enlaces de excepción.
4. ¿Persistir las condiciones iniciales como snapshot declarado junto al modelo (sin ser canon)? Hoy se pierden al salir.
5. ¿Simular sobre enlaces del modelo o solo los visibles del OPD? Hoy es por vista, con riesgo de fidelidad en OPDs parciales.
6. ¿Se conserva la copia de valor atributo→atributo como convención de herramienta, o se sustituye por fórmulas declaradas (que el corpus pide que conserven "polaridad, unidad, fórmula y procedencia", manual A7)?
