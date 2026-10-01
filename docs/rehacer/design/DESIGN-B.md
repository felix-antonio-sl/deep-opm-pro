# DESIGN-B — opforja rehecho: fluidez del experto

Arquitecto B · Lente B (fluidez del experto) · 2026-09-30.
Autoridad de alcance y semántica: `understand/CANON.md` (derivado de los 4 documentos del canon) y `DECISIONS.md` (fijas).
Referencia de portado: el código actual se consulta en el commit `8ada528` (`git show 8ada528:app/src/<ruta>`); nada se hereda por inercia.

Idea rectora: **un modelador experto construye con las manos en el teclado y los ojos en el diagrama; el OPL le responde en vivo como segunda mano; nada se interpone**. El producto es un núcleo OPM puro, dos proyecciones simétricas (OPD y OPL) calculadas desde una sola *vista por OPD*, un lienzo SVG propio de manipulación directa y un servidor mínimo de archivos. Todo lo que el canon no exige a la herramienta sale del repositorio.

---

## 1. Principios y alcance

### 1.1 Principios

1. **Un modelo, dos proyecciones, una vista.** `vista(m, opd)` es la única función que decide qué hechos se ven en un OPD (visibilidad derivada, abstracción del padre, R-VIS-HIJO-1). El renderizador y el generador OPL consumen la misma vista; la simetría OPD↔OPL es propiedad de construcción, no de disciplina (T-010, R-BI-0/1).
2. **Una sola definición por regla.** La matriz de validez (`nucleo/matriz.ts`) se codifica una vez y la consultan el menú de enlaces del lienzo, las operaciones del núcleo, el parser OPL y el importador v0 (T-011, T-040).
3. **Una sola API de mutación.** Toda edición (lienzo, ficha, OPL, importación normalizadora) pasa por operaciones puras `Modelo → Resultado<Cambio>` que validan antes de producir el modelo nuevo; no hay caminos paralelos (R-OPL-EDIT-8).
4. **Teclado primero, mano directa siempre.** Toda operación tiene atajo y comando en la paleta; crear, nombrar, anclar a estados, ordenar bandas y enlazar se hacen sobre el lienzo sin abrir diálogos.
5. **Foco estable.** Ninguna operación mueve la cámara salvo cambiar de OPD (R-OPD-LAY-10); la selección sobrevive a renombrar, refinar, deshacer y guardar.
6. **Nada nace sin nombre.** Cosa y estado se crean con el nombre que escribe el modelador (DR-11); cancelar la edición no crea nada.
7. **Honestidad epistémica en la superficie.** Rechazos con regla y acción canónica; ajustes automáticos trazados; pérdidas de importación listadas antes de confirmar; `unsupported-canonical` ≠ `non-canonical` ≠ error; ningún gesto se presenta como validación humana (T-254).
8. **Sustracción de chrome.** Sin barra de herramientas, sin cintas, sin pestañas internas, sin asistentes. Cuatro zonas estables y cuatro superficies transitorias (§7.1).
9. **Liviano de verdad.** ≈18 k líneas de fuente y ≈10 k de pruebas (hoy 133 k y 70 k); una dependencia de ejecución (Preact) más tres paquetes de fuentes; servidor sin dependencias.

### 1.2 Qué entra (CANON §0.1, completo)

| # | Capacidad exigida | Realización en este diseño |
|---|---|---|
| 1 | Modelo único de cosas, estados, enlaces, abanicos, OPDs y apariencias | `nucleo/tipos.ts` (§3) |
| 2 | Impedir lo prohibido, advertir lo condicionado o metodológico, con diagnósticos tipados | `nucleo/matriz.ts` + `nucleo/diagnostico.ts` (§4) |
| 3 | Generar OPL-ES canónico y parsear OPL-ES al mismo hecho | `opl/` con tabla bidireccional de plantillas (§5) |
| 4 | Renderizar el OPD con el vocabulario visual cerrado | `opd/` escena pura + SVG propio (§6) |
| 5 | Descomposición, despliegue, supresión de estados, con distribución/escisión e identidad persistente | `nucleo/operaciones/refinamiento.ts` (§4.6) |
| 6 | Exportar `canon-diagrama` y `canon-documento`; intercambiar `deep-opm-pro.modelo.v0` | `opd/exportar.ts`, `codec/` (§3.4, §6.9) |
| 7 | Registro de conformidad sin brecha silenciosa | `docs/conformidad.md` + prueba de completitud (§1.5) |
| infra | Una cuenta; listar, abrir, guardar, eliminar modelos; autosave; exportar | `server/` + `ui/Biblioteca.tsx` (§8) |
| infra | Deshacer/rehacer (costo trivial: instantáneas inmutables) | `ui/estado.ts` (§7) |

### 1.3 Qué no entra (CANON §0.4 + DECISIONS) y qué pasa con los datos v0 que lo usan

| Tema retirado | Motivo | Destino de los datos al importar v0 |
|---|---|---|
| Simulación, runtime, probabilidades `Pr`, `DecisionPolicy`, tasas, duración de estados, parámetros de simulación | §0.4 (no exigido) | `Enlace.probabilidad`, `tasa`, `unidadesTasa`, `Abanico.decision`, `Entidad.simulacion`, `Estado.duracion` → descartados, listados en el informe |
| Negación (`modificador: "no"`) | extensión emisión-only | el enlace negado **se descarta** (no se invierte ni se degrada) y se lista con su oración original |
| Demora de invocación | extensión | `demora` descartada, listada |
| Excepción combinada sub+sobretiempo | extensión (X) | se divide en dos enlaces de excepción (sobretiempo conserva el id) y se informa |
| Bocetos/OPD sueltos, Apunte/Taller/Graduar/Biblioteca/versiones de catálogo, carpetas | extensión declarada | OPD con `padreId:null` no raíz → descartado (sus hechos quedan; las cosas sin apariencia se diagnostican); `carpetaId`, `archivado`, `versiones`, `crearVersionAlGuardar` → descartados |
| Vistas (`vista.kind` generic/submodel/requirement), mapa, Bring | COND/PUEDE | OPD con `vista` → descartado como los Bocetos |
| Sub-modelos, composición, referencias externas, piezas, anclaje/drift/calco, estereotipos, requisitos | extensión | `submodelos`, `referenciaPadreSubmodelo`, `pieceLineage`, `anclaje`, `estereotipoId`, `estereotipos`, `requisito`, `satisfaccionesRequisito` → descartados |
| Capa computacional (alias, unidades en nombre, tipos de dato, rangos) | GAP-TIPO/VARIA | `alias`, `unidad`, `valorSlot.tipo` → descartados (el valor puntual se conserva como texto) |
| Semi-plegado, plegado, `ordered`, grupos estructurales manuales | sin generador | `modoPlegado`, `ordenPartes`, `parteExtraidaDe`, `orderedFundamentalTypes`, `grupoEstructuralId` → descartados |
| Estilado autoral, imágenes, URLs, layout de estados, puertos, vértices, posiciones de etiquetas y de símbolo | PUEDE / presentación | `imagen`, `urls`, `layoutEstados`, `Estado.x/y/width/height`, `ports`, `portId`, `vertices`, `labelPositions`, `symbolPos/Anchors`, `modoTamano` → descartados (conteo agregado en el informe) |
| Método humano (ficha de trabajo, lentes, ontología, pregunta guía, mesa, notas, anclas normativas, declaraciones no nucleares, familias por preestado, procedencia) | método / extensión | todos descartados y listados |
| Agente LLM, tutor, revisión compartida, lector portátil, captura de bugs, modo móvil de solo lectura, CLI `mesa`, carril Bearer, `render:headless`, `verify:reproducible` | DECISIONS | fuera del repositorio; el intercambio con clientes externos es por archivo `deep-opm-pro.modelo.v0` (Apéndice F) |
| Bilingüismo EN↔ES | condicionado | producto monolingüe es-CL |
| Descomposición de objeto | DR-23, diferida (DECISIONS) | OPD de descomposición de objeto → descartado con informe (sus hechos quedan) |
| Especialización XOR (RX1/RX2) | DR-10, diferida | parser responde `unsupported-canonical` |

### 1.4 Decisiones de producto de este diseño (DB-n)

Complementan las DR-n de CANON §10 (que se adoptan todas). Cada una es la opción más simple que no contradice un DEBE; todas quedan en `docs/decisiones.md`.

| DB | Decisión | Fundamento |
|---|---|---|
| DB-1 | Unicidad nominal por clave `nfc(nombre).toLocaleLowerCase('es-CL')` con espacios colapsados; acentos se conservan | T-024, AP-22; evita casi-duplicados sin inventar ontología |
| DB-2 | Orden del OPL dentro de un bloque: por nombre (colación es-CL) salvo subprocesos, que siguen sus bandas; empates por id | R-COMP-ELEG-3 solo exige determinismo; el orden por nombre es reproducible desde el OPL y garantiza R-§19-SIM-3 |
| DB-3 | SE3 (bidireccional) se reconstruye desde OPL como dos etiquetados unidireccionales; la distinción viaja en el JSON | el canon define SE3 como dos oraciones con la superficie de SE1; bisimetría parcial declarada (R-§19-ROT-1) |
| DB-4 | Un enlace migrado automáticamente al descomponer lleva `migracionAutomatica: true` y sigue la regla (consumo/TS4 → primer subproceso; resultado/TS5 → último; TS3 → par escindido si hay ≥2) mientras el modelador no lo reancle | R-OPD-EDIT-5, T-073..T-076; evita que el experto reancle a mano tras escribir sus subprocesos |
| DB-5 | R-ROL-UNIC-1 exceptúa consumo y resultado con ruta sobre el mismo par | R-VIS-RUTA-1 (con rutas, consumo y resultado se emparejan) |
| DB-6 | Al importar v0, un par consumo-desde-estado + resultado-a-estado sin ruta sobre el mismo (proceso, objeto) se fusiona en un TS3 | tabla 9.2 («flecha desde estado origen + flecha hacia estado destino» = TS3); preserva lo que v0 mostraba en OPL |
| DB-7 | Enlaces negados, OPDs sueltos, vistas y descomposiciones de objeto se descartan al importar, con informe previo a confirmar | fuera de alcance; brecha declarada, no silenciosa |
| DB-8 | Procedimentales rectos sin vértices; estructurales fundamentales en peine ortogonal automático; triángulo sin posición manual | R-OPD-LAY-4; elimina la maquinaria de puertos/vértices |
| DB-9 | Estados con disposición automática en filas al pie del objeto; reordenar = cambiar el orden del modelo | R-OPD-EST-1; elimina el «estado volador» |
| DB-10 | Reanclar extremos se permite en todos los tipos con la misma operación validada | R-OPD-EDIT-7 lo exige solo en estructurales; uniformar es más simple |
| DB-11 | «Eliminar refinamiento» borra el OPD hoja y las cosas que solo aparecen allí; por defecto conserva los enlaces de los internos abstrayéndolos al refinado (recomposición simple) | DR-17, R-HIJO-6 |
| DB-12 | Persistencia con CAS por `sha256` del JSON canónico; el servidor rechaza documentos que no sean punto fijo `exportar∘importar` | «persistencia confiable»; elimina contadores de revisión |
| DB-13 | Unidad de tiempo del modelo por defecto `sec`, editable | R-EXC-5 exige un default; v0 no lo tenía |
| DB-14 | Deshacer/rehacer por instantáneas inmutables, 300 niveles, por documento abierto | DECISIONS (costo trivial) |
| DB-15 | La duración de proceso sin excepción no tiene oración OPL (el canon no da plantilla): zona laxa declarada | R-BI-DUAL-1 vs ausencia de plantilla |
| DB-16 | Agente: bloqueo si el origen no es físico (DR-5) y aviso si su nombre contiene términos de máquina (`sistema`, `software`, `robot`, `sensor`, `máquina`, `servidor`, `app`, `plataforma`, `IA`) | AP-05 con proxy declarado |
| DB-17 | «Quitar de este OPD» se permite aunque la cosa quede sin apariencia; se diagnostica con acción «Traer a este OPD» | R-VIS-APP-1, método A8.2 |
| DB-18 | Toda descomposición de proceso con ≥1 subproceso tiene `bandas` explícitas (también con una sola banda); se exporta `ordenInzoom` completo | R-INV-2D (bandas = fuente de verdad) |
| DB-19 | Parches de producto adicionales al enum de R-OPL-EDIT-5: `ajustar-enlace`, `suprimir-estados`, `fijar-valor`, `crear-refinamiento`, `fijar-orden` | DR-35; mismos kernels validados |
| DB-20 | Métricas tipográficas por tabla de anchos (Inria Serif) para autosize determinista; la fuente se incrusta en los SVG/HTML exportados | AP-23 sin DOM; export fiel |

### 1.5 Registro de conformidad (R-CONF-7)

- **Documento único**: `docs/conformidad.md`, tabla con **una fila por requisito T-NNN** de `docs/especificacion.md` (copia de CANON.md), columnas: `T-ID · reglas (R-…) · estado (enforzado | parcial | no implementado | zona laxa pendiente) · superficies (UI, núcleo, import, OPL, export) · prueba que lo verifica · nota`. Estados de R-APP-2, superficies de R-APP-3.
- **Sin brecha silenciosa por construcción**: `app/src/conformidad.test.ts` (≈60 líneas) lee ambos documentos y falla si (a) un T-ID de la especificación no tiene exactamente una fila, (b) un estado no pertenece al enum de R-APP-2, (c) una fila `enforzado` no nombra un archivo de prueba existente, (d) una fila `no implementado` de una plantilla OPL no aparece en la lista de producciones `unsupported-canonical` del parser (`opl/plantillas.ts#NO_SOPORTADAS`). No verifica prosa: verifica estructura.
- **Visible en la app**: toda oración reconocida y no soportada produce `unsupported-canonical` con el T-ID en el mensaje; toda capacidad canónica no ofrecida aparece deshabilitada en la paleta con su motivo («Descomposición de objeto: diferida (DR-23)»).
- **Filas no implementadas o parciales al cierre** (declaradas desde el inicio): T-072 descomposición de objeto (no implementado); T-124/T-056 abanico×control sin plantilla literal (no implementado, `unsupported-canonical`); RX1/RX2 (no implementado); T-230 modo runtime (parcial: vacío declarado); T-086 R-VIS-HIJO-1 cláusula procedimental (parcial: desvío DR-13); duración sin OPL (zona laxa, DB-15); AP-14, AP-22, AP-25 (no detectables mecánicamente: zona laxa); exención del gate >25 por vista tipificada (no implementado: se bloquea todo OPD >25); T-094 (parcial: solo generales redundantes).

### 1.6 Regla de nombres en el código

- **Dominio en español del canon**, consistente con el formato v0 y CANON §1.2: `Entidad`, `Estado`, `Enlace`, `Abanico`, `Opd`, `Apariencia`, `crearEnlace`, `descomponer`, `vista`, `plantillas`, `diagnosticar`.
- **Plumbing sin equivalente de dominio en inglés estándar de plataforma** únicamente donde es API ajena (`fetch`, `Response`, `Bun.serve`, `h`, `useState`). Identificadores propios de infraestructura también en español (`almacen`, `sesion`, `camara`, `gestos`). Esto concilia DECISIONS («identificadores nuevos en inglés») con la instrucción posterior de usar el vocabulario del canon: se elige consistencia total en español porque el dominio es el 90 % del código y el formato v0 ya es español.

---

## 2. Arquitectura

### 2.1 Dirección de dependencias

```
nucleo ◀── codec ◀── server
  ▲  ▲        ▲
  │  └─ opl ◀─┼── opd
  │      ▲    │    ▲
  └──────┴────┴──── ui
```

- `nucleo` no importa nada del producto. `codec` y `opl` importan solo `nucleo`. `opd` importa `nucleo` y `opl` (el perfil `canon-documento` incluye el OPL de cada bloque). `ui` importa todo lo anterior. `server` importa solo `codec` (y transitivamente `nucleo`); nunca `opl`, `opd` ni `ui`. Nada importa `ui`.
- Verificación: `app/src/arquitectura.test.ts` (≈40 líneas) recorre los `import` de `src/**` con una expresión regular sobre el texto (sin escribir archivos) y falla ante una arista prohibida.

### 2.2 Árbol final del repositorio

Presupuestos en líneas de código (sin comentarios de cabecera ni blancos). `†` = portado con adaptación desde `8ada528` (ruta de origen entre paréntesis).

```
/
├── README.md                     qué es, cómo ejecutar, estructura, límites                         80
├── AGENTS.md                     contrato de trabajo (actualizado a la nueva estructura)           45
├── CLAUDE.md                     @AGENTS.md                                                          1
├── NOTICE.md                     separación de material; sin JointJS; sin evidencia OPCloud        25
├── Dockerfile                    2 etapas: build (bun+vite) → runtime bun-slim                     30
├── docker-compose.yml            1 servicio + 1 volumen + Traefik                                   35
├── .dockerignore / .gitignore                                                                   15/20
├── deploy/
│   ├── deploy.sh                 único circuito: build, up --wait, salud, versión, 401              45
│   ├── respaldo.sh               tar.gz diario del volumen de datos, retención 14 d                 25
│   └── systemd/opforja-respaldo.{service,timer}                                                    20
├── docs/
│   ├── README.md                 índice de 1 pantalla                                               30
│   ├── uso.md                    guía de uso: flujos y atajos                                      300
│   ├── arquitectura.md           módulos, dependencias, contratos (v0, HTTP), rendimiento          200
│   ├── operacion.md              despliegue, cuenta, respaldo, papelera, migración, rollback      180
│   ├── decisiones.md             DR-n del canon + DB-n de este diseño                             150
│   ├── conformidad.md            registro R-CONF-7 (una fila por T-NNN)                            300
│   ├── especificacion.md         CANON.md tal cual (derivado del canon)                           2238
│   └── canon/
│       ├── README.md             versiones, precedencia (reglas > spec-OPD/OPL > método)            25
│       ├── reglas-opm-estrictas-es.md       (1.5.0, tal cual)
│       ├── spec-forja-opd-es.md             (1.4.0, tal cual)
│       ├── spec-forja-opl-es.md             (1.4.1, tal cual)
│       └── metodologia-forja-opm-es.md      (1.7.0, tal cual)
└── app/
    ├── package.json  tsconfig.json  vite.config.ts  index.html  playwright.config.ts  bun.lock
    ├── bunfig.toml               minimumReleaseAge (endurecimiento de instalación, se conserva)        6
    ├── public/favicon.svg
    ├── scripts/
    │   ├── deploy.test.ts        circuito deploy.sh con stubs (portado)                                   95
    │   ├── metricas.ts           mide anchos de Inria Serif en Chromium → opd/metricas-inria.json         50
    │   ├── golden.ts             reescribe fixtures/golden/*.svg                                          30
    │   └── atajos-doc.ts         genera la tabla de atajos de docs/uso.md desde ui/comandos.ts           40
    ├── fixtures/
    │   ├── v0/*.json             6 modelos demo (movidos desde /fixtures/demo-models)
    │   ├── v0/legado/*.json      casos sintéticos de codificaciones legacy (extremo string, refinamiento
    │   │                         único, par escindido, derivados, O/XOR, puertoEntidadId, negados…)
    │   ├── opl/*.opl             textos OPL canónicos de referencia (incl. puente-vecinal, lumbre-reservas)
    │   ├── golden/*.svg          una construcción visual por archivo (§10.5)
    │   ├── modelos.ts            constructores de modelos canónicos de prueba (uno por fila de tabla 9.2)  350
    │   └── azar.ts               generador determinista de modelos válidos por semilla                     220
    ├── e2e/                      24 escenarios Playwright + ayudas                                        2000
    └── src/
        ├── conformidad.test.ts   completitud del registro                                                 60
        ├── arquitectura.test.ts  dirección de dependencias                                               40
        ├── nucleo/
        │   ├── tipos.ts          tipos exactos del modelo (§3.1)                                         220
        │   ├── resultado.ts      Resultado, Rechazo, Ajuste, Cambio                                       40
        │   ├── ids.ts            asignador único `prefijo-n`                                              50
        │   ├── nombres.ts        léxico EBNF de cosa/estado/etiqueta, clave DB-1, normalización visible  90
        │   ├── indice.ts         índices derivados memoizados (WeakMap por Modelo)                       200
        │   ├── herencia.ts       cadena de generales (DR-43)                                              60
        │   ├── matriz.ts         tabla de validez + validarEnlace + tiposPosibles + validarAbanico     420  † (modelo/operaciones/helpers.ts validarFirmaEnlace; operaciones/enlaces.ts validarUnicidadRolPar)
        │   ├── etiquetas.ts      SDx.y por preorden                                                       50
        │   ├── vista.ts          proyección por OPD: visibilidad, abstracción por fuerza, R-VIS-HIJO-1 380
        │   ├── diagnostico.ts    registro de ~32 reglas con severidad/familia/acción                     520
        │   └── operaciones/
        │       ├── modelo.ts     crearModelo, renombrarModelo, fijarUnidadTiempo                          60
        │       ├── cosas.ts      crear, renombrar, esencia, afiliación, género, descripción, valor,
        │       │                 duración, cambiar tipo, eliminar                                        300
        │       ├── estados.ts    crear, renombrar, reordenar, designar, suprimir, eliminar               220
        │       ├── enlaces.ts    crear, reanclar, cambiar tipo, estados, control, etiquetas, ruta,
        │       │                 multiplicidad, eliminar                                                 380
        │       ├── abanicos.ts   formar, cambiar operador, disolver                                      150
        │       ├── apariencias.ts traer, quitar, mover (rebote), redimensionar, pegar                   220
        │       └── refinamiento.ts descomponer, desplegar, bandas, migración, escisión, eliminar       520  † (agruparSubprocesosParalelos de modelo/operaciones/refinamiento/helpers.ts)
        ├── codec/
        │   ├── v0.ts             forma de entrada/salida v0 y conversiones de enums                     120
        │   ├── importar.ts       normalización de todas las codificaciones + informe + rechazo         650  † (serializacion/validar*.ts, persistencia/documentMigration.ts collectUnrepresented)
        │   ├── exportar.ts       forma exacta emitida, determinista                                      230
        │   └── canonico.ts       orden natural de ids, stringify, sha256                                  40
        ├── opl/
        │   ├── tokens.ts         Ref, TokenOpl, LineaOpl (CANON §4.11)                                    60  † (opl/interaccion.ts)
        │   ├── vocabulario.ts    palabras fijas, unidades es-CL, y/e o/u, artículos, frases de multiplicidad 120
        │   ├── plantillas.ts     tabla bidireccional (~95 plantillas) + DSL + NO_SOPORTADAS             700
        │   ├── generar.ts        vista → líneas por OPD, orden DB-2, display (esencia, numeración)      520
        │   ├── texto.ts          normalización, tokenización tipográfica, listas, esqueleto             180
        │   ├── reconocer.ts      comparador DSL + reconocedores especiales (bandas, abanicos, CX3)      380  † (parser/planificar.ts planificarOrdenInzoom/parsearBandasOrden)
        │   ├── planificar.ts     Hecho → parches; sin-cambio por pertenencia a la vista                 380
        │   ├── aplicar.ts        fases, profundidad, resolución de nombres, todo-o-nada                  300
        │   └── editor.ts         4 estados de línea, 8 razones, resumen, rótulo del botón               180  † (opl/clasificadorEdicion.ts)
        ├── opd/
        │   ├── tokens.ts         paleta §18.1, trazos, dashes, radios, tipografía                         60
        │   ├── metricas.ts       anchos por carácter (+ metricas-inria.json), envoltura de rótulos       90
        │   ├── geometria.ts      recortes, polilíneas, intersecciones, puntos a lo largo, arcos         260  † (abanicoOverlay.ts puntoDockEnPuerto/angulosExtremos/describeArc)
        │   ├── layout.ts         posición libre, externos, bandas, despliegue, estados, autosize       330  † (composers/estados.ts)
        │   ├── escena.ts         vista → escena geométrica (nodos, trazos, símbolos, arcos, rótulos)   620  † (autoinvocacionLoop.ts, agregacionBus.ts separarCentroSimboloEstructural)
        │   ├── marcadores.ts     paths literales del canon §18.3                                         140  † (linkAssets.ts, composers/markers.ts)
        │   ├── dibujar.ts        escena → árbol VNode SVG (sin estado, sin hooks)                        420
        │   ├── svgTexto.ts       VNode → texto SVG (export y pruebas)                                     60
        │   ├── exportar.ts       canon-diagrama, canon-documento, OPL md, gates                          200
        │   └── calidad.ts        cruces, oclusión, solapes, densidad                                     140
        ├── ui/
        │   ├── main.tsx          arranque, fuentes, montaje                                               40
        │   ├── almacen.ts        almacén mínimo (get/set/subscribe) + hook `usar`                          70
        │   ├── estado.ts         EstadoApp, ejecutar(op), deshacer/rehacer, navegar, selección         280
        │   ├── comandos.ts       registro único de ~95 comandos (paleta, menú, atajos, ficha)           520
        │   ├── atajos.ts         despacho de teclado por contexto                                        140  † (ui/atajosTeclado.ts)
        │   ├── rutas.ts          hash router `#/`, `#/m/<id>/<opdId>`                                      60
        │   ├── api.ts            cliente HTTP                                                             120
        │   ├── persistencia.ts   autosave con CAS, borrador IndexedDB, conflicto, sesión expirada      220
        │   ├── App.tsx           disposición escritorio / estrecho                                       160
        │   ├── Cabecera.tsx      marca, nombre del modelo, ruta OPD, estado de guardado, ⌘K             120
        │   ├── Login.tsx         pantalla y diálogo de reingreso                                          90
        │   ├── Biblioteca.tsx    lista, búsqueda, nuevo, abrir, importar, eliminar                       260
        │   ├── Dialogo.tsx       diálogo genérico (confirmar / elegir / informe)                         150  † (ui/Dialogo.tsx)
        │   ├── Paleta.tsx        comandos y modo «cosas»                                                 220  † (búsqueda de CommandPalette.tsx)
        │   ├── MenuContextual.tsx comandos filtrados por el elemento                                     110
        │   ├── MenuEnlace.tsx    tipos válidos por matriz + vista previa OPL                             220
        │   ├── lienzo/
        │   │   ├── Lienzo.tsx    SVG de la escena + cámara + delegación de eventos                       380
        │   │   ├── gestos.ts     máquina de estados de puntero                                           560
        │   │   ├── capaUi.tsx    selección, asas, hover, fantasma de enlace, guías (canal UI)           200
        │   │   ├── EditorNombre.tsx creación/renombrado en línea con léxico y colisión                  200
        │   │   └── camara.ts     zoom al cursor, pan, centrado de bbox                                    80
        │   ├── PanelOpl.tsx      lectura: bloques, tokens, hover/clic, delta, filtro, numeración       300
        │   ├── EditorOpl.tsx     edición: textarea, canaleta de estados, resumen, Aplicar N              220
        │   ├── Arbol.tsx         árbol OPD con teclado                                                    160
        │   ├── Ficha.tsx         propiedades de cosa/estado/enlace/triángulo/abanico/OPD/modelo         520
        │   ├── Diagnostico.tsx   hallazgos por severidad, F8, acción canónica                            160
        │   ├── BarraEstado.tsx   línea de mensajes del lienzo, zoom                                        60
        │   └── estilos.css       variables de tokens y clases                                            600
        └── server/
            ├── main.ts           Bun.serve: estáticos + API + salud                                       90
            ├── http.ts           rutas, CSRF, límites, errores                                           260
            ├── sesion.ts         scrypt, cookie HMAC, límite de intentos                                 160  † (server/passwordHash.ts, persistenceSession.ts)
            ├── almacen.ts        archivos, escritura atómica, CAS, papelera, historial, índice          260
            ├── cuenta.ts         CLI crear/reset/revocar                                                   90  † (scripts/auth-cuenta.ts)
            └── migrar-postgres.ts migración única desde PostgreSQL (Bun.SQL)                            260
