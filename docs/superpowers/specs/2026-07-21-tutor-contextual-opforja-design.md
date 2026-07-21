# Tutor contextual de opforja — diseño integral del ciclo de modelamiento

**Fecha:** 2026-07-21 · **Estado:** APROBADO PARA IMPLEMENTACIÓN; sustituye el alcance parcial
centrado en refinamiento · **Ámbito:** producto y arquitectura; autoriza implementación local,
tests, commits y push controlado. **No autoriza deploy.**

## 1. Función esencial

**En cada decisión significativa de modelado, opforja muestra la próxima pregunta, criterio o
fuente necesaria para avanzar con control y comprender la consecuencia.** Lo hace sin separar al
modelador de su mesa.

No es un chat, un curso paralelo ni un corrector que adivina el dominio. Es una capa determinista
que, en el punto exacto de una acción, hace una sola de cinco cosas: calla, confirma, orienta,
pregunta o bloquea ese gesto. La cobertura es exhaustiva por debajo; la experiencia visible es
deliberadamente mínima.

La experiencia icónica es el refinamiento:

> Al iniciar in-zoom, unfold o la adopción de un OPD como hijo, opforja pregunta qué pregunta
> busca responder ese refinamiento y hace visibles modalidad, adoptante y relación estructural cuando
> corresponden. Sin esas decisiones explícitas no crea el vínculo. Al confirmarlas, crea o adopta el
> OPD, conserva la pregunta como guía metodológica y devuelve al modelador al canvas con el siguiente
> paso útil.

La promesa de producto es precisa: **opforja custodia el formalismo, enseña el método y hace
visibles las consecuencias; el operador conserva la autoría del significado del dominio**.

## 2. Autoridad y corpus

### 2.1 Despacho de autoridad por plano

El tutor nunca inventa doctrina ni convierte un manual en segunda SSOT. Cada intervención despacha
la decisión a la fuente propietaria de su plano:

| Plano | Fuente propietaria | Decide |
| --- | --- | --- |
| Validez y severidad | `urn:fxsl:kb:reglas-opm-estrictas-es` | Qué es válido, condicionado, advertido o prohibido. |
| Método | `urn:fxsl:kb:metodologia-forja-opm-es` | En qué orden avanzar, cuándo detenerse y cómo refinar. |
| OPD | `urn:fxsl:kb:spec-forja-opd-es` | Cómo se realiza visualmente el hecho OPM. |
| OPL | `urn:fxsl:kb:spec-forja-opl-es` | Cómo se expresa, lee y sincroniza el hecho en OPL-ES. |
| Explicación formal | `urn:fxsl:kb:opm-categorial-es` | Cómo explicar estructura, composición y preservación sin cambiar la validez. |

No existe un orden lineal en el que metodología pueda sobreescribir OPD u OPL: reglas estrictas
gobierna validez/severidad; metodología, secuencia y criterio; spec-OPD, realización visual; spec-OPL,
texto y roundtrip; categorial solo explica. Si una afirmación de otra capa contradice la validez de
reglas estrictas, manda esta autoridad suprema; en lo demás manda el propietario del plano. Las
cinco fuentes se resuelven mediante `docs/canon-opm/resolutor-urn.json`; la entrada categorial es
explicativa y no entra en decisiones de validez. Ninguna cita se publica como enlace roto. Los
puentes de `docs/canon-opm/` no se copian como contenido del tutor.

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

### 2.3 Autoridad visual y de interacción

La semántica anterior decide **qué** decir; `ui-forja` decide **cómo** pertenece a la mesa:

- `ui-forja/GOVERNANCE.md` gobierna adopción, excepciones y verificación;
- `ui-forja/01-design-spec.md` y `ui-forja/tokens.json` gobiernan jerarquía, tipografía, color y
  geometría;
- `ui-forja/02-components.md` gobierna la anatomía de controles y superficies;
- `ui-forja/05-interactions.md` gobierna foco, selección, teclado y respuesta al gesto.

El tutor no crea una estética paralela ni usa “ayuda” como excepción a la gobernanza. Cualquier
patrón nuevo debe incorporarse primero al sistema visual o realizarse mediante un componente vivo ya
autorizado.

### 2.4 Arbitraje previo a implementación

Esta matriz congela los conflictos detectados al contrastar el diseño con el canon, el producto vivo
y sus regresiones. La implementación no reabre estas decisiones por conveniencia local:

| Tensión | Evidencia propietaria o viva | Contrato ratificado |
| --- | --- | --- |
| `[RATIFICAR]` | Metodología A7, manuales y puente humano-agente | Es un estado recibido de una ancla normativa upstream; la mesa no lo crea como marca genérica ni ratifica su propia hipótesis. |
| Recurso lineal con varios consumidores | `R-CAT-LIN-2`, `severidadDiagnostico` y `CODIGOS_EQUIVALENTES` | `RECURSO_LINEAL_MULTIPLES_CONSUMIDORES` es una **mejora metodológica navegable**, no un bloqueo de integridad ni una precondición para componer. |
| Composición | Familia `R-CAT-COMP`, `componerModelos` y `DialogoComposicion` | Selección de fuente, mapeos resolubles e integridad del resultado son precondiciones de la transacción. La linealidad orienta sin impedirla. La vista previa declara incorporación y procedencia; aplicar cruza un commit único y undo recupera el modelo anterior. |
| Graduación | Contrato Apunte/Taller y `diagnosticoSeveridad` | `SD_SIN_PROCESO_PRINCIPAL` es mejora metodológica. Graduar cambia rigor, nombre/destino elegidos y especie; no certifica, repara, adopta OPDs ni cambia el rol Biblioteca. |
| Autoridad categorial | `urn:fxsl:kb:opm-categorial-es` v1.3.0 | Solo explica estructura y preservación. Está registrada en el resolutor para que `Fundamento` pueda navegarla sin enlaces rotos; nunca decide severidad. |
| Revalidación | `PanelDiagnostico` y `ui-forja/05-interactions.md` §6 | El diagnóstico se recomputa reactivamente tras cambios del modelo. “Referencias a revalidación” significa recomputación automática, navegación y anuncio accesible del delta; no existe botón ni acción manual de restauración, aprobación o mutación. |

## 3. Principios de experiencia

1. **En el lugar de la decisión.** La ayuda aparece junto a la acción o propiedad que la necesita.
2. **Una voz por intención o resultado.** Para un mismo `intentId` o `resultId` hay como máximo una
   intervención contextual activa. Un estado persistente —diagnóstico, guardado o revisión— puede
   seguir visible en su superficie si no repite el mismo hallazgo, consecuencia o acción.
3. **La menor intervención suficiente.** Callar es una decisión válida y frecuente.
4. **Profundidad progresiva.** Primero la acción; después el criterio; finalmente la fuente.
5. **Sin nivel declarado.** La misma interfaz sirve a quien empieza y a quien audita un modelo
   avanzado; cambia la profundidad solicitada, no un perfil “básico/experto”.
6. **Sin falsa inteligencia.** No se infiere dominio por palabras, no se puntúa la intención y no se
   prometen capacidades inexistentes.
7. **Control y recuperación reales.** Cancelar un intento no muta; una mutación del documento
   confirmada es atómica y undoable; workspace y efectos externos declaran su recuperación real sin
   prometer undo. Teclado, lector de pantalla y movimiento reducido reciben la misma capacidad.
8. **El OPL vuelve legible el significado.** Después de una edición semántica, el tutor señala el
   bloque OPL resultante para que el modelador confirme que expresa su intención; opforja no la
   confirma por él ni supone que cambió una sola oración.

### 3.1 Exhaustivo por dentro, mínimo por fuera

“Integral” no significa hablar en cada paso ni exhibir todo el corpus. Significa que toda capacidad
semántica viva tiene una conducta declarada —intervenir o callar— y que toda intervención puede
mostrar su fuente. En pantalla aparece **una sola próxima decisión**. El inventario, la precedencia y
la trazabilidad permanecen detrás de la interfaz.

No hay onboarding obligatorio, centro de ayuda, panel del tutor, avatar, chat, progreso, puntaje ni
selector básico/avanzado. La primera acción real enseña lo necesario; la persona experta puede
continuar sin abrir explicación y la principiante puede desplegar `Criterio` y `Fundamento` sin
abandonar el gesto.

### 3.2 Tres ejes que el tutor nunca mezcla

