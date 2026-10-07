# Plan de implementación de opforja rehecho

**Reanudación DEC 29–32:** sobre `rehacer`, desde `e287ba9` o posterior. Primero las
correcciones solicitadas (pasos 1+2 publicados en `26935f4`, paso 3 en `5d23f8a`; paso 4 publicado en `69aee956` tras check1906/0, TSC0, exit0 y revisión única GLOBAL_FAVORABLE de ola 1–4; WP-9 publicado2abecc6; WP-13 publicado bc22451d, H2 cerrado y reanudado por frase directa; WP-10 publicado c94178fa tras check2783/0/TSC0/exit0 y aceptación técnica de dirección), después el plan pendiente; DEC 30 exige protocolo ligero y una
revisión por ola. La preparación de DEC 28 queda como antecedente, sin recrear rama ni tag.

Qué se construye: el diseño de [`../design/DESIGN.md`](../design/DESIGN.md). Es un modelador
OPM bimodal OPD/OPL que implementa lo que el canon exige a la herramienta, ni más ni menos, con un
servidor mínimo sobre archivos. El plan legible por máquina está en [`plan.json`](plan.json): olas,
dependencias, archivos propios, lecturas y aceptación de cada paquete.

## Autoridad

1. [`../canon/`](../canon/): los cuatro documentos. Mandan ante cualquier conflicto.
2. [`../DECISIONS.md`](../DECISIONS.md): decisiones fijas del dueño (1–32). No se reabren.
3. [`../understand/CANON.md`](../understand/CANON.md): requisitos T-NNN y decisiones DR-n
   derivados del canon.
4. [`../design/DESIGN.md`](../design/DESIGN.md): contratos, flujos y plan (§12). Un contrato
   solo cambia con una propuesta en `HANDOFF.md`, nunca en solitario.

Decisiones de la revisión ya aplicadas al diseño:

- D1 y D4 concuerdan en género (DS-26).
- La simulación sale (B-21).
- El contrato externo es JSON v0 + API con token (DESIGN §8).

## Mapa de rutas mientras dure la implementación

DESIGN usa las rutas del repositorio final. Hasta que WP-19 cierre, equivalen a estas:

| En DESIGN | Durante la implementación |
|---|---|
| `canon/` | WP-0 lo crea copiando byte a byte `docs/rehacer/canon/` |
| `docs/especificacion.md` | `docs/rehacer/understand/CANON.md` (WP-19 lo mueve) |
| `understand/…`, `SYNTHESIS.md`, dossiers | `docs/rehacer/understand/…` |
| `DECISIONS.md` | `docs/rehacer/DECISIONS.md` |
| `pre-rehacer:<ruta>` | código anterior, legible con `git show pre-rehacer:<ruta>` |
| sondas `probe_critico*` | no se versionaron; sus hallazgos están en `SYNTHESIS.md` §10 |

`docs/rehacer/` se conserva hasta WP-19 (DESIGN §11.4). Es la fuente del plan.

## Preparación (paso 0)

1. En h289, en `~/projects/deep-opm-pro`: `git status` sin cambios versionados pendientes (si los
   hay, detenerse y avisar; no se descartan), `git switch main` y `git pull --ff-only origin main`.
2. Preparación ya realizada: `rehacer` y tag `pre-rehacer` (`513ac041f6eb91dc8bf0eb5319a492eb6ff25f6d`).
   No se recrean. La reanudación parte de `e287ba99f64d5f49e4322dbb55d0fb643baa4ec9`.
3. Entorno: Bun 1.3.x y Chromium de Playwright (si no existe `/opt/pw-browsers`, el de la
   máquina). El corpus KORA no hace falta, porque el canon está versionado.
4. Línea base del código anterior, solo como referencia: `cd app && bun install && bun run check`.
   Hoy fallan 14 pruebas de anclaje y composición que dependen de un backend; no bloquean nada.

## Olas e hitos

