# DESIGN-A — opforja rehecho con minimalismo radical

Arquitecto A · Lente A: el menor número de líneas, archivos, superficies y conceptos que cumple el canon.
Autoridades: `DECISIONS.md` (fijas), `understand/CANON.md` (alcance y semántica, requisitos T-NNN, decisiones DR-n),
los 4 documentos del canon y los dossiers del estado actual. Donde este documento dice «P-n» se trata de una
decisión de producto nueva (lista completa en §11, archivo `docs/decisiones.md`); donde dice «DR-n» remite a
CANON.md §10.

---

## 1. Principios y alcance

### 1.1 Principios de la lente A (aplican a cada decisión del documento)

1. **Un solo camino por cosa.** Una función valida un enlace (la matriz), una función muta el modelo (las
   operaciones del núcleo), una función dibuja (el renderizador de cadena SVG), una función guarda (PUT con CAS),
   una tabla define el OPL en ambos sentidos (plantillas). Canvas, inspector, editor OPL e importación consumen
   las mismas piezas.
2. **Derivar antes que persistir.** Visibilidad de enlaces por OPD, vista padre plegada, etiquetas `SDx.y`,
   contorno grueso, colección incompleta visible, marca `⋯N`, geometría de estados, triángulos y rutas se
   calculan. Solo se persiste lo que es hecho OPM o intención del modelador que no se puede recalcular
   (posición, tamaño mínimo, alcance interno/externo, orden de bandas, orden de estados).
3. **Invariantes por construcción.** «≤1 apariencia por (cosa, OPD)» es la clave del mapa de apariencias; «a lo
   sumo un control por enlace» es un campo escalar; «un refinamiento de cada tipo por cosa» es un slot; «sin
   placeholders» es que no existe cosa sin nombre.
4. **Sustraer superficies.** Sin paleta de comandos, sin menú contextual, sin pestañas internas, sin selección
   múltiple, sin carpetas, sin versiones, sin tutor, sin cintas. Tres pantallas, tres regiones de editor, cuatro
   emergentes, un diálogo (§7.11).
5. **Honestidad epistémica sin ceremonia.** Nada se descarta en silencio: la importación informa lo no
   representado; el parser responde `unsupported-canonical`; el registro de conformidad declara cada DEBE no
   cumplido; ningún gesto se presenta como validación humana.
6. **Dependencias mínimas.** Producción: `preact` y la fuente `@fontsource/inria-serif`. Desarrollo:
   `typescript`, `vite`, `@preact/preset-vite`, `@playwright/test`, `@types/bun`. Sin zustand, sin JointJS, sin
   ESLint, sin SDK de LLM, sin PostgreSQL. El servidor usa solo Bun y `node:crypto`/`node:fs`.

### 1.2 Qué entra (CANON.md §0.1, literal)

Entra exactamente lo que CANON.md §0.1 exige a la herramienta, más la infraestructura mínima de DECISIONS.md:

| # §0.1 | Realización en este diseño |
|---|---|
| 1 Modelo único (kernel) | `app/src/modelo/` (§3, §4); OPD y OPL son proyecciones puras |
| 2 Impedir / advertir | matriz única `modelo/matriz.ts` + `modelo/diagnostico.ts` (§4.4, §4.5) |
| 3 Generar y parsear OPL-ES | `app/src/opl/` con una tabla de plantillas bidireccional (§5) |
| 4 Renderizar el vocabulario visual cerrado | `app/src/opd/` renderizador SVG propio, de cadena (§6) |
| 5 Operaciones de refinamiento | `modelo/refinamiento.ts`: descomponer, desplegar, bandas, distribución, escisión, eliminar (§4.6) |
| 6 Exportar `canon-diagrama`, `canon-documento`, JSON | `opd/exportar.ts` + `modelo/codec.ts` (§6.9, §3.6) |
| 7 Registro de conformidad | `docs/conformidad.md` (§1.4) |
| Infraestructura | una cuenta; biblioteca (nuevo, abrir, eliminar a papelera, restaurar, importar); modelos como archivos `deep-opm-pro.modelo.v0`; exportar; deshacer/rehacer por instantáneas inmutables (costo trivial, DECISIONS) |

Cobertura: los **180 requisitos ★** se implementan todos. De los 68 no-★ se implementan todos salvo los listados en
§1.4 como `no implementado` o `parcial`. En particular se implementan (no-★ baratos o dolores reales del operador):
T-017/T-207 `Current` con pin, T-020 valor puntual, T-034/T-118/T-217 colección incompleta, T-035 género,
T-050, T-056, T-057/T-128/T-218 multiplicidad `? * +`, T-058/T-129/T-219 ruta, T-061 AP-27, T-081 rebote de
externo, T-088, T-090, T-091, T-109, T-120, T-121 (SSE1–SSE7), T-122–T-124 (incluidas las tres plantillas de
abanico×control), T-139 tres modos de esencia, T-154, T-163, T-169, T-175, T-183, T-205, T-222 rótulo
`Nombre : Clase`, T-225, T-226, T-231, T-244–T-247, T-250 reanclaje, T-253, T-254, T-264, T-266, T-267, T-269,
T-271, T-272, T-284, T-285, T-288, T-303 (lista de cierre en AGENTS.md), T-304, T-305.

### 1.3 Qué no entra

Todo CANON.md §0.4 (simulación/runtime, bilingüismo, sub-modelos y composición, Anexo C salvo R-CAT-EQ-3,
Bocetos/Apunte/Taller/Graduar/Biblioteca/versiones, estereotipos y requisitos, anclaje/drift/calcar, capa
computacional, `Pr`/m-de-f, negación, demora, RF2o, sufijo `[etiqueta:]`, prosa compuesta, semi-plegado y
CX4–CX8, vistas/mapa/Bring, estilado autoral, preset de esencia, preservación de superficie, cambio de rol entre
niveles, materialización de herencia, asistente del método, deshacer como exigencia, silueta duplicada,
previsualización raster, gobierno documental) y lo que DECISIONS.md excluye: agente LLM, tutor, mesa y CLI `mesa`,
carril Bearer, revisión compartida, lector portátil, paquete portátil, captura de bugs, modo móvil de solo lectura,
carpetas, versiones con nombre, pestañas de modelos, paleta `⌘K`, `render:headless`, `verify:reproducible`,
compilador de proto-modelos (`autoria/`), sello de procedencia, puentes URN/KORA.

Diferidos por decisión pendiente del dueño (DECISIONS.md, CANON.md §10.3), con default conforme:
RX1/RX2 (DR-10) y descomposición de objeto (DR-23) no se ofrecen y el parser responde `unsupported-canonical`;
agente solo desde objeto físico (DR-5); mapeo de unidades es-CL por defecto (DR-18).

### 1.4 R-CONF-7: el registro de conformidad

`docs/conformidad.md` es el único registro. Formato (CANON.md §10.2, GAP-27):

```
| Req. | Regla(s) | Estado | Superficies (UI·núcleo·import·OPL·export) | Evidencia | Nota |
```

- Una fila por cada requisito T-001…T-324 de `docs/especificacion.md` §9 (248 filas) más filas propias para lo
  que no tiene T-ID pero sí DEBE: RX1/RX2, AP-14, R-VIS-HIJO-1 (desvío DR-13), exención >25 de R-LAY-1.
- Estados admitidos (R-APP-2): `enforzado`, `parcial`, `no implementado`, `zona laxa pendiente`. Una regla solo es
  `enforzado` si cubre todas las superficies aplicables (R-APP-3); «Evidencia» nombra el test cuyo título lleva el
  T-ID (`test('T-043 resultado nunca al estado inicial', …)`).
- Filas con estado distinto de `enforzado` al cerrar la implementación (lista exacta):

| Req. | Estado | Motivo y comportamiento declarado |
|---|---|---|
| T-072 descomposición de objeto | no implementado | DR-23. Los modelos importados que la tengan se muestran y navegan; no se emite oración CX; el parser responde `unsupported-canonical`; diagnóstico `info` DESCOMPOSICION_OBJETO |
| T-121 especialización de estado | parcial | SSE1–SSE7 enforzados; `**A** en `s1` y **B** en `s2` son **G** en `s`` no implementada (parser `unsupported-canonical`; la UI no ancla estados en generalización) |
| T-086 / R-VIS-HIJO-1 | parcial | Desvío declarado DR-13: los procedimentales distributivos se ven sobre el contorno |
| T-094 | parcial | Detecta inclusión múltiple de refinador; no detecta generales redundantes (DEBERÍA) |
| T-124 / T-056 | parcial | Tres combinaciones abanico×control con plantilla literal; C-19b, C-18 instrumento y agente condicionado: no ofrecidas, parser `unsupported-canonical` |
| T-193 | enforzado (nota obligatoria) | bisimetrías parciales declaradas y fixtures no estrictas: escisión, borrado, layout, alcance interno/externo, estados ocultos en todos los OPDs, abanico con ruta, abanico con control sin plantilla, par SE3 frente a dos SE1 (P-21) |
| T-230 | parcial | modo runtime vacío (sin simulación); navegación y gestión-modal por construcción |
| T-266 | parcial | heurísticas léxicas mínimas (listas cortas) |
| T-271 | parcial | LF-19 exime estados iniciales (P-11) |
| T-283 | parcial | exención «salvo vista tipificada o refinamiento declarado» no realizada: bloqueo conservador de todo OPD >25 |
| RX1/RX2 | zona laxa pendiente | DR-10 |
| AP-14 | zona laxa pendiente | «DEBE bloquearse como sinónimo falso»: no detectable mecánicamente |
| T-320…T-324 | no implementado | PUEDE; fuera de alcance |

La brecha silenciosa queda cerrada por tres mecanismos y ninguno más: (a) el registro; (b) el informe de
importación, que lista todo campo no representado; (c) los diagnósticos, que marcan como error estructural
recuperable cualquier dato representable que viole el canon.

### 1.5 Regla de identificadores (reconciliación DECISIONS ↔ tarea)

DECISIONS dice «identificadores de código nuevos en inglés»; la tarea exige vocabulario del canon en español para
el dominio. Se resuelve así, sin excepciones: **todo identificador de dominio** (tipos, campos, valores de enum,
operaciones del núcleo, nombres de archivos de dominio) usa el vocabulario del formato v0 y de CANON.md §1.2 en
español (`Entidad`, `crearEnlace`, `descomponer`, `estadoEntradaId`), porque no es vocabulario nuevo sino el
contrato v0. Los identificadores **puramente técnicos sin semántica OPM** (utilidades genéricas como `get`, `set`,
`subscribe`, `sha256`, `debounce`, parámetros de HTTP) van en inglés. UI, OPL y documentación en es-CL.

---

## 2. Arquitectura

### 2.1 Árbol final del repositorio

```
/
├── README.md                    qué es, cómo correrlo, enlaces a docs/
├── AGENTS.md                    contrato de trabajo (actualizado: dependencias, check, lista de cierre Anexo A)
├── CLAUDE.md                    @AGENTS.md
├── NOTICE.md                    licencia no declarada; canon vendorizado pertenece a su autor; sin material OPCloud
├── Dockerfile                   2 etapas: build (bun) → runtime (bun) un solo proceso
├── docker-compose.yml           1 servicio + 1 volumen + Traefik
├── .dockerignore  .gitignore
├── deploy/
│   ├── deploy.sh                circuito único: build, up --wait, salud, versión, 401
│   ├── respaldar-datos.sh       tar.gz diario del volumen, retención 14 días
│   └── systemd/opforja-respaldo.{service,timer}
├── docs/
│   ├── README.md                índice de 6 líneas
│   ├── uso.md                   guía de uso: pantallas, gestos, atajos, flujos
│   ├── operacion.md             cuenta, datos, respaldo, despliegue, migración, rollback
│   ├── conformidad.md           registro R-CONF-7 (§1.4)
│   ├── decisiones.md            DR-n usadas + decisiones de producto P-n
│   ├── especificacion.md        CANON.md derivada (vendorizada, subordinada al canon)
│   └── canon/                   los 4 documentos, tal cual
│       ├── reglas-opm-estrictas-es.md       (1.5.0)
│       ├── spec-forja-opd-es.md             (1.4.0)
│       ├── spec-forja-opl-es.md             (1.4.1)
│       └── metodologia-forja-opm-es.md      (1.7.0)
├── fixtures/demo-models/*.json  6 modelos v0 (se borran .md y .opl.txt)
└── app/
    ├── package.json  bun.lock  bunfig.toml  tsconfig.json  vite.config.ts  playwright.config.ts  index.html
    ├── src/
    │   ├── main.tsx
    │   ├── modelo/   tipos.ts indice.ts lexico.ts matriz.ts operaciones.ts refinamiento.ts proyeccion.ts diagnostico.ts codec.ts
    │   ├── opl/      plantillas.ts generar.ts parsear.ts editor.ts
    │   ├── opd/      texto.ts geometria.ts layout.ts escena.ts svg.ts exportar.ts
    │   ├── app/      estado.ts acciones.ts atajos.ts api.ts
    │   └── ui/       App.tsx Biblioteca.tsx Editor.tsx Lienzo.tsx Propiedades.tsx PanelOpl.tsx Emergentes.tsx estilos.css
    ├── servidor/     servidor.ts almacen.ts cuenta.ts migrar-postgres.ts
    ├── test/         ayuda.ts + 17 archivos *.test.ts + dorados/ (§10)
    └── e2e/          ayuda.ts + 14 archivos *.spec.ts (§10)
```

### 2.2 Responsabilidad y presupuesto por archivo

| Archivo | Responsabilidad única | LOC |
|---|---|---:|
| `modelo/tipos.ts` | Tipos exactos (§3.1), constantes cerradas (`TIPOS_ENLACE`, familias, `UNIDADES`, `PROCEDIMENTALES`) y `Resultado`/`Cambio`/`Diagnostico` | 130 |
| `modelo/indice.ts` | Índice memoizado por `WeakMap<Modelo>`: apariencias por cosa, enlaces por cosa/estado, abanico por enlace, OPD→cosa refinada y tipo, hijos, preorden, etiquetas `SDx.y`, subprocesos y bandas, cadena de generales, estados ordenados | 110 |
| `modelo/lexico.ts` | Léxico EBNF de nombres de cosa/estado/etiqueta, clave de unicidad, `y/e` y `o/u` fonéticos, artículo por género, palabras es-CL de unidades | 70 |
| `modelo/matriz.ts` | Matriz de validez única (§4.4): `validarEnlace`, `tiposPosibles`, reglas transversales | 330 |
| `modelo/operaciones.ts` | Todas las mutaciones de cosas, estados, enlaces, abanicos, apariencias, modelo | 560 |
| `modelo/refinamiento.ts` | Descomponer, desplegar, subprocesos y bandas, `distribuir`, escisión, eliminar refinamiento | 330 |
| `modelo/proyeccion.ts` | `vistaOpd`: visibilidad derivada, abstracción, fusión por fuerza, matriz 3×3, R-VIS-HIJO-1, colección incompleta visible | 260 |
| `modelo/diagnostico.ts` | Tabla de reglas y barridos (§4.5), compuertas de export | 420 |
| `modelo/codec.ts` | `importar` (normalización v0/legacy, informe, rechazo) y `exportar` (forma exacta, determinista) | 520 |
| `opl/plantillas.ts` | Tabla única de plantillas (≈95 filas), vocabulario cerrado, lista `unsupported-canonical`/`non-canonical` | 650 |
| `opl/generar.ts` | Hechos por OPD → líneas con tokens; orden; display (esencia, numeración, encabezados) | 420 |
| `opl/parsear.ts` | Normalización, tokenización tipográfica, esqueleto, listas, bandas, `Oracion` | 380 |
| `opl/editor.ts` | Resolución contra el modelo, plan de patches por fases, conflictos, 4 estados de línea, aplicación todo-o-nada | 380 |
| `opd/texto.ts` | Métrica de texto por clases de carácter (determinista en Bun y navegador), ajuste de línea, autosize | 90 |
| `opd/geometria.ts` | Recorte elipse/rectángulo/rountangle, polilíneas, punto a lo largo, peine ortogonal, rayo, lazo, arcos de abanico, intersecciones | 260 |
| `opd/layout.ts` | Colocación libre, externos al descomponer, bandas, contenedor, despliegue, colocación de cosas creadas por OPL | 200 |
| `opd/escena.ts` | `escena(m, opdId)`: nodos, aristas, triángulos, arcos, etiquetas, bbox (puro) | 380 |
| `opd/svg.ts` | `svg(escena, {interactivo})`: cadena SVG con marcadores literales; mismo código para lienzo y export | 330 |
| `opd/exportar.ts` | `canon-diagrama` (SVG por OPD), `canon-documento` (HTML), OPL Markdown, advertencias de cruces/oclusión, compuertas | 170 |
| `app/estado.ts` | Almacén observable mínimo + hook `useAlmacen` | 60 |
| `app/acciones.ts` | `ejecutar(op)` único punto de commit; deshacer/rehacer; navegación; guardado automático | 330 |
| `app/atajos.ts` | Tabla de atajos (§7.12) y despachador | 70 |
| `app/api.ts` | Cliente HTTP (sesión, modelos, papelera) y borrador en `localStorage` | 150 |
| `ui/App.tsx` | Enrutador por hash (`#/`, `#/m/<id>/<opdId>`), pantalla de ingreso | 130 |
| `ui/Biblioteca.tsx` | Lista, búsqueda, nuevo, importar (con informe en línea), eliminar, papelera | 170 |
| `ui/Editor.tsx` | Encabezado, disposición, banda de conflicto, línea de mensajes | 190 |
| `ui/Lienzo.tsx` | Host SVG, cámara, máquina de estados del puntero, entrada de nombre en línea, capa UI | 480 |
| `ui/Propiedades.tsx` | Propiedades de cosa, estado, enlace, OPD/modelo | 420 |
| `ui/PanelOpl.tsx` | Bloques por OPD, tokens, hover/clic, filtros, edición libre con clasificación | 300 |
| `ui/Emergentes.tsx` | Primitivo `Emergente` + árbol OPD, diagnóstico, tipo de enlace, exportar, `Confirmar` | 260 |
| `ui/estilos.css` | Tokens CSS (spec-OPD §18.1) y estilos | 320 |
| `main.tsx` | Arranque | 15 |
| `servidor/servidor.ts` | `Bun.serve`: rutas, sesión, CSRF, límites, estáticos, `/healthz` | 260 |
| `servidor/almacen.ts` | Archivos: escritura atómica, índice en memoria, CAS por sha256, papelera | 150 |
| `servidor/cuenta.ts` | CLI: fijar clave (scrypt) y secreto de cookies | 50 |
| `servidor/migrar-postgres.ts` | Migración única PostgreSQL → archivos, con informe | 180 |

Totales estimados: **fuente ≈ 9 500 LOC** TS/TSX (+ 320 CSS); **tests ≈ 4 500 LOC** unitarios/servidor +
**≈ 1 400 LOC** e2e. Frente a ~133 k de fuente y ~70 k de tests actuales: −93 %.

### 2.3 Dirección de dependencias

```
modelo  →  opl  →  opd  →  app  →  ui
   ↑
servidor (solo modelo/codec.ts y, a través de él, modelo/*)
```

- `modelo/*` no importa nada fuera de `modelo/`. `opl/*` importa solo `modelo/`. `opd/*` importa `modelo/` y
  `opl/` (el documento canónico incluye OPL; el menú de enlace usa el generador real para su vista previa, desde
  `ui`). `app/*` importa `modelo`, `opl`, `opd`. `ui/*` importa `app` y tipos. El servidor solo importa
  `modelo/codec.ts`.
- Se verifica con `test/arquitectura.test.ts` (40 LOC, lee imports con una expresión regular, no escribe en disco).

---

## 3. Modelo de datos interno

### 3.1 Tipos TypeScript exactos (`modelo/tipos.ts`)

