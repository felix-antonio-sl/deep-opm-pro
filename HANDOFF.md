# OpForja rehecho — tablero único

Estado: WP-0, WP-1, WP-2, WP-4p, WP-6, WP-8a, WP-11 y WP-3a cerrados y publicados. WP-18 cierra su turno de redacción y validación local, con check 568/0, focal de deploy 30/0 y revisión independiente de 28 casos distintos verdes. Los checks y seis fixtures de H1 están verdes, pero su revisión semántica se reabre por el hallazgo R+C/metadata de proyección documentado abajo. La aceptación de imagen de WP-18 sigue NO_EJECUTADO y diferida tras WP-14, sin dispensa. WP-3a cerró con check 646/0 y revisión independiente de 69 casos verdes. WP-3b queda cerrado con check íntegro nuevo 790/0 y revisión independiente favorable de 153 casos distintos; su único hunk de harness autorizado conserva los cinco casos. Sigue WP-5 en el orden lineal, con la propuesta R+C/B-29 todavía pendiente de resolución específica. H2/H3 pendientes. Las autorizaciones B y C+R se preservan; layout/ownership y volumen WP-18 ya se aplicaron documentalmente antes de código. DS-20/propiedad serial WP-4r y VAL WP-9 siguen autorizados y se aplicarán en sus turnos.
Rama `rehacer`; base y tag `pre-rehacer`: `513ac041`. La directora creó/publicó rama y tag.
WP-0: `b9d94180b5f587cdf125d8c4fabcf26edb5917c3`. La directora publica un commit por paquete.

## Autoridad y continuidad

La autoridad OPM es el canon vendorizado de `canon/`. Decisiones fijas: 1–28 de
`docs/rehacer/DECISIONS.md`. Contratos: `docs/rehacer/design/DESIGN.md`.
El [mapa temporal del plan](docs/rehacer/plan/README.md) resuelve las referencias a documentos
finales hasta WP-19; `docs/rehacer/` permanece íntegro. El dueño autorizó expresamente la propuesta
de colocación de §6.6. El contrato se registró antes de reanudar producción; WP-1 superó las tres
regresiones, el check y la revisión focal. WP-2 conserva el historial de las dos regresiones rojas;
la resolución delegada de la opción A se registró antes de modificar contratos y producción.
El candidato conserva check integrado verde y revisiones independientes de contrato y producto
favorables. El nuevo pedido del dueño retoma la publicación de WP-2 y la ejecución lineal; la
restricción local correspondía al incremento delegado anterior, cuyo recibo se conserva abajo.

## Tablero lineal

| Orden | Paquete | Estado | Commit |
|---:|---|---|---|
| 0 | WP-0 | Cerrado: aceptación y revisión verdes | `b9d94180b5f587cdf125d8c4fabcf26edb5917c3` |
| 1 | WP-1 | Cerrado: aceptación y revisión verdes; ajuste autorizado incorporado | `817061a7f8312aa495b9ad00190f7d30db11ca40` |
| 2 | WP-2 | Cerrado: aceptación y revisiones verdes; opción A incorporada | `c1472817f8b6bcfa1b825240a8ccfe5826e04ea4` |
| 3 | WP-4p | Cierre previo publicado; nuevo hallazgo R+C/metadata abierto para resolución en WP-5 | `ba5f8b5fd1fd39392f633795f0bb71cb356bd84c` |
| 4 | WP-6 | Cerrado: doce etapas, punto fijo, fixtures y revisión independiente verdes | `dcdbbf67e36c4e817c10485586e0ea29d5efa1ce` |
| 5 | WP-8a | Cerrado: geometría, paths, generador real y revisión verdes; T-216 corregida | `5ceb3cbaa3829a4cd7988fb8f0b10ac170bdfbfe` |
| 6 | WP-11 | Cerrado: B, preservación física, check y revisión completa verdes | `a82f2bdf2270132eb14891ce0967de7050eb20ff` |
| 7 | WP-18 | Cerrado turno de redacción: scripts/check/revisión verdes; imagen pendiente tras WP-14 | `978605960ff405b5cd50aa7a5fb673703ad4c286` |
| 8 | WP-3a | Cerrado: 21 operaciones, check 646/0 y revisión independiente de 69 casos verdes; ajuste mínimo autorizado aplicado; integración refinada espera WP-4r | `e9a849cea53786149ab288e9f86b098a5f59f33c` |
| 9 | WP-3b | Cerrado: HAR exacto autorizado, check íntegro nuevo 790/0 y revisión independiente favorable; 153 sondas conservadas, seis huellas verificadas; distribución refinada espera WP-4r | Este commit |
| 10 | WP-5 | Pendiente | — |
| 11 | WP-7 | Pendiente | — |
| 12 | WP-8b | Pendiente | — |
| 13 | WP-4r | Pendiente | — |
| 14 | WP-9 | Pendiente | — |
| 15 | WP-13 | Pendiente | — |
| 16 | WP-10 | Pendiente | — |
| 17 | WP-12 | Pendiente | — |
| 18 | WP-14 | Pendiente | — |
| 19 | WP-15 | Pendiente | — |
| 20 | WP-16 | Pendiente | — |
| 21 | WP-17 | Pendiente | — |
| 22 | WP-19 | Pendiente | — |

H1 (tras ola 1): checks y fixtures verdes; revisión semántica reabierta por continuidad R+C/metadata en proyección, sin aceptación definitiva hasta reparar. WP-18 cerró solo redacción; su aceptación de imagen sigue pendiente. H2 (tras ola 3) y H3 (tras ola 5): pendientes.
WP-18 verifica su imagen después de WP-14; WP-17 ejecuta los e2e completos.

## WP-0: realización y evidencia

- Antes de la implementación se escribieron cuatro pruebas de arquitectura/andamiaje. RED observado:
  `PATH=/tmp/opforja-rehacer-tools:$PATH bun test src/arquitectura.test.ts` desde `app/`:
  2 pass / 2 fail; fallaron la arquitectura antigua y sus dependencias directas retiradas.
- Se movieron primero seis `fixtures/demo-models/*.json` con `git mv` a `app/fixtures/v0/`,
  conservando los bytes. Después se retiraron 2402 rutas exclusivamente versionadas de §11.4.
  No se borraron directorios completos ni archivos ignorados. El historial queda en `pre-rehacer`.
- Canon: cuatro carpetas, ocho archivos `content.md`/`object.yaml`, copiados byte a byte;
  `canon/LEEME.md` registra versiones, SHA256, precedencia y actualización. Hashes verificados
  contra las fuentes. Los 48 archivos de `docs/rehacer/` se preservan; diff contra tag vacío.
- `AGENTS.md` transcribe exactamente el bloque de DESIGN §11.2 (sin su sangría Markdown).
- Configuración mínima con dos dependencias runtime y cinco de desarrollo de §2.2, versiones
  exactas de las ya instaladas en la base; lockfile regenerado. `bun install`: 45 paquetes
  transitivos instalados. No hay dependencias directas de JointJS/Zustand/AI/ESLint/fuentes retiradas.
- GREEN final: `PATH=/tmp/opforja-rehacer-tools:$PATH bun run check` desde `app/`: TypeScript
  estricto (src, servidor, e2e, herramientas y configs) + 8 pass / 0 fail, 45 expect.
  Los controles en memoria rechazan nucleo→ui, opl↔opd, servidor→nucleo directo/UI,
  código de producto→pruebas y dev→dominio. Admiten las aristas legales y el migrador explícito.
- Línea base antigua aportada por la directora: 3682 pass / 2 skip preexistentes / 0 fail.
  Es solo referencia histórica; las suites retiradas estaban expresamente autorizadas por §11.4.

## Corrección de revisión WP-0 — ronda 1

La revisión detectó que producto→archivo `*.test.ts` dentro de una capa legal seguía
permitido. Se añadieron primero cuatro casos negativos (UI/núcleo, con `.test.ts`
y `.test` sin extensión); el focal dio RED: 4 pass / 4 fail, 45 expect, código 1.
Se corrigió el guard para rechazar destinos de prueba además de `src/pruebas/`.
Se mantienen permisos desde archivos de prueba y helpers de `src/pruebas/`, con
controles positivos explícitos. Focal GREEN y `bun run check`: 8 pass / 0 fail,
45 expect, código 0. Comandos desde `app/`, siempre con el wrapper autorizado:
`PATH=/tmp/opforja-rehacer-tools:$PATH bun test src/arquitectura.test.ts` y
`PATH=/tmp/opforja-rehacer-tools:$PATH bun run check`.
Solo cambió el test/guard de arquitectura y esta evidencia; sin stage, commit ni push
adicional. No cambió el contrato ni se trabajó otro paquete.

## Supuestos menores y delimitación

- La aceptación «git ls-files no lista ninguna ruta de §11.4» se interpreta como ausencia del
  inventario antiguo retirado, con sustituciones nuevas autorizadas `src/arquitectura.test.ts`
  y `HANDOFF.md`, más las excepciones finales/docs/rehacer del propio §11.4. No exige ausencia
  absoluta de `app/src/` ni de las rutas enumeradas como reescrituras. El inventario de retirada
  se contrastó con el tag; los nuevos archivos no son supervivencia del código antiguo.
- Ownership aclarado por la directora: `.gitignore` raíz corresponde al andamiaje WP-0; conserva
  cada patrón previo para proteger los artefactos locales y añade datos de desarrollo/variantes
  `.env`. `app/.gitignore` conserva `_eval-output/`. `deploy/.gitignore`, si existe localmente,
  se conserva. Dockerfile/Compose/.dockerignore/deploy.sh se reescriben en WP-18;
  README/NOTICE/docs/README en WP-19. Los archivos antiguos de esas reescrituras siguen
  temporalmente en el árbol y no describen todavía el producto nuevo.
- WP-0 no crea main/UI, servidor, contratos ni stubs futuros. El HTML es una página estática
  explícita. Dev/build/e2e/golden tienen destinos finales preparados y necesitan paquetes
  posteriores; no se afirma arranque o empaquetado. Playwright apunta al artefacto compilado
  `dist/servidor/principal.js`. `OPFORJA_E2E_DATOS` permite que WP-17 suministre/limpie una ruta;
  sin ella, la config crea un temporal, lo exporta a los workers y limpia al salir solo el propio.
  Vite no carga archivos `.env` (`envDir:false`).
- El detector usa regex para imports literales (incluye import type/multilínea, export-from,
  require e import dinámico literal) y resuelve rutas relativas/absolutas. TypeScript no
  configura aliases (`paths`/`baseUrl`). No sustituye un parser AST ni analiza rutas computadas
  dinámicamente; esas formas no se necesitan en el andamiaje. No escribe archivos.

## Pendiente editorial WP-19

DESIGN §11.1 todavía dice «24 respuestas» y «DS-1…DS-25». La autoridad fija incluye
DECISIONS 25–28 y DS-26 (género D1/D4), que deben conservarse al redactar `docs/decisiones.md`.
Propuesta precisa para WP-19: actualizar ese inventario editorial a decisiones 1–28 y DS-1…DS-26.
No cambia una decisión ni un contrato técnico; no se modificó DESIGN. La propuesta técnica de WP-1 se describe abajo.

## Límites de la evidencia

El verde acredita retirada/andamiaje y los controles de arquitectura. Todavía no acredita
semántica OPM, OPD↔OPL, códec, render, servidor funcional, aceptación humana ni despliegue.
No se ejecutaron producción, contenedores, migración real, merge ni push a main.
El ejecutor no cambió ramas/tags ni hizo commit/push. No se leyeron credenciales ni `.env`.

## Revisión de cierre WP-0

La revisión independiente confirmó todas las aceptaciones y encontró un import de producto a
archivos de prueba que el guard permitía. Se corrigió con RED 4 pass / 4 fail y GREEN
8 pass / 0 fail, 45 aserciones, incluido check estricto. La revisión focal verificó la
corrección, con y sin extensión, y no encontró roturas nuevas. Canon, fixtures, 48 documentos
y AGENTS se verificaron también de forma independiente. H1–H3 siguen pendientes.


## WP-1: realización conservada y bloqueo contractual

Se implementaron los diez fundamentos y los tres helpers de pruebas, junto a todos los módulos
del árbol contractual del núcleo, códec, OPL, OPD y editor. Los futuros paquetes conservan stubs
con las firmas declaradas y cuerpos que lanzan `pendiente`; los archivos sin API declarada en las
lecturas autorizadas son módulos vacíos explícitos hasta su paquete propietario. No se escribieron
reglas de matriz, diagnóstico, proyección, códec, OPL, render ni editor operativo.

Los fundamentos incluyen tipos readonly exactos, ids, índice memoizado (árbol/etiquetas en una
sola implementación), EBNF/sugerencias/alomorfos, herencia transitiva múltiple con corte de ciclos,
F-1…F-13, transacciones con copia de camino/rollback/cierre DS-20, operaciones del modelo, registro
único de 47 operaciones con aplicación atómica y etiquetas en español, y colocación determinista.
Los constructores escriben Modelos literales congelados sin operaciones y cubren los 15 tipos.
La tabla de expectativas se transcribió independientemente desde CANON §2.1/§2.2; nunca se importa
desde producción.

### Evidencia y proceso WP-1

- RED inicial real contra módulos ausentes, antes de implementar los fundamentos cubiertos por
  esas suites. Logs y detalle: `/tmp/opforja-rehacer/WP-1-report.md`.
- Desviación declarada: hubo un borrador prematuro de `resultado`, `ids`, `operaciones` y de los
  auxiliares de colocación. Por instrucción de dirección se conservó fuera del repo en
  `/tmp/opforja-rehacer/WP-1-production-first-draft/`, se devolvieron esas implementaciones propias
  a stubs y se escribieron suites focales antes de reintegrar el menor GREEN revisado. RED real
  contra stubs: ids/transacción/registro; colocación: 1 pass / 2 fail. Esto documenta una frontera
  de pruebas restablecida; no se presenta como TDD original sin desviaciones.
- Se corrigieron defectos encontrados por pruebas: sombra de variable del constructor, retirada de
  descripción nula, alomorfo de «Hígado», rótulos de historial y referencias falsas heredadas de
  Object.prototype. Los últimos tres tienen RED focal y GREEN archivados.
- `PATH=/tmp/opforja-rehacer-tools:$PATH bun run check` (desde app) verde: 46 pass / 0 fail, 310 aserciones padre; resultado histórico anterior a la revisión,
  sustituido como estado final por el check rojo documentado abajo. TypeScript estricto y arquitectura incluidos.
- Fachadas padre con título T-ID por caso lanzan un hijo filtrado al mismo caso. Los procesos Bun
  hijos pasan también `--no-env-file`. `bun test -t 'T-032|T-028|T-030|T-078|T-020|T-093|T-043'`:
  8 pass / 0 fail; las fachadas ejecutan los requisitos, sin esconderlos bajo un T-303 genérico.
- `forma.test` verifica todos los F, incluidos referencias de estados, escisión bilateral,
  noOfrecido de enlace y abanico, árbol/ancestro/ciclo/orden, alcance, ids, duración, etiquetas,
  cajas y valor exhibido. Se validan 200 semillas y ambos perfiles de azar (400 modelos adicionales).
- En un proceso sin dobles, MATRIZ/noOfrecido/erroresContexto y sus consumidores forma/transacción
  lanzan `pendiente: WP-2`; no hay fallback productivo que simule éxito.

### Concreciones y límites WP-1

- `EnlaceDe` conserva exactamente su contrato: cada literal individual de excepción selecciona
  `never`. Ambas excepciones se construyen como `Excepcion`/`Enlace`; no se ocultó con casts any/never.
- F-2/F-5 consumen MATRIZ/noOfrecido definitivos; DS-20 consume erroresContexto definitivo. Los
  dobles viven únicamente en procesos aislados de pruebas y se apoyan en datos manuales. Su verde
  acredita consumidores unitarios, no integración real. WP-2 debe repetir sin dobles F-2/F-5,
  EX1/EX2, DS-20 (nuevo/previo/rollback) y 200 semillas en matriz.test antes de H1.
- CATALOGO es un proxy readonly que lanza `pendiente: WP-5`, con campos FilaCatalogo y la unión
  literal de 34 códigos; CodigoDiagnostico deriva de typeof CATALOGO como declara DESIGN. No hay
  filas operativas nuevas ni capacidades ofrecidas; matriz y NO_OFRECIDO también siguen pendientes.
- APIs auxiliares no tipadas por DESIGN se concretaron al mínimo para sus consumidores: validación
  léxica devuelve Rechazo|null; alomorfos devuelven y/e y o/u; helpers de ids y de colocación por
  descomposición/despliegue son puros. Las posiciones fraccionarias de centrado se redondean a entero,
  con desviación máxima de 0.5 px. El caller OPL de WP-13 proporcionará el punto preferido relativo
  al enlace al llamar colocar; ninguna relación se inventa a partir de coordenadas.
- Interpretación de dirección para WP-4p, impuesta por canon §6.5: primero prevalece la clase/tipo,
  y el control se compara dentro de la clase retenida. E(e)+R→R sin control; C(c)+E(e)→C(c);
  E(c)+Agente(e)→E(c). WP-4p probará estos contraejemplos además de los 12 niveles/9 celdas.
  No se cambió DESIGN ni se implementó proyección en WP-1.
- El generador de azar da modelos raíz con objetos/estados/procesos y procedimentales; el perfil
  completo añade habilitadores. Los 15 tipos se cubren separadamente por el constructor. Secuencias
  de acciones y modelos aleatorios refinados pertenecen a los paquetes que implementan esas operaciones.
- No se editaron canon, DESIGN, decisiones ni conformidad: no se materializó una fila de soporte
  o catálogo ni cambió el estado de un DEBE. No se acredita roundtrip, fidelidad visual, H1,
  aceptación humana, servidor funcional, build, despliegue, migración ni publicación de este paquete.

El ejecutor no hizo stage/commit/push, cambio de rama, merge ni lectura de credenciales/.env.
WP-1 permanece detenido y sin cierre; la directora conserva la responsabilidad de la revisión y de
un eventual commit/push, después de resolver el contrato y repetir las aceptaciones.


### Revisión independiente WP-1 y correcciones verificadas

Se añadieron primero regresiones para referencias heredadas (`toString`) en el índice y la forma,
para etiquetas de relación con mayúscula inicial y para tamaños variables de cajas. También se
probaron las seis exportaciones OPL declaradas en DESIGN §5.4/§5.7 antes de completar sus stubs.
El RED observado fue 1 pass / 6 fail; tras las correcciones independientes, el focal dio 7 pass /
0 fail. Un caso adicional de grupos externos grandes dio RED antes de ajustar sus separaciones.
El check histórico posterior dio 53 pass / 0 fail, 382 aserciones, con TypeScript estricto.
Logs de esta ronda: `/tmp/opforja-rehacer/WP-1-review-red.log`,
`WP-1-review-green.log`, `WP-1-review-red-grupos.log` y `WP-1-review-green-check.log`.

Se conservan las correcciones que respetan el contrato: búsquedas de claves propias en el índice y
forma; rechazo de etiqueta de relación con mayúscula inicial sin autocorrección; seis stubs exactos
`generarBloque`, `generarModelo`, `textoCanonico`, `lineaDeEnlace`, `generarDocumentoOpl` e
`importarOpl`; separación de grupos externos según sus tamaños guardados. El índice del árbol sigue
siendo único. Las rutas siguen siendo `cadena_etiqueta`, sin imponerles la gramática de relación.
Las pruebas de stubs OPL verifican una frontera pendiente, y deberán convertirse en pruebas de
comportamiento cuando WP-7/WP-13 implementen esas capacidades.

### Registro de la detención WP-1 y propuesta posteriormente autorizada

DESIGN §6.6 fija el ancho del contenedor como `max(420, bandaMasAncha + 80)`, el alto como
`64 + nBandas * 100 + (internos ? 100 : 0) + 24` y cada banda en `origen.y + 64 + k * 100`.
F-12 admite anchos y altos enteros de al menos 20 px; no limita el alto a 60 ni el ancho a 135. Las fórmulas
vigentes no permiten cumplir a la vez contención y ausencia de solape para todos esos tamaños:

- Dos objetos internos de ancho 400 forman una fila de 840 px. El contenedor sin bandas mantiene
  ancho 420; la fila centrada comienza en x = -210 con origen x = 0 y sale de sus márgenes.
- Un modelo literal congelado y válido para `validarForma`, con un subproceso de 135×150 en una
  banda, produce un contenedor de alto 188 y una caja cuyo borde inferior queda en y = 214.
- Un segundo modelo válido, con dos bandas de procesos de 135×150, conserva el paso de 100 px;
  las cajas se solapan y la última también rebasa el contenedor.

La ampliación del ancho que inicialmente se ensayó está preservada exclusivamente fuera del repo
en `/tmp/opforja-rehacer/WP-1-colocacion-propuesta.ts`. Por decisión de dirección se restauró solo
la fórmula literal de ancho en producción. Se conservan alto y paso vertical literales, tamaños
guardados, casos nominales y todas las pruebas nuevas. No se implementó paso o alto adaptativo.
DESIGN permanece intacto.

Propuesta mínima, sin autoridad de implementación hasta resolución del dueño:

```text
ancho = max(420, maxAnchoBandas + 80, anchoFilaInternos + 80)
paso(k) = max(100, maxAltoGuardadoBanda(k) + 40)
y(k) = origen.y + 64 + suma(pasos anteriores)
alto = 64 + suma(pasos) + (internos ? max(100, maxAltoInternos + 40) : 0) + 24
```

La propuesta conserva la rejilla vertical cuando cada fila mide 60 px de alto y el ancho cuando
la fila de internos ya cabe en el contenedor calculado por las bandas. No promete conservar todos
los layouts de cajas 135×60: tres internos de ese tamaño forman una fila de 485 px, que requiere
565 px de contenedor en la propuesta frente a los 420 px literales sin bandas anchas. Ese cambio
es necesario para la contención y forma parte explícita de la propuesta. El reordenamiento de
bandas sigue cambiando solo y y el alto del contenedor, según la acción declarada. Esta propuesta amplía el comportamiento
literal de DESIGN y requiere una resolución explícita del dueño antes de editar el contrato o
reanudar producción. No se propone reducir tamaños válidos ni relajar las pruebas de contención.

Evidencia final, después de restaurar la fórmula: focal de colocación **4 pass / 3 fail**, 112
aserciones, 7 pruebas. Check íntegro desde `app/`,
`PATH=/tmp/opforja-rehacer-tools:$PATH bun run check`: TypeScript estricto pasa; tests **52 pass /
3 fail**, 385 aserciones, 55 pruebas en 12 archivos, exit 1. Los tres fallos son exactamente los
casos T-226 descritos arriba. Logs: `/tmp/opforja-rehacer/WP-1-contract-stop-red.log` y
`/tmp/opforja-rehacer/WP-1-contract-stop-check.log`. No hay pruebas saltadas o cuarentenadas.

El paquete no cumple todas las aceptaciones y no está listo para cierre. Se detiene por la
instrucción del dueño: «Si un contrato de DESIGN debe cambiar, propónlo en HANDOFF.md y detente».
Después de la restauración no hubo más código de producción. Solo se conservó evidencia,
regresiones y continuidad. No hubo stage, commit, push, cambio de rama ni publicación.

### Revisión final y estado de entrega de la directora

Dos revisores independientes confirmaron las correcciones de claves propias en índice/forma,
capitalización de etiquetas, separación de externos y seis firmas OPL. La sonda real sin dobles
devolvió F-1/F-7 para la raíz inexistente y ninguna violación para el subproceso `toString` con
aparición propia. El focal de esas regresiones dio 3 pass / 0 fail. Los stubs OPL coinciden 6/6
con las firmas literales, conservando exclusivamente el fallo `pendiente` de sus paquetes.
El focal de colocación sigue 4 pass / 3 fail: confirma las reparaciones independientes y conserva
los tres bloqueos contractuales. No se repitió el check completo después del último check de
la ejecutora porque las fuentes y pruebas quedaron congeladas; solo se precisó este tablero.

La ampliación del ancho de internos se había tratado inicialmente como una reparación ordinaria.
El cotejo posterior de la fórmula literal mostró que requiere la misma autorización contractual
que la rejilla vertical. Se retiró del producto, se preservó el borrador y se mantuvieron las
regresiones; no se declara corregida ni se oculta con una restricción de tamaños admitidos.

Git comprobado al detenerse: `HEAD == origin/rehacer == b9d94180b5f587cdf125d8c4fabcf26edb5917c3`,
también confirmado con `git ls-remote`; divergencia de commits `0 0`. `main`, `origin/main` y
`pre-rehacer` siguen en `513ac041f6eb91dc8bf0eb5319a492eb6ff25f6d`. El árbol local conserva
HANDOFF modificado y 61 archivos TypeScript nuevos de WP-1, sin stage ni commit. La paridad de
commits no implica un árbol limpio ni publicación de WP-1. Los 48 documentos de `docs/rehacer/`
conservan sus SHA256 y el diff contra `pre-rehacer` está vacío, incluido DESIGN.