| Ola | Paquetes | Cómo corren |
|---|---|---|
| 0 | WP-0 → WP-1 | en serie |
| 1 | WP-2, WP-4p, WP-6, WP-8a, WP-11, WP-18 | en paralelo; WP-6 se integra tras WP-4p y WP-11 tras WP-6; WP-18 solo redacta |
| 2 | WP-3a, WP-3b, WP-5, WP-7, WP-8b | en paralelo; los gates de WP-8b se integran tras WP-5 |
| 3 | WP-4r → WP-9; WP-13 | WP-13 corre cuando cierran sus dependencias; WP-17 se redacta |
| 4 | WP-10, WP-12 y el tren de UI (WP-14, WP-15, WP-16) | el tren se integra junto; se verifica la imagen de WP-18 |
| 5 | WP-17 → WP-19 | e2e completos, documentación final y PR `rehacer` → `main` |

Hitos de revisión con el dueño:

- **H1, tras la ola 1.** Contratos, matriz, proyección, códec, geometría y servidor en verde. Los 6
  fixtures v0 importan bien. B-28 declara la equivalencia con distribución refinada pendiente de
  WP-4r/H2; H1 no acredita esa integración mediante stubs.
- **H2, tras la ola 3.** Núcleo, diagnóstico, OPL de ida y vuelta, y editor. El roundtrip estricto
  por enumeración de la matriz da verde, y la equivalencia menú/creación por resultado efectivo de
  distribución refinada real tiene sus propiedades verdes (WP-4r, integración N de B-28).
- **H3, tras la ola 5.** UI completa y 26 e2e en verde. Hay PR abierto y nada desplegado.

## Protocolo por paquete

1. Leer **solo** las `lecturas` del paquete en `plan.json`, más esta página. Las secciones de
   DESIGN se ubican por su encabezado (`grep -n '^#' docs/rehacer/design/DESIGN.md`).
2. Escribir primero las pruebas. Cada prueba de requisito se titula con su T-ID
   (`test('T-043 …')`), así `bun test -t T-043` la encuentra.