| Eje | Polos | Transición viva | Lo que **no** significa |
| --- | --- | --- | --- |
| **Rigor** | Apunte → Modelo | `Graduar` vuelve exigibles las señales metodológicas antes relajadas. | No adopta OPDs, no corrige hechos y no certifica calidad. No existe hoy una acción UI de degradar. |
| **Integración** | Taller → árbol de OPDs | `Adoptar` vincula un OPD suelto como refinamiento y conserva su identidad. | No gradúa el apunte. Quitar un refinamiento hoy elimina su subárbol; no lo devuelve al Taller. |
| **Rol** | Trabajo ⇄ Biblioteca | `Marcar/Quitar de bibliotecas` designa o retira al modelo como fuente de Piezas. | No lo abre, no cambia por sí solo la guardia de edición y no prueba validez ni madurez. Si el origen era Apunte, marcar también abandona ese rigor. |

Los estados legales son `(Apunte, Trabajo)`, `(Modelo, Trabajo)` y `(Modelo, Biblioteca)`;
`(Apunte, Biblioteca)` es ilegal. Quitar de Bibliotecas vuelve a `(Modelo, Trabajo)`, nunca a Apunte.
La **guardia** `solo lectura ⇄ edición` es contexto de apertura: al abrir una Biblioteca se activa
solo lectura y `CintaBiblioteca` permite decidir editar; no es otro eje de identidad.

Archivo, versión, estado de guardado y revisión remota son condiciones operativas ortogonales; no se
presentan como otra “especie”. El tutor nombra el eje o guardia que cambia y declara literalmente qué
permanece igual.

### 3.3 Un ciclo de remodelamiento, no un wizard

El trabajo puede empezar por una función clara, por fragmentos en Taller o por un modelo existente.
No se persiste una “etapa actual” ni se encierra al modelador en una secuencia. El momento se deriva
del gesto, la selección, el OPD, el régimen y el modo de trabajo explícitos.

```text
intención/evidencia → explorar → integrar/formalizar → leer OPL → validar/simular
        ▲                                                        │
        └── nueva evidencia ← compartir/versionar ← cerrar/reusar┘
```

Una nueva evidencia, una nota pendiente, una revisión remota o un drift pueden reabrir el ciclo en
cualquier punto. El tutor ayuda a localizar el hecho afectado, realizar el cambio más pequeño,
releer su OPL, revalidar y dejar una versión o relevo; no crea un “modo remodelamiento” paralelo.

## 4. Gramática de intervención

La salida conceptual es una unión discriminada con dueño único:

```ts
type TutorContext = { intentId: string; resultId?: string };

type TutorIntervention =
  | ({ kind: "silent" } & TutorContext)
  | ({ kind: "confirm"; owner: SurfaceOwner; contentId: string } & TutorContext)
  | ({ kind: "orient"; owner: SurfaceOwner; contentId: string } & TutorContext)
  | ({ kind: "ask"; owner: SurfaceOwner; contentId: string } & TutorContext)
  | ({ kind: "block"; owner: SurfaceOwner; contentId: string } & TutorContext);
```

La severidad no se decide por tono editorial sino por la fuente propietaria y el estado real:

- **callar:** la acción es clara y no existe deuda relevante;
- **confirmar:** el usuario necesita saber qué cambió;
- **orientar:** hay un criterio útil, pero la acción puede continuar;
- **preguntar:** falta una decisión que solo el operador puede aportar;
- **bloquear solo el gesto:** la acción solicitada produciría un hecho prohibido o carece de una
  precondición metodológica adoptada por el producto.

`PanelDiagnostico` sigue siendo el único dueño de problemas persistentes del modelo. El tutor no
repite sus hallazgos: puede enfocar el diagnóstico existente o explicar el gesto actual. El árbitro
local del intento elige como máximo una intervención para ese `intentId` o `resultId`; no es un
control plane global de la aplicación. Habilitar varios enfoques de conocimiento tampoco multiplica
voces.

Preguntar está reservado para decisiones de autoría o consecuencias materiales. El tutor no pide
confirmar que el usuario “entendió”, no felicita, no puntúa y no interpone preguntas de conocimiento
entre el modelador y una acción inequívoca.

## 5. Profundidad progresiva

Cada intervención puede ofrecer tres capas, en este orden:

- **Ahora:** una frase accionable y, si corresponde, un control primario.
- **Criterio:** por qué esa decisión mejora o protege el modelo, en lenguaje de modelador.
- **Fundamento:** fuente propietaria exacta —URN o ruta y ancla— y acceso a la referencia completa.

“Ahora” se presenta abierta. “Criterio” y “Fundamento” son disclosures independientes, operables
por teclado y recordados localmente por tema. El recuerdo de profundidad, temas ya vistos y ayudas
descartadas es estado local de experiencia; nunca entra al JSON del modelo ni se sincroniza como
semántica OPM.

### 5.1 La voz

- Una regla conocida se afirma sin muletillas: `Un proceso no tiene estados`; una decisión de dominio
  se pregunta sin sugerir respuesta: `¿Qué objeto cambia?`.
- El tutor distingue `declarado en el modelo`, `derivado por opforja`, `pendiente de decisión` y
  `evidencia externa`; nunca los fusiona bajo “correcto”.
- Un bloqueo nombra causa y salida: `Este enlace no admite ese extremo · Elegir otro tipo`; se evita
  `Algo salió mal`.
- Una confirmación dice hecho y consecuencia, no juicio: `OPD adoptado · ahora refina «Proceso»`, no
  `¡Excelente trabajo!`.
- Los verbos visibles coinciden con el producto: Adoptar, Graduar, Calcar, Anclar, Re-sincronizar,
  Componer, Conectar y Restaurar no se diluyen en “continuar”, “usar” o “sincronizar todo”.
- No habla en primera persona, no atribuye intención al modelador y no presenta inferencias como
  confianza probabilística.

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

### 6.2 Unfold / despliegue — Corte 1B

Usa el mismo contrato transaccional, con título `Desplegar «{nombre}»` y la misma pregunta base.
Desde el primer frame muestra debajo un segundo control obligatorio:

- etiqueta: `Relación estructural`;
- placeholder: `Elige una relación…`;
- opciones: `Partes (agregación)`, `Atributos (exhibición)`, `Especializaciones`, `Instancias`.

`Crear y abrir OPD` solo se habilita con pregunta y relación. Se elimina el default silencioso de
agregación en los entrypoints de UI: las cuatro opciones cambian el significado y pertenecen al
operador. Un intento incompleto anuncia `Elige una relación antes de crear el refinamiento.`.

Esta corrección es una decisión material de producto y por eso se entrega como **Corte 1B**: no se
oculta dentro del cambio de schema ni se modifica parcialmente el default. Su aprobación ocurre al
aprobar esta especificación escrita y sus cuatro variantes se verifican por separado.

### 6.3 Adoptar un OPD existente

Antes de enlazar el OPD elegido como hijo se abre un único gateway `Adoptar «{opd}»`. El contexto
preseleccionado se hace visible y editable; nunca se hereda como significado oculto:

1. `Elemento que refina`: una cosa elegible del OPD adoptante;
2. `Tipo de refinamiento`: `Descomposición` o `Despliegue`;
3. si es despliegue, `Relación estructural`: las cuatro alternativas de §6.2;
4. `Pregunta guía`: `¿Qué pregunta responde este OPD al refinar «{nombre}»?`.

La acción `Adoptar y abrir OPD` solo se habilita cuando todos los campos exigibles están resueltos.
Si el OPD ya tiene `preguntaGuia`, aparece prellenada y editable. Confirmar invoca el mismo
`establecerRefinamiento` usado por el camino top-down y cruza un solo commit con adoptante, tipo,
relación cuando aplica, vínculo y pregunta. No queda un `modo` legacy implícito. Undo devuelve el OPD
al Taller y restaura vínculo, ubicación y pregunta previos —incluida la ausencia—; no elimina el OPD.
Cancelar conserva selección, modelo y undo intactos. Ambos menús vivos de adopción atraviesan este
mismo gateway.

### 6.4 Reordenar no cambia silenciosamente el significado

`Cortar/Pegar` se limita a reordenar OPDs hermanos. Mover un OPD bajo otra cosa no es layout: cambia
el hecho de refinamiento y debe pasar por el gateway de adopción/reubicación, actualizar de forma
atómica `padreId`, el slot semántico de la cosa adoptante, modalidad, relación y pregunta guía, y
ofrecer undo íntegro. Hasta que esa convergencia exista, la UI no ofrece pegar bajo un padre distinto.
Así el árbol, el kernel y la pregunta nunca describen tres contextos incompatibles.

### 6.5 Compatibilidad

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

Extensión posterior, no bloqueante, para sostener el ciclo entre sesiones:

```ts
type TipoModelo = "dominio" | "realizacion" | "introduccion-operacion";

interface FichaTrabajo {
  preguntaHabilitante?: string;
  duenoSignificado?: string;
  responsableDecision?: string;
  tiposModelo?: TipoModelo[];
  criterioSuficiencia?: string;
  vidaUtil?: "respuesta-puntual" | "referencia-viva";
  revisarCuando?: string;
}

interface Modelo {
  fichaTrabajo?: FichaTrabajo;
}
```