```ts
export type Id = string;
export type TipoCosa = 'objeto' | 'proceso';
export type Esencia = 'fisica' | 'informacional';          // default 'informacional'
export type Afiliacion = 'sistemica' | 'ambiental';        // default 'sistemica'
export type UnidadTiempo = 'ms' | 'sec' | 'min' | 'hour' | 'day' | 'week' | 'month' | 'year';
export type ModoDespliegue = 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion';
export type RelacionIncompleta = 'agregacion' | 'exhibicion' | 'generalizacion';   // nunca clasificación
export type TipoEnlace =
  | 'consumo' | 'resultado' | 'efecto'                                  // transformadora
  | 'agente' | 'instrumento'                                           // habilitadora
  | 'invocacion'                                                       // invocación
  | 'excepcionSobretiempo' | 'excepcionSubtiempo'                      // excepción
  | 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion'   // estructural fundamental
  | 'etiquetado' | 'etiquetadoBidireccional';                          // estructural etiquetada (recíproco = P-1)
export type Multiplicidad = '?' | '*' | '+';                            // ausente = 1..1

export interface Duracion { min?: number; esperada?: number; max?: number; unidad?: UnidadTiempo }

export interface Entidad {
  id: Id; tipo: TipoCosa; nombre: string; esencia: Esencia; afiliacion: Afiliacion;
  genero?: 'f';                                  // ausente = masculino (R-OPL-1)
  descripcion?: string;                          // meta; no emite OPL
  valorSlot?: string;                            // «**A** de **X** es v.»
  duracion?: Duracion;                           // solo procesos
  coleccionIncompleta?: RelacionIncompleta[];    // declarada por el modelador
  refinamientos?: {
    descomposicion?: { opdId: Id };
    despliegue?: { opdId: Id; modo: ModoDespliegue };
  };
}

export interface Estado {
  id: Id; entidadId: Id; nombre: string;
  orden: number;                                 // 0..n-1 por objeto; orden semántico y visual
  esInicial?: true; esFinal?: true;
  designaciones?: Array<'default' | 'current'>;  // ≤1 'default' y ≤1 'current' por objeto
  suprimido?: true;                              // supresión global
}

export interface Enlace {
  id: Id; tipo: TipoEnlace;
  origenId: Id; destinoId: Id;                   // siempre cosas; dirección canónica de §4.4
  estadoEntradaId?: Id;                          // consumo/agente/instrumento: estado requerido;
                                                 // efecto: estado de entrada; etiquetados: estado en el origen
  estadoSalidaId?: Id;                           // resultado: estado producido; efecto: salida; etiquetados: estado en el destino
  modificador?: 'evento' | 'condicion';          // a lo sumo uno (escalar)
  etiqueta?: string;                             // etiquetados (y etiqueta-f del bidireccional)
  backwardTag?: string;                          // etiqueta-b del bidireccional; ausente o igual ⇒ recíproco
  rutaEtiqueta?: string;                         // solo consumo/resultado
  multiplicidadOrigen?: Multiplicidad;
  multiplicidadDestino?: Multiplicidad;
  efectoEscindido?: { grupoId: Id; rol: 'entrada' | 'salida' };   // procedencia de escisión (R-ESCIND-0)
}

export interface Abanico { id: Id; operador: 'XOR' | 'O'; enlaceIds: Id[] }   // AND = sin abanico

export interface Apariencia {
  id: Id; entidadId: Id;
  x: number; y: number; width: number; height: number;   // esquina sup. izq.; tamaño = mínimo (P-14)
  alcance?: 'interno' | 'externo';               // solo en OPD de refinamiento; ausente en la cosa refinada y en SD
  estadosSuprimidos?: Id[];                      // supresión local
}

export interface Opd {
  id: Id; padreId: Id | null;                    // null solo en la raíz
  ordenLocal: number;                            // orden entre hermanos (DR-4)
  apariencias: Record<Id /* entidadId */, Apariencia>;   // ≤1 por cosa: invariante por clave
  ordenInzoom?: Id[][];                          // bandas; obligatorio y completo en descomposición de proceso
}

export interface Modelo {
  id: Id; nombre: string; descripcion?: string;
  unidadTiempo?: UnidadTiempo;                   // ausente = 'min' (P-15)
  opdRaizId: Id; nextSeq: number;
  entidades: Record<Id, Entidad>; estados: Record<Id, Estado>; enlaces: Record<Id, Enlace>;
  abanicos: Record<Id, Abanico>; opds: Record<Id, Opd>;
}

export type Severidad = 'error' | 'warning' | 'info';
export type Familia = 'gramatical' | 'metodologica' | 'identidad' | 'contencion' | 'sugerencia';
export type RefOpl = { tipo: 'entidad' | 'enlace' | 'estado' | 'opd'; id: Id };
export interface Diagnostico {
  codigo: string; regla: string; severidad: Severidad; familia: Familia;
  mensaje: string; accion?: string; refs: RefOpl[]; opdId?: Id; linea?: number;
}
export type Resultado<T> = { ok: true; valor: T } | { ok: false; error: Diagnostico };
export interface Cambio { m: Modelo; id?: Id; trazas: Diagnostico[] }   // trazas = ajustes automáticos (DR-45)
```

Invariantes que el núcleo mantiene y el códec verifica:

- I1 Nombres de cosa únicos por clave `nombre.normalize('NFC').toLocaleLowerCase('es-CL')` (P-10); nombres de
  estado únicos por objeto con la misma clave.
- I2 Estados solo de objetos; `orden` denso por objeto.
- I3 Toda `Apariencia` está en un OPD alcanzable desde la raíz; `entidadId` existe.
- I4 Si `E.refinamientos.descomposicion = {opdId}` (E proceso) entonces `opds[opdId].padreId` es un OPD donde E
  aparece, E aparece en `opdId` sin `alcance`, y `ordenInzoom` de `opdId` es una partición exacta de los
  procesos con `alcance: 'interno'` de ese OPD (bandas no vacías).
- I5 Todo OPD distinto de la raíz es el `opdId` de exactamente un refinamiento (sin Bocetos, DR-42).
- I6 `efectoEscindido` solo en `efecto`; el par comparte `grupoId` (= id de la mitad de entrada) y tiene roles
  distintos; una mitad sin par no lleva el campo.
- I7 Cada enlace pertenece a lo sumo a un abanico; un abanico tiene ≥2 enlaces existentes.
- I8 Un `interno` de un OPD de refinamiento R solo aparece en R y en OPDs descendientes de R (P-9).

### 3.2 Identificadores

- Formato v0 `${prefijo}-${n}` con `n = nextSeq++` y prefijos `o` (objeto), `p` (proceso), `s` (estado),
  `e` (enlace), `ab` (abanico), `opd` (OPD), `a` (apariencia). Un solo asignador `nuevoId(m, prefijo)` que
  devuelve `[id, m']`; nunca aritmética manual. Cambiar el tipo de una cosa conserva su id.
- Opacos: nunca se muestran, nunca se interpretan (ni el prefijo). La etiqueta `SDx.y` es derivada (§4.8).
- El id del modelo (`Modelo.id`) es la clave de almacenamiento: `crypto.randomUUID()` al crear; al importar un
  archivo como modelo nuevo se reasigna (el códec no lo cambia; lo hace la acción de importar); la migración usa
  el id del registro de PostgreSQL.

### 3.3 Códec: importación (`importar(texto) → Resultado<{ modelo, informe }>`)

```ts
export interface InformeImportacion {
  normalizaciones: string[];                            // «efecto O→P normalizado a P→O (e-12)»
  noRepresentado: Array<{ ruta: string; cuenta: number; nota?: string }>;  // «enlaces[*].probabilidad» ×7
  diagnosticos: number;                                 // errores recuperables que quedan tras cargar
}
```

Canal: `JSON.parse` → sobre → forma → referencias → normalización semántica → invariantes → informe. Nunca muta
el texto de entrada; es puro y total (no lanza).

**Paso 1 · Sobre.** Acepta `{formato: 'deep-opm-pro.modelo.v0', modelo}` y el registro persistido
`{json: string, …}` (se desenvuelve `json`). `carpetaId` del sobre se ignora (informado). Otro `formato` →
rechazo `Formato no soportado: <valor>`.

**Paso 2 · Forma.** `entidades`, `estados`, `enlaces`, `abanicos`, `opds` como `Record` por id o como arreglo (se
convierte a `Record` por `id`); ausentes → `{}`. Tipos primitivos inválidos en campos núcleo (`tipo`, `nombre`,
`esencia`, `afiliacion`) → rechazo con ruta.

**Paso 3 · Referencias rotas ⇒ rechazo del import** (método F). Se rechaza, citando la ruta, si: un estado apunta a
entidad inexistente; un extremo de enlace o un `estadoEntradaId/estadoSalidaId` no existe; un abanico cita un enlace
inexistente que no sea derivado (paso 4.8); un refinamiento apunta a OPD inexistente; `opdRaizId` no existe; un
`padreId` no existe o forma ciclo; una apariencia cita entidad inexistente o `opdId` distinto de su OPD; un
`ordenInzoom` cita ids inexistentes. No hay rechazo por violaciones canónicas: esas se cargan como errores
recuperables (R-ESC-OP-4, T-288).

**Paso 4 · Normalización de todas las codificaciones v0 y legacy.** Principio P-19: todo lo representable en los
tipos de §3.1 se conserva (si viola el canon queda como error diagnosticado); solo lo no representable se descarta
y se informa.

| # | Codificación de entrada | Normalización |
|---|---|---|
| 4.1 | Extremo de enlace `string` (legacy) | si es id de estado → como extremo estado (4.2); si no → id de cosa |
| 4.2 | Extremo `{kind:'entidad'|'estado', id, portId?}` | `portId` descartado (informado una vez). `kind:'estado'` → la cosa es el dueño y el estado va a `estadoEntradaId` (consumo, agente, instrumento, origen de etiquetados, `estado→P` de efecto) o `estadoSalidaId` (resultado, `P→estado` de efecto, destino de etiquetados). En estructurales fundamentales se conserva igual y queda error ENLACE_INVALIDO |
| 4.3 | Efecto `P→O` entidad-entidad con `estadoEntradaId`+`estadoSalidaId` (TS3 compacto) | se conserva (TS3) |
| 4.4 | Efecto con un solo estado (compacto parcial) o `estado→P` / `P→estado` | TS4 / TS5 con los campos de 3.1; dirección canónica `origenId` = proceso, `destinoId` = objeto |
| 4.5 | Efecto `O→P` entidad-entidad («rama de abanico») | se reorienta a `P→O` (mismo hecho), informado |
| 4.6 | `efectoEscindido {grupoId, enlacePadreId, rol, modo}` | `modo:'standalone'` → se quita; `'par'` con compañero (mismo `grupoId`, otro rol) → `{grupoId, rol}`; sin compañero → se quita (info) |
| 4.7 | `modificador: 'evento'|'condicion'`; `subtipoModificador: 'E'|'C'|'no'` | se conserva `modificador` (o se deriva del subtipo si falta). `'no'` (negación, extensión retirada): **se omite el enlace completo** e informa «enlace negado no representado: e-N» (conservar el enlace sin `no` invertiría el hecho) |
| 4.8 | Enlaces con `derivado {tipo:'enlace-externo-refinamiento', enlacePadreId, origen}` | si algún derivado de un padre tiene `origen:'manual'`, el padre toma su extremo proceso (reanclaje del modelador, mismo id del padre); todos los derivados se descartan; los abanicos formados solo por derivados se descartan («abanico proyectado, se recalcula»). Luego rige 4.19 |
| 4.9 | `etiqueta: ""` | ausente |
| 4.10 | Multiplicidad `?`,`0..1` → `?`; `*`,`0..*`,`0..N` → `*`; `+`,`1..*`,`1..N` → `+`; `1`,`1..1` → ausente | cualquier otro valor (`N`, `2`, `2..*`, `1..5`) → descartado e informado (DR-21) |
| 4.11 | `rutaEtiqueta` | recortada; vacía → ausente |
| 4.12 | `tiempoMaximo/unidadTiempoMaximo` (sobretiempo y combinada), `tiempoMinimo/unidadTiempoMinimo` (subtiempo y combinada) | se mueven a `duracion.max/min/unidad` del proceso fuente (`origenId`); unidades v0 `ms,s,min,h,dia,sem,mes,año` y canónicas → enum; no numérico o unidad desconocida → informado; conflicto con otra cota del mismo proceso → se conserva la primera, informado |
| 4.13 | `excepcionSubSobretiempo` | se divide en `excepcionSobretiempo` + `excepcionSubtiempo` al mismo manejador (nuevo id para el segundo), informado |
| 4.14 | `probabilidad`, `demora`, `tasa`, `unidadesTasa`, `requisitos`, `mostrarRequisitos`, `grupoEstructuralId` | descartados, informados con conteo |
| 4.15 | Estado: `esInicial/esFinal` + `designaciones` con `'inicial'|'final'|'default'|'current'|'porDefecto'` | fusión en `esInicial`, `esFinal`, `designaciones` (`'porDefecto'`→`'default'`); ≥2 `default` o `current` en un objeto → se conserva el primero, informado |
| 4.16 | Estado `orden?` | orden por `orden`, luego sufijo numérico del id, luego id; se reescribe denso |
| 4.17 | Estado `x,y,width,height`, `duracion` (v0 en estados) | descartados (geometría automática P-13; la duración canónica es del proceso), informados |
| 4.18 | Entidad `refinamiento` único (legacy pre-15.2) | → `refinamientos`; `despliegue.modo` ausente → `'agregacion'` (default v0), informado |
| 4.19 | Proceso descompuesto con ≥1 subproceso y enlaces en el contorno que deben migrar | se aplica `distribuir(m, P)` (§4.6.4) — la misma función que usa la edición —, informado por enlace |
| 4.20 | `valorSlot {tipo, placeholder, valor}` | `String(valor)`; sin `valor` → ausente; `tipo` distinto de `string` informado |
| 4.21 | Entidad `esAtributo`, `alias`, `unidad`, `simulacion`, `estereotipo(Id)`, `anclaje`, `requisito`, `urls`, `imagen`, `layoutEstados`, `lineal`, `orderedFundamentalTypes` | descartados, informados |
| 4.22 | Abanico `operador:'O'|'XOR'|'OR'` | `'OR'`→`'O'`; `opdId`, `puertoComun`, `puertoEntidadId`, `decision` descartados (decision informada) |
| 4.23 | OPD `nombre`, `vista`, `preguntaGuia` | descartados (la etiqueta es derivada), informados |
| 4.24 | OPD sin `padreId` y distinto de la raíz | cuelga de la raíz (migración v0 implícita) si es destino de un refinamiento; si no, rige 4.25 |
| 4.25 | OPD no alcanzable por refinamiento (Boceto, vista, OPD suelto) | se descarta con sus apariencias; sus cosas quedan en el modelo sin apariencia (diagnóstico COSA_SIN_APARIENCIA; se ubican con «Traer»), informado por OPD (P-20) |
| 4.26 | OPD `ordenLocal` ausente | orden por sufijo numérico del id |
| 4.27 | `ordenInzoom` ausente o inválido en descomposición de proceso | se deriva de la geometría (bandas por Y con tolerancia 4 px, algoritmo de `agruparSubprocesosParalelos` v0) — único uso de geometría para semántica, solo al importar —, informado |
| 4.28 | Apariencia `contextoRefinamiento.rol` | `'contorno'` → sin `alcance`; `'interno'|'externo'` → `alcance`; ausente en OPD de refinamiento → `externo` si la cosa aparece fuera del subárbol del refinamiento, si no `interno` (informado) |
| 4.29 | Apariencia `modoTamano`, `modoPlegado`, `ordenPartes`, `parteExtraidaDe`, `ports` | descartados, informados una vez |
| 4.30 | Apariencia duplicada de la misma cosa en un OPD | se conserva la primera (DR-25), informado |
| 4.31 | Apariencia con `width/height` ≤ 0 o no finitos | 135×60, informado |
| 4.32 | `opds[].enlaces` (AparienciaEnlace: `vertices`, `symbolPos`, `symbolAnchors`, `labelPositions`) | descartados (visibilidad y geometría derivadas); se informa cuántos enlaces pasan a verse en OPDs donde estaban ocultos (P-7) |
| 4.33 | Modelo: `ontologia`, `satisfaccionesRequisito`, `declaracionesNoNucleares`, `familiasEfectosPreestado`, `anclasNormativas`, `notasMesa`, `mesaExploracion`, `estereotipos`, `procedencia`, `fichaTrabajo`, `lentesConocimiento`, `submodelos`, `pieceLineage`, `referenciaPadreSubmodelo`, `archivado`, `archivadoEn`, `versiones`, `crearVersionAlGuardar` | descartados, informados por clave con conteo |
| 4.34 | `nextSeq` | `max(nextSeq, 1 + mayor sufijo numérico de todos los ids)` |
| 4.35 | Cualquier otra clave desconocida | informada como `noRepresentado` con su ruta (patrón `collectUnrepresented` v0) |

**Paso 5 · Violaciones canónicas que se cargan como errores recuperables** (no se corrigen en silencio): nombres
fuera del léxico o duplicados, estados de procesos, enlaces fuera de la matriz, pares duplicados, abanicos
inválidos o con control sin plantilla, escindidos con control, ruta/multiplicidad en tipos no admitidos, doble
vara. Aparecen en el diagnóstico y bloquean el export canónico (T-283, T-288).

### 3.4 Códec: exportación (`exportar(m) → string`)

Forma exacta emitida (nombres de campo v0; claves en este orden fijo; campos opcionales omitidos si faltan):

```jsonc
{
  "formato": "deep-opm-pro.modelo.v0",
  "modelo": {
    "id": "…", "nombre": "…", "descripcion": "…", "unidadTiempo": "min",
    "opdRaizId": "opd-1", "nextSeq": 42,
    "entidades": { "o-3": { "id": "o-3", "tipo": "objeto", "nombre": "Paciente", "esencia": "fisica",
        "afiliacion": "sistemica", "genero": "f", "descripcion": "…",
        "valorSlot": { "tipo": "string", "placeholder": "value", "valor": "38" },
        "duracion": { "min": 1, "esperada": 2, "max": 5, "unidad": "min" },
        "coleccionIncompleta": ["agregacion"],
        "refinamientos": { "descomposicion": { "opdId": "opd-9" },
                           "despliegue": { "opdId": "opd-12", "modo": "exhibicion" } } } },
    "estados": { "s-4": { "id": "s-4", "entidadId": "o-3", "nombre": "ingresado", "orden": 0,
        "esInicial": true, "esFinal": true, "designaciones": ["default"], "suprimido": true } },
    "enlaces": { "e-7": { "id": "e-7", "tipo": "consumo",
        "origenId": { "kind": "estado", "id": "s-4" }, "destinoId": { "kind": "entidad", "id": "p-20" },
        "etiqueta": "", "modificador": "evento", "multiplicidadOrigen": "+", "rutaEtiqueta": "rápida" },
      "e-8": { "id": "e-8", "tipo": "efecto",                       // mitad de entrada de un par escindido (TS4)
        "origenId": { "kind": "entidad", "id": "p-20" }, "destinoId": { "kind": "entidad", "id": "o-3" },
        "etiqueta": "", "estadoEntradaId": "s-4",
        "efectoEscindido": { "grupoId": "e-8", "enlacePadreId": "e-8", "rol": "entrada", "modo": "par" } },
      "e-30": { "id": "e-30", "tipo": "efecto",                     // mitad de salida (TS5)
        "origenId": { "kind": "entidad", "id": "p-22" }, "destinoId": { "kind": "entidad", "id": "o-3" },
        "etiqueta": "", "estadoSalidaId": "s-6",
        "efectoEscindido": { "grupoId": "e-8", "enlacePadreId": "e-8", "rol": "salida", "modo": "par" } } },
    "abanicos": { "ab-11": { "id": "ab-11", "operador": "XOR", "enlaceIds": ["e-7", "e-9"] } },
    "opds": {
      "opd-1": { "id": "opd-1", "nombre": "SD", "padreId": null, "ordenLocal": 0,
        "apariencias": { "a-2": { "id": "a-2", "entidadId": "o-3", "opdId": "opd-1",
            "x": 120, "y": 80, "width": 135, "height": 60, "estadosSuprimidos": ["s-6"] } },
        "enlaces": {} },
      "opd-9": { "id": "opd-9", "nombre": "SD1", "padreId": "opd-1", "ordenLocal": 0,
        "ordenInzoom": [["p-20"], ["p-21", "p-22"]],
        "apariencias": { "a-10": { "id": "a-10", "entidadId": "p-5", "opdId": "opd-9", "x": 300, "y": 60,
            "width": 405, "height": 300,
            "contextoRefinamiento": { "tipo": "descomposicion", "refinableEntidadId": "p-5", "rol": "contorno" } },
          "a-12": { "id": "a-12", "entidadId": "o-3", "opdId": "opd-9", "x": 40, "y": 120, "width": 135, "height": 60,
            "contextoRefinamiento": { "tipo": "descomposicion", "refinableEntidadId": "p-5", "rol": "externo" } } },
        "enlaces": { "e-8@opd-9": { "id": "e-8@opd-9", "enlaceId": "e-8", "opdId": "opd-9", "vertices": [] } } } }
  }
}
```

