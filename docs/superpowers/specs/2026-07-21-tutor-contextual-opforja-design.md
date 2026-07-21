# Tutor contextual de opforja — diseño integral

**Fecha:** 2026-07-21 · **Estado:** PROPUESTO; aprobado en conversación, pendiente de
revisión del contrato escrito por el operador · **Ámbito:** producto y arquitectura; no autoriza
despliegue.

## 1. Función esencial

El tutor convierte cada decisión de modelado en una oportunidad breve de pensar mejor **sin
separar al modelador de su mesa**. No es un chat, un curso paralelo ni un corrector que adivina el
dominio. Es una capa determinista que, en el punto exacto de una acción, hace una sola de cinco
cosas: calla, confirma, orienta, pregunta o bloquea ese gesto.

La experiencia icónica es el refinamiento:

> Al iniciar in-zoom, unfold o la adopción de un OPD como hijo, opforja pregunta qué pregunta
> busca responder ese refinamiento. Sin una pregunta explícita no crea el vínculo. Al confirmarla,
> crea o adopta el OPD, conserva la pregunta como guía metodológica y devuelve al modelador al
> canvas con el siguiente paso útil.

La promesa de producto es precisa: **opforja custodia el formalismo y enseña el método; el operador
conserva la autoría del significado del dominio**.

## 2. Autoridad y corpus

### 2.1 Despacho de autoridad por plano

El tutor nunca inventa doctrina ni convierte un manual en segunda SSOT. Cada intervención despacha
la decisión a la fuente propietaria de su plano:

| Plano | Autoridad | Decide |
| --- | --- | --- |
| Validez y severidad | `urn:fxsl:kb:reglas-opm-estrictas-es` | Qué es válido, condicionado, advertido o prohibido. |
| Método | `urn:fxsl:kb:metodologia-forja-opm-es` | En qué orden avanzar, cuándo detenerse y cómo refinar. |
| OPD | `urn:fxsl:kb:spec-forja-opd-es` | Cómo se realiza visualmente el hecho OPM. |
| OPL | `urn:fxsl:kb:spec-forja-opl-es` | Cómo se expresa, lee y sincroniza el hecho en OPL-ES. |
| Explicación formal | `urn:fxsl:kb:opm-categorial-es` | Cómo explicar estructura, composición y preservación sin cambiar la validez. |

No existe un orden lineal en el que metodología pueda sobreescribir OPD u OPL: reglas estrictas
gobierna validez/severidad; metodología, secuencia y criterio; spec-OPD, realización visual; spec-OPL,
texto y roundtrip; categorial solo explica. Si una afirmación de otra capa contradice la validez de
reglas estrictas, manda esta autoridad suprema; en lo demás manda el propietario del plano. Las rutas
se resuelven mediante `docs/canon-opm/resolutor-urn.json`; los puentes de `docs/canon-opm/` no se
copian como contenido del tutor.

### 2.2 Corpus pedagógico que debe quedar disponible

El corpus de enseñanza y referencia se incorpora por fuente, no por copias mantenidas a mano:

- `docs/manual-opm-puro.md`
- `docs/manual-opforja.md`
- `docs/manual-sistemas-opm.md`
- `docs/manual-software-opm.md`
- `docs/manual-sanitarios-opm.md`
- `docs/uso-productivo.md`
- `docs/cheatsheets/README.md`
- `docs/cheatsheets/opm-puro.html`
- `docs/cheatsheets/opforja-basico.html`
- `docs/cheatsheets/opforja-avanzado.html`
- `docs/cheatsheets/opforja-ontologia.html`
- `docs/cheatsheets/opforja-control-flujo.html`
- `docs/cheatsheets/opforja-simulacion.html`
- `docs/cheatsheets/opforja-patrones.html`
- `docs/cheatsheets/opforja-sistemas.html`
- `docs/cheatsheets/opforja-software.html`
- `docs/cheatsheets/opforja-sanitarios-gestion.html`
- `docs/cheatsheets/opforja-sociosanitarios.html`
- `docs/cheatsheets/opforja-runbook.html`
- `docs/cheatsheets/opforja-no-bloqueado.html`
- `docs/cheatsheets/opforja-anclar-calcar.html`
- `docs/cheatsheets/opforja-interaccion-skill.html`
- `docs/cheatsheets/opforja-skill-flujo.html`

