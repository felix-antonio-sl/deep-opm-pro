# Dossier — Núcleo del modelo OPM (`app/src/modelo`)

Área: tipos canónicos, operaciones puras del kernel, refinamiento (in-zoom / unfold),
abanicos, estados, enlaces, apariencias, plegado, integridad referencial y helpers
geométricos que el kernel usa. Todo lo citado fue leído en el código; los bugs marcados
**[VERIFICADO]** se reprodujeron con un script de sonda (`scratchpad/probe.ts`,
`scratchpad/probe2.ts`) ejecutado con `bun` contra el código real, sin tocar el repo.

Cifras: ~25 k líneas no-test en `modelo/` (todo el directorio); el subconjunto de esta área
son ~9,4 k líneas en `modelo/operaciones/` + `modelo/tipos/` y ~4 k en los módulos sueltos
listados. Tests del área: ~12,5 k líneas (`operaciones.test.ts` solo = 94 KB).
El barrel `modelo/operaciones.ts` tiene 41 consumidores no-test y `modelo/tipos` 263.

Nota sobre el canon: el corpus KORA (`/home/felix/kora-knowledge`, resuelto por
`docs/canon-opm/resolutor-urn.json`) **no está instalado** en este entorno. Las reglas se
catalogan con el ID que el propio código cita (R-OPD-*, AP-*, V-*, R-EXC-*); su contraste
línea a línea contra la SSOT queda pendiente para quien tenga el corpus.

---

## 1. Resumen ejecutivo

1. **El núcleo semántico es bueno y portable.** `Entidad/Estado/Enlace/Opd/Apariencia`
   con `Record<Id, T>`, operaciones puras `Modelo -> Resultado<Modelo>`, y
   `validarFirmaEnlace` (`operaciones/helpers.ts:58-148`) como fuente única de la firma
   de enlaces. La dirección de dependencias se respeta: ningún archivo no-test de
   `modelo/` importa de `store/`, `ui/`, `opl/`, `render/` o `serializacion/`.
2. **La semántica está contaminada con geometría.** `ExtremoEnlace.portId` (un
   puerto visual) vive en el `Enlace` semántico global, pero la geometría del puerto
   vive por aparición (`Apariencia.ports`). Además, la pertenencia a un abanico
   depende de compartir **exactamente** el mismo `portId` (`abanicos.ts:384-391`).
   `Estado` guarda `x/y/width/height` globales. Qué subproceso es "primero" o "interno"
   se decide por coordenadas (`dentroDe`, `compararOrdenTemporal`) y se re-deriva en
   cada arrastre.
3. **Se materializan como hechos cosas que son proyecciones.** Los enlaces externos
   "derivados" del in-zoom se escriben como `Enlace` reales con `derivado`
   (`refinamiento/proyeccion.ts:269-380`). Los abanicos derivados en el OPD hijo se
   escriben como `Abanico` reales (`proyeccion.ts:382-470`). Sostener eso pide
   resincronizar en cada edición, recolectar basura, y un guard de 264 líneas
   (`inheritedFanGuard.ts`) que compara modelos antes/después con `JSON.stringify`
   para impedir editar un abanico "heredado".
4. **Hay reglas duplicadas y divergentes.** Dos `validarMultiplicidad` que no
   coinciden (`?`), dos sistemas de designación de estados (uno exclusivo y otro
   aditivo), dos caminos para crear enlaces (`crearEnlace` y
   `crearEnlaceConExtremoPlegado`, este último sin los guards R-OPD-HAB-4, R-OPD-EST-3
   ni AP-04), y la UI evalúa tipos permitidos solo con la firma
   (`opcionesEnlace.ts`), no con los guards de creación.
5. **Hay bugs reales verificados.** Nombres duplicados tras un unfold o un in-zoom,
   pérdida de `labelPositions` al editar vértices, varios estados iniciales, y
   etiquetado permitido de un objeto hacia su propio estado. El detalle está en la §7.
6. **Mucha acreción de gobernanza en los tipos.** `tipos/extensiones.ts` (552 líneas)
   mezcla con el modelo OPM: ontología organizacional, requisitos, declaraciones no
   nucleares, anclas normativas con ratificación, notas de mesa, mesa de exploración,
   sello de procedencia, submodelos con 5 campos "compatibilidad v0", piezas con
   linaje, anclaje con drift, estereotipos con plantillas. `tipos/ui.ts` trae
   `CrucesPuenteSkill`, un contador para que "g3 no sea infalsable".

Recomendación central para la reescritura: un **kernel OPM puro** (cosas, estados,
enlaces, abanicos, refinamientos) separado de una **capa de vistas** (OPD, apariciones,
puertos, vértices, plegado). Las proyecciones de refinamiento se **calculan**, no se
persisten. Las extensiones meta viven como anexos opcionales del documento, no en
`Modelo`.

---

## 2. Inventario de módulos (propósito · tamaño · veredicto)

Las líneas son las de `wc -l`. Veredictos: K = keep (portar casi igual), S = simplify,
C = cut o absorber.

### 2.1 Tipos (`modelo/tipos/`, `tipos.ts`)

| Archivo | L | Propósito | Veredicto |
|---|---|---|---|
| `tipos.ts` | 161 | Barrel que re-exporta todos los sub-tipos | S: mantener un barrel del kernel; sacar los tipos meta/UI |
| `tipos/comunes.ts` | 16 | `Id`, `PestanaId`, `Posicion`, `Resultado<T,E>` | K |
| `tipos/entidad.ts` | 152 | `Entidad` + tipos de simulación, imagen, URL, slot de valor | S: separar núcleo, presentación y simulación |
| `tipos/estado.ts` | 43 | `Estado`, `DesignacionEstado`, `DuracionTemporal` | S: quitar geometría y `esInicial/esFinal` redundantes |
| `tipos/apariencia.ts` | 67 | `Apariencia`, plegado, contexto de refinamiento, puertos | S |
| `tipos/enlace.ts` | 136 | `Enlace`, `ExtremoEnlace`, derivación, escisión, `AparienciaEnlace` | S: sacar `portId` del extremo semántico |
| `tipos/abanico.ts` | 32 | `Abanico`, `PuertoAbanicoExacto` | S: definir el abanico por el extremo común, no por el puerto |
| `tipos/opd.ts` | 37 | `Opd` (árbol, apariencias, `ordenInzoom`, `vista`) | K/S |
| `tipos/modelo.ts` | 120 | `Modelo` raíz + `FichaTrabajo`, versiones, modalidad | S: la raíz OPM es chica; el resto va a anexos |
| `tipos/extensiones.ts` | 552 | Ontología, requisitos, declaraciones, familias por preestado, estereotipos, anclas, notas, mesa de exploración, sello, submodelos, piezas, anclaje, `OpdVista`, `DecisionPolicy` | C/S: mover a módulos de extensión; mantener solo lo que tiene demanda |
| `tipos/avisos.ts` | 83 | `AvisoMetodologico`, `CodigoChecker` (19 códigos) | K (pertenece a diagnóstico, no al kernel) |
| `tipos/pestana.ts` | 28 | Pestañas de sesión (undo por pestaña) | C del modelo: es UI/estado de sesión |
| `tipos/opl.ts` | 23 | `BloqueOplEstado`, `TokenValor`, `TokenUnidad` (sin uso fuera) | C |
| `tipos/ui.ts` | 78 | `GridConfig`, portapapeles, `PreferenciasUiUsuario`, `CrucesPuenteSkill` | C del modelo (mover a UI); cortar `CrucesPuenteSkill` |

### 2.2 Operaciones (`modelo/operaciones.ts` + `modelo/operaciones/`)

| Archivo | L | Propósito | Veredicto |
|---|---|---|---|
| `operaciones.ts` | 202 | Barrel "dios": re-exporta núcleo **y** mesa de exploración, requisitos, submodelos, anclaje, estereotipos | S: el barrel del kernel no debe arrastrar extensiones |
| `operaciones/helpers.ts` | 148 | `siguienteId`, `secuenciaPosteriorId`, `idModeloExiste`, `ok/fallo`, **`validarFirmaEnlace`** | K (joya: `validarFirmaEnlace`) |
| `operaciones/creacion.ts` | 117 | `crearModelo`, `crearObjeto`, `crearProceso` | K/S |
| `operaciones/entidad.ts` | 319 | Renombrar (unicidad global, ontología, parseo `[unidad]`), esencia, afiliación, linealidad, atributos con slot de valor y simulación | K núcleo; S atributos/simulación |
| `operaciones/colisionNombre.ts` | 61 | Detección informativa de colisiones de nombre | K (útil para UX de reuso) |
| `operaciones/estados.ts` | 301 | Crear 2 estados iniciales, agregar, renombrar, eliminar (≥2), reordenar, mover/redimensionar, designar inicial/final **exclusivo** | K núcleo; C `designarEstado*` duplicados; S geometría |
| `operaciones/enlaces.ts` | 1110 | `crearEnlace` con guards, `apuntarExtremoEnlace`, multiplicidad, grupos estructurales (separar/tipo/orden), traer faltantes, semiplegado/plegado estructural, reanclaje de derivados, unicidad de rol | K `crearEnlace`, `apuntarExtremo` y unicidad; S grupos y plegado (~600 líneas) |
| `operaciones/eliminacion.ts` | 429 | Eliminar entidad/enlace en cascada, `splitEffectEnPar`, `splitEffectParcial`, limpieza de huérfanos | K cascada; S split (3 codificaciones del mismo hecho) |
| `operaciones/apariencias.ts` | 412 | Mover (arrastra internos del contorno, clamp), redimensionar, auto-tamaño, vértices, labels, símbolo estructural | K (capa de vista) |
| `operaciones/ports.ts` | 505 | Puertos dinámicos al estilo OPCloud: ranuras estructurales, puertos compartidos de abanico, anclas "reloj", limpieza | S/C del kernel: debe ser renderer/vista |
| `operaciones/refinamiento.ts` | 53 | Barrel de refinamiento | S |
| `refinamiento/establecer.ts` | 283 | Constructor único del vínculo de refinamiento (aciclicidad), adoptar y devolver bocetos | K (joya: convergencia por construcción) |
| `refinamiento/descomposicion.ts` | 217 | In-zoom: crea OPD hijo, contorno y 3 subcosas semilla | K/S |
| `refinamiento/despliegue.ts` | 266 | Unfold: OPD hijo, padre y 3 partes con enlaces estructurales según el modo | K/S (bug de nombres) |
| `refinamiento/helpers.ts` | 356 | Quitar refinamiento (borra el subárbol y recolecta basura), subprocesos ordenados, `ordenInzoom` derivado de la geometría, nombres `SDn.m` | K/S |
| `refinamiento/proyeccion.ts` | 850 | Materializa proxies externos, enlaces derivados y abanicos derivados en el OPD hijo; resincroniza | C/S: reemplazar por una proyección calculada |
| `operaciones/opdSuelto.ts` | 39 | Crear boceto (OPD suelto) | K |
| `operaciones/clonarEntidad.ts` | 109 | "Calcar" una pieza de biblioteca con id fresco | S (rompe la unicidad de nombre) |
| `operaciones/injertoEstereotipo.ts` | 347 | Clonar e injertar la plantilla de un estereotipo; capturar una plantilla desde la selección | S/C (duplica copiar/pegar; rompe la unicidad de nombre) |
| `operaciones/anclaje.ts` | 196 | Anclaje vivo a una biblioteca + "centinela de drift" | C del kernel → extensión opcional |

