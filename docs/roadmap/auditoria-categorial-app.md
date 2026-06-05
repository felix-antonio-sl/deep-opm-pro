---
titulo: "Auditoria categorial de la app"
fecha: 2026-05-07
estado: "diagnostico profundo"
metodo: "cat-thinking + ICAS-BoK + lectura de implementacion"
alcance: "app/src, app/e2e, docs/HANDOFF.md, docs/JOYAS.md, auditoria HU v2 previa"
---

# Auditoria categorial de la app

## 0. Dictamen ejecutivo

La app tiene un nucleo de dominio mucho mas sano que su superficie de store:
`Modelo` esta estructurado como documento OPM relativamente normalizado, las
operaciones de kernel son mayoritariamente puras y retornan `Resultado<T>`, la
serializacion JSON tiene validaciones referenciales fuertes y OPL/render ya
funcionan como proyecciones derivadas con cobertura amplia.

La deuda principal no esta en "falta de features" sino en **falta de naturalidad
entre capas** tras la correccion semantica reciente: el proyecto decidio que
`inzoom` y `unfold` aplican a cualquier `Thing`, pero una parte del schema, los
nombres publicos, validadores, reanclaje manual, timeline y e2e siguen fijando
la antigua matriz `proceso -> descomposicion` y `objeto -> despliegue`.

La segunda deuda estructural es que el store no esta factorizado como una suma
de interfaces limpias sino como un objeto total compartido: `OpmStore` concentra
modelo, UI, persistencia, tabs, mapa, OPL, seleccion, asistente y efectos. Esto
convierte los slices en cortes nominales, no en fronteras composicionales.

Verificacion base ejecutada antes del informe:

```bash
cd app && bun run check
# tsc --noEmit
# bun test src
# 884 pass / 0 fail / 2964 expect() / 87 archivos
```

## 1. Reformulacion categorial

Lectura minima suficiente:

- `C_OPM`: categoria del modelo OPM local. Objetos: `Modelo`, `Opd`,
  `Entidad`, `Estado`, `Enlace`, `Apariencia`, `AparienciaEnlace`, `Abanico`.
  Morfismos: operaciones de modelo que preservan integridad.
- `C_JSON`: documentos serializados versionados.
- `C_Render`: celdas JointJS proyectadas desde un OPD y contexto UI.
- `C_OPL`: oraciones OPL-ES interactivas y texto OPL editable.
- `C_UI`: estados de interaccion, seleccion, tabs, persistencia local,
  preferencias y acciones.

Funtores principales reales:

| Funtor | Implementacion | Lectura |
|---|---|---|
| `Json: C_OPM -> C_JSON` | `exportarModelo` | Debe preservar estructura OPM lossless salvo normalizacion canonica. |
| `Hydrate: C_JSON -> C_OPM` | `hidratarModelo` | Parcial: valida y normaliza documentos. |
| `Render: C_OPM x OPD x UIContext -> C_Render` | `proyectarModeloAJointCells` | Proyeccion visual; deberia ser pura respecto al modelo. |
| `Opl: C_OPM x OPD -> C_OPL` | `generarOpl`, `generarOplInteractivo` | Proyeccion linguistica derivada. |
| `ReverseOpl: Text -> Patch*` | parser/planificador/aplicador OPL | Lente parcial segura, no inversa total. |
| `Commit: Modelo x Modelo -> StorePatch` | `commitModelo` | Frontera Kleisli de historial, dirty, tabs y efectos UI. |

La propiedad critica para el corte actual es naturalidad:

```text
Modelo viejo  --refactor Thing-->  Modelo nuevo
    |                                 |
    | Render/JSON/OPL/Store/Tests      | Render/JSON/OPL/Store/Tests
    v                                 v
Proyecciones viejas  ------->  Proyecciones nuevas
```

Hoy ese cuadrado no conmuta en todos los bordes: el kernel ya acepta mas casos,
pero validadores, comandos auxiliares, pruebas browser y nombres publicos todavia
arrastran parte de la semantica anterior.

## 2. Corpus ICAS consultado

La lectura usa las siguientes URNs del corpus ICAS-BoK:

- `urn:fxsl:kb:icas-composicion`: composicion, identidad, asociatividad y dolor
  de no composicion.
- `urn:fxsl:kb:icas-preservacion`: funtores, full/faithful, funtores
  forgetful/free, schema/instance, serializacion como preservacion.
- `urn:fxsl:kb:icas-comparacion`: transformaciones naturales, refactoring,
  versionado y equivalencia vs igualdad.
