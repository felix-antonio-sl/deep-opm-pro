# DESIGN-C — OpForja rehecho: conformidad por construcción

Arquitecto C · lente «conformidad por construcción». Autoridad de alcance y semántica:
`understand/CANON.md` (derivada de los 4 documentos del canon). Decisiones fijas:
`DECISIONS.md` (no se reabren). Este documento elige; donde hay alternativas, dice cuál y por qué.

Tesis en una línea: **los estados ilegales no se validan, no se pueden escribir**. El modelo
se tipa por rol (un consumo no tiene «origen/destino», tiene `objeto` y `proceso`); lo que el
tipo no puede expresar lo decide **una sola matriz de validez** que consultan, sin copias, el
menú de enlaces del lienzo, las operaciones del núcleo, el parser OPL, el diagnóstico y el
importador; y la simetría OPD↔OPL se **demuestra por enumeración** de esa misma matriz.

---

## 1. Principios y alcance

### 1.1 Principios de diseño (vinculantes para todo el repo)

| # | Principio | Consecuencia concreta |
|---|---|---|
| P1 | **Un solo kernel de hechos** (CANON §0.1-1, T-010). OPD y OPL son funciones puras del `Modelo`. | No hay estado derivado persistido: ni enlaces «derivados», ni puertos, ni vértices, ni posiciones de etiqueta, ni visibilidad de enlaces por OPD. |
| P2 | **Irrepresentable antes que validado.** | Enlaces tipados por rol (§3.1); estados dentro del objeto (un proceso no tiene campo `estados`); `porDefecto`/`current` son un `Id` en el objeto (≤1 por construcción); una aparición por (cosa, OPD) porque el diccionario se indexa por `cosaId`; el refinamiento vive en el OPD (no hay OPD sin refinamiento ni refinamiento sin OPD); `coleccionIncompleta` no admite `clasificacion` por tipo. |
| P3 | **Una matriz, cinco consumidores.** `nucleo/matriz.ts` es la única definición de qué enlace es legal (forma y contexto). La consultan: `tiposLegales` (menú del lienzo), `crearEnlace` y demás operaciones, el planificador OPL, `diagnosticar` y el importador v0. | Desaparece la clase de bugs «la UI ofrece lo que el kernel rechaza» y «el import acepta lo que la edición prohíbe» (dossiers modelo-nucleo §7.8, serialización §4.7). |
| P4 | **Una gramática, dos direcciones.** Cada plantilla OPL se declara una vez (`opl/plantillas.ts`) y sirve para generar y para reconocer. | La simetría es propiedad del artefacto, no una esperanza verificada con 23 fixtures. |
| P5 | **Roundtrip demostrable.** La suite enumera todas las combinaciones que la matriz declara legales y exige el fixture estricto R-§19-SIM-3 en cada una, más auto-reparseo con 0 cambios sobre los modelos reales. | Cada fila legal de la matriz sin plantilla, o con plantilla irreversible, rompe `bun run check`. |
| P6 | **El orden semántico es dato, la geometría lo realiza.** Bandas de subprocesos, orden de estados y orden de OPD hermanos son campos; ninguna coordenada decide un hecho. | El layout nunca cambia el OPL (bug de dossier render §10.2 imposible). |
| P7 | **Silencio cero.** Toda operación rechazada devuelve `Rechazo {regla, mensaje, accion}` y la UI lo muestra; todo ajuste automático deja `Traza` (R-OPD-OP-5). | No hay botones que «no hacen nada» ni normalizaciones silenciosas (T-025, T-065). |
| P8 | **Sustracción.** Una pantalla de edición, cuatro paneles, tres menús, cuatro diálogos (§7.2). Nada que el canon no exija salvo la infraestructura mínima de DECISIONS (cuenta, biblioteca, exportar). | ~15 k líneas de fuente en lugar de ~133 k. |

### 1.2 Qué entra (CANON §0.1, ni más ni menos)

1. Kernel único de cosas (objeto/proceso), estados, enlaces (14 tipos en 6 familias), abanicos
   XOR/OR, OPDs (árbol con raíz SD, refinamiento por descomposición con bandas y por despliegue
   en 4 modos) y apariciones.
2. Impedir lo prohibido y advertir lo condicionado o metodológico, con diagnóstico tipado
   (código, regla, severidad error/warning/info, familia, acción canónica, referencias).
3. Generar OPL-ES canónico por OPD y parsearlo al mismo hecho; editor OPL con los 4 estados de
   línea, 8 razones cerradas y aplicación todo-o-nada.
4. Render OPD con el vocabulario visual cerrado (8 representaciones de cosa, estados con
   designaciones, 6 decoraciones de extremo, 4 triángulos, arcos XOR/OR, marcas `e c / //`,
   chip `⋯N`, multiplicidad, ruta, duración).
5. Operaciones de refinamiento con migración/escisión e identidad persistente.
6. Export `canon-diagrama` (SVG por OPD), `canon-documento` (HTML autocontenido), OPL Markdown
   e intercambio JSON `deep-opm-pro.modelo.v0`.
7. Registro de conformidad (R-CONF-7) en el repo.
8. Infraestructura mínima (DECISIONS): una cuenta (más token Bearer opcional para agentes
   externos); biblioteca de modelos en lista simple (nuevo, abrir, renombrar, eliminar a
   papelera, restaurar, importar JSON v0 u OPL, descargar JSON); guardado automático con CAS;
   copias previas en el servidor sin UI; borrador local; búsqueda mínima; exportar; deshacer/rehacer por snapshots inmutables (costo trivial:
   estructura compartida).

### 1.3 Qué no entra (CANON §0.4 + DECISIONS)

Simulación y todo el canal runtime; bilingüismo; sub-modelos, composición, referencias externas;
Anexo C categorial (salvo la ley ejecutable de frontera T-089); Bocetos/Apunte/Taller/Graduar/
Biblioteca/versiones/carpetas; estereotipos, requisitos, vitrinas, injerto; anclaje/drift/calcar;
capa computacional (alias, unidades en nombre, tipos de dato, rangos, `donde`, `varía de`,
slots tipados); `Pr=p`, m-de-f; negación; demora; RF2o y sufijo `[etiqueta: …]`; composición de
oraciones ejes (a)/(c); semi-plegado y oraciones CX4–CX8; vistas tipificadas, mapa, `Bring`;
estilado autoral, imágenes, URLs; preset de esencia; agente LLM, tutor, mesa, revisión
compartida, paquete portátil/lector, captura de bugs, modo móvil de solo lectura, PNG.
Decisiones pendientes del dueño con su default conforme (DECISIONS): RX1/RX2 →
`unsupported-canonical`; descomposición de objeto diferida y declarada; agente solo desde objeto
físico.

### 1.4 Idioma y nomenclatura del código

UI, OPL y documentación en es-CL. El vocabulario de dominio del código es el del canon en
español, **de forma consistente en todo el repo** (DECISIONS «Idioma»: tipos, campos, funciones,
archivos: `Objeto`, `Proceso`, `Consumo`, `descomponer`, `proyectar`, `bandas`), igual que el
formato v0 y los tipos de CANON §1.2. Identificadores en ASCII (sin tildes ni `ñ`); los
**valores** conservan su grafía (`'año'`, `'dia'`). Solo quedan en inglés los nombres impuestos por la plataforma (`fetch`,
`useState`, `Bun.serve`, cabeceras HTTP). Excepción deliberada: los **valores** del formato v0
emitido conservan su grafía histórica (`"condicion"`, `"XOR"`/`"O"`, `"default"`) porque el
contrato de intercambio no se cambia (DECISIONS «mismos nombres de campo»).

### 1.5 R-CONF-7: registro de conformidad

- **Dónde**: `docs/conformidad.md`, único documento de conformidad del repo.
- **Forma** (resuelve GAP-27): dos tablas.
  1. **Brechas** (exhaustiva): toda regla DEBE/NO DEBE del canon cuyo estado ≠ `enforzado`, con
     columnas `regla · estado (R-APP-2: parcial | no implementado | zona laxa pendiente) ·
     superficies cubiertas (UI/kernel/import/OPL/export, R-APP-3) · qué hace el producto ·
     decisión (DR-n de la especificación o DR-C-n de este diseño)`.
  2. **Mapa ★**: cada requisito ★ (T-NNN de `docs/especificacion.md`) → mecanismo (archivo y
     función) → prueba. Es el mismo mapa de §4.9 de este diseño, mantenido en el repo.
- **Anti-brecha silenciosa por construcción, no por prosa** (DECISIONS 16: sin test
  autorreferente de prosa). Lo no implementado vive en **tres tablas de código**, cada fila con su
  `regla` canónica y su `motivo` (las dos primeras, además, con `registro: 'B-nn'`, su fila de
  «Brechas»): `NO_OFRECIDO` (`nucleo/matriz.ts`: combinaciones canónicas que
  ni la UI ni las operaciones crean), `NO_SOPORTADAS` (`opl/no-soportadas.ts`: familias OPL que
  el parser reconoce y responde `unsupported-canonical`) y `CATALOGO` (`nucleo/diagnostico.ts`:
  reglas que solo se advierten). El comportamiento de cada fila sí se prueba (la UI no ofrece, el
  parser responde el código, el diagnóstico aparece); **ninguna prueba lee `docs/`**. La
  correspondencia código ↔ registro se mantiene por disciplina de cambio, escrita en
  `AGENTS.md`: «todo diff que agregue, quite o cambie una fila de esas tres tablas, o el estado
  de un DEBE, actualiza `docs/conformidad.md` en el mismo commit». El gate «Deuda» del Anexo A
  (T-303) es esa revisión del diff, no una prueba.
- **Contenido inicial** de «Brechas»: §11.3.

### 1.6 Decisiones propias de este diseño (DR-C)

Resoluciones que CANON.md no fija o que ajustan una DR por una exigencia más fuerte del canon.
Todas van a `docs/decisiones.md` y, si afectan un DEBE, a «Brechas».

| DR-C | Decisión | Por qué |
|---|---|---|
| C1 | **Orden de oraciones por nombre** (colación `es`, luego id), salvo subprocesos que van por banda. Sustituye «orden de creación de la apariencia» de DR-32. | R-§19-SIM-3 (EXIGE) necesita un orden que sobreviva a reconstruir el modelo desde el texto; el orden de creación no sobrevive (§5.8). R-COMP-ELEG-3 solo pide determinismo. |
| C2 | **Mención mínima**: toda cosa visible en un OPD aparece en al menos una oración de su bloque; si ninguna la menciona, se emite D2 (`**X** es informacional.`). | R-BI-DUAL-1 (toda afirmación gráfica reproducible como OPL) y tabla 9.2 («salvo si se quiere explicitar»). Sin esto un rectángulo aislado no viaja por OPL. |
| C3 | **Distribución al descomponer ocurre cuando la descomposición pasa de 0 a ≥1 subprocesos en una operación**; TS3 se escinde si en esa operación quedan ≥2. Después, reasignar es del modelador (DR-13, A3.4). TS4 standalone migra al primero y TS5 al último. | Hace atómico el gesto «mostrar contenido + refinar enlaces» (R-OPD-OP-3) sin forzar a sembrar placeholders (DR-11). La tabla §8.5 no cubre TS4/TS5 standalone. |
| C4 | **Bocetos v0 se extraen como modelos aparte al importar**; vistas v0 se descartan (sus cosas sin otra aparición pasan al SD). Descomposición de objeto v0 ⇒ despliegue por agregación (se crean los enlaces de agregación implícitos, informados). | Bocetos y vistas están fuera de alcance (DECISIONS) y el modelo tipado no los puede representar; extraer no pierde hechos. DR-23 ya dice que las partes se modelan por despliegue de agregación. |
| C5 | **Ruta y abanico no se combinan** (no ofrecido). | R-COMB-5 realiza el abanico con ruta sin operador lógico; no hay roundtrip estricto posible. Declarado en Brechas. |
| C6 | **Edición OPL con alcance = OPD activo**; la lectura muestra todo el modelo. | Editar lo que se ve; las cosas nuevas del texto aparecen en ese OPD; el panel conserva R-OPL-TOTAL-1/2. |
| C7 | **El editor OPL libre no renombra.** Renombrar se hace sobre el token (R-OPL-EDIT-7) o en el lienzo. | Elimina la identidad posicional (bug crítico del dossier OPL §11.1). Una línea cambiada es un hecho nuevo, nunca un renombre adivinado. |
| C8 | **Dos niveles de violación**: `forma` (irrepresentable: el import rechaza) y `contexto` (representable pero inválido: el import carga y el diagnóstico lo marca como error estructural recuperable que bloquea el export). | R-ESC-OP-4 admite «rechazar o persistir como error recuperable»; T-288 queda `parcial` y declarado. |
| C9 | **Bidireccional ≡ par de unidireccionales opuestos** a efectos del parser: dos líneas SE1 inversas en un mismo bloque se reconocen como un SE3. | SE3 se emite como dos oraciones; sin esta equivalencia el reparseo desde texto aislado cambiaría el hecho. Declarado como bisimetría parcial. |
| C10 | **Etiquetas de estado y nombres fuera del léxico EBNF se normalizan al importar con informe** (espacios en estados → `-`; caracteres no admitidos → espacio; palabra que empieza con dígito se une con `-`). En edición se bloquean. | T-025 (DEBE): léxico EBNF obligatorio y «si normaliza, NO en silencio». |
| C11 | **Unicidad nominal sin distinguir mayúsculas** (es, sensibilidad a acentos); el parser resuelve con la misma clave. | DR-22; evita confundibles `Pedido`/`PEDIDO`. |
| C12 | **Frases de multiplicidad antepuestas literalmente** según EBNF/§10.1: `un opcional`/`una opcional`, `opcional (cero o más)`, `al menos un`/`al menos una`. | R-MULT-1 «anteponer la frase al sustantivo»; `singular_inferior` de la EBNF. |
| C13 | **Especialización de estado (R-OPL-RF-3, T-121 parcial) y generalización con estados: no ofrecido.** SSE1–SSE7 sí. | La EBNF solo da la forma plural `… son …`; el caso de un elemento no tiene plantilla gramatical. T-121 no es ★. |
| C14 | **Eliminar refinamiento materializa en el padre la vista abstraída** de los enlaces con el exterior antes de borrar internos (DR-17 lo permite). | Evita perder hechos externos al borrar subprocesos. |

---

## 2. Arquitectura

### 2.1 Árbol del repositorio final

Presupuesto en líneas de código no vacías (LOC). Las pruebas unitarias van junto al módulo
(`x.test.ts`); su presupuesto está en §2.3.

```
/                                   (raíz del repo)
├── README.md                       qué es, cómo correr, límites reales            ~80
├── AGENTS.md                       contrato de trabajo (actualizado)              ~45
├── CLAUDE.md                       @AGENTS.md                                       1
├── NOTICE.md                       separación legal (actualizado)                 ~15
├── Dockerfile                      2 etapas: construcción → runtime Bun           ~30
├── docker-compose.yml              1 servicio + 1 volumen + Traefik               ~35
├── .dockerignore / .gitignore
├── deploy/
│   ├── deploy.sh                   único circuito de despliegue                   ~50
│   ├── respaldo.sh                 tar.gz del volumen, retención 14               ~20
│   └── systemd/opforja-respaldo.{service,timer}                                   ~20
├── canon/                          AUTORIDAD LOCAL (DECISIONS 16), tal cual (content.md + object.yaml)
│   ├── LEEME.md                    versiones, sha256, precedencia, procedencia    ~25
│   ├── reglas-opm-estrictas-es/{content.md,object.yaml}     1.5.0
│   ├── spec-forja-opd-es/{content.md,object.yaml}           1.4.0
│   ├── spec-forja-opl-es/{content.md,object.yaml}           1.4.1
│   └── metodologia-forja-opm-es/{content.md,object.yaml}    1.7.0
├── docs/
│   ├── README.md                   índice de 1 pantalla                           ~25
│   ├── especificacion.md           CANON.md (especificación derivada, T-NNN, DR-n)
│   ├── conformidad.md              registro R-CONF-7 (brechas + mapa ★)
│   ├── guia.md                     uso: flujos y atajos                           ~250
│   ├── formato-v0.md               contrato del códec (import/export)             ~200
│   ├── operacion.md                cuenta, despliegue, respaldo, migración        ~150
│   └── decisiones.md               DECISIONS + DR-C, con porqué                   ~120
└── app/
    ├── package.json  bun.lock  bunfig.toml  tsconfig.json  vite.config.ts  index.html
    ├── playwright.config.ts
    ├── src/
    │   ├── nucleo/                 DOMINIO OPM PURO (sin DOM, sin fetch)          ≈3 620
    │   │   ├── tipos.ts            tipos exactos de §3.1                           220
    │   │   ├── resultado.ts        Resultado, Rechazo, Traza, Tx (ids, trazas)      70
    │   │   ├── ids.ts              asignador por secuencia + validación de id       40
    │   │   ├── indice.ts           índices derivados memoizados (WeakMap)          180
    │   │   ├── lexico.ts           léxico EBNF de nombres/estados/etiquetas, e/u   150
    │   │   ├── herencia.ts         cadena transitiva de generales (DR-43)           50
    │   │   ├── matriz.ts           LA matriz de validez + NO_OFRECIDO              400
    │   │   ├── forma.ts            validarForma: invariantes no tipables de §3.2   150
    │   │   ├── modelo.ts           crearModelo, renombrar, unidad, descripción      60
    │   │   ├── cosas.ts            crear/renombrar/tipo/esencia/afiliación/…/quitar/eliminar/traer/mover  320
    │   │   ├── estados.ts          agregar/renombrar/ordenar/eliminar/designar/suprimir  170
    │   │   ├── enlaces.ts          crear (con distribución), fijar campos, reanclar, cambiar tipo, eliminar  320
    │   │   ├── abanicos.ts         formar/disolver/operador/ramas                  140
    │   │   ├── refinamiento.ts     descomponer, subprocesos, bandas, desplegar, eliminar  430
    │   │   ├── proyeccion.ts       vista por OPD: visibilidad, abstracción, fuerza, SDx.y  350
    │   │   ├── colocacion.ts       colocación determinista: hueco libre, contenedor, bandas, externos, despliegue  220
    │   │   └── diagnostico.ts      catálogo de diagnósticos + gates de export      420
    │   ├── codec/                  deep-opm-pro.modelo.v0                          ≈1 150
    │   │   ├── v0.ts               tipos laxos de entrada, constantes, tablas de mapeo  120
    │   │   ├── importar.ts         normalización total + informe + rechazo         680
    │   │   ├── exportar.ts         forma canónica determinista                     230
    │   │   ├── informe.ts          Informe {normalizado, descartado, ignorado, rechazos}  70
    │   │   └── canonico.ts         leerCanonico (estricto) + revision (sha256)      50
    │   ├── opl/                    OPL-ES                                          ≈2 500
    │   │   ├── vocabulario.ts      palabras cerradas, unidades es-CL, frases de multiplicidad, y/e o/u  120
    │   │   ├── linea.ts            TokenOpl, LineaOpl, constructor de líneas         70
    │   │   ├── plantillas.ts       TABLA ÚNICA de plantillas (generar y reconocer) 520
    │   │   ├── generar.ts          emisión por OPD (secciones, agrupación, abanicos, CX)  480
    │   │   ├── analizar.ts         normalización, spans, plegado de tokens, esqueletos, listas  480
    │   │   ├── planificar.ts       hechos-texto → patches vs proyección; 4 estados; razones  360
    │   │   ├── aplicar.ts          patches → operaciones del núcleo, 3 fases, atómico  200
    │   │   ├── documento.ts        OPL de modelo completo (bloques) y su parseo (pasadas A/B)  170
    │   │   └── no-soportadas.ts    NO_SOPORTADAS y NO_CANONIZADAS con su regla       90
    │   ├── opd/                    OPD: escena pura + SVG                          ≈1 640
    │   │   ├── tokens.ts           paleta, trazos, dashes, radios, tipografía (§18) 70
    │   │   ├── metricas.ts         tabla de avances de Inria Serif; medir/envolver  90
    │   │   ├── geometria.ts        recortes exactos, peine ortogonal, rayo, lazo, arcos  330
    │   │   ├── escena.ts           escena(modelo, opd) → nodos/aristas/símbolos/etiquetas  480
    │   │   ├── Marcadores.tsx      <defs> con los paths literales del canon          110
    │   │   ├── OpdSvg.tsx          render de la escena (semántico; sin capa UI)      380
    │   │   ├── exportar.ts         canon-diagrama, canon-documento, advertencias, gates  180
    │   │   └── __golden__/*.svg    SVG canónicos de referencia (red de regresión, DECISIONS 15)
    │   ├── editor/                 ESTADO DE APLICACIÓN (sin JSX)                  ≈1 450
    │   │   ├── almacen.ts          store mínimo {get,set,suscribir} + useAlmacen     60
    │   │   ├── estado.ts           EstadoEditor, ejecutar(op), historial, selección 200
    │   │   ├── comandos.ts         registro único de comandos (menús, atajos, ayuda)        400
    │   │   ├── atajos.ts           despacho de teclado por contexto                  80
    │   │   ├── cliente.ts          cliente HTTP de la API                           130
    │   │   ├── guardado.ts         autoguardado, CAS, borrador IndexedDB, conflicto 220
    │   │   └── gestos.ts           máquina de estados del lienzo (pura, testeable)  340
    │   ├── ui/                     PREACT                                          ≈3 400 + CSS 450
    │   │   ├── App.tsx             rutas Acceso / Biblioteca / Editor               110
    │   │   ├── Acceso.tsx                                                             70
    │   │   ├── Biblioteca.tsx      lista: nuevo, abrir, renombrar, eliminar, importar, descargar; papelera 250
    │   │   ├── InformeImportacion.tsx                                               100
    │   │   ├── Editor.tsx          cabecera + 3 columnas / pestañas en estrecho     200
    │   │   ├── Lienzo.tsx          <svg>, cámara viewBox, eventos → gestos           420
    │   │   ├── CapaUi.tsx          selección, asas, fantasmas, guías de banda        180
    │   │   ├── NombreEnLinea.tsx   edición en figura + resolución de colisión       130
    │   │   ├── MenuTipoEnlace.tsx  tipos legales + motivos + vista previa OPL       150
    │   │   ├── MenuContextual.tsx  derivado del registro de comandos                  90
    │   │   ├── Inspector.tsx       cosa / estado / enlace / abanico / OPD / nada    480
    │   │   ├── ArbolOpd.tsx                                                          110
    │   │   ├── PanelOpl.tsx        bloques, tokens, realce, filtro, esencia, numeración 240
    │   │   ├── EditorOpl.tsx       texto + canaleta de estados + resumen + Aplicar  210
    │   │   ├── PanelDiagnostico.tsx                                                  110
    │   │   ├── Buscar.tsx          Ctrl+K: cosas y OPDs por nombre; ir / traer       110
    │   │   ├── Dialogo.tsx         primitivo + Decisión genérica                    130
    │   │   ├── MenuExportar.tsx                                                       80
    │   │   ├── Ayuda.tsx           atajos (del registro) + leyenda visual            70
    │   │   └── estilos.css         tokens como variables CSS; sin estilos en línea   450
    │   └── main.tsx                                                                   20
    ├── servidor/                   BUN.SERVE (depende solo de codec/ → nucleo/)    ≈950
    │   ├── principal.ts            rutas, estáticos, cabeceras, salud                240
    │   ├── sesion.ts               scrypt, cookie HMAC, CSRF, token Bearer, límite de intentos 170
    │   ├── almacen.ts              archivos, escritura atómica, CAS, papelera, copias previas, índice 230
    │   ├── cuenta.ts               CLI crear | clave | cerrar-sesiones                80
    │   └── migrar-postgres.ts      migración única desde PostgreSQL                 280
    ├── fixtures/v0/*.json          los 6 bundles de fixtures/demo-models (DECISIONS 17) + sintetico.json
    ├── e2e/                        26 escenarios Playwright + ayudas.ts
    └── herramientas/
        ├── dev.ts                  lanza vite (5173, proxy /api y /salud) + servidor Bun (8787, --datos .datos-dev)  25
        └── medir-fuente.ts         regenera opd/metricas.ts desde el woff2 (manual)  60
```

### 2.2 Dirección de dependencias

```
nucleo ──► codec ──► servidor
   │  └──► opl ──┐
   │  └──► opd ──┼──► editor ──► ui
   └─────────────┘
```

- `nucleo` no importa nada del repo. `codec` importa solo `nucleo`. `opl` y `opd` importan
  solo `nucleo` y **no se importan entre sí**: la vista previa OPL del menú de enlaces la compone
  `ui` llamando a `opl` sobre un modelo hipotético, y el documento `canon-documento` lo ensambla
  `opd/exportar.ts` recibiendo las líneas OPL ya generadas como parámetro (inyección, no import).
- `editor` importa `nucleo`, `codec`, `opl`, `opd`. `ui` importa todo lo anterior salvo
  `servidor`. `servidor` importa solo `codec` (y transitivamente `nucleo`).
- Regla ejecutable: `arquitectura.test.ts` (40 líneas) recorre los `import` de cada carpeta con
  una expresión regular y falla si una arista no está en la tabla anterior. No escribe en disco.
- Dependencias externas de ejecución: `preact`, `preact-render-to-string` (serializar la misma
  escena a SVG para exportar, en navegador y en Bun), `@fontsource/inria-serif` (fuente del
  canon, informativa; métricas deterministas). De desarrollo: `vite`, `@preact/preset-vite`,
  `typescript`, `@types/bun`, `@playwright/test`. Se retiran `jointjs`, `zustand`, `ai`,
  `@ai-sdk/*`, `eslint` y plugins, fuentes Inria Sans y JetBrains Mono.

### 2.3 Totales estimados

| Área | Fuente | Pruebas |
|---|---:|---:|
| nucleo | 3 620 | 2 750 |
| codec | 1 150 | 950 |
| opl | 2 500 | 1 800 (incluye enumeración de la matriz) |
| opd | 1 640 | 700 + golden |
| editor | 1 450 | 550 (gestos, guardado, comandos) |
| ui | 3 400 + 450 CSS | — (cubierto por e2e) |
| servidor | 1 000 | 700 |
| e2e | — | 1 450 |
| repo (arquitectura) | — | 40 |
| **Total** | **≈14 750 + 450 CSS** | **≈8 950 + golden SVG** |

Frente a ~133 k de fuente y ~70 k de pruebas actuales: 11 % y 13 %.

---

## 3. Modelo de datos interno

### 3.1 Tipos TypeScript exactos (`nucleo/tipos.ts`)

Todo es `readonly`; las operaciones devuelven modelos nuevos con estructura compartida.

```ts
export type Id = string;                                   // opaco; nunca SDx.y ni nombre (T-022)
export type TipoCosa = 'objeto' | 'proceso';               // cerrado (T-012)
export type Esencia = 'fisica' | 'informacional';          // default 'informacional'
export type Afiliacion = 'sistemica' | 'ambiental';        // default 'sistemica'
export type UnidadTiempo = 'ms' | 'sec' | 'min' | 'hour' | 'day' | 'week' | 'month' | 'year';
export type ModoDespliegue = 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion';
export type RelacionIncompleta = Exclude<ModoDespliegue, 'clasificacion'>;   // nunca clasificación (T-034)
export type Control = 'e' | 'c';                           // escalar: c+e irrepresentable (T-052)
export type Multiplicidad = '?' | '*' | '+';               // ausente = 1..1 (T-057)
export type Operador = 'XOR' | 'OR';                       // AND = ausencia de abanico (T-028)

export interface Estado {
  readonly id: Id;
  readonly nombre: string;          // una palabra que empieza en minúscula (léxico EBNF)
  readonly inicial?: true;          // 0..* por objeto, combinable con final (D10)
  readonly final?: true;
  readonly suprimido?: true;        // supresión global (T-018)
}

interface CosaBase {
  readonly id: Id;
  readonly nombre: string;          // léxico EBNF; único en el modelo sin distinguir mayúsculas
  readonly esencia: Esencia;
  readonly afiliacion: Afiliacion;
  readonly genero?: 'f';            // ausente = masculino (R-OPL-1)
  readonly descripcion?: string;    // meta: no emite OPL (T-004)
  readonly incompleta?: readonly RelacionIncompleta[];   // colección incompleta DECLARADA como refinable
}
export interface Objeto extends CosaBase {
  readonly tipo: 'objeto';
  readonly estados: readonly Estado[];   // el orden del arreglo es el orden del modelo (T-015)
  readonly porDefecto?: Id;              // ∈ estados: ≤1 por construcción
  readonly current?: Id;                 // ∈ estados: ≤1 por construcción; declarado, jamás runtime
  readonly valor?: string;               // valor puntual de atributo (T-020)
}
export interface Duracion {
  readonly min?: number; readonly esperada?: number; readonly max?: number;   // > 0
  readonly unidad?: UnidadTiempo;        // ausente = unidad del modelo (R-EXC-5)
}
export interface Proceso extends CosaBase {
  readonly tipo: 'proceso';              // sin campo estados: estado de proceso irrepresentable (AP-12)
  readonly duracion?: Duracion;
}
export type Cosa = Objeto | Proceso;

// ---- Enlaces: extremos nombrados por rol; la dirección canónica es implícita en el tipo ----
interface EnlaceBase { readonly id: Id }
export interface Consumo extends EnlaceBase {
  readonly tipo: 'consumo'; readonly objeto: Id; readonly proceso: Id;
  readonly estado?: Id; readonly control?: Control; readonly ruta?: string; readonly mult?: Multiplicidad;
}
export interface Resultado extends EnlaceBase {        // sin control: AP-01/AP-02 irrepresentables
  readonly tipo: 'resultado'; readonly objeto: Id; readonly proceso: Id;
  readonly estado?: Id; readonly ruta?: string; readonly mult?: Multiplicidad;
}
export interface Efecto extends EnlaceBase {           // T3 | TS3 | TS4 | TS5 según entrada/salida
  readonly tipo: 'efecto'; readonly objeto: Id; readonly proceso: Id;
  readonly entrada?: Id; readonly salida?: Id;
  readonly control?: Control; readonly mult?: Multiplicidad;
  readonly escision?: { readonly par: Id; readonly mitad: 'entrada' | 'salida' };   // R-ESCIND-0
}
export interface Agente extends EnlaceBase {
  readonly tipo: 'agente'; readonly objeto: Id; readonly proceso: Id;
  readonly estado?: Id; readonly control?: Control; readonly mult?: Multiplicidad;
}
export interface Instrumento extends EnlaceBase {
  readonly tipo: 'instrumento'; readonly objeto: Id; readonly proceso: Id;
  readonly estado?: Id; readonly control?: Control; readonly mult?: Multiplicidad;
}
export interface Invocacion extends EnlaceBase {       // invocador === invocado ⇒ autoinvocación (IV2)
  readonly tipo: 'invocacion'; readonly invocador: Id; readonly invocado: Id;
}
export interface Excepcion extends EnlaceBase {        // nunca control (R-EXC-1B)
  readonly tipo: 'excepcionSobretiempo' | 'excepcionSubtiempo'; readonly fuente: Id; readonly manejo: Id;
}
export interface Agregacion extends EnlaceBase {       // multiplicidad solo en la parte (DR-44)
  readonly tipo: 'agregacion'; readonly todo: Id; readonly parte: Id; readonly mult?: Multiplicidad;
}
export interface Exhibicion extends EnlaceBase { readonly tipo: 'exhibicion'; readonly exhibidor: Id; readonly rasgo: Id }
export interface Generalizacion extends EnlaceBase { readonly tipo: 'generalizacion'; readonly general: Id; readonly especializacion: Id }
export interface Clasificacion extends EnlaceBase { readonly tipo: 'clasificacion'; readonly clase: Id; readonly instancia: Id }
interface EtiquetadoBase extends EnlaceBase {
  readonly origen: Id; readonly destino: Id;
  readonly estadoOrigen?: Id; readonly estadoDestino?: Id;
  readonly multOrigen?: Multiplicidad; readonly multDestino?: Multiplicidad;
}
export interface Etiquetado extends EtiquetadoBase { readonly tipo: 'etiquetado'; readonly etiqueta?: string }        // SE1/SE2, SSE1–3; origen===destino admitido
export interface Bidireccional extends EtiquetadoBase { readonly tipo: 'etiquetadoBidireccional'; readonly etiqueta: string; readonly inversa: string }  // SE3, SSE4/5; etiqueta≠inversa
export interface Reciproco extends EtiquetadoBase { readonly tipo: 'reciproco'; readonly etiqueta?: string }        // SE4/SE5, SSE6/7

export type Enlace = Consumo | Resultado | Efecto | Agente | Instrumento | Invocacion | Excepcion
  | Agregacion | Exhibicion | Generalizacion | Clasificacion | Etiquetado | Bidireccional | Reciproco;
export type TipoEnlace = Enlace['tipo'];   // 15 literales: 14 tipos canónicos (+1 por las dos excepciones)

export interface Abanico {
  readonly id: Id;
  readonly operador: Operador;
  readonly enlaces: readonly Id[];         // n ≥ 2; mismo tipo; extremo común (contexto, §4.3)
}

// ---- OPDs: el refinamiento vive en el OPD hijo (fuente única) ----
export interface Aparicion {               // clave = cosaId: ≤1 aparición por (cosa, OPD) (DR-25)
  readonly x: number; readonly y: number;  // enteros; esquina superior izquierda declarada
  readonly ancho: number; readonly alto: number;   // tamaño mínimo declarado; el render lo expande (AP-23)
  readonly ocultos?: readonly Id[];        // supresión local de estados (LF-03)
}
interface OpdBase { readonly id: Id; readonly apariciones: Readonly<Record<Id, Aparicion>> }
export interface OpdRaiz extends OpdBase { readonly tipo: 'raiz' }
export interface OpdDescomposicion extends OpdBase {
  readonly tipo: 'descomposicion';
  readonly padre: Id; readonly cosa: Id;   // cosa: proceso (descomposición de objeto diferida, DR-23)
  readonly orden: number;                  // orden entre hermanos (etiqueta SDx.y)
  readonly bandas: readonly (readonly Id[])[];   // subprocesos; banda = paralelo; fuente de verdad del tiempo
  readonly objetosInternos: readonly Id[];       // alcance persistido (T-033)
}
export interface OpdDespliegue extends OpdBase {
  readonly tipo: 'despliegue';
  readonly padre: Id; readonly cosa: Id; readonly orden: number;
  readonly modo: ModoDespliegue;
}
export type Opd = OpdRaiz | OpdDescomposicion | OpdDespliegue;

export interface Modelo {
  readonly id: Id;
  readonly nombre: string;                 // texto libre (no es nombre OPM)
  readonly descripcion?: string;
  readonly unidadTiempo: UnidadTiempo;     // default 'min'
  readonly raiz: Id;                       // opds[raiz].tipo === 'raiz'
  readonly cosas: Readonly<Record<Id, Cosa>>;
  readonly enlaces: Readonly<Record<Id, Enlace>>;
  readonly abanicos: Readonly<Record<Id, Abanico>>;
  readonly opds: Readonly<Record<Id, Opd>>;
  readonly secuencia: number;              // siguiente número para ids nuevos
}
```

