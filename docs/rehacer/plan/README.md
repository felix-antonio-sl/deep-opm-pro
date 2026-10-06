# Plan de implementación de opforja rehecho

**Reanudación DEC 29–32:** sobre `rehacer`, desde `e287ba9` o posterior. Primero las
correcciones solicitadas (pasos 1+2 publicados en `26935f4`, paso 3 en `5d23f8a`; paso 4 publicado en `69aee956` tras check1906/0, TSC0, exit0 y revisión única GLOBAL_FAVORABLE de ola 1–4; WP-9 publicado2abecc6; WP-13 publicado bc22451d, H2 cerrado y reanudado por frase directa; WP-10 cerrado en este commit tras check2783/0/TSC0/exit0 y aceptación técnica de dirección), después el plan pendiente; DEC 30 exige protocolo ligero y una
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

Cierre actual: check6 íntegro **2653/0, TSC0, exit0**,1.328.208expectativas/54archivos; T192 **2940,09ms** con5786propuestas/2996modelos/2734imports reales/258reusos exactos/2992comparaciones. Siete suites,200semillas×2perfiles,Tabla9.2 y composición generativa mantienen dimensiones/gates. Publicado2abecc6 por dirección; WP-13 publicado bc22451d, H2 cerrado y reanudado por frase directa; WP-10 cerrado en este commit tras check2783/0/TSC0/exit0 y aceptación técnica de dirección, revisión conjunta WP9+WP13 GLOBAL_FAVORABLE y aceptación técnica de dirección. UI/WP10/ISO y las diez parciales permanecen fuera del crédito de este cierre.

## WP-13 — seams de realización

Editor conserva firmas e incorpora canales efímeros tipados para solicitudes de UI/cámara/paneles/vista y decisiones de import/salida, con scheduler inyectable. DTO cliente conserva metadata HTTP ya contratada. Propiedad serial mínima de vite.config.ts: insertar versión del bundle desde OPFORJA_VERSION de build, sin ejecutar infra/deploy. Realización con cuatro suites y núcleo/Plan manual: check2756/0/TSC0/exit0 (59 archivos), focal103/0. Chromium offline acredita IndexedDB entre instancias/recarga y aborto real; probe Vite acredita versión independiente y PUT CAS. Build completo exit1 porque main.tsx, previsto WP-14, todavía no existe; no se altera la entrada para fingir build verde. Revisión conjunta WP9+WP13 GLOBAL_FAVORABLE tras las tres correcciones documentales; dirección acepta WP-13/criterios H2. WP-13 publicado bc22451d y H2 detenido; reanudación directa activa WP-10. Dirección conserva Git. No se acredita UI por editor.

## WP-10 — resultado actual

Dos suites integran seis fixtures reales, el sintético histórico y perfil HODOM válido de262cosas/192estados/433enlaces/36OPDs. Auto-reparseo de49OPDs conserva identidad/JSON e Informe; cuatro fixtures y HODOM reconstruyen el documento completo desde base nueva. OnStar/Async/Sync conservan6/14/9gates, sin limpiar datos ni llamarlos strict. Las ocho metas de§2.4 pasan con dos identidades independientes, incluidos DS20 real y1000líneas canónicas. Perfilado causal reparó sólo colación v0 e incidencia colision/generales; paridad208exports,1229consultas y416RespuestasDS20 frente al previo. Check2 nuevo2783/0/TSC0/exit0,1.333.190expectativas/62archivos/80,81s; T192 histórica2883,634ms y contadores intactos. Primer check falló sólo dos montajes tipados, preservados y corregidos sin cambiar datos. Sin cachés nuevas de validación/Tx/Modelos importados; memoErrores existente intacto. Dirección acepta técnicamente WP-10/criterios del plan; WP-10 queda cerrado en este commit. Git/verificación de publicación corresponden a dirección y revisión formal única ola4 permanece pendiente; no se inicia WP-12 sin relevo. Diez parciales,UI/ISO/build completo WP14 e imagenDocker fuera deH3 mantienen sus límites.