- `urn:fxsl:kb:icas-universales`: productos, coproductos, pullbacks, pushouts y
  diseno como solucion universal suficiente.
- `urn:fxsl:kb:icas-efectos`: monadas/Kleisli, efectos explicitos, coalgebras y
  bisimulacion.
- `urn:fxsl:kb:icas-escala`: operads, wiring diagrams, structured cospans e
  interfaces explicitas para componer a escala.
- `urn:fxsl:kb:icas-lifecycle`: drift como perdida de naturalidad, deuda tecnica
  como perdida de restricciones.
- `urn:fxsl:kb:icas-procesos`: requisitos, diseno, construccion, pruebas,
  mantenimiento; implementacion como funtor de realizacion.
- `urn:fxsl:kb:icas-calidad-riesgo`: atributos de calidad como funtores de
  medicion y riesgo como composicion con incertidumbre.
- `urn:fxsl:kb:icas-patrones`: God Object, tight coupling, anti-patterns y
  distincion entre heuristica y formalizacion.

## 3. Evidencia positiva

### 3.1 Nucleo de modelo con buena forma

`Modelo` es un agregado OPM claro y normalizado: raiz, `opds`, `entidades`,
`estados`, `enlaces`, `abanicos`, metadata y `nextSeq`
(`app/src/modelo/tipos/modelo.ts:26`). Esta forma permite razonar como categoria
de instancia sobre un schema local.

`Opd` es correctamente una vista: contiene apariencias de entidades y enlaces,
jerarquia padre/hijo y orden local opcional
(`app/src/modelo/tipos/opd.ts:13`). Esta separacion identidad/apariencia es una
decision estructural fuerte.

`Enlace` modela extremos polimorfos entidad/estado, tipos canonicos,
multiplicidad, estilo, modificadores y derivacion externa
(`app/src/modelo/tipos/enlace.ts:14`, `app/src/modelo/tipos/enlace.ts:37`,
`app/src/modelo/tipos/enlace.ts:49`). Esto evita colapsar links visuales y links
semanticamente reales.

### 3.2 Serializacion fuerte

`exportarModelo` normaliza antes de emitir JSON versionado
(`app/src/serializacion/json.ts:46`). `hidratarModelo` parsea, valida,
normaliza y devuelve `Resultado<Modelo>` (`app/src/serializacion/json.ts:59`).

`validarReferenciasOpd` verifica que:

- cada refinamiento apunta a un OPD existente y contiene apariencia de la entidad
  refinada;
- los enlaces derivados tienen refinamiento y enlace padre validos;
- cada apariencia de enlace tiene endpoints visibles;
- cada enlace tiene al menos una apariencia.

Evidencia: `app/src/serializacion/validarIntegridad.ts:24`.

Lectura formal: este borde del sistema se aproxima bien a un funtor faithful
`C_OPM -> C_JSON`, con normalizacion como equivalencia controlada
(`urn:fxsl:kb:icas-preservacion`).

### 3.3 Kernel de refinamiento ya corrigio parte de la semantica

`descomponerProceso` documenta que conserva el nombre por compatibilidad pero
ahora opera sobre cualquier `Thing`
(`app/src/modelo/operaciones/refinamiento/descomposicion.ts:20`). Crea
refinadores del mismo tipo que la cosa refinada
(`app/src/modelo/operaciones/refinamiento/descomposicion.ts:175`).

`desplegarObjeto` documenta la misma correccion para `unfold`
(`app/src/modelo/operaciones/refinamiento/despliegue.ts:19`) y tambien crea
partes iniciales del mismo tipo que el padre
(`app/src/modelo/operaciones/refinamiento/despliegue.ts:146`).

Hay helpers genericos como `cosaDescompuestaEnOpd`
(`app/src/modelo/operaciones/refinamiento/helpers.ts:93`), lo que indica que la
direccion de arquitectura ya empezo a moverse hacia `Thing`.

### 3.4 OPL reverse es conservador

El planificador OPL no borra hechos por ausencia de lineas
(`app/src/opl/parser/planificar.ts:32`) y marca metadata/contexto no soportado
como diagnostico, no como mutacion falsa
(`app/src/opl/parser/planificar.ts:62`). El aplicador ordena patches no-enlace
antes de enlaces para resolver dependencias locales
(`app/src/opl/parser/aplicar.ts:19`).

Lectura formal: esto no es una equivalencia `OPL <-> Modelo`; es una lente
parcial segura. Esa es una buena decision. El riesgo es no declararla
explicitamente como tal en todos los puntos de producto.