Es la mínima porción no derivable de la ficha de `docs/manual-sistemas-opm.md` que el tutor necesita
para acompañar longitudinalmente. Beneficiario, frontera, función y transformee se modelan en OPM;
base documental, procedencia y revisión pertenecen al ledger/fuente externa; una duda, hipótesis o
cambio pendiente usa nota más su fuente externa. `[RATIFICAR]` no se crea como marca genérica: solo
es el estado recibido de un ancla normativa upstream ya declarada pendiente de ratificación, cuya
transición opforja puede registrar. Ninguno se duplica en la ficha. `responsableDecision` nombra quién decide sobre el modelo —no necesariamente quien edita— y
`tiposModelo` permite declarar uno o más de dominio, realización e introducción/operación sin
inferirlos del contenido.

La ficha se completa progresivamente desde el Inspector del modelo, nunca como formulario de
entrada. Es metadato metodológico: no emite OPL ni altera validez nuclear. `Modelo.descripcion` sigue
siendo resumen libre y no se parsea ni se migra por heurística.

Su propiedad se entrega en dos tramos sin fingir un transporte inexistente:

- **Corte 3A:** ficha local editable solo en modelos sin `procedencia`; cada edición cruza un commit
  del modelo y participa en undo/redo.
- **Corte 7A:** el proto declara la ficha, el compilador la transporta y el bundle la conserva. En un
  modelo con procedencia proto/sello, ese ejemplar upstream se muestra como propietario y solo
  lectura; una modificación se formula como re-elicitación. Antes de que exista ese mapeo completo,
  opforja no materializa una ficha local paralela en modelos con procedencia.

La normalización es explícita: `trim` exterior de cadenas; cadena vacía equivale a ausencia; enums
solo admiten sus valores declarados; `tiposModelo` elimina duplicados y usa orden canónico; tipos
inválidos se rechazan; objeto vacío vuelve a ausencia; hidratar legacy no materializa el campo.
Export/hydrate y undo/redo cumplen las mismas leyes que `preguntaGuia`.

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
estado de modelo + UI ─► TutorIntentSnapshot
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
- **`TutorIntentSnapshot`:** proyección mínima y discriminada del intento actual; no crea un store
  espejo ni acumula todos los campos posibles.
- **`TutorPolicyEngine`:** función pura y total `TutorIntentSnapshot -> TutorIntervention`; siempre
  devuelve una variante y depende solo de entradas explícitas.
- **Árbitro por intención/resultado:** garantiza prioridad estable y propiedad de superficie dentro
  del gesto corriente; el presentador muestra 0..1 intervenciones porque `silent` no produce UI.
- **Presentadores:** adaptan la intervención a componentes existentes sin reimplementar reglas.
- **Efectos:** política y presentación no mutan. Cada acción declara la secuencia de efectos
  elementales que compone y la recuperación real de cada uno.

El orden de arbitraje dentro de un intento es: integridad > decisión humana pendiente > riesgo de pérdida o
concurrencia > diagnóstico persistente > consecuencia del gesto > eco OPL > enseñanza opcional; los
empates se resuelven por prioridad e identificador estable. `MensajeFlashBridge` conserva feedback
transitorio para resultados no tutorizados. Si tutor y flash reclaman el mismo `resultId`, el dueño
de la superficie absorbe la consecuencia y el duplicado se suprime. Un diagnóstico persistente no
relacionado puede seguir visible. Todo estado local que influya en la política entra explícitamente
al selector del intento: el motor no lee storage.

La base común contiene únicamente identidad y contexto de interacción. Rigor, rol, selección,
procedencia, dirty/revisión, diagnóstico, gates, lentes o experiencia entran solo en el selector que
realmente los consume:

```ts
interface TutorIntentBase {
  intentId: string;
  actionId: string;
  surface: SurfaceOwner;
  interactionMode: "editable" | "read-only" | "simulation" | "mobile-read";
}

type TutorIntentSnapshot =
  | StartIntentSnapshot
  | EntityIntentSnapshot
  | PropertyIntentSnapshot
  | StateIntentSnapshot
  | LinkIntentSnapshot
  | ViewIntentSnapshot
  | RefineIntentSnapshot
  | GraduateIntentSnapshot
  | LibraryRoleIntentSnapshot
  | LibraryOpenIntentSnapshot
  | OplApplyIntentSnapshot
  | DiagnosticIntentSnapshot
  | ReasoningIntentSnapshot
  | SimulationIntentSnapshot
  | ReuseIntentSnapshot
  | CompositionIntentSnapshot
  | PersistenceIntentSnapshot
  | VersionIntentSnapshot
  | ImportIntentSnapshot
  | ExportIntentSnapshot
  | ReelicitationIntentSnapshot;
```

No existe `faseDelModelo` persistida ni inferida. La intención nace del gesto real; cada variante
solo añade los datos que su política necesita. Tampoco existe una variante genérica
`CapabilityIntentSnapshot`: una capacidad nueva obtiene selector dedicado o permanece fuera del
motor hasta justificarlo. La unión anterior es objetivo de cobertura, no trabajo anticipado: cada
variante nace con su corte vertical y sus escenarios.

### 8.2 Efectos elementales, composición y recuperación

1. **Lectura pura:** orientar, explicar, buscar, derivar y navegar; no muta.
2. **UI transitoria:** abrir editor/disclosure, mover foco o preparar un intento; cancelar es identidad
   sobre modelo, workspace e historial.
3. **Modelo:** cambiar hechos o metadatos del documento; un solo `commitModelo`, undo/redo probado.
4. **Workspace:** cambiar identidad, carpeta, rigor/rol, archivar o gobernar apertura; declara consecuencia y
   recuperación propia, sin prometer undo del modelo.
5. **Externo:** guardar, versionar, importar, clipboard, descarga o puente con agente/skill; entrega
   recibo de éxito/fallo y, si corresponde, confirmación o copia recuperable.

No son estratos excluyentes. Cada acción declara una secuencia corta `effects: Effect[]` y el punto de
recuperación de cada efecto, sin construir primero un framework general. Ejemplos que el tutor debe
distinguir:

- importar en la pestaña activa: lectura externa → preflight de dirty → reemplazo de modelo →
  reinicio de historial. Cancelar antes de reemplazar es identidad; si hay trabajo sin preservar se
  exige `Guardar`, `Descartar e importar` o `Cancelar` y no se promete undo posterior;
- importar en pestaña nueva: lectura externa → apertura de workspace, sin reemplazar la activa;
- guardar como: persistencia externa → asignación de identidad/revisión en workspace;
- graduar: validación del intento → identidad/destino persistidos → cambio coordinado de rigor e
  índice. Si falla cualquier paso, conserva el Apunte original, mantiene el diálogo abierto y muestra
  un recibo accionable; nunca deja una graduación parcial.

Nueva evidencia o una revisión entrante nunca cruza de lectura a mutación sin aceptación humana
explícita.

En Cortes 1A/1B, `refinamientoPendiente` es estado efímero de aplicación, no parte de `Modelo`. Las
acciones de descomponer, desplegar y adoptar lo abren cuando el refinamiento es nuevo; confirmar
pasa `preguntaGuia` —y en unfold la relación elegida— a la operación de dominio y realiza un único
`commitModelo`. Los constructores de dominio aceptan el metadato como opcional para no romper
imports, fixtures ni consumidores legítimos fuera del gesto interactivo. Todos los disparadores de
UI atraviesan este mismo gateway.

### 8.3 Implementación incremental, no armazón anticipado

La arquitectura anterior es el destino, no licencia para construir un framework vacío. El primer
corte implementa el flujo de refinamiento con un tipo de intento y contenido tipado mínimos. El
motor común se extrae cuando exista una segunda familia real de decisiones. El manifiesto global se
incorpora cuando la búsqueda/referencia lo consuma. Cada abstracción debe llegar con dos usos o una
ley que la justifique.

## 9. Integración espacial

