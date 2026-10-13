# Continuidad de OpForja

## Punto de corte y mandato

Félix indicó: «dejemoslo hasta ahí. describe el problema "RF5 ahora se reconoce como
`unsupported-canonical`" y genera el handoff para continuar con lo que falta incluyendo rf5».
El trabajo de implementación queda detenido. Este documento prepara la continuación;
no inicia RF5 completa, B-45 ni otras brechas.
Félix autorizó después un commit documental de este archivo y push normal a `main`,
sin implementar nada más ni desplegar.

- Workspace propietario: `/home/felix/projects/deep-opm-pro`.
- Rama: `main`.
- Corte de implementación publicado, con igualdad entre `HEAD`, `origin/main` y
  `refs/heads/main` remoto comprobada antes del commit documental:
  `0e48d8a20af5d01d3c82a933a67ad631974d1dfe`.
- Último commit de implementación: `fix(opl): diagnosticar RF5 sin reinterpretarla como etiquetado`.
  Es un único incremento de ocho archivos sobre `a0b7ab64ef6eac3744d345b41d38531e8e0ac8ff`.
- `a0b7ab64` ya cerró B-42. No rehacer ni duplicar ese incremento.
- El árbol estaba limpio antes de escribir este HANDOFF. Este archivo se incorpora
  mediante un commit documental propio sobre ese corte, sin cambiar las fuentes
  validadas. Obtener su SHA con `git log -1 --format=%H -- HANDOFF.md` al retomar.
  No hay reparación de producción pendiente ni candidato sin publicar del cierre mínimo.
- Hubo push normal a `main`, sin merge, reescritura de historia ni despliegue.
  La autorización de publicación anterior se ejecutó para ese incremento; este
  handoff no concede autorización general para publicar nuevas capacidades.
- No quedan runners o servidores de pruebas propios activos. La revisión independiente
  terminó con `QUIETO_FIN_GLOBAL_RF5_MINIMO`.

Al retomar, leer AGENTS y este archivo completos y volver a comprobar rama, referencias,
HEAD, árbol y worktrees. Si avanzaron, reconciliar sin volver atrás. Conservar este
handoff y cualquier cambio posterior; no usar reset, clean, rebase o pull para eliminar
trabajo. Eliminar este único HANDOFF sólo al cierre real del encargo que lo sustituya.

## Qué significa RF5 y qué problema se corrigió

RF5 es la caracterización con estado especificado. En este ejemplo sintético:

```text
**Auto** es un **Vehículo**.
**Vehículo** exhibe **Medio de Desplazamiento**.
**Auto** exhibe **Medio de Desplazamiento** en `tierra`.
```

La tercera oración dice que la especialización Auto tiene sólo el valor `tierra` del
atributo discriminante que hereda de Vehículo. Es un hecho estructural específico.
En el OPD corresponde al triángulo de exhibición cuyo vértice está en el objeto
especializado y cuya base conecta con el valor, dibujado como estado del atributo.
No implica ejecución, simulación ni un valor runtime.

Antes del cierre mínimo, el parser aceptaba esa tercera oración como un enlace
etiquetado UNI con etiqueta `exhibe` y estado destino `tierra`. Creaba un hecho
distinto sin diagnóstico, permitía exportarlo y lo regeneraba como:

```text
**Auto** «exhibe» **Medio de Desplazamiento** en `tierra`.
```

Esa etiqueta libre es legal, pero no expresa la caracterización heredada de RF5.
No se debe convertir una en otra, inferir la intención desde el nombre ni corregir
datos guardados silenciosamente.

Ahora la forma RF5 vigente produce `unsupported-canonical`, severidad `warning`,
regla `R-STRE-2`, registro B-37 y un mensaje visible: la capacidad aún no se ofrece
y la oración no produce cambios. Significa **sintaxis canónica reconocida cuya
semántica todavía no está implementada en el producto**. No significa que OPM la
prohíba. Una línea RF5 sola genera cero hechos y cero acciones y no crea entidades,
estados ni enlaces. En un documento mixto se aplican únicamente las líneas soportadas.

El cierre mínimo conserva:

- RF2 ordinaria y la etiqueta explícita `«exhibe»`, como hechos diferentes.
- Nombres, estados, etiquetas y parámetros como datos opacos.
- IDs y campos guardados, preview puro, undo/recarga y aplicación por operaciones nativas.
- La grafía histórica con valor antepuesto, ``**X** exhibe `valor` **Atributo**.``,
  como `non-canonical`; no es la localización vigente de RF5.