Un manifiesto generado en build registra título, clase de fuente, ruta/URN, secciones y anclas. El
contenido contextual es una destilación tipada con cita; la referencia completa se busca desde
`Ctrl+K`. Un gate detecta una fuente viva ausente del manifiesto, una cita rota o una regla sin
propietario. Así se aprovecha todo el corpus sin mantener una enciclopedia paralela dentro del
código.

## 3. Principios de experiencia

1. **En el lugar de la decisión.** La ayuda aparece junto a la acción o propiedad que la necesita.
2. **Una voz activa.** Nunca compiten tutor, diagnóstico, toast y ayuda por la atención.
3. **La menor intervención suficiente.** Callar es una decisión válida y frecuente.
4. **Profundidad progresiva.** Primero la acción; después el criterio; finalmente la fuente.
5. **Sin nivel declarado.** La misma interfaz sirve a quien empieza y a quien audita un modelo
   avanzado; cambia la profundidad solicitada, no un perfil “básico/experto”.
6. **Sin falsa inteligencia.** No se infiere dominio por palabras, no se puntúa la intención y no se
   prometen capacidades inexistentes.
7. **Reversible y accesible.** Cancelar no muta; confirmar es atómico; teclado, lector de pantalla y
   movimiento reducido reciben la misma capacidad.
8. **El OPL vuelve legible el significado.** Después de una edición semántica, el tutor señala el
   bloque OPL resultante para que el modelador confirme que expresa su intención; opforja no la
   confirma por él ni supone que cambió una sola oración.

## 4. Gramática de intervención

La salida conceptual es una unión discriminada con dueño único:

```ts
type TutorIntervention =
  | { kind: "silent" }
  | { kind: "confirm"; owner: SurfaceOwner; contentId: string }
  | { kind: "orient"; owner: SurfaceOwner; contentId: string }
  | { kind: "ask"; owner: SurfaceOwner; contentId: string; intentId: string }
  | { kind: "block"; owner: SurfaceOwner; contentId: string; intentId: string };
```

La severidad no se decide por tono editorial sino por la fuente propietaria y el estado real:

- **callar:** la acción es clara y no existe deuda relevante;
- **confirmar:** el usuario necesita saber qué cambió;
- **orientar:** hay un criterio útil, pero la acción puede continuar;
- **preguntar:** falta una decisión que solo el operador puede aportar;
- **bloquear solo el gesto:** la acción solicitada produciría un hecho prohibido o carece de una
  precondición metodológica adoptada por el producto.

`PanelDiagnostico` sigue siendo el único dueño de problemas persistentes del modelo. El tutor no
repite sus hallazgos: puede enfocar el diagnóstico existente o explicar el gesto actual. Un árbitro
total y estable elige como máximo una intervención; habilitar varios enfoques de conocimiento no
multiplica voces.

## 5. Profundidad progresiva

Cada intervención puede ofrecer tres capas, en este orden:

- **Ahora:** una frase accionable y, si corresponde, un control primario.
- **Criterio:** por qué esa decisión mejora o protege el modelo, en lenguaje de modelador.
- **Fundamento:** fuente propietaria exacta —URN o ruta y ancla— y acceso a la referencia completa.

“Ahora” se presenta abierta. “Criterio” y “Fundamento” son disclosures independientes, operables
por teclado y recordados localmente por tema. El recuerdo de profundidad, temas ya vistos y ayudas
descartadas es estado local de experiencia; nunca entra al JSON del modelo ni se sincroniza como
semántica OPM.

## 6. Flujo icónico: refinar con una pregunta

### 6.1 In-zoom / descomposición

1. El modelador selecciona una cosa OPM —objeto o proceso— y activa **Descomponer**.
2. Si el refinamiento ya existe, opforja navega directamente a él. Si es nuevo, la anotación
   contextual existente se expande in situ; no abre un modal, toast ni panel. Todavía no existe
   ninguna mutación del modelo.