| Superficie existente | Responsabilidad del tutor |
| --- | --- |
| Estado vacío + toolbar | Elegir SD-first o Taller y enseñar la primera distinción objeto/proceso/enlace sin onboarding. |
| Canvas + `CodexSelectionAnnotation` | Acción inmediata, pregunta previa y confirmación del gesto seleccionado. |
| Cabecera + árbol + Taller | Mostrar/editar la pregunta, ubicación y carácter raíz/refinado/suelto/derivado; explicar adopción sin añadir badges duplicados. |
| `CintaApunte` / `DialogoGraduar` | Explicar y ejecutar únicamente el cambio de rigor, con validez exigible y consecuencias. |
| Gestor | Designar/retirar el rol Biblioteca y manejar guardado, versión, archivo y revisión; marcar no abre el modelo. |
| `CintaBiblioteca` | Explicar la guardia de apertura solo lectura y pedir una decisión consciente antes de editar; no es dueña del rol. |
| Inspector | Ayuda de la propiedad exacta; notas, anclas, requisitos y drift permanecen con su dueño. No alberga un bloque genérico del tutor. |
| OPL | Regenerar como hoy sin insertar la pregunta. Cuando exista el árbitro, un eco opcional debe derivarse del delta real: 1 oración, bloque de N, o silencio si N=0. |
| `PanelDiagnostico` | Mantener la deuda persistente y sus citas; el tutor solo enlaza o enfoca. |
| Simulación | Preflight, explicación del paso/bloqueo activo y lectura del resultado; silencio durante ejecución fluida. |
| Piezas / submodelo / composición | Comparar los verbos antes de ejecutar y declarar procedencia, interfaz, drift y recuperación reales. |
| Import, versiones y exportes | Elegir artefacto por finalidad, anticipar destino y reemplazo solo en el entrypoint que corresponda, y entregar recibo de resultado. |
| `Ctrl+K` | Descubrir una acción, un tema o la fuente exacta mediante el mismo gateway; no crea una segunda superficie de ayuda ni recibe alertas espontáneas. |

No se añade un cuarto panel, burbuja flotante permanente, avatar, chat ni centro de notificaciones.
La ayuda usa la jerarquía visual, tokens y componentes de `ui-forja`; ninguna superficie nueva puede
ocultar canvas, OPL o diagnóstico en la tarea corriente.

### 9.1 Contrato visual de lujo sobrio

- La intervención inmediata extiende la superficie que ya porta el gesto —anotación, campo, cinta,
  fila o diálogo—; no parece un producto incrustado dentro de opforja.
- `Ahora` ocupa una frase y muestra como máximo una primaria más `Cancelar` o una secundaria textual.
  Las alternativas semánticas mutuamente excluyentes se presentan como elección, no como dos CTAs
  primarias simultáneas.
- `Criterio` y `Fundamento` son palabras-acción editoriales. Cerrados no dejan caja vacía, icono de
  ayuda, badge ni margen residual.
- Papel, tinta, hairline, tipografía y foco provienen de `ui-forja`; cero sombra de elevación, tarjeta
  redondeada, gradiente, ilustración, color doctrinal o animación celebratoria. Crimson conserva su
  rol de foco/selección UI.
- Éxito se percibe en el estado resultante —OPD abierto, línea OPL resaltada, especie/rol cambiado—;
  no se añade toast de felicitación. Error persistente permanece en diagnóstico; error del intento se
  anuncia junto al control.
- La peor pantalla sigue siendo legible: si selección, issue y revisión remota coinciden, solo una
  demanda contextual gobierna el intento corriente. Los estados persistentes no duplicados quedan
  pasivos en sus superficies propietarias, sin apilar CTAs.
- La apertura es inmediata: política local y contenido indexado, sin skeleton ni falsa conversación.
  Si la acción real espera red —guardar, cargar Biblioteca o revisión— se muestra el estado honesto de
  esa operación, no una respuesta optimista del tutor.

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

El default es OPM general sin enfoque especializado. No se pregunta por lentes al crear un Apunte ni
se abre un configurador; el operador las activa explícitamente desde el contexto del modelo cuando
aportan valor. Una lente nunca cambia `Ahora`, la severidad o las acciones disponibles: solo afina un
ejemplo, pregunta de dominio o referencia bajo disclosure.

## 11. Cobertura integral del modelamiento y remodelamiento

### 11.1 La espina dorsal

El tutor reconoce doce momentos, pero no los convierte en pasos obligatorios:

1. **Llegar:** abrir, importar o crear; comprender Apunte, Modelo, Taller y Biblioteca en contexto.
2. **Encuadrar:** decidir para qué se modela, qué sistema se observa, su función, beneficiario,
   afectado, frontera y criterio de suficiencia.
3. **Explorar:** capturar fragmentos legítimos en un Apunte, desde el SD o bottom-up en Taller.
4. **Formalizar:** distinguir objetos, procesos, estados, roles, transformaciones y relaciones.
5. **Integrar:** traer apariencias, adoptar OPDs, construir el árbol y refinar con una pregunta.
6. **Leer:** contrastar cada cambio significativo con el OPL que realmente produjo.
7. **Validar:** separar integridad, cierre metodológico y estilo; navegar hasta el hecho corregible.
8. **Analizar:** buscar, recorrer dependencias, verificar frontera, comparar vistas y razonar impacto.
9. **Simular:** ensayar precondiciones, transiciones, bloqueos, tiempo y resultados sin confundir
   simulación con evidencia del mundo.
10. **Reusar y conectar:** usar Piezas, calcar, anclar, sincronizar, conectar submodelos o componer
    mediante una interfaz explícita.
11. **Cerrar y relevar:** graduar, versionar, exportar, compartir contexto y convertir un modelo en
    Biblioteca cuando corresponda.
12. **Reabrir:** capturar nueva evidencia, localizar el hecho afectado, remodelar la mínima porción y
    repetir lectura, validación, simulación y relevo.

Sobre esa espina operacional, `docs/manual-sistemas-opm.md` aporta el ciclo de vida del sistema:

```text
evidencia → AS-IS → necesidad → alternativas → TO-BE → intervención → adopción
    ▲                                                               │
    └──── aprendizaje ← nueva evidencia ← operación/mantenimiento ───┘
```

El tutor formula preguntas y preserva trazabilidad durante ese ciclo, pero no finge que opforja
ejecuta la intervención. AS-IS, TO-BE y transición se mantienen como modelos explícitamente
separados —no como versiones del mismo dibujo—; la evidencia empírica, la ejecución, la adopción y
el retiro del sistema real ocurren fuera de la mesa. Archivar un modelo tampoco acredita que el
sistema haya sido retirado.

### 11.2 Contrato de cobertura por familia de capacidad

La tabla define **qué decisión ayuda a tomar** el tutor. No obliga a mostrar una pregunta si el gesto
ya es inequívoco; en ese caso la entrada se resuelve como `silent` o como confirmación breve del
efecto.