```

Las pruebas unitarias viven junto a su módulo (`*.test.ts`); `bun test src` las recoge todas.

### 2.3 Totales estimados

| Área | Fuente | Pruebas |
|---|---:|---:|
| nucleo | 3 880 | 2 900 |
| codec | 1 040 | 750 |
| opl | 2 820 | 2 000 |
| opd | 2 320 | 900 |
| ui | 6 640 | 300 |
| server | 1 120 | 500 |
| fixtures (constructores, azar) | — | 570 |
| e2e | — | 2 000 |
| gobierno (conformidad, arquitectura) | — | 100 |
| **Total** | **≈17 800** | **≈10 000** |

Dependencias de ejecución: `preact`, `@fontsource/inria-serif`, `@fontsource/inria-sans`, `@fontsource-variable/jetbrains-mono`. Desarrollo: `typescript`, `vite`, `@preact/preset-vite`, `@types/bun`, `@playwright/test` fijado a `1.56.1` (Chromium 1194 disponible en `/opt/pw-browsers`). Se retiran `jointjs`, `zustand`, `ai`, `@ai-sdk/*`, `eslint` y plugins (la frontera de capas la cubre `arquitectura.test.ts`; `tsc` estricto cubre el resto).

### 2.4 Rendimiento objetivo (modelo HODOM: 262 cosas, 192 estados, 433 enlaces, 36 OPDs)

| Operación | Objetivo | Cómo |
|---|---|---|
| operación del núcleo (incluida validación) | < 2 ms | registros inmutables, índice memoizado por referencia de `Modelo` |
| `vista` de un OPD | < 3 ms | un recorrido de enlaces con elevación por mapa `internoDe` |
| escena + render de un OPD (≤25 cosas) | < 4 ms por cuadro | escena pura; Preact difunde solo lo cambiado |
| OPL completo (36 bloques) | < 25 ms | memo por `Modelo`; el panel re-renderiza solo bloques cambiados |
| diagnóstico completo | < 30 ms en tiempo ocioso | `requestIdleCallback` tras cada cambio |
| importar v0 | < 250 ms | una pasada por colección |
| clasificación del editor OPL (1 000 líneas) | < 60 ms, con retardo de 150 ms | ensayo sobre copia (§5.6) |

Las metas se verifican con una prueba de humo de rendimiento sobre un modelo sintético de ese tamaño (`fixtures/azar.ts`, semilla fija) que falla si se excede 3× el objetivo.

---

## 3. Modelo de datos interno

### 3.1 Tipos TypeScript exactos (`nucleo/tipos.ts`)

```ts
export type Id = string;

export type TipoCosa = 'objeto' | 'proceso';
export type Esencia = 'fisica' | 'informacional';
export type Afiliacion = 'sistemica' | 'ambiental';
export type UnidadTiempo = 'ms' | 'sec' | 'min' | 'hour' | 'day' | 'week' | 'month' | 'year';
export type ModoDespliegue = 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion';
export type RelacionIncompleta = 'agregacion' | 'exhibicion' | 'generalizacion';

export type TipoEnlace =
  | 'consumo' | 'resultado' | 'efecto'
  | 'agente' | 'instrumento'
  | 'invocacion'
  | 'excepcionSobretiempo' | 'excepcionSubtiempo'
  | 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion'
  | 'etiquetado' | 'etiquetadoBidireccional' | 'reciproco';

export type Familia = 'transformadora' | 'habilitadora' | 'invocacion' | 'excepcion' | 'estructural' | 'etiquetada';
export type Multiplicidad = '?' | '*' | '+';          // ausente = 1..1
export type Control = 'e' | 'c';                     // a lo sumo uno (campo escalar)

export interface Modelo {
  id: Id;
  nombre: string;
  descripcion?: string;
  unidadTiempo: UnidadTiempo;                        // default 'sec' (DB-13)
  opdRaizId: Id;
  nextSeq: number;                                   // asignador de ids (§3.5)
  entidades: Record<Id, Entidad>;
  estados: Record<Id, Estado>;
  enlaces: Record<Id, Enlace>;
  abanicos: Record<Id, Abanico>;
  opds: Record<Id, Opd>;
}

export interface Entidad {
  id: Id;
  tipo: TipoCosa;                                    // perseverancia derivada (DR-3)
  nombre: string;                                    // único por clave DB-1; léxico EBNF
  esencia: Esencia;                                  // default 'informacional'
  afiliacion: Afiliacion;                            // default 'sistemica'
  genero?: 'f';                                      // ausente = masculino (R-OPL-1)
  descripcion?: string;                              // meta: no emite OPL
  valorSlot?: string;                                // solo objeto exhibido: «**A** de **X** es v.»
  duracion?: Duracion;                               // solo proceso
  coleccionIncompleta?: RelacionIncompleta[];        // nunca 'clasificacion'
  refinamientos?: {
    descomposicion?: { opdId: Id };                  // solo proceso (DR-23)
    despliegue?: { opdId: Id; modo: ModoDespliegue };
  };
}

export interface Duracion { min?: number; esperada?: number; max?: number; unidad?: UnidadTiempo } // > 0

export interface Estado {
  id: Id;
  entidadId: Id;                                     // objeto
  nombre: string;                                    // una palabra, inicial minúscula
  orden: number;                                     // 0..n-1 denso por objeto
  inicial?: true;
  final?: true;
  porDefecto?: true;                                 // ≤1 por objeto
  current?: true;                                    // declarado; ≤1 por objeto
  suprimido?: true;                                  // supresión global
}

export interface Enlace {
  id: Id;
  tipo: TipoEnlace;
  origenId: Id;                                      // siempre cosas; dirección canónica §4.3
  destinoId: Id;
  // procedimentales (objeto ↔ proceso): estado del extremo objeto
  estadoEntradaId?: Id;                              // precondición: consumo, agente, instrumento, efecto (de)
  estadoSalidaId?: Id;                               // poscondición: resultado, efecto (a)
  // estructurales y etiquetados: estado por extremo
  estadoOrigenId?: Id;
  estadoDestinoId?: Id;
  control?: Control;
  etiqueta?: string;                                 // etiquetados: etiqueta (uni/recíproco) o etiqueta-f (bi)
  etiquetaInversa?: string;                          // etiquetadoBidireccional: etiqueta-b
  ruta?: string;                                     // solo consumo/resultado (DR-19)
  multiplicidadOrigen?: Multiplicidad;
  multiplicidadDestino?: Multiplicidad;
  escision?: { parId: Id; mitad: 'entrada' | 'salida' };   // procedencia R-ESCIND-0
  migracionAutomatica?: true;                        // DB-4
}

export interface Abanico {                           // AND = sin abanico
  id: Id;
  operador: 'XOR' | 'OR';
  enlaceIds: Id[];                                   // n ≥ 2, mismo tipo, extremo común (derivado)
}

export interface Opd {
  id: Id;
  padreId: Id | null;                                // null solo en la raíz
  orden: number;                                     // entre hermanos (DR-4)
  apariencias: Record<Id, Apariencia>;               // CLAVE = entidadId (≤1 por cosa y OPD, DR-25)
  bandas?: Id[][];                                   // solo descomposición de proceso: subprocesos por banda
}

export interface Apariencia {
  id: Id;                                            // identidad para el formato v0
  x: number; y: number;                              // esquina superior izquierda, px de lienzo
  ancho: number; alto: number;                       // tamaño mínimo persistido; el render puede crecer (autosize)
  interno?: true;                                    // alcance persistido (método A3.3); solo en OPD de descomposición
  estadosSuprimidos?: Id[];                          // supresión local (LF-03)
}
```

Invariantes (verificados por `nucleo/invariantes.test.ts` tras cada operación en las pruebas de propiedad):

1. El OPD de un refinamiento es hijo del OPD donde la cosa aparece al refinarse; su padre contiene una apariencia de la cosa refinada; el OPD hijo también (contenedor en descomposición, refinable en despliegue).
2. Todo OPD no raíz es destino de exactamente un `refinamientos.*.opdId` (no hay Bocetos).
3. En un OPD de descomposición de P: el conjunto de ids en `bandas` = { procesos con `interno` }; ningún id repetido; la apariencia de P no es `interno`.
4. `estadoEntradaId/estadoSalidaId` solo en procedimentales y pertenecen al objeto del extremo objeto; `estadoOrigenId/estadoDestinoId` solo en estructurales/etiquetados y pertenecen al extremo correspondiente.
5. `escision.parId` apunta a un efecto sobre el mismo objeto cuyo `escision` apunta de vuelta con la mitad opuesta.
6. Un enlace pertenece a lo sumo a un abanico.
7. Nombres únicos por clave DB-1 (el importador puede cargar duplicados como error recuperable, §3.3).
8. `Estado.orden` denso por objeto; ≤1 `porDefecto` y ≤1 `current` por objeto.

### 3.2 Por qué esta forma

- **Records por id** como v0 (DECISIONS): el códec es casi una identidad de nombres.
- **Extremos siempre son cosas**; el anclaje a estado es un campo del enlace. Los procedimentales usan **pre/poscondición** (`estadoEntradaId`, `estadoSalidaId`), lo que unifica TS1..TS5, HS1/HS2, eventos «en `s`» y AP-04 (salida ≠ inicial) en dos campos. Los estructurales usan estado por extremo. Una sola codificación del cambio de estado: TS3 = efecto con entrada y salida; TS4/TS5 = efecto con una sola; la mitad escindida se distingue por `escision`.
- **Apariencias indexadas por cosa dentro del OPD**: consulta O(1) de «¿aparece X aquí?».
- **Sin geometría en la semántica**: sin puertos, vértices ni posiciones de estados. La única geometría persistida son cajas de apariencia.
- **Sin duplicación**: el vínculo OPD→cosa refinada se deriva de `Entidad.refinamientos` (índice), no se guarda en el OPD; el nombre del OPD se deriva (`SDx.y`); el extremo común del abanico se deriva de sus ramas.

### 3.3 Códec `deep-opm-pro.modelo.v0`: importación

`importarV0(texto: string): ResultadoImportacion` es pura, total (nunca lanza) y produce `{ ok: true; modelo; informe } | { ok: false; rechazo; informe }`.

```ts
interface InformeImportacion {
  noRepresentados: Array<{ ruta: string; motivo: string }>;          // p.ej. 'enlaces.e-19.probabilidad'
  descartados: Array<{ clase: 'opd' | 'enlace' | 'apariencia' | 'abanico'; id: Id; motivo: string; opl?: string }>;
  normalizaciones: Array<{ mensaje: string; refs: Ref[] }>;          // fusiones, migraciones, derivaciones
  presentacion: { vertices: number; puertos: number; etiquetasPosicionadas: number; geometriaEstados: number };
  diagnosticos: Hallazgo[];                                          // errores recuperables que se cargan
}
interface Rechazo { codigo: 'json-invalido' | 'formato-desconocido' | 'estructura-invalida' | 'referencia-rota'; ruta: string; mensaje: string }
```

**Pasos (en orden, una sola pasada por colección):**

1. `JSON.parse`; fallo → `json-invalido`. `formato !== 'deep-opm-pro.modelo.v0'` → `formato-desconocido`. Se acepta también un *record* persistido de v0 `{json: string, …}` (se desenvuelve y lo demás se informa como no representado).
2. **Colecciones**: `entidades`, `estados`, `enlaces`, `opds`, `abanicos` como `Record` o como arreglo (bundles externos del Apéndice F); ausentes → vacías (`estados`, `abanicos`); ausentes obligatorias (`entidades`, `opds`) → `estructura-invalida`. Las claves de un Record que difieren del `id` interno → `estructura-invalida`.
3. **Campos de nivel modelo**: `id` se conserva en el informe y se **reemplaza** por un id nuevo (`m-` + UUID) al importar desde la biblioteca (una importación es una copia; en la migración se conserva, §8.8); `nombre`, `descripcion`, `opdRaizId` (debe existir), `nextSeq` → `max(nextSeq, 1 + mayor sufijo numérico de todos los ids)`. Todo campo del catálogo de §1.3 → no representado. Clave desconocida → no representado («campo desconocido»).
4. **Entidades**: `tipo`, `nombre`, `esencia`, `afiliacion` obligatorios (valor fuera de enum → `estructura-invalida`). `esAtributo` se ignora sin informar (derivable). `valorSlot {tipo, placeholder, valor?}` → `valorSlot = String(valor)` si hay valor; `tipo` → no representado. `refinamientos` y el legado `refinamiento` (forma única previa) → `refinamientos`; `descomposicion.modo` se ignora; `despliegue.modo` ausente → `'agregacion'` (normalización informada). Descomposición de un **objeto** → se descarta el refinamiento y su subárbol de OPDs (DB-7). Campos propios del nuevo formato (`genero`, `duracion`, `coleccionIncompleta`) se aceptan si están bien formados. Cualquier otro campo de entidad (`alias`, `unidad`, `estereotipo` legado, `estereotipoId`, `anclaje`, `requisito`, `urls`, `imagen`, `layoutEstados`, `lineal`, `orderedFundamentalTypes`, `simulacion`) → no representado.
5. **Estados**: `entidadId` debe existir (`referencia-rota`) y ser objeto (`estructura-invalida`). Designaciones: `esInicial`, `esFinal`, `designaciones ∋ 'inicial'|'final'|'default'|'current'` → banderas. `orden` explícito; si falta, por sufijo numérico del id y luego por clave; se densifica por objeto. ≥2 `porDefecto` o `current` en un objeto → se conserva el primero por orden y se informa. Nombres repetidos en un objeto → error recuperable `ESTADO_DUPLICADO`. `duracion`, `x/y/width/height` → no representado / presentación.
6. **Extremos de enlace**: `origenId`/`destinoId` como `string` (legado) o `{kind, id, portId?}`. `kind:'estado'` → extremo = `entidadId` del estado y el estado pasa al campo según tipo: consumo/agente/instrumento origen-estado → `estadoEntradaId`; resultado destino-estado → `estadoSalidaId`; efecto origen-estado → entrada (y el proceso pasa a ser el origen canónico), efecto destino-estado → salida; estructurales/etiquetados → `estadoOrigenId`/`estadoDestinoId`. `portId` → presentación. Referencia a cosa o estado inexistente → `referencia-rota`.
7. **Dirección canónica** (§4.3): efecto `objeto→proceso` se invierte a `proceso→objeto`; cualquier otro tipo con dirección opuesta a la canónica y firma invertible (p.ej. consumo `proceso→objeto`) se invierte e informa; firma no reconocible → se carga y se marca `ENLACE_INVALIDO`.
8. **Atributos del enlace**: `modificador` `'evento'|'condicion'` → `control` (`subtipoModificador` se ignora si es coherente; si contradice, gana `modificador` y se informa); `modificador:'no'` → **enlace descartado** con su oración v0 en el informe (DB-7). `etiqueta` → etiquetas en etiquetados; en otros tipos no vacía → no representada. `backwardTag` → `etiquetaInversa` (solo bidireccional). `rutaEtiqueta` → `ruta` en consumo/resultado; en otros tipos → no representada (DR-19). Multiplicidad: `'?'|'0..1'` → `?`; `'*'|'0..*'|'0..N'` → `*`; `'+'|'1..*'|'1..N'` → `+`; `'1'|'1..1'` → ausente; cualquier otra (`N`, `2`, `2..*`, `1..5`) → no representada (DR-21); en extremo proceso o en el todo de agregación → no representada (DR-44). `tiempoMaximo/unidadTiempoMaximo` de un sobretiempo → `duracion.max`/`unidad` del proceso fuente si no tiene una (si difiere de la existente, gana la existente y se informa); ídem `tiempoMinimo` → `duracion.min`. Unidades v0 `ms|s|min|h|dia|sem|mes|año` → `ms|sec|min|hour|day|week|month|year`. `excepcionSubSobretiempo` → dos enlaces (el sobretiempo conserva el id; el subtiempo recibe id nuevo), informado. `probabilidad`, `demora`, `tasa`, `unidadesTasa`, `requisitos`, `mostrarRequisitos`, `grupoEstructuralId` → no representados / presentación.
9. **Efecto escindido v0** (`efectoEscindido {grupoId, enlacePadreId, rol, modo}`): `modo:'par'` → busca la otra mitad por `grupoId`; si existe → `escision {parId, mitad: rol}` en ambas; si falta → mitad standalone e informe. `modo:'standalone'` o ausente → sin `escision`. Efecto compacto con una sola de `estadoEntradaId/estadoSalidaId` → TS4/TS5 standalone.
10. **Etiquetados**: `etiquetadoBidireccional` con `backwardTag` vacío/ausente o igual a `etiqueta` → `reciproco` (R-STRE-1), informado solo si había dos etiquetas iguales.
11. **Fusión TS3 (DB-6)**: por cada par (P, O) con exactamente un consumo con `estadoEntradaId` y un resultado con `estadoSalidaId`, ambos sin ruta, sin control en el resultado, fuera de abanicos → un efecto TS3 con el id del consumo, el control del consumo y ambos estados; el resultado se descarta con normalización informada.
12. **Derivados de refinamiento** (`derivado: {tipo:'enlace-externo-refinamiento', refinamientoId, enlacePadreId, origen}`): `enlacePadreId` inexistente → `referencia-rota`. Por cada padre E con derivados:
    - E consumo, resultado, TS4/TS5, o con `control:'e'` desde objeto sistémico: si hay un derivado cuyo extremo proceso es subproceso del refinado → E se **reancla** a ese subproceso conservando `E.id`; `origen:'automatico'` → `migracionAutomatica: true`; `origen:'manual'` → sin bandera; los demás derivados se descartan.
    - E TS3 con ≥2 subprocesos → se aplica la escisión de §4.6.4 (TS4 al primero, TS5 al último, automática).
    - E agente, instrumento, efecto sin estado, invocación, excepción, estructural → los derivados se descartan (lectura distributiva sobre el contorno, DR-13).
    - Abanicos cuyas ramas son derivados → descartados. Todo esto como normalizaciones (conteo agregado por refinado).
13. **Contorno canónico**: tras 12, cualquier consumo, resultado, TS4/TS5, TS3 o evento de objeto sistémico todavía anclado al contorno de un proceso descompuesto con ≥1 subproceso se migra con la regla de §4.6.3 (normalización informada).
14. **OPDs**: raíz = `opdRaizId`; `padreId` ausente en no raíz → raíz (legado); `padreId` inexistente o ciclo → `referencia-rota`. OPD suelto (`padreId:null` no raíz) o con `vista` → descartado con su subárbol (DB-7). OPD no raíz que no es destino de ningún refinamiento → descartado. `nombre` se descarta si coincide con la etiqueta derivada; si difiere → no representado («nombre de OPD»). `ordenLocal` → `orden` (si todos los hermanos lo tienen; si no, por sufijo numérico del id); se densifica. `preguntaGuia` → no representado. `enlaces` (apariencias de enlace) → presentación (la visibilidad se deriva).
15. **Apariencias**: clave del Record = id de apariencia; `entidadId` debe existir (`referencia-rota`); `opdId` distinto del OPD contenedor → `estructura-invalida`. Segunda apariencia de la misma cosa en el mismo OPD → descartada (DR-25). `width/height` → `ancho/alto` (mínimo 1). `contextoRefinamiento.rol` `'interno'` → `interno: true`; `'externo'|'contorno'` → nada. En OPD de descomposición sin `contextoRefinamiento`: interno ⇔ el centro de su caja cae dentro de la caja del contenedor **y** la cosa no aparece en el OPD padre (normalización informada). `estadosSuprimidos` filtrados a estados del objeto.
16. **Bandas**: en OPD de descomposición de P, `ordenInzoom` presente → se conserva filtrado a procesos internos; internos ausentes se añaden como bandas nuevas según su Y; `ordenInzoom` ausente → bandas derivadas de la geometría con `agruparSubprocesosParalelos` (tolerancia 4 px, portado). Si la geometría contradice las bandas, se ejecuta `realizarBandas` (§6.5) y se informa «posiciones de subprocesos ajustadas a su orden declarado».
17. **Abanicos**: `operador` `'O'` → `'OR'`, `'XOR'` → `'XOR'`; `enlaceIds` inexistentes → `referencia-rota`; ramas descartadas en pasos previos se quitan; <2 ramas → abanico descartado; `opdId`, `puertoComun`, `puertoEntidadId`, `decision` → presentación / no representado. El abanico debe pasar `validarAbanico`; si no → descartado con motivo.
18. **Validación final**: cada enlace por `validarEnlace` en modo diagnóstico; un fallo **no rechaza**: carga el enlace y agrega `ENLACE_INVALIDO` (error estructural recuperable, R-ESC-OP-4, bloquea export canónico). Nombres fuera del léxico → `NOMBRE_FUERA_DE_LEXICO`; duplicados por clave DB-1 → `NOMBRE_DUPLICADO` (ambos errores recuperables; nunca se renombra en silencio).

La interfaz presenta el informe **antes** de crear el modelo (§7.3.2): rechazo con ruta y motivo, o resumen con grupos plegables y botón «Importar».

### 3.4 Códec: exportación

`exportarV0(m: Modelo): string` es pura, determinista y emite siempre la misma forma:

- Texto `JSON.stringify(documento, null, 2) + '\n'`, UTF-8, sin BOM.
- Records ordenados por **orden natural de id** (prefijo alfabético, luego sufijo numérico, luego resto lexicográfico); claves de cada objeto en el orden fijo que sigue.
- Opcionales ausentes se omiten (nunca `null`, `false` ni `[]` vacíos).

```jsonc
{
  "formato": "deep-opm-pro.modelo.v0",
  "modelo": {
    "id", "nombre", "descripcion"?, "unidadTiempo", "opdRaizId", "nextSeq",
    "entidades": { "<id>": { "id", "tipo", "nombre", "esencia", "afiliacion", "genero"?, "descripcion"?,
        "valorSlot"?: { "tipo": "string", "placeholder": "value", "valor" },
        "duracion"?: { "min"?, "esperada"?, "max"?, "unidad"? },
        "coleccionIncompleta"?: [...],                       // orden: agregacion, exhibicion, generalizacion
        "refinamientos"?: { "descomposicion"?: { "opdId" }, "despliegue"?: { "opdId", "modo" } } } },
    "estados": { "<id>": { "id", "entidadId", "nombre", "orden", "esInicial"?: true, "esFinal"?: true,
        "designaciones"?: ["default"?, "current"?], "suprimido"?: true } },
    "enlaces": { "<id>": { "id", "tipo", "origenId": { "kind", "id", "portId"? }, "destinoId": { ... },
        "etiqueta": "<string, vacío si no hay>", "backwardTag"?, "modificador"?: "evento"|"condicion",
        "rutaEtiqueta"?, "multiplicidadOrigen"?, "multiplicidadDestino"?,
        "estadoEntradaId"?, "estadoSalidaId"?,                // solo TS3 compacto
        "efectoEscindido"?: { "grupoId", "enlacePadreId", "rol", "modo" },
        "migracionAutomatica"?: true } },
    "abanicos": { "<id>": { "id", "opdId", "puertoComun": { "entidadId", "lado", "portId" },
        "puertoEntidadId", "operador": "O"|"XOR", "enlaceIds": [...] } },
    "opds": { "<id>": { "id", "nombre": "<SDx.y>", "padreId", "ordenLocal",
        "apariencias": { "<aparienciaId>": { "id", "entidadId", "opdId", "x", "y", "width", "height",
            "contextoRefinamiento"?: { "tipo": "descomposicion", "refinableEntidadId", "rol" },
            "estadosSuprimidos"?: [...] } },
        "enlaces": { "ae-<enlaceId>-<opdId>": { "id", "enlaceId", "opdId", "vertices": [] } },
        "ordenInzoom"?: [[...], ...] } }
  }
}
```

Reglas de emisión de enlaces (compatibles con lectores v0):

| Interno | `origenId` / `destinoId` emitidos |
|---|---|
| consumo/agente/instrumento con `estadoEntradaId` | origen `{kind:'estado', id: s}` |
| resultado con `estadoSalidaId` | destino `{kind:'estado', id: s}` |
| efecto T3 | `{entidad P}` → `{entidad O}` |
| efecto TS3 | `{entidad P}` → `{entidad O}` + `estadoEntradaId` + `estadoSalidaId` |
| efecto TS4 (standalone o mitad) | `{estado s}` → `{entidad P}` + `efectoEscindido {grupoId, enlacePadreId, rol:'entrada', modo}` |
| efecto TS5 (standalone o mitad) | `{entidad P}` → `{estado s}` + `efectoEscindido {…, rol:'salida', modo}` |
| estructurales/etiquetados con estado | extremo `{kind:'estado'}` en el lado correspondiente |
| `reciproco` | `tipo:'etiquetadoBidireccional'` sin `backwardTag` |
| rama de abanico | `portId: 'port-<abanicoId>'` en el extremo común |

`efectoEscindido`: para un par, `grupoId = enlacePadreId = <id de la mitad de entrada>`, `modo:'par'`; standalone: `grupoId = enlacePadreId = <id propio>`, `modo:'standalone'`. `contextoRefinamiento` solo en OPDs de descomposición: el contenedor `rol:'contorno'`, internos `'interno'`, el resto `'externo'`. `opds[].enlaces` = enlaces **directos** visibles en ese OPD (ambos extremos con apariencia y no ocultos por R-VIS-HIJO-1), id determinista `ae-<enlaceId>-<opdId>`. `abanicos[].opdId` = primer OPD en preorden donde todas sus ramas son directas; `lado` = `'origen'|'destino'` según el extremo común.

**Punto fijo** (probado sobre todos los `fixtures/v0/**` y 200 modelos de `azar.ts`):
- `exportarV0(importarV0(exportarV0(m)).modelo) === exportarV0(m)` byte a byte (con el id de modelo preservado en modo migración).
- `importarV0(exportarV0(m))` produce informe vacío (sin no representados, descartes ni normalizaciones).
- aplicar un conjunto vacío de líneas OPL devuelve el mismo modelo y `exportarV0` del resultado es idéntico al de `m` (R-§19-LENS-3).

### 3.5 Identificadores

- Ids opacos `prefijo-n`: `o` objeto, `p` proceso, `s` estado, `e` enlace, `ab` abanico, `opd` OPD, `a` apariencia. `n = nextSeq`, que se incrementa en cada asignación; si el id ya existe en **cualquier** colección (incluidas las apariencias de todos los OPDs), se salta al siguiente. Una sola función `nuevoId(m, prefijo): [Id, Modelo]`; ninguna operación hace aritmética manual.
- El prefijo no codifica semántica consultable: cambiar el tipo de una cosa no cambia su id.
- Id de modelo: `m-` + `crypto.randomUUID()` al crear o importar; es también el nombre de archivo en el servidor (patrón `^[A-Za-z0-9_-]{1,80}$`).
- La etiqueta `SDx.y` nunca es identidad (T-022, AP-17): se recalcula (§4.9).

---

## 4. Núcleo

### 4.1 Resultados y errores (`nucleo/resultado.ts`)

```ts
export type Resultado<T> = { ok: true; valor: T } | { ok: false; rechazo: Rechazo };

export interface Rechazo {
  codigo: CodigoRechazo;
  regla: string;            // 'R-EFE-1', 'AP-04', 'T-053', …
  mensaje: string;          // es-CL, con nombres tipográficos: «**Agua** no tiene estados: …»
  accion?: string;          // acción canónica (R-AP-0B): «Agrega un estado a **Agua** o usa consumo»
  comando?: string;         // id de comando que ejecuta la acción, si existe
}
export type CodigoRechazo =
  | 'no-existe' | 'no-visible-en-opd' | 'firma' | 'estado-invalido' | 'control-invalido'
  | 'multiplicidad-invalida' | 'ruta-invalida' | 'etiqueta-invalida' | 'unicidad-rol'
  | 'nombre-invalido' | 'nombre-existente' | 'refinamiento' | 'ciclo' | 'bandas'
  | 'abanico' | 'no-soportado' | 'no-canonizado' | 'contencion';

export interface Ajuste { regla: string; mensaje: string; refs: Ref[] }   // traza R-OPD-OP-5
export interface Cambio { modelo: Modelo; creados: Id[]; ajustes: Ajuste[]; descripcion: string }
export type Operacion<A> = (m: Modelo, args: A) => Resultado<Cambio>;
export type Ref = { tipo: 'entidad' | 'estado' | 'enlace' | 'opd' | 'abanico'; id: Id };
```

Las operaciones nunca lanzan; los errores de programación (invariantes rotos) sí lanzan y los atrapan las pruebas.

### 4.2 API de operaciones (firmas)

`Extremo = { cosaId: Id; estadoId?: Id }`. Todas son `Operacion<A>`.

**Modelo** (`operaciones/modelo.ts`)
- `crearModelo(args: { nombre: string }): Modelo` (no es `Operacion`: crea SD vacío con `opd-1`, `nextSeq: 2`, `unidadTiempo:'sec'`)
- `renombrarModelo({ nombre })`, `fijarUnidadTiempo({ unidad })`, `fijarDescripcionModelo({ texto })`

**Cosas** (`operaciones/cosas.ts`)
- `crearCosa({ opdId, tipo, nombre, x, y, banda?: { indice: number; paralelo: boolean } })` — si el punto cae dentro del contenedor de una descomposición, la cosa nace `interno` (proceso → subproceso en la banda indicada o en una nueva al final; objeto → objeto interno); fuera → externo. Afiliación ambiental heredada si se crea como interno de un refinado ambiental (T-091).
- `renombrarCosa({ entidadId, nombre })` — léxico y unicidad; nunca normaliza en silencio: la UI envía el nombre ya confirmado.
- `fijarEsencia({ entidadId, esencia })`, `fijarAfiliacion({ entidadId, afiliacion })` — la afiliación ambiental se propaga a rasgos por la cadena de exhibición (R-OBJ-6, ajuste trazado).
- `fijarGenero({ entidadId, genero: 'm' | 'f' })`, `fijarDescripcion({ entidadId, texto })`
- `fijarValor({ entidadId, valor: string | null })` — solo objeto destino de una exhibición.
- `fijarDuracion({ entidadId, duracion: Duracion | null })` — solo proceso; valores > 0 y `min ≤ esperada ≤ max` cuando coexisten.
- `cambiarTipoCosa({ entidadId, tipo })` — rechaza si quedarían estados en un proceso o algún enlace falla la matriz (lista los enlaces).
- `fijarColeccionIncompleta({ entidadId, relacion, valor: boolean })`
- `eliminarCosa({ entidadId })` — cascada: apariencias, estados, enlaces incidentes, abanicos que queden con <2 ramas, refinamientos (subárbol completo) e internos exclusivos; ajustes listados.

**Apariencias** (`operaciones/apariencias.ts`)
- `traerCosa({ opdId, entidadId, x, y })` — nueva apariencia de la misma entidad (método §9.15); en OPD de descomposición siempre como externo (si el punto cae dentro del contenedor, se reubica fuera: rebote, T-081).
- `pegarCosas({ opdId, entidadIds, origen: {x, y}, desplazamientos })` — `traerCosa` múltiple que conserva la disposición relativa; omite las que ya aparecen.
- `quitarApariencia({ opdId, entidadId })` — rechaza el contenedor y los internos («un interno solo existe en su refinamiento: elimínalo del modelo»); permitida aunque la cosa quede sin apariencias (DB-17).
- `moverApariencia({ opdId, entidadId, x, y })` — externo dentro del contenedor → rebote al borde exterior más cercano + ajuste; interno fuera del contenedor → se confina (R-OPD-UI-3); subprocesos: la Y no cambia la banda (eso es `moverSubproceso`).
- `redimensionarApariencia({ opdId, entidadId, ancho, alto })` — mínimo = caja de contenido (§6.5).

**Estados** (`operaciones/estados.ts`)
- `crearEstado({ objetoId, nombre, indice?: number })` — un estado es válido (R-OBJ-2 `s ≥ 1`).
- `renombrarEstado({ estadoId, nombre })`, `reordenarEstado({ estadoId, indice })`
- `fijarDesignacion({ estadoId, designacion: 'inicial' | 'final' | 'porDefecto' | 'current', valor: boolean })` — `porDefecto`/`current` exclusivos por objeto: fijar uno quita el anterior (ajuste trazado); inicial y final son aditivos y combinables (D10).
- `suprimirEstado({ estadoId, alcance: 'global' } | { estadoId, alcance: 'opd'; opdId })` y `expresarEstado(...)` — rechaza suprimir localmente un estado anclado por un enlace visible en ese OPD (LF-03).
- `eliminarEstado({ estadoId })` — los enlaces anclados pierden el anclaje (TS1→T1, TS3→TS4/TS5, …), listados en `ajustes`; rechaza si el objeto quedaría sin estados teniendo efectos (R-EFE-1).

**Enlaces** (`operaciones/enlaces.ts`)
- `crearEnlace({ opdId, tipo, origen: Extremo, destino: Extremo, control?, abanico?: 'XOR' | 'OR' })` — ambos extremos visibles en `opdId` (T-066); los estados de los extremos se asignan a `estadoEntradaId/estadoSalidaId` u `estadoOrigenId/estadoDestinoId` según tipo y orientación; si el extremo proceso está descompuesto, aplica la distribución (§4.6.3) antes de validar; `abanico` forma o extiende un abanico con el enlace existente del mismo par que bloquea la unicidad (R-FAN-5, DR-6).
- `completarCambioDeEstado({ enlaceId, estadoSalidaId } | { enlaceId, estadoEntradaId })` — convierte TS4/TS5 standalone en TS3 (segundo gesto sobre el mismo par).
- `reanclarExtremo({ enlaceId, lado: 'origen' | 'destino', extremo: Extremo, opdId })` — conserva el id; limpia `migracionAutomatica`.
- `cambiarTipoEnlace({ enlaceId, tipo })` — conserva id; revalida; rechaza si es rama de abanico.
- `fijarEstadosEnlace({ enlaceId, entrada?, salida?, origen?, destino? })` (`null` quita)
- `fijarControl({ enlaceId, control: Control | null })`
- `fijarEtiquetas({ enlaceId, etiqueta?, etiquetaInversa? })` — bidireccional con etiquetas iguales → `reciproco` (ajuste).
- `fijarRuta({ enlaceId, ruta: string | null })`, `fijarMultiplicidad({ enlaceId, lado, valor: Multiplicidad | null })`
- `eliminarEnlace({ enlaceId })` — disuelve abanicos con <2 ramas; si es mitad escindida, la otra queda standalone (ajuste, DR-7).

**Abanicos** (`operaciones/abanicos.ts`)
- `formarAbanico({ enlaceIds, operador })`, `cambiarOperador({ abanicoId, operador })`, `disolverAbanico({ abanicoId })`, `quitarRama({ abanicoId, enlaceId })`

**Refinamiento** (`operaciones/refinamiento.ts`)
- `descomponer({ opdId, procesoId })` → crea el OPD hijo; `creados = [opdHijoId]`.
- `desplegar({ opdId, cosaId, modo })` → crea el OPD hijo con los refinadores directos.
- `insertarSubproceso({ opdId, nombre, banda: number, paralelo: boolean })` — crea el proceso interno y lo ubica: `paralelo:false` inserta una banda nueva en la posición `banda`; `paralelo:true` lo agrega a la banda `banda`.
- `moverSubproceso({ opdId, entidadId, banda: number, paralelo: boolean, indice?: number })`
- `agregarRefinador({ opdId, nombre, tipo?: TipoCosa })` — en OPD de despliegue: crea la cosa y el enlace estructural del modo desde el refinable.
- `eliminarRefinamiento({ cosaId, clase: 'descomposicion' | 'despliegue', conservarEnlaces: boolean })`
- `reordenarOpd({ opdId, indice })` — entre hermanos; las etiquetas cambian, los ids no.

Consultas puras (`indice.ts`, `vista.ts`, `matriz.ts`): `indice(m)`, `vista(m, opdId)`, `tiposPosibles(m, opdId, a, b)`, `validarEnlace(m, e)`, `etiquetaOpd(m, opdId)`, `extremoComun(m, abanico)`, `generales(m, cosaId)`, `estadosEfectivos(m, objetoId)`, `bandasDe(m, opdId)`, `internoDe(m, cosaId)`.

### 4.3 Matriz de validez: codificada una sola vez

**Dirección canónica** (origen → destino): consumo objeto→proceso; resultado proceso→objeto; **efecto proceso→objeto**; agente/instrumento objeto→proceso; invocación proceso→proceso; excepción fuente→manejo; agregación todo→parte; exhibición exhibidor→rasgo; generalización general→especialización; clasificación clase→instancia; etiquetados origen→destino.

```ts
interface ReglaTipo {
  familia: Familia;
  pares: ReadonlyArray<readonly [TipoCosa, TipoCosa]>;      // firmas (origen, destino)
  estados: { entrada?: true; salida?: true; origen?: true; destino?: true; ambosONinguno?: true; nuncaSoloDestino?: true };
  control: { e?: true; c?: true };                           // solo Pre(P)
  abanico?: true;
  multiplicidad: { origen?: true; destino?: true };
  ruta?: true;
  etiquetas: 0 | 1 | 2;
  autoenlace?: true;                                         // invocación (IV2), etiquetado (unaria)
}
export const REGLAS: Readonly<Record<TipoEnlace, ReglaTipo>> = { /* 15 filas = CANON §2.1 */ };
```

| tipo | pares | estados | e | c | abanico | mult. | ruta | etiq. | auto |
|---|---|---|---|---|---|---|---|---|---|
| consumo | O→P | entrada | ✓ | ✓ | ✓ | origen | ✓ | 0 | |
| resultado | P→O | salida (≠ inicial) | | | ✓ | destino | ✓ | 0 | |
| efecto | P→O | entrada, salida | ✓ | ✓ | ✓ | destino | | 0 | |
| agente | O(física)→P | entrada | ✓ | ✓ | ✓ | origen | | 0 | |
| instrumento | O→P | entrada | ✓ | ✓ | ✓ | origen | | 0 | |
| invocacion | P→P | — | | | ✓ | | | 0 | ✓ |
| excepcionSobretiempo/Subtiempo | P→P | — | | | | | | 0 | |
| agregacion | O→O, P→P | — | | | | destino | | 0 | |
| exhibicion | O→O, O→P, P→O, P→P | — | | | | | | 0 | |
| generalizacion | O→O, P→P | origen+destino (ambos o ninguno) | | | | | | 0 | |
| clasificacion | O→O, P→P | — | | | | | | 0 | |
| etiquetado | O→O, P→P | origen, destino | | | | origen, destino | | 1 | ✓ |
| etiquetadoBidireccional | O→O, P→P | origen, destino (nunca solo destino) | | | | origen, destino | | 2 | |
| reciproco | O→O, P→P | origen, destino (nunca solo destino) | | | | origen, destino | | 0–1 | |

`validarEnlace(m, e, { excluirId?, opdId? }): Veredicto` evalúa **en este orden fijo** y devuelve el primer rechazo, más los avisos no bloqueantes:

1. referencias existentes; estados pertenecientes al objeto del extremo que corresponde;
2. par de tipos de cosa (`firma`); agente desde objeto físico (DR-5, AP-05);
3. campos de estado permitidos para el tipo; AP-04 (salida ≠ inicial); generalización ambos-o-ninguno; bidireccional/recíproco nunca solo destino (AP-11);
4. control: tipo lo admite (T-051); no sobre mitad escindida (AP-08); en rama de abanico, el control del abanico debe ser uniforme y con plantilla (§4.5);
5. multiplicidad en extremos permitidos; no junto a `c` (DR-44); ruta en consumo/resultado con texto no vacío (léxico `nombre`); etiquetas: cantidad y léxico `frase_no_capitalizada` (aviso si no cumple R-OPL-SE-1, rechazo si vacía en bidireccional);
6. autoenlace solo si `autoenlace`;
7. efecto: el objeto tiene ≥1 estado propio o heredado (R-EFE-1, DR-43);
8. **unicidad de rol** (T-053): ningún otro procedimental entre el objeto y el proceso, ni entre el objeto y un ancestro descompuesto o un descendiente del proceso; excepciones: ramas del mismo abanico (DR-6) y consumo/resultado con ruta (DB-5);
9. contorno (AP-06, AP-21): consumo, resultado, TS4/TS5, TS3 o evento desde objeto sistémico no pueden quedar anclados al contorno de un proceso descompuesto con ≥1 subproceso (en edición no se rechaza: `crearEnlace` ya migró; aquí aplica al diagnosticar y a `reanclarExtremo`);
10. AP-27: evento a subproceso que no está en la primera banda → rechazo si alguna banda anterior tiene un transformador sin `c`; si todos los previos son omisibles → aviso;
11. invocación entre hermanos de bandas consecutivas (doble vara, R-INV-2B) → rechazo;
12. excepción: fuente sin `duracion.max` (sobretiempo) o `min` (subtiempo) → aviso con acción «Fijar duración…» (canónico condicionado); manejo no ambiental → aviso (R-EXC-1A).

`tiposPosibles(m, opdId, a: Extremo, b: Extremo)` construye, para cada uno de los 15 tipos y para ambas orientaciones compatibles con la dirección canónica, el enlace candidato (asignando los estados de `a`/`b` a los campos que el tipo admite) y lo pasa por `validarEnlace`. Devuelve `Array<{ tipo; origen; destino; veredicto; candidato: Enlace }>`; la UI obtiene la vista previa con `opl/generar.ts#lineaDeEnlace(m, candidato)`, es decir, con el **generador real** (el núcleo no conoce el OPL). Consumidores:

| Consumidor | Uso |
|---|---|
| Menú de enlace (lienzo) | lista solo los válidos, con aviso cuando lo hay, y un pie «N no disponibles» que despliega motivos (R-OPD-UI-5) |
| Operaciones del núcleo | toda mutación de enlace termina en `validarEnlace` |
| Parser OPL | los parches de enlace se aplican con las mismas operaciones; un rechazo es `enlace-invalido-firma` |
| Importador v0 | `validarEnlace` en modo diagnóstico → `ENLACE_INVALIDO` recuperable |

`validarAbanico(m, enlaceIds, operador, control)`: ≥2 enlaces distintos, mismo tipo, tipo con `abanico`, ninguno ya en abanico, extremo común (todos comparten origen o todos destino; si comparten ambos —ramas por estado— el común es el proceso), control uniforme (mixto → `no-canonizado`, R-ZNC-COMB-1), resultado e invocación sin control (AP-03), combinación abanico×control solo si tiene plantilla: consumo convergente todas `c` (C-18), efecto divergente todas `c` (reglas §7.4), efecto convergente con objeto común y `e` XOR/OR (R-FAN-4); cualquier otra con control → `no-soportado` (T-056).

### 4.4 Diagnósticos (`nucleo/diagnostico.ts`)

```ts
interface Hallazgo {
  codigo: string; regla: string;
  severidad: 'error' | 'warning' | 'info';           // ≙ CRÍTICA / ALTA-MEDIA / BAJA (DR-40)
  familia: 'gramatical' | 'metodologica' | 'identidad' | 'contencion' | 'sugerencia';
  mensaje: string; accion: string; comando?: { id: string; args: unknown };
  refs: Ref[]; opdId?: Id;
}
interface Regla { codigo; regla; severidad; familia; accion; evaluar(m: Modelo, idx: Indice): Hallazgo[] }
export const REGLAS_DIAGNOSTICO: readonly Regla[];
export function diagnosticar(m: Modelo): Hallazgo[];          // memo por Modelo
```

| Código | Regla | Sev. | Familia | Acción canónica (comando) |
|---|---|---|---|---|
| ENLACE_INVALIDO | matriz (T-040) | error | gramatical | «Corregir o eliminar el enlace» (`enlace.eliminar`) |
| ABANICO_INVALIDO | T-054..056 | error | gramatical | «Disolver el abanico» |
| INVOCACION_DOBLE_VARA | R-INV-2B | error | gramatical | «Eliminar la invocación redundante» |
| PRECEDENCIA_INVALIDA | AP-30 | error | contencion | «Corregir el nivel hijo» (`opd.ir` al hijo) |
| NOMBRE_DUPLICADO | T-024 | error | identidad | «Renombrar» |
| NOMBRE_FUERA_DE_LEXICO | R-§18-LEX-1 | error | gramatical | «Renombrar» |
| ESTADO_DUPLICADO | T-015 | error | identidad | «Renombrar el estado» |
| CONTORNO_PROHIBIDO | AP-06/AP-21 | error | contencion | «Migrar al primer/último subproceso» |
| PROCESO_SIN_TRANSFORMACION | R-PROC-2 (DR-43) | warning | metodologica | «Agregar consumo, resultado o efecto» |
| SUBPROCESO_SIN_TRANSFORMADO | método A3.1 | warning | metodologica | «Agregar un transformado» |
| REFINAMIENTO_TRIVIAL | R-REF-NTRIV, AP-13 | warning | metodologica | «Agregar un segundo subproceso/refinador» |
| DENSIDAD_ALTA | R-LAY-1 (21–25) | warning | sugerencia | «Refinar para aliviar el OPD» |
| DENSIDAD_EXCESIVA | R-LAY-1 (>25) | warning | sugerencia | idem (bloquea export canónico) |
| SD_PROCESO_SISTEMICO | R-SD-4 | warning | metodologica | «El SD tiene un solo proceso sistémico» |
| EXCEPCION_SIN_COTA | R-EXC-2/3 | warning | gramatical | «Fijar duración máxima/mínima de la fuente» |
| MANEJADOR_NO_AMBIENTAL | R-EXC-1A | warning | metodologica | «Hacer ambiental el manejador» |
| AFILIACION_NO_HEREDADA | R-OBJ-6/7 | warning | metodologica | «Hacer ambiental» |
| AGENTE_NO_HUMANO | AP-05 (DB-16) | warning | metodologica | «Cambiar a instrumento» |
| EVENTO_A_INTERMEDIO | AP-27 (omisible) | warning | metodologica | «Mover el evento al primer subproceso» |
| PRECEDENCIA_CONFLICTO | R-PREC-3 | warning | contencion | «Revisar el nivel hijo» |
| REFINADOR_MULTICONTEXTO | R-OPD-OP-6 | warning | contencion | «Revisar pertenencia» |
| COSA_SIN_APARIENCIA | método A8.2 | warning | identidad | «Traer a este OPD» / «Eliminar del modelo» |
| ENLACE_INVISIBLE | método A8.2 | warning | identidad | «Traer los extremos» |
| ESTADO_SIN_ESCRITOR | LF-19 | warning | metodologica | «Agregar resultado o efecto que lo produzca» |
| TRANSIENTE | AP-26 | warning | metodologica | «Considerar invocación» |
| GENERAL_REDUNDANTE | R-OPD-VAL-6 | info | sugerencia | «Quitar el enlace redundante» |
| NOMBRE_OBJETO_PLURAL | R-NOM-OBJ-1/2 | info | sugerencia | «Usar singular o Conjunto/Grupo» |
| NOMBRE_PROCESO | R-NOM-PROC-1..3 | info | sugerencia | «Usar forma deverbal de 2–4 palabras» |
| ETIQUETA_NO_MINUSCULA | R-OPL-SE-1 | info | sugerencia | «Escribir la etiqueta en minúscula» |
| MEZCLA_FORMAS_PROCESO | método A2.3 | info | sugerencia | «Uniformar infinitivo o nominalización» |

- Los errores (`error`) son los estructurales recuperables: no bloquean la edición, sí el export canónico (T-283).
- Validadores sobre el modelo, nunca sobre el OPL (A8.2). Herencia aplicada (DR-43): `PROCESO_SIN_TRANSFORMACION` cuenta transformadores de los generales; R-EFE-1 cuenta estados heredados.
- **Ajustes automáticos** (R-OPD-OP-5) no son diagnósticos persistentes: viajan en `Cambio.ajustes`, se muestran en la franja de cambios del panel OPL y quedan en la descripción de la entrada de deshacer («entrada en el historial de la operación»).
- **Firma de frontera** (DR-16, T-089): ley de prueba `frontera.test.ts` sobre 200 modelos aleatorios: la firma de roles netos `entidad|tipo|rol` del contenedor en la vista del padre = la del hijo abstraído.

### 4.5 Abanicos: extremo común y control

`extremoComun(m, ab)`: si todas las ramas comparten origen y destino (ramas por estado) → el extremo proceso; si comparten origen → origen (divergente); si comparten destino → destino (convergente). La clasificación convergente/divergente (R-FAN-GEO-2) y la plantilla OPL (§5) se derivan de aquí.

### 4.6 Refinamiento

#### 4.6.1 Descomponer (in-zoom de proceso), operación atómica

Precondiciones: P aparece en `opdId`; no tiene descomposición; no es externo del OPD `opdId` (R-HIJO-5); no es ancestro refinado de `opdId` (R-REF-1: recorrer padres de `opdId` comparando la cosa refinada).

Efectos:
1. OPD hijo nuevo `opd-n`, `padreId = opdId`, `orden` = último entre hermanos; `P.refinamientos.descomposicion = { opdId: hijo }`.
2. Apariencia de P en el hijo como contenedor (caja inicial 405×300, centrada en el origen de lienzo del hijo); `bandas = []`.
3. **Externos** (R-HIJO-3): toda cosa X conectada a P por cualquier enlace obtiene apariencia en el hijo (no `interno`), colocada por `layout.externos` (§6.5).
4. Enlaces: sin subprocesos todos permanecen en el contorno (respaldo temporal, T-076).
5. `Cambio.descripcion = 'Descomponer *P* en SDx'`; la UI navega al hijo y abre el editor del primer subproceso (§7.3.8).

#### 4.6.2 Bandas

- `bandas: Id[][]` es la fuente de verdad del orden temporal (R-INV-2D); la Y la realiza `realizarBandas` (§6.5) después de toda operación que cambie las bandas; ninguna operación de layout las cambia (R-LAY-4).
- `insertarSubproceso` / `moverSubproceso` / `eliminarCosa` de un subproceso mantienen el invariante 3 de §3.1 y disparan `redistribuir(m, opdHijo)` (§4.6.3).
- Tras reordenar, se revalidan las invocaciones entre hermanos: una que pase a ser doble vara queda como `INVOCACION_DOBLE_VARA` (error recuperable) y se informa en `ajustes`.

#### 4.6.3 Distribución y migración (DR-13, DB-4)

`redistribuir(m, opdHijo)` se ejecuta al insertar, mover o eliminar subprocesos y al crear un enlace hacia un proceso descompuesto. `primero = bandas[0][0]`, `ultimo = bandas[n-1][última]`.

| Enlace (extremo proceso = P o un subproceso con `migracionAutomatica`) | Destino |
|---|---|
| consumo; evento (`e`) desde objeto sistémico de cualquier tipo; efecto TS4 | `primero` |
| resultado; efecto TS5 | `ultimo` |
| efecto TS3 con 1 subproceso | ese subproceso (entero) |
| efecto TS3 con ≥2 subprocesos | escisión §4.6.4 |
| efecto sin estado, agente, instrumento (sin evento sistémico) | permanece en el contorno (lectura distributiva) |
| invocación, excepción, estructurales, etiquetados | permanecen en el contorno (DR-14) |

- Un enlace migrado conserva su id (R-OPD-OP-4) y queda con `migracionAutomatica: true`; mientras la tenga, `redistribuir` lo recoloca cuando cambian primero/último. `reanclarExtremo`, `cambiarTipoEnlace` y `fijarEstadosEnlace` la quitan.
- Sin subprocesos (bandas vacías), los enlaces migrados vuelven al contorno.
- Si el objeto externo del enlace migrado no aparece en el OPD hijo, se trae como externo.
- Cada recolocación produce un `Ajuste` («Consumo de **Agua** migrado a *Hervir* (primer subproceso)»).
- `crearEnlace` hacia P descompuesto: si ya existe un enlace del mismo tipo entre el objeto y un descendiente de P, la creación es idempotente (el hecho abstraído ya existe, T-168); si no, se aplica la tabla.

#### 4.6.4 Escisión (R-ESCIND-1..3, AP-07)

TS3 E (entrada `a`, salida `b`) sobre P con ≥2 subprocesos → E pasa a TS4 (solo `a`) anclado a `primero`, con `escision {parId: E2, mitad:'entrada'}`; se crea E2 TS5 (solo `b`) anclado a `ultimo`, con `escision {parId: E, mitad:'salida'}`; ambos `migracionAutomatica`. Si el número de subprocesos vuelve a 1 y ambas mitades siguen automáticas, se recomponen en E (TS3) y E2 se elimina (eliminación declarada en el ajuste, R-OPD-OP-4). Las mitades nunca llevan control (AP-08). Por eso un TS3 **con control** (`e` o `c`) no se escinde: migra entero, con su control, al `primero`, y el ajuste lo dice («El cambio de estado de **O** conserva su evento y quedó entero en *S1*; escíndelo a mano si ocurre en subprocesos distintos»). Así ninguna operación de refinamiento bloquea ni pierde un modificador en silencio, y AP-07 se cumple porque el TS3 deja de estar en el contorno.

#### 4.6.5 Desplegar (unfold), por modo

Precondiciones: la cosa aparece en `opdId`; no tiene despliegue. Efectos: OPD hijo con la cosa arriba al centro; refinadores directos del modo (cosas destino de enlaces del tipo `modo` con origen en la cosa) copiados como apariencias en fila debajo (R-HIJO-4); modo persistido (R-REF-MEC-1). Sin refinadores, la UI abre el editor del primer refinador (§7.3.9). Pertenencia del refinador = presencia en el OPD hijo + enlace del modo (spec-OPL §7.2). El refinable muestra contorno grueso en todos los OPD (R-CTRN-2); despliegue intradiagrama no existe (siempre OPD nuevo, DR-24). Colección incompleta: bandera en la cosa por relación; `agregarRefinador` y `eliminarEnlace` ajustan el símbolo y el OPL al cambiar la colección y dejan traza (T-087).

#### 4.6.6 Eliminar refinamiento (DR-17, DB-11)

Solo si el OPD hijo es hoja (R-REF-3). La confirmación lista: el OPD, las cosas que solo aparecen allí (se eliminan del modelo, R-HIJO-6) y los enlaces afectados. Con `conservarEnlaces` (por defecto): cada enlace entre un interno eliminado y una cosa que sobrevive se reancla al refinado (P) si la matriz lo admite; los que colapsan en el mismo par se fusionan por fuerza (§4.7) conservando el id del primero; los conflictos R+C se conservan ambos y se informan; el resto se elimina y se lista. Nunca es la inversa de otra operación (método A1.5-d).

### 4.7 Proyección por OPD (`nucleo/vista.ts`)

```ts
interface VistaOpd {
  opdId: Id;
  refinamiento?: { cosaId: Id; clase: 'descomposicion' | 'despliegue'; modo?: ModoDespliegue };
  cosas: Array<{ entidadId: Id; apariencia: Apariencia; rol: 'contenedor' | 'interno' | 'externo' | 'refinable' | 'libre';
                 estadosVisibles: Id[]; ocultos: number }>;
  hechos: HechoVisible[];                 // enlaces directos y abstraídos
  abanicos: Array<{ abanicoId: Id; enlaceIds: Id[] }>;   // solo si todas sus ramas son directas
}
interface HechoVisible {
  clave: string;                          // tipo|origen|destino|estados|control
  enlace: Enlace;                         // enlace efectivo (el propio o el sintetizado)
  subyacentes: Id[];                      // ids de enlaces del modelo que representa
  abstraido: boolean;
}
```

Algoritmo para OPD `O`:
1. `visibles = claves(O.apariencias)`.
2. `rep(c)`: si `c ∈ visibles` → `c`; si no y `c` es un **proceso**, sube por `internoDe` (proceso descompuesto cuyo OPD hijo tiene a `c` como subproceso) hasta hallar un visible; objetos internos no visibles y cosas sin ancestro visible → indefinido. Solo la descomposición abstrae (el despliegue no) y solo se elevan procesos, para que el hecho abstraído conserve su firma (un enlace de un objeto interno nunca se convierte en un enlace del refinado).
3. Por cada enlace L: `a = rep(origen)`, `b = rep(destino)`. Indefinido → invisible. `a === b` → invisible. Ambos originales → hecho directo. Si no y L es **procedimental, invocación o excepción** → candidato abstraído sobre (a, b); estructurales y etiquetados nunca se abstraen.
4. **Fusión de abstraídos por par (objeto, proceso)** (reglas §6.5/§6.6): transformadores por la matriz 3×3 (E+E → E; E+R → R; E+C → C; R+C → ambos + `PRECEDENCIA_CONFLICTO`; R+R o C+C → ambos + `PRECEDENCIA_INVALIDA`); si hay transformador, los habilitadores se ocultan; entre habilitadores, agente sobre instrumento; control por fuerza evento > sin control > condición. Efectos fusionados: entrada = la del enlace con entrada de la banda más temprana; salida = la del enlace con salida de la banda más tardía (un par escindido vuelve a leerse TS3). Invocaciones/excepciones abstraídas duplicadas → una.
5. **R-VIS-HIJO-1** en OPD de descomposición: se ocultan los hechos en que ningún extremo (tras `rep`) es el contenedor ni un interno.
6. Estados visibles de cada objeto en O: `¬suprimido ∧ id ∉ apariencia.estadosSuprimidos`; `ocultos` = el resto (chip ⋯N, D6).
7. Abanicos: visibles como tales solo si todas sus ramas son hechos directos en O.