3. El foco entra al campo `Pregunta guía`.
4. Texto:

   - título: `Descomponer «{nombre}»`;
   - pregunta: `¿Qué pregunta buscas responder con este refinamiento?`;
   - `aria-label`: `Pregunta guía`;
   - placeholder vacío de autoría: `Escribe la pregunta…`;
   - apoyo: `Quedará visible en el OPD hijo; no forma parte del OPL.`;
   - acción primaria: `Crear y abrir OPD`;
   - secundaria: `Cancelar`.

5. Solo se exige texto no vacío después de aplicar `trim()`. Si intenta confirmar vacío se
   anuncia `Escribe una pregunta antes de crear el refinamiento.`. No se impone longitud ni se juzga
   “calidad semántica” con heurísticas léxicas: opforja puede pedir precisión, no fingir que entiende
   el dominio.
6. Confirmar construye **un único modelo siguiente** con OPD hijo, vínculo de refinamiento y
   `preguntaGuia`; cruza `commitModelo` una sola vez. Un undo revierte las tres cosas.
7. El nuevo OPD queda activo. Bajo su título aparece una sola línea discreta:
   `PREGUNTA GUÍA · {pregunta} · Editar`. No se afirma que la pregunta sea concreta ni que el modelo
   ya la responda.
8. `Editar` transforma esa línea en un campo in situ, con `Guardar pregunta` como acción primaria y
   `Cancelar`. Guardar vacío anuncia `La pregunta guía no puede quedar vacía.`; guardar cruza un solo
   commit y undo/redo restaura la pregunta anterior/nueva. No abre modal.
9. En el editor, `Por qué` revela únicamente:
   `Cada refinamiento debe responder una pregunta real, no decorar el árbol.` y
   `Manual Opforja · §5` más `urn:fxsl:kb:metodologia-forja-opm-es · §A3`. Las reglas de
   cardinalidad, contenido nuevo y frontera solo aparecen cuando el diagnóstico observa su
   condición; el tutor no las anticipa como badges.

### 6.2 Unfold / despliegue — Corte 1b

Usa el mismo contrato transaccional, con título `Desplegar «{nombre}»` y la misma pregunta base.
Desde el primer frame muestra debajo un segundo control obligatorio:

- etiqueta: `Relación estructural`;
- placeholder: `Elige una relación…`;
- opciones: `Partes (agregación)`, `Atributos (exhibición)`, `Especializaciones`, `Instancias`.

`Crear y abrir OPD` solo se habilita con pregunta y relación. Se elimina el default silencioso de
agregación en los entrypoints de UI: las cuatro opciones cambian el significado y pertenecen al
operador. Un intento incompleto anuncia `Elige una relación antes de crear el refinamiento.`.

Esta corrección es una decisión material de producto y por eso se entrega como **Corte 1b**: no se
oculta dentro del cambio de schema ni se modifica parcialmente el default. Su aprobación ocurre al
aprobar esta especificación escrita y sus cuatro variantes se verifican por separado.

### 6.3 Adoptar un OPD existente

Antes de enlazar el OPD elegido como hijo se abre `Adoptar «{opd}»`, con la pregunta
`¿Qué pregunta responde este OPD al refinar «{nombre}»?` y la acción `Adoptar y abrir OPD`. Si ya
tiene `preguntaGuia`, el campo aparece prellenado y editable; si no, es obligatorio. Confirmar adopta
y actualiza la pregunta en un solo commit. Undo devuelve el OPD al Taller y restaura su pregunta
previa —incluida la ausencia—; no elimina el OPD. Cancelar conserva selección, modelo y undo intactos.

### 6.4 Compatibilidad

- Cargar o recorrer un refinamiento histórico sin pregunta nunca se bloquea.
- Al visitar su OPD hijo aparece `Este OPD no tiene pregunta guía.` con la acción no bloqueante
  `Añadir pregunta`.
- Navegar hacia un refinamiento existente no vuelve a preguntar.
- Exportar un modelo histórico no materializa defaults ni introduce diffs espurios.
- El gate duro aplica solo a nuevas operaciones de descomponer, desplegar y adoptar.
- Este gate es el contrato de declaración de un gesto nuevo, no un juicio de invalidez OPM. En modo
  Apunte y en modelos legacy la ausencia sigue siendo observable y corregible, nunca inválida por sí
  sola.