| Familia viva | Decisión o comprensión que custodia | Superficie propietaria y conducta del tutor |
| --- | --- | --- |
| **Nuevo, abrir, importar, guardar y autosalvar** | Distinguir explorar, retomar, copiar y preservar; evitar pérdida ante dirty, import o revisión remota. | Estado vacío, gestor, `ChipPersistencia` y diálogos existentes. Calla en guardados rutinarios; declara identidad, destino, secuencia de efectos y recuperación. Importar en la activa anticipa reemplazo e historial nuevo; importar en pestaña nueva no. |
| **Apunte, Modelo, Taller y Biblioteca** | Reconocer qué eje cambia: rigor, integración o rol. | `CintaApunte`, árbol/Taller, `DialogoGraduar`, gestor y `CintaBiblioteca`. Nunca los presenta como cuatro modos equivalentes. |
| **Propósito, SD y frontera** | Elegir entrada SD-first o bottom-up; explicitar función, beneficiario/afectado, transformee, valor y límite del sistema. | Estado vacío, selección y cabecera del OPD. Pregunta solo lo que el operador debe decidir; remite a método y manuales de dominio para profundizar. |
| **Objetos y procesos** | Distinguir lo que existe de lo que transforma; nombrar sin convertir la interfaz, el documento o la organización en sustituto del fenómeno. | Creación, renombrado e Inspector. En primer uso o duda ofrece el criterio; no clasifica nombres mediante heurísticas. |
| **Esencia, afiliación, alias, descripción, unidad, valor, URL e imagen** | Separar semántica OPM, metadato del dominio y mera realización visual. | Campo exacto del Inspector. Enseña al abrir una propiedad no obvia; calla en edición repetida y nunca hace que una imagen o alias cambie la identidad lógica. |
| **Estados, designaciones y duración** | Decidir qué estados puede tener un objeto y distinguir `initial`, `final`, `default` y `Current` declarado. | Creación de estados, `InspectorEstado`, duración y visibilidad por OPD. Bloquea estados de proceso; explica que `Current` declarado es persistente y si existe inicia el runner, mientras el current de runtime es efímero. Sin declarado, el plan cae a `default`, luego `initial` y luego al primero estable. Un mismo estado no admite a la vez `default` y `Current`. Ocultar/mostrar es vista, no borrado. |
| **Enlaces transformadores y habilitadores** | Responder “¿qué le ocurre al objeto?” y “¿quién ejecuta o qué habilita?” antes de elegir consumo, resultado, efecto, agente, instrumento o invocación. | Selector de tipo, gesto de conexión e `InspectorEnlace`. La pregunta aparece donde se elige el tipo; no después de crear un enlace plausible por default. |
| **Enlaces estructurales** | Distinguir partes, atributos exhibidos, especializaciones e instancias. | Selector de relación, unfold y edición del enlace. Expone las cuatro alternativas cuando cambian el significado; no usa agregación silenciosa. |
| **Control, abanicos, multiplicidad, rutas y excepciones** | Distinguir esperar, omitir, disparar; todas/exactamente una/al menos una; cardinalidad, escenario y umbral temporal. | Secciones del enlace, abanico y decisión. Preguntas breves ligadas al control activo; el diagnóstico conserva inconsistencias persistentes. El abanico probabilístico declarado con pesos pendientes (`R-FAN-PROB-1`, caso C) permanece programado: el tutor no confunde alternativas ordinarias con probabilidades ni presenta el uniforme de simulación como pesos persistidos. |
| **Apariciones, traer, ocultar, plegar y layout** | Entender que una entidad lógica puede aparecer en varios OPDs y que visibilidad/layout no crean ni borran hechos. | Canvas, acciones contextuales, árbol e Inspector. Confirma efectos de vista y solo interviene por colisión, densidad, frontera o posible confusión entre apariencia e identidad. |
| **Taller, adopción y árbol de OPDs** | Integrar un OPD suelto sin confundir el acto con graduación ni reordenar con reparentar. | Banda Taller, menú del OPD y gateway de adopción. Declara `Adoptar integra; no gradúa`; pide adoptante, modalidad, relación si aplica y pregunta. Cortar/Pegar solo reordena hermanos hasta que reparentar converja por el mismo kernel. Eliminar un refinamiento usa copy destructivo de subárbol; jamás promete devolverlo al Taller. |
| **Refinamiento, plegado y frontera** | Elegir pregunta guía, descomposición/despliegue, relación estructural, contenido nuevo, orden, mecanismo y preservación de frontera. | Anotación de selección, cabecera del OPD, árbol e Inspector. Aplica el flujo icónico de §6 y ofrece verificar coherencia cuando la capacidad existe. |
| **Vistas derivadas y de requisito/submodelo** | Saber si se está leyendo una proyección sin hechos nuevos o editando el modelo propietario. | Cabecera y árbol. Muestra propósito y solo-lectura; no ofrece mutaciones imposibles ni llama refinamiento a una vista genérica. |
| **OPL legible y edición inversa** | Confirmar que el texto expresa la intención; saber qué líneas se aplicarán, cuáles no y por qué. | `PanelOpl` y `EditorOplHonesto`. Señala el delta real, conserva la previsualización por línea y remite al canvas cuando una forma no tenga inversa viva. No juzga la intención. |
| **Diagnóstico reactivo** | Separar integridad, exigencia de cierre y estilo; saber dónde corregir y qué autoridad cita el hallazgo. | `PanelDiagnostico`, dueño único. El tutor enfoca el issue o explica el régimen; no crea badges paralelos ni duplica contadores. Los cambios recomputan el diagnóstico automáticamente y anuncian el delta accesible; no hay acción manual de revalidar. |
| **Búsqueda, mapa, tabla y razonamiento de impacto** | Encontrar cosas, enlaces y modelos; explorar qué afecta, qué requiere, frontera de descomposición e impacto aguas abajo o de eliminación. | `Ctrl+K`, búsquedas, mapa, tabla y selección derivada. Antes de una eliminación relevante puede ofrecer el cálculo vivo; el resultado se presenta como derivación estructural del modelo, no certeza causal ni del dominio. |
| **Simulación conceptual y numérica** | Leer preparación, consumo, ejecución, resultado, cierre, bloqueo, tiempo y supuestos; distinguir ensayo de validación empírica. | `BarraSimulacion`, OPL resaltado y diálogo numérico. Explica el paso o bloqueo activo; calla durante reproducción fluida. El CSV numérico muestrea atributos configurados: no ejecuta la dinámica de procesos ni se presenta como evidencia real. |
| **Requisitos y ontología organizacional** | Distinguir requisito, evidencia de satisfacción, término canónico, sinónimo y grado de control. | Diálogos e Inspector existentes. La ontología organizacional se nombra como normalización léxica, no ontología formal, y cada modo describe solo su efecto vivo; no promete sugerencias sin consumidor. La cobertura no convierte el requisito en verdad automáticamente satisfecha. |
| **Estereotipos y Piezas** | Decidir entre reutilizar una plantilla local, copiar una Pieza o conservar vínculo con su Biblioteca. | `Piezas`. La elección principal es independencia (`Calcar`) frente a seguimiento (`Anclar`); el propósito del estereotipo explica cuándo usarlo. |
| **Anclaje y drift** | Comprender origen, estado sincronizado/divergente, alcance de resincronizar y efecto de soltar el vínculo. | Sección `Anclaje` del Inspector. `Re-sincronizar` acepta la firma viva como nueva referencia y **no cambia el contenido local**; `Soltar` crea independencia y pierde vigilancia. Mientras no exista diff visual no finge previsualizar cambios. |
| **Submodelo y composición** | Elegir entre consultar una referencia solo lectura o incorporar hechos mediante una interfaz compartida. | `DialogoSubmodelo` y `DialogoComposicion`. Pregunta `¿referencia o integración?`; una coincidencia sugerida es heurística, no prueba equivalencia. Los mapeos inválidos o un resultado sin integridad bloquean la transacción; un conflicto de linealidad se muestra como mejora metodológica navegable y no deshabilita `Componer`. Declara incorporación, procedencia y reversibilidad antes de aplicar. |
| **Notas, anclas, `[RATIFICAR]` y puente con la skill** | Capturar una duda sin fosilizarla como definición y usar la autoridad correcta. | Inspector y comandos de contexto/log. Nota para duda/hipótesis/cambio pendiente; ledger/fuente externa para procedencia y fuerza de evidencia; ancla solo para afirmación normativa. `[RATIFICAR]` aparece únicamente cuando un ancla upstream ya llegó `pendiente-ratificacion`; opforja registra su transición, no crea pendientes genéricos. `modelamiento-opm` sigue siendo el consumidor externo que re-elicita. |
| **Graduación** | Ver qué severidades pasan a exigibles y decidir con conocimiento; comprender que los hechos no cambian. | `CintaApunte` y `DialogoGraduar`. Muestra issues navegables, cambios/no-cambios y una confirmación honesta; no repara, adopta ni certifica. |
| **Biblioteca y guardia de apertura** | Designar una fuente de Piezas sin confundir rol con apertura o edición. | El Gestor es dueño de `Marcar/Quitar de bibliotecas`; marcar no abre. Si el origen es Apunte, explicita la transición combinada rigor+rol. Quitar vuelve a `(Modelo, Trabajo)`, nunca a Apunte. Al abrir, `CintaBiblioteca` gobierna `solo lectura ⇄ edición`; editar no retira el rol Biblioteca. |
| **Versiones, revisión remota, import/export y relevo** | Preservar historia, restaurar como copia, escoger JSON/OPL/Markdown/PNG/contexto-skill y entender los gates canónicos. | Chip, versiones, importación y `Ctrl+K`. Explica finalidad, alcance, bloqueos y destino; restaurar crea copia y eliminar una versión exige confirmación irreversible. No promete PDF, diff visual ni merge automático inexistentes. |
| **Lectura móvil, simulación y solo lectura** | Entender por qué una acción no está disponible y dónde puede realizarse. | Superficie móvil o cinta del modo activo. Enseña y navega sin renderizar controles de mutación imposibles. |

Las acciones operativas sin decisión de modelado —iniciar/cerrar sesión, capturar un bug, abrir
configuración visual o mostrar un atajo conocido— se clasifican como **procedimiento o silencio**.
No se fuerzan dentro del tutor para inflar una cobertura ficticia.

### 11.3 Momentos de verdad y microcopy

#### A. Nacer y elegir una entrada

`Nuevo` conserva su default brutal: abre un Apunte editable de inmediato, sin formulario. Solo en una
hoja todavía vacía, el estado inicial reemplaza el hint críptico por una decisión:

- pregunta: `¿Qué tienes más claro ahora?`;
- alternativa: `Función y frontera · empezar por SD`;
- alternativa: `Fragmento concreto · empezar en Taller`;
- apoyo: `Son dos entradas legítimas dentro del mismo Apunte.`;
- `Criterio`: `Usa SD-first cuando puedes declarar función y frontera; usa Taller cuando un fragmento
  concreto precede a su lugar en el árbol.`