La vista se memoiza por `(Modelo, opdId)`. `opl/generar.ts` y `opd/escena.ts` la consumen; `opl/planificar.ts` la usa para decidir `sin-cambio` (§5.5).

### 4.8 Herencia en validadores (DR-43)

`generales(m, c)`: cierre transitivo sobre generalizaciones con destino `c` (herencia múltiple incluida, T-093), sin ciclos. Usos: R-EFE-1 (estados heredados permiten efecto T3, nunca anclaje), R-PROC-2 (transformadores heredados cuentan). Nada heredado se dibuja ni se emite (T-092).

### 4.9 Etiquetas SDx.y (`nucleo/etiquetas.ts`)

Preorden del árbol con hermanos por `orden`: raíz `SD`; hijos `SD1`, `SD2`, …; nietos `SD1.1`, …; se recalculan en cada cambio (memo por `Modelo`). El OPL resuelve `SDx.y` al id persistente (T-167). Título de OPD en UI: `SD1 · Cocinar` (descomposición) o `SD2 · Pedido · agregación` (despliegue).

---

## 5. OPL

### 5.1 Vocabulario (`opl/vocabulario.ts`)

- **Cerrado** = unión de las palabras fijas de las plantillas soportadas (DR-27). El generador no tiene otra forma de producir texto que rellenar una plantilla; el reconocedor no acepta literales fuera de ellas.
- **y/e** (DR-26): `e` si la palabra siguiente (sin marcas, en minúscula) empieza por `i`/`í`, o por `hi`/`hí` seguido de consonante; si no, `y`. **o/u**: `u` si empieza por `o`/`ó` u `ho`/`hó`. El parser acepta ambas formas siempre (T-163).
- **Artículos**: `un`/`una` según `genero` de la cosa nombrada a continuación (R-OPL-1).
- **Multiplicidad** (R-MULT-1, antepuesta al sustantivo, sub-span propio): `?` → `un opcional`/`una opcional`; `*` → `opcional (cero o más)`; `+` → `al menos un`/`al menos una`.
- **Unidades de tiempo** (DR-18): `ms` milisegundo(s), `sec` segundo(s), `min` minuto(s), `hour` hora(s), `day` día(s), `week` semana(s), `month` mes(es), `year` año(s); singular si el valor es 1; números con punto decimal (EBNF `numero_decimal`).
- **Esencia/afiliación**: atómicas `física`, `informacional`, `ambiental`, `sistémica`; combinadas (solo parseo, R-ENT-3) `físico`, `informacional`, `sistémico`, `ambiental`.

### 5.2 Tokens y líneas (`opl/tokens.ts`, CANON §4.11)

```ts
export type RefOpl = { tipo: 'entidad' | 'enlace' | 'estado' | 'opd'; id: Id };
export interface TokenOpl {
  texto: string;                                   // sin marcas
  rol: 'texto' | 'nombre' | 'verbo' | 'estado';
  marca?: 'objeto' | 'proceso' | 'estado';         // **…**, *…*, `…`
  ref?: RefOpl;
  hechoId?: Id;                                    // enlace al que pertenece el sub-span (R-OPL-INT-6)
}
export interface LineaOpl {
  id: string;                                      // estable: `${opdId}#${claveHecho}` (no posicional)
  texto: string;                                   // Markdown canónico (lo que se exporta y se parsea)
  tokens: TokenOpl[];
  refs: RefOpl[];                                  // únicas por tipo:id, orden de primera aparición
  hechoIds: Id[];                                  // enlaces del modelo que la línea expresa (abstraídos incluidos)
  opdId: Id; opdEtiqueta: string; opdProfundidad: number;
  soloDisplay?: true;                              // encabezados de bloque, D2 de display
}
```

El texto se construye desde los tokens (`**` + texto + `**` para objeto, etc.): nunca hay dos fuentes.

### 5.3 Tabla bidireccional de plantillas (`opl/plantillas.ts`)

Cada plantilla es un **patrón declarativo** que sirve para generar (rellenar huecos) y para reconocer (comparar el esqueleto tokenizado). DSL:

```ts
type Hueco =
  | { h: 'O' | 'P' | 'C'; v: string; mult?: true; estado?: 'opcional' | 'obligatorio' }  // objeto / proceso / cualquiera; «en `s`» opcional
  | { h: 'S'; v: string }                                                                  // estado
  | { h: 'L'; de: 'O' | 'P' | 'C' | 'S' | 'Om'; conj: 'y' | 'o' | 'coma'; v: string; min: 1 | 2 }  // lista
  | { h: 'T'; v: string }                                                                  // frase en minúscula (etiqueta)
  | { h: 'N'; v: string } | { h: 'U'; v: string }                                         // número, unidad es-CL
  | { h: 'R'; v: string }                                                                  // etiqueta de ruta (nombre)
  | { h: 'SD'; v: string }                                                                 // etiqueta de OPD
  | { h: 'art'; de: string };                                                              // un/una concordado
type Parte = string | Hueco;
interface Plantilla {
  id: string;                     // 'T1', 'TS3', 'CS2', 'F-CONS-CONV-XOR', …
  estado: 'C' | 'P' | 'X' | 'NC'; // canónica (genera+parsea) · solo parseo · no soportada · no canonizada
  familia: FamiliaOpl;
  partes: Parte[];
  aHecho(vars: Vars): HechoOpl;   // reconocer
  deHecho?(h: HechoOpl): Vars | null;   // generar (solo 'C')
  restricciones?: (vars: Vars) => boolean;   // p.ej. el objeto del evento = el objeto de la subcláusula
}
```

Notación de la tabla: `{O}` objeto, `{P}` proceso, `{C}` cosa, `{O·s}` objeto con «en `s`» opcional, `{mO}` objeto con multiplicidad opcional, `{S}` estado, `[X]y` lista con y/e, `[X]o` lista con o/u, `[X],` lista solo con comas, `{t}` frase minúscula, `{n} {u}` número y unidad, `{L}` ruta, `{SD}` etiqueta de OPD.

**Canónicas (C: se generan y se parsean)**

| Familia | Plantillas |
|---|---|
| Cosas | D1 `{C} es física.` · D3 `{C} es ambiental.` · D5 `{O} puede estar [{S}]o.` · D6 `{O} puede estar [{S}],` seguido de la cola literal `, y otros estados.` · D7 `Estado {S} de {O} es inicial.` · D8 `… es final.` · D9 `… es por defecto.` · D10 `… es inicial y final.` · D13 `… es declarado `Current`.` · valor `{O} de {O} es {v}.` |
| Transformadores | T1/TS1 `{P} consume {mO·s}.` · T2/TS2 `{P} genera {mO·s}.` · T3 `{P} afecta {mO}.` · TS3 `{P} cambia {O} de {S} a {S}.` · TS4 `{P} cambia {O} de {S}.` · TS5 `{P} cambia {O} a {S}.` |
| Habilitadores | H1/HS1 `{mO·s} maneja {P}.` · H2/HS2 `{P} requiere {mO·s}.` |
| Evento | ET1/ETS1 `{mO·s} inicia {P}, que consume {O}.` · ET2 `{mO} inicia {P}, que afecta {O}.` · EH1/EHS1 `{mO·s} inicia y maneja {P}.` · EH2/EHS2 `{mO·s} inicia {P}, que requiere {O·s}.` · ETS2 `{O} en {S} inicia {P}, que cambia {O} de {S} a {S}.` · ETS3 `{O} en {S} inicia {P}, que cambia {O} de {S}.` · ETS4 `{O} en cualquier estado inicia {P}, que cambia {O} a {S}.` |
| Condición | CT1 `{P} ocurre si {O} existe, en cuyo caso {O} se consume, de lo contrario {P} se omite.` · CS1 `… si {O} está en {S}, en cuyo caso {O} se consume, …` · CT2 `… si {O} existe, en cuyo caso {P} afecta {O}, …` · CS2 `… si {O} está en {S}, en cuyo caso {P} cambia {O} de {S} a {S}, …` · CS3 `… cambia {O} de {S}, …` · CS4 `… si {O} existe, en cuyo caso {P} cambia {O} a {S}, …` · CH1 `{O} maneja {P} si {O} existe, de lo contrario {P} se omite.` · CS5 `{O} maneja {P} si {O} está en {S}, …` · CH2 `{P} ocurre si {O} existe, de lo contrario {P} se omite.` · CS6 `{P} ocurre si {O} está en {S}, de lo contrario {P} se omite.` |
| Ruta (consumo/resultado, también con sus E*/C*) | `Por ruta {L}, ` + T1/TS1/T2/TS2/ET1/ETS1/CT1/CS1 |
| Excepción | EX1 `{P} ocurre si duración de {P} excede {n} {u}.` · EX1r `… excede su duración máxima.` · EX2 `… es menor que {n} {u}.` · EX2r `… es menor que su duración mínima.` |
| Invocación | IV1 `{P} invoca {P}.` · IV2 `{P} se invoca a sí mismo.` |
| Estructurales | RF1 `{C} consta de [{mC}]y.` (+ `y al menos otra parte` si incompleta) · RF2 `{C} exhibe [{O}]y[, así como [{P}]y].` (proceso exhibidor: operaciones primero) (+ `y al menos otro rasgo`) · RF3 `[{C}]y son {C}.` (≥2; + `y al menos otra especialización`) · RF3b `{C} es {art} {C}.` · RH1 `{C} es {art} {C} y {art} {C}.` (n generales: `, {art} {C}` intermedios) · RF4 `{C} es una instancia de {C}.` · RF4b `[{C}]y son instancias de {C}.` · esp. de estado `[{O} en {S}]y son {O} en {S}.` |
| Etiquetados | SE1 `{mC·s} {t} {mC·s}.` (residual, DR-36) · SE2 `{mC·s} se relaciona con {mC·s}.` · SE3 = dos SE1 (DB-3) · SE4 `{mC·s} y {mC·s} son {t}.` · SE5 `{mC} y {mC} se relacionan.` (SSE1–SSE7 son las mismas plantillas con `en {S}` en los huecos) |
| Contexto | CX1 `{P} se descompone en [{P}]y, en esa secuencia.` · CX2 `{P} se descompone en paralelo [{P}]y.` · CXm `{P} se descompone en {bandas}, en esa secuencia.` · CX3 `{C} se despliega en {SD} en [{C}]y[, así como [{C}]y].` |
| Abanicos (reglas §7.3: 12 familias × XOR/OR; `{q}` = `exactamente uno de` \| `al menos uno de`; `{Q}` = la misma frase capitalizada al inicio de oración) | consumo conv. `{P} consume {q} [{O·s}]o.` · consumo div. `{Q} [{P}]o consume {O}.` · resultado conv. `{Q} [{P}]o genera {O}.` · resultado div. `{P} genera {q} [{O·s}]o.` · efecto (objetos) `{P} afecta {q} [{O}]o.` · efecto (procesos) `{O} es afectado por {q} [{P}]o.` · agente div. `{O} maneja {q} [{P}]o.` · agente conv. `{P} es manejado por {q} [{O·s}]o.` · instrumento div. `{Q} [{P}]o requiere {O}.` · instrumento conv. `{P} requiere {q} [{O·s}]o.` · invocación div. `{P} invoca {q} [{P}]o.` · invocación conv. `{Q} [{P}]o invoca {P}.` · R-FAN-5 `{P} cambia {O} a {q} [{S}]o.` / `{P} cambia {O} de {q} [{S}]o.` (también sin `o` final) · R-FAN-5A `{P} cambia {O} de {S} a {q} [{S}]o.` · R-FAN-4 `{O} inicia {q} [{P}]o, y es afectado por el proceso que ocurre.` · C-18 `{P} ocurre si {q} [{O}]o existe, en cuyo caso {P} consume {q} [{O}]o, de lo contrario {P} se omite.` · §7.4 `{Q} [{P}]o ocurre si {O} existe, en cuyo caso afecta {O}, de lo contrario se omite.` |

**Solo parseo (P)**: D2 `{C} es informacional.` y D4 `{C} es sistémica.` (default: sin cambio o ajuste); R-ENT-3 `{C} es un objeto|proceso {esencia} [y {afiliacion}]`; D11/D12 (coherentes → sin cambio; incoherentes → `non-canonical`); COND-ALT `Si {O} existe entonces {P} ocurre y consume {O}, de lo contrario se omite {P}.`; T3 con lista `{P} afecta [{mO}]y.` e IV1 con lista `{P} invoca [{P}]y.` (AND = un enlace por miembro); sufijo ` proceso` en nombres de proceso (R-OPL-9); valor de atributo enumerado `{O} de {O} puede estar [{S}]o.` (crea la exhibición si falta, DR-20); CX interno `…, así como [{O}]y.` y `…, en esa secuencia, así como [{O}]y.`; CX nuevo OPD `{P} desde {SD} se descompone en {SD} en …`; CX3 sin etiqueta `{C} se despliega en [{C}]y.`; R-FAN-5 sin conjunción final.

**No soportadas (X → `unsupported-canonical`, warning, sin mutar)**, con el T-ID o DR en el mensaje: RX1/RX2 `{C} puede ser {C} o {C}` / `puede ser uno de` (DR-10); negadas `no maneja`, `no requiere`, `no consume`, `no genera`, `no afecta`, `no cambia`; `después de` (demora); EX combinada `es menor que … o excede …`; plurales `consumen`, `generan`, `afectan`, `requieren`, `manejan`, `invocan` (DR-12); CX4 `se refina por`; CX5–CX8 `se pliega en`, `se recompone desde`; CM1–CM3 (`vista de sub-modelo`, `referencia el sub-modelo`, `referencia externa`); despliegue dedicado `se despliega por partes|especialización|instanciación|rasgos`; `es de tipo`; `varía de … a`; `` `Pr=…` ``; RF2o `tiene un|una … opcional`; sufijo `[etiqueta: …]`; ruta sobre tipos ≠ consumo/resultado (DR-19); multiplicidad fuera de `?`/`*`/`+` (`al menos dos`, `dos o más`, números, `m a n`) y multiplicidad dentro de plantillas de condición (DR-44); abanico×control sin plantilla (C-19b, C-18 de instrumento/agente); descomposición de objeto `{O} se descompone en …` (DR-23); oraciones compuestas por coordinación de predicados o sujetos.

**No canonizadas (NC → `non-canonical`, warning)**: `{O} puede estar` escrito como `puede ser` con estados (R-VERB-EST-2); control `c` y `e` a la vez; `Pr` sin abanico; abanico con control mixto; condición con estado sobre efecto sin cambio (DR-29); D11/D12 incoherentes.

`NO_SOPORTADAS` exporta la lista de ids X con su T-ID para `conformidad.test.ts`.

### 5.4 Generador (`opl/generar.ts`)

`generarOpl(m, opciones): LineaOpl[]` — memo por `(Modelo, opciones)`. Opciones de display (nunca alteran el canónico, R-OPL-CFG-2): `esencia: 'siempre' | 'solo-difiere' | 'oculta'` (default `siempre`), `numeracion: boolean`. El **canónico** es `solo-difiere` sin numeración y es lo único que se exporta, se copia y se parsea.

Por cada OPD en preorden (T-100), con `v = vista(m, opd)`:

0. Encabezado `soloDisplay`: `SD1 · Cocinar`.
1. **Oración de refinamiento** (si es hijo, T-125/T-126): descomposición con ≥2 subprocesos → CX1 si todas las bandas tienen uno, CX2 si hay una sola banda, CXm si no (bandas con más de un proceso se escriben `paralelo *A* y *B*`, R-OPL-CX-5); despliegue con ≥2 refinadores presentes → CX3 con la etiqueta del OPD hijo; con <2 → sin oración (T-127) y `REFINAMIENTO_TRIVIAL`.
2. **Cosas visibles** (orden DB-2: contenedor, subprocesos por bandas, luego el resto por nombre): D1 si física; D3 si ambiental; D5 con los estados visibles en orden del modelo, o D6 si la apariencia oculta alguno (T-101); por estado visible designado: D10 si inicial y final, si no D7/D8; D9; D13; valor si `valorSlot` y la cosa es rasgo de un exhibidor visible (`{A} de {X} es v.`, X = primer exhibidor por nombre).
3. **Procedimentales**, agrupados por proceso (orden DB-2) y dentro por tipo en orden de fuerza: consumo, resultado, efecto, agente, instrumento; luego invocación y excepción; empates por nombre del otro extremo y luego id. Cada hecho → una plantilla (§5.4.1). Un abanico visible → una oración en la posición de su primera rama; si alguna rama lleva ruta → una oración por rama (R-COMB-5). En un OPD ascendente, los hechos refinados en descendientes se emiten **plegados**, tal como los entrega la vista (R-OPL-DISP-3): la línea lleva en `hechoIds` todos sus subyacentes y, al reparsearla, resuelve al hecho refinado existente (`sin-cambio`, T-168, R-OPL-DISP-4).
4. **Estructurales**: en el SD (único OPD que no es hijo de refinamiento, porque no hay Bocetos) se agrupan por (vértice, relación) (T-131): RF1 por todo, RF2 por exhibidor, RF3 plural por general (RF3b si hay uno), RH1 para especializaciones con ≥2 generales (sus enlaces salen de los grupos RF3), RF4/RF4b por clase; con colección incompleta se agrega la cola `y al menos otra …`. En OPDs hijos, una oración por enlace (T-132), coexistiendo con la oración de refinamiento. Luego etiquetados (SE1/SE2 por origen; bidireccional como dos SE1 en sus posiciones de orden; SE4/SE5 recíprocos).
5. **Display**: con `esencia:'siempre'` se insertan D2 `soloDisplay` para cada cosa informacional (y no se emite nada extra para afiliación); con `oculta` se omiten D1/D2 en display; con `numeracion` se antepone `n.` solo en la vista.

#### 5.4.1 Selección de plantilla para un hecho de enlace

| Condición del hecho | Plantilla |
|---|---|
| consumo/resultado/efecto/agente/instrumento sin control | T1/TS1, T2/TS2, T3/TS3/TS4/TS5 (según entrada/salida), H1/HS1, H2/HS2 |
| con `control:'e'` | ET1/ETS1, ET2, ETS2/ETS3/ETS4 (efecto con estados), EH1/EHS1, EH2/EHS2 |
| con `control:'c'` | CT1/CS1, CT2/CS2/CS3/CS4, CH1/CS5, CH2/CS6 (R-OPL-COND-ALT-2: nunca COND-ALT) |
| con ruta (consumo/resultado) | prefijo `Por ruta {L}, ` a la oración completa, incluida la variante E*/C* (R-COMB-4) |
| multiplicidad | frase antepuesta en el hueco del objeto (sub-span con `hechoId`) |
| invocación | IV1; IV2 si origen = destino |
| excepción | EX1/EX2 con `{n} {u}` de la duración de la fuente (unidad propia o del modelo); sin cota → EX1r/EX2r (R-EXC-DUR-1) |
| TS3 con entrada = salida | TS3 (proceso persistente explícito, T-138) |

Cada token de nombre lleva `ref` a su entidad/estado y `hechoId` al enlace; el verbo lleva `hechoId`. La línea de un hecho abstraído lleva en `hechoIds` todos sus subyacentes.

### 5.5 Parser (`opl/texto.ts`, `opl/reconocer.ts`, `opl/planificar.ts`)

**Normalización** (R-§18-NORM-1): NFC; espacios Unicode → espacio; colapsar espacios; recortar; comillas tipográficas en marcas → `` ` ``; `…` → `...` solo fuera de nombres; quitar prefijo de viñeta (`- `, `• `, `* ` con espacio) o numeración (`12. `, `12) `); línea vacía → `ignorada-vacia`; sin punto final → `puntuacion-faltante`.

**Tokenización tipográfica** (la tipografía es portadora de tipo, R-OPL-TYPO-1): `**…**` → nombre objeto, `*…*` → nombre proceso, `` `…` `` → estado, resto → texto. Marcas desbalanceadas → `forma-no-reconocida`.

**Esqueleto**: secuencia de ítems donde (a) una frase de multiplicidad inmediatamente anterior a un nombre de objeto se adjunta a él; (b) `nombre en estado` se funde en un ítem `{O·s}`; (c) secuencias `ítem (, ítem)* (y|e|o|u) ítem` y `ítem (, ítem)+` se funden en listas con su conjunción; (d) el sufijo ` proceso` tras un nombre de proceso se absorbe. Las plantillas con cuerpo especial (CXm con `paralelo`, CX3 con `, así como`) tienen reconocedor propio portado de `parsearBandasOrden`.

**Comparación**: se prueban las plantillas en orden de especificidad (más literales primero; SE1 residual al final, DR-36). Primero las X y NC reconocibles (para responder `unsupported-canonical` / `non-canonical` en vez de `forma-no-reconocida`), luego C y P. Coincidencia = todos los literales iguales tras normalización y cada hueco satisfecho; `restricciones` verifican repeticiones coherentes (el objeto del evento y el de la subcláusula son el mismo; el proceso omitido es el mismo). Resultado: `HechoOpl` por nombres.

```ts
type HechoOpl =
  | { k: 'esencia'; cosa: NombreTipado; valor: Esencia } | { k: 'afiliacion'; cosa: NombreTipado; valor: Afiliacion }
  | { k: 'estados'; objeto: string; estados: string[]; otros: boolean }
  | { k: 'designacion'; objeto: string; estado: string; d: Array<'inicial' | 'final' | 'porDefecto' | 'current'> }
  | { k: 'valor'; atributo: string; exhibidor: string; valor: string }
  | { k: 'enlace'; tipo: TipoEnlace; origen: ExtremoOpl; destino: ExtremoOpl; control?: Control; ruta?: string;
      etiqueta?: string; cota?: { valor: number; unidad: UnidadTiempo } | 'respaldo' }
  | { k: 'abanico'; tipo: TipoEnlace; operador: 'XOR' | 'OR'; comun: ExtremoOpl; ramas: ExtremoOpl[]; comunEsOrigen: boolean;
      control?: Control; entradaComun?: string }
  | { k: 'grupo'; tipo: 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion'; vertice: NombreTipado;
      miembros: ExtremoOpl[]; incompleta: boolean }
  | { k: 'descomposicion'; proceso: string; bandas: string[][]; opdPadre?: string; opdHijo?: string }
  | { k: 'despliegue'; cosa: NombreTipado; opdHijo?: string; refinadores: NombreTipado[] }
  | { k: 'no-soportada'; plantilla: string; tId: string } | { k: 'no-canonizada'; plantilla: string; motivo: string };
interface NombreTipado { nombre: string; tipo: TipoCosa }
interface ExtremoOpl extends NombreTipado { estado?: string; mult?: Multiplicidad; genero?: 'f' }
```

**Planificación** (por línea, en el contexto de su OPD `O`: el OPD actual en edición de bloque, o el del encabezado precedente en edición de modelo completo; el encabezado se resuelve `SDx.y → id`, T-167):
1. Resolver nombres por clave DB-1 (T-153). Nombre inexistente → se creará con el tipo que da la tipografía (R-IMPORT-2); estado inexistente de un objeto identificado → se creará (R-IMPORT-3). Nombre existente con otro tipo → **bloqueo** R-IMPORT-7: razón `enlace-invalido-firma`, mensaje «**Pedido** es un objeto; aquí aparece como proceso. Renómbralo o corrige la tipografía».
2. **Sin cambio** ⇔ el hecho ya pertenece a `vista(m, O)` (comparación por clave normalizada del hecho; los hechos abstraídos del padre cuentan, T-168; una línea D6 cuenta si la lista coincide con los visibles).
3. Si no, parches (tipos exactos):

```ts
type Parche =
  | { p: 'crear-entidad'; nombre: string; tipo: TipoCosa; genero?: 'f'; opd: RefOpd }
  | { p: 'traer'; entidad: RefNombre; opd: RefOpd }                          // la cosa existe pero no aparece en O
  | { p: 'cambiar-esencia'; entidad: RefNombre; esencia: Esencia }
  | { p: 'cambiar-afiliacion'; entidad: RefNombre; afiliacion: Afiliacion }
  | { p: 'sincronizar-estados'; objeto: RefNombre; nombres: string[] }        // crea los faltantes al final
  | { p: 'suprimir-estados'; objeto: RefNombre; opd: RefOpd; visibles: string[] }   // DB-19: D6
  | { p: 'aplicar-designacion-estado'; objeto: RefNombre; estado: string; d: Designacion }
  | { p: 'fijar-valor'; atributo: RefNombre; exhibidor: RefNombre; valor: string }
  | { p: 'crear-enlace'; tipo: TipoEnlace; origen: ExtremoRef; destino: ExtremoRef; opd: RefOpd;
      control?: Control; ruta?: string; etiqueta?: string; etiquetaInversa?: string; mult?: MultRef }
  | { p: 'ajustar-enlace'; enlace: RefHecho; control?: Control | null; mult?: MultRef; ruta?: string | null }   // DB-19
  | { p: 'fijar-etiqueta-enlace'; enlace: RefHecho; etiqueta: string }
  | { p: 'fijar-cota'; proceso: RefNombre; lado: 'max' | 'min'; valor: number; unidad: UnidadTiempo }
  | { p: 'crear-abanico'; operador: 'XOR' | 'OR'; ramas: RefHecho[] }
  | { p: 'crear-refinamiento'; clase: 'descomposicion' | 'despliegue'; cosa: RefNombre; modo?: ModoDespliegue; opd: RefOpd }
  | { p: 'fijar-orden'; proceso: RefNombre; bandas: string[][] };
```

   Las cosas nuevas nacen en el OPD de la línea; en un OPD de descomposición, los procesos nombrados en la oración de descomposición nacen subprocesos, los objetos de su cola `, así como …` nacen internos y el resto nace externo. `RefNombre`/`RefHecho` se resuelven **al aplicar** (los nombres pueden nacer en la misma aplicación). Reglas: creación de enlace idempotente sobre (tipo, origen, destino) (T-182); la misma cosa con otro control o multiplicidad → `ajustar-enlace`; un enlace que choca con otro de distinto tipo en el mismo par → `enlace-invalido-firma` (unicidad); `se descompone en` crea/confirma la descomposición, crea subprocesos inexistentes y fija las bandas; un miembro existente que es subproceso de otra descomposición → `referencia-ambigua` (DR-35); `se despliega en` crea/confirma el despliegue con el modo que da la relación de los enlaces del grupo o, sin ellos, `agregacion`.
4. **Nunca borrar por ausencia** (T-172): si el texto editado tiene menos líneas que hechos del alcance, un diagnóstico `no-delete-by-absence` (info) lo dice; ningún parche elimina. El renombrado **no se infiere** del texto libre (evita la identidad posicional de v0): se hace en línea sobre el token (R-OPL-EDIT-7, §7.3.18). Una lista de estados editada que omite uno agrega los nuevos y deja el omitido, con info «`pagado` no aparece; las líneas no borran hechos».

### 5.6 Aplicación todo-o-nada (`opl/aplicar.ts`)

`aplicarOpl(m, lineas: LineaEditada[]): Resultado<Cambio>` sobre una copia inmutable, en tres fases (R-OPL-EDIT-5):
1. **No-enlace**: entidades, traer, esencia/afiliación, estados, supresiones, designaciones, valores, refinamientos, órdenes. Orden: por OPD en preorden, líneas en orden de texto.
2. **Enlaces y cotas**: por OPD en **profundidad descendente** (los hijos antes que los padres, para que una línea abstraída del padre encuentre el hecho refinado ya creado y resulte idempotente), líneas en orden de texto. Cada línea se **re-planifica** contra el modelo vigente en ese momento (sin cambio si ya pertenece a la vista).
3. **Abanicos**: ídem en profundidad descendente.