`Añadir pregunta` reutiliza el editor inline de §6.1. Guardar cruza un solo commit; undo restaura la
ausencia y redo repone el texto. Cancelar es identidad. La UI no permite vaciar una pregunta ya
declarada, aunque el tipo siga opcional para compatibilidad.

## 7. Modelo de datos y preservación

Primera extensión:

```ts
interface Opd {
  // campos vigentes
  preguntaGuia?: string;
}
```

Reglas de persistencia:

- `trim` exterior en la captura, sin reescribir el texto interior del operador;
- la UI no confirma una cadena vacía y la hidratación rechaza una cadena presente cuyo `trim` sea
  vacío;
- hidratación rechaza un valor presente que no sea cadena;
- ausencia en modelos antiguos sigue siendo ausencia;
- `preguntaGuia` es metadato metodológico del OPD: no emite OPL nuclear y no altera la firma de
  frontera;
- exportar e hidratar conserva el campo y todo el modelo previo bajo la normalización documentada.

Extensión posterior para personalizar contenido de dominio:

```ts
type LenteConocimiento = "sistemas" | "software" | "salud";

interface Modelo {
  lentesConocimiento?: LenteConocimiento[];
}
```

“Lente” aquí es una etiqueta de producto, no una óptica categorial. **OPM general** es la base fija,
visible y no desactivable; no se persiste como opción porque toda perspectiva depende de ella. Solo
los enfoques especializados son explícitos, combinables y persistidos; nunca se infieren desde
nombres del modelo. Se normalizan sin duplicados y en orden canónico; un valor desconocido se
rechaza. Un orden estable y el árbitro de una voz resuelven coincidencias.

La propiedad exigida no se describe como “equivalencia” o “funtor”. Para todo modelo válido `M`, si
`hidratar(exportar(M)) = ok(Mh)`, entonces `exportar(Mh) = exportar(M)` bajo la normalización
canónica; los modelos legacy mantienen ausentes los campos opcionales. Para una transición
`M -> M'`, se verifica por separado que exportar el resultado de undo recupera `exportar(M)` y redo
recupera `exportar(M')`. Además, `OPL(M) = OPL(sinMetadatosTutor(M))` y la validación nuclear OPM
tampoco cambia.

## 8. Arquitectura objetivo

```text
SSOT + manuales + cheatsheets
             │
             ▼ build/check
   manifiesto de fuentes ───► registro tipado de contenidos
                                      │
estado de modelo + UI ─► ContextSnapshot
                                      │
                                      ▼
                              TutorPolicyEngine puro
                                      │  1 valor (incluye silent)
                                      ▼
                              TutorIntervention
                                      │
                 ┌────────────────────┼───────────────────┐
                 ▼                    ▼                   ▼
       anotación/editor        cabecera/OPD        Ctrl+K/referencia
```

### 8.1 Fronteras

- **Registro de fuentes:** inventario generado, checksums/anclas y propietario por plano; no contiene
  estado de UI.
- **Registro de contenidos:** entradas tipadas, concisas, con `sourceRefs`, momento, condiciones,
  profundidad y enfoque; no muta el modelo.
- **`ContextSnapshot`:** proyección mínima del estado ya existente; no crea un store espejo.
- **`TutorPolicyEngine`:** función pura y total `ContextSnapshot -> TutorIntervention`; siempre
  devuelve una variante y depende solo de entradas explícitas.
- **Árbitro:** garantiza prioridad estable y propiedad de superficie; el presentador muestra 0..1
  intervenciones porque `silent` no produce UI.
- **Presentadores:** adaptan la intervención a componentes existentes sin reimplementar reglas.
- **Efectos:** abrir/cancelar un intento vive en UI transitoria; la única frontera de mutación
  semántica es la acción de store y `commitModelo`.

El orden total de arbitraje es: integridad > decisión humana pendiente > diagnóstico persistente >
eco OPL > enseñanza opcional; los empates se resuelven por prioridad e identificador estable. Todo
estado local que influya en la política entra explícitamente al snapshot: el motor no lee storage.