Elegir solo activa la capacidad viva correspondiente; no crea una encuesta, no guarda un perfil y no
declara una etapa. Si el usuario empieza por atajo o canvas, el tutor calla y acompaña ese camino.
`Nuevo` ya dispara la persistencia inmediata del Apunte: `ChipPersistencia` muestra `Guardando…` y
luego el estado real, sin pedir un guardado redundante. En cambio, un JSON importado todavía sin
identidad persistida recibe una única orientación no bloqueante:
`Este import aún vive solo en esta pestaña · Guardar para activar autosave`.

**Fundamento base:** `urn:fxsl:kb:metodologia-forja-opm-es`, `docs/manual-opforja.md` §2/§4,
`docs/manual-sistemas-opm.md` §3.2–§3.3 y `docs/uso-productivo.md` §Apuntes/§Taller.

#### B. Validar mientras se trabaja en un Apunte

En un Apunte, `PanelDiagnostico` conserva los mismos hechos y cambia únicamente la presentación de
las clases relajables. Al abrirlo muestra una vez:

> En un Apunte, la integridad sigue siendo obligatoria. Las condiciones de cierre aparecen como
> observaciones hasta graduar.

Cada issue conserva una acción primaria `Ir al elemento`, un `Criterio` accionable y su cita. Tras
cada cambio pertinente, el diagnóstico se recomputa automáticamente y anuncia solo el delta de
hallazgos mediante una región accesible; no existe botón `Revalidar`, no cambia hechos, no gradúa y
no asigna una nota. `Graduar` abre la vista exigible descrita abajo, sin duplicar el diagnóstico en
otro sistema.

**Fundamento base:** `urn:fxsl:kb:reglas-opm-estrictas-es`, `docs/manual-opforja.md` §8 y
`docs/superpowers/specs/2026-07-06-apuntes-taller-design.md` §4/§7.

#### C. Adoptar no es graduar

Cuando hay OPDs sueltos, Taller explica discretamente:

> Taller · {N} OPD(s) aún sin lugar en el árbol. Sus hechos ya emiten OPL.

Al adoptar, junto a la pregunta guía de §6.3 aparece:

> Adoptar integra este OPD al árbol. El rigor del Apunte o Modelo no cambia.

La operación es atómica y undo lo devuelve al Taller. En cambio, **quitar** una descomposición o
despliegue existente destruye el subárbol según el comportamiento vivo; su confirmación debe decir
`Eliminar refinamiento y subárbol`, enumerar el alcance y ofrecer `Cancelar` como foco inicial.

**Fundamento base:** `urn:fxsl:kb:metodologia-forja-opm-es`,
`urn:fxsl:kb:spec-forja-opd-es` y
`docs/superpowers/specs/2026-07-06-apuntes-taller-design.md` §2/§4.

#### D. Graduar con pleno conocimiento

`DialogoGraduar` abre con:

> Al graduar cambia el rigor, no los hechos.

Luego presenta dos bloques compactos:

- `Se vuelve exigible`: validez de cierre, nombre definitivo y una decisión explícita de ubicación
  —incluido `Sin carpeta` como destino válido—;
- `No cambia`: entidades, enlaces, OPDs, OPL ni OPDs que sigan en Taller.

`Validez exigible` reutiliza los issues del diagnóstico como enlaces navegables. Las mejoras —entre
ellas `SD_SIN_PROCESO_PRINCIPAL`— no se presentan como bloqueos. Si no hay bloqueos, la primaria es
`Graduar`; si los hay, es `Graduar de todos modos` y anuncia su cantidad. La decisión sigue siendo
humana. El resultado no usa “válido”, “aprobado” ni “certificado” como celebración:
confirma `Ahora es Modelo · {N} bloqueos · {M} mejoras` o `Ahora es Modelo · sin pendientes de
cierre`, según hechos reales.

El nombre, tras `trim`, no puede quedar vacío; la ubicación siempre queda declarada. Graduar es una
operación compuesta: prepara identidad/destino, persiste lo exigible y solo entonces cambia rigor e
índice. Si falla el rename, movimiento o guardado, mantiene el Apunte original y el diálogo abierto
con `No se pudo graduar · {causa} · Reintentar`; no deja nombre, carpeta o especie a medio cambiar.

**Fundamento base:** `urn:fxsl:kb:reglas-opm-estrictas-es`,
`docs/superpowers/specs/2026-07-06-apuntes-taller-design.md` §3/§7 y
`docs/uso-productivo.md` §Apuntes.

#### E. Designar y abrir una Biblioteca

Desde un Modelo de Trabajo, `Marcar como Biblioteca` confirma:

> Cambia el rol a Biblioteca. El contenido y el rigor no cambian. Marcar no abre el modelo.

Desde un Apunte, el mismo gesto declara la transición combinada antes de habilitar la primaria:

> Dejará de ser Apunte y quedará como Modelo de Biblioteca. Los hechos no cambian. Si luego quitas
> el rol Biblioteca, volverá a Modelo de Trabajo, no a Apunte.

Como esta ruta también abandona el rigor Apunte, reutiliza dentro del mismo diálogo la proyección
`Validez exigible`, los enlaces navegables y las decisiones de nombre/destino de §D. No repara ni
certifica. Con bloqueos, la primaria honesta es `Graduar de todos modos y marcar Biblioteca`; sin
bloqueos, `Graduar y marcar Biblioteca`. La secuencia completa es atómica respecto de su resultado o
recupera el Apunte original.

Abrir una Biblioteca entra en solo lectura. `Editar biblioteca` cambia únicamente la guardia de esa
apertura y no retira su rol. `Quitar de bibliotecas` pertenece al Gestor y devuelve el ejemplar a
Modelo de Trabajo; ninguna de estas acciones certifica calidad o madurez.

**Fundamento base:** `docs/superpowers/specs/2026-07-06-apuntes-taller-design.md` §2/§5,
`docs/uso-productivo.md` §Gestionar modelos/Bibliotecas y `docs/manual-opforja.md` §9.

#### F. Calcar, anclar, conectar o componer

En `Piezas`, la elección se formula una sola vez por Pieza:

> ¿Necesitas independencia o seguir el origen?

- `Calcar` — `Crea una copia independiente; los cambios futuros de la Biblioteca no llegan.`;
- `Anclar` — `Crea la copia y conserva una referencia para detectar drift.`

Si luego hay drift, `Re-sincronizar` significa `Aceptar la firma actual como nueva referencia; tu
contenido no cambia`. `Soltar` significa `Convertir en copia propia y dejar de recibir avisos`; el
undo inmediato es la recuperación viva y no existe una reconversión directa posterior a Anclaje.

Al conectar otro modelo, el criterio equivalente es `Referencia solo lectura` frente a
`Composición con interfaz compartida`. Una sugerencia de entidades compartidas se rotula
`Coincidencia sugerida; confirma que representan lo mismo`. Un mapeo sin extremos resolubles o un
resultado que rompe integridad mantiene `Componer` deshabilitado. Un conflicto de linealidad se
anuncia como mejora metodológica y orientación de interfaz, sin impedir la composición. Estos pares
no se esconden tras un verbo genérico “usar”.

**Fundamento base:** `docs/cheatsheets/opforja-anclar-calcar.html`,
`docs/manual-opforja.md` §9 y `docs/manual-sistemas-opm.md` §9.1.

#### G. Recibir nueva evidencia y remodelar

No existe una ceremonia nueva. La guía se compone sobre capacidades vivas:

1. el ledger o fuente externa conserva procedencia y fuerza de la evidencia nueva;
2. una nota registra `¿Qué decisión, hipótesis o supuesto debe revisarse?` y puede citar su
   localizador externo;
3. si la afirmación es normativa usa un ancla upstream; `[RATIFICAR]` solo aparece cuando esa ancla
   ya fue declarada `pendiente-ratificacion`, nunca como etiqueta creada por la mesa;
4. selección, búsqueda, mapa o razonamiento de impacto localizan el hecho afectado;
5. el modelador realiza la mutación o refinamiento mínimo;
6. el tutor señala el bloque OPL realmente modificado y pregunta
   `¿Expresa la nueva decisión?`;
7. diagnóstico y, si cambia comportamiento, simulación vuelven a comprobar el modelo;
8. una versión/export/relevo conserva el resultado y el operador resuelve la nota o envía el ancla
   pendiente `[RATIFICAR]` a re-elicitación.

En cada instante se muestra únicamente el siguiente movimiento disponible. La secuencia puede
interrumpirse y retomarse porque la procedencia vive en su fuente externa y la deuda de modelado en
notas, anclas normativas, ratificaciones y versiones; no en un workflow oculto del tutor.

**Fundamento base:** `docs/manual-sistemas-opm.md` §2.2–§2.5/§7,
`docs/manual-opforja.md` §A.6 y `urn:fxsl:kb:metodologia-forja-opm-es`.

#### H. Exportar sin promesas falsas