Reglas de emisión:
- Extremos: consumo, agente, instrumento con `estadoEntradaId` → `origenId {kind:'estado'}`; resultado con
  `estadoSalidaId` → `destinoId {kind:'estado'}`; etiquetados análogo por lado; **efecto siempre**
  `origenId` = proceso y `destinoId` = objeto como `kind:'entidad'`, con estados en `estadoEntradaId/estadoSalidaId`.
- `etiqueta` siempre presente (cadena, `""` si no hay) por compatibilidad v0.
- `efectoEscindido` se emite con `enlacePadreId = grupoId` y `modo:'par'`.
- `valorSlot` como `{tipo:'string', placeholder:'value', valor}`.
- `opds[].nombre` = etiqueta derivada `SDx.y`; `opds[].apariencias` re-indexado por `Apariencia.id`;
  `contextoRefinamiento` derivado (rol `contorno` para la cosa refinada); `opds[].enlaces` = conjunto derivado de
  enlaces visibles directamente en ese OPD tras R-VIS-HIJO-1, con id `<enlaceId>@<opdId>` y `vertices: []`
  (compatibilidad con el bundle, CANON.md §1.2 nota).
- `opds` en preorden; demás `Record` en orden de inserción del modelo (la importación preserva el orden del archivo).
- Serialización `JSON.stringify(documento, null, 2) + "\n"`; la huella es `sha256` de esos bytes.

Leyes (tests en `codec.test.ts`): **punto fijo** `exportar(importar(exportar(m)).modelo) === exportar(m)`;
`importar(exportar(m)).modelo` es estructuralmente igual a `m` con informe vacío; **determinismo**
`exportar(m) === exportar(m)` y `exportar(aplicar(m, [])) === exportar(m)` (R-§19-LENS-3); sobre los 6 modelos de
`fixtures/demo-models/`, `importar` es `ok` y el segundo ciclo es punto fijo.

---

## 4. Núcleo

### 4.1 Forma de las operaciones

Toda mutación es una función pura `(m: Modelo, …args) => Resultado<Cambio>`; nunca lanza; nunca muta su entrada
(copia de camino con `{...m.enlaces, [id]: e}`). El rechazo es un `Diagnostico` con `codigo`, `regla`, `mensaje`
legible en es-CL y `accion` canónica (R-AP-0B). Las trazas informan ajustes automáticos (migración de contorno,
propagación ambiental, fusión de designaciones). Canvas, inspector y editor OPL llaman exactamente estas funciones
(T-011); la UI tiene un único punto de commit, `ejecutar(op)` en `app/acciones.ts`.

### 4.2 API (firmas exactas)

```ts
// Modelo
crearModelo(id: Id, nombre: string): Modelo
fijarModelo(m, c: { nombre?: string; descripcion?: string | null; unidadTiempo?: UnidadTiempo }): Resultado<Cambio>

// Cosas y apariencias
crearCosa(m, a: { tipo: TipoCosa; nombre: string; opdId: Id; x: number; y: number;
                  banda?: { indice: number; paralelo: boolean } }): Resultado<Cambio>        // id = nueva cosa
renombrarCosa(m, id: Id, nombre: string): Resultado<Cambio>
fijarCosa(m, id: Id, c: { tipo?: TipoCosa; esencia?: Esencia; afiliacion?: Afiliacion; genero?: 'f' | null;
                          descripcion?: string | null; valorSlot?: string | null; duracion?: Duracion | null;
                          coleccionIncompleta?: RelacionIncompleta[] }): Resultado<Cambio>
traerCosa(m, id: Id, opdId: Id, x: number, y: number): Resultado<Cambio>
quitarDeOpd(m, id: Id, opdId: Id): Resultado<Cambio>
eliminarCosa(m, id: Id): Resultado<Cambio>
mover(m, opdId: Id, id: Id, x: number, y: number): Resultado<Cambio>     // arrastra internos; confina; rebota externos
redimensionar(m, opdId: Id, id: Id, width: number, height: number): Resultado<Cambio>

// Estados
crearEstado(m, objetoId: Id, nombre: string, posicion?: number): Resultado<Cambio>
renombrarEstado(m, id: Id, nombre: string): Resultado<Cambio>
fijarEstado(m, id: Id, c: { esInicial?: boolean; esFinal?: boolean; porDefecto?: boolean; current?: boolean;
                            suprimido?: boolean }): Resultado<Cambio>
suprimirEnOpd(m, estadoId: Id, opdId: Id, suprimir: boolean): Resultado<Cambio>
reordenarEstado(m, id: Id, posicion: number): Resultado<Cambio>
eliminarEstado(m, id: Id): Resultado<Cambio>

// Enlaces y abanicos
crearEnlace(m, e: { tipo: TipoEnlace; origenId: Id; destinoId: Id; estadoEntradaId?: Id; estadoSalidaId?: Id },
            opdId: Id, abanico?: { con: Id; operador: 'XOR' | 'O' }): Resultado<Cambio>
fijarEnlace(m, id: Id, c: Partial<Pick<Enlace, 'tipo' | 'modificador' | 'etiqueta' | 'backwardTag' | 'rutaEtiqueta'
            | 'multiplicidadOrigen' | 'multiplicidadDestino' | 'estadoEntradaId' | 'estadoSalidaId'>>): Resultado<Cambio>
reanclarEnlace(m, id: Id, extremo: 'origen' | 'destino', cosaId: Id, estadoId: Id | null, opdId: Id): Resultado<Cambio>
eliminarEnlace(m, id: Id): Resultado<Cambio>
fijarAbanico(m, enlaceId: Id, operador: 'XOR' | 'O' | null, ramas: Id[]): Resultado<Cambio>

// Refinamiento
descomponer(m, procesoId: Id, opdPadreId: Id): Resultado<Cambio>          // id = OPD hijo
desplegar(m, cosaId: Id, modo: ModoDespliegue, opdPadreId: Id): Resultado<Cambio>
reordenarSubproceso(m, procesoId: Id, destino: { indice: number; paralelo: boolean }): Resultado<Cambio>
eliminarRefinamiento(m, cosaId: Id, tipo: 'descomposicion' | 'despliegue'): Resultado<Cambio>
distribuir(m, procesoId: Id): Cambio                                      // idempotente; lo usan crearCosa, crearEnlace y el códec

// Consultas (puras, memoizadas)
indice(m): Indice
etiquetaOpd(m, opdId): string                        // 'SD', 'SD1', 'SD1.2'
subprocesos(m, procesoId): Id[][]                    // bandas
estadosDe(m, objetoId): Estado[]                     // ordenados
estadoVisible(m, estadoId, opdId): boolean
vistaOpd(m, opdId): VistaOpd                         // §4.7
tiposPosibles(m, a: Extremo, b: Extremo, opdId): Propuesta[]   // §4.4
validarEnlace(m, e: Enlace, opdId?: Id): Diagnostico[]
diagnosticar(m): Diagnostico[]                       // memoizado
compuertasExport(m, opdId?: Id): Diagnostico[]       // vacío ⇒ export canónico permitido
```

Errores de operación frecuentes (código · mensaje · acción): `NOMBRE_EXISTE` «Ya existe **X** (objeto)» · «Trae
la existente o escribe otro nombre»; `NOMBRE_LEXICO` «La palabra ‘2’ debe empezar con letra (R-§18-LEX-1)» ·
«Usa letras, dígitos, - o _»; `ES_INTERNO` «**X** es interno de SD1 (método A3.3)» · «Elimínalo del modelo con
Mayús+Supr»; `REFINAMIENTO_NO_HOJA` «SD1 tiene OPDs hijos (R-REF-3)» · «Elimina primero sus refinamientos»; más
todos los códigos de la matriz (§4.4).

### 4.3 Semántica de las operaciones que no son triviales

- `crearCosa` en un OPD de descomposición de P: si `(x,y)` cae dentro del contenedor, la cosa es `interno`; si es
  proceso, es subproceso: se inserta en la banda `banda.indice` (paralelo) o como banda nueva en esa posición
  (por defecto al final) y luego `distribuir(m, P)`. Fuera del contenedor → `externo`. En OPD de despliegue →
  `interno`. En SD → sin alcance. Nombre ya existente → `NOMBRE_EXISTE` (la UI ofrece `traerCosa`).
- `fijarCosa({tipo})` (T-063): solo si la cosa no tiene estados ni refinamientos y todos sus enlaces siguen
  siendo válidos por la matriz con el tipo nuevo.
- `fijarCosa({afiliacion:'ambiental'})` propaga a los rasgos exhibidos, transitivamente (T-091), con traza;
  `crearEnlace(exhibicion)` desde un exhibidor ambiental vuelve ambiental al rasgo, con traza. El paso a
  `sistemica` no propaga; las incoherencias restantes son advertencias.
- `fijarEstado({porDefecto:true})` quita `default` del otro estado del mismo objeto (≤1); igual `current`.
- `suprimirEnOpd` y `fijarEstado({suprimido})` no afectan a un estado anclado por un enlace visible en ese OPD:
  `estadoVisible(s, O) = anclado(s, O) ∨ ¬(s.suprimido ∨ s ∈ apariencia.estadosSuprimidos)` (DR-15). La UI
  deshabilita la supresión local de un estado anclado.
- `eliminarEstado`: elimina los enlaces anclados a él; rechaza si deja sin estados a un objeto con efecto T3
  (R-EFE-1).
- `quitarDeOpd`: prohibido para la cosa refinada en su OPD de refinamiento y para internos (`ES_INTERNO`); una
  cosa sin apariencias sigue existiendo (advertencia COSA_SIN_APARIENCIA).
- `eliminarCosa`: borra estados, enlaces incidentes (a la cosa o a sus estados), ramas de abanico (disuelve con <2),
  apariencias en todos los OPDs, la quita de `ordenInzoom`. Rechaza si la cosa tiene refinamientos
  (`TIENE_REFINAMIENTO` · «Elimina primero su refinamiento»).
- `mover`: el contenedor arrastra a sus internos; un interno queda confinado al interior del contenedor (R-OPD-UI-3);
  un externo soltado dentro del contenedor vuelve a su posición previa con traza «**X** es externo: moverlo no
  cambia su alcance (R-OPD-REF-5)» (T-081). La Y de un subproceso la fija su banda (§6.7); `mover` solo cambia su X.
- `eliminarEnlace` de una mitad escindida: la otra mitad queda standalone (se quita `efectoEscindido`), traza `info`.
- `crearEnlace` con `abanico`: crea el enlace y lo agrega al abanico de `con` (o forma uno nuevo) de forma atómica;
  es la única manera de tener dos enlaces procedimentales entre el mismo par (DR-6), p. ej. R-FAN-5 por estados.
- `fijarAbanico`: valida n≥2, mismo tipo, extremo común, ningún enlace en otro abanico, tipo con abanico
  admitido, control uniforme y combinación con plantilla (§5.4); `operador:null` disuelve.

### 4.4 Matriz de validez: una codificación, cinco consumidores

`modelo/matriz.ts` contiene la tabla declarativa y las reglas transversales. Es la única fuente para: el menú de
tipos del canvas (`tiposPosibles`), la guarda de `crearEnlace/fijarEnlace/reanclarEnlace/fijarAbanico`, la
aplicación de patches del editor OPL (que llama a esas mismas operaciones), el diagnóstico de modelos importados y
el resaltado de destinos válidos durante el arrastre (T-253).

```ts
type Lado = 'objeto' | 'proceso' | 'mismo' | 'cualquiera';
interface Firma {
  familia: 'transformadora' | 'habilitadora' | 'invocacion' | 'excepcion' | 'estructural' | 'etiquetada';
  origen: Lado; destino: Lado;             // 'mismo' = mismo tipo en ambos extremos
  autoenlace?: true;                       // invocación (IV2), etiquetado (relación unaria)
  entrada?: true; salida?: true;           // admite estadoEntradaId / estadoSalidaId
  control?: true;                          // e/c (Pre(P))
  abanico?: true;
  mult?: { origen?: true; destino?: true };
  ruta?: true; etiqueta?: true; inversa?: true; fisico?: true;
}
export const MATRIZ: Record<TipoEnlace, Firma> = {
  consumo:      { familia: 'transformadora', origen: 'objeto', destino: 'proceso', entrada: true, control: true, abanico: true, mult: { origen: true }, ruta: true },
  resultado:    { familia: 'transformadora', origen: 'proceso', destino: 'objeto', salida: true, abanico: true, mult: { destino: true }, ruta: true },
  efecto:       { familia: 'transformadora', origen: 'proceso', destino: 'objeto', entrada: true, salida: true, control: true, abanico: true, mult: { destino: true } },
  agente:       { familia: 'habilitadora', origen: 'objeto', destino: 'proceso', entrada: true, control: true, abanico: true, mult: { origen: true }, fisico: true },
  instrumento:  { familia: 'habilitadora', origen: 'objeto', destino: 'proceso', entrada: true, control: true, abanico: true, mult: { origen: true } },
  invocacion:   { familia: 'invocacion', origen: 'proceso', destino: 'proceso', autoenlace: true, abanico: true },
  excepcionSobretiempo: { familia: 'excepcion', origen: 'proceso', destino: 'proceso' },
  excepcionSubtiempo:   { familia: 'excepcion', origen: 'proceso', destino: 'proceso' },
  agregacion:   { familia: 'estructural', origen: 'mismo', destino: 'mismo', mult: { destino: true } },
  exhibicion:   { familia: 'estructural', origen: 'cualquiera', destino: 'cualquiera' },
  generalizacion: { familia: 'estructural', origen: 'mismo', destino: 'mismo' },
  clasificacion:  { familia: 'estructural', origen: 'mismo', destino: 'mismo' },
  etiquetado:   { familia: 'etiquetada', origen: 'mismo', destino: 'mismo', autoenlace: true, entrada: true, salida: true, mult: { origen: true, destino: true }, etiqueta: true },
  etiquetadoBidireccional: { familia: 'etiquetada', origen: 'mismo', destino: 'mismo', entrada: true, salida: true, mult: { origen: true, destino: true }, etiqueta: true, inversa: true },
};
```

Reglas transversales (cada una devuelve un `Diagnostico` con regla y acción canónica; en paréntesis el T-ID):

| Código | Regla | Condición de rechazo |
|---|---|---|
| FIRMA | T-042, T-046–T-049 | tipos de cosa de los extremos no calzan con la tabla; autoenlace no admitido |
| ESTADO_EXTREMO | T-041, T-059 | estado en un campo que el tipo no admite; estado que no es del objeto del extremo |
| AP04 | T-043 | `resultado` con `estadoSalidaId` de un estado inicial |
| EFECTO_SIN_ESTADOS | T-044 | efecto a objeto sin estados propios **ni heredados** (DR-43: T3 cuenta estados de generales; TS* exige estados propios) |
| AGENTE_FISICO | T-045 | agente desde objeto informacional (proxy DR-5) |
| CONTROL | T-051, T-052, T-055, AP-08 | `modificador` en tipo sin `control`, en mitad escindida, o en rama de abanico de resultado/invocación |
| MULTIPLICIDAD | T-057, DR-44 | multiplicidad en extremo no admitido o junto a `condicion` |
| RUTA | T-058 | `rutaEtiqueta` fuera de consumo/resultado o fuera del léxico `nombre` |
| ETIQUETA | R-OPL-SE-1 | etiqueta fuera de `frase_no_capitalizada` (error al crear; advertencia al importar) |
| SSE_DESTINO | T-050 | etiquetado bidireccional con estado solo en destino; estados en ambos extremos sin ser recíproco |
| ESTRUCTURAL_ESTADO | matriz §2.1 | estado en agregación/exhibición/generalización/clasificación (especialización de estado no implementada) |
| PAR_UNICO | T-053 | ya existe otro procedimental entre O y P, o entre O y un proceso que contiene a P (contorno de descompuesto), o entre O y un subproceso de P; salvo que ambos sean ramas del mismo abanico |
| CONTORNO | T-060, T-073 | el anclaje directo al contorno nunca persiste: consumo, resultado, evento desde objeto sistémico y TS3 hacia un proceso descompuesto con subprocesos se **reanclan** por `distribuir` en la misma operación (P-18), con traza; en modelos importados, si quedara alguno, es error ENLACE_INVALIDO:CONTORNO |
| AP27 | T-061 | `evento` a un subproceso fuera de la primera banda: error si una banda anterior tiene un transformador sin `condicion`; advertencia si todas son omisibles |
| DOBLE_VARA | T-269 | invocación entre hermanos de bandas adyacentes (i→i+1) |
| VISIBLE | T-066, R-EDIT | algún extremo sin apariencia en `opdId` |
| EXCEPCION_COTA | T-047 | nunca rechaza: advertencia EXCEPCION_SIN_COTA si la fuente no declara `max`/`min` |

`tiposPosibles(m, a, b, opdId)` recorre `TIPOS_ENLACE` en el orden del menú (consumo, resultado, efecto, agente,
instrumento, invocación, excepciones, agregación, exhibición, generalización, clasificación, etiquetado,
bidireccional); para los procedimentales prueba ambas orientaciones (la dirección la fija el tipo); para
estructurales y etiquetados usa la dirección del gesto; devuelve las combinaciones cuyo `validarEnlace` está vacío,
con el estado del extremo si el gesto empezó o terminó en un estado. Si hay un procedimental previo entre el par,
agrega las variantes «en abanico XOR/O con la existente».

### 4.5 Diagnósticos

Un solo tipo (`Diagnostico`), una sola función (`diagnosticar`, barrido sobre el modelo, nunca sobre el OPL,
método A8.2), una sola tabla de reglas `REGLAS: Record<codigo, {regla, severidad, familia, accion}>`. Severidad
≙ método A8.1: `error` = CRÍTICA (bloquea export canónico), `warning` = ALTA/MEDIA, `info` = BAJA (DR-40).

| Código | Regla | Sev. | Familia | Acción canónica |
|---|---|---|---|---|
| NOMBRE_DUPLICADO | T-024, AP-22 | error | identidad | Renombra una de las cosas |
| NOMBRE_FUERA_DE_LEXICO | T-025 | error | gramatical | Renombra con el léxico OPL |
| ESTADO_DUPLICADO / ESTADO_FUERA_DE_LEXICO | T-015, T-025 | error | identidad / gramatical | Renombra el estado |
| ESTADO_EN_PROCESO | AP-12 | error | contencion | Usa subprocesos o un atributo exhibido |
| ENLACE_INVALIDO:<código matriz> | §4.4 | error | gramatical | La de la regla de la matriz |
| ABANICO_INVALIDO | T-054 | error | gramatical | Deshaz el abanico o corrige sus ramas |
| ABANICO_CONTROL | T-056, R-ZNC-COMB-1 | error | gramatical | Control uniforme en todas las ramas o quita el abanico |
| ORDEN_INZOOM_INVALIDO | R-INV-2D | error | contencion | Reordena las bandas |
| DOBLE_VARA | T-269 | error | gramatical | Elimina el rayo: el orden de bandas ya invoca |
| PRECEDENCIA_INVALIDA | AP-30 | error | metodologica | Corrige el nivel hijo (R+R o C+C) |
| PRECEDENCIA_CONFLICTO | R-PREC-3 | warning | metodologica | Revisa: resultado y consumo del mismo objeto |
| REFINAMIENTO_TRIVIAL | T-077, AP-13 | warning (+compuerta) | metodologica | Agrega al menos dos subprocesos o refinadores |
| OPD_DENSO / OPD_EXCEDE_25 | T-265, R-LAY-1 | warning / warning (+compuerta) | metodologica | Refina o divide el OPD |
| PROCESO_SIN_TRANSFORMACION | T-263 | warning | metodologica | Agrega consumo, resultado o efecto (cuentan subprocesos y generales) |
| SUBPROCESO_SIN_TRANSFORMADO | T-264 | warning | metodologica | Idem en el subproceso |
| SD_PROCESO_SISTEMICO | T-090 | warning | metodologica | El SD debe tener exactamente un proceso sistémico |
| AFILIACION_CADENA | T-091 | warning | metodologica | Vuelve ambiental el rasgo |
| PROCESO_AMBIENTAL | R-OBJ-7 | warning | metodologica | Vuelve ambiental el proceso |
| EXCEPCION_MANEJO_SISTEMICO | T-268 | warning | metodologica | Vuelve ambiental el manejador |
| EXCEPCION_SIN_COTA | T-047 | warning | metodologica | Declara duración máx/mín de la fuente |
| REFINADOR_MULTIPLE | T-088 | warning | metodologica | Deja un solo todo por parte |
| COSA_SIN_APARIENCIA | T-262 | warning | contencion | Tráela a un OPD |
| VALOR_SIN_EXHIBIDOR | T-020 | warning | gramatical | El atributo con valor necesita un único exhibidor |
| OBJETO_TRANSIENTE | T-272 | warning | metodologica | Considera una invocación |
| NOMBRE_OBJETO_PLURAL, NOMBRE_PROCESO_NO_DEVERBAL, NOMBRE_PROCESO_LARGO | T-266 | warning | sugerencia | Ajusta el nombre |
| ETIQUETA_NO_MINUSCULA | R-OPL-SE-1 | warning | sugerencia | Escribe la etiqueta en minúscula |
| MEZCLA_INFINITIVO | T-267 | info | sugerencia | Usa una sola forma |
| ESTADO_SIN_ESCRITOR | T-271 | info | metodologica | Agrega el resultado o efecto que lo produce |
| AGENTE_HUMANO | DR-5 | info | metodologica | Confirma que el agente es humano; si no, usa instrumento |
| COLECCION_INCOMPLETA_AUTO | T-087, DR-45 | info | sugerencia | Traza: **X** muestra 2 de 3 partes en SD |
| DESCOMPOSICION_OBJETO | DR-23 | info | sugerencia | Declarada no soportada (registro) |