- B-37 como `no implementado` y B-48 como `parcial`. Sólo se cerró la clasificación P/U.

## Lectura obligatoria y fuentes mantenidas

1. `AGENTS.md`, `canon/LEEME.md` y `perfil/LEEME.md`: canon local 2.3,
   exclusivamente ISO/PAS 19450:2015; conservar precedencia y reservas de la fuente.
2. `canon/reglas-opm-estrictas-es/content.md`: R-STRE-2, reglas de exhibición,
   especialización, herencia y Anexo A. No convertir un DEBERÍA o PUEDE en prohibición.
3. `canon/spec-forja-opl-es/content.md` §6.2: RF2/RF5 y la posición del valor.
   `canon/spec-forja-opd-es/content.md` §7.1: R-OPD-STR-14 y R-OPD-STR-6.
4. `docs/especificacion.md` §0.5, §4.4.7, §4.4.11–12, T-156/T-157 y requisitos
   de identidad, operaciones, importación, roundtrip y exportación pertinentes.
5. `docs/decisiones.md`: DEC36 y DEC40 como historia de B-37; DEC53–57 para conservar
   fronteras de etiquetas/cantidades, plural explícito y default UNI. §5.9 conserva
   las diez bisimetrías parciales. DEC36 no invalida la definición posterior del canon.
6. `docs/conformidad.md`: fuente vigente del inventario; B-37, B-48, B-45 y filas
   relacionadas. Este handoff no sustituye su registro ni cambia sus estados.

Archivos del último incremento:

- `app/src/opl/no-soportadas.ts`: reconocimiento tipado completo RF5 y mensaje específico.
- `app/src/opl/analizar.ts`: mensaje del catálogo; no introduce una plantilla generadora RF5.
- `app/src/ui/EditorOpl.tsx`: muestra las líneas con razón `inversa-no-soportada`.
- `app/src/opl/rf5.test.ts`, `app/e2e/rf5.spec.ts`: regresiones de extremo a extremo.
- `app/src/opl/analizar.test.ts`: conserva los casos históricos; sólo se precisó su título.
- `docs/especificacion.md`, `docs/conformidad.md`: alcance del cierre y reservas.

## Continuación propuesta: RF5 completa como incremento propio

La solicitud actual incluye RF5 en la continuidad, pero no autoriza implementarla ahora.
Al recibir un mandato de continuación, fijar el incremento elegido y su contrato antes
de editar. No basta con retirar la fila de NO_SOPORTADAS o aceptar la oración en el parser.

El sustrato actual todavía no ofrece la relación: `nucleo/tipos.ts` define Exhibicion
sin anclaje a estado; `nucleo/matriz.ts` fija `estados: "ninguno"` para exhibición y
sus plantillas son RF2/RF2b/RF2i. La representación persistente y el alcance de las
guardas de herencia deben resolverse contra el canon, sin inventar restricciones.

Menor incremento vertical propuesto para ofrecer RF5 de verdad:

1. Precisar el hecho nuclear: objeto especializado, atributo discriminante heredado,
   estado del atributo y sus identidades. Resolver la representación y compatibilidad
   v0, los contextos de herencia y las ambigüedades. Esta propuesta no predetermina
   un nuevo tipo ni un campo concreto antes de revisar el contrato.
2. Implementar validez en la matriz y mutaciones mediante operaciones nativas y editor.
   Conservar IDs, propietario del estado, pureza, transacción y undo. Examinar rename,
   retirada/reanclaje del estado y cambios de especialización/exhibición que afecten
   el hecho; no reparar silenciosamente ni materializar herencia por conveniencia.
3. Añadir la plantilla RF5 en `opl/plantillas.ts`, su generación y la inversa del
   mismo hecho. Distinguir siempre RF2, RF5 y UNI `«exhibe»`. Mantener como no soportada
   cualquier combinación que siga sin representación; no ampliar gramática por analogía.
4. Persistir e importar/exportar el hecho sin pérdida ni reinterpretación de modelos
   previos. Exigir punto fijo del códec y reportar entradas irrepresentables.
5. Ofrecer creación/edición por UI y render/export canónico del glifo RF5. Observar
   el triángulo y el anclaje al estado correctos, separados de handles y overlays.
6. Actualizar especificación y conformidad sólo con el crédito realmente verificado
   en N/I/G/P/U/X. Mantener el resto de B-48 y las demás brechas independientes.

Criterios de cierre para esa futura oferta:

- Un modelo nativo legal RF5 y su OPL reconstruyen el mismo hecho desde vacío;
  autorreparsear no cambia IDs ni campos. La coincidencia de texto por sí sola no basta.