### 3.5 Cobertura unitaria amplia

La verificacion local pasa:

- 884 tests unitarios.
- 0 fallos.
- 2964 expectations.
- TypeScript estricto limpio.

El suite ya incluye casos positivos de matriz ampliada para refinamiento en
kernel. El problema remanente no es ausencia total de pruebas, sino falta de
cierre UI/e2e y leyes transversales para los funtores principales.

## 4. Hallazgos

### F1. `Entidad.refinamiento` es un cociente no faithful

Severidad: P1 estructural.

Tipo de lectura: formal.

Evidencia:

- `TipoRefinamiento = "descomposicion" | "despliegue"`
  (`app/src/modelo/tipos/entidad.ts:17`).
- `RefinamientoEntidad` tiene un solo `{ tipo, opdId, modo? }`
  (`app/src/modelo/tipos/entidad.ts:24`).
- `Entidad` contiene `refinamiento?: RefinamientoEntidad`
  (`app/src/modelo/tipos/entidad.ts:51`).
- La operacion de inzoom rechaza una entidad que ya tenga otro refinamiento
  (`app/src/modelo/operaciones/refinamiento/descomposicion.ts:57`).
- La operacion de unfold hace lo mismo
  (`app/src/modelo/operaciones/refinamiento/despliegue.ts:61`).
- El handoff reconoce que OPCloud puede mantener inzoom y unfold separados y que
  la paridad queda pendiente (`docs/HANDOFF.md:81`).

Problema categorial:

`inzoom` y `unfold` no son dos valores alternativos de una suma excluyente; son
dos posibles estructuras sobre una misma cosa. El schema actual usa:

```text
Refinamiento = Inzoom + Unfold
Entidad -> Maybe Refinamiento
```

Pero el dominio que se quiere aproximar es mas bien:

```text
Refinamientos = Inzoom? x Unfold?
Entidad -> Refinamientos
```

El schema actual identifica estados distintos del mundo:

```text
Entidad con inzoom y sin unfold
Entidad con unfold y sin inzoom
Entidad con ambos
```

La tercera posibilidad no existe. Por eso el funtor desde evidencia OPCloud/SSOT
hacia el modelo local no es faithful: colapsa o prohibe distinciones reales
(`urn:fxsl:kb:icas-preservacion`, `urn:fxsl:kb:icas-universales`).

Impacto:

- Impide paridad con OPCloud para una misma cosa con ambos refinamientos.
- Fuerza reglas artificiales en operaciones y UI.
- Hace mas dificil escribir leyes de round-trip si los fixtures futuros traen
  ambos slots.

Recomendacion:

Migrar a slots separados cuando el MVP-alpha necesite paridad real:

```ts
interface RefinamientosEntidad {
  inzoom?: { opdId: Id };
  unfold?: { opdId: Id; modo: ModoDespliegueObjeto };
  refineable?: boolean;
}
```

Mantener compatibilidad con `refinamiento` en hidratacion v0 y emitir v1 cuando
se haga la migracion. Si se decide no migrar todavia, documentar el single-slot
como restriccion deliberada del producto, no como semantica OPM.

### F2. La transformacion "refinamiento sobre Thing" no es natural en todas las capas

Severidad: P1 funcional/arquitectonica.

Tipo de lectura: formal.

Evidencia positiva:

- Inzoom ya acepta cualquier entidad en kernel
  (`app/src/modelo/operaciones/refinamiento/descomposicion.ts:20`).
- Unfold ya acepta cualquier entidad en kernel
  (`app/src/modelo/operaciones/refinamiento/despliegue.ts:19`).
- Helper generico `cosaDescompuestaEnOpd`
  (`app/src/modelo/operaciones/refinamiento/helpers.ts:93`).

Evidencia de deriva:

- `contextoDescomposicion` solo detecta padres `tipo === "proceso"`
  (`app/src/modelo/validaciones.ts:398`).
- `validarSubprocesoTimeline` exige contorno de proceso y subprocesos
  (`app/src/store/runtime.ts:143`).
- El reanclaje manual de enlaces externos usa `procesoDescompuestoEnOpd` y exige
  endpoint `proceso` (`app/src/modelo/operaciones/enlaces.ts:280`,
  `app/src/modelo/operaciones/enlaces.ts:286`).
- `procesoDescompuestoEnOpd` permanece como API especifica y filtra proceso
  (`app/src/modelo/operaciones/refinamiento/helpers.ts:131`).