Compuertas del export canónico (T-283): para el SVG de un OPD, `OPD_EXCEDE_25` de ese OPD,
`REFINAMIENTO_TRIVIAL` de ese OPD o cualquier `error` del modelo; para el documento canónico, cualquiera de las tres
en cualquier OPD. El JSON y el OPL Markdown no tienen compuerta. La edición nunca se
bloquea por diagnóstico. El lienzo no muestra marcas de validación (T-228): los diagnósticos viven en su emergente.

### 4.6 Refinamiento

**4.6.1 Descomponer** (`descomponer(m, P, O)`, T-070): guardas: P es proceso, aparece en O sin ser `externo` de
O (T-079), no tiene descomposición, y ningún OPD ancestro de O (incluido O) refina a P (aciclicidad T-078). Efecto
atómico (una transición, una entrada de deshacer, R-OPD-OP-3): crea el OPD hijo (padre O, `ordenLocal` siguiente);
agrega P como contenedor (sin alcance); agrega como `externo` toda cosa conectada a P por cualquier enlace
(conservan esencia, afiliación, estados; posición por §6.7); `ordenInzoom: []`. No siembra subprocesos (P-6: sin
placeholders, DR-11). La UI navega al hijo y abre la entrada encadenada de subprocesos (§7.7).

**4.6.2 Subprocesos y bandas**: un subproceso es un proceso `interno` del OPD de descomposición; su orden es
`ordenInzoom` (fuente de verdad, T-030). Insertar: banda nueva en `indice` o unión a la banda `indice` (paralelo).
`reordenarSubproceso` mueve entre bandas; las bandas vacías desaparecen; nunca se reordena por geometría. El
primero es el primer elemento de la primera banda; el último, el último de la última.

**4.6.3 Desplegar** (`desplegar(m, X, modo, O)`, T-071): mismas guardas; crea el OPD hijo con X (sin alcance) y
como `externo` los hijos estructurales directos de X en ese modo (destinos de enlaces `modo` desde X); los nuevos
refinadores creados allí son `interno` y nacen con su enlace `modo` desde X (§7.8).

**4.6.4 Distribuir** (`distribuir(m, P)`, T-073–T-076, DR-13/DR-14, idempotente): si P tiene ≥1 subproceso, para
cada enlace cuyo extremo proceso es P:

| Enlace en el contorno | Acción (mismo id, R-OPD-OP-4) |
|---|---|
| consumo | reancla al primero |
| resultado | reancla al último |
| evento (`modificador:'evento'`) desde objeto sistémico | reancla al primero |
| efecto TS3 (entrada y salida, no escindido) | con 1 subproceso: reancla entero al primero; con ≥2: el enlace conserva su id, se queda con la entrada y va al primero (TS4); se crea la mitad de salida (TS5, id nuevo) en el último; ambos con `efectoEscindido {grupoId: id original}` (T-074) |
| efecto TS4 / TS5 standalone | entrada → primero; salida → último (P-5) |
| efecto sin estado, agente, instrumento, invocación, excepción, estructurales | quedan en el contorno (lectura distributiva) |

Se invoca al insertar el primer subproceso, al crear un enlace sobre un proceso descompuesto (P-18) y al importar
(4.19). Reubicaciones posteriores son decisión del modelador (reanclaje, método A3.4).

**4.6.5 Eliminar refinamiento** (T-083, DR-17): solo si el OPD hijo es hoja. Para descomposición: primero
**materializa la vista abstraída** (P-8): cada grupo de enlaces entre internos y externos que `vistaOpd` del padre
funde en uno queda como un único enlace anclado a P (conserva el id del representante; un par escindido se funde de
vuelta en su TS3); si hay PRECEDENCIA_INVALIDA o PRECEDENCIA_CONFLICTO, rechaza («resuelve primero el conflicto en
SD1»). Luego borra los internos que no aparecen fuera del subárbol (con sus estados y enlaces), el OPD y el slot.
Para despliegue: borra los internos (refinadores creados allí) y el OPD. La confirmación lista qué se borra y qué se
conserva.

### 4.7 Proyección por OPD (`vistaOpd`)

```ts
interface EnlaceVisible { enlaceIds: Id[]; representante: Id; tipo: TipoEnlace; origenId: Id; destinoId: Id;
  estadoEntradaId?: Id; estadoSalidaId?: Id; modificador?: 'evento' | 'condicion'; abstraido: boolean }
interface VistaOpd { cosas: Id[]; enlaces: EnlaceVisible[]; abanicos: Id[]; conflictos: Diagnostico[];
  incompletas: Array<{ refinable: Id; relacion: RelacionIncompleta }> }
```

1. **Cosas visibles** = apariencias del OPD. Estados visibles por `estadoVisible`.
2. **Extremos**: para cada enlace, cada extremo E se ve como E si E aparece en el OPD; si no, y E es proceso, como
   su ancestro de descomposición más cercano que aparece (solo el in-zoom abstrae). Un extremo objeto que no aparece
   oculta el enlace; un estructural se ve solo con ambos extremos directos. Si ambos extremos colapsan en la misma
   cosa, el enlace desaparece.
3. **Fusión por fuerza** (T-085): enlaces abstraídos que caen en el mismo par (objeto, proceso) se funden: el
   representante es el de mayor nivel en la tabla de 12 niveles (evento de consumo … condición de instrumento);
   entre transformadores rige la matriz 3×3 (E+E=E, E+R=R, E+C=C, R+C ⇒ se muestran ambos y PRECEDENCIA_CONFLICTO,
   R+R y C+C ⇒ PRECEDENCIA_INVALIDA); transformador prevalece sobre habilitador. Varios efectos: estado de entrada
   del de banda más temprana y de salida del de banda más tardía (el par escindido vuelve a TS3). Invocaciones y
   excepciones abstraídas se deduplican.
4. **OPD hijo** (T-086, R-VIS-HIJO-1 con desvío DR-13): se ven los enlaces que tocan el contenedor/refinado o a un
   interno; se ocultan los que unen solo externos.
5. **Abanicos visibles**: aquellos con todas sus ramas visibles y no fundidas.
6. **Colección incompleta visible** (T-087): (X, rel) es incompleta en el OPD si
   `rel ∈ X.coleccionIncompleta` o si X tiene en el modelo más refinadores de `rel` que los visibles en el OPD
   (en este caso, `info` COLECCION_INCOMPLETA_AUTO como traza).

El export JSON (`opds[].enlaces`), la escena del lienzo, el export SVG y el generador OPL consumen esta misma
función: lo que se ve es lo que se dice (R-BI-DUAL-1). Ley de frontera (T-089, DR-16) en `proyeccion.test.ts`:
para toda descomposición, el multiconjunto `entidad|tipo|rol` de los enlaces del contenedor en el padre es igual al
de los enlaces que tocan contorno o subprocesos en el hijo, abstraídos.

### 4.8 Etiquetas `SDx.y` y árbol

`etiquetaOpd`: raíz `SD`; hijos de la raíz `SD1, SD2…` por `ordenLocal`; nietos `SD1.1…`. Recalculable (T-031),
nunca persistida como identidad (el `nombre` exportado es solo compatibilidad). En OPL, `SDx.y` se resuelve al id
(T-167). Solo OPDs hoja se eliminan, y solo a través de «Eliminar refinamiento» (T-083).

### 4.9 Herencia en validadores (DR-43)

`generales(m, x)`: cierre transitivo de enlaces de generalización hacia arriba (herencia múltiple, T-093). La usan
EFECTO_SIN_ESTADOS (estados heredados cuentan para T3) y PROCESO_SIN_TRANSFORMACION (transformadores de los
generales cuentan). Nada heredado se dibuja ni se emite (T-092).

---

## 5. OPL

### 5.1 Vocabulario cerrado

`opl/plantillas.ts` exporta `VOCABULARIO`, escrito desde CANON.md §4.2 y DR-27 (independiente de las plantillas):
verbos y cópulas (`consume, genera, afecta, cambia … de … a, maneja, requiere, inicia, invoca, ocurre, existe,
se omite, se consume, consta de, exhibe, son, es un/una, es una instancia de, son instancias de, se relaciona con,
se relacionan, puede estar, se descompone en … en esa secuencia, se despliega en, está en, es afectado por,
es manejado por, se invoca a sí mismo, inicia y maneja`), palabras clave (`si, en cuyo caso, de lo contrario, de, a,
y/e, o/u, así como, exactamente uno de, al menos uno de, al menos otra parte/otro rasgo/otra especialización,
un/una opcional, opcional (cero o más), al menos un/una, por ruta, duración de, excede, es menor que,
su duración máxima, su duración mínima, en esa secuencia, paralelo, en cualquier estado, y otros estados, Estado,
es inicial, es final, es por defecto, es inicial y final, es declarado `Current`, es valor, físico/física,
informacional, sistémico/sistémica, ambiental, persistente, transitoria, que, proceso`), palabras de unidad
es-CL (DR-18). Test: toda palabra de toda línea generada, fuera de los spans, pertenece a `VOCABULARIO` (T-104).

### 5.2 Tipos

```ts
interface TokenOpl { texto: string; rol: 'texto' | 'nombre' | 'verbo' | 'estado'; ref?: RefOpl; hechoId?: Id }
interface LineaOpl { texto: string; tokens: TokenOpl[]; refs: RefOpl[]; opdId: Id; profundidad: number;
                     soloDisplay?: true }                  // encabezados y D2 de display
type Cosa = { nombre: string; tipo: TipoCosa; estado?: string; mult?: Multiplicidad; enCualquierEstado?: true };
type Oracion =                                             // hecho parseado, con nombres (no ids)
  | { k: 'esencia'; cosa: Cosa; valor: Esencia } | { k: 'afiliacion'; cosa: Cosa; valor: Afiliacion }
  | { k: 'perseverancia'; cosa: Cosa; valor: 'persistente' | 'transitoria' }
  | { k: 'estados'; objeto: string; estados: string[]; otros: boolean }
  | { k: 'designacion'; objeto: string; estado: string; d: Array<'inicial' | 'final' | 'default' | 'current'> }
  | { k: 'valor'; atributo: string; exhibidor: string; valor: string }
  | { k: 'enlace'; tipo: TipoEnlace; origen: Cosa; destino: Cosa; entrada?: string; salida?: string;
      modificador?: 'evento' | 'condicion'; ruta?: string; etiqueta?: string; inversa?: string }
  | { k: 'abanico'; tipo: TipoEnlace; operador: 'XOR' | 'O'; comun: Cosa; lado: 'origen' | 'destino';
      ramas: Cosa[]; entradaComun?: string; modificador?: 'evento' | 'condicion' }
  | { k: 'estructural'; tipo: 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion';
      vertice: Cosa; refinadores: Cosa[]; incompleta: boolean }        // RF1, RF1i, RF2, RF2b, RF3, RF3b, RF4, RF4b, RH1
  | { k: 'excepcion'; tipo: 'excepcionSobretiempo' | 'excepcionSubtiempo'; manejo: string; fuente: string;
      cota?: { valor: number; unidad: UnidadTiempo } }
  | { k: 'descomposicion'; proceso: string; bandas: string[][]; internos: string[] }
  | { k: 'despliegue'; cosa: Cosa; opd?: string; refinadores: Cosa[] }
  | { k: 'encabezado'; opd: string } | { k: 'vacia' }
  | { k: 'no-soportada' | 'no-canonica' | 'no-reconocida' | 'sin-punto'; motivo: string };
```

### 5.3 La tabla de plantillas (una gramática, dos direcciones)

Cada fila define la forma literal con huecos tipados; el generador la rellena y el parser la reconoce por su
**esqueleto** (la forma con los huecos reducidos a letras). Así la simetría sintáctica es por construcción.

```ts
// Huecos: {P} proceso · {O} objeto (admite frase de multiplicidad antepuesta y « en `s`» pospuesto; `leer`
// rechaza lo que la fila no admite) · {O!} objeto sin multiplicidad ni estado · {S} estado ·
// {LO}/{LP}/{LS} lista con y/e (1..n elementos) · {LOo}/{LPo}/{LSo} lista con o/u · {LO,}/{LS,} lista solo con comas
// (antes de «y al menos otra …» o «, y otros estados») · {D} etiqueta SDx.y · {N} número · {U} unidad es-CL ·
// {E} frase en minúscula · {V} valor (nombre_de_valor)
interface Plantilla {
  id: string; forma: string; emitida: boolean; soportada: boolean;
  leer?: (h: Huecos) => Oracion;             // huecos → hecho (verifica coherencias, p. ej. mismo objeto repetido)
}
// Extracto literal (reglas §4 manda, CANON.md §4.4):
{ id: 'T1',   forma: '{P} consume {O}.' }                                   // TS1 si {O} lleva estado
{ id: 'T2',   forma: '{P} genera {O}.' }                                    // TS2
{ id: 'T3',   forma: '{P} afecta {O}.' }
{ id: 'TS3',  forma: '{P} cambia {O!} de {S} a {S}.' }
{ id: 'TS4',  forma: '{P} cambia {O!} de {S}.' }
{ id: 'TS5',  forma: '{P} cambia {O!} a {S}.' }
{ id: 'H1',   forma: '{O} maneja {P}.' }                                    // HS1
{ id: 'H2',   forma: '{P} requiere {O}.' }                                  // HS2
{ id: 'ET1',  forma: '{O} inicia {P}, que consume {O!}.' }                  // ETS1
{ id: 'ET2',  forma: '{O} inicia {P}, que afecta {O!}.' }                   // primer {O}: multiplicidad sí, estado no
{ id: 'ETS2', forma: '{O} inicia {P}, que cambia {O!} de {S} a {S}.' }
{ id: 'ETS3', forma: '{O} inicia {P}, que cambia {O!} de {S}.' }
{ id: 'ETS4', forma: '{O!} en cualquier estado inicia {P}, que cambia {O!} a {S}.' }
{ id: 'EH1',  forma: '{O} inicia y maneja {P}.' }                           // EHS1
{ id: 'EH2',  forma: '{O} inicia {P}, que requiere {O}.' }                  // EHS2
{ id: 'CT1',  forma: '{P} ocurre si {O!} existe, en cuyo caso {O!} se consume, de lo contrario {P} se omite.' }
{ id: 'CS1',  forma: '{P} ocurre si {O!} está en {S}, en cuyo caso {O!} se consume, de lo contrario {P} se omite.' }
{ id: 'CT2',  forma: '{P} ocurre si {O!} existe, en cuyo caso {P} afecta {O!}, de lo contrario {P} se omite.' }
{ id: 'CS2',  forma: '{P} ocurre si {O!} está en {S}, en cuyo caso {P} cambia {O!} de {S} a {S}, de lo contrario {P} se omite.' }
{ id: 'CS3',  forma: '{P} ocurre si {O!} está en {S}, en cuyo caso {P} cambia {O!} de {S}, de lo contrario {P} se omite.' }
{ id: 'CS4',  forma: '{P} ocurre si {O!} existe, en cuyo caso {P} cambia {O!} a {S}, de lo contrario {P} se omite.' }
{ id: 'CH1',  forma: '{O!} maneja {P} si {O!} existe, de lo contrario {P} se omite.' }
{ id: 'CS5',  forma: '{O!} maneja {P} si {O!} está en {S}, de lo contrario {P} se omite.' }
{ id: 'CH2',  forma: '{P} ocurre si {O!} existe, de lo contrario {P} se omite.' }
{ id: 'CS6',  forma: '{P} ocurre si {O!} está en {S}, de lo contrario {P} se omite.' }
{ id: 'COND-ALT', forma: 'Si {O!} existe entonces {P} ocurre y consume {O!}, de lo contrario se omite {P}.', emitida: false }
{ id: 'EX1',  forma: '{P} ocurre si duración de {P} excede {N} {U}.' }
{ id: 'EX1R', forma: '{P} ocurre si duración de {P} excede su duración máxima.' }
{ id: 'EX2',  forma: '{P} ocurre si duración de {P} es menor que {N} {U}.' }
{ id: 'EX2R', forma: '{P} ocurre si duración de {P} es menor que su duración mínima.' }
{ id: 'IV1',  forma: '{P} invoca {P}.' }   { id: 'IV2', forma: '{P} se invoca a sí mismo.' }
{ id: 'SE1',  forma: '{O} {E} {O}.' }      { id: 'SE2', forma: '{O} se relaciona con {O}.' }        // y variantes {P}
// SE3 (bidireccional) = dos líneas consecutivas con forma SE1 invertida: «**A** f **B**.» y «**B** b **A**.» (P-21)
{ id: 'SE4',  forma: '{O} y {O} son {E}.' } { id: 'SE5', forma: '{O} y {O} se relacionan.' }        // SSE6/SSE7 vía estados
{ id: 'RF1',  forma: '{O!} consta de {LO}.' }  { id: 'RF1i', forma: '{O!} consta de {LO,} y al menos otra parte.' }
{ id: 'RF2',  forma: '{O!} exhibe {LO}.' }     { id: 'RF2b', forma: '{O!} exhibe {LO} así como {LP}.' }
{ id: 'RF3',  forma: '{LO} son {O!}.' }        { id: 'RF3i', forma: '{LO,} y al menos otra especialización son {O!}.' }
{ id: 'RF3b', forma: '{O!} es un {O!}.' }      { id: 'RH1',  forma: '{O!} es un {O!} y un {O!}.' }
{ id: 'RF4',  forma: '{O!} es una instancia de {O!}.' }  { id: 'RF4b', forma: '{LO} son instancias de {O!}.' }
{ id: 'D1',   forma: '{O!} es física.' } … D2 D3 D4 D11 D12 (D11/D12 emitida:false)
{ id: 'D5',   forma: '{O!} puede estar {LSo}.' }  { id: 'D6', forma: '{O!} puede estar {LS,}, y otros estados.' }
{ id: 'D7',   forma: 'Estado {S} de {O!} es inicial.' } … D8 D9 D10 ('es inicial y final') D13 ('es declarado `Current`')
{ id: 'VAL',  forma: '{O!} de {O!} es {V}.' }
{ id: 'ENT3', forma: '{O!} es un objeto físico y ambiental.' … (R-ENT-3 combinada, emitida:false) }
{ id: 'FAN-CONS-CONV-XOR', forma: '{P} consume exactamente uno de {LOo}.' }
{ id: 'FAN-CONS-DIV-XOR',  forma: 'Exactamente uno de {LPo} consume {O}.' }
… las 24 de reglas §7.3 (consumo, resultado, efecto objetos/procesos, agente, instrumento, invocación × conv/div × XOR/OR)
{ id: 'FAN5-SAL', forma: '{P} cambia {O!} a exactamente uno de {LSo}.' }    { id: 'FAN5-ENT', forma: '{P} cambia {O!} de exactamente uno de {LSo}.' }
{ id: 'FAN5A',    forma: '{P} cambia {O!} de {S} a exactamente uno de {LSo}.' }    // y 'a al menos uno de'
{ id: 'FANC18',   forma: '{P} ocurre si exactamente uno de {LOo} existe, en cuyo caso {P} consume exactamente uno de {LOo}, de lo contrario {P} se omite.' }
{ id: 'FANC74',   forma: 'Exactamente uno de {LPo} ocurre si {O!} existe, en cuyo caso afecta {O!}, de lo contrario se omite.' }
{ id: 'FANE4',    forma: '{O!} inicia exactamente uno de {LPo}, y es afectado por el proceso que ocurre.' }
{ id: 'CX1',  forma: '{P} se descompone en {LP}, en esa secuencia.' }       // lista de secuencia mixta (5.5)
{ id: 'CX2',  forma: '{P} se descompone en paralelo {LP}.' }
{ id: 'CX3',  forma: '{O!} se despliega en {D} en {LO}.' }                  // y variante {P}
{ id: 'CX3-sin', forma: '{O!} se despliega en {LO}.', emitida: false }
{ id: 'CXN',  forma: '{P} desde {D} se descompone en {D} en {LP}, en esa secuencia.', emitida: false }
```