3. Tocar solo los `archivos` del paquete. Los archivos compartidos declarados se tocan en
   serie (DESIGN §12.1):
   - `app/src/pruebas/{azar.ts,azar.test.ts}`: WP-1 crea el generador de modelos; WP-4r
     agrega y prueba `azar.acciones(m)` sin retirar API ni cobertura anteriores.
   - `app/package.json`, `app/vite.config.ts` y `app/playwright.config.ts`: WP-0 crea el andamiaje; WP-18 integra en serie el layout de DESIGN §9.1;
   - `app/playwright.config.ts`: WP-17 registra en serie `globalSetup: './e2e/global-setup.ts'` y puerto validado por `e2e/configuracion.ts` en use.baseURL/PORT/webServer.url; el resto del config de WP-18 byteexacto; Chromium desde `PW_CHROMIUM` se selecciona en el fixture propio de `e2e/**`.
   - `nucleo/enlaces.ts`;
   - `nucleo/cosas.ts`;
   - `nucleo/resultado.test.ts`: WP-3a agrega únicamente `violacionesForma` al doble aislado, con fallo explícito si se invoca; sin cambiar casos, cuerpos ni expectativas de WP-1. WP-3b agrega después únicamente `violacionesAbanico`, `normalizarEtiquetas` y `violacionesContexto` con la misma guarda; mantiene íntegros los cinco casos.
   - `opl/documento.ts`.
   - WP-9 comparte serialmente `opl/plantillas.ts` sólo en `reconocer.nombre()` (género explícito) y D2 (esencia informacional), con su regresión. Comparte `nucleo/{indice.ts,indice.test.ts}` sólo para memo acotada de `claveNombre` por entrada textual exacta; transformación y WeakMap del índice intactas. Resolución técnica de dirección bajo el encargo directo de la inversa y su coste, sin decisión semántica nueva.
   - `opl/contratos.test.ts`: WP-7 sustituye sólo las cinco expectativas temporales de generación por checks reales de §5.4/§5.7; conserva literalmente las seis asignaciones de firmas, el bucle `typeof` y `importarOpl` pendiente. WP-9 sustituye sólo la expectativa restante de `importarOpl`, concretada en su turno conforme a §5.7 y sus pruebas nativas, conservando los otros checks.
   - `nucleo/matriz.ts`: WP-2 produce consulta y normalización; WP-4r agrega el ensayo compartido
     de distribución.
   - `nucleo/{proyeccion.ts,proyeccion.test.ts,frontera.test.ts}`: WP-4p produce; WP-5 integra en serie continuidad R+C y metadata conforme a DESIGN §4.4/§4.6, sin retirar cobertura previa. DEC 29 limita los abanicos a extremo común en borde de cosa y conserva estados no comunes por rama (T-054/T-086/T-216); los grupos retirados no aparecen en Vista, y su importación conserva enlaces, estados y procedencia. DEC 31–32 realizan §4.6 pasos 2/4: internas elevadas ocultas y Tabla 27 temporal, con simétrica para orden desconocido; nueve celdas y ley de frontera independiente. Verificación mediante pruebas nativas, check y una revisión por ola (DEC 30). Paso 3 incluye adaptación serial mínima de `nucleo/estados.test.ts` para LF-03: E→R temporal conserva ambos anclajes; la banda paralela conserva el control de supresión local permitido.
   - `nucleo/proyeccion.ts`: WP-4r reutiliza en serie la selección existente del hecho de mayor fuerza para materializar su id original (DS-16, §4.5.6). Propiedad mínima: extracción/exportación del helper interno y su consumo por fusionar y refinamiento, con resultados de Vista idénticos, ramas de conflicto/continuidad, controles dentro de clase y empates vigentes; suites previas y ley de frontera conservadas. Exige RED nativo, GREEN, check nuevo y revisión de la ola (DEC 30).
   - `nucleo/propiedades.test.ts`: WP-3b prueba creación sin refinamientos; WP-4r amplía la
     integración refinada sin retirar la cobertura anterior.
   - DEC 29: sólo abanicos con extremo común en borde de cosa; estados no comunes preservados.
     Común en estado y TS3 sin literal completo se rechazan/importan como enlaces sueltos con
     informe B-06. HAR-7 y sus firmas permanecen intactos; no hay dialecto textual adicional.
   - WP-9 comparte serialmente `opl/{generar.ts,generar.test.ts}` sólo para reutilizar salida readonly por identidad Modelo/OPD/opciones, con paridad y resistencia a contaminación; no se cachea un modelo importado ni una validación.
   - WP-10 comparte serialmente `pruebas/azar.ts` sólo para perfil `hodom` de DESIGN §2.4; conserva cuerpos históricos estricto/completo y acciones200×40. Conducción operativa bajo la reanudación directa actual, sin nueva autorización humana delegada.
   - WP-10 comparte serialmente `codec/v0.ts` (colación natural idéntica), `nucleo/matriz.ts` sólo `colision` y `nucleo/herencia.ts` sólo `generales`, usando incidencia existente/mismoorden/DFS; suites mínimas de paridad. No altera reglas/JSON/DS20 ni añade cachés de validaciones/Tx/Modelos.
4. Ninguna regla OPM vive fuera de `nucleo/matriz.ts` o `nucleo/diagnostico.ts`. Ninguna oración
   OPL vive fuera de `opl/plantillas.ts`. Toda mutación es una `Operacion` registrada.
5. Cerrar con `cd app && bun run check` en verde, más las verificaciones de `aceptacion`. Ninguna
   prueba se debilita, se salta ni se pone en cuarentena para pasar.
6. Hacer **un commit semántico por paquete**, en español, por ejemplo
   `feat(nucleo): matriz de validez única (WP-2)`, con los T-ID que cierra. Lo acompaña cualquier
   fila nueva B-nn del registro de conformidad.
7. Actualizar el tablero de `HANDOFF.md` y hacer push a `origin/rehacer`.

## Ejecución