- Los e2e cubren "descompone proceso" y "despliega objeto"
  (`app/e2e/05-refinamiento-y-plegado.spec.ts:49`,
  `app/e2e/05-refinamiento-y-plegado.spec.ts:173`), pero el handoff declara
  pendientes e2e para inzoom de objeto y unfold de proceso
  (`docs/HANDOFF.md:136`).

Problema categorial:

Hay una transformacion natural prevista:

```text
OldRefinement(process-inzoom, object-unfold) => ThingRefinement(thing-inzoom, thing-unfold)
```

Pero algunos consumidores todavia aplican el funtor viejo. Entonces:

```text
Validar(ThingRefinement(modelo)) != ThingRefinement(Validar(modelo))
```

Esta es perdida de naturalidad en sentido de `urn:fxsl:kb:icas-comparacion` y
drift de lifecycle en `urn:fxsl:kb:icas-lifecycle`.

Impacto:

- Object-inzoom puede existir en kernel y JSON, pero no recibe las mismas
  validaciones contextuales.
- Process-unfold puede existir en kernel, pero no esta protegido por e2e UI.
- Futuras contribuciones pueden reintroducir restricciones de tipo por nombres
  legacy.

Recomendacion:

Crear abstracciones canonicas:

- `descomponerCosa` como API primaria; `descomponerProceso` queda alias.
- `desplegarCosa` como API primaria; `desplegarObjeto` queda alias.
- `cosaDescompuestaEnOpd` como helper base; `procesoDescompuestoEnOpd` solo para
  reglas proceduralmente especificas.
- `entidadesInternasOrdenadasDeRefinamiento` como base; `subprocesos...` solo
  cuando la regla semantica exige procesos.

Luego agregar dos e2e obligatorios:

- object-inzoom desde UI, export JSON, OPL y quitar refinamiento.
- process-unfold desde UI, export JSON, links estructurales y quitar refinamiento.

### F3. El store es un God Object tipado como composicion

Severidad: P1 arquitectonica.

Tipo de lectura: heuristica fuerte, anclada en patron ICAS.

Evidencia:

- `store.ts` compone slices por spread en un unico Zustand store
  (`app/src/store.ts:17`).
- `OpmStore` concentra estado y acciones de dominios heterogeneos
  (`app/src/store/tipos.ts:216`).
- `store/tipos.ts` importa dependencias de modelo, persistencia, OPL, render,
  canvas, tabs, workspace y UI en un unico archivo
  (`app/src/store/tipos.ts:1`).
- Los aliases de slice son `Partial<OpmStore>`
  (`app/src/store/tipos.ts:598`).

Problema categorial:

Un slice deberia ser un structured cospan: expone una interfaz local y se pega
con otros slices a traves de puntos de conexion explicitos. Aqui cada slice
recibe potencialmente todo `OpmStore`. Eso hace que la frontera sea nominal, no
composicional.

En terminos de `urn:fxsl:kb:icas-escala`, las interfaces no estan calibradas
para composicion a escala. En terminos de `urn:fxsl:kb:icas-patrones`, esto se
aproxima al anti-patron God Object: un objeto central permite todo, por lo que la
estructura no impone restricciones reales.

Impacto:

- Dificulta aislar cambios de store sin regresiones.
- Hace costosa la auditoria de efectos.
- Reduce la capacidad de agentes paralelos: muchos cambios tocan el mismo
  contrato gigante.
- Hace que `Partial<OpmStore>` oculte dependencias reales.

Recomendacion:

Refactor incremental, no big-bang:

```ts
type ModeloSlice = ModeloState & ModeloActions;
type SeleccionSlice = SeleccionState & SeleccionActions;
type PersistenciaSlice = PersistenciaState & PersistenciaActions;

type OpmStore =
  & ModeloSlice
  & SeleccionSlice
  & PersistenciaSlice
  & ...
```

Cada slice debe importar solo:

- sus tipos propios;
- las acciones de kernel que realmente usa;
- interfaces de efectos, no singletons.

La meta no es "mas archivos"; es que cada frontera sea full/faithful: todo lo
que el slice puede hacer esta en su interfaz, y nada mas.

### F4. Runtime, historial y autosalvado viven como efectos implicitos

Severidad: P1/P2.

Tipo de lectura: formal para efectos, heuristica para prioridad.

Evidencia:

- `snapshotGuardado`, `undoStack`, `redoStack`, `autosalvadoControl` y `storeApi`
  son variables de modulo (`app/src/store/runtime.ts:48`).