Prefijo de ruta (T-129): `Por ruta {E}, ` se extrae antes del esqueleto y se antepone a la oración completa,
incluida su variante E*/C* (R-COMB-4). Multiplicidad (T-128): las frases `al menos un/una`, `un/una opcional`,
`opcional (cero o más)` inmediatamente antes de un `{O}` son parte del hueco.

Filas `soportada:false` (→ `unsupported-canonical`, warning, sin mutar, T-156): RX1/RX2 (`puede ser`
entre cosas), especialización de estado, descomposición de objeto, `se pliega en`, `se recompone desde`,
`se refina por`, `es de tipo`, `varía de … a`, `después de`, `Pr=`, plurales concordados (`consumen`, `generan`,
`afectan`, `requieren`, `manejan`), listas AND tras verbo procedimental (oración compuesta ext §9), `tiene … opcional`,
`[etiqueta: …]`, excepción combinada, abanico×control sin plantilla (C-19b, C-18 instrumento, agente), negadas
(`no maneja`, `no requiere`, `no consume`, `no genera`, `no afecta`, `no cambia`), ruta sobre habilitadores (C-25),
multiplicidad fuera de `? * +`. Filas `non-canonical` (error, T-157): `**O** puede estar` con `puede ser`
(R-VERB-EST-2), abanico con control mixto, condición con estado sobre efecto sin cambio (DR-29), D11/D12
incoherentes (DR-3).

### 5.4 Generador (`generarOpl(m, opciones) → LineaOpl[]`)

Por cada OPD en preorden (T-100), a partir de `vistaOpd` (así el padre muestra lo refinado plegado, T-085,
R-OPL-DISP-3):

1. **Encabezado** (solo display): `SD1 · descomposición de *P*` (profundidad = sangría, T-241).
2. **Refinamiento** si el OPD es hijo: CX1/CX2/mixta con ≥2 subprocesos (T-125); CX3 con ≥2 refinadores (T-126);
   nunca con <2 (T-127). Descomposición de objeto: nada (DR-23).
3. **Cosas visibles, por nombre** (colación es-CL; P-2): D1 si física, D3 si ambiental; D5/D6 con estados visibles
   en su orden (D6 si hay ocultos, T-101); D10 o D7/D8, D9, D13 por estado visible designado; VAL si hay
   `valorSlot` y un único exhibidor visible. **Existencia** (P-3): si al final del bloque una cosa visible no
   quedó mencionada en ninguna línea, se emite su D2 (`**X** es informacional.` / `*X* es informacional.`).
4. **Procedimentales**, agrupados por proceso (por nombre) y en orden de fuerza: consumo, resultado, efecto, agente,
   instrumento; luego invocación y excepción; dentro, por nombre del objeto. Un enlace con control emite su E*/C*
   en vez de la base (T-112). Un abanico visible emite una sola oración (§5.3) salvo que alguna rama tenga ruta
   (R-COMB-5: una por enlace). Abanicos por estados de un objeto → FAN5/FAN5A; si varían entrada y salida a la vez,
   se emiten TS3 individuales y el diagnóstico ABANICO_INVALIDO (falla cerrada, nunca lanza).
5. **Estructurales**: en OPD no hijo, agrupados por vértice y relación (T-131): RF1/RF1i, RF2/RF2b, RF3/RF3i/RF3b
   agrupados por general, RF4/RF4b por clase; RH1 para especializaciones con ≥2 generales; listas por nombre. En
   OPD hijo, una oración por enlace (T-132). Luego etiquetados (SE1/SE2, SE3; bidireccional con etiquetas iguales o
   sin inversa ⇒ SE4/SE5, P-1).
6. **Vista previa**: `oracionHipotetica(m, enlace, opdId)` genera la oración de un enlace aún no creado con la misma
   tabla (menú de tipo, T-040 y bimodalidad activa), sin mutar el modelo.
7. **Tokens**: cada hueco rellenado es un token `nombre`/`estado` con `ref`; el verbo es token `verbo` con
   `ref: enlace` y `hechoId`; cada rama de abanico y cada elemento de lista estructural lleva su `hechoId` (T-135,
   T-245). `refs` únicas en orden de primera aparición.

Superficie (T-102–T-116): Markdown `**objeto**`, `*proceso*`, `` `estado` ``; una oración por línea con punto;
listas con coma y `y/o` finales, sin coma de Oxford, `e` ante /i/ (`i-`, `hi-`+consonante) y `u` ante /o/
(`o-`, `ho-`) (DR-26); género por `genero` (`un/una`, `al menos una`); unidades es-CL con singular para 1;
números con punto decimal (EBNF).

Display (nunca altera el texto canónico ni los hechos, T-139, R-OPL-CFG-2): `esencia: 'siempre'` (default) agrega
líneas D2 `soloDisplay` para toda cosa informacional; `'solo-difiere'` = canónico; `'oculta'` quita D1/D2.
Numeración por bloque (T-246). El texto canónico (el que se exporta y el que carga el editor) es el de
`'solo-difiere'` con encabezados en forma `## SD1 · descomposición de *P*`.

### 5.5 Parser (`parsearLinea(texto) → Oracion`)

1. **Normalizar** (T-152): NFC, espacios no separables a espacio, colapsar espacios, `trim`; conservar tildes, `ñ`,
   `ü`. Vacía → `vacia`. `^## ` → `encabezado` (solo contexto, T-185). Sin punto final → `sin-punto`.
2. **Tokenizar** spans `**…**` (objeto), `*…*` (proceso; sufijo ` proceso` aceptado dentro o fuera, R-OPL-9),
   `` `…` `` (estado); el resto es texto literal; `SD(\d+(\.\d+)*)?` → `{D}`; `<número> <unidad es-CL>` tras
   `excede`/`es menor que` → `{N} {U}`; prefijo `Por ruta …, ` → atributo `ruta`.
3. **Plegar** `{O} en {S}` (texto exactamente ` en `) en un `{O}` con estado; `{O} en cualquier estado` →
   `enCualquierEstado`; frases de multiplicidad antes de `{O}` → `mult`.
4. **Listas**: secuencias `H(, H)* (y|e|o|u) H` del mismo tipo → `{LX}` (y/e) o `{LXo}` (o/u); terminadores
   `y al menos otra …` y `, y otros estados` según la fila. Descomposición: tokenizador de secuencia mixta con
   grupos `paralelo … y …` separados por `, ` y final `, y`/` y` (porte de `parsearBandasOrden` v0).
5. **Esqueleto** (texto con huecos como letras, primera letra del texto en minúscula) → `Map<esqueleto,
   Plantilla[]>`; la plantilla `leer` valida coherencias (el mismo objeto en ET1, el mismo proceso omitido en C*).
6. Sin coincidencia: si calza con un patrón `soportada:false` → `no-soportada`; `non-canonical` → `no-canonica`;
   si es `{O} <frase en minúscula> {O}.` (o con `{P}`) sin otro esqueleto → SE1 (DR-36); si no → `no-reconocida`.

### 5.6 Editor: resolución, patches y aplicación

`clasificar(m, texto, opdActivo) → { lineas: EstadoLinea[]; resumen; plan: Patch[] }` es puro (preview, T-173).

- **Contexto de bloque**: cada línea pertenece al OPD del último encabezado (`## SDx…`) o al OPD activo.
- **Resolución** por clave de nombre en todo el modelo (nombres únicos, DR-22): existe → se usa; no existe → patch
  `crear-entidad` con el tipo de la tipografía (T-153); existe con otro tipo → error `enlace-invalido-firma`
  (R-IMPORT-7, T-158). La edición libre **nunca renombra** (P-16): renombrar es solo en línea (T-183).
- **Etiquetados en par** (P-21): dos líneas consecutivas del mismo bloque con forma SE1 e inversas
  (`**A** f **B**.` / `**B** b **A**.`) se leen como un bidireccional (SE3), inversa exacta del generador; una línea
  SE1 aislada es unidireccional. Para comparar con el modelo, un bidireccional equivale a sus dos hechos
  direccionales, así ambas representaciones dan `sin-cambio`.
- **Identidad del hecho** (P-17): enlaces por `(tipo, origen, destino)` y, en etiquetados, también `etiqueta`. Una
  oración se compara contra los **hechos proyectados** del OPD de su bloque (`vistaOpd`): si coincide → `sin-cambio`
  (incluidas las líneas abstraídas del padre, T-168); si coincide la identidad y difieren atributos de superficie
  (control, estados, multiplicidad, ruta) → `crear-enlace` como actualización del representante (la oración describe
  el hecho completo); si no existe → `crear-enlace`.
- **Patches**: `crear-entidad`, `traer` (la cosa existe pero no aparece en el OPD del bloque), `cambiar-esencia`,
  `cambiar-afiliacion`, `sincronizar-estados` (crea faltantes; si la lista es una permutación de los visibles,
  reordena), `designar`, `fijar-valor`, `crear-refinamiento` (+ subprocesos inexistentes creados en el hijo, DR-35;
  miembro existente ajeno ⇒ `referencia-ambigua`), `fijar-orden`, `fijar-duracion` (EX con cota), `crear-enlace`
  (idempotente, T-182), `crear-abanico`. Cada patch lleva `linea`.
- **Conflictos** (T-178): dos patches que fijan valores distintos para la misma clave de hecho → ambas líneas
  `no-aplicable` con `conflicto-patches`.
- **Fases** (T-181, P-4): (1) no-enlace en preorden de bloques: entidades, esencia/afiliación, estados, designaciones,
  valores, refinamientos y orden, `traer`; (2) enlaces en **preorden inverso** (hijos antes que padres) —así una
  línea abstraída del padre encuentra el hecho ya creado en el hijo—, re-proyectando tras cada patch; (3) abanicos.
- **Aplicación todo-o-nada** (T-180, DR-39): `aplicarPlan(m, plan)` ejecuta las operaciones del núcleo sobre la
  copia; ante el primer rechazo aborta y devuelve el diagnóstico con su línea; el modelo no cambia. Una aplicación
  exitosa es una sola entrada de deshacer.

Estados de línea (T-174, precedencia vacía → aplicable → error → sin-cambio) y razones cerradas (T-176):

| Estado | Condición | Presentación |
|---|---|---|
| `ignorada-vacia` | vacía | no se lista |
| `aplicable` | ≥1 patch | «+ crear objeto **Orden**», «~ control evento en *P* consume **A**» |
| `no-aplicable` | error | razón del enum: `forma-no-reconocida` (incluye `non-canonical`), `entidad-no-existe`, `referencia-ambigua`, `enlace-invalido-firma`, `conflicto-patches`, `puntuacion-faltante` |
| `sin-cambio` | sin patch y sin error | incluye warnings: `inversa-no-soportada` («Edición inversa no soportada», `unsupported-canonical`) y la nota `no-delete-by-absence` |

Resumen (T-175): `total · aplicables · noAplicables · ignoradas · sinCambio`; botón `Aplicar N cambio(s)` o
`Sin cambios aplicables`. Nota informativa si faltan líneas del texto canónico: «Las líneas ausentes no borran
hechos (R-§19-LENS-1)» (T-172). El borrado solo existe en lienzo e inspector.

### 5.7 Garantías de roundtrip

- **Por construcción**: generador y parser usan la misma tabla; test exhaustivo `leer(escribir(h)) = h` por cada
  plantilla emitida con casos sintéticos (con y sin estado, multiplicidad, ruta, género, listas de 1, 2 y 3 con
  vocal inicial `i`/`hi`/`o`/`ho` para `e`/`u`).
- **R-§19-SIM-1** (T-191): para cada modelo válido del corpus de pruebas y los 6 demo, `clasificar(m, generar(m))`
  no tiene líneas `no-aplicable` y su plan es **vacío** (auto-reparseo sin patches).
- **R-§19-SIM-3** (T-192): fixture estricto `generar(m) === generar(aplicarPlan(vacio, clasificar(vacio,
  generar(m)).plan))` línea a línea, para: una fixture por fila de la tabla 9.2, una por plantilla emitida
  (≈90), escisión, abanicos, descomposición mixta y despliegue, y los demo válidos. Lo hacen posible P-2 (orden por
  nombre), P-3 (existencia explícita), P-4 (enlaces hijos antes que padres) y el encabezado `## SDx` (el padre de un
  OPD nuevo es el de su etiqueta sin el último segmento).
- **Bisimetrías parciales declaradas** (T-193, no estrictas): procedencia de escisión (el parser produce standalone,
  DR-7), borrado, layout y tamaños, alcance interno/externo, estados ocultos en todos los OPDs, abanico con ruta,
  abanico con control sin plantilla.

---

## 6. OPD

### 6.1 Escena (pura, `opd/escena.ts`)

```ts
interface NodoCosa { entidadId: Id; tipo: TipoCosa; x: number; y: number; w: number; h: number;
  fisica: boolean; ambiental: boolean; refinada: boolean; contenedor: boolean;
  rotulo: string[]; rotuloY: number; duracion?: string; estados: NodoEstado[];
  ocultos: number; instancia?: string }
interface NodoEstado { estadoId: Id; x: number; y: number; w: number; h: number; nombre: string;
  inicial: boolean; final: boolean; porDefecto: boolean; current: boolean }
interface Arista { enlaceIds: Id[]; tipo: TipoEnlace; puntos: Punto[]; segmentos?: Punto[][];  // TS3: 2 tramos
  marcas: Array<{ forma: 'punta' | 'piruletaNegra' | 'piruletaBlanca' | 'abierta' | 'arpon' | 'sobre' | 'sub';
                  en: Punto; angulo: number }>;
  control?: { letra: 'e' | 'c'; en: Punto }; etiquetas: Array<{ texto: string; en: Punto; cursiva: boolean }>;
  rayo?: true }
interface Triangulo { refinable: Id; tipo: 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion';
  vertice: Punto; invertido: boolean; incompleta: boolean; tronco: Punto[]; ramas: Punto[][]; mult: Etiqueta[] }
interface Arco { abanicoId: Id; centro: Punto; radio: number; desde: number; hasta: number; doble: boolean }
interface Escena { opdId: Id; cosas: NodoCosa[]; aristas: Arista[]; triangulos: Triangulo[]; arcos: Arco[];
  bbox: Rect }
```

### 6.2 Componentes SVG (`opd/svg.ts`, cadena)

`svg(escena, { interactivo }): string` produce el SVG completo. Con `interactivo: true` agrega a cada pieza
`data-ref="entidad:o-3"`, `"estado:s-4"`, `"enlace:e-7"` y un trazo transparente de 15 px como zona de acierto de
enlaces; con `false` (export) no agrega nada de eso. Las piezas son funciones de cadena: `cosa`, `estado`, `arista`,
`marca`, `triangulo`, `arco`, `etiqueta`. Los marcadores se dibujan como `<path>` transformados (no `<marker>`) para
que el export sea idéntico en cualquier visor. El lienzo inserta la cadena en un `<g>` con `dangerouslySetInnerHTML`
(el HTML parser crea elementos SVG por el contexto) y dibuja encima y debajo la **capa UI** con Preact (§6.8). Así
el SVG del lienzo y del export son la misma función (R-OPD-CAN-1, sin post-pasadas) y se prueba en Bun sin DOM.

### 6.3 Geometría (`opd/geometria.ts`)

- **Recorte exacto** (R-OPD-LAY-5, T-224): el segmento centro-a-centro se recorta en el perímetro real: elipse
  por solución de la cuadrática de la recta con `(x/a)²+(y/b)²=1`; rectángulo por intersección con los 4 lados;
  rountangle de estado por los lados y, si el punto cae en una esquina, por el arco de radio 8. Nunca extremos
  sueltos.
- **Procedimentales rectos** (T-225). TS3 se dibuja como dos tramos: estado de entrada → proceso (punta en el
  proceso) y proceso → estado de salida (punta en el estado); TS4 solo el primero; TS5 solo el segundo; T3 un tramo
  con punta en ambos extremos; consumo con estado: desde el estado.
- **Estructurales ortogonales con triángulo** (peine): vértice del triángulo a 40 px bajo el refinable, en su X;
  tronco vertical refinable→vértice; bus horizontal 20 px bajo la base que abarca las X de los refinadores;
  bajadas verticales a cada refinador (centro superior). Si la media de los refinadores está sobre el refinable,
  el triángulo se invierte y el peine sube. Un triángulo por (refinable, relación) en el OPD; si un refinable tiene
  varias relaciones, triángulos desplazados 50 px en X. Barra corta bajo la base si la colección es incompleta
  (T-217). Multiplicidad junto a la bajada de cada parte.
- **Rayo de invocación** (T-211): 4 vértices con offset perpendicular `min(22, max(12, len·0.08))`, punta
  transformadora en el invocado; es decoración derivada sobre el segmento (no hay vértices editables).
  **Autoinvocación**: lazo bajo el proceso a ±35°, pico `max(56, h·0.55)`, marca solo en el retorno.
- **Excepción**: recta con `/` (sobretiempo) o `//` (subtiempo) cerca del manejador, sin punta (DR-38).
- **Abanicos** (T-216): todas las ramas de un abanico salen del mismo punto del perímetro de la cosa común (la
  intersección de la recta hacia el centroide de los otros extremos); arco de radio 30 centrado allí que abarca los
  ángulos de las ramas por el mayor hueco angular (porte de `calcularGeometriaAbanicoDesdePuntos` v0); OR = arcos
  concéntricos r30 y r35; trazo 1.5, dash `4 1`.
- **Estados dentro del objeto** (T-206, P-13): fila inferior de rountangles, ancho por texto (mín. 52×24, +6 px
  si llevan designación), separación 8, salto de fila si exceden el ancho; el objeto crece para contenerlos.
  Inicial: trazo 3; final: doble contorno (relleno `estadoFinalFill` + rect interno a 3 px, trazo 1); por
  defecto: flecha diagonal abierta **entrante** desde arriba-izquierda (DR-37); `Current`: pin externo reservado
  (gota de 8×11 sobre la esquina superior derecha) (T-207). Chip `⋯N` en la esquina inferior derecha del objeto
  (T-208).
- **Marcas textuales** (T-214, T-223): `e`/`c` minúscula sobre la línea a 22 px del extremo proceso; etiquetas de
  etiquetado en itálica al centro (bidireccional: la f cerca del destino, la b cerca del origen); ruta a 1/3 desde
  el objeto (T-219); multiplicidad junto al extremo, desplazada 10 px en perpendicular (T-218).
- **Duración** (T-220): segunda línea dentro de la elipse `[min] {1, 2, 5}` con `–` para valores faltantes; sin
  duración no se dibuja nada.
- **Rótulos** (T-204): serif 17 (proceso itálica), ajuste de línea a ~132 px si el nombre supera 18 caracteres,
  sin elipsis; el tamaño de la forma es `max(tamaño persistido, contenido)`; en la elipse el rectángulo de texto se
  inscribe (semiejes = medio contenido × √2 + 8). Métrica determinista por clases de carácter con +10 % de margen
  (`opd/texto.ts`): la forma siempre contiene el texto real porque el export incrusta la fuente.
- **Instancia** (T-222): rótulo `Nombre : Clase` si la cosa es destino de exactamente una clasificación.
- **Contenedor in-zoom** (T-221): elipse agrandada con el rótulo arriba; contiene el rectángulo de bandas + internos
  con padding sup. 100, inf. 65; contorno grueso (trazo 4) en padre e hijo para toda cosa refinada (T-202).

### 6.4 Marcadores (paths literales, spec-OPD §18.3)

| Marcador | Path | Relleno |
|---|---|---|
| Punta transformadora (consumo/resultado/efecto; fin del rayo) | `M 0 0 L 23 8 L 12 0 L 23 -8 Z` | paper, trazo ink |
| Piruleta agente / instrumento | `M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0` | ink / paper |
| Triángulo | polígono `15,0 30,30 0,30` | agregación ink; generalización paper; exhibición paper + triángulo interior `15,12 21,24 9,24` ink; clasificación paper + círculo r4 en (15,20) ink |
| Etiquetado uni / bi | polilínea `0,0 20,-10 0,0 20,10` / arpón `0.5,0 20,±10` | abierto |
| Sobretiempo / subtiempo | polilínea `4,10 13,-10` / `4,10 13,-10 8.5,0 17,0 13,10 22,-10` | trazo ink |