H1, H2 y H3 siguen pendientes. No hay un resultado de hito ni nuevas filas B-nn publicadas.
Los paquetes posteriores solo tienen preparación de lectura; ninguna implementación iniciada.
Para retomar falta la resolución explícita de la propuesta de §6.6. Si se autoriza, primero se
registra el contrato aprobado en DESIGN; después se implementa sobre este trabajo conservado,
se observan verdes las tres regresiones y el check, se cierra WP-1 con su único commit/push y
se continúa por WP-2. No se descarta el trabajo local para volver a una base limpia.

### Resolución del dueño y reanudación WP-1

El dueño respondió «Autorizo» a la propuesta concreta de §6.6 y a la reanudación de WP-1 seguida
del plan lineal. La autorización comprende incluir el ancho de la fila de internos en el
contenedor, usar pasos verticales mínimos de 100 px ampliados según el alto guardado más 40 px,
y calcular las posiciones y el alto con esos pasos. Se conserva el alcance aprobado, los
tamaños guardados, el cambio de solo y/alto al reordenar bandas y las regresiones rojas.

La directora registra primero este resultado y las fórmulas en DESIGN §6.6; la ejecutora aplica
después el menor cambio sobre las pruebas existentes. Esta resolución levanta el stop específico
de colocación. Mantiene los demás límites del encargo: paquete por paquete, un commit/push por
paquete cerrado, sin producción, contenedores, migración real, merge/push a main o lectura de
credenciales. Los resultados anteriores de la detención son históricos, no el estado de
aceptación posterior a esta autorización. No se reabre ninguna decisión fija 1–28.


### WP-1: candidato después de la autorización, pendiente de revisión

Se leyó DESIGN §6.6 actualizado y se reprodujo el RED de las tres regresiones antes de cambiar
producción: 4 pass / 3 fail, 112 aserciones. Se añadieron solo dos casos pertinentes que faltaban:
bandas con altos heterogéneos y una fila de objetos internos altos con máximo distinto. Ambos usan
Modelos literales congelados y `validarForma` en afterEach. El RED ampliado dio 4 pass / 5 fail,
116 aserciones, antes de implementar las fórmulas aprobadas.

El cambio mínimo en colocación incluye el ancho de la fila de internos, calcula cada paso con el
máximo alto guardado más 40 px y mínimo 100, acumula y por banda, y reserva la fila de internos con
la misma regla de alto. Las cajas guardadas conservan sus dimensiones; las pruebas verifican
identidad de las apariciones de entrada, pureza y repetibilidad, además de las posiciones nominales
y las separaciones de otros grupos. No se copió el borrador ni se añadió otro contrato.

Dirección detectó además tres booleanos mal transcritos en EXPECTATIVAS_MATRIZ. Se cotejó el
contexto literal de DESIGN §4.3.1 y la derivación canónica proceso→proceso de CANON §2.1:
invocación, excepción de sobretiempo y excepción de subtiempo tienen `mismoTipo: true`, porque
ambos extremos son procesos. Solo se corrigieron esos tres booleanos del helper manual; no se
importó MATRIZ ni se cambió legalidad productiva. Se conserva la prueba existente de los 15 tipos.
La comparación significativa del oracle con MATRIZ real pertenece al RED de WP-2, sin fabricar
una prueba duplicada de constantes en WP-1.

Resultados posteriores a todos los cambios, desde `app/` y con el wrapper autorizado:

- `bun test -t T-226`: 9 pass / 0 fail, 144 aserciones, 48 filtradas; las tres regresiones y
  ambas ramas nuevas pasan. Log `/tmp/opforja-rehacer/WP-1-autorizado-green-T226.log`.
- `bun test src/pruebas src/nucleo/forma.test.ts`: 22 pass / 0 fail, 22 aserciones padre;
  los hijos aislados ejecutan las aserciones semánticas. Log `WP-1-autorizado-green-consumidores.log`.
- Check íntegro después de corregir el helper: TypeScript estricto y arquitectura pasan;
  57 pass / 0 fail, 417 aserciones, 57 pruebas en 12 archivos, exit 0. Log
  `/tmp/opforja-rehacer/WP-1-autorizado-green-check-final.log`.
- Filtros T-226/T-032/T-028/T-030/T-078/T-020/T-093/T-043: 19 pass / 0 fail,
  155 aserciones padre. Log `WP-1-autorizado-green-filtros.log`.

Los logs RED son `/tmp/opforja-rehacer/WP-1-autorizado-red-regresiones.log` y
`/tmp/opforja-rehacer/WP-1-autorizado-red-ramas.log`. No se debilitó, saltó o cuarentenó ninguna
prueba. El bloqueo específico de colocación está resuelto y las aceptaciones WP-1 tienen evidencia
verde; el candidato queda congelado para revisión de dirección y su único commit/push eventual.
No se inició WP-2. H1 y la integración sin dobles siguen pendientes de sus paquetes propietarios.
El ejecutor solo editó colocación, su suite, los tres datos autorizados del helper y estos resultados;
conservó las ediciones de dirección en DESIGN y el historial de HANDOFF. Sin stage, commit o push.

Precisión final de continuidad: se corrigieron exclusivamente comentarios de propietario de stubs
vacíos: v0 WP-6; vocabulario/plantillas WP-7; no-soportadas WP-12; almacén WP-9; atajos WP-10;
tokens/métricas/fuente/geometría/marcadores WP-8a. Sin cambios de cuerpos, APIs o pruebas. El check
definitivo ya había terminado tras el helper; no se repitió por estos comentarios, según dirección.

### Cierre WP-1 por dirección

La revisión focal independiente confirmó las fórmulas aprobadas y observó T-226 con 9 pass /
0 fail, 144 aserciones. Una sonda adicional comprobó cuatro modelos válidos: alturas diferentes
en varias cajas por banda, origen desplazado, fila interna alta sin bandas, tres internos nominales
y ausencia de filas. Conservó dimensiones, entrada congelada, repetibilidad y contención sin
solapes. No se reprodujo otro defecto material ni se necesitó otro cambio contractual.

Se cierra el paquete con el check definitivo ya observado: TypeScript estricto, arquitectura y
57 pass / 0 fail; sus aceptaciones focales están verdes. La tabla manual sigue independiente de
MATRIZ. Los módulos futuros conservan sus stubs y no hay nuevas filas de soporte materializadas
ni brechas B-nn publicadas en WP-1. La integración F-2/F-5, EX1/EX2, DS-20 y las semillas con
MATRIZ real, sin dobles, corresponde a WP-2 antes de declarar H1. No se acredita roundtrip,
render, servidor, build/e2e, aceptación humana o despliegue.

El commit del propio cierre se localiza por el título único de la fila del tablero; el siguiente
paquete lo fija como SHA literal. Dirección revisó y preparó únicamente los 61 archivos fuente/
pruebas nuevos de WP-1, el ajuste autorizado de DESIGN y este tablero, con diff sin errores de
espacio. El cierre se publica únicamente en origin/rehacer; main permanece fuera de la entrega.


## WP-2: candidato y evidencia acotada

Propiedad: `app/src/nucleo/matriz.ts`, su suite y el registro obligatorio de conformidad.
Se materializaron las 15 filas literales de firma, las reglas de contexto (incluidas las dos
severidades de AP-27), validez de abanicos, las cinco filas NO_OFRECIDO y las consultas del menú
con alternativas. `erroresContexto` incluye solo errores; DS-20 tolera errores previos por identidad
`codigo+refs`. Reparaciones devuelven acciones registradas; no implementan operaciones futuras.

Integración sin mocks de matriz/diagnóstico: F-2/F-5, ambas excepciones, error nuevo DS-20,
error previo, rollback/pureza, identidad `codigo+refs` aun con otra regla y excepción explícita;
200 semillas congeladas de `azar` con `validarForma=[]`. Los modelos válidos de la suite se
comprueban además en `afterEach`. Estados iniciales, herencia múltiple/ciclos, unicidad entre
ancestro/descendiente (sin colisión entre hermanos), abanicos y AP-27 tienen contraejemplos reales.
El manejador de excepción sistémico se admite (T-268); los avisos de duración/afiliación son WP-5.

Evidencia del candidato (logs en `/tmp/opforja-rehacer/`): RED inicial 0 pass / 48 fail contra
stubs (`WP-2-red.log`); GREEN focal 48 pass / 0 fail. Check inicial detectó cuatro errores de
TypeScript en pruebas, corregidos sin cambiar expectativas. RED de bordes 53 pass / 4 fail
(`WP-2-red-bordes.log`): ramas idénticas, campos de estado ajenos, multiplicidad etiquetada
inválida y propuesta de segundo abanico sobre enlace agrupado; corregidos. Check posterior
verde 114 pass / 0 fail, 1265 aserciones (`WP-2-green-check.log`), anterior al último caso de
anclaje vacío y a la concreción bidireccional pendiente. RED adicional de anclaje vacío observado.
Check verde histórico previo a la regresión activa: 115 pass / 0 fail, 1269 aserciones
(`WP-2-historical-green-check.log`); focal histórico 58 pass / 0 fail, 852 aserciones
(`WP-2-historical-green-focal.log`). No es el estado actual del candidato.
Regresión activa T-040/T-120, ambas orientaciones: candidato legal incorporado tal cual con
id único y extremos visibles deja F-11; RED focal real 0 pass / 2 fail, 10 aserciones
(`WP-2-red-bidireccional.log`). Check final actual: 115 pass / 2 fail, 1279 aserciones,
117 casos en 13 archivos, TypeScript estricto aprobado (`WP-2-final-check.log`); exit 1
por las dos regresiones F-11.

Concreción aprobada por dirección: `noOfrecidoDescomposicion(m,cosa)` consulta B-02, porque
una descomposición no es un enlace; se mantienen las firmas exactas existentes. El propietario
WP-4r deberá integrarla con `descomponer`. Desviación de frontera TDD declarada: el ayudante
se redactó inicialmente con el primer GREEN; se devolvió a stub antes de su prueba T-072,
se observó RED 0 pass / 1 fail y se reintegró el mínimo GREEN. No se presenta como TDD original
sin esa corrección.

Concreción pendiente de dirección: `tiposLegales` no recibe las etiquetas de un gesto
bidireccional, pero OpcionTipo exige candidato completo. El candidato actual usa etiquetas
vacías a completar y devuelve `legal:true` para la firma; persistido así incumple F-11.
La regresión conserva el fallo F-11 sin cambios de producción, saltos ni expectativas debilitadas.
La rama está congelada y no se declara cierre ni la propiedad menú/crearEnlace (§10.2).
No se inventarán etiquetas ni se cambiará contrato sin resolución de dirección.

Conformidad B-02/B-04/B-05/B-06/B-08: evidencia N limitada a consultas e integración de forma.
UI, operaciones de enlaces/abanicos/refinamiento, importación, OPL y exportación siguen en sus
paquetes. T-062/T-065 pertenecen al léxico/identidad y operaciones posteriores; T-063 aquí
acredita reevaluación de firma, no la operación de cambio de tipo. No se adelanta WP-4p ni otro
paquete. H1–H3 pendientes. Sin stage/commit/push, cambios de rama, producción, despliegue,
contenedores, migración real, credenciales ni `.env`.

## Detención WP-2: evidencia y propuesta al dueño

Esta sección es una propuesta, sin autorización de implementación. La respuesta «Autorizo»
anterior resolvió exclusivamente la propuesta de colocación de §6.6; ese ajuste está cerrado y
publicado en WP-1. No autoriza por inferencia cambiar esta nueva frontera de DESIGN.

### Incompatibilidades comprobadas

1. DESIGN §4.2 da a `tiposLegales` únicamente OPD y extremos. §4.3.4 exige que una opción
   `legal:true` contenga `EnlaceNuevo`, pero F-11 (§3.2) exige dos etiquetas no vacías y distintas
   en el bidireccional. La consulta actual entrega ambas vacías; al incorporar su candidato
   literal a un modelo válido, las dos orientaciones producen exclusivamente F-11. Las dos
   regresiones T-040/T-120 están activas en `matriz.test.ts`, sin modificación de producción
   para esconder el fallo. Bloquear siempre este tipo tampoco permite la completitud de §10.2
   cuando creación recibe las etiquetas válidas del usuario. El recíproco con estados presenta
   la misma necesidad de recibir una etiqueta: sin ella cae en B-05.
2. §4.3.4 filtra por contexto la intención de enlace al contorno, mientras §4.2/§4.5.3 exigen que
   creación distribuya automáticamente los enlaces tardíos antes del cierre. Una sonda pura,
   con modelo válido y un subproceso, observó consumo objeto→contenedor rechazado por el menú
   con R-DIST-1, y su hecho efectivo objeto→subproceso sin violaciones de forma/contexto.
   La operación futura no se ejecutó: la diferencia se cotejó contra su contrato literal.
   Una consulta sobre el resultado transformado puede resolverla, pero necesita precisar
   §4.3.4 y la asignación serial de su integración, sin ignorar las reglas de contorno.

### Cambio mínimo propuesto

Ampliar la entrada de consulta (§4.2) con datos opcionales del usuario, aplicables a las tres
filas etiquetadas. Las etiquetas corresponden a origen/destino de la opción seleccionada después
de aplicar su sentido; la UI conserva ese sentido durante la edición.

```ts
export interface DatosEtiquetas {
  readonly etiqueta?: string | null;
  readonly inversa?: string | null;
}
export function tiposLegales(m: Modelo, a: {
  readonly opd: Id;
  readonly desde: ExtremoRef;
  readonly hacia: ExtremoRef;
  readonly etiquetas?: DatosEtiquetas;
}): readonly OpcionTipo[];
```

Conservar los casos booleanos de `OpcionTipo` y agregar en §4.3.4 estos dos casos de datos
pendientes, que no contienen candidato:

```ts
| { readonly tipo: 'etiquetadoBidireccional'; readonly sentido: 'directo' | 'inverso';
    readonly legal: 'pendiente'; readonly requiere: readonly ['etiqueta', 'inversa'];
    readonly avisos: readonly Violacion[] }
| { readonly tipo: 'reciproco'; readonly sentido: 'directo' | 'inverso';
    readonly legal: 'pendiente'; readonly requiere: readonly ['etiqueta'];
    readonly avisos: readonly Violacion[] }
```

La firma y las precondiciones decidibles se comprueban primero: un gesto inválido conserva su
rechazo. Después, datos requeridos no suministrados permiten `pendiente`; un null explícito,
una cadena vacía o un léxico inválido los rechazan con motivo. Unidireccional y recíproco sin
estados conservan la etiqueta opcional: ausente/null significa sin etiqueta. Recíproco con estados
requiere la etiqueta; el hecho real sin ella sigue excluido por B-05. Las consultas y operaciones
usan `validarEtiqueta`, sin recortar, capitalizar ni inventar frases.

`legal:true.candidato` se precisa como intención completa apta para creación. La creación puede
transformarla por las reglas declaradas; el modelo efectivo final debe cumplir F-11. Dos etiquetas
válidas y no vacías, iguales entre sí, se normalizan a recíproco mediante creación con traza
R-STRE-1. Las vacías nunca habilitan esa normalización. Se conservan los tipos `EnlaceNuevo` y
las firmas de las operaciones persistentes; no se añade una operación para datos pendientes.

En los flujos 7/9 de §7.3, elegir `pendiente` abre los campos antes de insertar el enlace.
Cancelar deja cero acciones, cero ids y el mismo modelo. Confirmar vuelve a evaluar con los
datos del usuario; solo `legal === true` habilita creación. Los consumidores distinguen
explícitamente true/false/pendiente. El menú ordena completas, pendientes seleccionables y
rechazadas; la vista previa OPL de una completa corresponde al resultado efectivo del ensayo
real. Una pendiente muestra los campos requeridos, sin generar frases de dominio ficticias.

Precisar §§4.3.4/4.5.3/10.2 para que consulta completa, creación y reparación consuman una única
distribución pura autoritativa. La consulta ensaya en memoria sobre una copia y descarta el
resultado; la operación entrega el Hecho y las trazas. Se validan datos, forma, NO_OFRECIDO,
precondiciones y el contexto final. R-DIST-1/AP-07/R-CX-DIST-2 se conservan y siguen rechazando
hechos ilegales que permanecieran en el contorno. El ensayo incluye recursión, apariciones
externas, escisiones y abanicos, con los mecanismos existentes de ids y copia de camino.

El cierre DS-20 compara siempre el modelo original, anterior a insertar el candidato, con el
resultado efectivo final. Nunca toma como base el borrador intermedio que ya contiene el enlace:
un error introducido allí podría compartir `codigo+refs` con el error final y quedar eximido
incorrectamente. La política de identidad de DS-20 permanece intacta.

La frontera interna propuesta para el transformador, dentro del archivo propietario
`nucleo/refinamiento.ts` de WP-4r, es:

```ts
export function planificarDistribucion(m: Modelo, a: {
  readonly opd: Id;
  readonly enlace: Enlace;
}): Respuesta<Hecho>;
```

Su entrada es el borrador preparado con enlace/id/secuencia y abanico, si procede; su salida es
el modelo de ensayo, ids adicionales y trazas. No se registra en OPERACIONES ni aplica DS-20
tomando ese borrador por original. El consumidor conserva el original real para el cierre.
Una función interna existente con exactamente esa frontera se reutiliza; hay una sola tabla y
una sola implementación de distribución para consulta, creación y reparación.

### Alcance serial y pruebas propuestos

Se conserva el orden lineal del plan. La resolución comprende precisar DESIGN y las lecturas,
propiedad de archivos y aceptación de `plan.json`/README afectados:

- WP-2 comprueba realmente forma, contexto, NO_OFRECIDO y los estados de datos de etiquetas.
  Registra expresamente que la equivalencia completa con distribución sobre modelos refinados
  aún necesita WP-4r. Ningún stub de distribución se cuenta como aceptación.
- WP-3b ejecuta propiedades reales de menú/creación sobre los constructores sin refinamientos,
  con etiquetas completas, normalización a recíproco, datos pendientes y rechazos. Conserva la
  cobertura y los negativos existentes; no acredita modelos refinados mediante dobles.
- WP-4r añade el hook propietario de `nucleo/matriz.ts` a los hooks ya previstos de enlaces y
  cosas, lee las cláusulas de consumidores/equivalencia y completa `propiedades.test.ts` con
  distribución real. La aceptación completa se cierra en WP-4r/H2. La brecha de integración
  debe quedar explícita en conformidad y HANDOFF antes de cerrar paquetes anteriores.

La propiedad mantiene ambos sentidos: para modelo original, OPD e intención completa con sus
datos, la consulta ofrece `legal:true` exactamente cuando creación la acepta por el resultado
efectivo. Una pendiente se completa y se vuelve a evaluar. Las alternativas del segundo gesto
se comprueban con su acción y opciones específicas, incluido `abanicoCon`, y no se confunden con
creación simple. La UI obtiene la vista previa del mismo ensayo y el generador real.

Las dos regresiones actuales se convierten, solo después de aprobar el nuevo contrato, en
controles de falta de datos→pendiente sin mutación y completación→resultado válido, preservando
la cobertura de rechazo de vacíos/F-11. Se añaden igualdad válida→recíproco con traza y el caso
B-05 con/sin etiqueta. No se elimina cobertura ni se salta o cuarentena una prueba para pasar.
En WP-4r se exige consumo/resultado con 0/1/≥2 subprocesos, TS3 con/sin control/en abanico,
evento sistémico, refinamiento recursivo, aparición externa, colisión en destino, rollback,
entrada congelada y DS-20 contra el original. Los negativos sobre contorno persistido se conservan.

### Hallazgos ordinarios conservados para la reanudación

La otra revisión independiente encontró dos defectos dentro del contrato vigente, sin necesidad
de una autorización adicional de diseño:

- `mismoHecho` normaliza solo el nivel superior. Una generalización de estados válida con
  `estados:{especializacion:sb,general:sa}` se ofrece como nueva, pero con las mismas claves
  en orden inverso da `ya-existe`. La sonda tiene aserción RED real, exit 1. Hay que corregir la
  igualdad semántica por campos y añadir su regresión antes de cerrar WP-2.
- Una colisión por enlace a un ancestro adjunta `cambiarTipoExistente` aunque §4.3.4 limita esas
  alternativas al mismo par. Cambiar el tipo conserva el extremo en el padre y deja bloqueado
  el gesto al hijo. Hay que distinguir esos pares y probarlo, conservando R-ROL-UNIC-1.

Los informes y sondas están en `/tmp/opforja-rehacer/WP-2-review-matriz.md`,
`WP-2-review-probe.ts`, `WP-2-contract-probe.ts` y `WP-2-propuesta-frontera-enlaces.md`.
No se corrigió producción después de confirmar la detención contractual. Los hallazgos ordinarios
no están resueltos por los 115 casos verdes del check actual.

### Estado al detenerse y condición de continuación

Check actual observado: TypeScript estricto aprobado, **115 pass / 2 fail**, 1279 aserciones,
117 pruebas en 13 archivos, exit 1 por las dos regresiones F-11. Se conserva el verde histórico
como histórico. WP-2 no cumple cierre; H1, H2 y H3 siguen pendientes. Conformidad registra
B-02/B-04/B-05/B-06/B-08 con evidencia limitada a consultas de núcleo y forma; no acredita
operaciones, UI, importación, OPL o exportación futuros.

Git verificado: `HEAD == origin/rehacer == refs/heads/rehacer` en
`817061a7f8312aa495b9ad00190f7d30db11ca40`, divergencia `0 0`. `main`, `origin/main` y
`pre-rehacer` continúan en `513ac041f6eb91dc8bf0eb5319a492eb6ff25f6d`.
El trabajo local de WP-2 está conservado sin stage/commit/push en `matriz.ts`, `matriz.test.ts`,
`docs/conformidad.md` y este HANDOFF. DESIGN y el plan no se modificaron para esta propuesta.

Se detiene por la instrucción del dueño: «Si un contrato de DESIGN debe cambiar, propónlo en
HANDOFF.md y detente». Para continuar falta la resolución explícita de esta propuesta conjunta.
Si se autoriza, primero se registra el contrato aprobado y su asignación en el plan, luego se
corrige WP-2 sobre el candidato conservado, se cumplen sus aceptaciones/check y se publica su
único commit/push. Después sigue WP-4p y el resto del orden lineal. No se pide autorización para
continuar entre paquetes ni se reabre ninguna decisión fija 1–28.

## Resolución delegada de coordinación: opción A para WP-2

Procedencia: mensaje de coordinación Korax recibido del hilo
`01a0fc4b-2579-75b7-818e-9c97fe5db026`. El coordinador declara un nuevo mandato explícito de
Félix para continuar los trabajos detenidos por confirmación confiando en su criterio, y autoriza
la opción A después de revisar la propuesta concreta anterior. Se registra como decisión técnica
delegada; no se atribuye a una aprobación humana directa del detalle ni al «Autorizo» de WP-1.

Alcance autorizado: DatosEtiquetas opcionales; OpcionTipo pendiente sin candidato; captura de
datos antes de persistir; normalización canónica con traza; ensayo/distribución puro compartido;
DS-20 contra original real y resultado final; integración refinada en WP-4r/H2 con límite explícito
WP-2/H1. Se conservan F-11, canon, decisiones fijas 1–28, orden serial y cobertura de pruebas.
Se corrigen también duplicados semánticos y alternativas ante ancestros. Criterio declarado:
resuelve contradicciones del objetivo menú/creación, es reversible y comprobable en Git, sin
ampliar infraestructura, objetivos o riesgo operativo.

La directora registra primero esta resolución y ajusta DESIGN, plan.json y README, incluidas
lecturas, propiedad y aceptación. Luego la única ejecutora de WP-2 corrige el candidato conservado
con RED/GREEN y revisión independiente GPT-6.1-Sol High. La normalización de etiquetas se
centraliza como ayudante puro de matriz, reutilizable por creación futura, sin agregar operaciones
registradas ni duplicar reglas en consumidores.

Este incremento autoriza modificaciones y comprobaciones locales. No autoriza nuevas operaciones
de red, comunicaciones externas, merge, push, publicación, despliegue, producción/contenedores,
migración real, credenciales/.env, autenticación ni Air. Se conservará un candidato listo para
revisión; la aceptación local no se declara cierre publicado del paquete ni resultado de H1.
La condición anterior de detención queda resuelta en este alcance; el historial rojo permanece
como evidencia de la detención anterior.

## WP-2: candidato local tras la opción A delegada

Estado: **CANDIDATO LOCAL VERIFICADO**, con revisión independiente favorable según el recibo
final siguiente; publicación fuera del alcance de este incremento. No se declara paquete CERRADO,
publicación ni aceptación de H1/H2/H3.
La autoridad para esta reanudación es la resolución delegada Korax registrada arriba; no se
atribuye a una aprobación humana directa del detalle ni al «Autorizo» de colocación en WP-1.

Cambios de esta reanudación, sobre el trabajo WP-2 conservado:

- `DatosEtiquetas` opcionales y `OpcionTipo` discriminada por true/false/`pendiente`. El
  bidireccional requiere etiqueta e inversa; el recíproco con estados requiere etiqueta.
  Ausencia/undefined requerida produce pendiente sin candidato ni id; null, vacío y léxico
  explícito inválido producen rechazo. En unidireccional y recíproco sin estados, ausencia/null
  se omiten. Las etiquetas siguen los roles de la opción después de su sentido, sin intercambio
  lingüístico, recorte, capitalización ni frases inventadas.
- Un borrador interno tipado conserva la firma incompleta sin fabricar un `EnlaceNuevo` con
  etiquetas vacías ni casts. Comparte la comprobación de firma de MATRIZ. Firma, anclajes,
  aparición e internos se comprueban antes de devolver pendiente.
- `normalizarEtiquetas` es el ayudante puro real centralizado: usa `validarEtiqueta`, convierte
  bidireccional válido de etiquetas iguales a recíproco y devuelve traza R-STRE-1 con ambas
  etiquetas. Conserva estado de origen, multiplicidades e input congelado. No es operación
  registrada. La consulta evalúa el hecho normalizado para forma, NO_OFRECIDO y duplicados,
  pero devuelve la intención completa original para que creación futura emita su traza real.
- Los duplicados se comparan semánticamente también en claves anidadas; las dos ordenaciones
  de generalización de estados existentes dan `ya-existe`. Las colisiones de ancestro o
  descendiente conservan R-ROL-UNIC-1 sin alternativa del mismo par; el mismo par conserva
  completarCambio/abanicoCon/cambiarTipoExistente.
- B-05 describe ahora los datos pendientes y completos de consulta. B-28 registra la integración
  temporal: N pendiente de WP-4r/H2 y U de WP-15/WP-17. B-02/B-04/B-06/B-08 conservan sus
  estados y límites; ninguna fila se declara cerrada sin todas sus superficies.

TDD y evidencia local:

| corte observado | pruebas | aserciones | resultado |
|---|---|---|---|
| Histórico anterior de check, conservado arriba | 115 pass / 2 fail; 117 pruebas, 13 archivos | 1279 | rojo F-11 |
| Focal antes de nuevas ediciones de producción | 58 pass / 2 fail; 60 pruebas | 862 | exit 1 por ambas regresiones F-11 |
| RED del contrato A y bugs revisados, antes de producción | 57 pass / 14 fail; 71 pruebas | 934 | exit 1, fallos de contrato pendiente/completo, normalización, duplicado anidado y alternativa al ancestro |
| GREEN focal de matriz | 71 pass / 0 fail | 1115 | exit 0 |
| Check completo local actual | 128 pass / 0 fail; 128 pruebas, 13 archivos | 1532 | TypeScript estricto y suite, exit 0 |
| Focal de aceptación T-040…T-066/T-120/T-268/T-072 | 71 pass / 0 fail | 1115 | exit 0 |
| `git diff --check` (solo lectura) | no aplica | no aplica | exit 0 |

Las dos regresiones F-11 originales se adaptaron al contrato delegado: falta de datos queda
pendiente sin candidato y completación con etiquetas distintas conserva forma/F-11 en ambos
sentidos. La expectativa anterior T-050 sin etiquetas ahora exige pendiente para el gesto válido;
los gestos inválidos siguen rechazados. Se mantienen los negativos F-11 de vacíos persistidos,
B-05 real sin etiqueta, normalización válida con traza, las 15 filas del oracle manual,
F-2/F-5 reales, ambas excepciones, AP-27, DS-20 y 200 semillas con forma real. No se eliminó,
saltó ni puso en cuarentena una prueba. La primera ejecución de check tras el GREEN focal detectó
errores de TypeScript en las pruebas (exactOptionalPropertyTypes/ids) y en el armado del caso
pendiente; se corrigieron manteniendo todas las aserciones antes del check verde informado.

Límites concretos: no se implementó `crearEnlace`, refinamiento ni un stub de distribución para
aceptación. El ayudante puro con traza se ejecutó realmente; la emisión por una operación de
creación futura sigue sin ejecutarse. La distribución compartida y equivalencia refinada N de
B-28 se prueban en WP-4r/H2; WP-3b ejecutará las propiedades de creación sin refinamientos.
Se conservan los rechazos de contorno persistido R-DIST-1/AP-07/R-CX-DIST-2. No se acredita UI,
OPD↔OPL, roundtrip completo, códec, servidor, render, export, aceptación humana ni despliegue.

Solo se editaron por esta ejecutora `app/src/nucleo/matriz.ts`, `matriz.test.ts`,
`docs/conformidad.md` y este apéndice. Se conservaron los ajustes de DESIGN/plan de dirección y
el trabajo previo. No hubo stage/commit/push/fetch/merge, red, comunicación externa, instalación,
contenedores, producción, migración real, credenciales/.env, autenticación ni Air. Todos los Bun
se ejecutaron con `PATH=/tmp/opforja-rehacer-tools:$PATH`, wrapper de Bun `--no-env-file`.
Los logs y el informe están en `/tmp/opforja-rehacer/WP-2-opcion-A-*.log` y
`WP-2-opcion-A-report.md`. Fuentes de producción y pruebas congeladas para revisión.

## Recibo de dirección: WP-2 local verificado

La ejecución y las dos revisiones independientes se delegaron a GPT-6.1-Sol High, con una sola
escritora de producción. La directora integró los ajustes contractuales antes de la ejecución,
verificó el candidato final y mantuvo las fuentes congeladas durante las revisiones.

- **Contrato y plan:** revisión independiente favorable, sin observaciones pendientes. Se
  armonizaron propiedad de `matriz.test.ts`/`propiedades.test.ts`, normalización como contrato
  producido y las tres muestras más 50 modelos de azar sin refinamientos en WP-3b. El orden
  lineal de 23 paquetes y sus dependencias permanecen iguales. Canon y decisiones 1–28 no tienen
  diff. Informe: `/tmp/opforja-rehacer/WP-2-opcion-A-review-contrato.md`.
- **Producto:** revisión independiente favorable sobre fuentes congeladas; 9/9 sondas propias
  verdes con producción real e inputs congelados. Focal observado por la revisora: 71 pass,
  0 fail, 1115 aserciones. Comprueba ambos sentidos, firma antes de pendiente, datos inválidos,
  normalización real/traza/F-11, B-05, duplicados anidados, alternativas y pureza/caché por
  identidad. Informe y sondas: `/tmp/opforja-rehacer/WP-2-opcion-A-review-producto.md` y
  `WP-2-opcion-A-review-producto-probe.ts`. No se sustituyó la integración futura por stubs.
- **Verificación integrada de dirección:** desde `app/`,
  `PATH=/tmp/opforja-rehacer-tools:$PATH bun run check`: exit 0, TypeScript estricto, 128 pass,
  0 fail, 1532 aserciones, 13 archivos. Log:
  `/tmp/opforja-rehacer/WP-2-opcion-A-check-direccion.log`. Producción y pruebas conservan los
  hashes revisados: `6c553d3774d6496beb1bd78897fa77a1e945cd93888fceff745da13cb39886be`
  y `d66d74d4350df21715044d5c8f6a8a4b252d5a7eba4e384baa0df9ceaab39c20`, respectivamente.
- **Conformidad final:** se retiró una línea vacía que cortaba la tabla antes de B-28, se usó
  el estado admitido `parcial` y se explicitó N en WP-4r/H2 frente a U en WP-15/WP-17. La
  revisora confirmó esta corrección editorial sin repetir tests; hash final
  `86d1244c493585dae3c58e26bb686c61b59f2d90685467f1c5f84c5d8f5077da`. B-05 conserva el
  rechazo del hecho sin etiqueta; las otras cuatro filas preservan límites y evidencia N.

Git local: rama `rehacer`, HEAD `817061a7f8312aa495b9ad00190f7d30db11ca40`; 0/0 frente a
la referencia local `origin/rehacer`, índice vacío. No se consultó nuevamente el remoto en este
incremento. Quedan siete rutas de trabajo intencionales: HANDOFF, matriz, sus pruebas,
conformidad, DESIGN, README del plan y plan.json. Sin diff en canon, DECISIONS, CANON,
forma/resultado/léxico, helpers de pruebas ni fixtures. Sin commit/push ni avance de paquete.

El siguiente paso lineal sigue siendo cerrar/publicar WP-2 en el alcance que lo autorice y
continuar con WP-4p. H1/H2/H3 permanecen pendientes. WP-3b comprobará creación real sin
refinamientos; WP-4r/H2 completará la integración N de B-28 sobre distribución real compartida y
DS-20 contra el original previo. La captura UI y su e2e corresponden a WP-15/WP-17. La decisión A
está resuelta; no queda una pregunta técnica de confirmación dentro de este incremento local.

## Reanudación del dueño y cierre WP-2

Después del recibo local, el dueño pidió «continuemos». Se retoma la autorización original de
commit semántico y push por paquete, sin pausas entre hitos. Los siete cambios pendientes
corresponden exactamente al candidato autorizado y revisado; no son trabajo ajeno nuevo.
Se comprobaron las seis huellas finales del recibo anterior: producción, pruebas, conformidad,
DESIGN, README y plan.json idénticos a los revisados. Se conserva el historial del incremento
local y su frontera de autorización, sin atribuirle publicación que no tuvo.

Verificación antes de publicar WP-2: `PATH=/tmp/opforja-rehacer-tools:$PATH bun run check`
desde `app/`, exit 0, TypeScript estricto, 128 pass / 0 fail, 1532 aserciones, 13 archivos.
Log: `/tmp/opforja-rehacer/WP-2-check-publicacion.log`. Revisión de diff sin errores de espacios.
Sin cambios de producción desde las revisiones independientes favorables. El cierre se publica
con un único commit semántico WP-2 y push a `origin/rehacer`; el hash se registrará en la siguiente
actualización del tablero. H1–H3 siguen pendientes. Siguiente: WP-4p (proyección y árbol), con
preflight leído sin cambios contractuales, seguido de WP-6 y WP-8a en el orden del plan.


## Recibo local WP-4p — proyección y árbol, pendiente de revisión/publicación

Implementación limitada a `app/src/nucleo/proyeccion.ts`, `proyeccion.test.ts` y
`frontera.test.ts`; no se cambió ningún contrato ni otra capa. La proyección deriva visibilidad
por OPD, roles, estados visibles/ocultos, abstracción exclusiva de procesos de in-zoom,
procedencia y claves; conserva DR-13 en el contorno. Preorden y etiquetas se consumen de
`indice.ts`, sin segunda implementación. Memo por modelo/OPD; sin mutar el modelo.

T-085 se comprueba mediante la tabla literal de 12 niveles (13 filas por el empate
Consumo/Resultado), las nueve celdas R-PREC y los tres contraejemplos de control registrados
por dirección. La comparación de control se limita a la clase retenida. Conflictos R+R/C+C
y R+C se conservan como hechos vistos con diagnósticos, sin inventar continuidad.
Los efectos usan entrada temprana/salida tardía por bandas, incluido el par escindido;
los abanicos colapsados no quedan degenerados. T-086 cubre raíz/descomposición/despliegue y
R-VIS-HIJO-1. T-018 comprueba supresión local/global con excepción de anclajes visibles,
y T-031 la etiqueta mutable con id estable. Se aporta la representación derivada de
colecciones incompletas; la operación/ajuste con traza de T-087 corresponde a WP-4r.

TDD observado: RED contra stubs, 0 pass / 63 fail, log
`/tmp/opforja-rehacer/WP-4p-red.log`; luego GREEN focal. La prueba adicional de independencia
local/global se contrastó con un segundo mutante real que eliminó la guarda local y produjo
0 pass / 1 fail, exit 1, en T-018; la fuente se restauró byte a byte.

T-089 usa un oráculo independiente de fusión del hijo y casos de las nueve combinaciones
transformadoras, habilitación y contorno. Además de las aserciones negativas de tipo/estado/
omisión, se ejecutó un mutante temporal REAL de producción: la entrada del efecto fusionado
pasó de `temprano?.entrada` a `tardio?.entrada`. `bun test src/nucleo/frontera.test.ts`
quedó ROJO con 11 pass / 1 fail, exit 1; falló «T-089 frontera efecto + efecto coincide con
fusión independiente del hijo» al observar c en lugar de a. Log:
`/tmp/opforja-rehacer/WP-4p-mutante-frontera-red.log`. Restauración en finally comprobada
byte a byte; GREEN posterior 64 pass / 0 fail, 185 aserciones, log
`/tmp/opforja-rehacer/WP-4p-restauracion-green.log`.

Check final desde app con `PATH=/tmp/opforja-rehacer-tools:$PATH bun run check`, wrapper
`--no-env-file`: exit 0, TypeScript estricto, 192 pass / 0 fail, 1717 aserciones en 15 archivos.
Log `/tmp/opforja-rehacer/WP-4p-check.log`. Diff revisado y sin errores de espacios.
Producción congelada para revisión independiente con estas huellas:

- `app/src/nucleo/proyeccion.ts`: `2bdcec46b621a1eede74cd53c99b5219f6ee2f8c0f721a1b9cade81c624b2ee8`
- `app/src/nucleo/proyeccion.test.ts`: `2a2d286b1162a35734e455db9c72eea52c4b5ad03653426315fe424d0419eb06`
- `app/src/nucleo/frontera.test.ts`: `19fa750d75df6778d89e21f2a29ce540000648f70d72605d4fc4e2eb2f30c2ba`

Sin filas nuevas de NO_OFRECIDO/NO_SOPORTADAS/NO_CANONIZADAS/CATALOGO ni cambio de brecha.
B-19 y B-28 mantienen su estado previo. El verde no acredita todavía roundtrip OPD↔OPL,
fidelidad SVG, integración de distribución WP-4r, aceptación humana ni H1. Sin Git mutante,
red, instalación, credenciales, contenedor, migración real, despliegue ni producción.


## Reparación de WP-4p tras revisión independiente negativa

La revisión refutó la suficiencia del candidato congelado anterior en dos aspectos materiales:
(1) el camino de conflicto conservaba dos ramas de consumo de un mismo abanico colapsado y un
resultado ajeno como TRES vistos; (2) el comparador temporal reconstruía rutas profundas por
proceso y tenía coste cuadrático. La sonda contó 153/561/2145/8385/33153 accesos OPD para
16/32/64/128/256 niveles. El verde previo no cubría esos casos. No se publicó ese candidato.

Regresiones primero: fan colapsado con R+C, C+C y R+R ajenos, y coste estructural con índice
precalentado (16/32/64/128 niveles, límite lineal de accesos, sin medir tiempos). RED observado:
52 pass / 7 fail, exit 1; `/tmp/opforja-rehacer/WP-4p-reparacion-red.log`.
La corrección colapsa las ramas también al producir los hechos que sobreviven al conflicto,
conservando control, estado y todos sus ids. Otra regresión detectó que una rama directa
individual se marcaba abstraída en ese camino: 61 pass / 1 fail, exit 1; corregida conservando
el registro directo. Log `/tmp/opforja-rehacer/WP-4p-reparacion-red-rama-directa.log`.

El tiempo se calcula una vez por modelo desde el preorden existente del índice: se comparten
los prefijos de bandas paralelas y se asignan rangos escalares. Cada prefijo se recorre una vez;
no se copian rutas ni se compara por profundidad por cada enlace. La sonda original observa
ahora 34/66/130/258/514 accesos OPD para las mismas cinco profundidades. Log:
`/tmp/opforja-rehacer/WP-4p-reparacion-coste.log`. Una prueba literal adicional cubre el empate
de prefijos paralelos y la banda exterior tardía. Sin modificar indice.ts ni duplicar el
preorden/etiquetas de navegación.

Como cambió la comparación temporal, se repitió el mutante REAL T-089 entrada temprana→tardía:
11 pass / 1 fail, exit 1, en frontera efecto+efecto. También se contrastó un mutante real que
rompe los prefijos compartidos: 0 pass / 1 fail en T-085 de paralelismo. Ambos restaurados en
finally, byte a byte. Logs `WP-4p-reparacion-mutante-frontera-red.log` y
`WP-4p-reparacion-mutante-prefijos-paralelos-red.log` bajo `/tmp/opforja-rehacer/`.
Restauración observada GREEN 74 pass / 0 fail, 230 aserciones, log
`/tmp/opforja-rehacer/WP-4p-reparacion-restauracion-green.log`.

Check integrado FINAL tras restauración: exit 0, TypeScript estricto, 202 pass / 0 fail,
1762 aserciones en 15 archivos; `/tmp/opforja-rehacer/WP-4p-reparacion-check.log`.
Sonda de la revisora ejecutada sin cambiarla: 31 pass / 0 fail, 114 aserciones,
`/tmp/opforja-rehacer/WP-4p-reparacion-sonda-independiente.log`. Toda ejecución Bun por wrapper
`--no-env-file`. Diff revisado, sin errores de espacios. Producción nuevamente congelada:

- `app/src/nucleo/proyeccion.ts`: `ad1db7e39d825a108756e1303138afdf67952d6113b6e76fb26b07bcce899bbd`
- `app/src/nucleo/proyeccion.test.ts`: `adf7b96050815e497503094af9fa730d827619ca4f64541b0bf1acaa2bfd0e7d`
- `app/src/nucleo/frontera.test.ts`: `19fa750d75df6778d89e21f2a29ce540000648f70d72605d4fc4e2eb2f30c2ba`

No se cambió DESIGN, otro contrato, matriz, índice ni fila de conformidad. La reparación se
limita al ownership previo. Pendiente rerevisión independiente y publicación por dirección.
Persisten los límites del recibo anterior: H1, roundtrip, SVG, WP-4r y aceptación humana sin
acreditar. No se ejecutó Git mutante, red, instalación, contenedores ni producción.


## Segunda reparación de WP-4p — abanico mixto cargado

La revisión independiente volvió a refutar la suficiencia del candidato reparado: un fan
mixto de consumo y resultado, cargable con validarForma real = [] y noOfrecido real = null,
se colapsaba por fanID a un solo visto. El diagnóstico R+C sobrevivía, pero la expresión
perdía una de sus clases transformadoras. Este candidato tampoco se publicó.

Primero se agregaron cuatro regresiones: C+R, R+C, C+C+R y R+R+C dentro del mismo abanico.
Se comprobó forma/F-5 mediante los validadores reales, sin stubs. RED observado: 62 pass /
4 fail, exit 1; `/tmp/opforja-rehacer/WP-4p-reparacion-mixto-red.log`. La corrección mínima
agrupa las ramas por fanID Y tipo en el camino de conflicto. Así cada clase homogénea puede
colapsar sin eliminar la clase incompatible, con sus estados/control/procedencia/refs.
Los casos de fan homogéneo ante conflicto ajeno y la rama directa permanecen verdes.

GREEN focal FINAL: 78 pass / 0 fail, 272 aserciones;
`/tmp/opforja-rehacer/WP-4p-reparacion-mixto-focal.log`. Check integrado FINAL: exit 0,
TypeScript estricto, 206 pass / 0 fail, 1804 aserciones en 15 archivos;
`/tmp/opforja-rehacer/WP-4p-reparacion-mixto-check.log`.
Las dos sondas independientes sin editar dan 33 pass / 0 fail, 121 aserciones;
`/tmp/opforja-rehacer/WP-4p-reparacion-mixto-sondas.log`. La sonda estructural conserva
34/66/130/258/514 accesos para 16/32/64/128/256 niveles;
`/tmp/opforja-rehacer/WP-4p-reparacion-mixto-coste.log`.

No se alteró la elección de entrada/salida ni el comparador temporal: el bloque desde
tiemposMemo se contrastó byte a byte contra el backup de la reparación anterior. La evidencia
real de mutante T-089 y restauración sigue aplicando; frontera vuelve a verde. No se repitió
ese mutante por instrucción de dirección. Diff revisado y sin errores de espacios. Nuevo freeze:

- `app/src/nucleo/proyeccion.ts`: `53c7932a4718ae557779827d3a284e830c2fec719afcbbded66380d37ff7660c`
- `app/src/nucleo/proyeccion.test.ts`: `72e9b6ea3031a582df7132bb9f027ee140231f2a35f8a3d9900303f0c5e208e1`
- `app/src/nucleo/frontera.test.ts`: `19fa750d75df6778d89e21f2a29ce540000648f70d72605d4fc4e2eb2f30c2ba`

Cambios limitados a proyeccion.ts/proyeccion.test.ts y este recibo al final de HANDOFF.
frontera.test.ts conserva su huella. Sin cambio de contrato, DESIGN, índice ni otras fuentes;
se conservaron los cambios de dirección en conformidad. Pendiente rerevisión y publicación.
No Git mutante, red, instalación, contenedores, migración real ni despliegue. Siguen vigentes
las fronteras de evidencia del paquete: no roundtrip, SVG, WP-4r, H1 ni aceptación humana.

## Cierre de dirección WP-4p

La revisión independiente GPT-6.1-Sol High termina favorable sobre el último freeze; los tres
hallazgos materiales previos están resueltos. Se conserva su historia y los RED observados,
sin publicar los candidatos refutados. La proyección, sus pruebas y frontera tienen las huellas
finales del recibo anterior; `indice.ts` y los contratos no cambiaron.

Verificación final de la ejecutora, leída y contrastada por dirección: TypeScript estricto y
`bun run check` exit 0, 206 pass / 0 fail, 1804 aserciones, 15 archivos; focal 78 pass / 0 fail,
272 aserciones. Logs `WP-4p-reparacion-mixto-check.log` y `WP-4p-reparacion-mixto-focal.log` en
`/tmp/opforja-rehacer/`. El check de dirección 202/0 pertenece al freeze anterior, no sustituye
el check final posterior a la reparación del abanico mixto.

La revisora volvió a ejecutar, sin cambiar expectativas, el adversario mixto (2/0), el abanico
colapsado con resultado ajeno (1/0), la matriz de abanicos con conflictos y hechos dominados
(1/0) y el focal de abanicos del producto (12/0). Comparador, selección temporal y frontera
conservan la evidencia de coste lineal, oráculo independiente y mutantes reales ya revisada;
sus bloques y huellas se comprobaron sin repetir suites ajenas al último cambio. Informe final:
`/tmp/opforja-rehacer/WP-4p-review-producto.md`. Sin observaciones materiales pendientes.

Dirección materializa B-19 en `docs/conformidad.md` conforme al protocolo de paquete §6, que
acompaña las nuevas filas B-nn en el mismo commit. Coincide con DESIGN §11.3: parcial, N·G·X,
DR-13. T-086 acredita N y la conservación del instrumento al contorno; G/X quedan pendientes
de WP-7/WP-8b. No se amplía la autorización de contorno para consumo/resultado/evento sistémico.
La revisora aprobó esa fila. B-28 y las otras cinco filas preservan sus límites.

Se cierra con un solo commit semántico WP-4p y push a `origin/rehacer`. El siguiente paquete es
WP-6, con proyección real disponible, seis fixtures/23 derivados recontados y preflight preparado.
H1/H2/H3 continúan pendientes. Ninguna prueba se eliminó, debilitó, saltó ni puso en cuarentena;
sin despliegue, producción, contenedores, migración real ni acceso a credenciales/.env.


## WP-6: mandato y resoluciones acotadas previas a producción

WP-4p se publicó como `ba5f8b5fd1fd39392f633795f0bb71cb356bd84c`; el push y la
paridad local/remota quedaron comprobados con árbol limpio y divergencia 0/0.
La directora asigna exclusivamente `app/src/codec/**` y
`app/fixtures/v0/sintetico.json` al ejecutor de WP-6. Este registro precede a su código.
Las doce etapas de DESIGN §3.4.2, sus reglas, informes de pérdida y aceptación
se verifican con el núcleo y la proyección reales; los seis fixtures, 23 derivados y
200 semillas siguen siendo puertas de aceptación.

- La importación síncrona exige SHA256 portátil sobre los bytes UTF-8 del payload recibido.
  `revision` conserva su firma asíncrona; la selección explícita de revisión y la
  comprobación de checksum no se reemplazan por normalización ni por otra revisión.
- La API total devuelve rechazo para entrada inválida. La aserción de desarrollo de
  §3.4.2 etapa 11 corresponde a un defecto residual interno de normalización: esa
  condición específica no convierte una entrada ordinaria defectuosa en excepción.
- Un `modo` ausente en metadatos de escisión solo se normaliza a `par` si existe un
  grupo real de exactamente dos mitades complementarias TS4/TS5, con el mismo objeto,
  estados propios y procedencia/acoplamiento canónicos F4. Los procesos pueden diferir
  entre entrada temprana y salida tardía. No se inventan mitades ni procesos; no se
  sobreescribe un modo explícito. Un grupo ambiguo conserva los hechos y declara la
  pérdida de los metadatos irrepresentables. Fundamento: modelo legado 398–403,
  SYNTHESIS 731–733 y R-SC 1103–1110; el caso antiguo de TS3 compacto no prueba un par.
- Cotas con unidades fijas (ms, segundos, minutos, horas, días o semanas) admiten
  conversión exacta a una unidad común como normalización equivalente. No se inventa
  una conversión de meses o años a días sin anclaje. Si no cabe una representación
  común, se conserva la primera cota conforme al contrato y se declara el valor y
  unidad originales perdidos como conflicto de representación, sin atribuirles
  incompatibilidad física.