En Corte 1, `refinamientoPendiente` es estado efímero de aplicación, no parte de `Modelo`. Las
acciones de descomponer, desplegar y adoptar lo abren cuando el refinamiento es nuevo; confirmar
pasa `preguntaGuia` —y en unfold la relación elegida— a la operación de dominio y realiza un único
`commitModelo`. Los constructores de dominio aceptan el metadato como opcional para no romper
imports, fixtures ni consumidores legítimos fuera del gesto interactivo. Todos los disparadores de
UI atraviesan este mismo gateway.

### 8.2 Implementación incremental, no armazón anticipado

La arquitectura anterior es el destino, no licencia para construir un framework vacío. El primer
corte implementa el flujo de refinamiento con un tipo de intento y contenido tipado mínimos. El
motor común se extrae cuando exista una segunda familia real de decisiones. El manifiesto global se
incorpora cuando la búsqueda/referencia lo consuma. Cada abstracción debe llegar con dos usos o una
ley que la justifique.

## 9. Integración espacial

| Superficie existente | Responsabilidad del tutor |
| --- | --- |
| Canvas + `CodexSelectionAnnotation` | Acción inmediata, pregunta previa y confirmación del gesto seleccionado. |
| Cabecera del OPD activo | Mostrar y editar la pregunta; señalar legacy sin pregunta. No añade badges ni estado duplicado al árbol. |
| Inspector | Mantener la ayuda propia de las propiedades; Corte 1 no añade links genéricos ni duplica la pregunta. |
| OPL | Regenerar como hoy sin insertar la pregunta. Cuando exista el árbitro, un eco opcional debe derivarse del delta real: 1 oración, bloque de N, o silencio si N=0. |
| `PanelDiagnostico` | Mantener la deuda persistente y sus citas; el tutor solo enlaza o enfoca. |
| `Ctrl+K` | Descubrir ayuda, buscar/abrir la fuente exacta y ejecutar acciones contextuales mediante el mismo gateway; no crea una segunda superficie de ayuda. |
| Simulación | Explicar precondición, transición, estado y motivo de un bloqueo en el momento de ejecutar. |

No se añade un cuarto panel, burbuja flotante permanente, avatar, chat ni centro de notificaciones.
La ayuda usa la jerarquía visual, tokens y componentes de `ui-forja`; ninguna superficie nueva puede
ocultar canvas, OPL o diagnóstico en la tarea corriente.

## 10. Enfoques de conocimiento

- **OPM general, fijo:** ontología OPM, método Forja, OPD/OPL y operación de opforja.
- **Sistemas:** evidencia, frontera, cambio, adopción, retiro y bucles de control.
- **Software:** dominio→operación, agentes, interfaces, estados, requisitos y evidencia ejecutable.
- **Salud:** seguridad, flujo asistencial, responsabilidades, estados clínico-operacionales y límites
  de representación; no entrega consejo clínico.

Las reglas OPM y la metodología común siempre dominan y no son una opción desactivable. Los enfoques
especializados solo agregan ejemplos,
preguntas y criterios compatibles. Con varios activos, una intervención puede combinar evidencia en
“Criterio” o “Fundamento”, pero conserva una sola acción y una sola voz.

## 11. Cobertura funcional completa

El registro final cubre nueve momentos del trabajo y clasifica cada acción viva como intervención o
silencio deliberado:

1. **Orientar:** propósito, alcance, System Diagram, frontera y criterio de suficiencia.
2. **Conceptualizar:** objeto/proceso, transformee, agente, instrumento, nombre y esencia.
3. **Expresar estados:** estados posibles, entrada/salida y cambios.
4. **Enlazar:** tipo, dirección, abanicos, multiplicidad, modificadores y rutas.
5. **Refinar:** in-zoom, unfold/fold, partes, mecanismo, contenido nuevo y frontera. Out-zoom no es
   una capacidad viva: el tutor puede explicarlo como referencia OPM, pero nunca ofrecerlo como
   acción hasta que el producto lo implemente.