Datos **derivados, nunca persistidos**: perseverancia (del tipo, T-014), etiqueta `SDx.y`
(preorden por `orden`), refinamientos de una cosa (índice sobre `opds`), alcance
contenedor/interno/externo (`cosa`/`bandas`/`objetosInternos`), visibilidad de enlaces por OPD
(proyección), posición vertical de subprocesos (banda), geometría de estados, rutas y
etiquetas de enlaces, extremo común de un abanico, afiliación efectiva por cadena estructural
(para el dash), colección incompleta de vista (§4.5.5).

### 3.2 Invariantes: por tipo vs por verificación

| Invariante | Mecanismo |
|---|---|
| Estado solo en objetos; nunca flotante; orden persistido | tipo (`Objeto.estados`) |
| ≤1 por defecto y ≤1 current por objeto | tipo (`porDefecto?: Id`, `current?: Id`) |
| c y e simultáneos; control en resultado/invocación/excepción/estructural | tipo |
| Multiplicidad en extremo proceso o en el todo | tipo (un solo `mult` en el extremo legal) |
| Ruta fuera de consumo/resultado | tipo |
| Colección incompleta de clasificación | tipo |
| Dos apariciones de la misma cosa en un OPD; instancia visual de otro tipo (AP-15) | tipo (clave `cosaId`) |
| OPD sin refinamiento (salvo raíz); refinamiento sin OPD | tipo (`Opd` discriminado) |
| Bandas solo en descomposición; modo solo en despliegue | tipo |
| Estado del enlace pertenece a su objeto; `escision` coherente (par existe, mismo objeto y proceso, mitades opuestas, cada mitad con un solo estado) | `validarForma` (matriz, nivel forma) |
| Mismo tipo en agregación/generalización/clasificación/etiquetados; roles objeto/proceso correctos | `validarForma` |
| ≤1 descomposición y ≤1 despliegue por cosa; `padre` contiene una aparición de `cosa`; aciclicidad; hermanos con `orden` distinto | `validarForma` (árbol) |
| Bandas particionan exactamente los procesos internos; internos aparecen solo en su OPD y descendientes | `validarForma` |
| Toda cosa tiene ≥1 aparición; todo enlace es visible en ≥1 OPD; referencias resueltas | `validarForma` (las operaciones lo mantienen; el códec rechaza lo contrario) |
| Unicidad nominal; léxico | `validarForma` (operaciones bloquean; el códec normaliza con informe) |
| Contexto (agente físico, efecto con estados, resultado no inicial, unicidad por par, contorno, bandas, AP-27, abanicos) | matriz nivel contexto → diagnóstico `error` si ya está en el modelo |

`validarForma(m): Violacion[]` corre en: salida del importador (debe ser vacía), en cada
prueba (`afterEach` de las suites del núcleo) y, en desarrollo, tras cada operación
(`import.meta.env.DEV`). Nunca en producción por operación (costo).

### 3.3 Identificadores

- Formato `prefijo-N`: `o-` objeto, `p-` proceso, `s-` estado, `e-` enlace, `f-` abanico,
  `opd-` OPD; `N` sale de `Modelo.secuencia` y se incrementa en la misma transacción
  (`Tx.nuevoId(prefijo)`): una sola vía de asignación (dossier modelo-nucleo §3.9).
- Ids importados se conservan tal cual si cumplen `^[A-Za-z0-9._:-]{1,80}$`; si no, se
  reasignan con informe (`normalizado`). `secuencia` al importar = `max(nextSeq, 1 + mayor
  sufijo numérico encontrado)`.
- Id de modelo (biblioteca): `m-` + 12 hex aleatorios (`crypto.getRandomValues`); los modelos
  migrados conservan el id del registro PostgreSQL. Invariante: nombre de archivo ==
  `modelo.id`.
- Ids de export sin semántica (derivados, estables): aparición `a-<opdId>-<cosaId>`,
  aparición de enlace `ae-<opdId>-<enlaceId>`.

### 3.4 Códec `deep-opm-pro.modelo.v0`

#### 3.4.1 Contrato

```ts
// codec/importar.ts
export function importarV0(texto: string): ResultadoImport;
export type ResultadoImport =
  | { ok: true; modelo: Modelo; extraidos: Modelo[]; informe: Informe }   // extraidos = Bocetos v0 (DR-C4)
  | { ok: false; informe: Informe };                                       // informe.rechazos no vacío
export interface Informe {
  normalizado: Entrada[];            // transformación equivalente (no pierde hechos)
  descartado: Entrada[];             // información no representable: pérdida declarada
  ignorado: Record<string, number>;  // campos visuales/derivables/redundantes: ruta → conteo
  rechazos: Entrada[];               // referencias rotas o violaciones de forma ⇒ no se importa
  visibilidad: DiffVisibilidad[];    // riesgo SYNTHESIS §8-21: qué cambia de OPD al derivar la vista
}
export interface DiffVisibilidad {   // uno por OPD con diferencias; vacío ⇒ la vista derivada coincide con la v0
  opd: Id; etiqueta: string;         // "SD1"
  aparecen: { enlace?: Id; abanico?: Id; texto: string }[];     // visibles ahora y no en v0.opds[].enlaces / abanico.opdId
  desaparecen: { enlace?: Id; abanico?: Id; texto: string }[];  // texto = describirEnlace(): "consumo: Pedido → Despachar"
}
export interface Entrada { ruta: string; mensaje: string; regla?: string }   // ruta: "enlaces.e-19.multiplicidadOrigen"
// codec/exportar.ts
export function exportarV0(m: Modelo): string;                  // determinista, canónico
// codec/canonico.ts
export function leerCanonico(texto: string): Resultado<Modelo>; // estricto: solo texto === exportarV0(importarV0(texto))
export function revision(texto: string): Promise<string>;       // sha256 hex (CAS)
```

Leyes (probadas sobre todos los fixtures, §10): `exportarV0(m)` es punto fijo:
`exportarV0(importarV0(exportarV0(m)).modelo) === exportarV0(m)`, con `informe` vacío salvo
`ignorado` de campos que el propio export deriva; y `exportarV0(aplicar(m, [])) === exportarV0(m)`
(T-196).

#### 3.4.2 Etapas del importador (todas puras; acumula todos los rechazos antes de fallar)

1. **Sobre**. `JSON.parse` (falla ⇒ rechazo «JSON inválido»). Acepta: documento
   `{formato:"deep-opm-pro.modelo.v0", modelo}`; registro persistido `{json: string, …}` (se
   desenvuelve); sobre de recuperación `{format:"opforja.local-recovery.v1", document}`. Otro
   `formato` ⇒ rechazo (no se adivina). `carpetaId` del sobre ⇒ `ignorado`.
2. **Colecciones**. `entidades`, `estados`, `enlaces`, `abanicos`, `opds` como `Record` (v0) o
   arreglo (bundles del Apéndice F); ausentes ⇒ vacías. Id duplicado ⇒ rechazo. Claves de
   `Record` distintas de `id` ⇒ rechazo.
3. **Referencias**. Toda referencia (estado→entidad, extremo→entidad/estado, aparición→entidad y
   OPD, refinamiento→OPD, `padreId`, abanico→enlaces, escisión→par) debe resolverse; cada rota es
   un rechazo (método F). No se repara nada que sea referencia.
4. **Cosas**. Enums con default si faltan (`normalizado`). Nombre: léxico EBNF (DR-C10): NFC;
   caracteres fuera de `letra|dígito|-|_|espacio` ⇒ espacio; diacríticos no admitidos (à, ç, ö…)
   ⇒ letra base; espacios colapsados; palabra que empieza con dígito se une a la anterior con `-`
   (`Impresora 3D` ⇒ `Impresora-3D`); primera letra a mayúscula; vacío ⇒ `Cosa-<id>`; colisión
   (sin distinguir mayúsculas, C11) ⇒ la segunda y siguientes reciben sufijo `-2`, `-3`… (léxico
   válido; nunca se fusionan ni se rechaza el documento: riesgo SYNTHESIS §8-9). Cada cambio ⇒ `normalizado` con la regla
   R-§18-LEX-1. `descripcion` se conserva. `valorSlot.valor` ⇒ `valor` (string); `valorSlot`
   sin valor ⇒ `ignorado`; su `tipo` ⇒ `descartado` (capa computacional). `esAtributo` ⇒
   `ignorado` (derivable). `alias`, `unidad`, `imagen`, `urls`, `simulacion`, `estereotipoId`,
   `anclaje`, `requisito`, `lineal` ⇒ `descartado`. `layoutEstados`, `orderedFundamentalTypes` ⇒
   `ignorado`.
5. **Estados**. Dueño proceso ⇒ rechazo (forma). Orden: `orden` si todos lo tienen; si no,
   sufijo numérico del id; si no, orden de aparición. Nombre: minúscula inicial, espacios ⇒ `-`
   (`no disponible` ⇒ `no-disponible`), resto como cosas; duplicado en el objeto ⇒ sufijo `-2`.
   Designaciones: `esInicial`/`esFinal` **o** `designaciones` ∋ `inicial`/`final` (la unión;
   duplicadas ⇒ `normalizado`); `default` ⇒ `porDefecto` del objeto (si hay >1: el primero por
   orden, el resto `descartado`); `current` ídem. `suprimido` ⇒ `suprimido`. `duracion`,
   `x/y/width/height` ⇒ `descartado` / `ignorado` respectivamente. Un único estado es válido
   (R-OBJ-2; se retira el axioma v0 de ≥2).
6. **OPDs**. Raíz = `opdRaizId`. Cada otro OPD se clasifica:
   - **refinamiento**: una entidad lo apunta en `refinamientos.descomposicion|despliegue`
     (también la forma legacy `refinamiento: {tipo, opdId, modo?}` ⇒ `normalizado`). Si ambas
     ranuras apuntan al mismo OPD ⇒ rechazo. `despliegue.modo` ausente ⇒ `agregacion`
     (`normalizado`).
   - **descomposición de objeto** (DR-C4): se convierte en despliegue por agregación; cada objeto
     interno sin agregación desde la cosa recibe una agregación nueva (`normalizado`, regla DR-23,
     con los ids creados); procesos internos pasan a externos (`normalizado`). Si la cosa ya tiene
     despliegue ⇒ rechazo «descomposición y despliegue de objeto simultáneos».
   - **boceto** (`padreId: null`, no raíz) o **huérfano** (con padre pero sin entidad que lo
     refine): su subárbol se extrae a un modelo aparte (`extraidos`, nombre
     `«<modelo> · boceto <n>»`): copia las cosas con aparición en el subárbol, sus estados, los
     enlaces visibles en él y los abanicos completos entre ellos; en el modelo principal se
     retiran el subárbol, las cosas sin otra aparición y los enlaces que quedan sin visibilidad
     (todo en `normalizado`).
   - **vista** (`vista` presente: generic/requirement/submodel-view): se descarta (`descartado`);
     cosas sin otra aparición se ubican en el SD en huecos libres (`normalizado`).
   - `padre` del refinamiento: `padreId`; ausente ⇒ el OPD donde aparece la cosa refinada más
     cercano a la raíz (`normalizado`). Si el padre no contiene aparición de la cosa ⇒ rechazo.
     Ciclo ⇒ rechazo.
   - Orden entre hermanos: `ordenLocal` si todos lo tienen; si no, orden natural de ids.
   - **Bandas** (descomposición): `ordenInzoom` si existe (se filtra a procesos internos, se
     completa con internos faltantes en bandas nuevas al final por Y: `normalizado`); si no, se
     derivan de la geometría: internos ordenados por `y` del borde superior, misma banda si
     |Δy| ≤ 4 px (porte de `agruparSubprocesosParalelos`) ⇒ `normalizado` «orden derivado de
     geometría».
   - **Internos**: `contextoRefinamiento.rol` (`contorno` ⇒ contenedor, `interno`, `externo`);
     sin contexto ⇒ porte de `aparienciaEsInternaDeRefinamiento` (dentro del bbox del contorno y
     sin aparición en el padre) ⇒ `normalizado`. Un interno que aparece fuera de su subárbol ⇒
     pasa a externo (`normalizado`, regla método A3.3).
   - **Apariciones**: duplicada en el OPD ⇒ se conserva la de menor id (`normalizado`, DR-25);
     coordenadas redondeadas a entero; `width/height` ≤ 0 ⇒ mínimo del render (`normalizado`);
     `estadosSuprimidos` ⇒ `ocultos` (filtrados a estados propios). `ports`, `modoTamano`,
     `modoPlegado`, `ordenPartes`, `parteExtraidaDe`, `id` ⇒ `ignorado`. `preguntaGuia`,
     `nombre` de OPD que no sea etiqueta automática (`^SD[\d.]*\b`) ⇒ `descartado`.
   - Cosa sin ninguna aparición ⇒ se ubica en el SD (`normalizado`, T-262).
7. **Enlaces** (extremo `string` ⇒ `{kind:"entidad", id}`: `normalizado`). Por tipo v0:
   - `consumo`, `agente`, `instrumento`: extremo origen objeto o estado de un objeto, destino
     proceso ⇒ `{objeto, proceso, estado?}`; invertido o categorías erróneas ⇒ rechazo (forma).
   - `resultado`: origen proceso, destino objeto o estado.
   - `efecto` (una sola codificación interna, dossier modelo-nucleo §8.3):
     - compacto `P→O` con `estadoEntradaId`/`estadoSalidaId` ⇒ TS3/TS4/TS5/T3;
     - extremo estado (`estado→P` ⇒ `entrada`; `P→estado` ⇒ `salida`);
     - `O→P` entre entidades (rama v0) ⇒ T3 (la dirección del efecto no es semántica);
     - `efectoEscindido{grupoId, rol, modo:"par"}` ⇒ ambos miembros del grupo con
       `escision {par, mitad}`; `modo:"standalone"` o grupo de un solo miembro ⇒ sin escisión
       (`normalizado`); `enlacePadreId` ⇒ `ignorado`.
   - **Par v0 consumo(estado)+resultado(estado)** sobre el mismo (objeto, proceso), sin abanico
     ⇒ un solo `efecto` TS3 con el id del consumo (`normalizado`, R-OPL-PERSIST y tabla 9.2
     «flecha desde estado origen + flecha hacia estado destino»); `rutaEtiqueta` de ese par ⇒
     `descartado` (DR-19).
   - `invocacion` (origen = destino admitido), `excepcionSobretiempo|Subtiempo` ⇒ tipos propios;
     `tiempoMaximo`/`tiempoMinimo` + unidad (texto v0: `ms|s|min|h|dia|sem|mes|año` y variantes)
     ⇒ `duracion.max|min` de la **fuente** (`normalizado`, R-EXC-2/3); conflicto entre dos
     excepciones de la misma fuente ⇒ se conserva el primero, el otro `descartado`.
     `excepcionSubSobretiempo` ⇒ dos enlaces (sobretiempo con el id original, subtiempo con
     `<id>~sub`) (`normalizado`: la oración combinada es la disyunción de ambas).
   - Estructurales fundamentales con extremo estado ⇒ rechazo (forma, V-237).
   - `etiquetado`: `etiqueta` vacía ⇒ SE2; estados en extremos ⇒ `estadoOrigen/Destino`.
     `etiquetadoBidireccional`: `backwardTag === etiqueta` (incluidos ambos vacíos) ⇒ `reciproco`
     (`normalizado`, R-STRE-1); exactamente una etiqueta vacía ⇒ dos `etiquetado` opuestos (DR-C9,
     `normalizado`); estado solo en destino ⇒ rechazo (forma, AP-11). Tipo `reciproco` no existe
     en v0 (se emite como bidireccional con etiquetas iguales).
   - `modificador` `condicion|evento` ⇒ `c|e`; ausente pero `subtipoModificador` `C|E` ⇒ ídem
     (`normalizado`); `"no"` ⇒ `descartado` (negación, §0.4). `subtipoModificador` ⇒ `ignorado`.
   - Multiplicidad: `?`, `0..1` ⇒ `?`; `*`, `0..*` ⇒ `*`; `+`, `1..*`, `1..N` ⇒ `+`; `1`,
     `1..1` ⇒ ausente; cualquier otro valor (`2`, `1..5`, `N`, `2..*`, `0..N`) ⇒ `descartado`
     (DR-21). Se asigna al extremo legal; en extremo ilegal (proceso, todo) ⇒
     `descartado` (R-MULT-1A, DR-44).
   - `rutaEtiqueta` ⇒ `ruta` en consumo/resultado; en otro tipo ⇒ `descartado` (DR-19). En rama de
     abanico ⇒ `descartado` (DR-C5).
   - `etiqueta` no vacía en tipos no etiquetados ⇒ `descartado` (sufijo ext §6.5).
   - `probabilidad`, `demora`, `tasa`, `unidadesTasa`, `requisitos`, `mostrarRequisitos` ⇒
     `descartado`. `grupoEstructuralId`, `portId` ⇒ `ignorado`.
   - Control + `c` con multiplicidad ⇒ se conserva el control y se descarta la multiplicidad
     (DR-44).
   - Autoenlace no admitido (salvo invocación y etiquetado) ⇒ rechazo.
8. **Derivados v0** (`derivado.tipo = "enlace-externo-refinamiento"`), con la estructura de
   refinamiento ya resuelta:
   - `origen:"automatico"` (o ausente): proyección materializada ⇒ se descarta (`ignorado`) y se
     asegura que su enlace padre quede donde el canon lo pone: consumo, evento de objeto
     sistémico y TS4 ⇒ primer subproceso (el del derivado automático si existe); resultado y
     TS5 ⇒ último; TS3 ⇒ escisión TS4/TS5 (ids: el padre para la mitad de entrada, el derivado de
     salida para la otra); agente, instrumento, efecto simple ⇒ quedan en el contorno
     (`normalizado`).
   - `origen:"manual"` (reanclado por el modelador): el enlace padre toma el extremo del derivado
     (mismo id del padre); si hay varios manuales del mismo padre, el primero reancla el padre y
     los demás quedan como enlaces propios con su id (`normalizado`).
   - derivado huérfano (padre inexistente) ⇒ `descartado`.
9. **Abanicos**: `operador` `O` ⇒ `OR`, `XOR` ⇒ `XOR`; `enlaceIds` ⇒ `enlaces` (ids de enlaces
   eliminados por normalización se retiran; <2 ramas ⇒ abanico `descartado`); enlace en dos
   abanicos ⇒ se queda en el primero (`normalizado`). `puertoComun`, `puertoEntidadId`, `opdId`
   ⇒ se reconocen como derivados (no se informan si coinciden con lo que emitiría `exportarV0`);
   si el extremo común declarado no coincide con el derivado ⇒ `normalizado`; si `opdId` difiere
   del OPD derivado ⇒ entra al diff de visibilidad (etapa 12). `decision` ⇒ `descartado`. Violaciones de contexto (tipos mixtos, sin extremo
   común, control mixto) se **cargan**: el diagnóstico las marca `error` (DR-C8).
10. **Modelo**: `secuencia` (§3.3); `unidadTiempo` ausente ⇒ `min`; `descripcion` se conserva.
    `ontologia`, `satisfaccionesRequisito`, `declaracionesNoNucleares`,
    `familiasEfectosPreestado`, `anclasNormativas`, `notasMesa`, `mesaExploracion`,
    `estereotipos`, `procedencia`, `fichaTrabajo`, `lentesConocimiento`, `submodelos`,
    `pieceLineage`, `referenciaPadreSubmodelo` ⇒ `descartado` (una entrada por campo con conteo);
    `archivado`, `archivadoEn`, `versiones`, `crearVersionAlGuardar` ⇒ `ignorado`. Toda clave
    desconocida ⇒ `descartado` «campo desconocido».
11. **Cierre**: `validarForma` (§3.2) sobre el resultado; cualquier violación residual ⇒ rechazo
    (no debería ocurrir; es la red de seguridad). Violaciones de **contexto** no rechazan.
12. **Diff de visibilidad** (SYNTHESIS §3.9-14 y §8-21): para cada OPD, conjunto v0 = ids de
    `opds[o].enlaces[*].enlaceId` (tras mapear ids normalizados y derivados de la etapa 8) y
    abanicos con `opdId = o`; conjunto derivado = `proyectar(modelo, o).enlaces` y sus abanicos.
    Las diferencias van a `informe.visibilidad` con `describirEnlace` (texto de hechos, sin
    depender de `opl/`). La UI (`InformeImportacion`) las muestra además como líneas OPL
    (llamando a `opl` desde `ui`); el migrador las escribe en el INFORME por modelo. Un v0
    importado desde un export propio da diff vacío (el export emite exactamente la vista derivada).

#### 3.4.3 Forma exacta emitida por `exportarV0`

Reglas: mismas claves y valores del núcleo v0 donde el concepto existe; campos nuevos solo
donde v0 no tiene concepto (DR-41: `unidadTiempo`, `genero`, `duracion`, `coleccionIncompleta`);
opcionales omitidos cuando valen su default; `Record` ordenados por id en orden natural (`o-2` <
`o-10`); claves de cada objeto en el orden fijo mostrado; enteros para coordenadas;
`JSON.stringify(doc, null, 2) + "\n"`.

```jsonc
{
  "formato": "deep-opm-pro.modelo.v0",
  "modelo": {
    "id": "m-3f9a1c0d2b7e", "nombre": "Despacho", "descripcion": "…",   // descripcion si existe
    "unidadTiempo": "sec",                       // solo si ≠ "min"
    "opdRaizId": "opd-1", "nextSeq": 42,
    "entidades": {
      "o-3": { "id": "o-3", "tipo": "objeto", "nombre": "Pedido", "esencia": "informacional",
               "afiliacion": "sistemica", "descripcion": "…", "genero": "f",
               "valorSlot": { "tipo": "string", "placeholder": "value", "valor": "12" },
               "coleccionIncompleta": ["agregacion"] },
      "p-4": { "id": "p-4", "tipo": "proceso", "nombre": "Despachar", "esencia": "fisica",
               "afiliacion": "sistemica",
               "duracion": { "min": 1, "esperada": 3, "max": 5, "unidad": "min" },
               "refinamientos": { "descomposicion": { "opdId": "opd-2" },
                                  "despliegue": { "opdId": "opd-5", "modo": "agregacion" } } }
    },
    "estados": {
      "s-5": { "id": "s-5", "entidadId": "o-3", "nombre": "pendiente", "orden": 0,
               "esInicial": true, "designaciones": ["default"] },
      "s-6": { "id": "s-6", "entidadId": "o-3", "nombre": "listo", "orden": 1, "esFinal": true,
               "suprimido": true }
    },
    "enlaces": {
      // consumo/agente/instrumento: origen = objeto o su estado; destino = proceso
      "e-7": { "id": "e-7", "tipo": "consumo", "origenId": { "kind": "estado", "id": "s-5" },
               "destinoId": { "kind": "entidad", "id": "p-4" }, "etiqueta": "",
               "modificador": "condicion", "multiplicidadOrigen": "+", "rutaEtiqueta": "L1" },
      // efecto: SIEMPRE compacto proceso → objeto (una sola codificación)
      "e-8": { "id": "e-8", "tipo": "efecto", "origenId": { "kind": "entidad", "id": "p-9" },
               "destinoId": { "kind": "entidad", "id": "o-3" }, "etiqueta": "",
               "estadoEntradaId": "s-5",
               "efectoEscindido": { "grupoId": "e-8", "enlacePadreId": "e-8", "rol": "entrada", "modo": "par" } },
      // estructurales: origen = refinable (todo/exhibidor/general/clase), destino = refinador
      "e-10": { "id": "e-10", "tipo": "agregacion", "origenId": {…}, "destinoId": {…},
                "etiqueta": "", "multiplicidadDestino": "*" },
      // recíproco ⇒ bidireccional con backwardTag === etiqueta (grafía v0)
      "e-11": { "id": "e-11", "tipo": "etiquetadoBidireccional", "origenId": {…}, "destinoId": {…},
                "etiqueta": "colaboran", "backwardTag": "colaboran" }
    },
    // abanico: forma v0 completa (tipo Abanico actual: campos obligatorios), todo derivado salvo operador y ramas
    "abanicos": { "f-12": { "id": "f-12", "opdId": "opd-1",             // primer OPD (preorden) donde ≥2 ramas son visibles
                            "puertoComun": { "entidadId": "p-4", "lado": "destino", "portId": "puerto-f-12" },
                            "puertoEntidadId": "p-4", "operador": "XOR", "enlaceIds": ["e-7", "e-13"] } },
    "opds": {
      "opd-1": { "id": "opd-1", "nombre": "SD", "padreId": null,
                 "apariencias": { "a-opd-1-o-3": { "id": "a-opd-1-o-3", "entidadId": "o-3",
                    "opdId": "opd-1", "x": 120, "y": 80, "width": 135, "height": 60,
                    "estadosSuprimidos": ["s-6"] } },
                 "enlaces": { "ae-opd-1-e-7": { "id": "ae-opd-1-e-7", "enlaceId": "e-7",
                    "opdId": "opd-1", "vertices": [] } } },               // derivado: enlaces con ambos extremos presentes
      "opd-2": { "id": "opd-2", "nombre": "SD1", "padreId": "opd-1", "ordenLocal": 0,
                 "ordenInzoom": [["p-9"], ["p-14", "p-15"]],               // bandas (siempre si hay subprocesos)
                 "apariencias": { "a-opd-2-p-4": { …, "contextoRefinamiento":
                    { "tipo": "descomposicion", "refinableEntidadId": "p-4", "rol": "contorno" } },
                    "a-opd-2-p-9": { …, "contextoRefinamiento": { …, "rol": "interno" } } },
                 "enlaces": { … } }
    }
  }
}
```

Mapeos de salida: control `e|c` ⇒ `modificador` `evento|condicion`; `OR` ⇒ `"O"`;
`porDefecto` ⇒ `designaciones:["default"]` en ese estado, `current` ⇒ `["current"]` (orden fijo
`default, current`); `inicial/final` ⇒ `esInicial/esFinal` (nunca duplicados en
`designaciones`); multiplicidad al extremo del objeto (`multiplicidadOrigen` en consumo/agente/
instrumento, `multiplicidadDestino` en resultado/efecto/agregación, ambos en etiquetados); estado
del enlace ⇒ `kind:"estado"` en el extremo objeto, salvo efecto (compacto con
`estadoEntradaId/estadoSalidaId`); `escision` ⇒ `efectoEscindido` con `grupoId = enlacePadreId =
id de la mitad de entrada`, `modo:"par"`; `contextoRefinamiento` solo en OPDs de descomposición
(`contorno|interno|externo`), nunca en despliegue; `nombre` del OPD = etiqueta `SDx.y`.

#### 3.4.4 Punto fijo y lector estricto

- Lo que el export deriva (`opds[].enlaces`, `apariencias[].id`, `opds[].nombre`,
  `efectoEscindido.enlacePadreId`, `abanicos[].opdId|puertoComun|puertoEntidadId`) el importador
  lo **reconoce y no lo informa**; por eso el informe de `importarV0(exportarV0(m))` es vacío,
  incluido `visibilidad`.
- Compatibilidad hacia atrás: el documento emitido satisface los tipos v0 actuales
  (`app/src/modelo/tipos/*`: `etiqueta` siempre presente, abanico con sus tres campos
  obligatorios, `refinamientos` plural). Única diferencia observable para un lector v0 antiguo:
  admite objetos con **un** estado (R-OBJ-2, `s ≥ 1`; CANON §10.2 manda reglas sobre la
  limitación v0) y no emite `ports`, `symbolAnchors`, `labelPositions` ni `x/y` de estado.
  Declarado en `docs/formato-v0.md`.
- `leerCanonico(texto)` = `importarV0` + exigir `normalizado = descartado = rechazos = [] ∧
  extraidos = [] ∧ exportarV0(modelo) === texto`. Lo usan el servidor (en cada escritura) y el
  cliente (al abrir). El almacén solo contiene documentos canónicos: cada archivo es a la vez el
  estado persistido y un bundle de intercambio limpio.

---

## 4. Núcleo

### 4.1 Resultados, rechazos y trazas (`nucleo/resultado.ts`)

```ts
export interface Rechazo { regla: string; mensaje: string; accion?: string; refs?: Ref[] }
export interface Traza  { regla: string; mensaje: string; refs: Ref[] }        // ajuste automático (R-OPD-OP-5)
export type Ref = { tipo: 'cosa' | 'estado' | 'enlace' | 'abanico' | 'opd'; id: Id };
export type Resultado<T> = { ok: true; valor: T; trazas: Traza[] } | { ok: false; rechazo: Rechazo };
export interface Hecho { modelo: Modelo; creados: Id[] }       // valor de toda operación que muta
export type Operacion<A> = (m: Modelo, a: A) => Resultado<Hecho>;
```

`Tx` es un ayudante interno (≈40 líneas): envuelve un `Modelo`, ofrece `nuevoId(prefijo)`,
`poner/quitar` en colecciones con copia superficial, `traza(...)` y `rechazar(...)` (lanza una
excepción privada que `tx.ejecutar` convierte en `{ok:false}`), y al final devuelve
`{modelo, creados, trazas}`. Ninguna operación deja el modelo a medias: o devuelve un modelo
nuevo completo o el rechazo.

### 4.2 API de operaciones (todas `Operacion<A>`, puras, en `nucleo/*.ts`)