Un solo agente escribe, un paquete a la vez, en este orden lineal, que respeta todas las
dependencias de `plan.json`:

`WP-0 → WP-1 → WP-2 → WP-4p → WP-6 → WP-8a → WP-11 → WP-18 → WP-3a → WP-3b → WP-5 → WP-7 →
WP-8b → WP-4r → WP-9 → WP-13 → WP-10 → WP-12 → WP-14 → WP-15 → WP-16 → WP-17 → WP-19`

- WP-18 se redacta en su turno; la verificación de su imagen se hace después de WP-14.
- WP-14, WP-15 y WP-16 se cierran con `bun run check` y `bun run build`; sus e2e los ejecuta WP-17.
- La opción A de la frontera menú/creación, resuelta por coordinación delegada en HANDOFF,
  conserva este orden: WP-2 prueba etiquetas pendientes/completas y reglas nativas; WP-3b ejecuta
  propiedades reales sin refinamientos; WP-4r implementa la distribución pura única consumida por
  consulta, creación y reparación y completa las propiedades refinadas. B-28 permanece explícita
  en conformidad/HANDOFF hasta esa aceptación. DS-20 usa siempre el original anterior a insertar
  frente al resultado efectivo final; nunca un borrador intermedio como modelo previo.
- Entre paquetes no se pregunta si seguir. Una ambigüedad que el canon y DESIGN dejan abierta se
  resuelve con la opción más simple que los respete y se anota en `HANDOFF.md`.
- Al cerrar cada ola, el agente relee el diff de la ola contra el canon y DESIGN (firma, OPL
  literal, roundtrip y brechas sin registro) y corrige antes de seguir.
- Un golden SVG nuevo o cambiado no se acepta sin abrir el SVG y mirarlo.
- Mientras WP-0 no reescriba `AGENTS.md`, si el vigente contradice este plan (por ejemplo, al pedir
  usar el corpus KORA instalado), manda el plan: el canon son los cuatro documentos de
  `docs/rehacer/canon/`.

## Continuidad

Cada paquete cerrado queda con commit y push. `HANDOFF.md` es el tablero único: estado de cada
paquete con su commit, decisiones tomadas sin el dueño y resultados de cada hito. Si la sesión se
interrumpe, la siguiente lee el tablero, verifica `bun run check` en `origin/rehacer` y sigue con
el primer paquete pendiente.

## Prohibido en la sesión de implementación

- Desplegar, tocar producción o ejecutar la migración real desde PostgreSQL. El procedimiento
  queda escrito (DESIGN §9.4) y requiere autorización explícita, solo mediante `./deploy/deploy.sh`.
- Hacer merge a `main` sin aprobación del dueño. WP-19 solo abre el PR.
- Agregar capacidades fuera de alcance (DESIGN §1.3) o reabrir decisiones fijas.
- Dejar una brecha sin registro: todo DEBE no cumplido va a `docs/conformidad.md` en el mismo
  commit.

## Costo y duración

Estudio, canon y diseño consumieron unos 15 M tokens de subagentes y chocaron dos veces con el
límite de sesión. La implementación costará eso o más y ocupará varias ventanas de límite. Los
hitos H1–H3 son los puntos naturales para pausar.

## Después del plan

- Revisión humana de tres modelos grandes migrados (DESIGN §13.6) y aprobación del PR.
- Despliegue autorizado según DESIGN §9.4.
- Fuera de este repositorio (DECISIONS 27): actualizar las referencias de la skill
  `modelamiento-opm` en KORA al contrato JSON v0 + API con token.

## WP-9 — propiedad serial y cierre

La propiedad compartida mínima cubre reconocer.nombre/D2 y tokensPlantilla/helpers privados en plantillas.ts, generación readonly por identidad/opciones y líneas/cabeceras derivadas acotadas en generar.ts, memo nominal exacta en indice.ts, comparación JSON equivalente en matriz.ts y mostrarUno sin anclas en enlaces.ts, con sus controles pertinentes. Patrones, reglas, firmas, IDs, hechos, operaciones, gates y distribución se conservan; ninguna entrada se congela. No hay caché NUEVA de validaciones/Tx/Modelos importados; memo existente intacta. Paridad frente a previo, pureza y coste completo son obligaciones; ensayos y retiradas están íntegros en bitácora.