Estas resoluciones menores aplican los contratos existentes; no cambian DESIGN ni
reabren las decisiones 1–28. La directora conserva el tablero y el registro común de
conformidad; el ejecutor añade su evidencia al final de este HANDOFF.

## WP-6: concreción de R-STRE-1 y excepción documental del punto fijo

Antes de implementar la anotación afectada se registra la dirección recibida: DESIGN
§3.4.2-7 exige normalizar `etiquetadoBidireccional` con etiquetas iguales a `reciproco`;
§3.4.3 emite el recíproco con esa misma forma v0; §3.4.4 exige Informe vacío para el
documento canónico propio. Se conserva la normalización R-STRE-1 para el legado.
Tras cierre válido, solo cuando la entrada **directa v0 completa** coincide byte a byte
con `exportarV0(modelo)`, se reconoce la excepción documental específica de §3.4.4 y
se omite la anotación repetida de ese mapeo canónico. No se borran pérdidas, rechazos,
visibilidad ni ignorados; no se eliminan normalizaciones de sobres, recovery, portable
o aliases externos por coincidencia del payload. No se agrega marca de procedencia ni
campo wire. Tests independientes exigirán normalización del legado y punto fijo/lector
estricto del export exacto, además del rechazo del lector para otro formato textual.
Es aplicación acotada del contrato existente bajo dirección delegada, sin modificar
DESIGN ni sustituir aceptación humana del modelado.

## WP-6: contradicción pendiente C+R, F-5 y punto fijo

RED reproducible antes de cambiar la rama afectada: consumo `c` anclado a `s-6`,
control condición y multiplicidad `+`, junto con resultado `r` anclado a `s-7`,
mismo objeto/proceso. DESIGN §3.4.2-7 (líneas 747–754; CC-11 línea 4465) conserva
ambos al existir multiplicidad que impide la fusión sin pérdida. Etapa 9 F-5 retira
esa multiplicidad no ofrecida con DR-44, conservando el mínimo elemento. El export
canónico de ambos hechos carece entonces del impedimento y la importación siguiente
fusiona a TS3, contradiciendo §3.4.4 (949–955). El códec actual queda refutado por
`T-196 C+R bloqueado por multiplicidad luego retirada por F-5 también exige punto fijo`
en `app/src/codec/codec-reglas.test.ts`; evidencia
`/tmp/opforja-rehacer/WP-6-red-contrato-CR-F5.log`, 0 pass / 1 fail, 6 aserciones.

Se comunicó a dirección; no se modificó producción de esta rama. La excepción
documental autorizada para la anotación repetida R-STRE-1 no se generaliza aquí:
conservar dos hechos en el documento canónico exacto cambia el resultado de la
fusión, y requiere resolver expresamente la interacción antes de implementarla.
La propuesta mínima a evaluar es reconocer el export directo exacto para preservar
sus hechos, manteniendo íntegra la fusión prescrita para entrada legado. Pendiente
dirección; no se declara aceptación ni se altera DESIGN. Continúan las reglas
independientes. El caso distinto C+R fusionado, alias del resultado y recuperación
de su id como salida TS3 derivada sí pasa con expectativas literales por OPD y
visibilidad vacía en el mismo log.

## WP-6: recibo congelado bajo STOP por contradicción contractual

Dirección detuvo explícitamente WP-6 al confirmar la revisión independiente que
C+R/F-5/punto fijo exige cambiar DESIGN. No se ejecutó la propuesta de reconocer
antes de fusión el documento directo exacto, ni segunda fusión tras perder mult,
ni marcador/default/multiplicidad ficticios. Se conservan fuentes y RED sin aceptar
ni publicar el paquete. Continuación: autorización humana y actualización documental
previas a cualquier implementación. Dictamen y propuesta:
`/tmp/opforja-rehacer/WP-6-review-contrato-CR-F5.md`.