```ts
type ExtremoRef = { cosa: Id; estado?: Id };
// modelo.ts
crearModelo(nombre: string, id: Id): Modelo;                        // SD vacío, secuencia 1
renombrarModelo: Operacion<{ nombre: string }>;
fijarUnidadTiempo: Operacion<{ unidad: UnidadTiempo }>;
// cosas.ts
crearCosa:        Operacion<{ opd: Id; tipo: TipoCosa; nombre: string; x: number; y: number }>;  // dentro del contenedor ⇒ interno
renombrarCosa:    Operacion<{ cosa: Id; nombre: string }>;          // léxico + unicidad; nunca reescribe en silencio
cambiarTipoCosa:  Operacion<{ cosa: Id }>;                          // T-063: rechaza si deja estados o enlaces inválidos
fijarEsencia:     Operacion<{ cosa: Id; esencia: Esencia }>;        // revalida enlaces incidentes (agente)
fijarAfiliacion:  Operacion<{ cosa: Id; afiliacion: Afiliacion }>;  // propaga a rasgos (R-OBJ-6) con trazas
fijarGenero:      Operacion<{ cosa: Id; genero: 'm' | 'f' }>;
fijarDescripcion: Operacion<{ cosa: Id; texto: string }>;
fijarValor:       Operacion<{ objeto: Id; valor: string | null }>;  // exige ser rasgo de ≥1 exhibición
fijarDuracion:    Operacion<{ proceso: Id; duracion: Duracion | null }>;   // > 0; min ≤ esperada ≤ max
fijarIncompleta:  Operacion<{ cosa: Id; relacion: RelacionIncompleta; activa: boolean }>;
traerCosa:        Operacion<{ cosa: Id; opd: Id; x: number; y: number }>;  // rechaza internos ajenos (A3.3)
moverApariciones: Operacion<{ opd: Id; a: { cosa: Id; x: number; y: number }[] }>;  // 1..n (selección múltiple); externo dentro del contenedor ⇒ rebote con traza (R-OPD-REF-5, T-081); subproceso: solo x (P6)
redimensionar:    Operacion<{ opd: Id; cosa: Id; ancho: number; alto: number }>;
quitarDeOpd:      Operacion<{ opd: Id; cosas: Id[]; confirmarPerdidas: boolean }>;  // §4.5.7; 1..n
eliminarCosa:     Operacion<{ cosas: Id[] }>;                       // 1..n; cascada: estados, enlaces, abanicos, refinamientos propios
// estados.ts
agregarEstado:    Operacion<{ objeto: Id; nombre: string; indice?: number }>;
renombrarEstado:  Operacion<{ estado: Id; nombre: string }>;
moverEstado:      Operacion<{ estado: Id; indice: number }>;        // reordena la lista (T-015)
eliminarEstado:   Operacion<{ estado: Id }>;                        // cascada de enlaces que lo anclan
designar:         Operacion<{ estado: Id; designacion: 'inicial' | 'final' | 'porDefecto' | 'current'; activa: boolean }>;
suprimirEstado:   Operacion<{ estado: Id; opd: Id | null; activa: boolean }>;   // null = global; rechaza si enlazado donde se ve (LF-03)
// enlaces.ts
tiposLegales(m: Modelo, a: { opd: Id; desde: ExtremoRef; hacia: ExtremoRef }): OpcionTipo[];
crearEnlace:      Operacion<{ opd: Id; tipo: TipoEnlace; desde: ExtremoRef; hacia: ExtremoRef;
                              control?: Control; etiqueta?: string; inversa?: string; ruta?: string }>;
cambiarTipoEnlace: Operacion<{ enlace: Id; tipo: TipoEnlace }>;     // conserva id; campos incompatibles se retiran con traza
fijarEstados:     Operacion<{ enlace: Id; estado?: Id | null; entrada?: Id | null; salida?: Id | null; estadoOrigen?: Id | null; estadoDestino?: Id | null }>;
fijarControl:     Operacion<{ enlace: Id; control: Control | null }>;
fijarEtiqueta:    Operacion<{ enlace: Id; etiqueta: string | null; inversa?: string | null }>;  // bi con etiquetas iguales ⇒ recíproco (traza R-STRE-1)
fijarRuta:        Operacion<{ enlace: Id; ruta: string | null }>;
fijarMultiplicidad: Operacion<{ enlace: Id; extremo: 'objeto' | 'parte' | 'origen' | 'destino'; valor: Multiplicidad | null }>;
reanclarEstructural: Operacion<{ enlace: Id; extremo: 'refinable' | 'refinador'; cosa: Id }>;   // R-OPD-EDIT-7
escindirEfecto:   Operacion<{ enlace: Id }>;                        // acción canónica de AP-07
eliminarEnlace:   Operacion<{ enlaces: Id[] }>;                     // 1..n; retira del abanico; <2 ramas ⇒ disuelve (traza)
// abanicos.ts
formarAbanico:    Operacion<{ enlaces: Id[]; operador: Operador }>;
fijarOperador:    Operacion<{ abanico: Id; operador: Operador }>;
agregarRama:      Operacion<{ abanico: Id; enlace: Id }>;
quitarRama:       Operacion<{ abanico: Id; enlace: Id }>;
disolverAbanico:  Operacion<{ abanico: Id }>;
fijarControlAbanico: Operacion<{ abanico: Id; control: Control | null }>;   // todas las ramas a la vez (R-FAN-3)
// refinamiento.ts
descomponer:      Operacion<{ opd: Id; proceso: Id; bandas?: string[][] }>;    // crea OPD hijo; con bandas: subprocesos + distribución atómica
agregarSubprocesos: Operacion<{ opd: Id; bandas: string[][]; en: { antesDeBanda: number } | { enBanda: number } }>;
moverSubproceso:  Operacion<{ opd: Id; proceso: Id; destino: { banda: number } | { nuevaBandaAntesDe: number } }>;
desplegar:        Operacion<{ opd: Id; cosa: Id; modo: ModoDespliegue; refinadores?: string[] }>;
agregarRefinadores: Operacion<{ opd: Id; nombres: string[] }>;      // cosa + enlace estructural del modo
eliminarRefinamiento: Operacion<{ opd: Id }>;                       // solo hoja; materializa vista (DR-C14)
// proyeccion.ts / diagnostico.ts (consultas, no mutan)
proyectar(m: Modelo, opd: Id): Vista;
etiquetaOpd(m: Modelo, opd: Id): string;              // 'SD', 'SD1', 'SD1.2'
opdsEnPreorden(m: Modelo): Id[];
diagnosticar(m: Modelo): Diagnostico[];
gatesExportacion(m: Modelo, alcance: { opd: Id } | 'modelo'): Rechazo[];
validarForma(m: Modelo): Violacion[];
```

Toda operación que recibe un nombre aplica `lexico.validarNombreCosa|Estado|Etiqueta` y, si el
nombre choca, devuelve `Rechazo{regla:'unicidad-nominal', …, refs:[cosa existente]}`: la UI usa
esa ref para ofrecer «traer esa misma cosa» (T-065). Ninguna operación capitaliza ni corrige:
la UI ofrece la corrección explícita (`sugerirNombre`) y el usuario la acepta.

### 4.3 La matriz de validez (`nucleo/matriz.ts`)

#### 4.3.1 Tabla (forma) — una fila por tipo

```ts
type Clase = 'objeto' | 'proceso' | 'cosa';
type Estados =
  | 'ninguno'
  | { objeto: 'requisito' | 'entrada' | 'salidaNoInicial' }          // un estado del objeto
  | { objeto: 'entradaSalida' }                                      // efecto: entrada?, salida?
  | { extremos: 'origenDestino' | 'origenOAmbos' };                  // etiquetados (SSE)
export interface FilaMatriz {
  familia: 'transformadora' | 'habilitadora' | 'invocacion' | 'excepcion' | 'estructural' | 'etiquetada';
  roles: readonly [string, string];      // nombres de campo del tipo (a, b)
  clases: readonly [Clase, Clase];
  mismoTipo: boolean;                    // R-STRF-1, R-OPL-SE-2
  reflexivo: boolean;                    // a === b admitido
  estados: Estados;
  control: boolean;                      // Pre(P): R-MOD-4
  abanico: boolean;                      // reglas §7.2
  ruta: boolean;                         // DR-19
  mult: 'objeto' | 'parte' | 'ambos' | 'ninguno';
  etiquetas: 'ninguna' | 'opcional' | 'doble';
  plantillas: readonly string[];         // ids de §5.2 (la prueba exige que existan)
  menu: number;                          // prioridad en el menú (consumo primero)
}
export const MATRIZ: Readonly<Record<TipoEnlace, FilaMatriz>> = {
  consumo:        { familia:'transformadora', roles:['objeto','proceso'], clases:['objeto','proceso'], mismoTipo:false, reflexivo:false, estados:{objeto:'entrada'},        control:true,  abanico:true,  ruta:true,  mult:'objeto', etiquetas:'ninguna', plantillas:['T1','TS1','ET1','ETS1','CT1','CS1'], menu:1 },
  resultado:      { familia:'transformadora', roles:['objeto','proceso'], clases:['objeto','proceso'], mismoTipo:false, reflexivo:false, estados:{objeto:'salidaNoInicial'}, control:false, abanico:true,  ruta:true,  mult:'objeto', etiquetas:'ninguna', plantillas:['T2','TS2'], menu:2 },
  efecto:         { familia:'transformadora', roles:['objeto','proceso'], clases:['objeto','proceso'], mismoTipo:false, reflexivo:false, estados:{objeto:'entradaSalida'},   control:true,  abanico:true,  ruta:false, mult:'objeto', etiquetas:'ninguna', plantillas:['T3','TS3','TS4','TS5','ET2','ETS2','ETS3','ETS4','CT2','CS2','CS3','CS4'], menu:3 },
  agente:         { familia:'habilitadora',   roles:['objeto','proceso'], clases:['objeto','proceso'], mismoTipo:false, reflexivo:false, estados:{objeto:'requisito'},      control:true,  abanico:true,  ruta:false, mult:'objeto', etiquetas:'ninguna', plantillas:['H1','HS1','EH1','EHS1','CH1','CS5'], menu:4 },
  instrumento:    { familia:'habilitadora',   roles:['objeto','proceso'], clases:['objeto','proceso'], mismoTipo:false, reflexivo:false, estados:{objeto:'requisito'},      control:true,  abanico:true,  ruta:false, mult:'objeto', etiquetas:'ninguna', plantillas:['H2','HS2','EH2','EHS2','CH2','CS6'], menu:5 },
  invocacion:     { familia:'invocacion',     roles:['invocador','invocado'], clases:['proceso','proceso'], mismoTipo:true, reflexivo:true, estados:'ninguno', control:false, abanico:true,  ruta:false, mult:'ninguno', etiquetas:'ninguna', plantillas:['IV1','IV2'], menu:6 },
  excepcionSobretiempo: { familia:'excepcion', roles:['fuente','manejo'], clases:['proceso','proceso'], mismoTipo:true, reflexivo:false, estados:'ninguno', control:false, abanico:false, ruta:false, mult:'ninguno', etiquetas:'ninguna', plantillas:['EX1','EX1r'], menu:13 },
  excepcionSubtiempo:   { familia:'excepcion', roles:['fuente','manejo'], clases:['proceso','proceso'], mismoTipo:true, reflexivo:false, estados:'ninguno', control:false, abanico:false, ruta:false, mult:'ninguno', etiquetas:'ninguna', plantillas:['EX2','EX2r'], menu:14 },
  agregacion:     { familia:'estructural', roles:['todo','parte'],             clases:['cosa','cosa'], mismoTipo:true,  reflexivo:false, estados:'ninguno', control:false, abanico:false, ruta:false, mult:'parte',   etiquetas:'ninguna', plantillas:['RF1'], menu:7 },
  exhibicion:     { familia:'estructural', roles:['exhibidor','rasgo'],        clases:['cosa','cosa'], mismoTipo:false, reflexivo:false, estados:'ninguno', control:false, abanico:false, ruta:false, mult:'ninguno', etiquetas:'ninguna', plantillas:['RF2','RF2b'], menu:8 },
  generalizacion: { familia:'estructural', roles:['general','especializacion'], clases:['cosa','cosa'], mismoTipo:true, reflexivo:false, estados:'ninguno', control:false, abanico:false, ruta:false, mult:'ninguno', etiquetas:'ninguna', plantillas:['RF3','RF3b','RH1'], menu:9 },
  clasificacion:  { familia:'estructural', roles:['clase','instancia'],        clases:['cosa','cosa'], mismoTipo:true,  reflexivo:false, estados:'ninguno', control:false, abanico:false, ruta:false, mult:'ninguno', etiquetas:'ninguna', plantillas:['RF4','RF4b'], menu:10 },
  etiquetado:     { familia:'etiquetada', roles:['origen','destino'], clases:['cosa','cosa'], mismoTipo:true, reflexivo:true,  estados:{extremos:'origenDestino'}, control:false, abanico:false, ruta:false, mult:'ambos', etiquetas:'opcional', plantillas:['SE1','SE2','SSE1','SSE2','SSE3'], menu:11 },
  etiquetadoBidireccional: { familia:'etiquetada', roles:['origen','destino'], clases:['cosa','cosa'], mismoTipo:true, reflexivo:false, estados:{extremos:'origenOAmbos'}, control:false, abanico:false, ruta:false, mult:'ambos', etiquetas:'doble', plantillas:['SE3','SSE4','SSE5'], menu:12 },
  reciproco:      { familia:'etiquetada', roles:['origen','destino'], clases:['cosa','cosa'], mismoTipo:true, reflexivo:false, estados:{extremos:'origenOAmbos'}, control:false, abanico:false, ruta:false, mult:'ambos', etiquetas:'opcional', plantillas:['SE4','SE5','SSE6','SSE7'], menu:12 },
};
```

Lectura: `clases` exige categoría por rol (consumo solo objeto→proceso; invocación y
excepción solo proceso→proceso; estructural fundamental y etiquetados `cosa` con `mismoTipo`,
salvo exhibición que admite las 4 combinaciones, T-048). En efecto, `escision` exige exactamente
uno de `entrada/salida` y prohíbe `control` (AP-08).

#### 4.3.2 Reglas de contexto (una lista; cada una con su id canónico)

```ts
interface ReglaContexto {
  id: string;                 // regla canónica
  tipos: readonly TipoEnlace[];
  severidad: 'error' | 'warning';   // warning solo AP-27 con previos omisibles
  cuando: 'siempre' | 'crear';      // 'crear': solo al crear en un OPD (anclaje directo al contorno)
  viola(m: Modelo, e: Enlace, ctx: { opd?: Id }): string | null;   // mensaje o null
  accion: string;             // acción canónica (R-AP-0B)
}
```

| id | aplica a | viola si | acción canónica |
|---|---|---|---|
| R-AG-1 / AP-05 (DR-5) | agente | el objeto no es físico | «Usa instrumento para máquinas, software o IA; si es humano, márcalo físico» |
| R-EFE-1 / R-OPD-EST-3 (DR-43) | efecto T3 | el objeto no tiene estados propios ni heredados | «Agrega estados al objeto o usa consumo/resultado» |
| AP-04 / R-RES-1 | resultado | el estado anclado es inicial | «Ánclalo al objeto o a un estado no inicial» |
| R-ROL-UNIC-1 / R-OPD-HAB-4 (DR-6) | procedimentales | otro procedimental une el mismo objeto con el mismo proceso **o con un ancestro/descendiente por descomposición** (lectura distributiva), salvo ramas del mismo abanico | «Un solo rol por par objeto–proceso: edita el enlace existente» |
| R-DIST-1 / AP-06 | consumo, resultado | (crear) el proceso es el contenedor de `ctx.opd`; (siempre) el proceso está descompuesto con ≥1 subproceso | crear: «Conéctalo a un subproceso»; siempre: «Migrar al primer/último subproceso» (comando) |
| R-CX-DIST-2 / AP-21 | procedimentales con `e` | objeto sistémico y proceso descompuesto con ≥1 subproceso | «Mueve el evento al primer subproceso o marca el objeto ambiental» |
| AP-07 | efecto TS3 | proceso descompuesto con ≥2 subprocesos | «Escindir: TS4 en el primero, TS5 en el último» (`escindirEfecto`) |
| AP-27 | procedimentales con `e` | el proceso es subproceso de banda k>0 y alguna banda anterior tiene un transformador sin `c` (error) / todas omisibles (warning) | «Dirige el evento al primer subproceso o declara la omisión (c) de los previos» |
| R-INV-2B / R-INV-2D | invocación | invocador e invocado son subprocesos del mismo OPD en bandas k y k+1 (doble vara) | «Quita el rayo: la secuencia ya invoca la banda siguiente» |
| visible-en-opd | todos | (crear) algún extremo no tiene aparición en `ctx.opd` | «Trae la cosa a este OPD» |

Abanicos (`violacionesAbanico(m, f)`): n ≥ 2 (T-054); mismo tipo; tipo con `abanico:true`;
extremo común (convergente = rol proceso común en consumo/efecto-objetos/agente/instrumento;
etc., DR-9); cada enlace en un solo abanico; control uniforme (mixto ⇒ `non-canonical`,
R-ZNC-COMB-1); resultado e invocación sin control (AP-03, AP-10).

#### 4.3.3 `NO_OFRECIDO` (canónico no soportado: ni UI, ni creación; parser `unsupported-canonical`)

| id | combinación | regla |
|---|---|---|
| nf-mult-sin-hueco | multiplicidad donde la plantilla del hecho no tiene hueco: con `c` (A.6), en efecto con estados (TS3/TS4/TS5 y ETS2–4 usan `identificador_de_objeto`), en etiquetado con estado (SSE), en parte proceso (R-MULT-1A) | DR-44, EBNF A.5/A.6/A.8 |
| nf-reciproco-estados-sin-etiqueta | recíproco sin etiqueta con estados (SE5 no tiene variante con estado) | reglas §4.10 |
| nf-abanico-efecto-mixto | abanico de efecto que no es T3 puro ni ramas de estados de un mismo objeto (FAN-5/5A) | R-FAN-5/5A, reglas §7.3 |
| nf-ruta-no-cr | ruta fuera de consumo/resultado | DR-19, C-25 |
| nf-ruta-abanico | ruta en rama de abanico | R-COMB-5, DR-C5 |
| nf-abanico-control | control en abanico salvo: consumo convergente todo `c` (C-18); efecto divergente todo `c` (reglas §7.4); efecto divergente con objeto común todo `e` (R-FAN-4) | C-19b, C-18 (instrumento), R-FAN-3 |
| nf-generalizacion-estados | estados en generalización (esp. de estado) | R-OPL-RF-3, DR-C13 |
| nf-descomposicion-objeto | descomponer un objeto | R-OPL-CX-4, DR-23 |

#### 4.3.4 Consumidores (sin copias)

```ts
export function violacionesForma(m: Modelo, e: Enlace): Violacion[];        // tabla §4.3.1 + propiedad de estados
export function violacionesContexto(m: Modelo, e: Enlace, ctx): Violacion[]; // §4.3.2
export function noOfrecido(e: Enlace, abanico?: Abanico): Violacion | null;   // §4.3.3
export function tiposLegales(m, {opd, desde, hacia}): OpcionTipo[];
type OpcionTipo = { tipo: TipoEnlace; sentido: 'directo' | 'inverso'; legal: true; enlace: Enlace }
                | { tipo: TipoEnlace; sentido: 'directo' | 'inverso'; legal: false; motivo: Violacion };
```

- `tiposLegales` construye, para cada fila y cada sentido admisible del gesto, el enlace
  candidato (los estados arrastrados se asignan al extremo objeto y, en efecto, a `entrada` si el
  gesto sale del estado y a `salida` si llega a él) y lo pasa por las tres funciones. Menú del
  lienzo = legales ordenados por `menu` + ilegales atenuados con `motivo` (R-OPD-UI-5).
- `crearEnlace` = mismas tres funciones + distribución (§4.5.3). Si hay violación ⇒ `Rechazo`
  con la regla y la acción.
- Parser OPL: el hecho reconocido se convierte en el mismo candidato y pasa por las tres; forma
  o contexto ⇒ `enlace-invalido-firma`; `noOfrecido` ⇒ `unsupported-canonical`.
- `diagnosticar`: para cada enlace y abanico del modelo, `violacionesContexto` (`siempre`) y
  `violacionesAbanico` ⇒ diagnósticos `error` (o `warning` en AP-27 omisible).
- Importador: `violacionesForma` ⇒ rechazo; contexto ⇒ se carga; `noOfrecido` ⇒ el campo que lo
  provoca se `descarta` con informe.

### 4.4 Diagnósticos (`nucleo/diagnostico.ts`)

```ts
export interface Diagnostico {
  codigo: string;                                  // kebab estable
  regla: string;                                   // id canónico
  severidad: 'error' | 'warning' | 'info';         // ≙ CRÍTICA / ALTA-MEDIA / BAJA (método A8.1, DR-40)
  familia: 'gramatical' | 'metodologica' | 'identidad' | 'contencion' | 'sugerencia';   // R-OPD-VAL-2
  mensaje: string; accion: string; refs: Ref[]; opd?: Id;
}
```

`diagnosticar(m)` recorre el **modelo** (nunca el OPL, A8.2), memoizado por identidad de
`Modelo`; solo `error` bloquea (el export canónico, no la edición). Catálogo cerrado:

| código | regla | sev. | familia | condición | acción |
|---|---|---|---|---|---|
| `enlace-invalido` | la de §4.3.2 | error | gramatical/contencion | violación de contexto `siempre` en un enlace existente (import, reordenamiento) | la de la regla |
| `abanico-invalido` | T-054/T-055/R-ZNC-COMB-1 | error | gramatical | `violacionesAbanico` | «Corrige o disuelve el abanico» |
| `precedencia-invalida` | AP-30, R-PREC-2 | error | contencion | en la vista del padre colisionan R+R o C+C | «Corrige el nivel hijo» |
| `conflicto-resultado-consumo` | R-PREC-3/4 | warning | contencion | colisión R+C sin continuidad de estados | «Revisa si es un cambio de estado (efecto)» |
| `proceso-sin-transformacion` | R-PROC-2, R-OPD-TR-8 | warning | metodologica | ni consumo, resultado ni efecto propio, heredado (DR-43) ni en sus subprocesos | «Agrega el objeto que transforma» |
| `refinamiento-trivial` | AP-13, R-REF-NTRIV-1/2 | warning | contencion | refinamiento con <2 subprocesos/refinadores (bloquea export) | «Agrega al menos dos» |
| `enlace-en-contorno-temporal` | R-VIS-DIST-1 | info | contencion | consumo/resultado en contorno de descomposición sin subprocesos | «Se migrará al crear el primer subproceso» |
| `opd-denso` | R-LAY-1 | warning | sugerencia | 21–25 cosas en el OPD | «Refina para aligerar» |
| `opd-sobrecargado` | R-LAY-1, R-OPD-LAY-2 | warning | sugerencia | >25 cosas (bloquea export del OPD) | ídem |
| `sd-sin-proceso-unico` | R-SD-4, R-VIS-SD-1 | warning | metodologica | el SD no tiene exactamente un proceso sistémico | «Deja un proceso sistémico principal» |
| `manejador-no-ambiental` | R-EXC-1A | warning | metodologica | excepción con manejo sistémico | «Marca ambiental el proceso de manejo» |
| `cota-faltante` | R-EXC-2/3, R-EXC-DUR-1 | warning | metodologica | sobretiempo sin `duracion.max` / subtiempo sin `min` en la fuente | «Define la duración de la fuente» |
| `afiliacion-incoherente` | R-OBJ-6, R-OPD-STR-13, R-VIS-HER-2 | warning | metodologica | rasgo sistémico de exhibidor ambiental | «Márcalo ambiental» |
| `proceso-de-ambientales` | R-OBJ-7 | warning | metodologica | proceso sistémico cuyos agentes/instrumentos son todos ambientales | «Considera marcarlo ambiental» |
| `refinador-en-varios-contextos` | R-OPD-OP-6 | warning | contencion | una cosa es refinador (parte/rasgo/especialización/instancia/subproceso) en >1 refinamiento con relación distinta | «Aclara la pertenencia» |
| `objeto-transiente` | AP-26 | warning | metodologica | objeto con exactamente un resultado y un consumo y nada más | «¿Es una invocación?» |
| `nombre-proceso-largo` | R-NOM-PROC-2 | warning | metodologica | nombre de proceso fuera de 2–4 palabras | — |
| `nombre-proceso-no-deverbal` | R-NOM-PROC-1 | warning | metodologica | heurística (-ar/-er/-ir/-ción/-sión/-miento/-aje/-ado/-ido) | «Usa una forma verbal o nominalización» |
| `nombre-objeto-plural` | R-NOM-OBJ-1/2 | warning | metodologica | heurística de plural sin `Conjunto`/`Grupo` | «Usa singular o `Conjunto de …`» |
| `nombre-estado-no-descriptivo` | R-NOM-EST-1 | warning | metodologica | etiqueta de estado que no es participio/adjetivo (heurística: termina en -ar/-er/-ir o es numeral puro) | «Nombra el estado por su condición: `aprobado`, `vacío`» |
| `mezcla-infinitivo-nominalizacion` | método A2.3 | info | metodologica | el modelo mezcla ambas formas | — |
| `etiqueta-larga` | R-OPL-SE-1 | info | gramatical | etiqueta estructural de >4 palabras | — |
| `estado-sin-escritor` | LF-19 | info | metodologica | estado de objeto de flujo que ningún resultado/efecto produce (excepciones LF-19) | — |
| `subproceso-sin-transformado` | método A3.1, T-264 | warning | metodologica | subproceso sin transformador propio ni heredado | «Agrega el objeto que transforma» |
| `agente-humano` | R-AG-1 (DR-5) | info | metodologica | un aviso por objeto agente: «verifica que sea humano o grupo humano» | — |
| `ajuste-automatico` | R-OPD-OP-5, R-OPD-EDIT-6 | info | sugerencia | una vista muestra una colección parcial (marca derivada) o un contorno grueso por refinamiento | — |

Gates de export (`gatesExportacion`, T-283): `alcance {opd}` ⇒ el OPD tiene >25 cosas; es un
refinamiento con <2 refinadores; hay `error` cuyas refs se ven en ese OPD. `'modelo'` ⇒ cualquiera
de esos en cualquier OPD. JSON y OPL Markdown no tienen gate (intercambio, T-282).

### 4.5 Refinamiento (`nucleo/refinamiento.ts`)

#### 4.5.1 Descomponer (in-zoom) — atómico

`descomponer({opd, proceso, bandas})`:
1. Precondiciones: proceso visible en `opd`; sin descomposición; no externo del `opd` si `opd` es
   hijo (R-HIJO-5); sin ciclo (el proceso no es la cosa refinada de `opd` ni de ningún ancestro,
   R-REF-1); un objeto ⇒ `Rechazo{regla:'R-OPL-CX-4', mensaje:'descomposición de objeto no
   disponible (DR-23)'}`.
2. Crea `OpdDescomposicion{padre: opd, cosa: proceso, orden: #hermanos, bandas: [],
   objetosInternos: []}`; el proceso aparece como contenedor (tamaño de `colocacion.contenedor`).
3. Copia como **externas** todas las cosas conectadas al proceso por cualquier enlace (R-HIJO-3),
   con posición de `colocacion.externos` (entradas a la izquierda, salidas a la derecha, habilitadores
   arriba, estructurales abajo; orden por nombre). Esencia, afiliación y estados viven en la cosa:
   se conservan por construcción (R-REF-4).
4. Si `bandas` trae nombres ⇒ `agregarSubprocesos` en la misma transacción (C3).
Deshacer revierte todo en un paso.

#### 4.5.2 Subprocesos y bandas

- `agregarSubprocesos({opd, bandas, en})`: crea procesos (léxico y unicidad por nombre; un nombre
  existente que no es subproceso de esta descomposición ⇒ `Rechazo 'referencia-ambigua'` DR-35),
  heredan la afiliación ambiental del contenedor (R-OBJ-6), aparición interna con
  `y = banda(k)`; inserta las bandas. **Si la descomposición tenía 0 subprocesos, ejecuta la
  distribución §4.5.3 sobre todos los enlaces del contorno** (C3).
- `moverSubproceso`: mueve a una banda existente o crea una banda nueva; bandas vacías se
  eliminan; recalcula `y` de todos los internos (layout de bandas, R-LAY-4). No migra enlaces.
  Tras mover, `diagnosticar` puede señalar `enlace-invalido` (doble vara, AP-27) como error
  recuperable (T-269).
- Posición vertical = función de la banda; el arrastre vertical en el lienzo es un comando
  `moverSubproceso`, nunca una coordenada libre (P6). El arrastre horizontal es libre y confinado
  al contenedor (R-OPD-UI-3).

#### 4.5.3 Distribución (reglas §8.5, DR-13, DR-14, C3) — misma función para 0→n y para enlaces tardíos

Sea `P` descompuesto con subprocesos `S` (primero = `bandas[0][0]` por nombre dentro de la banda;
último = último de la última banda). Para cada enlace del contorno de `P`:

| enlace en P | |S| = 0 | |S| = 1 | |S| ≥ 2 | traza |
|---|---|---|---|---|
| consumo; cualquier procedimental con `e` desde objeto sistémico | queda (respaldo temporal) | → S₁ (mismo id) | → primero | R-DIST-1 / AP-21 |
| resultado | queda | → S₁ | → último | R-DIST-1 |
| efecto TS3 | queda | → S₁ entero | escisión: TS4 (id original) en el primero + TS5 (id nuevo) en el último, ambos `escision` | R-ESCIND-1..3, AP-07 |
| efecto TS4 / TS5 standalone | queda | → S₁ | TS4 → primero, TS5 → último | DR-C3 |
| efecto T3, agente, instrumento (sin `e` sistémico) | queda en el contorno (lectura distributiva, DR-13) | ídem | ídem | — |
| invocación, excepción | queda en el contorno (DR-14) | ídem | ídem | — |
| estructurales | quedan en el contenedor | ídem | ídem | — |

Enlace tardío: `crearEnlace` sobre un `P` descompuesto con |S| ≥ 1 aplica la misma tabla al
nuevo enlace (recursivamente si el destino es a su vez descompuesto) y agrega la aparición externa
del objeto en cada OPD de descomposición atravesado (R-HIJO-3). Toda migración conserva el id
(R-OPD-OP-4, T-075); la mitad TS5 se declara creada por escisión.

#### 4.5.4 Desplegar (unfold) por modo

`desplegar({opd, cosa, modo, refinadores})`: precondiciones análogas (visible, sin despliegue,
sin ciclo, no externo). Crea `OpdDespliegue`; la cosa aparece arriba al centro (contorno grueso
en padre e hijo, R-CTRN-2) y se copian **solo** los hijos estructurales directos de ese modo
(R-HIJO-4), abajo, en fila por nombre. `refinadores` (nombres) crea cosas del **mismo tipo** que la
cosa (salvo exhibición, que crea objetos por defecto) y un enlace estructural del modo por cada
una; en exhibición los rasgos heredan afiliación ambiental (R-OBJ-6, traza). `agregarRefinadores`
hace lo mismo luego.

#### 4.5.5 Colección incompleta y ajuste automático

- **Declarada**: `Cosa.incompleta` (el modelador afirma que faltan partes; T-034).
- **De vista** (R-OPD-EDIT-6, método A3.2): en un OPD donde se ve un refinable con relación `k`
  y no se ven todos sus refinadores por `k`, la proyección marca `incompleta` para ese grupo
  (barra bajo el triángulo; «y al menos otra parte» en el bloque) y `diagnosticar` emite
  `ajuste-automatico` (info, R-OPD-OP-5 = traza derivada, sin persistir nada).
- Clasificación nunca (tipo `RelacionIncompleta`).

#### 4.5.6 Eliminar refinamiento (DR-17, C14)

Solo si el OPD es hoja (R-REF-3). La UI pide confirmación listando: subprocesos/refinadores e
internos que se eliminan (los que quedan sin aparición), enlaces que se pierden y enlaces que se
**conservan en el padre**. Operación: (1) calcula la vista abstraída del padre para los enlaces
entre externos e internos (§4.6) y los materializa sobre la cosa refinada con el id del hecho de
mayor fuerza (los `precedencia-invalida` no se materializan y se listan como pérdida); (2) quita
el OPD; (3) elimina cosas sin aparición y sus enlaces; (4) disuelve abanicos con <2 ramas. Todo
con trazas. Nunca se presenta como inversa de otra operación (A1.5-d).

#### 4.5.7 Quitar de este OPD vs eliminar del modelo (R-VIS-APP-1, T-251)

- `quitarDeOpd`: retira la aparición. Si es la última aparición de la cosa, o si algún enlace
  quedaría sin OPD donde verse, devuelve `Rechazo{regla:'perdida-de-hechos', refs}` salvo
  `confirmarPerdidas: true`, en cuyo caso elimina esa cosa/esos enlaces explícitamente (nunca
  hechos invisibles, T-100). El contenedor no se quita de su propio OPD de descomposición.
- `eliminarCosa`: elimina la cosa del modelo con cascada declarada.

### 4.6 Proyección por OPD (`nucleo/proyeccion.ts`)

```ts
export interface Vista {
  opd: Id;
  cosas: Id[];                                     // visibles (con aparición)
  enlaces: EnlaceVisto[];
  abanicos: AbanicoVisto[];
  incompletas: Array<{ refinable: Id; relacion: RelacionIncompleta }>;   // de vista (§4.5.5)
  conflictos: Diagnostico[];                       // AP-30 / R-PREC-3 de este OPD
}
export interface EnlaceVisto {
  clave: string;                                   // estable: tipo + extremos vistos + estados
  enlace: Enlace;                                  // hecho visto (ids = hechos subyacentes: el primero)
  hechos: Id[];                                    // enlaces del modelo que representa (1 si directo)
  abstraido: boolean;                              // true si algún extremo fue abstraído
}
```

Algoritmo (DR-13, R-VIS-HIJO-1, reglas §6.5/§6.6):
1. `visto(x)`: `x` si tiene aparición en el OPD; si no, y `x` es interno de una descomposición
   `D`, `visto(D.cosa)`; si no, indefinido. Solo el in-zoom abstrae (el despliegue no).
2. Para cada enlace, extremos vistos; indefinido ⇒ no se ve. Si ambos colapsan en la misma cosa y
   el enlace no es reflexivo por naturaleza ⇒ desaparece (interno↔subproceso).
3. En un OPD de **descomposición**: se ven los que tocan al contenedor o a un interno; se ocultan
   los que unen dos externos (R-VIS-HIJO-1). Los procedimentales al contorno se **ven** en el
   contorno (desvío declarado, DR-13). En **despliegue**: se ven los que tocan a la cosa o a un
   refinador; se ocultan los que unen dos externos.
4. Agrupa procedimentales por par visto (objeto, proceso). En un grupo con >1 hecho:
   transformador prevalece sobre habilitador (R-PREC-5); entre transformadores, plegado por la
   matriz 3×3 (E+E→E; E+R→R; E+C→C; R+R y C+C → `precedencia-invalida`, se muestran ambos;
   R+C → ambos + `conflicto-resultado-consumo`); entre habilitadores agente > instrumento; el
   control resultante es el de mayor fuerza (evento > sin control > condición). Efectos fusionados:
   entrada = la del hecho con entrada de banda más temprana; salida = la del de banda más tardía
   (un par escindido vuelve a verse como su TS3).
5. Abanicos: se ven si todas sus ramas se ven y siguen siendo distintas; si las ramas colapsan en
   un mismo extremo, el abanico se ve como un único enlace fusionado.
6. Estados en el extremo: si el estado visto está oculto en la aparición, se ve el enlace al
   rectángulo **y** es imposible por construcción que persista: `crearEnlace`/`fijarEstados`
   des-suprimen el estado (local) en cada OPD donde el enlace se ve, con traza (LF-03); la
   supresión se rechaza mientras esté enlazado allí.
7. Memo por `(modelo, opd)` en `WeakMap`; costo O(enlaces) con el índice.

Ley de frontera (T-089, DR-16): la firma `{(externa, tipo fusionado, estados)}` de los enlaces
del contenedor en la vista del padre es igual a la fusión de los enlaces entre externos y
{contenedor ∪ internos} del hijo. Se cumple por construcción; `frontera.test.ts` la verifica con
una implementación independiente de 40 líneas y mutantes (no tautológica).

### 4.7 Etiquetas SDx.y y orden

`opdsEnPreorden`: raíz; hijos por `orden` ascendente, recursivo. `etiquetaOpd`: raíz `SD`,
hijos de la raíz `SD1, SD2…`, nietos `SD1.1…` (DR-4). Es una proyección de navegación que muta si
se elimina un hermano (R-IDP-1A); la identidad es `opd.id` (AP-17). El OPL resuelve `SDx.y` al id
(T-167).

### 4.8 Herencia en validadores (DR-43)