El comando elegido explica su producto antes de ejecutarse: JSON preserva el modelo; OPL/Markdown
comunica su lectura textual; documento canónico agrega portada, métricas, árbol, OPL y procedencia;
PNG realiza OPDs; contexto/log prepara el relevo a la skill. Un export bloqueado enfoca la causa
existente —densidad u OPD sin adoptar bajo el régimen correspondiente— y ofrece la acción
correctiva viva. No ofrece PDF ni un diff que el producto no sabe producir.

**Fundamento base:** `docs/uso-productivo.md` §Versiones/§Exportar y compartir,
`docs/manual-opforja.md` §A.3/§L y `docs/cheatsheets/opforja-runbook.html`.

### 11.4 Registro verificable de capacidades

La cobertura no se concentra en un objeto universal. Tres registros pequeños se unen por
`capabilityId`:

- **`CapabilityDescriptor`:** acciones/entrypoints; estado `live`, `live-read`, `reference-only`,
  `external` o `absent`; superficie propietaria; secuencia de efectos, recuperación, silencio y
  límites vivos.
- **`TutorContent`:** momento, contexto, texto `Ahora`/`Criterio`, enfoques aplicables y referencias de
  `Fundamento`; no contiene fixtures ni estado de UI.
- **`TutorScenario`:** fixture o recorrido, expectativas de intervención/silencio, accesibilidad y
  condición de prueba; no duplica copy ni autoridad.

Una capacidad `absent` entra al descriptor únicamente para impedir promesas y no obtiene acción ni
contenido promocional. El gate cruza los tres registros y exige contenido/escenario solo cuando la
conducta declarada lo necesita.

Los catálogos existentes —acciones contextuales, paleta, toolbar, Inspector, árbol, OPL,
diagnóstico, simulación y persistencia— alimentan un gate de cobertura. Añadir una acción semántica
visible sin clasificarla hace fallar el gate. Los botones puramente operativos se registran como
exentos con razón; no se pretende descubrir JSX por heurística.

### 11.5 Frontera honesta de capacidad

| Estado | Capacidad | Conducta del tutor |
| --- | --- | --- |
| `live` con límite | Edición OPL inversa, razonamiento estructural, anclaje y simulación numérica | Usa el resultado real de preview/consulta/firma/muestreo. No amplía por copy la gramática, la lógica, el contenido sincronizado ni la dinámica que el kernel soporta. `AI Text` no se anuncia mientras siga deshabilitado. |
| `live-read` | Vista genérica cargada/creada por canales que ya la soportan | Explica que navega y no emite OPL; la UI no ofrece crearla si no tiene entrypoint vivo. |
| `reference-only` | Out-zoom/abstracción automática; abanico probabilístico declarado con pesos pendientes (`R-FAN-PROB-1`, caso C) | Puede abrir fundamento conceptual; no muestra un botón ni simula disponibilidad. En el abanico distingue caso B/C y aclara que el uniforme usado al simular no persiste pesos. |
| `external` | PDF real, diff visual de modelos/versiones, merge multiusuario, co-simulación federada, inferencia OPM automática | Explica el límite cuando sea pertinente y ofrece solo exportes/operaciones realmente vivos. |
| `absent` | Degradar Modelo→Apunte, desadoptar sin borrar, graduación que repara/adopta, certificación automática | No aparece como acción. El tutor nunca la insinúa en copy. |

“Completo” significa que no queda una acción semántica viva sin clasificación, una transición sin
consecuencia explícita, una regla citada sin dueño ni una fuente viva fuera del inventario.

## 12. Accesibilidad, rendimiento y privacidad

- Flujo completo por teclado: la acción expande el editor, foco al campo, `Esc` cancela y devuelve el
  foco al disparador; `Enter` confirma solo cuando el formulario es válido.
- Editor con nombre accesible, descripción asociada, error anunciado y orden de foco estable.
- Confirmaciones no críticas mediante región `aria-live`; nunca color como único portador.
- Tap targets y disposición compatibles con el modo móvil vigente; si móvil es read-only, la ayuda
  explica sin ofrecer una mutación imposible.
- Sin animación obligatoria y respeto a `prefers-reduced-motion`.
- Política pura y lookup indexado; ninguna exploración del corpus por interacción.
- Cero llamadas de red, telemetría o LLM **propias del tutor**. El corpus necesario viaja en el
  build; guardar, cargar, drift y revisión conservan las llamadas explícitas del producto.
- `preguntaGuia` y la ficha que el operador escriba pertenecen al modelo, se exportan de forma
  visible y siguen su régimen de persistencia; el estado de experiencia queda local al navegador.

## 13. Verificación y leyes de producto

### 13.1 Cortes 1A/1B — refinamiento icónico

- Iniciar cada gesto no muta modelo ni undo.
- Blanco/espacios mantiene deshabilitada la confirmación.
- Descomponer y desplegar crean OPD + vínculo + pregunta; adoptar confirma adoptante, tipo, relación
  cuando aplica y pregunta sobre el OPD existente. Cada gesto cruza un solo commit y ningún slot queda
  con modalidad implícita.
- Un undo de creación revierte OPD, vínculo y pregunta; uno de adopción devuelve el OPD al Taller y
  restaura su pregunta previa. Redo restaura el resultado confirmado.
- Editar o añadir una pregunta cruza un commit propio; cancelar no muta, undo restaura el valor
  anterior/ausencia y redo recupera el nuevo.
- Export→hydrate conserva `preguntaGuia`; legacy sin campo carga y exporta sin materializarlo.
- Dos modelos que solo difieren en `preguntaGuia` producen OPL idéntico; el refinamiento mismo sí
  puede cambiar el bloque OPL.
- Navegar legacy es no bloqueante.
- `Esc`, foco, lector de pantalla y viewport estrecho cumplen el contrato.
- Mouse, atajos, menú contextual, `Ctrl+K` y ambos menús de adopción atraviesan el mismo gateway:
  ningún entrypoint puede crear un refinamiento sin la declaración completa.
- Cortar/Pegar solo reordena hermanos. Reparentar actualiza árbol, slot semántico y pregunta por el
  gateway convergente o permanece indisponible.
- En mobile read-only (390×844) la pregunta se puede leer y no aparece una acción imposible. En los
  viewports editables mínimos (640×800) y desktop compacto (1280×720), el editor no tapa
  simultáneamente selección y OPL.
- Los Cortes 1A/1B absorben o suprimen los mensajes de éxito existentes de descomponer, desplegar y adoptar para
  el mismo `resultId`: el estado resultante es la confirmación. No introduce toast, flash ni
  diagnóstico nuevo para esos resultados.

### 13.2 Motor y corpus

- Para todo snapshot de fixtures, el motor produce exactamente una variante y, por `intentId` o
  `resultId`, como máximo una intervención contextual visible.
- La salida es determinista y estable ante permutación de enfoques equivalentes.
- Duplicar una perspectiva es idempotente.
- Toda entrada de contenido cita al menos una fuente registrada y propietaria.
- Toda ruta/ancla existe; toda fuente viva enumerada entra al manifiesto.
- Ninguna intervención promete una acción ausente en el producto.
- Los hallazgos persistentes no se duplican fuera de `PanelDiagnostico`.
- Un estado persistente no relacionado puede coexistir pasivamente; compartir el mismo resultado
  obliga a deduplicar tutor, flash y CTA.
- Cada variante de snapshot demuestra que no recibe campos ajenos; no existe payload genérico de
  capacidad ni lectura implícita de storage.

### 13.3 Ciclo, ejes y efectos

- Adoptar conserva rigor y rol; undo devuelve el OPD al Taller con la identidad y pregunta previas.
- Graduar conserva entidades, estados, enlaces, OPDs y OPL; solo cambia rigor y los metadatos de
  nombre/carpeta elegidos. Nombre no vacío y destino explícito se validan antes; un fallo remoto o de
  índice conserva íntegro el Apunte y entrega recuperación. No adopta, repara ni certifica.
- Marcar un Apunte como Biblioteca exige una consecuencia explícita de rigor+rol; una Biblioteca no
  se rotula válida, canónica ni certificada.
- La transición Apunte→Biblioteca reutiliza issues navegables, nombre y destino de graduación; con
  bloqueos permite decisión humana explícita y ante fallo recupera el Apunte completo.
- Marcar no abre; abrir activa solo lectura; editar cambia la guardia sin quitar rol; desmarcar vuelve
  siempre a `(Modelo, Trabajo)`, nunca a Apunte.
- Quitar un refinamiento anuncia y prueba eliminación del subárbol; nunca se describe como
  desadopción ni out-zoom.
- Cobertura de requisito nunca se presenta como evidencia externa de satisfacción.
- Una derivación de impacto o coherencia declara su alcance: la firma de frontera es condición
  necesaria, no equivalencia conductual suficiente.