Test de topología (T-212, T-304): cada tipo produce exactamente su marcador (conteo de arcos, relleno lleno/vacío,
interior triangular/circular, punta cerrada vs abierta vs arpón, dash vs continuo, doble borde, trazo grueso).

### 6.5 Tokens visuales (spec-OPD §18.1–§18.2, informativos; la estructura es normativa)

`--paper #fafaf8`, `--paperWarm #eeece2` (resaltado bimodal), `--ink #171511`, `--inkMid #5a564c`,
`--inkSoft #807b6e`, `--objeto #27613f`, `--proceso #1d3f78`, `--estado #68711f`, `--estadoFill #dedacb`,
`--estadoFinalFill #d6d2c6`, `--crimson #8e2a2e` (solo canal UI). Trazos: cosa 1.5, estado 1.2, enlace 1,
estructural 1.2, estado inicial 3, refinada 4. Ambiental: dash `8 4`. Sombra física: `feDropShadow dx6 dy6
stdDeviation2 rgba(23,21,17,0.68)`, solo si física (T-201). Rótulos en `--ink` (negro canónico, T-203). La
semántica no depende del color (T-203): se prueba renderizando en escala de grises.

### 6.6 Z-order

contenedores → aristas de cosa a cosa → arcos → cosas → estados → triángulos y peines → aristas ancladas a estado →
etiquetas; la capa UI queda en dos grupos: `ui-fondo` (debajo de la semántica: resaltado bimodal) y `ui-frente`
(encima: selección, asas, guías).

### 6.7 Layout (`opd/layout.ts`)

- **Colocación libre**: búsqueda en espiral (paso 20 px) desde el punto pedido hasta no solapar bboxes.
- **Externos al descomponer** (T-070): columna izquierda (consumidos, agentes, instrumentos, disparadores),
  columna derecha (resultados), fila superior (efectos, estructurales y el resto); 20 px de separación; el
  contenedor se centra donde estaba P.
- **Bandas**: banda i en `y = contenedor.y + 100 + Σ(alto de bandas previas + 30)`; dentro de la banda, X
  persistida (sin solapes) o centrada si es nueva; el contenedor crece para contener todo (R-ANID-1). Arrastrar un
  subproceso: al soltar, si la Y cae en la franja de una banda → se une (paralelo); entre franjas → banda nueva
  ahí; `reordenarSubproceso` lo registra (T-082, R-LAY-4). Ningún otro layout toca bandas.
- **Despliegue**: X arriba al centro; refinadores en fila 150 px debajo (T-226).
- **Cosas creadas por OPL**: objeto 120 px sobre su primer proceso relacionado; resultado a la derecha; parte bajo su
  todo; si no hay relación, colocación libre en el centro del bbox del OPD.
- **Cámara**: al entrar a un OPD se centra el bbox real del contenido a zoom 1 (o encuadrado si no cabe) (T-231); ni
  renombrar, ni refinar, ni crear, ni aplicar OPL mueven la cámara (dolor «foco estable»).

### 6.8 Capa UI (canal reservado, T-227)

Crimson y grises exclusivamente: contorno de selección desplazado 4 px (no redibuja el borde semántico,
R-OPD-UI-2); asa cuadrada 7×7 de «enlazar» en el lado derecho de la cosa bajo el puntero (no es piruleta); asa
cuadrada de redimensión en la esquina inferior derecha de la cosa seleccionada; asas cuadradas en los extremos del
enlace seleccionado (reanclaje, T-250); línea discontinua durante el arrastre de enlace; halos discontinuos en
destinos válidos y atenuación gris de los inválidos (T-253), cursor `not-allowed` sobre inválidos (T-322); botón
«⤵» junto a cosas refinadas (abrir refinamiento); guías de banda al arrastrar subprocesos; relleno `paperWarm` bajo
elementos resaltados desde el OPL (R-OPD-INT-3).

### 6.9 Export (`opd/exportar.ts`)

- **canon-diagrama** (T-280): `svg(escena, {interactivo:false})` con `viewBox` = bbox de todo (formas, sombras
  +6 px, marcas, rótulos, arcos) + 16 px; fondo `paper`; `<title>` y `<metadata>` con `perfil="canon-diagrama"`,
  modelo, etiqueta del OPD y build; fuente Inria Serif (normal e itálica) incrustada en `<style>` como woff2 base64
  (R-ROT: sin recortes en cualquier visor). Sin grid, asas, halos, validación ni UI (por construcción).
- **canon-documento** (T-281): un HTML autocontenido: título, árbol de OPDs, y por OPD en preorden su SVG y su
  párrafo OPL (negrita/cursiva/monoespaciado); fuente incrustada una vez.
- **OPL Markdown** (T-282): `# Nombre` y bloques `## SDx · …` con el texto canónico; re-pegable en el editor.
- **JSON** (T-286): los bytes exactos que guarda el servidor.
- **Compuertas** (T-283): `compuertasExport`; el menú muestra la primera razón y deshabilita el ítem.
- **Advertencias** (T-284): cruces propios entre segmentos de aristas y oclusiones (cosas que se solapan; segmento
  que atraviesa el interior de una cosa que no es su extremo); se muestran en el menú («⚠ 3 cruces, 1 oclusión»)
  sin bloquear.

---

## 7. Experiencia de usuario

### 7.1 Pantallas

```
INGRESO                                  BIBLIOTECA
┌──────────────────────────┐   ┌───────────────────────────────────────────────────────────┐
│         opforja          │   │ opforja                                            Salir   │
│  Clave [•••••••••]       │   │ [Buscar modelo…          ]   [+ Nuevo modelo] [Importar…]  │
│        [Entrar]          │   │ ┌ Importación: SD_Sync.json ─ 4 normalizaciones,         ┐ │
│  Clave incorrecta        │   │ │ 2 campos no representados [Ver detalle] [Importar] [×] │ │
└──────────────────────────┘   │ Sistema HODOM                    hoy 12:04        [🗑]   │
                               │ OnStar System                    ayer 18:30        [🗑]   │
                               │ ▸ Papelera (3)                                   v.1a2b3c │
                               └───────────────────────────────────────────────────────────┘
```

### 7.2 Editor, escritorio (≥ 1100 px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ ‹ Modelos │ Sistema HODOM │ SD › SD1 Atender ▾ │ ⛔ 2  ⚠ 5 │ ✓ Guardado │ ↶ ↷ │ Exportar ▾ │
├───────────────────────────────────────────────────────────────┬──────────────────────────────┤
│                                                               │ PROPIEDADES                  │
│          ╭──────────── Atender ────────────╮                  │ ⬭ Registrar  (proceso)       │
│  ┌──────┐│     ( Recibir )                 │  ┌────────┐      │ Nombre [Registrar        ]   │
│  │Pacien││   ( Evaluar ) ( Registrar )     │─▶│Informe │      │ [ ] Física  [ ] Ambiental    │
│  └──────┘│     ( Derivar )                 │  └────────┘      │ Duración mín[ ] esp[ ] máx[ ]│
│          ╰─────────────────────────────────╯                  │ [Descomponer] [Desplegar…]   │
│                                                               │ [Quitar de SD1] [Eliminar…]  │
│                                                               ├──────────────────────────────┤
│                                                               │ OPL      [Editar] # ⌖ Esencia│
│ [▭ Objeto] [⬭ Proceso]                        [−] 100% [+] [⤢] │ SD                           │
│ ◦ Consumo anclado a *Recibir* (primer subproceso)             │  *Atender* consume **Pac…**  │
└───────────────────────────────────────────────────────────────┴──────────────────────────────┘
```

Columna derecha de 380 px (ajustable por un divisor, ancho recordado en `localStorage`): Propiedades arriba (alto
automático, máx. 50 %) y OPL abajo; el OPL se puede plegar a un riel (T-247; plegado no se renderiza).

### 7.3 Editor, ancho estrecho (< 1100 px)

```
┌─────────────────────────────────────────┐
│ ‹ │ Sistema HODOM │ SD1 ▾ │ ⛔2 │ ✓ │ ⋯ │   (⋯ agrupa deshacer, rehacer, exportar)
├─────────────────────────────────────────┤
│               LIENZO (60 %)              │
│ [▭] [⬭]                        [−][+][⤢] │
├─────────────────────────────────────────┤
│ [ OPL ] [ Propiedades ]                  │   (segmentado; los emergentes se abren como hoja inferior)
│  …                                       │
└─────────────────────────────────────────┘
```

### 7.4 Ingreso, biblioteca y salida

1. Abrir la URL → `GET /api/sesion`; 401 → pantalla de ingreso (campo de clave; `username` oculto `opforja` para
   gestores de contraseñas). Enviar → `POST /api/sesion`; error «Clave incorrecta»; tras 5 fallos «Demasiados
   intentos; espera un minuto».
2. Biblioteca: lista por fecha de actualización, búsqueda por nombre sin tildes.
3. **Nuevo**: `+ Nuevo modelo` → crea «Modelo nuevo» (SD vacío), lo guarda (`PUT If-None-Match: *`) y abre el
   editor con el nombre del encabezado en edición.
4. **Abrir**: clic en la fila → `#/m/<id>/<opdRaiz>`.
5. **Eliminar**: 🗑 → pasa a la papelera; aviso «Movido a la papelera · Deshacer». Papelera: `Restaurar` o
   `Eliminar definitivamente` (única confirmación de la biblioteca).
6. **Importar**: `Importar…` → selector de archivo → `importar` local → tarjeta en línea con el informe (conteos y
   «Ver detalle» con la lista completa) → `Importar` asigna id nuevo, guarda y abre. Si se rechaza (referencias
   rotas), la tarjeta muestra la razón y no hay botón Importar.
7. **Salir** → `DELETE /api/sesion`.

### 7.5 Crear cosas y nombrarlas; esencia y afiliación

1. Tecla `O` (objeto) o `P` (proceso) con el puntero sobre el lienzo, o clic en `[▭ Objeto]`/`[⬭ Proceso]`
   (centro visible), o arrastrar el botón al lienzo.
2. Aparece un fantasma discontinuo y una entrada de nombre en línea. Validación léxica en vivo bajo la entrada.
3. `Intro`: nombre nuevo → `crearCosa`; el OPL muestra y resalta su línea (existencia D2; T-240). Nombre existente →
   la entrada muestra «Ya existe **X** (objeto) · Intro: traer · o escribe otro nombre»; `Intro` → `traerCosa`
   (T-065). `Esc` → no se crea nada (sin placeholder).
4. Dentro de un contenedor, `P` crea un subproceso en la banda bajo el puntero (o banda nueva si cae entre franjas).
5. Esencia/afiliación: seleccionar → Propiedades `[ ] Física` `[ ] Ambiental`. El lienzo cambia sombra/dash y el OPL
   agrega D1/D3 (T-249). Afiliación ambiental propaga a rasgos con traza en la línea de mensajes.
6. Renombrar: `F2`/`Intro` sobre la selección, doble clic sobre la cosa, doble clic sobre su token OPL, o el campo
   Nombre.

### 7.6 Estados y designaciones

1. Seleccionar objeto → `S` o `+ Estado` en Propiedades → entrada en línea en la fila de estados; `Intro` crea y abre
   la siguiente (entrada encadenada); `Esc` termina.
2. Seleccionar un estado (clic en la cápsula) → Propiedades: nombre; `[ ] Inicial [ ] Final [ ] Por defecto
   [ ] Current`; `[ ] Oculto en este OPD` (deshabilitado si está anclado, con explicación); `[ ] Oculto en todos`;
   `Eliminar estado`.
3. Reordenar: arrastrar la cápsula a izquierda/derecha → `reordenarEstado`; cambia el orden de D5 (T-107).
4. Ocultos: aparece `⋯N` en el objeto y el OPL usa D6 (T-208, T-101).

### 7.7 Enlaces: menú filtrado, vista previa, control, etiquetas, ruta, multiplicidad

1. Pasar sobre una cosa (o cápsula) → asa ■ en su lado derecho. Arrastrar desde el asa: línea discontinua;
   destinos válidos con halo, inválidos atenuados.
2. Soltar sobre la cosa o cápsula destino → **menú de tipo** en el punto: solo tipos legales (`tiposPosibles`), cada
   uno con su oración OPL generada por el generador real («*Registrar* consume **Ficha**»); flechas + `Intro`;
   `⇄ Invertir sentido` al pie para estructurales/etiquetados. Sin tipos: «No hay enlaces OPM válidos entre **A** y
   *B*» con la razón principal.
3. Elegir → `crearEnlace`; el OPL resalta la oración nueva.
4. Alternativa por teclado: seleccionar, `L`, clic en destino (`Esc` cancela).
5. Seleccionar enlace (clic en la línea) → Propiedades: tipo (select de tipos legales, conserva el id), estados de
   entrada/salida (efecto: ambos selects → TS3/TS4/TS5), `Control: ninguno · evento e · condición c` (opciones
   ilegales deshabilitadas con motivo; teclas `E`/`C`), etiqueta y etiqueta inversa (etiquetados; inversa vacía =
   recíproco), ruta (consumo/resultado), multiplicidad `1 · ? · * · +` en los extremos admitidos, abanico (7.8),
   `Eliminar enlace`. Para excepciones: la duración mín/máx del proceso fuente (edita la entidad).

### 7.8 Abanicos XOR/O

1. Seleccionar un enlace → Propiedades «Abanico: `ninguno · XOR (exactamente uno) · O (al menos uno)`» + lista de
   candidatos (mismo tipo, mismo extremo común) con casillas.
2. Elegir operador y marcar ≥1 candidato → `fijarAbanico`; aparece el arco (1 o 2) en el extremo común y el OPL
   cambia a «*P* consume exactamente uno de **A** o **B**».
3. Dos enlaces al mismo par (p. ej. salidas a estados distintos): al crear el segundo, el menú ofrece «… en abanico XOR
   con la existente» (R-FAN-5).
4. `ninguno` disuelve.

### 7.9 Descomponer y ordenar subprocesos en bandas

1. Seleccionar proceso → `D` o `Descomponer` → se crea SD1, se navega a él, el contenedor aparece con los externos
   alrededor y una entrada de nombre en la primera banda.
2. Escribir «Recibir» `Intro` → subproceso en banda 1; la entrada salta a la banda 2 («Evaluar» `Intro`…);
   `Mayús+Intro` agrega el siguiente en la **misma** banda (paralelo); `Esc` termina.
3. Al crear el primero, los enlaces del contorno migran (consumo al primero, resultado al último, TS3 escindido);
   la línea de mensajes lo informa.
4. Reordenar: arrastrar un subproceso; guías de banda; soltar sobre una franja = paralelo; entre franjas = banda
   nueva; X libre dentro del contenedor.
5. El OPL del hijo muestra CX1/CX2/mixta; el del padre sigue diciendo «*P* consume **O**» (plegado).

### 7.10 Desplegar y colección incompleta

1. Seleccionar cosa → `Desplegar…` → cuatro botones: `Partes · Rasgos · Especializaciones · Instancias` →
   `desplegar` → se navega al OPD nuevo con la cosa arriba y sus refinadores de ese modo abajo.
2. Botón UI «+ parte» (o «+ rasgo»…) bajo la cosa → entrada encadenada de refinadores (crea cosa + enlace del modo).
3. Colección incompleta: seleccionar el refinable → `[ ] Colección incompleta (partes)` → barra bajo el triángulo y
   «… y al menos otra parte» (T-034, T-118). Si un OPD muestra solo algunas partes, la marca aparece sola (traza).

### 7.11 Superficies (conteo y justificación)

| Superficie | Tipo | Por qué es necesaria |
|---|---|---|
| Ingreso | pantalla | una cuenta con clave (DECISIONS) |
| Biblioteca (incluye papelera e informe de importación en línea) | pantalla | abrir/nuevo/eliminar/importar (DECISIONS) |
| Editor | pantalla | modelado |
| Lienzo | región | OPD (spec-OPD) |
| Propiedades | región | edición de atributos canónicos sin menú contextual |
| OPL | región | bimodalidad activa siempre visible (T-240, T-241) |
| Árbol OPD | emergente (desde la ruta) | navegación en modelos de 36 OPDs (T-252) |
| Diagnóstico | emergente (desde el contador) | panel de validación fuera del lienzo (T-228, T-260) |
| Tipo de enlace | emergente (tras soltar) | menú filtrado con vista previa (T-040) |
| Exportar | emergente (encabezado) | perfiles y compuertas (T-280–T-283) |
| Confirmar | diálogo | eliminar del modelo con otras apariencias, eliminar refinamiento, eliminar definitivamente |
| Banda de conflicto | banda en el encabezado | resolver sin modal |
| Entrada de nombre en línea | control | crear/renombrar sin formulario |

Total: 3 pantallas, 3 regiones, 4 emergentes, 1 diálogo, 1 banda. Sin menús contextuales (clic derecho = seleccionar):
todo verbo sobre la selección está en Propiedades o en un atajo.

### 7.12 Atajos (lienzo enfocado; fuera de campos de texto)

| Tecla | Acción |
|---|---|
| `O` / `P` | nuevo objeto / proceso en el puntero |
| `S` | nuevo estado en el objeto seleccionado |
| `L` | enlazar desde la selección (clic en destino) |
| `F2` / `Intro` | renombrar selección |
| `Supr` | cosa: quitar de este OPD · enlace/estado: eliminar |
| `Mayús+Supr` | eliminar cosa del modelo |
| `E` / `C` | alternar evento / condición del enlace seleccionado |
| `D` | descomponer el proceso seleccionado |
| `Alt+↓` / `Alt+↑` | abrir refinamiento de la selección / ir al OPD padre |
| `Ctrl+Z` · `Ctrl+Mayús+Z` / `Ctrl+Y` | deshacer · rehacer |
| `Ctrl+S` | guardar ahora |
| `Tab` / `Mayús+Tab` | seleccionar cosa siguiente/anterior |
| Flechas (`Mayús` = fino) | mover selección 10 px (1 px) |
| `0` · `+` · `−` | encuadrar · acercar · alejar |
| `Esc` | cancelar gesto o deseleccionar |

Los atajos se muestran en los `title` de los botones de Propiedades y en `docs/uso.md`. Rueda con `Ctrl` o pellizco
= zoom anclado al puntero (±10 % por muesca, 0.2–3); arrastrar el fondo = desplazar.

### 7.13 Navegación, traer, quitar y eliminar

- Árbol: clic en la ruta `SD › SD1 ▾` → emergente con todos los OPDs sangrados (etiqueta, cosa refinada, icono de
  modo, contador de errores); `Intro`/clic navega. También: botón «⤵» de cosas refinadas, `Alt+↓/↑`, clic en
  encabezados del OPL. La URL guarda el OPD (`#/m/<id>/<opdId>`): el botón Atrás del navegador vuelve al OPD previo.
- **Traer cosa existente**: sin selección, Propiedades muestra el OPD (etiqueta, refinamiento, `Traer a este OPD:
  [buscar cosa…]`) y el modelo (nombre, descripción, unidad de tiempo). Elegir → `traerCosa` en el centro visible;
  sus enlaces con cosas visibles aparecen solos.
- **Quitar de este OPD** (`Supr`) vs **Eliminar del modelo** (`Mayús+Supr`, T-251): botones distintos en
  Propiedades. Eliminar pide confirmación solo si la cosa aparece en otros OPDs («aparece en SD, SD1.2; se borran 4
  enlaces»); si no, se hace y se puede deshacer.
- **Reanclar** (T-250): seleccionar un enlace → asas en sus extremos → arrastrar un extremo a otra cosa o cápsula →
  `reanclarEnlace` (validado).
- **Duración**: seleccionar proceso → `Duración mín / esperada / máx / unidad` (unidad por defecto: la del modelo);
  aparece bajo el nombre en la elipse.

### 7.14 Editar OPL y aplicar; bimodalidad

1. Hover sobre una cosa/estado/enlace del lienzo → sus tokens OPL se resaltan (`paperWarm`); hover sobre un token →
   el elemento se resalta en el lienzo (por referencia tipada, T-242).
2. Clic en un token → selecciona el elemento; si es de otro bloque, navega a ese OPD; si está fuera de vista, desplaza
   sin cambiar zoom (T-243). Doble clic en un token de nombre/estado/etiqueta → renombrar en línea (T-183).