`herencia.generales(m, cosa)`: cierre transitivo por generalización (múltiple, T-093), con
corte de ciclos. Lo usan solo `R-EFE-1` (estados heredados cuentan para T3) y
`proceso-sin-transformacion` (transformadores del general cuentan). No se dibuja ni emite nada
heredado (T-092); el anclaje a estado solo admite estados propios.

### 4.9 Mapa de requisitos ★ → mecanismo → prueba

(Se replica en `docs/conformidad.md`, tabla «Mapa ★».)

| ★ | Mecanismo | Prueba |
|---|---|---|
| T-001 | `docs/conformidad.md` (Brechas + mapa ★) + tablas `NO_OFRECIDO`/`NO_SOPORTADAS`/`CATALOGO` con `regla`; regla de cambio en `AGENTS.md` | comportamiento de cada fila en `matriz`/`analizar`/`diagnostico.test`; gate Deuda = revisión del diff (sin test de prosa, DECISIONS 16) |
| T-003 | matriz: solo reglas con id canónico; silencio ⇒ `non-canonical`, no prohibición | matriz.test (cada regla cita id) |
| T-004, T-136 | `descripcion` meta sin OPL; capa UI separada del SVG semántico | generar.test, exportar.test |
| T-005 | vocabulario es-CL cerrado | vocabulario.test |
| T-006 | tipos §3.1 (sin campos sin semántica salvo meta/vista declarados) | revisión de tipos + codec.test |
| T-010, T-011 | único `Modelo`; `editor.ejecutar(op)` es la única vía de mutación para lienzo, inspector y OPL (`aplicar` llama las mismas operaciones) | estado.test, aplicar.test |
| T-012–T-016, T-018, T-019, T-022–T-024, T-026–T-033, T-036 | tipos §3.1 + `validarForma` §3.2 | forma.test, codec.test |
| T-021 | `Proceso.duracion` + `fijarDuracion` | cosas.test |
| T-025, T-062, T-065 | `lexico.ts`; `Rechazo 'unicidad-nominal'` + `NombreEnLinea` (reusar/renombrar/descartar); nada nace sin nombre | lexico.test, e2e-04 |
| T-040–T-049, T-051–T-055, T-059, T-060, T-064, T-066 | `MATRIZ` + reglas de contexto + `tiposLegales` | matriz.test (tabla de casos por regla), e2e-07 |
| T-063 | `cambiarTipoCosa` revalida con la matriz | cosas.test |
| T-070, T-073–T-076, T-082 | `descomponer`, `agregarSubprocesos`, distribución §4.5.3, `moverSubproceso` | refinamiento.test, e2e-11 |
| T-071 | `desplegar` | refinamiento.test, e2e-13 |
| T-077 | `refinamiento-trivial` + gate | diagnostico.test, exportar.test |
| T-078, T-079, T-084 | precondiciones de refinamiento; tipo `Aparicion` | refinamiento.test |
| T-080, T-083 | `eliminarRefinamiento` (hoja, cascada, confirmación) | refinamiento.test, e2e-15 |
| T-085, T-086 | `proyectar` (abstracción, fuerza, 3×3, R-VIS-HIJO-1) | proyeccion.test |
| T-087 | incompleta de vista + `ajuste-automatico`; contorno grueso derivado | proyeccion.test, escena.test |
| T-092, T-093 | herencia solo en validadores; generalización múltiple | herencia.test |
| T-100–T-108, T-110–T-117, T-119, T-122, T-125–T-127, T-130–T-135, T-137 | `opl/plantillas.ts` + `opl/generar.ts` (§5.3) | plantillas.test, generar.test, roundtrip-matriz.test |
| T-150–T-153, T-155–T-162, T-164, T-166–T-168, T-170–T-174, T-176–T-182, T-184, T-185 | `analizar.ts`, `planificar.ts`, `aplicar.ts`, `EditorOpl.tsx` (§5.4–§5.7) | analizar.test, editor-opl.test, e2e-16 |
| T-190–T-196 | P4/P5: tabla única + enumeración + auto-reparseo + punto fijo del códec | roundtrip-*.test, codec-fijo.test |
| T-200–T-204, T-206, T-208–T-216, T-220, T-221, T-223, T-224 | `opd/escena.ts`, `geometria.ts`, `Marcadores.tsx`, `tokens.ts` (§6) | escena.test, geometria.test, marcadores.test |
| T-227, T-228 | `CapaUi.tsx` separada; crimson solo UI; diagnóstico solo en panel | exportar.test (sin clases UI), e2e-18 |
| T-240–T-243 | `PanelOpl` regenerado por `modelo`; realce por `Ref`; clic navega sin mutar | e2e-17 |
| T-248, T-249, T-251, T-252 | `traerCosa`, `moverApariciones`, `quitarDeOpd` vs `eliminarCosa`, registro de comandos | cosas.test, e2e-15 |
| T-260, T-261, T-263, T-265, T-268 | `diagnosticar` §4.4 | diagnostico.test |
| T-280–T-283 | `opd/exportar.ts` + `gatesExportacion` | exportar.test, e2e-19 |
| T-286, T-287, T-289 | `codec/` §3.4 | codec.test, codec-fijo.test |
| T-300–T-302 | suites §10 | `bun run check` |
| T-303 | Anexo A como lista de revisión en `AGENTS.md` y `docs/conformidad.md`; cada gate del anexo apunta a su suite (§10.1) | revisión de cambios |

---

## 5. OPL

### 5.1 Vocabulario (`opl/vocabulario.ts`)

- **Cerrado** (DR-27): el conjunto de palabras fijas es la unión de los literales de las plantillas
  de §5.2; `vocabulario.test.ts` extrae los literales de `PLANTILLAS` y exige que cada palabra
  esté en `VOCABULARIO` y viceversa (sin sinónimos, verbos en 3.ª persona singular, T-104).
- **Tipografía** (T-102): `**objeto**`, `*proceso*`, `` `estado` ``. Única excepción literal:
  `` `Current` `` en D13, que el tokenizador reconoce como literal tras `es declarado `.
- **Unidades** (DR-18): `ms→milisegundo(s)`, `sec→segundo(s)`, `min→minuto(s)`, `hour→hora(s)`,
  `day→día(s)`, `week→semana(s)`, `month→mes(es)`, `year→año(s)`; singular si el valor es 1;
  números con punto decimal (EBNF `numero_decimal`).
- **Multiplicidad** (C12, R-MULT-1): `?` → `un opcional | una opcional`; `*` →
  `opcional (cero o más)`; `+` → `al menos un | al menos una`; el género es el de la cosa
  cuantificada. Nunca glifos.
- **Conjunciones** (DR-26): `y`→`e` y `o`→`u` según el sonido inicial del término siguiente (se
  mira el texto del nombre dentro del span): `e` ante /i/ (`i-`, `hi-` + consonante; no `hie-`,
  `hia-`), `u` ante /o/ (`o-`, `ho-`). Listas: coma entre intermedios, conjunción antes del
  último, sin coma de Oxford (T-130); excepciones literales `, y otros estados` y la lista mixta
  de CX.
- **Mayúscula inicial de oración**: el generador capitaliza el primer carácter de cada oración
  (`Exactamente uno de…`, `Al menos una **Olla** maneja…`, `Por ruta L1, …`); el parser compara
  el primer literal sin distinguir mayúsculas.

### 5.2 La tabla única de plantillas (`opl/plantillas.ts`)

Cada plantilla es `{ id, patron, familia, desde(hecho) → huecos | null, hacia(huecos) → HechoTexto }`.
`patron` es texto con huecos tipados; el generador lo rellena y el analizador lo compila a un
esqueleto (§5.4). Huecos:

| hueco | superficie | notas |
|---|---|---|
| `{P}` `{P1}` `{P2}` | `*Nombre*` | proceso |
| `{O}` `{O1}` `{O2}` | `**Nombre**` | objeto |
| `{C}` | `**N**` o `*N*` | cosa; la tipografía decide el tipo |
| `{s}` `{e}` `{a}` `{b}` | `` `nombre` `` | estado del objeto del hueco vecino |
| `m` (prefijo: `{mO}`, `{mC}`) | `[frase ]**N**` | multiplicidad antepuesta opcional |
| `…e` (sufijo: `{Oe}`, `{mOe}`) | `**N**[ en `s`]` | estado opcional |
| `{Ly:X}` / `{Lo:X}` | lista con `y/e` / `o/u` | elementos del hueco X; ≥1 (DR-33) |
| `{Q}` / `{Q^}` | `exactamente uno de` / `al menos uno de` | cuantificador (capitalizado al inicio) |
| `{t}` `{t2}` | frase minúscula | etiqueta / inversa (léxico `frase_no_capitalizada`) |
| `{r}` | nombre | ruta (`cadena_etiqueta`) |
| `{v}` | nombre simple o número | valor (`nombre_de_valor`) |
| `{n}` `{u}` | número y unidad es-CL | cota de excepción |
| `{opd}` | `SD`, `SD1.2` | etiqueta de OPD (se resuelve al id) |
| `{SEC}` | `*A*, paralelo *B* y *C*, y *D*` | lista de secuencia mixta |
| `[…]` | opcional | p. ej. `[ y al menos otra parte]`, `[, así como {Ly:O}]`, prefijo `[Por ruta {r}, ]` |

Plantillas soportadas (G = se genera; P = solo se parsea). Todas las de reglas §4 y §7.3 que el
producto soporta están aquí; el resto está en `NO_SOPORTADAS` (§5.4.6).

**Cosas y estados**
| id | patrón | |
|---|---|---|
| D1 | `{C} es física.` (P acepta `físico`) | G |
| D2 | `{C} es informacional.` | G solo mención mínima (C2) y display `siempre`; P |
| D3 | `{C} es ambiental.` | G |
| D4 | `{C} es sistémica.` (P acepta `sistémico`) | P |
| ENT3 | `{C} es un objeto|proceso <esencia>[ y <afiliación>]` / `… es un objeto|proceso <afiliación>` (R-ENT-3) | P |
| D11/D12 | `{C} es persistente|transitoria.` — coherente ⇒ sin-cambio; incoherente ⇒ `non-canonical` (DR-3) | P |
| D5 | `{O} puede estar {Lo:s}.` | G |
| D6 | `{O} puede estar <s>, <s>, y otros estados.` (visibles sin conjunción final) | G |
| ATR-E | `{O1} de {O2} puede estar {Lo:s}.` ⇒ D5 + exhibición O2→O1 si falta (DR-20) | P |
| D7 D8 D10 D9 D13 | `Estado {s} de {O} es inicial|final|inicial y final|por defecto|declarado `Current`.` | G |
| VAL | `{O1} de {O2} es {v}.` (una por exhibidor visible) | G |

**Transformadores, habilitadores** (prefijo `[Por ruta {r}, ]` solo en consumo y resultado)
| id | patrón |
|---|---|
| T1 / TS1 | `{P} consume {mO}.` / `{P} consume {mO} en {s}.` |
| T2 / TS2 | `{P} genera {mO}.` / `{P} genera {mO} en {s}.` |
| T3 | `{P} afecta {mO}.` (P: `{P} afecta {Ly:mO}.` ⇒ N hechos, EBNF A.5) |
| TS3 | `{P} cambia {O} de {e} a {s}.` (entrada = salida ⇒ proceso persistente explícito, T-138) |
| TS4 / TS5 | `{P} cambia {O} de {e}.` / `{P} cambia {O} a {s}.` (el parser produce siempre standalone, T-164) |
| H1 / HS1 | `{mO} maneja {P}.` / `{mO} en {s} maneja {P}.` |
| H2 / HS2 | `{P} requiere {mO}.` / `{P} requiere {mO} en {s}.` |

**Evento (`e`)**: ET1 `{mO} inicia {P}, que consume {O}.` · ETS1 `{mO} en {s} inicia {P}, que consume {O}.` ·
ET2 `{mO} inicia {P}, que afecta {O}.` · ETS2 `{O} en {e} inicia {P}, que cambia {O} de {e} a {s}.` ·
ETS3 `{O} en {e} inicia {P}, que cambia {O} de {e}.` · ETS4 `{O} en cualquier estado inicia {P}, que cambia {O} a {s}.` ·
EH1 `{mO} inicia y maneja {P}.` · EHS1 `{mO} en {s} inicia y maneja {P}.` · EH2 `{mO} inicia {P}, que requiere {O}.` ·
EHS2 `{mO} en {s} inicia {P}, que requiere {O} en {s}.`

**Condición (`c`)**: CT1 `{P} ocurre si {O} existe, en cuyo caso {O} se consume, de lo contrario {P} se omite.` ·
CS1 `{P} ocurre si {O} está en {s}, en cuyo caso {O} se consume, de lo contrario {P} se omite.` ·
COND-ALT (P, T-161) `Si {O} existe entonces {P} ocurre y consume {O}, de lo contrario se omite {P}.` ·
CT2 `{P} ocurre si {O} existe, en cuyo caso {P} afecta {O}, de lo contrario {P} se omite.` ·
CS2 `{P} ocurre si {O} está en {e}, en cuyo caso {P} cambia {O} de {e} a {s}, de lo contrario {P} se omite.` ·
CS3 `{P} ocurre si {O} está en {e}, en cuyo caso {P} cambia {O} de {e}, de lo contrario {P} se omite.` ·
CS4 `{P} ocurre si {O} existe, en cuyo caso {P} cambia {O} a {s}, de lo contrario {P} se omite.` ·
CH1 `{O} maneja {P} si {O} existe, de lo contrario {P} se omite.` · CS5 `{O} maneja {P} si {O} está en {s}, de lo contrario {P} se omite.` ·
CH2 `{P} ocurre si {O} existe, de lo contrario {P} se omite.` · CS6 `{P} ocurre si {O} está en {s}, de lo contrario {P} se omite.`
(con ruta: `Por ruta {r}, ` antepuesto a ET1/ETS1/CT1/CS1, R-COMB-4).

**Excepción e invocación**: EX1 `{P1} ocurre si duración de {P2} excede {n} {u}.` · EX1r `… excede su duración máxima.` ·
EX2 `{P1} ocurre si duración de {P2} es menor que {n} {u}.` · EX2r `… es menor que su duración mínima.` ·
IV1 `{P1} invoca {P2}.` (P: `{P1} invoca {Ly:P}.` ⇒ N) · IV2 `{P} se invoca a sí mismo.`
(Parsear EX1/EX2 fija `duracion.max|min` de la fuente: la cota viaja por OPL.)

**Estructurales** (`{C}`: la misma plantilla sirve para objetos y procesos, R-OPL-RF-1)
| id | patrón |
|---|---|
| RF1 | `{C} consta de {Ly:mC}.` · incompleta `… consta de <partes> y al menos otra parte.` |
| RF2 / RF2b | `{O} exhibe {Ly:O}[, así como {Ly:P}].` · proceso exhibidor: `{P} exhibe {Ly:P}[, así como {Ly:O}].` · incompleta: `… y al menos otro rasgo.` al final |
| RF3 / RF3b | `{Ly:C} son {C}.` · `{C} es un|una {C}.` · incompleta `<esp>, <esp> y al menos otra especialización son {C}.` |
| RH1 | `{C} es un|una {C1}, un|una {C2} y un|una {C3}.` (≥2 generales) |
| RF4 / RF4b | `{C} es una instancia de {C}.` · `{Ly:C} son instancias de {C}.` |
| SE1 / SE2 | `{mC} {t} {mC}.` · `{mC} se relaciona con {mC}.` |
| SSE1–3 | `{O} en {s} {t} {O}.` · `{O} {t} {O} en {s}.` · `{O} en {a} {t} {O} en {b}.` (etiqueta nula: `se relaciona con`) |
| SE3 | dos líneas: `{mC1} {t} {mC2}.` y `{mC2} {t2} {mC1}.` · SSE4/5: `{O1} en {a} {t} {O2}.` y `{O2} {t2} {O1} en {a}.` |
| SE4 / SE5 | `{mC} y {mC} son {t}.` · `{mC} y {mC} se relacionan.` · SSE6 `{O1} en {a} y {O2} en {b} son {t}.` · SSE7 `{O2} y {O1} en {a} son {t}.` |

**Abanicos** (reglas §7.3; ramas `{mOe}`: estado y multiplicidad por rama, R-FAN-EST-1)
| familia | convergente | divergente |
|---|---|---|
| consumo | `{P} consume {Q} {Lo:mOe}.` | `{Q^} {Lo:P} consume {mOe}.` |
| resultado | `{Q^} {Lo:P} genera {mOe}.` | `{P} genera {Q} {Lo:mOe}.` |
| efecto | objetos: `{P} afecta {Q} {Lo:mO}.` | procesos: `{O} es afectado por {Q} {Lo:P}.` |
| agente | `{P} es manejado por {Q} {Lo:mOe}.` | `{O} maneja {Q} {Lo:P}.` |
| instrumento | `{P} requiere {Q} {Lo:mOe}.` | `{Q^} {Lo:P} requiere {mOe}.` |
| invocación | `{Q^} {Lo:P} invoca {P}.` | `{P} invoca {Q} {Lo:P}.` |

Estados de un mismo objeto (efecto): FAN5s `{P} cambia {O} a {Q} {Lo:s}.` · FAN5e `{P} cambia {O} de {Q} {Lo:s}.` ·
FAN5A `{P} cambia {O} de {e} a {Q} {Lo:s}.` (la entrada común no se suprime; si varían entrada y salida a la vez la
generación **falla cerrada**: `Diagnostico abanico-invalido`, nunca `throw`). Con control: FAN4 `{O} inicia {Q} {Lo:P}, y es afectado por el proceso que ocurre.` ·
CFE `{Q^} {Lo:P} ocurre si {O} existe, en cuyo caso afecta {O}, de lo contrario se omite.` ·
C18 `{P} ocurre si {Q} {Lo:O} existe, en cuyo caso {P} consume {Q} {Lo:O}, de lo contrario {P} se omite.`

**Gestión de contexto**
| id | patrón | |
|---|---|---|
| CX1 | `{P} se descompone en {Ly:P}, en esa secuencia[, así como {Ly:O}].` | G (≥2 bandas de 1) |
| CX2 | `{P} se descompone en paralelo {Ly:P}[, así como {Ly:O}].` | G (1 banda de ≥2) |
| CXM | `{P} se descompone en {SEC}, en esa secuencia[, así como {Ly:O}].` | G (mixta, R-OPL-CX-5) |
| CXI | `{P} se descompone en {Ly:P}, así como {Ly:O}.` (forma literal de spec §7.1: se asume secuencia, info) | P |
| CXN | `{P} desde {opd} se descompone en {opd} en {SEC|Ly:P}, en esa secuencia…` | P (DR-24) |
| CX3 | `{C} se despliega en {opd} en {Ly:C}[, así como {Ly:C}].` | G (≥2 refinadores; nunca `en esa secuencia` ni `paralelo`) |
| CX3s | `{C} se despliega en {Ly:C}.` | P |

`así como` en CX lleva los **objetos internos** (R-OPL-CX-6): se emite porque el alcance
interno/externo decide qué enlaces se ven (R-VIS-HIJO-1) y sin él el roundtrip no sería estricto.

### 5.3 Generador (`opl/generar.ts`)

```ts
export interface OpcionesOpl { esencia: 'siempre' | 'solo-difiere' | 'oculta' }   // solo display
export function generarBloque(m: Modelo, opd: Id, canonico = true, o?: OpcionesOpl): LineaOpl[];
export function generarModelo(m: Modelo): LineaOpl[];          // preorden; cabeceras soloDisplay
export interface TokenOpl { texto: string; rol: 'texto' | 'nombre' | 'verbo' | 'estado'; ref?: RefOpl; hecho?: Id }
export interface LineaOpl { texto: string; tokens: TokenOpl[]; refs: RefOpl[]; hechos: Id[];
                            opd: Id; etiquetaOpd: string; profundidad: number; soloDisplay?: true }
export type RefOpl = { tipo: 'entidad' | 'enlace' | 'estado' | 'opd'; id: Id };
```

Emisión de un bloque (sobre `proyectar(m, opd)`), en este orden (DR-32 ajustado por C1):
1. **Refinamiento** (si el OPD es hijo y tiene ≥2 refinadores, R-CX-0): CX1/CX2/CXM (con
   `así como` si hay objetos internos) o CX3.
2. **Cosas** visibles, en orden: contenedor; subprocesos por banda (y nombre dentro de la banda);
   demás procesos por nombre; objetos por nombre. Por cosa: D1 si física; D3 si ambiental;
   D5/D6 con sus estados **visibles** en el orden del modelo (T-101); por estado visible con
   designación: D10 o D7/D8, luego D9, D13; VAL por exhibidor visible.
3. **Procedimentales**, agrupados por proceso (mismo orden de 2): consumo, resultado, efecto,
   agente, instrumento (fuerza, R-COMP-ELEG-3), luego invocaciones (como invocador) y excepciones
   (como fuente); dentro de cada tipo por nombre del objeto. Un enlace con control emite **solo**
   su E\*/C\* (un hecho, una oración, T-112). Cada abanico emite una oración (en el grupo de su
   proceso común o, si el común es el objeto, en el del primer proceso rama); ruta prefija la
   oración completa (T-129).
4. **Estructurales**: si el OPD **no** es hijo de refinamiento, agrupados por (vértice, relación)
   (eje b, T-131): RF1, RF2/RF2b, RF3 por general (las especializaciones con ≥2 generales salen del
   grupo y van a RH1), RF4/RF4b; si es hijo, una oración por enlace (T-132). Luego etiquetados por
   origen y destino: SE1/SE2/SSE, SE3 (dos líneas contiguas), SE4/SE5/SSE6/7.
5. **Mención mínima** (C2): cada cosa visible que no apareció en 1–4 recibe D2 al final de la
   sección 2.
6. Empates: nombre (colación `es`, sensibilidad base) y luego id.

Tokens y refs (T-135): cada hueco produce un token con `ref` y, si pertenece a un enlace, `hecho`
= id del enlace (en abanicos, el de la rama; en líneas abstraídas del padre, `hechos` lista todos
los subyacentes). `refs` únicas por `tipo:id` en orden de primera aparición. Nunca fusión opaca.

Plegado/display (R-OPL-DISP-3/4, R-OPL-CFG-1/2): el bloque de un OPD ascendente se genera sobre
la vista abstraída (§4.6), así que los hechos refinados salen plegados. `esencia: 'siempre'`
(default del panel) añade D2 a toda cosa informacional como líneas `soloDisplay`; `'oculta'`
retira D1/D2 del display; el texto **canónico** (el que se exporta, se edita y se parsea) es
siempre `solo-difiere` + mención mínima. La numeración de líneas es display (T-246).

### 5.4 Analizador (`opl/analizar.ts`)

Entrada: texto Markdown. Salida por línea: `{ hechos: HechoTexto[]; diagnosticos: DiagOpl[] }`.

1. **Normalización** (R-§18-NORM-1): NFC; tabulaciones y espacios no separables ⇒ espacio;
   colapsar espacios; quitar viñetas/numeración iniciales (`- `, `1.`, `1)`); comillas
   tipográficas ⇒ ASCII fuera de spans; `≤ ≥ ≠ ∈` ⇒ ASCII (solo afecta formas no soportadas).
   Acentos, ñ, ü se preservan. Línea vacía ⇒ `ignorada-vacia`. Sin punto final ⇒
   `puntuacion-faltante` (error). Línea que empieza con `#` ⇒ cabecera de bloque (`soloDisplay`).