- Cambiar pestana rehidrata snapshot/undo y borra redo
  (`app/src/store/runtime.ts:84`).
- `commitModelo` consulta `storeApi`, serializa para detectar no-op, muta
  `undoStack`, calcula mapa si aplica y luego llama `estadoModelo`
  (`app/src/store/runtime.ts:258`).
- `estadoModelo` calcula dirty serializando y actualiza snapshots de pestanas
  desde estado global (`app/src/store/runtime.ts:303`).

Problema categorial:

El kernel de modelo vive razonablemente en `C_OPM`, pero `commitModelo` opera en
una categoria Kleisli de efectos: historial, dirty, tabs, cache de mapa,
persistencia/autosalvado, store global. Esa categoria no esta nombrada ni
tipada como tal.

`urn:fxsl:kb:icas-efectos` recomienda hacer explicitos los efectos para poder
componerlos. Hoy los efectos son correctos por disciplina y tests, no por
frontera estructural.

Impacto:

- Dificulta razonar sobre concurrencia de tabs.
- Dificulta pruebas de propiedades de historial como ley general.
- Hace que acciones aparentemente puras puedan depender de estado global.

Recomendacion:

Introducir una interfaz de runtime:

```ts
interface RuntimeEffects {
  history: HistoryService;
  snapshots: SnapshotService;
  autosave: AutosaveService;
  mapCache: MapCacheService;
}
```

El store recibe estos efectos al crearse. Las operaciones de kernel quedan puras.
Las acciones UI son morfismos Kleisli declarados:

```text
Action: StoreState -> Effect<StoreState>
KernelOp: Modelo -> Resultado<Modelo>
```

### F5. La proyeccion JointJS no es completamente pura por opciones globales

Severidad: P2. Resuelto en Corte 7.

Tipo de lectura: formal.

Evidencia:

- Corte 7 retiro `opcionesProyeccionDesdeEntornoLegacy` y
  `fijarOpcionesProyeccionGlobal`.
- `proyectarModeloAJointCells` ahora usa defaults canonicos locales y
  `JointCanvas` pasa opciones explicitas desde el estado UI.

Problema categorial:

`Render` deberia ser un funtor parametrizado explicitamente:

```text
Render(modelo, opd, uiContext) -> cells
```

Cuando lee `globalThis`, dos llamadas con los mismos argumentos explicitos pueden
producir salidas distintas. Eso rompe preservacion funcional local
(`urn:fxsl:kb:icas-preservacion`) y convierte render en efecto implicito
(`urn:fxsl:kb:icas-efectos`).

Impacto:

- Tests pueden pasar por estado global accidental.
- SSR/futuras ejecuciones multi-instancia quedan fragiles.
- La proyeccion es menos reutilizable para export, preview o workers.

Recomendacion:

Hacer obligatorio el argumento `opciones` en el borde interno y dejar el default
global solo en un adapter de UI legacy. Objetivo:

```ts
proyectarModeloAJointCells(modelo, opdId, seleccion, enlace, hover, seleccionados, opciones)
```

sin default global en la funcion de dominio/render core.

### F6. OPL reverse es una lente parcial, pero sus leyes no estan suficientemente institucionalizadas

Severidad: P2.

Tipo de lectura: formal.

Evidencia:

- No borra por ausencia (`app/src/opl/parser/planificar.ts:32`).
- Metadata se diagnostica pero no se aplica
  (`app/src/opl/parser/planificar.ts:62`).
- Aplicador soporta un subconjunto de patches
  (`app/src/opl/parser/aplicar.ts:19`).

Problema categorial:

El sistema podria confundirse si alguien espera equivalencia:

```text
parse(generar(modelo)) ~= modelo
```

La ley correcta es mas debil:

```text
aplicar(planificar(generar(modelo))) no destruye hechos
```

y para edits soportados:

```text
generar(aplicar(patch_soportado(modelo))) refleja el patch
```

Esto es una lente parcial con seguridad monotona, no una isomorfia
(`urn:fxsl:kb:icas-comparacion`, `urn:fxsl:kb:icas-efectos`).

Impacto:

- Riesgo de HU o UI prometiendo round-trip total.
- Riesgo de patches futuros que borren por ausencia sin pasar por ley.

Recomendacion:

Crear suite de leyes OPL reverse:

- `generate -> plan -> apply` no produce deletes implicitos.
- Edicion de nombre/estado/enlace soportado modifica solo el hecho declarado.
- Metadata/contexto parseado no muta modelo mientras siga unsupported.
- Texto incompleto produce diagnostico, no mutacion destructiva.

### F7. La trazabilidad ejecutable aun depende demasiado de tokens detector

Severidad: P2.

Tipo de lectura: heuristica fuerte.

Evidencia:

- El detector de proyeccion fue migrado a evidencias reales en composers durante
  Corte 7; ya no requiere strings sinteticos en `proyeccion.ts`.
- `serializacion/json.ts` conserva `CLAVES_DETECTOR_SERIALIZACION_JSON`
  (`app/src/serializacion/json.ts:13`).
- La auditoria HU v2 previa instala invariantes sobre specs y migracion, pero no
  sustituye leyes app-level para todos los funtores
  (`docs/historias-usuario-v2/07-AUDITORIA-CATEGORIAL.md:45`).

Problema categorial:

La trazabilidad deberia ser un funtor:

```text
Spec -> Code -> TestEvidence
```

Cuando parte de la evidencia se satisface por strings detector, el funtor no es
faithful sobre comportamiento: preserva marca textual, no necesariamente ley
operacional (`urn:fxsl:kb:icas-escala`, `urn:fxsl:kb:icas-lifecycle`).

Impacto:

- Los resúmenes documentales pueden parecer más cerrados que la UI real.
- Comentarios de compatibilidad pueden fosilizar deuda.

Recomendacion:

Para cada borde critico, crear test-law con nombre estable y asociarlo al ledger:

- `law-json-roundtrip`.
- `law-render-stable-metadata`.
- `law-opl-safe-lens`.
- `law-refinement-thing-matrix`.
- `law-store-undo-atomicity`.

Luego los detectores pueden apuntar a tests, no a tokens sueltos.

### F8. Calidad y riesgo no estan modelados como funtores de medicion

Severidad: P2.

Tipo de lectura: heuristica.

Evidencia:

- Handoff declara bundle principal sobre objetivo historico
  (`docs/HANDOFF.md:148`).
- Handoff declara smoke browser verde en el corte, pero el check habitual
  ejecutado aqui solo cubre typecheck + unit tests (`docs/HANDOFF.md:104`).
- Hay Playwright smoke, screenshots y browser tests, pero no una tabla viva de
  umbrales de calidad enlazada a releases.

Problema categorial:

`urn:fxsl:kb:icas-calidad-riesgo` permite leer calidad como funtor de medicion:

```text
Build -> {bundleSize, smokePass, visualDiff, latency, invariantCoverage}
```

Hoy esas mediciones existen parcialmente, pero no como contrato de calidad
versionado.

Impacto:

- El proyecto puede crecer sin saber que atributo de calidad se degrado.
- Decisiones sobre chunks, render y e2e quedan reactivas.

Recomendacion:

Agregar `docs/roadmap/quality-ledger.md` o seccion equivalente en roadmap con:

- umbral bundle inicial;
- smoke browser requerido antes de corte visual;
- tests law requeridos por tipo de cambio;
- metrica de cobertura de matriz Thing refinement.

### F9. Nombres legacy inducen drift semantico

Severidad: P2/P3.

Tipo de lectura: heuristica fuerte.

Evidencia:

- `descomponerProceso` es ahora Thing-inzoom pero su nombre conserva `Proceso`
  (`app/src/modelo/operaciones/refinamiento/descomposicion.ts:23`).
- `desplegarObjeto` es ahora Thing-unfold pero su nombre conserva `Objeto`
  (`app/src/modelo/operaciones/refinamiento/despliegue.ts:22`).
- El handoff reconoce el riesgo de que nombres legacy induzcan errores futuros
  (`docs/HANDOFF.md:169`).

Problema categorial:

El lenguaje publico es parte del funtor `Code -> DeveloperMentalModel`. Si el
nombre no preserva la semantica, el funtor no es faithful: dos conceptos se
confunden por API.

Impacto:

- Nuevas funciones pueden usar helpers especificos de proceso/objeto por inercia.
- Agentes y humanos pueden reintroducir restricciones viejas.

Recomendacion:

Introducir aliases canonicos y migrar consumidores gradualmente:

- `descomponerCosa` -> implementacion primaria.
- `descomponerProceso` -> alias deprecated interno.
- `desplegarCosa` -> implementacion primaria.
- `desplegarObjeto` -> alias deprecated interno.

No hacer esta migracion antes de los e2e faltantes; primero cerrar evidencia,
luego renombrar con confianza.