6. **Leer OPL y reparar:** lectura bimodal, planes de sincronización, rechazo honesto y confirmación.
7. **Simular:** preparación, ejecución, transición, bloqueo y lectura de resultados.
8. **Reusar y componer:** biblioteca, adopción, anclaje, drift, composición y procedencia.
9. **Graduar y exportar:** diagnóstico tripartito, brechas explícitas, perfiles, versiones y paquete
   auditable.

“Completo” no significa hablar en cada acción: significa que no queda una acción semántica sin
clasificar, una regla citada sin dueño ni una fuente viva fuera del inventario.

## 12. Accesibilidad, rendimiento y privacidad

- Flujo completo por teclado: la acción expande el editor, foco al campo, `Esc` cancela y devuelve el
  foco al disparador; `Enter` confirma solo cuando el formulario es válido.
- Editor con nombre accesible, descripción asociada, error anunciado y orden de foco estable.
- Confirmaciones no críticas mediante región `aria-live`; nunca color como único portador.
- Tap targets y disposición compatibles con el modo móvil vigente; si móvil es read-only, la ayuda
  explica sin ofrecer una mutación imposible.
- Sin animación obligatoria y respeto a `prefers-reduced-motion`.
- Política pura y lookup indexado; ninguna exploración del corpus por interacción.
- Cero llamadas de red, telemetría o LLM. El corpus necesario viaja en el build.
- El texto de las preguntas pertenece al modelo y sigue su régimen de persistencia; el estado de
  experiencia queda local al navegador.

## 13. Verificación y leyes de producto

### 13.1 Cortes 1/1b — refinamiento icónico

- Iniciar cada gesto no muta modelo ni undo.
- Blanco/espacios mantiene deshabilitada la confirmación.
- Descomponer y desplegar crean OPD + vínculo + pregunta; adoptar crea vínculo + pregunta sobre el
  OPD existente. Cada gesto cruza un solo commit.
- Un undo de creación revierte OPD, vínculo y pregunta; uno de adopción devuelve el OPD al Taller y
  restaura su pregunta previa. Redo restaura el resultado confirmado.
- Editar o añadir una pregunta cruza un commit propio; cancelar no muta, undo restaura el valor
  anterior/ausencia y redo recupera el nuevo.
- Export→hydrate conserva `preguntaGuia`; legacy sin campo carga y exporta sin materializarlo.
- Dos modelos que solo difieren en `preguntaGuia` producen OPL idéntico; el refinamiento mismo sí
  puede cambiar el bloque OPL.
- Navegar legacy es no bloqueante.
- `Esc`, foco, lector de pantalla y viewport estrecho cumplen el contrato.
- Mouse, atajos, menú contextual, `Ctrl+K` y adopción atraviesan el mismo gateway: ningún entrypoint
  puede crear un refinamiento sin la declaración.
- En mobile read-only (390×844) la pregunta se puede leer y no aparece una acción imposible. En los
  viewports editables mínimos (640×800) y desktop compacto (1280×720), el editor no tapa
  simultáneamente selección y OPL.
- Corte 1 no introduce toast, flash de éxito ni diagnóstico nuevo: el prompt es su única voz
  transitoria nueva. La exclusión global 0..1 llega con el árbitro del Corte 2.

### 13.2 Motor y corpus

- Para todo snapshot de fixtures, el motor produce exactamente una variante y como máximo una voz
  visible.
- La salida es determinista y estable ante permutación de enfoques equivalentes.
- Duplicar una perspectiva es idempotente.
- Toda entrada de contenido cita al menos una fuente registrada y propietaria.
- Toda ruta/ancla existe; toda fuente viva enumerada entra al manifiesto.
- Ninguna intervención promete una acción ausente en el producto.
- Los hallazgos persistentes no se duplican fuera de `PanelDiagnostico`.

### 13.3 Gates por corte

Mínimo: tests focalizados + `cd app && bun run check`. Todo cambio visual añade
`bun run design:governance`; el cierre de cada corte añade lint, build y prueba in-vivo del recorrido
afectado. Producción requiere autorización separada y verificación operativa del contrato de deploy.