### 2.3 Módulos sueltos del área

| Archivo | L | Propósito | Veredicto |
|---|---|---|---|
| `ontologia.ts` | 93 | Ontología organizacional none/suggest/enforce sobre nombres | S/K (opcional; pequeño y limpio) |
| `constantes.ts` | 92 | `CANON` (alias de la paleta V2) + predicados de naturaleza de enlace | S: separar los predicados OPM (K) de la paleta (renderer) |
| `constantes.bauhaus.ts` | 113 | Paleta y tipografía del canvas | Mover a render/tema |
| `constantesInzoom.ts` | 29 | Dimensiones canónicas del contorno in-zoom | Mover a layout |
| `geometria.ts` | 5 | `RESIZE_MIN`, `clampValor` | Absorber en layout |
| `extremos.ts` | 82 | Helpers de `ExtremoEnlace` (entidad o estado) | K |
| `integridadReferencial.ts` | 155 | Integridad dura compartida con la hidratación | K (contrato); S la dependencia de `checkers` |
| `creacionInterna.ts` | 118 | Crear una cosa dentro de un contorno (internalización, afiliación heredada) | S: hack de detección por dimensiones |
| `nombresCanonicos.ts` | 91 | Normalizar nombres; heurística de forma verbal (-ar/-er/-ir/-ción/-miento/-ing) | K (va a diagnóstico) |
| `layout.ts` | 145 | Posición libre, contorno, encajar, `CENTRO_CANVAS_GEOMETRICO` | K (capa de vista) |
| `refinamientos.ts` | 80 | Helpers del producto parcial `Entidad.refinamientos` | K |
| `contextoRefinamiento.ts` | 114 | Rol contorno/interno/externo de una aparición (dato persistido + geometría + "aparece en otro OPD") | S |
| `politicaApariciones.ts` | 102 | Visibilidad = existe una `Apariencia`; clasificación del origen | K/S |
| `plegado.ts` | 474 | Plegado parcial/total por aparición, partes, extracción; `crearEnlaceConExtremoPlegado` | S; cortar el camino duplicado de creación de enlaces |
| `rutas.ts` | 47 | `rutaEtiqueta` (path label) solo en procedurales ligados a un estado | K |
| `opdEliminacion.ts` | 145 | Eliminar un OPD hoja + recolección de basura | K/S (duplica la recolección de `quitarRefinamientoEntidad`) |
| `opdReorden.ts` | 283 | Orden de hermanos, mover nodo (sin ciclos), orden según el canvas del padre | S (`moverNodo` no valida la semántica de refinamiento) |
| `opdSueltos.ts` | 19 | Predicado de boceto | K |
| `visibilidadEstados.ts` | 211 | Supresión de estados por aparición (se combina con la global) | K lógica; C 50 líneas de "SELLOS" de teoría de categorías |
| `estadosDesignaciones.ts` | 129 | Designaciones inicial/final/default/current, supresión global | K; unificar con `estados.ts` |
| `objetoDuracion.ts` | 55 | Duración min ≤ nominal ≤ max por estado | K |
| `abanicos.ts` | 559 | Formar, agregar y quitar ramas; alternar O/XOR; probabilidades; proyección por OPD; sincronización | K reglas; S el modelo de "puerto exacto" |
| `modificadores.ts` | 259 | Condición/evento/NO, probabilidad, demora, `validarMetadatosEnlace` | K; C `subtipoModificador` |
| `enlaceMultiplicidad.ts` | 98 | Segunda API de multiplicidad (acepta `?`) | C (unificar) |
| `enlaceVertices.ts` | 140 | Insertar o mover vértices, reanclar un extremo | S (bug de `labelPositions`) |
| `etiquetasEnlace.ts` | 70 | Renombrar una etiqueta; normalizar la posición del label | K; C `enlaceRequiereEtiqueta` (siempre `false`) |
| `transaccionEnlace.ts` | 91 | Crear enlace + anclas + puertos + abanico automático | S (fallback por string del error; 3-4 resincronizaciones completas) |
| `familiasEfectosPreestado.ts` | 91 | Validar la extensión "familia de efectos por preestado" | S/C (extensión declarada no OPM) |
| `simboloEstructural.ts` | 215 | Anclajes del triángulo estructural (geometría) | Mover a render |
| `afiliacionEfectiva.ts` | 29 | Afiliación ambiental heredada por la cadena de exhibición | K |
| `autoinvocacion.ts` | 71 | Auto-invocación (enlace invocación P→P con demora) | K (sin duplicar `siguienteId`) |
| `anclajesEnlace.ts` | 66 | 8 anclas "de reloj" para extremos | Mover a vista/render |
| `opcionesEnlace.ts` | 119 | Evaluar qué tipos de enlace están permitidos entre dos extremos | K idea; S: debe usar los mismos guards que `crearEnlace` |
| `inheritedFanGuard.ts` | 264 | Bloquear la edición de un abanico desde un OPD no propietario comparando modelos | C (síntoma de materializar proyecciones) |
| `enlaceMetadatos.ts` | 120 | backwardTag, requisitos del enlace, tasa, tiempos de excepción | K/S |
| `objetoMetadata.ts` | 194 | Alias, unidad, descripción, URLs, imagen; `parsearNombreCompuesto` | K/S (palabras reservadas JS para alias: marginal) |
| `imagenObjeto.ts` | 103 | Validar URL de imagen, cache en memoria de módulo, `precargarBitmap` (DOM) | S: el DOM y el cache no van en el modelo |

---

## 3. Modelo de datos (contratos)

### 3.1 Documento persistido

```ts
// serializacion/json.ts:19-25
const FORMATO = "deep-opm-pro.modelo.v0";
export interface DocumentoModelo {
  formato: typeof FORMATO;
  modelo: Modelo;
  carpetaId?: Id | null;
}
```

`exportarModelo` resincroniza los puertos y normaliza antes de serializar (`json.ts:27`).
`hidratarModelo` valida y vuelve a resincronizar los puertos (`json.ts:41-58`). Adaptadores
legacy al hidratar:
- `Entidad.refinamiento` (forma única previa a la ronda 15.2) pasa al record
  `refinamientos` (`serializacion/validarOpds.ts:79-90`).
- `Entidad.estereotipo: "requirement"` pasa a `estereotipoId = ESTEREOTIPO_REQUIREMENT_ID`
  (`validarEntidades.ts:78-101`).
- `SelloProcedencia.glosarioHash` se descarta.
- `Abanico.puertoEntidadId` se conserva como alias de `puertoComun.entidadId`.

Cualquier reescritura **debe leer `deep-opm-pro.modelo.v0`** (o proveer un migrador
explícito) porque existen modelos productivos persistidos.

### 3.2 Raíz `Modelo` (`tipos/modelo.ts:80-120`)

```ts
export interface Modelo {
  id: Id;
  nombre: string;
  descripcion?: string;
  opdRaizId: Id;
  opds: Record<Id, Opd>;
  entidades: Record<Id, Entidad>;
  estados: Record<Id, Estado>;
  enlaces: Record<Id, Enlace>;
  abanicos?: Record<Id, Abanico>;
  ontologia?: OntologiaOrganizacional;
  satisfaccionesRequisito?: Record<Id, SatisfaccionRequisito>;
  declaracionesNoNucleares?: Record<Id, DeclaracionNoNuclear>;
  familiasEfectosPreestado?: Record<Id, FamiliaEfectosPreestado>;
  anclasNormativas?: Record<Id, AnclaNormativa>;
  notasMesa?: Record<Id, NotaMesa>;
  mesaExploracion?: MesaExploracionV1;
  estereotipos?: Record<Id, Estereotipo>;
  procedencia?: SelloProcedencia;
  fichaTrabajo?: FichaTrabajo;
  lentesConocimiento?: LenteConocimiento[];
  submodelos?: Record<Id, SubmodeloReferencia>;
  pieceLineage?: Record<Id, PieceLineageRecord>;
  referenciaPadreSubmodelo?: ReferenciaPadreSubmodelo;
  archivado?: boolean;
  archivadoEn?: string;
  versiones?: VersionResumen[];
  crearVersionAlGuardar?: boolean;
  nextSeq: number;
}
```