## 5. Patron canonico propuesto

La arquitectura objetivo minima no exige reescribir la app. Exige nombrar las
fronteras que ya existen:

```text
               +----------------+
               |   C_OPM Core   |
               | Modelo + Ops   |
               +--------+-------+
                        |
      +-----------------+-----------------+
      |                 |                 |
      v                 v                 v
   C_JSON            C_OPL            C_Render
 export/hydrate      generate          Joint cells
 validate            partial lens      explicit options
      |                 |                 |
      +-----------------+-----------------+
                        |
                        v
                 C_UI / Kleisli
          Store actions + effects explicit
```

Principios:

1. `Modelo` y operaciones de kernel permanecen puros.
2. JSON, OPL y render son proyecciones explicitas del modelo.
3. OPL reverse se declara lente parcial segura, no inversa.
4. Store es frontera de efectos, no dominio.
5. Slices son structured cospans: interfaces locales que se pegan por contratos
   pequenos.
6. Refinamiento de Thing se modela como producto de capacidades (`inzoom? x
   unfold?`), no como opcion excluyente si se busca paridad OPCloud.

## 6. Checklist de coherencia

| Eje | Estado | Evidencia | Accion |
|---|---|---|---|
| Identidad/apariencia | Verde | `Modelo`, `Opd`, `Apariencia` separados | Mantener. |
| JSON lossless | Verde | Validacion referencial y tests | Agregar law test explicito. |
| Render OPM | Verde/amarillo | Cobertura amplia, pero default global | Parametrizar opciones. |
| OPL generate | Verde | Tests por tipos canonicos | Mantener. |
| OPL reverse | Amarillo | Lente parcial segura | Documentar leyes y ampliar tests. |
| Refinamiento Thing | Amarillo/rojo | Kernel avanzado, capas residuales viejas | Cerrar naturalidad. |
| Schema refinamiento | Rojo si paridad OPCloud es requerida | Single-slot | Decidir/migrar slots. |
| Store slices | Amarillo/rojo | `Partial<OpmStore>` | Refactor incremental. |
| Efectos runtime | Amarillo | singletons de modulo | Extraer interfaces de efectos. |
| E2E matriz Thing | Amarillo/rojo | faltan object-inzoom/process-unfold | Agregar smokes. |
| Calidad medible | Amarillo | bundle pendiente, smoke no siempre incluido | Ledger de calidad. |

## 7. Plan recomendado

### Fase A. Cerrar naturalidad de refinamiento Thing

Objetivo: que kernel, validadores, store, UI, OPL, render y e2e acepten la misma
semantica.

Tareas:

- Crear APIs canonicas `descomponerCosa` y `desplegarCosa`.
- Cambiar `contextoDescomposicion` para detectar cosas descompuestas cuando la
  regla sea generica.
- Mantener helpers process-only solo donde la regla OPM sea proceduralmente de
  procesos.
- Agregar e2e object-inzoom.
- Agregar e2e process-unfold.
- Agregar law test `law-refinement-thing-matrix`: las cuatro combinaciones
  objeto/proceso x inzoom/unfold atraviesan JSON, OPL y render sin rechazo.

Criterio de salida:

```bash
cd app && bun run check
cd app && bun run browser:smoke
```

con evidencia especifica de las cuatro combinaciones.

### Fase B. Decidir schema de slots separados

Objetivo: no dejar que el single-slot sea ambiguedad silenciosa.

Opciones:

- Mantener single-slot hasta MVP-alpha y documentarlo como restriccion.
- Migrar ahora a `refinamientos.inzoom` y `refinamientos.unfold`.

Recomendacion: si el roadmap inmediato va a crear fixtures o import/export
cercano a OPCloud, migrar ahora. Si el objetivo es cerrar flujo de modelador
MVP-alpha sin import OPCloud, mantener single-slot una iteracion mas, pero
blindarlo con decision explicita en roadmap.

### Fase C. Leyes de proyeccion

Objetivo: convertir trazabilidad en comportamiento ejecutable.

Tests law recomendados:

- `law-json-roundtrip`: `hidratar(exportar(modelo))` equivale a
  `normalizar(modelo)`.
- `law-render-stable-metadata`: ids/metadata OPM sobreviven a proyeccion.
- `law-opl-safe-lens`: OPL reverse no borra por ausencia.
- `law-store-undo-atomicity`: cada accion compuesta publica entra como una unidad
  de undo.
- `law-refinement-removal`: quitar refinamiento remueve subarbol y no deja
  enlaces/estados huerfanos.