3. `⌖` filtra el OPL por la selección (enlace antes que cosa, T-244); `#` numera; `Esencia` cicla los tres modos.
4. `Editar` → el panel pasa a un área de texto con el texto canónico. Mientras se escribe (200 ms), debajo se listan
   las líneas `aplicable` y `no-aplicable` con su razón, el resumen y el botón `Aplicar N cambios`.
5. `Aplicar` → todo o nada; éxito: una entrada de deshacer, las líneas aplicadas pasan a `sin-cambio`, el editor sigue
   abierto; `Listo` vuelve a la vista de bloques.

### 7.15 Diagnóstico, exportar, deshacer, guardado y conflicto

- **Diagnóstico**: contador `⛔ errores ⚠ advertencias` en el encabezado → emergente agrupado por severidad y OPD;
  cada ítem: mensaje, regla, acción; clic navega y selecciona. `Mostrar info (N)` al pie.
- **Exportar ▾**: «Diagrama de este OPD (SVG)», «Documento canónico (HTML)», «OPL (Markdown)», «Modelo (JSON)»; los
  canónicos deshabilitados con la razón si una compuerta falla; advertencias de cruces/oclusión junto al SVG.
- **Deshacer/rehacer**: `↶ ↷` y atajos; pila de 200 instantáneas inmutables por modelo abierto; un arrastre, una
  aplicación OPL o una operación compuesta (descomponer) son una entrada.
- **Guardado** (indicador único): `✓ Guardado` · `● Sin guardar` · `Guardando…` · `Sin conexión · guardado en este
  navegador` · `⚠ Conflicto`. Clic o `Ctrl+S` guarda ahora.
- **Conflicto**: banda «Otra sesión guardó este modelo a las 14:02. [Conservar mis cambios] [Usar la versión
  guardada]». Conservar → sobrescribe; la versión reemplazada va a la papelera. Usar la guardada → la versión local
  se guarda como modelo nuevo «Nombre (copia 14:05)» y se carga la del servidor. Nada se pierde.

### 7.16 Estado vacío y errores

- SD vacío: texto centrado en el lienzo «`P` crea un proceso · `O` crea un objeto · arrastra desde ■ para enlazar».
  Biblioteca vacía: «Aún no hay modelos» con `Nuevo` e `Importar`.
- Rechazo del núcleo: línea de mensajes (4 s, anunciada con `aria-live`) con la regla legible, el ID y la acción:
  «Un resultado no llega al estado inicial (AP-04). Ánclalo al objeto o a un estado no inicial.»
- Red: indicador «Sin conexión»; reintento con espera 1 s → 30 s.
- Error inesperado: mensaje «Algo falló; tus cambios están guardados en este navegador» y el modelo queda intacto
  (toda operación es pura; la excepción no alcanza el estado).

---

## 8. Persistencia y servidor

### 8.1 Rutas HTTP (`servidor/servidor.ts`)

| Método y ruta | Entrada | Respuestas |
|---|---|---|
| `POST /api/sesion` | `{"clave": string}` | 204 + `Set-Cookie` · 401 `{"error":"Clave incorrecta"}` · 429 |
| `GET /api/sesion` | — | 204 · 401 |
| `DELETE /api/sesion` | — | 204 (cookie vencida) |
| `GET /api/modelos` | — | 200 `[{"id","nombre","actualizado","bytes"}]` por `actualizado` desc |
| `GET /api/modelos/:id` | — | 200 documento v0 + `ETag: "<sha256>"` · 404 |
| `PUT /api/modelos/:id` | documento v0; `If-Match: "<sha>"` o `If-None-Match: *`; opcional `X-Respaldo: 1` | 200/201 `{"etag"}` · 400 `{"error"}` (códec rechaza o `modelo.id ≠ :id`) · 412 `{"etag": actual}` · 413 |
| `DELETE /api/modelos/:id` | — | 204 (a papelera) · 404 |
| `GET /api/papelera` | — | 200 `[{"clave","id","nombre","eliminado","bytes"}]` |
| `POST /api/papelera/:clave/restaurar` | — | 200 `{"id"}` (id nuevo y nombre «(restaurado)» si el id está ocupado) |
| `DELETE /api/papelera/:clave` | — | 204 |
| `GET /healthz` | — | 200 `{"ok":true,"version":"<sha>"}` · 503 si `DATOS` no es escribible |
| `GET /*` | — | estáticos de `dist/` (`/assets/*` inmutables 1 año; `index.html` `no-store`); SPA → `index.html` |

- Toda ruta `/api/*` salvo `POST/GET /api/sesion` exige cookie válida (401).
- **CSRF**: cookie `SameSite=Strict`; toda petición mutante exige la cabecera `X-Opforja: 1` (fuerza preflight
  entre orígenes) y, si hay `Origin`, que coincida con el host (`X-Forwarded-Host` detrás de Traefik) → 403.
- `:id` y `:clave` validados `^[A-Za-z0-9_.~-]{1,120}$` (sin travesía de rutas).
- Límite de cuerpo 10 MB (413). Registro: una línea JSON por petición (método, ruta, estado, ms), sin cuerpos.

### 8.2 Cuenta única

- `bun servidor/cuenta.ts --datos <dir>` pide la clave dos veces por stdin (≥ 12 caracteres) y escribe
  `credencial.json` (modo 0600): `{"hash":"scrypt$16384$8$1$<sal b64url>$<hash b64url>","secreto":"<64 hex>",
  "actualizado":"<ISO>"}` (mismo formato que `passwordHash.ts` v0, así la migración conserva la clave). Cambiar la
  clave regenera `secreto`: invalida todas las sesiones.
- Verificación scrypt en tiempo constante; con credencial ausente el servidor arranca y responde 503 en `/api/*`.
- Cookie `opforja_sesion=<exp>.<nonce>.<hmac-sha256(secreto, exp.nonce) b64url>`; `HttpOnly`, `SameSite=Strict`,
  `Path=/`, `Secure` salvo en `localhost`, `Max-Age` 30 días.
- Límite de intentos: 5 fallos en 15 min → 429 durante 60 s (memoria).

### 8.3 Almacenamiento (`servidor/almacen.ts`)

```
$DATOS/
  credencial.json
  modelos/<id>.json                      documento canónico (salida de exportar)
  papelera/<id>~<yyyymmddThhmmssZ>.json  eliminados y versiones reemplazadas en conflicto
  migracion/                             solo tras migrar (INFORME.md, versiones/, rechazados/)
  tmp/                                   escrituras en curso
```

- **Escritura atómica**: `tmp/<rand>` → `fsync` → `rename` al destino → `fsync` del directorio.
- **CAS por huella**: `ETag` = sha256 de los bytes guardados. `PUT` con `If-Match` distinto del actual → 412 con el
  actual. `If-None-Match: *` sobre existente → 412.
- **Normalización en el servidor**: `PUT` ejecuta `importar` → si hay rechazo, 400; si no, guarda `exportar(modelo)`
  (bytes canónicos, punto fijo) y devuelve su huella. El cliente y el servidor usan el mismo códec, así la huella
  coincide.
- Índice en memoria `id → {nombre, actualizado, bytes, etag}` construido al arrancar y actualizado en cada escritura;
  escrituras serializadas por id (cadena de promesas).
- Papelera: `DELETE` mueve; `X-Respaldo: 1` en `PUT` mueve la versión actual a la papelera antes de sobrescribir;
  purga automática de entradas con más de 30 días al arrancar y cada 24 h.

### 8.4 Guardado automático y borrador local (`app/api.ts`, `app/acciones.ts`)

1. Abrir: `GET` → `base = ETag`. Si `localStorage["opforja:borrador:<id>"]` existe: con `base` igual y contenido
   distinto → se restaura y se marca `Sin guardar` («Se recuperaron cambios locales»); con `base` distinta → banda
   de conflicto.
2. Cada cambio del modelo: borrador `{base, json, t}` en `localStorage` (300 ms) y `PUT If-Match: base` (1.5 s de
   calma, máximo 10 s). Éxito → `base = etag`; si no hubo cambios nuevos, se borra el borrador.
3. 412 → banda de conflicto; el guardado automático se pausa. Error de red → `Sin conexión`, reintento exponencial;
   el borrador protege el trabajo. Cuota llena → aviso «no se pudo guardar localmente».
4. `beforeunload` advierte solo si hay cambios sin confirmar por el servidor.

### 8.5 Migración única desde PostgreSQL (`servidor/migrar-postgres.ts`)

`bun servidor/migrar-postgres.js --datos /datos [--simular] [--tenant <id>]` con `DATABASE_URL` (cliente
`Bun.sql` incorporado; sin dependencias). Solo lee de PostgreSQL.

1. Rechaza si `modelos/` no está vacío (salvo `--forzar`).
2. `SELECT id, email, password_hash FROM opforja_accounts` → exactamente una cuenta (si no, aborta listando);
   `SELECT tenant_id FROM opforja_account_tenants WHERE account_id=$1` → un tenant (o `--tenant`).
3. `credencial.json` con el `password_hash` existente (la clave actual sigue sirviendo) y un `secreto` nuevo.
4. `SELECT indice FROM opforja_workspaces WHERE tenant_id=$1` → carpetas, especies y archivados (solo para el
   informe).
5. `SELECT id, nombre, carpeta_id, archivado, actualizado_en, payload::text FROM opforja_models WHERE tenant_id=$1`
   y `SELECT modelo_id, creado_en, payload::text FROM opforja_model_autosaves WHERE tenant_id=$1`. Documento
   efectivo = autosave si `creado_en > actualizado_en` (ley v0 del testigo), si no el guardado.
6. Por modelo: `importar(payload)`; `ok` → `modelo.id = row.id`, `modelo.nombre = row.nombre`, `exportar` →
   `modelos/<id>.json` (o `papelera/` si estaba archivado); rechazo → `migracion/rechazados/<id>.json` (bytes
   originales) + razón.
7. `SELECT modelo_id, id, nombre, creado_en, payload::text FROM opforja_model_versions WHERE tenant_id=$1` →
   `migracion/versiones/<modelo>/<id>.json` tal cual; el documento no elegido del paso 5 →
   `migracion/versiones/<modelo>/descartado-<guardado|autosave>.json`. Nada se pierde.
8. `migracion/INFORME.md`: por modelo nombre, carpeta (ruta), especie (apunte/modelo/biblioteca), archivado,
   fuente elegida, normalizaciones, campos no representados con conteo, errores recuperables, resultado; al final,
   conteos de tablas no migradas (`opforja_agent_*`, `opforja_review_*`).
9. `--simular` escribe solo el informe (en stdout).

### 8.6 Respaldo

`deploy/respaldar-datos.sh` (systemd diario 03:30 America/Santiago): `docker run --rm -v <volumen>:/datos:ro
-v $DESTINO:/r alpine tar czf /r/opforja-datos-$(date +%F).tgz -C /datos .`, `umask 077`, retención 14 días
(parámetros por `EnvironmentFile`, sin rutas de usuario fijas). Restaurar = detener el servicio, `tar xzf` en el
volumen, levantar.

---

## 9. Despliegue

### 9.1 Dockerfile

```dockerfile
FROM oven/bun:1.3-slim AS build
WORKDIR /app
COPY app/package.json app/bun.lock app/bunfig.toml ./
RUN bun install --frozen-lockfile
COPY app/ ./
ARG OPFORJA_BUILD=local
RUN VITE_OPFORJA_BUILD=$OPFORJA_BUILD bun run build \
 && bun build servidor/servidor.ts --target=bun --outfile=salida/servidor.js \
 && bun build servidor/cuenta.ts --target=bun --outfile=salida/cuenta.js \
 && bun build servidor/migrar-postgres.ts --target=bun --outfile=salida/migrar-postgres.js

FROM oven/bun:1.3-slim
WORKDIR /app
ARG OPFORJA_BUILD=local
ENV DATOS=/datos PORT=8080 OPFORJA_BUILD=$OPFORJA_BUILD
COPY --from=build /app/dist ./dist
COPY --from=build /app/salida ./servidor
RUN mkdir -p /datos && chown bun:bun /datos
USER bun
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD bun -e "const r=await fetch('http://127.0.0.1:8080/healthz');process.exit(r.ok?0:1)"
CMD ["bun", "servidor/servidor.js"]
```

### 9.2 docker-compose.yml

```yaml
services:
  opforja:
    build: { context: ., args: { OPFORJA_BUILD: "${OPFORJA_BUILD:-local}" } }
    image: opforja:latest
    container_name: opforja
    restart: unless-stopped
    environment: { DATOS: /datos, PORT: "8080", OPFORJA_BUILD: "${OPFORJA_BUILD:-local}" }
    volumes: [ "opforja-datos:/datos" ]
    networks: [ web ]
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=web"
      - "traefik.http.routers.opforja.rule=Host(`opforja.sanixai.com`)"
      - "traefik.http.routers.opforja.entrypoints=websecure"
      - "traefik.http.routers.opforja.tls.certresolver=myresolver"
      - "traefik.http.routers.opforja.middlewares=opforja-security-headers@docker"
      - "traefik.http.services.opforja.loadbalancer.server.port=8080"
      # mismas cabeceras HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy que hoy; CSP endurecida:
      - "traefik.http.middlewares.opforja-security-headers.headers.customResponseHeaders.Content-Security-Policy=default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
networks: { web: { external: true } }
volumes: { opforja-datos: {} }
```

### 9.3 deploy/deploy.sh (único circuito)

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
command -v curl >/dev/null || { echo "ERROR: falta curl" >&2; exit 1; }
SHA="$(git rev-parse --short HEAD)"
[ -z "$(git status --porcelain --untracked-files=all)" ] || SHA="${SHA}-dirty"
URL="${OPFORJA_URL:-https://opforja.sanixai.com}"; URL="${URL%/}"
echo "→ desplegando opforja · build ${SHA}"
OPFORJA_BUILD="$SHA" docker compose up -d --build --wait --wait-timeout 120 --remove-orphans
echo "→ comprobando salud, versión y acceso"
SALUD="$(curl -fsS --retry 3 --retry-delay 2 --max-time 15 "$URL/healthz")"
grep -Fq "\"version\":\"${SHA}\"" <<<"$SALUD" || { echo "ERROR: se sirve otro build: $SALUD" >&2; exit 1; }
curl -fsS --max-time 15 "$URL/" -o /dev/null
ESTADO="$(curl -sS --max-time 15 -o /dev/null -w '%{http_code}' "$URL/api/sesion")"
[ "$ESTADO" = "401" ] || { echo "ERROR: /api/sesion sin sesión devolvió ${ESTADO}" >&2; exit 1; }
echo "✓ build ${SHA} sano y protegido en ${URL}"
```

`--remove-orphans` retira los contenedores viejos (`opforja-model-api`, `opforja-postgres`, `opforja-bug-capture`)
pero **no** los volúmenes: el de PostgreSQL queda intacto. `app/test/deploy.test.ts` ejecuta el script con
`git`, `docker` y `curl` simulados (versión confirmada, 401 exigido, `-dirty`).

### 9.4 Transición desde el stack actual (no se ejecuta en esta tarea)

1. Con el stack viejo arriba: `pg_dump` con `deploy/backup-opforja-db.sh` del commit viejo y copia del volumen.
2. `docker build -t opforja:latest --build-arg OPFORJA_BUILD=$(git rev-parse --short HEAD) .` (sin desplegar).
3. `docker volume create deep-opm-pro_opforja-datos` (compose lo adopta después; la advertencia «not created by
   Docker Compose» es esperada); migración en seco:
   `docker run --rm --network deep-opm-pro_opforja-internal -e DATABASE_URL=postgres://opforja:<clave>@postgres:5432/opforja
   -v deep-opm-pro_opforja-datos:/datos opforja:latest bun servidor/migrar-postgres.js --datos /datos --simular`.
4. Revisar el informe; ejecutar sin `--simular`; revisar `migracion/INFORME.md`; opcionalmente levantar la imagen
   en un puerto local con una copia del volumen para abrir modelos.
5. `./deploy/deploy.sh` (nuevo). Verificar ingreso con la clave actual y apertura de los modelos grandes.
6. **Rollback**: `git checkout <sha-viejo> && ./deploy/deploy.sh` levanta el stack viejo con el mismo volumen de
   PostgreSQL (no recibió escrituras desde el corte). El trabajo hecho en el sistema nuevo se lleva con «Modelo
   (JSON)» → importar en la app vieja (el export usa nombres v0).
7. El volumen de PostgreSQL y el `pg_dump` se conservan al menos 30 días; su retiro es manual y queda en
   `docs/operacion.md`.

---

## 10. Verificación

### 10.1 Comandos (`app/package.json`)

```json
{
  "dev": "bun run servidor:dev & vite",
  "servidor:dev": "DATOS=.datos-dev PORT=3001 bun --watch servidor/servidor.ts",
  "build": "vite build",
  "check": "tsc --noEmit && bun test",
  "e2e": "playwright test",
  "cuenta": "bun servidor/cuenta.ts"
}
```

`vite.config.ts` redirige `/api` y `/healthz` a `localhost:3001` en desarrollo (mismo servidor que producción, datos
en `.datos-dev/`, ignorado por Git). `bun run check` es el gate por defecto (AGENTS.md): tipos estrictos (`strict`, `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, … incluido `e2e/`) + todos los tests de `app/test/`. `bun run e2e` para interacción
y render (Chromium de `/opt/pw-browsers` vía `PLAYWRIGHT_BROWSERS_PATH`; `PW_CHROMIUM` fuerza ejecutable). `build`
para empaquetado.

### 10.2 Tests unitarios y de servidor (`app/test/`)

| Archivo | Qué prueba |
|---|---|
| `ayuda.ts` | `must`, constructor de modelos por mini-DSL (`m('O Paciente[ingresado,alta] · P Atender · Atender consume Paciente')`), búsqueda por nombre |
| `matriz.test.ts` | Cada fila de §4.4 y cada regla transversal: aceptación y rechazo con su código (T-040–T-061, T-269); `tiposPosibles` nunca ofrece lo que `crearEnlace` rechaza (propiedad sobre todos los pares de un modelo de muestra) |
| `operaciones.test.ts` | Cosas, estados, designaciones, supresión (global domina, local por apariencia, anclado visible), unicidad y léxico, tipo, propagación ambiental, quitar vs eliminar, cascadas, abanicos, reanclaje; pureza (la entrada no cambia) |
| `refinamiento.test.ts` | Descomponer (atómico, externos, aciclicidad, T-079), bandas y reordenamiento, `distribuir` (tabla §4.6.4, idempotencia, escisión con mismo id), desplegar por modo, eliminar refinamiento (materialización, internos, solo hoja), AP-27, doble vara |
| `proyeccion.test.ts` | Abstracción, fuerza de 12 niveles, matriz 3×3, R+C, AP-30, efectos fundidos y TS3 re-fusionado, R-VIS-HIJO-1, colección incompleta visible; **ley de frontera** R-CAT-EQ-3 (T-089) con control no tautológico (mutar un enlace del hijo la rompe) |
| `diagnostico.test.ts` | Cada código de §4.5 con caso positivo y negativo; herencia DR-43; compuertas de export |
| `codec.test.ts` | Cada fila de §3.3 (entrada v0 sintética → normalización y entrada del informe); rechazo por cada referencia rota; punto fijo y determinismo; los 6 `fixtures/demo-models/*.json` importan, re-exportan en punto fijo y conservan conteos de cosas/estados/enlaces (menos derivados) |
| `opl-plantillas.test.ts` | `leer(escribir(h)) = h` por plantilla y variante; vocabulario cerrado (T-104); `y/e`, `o/u` fonéticos; género; unidades es-CL; `puede ser` con estados → `non-canonical`; cada fila `soportada:false` → `unsupported-canonical` sin patches |
| `opl-generar.test.ts` | Tabla 9.2 fila por fila (T-105), orden del bloque, existencia D2, plegado en el padre, CX1/CX2/mixta/CX3 y umbral de 2, estructurales agrupados vs atómicos, abanicos por familia, ruta, multiplicidad, display (tres modos) no altera el canónico |
| `opl-roundtrip.test.ts` | R-§19-SIM-1 (sin errores y plan vacío) y **R-§19-SIM-3 estricto** desde modelo vacío sobre ≈100 fixtures (§5.7) y los demo válidos |
| `opl-editor.test.ts` | Leyes safe-lens: ausencia no borra (T-172), preview puro (T-173), patches vacíos = identidad (T-196); 4 estados y 8 razones; conflictos; partial-parse (T-179); todo-o-nada (T-180); fases; creación idempotente; línea abstraída = sin-cambio; nunca renombra |
| `opd.test.ts` | Recortes elipse/rect; peine; rayo; lazo; arcos; topología de marcadores por tipo (T-209–T-217); SVG export sin `data-ref` ni capa UI; bbox sin recortes; dorados SVG de 12 construcciones (8 cosas, 4 triángulos, TS1–TS5, H1/H2, IV1/IV2, EX1/EX2, XOR/OR, etiquetados, in-zoom, despliegue) en `test/dorados/`; escala de grises distingue todo |
| `acciones.test.ts` | Un commit por operación, deshacer/rehacer, aplicación OPL = una entrada, guardado automático con API falsa (debounce, 412 → conflicto, red caída → borrador) |
| `servidor.test.ts` | Servidor real en puerto efímero con `DATOS` temporal: ingreso, 401/403/429, CSRF por cabecera y `Origin`, CAS 412, `If-None-Match`, normalización canónica y huella, 413, papelera (mover, restaurar con id ocupado, purga), escritura atómica (sin archivos parciales tras fallo simulado), travesía de rutas |
| `migrar.test.ts` | La función pura `migrarFilas(filas) → {archivos, informe}` con filas sintéticas (autosave más nuevo, archivado, rechazado, versiones) |
| `rendimiento.test.ts` | Modelo sintético de 262 cosas, 192 estados, 433 enlaces, 36 OPDs: `importar+exportar` < 150 ms, `generarOpl` completo < 60 ms, `escena+svg` de un OPD de 25 cosas < 10 ms, `diagnosticar` < 60 ms |
| `arquitectura.test.ts` | Dirección de dependencias de §2.3 |
| `deploy.test.ts` | `deploy/deploy.sh` con binarios simulados |