Clasificación de los campos:
- **Núcleo OPM (8):** `opdRaizId, opds, entidades, estados, enlaces, abanicos`, más
  `id, nombre, descripcion`.
- **Asignador de ids:** `nextSeq`.
- **Metadatos de persistencia (no OPM):** `archivado, archivadoEn, versiones,
  crearVersionAlGuardar`. Pertenecen al registro del backend, no al documento.
- **Extensiones meta (13 campos):** todo lo demás. Cada una tiene su validador en
  `serializacion/validate*.ts`.

### 3.3 `Opd` (`tipos/opd.ts:14-37`)

```ts
export interface Opd {
  id: Id;
  nombre: string;
  padreId: Id | null;
  preguntaGuia?: string;
  apariencias: Record<Id, Apariencia>;
  enlaces: Record<Id, AparienciaEnlace>;
  vista?: OpdVista;
  ordenLocal?: number;
  ordenInzoom?: Id[][];
}
```

- `padreId: null` y `id !== opdRaizId` = **boceto** (OPD suelto, `opdSueltos.ts`).
- `ordenInzoom`: secuencia de bandas (anticadenas) de subprocesos para un in-zoom de
  proceso. Coexiste con la geometría (orden por Y, tolerancia de 4 px en
  `agruparSubprocesosParalelos`, `refinamiento/helpers.ts:125-144`). Ver §8.4: son dos
  fuentes de verdad del orden temporal.
- `vista`: `requirement-view | submodel-view | generic-view` (`extensiones.ts:527-546`).
  `generic-view` excluye la edición de abanicos (`abanicos.ts:190,359`).

### 3.4 `Entidad` (`tipos/entidad.ts:108-152`)

```ts
export interface Entidad {
  id: Id;
  tipo: TipoEntidad;              // "objeto" | "proceso"
  nombre: string;
  esencia: Esencia;               // "informacional" | "fisica"
  afiliacion: Afiliacion;         // "sistemica" | "ambiental"
  refinamientos?: Partial<Record<TipoRefinamiento, SlotRefinamiento>>;
  alias?: string;
  unidad?: string;
  esAtributo?: boolean;
  valorSlot?: ValorSlot;
  simulacion?: ParametrosSimulacionEntidad;
  descripcion?: string;
  estereotipoId?: Id;
  anclaje?: Anclaje;
  requisito?: RequisitoEntidadMetadata;
  urls?: UrlObjetoTipada[];
  imagen?: ImagenEntidad;
  layoutEstados?: LayoutEstados;
  lineal?: boolean;
  orderedFundamentalTypes?: TipoEnlace[];
}
export interface SlotRefinamiento { opdId: Id; modo?: ModoDespliegueObjeto; }
```

- **OPM:** `tipo, nombre, esencia, afiliacion, refinamientos`, más `unidad`, `valorSlot`
  (atributo con valor, OPL-ES §14) y `orderedFundamentalTypes` (el orden de una
  relación estructural pertenece al refinable).
- **Redundante:** `esAtributo`. `esAtributoDerivado` (`operaciones/entidad.ts:176-185`)
  ya lo deduce de "es destino de una exhibición".
- **Presentación dentro del semántico:** `imagen` (con `cache.ts` persistido), `layoutEstados`
  (global, no por aparición) y `urls`.
