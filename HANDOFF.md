# OpForja rehecho — tablero único

Estado: WP-0, WP-1 y WP-2 cerrados con aceptación y revisión verdes. El dueño pidió «continuemos» tras el recibo local de WP-2; se retoma el mandato original de commit/push por paquete y continuidad lineal. WP-4p es el siguiente paquete. H1 sigue pendiente.
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
| 2 | WP-2 | Cerrado: aceptación y revisiones verdes; opción A incorporada | Este commit: `feat(nucleo): matriz de validez única (WP-2)`; hash se incorpora en la siguiente actualización |
| 3 | WP-4p | Pendiente | — |
| 4 | WP-6 | Pendiente | — |
| 5 | WP-8a | Pendiente | — |
| 6 | WP-11 | Pendiente | — |
| 7 | WP-18 | Pendiente | — |
| 8 | WP-3a | Pendiente | — |
| 9 | WP-3b | Pendiente | — |
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

H1 (tras ola 1), H2 (tras ola 3) y H3 (tras ola 5): pendientes. Ningún hito alcanzado.
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