Cada parche se ejecuta con la operación del núcleo correspondiente (§4.2); el primer rechazo aborta **toda** la aplicación y devuelve la línea y la razón (fail-fast atómico, DR-39). La clasificación del editor (§5.7) usa el mismo procedimiento en modo **ensayo**: aplica sobre copia, registra por línea si cambió algo o falló; las líneas que fallan se marcan `no-aplicable` y el ensayo se repite sin ellas hasta estabilizar (a lo sumo tantas vueltas como líneas fallidas). Así «Aplicar N cambios» aplica exactamente el conjunto que el ensayo probó: nunca falla por una línea que no se tocó (partial-parse, T-179) y nunca aplica a medias. El preview no muta el modelo (T-173). `aplicarOpl(m, [])` devuelve `m` idéntico (T-196).

### 5.7 Editor OPL (`opl/editor.ts`, `ui/EditorOpl.tsx`)

- **Estados de línea** (R-OPL-EDIT-1, precedencia vacía → aplicable → error → sin-cambio): `ignorada-vacia` · `aplicable` (≥1 parche; muestra `descripcionCambio` del primero, p.ej. «crear enlace consumo») · `no-aplicable` (error, con razón) · `sin-cambio` (reconocida y consistente, o warning/info).
- **Razones cerradas** (R-OPL-EDIT-3) con su texto visible: `forma-no-reconocida` «Forma OPL no reconocida» · `entidad-no-existe` «La entidad referida no existe en el modelo» (solo en contextos donde no se puede crear: p.ej. `Estado s de **X**` con X inexistente) · `referencia-ambigua` «Más de una entidad con ese nombre» · `enlace-invalido-firma` «Firma de enlace inválida» · `conflicto-patches` «Cambios incompatibles sobre el mismo hecho» · `inversa-no-soportada` «Edición inversa no soportada» (para `unsupported-canonical`, con el T-ID) · `puntuacion-faltante` «La oración OPL-ES debe terminar en punto» · `cambio-ya-presente` «Este cambio ya está aplicado al modelo» (se usa como detalle de `sin-cambio`, G19).
- **Resumen** (R-OPL-EDIT-2): `N líneas · a aplicables · b no aplicables · c sin cambio · d ignoradas`; botón `Aplicar a cambio(s)` (`Ctrl+Enter`) o `Sin cambios aplicables` deshabilitado.
- **Conflictos**: dos líneas que producen parches incompatibles sobre la misma clave de hecho (p.ej. `e` y `c` para el mismo enlace) → ambas `no-aplicable` con `conflicto-patches`.
- Aplicar = una sola entrada de deshacer (T-180); tras aplicar, el texto se regenera canónico y el editor queda en el mismo bloque con el cursor en la última línea editada.

### 5.8 Garantía de `parsear(generar(m))` y fixture estricto R-§19-SIM-3

1. **Por plantilla** (`plantillas.test.ts`, dirigido por tabla): para cada plantilla C y cada combinación de sus opciones (estado sí/no, multiplicidad `?`/`*`/`+`, género m/f, y/e, o/u, listas de 1..4), `reconocer(generarPlantilla(h)) = h`. Una plantilla nueva sin caso de prueba hace fallar la tabla (el test itera `PLANTILLAS`).
2. **Auto-reparseo** (R-§19-SIM-1): para cada modelo de `fixtures/modelos.ts` y 200 semillas de `fixtures/azar.ts`, `clasificar(m, generar(m))` da 0 errores y 0 parches (todas `sin-cambio`).
3. **Estricto desde vacío** (R-§19-SIM-3, T-192): `generar(m) === generar(aplicarOpl(crearModelo(), parsear(generar(m))))` línea a línea, sobre los mismos modelos. Lo hacen posible: orden DB-2 reproducible desde el texto; fase 2 en profundidad descendente; D6 reconstruye supresiones locales (`suprimir-estados`); la oración de refinamiento fija bandas y crea el OPD antes que sus líneas.
4. **Bisimetrías parciales declaradas** (R-§19-ROT-1, fixture no estricto marcado): escisión (se reconstruye standalone); alcance interno de objetos (un objeto creado desde OPL en un OPD de descomposición nace externo salvo que la oración de descomposición lo nombre en su cola `, así como **X**`, forma solo de parseo); bidireccional (DB-3, se reconstruye como dos uni: mismo texto, otro trazo); supresión global (se reconstruye local en cada OPD); estados ocultos en todos los OPDs (sin nombre en el texto); cosas sin oración en un OPD (sin apariencia reconstruible); `genero` sin oración que lo exprese; `descripcion`; duración sin excepción (DB-15); posiciones y tamaños; `migracionAutomatica`. Los modelos de `azar.ts` se generan en dos perfiles: `estricto` (sin esas construcciones) y `completo` (con ellas, verificando solo las propiedades 1 y 2).
5. **Composición** (T-194): para toda oración con listas, `reconocer(componer(F)) = F` sobre el conjunto de hechos, incluida la inversa de R-FAN-5B (un TS3 por salida y un único abanico).

---

## 6. OPD

### 6.1 Tubería

```
vista(m, opd) ──escena()──▶ Escena (geometría pura, px de lienzo)
                               ├──dibujar()──▶ VNode SVG ──Preact──▶ lienzo vivo  (+ <g> capa UI aparte)
                               └──dibujar()──▶ VNode SVG ──svgTexto()──▶ export canon-diagrama / documento
```

- **Un solo dibujante**: `dibujar(escena, perfil: 'lienzo' | 'canon')` devuelve el mismo árbol en ambos perfiles; `canon` omite atributos `data-*`, fija rótulos en negro (`#000`, T-203) y agrega fondo, `<title>`, `<desc>` y `@font-face`. La **capa UI** (selección, asas, hover, fantasma de enlace, guías, grilla, feedback de destinos) es otro `<g>` que dibuja `ui/lienzo/capaUi.tsx`; no existe en `dibujar`, así que el export no puede contenerla (R-OPD-CAN-3, R-OPD-EXP-3).
- La escena es pura y testeable en Bun sin DOM (texto medido por tabla, DB-20).

```ts
interface Escena { opdId: Id; caja: Rect; nodos: NodoCosa[]; trazos: Trazo[]; simbolos: Simbolo[]; arcos: Arco[] }
interface NodoCosa {
  ref: Ref; forma: 'rect' | 'elipse'; caja: Rect; rol: 'contenedor' | 'interno' | 'externo' | 'refinable' | 'libre';
  contorno: 'solido' | 'discontinuo'; grosor: 1.5 | 4; sombra: boolean;
  rotulo: { lineas: string[]; cursiva: boolean; caja: Rect }; instancia?: string;     // «Nombre : Clase»
  duracion?: string;                                                                   // «[min] {1, 2, 3}»
  estados: NodoEstado[]; ocultos?: { n: number; caja: Rect };
}
interface NodoEstado { ref: Ref; caja: Rect; nombre: string; inicial: boolean; final: boolean; porDefecto: boolean; current: boolean }
interface Trazo {
  ref: Ref; subyacentes: Id[]; tipo: TipoEnlace; puntos: Punto[];
  marcaOrigen?: Marca; marcaDestino?: Marca;                 // punta, piruleta negra/blanca, abierta, arpón
  control?: { letra: 'e' | 'c'; en: Punto }; excepcion?: { barras: 1 | 2; en: Punto; angulo: number };
  multiplicidad?: Array<{ texto: string; en: Punto }>; etiquetas?: Array<{ texto: string; en: Punto; cursiva: true }>;
  ruta?: { texto: string; en: Punto };
}
interface Simbolo { grupo: { refinableId: Id; tipo: TipoEnlace }; refs: Id[]; triangulo: Punto[]; orientacion: 'abajo' | 'arriba' | 'izquierda' | 'derecha'; incompleta: boolean }
interface Arco { abanicoId: Id; centro: Punto; radio: 30; desde: number; hasta: number; doble: boolean }
```

### 6.2 Componentes SVG (`opd/dibujar.ts`)

Funciones puras que devuelven VNode (`h('g', …)`), una por primitiva del vocabulario cerrado (R-VIS-PRIM-1): `Cosa` (rect/elipse + contorno + sombra + rótulo + duración + instancia), `Estado` (rountangle + designaciones), `ChipOcultos`, `FlechaPorDefecto`, `PinCurrent`, `Trazo` (polilínea + marcas + textos), `Triangulo` (4 topologías + barra de incompleta), `ArcoAbanico`, `Rayo` (como polilínea con punta), `BarrasExcepcion`. Cada elemento lleva `data-ref="entidad:o-5"` (perfil lienzo) para la delegación de eventos y el resaltado bimodal.

### 6.3 Geometría (`opd/geometria.ts`)

- **Recorte exacto** (R-OPD-LAY-5): dirección `d` desde el centro `c` hacia el centro del otro extremo.
  - Rectángulo de semiejes `(w/2, h/2)`: `t = min(w/2/|dx|, h/2/|dy|)` (∞ cuando la componente es 0); `p = c + t·d`.
  - Elipse de semiejes `(a, b)`: `t = 1 / √((dx/a)² + (dy/b)²)`; `p = c + t·d`.
  - Estado: rectángulo de la cápsula (radio 8 despreciable para el recorte).
- **Extremos**: si el enlace ancla a un estado visible, el extremo es la cápsula; si el estado está oculto en esa apariencia (no ocurre: la supresión local se rechaza si hay enlace visible), la cosa.
- **Paralelos**: n trazos entre el mismo par de figuras se desplazan `8·(k − (n−1)/2)` px en la normal.
- **Procedimentales**: segmento recto recortado en ambos extremos (DB-8).
- **Estructurales fundamentales, peine ortogonal** (R-OPD-LAY-4, R-OPD-LAY-9): por grupo (refinable R, tipo, estado de origen) visible en el OPD. Orientación por el eje dominante de `centroide(refinadores) − centro(R)`. Para `abajo`: vértice del triángulo en `(R.cx, R.fondo + 24)`, triángulo 30×30 con vértice arriba; bus horizontal a `y = base + 20` (o a mitad de camino hasta el refinador más alto si hay más espacio); trazo R→vértice, base→bus, bus de `min(cx)` a `max(cx)` de los refinadores, y bajadas verticales a la cara superior de cada refinador; un refinador que no está del lado del bus recibe un codo (vertical + horizontal). Las otras orientaciones rotan la construcción. Refinadores ordenados por x (sin cruces internos por construcción).
- **Etiquetados**: segmento recto; unario (origen = destino) → lazo de 4 vértices sobre la cosa.
- **Invocación, rayo** (T-211): `P0`, `P3` recortados; `L = |P3−P0|`; `o = min(22, max(12, 0,08·L))`; `P1 = P0 + 0,45L·u + o·n`, `P2 = P0 + 0,55L·u − o·n`; punta en `P3` orientada por `P3−P2`.
- **Autoinvocación**: lazo bajo la elipse entre los puntos a 90°±35° (y hacia abajo), pico a `max(56, 0,55·h)` bajo el borde inferior, zigzag en el tramo de regreso y punta entrando al proceso (portado de `autoinvocacionLoop.ts`).
- **Excepción**: segmento recto fuente→manejo; barras `/` (1) o `//` (2) a `t = 0,85` desde la fuente, rotadas con el segmento; sin punta (DR-38).
- **Abanico** (T-216, DR-9): extremo común C; punto de anclaje `D = recorte(C, centroide(otros extremos) − centro(C))`; todas las ramas nacen/llegan en D; ángulos θᵢ de las ramas desde D; el arco cubre el complemento del mayor hueco angular (portado de `angulosExtremos`); XOR un arco r30, OR dos arcos r30 y r35; stroke 1,5, dash `4 1`. AND = sin arco.
- **Posiciones de texto a lo largo de polilíneas** por longitud de arco: control `e`/`c` a 20 px del perímetro del proceso, desplazado 10 px en la normal, dentro de un círculo r9 (§18.2); multiplicidad a 14 px del perímetro del objeto, desplazada 10 px; etiqueta de etiquetado en el punto medio, desplazada 10 px, itálica; bidireccional: etiqueta-f cerca del destino (t=0,75), etiqueta-b cerca del origen (t=0,25); ruta en t=0,33, desplazada 12 px.
- **Intersecciones** (para calidad, §6.9): segmento-segmento, segmento-rectángulo, rectángulo-rectángulo.

### 6.4 Marcadores (`opd/marcadores.ts`, paths literales de spec-OPD §18.3)

| Marcador | Path / construcción | Relleno | Uso |
|---|---|---|---|
| Punta transformadora (swallowtail, 23×16) | `M 0 0 L 23 8 L 12 0 L 23 -8 Z` | paper, stroke ink 1 | consumo (en el proceso), resultado (en el objeto), efecto (ambos), TS4 (hacia el proceso), TS5 (hacia el estado), fin del rayo |
| Piruleta | `M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0` | agente: ink · instrumento: paper | extremo proceso (T-210) |
| Punta abierta | polilínea `0,0 20,-10 0,0 20,10` | sin relleno | etiquetado unidireccional |
| Arpón | polilínea `0.5,0 20,10` (un lado) | sin relleno | bidireccional y recíproco (en cada extremo, lados opuestos) |
| Sobretiempo `/` | polilínea `4,10 13,-10` | trazo ink | excepción por sobretiempo |
| Subtiempo `//` | polilínea `4,10 13,-10 8.5,0 17,0 13,10 22,-10` | trazo ink | excepción por subtiempo |
| Triángulo estructural 30×30 | polígono `15,0 30,30 0,30` | agregación: ink · generalización: paper · exhibición: paper + triángulo interior 12×12 ink en (+9,+12) · clasificación: paper + círculo r4 ink en (15,20) | vértice al refinable (T-212) |
| Colección incompleta | segmento de 18 px paralelo a la base, a 6 px bajo ella | ink | T-217 |

Los marcadores se dibujan como `<path>` transformados (no `<marker>`), para que el export sea idéntico en cualquier visor.

### 6.5 Layout (`opd/layout.ts`)

- **Rótulos** (T-204, AP-23): envoltura por palabras al ancho `max(ancho − 16, 120)`; una palabra más ancha ensancha la figura; nunca elipsis. Alto de línea 20 (Inria Serif 17), cursiva para procesos. El tamaño renderizado es `max(ancho/alto persistidos, contenido)`: el autosize **expande** la forma (R-ROT-2).
- **Estados en el objeto** (T-206, DB-9): cápsulas de alto 24, ancho `max(52, texto + 16)` (Inria Serif itálica 13), separación 8, en filas de izquierda a derecha en la región inferior; ancho de fila máximo = ancho interior; alto del objeto = 8 + bloque del rótulo + 8 + filas·32 + 4. Con estados ocultos, chip `⋯N` 26×14 (r7) en la esquina inferior derecha (T-208).
- **Designaciones**: inicial = stroke 3; final = relleno `estadoFinalFill` + rectángulo interior con padding 3 y stroke 1; inicial y final = ambos (D10); por defecto = flecha diagonal abierta **entrante** desde abajo a la izquierda (segmento de 14 px a 45° con punta abierta tocando la esquina inferior izquierda de la cápsula, R-OPD-EST-7); `Current` declarado = **pin externo** (segmento de 8 px desde la esquina superior derecha hacia afuera y círculo relleno r3,5 en su extremo, R-OPD-EST-6, DR-37). Ninguna marca reutiliza el canal UI.
- **Duración** (T-220): bajo el rótulo del proceso, `[min] {1, 2, 3}` (Inria Serif 11, inkMid); valores ausentes como `–`; sin duración no se dibuja nada.
- **Posición libre**: búsqueda en espiral (paso 24 px) desde el punto pedido hasta una caja sin solape (margen 16) con otras cosas; en OPD de descomposición, fuera del contenedor para externos y dentro para internos.
- **Posiciones por defecto** (R-OPD-LAY-9, DEBERÍA): una cosa creada como destino nuevo del enlace rápido (§7.3.6) se ubica con el objeto arriba y el proceso abajo (140 px de separación vertical, misma x); los refinadores de un despliegue, debajo del refinable; los externos de una descomposición, en columnas (abajo). No hay auto-layout global: nada se reubica sin un gesto del modelador (foco estable).
- **Externos al descomponer**: contenedor 405×300 en el centro; columna izquierda (a 120 px del contenedor): cosas con consumo, efecto, agente, instrumento hacia P; columna derecha: cosas con resultado desde P; arriba: procesos que invocan a P o fuentes de excepción; abajo: cosas con enlaces estructurales a P; cada columna ordenada por nombre y centrada verticalmente, separación 24.
- **Bandas** (`realizarBandas`): la banda k ocupa `y = contenedor.y + 100 + k·(alto_banda + 30)` (alto_banda = el mayor alto de sus subprocesos); dentro de la banda, subprocesos en el orden del arreglo, separados 40 y centrados en el área izquierda del contenedor; los objetos internos se apilan en una columna a la derecha dentro del contenedor (conservan su posición si el modelador los movió, confinados); el contenedor crece para contener todo con padding 40 lateral, 100 superior, 65 inferior (R-ANID-1). Se ejecuta tras toda operación que cambie las bandas; nunca las reordena (R-LAY-4).
- **Despliegue**: refinable arriba al centro; refinadores en una fila 160 px abajo, ordenados por nombre, separación 40.
- **Al cambiar de OPD**: la cámara centra el bbox real del contenido (R-OPD-LAY-10) conservando el zoom si el contenido cabe; si no cabe, ajusta.

### 6.6 Tokens visuales (`opd/tokens.ts`, informativos §18.1–18.2)

| Token | Valor | Uso |
|---|---|---|
| paper | `#fafaf8` | fondo, relleno de marcadores huecos, relleno de cosas |
| paperWarm | `#eeece2` | resaltado bimodal entrante (hover OPL→OPD y OPD→OPL) |
| ink | `#171511` | enlaces, marcadores, textos en el lienzo |
| inkMid / inkSoft | `#5a564c` / `#807b6e` | etiquetas secundarias (duración, multiplicidad) / textos de UI |
| opmObjeto / opmProceso | `#27613f` / `#1d3f78` | stroke de objeto / proceso (informativo; la semántica no depende del color, T-203) |
| opmEstado / estadoFill / estadoFinalFill | `#68711f` / `#dedacb` / `#d6d2c6` | estados |
| crimson / crimsonSuave | `#8e2a2e` / `rgba(142,42,46,0.06)` | canal UI exclusivo: selección, asas, foco, marquee, feedback de destinos (T-227) |
| strokes | entidad 1,5 · estado 1,2 · enlace 1 · estructural 1,2 · inicial 3 · refinada 4 | |
| dashes | ambiental `8 4` · abanico `4 1` · guías UI `1 3` (nunca `8 4`, T-229) | |
| sombra física | `feDropShadow dx=6 dy=6 stdDeviation=2 flood-color=#171511 flood-opacity=0.68` | solo esencia física (T-201) |
| tipografía | rótulos Inria Serif 17 (proceso itálica) · estados Inria Serif itálica 13 · etiquetas de enlace 11–12 · UI Inria Sans · OPL estados JetBrains Mono | |

**z-order** (§18.4): contenedor (0) < enlaces y bus estructural (4) < arcos de abanico (5) < cosas (10) < triángulos (12) < enlaces a estados (20) < capa UI (30).

### 6.7 Selección, hover y resaltado en el lienzo (canal UI)

- Selección: subrayado crimson de 1,2 px bajo el rótulo y asas 8×8 cuadradas crimson en las 8 posiciones (no círculos: distintas de las piruletas, R-DEC-2A); la selección nunca redibuja el borde semántico (R-OPD-UI-2).
- Hover bimodal: relleno `paperWarm` de la figura (cosa, cápsula) o halo `paperWarm` de 6 px bajo el trazo; el vínculo es la referencia tipada, nunca el color ni el texto (T-242).
- Destinos válidos durante un enlace: contorno crimson punteado `1 3` en las figuras con al menos un tipo válido; las demás se atenúan al 40 % (R-OPD-UI-5). Durante el arrastre, sobre un destino sin tipo válido, un `×` crimson junto al cursor (R-OPD-VAL-3, fuera de canon).
- El lienzo no dibuja marcas de validación persistentes (T-228): los hallazgos viven en el panel.

### 6.8 Modos del lienzo (T-230)

`edicion` (normal) · `navegacion` (documento de solo lectura mientras hay conflicto o sesión expirada: asas ocultas, gestos de mutación desactivados) · `gestion-modal` (menú, paleta o diálogo abierto: capa UI oculta, lienzo atenuado) · `estatico` (`F9`: el lienzo muestra exactamente el perfil `canon`, sin capa UI, para revisar el export) · `runtime`: no implementado, declarado en conformidad.

### 6.9 Export y gates (`opd/exportar.ts`, `opd/calidad.ts`)

- **canon-diagrama** (T-280): `exportarSvgOpd(m, opdId) → { svg, bloqueos, advertencias }`. SVG autocontenido: `viewBox` = bbox de todo lo dibujado (incluidas sombras +6, arcos, textos) inflado 24 px; `width/height` = tamaño del viewBox; fondo `paper`; `<title>SD1 · Cocinar</title>`; `<desc>canon-diagrama · <modelo> · OPD SD1 de N (export parcial) · <fecha ISO></desc>` (metadato mínimo y declaración de export parcial, T-285); `<style>` con `@font-face` Inria Serif regular e itálica (subconjunto latino, woff2 en base64); sin `data-*`, sin capa UI, sin grilla.
- **canon-documento** (T-281): un HTML único: portada (nombre, fecha, descripción), árbol de OPDs, y por cada OPD en preorden `<h2>SDx · título</h2>` + SVG + OPL canónico del bloque como lista (`<b>`, `<i>`, `<code>`); la fuente se incrusta una vez.
- **OPL** (T-282): Markdown `# <modelo>` y por OPD `## SDx · título` seguido de una oración por ítem `- …` (canónico, parseable: el parser quita la viñeta).
- **JSON** (T-286): `exportarV0` (perfil intercambio: nunca bloqueado, no certifica conformidad).
- **Gates del export canónico** (T-283), por OPD o por modelo: (1) OPD con >25 cosas; (2) refinamiento con <2 subprocesos/refinadores (el OPD hijo y el documento); (3) hallazgos `error` en el alcance; (4) rótulos truncados: imposible por autosize (verificado por prueba). El bloqueo muestra la lista con acción «Ir» y no afecta la edición.
- **Advertencias** (T-284): cruces entre trazos que no comparten extremo, trazos que atraviesan cosas ajenas, cosas solapadas (excepto contenedor–interno). Se muestran en un diálogo «Exportar igualmente / Cancelar» con cada advertencia navegable. No se re-rutea automáticamente (el canon admite advertir).

---

## 7. Experiencia de usuario

### 7.1 Pantalla y superficies

**Escritorio (≥ 1100 px)**

```
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ opforja │ Cocina doméstica │ SD › SD1 Cocinar › SD1.2 Hervir │           ● Guardado │  ⌘K       │  cabecera 40 px
├──────────────────┬─────────────────────────────────────────────────────┬──────────────────────┤
│ OPD              │                                                     │ OPL          ⋯  ✎    │
│ ▾ SD             │                                                     │ SD1 · Cocinar        │
│   ▾ SD1 Cocinar  │                                                     │ *Cocinar* se descom- │
│       SD1.1 Pic… │                 lienzo SVG (OPD actual)             │ pone en *Hervir*, …  │
│       SD1.2 Her… │                                                     │ **Agua** es física.  │
│   ▸ SD2 Pedido   │                                                     │ *Hervir* consume …   │
│──────────────────│                                                     │ ▸ SD                 │
│ FICHA            │                                                     │ ▸ SD2 · Pedido       │
│ **Agua**  objeto │                                                     │──────────────────────│
│ esencia  ◉ fís.  │                                                     │ DIAGNÓSTICO  1 · 4 · 2│
│ afiliac. ◉ sist. │                                                     │ ✕ *Mezclar* sin …    │
│ estados  …       │ Enlace desde **Agua**: elige destino · Tab · Esc    │ ⚠ …                  │
│ aparece en SD,SD1│                                              100 %  │                      │
└──────────────────┴─────────────────────────────────────────────────────┴──────────────────────┘
   columna izquierda 240 px            lienzo (flexible)                   columna derecha 380 px
   (Ctrl+B)                                                                  (Ctrl+J)
```

**Estrecho (< 1100 px)**: una columna; cabecera compacta (`☰` abre la paleta); el área principal muestra un panel a la vez con selector inferior; la selección y el OPD son compartidos entre paneles.

```
┌──────────────────────────────────┐
│ ☰  Cocina · SD1 › …    ●   ⌘K    │
├──────────────────────────────────┤
│                                  │
│     panel activo (a pantalla)    │
│                                  │
│ mensaje de estado          100 % │
├──────────────────────────────────┤
│  Lienzo │  OPL  │ Árbol │ Ficha  │
└──────────────────────────────────┘
```

**Inventario de superficies (10, frente a ~38 modales + 4 menús + halo + cintas en v0)**

| # | Superficie | Clase | Justificación |
|---|---|---|---|
| 1 | Login | pantalla | una cuenta; también como diálogo de reingreso sin perder el trabajo |
| 2 | Biblioteca | pantalla | listar/abrir/crear/importar/eliminar (infraestructura mínima) |
| 3 | Cabecera | zona | identidad del modelo, ruta OPD (navegación), estado de guardado único, acceso a comandos |
| 4 | Columna izquierda: Árbol + Ficha | zona | navegar 36 OPDs (R-ARB-1) y editar propiedades que no tienen gesto directo (género, descripción, duración, `Current`, etiquetas inversas) |
| 5 | Lienzo (+ barra de estado) | zona | el OPD; la barra de estado es el único canal de mensajes transitorios |
| 6 | Columna derecha: OPL + Diagnóstico | zona | bimodalidad activa (T-240) y panel de validación (T-228) visibles a la vez que el lienzo |
| 7 | Menú de enlace | transitoria | tipos filtrados por la matriz con vista previa OPL (T-040, R-OPD-UI-5) |
| 8 | Menú contextual | transitoria | comandos aplicables al elemento bajo el cursor (también el selector de modo de despliegue) |
| 9 | Paleta | transitoria | todos los comandos y búsqueda de cosas (modo «cosas» para traer/buscar) |
| 10 | Diálogo genérico | transitoria | confirmar destructivos, elegir en conflictos, informe de importación, bloqueos/advertencias de export |

**Panel OPL en vivo (la segunda mano).** Tras cada operación, el bloque del OPD actual resalta 2 s las líneas nuevas o cambiadas (comparación por `LineaOpl.id` estable, no por posición) y, si están fuera de vista, desplaza el panel hasta la primera; en su cabecera, una **franja de cambios** de una línea muestra la descripción de la última operación y sus ajustes automáticos («Descomponer *Cocinar* en SD1 · 3 ajustes ▸»), desplegables. Nada de eso mueve el lienzo.

Edición en línea (nombre, estado, etiqueta, ruta, renombrado desde OPL) ocurre **en el lugar**, no es superficie. No hay barra de herramientas, cintas, pestañas internas, asistentes, tutor, halos flotantes ni mapa.

### 7.2 Atajos de teclado

Un solo registro (`ui/comandos.ts`) alimenta paleta, menú contextual, atajos y botones de la ficha; la paleta muestra el atajo de cada comando (y `?` la abre filtrada a atajos). Las teclas simples solo actúan con el foco en el lienzo, el árbol o el panel OPL (nunca dentro de un campo de texto).