- **Extensiones:** `estereotipoId, anclaje, requisito, simulacion, lineal` (la "capa
  categorial F1").

### 3.5 `Estado` (`tipos/estado.ts:22-43`)

```ts
export type DesignacionEstado = "inicial" | "final" | "default" | "current";
export interface Estado {
  id: Id;
  entidadId: Id;
  nombre: string;
  esInicial?: boolean;
  esFinal?: boolean;
  designaciones?: DesignacionEstado[];
  duracion?: DuracionTemporal;   // { unidad, min, nominal, max }
  suprimido?: boolean;
  width?: number; height?: number; x?: number; y?: number;
  orden?: number;
}
```

- `esInicial/esFinal` y `designaciones` codifican lo mismo. `aplicarDesignaciones`
  mantiene ambos sincronizados (`estadosDesignaciones.ts:99-111`) y `designacionesEstado`
  une las dos fuentes (`:58-65`).
- La geometría `x/y/width/height` es **global** aunque las apariciones del objeto sean
  por OPD. Si un objeto aparece en 3 OPDs, sus cápsulas de estado comparten posición.
- `orden` explícito con fallback por el sufijo numérico del id (`estados.ts:294-301`,
  con el truco de desplazar por `MAX_SAFE_INTEGER / 2`).

### 3.6 `Apariencia` (`tipos/apariencia.ts:33-67`)

```ts
export interface Apariencia {
  id: Id; entidadId: Id; opdId: Id;
  x: number; y: number; width: number; height: number;
  modoTamano?: ModoTamano;                       // "auto" | "manual"
  modoPlegado?: ModoPlegado;                     // "completo" | "parcial" | "plegado" | "desplegado"
  ordenPartes?: OrdenPartesPlegado;
  parteExtraidaDe?: { padreAparienciaId: Id; parteEntidadId: Id };
  contextoRefinamiento?: ContextoRefinamientoApariencia;
  ports?: Record<Id, PuertoApariencia>;          // {x,y} relativos 0..1
  estadosSuprimidos?: Id[];
}
export interface ContextoRefinamientoApariencia {
  tipo: "descomposicion" | "despliegue";
  refinableEntidadId: Id;
  rol: "contorno" | "interno" | "externo";
  contenedorAparienciaId?: Id;
  enlacesPadreIds?: Id[];
  origen?: "adopcion";
}
```

- `modoPlegado: "desplegado"` es aceptado por el validador
  (`serializacion/validarApariencias.ts:169`), pero ningún código del kernel lo produce
  ni lo consume. Es un valor muerto.
- La estructura admite N apariciones de la misma entidad en un OPD, pero el kernel asume
  ≤ 1: `aparienciaDeEntidadEnOpd` devuelve la primera (`politicaApariciones.ts:37-39`) y
  `ports.ts:38-41` sobreescribe en un `Map` por `entidadId`. Es un invariante implícito;
  la reescritura debe decidirlo explícitamente (OPM/OPCloud admiten duplicados visuales).

### 3.7 `Enlace` y `ExtremoEnlace` (`tipos/enlace.ts:14-136`)

```ts
export type TipoEnlace =
  | "agregacion" | "exhibicion" | "generalizacion" | "clasificacion"
  | "etiquetado" | "etiquetadoBidireccional"
  | "agente" | "instrumento" | "consumo" | "resultado" | "efecto" | "invocacion"
  | "excepcionSobretiempo" | "excepcionSubtiempo" | "excepcionSubSobretiempo";
export type Modificador = "condicion" | "evento" | "no";
export type SubtipoModificador = "C" | "E" | "no";
export interface ExtremoEnlace { kind: "entidad" | "estado"; id: Id; portId?: Id; }
export interface DerivacionEnlace {
  tipo: "enlace-externo-refinamiento"; refinamientoId: Id; enlacePadreId: Id;
  origen?: "automatico" | "manual";
}
export interface EfectoEscindido {
  grupoId: Id; enlacePadreId: Id; rol: "entrada" | "salida"; modo?: "par" | "standalone";
}
export interface Enlace {
  id: Id; tipo: TipoEnlace;
  origenId: ExtremoEnlace; destinoId: ExtremoEnlace;
  etiqueta: string;
  multiplicidadOrigen?: string; multiplicidadDestino?: string;
  modificador?: Modificador; subtipoModificador?: SubtipoModificador;
  probabilidad?: number; demora?: string; rutaEtiqueta?: string;
  backwardTag?: string; requisitos?: string; mostrarRequisitos?: boolean;
  tasa?: string; unidadesTasa?: string;
  tiempoMaximo?: string; unidadTiempoMaximo?: string;
  tiempoMinimo?: string; unidadTiempoMinimo?: string;
  grupoEstructuralId?: Id;
  estadoEntradaId?: Id; estadoSalidaId?: Id;
  efectoEscindido?: EfectoEscindido;
  derivado?: DerivacionEnlace;
}
export interface AparienciaEnlace {
  id: Id; enlaceId: Id; opdId: Id;
  vertices: Array<{ x: number; y: number }>;
  symbolPos?: { x: number; y: number };
  symbolAnchors?: AnclajesSimboloEstructural;
  labelPositions?: Record<string, PosicionLabelEnlace>;
}
```

Observaciones de contrato:
- `origenId`/`destinoId` se llaman "Id" pero son objetos. El nombre engaña; la
  reescritura puede renombrarlos (`origen/destino`) con un migrador.
- `subtipoModificador` es biyectivo con `modificador` (`modificadores.ts:241-251`). Es
  redundancia pura.
- El **cambio de estado** tiene tres codificaciones:
  1. TS3 compacto: `efecto P→O` + `estadoEntradaId/estadoSalidaId`.
  2. Par escindido TS4/TS5: dos `efecto` (`estado→P`, `P→estado`) con `efectoEscindido`
     (`eliminacion.ts:204-298`).
  3. Media escisión `standalone` (`eliminacion.ts:300-365`).

  Más la variante "Objeto→Proceso efecto solo como rama de abanico" que la firma acepta
  (`helpers.ts:122-127`). OPM tiene **un** hecho: el proceso cambia el objeto del estado
  A al estado B. Las demás son presentaciones.
- `derivado` convierte un enlace proyectado en un hecho persistido (ver §8.1).
- `portId` en el extremo es geometría (ver §8.2).
- `etiqueta` es obligatoria en el tipo, pero `enlaceRequiereEtiqueta` siempre devuelve
  `false` (`etiquetasEnlace.ts:55-58`).
- `tasa`, `tiempoMin`/`tiempoMax` y sus unidades son strings libres, sin tipo numérico.

### 3.8 `Abanico` (`tipos/abanico.ts:12-32`) y `DecisionPolicy`

```ts
export type OperadorAbanico = "O" | "XOR";
export interface PuertoAbanicoExacto { entidadId: Id; lado: "origen" | "destino"; portId: Id; }
export interface Abanico {
  id: Id; opdId: Id;
  puertoComun: PuertoAbanicoExacto;
  puertoEntidadId: Id;        // alias legacy = puertoComun.entidadId
  operador: OperadorAbanico;
  enlaceIds: Id[];
  decision?: DecisionPolicy;
}
export type DecisionPolicy =
  | { modo: "estado-fijo"; estadoId: Id }
  | { modo: "uniforme"; objetoId: Id }
  | { modo: "probabilidades"; pesos: Record<Id, number> }
  | { modo: "funcion"; funcionId: Id; fallback?: "uniforme" | "probabilidades" };
```

- El AND es implícito: varios enlaces sin abanico.
- Las probabilidades XOR se guardan **dos veces**: en `decision.pesos` y en cada
  `Enlace.probabilidad` (`abanicos.ts:145-160`). Existe `limpiarProbabilidadesDecision`
  solo para mantenerlas coherentes.
- El abanico tiene dueño (`opdId`). En OPM un abanico es un hecho lógico del modelo,
  independiente del OPD donde se dibuje.

### 3.9 Asignación de ids

- Un contador global `nextSeq` y el formato `${prefijo}-${n}` (`helpers.ts:15-17`).
- Prefijos: `o, p, s, e, a, ae, ab, opd, efe, ge, est, nm, sm, sr` (la regex de
  `secuenciaPosteriorId`, `helpers.ts:21`).
- `crearModelo` fija en código `modelo-1`/`opd-1` con `nextSeq: 1`
  (`creacion.ts:17-37`). Por eso `crearOpdSuelto` tiene que saltar colisiones
  (`opdSuelto.ts:24-38`).
- `idModeloExiste` (`helpers.ts:28-46`) recorre todos los OPDs y los mapas de extensión
  en cada creación con id explícito (O(n)).
- `siguienteId` está copiado en `autoinvocacion.ts`, `plegado.ts`, `requisitos.ts` y
  `submodelos.ts`. Varias operaciones consumen el contador con aritmética manual
  (`nextSeq + 1/+2/+3`); cualquier error provoca colisiones silenciosas (el commit
  fbd9160 corrigió varias).
- Ids no numéricos: `a-adopcion-${tipo}-${entidad}-${opd}` (`establecer.ts:163-165`),
  `port-${enlace}-${lado}`, `port-anchor-…`, `port-fan-ref-…`.

---

## 4. Catálogo de reglas OPM codificadas

Tipo: **E** = guard de edición (rechaza la operación); **I** = barrera dura de import
(hidratación); **D** = derivación automática; **B** = diagnóstico blando (checkers, fuera
de esta área, se cita por completitud).

### 4.1 Firma de enlaces — `validarFirmaEnlace` (`operaciones/helpers.ts:58-148`) [E+I]

Se usa en `crearEnlace`, `apuntarExtremoEnlace`, `cambiarTipoGrupoEstructural`, la
proyección de derivados, `plegado.crearEnlaceConExtremoPlegado`, `opcionesEnlace` y
`serializacion/validarEnlaces.ts` (import).

| # | Regla | Línea |
|---|---|---|
| F1 | Estructurales fundamentales (agregación/exhibición/generalización/clasificación) no aceptan extremos Estado [V-237][V-239] | 66-69 |
| F2 | `etiquetado`: origen y destino de la misma clase (O–O o P–P); admite estados | 70-74 |
| F3 | `etiquetadoBidireccional`: misma clase; prohíbe estado solo en destino [V-30] | 75-80 |
| F4 | `agregacion`, `generalizacion`, `clasificacion`: misma clase | 81-98 |
| F5 | `exhibicion`: cualquier par (atributo u operación) | 86-88 |
| F6 | `agente`: Objeto **físico** → Proceso (acepta un estado del objeto como origen) | 99-103 |
| F7 | `instrumento`, `consumo`: Objeto (o estado) → Proceso | 104-113 |
| F8 | `resultado`: Proceso → Objeto (o estado) | 114-118 |
| F9 | `efecto`: P→O; o Estado→P (entrada escindida); o O→P entre entidades ("solo como rama de abanico", **no se hace cumplir**) | 119-129 |
| F10 | `invocacion`: P→P | 130-134 |
| F11 | Excepciones temporales: P→P sin estados; el destino (manejador) **debe ser ambiental** (R-EXC-1A / R-OPD-CTL-6) | 135-146 |
| F12 | Exhaustividad por `satisfies never` | 147 |

### 4.2 Guards de `crearEnlace` (`operaciones/enlaces.ts:90-188`) [E]

| # | Regla | Línea |
|---|---|---|
| C1 | Extremos distintos (sin auto-lazo; la autoinvocación va por otra vía) | 109 |
| C2 | AP-04: `resultado` no puede apuntar a un estado **inicial** | 113-116 |
| C3 | R-OPD-EST-3 / V-5: `efecto` hacia un objeto sin estados se rechaza (el import lo tolera; el checker `EFECTO_OBJETO_SIN_ESTADOS` lo acusa) | 117-128 |
| C4 | La transición compacta solo en `efecto`, requiere entrada **y** salida, y ambos estados deben ser del objeto destino | 129-139 |
| C5 | R-OPD-HAB-4 / R-ROL-UNIC-1: el par objeto-proceso no mezcla rol transformador y habilitador; se prohíbe el duplicado exacto (salvo efectos con otra transición); los derivados no cuentan | 140-141, 1041-1110 |
| C6 | Ambos extremos visibles (con aparición) en el OPD | 142-144 |
| C7 | Tras crear, re-proyecta los refinamientos hijos de las entidades tocadas y resincroniza puertos | 176-187 |

`apuntarExtremoEnlace` (`:190-233`) revalida la firma (C1, F*) y exige que el nuevo
extremo sea visible **en todos los OPD donde aparece el enlace**. No revalida C2, C3 ni C5.

### 4.3 Otros enlaces

| # | Regla | Ubicación | Tipo |
|---|---|---|---|
| L1 | Multiplicidad: `\d+ \| N \| + \| * \| d..d \| d..N \| d..*`; **sin `?`** | `operaciones/enlaces.ts:53-57` | E+I |
| L1' | Multiplicidad alternativa: la misma **con `?`** | `enlaceMultiplicidad.ts:14` | E (store/enlaces.ts) |
| L2 | Modificadores condición/evento/NO solo en procedurales; nunca en `resultado`, `invocacion` ni excepciones [AP-01/02/03/10]; nunca en TS4/TS5 par [AP-08] | `modificadores.ts:198-209` | E+I |
| L3 | Probabilidad al editar: solo si `modificador === "evento"`, rango [0,1] | `modificadores.ts:75-76` | E |
| L3' | Probabilidad al importar: cualquier procedural (evento o rama XOR) | `modificadores.ts:138-148` | I |
| L4 | Demora solo en `invocacion`, no vacía [V-240] | `modificadores.ts:103,149-152` | E+I |
| L5 | `backwardTag` solo en `etiquetadoBidireccional` | `enlaceMetadatos.ts:7`, `modificadores.ts:153` | E+I |
| L6 | Tasa solo en consumo/resultado/efecto; las unidades requieren tasa | `enlaceMetadatos.ts:49`, `modificadores.ts:159-166` | E+I |
| L7 | `tiempoMinimo` solo en subtiempo/subSobre; `tiempoMaximo` solo en sobre/subSobre | `constantes.ts:86-92`, `enlaceMetadatos.ts:79-103` | E+I |
| L8 | `rutaEtiqueta` solo en procedural ligado a un estado (extremo estado o efecto con transición) | `rutas.ts:32-38` | E |
| L9 | Autoinvocación: invocación P→P sobre sí mismo, proceso visible, una por proceso y OPD, demora por defecto `1s` | `autoinvocacion.ts:5-48` | E |
| L10 | Reanclar un derivado: solo hacia un subproceso visible e interno del refinamiento activo, conservando la firma; pasa a `origen: "manual"` | `operaciones/enlaces.ts:606-733` | E |
| L11 | Grupo estructural: solo estructurales; al cambiar el tipo se revalida la firma; el orden se guarda en el refinable común (`orderedFundamentalTypes`) | `operaciones/enlaces.ts:246-348` | E |
| L12 | Split TS3→TS4/TS5: efecto P→O entidad-entidad con entrada y salida del objeto; ambos visibles | `eliminacion.ts:204-298` | E |

### 4.4 Entidades

| # | Regla | Ubicación | Tipo |
|---|---|---|---|
| N1 | Nombre no vacío | `operaciones/entidad.ts:80` | E |
| N2 | **Unicidad global** de nombre (sin distinguir mayúsculas, `es-CL`, sin quitar acentos) entre todas las entidades | `entidad.ts:73-87,310-319` | E (no I) |
| N3 | Ontología `enforce` reemplaza por el canónico; `suggest` solo informa; clave normalizada sin diacríticos | `ontologia.ts:12-35,91-93` | E |
| N4 | Sufijo `Nombre [unidad]` (≤ 20 caracteres) se separa a `unidad` | `entidad.ts:300-308` | E |
| N5 | Nombre por defecto `Objeto`/`Proceso`, `_2`, `_3`… | `entidad.ts:93-99` | D |
| N6 | Entidad nueva: `informacional` + `sistemica` | `creacion.ts:86-92` | D |
| N7 | Atributo = objeto exhibido: `crearAtributoEnObjeto` crea objeto + exhibición + aparición; hereda la afiliación del padre | `entidad.ts:101-174` | D |
| N8 | Slot de valor tipado (integer/float/char/string) y validado; la simulación solo en atributos con slot | `entidad.ts:187-254` | E |
| N9 | Afiliación efectiva ambiental heredada por la cadena de exhibición (R-OPD-STR-13, R-OBJ-6/7); no muta el dato | `afiliacionEfectiva.ts:14-29` | D |
| N10 | Una cosa creada dentro de un contorno hereda `ambiental` si el refinable lo es | `creacionInterna.ts:106-110` | D |
| N11 | Alias sin espacios, sin `_`/`.`, sin palabras reservadas JS | `objetoMetadata.ts:118-125` | E |
| N12 | Imagen bitmap degradada a `texto` si el objeto tiene estados visibles | `objetoMetadata.ts:165-168` | D |

### 4.5 Estados

| # | Regla | Ubicación | Tipo |
|---|---|---|---|
| S1 | Solo los objetos tienen estados | `estados.ts:81,120,232` | E |
| S2 | Un objeto con estados tiene **≥ 2**: se crean de a dos (`estado1`, `estado2`); agregar exige ≥ 2 previos; eliminar se niega si quedan ≤ 2 (hay que "quitar estados" completo) | `estados.ts:78-110,121-123,165-167` | E |
| S3 | Nombre de estado no vacío y único dentro del objeto (sin distinguir mayúsculas) | `estados.ts:269-277` | E |
| S4 | Eliminar un estado elimina en cascada los enlaces que lo tocan | `estados.ts:171`, `eliminacion.ts:143-169` | D |
| S5 | `default` y `current` son excluyentes entre sí en un estado y **únicos por objeto** | `estadosDesignaciones.ts:14-26,88-97` | E |
| S6a | `designarInicial`/`designarFinal` (usados por store y parser OPL): **aditivos**, admiten varios iniciales o finales | `estadosDesignaciones.ts:6-12,82-86` | E |
| S6b | `designarEstadoInicial`/`designarEstadoFinal`: **exclusivos**, uno por objeto; solo los usan `fixtures.ts` | `estados.ts:243-267` | E |
| S7 | Suprimir un estado (global o por aparición) solo si no tiene enlaces incidentes; visible = ¬global ∧ ¬local | `estadosDesignaciones.ts:41-47`, `visibilidadEstados.ts:70-73,110-124` | E |
| S8 | Duración: unidad válida, finita, `0 ≤ min ≤ nominal ≤ max` | `objetoDuracion.ts:34-43` | E |
| S9 | Estado mínimo 52×24 px | `estados.ts:185-186` | E |

### 4.6 Abanicos (`abanicos.ts`)

| # | Regla | Línea | Tipo |
|---|---|---|---|
| A1 | ≥ 2 ramas; al quedar < 2 se disuelve | 363, 92, 290 | E+D |
| A2 | Solo enlaces procedurales | 369-372 | E |
| A3 | Ramas homogéneas (mismo tipo) | 375-379 | E |
| A4 | Comparten **exactamente un** puerto común (entidad + lado + `portId`) | 381-392 | E |
| A5 | Un enlace pertenece a lo sumo a un abanico | 394-397 | E |
| A6 | No se editan en `generic-view` (solo se proyectan) | 359-361, 190 | E |
| A7 | Probabilidades explícitas solo en XOR; todas las ramas, en [0,1], suman 1 (±1e-9); pasar a O limpia la decisión | 129, 470-493, 104-120 | E |
| A8 | Formación automática al crear un enlace si comparte puerto con otro del mismo tipo; nunca si toca un estado | 262-284 | D |
| A9 | Un abanico se edita solo desde su OPD propietario | `puedeEditarAbanicoEnOpd` 222-224 + `inheritedFanGuard.ts` | E |
| A10 | Integridad: las familias por preestado no pueden ser ramas de un abanico | `familiasEfectosPreestado.ts:77-78` | E+I |

### 4.7 Refinamiento (in-zoom / unfold)

| # | Regla | Ubicación | Tipo |
|---|---|---|---|
| R1 | Refinar exige que la cosa sea visible en el OPD padre | `establecer.ts:57-59`, `descomposicion.ts:82-84`, `despliegue.ts:80-82` | E |
| R2 | Un refinamiento por tipo; **descomposición y despliegue son ortogonales** y pueden coexistir (ronda 15.2) | `establecer.ts:60-62`, `refinamientos.ts` | E |
| R3 | Idempotencia: refinar otra vez devuelve el OPD existente | `descomposicion.ts:86-91`, `despliegue.ts:84-89` | D |
| R4 | Aciclicidad (R-OPD-REF-8) | `establecer.ts:63-66,84-93` | E |
| R5 | Constructor único del vínculo (R-OPD-REF-20): top-down y adopción de bocetos convergen | `establecer.ts:49-81,110-125` | E |
| R6 | El refinable aparece en el OPD hijo (al adoptar se materializa una aparición derivada `origen:"adopcion"`) | `establecer.ts:133-161`; import `integridadReferencial.ts:39-47` | E+I |
| R7 | Devolver a bocetos: no destructivo; exige un solo propietario y padre coherente | `establecer.ts:224-283` | E |
| R8 | In-zoom siembra 3 subcosas **del mismo tipo** que la cosa (también de objetos), con esencia y afiliación copiadas, nombres `«X» 1..3` | `descomposicion.ts:168-213` | D |
| R9 | Unfold siembra 3 partes del mismo tipo con enlace estructural según el modo (agregación/exhibición/generalización/clasificación) | `despliegue.ts:163-262` | D |
| R10 | Nombre del OPD hijo `SDn` / `SDx.n` | `refinamiento/helpers.ts:299-313` | D |
| R11 | Quitar un refinamiento borra el **subárbol** de OPDs y hace recolección de basura: entidades sin aparición en ningún OPD, sus estados, y enlaces sin aparición o con extremos colgantes | `refinamiento/helpers.ts:38-89` | D |
| R12 | Borrar una entidad refinada quita antes sus refinamientos | `eliminacion.ts:27-41` | D |
| R13 | **Distribución de enlaces externos** hacia los subprocesos (in-zoom de proceso): consumo al refinado → **primer** subproceso; resultado/invocación/excepción desde el refinado → **último**; excepción hacia el refinado → primero; agente/instrumento/efecto → **todos** | `proyeccion.ts:703-735` | D |
| R14 | El primer y el último subproceso se deciden por la geometría (Y, luego X, luego id) dentro del contorno | `refinamiento/helpers.ts:95-106,324-326` | D |
| R15 | Los proxies externos se materializan como apariciones `rol:"externo"` (entradas a la izquierda, salidas a la derecha) y se limpian si quedan obsoletos | `proyeccion.ts:560-647` | D |
| R16 | Los abanicos del padre sobre el refinado se proyectan a abanicos derivados en el hijo con `portId` sintético | `proyeccion.ts:382-470` | D |
| R17 | `ordenInzoom`: solo en OPD de descomposición de proceso, solo ids de subprocesos internos; forma normal (≤ 1 banda ⇒ `undefined`); se re-deriva solo al cruzar una banda | `refinamiento/helpers.ts:168-255`; I en `integridadReferencial.ts:125-142` | D+I |
| R18 | Mover el contorno arrastra a los internos; los internos se encajan (clamp) en el contorno (HU-12.020) | `apariencias.ts:36-74` | E+D |
| R19 | Al crear el primer subproceso dentro de un contorno vacío se redistribuyen los externos | `creacion.ts:116`, `proyeccion.ts:174-188` | D |
| R20 | Traer las agregaciones in-zoom faltantes: las subcosas internas del mismo tipo pasan a partes (agregación) del refinable | `operaciones/enlaces.ts:424-453,791-848` | D |

### 4.8 OPDs

| # | Regla | Ubicación | Tipo |
|---|---|---|---|
| O1 | El SD raíz no se borra ni se mueve | `opdEliminacion.ts:14-16`, `opdReorden.ts:137-139` | E |
| O2 | Solo se borran OPDs hoja; se bloquea si hay una propuesta de exploración pendiente | `opdEliminacion.ts:7-40` | E |
| O3 | Borrar un OPD quita el slot de refinamiento que lo apuntaba y hace recolección de basura (igual que R11) | `opdEliminacion.ts:42-114` | D |
| O4 | Mover un nodo sin crear ciclos | `opdReorden.ts:222-240` | E |
| O5 | Orden de hermanos: `ordenLocal` si **todos** lo tienen; si no, por id | `opdReorden.ts:63-73` | D |

### 4.9 Integridad referencial dura (`integridadReferencial.ts:27-86`) [I]

- El `estereotipoId` aplicado resuelve contra la fábrica o el catálogo.
- Cada refinamiento apunta a un OPD existente que contiene una aparición del refinable.
- Un derivado apunta a un refinador con refinamiento y a un enlace padre existente.
- Las vistas `requirement-view` y `submodel-view` resuelven su referencia.
- Integridad de las partes extraídas y de `ordenInzoom` (R17).
- Cada `AparienciaEnlace` apunta a un enlace existente, tiene los extremos visibles en su
  OPD (o como fila de plegado parcial) y un `opdId` coherente.
- **Cada `Enlace` tiene al menos una aparición** (`:82-84`). Consecuencia: un hecho OPM
  no puede existir sin estar dibujado.

### 4.10 Plegado

| # | Regla | Ubicación |
|---|---|---|
| P1 | El plegado parcial exige partes (del despliegue si existe; si no, subprocesos de la descomposición) | `plegado.ts:57-59,322-340` |
| P2 | No se conectan dos filas plegadas entre sí | `plegado.ts:146-148` |
| P3 | Más de 3 partes ocultas se resumen con el contador «y N partes más» | `plegado.ts:37,301-320` |
| P4 | Un extremo es visible si es una fila plegada de una aparición `parcial` | `integridadReferencial.ts:88-96` |

### 4.11 Extensión «familia de efectos por preestado» (`familiasEfectosPreestado.ts:6-91`) [E+I]

Es una extensión declarada (no primitiva OPM): ≥ 2 efectos TS3 completos con ruta, del
mismo par objeto-proceso, uno por preestado. El dominio son estados del objeto, con
cobertura total o parcial coherente, sin pertenecer a un abanico y visibles en su OPD.

---

## 5. Flujos principales

### 5.1 Crear una cosa
`store` → `crearCosaEnPosicion` (`creacionInterna.ts:14`) → `crearObjeto`/`crearProceso`
→ `crearEntidad` (`creacion.ts:59`): nombre por defecto o reforzado por la ontología, unicidad,
id `o-/p-`, aparición `a-` de 135×60. Si es proceso,
`redistribuirEnlacesExternosSiPrimerSubproceso`. Después `crearCosaEnPosicion`
**identifica la entidad nueva comparando las claves** y **la aparición nueva por tener las
dimensiones canónicas** (`creacionInterna.ts:43-55`). Si cayó dentro del contorno, la
encaja, le pone `contextoRefinamiento` interno y hereda la afiliación. Por último, el store
aplica `sincronizarAbanicos` + `sincronizarPuertosTodosLosOpd` + el guard de abanicos
heredados (`store/runtime.ts:705-706,1115-1118`).

### 5.2 Crear un enlace
`crearEnlaceTransaccional` (`transaccionEnlace.ts:22`):
1. `crearEnlace` (firma, guards C1-C6, crea `e-`/`ae-`, re-proyecta los hijos y
   **resincroniza los puertos de todos los OPD**).
2. Si falla con un mensaje que **contiene "apariencia en el OPD"** y se permite el
   plegado, reintenta con `crearEnlaceConExtremoPlegado` (sin C2, C3, C4, C5 ni puertos).
3. Detecta el enlace nuevo comparando claves.
4. Aplica las anclas de reloj.
5. `sincronizarPuertosTodosLosOpd`.
6. `formarAbanicoAutomatico`.
7. `sincronizarPuertosTodosLosOpd`.
8. Store: otra vez sincroniza abanicos + puertos + guard.

En total, **4-5 resincronizaciones completas** de puertos por enlace creado.

### 5.3 In-zoom
`descomponerProceso(modelo, opdPadre, cosa)`: crea el OPD hijo (centrado en
`CENTRO_CANVAS_GEOMETRICO` 3600,2600), el contorno de 405×(90·3+165) y 3 subcosas →
`establecerRefinamiento` → `sincronizarRepresentacionRefinamiento`. Esta última:
materializa proxies externos, limpia los derivados automáticos, proyecta los enlaces del
padre a derivados (R13), proyecta los abanicos (R16) y limpia los externos obsoletos.

### 5.4 Editar dentro de un in-zoom
Cada `moverApariencia`, `redimensionarApariencia` o `volverAAutoTamano` llama a
`refrescarEnlacesExternosDerivados` (`apariencias.ts:87,148,183`). Como el primer y el
último subproceso dependen de la Y, arrastrar un subproceso puede **reescribir qué enlaces
semánticos existen**. El store además llama a `aplicarOrdenInzoomDerivado` solo si
`aparienciaEsSubprocesoInternoDeInzoom`.

### 5.5 Eliminar
`eliminarEntidad` (quita refinamientos, borra estados, enlaces incidentes y apariciones,
poda `ordenInzoom`, sincroniza abanicos y `orderedFundamentalTypes`). `eliminarEnlace`
borra también los derivados cuyo `enlacePadreId` es el borrado y re-proyecta los
refinamientos hijos.

### 5.6 Hidratar
Validadores de forma (`serializacion/validar*.ts`) → `normalizarModelo` →
`validarReferenciasOpd` (§4.9) → `sincronizarPuertosTodosLosOpd`. Hidratar **modifica**
el modelo: vuelve a calcular los puertos.

---

## 6. Acoplamientos y dependencias

- **Barrel dios.** `modelo/operaciones.ts` re-exporta núcleo más `mesaExploracion`,
  `requisitos`, `submodelos`, `anclaje`, `injertoEstereotipo` y `ontologia`. Importar
  `crearEnlace` arrastra todo. Módulos como `modificadores.ts`, `estadosDesignaciones.ts`,
  `plegado.ts`, `enlaceVertices.ts` y `objetoMetadata.ts` importan del barrel (riesgo de
  ciclos; hoy funcionan por hoisting de funciones).
- **La integridad dura depende del diagnóstico blando.** `integridadReferencial.ts:1`
  importa `contornoDeOpd` y `subprocesosInternosDeOpd` de `checkers.ts` (903 líneas de
  avisos). La barrera de import depende de la capa de avisos.
- **Cinco funciones para "el refinable de este OPD":** `contornoDeOpd` (checkers),
  `contornoProcesoDeOpd`, `procesoDescompuestoEnOpd` y `cosaDescompuestaEnOpd`
  (`refinamiento/helpers.ts`), y `contenedorRefinamiento` (`layout.ts:84`). Difieren en
  filtros (solo proceso o cualquier cosa) y en la forma del retorno.
- **Cuatro definiciones de "subproceso interno":**
  - checkers: por `rol !== externo`, sin geometría.
  - `derivarOrdenInzoomDeGeometria`: por `dentroDe`.
  - `entidadesInternasOrdenadasDeRefinamiento`: contexto persistido + geometría + "aparece
    en otro OPD".
  - `plegado.subprocesosDeDescomposicion`: solo `dentroDe`.

  Pueden discrepar sobre la misma aparición.
- **Duplicados triviales.** `dentroDe` ×4 (`layout.ts:111`,
  `refinamiento/helpers.ts:315`, `plegado.ts:454`, `validaciones.ts:532`). `ok/fallo`
  están redefinidos en 23 archivos del directorio. `siguienteId` ×5. Hay tres recorridos
  de subárbol de OPD: `idsSubarbolOpd`, `descendientes` y `esAncestroOpd`. La recolección
  de basura de entidades y enlaces sin aparición está dos veces (`refinamiento/helpers.ts:52-88`
  y `opdEliminacion.ts:59-97`), y la limpieza de abanicos también (`sincronizarAbanicos`
  y `opdEliminacion.limpiarAbanicos`).
- **Resincronización global en todas partes.** `ajustarMultiplicidad` resincroniza los
  puertos de todos los OPD (`operaciones/enlaces.ts:82`) por cambiar un texto de
  multiplicidad.
- **Estado de módulo en el modelo.** `imagenObjeto.ts:7` guarda un `Map` global de cache,
  y `precargarBitmap` usa `Image` del DOM.

---

## 7. Hallazgos: bugs e inconsistencias

**[VERIFICADO]** = reproducido con `bun scratchpad/probe*.ts`.

1. **[VERIFICADO] Nombres duplicados tras un unfold.** Dos `desplegarObjeto(…,"exhibicion")`
   sobre objetos distintos crean `Atributo 1..3` dos veces (`despliegue.ts:213-224`; no se
   valida N2). El roundtrip JSON lo acepta porque N2 no es regla de import. El OPL, que
   identifica por nombre, queda ambiguo. Lo mismo pasa con `Especialización n` e
   `Instancia n`.
2. **[VERIFICADO] Colisión de nombres tras un in-zoom.** Con un objeto `Cocinar 1` ya
   existente, in-zoom sobre `Cocinar` crea un proceso `Cocinar 1`
   (`descomposicion.ts:195`).
3. **Calcar e injertar** (`clonarEntidad.ts:238-241`, `injertoEstereotipo.ts:81-87`)
   conservan el nombre "sin deduplicar" a propósito. Esto contradice N2.
4. **[VERIFICADO] Se pierden las `labelPositions`.** `insertarVerticeApariencia` y
   `reposicionarVerticeApariencia` reconstruyen la `AparienciaEnlace` sin
   `labelPositions` (`enlaceVertices.ts:105-133`).
5. **[VERIFICADO] Multiplicidad con dos verdades.** `operaciones.validarMultiplicidad("?")
   === false` (usado por el inspector, la tabla, el parser OPL y el import), pero
   `enlaceMultiplicidad.validarMultiplicidad("?") === true` (usado por
   `store/enlaces.ts`). Un `?` fijado por esa vía **no reimporta**. Además, el mensaje de
   `ajustarMultiplicidad` sugiere `?` aunque su regex lo rechaza
   (`operaciones/enlaces.ts:67-69`).
6. **[VERIFICADO] Varios estados iniciales.** `designarInicial` es aditivo; aplicado a dos
   estados del mismo objeto deja 2 iniciales. `designarEstadoInicial` (exclusivo) solo lo
   usan los fixtures. La semántica depende del camino. Hay que fijarla contra el canon.
7. **[VERIFICADO] Etiquetado de un objeto a su propio estado.** `crearEnlace(o, estado(o),
   "etiquetado")` se permite. OPCloud lo prohíbe (`ObjectCannotBeConnectedToItsStates`,
   `docs/JOYAS.md` §10). F2 no lo cubre.
8. **[VERIFICADO] La UI ofrece lo que el kernel rechaza.** `tiposEnlacePermitidos(P, O sin
   estados)` incluye `efecto`, pero `crearEnlace` lo rechaza (R-OPD-EST-3). Pasa lo mismo
   con AP-04 y R-OPD-HAB-4: `opcionesEnlace` usa solo la firma.
9. **Camino de creación que salta reglas.** `crearEnlaceConExtremoPlegado`
   (`plegado.ts:123-173`) valida la firma, pero no C2, C3, C4 ni C5, y no resincroniza
   puertos ni re-proyecta refinamientos. Se activa comparando **el texto del error**
   (`transaccionEnlace.ts:80-82`).
10. **La probabilidad tiene dos reglas.** Al editar, `definirProbabilidad` exige un
    evento (`modificadores.ts:75`); al importar se acepta cualquier procedural
    (`:138-148`). `definirProbabilidadesAbanico` la escribe en ramas sin evento. Funciona,
    pero son tres reglas para un mismo campo.
11. **`moverNodo` rompe el invariante de refinamiento.** Puede poner como padre de un OPD
    de refinamiento un OPD donde el refinable no aparece (`opdReorden.ts:131-216`).
    `devolverOpdABocetos` detecta luego "vínculo incoherente" (`establecer.ts:247-250`).
12. **`validarFirmaEnlace` acepta `efecto` O→P entre entidades** "solo como rama de
    abanico" sin verificar el abanico (`helpers.ts:122-127`).
13. **Identificación frágil por dimensiones.** `crearCosaEnPosicion` busca la aparición
    nueva por `width === 135 && height === 60` (`creacionInterna.ts:48-55`).
    `esContornoRefinamiento` decide que algo es contorno si es más grande que el canon
    (`layout.ts:107-109`): una cosa redimensionada deja de chocar en `posicionLibre`.
14. **Rastros de código muerto o sin efecto:**
    - `ModoPlegado "desplegado"`.
    - `enlaceRequiereEtiqueta` siempre `false`.
    - `anclajeRefinadorSimbolo(index,total)` ignora sus argumentos.
    - `INZOOM.toleranciaParaleloY` sin uso (`descomposicion.ts:57`).
    - `enlacesExternosDelProceso` es un alias sin uso.
    - `crearInvocacion` y `opdIdDeRefinamiento` no tienen consumidores.
    - `TokenValor`/`TokenUnidad`/`BloqueOplEstado` no tienen uso.
    - `degradarSiFallido` no tiene consumidores.
    - El mensaje «en Sprint 0» se filtra al usuario (`operaciones/enlaces.ts:109,210`).

---

## 8. Olores de sobreingeniería y acreción (con ejemplos)

### 8.1 Proyecciones persistidas como hechos (raíz de la complejidad)

`proyeccion.ts` (850 líneas) escribe en `modelo.enlaces` enlaces con `derivado` y en
`modelo.abanicos` abanicos con `portId` sintético `port-fan-ref-…`. Para sostenerlo se
necesitan:
- `limpiarEnlacesDerivadosAutomaticos` y `limpiarAparienciasExternasObsoletas`;
- `limitarAutomaticosPorPadre`, para no expandir en un refresh incidental;
- `soloSiHayDerivadosAutomaticosVisibles`, para no "materializar líneas" en OPD importados;
- `origen: "manual"` para los overrides;
- la exclusión de derivados en R-OPD-HAB-4;
- `inheritedFanGuard.ts` completo (264 líneas), con heurísticas como
  `tieneFormaEnlaceDerivadoAutomatico`, que valida que el enlace **solo tenga ciertas
  claves** (`inheritedFanGuard.ts:129-133`), y comparaciones `JSON.stringify` de
  modelos completos;
- los casos especiales en `checkers`, `opl` y `serializacion` (derivados tolerados).

**Alternativa.** Hacer de la proyección una **función pura**
`vistaDeRefinamiento(modelo, opdHijo) → {proxies, enlacesProyectados, abanicosProyectados}`,
calculada al renderizar y generar OPL. Solo se persiste el **override** explícito (un
"refinamiento de extremo": el enlace X del padre se ancla al subproceso Y), como un dato
pequeño del refinamiento. Así desaparecen el guard, la recolección de basura de derivados y
la mitad de `proyeccion.ts`.

### 8.2 Puertos visuales en la semántica

`ExtremoEnlace.portId` es global. `Apariencia.ports` es por OPD. `sincronizarPuertosEnlaces`
(`ports.ts:34-110`) **escribe `portId` en el enlace semántico** mientras recorre cada OPD.
El último OPD recorrido gana si difieren. La identidad del abanico depende de ese `portId`
(A4). Consecuencias:
- el modelo cambia al exportar o hidratar;
- los tests de roundtrip dependen del orden de recorrido;
- no se puede decidir "¿son un abanico?" sin geometría.

**Alternativa.** El abanico se define como `{operador, extremoComun: {entidadId, lado},
enlaceIds}`: semántica OPM pura. Los puertos pasan a `AparienciaEnlace` o `Apariencia`
(vista) y los calcula el renderer.

### 8.3 Tres codificaciones del cambio de estado

TS3 compacto, par escindido y escisión parcial, más el `efecto O→P` de rama. Cada
consumidor (OPL, checkers, simulación, proyección, familias por preestado) tiene que
entenderlas todas. **Alternativa:** un solo hecho `efecto` con `estadoEntrada?`,
`estadoSalida?`. La escisión visual (dos flechas) es una opción de dibujo en la
`AparienciaEnlace`.

### 8.4 Dos fuentes de verdad del orden temporal

`Opd.ordenInzoom` (declarado; se valida al importar) frente a la Y de las apariciones
(`compararOrdenTemporal`). Hay que mantenerlas sincronizadas con
`derivarOrdenInzoomDeGeometria`/`aplicarOrdenInzoomDerivado` y un guard de idempotencia
"load-bearing" (`refinamiento/helpers.ts:184-212`). La proyección R13/R14 usa **solo la
geometría**; el commit d94ee1f parchó el canvas para respetar el orden. **Alternativa:**
el orden es dato semántico del refinamiento (las bandas), el layout lo realiza, y la
geometría nunca decide la semántica. Arrastrar un subproceso es un comando explícito que
reordena.

### 8.5 Duplicación de reglas por "API paralela"

`enlaceMultiplicidad.ts` frente a `ajustarMultiplicidad`; `estadosDesignaciones.ts` frente
a `designarEstado*`; `crearEnlaceConExtremoPlegado` frente a `crearEnlace`;
`reanclarExtremoEnlace` (`enlaceVertices.ts`) frente a `apuntarExtremoEnlace` frente a
`moverPuertoEnlace`. Cada par nació en una "ronda" distinta y no se reconciliaron.

### 8.6 Redundancias de datos toleradas "por compatibilidad v0"

`Abanico.puertoEntidadId`, `Enlace.subtipoModificador`, `Estado.esInicial/esFinal`,
`Entidad.esAtributo`, y en `SubmodeloReferencia` cinco campos duplicados comentados
«Compatibilidad v0: duplicado por …» (`extensiones.ts:499-518`), más las probabilidades
duplicadas en abanico y rama. El formato sigue llamándose `v0`: nunca hubo un corte de
versión. Una migración única `v0 → v1` libera todo esto.

### 8.7 Doctrina en comentarios

`visibilidadEstados.ts:10-55` dedica ~50 líneas a "SELLOS cat-thinking" (presheaf,
álgebra de Heyting, topos) para justificar `visible = !global && !local`. Ocurre igual en
`apariencia.ts:48-65`, `anclaje.ts` ("Δ→Σ", "vocabulario de carpintero") y
`tipos/ui.ts:26-31` ("g3 es infalsable"). Son referencias a actas, rondas, líneas, HU-x,
BUG-id y `docs/instrucciones-lineas-dev/ronda9/...` que ya no existen. Es ruido que
confunde a quien mantiene y no agrega verificación.

### 8.8 Extensiones meta dentro de la raíz

13 campos opcionales de `Modelo` con validadores propios, cada uno "aditivo y opcional, no
OPM". Lo sensato: un documento `{ modelo: ModeloOpm, vistas: …, anexos?: { ontologia?,
requisitos?, anclas?, notas?, exploracion?, procedencia?, ficha?, submodelos?, piezas?,
estereotipos? } }`. Cada anexo va en su propio módulo y el kernel no los ve. Varios
(anclaje con drift a nivel de pieza, piezas con linaje, familias por preestado, "lentes de
conocimiento", "cruces del puente") son features de circunstancia con demanda de un solo
modelo (HODOM/gist). Conviene validar la demanda antes de portarlos.

### 8.9 Otras capas de indirección sin valor

- Tres barrels anidados (`tipos.ts`, `operaciones.ts`, `operaciones/refinamiento.ts`) con
  comentarios del estilo "preserva firmas pre-ronda 9.5".
- `constantes.ts` re-exporta `CANON_V2` como `CANON` "shim" para la paleta.
- `politicaApariciones.clasificarAparicion` devuelve `visible: true` y
  `razonVisibilidad: "apariencia-en-opd"` como constantes.
- `helpers.ts` re-exporta `entidadVisibleEnOpd` desde `politicaApariciones`.

### 8.10 Coste de rendimiento evitable

`sincronizarPuertosTodosLosOpd` corre en cada creación o reapuntado de enlace, en cada
cambio de multiplicidad, al exportar, al hidratar y en cada commit del store. La mayoría de
los predicados recorren `Object.values(modelo.enlaces)` o `opds` sin índices
(`esAtributoDerivado`, `afiliacionEfectiva`, `estadoTieneEnlaces`, `abanicoDeEnlace`). En
un modelo de 60 objetos, 60 enlaces transaccionales tardan ~56 ms (sonda). Escala mal en
modelos grandes (HODOM: 35 entidades y 102 enlaces, según la documentación).

---

## 9. Recomendación por pieza (reescritura)

**Keep (portar casi igual, limpiando comentarios):**
- `validarFirmaEnlace` y la tabla F1-F12 (más F13 nueva: objeto ↛ su propio estado).
- `crearEnlace` guards C1-C6 y `validarUnicidadRolPar` (la regla R-OPD-HAB-4 está bien
  razonada: permite ramas O/XOR y transiciones múltiples y bloquea la mezcla de rol).
- `establecerRefinamiento` + `adoptarOpd` + `devolverOpdABocetos`: un constructor único,
  aciclicidad, reversibilidad no destructiva.
- `refinamientos.ts` (producto parcial ortogonal descomposición/despliegue).
- Reglas de estados S1-S5, S7, S8 y `visibilidadEstados` (sin los sellos).
- Reglas de abanico A1-A3, A5, A7 y la validación de probabilidades.
- `modificadores.validarMetadatosEnlace` como validador único de metadatos del enlace.
- `extremos.ts`, `rutas.ts`, `objetoDuracion.ts`, `afiliacionEfectiva.ts`,
  `autoinvocacion.ts` (usando el allocator común), `opdSueltos.ts`, `opdSuelto.ts`.
- `integridadReferencial` como **única** barrera de import, sin depender de checkers.
- `ontologia.ts` (chico, puro y opcional).
- `layout.ts` y `apariencias.ts` en la capa de vista.
- Patrón `Resultado<T>` y operaciones puras inmutables.

**Simplify:**
- `Modelo`: separar el núcleo OPM, las vistas y los anexos (§8.8); migración `v0 → v1`
  que elimine las redundancias de §8.6.
- `Enlace`: un solo cambio de estado (§8.3); quitar `subtipoModificador`; mover `portId`
  a la vista; tipar `tasa` y tiempos como `{valor:number, unidad}`.
- `Abanico`: identidad por el extremo común lógico, no por el puerto; probabilidades en
  un solo lugar; sin dueño-OPD (o con dueño solo como hint de dibujo).
- `Estado`: quitar la geometría (va a la aparición del objeto o se calcula), dejar
  `designaciones` como única fuente y fijar si "inicial" es único (resolver S6a/S6b
  contra el canon).
- Refinamiento: la proyección calculada reemplaza a `proyeccion.ts` + `inheritedFanGuard`;
  el orden temporal pasa a dato (bandas), no geometría (§8.4).
- `operaciones/enlaces.ts` grupos/plegado estructural (~600 líneas): reducir a
  "grupo = conjunto de ramas de un refinable + tipo" y plegado = estado de vista.
- `plegado.ts`: fusionar con el plegado estructural; un único concepto de "partes ocultas
  en esta aparición".
- `creacionInterna`: que `crearEntidad` devuelva `{modelo, entidadId, aparienciaId}` en
  vez de detectar por diferencias o dimensiones. Igual en `crearEnlace` (hoy
  `transaccionEnlace` detecta el nuevo id por diferencia de claves).
- Allocator de ids: uno solo, sin aritmética manual; opcionalmente ids opacos (UUID/nanoid)
  con `nextSeq` solo para nombres por defecto.
- `opcionesEnlace`: evaluar con **los mismos** guards de creación (una función
  `puedeCrearEnlace` usada por la UI y por la creación).
- `opdReorden.moverNodo`: prohibir mover OPDs de refinamiento a otro padre, o
  re-vincular explícitamente.

**Cut (o bajar a anexo opcional, fuera del kernel):**
- `inheritedFanGuard.ts`, `enlaceMultiplicidad.ts` (fusionar), `designarEstadoInicial/Final`
  duplicados, `crearEnlaceConExtremoPlegado` (usar `crearEnlace` con visibilidad ampliada),
  `tipos/pestana.ts`, `tipos/ui.ts` y `tipos/opl.ts` fuera de `modelo/`, `CrucesPuenteSkill`,
  `ModoPlegado "desplegado"`, código muerto de §7.14, `imagenObjeto.precargarBitmap` y
  su cache (van a render), `simboloEstructural.ts`, `anclajesEnlace.ts`, `ports.ts`,
  `constantes.bauhaus.ts` (van a render), y los comentarios de doctrina y rondas.
- A decidir por demanda real (probablemente anexos): `anclaje.ts` (drift),
  `clonarEntidad.ts`, `injertoEstereotipo.ts`, `familiasEfectosPreestado.ts`,
  `lineal`, `simulacion` en `Entidad`, `lentesConocimiento`, `pieceLineage`.

---

## 10. Forma mínima propuesta del núcleo (orientativa)

```ts
// Kernel OPM (semántica pura, sin geometría)
type Cosa = { id; tipo: "objeto"|"proceso"; nombre; esencia; afiliacion;
              unidad?; valor?: ValorSlot; descripcion?; alias?;
              refinamientos?: { descomposicion?: RefDesc; despliegue?: RefDespl } };