### Fase D. Factorizar store sin big-bang

Objetivo: reducir blast radius.

Orden sugerido:

1. Extraer tipos `State`/`Actions` por slice sin cambiar runtime.
2. Reemplazar `Partial<OpmStore>` por interseccion de slices reales.
3. Mover imports operacionales desde `store/tipos.ts` hacia slices concretos.
4. Introducir interfaces de efectos para historial/snapshot/autosave.
5. Solo despues, reorganizar archivos si todavia aporta valor.

### Fase E. Purificar proyeccion render

Objetivo: que `Render` sea reproducible por argumentos.

Tareas:

- Hacer `OpcionesProyeccion` explicito en llamadas internas.
- Encapsular `globalThis` en adapter UI legacy.
- Agregar test que demuestre que dos opciones distintas producen diferencias
  esperadas y que el estado global no contamina llamadas puras.

### Fase F. Ledger de calidad

Objetivo: medir atributos antes de que se degraden.

Metricas iniciales:

- bundle principal;
- tiempo `bun run check`;
- browser smoke pass/fail;
- cobertura de matriz Thing refinement;
- numero de law tests activos;
- numero de comentarios detector legacy restantes.

## 8. Alternativas evaluadas

### Alternativa 1. No tocar arquitectura y seguir features

Ventaja: velocidad inmediata.

Costo: aumenta drift. La deuda actual no es estetica; afecta naturalidad entre
schema, kernel, UI y tests. Seguir features encima de la matriz incompleta puede
duplicar trabajo.

Decision: no recomendada salvo hotfix urgente.

### Alternativa 2. Gran refactor del store ahora

Ventaja: resolveria una deuda real.

Costo: alto blast radius antes de cerrar semantica de refinamiento. Riesgo de
romper comportamiento mientras todavia faltan e2e de Thing refinement.

Decision: no recomendable como primera accion. Preparar interfaces, pero cerrar
semantica antes.

### Alternativa 3. Migrar schema de refinamiento ahora

Ventaja: corrige la objecion formal mas fuerte y evita compatibilidad rota con
fixtures futuros.

Costo: afecta serializacion, validadores, render, OPL, store, tests y acciones
de quitar/refinar.

Decision: recomendable si el proximo ciclo toca import/export OPCloud o
refinamientos mixtos. Si no, se puede diferir una iteracion con decision
documentada.

### Alternativa 4. Cerrar primero leyes y e2e, luego migrar schema

Ventaja: reduce riesgo. Las leyes hacen visible que se rompe cuando se cambie el
schema.

Costo: durante una iteracion sigue existiendo single-slot.

Decision: recomendacion principal para MVP-alpha.

## 9. Distincion formal vs heuristica

Formal o cuasi-formal:

- F1: single-slot de refinamiento no puede representar producto `inzoom? x
  unfold?`; es perdida de faithful representation.
- F2: Thing refinement no conmuta entre kernel, validadores, store y e2e; es
  perdida de naturalidad.
- F4: runtime/store opera en categoria de efectos no explicitada.
- F5: render con `globalThis` no es una funcion pura de argumentos explicitos.
- F6: OPL reverse es lente parcial segura, no isomorfia.

Heuristica disciplinada:

- F3: store como God Object. El diagnostico se apoya en anti-patron y evidencia
  de acoplamiento, no en prueba formal.
- F7: tokens detector como trazabilidad debil. Es riesgo de proceso, no bug
  funcional inmediato.
- F8: ledger de calidad. Es governance de producto, no requisito semantico OPM.
- F9: nombres legacy. Es deuda de modelo mental, no fallo runtime actual.

## 10. Orden de ataque

Orden recomendado:

1. `law-refinement-thing-matrix` + e2e object-inzoom/process-unfold.
2. Generalizar validadores y helpers que siguen process-only por inercia.
3. Decidir explicitamente schema single-slot vs slots separados.
4. Si se migra schema, hacerlo con hidratacion backwards-compatible.
5. Convertir tokens detector criticos en law tests.
6. Empezar refactor incremental de store por tipos de slice.
7. Extraer efectos runtime.
8. Purificar proyeccion JointJS.
9. Crear ledger de calidad.

Conclusion: el nucleo de dominio esta lo bastante solido para seguir
construyendo, pero el siguiente incremento deberia cerrar naturalidad antes de
sumar features grandes. La app no necesita una reescritura; necesita que sus
fronteras categoricas se vuelvan explicitas y testeables.