Convención: el título de cada test que prueba un requisito empieza por su T-ID; así el registro cita evidencia.

### 10.3 E2E Playwright (`app/e2e/`, servidor real con datos temporales; credencial creada en `globalSetup` con `cuenta.ts`)

Se localiza por rol y nombre accesible; el estado del modelo se verifica por el JSON del servidor (`GET` directo con la
cookie de la página) y por el texto OPL visible. Sin CSS, sin textos de tickets, sin `import('/src/…')`.

1. `ingreso.spec`: clave errónea, correcta, salida, 401 sin sesión.
2. `biblioteca.spec`: nuevo → renombrar en encabezado → volver → buscar → eliminar → deshacer → papelera → restaurar.
3. `importar.spec`: `SD_Sync.json` → informe → importar → OPL contiene «*Main System Doing* cambia **Beneficiary
   Relevant Attribute** de `problematic` a `satisfactory`.» → navegar a SD1.
4. `cosas-enlaces.spec`: `O`/`P` con nombres; arrastre desde ■; menú sin «maneja» con objeto informacional y con él
   tras marcar Física; oración exacta; JSON con el enlace; colisión de nombre → traer.
5. `estados.spec`: crear dos estados encadenados; inicial+final → D10; reordenar por arrastre → D5 cambia; ocultar aquí
   → D6 y `⋯1`.
6. `cambio-estado.spec`: efecto desde estado `a`, salida `b` en Propiedades → TS3; `E` → ETS2; resultado a estado
   inicial no ofrecido.
7. `abanicos.spec`: dos consumos → XOR → «consume exactamente uno de …»; arco presente en el SVG; `O` → doble arco.
8. `descomponer.spec`: `D`, entrada encadenada de tres subprocesos, `Mayús+Intro` paralelo; consumo migra al primero
   (OPL del hijo) y el padre sigue plegado; arrastrar a la misma franja → «paralelo»; rayo entre bandas adyacentes no
   ofrecido.
9. `desplegar.spec`: partes, «+ parte», CX3, colección incompleta → barra y «al menos otra parte».
10. `editor-opl.spec`: agregar dos líneas válidas y una inválida → 2 aplicables, 1 no aplicable con razón; aplicar;
    `Ctrl+Z` revierte en un paso; quitar una línea no borra.
11. `bimodal.spec`: hover en token resalta el elemento (atributo `data-resaltado`); clic en token de otro OPD navega y
    selecciona; filtrar por selección.
12. `apariencias.spec`: traer cosa existente; `Supr` quita de este OPD (sigue en SD); `Mayús+Supr` con confirmación
    elimina de todos; reanclar un extremo estructural.
13. `exportar.spec`: SVG sin `data-ref`; compuerta >25 deshabilita con razón; documento HTML con un SVG por OPD; JSON
    idéntico al del servidor.
14. `guardado.spec`: indicador tras editar; red abortada → «Sin conexión» y borrador; reconexión → guardado; segunda
    página modifica → banda de conflicto → «Conservar mis cambios» (la otra versión en papelera).

Más un smoke en viewport estrecho (dentro de `cosas-enlaces.spec`, proyecto `estrecho`).

---

## 11. Documentación final, canon vendorizado y lo que se elimina

### 11.1 Documentos del repo

| Archivo | Contenido |
|---|---|
| `README.md` | Qué es (una frase del manual §0: «una figura vale solo si porta un hecho OPM válido expresable en OPL»), cómo correr (`bun install`, `bun run cuenta`, `bun run dev`), gate (`bun run check`), enlaces a `docs/` |
| `AGENTS.md` | Misión; autoridad = `docs/canon/` (4 documentos) > `docs/especificacion.md` > código; dependencias `modelo → opl → opd → app → ui`, servidor solo códec; simetría OPD/OPL por la tabla de plantillas; verificación (`check`, `e2e`, `build`); despliegue solo con `./deploy/deploy.sh`; **lista de cierre del Anexo A** (firma, identidad, parseo, refinamiento, deuda) para cambios de modelado, parser, generador, import/export y render (T-303); registro de conformidad actualizado en el mismo cambio; un único `HANDOFF.md` si queda trabajo material |
| `CLAUDE.md` | `@AGENTS.md` |
| `NOTICE.md` | Sin licencia declarada; el canon vendorizado pertenece a su autor y se incluye como autoridad local; el repo ya no contiene material observacional de OPCloud; dependencias con sus licencias |
| `docs/README.md` | Índice: uso, operación, conformidad, decisiones, especificación, canon |
| `docs/uso.md` | Pantallas, regiones, cada flujo de §7 en forma breve, atajos (§7.12), qué significa cada estado de guardado y de línea OPL |
| `docs/operacion.md` | Variables (`DATOS`, `PORT`, `OPFORJA_BUILD`), cuenta, estructura de datos, respaldo y restauración, despliegue, migración (§8.5) y transición/rollback (§9.4) |
| `docs/conformidad.md` | Registro R-CONF-7 (§1.4) con las 248 filas + filas sin T-ID + bisimetrías parciales |
| `docs/decisiones.md` | DR-n del canon que el producto aplica (referencia a `especificacion.md` §10) y P-1…P-21 (abajo), cada una con su porqué en una línea |
| `docs/especificacion.md` | `understand/CANON.md` tal cual (especificación derivada, subordinada al canon) |
| `docs/canon/*.md` | Los 4 documentos del dueño, sin editar |

Decisiones de producto (contenido de `docs/decisiones.md`):
P-1 recíproco = bidireccional sin inversa distinta (un tipo menos; R-STRE-1 por construcción) · P-2 orden OPL por
nombre (reproducible; R-§19-SIM-3) · P-3 D2 de existencia para cosa no mencionada · P-4 aplicación OPL en fases con
enlaces en preorden inverso · P-5 TS4/TS5 standalone en contorno: entrada al primero, salida al último · P-6
descomposición sin subprocesos semilla · P-7 todo enlace entre cosas visibles se ve (no hay supresor de enlaces) ·
P-8 eliminar refinamiento materializa la vista abstraída (DR-17) · P-9 internos solo en su refinamiento y
descendientes · P-10 unicidad de nombres insensible a mayúsculas, sensible a tildes · P-11 LF-19 exime estados
iniciales · P-12 sin selección múltiple; abanicos desde Propiedades · P-13 geometría de estados automática; orden
visual = orden semántico · P-14 tamaño persistido = mínimo; autosize expande · P-15 unidad de tiempo por defecto
`min` · P-16 la edición libre de OPL nunca renombra · P-17 identidad OPL del enlace `(tipo, origen, destino
[, etiqueta])` · P-18 crear sobre un proceso descompuesto aplica la distribución · P-19 la importación conserva todo
lo representable y solo descarta lo no representable, informándolo · P-20 Bocetos y vistas no se importan como OPD ·
P-21 dos líneas SE1 consecutivas e inversas se leen como un bidireccional (SE3), inversa exacta del generador.

### 11.2 Lista exacta de lo que se elimina

Raíz:

| Elemento | Justificación |
|---|---|
| `.codex/`, `.opencode/` | configuración de skills de agentes; no es producto |
| `HANDOFF.md` | se reemplaza al cerrar (AGENTS.md); su contenido es del producto integrado retirado |
| `assets/`, `catalog/`, `config/`, `webroot/`, `opm-extracted/`, `setup.sh` | material observacional de OPCloud (NOTICE) sin consumidor; `config/` y `webroot/` traen Google Analytics y claves de Firebase de terceros |
| `ui-forja/` | gobierno visual paralelo; los tokens salen de spec-OPD §18 y viven en `estilos.css` |
| `bunfig.toml`, `tsconfig.json` (raíz) | duplicados de los de `app/` |
| `fixtures/empty-model/`, `meta/`, `onstar-system/`, `opm-meta-model/`, `sd-async/`, `sd-sync/`, `system-diagram/`, `demo-models/*.md`, `demo-models/*.opl.txt` | capturas de OPCloud y OPL v0 no canónico; se conservan solo los 6 JSON v0 |
| `docs/` completo salvo los archivos nuevos de §11.1 (`JOYAS.md`, `auditorias/`, `bugs/` (379 archivos), `canon-opm/`, `cheatsheets/`, `decisiones/`, `deploy/`, `ejemplos/`, `manual-opforja.md`, `manual-opm-puro.md`, `manual-sanitarios-opm.md`, `manual-sistemas-opm.md`, `manual-software-opm.md`, `memorias-aprendizajes/`, `reference/`, `render-headless.md`, `roadmap/`, `specs/`, `superpowers/`, `uso-productivo.md`, `verify-reproducible.md`) | el canon vendorizado es la autoridad; manuales de dominio y del método no son el producto; actas, bitácoras y specs superadas quedan en Git; `bugs/` es datos de ejecución de una herramienta retirada |
| `deploy/nginx.conf`, `deploy/backup-opforja-db.sh`, `deploy/systemd/opforja-db-backup.*` | sin nginx ni PostgreSQL; reemplazados por `respaldar-datos.sh` y su timer (el `pg_dump` viejo se usa desde el commit viejo en la transición) |
| `Dockerfile`, `docker-compose.yml` | reescritos (§9) |

`app/`:

| Elemento | Justificación |
|---|---|
| `app/src/` completo (1 141 archivos: `agent/`, `app/`, `autoria/`, `canon/`, `canvas/`, `leyes/`, `mesa/`, `modelo/`, `opl/`, `persistencia/`, `portable-reader/`, `render/`, `serializacion/`, `server/`, `store/`, `tutor/`, `ui/`, `store.ts`, `editorBootstrap.tsx`, `main.tsx`, `version.ts`, tests sueltos) | reescritura; las piezas de calidad se portan como algoritmos (firma, unicidad de par, bandas, abanicos, lazo, recortes, scrypt, cookie), no como archivos |
| `app/e2e/` (76 archivos) | acoplados a JointJS, CSS y funciones retiradas; reemplazados por 14 escenarios |
| `app/scripts/` (29 archivos: gobernanza autorreferente, sondas in-vivo, `ux:eval`, corpus del tutor, headless, verify, mesa, captura de bugs, API Postgres) | retirados o absorbidos por `servidor/` |
| `app/portable-reader/`, `app/_local/` | lector portátil retirado; material local de OPCloud |
| `app/eslint.config.js`, `app/playwright.external.config.ts`, `app/playwright.preview.config.ts` | sin ESLint (tipos estrictos + test de arquitectura); sin amarras externas ni preview separado |
| `app/index.html`, `app/vite.config.ts`, `app/package.json`, `app/bun.lock`, `app/tsconfig.json`, `app/.gitignore` | reescritos |

---

## 12. Plan de implementación (paquetes de trabajo)

Contratos congelados en WP0 (los demás los consumen sin tocarlos): `modelo/tipos.ts` completo; firmas de §4.2
como stubs que devuelven `{ok:false}`; tipos `VistaOpd`, `Oracion`, `LineaOpl`, `Escena`; tabla de rutas HTTP §8.1.

| WP | Objetivo | Archivos | Consume → Produce | Depende de | Aceptación verificable |
|---|---|---|---|---|---|
| WP0 Esqueleto y poda | Repo final vacío y compilable | eliminación §11.2; `app/package.json`, `tsconfig`, `vite.config`, `index.html`, `main.tsx`, `modelo/tipos.ts`, stubs de firmas; `docs/canon/*`, `docs/especificacion.md`; `test/arquitectura.test.ts` | — → contratos | — | `bun run check` verde; `git ls-files` = árbol §2.1 salvo archivos por llenar |
| WP1 Núcleo A | Índice, léxico, matriz | `indice.ts`, `lexico.ts`, `matriz.ts`, `test/matriz.test.ts` | tipos → `validarEnlace`, `tiposPosibles`, consultas | WP0 | todas las filas §4.4 con test; propiedad «ofrecido ⇒ creable» |
| WP2 Núcleo B | Operaciones y refinamiento | `operaciones.ts`, `refinamiento.ts`, tests | matriz → ops §4.2 | WP1 | `operaciones.test`, `refinamiento.test` verdes; pureza |
| WP3 Núcleo C | Proyección y diagnóstico | `proyeccion.ts`, `diagnostico.ts`, tests | ops → `vistaOpd`, `diagnosticar`, compuertas | WP2 | ley de frontera; cada código §4.5 |
| WP4 Códec | Importación/exportación v0 | `codec.ts`, `test/codec.test.ts` | tipos, `distribuir` → `importar`/`exportar` | WP0 (stub de `distribuir`), integra con WP2 | cada fila §3.3; demo en punto fijo |
| WP5 OPL | Plantillas, generador, parser, editor | `opl/*`, 4 tests | `vistaOpd`, ops → `generarOpl`, `clasificar`, `aplicarPlan` | WP1 (tabla y parser), WP3 (generador), WP2 (editor) | SIM-1 y SIM-3 estrictos; leyes safe-lens |
| WP6 OPD | Escena, SVG, layout, export | `opd/*`, `test/opd.test.ts`, dorados | `vistaOpd`, `generarOpl` → `escena`, `svg`, exports | WP3 (escena), WP5 (documento) | topología de marcadores; dorados; export sin UI |
| WP7 Servidor | Almacén, rutas, cuenta, cliente | `servidor/{servidor,almacen,cuenta}.ts`, `app/api.ts`, `test/servidor.test.ts` | `codec` → API §8.1 | WP4 | `servidor.test` verde |
| WP8 UI | Estado, acciones, atajos, pantallas | `app/{estado,acciones,atajos}.ts`, `ui/*`, `test/acciones.test.ts` | todo → producto | WP2–WP7 (puede empezar con stubs y un modelo en memoria) | flujos §7 recorridos a mano; `acciones.test` |
| WP9 Migración y despliegue | Script PG, Docker, compose, deploy, respaldo | `servidor/migrar-postgres.ts`, `Dockerfile`, `docker-compose.yml`, `deploy/*`, `test/{migrar,deploy}.test.ts` | codec, servidor → imagen | WP4, WP7 | `docker build` ok; `migrar --simular` contra un `pg_dump` de prueba; `deploy.test` |
| WP10 E2E, rendimiento y cierre | Escenarios, perf, docs, registro | `e2e/*`, `test/rendimiento.test.ts`, `docs/*.md`, `README`, `AGENTS`, `NOTICE` | todo | WP8, WP9 | 14 e2e verdes; perf bajo umbrales; registro con 248 filas; sin `HANDOFF.md` |

Paralelismo e integración: tras WP0, en paralelo por agentes independientes: **{WP1→WP2→WP3}** (un agente, núcleo
en serie), **WP4** (contra stubs), **WP5a** tabla+parser (solo tipos), **WP7** (contra `codec` stub que acepta JSON),
**WP6a** geometría y marcadores (entradas sintéticas). Integración en este orden: WP3 → WP4 real → WP5b
(generador y editor) → WP6b (escena y export) → WP8 → WP9 → WP10. Cada integración exige `bun run check` verde; WP8 y
WP10 además `bun run e2e`.

---

## 13. Riesgos, sobresimplificación y mitigaciones

### 13.1 Riesgos

| Riesgo | Mitigación |
|---|---|
| Datos v0 que no se representan (multiplicidades rango, negaciones, probabilidades, carpetas, versiones, geometría de estados y vértices) | informe por modelo en migración e importación; originales y versiones preservados en `migracion/`; volumen PG retenido para rollback |
| Nombres existentes fuera del léxico o duplicados (probable en HODOM) bloquean export canónico | carga como errores recuperables con acción «Renombrar» que navega; JSON y OPL Markdown sin compuerta |
| Cambios visibles al abrir modelos viejos (enlaces antes ocultos que ahora se ven, estados reubicados, triángulos recalculados, OPL con superficie canónica distinta de la v0) | el informe los cuantifica; P-7 se justifica por ausencia de supresor canónico; la ruta de regreso (rollback) existe |
| Pérdida de consumidores externos (skill `mesa`, Bearer, headless, verify) | declarado en `docs/operacion.md`; intercambio por JSON v0 con los mismos nombres de campo |
| Métrica de texto aproximada | +10 % de margen y fuente incrustada en exports; dorados SVG |
| Rendimiento en modelos grandes | índices memoizados por `WeakMap`, escena por OPD (≤25 cosas), `rendimiento.test.ts` con umbrales |
| Integridad de archivos | escritura atómica con `fsync`, CAS por huella, papelera, respaldo diario, borrador local |
| Seguridad de la cuenta única | scrypt, cookie HMAC con secreto rotado al cambiar clave, `SameSite=Strict` + cabecera CSRF + `Origin`, límite de intentos, CSP sin `unsafe-eval` |
| La tabla de plantillas crece o diverge | es la única fuente para ambas direcciones; los tests exhaustivos por plantilla fallan ante cualquier desalineación |
| Reescritura grande en pocos cambios | WPs verticales con contratos congelados y gate por integración |

### 13.2 Distinciones que no se pierden (contra la sobresimplificación)

- Objeto ≠ proceso; esencia y afiliación en la cosa, no en la apariencia; perseverancia derivada.
- Apariencia ≠ cosa: «Quitar de este OPD» ≠ «Eliminar del modelo»; traer = nueva apariencia de la misma cosa.
- Interno ≠ externo, persistido, nunca decidido por geometría; mover no cambia alcance.
- Orden temporal = bandas declaradas; la Y solo lo realiza; paralelo = misma banda.
- T3 (efecto sin estado) ≠ TS3 ≠ TS4/TS5 standalone ≠ par escindido (procedencia persistida; sin control en mitades).
- Consumo/resultado/evento sistémico migran; efecto sin estado, agente e instrumento quedan en el contorno; evento
  ambiental puede cruzar.
- Agente (piruleta negra, sujeto `**A** maneja`) ≠ instrumento (piruleta blanca, `*P* requiere`); asimetría intacta.
- Evento ≠ condición ≠ sin control; a lo sumo uno; nunca en Post(P).
- XOR ≠ O ≠ AND (ausencia de abanico); convergente ≠ divergente; arco en el extremo común.
- Bidireccional con etiquetas distintas (SE3) ≠ recíproco (SE4/SE5); SSE sin estado solo en destino.
- Estados: inicial y final combinables (D10); por defecto y `Current` únicos; `Current` declarado ≠ runtime.
- Supresión global ≠ local; oculto ≠ borrado; anclado nunca oculto.
- Colección incompleta declarada ≠ vista parcial (ambas marcadas, solo la primera persistida).
- `unsupported-canonical` (canónico no ofrecido, warning) ≠ `non-canonical` (no canonizado, error) ≠ prohibido
  (impedido); silencio del canon no se vuelve prohibición.
- Texto canónico ≠ display (esencia, numeración, encabezados).
- Id persistente ≠ etiqueta `SDx.y`; nombre único ≠ id.
- Vista padre plegada ≠ hechos nuevos: la fusión no crea enlaces, R+C no se colapsa, R+R/C+C es error.
- Eliminar refinamiento ≠ recomposición canónica; solo hojas.
- Guardado aquí ≠ guardado en el servidor (indicador honesto); exportar ≠ validar (ningún gesto certifica).