- Simulación conceptual no se llama ejecución real; simulación numérica no se presenta como dinámica
  de procesos, colas, capacidad o rendimiento.
- `Current` declarado persiste y, si existe, inicia el runner; el current de runtime no persiste. El
  fallback `default → initial → primero estable`, la cardinalidad y la incompatibilidad de ambas
  marcas sobre un mismo estado se prueban y explican.
- `Re-sincronizar` actualiza la firma base y conserva el contenido local; `Soltar` pierde vigilancia y
  declara su recuperación inmediata real.
- Una sugerencia de interfaz compartida no acredita equivalencia; mapeos irresolubles o integridad
  rota bloquean la transacción, mientras un conflicto de linealidad queda como mejora metodológica
  navegable y no impide componer.
- Restaurar versión crea copia. Importar en pestaña activa declara reemplazo y reinicio de historial;
  importar en pestaña nueva abre otro workspace sin reemplazar. Exportar no se presenta como
  validación.
- Una revisión entrante, drift o evidencia nueva no muta el modelo sin aceptación explícita.
- Cancelar UI transitoria es identidad; mutaciones de modelo cruzan un commit; efectos de workspace y
  externos pasan pruebas de consecuencia, recibo y recuperación aplicable.
- Ficha local sin procedencia normaliza trim, vacíos, enums y tipos; no se materializa en legacy y
  participa en undo/redo. Con procedencia no existe ficha paralela: el roundtrip upstream se habilita
  solo tras probar proto→compilador→bundle.

### 13.4 Gates por corte

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

### Corte 1A — pregunta que gobierna la descomposición

Roundtrip de `preguntaGuia`, intento transitorio, descomposición top-down, commit/undo atómicos,
cabecera OPD y compatibilidad legacy. Absorbe el flash duplicado del resultado. La regeneración OPL
vigente basta; no se construye un subsistema de diff.

### Corte 1B — despliegue y adopción sin significado implícito

Añade las cuatro relaciones de unfold y el gateway completo de adopción: adoptante, tipo, relación
cuando aplica y pregunta. Cubre ambos menús, elimina el default legacy en UI y restringe Cortar/Pegar
a hermanos hasta que reparentar converja por `establecerRefinamiento`. Cierra con identidad
padre↔slot↔OPD↔pregunta y undo íntegro.

### Corte 2A — propiedad y deduplicación por intención

Extrae base mínima, un segundo snapshot real, prioridad por `intentId/resultId` y supresión
tutor/flash del mismo resultado. Un diagnóstico persistente no relacionado sigue visible. Todavía no
existe registro universal.

### Corte 2B — Apunte y Taller comprensibles

Régimen de issues en Apunte, Taller como integración y copy adoptar≠graduar, con navegación al hecho.
El gesto no cambia rigor ni rol y el modelo sigue usable al cerrar el corte.

### Corte 2C — graduación recuperable

Nombre no vacío, decisión explícita de destino, issues navegables, secuencia compuesta sin estado
parcial y recibo/reintento ante fallo. Verifica que los hechos y OPDs sueltos no cambian.

### Corte 2D — rol Biblioteca y guardia de apertura

Transiciones legales de rigor/rol, marcar sin abrir, apertura solo lectura, edición consciente y
desmarcado a Modelo de Trabajo. Incluye el caso combinado desde Apunte con la misma proyección de
graduación, identidad/destino y recuperación, más todos sus no-cambios.

### Corte 3A — entrada y ficha local

Elección simétrica SD-first/Taller y `FichaTrabajo` progresiva solo para modelos sin procedencia, con
normalización, roundtrip y undo/redo. El modelo puede continuar sin completar la ficha.

### Corte 3B — cosas, propiedades y estados

Objetos/procesos, esencia/afiliación/metadatos y estados `initial/final/default/Current`, incluida la
separación declarado/runtime y su consecuencia en simulación. Cada familia entrega decisión → acción
→ eco OPL → diagnóstico aplicable.

### Corte 3C — enlaces, control y refinamiento avanzado

Transformadores, habilitadores, estructurales, multiplicidad, abanicos, rutas y excepciones. Declara
como referencia programada el caso C probabilístico; no persiste pesos inventados.

### Corte 3D — requisitos y vocabulario organizacional

Requisito, evidencia y cobertura se separan; términos/sinónimos se presentan como normalización
léxica con el efecto vivo exacto. No se infieren ni certifican verdades del dominio.

### Corte 4A — OPL legible y reparación honesta

Delta OPL real, previsualización por línea y ruta de reparación. No amplía el parser reverse como
efecto colateral: guía al canvas cuando la inversa no existe.

### Corte 4B — diagnóstico, búsqueda y razonamiento

Foco issue→superficie, recomputación reactiva con anuncio del delta, mapa/tabla y consultas de
impacto/coherencia con límites explícitos. Toda derivación se rotula estructural, no causal ni
empírica; no se añade un botón manual de revalidación.

### Corte 5A — simulación conceptual

Preflight, explicación de bloqueo/paso/decisión, estado `current` y retorno al hecho. La reproducción
fluida permanece silenciosa.

### Corte 5B — simulación numérica

Parámetros y CSV con alcance exacto de muestreo de atributos; no promete dinámica de procesos,
colas, capacidad, rendimiento ni evidencia real.

### Corte 6A — Piezas y Anclaje

Estereotipos/Piezas, Calcar/Anclar/drift, resincronizar y soltar. Verifica independencia, firma base,
contenido local preservado y recuperación inmediata real.

### Corte 6B — submodelos y composición

Referencia solo lectura frente a integración, interfaz compartida, sugerencia heurística rotulada y
linealidad como mejora metodológica no bloqueante. Prueba precondiciones de integridad, procedencia,
contenido incorporado y reversibilidad.

### Corte 7A — evidencia, re-elicitación y ficha upstream

Despacho estricto entre nota, ledger externo, ancla normativa y el estado upstream `[RATIFICAR]`; contexto/log para
`modelamiento-opm`; mapeo explícito ficha proto→compilador→bundle y lectura propietaria upstream. No
crea una segunda ficha local.

### Corte 7B — revisión, historia e intercambio

Revisión entrante, versiones, importación activa/nueva, guardar como, exportes y recibos. Cada
entrypoint prueba su secuencia de efectos, destino, reemplazo aplicable y recuperación.

### Corte 7C — corpus completo y descubrimiento

Enfoques explícitos, manifiesto de todas las fuentes, `Ctrl+K`, descriptores/contenidos/escenarios y
auditoría de acciones vivas, silencios, exenciones y capacidades no vivas.

Cada corte debe ser usable, recuperable y verificable por sí mismo. El siguiente no compensa un loop
abierto del anterior. Las líneas pueden preparar contenidos, inventarios y tests en paralelo solo si
no editan el mismo seam; modelo/store/UI de una rebanada se integran secuencialmente.

## 15. Definición de terminado

El sistema está completo cuando:

- todo gesto semántico vivo está clasificado o marcado como silencio deliberado;
- las cinco fuentes propietarias, con la lente categorial restringida a explicación, y todo manual/cheatsheet vivo
  están inventariados y accesibles;
- ninguna cita, ancla o capacidad expuesta está rota;
- existe como máximo una voz contextual por intención/resultado y el diagnóstico no se duplica;
- `preguntaGuia`, ficha y enfoques hacen roundtrip, con compatibilidad legacy;
- cada mutación tutorizada del documento es atómica y undoable; cada efecto de workspace o externo
  declara y prueba su recuperación real;
- los tres ejes, el ciclo de remodelamiento y las separaciones adoptar/graduar/componer/anclar están
  cubiertos por regresiones de producto;
- capacidades `reference-only`, externas o ausentes nunca aparecen como acciones vivas;
- el recorrido esencial funciona con teclado, lector de pantalla, móvil aplicable y movimiento
  reducido;
- el tutor no añade red, LLM ni inferencia léxica de dominio;
- pruebas unitarias, integración, diseño y recorrido in-vivo están verdes.

## 16. No objetivos

- Generar contenido OPM, responder por el dueño del dominio o calificar automáticamente la calidad
  conceptual de una pregunta.
- Ingerir automáticamente documentos, descubrir o ratificar verdad de dominio, validar adecuación de
  stakeholder o convertir evidencia externa en hechos sin decisión humana.
- Ejecutar la intervención modelada, medir adopción del sistema real, operar telemetría/colas o
  acreditar retiro por archivar un modelo.
- Introducir chat, avatar, gamificación, tours obligatorios o selector básico/avanzado.
- Reemplazar `PanelDiagnostico`, el manual, las cheatsheets o las SSOT.
- Convertir la Biblioteca, un requisito cubierto, una simulación o un export en sello de calidad.
- Prometer coedición, merge automático, PDF, diff visual, inferencia general o generación por IA.
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