type RefDesc   = { opdId; bandas?: Id[][]; anclajes?: Record<EnlaceId, SubprocesoId[]> }; // override explícito
type RefDespl  = { opdId; modo: ModoDespliegueObjeto };
type Estado    = { id; cosaId; nombre; designaciones?: DesignacionEstado[]; duracion?; suprimido?; orden: number };
type Extremo   = { cosa: Id } | { estado: Id };
type Enlace    = { id; tipo: TipoEnlace; origen: Extremo; destino: Extremo;
                   etiqueta?; multiplicidad?: {origen?; destino?}; modificador?: "condicion"|"evento"|"no";
                   probabilidad?; demora?; ruta?; transicion?: {entrada?: Id; salida?: Id};
                   backwardTag?; tasa?; tiempos?; grupoEstructural?: Id };
type Abanico   = { id; operador: "O"|"XOR"; extremoComun: {cosa: Id; lado}; enlaces: Id[]; pesos?: Record<Id, number> };
// Vistas
type Opd        = { id; nombre; padreId: Id|null; apariciones: Record<Id, Aparicion>; enlaces: Record<Id, AparicionEnlace>; vista? };
type Aparicion  = { id; cosaId; x; y; w; h; plegado?; estadosOcultos?: Id[]; puertos?: … };
type AparicionEnlace = { id; enlaceId; vertices; etiquetas?; simbolo?; escindido?: boolean };
```

Invariantes que la reescritura debe hacer **explícitos** y aplicar tanto al editar como
al importar:
- nombre único (N2), también en la siembra de refinamientos, el injerto y el calco;
- ≥ 2 estados (S2);
- a lo sumo un `default` y un `current` por objeto (S5);
- política de `inicial`/`final` (a resolver contra el canon);
- una aparición por cosa y OPD, o duplicados explícitos;
- ¿puede existir un enlace sin aparición? (hoy: no, I);
- una cosa sin aparición se recolecta (hoy: sí, al quitar un refinamiento o un OPD; no al
  crear).

---

## 11. Partes de alta calidad para portar

1. **`validarFirmaEnlace`** (`operaciones/helpers.ts:58-148`): tabla de firmas completa,
   exhaustiva por tipo, con mensajes accionables y citas.
2. **`validarUnicidadRolPar`** (`operaciones/enlaces.ts:1058-1110`): la regla de rol es
   fina, está bien documentada y separa el guard de edición del checker.
3. **`establecerRefinamiento`** y el ciclo adoptar/devolver (`refinamiento/establecer.ts`):
   convergencia por construcción; la reversibilidad no destructiva preserva la identidad.
4. **`refinamientos.ts`**: helpers mínimos y claros del producto parcial.
5. **`proyeccionesEnlaceExterno`** (`proyeccion.ts:703-735`): la **tabla** de distribución
   R13 es valiosa como regla por defecto, aunque su materialización no lo sea.
6. **`validarProbabilidadesAbanico`** y la disolución automática por debajo de 2 ramas.
7. **`visibilidadEstados.estadoVisibleEnAparicion`**: el predicado es correcto y simple.
8. **`derivarOrdenInzoomDeGeometria` + `agruparSubprocesosParalelos`**: sirven como
   heurística de *import* (convertir geometría a bandas) aunque la geometría deje de ser
   la fuente.
9. **`integridadReferencial.validarReferenciasOpd`**: una lista compacta de invariantes
   duros.
10. **`ontologia.ts`** y **`nombresCanonicos.ts`**: puros, chicos y testeables.
11. La suite de tests del kernel (~12,5 k líneas) sirve como **oráculo de reglas**: al
    reescribir hay que extraer de ella los casos de reglas (no los de forma interna).

---

## 12. Riesgos para la reescritura

- **Datos persistidos `v0`**: hace falta un migrador que colapse las redundancias. También
  debe convertir los derivados automáticos en proyección, conservar los manuales como
  overrides, pasar `portId` a la vista, recalcular la identidad de los abanicos y
  transformar el par escindido en TS3.
- **Bimodalidad OPD⇄OPL**: el parser OPL (`opl/parser/aplicar.ts`) usa `designarInicial`
  (aditivo) y `ajustarMultiplicidad`. Cambiar reglas del kernel cambia el roundtrip. Hay
  que coordinar con el dossier de OPL.
- **Canon no disponible aquí**: S6 (unicidad de inicial), R13 (distribución por defecto),
  F11 (excepción ambiental), el modificador `"no"` y el `efecto O→P` de rama deben
  contrastarse con `reglas-opm-estrictas-es` antes de fijarlos.
- **Dependencias del store**: `store/runtime.ts` asume `sincronizarAbanicos` +
  `sincronizarPuertosTodosLosOpd` + `mensajeBloqueoCambioAbanicoHeredado` en cada commit,
  undo y redo (`runtime.ts:705,1115-1118,1663,1725`). Al quitar la materialización, ese
  pipeline se simplifica, pero hay que reescribirlo junto con el kernel.
- **Suite verde ≠ validación humana**: los tests actuales fijan también los
  comportamientos accidentales (por ejemplo, nombres sembrados duplicados). No deben
  portarse a ciegas.