| Contexto | Tecla | Acción |
|---|---|---|
| global | `Ctrl+K` / `Ctrl+F` | paleta de comandos / buscar cosa (paleta en modo cosas) |
| global | `Ctrl+Z` · `Ctrl+Shift+Z` o `Ctrl+Y` | deshacer · rehacer |
| global | `Ctrl+S` | guardar ahora |
| global | `Ctrl+E` | editar OPL del OPD actual |
| global | `Ctrl+B` · `Ctrl+J` · `Ctrl+.` | columna izquierda · columna derecha · solo lienzo |
| global | `F8` · `Shift+F8` | hallazgo siguiente · anterior |
| global | `F9` | vista canon (lienzo estático = export) |
| global | `Alt+↑` | OPD padre (el retroceso del navegador vuelve al OPD anterior) |
| global | `Ctrl+0` · `Ctrl+1` · `Ctrl+=` · `Ctrl+-` | ajustar vista · 100 % · acercar · alejar |
| global | `Esc` | cerrar lo transitorio → cancelar el gesto → deseleccionar |
| lienzo | `O` · `P` · doble clic en vacío | crear objeto · proceso en el puntero · crear del último tipo usado |
| lienzo | `T` · `Ctrl+C` · `Ctrl+X` · `Ctrl+V` | traer cosa existente · copiar · cortar (copiar + quitar de este OPD) · pegar (= traer) |
| lienzo | `Tab`/`Shift+Tab` · flechas | recorrer cosas en orden de lectura · mover la selección a la cosa más cercana en esa dirección |
| lienzo | `Ctrl+A` · `Shift+clic` · `Shift+arrastre` | seleccionar todo · agregar a la selección · marquee |
| lienzo | `Espacio`+arrastre · rueda · `Ctrl+rueda`/pellizco | desplazar · desplazar · zoom al cursor (10 % por paso, 20 %–400 %) |
| cosa | `F2` o doble clic en el rótulo | renombrar |
| cosa | `Enter` · `Shift+Enter` | entrar a su descomposición · a su despliegue |
| cosa | `L` · `S` | iniciar enlace · nuevo estado (objeto) |
| cosa | `Shift+I` · `Shift+U` | descomponer (proceso) · desplegar (elige modo 1–4) |
| cosa | `Shift+F` · `Shift+A` | alternar física/informacional · sistémica/ambiental |
| cosa | `Supr` · `Shift+Supr` | quitar de este OPD · eliminar del modelo (confirma) |
| cosa | `Alt+flechas` (`+Shift` = 1 px) | mover 8 px |
| subproceso | `Alt+↑`/`Alt+↓` · `Alt+Shift+↑`/`↓` · `Alt+←`/`→` | a banda propia antes/después · unirse a la banda anterior/siguiente (paralelo) · reordenar dentro de la banda |
| estado | `I` · `F` · `D` | alternar inicial · final · por defecto |
| estado | `H` · `Shift+H` | ocultar en este OPD · en todos (global) |
| estado | `S` · `L` · `F2` · `Alt+←/→` · `Supr` | nuevo estado a continuación · enlace desde el estado · renombrar · reordenar · eliminar |
| enlace | `Enter` | cambiar tipo (menú de enlace para el mismo par) |
| enlace | `E` · `C` | alternar evento · condición |
| enlace | `M` · `Shift+M` | rotar multiplicidad del extremo objeto/destino · del origen (—, `?`, `*`, `+`) |
| enlace | `R` · `F2` | ruta · etiqueta(s) |
| enlace | `X` · `Shift+X` · `Alt+X` | abanico XOR · OR con los enlaces seleccionados (o alternar operador) · disolver |
| enlace | `Supr` | eliminar el enlace |
| triángulo | `I` · `Enter` | colección incompleta · agregar refinador |
| editor de nombre | `Enter` · `Shift+Enter` · `Tab` · `Esc` | confirmar · confirmar y crear otro debajo · alternar objeto/proceso (al crear) · cancelar |
| editor de subproceso | `Enter` · `Tab` · `Esc` | confirmar y seguir en banda nueva · confirmar y seguir en la misma banda · terminar |
| editor de estado | `Enter` · `Esc` | confirmar y seguir con otro estado · terminar |
| menú de enlace | `↑↓` · `1`–`9` · `Enter` · `Tab` · `Esc` | elegir · elegir directo · crear · saltar al grupo de la otra orientación · cancelar |
| panel OPL | clic · doble clic · `Alt+clic` | seleccionar el elemento del token · editar en línea (nombre, estado, etiqueta; verbo → ficha del enlace) · filtrar el panel por esa referencia |
| editor OPL | `Ctrl+Enter` · `Ctrl+↓`/`↑` · `Esc` | aplicar N cambios · siguiente/anterior no aplicable · salir |
| árbol | `↑↓` · `←→` · `Enter` · `Alt+↑/↓` | recorrer · plegar/expandir · abrir OPD · reordenar hermanos |
| biblioteca | `/` · `↑↓` · `Enter` · `N` · `I` · `Supr` | buscar · recorrer · abrir · nuevo · importar · eliminar |

### 7.3 Flujos

#### 7.3.1 Entrar
1. Cualquier URL sin sesión (`GET /api/sesion` → 401) muestra **Login**: «Usuario», «Clave», «Entrar». Foco en usuario.
2. Error: «Credenciales inválidas» (uniforme); tras 10 intentos en 10 min: «Demasiados intentos; espera unos minutos» (429).
3. Éxito → la URL pedida (`#/m/<id>/<opd>`) o la Biblioteca. Cerrar sesión: paleta «Cerrar sesión».
4. Sesión vencida durante la edición (401 al guardar): el mismo Login aparece como diálogo sobre el editor; al entrar se reintenta el guardado pendiente; el lienzo queda en modo `navegacion` mientras tanto.

#### 7.3.2 Biblioteca
- **Lista** (orden: modificado reciente primero): nombre, «modificado hace 3 min», tamaño. Campo de búsqueda con foco (`/`), filtra por nombre sin tildes.
- **Nuevo** (`N` o botón): aparece en la parte superior un campo «Nombre del modelo»; `Enter` crea (POST) y abre el editor en SD vacío; `Esc` cancela.
- **Abrir**: `Enter` o clic; abre `#/m/<id>/<opdRaizId>`.
- **Importar** (`I`, botón o soltar un `.json` sobre la lista): se ejecuta `importarV0` → Diálogo con el informe: rechazo (motivo y ruta: «referencia rota: `enlaces.e-19.destinoId` → `o-99` no existe») o resumen: «Se importará **Cocina** (15 cosas, 33 enlaces, 2 OPDs). No representado: 4 campos (probabilidad ×2, demora, ficha de trabajo). Descartado: 1 enlace negado («**Chef** no maneja *Lavar*»). Normalizado: 13 enlaces derivados → distribución por contorno; 1 par consumo+resultado → cambio de estado. 2 errores recuperables» con grupos plegables; botones «Importar como modelo nuevo» / «Cancelar». Importar crea una copia (id nuevo) y la abre.
- **Eliminar** (`Supr`): Diálogo «¿Mover **Cocina** a la papelera del servidor? Se conserva 30 días.» (foco en «Cancelar»).

#### 7.3.3 Crear objeto o proceso y nombrarlo
1. Con el puntero sobre el lienzo, `O` (u `P`); o doble clic en vacío.
2. En el punto aparece el **editor de nombre** con la tipografía de la clase (negrita para objeto, cursiva para proceso) y la forma fantasma (rectángulo/elipse) en canal UI.
3. Mientras se escribe, una línea bajo el editor valida el léxico (R-§18-LEX-1): «Solo letras, dígitos, `-` y `_`»; si hay que capitalizar: «Se escribirá **Agua caliente**» (nunca en silencio, T-025).
4. Si la clave ya existe: «Ya existe **Agua** (en SD, SD1) · Enter la trae aquí · sigue escribiendo para otro nombre» (T-065: reusar / renombrar / descartar). Si existe con el otro tipo: «Ya existe *Agua* como proceso · Enter lo trae».
5. `Tab` alterna objeto/proceso. `Enter` crea (o trae); `Shift+Enter` crea y abre otro editor 100 px debajo; `Esc` cancela: no se crea nada (DR-11).
6. Resultado: la cosa queda seleccionada; el panel OPL resalta sus líneas nuevas (si las hay; una cosa informacional sistémica sin enlaces no emite oración, y en display `siempre` aparece su D2 atenuada).
7. Dentro del contenedor de una descomposición, `P` crea un subproceso (§7.3.10) y `O` un objeto interno; fuera, un externo.

#### 7.3.4 Esencia y afiliación
- `Shift+F` alterna física: aparece la sombra; el OPL agrega/quita «**Agua** es física.». `Shift+A` alterna ambiental: contorno discontinuo; «**Agua** es ambiental.».
- En la ficha: dos conmutadores segmentados. Volver ambiental un exhibidor propaga a sus rasgos (atributos y operaciones); el ajuste lo informa en la franja del OPL: «2 rasgos de **Sensor** pasaron a ambientales (R-OBJ-6)».

#### 7.3.5 Estados y designaciones
1. Objeto seleccionado, `S`: al final de la fila de estados aparece un editor de cápsula. «pendiente» `Enter` → siguiente editor → «pagado» `Enter` → «anulado» `Esc`. El nombre se valida como una palabra en minúscula (si empieza en mayúscula: «Se escribirá `pendiente`»).
2. OPL: «**Pedido** puede estar `pendiente`, `pagado` o `anulado`.».
3. Clic en una cápsula selecciona el estado. `I` inicial (borde grueso; «Estado `pendiente` de **Pedido** es inicial.»); `F` final (doble borde); `I` y `F` sobre el mismo → «… es inicial y final.» (D10); `D` por defecto (flecha diagonal entrante; quita la anterior, con ajuste). `Current` declarado: ficha o paleta (pin externo; «… es declarado `Current`.»).
4. `H` oculta el estado en este OPD: chip `⋯1`; OPL local «**Pedido** puede estar `pendiente`, `pagado`, y otros estados.». Si el estado tiene un enlace visible aquí, se rechaza: «`anulado` tiene un enlace en este OPD; no puede ocultarse aquí (LF-03)». `Shift+H` global.
5. `Alt+←/→` reordena; `F2` renombra; `Supr` elimina (si hay enlaces anclados, Diálogo: «Los 2 enlaces anclados a `pagado` quedarán sobre **Pedido**» con la lista).

#### 7.3.6 Crear enlace
**Con el mouse**
1. Al pasar sobre una cosa o una cápsula aparece su **anillo de conexión** (crimson fino, canal UI).
2. Arrastrar desde el anillo o desde una cápsula: una línea fantasma sigue al puntero; los destinos con ≥1 tipo válido se marcan con contorno punteado; el resto se atenúa; sobre un destino sin tipos válidos aparece `×`.
3. Soltar sobre una cosa o un estado abre el **Menú de enlace** en el punto:

```
┌ **Agua** en `fría` → *Hervir* ──────────────────────────────┐
│ 1  consumo      *Hervir* consume **Agua** en `fría`.        │ ◀
│ 2  efecto       *Hervir* cambia **Agua** de `fría`.         │
│ 3  instrumento  *Hervir* requiere **Agua** en `fría`.       │
│ ─ desde *Hervir* ─                                           │
│ 4  resultado    *Hervir* genera **Agua** en `fría`.         │
│ ▸ 9 tipos no disponibles                                     │
└ ↑↓ · 1–9 · Enter · Tab otra orientación · Esc ───────────────┘
```

   Cada vista previa es la línea que emitirá el **generador real** para el enlace candidato. «9 tipos no disponibles» se despliega con los motivos (p.ej. «agente: solo desde objeto físico (AP-05)», «resultado: nunca al estado inicial (AP-04)»). El resaltado inicial es el último tipo usado para ese par de clases y orientación; si no hay, el orden de fuerza.
4. `Enter` o dígito crea el enlace; el OPL resalta la oración nueva; el enlace queda seleccionado.

**Con el teclado**
1. Seleccionar la cosa o el estado de origen, `L`. Barra de estado: «Enlace desde **Agua**: elige destino · Tab/flechas · escribe un nombre · Esc».
2. `Tab`/flechas recorren solo los destinos válidos; o se escribe: aparece un buscador en el lugar con coincidencias y, al final, «Crear objeto «Leche»» / «Crear proceso «Leche»» (`Tab` alterna). Una cosa nueva se ubica según §6.5 (objeto arriba, proceso abajo).
3. `Enter` abre el Menú de enlace; igual que arriba.

**Casos del segundo gesto** (la unicidad de rol convierte el conflicto en ayuda):
- Existe TS4 `*Pagar* cambia **Pedido** de `pendiente`.` y se arrastra de *Pagar* a `pagado`: primera fila «Completar cambio: de `pendiente` a `pagado`» (`completarCambioDeEstado`).
- Existe resultado a `aprobado` y se arrastra el mismo tipo a `rechazado`: filas «Abanico XOR con el resultado existente» / «Abanico OR…» (R-FAN-5, DR-6); la fila simple aparece bloqueada con el motivo.
- Existe consumo **Agua**→*Hervir* y se intenta instrumento: fila bloqueada «Ya existe consumo entre **Agua** y *Hervir* (un procedimental por par, T-053)» con acción «Cambiar tipo del existente».
- Excepción sin cota: la fila avisa «⚠ *Hervir* no tiene duración máxima: se escribirá “excede su duración máxima”»; al crear, la ficha enfoca el campo «máx» de *Hervir* (pedir el dato).

#### 7.3.7 Control e/c
- Enlace seleccionado, `E`: aparece `e` junto al extremo proceso; el OPL cambia de T1 a ET1 («**Agua** inicia *Hervir*, que consume **Agua**.»). `C` reemplaza por `c` (CT1). La misma tecla quita.
- Donde no aplica, sin cambio y con motivo en la barra: «El resultado no admite evento (AP-02): pon el evento en un enlace de entrada».
- En la ficha: selector «ninguno · evento · condición» con opciones deshabilitadas explicadas.

#### 7.3.8 Etiquetas, ruta, multiplicidad
- Al crear un etiquetado se abre el editor de etiqueta en el punto medio (frase en minúscula): «usa» → «**Chef** usa **Receta**.»; sin etiqueta → «… se relaciona con …». Bidireccional: dos campos (`Tab`). Recíproco: una etiqueta opcional.
- Ruta (consumo/resultado): `R` abre el editor «Por ruta …»: «L1» → «Por ruta L1, *Hervir* consume **Agua**.».
- Multiplicidad: `M` rota el extremo objeto (—, `?`, `*`, `+`): «*Cocinar* requiere al menos una **Olla**.» (género de **Olla** = f, en la ficha). En etiquetados, `M` destino y `Shift+M` origen. No se ofrece junto con `c` (DR-44): «La condición no admite multiplicidad en OPL».

#### 7.3.9 Abanicos XOR/OR
1. Seleccionar dos consumos hacia *Hervir* (`Shift+clic`) y pulsar `X`: arco discontinuo en el punto común de *Hervir*; OPL «*Hervir* consume exactamente uno de **Agua** o **Leche**.». `Shift+X`: doble arco; «al menos uno de».
2. Con el abanico seleccionado (clic en el arco): `X` alterna XOR/OR; `Alt+X` lo disuelve (vuelve a AND: enlaces separados sin arco).
3. Agregar una rama: arrastrar un enlace del mismo tipo al extremo común; el menú ofrece «Agregar al abanico XOR».
4. Rechazos con motivo: tipos distintos, sin extremo común, control mixto (`non-canonical`), control sin plantilla (`unsupported-canonical`, T-056), resultado/invocación con control (AP-03).

#### 7.3.10 Descomponer y ordenar subprocesos en bandas
1. En SD, *Cocinar* seleccionado, `Shift+I`: operación atómica; la cámara entra a SD1 (la URL cambia; ruta «SD › SD1 Cocinar»). *Cocinar* aparece como contenedor con contorno grueso; sus cosas conectadas, como externos alrededor.
2. Se abre el **editor de subproceso** en la primera banda del contenedor: «Hervir» `Enter` → banda 1; el editor pasa a una banda 2 nueva: «Picar» `Tab` → banda 2 y el siguiente editor queda **en la misma banda**: «Pelar» `Enter` → banda 2 = {Picar, Pelar}; editor en banda 3: «Servir» `Enter`; editor en banda 4 vacío `Esc` termina.
3. Con el primer subproceso, los consumos y eventos sistémicos migran a *Hervir*, el TS3 migra entero; con el último, el resultado migra a *Servir* y el TS3 se escinde (TS4 en *Hervir*, TS5 en *Servir*). La franja de ajustes del OPL lo lista.
4. OPL de SD1: «*Cocinar* se descompone en *Hervir*, paralelo *Picar* y *Pelar*, y *Servir*, en esa secuencia.», más las oraciones atómicas de cada enlace. SD muestra los hechos abstraídos: «*Cocinar* consume **Agua**.».
5. Reordenar: subproceso seleccionado, `Alt+↓` lo lleva a una banda propia después; `Alt+Shift+↑` lo une a la banda anterior; `Alt+←/→` dentro de la banda. Con el mouse, arrastrar verticalmente: una guía crimson indica «nueva banda entre 1 y 2» o «unirse a la banda 2»; el arrastre queda confinado al contenedor (R-OPD-UI-3). Cada reordenamiento actualiza CXm, re-migra los enlaces automáticos y, si una invocación queda entre bandas consecutivas, la marca como error recuperable con acción «Eliminar invocación redundante».

#### 7.3.11 Desplegar por modo
1. **Pedido** seleccionado, `Shift+U`: menú contextual «Desplegar por: 1 agregación · 2 exhibición · 3 generalización · 4 clasificación».
2. `1`: se crea SD2 y se entra; **Pedido** arriba, sus partes existentes debajo con el triángulo relleno. Sin partes, el editor de refinador aparece debajo: «Cabecera» `Enter`, «Línea» `Enter`, `Esc`. En exhibición, `Tab` alterna atributo (objeto) / operación (proceso).
3. OPL de SD2: «**Pedido** se despliega en SD2 en **Cabecera** y **Línea**.», «**Pedido** consta de **Cabecera**.», «**Pedido** consta de **Línea**.». SD agrupa: «**Pedido** consta de **Cabecera** y **Línea**.».

#### 7.3.12 Colección incompleta
Clic en el triángulo (selecciona el grupo), `I` o la casilla de la ficha: barra corta bajo el triángulo; OPL «**Pedido** consta de **Cabecera**, **Línea** y al menos otra parte.» (en OPDs hijos, cada oración atómica del grupo lleva la cola). Se ofrece para agregación, exhibición y generalización; nunca clasificación (T-034).

#### 7.3.13 Navegar el árbol OPD
- El árbol muestra `SD`, `SD1 · Cocinar`, `SD1.1 · Picar`, `SD2 · Pedido · agregación`; el actual resaltado; cada nodo con un contador discreto de hallazgos `error`.
- Clic/`Enter` abre; `Alt+↑` al padre; la ruta de la cabecera es clicable; el retroceso del navegador vuelve al OPD anterior (cada cambio de OPD es una entrada de historial).
- Desde el lienzo: `Enter` sobre una cosa refinada entra; en el hijo, `Alt+↑` vuelve.
- Al llegar: se centra el bbox real (R-OPD-LAY-10); si la cosa seleccionada aparece en el OPD destino, sigue seleccionada.
- `Alt+↑/↓` en el árbol reordena hermanos: cambian las etiquetas `SDx.y` (no los ids); el OPL de encabezados se actualiza.

#### 7.3.14 Traer cosa existente
- `T` (o `Ctrl+F` → `Alt+Enter`): paleta en modo cosas, búsqueda difusa por nombre: «**Agua** · objeto · en SD, SD1»; `Enter` la trae al puntero (externo si el OPD es de refinamiento). Sus enlaces con cosas visibles aparecen solos (visibilidad derivada).
- Multi: `Ctrl+C` en un OPD, navegar, `Ctrl+V`: trae todas conservando la disposición relativa (mover entre OPDs = `Ctrl+X` + `Ctrl+V`, T-248).
- Desde el diagnóstico: `COSA_SIN_APARIENCIA` → «Traer a este OPD».

#### 7.3.15 Quitar de este OPD vs eliminar del modelo
- `Supr` sobre una cosa: la apariencia desaparece; barra: «**Agua** quitada de SD1 (sigue en el modelo) · Ctrl+Z». Si era la última: «… ya no aparece en ningún OPD» y el diagnóstico la lista. Contenedor e internos: rechazado con motivo.
- `Shift+Supr`: Diálogo «Eliminar **Agua** del modelo: 3 enlaces, 2 estados, apariciones en SD y SD1.» («Eliminar» / «Cancelar», foco en Cancelar). Si la cosa tiene refinamientos, se listan los OPDs que se borran.
- Enlaces: `Supr` elimina el hecho (no tienen apariencia propia); estados: `Supr` elimina (con confirmación si hay anclajes).

#### 7.3.16 Reanclar estructurales (y cualquier enlace)
Clic en una rama del peine selecciona ese enlace; aparecen asas-rombo crimson en sus extremos (refinador y refinable). Arrastrar un asa a otra cosa (o estado) lo reancla conservando el id si la matriz lo admite; si no, `×` y el motivo en la barra. En procedimentales, arrastrar el asa de un objeto a una de sus cápsulas cambia el estado del extremo (T1 → TS1) con la misma operación.

#### 7.3.17 Duración y excepciones
Proceso seleccionado → ficha «Duración: mín · esperada · máx · unidad (sec ▾)». En la elipse aparece `[min] {–, 3, 5}`. Las excepciones que lo tienen como fuente pasan de «excede su duración máxima» a «excede 5 minutos»; `EXCEPCION_SIN_COTA` desaparece.

#### 7.3.18 Editar OPL y aplicar
1. `Ctrl+E`: el bloque del OPD actual pasa a texto editable (Markdown canónico, monoespaciado); a la izquierda, una canaleta con el estado de cada línea: `·` ignorada, `=` sin cambio, `+` aplicable, `✕` no aplicable (con la razón al pasar el cursor). Conmutador «Todo el modelo» en el encabezado del editor.
2. Se escribe al final: «**Leche** es física.» `+`; «*Hervir* consume **Leche**.» `+`; «*Hervir* usa **Leche**» `✕ puntuación faltante`.
3. Resumen: «12 líneas · 2 aplicables · 1 no aplicable · 9 sin cambio» y botón «Aplicar 2 cambios» (`Ctrl+Enter`). La línea inválida no impide aplicar las otras (T-179); aplicar es atómico (T-180) y es una sola entrada de deshacer.
4. Tras aplicar, el texto se regenera canónico; el lienzo muestra **Leche** (colocada por posición libre) y el enlace.
5. Borrar una línea no borra nada: info «2 hechos no aparecen en el texto; las líneas no borran hechos (usa Supr en el lienzo)».
6. Edición en línea sin abrir el editor: doble clic sobre un nombre en el panel → campo en el lugar → `Enter` = `renombrarCosa` (misma operación que el lienzo); sobre un estado → `renombrarEstado`; sobre una etiqueta → `fijarEtiquetas`; sobre un verbo → selecciona el enlace y enfoca la ficha (T-183).

#### 7.3.19 Hover y clic bimodal
- Pasar sobre una cosa, estado o enlace del lienzo resalta (`paperWarm`) todos los tokens con esa referencia o ese `hechoId` en el panel; el panel **no** se desplaza por hover (foco estable).
- Pasar sobre un token resalta el elemento en el lienzo; si pertenece a otro OPD, el token muestra la etiqueta del OPD.
- Clic en un token: selecciona el elemento; si su bloque es otro OPD, navega (centrando) y selecciona. Seleccionar en el lienzo desplaza el panel a la primera línea del bloque actual que lo contiene.
- «Solo selección» (botón del panel o `Alt+clic` en un token) filtra el panel a las líneas del elemento (enlace antes que entidad, T-244).

#### 7.3.20 Diagnóstico
Sección plegable bajo el OPL: «Diagnóstico · 1 error · 4 avisos · 2 info». Lista agrupada (OPD actual primero); cada hallazgo: severidad con texto e ícono (no solo color), mensaje con nombres tipográficos, regla (`R-PROC-2`) y botón de acción canónica. Clic selecciona sus referencias (navega si hace falta); `F8`/`Shift+F8` recorren todos; `Enter` sobre el hallazgo enfocado ejecuta la acción. La ficha muestra arriba los hallazgos del elemento seleccionado.

#### 7.3.21 Exportar
Paleta: «Exportar OPD (SVG)», «Exportar documento (HTML)», «Exportar OPL (Markdown)», «Exportar modelo (JSON)». Si hay bloqueos: Diálogo con la lista y «Ir» por bloqueo. Si hay advertencias: Diálogo «3 cruces de enlaces en SD1» con «Exportar igualmente» / «Cancelar». Archivo: `<slug>-<SDx>-<AAAA-MM-DD>.svg` (o `.html`, `.md`, `.json`). JSON nunca se bloquea.

#### 7.3.22 Deshacer y rehacer
`Ctrl+Z` restaura el modelo anterior, vuelve al OPD donde ocurrió el cambio y restaura la selección; barra: «Deshecho: Descomponer *Cocinar* en SD1». `Ctrl+Shift+Z` rehace. Cada operación, cada gesto de arrastre y cada aplicación OPL son una entrada; el autosave sigue al estado resultante.

#### 7.3.23 Estado de guardado y conflicto
- Indicador único en la cabecera: «● Guardado» · «Cambios sin guardar» (durante el retardo) · «Guardando…» · «Sin conexión · guardado en este navegador» · «Conflicto» (clicable).
- **Conflicto** (412): Diálogo «El modelo cambió en otra ventana o navegador desde que lo abriste.» → «Descargar mis cambios y recargar» / «Sobrescribir con mis cambios» / «Seguir en solo lectura». Mientras no se decide, el lienzo está en modo `navegacion`.
- **Borrador local**: al abrir, si hay borrador del mismo modelo con la misma revisión base y difiere: se restaura y la barra dice «Se recuperaron cambios de este navegador (hace 3 min) · Descartar»; si la base cambió: el Diálogo de conflicto en su variante «Hay cambios locales basados en una versión anterior».
- Cerrar la pestaña con cambios sin guardar pide confirmación del navegador (`beforeunload`).

#### 7.3.24 Otros flujos
- **Cambiar tipo de enlace**: `Enter` sobre el enlace abre el Menú de enlace para el mismo par; elegir otro tipo conserva el id.
- **Cambiar tipo de cosa**: conmutador en la ficha; si hay estados en un objeto que pasaría a proceso o enlaces que dejarían de ser válidos, se rechaza listándolos.
- **Eliminar refinamiento**: menú contextual del refinado o del nodo del árbol (solo OPD hoja): Diálogo con lo que se pierde y la casilla «Conservar los enlaces de los internos en *Cocinar*» (marcada).
- **Renombrar el modelo**: clic en el nombre de la cabecera.

### 7.4 Estados vacíos y errores

- Biblioteca vacía: «No hay modelos. Pulsa N para crear uno o suelta aquí un archivo .json para importarlo.»
- SD vacío (canal UI, no se exporta): «O objeto · P proceso · doble clic crea aquí · Ctrl+E escribe OPL · Ctrl+K todos los comandos».
- Panel OPL vacío: «El OPL aparece aquí mientras modelas.»
- Rechazo de operación: la barra de estado muestra «No se puede: **Agua** no tiene estados; el efecto exige al menos uno (R-EFE-1). [Agregar estado]»; la acción es clicable; el mensaje se va con la siguiente acción o `Esc`. Nunca hay bloqueo mudo.
- Error de red: solo el indicador de guardado cambia; el trabajo sigue en el navegador.
- Error inesperado: límite de errores de Preact → «Ocurrió un error inesperado. Tus cambios están guardados en este navegador.» con «Descargar JSON» y «Recargar».

---

## 8. Persistencia y servidor

### 8.1 Proceso y configuración

Un solo proceso `Bun.serve` (`src/server/main.ts`) sirve los estáticos de `publico/` y la API. Sin base de datos, sin dependencias. Variables:

| Variable | Default | Uso |
|---|---|---|
| `OPFORJA_DATOS` | `/datos` | raíz de almacenamiento |
| `OPFORJA_PUBLICO` | `/srv/publico` | build de Vite |
| `OPFORJA_PUERTO` | `8080` | puerto HTTP |
| `OPFORJA_SECRETO` | — (obligatoria, ≥32 caracteres) | HMAC de la cookie; el proceso no arranca sin ella |
| `OPFORJA_VERSION` | `local` | SHA del build, expuesto en `/salud` |
| `OPFORJA_ORIGEN` | — | origen esperado (`https://opforja.sanixai.com`) para el control de `Origin` |
| `OPFORJA_INSEGURO` | — | `1` solo en desarrollo/e2e: cookie sin `Secure`, secreto fijo permitido |