Cierre actual: check6 íntegro **2653/0, TSC0, exit0**,1.328.208expectativas/54archivos; T192 **2940,09ms** con5786propuestas/2996modelos/2734imports reales/258reusos exactos/2992comparaciones. Siete suites,200semillas×2perfiles,Tabla9.2 y composición generativa mantienen dimensiones/gates. Publicado2abecc6 por dirección; WP-13 publicado bc22451d, H2 cerrado y reanudado por frase directa; WP-10 publicado c94178fa tras check2783/0/TSC0/exit0 y aceptación técnica de dirección, revisión conjunta WP9+WP13 GLOBAL_FAVORABLE y aceptación técnica de dirección. UI/ISO y las diez parciales permanecen fuera del crédito de este cierre WP-9.

## WP-13 — seams de realización

Editor conserva firmas e incorpora canales efímeros tipados para solicitudes de UI/cámara/paneles/vista y decisiones de import/salida, con scheduler inyectable. DTO cliente conserva metadata HTTP ya contratada. Propiedad serial mínima de vite.config.ts: insertar versión del bundle desde OPFORJA_VERSION de build, sin ejecutar infra/deploy. Realización con cuatro suites y núcleo/Plan manual: check2756/0/TSC0/exit0 (59 archivos), focal103/0. Chromium offline acredita IndexedDB entre instancias/recarga y aborto real; probe Vite acredita versión independiente y PUT CAS. En el corte H2, build completo exit1 por main.tsx pendiente; WP-14 ya resuelve la entrada y acredita build total verde. Revisión conjunta WP9+WP13 GLOBAL_FAVORABLE tras las tres correcciones documentales; dirección acepta WP-13/criterios H2. WP-13 publicado bc22451d y H2 detenido; reanudación directa permitió WP-10 publicado y WP-12 aceptado técnicamente en el alcance de fuentes falsas. Dirección conserva Git. No se acredita UI por editor.

## WP-10 — resultado actual

Dos suites integran seis fixtures reales, el sintético histórico y perfil HODOM válido de262cosas/192estados/433enlaces/36OPDs. Auto-reparseo de49OPDs conserva identidad/JSON e Informe; cuatro fixtures y HODOM reconstruyen el documento completo desde base nueva. OnStar/Async/Sync conservan6/14/9gates, sin limpiar datos ni llamarlos strict. Las ocho metas de§2.4 pasan con dos identidades independientes, incluidos DS20 real y1000líneas canónicas. Perfilado causal reparó sólo colación v0 e incidencia colision/generales; paridad208exports,1229consultas y416RespuestasDS20 frente al previo. Check2 nuevo2783/0/TSC0/exit0,1.333.190expectativas/62archivos/80,81s; T192 histórica2883,634ms y contadores intactos. Primer check falló sólo dos montajes tipados, preservados y corregidos sin cambiar datos. Sin cachés nuevas de validación/Tx/Modelos importados; memoErrores existente intacto. Dirección acepta técnicamente WP-10/criterios del plan; publicado c94178fa con paridad verificada. Git/verificación de publicación corresponden a dirección y revisión formal única ola4 favorable al cierre deWP16; WP-12 publicado6c99b17; WP-14 publicado efbe04a y WP-15 publicado ed5e0f8; WP-16 realiza paneles. Diez parciales, UI de lienzo/paneles/ISO e imagenDocker fuera deH3 mantienen sus límites; build total realizado por WP14.

## WP-12 — herramienta con fuente falsa