Los tests son evidencia de estas propiedades sobre el dominio implementado, no una prueba formal
universal.

## 14. Secuencia de entrega

El blast radius del primer corte es **alto** porque cruza esquema JSON, operaciones de dominio,
store/undo y frontera app/UI; no requiere migración PostgreSQL porque el backend persiste el modelo
como JSON opaco. Se ejecuta secuencialmente en tres rebanadas: (1) dominio y roundtrip, (2) gateway
transaccional del store, (3) presentación y recorrido E2E. No se paralelizan ediciones sobre ese seam.

El campo sigue opcional en kernel y serialización legacy: no se vuelve obligatorio ni se migran en
masa los consumidores. La obligación pertenece exclusivamente al gateway de gestos interactivos
nuevos.

### Corte 1 — pregunta que gobierna el refinamiento

Persistencia de `preguntaGuia`, intento transitorio, editor anclado de
descomponer/adoptar, commit/undo atómicos, visibilidad y edición en cabecera OPD y compatibilidad
legacy. La regeneración OPL vigente basta en este corte; no se construye todavía un subsistema de
diff.

### Corte 1b — relación explícita en unfold

Incorpora unfold al mismo gateway, pero sustituye su default de agregación por la decisión humana
visible de §6.2. Prueba las cuatro relaciones y todos sus entrypoints antes de cerrar el flujo
icónico completo.

### Corte 2 — tutor de gramática

Objetos, procesos, estados y enlaces; primera extracción del `ContextSnapshot`, registro tipado,
árbitro de una voz y profundidad Ahora/Criterio/Fundamento sobre superficies existentes.

### Corte 3 — ciclo y corpus completos

Simulación, reutilización/composición, graduación/exportación, enfoques explícitos, manifiesto de todo
el corpus y búsqueda desde `Ctrl+K`; auditoría de cobertura de todas las acciones vivas.

Cada corte debe ser usable, revertible y verificable por sí mismo. El siguiente no compensa un loop
abierto del anterior.

## 15. Definición de terminado

El sistema está completo cuando:

- todo gesto semántico vivo está clasificado o marcado como silencio deliberado;
- las cinco autoridades y todo manual/cheatsheet vivo están inventariados y accesibles;
- ninguna cita, ancla o capacidad expuesta está rota;
- existe una sola voz contextual y el diagnóstico no se duplica;
- `preguntaGuia` y los enfoques hacen roundtrip, con compatibilidad legacy;
- cada mutación tutorial es atómica y reversible;
- el recorrido esencial funciona con teclado, lector de pantalla, móvil aplicable y movimiento
  reducido;
- no existe red, LLM ni inferencia léxica de dominio;
- pruebas unitarias, integración, diseño y recorrido in-vivo están verdes.

## 16. No objetivos

- Generar contenido OPM, responder por el dueño del dominio o calificar automáticamente la calidad
  conceptual de una pregunta.
- Introducir chat, avatar, gamificación, tours obligatorios o selector básico/avanzado.
- Reemplazar `PanelDiagnostico`, el manual, las cheatsheets o las SSOT.
- Copiar matrices normativas o prosa canónica al código.
- Retrovalidar con bloqueo modelos históricos.
- Refactorizar stores, selección, inspector o paleta fuera del radio necesario de cada corte.
- Desplegar a producción como efecto colateral de la implementación.

## 17. Lectura categorial de apoyo

Esta sección declara el alcance de la lente usada para revisar la arquitectura:

- `urn:fxsl:kb:icas-preservacion`: exige nombrar y probar la propiedad concreta de roundtrip y
  compatibilidad; no autoriza llamar “funtor fiel” al serializador.
- `urn:fxsl:kb:icas-efectos`: separa decisión pura, estado UI transitorio y mutación del modelo; no
  autoriza llamar mónada o coalgebra a esa separación.
- `urn:fxsl:kb:icas-universales`: inspira la unión discriminada de una voz y su arbitraje estable.
- `urn:fxsl:kb:icas-composicion`: exige que los adaptadores compongan sin duplicar propietarios.

El estatus de esta lectura es **modelo de ingeniería verificable**, no teorema categorial.