### 8.2 Rutas HTTP exactas

Errores siempre como `{"error": {"codigo": "<kebab>", "mensaje": "<es-CL>"}}`. Toda ruta `/api/*` salvo `GET`/`POST /api/sesion` exige sesión.

| Método | Ruta | Entrada | Salida | Códigos |
|---|---|---|---|---|
| GET | `/salud` | — | `{"ok": true, "version": "<sha>"}` | 200 |
| GET | `/api/sesion` | cookie | `{"usuario": "<u>"}` | 200 · 401 `sin-sesion` |
| POST | `/api/sesion` | `{"usuario", "clave"}` + `X-Opforja: 1` | `{"usuario"}` + `Set-Cookie` | 200 · 400 `solicitud-invalida` · 401 `credenciales-invalidas` · 429 `demasiados-intentos` |
| DELETE | `/api/sesion` | `X-Opforja: 1` | cookie expirada | 204 |
| GET | `/api/modelos` | — | `{"modelos": [{"id", "nombre", "actualizado" (ISO), "bytes", "revision"}]}` ordenados por `actualizado` desc | 200 |
| POST | `/api/modelos` | documento v0 canónico (`Content-Type: application/json`) + `X-Opforja: 1` | `{"id", "revision"}` + `ETag` | 201 · 400 `json-invalido` · 409 `ya-existe` · 413 `demasiado-grande` · 422 `documento-invalido`/`no-canonico` |
| GET | `/api/modelos/:id` | — | bytes del documento; `ETag: "<sha256>"`; `Cache-Control: no-store` | 200 · 404 `no-existe` |
| PUT | `/api/modelos/:id` | documento + `If-Match: "<sha256>"` + `X-Opforja: 1` | `{"revision"}` + `ETag` | 200 · 404 · 412 `conflicto` (`{"error":…, "revision": "<actual>"}`) · 413 · 422 · 428 `falta-if-match` |
| DELETE | `/api/modelos/:id` | `X-Opforja: 1` | — | 204 · 404 |
| GET | `/*` | — | estático o `index.html` (SPA) | 200 |

Toda mutación sin `X-Opforja: 1`, o con un `Origin` ajeno, recibe 403 `origen-invalido`. Validación de `POST`/`PUT`: `Content-Length` ≤ 25 MB (si no, 413 sin leer el cuerpo); `JSON.parse`; `importarV0` debe dar `ok` con informe vacío; `exportarV0(modelo)` debe ser **idéntico byte a byte** al cuerpo (si no, 422 `no-canonico`); `modelo.id` coincide con `:id` (PUT) o no existe (POST) y cumple `^[A-Za-z0-9_-]{1,80}$`. Los hallazgos `error` del modelo no impiden guardar (son contenido recuperable). Así todo archivo en disco es un punto fijo del códec (DB-12).

Cabeceras en todas las respuestas: `Content-Security-Policy: default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`. Estáticos: `/assets/*` con `Cache-Control: public, max-age=31536000, immutable`; `index.html` con `no-store`. HSTS lo pone Traefik (se conservan las etiquetas actuales).

### 8.3 Autenticación de una cuenta

- **Credencial**: `$OPFORJA_DATOS/cuenta.json` = `{"usuario", "hash": "scrypt$16384$8$1$<sal>$<hash>", "version": n, "creado"}` (formato y parámetros de `passwordHash.ts`, portado; `timingSafeEqual`).
- **CLI** (`bun servidor/cuenta.js <orden>` dentro del contenedor, o `bun src/server/cuenta.ts` en desarrollo): `crear <usuario>` (falla si ya existe; clave por stdin dos veces, sin eco, ≥10 caracteres) · `clave` (cambia la clave e incrementa `version`) · `revocar` (incrementa `version`: invalida todas las cookies). Escritura atómica.
- **Login**: se compara el usuario en tiempo constante y se verifica la clave siempre (contra un hash señuelo si el usuario no coincide), para costo y respuesta uniformes. Límite: 10 fallos por IP (primer valor de `X-Forwarded-For` que pone Traefik; si no, la dirección del socket) en 10 minutos → 429.
- **Cookie** `opforja_sesion` = `base64url({"v": version, "exp": epoch})` + `.` + `base64url(HMAC-SHA256(OPFORJA_SECRETO, carga))`; `HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000` (30 días); renovación deslizante cuando quedan <15 días. Se rechaza si la firma no coincide, si expiró o si `v` ≠ `cuenta.version`.
- **CSRF**: `SameSite=Strict` + cabecera obligatoria `X-Opforja: 1` en toda mutación (una petición de otro origen con esa cabecera exige *preflight*, que el servidor nunca concede) + si llega `Origin`, debe ser `OPFORJA_ORIGEN` o el host de la petición.

### 8.4 Almacenamiento en archivos

```
$OPFORJA_DATOS/
├── cuenta.json
├── modelos/<id>.json                    documento v0 canónico (la única fuente de verdad)
├── historial/<id>/<AAAAMMDDTHHMMSSZ>.json   instantánea previa (≤1 cada 10 min por modelo, se conservan 50)
├── papelera/<id>--<AAAAMMDDTHHMMSSZ>.json   modelos eliminados (purga a los 30 días, al arrancar)
└── migracion/                           solo si hubo migración: informe.md, informe.json, originales/
```

- **Índice en memoria**: al arrancar se recorre `modelos/*.json` (se parsea cada uno para leer `modelo.nombre`; 100 modelos de 1 MB < 1 s) y se calcula `sha256` y tamaño; cada escritura lo actualiza. No hay archivo de índice (no hay segunda fuente de verdad).
- **Escritura atómica**: `modelos/.tmp-<id>-<aleatorio>` → escribir → `fsync` → `rename` sobre `modelos/<id>.json` → `fsync` del directorio. Mismo procedimiento para `cuenta.json`.
- **CAS por hash**: revisión = `sha256` hexadecimal de los bytes almacenados. Un candado en memoria por id serializa las escrituras del mismo modelo; dentro del candado se compara `If-Match` con la revisión vigente.
- **Historial**: antes de reemplazar un modelo, si la instantánea más reciente de `historial/<id>/` tiene más de 10 minutos (o no hay), se copia ahí el archivo vigente; se podan las más antiguas por encima de 50. Es una red de seguridad operativa (sin interfaz); la restauración se documenta en `docs/operacion.md`.
- **Papelera**: `DELETE` mueve el archivo a `papelera/`; el historial se conserva hasta la purga.

### 8.5 Autosave y borrador local (cliente, `ui/persistencia.ts`)

- **Abrir**: `GET /api/modelos/:id` → bytes + `ETag` → `importarV0` → modelo en memoria; `revision = ETag`.
- **Borrador local**: IndexedDB `opforja`, almacén `borradores`, clave = id del modelo → `{texto: exportarV0(m), base: revision, guardadoEn}`; se escribe 400 ms después de cada cambio; se borra tras un guardado exitoso. Todas las lecturas y escrituras en `try/catch`: sin IndexedDB, el editor funciona igual (solo se pierde la red de seguridad, y el indicador lo dice).
- **Autosave**: tras cada cambio confirmado, retardo de 1,2 s (máximo 10 s de espera durante edición continua); un solo `PUT` en vuelo; si hay cambios durante el vuelo, se encadena otro al terminar. `Ctrl+S` guarda de inmediato.
- **Estados del indicador**: `guardado` · `pendiente` (retardo) · `guardando` · `sin-conexion` (fallo de red; reintentos a 2, 5, 10 y 30 s y al evento `online`) · `conflicto` (412) · `sesion` (401 → diálogo de login, luego reintento) · `version-nueva` (422 `no-canonico` y `/salud.version` ≠ versión del cliente → «Hay una versión nueva de opforja; tus cambios están en este navegador; recarga»).
- **Conflicto**: el cliente nunca fusiona. Opciones: «Descargar mis cambios y recargar» (descarga el JSON local y abre la versión del servidor), «Sobrescribir con mis cambios» (`PUT` con `If-Match` = revisión actual del servidor), «Seguir en solo lectura».
- **Recuperación al abrir**: borrador con `base` = revisión del servidor y texto distinto → se restaura automáticamente y se ofrece «Descartar»; borrador con otra `base` → diálogo de conflicto (variante «cambios locales sobre una versión anterior»).
- **Crear**: `POST` inmediato; sin conexión no se crea («Sin conexión: no se puede crear un modelo nuevo»).

### 8.6 Límites

Documento ≤ 25 MB; cuerpo JSON ≤ 25 MB; hasta 1 000 modelos (el índice en memoria es O(n)); nombres de modelo ≤ 200 caracteres; historial 50 instantáneas por modelo; papelera 30 días. Un modelo HODOM (~1 MB) cabe con holgura.

### 8.7 Por qué no más

Sin carpetas, versiones con nombre, especies, autosave separado, revisiones numeradas, testigos ni cola de sincronización: el operador es único, el modelo es un archivo, el CAS por hash del contenido canónico hace imposible el «último escritor gana» sin aviso, y el borrador local cubre cortes de red y cierres accidentales.

### 8.8 Migración única desde PostgreSQL (`src/server/migrar-postgres.ts`)

Lee (solo `SELECT`) el esquema actual con el cliente PostgreSQL incluido en Bun (`new SQL(DATABASE_URL)`) y escribe el almacenamiento de §8.4.

1. **Cuenta y tenant**: `opforja_accounts` ⋈ `opforja_account_tenants`. Con exactamente una cuenta y un tenant se usan esos; si no, exige `--tenant <id>`. `cuenta.json` ← `{usuario: email, hash: password_hash, version: 1}` (mismo formato scrypt: la clave actual sigue sirviendo). Si `cuenta.json` existe, no se toca.
2. **Modelos**: `SELECT id, nombre, payload::text, creado_en, actualizado_en, archivado FROM opforja_models WHERE tenant_id = $1`. Por cada uno, `opforja_model_autosaves` del mismo modelo: si `creado_en` del autosave es posterior a `actualizado_en`, el contenido vigente es el del autosave y el guardado pasa al historial; si no, al revés.
3. **Conversión**: `importarV0` en modo migración (conserva el `modelo.id` = `opforja_models.id` si cumple el patrón; si no, id nuevo y mapeo en el informe) → `exportarV0` → `modelos/<id>.json`. Cada payload original se guarda sin tocar en `migracion/originales/<id>[--autosave|--version-<vid>].json`.
4. **Versiones**: `opforja_model_versions` (las 50 más recientes por modelo) → `historial/<id>/<creado_en>.json` convertidas; las que no importan se quedan solo como originales.
5. **Informe** `migracion/informe.md` (y `.json`): por modelo, nombre, id, fuente elegida (guardado/autosave), conteos antes/después (cosas, estados, enlaces, OPDs), no representados agrupados, descartados (OPDs sueltos/vistas/descomposición de objeto, enlaces negados), normalizaciones (derivados, fusiones TS3, bandas, alcance), errores recuperables, y la lista de modelos que estaban archivados o en carpetas (la información de catálogo no se migra). Los modelos rechazados por el importador se listan primero con su motivo y la ruta de su original.
6. **Banderas**: `--ensayo` (no escribe nada; imprime el informe) · `--forzar` (permite escribir si `modelos/` no está vacío). Código de salida: 0 todo migrado, 1 algún modelo rechazado (los demás se escriben), 2 uso incorrecto.
7. **Idempotencia**: sin `--forzar`, no escribe sobre un almacenamiento con modelos.

### 8.9 Respaldo

`deploy/respaldo.sh` empaqueta el volumen de datos (`docker run --rm -v opforja-datos:/datos:ro -v "$OPFORJA_RESPALDOS":/respaldo alpine:3 tar czf /respaldo/opforja-AAAA-MM-DD.tar.gz -C /datos .`, `umask 077`) y borra los de más de 14 días; `deploy/systemd/opforja-respaldo.{service,timer}` lo ejecuta a diario a las 03:30 America/Santiago, con la ruta del repositorio y el destino como variables (sin rutas de usuario fijas). La restauración (detener, extraer en el volumen, arrancar) está en `docs/operacion.md`.

---

## 9. Despliegue

No se despliega en esta tarea. El circuito queda preparado y probado con stubs.

### 9.1 `Dockerfile`

```dockerfile
FROM oven/bun:1.3.11 AS build
WORKDIR /app
COPY app/package.json app/bun.lock app/bunfig.toml ./
RUN bun install --frozen-lockfile
COPY app/ ./
ARG OPFORJA_VERSION=local
ENV VITE_OPFORJA_VERSION=$OPFORJA_VERSION
RUN bun run build          # vite build → dist/ ; bun build src/server/{main,cuenta,migrar-postgres}.ts --target=bun --outdir dist-server

FROM oven/bun:1.3.11-slim
WORKDIR /srv
COPY --from=build /app/dist ./publico
COPY --from=build /app/dist-server ./servidor
ENV OPFORJA_PUBLICO=/srv/publico OPFORJA_DATOS=/datos OPFORJA_PUERTO=8080
RUN mkdir -p /datos && chown bun:bun /datos
USER bun
VOLUME /datos
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --retries=5 CMD ["bun", "-e", "fetch('http://127.0.0.1:8080/salud').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["bun", "servidor/main.js"]
```

La imagen de ejecución contiene solo el build estático y tres archivos de servidor empaquetados (el servidor no arrastra `ui`, `opl` ni `opd`).

### 9.2 `docker-compose.yml`

```yaml
services:
  opforja:
    build:
      context: .
      args:
        OPFORJA_VERSION: ${OPFORJA_VERSION:-local}
    image: opforja:latest
    container_name: opforja
    restart: unless-stopped
    environment:
      OPFORJA_SECRETO: ${OPFORJA_SECRETO:?OPFORJA_SECRETO requerido (.env junto al compose)}
      OPFORJA_VERSION: ${OPFORJA_VERSION:-local}
      OPFORJA_ORIGEN: https://opforja.sanixai.com
    volumes:
      - opforja-datos:/datos
    networks: [web]
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=web"
      - "traefik.http.routers.opforja.rule=Host(`opforja.sanixai.com`)"
      - "traefik.http.routers.opforja.entrypoints=websecure"
      - "traefik.http.routers.opforja.tls.certresolver=myresolver"
      - "traefik.http.routers.opforja.middlewares=opforja-security-headers@docker"
      - "traefik.http.services.opforja.loadbalancer.server.port=8080"
      - "traefik.http.middlewares.opforja-security-headers.headers.customResponseHeaders.Strict-Transport-Security=max-age=63072000; includeSubDomains; preload"
volumes:
  opforja-datos:
networks:
  web:
    external: true
```

El nombre del proyecto Compose no cambia (directorio `deep-opm-pro`), de modo que el volumen nuevo es `deep-opm-pro_opforja-datos` y el antiguo `deep-opm-pro_opforja-postgres-data` **no se referencia ni se borra** (el circuito nunca usa `down -v` ni `--remove-orphans`).

### 9.3 `deploy/deploy.sh` (único circuito, adaptado)

```bash
#!/usr/bin/env bash
# Circuito canónico: construir, esperar salud y comprobar la versión servida.
set -euo pipefail
cd "$(dirname "$0")/.."
command -v curl >/dev/null || { echo "ERROR: curl es necesario" >&2; exit 1; }
SHA="$(git rev-parse --short HEAD)"
[ -n "$(git status --porcelain --untracked-files=all)" ] && SHA="${SHA}-dirty"
URL="${OPFORJA_URL:-https://opforja.sanixai.com}"; URL="${URL%/}"
echo "→ desplegando opforja · build ${SHA}"
OPFORJA_VERSION="$SHA" docker compose up -d --build --wait --wait-timeout 120 opforja
echo "→ comprobando salud, versión y acceso"
SALUD="$(curl -fsS --retry 5 --retry-delay 2 --max-time 15 "$URL/salud")"
grep -Fq "\"version\":\"${SHA}\"" <<<"$SALUD" || { echo "ERROR: se esperaba la versión ${SHA}; recibido ${SALUD}" >&2; exit 1; }
curl -fsS --max-time 15 "$URL/" -o /dev/null
ESTADO="$(curl -sS --max-time 15 -o /dev/null -w '%{http_code}' "$URL/api/sesion")"
[ "$ESTADO" = "401" ] || { echo "ERROR: se esperaba 401 sin sesión; recibido ${ESTADO}" >&2; exit 1; }
echo "✓ opforja ${SHA} disponible en ${URL}"
```

`app/scripts/deploy.test.ts` (portado) lo ejecuta con stubs de `git`, `docker` y `curl` y verifica: `--wait`, versión confirmada por `/salud`, 401 anónimo, sufijo `-dirty`.

### 9.4 Transición desde el stack actual

1. **Antes**: tag `v0-final` sobre `8ada528`; respaldo de PostgreSQL con el script actual (`deploy/backup-opforja-db.sh` de ese commit) y copia del `.env`; `docker network ls` para confirmar el nombre de la red interna antigua.
2. **Construir** la imagen nueva sin desplegar: `OPFORJA_VERSION=$(git rev-parse --short HEAD) docker compose build opforja`.
3. **Ensayo de migración** contra el PostgreSQL en ejecución: `docker run --rm --network deep-opm-pro_opforja-internal -e DATABASE_URL=postgres://opforja:<clave>@postgres:5432/opforja -v deep-opm-pro_opforja-datos:/datos opforja:latest bun servidor/migrar-postgres.js --ensayo`. Revisar el informe con el dueño.
4. **Migración real**: la misma orden sin `--ensayo`. Revisar `migracion/informe.md` en el volumen.
5. **Agregar** `OPFORJA_SECRETO` al `.env` y ejecutar `./deploy/deploy.sh`: el contenedor `opforja` (nginx) se reemplaza por el nuevo servicio con el mismo nombre y las mismas etiquetas de Traefik.
6. **Detener sin borrar** los contenedores antiguos: `docker stop opforja-model-api opforja-postgres opforja-bug-capture`. El volumen `deep-opm-pro_opforja-postgres-data` se conserva al menos 30 días.
7. **Verificar** con el dueño: login con la clave actual, abrir los modelos grandes, comparar su OPL con el que mostraba v0 (el informe lista las diferencias esperadas).
8. **Rollback**: `git worktree add ../opforja-v0 8ada528` (tag `v0-final` creado en el paso 1) y, desde ese árbol, su propio `./deploy/deploy.sh` (circuito antiguo, que vuelve a levantar PostgreSQL con su volumen intacto y reemplaza el contenedor `opforja`). Los cambios hechos en el sistema nuevo después del corte se recuperan exportando sus JSON e importándolos en la interfaz antigua.
9. **Retiro**: pasados 30 días sin rollback, `docker rm` de los contenedores antiguos y respaldo final del volumen PostgreSQL antes de eliminarlo (decisión del dueño).

---

## 10. Verificación

### 10.1 Comandos (`app/package.json`)

| Script | Qué hace | Cuándo (AGENTS.md) |
|---|---|---|
| `check` | `tsc --noEmit` (src, e2e, fixtures, scripts) + `bun test src` | todo cambio de código (por defecto); objetivo < 20 s |
| `e2e` | `playwright test` (Chromium 1194 de `/opt/pw-browsers`, `@playwright/test@1.56.1`) | interacción o render |
| `build` | `vite build` + `bun build` del servidor | empaquetado |
| `golden:actualizar` | reescribe `fixtures/golden/*.svg` desde el exportador | solo al cambiar deliberadamente el render (el diff lo revisa una persona) |
| `metricas` | mide anchos de Inria Serif en Chromium y escribe `opd/metricas-inria.json` | solo al cambiar de fuente |
| `test:deploy` | `bun test scripts/deploy.test.ts` | al tocar `deploy/` |

Sin ESLint, sin gates de gobernanza documental, sin auditorías de skills ni de producción.

### 10.2 Pruebas unitarias del núcleo y la matriz

- `matriz.test.ts`: tabla de expectativas **transcrita a mano desde CANON §2.1 y §2.2** (independiente de `REGLAS`, para que no sea tautológica): 15 tipos × 4 pares de clases × {sin estado, estado en origen, en destino, ambos} × {sin control, e, c} × {multiplicidad por extremo} × {ruta} → veredicto esperado. Incluye AP-01..AP-11, AP-27, AP-28, R-EFE-1 con herencia, unicidad de rol (contorno, descendiente, abanico, ruta), doble vara, agente no físico.
- `operaciones.test.ts`: cada operación en su camino feliz y en cada código de rechazo; **pureza** (el modelo de entrada se congela con `Object.freeze` profundo y no debe cambiar); ids sin colisión.
- `refinamiento.test.ts`: descomponer (externos, atomicidad, R-HIJO-5, R-REF-1), bandas (insertar/mover/unir, `realizarBandas` no reordena), tabla de migración fila por fila, `migracionAutomatica` al agregar y reordenar subprocesos, escisión y recomposición, TS3 con control, eliminar refinamiento con y sin conservar enlaces, desplegar por los 4 modos, colección incompleta y su traza.
- `vista.test.ts`: visibilidad directa, elevación por descomposición, no elevación por despliegue, las 9 celdas de la matriz 3×3, habilitadores ocultos por transformador, fuerza de controles, fusión de efectos por bandas (par escindido → TS3 en el padre), R-VIS-HIJO-1, estados visibles/ocultos, abanicos visibles solo con ramas directas.
- `diagnostico.test.ts`: cada regla con un caso positivo y uno negativo que la haría fallar si se invierte la condición (control de no tautología).
- `invariantes.test.ts`: 200 secuencias aleatorias de operaciones (`fixtures/azar.ts`, semillas fijas) conservan los invariantes 1–8 de §3.1.
- `frontera.test.ts`: ley DR-16 sobre los mismos modelos.

### 10.3 Roundtrip OPL (fixtures estrictos)

- `plantillas.test.ts`: `reconocer(generarPlantilla(h)) = h` para cada plantilla C y cada combinación de opciones (§5.8.1).
- `generar.test.ts`: `fixtures/modelos.ts` define un modelo por fila de la tabla 9.2 y por cada familia ★ de §4.4 (D1–D10, T1–TS5, H1/H2/HS1/HS2, ET/EH/ETS/EHS, CT/CH/CS, EX1/EX2 con cota y respaldo, IV1/IV2, RF1–RF4b, RH1, SE1/SE2, CX1/CX2/CXm/CX3, las 24 plantillas de abanico, R-FAN-5/5A, ruta, multiplicidad, colección incompleta, vista padre abstraída); se compara el texto **literal** esperado (tomado de los ejemplos del canon cuando existen: «*Cocinar* requiere al menos una **Olla**.», «*Manejar Excepción* ocurre si duración de *Procesar* excede 5 minutos.»).
- `roundtrip.test.ts`: sobre esos modelos y 200 semillas de `azar.ts` en perfil `estricto`: auto-reparseo sin errores ni parches (R-§19-SIM-1) y `generar(m) === generar(aplicarOpl(crearModelo(), parsear(generar(m))))` línea a línea (R-§19-SIM-3); en perfil `completo`: solo las propiedades 1–2, con las bisimetrías parciales declaradas (T-193).
- `leyes-opl.test.ts`: no borrar por ausencia, preview puro (el modelo no cambia al clasificar), `aplicarOpl(m, []) = m`, `unsupported-canonical` sin mutación, partial-parse (una línea inválida no bloquea las demás), atomicidad (un fallo en la fase 2 deja el modelo intacto), idempotencia de enlaces y de `se descompone en`, conflicto R-IMPORT-7.
- `opl-fixtures.test.ts`: cada `fixtures/opl/*.opl` se aplica sobre un modelo vacío con 0 errores y su regeneración se reaplica sin parches.

### 10.4 Códec v0

- `fixpoint.test.ts`: para cada `fixtures/v0/*.json` (System_Diagram, SD_Sync, SD_Async, OnStar_System, OPM_Structure_Meta_Model, Modelo_Vacio): `importarV0` ok; conteos esperados de cosas/estados/enlaces/OPDs tras normalizar (p.ej. SD_Sync: 23 derivados convertidos, 1 resultado reanclado manual); `exportarV0∘importarV0∘exportarV0 = exportarV0`; `importarV0(exportarV0(m))` con informe vacío.
- `importar.test.ts`: un caso por codificación en `fixtures/v0/legado/`: extremo `string`; `refinamiento` único legado; `padreId` ausente; OPD suelto y OPD con vista (descartados); descomposición de objeto (descartada); TS3 compacto completo y parcial; par escindido completo y con mitad faltante; standalone; derivados automáticos y manuales de cada tipo; TS3 derivado con ≥2 subprocesos; par consumo+resultado a fusionar (y con ruta: no se fusiona); `modificador: 'no'`; `subtipoModificador` incoherente; excepción combinada; `tiempoMaximo` con y sin duración previa; multiplicidades de cada forma; abanicos `O`/`XOR` con `puertoComun` y con solo `puertoEntidadId`; designaciones duplicadas; `esInicial` + `designaciones: ['inicial']`; `ordenInzoom` ausente, parcial y contradictorio con la geometría; `contextoRefinamiento` ausente; apariencias duplicadas; nombres duplicados y fuera de léxico (errores recuperables); colecciones como arreglo; referencias rotas de cada clase → `referencia-rota` con la ruta exacta; JSON inválido; formato distinto.

### 10.5 OPD

- `geometria.test.ts`: recortes exactos (el punto cae en la elipse con error < 1e-9), paralelos, arcos (mayor hueco angular), intersecciones.
- `escena.test.ts`: las 8 representaciones como función de (tipo, esencia, afiliación); contorno grueso solo en refinadas; rótulos largos nunca truncados (el nodo crece); filas de estados y designaciones; chip ⋯N; peine en 4 orientaciones; anclaje de abanico; rayo con 4 vértices; autoinvocación; barras de excepción; posiciones de `e`/`c`, multiplicidad y ruta.
- `golden.test.ts`: `fixtures/golden/*.svg`, **una construcción por archivo** (8 cosas; 4 triángulos + incompleta; T1, T2, T3, TS1–TS5; H1, H2, HS1, HS2; `e`/`c`; IV1, IV2; EX1, EX2; XOR/OR convergente y divergente; etiquetado uni, bi, recíproco, unario; estados inicial, final, D10, por defecto, `Current`; chip; multiplicidad; ruta; duración; contenedor con bandas y externos; despliegue); igualdad de texto del export canónico.
- `exportar.test.ts`: el SVG no contiene `data-`, ni elementos de la capa UI, ni grilla; el `viewBox` contiene todo lo dibujado; fuente incrustada; `<desc>` con perfil y export parcial; gates (>25 cosas, refinamiento trivial, errores) y advertencias (cruces, oclusión).
- Ninguna captura de pantalla se usa como evidencia de canonicidad (T-305): la evidencia es el SVG exportado.

### 10.6 Servidor y cliente de persistencia

- `server/http.test.ts`: `Bun.serve` en puerto 0 sobre un directorio temporal: login correcto, incorrecto, 429; cookie manipulada, vencida y revocada (`version`); falta `X-Opforja` → 403; `Origin` ajeno → 403; crear, listar, leer, actualizar, eliminar; 412 con revisión vigente; 428; 413; 422 `no-canonico` (JSON válido pero con claves reordenadas); archivo temporal huérfano ignorado y limpiado al arrancar; historial a lo sumo cada 10 min y podado a 50; purga de papelera; estáticos, SPA y cabeceras de seguridad.
- `server/migrar-postgres.test.ts`: la función pura `migrar(filas, destino)` con filas de ejemplo (modelos, autosaves más nuevos y más viejos, versiones, cuenta, un modelo rechazado); el acceso SQL es una capa delgada probada en el ensayo real (§9.4 paso 3).
- `ui/persistencia.test.ts` con `fetch` e IndexedDB falsos: retardo del autosave, un solo `PUT` en vuelo, 412 → conflicto, 401 → sesión, sin red → borrador y reintento, recuperación de borrador con misma base y con base distinta.
- `ui/estado.test.ts`: deshacer/rehacer restaura modelo, OPD y selección; una aplicación OPL = una entrada; un rechazo no crea entrada y deja el mensaje.
- `ui/comandos.test.ts`: cada comando tiene id, título y grupo; ningún atajo repetido en un mismo contexto; `habilitado` devuelve un motivo cuando no.

### 10.7 E2E Playwright (24 escenarios)