2. **Spans**: `**…**` ⇒ O, `*…*` ⇒ P, `` `…` `` ⇒ E (el léxico impide `*` y `` ` `` dentro de
   nombres, así que el análisis es inequívoco). `*Nombre proceso*` o `*Nombre* proceso` aceptan
   el sufijo ` proceso` (R-OPL-9) si no existe una cosa con ese nombre completo.
3. **Plegado de tokens**: frase de multiplicidad inmediatamente antes de O/C ⇒ atributo del token
   (`al menos una **Olla**` ⇒ `O[+]`, género `f`); ` en ` + E tras O ⇒ `Oe`; secuencias de tokens
   del mismo tipo separadas por `, ` y cerradas por ` y | e | o | u ` ⇒ `L[y|o](…)` (con `y` y `e`
   equivalentes, `o` y `u` equivalentes, T-163); `y al menos otra parte|otro rasgo|otra
   especialización` ⇒ marca de incompleta en la lista.
4. **Esqueleto**: la línea queda como `⟨P⟩ consume ⟨O⟩.`; se busca en el mapa esqueleto →
   plantillas compilado desde `PLANTILLAS` (primer literal sin distinguir mayúsculas). Varias
   plantillas por esqueleto se prueban en orden de especificidad (Oe con estado antes que sin).
   `CXM` y `SEC` usan un subanalizador de secuencia mixta (porte de `parsearBandasOrden`: resuelve
   el doble rol de `y`).
5. **Residual SE1** (DR-36): `⟨mC⟩ <frase_no_capitalizada> ⟨mC⟩.` con ambos extremos del mismo
   tipo tipográfico y que no calzó con otro esqueleto ⇒ SE1 con esa etiqueta. **Par SE3** (DR-C9):
   dos SE1 del mismo bloque con extremos invertidos se combinan en un solo bidireccional (si las
   etiquetas son iguales ⇒ recíproco, R-STRE-1).
6. **No soportadas / no canonizadas** (`opl/no-soportadas.ts`): esqueletos reconocibles que se
   responden sin mutar. `NO_SOPORTADAS` ⇒ `unsupported-canonical` (warning, R-IMPORT-5):
   RX1/RX2 `puede ser`, plurales por multiplicidad `consumen/generan/afectan` (DR-12), CX4
   `se refina por`, CX5/6 `se pliega en`, CX7/8 `se recompone desde`, CM1–CM3, EX combinada,
   `después de` (demora), negadas `no maneja/no requiere/no cambia`, `Pr=` **dentro** de un abanico
   (FAN-6, extensión retirada), restricciones de
   participación fuera de las 3 (`exactamente un`, `al menos dos`, `dos o más`, numéricas),
   `es de tipo`, `varía de`, `donde`, RF2o `tiene un … opcional`, sufijo `[etiqueta: …]`, ruta en
   agente/instrumento/efecto (C-25/DR-19), abanico × control sin plantilla (C-19b, C-18
   instrumento), despliegue dedicado `se despliega por partes|especialización|instanciación|
   rasgos en`, especialización de estado (R-OPL-RF-3), `**O** se descompone en …` (DR-23),
   multiplicidad sin hueco (DR-44), composición `consume **A** y genera **B**` (ext §9).
   `NO_CANONIZADAS` ⇒ `non-canonical` (error): abanico con control mixto (R-ZNC-COMB-1), D11/D12
   incoherentes (DR-3), condición con estado sobre efecto sin cambio (DR-29), `puede ser` con
   estados (R-VERB-EST-2), `c` y `e` en un mismo hecho (AP-28), `inicia e invoca`, `puede
   generarse`, `invoca … si … ocurre` (formas que el parser NO DEBE construir, R-MOD-INPUT-2),
   `Pr=` **fuera** de abanico (T-157: hoy crea un consumo en silencio; aquí es `non-canonical` sin
   mutar).
   Todo lo demás ⇒ `syntax-error` (`forma-no-reconocida`, T-160: nunca grafo plausible).

`HechoTexto` es la representación intermedia por **nombres**: `{tipo:'cosa', tipoCosa, nombre,
esencia?, afiliacion?}`, `{tipo:'estados', objeto, nombres, mas: boolean}`, `{tipo:'designacion',
objeto, estado, designacion}`, `{tipo:'valor', objeto, exhibidor, valor}`, `{tipo:'cota',
proceso, campo, n, unidad}`, `{tipo:'enlace', candidato}` (con extremos por nombre),
`{tipo:'abanico', operador, ramas}`, `{tipo:'descomposicion', proceso, bandas, internos}`,
`{tipo:'despliegue', cosa, opd?, refinadores}`, `{tipo:'incompleta', cosa, relacion}`.

### 5.5 Planificador y patches (`opl/planificar.ts`, `opl/aplicar.ts`)

`planificar(m, alcance: Id /*OPD*/, texto) → { lineas: LineaPlan[]; resumen }` es **puro**
(T-173): no toca el modelo.

1. Resolver nombres con la clave de unicidad (C11) sobre el modelo **más** las creaciones
   pendientes del mismo texto (una cosa nueva mencionada en varias líneas se crea una vez, con el
   tipo de su tipografía; tipografía que contradice a una cosa existente ⇒ `type-mismatch`, T-158).
2. Comparar cada hecho con la **proyección del OPD de alcance** (no con el modelo crudo): si la
   vista ya lo contiene (incluidas líneas abstraídas de hechos refinados, T-168) ⇒ sin patch; si
   el hecho existe en el modelo pero alguna cosa no aparece en el alcance ⇒ patch `traer-cosa`;
   si no existe ⇒ patches de creación.
3. Validar cada candidato de enlace con la matriz (§4.3.4) **en el modelo resultante de las
   líneas previas del mismo plan** (una simulación sobre copia): forma/contexto ⇒ error
   `type-mismatch`; `noOfrecido` ⇒ `unsupported-canonical`.
4. Registro de patches con clave de hecho (porte de `PatchRegistry`): dos líneas con patches
   incompatibles sobre la misma clave ⇒ ambas `conflicto-patches`.
5. Menos hechos en el texto que en la vista ⇒ un único diagnóstico `no-delete-by-absence` (info,
   T-172). Reordenar líneas no cambia nada (T-171).

Patches (R-OPL-EDIT-5 + DR-35): `crear-entidad`, `traer-entidad`, `cambiar-esencia`,
`cambiar-afiliacion`, `sincronizar-estados` (crea faltantes; nunca borra ni reordena existentes),
`aplicar-designacion-estado`, `fijar-valor`, `fijar-cota`, `crear-enlace` (idempotente por tipo +
extremos, T-182; si existe con otros campos ⇒ `fijar-*` específico), `fijar-etiqueta-enlace`,
`crear-abanico`, `crear-refinamiento` (descomposición con bandas e internos / despliegue con
refinadores), `fijar-orden`, `fijar-incompleta`. `renombrar-entidad` y `renombrar-estado` existen
solo para la edición en token (R-OPL-EDIT-7, C7).

`aplicar(m, patches) → Resultado<Hecho>`: sobre una copia, en tres fases (T-181): (1) no-enlace
(cosas, traídas, esencia, afiliación, estados, designaciones, valores, cotas, refinamientos,
orden, incompleta); (2) enlaces y etiquetas; (3) abanicos. Cada patch llama a la **misma**
operación del núcleo que usa el lienzo (T-011, R-OPL-EDIT-8); las cosas nuevas se ubican con
`colocacion.colocar` (núcleo) en el OPD de alcance. El primer rechazo aborta todo (fail-fast, todo-o-nada,
DR-39) y se informa con su línea; éxito = un solo paso de deshacer (ley `undo` atómico).

### 5.6 OPL del modelo completo (`opl/documento.ts`)

- **Generar**: bloques en preorden; cada bloque abre con la cabecera display
  `## SD1 · descomposición de *Procesar* · en SD` (declara OPD y padre, DR-24; R-OPL-PANEL-2).
  Es el export «OPL Markdown» (T-282) y la sección OPL de `canon-documento`.
- **Parsear sobre modelo vacío** (import de OPL y fixture estricto):
  - Pasada A (preorden): en cada bloque se crean las cosas mencionadas **por primera vez** en ese
    bloque (aparición en su OPD; en un bloque de descomposición, los objetos listados en `así
    como` son internos y los demás externos) y se aplican las oraciones de cosa y de
    refinamiento (CX, CX3); la etiqueta resultante debe coincidir con la de la cabecera.
  - Pasada B (preorden inverso, del más profundo al raíz): se planifica y aplica el resto de cada
    bloque contra la proyección de su OPD. Así las líneas abstraídas del padre encuentran ya el
    hecho refinado (sin-cambio) y nunca se crean hechos «de contorno» duplicados.
- En la edición en la app el alcance es un solo bloque (C6) y basta la comparación con la
  proyección.

### 5.7 Editor OPL (`ui/EditorOpl.tsx` sobre `planificar`)

- Abrir (`Editar` o `Ctrl+E`): el bloque canónico del OPD activo en un `textarea` sin ajuste de
  línea, con canaleta alineada por línea.
- Cada 150 ms tras teclear: `planificar`. Estado por línea con la precedencia exacta
  `ignorada-vacia → aplicable → no-aplicable → sin-cambio` (R-OPL-EDIT-1); icono y texto:
  aplicable = «crear objeto **Cliente**», «crear enlace consumo»…; no-aplicable = una de las 8
  razones con su texto visible (R-OPL-EDIT-3); sin-cambio = «ya está en el modelo» o el warning
  (`unsupported-canonical`: «forma canónica no disponible en esta versión; no se aplica»).
- Mapeo diagnóstico → razón: `syntax-error` ⇒ `forma-no-reconocida` (o `puntuacion-faltante` si
  falta el punto); `unknown-symbol` ⇒ `entidad-no-existe` (etiqueta `SDx.y` inexistente);
  `ambiguous-symbol` ⇒ `referencia-ambigua` (DR-35); `type-mismatch` ⇒ `enlace-invalido-firma`;
  `patch-conflict` ⇒ `conflicto-patches`; `non-canonical` ⇒ `forma-no-reconocida` con mensaje «no
  canonizado»; `unsupported-canonical` y `no-delete-by-absence` ⇒ `inversa-no-soportada` como
  texto (no bloquean); `cambio-ya-presente` se reporta como sin-cambio (G19).
- Resumen estable (R-OPL-EDIT-2): `N líneas · A aplicables · X no aplicables · I ignoradas · S sin
  cambio` y botón `Aplicar A cambio(s)` / `Sin cambios aplicables` (deshabilitado). Aplicar:
  todo-o-nada; si falla, el editor muestra la línea y la razón y el modelo queda intacto; si
  funciona, el texto se regenera canónico y el editor sigue abierto. `Esc` cierra sin aplicar.
- Partial-parse (T-179): las líneas no aplicables no impiden aplicar las aplicables.
- Edición en token (fuera del editor, R-OPL-EDIT-7): doble clic en nombre de cosa ⇒
  `renombrarCosa`; en estado ⇒ `renombrarEstado`; en etiqueta de enlace ⇒ `fijarEtiqueta`; en
  cualquier otro token de un enlace ⇒ selecciona el enlace y abre el inspector. Valida el id antes
  de mutar.

### 5.8 Cómo se garantiza `parsear(generar(m))` y el fixture estricto R-§19-SIM-3

1. **Por construcción**: generar y reconocer usan el mismo `patron` (P4); cada `hacia(desde(h))`
   es la identidad sobre el hecho (prueba unitaria por plantilla).
2. **Por enumeración** (`roundtrip-matriz.test.ts`): un enumerador recorre `MATRIZ`; por cada
   tipo construye el modelo mínimo (objeto `Alfa` con estados `uno`, `dos`, `tres`, proceso
   `Beta`, etc.) y todas las variantes legales de sus dimensiones — estados en cada extremo
   admitido, control ∈ {∅, e, c}, multiplicidad ∈ {∅, ?, *, +}, ruta ∈ {∅, `Uno`}, género ∈
   {m, f}, esencia/afiliación — descartando las que `violaciones*` o `noOfrecido` rechazan; y para
   abanicos, cada familia × {XOR, OR} × {convergente, divergente} × {con estado por rama, sin} ×
   controles admitidos. Para cada caso exige: (a) `generar` produce solo plantillas de la tabla;
   (b) auto-reparseo sobre el mismo modelo: 0 patches, 0 errores (R-§19-SIM-1); (c) estricto:
   `generar(m) === generar(aplicar(parsear(generar(m)), vacío))` línea a línea (R-§19-SIM-3,
   T-192). Unos 600 casos, < 2 s.
3. **Tabla 9.2 nominal** (`roundtrip-tabla92.test.ts`): una prueba con nombre por fila (T-301).
4. **Modelos reales** (`roundtrip-modelos.test.ts`): los 6 `app/fixtures/v0` importados y un
   sintético grande (262 cosas, 433 enlaces, 36 OPDs, generado con semilla): auto-reparseo por
   OPD con 0 cambios (el defecto UX-01 no puede volver) y estricto sobre el documento completo
   (§5.6) para los que pasan los gates.
5. **Composición** (T-194): `parsear(componer(F)) = F` para toda oración de lista (RF1, RF2, RF3,
   RF4b, D5, CX, abanicos): se genera la lista desde F aleatorio y se compara el conjunto de
   hechos.
6. **Leyes de lente segura** (T-302): ausencia no borra; preview no muta (identidad de objeto del
   modelo); `unsupported-canonical` no muta; `exportarV0(aplicar(m, [])) === exportarV0(m)`.

Bisimetrías parciales **declaradas** (R-§19-ROT-1; fixture marcado no estricto y fila en
Brechas): (1) procedencia de escisión (el texto no distingue TS4/TS5 escindido de standalone; se
conserva en el JSON y al reparsear sobre el modelo existente); (2) borrado (el OPL es aditivo);
(3) posiciones y tamaños; (4) estados suprimidos en **todos** los OPDs (D6 solo dice «y otros
estados»); (5) duración de proceso sin excepción que la cite (no hay plantilla de duración);
(6) `descripcion`, `genero` sin oración que lo manifieste; (7) bidireccional ↔ par de
unidireccionales opuestos (C9); (8) refinamientos triviales (<2): sin oración CX (R-CX-0), no se
reconstruyen desde texto.

---

## 6. OPD

### 6.1 Escena pura y componentes SVG

`escena(m, opd): Escena` (`opd/escena.ts`) es una función pura de `proyectar(m, opd)` y de las
métricas de texto; decide **toda** la geometría (no hay pasadas posteriores sobre un grafo vivo:
el export y el lienzo dibujan la misma escena, dossier render §10.4).

```ts
interface Escena { opd: Id; caja: Rect; nodos: NodoCosa[]; simbolos: Simbolo[]; aristas: Arista[];
                   arcos: Arco[]; advertencias: Advertencia[] }
interface NodoCosa {
  ref: Ref; forma: 'rect' | 'elipse'; caja: Rect; contenedor: boolean;
  trazo: 1.5 | 4; dash?: '8 4'; sombra: boolean;            // ambiental / física
  rotulo: { lineas: string[]; x: number; y: number; italica: boolean };
  estados: NodoEstado[]; chipOcultos?: { n: number; caja: Rect };
  duracion?: string; rotuloInstancia?: string;               // «Nombre : Clase» (R-INS-3)
}
interface NodoEstado { ref: Ref; caja: Rect; nombre: string; inicial: boolean; final: boolean; porDefecto: boolean; current: boolean }
interface Simbolo { refinable: Id; relacion: 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion';
                    vertice: Punto; orientacion: 'abajo' | 'arriba' | 'derecha' | 'izquierda'; incompleta: boolean; ramas: Id[] }
interface Arista {
  ref: Ref; hechos: Id[]; puntos: Punto[];                     // polilínea final
  inicio?: Marcador; fin?: Marcador;                           // 'punta' | 'piruletaNegra' | 'piruletaBlanca' | 'abierta' | 'arpon'
  rayo?: boolean; marcas: Array<{ texto: 'e' | 'c' | '/' | '//'; en: Punto; angulo: number }>;
  etiquetas: Array<{ texto: string; en: Punto; italica: boolean; clave: 'etiqueta' | 'inversa' | 'ruta' | 'mult:objeto' | 'mult:origen' | 'mult:destino' }>;
  capa: 4 | 20;                                                // 20 = anclada a estado
}
interface Arco { abanico: Id; centro: Punto; radio: 30; desde: number; hasta: number; doble: boolean }
```

Componentes (`opd/OpdSvg.tsx`, sin estado, un solo árbol): `<OpdSvg escena modo="canon"|"edicion">`
dibuja en orden de capa: contenedor (0) → aristas (4) → arcos (5) → cosas y estados (10) →
triángulos (12) → aristas a estados (20). En `edicion` cada elemento semántico lleva
`data-ref="cosa:o-3" | "estado:s-2" | "enlace:e-7" | "abanico:f-1" | "simbolo:o-3:agregacion"` y
un envoltorio transparente de 15 px para el clic en aristas (§18.2); en `canon` no hay atributos
de interacción. `CapaUi.tsx` (selección, asas, anclas de conexión, fantasmas, guías de banda,
realce) es **otro** `<g>` encima: jamás entra al export (R-OPD-CAN-3, T-227).

### 6.2 Geometría (`opd/geometria.ts`)

- **Recorte exacto** (R-OPD-LAY-5, T-224): el segmento va de centro a centro y se recorta en el
  perímetro real. Rectángulo: `s = min(w/2/|dx|, h/2/|dy|)`, punto `c + s·d`. Elipse:
  `s = 1/√((dx/rx)² + (dy/ry)²)`. Estado: rectángulo de la cápsula (radio 8, error < 1 px).
  Nunca extremos sueltos: toda arista termina en un borde.
- **Procedimentales**: rectos (R-OPD-LAY-4). Consumo: punta en el proceso. Resultado: punta en el
  objeto o estado. Efecto T3: punta en ambos extremos. TS3: dos tramos, `estado_entrada → proceso`
  (punta en el proceso) y `proceso → estado_salida` (punta en el estado). TS4: `estado → proceso`,
  punta en el proceso. TS5: `proceso → estado`, punta en el estado (R-OPD-TR-6: el anclaje porta el
  hecho). Agente / instrumento: piruleta negra / blanca en el extremo proceso, colgando de la
  línea (T-210).
- **Invocación** (T-211): polilínea `A, M1, M2, B` con `M1 = lerp(A,B,0.46) + n·k`,
  `M2 = lerp(A,B,0.54) − n·k`, `k = min(22, max(12, |AB|·0.08))`; punta cerrada en el invocado. El
  rayo es decoración derivada de la recta (nunca de vértices persistidos: dossier render §10.3).
  **Autoinvocación**: lazo bajo el proceso desde los puntos del borde a ±35° de la vertical
  inferior hasta un pico a `max(56, alto·0.55)` bajo el borde, con el quiebre del rayo en el pico y
  punta en el retorno (porte de `autoinvocacionLoop`).
- **Excepción**: recta sin punta adicional; `/` = una barra corta inclinada, `//` = dos barras
  paralelas, a 22 px del manejador (DR-38, T-215).
- **Estructurales fundamentales**: peine ortogonal (R-OPD-LAY-4, T-225). Por grupo
  (refinable, relación) con sus refinadores visibles: orientación = eje dominante del vector
  refinable→centroide de refinadores; vértice del triángulo (30×30) a 24 px del borde del
  refinable en esa dirección, unido por un tramo recto; base hacia los refinadores; barra común a
  16 px de la base; de la barra, bajadas ortogonales al centro de cada refinador, recortadas en su
  borde. Refinadores ordenados por su coordenada transversal: el peine no cruza sus propias
  ramas (sustituye la permutación de terminales del código actual). Colección incompleta: barra
  horizontal corta (14 px) entre la base y la barra común (reglas §3.10, T-217). Multiplicidad de
  parte junto al extremo del refinador.
- **Etiquetados**: rectos. Unidireccional: punta abierta en el destino. Bidireccional y recíproco:
  arpón en ambos extremos (media punta, lados opuestos). Etiqueta en itálica sobre el eje: al
  centro (uni, recíproco); en bidireccional la etiqueta a 1/3 desde el origen y la inversa a 1/3
  desde el destino, en lados opuestos (T-213). Multiplicidad en ambos extremos (T-218).
- **Abanicos** (T-216, DR-9): todas las ramas terminan en un **punto de acople** del extremo
  común: el recorte del borde del extremo común hacia el centroide de los otros extremos. Arco
  centrado en el acople, radio 30, que cubre el sector angular mínimo que contiene todas las ramas
  (porte de `calcularGeometriaAbanicoDesdePuntos` + mayor hueco angular). XOR = un arco; OR = dos
  arcos concéntricos (r 30 y 35). Dash `4 1`, trazo 1.5. AND = sin abanico = enlaces
  independientes.
- **Marcas de control** (T-214): `e`/`c` en minúscula dentro de un círculo de 18 px (fondo papel,
  borde tinta) sobre la línea a 28 px del borde del proceso.
- **Etiquetas de ruta y multiplicidad**: ruta en serif 11 a mitad del segmento, desplazada 10 px
  a la izquierda del sentido objeto→proceso (T-219); multiplicidad a 14 px del extremo objeto y
  10 px perpendicular.
- **Estados dentro del objeto** (T-206): filas en la región inferior, separación 8, cápsula de
  alto 26 y ancho `texto(itálica 13) + 16` (+6 si inicial); el objeto crece para contenerlas
  (nunca al revés). Inicial = trazo 3; final = doble contorno (rectángulo interior a 3 px, trazo 1);
  inicial y final = ambos; **por defecto** = flecha diagonal abierta **entrante** desde arriba a la
  izquierda hacia la esquina de la cápsula (no `↗`, DR-37); **current declarado** = pin externo
  (círculo r 3.5 con pie) sobre la esquina superior derecha, fuera de la cápsula (DR-37, T-207).
- **Chip `⋯N`** (T-208): cápsula de alto 16 en la esquina inferior derecha del objeto con los
  estados ocultos por supresión global o local; persiste en `canon-diagrama` (DR-15).
- **Rótulo** (T-204): serif 17 (itálica en procesos), envuelto a ~132 px por palabras, sin elipsis;
  la forma se agranda (ancho = máx(declarado, rótulo + 28, fila de estados + 16); alto ídem).
- **Duración** (T-220): bajo el nombre dentro de la elipse, `[min] {1, 3, 5}` serif 11; ausentes
  como `–`; sin distribución ni marcador si no hay duración.
- **Instancia lógica** (T-222): rótulo `Nombre : Clase` si el objeto es instancia por
  clasificación (clase = la primera por nombre).
- **Contorno grueso** (T-202): trazo 4 si la cosa tiene descomposición o despliegue, en el padre y
  en el hijo (siempre OPD nuevo, R-CTRN-2).
- **Contenedor** (T-221): la cosa refinada en su OPD de descomposición se dibuja agrandada, rótulo
  arriba dentro, subprocesos en filas por banda (misma banda = misma altura).

### 6.3 Marcadores (`opd/Marcadores.tsx`, paths literales de spec-OPD §18.3)

| id | geometría (marco local, eje +x hacia el extremo) | relleno |
|---|---|---|
| `punta` | `M 0 0 L 23 8 L 12 0 L 23 -8 Z` (swallowtail 23×16) | papel, trazo tinta 1 |
| `piruletaNegra` / `piruletaBlanca` | `M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0` | tinta / papel |
| `abierta` | polilínea `0,0 20,-10 0,0 20,10` | sin relleno |
| `arpon` | polilínea `0.5,0 20,10` (la otra mitad en el otro extremo: `0.5,0 20,-10`) | sin relleno |
| `sobretiempo` / `subtiempo` | `4,10 13,-10` / `4,10 13,-10 8.5,0 17,0 13,10 22,-10` | trazo tinta |
| triángulo | polígono `15,0 30,30 0,30`: agregación relleno tinta; generalización papel; exhibición + triángulo interior 12×12 tinta en (+9,+12); clasificación + círculo r4 tinta en (15,20) | según relación |

`marcadores.test.ts` compara estas cadenas con las del canon vendorizado (byte a byte) y verifica
la topología (conteo de arcos, relleno/vacío, interior) en SVG exportado.

### 6.4 Tokens visuales y capas (`opd/tokens.ts`; spec-OPD §18, informativos salvo estructura)

`paper #fafaf8`, `paperWarm #eeece2` (realce bimodal entrante), `ink #171511`,
`inkMid #5a564c`, `inkSoft #807b6e`, `opmObjeto #27613f`, `opmProceso #1d3f78`,
`opmEstado #68711f`, `estadoFill #dedacb`, `estadoFinalFill #d6d2c6`, `crimson #8e2a2e` (solo UI:
selección, foco, asas, guías; prohibido como marca semántica, AP-24). Trazos: cosa 1.5, estado
1.2, enlace 1, estructural 1.2, inicial 3, refinada 4, arco 1.5. Dash ambiental `8 4`. Sombra
física `feDropShadow dx 6 dy 6 stdDeviation 1 flood rgba(23,21,17,.68)`. Tipografía: rótulos
Inria Serif 17; estados serif itálica 13; etiquetas de enlace serif 11–12. En `canon` los
rótulos van en negro `#000` (T-203) y los colores de trazo quedan como tokens informativos: la
semántica no depende del color (forma, contorno, sombra, topología; T-203, R-COLOR-2).

Métricas: `opd/metricas.ts` guarda la tabla de avances de Inria Serif regular e itálica
(latin-1 + vocales acentuadas + ñ/ü) generada una vez por `herramientas/medir-fuente.ts`; el
ancho de texto es idéntico en el navegador, en Bun y en el export (sin medir en DOM).

### 6.5 Colocación (`nucleo/colocacion.ts`) y cámara

La colocación vive en el **núcleo** porque las operaciones (`descomponer`, `agregarSubprocesos`,
`desplegar`, `traerCosa`, `aplicar` del OPL) deben dejar apariciones con posición sin importar
`opd/` (que el núcleo no conoce). Es una función determinista de las cajas guardadas en
`Aparicion`; ninguna coordenada decide un hecho (P6).

- `colocar(m, opd, tamaño, punto?)`: busca en espiral (paso 20 px, margen 24 px, máx. 400
  intentos) el hueco libre más cercano a `punto` (cursor, o centro de la vista si se creó por
  teclado; la UI lo pasa) entre las cajas guardadas del OPD; nunca solapa cajas guardadas
  (R-OPD-LAY-1). La primera cosa de un OPD vacío va al origen de la vista.
- Tamaño guardado inicial: 135×60 (cosa). La escena dibuja `máx(guardado, necesario por rótulo y
  estados)`; si ese crecimiento produce un solape, lo informa la advertencia de oclusión del
  export (§6.6), nunca se re-rutea en silencio.
- **Descomposición**: contenedor en la posición y ancho `máx(420, banda más ancha + 80)`, alto
  `64 + nBandas·100 + (objetos internos ? 100 : 0) + 24`; banda k en `y = contenedor.y + 64 +
  k·100`; subprocesos de una banda centrados con 40 px entre ellos; objetos internos en una fila
  inferior dentro del contenedor. Externos (R-HIJO-3, R-OPD-LAY-9): entradas (objeto de consumo,
  efecto de entrada, evento) en columna a la izquierda, salidas (resultado) a la derecha,
  habilitadores (agente, instrumento) en fila arriba, estructurales abajo, procesos
  (invocación/excepción) a la derecha bajo las salidas; en cada grupo por nombre.
- Bandas: al cambiar bandas se recalcula solo la `y` de los internos y la altura del contenedor;
  nunca reordena bandas (R-LAY-4). Mover el contenedor mueve a sus internos.
- **Despliegue**: cosa arriba al centro; refinadores en fila 180 px debajo, centrados, por nombre
  (todo arriba, partes abajo, R-OPD-LAY-9).
- No hay «auto-layout» global (no lo exige el canon; su riesgo de cambiar hechos desaparece).
- Cámara (R-OPD-LAY-10, T-231): al entrar a un OPD por primera vez se encuadra el bbox real
  (zoom ≤ 1); al volver se restaura la cámara de la sesión; crear o renombrar nunca mueve la
  cámara salvo para mostrar una cosa creada fuera de vista (desplazamiento mínimo).

### 6.6 Export canónico (`opd/exportar.ts`)

- **`canon-diagrama`** (T-280, R-OPD-EXP-1/3): `renderToString(<OpdSvg escena modo="canon"/>)`
  con `viewBox` = `escena.caja` (unión de cajas de nodos, rótulos, marcadores, sombras +8, arcos)
  + 24 px; sin grid, asas, realces, UI ni validación; rótulos negros; `<title>` = etiqueta y cosa
  refinada; `<metadata>` JSON `{perfil:"canon-diagrama", modelo, opd, etiqueta, fuentes:
  ["Inria Serif (referenciada, no embebida)"], version}` (export parcial declarado, T-285).
  Archivo `<modelo>-<SDx.y>.svg`.
- **`canon-documento`** (T-281): un HTML autocontenido: título del modelo, árbol de OPDs, y por
  cada OPD en preorden su SVG `canon` en línea y su párrafo OPL canónico (tipografía como
  `<strong>`, `<em>`, `<code>`). Recibe las líneas OPL por parámetro (no importa `opl/`).
- **OPL Markdown** (T-282) y **JSON v0** (T-286): sin gate.
- **Gates** (T-283): `gatesExportacion` (§4.4); con gate, el menú muestra el ítem deshabilitado y
  la lista de motivos (regla + mensaje + «Ir»). La edición no se bloquea.
- **Advertencias** (R-LAY-2, T-284): sobre la escena se cuentan cruces entre aristas que no
  comparten extremo, aristas que atraviesan una cosa que no es su extremo ni su contenedor, y
  cosas solapadas; se informan tras exportar («SD1: 2 cruces; **Pago** atravesado por 1 enlace»)
  sin re-rutear (producto: advertir).
- Ningún texto de la UI llama «validado» al export (T-254); una captura de edición no es evidencia
  de canonicidad: las pruebas visuales inspeccionan el SVG `canon` (T-305).

---

## 7. Experiencia de usuario

### 7.1 Layout

**Escritorio (≥ 1100 px)** — el lienzo y el OPL ocupan ≥ 75 % a 1440×900.

```
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ ≡  Despacho ✎   SD › SD1 Despachar          ● Guardado            Exportar ▾   ?   Salir       │ 40 px
├──────────────┬───────────────────────────────────────────────┬────────────────────────────────┤
│ OPDs         │ ▭ Objeto  ⬭ Proceso  ◻ Estado  ⟶ Enlace       │ OPL │ Diagnóstico (3)           │
│ ▾ SD         │                                               │ ────────────────────────────── │
│   ▸ SD1 Desp…│                                               │ ## SD                          │
│   ▾ SD2 Pedi…│              (lienzo SVG, cámara viewBox)     │  *Despachar* consume **Pedido**│
│      SD2.1 … │                                               │  …                             │
│──────────────│                                               │ ## SD1 · descomposición de …   │
│ Propiedades  │                                               │  *Despachar* se descompone en  │
│ (inspector   │                                               │  *Recibir*, *Validar* y …      │
│  contextual) │                                               │                                │
│              │                                  − 100 % + ⤢  │ [Editar] esencia▾ # ⌕ ⟨filtro⟩ │
└──────────────┴───────────────────────────────────────────────┴────────────────────────────────┘
   240 px (redimensionable, plegable)                               380 px (redimensionable, minimizable)
```

- Cabecera única: volver a la biblioteca (≡), nombre del modelo (clic = renombrar), ruta de OPD
  (clic = navegar), indicador de guardado, `Exportar ▾`, ayuda, salir.
- Paleta flotante de 4 verbos sobre el lienzo (esquina superior izquierda) y control de zoom
  (inferior derecha). Nada más encima del lienzo.
- Columna izquierda: árbol de OPDs arriba, inspector abajo (divisor movible). Columna derecha:
  pestañas OPL | Diagnóstico. Ambas columnas se pliegan (`Ctrl+\` izquierda, `Ctrl+.` derecha);
  `Ctrl+Shift+M` = solo lienzo.

**Estrecho (< 1100 px)** — misma aplicación, una zona visible y pestañas inferiores.

```
┌──────────────────────────────────────┐
│ ≡ Despacho   SD1 ▾      ● Guardado ⋯ │ 40 px (⋯ = Exportar, Ayuda, Salir)
├──────────────────────────────────────┤
│                                      │
│    zona activa: Lienzo | OPL |        │
│    OPDs | Propiedades | Diagnóstico   │
│                                      │
├──────────────────────────────────────┤
│  Lienzo   OPL   OPDs   Propiedades  ⚠3│ 48 px
└──────────────────────────────────────┘
```

Sin desplazamiento horizontal de página (lienzo con cámara propia; panel OPL con ajuste de línea
en lectura). Edición con puntero y teclado; los gestos táctiles básicos (tocar, arrastrar, pellizcar
para zoom) funcionan, sin modo especial (el «modo móvil de solo lectura» queda fuera).

### 7.2 Superficies (inventario cerrado y justificación)

| # | Superficie | Tipo | Por qué existe (canon o infraestructura mínima) |
|---|---|---|---|
| 1 | Acceso | pantalla | una cuenta (DECISIONS) |
| 2 | Biblioteca | pantalla | lista simple: nuevo, abrir, renombrar, eliminar a papelera (y restaurar), importar, descargar (DECISIONS 7); sin pestañas ni carpetas |
| 3 | Editor: lienzo | pantalla | OPD (T-252) |
| 4 | Árbol de OPDs | panel | navegar el árbol (T-031, T-252) |
| 5 | Propiedades (inspector) | panel | fijar esencia, afiliación, estados, designaciones, control, etiquetas, ruta, multiplicidad, duración, colección incompleta; sección «Enlaces (N)» de la cosa en lugar de una tabla de enlaces (T-252, R-OPD-EDIT-2, DECISIONS 10) |
| 6 | OPL (lectura y edición en el mismo panel) | panel | bimodalidad activa (T-240, T-241), editor OPL (§6.2 spec-OPL) |
| 7 | Diagnóstico | panel (pestaña del 6) | validación fuera del lienzo (R-VIS-VAL-1, T-260) |
| 8 | Menú de tipo de enlace | menú | ofrecer solo tipos legales con motivo y vista previa OPL (T-040, T-253) |
| 9 | Menú contextual | menú | acciones de la selección (derivado del registro de comandos) |
| 10 | Exportar | menú | perfiles canónicos + JSON + OPL (T-280–T-282, T-286) |
| 11 | Decisión | diálogo genérico | confirmaciones destructivas (eliminar, eliminar refinamiento, quitar con pérdidas), conflicto de guardado, borrador local |
| 12 | Buscar (`Ctrl+K`) | diálogo | búsqueda mínima por nombre de cosa u OPD (DECISIONS 10, canal UI de R-OPD-UI-1): ir y seleccionar, o traer la cosa al OPD activo (método §9.15). No ejecuta comandos: los comandos viven en menús y atajos (una sola puerta por acción) |
| 13 | Informe de importación | diálogo | informe honesto de normalizaciones y pérdidas (T-287, DECISIONS) |
| 14 | Ayuda | diálogo | atajos (generados del registro) y leyenda visual |

Elementos en línea (no cuentan como superficies): edición de nombre en la figura (con la bandeja
de colisión), aviso breve (una línea, 4 s, `aria-live`). Hoy hay ~38 modales, 7 menús, halos y
cintas; el objetivo son 14 superficies y cero cintas.

### 7.3 Flujos

Convenciones: «↵» Enter, «⎋» Escape; toda acción rechazada muestra el aviso con la regla y la
acción canónica (P7); toda acción es deshacible en un paso.

1. **Entrar.** `/` sin sesión → Acceso: correo, clave, «Entrar». Error uniforme «Credenciales
   inválidas»; 5 fallos en 15 min ⇒ «Demasiados intentos; espera 15 minutos». Éxito → Biblioteca
   (o el último modelo abierto, recordado en `localStorage`).
2. **Biblioteca.** Una lista simple (sin pestañas ni carpetas, DECISIONS 7) ordenada por
   modificación: nombre, «hace 2 h», `262 cosas · 36 OPDs`. Filtro de texto. Acciones por fila
   (iconos con nombre accesible y menú `⋯`): **Abrir** (clic en la fila). **Renombrar** (`F2` o
   `⋯ › Renombrar`: edición en línea; cambia `modelo.nombre` vía `PUT` con CAS; el id y el archivo
   no cambian). **Descargar** (`⋯ › Descargar JSON`: `GET /api/modelos/:id?descargar=1`, el
   documento canónico tal cual, `<nombre>.opforja.json`). **Eliminar** → Decisión «Mover *X* a la papelera»
   → fila a papelera; «Papelera (N)» lista con **Restaurar** y **Eliminar definitivamente**.
   **Nuevo** → pide nombre en línea → crea (`m-…`, SD vacío) → abre.
   **Importar** (botón o soltar archivo): `.json` ⇒ `importarV0` en el cliente; `.md`/`.txt` ⇒ OPL
   de modelo completo (§5.6) sobre modelo vacío; se abre **Informe de importación**: resumen
   (cosas, estados, enlaces, OPDs), secciones plegables «Normalizado (N)», «Descartado (N)» (con
   «Descargar original»), «Ignorado» (conteos), «Rechazos» (si hay, sin botón de crear) y
   «Modelos extraídos (Bocetos)». «Crear modelo» → POST de cada documento → abre el principal.
3. **Crear objeto / proceso.** `O` o `P` (o clic en la paleta y clic en el lienzo): aparece la
   figura en el cursor (o al centro de la vista, en hueco libre) con el campo de nombre en foco.
   Validación en vivo contra el léxico (mensaje bajo el campo; si solo falla la mayúscula inicial,
   ofrece «↵ usar *Pedido*»). ↵ crea; ⎋ no crea nada (no hay cosas sin nombre, T-062).
   Si el nombre existe: bandeja «Ya existe **Pedido** (objeto, en SD y SD2). ↵ Traer esa misma
   cosa aquí · Tab cambiar nombre · ⎋ descartar»; si el existente es de otro tipo, solo cambiar o
   descartar (T-065, método §9.15). Dentro de un contenedor de descomposición: un proceso nuevo
   entra como subproceso en la banda bajo el cursor; un objeto, como interno.
4. **Esencia y afiliación.** Inspector: dos conmutadores «Física / Informacional», «Sistémica /
   Ambiental»; menú contextual con los mismos. El lienzo muestra sombra y dash al instante y el OPL
   la oración D1/D3 (bimodalidad activa, T-240). Volver ambiental un exhibidor propaga a sus rasgos
   con aviso «3 rasgos pasaron a ambientales (R-OBJ-6)». Pasar a informacional un objeto que es
   agente ⇒ rechazo con la regla R-AG-1 y la acción.
5. **Estados y designaciones.** Con un objeto seleccionado, `S`: cápsula fantasma con el nombre en
   foco (DECISIONS 18: un estado por gesto, siempre con nombre, sin placeholders `estado1`); ↵ la
   crea (léxico validado en vivo, T-025) y deja el objeto seleccionado; ⎋ no crea nada. Para otro
   estado, `S` de nuevo (dos estados = `S nombre ↵ S nombre ↵`). Un objeto puede tener un solo
   estado (R-OBJ-2, `s ≥ 1`; sin advertencia, CANON A-14). Doble clic o `F2` en una cápsula renombra. Arrastrar
   una cápsula a izquierda/derecha la reordena (cambia el orden del modelo). Clic derecho en una
   cápsula (o inspector): «Inicial», «Final», «Por defecto», «Current» (casillas; por defecto y
   current son exclusivos por objeto por construcción), «Ocultar en este OPD», «Ocultar en todos»
   (rechazado si el estado está enlazado donde se vería, LF-03), «Eliminar» (Decisión si tiene
   enlaces). El chip `⋯N` muestra ocultos; clic ⇒ «Mostrar estados ocultos».
6. **Crear enlace.** Al pasar sobre una cosa o cápsula aparece el ancla de conexión (rombo crimson,
   distinto de toda piruleta, R-DEC-2A). Arrastrar del ancla a otra cosa o cápsula: durante el
   arrastre los destinos con ≥1 tipo legal se realzan y los demás se atenúan con `×` (canal UI,
   T-253). Al soltar: **menú de tipo de enlace** con los tipos legales para ese par en ese sentido
   (orden de `MATRIZ.menu`), cada uno con su oración OPL de vista previa generada por `opl/` sobre
   el modelo hipotético (una sola fuente, sin segundo generador), los tipos ilegales atenuados con
   su motivo al pasar, y «⇄ invertir sentido». Flechas + ↵ o clic crea. Teclado: selección + `R` ⇒
   modo enlace; `Tab` recorre destinos legales; ↵ abre el menú; ⎋ cancela. Si el proceso destino
   está descompuesto, el aviso informa la migración («migrado a *Recibir*, R-DIST-1»).
7. **Control e/c.** Enlace seleccionado → inspector «Control: ninguno · evento (e) · condición (c)»;
   opciones ilegales deshabilitadas con el motivo (resultado, invocación, excepción, estructural,
   mitad escindida; `c` con multiplicidad: «combinación no disponible, DR-44»). Letra en el lienzo y
   plantilla E\*/C\* en el OPL.
8. **Etiquetas, ruta, multiplicidad.** Inspector del enlace: etiqueta (etiquetados; bidireccional
   pide etiqueta e inversa; si son iguales pasa a recíproco con aviso R-STRE-1), ruta
   (consumo/resultado), multiplicidad por extremo legal (selector `—`, `?`, `*`, `+`, con la frase
   OPL al lado: «al menos una **Olla**»). Doble clic en la etiqueta sobre el lienzo la edita en
   línea. El género de la cosa (inspector) decide `un/una`.
9. **Abanicos XOR/OR.** Seleccionar ≥2 enlaces (Mayús+clic) → menú contextual / inspector
   «Formar abanico XOR» · «Formar abanico OR» (visibles solo si `violacionesAbanico` es vacía;
   si no, deshabilitados con el motivo). Aparece el arco en el extremo común y la oración con
   `exactamente uno de` / `al menos uno de`. Clic en el arco selecciona el abanico: inspector con
   operador, ramas, «Control de todas las ramas» (solo combinaciones con plantilla) y «Disolver»
   (vuelve a AND).
10. **Descomponer y bandas.** Proceso seleccionado, `D` (o menú «Descomponer»): `descomponer`
    crea **ya** el OPD hijo con el contenedor y los externos colocados, **sin subprocesos semilla**
    (DECISIONS 18, T-062), y abre un campo de nombre dentro del contenedor, en la banda 1. Escribir
    `Recibir ↵ Validar ⇧↵ Verificar ↵ Despachar ⎋`: ↵ = banda siguiente (secuencia), ⇧↵ = misma
    banda (paralelo); cada nombre confirmado queda como fantasma con su nombre real en su banda
    (nunca un placeholder); ⎋ (o ↵ vacío) ejecuta **una** `agregarSubprocesos` con todos los
    nombres, que dispara la distribución 0→n y la escisión (aviso «consumo → *Recibir*, resultado →
    *Despachar*, TS3 escindido»). El historial funde `descomponer` y ese `agregarSubprocesos` en un
    solo paso de deshacer (mismo `gesto`). Es el renombrado encadenado de un solo gesto que
    SYNTHESIS §8-10 pide conservar, sin placeholders. ⎋ sin nombres deja la descomposición vacía:
    `refinamiento-trivial` (AP-13) advierte hasta que haya ≥2 subprocesos y el gate de export lo
    bloquea. Más subprocesos después: `P` dentro del contenedor (uno por gesto, en la banda bajo el
    cursor) o `N` con el contenedor seleccionado (reabre el campo encadenado). Reordenar: arrastrar un subproceso verticalmente
    muestra guías de banda (UI); soltar sobre una banda = paralelo, entre bandas = banda nueva;
    `[` / `]` mueve a la banda anterior/siguiente, `Mayús+[` / `Mayús+]` crea una banda nueva antes
    o después. El arrastre
    horizontal queda confinado al contenedor. El OPL (CX1/CX2/CXM) se actualiza al soltar.
11. **Desplegar por modo.** `U` (o menú «Desplegar ▸ Agregación | Exhibición | Generalización |
    Clasificación»): OPD hijo con la cosa arriba y sus hijos estructurales directos de ese modo; campo
    de nombre encadenado para refinadores nuevos (↵ siguiente, ⎋ termina), cada uno con su enlace
    estructural.
12. **Colección incompleta.** Seleccionar el triángulo (o el refinable) → inspector «Colección
    incompleta» (agregación, exhibición, generalización; nunca clasificación). Además, si un OPD
    muestra solo parte de los refinadores, la marca aparece sola en ese OPD, con la nota
    `ajuste-automatico` en Diagnóstico.
13. **Navegar el árbol.** Clic en un nodo del árbol o de la ruta; doble clic en una cosa refinada
    entra a su refinamiento (si tiene ambos, menú «Descomposición / Despliegue»); `Alt+↑` sube al
    padre; `Alt+←/→` hermano anterior/siguiente. La cámara se encuadra al entrar la primera vez y
    se restaura después.
14. **Buscar y traer.** `Ctrl+K` → escribir parte del nombre (sin distinguir mayúsculas ni
    acentos) → resultados de cosas «**Pedido** · objeto · SD, SD2» y de OPDs «SD2.1 · despliegue
    de **Pedido**», máximo 20. Cosa: «↵ Traer aquí» y «⇧↵ Ir» (navega a su primer OPD en preorden
    y la selecciona); OPD: ↵ navega. Traer crea la aparición en hueco libre del OPD
    activo (misma cosa, T-248). Los internos de otra descomposición no se pueden traer (motivo A3.3).
15. **Quitar vs eliminar.** `Supr` = quitar de este OPD: si es la última aparición o deja enlaces
    sin OPD visible, Decisión «*X* solo aparece aquí: quitarla la elimina del modelo junto con N
    enlaces [Eliminar del modelo] [Cancelar]». `Mayús+Supr` = eliminar del modelo: Decisión con lo
    que se pierde (apariciones en N OPDs, enlaces, refinamientos). Los dos textos son distintos y
    nunca se confunden (T-251).
16. **Reanclar estructurales.** Seleccionar una rama del peine: asas en ambos extremos; arrastrar
    el extremo del refinador (o del refinable) a otra cosa del mismo OPD ⇒ `reanclarEstructural`
    (valida firma y mismo tipo). Otros enlaces: eliminar y crear (conforme, R-OPD-EDIT-7).
17. **Duración.** Inspector de proceso: mín · esperada · máx · unidad (`ms…year`), validación en
    vivo (> 0, mín ≤ esperada ≤ máx); se ve `[min] {1, 3, 5}` en la elipse. Crear una excepción
    sobre una fuente sin la cota exigida abre el campo de duración con el aviso «R-EXC-2: define la
    duración máxima o se usará “su duración máxima”» (canónico condicionado: pide el dato o
    advierte, nunca inventa).
18. **Editar OPL y aplicar.** Panel OPL → «Editar» (`Ctrl+E`): el bloque del OPD activo en texto;
    canaleta con estado por línea y resumen; «Aplicar 2 cambios» (§5.7). Tras aplicar, el lienzo
    muestra lo nuevo y el editor regenera el texto canónico; reabrirlo sin tocar muestra «Sin
    cambios aplicables» (nunca cambios fantasma).
19. **Hover y clic bimodal.** Pasar sobre un token del OPL realza su elemento en el lienzo (fondo
    `paperWarm` en la capa UI) y viceversa (pasar sobre una cosa realza sus tokens y líneas), por
    `Ref`, nunca por texto (T-242). Clic en un token selecciona y centra el elemento (navegando a
    su OPD si es de otro bloque) sin mutar (T-243). «Filtrar por selección» en el panel muestra
    solo las líneas con refs de la selección (enlace antes que cosa, T-244).
20. **Diagnóstico.** Pestaña con contador; grupos Bloqueos (error) · Advertencias · Notas; cada
    ítem: mensaje, regla, acción canónica, «Ir» (navega y selecciona). El lienzo queda limpio.
21. **Exportar.** `Exportar ▾`: «Diagrama SVG de SD1 (canon-diagrama)», «Documento HTML
    (canon-documento)», «OPL Markdown», «Modelo JSON». Con gate: ítem deshabilitado y motivos
    («SD1 tiene 1 subproceso (AP-13) · Ir»). Tras exportar, aviso con advertencias de cruces.
22. **Deshacer/rehacer.** `Ctrl+Z` / `Ctrl+Mayús+Z` (o `Ctrl+Y`), 200 pasos por sesión de modelo;
    cada operación, cada «Aplicar» del OPL y cada descomposición con nombres encadenados es un paso.
23. **Guardado y conflicto.** Indicador: «Guardado» · «Cambios sin guardar» (durante la espera de
    1,5 s) · «Guardando…» · «Sin conexión: cambios guardados en este navegador» · «Conflicto».
    `Ctrl+S` guarda ya. Conflicto (412): Decisión «El modelo cambió en otra pestaña o dispositivo.
    [Cargar la versión del servidor] [Conservar la mía (sobrescribir)] [Descargar la mía]». Al abrir
    con un borrador local más nuevo: Decisión «Hay cambios de este navegador sin subir (hace 3 min).
    [Recuperarlos] [Descartarlos] [Descargar]».
24. **Selección múltiple** (DECISIONS 22, mínima, sin portapapeles). `Mayús+clic` agrega o quita
    una cosa o un enlace de la selección; `⎋` o clic en vacío la limpia. Con ≥2 cosas: arrastrar
    cualquiera mueve todas (una operación `moverApariciones`, un paso de deshacer; subprocesos solo
    horizontal, P6); flechas mueven todas. `Supr` quita todas de este OPD (una sola Decisión que
    suma lo que se perdería); `Mayús+Supr` las elimina del modelo (una Decisión). Con ≥2 enlaces:
    «Formar abanico XOR/OR» (flujo 9) y `Supr`. El inspector muestra «N elementos» con solo esas
    acciones. No hay alinear, distribuir, copiar ni pegar.
25. **Enlaces de una cosa** (reemplaza la tabla de enlaces, DECISIONS 10). El inspector de cosa
    termina con la sección «Enlaces (N)»: una fila por enlace con tipo, otro extremo, estado y
    los OPDs donde se ve (`SD, SD1`), agrupados como el OPL (procedimentales, estructurales).
    Clic en la fila selecciona el enlace (navega si no es visible aquí); `Supr` en la fila lo
    elimina con Decisión. Es la respuesta al riesgo SYNTHESIS §8-7 sin una superficie más.

### 7.4 Atajos (registro único `editor/comandos.ts`; la Ayuda los lista)

| Tecla | Acción | Tecla | Acción |
|---|---|---|---|
| `O` / `P` | crear objeto / proceso | `S` | estado en el objeto seleccionado |
| `R` | modo enlace desde la selección | `D` / `U` | descomponer / desplegar |
| `↵` / `F2` | renombrar selección | `Supr` / `Mayús+Supr` | quitar de este OPD / eliminar del modelo |
| `Ctrl+K` | buscar cosa u OPD: ir / traer | `Ctrl+E` | editar OPL del OPD activo |
| `Ctrl+Z` / `Ctrl+Mayús+Z` | deshacer / rehacer | `Ctrl+S` | guardar ahora |
| `Alt+↑` / `Alt+←→` | OPD padre / hermanos | `[` `]` / `Mayús+[` `Mayús+]` | subproceso a banda anterior/siguiente / a banda nueva |
| `N` | nombres encadenados en el contenedor o refinable seleccionado (subprocesos / refinadores) | `Mayús+clic` | agregar/quitar de la selección |
| `Ctrl+0` / `+` / `−` | encuadrar / zoom | `Espacio`+arrastre | desplazar |
| flechas / `Mayús`+flechas | mover 1 / 10 px | `Tab` (modo enlace) | siguiente destino legal |
| `Ctrl+\` / `Ctrl+.` / `Ctrl+Mayús+M` | plegar izquierda / derecha / solo lienzo | `Mayús+G` | cuadrícula |
| `?` | ayuda | `⎋` | cancelar gesto / cerrar |

Letras solas solo actúan con el foco en el lienzo; en campos de texto nunca (corrige el secuestro
de `Supr` del inspector actual). Sin atajos que el navegador reserva (`Ctrl+W/T/N/Tab/1…9`).
Rueda: desplazar; `Ctrl`+rueda: zoom multiplicativo 10 % anclado al cursor (0,2–3); el lienzo
anula el gesto «atrás» del trackpad (`overscroll-behavior: none`).

### 7.5 Estado vacío y errores

- OPD vacío: al centro, «Crea un objeto (O) o un proceso (P)» con los dos botones. Nada más (no
  hay asistente ni pregunta metodológica: el método no se impone a la UI, A1.1).
- Modelo nuevo: SD vacío; la pestaña Diagnóstico muestra 0.
- Errores de operación: aviso de una línea con regla y acción (P7). Errores de red: el indicador
  pasa a «Sin conexión» y el trabajo sigue (borrador local). Error inesperado de render de un OPD:
  el lienzo muestra «No se pudo dibujar este OPD» con «Copiar detalle» y el resto de la app sigue
  (límite de error por panel).
- Accesibilidad: cada cosa del lienzo es enfocable (`Tab` en orden de nombre, `role="img"`,
  `aria-label="Objeto Pedido, físico"`); foco visible en crimson; `prefers-reduced-motion`
  respetado; contraste AA en la UI.

---

## 8. Persistencia y servidor

Un proceso `Bun.serve` en el puerto 8080 sirve la SPA estática y la API. Sin PostgreSQL, sin
nginx, sin dependencias de servidor. `servidor/` importa solo `codec/` (y transitivamente
`nucleo/`).

### 8.1 Rutas HTTP exactas

Todas las respuestas JSON llevan `Content-Type: application/json; charset=utf-8` y
`Cache-Control: no-store`. Error: `{ "error": string, "detalle"?: unknown }`. En la columna
Auth, **sesión** = cookie de sesión válida **o** `Authorization: Bearer <OPFORJA_TOKEN>` (§8.2);
«+ CSRF» aplica solo a la cookie. Esta API más el JSON v0 es el **contrato externo completo**
(DECISIONS 13): un agente externo lee y escribe modelos con el token por estas mismas rutas; no
hay CLI `mesa` ni protocolo de testigo.

| Método y ruta | Auth | Petición | Respuestas |
|---|---|---|---|
| `GET /salud` | no | — | `200 {"ok":true,"version":"<sha>"}` |
| `GET /api/sesion` | sesión | — | `200 {"email"}` · `401` |
| `POST /api/sesion` | no | `{"email","clave"}` (≤ 4 KB) | `204` + `Set-Cookie` · `401 {"error":"Credenciales inválidas"}` · `429 {"error":"Demasiados intentos","reintentarEn":s}` |
| `DELETE /api/sesion` | cookie + CSRF | — | `204` (borra la cookie; con Bearer ⇒ `400`) |
| `GET /api/modelos` | sesión | — | `200 {"modelos":[{"id","nombre","modificado","rev","bytes","cosas","opds"}]}` (orden: `modificado` desc) |
| `POST /api/modelos` | sesión + CSRF | cuerpo = documento v0 (canónico o canonicalizable, ver abajo); `?aceptarPerdidas=1` opcional | `201 {"id","rev","canonicalizado"?,"informe"?}` · `400 {"error":"Documento inválido","informe"}` (rechazos) · `409` (id existe) · `413` · `422 {"error":"El documento pierde información al importarse","informe"}` |
| `GET /api/modelos/:id` | sesión | `?descargar=1` opcional | `200` cuerpo = documento, cabecera `ETag: "<rev>"`; con `descargar=1` además `Content-Disposition: attachment; filename="<nombre saneado>.opforja.json"` (Biblioteca › Descargar) · `404` |
| `PUT /api/modelos/:id` | sesión + CSRF | cabecera `If-Match: "<rev>"` (obligatoria); cuerpo = documento v0 con `modelo.id === :id`; `?aceptarPerdidas=1` opcional | `200 {"rev","canonicalizado"?,"informe"?}` · `400` · `404` · `412 {"error":"Revisión desactualizada","rev":"<actual>"}` · `413` · `422` · `428` (sin If-Match) |
| `DELETE /api/modelos/:id` | sesión + CSRF | `If-Match` opcional | `204` (a papelera) · `404` · `412` |
| `GET /api/papelera` | sesión | — | `200 {"entradas":[{"entrada","id","nombre","eliminado"}]}` |
| `POST /api/papelera/:entrada/restaurar` | sesión + CSRF | — | `201 {"id","rev"}` (si el id está ocupado, se asigna `m-…` nuevo y se reescribe `modelo.id`) · `404` |
| `DELETE /api/papelera/:entrada` | sesión + CSRF | — | `204` (definitivo; borra también `previas/<id>/`) |
| `GET /*` | no | — | estáticos de `web/`; SPA: toda ruta sin extensión ⇒ `index.html` (`no-store`); `/assets/*` inmutables 1 año |

- `rev` = SHA-256 hexadecimal del texto almacenado (CAS por contenido: no hay contadores).
- Renombrar desde la Biblioteca no tiene ruta propia: el cliente hace `GET`, `renombrarModelo`,
  `exportarV0` y `PUT` con `If-Match` (una sola vía de escritura, siempre canónica).
- **El almacén solo guarda documentos canónicos.** Cuerpo recibido: (1) si `leerCanonico` lo
  acepta ⇒ se guardan los bytes recibidos (camino del cliente web, que siempre envía
  `exportarV0`); (2) si no, `importarV0`: con `rechazos` o `extraidos` ⇒ `400`/`422`; con
  `descartado` no vacío ⇒ `422` con el informe, salvo `?aceptarPerdidas=1`; si no ⇒ se guarda
  `exportarV0(modelo)` y la respuesta lleva `"canonicalizado": true`, la `rev` de lo guardado y el
  informe (`normalizado`, `ignorado`, `visibilidad`). Así un agente externo con el token puede
  escribir un v0 válido sin reproducir el formateo exacto, y ninguna pérdida ocurre en silencio
  (DECISIONS 12–13). Tras un `canonicalizado`, el llamador relee con `GET` para obtener el texto.
- Límites: cuerpo ≤ 25 MB (413); ≤ 2 000 modelos (507); nombre de modelo ≤ 200 caracteres.
- Cabeceras de seguridad en toda respuesta: `Content-Security-Policy: default-src 'self';
  img-src 'self' data: blob:; style-src 'self'; font-src 'self'; connect-src 'self';
  object-src 'none'; base-uri 'none'; frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: no-referrer`, `Permissions-Policy` restrictiva (HSTS lo pone Traefik).

### 8.2 Autenticación de una cuenta

- **Cuenta**: `/datos/cuenta.json` = `{"email", "hashClave", "versionCredencial"}` con
  `hashClave` en formato `scrypt$16384$8$1$<sal>$<hash>` (porte exacto de `passwordHash.ts`, así la
  migración copia el hash actual sin pedir la clave).
- **CLI** (`servidor/cuenta.ts`, en el contenedor):
  `bun servidor/cuenta.js crear <email>` (clave por stdin dos veces, ≥ 10 caracteres; falla si ya
  existe cuenta) · `clave` (cambia la clave y sube `versionCredencial`, cerrando sesiones) ·
  `cerrar-sesiones` (sube `versionCredencial`).
- **Sesión**: cookie `opforja_sesion=<b64url({"v":versionCredencial,"exp":epoch})>.<b64url(HMAC-SHA256)>`,
  `HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000` (30 días; `Secure` se omite solo en
  `localhost`). Secreto `OPFORJA_SECRETO` (≥ 32 caracteres; el proceso no arranca sin él).
  Verificación en tiempo constante; `v` distinto del de la cuenta ⇒ 401.
- **Login**: siempre se verifica contra un hash (el de la cuenta o un señuelo) para igualar costo;
  respuesta uniforme. Límite: 5 fallos por IP (desde `X-Forwarded-For` de Traefik) en 15 min ⇒
  429 durante 15 min; 20 fallos globales en 15 min ⇒ 429 global.
- **CSRF**: toda petición que muta **con cookie** exige cabecera `X-Opforja: 1` (fuerza preflight
  entre orígenes) y, si viene `Origin`, que coincida con el host; si no ⇒ 403. `SameSite=Strict` y
  la CSP `connect-src 'self'` completan la defensa.
- **Token Bearer opcional** (DECISIONS 13): variable de entorno `OPFORJA_TOKEN`. Ausente ⇒ toda
  cabecera `Authorization` se responde `401`. Presente ⇒ debe tener ≥ 48 caracteres (si no, el
  proceso no arranca). `Authorization: Bearer <t>` se compara en tiempo constante
  (`timingSafeEqual(sha256(t), sha256(OPFORJA_TOKEN))`); válido ⇒ la petición actúa como la
  cuenta en `/api/modelos*` y `/api/papelera*` (no requiere CSRF: no es una credencial ambiente
  del navegador). No sirve para `POST/DELETE /api/sesion` ni para cambiar la clave. Los fallos
  cuentan para el límite de intentos. Rotar = cambiar `.env` y `./deploy/deploy.sh`. El token
  nunca aparece en el log (se registra `auth: "bearer"`).

### 8.3 Almacenamiento en archivos (`servidor/almacen.ts`)

```
/datos/                             (volumen Docker opforja-datos)
├── cuenta.json
├── modelos/<id>.json               documento canónico v0 (nombre de archivo == modelo.id)
├── previas/<id>/<ISO-8601>--<rev8>.json   copias previas rotadas (sin UI, DECISIONS 6)
├── papelera/<id>--<ISO-8601>.json  eliminados (purga automática > 30 días, al arrancar y cada 24 h)
└── archivo/migracion-<fecha>/      solo tras la migración (§8.6); no lo lee la app
```

- **Escritura atómica**: `modelos/.tmp-<id>-<aleatorio>` → `write` + `fsync` → `rename` sobre
  `<id>.json` → `fsync` del directorio. Nunca queda un archivo a medias.
- **CAS**: bajo un mutex por id (cadena de promesas en memoria; un solo proceso): leer, calcular
  `rev` actual, comparar con `If-Match`, escribir. Distinto ⇒ 412 con la `rev` vigente.
- **Copias previas** (DECISIONS 6: robustez sin versiones en la UI): dentro del mismo mutex y
  **antes** del `rename`, si la copia más reciente de `previas/<id>/` tiene más de
  `OPFORJA_PREVIAS_MIN` = 10 minutos (o no existe), el archivo vigente se enlaza (`link`, sin
  copiar bytes; `copyFile` si el enlace falla) como `previas/<id>/<fecha>--<rev8>.json`. Se
  conservan las `OPFORJA_PREVIAS` = 30 más recientes (se borran las demás en la misma operación).
  El umbral de 10 min evita que el autoguardado (cada 1,5 s) agote la rotación en un minuto: 30
  copias cubren ≥ 5 h de edición continua y, con pausas, días. Recuperar (operador, documentado en
  `docs/operacion.md`): `docker cp opforja:/datos/previas/<id>/<archivo> .` e **Importar** en la
  Biblioteca (crea un modelo nuevo; nada se sobrescribe), o `PUT` con el token. Las previas son
  documentos canónicos: `leerCanonico` las acepta.
- **Índice**: en memoria, construido al arrancar leyendo cada `modelos/*.json` (parseo JSON y
  conteo de cosas y OPDs; sin validar el códec completo) y actualizado en cada escritura. Es
  derivado: si se borra el proceso, se reconstruye. Un archivo que no parsea se mueve a
  `archivo/invalidos/` y se registra en el log.
- **Log**: una línea JSON por petición (`metodo`, `ruta` sin cuerpo, `estado`, `ms`) y por evento
  de almacén; nunca contenido de modelos ni claves.

### 8.4 Cliente: autoguardado, borrador y conflictos (`editor/guardado.ts`)

- Cada operación confirmada marca «Cambios sin guardar», escribe el **borrador** en IndexedDB
  (`opforja/borradores/<id>` = `{base: rev, documento, fecha}`, con intervalo mínimo de 500 ms) y
  programa el guardado a 1,5 s del último cambio (máximo 10 s de edición continua sin guardar).
- Guardar = `PUT` con `If-Match: rev` y el cuerpo `exportarV0(modelo)`; éxito ⇒ nueva `rev`,
  borrador eliminado si coincide con lo guardado, «Guardado». Un guardado en curso a la vez; los
  cambios intermedios se acumulan en el siguiente.
- Red caída o 5xx ⇒ «Sin conexión»: reintento con espera exponencial (2 s … 60 s); el borrador
  conserva todo. `beforeunload` avisa si hay cambios sin subir.
- 412 ⇒ «Conflicto»: se detiene el autoguardado y se abre Decisión (§7.3-23). «Cargar la del
  servidor» descarga el borrador como archivo antes de reemplazar; «Conservar la mía» reintenta con
  la `rev` recibida en el 412 (sobrescritura explícita).
- Al abrir un modelo: `GET` + `leerCanonico`; si hay borrador con `base === rev` del servidor y
  documento distinto ⇒ Decisión «Recuperar cambios de este navegador»; si `base ≠ rev` ⇒ misma
  Decisión con aviso de que el servidor cambió (recuperar = sobrescribir).
- Un solo modelo abierto por pestaña; varias pestañas quedan protegidas por el CAS.

### 8.5 Límites de tamaño y rendimiento

Documento ≤ 25 MB (el modelo HODOM de referencia pesa < 1 MB). En el cliente, `exportarV0` de
un modelo de 262 cosas y 433 enlaces < 20 ms; generación OPL completa < 30 ms; escena de un OPD de
60 cosas < 10 ms (presupuestos verificados en `rendimiento.test.ts` con el modelo sintético).

### 8.6 Migración única desde PostgreSQL (`servidor/migrar-postgres.ts`)

Uso (dentro de la imagen nueva, conectada a la red del stack viejo):
`bun servidor/migrar-postgres.js --url <DATABASE_URL> [--email <correo>] [--datos /datos] [--ensayo] [--reemplazar]`,
y `bun servidor/migrar-postgres.js --verificar [--datos /datos]` (relee cada `modelos/*.json` con
`leerCanonico` y termina con código ≠ 0 si alguno falla).
Usa el cliente PostgreSQL integrado de Bun (`import { SQL } from "bun"`), sin dependencias. La
lectura va detrás de una interfaz `FuenteLegada` (inyectable en pruebas con filas falsas).

1. **Cuenta**: `SELECT id, email, password_hash FROM opforja_accounts` (si hay varias, exige
   `--email`); tenants: `SELECT tenant_id FROM opforja_account_tenants WHERE account_id = $1`.
   Escribe `cuenta.json` con el mismo `password_hash` y `versionCredencial: 1`.
2. **Índice viejo**: `SELECT indice FROM opforja_workspaces WHERE tenant_id = ANY($1)` (carpetas,
   `esApunte`, `esBiblioteca`, `archivado` por modelo), solo para el informe.
3. **Modelos**: `SELECT id, nombre, carpeta_id, actualizado_en, archivado, revision,
   payload::text FROM opforja_models WHERE tenant_id = ANY($1)`; autosaves:
   `SELECT modelo_id, creado_en, payload::text FROM opforja_model_autosaves WHERE tenant_id = ANY($1)`.
   Fuente de cada modelo: el autosave si `creado_en > actualizado_en` (ley v0 del testigo), si no
   el guardado; el otro va a `archivo/…/originales/`.
4. Por modelo: `importarV0(fuente)`; `modelo.id` := id del registro (saneado a
   `[A-Za-z0-9._-]`); `modelo.nombre` := `nombre` del registro (si difiere del payload, se informa);
   escribe `modelos/<id>.json` con `exportarV0` (o `papelera/` si `archivado`); cada boceto
   extraído ⇒ `modelos/<id>--boceto-<n>.json`; rechazo ⇒ `archivo/…/rechazados/<id>.json` (payload
   original) + causas en el informe. El payload original siempre se copia a
   `archivo/…/originales/<id>.json`.
5. **Versiones**: `SELECT modelo_id, id, nombre, creado_en, payload::text FROM
   opforja_model_versions WHERE tenant_id = ANY($1)` ⇒ `archivo/…/versiones/<modelo>/<id>.json`
   tal cual (recuperables a mano; no son un concepto del producto).
6. **Informes** (DECISIONS 12: nada se pierde en silencio). Por modelo,
   `archivo/migracion-<fecha>/informes/<id>.md`: nombre, carpeta y especie viejas (`esApunte`,
   `esBiblioteca`), fuente (guardado/autosave), conteos antes/después (cosas, estados, enlaces,
   abanicos, OPDs), el `Informe` completo del códec (normalizado, descartado —cada campo no
   representado con su ruta—, ignorado, rechazos) y el **diff de visibilidad por OPD**
   (`informe.visibilidad`: enlaces y abanicos que aparecen o desaparecen de cada OPD al derivar la
   vista, riesgo §8-21). Índice `archivo/migracion-<fecha>/INFORME.md`: totales, tabla de modelos
   con enlace a su informe, rechazados y bocetos extraídos. `--ensayo` escribe los mismos informes
   en `--salida <dir>` (por defecto stdout el índice) sin tocar `modelos/`.
7. Tablas del agente, revisión compartida y captura de bugs no se migran (fuera de alcance); quedan
   intactas en el volumen PostgreSQL.
8. Seguridad: se niega a escribir si `modelos/` no está vacío (salvo `--reemplazar`); nunca
   escribe en PostgreSQL (solo `SELECT`).

### 8.7 Respaldo

`deploy/respaldo.sh`: `docker run --rm -v opforja-datos:/datos:ro -v "$DESTINO":/respaldo
alpine tar czf /respaldo/opforja-$(date +%F).tgz -C /datos .`, retención 14 días, `umask 077`;
temporizador systemd diario 03:30 (`deploy/systemd/opforja-respaldo.timer`, ruta del repo como
parámetro `%h`-independiente vía `Environment=OPFORJA_REPO=`). Restaurar = detener, `tar xzf` en
el volumen, arrancar. Los archivos son JSON legibles: un modelo se recupera también a mano.

---

## 9. Despliegue (no se despliega en esta tarea)

### 9.1 `Dockerfile`

```dockerfile
FROM oven/bun:1.3 AS construccion
WORKDIR /src/app
COPY app/package.json app/bun.lock app/bunfig.toml ./
RUN bun install --frozen-lockfile
COPY app/ ./
ARG OPFORJA_VERSION=local
ENV OPFORJA_VERSION=$OPFORJA_VERSION
# vite build ⇒ dist/ (la versión se incrusta en el bundle); bun build ⇒ dist-servidor/
RUN bun run build

FROM oven/bun:1.3-slim
WORKDIR /opt/opforja
COPY --from=construccion /src/app/dist ./web
COPY --from=construccion /src/app/dist-servidor ./servidor
ENV OPFORJA_DATOS=/datos PORT=8080 NODE_ENV=production
RUN mkdir -p /datos && chown bun:bun /datos
USER bun
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD bun -e "fetch('http://127.0.0.1:8080/salud').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"
CMD ["bun", "servidor/principal.js"]
```

`bun run build` = `vite build && bun build servidor/principal.ts servidor/cuenta.ts
servidor/migrar-postgres.ts --target=bun --outdir dist-servidor`. La imagen de ejecución no
contiene fuentes, pruebas ni `node_modules`.

### 9.2 `docker-compose.yml`

```yaml
services:
  opforja:
    build:
      context: .
      args:
        OPFORJA_VERSION: ${OPFORJA_BUILD:-local}
    image: opforja:latest
    container_name: opforja
    restart: unless-stopped
    environment:
      OPFORJA_SECRETO: ${OPFORJA_SECRETO:?OPFORJA_SECRETO requerido (.env junto al compose)}
      OPFORJA_TOKEN: ${OPFORJA_TOKEN:-}          # opcional: acceso Bearer para agentes externos
    volumes:
      - opforja-datos:/datos
    networks: [web]
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=web"
      - "traefik.http.routers.opforja.rule=Host(`opforja.sanixai.com`)"
      - "traefik.http.routers.opforja.entrypoints=websecure"
      - "traefik.http.routers.opforja.tls.certresolver=myresolver"
      - "traefik.http.routers.opforja.middlewares=opforja-hsts@docker"
      - "traefik.http.middlewares.opforja-hsts.headers.stsSeconds=63072000"
      - "traefik.http.middlewares.opforja-hsts.headers.stsIncludeSubdomains=true"
      - "traefik.http.services.opforja.loadbalancer.server.port=8080"
volumes:
  opforja-datos:
networks:
  web:
    external: true
```

Un servicio, un volumen. El resto de cabeceras (CSP, nosniff, referrer, frame) las pone el
servidor (una sola fuente, probada en `servidor/principal.test.ts`).

### 9.3 `deploy/deploy.sh` (único circuito, adaptado)

```bash
#!/usr/bin/env bash
# Circuito canónico: construir, esperar salud y comprobar la versión servida.
set -euo pipefail
cd "$(dirname "$0")/.."
command -v curl >/dev/null || { echo "ERROR: curl es necesario" >&2; exit 1; }
SHA="$(git rev-parse --short HEAD)"
[ -z "$(git status --porcelain --untracked-files=all)" ] || { SHA="${SHA}-dirty"; echo "→ árbol con cambios: build ${SHA}"; }
URL="${OPFORJA_URL:-https://opforja.sanixai.com}"; URL="${URL%/}"
echo "→ desplegando opforja · build ${SHA}"
OPFORJA_BUILD="$SHA" docker compose up -d --build --wait --wait-timeout 120 --remove-orphans
echo "→ comprobando salud, acceso y versión"
SALUD="$(curl -fsS --retry 5 --retry-delay 2 --max-time 15 "$URL/salud")"
echo "$SALUD" | grep -Fq "\"version\":\"${SHA}\"" || { echo "ERROR: /salud no informa ${SHA}: ${SALUD}" >&2; exit 1; }
ESTADO="$(curl -sS --max-time 15 -o /dev/null -w '%{http_code}' "$URL/api/sesion")"
[ "$ESTADO" = "401" ] || { echo "ERROR: se esperaba 401 sin sesión; recibido ${ESTADO}" >&2; exit 1; }
curl -fsS --max-time 15 "$URL/" | grep -Fq '<div id="app"' || { echo "ERROR: / no sirve la aplicación" >&2; exit 1; }
echo "✓ opforja ${SHA} disponible en ${URL}"
```

`--remove-orphans` retira los contenedores del stack viejo (`opforja-model-api`,
`opforja-postgres`, `opforja-bug-capture`) sin tocar volúmenes. `deploy/deploy.test.ts` (stubs de
`git`, `docker`, `curl`) conserva la verificación del circuito: `--wait`, versión en `/salud`, 401
en `/api/sesion`, marca `-dirty`.

### 9.4 Transición desde el stack actual

Precondición: el commit nuevo en `main` y `.env` con `OPFORJA_SECRETO` (≥ 32 caracteres).

1. **Congelar**: avisar al operador; no editar en la instancia vieja desde aquí.
2. **Respaldo PostgreSQL** con el script viejo, desde el tag anterior:
   `git worktree add ../opforja-viejo <tag-anterior> && ../opforja-viejo/deploy/backup-opforja-db.sh`
   (volcado `pg_dump` comprimido).
3. **Construir la imagen nueva** sin arrancarla: `OPFORJA_BUILD=$(git rev-parse --short HEAD) docker compose build`.
4. **Ensayo de migración** contra el PostgreSQL vivo, en la red interna vieja:
   `docker run --rm --network deep-opm-pro_opforja-internal -v opforja-datos:/datos
   opforja:latest bun servidor/migrar-postgres.js --url
   postgres://opforja:$OPFORJA_DB_PASSWORD@postgres:5432/opforja --ensayo > informe-ensayo.md`.
   Revisar el informe con el operador (nombres normalizados, descartados, rechazados, bocetos
   extraídos).
5. **Migración real**: mismo comando sin `--ensayo`; verificar `archivo/migracion-*/INFORME.md` y
   que `docker run --rm -v opforja-datos:/datos opforja:latest bun servidor/migrar-postgres.js
   --verificar` (relee cada `modelos/*.json` con `leerCanonico`) termina sin errores.
6. **Desplegar**: `./deploy/deploy.sh`. Humo manual: entrar, abrir tres modelos grandes, comparar
   conteos de cosas/enlaces/OPDs con el informe, editar y ver «Guardado».
7. El volumen `opforja-postgres-data` **se conserva sin montar** (no se ejecuta `docker compose
   down -v` ni `docker volume rm`); se retira solo por decisión explícita del dueño tras un periodo
   de confianza.

**Rollback**: `git checkout <tag-anterior> && ./deploy/deploy.sh` levanta el stack viejo con su
volumen PostgreSQL intacto (estado al congelar). Los cambios hechos en la versión nueva se llevan
exportando el JSON desde la nueva (el importador viejo rechaza la multiplicidad `?` y los objetos
con un solo estado; se documenta en `docs/operacion.md`).

---

## 10. Verificación

### 10.1 Pirámide y comandos

| Comando (desde `app/`) | Qué corre | Tiempo objetivo |
|---|---|---|
| `bun run check` (por defecto, AGENTS.md) | `tsc --noEmit` (src, servidor, e2e, herramientas; tsconfig estricto actual: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`…) + `bun test` (núcleo, códec, OPL, OPD con golden SVG, editor, servidor, arquitectura) | < 40 s |
| `bun run e2e` | `bun run build` + Playwright contra el servidor real con un directorio de datos temporal | < 4 min |
| `bun run build` | vite + bun build del servidor | < 30 s |
| `bun run golden` | reescribe `opd/__golden__/*.svg` (solo tras revisar visualmente el cambio) | < 5 s |
| `bun test ../deploy` | `deploy.test.ts` (solo al tocar `deploy/`) | < 5 s |

Convenciones: sin estado global de módulo (almacén y cliente por fábrica: `crearAlmacen()`,
`crearCliente(fetch)`), cada prueba construye su modelo con `pruebas/constructores.ts`
(`modeloCon({objetos:['Alfa'], procesos:['Beta'], enlaces:[['consumo','Alfa','Beta']]})` y `must()`
únicos). Cada ley lleva su **control de no tautología** (un mutante que debe ponerla roja) como en
`leyes/` actual. `validarForma` corre en `afterEach` de las suites del núcleo. Gates del Anexo A
(T-303) → suites: Identidad (codec, forma), Firma (matriz), Estado (estados, forma), OPL
(generar, roundtrip), Parseo (analizar, editor-opl), Modificadores (matriz, roundtrip-matriz),
Refinamiento (refinamiento, proyeccion, frontera), Distribución (refinamiento), UI (exportar,
golden, e2e-19), Export (exportar), Deuda (revisión del diff de `docs/conformidad.md`, §1.5).

### 10.2 Unitarias del núcleo y la matriz

- `matriz.test.ts`: una tabla de casos por fila de CANON §2.1 y por regla transversal (legal /
  ilegal con la regla esperada): 15 tipos × categorías de extremo × estados × control × abanico ×
  multiplicidad × ruta; AP-01…AP-30 aplicables; `tiposLegales` para 12 pares típicos (objeto
  informacional→proceso no ofrece agente; objeto sin estados no ofrece efecto T3; estado inicial
  no ofrece resultado; proceso→proceso ofrece invocación y excepciones; etc.); unicidad con lectura
  distributiva; doble vara; AP-27 bloqueo vs advertencia; `NO_OFRECIDO`.
- `forma.test.ts`: cada invariante de §3.2 con un modelo que lo viola ⇒ la violación esperada.
- `cosas.test.ts`, `estados.test.ts`, `enlaces.test.ts`, `abanicos.test.ts`: cada operación de
  §4.2: éxito, rechazo con regla, trazas (propagación de afiliación, des-supresión, disolución de
  abanico), identidad de ids y un paso de deshacer.
- `refinamiento.test.ts`: descomponer (externos copiados, contenedor, R-HIJO-5, ciclo); tabla de
  distribución §4.5.3 fila por fila con |S| = 0, 1, ≥2; enlace tardío recursivo; escisión con
  ids; `moverSubproceso` sin migración; `desplegar` por cada modo (R-HIJO-4); eliminar refinamiento
  (hoja, cascada, materialización, `precedencia-invalida` no materializada); rebote de externo.
- `proyeccion.test.ts`: visibilidad en raíz/descomposición/despliegue; abstracción; los 12 niveles
  de fuerza; matriz 3×3 completa (incluidos Inválido y R+C); fusión de efectos por banda;
  R-VIS-HIJO-1; abanico colapsado; etiquetas `SDx.y` y su mutación al eliminar un hermano.
- `frontera.test.ts` (T-089): ley de firma de frontera con implementación independiente y mutantes.
- `diagnostico.test.ts`: cada código del catálogo con un caso positivo y uno negativo; gates.
- `lexico.test.ts`, `herencia.test.ts`, `rendimiento.test.ts` (presupuestos §8.5).

### 10.3 OPL

- `vocabulario.test.ts`: vocabulario cerrado ⇔ literales de `PLANTILLAS`; `y/e`, `o/u`
  (`Ignacio`, `hielo`, `Hierro`, `oro`, `hora`); listas sin coma de Oxford; frases de
  multiplicidad por género; unidades en singular/plural.
- `plantillas.test.ts`: por plantilla, `hacia(desde(h)) = h`; cada `MATRIZ[t].plantillas` existe.
- `generar.test.ts`: orden de secciones y empates; mención mínima; D6; D10 en una oración;
  agrupación estructural solo fuera de hijos; SE3 en dos líneas; CX con `así como`; plegado del
  padre; tokens/refs/hechos por sub-span; display `siempre`/`oculta` sin tocar el canónico.
- `analizar.test.ts`: normalización (NFC, espacios, viñetas), spans, sufijo ` proceso`, plegado de
  multiplicidad y estados, listas mixtas CX, mayúscula inicial, residual SE1, par SE3, `Current`
  literal, cada entrada de `NO_SOPORTADAS` ⇒ `unsupported-canonical` sin mutar y de
  `NO_CANONIZADAS` ⇒ `non-canonical`; D1–D4, R-ENT-3, COND-ALT, TS4/TS5 standalone, FAN-5B.
- `editor-opl.test.ts`: 4 estados con su precedencia; las 8 razones; resumen y rótulo del botón;
  todo-o-nada con abortos a mitad; 3 fases; creación idempotente; `no-delete-by-absence`; preview
  puro; reordenar líneas; línea abstraída del padre ⇒ sin-cambio (T-168); `SDx.y` ⇒ id;
  DR-35 (miembro ajeno ⇒ `referencia-ambigua`); ley de deshacer atómico.
- `roundtrip-matriz.test.ts` (§5.8-2), `roundtrip-tabla92.test.ts` (§5.8-3),
  `roundtrip-modelos.test.ts` (§5.8-4), `composicion.test.ts` (§5.8-5), `lente.test.ts` (§5.8-6).

### 10.4 Códec sobre `app/fixtures/v0/*.json` (ex `fixtures/demo-models`)

- `codec.test.ts`: una prueba por regla de §3.4.2 con un mini documento (extremo string/objeto;
  estado como extremo en consumo/resultado/agente/instrumento/etiquetado; TS3 compacto; par
  escindido; standalone; efecto `O→P`; par consumo+resultado ⇒ TS3; refinamiento legacy;
  descomposición de objeto ⇒ despliegue; ambas ranuras al mismo OPD ⇒ rechazo; boceto extraído;
  vista descartada; `ordenInzoom` ausente ⇒ bandas por geometría; internos por contexto y por
  geometría; aparición duplicada; cosa sin aparición; abanico con `puertoComun` y con solo
  `puertoEntidadId`; `O`/`XOR`; abanico de <2 ramas; enlace en dos abanicos; designaciones
  duplicadas y `esInicial` vs `designaciones`; dos `default`; multiplicidades (`?`, `0..1`, `*`,
  `1..N`, `2..*`); `modificador` y `subtipoModificador`; negación descartada; `derivado` automático
  y manual por tipo; `excepcionSubSobretiempo`; cotas de excepción ⇒ duración; bidireccional con
  etiquetas iguales ⇒ recíproco; una etiqueta vacía; léxico de nombres, estados y etiquetas;
  colisión de nombres; referencias rotas ⇒ rechazo con todas las rutas; formato distinto ⇒
  rechazo; registro `{json}` y sobre de recuperación).
- `codec-fijo.test.ts`: para cada demo-model y el sintético: `a = exportarV0(importarV0(v0))`,
  `b = exportarV0(importarV0(a))`, `a === b`; informe de la segunda importación vacío;
  `leerCanonico(a)` ok; conteos de cosas/enlaces/OPDs coherentes con el v0 (menos lo informado);
  `exportarV0(aplicar(m, [])) === exportarV0(m)`.
- `codec-derivados.test.ts`: los 23 enlaces `derivado` de los fixtures quedan normalizados (ninguno
  sobrevive; los padres terminan en primer/último subproceso o en el contorno según tipo) y el OPL
  del SD no cambia de hechos respecto del v0 (comparación por conjunto de hechos, no por texto).

### 10.5 OPD

- `geometria.test.ts`: recorte exacto en elipse y rectángulo (puntos sobre el borde con
  |error| < 1e-9); peine con todos sus segmentos ortogonales y sin cruces propios; rayo con
  `k` acotado; lazo de autoinvocación; arco del abanico cubre todas las ramas; XOR 1 arco, OR 2.
- `escena.test.ts`: las 8 representaciones en función de (tipo, esencia, afiliación); contorno
  grueso ⇔ refinada; estados en la región inferior con inicial/final/por defecto/current; chip
  `⋯N` con supresión global ∨ local; letras `e`/`c`; `/`, `//`; multiplicidad y ruta; duración;
  rótulo de instancia; rótulo sin truncar para nombres de 60 caracteres; capas.
- `marcadores.test.ts`: paths literales ⇔ canon vendorizado; topología de triángulos en el SVG.
- `exportar.test.ts`: el SVG `canon` no contiene `data-ref`, ni clases de `CapaUi`, ni crimson; los
  rótulos son `#000`; el `viewBox` contiene todas las cajas; `<metadata>` declarado; gates (>25,
  <2, error) bloquean y listan motivos; advertencias de cruces en casos construidos.
- `golden.test.ts` (red de regresión que exige DECISIONS 15 y el riesgo §8-5): 40 casos
  construidos, uno por elemento del vocabulario visual cerrado y por combinación delicada (8
  representaciones de cosa; estados con las 4 designaciones, supresión y chip; 6 decoraciones de
  extremo con y sin estado; `e`/`c`; TS3 compacto y escindido; 4 triángulos con peine y colección
  incompleta; XOR/OR convergente y divergente; autoinvocación; excepción `/` y `//`;
  multiplicidad y ruta; duración; contenedor con 3 bandas, externos a ambos lados y rebote;
  despliegue; rótulo largo envuelto) más el SD y un OPD profundo de cada fixture de
  `app/fixtures/v0`. Cada caso: `exportarSvg(escena(m, opd))` byte a byte contra
  `opd/__golden__/<caso>.svg`. Actualizar = `bun run golden` (corre la suite con
  `OPFORJA_GOLDEN=escribir`), y el diff de los `.svg` se revisa **visualmente** en el PR (los
  golden se abren en el navegador; un golden nuevo sin mirar no se acepta). La métrica es
  determinista (tabla de avances, sin DOM), así que el golden no depende del sistema.

### 10.6 Editor y servidor

- `gestos.test.ts`: la máquina de estados del lienzo (crear, arrastrar, redimensionar, conectar con
  destinos legales/ilegales, bandas, cámara) como reductor puro.
- `guardado.test.ts`: autoguardado con reloj falso; CAS 412 ⇒ conflicto; red caída ⇒ sin conexión
  y reintento; borrador recuperado y descartado.
- `comandos.test.ts`: cada comando declara disponibilidad con motivo; no hay dos comandos con el
  mismo atajo en el mismo contexto.
- `servidor/sesion.test.ts`: login correcto/erróneo con respuesta uniforme; límite de intentos;
  cookie adulterada, vencida o con `versionCredencial` vieja ⇒ 401; CSRF sin cabecera ⇒ 403;
  `cuenta clave` cierra sesiones; **Bearer**: sin `OPFORJA_TOKEN` ⇒ 401; token < 48 ⇒ no arranca;
  token correcto ⇒ `GET/PUT /api/modelos` sin CSRF; token erróneo ⇒ 401 y cuenta para el límite;
  Bearer en `POST /api/sesion` ⇒ no autentica; el log no contiene el token.
- `servidor/almacen.test.ts`: escritura atómica (simular fallo entre `write` y `rename`), CAS 412,
  papelera y restauración con id ocupado, purga, índice reconstruido, documento no canónico ⇒ 400;
  **copias previas** con reloj falso: 100 PUT en 1 min ⇒ 1 copia; PUT cada 11 min ⇒ una copia por
  PUT, tope 30 (la 31.ª borra la más vieja); cada previa pasa `leerCanonico`; borrado definitivo
  elimina `previas/<id>/`.
- `servidor/principal.test.ts`: cada ruta de §8.1 con sus códigos; cabeceras de seguridad; SPA
  fallback; `/salud` con versión.
- `servidor/migrar-postgres.test.ts`: `FuenteLegada` falsa con cuenta, 5 modelos (uno con autosave
  más nuevo, uno archivado, uno con boceto, uno inválido, uno con carpeta) ⇒ archivos, papelera,
  rechazados, versiones e INFORME esperados; `--ensayo` no escribe; `--reemplazar` requerido.
- `arquitectura.test.ts` (direcciones §2.2). No hay prueba que lea `docs/` (§1.5).

### 10.7 E2E Playwright (26 escenarios)

Infraestructura: `webServer` = `bun servidor/principal.ts --datos <tmp> --web dist --puerto 4173`
con `OPFORJA_SECRETO` de prueba; `globalSetup` crea la cuenta con `cuenta crear` y siembra
modelos por la API. Chromium de `/opt/pw-browsers` (`PLAYWRIGHT_BROWSERS_PATH`), con
`@playwright/test` fijado a la versión cuyo `browsers.json` pide `chromium-1194` (o
`launchOptions.executablePath` desde `PW_CHROMIUM`). Contrato «app lista»:
`document.body.dataset.listo === "1"`. Localizadores por rol y nombre accesible; el estado se lee
por `GET /api/modelos/:id` (JSON canónico) y por el OPL visible. Sin CSS, sin `import("/src/…")`,
sin textos de tickets. Un fixture comprueba 0 errores de página en cada prueba.

| # | Escenario | Verifica |
|---|---|---|
| 1 | acceso | clave errónea ⇒ mensaje uniforme; correcta ⇒ biblioteca; salir ⇒ acceso |
| 2 | biblioteca | nuevo con nombre ⇒ editor vacío con estado vacío; renombrar en línea ⇒ `GET` refleja el nombre; descargar ⇒ archivo ≡ `GET`; eliminar ⇒ papelera ⇒ restaurar; no hay pestañas ni carpetas |
| 3 | importar JSON | `System_Diagram.json` ⇒ informe con conteos ⇒ crear ⇒ OPD dibujado y OPL con N líneas; `GET` devuelve documento canónico |
| 4 | crear y nombrar | `O` nombre ↵, `P` nombre ↵; nombre inválido bloqueado con ayuda; ⎋ no crea; colisión ⇒ «traer esa misma cosa» crea aparición y no cosa |
| 5 | esencia y afiliación | física ⇒ `feDropShadow` en el SVG y línea `**X** es física.`; ambiental ⇒ dash y D3; `getBBox()` de tres rótulos (corto, con tildes, de 60 caracteres) dentro de la métrica de `opd/metricas.ts` ± 2 % |
| 6 | estados | `S` nombre ↵ crea uno y termina; `S` otra vez para el segundo; ⎋ no crea; nunca aparece `estado1`; inicial+final ⇒ una línea D10; por defecto; current con pin; ocultar local ⇒ chip `⋯1` y D6 |
| 7 | enlace por arrastre | menú con solo los tipos legales y vista previa; consumo ⇒ `*P* consume **O**.`; agente no ofrecido desde informacional (motivo visible); resultado al estado inicial no ofrecido |
| 8 | control | `c` en consumo ⇒ CT1; en resultado deshabilitado con motivo |
| 9 | etiqueta y multiplicidad | etiquetado `usa` con `+` en objeto femenino ⇒ `al menos una **Olla**`; bidireccional con etiquetas iguales ⇒ recíproco |
| 10 | abanico | dos consumos ⇒ formar XOR ⇒ un arco en el SVG y `consume exactamente uno de`; cambiar a OR ⇒ dos arcos y `al menos uno de`; disolver |
| 11 | descomponer con bandas | `D` ⇒ OPD hijo con contenedor y **sin** subprocesos; `A ↵ B ⇧↵ C ↵ D ⎋` ⇒ CXM exacto; consumo del padre migrado a *A*; TS3 escindido; en SD la línea abstraída se mantiene; un `Ctrl+Z` deshace todo; `D ⎋` ⇒ advertencia AP-13 |
| 12 | bandas | `]` sobre *B* ⇒ OPL cambia; crear invocación *A*→*B* adyacente ⇒ rechazo «doble vara» |
| 13 | desplegar | `U` agregación, dos partes ⇒ CX3 y RF1 atómicas; colección incompleta ⇒ barra y «y al menos otra parte» |
| 14 | navegación | árbol, ruta, doble clic entra, `Alt+↑` sube; la cámara se conserva al volver |
| 15 | quitar vs eliminar | `Supr` en cosa con otra aparición ⇒ desaparece solo de este OPD; en única aparición ⇒ Decisión; `Mayús+Supr` ⇒ Decisión distinta |
| 16 | editar OPL | agregar `**Cliente** es física.` ⇒ «1 aplicable» ⇒ Aplicar ⇒ cosa en el lienzo; reabrir ⇒ «Sin cambios aplicables»; línea inválida ⇒ razón visible y no bloquea las demás |
| 17 | bimodal | pasar sobre un token realza el elemento (atributo de realce en la capa UI) y viceversa; clic en token de otro bloque navega y selecciona sin cambiar la `rev` |
| 18 | diagnóstico | proceso sin transformación ⇒ advertencia; «Ir» selecciona; el SVG no tiene marcas |
| 19 | exportar | SVG descargado sin `data-ref` ni clases UI; OPD con 1 subproceso ⇒ ítem deshabilitado con AP-13; JSON descargado ≡ `GET` |
| 20 | deshacer | aplicar OPL con 3 cambios y deshacer una vez ⇒ modelo previo; rehacer |
| 21 | guardado | editar ⇒ «Guardado» y `GET` refleja; PUT concurrente por API ⇒ «Conflicto» y Decisión; red cortada ⇒ «Sin conexión», recargar ⇒ recuperar borrador |
| 22 | reanclar estructural | arrastrar el extremo de una parte a otra cosa ⇒ OPL `consta de` cambia |
| 23 | duración y excepción | duración máx 5 min; sobretiempo a manejador ambiental ⇒ `excede 5 minutos`; manejador sistémico ⇒ advertencia |
| 24 | ancho estrecho | 390×844: pestañas cambian de zona; sin desplazamiento horizontal; crear objeto funciona |
| 25 | selección múltiple y enlaces de una cosa | `Mayús+clic` en 3 cosas, arrastrar ⇒ las 3 se mueven y un `Ctrl+Z` las devuelve; `Supr` ⇒ una Decisión; inspector de cosa lista sus enlaces con OPDs y clic navega |
| 26 | bimodal idempotente en navegador (SYNTHESIS §7.3) | con `System_Diagram.json` importado: por cada OPD, abrir el editor OPL sin tocar ⇒ «Sin cambios aplicables»; agregar una línea, aplicar y deshacer ⇒ tras el autoguardado `GET` devuelve el `rev` original (export determinista) |

---

## 11. Documentación final, canon vendorizado, registro y lista de eliminación

### 11.1 Documentos que quedan (inventario cerrado)

| Archivo | Lector | Contenido obligatorio | Se escribe desde | Líneas |
|---|---|---|---|---:|
| `README.md` | quien llega | (1) qué es, en un párrafo; (2) URL de producción; (3) correr en local: `cd app && bun install`, `bun servidor/cuenta.ts crear <correo> --datos .datos-dev` (una vez), `bun run dev`; (4) verificar: `bun run check`, `bun run e2e`, `bun run build`; (5) mapa del repo (`canon/`, `docs/`, `app/`, `deploy/`); (6) contrato externo: JSON v0 + API HTTP + token, con enlace a `docs/formato-v0.md`; (7) **límites reales**: «una suite verde no equivale a validación humana del modelado»; lo que no se cumple está en `docs/conformidad.md`; sin simulación. | §1, §2, §8, §10 | ~80 |
| `AGENTS.md` | agentes y personas | texto de §11.2 | §11.2 | ~45 |
| `CLAUDE.md` | adaptador | `@AGENTS.md` | — | 1 |
| `NOTICE.md` | legal | código propio en `app/`; dependencias y licencias (Preact y preact-render-to-string MIT, Inria Serif OFL-1.1 vía `@fontsource`); `canon/` es obra del dueño; el material observacional de OPCloud salió del árbol en el commit de retiro y **sigue en el historial Git** anterior (purgarlo exige reescribir el historial: decisión del dueño, fuera de este plan); sin licencia de repositorio declarada. | NOTICE actual | ~20 |
| `canon/LEEME.md` | autoridad | tabla slug · versión · sha256 de `content.md` · plano de autoridad; precedencia (CANON §0.3: reglas > spec-OPD/spec-OPL > método); «las URN que citan los `object.yaml` y no están aquí (`opm-es`, `opd-es`, `opl-es`, `opm-categorial-es`, `icas-*`, `manual-metodologico-opm-es`) no son autoridad de este repo»; actualizar = reemplazar la carpeta entera, recalcular sha256 y revisar `docs/especificacion.md` y `docs/conformidad.md` en el mismo commit. | object.yaml | ~25 |
| `docs/README.md` | índice | una tabla: usar → `guia.md`; integrar → `formato-v0.md`; operar → `operacion.md`; qué se cumple → `conformidad.md`; por qué así → `decisiones.md`; qué exige el canon → `especificacion.md`; el canon → `../canon/LEEME.md`. | — | ~25 |
| `docs/especificacion.md` | desarrollo | `understand/CANON.md` tal cual (T-NNN, DR-n, §10), con cabecera «Derivada de `canon/` (versiones…); ante conflicto manda `canon/`». | CANON.md | ~2 250 |
| `docs/conformidad.md` | R-CONF-7 | §11.3 | §11.3, §4.9 | ~300 |
| `docs/guia.md` | operador | §7 en prosa de uso: layout, flujos 1–25, atajos, estados vacíos; leyenda visual con los SVG de `opd/__golden__/` (no dibujos a mano). | §7 | ~250 |
| `docs/formato-v0.md` | integradores | §3.4 completo (contrato, etapas del importador, forma emitida, punto fijo, compatibilidad y sus dos diferencias con el lector v0 antiguo) + §8.1 (rutas, token, canonicalización, 422) + ejemplo `curl -H "Authorization: Bearer $OPFORJA_TOKEN"`. | §3.4, §8.1 | ~220 |
| `docs/operacion.md` | operador | variables (`OPFORJA_SECRETO`, `OPFORJA_TOKEN`, `OPFORJA_PREVIAS`, `OPFORJA_PREVIAS_MIN`); CLI de cuenta; `./deploy/deploy.sh`; respaldo y restauración; papelera; copias previas y cómo recuperar una; migración (§8.6) y transición (§9.4); rollback; lectura del log. | §8, §9 | ~160 |
| `docs/decisiones.md` | por qué | DECISIONS (dueño, orquestador, las 24 respuestas) y DR-C1…C14, cada una con su porqué y el requisito que toca. | DECISIONS, §1.6 | ~140 |

No quedan manuales de OPM: el canon vendorizado es la referencia para aprender y el manual
actual diverge de él (SYNTHESIS C-24). No hay índice de bugs, roadmap ni auditorías en el árbol.

### 11.2 `AGENTS.md` final (texto íntegro, como bloque indentado)

    # AGENTS.md

    ## Misión
    Construir y mantener el modelador OPM/ISO 19450 de `app/`: un solo modelo, dos expresiones
    (OPD y OPL) simétricas y persistencia fiable. Este repositorio no es fuente de modelos de dominio.

    ## Autoridad
    1. `canon/` (4 documentos vendorizados; versiones en `canon/LEEME.md`) es la autoridad OPM local.
       Precedencia: reglas > spec-OPD / spec-OPL > metodología.
    2. `docs/especificacion.md` deriva del canon (T-NNN, DR-n); `docs/decisiones.md` fija las
       decisiones del dueño y DR-C.
    3. `docs/conformidad.md` declara todo DEBE no cumplido. La brecha silenciosa está prohibida.
    No inventes reglas OPM locales. Si el canon no decide, aplica la válvula de simplicidad
    (especificación §0.5) y regístrala.

    ## Arquitectura
    - Código en `app/`. Dependencias: `nucleo → codec | opl | opd → editor → ui`; `servidor → codec`.
      `src/arquitectura.test.ts` lo hace cumplir.
    - La validez de enlaces vive solo en `nucleo/matriz.ts`; cada oración OPL solo en
      `opl/plantillas.ts`. No dupliques reglas en la UI ni en el parser.
    - Todo cambio semántico conserva el roundtrip estricto OPD↔OPL y el punto fijo del códec.
    - Vocabulario de dominio del canon en español; identificadores ASCII.
    - Prefiere el menor incremento vertical observable; no refactorices capas vecinas por conveniencia.

    ## Verificación
    Desde `app/`: `bun run check`. Añade solo lo que corresponda: el escenario e2e afectado para
    interacción; `bun run golden` y revisión visual de cada SVG cambiado para render; `bun run build`
    para empaquetado; `bun test ../deploy` al tocar `deploy/`. No declares roundtrip ni fidelidad
    visual sin observarlos.

    ## Registro de conformidad
    Todo diff que agregue, quite o cambie una fila de `NO_OFRECIDO`, `NO_SOPORTADAS`,
    `NO_CANONIZADAS` o `CATALOGO`, o el estado de un DEBE, actualiza `docs/conformidad.md` en el
    mismo commit. Cada fila de `NO_OFRECIDO` y `NO_SOPORTADAS` lleva su `registro: 'B-nn'`.

    ## Entrega
    - Revisa el diff y conserva trabajo ajeno.
    - Despliega solo con `./deploy/deploy.sh` y solo cuando la solicitud lo autorice.
    - Documenta límites reales: una suite verde no equivale a validación humana del modelado.
    - Trabajo material inconcluso: un único `HANDOFF.md` en la raíz, estable y sin fecha; elimínalo
      al cerrar. No crees `MEMORY.md`, continuidades fechadas ni archivos de sesión.

### 11.3 `docs/conformidad.md`: forma y contenido inicial

Cabecera: versiones del canon (de `canon/LEEME.md`) y estados admitidos (R-APP-2: `enforzado`,
`parcial`, `no implementado`, `zona laxa pendiente`). Una regla no se marca cerrada hasta cubrir
UI, núcleo, importación, generación OPL, parseo OPL y exportación aplicables (R-APP-3). Cada fila
de `NO_OFRECIDO` y `NO_SOPORTADAS` lleva en el código el campo
`registro: 'B-nn'` que apunta a la fila de «Brechas»; la correspondencia la verifica la revisión
del diff (§1.5), no una prueba.

**Tabla 1 — Brechas (contenido inicial exhaustivo).** Superficies: U = UI, N = núcleo, I = import,
G = generación OPL, P = parseo OPL, X = export.

| id | regla | estado | U N I G P X | qué hace el producto | decisión |
|---|---|---|---|---|---|
| B-01 | RX1/RX2 `puede ser` (DR-10) | no implementado | U·P | no se ofrece; el parser responde `unsupported-canonical` sin mutar | DECISIONS 1 |
| B-02 | Descomposición de objeto (R-OPL-CX-4, DR-23) | no implementado | U·N·I·P | `descomponer` rechaza con la regla; `**O** se descompone en` ⇒ `unsupported-canonical`; el import la convierte en despliegue por agregación con informe | DECISIONS 2, DR-C4 |
| B-03 | Agente humano (R-AG-1, AP-05) | parcial | N | se exige objeto físico (proxy del método); diagnóstico info `agente-humano` pide verificar | DECISIONS 3, DR-5 |
| B-04 | Multiplicidad donde la plantilla no tiene hueco (con `c`; efecto con estados; SSE; parte proceso) | no implementado | U·N·I·P | no se ofrece con motivo; el import la descarta con informe; el parser responde `unsupported-canonical` | DR-44 |
| B-05 | Recíproco con estados sin etiqueta (SE5 con estado) | no implementado | U·P | no se ofrece; `unsupported-canonical` | reglas §4.10 |
| B-06 | Abanico de efecto fuera de FAN-5/5A (entrada y salida variables a la vez) | no implementado | U·G·P | no se ofrece; si llega por import, la generación falla cerrada con `abanico-invalido` (error, bloquea el export) | R-FAN-5/5A |
| B-07 | Ruta fuera de consumo/resultado; ruta en rama de abanico | no implementado | U·I·P | no se ofrece; el import la descarta con informe; `unsupported-canonical` | DR-19, DR-C5 |
| B-08 | Control en abanico sin plantilla (C-19b; instrumento en C-18) | no implementado | U·P | «Control de todas las ramas» solo ofrece las combinaciones con plantilla | reglas §7.4 |
| B-09 | Especialización de estado (R-OPL-RF-3, T-121) | parcial | U·P | generalización entre cosas sí; con estados no se ofrece; `unsupported-canonical` | DR-C13 |
| B-10 | Plurales por multiplicidad (`consumen`, `generan`) | no implementado | G·P | se genera siempre en singular con la frase antepuesta; el plural se responde `unsupported-canonical` | DR-12 |
| B-11 | Participación distinta de `?`, `*`, `+` (numérica, rangos, `exactamente un`) | no implementado | I·P | el import la descarta con informe; `unsupported-canonical` | DR-21 |
| B-12 | Despliegue dedicado `se despliega por <modo> en` (partes, especialización, instanciación, rasgos) | no implementado | P | se genera CX3; la forma dedicada se responde `unsupported-canonical` | spec-OPL §7 |
| B-13 | Import con errores recuperables (R-ESC-OP-4, T-288) | parcial | I | forma ⇒ rechazo total con todas las rutas; contexto ⇒ se carga como `error` que bloquea el export canónico | DR-C8 |
| B-14 | Bisimetrías parciales (R-§19-ROT-1): las 8 de §5.8 | parcial | G·P | fixture marcado no estricto por caso; se conservan en el JSON | §5.8 |
| B-15 | Heurísticas léxicas R-NOM-* | parcial | N | advertencias metodológicas por heurística (falsos positivos y negativos posibles) | DECISIONS 19 |
| B-16 | Cruces y oclusión al exportar (T-284, R-LAY-2) | parcial | X | advertencia por conteo tras exportar; sin re-ruteo | §6.6 |
| B-17 | Extensiones con sintaxis OPL fuera de alcance (CANON §0.4): `Pr=` en abanico, m-de-f, `después de`, negadas, EX combinada, RF2o, `[etiqueta: …]`, `es de tipo`, `varía de`, `donde`, CM1–CM3, CX4–CX8, `ordenados por`/`más` (R-OPL-SE-4), marca `ordered` (R-OPD-STR-5) | no implementado (PUEDE) | I·P | el parser responde `unsupported-canonical`; `Pr=` fuera de abanico ⇒ `non-canonical`; el import descarta los campos con informe | CANON §0.4, DECISIONS 9 |
| B-18 | Firma de frontera categorial (T-089, R-CAT-EQ-3) | enforzado como ley de prueba | N | `frontera.test.ts` con implementación independiente; no se expone al modelador (R-ANEXO-CAT-0) | DR-16 |

**Tabla 2 — Mapa ★**: la tabla de §4.9 (requisito ★ → archivo y función → prueba), mantenida
junto al código.

### 11.4 Lista exacta de eliminación (rama `rehacer`, WP-0)

Antes de borrar: tag `pre-rehacer` sobre la base (para portar por lectura con
`git show pre-rehacer:<ruta>` y para el rollback de §9.4). Borrar del árbol no borra del historial.

| Ruta (archivos versionados) | Por qué se retira |
|---|---|
| `.codex/skills/lineas-paralelas/SKILL.md`, `.opencode/skills/lineas-paralelas/SKILL.md` | skills de otros runtimes para el proceso anterior; además ya están en `.gitignore` |
| `assets/` (86), `catalog/` (2), `config/` (4), `webroot/` (2), `opm-extracted/` (457) | material observacional de OPCloud (DECISIONS 17, NOTICE) |
| `ui-forja/` (21) | gobierno visual del sistema retirado; los tokens pasan a `opd/tokens.ts` y `ui/estilos.css` |
| `fixtures/` (62) **salvo** los 6 `fixtures/demo-models/*.json` | `git mv` de esos 6 a `app/fixtures/v0/`; el resto (`*.md`, `*.opl.txt` del generador viejo, `empty-model/`, `meta/`, `onstar-system/`, `opm-meta-model/`, `sd-async/`, `sd-sync/`, `system-diagram/`) son capturas y derivados de OPCloud (DECISIONS 17) |
| `setup.sh` | regenera bundles de OPCloud |
| `tsconfig.json`, `bunfig.toml` (raíz) | apuntan a `app/src` viejo; `app/` tiene los suyos |
| `HANDOFF.md` | continuidad del producto integrado con agente LLM: obsoleta (AGENTS: eliminar al cerrar) |
| `docs/` completo salvo los archivos de §11.1: `JOYAS.md`, `auditorias/` (13), `bugs/` (379), `canon-opm/` (5, puentes y resolutor URN: reemplazados por `canon/`), `cheatsheets/` (17), `decisiones/` (2), `deploy/opforja.md` (→ `operacion.md`), `ejemplos/` (2), `manual-opforja.md`, `manual-opm-puro.md` (diverge del canon, C-24), `manual-sanitarios-opm.md`, `manual-sistemas-opm.md`, `manual-software-opm.md`, `memorias-aprendizajes/` (3), `reference/` (65), `render-headless.md`, `roadmap/` (3), `specs/` (5), `superpowers/` (8), `uso-productivo.md` (→ `guia.md`), `verify-reproducible.md`; `docs/README.md` se reescribe | documentación de capacidades retiradas, históricas o duplicadas del canon |
| `app/src/**` (1 141) | se reescribe (§2); lo portable se lee de `pre-rehacer` (§12.3) |
| `app/e2e/**` (76) | 26 escenarios nuevos (§10.7) |
| `app/scripts/**` (29) | bug-capture, cordón, design-governance, quality-ledger, in-vivo, mesa, corpus del tutor, render-headless, verify-reproducible; `deploy.test.ts` pasa a `deploy/deploy.test.ts` y `auth-cuenta.ts` se porta a `servidor/cuenta.ts` |
| `app/_local/**` (2 versionados), `app/portable-reader/`, `app/playwright.external.config.ts`, `app/playwright.preview.config.ts`, `app/eslint.config.js` | simulación, lector portátil, amarras externas, preview y lint retirados |
| `deploy/nginx.conf`, `deploy/backup-opforja-db.sh`, `deploy/systemd/opforja-db-backup.service`, `deploy/systemd/opforja-db-backup.timer` | sin nginx ni PostgreSQL; los reemplazan `deploy/respaldo.sh` y `deploy/systemd/opforja-respaldo.*` (el respaldo de PostgreSQL del paso 2 de §9.4 se ejecuta desde `pre-rehacer`) |

Se **reescriben** (no se borran): `Dockerfile`, `docker-compose.yml`, `.dockerignore`
(sin entradas de `docs/bugs`, `decompiled`, `_local`), `.gitignore` (sin los comentarios de
OPCloud), `deploy/deploy.sh`, `README.md`, `AGENTS.md`, `NOTICE.md`, `docs/README.md`,
`app/package.json`, `app/bun.lock`, `app/bunfig.toml`, `app/tsconfig.json`, `app/vite.config.ts`,
`app/index.html`, `app/playwright.config.ts`, `app/.gitignore`. `CLAUDE.md` no cambia.

---

## 12. Plan de implementación (paquetes de trabajo)

### 12.1 Estrategia

- Rama `rehacer` desde `main` con el tag `pre-rehacer`. Producción sigue con el stack viejo hasta
  el merge y un despliegue **autorizado** (§9.4). Así ninguna capacidad en uso (abrir modelos,
  traer cosa, quitar de este OPD: SYNTHESIS §8-17 y §8-18) desaparece antes de que la nueva la
  cubra con sus pruebas.
- **Pruebas primero** (SYNTHESIS §8-14): cada WP abre con sus archivos `*.test.ts` escritos desde
  las filas de `docs/especificacion.md`, las leyes de `pre-rehacer:app/src/leyes/` y las sondas
  del crítico (`understand/probe_critico*.test.ts`) reexpresadas sobre la API nueva; el código
  llega después y el WP cierra con `bun run check` verde. Ninguna prueba se debilita para pasar.
- Propiedad exclusiva de archivos por WP (tabla); los WP paralelos no comparten archivos.
  Único archivo tocado por dos WP: `nucleo/enlaces.ts` (WP-3 lo crea; WP-4 le añade la llamada a
  `distribuir`), en serie.
- Mientras la rama esté abierta, un único `HANDOFF.md` raíz, estable y sin fecha, dice qué WP
  están cerrados y cuál sigue; WP-19 lo elimina.

### 12.2 Paquetes

| WP | Objetivo | Archivos (propiedad) | Contratos que fija o consume | Depende de | Aceptación |
|---|---|---|---|---|---|
| WP-0 | Andamiaje y retiro | borrados de §11.4; `canon/**`; `app/{package.json,bun.lock,bunfig.toml,tsconfig.json,vite.config.ts,index.html,playwright.config.ts,.gitignore}`; `app/src/arquitectura.test.ts`; `app/herramientas/dev.ts`; `git mv` de fixtures a `app/fixtures/v0/`; `AGENTS.md` (§11.2); `HANDOFF.md` | scripts: `dev`, `check` = `tsc --noEmit && bun test src servidor`, `test`, `golden`, `build` (§9.1), `e2e` = `bun run build && playwright test`; dependencias exactas de §2.2; tabla de dependencias de §2.2 | — | `bun install` sin dependencias fuera de §2.2; `bun run check` verde (arquitectura sobre carpetas vacías); ninguna ruta de §11.4 en `git ls-files`; sha256 de `canon/` = `canon/LEEME.md` |
| WP-1 | Tipos y fundamentos | `nucleo/{tipos,resultado,ids,indice,lexico,herencia,modelo,forma}.ts`; `src/pruebas/constructores.ts` | §3.1 (tipos), §4.1 (`Resultado`, `Rechazo`, `Traza`, `Tx`), léxico EBNF, `validarForma` | WP-0 | `forma.test` (cada invariante de §3.2 violado ⇒ violación esperada), `lexico.test` (EBNF, y/e, o/u, sin normalización silenciosa, T-025), `herencia.test` |
| WP-2 | Matriz de validez | `nucleo/matriz.ts` | `MATRIZ`, reglas de contexto, `NO_OFRECIDO`, `violacionesForma/Contexto/Abanico`, `noOfrecido`, `tiposLegales` (§4.3) | WP-1 | `matriz.test`: cada fila de CANON §2.1 con ≥1 caso legal y ≥1 ilegal; AP-01…AP-30 aplicables; unicidad distributiva (T-053, sonda 7/10); contorno (T-060, sonda 9); manejador sistémico **no** rechazado (T-268) |
| WP-3 | Operaciones sobre cosas, estados, enlaces, abanicos y colocación (2 agentes: 3a cosas + estados + colocación; 3b enlaces + abanicos) | 3a: `nucleo/{cosas,estados,colocacion}.ts`; 3b: `nucleo/{enlaces,abanicos}.ts` | API §4.2 (salvo refinamiento); `colocar` | WP-2 | `cosas/estados/enlaces/abanicos.test`: éxito, rechazo con regla, trazas, ids, un paso de deshacer; T-062 (nada sin nombre), T-063 (`cambiarTipoCosa`), T-248/251/252 (traer, quitar, eliminar: el contenido útil de `canvas/operacionesBatch.ts` vive aquí, §8-17); selección múltiple (`moverApariciones`, `quitarDeOpd` y `eliminarCosa` con n ids) |
| WP-4 | Refinamiento y proyección | `nucleo/{refinamiento,proyeccion}.ts`; llamada a `distribuir` en `nucleo/enlaces.ts` | §4.5, §4.6, §4.7 (`proyectar`, `etiquetaOpd`, `opdsEnPreorden`) | WP-3 | `refinamiento.test` (tabla de distribución fila a fila con \|S\| = 0/1/≥2, T-074 escisión, T-075 mismo id, T-079 precondición, T-080 cascada, T-081 rebote, sin semillas); `proyeccion.test` (12 niveles de fuerza, las 9 celdas R-PREC, R-VIS-HIJO-1, SDx.y: SYNTHESIS §8-4); `frontera.test` (T-089) |
| WP-5 | Diagnóstico y gates | `nucleo/diagnostico.ts` | `CATALOGO`, `diagnosticar`, `gatesExportacion` (§4.4) | WP-4 | `diagnostico.test`: cada código con caso positivo y negativo; R-PROC-2 con herencia y subprocesos, único código (T-263); R-NOM-* como warning; gates (T-283) |
| WP-6 | Códec v0 | `codec/**`; `app/fixtures/v0/sintetico.json` (generador con semilla en la prueba) | §3.4 completo, incluido `informe.visibilidad` | WP-4 | `codec.test` (una prueba por regla de §3.4.2, corpus portado de `pre-rehacer:app/src/serializacion/json*.test.ts`), `codec-fijo.test`, `codec-derivados.test` (23 derivados), `codec-visibilidad.test` (diff por OPD de cada fixture, riesgo §8-21) |
| WP-7 | OPL: generación | `opl/{vocabulario,linea,plantillas,generar}.ts`; `opl/documento.ts` (generar) | `PLANTILLAS`, `generarBloque`, `generarModelo`, tokens y refs | WP-4 | `vocabulario/plantillas/generar.test`: T-100 preorden, T-101 D6, T-116 IV2 sin demora, T-125 CX1 solo en el hijo con coma, T-126 CX3 con `SDx en`, T-139 esencia solo display, C2 mención mínima, unidades es-CL (DECISIONS 4) |
| WP-8 | OPD: escena y SVG | `opd/**` (incluido `__golden__/`), `herramientas/medir-fuente.ts` | `escena`, `OpdSvg`, marcadores literales, `exportarSvg`, `exportarDocumento(lineas)` | WP-4 | `geometria/escena/marcadores/exportar.test`; `golden.test` con los 40 casos de §10.5 revisados visualmente uno a uno (SYNTHESIS §8-5); T-228 (sin marcas de validación en el SVG) |
| WP-9 | OPL: análisis y edición inversa | `opl/{analizar,planificar,aplicar,no-soportadas}.ts`; `opl/documento.ts` (parseo A/B) | `analizar`, `planificar`, `aplicar`, `NO_SOPORTADAS`, `NO_CANONIZADAS` | WP-7 (y WP-3/4) | `analizar/editor-opl/roundtrip-matriz/roundtrip-tabla92/composicion/lente.test`: T-153, T-155, T-157, T-158, T-161, T-165, T-166, T-170, T-182, T-192 desde vacío; D1/D3 «solo si difieren» entra **en el mismo merge** que la creación por tipografía (SYNTHESIS §8-16) |
| WP-10 | Integración códec × OPL | `opl/roundtrip-modelos.test.ts` | — | WP-6, WP-9 | auto-reparseo por OPD con 0 cambios en los 6 fixtures y el sintético (UX-01 no puede volver); estricto de documento completo |
| WP-11 | Servidor | `servidor/{principal,sesion,almacen,cuenta}.ts` | §8.1–§8.3 (rutas, sesión, token, CAS, previas, canonicalización) | WP-6 | `sesion/almacen/principal.test` (§10.6), incluidos token, rotación de previas y 422 por pérdidas; `cuenta` porta `pre-rehacer:app/src/server/passwordHash.ts` byte a byte en formato |
| WP-12 | Migración desde PostgreSQL | `servidor/migrar-postgres.ts` | §8.6 (`FuenteLegada`, informes por modelo) | WP-6, WP-11 | `migrar-postgres.test` con fuente falsa (6 casos de §10.6 más un modelo con `familiasEfectosPreestado` y uno con cotas de excepción) |
| WP-13 | Editor (estado de aplicación) | `editor/**` | `EstadoEditor`, `ejecutar(op, {gesto})` con fusión de pasos, historial por instantáneas (200), comandos con disponibilidad y motivo, cliente con `fetch` inyectado, guardado y borrador, máquina de gestos | WP-5, WP-6 (y contrato de WP-11) | `gestos/guardado/comandos/estado.test`; ningún atajo duplicado por contexto |
| WP-14 | UI: armazón | `ui/{App,Acceso,Biblioteca,InformeImportacion,Editor,Dialogo,Ayuda}.tsx`, `ui/estilos.css`, `main.tsx` | layout §7.1; Biblioteca de lista simple (§7.3-2, SYNTHESIS §8-18) | WP-13, WP-11 | e2e 1, 2, 3, 21, 24 |
| WP-15 | UI: lienzo | `ui/{Lienzo,CapaUi,NombreEnLinea,MenuTipoEnlace,MenuContextual}.tsx` | gestos → operaciones; menú desde `tiposLegales`; vista previa por `opl` | WP-8, WP-13 | e2e 4–13, 15, 22, 23, 25 |
| WP-16 | UI: paneles | `ui/{Inspector,ArbolOpd,PanelOpl,EditorOpl,PanelDiagnostico,Buscar,MenuExportar}.tsx` | inspector con «Enlaces (N)», búsqueda mínima, editor OPL de 4 estados, export con gates | WP-9, WP-8, WP-13 | e2e 14, 16–20, 26 |
| WP-17 | E2E | `e2e/**` | infraestructura §10.7 | redacción desde WP-13; ejecución tras WP-14–16 | los 26 escenarios verdes contra el build y el servidor real con Chromium de `/opt/pw-browsers`; 0 errores de página |
| WP-18 | Despliegue (sin desplegar) | `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `deploy/{deploy.sh,deploy.test.ts,respaldo.sh}`, `deploy/systemd/opforja-respaldo.*` | §9 | WP-11 | `bun test ../deploy`; `docker compose build` local correcto; imagen sin fuentes ni pruebas |
| WP-19 | Documentación y cierre | `README.md`, `NOTICE.md`, `docs/**`; borra `HANDOFF.md` | §11 | todos | cada fila de `NO_OFRECIDO`/`NO_SOPORTADAS` con su `registro` tiene su fila B-nn y viceversa (revisión del diff); el mapa ★ apunta a archivos y pruebas existentes; `bun run check`, `bun run e2e` y `bun run build` verdes en limpio |

### 12.3 Qué se porta por lectura desde `pre-rehacer` (no se copia a ciegas)

| Origen | Destino | Qué se toma |
|---|---|---|
| `app/src/server/passwordHash.ts` | `servidor/sesion.ts`, `servidor/cuenta.ts` | formato `scrypt$16384$8$1$sal$hash` y verificación (la migración copia el hash) |
| `app/src/modelo/operaciones/refinamiento/helpers.ts` (`validarFirmaEnlace`), `modelo/operaciones/enlaces.ts` (`validarUnicidadRolPar`) | `nucleo/matriz.ts` | exhaustividad por `satisfies never`; casos de la unicidad |
| `app/src/opl/parser/parsear.ts` (`parsearBandasOrden`), `opl/parser/planificar.ts` (`PatchRegistry`), `opl/clasificadorEdicion.ts` | `opl/analizar.ts`, `opl/planificar.ts` | doble rol de `y` en secuencias mixtas; registro de patches por clave de hecho; 4 estados y 8 razones |
| `app/src/persistencia/documentMigration.ts` (`collectUnrepresented`) | `codec/informe.ts` | recorrido de campos no representados |
| `app/src/modelo/operaciones/refinamiento/helpers.ts` (`agruparSubprocesosParalelos`), `modelo/politicaApariciones.ts` (`aparienciaEsInternaDeRefinamiento`) | `codec/importar.ts` | bandas por geometría (4 px); internos por geometría |
| `app/src/modelo/hechos/visibilidadEstados.ts` | `nucleo/proyeccion.ts` | predicado de visibilidad de estados, **sin** la guarda global que sobrebloquea (C-06) |
| `app/src/serializacion/portablePackage.ts` (`constantTimeEqual`, `assertExactKeys`), `server/agent/http.ts` (`canonicalJson`) | `servidor/sesion.ts`, `codec/exportar.ts` | utilidades |
| `app/src/leyes/{contencion-refinamiento,dependencias-unidireccionales,equivalencia,opl-reverse,proyecciones,refinamiento-cascadas,refinamiento-frontera,supresion-estados-aparicion,invocacion-implicita-bimodal,composicion,silencio-readonly}.test.ts` | pruebas de WP-2…WP-9 | la ley y su control de no tautología, reexpresados sobre la API nueva |
| `app/scripts/deploy.test.ts` | `deploy/deploy.test.ts` | stubs de `git`, `docker`, `curl` |

### 12.4 Orden de integración y paralelismo

```
WP-0 → WP-1 → WP-2 → WP-3 (3a ∥ 3b) → WP-4
                                        ├─► WP-5 ─────────────┐
                                        ├─► WP-6 ─► WP-11 ─┬─► WP-12
                                        │                  └─► WP-18
                                        ├─► WP-7 ─► WP-9 ─► WP-10
                                        └─► WP-8
WP-5 + WP-6 ─► WP-13 ─► (WP-14 ∥ WP-15 ∥ WP-16) ─► WP-17 ─► WP-19 ─► PR rehacer → main
```

Máximo cuatro agentes simultáneos (tras WP-4: WP-5, WP-6, WP-7, WP-8; luego WP-9, WP-11,
WP-13 y WP-8/WP-12). Cada merge a `rehacer` exige `bun run check` verde; WP-14–16 exigen además
sus e2e. El PR final a `main` no despliega: el despliegue sigue la transición de §9.4 solo con
autorización explícita.

---

## 13. Riesgos, sobresimplificación y mitigaciones

### 13.1 Riesgos de sobresimplificación de SYNTHESIS §8 (los 21, resueltos)

| # | Riesgo | Resolución en este diseño | Dónde se prueba |
|---|---|---|---|
| 1 | Datos de producción con extensiones (`esApunte`, familias por preestado, anclas, notas, piezas, `Estado.duracion`) | El importador descarta cada campo **con su ruta** en `informe.descartado`; la migración escribe un informe por modelo y copia cada payload original a `archivo/…/originales/`; `pg_dump` previo (§9.4-2). Las familias por preestado dejan varios efectos sobre el mismo par: se cargan como `enlace-invalido` (R-ROL-UNIC-1, error recuperable) con la acción canónica, nunca se fusionan en silencio | `codec.test`, `migrar-postgres.test` |
| 2 | Consumidores externos (`hd-opm`, skill, `mesa`, golden HODOM) | Contrato = JSON v0 + API HTTP + token Bearer (DECISIONS 13), documentado en `formato-v0.md`; el export satisface los tipos v0 actuales (abanico con sus tres campos obligatorios, `etiqueta` siempre); la igualdad byte a byte del HODOM se reemplaza por la ley de punto fijo; el servidor canonicaliza lo que llega (§8.1) | `codec-fijo.test`, `principal.test` |
| 3 | Superficie OPL nueva invalida textos; pedido de AND compuesto | Se abandonan la clasificación compuesta y el AND agrupado en emisión (DECISIONS 20); el parser sigue aceptando R-ENT-3; los `.opl.txt` viejos se retiran y los fixtures se regeneran desde el generador nuevo | `analizar.test` (ENT3), `generar.test` |
| 4 | Vista del padre derivada (fuerza, R-PREC) | Una prueba por nivel de fuerza y por celda de la matriz 3×3 en WP-4, **antes** de retirar las proyecciones persistidas (se ignoran al importar recién en WP-6) | `proyeccion.test` |
| 5 | Reemplazar JointJS sin red | 40 golden SVG revisados a ojo, marcadores literales comparados con el canon, máquina de gestos pura con pruebas, e2e de estados, enlaces, reanclaje y abanicos; la geometría de estados, puertos y rutas es derivada (no hay datos que se desincronicen) | `golden.test`, `gestos.test`, e2e 5–13, 22 |
| 6 | Simulación y probabilidades usadas por el dueño | Se retiran (DECISIONS 9); el import las descarta con informe; `Pr=` responde `unsupported-canonical` o `non-canonical`; declarado en `decisiones.md` | `codec.test`, `analizar.test` |
| 7 | Sin undo, búsqueda ni tabla de enlaces | Undo/redo por instantáneas (200 pasos, fusión por gesto); `Ctrl+K` por nombre de cosa u OPD; la tabla de enlaces se sustituye por «Enlaces (N)» del inspector y «Filtrar por selección» del OPL | e2e 14, 20, 25 |
| 8 | Sin versiones ni local-first | Copias previas en el servidor (30, ≥ 10 min entre copias), papelera de 30 días, borrador en IndexedDB, descarga JSON siempre disponible, respaldo diario de 14 días, CAS | `almacen.test`, `guardado.test`, e2e 21 |
| 9 | Unicidad nominal frente a duplicados | El import renombra con sufijo `-2`… e informa; nunca rechaza el documento por eso; en edición, la colisión ofrece «traer esa misma cosa» | `codec.test`, e2e 4 |
| 10 | DR-11 lento en el in-zoom | `D` + nombres encadenados (↵ secuencia, ⇧↵ paralelo) + ⎋: un gesto, un paso de deshacer, sin semillas; 5 pasos para 3 subprocesos | e2e 11 |
| 11 | Import tolerante persiste grafos inválidos | Dos niveles: forma ⇒ rechazo; contexto ⇒ error recuperable que bloquea el export canónico por gate; el almacén guarda solo documentos canónicos | `codec.test`, `diagnostico.test`, `exportar.test` |
| 12 | Capturador de bugs como único canal de feedback | Fuera (DECISIONS 11). Canal mínimo: el límite de error por panel ofrece «Copiar detalle» (versión, OPD, pila; nunca contenido del modelo) y el README indica dónde reportarlo | revisión |
| 13 | CANON.md derivado y 4 decisiones pendientes | Canon vendorizado en `canon/` como autoridad; `especificacion.md` declarada derivada; DR-5, DR-10, DR-18, DR-23 fijadas por DECISIONS 1–4 y declaradas en Brechas (B-01, B-02, B-03) | — |
| 14 | Tests primero | Cada WP abre con sus pruebas (§12.1); leyes y sondas reexpresadas antes del código que protegen | revisión por WP |
| 15 | Licencia: el historial conserva lo retirado | Declarado en `NOTICE.md`; purgar el historial es decisión del dueño fuera del plan | — |
| 16 | DR-2 sin T-153 rompe el roundtrip desde vacío | D1/D3 «solo si difieren» + mención mínima D2 (C2) + creación por tipografía en el planificador entran juntos en WP-9, con `roundtrip-matriz` desde vacío como gate | `roundtrip-matriz.test` |
| 17 | Retirar `canvas/operacionesBatch.ts` en bloque | `traerCosa`, `quitarDeOpd` y `eliminarCosa` nacen en el núcleo en WP-3 con sus pruebas; el código viejo solo se retira en la rama, que no llega a producción sin e2e 14–15 | `cosas.test`, e2e 14, 15 |
| 18 | Retirar el diálogo de abrir modelos | La Biblioteca (lista simple con abrir) es WP-14 y su e2e 2–3 es condición del merge | e2e 2, 3 |
| 19 | Migrar el par TS3 | El import fusiona consumo-desde-estado + resultado-a-estado del mismo par en un `efecto` con `entrada`/`salida` y el id del consumo; `efectoEscindido` ⇒ `escision` con ambos ids; informe de cada fusión | `codec.test`, `codec-derivados.test` |
| 20 | Cotas de excepción en el enlace | `tiempoMaximo`/`tiempoMinimo` + unidad ⇒ `duracion.max/min` de la fuente; conflicto ⇒ primero, el otro descartado con informe; EX1/EX2 salen con el número | `codec.test`, `generar.test` |
| 21 | Visibilidad derivada cambia el OPL por OPD | Etapa 12 del importador: `informe.visibilidad` por OPD (enlaces y abanicos que aparecen o desaparecen) en el diálogo de importación y en el informe de migración por modelo; el operador lo revisa en el ensayo (§9.4-4) | `codec-visibilidad.test` |

### 13.2 Ítems de SYNTHESIS §10.2 marcados FALTA, CONTRADICE, PARCIAL o N/A

| Req. | Estado previo | Mecanismo nuevo | Prueba |
|---|---|---|---|
| T-001 ★ | FALTA | `docs/conformidad.md` exhaustivo (§11.3) + campo `registro` en cada fila de las tablas de código + regla de cambio en AGENTS | revisión del diff (sin prueba de prosa) |
| T-025 ★ | PARCIAL | `lexico.ts` valida al nombrar con error visible; ninguna operación reescribe; sin ontología ni `[u]`; el import normaliza con informe | `lexico.test`, e2e 4 |
| T-053 ★ | PARCIAL | Regla de contexto R-ROL-UNIC-1 distributiva sobre ancestros/descendientes; en OPL, TS1 + TS2 del mismo par ⇒ `enlace-invalido-firma` con la acción «usa `cambia … de … a …`» | `matriz.test`, `editor-opl.test` |
| T-060 ★ | CONTRADICE | R-DIST-1/AP-06/AP-21 en la matriz (al crear en el contorno ⇒ rechazo; existente ⇒ error recuperable) + distribución automática 0→n | `matriz.test`, `refinamiento.test` |
| T-062 ★ | CONTRADICE | Nada nace sin nombre: `crearCosa`, `agregarEstado` (uno por gesto), `agregarSubprocesos`, `agregarRefinadores` exigen nombre; in-zoom y despliegue sin semillas | `cosas.test`, e2e 4, 6, 11 |
| T-063 ★ | N/A (no existía) | `cambiarTipoCosa` revalida estados y enlaces con la matriz y rechaza si alguno queda inválido | `cosas.test` |
| T-074 ★ | FALTA | Escisión TS3 ⇒ TS4 (id original) + TS5 (id nuevo) al pasar de 0 a ≥2 subprocesos; `escindirEfecto` como acción de AP-07 | `refinamiento.test` |
| T-075 ★ | CONTRADICE | Toda migración mueve el **mismo** enlace (cambia el extremo proceso, conserva el id); no hay copias | `refinamiento.test` |
| T-079 ★ | FALTA | Precondición de `descomponer`/`desplegar`: la cosa no es externa en el OPD activo (R-HIJO-5) | `refinamiento.test` |
| T-081 | FALTA | `moverApariciones` devuelve el externo al borde con traza y aviso; el alcance es dato (`objetosInternos`), no geometría | `cosas.test`, e2e 11 |
| T-100 ★ | PARCIAL | `opdsEnPreorden` (DFS por `orden`) es la única función de orden: panel, export y documento | `proyeccion.test`, `generar.test` |
| T-101 ★ | FALTA | D6 con estados visibles y «y otros estados» cuando hay ocultos (locales o globales) | `generar.test`, e2e 6 |
| T-116 ★ | CONTRADICE | IV2 `se invoca a sí mismo.` sin demora: el tipo no tiene campo de demora (DECISIONS 21) | `generar.test` |
| T-125 ★ | PARCIAL | CX1 con `, en esa secuencia` solo en el bloque del hijo | `generar.test` |
| T-126 ★ | CONTRADICE | CX3 `se despliega en SDx en …` | `generar.test` |
| T-139 | CONTRADICE | Modos de esencia solo en líneas `soloDisplay`; el canónico es siempre «solo si difiere» + mención mínima | `generar.test` |
| T-153 ★ | FALTA | El planificador crea la cosa nueva con el tipo de su tipografía (una vez aunque aparezca en varias líneas) y resuelve a la existente por clave de unicidad | `editor-opl.test`, `roundtrip-matriz.test` |
| T-155 ★ | PARCIAL | Todo candidato de enlace pasa por la matriz; violación ⇒ `type-mismatch` ⇒ `enlace-invalido-firma` con el id de la regla | `analizar.test` |
| T-157 ★ | FALTA | `NO_CANONIZADAS` ⇒ `non-canonical` (error) sin mutar, incluido `Pr=` fuera de abanico | `analizar.test` |
| T-158 ★ | PARCIAL | Tipografía que contradice una cosa existente ⇒ línea `no-aplicable` (`type-mismatch`, razón `enlace-invalido-firma`: el enum de 8 no crece) con el detalle «**Pedido** es un objeto; aquí figura como proceso» y dos acciones: «Renombrar la existente» (edición en token) y «Usar otro nombre» | `editor-opl.test` |
| T-161 ★ | FALTA | Plantilla COND-ALT (solo parseo) | `analizar.test` |
| T-165 | FALTA | TS3 sobre vacío ⇒ `crear-entidad` por tipografía + `sincronizar-estados` + efecto | `roundtrip-matriz.test` |
| T-166 ★ | CONTRADICE | `crear-refinamiento` crea o confirma la descomposición, crea los subprocesos que faltan y fija bandas; miembro existente ajeno ⇒ `referencia-ambigua` (DR-35) | `editor-opl.test` |
| T-170 ★ | FALTA | Residual SE1 en el analizador (paso 5) | `analizar.test` |
| T-182 ★ | PARCIAL | Una sola codificación del efecto (TS3 compacto); `crear-enlace` idempotente por tipo + extremos; comparación contra la proyección del OPD (no contra el modelo crudo) | `editor-opl.test`, e2e 26 |
| T-192 ★ | PARCIAL | Enumeración de la matriz desde vacío (~600 casos) + tabla 9.2 + documento completo (pasadas A/B) | `roundtrip-*.test` |
| T-228 ★ | CONTRADICE | Diagnóstico solo en su panel; el SVG semántico no tiene capa de validación; `CapaUi` separada | `exportar.test`, e2e 18 |
| T-263 ★ | PARCIAL | Un solo código `proceso-sin-transformacion` (warning) que cuenta herencia y subprocesos; se retira el duplicado `error` | `diagnostico.test` |
| T-268 ★ | CONTRADICE | La matriz no restringe la afiliación del manejador; `manejador-no-ambiental` es warning | `matriz.test`, `diagnostico.test`, e2e 23 |
| T-281 ★, T-283 ★ | PARCIAL | `canon-documento` HTML autocontenido con árbol + por OPD en preorden su SVG canónico y su OPL (DECISIONS 24); gates >25, <2 y error estructural, sin bloquear la edición | `exportar.test`, e2e 19 |
| T-284 | PARCIAL | Advertencias de cruces, atravesamientos y solapes calculadas sobre la escena al exportar | `exportar.test` |

Los que el crítico encontró en CUMPLE (T-080, T-162, T-164, T-171, T-172, T-175, T-241, T-246,
T-247, T-248, T-251, T-262, T-265) se conservan con prueba propia en su WP; T-262 pasa a
invariante de forma (toda cosa tiene ≥1 aparición; el import ubica las huérfanas en el SD).

### 13.3 Dolores de UX de SYNTHESIS §7 y su mecanismo

| Dolor | Mecanismo |
|---|---|
| UX-01 editor OPL no idempotente | C7 (el editor libre no renombra), comparación contra la proyección, efecto con una sola codificación; e2e 26 |
| Lienzo al 42 %, toolbar desbordada, cuatro señales de guardado | lienzo + OPL ≥ 75 % a 1440×900; paleta flotante de 4 verbos; un indicador de guardado (§7.1) |
| Vista frágil (zoom que salta, cosas fuera de vista, `Ctrl+0` oculto) | cámara: encuadre al entrar la primera vez, restauración después, nunca se mueve al crear o renombrar salvo desplazamiento mínimo; botón ⤢ visible (§6.5, §7.1) |
| Puertas metodológicas obligatorias | ninguna: la metodología es diagnóstico (A1.1) |
| Descubribilidad (paleta de 60 ítems, menús sin Renombrar/Eliminar/Estado/Conectar, ids internos en el inspector) | menú contextual y atajos derivados del mismo registro de comandos; inspector sin ids; `Ctrl+K` solo busca cosas y OPDs |
| Estados (renombre sin foco, menú que se cierra, línea que cruza el rótulo, backticks literales) | `S` y `F2` abren el campo con foco; el extremo estado se elige arrastrando hasta la cápsula (no hay submenú de estado que se cierre); el enlace ancla en el borde de la cápsula; tokens OPL con estilo, nunca backticks crudos |
| «(1 oraciones)», glifos de Mac en Linux | pluralización en `vocabulario.ts`; atajos mostrados según plataforma (`Ctrl` o `⌘`) |
| Cadenas de regresión del histórico (§7.2): estados x/y, barra de simulación, dirección del efecto, placeholders, flechas, puertos, viewport, `?` | geometría de estados derivada; sin simulación; una sola dirección del efecto; sin placeholders; marcadores literales con golden; sin puertos persistidos; un solo servicio de cámara; `?` mapeado y probado en códec, matriz y OPL |

### 13.4 Distinciones que este diseño se niega a colapsar

1. **Quitar de este OPD ≠ eliminar del modelo** (T-251): dos operaciones, dos atajos, dos textos.
2. **Forma ≠ contexto** (DR-C8): lo irrepresentable se rechaza; lo inválido en contexto se carga y
   se marca.
3. **`unsupported-canonical` ≠ `non-canonical` ≠ `syntax-error`**: canónico no soportado (warning,
   no muta), no canonizado (error), no reconocido (error); tres tablas distintas.
4. **Consumo + resultado ≠ efecto**; **TS4/TS5 escindido ≠ standalone** (la procedencia se guarda
   en `escision`).
5. **Colección incompleta declarada ≠ de vista** (dato frente a marca derivada).
6. **Contenedor, interno y externo** como alcance persistido; la geometría no lo cambia.
7. **Canónico ≠ display** (esencia, numeración, cabeceras).
8. **Etiqueta `SDx.y` (derivada) ≠ id de OPD (estable)**.
9. **Bidireccional ≠ recíproco** (recíproco solo con etiquetas iguales, con traza).
10. **Abstracción por fuerza** con la matriz R-PREC completa, no «el más fuerte gana».
11. **AP-27 error ≠ warning** según los transformadores previos sean omisibles.
12. **Evento de objeto ambiental** puede quedar en el contorno; el de objeto sistémico no.
13. **Advertir ≠ bloquear**: solo `error` bloquea, y solo el export canónico, nunca la edición.

### 13.5 Riesgos propios de este diseño

| Riesgo | Probabilidad / impacto | Mitigación |
|---|---|---|
| La enumeración de la matriz crece más allá de lo ejecutable | media / media | dimensiones por pares (no producto completo) para abanico × control × multiplicidad; tope de 2 s en `roundtrip-matriz.test`; falla si se excede |
| El orden por nombre (DR-C1) sorprende al operador acostumbrado al orden de creación | alta / baja | es determinista y estable; el canon solo pide determinismo (R-COMP-ELEG-3); declarado en `decisiones.md` |
| Las métricas de la tabla no coinciden con el render de Chromium y los rótulos desbordan | media / media | la tabla se genera desde el woff2 real; e2e 5 compara `getBBox()` de tres rótulos con la métrica (tolerancia 2 %) |
| Un agente externo escribe un v0 con pérdidas y se sorprende con 422 | media / baja | el 422 trae el informe completo; `?aceptarPerdidas=1` es explícito; documentado en `formato-v0.md` |
| El mutex en memoria supone un solo proceso | baja / alta | `container_name` fijo y un solo servicio; `compose up` detiene el viejo antes de iniciar el nuevo; el CAS por contenido detecta cualquier escritura concurrente residual |
| Pérdidas del migrador no vistas por el operador | media / alta | ensayo obligatorio con revisión humana del INFORME e informes por modelo (§9.4-4); originales archivados; volumen PostgreSQL conservado sin montar; rollback por tag |
| El cambio de flujo (sin pestañas, versiones, simulación ni tabla de enlaces) incomoda al operador | alta / media | decisiones del dueño (DECISIONS 6, 7, 9, 10) declaradas en `decisiones.md`; sustitutos concretos (previas, lista simple, inspector «Enlaces (N)», búsqueda) |
| Rechazar TS1 + TS2 del mismo par en OPL (en vez de fusionarlos como hace el import) | media / baja | la razón visible lleva la acción «usa `cambia … de … a …`»; mantiene una sola codificación del hecho y la idempotencia (T-182) |
| Multiplicidad limitada a `?`, `*`, `+` pierde datos numéricos existentes | media / media | cada pérdida queda en el informe (B-11); el JSON original queda archivado |
| Veinte paquetes y un cambio de golpe en producción | media / alta | rama aislada, pruebas primero, e2e contra el build real, transición con ensayo y rollback (§9.4); **una suite verde no equivale a validación humana del modelado**: la aceptación final exige que el operador abra, recorra y edite tres modelos grandes migrados antes de retirar el stack viejo |
