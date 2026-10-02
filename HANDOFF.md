# OpForja rehecho — tablero único

Estado: WP-0 y WP-1 cerrados; WP-2 es el primer paquete pendiente. H1 sigue pendiente.
Rama `rehacer`; base y tag `pre-rehacer`: `513ac041`. La directora creó/publicó rama y tag.
WP-0: `b9d94180b5f587cdf125d8c4fabcf26edb5917c3`. La directora publica un commit por paquete.

## Autoridad y continuidad

La autoridad OPM es el canon vendorizado de `canon/`. Decisiones fijas: 1–28 de
`docs/rehacer/DECISIONS.md`. Contratos: `docs/rehacer/design/DESIGN.md`.
El [mapa temporal del plan](docs/rehacer/plan/README.md) resuelve las referencias a documentos
finales hasta WP-19; `docs/rehacer/` permanece íntegro. El dueño autorizó expresamente la propuesta
de colocación de §6.6. El contrato se registró antes de reanudar producción; WP-1 superó las tres
regresiones, el check y la revisión focal. Se continúa por WP-2 con integración real sin dobles.

## Tablero lineal

| Orden | Paquete | Estado | Commit |
|---:|---|---|---|
| 0 | WP-0 | Cerrado: aceptación y revisión verdes | `b9d94180b5f587cdf125d8c4fabcf26edb5917c3` |
| 1 | WP-1 | Cerrado: aceptación y revisión verdes; ajuste autorizado incorporado | Este commit: `feat(nucleo): contratos y fundamentos del modelador (WP-1)` |
| 2 | WP-2 | Pendiente | — |
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