- JSON conserva exactamente datos e identidades y alcanza punto fijo; los modelos
  previos siguen interpretándose igual.
- RF2 y `«exhibe»` siguen produciendo sus propios hechos; hay negativos de tipos,
  estado ajeno, referencia ambigua y contradicciones que el canon realmente prohíba.
- Crear, editar, deshacer, rehacer y recargar preservan relaciones e identidad.
- OPD, OPL visible y exports afectados se observan; golden y oráculos se conservan
  o se regeneran únicamente con la autorización y revisión exigidas por AGENTS.
- Check completo, e2e afectado, build, roundtrip y códec verdes; revisión independiente
  favorable del candidato congelado y examen de las doce categorías de AGENTS.
- Las pruebas que hoy exigen `unsupported-canonical` no se retiran antes de que el
  hecho correcto esté realizado. Su evolución debe conservar el testigo histórico
  de la conversión falsa a UNI y los controles que distinguen ambos hechos.

## Otros pendientes: conservarlos separados

La recomendación previa, después de este cierre mínimo, priorizaba B-45 por la
contradicción OPD/OPL reproducida. RF5 completa es otro incremento independiente.
La continuación debe seleccionar uno; este documento no levanta la exclusión de
B-45 del encargo ya cerrado ni autoriza cerrar toda la lista de una vez.

| Frente | Estado o evidencia | Menor resultado propuesto |
|---|---|---|
| B-45: orden vertical y bandas | En sonda sintética, invertir las `y` deja Despachar por encima de Recibir mientras el OPL declara Recibir antes de Despachar. Forma, gates y códec lo admiten. B-45 permanece intacta. | Contrastar R-INV-2/2A, perfil R-IDP-0A, DEC34/40 y especificación §10.2. Detectar la contradicción y evitar exportarla como canónica; ofrecer reparación explícita. No ordenar por Y incidental ni recolocar al importar silenciosamente. |
| B-48 restante | Plegado, recomposición, probabilidad y despliegue parcial requieren contraste entre vocabulario canónico y catálogo de límites. | Clasificación segura por familia, sin inventar hechos ni incorporar capacidades retiradas. El canon vigente dice «se recompone desde»; no tratar «es recomposición de», citado en la fila histórica, como autoridad superior al canon. |
| Fidelidad/recuperación: B-12, B-13, B-19, B-26, B-29, B-36 | Coberturas parciales y pérdidas declaradas. B-36 ya tiene expresión explícita de estados omitidos. | Elegir una pérdida o flujo reproducible; no prometer bisimetría global ni expresión automática de datos invisibles. |
| Combinaciones/capacidades: B-01, B-02, B-04–08, B-11, B-34, B-54 | Algunas dependen de límites deliberados, huecos de plantilla o representación persistente ausente. | Revisar cada contrato antes de ofrecerlo; no reabrir B-42 para absorber estos residuos. |
| Diagnóstico/interacción/legibilidad: B-15, B-17, B-18, B-22, B-28, B-30 | Diagnóstico y cobertura acotados; B-15 no garantiza layout sin cruces. | Un defecto o interacción verificable por incremento, sin reruteo global ni auditoría ficticia. |
| Límites de producto o juicio humano: B-03, B-14, B-16, B-20, B-21, B-23–25, B-27, B-35, B-38 | Incluyen semántica humana, metadatos no expresados, falta de plantilla y simulación retirada. | Mantener reservas y decisiones. No convertirlos automáticamente en funciones pendientes de automatizar. |

El inventario mantiene 26 filas parciales, siete no implementadas y tres zonas laxas.
Son 36 filas abiertas, no 36 nuevas funciones autorizadas. B-40, B-47 y B-49 son
desviaciones/extensiones declaradas, no autorizaciones implícitas para corregirlas.

## Evidencia del último candidato aceptado

La evidencia siguiente acredita el commit `0e48d8a2`; no valida futuras modificaciones.
No repetir pruebas por rutina ni reutilizar resultados si cambiaron las fuentes o
artefactos que cubren. Si falta evidencia externa en otro host, declararla no disponible.

Directorio externo:
`/home/felix/.local/state/opforja/validaciones/b37-minimo-9N8Z5n/`.

- `candidato-v2-manifiesto.json`: 342 archivos exactos, SHA256
  `1924b9236b82e58898c74e0f4e52e7c1909c298607aefbba849e33007377ae37`.
  El HANDOFF nuevo queda fuera de ese candidato; no atribuirle su revisión anterior.
