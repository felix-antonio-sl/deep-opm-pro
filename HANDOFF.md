# OpForja rehecho — tablero

Rama `rehacer`. Pasos 1+2 publicados en `26935f4`, verificados HEAD/origin/remoto y árbol limpio por dirección; este tablero distingue historia, correcciones activas y próximos hitos.
[Bitácora íntegra](docs/rehacer/bitacora.md) · [Decisiones 1–32](docs/rehacer/DECISIONS.md) · [Dictamen externo](docs/rehacer/evaluacion/dictamen-e53fb47.md) · [Plan](docs/rehacer/plan/README.md).

## Autoridad textual del pedido actual

> «Retoma opforja rehecho en ~/projects/deep-opm-pro, rama rehacer. Haz git pull --ff-only origin rehacer: el HEAD debe ser e287ba9 o posterior.»
> «Decisión 29: alinea DESIGN §5.3.1 y §6.3 y el código con la versión anterior de los abanicos. Un abanico se forma solo con un extremo común en el borde de la cosa, nunca en un estado. Retira FANLOCAL, B-31 y B-33, la búsqueda de empaquetado y los vértices. escena() y los exports nunca lanzan con un modelo válido. Vuelve a verde regenerando los golden con exportaciones genuinas, y mira cada SVG cambiado.»
> «Decisión 30: mueve el HANDOFF.md actual íntegro a docs/rehacer/bitacora.md y crea un HANDOFF.md de una página (tablero de paquetes, decisiones abiertas, siguiente paso). Reescribe docs/conformidad.md en el formato de DESIGN §11.3, tres líneas por fila como máximo.»
> «Un commit semántico por paso, siempre con check verde, y push a origin/rehacer. Revisión una vez por ola, contra el canon y con modelos reales. Detente solo en H2, en H3 o ante una contradicción real del contrato. Toda autorización tiene que ser una frase textual mía. Sin despliegue, sin producción, sin migración real, sin merge a main, sin leer .env ni credenciales.»
> «unamos 1  o 2 en un solo commit»
> «Decisiones 31 y 32: implementa DESIGN §4.6 pasos 2 y 4 tal como están escritos, con pruebas para cada celda de la Tabla 27.»

La cita es del mensaje directo del dueño transmitido íntegro por dirección en el turno actual; ID/fecha del mensaje no expuestos. Commit/push quedan condicionados a check verde. Dirección posee Git; una sola escritora realiza el paso activo.

## Paquetes e hitos

| Grupo | Estado actual |
|---|---|
| WP-0/1/2/4p/6/8a/11/3a/3b/5/7 | Cierres históricos publicados; evidencia en bitácora, sin recertificación por este tablero. |
| WP-8b / WP-4r | Publicados `31ea8ad` / `f4e16b8`; los hallazgos posteriores siguen activos. |
| Corte gráfico | Publicado `e53fb47` con reserva: check 1864/25, TSC 0, exit 1. No aceptado como producto verde. |
| WP-18 | Redacción histórica realizada; imagen Docker pendiente tras WP-14 y de permiso operativo. |
| WP-9 (VAL) / WP-13 / H2 | Pendientes, después de las correcciones y check verde; H2 exige inversa/editor/roundtrip real. |
| WP-10/12/14/15/16/17/19 / H3 | Pendientes en el orden solicitado; H3 exige suite/e2e/build y revisión de modelos reales. |

## Decisiones resueltas — no abiertas

- DEC 29: «Abanicos como en la versión anterior de opforja»; extremo común en borde de cosa, estados no comunes conservados. Retira FANLOCAL/B-31/B-33, búsqueda de empaquetado y propuesta de vértices; escena/export no lanzan con modelo válido. Realización publicada en `26935f4`; aceptación global de ola pendiente.
- DEC 30: «Protocolo ligero»; historia íntegra a bitácora, tablero de una página, conformidad compacta y una revisión por ola.
- DEC 31: «Precedencia al abstraer según ISO 19450 (Tabla 27, §14.2.4.1.1)»; C→R y R→C dan efecto, C→efecto y efecto→R inválidos. Paso 3: realización y check integrado verdes (1830/0, TSC 0, exit 0).
- DEC 32: «Un enlace interno a un refinamiento no se ve en el padre» («cámbialo por supuesto»), también si el tipo admite reflexivo. Paso 3: realización y check integrado verdes (1830/0, TSC 0, exit 0).

## Paso activo y siguiente paso

| Paso | Resultado requerido / estado |
|---|---|
| 1 · Documentación | HANDOFF original íntegro al inicio de bitácora; tablero y conformidad compactados. Preservación íntegra comprobada; publicado junto al paso 2 en `26935f4`. |
| 2 · DEC 29 | Alinear DESIGN/abanicos con la versión anterior; retirar locales/radios/búsqueda/vértices, import con informe y export sin excepción; check nuevo 1765/0, TSC 0, exit 0; golden 106/0. 94 exportados genuinos, 6 dibujos diagnosticados y 4 contenedores rechazados; 54 SVG cambiados observados individualmente (27+27). |
| 3 · DEC 31–32 | Internas elevadas ocultas y Tabla 27 temporal; nueve celdas × inversión de claves, paralelas/anidadas, DS16, controles/costo/memo. Focal DS16 367/0 y LF-03 251/0, golden 106/0; dos SVG cambiados mirados 1×/2×; check final 1830/0, TSC 0, exit 0. |
| 4 · Dictamen | Reparar S2–S7/G1–G5 y reservas §6: B-33, coherencia B-32/registro y T-ID. Pendiente; retiros DEC 29 realizados en paso 2; defectos semánticos/gráficos restantes sin cierre. |
| 5 · Plan | Con check verde: WP-9 (VAL) → WP-13 → H2 → WP-10 → WP-12 → WP-14 → WP-15 → WP-16 → WP-17 → WP-19 → H3. |

## Asuntos abiertos y condición para continuar

- Unidad del primer commit resuelta por la respuesta literal anterior: en el contexto de las dos alternativas, une pasos 1+2 en el primer commit GREEN. ID/fecha originales no expuestos; no autoriza commit rojo ni amplía el alcance.
- WP-18: permiso Docker futuro, cuando corresponda; no se reabre infraestructura ni migración/despliegue real.
- Siguiente acción: publicar paso 3 GREEN por dirección; paso 4 sólo tras publicación/relevo. Fuente y capturas quietas; cero runners propios. Una revisión correctiva al cierre de la ola 2–4.

Pasos 2–3 quedan quietos. Reservas para paso 4: trazo sobre rutas/Registro/estado vecino y puntas cercanas a otra cápsula (B-15/G2/G5); no se introduce reruteo. Async no tenía abanicos: descartado vacío, ocho R-ROL ya basales y todos los enlaces conservados; se corrige la inferencia inicial de diagnósticos nuevos. Resultados y observación por SVG en `/tmp/opforja-rehacer/reanudacion-decisiones29/paso2/`.