Propiedad de migrar-postgres.ts y su suite: FuenteLegada/SQL/I/O inyectados, seis consultas SELECT parametrizadas y TEXT[] explícito; timestamps TEXT del legado conservan precisión. Originales/versiones/índices, diferencias y todo Informe/diagnóstico se recuperan; instalaciones usan identidades confinadas y nunca sobrescriben. Ensayo separado escribe los mismos modelos, verificar usa leerCanonico sin mutar rutas ni bytes. Ocho categorías/nueve filas más negativos de tenants, cuenta, rutas/symlinks, fechas, UTF8 y fallo de instalación ejercen núcleo/códec reales. Crédito exclusivamente herramienta sobre fuentes falsas y temporales propios; sin migración real ni conexión PostgreSQL. Cierre actual, aceptado técnicamente por dirección: check4 íntegro **2815/0, TSC0, exit0**,1.334.053expectativas/63archivos/82,80s; focal373/0. Ocho metas§2.4 pasan y T192 completa2805,57ms conserva2996modelos/2734imports/258reusos/5786propuestas. CLI final compilada/verificar0válido y1inválido sin SQL ni mutación. WP-12 publicado6c99b17 con paridad verificada por dirección; revisión formal única ola4 favorable al cierre deWP16, WP-14 publicado efbe04a; WP-16 en realización.

Propiedad serial técnica mínima WP-12: plantillas.ts exclusivamente cmp privado de datosContexto (colación española sensitivity:base compartida, fallback de IDs intacto) y APPEND plantillas.test.ts. Paridad completa contra fuente previa/todas opciones, sin nueva caché ni cambio de plantillas/bandas/conjunciones. Se añaden sólo dos guardas privadas seriales: proyeccion.visto evita reasignar Set/camino si el extremo ya está resuelto (incluido undefined), y matriz.rolCero excluye tipos que nunca forman instrumento/efecto. Seam serial mínimo adicional herencia.generales: retorno [] nuevo cuando incidencia no contiene generalización saliente calificante, conservando DFS literal para el resto. APPEND de las tres suites y paridad Vista/contexto/DS20/documentos contra previos realmente conectados; generar.ts, reglas y ocho umbrales permanecen intactos.

## WP-14 — armazón realizado

UI/armazón/main según plan, con suite nativa armazon.test y probes sobre build/servidor temporal. Seam serial mínimo editor/estado.ts sólo texto GET original en solicitud Informe con descartes y APPEND guardado.test; campo existente, sin nueva API ni semántica. Biblioteca usa GET/renombrarModelo/PUT CAS e import/reidentificación/POST; reparaciones exclusivamente opt-in mediante operaciones nucleares sobre candidato aún no abierto. Edición abierta conserva Editor.ejecutar como commit único. App/Editor/estilos admiten integración serial de ranuras tipadas WP15/16 sin importarlas antes de existir.


Candidato final WP-14: check íntegro **2824/0, TSC0, exit0**,1.334.099expectativas/64archivos/82,94s; T192 completa2885,512ms conserva2996/2992/2734/258/5786. Build6 total exit0, versión wp14-probe alineada con servidor temporal. Probes13/15 contra cuenta/almacenamiento/núcleo reales, transportes413/422/503 explícitamente sintéticos, pageErrors0/externos0.25PNG observados individualmente,8finales refrescan ranuras/Franja y estados complementarios. Original Blob byteexacto/BOM/UTF8 fatal, informes inicial/servidor preservados, reparaciones nucleares opt-in, CAS/401/borrador/404 y restaurar sin retry/pérdidas. Lienzo/paneles son ranuras tipadas sin contenido simulado;26escenarios/WP17, UI completa/ISO y formal ola4 pendientes. Git y aceptación de dirección; WP15 sólo tras relevo. Historial de fallos/montajes y límites en bitácora/recibo scratch, sin ceremonia adicional.


## WP-15 — propiedad de integración

Los seis componentes propios consumen escena/dibujar, tiposLegales, reducirGesto y Editor reales. Integración serial mínima App/Editor/estilos sólo para ranura de lienzo, solicitudes propias y capa UI; suite lienzo.test de bindings materiales. Sin productores canónicos/reglas paralelas ni paneles WP16. WP14 publicado efbe04a por dirección; WP15 activo.