Freeze confirmado: no quedaron procesos/tools activos; todas las llamadas anteriores
terminaron con exit code final. Después del STOP solo lecturas y recibos. Ownership
respetado: codec/**, fixture sintético y append HANDOFF; git status del freeze solo
lista esas rutas. Sin núcleo/proyección/generador/pruebas ajenas, DESIGN/plan ni
conformidad editados; no stage/commit/push.

Evidencia del writer: RED inicial 0/62; primer integrado 63/0; ampliación 36 reglas
36/0; derivados/bandas y oráculos 45/0; excepciones firma RED0/2→GREEN3/0; DR-23
lista objetos sin parte RED2/1→GREEN3/0. Último focal completo codec 125/1, 2778
expectativas, antes de siete tests literales de conteos; último focal fixtures y
conteos, incluidos 200 modelos reales de azar, 15/0 y 2098 expectativas. Último
tsc local observado exit0 precede esos siete tests. No se suman suites ni se afirma
una ejecución 132/1. Los seis fixtures originales, sintético semilla20261002, 23
derivados literales y doce oráculos de visibilidad fixture/OPD quedaron contrastados
con la proyección real, sin distribución futura/dobles. La salida TS3 que recupera
el id del resultado C+R conserva visibilidad vacía en la sonda literal independiente.

Dirección ejecutó un único `bun run check` sobre este freeze: TypeScript verde;
338 pass / 1 fail, 4603 expectativas, 20 archivos, exit1. Solo falla
`T-196 C+R bloqueado por multiplicidad luego retirada por F-5 también exige punto fijo`.
Log `/tmp/opforja-rehacer/WP-6-check-direccion-bloqueo.log`, leído sin repetir ejecución.
Reproducción roja aislada: `/tmp/opforja-rehacer/WP-6-red-contrato-CR-F5.log`, 0/1,
6 expectativas. No se declara aceptación global ni punto fijo para todos los modelos.

Incidente declarado: desde raíz se ejecutó por error
`PATH=/tmp/opforja-rehacer-tools:$PATH bun x tsc --noEmit -p app`.
Log `WP-6-ts-primer-intento.log` dice resolución/descarga/extracción de46paquetes,
Saved lockfile y dos errores TypeScript. Se informó inmediatamente; dirección
ordenó solo tsc local/Bun wrapper y continuar en alcance. Status posterior y freeze
no muestran package/lockfile ni otro artefacto repo: solo rutas propias. Se comprobó
tsc local existente; no se retiraron archivos desconocidos/versionados ni caché.
No se afirma ausencia de efectos en la caché externa ni ausencia de red durante toda
la ejecución. No se repitió bun x ni instalación, no entorno/.env/credenciales leídos.

Recibo completo, aceptación por etapa, límites, títulos exactos de evidencia I para
B-02/04/05/06/08 y B-07/10/12/16, conteos literales, logs e incidente:
`/tmp/opforja-rehacer/WP-6-recibo-bloqueado.md`. B-28 queda pendiente. Huellas SHA256:

| Ruta | SHA256 |
|---|---|
| app/src/codec/canonico.ts | ba083ed67b7b74a66a738eb78af6d4b8f7d7d5e9eaaa80d37681881ea46419d8 |
| app/src/codec/codec-derivados.test.ts | 1ec870d5210321e74eeed79f4ba6de43b45c5735d42b440f80e270554df9b65a |
| app/src/codec/codec-fijo.test.ts | 7b20e3bf51da1b099aa42bba2ea1f58768be0b933203a610bb4d9e1700b3c6d6 |
| app/src/codec/codec-reglas.test.ts | 3cc84d3f8dd348782d2af270cff2510be93e3394ff8881c214bd3b7c17c57646 |
| app/src/codec/codec-visibilidad.test.ts | 4a67acb2477366f80c2fa3a54959e9acd32d1b6fde21ecce081a3aa0b35b76f7 |
| app/src/codec/codec.test.ts | cc5ce4a68ba1df5e6cdbdc5c41b930c99912b6d2dce0f74caf74c9f3f7ae2042 |
| app/src/codec/exportar.ts | a6ba76fdf6d75199618583bd209007dc6dc2ce431ec3670ce052c6a6feeeebca |
| app/src/codec/importar.ts | ed7daf83e60d1296fdaf91b125040fc19b0485c980669013743e9afe209dcc22 |
| app/src/codec/informe.ts | 1a1f2be73745527090990c6347ce237488be22b53bbdb16dd202052979c257f5 |
| app/src/codec/pruebas.ts | c11011ca71c24beb9380a318ffcc52eb6b514ba9aab6a901d829d25d6a564ee5 |
| app/src/codec/sha256.ts | 1270a4cfe68858bfd0aaea7c4449298b6bfd657210a3df8af4f85eea932a68c1 |
| app/src/codec/v0.ts | 96cc57ebc38733aab8ab948d87290128aedbe2e4bc4adc204a912fd421877ef5 |
| app/fixtures/v0/sintetico.json | ed6cd8790d300dfbfd44f91647131880edb70525520365729deea2604e5b82fb |

Se conservan ambos preflights WP-6 y el informe independiente WP-4p. Sin publicación,
despliegue, producción, contenedores, migración real ni aceptación humana.


## STOP de dirección WP-6: propuesta contractual pendiente del dueño

La directora y la revisora independiente GPT-6.1-Sol High confirman la contradicción.
Se aplica literalmente el límite del encargo: «Si un contrato de DESIGN debe cambiar,
propónlo en HANDOFF.md y detente». No se implementa la propuesta ni se pasa a WP-8a.
DESIGN, DECISIONS 1–28, plan, canon, núcleo y generador permanecen sin cambios.
La ejecutora confirmó freeze, ausencia de procesos activos y recibo terminado.

### Reproducción y resultado conjunto

La regresión `T-196 C+R bloqueado por multiplicidad luego retirada por F-5 también
exige punto fijo` está en `app/src/codec/codec-reglas.test.ts:87`. Fuente mínima:
consumo `c` desde el estado `s-6` a `p-2`, condición y multiplicidad `+`, y resultado
`r` de `p-2` a `s-7` del mismo objeto. CC-11 conserva los dos hechos porque la fuente
trae multiplicidad; DR-44/F-5 retira esa multiplicidad no ofrecida. El export conserva
consumo y resultado sin el campo. La reimportación fusiona a TS3, elimina `r` y su
apariencia, y cambia el siguiente export. No es una anotación espuria de informe.

Cláusulas decisivas de DESIGN: §3.4.2-7 (748–757 y 786–787), §3.4.3 (929–933),
y la ley §3.4.1 (622–623) / §3.4.4. El dictamen independiente está en
`/tmp/opforja-rehacer/WP-6-review-contrato-CR-F5.md`; el RED aislado es 0/1.

Dirección ejecutó una sola vez sobre el freeze:
`cd app && PATH=/tmp/opforja-rehacer-tools:$PATH bun run check`, log
`/tmp/opforja-rehacer/WP-6-check-direccion-bloqueo.log`. TypeScript pasó; 338 pass /
1 fail, 4603 aserciones en 20 archivos, exit 1. El único fallo es esta regresión.
Se mantienen las 338 pruebas verdes y el RED; ninguna se debilita, salta o pone en
cuarentena. Los seis fixtures, 23 derivados, doce OPD, sintético de semilla 20261002
y 200 semillas tienen sus resultados individuales en el recibo de la ejecutora.
Eso no cierra WP-6 ni acredita un hito.

### Propuesta precisa para autorización, todavía sin aplicar

Extender §3.4.2-7 / CC-11 y referenciarlo en §3.4.4 con esta excepción:

> La fusión legacy de consumo con estado y resultado con estado no se aplica a un
> documento v0 directo cuyos bytes completos coincidan con el export canónico del
> modelo candidato válido que conserva esos dos enlaces. Ese documento representa
> los hechos cargados del modelo; el importador conserva sus tipos e identidades,
> incluso cuando hay un conflicto de contexto. El reconocimiento se resuelve antes
> de la fusión C+R. En entradas legacy y en los sobres persistido, de recuperación
> y portátil rigen las reglas ordinarias de fusión y el informe correspondiente.
> Este reconocimiento no elimina pérdidas, rechazos, diferencias de visibilidad
> ni información ignorada, y no añade campos ni marcadores al formato.

El candidato se construye sin la fusión C+R, con las mismas reglas de forma, y solo
se reconoce si pasa `validarForma`, carece de pérdidas/rechazos/diff sustantivo y
la igualdad del documento directo con su export es exacta. Esta excepción amplía
el reconocimiento de estructura: la concreción anterior de R-STRE-1 solo omite
anotaciones y no autoriza esta ampliación. Es un cambio propuesto de DESIGN.

Consecuencia explícita para decidir: el par C+R en un documento directo en bytes
canónicos conserva sus hechos; reformatearlo o envolverlo lo somete a la fusión
legacy. No se presupone que esa distinción de representación esté ya autorizada.
La revisión recomienda conservar los dos hechos y el conflicto recuperable de P8.
Fusionar después de pérdidas sería otro cambio, repararía automáticamente la fuente
y no resolvería por sí solo la ley para todos los pares nativos con contexto cargado.

Tras autorización: registrar el contrato antes de código, implementar la excepción,
observar GREEN de esta misma regresión, ejecutar las sondas independientes conservadas
y el check del candidato, materializar las filas I de conformidad comprobadas, cerrar
WP-6 en un commit semántico y push, y seguir WP-8a en el orden original. Sin autorización,
permanece STOP y todo el candidato se conserva localmente.

### Estado Git, conformidad e incidente

Último paquete cerrado/publicado: WP-4p `ba5f8b5fd1fd39392f633795f0bb71cb356bd84c`.
HEAD, origin/rehacer y `git ls-remote origin refs/heads/rehacer` coinciden; divergencia
0/0. El árbol conserva cambios intencionales y sin publicar de codec, sintético y
HANDOFF. `git diff --check` pasó. No hay stage, commit ni push de WP-6.
Las filas de conformidad publicadas siguen B-02, B-04, B-05, B-06, B-08, B-19 y B-28;
inguna cerrada. La evidencia candidata I de esas filas y B-07/B-10/B-12/B-16 queda
en el recibo, pendiente de integración con el commit aceptado. B-28 no acredita
distribución refinada; H1/H2/H3 no alcanzados.

Incidente declarado: la ejecutora invocó `bun x tsc --noEmit -p app` por error y
el gestor informó descarga/extracción de 46 paquetes. Las comprobaciones posteriores
de dirección muestran package/lockfiles/configs/contratos sin cambios; status solo
contiene el ownership de WP-6 y HANDOFF. No se afirma ausencia de efectos en la caché
externa. Se conservaron archivos, se prohibió repetir bun x y se usó TypeScript local.
Recibo y huellas: `/tmp/opforja-rehacer/WP-6-recibo-bloqueado.md`.

Sin despliegue, producción, contenedores, migración real, merge o push a main.
La aprobación requerida corresponde únicamente al cambio contractual descrito arriba.


## WP-6: resolución explícita de coordinación de Félix y reanudación

La coordinación de Félix, con criterio técnico delegado explícito, leyó el recibo,
la propuesta y el dictamen independiente y autorizó precisamente el reconocimiento
previo a fusión C+R de v0 DIRECTO con igualdad íntegra EXACTA de bytes contra el export
del candidato válido que conserva ambos enlaces, tipos, ids y contexto recuperable.
Exige validarForma y ausencia de pérdidas/rechazos/diff sustantivo. Aceptó explícitamente
que reformatear o envolver sigue la ruta legacy ordinaria y puede fusionar.

Dirección registró esa excepción en DESIGN §§3.4.2-7 y 3.4.4 ANTES de reanudar código.
No se interpreta como autorización general de otros contratos: este cambio corresponde
solo a la propuesta exacta C+R; canon, decisiones 1–28 y formato v0 permanecen vigentes.
Se conservan el STOP histórico y el RED T-196 intacto. La nueva instrucción revoca esa
pausa y ordena continuar aquí WP-6, después WP-8a y el resto del plan hasta H1/H2/H3.

La ejecutora retoma exclusivamente codec/** y el fixture sintético; una revisión
independiente observará la excepción y las sondas. Dirección conserva documentos y
conformidad, commit/push por paquete a rehacer. No se autorizan otras instalaciones
o red fuera del Git ya mandatado, costes, destrucción, credenciales, despliegue,
producción, contenedores, migración real ni main. T-196 debe mostrar RED→GREEN; el
check completo y la aceptación de WP-6 siguen pendientes antes de su publicación.

## WP-6: implementación reanudada, GREEN y freeze para revisión

La ejecutora leyó la autorización y las cláusulas registradas antes de código.
T-196 bloque 87–91 permaneció INTACTA: RED fresco 0/1 con 6 expectativas
(`WP-6-red-reanudacion-CR.log`) y GREEN posterior. Se agregaron siete adversarios
con wire directo MANUAL, no expectativa calculada con import/export: exacto conserva
C/R y contexto; reformateado/sin LF/otro indentado/espacio y registro/recovery/portable reales
siguen legacy; pérdidas, rechazos y diff no se esconden. RED nuevos 6/1, 53 expectativas
(`WP-6-red-reconocimiento.log`), GREEN conjunto T196+adversarios+SHA 9/0, 71 expectativas
(`WP-6-green-reanudacion-CR.log`). No se debilitaron expectativas anteriores.

Cambio mínimo: fusión C+R extraída como fase; para v0 directo se cierra un candidato
sin esa fase y se exige forma vacía, sin descartado/rechazos/diff, y bytes completos
EXACTOS frente a export. Si no reconoce, pipeline ordinario fresco con su Informe;
sobres siguen directamente legacy. No nueva firma/flag público, campo wire, marcador
ni fusión tardía tras pérdidas. Se conserva la concreción acotada R-STRE-1.

Focal final códec 140/0, 2858 expectativas, 6 archivos
(`WP-6-green-codec-reanudado.log`). TypeScript local final exit 0
(`WP-6-ts-reanudado.log`). Check COMPLETO del writer desde app con wrapper
`PATH=/tmp/opforja-rehacer-tools:$PATH bun run check`: TypeScript verde;
346 pass / 0 fail, 4662 expectativas, 21 archivos, exit 0 (`WP-6-check-final.log`).
El anterior 338/1 de dirección corresponde SOLO al candidato bloqueado. Diff espacios
exit0. Los seis fixtures+syntético/23derivados/manualvisibilidad/200semillas reales
continúan verdes; se usa proyección REAL y no distribución futura/dobles.

Freeze para revisión independiente, sin más código mientras se evalúa. Importar:
`7f1b44859472c8228d2e279b971de26b52d77724e47d5c92a1878c6c7bc2f3d0`;
nueva codec-reconocimiento.test:
`f08654a9049a3b57f653a45ff584534725593111502e175df5f467654872b2a3`.
De las 13 huellas del freeze bloqueado, solo importar cambió; las otras 12 permanecen
idénticas. codec-reglas conserva 3cc84d3f8dd348782d2af270cff2510be93e3394ff8881c214bd3b7c17c57646,
acreditando T-196 intacta. Manifest completo de 14 rutas, aceptación por 12 etapas y títulos
exactos de evidencia I B-02/04/05/06/08 y B-07/10/12/16:
`/tmp/opforja-rehacer/WP-6-implementacion-reporte.md`. B-28 queda pendiente.

Status mantiene solo ownership+HANDOFF y DESIGN de dirección, preservado. Solo
append de evidencia HANDOFF por ejecutora, sin editar tablero/conformidad/contratos.
Sin stage/commit/push. Reanudación usa exclusivamente Bun wrapper/tsc local; no bun x,
instalación ni red nuevas. Se conserva sin ocultar el incidente previo del recibo
bloqueado y sus efectos externos no cuantificados. Sin .env/credenciales, prod,
containers, PG/migración real ni deploy. Pendiente revisión, cierre de dirección y
publicación; suite verde no es aceptación humana ni H1/H2/H3.

## WP-6: reparación de tres hallazgos y nuevo freeze

La revisión independiente refutó el primer freeze 346/0 con dos defectos materiales:
evento sistémico legacy en habilitadores, y desconocidos a 40000 niveles que lanzaban
RangeError. El dictamen literal independiente confirmó además el descarte del tipo
no string de valorSlot aun sin valor. Se reparan dentro de codec, sin cambio adicional
de DESIGN ni oráculos debilitados. Los resultados previos permanecen históricos.

RED propios antes de producción: agente e instrumento sistémicos y desconocido 40k,
5 pass / 3 fail (`WP-6-red-review-reparacion.log`). GREEN 8/0, 37 expectativas
(`WP-6-green-review-reparacion.log`): se recupera el reanclaje indicado por el derivado
automático también para agente/instrumento `e` sistémicos. Ambientales y ausencia de
derivado conservan contorno; no se fabrica distribución ni se llama WP-4r. Desconocidos
usan pila DFS iterativa sin límite arbitrario, preservando rutas completas, orden de
hojas, categorías, vacíos/null y originales.

valorSlot: RED propio 1/1 con negativa string (`WP-6-red-slot-sin-valor.log`); GREEN
3/0, 17 expectativas incluyendo el caso con valor anterior
(`WP-6-green-slot-sin-valor.log`). Sin valor queda ignorado y el modelo no obtiene
valor; tipo no string se informa como pérdida independiente. Fundamento literal
DESIGN §3.4.2-4 y `/tmp/opforja-rehacer/WP-6-review-dictamen-freeze-1.md`.

Se añaden solo diez regresiones: seis eventos en codec-derivados, cuatro desconocidos/
slot en codec-reglas, sin editar pruebas existentes. Bloque T-196 original líneas87–91
comparado con el RED previo y encontrado idéntico; SHA256 de ese fragmento:
`2e3c5aa5e9b1dc9d2f52c487161768aaf8bf89e53648efb29e171d42dd85996d`.

Focal final 150 pass / 0 fail, 2905 expectativas, seis archivos
(`WP-6-green-codec-reparacion-final.log`). Un único check completo posterior a las
tres reparaciones: TypeScript estricto verde; 356 pass / 0 fail, 4709 expectativas,
21 archivos, exit0 (`WP-6-check-reparacion-final.log`). Todos desde app con wrapper
`PATH=/tmp/opforja-rehacer-tools:$PATH`, sin nueva instalación/red. Una inferencia
string en los loops nuevos de pruebas se corrigió a tuple const y tsc local volvió
a verde; no se alteraron expectativas. Diff espacios exit0.

Nuevo freeze para rerevisión, sin más código mientras se evalúa. Solo estas tres
huellas difieren del primer freeze 346/0; las otras once de las14rutas permanecen:

- importar.ts: `d378cccb3d040125b41572b970eb2ed017d1ed5614209c9d94fd01338e36de73`.
- codec-derivados.test.ts: `74c96690ff550fd97a18b6da30af8b41211d484d04228e34edb068797b606f5a`.
- codec-reglas.test.ts: `7451fa86379ae7e2b5e341c1ea8b84bfe2782a8a4464d6bde82ed34172346d29`.

Manifest completo, doce etapas, filas I y evidencia histórica actualizados en
`/tmp/opforja-rehacer/WP-6-implementacion-reporte.md`. Conformidad y DESIGN de dirección
se preservan, sin tablero/documentos de contrato editados por ejecutora. B-28 pendiente.
Sin procesos de código activos, stage/commit/push, .env/credenciales, prod, containers,
PG/migración real ni deploy. Pendiente revisión y cierre de dirección.

## WP-6: reparación vecina de totalidad y freeze 364/0

La rerevisión refutó el freeze 356/0 con valorSlot objeto JSON cuyo `toString:7`
lanza TypeError al coercionar. Se inspeccionaron las conversiones locales String/
Number; las dos multiplicidades tenían el mismo vecino lanzable. RED propios
0 pass / 6 fail, 12 expectativas (`WP-6-red-total-vecinos.log`): dos objetos con
métodos no invocables, array que fabricaba texto, ambas multiplicidades objeto y
valorSlot objeto profundo a 40000 niveles.

La reparación descarta el valor objeto/array completo con su original en Informe,
sin fabricar texto ni rechazar el documento: cosa, exhibición y forma válida se
conservan sin valor. Tipo sigue pérdida independiente; números/texto/primitivos
seguros y slots sin valor conservan comportamiento anterior. Multiplicidades solo
coercionan string/number; objetos se declaran DR-21 sin perder enlace. Informe
serializa pérdidas completas mediante pila iterativa preservando JSON/orden/escapes,
sin evaluar métodos de usuario, sin recursión ni límite arbitrario. No catch global;
la aserción interna residual de desarrollo permanece intacta. GREEN focal 9/0,
47 expectativas (`WP-6-green-total-vecinos.log`) y controles adicionales de
primitivos y extensión declarada profunda pasan. Solo ocho regresiones añadidas;
ninguna prueba previa modificada y sin cambios de contratos.

Focal completo final 158 pass / 0 fail, 2957 expectativas, seis archivos
(`WP-6-green-codec-total-final.log`). Check completo ÚNICO posterior a esta reparación,
desde app con Bun wrapper: TypeScript estricto verde, 364 pass / 0 fail, 4761
expectativas, 21 archivos, exit0 (`WP-6-check-total-final.log`). Diff espacios exit0.
Los resultados 346/0 y 356/0 corresponden a freezes anteriores refutados; no se
presentan como aceptación. No nuevas instalaciones/red ni Git mutante.

T-196 original continúa íntegra: el SHA previo 2e3c5aa5... corresponde a líneas87–91
unidas con LF y LF FINAL; la extracción de dirección test→`});` SIN LF final da
`6a3eb87214a9f7b4358058dc7b87a9f7b210c51703af83d88f6a02e2e253e312`.
La igualdad literal fue comprobada; las dos huellas difieren solo por ese LF.
Referencia `/tmp/opforja-rehacer/WP-6-direccion-T196-intacto.json`.

Freeze sin procesos activos para rerevisión. Solo dos huellas cambian respecto al
356/0; las otras doce de las catorce permanecen idénticas:

- importar.ts: `f1571e4de629e7eaa7ca25f12198978074d6258de5ef1dcf0c96b52b9a9e21d7`.
- codec-reglas.test.ts: `1068831a49f36982bd9a794db3313e82ee8e8adbc8d3c9877ecd9ece2d60a8d1`.

Manifest y recibo completos actualizados en
`/tmp/opforja-rehacer/WP-6-implementacion-reporte.md`, preservando la historia/REDs y
el incidente previo. Ownership y cambios documentales de dirección conservados;
tablero/conformidad/contratos no editados por ejecutora. B-28 pendiente. Sin nuevas
fuentes/pruebas/check durante rerevisión, stage/commit/push, .env/credenciales, prod,
containers, PG/migración real ni deploy. Pendiente aceptación y publicación de dirección.


## WP-6: cierre aceptado por dirección

La revisión independiente aceptó el tercer freeze corregido en cumplimiento y calidad:
`/tmp/opforja-rehacer/WP-6-review-aceptacion-final.md`. Los dictámenes negativos y RED
anteriores permanecen en la historia de este tablero y en scratch. Los hallazgos de
reanclaje de evento sistémico, recorrido profundo, tipo del slot sin valor y coerción de
valores objeto se resolvieron con regresiones previas; no se debilitó, saltó ni puso en
cuarentena ninguna prueba. Dirección confirmó las 14 huellas del recibo final.

Check final del candidato aceptado: TypeScript estricto verde; **364 pass / 0 fail,
4761 expectativas, 21 archivos, exit 0**, log `WP-6-check-total-final.log`. Focal codec:
158/0, 2957 expectativas. La revisión ejecutó 251/0 y 4886 expectativas en su suite
conservada, más 10/0 y 123 expectativas de vecinos justificados en otra ejecución;
no se presenta la suma de 261 como un solo comando. Logs `WP-6-review-total-final.log`
y `WP-6-review-conversion-vecina.log`. Los seis fixtures originales conservan bytes;
se verificaron sintético fijo, 23 derivados, 12 mapas de OPD y 200 semillas reales.

T-196 original se comparó íntegramente por dirección y revisión con el bloque conservado:
SHA256 sin LF final `6a3eb87214a9f7b4358058dc7b87a9f7b210c51703af83d88f6a02e2e253e312`;
con exactamente un LF `2e3c5aa5e9b1dc9d2f52c487161768aaf8bf89e53648efb29e171d42dd85996d`.
Son dos extracciones del mismo bloque intacto. El archivo de pruebas creció solo con
regresiones; no se afirma que su huella completa siga igual tras esas adiciones.

DESIGN §§3.4.2-7/3.4.4 incorpora únicamente la excepción C+R autorizada antes de código:
directo completo, bytes exactos, forma válida y sin pérdida/rechazo/diff sustantivo.
Tipos, ids y contexto se conservan; reformateados y sobres siguen legacy. Sin marcadores
ni cambios de formato, canon o DECISIONS 1–28. Conformidad materializa I en B-02/04/05/06/08
y nuevas B-07/10/12/16; las once filas siguen parciales. B-19 y B-28 conservan sus límites;
no se acredita distribución refinada, OPL, render, UI o gates futuros. H1/H2/H3 pendientes.

Se cierra con un commit semántico de WP-6 y push a origin/rehacer. El SHA propio se
incorpora al iniciar el paquete siguiente, evitando un commit documental adicional.
Continúa inmediatamente WP-8a, como ordena el mandato vigente. Sin despliegue, producción,
contenedores, migración real, merge o push a main; sin nuevas instalaciones ni red externa
fuera del Git mandatado. El incidente anterior permanece declarado, sin limpieza destructiva.


## WP-8a: inicio y concreciones menores compatibles

WP-6 publicado como `dcdbbf67e36c4e817c10485586e0ea29d5efa1ce`. Dirección verificó
HEAD = origin/rehacer = ls-remote, divergencia 0/0 y árbol limpio antes de iniciar WP-8a.
main, origin/main y pre-rehacer siguen en `513ac041f6eb91dc8bf0eb5319a492eb6ff25f6d`.

Lecturas y propiedad: plan WP-8a y preflight `/tmp/opforja-rehacer/WP-8a-preflight-actual.md`.
Una ejecutora GPT-6.1-Sol High escribe exclusivamente tokens/geometria/marcadores/metricas/fuente,
herramientas/medir-fuente y sus pruebas. Dirección conserva documentos y publicación;
la revisión independiente prepara oráculos sin escribir producto. No se inicia WP-11 todavía.

Dirección concreta antes de código dos detalles que DESIGN deja a la realización:

- Paths literales de §6.4 se conservan byte a byte. La colocación transforma su marco
  intrínseco al marco con +x hacia el extremo; no altera las cadenas del canon para orientar
  puntas, arpones, piruletas o triángulos. Se comprueban dirección y cuerpo detrás del extremo.
- La métrica conserva avances regular/itálica a 1000 unidades y agrega márgenes laterales
  generados por glifo en los tamaños canónicos 11/13/17. `anchoTexto` une avance y límites
  de tinta de todos los glifos posicionados; `envolver` usa ese mismo ancho. La copia de
  expresión se normaliza a NFC, sin mutar nombres persistidos. El futuro dibujo WP-8b debe
  aplicar la misma fuente y font-kerning:none, font-variant-ligatures:none, letter-spacing:0
  y word-spacing:0. No hay medición DOM en runtime ni cambios de las firmas de DESIGN.

Fundamento de la segunda concreción: `/tmp/opforja-rehacer/WP-8a-texto-criterio.md`.
Las sondas conservadas mostraron que suma de avances o márgenes a 1000 escalados no bastan
frente a getBBox. Avances1000+márgenes por tamaño coincidieron dentro de 2% en 136 muestras
locales (11/13/17/20, regular/itálica); error máximo 0,151812%, dos corridas idénticas.
Eso es preparación, no e2e5, render integrado ni regeneración de los archivos reales.
Tamaños arbitrarios y caracteres fuera del subconjunto usan una aproximación determinista
sin garantía universal 2%; no se presenta el avance de reserva como el glifo desconocido.
Se comprobarán generador real y sus dos outputs idénticos dos veces en el turno de WP-8a.

Chromium de máquina se usa conforme al README porque /opt/pw-browsers no existe. No se
instala navegador, fuente ni paquete. Canon, DESIGN y decisiones 1–28 siguen sin cambios
por estas concreciones; una incompatibilidad material nueva requiere su propuesta expresa.


## WP-8a: recibo de ejecución del candidato local congelado

Ejecutora conserva ownership de diez archivos propios (cinco módulos opd, generador y cuatro
pruebas); fuentes/pruebas congeladas y liberadas a revisión independiente de dirección.
Recibo completo: `/tmp/opforja-rehacer/WP-8a-implementacion-reporte.md`, con manifest SHA256,
criterios, convenciones degeneradas, reproducción y límites. Estado CANDIDATO LOCAL;
no cierre/publicación por ejecutora. No se editaron fuentes vecinales, fixtures, escena/dibujo/
exportar, contratos, canon, decisiones o conformidad.

TDD real antes de producción: 0 pass /121 fail,121 expectativas,cuatro archivos,
`WP-8a-red-stubs.log`. Focal final:123 pass/0 fail,948 expectativas,cuatro archivos,
`WP-8a-green-focal-3.log`. Check integrado final desde app con Bun wrapper: TypeScript estricto
verde; **487 pass/0 fail,5709 expectativas,25 archivos,exit0**, `WP-8a-check-final.log`.
Diff espacios exit0. No prueba debilitada/saltada/cuarentena. Anotaciones de pruebas corregidas
sin cambiar afirmaciones; errores de cwd iniciales se conservan y no se cuentan como RED/GREEN.

Generador REAL ejecutado dos veces con las dos WOFF2 locales y Chromium completo147.0.7727.15
seleccionado previamente; ambas fuentes loaded y ambos artefactos byte idénticos. También la
prueba del generador repite en scratch aislado y compara contra fuentes congeladas. SHA256:
metricas.ts `d72f3729cacf97bcb50a46f69580dc91624810dd473cc244b871ff4878f7dfcd`;
fuente.ts `705701c346cb22467374faf3b23e3f4067fa69b247e4b0cebb45b71f4d5a5cff`.
Logs `WP-8a-generador-real-{1,2}.log`; primeras copias conservadas.

API generada real coincide numéricamente Bun/navegador y dentro2% de getBBox en102 textos
sintéticos (17cadenas,11/13/17,regular/itálica). Un lanzamiento adicional sin executablePath
usó chromium-headless-shell y falló bbox2.299821%; el log122/1 se conserva. Se alineó la
comprobación con el Chromium completo ya elegido, sin cambiar algoritmo/corpus/tolerancia.
No se acredita e2e5. Dirección conserva la continuidad de selección del mismo ejecutable para
WP-17 y de política CSS/NFC para WP-8b. Arbitrarios/fallback/otros visores siguen sin garantía2%.

Geometría analítica sin redondeo legacy; paths byte exactos y transformaciones con ancla/cuerpo;
peine/sector/fans/intersecciones y tokens según lecturas. La lámina scratch de helpers reales
SVG/PNG se abrió y examinó; no es golden de producto, escena, export ni validación humana.
Render/UI/gates futuros e H1/H2/H3 pendientes. Sin Git mutante, red externa, instalación,
.env/secretos, contenedores,prod/deploy/PG/migración real ni subdelegación. Espera revisión.


## WP-8a: corrección de revisión T-216 y nuevo freeze

La revisión independiente refutó el candidato487/0 con dos extremos DISTINTOS colineales
(100,0)/(200,0), caja común[-10,-10,20,20]. Acople(10,0) y sector[0,0] devolvían0arcos para
XOR/OR por una condición adicional incorrecta. La topología canónica XOR1/OR2 depende del
operador, no de una apertura angular positiva. El dictamen preliminar no cierra el paquete.
Probe/log independientes WP-8a-review-colineales.test.ts y .log se conservan(1pass/2fail).

Ejecutora añadió regresiones propias primero: RED13 pass/2 fail,63 expectativas,15seleccionadas,
55filtradas, `WP-8a-red-colineales-propio.log`. Solo se retiró la condición de amplitud0;
registros XOR/OR conservan desde=hasta, radios30/35, centro/dash/trazo y permutación. AND0 y
menos de2ramas permanecen controles. No se amplió/inventó sector ni corrigió ninguna expectativa
previa: todas las pruebas originales siguen íntegras. Se corrige la concreción equivocada del
recibo anterior “amplitud0 no inventa arcos”; su origen y refutación quedan documentados.

Focal fresh: **129 pass/0 fail,978 expectativas**,4archivos,exit0,
`WP-8a-green-colineales-focal.log`. Check fresh: TypeScript estricto verde y
**493 pass/0 fail,5739 expectativas,25archivos,exit0**, `WP-8a-check-colineales-final.log`.
Diff espaciosexit0. Ambos checks repiten generación real aislada2x/igualdad con repo y contraste
API Bun/Chromium102casos. Los artefactos metricas/fuente preservan sus huellas anteriores.
Solo cambian dos huellas del nuevo freeze:

- geometria.ts: `fb595dd6868da5cb49449bb5e7c187a45fc98229e15d5bc61bb29059919762dc`.
- geometria.test.ts: `9a6ee038e6a53e2eb2eb56276412415f5ec6c352042c16e4668446dad4710774`.

Recibo/manifest vigente `/tmp/opforja-rehacer/WP-8a-implementacion-reporte.md` conserva toda la
historia y límites. Fuentes/pruebas nuevamente congeladas, escritura liberada a rerevisión.
No fuentes vecinales/fixtures/contratos alterados ni Git mutante/red/env/instalación. Aún candidato
local, no paquete cerrado/publicado; arco colineal conserva registro pero render/export real
pertenece a futura integración, sin inventar sector ni acreditar e2e5/fidelidad visual.


## WP-8a: cierre aceptado por dirección

Dictamen independiente vigente: `/tmp/opforja-rehacer/WP-8a-review-aceptacion-final.md`.
Dirección verificó las diez huellas de `/tmp/opforja-rehacer/WP-8a-review-manifest-final.sha256`
contra el candidato y el recibo actualizado. La rerevisión dio **136 pass / 0 fail, 660
expectativas**, incluyendo las tres sondas colineales conservadas; no se cambió su oráculo.
El check integrado reciente del mismo candidato es **TypeScript estricto + 493 pass / 0 fail,
5739 expectativas, 25 archivos, exit 0**. El candidato anterior 487/0 fue refutado y permanece
como historia, junto con el RED de revisión y el RED propio; ninguna prueba se debilitó.

XOR conserva un registro de radio 30 y OR dos de radios 30/35 en el sector [0,0]; AND ninguno.
Los otros ocho archivos mantienen sus huellas, incluida la métrica y la fuente. Por ello siguen
vigentes las 174 observaciones independientes dentro de 2% (máximo 0,24052734375%), los 448
avances exactos a 1000, las 18 envolturas Bun/navegador y la doble regeneración REAL de ambos
artefactos. No se repitió la medición independiente sin un cambio que lo justificara.

No se alteraron tablas NO_* o CATALOGO ni se cerró un DEBE de conformidad ajeno al paquete.
Las once brechas registradas siguen parciales; B-19 y B-28 requieren sus integraciones futuras.
WP-8b debe aplicar la política CSS/NFC de este tablero y conservar el operador al dibujar el
sector degenerado; WP-17 debe seleccionar el mismo Chromium completo en su fixture e2e antes
de medir. El fallo de headless-shell se conserva y no recibe crédito de aceptación. No se
acreditan escena, export canónico, golden, e2e, UI, H1 ni aceptación humana del modelado.

Cierre con un commit semántico y push a origin/rehacer; el SHA se registra al iniciar WP-11.
Continúa inmediatamente el servidor mínimo. Sin cambios de DESIGN/canon/decisiones por WP-8a,
Git a main, merge, despliegue, contenedores, producción, migración real, instalaciones ni red
externa fuera del Git mandatario. Escrituras ajenas preservadas.


## WP-11: inicio y concreción menor de autenticación

WP-8a publicado como `5ceb3cbaa3829a4cd7988fb8f0b10ac170bdfbfe`. Dirección verificó
HEAD = origin/rehacer = ls-remote, divergencia 0/0 y árbol limpio antes de este inicio.
main, origin/main y pre-rehacer permanecen en `513ac041f6eb91dc8bf0eb5319a492eb6ff25f6d`.

Plan WP-11: propiedad exclusiva app/servidor/{principal,sesion,almacen,cuenta}.ts y pruebas;
una ejecutora GPT-6.1-Sol High. Dirección conserva documentos y publicación; revisión prepara
oráculos independientes en scratch. Preflight `/tmp/opforja-rehacer/WP-11-preflight-actual.md`
y contexto literal `/tmp/opforja-rehacer/WP-11-contract-context.md`. El códec WP-6 es ahora
real, aceptado y publicado: la mención de stub en el preflight es histórica y no autoriza
un doble de códec para declarar aceptación. Se utiliza el vector scrypt legado sintético
preparado; nunca cuenta, configuración de auth ni credenciales operativas.

Dirección concreta antes de código: una cabecera Authorization presente se valida como Bearer;
un valor erróneo no se oculta tras una cookie válida. Si no hay cabecera, se usa la cookie.
La regla específica de §8.2 gobierna /api/sesion: Bearer no autentica GET y DELETE con Bearer
da 400. Origin ausente no añade un requisito; si viene, debe coincidir con el host. Estas
precisiones mantienen el contrato y sus códigos; no requieren cambios de DESIGN.

Pruebas en directorios temporales propios y servidor efímero en loopback, con cuenta/HMAC/token
sintéticos explícitos; reloj controlado para límites, copias y purga. Se comprueban efectos de
CAS, escritura/errores y conservación CC-14 con códec real, no solo llamadas a dobles. No nuevas
instalaciones, red externa, secretos, contenedores, producción, migración real o despliegue.
Continúa WP-18 después del cierre y publicación WP-11. H1/H2/H3 siguen pendientes.


## WP-18: propuesta precisa pendiente por layout de build observado

Durante la preparación independiente de WP-18, dirección comprobó una discrepancia real de
DESIGN §9.1 con Bun 1.3.11. La sonda sintética aislada en
`/tmp/opforja-rehacer/WP-18-sonda-layout/` contiene solo tres módulos literales propios, sin
imports ni datos operativos. El comando literal de §9.1 termina verde pero emite:

- dist-servidor/servidor/principal.js;
- dist-servidor/servidor/cuenta.js;
- dist-servidor/herramientas/migrar-postgres.js.

Al copiar dist-servidor a ./servidor, el CMD y los comandos de §9.4 buscan archivos planos que
no existen en ese layout. La segunda sonda, con `--entry-naming '[name].js'`, emite exactamente
principal.js, cuenta.js y migrar-postgres.js en una salida plana. Ambas usaron Bun wrapper
--no-env-file y fuentes scratch; no construyeron la app ni invocaron contenedores, instalación,
red, secretos o migración. Son evidencia acotada de salida del bundler, no aceptación de imagen.

Propuesta revisable: `/tmp/opforja-rehacer/WP-18-propuesta-layout.patch`. Agrega únicamente
`--entry-naming '[name].js'` al comando de DESIGN §9.1 y declara el compartido serial de
app/package.json, vite.config.ts y playwright.config.ts en DESIGN §§12.1/12.2 y el plan WP-18.
Así WP-18 podrá corregir el andamiaje dist/cliente + dist/servidor para producir dist/ y
dist-servidor/ coherentes con el Dockerfile y su CMD. Sin nuevos endpoints, formato v0,
dependencias, instalaciones, canon, DECISIONS 1–28 o cambio de criterios/pruebas.

Contrato y plan permanecen intactos: es propuesta pendiente de supervisión, conforme a la
regla expresa de cambios de DESIGN. No bloquea WP-11 ni la preparación independiente; no se
aplicará la parte afectada de WP-18 antes de resolución. La revisión independiente contrastará
si esta corrección es mínima o existe una realización íntegramente compatible. La verificación
real de imagen permanece diferida y NO_EJECUTADA bajo la prohibición de contenedores.


Revisión independiente de la propuesta WP-18: dos dictámenes favorables técnicamente,
`/tmp/opforja-rehacer/WP-18-review-layout-contrato.md` y
`/tmp/opforja-rehacer/WP-18-review-layout.md`. Confirman el desajuste de paths y recomiendan
el flag como solución mínima. Un ensamblado posterior puede conservar el comando Bun, pero
agrega mecanismos y política de traslado de artefactos; la sonda sintética no acredita sus
imports reales. El ownership propuesto se limita al layout/arranque, sin obligar a tocar los
tres archivos si no es necesario. No constituye autorización ni aceptación de imagen.
La resolución precisa se presentó a supervisión; sigue pendiente. WP-11 continúa, independiente.


## Preparación futura WP-4r / WP-9: puntos que necesitan resolución en su turno

Preflights de lectura independientes conservados:
`/tmp/opforja-rehacer/WP-4r-preflight-actual.md` y
`/tmp/opforja-rehacer/WP-9-preflight-actual.md`. No ejecutan ni aceptan sus capacidades y
no afectan WP-11. Antes de programar los aspectos señalados deben contrastarse estas fuentes:

- DESIGN §5.2 declara que fijarBandas usa permiteErroresNuevos; §4.1 y DS-20 reservan esa
  excepción a moverSubproceso. Es una contradicción textual concreta, no una decisión resuelta
  por este preflight. El contrato vigente de distribución no cambia.
- DESIGN §5.7 pone valor en pasada A/fase 1; §5.2 crea una exhibición faltante en fase 2,
  mientras fijarValor exige el rasgo de una exhibición (F-13). VAL desde vacío necesita un
  orden coherente que preserve F-13 y el roundtrip estricto; no puede descartarse vía partial-parse
  para declarar aceptación.
- La aceptación WP-4r nombra azar.acciones, pero pruebas/azar.ts solo exporta el generador de
  modelos de WP-1. Su extensión necesita ownership serial explícito. Las 200×40 secuencias
  deben conservar su ley sin errores nuevos; los movimientos válidos para esa ley pueden
  generarse y la excepción recuperable T-269 probarse aparte, sin esconderla ni debilitar el
  oráculo. Si se pretende incluir esos movimientos excepcionales en la misma ley universal,
  debe resolverse expresamente esa tensión.

No se cambió canon, DECISIONS, DESIGN, plan, oráculos o código por estos hallazgos. Los informes
contienen citas y alternativas; las decisiones se prepararán cuando corresponda en el orden
serial, conservando el mandato de una escritora y revisión independiente por paquete.


## WP-11 — ejecución local y freeze para revisión independiente

La única ejecutora añadió exclusivamente app/servidor/{principal,sesion,almacen,cuenta}.ts y
sus cuatro pruebas. Los ocho archivos quedan congelados; no se modifica tablero, conformidad,
DESIGN, plan, configs, códec o fuentes ajenas. Este append fue liberado expresamente por dirección.
Recibo completo: /tmp/opforja-rehacer/WP-11-implementacion-reporte.md.
Manifest SHA-256 de los ocho archivos: /tmp/opforja-rehacer/WP-11-freeze-manifest.json.

Verificación local del candidato: focal43pass/0fail/409expect/4files en
WP-11-green-servidor-final.log; check completo único exit0, TypeScript local verde,
536pass/0fail/6148expect/29files en WP-11-check-final.log. Ambos logs están bajo
/tmp/opforja-rehacer/. Comandos con env mínimo PATH=/tmp/opforja-rehacer-tools:/usr/bin:/bin;
los hijos Bun nativos usan --no-env-file y configuración sintética explícita. RED reales previos
cuenta/sesión0/10, almacén0/13 y HTTP0/8; los bordes nuevos tienen RED/GREEN propios conservados
y enumerados en el recibo, sin debilitar sus expectativas. git diff --check exit0 y verificación
separada de EOF/whitespace de los ocho archivos nuevos sin errores; no Git mutante.

Se observaron dos entrypoints reales, HTTP en loopback/puerto efímero, CLI por stdin sintético,
compatibilidad del vector scrypt legado independiente, CAS concurrente,2000activos/507,
previas100PUT/1min y rotación30, CC-14 sobre bytes originales,422/informe con códec real,
Bearer/cookie/CSRF/headers y todos los códigos previstos. No se ejecutaron gates futuros.

Los límites de tamaño se comprobaron en25MiB=26214400bytes y4KiB=4096bytes UTF8 reales;
nombre200codepoints. Los fallos FS antes del rename preservan/restauran original activo;
después de instalar por rename, un fallo de fsync del directorio deja versión completa e índice/CAS
coherentes aunque la petición falle: debe releerse. DELETE instalado conserva original en papelera
y ya no declara activo. Previas/papelera pueden conservar originales del intento fallido.
No se acredita transacción multidirectorio, crash/power-loss, segundo fallo simultáneo o múltiples
procesos. Purga>30d/arranque probada; timer24h configurado, sin observar24h en producción.

Todos los procesos/timers propios terminaron; ninguna lectura de .env/cuenta real/credenciales,
instalación,bun x/npx,red externa,contenedor,PG,producción o deploy. No stage/commit/push.
La suite verde es evidencia local; no cierra ni publica WP-11. Fuentes en espera de revisión
independiente y mandato de dirección. B-28 y distribución futura no reciben crédito.

## WP-11 — primera revisión refuta el freeze de 536 pruebas

El candidato anterior queda rechazado para cierre. La revisión comprobó los ocho hashes del
freeze y observó 18 sondas verdes, 162 expectativas, pero seis sondas adversarias fallaron por
comportamiento real del servidor y el disco: 0 pass / 6 fail, 14 expectativas. El check de 536
pruebas sigue siendo evidencia de ese candidato; no acredita la aceptación ni la corrección de
estos bordes. Dictamen y RED conservados, sin sobrescribirlos:
`/tmp/opforja-rehacer/WP-11-review-dictamen-freeze536.md` y
`/tmp/opforja-rehacer/WP-11-review-adversarios-completo.log`.

- Un cuerpo de login con UTF-8 ilegible devuelve 400 antes del hash/señuelo y no cuenta como
  fallo; cinco cuerpos ilegibles permiten luego un login correcto (204). Dos sondas muestran
  el mismo defecto de uniformidad y límite de §8.2.
- Una ruta sin extensión bajo `/assets/` sirve el index correcto con caché immutable durante un
  año, en contra de la obligación `no-store` del recurso SPA (§8.1).
- El sobre `{json: <v0>}` permite que un `modelo.id` original inválido se repare como `m-import`
  y se acepte con 201. El contrato HTTP pide documento v0 en raíz y validación del id original;
  el soporte de recuperación de sobres del códec no amplía el cuerpo externo (§8.1, CC-16).
- Restaurar un histórico CC-14 con un campo desconocido descartado devuelve 201 sin informe,
  canonicaliza y elimina la última copia original. La sonda contó cero archivos que conservaran
  sus bytes en todo el árbol temporal. Es pérdida material silenciosa; no se dispensa con una
  brecha, una suite verde ni un cambio de expectativa.
- Dos arranques con archivos ilegibles distintos y el mismo filename sobrescriben el primero
  en `archivo/invalidos/`. §8.3 no fija los nombres en caso de colisión. Dirección concreta la
  conservación con un destino no ocupado dentro de ese directorio, manteniendo el basename
  cuando esté libre; no añade rutas HTTP ni amplía la autoridad operativa.

Se reabre exclusivamente la escritora de WP-11 para los cuatro defectos compatibles con el
contrato (login, caché, cuerpo/id y archivo), con regresiones propias RED antes del arreglo y sin
modificar pruebas existentes ni oráculos independientes. Las cuatro fuentes tendrán una pasada
conservadora de legibilidad de autenticación, CAS, commit, rollback y limpieza. El código de
restauración histórica queda quieto mientras dirección prepara una resolución revisable: la
tabla actual solo declara 201 `{id,rev}` / 404, pero exige escrituras canónicas y no ofrece
aceptación de pérdidas. La recomendación técnica independiente contrastará recuperación exacta,
conservación e informe antes de proponer un cambio contractual. No hay permiso tácito para
añadir 422, flags, endpoints o para ocultar pérdidas/rechazos/visibilidad.

El próximo freeze deberá conservar estos RED, incluir regresiones verdes, un check completo
nuevo y rerevisión independiente, incluidos los entrypoints reales como hijos. WP-11 sigue
abierto y sin commit/push; WP-18 mantiene su propuesta documental pendiente y los hitos siguen
pendientes. No cambian canon, DECISIONS 1–28, DESIGN ni plan por este dictamen.

## WP-11 — reparación parcial verde; resolución de restauración pendiente

La escritora conservó las 43 pruebas anteriores y añadió cuatro regresiones propias: RED
0 pass / 4 fail, 7 expectativas; después del arreglo y formato, focal 47 pass / 0 fail,
439 expectativas en cuatro archivos y TypeScript local exit 0. Recibo y huellas nuevos:
`/tmp/opforja-rehacer/WP-11-reparacion536-parcial.md` y
`/tmp/opforja-rehacer/WP-11-freeze-parcial-revision536.json`. Dirección verificó 8/8 hashes.
La restauración solo recibió formato; no cambió su conducta ni se anticiparon nuevos esperados.

La rerevisión independiente ejecutó completas las 18 sondas positivas (18/0, 162 expectativas),
las seis adversarias intactas (5/1, 17 expectativas) y cuatro pruebas de CLI y servidor como
hijos reales (4/0, 72 expectativas): total 27 pass / 1 fail, 251 expectativas. El único RED es la
pérdida silenciosa de restauración. Los entrypoints pasaron en su primera ejecución, con Bun
sin env, datos/stdin sintéticos, loopback, puerto efímero y terminación/limpieza comprobadas.
Dictamen: `/tmp/opforja-rehacer/WP-11-review-dictamen-parcial.md`; 8/8 hashes también coinciden
independientemente. Login, SPA, CC-16 y archivo sin sobrescrituras quedaron observados verdes;
las ramas de auth/CAS/commit/rollback son ahora legibles. No se repitió el check completo de un
candidato que conserva un fallo material conocido. WP-11 sigue sin aceptación ni commit/push.

### Propuesta concreta de restauración para resolución de supervisión

Patch revisable, todavía SIN APLICAR:
`/tmp/opforja-rehacer/WP-11-propuesta-restauracion-direccion.patch`.
`git apply --check` confirma que aplica a DESIGN vigente; no se modificó el contrato. La propuesta
afecta únicamente §§3.4.4, 7.3-2, 7.6, 8.1 y 10.6:

1. Importar la fuente antes de exportar. Rechazos: 400 con Informe completo; descartes: 422 con
   Informe completo. Ambos dejan la entrada original intacta (bytes, nombre y fecha), sin
   instalar un modelo ni crear respaldo. La ruta no incorpora aceptación de pérdidas.
2. Fuente histórica NO canónica sin rechazos/descartes: 201 con `canonicalizado:true` e Informe
   original completo, incluida visibilidad. Instalar canónico y conservar los bytes exactos como
   respaldo `motivo:"reemplazado"` en la papelera existente, con la retención de 30 días. El
   respaldo es durable antes de retirar la entrada fuente; las ventanas de fallo conservan la
   última copia original. Coordinar sus nombres con todos los productores de papelera.
3. Fuente canónica: mantener 201 actual, incluido id ocupado y nuevo `m-…`; la reescritura de id
   prevista por el contrato no añade por sí sola otro respaldo. Los límites comunes de tamaño,
   nombre y cupo aplican al candidato canónico: nombre > 200 caracteres da 400, tamaño 413 y
   cupo 507, sin instalar ni retirar la fuente. El 400 por nombre lleva error e Informe original
   cuando haya recanonicalización; no fabrica un rechazo del códec ni añade límite al histórico
   que CC-14 permite leer.
4. Cliente futuro: devolver éxito con sus campos opcionales o `FalloApi`; Biblioteca muestra el
   Informe completo y conserva la entrada ante rechazo. Tras red/5xx, refresca Biblioteca y
   Papelera; no repite automáticamente POST, pues puede haberse instalado el modelo. Añadir
   cobertura de originales/informes/visibilidad, id ocupado, concurrencia y fallos de escritura.

Consecuencia que requiere aceptación expresa: un histórico legible con descartes NO se restaura
mediante ese botón; devuelve 422 y permanece en papelera con su fecha y retención existentes.
Recuperarlo por el procedimiento operativo e importarlo usa el flujo de informe ya previsto.
No se añaden flags, endpoints, directorios ni formato v0; canon y DECISIONS 1–28 permanecen.

El contraste independiente A/B está en
`/tmp/opforja-rehacer/WP-11-restauracion-contrato-preflight.md`: recomienda B sin flag nuevo y
considera coherente el patch inicial; sus tres precisiones de nombres/límites/red se incorporaron
al candidato final. La alternativa de recuperar bytes históricos con 201 exige una excepción
de escrituras canónicas y reescritura fiel de sobres/paquetes al ocupar id; exportar el import
repite la pérdida y no la resuelve. Este dictamen técnico no concede autoridad contractual.

La segunda revisión independiente leyó completo el patch final de 79 líneas y no identifica
otra omisión material ni ampliación oculta. Dictamen:
`/tmp/opforja-rehacer/WP-11-review-propuesta-restauracion.md`.
SHA-256 del candidato final:
`cee62005137690b25c726a15d992a4d18a86b18035768062200273f85a45907b`.
La precisión de nombre > 200 caracteres distingue el 400 de API de los rechazos del códec;
los errores por límites conservan la fuente. La revisión es favorable a la propuesta como
cambio explícito, pero no autoriza ni acepta su implementación. Los oráculos y RED siguen
intactos hasta resolución documental.

La pausa del aspecto afectado deriva de la instrucción expresa del dueño: si DESIGN debe
cambiar, proponer en HANDOFF y detenerlo. Se conserva todo el trabajo y todos los RED. Tras
resolución: documentar primero, regresar RED→GREEN, rerevisión independiente y check íntegro
nuevo, luego commit/push único de WP-11 y WP-18 en el orden autorizado. La propuesta WP-18
de layout/ownership sigue pendiente por separado. Ningún hito cerrado ni prueba dispensada.

### Resolución expresa de WP-18: layout y ownership autorizados

El dueño respondió «Autorizar la corrección acotada» a la pregunta precisa de WP-18 registrada
arriba: añadir `--entry-naming '[name].js'` en DESIGN §9.1 y declarar `app/package.json`,
`app/vite.config.ts` y `app/playwright.config.ts` compartidos seriales de WP-18, exclusivamente
para layout y arranque. Patch autorizado:
`/tmp/opforja-rehacer/WP-18-propuesta-layout.patch`. Los dos dictámenes y la sonda conservados
sustentan la resolución. El ownership habilita los ajustes necesarios, no obliga a editar los
tres archivos ni amplía dependencias o criterios.

Esta resolución revoca solo el estado pendiente de esa propuesta de WP-18. Dirección aplicará
primero su patch documental al iniciar el paquete, tras aceptar/publicar WP-11, y conservará el
commit/push propio de cada paquete y el orden lineal. No se ha aplicado todavía DESIGN/plan ni
se ha escrito código futuro. No autoriza contenedores, instalaciones, red adicional, producción,
deploy, migración real, merge/push main, costes, destrucción ni acceso a credenciales. La
propuesta de restauración WP-11 sigue pendiente de una resolución diferente y precisa.

### Resolución expresa de WP-11: propuesta B autorizada

Supervisión comunicó la autorización expresa de Félix sobre la propuesta documental B de
79 líneas, SHA-256 `cee62005137690b25c726a15d992a4d18a86b18035768062200273f85a45907b`,
en `/tmp/opforja-rehacer/WP-11-propuesta-restauracion-direccion.patch`. Dirección verificó esa
huella antes de aplicarla. Se registra PRIMERO esta resolución; a continuación se aplica
únicamente ese patch en DESIGN y se libera a la única escritora para la corrección acotada.

La autorización cubre 400/422 con Informe y entrada intacta, histórico recuperable con Informe
completo y respaldo exacto de 30 días, límites y coordinación de nombres, y el contrato de
cliente/Biblioteca detallado en el candidato. Revoca el pendiente de B; no autoriza otras
excepciones de DESIGN, contenedores, red adicional, despliegue, migración real ni ampliación
de publicación. WP-18 conserva su autorización anterior y sigue tras el cierre de WP-11.

La aceptación de WP-11 requiere RED→GREEN observado, originales byteexactos, límites,
concurrencia/fallos, revisión independiente y check íntegro NUEVO. Se preservan todos los RED
anteriores y las pruebas existentes. Las contradicciones previsibles de fijarBandas/DS-20,
VAL/exhibición, volumen Compose y aclaraciones seriales menores se agruparán en una propuesta
revisable separada; esta resolución no permite implementarlas. Continúa el objetivo original.

Aplicación documental observada antes de liberar código: DESIGN cambió exactamente con el
patch autorizado (32 inserciones, 3 supresiones; seis hunks), git diff --check exit 0.
README/plan, canon y DECISIONS no se modificaron por esta resolución. Las ocho fuentes de
servidor seguían en el freeze parcial al registrar y aplicar el contrato.

### Propuesta agrupada de contradicciones previsibles — pendiente de autoridad

En cumplimiento de la supervisión se preparó una propuesta única, SIN APLICAR:
`/tmp/opforja-rehacer/propuesta-contradicciones-previsibles.md` y su patch documental de
156 líneas `/tmp/opforja-rehacer/propuesta-contradicciones-previsibles.patch`, SHA-256
`b1aaef41f9ef5a8008978cbace9236a773deb0b387b793af8d25e3c186952cd6`.
Dirección leyó completos informe/patch, verificó la huella y `git apply --check` exit 0.

La resolución propuesta conserva canon, DECISIONS 1–28, DS-20, F-13, las tres fases y las
firmas públicas. Corrige únicamente las contradicciones documentales y propiedad serial:

1. `fijarBandas` pública aplica cierre DS-20 normal; solo `moverSubproceso` usa su excepción.
   Ambas pueden compartir preparación interna de partición/layout, sin migrar enlaces.
   El oráculo 200 semillas × 40 acciones permanece; la excepción recuperable se prueba además
   por fixture independiente. No filtrar acciones por su resultado ni reducir contadores.
2. VAL con exhibición existente conserva fase 1; si falta, el patch ya existente se resuelve
   en fase 2 con crear/reusar exhibición ANTES de fijarValor. Se ordenan patches y después se
   aplanan sus acciones, sin cuarta fase, operación nueva, estado huérfano ni duplicado RF2/VAL.
   Ensayo y aplicación usan la misma secuencia y deben acreditar strict, conflicto e idempotencia.
3. Compose declara únicamente `name: opforja-datos` para alinear su nombre físico con los
   consumidores de respaldo/migración existentes. No autoriza operaciones Docker ni datos reales;
   la prueba estática futura no sustituye el gate de imagen real.
4. WP-4r recibe extensión serial de `app/src/pruebas/{azar.ts,azar.test.ts}` para `azar.acciones`
   y propiedad explícita de `nucleo/{refinamiento,secuencias,reparaciones}.test.ts`, ya exigidos.
   Preserva generador, API, perfiles, semillas y pruebas históricas de WP-1.

El dictamen independiente `/tmp/opforja-rehacer/WP-11-review-contradicciones-previsibles.md`
considera las cuatro correcciones mínimas y coherentes tras contrastar canon/DESIGN/DECISIONS;
no concede autoridad ni acredita implementación. La aclaración del informe sobre partición
vacía no prohíbe `[]` para un conjunto vacío si el contrato lo permite.

La propuesta modifica solo DESIGN, README y plan.json en los ámbitos citados. Se separó
mecánicamente para aplicar cada corrección documental ANTES del código de su propio turno,
si se autoriza, preservando B y el layout de WP-18 ya autorizado por separado:

- WP-18, volumen: 15 líneas; SHA-256
  `122ad81520c263ae9244e0538369f03d96920b07386656bfe56f0d4222eb7174`.
- WP-4r, DS-20/propiedad/secuencias: 57 líneas; SHA-256
  `b014aae87d8ebb0335ddbf7dad807b88b4e13a616fbdd8af13bd392095a7b591`.
- WP-9, VAL: 41 líneas; SHA-256
  `ff7194284939b796af907dac3c01f00e12ef7d2d30687db962103768d6676781`.

Los tres patches scratch se llaman `propuesta-contradicciones-previsibles-WP-<id>.patch`;
su reunión reproduce exactamente el bundle. No se aplicó ninguno. Se refrescará solo su
contexto al turno correspondiente, conservando el contenido autorizado y toda edición ajena.
No incluye interfaces futuras de editor, catálogo/FAN5A ni otra excepción. La autorización
de restauración B/layout no cubre este bundle; el aspecto contractual afectado queda pendiente
de resolución expresa mientras WP-11 continúa con su revisión y aceptación.

### WP-11 — implementación B y nueva revisión física

Tras documentar la autorización B, la única escritora conservó las 47 pruebas previas y añadió
19 casos de restauración. RED propio corregido de fixture: 3 pass / 13 fail, 54 expectativas,
16 casos (`WP-11-red-restauracion-B-fixture-verificada.log`). El primer log se conserva y
se distingue su error de campo wire `aparienciasEnlace` frente a `enlaces`; solo se corrigió
ese montaje, sin cambiar esperados. Otro RED propio confirmó pérdida de la entrada canónica
ocupada tras unlink + fsync fallido (`WP-11-red-restauracion-B-canonico-sync.log`).

El candidato B congelado alcanzó focal 66/0, 593 expectativas; TypeScript local exit 0;
check NUEVO 559/0, 6332 expectativas en 29 archivos (`WP-11-check-restauracion-B-final.log`).
Dirección verificó sus 8/8 hashes (`WP-11-freeze-restauracion-B-final.json`). Recibo:
`/tmp/opforja-rehacer/WP-11-restauracion-B-implementacion-reporte.md`. No se acepta ni publica
ese candidato solo por su suite verde.

La revisión independiente confirmó las ocho variantes históricas directo/registro/recovery/
portable por id libre/ocupado: informes originales y visibilidad, canónico instalado y respaldo
byteexacto. También pasaron nombre/tamaño, lectura histórica > 25 MiB, fuente canónica ocupada
sin respaldo artificial, carreras de entrada/nombres, tres fallos FS y retención de 30 días.
Las 18 sondas positivas, seis adversarias B y cuatro entrypoints reales pasaron completas.

La sonda física nueva sí encontró un defecto material: un único byte FF ilegible como UTF-8
en el archivo original se decodifica por sustitución y se activa como otro texto con U+FFFD,
bytes/revisión distintos. Las precondiciones de su fixture y el control U+FFFD válidamente
codificado EF BF BD pasaron. Log conservado:
`/tmp/opforja-rehacer/WP-11-review-restauracion-physical-B-final.log`. La obligación observada
es legibilidad UTF-8 y preservación/CAS del original; DESIGN no prescribe el algoritmo decoder.
No se propone otra excepción contractual ni se acepta una revisión sobre bytes fabricados.

Dos sondas de cupo agotaron el tiempo durante su montaje de 2.000 guardados/fsync secuenciales;
son fallos del harness, no RED acreditado del producto. La revisora conserva ambos logs y
los esperados mientras sustituye únicamente la siembra por archivos canónicos propios e
inicialización real. Las fuentes permanecen quietas hasta terminar esa revisión; después la
misma escritora reparará el defecto físico con RED→GREEN y check íntegro nuevo. WP-11 sigue
sin aceptación/commit/push y sin crédito de H1.

Dictamen independiente cerrado:
`/tmp/opforja-rehacer/WP-11-review-dictamen-B-final-negativo.md`. Por ejecución: positivas
18/0 (162 expectativas), adversarias B 6/0 (23), entrypoints 4/0 (72), restauración/físicas
21/3 (278, incluidos los dos timeouts de setup), rerun exclusivamente de cupo/carrera 2/0
(4009). Los 52 casos distintos consolidan 51 GREEN y un RED físico del producto; no hubo
una ejecución única 51/1. Setup previo y motivo conservados. Se liberó la reparación física
solo después de terminar todas las sondas y cerrar sus procesos.

La preparación independiente de WP-18 está en
`/tmp/opforja-rehacer/WP-18-review-preparacion-independiente.md`. Precisa una errata del
preflight antiguo: DESIGN §8.7 sí fija el timer a diario a las 03:30. Ese literal manda;
no hay horario libre. Su apéndice antiguo de integración queda supersedido por las
autorizaciones actuales: layout/ownership autorizado, volumen bundle aún pendiente.

### Resolución expresa del bundle — autoridad documental acotada

Supervisión comunicó el «Autorizo» expreso de Félix sobre las cuatro correcciones del patch
de 156 líneas `/tmp/opforja-rehacer/propuesta-contradicciones-previsibles.patch`, SHA-256
`b1aaef41f9ef5a8008978cbace9236a773deb0b387b793af8d25e3c186952cd6`.
Dirección volvió a verificar huella y contador y registra esta resolución ANTES de aplicar
cualquier parte. Revoca únicamente el pendiente del bundle preciso presentado y revisado.

Quedan autorizados: fijarBandas pública con cierre normal y excepción solo moverSubproceso;
VAL con exhibición faltante como compuesto de fase 2 antes de fijar valor, con F-13 y strict;
nombre físico Compose `opforja-datos`; propiedad serial mínima de pruebas WP-4r conservando
generador histórico, expectativas y 200 semillas × 40 acciones. No hay otra excepción de DESIGN.

Aplicación prevista, todavía SIN APLICAR: la parte volumen se integrará documentalmente al
abrir WP-18 junto al layout ya autorizado; DS-20/propiedad/secuencias al abrir WP-4r; VAL al
abrir WP-9. Se comprobará cada patch separado y se refrescará únicamente contexto contra
DESIGN/README/plan vigentes para conservar B/layout y cualquier edición ajena, sin cambiar
contenido aprobado. Cada implementación espera su turno, RED→GREEN, check y revisión
independiente; aprobación documental no equivale a aceptación ni cierre.

No autoriza Docker, red adicional, instalación, credenciales, destrucción, PostgreSQL real,
despliegue ni ampliación de publicación. Permanece el mandato de commit/push por paquete en
rehacer y PR final, sin merge/push main. WP-11 continúa con la misma escritora en reparación
UTF-8, nuevo freeze, check y revisión completa antes de cerrar; después sigue WP-18 y el
resto del orden lineal. Los estados pendientes de las secciones históricas quedan preservados
como evidencia anterior y supersedidos exclusivamente por esta resolución.

### WP-11 — cierre aceptado del servidor mínimo

Dirección acepta el freeze físico final después de la reparación y revisión COMPLETA requerida
por supervisión. Recibo de implementación:
`/tmp/opforja-rehacer/WP-11-utf8-fisico-implementacion-reporte.md`; manifest:
`/tmp/opforja-rehacer/WP-11-freeze-utf8-fisico-final.json`. RED propio previo 2/6 (17
expectativas, ocho casos) pasó a 8/0 (37); se añadió después una novena regresión HTTP de
integración sin atribuirle un RED inexistente. Las 66 pruebas previas permanecen; focal final
75/0, 663 expectativas. TypeScript exit 0 y check NUEVO único 568/0, 6402 expectativas en
29 archivos (`WP-11-check-utf8-fisico-final.log`). Dirección verificó los ocho archivos y
sus hashes exactos antes de integrar; no se modificó el códec ni T-196.

Dictamen independiente favorable:
`/tmp/opforja-rehacer/WP-11-review-dictamen-utf8-final.md`. Se repitieron completas las
52 sondas conservadas y se añadieron ocho comprobaciones físicas: los 60 casos distintos
quedaron GREEN, sin fallo material pendiente observado. Los conteos reales por ejecución
son 18/0 (162 expectativas), 6/0 (23), 4/0 (72), 31/1 (4398), 1/0 (17) y 2/0 (43).
No se presenta ese consolidado como un único run 60/0. El único fallo 31/1 era una
sobre-especificación del oráculo nuevo que exigía 500 al listar papelera ilegible: la lista
200 es literal de §8.1; omitir lo que no permite construir una FilaPapelera legible es
interpretación compatible, no mandato textual. Se conserva el oráculo/log original y el
ajuste fundado refuerza Buffer/SHA/tamaño/mtime/nombre/árbol y control legible. Los otros
oráculos, incluidos los 52 anteriores y T-196, permanecen intactos. La revisión verificó
8/8 hashes antes y después; todos sus procesos terminaron.

Aceptación de plan.json observada: cookie/CSRF/Origin y Bearer, códigos/cabeceras/version,
cuenta y hash scrypt legado reales sobre fixtures sintéticas; CAS concurrente y previas;
respaldo PUT y restauración B con Informe original completo, visibilidad y fuente exacta;
400/422 y límites 4 KiB/25 MiB/200 puntos/2000 modelos, CC-14/CC-16, ocho variantes
históricas × id libre/ocupado, carreras de cupo/entrada/nombres, retención y fallos FS.
UTF-8 válido conserva bytes/revisión; el ilegible no fabrica texto ni cuenta. BOM se
preserva para el lector real. En corrupción posterior, los lectores requeridos exponen
el error IO existente y conservan la fuente; no inventan Informe.

Los freezes 536 y 559 refutados, todos los RED y los dos errores de montaje/oráculo quedan
preservados con su clasificación y reparación. No se debilita, salta ni pone en cuarentena
ninguna prueba. No se promete transacción multidirectorio, tolerancia comprobada a cortes
eléctricos, múltiples procesos o dos fallos FS simultáneos. Los datos, cuentas y servidores
de prueba fueron propios/sintéticos; no hubo producción, contenedores ni migración real.

No se agregaron/cerraron filas de catálogo o listas NO_* ni DEBE OPM en WP-11: las once
brechas parciales de docs/conformidad.md siguen vigentes y B-28 refinado espera WP-4r/H2.
No corresponde inventar una brecha para dispensar una pérdida conocida: las detectadas se
repararon y comprobaron. H1 aún espera WP-18 en su turno de redacción; H2/H3 permanecen.

Publicación: fetch origin/rehacer completado y divergencia previa 0 0. Se integra únicamente
HANDOFF, el DESIGN B autorizado y los ocho archivos del servidor. El SHA del commit de este
recibo se fija al abrir el siguiente paquete, sin amend ni segundo commit de WP-11.
Sigue WP-18 directamente: aplicar primero layout/ownership y volumen documentales ya
autorizados, después una única escritora, pruebas de scripts/check y revisión independiente;
imagen real sigue diferida tras WP-14 y NO_EJECUTADO bajo la prohibición de contenedores.

### Apertura serial de WP-18

WP-11 publicado en `a82f2bdf2270132eb14891ce0967de7050eb20ff`: HEAD, origin/rehacer y
ls-remote iguales, divergencia 0 0 y árbol limpio. Main/origin/main y tag pre-rehacer siguen
en `513ac041f6eb91dc8bf0eb5319a492eb6ff25f6d`; no hubo push/merge main.

Se registra ANTES de código la aplicación de los dos alcances documentales autorizados de
WP-18: patch de layout/ownership y parte volumen del bundle aprobado. Dirección comprobará
y aplicará solo `/tmp/opforja-rehacer/WP-18-propuesta-layout.patch` y
`/tmp/opforja-rehacer/propuesta-contradicciones-previsibles-WP-18.patch` (15 líneas, SHA-256
`122ad81520c263ae9244e0538369f03d96920b07386656bfe56f0d4222eb7174`). El contrato B
se preserva; las partes DS-20/VAL quedan para sus turnos futuros, sin aplicación anticipada.

Propiedad serial de package/vite/playwright limitada a layout/arranque, incluida conexión
de main.tsx mediante configuración Vite pre-transform dentro de esa propiedad. Índice HTML
no se modifica fuera de ownership. Timer literal DESIGN §8.7: 03:30 diario. Dockerfile,
Compose, deploy/respaldo y unidades son redacción comprobable en este turno; pruebas locales
de scripts con copias/datos propios y sustitutos estrictos, sin Docker/red reales. Check del
paquete y revisión independiente obligatorios. Gate de imagen real se difiere según plan
hasta después de WP-14 y queda NO_EJECUTADO bajo la prohibición humana de contenedores.

Aplicación documental efectiva observada antes de liberar a la escritora: ambos patches
pasaron git apply --check y se aplicaron sin conflicto; diff --check exit 0. DESIGN incorpora
únicamente layout/ownership WP-18 y nombre físico de volumen (7 inserciones/5 supresiones);
README incorpora la línea compartida y plan.json el ownership acotado. B permanece íntegro;
DS-20/VAL del bundle no se aplicaron todavía.

WP-18 inició TDD sobre copias aisladas: RED 8 pass / 14 fail, 43 expectativas en 22 casos
(`/tmp/opforja-rehacer/WP-18-red-inicial.log`). El sustituto estricto bloqueó la llamada
legacy de corpus; layout/circuito antiguos y respaldo/unidades ausentes fueron refutados.
Las negativas que ya pasaban por rechazo temprano se conservan y deben llegar a su camino
real en GREEN. No se invocaron Docker/red reales ni scripts operativos originales.

Precisión menor de realización dentro del literal de respaldo: retención de 14 días por
tiempo transcurrido, conservando la frontera y retirando lo vencido; no sumar tácitamente
un día por redondeo de mtime. La poda afecta solo archivos regulares con nombre diario
`opforja-YYYY-MM-DD.tgz`, preservando ajenos incluso con prefijo parecido, y ocurre solo
tras publicar el archivo completo. Se comunicó antes de verificar el candidato y no cambia
DESIGN ni autoriza operación real. Las sondas independientes fijan sus esperados desde
esta precisión y el literal normativo, sin copiar el resultado de implementación.

El migrador todavía NO existe; la mención previa de stub fue inexacta y se corrigió.
WP-18 conserva el comando final de tres entradas, comprueba el layout con principal/cuenta
reales y declara la tercera entrada pendiente de WP-12. No crea ni simula un migrador ajeno.
Build completo se verifica tras WP-14, posterior a WP-12; no se dispensa ni marca verde
la ausencia actual. Imagen real sigue NO_EJECUTADO bajo prohibición de contenedores.

### WP-18 — aceptación del turno de redacción y validación local

Dirección acepta el candidato congelado de once archivos, sin adjudicar la aceptación futura
de imagen. Recibo completo: `/tmp/opforja-rehacer/WP-18-implementacion-reporte.md`;
manifest: `/tmp/opforja-rehacer/WP-18-freeze-manifest.json`. Focal propio final de deploy:
30 pass / 0 fail, 151 expectativas. TypeScript local, sintaxis Bash y diff check exit 0.
Check completo NUEVO: 568 pass / 0 fail, 6402 expectativas, 29 archivos, 18.24 s,
`/tmp/opforja-rehacer/WP-18-check-final.log`. El focal deploy no forma parte de ese check.
Las once huellas fueron reverificadas y las ocho fuentes WP-11 permanecen intactas.

RED→GREEN conservado: 8/14 inicial; frontera de retención que se adelantaba por redondeo;
publicación sobre directorio homónimo y servidor de pruebas sin host explícito; fallo
`git status` 38 confundido con árbol limpio. Se repararon con comparación >14 días,
rename mv -fT, loopback explícito y asignación autónoma de status bajo set -e. Los errores
previos de cwd/gzip/env del harness se distinguen y sus logs se conservan. No se retiró
ni debilitó ninguna expectativa; las negativas finales alcanzan su camino real.

Dictamen favorable: `/tmp/opforja-rehacer/WP-18-review-dictamen-final.md`. Revisión distinta
de la escritora: 28 casos distintos GREEN, distribuidos en shell 18/0 (82 expectativas),
layout 2/0 (5), retención 2/0 (22) y estáticos/configuración 6/0 (70). Una repetición focal
1/0 (14) fortaleció la igualdad exacta de 14 días, sin contarla como caso nuevo. Verificó
11/11 hashes y modos antes/después, WP-11 8/8 intacto y Bash -n exit 0. No observó defecto
material. Los ajustes privados previos del stub mv y variable de destino se documentaron
sin cambiar los oráculos de conservación, fallo o poda.

Plan observado en este turno: scripts escritos con herramientas sustituidas estrictamente
sobre copias/datos propios; respaldo completo byteexacto, permisos privados, fallos de
lectura/compresión/publicación preservando anteriores, sin poda al fallar; retención >14d
con frontera conservada a resolución de un segundo y solo archivos regulares diarios
propios. Circuito Git/Compose/salud-versión/sesión401/HTML y códigos de fallo comprobados
con sustitutos; ningún Docker, Compose ni despliegue real. Timer literal 03:30 inspeccionado,
sin instalar unidades. Compose declara un servicio y nombre físico opforja-datos autorizado.
Dockerfile se revisó estáticamente, sin afirmar contenido efectivo de una imagen.

Bun real compiló únicamente principal.js/cuenta.js planos a temporales propios, sin ejecutar
los bundles. Migrar-postgres.ts todavía ausente hasta WP-12 y main.tsx hasta WP-14. Vite
pre-transform y comando Playwright aislado se comprobaron por invocación local/proxy;
no acreditan UI ni e2e. El comando final de tres entradas y build completo conservan su
gate futuro, sin stubs. La verificación de imagen de plan.json queda NO_EJECUTADO tras
WP-14 según README; la prohibición humana de contenedores sigue vigente. No se dispensa
esa aceptación, no se acredita runtime, snapshot global, recuperación operativa ni powerloss.

### H1 — resultados de la ola 1 y continuidad

Contratos WP-1, matriz WP-2, proyección WP-4p, códec WP-6, geometría/fuente WP-8a y servidor
WP-11 están aceptados con revisiones independientes y checks verdes. Los seis fixtures v0
importan ok en WP-6; su punto fijo, derivados e informes de visibilidad conservan evidencia.
La revisión acumulada de firma/identidad/estado, códec, proyección y brechas no encontró
una brecha silenciosa adicional en esta ola. La excepción C+R se documentó antes de código
con T-196 intacta, y B preserva íntegros Informe y bytes históricos. Geometría/fuente tienen
mediciones observadas; todavía no se atribuye fidelidad del render completo ni roundtrip
OPL futuro por esos resultados.

Conformidad mantiene once brechas parciales materializadas: B-02, B-04, B-05, B-06, B-07,
B-08, B-10, B-12, B-16, B-19 y B-28. WP-11/WP-18 no cambian filas NO_* o CATALOGO ni
cierran DEBE OPM. B-28 declara expresamente pendiente la equivalencia menú/creación con
resultado efectivo de distribución refinada real en WP-4r/H2; no se acredita con stubs.
Las dimensiones P/U y demás integración futuras siguen pendientes según conformidad.

H1 cumple sus criterios semánticos y check actuales; la ola 1 solo exige redacción WP-18.
La aceptación de imagen permanece registrada aparte para después de WP-14. H2/H3 siguen
pendientes. Publicación de este turno: un commit semántico y push rehacer, sin main;
el SHA se fijará al abrir WP-3a. Sigue WP-3a inmediatamente, después WP-3b/WP-5/WP-7/WP-8b
y el resto lineal hasta el objetivo completo, sin pausar por cierre de paquete o hito.

### Apertura serial de WP-3a

WP-18 publicado en `978605960ff405b5cd50aa7a5fb673703ad4c286`: HEAD, origin/rehacer y
ls-remote iguales; divergencia 0 0 y árbol limpio antes de esta apertura. Main/origin/main/tag
conservan `513ac041f6eb91dc8bf0eb5319a492eb6ff25f6d`. Su imagen sigue pendiente.

Propiedad: nucleo/cosas.ts, estados.ts y sus respectivas pruebas. Única escritora GPT-6.1-Sol
High; dirección conserva documentos/Git y la revisión es independiente. Se reutiliza preflight
actual de WP-3a, contrastando las lecturas del plan, sin cambios contractuales. DS-5, DS-6 y
DS-20 contra original, entrada inmutable, trazas, IDs, selección múltiple y proyección real
son aceptación de este turno. Crear primer subproceso y distribución real 0→1 es integración
serial de WP-4r según plan; no se acredita ahora con doble ni éxito inventado. RED→GREEN,
check completo nuevo y freeze/revisión preceden a aceptar y publicar WP-3a.

### Hallazgo en contraste para WP-5 — continuidad R+C y metadatos

La preparación independiente WP-5 identifica una incoherencia documental: canon R-PREC-2/3
condiciona recomposición/conflicto a continuidad trazable de identidad/estados; DESIGN §4.4
fija conflicto warning/contención sin continuidad, pero §4.6 paso 4 exige ambos/conflicto
para todo R+C. La proyección aceptada reproduce ese último literal y sus pruebas exigen
error/gramatical también para R+C y para precedencia inválida, contrario al catálogo de §4.4.
Dirección contrastó las fuentes. No está cubierto por las cuatro correcciones autorizadas.

Se preparan sondas propias sobre la proyección estable con forma/contexto reales para distinguir
el defecto observado de posibles montajes sin prueba de continuidad. Todavía no se adjudica un
RED ni se modifica contrato, proyección o pruebas. La propuesta precisa y su revisión deberán
preceder a cualquier corrección contractual; WP-3a continúa solo dentro del contrato vigente.
Los verdes anteriores de H1 son evidencia histórica y no dispensan este hallazgo posterior.

La sonda real `/tmp/opforja-rehacer/WP-5-continuidad-proyeccion.test.ts` observó 5 pass /
2 fail, 67 expectativas: RED de continuidad directa (mismo objeto/estado propio, resultado
anterior a consumo en bandas estrictas) y RED de metadata R+C. Cinco negativas conservan
ambos hechos y conflicto. Forma, contexto esperado y pureza pasaron antes de ambas refutaciones;
no son errores de montaje. Log original conservado. La revisión independiente de esta evidencia
y propuesta está en curso; ninguna corrección fue aplicada. H1 se reabre en este aspecto.
B-29 registra temporalmente el DEBE incumplido en conformidad, sin usar la brecha para dispensarlo.
La reparación contractual sigue pendiente de resolución expresa; WP-3a continúa independiente.

### Propuesta precisa WP-5 — B-29, continuidad R+C y metadata (SIN APLICAR)

Patch revisable: `/tmp/opforja-rehacer/WP-5-propuesta-continuidad-proyeccion.patch`,
64 líneas, SHA-256 `4058a22a41b22fb2d434481592c3ae71aec8ce9eb20e4e1b6d4b1a8e5fae1e72`.
Dirección verificó huella y `git apply --check` exit 0 sin aplicar. Versiones previas de 55
líneas y 64 líneas se conservan como v1/v2, con hashes y sus dictámenes. La versión final solo
amplía la aceptación recomendada; no fija un algoritmo privado como definición exhaustiva.

Diff propuesto: §4.4 atribuye precedencia inválida a R-PREC-1/AP-30, manteniendo error/contención;
§4.6 restituye R-PREC-2 (efecto únicamente con continuidad de identidad/estados trazables,
procedencia íntegra) y R-PREC-3/4 (sin evidencia, ambos hechos/conflicto warning/contención).
DESIGN/README/plan declaran propiedad serial mínima WP-5 sobre proyeccion.ts,
proyeccion.test.ts y frontera.test.ts para esa reparación y metadata. No retira propiedad ni
aceptación original WP-5, canon/decisiones, formato v0, APIs o los ajustes B/layout/volumen,
DS-20/VAL y semillas previamente autorizados.

Aceptación añadida: positivos de continuidad directa, cadena R→E→C y anidado secuencial;
negativos de estados sin conexión/cadena rota y ancestros paralelos sin inventar orden escalar.
Exige firma de estados, IDs/procedencia, entrada inmutable, anclajes visibles y 12 fuerzas
sin pérdidas, nueve celdas, negativos previos y ley/oráculo independiente de frontera.
Metadata §4.4 con la misma cobertura, corrigiendo el esperado errado sin quitar casos.
Los 34 códigos P/N, reparaciones bien formadas y T-ID originales siguen íntegros.

Revisión independiente favorable a la dirección semántica con esa aceptación explícita:
`/tmp/opforja-rehacer/WP-5-review-propuesta-continuidad.md`. Los siete casos originales 5/2
se conservan. Sus seis casos propios distintos válidos consolidan cuatro RED producto y dos
GREEN: directo, cadena, anidado secuencial y metadata R+R fallan; cadena rota y anidado paralelo
preservan R+C. Primer run 1/5 (31 expectativas) incluye dos F-7 de montaje, no fallos producto;
archivo/log preservados, corrección solo de orden de hermanos y rerun anidado 1/1 (19)
sin alterar esperados. No se suman esos runs como suite única ni se atribuye un algoritmo
completo por los testigos positivos. La revisión documental final de la huella ampliada precede
a solicitar resolución. No hubo reparación ni modificación de pruebas de producto.

Pendiente de autorización específica de Félix/supervisión por cambio de contrato y ownership,
conforme al plan. Aplicación solo al abrir WP-5 si se autoriza; ninguna implementación de esa
corrección antes de documentar la resolución. WP-3a y preparación independiente compatible
continúan sin usar el hallazgo para cambiar sus contratos ni atribuir verde definitivo a H1.

### WP-3a — concreciones conservadoras dentro del contrato vigente

Dirección conserva el rechazo tipo-incompatible al convertir objeto con valor puntual:
F-13 no representa ese hecho en un proceso y §4.2 no autoriza retirarlo en cambiarTipoCosa.
El operador puede ejecutar fijarValor(null) explícitamente antes del cambio. Igual criterio
para proceso con duración: fijarDuracion(null) previo, original/campo/argumentos/IDs intactos
al rechazar. La retirada automática de duración no tenía prueba estable ni fuente explícita;
era una decisión de implementación aún sin aceptar. Se exige RED→GREEN para esa corrección.
No es una nueva prohibición OPM, API, pérdida consentida implícitamente ni excepción DS-20.

La dependencia 0→1 de crearCosa se limita por capacidad serial: con contorno procedimental
vacío la distribución es vacua y se verifican membership/ID/trazas reales; con contorno no
vacío que aún espera hook WP-4r, rechazo producto antes de reservar IDs/publicar candidato.
Se consume esProcedimental compartido, sin segunda tabla de migración. Positivo vacuo queda
nativo; negativo temporal tiene RED→GREEN scratch preservado, sin convertir un rechazo de
capacidad pendiente en prohibición canónica o expectativa nativa permanente que impida WP-4r.
El hook futuro sustituirá esa guarda con distribución real y aceptación propia, sin debilitar
las pruebas estables ni atribuir su aceptación a un doble. B-28 mantiene la integración pendiente.

### WP-3a — freeze de candidata y propuesta mínima del harness (SIN APLICAR)

Las cuatro fuentes quedan congeladas según `/tmp/opforja-rehacer/WP-3a-freeze.sha256`
y `WP-3a-freeze-manifest.json`. Recibo completo: `WP-3a-implementacion-reporte.md`.
Observado nativo: 78 pass / 0 fail, 751 expectativas, dos archivos; TypeScript verde.
Incluye RED→GREEN real de lote vacío, overflow F-12, conservación de duración y referencias
de impedimentos; los montajes originales fallidos quedan preservados y diferenciados.
La guarda temporal 0→1 conserva su sonda scratch separada; no se suma al conteo nativo.

El check completo nuevo terminó 641 pass / 5 fail, 7153 expectativas, 31 archivos,
exit 1 (`WP-3a-check-final.log`). Los cinco fallos son SyntaxError al cargar la exportación
violacionesForma ausente del doble matriz de resultado.test.ts, antes de ejecutar el cuerpo.
No se atribuyen a comportamiento de WP-3a ni se acepta/publica el paquete con ese check.
La revisión independiente de las cuatro fuentes y sondas propias está activa; la escritora
las conserva inmóviles mientras se resuelve el ajuste del harness ajeno a su propiedad.

Propuesta precisa: `/tmp/opforja-rehacer/WP-3a-propuesta-harness-transaccion.patch`,
53 líneas, SHA-256 `fd8af23b5288fb520124f1f237a3e546bd1a3c4d01271116d5b538aac175b9b7`.
DESIGN §12.1/tabla WP-3a, README y plan.json declaran propiedad serial mínima sobre
nucleo/resultado.test.ts únicamente para añadir violacionesForma al doble aislado.
El único cambio ejecutable es esa exportación, que lanza el mismo fallo fuera del doble
que noOfrecido. Casos, cuerpos, expectativas, aislamiento y demás guardas WP-1 intactos.
No se cambia producción para adaptarla al doble, firmas públicas ni canon/DECISIONS/v0.
Los ajustes B, layout/volumen WP-18, DS-20/VAL y 200×40 acciones previamente autorizados
se conservan íntegros; las propuestas son disjuntas y se refrescarán al aplicar en su turno.

Dirección comprobó git apply --check exit 0 sin aplicar. Copia scratch del harness,
con cambios de rutas exclusivamente para importarlo desde /tmp, observó 5 pass / 0 fail,
10 expectativas externas; cada proceso hijo conserva sus cuerpos originales y sale 0.
Log `WP-3a-propuesta-harness-green.log`; scratch SHA-256
`e26f91a4c9c3e3ac45f4b1e116f947603affda85082dd7cddbb29f189d84dd08`.
Esto comprueba la propuesta de montaje, no la aceptación productiva de cosas/estados.
Revisión independiente favorable: `WP-3a-review-propuesta-harness.md`. Comprobó huella,
patch entero, guarda y comparación literal desde const entrada hasta EOF: todos los casos,
cuerpos, expectativas y afterEach originales coinciden. Leyó el 5/0 de ensayo sin atribuirle
la aceptación de cosas/estados. Las 60 sondas independientes intactas más dos adversarios
propios observan 62/0, 1107 expectativas; la auditoría completa del paquete sigue activa.
Pendiente de autoridad para modificar ownership, según protocolo de plan §3 y la condición
humana de proponer en HANDOFF cualquier cambio de DESIGN antes de aplicarlo.
Después de una resolución favorable: registrar primero, aplicar ese cambio exacto,
check íntegro nuevo y dictamen completo antes de aceptar WP-3a. No hay skip, cuarentena,
expectativa retirada ni permiso operativo adicional. WP-5/B-29 conserva su pregunta pendiente.

### Resolución expresa del ajuste mínimo del harness WP-3a

Félix respondió «Autorizar el ajuste mínimo del harness WP-3a» a la pregunta específica
del patch de 53 líneas, SHA-256
`fd8af23b5288fb520124f1f237a3e546bd1a3c4d01271116d5b538aac175b9b7`.
Dirección vuelve a verificar la huella y registra aquí la resolución antes de aplicar.
Se autoriza solo la propiedad serial declarada y la exportación violacionesForma con
guarda de no invocación; casos, cuerpos y expectativas WP-1 permanecen intactos.
Dirección aplica primero los cuatro hunks documentales; después la única escritora
del paquete aplica el hunk ejecutable, conservando las cuatro fuentes congeladas.
Se exigen revisión completa y check íntegro nuevo; el ensayo 5/0 no es aceptación.
No cubre otra excepción contractual ni operación externa. La propuesta específica
WP-5/B-29 continúa pendiente de su resolución; todas las autorizaciones previas
y sus límites siguen vigentes.

### Cierre técnico WP-3a — cosas y estados

Aceptación de dirección tras dictamen independiente final favorable
`/tmp/opforja-rehacer/WP-3a-review-dictamen-final.md`, leído completo.
Quince operaciones de cosas y seis de estados reales, sin cambio de firmas ni matriz duplicada.
El alcance de plan se comprueba con éxito/rechazo tipado, trazas, identidad, snapshot previo,
DS-5/6/20, selección múltiple atómica, alcance/refinamientos, cascadas y visibilidad real.
Se conserva valor/duración hasta retiro explícito, se rechaza fan mixto al borrar estado,
se conserva soporte de hijo y se valida overflow F-12 sin cap arbitrario.

Focal nativo observado: 78 pass / 0 fail, 751 expectativas. El ajuste exacto autorizado
del doble pasó sus cinco casos reales (5/0, 10 expectativas externas), cuerpos intactos.
Check íntegro nuevo: TypeScript y 646 pass / 0 fail, 7153 expectativas, 31 archivos,
18.32 s, exit 0; log `WP-3a-check-harness-final.log` SHA-256
`0bc986fe4f55f6f4c8868892342ded45f955fd95735bcfa8b1658a54364b1498`.
El check histórico 641/5 queda preservado como fallo de carga del doble, sin dispensarlo.
Manifest final `WP-3a-freeze-manifest-final.json` y `WP-3a-freeze-final.sha256`:
5/5 huellas verificadas; las cuatro fuentes productivas mantienen sus huellas anteriores.

La revisión independiente observó 69 casos distintos verdes: 62/0, 1107 expectativas
(60 originales intactas más dos adversarios) y 7/0, 88 expectativas propias complementarias.
Auditoría completa de las cuatro fuentes/suites y 21 operadores, sin defectos materiales.
Verificó el único hunk del doble y bloque literal de casos contra HEAD; no repitió las
69 sondas ni el check con fuentes intactas. No hubo prueba debilitada, skip o cuarentena.

Conformidad conserva doce filas parciales. B-06 añade evidencia limitada de conservación
en operación de estado; creación/edición de enlaces y abanicos, UI y OPL siguen pendientes.
B-28 conserva distribución real no vacía pendiente de WP-4r/H2, con guarda temporal antes
de reservar IDs y negativo scratch separado, sin expectativa nativa permanente.
El positivo 0→1 vacío sí está observado. B-29 mantiene hallazgo R+C/metadata y propuesta
WP-5 pendiente de resolución expresa. H1 conserva checks/fixtures verdes con revisión
semántica reabierta por B-29; H2/H3 pendientes. WP-18 imagen sigue NO_EJECUTADO tras WP-14.
Los snapshots recuperables no acreditan historial editor, Ctrl+Z, UI, OPL ni render futuros.

Publicación: un commit semántico de este paquete y push a rehacer; el SHA se fijará en
la apertura siguiente, después de verificar igualdad local/remota, 0 0 y árbol limpio.
Sigue WP-3b inmediatamente, luego WP-5 y el resto lineal, sin pausa de paquete/hito.

### Apertura serial de WP-3b

WP-3a publicado en `e9a849cea53786149ab288e9f86b098a5f59f33c`: HEAD, origin/rehacer
y ls-remote iguales, divergencia 0 0 y árbol limpio antes de abrir este paquete.
Main/origin/main/pre-rehacer conservan `513ac041f6eb91dc8bf0eb5319a492eb6ff25f6d`.

Propiedad exclusiva: nucleo/enlaces.ts, abanicos.ts, enlaces.test.ts, abanicos.test.ts y
propiedades.test.ts. Se mantiene la misma única escritora GPT-6.1-Sol High; dirección
conserva documentos/Git y revisión independiente. README/plan y lecturas WP-3b completas
preceden a sus pruebas RED. El preflight WP-3b actual y 106 sondas independientes ya
preparadas se reutilizan; estas últimas todavía no ejecutadas sobre el candidato futuro.

Concreción de reanclado respetando la firma vigente y R-OPD-EDIT-4: proceso de efecto
conserva objeto y estados; T3 hacia otro objeto sin estado no inventa anclaje. TS4/TS5
con papel único permiten estado propio explícito y su retiro con traza. En T3/TS3, un
único estado propuesto que no identifica entrada/salida rechaza referencia-ambigua sin
pérdida ni cambio de ID; la edición explícita de ambos papeles usa fijarEstados existente.
No se decide salida por llamar destino al extremo ni se copia un estado a ambos papeles.
Mitad escindida conserva bilateralidad; cambio incompatible de objeto/anclaje rechaza
F-4, sin convertirla unilateralmente en standalone. No-op genuinamente inequívoco permitido.
Es una concreción conservadora del contrato/canon, sin API nueva ni excepción DS-20.

Se exigen alternativas reales del segundo gesto, normalización con traza y datos
pendientes no persistibles, identidad al reanclar, 15 tipos en ambas orientaciones,
cuatro formas de estado, abanicos y CC-02/03/T-066 con proyección/matriz reales.
Propiedades: tres modelos de muestra y 50 semillas completas sin refinamientos, todos
los pares/tipos/sentidos, sin filtro por éxito ni debilitamiento del generador histórico.
B-28 solo acredita este turno sin distribución refinada; esa integración espera WP-4r.
B-29 y propuesta de continuidad R+C siguen esperando resolución para WP-5; no se aplica
ese contrato en WP-3b. Si otra exportación rompe el doble aislado, se conserva evidencia
y se prepara ajuste preciso de propiedad; no se adapta producción ni se debilita la prueba.
RED→GREEN, check íntegro nuevo, freeze y revisión independiente preceden a aceptación.

### WP-3b — frontera temporal de distribuirEnlace

La operación registrada distribuirEnlace tiene su implementación real y aceptación
de reparación en WP-4r según el plan. Dentro de propiedad enlaces.ts, dirección concreta
que su stub pueda devolver rechazo tipado no-ofrecido/regla producto por capacidad
pendiente, antes de reservar IDs, conservando firma, registro y entrada íntegra.
No hay éxito simulado, regla OPM nueva, excepción DS-20 ni crédito de distribución real.
El RED→GREEN de esa frontera queda en scratch separado, sin expectativa nativa
permanente de rechazo que impida el hook futuro. No se modifica otra fuente ni contrato.

CrearEnlace conserva las capacidades reales de este turno. Cualquier frontera refinada
pendiente se delimita con reglas compartidas y refs concretas; no se duplica una tabla
de migración ni se bloquea por clase todo refinamiento. Los casos admitidos que no
requieren distribuir siguen funcionando. B-28 mantiene resultado efectivo refinado
pendiente hasta WP-4r; la operación aún pendiente no acredita equivalencia de menú.

### WP-3b — RED inicial y preparación de revisión

Primer RED real: `WP-3b-RED-inicial.log`, 0 pass / 52 fail sobre llamadas a stubs
de enlaces, sin error de importación. RED separado de abanicos:
`WP-3b-RED-abanicos.log`, 0 pass / 22 fail, dos expectativas alcanzadas sobre stubs.
Son 74 casos distintos iniciales. El error previo de cwd al escribir la suite de
abanicos no creó ese archivo y queda diferenciado como montaje, sin crédito de RED.
La misma escritora inicia el mínimo GREEN; no hay candidata aceptada ni check nuevo aún.

Preparación de revisión independiente ampliada: 149 casos previstos, cero observados.
Las 106 sondas originales siguen byteexactas SHA-256
`0c2e211df90e59f30d94f695783856ad76d08eb819c658ab6164ddea7f606f29`.
43 complementarios propios SHA-256
`9f9e21bd36936f31a79fdea4bac768ac0bcee724bee7dedeb2f94c62e657d282`
cubren LF-03/T-066, setters, cambio de tipo/CC-03, alternativas/formas de estados,
reanclado/escisión y abanicos/rollback. Informe y manifest ampliados en scratch,
leídos completos por dirección; seis contratos estables intactos. La preparación
no acredita montaje/validez ni ejecución. Se activará solo tras freeze, conservando
oráculos y clasificando montaje frente a producto con precondiciones reales.

### WP-3b — GREEN parcial y propuesta mínima del harness (SIN APLICAR)

Primer GREEN de enlaces y abanicos: 74 pass / 0 fail, 636 expectativas.
Propiedades completas: 54 pass / 0 fail, 353491 expectativas, 10.43 s;
tres muestras de constructores y 50 semillas históricas completas sin refinamientos,
todos los pares, quince tipos y ambos sentidos, sin filtrar por resultado.
Logs `WP-3b-GREEN-intento-1.log` y `WP-3b-propiedades-primera.log` preservados.
Son comprobaciones parciales sobre una candidata aún móvil; no equivalen a aceptación.
Los adversarios propios nuevos observaron 1 pass / 4 fail (`WP-3b-RED-bordes.log`);
la única escritora continúa su reparación dentro de los cinco archivos autorizados.

La comprobación preventiva del harness real de transacción terminó 0 pass / 5 fail
por SyntaxError de carga de violacionesAbanico, antes de ejecutar los cuerpos.
Faltan asimismo normalizarEtiquetas y violacionesContexto, importadas por las operaciones.
Log `WP-3b-harness-resultado-focal.log` preservado. No se adapta producción al doble,
no se debilitan expectativas ni se acepta/publica el paquete con ese fallo.
La resolución anterior WP-3a autorizó solo violacionesForma y permanece íntegra;
no se interpreta como autorización de estas tres exportaciones adicionales.

Propuesta precisa: `/tmp/opforja-rehacer/WP-3b-propuesta-harness-transaccion.patch`,
53 líneas, SHA-256 `46414c551bda35fdeb9abeb64cf08dd81d95f2d3fab82e8936dcb840360cd70c`.
Concatena byteexactamente el fragmento documental de 42 líneas, SHA-256
`7751e5490de87257133e62c4a756f538a709d69819feaa4fea42e9314090d4b4`,
y el ejecutable de 11 líneas, SHA-256
`89c0cfda099f1d3f9eff396e83ebe11ea6bf1f6c98b4820e027ce8e655c0a2a5`.
DESIGN §12.1/tabla WP-3b, README y plan declaran propiedad serial mínima de
nucleo/resultado.test.ts únicamente para añadir violacionesAbanico, normalizarEtiquetas
y violacionesContexto al doble aislado, cada una con el mismo throw de no invocación.
Los cinco casos, cuerpos, expectativas, afterEach, aislamiento y guardas previas
permanecen literales. No se modifica ningún contrato semántico, firma pública,
canon, DECISIONS, formato v0 ni permiso operativo. Todas las autorizaciones anteriores
y sus límites se conservan; WP-5/B-29 mantiene su pregunta específica pendiente.

Dirección leyó ambos fragmentos completos, verificó las huellas y el ensamblado,
y observó git apply --check exit 0 sin aplicar. La copia aislada con ajustes de rutas
solo para /tmp y las tres exportaciones observó 5 pass / 0 fail, diez expectativas
externas (`WP-3b-harness-propuesta-GREEN.log`). Copia SHA-256
`880c2c6e6ddc540d953d7cc0cc674f096334695930a439ac0743bba811e2e087`.
Comparación literal const entrada→EOF: igual, SHA-256
`7cfe3a2e164ccd605039055538854fe10cd3886397911a3521be90a9c83d8241`.
Este ensayo acredita el montaje propuesto, no las operaciones nuevas. Revisión
independiente específica en curso, sin fuentes móviles ni ejecución duplicada.
Pendiente de resolución expresa por la condición humana de proponer en HANDOFF
cualquier cambio de DESIGN y por ownership del protocolo de plan §3.
Tras resolución favorable: registrarla primero, aplicar documentación antes del hunk
ejecutable por la misma escritora, check íntegro nuevo y revisión completa de WP-3b.
La reparación y las pruebas independientes del harness continúan sin asumir aprobación.

Dictamen independiente favorable para presentar la propuesta, leído entero por dirección:
`/tmp/opforja-rehacer/WP-3b-harness-revision-dictamen.md`, SHA-256
`541d6c6883b46929f2b36c24991e5e6c92904559c8abbc34c53bde41dbc34bfe`.
La revisión reconstruyó el archivo HEAD exacto retirando solo rutas scratch y las tres
exportaciones, confirmó guardas, aislamiento y cinco casos literales, y verificó los
cuatro hunks documentales en memoria. No ejecutó producto ni leyó fuentes móviles.
Su evidencia independiente conserva la limitación RED de carga frente al ensayo GREEN
y no sustituye autoridad supervisora ni aceptación completa de WP-3b.

### WP-3b — primera congelación funcional, sin aceptación

Focal nuevo sobre las tres suites propias: 142 pass / 0 fail, 354243 expectativas,
9.73 s, exit 0 (`WP-3b-focal-freeze-1.log`); TypeScript exit 0 y diff check limpio.
Manifest `WP-3b-manifest-freeze-1.json` y `WP-3b-freeze-1.sha256`: dirección verifica
5/5 huellas. El único cambio posterior al focal fue título T-248→T-054 del caso
eliminar ramas, sin cambiar cuerpo, expectativas ni producción. Las cinco fuentes
quedan inmóviles mientras la revisora activa las 149 sondas y audita el paquete.
El check íntegro y la propiedad serial del harness siguen pendientes de resolución;
el focal no acredita aceptación, publicación ni distribución refinada.

La frontera temporal B-28 tiene dos comprobaciones scratch actuales verdes,
catorce expectativas, preservando original e IDs con rechazo no-ofrecido/producto
basado en R-DIST-1 compartida (`WP-3b-frontera-actual-GREEN.log`). El contraste
0/2 con el stub histórico de HEAD se ejecutó después de esta congelación:
`WP-3b-frontera-cronologia.json` lo distingue expresamente de RED anterior a producción.
No se presenta esa comparación retrospectiva como TDD previo de la guarda ni como
distribución real. Los RED nativos de las capacidades y cuatro bordes sí precedieron
sus reparaciones. La guarda temporal continúa reemplazable por WP-4r, sin negativa
nativa permanente que impida su implementación futura.

### WP-3b — reparación de revisión y segunda congelación

La revisión del freeze 1 queda negativa y preservada: 149 sondas originales observan
148 pass / 1 fail, 434285 expectativas; el fallo restante sobreespecifica no-visible
en un montaje que incumplía también interno-no-visible, sin prioridad de códigos
establecida por DESIGN/T-066. Tres controles adicionales observan 2 pass / 1 fail,
21 expectativas: ese RED sí demuestra pérdida implícita real de ambos anclajes TS3
al reanclar a otro objeto sin papel de estado explícito. Dictamen completo
`WP-3b-review-dictamen-freeze-1.md`, leído por dirección; candidato no aceptado.

La misma escritora añadió dos negativos nativos antes de corregir: hacia otro objeto
y hacia rectángulo del mismo objeto, ambos TS3 sin selección inequívoca de papel.
RED 0/2 (`WP-3b-RED-revision-TS3-vecino.log`) y GREEN 2/0 con trece expectativas
(`WP-3b-GREEN-revision-TS3-final.log`). La rama de objeto TS3 devuelve ahora
referencia-ambigua/R-OPD-EDIT-4, conservando hechos/roles/IDs y original; no cambia
el reanclado inequívoco del proceso ni los casos T3/TS4/TS5. Es reparación dentro
del criterio canónico/preflight ya concretado, sin nueva excepción contractual.

Dirección detectó asimismo un fixture nativo T-066 con apariciones fuera del alcance
y secuencia inválida. Su bloque original completo se preserva en scratch. La escritora
corrigió solo ese montaje y agregó precondiciones reales de forma/contexto vacíos,
sin cambiar códigos/expectativas ni prioridad productiva; montaje corregido 1/0.
El error intermedio de tipado de ref opcional se conserva y está resuelto en el tsc vigente.

Freeze 2: dos suites focales 90 pass / 0 fail, 768 expectativas, 95 ms, exit 0;
TypeScript exit 0 y diff check limpio. `WP-3b-freeze-2.sha256` y
`WP-3b-manifest-freeze-2.json`: 5/5 huellas verificadas por dirección.
Solo enlaces.ts/enlaces.test.ts cambian respecto al freeze 1. Las propiedades
54/0 y 353491 expectativas conservan huella y creación intactas; no se repiten
por rutina al reparar exclusivamente reanclado. Recibo de implementación vigente
`WP-3b-implementacion-reporte.md`, leído completo; no hay aceptación ni check íntegro.

Revisión actual: 106 sondas originales byteexactas más los 43 complementarios v2,
149 pass / 0 fail, 434290 expectativas, 6.27 s. Se conserva el complemento original
SHA-256 `9f9e21bd36936f31a79fdea4bac768ac0bcee724bee7dedeb2f94c62e657d282`
y su log 148/1. La versión v2 SHA-256
`30dd46733586a69f93ec7a2bfb732fcb0a86f81b6e8910e60297b694dd40840c`
corrige únicamente el montaje del caso de aparición activa: OPD descendiente activo
sin el vecino, dueño del interno con ese vecino presente; añade comprobaciones de
ambas condiciones. Conserva el esperado no-visible y los otros 42 casos literales.
Dirección leyó el diff; no se retira, debilita, salta ni cuarentena ningún caso.
El fallo de montaje no recibe crédito de RED producto ni se oculta bajo el nuevo GREEN.
Los cuatro controles independientes actuales observan 4/0, 31 expectativas,
incluida la sonda TS3 antes roja. Auditoría completa de dos fuentes y tres suites
terminada por la revisora, pendiente de su dictamen final escrito y del check íntegro
nuevo después de resolver la propuesta de harness. No hay publicación anticipada.

Dictamen funcional freeze 2 recibido y leído completo por dirección:
`/tmp/opforja-rehacer/WP-3b-review-dictamen-funcional-freeze-2.md` y
`WP-3b-review-manifest-funcional-freeze-2.json`. Favorable exclusivamente condicionado
al hunk exacto autorizado del harness y al check íntegro nuevo verde. Verifica 5/5
huellas antes/después y auditoría completa; no quedan defectos materiales conocidos
del alcance revisado. No se repetirán las 153 sondas con las mismas cinco fuentes
por rutina. Ninguna condición restante se confunde con aceptación supervisora.
La propuesta del harness de 53 líneas continúa SIN APLICAR y con pregunta pendiente;
la documentación de WP-5/B-29 continúa pendiente de su resolución específica.

### Preparación independiente de WP-5/7/8b, sin ejecución adicional

Dirección leyó completos los informes y manifests actualizados. La concreción FAN5A
es compatible con DESIGN §§4.3.4/4.4/5.3: diagnosticar debe consumir las funciones
compartidas violacionesAbanico y noOfrecido con el tercer argumento del abanico,
deduplicar por identidad y emitir el código existente abanico-invalido. No duplica
matriz, añade códigos ni altera contratos. Un modelo bruto que solo incumpla F5
permite examinar defensivamente FAN5A; no es modelo persistible ni entrada válida
para una operación. El generador futuro omite ese hecho no representable sin
inventar T3, perder el abanico silenciosamente ni emitir frases de error como OPL.
La composición real diagnóstico + generación se verificará cuando WP-7 exista.

Se conservan las 146 sondas preparadas de WP-5 y se añaden seis casos FAN5A en
`WP-5-review-FAN5A-diagnostico.test.ts`, SHA-256
`2427d06c635b185fdc4a1f51c0577527c18ffbf9f34d3a8426c81db8b56ceeb4`;
cuatro casos conjuntos posteriores en `WP-5-review-FAN5A-conjunto-WP7.test.ts`,
SHA-256 `99197fec549f67218030a2f71e109f41f976be5ab79e6ea508b75c5703300b38`.
Estado de estas sondas nuevas: PREPARADAS, cero ejecutadas, sin crédito GREEN.
Los negativos ya observados de continuidad R+C/B-29 permanecen separados y
la propuesta precisa de 64 líneas mantiene su resolución supervisora pendiente.
Su contexto deberá refrescarse al turno sin cambiar efectos ni autorizaciones previas.

WP-8b dispone de catálogo y drivers semántico/visual independientes preparados:
40 construidos y 12 selecciones históricas producen 50 vistas únicas previstas,
porque dos fixtures solo contienen una raíz. No hay 52 renders ni observación visual.
`WP-8b-review-preparacion.md` y su manifest dejan pendientes tipado, fixtures complejos,
gates WP-5 y OPL WP-7 reales, freeze y apertura individual de los 50 SVG/capturas.
Driver visual SHA-256
`aa2d18357a42878364a4dbfe0c7934f063c92b2cf16cd0396bf0fcca4436c9e1`;
su futura captura declara CAPTURADO_NO_INSPECCIONADO hasta revisar cada imagen.
No se ejecutaron producto, navegador, golden, build ni fuentes móviles en esta preparación.

### WP-10 — propuesta anticipada mínima de propiedad, SIN APLICAR

DESIGN §2.4 exige generar mediante pruebas/azar.ts, perfil hodom y semilla fija,
262 cosas / 192 estados / 433 enlaces / 36 OPDs. El archivo estable ofrece solo
estricto/completo; el sintético histórico pequeño no satisface ese benchmark.
Construir el grande localmente en rendimiento.test o simular un selector no realiza
la procedencia contratada. WP-10 posee ahora solo sus dos suites; la propiedad
serial autorizada de WP-4r para acciones no se interpreta como permiso para este perfil.

Propuesta revisable: `/tmp/opforja-rehacer/WP-10-review-preparacion-propuesta-ownership.patch`,
44 líneas / cuatro hunks / DESIGN, README y plan; SHA-256
`f028e0b56f232dc245104ac5062228f97f479b6f6f81fa2aefb41c0c30dc93c4`.
Declara azar.ts compartido serial solo para añadir hodom, lectura y aceptación
del tamaño exacto, forma/contexto válidos, determinismo y pureza. Preserva literalmente
el generador histórico y las acciones 200 × 40 vigentes al abrir el turno, semillas
y ocho objetivos con fallo 3×; no cambia matriz, códec, API ni permisos operativos.
Dirección leyó el patch completo, verificó huella y git apply --check exit 0 sin aplicar.
Debe refrescarse solo contexto tras los compartidos anteriores, conservando sus efectos.

Informe independiente completo `WP-10-review-preparacion-informe.md`, SHA-256
`1eb9d57bc70b4959ed465a6fa9e1d2c5c295311655fe28ac3624636c67f00305`,
y manifest SHA-256 `17bdec1bd8367c1bd965ac51e03fc9599b445c5464483950aa1865137daedcf8`:
14 casos previstos sobre siete archivos y sus 13 OPDs; cero ejecutados/observados.
Elegibilidad estricta solo por gates reales, con rechazos conservados. Dos casos
del HODOM grande y ocho mediciones quedan pendientes del perfil real y de su turno.
Dictamen independiente `WP-10-review-propuesta-ownership-dictamen.md`, SHA-256
`9083a6891e147d9717c3fdd10e0ea9f1da6a7b18c000b238e769740d840d5f06`,
favorable para presentar, leído entero por dirección. Añadir un export separado
para hodom conserva firma y cuerpo históricos: §2.4 fija módulo/perfil/semilla,
sin imponer la sintaxis azar(semilla, 'hodom'). No hay autoridad, aplicación,
rendimiento medido ni aceptación anticipada. La resolución se requerirá en WP-10.

### WP-17 — preparación de arranque y brecha de wiring por resolver

Preflight actualizado leído entero por dirección: `WP-17-preflight-actual.md`,
SHA-256 `4f8c5b358f289fb7ebd6e07bf5d7261b8e8bafd13518e8fddbf64dcdc386701e`.
Se conserva su borrador anterior. Cuenta se lee perezosamente al autenticar;
el CLI real puede crear la cuenta sintética antes de sembrar modelos por API,
con datos temporales propios. No se ejecutaron CLI, servidor, build ni navegador.

El config raíz aprobado en WP-18 arranca el bundle real local y no tiene globalSetup;
`bun run e2e` usa ese config por defecto. Un config privado en e2e/* permitiría
realizar setup/teardown y Chromium local dentro de propiedad WP-17, pero invocarlo
solo con --config no demuestra el comando literal exigido al cierre H3. Esta
discrepancia queda abierta; no se cambia package/config raíz ni se acepta un
comando alternativo por silencio. Revisión independiente acotada en curso para
hallar una realización compatible o el mínimo wiring serial revisable antes de su turno.
Los 26 casos completos, CAS/offline/OPDs, cero pageerror, fixture y navegador reales
siguen pendientes de implementación/observación. No se oculta la discrepancia
ni se convierte la preparación o fallback permitido en aceptación e2e.

### WP-3b — resolución expresa del ajuste mínimo del harness

Félix responde «ok. vamos con ello» a la explicación y propuesta específica del
harness WP-3b de 53 líneas. Dirección registra esta resolución antes de aplicar
documentación o código. Autoriza exclusivamente el patch
`/tmp/opforja-rehacer/WP-3b-propuesta-harness-transaccion.patch`, SHA-256
`46414c551bda35fdeb9abeb64cf08dd81d95f2d3fab82e8936dcb840360cd70c`:
propiedad serial de resultado.test.ts y tres exportaciones guardadas del doble aislado,
con cinco casos/cuerpos/expectativas literales. No amplía las otras autorizaciones
ni resuelve por inferencia la propuesta distinta WP-5/B-29 o las preparaciones futuras.

Dirección verificó de nuevo las huellas de los tres fragmentos y las cinco fuentes
freeze 2 (5/5 OK). Primero aplica el fragmento documental de 42 líneas a DESIGN,
README y plan; después la misma escritora aplica el ejecutable de 11 líneas.
El check íntegro nuevo y la revisión final siguen siendo condiciones de aceptación;
la resolución humana no se confunde con GREEN ni publicación del paquete.

Documentación exacta aplicada antes del hunk ejecutable. La misma escritora conservó
5/5 huellas productivas freeze 2 y los cinco casos del harness literales; sexto archivo
resultado.test.ts SHA-256 `0bcb70bf8d279712b0f63dab884fa0216d9d1a02a44c7c31fad4e97233c16536`.
Comparación const entrada→EOF, incluido LF final, igual a HEAD, SHA-256
`7cfe3a2e164ccd605039055538854fe10cd3886397911a3521be90a9c83d8241`.
Manifest `WP-3b-manifest-final-HAR.json` y seis huellas `WP-3b-freeze-final-HAR.sha256`:
dirección verifica 6/6. Único check íntegro nuevo desde app con entorno mínimo:
790 pass / 0 fail, 361412 expectativas, 34 archivos, 28.62 s, exit 0;
log `WP-3b-check-final-HAR.log` y salida `.exit`, leídos por dirección.
Incluye los cinco casos HAR reales. Sin repetir focal de montaje ni las 153 sondas.
La revisión final comprueba el hunk/docs/log y una actualización factual de conformidad
que mantiene B-04/05/06/07/08/28 parciales y B-29 abierta. Aceptación/publicación pendientes.

Dictamen de wiring WP-17 recibido y leído entero por dirección:
`WP-17-review-wiring-dictamen.md`, SHA-256
`54ba1bd0c320e1c34e62d02b059dfcd0702293f367e79b6dd96448a8c3806d90`.
El Playwright local no descubre globalSetup en e2e/* sin enlace desde el config raíz;
conservando bun run e2e, el mínimo hunk es globalSetup: './e2e/global-setup.ts'.
La selección PW_CHROMIUM sí cabe en fixture compartido propio e2e/*; no requiere
ampliar package/Vite ni cambiar el layout WP-18. Ownership serial mínimo de ese
único enlace deberá proponerse/resolverse antes de WP-17. La diferencia del ejemplo
de arranque fuente/4173 frente al bundle/8787 actual permanece separada, sin equivalencia
contractual concedida por ese dictamen. Cero ejecuciones; ninguna nueva autoridad aplicada.

### WP-3b — aceptación de dirección y cierre de paquete

Dirección leyó completos recibo vigente, manifest de implementación y dictamen/manifest
independientes de cierre. Dictamen `WP-3b-review-cierre-autorizado.md`, SHA-256
`30097c97f9696c5740afdb057eeb317e39ae7260e2dcf23cdedeffcb013ad2a0`;
manifest independiente SHA-256
`6b2ffda4c8fd6603598167b6b7f450731bdca16a17452872cb6d2b6f72c91b25`.
Confirma aplicación exacta del bundle autorizado desde HEAD a DESIGN/README/plan/HAR,
cinco casos literales, tres guardas de no invocación, seis huellas y check nuevo 790/0.
Las cinco fuentes productivas conservan las 149 + 4 sondas y auditoría completa,
sin repetirlas ni sumar expectativas de runs distintos. No queda defecto material
conocido dentro del alcance nativo de WP-3b.

Conformidad incorpora la evidencia N B-04/05/06/07/08 y creación sin refinamientos
de B-28, mediante el patch factual de 54 líneas revisado independientemente;
las seis filas permanecen parciales, B-29 no cambia y ninguna superficie futura
se acredita. Se conserva la cronología RED/GREEN, el fallo de montaje y el contraste
temporal B-28 posterior a producción, sin presentarlo como TDD previo.

El recibo anterior completo se conserva como
`WP-3b-implementacion-reporte-pre-cierre-HAR.md`, SHA-256
`d4fb6ba1b18cf2faf7617e197281d97683b4c94840bc562635d459f01c6ce9d1`.
El vigente SHA-256 `8f27ae77a17bfeee7513a53df2bf7f4172692dcb0a44ee12c331538fc6be0805`
marca explícitamente los apartados previos a HAR como históricos, preservando todas
las cifras. Es una corrección editorial scratch sin cambio del candidato ni rerun.

Dirección acepta el paquete y lo reúne en un único commit semántico con push a
origin/rehacer, conservando main y pre-rehacer. Próximo paquete: WP-5. La propuesta
R+C/B-29 mantiene su resolución humana pendiente; las capacidades independientes
del diagnóstico pueden avanzar dentro del contrato vigente, sin alterar proyección
ni sus suites fuera de propiedad. H1 sigue con revisión semántica reabierta;
H2/H3, integración refinada B-28 e imagen WP-18 siguen pendientes.
