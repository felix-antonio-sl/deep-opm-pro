# Notas de aprendizaje — invocación implícita bimodal (Fase 1)

Lecciones del frente R-INV-2B vs M23 (campo `Opd.ordenInzoom`). Una lección por sección, con resumen de una línea. Actualizar, no duplicar; borrar lo que resulte falso.

## La gramática del doble rol de «y» es inequívoca SOLO con nombres atómicos
**Resumen:** el reverse de bandas (U4) parsea bien el doble rol de «y» cuando los nombres no contienen separadores, pero la superficie OPL es **fundamentalmente ambigua** si un nombre lleva « y »/«,» o empieza por «paralelo».

Dirigido por el marcador `paralelo`: `listarOpl` emite UN «y» por banda paralela (antes del último nombre); `listarSecuenciaTemporal` usa «y» de secuencia solo entre las dos últimas bandas (3+). Para nombres atómicos, `paralelo A, B y C, D y E` tiene un único parse `[[A,B,C],[D],[E]]`. PERO con un subproceso «Cargar y Validar» el split rompe el nombre y, si los trozos coinciden con otros subprocesos, produce **corrupción silenciosa** (ids duplicados/perdidos) — el riesgo §6 «falso verde». Lección: tokenizar por separadores SIN conocer los nombres reales es inseguro; la grieta solo se cierra con la verificación por inversa (siguiente nota). Lo cazó un verificador adversarial de contexto fresco, no el camino feliz.

## Verificar por inversa cuando la gramática de reverse puede ser ambigua
**Resumen:** si el forward es determinista pero su inverso puede malinterpretar, no parsees más astuto: re-emite lo resuelto y compáralo con la entrada; si difiere, rechaza ruidosamente.

U4: tras resolver las bandas a ids, `planificarOrdenInzoom` re-emite el texto temporal con LA MISMA lógica forward (`listarSecuenciaTemporal`+`listarOpl`+`nombreOpl`, exportadas para no derivar) y lo compara (normalizado) con el texto original capturado por el parser. Si no coincide ⇒ `warning` + sin patch (el campo queda intacto). Convierte toda corrupción/pérdida en un no-op VISIBLE, sin falsos positivos en nombres atómicos. Reusar las funciones del forward (no reimplementarlas) hace imposible el drift. Patrón general para cualquier reverse de bisimetría con ambigüedad estructural.

## Una ley de regresión solo vale si fallaría ante la regresión que pretende cazar
**Resumen:** U7 son leyes sobre comportamiento ya implementado (U2/U3/U4/U6); pasan al primer intento, así que hay que endurecerlas para que no sean tautológicas.

Caso testigo: la ley de equivalencia de flujo de simulación pasaba con geometría consistente con el campo (el plan ordena por Y igual que por el campo). Fix: usar geometría que CONTRADICE el campo, de modo que el resultado correcto solo emerja si el código lee `ordenInzoom`. Mismo principio en la ley de layout (geometría invertida) y la de OPL-compat (geometría revuelta vs banda por Y).

## El campo opcional es fallback golden-safe en CADA modalidad, no solo en una
**Resumen:** sin `ordenInzoom`, layout, OPL forward, simulación y checker deben comportarse idénticos al previo (golden hd-opm byte-safe).

Verificado por unidad: sin campo, el plan ordena por Y+nombre (U6 idéntico), el OPL agrupa por geometría (`agruparSubprocesosParalelos`, U3), el layout usa `nivelTopologicoInvocacion` (U2), el checker no emite (U5). El comparador/condicional de cada unidad debe degenerar exactamente al comportamiento previo cuando el campo está ausente. Es lo que mantiene el golden byte-idéntico hasta la Fase 3.

## set-orden-inzoom solo sobre refinamiento EXISTENTE → el roundtrip de U7 no parte de vacío
**Resumen:** el reverse setea el campo pero no crea/borra refinamientos (sigue siendo gesto de canvas), así que el roundtrip del campo revierte sobre el modelo con el refinamiento, no desde un modelo vacío.