WP15 admite serialmente editor/estado.ts sólo para obtener etiquetaAccion(modelo,a) antes de aplicar/commit; APPEND estado.test contrasta Franja humana, gesto/undo/pureza. Registro único nuclear existente, sin mapa UI de operaciones ni cambio de firma/modelo. Conducción técnica de dirección bajo mandato humano vigente, no nueva autorización material.

WP15 admite serialmente enlaces.ts exclusivamente helper privado duplicado y APPEND enlaces.test: rechazo temprano tipo/extremos distintos y firma local diferida hasta primera comparación elegible, manteniendo datos/orden/find/predicados/refs/DS20. Diagnóstico18 tras REDcoste3107/3033; optimización operativa bajo mandato directo, sin contrato/API/cache nuevo ; la firma V3 se realiza bajo autorización directa posterior.

WP15: autorización humana directa resuelve V3; propiedad serial enlaces.ts cambiarTipoEnlace con DatosEtiquetas/APPEND enlaces.test y binding existente Lienzo/MenuTipo/APPEND lienzo.test. rendimiento.test mide mediana de cinco identidades frescas tras una identidad de calentamiento, todos predicados y límites intactos; no nueva optimización del generador. Formal única al cerrar WP16, Git por dirección.

WP-15 publicado ed5e0f8: seis componentes de lienzo integrados, V3 cambiarTipoEnlace con DatosEtiquetas en una transacción y un undo, Franja desde etiquetaAccion. Check nuevo2855/0/TSC0/1.334.558/65archivos/80,76s, build total verde; T192 completa2828,152ms con corpus2996/2992/2734/258/5786 intacto. Ocho metas usan warmup separado y mediana de cinco identidades frescas, límites intactos. Browser afectado V3b/V3c acredita mismo ID, ambas etiquetas, recíproco, invalidación y undo; cuatro vistas finales1×/densidad2× observadas, offline y sin errores. Paneles WP16/e2e26/ISO pendientes, revisión única al cerrar WP16. Git y publicación por dirección; siguiente WP16 tras relevo.


## WP-16 — realización de paneles

WP15 publicado ed5e0f8 por dirección. Siete componentes propios y paneles.test consumen Editor/núcleo/OPL/exports reales. Integración serial mínima App/Editor/estilos e index.html únicamente para ranuras, solicitudes, navegación push/pop con ID instalado, árbol emergente y arranque. Sin reglas paralelas ni optimización del generador; la única ampliación de firma es sentido, autorizada directamente y realizada en§4.2. RED pertinente, check/build/browser y observación individual antes de entrega. Formal única ola4 favorable al cierre WP16; Git por dirección.

WP16 — candidato final tras la autorización directa de sentido: cambiarTipoEnlace conserva omisión/V3 y construye ambos extremos, tipo y etiquetas en una sola transacción. Estados/multiplicidades siguen los roles y sus dueños compatibles, incluido el etiquetado reflexivo; pérdidas efectivas, normalización, DS20, identidad y un undo permanecen. Lienzo transmite OpcionTipo.sentido y resuelve enlaces nucleares del peine sin exigir arista dibujada. MenuTipoEnlace conserva botones nativos, diálogo visible en390 y restauración de foco. Introducción★/B26/T150 de conformidad corregidas;31brechas/180★/10parciales intactas.

Recorrido nativo:11 enlaces existentes ×2 contextos de datos ×30 opciones=660 opciones consultadas; se realiza cada legal:true y se compara con su candidato crudo, cubriendo15tipos y ambos sentidos, sin excluir legales. Dominio finito declarado: sin datos o etiquetas distintas; las etiquetas iguales tienen control separado literal de recíproco y traza R-STRE-1, conservando intención consultada conforme§4.3.4. No afirma universalidad sobre valores infinitos. Controles de omisión/{}/anclajes/multiplicidades/escisión/abanicos/rollback y pureza permanecen.