Arnés: `webServer` = `bun run build && bun src/server/main.ts` con `OPFORJA_DATOS` temporal, `OPFORJA_INSEGURO=1` y una cuenta creada en `globalSetup` con `cuenta.ts crear` (clave por stdin). Cada escenario crea su modelo por la API (`page.request`), actúa con roles accesibles, etiquetas y `data-ref`, y verifica el resultado por **tres canales**: el lienzo (atributos del SVG), el texto del panel OPL y el JSON leído de `GET /api/modelos/:id` tras `Ctrl+S`. Un fixture común falla ante cualquier error de consola. Sin CSS literales, sin conteos de botones, sin `import('/src/…')`.

| Archivo | Escenario |
|---|---|
| `01-sesion.spec.ts` | entrar; credenciales inválidas; cerrar sesión; sesión vencida durante la edición → diálogo y reintento del guardado |
| `02-biblioteca.spec.ts` | nuevo (N + nombre) → SD vacío; abrir; buscar; eliminar con confirmación |
| `03-importar-v0.spec.ts` | importar `SD_Sync.json` → informe (derivados, no representados) → modelo abierto; el OPL coincide con el esperado; exportar JSON = export canónico de la fixture |
| `04-crear-nombrar.spec.ts` | `O`/`P` + nombre + Enter; capitalización visible; `Tab` alterna; colisión → Enter trae; Esc no crea nada |
| `05-esencia-afiliacion.spec.ts` | `Shift+F`/`Shift+A` → sombra/discontinuo en el SVG y D1/D3 en el OPL; propagación a rasgos |
| `06-estados.spec.ts` | `S` encadenado; `I`/`F`/`D`/D10/`Current`; `H` → chip ⋯1 y D6; rechazo al ocultar un estado enlazado; reordenar |
| `07-enlace-arrastre.spec.ts` | arrastre con menú filtrado (sin efecto para objeto sin estados; sin agente desde informacional); vista previa OPL; creación y oración |
| `08-enlace-teclado-estados.spec.ts` | `L` + Tab + Enter; enlace desde estado (TS1); completar TS3 con el segundo gesto; abanico por estado desde el conflicto de unicidad |
| `09-control.spec.ts` | `E`/`C` → ET1/CT1; rechazo en resultado con motivo |
| `10-etiquetas-ruta-mult.spec.ts` | etiquetado con etiqueta (SE1) y sin ella (SE2); bidireccional; ruta en consumo; multiplicidad con género |
| `11-abanicos.spec.ts` | XOR y OR (arcos en el SVG, «exactamente uno de» / «al menos uno de»); alternar; disolver; rechazo de control mixto |
| `12-descomponer-bandas.spec.ts` | `Shift+I` + Enter/Tab → CXm; consumo al primero, resultado al último, TS3 escindido; vista padre abstraída |
| `13-reordenar-bandas.spec.ts` | `Alt+↑/↓`, `Alt+Shift+↑`, arrastre confinado; CXm y migraciones actualizadas; doble vara marcada |
| `14-desplegar.spec.ts` | `Shift+U` + 1..4 + refinadores; CX3 y oraciones atómicas; colección incompleta |
| `15-navegar.spec.ts` | árbol, `Enter`, `Alt+↑`, ruta, retroceso del navegador; centrado del bbox; selección conservada |
| `16-traer-quitar-eliminar.spec.ts` | `T` trae con sus enlaces; `Ctrl+C`/`Ctrl+V` entre OPDs; `Supr` quita (sigue en el modelo); `Shift+Supr` elimina con confirmación |
| `17-reanclar.spec.ts` | reanclar la rama de un peine; reanclar un consumo a un estado; destino inválido con `×` |
| `18-duracion-excepcion.spec.ts` | duración en la ficha → texto en la elipse; EX1 con cota y con respaldo + aviso |
| `19-editor-opl.spec.ts` | `Ctrl+E`, líneas aplicables/no aplicables, «Aplicar N», atomicidad, ausencia no borra, renombrado en línea desde el panel |
| `20-bimodal.spec.ts` | hover lienzo → tokens resaltados; hover token → figura resaltada; clic en token de otro OPD navega; «Solo selección» |
| `21-diagnostico.spec.ts` | `F8` recorre; la acción canónica «Traer a este OPD» funciona |
| `22-exportar.spec.ts` | SVG sin capa UI y con `viewBox` ajustado; documento HTML; OPL Markdown; bloqueo >25 cosas con motivo; advertencia de cruces |
| `23-deshacer-guardado.spec.ts` | deshacer/rehacer (incl. aplicación OPL como una entrada); dos páginas sobre el mismo modelo → conflicto; red cortada → «Sin conexión» y borrador recuperado al recargar |
| `24-estrecho.spec.ts` | a 800 px: selector de paneles; crear una cosa y ver su OPL |

### 10.8 Límites declarados

Una suite verde no equivale a validación humana del modelado ni de la fidelidad visual. Los `golden/*.svg` los revisa el dueño una vez al cerrar WP7 (y en cada cambio deliberado); el ensayo de migración sobre los modelos reales lo revisa el dueño antes del corte (§9.4).

---

## 11. Documentación final, canon y retiros

### 11.1 Archivos de documentación (lista exacta)

| Archivo | Contenido |
|---|---|
| `README.md` | qué es opforja (modelador OPM/ISO 19450 bimodal OPD/OPL); cómo ejecutar en desarrollo (`cd app && bun install && bun run dev`, servidor con `OPFORJA_INSEGURO=1`); estructura del repositorio en 10 líneas; límites (no es fuente de modelos de dominio; suite verde ≠ validación humana); enlaces a `docs/` |
| `AGENTS.md` | misión; autoridad: `docs/canon/` (4 documentos) → `docs/especificacion.md` → `docs/conformidad.md`; arquitectura `nucleo → (codec, opl, opd) → ui`, `server → codec`; simetría OPD/OPL por la vista única; verificación (`bun run check`; `e2e` para interacción/render; `build` para empaquetado; `test:deploy` al tocar `deploy/`); entrega (revisar el diff, desplegar solo con `./deploy/deploy.sh` cuando se autorice, un solo `HANDOFF.md` raíz temporal) |
| `CLAUDE.md` | `@AGENTS.md` |
| `NOTICE.md` | código propio en `app/`; sin licencia open-source declarada; dependencias bajo sus licencias; el material observacional de OPCloud se retiró del repositorio (queda en la historia de Git hasta `v0-final`) |
| `docs/README.md` | índice de una pantalla con «elige tu ruta» |
| `docs/uso.md` | guía de uso: pantalla, flujos de §7.3 en prosa breve, tabla de atajos (generada desde `ui/comandos.ts` por `bun run docs:atajos`, que reescribe la sección entre marcadores) |
| `docs/arquitectura.md` | módulos y responsabilidades, dirección de dependencias, tipos del modelo, contrato del formato v0 (tablas §3.3–§3.4), API HTTP (§8.2), vista por OPD, rendimiento |
| `docs/operacion.md` | variables de entorno, crear/cambiar/revocar la cuenta, despliegue con `deploy.sh`, respaldo y restauración, restaurar desde historial o papelera, migración y rollback (§9.4) |
| `docs/decisiones.md` | tabla DR-1..DR-45 (del canon) y DB-1..DB-20 (de este diseño): decisión, fundamento, fecha |
| `docs/conformidad.md` | registro R-CONF-7 (§1.5) |
| `docs/especificacion.md` | CANON.md tal cual (248 requisitos T-NNN, matriz, plantillas, EBNF, catálogo visual, DR) |
| `docs/canon/README.md` | los 4 documentos, versión, `sha256` de cada archivo, precedencia (reglas > spec-OPD/spec-OPL > método), y la regla: el canon no se edita aquí; una versión nueva reemplaza el archivo completo y se actualiza `especificacion.md` y `conformidad.md` |
| `docs/canon/reglas-opm-estrictas-es.md` · `spec-forja-opd-es.md` · `spec-forja-opl-es.md` · `metodologia-forja-opm-es.md` | copia literal de `canon/<slug>/content.md` (1.5.0 · 1.4.0 · 1.4.1 · 1.7.0) |

Se retiran los puentes y el resolutor URN: el canon vendorizado es la autoridad local; ninguna ruta a `/home/felix` ni a KORA queda en el repositorio.

### 11.2 Movimientos

`fixtures/demo-models/*.json` → `app/fixtures/v0/`; `docs/ejemplos/*.opl` → `app/fixtures/opl/` (entradas de parseo en forma R-ENT-3); `app/scripts/deploy.test.ts` → se conserva y adapta.

### 11.3 Lo que se elimina (lista exacta) y por qué

**Raíz**

| Ruta | Motivo |
|---|---|
| `HANDOFF.md` | continuidad del «producto integrado» (agente LLM) que sale del alcance; se reemplaza por el HANDOFF de esta reconstrucción y se borra al cerrar |
| `assets/`, `catalog/`, `config/`, `webroot/`, `opm-extracted/`, `setup.sh` | evidencia observacional de OPCloud (con analítica y claves públicas de terceros); ningún código, build ni despliegue la usa; el canon vendorizado la reemplaza como referencia |
| `fixtures/` (salvo lo movido) | capturas y celdas JointJS de OPCloud; los modelos demo se mueven a `app/fixtures/v0/` |
| `ui-forja/` | gobierno visual paralelo (tokens duplicados, GOVERNANCE autorreferente); los tokens necesarios pasan a `opd/tokens.ts` y `ui/estilos.css` desde spec-OPD §18 |
| `.codex/`, `.opencode/` | skill de agente de desarrollo (`lineas-paralelas`), ajena al producto |
| `tsconfig.json`, `bunfig.toml` (raíz) | todo se ejecuta desde `app/`; `app/bunfig.toml` conserva el endurecimiento de instalación |
| `deploy/nginx.conf`, `deploy/backup-opforja-db.sh`, `deploy/systemd/opforja-db-backup.{service,timer}` | nginx y PostgreSQL desaparecen; los reemplazan `respaldo.sh` y sus unidades |

**`docs/`** (todo lo que no figura en §11.1)

| Ruta | Motivo |
|---|---|
| `bugs/` (379 archivos) | ledger del capturador de bugs, que sale del producto |
| `auditorias/`, `superpowers/`, `specs/`, `roadmap/`, `memorias-aprendizajes/`, `decisiones/` | actas, specs de funciones retiradas y bitácoras; las decisiones vigentes se destilan en `docs/decisiones.md`; la historia queda en Git |
| `canon-opm/` | puentes URN sin contenido normativo; los reemplaza `docs/canon/` |
| `reference/` | re-serialización histórica de reglas, contradictoria con el canon vigente |
| `manual-opforja.md`, `manual-opm-puro.md` | método y OPM ya están en el canon vendorizado (metodología y reglas) |
| `manual-sanitarios-opm.md`, `manual-sistemas-opm.md`, `manual-software-opm.md` | manuales de dominio: el repositorio no es fuente de dominio |
| `cheatsheets/` | 16 hojas con leyes editoriales propias; los atajos viven en `docs/uso.md` generado |
| `JOYAS.md` | constantes observadas de OPCloud; spec-OPD §18 las fija como catálogo normativo-informativo |
| `uso-productivo.md`, `render-headless.md`, `verify-reproducible.md`, `deploy/` | describen la interfaz y herramientas retiradas; los reemplazan `uso.md` y `operacion.md` |
| `ejemplos/` | movido a `app/fixtures/opl/` |

**`app/`**

| Ruta | Motivo |
|---|---|
| `src/agent/`, `src/server/agent/`, `src/mesa/`, `src/tutor/`, `src/autoria/`, `src/canon/`, `src/portable-reader/`, `portable-reader/`, `_local/` | agente LLM, CLI mesa, tutor, compilador de proto-modelos, sello de doctrina, lector portátil, laboratorio de simulación: fuera de alcance (DECISIONS) |
| `src/modelo/` (incl. `simulacion/`, `reuse/`, `composicion/`, `submodelos/`, `equivalencia/`, `razonamiento/`, `hechos/`, `changes/`) | reemplazado por `nucleo/`; simulación, reuso, composición y submodelos salen del alcance; las leyes útiles se reescriben como pruebas nuevas |
| `src/serializacion/`, `src/persistencia/` | reemplazados por `codec/` y `ui/persistencia.ts` + `server/`; paquete portátil, cola local-first, workspace, versiones, revisión compartida fuera |
| `src/opl/` | reemplazado por la tabla bidireccional (se portan `interaccion.ts` y la clasificación del editor como ideas) |
| `src/render/`, `src/canvas/` | JointJS y sus post-pasadas: reemplazados por `opd/` + `ui/lienzo/` |
| `src/store/`, `src/app/` (ports/viewmodels), `src/store.ts` y sus pruebas | zustand y 160 archivos de puertos de paso: reemplazados por `ui/almacen.ts`, `ui/estado.ts`, `ui/comandos.ts` |
| `src/ui/` (y subdirectorios) | shell con ~38 modales, cintas, mapa, capturador de bugs, tutor transversal: reemplazada por §7 |
| `src/server/` (resto) | handler sobre PostgreSQL, revisión compartida, captura de bugs: reemplazado por `server/` mínimo |
| `src/leyes/` | leyes sobre el kernel anterior y leyes documentales autorreferentes; las semánticas se reescriben en §10 |
| `src/completitud.test.ts`, `src/editorBootstrap.tsx`, `src/version.ts`, `src/version.test.ts`, `src/storeFactory.test.ts` | propios de la arquitectura anterior |
| `e2e/` (76 archivos) | acoplados a JointJS, testids, CSS y tickets; reemplazados por los 24 escenarios de §10.7 |
| `scripts/` (todo salvo `deploy.test.ts`) | servidor de producción embebido, CLI de cuentas y mesa (reemplazados por `src/server/`), gobernanza (`cordon-*`, `design-governance-audit`, `quality-ledger`), sondas `in-vivo-*`, `ux:eval`, captura de bugs, corpus del tutor, `render-headless`, `verify-reproducible`, generadores de demos |
| `eslint.config.js`, `playwright.external.config.ts`, `playwright.preview.config.ts` | lint de una regla con plugin falso; amarras externas; preview duplicado del e2e |
| dependencias `jointjs`, `zustand`, `ai`, `@ai-sdk/openai-compatible`, `eslint`, `@typescript-eslint/*`, `@socketsecurity/bun-security-scanner` | reemplazadas o sin uso; el escáner se retira (dependencia de red de terceros en cada instalación, no exigida) y `app/bunfig.toml` conserva `minimumReleaseAge` |

Toda esta materia queda recuperable en Git desde el tag `v0-final`.

---

## 12. Plan de implementación (paquetes de trabajo)

Rama de trabajo única; cada WP entra cuando sus criterios pasan y `bun run check` está verde. Los contratos de WP0 se congelan: un WP que necesite cambiarlos actualiza a sus consumidores en el mismo cambio. `HANDOFF.md` raíz lleva el tablero de WPs mientras dure la reconstrucción y se borra en WP13.

| WP | Objetivo | Archivos | Consume | Produce | Criterios de aceptación verificables |
|---|---|---|---|---|---|
| **WP0** Base limpia y contratos | tag `v0-final`; retiros de §11.3; esqueleto de `app/`; movimientos §11.2; canon y especificación vendorizados; **todos los tipos** y firmas como stubs | raíz, `docs/canon/`, `docs/especificacion.md`, `app/{package.json,tsconfig.json,vite.config.ts,index.html,playwright.config.ts}`, `nucleo/{tipos,resultado}.ts`, firmas en `nucleo/operaciones/*`, tipos de `VistaOpd`, `Hallazgo`, `LineaOpl`, `HechoOpl`, `Parche`, `Escena`, firmas de `codec`, `arquitectura.test.ts` | CANON.md, DECISIONS | contratos §3.1, §4.1–4.2, §4.7, §5.2, §5.5, §6.1 | `bun run check` verde; `git grep -il jointjs` vacío; `sha256` de los 4 canon = los del scratchpad; el árbol de `src/` coincide con §2.2 |
| **WP1** Núcleo base | ids, nombres, índice, herencia, matriz, operaciones de modelo, cosas, estados, enlaces, abanicos, apariencias, etiquetas | `nucleo/*` salvo `refinamiento.ts`, `vista.ts`, `diagnostico.ts` | WP0 | API §4.2 (menos refinamiento), `validarEnlace`, `tiposPosibles` (la vista previa OPL la agrega la UI con WP5) | `matriz.test.ts` (tabla completa de CANON §2.1/2.2), `operaciones.test.ts`, pureza, `invariantes.test.ts` con operaciones de WP1 |
| **WP2** Refinamiento y vista | descomponer, desplegar, bandas, redistribuir, escisión, eliminar refinamiento; `vista`; ley de frontera | `nucleo/operaciones/refinamiento.ts`, `nucleo/vista.ts`, `frontera.test.ts` | WP1 | `vista(m, opd)`, operaciones de refinamiento | `refinamiento.test.ts`, `vista.test.ts`, `frontera.test.ts`, invariantes con refinamiento |
| **WP3** Diagnóstico | registro de reglas de §4.4 | `nucleo/diagnostico.ts` | WP1 (WP2 para las de refinamiento y precedencia) | `diagnosticar(m)` | `diagnostico.test.ts` (positivo/negativo por regla); < 30 ms en HODOM sintético |
| **WP4** Códec v0 | importar (todas las codificaciones), exportar, canónico; fixtures legado | `codec/*`, `fixtures/v0/legado/*` | WP1; WP2 para los pasos 12–13 y 16 | `importarV0`, `exportarV0`, `InformeImportacion` | `importar.test.ts`, `fixpoint.test.ts` sobre las 6 fixtures y 200 semillas |
| **WP5** OPL generador | vocabulario, tokens, tabla de plantillas (dirección generar), `generarOpl`, display | `opl/{vocabulario,tokens,plantillas,generar}.ts` | WP2 | `generarOpl`, vista previa para `tiposPosibles` | `generar.test.ts` (texto literal por fila de tabla 9.2 y familias ★); `plantillas.test.ts` parte generación |
| **WP6** OPL parser y editor | texto, reconocer, planificar, aplicar, editor; suite de roundtrip | `opl/{texto,reconocer,planificar,aplicar,editor}.ts`, `fixtures/modelos.ts`, `fixtures/azar.ts` | WP5, WP1–WP2 | `clasificar`, `aplicarOpl`, `NO_SOPORTADAS` | `roundtrip.test.ts` (R-§19-SIM-1 y SIM-3 sobre fixtures y 200 semillas), `leyes-opl.test.ts`, `opl-fixtures.test.ts`, `editor.test.ts` |
| **WP7** OPD | tokens, métricas (script), geometría, marcadores, layout, escena, dibujar, svgTexto, exportar, calidad; goldens | `opd/*`, `fixtures/golden/*` | WP2 (vista), WP5 (OPL del documento) | `escena`, `dibujar`, `exportarSvgOpd`, `exportarDocumento`, `exportarOplMd`, gates | `geometria.test.ts`, `escena.test.ts`, `exportar.test.ts`, `golden.test.ts`; revisión humana de los goldens |
| **WP8** Servidor | Bun.serve, rutas, sesión, almacén, CLI de cuenta | `server/{main,http,sesion,almacen,cuenta}.ts` | WP4 | API §8.2 | `http.test.ts` completo; el servidor empaquetado no importa `ui/opl/opd` (verificado por `arquitectura.test.ts`) |
| **WP9** Shell de UI | almacén, estado (deshacer), comandos, atajos, rutas, api, persistencia, App, Cabecera, Login, Biblioteca, Diálogo, Paleta, Menú contextual, estilos | `ui/*` salvo lienzo y paneles | WP0 (contratos), WP8 (API; hasta entonces un servidor falso en memoria) | `ejecutar(op)`, registro de comandos, persistencia | `estado.test.ts`, `comandos.test.ts`, `persistencia.test.ts`; e2e `01`, `02` |
| **WP10** Lienzo | Lienzo, gestos, capa UI, editor de nombre, cámara, Menú de enlace, barra de estado | `ui/lienzo/*`, `ui/MenuEnlace.tsx`, `ui/BarraEstado.tsx` | WP7, WP1–WP2, WP5, WP9 | edición directa completa | e2e `04`–`18`, `24`; 60 cuadros/s al arrastrar en un OPD de 25 cosas (medido con `performance.now` en e2e) |
| **WP11** Paneles | Panel OPL (lectura, hover, filtro, display), Editor OPL, Árbol, Ficha, Diagnóstico | `ui/{PanelOpl,EditorOpl,Arbol,Ficha,Diagnostico}.tsx` | WP5, WP6, WP3, WP9 | bimodalidad activa | e2e `19`, `20`, `21` |
| **WP12** Migración y despliegue | `migrar-postgres.ts`, Dockerfile, compose, `deploy.sh`, `respaldo.sh`, systemd, `deploy.test.ts` | `server/migrar-postgres.ts`, raíz `Dockerfile`, `docker-compose.yml`, `deploy/*`, `scripts/deploy.test.ts` | WP4, WP8 | imagen y circuito | `migrar-postgres.test.ts`; `test:deploy`; `docker build` local exitoso; `docker run` + `curl /salud` con la versión |
| **WP13** Cierre | 24 e2e completos, `docs/*` de §11.1, `docs/conformidad.md` con las 248 filas, `docs/uso.md` generado, `README`, `AGENTS`, `NOTICE`; borrar `HANDOFF.md` | `e2e/*`, `docs/*`, raíz | todos | producto completo | `bun run check`, `bun run e2e`, `bun run build` verdes; `conformidad.test.ts` verde; revisión del diff completo |

**Paralelismo y orden de integración**

```
Ola 0  WP0 ─────────────────────────────────────────────────────────────────
Ola 1  WP1 │ WP4 (lectura/normalización/export, sin pasos de refinamiento) │ WP7a (tokens, métricas, geometría, marcadores) │ WP9 (con núcleo y API falsos)
Ola 2  WP2 (tras WP1) │ WP3a (reglas sin refinamiento) │ WP8 (tras WP4 base)
Ola 3  WP5 (tras WP2) │ WP4b (pasos 12–13, 16) │ WP3b │ WP7b (layout, escena, dibujar, tras WP2)
Ola 4  WP6 (tras WP5) │ WP10 (tras WP7b + WP9 + WP5) │ WP11 (tras WP5 + WP3 + WP9; editor tras WP6) │ WP12 (tras WP4 + WP8)
Ola 5  WP13
```

Hasta 4 agentes independientes por ola. Cada agente trabaja en su propio subárbol de archivos (la tabla fija la propiedad), así que no hay conflictos de edición; los puntos de contacto son los contratos de WP0. Integración: se fusiona en el orden de las olas; dentro de una ola, primero el que desbloquea más (WP1 antes que WP4 en la ola 1).

---

## 13. Riesgos, sobresimplificación y mitigaciones

### 13.1 Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Modelos reales de v0 con codificaciones no vistas (HODOM no está disponible aquí) | la importación rechaza o pierde algo | ensayo de migración (`--ensayo`) sobre la base real antes del corte; todo original se guarda sin tocar en `migracion/originales/`; el informe lista cada pérdida; los rechazos no bloquean al resto; el volumen PostgreSQL se conserva 30 días |
| El dueño usa funciones retiradas (simulación, tutor, agente, Bocetos, reuso) | pérdida percibida | decisión fija de DECISIONS; el informe de migración las nombra por modelo; recuperables desde `v0-final` |
| Divergencia de métricas tipográficas en visores sin la fuente | rótulos que desbordan | tabla medida en Chromium; fuente incrustada en todo export; margen de 8 px por lado |
| Cobertura de plantillas incompleta o ambigüedades del parser | `parsear(generar(m))` falla en casos raros | tabla única generar/reconocer; prueba por plantilla que itera la tabla; roundtrip sobre 200 modelos aleatorios; X/NC explícitas antes del residual SE1 |
| Rendimiento con 36 OPDs y 433 enlaces | lentitud al editar | memo por referencia de `Modelo`; vista por OPD; OPL por bloques; diagnóstico en ocioso; prueba de humo con el tamaño HODOM y umbral 3× |
| Conflictos entre dos navegadores | trabajo perdido | CAS por hash; el cliente nunca fusiona ni sobrescribe sin elegirlo; borrador local; historial del servidor cada 10 min |
| Salto de versión cliente/servidor durante un despliegue | guardados rechazados | 422 `no-canonico` + comparación con `/salud.version` → aviso de recarga; el trabajo queda en el borrador |
| Una sola cuenta con cookie de 30 días | robo de sesión | `SameSite=Strict`, `HttpOnly`, `Secure`, revocación por `version`, límite de intentos, HSTS |
| Migración automática que el experto no espera | sorpresa al agregar subprocesos | cada recolocación se lista en la franja de ajustes y en la entrada de deshacer; reanclar a mano la desactiva |
| Reescritura grande en paralelo | integración rota | contratos congelados en WP0; propiedad de archivos por WP; olas con criterios verificables |
| Fijar Playwright 1.56.1 por el Chromium disponible | e2e no arranca en otro entorno | `PLAYWRIGHT_BROWSERS_PATH` configurable; la versión y el navegador se documentan en `docs/operacion.md` |

### 13.2 Distinciones que NO se pierden (riesgo de sobresimplificación)

| Distinción | Dónde se conserva |
|---|---|
| Cosa ≠ apariencia; quitar de un OPD ≠ eliminar del modelo | `Opd.apariencias` por cosa; dos comandos y dos teclas distintas; confirmación solo en eliminar |
| Objeto/proceso; física/informacional; sistémica/ambiental (8 representaciones) | `Entidad` + escena como función pura + goldens |
| Estado inicial, final, inicial y final (D10), por defecto, `Current` declarado | banderas separadas; glifos distintos (pin externo, flecha entrante); D10 en una oración |
| Supresión global ≠ local; oculto ≠ borrado | `Estado.suprimido` + `Apariencia.estadosSuprimidos`; chip ⋯N; D6 |
| TS3 compacto vs par escindido vs TS4/TS5 standalone | `escision` persistida; control prohibido en mitades; export v0 con `efectoEscindido` |
| AND vs XOR vs OR | ausencia de abanico vs `Abanico.operador`; 1 vs 2 arcos; «exactamente uno de» / «al menos uno de» |
| Evento vs condición vs sin control; su prohibición en Post(P) | `control` escalar; matriz; plantillas E*/C* |
| Agente vs instrumento y su asimetría sujeto-verbo | tipos distintos; `maneja` con sujeto objeto, `requiere` con sujeto proceso; agente solo desde físico |
| Interno vs externo persistido; mover no cambia alcance | `Apariencia.interno`; rebote; confinamiento |
| Orden temporal declarado (bandas) vs geometría | `Opd.bandas` fuente de verdad; `realizarBandas`; ningún layout las cambia |
| Descomposición (síncrona, abstrae al padre) vs despliegue (asíncrono, no abstrae, por modo) | refinamientos separados; `vista` eleva solo por descomposición; CX1/CX2/CXm vs CX3 sin «en esa secuencia» |
| Bidireccional vs recíproco vs dos unidireccionales | tres tipos en el modelo; arpones vs puntas abiertas; SE3/SE4; DB-3 declara la bisimetría parcial |
| Colección completa vs incompleta; nunca en clasificación | `coleccionIncompleta`; barra bajo el triángulo; cola «y al menos otra …» |
| Instancia visual (apariencia) vs instancia lógica (clasificación) | apariencias vs enlace `clasificacion` y rótulo `Nombre : Clase` |
| `unsupported-canonical` vs `non-canonical` vs error | códigos y razones distintos en parser e importador |
| Ausencia de línea ≠ borrado | `no-delete-by-absence`; borrado solo por comando |
| Export canónico (bloqueable) vs intercambio JSON (nunca bloqueado) | perfiles distintos en `opd/exportar.ts` y `codec/` |
| Error recuperable cargado vs rechazo de importación | `ENLACE_INVALIDO` etc. vs `referencia-rota` |
| Hecho directo vs hecho abstraído en el padre | `HechoVisible.abstraido` + `subyacentes`; parse del padre resuelve al hecho refinado |
| Canal UI (crimson) vs canales semánticos | capa UI separada del dibujante; nunca exportable |
| Validación mecánica vs validación humana | ningún gesto la declara; los textos lo dicen; límites en README y `docs/operacion.md` |