El harness genérico `roundtrip.test.ts` revierte desde un modelo VACÍO: no sirve para `ordenInzoom` porque la oración de descomposición no recrea los subprocesos dentro del OPD hijo (sus miembros «no se crean», `planificarContexto`). Por eso U7 vive en `leyes/` y revierte sobre el modelo con el refinamiento y el campo limpiado. No añadir fixtures de orden al catálogo genérico: serían imposibles de recuperar.

## Añadir un tipo de patch o de checker rompe switches exhaustivos lejanos
**Resumen:** verificar TODOS los consumidores del union al introducir una variante.

`set-orden-inzoom` (PatchOplPropuesto) rompió `clasificadorEdicion.ts:describirPatch`; `INVOCACION_REDUNDANTE_CON_ORDEN` (CodigoChecker) rompió `diagnosticoSeveridad.ts` (Record exhaustivo). El typecheck los caza, pero conviene grepear los switches/Records exhaustivos al diseñar la variante.

## El AND-join se realiza por orden del plan lineal, sin concurrencia real
**Resumen:** «esperar a toda la banda previa» se satisface poniendo todos los procesos de la banda i antes de los de i+1 en el plan.

La simulación es un único camino secuencial. No hace falta modelar concurrencia: el orden del plan (derivado del campo en U6) hace que la banda i complete antes que la i+1, que es la semántica observable del AND-join síncrono total en un runner de un solo camino.

## El re-pin byte-estable se logra creando-y-borrando, no editando inline (Fase 3)
**Resumen:** retirar enlaces sin renumerar exige crearlos todos (seq intacto) y borrarlos en un post-pase; el diff queda = huecos + campo, sin renumber, y se verifica por contenido semántico, no por líneas.

Los IDs de enlace son `e-${seq++}` (creación secuencial): borrar un `enlazar(...)` inline corre TODOS los IDs siguientes ⇒ diff catastrófico y `nextSeq` distinto. El generador de HODOM en cambio CREA los 41 rayos (el high-water mark del seq es idéntico, `nextSeq` byte-idéntico) y un post-pase (`migrarInvocacionImplicita`) borra la APARICIÓN del rayo redundante en el in-zoom y luego el enlace huérfano. Resultado: solo desaparecen las claves de los rayos retirados; cada superviviente conserva su ID exacto. El oráculo de qué borrar es la regla del checker U5 (banda adyacente `bd===bo+1`) + re-verificación dura con el checker real (`checkInvocacionRedundanteConOrden` == 0). e-21 sobrevive automáticamente: como también aparece en la vista causal, no queda huérfano (solo se le quita la aparición del in-zoom). LECCIÓN de verificación: el diff de TEXTO del JSON es enorme (~1300 líneas) por la expansión pretty-print de los **puertos** de los rayos borrados, pero el diff SEMÁNTICO es exactamente {37 enlaces + sus puertos + 14 `ordenInzoom`, 0 coordenadas, entidades/estados/abanicos/anclas idénticos}. Verificar por contenido, no por `git diff --stat`.

## La invocación condicional (rama XOR) NO entra al campo de orden (Fase 3)
**Resumen:** un subproceso que solo corre bajo condición (gateado por estado/Desenlace XOR) no es paso mandatorio de la banda; su rayo es explícito (caso disyuntivo, R-INV-2D), se conserva.

m2-emerg: Traslado es rama XOR (gateada por `Desenlace[reingreso]`). Meterlo en `ordenInzoom` afirmaría que SIEMPRE corre tras Respuesta (falso: la mayoría se estabiliza en domicilio). Decisión: m2-emerg queda FUERA del campo y su rayo condicional e-177 se conserva (el checker U5 no lo acusa sin campo). Distinguir del AND-join TOTAL (M1.1 4→1, M1.3 3→1: todos convergen SIEMPRE ⇒ implícito, banda paralela). La byte-estabilidad refuerza la decisión: declarar «banda de 2 (eval, respuesta) + traslado fuera» lo empujaría a otra banda (coordenada cambia); excluir m2-emerg ENTERO es byte-estable y conserva e-177. Hermano: un subproceso bi-invocado pero secuencial (M1.3 `educacion`) SÍ entra a su banda — la bi-invocación cross-OPD (e-174) es lo que se conserva, no el rayo intra-OPD (e-97).
