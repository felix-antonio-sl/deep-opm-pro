# DESIGN — OpForja rehecho (diseño final)

Síntesis de los tres diseños de arquitectura y de los veredictos de los tres jueces (puntaje
agregado: C 23,4 · A 20,5 · B 18,6). **Base: DESIGN-C** (conformidad por construcción: una
matriz, una gramática, roundtrip demostrado por enumeración). Se injertan de A la austeridad y la
honestidad del registro, y de B la fluidez del experto. Además se resuelve cada bandera roja
(§13.5).

Autoridades: `understand/CANON.md` (alcance y semántica; T-NNN, DR-n) y, ante duda, los cuatro
documentos del canon; `DECISIONS.md` (fijas, no se reabren); `understand/SYNTHESIS.md` §7, §8 y §10
(dolores, riesgos de sobresimplificación, estado real de cada ★). Este documento **elige**: no
deja «podría». Donde fija un tipo o una firma TypeScript, ese texto es el **contrato común** de
los paquetes de trabajo (§12). Un agente que necesite cambiar un contrato lo propone en el
`HANDOFF.md` y no lo cambia en solitario.

Tesis en una línea: **lo ilegal no se valida, no se puede escribir**. Lo que el tipo no puede
expresar lo decide una sola matriz. Esa matriz la consultan, sin copias, el menú del lienzo, las
operaciones, el planificador OPL, el diagnóstico y el importador. La simetría OPD↔OPL se
**demuestra** enumerando esa misma matriz. El importador **nunca** rechaza un modelo por violar el
canon: lo carga y lo marca. Solo rechaza lo que no puede leer.

---

## 1. Principios y alcance

### 1.1 Principios (vinculantes para todo el repo)

| # | Principio | Consecuencia concreta |
|---|---|---|
| P1 | **Un solo núcleo de hechos** (T-010). OPD y OPL son funciones puras del `Modelo`. | No se persiste nada derivado: ni enlaces «derivados», puertos, vértices, posiciones de etiqueta, visibilidad por OPD ni geometría de estados. |
| P2 | **Irrepresentable antes que validado.** | Los enlaces se tipan por rol: `control` solo existe donde es legal, `ruta` solo en consumo y resultado, `mult` solo en el extremo legal. Los estados viven dentro del objeto (un proceso no tiene estados). `porDefecto` y `current` son un `Id` (a lo sumo uno por construcción). Hay una aparición por (cosa, OPD) porque el diccionario se indexa por `cosaId`. El refinamiento vive en el OPD. La especialización de estado es un par (ambos o ninguno). |
| P3 | **Una matriz, cinco consumidores.** `nucleo/matriz.ts` es la única definición de qué enlace es legal. | La consultan el menú del lienzo, las operaciones, el planificador OPL, el diagnóstico y el importador. Desaparece la clase de bugs «la UI ofrece lo que el núcleo rechaza». |
| P4 | **Una gramática, dos direcciones.** Cada plantilla OPL se declara una vez en `opl/plantillas.ts`. | El generador la rellena y el analizador la reconoce con el mismo patrón. |
| P5 | **Roundtrip demostrable.** | La suite enumera las combinaciones legales de la matriz y un generador aleatorio con semilla, y exige R-§19-SIM-1 y SIM-3 en cada caso. |
| P6 | **El orden semántico es dato; la geometría lo realiza.** | Bandas, orden de estados y orden de OPD hermanos son campos. Ninguna coordenada decide un hecho. |
| P7 | **Silencio cero.** | Toda operación rechazada devuelve `Rechazo {codigo, regla, mensaje, accion}`. Todo ajuste automático deja `Traza` (R-OPD-OP-5). Todo campo no representado al importar queda en el informe. |
| P8 | **Importar es cargar, no juzgar.** | Una violación canónica representable se carga y se marca `error` (bloquea el export canónico, no la edición; T-288). Una violación no representable se descarta **solo en ese elemento**, con informe. El documento entero se rechaza solo por JSON inválido, `formato` distinto, referencias rotas o ids duplicados dentro de una colección (CC-07, CC-09: el árbol de `padreId` se sana como en v0). |
| P9 | **Sustracción.** | Una pantalla de edición, catorce superficies en total (§7.2). Solo la infraestructura mínima de DECISIONS, además de lo que el canon exige. |

### 1.2 Qué entra (CANON §0.1, ni más ni menos)

1. Núcleo único con cosas (objeto y proceso), estados con designaciones y supresión en dos
   niveles, enlaces (15 tipos en 6 familias), abanicos XOR/OR, árbol de OPDs y apariciones. El árbol
   tiene raíz SD y admite descomposición de proceso con bandas y despliegue en cuatro modos.
2. Impedir lo prohibido y advertir lo condicionado o metodológico con diagnóstico tipado (código,
   regla, severidad, familia, acción canónica, referencias).
3. Generar el OPL-ES canónico por OPD y parsearlo al mismo hecho. El editor OPL tiene 4 estados de
   línea, 8 razones cerradas y aplicación todo-o-nada.
4. Render OPD con el vocabulario visual cerrado:
   - 8 representaciones de cosa;
   - estados con designaciones y el chip `⋯N`;
   - 6 decoraciones de extremo y 4 triángulos;
   - arcos XOR/OR, marcas `e c / //`, multiplicidad, ruta y duración.
5. Operaciones de refinamiento con migración y escisión, con identidad persistente.
6. Export `canon-diagrama` (SVG por OPD, con la fuente incrustada), `canon-documento` (HTML
   autocontenido), OPL Markdown y JSON `deep-opm-pro.modelo.v0`.
7. Registro de conformidad (R-CONF-7) en `docs/conformidad.md`.
8. Infraestructura mínima (DECISIONS):
   - una cuenta, con token Bearer opcional para agentes externos;
   - biblioteca en lista simple: nuevo, abrir, renombrar, eliminar a papelera, restaurar, importar
     JSON u OPL, descargar;
   - guardado automático con CAS, copias previas rotadas en el servidor sin UI y borrador local;
   - búsqueda mínima por nombre;
   - selección múltiple mínima sin portapapeles;
   - deshacer y rehacer por instantáneas inmutables.

### 1.3 Qué no entra (CANON §0.4 + DECISIONS)

Nada de lo siguiente se implementa:

- Simulación y todo canal runtime, y bilingüismo.
- Sub-modelos, composición y referencias externas.
- El Anexo C categorial, salvo la ley ejecutable de frontera (T-089).
- Bocetos, Apunte, Taller, Graduar, Biblioteca, versiones y carpetas.
- Estereotipos, requisitos, vitrinas e injerto. Anclaje, drift y calcar.
- La capa computacional: alias, unidades en el nombre, tipos, rangos, `donde`, `varía de`.
- `Pr=p`, m-de-f, negación, demora, RF2o y el sufijo `[etiqueta: …]`.
- Las oraciones compuestas (ejes a y c), el semi-plegado y CX4–CX8.
- Vistas tipificadas, mapa y `Bring`. Estilado autoral, imágenes y URLs. Preset de esencia.
- Agente LLM, tutor, mesa y CLI `mesa`, revisión compartida, lector y paquete portátil, captura de
  bugs, modo móvil de solo lectura y PNG.
- Pestañas de modelos, paleta de comandos, portapapeles, alinear y distribuir.

Tres construcciones canónicas quedan diferidas por DECISIONS 1–3 y se declaran en el registro:

- RX1/RX2 (DR-10): `unsupported-canonical`.
- Descomposición de objeto (DR-23): no se ofrece; el parser responde `unsupported-canonical`.
- Agente humano (DR-5): se exige objeto físico como proxy.

### 1.4 Idioma y nomenclatura

La UI, el OPL y la documentación van en es-CL. El código de dominio usa el vocabulario del canon en
español, de forma consistente: tipos, campos, funciones y archivos (`Objeto`, `Consumo`,
`descomponer`, `proyectar`, `bandas`), como el formato v0 y CANON §1.2. Las reglas de escritura son
estas:

- Los identificadores van en ASCII, sin tildes ni `ñ`.
- Los **valores** conservan su grafía (`'año'`).
- Solo quedan en inglés los nombres que impone la plataforma (`fetch`, `useState`, `Bun.serve`,
  cabeceras HTTP).
- Los valores del formato v0 conservan su grafía histórica (`"condicion"`, `"O"`, `"default"`,
  `backwardTag`), porque el contrato de intercambio no cambia.

### 1.5 R-CONF-7: registro de conformidad

`docs/conformidad.md` es el único documento de conformidad del repo. Tiene tres tablas:

1. **Brechas** (exhaustiva). Contiene toda regla DEBE o NO DEBE cuyo estado no es `enforzado`, con
   estas columnas:
   - `regla`;
   - `estado` (R-APP-2: `parcial` | `no implementado` | `zona laxa pendiente`);
   - `superficies` (U·N·I·G·P·X, R-APP-3);
   - `qué hace el producto`;
   - `decisión`.

   El contenido inicial exacto está en §11.3.
2. **Trazabilidad ★**. Cada requisito ★ lleva a su mecanismo, su WP y su prueba. Es la tabla de
   §12.6, que se mantiene junto al código.
3. **Bisimetrías parciales** (R-§19-ROT-1): la lista cerrada de §5.9.

La brecha silenciosa se evita por construcción, no por prosa (DECISIONS 16: no hay test
autorreferente de prosa):

- Lo no implementado vive en tres tablas de código, y cada fila lleva su `regla`, su `motivo` y su
  `registro: 'B-nn'`:
  - `NO_OFRECIDO` en `nucleo/matriz.ts`;
  - `NO_SOPORTADAS` y `NO_CANONIZADAS` en `opl/no-soportadas.ts`.
- Cada fila se prueba **por su comportamiento**: la UI no la ofrece, el parser responde el código y
  la operación rechaza.
- Ninguna prueba lee `docs/`.
- `AGENTS.md` fija la disciplina de cambio: todo diff que toque esas tablas, el catálogo de
  diagnósticos o el estado de un DEBE actualiza `docs/conformidad.md` en el mismo commit.
- La lista de cierre del Anexo A (T-303) está transcrita en `AGENTS.md` (§11.2) como gate de
  revisión. Cada gate apunta a su suite (§10.1).
- El título de cada prueba que verifica un requisito empieza por su T-ID
  (`test('T-043 resultado nunca al estado inicial', …)`). Así la trazabilidad cita evidencia
  verificable con `bun test -t T-043`.

### 1.6 Decisiones de esta síntesis (DS-n)

Estas son las resoluciones que CANON.md no fija, o que ajustan una DR por una exigencia más fuerte
del canon. Todas van a `docs/decisiones.md` y, si tocan un DEBE, también a «Brechas».

| DS | Decisión | Origen · por qué |
|---|---|---|
| DS-1 | **Orden de oraciones por nombre** (colación `es`, sensibilidad base, luego id), salvo los subprocesos, que siguen sus bandas. | C1 = A P-2 = B DB-2. R-§19-SIM-3 exige un orden reproducible desde el texto; R-COMP-ELEG-3 solo pide determinismo. |
| DS-2 | **Mención mínima**: toda cosa visible en un OPD aparece en al menos una oración de su bloque; si ninguna la menciona, se emite D2 (`**X** es informacional.`). | C2 = A P-3. R-BI-DUAL-1: un rectángulo aislado debe viajar por OPL (T-190). Desvía DR-2/T-106 («D2 no se emite»): registrado como B-27 (CC-27). |
| DS-3 | **Distribución al pasar de 0 a ≥1 subprocesos en una operación.** Después, la reasignación es del modelador (T-076), con `reanclarExtremo` uniforme (DS-9). No se persiste `migracionAutomatica`. | C3. T-076 dice «luego la reasignación es del modelador». La entrada encadenada de nombres (§7.3-10) crea todos los subprocesos en una operación, así que primero y último se aciertan en el gesto típico. |
| DS-4 | **Un TS3 con control, o que es rama de un abanico, no se escinde**: migra entero al primer subproceso, con traza. | B §4.6.4. AP-08: las mitades no admiten control. R-FAN-5A: la escisión rompería el abanico. |
| DS-5 | **`eliminarCosas` rechaza una cosa con refinamientos** (`tiene-refinamiento` · «Elimina primero su refinamiento»). Solo se eliminan OPDs hoja, vía `eliminarRefinamiento`. | A §4.3. T-083 ★ / R-REF-3. |
| DS-6 | **Quitar de este OPD nunca elimina del modelo.** Una cosa puede quedar sin aparición y un enlace puede quedar sin vista. Se diagnostican `cosa-sin-aparicion` y `enlace-sin-vista` (warning, «Traer a este OPD»). | A, B. T-262 («advertir cosas sin apariencia») presupone que existen. T-251: quitar ≠ eliminar, sin atajos. |
| DS-7 | **El import nunca renombra ni normaliza nombres.** Duplicados y nombres fuera del léxico se cargan tal cual como `error` (`nombre-duplicado`, `nombre-fuera-de-lexico`) con una **reparación sugerida** de un clic. | A, jueces. Apéndice F pide nombres idénticos entre OPD, OPL y JSON; T-025 prohíbe normalizar en silencio; SYNTHESIS §8-9 pide resolver explícitamente. |
| DS-8 | **Especialización de estado implementada**: una generalización entre objetos con par de estados (ambos o ninguno). Plantilla `{Ly:Oe} son {O} en {s}.` (EBNF `oracion_de_especializacion_estado`; la lista admite un elemento). | B. T-121 pasa a `enforzado`. |
| DS-9 | **Reanclar extremos en todos los tipos** con una operación, `reanclarExtremo`, que conserva el id. Soltar el asa del objeto en una de sus cápsulas cambia T1 a TS1. | B DB-10. R-OPD-EDIT-7 lo exige para estructurales; uniformar es más simple, y es la corrección más frecuente tras un in-zoom. |
| DS-10 | **Ruta en ramas de abanico admitida**: con alguna ruta, el abanico se emite como una oración por enlace (R-COMB-5). El operador XOR/OR no viaja por OPL: es una bisimetría parcial declarada. | A, B. Reduce una brecha a una bisimetría declarada y no descarta datos del modelador. |
| DS-11 | **Edición OPL con alcance = OPD activo.** El panel muestra todo el modelo. | C6. |
| DS-12 | **El editor OPL libre no renombra.** Renombrar se hace sobre el token (R-OPL-EDIT-7) o en el lienzo. | C7 = A P-16. Elimina la identidad posicional (UX-01). |
| DS-13 | **Dos SE1 inversas del mismo bloque se leen como un SE3.** Si las etiquetas son iguales, recíproco. | C9 = A P-21. |
| DS-14 | **Unicidad nominal sin distinguir mayúsculas** (clave `claveNombre`, sensible a acentos). | C11. DR-22. |
| DS-15 | **Frases de multiplicidad literales**: `un opcional` / `una opcional`, `opcional (cero o más)`, `al menos un` / `al menos una`. | C12. R-MULT-1. |
| DS-16 | **Eliminar un refinamiento materializa en el padre la vista abstraída** de los enlaces con el exterior. | C14 = A P-8. DR-17. |
| DS-17 | **RF2b sin coma**: se genera `{O} exhibe {Ly:O} así como {Ly:P}.` (reglas manda en plantillas) y se aceptan ambas formas al parsear. | A. |
| DS-18 | **OPD no representable ⇒ se descarta el OPD, nunca los hechos.** Aplica a Boceto, vista, OPD suelto o descomposición de objeto que choca con un despliegue: sus cosas, estados y enlaces siguen en el modelo, y las cosas pueden quedar sin aparición. La **descomposición de objeto** sin despliegue previo se convierte en `despliegue` por agregación **sin crear enlaces**, conservando apariciones y posiciones. | A P-20 más la corrección de C4. No se inventan hechos y no se pierden datos del modelador. |
| DS-19 | **Negación v0 (`modificador: "no"`) ⇒ se descarta el enlace entero**, con informe. | A 4.7: conservarlo sin `no` invertiría el hecho. |
| DS-20 | **Cierre de operaciones**: una operación se rechaza si el modelo resultante tiene un error de contexto de la matriz que el de entrada no tenía. Hay una excepción: `moverSubproceso` (T-269, AP-27: lo que surge por reordenar queda como error recuperable). | Uniforma el revalidar de `fijarEsencia`, `cambiarTipoCosa`, `eliminarEstado` y `reanclarExtremo` en una sola regla. |
| DS-21 | **Fuente incrustada**: `canon-diagrama` y `canon-documento` llevan Inria Serif regular e itálica (subconjunto latino, woff2 en base64). Las métricas salen de una tabla generada en Chromium. | A, B. AP-23 y R-OPD-LAY-8 en cualquier visor. |
| DS-22 | **Cámara**: al cambiar de OPD siempre se encuadra el bbox real (zoom ≤ 1). Crear, renombrar o aplicar OPL nunca mueven la cámara, salvo el desplazamiento mínimo para mostrar lo creado fuera de vista. | T-231 (DEBE). Se corrige C §6.5. |
| DS-23 | **Un solo dibujo, dos adaptadores**: `opd/dibujo.ts` produce un árbol `NodoSvg`. El lienzo lo convierte a vnodes de Preact (identidad por `key`) y el export lo serializa a cadena. | Sin `preact-render-to-string` ni `innerHTML`; se prueba en Bun sin DOM. |
| DS-24 | **Unidad de tiempo por defecto `min`.** | R-EXC-5 exige un default; A P-15. |
| DS-25 | **Colocación en el núcleo** (`nucleo/colocacion.ts`), porque las operaciones y el OPL deben dejar apariciones con posición. | C §6.5. |
| DS-26 | **D1 y D4 concuerdan en género**: `**Bodeguero** es físico.` · `**Caja** es física.`, con el género de la cosa (masculino por defecto, femenino si `genero: 'f'`). El parser acepta ambas formas para cualquier cosa. | Decisión del dueño (DECISIONS 25, 2026-10-02). R-OPL-1 fija el género gramatical; las plantillas de reglas §4.4 usan «Cosa», femenino. |

---

## 2. Arquitectura

### 2.1 Árbol del repositorio final

Los presupuestos se cuentan en líneas no vacías de fuente. Las pruebas van junto al módulo
(`x.test.ts`) y su presupuesto está en §2.3.

```
/
├── README.md                 qué es, cómo correr, límites reales                         ~80
├── AGENTS.md                 contrato de trabajo (texto íntegro en §11.2)                ~60
├── CLAUDE.md                 @AGENTS.md                                                    1
├── NOTICE.md                 separación legal y licencias de dependencias                ~20
├── Dockerfile  docker-compose.yml  .dockerignore  .gitignore
├── deploy/
│   ├── deploy.sh             único circuito de despliegue (§9.3)                         ~50
│   ├── deploy.test.ts        stubs de git/docker/curl                                    ~90
│   ├── respaldo.sh           tar.gz del volumen, retención 14 días                       ~20
│   └── systemd/opforja-respaldo.{service,timer}                                          ~20
├── canon/                    AUTORIDAD LOCAL (DECISIONS 16), tal cual
│   ├── LEEME.md              slug · versión · sha256 · precedencia                       ~25
│   ├── reglas-opm-estrictas-es/{content.md,object.yaml}      1.5.0
│   ├── spec-forja-opd-es/{content.md,object.yaml}            1.4.0
│   ├── spec-forja-opl-es/{content.md,object.yaml}            1.4.1
│   └── metodologia-forja-opm-es/{content.md,object.yaml}     1.7.0
├── docs/
│   ├── README.md  especificacion.md  conformidad.md  guia.md  formato-v0.md  operacion.md  decisiones.md
└── app/
    ├── package.json  bun.lock  bunfig.toml  tsconfig.json  vite.config.ts  index.html  playwright.config.ts
    ├── src/
    │   ├── nucleo/           DOMINIO OPM PURO (sin DOM ni fetch)                         ≈3 900
    │   │   ├── tipos.ts          tipos exactos §3.1 + extremos()                           240
    │   │   ├── resultado.ts      Resultado, Rechazo, Traza, Hecho, Tx                       90
    │   │   ├── ids.ts            asignación por secuencia, validación                       40
    │   │   ├── indice.ts         Indice memoizado, claveNombre, buscarPorNombre, describirEnlace  220
    │   │   ├── lexico.ts         léxico EBNF, sugerirNombre, y/e o/u                       150
    │   │   ├── herencia.ts       cadena transitiva de generales (DR-43)                     50
    │   │   ├── matriz.ts         MATRIZ, contexto, NO_OFRECIDO, tiposLegales, erroresContexto  440
    │   │   ├── forma.ts          validarForma §3.2                                         160
    │   │   ├── modelo.ts         crearModelo, renombrar, unidad, descripción                50
    │   │   ├── cosas.ts          crear/renombrar/tipo/esencia/…/traer/mover/quitar/eliminar  330
    │   │   ├── estados.ts        agregar/renombrar/mover/eliminar/designar/suprimir        170
    │   │   ├── enlaces.ts        crear, cambiar tipo, fijar*, reanclar, eliminar           340
    │   │   ├── abanicos.ts       formar/operador/ramas/disolver/control                    140
    │   │   ├── refinamiento.ts   descomponer, subprocesos, bandas, distribuir, desplegar, eliminar  450
    │   │   ├── proyeccion.ts     Vista por OPD, abstracción, fuerza, SDx.y, preorden       360
    │   │   ├── colocacion.ts     hueco libre, contenedor, bandas, externos, despliegue      220
    │   │   ├── diagnostico.ts    CATALOGO, diagnosticar, gatesExportacion                  420
    │   │   └── operaciones.ts    OPERACIONES, Accion, aplicarAccion                         60
    │   ├── codec/            deep-opm-pro.modelo.v0                                      ≈1 150
    │   │   ├── v0.ts             tipos laxos de entrada, tablas de mapeo                   120
    │   │   ├── importar.ts       etapas §3.4.2                                             680
    │   │   ├── exportar.ts       forma canónica determinista §3.4.3                        230
    │   │   ├── informe.ts        Informe, recorrido de campos no representados              70
    │   │   └── canonico.ts       leerCanonico, revision (sha256)                            50
    │   ├── opl/              OPL-ES                                                      ≈2 600
    │   │   ├── vocabulario.ts    palabras cerradas, unidades es-CL, multiplicidad, y/e o/u 120
    │   │   ├── linea.ts          TokenOpl, LineaOpl, constructor                            80
    │   │   ├── plantillas.ts     TABLA ÚNICA (generar y reconocer)                         540
    │   │   ├── generar.ts        emisión por OPD                                           480
    │   │   ├── analizar.ts       normalización, spans, plegado, esqueletos, listas         480
    │   │   ├── planificar.ts     HechoTexto → Patch contra la vista; 4 estados; razones    380
    │   │   ├── aplicar.ts        Patch → Accion, 3 fases, atómico                          200
    │   │   ├── documento.ts      OPL de modelo completo y su parseo (pasadas A/B)          190
    │   │   └── no-soportadas.ts  NO_SOPORTADAS, NO_CANONIZADAS                             90
    │   ├── opd/              OPD: escena pura + dibujo                                   ≈1 700
    │   │   ├── tokens.ts         paleta, trazos, dashes, tipografía (§18)                   70
    │   │   ├── metricas.ts       GENERADO: tabla de avances Inria Serif; medir/envolver     60 (+tabla)
    │   │   ├── fuente.ts         GENERADO: woff2 base64 regular e itálica (no cuenta)       —
    │   │   ├── geometria.ts      recortes, peine, rayo, lazo, arcos, cruces                340
    │   │   ├── escena.ts         escena(m, opd) → Escena                                   500
    │   │   ├── marcadores.ts     paths literales (§6.4)                                     90
    │   │   ├── dibujo.ts         dibujar(escena, modo) → NodoSvg; aTexto                   380
    │   │   └── exportar.ts       canon-diagrama, canon-documento(lineas), advertencias, gates  180
    │   ├── editor/           ESTADO DE APLICACIÓN (sin JSX)                              ≈1 500
    │   │   ├── almacen.ts        store mínimo {obtener, fijar, suscribir} + useAlmacen      60
    │   │   ├── estado.ts         EstadoEditor, ejecutar, historial, selección, franja      240
    │   │   ├── comandos.ts       registro único (menús, atajos, ayuda)                     380
    │   │   ├── atajos.ts         despacho de teclado por contexto                           90
    │   │   ├── cliente.ts        cliente HTTP (fetch inyectado)                            140
    │   │   ├── guardado.ts       autoguardado, CAS, borrador IndexedDB, conflicto          240
    │   │   └── gestos.ts         máquina de estados del lienzo (reductor puro)             350
    │   ├── ui/               PREACT                                                      ≈3 450 + CSS 450
    │   │   ├── App.tsx  Acceso.tsx  Biblioteca.tsx  InformeImportacion.tsx               110+70+250+120
    │   │   ├── Editor.tsx        cabecera + disposición + modos                             200
    │   │   ├── Lienzo.tsx        <svg>, cámara viewBox, eventos → gestos                   400
    │   │   ├── SvgPreact.tsx     NodoSvg → vnodes (key = data-ref)                          30
    │   │   ├── CapaUi.tsx        selección, asas, fantasmas, guías, realce                 180
    │   │   ├── NombreEnLinea.tsx edición en figura, colisión, encadenado                   150
    │   │   ├── MenuTipoEnlace.tsx tipos legales, segundo gesto, no disponibles, vista previa 170
    │   │   ├── MenuContextual.tsx derivado de comandos                                     80
    │   │   ├── Inspector.tsx     cosa / estado / enlace / abanico / OPD / n elementos     480
    │   │   ├── ArbolOpd.tsx  PanelOpl.tsx  EditorOpl.tsx  PanelDiagnostico.tsx          110+260+210+120
    │   │   ├── Buscar.tsx  Dialogo.tsx  MenuExportar.tsx  Ayuda.tsx  Franja.tsx          110+130+90+70+60
    │   │   └── estilos.css       tokens como variables CSS                                 450
    │   ├── pruebas/          SOLO PRUEBAS (no se empaqueta)
    │   │   ├── constructores.ts  modeloCon(...) literal, must(), porNombre()               200
    │   │   ├── azar.ts           generador determinista (semilla; perfiles estricto/completo) 260
    │   │   └── expectativas-matriz.ts  tabla transcrita a mano de CANON §2.1/§2.2          220
    │   ├── arquitectura.test.ts  dirección de dependencias (§2.2)
    │   └── main.tsx                                                                        20
    ├── servidor/             BUN.SERVE (depende solo de codec → nucleo)                  ≈1 000
    │   ├── principal.ts  sesion.ts  almacen.ts  cuenta.ts                              260+180+240+80
    ├── fixtures/v0/          los 6 *.json de fixtures/demo-models (git mv) + sintetico.json (generado)
    ├── e2e/                  26 escenarios Playwright + ayudas.ts
    └── herramientas/
        ├── dev.ts            vite (5173, proxy /api y /salud) + servidor (8787, --datos .datos-dev)   25
        ├── medir-fuente.ts   mide en Chromium y regenera opd/metricas.ts y opd/fuente.ts (manual)    80
        └── migrar-postgres.ts  migración única §8.6 (codec + nucleo; se compila a servidor/ en la imagen)  280
```

### 2.2 Dirección de dependencias

```
nucleo ──► codec ──► servidor
   ├─────► opl ──┐
   └─────► opd ──┴──► editor ──► ui
```

- `nucleo` no importa nada del repo. `codec`, `opl` y `opd` importan solo `nucleo`.
- **`opl` y `opd` no se importan entre sí.** La vista previa OPL del menú de enlaces la compone `ui`.
  `opd/exportar.ts#exportarDocumento` recibe las líneas OPL ya generadas por parámetro.
- `editor` importa `nucleo`, `codec`, `opl` y `opd`. `ui` importa todo lo anterior salvo `servidor`.
  `servidor` importa solo `codec` y, a través de él, `nucleo`. `pruebas/` solo lo importan pruebas.
- `herramientas/migrar-postgres.ts` (herramienta de un solo uso, CC-19) importa `codec` y `nucleo`
  (`diagnosticar` para el informe); nada la importa. `herramientas/dev.ts` y `medir-fuente.ts` no
  importan código de dominio.
- `src/arquitectura.test.ts` (40 líneas) recorre los `import` con una expresión regular y falla ante
  una arista fuera de la tabla. No escribe en disco.
- Dependencias de ejecución:
  - `preact`;
  - `@fontsource/inria-serif`: fuente del lienzo; `herramientas/medir-fuente.ts` lee sus woff2.
- Dependencias de desarrollo: `vite`, `@preact/preset-vite`, `typescript`, `@types/bun` y
  `@playwright/test`.
- Se retiran `jointjs`, `zustand`, `ai`, `@ai-sdk/*`, `eslint` y sus plugins, Inria Sans y
  JetBrains Mono.

### 2.3 Totales estimados

| Área | Fuente | Pruebas |
|---|---:|---:|
| nucleo | 3 900 | 2 900 |
| codec | 1 150 | 950 |
| opl | 2 600 | 1 900 (incluye enumeración de la matriz y `azar`) |
| opd | 1 700 | 750 + 40 golden SVG |
| editor | 1 500 | 600 |
| ui | 3 450 + 450 CSS | — (cubierta por e2e) |
| servidor | 1 040 | 750 |
| pruebas/ (infraestructura) | — | 680 |
| e2e | — | 1 450 |
| **Total** | **≈15 340 + 450 CSS** | **≈9 980** |

Frente a ~133 k de fuente y ~70 k de pruebas actuales, esto es un 12 % y un 14 %.

### 2.4 Rendimiento objetivo (modelo sintético de tamaño HODOM: 262 cosas, 192 estados, 433 enlaces, 36 OPDs)

| Operación | Objetivo | Medio |
|---|---|---|
| operación del núcleo, incluido el cierre DS-20 | < 3 ms | registros inmutables, `indice` memoizado por identidad de `Modelo` |
| `proyectar` de un OPD | < 3 ms | un recorrido de enlaces con el mapa `internoDe` |
| `escena` + `dibujar` de un OPD de ≤ 25 cosas | < 5 ms | escena pura; Preact difunde por `key` |
| `generarModelo` (36 bloques) | < 25 ms | memo por `(Modelo, opd)` |
| `diagnosticar` completo | < 30 ms | memo; en `requestIdleCallback` tras cada cambio |
| `importarV0` y `exportarV0` | < 150 ms y < 20 ms | una pasada por colección |
| `planificar` de 1 000 líneas | < 60 ms | ensayo sobre copia |

`src/rendimiento.test.ts` construye el modelo con `pruebas/azar.ts` (semilla fija, perfil
`hodom`) y falla si una medición supera **3×** su objetivo.

---

## 3. Modelo de datos interno

### 3.1 Tipos TypeScript exactos (`nucleo/tipos.ts`) — CONTRATO

Todo es `readonly`. Las operaciones devuelven modelos nuevos con estructura compartida. El
`tsconfig` es estricto (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
`noImplicitReturns`, `noFallthroughCasesInSwitch`).

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
export type Designacion = 'inicial' | 'final' | 'porDefecto' | 'current';

// ---------- Cosas y estados ----------
export interface Estado {
  readonly id: Id;
  readonly nombre: string;          // léxico: una palabra que empieza en minúscula (se diagnostica, no se fuerza)
  readonly inicial?: true;          // 0..* por objeto, combinable con final (D10)
  readonly final?: true;
  readonly suprimido?: true;        // supresión global (T-018)
}
interface CosaBase {
  readonly id: Id;
  readonly nombre: string;          // léxico EBNF; único sin distinguir mayúsculas (se diagnostica)
  readonly esencia: Esencia;
  readonly afiliacion: Afiliacion;
  readonly genero?: 'f';            // ausente = masculino (R-OPL-1, T-035)
  readonly descripcion?: string;    // meta: no emite OPL (T-004)
  readonly incompleta?: readonly RelacionIncompleta[];   // colección incompleta DECLARADA (sin duplicados)
}
export interface Objeto extends CosaBase {
  readonly tipo: 'objeto';
  readonly estados: readonly Estado[];   // el orden del arreglo es el orden del modelo (T-015)
  readonly porDefecto?: Id;              // ∈ estados: ≤1 por construcción (T-016)
  readonly current?: Id;                 // ∈ estados: ≤1 por construcción; declarado, jamás runtime (T-017)
  readonly valor?: string;               // valor puntual de atributo (T-020)
}
export interface Duracion {              // valores > 0; min ≤ esperada ≤ max cuando coexisten
  readonly min?: number; readonly esperada?: number; readonly max?: number;
  readonly unidad?: UnidadTiempo;        // ausente = unidad del modelo (R-EXC-5)
}
export interface Proceso extends CosaBase {
  readonly tipo: 'proceso';              // sin campo estados: estado de proceso irrepresentable (AP-12, T-059)
  readonly duracion?: Duracion;          // T-021
}
export type Cosa = Objeto | Proceso;

// ---------- Enlaces: extremos nombrados por rol; la dirección canónica es la del tipo ----------
interface EnlaceBase { readonly id: Id }
interface Procedimental extends EnlaceBase {
  readonly objeto: Id; readonly proceso: Id;
  readonly mult?: Multiplicidad;         // siempre en el extremo objeto (R-MULT-1A)
}
export interface Consumo extends Procedimental {
  readonly tipo: 'consumo'; readonly estado?: Id; readonly control?: Control; readonly ruta?: string;
}
export interface Resultado extends Procedimental {         // sin control: AP-01/AP-02 irrepresentables
  readonly tipo: 'resultado'; readonly estado?: Id; readonly ruta?: string;
}
export interface Efecto extends Procedimental {            // T3 | TS3 | TS4 | TS5 según entrada/salida
  readonly tipo: 'efecto'; readonly entrada?: Id; readonly salida?: Id; readonly control?: Control;
  readonly escision?: { readonly par: Id; readonly mitad: 'entrada' | 'salida' };   // R-ESCIND-0, T-032
}
export interface Agente extends Procedimental {
  readonly tipo: 'agente'; readonly estado?: Id; readonly control?: Control;
}
export interface Instrumento extends Procedimental {
  readonly tipo: 'instrumento'; readonly estado?: Id; readonly control?: Control;
}
interface EntreProcesos extends EnlaceBase { readonly origen: Id; readonly destino: Id }
export interface Invocacion extends EntreProcesos { readonly tipo: 'invocacion' }            // origen === destino ⇒ IV2
export interface Excepcion extends EntreProcesos {                                           // origen = fuente; destino = manejo
  readonly tipo: 'excepcionSobretiempo' | 'excepcionSubtiempo';                              // nunca control (R-EXC-1B)
}
interface Estructural extends EnlaceBase { readonly refinable: Id; readonly refinador: Id }  // vértice → base del triángulo
export interface Agregacion extends Estructural {          // todo → parte
  readonly tipo: 'agregacion'; readonly mult?: Multiplicidad;   // solo en la parte (DR-44)
}
export interface Exhibicion extends Estructural { readonly tipo: 'exhibicion' }             // exhibidor → rasgo
export interface Generalizacion extends Estructural {      // general → especialización
  readonly tipo: 'generalizacion';
  readonly estados?: { readonly general: Id; readonly especializacion: Id };   // ambos o ninguno (R-OPL-RF-3, DS-8)
}
export interface Clasificacion extends Estructural { readonly tipo: 'clasificacion' }       // clase → instancia
interface EtiquetadoBase extends EnlaceBase {
  readonly origen: Id; readonly destino: Id;
  readonly multOrigen?: Multiplicidad; readonly multDestino?: Multiplicidad;
}
export interface Etiquetado extends EtiquetadoBase {       // SE1/SE2, SSE1–3; origen === destino admitido
  readonly tipo: 'etiquetado'; readonly etiqueta?: string; readonly estadoOrigen?: Id; readonly estadoDestino?: Id;
}
export interface Bidireccional extends EtiquetadoBase {    // SE3, SSE4/5; etiqueta ≠ inversa
  readonly tipo: 'etiquetadoBidireccional'; readonly etiqueta: string; readonly inversa: string;
  readonly estadoOrigen?: Id;                              // solo en el origen (V-30, AP-11)
}
export interface Reciproco extends EtiquetadoBase {        // SE4/SE5, SSE6/7
  readonly tipo: 'reciproco'; readonly etiqueta?: string;
  readonly estados?: { readonly origen: Id; readonly destino?: Id };   // nunca solo destino (AP-11)
}

export type Enlace = Consumo | Resultado | Efecto | Agente | Instrumento | Invocacion | Excepcion
  | Agregacion | Exhibicion | Generalizacion | Clasificacion | Etiquetado | Bidireccional | Reciproco;
export type TipoEnlace = Enlace['tipo'];                   // 15 literales
export type EnlaceDe<T extends TipoEnlace> = Extract<Enlace, { readonly tipo: T }>;
export type EnlaceProcedimental = Consumo | Resultado | Efecto | Agente | Instrumento;
export type SinId<T> = T extends unknown ? Omit<T, 'id'> : never;
export type EnlaceNuevo = SinId<Enlace>;                   // candidato: lo construyen tiposLegales y el planificador OPL
export type Familia = 'transformadora' | 'habilitadora' | 'invocacion' | 'excepcion' | 'estructural' | 'etiquetada';

export function esProcedimental(e: Enlace | EnlaceNuevo): e is EnlaceProcedimental;   // (EnlaceNuevo ⇒ SinId<…>)
/** Extremos en la dirección del formato v0: consumo/agente/instrumento objeto→proceso; resultado/efecto
 *  proceso→objeto; estructurales refinable→refinador; invocación, excepción y etiquetados origen→destino. */
export function extremos(e: Enlace | EnlaceNuevo): { readonly origen: Id; readonly destino: Id };

// ---------- Abanicos ----------
export interface Abanico {
  readonly id: Id;
  readonly operador: Operador;
  readonly enlaces: readonly Id[];       // n ≥ 2 distintos; mismo tipo y extremo común (contexto, §4.3)
}

// ---------- OPDs: el refinamiento vive en el OPD hijo (fuente única) ----------
export interface Aparicion {             // clave = cosaId en Opd.apariciones: ≤1 por (cosa, OPD) (DR-25, T-023)
  readonly x: number; readonly y: number;          // enteros; esquina superior izquierda
  readonly ancho: number; readonly alto: number;   // tamaño mínimo declarado; el render lo expande (AP-23)
  readonly ocultos?: readonly Id[];                // supresión local de estados propios (LF-03)
}
interface OpdBase { readonly id: Id; readonly apariciones: Readonly<Record<Id, Aparicion>> }
export interface OpdRaiz extends OpdBase { readonly tipo: 'raiz' }
export interface OpdDescomposicion extends OpdBase {
  readonly tipo: 'descomposicion';
  readonly padre: Id; readonly cosa: Id;           // cosa: un proceso (descomposición de objeto diferida, DR-23)
  readonly orden: number;                          // orden entre hermanos (etiqueta SDx.y, DR-4)
  readonly bandas: readonly (readonly Id[])[];     // subprocesos; banda = paralelo; fuente de verdad del tiempo (T-030)
  readonly objetosInternos: readonly Id[];         // alcance persistido (T-033)
}
export interface OpdDespliegue extends OpdBase {
  readonly tipo: 'despliegue';
  readonly padre: Id; readonly cosa: Id; readonly orden: number;
  readonly modo: ModoDespliegue;
}
export type Opd = OpdRaiz | OpdDescomposicion | OpdDespliegue;

export interface Modelo {
  readonly id: Id;                                 // clave de almacenamiento (nombre de archivo)
  readonly nombre: string;                         // texto libre (no es nombre OPM)
  readonly descripcion?: string;
  readonly unidadTiempo: UnidadTiempo;             // default 'min' (DS-24)
  readonly raiz: Id;                               // opds[raiz].tipo === 'raiz'
  readonly cosas: Readonly<Record<Id, Cosa>>;
  readonly enlaces: Readonly<Record<Id, Enlace>>;
  readonly abanicos: Readonly<Record<Id, Abanico>>;
  readonly opds: Readonly<Record<Id, Opd>>;
  readonly secuencia: number;                      // siguiente N para ids nuevos
}

export type Ref = { readonly tipo: 'cosa' | 'estado' | 'enlace' | 'abanico' | 'opd'; readonly id: Id };
```

Lo **derivado, que nunca se persiste**, es esto:

- la perseverancia (T-014) y la etiqueta `SDx.y`;
- los refinamientos de una cosa (índice sobre `opds`) y el alcance contenedor, interno, externo o
  refinable;
- la visibilidad de los enlaces por OPD;
- la posición vertical de los subprocesos (por su banda);
- la geometría de estados, de rutas y de etiquetas;
- el extremo común de un abanico, la afiliación efectiva y la colección incompleta de vista.

### 3.2 Tres niveles de invariante

| Nivel | Qué cubre | Mecanismo | Si llega por import |
|---|---|---|---|
| **Tipo** | Estado solo en objetos. ≤1 por defecto y ≤1 current. Nunca c+e. Sin control en resultado, invocación, excepción ni estructural. Ruta solo en consumo y resultado. Multiplicidad nunca en el extremo proceso ni en el todo. Sin incompleta de clasificación. ≤1 aparición por (cosa, OPD). OPD siempre con su refinamiento. Bandas solo en descomposición y modo solo en despliegue. Especialización de estado: ambos o ninguno. Bidireccional o recíproco nunca con estado solo en el destino. | TypeScript | el importador lo mapea o lo descarta con informe |
| **Forma** (`validarForma`) | ver F-1…F-13 abajo | `nucleo/forma.ts` | se descarta el elemento (nunca el documento), con informe |
| **Contexto** (`erroresContexto` + `diagnosticar`) | reglas de §4.3.2, validez de abanicos, nombres duplicados o fuera de léxico, estados duplicados | `nucleo/matriz.ts`, `nucleo/diagnostico.ts` | se **carga** como `error` recuperable que bloquea el export canónico (T-288) |

`validarForma(m): readonly Violacion[]`, con `Violacion = { codigo: string; regla: string; mensaje: string; refs: readonly Ref[] }`:

- **F-1 Referencias.** Todo id citado existe: los estados de enlaces, `porDefecto`, `current` y
  `ocultos` pertenecen al objeto correcto. Las claves de `apariciones` son cosas. Existen `padre`,
  `cosa`, los miembros de `bandas` y de `objetosInternos`, las ramas de cada abanico y
  `escision.par`.
- **F-2 Categorías.** La clase de cada rol coincide con `MATRIZ[tipo].clases` y con `mismoTipo`.
  Los reflexivos solo se admiten si `MATRIZ[tipo].reflexivo`.
- **F-3 Estados de enlace.** Pertenecen al objeto del rol: en efecto, `entrada` y `salida` son del
  `objeto`; en generalización, `general` es del refinable y `especializacion` del refinador, y
  ambos son objetos. En etiquetados, cada estado es de su extremo.
- **F-4 Escisión.** `par` es un efecto sobre el mismo `objeto` que devuelve el `par` con la mitad
  opuesta. La mitad `entrada` tiene `entrada` y no tiene `salida`; la mitad `salida`, al revés.
  Ninguna mitad lleva `control` (AP-08).
- **F-5 No ofrecido.** Para todo enlace y todo abanico, `noOfrecido(m, e) === null` (§4.3.3).
- **F-6 Abanicos.** Tienen ≥2 ramas distintas, y cada enlace pertenece a ≤1 abanico. La coherencia
  de tipo y de extremo común es de contexto.
- **F-7 Árbol.** `opds[raiz]` es `raiz` y es el único OPD de ese tipo. Todo otro OPD tiene `padre`,
  y el árbol es acíclico. Cada cosa tiene ≤1 descomposición y ≤1 despliegue. Ningún OPD refina la
  cosa refinada de uno de sus ancestros (ciclo de refinamiento, R-REF-1, T-078; en el import ese OPD
  se descarta con su subárbol según DS-18, sin tocar los hechos, CC-24). El padre y el propio
  OPD contienen una aparición de `cosa`. En una descomposición, `cosa` es un proceso. Los `orden`
  de hermanos son `0..n-1`, densos.
- **F-8 Alcance.** Ninguna banda está vacía. Los miembros de `bandas` son procesos con aparición en
  el OPD, sin repetir y distintos del contenedor. Los `objetosInternos` son objetos con aparición y
  son disjuntos de `bandas`. Un interno no es interno de dos descomposiciones y solo aparece en su
  OPD y en los descendientes de este (método A3.3).
- **F-9 Ids.** Cada id es único en todo el modelo, incluidos los estados, y coincide con su clave
  de `Record`. `secuencia` es mayor que todo sufijo `-N` de los ids con forma `prefijo-N`.
- **F-10 Duración.** Sus valores son finitos y > 0, con `min ≤ esperada ≤ max`.
- **F-11 Etiquetas.** En `etiquetadoBidireccional`, `etiqueta` e `inversa` no están vacías y son
  distintas (si fueran iguales sería `reciproco`, R-STRE-1).
- **F-12 Tamaños.** `ancho` y `alto` son enteros ≥ 20 y las coordenadas son enteros finitos.
- **F-13 Valor.** Un objeto con `valor` es rasgo (refinador) de ≥1 exhibición (T-020; CC-03).

`validarForma` corre al final del importador, que debe dejarla vacía. También corre en el
`afterEach` de toda suite del núcleo y, en desarrollo, tras cada `ejecutar`
(`import.meta.env.DEV`). En producción no corre en cada operación.

### 3.3 Identificadores

- Los ids tienen formato `prefijo-N`: `o-` objeto, `p-` proceso, `s-` estado, `e-` enlace,
  `f-` abanico, `opd-` OPD. `N` sale de `Modelo.secuencia`, que se incrementa en la misma
  transacción (`tx.nuevoId(prefijo)`). En las operaciones es la única vía de asignación; el
  importador toma ids de la misma secuencia cuando reasigna (§3.4.2, etapas 2 y 7; CC-09).
- Los ids importados se conservan si cumplen `^[A-Za-z0-9._:~-]{1,80}$`; si no, se reasignan con
  informe (`normalizado`). Al importar, `secuencia = max(nextSeq, 1 + mayor sufijo numérico)`.
- El id de modelo es `m-` seguido de 12 hex aleatorios (`crypto.getRandomValues`). Todo id de
  modelo cumple `ID_MODELO = /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/` (sin punto inicial ni separadores:
  no puede chocar con `.tmp-*` ni escapar de `modelos/`, CC-16). Los modelos migrados conservan el id
  del registro PostgreSQL saneado a esa forma; si dos tenants comparten id, el segundo recibe un
  `m-…` nuevo y el informe lo dice (CC-17). **Importar desde la Biblioteca siempre asigna un `m-…`
  nuevo** (el archivo importado es un modelo nuevo: evita el 409 al reimportar una descarga o una
  copia previa). Invariante: nombre de archivo = `modelo.id`.
- En el export, los ids sin semántica se derivan y son estables: aparición `a-<opdId>-<cosaId>` y
  aparición de enlace `ae-<opdId>-<enlaceId>`.

### 3.4 Códec `deep-opm-pro.modelo.v0`

#### 3.4.1 Contrato (`codec/*.ts`)

```ts
export interface Entrada { readonly ruta: string; readonly mensaje: string; readonly regla?: string }
      // ruta: "enlaces.e-19.multiplicidadOrigen"
export interface LineaDiff { readonly enlace?: Id; readonly abanico?: Id; readonly texto: string }
      // texto = describirEnlace(): "consumo: Pedido → Despachar"
export interface DiffVisibilidad {
  readonly opd: Id; readonly etiqueta: string;
  readonly aparecen: readonly LineaDiff[]; readonly desaparecen: readonly LineaDiff[];
}
export interface Informe {
  readonly normalizado: readonly Entrada[];   // transformación equivalente (no pierde hechos)
  readonly descartado: readonly Entrada[];    // información no representable: pérdida declarada
  readonly ignorado: Readonly<Record<string, number>>;   // campos visuales/derivables: ruta → conteo
  readonly rechazos: readonly Entrada[];      // el documento no se puede leer ⇒ no se importa
  readonly visibilidad: readonly DiffVisibilidad[];      // SYNTHESIS §8-21
}
export type ResultadoImport =
  | { readonly ok: true; readonly modelo: Modelo; readonly informe: Informe }
  | { readonly ok: false; readonly informe: Informe };        // informe.rechazos no vacío
export function importarV0(texto: string): ResultadoImport;   // puro y total: nunca lanza
export function exportarV0(m: Modelo): string;                // determinista, canónico
export function leerCanonico(texto: string): Respuesta<Modelo>;   // §3.4.4
export function revision(texto: string): Promise<string>;     // sha256 hex de los bytes UTF-8 (CAS)
export function informeVacio(i: Informe): boolean;            // normalizado = descartado = rechazos = [] ∧ visibilidad = []
export function resumen(m: Modelo): { readonly nombre: string; readonly cosas: number; readonly opds: number };
      // lo usa el servidor para su índice, sin importar nucleo/ (§2.2, CC-19)
export const ID_MODELO: RegExp;                               // /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/ (CC-16)
```

Estas leyes se prueban sobre todos los fixtures y 200 modelos de `pruebas/azar.ts`:

- **Punto fijo**: `exportarV0(importarV0(exportarV0(m)).modelo) === exportarV0(m)`, con informe
  vacío.
- **Determinismo**: `exportarV0(m)` es igual en dos llamadas y `exportarV0(aplicar(m, [])) ===
  exportarV0(m)` (T-196).

#### 3.4.2 Etapas del importador (puras; acumulan todas las entradas; P8)

1. **Sobre.** `JSON.parse`; si falla, rechazo «JSON inválido». Acepta cuatro formas (CC-08):
   - `{formato:"deep-opm-pro.modelo.v0", modelo}`;
   - el registro persistido `{json: string, …}`, que se desenvuelve;
   - el sobre de recuperación `{format:"opforja.local-recovery.v1", document}`: se toma
     `document.snapshotJson` (la copia vigente); las ramas de `conflicts[]` van a `descartado` con su
     conteo y quedan en «Descargar original»;
   - el paquete portátil `{format:"opforja.portable-package", version:1, payload, integrity}`: se
     verifica el SHA-256 del `payload` (si no coincide, rechazo), se toma el `modelJson` de la
     revisión `manifest.selectedRevisionId` y el resto (otras revisiones, `sources`) va a
     `descartado` con conteo. El lector portátil no vuelve; solo se leen los paquetes existentes.

   Otro `formato` se rechaza (no se adivina). `carpetaId` del sobre va a `ignorado`.
2. **Colecciones.** `entidades`, `estados`, `enlaces`, `abanicos` y `opds` se aceptan como `Record`
   (v0) o como arreglo (bundles del Apéndice F); si faltan, quedan vacías. En un OPD, la clave
   `apariciones` se acepta como alias de `apariencias` (vocabulario del Apéndice F, `normalizado`).
   Es rechazo solo lo ambiguo **dentro** de una colección: dos elementos de un arreglo con el mismo
   `id`, o una clave de `Record` distinta de su `id`. Un mismo id en **dos colecciones distintas**
   (bundles externos que numeran por colección) no es ambiguo: se conserva en la primera por el
   orden `entidades, estados, enlaces, abanicos, opds` y se reasigna en las siguientes con un id
   nuevo `prefijo-N` tomado de la secuencia (§3.3), reescribiendo sus referencias (`normalizado`,
   CC-09).
3. **Referencias** (método F: rechazo, sin reparar). Cada referencia rota es un rechazo con su ruta:
   - estado a entidad; extremo a entidad o estado; `estadoEntradaId` y `estadoSalidaId`;
   - aparición a entidad y OPD; refinamiento a OPD; `opdRaizId`;
   - abanico a enlace (salvo derivados, etapa 8); escisión a su par; `ordenInzoom` a sus ids.

   **`padreId` no es rechazo** (compatibilidad con `normalizarModelo` de v0, que nunca rechaza el
   árbol, CC-07): un `padreId` colgante o autorreferente se trata como ausente (etapa 6,
   `normalizado`), y un ciclo de `padreId` se rompe tratando como ausente el `padreId` del OPD de
   menor id del ciclo (`normalizado`). Dos ranuras de refinamiento que apuntan al mismo OPD, o dos
   entidades que refinan el mismo OPD, conservan la primera por id cuya cosa aparece en ese OPD; las
   demás ranuras van a `descartado` (regla F-7).
4. **Cosas.**
   - `tipo` ausente o fuera de `objeto|proceso` es rechazo.
   - `esencia` o `afiliacion` ausentes toman el default (`normalizado`); con valor inválido, el
     default va a `descartado` con el valor original.
   - **El nombre se conserva tal cual**, salvo la forma NFC (`normalizado` si cambió). No se
     recorta, no se capitaliza ni se desambigua (DS-7): duplicados y nombres fuera del léxico se
     diagnostican (§4.4) y llevan su reparación sugerida.
   - `descripcion` y `genero` (`"f"`) se conservan.
   - `valorSlot.valor` pasa a `valor` (texto). `valorSlot` sin valor va a `ignorado`, y su `tipo`
     distinto de `string` a `descartado`. Un `valor` de un objeto que, tras la etapa 7, no es rasgo
     de ninguna exhibición va a `descartado` (regla T-020: sin exhibidor no hay oración VAL, CC-03).
   - `esAtributo` y `layoutEstados` van a `ignorado` (derivable y visual).
   - `alias`, `unidad`, `imagen`, `urls`, `simulacion`, `estereotipoId`, `anclaje`, `requisito`,
     `lineal` y `orderedFundamentalTypes` (marca `ordered`, extensión B-16: su pérdida se declara,
     CC-10) van a `descartado`.
   - `duracion` de proceso se conserva si pasa F-10; si no, va a `descartado`.
5. **Estados.**
   - Si el dueño es un proceso, el estado va a `descartado` (AP-12), y cada referencia a él se
     resuelve en la etapa 7 como «anclaje descartado».
   - Orden: `orden` si todos lo tienen; si no, el sufijo numérico del id; si no, el orden de
     aparición.
   - El nombre queda tal cual (NFC).
   - Designaciones: `esInicial`/`esFinal` **o** `designaciones` ∋ `inicial`/`final` (la unión; los
     duplicados van a `normalizado`). `default` o `porDefecto` pasan a `porDefecto` del objeto; si
     hay más de uno, se conserva el primero por orden y el resto va a `descartado`. `current` igual.
     `suprimido` se conserva.
   - `duracion` de estado va a `descartado`; `x/y/width/height`, a `ignorado`.
   - Un objeto con un solo estado es válido (R-OBJ-2).
6. **OPDs.** La raíz es `opdRaizId`. Todo otro OPD se clasifica:
   - **Refinamiento de proceso o de cosa por despliegue.** Una entidad lo apunta en
     `refinamientos.descomposicion|despliegue`; la forma legacy `refinamiento:{tipo, opdId, modo?}`
     va a `normalizado`. Sin `despliegue.modo`, se usa `agregacion` (`normalizado`).
   - **Descomposición de objeto** (DS-18).
     - Si el objeto no tiene despliegue, se convierte en `OpdDespliegue{modo:'agregacion'}` que
       conserva todas las apariciones y posiciones. **No crea enlaces**. Va a `normalizado`, regla
       DR-23, con la lista de objetos del OPD que no son partes por agregación («no se creó ningún
       enlace; revisa si son partes»).
     - Si ya tiene despliegue, el OPD va a `descartado` con sus apariciones.
   - **Boceto** (`padreId: null` sin ser raíz), **huérfano** (con padre, pero ninguna entidad lo
     refina) o **vista** (`vista` presente). El OPD va a `descartado`, con el conteo de apariciones.
     **Sus cosas, estados y enlaces siguen en el modelo** y pueden quedar sin aparición (DS-6,
     diagnóstico `cosa-sin-aparicion`).
   - Un OPD de refinamiento cuyo padre fue descartado se recuelga del primer OPD, en preorden, que
     conserve una aparición de su cosa (`normalizado`). Si no hay ninguno, se descarta igual, de
     forma recursiva.
   - Un OPD que refina la cosa refinada de uno de sus ancestros (ciclo de refinamiento, R-REF-1) va
     a `descartado` con su subárbol, como un OPD no representable (DS-18): sus hechos siguen en el
     modelo (CC-24).
   - **Padre** = `padreId`. Si falta (o la etapa 3 lo anuló), es la raíz, como en v0
     (`normalizado`, CC-07). Si el padre no muestra la cosa refinada, se le agrega una aparición en un
     hueco libre (`colocar`, `normalizado`).
   - Orden entre hermanos: `ordenLocal` si todos lo tienen y es único; si no, el orden natural de
     ids (`normalizado`).
   - **Bandas** (descomposición):
     - Con `ordenInzoom`, se filtra a procesos internos y se completa con los internos faltantes
       en bandas nuevas al final, ordenadas por Y (`normalizado`).
     - Sin él, se derivan de la geometría (porte de `agruparSubprocesosParalelos`): internos por la
       `y` del borde superior, misma banda si |Δy| ≤ 4 px (`normalizado`).
   - **Internos**: se leen de `contextoRefinamiento.rol` (`contorno` es el contenedor; `interno`;
     `externo`). Sin contexto, se usa el porte de `aparienciaEsInternaDeRefinamiento`: dentro del
     bbox del contorno y sin aparición en el padre (`normalizado`). Un interno que aparece fuera de
     su subárbol pasa a externo (`normalizado`, A3.3).
   - **Apariciones**:
     - Una duplicada en el OPD conserva la de menor id (`normalizado`, DR-25).
     - Las coordenadas se redondean a entero y un tamaño < 20 pasa a 135×60 (`normalizado`).
     - `estadosSuprimidos` pasa a `ocultos`, filtrado a estados propios.
     - `ports`, `modoTamano`, `modoPlegado`, `ordenPartes`, `parteExtraidaDe` e `id` van a
       `ignorado`. `preguntaGuia` y un `nombre` de OPD que no sea etiqueta automática
       (`^SD[\d.]*$`) van a `descartado`.
   - **Apariciones de enlace** (`opds[].enlaces[*]`): `id`, `enlaceId` y `opdId` se reconocen (son
     la entrada de la etapa 12); `vertices`, `symbolPos`, `symbolAnchors` y `labelPositions` van a
     `ignorado` con su conteo (geometría: los procedimentales son rectos, T-225). Nunca caen en
     «campo desconocido», que las mandaría a `descartado` y haría responder 422 al servidor (CC-10).
7. **Enlaces.** Un extremo `string` pasa a `{kind:"entidad", id}` (`normalizado`). Un enlace cuyos
   extremos no calzan con la firma, tras el mapeo, va a `descartado` entero con su regla: consumo
   invertido, objeto→objeto o estructural reflexivo. Por tipo v0:
   - **`consumo`, `agente`, `instrumento`**: el origen es un objeto o su estado y el destino un
     proceso ⇒ `{objeto, proceso, estado?}`.
   - **`resultado`**: el origen es un proceso y el destino un objeto o su estado.
   - **`efecto`** tiene una sola codificación interna:
     - el compacto `P→O` con `estadoEntradaId`/`estadoSalidaId` da T3, TS3, TS4 o TS5;
     - un extremo estado da `entrada` si es `estado→P` y `salida` si es `P→estado`;
     - `O→P` entre entidades es la rama v0 y da T3 (la dirección no es semántica);
     - `efectoEscindido{grupoId, rol, modo:"par"}` con compañero pone `escision{par, mitad}` en
       ambos; `modo:"standalone"`, o un grupo de un solo miembro, queda sin escisión
       (`normalizado`); `enlacePadreId` va a `ignorado`.
   - **Par v0 consumo(estado s₁) + resultado(estado s₂)** sobre el mismo (objeto, proceso), sin que
     ninguno sea rama de un abanico **y sin `ruta` ni multiplicidad en ninguno** (la fusión solo se
     hace si no pierde nada, CC-11). Se fusiona en un `efecto` TS3 con el id del consumo,
     `entrada = s₁` y `salida = s₂`. El control del consumo pasa al efecto. Queda en `normalizado`
     (SYNTHESIS §8-19, tabla 9.2) y registra el **alias** `id del resultado → id del consumo`, que
     usan las etapas 8, 9 y 12. Si alguno lleva ruta o multiplicidad (TS3–TS5 no tienen hueco, DR-19 y
     DR-44), **no se fusiona**: ambos se cargan tal cual y quedan como `enlace-invalido`
     (R-ROL-UNIC-1), error recuperable que decide el operador (P8).
     **Excepción de documento directo canónico (CC-11, autorizada por coordinación de Félix):**
     antes de la fusión C+R se construye un candidato que conserva ambos enlaces, sus tipos,
     ids y contexto recuperable. Solo se reconoce si `validarForma(candidato)` es vacía,
     no hay pérdidas (`descartado`), rechazos ni diff sustantivo de visibilidad, y la entrada
     v0 **DIRECTA completa** coincide en sus bytes **EXACTAMENTE** con
     `exportarV0(candidato)`. En ese caso se conservan los dos hechos y no se aplica la
     fusión legacy. El reconocimiento no elimina pérdidas, rechazos, diferencias de
     visibilidad ni información ignorada. No añade campos ni marcadores al formato v0.
     Reformatear o envolver el documento sigue la ruta legacy ordinaria y puede fusionarlo;
     en los sobres persistido, de recuperación y portátil rigen las reglas ordinarias.
     Esta excepción estructural se realiza antes de fusionar, no mediante limpieza posterior
     del Informe, y queda ligada a la ley de §3.4.4.
   - **`invocacion`** (se admite origen = destino) y **`excepcionSobretiempo|Subtiempo`** conservan
     su tipo.
     - `tiempoMaximo`/`tiempoMinimo` con su unidad pasan a `duracion.max|min` de la fuente
       (`normalizado`, R-EXC-2/3). La unidad v0 (`ms|s|min|h|dia|sem|mes|año` y variantes canónicas)
       se lleva al enum; un valor no numérico va a `descartado`.
     - Si dos cotas de la misma fuente chocan, se conserva la primera y la otra va a `descartado`.
     - `excepcionSubSobretiempo` da dos enlaces: sobretiempo con el id original y subtiempo con
       `<id>~sub` (`normalizado`).
   - **Estructurales fundamentales**: origen = refinable y destino = refinador.
     - Una **generalización con estado en ambos extremos**, sobre objetos, da
       `estados{general, especializacion}` (DS-8).
     - Con estado en un solo extremo, o en agregación, exhibición o clasificación, el **anclaje** va
       a `descartado` y el enlace se conserva (R-OPL-RF-3, matriz §2.1).
   - **`etiquetado`**: `etiqueta` vacía da SE2; los estados en los extremos pasan a
     `estadoOrigen/Destino`.
   - **`etiquetadoBidireccional`**:
     - con `backwardTag === etiqueta` (ambas vacías incluidas) pasa a `reciproco` (`normalizado`,
       R-STRE-1);
     - con exactamente una vacía, da dos `etiquetado` opuestos (`normalizado`, DS-13);
     - un estado solo en el destino, o un estado de destino en un bidireccional con etiquetas
       distintas, va a `descartado` como anclaje (V-30, AP-11).
   - **`modificador`** `condicion|evento` pasa a `c|e`. Si falta y `subtipoModificador` es `C|E`,
     igual (`normalizado`). **`"no"`** manda el **enlace entero** a `descartado` (DS-19).
     `subtipoModificador` va a `ignorado`. Un control en un tipo sin control (AP-01/02) o en una
     mitad escindida (AP-08) va a `descartado`.
   - **Multiplicidad**:
     - `?` y `0..1` dan `?`; `*`, `0..*` y `0..N` dan `*`; `+`, `1..*` y `1..N` dan `+`; `1` y
       `1..1` quedan ausentes.
     - Otro valor va a `descartado` (DR-21), igual que una multiplicidad en un extremo ilegal
       (proceso, todo).
     - Una multiplicidad que `noOfrecido` rechaza va a `descartado` (DR-44): junto a `c`, en efecto
       con estados o en etiquetado con estado.
   - **`rutaEtiqueta`** pasa a `ruta` en consumo y resultado (también en ramas de abanico, DS-10).
     En otro tipo va a `descartado` (DR-19).
   - Una `etiqueta` no vacía en tipos no etiquetados va a `descartado`.
   - `probabilidad`, `demora`, `tasa`, `unidadesTasa`, `requisitos` y `mostrarRequisitos` van a
     `descartado`; `grupoEstructuralId` y `portId`, a `ignorado`.
8. **Derivados v0** (`derivado.tipo = "enlace-externo-refinamiento"`), ya resuelta la estructura de
   refinamiento:
   - **`origen:"automatico"`** (o ausente) es una proyección materializada: se descarta
     (`ignorado`) y el enlace padre se ubica donde el canon lo pone:
     - consumo, evento de objeto sistémico y TS4, en el primer subproceso (el del derivado, si
       existe);
     - resultado y TS5, en el último;
     - TS3 sin control y fuera de abanico, en la escisión (el padre queda como mitad de entrada y el
       derivado de salida como la otra). Si el TS3 viene de la fusión consumo+resultado, los
       derivados del consumo y del resultado dan la mitad de entrada (id del consumo) y la de salida
       (id del resultado);
     - TS3 con control o en abanico, en el primero, entero;
     - agente, instrumento y efecto simple, en el contorno.

     Todo va a `normalizado`.
   - **`origen:"manual"`** es un reanclaje del modelador: el padre toma el extremo del derivado y
     conserva su id. Si hay varios, el primero reancla el padre y los demás quedan como enlaces
     propios con su id (`normalizado`).
   - Un derivado huérfano va a `descartado`.
   - Esta etapa es **mapeo de datos**, no aplicación de reglas: solo mueve extremos a donde los
     derivados indican. No llama a la distribución de §4.5.3 (que vive en `nucleo/refinamiento.ts`,
     WP-4r). Lo que queda en el contorno contra el canon (un consumo sin derivado, un TS3 sin
     derivados) se **carga** y lo marca `diagnosticar` como error con reparación `distribuirEnlace`,
     que el Informe ofrece en «Aplicar N reparaciones» (P8, CC-21).
9. **Abanicos.**
   - `operador` `O` pasa a `OR`; `XOR` queda igual.
   - **Abanicos derivados** (CC-26): v0 proyectaba el abanico del padre en cada OPD hijo como otro
     abanico persistido, con ramas `derivado` y `puertoComun.portId = "port-fan-ref-…"`
     (`proyectarAbanicosExternosDerivados`). Un abanico cuyas ramas son todas `derivado`, o que tras
     mapear cada rama a su `enlacePadreId` repite las ramas de otro abanico, es proyección: va a
     `ignorado` (nunca a `descartado`, que falsearía una pérdida y haría responder 422).
   - `enlaceIds` pasa a `enlaces`. Se retiran los ids de enlaces descartados; con menos de 2 ramas,
     el abanico va a `descartado`. Un enlace en dos abanicos se queda en el primero (`normalizado`).
   - `puertoComun`, `puertoEntidadId` y `opdId` son derivados: no se informan si coinciden con lo
     derivado; si difieren, van a `normalizado`, o al diff de la etapa 12 en el caso de `opdId`.
   - `decision` va a `descartado`.
   - Las violaciones de contexto se **cargan**: tipos mixtos, sin extremo común, control mixto.
   - Un abanico que cae en `NO_OFRECIDO` (control sin plantilla, efecto mixto; B-06, B-08) va a
     `descartado` y sus enlaces se conservan.
   - **Regla de cierre de F-5**: toda combinación que `noOfrecido` rechace se descarta en su mínimo
     elemento (el campo, el anclaje o el abanico), con informe. Esto incluye el recíproco sin
     etiqueta con estados (B-05), cuyos anclajes van a `descartado`.
10. **Modelo.**
    - `secuencia` según §3.3; `unidadTiempo` ausente toma `min` (`normalizado`); `descripcion` se
      conserva.
    - Van a `descartado`, una entrada por campo con conteo: `ontologia`,
      `satisfaccionesRequisito`, `declaracionesNoNucleares`, `familiasEfectosPreestado`,
      `anclasNormativas`, `notasMesa`, `mesaExploracion`, `estereotipos`, `procedencia`,
      `fichaTrabajo`, `lentesConocimiento`, `submodelos`, `pieceLineage` y
      `referenciaPadreSubmodelo`.
    - Van a `ignorado`: `archivado`, `archivadoEn`, `versiones` y `crearVersionAlGuardar`.
    - Toda clave desconocida va a `descartado` como «campo desconocido» (patrón
      `collectUnrepresented`).
11. **Cierre.** `validarForma(modelo)` debe ser vacía. Una violación residual es un error del
    importador: en pruebas y en desarrollo lanza; en producción da rechazo «error interno del
    importador», con las violaciones. Nunca se guarda un modelo sin forma.
12. **Diff de visibilidad** (SYNTHESIS §3.9-14 y §8-21). Definición exacta (CC-12), para cada OPD
    `o`, con `V = proyectar(modelo, o)`:
    - `v0(o)` = los ids de `opds[o].enlaces[*].enlaceId`, tras mapear reasignaciones (etapa 2),
      alias de fusión (etapa 7) y derivados (etapa 8, cada derivado a su `enlacePadreId`);
    - `directos(o)` = los `hechos` de las `EnlaceVisto` con `abstraido === false`;
    - `abstraidos(o)` = los `hechos` de las `EnlaceVisto` con `abstraido === true`;
    - **desaparecen** = `v0(o) − (directos(o) ∪ abstraidos(o))`;
    - **aparecen** = `directos(o) − v0(o)` (lo abstraído nunca «aparece»: el export solo lista lo
      directo, y v0 listaba el enlace original en el padre, que aquí queda abstraído);
    - **abanicos**: un abanico con `opdId = o` «desaparece» si no se ve en `o` **y** la regla de
      `opdId` del export (§3.4.3) no elegiría `o`; nunca se informa que un abanico «aparece» (el v0
      le da un solo OPD y aquí se ve en todos los que muestran sus ramas).

    Las diferencias van a `informe.visibilidad` con `describirEnlace`. Como `exportarV0` escribe
    `opds[o].enlaces = directos(o)` y `abanicos[].opdId` con la misma regla que consulta el diff, un
    v0 exportado por este mismo códec da diff vacío por construcción (lo exige el punto fijo).

#### 3.4.3 Forma exacta emitida por `exportarV0`

- Mismas claves y valores del núcleo v0 donde el concepto existe. Hay campos nuevos solo donde v0
  no tiene concepto (DR-41): `unidadTiempo`, `genero`, `duracion` y `coleccionIncompleta`.
- **Cotas de excepción también en el enlace** (CC-13): v0 guarda la cota en el enlace
  (`tiempoMaximo`/`unidadTiempoMaximo` en sobretiempo, `tiempoMinimo`/`unidadTiempoMinimo` en
  subtiempo) y así la leen los consumidores externos y el stack viejo en un rollback. El export las
  **deriva** de `duracion.max|min` de la fuente (valor como texto; unidad v0: `ms`→`ms`, `sec`→`s`,
  `min`→`min`, `hour`→`h`, `day`→`dia`, `week`→`sem`, `month`→`mes`, `year`→`año`). El importador
  las reconoce como derivadas y no las informa cuando coinciden con la duración de la fuente; si
  difieren, rige la etapa 7.
- Los opcionales se omiten cuando valen su default; `etiqueta` está siempre presente (`""`).
- Los `Record` se ordenan por id en orden natural (`o-2` < `o-10`) y las claves de cada objeto en el
  orden fijo mostrado. Las coordenadas son enteros.
- La salida es `JSON.stringify(doc, null, 2) + "\n"`.

```jsonc
{ "formato": "deep-opm-pro.modelo.v0",
  "modelo": {
    "id": "m-3f9a1c0d2b7e", "nombre": "Despacho", "descripcion": "…", "unidadTiempo": "sec",
    "opdRaizId": "opd-1", "nextSeq": 42,
    "entidades": {
      "o-3": { "id": "o-3", "tipo": "objeto", "nombre": "Pedido", "esencia": "informacional",
               "afiliacion": "sistemica", "descripcion": "…", "genero": "f",
               "valorSlot": { "tipo": "string", "placeholder": "value", "valor": "12" },
               "coleccionIncompleta": ["agregacion"] },
      "p-4": { "id": "p-4", "tipo": "proceso", "nombre": "Despachar", "esencia": "fisica", "afiliacion": "sistemica",
               "duracion": { "min": 1, "esperada": 3, "max": 5, "unidad": "min" },
               "refinamientos": { "descomposicion": { "opdId": "opd-2" },
                                  "despliegue": { "opdId": "opd-5", "modo": "agregacion" } } } },
    "estados": {
      "s-5": { "id": "s-5", "entidadId": "o-3", "nombre": "pendiente", "orden": 0,
               "esInicial": true, "designaciones": ["default"] },
      "s-6": { "id": "s-6", "entidadId": "o-3", "nombre": "listo", "orden": 1, "esFinal": true, "suprimido": true } },
    "enlaces": {
      "e-7":  { "id": "e-7", "tipo": "consumo", "origenId": { "kind": "estado", "id": "s-5" },
                "destinoId": { "kind": "entidad", "id": "p-4" }, "etiqueta": "",
                "modificador": "condicion", "multiplicidadOrigen": "+", "rutaEtiqueta": "L1" },
      "e-8":  { "id": "e-8", "tipo": "efecto", "origenId": { "kind": "entidad", "id": "p-9" },
                "destinoId": { "kind": "entidad", "id": "o-3" }, "etiqueta": "", "estadoEntradaId": "s-5",
                "efectoEscindido": { "grupoId": "e-8", "enlacePadreId": "e-8", "rol": "entrada", "modo": "par" } },
      "e-10": { "id": "e-10", "tipo": "agregacion", "origenId": { "kind": "entidad", "id": "o-3" },
                "destinoId": { "kind": "entidad", "id": "o-12" }, "etiqueta": "", "multiplicidadDestino": "*" },
      "e-11": { "id": "e-11", "tipo": "generalizacion", "origenId": { "kind": "estado", "id": "s-20" },
                "destinoId": { "kind": "estado", "id": "s-31" }, "etiqueta": "" },          // especialización de estado
      "e-13": { "id": "e-13", "tipo": "etiquetadoBidireccional", "origenId": { "kind": "entidad", "id": "o-3" },
                "destinoId": { "kind": "entidad", "id": "o-14" }, "etiqueta": "colaboran", "backwardTag": "colaboran" } },
    "abanicos": { "f-12": { "id": "f-12", "opdId": "opd-1",
                            "puertoComun": { "entidadId": "p-4", "lado": "destino", "portId": "puerto-f-12" },
                            "puertoEntidadId": "p-4", "operador": "XOR", "enlaceIds": ["e-7", "e-15"] } },
    "opds": {
      "opd-1": { "id": "opd-1", "nombre": "SD", "padreId": null,
                 "apariencias": { "a-opd-1-o-3": { "id": "a-opd-1-o-3", "entidadId": "o-3", "opdId": "opd-1",
                                  "x": 120, "y": 80, "width": 135, "height": 60, "estadosSuprimidos": ["s-6"] } },
                 "enlaces": { "ae-opd-1-e-7": { "id": "ae-opd-1-e-7", "enlaceId": "e-7", "opdId": "opd-1", "vertices": [] } } },
      "opd-2": { "id": "opd-2", "nombre": "SD1", "padreId": "opd-1", "ordenLocal": 0,
                 "ordenInzoom": [["p-9"], ["p-14", "p-15"]],
                 "apariencias": { "a-opd-2-p-4": { "…": "…", "contextoRefinamiento":
                                  { "tipo": "descomposicion", "refinableEntidadId": "p-4", "rol": "contorno" } } },
                 "enlaces": { } } } } }
```

Mapeos de salida:

| Interno | v0 |
|---|---|
| `Consumo`, `Agente`, `Instrumento` | `origenId` = objeto (`kind:"estado"` si hay `estado`), `destinoId` = proceso, `multiplicidadOrigen` = `mult` |
| `Resultado` | `origenId` = proceso, `destinoId` = objeto (o su estado), `multiplicidadDestino` |
| `Efecto` | **siempre compacto**: `origenId` = proceso, `destinoId` = objeto (entidad), `estadoEntradaId`, `estadoSalidaId`, `multiplicidadDestino`; `escision` ⇒ `efectoEscindido{grupoId = enlacePadreId = id de la mitad de entrada, rol, modo:"par"}` |
| `Invocacion`, `Excepcion` | `origenId` = origen, `destinoId` = destino; en excepciones, además la cota derivada de la fuente (`tiempoMaximo`/`unidadTiempoMaximo` o `tiempoMinimo`/`unidadTiempoMinimo`, CC-13) |
| `Agregacion` · `Exhibicion` · `Generalizacion` · `Clasificacion` | `origenId` = refinable, `destinoId` = refinador; agregación `mult` ⇒ `multiplicidadDestino`; `Generalizacion.estados` ⇒ ambos extremos `kind:"estado"` |
| `Etiquetado` | extremos con `kind:"estado"` si están anclados; `multiplicidadOrigen/Destino`; `etiqueta` (`""` = SE2) |
| `Bidireccional` | `etiquetadoBidireccional`, `etiqueta`, `backwardTag` = `inversa` |
| `Reciproco` | `etiquetadoBidireccional` con `backwardTag === etiqueta` (`""` y `""` si no hay etiqueta) |
| `control` | `modificador` `evento` / `condicion` |
| `Operador` `OR` | `"O"` |
| `porDefecto` · `current` | `designaciones:["default"]` / `["current"]` en ese estado (orden `default, current`) |
| `inicial` · `final` | `esInicial` · `esFinal` (nunca duplicados en `designaciones`) |
| Refinamientos | `entidades[*].refinamientos` derivado de los OPDs; `contextoRefinamiento` solo en OPDs de descomposición (`contorno`, `interno`, `externo`) |
| Visibilidad | `opds[o].enlaces` = `proyectar(m, o).enlaces` directos (hechos subyacentes con `abstraido === false`) |
| Abanico | `opdId` = primer OPD (preorden) donde es visible; si no lo es en ninguno, el primero donde se ve alguna rama o, en su defecto, la raíz; `puertoComun{entidadId: extremo común, lado, portId:"puerto-<id>"}`, `puertoEntidadId` |
| Nombre de OPD | `nombre` = etiqueta `SDx.y` |

#### 3.4.4 Punto fijo y lector estricto

- El reconocimiento previo a fusión C+R de §3.4.2-7 conserva los hechos de un v0 DIRECTO
  canónico completo: exige forma válida, ausencia de pérdidas/rechazos/diff sustantivo e
  igualdad íntegra EXACTA de bytes contra el export del candidato que conserva ambos
  enlaces. Mantiene sus tipos, ids y contexto recuperable; no elimina evidencia ni añade
  marcadores. La versión reformateada o envuelta sigue la ruta legacy ordinaria y puede
  fusionarse. Esta consecuencia de representación fue aceptada explícitamente por la
  coordinación de Félix; la excepción no modifica canon ni DECISIONS 1–28 ni formato v0.
- Lo que el export deriva (`opds[].enlaces`, `apariencias[].id`, `opds[].nombre`,
  `efectoEscindido.enlacePadreId`, `abanicos[].opdId|puertoComun|puertoEntidadId`, `refinamientos`,
  las cotas `tiempoMaximo|tiempoMinimo` de las excepciones) el importador lo **reconoce y no lo
  informa**. Por eso `importarV0(exportarV0(m)).informe` es vacío.
- Compatibilidad: el documento emitido satisface los tipos v0 actuales (`etiqueta` siempre, abanico
  con sus tres campos, `refinamientos` en plural). Las diferencias observables para un lector v0
  antiguo (el stack viejo en un rollback, §9.4) son estas (CC-13):
  - admite objetos con **un** estado y la multiplicidad `?`;
  - no emite `ports`, `symbolAnchors`, `labelPositions` ni `x/y` de estado;
  - emite la especialización de estado como generalización entre estados;
  - admite enlaces sin aparición en ningún OPD y cosas sin aparición (DS-6), que el lector viejo
    rechaza («todo enlace tiene al menos una apariencia»);
  - admite, como errores cargados, lo que el lector viejo rechazaba en la frontera: agente desde
    objeto informacional y manejador de excepción sistémico (T-268 es advertencia);
  - el lector viejo descarta en silencio los campos nuevos (`duracion`, `unidadTiempo`, `genero`,
    `coleccionIncompleta`); las cotas de excepción sobreviven porque también van en el enlace.

  Queda declarado en `docs/formato-v0.md`.
- `leerCanonico(texto)` hace `importarV0` y exige tres cosas: `ok`, `informeVacio(informe)` y
  `exportarV0(modelo) === texto`. Lo usa el servidor en cada escritura para decidir si guarda los
  bytes recibidos (§8.1). El almacén **tiende** a contener solo documentos canónicos, pero un cambio
  futuro del códec puede dejar archivos que ya no son punto fijo de la versión nueva. Por eso nadie
  exige `leerCanonico` para **leer** (CC-14):
  - el servidor, al arrancar, solo mueve a `archivo/invalidos/` lo que no pasa `JSON.parse` o da
    `importarV0(...).ok === false`; un archivo legible pero no canónico sigue sirviéndose tal cual;
  - el cliente, al abrir, usa `importarV0`. Si `leerCanonico` falla pero el import es `ok` sin
    `descartado`, abre y marca «Cambios sin guardar» (el próximo guardado canonicaliza). Si hay
    `descartado`, muestra antes el Informe de importación con «Abrir de todos modos»; el primer
    guardado de ese modelo va con `?respaldo=1`, así el original queda en la papelera y nada se
    pierde en silencio.
  - la restauración de papelera también importa antes de canonicalizar (§8.1). Los rechazos o
    descartes conservan la entrada intacta y se informan; un histórico sin descartes puede
    restaurarse canónico con su Informe completo y un respaldo exacto del original.

---

## 4. Núcleo

### 4.1 Respuestas, rechazos y trazas (`nucleo/resultado.ts`) — CONTRATO

```ts
export type CodigoRechazo =
  | 'lexico' | 'unicidad-nominal' | 'no-visible' | 'interno-no-visible' | 'ya-aparece' | 'ya-existe'
  | 'es-interno' | 'es-contenedor' | 'tiene-refinamiento' | 'refinamiento-no-hoja' | 'ya-refinado'
  | 'ciclo' | 'externo-no-refinable' | 'descomposicion-objeto' | 'forma' | 'contexto' | 'no-ofrecido'
  | 'abanico' | 'estado-enlazado' | 'efecto-sin-estados' | 'tipo-incompatible' | 'duracion-invalida'
  | 'referencia-ambigua' | 'no-encontrado';
export interface Rechazo {
  readonly codigo: CodigoRechazo;
  readonly regla: string;            // id canónico (R-…, AP-…, T-…) o 'producto'
  readonly mensaje: string;          // es-CL, con nombres tipográficos: «**Pedido** ya existe (objeto, en SD y SD2).»
  readonly accion?: string;          // acción canónica (R-AP-0B): «Trae esa misma cosa o escribe otro nombre.»
  readonly refs: readonly Ref[];
}
export interface Traza { readonly regla: string; readonly mensaje: string; readonly refs: readonly Ref[] }  // R-OPD-OP-5
export type Respuesta<T> =
  | { readonly ok: true; readonly valor: T; readonly trazas: readonly Traza[] }
  | { readonly ok: false; readonly rechazo: Rechazo };
export interface Hecho { readonly modelo: Modelo; readonly creados: readonly Id[] }   // valor de toda operación que muta
export type Operacion<A> = (m: Modelo, a: A) => Respuesta<Hecho>;
export interface Violacion { readonly codigo: string; readonly regla: string; readonly mensaje: string; readonly refs: readonly Ref[]; readonly accion?: string }

// Ayudante interno de transacción (≈50 líneas). No se exporta fuera de nucleo/.
export interface Tx {
  readonly m: Modelo;                                      // modelo en curso (copia de camino)
  nuevoId(prefijo: 'o' | 'p' | 's' | 'e' | 'f' | 'opd'): Id;
  poner<K extends 'cosas' | 'enlaces' | 'abanicos' | 'opds'>(col: K, valor: Modelo[K][Id]): void;
  quitar(col: 'cosas' | 'enlaces' | 'abanicos' | 'opds', id: Id): void;
  modelo(cambio: Partial<Pick<Modelo, 'nombre' | 'descripcion' | 'unidadTiempo'>>): void;
  traza(t: Traza): void;
  rechazar(r: Rechazo): never;                             // lanza una excepción privada
}
export function transaccion(m: Modelo, cuerpo: (tx: Tx) => void, o?: { permiteErroresNuevos?: true }): Respuesta<Hecho>;
```

`transaccion` corre `cuerpo` sobre una copia de camino y convierte `rechazar` en `{ok:false}`. Al
final aplica el **cierre DS-20**: calcula `erroresContexto(nuevo)` y lo compara, por
`codigo + refs`, con `erroresContexto(viejo)`. El valor viejo está memoizado. Si aparece un error
nuevo, rechaza con `codigo:'contexto'` y la regla del primero. `permiteErroresNuevos` solo lo usa
`moverSubproceso`. Ninguna operación deja el modelo a medias.

### 4.2 API de operaciones (todas `Operacion<A>`, puras) — CONTRATO

```ts
export interface ExtremoRef { readonly cosa: Id; readonly estado?: Id }
export type EstadosEnlace =
  | { readonly estado: Id | null }                                      // consumo, resultado, agente, instrumento
  | { readonly entrada: Id | null; readonly salida: Id | null }         // efecto
  | { readonly generalizacion: { readonly general: Id; readonly especializacion: Id } | null }
  | { readonly origen: Id | null; readonly destino: Id | null };        // etiquetados

// modelo.ts
export function crearModelo(a: { readonly id: Id; readonly nombre: string }): Modelo;   // SD vacío 'opd-1', secuencia 2, 'min'
export const renombrarModelo:        Operacion<{ nombre: string }>;
export const fijarUnidadTiempo:      Operacion<{ unidad: UnidadTiempo }>;
export const fijarDescripcionModelo: Operacion<{ texto: string | null }>;

// cosas.ts
export const crearCosa: Operacion<{ opd: Id; tipo: TipoCosa; nombre: string; x: number; y: number;
                                    banda?: { indice: number; paralelo: boolean }; alcance?: 'interno' | 'externo' }>;
  // en un OPD de descomposición, `alcance` (o, si falta, el punto dentro/fuera del contenedor) decide:
  // interno ⇒ proceso = subproceso (en `banda` o banda nueva al final), objeto = objeto interno;
  // si la descomposición tenía 0 subprocesos, distribuye (§4.5.3). externo ⇒ aparición externa.
  // Hereda afiliación ambiental del contenedor (R-OBJ-6, traza). creados[0] = id nuevo.
export const renombrarCosa:    Operacion<{ cosa: Id; nombre: string }>;       // léxico + unicidad; nunca corrige
export const cambiarTipoCosa:  Operacion<{ cosa: Id }>;                        // T-063: rechaza con estados, refinamientos o enlaces inválidos
export const fijarEsencia:     Operacion<{ cosa: Id; esencia: Esencia }>;
export const fijarAfiliacion:  Operacion<{ cosa: Id; afiliacion: Afiliacion }>;
  // ambiental ⇒ propaga a sus rasgos por la cadena de exhibición, transitiva (rasgo de rasgo), con traza por
  // cosa (T-091, R-OPD-STR-13, CC-02)
export const fijarGenero:      Operacion<{ cosa: Id; genero: 'm' | 'f' }>;
export const fijarDescripcion: Operacion<{ cosa: Id; texto: string | null }>;
export const fijarValor:       Operacion<{ objeto: Id; valor: string | null }>;  // exige ser rasgo de ≥1 exhibición; léxico nombre_de_valor
export const fijarDuracion:    Operacion<{ proceso: Id; duracion: Duracion | null }>;   // F-10
export const fijarIncompleta:  Operacion<{ cosa: Id; relacion: RelacionIncompleta; activa: boolean }>;
export const traerCosa:        Operacion<{ cosa: Id; opd: Id; x: number; y: number }>;
  // 'ya-aparece'; 'es-interno' si es interno de otra descomposición (A3.3); en OPD de descomposición,
  // un punto dentro del contenedor rebota fuera (T-081, traza).
export const moverApariciones: Operacion<{ opd: Id; mover: readonly { cosa: Id; x: number; y: number }[] }>;
  // 1..n; el contenedor arrastra a sus internos; interno confinado (R-OPD-UI-3); externo dentro del
  // contenedor ⇒ rebote con traza (T-081); subproceso: solo x (P6).
export const redimensionar:    Operacion<{ opd: Id; cosa: Id; ancho: number; alto: number }>;
export const quitarDeOpd:      Operacion<{ opd: Id; cosas: readonly Id[] }>;
  // 'es-contenedor' (contenedor o refinable en su propio OPD hijo); 'es-interno' (internos: «elimínalo del modelo»);
  // la última aparición SÍ se quita (DS-6): traza «**X** ya no aparece en ningún OPD (sigue en el modelo)».
export const eliminarCosas:    Operacion<{ cosas: readonly Id[] }>;
  // 'tiene-refinamiento' si alguna tiene descomposición o despliegue (DS-5, T-083).
  // Cascada declarada: estados, enlaces incidentes (a la cosa o a sus estados), ramas de abanico (<2 ⇒ disuelve),
  // apariciones, miembros de bandas y objetosInternos (banda vacía ⇒ se retira). Sin re-migración.

// estados.ts
export const agregarEstado:  Operacion<{ objeto: Id; nombre: string; indice?: number }>;   // creados[0] = id
export const renombrarEstado: Operacion<{ estado: Id; nombre: string }>;
export const moverEstado:    Operacion<{ estado: Id; indice: number }>;
export const eliminarEstado: Operacion<{ estado: Id }>;
  // los enlaces anclados pierden el anclaje con traza (TS1→T1, TS3→TS4/TS5, especialización de estado ⇒ sin estados,
  // recíproco sin estado de origen ⇒ sin estados); porDefecto/current/ocultos se limpian;
  // el cierre DS-20 rechaza si deja un efecto T3 sin estados (R-EFE-1) — 'efecto-sin-estados'.
export const designar:       Operacion<{ estado: Id; designacion: Designacion; activa: boolean }>;
  // porDefecto y current reemplazan al anterior del objeto (traza)
export const suprimirEstado: Operacion<{ estado: Id; opd: Id | null; activa: boolean }>;
  // null = global; activa=true rechaza 'estado-enlazado' si un enlace anclado se ve donde se ocultaría (LF-03)

// matriz.ts (consulta; §4.3.4)
export interface DatosEtiquetas { readonly etiqueta?: string | null; readonly inversa?: string | null }
export function tiposLegales(m: Modelo, a: { readonly opd: Id; readonly desde: ExtremoRef; readonly hacia: ExtremoRef;
                                           readonly etiquetas?: DatosEtiquetas }): readonly OpcionTipo[];
// enlaces.ts
export const crearEnlace:       Operacion<{ opd: Id; candidato: EnlaceNuevo; abanicoCon?: { enlace: Id; operador: Operador } }>;
  // 'no-visible' (T-066/visibilidad), 'interno-no-visible', forma, 'no-ofrecido', 'ya-existe', contexto (DS-20);
  // proceso descompuesto con ≥1 subproceso ⇒ distribución §4.5.3 del enlace nuevo (recursiva) + aparición externa
  // del objeto en cada OPD de descomposición atravesado (R-HIJO-3); estado oculto donde se ve ⇒ se muestra (traza, LF-03).
  // abanicoCon: crea y forma/extiende el abanico en la misma transacción (R-FAN-5, DR-6). creados[0] = id.
  // exhibición desde un exhibidor ambiental (o con afiliación ambiental heredada por la cadena) ⇒ el rasgo y
  // sus propios rasgos pasan a ambientales, con traza (T-091 «al crear la exhibición», R-OBJ-6, CC-02).
  // valida etiquetas con normalizarEtiquetas antes de persistir: igualdad válida no vacía ⇒ recíproco,
  // traza R-STRE-1; el resultado efectivo cumple F-11. Los datos faltantes o inválidos no se insertan.
export const cambiarTipoEnlace: Operacion<{ enlace: Id; tipo: TipoEnlace }>;   // conserva id; campos incompatibles se retiran con traza; rama de abanico ⇒ 'abanico'
export const fijarEstados:      Operacion<{ enlace: Id; estados: EstadosEnlace }>;   // forma de `estados` debe calzar con el tipo
export const fijarControl:      Operacion<{ enlace: Id; control: Control | null }>;
export const fijarEtiqueta:     Operacion<{ enlace: Id; etiqueta: string | null; inversa?: string | null }>;
  // bidireccional con etiqueta === inversa ⇒ recíproco (traza R-STRE-1)
export const fijarRuta:         Operacion<{ enlace: Id; ruta: string | null }>;
export const fijarMultiplicidad: Operacion<{ enlace: Id; extremo: 'objeto' | 'refinador' | 'origen' | 'destino'; valor: Multiplicidad | null }>;
export const reanclarExtremo:   Operacion<{ opd: Id; enlace: Id; extremo: 'origen' | 'destino'; hacia: ExtremoRef }>;
  // DS-9: extremo en la dirección de extremos(); conserva id; `hacia.estado` fija el anclaje (T1→TS1);
  // 'no-visible', forma, contexto (DS-20), 'abanico' si rompe su abanico. Una mitad escindida reanclada a otro
  // proceso conserva su `escision`.
export const distribuirEnlace:  Operacion<{ enlace: Id }>;          // aplica §4.5.3 a un enlace del contorno (reparación de AP-06/AP-21/AP-07)
export const eliminarEnlaces:   Operacion<{ enlaces: readonly Id[] }>;
  // mitad escindida ⇒ la otra queda standalone (traza, DR-7); abanicos con <2 ramas se disuelven (traza)
  // Toda operación que deja a un objeto con `valor` sin exhibición que lo tenga como rasgo (eliminarEnlaces,
  // eliminarCosas del exhibidor, cambiarTipoEnlace, reanclarExtremo) retira el `valor` con traza «el valor 12 de
  // **Peso** se quitó: ya no es atributo» (F-13, T-020; nada queda sin oración en silencio, CC-03).

// abanicos.ts
export const formarAbanico:       Operacion<{ enlaces: readonly Id[]; operador: Operador }>;   // creados[0] = id
export const fijarOperador:       Operacion<{ abanico: Id; operador: Operador }>;
export const agregarRama:         Operacion<{ abanico: Id; enlace: Id }>;
export const quitarRama:          Operacion<{ abanico: Id; enlace: Id }>;   // <2 ⇒ disuelve (traza)
export const disolverAbanico:     Operacion<{ abanico: Id }>;
export const fijarControlAbanico: Operacion<{ abanico: Id; control: Control | null }>;   // todas las ramas (R-FAN-3)

// refinamiento.ts
export const descomponer:        Operacion<{ opd: Id; proceso: Id; bandas?: readonly (readonly string[])[] }>;   // creados[0] = OPD hijo
export const agregarSubprocesos: Operacion<{ opd: Id; bandas: readonly (readonly string[])[];
                                             posicion: 'final' | { antesDeBanda: number } | { enBanda: number } }>;
export const moverSubproceso:    Operacion<{ opd: Id; proceso: Id; destino: { banda: number } | { nuevaBandaAntesDe: number } }>;
export const fijarBandas:        Operacion<{ opd: Id; bandas: readonly (readonly Id[])[] }>;   // partición del MISMO conjunto; sin migración
export const desplegar:          Operacion<{ opd: Id; cosa: Id; modo: ModoDespliegue; refinadores?: readonly string[] }>;  // creados[0] = OPD hijo
export const agregarRefinadores: Operacion<{ opd: Id; nombres: readonly string[]; tipo?: TipoCosa }>;
export const eliminarRefinamiento: Operacion<{ opd: Id }>;                   // solo hoja (DS-16)

// consultas puras (memoizadas por identidad de Modelo)
export function indice(m: Modelo): Indice;
export function proyectar(m: Modelo, opd: Id): Vista;
export function etiquetaOpd(m: Modelo, opd: Id): string;                    // 'SD', 'SD1', 'SD1.2'
export function opdsEnPreorden(m: Modelo): readonly Id[];
export function erroresContexto(m: Modelo): readonly Violacion[];           // matriz §4.3.2 + abanicos (errores)
export function diagnosticar(m: Modelo): readonly Diagnostico[];
export function gatesExportacion(m: Modelo, alcance: { readonly opd: Id } | 'modelo'): readonly Rechazo[];
export function validarForma(m: Modelo): readonly Violacion[];
export function colocar(m: Modelo, opd: Id, tam: { ancho: number; alto: number }, punto?: { x: number; y: number }): { x: number; y: number };
export function buscarPorNombre(m: Modelo, consulta: string, max?: number): readonly Coincidencia[];   // sin mayúsculas ni acentos
export function describirEnlace(m: Modelo, e: Enlace): string;              // «consumo: Pedido → Despachar» (sin opl/)
export function sugerirNombre(m: Modelo, nombre: string, tipo: 'cosa' | 'estado', excluir?: Id): string;   // léxico + sufijo -2…
export interface Coincidencia { readonly ref: Ref; readonly texto: string; readonly detalle: string }   // «**Pedido** · objeto · SD, SD2»
```

Toda operación que recibe un nombre llama a `lexico.validarNombreCosa`, a `validarNombreEstado` o
a `validarEtiqueta`. Si el nombre choca, devuelve `Rechazo{codigo:'unicidad-nominal', refs:[cosa
existente]}`, y la UI usa esa ref para ofrecer «traer esa misma cosa» (T-065). **Ninguna operación
capitaliza, recorta ni corrige**: la UI ofrece `sugerirNombre` y el operador lo acepta.

**Registro único de operaciones** (`nucleo/operaciones.ts`). Lo usan el historial, las reparaciones
del diagnóstico y el aplicador OPL:

```ts
export const OPERACIONES = { renombrarModelo, fijarUnidadTiempo, fijarDescripcionModelo, crearCosa, renombrarCosa,
  cambiarTipoCosa, fijarEsencia, fijarAfiliacion, fijarGenero, fijarDescripcion, fijarValor, fijarDuracion, fijarIncompleta,
  traerCosa, moverApariciones, redimensionar, quitarDeOpd, eliminarCosas, agregarEstado, renombrarEstado, moverEstado,
  eliminarEstado, designar, suprimirEstado, crearEnlace, cambiarTipoEnlace, fijarEstados, fijarControl, fijarEtiqueta,
  fijarRuta, fijarMultiplicidad, reanclarExtremo, distribuirEnlace, eliminarEnlaces, formarAbanico, fijarOperador,
  agregarRama, quitarRama, disolverAbanico, fijarControlAbanico, descomponer, agregarSubprocesos, moverSubproceso,
  fijarBandas, desplegar, agregarRefinadores, eliminarRefinamiento } as const;
export type NombreOperacion = keyof typeof OPERACIONES;
export type ArgsDe<K extends NombreOperacion> = Parameters<(typeof OPERACIONES)[K]>[1];
export type Accion = { [K in NombreOperacion]: { readonly op: K; readonly args: ArgsDe<K> } }[NombreOperacion];
export function aplicarAccion(m: Modelo, a: Accion): Respuesta<Hecho>;
export function aplicarAcciones(m: Modelo, as: readonly Accion[]): Respuesta<Hecho>;   // secuencia atómica: primer rechazo aborta
export function etiquetaAccion(m: Modelo, a: Accion): string;    // «Descomponer *Cocinar*» (historial y franja)
```

**Índice** (`nucleo/indice.ts`, memo en `WeakMap<Modelo, Indice>`):

```ts
export interface Indice {
  readonly estadoDe: ReadonlyMap<Id, { readonly objeto: Id; readonly posicion: number }>;
  readonly enlacesDeCosa: ReadonlyMap<Id, readonly Id[]>;      // incidentes, incluidos los anclados a sus estados
  readonly enlacesDeEstado: ReadonlyMap<Id, readonly Id[]>;
  readonly abanicoDeEnlace: ReadonlyMap<Id, Id>;
  readonly aparicionesDe: ReadonlyMap<Id, readonly Id[]>;      // cosa → OPDs en preorden
  readonly refinamientosDe: ReadonlyMap<Id, { readonly descomposicion?: Id; readonly despliegue?: Id }>;
  readonly hijosDe: ReadonlyMap<Id, readonly Id[]>;            // OPD → hijos por `orden`
  readonly preorden: readonly Id[];
  readonly etiqueta: ReadonlyMap<Id, string>;
  readonly internoDe: ReadonlyMap<Id, Id>;                     // cosa interna → OPD de descomposición
  readonly subprocesoDe: ReadonlyMap<Id, { readonly opd: Id; readonly banda: number }>;
  readonly porClaveNombre: ReadonlyMap<string, readonly Id[]>; // ≥2 ⇒ nombre duplicado
}
export function claveNombre(nombre: string): string;          // NFC, espacios colapsados, recorte, toLocaleLowerCase('es')
```

### 4.3 La matriz de validez (`nucleo/matriz.ts`)

#### 4.3.1 Tabla de forma: una fila por tipo — CONTRATO

```ts
type Clase = 'objeto' | 'proceso' | 'cosa';
export type EstadosFila = 'ninguno' | 'objeto' | 'entradaSalida' | 'parGeneralizacion' | 'origenDestino' | 'soloOrigen' | 'simetrico';
export interface FilaMatriz {
  readonly familia: Familia;
  readonly roles: readonly ['objeto', 'proceso'] | readonly ['origen', 'destino'] | readonly ['refinable', 'refinador'];
  readonly clases: readonly [Clase, Clase];      // categoría por rol
  readonly mismoTipo: boolean;                   // R-STRF-1, R-OPL-SE-2
  readonly reflexivo: boolean;                   // a === b admitido
  readonly estados: EstadosFila;
  readonly control: boolean;                     // Pre(P): R-MOD-4
  readonly abanico: boolean;                     // reglas §7.2
  readonly ruta: boolean;                        // DR-19
  readonly mult: 'objeto' | 'refinador' | 'ambos' | 'ninguno';
  readonly etiquetas: 'ninguna' | 'opcional' | 'doble';
  readonly plantillas: readonly string[];        // ids de §5.3 (opl/plantillas.test exige que existan)
  readonly menu: number;                         // orden en el menú de tipos (consumo primero)
}
export const MATRIZ: Readonly<Record<TipoEnlace, FilaMatriz>>;
```

| tipo | familia | roles | clases | mismo | refl. | estados | ctrl | abanico | ruta | mult | etiq. | plantillas | menú |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| consumo | transformadora | objeto·proceso | objeto·proceso | no | no | objeto | sí | sí | sí | objeto | — | T1 TS1 ET1 ETS1 CT1 CS1 COND-ALT | 1 |
| resultado | transformadora | objeto·proceso | objeto·proceso | no | no | objeto | no | sí | sí | objeto | — | T2 TS2 | 2 |
| efecto | transformadora | objeto·proceso | objeto·proceso | no | no | entradaSalida | sí | sí | no | objeto | — | T3 TS3 TS4 TS5 ET2 ETS2 ETS3 ETS4 CT2 CS2 CS3 CS4 | 3 |
| agente | habilitadora | objeto·proceso | objeto·proceso | no | no | objeto | sí | sí | no | objeto | — | H1 HS1 EH1 EHS1 CH1 CS5 | 4 |
| instrumento | habilitadora | objeto·proceso | objeto·proceso | no | no | objeto | sí | sí | no | objeto | — | H2 HS2 EH2 EHS2 CH2 CS6 | 5 |
| invocacion | invocacion | origen·destino | proceso·proceso | sí | **sí** | ninguno | no | sí | no | ninguno | — | IV1 IV2 | 6 |
| agregacion | estructural | refinable·refinador | cosa·cosa | sí | no | ninguno | no | no | no | refinador | — | RF1 RF1i | 7 |
| exhibicion | estructural | refinable·refinador | cosa·cosa | **no** | no | ninguno | no | no | no | ninguno | — | RF2 RF2b RF2i | 8 |
| generalizacion | estructural | refinable·refinador | cosa·cosa | sí | no | parGeneralizacion | no | no | no | ninguno | — | RF3 RF3b RF3i RH1 RFE | 9 |
| clasificacion | estructural | refinable·refinador | cosa·cosa | sí | no | ninguno | no | no | no | ninguno | — | RF4 RF4b | 10 |
| etiquetado | etiquetada | origen·destino | cosa·cosa | sí | **sí** | origenDestino | no | no | no | ambos | opcional | SE1 SE2 SSE1 SSE2 SSE3 | 11 |
| etiquetadoBidireccional | etiquetada | origen·destino | cosa·cosa | sí | no | soloOrigen | no | no | no | ambos | doble | SE3 SSE4 SSE5 | 12 |
| reciproco | etiquetada | origen·destino | cosa·cosa | sí | no | simetrico | no | no | no | ambos | opcional | SE4 SE5 SSE6 SSE7 | 12 |
| excepcionSobretiempo | excepcion | origen·destino | proceso·proceso | sí | no | ninguno | no | no | no | ninguno | — | EX1 EX1r | 13 |
| excepcionSubtiempo | excepcion | origen·destino | proceso·proceso | sí | no | ninguno | no | no | no | ninguno | — | EX2 EX2r | 14 |

La dirección canónica es la de `extremos()`: consumo, agente e instrumento van objeto→proceso;
resultado y efecto, proceso→objeto; los estructurales, refinable→refinador; el resto,
origen→destino. `parGeneralizacion` exige que ambos extremos sean objetos.

#### 4.3.2 Reglas de contexto (una lista; cada una con su id canónico)

```ts
export interface ReglaContexto {
  readonly id: string;                       // regla canónica
  readonly tipos: readonly TipoEnlace[];
  readonly severidad: 'error' | 'warning';   // warning solo AP-27 con previos omisibles
  viola(m: Modelo, e: Enlace, idx: Indice): string | null;   // mensaje o null
  readonly accion: string;                   // acción canónica (R-AP-0B)
  readonly reparacion?: (e: Enlace) => Accion;   // ejecutable en un clic
}
export const REGLAS_CONTEXTO: readonly ReglaContexto[];
export function violacionesContexto(m: Modelo, e: Enlace): readonly Violacion[];
export function violacionesAbanico(m: Modelo, f: Abanico): readonly Violacion[];
```

| id | tipos | viola si | acción canónica | reparación |
|---|---|---|---|---|
| R-AG-1 / AP-05 (DR-5) | agente | el objeto no es físico | «Usa instrumento para máquinas, software o IA; si es humano, márcalo físico» | — |
| R-EFE-1 / R-OPD-EST-3 (DR-43) | efecto sin `entrada` ni `salida` | el objeto no tiene estados propios ni heredados | «Agrega estados al objeto o usa consumo/resultado» | — |
| AP-04 / R-RES-1 | resultado | `estado` es inicial | «Ánclalo al objeto o a un estado no inicial» | — |
| R-ROL-UNIC-1 / R-OPD-HAB-4 (DR-6) | procedimentales | otro procedimental une el mismo objeto con el mismo proceso, **o con un ancestro o descendiente por descomposición** (lectura distributiva), salvo ramas del mismo abanico | «Un solo rol por par objeto–proceso: edita el existente, completa el cambio o forma un abanico» | — |
| R-DIST-1 / AP-06 | consumo, resultado | el proceso tiene descomposición con ≥1 subproceso | «Migra al primer/último subproceso» | `distribuirEnlace` |
| R-CX-DIST-2 / AP-21 | procedimentales con `e` | el objeto es sistémico y el proceso tiene descomposición con ≥1 subproceso | «Mueve el evento al primer subproceso o marca ambiental el objeto» | `distribuirEnlace` |
| AP-07 | efecto con `entrada` y `salida` | el proceso tiene descomposición con ≥2 subprocesos | «Escinde: TS4 en el primero, TS5 en el último» | `distribuirEnlace` |
| AP-27 | procedimentales con `e` | el proceso es subproceso de la banda k>0 y alguna banda anterior tiene un transformador sin `c` (error) / todas son omisibles (warning) | «Dirige el evento al primer subproceso o declara la omisión (c) de los previos» | — |
| R-INV-2B / R-INV-2D | invocacion | invocador e invocado son subprocesos del mismo OPD en las bandas k y k+1 (doble vara) | «Quita el rayo: la secuencia ya invoca la banda siguiente» | `eliminarEnlaces` |

Reglas de abanico (`violacionesAbanico`, error `abanico-invalido`):

- las ramas son del mismo tipo, y el tipo admite abanico;
- tienen un extremo común:
  - convergente: el proceso común en consumo, efecto sobre objetos, agente e instrumento; el
    objeto común en resultado;
  - divergente: el caso contrario;
  - ramas por estados de un mismo objeto: el común es el proceso (DR-9);
- el control es uniforme; uno mixto viola R-ZNC-COMB-1 y el parser lo responde `non-canonical`.

Estas condiciones de creación son precondiciones de las operaciones, no estado del modelo:

- ambos extremos visibles en el OPD (`no-visible`);
- un interno de la descomposición D solo se enlaza con cosas que aparecen en el OPD de D (T-066,
  `interno-no-visible`);
- no existe ya un enlace idéntico (`ya-existe`).

#### 4.3.3 `NO_OFRECIDO` (canónico no soportado: la UI no lo ofrece, las operaciones lo rechazan con `no-ofrecido`, el import lo descarta con informe, el parser responde `unsupported-canonical`)

```ts
export interface FilaNoOfrecido { readonly id: string; readonly regla: string; readonly motivo: string; readonly registro: `B-${number}` }
export const NO_OFRECIDO: readonly FilaNoOfrecido[];
export function noOfrecido(m: Modelo, e: Enlace | EnlaceNuevo, abanico?: Abanico): FilaNoOfrecido | null;
```

| id | combinación | regla | registro |
|---|---|---|---|
| nf-mult-sin-hueco | multiplicidad junto a `c`; en efecto con `entrada` o `salida` (TS3–TS5 y ETS2–4 usan `identificador_de_objeto`); en etiquetados con algún estado (SSE) | DR-44, EBNF A.5/A.6/A.8 | B-04 |
| nf-reciproco-estados-sin-etiqueta | recíproco sin etiqueta con estados (SE5 no tiene variante con estado) | reglas §4.10 | B-05 |
| nf-abanico-efecto-mixto | abanico de efecto que no es T3 puro (sobre objetos o sobre procesos) ni ramas por estados de un mismo objeto con entrada común o salida común (FAN5s, FAN5e, FAN5A) | R-FAN-5/5A | B-06 |
| nf-abanico-control | control en abanico salvo: consumo convergente con todas las ramas `c` (C-18); efecto divergente sobre procesos con todas `c` (reglas §7.4); efecto con objeto común y todas `e` (R-FAN-4) | T-056, C-19b | B-08 |
| nf-descomposicion-objeto | descomponer un objeto | R-OPL-CX-4, DR-23 | B-02 |

#### 4.3.4 Consumidores (sin copias)

```ts
export type Alternativa =
  | { readonly k: 'completarCambio'; readonly enlace: Id; readonly estados: EstadosEnlace }   // TS4/TS5 ⇒ TS3
  | { readonly k: 'abanicoCon'; readonly enlace: Id }                                        // ofrecer XOR y OR
  | { readonly k: 'cambiarTipoExistente'; readonly enlace: Id };
export type OpcionTipo =
  | { readonly tipo: TipoEnlace; readonly sentido: 'directo' | 'inverso'; readonly legal: true;
      readonly candidato: EnlaceNuevo; readonly avisos: readonly Violacion[] }
  | { readonly tipo: TipoEnlace; readonly sentido: 'directo' | 'inverso'; readonly legal: false;
      readonly motivo: Violacion; readonly alternativa?: Alternativa }
  | { readonly tipo: 'etiquetadoBidireccional'; readonly sentido: 'directo' | 'inverso';
      readonly legal: 'pendiente'; readonly requiere: readonly ['etiqueta', 'inversa'];
      readonly avisos: readonly Violacion[] }
  | { readonly tipo: 'reciproco'; readonly sentido: 'directo' | 'inverso';
      readonly legal: 'pendiente'; readonly requiere: readonly ['etiqueta'];
      readonly avisos: readonly Violacion[] };
export function violacionesForma(m: Modelo, e: Enlace | EnlaceNuevo): readonly Violacion[];
export function normalizarEtiquetas(e: EnlaceNuevo): Respuesta<EnlaceNuevo>;
```

- **`tiposLegales`** evalúa una intención por cada fila y cada sentido admisible del gesto.
  - Los estados arrastrados van al rol que la fila admite. En efecto, van a `entrada` si el gesto
    sale del estado y a `salida` si llega a él. En generalización, van al par solo si ambos extremos
    son estados.
  - `etiquetas` aporta datos del usuario en los roles origen/destino de la opción después de
    aplicar `sentido`; no se infieren de nombres ni se intercambian por una suposición lingüística.
    La firma del gesto y las precondiciones decidibles se validan primero con la misma matriz.
  - Un bidireccional sin los datos requeridos devuelve `legal:'pendiente'`, requiere etiqueta e
    inversa y no contiene candidato. Un recíproco con estados y sin etiqueta suministrada también
    queda pendiente. Un null explícito, vacío o léxico inválido en un dato requerido devuelve
    rechazo; unidireccional y recíproco sin estados conservan la etiqueta opcional ausente/null.
    El hecho real recíproco con estados y sin etiqueta sigue rechazado por B-05.
  - Una intención completa pasa por `normalizarEtiquetas` (léxico único; igualdad bidireccional
    válida y no vacía ⇒ recíproco con traza R-STRE-1), `violacionesForma`, `noOfrecido` y las
    precondiciones. Su admisibilidad se evalúa sobre el resultado efectivo de distribución (§4.5.3)
    y el cierre DS-20. `legal:true.candidato` conserva la intención completa que recibe creación;
    puede transformarse antes de persistir. F-11 se exige al modelo efectivo final.
  - Si R-ROL-UNIC-1 bloquea por un enlace existente L sobre el mismo par, adjunta la `alternativa`
    del «segundo gesto»:
    - si L es un TS4 y el gesto llega a otro estado del objeto, o L es un TS5 y el gesto sale de un
      estado, `completarCambio`;
    - si L es del mismo tipo y el abanico sería legal, `abanicoCon`;
    - si no, `cambiarTipoExistente`.
    Una colisión solo por ancestro/descendiente conserva el rechazo sin estas alternativas de
    mismo par. La identidad de un hecho es semántica y no depende del orden de claves anidadas.
  - Orden: completas legales por `menu`, pendientes seleccionables por `menu`, luego rechazadas
    con motivo. Los consumidores comparan `legal === true/false/'pendiente'` explícitamente.
- **`normalizarEtiquetas`** es un ayudante puro compartido por consulta y operaciones de enlaces;
  conserva la entrada, usa `validarEtiqueta` sin trim/capitalización y devuelve la intención
  normalizada con sus trazas. No es una operación registrada. La consulta conserva el candidato
  completo original para que creación pueda emitir la traza de su normalización.
- **`crearEnlace`**, `reanclarExtremo` y `cambiarTipoEnlace` usan las mismas funciones, más la
  distribución y el cierre DS-20. Consulta completa, creación y reparación consumen la misma
  distribución pura; no se ignoran R-DIST-1/AP-07/R-CX-DIST-2 en los hechos efectivos.
  DS-20 compara siempre el original real, antes de insertar candidato o reservar ids, con el
  resultado efectivo final; el borrador que ya contiene el enlace no se toma por modelo previo.
- **Integración serial (B-28):** WP-2 verifica las reglas y los estados de datos; WP-3b verifica
  equivalencia real sobre constructores sin refinamientos; WP-4r agrega la distribución compartida
  a consulta/creación/reparación y cierra la equivalencia refinada. Hasta WP-4r/H2 no se declara
  esa equivalencia completa ni se acredita con stubs; el límite permanece en conformidad/HANDOFF.
- **Planificador OPL**: cada hecho reconocido se convierte en el mismo `EnlaceNuevo`.
  - Forma, contexto o precondición fallidos dan `type-mismatch` y la razón `enlace-invalido-firma`,
    con la regla en el mensaje.
  - `noOfrecido` da `unsupported-canonical`.
- **`diagnosticar`**: aplica `violacionesContexto` y `violacionesAbanico` a todo enlace y todo
  abanico, y produce `enlace-invalido` y `abanico-invalido`.
- **Importador**: `violacionesForma` y `noOfrecido` descartan el elemento con informe; los errores
  de contexto se cargan.

`erroresContexto(m)` = las violaciones de severidad `error` de `violacionesContexto` sobre todos
los enlaces, más `violacionesAbanico` sobre todos los abanicos. Es la base del cierre DS-20.

### 4.4 Diagnósticos (`nucleo/diagnostico.ts`) — CONTRATO

```ts
export type Severidad = 'error' | 'warning' | 'info';        // ≙ CRÍTICA / ALTA-MEDIA / BAJA (método A8.1, DR-40)
export type FamiliaDiagnostico = 'gramatical' | 'metodologica' | 'identidad' | 'contencion' | 'sugerencia';   // R-OPD-VAL-2
export interface Diagnostico {
  readonly codigo: CodigoDiagnostico; readonly regla: string; readonly severidad: Severidad;
  readonly familia: FamiliaDiagnostico; readonly mensaje: string; readonly accion: string;
  readonly refs: readonly Ref[]; readonly opd?: Id;
  readonly reparacion?: Accion;           // un clic; el panel agrupa por código y ofrece «Aplicar a los N»
}
export interface FilaCatalogo { readonly codigo: string; readonly regla: string; readonly severidad: Severidad; readonly familia: FamiliaDiagnostico; readonly accion: string }
export const CATALOGO = [ /* filas de la tabla siguiente */ ] as const satisfies readonly FilaCatalogo[];
export type CodigoDiagnostico = (typeof CATALOGO)[number]['codigo'];   // unión de literales kebab
```

`diagnosticar(m)` recorre el **modelo**, nunca el OPL (A8.2), y se memoiza por identidad. Solo
`error` bloquea, y bloquea el export canónico, nunca la edición. El catálogo es cerrado:

| código | regla | sev. | familia | condición | reparación |
|---|---|---|---|---|---|
| `enlace-invalido` | la de §4.3.2 | error | gramatical / contencion | violación de contexto en un enlace existente | la de la regla |
| `abanico-invalido` | T-054, R-ZNC-COMB-1 | error | gramatical | `violacionesAbanico` | — |
| `nombre-duplicado` | T-024, AP-22 | error | identidad | ≥2 cosas con la misma `claveNombre` | `renombrarCosa` de la 2.ª y siguientes a `sugerirNombre` |
| `nombre-fuera-de-lexico` | T-025, R-§18-LEX-1 | error | gramatical | nombre de cosa fuera del léxico (incluido el vacío) | `renombrarCosa` a `sugerirNombre` |
| `estado-duplicado` | T-015 | error | identidad | dos estados de un objeto con la misma clave | `renombrarEstado` a sugerido |
| `estado-fuera-de-lexico` | T-025 | error | gramatical | nombre de estado fuera del léxico | `renombrarEstado` a sugerido |
| `etiqueta-fuera-de-lexico` | R-OPL-SE-1, EBNF `frase_no_capitalizada` / `cadena_etiqueta` | error | gramatical | etiqueta fuera de `frase_no_capitalizada` (incluida la que empieza en mayúscula: cubre la «etiqueta estructural no minúscula» de T-266, que `fijarEtiqueta` ya rechaza al nombrar) o ruta fuera de `cadena_etiqueta`; solo llega por import (CC-06) | — |
| `precedencia-invalida` | AP-30, R-PREC-1 | error | contencion | en la vista del padre colisionan R+R o C+C | — |
| `conflicto-resultado-consumo` | R-PREC-3/4 | warning | contencion | colisión R+C sin continuidad de estados | — |
| `proceso-sin-transformacion` | R-PROC-2, R-OPD-TR-8 | warning | metodologica | sin consumo, resultado ni efecto propio, heredado (DR-43) ni en sus subprocesos | — |
| `subproceso-sin-transformado` | método A3.1 | warning | metodologica | subproceso sin transformador propio ni heredado | — |
| `refinamiento-trivial` | AP-13, R-REF-NTRIV-1/2 | warning | contencion | refinamiento con <2 subprocesos o refinadores (bloquea el export) | — |
| `enlace-en-contorno-temporal` | R-VIS-DIST-1 | info | contencion | consumo o resultado en el contorno de una descomposición sin subprocesos | — |
| `opd-denso` | R-LAY-1 | warning | sugerencia | 21–25 cosas en el OPD | — |
| `opd-sobrecargado` | R-LAY-1, R-OPD-LAY-2 | warning | sugerencia | >25 cosas (bloquea el export del OPD) | — |
| `sd-sin-proceso-unico` | R-SD-4, R-VIS-SD-1 | warning | metodologica | el SD no tiene exactamente un proceso sistémico | — |
| `manejador-no-ambiental` | R-EXC-1A | warning | metodologica | excepción con manejo sistémico | `fijarAfiliacion` ambiental |
| `cota-faltante` | R-EXC-2/3, R-EXC-DUR-1 | warning | metodologica | sobretiempo sin `duracion.max` o subtiempo sin `min` en la fuente | — |
| `afiliacion-incoherente` | R-OBJ-6, R-OPD-STR-13, R-VIS-HER-2 | warning | metodologica | rasgo sistémico de un exhibidor ambiental, directo o por la cadena transitiva de exhibición (CC-02); llega por import o por volver sistémico un rasgo a mano | `fijarAfiliacion` ambiental |
| `proceso-de-ambientales` | R-OBJ-7 | warning | metodologica | proceso sistémico cuyos agentes e instrumentos son todos ambientales | — |
| `refinador-en-varios-contextos` | R-OPD-OP-6 | warning | contencion | refinador en >1 refinamiento con relación distinta | — |
| `general-redundante` | R-OPD-VAL-6 | info | sugerencia | X especializa G y G′, y G′ es general de G | `eliminarEnlaces` del redundante |
| `objeto-transiente` | AP-26 | warning | metodologica | objeto con exactamente un resultado y un consumo, y nada más | — |
| `nombre-proceso-largo` | R-NOM-PROC-2 | warning | metodologica | fuera de 2–4 palabras | — |
| `nombre-proceso-no-deverbal` | R-NOM-PROC-1 | warning | metodologica | heurística -ar/-er/-ir/-ción/-sión/-miento/-aje/-ado/-ido | — |
| `nombre-objeto-plural` | R-NOM-OBJ-1/2 | warning | metodologica | heurística de plural sin `Conjunto`/`Grupo` | — |
| `nombre-estado-no-descriptivo` | R-NOM-EST-1 | warning | metodologica | termina en -ar/-er/-ir o es un numeral puro | — |
| `etiqueta-larga` | R-OPL-SE-1 («frase breve») | info | gramatical | etiqueta estructural de >4 palabras (heurística, B-14) | — |
| `mezcla-infinitivo-nominalizacion` | método A2.3 | info | metodologica | el modelo mezcla ambas formas | — |
| `estado-sin-escritor` | LF-19 | info | metodologica | estado no inicial de un objeto de flujo que ningún resultado o efecto produce | — |
| `agente-humano` | R-AG-1 (DR-5) | info | metodologica | uno por objeto agente: «verifica que sea humano o grupo humano» | — |
| `ajuste-automatico` | R-OPD-OP-5, R-OPD-EDIT-6 | info | sugerencia | colección parcial en una vista, o contorno grueso por refinamiento | — |
| `cosa-sin-aparicion` | T-262, A8.2 | warning | identidad | la cosa no aparece en ningún OPD (bloquea `canon-documento`, B-26) | — (la acción abre «Buscar › Traer») |
| `enlace-sin-vista` | A8.2 | warning | identidad | el enlace no es visible en ningún OPD (bloquea `canon-documento`, B-26) | — (la acción: «Traer a un OPD» su extremo faltante) |

**Gates de export** (`gatesExportacion`, T-283):

- `alcance {opd}` bloquea si el OPD tiene >25 cosas, si es un refinamiento con <2
  subprocesos/refinadores o si hay un `error` cuyas refs se ven en ese OPD.
- `'modelo'` bloquea si ocurre cualquiera de esos en cualquier OPD, si hay un `error` sobre una
  cosa sin aparición, **o si hay `cosa-sin-aparicion` o `enlace-sin-vista`**: `canon-documento`
  declara el modelo completo y esos hechos no caen en ningún bloque OPL ni en ningún diagrama (T-100,
  T-281, CC-01; se registra como B-26).

JSON y OPL Markdown no tienen gate (intercambio, T-282, T-286). El menú de export avisa en el ítem
«OPL Markdown» «⚠ N cosas y M enlaces fuera de todo OPD no figuran en el OPL · Ver» cuando existen
(el JSON sí los contiene).

### 4.5 Refinamiento (`nucleo/refinamiento.ts`)

#### 4.5.1 Descomponer (in-zoom), atómico (T-070)

`descomponer({opd, proceso, bandas?})`:

1. **Precondiciones**:
   - el proceso es visible en `opd`;
   - no tiene descomposición (`ya-refinado`);
   - no es externo de `opd` cuando este es hijo (`externo-no-refinable`, R-HIJO-5, T-079);
   - no es la cosa refinada de `opd` ni de ningún ancestro (`ciclo`, R-REF-1, T-078);
   - un objeto da `descomposicion-objeto`, regla R-OPL-CX-4, «no disponible (DR-23)».
2. Crea `OpdDescomposicion{padre: opd, cosa: proceso, orden: #hermanos, bandas: [], objetosInternos: []}`.
   El proceso aparece como contenedor, con el tamaño de `colocacion.contenedor`.
3. Copia como **externas** todas las cosas conectadas al proceso por cualquier enlace (R-HIJO-3),
   en las posiciones de `colocacion.externos`. Esencia, afiliación y estados viven en la cosa y se
   conservan por construcción (R-REF-4).
4. Si `bandas` trae nombres, ejecuta `agregarSubprocesos` en la misma transacción (DS-3).

Se deshace en un paso.

#### 4.5.2 Subprocesos y bandas

- **`agregarSubprocesos`**:
  - Crea procesos con léxico y unicidad. Un nombre que ya existe y no es subproceso de esta
    descomposición da `referencia-ambigua` (DR-35).
  - Los procesos heredan la afiliación ambiental del contenedor (R-OBJ-6, traza) y aparecen como
    internos en `y = banda(k)`, y se insertan las bandas.
  - **Si la descomposición tenía 0 subprocesos, ejecuta la distribución §4.5.3 sobre todos los
    enlaces del contorno** (DS-3, T-076).
- **`moverSubproceso`**:
  - Mueve el subproceso a una banda existente o crea una banda nueva; las bandas vacías se
    eliminan.
  - Recalcula la `y` de todos los internos y la altura del contenedor (R-LAY-4).
  - **No migra enlaces**. Usa `permiteErroresNuevos`: la doble vara o el AP-27 que surjan quedan
    como error recuperable (T-269).
  - `fijarBandas` aplica una partición completa del mismo conjunto de subprocesos; lo usan el OPL
    (`fijar-orden`) y `moverSubproceso`, con las mismas reglas.
- La posición vertical es función de la banda. El arrastre vertical en el lienzo se traduce en
  `moverSubproceso`, nunca en una coordenada libre (P6, T-082). El arrastre horizontal es libre y
  queda confinado al contenedor (R-OPD-UI-3).

#### 4.5.3 Distribución (reglas §8.5, DR-13, DR-14, DS-3, DS-4): misma función para 0→n, enlaces tardíos y reparación (el import no distribuye: mapea derivados y carga lo demás como error reparable, §3.4.2-8, CC-21)

Sea `P` descompuesto con subprocesos `S`. El **primero** es `bandas[0]` con el primer nombre de la
banda; el **último** es el último de la última banda. Para cada enlace del contorno de `P`:

| enlace en P | \|S\| = 0 | \|S\| = 1 | \|S\| ≥ 2 | traza |
|---|---|---|---|---|
| consumo; cualquier procedimental con `e` desde objeto sistémico | queda (respaldo temporal, T-076) | → S₁ (mismo id) | → primero | R-DIST-1 / AP-21 |
| resultado | queda | → S₁ | → último | R-DIST-1 |
| efecto TS3 **sin control y fuera de abanico** | queda | → S₁ entero | **escisión**: la mitad de entrada (TS4, id original) al primero y la de salida (TS5, id nuevo) al último, ambas con `escision` | R-ESCIND-1..3, AP-07, T-074 |
| efecto TS3 **con control o rama de abanico** | queda | → S₁ entero | → **primero entero**, con traza «el cambio de estado de **O** conserva su evento/condición y quedó entero en *S1*; para escindirlo, quita antes el control» | DS-4, AP-08, R-FAN-5A |
| efecto TS4 / TS5 standalone | queda | → S₁ | TS4 → primero; TS5 → último | DS-3 |
| efecto T3, agente, instrumento (sin `e` sistémico) | queda en el contorno (lectura distributiva, DR-13) | ídem | ídem | — |
| invocación, excepción, estructurales, etiquetados | quedan (DR-14) | ídem | ídem | — |

- **Enlace tardío**: `crearEnlace` sobre un `P` descompuesto con |S| ≥ 1 aplica la misma tabla al
  enlace nuevo, recursivamente si el destino también está descompuesto. Agrega la aparición externa
  del objeto en cada OPD de descomposición atravesado (R-HIJO-3).
- Toda migración conserva el id (R-OPD-OP-4, T-075). La mitad TS5 es un enlace creado por
  escisión.
- Si un enlace migrado es rama de un abanico, el abanico sigue: con extremo común en `P`, todas las
  ramas en `P` migran juntas al mismo subproceso.
- `distribuirEnlace` aplica la tabla a un solo enlace.

La única realización pura de esta tabla vive en `refinamiento.ts` (WP-4r) y sirve también al
ensayo de consulta y a creación. Su frontera interna es reutilizable, sin operación nueva:

```ts
export function planificarDistribucion(m: Modelo, a: { readonly opd: Id; readonly enlace: Enlace }): Respuesta<Hecho>;
```

`m` es el borrador preparado con enlace/id/secuencia y pertenencia al abanico si procede; para
reparación contiene el enlace existente. La salida entrega modelo de ensayo, ids adicionales y
trazas sin mutar la entrada. El plan no hace DS-20 contra ese borrador: el consumidor conserva
el original anterior a insertar y valida forma/soporte/contexto finales y DS-20 contra ese original.
Una función interna existente con esa misma frontera se reutiliza en vez de duplicar la tabla.

#### 4.5.4 Desplegar (unfold) por modo (T-071)

`desplegar({opd, cosa, modo, refinadores?})`:

- **Precondiciones**, análogas a descomponer: la cosa es visible, no tiene despliegue, no hay ciclo
  y no es externa.
- Crea `OpdDespliegue`. La cosa aparece arriba al centro, con contorno grueso en el padre y en el
  hijo (R-CTRN-2).
- Copia **solo** los hijos estructurales directos de ese modo (R-HIJO-4), abajo, en una fila por
  nombre.
- `refinadores` crea cosas del **mismo tipo** que la cosa; en exhibición crea objetos, salvo que se
  indique `tipo`. Crea también un enlace estructural del modo por cada una.
- En exhibición, los rasgos heredan la afiliación ambiental (R-OBJ-6, traza).
- `agregarRefinadores` hace lo mismo más tarde.

#### 4.5.5 Colección incompleta y ajuste automático (T-087)

- **Declarada**: `Cosa.incompleta` (el modelador afirma que faltan partes).
- **De vista** (R-OPD-EDIT-6, A3.2): en un OPD que muestra un refinable con relación `k` sin todos
  sus refinadores por `k`, la proyección marca `incompleta` para ese grupo. Se ve la barra bajo el
  triángulo y «y al menos otra parte» en el bloque, y `diagnosticar` emite `ajuste-automatico`
  (traza derivada; no se persiste nada).
- Nunca en clasificación: `RelacionIncompleta` no la admite.

#### 4.5.6 Eliminar refinamiento (DR-17, DS-16, T-083, T-080)

Solo se permite si el OPD es hoja (`refinamiento-no-hoja`, R-REF-3). La UI pide confirmación con
tres listas:

- lo que se elimina: los internos de la descomposición (`bandas` y `objetosInternos`) o, en un
  despliegue, los refinadores cuya única aparición era ese OPD;
- los enlaces que se pierden;
- los enlaces que se **conservan en el padre**.

La operación tiene cuatro pasos:

1. Calcula la vista abstraída del padre (§4.6) para los enlaces entre externos e internos, y la
   materializa sobre la cosa refinada con el id del hecho de mayor fuerza. Un par escindido se
   funde de vuelta en su TS3. Los `precedencia-invalida` no se materializan y quedan en la lista de
   pérdidas.
2. Quita el OPD y renumera el `orden` de sus hermanos para mantenerlo denso (F-7); sus etiquetas
   `SDx.y` mutan, los ids no (R-IDP-1A, CC-25).
3. Elimina en cascada los internos listados, con sus estados y enlaces (T-080). Los externos
   persisten.
4. Disuelve los abanicos que quedan con <2 ramas.

Todo queda en trazas. Nunca se presenta como inversa de otra operación (A1.5-d).

#### 4.5.7 Quitar de este OPD ≠ eliminar del modelo (R-VIS-APP-1, T-251, DS-5, DS-6)

- **`quitarDeOpd`** retira apariciones, y nada más: nunca elimina hechos. La última aparición se
  puede quitar, y la cosa sigue en el modelo con `cosa-sin-aparicion`. No se puede quitar el
  contenedor ni el refinable de su propio OPD hijo, ni un interno.
- **`eliminarCosas`** elimina del modelo con la cascada declarada. Rechaza toda cosa con
  refinamientos; primero se elimina el refinamiento, de las hojas hacia arriba.

### 4.6 Proyección por OPD (`nucleo/proyeccion.ts`) — CONTRATO

```ts
export interface Vista {
  readonly opd: Id;
  readonly clase: 'raiz' | 'descomposicion' | 'despliegue';
  readonly cosas: readonly CosaVista[];
  readonly enlaces: readonly EnlaceVisto[];
  readonly abanicos: readonly AbanicoVisto[];
  readonly incompletas: readonly { readonly refinable: Id; readonly relacion: RelacionIncompleta; readonly declarada: boolean }[];
  readonly conflictos: readonly Diagnostico[];             // AP-30 / R-PREC-3 de este OPD
}
export interface CosaVista {
  readonly cosa: Id;
  readonly rol: 'libre' | 'contenedor' | 'subproceso' | 'interno' | 'externo' | 'refinable';
  readonly banda?: number;                                 // subprocesos
  readonly estadosVisibles: readonly Id[];                 // en el orden del modelo
  readonly ocultos: number;                                // chip ⋯N y D6
}
export interface EnlaceVisto {
  readonly clave: string;                                  // estable: tipo|extremos vistos|estados|control
  readonly enlace: Enlace;                                 // hecho visto (sintetizado si abstraído; id = primer subyacente)
  readonly hechos: readonly Id[];                          // enlaces del modelo que representa (1 si es directo)
  readonly abstraido: boolean;
}
export interface AbanicoVisto { readonly abanico: Id; readonly operador: Operador; readonly ramas: readonly Id[]; readonly comun: Id }
```

Algoritmo (DR-13, R-VIS-HIJO-1, reglas §6.5/§6.6):

1. `visto(x)` es `x` si `x` tiene aparición en el OPD. Si no, y `x` es un **proceso** interno de una
   descomposición D, es `visto(D.cosa)`. En otro caso es indefinido. Solo el in-zoom abstrae y solo
   eleva procesos, así el hecho abstraído conserva su firma.
2. Para cada enlace se calculan sus extremos vistos. Si uno es indefinido, el enlace no se ve. Si
   ambos colapsan en la misma cosa y el enlace no admite reflexivo, desaparece.
3. En un OPD de **descomposición** se ven los enlaces que tocan al contenedor o a un interno, y se
   ocultan los que unen dos externos (R-VIS-HIJO-1). Los procedimentales al contorno se ven en el
   contorno: es un desvío declarado (DR-13, B-19). En un **despliegue** se ven los que tocan a la
   cosa o a un refinador, y se ocultan los que unen dos externos. Los estructurales y etiquetados
   nunca se abstraen.
4. Los procedimentales abstraídos se agrupan por par visto (objeto, proceso). En un grupo con más
   de un hecho:
   - el transformador prevalece sobre el habilitador (R-PREC-5);
   - entre transformadores rige la matriz 3×3:
     - E+E da E, E+R da R y E+C da C;
     - R+R y C+C dan `precedencia-invalida` y se muestran ambos;
     - R+C se recompone como efecto solo con continuidad de identidad y estados trazables
       (R-PREC-2), conservando la procedencia de los hechos; sin esa evidencia se muestran ambos
       y se emite `conflicto-resultado-consumo` (R-PREC-3/4), `warning` de `contencion` (§4.4);
   - entre habilitadores, el agente prevalece sobre el instrumento;
   - el control resultante es el de mayor fuerza: evento > sin control > condición.

   Los 12 niveles de fuerza son los de T-085. En los efectos fusionados, la entrada es la del hecho
   con entrada de banda más temprana y la salida la del de banda más tardía: un par escindido
   vuelve a verse como su TS3.
5. Un abanico se ve si todas sus ramas se ven y siguen siendo distintas. Si las ramas colapsan en un
   mismo extremo, se ve como un único enlace fusionado.
6. Estados visibles: `¬suprimido ∧ id ∉ aparicion.ocultos`, **salvo** los anclados por un enlace
   visible en ese OPD, que siempre se ven. `suprimirEstado` rechaza ocultarlos, y
   `crearEnlace`/`fijarEstados` los des-suprimen localmente con traza (LF-03).
7. Memo por `(modelo, opd)` en `WeakMap`: consultar la misma vista memoizada cuesta O(1).
   Para una vista nueva, con el índice básico ya construido, el costo es O(D + P + E + A + S):
   D OPDs del modelo, P procesos relevantes, E enlaces escaneados, A apariciones de la vista y
   S estados o entradas ocultos inspeccionados o emitidos. Los auxiliares temporales privados
   y puros se comparten por identidad de Modelo y se preparan en O(D + P); cada consulta de
   secuencia cuesta O(1). La construcción fría del índice básico se mide aparte. Se conservan
   las latencias de §2.4 y todas las pruebas existentes.

**Ley de frontera** (T-089, DR-16). La firma `{(externa, tipo fusionado, estados)}` de los enlaces
del contenedor en la vista del padre es igual a la fusión de los enlaces entre externos y {contenedor
∪ internos} del hijo. `frontera.test.ts` la verifica con una implementación independiente de ~40
líneas y con mutantes que deben ponerla roja.

### 4.7 Etiquetas `SDx.y` y orden

`opdsEnPreorden` recorre la raíz y luego los hijos por `orden` ascendente, de forma recursiva
(T-100). Se calcula una sola vez en `indice(m)` (`Indice.preorden`, `Indice.etiqueta`, WP-1);
`etiquetaOpd` y `opdsEnPreorden` solo leen ese índice (CC-22). `etiquetaOpd` da `SD` a la raíz, `SD1`, `SD2`… a sus hijos y `SD1.1`… a los nietos
(DR-4). Es una proyección de navegación que muta si se elimina un hermano (R-IDP-1A); la identidad
es `opd.id` (AP-17). El OPL resuelve `SDx.y` al id (T-167).

### 4.8 Herencia en validadores (DR-43)

`herencia.generales(m, cosa): readonly Id[]` es el cierre transitivo por generalización, con
herencia múltiple (T-093) y corte de ciclos. Lo usan solo R-EFE-1 (los estados heredados cuentan
para T3), `proceso-sin-transformacion` y `subproceso-sin-transformado` (los transformadores del
general cuentan), y `general-redundante`. Nada heredado se dibuja ni se emite (T-092). El anclaje a
estado solo admite estados propios.

---

## 5. OPL

### 5.1 Vocabulario (`opl/vocabulario.ts`)

- **Cerrado** (DR-27, T-104). El conjunto de palabras fijas es la unión de los literales de
  `PLANTILLAS`. `vocabulario.test.ts` extrae esos literales y exige que cada palabra esté en
  `VOCABULARIO` y viceversa: sin sinónimos y con verbos en 3.ª persona singular.
- **Tipografía** (T-102): `**objeto**`, `*proceso*` y `` `estado` ``. La única excepción literal es
  `` `Current` `` en D13.
- **Unidades** (DECISIONS 4, DR-18): `ms→milisegundo(s)`, `sec→segundo(s)`, `min→minuto(s)`,
  `hour→hora(s)`, `day→día(s)`, `week→semana(s)`, `month→mes(es)`, `year→año(s)`. Van en singular si
  el valor es 1. Los decimales usan punto (EBNF `numero_decimal`).
- **Multiplicidad** (DS-15, T-128): `?` → `un opcional | una opcional`; `*` → `opcional (cero o
  más)`; `+` → `al menos un | al menos una`. El género es el de la cosa cuantificada y nunca se
  emiten glifos.
- **Conjunciones** (DR-26, T-130):
  - `y` pasa a `e` ante /i/ (`i-`, y `hi-` seguido de consonante; no `hie-` ni `hia-`).
  - `o` pasa a `u` ante /o/ (`o-`, `ho-`).
  - Las listas llevan coma entre los intermedios y la conjunción antes del último, sin coma de
    Oxford.
  - Hay dos excepciones literales: `, y otros estados` (D6) y la lista mixta de CX.
- **Mayúscula inicial**: el generador capitaliza el primer carácter de cada oración; el analizador
  compara el primer literal sin distinguir mayúsculas.
- **Pluralización de la UI**: `plural(n, 'oración', 'oraciones')`. No se escribe «1 oraciones».

### 5.2 Tipos de OPL — CONTRATO (`opl/linea.ts`, `opl/analizar.ts`, `opl/planificar.ts`)

```ts
// ---------- Salida del generador ----------
export interface TokenOpl {
  readonly texto: string;                                   // sin marcas Markdown
  readonly rol: 'texto' | 'nombre' | 'verbo' | 'estado' | 'multiplicidad';
  readonly marca?: 'objeto' | 'proceso' | 'estado';         // **…**, *…*, `…`
  readonly ref?: Ref;                                       // cosa/estado/opd del hueco (T-135)
  readonly hecho?: Id;                                      // enlace del sub-span (R-OPL-INT-6, T-245)
}
export interface LineaOpl {
  readonly id: string;              // estable por hecho, no posicional: `${opd}#${plantilla}:${clave}` (§5.4)
  readonly plantilla: string;       // id de §5.3
  readonly texto: string;           // Markdown canónico; se construye desde los tokens (una sola fuente)
  readonly tokens: readonly TokenOpl[];
  readonly refs: readonly Ref[];    // únicas por tipo:id, en orden de primera aparición
  readonly hechos: readonly Id[];   // enlaces del modelo que la línea expresa (abstraídos incluidos)
  readonly opd: Id; readonly etiquetaOpd: string; readonly profundidad: number;
  readonly soloDisplay?: true;      // cabeceras de bloque y D2 de display (T-185)
}
export interface OpcionesOpl { readonly esencia: 'siempre' | 'solo-difiere' | 'oculta'; readonly numeracion: boolean }

// ---------- Salida del analizador (por nombres; no conoce el modelo) ----------
export interface NombreTipado { readonly nombre: string; readonly tipo: TipoCosa }
export interface ExtremoTexto extends NombreTipado {
  readonly estado?: string; readonly mult?: Multiplicidad; readonly genero?: 'f'; readonly cualquierEstado?: true;
}
export type EnlaceTexto =
  | { readonly tipo: 'consumo' | 'resultado' | 'agente' | 'instrumento'; readonly objeto: ExtremoTexto; readonly proceso: string;
      readonly control?: Control; readonly ruta?: string }
  | { readonly tipo: 'efecto'; readonly objeto: ExtremoTexto; readonly proceso: string;
      readonly entrada?: string; readonly salida?: string; readonly control?: Control }
  | { readonly tipo: 'invocacion' | 'excepcionSobretiempo' | 'excepcionSubtiempo'; readonly origen: string; readonly destino: string }
  | { readonly tipo: 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion';
      readonly refinable: ExtremoTexto; readonly refinador: ExtremoTexto }        // estados solo en generalización (RFE)
  | { readonly tipo: 'etiquetado' | 'etiquetadoBidireccional' | 'reciproco';
      readonly origen: ExtremoTexto; readonly destino: ExtremoTexto; readonly etiqueta?: string; readonly inversa?: string };
export type HechoTexto =
  | { readonly k: 'esencia'; readonly cosa: NombreTipado; readonly valor: Esencia }
  | { readonly k: 'afiliacion'; readonly cosa: NombreTipado; readonly valor: Afiliacion }
  | { readonly k: 'mencion'; readonly cosa: NombreTipado }                     // D2, D4, D11/D12 coherentes: existencia
  | { readonly k: 'estados'; readonly objeto: string; readonly nombres: readonly string[]; readonly otros: boolean }
  | { readonly k: 'designacion'; readonly objeto: string; readonly estado: string; readonly designaciones: readonly Designacion[] }
  | { readonly k: 'valor'; readonly atributo: string; readonly exhibidor: string; readonly valor: string }
  | { readonly k: 'cota'; readonly proceso: string; readonly campo: 'max' | 'min'; readonly n: number; readonly unidad: UnidadTiempo }
  | { readonly k: 'enlace'; readonly enlace: EnlaceTexto }
  | { readonly k: 'abanico'; readonly operador: Operador; readonly ramas: readonly EnlaceTexto[] }
  | { readonly k: 'incompleta'; readonly cosa: NombreTipado; readonly relacion: RelacionIncompleta }
  | { readonly k: 'descomposicion'; readonly proceso: string; readonly bandas: readonly (readonly string[])[];
      readonly internos: readonly string[]; readonly opdPadre?: string; readonly opdHijo?: string }
  | { readonly k: 'despliegue'; readonly cosa: NombreTipado; readonly opdHijo?: string; readonly refinadores: readonly NombreTipado[] };
export type CodigoOpl = 'syntax-error' | 'unknown-symbol' | 'ambiguous-symbol' | 'type-mismatch'
  | 'patch-conflict' | 'unsupported-canonical' | 'non-canonical' | 'no-delete-by-absence';
export interface DiagOpl {                                  // R-OPL-FALLO-1, T-177
  readonly codigo: CodigoOpl; readonly severidad: Severidad; readonly linea: number;
  readonly mensaje: string; readonly regla?: string;
}
export interface LineaAnalizada {
  readonly numero: number; readonly texto: string; readonly vacia: boolean;
  readonly cabecera?: string;                               // '## SD1 …' ⇒ 'SD1' (solo contexto, T-185)
  readonly plantilla?: string; readonly hechos: readonly HechoTexto[]; readonly diagnosticos: readonly DiagOpl[];
}
export function analizar(texto: string): readonly LineaAnalizada[];

// ---------- Planificación y aplicación ----------
export type TipoPatch = 'crear-entidad' | 'traer-entidad' | 'cambiar-esencia' | 'cambiar-afiliacion' | 'sincronizar-estados'
  | 'aplicar-designacion-estado' | 'fijar-valor' | 'fijar-cota' | 'crear-refinamiento' | 'fijar-orden' | 'fijar-incompleta'
  | 'crear-enlace' | 'ajustar-enlace' | 'fijar-etiqueta-enlace' | 'crear-abanico' | 'renombrar-entidad' | 'renombrar-estado';
export interface Patch {
  readonly p: TipoPatch;
  readonly fase: 1 | 2 | 3;                  // 1 no-enlace · 2 enlace y cota · 3 abanico (R-OPL-EDIT-5, T-181)
  readonly clave: string;                    // clave de hecho: detecta conflicto-patches (T-178)
  readonly acciones: readonly Accion[];      // operaciones del núcleo, con los ids que asignó el ensayo
  readonly descripcion: string;              // «crear objeto **Cliente**», «crear enlace consumo» (R-OPL-EDIT-1)
}
export type EstadoLinea = 'ignorada-vacia' | 'aplicable' | 'no-aplicable' | 'sin-cambio';            // T-174
export type RazonNoAplicable = 'forma-no-reconocida' | 'entidad-no-existe' | 'referencia-ambigua' | 'enlace-invalido-firma'
  | 'conflicto-patches' | 'inversa-no-soportada' | 'puntuacion-faltante' | 'cambio-ya-presente';      // T-176: cerrado
export interface LineaPlan {
  readonly numero: number; readonly texto: string; readonly estado: EstadoLinea;
  readonly patches: readonly Patch[]; readonly diagnosticos: readonly DiagOpl[];
  readonly razon?: RazonNoAplicable;         // solo si no-aplicable; o 'cambio-ya-presente'/'inversa-no-soportada' como detalle de sin-cambio
  readonly detalle: string;                  // texto visible de la canaleta
}
export interface ResumenPlan { readonly total: number; readonly aplicables: number; readonly noAplicables: number; readonly ignoradas: number; readonly sinCambio: number }
export interface Plan {
  readonly base: Modelo;                     // identidad del modelo planificado
  readonly alcance: Id | 'modelo';
  readonly lineas: readonly LineaPlan[];
  readonly resumen: ResumenPlan;
  readonly acciones: readonly Accion[];      // de las líneas aplicables, en orden de fases
  readonly notas: readonly DiagOpl[];        // no-delete-by-absence (info, T-172)
}
export function planificar(m: Modelo, alcance: Id | 'modelo', texto: string): Plan;    // puro (T-173)
export function aplicarPlan(m: Modelo, plan: Plan): Respuesta<Hecho>;                  // exige m === plan.base; si no ⇒ replanificar
export const TEXTO_RAZON: Readonly<Record<RazonNoAplicable, string>>;                  // textos visibles de CANON §6.2
```

`Patch` → operaciones del núcleo:

| patch (R-OPL-EDIT-5 + DR-35) | acciones |
|---|---|
| `crear-entidad` | `crearCosa` con posición de `colocar` y `alcance` explícito (subproceso, interno o externo) |
| `traer-entidad` | `traerCosa` |
| `cambiar-esencia` · `cambiar-afiliacion` | `fijarEsencia` · `fijarAfiliacion` |
| `sincronizar-estados` | `agregarEstado` por cada faltante, al final. Con `otros` (D6): `suprimirEstado` local de los existentes no listados. Sin `otros`: se muestran los listados que estaban ocultos, y un listado con supresión global la levanta, con traza. Nunca borra ni reordena. |
| `aplicar-designacion-estado` | `designar` |
| `fijar-valor` | `fijarValor` (y `crearEnlace` de exhibición en fase 2 si falta, DR-20) |
| `fijar-cota` | `fijarDuracion` |
| `crear-refinamiento` | `descomponer` / `desplegar` |
| `fijar-orden` | `agregarSubprocesos` (faltantes) + `fijarBandas` |
| `fijar-incompleta` | `fijarIncompleta` |
| `crear-enlace` · `ajustar-enlace` · `fijar-etiqueta-enlace` | `crearEnlace` · `fijarControl`/`fijarMultiplicidad`/`fijarRuta` · `fijarEtiqueta` |
| `crear-abanico` | `formarAbanico` |
| `renombrar-entidad` · `renombrar-estado` | `renombrarCosa` · `renombrarEstado` (solo edición en token, DS-12) |

`fijarBandas: Operacion<{ opd: Id; bandas: readonly (readonly Id[])[] }>` se agrega a
`nucleo/refinamiento.ts`. Recibe una partición del **mismo** conjunto de subprocesos, no migra y
usa `permiteErroresNuevos`. `moverSubproceso` se implementa con ella.

`crearCosa` acepta además `alcance?: 'interno' | 'externo'`, que prevalece sobre la inferencia
geométrica; el planificador OPL siempre lo pasa.

### 5.3 La tabla única de plantillas (`opl/plantillas.ts`)

Cada plantilla tiene esta forma:

```ts
export interface Plantilla {
  readonly id: string;
  readonly patron: string;                          // texto con huecos tipados (tabla de huecos)
  readonly estado: 'G' | 'P';                       // G = se genera y se parsea; P = solo se parsea
  readonly familia: 'cosa' | 'transformadora' | 'habilitadora' | 'evento' | 'condicion' | 'excepcion'
    | 'invocacion' | 'estructural' | 'etiquetada' | 'abanico' | 'contexto';
  readonly desde?: (h: HechoGenerable) => Huecos | null;   // generar (solo G)
  readonly hacia: (h: Huecos) => readonly HechoTexto[];     // reconocer
  readonly restricciones?: (h: Huecos) => boolean;          // p. ej. el objeto del evento = el de la subcláusula
}
export const PLANTILLAS: readonly Plantilla[];
```

Huecos:

| hueco | superficie | notas |
|---|---|---|
| `{P}` `{P1}` `{P2}` | `*Nombre*` | proceso; se acepta el sufijo ` proceso` (R-OPL-9) |
| `{O}` `{O1}` `{O2}` | `**Nombre**` | objeto |
| `{C}` | `**N**` o `*N*` | cosa; la tipografía decide el tipo |
| `{s}` `{e}` `{a}` `{b}` | `` `nombre` `` | estado del objeto del hueco vecino |
| prefijo `m` (`{mO}`, `{mC}`) | `[frase ]**N**` | multiplicidad antepuesta opcional |
| sufijo `e` (`{Oe}`, `{mOe}`) | `**N**[ en `s`]` | estado opcional |
| `{Ly:X}` / `{Lo:X}` | lista con `y/e` / `o/u` | ≥1 elemento (DR-33) |
| `{Q}` / `{Q^}` | `exactamente uno de` / `al menos uno de` | cuantificador (capitalizado al inicio) |
| `{t}` `{t2}` | frase minúscula | etiqueta / inversa (`frase_no_capitalizada`) |
| `{r}` | nombre | ruta (`cadena_etiqueta`) |
| `{v}` | nombre simple o número | valor (`nombre_de_valor`) |
| `{n}` `{u}` | número y unidad es-CL | cota de excepción |
| `{opd}` | `SD`, `SD1.2` | etiqueta de OPD (se resuelve al id, T-167) |
| `{SEC}` | `*A*, paralelo *B* y *C*, y *D*` | secuencia mixta (R-OPL-CX-5) |
| `[…]` | opcional | |

**Cosas y estados**

| id | patrón | |
|---|---|---|
| D1 | `{C} es físico.` · `{C} es física.` según el género de la cosa (DS-26: masculino por defecto, R-OPL-1); se aceptan ambas | G |
| D2 | `{C} es informacional.` | G solo por mención mínima (DS-2) y en display `siempre`; P |
| D3 | `{C} es ambiental.` | G |
| D4 | `{C} es sistémico.` · `{C} es sistémica.` (se aceptan ambas) | P |
| ENT3 | `{C} es un objeto|proceso <esencia>[ y <afiliación>].` · `… es un objeto|proceso <afiliación>.` (R-ENT-3) | P (DECISIONS 20) |
| D11/D12 | `{C} es persistente|transitoria.`: si es coherente, sin cambio; si no, `non-canonical` (DR-3) | P |
| D5 | `{O} puede estar {Lo:s}.` | G |
| D6 | `{O} puede estar <s>, <s>, y otros estados.` | G |
| ATR-E | `{O1} de {O2} puede estar {Lo:s}.` ⇒ D5 + exhibición O2→O1 si falta (DR-20) | P |
| D7 · D8 · D10 · D9 · D13 | `Estado {s} de {O} es inicial.` · `… es final.` · `… es inicial y final.` · `… es por defecto.` · ``… es declarado `Current`.`` | G |
| VAL | `{O1} de {O2} es {v}.` (el exhibidor es el primero por nombre entre los visibles) | G |

**Transformadores y habilitadores** (el prefijo `[Por ruta {r}, ]` va solo en consumo y
resultado, también con sus variantes E/C, T-129)

| id | patrón |
|---|---|
| T1 · TS1 | `{P} consume {mO}.` · `{P} consume {mO} en {s}.` |
| T2 · TS2 | `{P} genera {mO}.` · `{P} genera {mO} en {s}.` |
| T3 | `{P} afecta {mO}.` (P: `{P} afecta {Ly:mO}.` da N hechos) |
| TS3 | `{P} cambia {O} de {e} a {s}.` (entrada = salida: proceso persistente explícito, T-138) |
| TS4 · TS5 | `{P} cambia {O} de {e}.` · `{P} cambia {O} a {s}.` (se parsean siempre como standalone, T-164) |
| H1 · HS1 | `{mO} maneja {P}.` · `{mO} en {s} maneja {P}.` |
| H2 · HS2 | `{P} requiere {mO}.` · `{P} requiere {mO} en {s}.` |

**Evento (`e`)**: ET1 `{mO} inicia {P}, que consume {O}.` · ETS1 `{mO} en {s} inicia {P}, que consume {O}.` ·
ET2 `{mO} inicia {P}, que afecta {O}.` · ETS2 `{O} en {e} inicia {P}, que cambia {O} de {e} a {s}.` ·
ETS3 `{O} en {e} inicia {P}, que cambia {O} de {e}.` · ETS4 `{O} en cualquier estado inicia {P}, que cambia {O} a {s}.` ·
EH1 `{mO} inicia y maneja {P}.` · EHS1 `{mO} en {s} inicia y maneja {P}.` · EH2 `{mO} inicia {P}, que requiere {O}.` ·
EHS2 `{mO} en {s} inicia {P}, que requiere {O} en {s}.`

**Condición (`c`)**: CT1 `{P} ocurre si {O} existe, en cuyo caso {O} se consume, de lo contrario {P} se omite.` ·
CS1 `{P} ocurre si {O} está en {s}, en cuyo caso {O} se consume, de lo contrario {P} se omite.` ·
COND-ALT (P, T-161; nunca se genera, T-113) `Si {O} existe entonces {P} ocurre y consume {O}, de lo contrario se omite {P}.` ·
CT2 `{P} ocurre si {O} existe, en cuyo caso {P} afecta {O}, de lo contrario {P} se omite.` ·
CS2 `{P} ocurre si {O} está en {e}, en cuyo caso {P} cambia {O} de {e} a {s}, de lo contrario {P} se omite.` ·
CS3 `{P} ocurre si {O} está en {e}, en cuyo caso {P} cambia {O} de {e}, de lo contrario {P} se omite.` ·
CS4 `{P} ocurre si {O} existe, en cuyo caso {P} cambia {O} a {s}, de lo contrario {P} se omite.` ·
CH1 `{O} maneja {P} si {O} existe, de lo contrario {P} se omite.` · CS5 `{O} maneja {P} si {O} está en {s}, de lo contrario {P} se omite.` ·
CH2 `{P} ocurre si {O} existe, de lo contrario {P} se omite.` · CS6 `{P} ocurre si {O} está en {s}, de lo contrario {P} se omite.`

**Excepción e invocación**: EX1 `{P1} ocurre si duración de {P2} excede {n} {u}.` · EX1r `… excede su duración máxima.` ·
EX2 `{P1} ocurre si duración de {P2} es menor que {n} {u}.` · EX2r `… es menor que su duración mínima.` ·
IV1 `{P1} invoca {P2}.` (P: `{P1} invoca {Ly:P}.` da N hechos) · IV2 `{P} se invoca a sí mismo.` (sin demora, T-116).
Parsear EX1/EX2 con número fija además `duracion.max|min` de la fuente: la cota viaja por OPL.

**Estructurales** (la misma plantilla sirve para objetos y procesos, R-OPL-RF-1)

| id | patrón |
|---|---|
| RF1 · RF1i | `{C} consta de {Ly:mC}.` · `{C} consta de <partes, con comas> y al menos otra parte.` |
| RF2 · RF2b · RF2i | `{C} exhibe {Ly:C}.` · **`{O} exhibe {Ly:O} así como {Ly:P}.`** (proceso exhibidor: `{P} exhibe {Ly:P} así como {Ly:O}.`; sin coma, DS-17; el parser acepta también `, así como`) · `… y al menos otro rasgo.` |
| RF3 · RF3b · RF3i | `{Ly:C} son {C}.` (≥2) · `{C} es un|una {C}.` · `<esp>, <esp> y al menos otra especialización son {C}.` |
| RH1 | `{C} es un|una {C1} y un|una {C2}.` (≥2 generales; intermedios `, un|una {C}`) |
| RFE | `{Ly:Oe} son {O} en {s}.` (especialización de estado, R-OPL-RF-3, DS-8; admite un elemento) |
| RF4 · RF4b | `{C} es una instancia de {C}.` · `{Ly:C} son instancias de {C}.` |
| SE1 · SE2 | `{mC} {t} {mC}.` · `{mC} se relaciona con {mC}.` |
| SSE1–3 | `{O} en {s} {t} {O}.` · `{O} {t} {O} en {s}.` · `{O} en {a} {t} {O} en {b}.` (sin etiqueta: `se relaciona con`) |
| SE3 · SSE4/5 | dos líneas contiguas: `{mC1} {t} {mC2}.` y `{mC2} {t2} {mC1}.` · `{O1} en {a} {t} {O2}.` y `{O2} {t2} {O1} en {a}.` |
| SE4 · SE5 · SSE6 · SSE7 | `{mC} y {mC} son {t}.` · `{mC} y {mC} se relacionan.` · `{O1} en {a} y {O2} en {b} son {t}.` · `{O2} y {O1} en {a} son {t}.` |

**Abanicos** (reglas §7.3; ramas `{mOe}`: estado y multiplicidad por rama, R-FAN-EST-1)

| familia | convergente | divergente |
|---|---|---|
| consumo | `{P} consume {Q} {Lo:mOe}.` | `{Q^} {Lo:P} consume {mOe}.` |
| resultado | `{Q^} {Lo:P} genera {mOe}.` | `{P} genera {Q} {Lo:mOe}.` |
| efecto | sobre objetos: `{P} afecta {Q} {Lo:mO}.` | sobre procesos: `{O} es afectado por {Q} {Lo:P}.` |
| agente | `{P} es manejado por {Q} {Lo:mOe}.` | `{O} maneja {Q} {Lo:P}.` |
| instrumento | `{P} requiere {Q} {Lo:mOe}.` | `{Q^} {Lo:P} requiere {mOe}.` |
| invocación | `{Q^} {Lo:P} invoca {P}.` | `{P} invoca {Q} {Lo:P}.` |

Casos especiales de abanico:

- **Estados de un mismo objeto** (efecto):
  - FAN5s `{P} cambia {O} a {Q} {Lo:s}.`
  - FAN5e `{P} cambia {O} de {Q} {Lo:s}.`
  - FAN5A `{P} cambia {O} de {e} a {Q} {Lo:s}.` La entrada común no se suprime. Si varían entrada y
    salida a la vez, la generación **falla cerrada** con `abanico-invalido`; en la práctica no
    ocurre, porque la forma F-5 lo impide.
  - El analizador reconstruye un TS3 por salida y un único abanico (R-FAN-5B, T-169).
- **Con control**:
  - FAN4 `{O} inicia {Q} {Lo:P}, y es afectado por el proceso que ocurre.`
  - CFE `{Q^} {Lo:P} ocurre si {O} existe, en cuyo caso afecta {O}, de lo contrario se omite.`
  - C18 `{P} ocurre si {Q} {Lo:O} existe, en cuyo caso {P} consume {Q} {Lo:O}, de lo contrario {P} se omite.`
- **Con ruta en alguna rama** (DS-10, R-COMB-5): no se agrupa; se emite una oración por enlace,
  con su prefijo y sin cuantificador.

**Gestión de contexto**

| id | patrón | |
|---|---|---|
| CX1 | `{P} se descompone en {Ly:P}, en esa secuencia[, así como {Ly:O}].` | G (≥2 bandas de 1) |
| CX2 | `{P} se descompone en paralelo {Ly:P}[, así como {Ly:O}].` | G (1 banda de ≥2) |
| CXM | `{P} se descompone en {SEC}, en esa secuencia[, así como {Ly:O}].` | G (mixta) |
| CXI | `{P} se descompone en {Ly:P}, así como {Ly:O}.` (literal de spec §7.1; se asume secuencia; info) | P |
| CXN | `{P} desde {opd} se descompone en {opd} en {SEC|Ly:P}, en esa secuencia…` | P (DR-24) |
| CX3 | `{C} se despliega en {opd} en {Ly:C}[, así como {Ly:C}].` | G (≥2 refinadores; nunca `en esa secuencia` ni `paralelo`, T-126) |
| CX3s | `{C} se despliega en {Ly:C}.` | P |

`así como` en CX lleva los **objetos internos** (R-OPL-CX-6, PUEDE). Se emite porque el alcance
interno/externo decide la visibilidad (R-VIS-HIJO-1), y sin él el roundtrip no sería estricto.

### 5.4 Generador (`opl/generar.ts`) — CONTRATO

```ts
export function generarBloque(m: Modelo, opd: Id, o?: OpcionesOpl): readonly LineaOpl[];   // sin o ⇒ canónico
export function generarModelo(m: Modelo, o?: OpcionesOpl): readonly LineaOpl[];           // preorden; cabeceras soloDisplay
export function textoCanonico(lineas: readonly LineaOpl[]): string;                         // líneas no display + cabeceras '## '
export function lineaDeEnlace(m: Modelo, opd: Id, candidato: EnlaceNuevo): LineaOpl | null; // vista previa (no muta)
```

Emisión de un bloque, sobre `proyectar(m, opd)`, en este orden (DR-32 ajustado por DS-1):

1. **Refinamiento**: si el OPD es hijo y tiene ≥2 refinadores (R-CX-0, T-127), CX1, CX2 o CXM (con
   `así como` si hay objetos internos), o bien CX3. Clave de línea: `CX:<opd>`.
2. **Cosas visibles** en este orden: el contenedor; los subprocesos por banda (y por nombre dentro
   de la banda); los demás procesos por nombre; los objetos por nombre. Para cada cosa:
   - D1 si es física; D3 si es ambiental;
   - D5, o D6 si tiene ocultos, con los estados **visibles** en el orden del modelo (T-101, T-107);
   - por cada estado visible con designación, D10 o D7/D8, y luego D9 y D13 (T-108);
   - VAL por exhibidor visible.

   Claves de línea: `D1:<cosa>`, `D5:<objeto>`, `D7:<estado>`, `VAL:<atributo>`.
3. **Procedimentales**, agrupados por proceso en el orden de 2.
   - Dentro de cada proceso, por fuerza: consumo, resultado, efecto, agente e instrumento
     (R-COMP-ELEG-3). Luego las invocaciones como invocador y las excepciones como fuente. Dentro
     de cada tipo, por nombre del otro extremo.
   - Un enlace con control emite **solo** su variante E\*/C\*: un hecho, una oración (T-112).
   - Cada abanico emite una oración, en el grupo de su proceso común o, si el común es el objeto,
     en el del primer proceso rama. La excepción es DS-10.
   - La ruta prefija la oración completa (T-129).
   - Clave de línea: `<plantilla>:<enlace>` o `FAN:<abanico>`.
4. **Estructurales**:
   - Si el OPD **no** es hijo de refinamiento, se agrupan por (vértice, relación) (eje b, T-131):
     RF1, RF2/RF2b, RF3 por general, RF4/RF4b por clase, RFE por (general, estado general). Las
     especializaciones con ≥2 generales salen del grupo y van a RH1. La incompleta, declarada o de
     vista, agrega la cola.
   - Si es hijo, se emite una oración por enlace (T-132).

   Luego vienen los etiquetados, por origen y destino: SE1/SE2/SSE, SE3 (dos líneas contiguas,
   `SE3a:`/`SE3b:`) y SE4/SE5/SSE6/7. Clave: `<plantilla>:<refinable>:<relación>` agrupada, o
   `<plantilla>:<enlace>`.
5. **Mención mínima** (DS-2): toda cosa visible que no apareció en 1–4 recibe D2 al final de la
   sección 2 (`D2:<cosa>`).
6. **Empates**: nombre (colación `es`, sensibilidad base) y luego id.

**Tokens y refs** (T-135): cada hueco produce un token con `ref`. Si el hueco pertenece a un
enlace, lleva también `hecho` = id del enlace: en abanicos, el de la rama; en listas estructurales,
el de cada elemento (T-245). En las líneas abstraídas del padre, `hechos` lista todos los
subyacentes. No hay fusión opaca.

**Plegado y display** (R-OPL-DISP-3/4, R-OPL-CFG-1/2, T-139):

- El bloque de un OPD ascendente se genera sobre la vista abstraída, así que los hechos refinados
  salen plegados.
- `esencia: 'siempre'` (default del panel) agrega D2 como `soloDisplay` a toda cosa informacional.
  `'oculta'` retira D1 y D2 del display.
- El texto **canónico**, el que se exporta, se edita y se parsea, es siempre `solo-difiere` más la
  mención mínima.
- La numeración es solo de display (T-246).

### 5.5 Analizador (`opl/analizar.ts`)

1. **Normalización** (R-§18-NORM-1, T-152):
   - NFC. Tabulaciones y espacios no separables pasan a espacio, y los espacios se colapsan.
   - Se quitan viñetas y numeración iniciales (`- `, `• `, `1.`, `1)`).
   - Fuera de los spans, las comillas tipográficas pasan a ASCII, y `≤ ≥ ≠ ∈` también; esto solo
     afecta a formas no soportadas. Acentos, ñ y ü se preservan.
   - Una línea vacía da `vacia`; una sin punto final, `syntax-error` «puntuación».
   - `#…` es cabecera (`## SD1 …` ⇒ `cabecera: 'SD1'`).
2. **Spans**: `**…**` es O, `*…*` es P y `` `…` `` es E. El léxico impide `*` y `` ` `` dentro de
   los nombres, así que el análisis es inequívoco. `*Nombre proceso*` y `*Nombre* proceso` aceptan
   el sufijo ` proceso` (R-OPL-9, T-163).
3. **Plegado de tokens**:
   - una frase de multiplicidad justo antes de O o C es un atributo del token (`al menos una
     **Olla**` ⇒ `O[+]`, género `f`);
   - ` en ` más E tras O da `Oe`, y ` en cualquier estado`, `cualquierEstado`;
   - las secuencias del mismo tipo separadas por `, ` y cerradas por ` y | e | o | u ` dan una
     lista, donde `y`≡`e` y `o`≡`u`;
   - las colas `y al menos otra parte|otro rasgo|otra especialización` y `, y otros estados` marcan
     la lista.
4. **Esqueleto**: la línea se reduce a `⟨P⟩ consume ⟨O⟩.` y se busca en el mapa esqueleto →
   plantillas, compilado desde `PLANTILLAS` (primer literal sin distinguir mayúsculas). Varias
   candidatas se prueban de la más a la menos específica; `restricciones` desempata. CXM y `{SEC}`
   usan el subanalizador de secuencia mixta (porte de `parsearBandasOrden`: resuelve el doble rol
   de `y`).
5. **Residual SE1** (DR-36, T-170): `⟨mC⟩ <frase_no_capitalizada> ⟨mC⟩.`, con ambos extremos del
   mismo tipo tipográfico y sin otro esqueleto, da SE1 con esa etiqueta.
6. **No soportadas y no canonizadas** (`opl/no-soportadas.ts`, cada fila con `regla` y `registro`).
   Se reconocen **antes** de fallar y se responden sin mutar:
   - **`NO_SOPORTADAS`** dan `unsupported-canonical` (warning, T-156): RX1/RX2 `puede ser`;
     plurales por multiplicidad (`consumen`, `generan`, `afectan`, `requieren`, `manejan`,
     `invocan`, DR-12); CX4 `se refina por`; CX5/6 `se pliega en`; CX7/8 `se recompone desde`;
     CM1–CM3; EX combinada; `después de`; negadas (`no maneja`, `no requiere`, `no consume`, `no
     genera`, `no afecta`, `no cambia`); `Pr=` dentro de abanico; participación fuera de `? * +`
     (`exactamente un`, `al menos dos`, `dos o más`, números, `m a n`); `es de tipo`; `varía de`;
     `donde`; RF2o `tiene un … opcional`; sufijo `[etiqueta: …]`; ruta en agente, instrumento,
     efecto o invocación (DR-19); despliegue dedicado `se despliega por partes|especialización|
     instanciación|rasgos en`; `**O** se descompone en` (DR-23); `ordenados por` (R-OPL-SE-4);
     oración compuesta (`consume **A** y genera **B**`, sujetos coordinados). También dan
     `unsupported-canonical` los hechos cuyo candidato cae en `NO_OFRECIDO`.
   - **`NO_CANONIZADAS`** dan `non-canonical` (error, T-157): abanico con control mixto
     (R-ZNC-COMB-1); D11/D12 incoherentes (DR-3); condición con estado sobre un efecto sin cambio
     (DR-29); `puede ser` con estados (R-VERB-EST-2); `c` y `e` en un mismo hecho (AP-28); `inicia
     e invoca`, `puede generarse` e `invoca … si … ocurre` (R-MOD-INPUT-2); `Pr=` **fuera** de
     abanico.
   - Todo lo demás da `syntax-error` (T-160: nunca un grafo plausible).

### 5.6 Planificador y aplicación (`opl/planificar.ts`, `opl/aplicar.ts`)

`planificar(m, alcance, texto)` es **puro** (T-173). Pasos:

1. **Bloques**. Con alcance `opd`, todas las líneas pertenecen a ese OPD. Con `'modelo'`, cada
   línea pertenece al OPD del último `## SDx…`, resuelto con `etiquetaOpd` o creado en la pasada A
   de §5.7 (T-167).
2. **Resolución de nombres** con `claveNombre` (DS-14), sobre el modelo más las creaciones
   pendientes del mismo plan:
   - una cosa nueva mencionada en varias líneas se crea una sola vez, con el tipo de su tipografía
     (T-153); `una`/`al menos una` fija `genero: 'f'`;
   - una tipografía que contradice a una cosa existente da `type-mismatch`, razón
     `enlace-invalido-firma`, con el detalle «**Pedido** es un objeto; aquí figura como proceso» y
     las acciones «Renombrar la existente» y «Usar otro nombre» (T-158);
   - una clave con ≥2 cosas (duplicado importado) da `ambiguous-symbol` / `referencia-ambigua`;
   - una etiqueta `SDx.y` inexistente da `unknown-symbol` / `entidad-no-existe`;
   - un estado inexistente de un objeto identificado se crea (T-154, T-165).
3. **Comparación con la vista** `proyectar(m′, opd)`, sobre el modelo de ensayo:
   - si el hecho ya está en la vista, incluidas las líneas abstraídas (T-168), es `sin-cambio`;
   - si el hecho existe en el modelo pero falta la aparición de alguna cosa en el OPD, da
     `traer-entidad`;
   - si el hecho no existe, da los patches de creación.

   La **identidad de enlace** para la idempotencia (T-182) es (tipo, extremos, estados). En
   etiquetados incluye también la etiqueta. El mismo hecho con otro control, multiplicidad o ruta da
   `ajustar-enlace`.
4. **SE3** (DS-13): dos SE1 del mismo bloque con extremos invertidos se combinan en un
   bidireccional (o en un recíproco si las etiquetas son iguales). El patch cuelga de la primera
   línea, y la segunda es `aplicable` con el detalle «par de la línea n».
5. **Ensayo por fases**:
   - Se simulan, sobre una copia, las acciones de fase 1 de todas las líneas en orden de texto (con
     alcance `'modelo'`, los bloques en preorden).
   - Luego las de fase 2. Con alcance `'modelo'` van por bloques en **profundidad descendente**:
     así una línea abstraída del padre encuentra el hecho refinado ya creado y resulta idempotente.
   - Luego las de fase 3.
   - Cada acción se valida con el núcleo sobre el modelo del ensayo; así los ids quedan asignados y
     se validan contra la matriz (§4.3.4).
   - Si un patch de una línea falla, la línea pasa a `no-aplicable` con la razón que corresponde, y
     el ensayo **se repite sin ella**, hasta que se estabilice (a lo sumo tantas vueltas como líneas
     fallidas). Así «Aplicar N cambios» aplica exactamente lo que el ensayo probó (partial-parse,
     T-179).
6. **Conflictos**: dos líneas con patches de la misma `clave` y distinto contenido pasan ambas a
   `no-aplicable` con `conflicto-patches` (T-178).
7. **Ausencias**: si el texto tiene menos hechos que la vista del alcance, se agrega una sola nota
   `no-delete-by-absence` (info, T-172). Reordenar líneas no cambia nada (T-171). Editar una
   oración de lista solo produce patches para los sub-spans que cambiaron (T-184).

La clasificación por línea sigue la precedencia `ignorada-vacia → aplicable → no-aplicable →
sin-cambio` (R-OPL-EDIT-1). La canaleta muestra un texto por estado:

- `aplicable`: la `descripcion` del primer patch;
- `no-aplicable`: `TEXTO_RAZON[razon]`;
- `sin-cambio`: «ya está en el modelo» (`cambio-ya-presente`) o el warning
  (`unsupported-canonical`: «forma canónica no disponible en esta versión; no se aplica»,
  `inversa-no-soportada`).

Mapeo de código a razón:

| código | razón |
|---|---|
| `syntax-error` | `forma-no-reconocida`, o `puntuacion-faltante` si falta el punto |
| `unknown-symbol` | `entidad-no-existe` |
| `ambiguous-symbol` | `referencia-ambigua` |
| `type-mismatch` | `enlace-invalido-firma` |
| `patch-conflict` | `conflicto-patches` |
| `non-canonical` | `forma-no-reconocida`, con el mensaje «no canonizado» |
| `unsupported-canonical`, `no-delete-by-absence` | no bloquean; se muestran como `inversa-no-soportada` |

`aplicarPlan(m, plan)` exige `m === plan.base`. Ejecuta `aplicarAcciones(m, plan.acciones)`: la
misma secuencia del ensayo, en fases, sobre las mismas operaciones que usa el lienzo (T-011,
R-OPL-EDIT-8), fail-fast y todo-o-nada (T-180, DR-39). Si tiene éxito, es un solo paso de deshacer.
`aplicarPlan(m, planificar(m, o, ''))` devuelve `m` idéntico (T-196).

### 5.7 OPL del modelo completo (`opl/documento.ts`)

```ts
export function generarDocumentoOpl(m: Modelo): string;     // '# <modelo>' + bloques '## SD1 · descomposición de *P* · en SD'
export function importarOpl(nombre: string, texto: string): Respuesta<{ modelo: Modelo; plan: Plan }>;
```

- **Generar**: los bloques van en preorden. Cada uno abre con la cabecera display, que declara el
  OPD y su padre (DR-24, R-OPL-PANEL-2). Es el export «OPL Markdown» (T-282) y la sección OPL de
  `canon-documento`.
- **Parsear sobre modelo vacío** (importar OPL, fixture estricto): `planificar(crearModelo(…),
  'modelo', texto)` y luego `aplicarPlan`. Tiene dos pasadas:
  - **Pasada A** (fase 1, preorden de bloques):
    - En cada bloque se crean las cosas mencionadas **por primera vez**, con aparición en su OPD.
    - En un bloque de descomposición, los objetos de `así como` son internos, los procesos del CX
      son subprocesos y el resto son externos.
    - Se aplican las oraciones de refinamiento: el OPD hijo se crea con la etiqueta de su cabecera,
      y la etiqueta resultante debe coincidir.
    - Se aplican las oraciones de cosa: esencia, afiliación, estados, designaciones, valor.
  - **Pasada B** (fases 2 y 3, profundidad descendente): se aplica el resto contra la proyección de
    cada OPD.

### 5.8 Editor OPL (`ui/EditorOpl.tsx` sobre `planificar`)

- **Abrir** con «Editar» o `Ctrl+E`. El bloque canónico del OPD activo aparece en un `textarea` sin
  ajuste de línea, con una canaleta alineada por línea: `·` ignorada, `=` sin cambio, `+`
  aplicable, `✕` no aplicable con la razón.
- Cada 150 ms tras teclear corre `planificar(modelo, opd, texto)`.
- **Resumen** (R-OPL-EDIT-2, T-175): `N líneas · A aplicables · X no aplicables · I ignoradas · S
  sin cambio`, más el botón `Aplicar A cambio(s)` (`Ctrl+Enter`) o `Sin cambios aplicables`
  (deshabilitado). `Ctrl+↓/↑` salta a la siguiente o anterior no aplicable.
- **Aplicar**, todo-o-nada:
  - si falla, se ven la línea y la razón y el modelo queda intacto;
  - si funciona, el texto se regenera canónico, el editor sigue abierto y reabrirlo sin tocar
    muestra «Sin cambios aplicables»;
  - si el modelo cambió desde el plan (otro gesto), se replanifica antes de aplicar.
- `Esc` cierra sin aplicar.
- **Edición en token** fuera del editor (R-OPL-EDIT-7, T-183). Siempre valida el id antes de mutar.
  Con doble clic en el panel:
  - sobre un nombre de cosa, `renombrarCosa`;
  - sobre un estado, `renombrarEstado`;
  - sobre la etiqueta de un enlace, `fijarEtiqueta`;
  - sobre cualquier otro token de un enlace, selecciona el enlace y abre Propiedades.

### 5.9 Cómo se garantiza `parsear(generar(m))` y el fixture estricto R-§19-SIM-3

1. **Por construcción** (P4): generar y reconocer usan el mismo `patron`. `plantillas.test.ts`
   exige, por cada plantilla G, que `hacia(desde(h))` sea la identidad sobre el hecho, en todas sus
   opciones: con y sin estado; multiplicidad `?`, `*` y `+`; género m y f; `y`/`e` y `o`/`u`; listas
   de 1 a 4.
2. **Por enumeración** (`roundtrip-matriz.test.ts`).
   - Un enumerador recorre `MATRIZ`. Para cada tipo construye el modelo mínimo: objetos `Alfa` y
     `Ilustre` con estados `uno`, `dos` y `tres`, y procesos `Beta` y `Omega`.
   - Recorre todas las variantes legales de sus dimensiones:
     - estados en cada extremo admitido;
     - control ∈ {∅, e, c}, multiplicidad ∈ {∅, ?, *, +}, ruta ∈ {∅, `Uno`};
     - género ∈ {m, f}, esencia y afiliación.

     Descarta las que la forma, el contexto o `noOfrecido` rechazan.
   - Para abanicos recorre cada familia × {XOR, OR} × {convergente, divergente} × {con o sin estado
     por rama} × los controles admitidos × {sin ruta, con ruta en una rama}.
   - Para refinamiento recorre CX1, CX2 y CXM con internos, y CX3 por modo.
   - En cada caso exige tres cosas:
     1. `generar` produce solo plantillas de la tabla;
     2. el auto-reparseo sobre el mismo modelo da 0 patches y 0 errores (R-§19-SIM-1, T-191);
     3. es estricto: `generar(m) === generar(aplicarPlan(v, planificar(v, 'modelo', generarDocumentoOpl(m))).valor.modelo)`, con `v = crearModelo(…)`,
        línea a línea (R-§19-SIM-3, T-192), salvo en los casos marcados como bisimetría parcial.
   - Son unos 700 casos y el tope es de 3 s; la prueba falla si se excede.
3. **Aleatorio con semilla** (`roundtrip-azar.test.ts`): 200 modelos de `pruebas/azar.ts`, con
   perfil `estricto` (sin construcciones de bisimetría parcial: exige 1, 2 y 3) y perfil `completo`
   (exige 1 y 2).
4. **Tabla 9.2 nominal** (`roundtrip-tabla92.test.ts`): una prueba con nombre por fila, con el T-ID
   en el título (T-301).
5. **Modelos reales** (`roundtrip-modelos.test.ts`): los 6 de `app/fixtures/v0` importados y el
   sintético grande. Exige auto-reparseo por OPD con 0 cambios (UX-01 no puede volver) y el estricto
   sobre el documento completo para los que pasan los gates.
6. **Composición** (T-194): `analizar(componer(F))` da el mismo conjunto de hechos para toda
   oración de lista (RF1, RF2, RF3, RF4b, RFE, D5, CX, abanicos). F se genera al azar.
7. **Leyes de lente segura** (T-302, `lente.test.ts`):
   - la ausencia no borra;
   - la vista previa no muta (identidad de objeto del modelo);
   - `unsupported-canonical` no muta;
   - `exportarV0(aplicarPlan(m, planificar(m, o, '')).valor.modelo) === exportarV0(m)`.

**Bisimetrías parciales declaradas** (R-§19-ROT-1, T-193). Cada una tiene su fixture marcado «no
estricto» y su fila en la tabla 3 de `docs/conformidad.md`:

1. La procedencia de escisión: el texto no distingue un TS4/TS5 escindido de uno standalone. Se
   conserva en el JSON y al reparsear sobre el modelo existente (T-159).
2. El borrado: el OPL es aditivo.
3. Posiciones y tamaños.
4. Estados ocultos en **todos** los OPDs, por supresión global o local en todos: D6 no los nombra.
   La supresión local, en cambio, sí se reconstruye (`sincronizar-estados` con `otros`).
5. Duración de proceso sin una excepción que la cite: no hay plantilla (zona laxa, B-20).
6. `descripcion`, y `genero` cuando ninguna oración muestra `un/una`.
7. Refinamientos triviales (<2): sin oración CX (R-CX-0), no se reconstruyen desde el texto.
8. El operador de un abanico con ruta (DS-10).
9. Dos etiquetados opuestos con etiquetas distintas se reconstruyen como un bidireccional (DS-13).
10. Cosas sin aparición y enlaces sin vista: no pertenecen a ningún bloque (DS-6).

---

## 6. OPD

### 6.1 Escena pura (`opd/escena.ts`) — CONTRATO

`escena(m, opd)` es función pura de `proyectar(m, opd)` y de las métricas de texto. Decide **toda**
la geometría: el lienzo y el export dibujan la misma escena, sin pasadas posteriores sobre un grafo
vivo.

```ts
export interface Punto { readonly x: number; readonly y: number }
export interface Rect { readonly x: number; readonly y: number; readonly ancho: number; readonly alto: number }
export type Marcador = 'punta' | 'piruletaNegra' | 'piruletaBlanca' | 'abierta' | 'arpon' | 'arponInverso';
export interface Escena {
  readonly opd: Id; readonly caja: Rect;                   // unión de todo lo dibujado (sombras +8, arcos, rótulos)
  readonly nodos: readonly NodoCosa[]; readonly simbolos: readonly Simbolo[];
  readonly aristas: readonly Arista[]; readonly arcos: readonly Arco[];
}
export interface NodoCosa {
  readonly ref: Ref; readonly tipo: TipoCosa; readonly caja: Rect;
  readonly contenedor: boolean; readonly grueso: boolean;  // grueso ⇔ la cosa tiene descomposición o despliegue (T-202)
  readonly ambiental: boolean; readonly fisica: boolean;   // dash 8 4 / sombra (T-200, T-201)
  readonly rotulo: { readonly lineas: readonly string[]; readonly x: number; readonly y: number; readonly italica: boolean };
  readonly estados: readonly NodoEstado[];
  readonly chipOcultos?: { readonly n: number; readonly caja: Rect };   // ⋯N (T-208)
  readonly duracion?: string;                              // «[min] {1, 3, 5}» (T-220)
  readonly rotuloInstancia?: string;                       // «Nombre : Clase» (T-222)
}
export interface NodoEstado {
  readonly ref: Ref; readonly caja: Rect; readonly nombre: string;
  readonly inicial: boolean; readonly final: boolean; readonly porDefecto: boolean; readonly current: boolean;
}
export interface Simbolo {                                 // triángulo estructural + peine
  readonly clave: string;                                  // 'simbolo:<refinable>:<relacion>' (data-ref)
  readonly refinable: Id; readonly relacion: ModoDespliegue;
  readonly vertice: Punto; readonly orientacion: 'abajo' | 'arriba' | 'derecha' | 'izquierda';
  readonly incompleta: boolean; readonly ramas: readonly Id[];          // enlaces
  readonly peine: readonly (readonly Punto[])[];                        // tramo común + bajadas (ortogonales)
  readonly mult: readonly { readonly texto: string; readonly en: Punto }[];
}
export interface Tramo { readonly puntos: readonly Punto[]; readonly inicio?: Marcador; readonly fin?: Marcador }
export interface Arista {
  readonly ref: Ref; readonly hechos: readonly Id[];
  readonly tramos: readonly Tramo[];                       // TS3: 2 tramos (entrada→P, P→salida)
  readonly rayo: boolean;                                  // invocación
  readonly marcas: readonly { readonly texto: 'e' | 'c' | '/' | '//'; readonly en: Punto; readonly angulo: number }[];
  readonly etiquetas: readonly { readonly texto: string; readonly en: Punto; readonly italica: boolean;
                                 readonly clave: 'etiqueta' | 'inversa' | 'ruta' | 'mult-origen' | 'mult-destino' }[];
  readonly capa: 4 | 20;                                   // 20 = anclada a estado
}
export interface Arco { readonly abanico: Id; readonly centro: Punto; readonly radio: number; readonly desde: number; readonly hasta: number; readonly doble: boolean }
export function escena(m: Modelo, opd: Id): Escena;       // memo por (modelo, opd)
```

### 6.2 Dibujo único, dos adaptadores (`opd/dibujo.ts`, DS-23)

```ts
export interface NodoSvg {
  readonly t: string;                                      // 'g' | 'path' | 'rect' | 'ellipse' | 'text' | 'polygon' | 'circle' | …
  readonly a: Readonly<Record<string, string | number>>;   // atributos SVG (kebab-case)
  readonly h?: readonly (NodoSvg | string)[];
  readonly k?: string;                                     // clave estable (= data-ref en 'edicion')
}
export function dibujar(e: Escena, modo: 'canon' | 'edicion'): NodoSvg;   // <g> raíz con <defs> (sombra) incluidas
export function aTexto(n: NodoSvg): string;               // serializador con escape XML (30 líneas)
```

El orden de capas es: contenedor (0) → aristas (4) → arcos (5) → cosas y estados (10) → triángulos
y peines (12) → aristas a estados (20). Los modos se distinguen así:

- En `edicion`, cada elemento semántico lleva `data-ref` (`cosa:o-3`, `estado:s-2`, `enlace:e-7`,
  `abanico:f-1`, `simbolo:o-3:agregacion`) y un envoltorio transparente de 15 px para el clic en
  aristas (§18.2).
- En `canon` no hay atributos de interacción y los rótulos van en `#000` (T-203).
- `ui/SvgPreact.tsx` convierte el árbol en vnodes con `h(t, {...a, key: k}, hijos)` (≈30 líneas).
  Preact conserva la identidad de cada nodo entre cuadros de arrastre, lo que sostiene el hover y la
  captura de puntero.
- `ui/CapaUi.tsx` es **otro** `<g>` encima o debajo: selección, asas, anclas de conexión,
  fantasmas, guías de banda y realce `paperWarm`. Jamás entra al export (R-OPD-CAN-3, T-227). Las
  guías de banda (únicas guías del producto) son de trazo continuo crimson y nunca reutilizan el dash
  `8 4` de afiliación (R-OPD-LAY-3). **No hay grilla ni snap**: son decoración opcional (R-OPD-UI-6
  PUEDE) que el canon no exige, y sin ellas T-229 se cumple por ausencia (CC-04).

### 6.3 Geometría (`opd/geometria.ts`)

- **Recorte exacto** (R-OPD-LAY-5, T-224). El segmento va de centro a centro y se recorta en el
  perímetro real. Nunca hay extremos sueltos.
  - En el rectángulo, `s = min(w/2/|dx|, h/2/|dy|)`, y el punto es `c + s·d`.
  - En la elipse, `s = 1/√((dx/rx)² + (dy/ry)²)`.
  - En el estado, el recorte se hace sobre el rectángulo de la cápsula, con el arco de radio 8 en
    las esquinas.
- **Procedimentales**, rectos (R-OPD-LAY-4, T-225):
  - Consumo: punta en el proceso. Resultado: punta en el objeto o el estado.
  - Efecto T3: punta en ambos extremos.
  - TS3: dos tramos, `estado_entrada → proceso` (punta en el proceso) y `proceso → estado_salida`
    (punta en el estado).
  - TS4: `estado → proceso`. TS5: `proceso → estado` (R-OPD-TR-6, T-209).
  - Agente e instrumento: piruleta negra o blanca en el extremo proceso, colgando de la línea
    (T-210).
- **Invocación** (T-211). Es la polilínea `A, M1, M2, B`, con:
  - `M1 = lerp(A,B,0.46) + n·k` y `M2 = lerp(A,B,0.54) − n·k`;
  - `k = min(22, max(12, |AB|·0.08))`;
  - la punta cerrada en el invocado.

  El rayo es una decoración derivada de la recta.
- **Autoinvocación**. Es un lazo bajo el proceso:
  - sale de los puntos del borde a ±35° de la vertical inferior;
  - llega a un pico a `max(56, alto·0.55)` bajo el borde, con el quiebre del rayo en el pico;
  - termina con la punta en el retorno (porte de `autoinvocacionLoop`).
- **Excepción**: una recta sin punta, con `/` (una barra corta inclinada) o `//` (dos barras
  paralelas) a 22 px del manejador (DR-38, T-215).
- **Estructurales fundamentales**. Se dibujan como un peine ortogonal por grupo (refinable,
  relación) (T-212, T-225):
  - La orientación es el eje dominante del vector refinable→centroide de refinadores.
  - El vértice del triángulo (30×30) va a 24 px del borde del refinable, unido por un tramo recto.
  - La barra común va a 16 px de la base, y de ella bajan tramos ortogonales al centro de cada
    refinador, recortados en su borde.
  - Los refinadores se ordenan por su coordenada transversal, así el peine no cruza sus propias
    ramas.
  - La colección incompleta se marca con una barra corta de 14 px entre la base y la barra común
    (T-217).
  - La multiplicidad de la parte va junto al extremo del refinador.
- **Etiquetados**, rectos (T-213):
  - El unidireccional lleva punta abierta en el destino; el bidireccional y el recíproco, arpón en
    ambos extremos (media punta, en lados opuestos).
  - La etiqueta va en itálica sobre el eje: al centro en el unidireccional y el recíproco. En el
    bidireccional, la etiqueta va a 1/3 desde el origen y la inversa a 1/3 desde el destino, en
    lados opuestos.
  - La multiplicidad se marca en ambos extremos (T-218).
- **Abanicos** (T-216, DR-9). Todas las ramas terminan en un **punto de acople** del extremo común:
  el recorte del borde del extremo común hacia el centroide de los otros extremos.
  - El arco se centra en el acople, con radio 30, y cubre el sector angular mínimo que contiene
    todas las ramas (porte de `calcularGeometriaAbanicoDesdePuntos` + mayor hueco angular).
  - XOR es un arco; OR, dos concéntricos (r 30 y 35); dash `4 1`, trazo 1.5.
  - AND es la ausencia de arco.
- **Marcas de control** (T-214): `e` o `c` en minúscula dentro de un círculo de 18 px (fondo papel,
  borde tinta), sobre la línea a 28 px del borde del proceso.
- **Ruta y multiplicidad** (T-218, T-219):
  - La ruta va en serif 11 a mitad del segmento, desplazada 10 px a la izquierda del sentido
    objeto→proceso.
  - La multiplicidad va a 14 px del extremo objeto y a 10 px en perpendicular.
- **Estados dentro del objeto** (T-206):
  - Van en filas en la región inferior, con separación 8. La cápsula mide 26 de alto y
    `texto(itálica 13) + 16` de ancho (+6 si es inicial). El objeto crece para contenerlas, nunca al
    revés.
  - Inicial: trazo 3. Final: doble contorno (rectángulo interior a 3 px, trazo 1). Inicial y final
    llevan ambos.
  - **Por defecto**: flecha diagonal abierta **entrante**, desde arriba a la izquierda hacia la
    esquina de la cápsula (no `↗`, DR-37).
  - **Current** declarado: pin externo (círculo r 3.5 con pie) sobre la esquina superior derecha,
    fuera de la cápsula (DR-37, T-207).
- **Chip `⋯N`** (T-208): una cápsula de alto 16 en la esquina inferior derecha del objeto, con los
  estados ocultos. Persiste en `canon-diagrama` (DR-15).
- **Rótulo** (T-204): serif 17 (itálica en procesos), envuelto por palabras a ~132 px, sin elipsis.
  La forma se agranda: ancho = máx(declarado, rótulo + 28, fila de estados + 16), y el alto
  análogamente. En la elipse, el rectángulo de texto se inscribe (semiejes = medio contenido × √2 +
  8).
- **Duración** (T-220): va bajo el nombre dentro de la elipse, como `[min] {1, 3, 5}` en serif 11.
  Los valores ausentes se muestran como `–`. Sin duración no se dibuja nada.
- **Instancia lógica** (T-222): el rótulo es `Nombre : Clase` si el objeto es instancia por
  clasificación (la clase es la primera por nombre).
- **Contenedor** (T-221): la cosa refinada, en su OPD de descomposición, se dibuja agrandada, con el
  rótulo arriba por dentro y los subprocesos en filas por banda (misma banda, misma altura).
- **Cruces** (para advertencias): intersección segmento–segmento y segmento–rectángulo o elipse, en
  `advertenciasEscena` (§6.8).

### 6.4 Marcadores (`opd/marcadores.ts`, paths literales de spec-OPD §18.3)

| id | geometría (marco local, eje +x hacia el extremo) | relleno |
|---|---|---|
| `punta` | `M 0 0 L 23 8 L 12 0 L 23 -8 Z` (swallowtail 23×16) | papel, trazo tinta 1 |
| `piruletaNegra` / `piruletaBlanca` | `M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0` | tinta / papel |
| `abierta` | polilínea `0,0 20,-10 0,0 20,10` | sin relleno |
| `arpon` / `arponInverso` | polilínea `0.5,0 20,10` / `0.5,0 20,-10` | sin relleno |
| `sobretiempo` / `subtiempo` | `4,10 13,-10` / `4,10 13,-10 8.5,0 17,0 13,10 22,-10` | trazo tinta |
| triángulo | polígono `15,0 30,30 0,30`; agregación relleno tinta; generalización papel; exhibición papel + triángulo interior `15,12 21,24 9,24` tinta; clasificación papel + círculo r4 tinta en (15,20) | según relación |

Los marcadores se dibujan como `<path>` transformados, no como `<marker>`, para que el export se
vea igual en cualquier visor. `marcadores.test.ts` compara estas cadenas byte a byte con las del
canon vendorizado, y verifica la topología en el SVG exportado: conteo de arcos, relleno o vacío,
interior, punta cerrada, abierta o arpón, dash (T-212, T-304).

### 6.5 Tokens visuales, métricas y fuente

Tokens (`opd/tokens.ts`, spec-OPD §18; son informativos salvo la estructura):

- Colores: `paper #fafaf8`, `paperWarm #eeece2` (realce bimodal entrante), `ink #171511`,
  `inkMid #5a564c`, `inkSoft #807b6e`, `opmObjeto #27613f`, `opmProceso #1d3f78`,
  `opmEstado #68711f`, `estadoFill #dedacb` y `estadoFinalFill #d6d2c6`.
- `crimson #8e2a2e` es **solo UI**: selección, foco, asas y guías. Está prohibido como marca
  semántica (AP-24).
- Trazos: cosa 1.5, estado 1.2, enlace 1, estructural 1.2, inicial 3, refinada 4 y arco 1.5. El
  dash ambiental es `8 4`.
- Sombra física: `feDropShadow dx 6 dy 6 stdDeviation 1 flood rgba(23,21,17,.68)`, solo si es física
  (T-201).
- La semántica no depende del color (T-203): la prueba renderiza en escala de grises y las
  distinciones se mantienen.
- Las cosas de igual clase comparten base cromática y tipográfica (T-205).

Métricas (`opd/metricas.ts`, generado):

- Guarda la tabla de avances de Inria Serif regular e itálica a 1000 unidades, para Latin-1, las
  vocales acentuadas, `ñ` y `ü`, más un avance de reserva para cualquier otro carácter.
- Expone `anchoTexto(texto, px, italica)` y `envolver(texto, maxPx, px, italica)`.
- `herramientas/medir-fuente.ts` lo genera en Chromium: carga los woff2 de `@fontsource` y mide cada
  glifo con `measureText`.
- El resultado es idéntico en el navegador, en Bun y en el export, sin medir en el DOM. El e2e 5 lo
  contrasta con `getBBox()` (tolerancia 2 %).

Fuente (`opd/fuente.ts`, generado por la misma herramienta; DS-21): `INRIA_REGULAR_WOFF2` e
`INRIA_ITALICA_WOFF2`, en base64 del subconjunto latino. Solo la importa `opd/exportar.ts`, para
incrustarla.

### 6.6 Colocación (`nucleo/colocacion.ts`) y cámara

La colocación vive en el núcleo (DS-25). Es una función determinista de las cajas guardadas;
ninguna coordenada decide un hecho (P6).

- **`colocar(m, opd, tamaño, punto?)`**:
  - Busca en espiral el hueco libre más cercano a `punto` (el cursor, o el centro de la vista si se
    creó por teclado), con paso 20 px, margen 24 px y a lo sumo 400 intentos.
  - Nunca solapa cajas guardadas (R-OPD-LAY-1). La primera cosa de un OPD vacío va al origen.
  - Para cosas creadas desde OPL, el objeto va 120 px sobre su primer proceso relacionado, el
    resultado a la derecha y la parte bajo su todo (R-OPD-LAY-9, T-226). Si no hay relación, va al
    centro del bbox.
- **Tamaño inicial** 135×60. La escena dibuja `máx(guardado, necesario)`. Si el crecimiento produce
  un solape, lo informa la advertencia de export: nunca se re-rutea en silencio.
- **Descomposición**:
  - El ancho de una fila es la suma de los anchos guardados de sus cosas más 40 px entre cosas.
    Contenedor: ancho `máx(420, banda más ancha + 80, fila de objetos internos + 80)`.
  - Cada banda k reserva `paso(k) = máx(100, alto guardado máximo de la banda k + 40)`.
    Va en `y = contenedor.y + 64 + suma(pasos anteriores)`, con sus subprocesos centrados a
    40 px entre sí. Los tamaños guardados se conservan.
  - Los objetos internos van en una fila inferior dentro del contenedor, en
    `y = contenedor.y + 64 + suma(pasos de todas las bandas)`. Si existe esa fila, reserva
    `máx(100, alto guardado máximo de los objetos internos + 40)`; si no, reserva 0.
  - Alto del contenedor: `64 + suma(pasos de las bandas) + reserva de internos + 24`.
    Para filas de alto 60 los pasos siguen siendo 100; el ancho cambia cuando la fila de
    internos necesita más espacio que el contenedor calculado por las bandas.
  - Externos (R-HIJO-3, R-OPD-LAY-9):
    - entradas (objeto de consumo, efecto de entrada, evento) en una columna a la izquierda;
    - salidas (resultado) a la derecha;
    - habilitadores en una fila arriba y estructurales abajo;
    - procesos (invocación, excepción) a la derecha, bajo las salidas.

    En cada grupo, por nombre.
  - Al cambiar las bandas se recalculan solo la `y` de los internos y el alto del contenedor,
    usando estos mismos pasos y reserva. Mover el contenedor mueve a sus internos.
- **Despliegue**: la cosa arriba al centro; los refinadores en fila 180 px debajo, centrados, por
  nombre.
- **Sin auto-layout global**: el canon no lo exige, y así desaparece el riesgo de que cambie hechos.
- **Cámara** (DS-22, T-231):
  - Al **entrar a cualquier OPD**, por árbol, ruta, clic en un token, Atrás, deshacer o búsqueda, se
    encuadra el bbox real: zoom 1 centrado si cabe; si no, se ajusta.
  - Crear, renombrar, mover o aplicar OPL no mueven la cámara, salvo el desplazamiento mínimo para
    mostrar una cosa creada fuera de vista.
  - `Ctrl+0` re-encuadra.

### 6.7 Modos del lienzo (T-230)

| modo | cuándo | efecto |
|---|---|---|
| `edicion` | normal | capa UI y gestos activos |
| `navegacion` | conflicto de guardado sin resolver o sesión vencida | solo lectura: asas ocultas, gestos de mutación inertes, navegación y selección activas; lo anuncia la franja |
| `gestion-modal` | un diálogo o menú abierto | capa UI oculta, lienzo atenuado, sin gestos |
| `estatico` | `F9` (conmutador) | el lienzo dibuja exactamente `dibujar(escena, 'canon')`, sin capa UI: es lo que se exporta (R-OPD-CAN-5) |
| `runtime` | — | **vacío declarado**: no hay simulación (Brechas B-21) |

### 6.8 Export canónico (`opd/exportar.ts`) — CONTRATO

```ts
export interface LineaDocumento { readonly tokens: readonly { readonly texto: string; readonly marca?: 'objeto' | 'proceso' | 'estado' }[] }
      // LineaOpl la satisface estructuralmente: opd/ no importa opl/
export interface Advertencia { readonly tipo: 'cruce' | 'atraviesa' | 'solape'; readonly refs: readonly Ref[]; readonly texto: string }
export function advertenciasEscena(e: Escena): readonly Advertencia[];
export function exportarDiagrama(m: Modelo, opd: Id, o: { readonly version: string }):
  Respuesta<{ readonly svg: string; readonly archivo: string; readonly advertencias: readonly Advertencia[] }>;
export function exportarDocumento(m: Modelo, opl: ReadonlyMap<Id, readonly LineaDocumento[]>, o: { readonly version: string }):
  Respuesta<{ readonly html: string; readonly archivo: string }>;
```

- **`canon-diagrama`** (T-280, R-OPD-EXP-1/3):
  - Se construye como `<svg xmlns viewBox=caja+24 width height>`, con `<title>` («SD1 · *Despachar*»)
    y `<metadata>` JSON `{perfil:"canon-diagrama", modelo, opd, etiqueta, exportParcial:true,
    fuentes:["Inria Serif (incrustada)"], version}` (T-285), seguido de
    `<style>@font-face{… base64 …}</style>` y `aTexto(dibujar(escena, 'canon'))`.
  - No lleva grilla, asas, realces, UI ni validación (T-228). El fondo es `paper`.
  - El archivo se llama `<modelo>-<SDx.y>.svg`.
- **`canon-documento`** (T-281, DECISIONS 24): un HTML autocontenido con:
  - el título del modelo y el árbol de OPDs;
  - por cada OPD en preorden, `<h2>` con la etiqueta, su SVG `canon` en línea y su párrafo OPL
    (`<strong>`, `<em>`, `<code>`), generado desde las líneas inyectadas.

  La fuente se incrusta una sola vez en `<style>`.
- **OPL Markdown** (T-282, `generarDocumentoOpl`) y **JSON v0** (T-286: `exportarV0(modelo)` del
  estado **actual** del editor, una instantánea; coincide byte a byte con lo que guarda el servidor
  cuando el indicador dice «Guardado», CC-18) no tienen gate. El OPL Markdown lleva el aviso de §4.4
  si hay hechos fuera de todo OPD (B-26).
- **Gates** (T-283): `exportarDiagrama` y `exportarDocumento` devuelven el `Rechazo` de
  `gatesExportacion`. El menú muestra el ítem deshabilitado y los motivos (regla, mensaje e «Ir»).
  La edición nunca se bloquea.
- **Advertencias** (R-LAY-2, T-284). `advertenciasEscena` cuenta:
  - cruces entre aristas que no comparten extremo;
  - aristas que atraviesan una cosa que no es su extremo ni su contenedor;
  - cosas solapadas (salvo contenedor e interno).

  Se muestran en el menú **antes** de exportar, junto al ítem («⚠ 3 cruces, 1 oclusión · Ver»), sin
  re-rutear.
- Ningún texto de la UI llama «validado» a un export (T-254). Las pruebas visuales inspeccionan el
  SVG `canon`, nunca una captura de edición (T-305).

---

## 7. Experiencia de usuario

### 7.1 Layout

**Escritorio (≥ 1100 px)**. A 1440×900 el lienzo ocupa ≥ 70 % y el lienzo más el OPL, ≥ 95 %.

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ≡  Despacho ✎   SD › SD1 Despachar ▾        ● Guardado      ⛔2 ⚠5     ↶ ↷    Exportar ▾   ?   ⎋ │ 40 px
├──┬─────────────────────────────────────────────────────────────────────┬──────────────────────────┤
│OP│ ▭ Objeto  ⬭ Proceso  ◻ Estado  ⟶ Enlace                              │ PROPIEDADES              │
│Ds│                                                                     │ ⬭ Despachar · proceso    │
│  │                                                                     │ Física ◻  Ambiental ◻    │
│▸ │                     (lienzo SVG, cámara viewBox)                    │ Duración  mín · esp · máx│
│  │                                                                     │ Enlaces (6) ▸            │
│  │                                                                     ├──────────────────────────┤
│  │                                                                     │ OPL │ Diagnóstico (7)    │
│  │                                                                     │ ## SD                    │
│  │                                                                     │ *Despachar* consume …    │
│  │ ✓ Descomponer *Despachar* · 3 ajustes ▸                  − 100 % + ⤢│ [Editar] esencia▾ # ⌕    │
└──┴─────────────────────────────────────────────────────────────────────┴──────────────────────────┘
 32 px (riel; ≥1600 px: árbol abierto 220 px)                                400 px (redimensionable)
```

- **Cabecera única**:
  - ≡ vuelve a la Biblioteca;
  - el nombre del modelo se renombra con un clic;
  - la ruta de OPD navega con clic, y su ▾ abre el árbol como emergente cuando el riel está
    plegado;
  - un **indicador de guardado** único;
  - los contadores de diagnóstico (clic abre la pestaña);
  - deshacer y rehacer, Exportar, Ayuda y Salir.
- **Columna izquierda**: el árbol de OPDs. Por defecto es un riel de 32 px bajo 1600 px de ancho y
  está abierto (220 px) desde 1600. `Ctrl+\` lo alterna.
- **Columna derecha** (400 px, redimensionable, se recuerda en `localStorage`):
  - **Propiedades** arriba, con alto automático y a lo sumo el 50 %. Se abre con la selección.
  - Debajo, las pestañas **OPL | Diagnóstico**.
  - `Ctrl+.` pliega la columna (con `Ctrl+\` también plegado queda solo el lienzo; no hay un tercer
    conmutador «solo lienzo», CC-05). El panel OPL minimizado no se
    renderiza (T-247).
- **Sobre el lienzo** hay dos cosas: la paleta flotante de 4 verbos (arriba a la izquierda) y el
  zoom (abajo a la derecha).
- **Franja** (una línea al pie del lienzo, `aria-live`). Es el único canal de respuesta de las
  operaciones:
  - «✓ <etiqueta de la acción> · N ajustes ▸», donde ▸ despliega las trazas;
  - «✕ <mensaje> (<regla>). <acción>»;
  - «Deshecho: <acción>»;
  - los modos `navegacion` y `estatico`.

  Persiste hasta la siguiente operación. No es una superficie.

**Estrecho (< 1100 px)**. Es la misma aplicación, con una zona visible y pestañas inferiores.

```
┌──────────────────────────────────────┐
│ ≡ Despacho   SD1 ▾      ● Guardado ⋯ │ 40 px (⋯ = deshacer, rehacer, Exportar, Ayuda, Salir)
├──────────────────────────────────────┤
│   zona activa: Lienzo | OPL |        │
│   OPDs | Propiedades | Diagnóstico   │
│ ✓ franja                             │
├──────────────────────────────────────┤
│  Lienzo   OPL   OPDs   Propiedades ⛔2│ 48 px
└──────────────────────────────────────┘
```

No hay desplazamiento horizontal de página: el lienzo tiene cámara propia y el panel OPL ajusta
línea en lectura. Tocar, arrastrar y pellizcar para el zoom funcionan sin un modo especial (el
modo móvil de solo lectura queda fuera).

### 7.2 Superficies (inventario cerrado: 14)

| # | Superficie | Tipo | Por qué existe |
|---|---|---|---|
| 1 | Acceso | pantalla (y diálogo de reingreso) | una cuenta (DECISIONS 8) |
| 2 | Biblioteca | pantalla | lista simple (DECISIONS 7): nuevo, abrir, renombrar, eliminar a papelera y restaurar, importar, descargar |
| 3 | Editor: lienzo | pantalla | OPD (T-252) |
| 4 | Árbol de OPDs | panel | navegar el árbol (T-031, T-252) |
| 5 | Propiedades | panel | esencia, afiliación, estados, designaciones, control, etiquetas, ruta, multiplicidad, duración e incompleta; sección «Enlaces (N)» en lugar de una tabla de enlaces (DECISIONS 10) |
| 6 | OPL (lectura y edición) | panel | bimodalidad activa (T-240, T-241) y editor OPL |
| 7 | Diagnóstico | pestaña del 6 | la validación vive fuera del lienzo (T-228, T-260) |
| 8 | Menú de tipo de enlace | menú | solo tipos legales, con motivo, segundo gesto y vista previa OPL (T-040, T-253) |
| 9 | Menú contextual | menú | verbos de la selección, derivados del registro de comandos (descubribilidad) |
| 10 | Exportar | menú | perfiles canónicos, JSON y OPL, con gates y advertencias (T-280–T-286) |
| 11 | Decisión | diálogo genérico | confirmaciones destructivas, conflicto, borrador y eliminar refinamiento |
| 12 | Buscar (`Ctrl+K`) | diálogo | cosas y OPDs por nombre: ir o traer (DECISIONS 10, R-OPD-UI-1). No ejecuta comandos |
| 13 | Informe de importación | diálogo | normalizado, descartado, ignorado, rechazos, visibilidad y reparaciones (T-287, DECISIONS 12) |
| 14 | Ayuda | diálogo | atajos (generados del registro) y leyenda visual |

Los elementos en línea no cuentan como superficies: la edición de nombre en la figura, la franja y
las guías de banda. No hay paleta de comandos, pestañas de modelos, cintas ni tabla de enlaces.

### 7.3 Flujos

«↵» es Enter y «⎋» es Escape. Toda acción rechazada muestra en la franja la regla y la acción
canónica (P7), y toda acción se deshace en un paso.

1. **Entrar.**
   1. `/` sin sesión (`GET /api/sesion` → 401) lleva a Acceso: correo, clave y «Entrar».
   2. El error es uniforme: «Credenciales inválidas». Un 429 muestra «Demasiados intentos; espera N
      minutos».
   3. El éxito lleva a la URL pedida (`#/m/<id>/<opd>`) o a la Biblioteca.
   4. **Sesión vencida durante la edición** (401 al guardar): Acceso aparece como diálogo sobre el
      editor. Mientras tanto, el lienzo queda en modo `navegacion` y el borrador conserva todo. Al
      entrar se reintenta el guardado pendiente.
2. **Biblioteca.** Es una lista ordenada por modificación: nombre, «hace 2 h» y `262 cosas · 36
   OPDs`. Tiene un filtro de texto (`/`). Acciones por fila:
   - **Abrir**: clic o ↵.
   - **Renombrar**: `F2` o `⋯ › Renombrar`. Es edición en línea: el cliente hace `GET`,
     `renombrarModelo`, `exportarV0` y `PUT` con `If-Match`.
   - **Descargar**: `⋯ › Descargar JSON`, que hace `GET ?descargar=1`.
   - **Eliminar** (`Supr`): una Decisión «Mover *X* a la papelera (se conserva 30 días)». La sección
     «Papelera (N)» tiene **Restaurar** y **Eliminar definitivamente**. Restaurar muestra el
     Informe completo si recanonicaliza; ante 400/422 muestra el rechazo o la pérdida y mantiene
     la entrada. No ofrece aceptar pérdidas desde esta acción; la recuperación del original por
     el procedimiento operativo y su importación mantienen el flujo de informe de §7.3-3. Ante
     error de red o 5xx se refrescan Biblioteca y Papelera; no se repite automáticamente el POST,
     porque la escritura puede haberse instalado aunque la respuesta fallara.
   - **Nuevo** (`N`): pide el nombre en línea, crea el modelo con `crearModelo`, lo sube con `POST`
     y lo abre.
3. **Importar** (botón, `I` o soltar un archivo).
   1. Un `.json` (documento v0, registro `{json}`, recuperación local o paquete portátil) pasa por
      `importarV0` en el cliente. Un `.md` o `.txt` pasa por `importarOpl` (§5.7). El modelo recibe
      siempre un `m-…` nuevo (§3.3, CC-16).
   2. Se abre el **Informe de importación**. Muestra:
      - un resumen: cosas, estados, enlaces y OPDs;
      - las secciones plegables «Normalizado (N)», «Descartado (N)» (con «Descargar original»),
        «Ignorado» (conteos), «Visibilidad por OPD» (DiffVisibilidad, cada línea en OPL, compuesta
        por `ui`) y «Errores del canon cargados (N)» (`diagnosticar` del resultado, T-288);
      - «Rechazos», si los hay, sin botón de crear.
   3. Si hay diagnósticos con `reparacion`, se ofrece la casilla **«Aplicar N reparaciones sugeridas
      antes de crear»**, desmarcada por defecto. Lista cada una: «renombrar **Pedido** (2.º) →
      **Pedido-2**», «migrar consumo de **Agua** a *Hervir*» (DS-7).
   4. «Crear modelo» hace `POST` y lo abre. Un `.json` con `descartado` no vacío conserva su original
      descargable desde el informe hasta cerrar el diálogo (DECISIONS 12).
4. **Crear objeto o proceso.**
   1. `O` o `P`, o clic en la paleta y luego en el lienzo. Aparece la figura en el cursor (o al
      centro de la vista, en un hueco libre) con el campo de nombre en foco. `Tab` alterna entre
      objeto y proceso.
   2. La validación léxica es en vivo. Si solo falla la mayúscula inicial, se ofrece «↵ usar
      **Pedido**» (sugerencia explícita, T-025).
   3. ↵ crea; `Mayús+↵` crea y abre otro campo 100 px debajo; ⎋ no crea nada (T-062).
   4. Si el nombre existe, la bandeja dice «Ya existe **Pedido** (objeto, en SD y SD2). ↵ Traer esa
      misma cosa aquí · Tab cambiar nombre · ⎋ descartar». Si el existente es de otro tipo, solo se
      puede cambiar el nombre o descartar (T-065, método §9.15).
   5. Dentro de un contenedor de descomposición, un proceso nuevo entra como subproceso en la banda
      bajo el cursor y un objeto como interno.
5. **Esencia y afiliación.**
   - Con la cosa seleccionada, `Mayús+F` alterna física/informacional y `Mayús+A`,
     sistémica/ambiental. También están los conmutadores de Propiedades y el menú contextual.
   - La sombra y el dash aparecen al instante, junto con D1/D3 en el OPL (T-240).
   - Volver ambiental un exhibidor propaga a sus rasgos: «3 rasgos pasaron a ambientales (R-OBJ-6)».
   - Pasar a informacional un objeto que es agente se rechaza con R-AG-1 (DS-20).
6. **Estados y designaciones.**
   - Con un objeto seleccionado, `S` abre una cápsula fantasma con el nombre en foco. ↵ crea un
     estado y termina; ⎋ no crea (DECISIONS 18: uno por gesto, siempre con nombre). Un objeto puede
     tener un solo estado (R-OBJ-2).
   - Con un estado seleccionado:

     | tecla | acción |
     |---|---|
     | `I` | inicial |
     | `F` | final |
     | `D` | por defecto, que reemplaza al anterior con traza |
     | `H` | ocultar en este OPD |
     | `Mayús+H` | ocultar en todos |
     | `←` `→` | reordenar |
     | `F2` o doble clic | renombrar |
     | `Supr` | eliminar; si tiene enlaces, una Decisión: «Los 2 enlaces anclados a `pagado` quedarán sobre **Pedido**» |

   - `Current` se marca desde Propiedades o el menú contextual.
   - No se puede ocultar un estado enlazado donde se ve (LF-03, `estado-enlazado`).
   - El chip `⋯N` muestra los estados ocultos; un clic en él ofrece «Mostrar estados ocultos».
7. **Crear enlace.**
   1. Al pasar sobre una cosa o una cápsula aparece su ancla de conexión: un rombo crimson, distinto
      de toda piruleta (R-DEC-2A).
   2. Se arrastra el ancla hasta otra cosa o cápsula. Los destinos con ≥1 tipo legal se realzan, y
      los demás se atenúan con `×` (T-253).
   3. Al soltar se abre el **menú de tipo** (`tiposLegales`):

      ```
      ┌ **Agua** en `fría` → *Hervir* ──────────────────────────────┐
      │ 1  consumo      *Hervir* consume **Agua** en `fría`.        │ ◀ último usado para este par
      │ 2  efecto       *Hervir* cambia **Agua** de `fría`.         │
      │ 3  instrumento  *Hervir* requiere **Agua** en `fría`.       │
      │ ─ desde *Hervir* ─                                           │
      │ 4  resultado    *Hervir* genera **Agua** en `fría`.         │
      │ ▸ 9 tipos no disponibles                                     │
      └ ↑↓ · 1–9 · ↵ · Tab otra orientación · ⎋ ────────────────────┘
      ```

      - Cada vista previa de una opción completa es la línea del resultado efectivo del ensayo
        que emitirá el generador real (`lineaDeEnlace`). Una pendiente muestra los datos requeridos.
      - «N no disponibles» se despliega con los motivos, por ejemplo «agente: solo desde objeto
        físico (AP-05)».
      - La fila resaltada al abrir es el último tipo usado para ese par de clases y orientación
        (`localStorage`).
   4. **El segundo gesto** usa la `alternativa`:
      - si existe el TS4 «*Pagar* cambia **Pedido** de `pendiente`.» y se arrastra de *Pagar* a
        `pagado`, la primera fila es «Completar cambio: de `pendiente` a `pagado`»;
      - si ya hay un resultado a `aprobado` y se arrastra otro a `rechazado`, aparecen «Abanico XOR
        con el existente» y «Abanico OR…», y la fila simple queda bloqueada con su motivo;
      - si hay un consumo y se intenta un instrumento, la fila bloqueada dice «Ya existe consumo
        entre **Agua** y *Hervir* (un procedimental por par, T-053)» y ofrece «Cambiar tipo del
        existente».
   5. ↵ o un dígito confirma la opción: una completa aceptada crea el enlace; una pendiente abre
      sus campos antes de insertar. Al confirmar datos se reevalúa el mismo gesto/sentido y solo
      `legal === true` permite creación. ⎋ cancela sin acción, id ni cambio de modelo.
      La línea creada se resalta 2 s en el OPL.
   6. Si el proceso está descompuesto, la franja informa la migración: «migrado a *Recibir*
      (R-DIST-1)».
   7. **Por teclado**: con una cosa o un estado seleccionado, `R` entra al modo enlace («Enlace desde
      **Agua**: elige destino · Tab/flechas · escribe un nombre · ⎋»).
      - `Tab` recorre solo los destinos legales.
      - Escribir busca en el lugar y ofrece al final «Crear objeto «Leche»» / «Crear proceso
        «Leche»». La cosa nueva se coloca con objeto arriba y proceso abajo (R-OPD-LAY-9).
      - ↵ abre el menú de tipo.
8. **Control e/c.**
   - Con un enlace seleccionado, `E` o `C` alternan evento o condición; la letra se ve en el lienzo
     y el OPL pasa a E\*/C\*. También está el selector de Propiedades: «ninguno · evento ·
     condición».
   - Donde no aplica, el selector aparece deshabilitado con el motivo: resultado, invocación,
     excepción, estructural, mitad escindida, o `c` con multiplicidad («combinación sin plantilla,
     DR-44»).
9. **Etiquetas, ruta y multiplicidad.**
   - Al seleccionar un etiquetado se abre el editor de etiqueta en el punto medio antes de
     persistir. El bidireccional tiene dos campos (`Tab`); el recíproco con estados requiere una
     etiqueta. Confirmar vuelve a consultar con los datos; cancelar conserva el modelo. Dos
     etiquetas válidas no vacías e iguales se normalizan mediante creación a recíproco con traza
     R-STRE-1. Unidireccional y recíproco sin estados admiten etiqueta ausente.
   - La ruta se edita en Propiedades (solo en consumo y resultado).
   - La multiplicidad por extremo legal se rota con `M` en el extremo objeto o refinador, y con
     `Mayús+M` en el origen de los etiquetados, en el orden —, `?`, `*`, `+`. Propiedades muestra la
     frase OPL al lado.
   - El género (Propiedades de la cosa) decide `un/una`.
   - Doble clic en una etiqueta del lienzo la edita en línea.
10. **Abanicos XOR/OR.**
    - Con ≥2 enlaces seleccionados (`Mayús+clic`), `X` forma un XOR y `Mayús+X` un OR. También
      están en el menú contextual y en Propiedades («N elementos»). Si `violacionesAbanico` o
      `noOfrecido` fallan, quedan deshabilitados con el motivo.
    - Aparece el arco en el extremo común y la oración con `exactamente uno de` / `al menos uno de`.
    - Un clic en el arco selecciona el abanico. Propiedades muestra el operador, las ramas, «Control
      de todas las ramas» (solo las combinaciones con plantilla) y «Disolver» (vuelve a AND).
      Con el abanico seleccionado, `X` alterna el operador.
11. **Descomponer y bandas.**
    1. Con un proceso seleccionado, `D` (o el menú «Descomponer»). `descomponer` crea **ya** el OPD
       hijo, con el contenedor y los externos colocados y **sin subprocesos semilla** (DECISIONS
       18), navega a él y abre el campo de nombre dentro del contenedor, en la banda 1.
    2. Se escribe `Recibir ↵ Validar ⇧↵ Verificar ↵ Despachar ⎋`: ↵ pasa a la banda siguiente
       (secuencia) y ⇧↵ queda en la misma banda (paralelo). Cada nombre confirmado queda como
       fantasma con su nombre real, nunca como placeholder.
    3. ⎋, o ↵ con el campo vacío, ejecuta **una** `agregarSubprocesos` con todos los nombres. Eso
       dispara la distribución 0→n y la escisión (DS-3, DS-4). La franja informa «consumo →
       *Recibir* · resultado → *Despachar* · TS3 escindido».
    4. `descomponer` y ese `agregarSubprocesos` comparten `gesto`, así que se deshacen en **un**
       paso (SYNTHESIS §8-10).
    5. Si se pulsa ⎋ sin nombres, la descomposición queda vacía: `refinamiento-trivial` advierte
       hasta que haya ≥2 subprocesos, y el gate bloquea el export.
    6. Más subprocesos: `P` dentro del contenedor (uno por gesto, en la banda bajo el cursor) o `N`
       con el contenedor seleccionado (reabre el campo encadenado).
    7. **Reordenar**:
       - arrastrar un subproceso en vertical muestra las guías de banda: soltar sobre una banda lo
         pone en paralelo y soltar entre bandas crea una banda nueva;
       - `[` y `]` lo mueven a la banda anterior o siguiente; `Mayús+[` y `Mayús+]` crean una banda
         nueva antes o después;
       - el arrastre horizontal queda confinado al contenedor;
       - el OPL (CX) se actualiza al soltar.
    8. Si el primer o el último subproceso cambian después, los enlaces no se mueven (T-076). La
       franja lo recuerda una vez: «Los enlaces siguen donde estaban; arrastra su extremo para
       reasignarlos».
12. **Desplegar por modo.**
    1. `U` (o el menú «Desplegar ▸ Agregación · Exhibición · Generalización · Clasificación», con
       las teclas `1`–`4`).
    2. Se abre el OPD hijo con la cosa arriba y sus hijos estructurales directos de ese modo.
    3. Un campo de nombre encadenado crea refinadores nuevos (↵ siguiente, ⎋ termina), cada uno con
       su enlace estructural. En exhibición, `Tab` alterna entre atributo (objeto) y operación
       (proceso).
13. **Colección incompleta.**
    - Con el triángulo seleccionado, `I` o la casilla de Propiedades: se ofrece en agregación,
      exhibición y generalización, nunca en clasificación. Se ve la barra bajo el triángulo y «… y
      al menos otra parte».
    - Si un OPD muestra solo parte de los refinadores, la marca aparece sola, con la nota
      `ajuste-automatico`.
14. **Navegar el árbol.**
    - Clic en un nodo del árbol o de la ruta.
    - ↵ o doble clic en una cosa refinada entra a su refinamiento; si tiene ambos, un menú
      «Descomposición / Despliegue».
    - `Alt+↑` sube al padre; `Alt+←/→` va al hermano anterior o siguiente. Atrás y Adelante del
      navegador recorren los OPDs visitados.
    - Siempre se encuadra el bbox (DS-22). Si la cosa seleccionada aparece en el destino, sigue
      seleccionada.
15. **Buscar y traer** (`Ctrl+K`).
    - Se escribe parte del nombre (sin distinguir mayúsculas ni acentos) y aparecen hasta 20
      resultados: cosas («**Pedido** · objeto · SD, SD2») y OPDs («SD2.1 · despliegue de
      **Pedido**»).
    - Sobre una cosa, ↵ la trae aquí y `⇧↵` va a ella: navega a su primer OPD en preorden y la
      selecciona. Sobre un OPD, ↵ navega.
    - Traer crea la aparición en un hueco libre del OPD activo; es la misma cosa (T-248). Sus
      enlaces con cosas visibles aparecen solos.
    - Un interno de otra descomposición no se puede traer (motivo A3.3). Es el camino para las
      cosas con `cosa-sin-aparicion`.
16. **Quitar ≠ eliminar** (T-251).
    - `Supr` quita de este OPD: la aparición desaparece y la franja dice «**Agua** quitada de SD1
      (sigue en el modelo) · Ctrl+Z». Si era la última: «**Agua** ya no aparece en ningún OPD (sigue
      en el modelo; Buscar › Traer)».
    - El contenedor y los internos no se pueden quitar; el motivo va en la franja.
    - `Mayús+Supr` elimina del modelo, con una Decisión que lista lo que se pierde: apariciones en N
      OPDs, enlaces y estados.
    - Si la cosa tiene refinamientos, se rechaza: «**Cocinar** tiene refinamiento (SD1). Elimina
      primero su refinamiento» (DS-5), con el botón «Ir a SD1».
    - Los textos de quitar y eliminar son distintos y nunca se confunden.
17. **Reanclar** (DS-9).
    - Al seleccionar un enlace o una rama del peine aparecen asas cuadradas crimson en sus extremos.
    - Arrastrar un asa a otra cosa o cápsula del OPD aplica `reanclarExtremo`, que conserva el id y
      valida con la matriz; si no es legal, `×` y el motivo en la franja.
    - Soltar el asa del objeto en una de sus cápsulas cambia el anclaje (T1 → TS1). Soltarla en otro
      subproceso reasigna un consumo o un resultado migrado (T-250).
18. **Duración.**
    - En Propiedades de un proceso: mín, esperada, máx y unidad (`ms…year`), con validación en vivo
      (F-10). Se ve `[min] {1, 3, 5}` en la elipse.
    - Crear una excepción sobre una fuente sin la cota exigida abre el campo con el aviso «R-EXC-2:
      define la duración máxima o se escribirá “su duración máxima”». Es canónico condicionado:
      pide el dato o advierte, nunca inventa (T-047).
19. **Editar OPL y aplicar** (§5.8). Tras aplicar, las líneas nuevas o cambiadas se resaltan 2 s por
    `LineaOpl.id`. Reabrir el editor sin tocar muestra «Sin cambios aplicables».
20. **Hover y clic bimodal** (T-242–T-245).
    - Pasar sobre un token del OPL realza su elemento en el lienzo (`paperWarm`, capa UI), y pasar
      sobre una cosa, un estado o un enlace realza sus tokens. El vínculo es la `Ref` o el `hecho`,
      nunca el texto. El panel **no** se desplaza con el hover (foco estable).
    - Un clic en un token selecciona y encuadra el elemento, navegando si está en otro OPD, sin
      mutar nada.
    - Seleccionar en el lienzo desplaza el panel a la primera línea del bloque actual que lo
      contiene.
    - «Filtrar por selección» (⌕) muestra solo las líneas con refs de la selección: primero el
      enlace, luego la cosa, y todo si no hay selección.
21. **Diagnóstico.**
    - La pestaña tiene contador y tres grupos: Bloqueos (error), Advertencias y Notas. El OPD actual
      va primero.
    - Cada ítem muestra el mensaje, la regla, la acción canónica e «Ir» (navega y selecciona).
    - Si tiene `reparacion`, también «Aplicar». Un grupo del mismo código con reparación ofrece
      «Aplicar a los N» (una `aplicarAcciones`, un paso de deshacer).
    - El lienzo queda limpio (T-228).
22. **Exportar** (`Exportar ▾`). Ofrece:
    - «Diagrama SVG de SD1 (canon-diagrama)», con «⚠ 3 cruces, 1 oclusión · Ver» si los hay;
    - «Documento HTML (canon-documento)»;
    - «OPL Markdown»;
    - «Modelo JSON».

    Si hay gate, el ítem aparece deshabilitado con los motivos («SD1 tiene 1 subproceso (AP-13) ·
    Ir»).
23. **Deshacer y rehacer.**
    - `Ctrl+Z` y `Ctrl+Mayús+Z` (o `Ctrl+Y`), con 200 pasos por modelo abierto.
    - Cada operación, cada «Aplicar» del OPL, cada «Aplicar a los N» y cada descomposición con
      nombres encadenados es un paso.
    - Deshacer **vuelve al OPD donde ocurrió** y restaura la selección. La franja dice «Deshecho:
      Descomponer *Cocinar*».
24. **Guardado y conflicto** (§8.4).
    - El indicador muestra «Guardado», «Cambios sin guardar», «Guardando…», «Sin conexión: guardado
      en este navegador», «Conflicto», «Sesión vencida», «No se pudo guardar» o «Versión nueva: recarga». `Ctrl+S` guarda
      ya.
    - En **conflicto** (412), el lienzo pasa a `navegacion` y aparece la Decisión «Otra sesión
      guardó este modelo a las 14:02»:
      - **[Conservar mis cambios]** sobrescribe, y la versión reemplazada va a la papelera;
      - **[Usar la versión guardada]** guarda la mía como modelo nuevo «Despacho (copia 14:05)» y
        carga la del servidor.

      Nada se pierde.
    - Si al abrir hay un **borrador** más nuevo, la Decisión dice «Hay cambios de este navegador sin
      subir (hace 3 min)» y ofrece [Recuperarlos], [Descartarlos] o [Descargar].
25. **Selección múltiple** (DECISIONS 22, mínima, sin portapapeles).
    - `Mayús+clic` agrega o quita una cosa o un enlace; ⎋ o un clic en vacío limpia la selección.
    - Con ≥2 cosas, arrastrar cualquiera mueve todas: es una `moverApariciones` y un paso de
      deshacer (los subprocesos, solo en horizontal). Las flechas mueven todas.
    - `Supr` quita todas de este OPD y `Mayús+Supr` las elimina, con una Decisión que suma lo que se
      pierde.
    - Con ≥2 enlaces, se puede formar un abanico (flujo 10) o eliminarlos con `Supr`.
    - Propiedades muestra «N elementos» con solo esas acciones. No hay alinear, distribuir, copiar ni
      pegar.
26. **Enlaces de una cosa**, en Propiedades («Enlaces (N)»; reemplaza la tabla de enlaces).
    - Tiene una fila por enlace con el tipo, el otro extremo, el estado y los OPDs donde se ve
      (`SD, SD1`), agrupadas como el OPL.
    - Un clic en la fila selecciona el enlace, navegando si no se ve aquí. `Supr` en la fila lo
      elimina.
27. **Eliminar refinamiento**: se ofrece en el menú contextual del refinado o del nodo del árbol,
    solo si es hoja. La Decisión lista lo que se elimina, lo que se pierde y lo que se conserva en
    el padre (§4.5.6).
28. **Cambiar tipo**:
    - de cosa, con el conmutador de Propiedades, que se rechaza listando lo que impide el cambio
      (T-063);
    - de enlace, con ↵ sobre el enlace, que abre el menú de tipo para el mismo par y conserva el id.

### 7.4 Atajos (registro único `editor/comandos.ts`; la Ayuda los lista)

Las letras solas actúan solo con el foco en el lienzo, el árbol o el panel, nunca dentro de un
campo de texto. No se usan atajos que reserva el navegador (`Ctrl+W/T/N/Tab/1…9`). La rueda
desplaza; `Ctrl`+rueda o pellizcar hace zoom multiplicativo de 10 %, anclado al cursor, entre 0,2 y
3. `overscroll-behavior: none`.

| Contexto | Tecla | Acción |
|---|---|---|
| global | `Ctrl+K` | buscar cosa u OPD (ir / traer) |
| global | `Ctrl+E` | editar el OPL del OPD activo |
| global | `Ctrl+Z` · `Ctrl+Mayús+Z` / `Ctrl+Y` · `Ctrl+S` | deshacer · rehacer · guardar ahora |
| global | `Alt+↑` · `Alt+←/→` | OPD padre · hermano anterior/siguiente |
| global | `Ctrl+0` · `+` · `−` · `Espacio`+arrastre | encuadrar · zoom · desplazar |
| global | `Ctrl+\` · `Ctrl+.` · `F9` | árbol · columna derecha · vista canon |
| global | `?` · `⎋` | ayuda · cancelar gesto → cerrar → deseleccionar |
| lienzo | `O` · `P` | crear objeto · proceso (en el cursor) |
| cosa | `F2` · `↵` / doble clic | renombrar · entrar al refinamiento (si no tiene, renombrar) |
| cosa | `R` · `S` (objeto) | modo enlace · nuevo estado |
| cosa | `D` (proceso) · `U` · `N` (contenedor o refinable) | descomponer · desplegar · nombres encadenados |
| cosa | `Mayús+F` · `Mayús+A` | física ↔ informacional · sistémica ↔ ambiental |
| cosa | `Supr` · `Mayús+Supr` | quitar de este OPD · eliminar del modelo |
| cosa | flechas · `Mayús`+flechas | mover 1 px · 10 px |
| subproceso | `[` `]` · `Mayús+[` `Mayús+]` | banda anterior/siguiente · banda nueva antes/después |
| estado | `I` · `F` · `D` · `H` · `Mayús+H` · `←/→` · `F2` · `Supr` | inicial · final · por defecto · ocultar aquí · en todos · reordenar · renombrar · eliminar |
| enlace | `E` · `C` · `M` · `Mayús+M` · `↵` · `Supr` | evento · condición · multiplicidad objeto/refinador · multiplicidad origen · cambiar tipo · eliminar |
| ≥2 enlaces | `X` · `Mayús+X` | abanico XOR · OR |
| abanico | `X` · `Supr` | alternar operador · disolver |
| triángulo | `I` · `↵` | colección incompleta · agregar refinador |
| modo enlace | `Tab` · letras · `↵` · `⎋` | siguiente destino legal · buscar o crear destino · menú de tipo · cancelar |
| editor de nombre | `↵` · `Mayús+↵` · `Tab` · `⎋` | confirmar · confirmar y otro (cosas; no en estados, DECISIONS 18) · alternar objeto/proceso (al crear) · cancelar |
| nombres encadenados | `↵` · `⇧↵` · `⎋` | banda siguiente · misma banda · terminar |
| menú de tipo | `↑↓` · `1`–`9` · `↵` · `Tab` | elegir · directo · crear · otra orientación |
| editor OPL | `Ctrl+Enter` · `Ctrl+↓/↑` · `⎋` | aplicar · siguiente/anterior no aplicable · salir |
| biblioteca | `/` · `↑↓` · `↵` · `N` · `I` · `F2` · `Supr` | buscar · recorrer · abrir · nuevo · importar · renombrar · eliminar |

En pantalla, los atajos se muestran según la plataforma (`Ctrl` o `⌘`). `comandos.test.ts` falla si
hay dos comandos con la misma tecla en el mismo contexto.

### 7.5 Estado vacío, errores y accesibilidad

- **OPD vacío**: al centro, «Crea un objeto (O) o un proceso (P)», con los dos botones. No hay
  asistente ni pregunta metodológica (A1.1).
- **Biblioteca vacía**: «Aún no hay modelos», con Nuevo e Importar.
- **Errores**:
  - Un rechazo de operación va a la franja, con la regla y la acción (P7).
  - Un error de red pasa el indicador a «Sin conexión» y el trabajo sigue en el borrador.
  - Un error inesperado de render de un OPD deja en el lienzo «No se pudo dibujar este OPD», con
    «Copiar detalle» (versión, OPD, pila; nunca el contenido del modelo). El resto de la app sigue,
    porque hay un límite de error por panel.
- **Accesibilidad**:
  - Cada cosa del lienzo es enfocable (`Tab` en orden de nombre), con `role="img"` y
    `aria-label="Objeto Pedido, físico"`.
  - El foco es visible en crimson; se respeta `prefers-reduced-motion`; la UI tiene contraste AA.
  - La severidad del diagnóstico se muestra con texto e ícono, no solo con color.

### 7.6 Contrato de la capa `editor/` (para los WP de UI)

```ts
// editor/estado.ts
export interface Seleccion { readonly cosas: readonly Id[]; readonly estados: readonly Id[]; readonly enlaces: readonly Id[];
                             readonly abanicos: readonly Id[]; readonly simbolo?: string }
export type ModoLienzo = 'edicion' | 'navegacion' | 'gestion-modal' | 'estatico';
export type EstadoGuardado = 'guardado' | 'pendiente' | 'guardando' | 'sin-conexion' | 'conflicto' | 'sesion-vencida' | 'error' | 'eliminado' | 'version-nueva';   // CC-15
export interface Camara { readonly x: number; readonly y: number; readonly zoom: number }
export interface Franja { readonly tipo: 'ok' | 'rechazo' | 'info'; readonly texto: string; readonly regla?: string;
                          readonly accion?: string; readonly trazas: readonly Traza[] }
export interface Paso { readonly modelo: Modelo; readonly opd: Id; readonly seleccion: Seleccion; readonly etiqueta: string; readonly gesto?: string }
export interface EstadoEditor {
  readonly pantalla: 'acceso' | 'biblioteca' | 'editor';
  readonly modelo: Modelo | null; readonly rev: string | null; readonly opd: Id;
  readonly seleccion: Seleccion; readonly pasado: readonly Paso[]; readonly futuro: readonly Paso[];   // 200 máx.
  readonly franja: Franja | null; readonly guardado: EstadoGuardado; readonly modo: ModoLienzo; readonly camara: Camara;
  readonly realce: readonly Ref[];                  // hover bimodal
  readonly lineasNuevas: readonly string[];         // ids de LineaOpl nuevas o cambiadas (se limpian a los 2 s)
  readonly paneles: { readonly arbol: boolean; readonly derecha: boolean };
  readonly vista: { readonly esencia: OpcionesOpl['esencia']; readonly numeracion: boolean };   // sin grilla (CC-04)
}
export interface Editor {
  obtener(): EstadoEditor;
  suscribir(f: () => void): () => void;
  ejecutar(a: Accion, o?: { readonly gesto?: string }): Respuesta<Hecho>;   // ÚNICO commit (T-011); mismo gesto ⇒ un paso
  ejecutarVarias(as: readonly Accion[], etiqueta: string): Respuesta<Hecho>; // «Aplicar a los N», reparaciones
  aplicarOpl(plan: Plan): Respuesta<Hecho>;
  deshacer(): void; rehacer(): void;
  navegar(opd: Id, o?: { readonly seleccionar?: readonly Ref[] }): void;     // encuadra (DS-22)
  seleccionar(s: Seleccion | ((s: Seleccion) => Seleccion)): void;
  realzar(r: readonly Ref[]): void;
  fijarModo(m: ModoLienzo): void;
  abrir(id: Id): Promise<void>; cerrar(): void; guardarAhora(): Promise<void>;
  resolverConflicto(o: 'conservar-mios' | 'usar-guardada'): Promise<void>;
  guardarDeNuevo(): Promise<void>;                     // tras 404: POST con el mismo id o uno nuevo (CC-15)
  resolverBorrador(o: 'recuperar' | 'descartar' | 'descargar'): Promise<void>;
}
export function crearEditor(dep: { readonly cliente: Cliente; readonly local: AlmacenLocal; readonly reloj?: () => number }): Editor;

// editor/cliente.ts (fetch inyectado; rutas de §8.1)
export interface FilaModelo { readonly id: Id; readonly nombre: string; readonly modificado: string; readonly rev: string; readonly bytes: number; readonly cosas: number; readonly opds: number }
export interface FilaPapelera { readonly entrada: string; readonly id: Id; readonly nombre: string; readonly eliminado: string; readonly motivo: 'eliminado' | 'reemplazado' }
export type FalloApi = { readonly estado: number; readonly error: string; readonly informe?: Informe };
export interface Cliente {
  sesion(): Promise<{ email: string } | null>;
  entrar(email: string, clave: string): Promise<'ok' | 'credenciales' | { reintentarEn: number }>;
  salir(): Promise<void>;
  listar(): Promise<readonly FilaModelo[]>;
  leer(id: Id): Promise<{ texto: string; rev: string } | 'no-existe'>;
  crear(texto: string): Promise<{ id: Id; rev: string } | FalloApi>;
  guardar(id: Id, texto: string, rev: string, o?: { respaldo?: true }): Promise<{ rev: string } | { conflicto: string } | FalloApi>;
  eliminar(id: Id): Promise<void>;
  papelera(): Promise<readonly FilaPapelera[]>;
  restaurar(entrada: string): Promise<{ id: Id; rev: string; canonicalizado?: true; informe?: Informe } | FalloApi>;
  purgar(entrada: string): Promise<void>;
  versionServidor(): string | null;               // última cabecera X-Opforja-Version vista
}
export function crearCliente(f: typeof fetch, base?: string): Cliente;

// editor/guardado.ts — borrador en IndexedDB (try/catch; si no hay IndexedDB, solo memoria)
export interface AlmacenLocal {
  leer(id: Id): Promise<{ base: string | null; texto: string; fecha: number } | null>;
  escribir(id: Id, b: { base: string | null; texto: string; fecha: number }): Promise<void>;
  borrar(id: Id): Promise<void>;
  ids(): Promise<readonly Id[]>;                  // la Biblioteca marca «cambios sin subir» (CC-15)
}

// editor/comandos.ts
export type ContextoComando = 'global' | 'lienzo' | 'cosa' | 'objeto' | 'proceso' | 'contenedor' | 'estado' | 'enlace'
  | 'multiple' | 'abanico' | 'simbolo' | 'modo-enlace' | 'nombre' | 'biblioteca' | 'editor-opl';
export interface Comando {
  readonly id: string; readonly titulo: string; readonly atajo?: string; readonly contexto: ContextoComando;
  readonly menu?: 'contextual' | 'exportar';
  disponible(e: EstadoEditor): true | string;     // string = motivo visible (deshabilitado)
  ejecutar(ed: Editor): void;
}
export const COMANDOS: readonly Comando[];

// editor/gestos.ts — reductor puro del lienzo
export type Gesto =
  | { readonly k: 'reposo' } | { readonly k: 'creando'; readonly tipo: TipoCosa; readonly en: Punto; readonly nombre: string }
  | { readonly k: 'arrastrando'; readonly cosas: readonly Id[]; readonly desde: Punto; readonly delta: Punto }
  | { readonly k: 'redimensionando'; readonly cosa: Id; readonly caja: Rect }
  | { readonly k: 'conectando'; readonly desde: ExtremoRef; readonly punto: Punto; readonly sobre?: ExtremoRef }
  | { readonly k: 'menuTipo'; readonly desde: ExtremoRef; readonly hacia: ExtremoRef; readonly opciones: readonly OpcionTipo[] }
  | { readonly k: 'reanclando'; readonly enlace: Id; readonly extremo: 'origen' | 'destino'; readonly punto: Punto }
  | { readonly k: 'banda'; readonly proceso: Id; readonly destino: { banda: number } | { nuevaBandaAntesDe: number } | null }
  | { readonly k: 'encadenando'; readonly opd: Id; readonly bandas: readonly (readonly string[])[]; readonly actual: string; readonly modo: 'subprocesos' | 'refinadores' }   // estados: uno por gesto (DECISIONS 18, CC-20)
  | { readonly k: 'desplazando'; readonly desde: Punto };
export type EventoLienzo = { readonly k: 'abajo' | 'mover' | 'arriba'; readonly punto: Punto; readonly sobre?: string /* data-ref */; readonly mayus: boolean }
  | { readonly k: 'tecla'; readonly tecla: string; readonly mayus: boolean; readonly ctrl: boolean; readonly alt: boolean };
export function reducirGesto(m: Modelo, opd: Id, g: Gesto, ev: EventoLienzo): { readonly gesto: Gesto; readonly acciones: readonly Accion[]; readonly gestoId?: string };
```

---

## 8. Persistencia y servidor

Un proceso `Bun.serve`, en el puerto 8080, sirve la SPA estática y la API. No hay PostgreSQL, nginx
ni dependencias de servidor. `servidor/` importa solo `codec/` y, a través de él, `nucleo/`.
Configuración por variables de entorno:

| variable | uso |
|---|---|
| `OPFORJA_SECRETO` | ≥ 32 caracteres; sin ella el proceso no arranca |
| `OPFORJA_TOKEN` | opcional; si existe, ≥ 48 caracteres |
| `OPFORJA_DATOS` | `/datos` |
| `PORT` | 8080 |
| `OPFORJA_VERSION` | sha del build |
| `OPFORJA_PREVIAS` | 30 |
| `OPFORJA_PREVIAS_MIN` | 10 |
| `OPFORJA_WEB` | `./web` |

### 8.1 Rutas HTTP exactas — CONTRATO

Formato común de todas las respuestas:

- Las respuestas JSON llevan `Content-Type: application/json; charset=utf-8` y `Cache-Control:
  no-store`.
- **Toda** respuesta lleva `X-Opforja-Version: <OPFORJA_VERSION>`.
- Un error se responde como `{ "error": string, "detalle"?: unknown, "informe"?: Informe }`.

En la columna Auth, **sesión** es una cookie válida **o** `Authorization: Bearer <OPFORJA_TOKEN>`
(§8.2). «+ CSRF» aplica solo a la cookie. Esta API, junto con el JSON v0, es el **contrato externo
completo** (DECISIONS 13): no hay CLI `mesa` ni protocolo de testigo.

| Método y ruta | Auth | Petición | Respuestas |
|---|---|---|---|
| `GET /salud` | no | — | `200 {"ok":true,"version":"<sha>"}` |
| `GET /api/sesion` | sesión | — | `200 {"email"}` · `401` |
| `POST /api/sesion` | no | `{"email","clave"}` (≤ 4 KB) | `204` + `Set-Cookie` · `401 {"error":"Credenciales inválidas"}` · `429 {"error":"Demasiados intentos","reintentarEn":s}` |
| `DELETE /api/sesion` | cookie + CSRF | — | `204` (borra la cookie); con Bearer ⇒ `400` |
| `GET /api/modelos` | sesión | — | `200 {"modelos":[{"id","nombre","modificado","rev","bytes","cosas","opds"}]}` (por `modificado` desc) |
| `POST /api/modelos` | sesión + CSRF | cuerpo = documento v0; `?aceptarPerdidas=1` opcional | `201 {"id","rev","canonicalizado"?,"informe"?}` · `400 {"error":"Documento inválido","informe"}` (rechazos) · `409` (id existe) · `413` · `422 {"error":"El documento pierde información al importarse","informe"}` · `507` (>2 000 modelos) |
| `GET /api/modelos/:id` | sesión | `?descargar=1` opcional | `200` cuerpo = documento + `ETag: "<rev>"`; con `descargar=1` además `Content-Disposition: attachment; filename="<nombre saneado>.opforja.json"` · `404` |
| `PUT /api/modelos/:id` | sesión + CSRF | `If-Match: "<rev>"` obligatoria; cuerpo = documento con `modelo.id === :id`; `?aceptarPerdidas=1`, `?respaldo=1` opcionales | `200 {"rev","canonicalizado"?,"informe"?}` · `400` · `404` · `412 {"error":"Revisión desactualizada","rev":"<actual>"}` · `413` · `422` · `428` (sin If-Match) |
| `DELETE /api/modelos/:id` | sesión + CSRF | `If-Match` opcional | `204` (a papelera) · `404` · `412` |
| `GET /api/papelera` | sesión | — | `200 {"entradas":[{"entrada","id","nombre","eliminado","motivo":"eliminado"|"reemplazado"}]}` |
| `POST /api/papelera/:entrada/restaurar` | sesión + CSRF | — | `201 {"id","rev","canonicalizado"?,"informe"?}` (con id ocupado se asigna `m-…` nuevo y se reescribe `modelo.id`) · `400` (rechazos con informe, o límite de nombre) · `404` · `413` · `422` (pérdidas, con informe; conserva la entrada) · `507` |
| `DELETE /api/papelera/:entrada` | sesión + CSRF | — | `204` (definitivo) |
| `GET /*` | no | — | estáticos de `OPFORJA_WEB`; toda ruta sin extensión da `index.html` (`no-store`); `/assets/*` inmutables por 1 año |

Reglas de las rutas:

- **`rev`** es el SHA-256 hexadecimal del texto almacenado: CAS por contenido, sin contadores.
- **Ids de modelo** (CC-16): `:id` y `modelo.id` deben cumplir `ID_MODELO` (§3.3); un `:id` que no
  la cumple da `404` sin tocar el disco, y un `POST` cuyo `modelo.id` no la cumple da `400`. Así
  ninguna ruta escapa de `modelos/` ni choca con los temporales `.tmp-*`.
- **El almacén solo guarda documentos canónicos**. Un cuerpo recibido se trata así:
  1. Si `leerCanonico` lo acepta, se guardan los bytes recibidos. Es el camino del cliente web, que
     siempre envía `exportarV0`.
  2. Si no, pasa por `importarV0`:
     - con `rechazos`, responde `400`;
     - con `descartado` no vacío, responde `422` con el informe, salvo `?aceptarPerdidas=1`;
     - en otro caso, guarda `exportarV0(modelo)` y responde con `"canonicalizado": true`, la `rev`
       de lo guardado y el informe.

  Así un agente externo con el token puede escribir un v0 válido sin reproducir el formateo exacto,
  y ninguna pérdida ocurre en silencio (DECISIONS 12–13). Los errores de canon (diagnóstico) **no**
  impiden guardar (T-288).
- **Restaurar papelera** importa el texto original antes de exportarlo. Con `rechazos` responde
  400; con `descartado` no vacío responde 422. En ambos casos devuelve el Informe completo y
  conserva la entrada original intacta (bytes, nombre y fecha), sin instalar un modelo ni crear
  respaldo. Esta ruta no admite `aceptarPerdidas`: recuperar un original con descartes exige el
  procedimiento operativo y el flujo de importación ya previsto. Si no hay rechazos ni descartes,
  restaura canónico; si la fuente no pasaba `leerCanonico`, responde con `canonicalizado: true`
  y su Informe original completo, incluida visibilidad, y conserva los bytes exactos como
  respaldo `motivo:"reemplazado"` con la retención de 30 días de §8.3. Ese respaldo queda durable
  antes de retirar la entrada fuente; ningún fallo elimina la única copia original. Restaurar
  una fuente canónica mantiene el flujo actual, incluida la reescritura de id ocupado. El mutex
  de entrada, el de id y el cupo coordinado siguen aplicando; no se promete una transacción
  multidirectorio ni se ocultan errores de escritura. Los nombres de respaldo se coordinan con
  todos los productores de papelera para no sobrescribir originales. Los límites comunes de
  tamaño, nombre y cupo se comprueban sobre el candidato canónico a instalar: nombre > 200
  caracteres da 400 con error e Informe original cuando haya recanonicalización, sin inventar
  un rechazo del códec. Los errores 400/413/507 por límites no instalan un modelo ni retiran la
  entrada fuente. Esto no añade un límite al tamaño del histórico que CC-14 permite leer.
- **`?respaldo=1`** (conflicto «Conservar mis cambios», §8.4). Dentro del mutex, antes de escribir,
  mueve el archivo vigente a la papelera con `motivo:"reemplazado"`.
- **Renombrar** desde la Biblioteca no tiene ruta propia: es `GET`, `renombrarModelo`, `exportarV0`
  y `PUT` con `If-Match`. Hay una sola vía de escritura.
- **Límites**: cuerpo ≤ 25 MB (`413`); ≤ 2 000 modelos (`507`); nombre de modelo ≤ 200
  caracteres.
- **Seguridad**. Todas las respuestas llevan estas cabeceras (HSTS lo pone Traefik):
  - `Content-Security-Policy: default-src 'self'; img-src 'self' data: blob:; style-src 'self';
    font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors
    'none'`;
  - `X-Content-Type-Options: nosniff`;
  - `Referrer-Policy: no-referrer`;
  - una `Permissions-Policy` restrictiva.

### 8.2 Autenticación de una cuenta

- **Cuenta**: `/datos/cuenta.json` = `{"email", "hashClave", "versionCredencial"}`. `hashClave` usa
  el formato `scrypt$16384$8$1$<sal>$<hash>`, porte exacto de `passwordHash.ts`, así que la
  migración copia el hash actual sin pedir la clave.
- **CLI** (`servidor/cuenta.ts`, en el contenedor):
  - `bun servidor/cuenta.js crear <email>` pide la clave dos veces por stdin (≥ 10 caracteres) y
    falla si ya existe una cuenta;
  - `clave` cambia la clave y sube `versionCredencial`, lo que cierra las sesiones;
  - `cerrar-sesiones` sube `versionCredencial`.

  Todas aceptan `--datos <dir>`.
- **Sesión**: la cookie es `opforja_sesion=<b64url({"v":versionCredencial,"exp":epoch})>.<b64url(HMAC-SHA256)>`,
  con `HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000` (30 días; `Secure` se omite solo
  en `localhost`). Se verifica en tiempo constante; un `v` distinto del de la cuenta da 401.
- **Login**: siempre se verifica contra un hash, el de la cuenta o un señuelo, para igualar el
  costo, y la respuesta es uniforme. Cinco fallos por IP (según `X-Forwarded-For` de Traefik) en 15
  min dan 429 por 15 min; 20 fallos globales en 15 min dan 429 global.
- **CSRF**: toda petición que muta **con cookie** exige la cabecera `X-Opforja: 1`. Si viene
  `Origin`, debe coincidir con el host; si no, 403.
- **Token Bearer opcional** (DECISIONS 13):
  - Sin `OPFORJA_TOKEN`, toda cabecera `Authorization` da 401.
  - Si existe, se compara con `timingSafeEqual(sha256(t), sha256(OPFORJA_TOKEN))`.
  - Un token válido actúa como la cuenta en `/api/modelos*` y `/api/papelera*`, sin CSRF porque no
    es una credencial ambiente.
  - No sirve para `/api/sesion` ni para cambiar la clave.
  - Los fallos cuentan para el límite de intentos.
  - En el log se registra `auth:"bearer"`, nunca el token.

### 8.3 Almacenamiento en archivos (`servidor/almacen.ts`)

```
/datos/                                   (volumen Docker opforja-datos)
├── cuenta.json
├── modelos/<id>.json                     documento canónico v0 (nombre de archivo == modelo.id)
├── previas/<id>/<ISO-8601>--<rev8>.json  copias previas rotadas (sin UI, DECISIONS 6)
├── papelera/<id>--<ISO-8601>--<motivo>.json   eliminados y reemplazados (purga > 30 días, al arrancar y cada 24 h)
└── archivo/                              migración (§8.6) e inválidos; no lo lee la app
```

- **Escritura atómica**: `modelos/.tmp-<id>-<aleatorio>`, luego `write` + `fsync`, `rename` sobre
  `<id>.json` y `fsync` del directorio. Nunca queda un archivo a medias.
- **CAS**: bajo un mutex por id (cadena de promesas; hay un solo proceso) se lee, se calcula la
  `rev` vigente, se compara con `If-Match` y se escribe. Si difiere, 412 con la `rev` vigente.
- **Copias previas** (DECISIONS 6):
  - Dentro del mismo mutex y **antes** del `rename`, si la copia más reciente de `previas/<id>/`
    tiene más de `OPFORJA_PREVIAS_MIN` minutos (o no existe), el archivo vigente se enlaza con
    `link` (o `copyFile` si falla) como `previas/<id>/<fecha>--<rev8>.json`.
  - Se conservan las `OPFORJA_PREVIAS` más recientes y se borran las demás en la misma operación.
  - 30 copias con 10 min entre ellas cubren ≥ 5 h de edición continua y, con pausas, días.
  - Para recuperar una (`docs/operacion.md`): `docker cp` y luego **Importar** en la Biblioteca, que
    crea un modelo nuevo, o `PUT` con el token.
- **Índice**: vive en memoria y se construye al arrancar, parseando cada `modelos/*.json` con
  `importarV0` y contando con `resumen` (§3.4.1). Se actualiza en cada escritura. Solo se mueve a
  `archivo/invalidos/` (y se registra) un archivo que no pasa `JSON.parse` o da `ok: false`; uno
  legible que ya no es punto fijo del códec vigente se sigue sirviendo tal cual (§3.4.4, CC-14).
- **Log**: una línea JSON por petición (`metodo`, `ruta` sin cuerpo, `estado`, `ms`, `auth`) y por
  evento de almacén. Nunca contiene contenido de modelos, claves ni tokens.

### 8.4 Cliente: autoguardado, borrador y conflictos (`editor/guardado.ts`)

- **Autoguardado**. Cada commit:
  - marca «Cambios sin guardar»;
  - escribe el **borrador** en IndexedDB (`opforja/borradores/<id>` = `{base: rev, texto, fecha}`,
    a lo sumo cada 500 ms, con try/catch; si no hay IndexedDB, queda solo en memoria);
  - programa el guardado a 1,5 s del último cambio, con a lo sumo 10 s de edición continua sin
    guardar.
- **Guardar** es un `PUT` con `If-Match: rev` y el cuerpo `exportarV0(modelo)`. Si tiene éxito, se
  toma la `rev` nueva, se borra el borrador si coincide con lo guardado y el indicador pasa a
  «Guardado». Hay un solo guardado en curso; los cambios intermedios se acumulan para el siguiente.
- **Red caída o 5xx**: «Sin conexión». Se reintenta con espera exponencial de 2 s a 60 s, y el
  borrador conserva todo. `beforeunload` avisa si hay cambios sin subir.
- **401**: «Sesión vencida». El lienzo pasa a `navegacion` y se abre el diálogo de reingreso. Tras
  entrar, se reintenta el guardado pendiente.
- **412**: «Conflicto». Se detiene el autoguardado, el lienzo pasa a `navegacion` y se abre la
  Decisión:
  - **Conservar mis cambios**: `PUT` con la `rev` recibida en el 412 y `?respaldo=1`. La versión del
    servidor va a la papelera.
  - **Usar la versión guardada**: `POST` del documento local con un id nuevo y el nombre «<nombre>
    (copia hh:mm)», y luego `GET` de la versión del servidor, que queda abierta.
- **Versión nueva**: si `X-Opforja-Version` difiere de la versión del bundle, o si una respuesta
  trae `canonicalizado: true`, el indicador pasa a «Versión nueva: recarga». El autoguardado sigue;
  tras un `canonicalizado`, el cliente relee con `GET` para alinear `rev` y texto. Recargar no pierde
  nada, porque hay borrador.
- **Al abrir**: `GET` + `importarV0` (no `leerCanonico`: un archivo escrito por una versión anterior
  del códec debe abrirse igual; §3.4.4, CC-14).
  - Si el documento no es canónico y el informe no tiene `descartado`, abre y marca «Cambios sin
    guardar». Si tiene `descartado`, muestra antes el Informe de importación con «Abrir de todos
    modos», y el primer guardado va con `?respaldo=1` (el original queda en la papelera).
  - Si hay un borrador con `base === rev` y texto distinto, aparece la Decisión «Recuperar cambios de
    este navegador».
  - Si `base ≠ rev`, la misma Decisión avisa que el servidor cambió; recuperar equivale a
    «Conservar mis cambios».
- **Otras respuestas al guardar** (CC-15; ninguna pierde el borrador):
  - **404** (el modelo se eliminó en otra sesión): se detiene el autoguardado y la Decisión «Este
    modelo se eliminó en otra sesión» ofrece [Guardarlo de nuevo] (`POST` con el mismo id si está
    libre; si no, con un `m-…` nuevo) y [Descargar JSON].
  - **400, 413 o 422** (no deberían ocurrir con `exportarV0`, pero un bug o el límite de 25 MB los
    produce): el indicador pasa a «No se pudo guardar», se detiene el autoguardado y la franja
    muestra el `error` con [Descargar JSON] y [Reintentar].
- **Salir del modelo** (≡ Biblioteca, abrir otro, Salir o cerrar sesión) con cambios pendientes
  ejecuta primero `guardarAhora`. Si falla, la Decisión ofrece [Reintentar], [Descargar JSON] y
  [Salir de todos modos] (los cambios quedan en el borrador de este navegador y se ofrecen al
  reabrir). La Biblioteca marca «cambios sin subir» en la fila que tiene borrador.
- Hay un solo modelo abierto por pestaña; las pestañas concurrentes quedan protegidas por el CAS.

### 8.5 Límites de tamaño y rendimiento

El documento pesa ≤ 25 MB; el modelo HODOM de referencia pesa < 1 MB. Los presupuestos de cómputo
están en §2.4 y los verifica `rendimiento.test.ts`.

### 8.6 Migración única desde PostgreSQL (`herramientas/migrar-postgres.ts`)

Uso, dentro de la imagen nueva y conectada a la red del stack viejo:

```
bun servidor/migrar-postgres.js --url <DATABASE_URL> [--email <correo>] [--datos /datos] [--ensayo --salida <dir>] [--reemplazar]
bun servidor/migrar-postgres.js --verificar [--datos /datos]
```

`--verificar` relee cada `modelos/*.json` con `leerCanonico` y termina con código ≠ 0 si alguno
falla. El script vive en `herramientas/` y no en `servidor/` porque usa `diagnosticar` de `nucleo/`
para el informe; así `servidor/` depende solo de `codec/` (§2.2, CC-19). En la imagen se compila a
`servidor/migrar-postgres.js` (§9.1), así que los comandos no cambian. Usa el cliente PostgreSQL
integrado de Bun (`import { SQL } from "bun"`), sin
dependencias. La lectura va detrás de la interfaz
`FuenteLegada { cuentas(); tenants(accountId); indices(tenants); modelos(tenants); autosaves(tenants); versiones(tenants) }`,
inyectable en pruebas con filas falsas.

1. **Cuenta**: `SELECT id, email, password_hash FROM opforja_accounts` (si hay varias, exige
   `--email`), y los tenants con `SELECT tenant_id FROM opforja_account_tenants WHERE account_id =
   $1`. Escribe `cuenta.json` con el mismo hash y `versionCredencial: 1`.
2. **Índice viejo**: `SELECT indice FROM opforja_workspaces WHERE tenant_id = ANY($1)`. Da las
   carpetas y los flags `esApunte`, `esBiblioteca` y `archivado`, solo para el informe.
3. **Modelos**:
   - `SELECT id, nombre, carpeta_id, actualizado_en, archivado, revision, payload::text FROM
     opforja_models WHERE tenant_id = ANY($1)`;
   - autosaves: `SELECT modelo_id, creado_en, payload::text FROM opforja_model_autosaves WHERE
     tenant_id = ANY($1)`.

   La fuente de cada modelo es el autosave si `creado_en > actualizado_en` (ley v0 del testigo); si
   no, el guardado. El otro va a `archivo/…/originales/`.
4. **Por modelo**:
   - se aplica `importarV0(fuente)`;
   - `modelo.id` pasa a ser el id del registro saneado a `ID_MODELO` (§3.3) y `modelo.nombre`, el
     `nombre` del registro (si difiere del payload, se informa). La PK vieja es `(tenant_id, id)`: si
     dos tenants de la cuenta traen el mismo id, el segundo recibe un `m-…` nuevo y el informe lo
     registra (nunca se sobrescribe un archivo, CC-17);
   - se escribe `modelos/<id>.json` con `exportarV0`, o `papelera/` si estaba `archivado`;
   - un rechazo va a `archivo/…/rechazados/<id>.json` (el payload original), con las causas en el
     informe;
   - el payload original se copia siempre a `archivo/…/originales/<id>.json`.

   Los nombres **no se tocan** (DS-7).
5. **Versiones**: `SELECT modelo_id, id, nombre, creado_en, payload::text FROM
   opforja_model_versions WHERE tenant_id = ANY($1)` se copia tal cual a
   `archivo/…/versiones/<modelo>/<id>.json` (recuperable a mano).
6. **Informes** (DECISIONS 12). Por modelo, `archivo/migracion-<fecha>/informes/<id>.md` contiene:
   - el nombre, la carpeta y la especie viejas;
   - la fuente usada (guardado o autosave) y los conteos antes y después (cosas, estados, enlaces,
     abanicos, OPDs);
   - el `Informe` completo del códec, incluido el **diff de visibilidad por OPD** (§8-21);
   - los **errores de canon cargados**, por código (`diagnosticar`, T-288), con sus reparaciones
     sugeridas.

   El índice `archivo/migracion-<fecha>/INFORME.md` tiene los totales, una tabla de modelos con
   enlace a su informe y los rechazados. `--ensayo` escribe lo mismo en `--salida` sin tocar
   `modelos/`.
7. Las tablas del agente, de la revisión compartida y de la captura de bugs no se migran; quedan
   intactas en el volumen PostgreSQL.
8. Seguridad: el script se niega a escribir si `modelos/` no está vacío (salvo `--reemplazar`) y
   solo ejecuta `SELECT`.

### 8.7 Respaldo

`deploy/respaldo.sh` ejecuta, con `umask 077`:

```
docker run --rm -v opforja-datos:/datos:ro -v "$DESTINO":/respaldo alpine tar czf /respaldo/opforja-$(date +%F).tgz -C /datos .
```

La retención es de 14 días. El temporizador systemd corre a diario a las 03:30
(`deploy/systemd/opforja-respaldo.timer`, con `Environment=OPFORJA_REPO=`). Restaurar es detener,
hacer `tar xzf` en el volumen y arrancar. Los archivos son JSON legibles, así que un modelo también
se recupera a mano.

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
RUN bun run build          # vite build ⇒ dist/ (versión incrustada) ; bun build servidor/*.ts ⇒ dist-servidor/

FROM oven/bun:1.3-slim
WORKDIR /opt/opforja
COPY --from=construccion /src/app/dist ./web
COPY --from=construccion /src/app/dist-servidor ./servidor
ARG OPFORJA_VERSION=local
ENV OPFORJA_DATOS=/datos OPFORJA_WEB=/opt/opforja/web PORT=8080 NODE_ENV=production OPFORJA_VERSION=$OPFORJA_VERSION
RUN mkdir -p /datos && chown bun:bun /datos
USER bun
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD bun -e "fetch('http://127.0.0.1:8080/salud').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"
CMD ["bun", "servidor/principal.js"]
```

`bun run build` ejecuta `vite build && bun build servidor/principal.ts servidor/cuenta.ts
herramientas/migrar-postgres.ts --target=bun --outdir dist-servidor --entry-naming '[name].js'`. La imagen de ejecución no contiene
fuentes, pruebas ni `node_modules`.

### 9.2 `docker-compose.yml`

```yaml
services:
  opforja:
    build: { context: ., args: { OPFORJA_VERSION: "${OPFORJA_BUILD:-local}" } }
    image: opforja:latest
    container_name: opforja
    restart: unless-stopped
    environment:
      OPFORJA_SECRETO: ${OPFORJA_SECRETO:?OPFORJA_SECRETO requerido (.env junto al compose)}
      OPFORJA_TOKEN: ${OPFORJA_TOKEN:-}
    volumes: [ "opforja-datos:/datos" ]
    networks: [ web ]
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
volumes: { opforja-datos: { name: opforja-datos } }
networks: { web: { external: true } }
```

Un servicio y un volumen. Su nombre físico es `opforja-datos`, el mismo del respaldo (§8.7)
y la migración (§9.4), sin prefijo de proyecto Compose. Las demás cabeceras las pone el servidor:
una sola fuente, probada en `principal.test.ts`.

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
`opforja-postgres`, `opforja-bug-capture`) sin tocar los volúmenes. `deploy/deploy.test.ts`, con
stubs de `git`, `docker` y `curl`, verifica el circuito: `--wait`, la versión en `/salud`, el 401 en
`/api/sesion` y la marca `-dirty`.

### 9.4 Transición desde el stack actual (solo con autorización explícita)

Precondiciones: el commit nuevo está en `main` y el `.env` tiene `OPFORJA_SECRETO`.

1. **Congelar**: avisar al operador y no editar en la instancia vieja. Antes, en la instancia vieja,
   **vaciar el carril local-first** (CC-17): el repositorio IndexedDB `opforja-local` del navegador
   puede tener documentos en `saved-here` o `conflict` que nunca llegaron a PostgreSQL, y la
   migración solo lee PostgreSQL. El operador sincroniza cada documento pendiente o descarga su JSON
   de recuperación (`opforja.local-recovery.v1`), que el importador nuevo acepta (§3.4.2-1). La
   transición no avanza mientras algún documento viejo muestre un estado distinto de
   «Sincronizado».
2. **Respaldo PostgreSQL**, con el script viejo, desde el tag anterior:
   `git worktree add ../opforja-viejo pre-rehacer && ../opforja-viejo/deploy/backup-opforja-db.sh`.
3. **Construir** sin arrancar: `OPFORJA_BUILD=$(git rev-parse --short HEAD) docker compose build`.
4. **Ensayo de migración** contra el PostgreSQL vivo:
   `docker run --rm --network deep-opm-pro_opforja-internal -v "$PWD/ensayo":/ensayo opforja:latest
   bun servidor/migrar-postgres.js --url postgres://opforja:$OPFORJA_DB_PASSWORD@postgres:5432/opforja
   --ensayo --salida /ensayo`.

   El operador revisa el `INFORME.md`: descartados, rechazados, errores de canon cargados y diff de
   visibilidad.
5. **Migración real**: el mismo comando con `-v opforja-datos:/datos` y sin `--ensayo`. Luego
   `--verificar` debe terminar sin errores.
6. **Desplegar**: `./deploy/deploy.sh`. La prueba de humo es humana: entrar, abrir tres modelos
   grandes, comparar los conteos con el informe, editar y ver «Guardado».
7. El volumen `opforja-postgres-data` **se conserva sin montar**: no se ejecuta `down -v` ni
   `volume rm`. Se retira solo por decisión del dueño.

**Rollback**: `git checkout pre-rehacer && ./deploy/deploy.sh` levanta el stack viejo con su volumen
intacto. Los cambios hechos en la versión nueva se llevan exportando el JSON. El importador viejo
rechaza la multiplicidad `?`, los objetos con un solo estado, la especialización de estado, los
enlaces sin aparición, el agente desde objeto informacional y el manejador sistémico, y descarta en
silencio `duracion`, `unidadTiempo`, `genero` y `coleccionIncompleta` (las cotas de excepción sí
viajan, porque el export también las escribe en el enlace, §3.4.3); todo eso se documenta en
`docs/operacion.md` (CC-13).

---

## 10. Verificación

### 10.1 Pirámide y comandos (`app/package.json`)

| Comando (desde `app/`) | Qué corre | Tiempo objetivo |
|---|---|---|
| `bun run check` (por defecto, AGENTS.md) | `tsc --noEmit -p .` (src, servidor, e2e, herramientas; estricto) **y** `bun test src servidor herramientas` (núcleo, códec, OPL, OPD con golden, editor, servidor, migración, arquitectura, rendimiento) | < 45 s |
| `bun run e2e` | `bun run build` y Playwright contra el servidor real, con un directorio de datos temporal | < 4 min |
| `bun run build` | `vite build` y `bun build` del servidor | < 30 s |
| `bun run golden` | reescribe `opd/__golden__/*.svg` (`OPFORJA_GOLDEN=escribir bun test src/opd/golden.test.ts`); solo tras revisión visual | < 5 s |
| `bun run dev` | `bun herramientas/dev.ts` | — |
| `bun test ../deploy` | `deploy.test.ts`, solo al tocar `deploy/` | < 5 s |

Convenciones de las pruebas:

- No hay estado global de módulo: todo se crea por fábrica (`crearAlmacen()`, `crearCliente(fetch)`,
  `crearEditor(dep)`).
- Cada prueba construye su modelo con `pruebas/constructores.ts`, por ejemplo
  `modeloCon({objetos:[['Alfa',['uno','dos']]], procesos:['Beta'], enlaces:[['consumo','Alfa','Beta']]})`,
  y usa `must()` y `porNombre()`. Los constructores escriben el `Modelo` literal, **sin pasar por las
  operaciones**, así que el códec, el OPL, el OPD y la proyección se prueban sin depender de WP-3.
- **El título de cada prueba que verifica un requisito empieza por su T-ID.**
- Cada ley lleva su **control de no tautología**: un mutante que debe ponerla roja.
- `validarForma` corre en el `afterEach` de las suites del núcleo.
- Los modelos de entrada se congelan en profundidad (`Object.freeze`) para probar la pureza.

Gates del Anexo A (T-303) y sus suites:

| Gate | Suites |
|---|---|
| Identidad | codec, forma |
| Firma | matriz |
| Estado | estados, forma |
| OPL | generar, roundtrip-* |
| Parseo | analizar, editor-opl |
| Modificadores | matriz, roundtrip-matriz |
| Refinamiento | refinamiento, proyeccion, frontera |
| Distribución | refinamiento |
| UI | exportar, golden, e2e 18–19 |
| Export | exportar |
| Deuda | revisión del diff de `docs/conformidad.md`, §1.5 |
| Vistas | no aplica: no hay vistas tipificadas; se registra en B-16 |

### 10.2 Núcleo y matriz

- `matriz.test.ts`:
  - Compara `MATRIZ` y `REGLAS_CONTEXTO` con **`pruebas/expectativas-matriz.ts`**, una tabla
    transcrita a mano desde CANON §2.1/§2.2 e independiente del código. Así la enumeración de §5.9,
    que se deriva de la matriz, no es la única red.
  - Casos legal/ilegal por fila y por regla transversal: los AP aplicables; la unicidad con lectura
    distributiva (T-053, sondas 7/10); el contorno (T-060, sonda 9); la doble vara; AP-27 como
    bloqueo y como advertencia; `NO_OFRECIDO` (cada fila rechazada por la operación y no ofrecida
    por `tiposLegales`).
  - Un manejador sistémico **no** se rechaza (T-268).
- `propiedades.test.ts`:
  - Sobre todos los pares de extremos, incluidos estados, de 3 modelos de muestra y 50 de `azar`,
    con datos de etiquetas completos: **`tiposLegales` ofrece `legal:true` exactamente cuando
    `crearEnlace` acepta esa intención por su resultado efectivo**. Las pendientes no contienen
    candidato; se completan y se reevalúan. Las alternativas se prueban con su acción y opciones
    específicas, incluido `abanicoCon`. WP-3b cubre modelos sin refinamientos y WP-4r añade la
    integración refinada; hasta entonces B-28 declara el límite WP-2/H1.
  - Vacíos/null/léxico inválido requeridos se rechazan; ausencia produce pendiente sin consumir
    ids/mutar, completación conserva F-11 y B-05, igualdad válida normaliza con R-STRE-1.
    La integración refinada cubre 0/1/≥2 subprocesos, TS3 con/sin control/en abanico, evento
    sistémico, recursión, aparición externa, colisión final, rollback y DS-20 contra el original.
- `secuencias.test.ts` (WP-4r, porque usa todas las operaciones, CC-23): invariantes tras secuencias
  aleatorias, 200 semillas × 40 acciones de `azar.acciones(m)`; después de cada paso,
  `validarForma` es vacía, no hay errores de contexto nuevos (DS-20) y la entrada no mutó.
- `forma.test.ts`: cada invariante F-1…F-13, violada, da la violación esperada.
- `cosas.test.ts`, `estados.test.ts`, `enlaces.test.ts`, `abanicos.test.ts`: para cada operación de
  §4.2, el éxito, el rechazo con su código y regla, las trazas, la identidad de los ids y un paso de
  deshacer. En particular:
  - T-062: nada nace sin nombre.
  - T-063: `cambiarTipoCosa`.
  - T-248, T-251, T-252: traer, quitar la última aparición (la cosa sigue), eliminar con
    refinamiento (`tiene-refinamiento`, T-083).
  - La selección múltiple con n ids.
  - `reanclarExtremo` de cada familia, incluido el cambio T1→TS1.
  - `eliminarEstado`, que pierde el anclaje.
- `refinamiento.test.ts`:
  - `descomponer`: externos copiados, contenedor, R-HIJO-5, ciclo, objeto rechazado.
  - La tabla §4.5.3 fila por fila con |S| = 0, 1 y ≥2, incluida **la fila DS-4** (TS3 con `c` y TS3
    en abanico migran enteros), el enlace tardío recursivo, la escisión con sus ids (T-074, T-075),
    `moverSubproceso` y `fijarBandas` sin migración.
  - `desplegar` por modo (R-HIJO-4).
  - `eliminarRefinamiento`: hoja, materialización, cascada de internos, `precedencia-invalida` no
    materializada.
  - El rebote del externo (T-081).
- `proyeccion.test.ts`: la visibilidad en raíz, descomposición y despliegue; la abstracción; **los
  12 niveles de fuerza y las 9 celdas de la matriz 3×3** (SYNTHESIS §8-4); la fusión de efectos por
  banda; R-VIS-HIJO-1 con el desvío DR-13; el abanico colapsado; los estados anclados siempre
  visibles; las etiquetas `SDx.y` y su mutación al eliminar un hermano.
- `frontera.test.ts` (T-089): la ley de firma de frontera, con implementación independiente y
  mutantes.
- `diagnostico.test.ts`: cada código del catálogo con un caso positivo y uno negativo; los gates
  (incluido el de `canon-documento` por `cosa-sin-aparicion`/`enlace-sin-vista`, B-26).
- `reparaciones.test.ts` (WP-4r, CC-23): cada reparación aplicada deja el diagnóstico resuelto.
- `lexico.test.ts`, `herencia.test.ts` y `rendimiento.test.ts` (§2.4, falla a 3×; es de WP-10 porque mide también OPL, códec y escena, CC-23).

### 10.3 OPL

- `vocabulario.test.ts`:
  - el vocabulario cerrado coincide con los literales de `PLANTILLAS`;
  - `y/e` y `o/u` (`Ignacio`, `hielo`, `Hierro`, `oro`, `hora`);
  - listas sin coma de Oxford;
  - frases de multiplicidad por género;
  - unidades en singular y plural.
- `plantillas.test.ts`: `hacia(desde(h))` es la identidad por plantilla y opción; cada
  `MATRIZ[t].plantillas` existe; RF2b sin coma se genera, y ambas formas se parsean.
- `generar.test.ts`:
  - el orden de secciones y los empates (DS-1) y la mención mínima (DS-2);
  - D6, D10 en una oración, IV2 sin demora (T-116);
  - CX1 solo en el hijo, con coma (T-125); CX3 con `SDx en` (T-126);
  - la agrupación estructural solo fuera de los hijos; RFE; SE3 en dos líneas;
  - CX con `así como`; el plegado del padre;
  - tokens, refs e ids de línea estables;
  - el display `siempre`/`oculta` sin tocar el canónico (T-139);
  - abanico con ruta como una oración por enlace;
  - FAN5A que falla cerrado sin `throw`.
- `analizar.test.ts`:
  - la normalización, los spans y el sufijo ` proceso`;
  - el plegado de multiplicidad y de estados; las listas mixtas de CX;
  - el residual SE1 y `Current`;
  - cada fila de `NO_SOPORTADAS` da `unsupported-canonical` sin mutar, y cada una de
    `NO_CANONIZADAS`, `non-canonical`;
  - D1–D4, ENT3, COND-ALT, TS4/TS5 standalone y FAN-5B.
- `editor-opl.test.ts`:
  - los 4 estados con su precedencia, las 8 razones y el resumen con el rótulo del botón;
  - el todo-o-nada con abortos a mitad; las 3 fases; el ensayo que excluye líneas fallidas;
  - la creación idempotente; `no-delete-by-absence`; la vista previa pura; reordenar líneas;
  - la línea abstraída del padre como sin-cambio (T-168); `SDx.y` resuelto al id; DR-35;
  - el par SE3; la tipografía contradictoria (T-158); `sincronizar-estados` con D6 y D5;
  - la ley de deshacer atómico.
- `roundtrip-matriz.test.ts`, `roundtrip-azar.test.ts`, `roundtrip-tabla92.test.ts`,
  `roundtrip-modelos.test.ts`, `composicion.test.ts` y `lente.test.ts` (§5.9).

### 10.4 Códec (`app/fixtures/v0/*.json`, antes `fixtures/demo-models`)

- `codec.test.ts`: una prueba por regla de §3.4.2 con un documento mínimo. El corpus se porta de
  `pre-rehacer:app/src/serializacion/json*.test.ts`. Cubre:
  - extremos `string` y objeto; estado como extremo en cada tipo;
  - TS3 compacto, el par escindido, el standalone, el efecto `O→P` y el par consumo+resultado que se
    fusiona en TS3;
  - el refinamiento legacy; la descomposición de objeto que pasa a despliegue **sin crear enlaces**,
    y la que choca con un despliegue y se descarta;
  - Boceto, huérfano y vista descartados, con sus cosas conservadas y sin aparición; el recolgado de
    hijos;
  - `ordenInzoom` ausente, con bandas por geometría; los internos por contexto y por geometría; la
    aparición duplicada; el padre sin la cosa refinada;
  - el abanico con `puertoComun` y con solo `puertoEntidadId`; `O`/`XOR`; el abanico de <2 ramas; el
    enlace en dos abanicos;
  - las designaciones duplicadas y dos `default`;
  - las multiplicidades (`?`, `0..1`, `*`, `1..N`, `2..*`);
  - `modificador` y `subtipoModificador`; **la negación, que descarta el enlace entero**;
  - los `derivado` automáticos y manuales por tipo; `excepcionSubSobretiempo`; las cotas que pasan a
    duración;
  - el bidireccional con etiquetas iguales, que pasa a recíproco, y con una sola vacía;
  - **los nombres duplicados y fuera del léxico, cargados tal cual** con diagnóstico y reparación;
  - el estado de un proceso descartado; la especialización de estado cargada; el estado en
    agregación descartado solo como anclaje;
  - las referencias rotas, rechazadas con todas sus rutas; el formato distinto, rechazado; el
    registro `{json}`, el sobre de recuperación (`snapshotJson`) y el paquete portátil (digest
    correcto e incorrecto);
  - (CC-07…CC-13) `padreId` ausente, colgante, autorreferente y en ciclo, todos cargados bajo la raíz;
    el mismo id en dos colecciones, reasignado; `apariciones` como alias; `vertices`,
    `labelPositions` y `symbolAnchors` en `ignorado` (nunca «campo desconocido»); el par
    consumo+resultado con ruta, cargado sin fusionar; el par fusionado con derivados que se escinde
    con los dos ids; el `valor` sin exhibición, descartado; las cotas de excepción escritas en el
    enlace y reconocidas como derivadas.
- `codec-fijo.test.ts`: para cada fixture, el sintético y 200 modelos de `azar`, `a =
  exportarV0(importarV0(v0))` y `b = exportarV0(importarV0(a))` cumplen `a === b`. El informe de la
  segunda importación es vacío, `leerCanonico(a)` es `ok` y los conteos son coherentes con el v0 salvo
  lo informado. (La ley `exportarV0(aplicarPlan(m, vacío)) === exportarV0(m)` necesita el
  planificador y vive en `lente.test` de WP-9, CC-23.)
- `codec-derivados.test.ts`: los 23 enlaces `derivado` de los fixtures quedan normalizados; ninguno
  sobrevive; los abanicos derivados van a `ignorado` y no a `descartado` (CC-26); y el conjunto de
  hechos del SD no cambia respecto del v0.
- `codec-visibilidad.test.ts`: el diff por OPD de cada fixture (SYNTHESIS §8-21) coincide con un
  valor fijado y revisado a mano.

### 10.5 OPD

- `geometria.test.ts`: el recorte exacto en elipse y rectángulo, con los puntos sobre el borde con
  |error| < 1e-9; el peine ortogonal sin cruces propios; el rayo con `k` acotado; el lazo; el arco
  que cubre las ramas (XOR 1 arco, OR 2); las intersecciones.
- `escena.test.ts`:
  - las 8 representaciones en función de (tipo, esencia, afiliación);
  - el contorno grueso si y solo si está refinada;
  - los estados con las 4 designaciones; el chip `⋯N` con supresión global ∨ local;
  - `e`/`c`, `/` y `//`; la multiplicidad, la ruta y la duración;
  - el rótulo de instancia; un rótulo de 60 caracteres sin truncar;
  - las capas.
- `marcadores.test.ts`: los paths literales coinciden con el canon vendorizado, y se verifica la
  topología.
- `exportar.test.ts`:
  - el SVG `canon` no tiene `data-ref`, clases de `CapaUi` ni crimson;
  - los rótulos van en `#000`; el `viewBox` contiene todas las cajas;
  - `<metadata>` y `@font-face` con base64 están presentes;
  - los gates (>25, <2, error) bloquean y listan sus motivos;
  - las advertencias aparecen en casos construidos;
  - `canon-documento` es HTML autocontenido, sin recursos externos.
- `golden.test.ts` (DECISIONS 15, SYNTHESIS §8-5): 40 casos construidos, uno por elemento del
  vocabulario visual cerrado y por combinación delicada, más el SD y un OPD profundo de cada fixture.
  - Cada caso compara byte a byte `aTexto(dibujar(escena(m, opd), 'canon'))` contra
    `opd/__golden__/<caso>.svg`.
  - Actualizar exige `bun run golden` y revisar visualmente cada `.svg` cambiado en el PR.
  - Son deterministas (tabla de métricas, sin DOM).

### 10.6 Editor y servidor

- `gestos.test.ts`: `reducirGesto` para crear, arrastrar, redimensionar, conectar con destinos
  legales e ilegales, el menú con alternativa, reanclar, las bandas, los nombres encadenados (un
  `gesto`) y la cámara.
- `estado.test.ts`:
  - `ejecutar` es el único commit;
  - la fusión por `gesto`; un historial de 200;
  - deshacer vuelve al OPD y a la selección;
  - `ejecutarVarias` es un paso;
  - la franja con trazas; `lineasNuevas` por id de línea.
- `guardado.test.ts`, con reloj falso:
  - el autoguardado; el 412 da conflicto, y se prueban **ambas resoluciones** (`?respaldo=1` y la
    copia nueva);
  - el 401 da sesión vencida y reintenta;
  - la red caída da sin conexión y reintenta;
  - el borrador se recupera y se descarta;
  - la cabecera de versión distinta da versión nueva;
  - (CC-14, CC-15) abrir un documento legible pero no canónico lo abre como «Cambios sin guardar», y
    uno con `descartado` muestra el informe y guarda luego con `?respaldo=1`; el 404 ofrece
    «Guardarlo de nuevo»; el 413 da «No se pudo guardar» sin perder el borrador; salir con cambios
    pendientes guarda primero y, si falla, deja el borrador.
- `comandos.test.ts`: cada comando declara su disponibilidad con motivo, y no hay atajos duplicados
  por contexto.
- `servidor/sesion.test.ts`:
  - login correcto y erróneo con respuesta uniforme; el límite de intentos;
  - la cookie adulterada, vencida o con `versionCredencial` vieja da 401; sin cabecera CSRF, 403;
  - `cuenta clave` cierra las sesiones;
  - **Bearer**: sin `OPFORJA_TOKEN` da 401; un token < 48 impide arrancar; el token correcto da
    `GET`/`PUT` sin CSRF; uno erróneo da 401 y cuenta para el límite; en `/api/sesion` no autentica;
    el log no contiene el token.
- `servidor/almacen.test.ts`:
  - la escritura atómica (con un fallo simulado entre `write` y `rename`) y el CAS con 412;
  - la papelera, `?respaldo=1` (`motivo:"reemplazado"`), la restauración con id ocupado y la purga;
    restaurar un histórico con rechazos/descartes da 400/422 con Informe completo y no cambia
    su entrada ni instala un modelo; un histórico sin descartes conserva su respaldo exacto y
    devuelve el Informe completo al recanonicalizar, incluso visibilidad y con id ocupado;
    se cubren concurrencia y fallos de escritura sin perder la última copia original;
  - el índice reconstruido; un documento no canónico da canonicalización o 422; al arrancar, un
    archivo legible pero no canónico **sigue en `modelos/`** y solo el ilegible va a
    `archivo/invalidos/` (CC-14);
  - **las copias previas**, con reloj falso: 100 PUT en 1 min dan 1 copia; un PUT cada 11 min da una
    copia por PUT, con tope 30; cada previa pasa `leerCanonico`.
- `servidor/principal.test.ts`: cada ruta de §8.1 con sus códigos; `X-Opforja-Version`; las
  cabeceras de seguridad; el SPA fallback; `/salud`; `:id` fuera de `ID_MODELO` (`..`, `.tmp-x`,
  `%2F`) da 404 sin tocar el disco y un `POST` con `modelo.id` inválido da 400 (CC-16).
- `herramientas/migrar-postgres.test.ts`, con una `FuenteLegada` falsa: la cuenta y 8 modelos (uno con
  autosave más nuevo, uno archivado, uno con Boceto, uno inválido, uno con carpeta, uno con
  `familiasEfectosPreestado`, uno con cotas de excepción y dos de tenants distintos con el mismo id,
  CC-17) producen los archivos, la papelera, los
  rechazados, las versiones y el INFORME esperados. `--ensayo` no escribe y hace falta
  `--reemplazar`.
- `arquitectura.test.ts` (§2.2). Ninguna prueba lee `docs/`.

### 10.7 E2E Playwright (26 escenarios)

Infraestructura:

- `webServer` = `bun servidor/principal.ts` con `--datos <tmp> --web dist --puerto 4173`,
  `OPFORJA_SECRETO` y `OPFORJA_TOKEN` de prueba.
- `globalSetup` crea la cuenta con `cuenta crear` y siembra modelos por la API con el token.
- Chromium de `/opt/pw-browsers` (`PLAYWRIGHT_BROWSERS_PATH`), con `@playwright/test` fijado a la
  versión cuyo `browsers.json` coincide, o `launchOptions.executablePath` desde `PW_CHROMIUM`.
- El contrato «app lista» es `document.body.dataset.listo === "1"`.
- Los localizadores van por rol y nombre accesible. El estado se lee con `GET /api/modelos/:id` y
  con el OPL visible. No se usa CSS ni `import("/src/…")`.
- Un fixture exige 0 errores de página.

| # | Escenario | Verifica |
|---|---|---|
| 1 | acceso | la clave errónea da el mensaje uniforme; la correcta lleva a la Biblioteca; salir vuelve a Acceso |
| 2 | biblioteca | nuevo con nombre abre el editor vacío; renombrar en línea se refleja en `GET`; descargar ≡ `GET`; eliminar lleva a la papelera, y restaurar lo devuelve; no hay pestañas ni carpetas |
| 3 | importar JSON | `System_Diagram.json` muestra el informe con conteos y visibilidad; la casilla de reparaciones está desmarcada; crear dibuja el OPD con N líneas de OPL; `GET` es canónico |
| 4 | crear y nombrar | `O` nombre ↵ y `P` nombre ↵; un nombre inválido se bloquea con ayuda; ⎋ no crea; una colisión ofrece «traer esa misma cosa», que crea una aparición y no una cosa |
| 5 | esencia, afiliación, métricas | física da `feDropShadow` y D1; ambiental da dash y D3; el `getBBox()` de tres rótulos queda dentro de `metricas.ts` ± 2 % |
| 6 | estados | `S` nombre ↵ crea uno; ⎋ no crea; nunca aparece `estado1`; `I`+`F` dan D10; `D` da por defecto; `H` da el chip `⋯1` y D6 |
| 7 | enlace por arrastre | el menú solo trae tipos legales, con vista previa y «N no disponibles»; consumo da `*P* consume **O**.`; agente desde informacional sale no disponible con motivo |
| 8 | segundo gesto | desde un TS4, arrastrar a otro estado ofrece «Completar cambio», que da TS3; un segundo resultado ofrece «Abanico XOR con el existente», que da un arco |
| 9 | control, etiqueta, multiplicidad | `C` en consumo da CT1; resultado sale deshabilitado con motivo; etiquetado `usa` con `M`=`+` sobre objeto femenino da `al menos una **Olla**` |
| 10 | abanico | dos consumos y `X` dan un arco y `consume exactamente uno de`; `Mayús+X` da dos arcos; disolver |
| 11 | descomponer con bandas | `D` crea el OPD hijo **sin** subprocesos; `A ↵ B ⇧↵ C ↵ D ⎋` da el CXM exacto; el consumo migra a *A*; el TS3 se escinde; en SD la línea abstraída se mantiene; **un** `Ctrl+Z` lo deshace todo; `D ⎋` da la advertencia AP-13 |
| 12 | bandas y doble vara | `]` sobre *B* cambia el OPL; una invocación *A*→*B* adyacente se rechaza como doble vara |
| 13 | desplegar | `U` agregación con dos partes da CX3 y RF1 atómicas; la colección incompleta da la barra y «y al menos otra parte» |
| 14 | navegación y cámara | árbol, ruta, ↵ entra, `Alt+↑` sube; al cambiar de OPD el bbox queda encuadrado |
| 15 | quitar ≠ eliminar | `Supr` en la última aparición deja la cosa en el modelo (`cosa-sin-aparicion`), y `Ctrl+K › Traer` la devuelve; `Mayús+Supr` en una cosa refinada se rechaza con «Elimina primero su refinamiento» |
| 16 | editar OPL | agregar `**Cliente** es físico.` da «1 aplicable»; Aplicar pone la cosa en el lienzo con la línea resaltada; reabrir da «Sin cambios aplicables»; una línea inválida muestra su razón y no bloquea las demás |
| 17 | bimodal | el hover de un token realza el elemento (atributo de realce en la capa UI) y viceversa; un clic en un token de otro bloque navega y selecciona sin cambiar la `rev` |
| 18 | diagnóstico y reparación | un proceso sin transformación da una advertencia e «Ir» lo selecciona; un modelo sembrado con dos nombres duplicados muestra «Aplicar a los N», que renombra con sufijo; el SVG no tiene marcas |
| 19 | exportar y vista canon | el SVG descargado no tiene `data-ref` ni clases UI, y sí `@font-face`; un OPD con 1 subproceso deja el ítem deshabilitado por AP-13; `F9` dibuja el mismo SVG que el export; tras «Guardado», el JSON exportado ≡ `GET`; una cosa quitada de su último OPD deshabilita `canon-documento` (B-26) |
| 20 | deshacer | aplicar un OPL con 3 cambios y deshacer vuelve al modelo previo y al OPD donde ocurrió; rehacer |
| 21 | guardado y conflicto | editar da «Guardado» y `GET` lo refleja; un PUT concurrente por la API da «Conflicto»: «Conservar mis cambios» deja la versión del servidor en la papelera, y en otra corrida «Usar la guardada» crea la «(copia …)»; la red cortada da «Sin conexión», y al recargar se recupera el borrador |
| 22 | reanclar | arrastrar el extremo de una parte a otra cosa cambia el OPL de `consta de`; arrastrar el extremo proceso de un consumo migrado a otro subproceso lo reasigna con el mismo id |
| 23 | duración y excepción | duración máx de 5 min; un sobretiempo a manejador ambiental da `excede 5 minutos`; un manejador sistémico da una advertencia |
| 24 | ancho estrecho | a 390×844, las pestañas cambian de zona, no hay desplazamiento horizontal y crear un objeto funciona |
| 25 | selección múltiple y enlaces de una cosa | `Mayús+clic` en 3 cosas y arrastrar mueve las 3, y un `Ctrl+Z` las devuelve; `Supr` da una Decisión; Propiedades lista los enlaces con sus OPDs y un clic navega |
| 26 | bimodal idempotente (SYNTHESIS §7.3) | con `System_Diagram.json` importado, en cada OPD, abrir el editor OPL sin tocar da «Sin cambios aplicables»; agregar una línea, aplicar y deshacer deja, tras el autoguardado, la `rev` original en `GET` |

---

## 11. Documentación final, canon vendorizado, registro y lista de eliminación

### 11.1 Documentos que quedan (inventario cerrado)

| Archivo | Contenido obligatorio | Líneas |
|---|---|---:|
| `README.md` | (1) qué es, en un párrafo; (2) la URL de producción; (3) correr en local: `cd app && bun install`, `bun servidor/cuenta.ts crear <correo> --datos .datos-dev` y `bun run dev`; (4) verificar: `bun run check`, `bun run e2e` y `bun run build`; (5) el mapa del repo; (6) el contrato externo: JSON v0 + API HTTP + token, con enlace a `docs/formato-v0.md`; (7) **los límites reales**: «una suite verde no equivale a validación humana del modelado», lo no cumplido está en `docs/conformidad.md` y no hay simulación | ~80 |
| `AGENTS.md` | el texto de §11.2 | ~60 |
| `CLAUDE.md` | `@AGENTS.md` (sin cambios) | 1 |
| `NOTICE.md` | el código propio está en `app/`; dependencias y licencias (Preact MIT, Inria Serif OFL-1.1, incrustada en los exports); `canon/` es obra del dueño; el material observacional de OPCloud salió del árbol pero **sigue en el historial Git** (purgarlo es decisión del dueño); no hay licencia de repositorio declarada | ~20 |
| `canon/LEEME.md` | tabla slug · versión · sha256 de `content.md` · plano de autoridad; precedencia (CANON §0.3: reglas > spec-OPD/spec-OPL > método); las URN que citan los `object.yaml` y no están aquí no son autoridad; actualizar = reemplazar la carpeta, recalcular el sha256 y revisar `especificacion.md` y `conformidad.md` en el mismo commit | ~25 |
| `docs/README.md` | tabla: usar → `guia.md`; integrar → `formato-v0.md`; operar → `operacion.md`; qué se cumple → `conformidad.md`; por qué así → `decisiones.md`; qué exige el canon → `especificacion.md`; el canon → `../canon/LEEME.md` | ~25 |
| `docs/especificacion.md` | `understand/CANON.md` tal cual, con la cabecera «Derivada de `canon/` (versiones…); ante conflicto manda `canon/`» | ~2 250 |
| `docs/conformidad.md` | tres tablas (§1.5): Brechas (§11.3), Trazabilidad ★ (§12.6) y Bisimetrías parciales (§5.9) | ~350 |
| `docs/guia.md` | §7 en prosa de uso: layout, flujos, atajos y estados; leyenda visual con los SVG de `opd/__golden__/` | ~260 |
| `docs/formato-v0.md` | §3.4 completo, más §8.1 (rutas, token, canonicalización, 422) y un ejemplo `curl -H "Authorization: Bearer $OPFORJA_TOKEN"` | ~230 |
| `docs/operacion.md` | variables; CLI de cuenta; `./deploy/deploy.sh`; respaldo y restauración; papelera; copias previas y cómo recuperarlas; migración (§8.6) y transición (§9.4); rollback; lectura del log | ~170 |
| `docs/decisiones.md` | DECISIONS (dueño, orquestador y las 24 respuestas) y DS-1…DS-25, cada una con su porqué y su requisito; las tablas de §13.1 y §13.2 (riesgos de SYNTHESIS §8 y §10.2) | ~220 |

No quedan manuales de OPM: el canon vendorizado es la referencia (SYNTHESIS C-24). Tampoco hay
índice de bugs, roadmap ni auditorías en el árbol.

### 11.2 `AGENTS.md` final (texto íntegro)

    # AGENTS.md

    ## Misión
    Construir y mantener el modelador OPM/ISO 19450 de `app/`: un solo modelo, dos expresiones
    (OPD y OPL) simétricas y persistencia fiable. Este repositorio no es fuente de modelos de dominio.

    ## Autoridad
    1. `canon/` (4 documentos vendorizados; versiones en `canon/LEEME.md`) es la autoridad OPM local.
       Precedencia: reglas > spec-OPD / spec-OPL > metodología.
    2. `docs/especificacion.md` deriva del canon (T-NNN, DR-n); `docs/decisiones.md` fija las
       decisiones del dueño y DS-n.
    3. `docs/conformidad.md` declara todo DEBE no cumplido. La brecha silenciosa está prohibida.
    No inventes reglas OPM locales. Si el canon no decide, aplica la válvula de simplicidad
    (especificación §0.5) y regístrala.

    ## Arquitectura
    - Código en `app/`. Dependencias: `nucleo → codec | opl | opd → editor → ui`; `servidor → codec`;
      `opl` y `opd` no se importan entre sí. `src/arquitectura.test.ts` lo hace cumplir.
    - La validez de enlaces vive solo en `nucleo/matriz.ts`; cada oración OPL solo en
      `opl/plantillas.ts`; toda mutación es una operación de `nucleo/operaciones.ts` y pasa por
      `editor.ejecutar`. No dupliques reglas en la UI ni en el parser.
    - Todo cambio semántico conserva el roundtrip estricto OPD↔OPL y el punto fijo del códec.
    - Vocabulario de dominio del canon en español; identificadores ASCII.
    - Prefiere el menor incremento vertical observable; no refactorices capas vecinas por conveniencia.

    ## Verificación
    Desde `app/`: `bun run check`. Añade solo lo que corresponda: el escenario e2e afectado para
    interacción; `bun run golden` y revisión visual de cada SVG cambiado para render; `bun run build`
    para empaquetado; `bun test ../deploy` al tocar `deploy/`. No declares roundtrip ni fidelidad
    visual sin observarlos. El título de cada prueba de un requisito empieza por su T-ID.

    ## Lista de cierre (reglas, Anexo A; R-ANEXO-CHECK-1)
    Todo cambio de modelado, parser, generador OPL, import/export o render canónico se revisa contra:
    - Identidad: cosa, estado, enlace y OPD con id persistente, nunca `SDx.y` ni nombre (codec, forma).
    - Firma: familia, dirección y tipos de extremos; ningún procedimental objeto-objeto, estructural
      a estado (salvo especialización de estado) ni invocación a objeto (matriz).
    - Estado: todo estado con objeto dueño; sin doble por defecto; `Current` nunca runtime (estados, forma).
    - OPL: todo hecho nuclear visible emite plantilla canónica (generar, roundtrip-*).
    - Parseo: toda oración aceptada reconstruye el mismo hecho; nunca entidades plausibles (analizar, editor-opl).
    - Modificadores: `c/e` solo en entrada canónica; nunca en resultado, estructural, invocación ni mitad escindida (matriz).
    - Refinamiento: el hijo agrega detalle y no contradice al padre; sin ciclos (refinamiento, proyeccion, frontera).
    - Distribución: consumo/resultado no quedan en el contorno; TS3 escindido salvo con control o en abanico (refinamiento).
    - Vistas: no hay vistas tipificadas en el producto (registro B-16).
    - UI: handles, overlays, guías y validación separados del canon; sin grilla (exportar, golden, e2e 18–19).
    - Export: `canon-diagrama`/`canon-documento` declarados; una captura nunca es evidencia (exportar).
    - Deuda: toda zona no canonizada queda registrada.

    ## Registro de conformidad
    Todo diff que agregue, quite o cambie una fila de `NO_OFRECIDO`, `NO_SOPORTADAS`,
    `NO_CANONIZADAS` o `CATALOGO`, o el estado de un DEBE, actualiza `docs/conformidad.md` en el
    mismo commit. Cada fila de esas tablas lleva su `registro: 'B-nn'`.

    ## Entrega
    - Revisa el diff y conserva trabajo ajeno.
    - Despliega solo con `./deploy/deploy.sh` y solo cuando la solicitud lo autorice.
    - Documenta límites reales: una suite verde no equivale a validación humana del modelado.
    - Trabajo material inconcluso: un único `HANDOFF.md` en la raíz, estable y sin fecha; elimínalo
      al cerrar. No crees `MEMORY.md`, continuidades fechadas ni archivos de sesión.

### 11.3 `docs/conformidad.md`: forma y contenido inicial de «Brechas»

La cabecera declara las versiones del canon (de `canon/LEEME.md`) y los estados admitidos (R-APP-2:
`enforzado`, `parcial`, `no implementado`, `zona laxa pendiente`). Una regla no se marca cerrada
hasta cubrir UI, núcleo, importación, generación OPL, parseo OPL y exportación aplicables (R-APP-3,
T-002). Las superficies se abrevian así: U = UI, N = núcleo, I = import, G = generación OPL, P =
parseo OPL, X = export.

| id | regla | estado | U N I G P X | qué hace el producto | decisión |
|---|---|---|---|---|---|
| B-01 | RX1/RX2 `puede ser` (R-OPL-RF-5, DR-10) | no implementado | U·P | no se ofrece; el parser responde `unsupported-canonical` sin mutar | DECISIONS 1 |
| B-02 | Descomposición de objeto (T-072, R-OPL-CX-4, DR-23) | no implementado | U·N·I·P | `descomponer` rechaza `descomposicion-objeto`; `**O** se descompone en` da `unsupported-canonical`; el import la convierte en despliegue por agregación **sin crear enlaces**, o descarta el OPD si ya hay despliegue | DECISIONS 2, DS-18 |
| B-03 | Agente humano (R-AG-1, AP-05, T-045) | parcial | N | se exige objeto físico (proxy del método); el diagnóstico info `agente-humano` pide verificar | DECISIONS 3, DR-5 |
| B-04 | Multiplicidad donde la plantilla no tiene hueco: con `c`, en efecto con estados, en SSE (T-057) | no implementado (no ofrecido) | U·N·I·P | no se ofrece, con motivo; la operación la rechaza; el import la descarta con informe; el parser responde `unsupported-canonical` | DR-44 |
| B-05 | Recíproco con estados sin etiqueta (SE5 con estado) | no implementado | U·N·I·P | no se ofrece; el import descarta los anclajes; `unsupported-canonical` | reglas §4.10 |
| B-06 | Abanico de efecto fuera de FAN-5/5A (entrada y salida variables a la vez, efectos mixtos) | no implementado | U·N·I·G·P | no se ofrece; el import descarta el abanico (conserva los enlaces) con informe | R-FAN-5/5A |
| B-07 | Ruta fuera de consumo y resultado (C-25) | no implementado | U·N·I·P | irrepresentable por tipo; el import la descarta con informe; `unsupported-canonical` | DR-19, T-058 |
| B-08 | Control en abanico sin plantilla (C-19b; C-18 de instrumento y agente) (T-056, T-124) | parcial | U·N·I·P | «Control de todas las ramas» ofrece solo las 3 combinaciones con plantilla; el import descarta el abanico (conserva los enlaces con su control) con informe | reglas §7.4 |
| B-09 | Plurales por multiplicidad (`consumen`, `generan`, DR-12) | no implementado | G·P | se genera en singular con la frase antepuesta; el plural da `unsupported-canonical` | DR-12 |
| B-10 | Participación distinta de `?`, `*`, `+` (numérica, rangos, `exactamente un`) | no implementado | I·P | el import la descarta con informe; `unsupported-canonical` | DR-21 |
| B-11 | Despliegue dedicado `se despliega por <modo> en` | no implementado | P | se genera CX3; la forma dedicada da `unsupported-canonical` | spec-OPL §7 |
| B-12 | Import con violaciones canónicas (T-288, R-ESC-OP-4) | parcial | I | lo representable se carga como `error` recuperable que bloquea el export canónico; lo no representable (estado de proceso, control en resultado, estructural a estado salvo especialización, categorías erróneas, negación) **se descarta por elemento** con informe; nunca se rechaza el documento por esto | P8, DS-19 |
| B-13 | Bisimetrías parciales (R-§19-ROT-1, T-193) | parcial (declarado) | G·P | las 10 de §5.9, con fixture no estricto por caso; se conservan en el JSON | §5.9 |
| B-14 | Heurísticas léxicas R-NOM-* y «frase breve» de R-OPL-SE-1 (T-266) | parcial | N | advertencias metodológicas por heurística (`etiqueta-larga` incluida), con falsos positivos y negativos posibles | DECISIONS 19 |
| B-15 | Cruces y oclusión (R-LAY-2, T-284) | parcial | X | advertencia por conteo en el menú antes de exportar; sin re-ruteo automático | §6.8 |
| B-16 | Extensiones con sintaxis OPL fuera de alcance (CANON §0.4): `Pr=` en abanico, m-de-f, `después de`, negadas, EX combinada, RF2o, `[etiqueta: …]`, `es de tipo`, `varía de`, `donde`, CM1–CM3, CX4–CX8, `ordenados por`, marca `ordered`, vistas tipificadas (gate «Vistas» del Anexo A) | no implementado (PUEDE) | I·P | el parser responde `unsupported-canonical`; `Pr=` fuera de abanico da `non-canonical`; el import descarta los campos con informe | CANON §0.4, DECISIONS 9 |
| B-17 | Inconsistencias inter-OPD (R-OPD-VAL-6, T-094, DEBERÍA) | parcial | N | detecta el refinador en varios contextos y el general redundante; no hay más detección inter-OPD | — |
| B-18 | Estado sin escritor con excepciones LF-19 (T-271) | parcial | N | info; se eximen los estados iniciales y los de objetos ambientales | LF-19 |
| B-19 | R-VIS-HIJO-1 (T-086 ★): en el hijo, solo enlaces que tocan el contenedor o internos | parcial | N·G·X | los procedimentales distributivos (agente, instrumento, efecto sin estado) quedan en el contorno y **se ven** en el hijo | DR-13 |
| B-20 | Duración de proceso sin excepción que la cite: sin oración OPL (R-BI-DUAL-1) | zona laxa pendiente | G·P | se dibuja en la elipse y se conserva en el JSON; no viaja por OPL | el canon no da plantilla |
| B-21 | Cinco modos visuales (T-230): modo runtime | parcial | U | edición, navegación, gestión-modal y estático realizados; runtime vacío (sin simulación) | DECISIONS 9 |
| B-22 | Gate >25 cosas (R-LAY-1, T-283 ★): exención «salvo vista tipificada o refinamiento declarado» | parcial | X | bloqueo conservador de todo OPD con >25 cosas | sin vistas tipificadas |
| B-23 | AP-14: estados duplicados para inicio/fin «DEBE bloquearse como sinónimo falso» | zona laxa pendiente | N | no es detectable mecánicamente (la sinonimia es juicio); el producto facilita D10 (inicial y final en un estado) | GAP-15 |
| B-24 | AP-22 (sinónimos) y AP-25 (proceso de soporte sin esfuerzo sostenido): «DEBE reportarse» | zona laxa pendiente | N | no detectables; la unicidad nominal cubre solo los nombres iguales | GAP-15 |
| B-25 | T-320 (Bocetos/Apunte), T-321 (coaccionar a informacional), T-323 (simulación), T-324 (extensiones) | no implementado (PUEDE / si existe) | — | fuera de alcance; T-322 (marca `×` al arrastrar) sí existe | CANON §0.4 |
| B-26 | T-100 ★ (OPL completo «cubre todo el modelo cargado») | parcial | G·X | una cosa sin aparición o un enlace sin vista (DS-6; llegan por quitar la última aparición o por import) no pertenecen a ningún bloque: se diagnostican (`cosa-sin-aparicion`, `enlace-sin-vista`), bloquean `canon-documento` y el menú avisa en «OPL Markdown»; el JSON los conserva | DS-6, CC-01 |
| B-27 | T-106 ★ / DR-2 («D2 y D4 no se emiten en canónico») frente a T-190 ★ / R-BI-DUAL-1 (un rectángulo aislado debe viajar por OPL) | parcial (desvío consciente) | G·P | el canónico emite D2 **solo** para una cosa visible que ninguna otra oración de su bloque menciona (mención mínima); nunca D4; el parser acepta D2 como mención | DS-2, CC-27 |
| B-28 | T-040 / §10.2: equivalencia menú/creación por resultado efectivo con refinamientos | parcial (integración temporal) | N·U | WP-2 comprueba matriz y datos pendientes; WP-3b comprueba creación sin refinamientos; la distribución pura compartida de consulta/creación/reparación y sus propiedades se integran en WP-4r | opción A de HANDOFF autorizada por coordinación delegada; cierre de integración refinada en WP-4r/H2, sin stubs como evidencia |

### 11.4 Lista exacta de eliminación (rama `rehacer`, WP-0)

Antes de borrar se crea el tag `pre-rehacer` sobre la base. Sirve para portar por lectura
(`git show pre-rehacer:<ruta>`) y para el rollback. Borrar del árbol no borra del historial.

| Ruta (archivos versionados) | Por qué se retira |
|---|---|
| `.codex/skills/lineas-paralelas/SKILL.md`, `.opencode/skills/lineas-paralelas/SKILL.md` | skills del proceso anterior, para otros runtimes |
| `assets/` (86), `catalog/` (2), `config/` (4), `webroot/` (2), `opm-extracted/` (457) | material observacional de OPCloud (DECISIONS 17, NOTICE) |
| `ui-forja/` (21) | gobierno visual retirado; los tokens pasan a `opd/tokens.ts` y `ui/estilos.css` |
| `fixtures/` (62) **salvo** los 6 `fixtures/demo-models/*.json` | `git mv` de esos 6 a `app/fixtures/v0/`; el resto (`*.md`, `*.opl.txt`, `empty-model/`, `meta/`, `onstar-system/`, `opm-meta-model/`, `sd-async/`, `sd-sync/`, `system-diagram/`) son capturas y derivados de OPCloud |
| `setup.sh` | regenera bundles de OPCloud |
| `tsconfig.json`, `bunfig.toml` (raíz) | apuntan al `app/src` viejo |
| `HANDOFF.md` | continuidad obsoleta (se recrea uno nuevo mientras la rama esté abierta) |
| `docs/` completo, salvo lo de §11.1 y **`docs/rehacer/`, que se conserva hasta WP-19** porque es la fuente del plan (WP-19 mueve `understand/CANON.md` a `docs/especificacion.md` y retira el resto): `JOYAS.md`, `auditorias/`, `bugs/`, `canon-opm/` (puentes y resolutor URN), `cheatsheets/`, `decisiones/`, `deploy/opforja.md`, `ejemplos/`, `manual-*.md` (5), `memorias-aprendizajes/`, `reference/`, `render-headless.md`, `roadmap/`, `specs/`, `superpowers/`, `uso-productivo.md`, `verify-reproducible.md`; `docs/README.md` se reescribe | documentación de capacidades retiradas, histórica o duplicada del canon |
| `app/src/**` (1 141) | se reescribe (§2); lo portable se lee de `pre-rehacer` (§12.3) |
| `app/e2e/**` (76) | se reemplaza por los 26 escenarios nuevos |
| `app/scripts/**` (29) | bug-capture, cordón, design-governance, quality-ledger, in-vivo, mesa, corpus del tutor, render-headless, verify-reproducible; `deploy.test.ts` pasa a `deploy/deploy.test.ts` y `auth-cuenta.ts` se porta a `servidor/cuenta.ts` |
| `app/_local/**`, `app/portable-reader/`, `app/playwright.external.config.ts`, `app/playwright.preview.config.ts`, `app/eslint.config.js` | simulación, lector portátil, amarras externas, preview y lint retirados |
| `deploy/nginx.conf`, `deploy/backup-opforja-db.sh`, `deploy/systemd/opforja-db-backup.{service,timer}` | sin nginx ni PostgreSQL; los reemplazan `deploy/respaldo.sh` y `deploy/systemd/opforja-respaldo.*` |

Se **reescriben**: `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.gitignore`,
`deploy/deploy.sh`, `README.md`, `AGENTS.md`, `NOTICE.md`, `docs/README.md`, `app/package.json`,
`app/bun.lock`, `app/bunfig.toml`, `app/tsconfig.json`, `app/vite.config.ts`, `app/index.html`,
`app/playwright.config.ts` y `app/.gitignore`. `CLAUDE.md` no cambia.

---

## 12. Plan de implementación (paquetes de trabajo)

### 12.1 Estrategia

- **Rama y tag.** Se trabaja en la rama `rehacer`, creada desde `main`, con el tag `pre-rehacer`.
  Producción sigue en el stack viejo hasta el merge y un despliegue **autorizado** (§9.4). Así
  ninguna capacidad en uso (abrir modelos, traer, quitar; SYNTHESIS §8-17/18) desaparece antes de
  que la nueva la cubra con pruebas.
- **Contratos primero.** WP-1 escribe **todos** los archivos de contrato de este documento:
  - los tipos de §3.1, §4, §5.2, §6.1, §6.2, §6.8 y §7.6;
  - las firmas de §3.4.1 y §4.2, como funciones que lanzan `new Error('pendiente: WP-n')`;
  - `pruebas/constructores.ts`, que escribe modelos literales sin operaciones.

  Desde ese momento cada WP programa contra los tipos y prueba con constructores, sin esperar a
  sus vecinos.
- **Pruebas primero** (SYNTHESIS §8-14).
  - Cada WP abre con sus `*.test.ts`, que salen de estas fuentes:
    - las filas T-NNN de `docs/especificacion.md`, con el T-ID en el título;
    - las leyes de `pre-rehacer:app/src/leyes/`;
    - los hallazgos de las sondas del crítico (`understand/SYNTHESIS.md` §10), reexpresados sobre la
      API nueva. Las sondas mismas no se versionaron; su contenido es redundante con las filas T-NNN
      y no bloquea ningún WP.
  - Hasta WP-19, `docs/especificacion.md` es `docs/rehacer/understand/CANON.md` y `canon/` se
    copia de `docs/rehacer/canon/` (mapa completo en `docs/rehacer/plan/README.md`).
  - El WP cierra con `bun run check` verde. Ninguna prueba se debilita para pasar.
- **Propiedad exclusiva de archivos.** Los archivos stub que crea WP-1 pasan a ser del WP dueño.
  Los archivos compartidos se tocan en serie:
  - `app/package.json`, `app/vite.config.ts` y `app/playwright.config.ts`: WP-0 crea el andamiaje y WP-18 integra el layout de §9.1;
  - `nucleo/enlaces.ts`: WP-3b lo crea y WP-4r le agrega la llamada a `distribuir`;
  - `nucleo/cosas.ts`: WP-3a lo crea y WP-4r le agrega la inserción de subprocesos;
  - `opl/documento.ts`: WP-7 escribe `generarDocumentoOpl` y WP-9 le agrega `importarOpl` (CC-23).
  - `nucleo/proyeccion.ts`, `nucleo/proyeccion.test.ts` y `nucleo/frontera.test.ts`: WP-4p produce proyección y leyes; WP-5 integra en serie continuidad R+C y metadata de conflictos conforme a §4.4/§4.6, sin retirar cobertura previa.
  - `nucleo/resultado.test.ts`: WP-3a completa en serie la exportación `violacionesForma` del doble aislado de transacción con una guarda que falla si se invoca; conserva íntegros casos, cuerpos y expectativas de WP-1. WP-3b agrega únicamente `violacionesAbanico`, `normalizarEtiquetas` y `violacionesContexto`, con la misma guarda de no invocación y conservación íntegra de los cinco casos.
  - `nucleo/matriz.ts` y `nucleo/propiedades.test.ts`: WP-2 produce la consulta, WP-3b comprueba
    propiedades sin refinamientos y WP-4r integra el hook de distribución y amplía propiedades.
- **Cambios de contrato.** Solo se hacen por propuesta en `HANDOFF.md`, que es único, raíz, estable
  y sin fecha. Allí también se lleva la cuenta de qué WP cerró y cuál sigue. WP-19 lo elimina.

### 12.2 Paquetes

| WP | Objetivo | Archivos (propiedad) | Contrato que produce · consume | Depende de | Aceptación (ejecutable) |
|---|---|---|---|---|---|
| **WP-0** | Andamiaje y retiro | borrados de §11.4; `canon/**` (+`LEEME.md` con sha256); `app/{package.json,bun.lock,bunfig.toml,tsconfig.json,vite.config.ts,index.html,playwright.config.ts,.gitignore}`; `app/src/arquitectura.test.ts`; `app/herramientas/dev.ts`; `git mv fixtures/demo-models/*.json app/fixtures/v0/`; `AGENTS.md` (§11.2); `HANDOFF.md` | scripts `dev`, `check`, `test`, `golden`, `build`, `e2e` (§10.1); dependencias de §2.2 | — | `bun install` no agrega nada fuera de §2.2 · `bun run check` verde · `git ls-files` no lista ninguna ruta de §11.4 · `sha256sum canon/*/content.md` coincide con `canon/LEEME.md` |
| **WP-1** | Contratos y fundamentos | `nucleo/{tipos,resultado,ids,indice,lexico,herencia,forma,modelo,operaciones,colocacion}.ts` (completos); **stubs** con firmas exactas de todo archivo de §2.1 en `nucleo/ codec/ opl/ opd/ editor/`; `src/pruebas/{constructores,azar,expectativas-matriz}.ts` | produce §3.1, §3.2 (`validarForma`), §3.3, §4.1 (`transaccion`, `Tx` implementados), `Indice`, `claveNombre`, `buscarPorNombre`, `describirEnlace`, `sugerirNombre`, `OPERACIONES`/`Accion`, todos los tipos de §5.2, §6.1, §6.2, §6.8 y §7.6 | WP-0 | `bun run check` verde con los stubs · `forma.test` (F-1…F-13) · `lexico.test` (EBNF, y/e, o/u, `sugerirNombre`, T-025) · `herencia.test` (T-093) · `indice.test` · `colocacion.test` (hueco libre, contenedor, bandas, externos, despliegue; sin solapes) · `azar.test`: 200 semillas producen modelos con `validarForma = []` · `constructores` cubren todos los tipos de enlace |
| **WP-2** | Matriz de validez | `nucleo/matriz.ts`, `nucleo/matriz.test.ts`; conformidad (filas y B-28) | `MATRIZ`, `REGLAS_CONTEXTO`, `NO_OFRECIDO`, `violacionesForma/Contexto/Abanico`, `noOfrecido`, `tiposLegales` (con `Alternativa` y datos pendientes), `normalizarEtiquetas`, `erroresContexto` | WP-1 | `bun test src/nucleo/matriz.test.ts`: coincide con `expectativas-matriz.ts`; ≥1 caso legal y ≥1 ilegal por fila de CANON §2.1 y por regla; títulos T-040…T-066, T-268 · `NO_OFRECIDO` cada fila probada · etiquetas pendientes/completas, F-11/B-05, igualdad con R-STRE-1, sentido/pureza, duplicados semánticos y alternativas solo del mismo par · B-28 declara integración refinada pendiente de WP-4r/H2 |
| **WP-4p** | Proyección y árbol | `nucleo/proyeccion.ts`, `nucleo/frontera.test.ts` | `proyectar`, `Vista`; `etiquetaOpd` y `opdsEnPreorden` se reexportan y leen `indice(m).preorden`/`.etiqueta` de WP-1: una sola implementación (CC-22) | WP-1 | `proyeccion.test`: 12 niveles de fuerza, 9 celdas R-PREC, R-VIS-HIJO-1 + DR-13, estados anclados visibles, `SDx.y` que muta (T-085, T-086, T-031) · `frontera.test` con mutante que la pone roja (T-089) |
| **WP-6** | Códec v0 | `codec/**`; `app/fixtures/v0/sintetico.json` (generado por `azar`, semilla fija) | §3.4 completo | WP-1; merge tras WP-4p (export de visibilidad y etapa 12) | `codec.test` (una prueba por regla de §3.4.2) · `codec-fijo.test` · `codec-derivados.test` (23 derivados) · `codec-visibilidad.test` · los 6 fixtures importan `ok` |
| **WP-8a** | Geometría, marcadores y fuente | `opd/{tokens,geometria,marcadores,metricas,fuente}.ts`; `herramientas/medir-fuente.ts` | `Punto`, `Rect`, recortes, peine, rayo, lazo, arcos, cruces; `anchoTexto`, `envolver`; base64 de la fuente | WP-1 | `geometria.test` (T-211, T-216, T-224) · `marcadores.test` (paths ≡ canon, T-209, T-210, T-212, T-215) · `medir-fuente.ts` corre en Chromium de `/opt/pw-browsers` y regenera ambos archivos de forma idéntica dos veces |
| **WP-11** | Servidor | `servidor/{principal,sesion,almacen,cuenta}.ts` | §8.1–§8.3; `crearServidor({ datos, web, secreto, token?, version, canon: { leerCanonico, importarV0, exportarV0, revision, resumen } })` (códec inyectable) | WP-1; merge tras WP-6 (pruebas de integración con el códec real) | `sesion.test`, `almacen.test`, `principal.test` (§10.6), incluidos Bearer, previas, `?respaldo=1`, 422, `X-Opforja-Version`, `ID_MODELO` en rutas y el arranque con archivos no canónicos (CC-14, CC-16) · `cuenta` porta `pre-rehacer:app/src/server/passwordHash.ts` (se verifica un hash real del formato viejo) |
| **WP-18** | Despliegue (sin desplegar) | `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `deploy/{deploy.sh,deploy.test.ts,respaldo.sh}`, `deploy/systemd/opforja-respaldo.*`; `app/{package.json,vite.config.ts,playwright.config.ts}` (compartidos seriales de andamiaje) | §9 | WP-0 (redacción); la verificación de imagen necesita WP-11 y WP-14 | `bun test ../deploy` al cerrar · `docker compose build` correcto en local y la imagen sin `src/`, pruebas ni `node_modules` **cuando existan `servidor/` y `main.tsx`** (se verifica en la ola 4 o en WP-19; antes `vite build` no tiene entrada, CC-23) |
| **WP-3a** | Operaciones: cosas y estados | `nucleo/{cosas,estados}.ts`; `nucleo/resultado.test.ts` (ajuste serial mínimo del doble aislado: exportación `violacionesForma` con guarda de no invocación) | §4.2 (cosas, estados) | WP-2, WP-4p (`suprimirEstado` consulta la visibilidad de enlaces anclados, CC-23) | `cosas.test`, `estados.test`: éxito, rechazo con código, trazas, ids, deshacer; T-062, T-063, T-065, T-081, T-248, T-251, **DS-5** (`tiene-refinamiento`), **DS-6** (última aparición), selección múltiple, DS-20 |
| **WP-3b** | Operaciones: enlaces y abanicos | `nucleo/{enlaces,abanicos}.ts`, sus pruebas y `nucleo/propiedades.test.ts`; `nucleo/resultado.test.ts` (ajuste serial mínimo: tres exportaciones del doble aislado con guarda de no invocación; casos/cuerpos/expectativas WP-1 intactos) | §4.2 (enlaces, abanicos), `reanclarExtremo`, alternativas del segundo gesto | WP-2, WP-4p (`crearEnlace` muestra el estado oculto donde el enlace se ve, CC-23) | `enlaces.test`, `abanicos.test`: `crearEnlace` con `abanicoCon`, `fijarEstados` (4 formas), `reanclarExtremo` (todas las familias, T1→TS1, T-250), `eliminarEnlaces` (mitad escindida ⇒ standalone; `valor` huérfano retirado, CC-03), exhibición que propaga lo ambiental (CC-02), T-066 · `propiedades.test` (`tiposLegales` ≡ `crearEnlace`, sobre 3 modelos de muestra de `constructores` y 50 de `azar` sin refinamientos, con etiquetas completas, pendientes no persistibles y normalización con traza; integración refinada en WP-4r/B-28; sin secuencias de operaciones de WP-3a) |
| **WP-5** | Diagnóstico y gates | `nucleo/diagnostico.ts`, `nucleo/{proyeccion.ts,proyeccion.test.ts,frontera.test.ts}` (compartidos seriales para continuidad R+C y metadata) | `CATALOGO`, `diagnosticar`, `gatesExportacion`, reparaciones | WP-2, WP-4p | `diagnostico.test`: cada código con un caso positivo y uno negativo, y cada `reparacion` es una `Accion` bien formada (que aplicada lo resuelve se prueba en `reparaciones.test` de WP-4r, que ya tiene todas las operaciones, CC-23); T-260, T-261, T-263 (un solo código, con herencia y subprocesos), T-265, T-268, T-283; T-085/T-089 continuidad R+C directa, R→E→C y anidada secuencial acreditada por hechos/estados originales; negativos de cadena rota y anidado paralelo, firma de estados, IDs/procedencia, pureza, anclajes visibles y 12 fuerzas sin pérdidas; conservar 9 celdas, negativos y ley/oráculo independiente de frontera; metadata §4.4 con igual cobertura |
| **WP-7** | OPL: generación | `opl/{vocabulario,linea,plantillas,generar}.ts`; `opl/documento.ts` (`generarDocumentoOpl`) | `PLANTILLAS` (con `hacia`), `generarBloque`, `generarModelo`, `textoCanonico`, `lineaDeEnlace` | WP-4p | `vocabulario/plantillas/generar.test`: T-100…T-139 de la tabla §12.6; RF2b sin coma; RFE; mención mínima; ids de línea estables; unidades es-CL |
| **WP-8b** | OPD: escena, dibujo, export | `opd/{escena,dibujo,exportar}.ts`, `opd/__golden__/**` | `escena`, `dibujar`, `aTexto`, `exportarDiagrama`, `exportarDocumento`, `advertenciasEscena` | WP-4p, WP-8a, WP-6 (los golden del SD y de un OPD profundo de cada fixture importan v0, CC-23); gates tras WP-5 | `escena/exportar/golden.test`: 40 golden revisados **visualmente** uno a uno (SYNTHESIS §8-5); T-200…T-228 de la tabla §12.6; `@font-face` en el export |
| **WP-4r** | Refinamiento (operaciones) | `nucleo/refinamiento.ts`; hook de `distribuir` en `nucleo/enlaces.ts` y de subproceso en `nucleo/cosas.ts`; hook de ensayo en `nucleo/matriz.ts`; ampliación `nucleo/propiedades.test.ts` | §4.5 (`descomponer`, `agregarSubprocesos`, `moverSubproceso`, `fijarBandas`, `desplegar`, `agregarRefinadores`, `eliminarRefinamiento`, `distribuirEnlace`) | WP-3a, WP-3b, WP-5 (para `reparaciones.test`) | `refinamiento.test`: tabla §4.5.3 fila por fila, incluida DS-4; T-070…T-083; sin semillas; un `gesto`; materialización · `secuencias.test` (200 semillas × 40 acciones de `azar.acciones`, incluidas las de refinamiento: `validarForma` vacía, sin errores de contexto nuevos, entrada sin mutar) · `reparaciones.test` (cada reparación de `CATALOGO` y `REGLAS_CONTEXTO`, aplicada con `aplicarAccion`, hace desaparecer su diagnóstico) · `propiedades.test`: consulta ≡ creación por resultado efectivo de distribución real compartida con reparación; 0/1/≥2 subprocesos, TS3/control/abanico, evento, recursión, aparición externa, colisión, rollback y DS-20 contra original; cierre de integración N de B-28 en WP-4r/H2 |
| **WP-9** | OPL: análisis y edición inversa | `opl/{analizar,planificar,aplicar,no-soportadas}.ts`; `opl/documento.ts` (`importarOpl`) | `analizar`, `planificar`, `aplicarPlan`, `NO_SOPORTADAS`, `NO_CANONIZADAS`, `TEXTO_RAZON` | WP-7, WP-3a, WP-3b, WP-4r | `analizar/editor-opl/roundtrip-matriz/roundtrip-azar/roundtrip-tabla92/composicion/lente.test`: T-150…T-196; D1/D3 «solo si difieren» y creación por tipografía en el **mismo merge** (SYNTHESIS §8-16); ~700 casos en < 3 s |
| **WP-13** | Editor | `editor/**` | §7.6 (`crearEditor`, `Cliente`, `AlmacenLocal`, `COMANDOS`, `reducirGesto`) | WP-3a/b, WP-4r, WP-6, WP-7 (`lineasNuevas` usa `generarModelo`); contrato de WP-11 | `estado/guardado/comandos/gestos.test` (§10.6): ambas resoluciones de conflicto, 404/413, apertura no canónica, salida con pendientes, reingreso, versión nueva, un paso por `gesto`, deshacer vuelve al OPD · `aplicarOpl` se prueba con un `Plan` construido a mano (`base` + `acciones`), sin depender del analizador de WP-9 (CC-23) |
| **WP-10** | Integración códec × OPL y rendimiento | `opl/roundtrip-modelos.test.ts`, `src/rendimiento.test.ts` (sin dueño antes, CC-23) | — | WP-6, WP-9, WP-5, WP-8b | auto-reparseo por OPD con 0 cambios en los 6 fixtures y el sintético (UX-01) · estricto de documento completo para los que pasan los gates · `rendimiento.test` (§2.4, falla a 3×) |
| **WP-12** | Migración desde PostgreSQL | `herramientas/migrar-postgres.ts` (+ `.test.ts`) | §8.6 (`FuenteLegada`, informes) | WP-6, WP-11, WP-5 | `migrar-postgres.test` con fuente falsa (8 casos de §10.6) |
| **WP-14** | UI: armazón | `ui/{App,Acceso,Biblioteca,InformeImportacion,Editor,Dialogo,Ayuda,Franja}.tsx`, `ui/estilos.css`, `main.tsx` | layout §7.1, superficies 1, 2, 11, 13 y 14, franja | WP-13 | e2e 1 y 2 (no necesitan lienzo ni paneles); e2e 3, 21 y 24 se evalúan en WP-17 (CC-23) |
| **WP-15** | UI: lienzo | `ui/{Lienzo,SvgPreact,CapaUi,NombreEnLinea,MenuTipoEnlace,MenuContextual}.tsx` | gestos → `ejecutar`; menú desde `tiposLegales` con vista previa (`lineaDeEnlace`); modos §6.7 | WP-8b, WP-13, WP-7 | `bun run check` y `bun run build`; sus e2e (4–13, 15, 22, 23, 25) leen el OPL del panel de WP-16, así que se evalúan en WP-17 (CC-23) |
| **WP-16** | UI: paneles | `ui/{Inspector,ArbolOpd,PanelOpl,EditorOpl,PanelDiagnostico,Buscar,MenuExportar}.tsx` | Propiedades con «Enlaces (N)», búsqueda, editor OPL de 4 estados, diagnóstico con «Aplicar a los N», export con gates y advertencias | WP-9, WP-8b, WP-13, WP-5 | `bun run check` y `bun run build`; sus e2e (14, 16–20, 26) necesitan el lienzo de WP-15 y se evalúan en WP-17 (CC-23) |
| **WP-17** | E2E | `e2e/**` | infraestructura §10.7 | redacción desde WP-13; ejecución tras WP-14–16 (WP-14, WP-15 y WP-16 se integran como un solo tren: ninguno cierra sus e2e por separado) | los 26 escenarios verdes contra el build y el servidor real (Chromium de `/opt/pw-browsers`), con 0 errores de página |
| **WP-19** | Documentación y cierre | `README.md`, `NOTICE.md`, `docs/**`; borra `HANDOFF.md` | §11 | todos | cada fila de las tablas con `registro` tiene su B-nn, y viceversa (revisión del diff) · cada fila de §12.6 apunta a archivos y pruebas existentes (`bun test -t <T-ID>` encuentra ≥1 prueba por ★ no registrado como brecha) · `bun run check`, `bun run e2e` y `bun run build` verdes desde un clon limpio |

### 12.3 Qué se porta por lectura desde `pre-rehacer` (no se copia a ciegas)

| Origen | Destino | Qué se toma |
|---|---|---|
| `app/src/server/passwordHash.ts` | `servidor/sesion.ts`, `servidor/cuenta.ts` | el formato `scrypt$16384$8$1$sal$hash` y su verificación |
| `app/src/modelo/operaciones/refinamiento/helpers.ts` (`validarFirmaEnlace`), `modelo/operaciones/enlaces.ts` (`validarUnicidadRolPar`) | `nucleo/matriz.ts` | la exhaustividad por `satisfies never`; los casos de unicidad |
| `app/src/opl/parser/parsear.ts` (`parsearBandasOrden`), `opl/parser/planificar.ts` (`PatchRegistry`), `opl/clasificadorEdicion.ts` | `opl/analizar.ts`, `opl/planificar.ts` | el doble rol de `y` en secuencias mixtas; el registro por clave de hecho; los 4 estados y las 8 razones |
| `app/src/persistencia/documentMigration.ts` (`collectUnrepresented`) | `codec/informe.ts` | el recorrido de campos no representados |
| `helpers.ts` (`agruparSubprocesosParalelos`), `modelo/politicaApariciones.ts` (`aparienciaEsInternaDeRefinamiento`) | `codec/importar.ts` | las bandas por geometría (4 px) y los internos por geometría |
| `app/src/modelo/hechos/visibilidadEstados.ts` | `nucleo/proyeccion.ts` | el predicado de visibilidad de estados, **sin** la guarda global que sobrebloquea (C-06) |
| `render/…` (`calcularGeometriaAbanicoDesdePuntos`, `autoinvocacionLoop`) | `opd/geometria.ts` | los algoritmos de arco y de lazo |
| `app/src/serializacion/portablePackage.ts` (`constantTimeEqual`, `assertExactKeys`), `server/agent/http.ts` (`canonicalJson`) | `servidor/sesion.ts`, `codec/exportar.ts` | utilidades |
| `app/src/leyes/*.test.ts` (contención, dependencias, equivalencia, opl-reverse, proyecciones, cascadas, frontera, supresión, invocación implícita, composición, silencio de solo lectura) | pruebas de WP-2…WP-9 | la ley y su control de no tautología |
| `app/scripts/deploy.test.ts` | `deploy/deploy.test.ts` | los stubs de `git`, `docker` y `curl` |

### 12.4 Orden de integración y paralelismo

```
Ola 0  WP-0 ─► WP-1
Ola 1           ├─► WP-2 ──────────────┐
                ├─► WP-4p ─────────────┤
                ├─► WP-6 (merge ≥ WP-4p)
                ├─► WP-8a
                ├─► WP-11 (merge ≥ WP-6)
                └─► WP-18
Ola 2  WP-2+WP-4p ─► WP-3a ∥ WP-3b ;  WP-2+WP-4p ─► WP-5 ;  WP-4p ─► WP-7 ;  WP-4p+WP-8a+WP-6 ─► WP-8b
Ola 3  WP-3a+WP-3b+WP-5 ─► WP-4r ─► WP-9 ;  WP-3+WP-4r+WP-6+WP-7 ─► WP-13 ;  (WP-17 se redacta)
Ola 4  WP-10 ∥ WP-12 ∥ [WP-14 ∥ WP-15 ∥ WP-16: un tren] ∥ verificación de imagen de WP-18
Ola 5  WP-17 (ejecución) ─► WP-19 ─► PR rehacer → main (sin desplegar)
```

- El camino crítico es WP-0 → WP-1 → WP-2 → WP-3 → WP-4r → WP-9 → WP-16 → WP-17 → WP-19.
- Hay hasta 6 agentes en la ola 1 y 5 en la ola 4.
- Cada merge a `rehacer` exige `bun run check` verde; WP-14 exige además e2e 1–2. WP-15 y WP-16 se
  integran con WP-14 como un tren y sus e2e los ejecuta WP-17 (se necesitan mutuamente: lienzo y
  panel OPL). El grafo no tiene ciclos: cada arista va de una ola a otra posterior (CC-23).
- El PR final no despliega: el despliegue sigue §9.4 y requiere autorización explícita.

### 12.5 Reglas para los agentes

1. Solo se tocan los archivos de la propiedad del WP. Una necesidad en otro archivo se anota en
   `HANDOFF.md` para su dueño.
2. Ninguna regla OPM se implementa fuera de `nucleo/matriz.ts` o `nucleo/diagnostico.ts`, y ninguna
   oración fuera de `opl/plantillas.ts`.
3. Toda mutación es una `Operacion` registrada en `OPERACIONES`. La UI solo llama a
   `editor.ejecutar`.
4. Cada prueba de requisito se titula con su T-ID. Cada brecha nueva lleva su fila B-nn en el mismo
   commit.
5. Un golden nuevo o cambiado no se acepta sin abrir el SVG y mirarlo.

### 12.6 Trazabilidad ★ (CANON.md §9 → mecanismo → WP → prueba)

Se replica como tabla 2 de `docs/conformidad.md`. «Estado» es `enforzado` salvo donde se indica la
fila de Brechas. La columna Prueba nombra el archivo; el título lleva el T-ID.

| ★ | Requisito (breve) | Mecanismo | WP | Prueba | Estado |
|---|---|---|---|---|---|
| T-001 | registro de conformidad sin brecha silenciosa | `docs/conformidad.md` (3 tablas); `registro:'B-nn'` en `NO_OFRECIDO`/`NO_SOPORTADAS`/`NO_CANONIZADAS`; regla de AGENTS | WP-19 (todos) | comportamiento de cada fila en `matriz`, `analizar` y `diagnostico.test`; revisión del diff (DECISIONS 16) | enforzado |
| T-003 | no inventar reglas; silencio ≠ prohibición | cada regla de la matriz y del catálogo cita su id canónico; el import no rechaza por canon (P8) | WP-2, WP-5, WP-6 | `matriz.test` («cada regla cita id»), `codec.test` | enforzado |
| T-004 | lo no nuclear no emite OPL | `descripcion` como meta; `soloDisplay`; `CapaUi` fuera de `dibujar` | WP-7, WP-8b | `generar.test`, `exportar.test` | enforzado |
| T-005 | monolingüe es-CL | `VOCABULARIO` cerrado; textos de UI en es-CL | WP-7, WP-14 | `vocabulario.test` | enforzado |
| T-006 | solo elementos con semántica | tipos §3.1; el import descarta extensiones con informe | WP-1, WP-6 | `forma.test`, `codec.test` | enforzado |
| T-010 | núcleo único; OPL derivado | un `Modelo`; `proyectar`, `generar` y `escena` puras | WP-1, WP-4p, WP-7 | `arquitectura.test`, `lente.test` | enforzado |
| T-011 | una API de mutación | `OPERACIONES` + `editor.ejecutar`; `aplicarPlan` usa `Accion` | WP-1, WP-13, WP-9 | `estado.test`, `editor-opl.test` | enforzado |
| T-012 | cosa ∈ {objeto, proceso} | `TipoCosa` | WP-1 | `forma.test` | enforzado |
| T-013 | esencia y afiliación en la cosa, con defaults | `CosaBase` | WP-1 | `forma.test`, `codec.test` | enforzado |
| T-014 | perseverancia derivada | sin campo; D11/D12 solo se parsean | WP-1, WP-9 | `analizar.test` | enforzado |
| T-015 | estados solo en objetos, con orden | `Objeto.estados` | WP-1 | `forma.test` | enforzado |
| T-016 | designaciones inicial/final y por defecto ≤1 | `inicial?`, `final?`, `porDefecto?: Id` | WP-1, WP-3a | `estados.test` | enforzado |
| T-018 | supresión en dos niveles | `Estado.suprimido` + `Aparicion.ocultos`; `proyectar` paso 6 | WP-1, WP-3a, WP-4p | `estados.test`, `proyeccion.test` | enforzado |
| T-019 | atributo = objeto exhibido | sin campo «atributos»; exhibición | WP-1 | `forma.test` | enforzado |
| T-021 | duración de proceso | `Proceso.duracion`, `fijarDuracion`, `unidadTiempo` | WP-1, WP-3a | `cosas.test` | enforzado |
| T-022 | id persistente opaco | `Id`; etiqueta `SDx.y` derivada | WP-1, WP-4p | `proyeccion.test` | enforzado |
| T-023 | apariencia ≠ cosa; ≤1 por OPD | `Opd.apariciones` por `cosaId` | WP-1, WP-3a | `forma.test`, `cosas.test` | enforzado |
| T-024 | nombre único | `claveNombre`; las operaciones rechazan; `nombre-duplicado` en import | WP-1, WP-3a, WP-5 | `cosas.test`, `diagnostico.test` | enforzado |
| T-025 | léxico, sin normalizar en silencio | `lexico.ts`; rechazo en operaciones; el import diagnostica y ofrece una reparación explícita (DS-7) | WP-1, WP-3a, WP-5, WP-6 | `lexico.test`, `codec.test`, e2e 4 | enforzado |
| T-026 | enlace binario con sus campos | tipos de enlace por rol | WP-1 | `forma.test` | enforzado |
| T-027 | control escalar | `control?: Control` | WP-1 | `forma.test` | enforzado |
| T-028 | abanico explícito; AND = ausencia | `Abanico` | WP-1, WP-3b | `abanicos.test` | enforzado |
| T-029 | refinamientos (≤1 de cada) | `Opd` discriminado + F-7 | WP-1, WP-6 | `forma.test`, `codec.test` | enforzado |
| T-030 | bandas = fuente de verdad del tiempo | `OpdDescomposicion.bandas`; Y derivada | WP-1, WP-4r, WP-8b | `refinamiento.test`, `escena.test` | enforzado |
| T-031 | árbol con raíz SD; `SDx.y` derivada | `opdsEnPreorden`, `etiquetaOpd` | WP-4p | `proyeccion.test` | enforzado |
| T-032 | procedencia de escisión | `Efecto.escision` + F-4 | WP-1, WP-4r | `forma.test`, `refinamiento.test` | enforzado |
| T-033 | alcance persistido | `bandas`, `objetosInternos`; rebote | WP-1, WP-3a | `cosas.test` | enforzado |
| T-036 | sin runtime persistido | no hay campo runtime; `current` declarado | WP-1 | `forma.test`, `codec.test` | enforzado |
| T-040 | validar firma; ofrecer solo legales | `MATRIZ` + `tiposLegales` | WP-2, WP-15 | `matriz.test`, `propiedades.test`, e2e 7 | enforzado |
| T-041 | validar extremo de estado | F-3 + `tiposLegales` | WP-2 | `matriz.test` | enforzado |
| T-042 | dirección de consumo y resultado | roles + `clases` | WP-1, WP-2 | `matriz.test` | enforzado |
| T-043 | resultado nunca al estado inicial | regla AP-04 | WP-2 | `matriz.test` | enforzado |
| T-044 | efecto solo con estados (también heredados) | R-EFE-1 + `herencia` | WP-2 | `matriz.test` | enforzado |
| T-045 | agente solo desde objeto físico | regla R-AG-1 | WP-2 | `matriz.test` | parcial (B-03: proxy) |
| T-046 | invocación proceso→proceso | `clases` | WP-2 | `matriz.test` | enforzado |
| T-047 | firma de excepción; pedir la cota | `clases`; `cota-faltante`; flujo 18 | WP-2, WP-5, WP-16 | `matriz.test`, `diagnostico.test`, e2e 23 | enforzado |
| T-048 | estructurales del mismo tipo; exhibición libre | `mismoTipo` | WP-2 | `matriz.test` | enforzado |
| T-049 | etiquetados O↔O y P↔P | `mismoTipo` | WP-2 | `matriz.test` | enforzado |
| T-051 | e/c solo en entrada | tipos + F-4 | WP-1, WP-2 | `forma.test`, `matriz.test` | enforzado |
| T-052 | ≤1 control | escalar | WP-1 | `forma.test` | enforzado |
| T-053 | un procedimental por par (distributivo) | R-ROL-UNIC-1 + `Alternativa` | WP-2, WP-15 | `matriz.test`, e2e 8 | enforzado |
| T-054 | abanico válido | F-6 + `violacionesAbanico` | WP-2, WP-3b | `matriz.test`, `abanicos.test` | enforzado |
| T-055 | abanicos de resultado e invocación sin control | tipo (sin campo `control`) | WP-1 | `forma.test` | enforzado |
| T-059 | nada dentro de estado; sin estados de proceso | tipos | WP-1 | `forma.test` | enforzado |
| T-060 | consumo, resultado y evento sistémico fuera del contorno | R-DIST-1/AP-21 + distribución automática | WP-2, WP-4r | `matriz.test`, `refinamiento.test` | enforzado |
| T-062 | sin placeholders | las operaciones exigen nombre; in-zoom sin semillas | WP-3a, WP-4r, WP-15 | `cosas.test`, e2e 4, 6, 11 | enforzado |
| T-063 | cambio de tipo revisado | `cambiarTipoCosa` + DS-20 | WP-3a | `cosas.test` | enforzado |
| T-064 | bloquear antes de persistir; ambigüedad ⇒ bloqueo | `transaccion` todo-o-nada; `referencia-ambigua` | WP-1, WP-9 | `cosas.test`, `editor-opl.test` | enforzado |
| T-065 | conflicto nominal explícito | `unicidad-nominal` + bandeja traer/renombrar/descartar | WP-3a, WP-15 | `cosas.test`, e2e 4 | enforzado |
| T-066 | internos enlazados solo con visibles del hijo | precondición `interno-no-visible` | WP-3b | `enlaces.test` | enforzado |
| T-070 | descomponer atómico | `descomponer` | WP-4r | `refinamiento.test`, e2e 11 | enforzado |
| T-071 | desplegar por modo | `desplegar` | WP-4r | `refinamiento.test`, e2e 13 | enforzado |
| T-073 | distribución | tabla §4.5.3 | WP-4r | `refinamiento.test` | enforzado |
| T-074 | escisión TS3 | tabla §4.5.3 + DS-4 | WP-4r | `refinamiento.test`, e2e 11 | enforzado |
| T-075 | la migración conserva el id | `distribuir` | WP-4r | `refinamiento.test` | enforzado |
| T-076 | respaldo temporal en el contorno | \|S\| = 0 queda; distribución 0→n | WP-4r | `refinamiento.test` | enforzado |
| T-077 | refinamiento no trivial | `refinamiento-trivial` + gate | WP-5, WP-8b | `diagnostico.test`, `exportar.test`, e2e 19 | enforzado |
| T-078 | sin ciclos | precondición `ciclo` + F-7 | WP-1, WP-4r | `refinamiento.test` | enforzado |
| T-079 | un externo no se refina desde el hijo | precondición `externo-no-refinable` | WP-4r | `refinamiento.test` | enforzado |
| T-080 | cascada de internos | `eliminarRefinamiento` paso 3 | WP-4r | `refinamiento.test` | enforzado |
| T-082 | subproceso confinado; Y por banda | `moverApariciones` (solo x) + gesto de banda | WP-3a, WP-13 | `cosas.test`, `gestos.test` | enforzado |
| T-083 | solo hojas; destructivo con confirmación | `eliminarRefinamiento` (hoja) + DS-5 | WP-4r, WP-3a, WP-16 | `refinamiento.test`, `cosas.test`, e2e 15 | enforzado |
| T-084 | sin instancia visual entre tipos | aparición = misma cosa | WP-1 | `forma.test` | enforzado |
| T-085 | vista del padre por fuerza, sin colapso | `proyectar` paso 4 | WP-4p | `proyeccion.test` | enforzado |
| T-086 | en el hijo, solo enlaces que tocan contenedor o internos | `proyectar` paso 3 | WP-4p | `proyeccion.test` | **parcial (B-19, DR-13)** |
| T-087 | rastrear refinadores; ajuste con traza | incompleta de vista, `ajuste-automatico`, grueso derivado | WP-4p, WP-5, WP-8b | `proyeccion.test`, `escena.test` | enforzado |
| T-092 | no materializar herencia | herencia solo en validadores | WP-1, WP-2, WP-7 | `herencia.test`, `generar.test` | enforzado |
| T-093 | herencia múltiple | `generales()` + RH1 | WP-1, WP-7 | `herencia.test`, `generar.test` | enforzado |
| T-100 | OPL completo en preorden | `generarModelo` + `opdsEnPreorden`; la cosa sin aparición y el enlace sin vista no caen en ningún bloque: diagnóstico, gate de `canon-documento` y aviso en el export OPL (DS-6, CC-01) | WP-7, WP-5 | `generar.test`, `diagnostico.test`, e2e 19 | **parcial (B-26)** |
| T-101 | solo estados visibles; D6 | `generarBloque` paso 2 | WP-7 | `generar.test`, e2e 6 | enforzado |
| T-102 | tipografía Markdown | texto desde tokens | WP-7 | `generar.test` | enforzado |
| T-103 | una oración por línea, con punto | `generarBloque` | WP-7 | `generar.test` | enforzado |
| T-104 | vocabulario cerrado | `VOCABULARIO` ≡ literales | WP-7 | `vocabulario.test` | enforzado |
| T-105 | plantillas literales (tabla 9.2 mínima) | `PLANTILLAS` | WP-7 | `plantillas.test`, `roundtrip-tabla92.test` | enforzado |
| T-106 | D1/D3 solo si difieren | `generarBloque` paso 2; D2 solo como mención mínima de una cosa que ninguna otra oración nombra (DS-2) | WP-7 | `generar.test` | **parcial (B-27, DS-2)** |
| T-107 | D5 `puede estar`, en orden | D5 | WP-7 | `generar.test` | enforzado |
| T-108 | D7–D10 | D7/D8/D9/D10 | WP-7 | `generar.test` | enforzado |
| T-110 | T1–T3, TS1–TS5 | plantillas | WP-7 | `plantillas.test` | enforzado |
| T-111 | H1, H2, HS1, HS2 | plantillas | WP-7 | `plantillas.test` | enforzado |
| T-112 | con control, una sola oración | `generarBloque` paso 3 | WP-7 | `generar.test` | enforzado |
| T-113 | CT1 antes que `Si … entonces` | COND-ALT solo P | WP-7 | `plantillas.test` | enforzado |
| T-114 | rama negativa `se omite` | plantillas C\* | WP-7 | `plantillas.test` | enforzado |
| T-115 | EX con unidad es-CL; respaldo | EX1/EX2/EX1r/EX2r | WP-7 | `generar.test` | enforzado |
| T-116 | IV1 e IV2 | IV1, IV2 (sin demora) | WP-7 | `generar.test` | enforzado |
| T-117 | RF1–RF4b, RH1, variantes de proceso | plantillas estructurales | WP-7 | `generar.test` | enforzado |
| T-119 | SE1 y SE2 | plantillas | WP-7 | `plantillas.test` | enforzado |
| T-122 | 24 plantillas de abanico; ramas con estado | tabla de abanicos | WP-7 | `plantillas.test`, `roundtrip-matriz.test` | enforzado |
| T-125 | CX1/CX2/mixta en el hijo | `generarBloque` paso 1 | WP-7 | `generar.test`, e2e 11 | enforzado |
| T-126 | CX3 `se despliega en SDx en` | CX3 | WP-7 | `generar.test`, e2e 13 | enforzado |
| T-127 | sin CX con <2 refinadores | R-CX-0 | WP-7 | `generar.test` | enforzado |
| T-130 | listas y e/u | `vocabulario` | WP-7 | `vocabulario.test` | enforzado |
| T-131 | coordinar estructurales fuera de hijos | `generarBloque` paso 4 | WP-7 | `generar.test` | enforzado |
| T-132 | una oración por enlace en hijos | `generarBloque` paso 4 | WP-7 | `generar.test` | enforzado |
| T-133 | sin oraciones compuestas | no se generan; `NO_SOPORTADAS` al parsear | WP-7, WP-9 | `generar.test`, `analizar.test` | enforzado |
| T-134 | orden determinista | DS-1 | WP-7 | `generar.test` | enforzado |
| T-135 | tokens tipados; token → hecho | `LineaOpl`, `TokenOpl` | WP-7 | `generar.test` | enforzado |
| T-136 | notas, UI y meta sin OPL | `soloDisplay`; sin runtime | WP-7 | `generar.test` | enforzado |
| T-137 | la instancia visual no emite oración | solo rótulo en la escena | WP-7, WP-8b | `generar.test` | enforzado |
| T-150 | parsear antes de mutar | `analizar` y `planificar` puros; `aplicarPlan` aparte | WP-9 | `lente.test` | enforzado |
| T-151 | subconjunto soportado declarado | `PLANTILLAS` (G/P) + `NO_SOPORTADAS` + `formato-v0.md` | WP-7, WP-9, WP-19 | `analizar.test` | enforzado |
| T-152 | normalizar preservando acentos | `analizar` paso 1 | WP-9 | `analizar.test` | enforzado |
| T-153 | la tipografía crea la cosa | `planificar` paso 2 | WP-9 | `editor-opl.test`, `roundtrip-matriz.test` | enforzado |
| T-155 | firma inválida ⇒ `enlace-invalido-firma` | `planificar` paso 5 | WP-9 | `editor-opl.test` | enforzado |
| T-156 | canónica no soportada ⇒ `unsupported-canonical` | `NO_SOPORTADAS` + `noOfrecido` | WP-9 | `analizar.test`, `lente.test` | enforzado |
| T-157 | no canonizada ⇒ `non-canonical` | `NO_CANONIZADAS` | WP-9 | `analizar.test` | enforzado |
| T-158 | cambio de tipo por OPL ⇒ pedir decisión | `planificar` paso 2 | WP-9 | `editor-opl.test` | enforzado |
| T-159 | el reparseo preserva layout y escisión | comparación contra la vista; nada se reescribe | WP-9 | `editor-opl.test`, `codec-fijo.test` | enforzado |
| T-160 | parser estricto | `syntax-error` | WP-9 | `analizar.test` | enforzado |
| T-161 | aceptar COND-ALT | plantilla P | WP-7, WP-9 | `analizar.test` | enforzado |
| T-162 | D1–D4 y ENT3 | plantillas P | WP-9 | `analizar.test` | enforzado |
| T-164 | TS4/TS5 standalone al parsear | TS4/TS5 | WP-9 | `analizar.test` | enforzado |
| T-166 | `se descompone en` crea o confirma; ajeno ⇒ rechazo | `crear-refinamiento` + `fijar-orden`; `referencia-ambigua` | WP-9 | `editor-opl.test` | enforzado |
| T-167 | `SDx.y` → id | `planificar` paso 1 | WP-9 | `editor-opl.test` | enforzado |
| T-168 | línea abstraída ⇒ sin-cambio | comparación contra `proyectar` | WP-9 | `editor-opl.test` | enforzado |
| T-170 | SE1 residual | `analizar` paso 5 | WP-9 | `analizar.test` | enforzado |
| T-171 | conjunto de hechos | orden de líneas irrelevante | WP-9 | `editor-opl.test` | enforzado |
| T-172 | ausencia no borra | nota `no-delete-by-absence` | WP-9 | `editor-opl.test`, `lente.test` | enforzado |
| T-173 | vista previa pura | `planificar` puro | WP-9 | `lente.test` | enforzado |
| T-174 | 4 estados de línea | `EstadoLinea` | WP-9 | `editor-opl.test` | enforzado |
| T-176 | 8 razones con su texto | `RazonNoAplicable`, `TEXTO_RAZON` | WP-9, WP-16 | `editor-opl.test`, e2e 16 | enforzado |
| T-177 | diagnóstico tipado de parser | `DiagOpl` | WP-9 | `analizar.test` | enforzado |
| T-178 | razones según corresponda | mapeo de código a razón (§5.6) | WP-9 | `editor-opl.test` | enforzado |
| T-179 | partial-parse | ensayo por fases | WP-9 | `editor-opl.test`, e2e 16 | enforzado |
| T-180 | aplicación atómica | `aplicarPlan` | WP-9 | `editor-opl.test` | enforzado |
| T-181 | 3 fases | `Patch.fase` | WP-9 | `editor-opl.test` | enforzado |
| T-182 | creación de enlace idempotente | identidad de enlace (§5.6) | WP-9 | `editor-opl.test`, e2e 26 | enforzado |
| T-184 | editar una lista muta solo sus sub-spans | comparación por hecho | WP-9 | `editor-opl.test` | enforzado |
| T-185 | display no genera patches | cabeceras y `soloDisplay` | WP-9 | `editor-opl.test` | enforzado |
| T-190 | bisimetría dual | mención mínima; plantilla para todo lo representable; `NO_OFRECIDO` para lo que no tiene plantilla | WP-2, WP-7, WP-9 | `roundtrip-matriz.test` | enforzado (con B-13, B-20) |
| T-191 | `parsear(generar(m))` sin errores | auto-reparseo | WP-9, WP-10 | `roundtrip-matriz`, `roundtrip-modelos` | enforzado |
| T-192 | roundtrip estricto desde vacío | enumeración + `azar` + tabla 9.2 + documento | WP-9 | `roundtrip-*.test` | enforzado |
| T-193 | bisimetrías parciales declaradas | §5.9 + tabla 3 del registro | WP-9, WP-19 | fixtures marcados «no estricto» | enforzado (B-13) |
| T-194 | `parsear(componer(F)) = F` | `composicion.test` | WP-9 | `composicion.test` | enforzado |
| T-195 | preserva el hecho, no la superficie | comparación por hechos (ENT3 y COND-ALT se regeneran canónicas) | WP-9 | `roundtrip-matriz.test` | enforzado |
| T-196 | export determinista | `exportarV0` | WP-6 | `codec-fijo.test`, `lente.test` | enforzado |
| T-200 | 8 representaciones | `escena` | WP-8b | `escena.test`, golden | enforzado |
| T-201 | sombra ⟺ física | `escena` + tokens | WP-8b | `escena.test` | enforzado |
| T-202 | contorno grueso solo si está refinada | `NodoCosa.grueso` | WP-8b | `escena.test` | enforzado |
| T-203 | semántica sin color; rótulos negros | `dibujar('canon')`, escala de grises | WP-8b | `exportar.test` | enforzado |
| T-204 | rótulo íntegro con autosize | `metricas` + `escena` | WP-8a, WP-8b | `escena.test`, e2e 5 | enforzado |
| T-206 | estados en el objeto con sus marcas | `escena` + geometría | WP-8b | `escena.test`, golden | enforzado |
| T-208 | chip `⋯N` en canon | `chipOcultos` | WP-8b | `escena.test` | enforzado |
| T-209 | punta cerrada literal por dirección | `marcadores` + tramos | WP-8a, WP-8b | `marcadores.test` | enforzado |
| T-210 | piruletas en el extremo proceso | `marcadores` | WP-8a | `marcadores.test` | enforzado |
| T-211 | rayo y lazo de autoinvocación | `geometria` | WP-8a | `geometria.test` | enforzado |
| T-212 | topología de los triángulos | `marcadores` + peine | WP-8a, WP-8b | `marcadores.test` | enforzado |
| T-213 | etiquetados: puntas y etiqueta en itálica | `geometria` + `escena` | WP-8a, WP-8b | `escena.test` | enforzado |
| T-214 | letras e/c | `Arista.marcas` | WP-8b | `escena.test` | enforzado |
| T-215 | `/` y `//` | `marcadores` | WP-8a | `marcadores.test` | enforzado |
| T-216 | arcos XOR/OR en el extremo común | `geometria` (arco) | WP-8a | `geometria.test` | enforzado |
| T-220 | duración en la elipse | `NodoCosa.duracion` | WP-8b | `escena.test` | enforzado |
| T-221 | contenedor con bandas | `colocacion` + `escena` | WP-1, WP-8b | `escena.test` | enforzado |
| T-223 | vocabulario visual cerrado | 40 golden | WP-8b | `golden.test` | enforzado |
| T-224 | recorte exacto; sin extremos sueltos | `geometria` | WP-8a | `geometria.test` | enforzado |
| T-227 | canal UI reservado | `CapaUi` aparte; crimson solo UI; asas cuadradas o rombo | WP-15 | `exportar.test`, e2e 17 | enforzado |
| T-228 | lienzo limpio de validación | diagnóstico solo en el panel | WP-15, WP-16 | `exportar.test`, e2e 18 | enforzado |
| T-240 | OPL inmediato | `PanelOpl` suscrito al modelo; resaltado 2 s | WP-16 | e2e 5, 16 | enforzado |
| T-241 | bloques rotulados con sangría | `PanelOpl` | WP-16 | e2e 17 | enforzado |
| T-242 | hover por referencia tipada | `realce` por `Ref`/`hecho` | WP-15, WP-16 | e2e 17 | enforzado |
| T-243 | clic en token navega sin mutar | `navegar` + `seleccionar` | WP-16 | e2e 17 | enforzado |
| T-248 | mover entre OPDs preserva identidad | `traerCosa` + `quitarDeOpd` | WP-3a | `cosas.test`, e2e 15 | enforzado |
| T-249 | lo ornamental no cambia el OPL | mover y redimensionar no tocan hechos | WP-3a, WP-7 | `cosas.test` (OPL idéntico tras mover) | enforzado |
| T-251 | quitar ≠ eliminar | `quitarDeOpd` ≠ `eliminarCosas`; dos comandos y dos textos | WP-3a, WP-15 | `cosas.test`, e2e 15 | enforzado |
| T-252 | operaciones mínimas del canvas | flujos §7.3 | WP-15, WP-16 | e2e 4–15 | enforzado |
| T-260 | validador integrado | `diagnosticar` | WP-5 | `diagnostico.test` | enforzado |
| T-261 | diagnóstico tipado con acción | `Diagnostico` | WP-5 | `diagnostico.test` | enforzado |
| T-263 | proceso sin transformación (con herencia) | `proceso-sin-transformacion` | WP-5 | `diagnostico.test` | enforzado |
| T-265 | advertir 21–25 cosas | `opd-denso` | WP-5 | `diagnostico.test` | enforzado |
| T-268 | manejador no ambiental ⇒ advertir | la matriz no lo restringe; `manejador-no-ambiental` | WP-2, WP-5 | `matriz.test`, `diagnostico.test`, e2e 23 | enforzado |
| T-280 | `canon-diagrama` | `exportarDiagrama` (fuente incrustada) | WP-8b | `exportar.test`, e2e 19 | enforzado |
| T-281 | `canon-documento` | `exportarDocumento` | WP-8b | `exportar.test` | enforzado |
| T-282 | OPL Markdown completo | `generarDocumentoOpl` | WP-7 | `generar.test` | enforzado |
| T-283 | gates del export canónico | `gatesExportacion` | WP-5, WP-8b | `exportar.test`, e2e 19 | **parcial (B-22: exención >25)** |
| T-286 | JSON v0 con el mismo `formato` | `exportarV0` | WP-6 | `codec-fijo.test` | enforzado |
| T-287 | import: rechaza refs rotas, normaliza opcionales, nombres idénticos | `importarV0` etapas 3–4 (DS-7) | WP-6 | `codec.test` | enforzado |
| T-289 | OPDs por id persistente | `Id`; el OPL resuelve `SDx.y` | WP-1, WP-9 | `codec.test`, `editor-opl.test` | enforzado |
| T-300 | pruebas de plantillas y vocabulario | suites de §10.3 | WP-7 | `plantillas.test`, `vocabulario.test` | enforzado |
| T-301 | suite de roundtrip desde vacío | tabla 9.2 + escisión + abanicos | WP-9 | `roundtrip-tabla92`, `roundtrip-matriz` | enforzado |
| T-302 | leyes safe-lens | `lente.test` | WP-9 | `lente.test` | enforzado |
| T-303 | checklist del Anexo A como gate | `AGENTS.md` §11.2 + suites de §10.1 | WP-0, WP-19 | revisión de cambios | enforzado |

Los requisitos **no ★** con estado ≠ `enforzado` están todos en la tabla de Brechas de §11.3. Los
demás no ★ se prueban en su WP con su T-ID en el título, por ejemplo:

- T-017 y T-109 (`Current`), T-020 (valor), T-034/T-118/T-217 (incompleta), T-035 (género);
- T-050 (tipo), T-057 (con B-04), T-058, T-061, T-081, T-088–T-091;
- T-120, T-121 (enforzado por DS-8), T-123, T-124 (con B-08), T-128, T-129 (con DS-10), T-138, T-139;
- T-154, T-163, T-165, T-169, T-175, T-183, T-205, T-207, T-218, T-219, T-222, T-225, T-226;
- T-229 se cumple por ausencia: no hay grilla, snap ni guías inteligentes, y las guías de banda no
  usan el dash de afiliación (e2e 12 comprueba que la guía de banda no lleva `stroke-dasharray: 8 4`;
  CC-04);
- T-231, T-244–T-247, T-250, T-253, T-254, T-262, T-264, T-267, T-269, T-272, T-285, T-288 (con
  B-12), T-304 y T-305.

---

## 13. Riesgos, sobresimplificación y mitigaciones

### 13.1 Riesgos de sobresimplificación de SYNTHESIS §8 (los 21, resueltos)

| # | Riesgo | Resolución | Dónde se prueba |
|---|---|---|---|
| 1 | Datos de producción con extensiones (`esApunte`, familias por preestado, anclas, notas, piezas, `Estado.duracion`) | El importador descarta cada campo **con su ruta**. La migración escribe un informe por modelo y archiva cada payload original; antes se hace `pg_dump` (§9.4-2). Las familias por preestado dejan varios efectos sobre el mismo par: se **cargan** como `enlace-invalido` (R-ROL-UNIC-1, recuperable), nunca se fusionan en silencio | `codec.test`, `migrar-postgres.test` |
| 2 | Consumidores externos (`hd-opm`, skill, `mesa`, golden HODOM) | El contrato es JSON v0 + API HTTP + token Bearer (DECISIONS 13), en `formato-v0.md`. El export satisface los tipos v0 actuales; el servidor canonicaliza lo que llega (422 si hay pérdidas); la igualdad byte a byte del HODOM se reemplaza por la ley de punto fijo | `codec-fijo.test`, `principal.test` |
| 3 | Superficie OPL nueva y AND compuesto | Se abandonan la clasificación compuesta y el AND agrupado en la emisión (DECISIONS 20); el parser acepta ENT3; los `.opl.txt` viejos se retiran | `analizar.test`, `generar.test` |
| 4 | Vista del padre derivada (fuerza, R-PREC) | Una prueba por nivel de fuerza y por celda 3×3 en WP-4p, **antes** de retirar las proyecciones persistidas; el importador las ignora recién en WP-6 | `proyeccion.test` |
| 5 | Reemplazar JointJS sin red | 40 golden revisados a ojo; marcadores literales contra el canon; reductor de gestos puro; e2e de estados, enlaces, reanclaje y abanicos; toda la geometría es derivada | `golden.test`, `gestos.test`, e2e 5–13, 22 |
| 6 | Simulación y probabilidades | Se retiran (DECISIONS 9). El import las descarta con informe; `Pr=` da `unsupported-canonical` o `non-canonical` | `codec.test`, `analizar.test` |
| 7 | Sin deshacer, búsqueda ni tabla de enlaces | Deshacer y rehacer por instantáneas (200 pasos, fusión por gesto, vuelve al OPD); `Ctrl+K` para cosas y OPDs; «Enlaces (N)» en Propiedades y «Filtrar por selección» en el OPL | e2e 14, 15, 20, 25 |
| 8 | Sin versiones ni local-first | Copias previas en el servidor (30, cada ≥10 min); papelera de 30 días, también para versiones reemplazadas; borrador en IndexedDB; descarga JSON; respaldo diario; CAS | `almacen.test`, `guardado.test`, e2e 21 |
| 9 | Unicidad nominal frente a duplicados | **No se rechaza ni se renombra** (DS-7): se carga con `nombre-duplicado` (error) y una reparación de un clic («Aplicar a los N»); en edición, la colisión ofrece «traer esa misma cosa» | `codec.test`, `diagnostico.test`, e2e 18 |
| 10 | DR-11 lento en el in-zoom | `D`, nombres encadenados (↵ secuencia, ⇧↵ paralelo) y ⎋: un gesto, un paso de deshacer, sin semillas | e2e 11 |
| 11 | Import tolerante que persiste grafos inválidos | Lo representable se carga como error que **bloquea el export canónico** por gate; lo no representable se descarta por elemento con informe; el almacén solo guarda documentos con forma | `codec.test`, `diagnostico.test`, `exportar.test` |
| 12 | Capturador de bugs como único canal de feedback | Fuera (DECISIONS 11). Queda el límite de error por panel con «Copiar detalle» (sin contenido del modelo) y el README indica dónde reportar | revisión |
| 13 | CANON.md derivado y 4 decisiones pendientes | Canon vendorizado en `canon/`; `especificacion.md` declarada derivada; DR-5, DR-10, DR-18 y DR-23 fijadas por DECISIONS 1–4 y registradas (B-01, B-02, B-03) | — |
| 14 | Pruebas primero | Cada WP abre con sus pruebas; las leyes y sondas se reexpresan antes del código que protegen; WP-1 deja los contratos para programar contra ellos | revisión por WP |
| 15 | Licencia: el historial conserva lo retirado | Declarado en `NOTICE.md`; purgar el historial es decisión del dueño | — |
| 16 | DR-2 sin T-153 rompe el roundtrip desde vacío | D1/D3 «solo si difieren», la mención mínima D2 (DS-2) y la creación por tipografía entran **juntas** en WP-9, con `roundtrip-matriz` como gate | `roundtrip-matriz.test` |
| 17 | Retirar `canvas/operacionesBatch.ts` en bloque | `traerCosa`, `quitarDeOpd` y `eliminarCosas` nacen en el núcleo en WP-3a con pruebas; lo viejo solo se retira en la rama, que no llega a producción sin los e2e 14–15 | `cosas.test`, e2e 14, 15 |
| 18 | Retirar el diálogo de abrir modelos | La Biblioteca en lista simple es WP-14, y sus e2e 2–3 son condición de merge | e2e 2, 3 |
| 19 | Migrar el par TS3 | El import fusiona consumo(estado) + resultado(estado) del mismo par, fuera de abanico, en un `efecto` con el id del consumo; `efectoEscindido` pasa a `escision`; cada fusión queda en el informe | `codec.test`, `codec-derivados.test` |
| 20 | Cotas de excepción en el enlace | `tiempoMaximo`/`tiempoMinimo` pasan a `duracion.max/min` de la fuente; ante conflicto se conserva la primera; EX1/EX2 salen con el número | `codec.test`, `generar.test` |
| 21 | La visibilidad derivada cambia el OPL por OPD | Etapa 12: `informe.visibilidad` por OPD, en el diálogo de importación (como OPL) y en el informe de migración; el operador lo revisa en el ensayo (§9.4-4) | `codec-visibilidad.test` |

### 13.2 Ítems de SYNTHESIS §10.2 marcados FALTA, CONTRADICE, PARCIAL o N/A

| Req. | Estado previo | Mecanismo nuevo | Prueba |
|---|---|---|---|
| T-001 ★ | FALTA | `docs/conformidad.md` con Brechas exhaustivas (§11.3), `registro` en cada fila de código y la regla de AGENTS | revisión del diff |
| T-025 ★ | PARCIAL | `lexico.ts` valida al nombrar con error visible; ninguna operación ni el import reescriben nombres; la reparación es explícita (DS-7) | `lexico.test`, `codec.test`, e2e 4 |
| T-053 ★ | PARCIAL | R-ROL-UNIC-1 distributiva sobre ancestros y descendientes; el segundo gesto ofrece completar el cambio, un abanico o cambiar el tipo; en OPL, TS1+TS2 del mismo par dan `enlace-invalido-firma` con la acción «usa `cambia … de … a …`» | `matriz.test`, `editor-opl.test`, e2e 8 |
| T-060 ★ | CONTRADICE | R-DIST-1/AP-06/AP-21 en la matriz (lo cargado es error con reparación `distribuirEnlace`) + distribución 0→n + enlace tardío distribuido | `matriz.test`, `refinamiento.test` |
| T-062 ★ | CONTRADICE | `crearCosa`, `agregarEstado`, `agregarSubprocesos` y `agregarRefinadores` exigen nombre; in-zoom y despliegue sin semillas | `cosas.test`, e2e 4, 6, 11 |
| T-063 ★ | N/A (no existía) | `cambiarTipoCosa` + cierre DS-20 | `cosas.test` |
| T-074 ★ | FALTA | escisión 0→≥2, más DS-4 (con control o en abanico: entero) | `refinamiento.test`, e2e 11 |
| T-075 ★ | CONTRADICE | toda migración mueve el **mismo** enlace | `refinamiento.test` |
| T-079 ★ | FALTA | precondición `externo-no-refinable` | `refinamiento.test` |
| T-081 | FALTA | `traerCosa` y `moverApariciones` rebotan al externo con traza; el alcance es dato | `cosas.test`, e2e 11 |
| T-100 ★ | PARCIAL | `opdsEnPreorden` (DFS por `orden`) como única función de orden: panel, export y documento; lo que no está en ningún OPD se declara (B-26) y bloquea `canon-documento` | `proyeccion.test`, `generar.test`, `diagnostico.test` |
| T-101 ★ | FALTA | D6 con estados visibles y «y otros estados»; reconstrucción local por `sincronizar-estados` | `generar.test`, e2e 6 |
| T-116 ★ | CONTRADICE | IV2 `se invoca a sí mismo.` sin demora (el tipo no tiene demora, DECISIONS 21) | `generar.test` |
| T-125 ★ | PARCIAL | CX1 con `, en esa secuencia` solo en el bloque del hijo | `generar.test` |
| T-126 ★ | CONTRADICE | CX3 `se despliega en SDx en …` | `generar.test` |
| T-139 | CONTRADICE | los modos de esencia solo en líneas `soloDisplay` | `generar.test` |
| T-153 ★ | FALTA | el planificador crea por tipografía, una vez, y resuelve por `claveNombre` | `editor-opl.test`, `roundtrip-matriz.test` |
| T-155 ★ | PARCIAL | todo candidato pasa por la matriz; una violación da `type-mismatch` y `enlace-invalido-firma` con la regla | `analizar.test`, `editor-opl.test` |
| T-157 ★ | FALTA | `NO_CANONIZADAS` da `non-canonical` sin mutar, incluido `Pr=` fuera de abanico | `analizar.test` |
| T-158 ★ | PARCIAL | una tipografía contradictoria da `no-aplicable` con el detalle y dos acciones (renombrar la existente, otro nombre) | `editor-opl.test` |
| T-161 ★ | FALTA | plantilla COND-ALT (solo parseo) | `analizar.test` |
| T-165 | FALTA | TS3 sobre vacío crea el objeto (tipografía), sus estados y el efecto | `roundtrip-matriz.test` |
| T-166 ★ | CONTRADICE | `crear-refinamiento` + `fijar-orden` (crea los faltantes, fija las bandas); un miembro ajeno da `referencia-ambigua` | `editor-opl.test` |
| T-170 ★ | FALTA | SE1 residual (paso 5 del analizador) | `analizar.test` |
| T-182 ★ | PARCIAL | una sola codificación del efecto; idempotencia por identidad de enlace; comparación contra la vista | `editor-opl.test`, e2e 26 |
| T-192 ★ | PARCIAL | enumeración (~700 casos) + `azar` (200) + tabla 9.2 + documento (pasadas A/B) | `roundtrip-*.test` |
| T-228 ★ | CONTRADICE | diagnóstico solo en su panel; `dibujar` no tiene capa de validación | `exportar.test`, e2e 18 |
| T-263 ★ | PARCIAL | un solo código `proceso-sin-transformacion` (warning) con herencia y subprocesos; se retira el duplicado `error` | `diagnostico.test` |
| T-268 ★ | CONTRADICE | la matriz no restringe la afiliación del manejador; `manejador-no-ambiental` es warning con reparación | `matriz.test`, `diagnostico.test`, e2e 23 |
| T-281 ★, T-283 ★ | PARCIAL | `canon-documento` HTML autocontenido con la fuente; gates >25, <2 y error, sin bloquear la edición (exención registrada, B-22) | `exportar.test`, e2e 19 |
| T-284 | PARCIAL | advertencias de cruces, atravesamientos y solapes en el menú antes de exportar (B-15) | `exportar.test` |

Los que el crítico encontró CUMPLE (T-080, T-162, T-164, T-171, T-172, T-175, T-241, T-246,
T-247, T-248, T-251, T-262, T-265) se conservan con prueba propia en su WP. T-262 queda como
diagnóstico `cosa-sin-aparicion` (DS-6), no como invariante.

### 13.3 Dolores de UX de SYNTHESIS §7 y su mecanismo

| Dolor | Mecanismo |
|---|---|
| UX-01: el editor OPL no es idempotente | DS-12 (el editor libre no renombra), comparación contra la vista, una sola codificación del efecto; e2e 26 |
| Lienzo al 42 %, toolbar desbordada, cuatro señales de guardado | riel de árbol bajo 1600 px, lienzo ≥ 70 % a 1440×900; paleta flotante de 4 verbos; un indicador de guardado; una franja |
| Vista frágil (zoom que salta, cosas fuera de vista, `Ctrl+0` oculto) | DS-22: se encuadra al cambiar de OPD y nada más mueve la cámara; ⤢ visible |
| Puertas metodológicas obligatorias | ninguna: la metodología es diagnóstico (A1.1) |
| Descubribilidad (paleta de 60 ítems, menús sin verbos, ids internos en el inspector) | menú contextual y atajos derivados de un registro; Propiedades sin ids; Ayuda generada del registro |
| Estados (renombre sin foco, menú que se cierra, línea que cruza el rótulo, backticks literales) | `S` y `F2` abren el campo con foco; el extremo se elige arrastrando hasta la cápsula; el recorte en el borde de la cápsula; los tokens OPL con estilo |
| Manipulación directa de enlaces | reanclaje uniforme (DS-9); segundo gesto; teclas `E` `C` `M` `X` |
| «(1 oraciones)», glifos de Mac en Linux | `plural()`; atajos por plataforma |
| Cadenas de regresión (estados x/y, simulación, dirección del efecto, placeholders, flechas, puertos, viewport, `?`) | geometría de estados derivada; sin simulación; una dirección del efecto; sin placeholders; marcadores literales con golden; sin puertos; un solo servicio de cámara; `?` probado en códec, matriz y OPL |

### 13.4 Distinciones que este diseño se niega a colapsar

1. **Quitar de este OPD ≠ eliminar del modelo** (T-251): dos operaciones, dos atajos, dos textos.
   Quitar nunca borra hechos (DS-6).
2. **Forma ≠ contexto**: lo irrepresentable se descarta por elemento con informe; lo inválido en
   contexto se carga y se marca (P8).
3. **`unsupported-canonical` ≠ `non-canonical` ≠ `syntax-error`**: tres respuestas y tres tablas.
4. **Consumo + resultado ≠ efecto**; **TS4/TS5 escindido ≠ standalone** (`escision`).
5. **Colección incompleta declarada ≠ de vista.**
6. **Contenedor, interno y externo** como alcance persistido; la geometría no lo cambia.
7. **Canónico ≠ display** (esencia, numeración, cabeceras).
8. **Etiqueta `SDx.y` ≠ id de OPD.**
9. **Bidireccional ≠ recíproco**, y **generalización ≠ especialización de estado** (DS-8).
10. **Abstracción por fuerza** con la matriz R-PREC completa, no «el más fuerte gana».
11. **AP-27 error ≠ warning**, según los previos sean omisibles.
12. **Evento de objeto ambiental** puede quedar en el contorno; el de objeto sistémico no.
13. **Advertir ≠ bloquear**: solo `error` bloquea, y solo el export canónico.
14. **Reparación sugerida ≠ normalización**: nada se corrige sin un clic del operador (DS-7).

### 13.5 Banderas rojas de los jueces y su resolución

| Juez · diseño | Bandera roja | Resolución en este diseño |
|---|---|---|
| canon · A | TS3 con modificador escindido en mitades que no admiten control | DS-4: con control, o en abanico, migra entero al primero con traza (§4.5.3) |
| canon · A, B | Multiplicidad en efecto con estados sin hueco en TS3–TS5: se pierde en silencio | `NO_OFRECIDO` `nf-mult-sin-hueco` (B-04): no se ofrece, la operación la rechaza y el import la descarta con informe |
| canon/simple/ux · A | Sin búsqueda, selección múltiple, Bearer ni copias previas (DECISIONS 6, 10, 13, 22) | `Ctrl+K` (§7.3-15), selección mínima (§7.3-25), Bearer (§8.2) y previas rotadas (§8.3) |
| canon · B | DB-5: excepción a R-ROL-UNIC-1 para consumo+resultado con ruta | **no se adopta**: R-ROL-UNIC-1 estricta; el conflicto se convierte en ayuda con `Alternativa` (segundo gesto) |
| canon · B, C | `eliminarCosa` en cascada sobre refinamientos rompe T-083 | DS-5: `tiene-refinamiento`; solo se eliminan hojas con `eliminarRefinamiento` |
| canon · B | T-303 sin tratar | lista de cierre del Anexo A transcrita en `AGENTS.md` (§11.2), con suites por gate (§10.1) |
| canon · C | El import rechaza todo el documento ante un estructural con estado, incluida la especialización de estado | P8 + DS-8: la especialización de estado se carga (implementada); en los demás estructurales se descarta solo el anclaje, con informe |
| canon · C | Omisiones en el registro (DR-13/R-VIS-HIJO-1, T-230, exención >25, AP-14) | B-19, B-21, B-22, B-23 y B-24 en §11.3; trazabilidad ★ completa y verificada (180/180) en §12.6 |
| simple · A | Importador sin fusión TS3 (errores PAR_UNICO masivos) | etapa 7: fusión consumo(estado)+resultado(estado) en TS3 |
| simple · A, B | Canon en `docs/canon/` | `canon/` en la raíz con `LEEME.md` y sha256 (DECISIONS 16) |
| simple · B | Portapapeles Ctrl+C/X/V | no hay portapapeles (DECISIONS 22); traer se hace por `Ctrl+K` |
| simple · B | `conformidad.test.ts` lee `docs/` | ninguna prueba lee `docs/` (§1.5) |
| simple/ux · B | Cosa sin enlaces sin oración canónica | DS-2: mención mínima D2 |
| simple · C | Rechazo del import por violaciones de forma | P8: nunca se rechaza el documento por canon; solo por ilegibilidad |
| simple · C | Renombrar datos del modelador al importar | DS-7: nombres tal cual, error recuperable y reparación de un clic |
| simple · C | Extraer Bocetos y crear enlaces de agregación | DS-18: se descarta el OPD (nunca los hechos); la descomposición de objeto pasa a despliegue **sin crear enlaces** |
| simple · C | Invariantes de producto no canónicas (≥1 aparición, enlace siempre visible) que hacen que quitar elimine | DS-6: son diagnósticos (T-262), no invariantes; quitar nunca elimina |
| ux · A | Error de flujo en el in-zoom (distribuye al primer subproceso) | la entrada encadenada crea todos los subprocesos en **una** operación (DS-3); reanclaje uniforme para corregir (DS-9) |
| ux · C | `canon-diagrama` sin fuente incrustada | DS-21: Inria Serif en base64 en SVG y HTML; métricas medidas en Chromium |
| ux · C | Rechazo total del import por forma (HODOM en `rechazados/`) | P8; el migrador solo rechaza JSON ilegible, referencias rotas o ids duplicados en una colección, con el payload archivado |

Hay también **mejoras injertadas que no eran banderas rojas**:

- modos T-230 (B);
- `LineaOpl.id` y el resaltado de 2 s (B);
- metas de rendimiento con falla a 3× (B);
- `azar.ts` y la matriz transcrita a mano (B);
- la propiedad `tiposLegales ≡ crearEnlace` y los títulos con T-ID (A);
- el conflicto sin pérdida (A);
- las advertencias en el menú antes de exportar (A);
- el riel de árbol bajo 1600 px (A);
- el diálogo de reingreso y el aviso de versión nueva (B);
- deshacer que vuelve al OPD (B);
- las teclas por contexto (B);
- crear el destino desde el modo enlace (B);
- RF2b sin coma y RF2i (A);
- la ruta en ramas de abanico (A, B).

**No se adoptan**, con su porqué:

- `migracionAutomatica` (B DB-4): persiste un campo sin semántica OPM (T-006) y contradice «luego la
  reasignación es del modelador» (T-076). Su necesidad la cubren DS-3 y DS-9.
- La paleta de comandos y las puertas múltiples de B: una sola puerta por acción.
- La heurística de nombres de máquina para agentes (B DB-16): la reemplaza el info `agente-humano`.
- El SVG por `innerHTML` (A): lo reemplaza `NodoSvg` con identidad por `key`.
- Los enlaces tipados con 14 pares de nombres de rol de C: se reducen a tres pares
  (`objeto/proceso`, `origen/destino`, `refinable/refinador`) más `extremos()`. Así el código
  genérico (proyección, geometría, reanclaje) no depende de 14 formas, sin perder la
  irrepresentabilidad.

### 13.6 Riesgos propios de este diseño

| Riesgo | Probabilidad / impacto | Mitigación |
|---|---|---|
| La enumeración de la matriz crece más allá de lo ejecutable | media / media | dimensiones por pares (no producto completo) para abanico × control × multiplicidad × ruta; tope de 3 s; falla si se excede |
| El cierre DS-20 (errores de contexto nuevos) es caro en modelos grandes | media / media | `erroresContexto` memoizado por identidad, más una variante incremental sobre los enlaces afectados si `rendimiento.test` supera 3 ms |
| El orden por nombre (DS-1) sorprende al operador acostumbrado al orden de creación | alta / baja | es determinista y estable; el canon solo pide determinismo; declarado en `decisiones.md` |
| Las métricas de la tabla no coinciden con Chromium y los rótulos desbordan | media / media | la tabla se mide en Chromium desde el woff2 real; e2e 5 con tolerancia 2 %; la fuente va incrustada en los exports |
| Modelos migrados con muchos errores de canon cargados (bloquean el export) | alta / media | «Aplicar a los N» por código; las reparaciones se listan en el informe de migración; la edición nunca se bloquea |
| Cosas sin aparición acumuladas tras descartar Bocetos o vistas | media / baja | diagnóstico `cosa-sin-aparicion` con «Buscar › Traer»; conteo en el informe |
| Un agente externo escribe un v0 con pérdidas y recibe 422 | media / baja | el 422 trae el informe completo; `?aceptarPerdidas=1` es explícito; documentado |
| El mutex en memoria supone un solo proceso | baja / alta | `container_name` fijo y un solo servicio; el CAS por contenido detecta cualquier escritura concurrente residual |
| Pérdidas del migrador que el operador no ve | media / alta | ensayo obligatorio con revisión humana, originales archivados, volumen PostgreSQL conservado y rollback por tag |
| El cambio de flujo (sin pestañas, versiones, simulación ni tabla de enlaces) incomoda al operador | alta / media | decisiones del dueño (DECISIONS 6, 7, 9, 10) declaradas; sustitutos concretos |
| Veintiún paquetes y un cambio de golpe en producción | media / alta | rama aislada, contratos y pruebas primero, e2e contra el build real, transición con ensayo y rollback. **Una suite verde no equivale a validación humana del modelado**: la aceptación final exige que el operador abra, recorra y edite tres modelos grandes migrados antes de retirar el stack viejo |
| Un cambio futuro del códec deja archivos que ya no son su punto fijo | media / alta | abrir y arrancar exigen solo `importarV0` (CC-14); lo que se descarte se muestra antes de editar y el primer guardado deja el original en la papelera |

---

## Correcciones de cobertura

Crítica adversarial de cobertura sobre este documento. Método:

- Recorrido fila por fila de las 248 de CANON.md §9 (180 ★ y 68 no ★) contra el mecanismo, la prueba
  y el registro. Tras las correcciones, §12.6 cubre 180/180 ★ con su estado, y toda fila no ★ con
  DEBE o NO DEBE tiene mecanismo nombrado o fila B-nn (§11.3, ahora B-01…B-27). La comprobación de
  ★ se hizo por script sobre ambas tablas.
- Contraste del importador con `understand/serializacion-persistencia.md`,
  `understand/modelo-nucleo.md` y el código de `pre-rehacer` que decide la compatibilidad
  (`serializacion/validarNormalizacion.ts`, `modelo/operaciones/refinamiento/proyeccion.ts`,
  `serializacion/validarEnlaces.ts`, `scripts/model-persistence-api.ts`): codificaciones de extremos,
  TS3 y escisión, abanicos (también los derivados), refinamientos, apariciones y envoltorios.
- Revisión de los contratos entre §3, §4, §5, §6, §7.6 y §8, y del grafo de §12 (dependencias
  ocultas, propiedad de archivos y aceptación ejecutable).

Las correcciones se citan en el cuerpo como `CC-nn` (distintas de las combinaciones `C-nn` de
spec-OPL §8.3). Ejes: **(1)** cobertura del canon · **(2)** «ni más ni menos» · **(3)** capacidad perdida
(import, persistencia, export, navegación) · **(4)** coherencia de contratos · **(5)** plan
ejecutable.

| # | Eje | Hallazgo | Corrección (dónde) |
|---|---|---|---|
| CC-01 | 1 | T-100 ★ («cubre todo el modelo cargado») figuraba `enforzado`, pero una cosa sin aparición o un enlace sin vista (DS-6) no cae en ningún bloque: `canon-documento` y el OPL Markdown los omitían en silencio (T-010). | Gate `'modelo'` también por `cosa-sin-aparicion`/`enlace-sin-vista`; aviso en «OPL Markdown»; nueva **B-26**; T-100 pasa a `parcial` (§4.4, §6.8, §11.3, §12.6, §13.2; e2e 19). |
| CC-02 | 1 | T-091 exige propagar lo ambiental «al crear la exhibición» y «por la cadena estructural»; solo se propagaba al fijar la afiliación del exhibidor y en `desplegar`, nunca en `crearEnlace` de exhibición (OPL `exhibe` incluido), y sin transitividad. | `crearEnlace` de exhibición propaga con traza; `fijarAfiliacion` propaga por la cadena transitiva de exhibición; `afiliacion-incoherente` mira la cadena (§4.2, §4.4, WP-3b). |
| CC-03 | 1 | T-020: un `valor` quedaba huérfano (sin exhibición, sin oración VAL) al eliminar o cambiar la exhibición, y el import cargaba `valorSlot` sin exhibidor: hecho sin OPL en silencio. | Invariante **F-13**; las operaciones que dejan el valor sin exhibición lo retiran con traza; el import lo descarta con informe (§3.2, §3.4.2-4, §4.2). |
| CC-04 | 2 · 1 | La grilla (`Mayús+G`, `vista.grilla`) es PUEDE (R-OPD-UI-6) y no infraestructura mínima; además el diseño no fijaba ni snap ni el dash de las guías de banda (T-229). | Se retira la grilla; T-229 se cumple por ausencia; las guías de banda son trazo continuo, nunca `8 4` (§6.2, §6.7, §7.4, §7.6, §11.2, §12.6). |
| CC-05 | 2 | `Ctrl+Mayús+M` «solo lienzo» duplicaba `Ctrl+\` + `Ctrl+.` (T-247 ya cubierto). | Se retira el tercer conmutador y `paneles.soloLienzo` (§7.1, §7.4, §7.6). |
| CC-06 | 2 · 4 | `etiqueta-no-minuscula` (warning) duplicaba `etiqueta-fuera-de-lexico` (error): la etiqueta es `frase_no_capitalizada` en la EBNF y `fijarEtiqueta` ya la rechaza al nombrar (DECISIONS 19). | Se retira el código; `etiqueta-fuera-de-lexico` cubre la parte de T-266; `etiqueta-larga` queda como heurística en B-14 (§4.4, §11.3). |
| CC-07 | 3 | El importador **rechazaba** `padreId` colgante, autorreferente o en ciclo, y dos refinamientos del mismo OPD; v0 (`normalizarModelo`, «nunca rechaza») los sana colgándolos de la raíz. Además, «padre ausente» elegía un OPD distinto de la raíz. Documentos que hoy abren dejarían de abrir. | `padreId` inválido ⇒ ausente ⇒ raíz, como v0; ciclos rotos; refinamientos duplicados conservan uno y descartan el resto (§1.1 P8, §3.4.2-3/6). |
| CC-08 | 3 | Envoltorios: el sobre de recuperación no decía qué tomar, y los paquetes `opforja.portable-package` v1 existentes (el dossier exige leerlos) no se aceptaban; el Apéndice F llama `apariciones` a lo que v0 llama `apariencias`. | Se toma `document.snapshotJson`; se lee el paquete portátil (digest verificado, revisión seleccionada); alias `apariciones` (§3.4.2-1/2, §7.3-3). |
| CC-09 | 3 | Un mismo id en dos colecciones (bundles externos) era rechazo del documento, contra P8. | Se reasigna en la colección posterior con informe; solo es rechazo el duplicado dentro de una colección (§1.1, §3.3, §3.4.2-2). |
| CC-10 | 3 | `opds[].enlaces[*].vertices/symbolPos/symbolAnchors/labelPositions` no figuraban en ninguna lista: caían en «campo desconocido» ⇒ `descartado` ⇒ 422 del servidor ante un v0 legítimo. `orderedFundamentalTypes` (marca `ordered`, extensión) iba a `ignorado` y ocultaba su pérdida. | Esos campos van a `ignorado`; `orderedFundamentalTypes` a `descartado` (B-16) (§3.4.2-4/6). |
| CC-11 | 3 | La fusión consumo(s₁)+resultado(s₂) → TS3 descartaba la ruta y la multiplicidad aunque ambos enlaces son representables (P8: solo se descarta lo irrepresentable); y no decía cómo mapear los derivados del resultado fusionado. | Se fusiona solo sin pérdida; si hay ruta o multiplicidad se cargan ambos como error R-ROL-UNIC-1; la fusión registra un alias y, con derivados, se escinde conservando los dos ids (§3.4.2-7/8). |
| CC-12 | 4 | Etapa 12: comparar `opds[o].enlaces` con «`proyectar`» sin precisar daba diffs espurios (abstraídos del padre como «desaparecidos», abanicos «aparecidos» en cada OPD) y rompía la promesa «un v0 exportado por este códec da diff vacío», de la que dependen `informeVacio` y `leerCanonico`. | Definición exacta con `directos`/`abstraidos` y regla de abanicos alineada con la regla de `opdId` del export (§3.4.2-12). |
| CC-13 | 3 · 4 | Las cotas de excepción se movían a `duracion` de la fuente, campo que el lector v0 (consumidores externos, rollback) descarta; la lista de diferencias para lectores v0 omitía los enlaces sin vista, el agente informacional y el manejador sistémico. | El export escribe también las cotas en el enlace (concepto v0) y el import las reconoce como derivadas; lista de diferencias completa en §3.4.4 y §9.4. |
| CC-14 | 3 | Persistencia ante la evolución del códec: abrir exigía `leerCanonico` y el servidor movía a `invalidos/` «lo que no parsea», así que un archivo escrito por una versión anterior del códec podía quedar inabrible o retirado. | Leer exige solo `importarV0`; lo no canónico se abre y se recanonicaliza; si hay `descartado`, informe previo y primer guardado con `?respaldo=1` (§3.4.4, §8.3, §8.4). |
| CC-15 | 3 | El guardado no trataba 404 (eliminado en otra pestaña), 400/413/422 ni la salida del editor con cambios pendientes. | Estados `eliminado` y `error`, «Guardarlo de nuevo», salida que guarda primero, marca «cambios sin subir» en la Biblioteca; `AlmacenLocal.ids()` y `Editor.guardarDeNuevo()` (§7.3-24, §7.6, §8.4, §10.6). |
| CC-16 | 3 | Reimportar una descarga o una copia previa daba 409 (el import conservaba `modelo.id`), y ni `:id` ni `modelo.id` se validaban (ruta fuera de `modelos/`, choque con `.tmp-*`). | Importar desde la Biblioteca asigna siempre `m-…` nuevo; `ID_MODELO` en rutas, `POST` y migración (§3.3, §3.4.1, §7.3-3, §8.1, §10.6). |
| CC-17 | 3 | Migración: la PK vieja es `(tenant_id, id)` y dos tenants podían sobrescribirse; el trabajo local-first de IndexedDB (`saved-here`/`conflict`) no está en PostgreSQL y se perdía en la transición. | Colisión ⇒ `m-…` nuevo con informe; paso previo obligatorio de vaciar el carril local-first o descargar su recuperación (§3.3, §8.6, §9.4, §10.6). |
| CC-18 | 3 · 4 | «Modelo JSON» se describía como «los bytes que guarda el servidor», que no incluyen los cambios aún no guardados (T-286: instantánea). | Export = `exportarV0` del estado actual; e2e 19 compara tras «Guardado» (§6.8, §10.7). |
| CC-19 | 4 | `servidor/migrar-postgres.ts` usa `diagnosticar` de `nucleo/`, contra «el servidor solo depende del códec»; el índice del servidor necesitaba contar cosas sin nucleo. | La migración pasa a `herramientas/` (mismo binario en la imagen); `codec.resumen()`; `bun run check` incluye `herramientas` (§2.1, §2.2, §3.4.1, §8.6, §9.1, §10.1, WP-12). |
| CC-20 | 4 | `Gesto.encadenando.modo` admitía `'estados'` y `Mayús+↵` «confirmar y otro» parecía aplicar a estados, contra DECISIONS 18 (uno por gesto). | Se retira `'estados'`; `Mayús+↵` solo para cosas (§7.4, §7.6). |
| CC-21 | 4 · 5 | §4.5.3 decía que la distribución era «la misma función» para el import, lo que hacía depender el códec (WP-6, ola 1) de `nucleo/refinamiento.ts` (WP-4r, ola 3). | La etapa 8 es mapeo de datos; lo que queda contra el canon se carga como error con reparación `distribuirEnlace` (§3.4.2-8, §4.5.3). |
| CC-22 | 4 | Preorden y etiquetas `SDx.y` tenían dos implementaciones posibles (`Indice` de WP-1 y `proyeccion.ts` de WP-4p). | Una sola, en `indice.ts`; `etiquetaOpd`/`opdsEnPreorden` la leen (§4.7, WP-4p). |
| CC-23 | 5 | Dependencias ocultas y aceptación no ejecutable: WP-3a/3b usan visibilidad (WP-4p); `propiedades.test` con secuencias necesitaba WP-3a; «cada reparación aplicada lo resuelve» (WP-5) necesitaba operaciones de 3a/3b/4r; `codec-fijo.test` usaba `aplicarPlan` (WP-9); los golden de fixtures importan v0 (WP-6); `lineasNuevas` usa `generarModelo` (WP-7); los e2e de WP-14/15/16 se necesitan entre sí; `docker compose build` no tiene entrada en la ola 1; `rendimiento.test` no tenía dueño; `opl/documento.ts` lo tocan WP-7 y WP-9. | Dependencias y aceptaciones corregidas en §12.2 y §12.4; `secuencias.test` y `reparaciones.test` pasan a WP-4r; la ley T-196 queda solo en `lente.test`; WP-14–16 se integran como un tren cuyos e2e ejecuta WP-17; verificación de imagen de WP-18 en la ola 4; `rendimiento.test` es de WP-10; tercer archivo compartido declarado. El grafo resultante es acíclico por olas. |
| CC-24 | 1 · 3 | T-078 ★: F-7 no prohibía que un OPD refinara la cosa refinada de un ancestro, así que un ciclo de refinamiento llegado por import pasaba la forma. | F-7 lo prohíbe; el import descarta ese OPD con su subárbol (DS-18), sin tocar hechos (§3.2, §3.4.2-6). |
| CC-25 | 4 | Eliminar un refinamiento dejaba huecos en `orden`, contra F-7 (densos). | `eliminarRefinamiento` renumera los hermanos (§4.5.6). |
| CC-26 | 3 | v0 persiste abanicos **derivados** en los OPD hijos (`proyectarAbanicosExternosDerivados`, `port-fan-ref-…`); al descartar sus ramas derivadas quedaban con <2 ramas y se informaban como `descartado`, una pérdida falsa que además dispara 422. | Se reconocen como proyección y van a `ignorado` (§3.4.2-9, §10.4). |
| CC-27 | 1 | DS-2 emite D2 en el canónico como mención mínima, contra el literal de T-106 ★ / DR-2 («D2 no se emite»), sin fila en el registro (R-CONF-7). | Nueva **B-27** (desvío consciente a favor de T-190); T-106 pasa a `parcial` (§1.6, §11.3, §12.6). |

Revisados y **sin cambio**:

- Eje 2: DS-9 (reanclar en todos los tipos) lo exigen T-076 y T-075 (el modelador reasigna enlaces
  migrados sin perder su id); DS-16 (materializar la vista al eliminar un refinamiento) evita perder
  los hechos del padre (T-080); búsqueda, selección múltiple, papelera, copias previas, token y
  deshacer son DECISIONS 5, 6, 7, 10, 13 y 22; «Aplicar a los N» ejecuta la acción canónica que
  exige T-261 con las mismas operaciones. No se encontró otra capacidad fuera del canon o de la
  infraestructura mínima.
- Eje 1: el resto de las filas de §9 tiene mecanismo y prueba nombrados; el círculo de 18 px de las
  marcas `e`/`c` es el «badge control» del catálogo de spec-OPD §18, no un glifo nuevo.
- Eje 3: navegación en modelos grandes (árbol con riel, ruta, `Ctrl+K` sobre cosas y OPDs, `Alt+↑`,
  historial del navegador, encuadre DS-22, filtro del OPL por selección, «Enlaces (N)») sin cambio;
  el esquema PostgreSQL de §8.6 coincide con `scripts/model-persistence-api.ts` (columnas de
  `opforja_models`, `opforja_model_autosaves.creado_en`, `opforja_accounts.password_hash`).