- `candidato-v2.patch`: SHA256
  `ebdaf171553c814f8a3ddd9418a2ff76fe65644be1814d12e491a81fcaffd262`.
- `revision-independiente/dictamen-GLOBAL-favorable.md`: SHA256
  `f6f2f775ea86a1d0fe7b4f7b8de303f3c5cc7f6a089a618499552516c88f6555`.
  `revision-independiente/evidencias-GLOBAL.json` conserva 34 hashes de evidencia.
- `check-final.log` y `.exit`: TSC0, 4151/0, 84 archivos, 1.583.620 expectativas.
- `e2e-final.log` y `.exit`: 44/44, build verde. `golden.log` y `.exit`: 108/0,
  1098 expectativas, modo verificar; no se regeneraron oráculos.
- Sondas semánticas independientes 59/59; dos capturas finales observadas por raíz
  y revisora en `capturas-final/`, con ledger propio en `revision-independiente/`.
- `publicacion.json`: paridad Git y árbol limpio al cierre de implementación.
- La revisora existente fue `/root/reconciliar_cierre_b42`. Reutilizarla si sigue
  disponible y aporta continuidad; de otro modo, revisión independiente de sólo
  lectura, preferentemente GPT-6.1-Sol High. Mantener una sola escritora de producción.

Reservas de tiempo que deben sobrevivir:

- Primer check: 4149/2; DS20 9,640770 ms frente a 9 y T-192 3116,796884 ms frente a 3000.
  `check.log`/`check.exit` permanecen como fallo, no como aceptación.
- Contraste independiente ABBA prefijado, cuatro corridas sin competir con otros
  runners: base 2537,748379; candidato 2676,557968; candidato 2694,098279;
  base 2478,234028 ms. Las cuatro pasaron; el candidato fue aproximadamente 7,1 %
  más lento en esa muestra. No se estableció causa ni equivalencia universal.
- Check final: T-192 mediana 2500,667430 ms; cinco muestras 2421,898760,
  2432,358950, 2500,667430, 2539,409555 y 2709,794074 ms. DS20 también pasó.
- No se cambió generador, corpus, oráculo, cacheo ni umbral. Conservar calentamiento,
  mediana de cinco identidades frescas sin respuesta cacheada y límite de 3000 ms.
  Ante otro fallo, diagnosticar sin repetir hasta verde ni inventar causa ambiental.
- El RED de RF5 (6 pass/5 fail) y el montaje inicial independiente fallido sobre
  etiquetas con mayúscula siguen preservados. Este último era un supuesto de la sonda:
  base y candidato rechazaban igual `«Exhibe»`/`«EXHIBE»`; los negativos se conservaron.

## Ejecución segura al reanudar

- Mantener las restricciones del encargo: sin producción, PostgreSQL, Docker,
  infraestructura, instalaciones, `.env` ni credenciales; datos sintéticos,
  temporales y servidores propios en loopback. No despliegue sin mandato expreso.
- Bun comprobado: `/home/felix/.bun/bin/bun`, versión 1.3.11. Usar `--no-env-file`.
  El último harness puso al frente de PATH un wrapper externo `bin/bun` que ejecuta
  ese binario con `--no-env-file` también en los hijos. No cambiar instalación o PATH global.
- Desde `app/`, ejecutar los checks pertinentes del candidato final. En el último
  cierre se usaron `bun --no-env-file run check`, `run e2e` y `run golden`, con el
  wrapper anterior en PATH. `e2e` incluye build y levanta su servidor aislado.
- El puerto propio anterior fue 54637; comprobar disponibilidad antes de reutilizarlo.
  Usar `OPFORJA_E2E_PUERTO` y `OPFORJA_E2E_CAPTURAS` con destino externo propio.
  No reutilizar servicios ajenos. Serializar suites y benchmarks.
- No incluir outputs de build ni evidencia externa en commits. `app/dist-servidor`
  del cierre se trasladó a `build-servidor-final/` en la evidencia externa; un futuro
  build lo recrea. No confundir su ausencia con código faltante.
- Conservar todos los casos, aserciones, RED y oráculos. Sin skips, cuarentena,
  expectativas debilitadas, normalización encubierta ni IDs elegidos por orden incidental.
- Congelar el candidato para revisión. Un hallazgo material exige reparación serial
  y renovar las verificaciones afectadas. Cerrar sólo capacidades verificadas, con
  documentación coherente y las doce categorías de AGENTS examinadas.
- La publicación Git, el despliegue y la validación humana del modelado son efectos
  distintos. El cierre mínimo anterior no acredita RF5 completa ni conformidad ISO total.