Gate final nuevo: **2884/0, TSC0, exit0**,1.335.290expectativas/66archivos/81,00s; T192 completa2899,613ms conserva2996/2992/2734/258/5786 y ocho metas. Build8 total0, versión wp16-sentido alineada con servidor temporal. Browser8/10 reales:0errores/externos,13PNG finales abiertos individualmente a1×; cambio directo/inverso con/sin datos, teclado y botones nativos, inválidos, recíproco, ID/secuencia/undo, foco/trap/Escape/confirmar/cancelar desktop y390. El solape de etiquetas del fixture conserva geometría/avisosB15; ningún productor canónico/generador/canon/códec cambia. Antecedentes2872 y check previo a última guarda permanecen sólo en bitácora. La misma revisión ola4 cerró GLOBAL_FAVORABLE; dirección acepta WP16/criterios del plan, cerrado en este commit. Dirección conserva Git y verifica publicación; WP17 tras SHA remoto verificado y relevo.

WP-17 propiedad serial mínima: `servidor/cuenta.ts` exclusivamente guard CLI fuente/compilado y APPEND `servidor/cuenta.test.ts` con entradas compiladas reales. El build empaqueta el módulo importado y `import.meta.main` solo no distingue la entrada; no cambia lógica/validación/autenticación.

WP-17 propiedad serial mínima: Lienzo.tsx sólo binding de multiplicidad y APPEND lienzo.test; matriz/campos reales, destino por defecto y origen con Mayús; sin validación paralela. Browser9 conserva RED R-MULT-1 previo.

WP-17: dirección resuelve Supr sobre ≥2 cosas como Decisión de quitar apariciones, conservando hechos; Supr single y Mayús+Supr intactos. Propiedad mínima comandos.ts + APPEND comandos.test, canal existente k:tipo/opcion:confirmar-quitar sin modificar estado.ts, Lienzo/modal + APPEND lienzo.test. Refs y OPD capturados; cancelar nada, confirmar una operación/un undo, sin cambios nucleares.

WP-17: dirección asigna MenuTipoEnlace.tsx sólo representación/prioridad visual de completarCambio y APPEND lienzo.test. Browser8/9 alcanza estado literal y conserva RED de fila ausente (§7.3-8); opciones/índices/elegir(i)/matriz/gestos/render intactos. Controles nativos de alternativa/ID/undo inicialmente GREEN, sin atribuir RED ficticio.

WP-17 serial config: ruta absoluta a dist mediante fileURLToPath(new URL('./dist',import.meta.url)), compatible con Node de bun run e2e; sin cambio de package/Vite/arranque.
WP-17: MenuTipoEnlace precisa únicamente texto de alternativa abanicoCon («Abanico XOR/OR con el existente»); índices, callbacks, validación y resultado intactos.

WP-17: dirección resuelve seam mínimo gestos.ts sólo orientación de alternativa abanicoCon (resultado P→O, consumo/agente/instrumento O→P tras sentido), con APPEND gestos.test/lienzo.test. Browser14 RED R-EDIT-1; ninguna regla/matriz/forma/render nueva.

WP-17: precisión serial de gestos.ts incluye alternativa efecto abanicoCon ofrecida, con estados por extremos originales según matriz; APPEND de las suites ya declaradas, sin ampliar ofertas.


WP-17 realizado: comando `bun run e2e` genuino26/0/exit0, guardas0pageerrors/externos en todos los contextos, build/servidor compilados y datos sintéticos con versión e2e. Check final2896/0/TSC0/exit0 y build total0; T192 COMPLETA2963,107ms<3000, ocho metas/corpus intactos. Nueve capturas finales observadas individualmente, con límites B15/sectores estrechos. Reparaciones mínimas y RED históricos documentados en bitácora; sin nuevas reglas, render ni optimización del generador. WP17 cerrado y aceptado técnicamente en este commit por dirección, que publica/verifica; WP19 tras SHA remoto verificado/relevo y revisión formal única ola5 al cierreH3.
