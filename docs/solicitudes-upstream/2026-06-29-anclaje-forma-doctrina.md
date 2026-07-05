# Solicitud a custodio-kora — forma del Anclaje: realización visual/OPL + límites (working-artifact)

**Fecha:** 2026-06-29 · **De:** compuesto opforja (deep-opm-pro) · **Para:** custodio-kora (kora-pneuma)
**Origen:** corte "gesto de anclar / PUERTA" (spec `docs/superpowers/specs/2026-06-29-gesto-anclar-puerta-design.md` §3). Bloque **B6**.
**Naturaleza:** **propuesta** — el compuesto PROPONE sobre pneuma; la escritura es HITL custodio-kora. Análogo a `R-VIS-STEREO-1` (estereotipos, `2026-06-22-estereotipos-vitrinas-ssot-skill.md`). kora-pneuma es SSOT inmutable de solo lectura desde el repo; este documento es el working-artifact. **No introduce regla de validez en código ni SSOT** — eleva la doctrina; la herramienta realiza una marca meta declarada mientras la petición no aterriza.

> **RESUELTA 2026-07-06 (despacho HITL custodio-kora).** Petición 1 canonizada como **`R-OPD-ROT-9`** en `spec-forja-opd-es` **v1.2.0** (el esquema de IDs de la spec es `R-OPD-*`; ROT-8 ya existía), con un ajuste sobre el borrador: el bullet de `frozenAtHash` se generalizó para incluir el **grano por Pieza** (`frozenAtPieza`, vecindad RADIO-1 — C4 se desplegó después de redactada esta solicitud). Petición 2 **legislada: vista B (laxa)** — una cosa anclada PUEDE editar su esencia localmente; la divergencia no se bloquea, el Centinela la hace visible como drift; el rigor estricto (view-only + Soltar previo) queda disponible solo como restricción **aditiva** futura. Fundamento del custodio: la vista A empujaría a Soltar prematuramente (irreversible, pierde comparabilidad) y B→A es un camino aditivo mientras A→B rompería contrato. Verificación de cierre: `velar` 12/12; puente/resolutor en v1.2.0; sin espejo en `reglas` (realización, no validez). El verbo de fundación formal sigue **diferido como trabajo** (ya no bloqueado por doctrina).

## Contexto

El frente Anclaje permite que una cosa OPM quede **anclada** (referencia viva) a una **Pieza** de una biblioteca gobernada. El kernel (`anclarAPieza`, Centinela de Drift) está desplegado; este corte construye el **verbo de fundación** en la interfaz (la PUERTA: traer una Pieza y elegir Calcar/Anclar). La realización visual y OPL del Anclaje roza doctrina aún no escrita. Siguiendo el precedente R-VIS-STEREO-1, opforja **realiza la marca como declarada** (no inventa regla de validez) y eleva la doctrina aquí.

## Petición 1 — `R-VIS-ANCLAJE-1` en `urn:fxsl:kb:spec-forja-opd-es` (realización del Anclaje)

Texto propuesto (el custodio ajusta forma/numeración):

> **R-VIS-ANCLAJE-1 (realización del Anclaje).** Una cosa OPM **PUEDE** estar anclada a una **Pieza** de una biblioteca gobernada — una referencia viva que el Centinela de Drift vigila contra la versión viva de la biblioteca. Realización:
> - **Canvas (DEBE):** una cosa anclada porta un **chip de estado** en su esquina, en tres fases — `sincronizado` (marca de amarre, peso mínimo) · `no-resuelto` (`?`) · `divergente` (`⟳`) —, en **TINTA**, jamás crimson. El chip declara "está atada + su salud"; **NO** el nombre de la Pieza (eso vive en el Inspector — división honesta: el lienzo dice *que* está atada y su salud, el Inspector dice *a qué*).
> - **OPL (PUEDE):** el Anclaje **NO emite OPL nuclear** (es contenido meta, mismo estatuto que el estereotipo / `AnclaNormativa`); su ausencia del OPL es conforme y **no altera el conteo ni la bisimetría** (roundtrip).
> - **No muta esencia:** anclar es **view+validate**; una cosa anclada conserva la esencia de su Pieza. Estrictamente **más conservador que OpCloud** (que sí muta esencia vía el estereotipo Sensor).
> - **`frozenAtHash` = referencia-a-snapshot evolutivo:** la cosa anclada congela el hash semántico de la biblioteca al momento de anclar; el Centinela re-leva contra la versión viva (invariante (i) del acta de nominación: base **evolutiva**, no congelada-ciega).

Procedencia sugerida: acta de nominación `docs/auditorias/2026-06-24-acta-nominacion-reuso-tipos-opforja.md` (Calcar/Anclar/Pieza/Soltar; invariantes i-v); kernel `app/src/modelo/operaciones/anclaje.ts`; firma semántica `app/src/modelo/submodelos/firmaSemantica.ts`. Espejo en `reglas-opm-estrictas-es` solo si el custodio juzga que la marca toca validez (no parece: es realización de una marca meta, no regla de bien-formado).

## Petición 2 — pregunta abierta a legislar: ¿edición local de la esencia de una cosa anclada?

¿Una cosa anclada **PUEDE editar su esencia localmente**?
- Hoy el kernel no lo impide; como la firma semántica incluye la esencia, editarla produciría un **drift detectable** → el Centinela avisaría.
- **Opción A (vista estricta):** una cosa anclada es view-only en su esencia; editar exige **Soltar** primero. Más fiel a "Anclar = view".
- **Opción B (vista laxa):** se permite editar; el drift lo refleja como divergencia con la Pieza.
- **opforja v1 realiza B** (no bloquea la edición) como realización declarada; la regla dura es decisión del custodio.

## Frontera y diferimiento

- El **verbo de fundación formal** (`promover-a-Pieza`, registro global gobernado, admin-only — el cuarto actor del acta de nominación) queda **DIFERIDO**. Este corte usa **bibliotecas pragmáticas**: un modelo persistido designado con flag `esBiblioteca`, abierto en **solo-lectura** (editarlo exige confirmación con advertencia), suficiente para el caso real (anclar HODOM a gist). El registro global gobernado y el verbo de fundación son trabajo futuro, atado a esta doctrina.
- **Bestia (`~/kora`) = congelada**, no se toca; la doctrina viva se autora en kora-pneuma.
- Precedencia respetada: `reglas-opm-estrictas > spec-forja-opd > ui-forja > impl`. opforja **NO inventa regla de validez**; realiza una marca meta.

## Verificación de cierre (cuando se aplique)

`kora check --strict` verde tras añadir R-VIS-ANCLAJE-1 a `spec-forja-opd-es`; el puente `docs/canon-opm/spec-forja-opd.md` y el `resolutor-urn.json` resuelven el URN; el manual del repo cita R-VIS-ANCLAJE-1 sin transcribirlo.
