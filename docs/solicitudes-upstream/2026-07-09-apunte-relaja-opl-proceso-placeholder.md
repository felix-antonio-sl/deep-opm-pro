# Enmienda SSOT — el modo apunte relaja R-NOM-PROC-1 en el OPL de display (para firma del custodio)

**Fecha:** 2026-07-09 · **De:** compuesto opforja (deep-opm-pro) · **Para:** custodio-kora (kora-pneuma)
**Naturaleza:** ENTREGABLE AUTOREADO del fix `BUG-20260709T174709Z-76af16` («no se genera OPL de proceso; en modo taller no se forma ningún OPL»).
**Gate de deploy:** el código que relaja R-NOM-PROC-1 en apuntes **no se despliega** hasta que esta enmienda esté firmada y aplicada en pneuma (`kora check --strict` verde). La mesa **eleva ANTES** de compilar; la firma es del custodio (HITL).

> **Cómo aplicar (custodio).** El texto de abajo es el contenido a insertar en la prosa SSOT
> (`reglas-opm-estrictas-es.md` donde vive R-NOM-PROC-1, y/o `spec-forja-opl-es.md §1.1`) en
> `~/kora-pneuma/artefactos/conocimiento/fxsl/`, verificado con `python3 ~/kora-pneuma/kora.py velar`
> + `kora check --strict`. Tras aplicar: re-pinear el puente `docs/canon-opm/spec-forja-opl.md` a la
> versión nueva y, si corresponde, la cita de versión de la skill `modelamiento-opm` (§Régimen apunte).

---

## El bug (síntoma → causa)

Un usuario, en un **apunte** («apuntes HD»), crea un objeto y un proceso. El OPL muestra el objeto pero
**no el proceso**; y bosquejando en el **Taller** (OPDs sueltos) «no se forma ningún OPL». Causa raíz
única: **R-NOM-PROC-1** suprime del OPL todo proceso con nombre **placeholder** (`Proceso`, `Proceso 1`…)
—su existencia **y** sus enlaces—, mientras el objeto placeholder (`Objeto`) sí emite. En un apunte, el
usuario bosqueja procesos sin nombrarlos aún; todos desaparecen del OPL → la **bisimetría canvas↔OPL**
—corazón de opforja— se rompe justo en el modo diseñado para bosquejar.

## Por qué la enmienda es **coherente con la doctrina ya firmada** (no introduce doctrina nueva)

El modo apunte ya está legislado como **especie que relaja el RIGOR, no la semántica**
(`metodologia-forja-opm-es` v1.6.0 A1.5, `spec-forja-opd-es` v1.3.0; validez OPM → observación por-clase,
integridad intacta). R-NOM-PROC-1 es **rigor de nominación de cierre** — exactamente la clase de exigencia
que el apunte suspende. Lo que falta es **nombrar explícitamente** que esa suspensión alcanza a la
generación OPL de display. No se relaja la semántica ni el roundtrip.

## Enmienda propuesta — excepción de apunte a R-NOM-PROC-1

Insertar, junto al enunciado de **R-NOM-PROC-1** (supresión OPL de procesos placeholder):

> **Excepción de apunte (R-NOM-PROC-1-APUNTE).** En una **especie apunte**, R-NOM-PROC-1 **no suprime** el
> OPL: los procesos con nombre placeholder emiten su oración de existencia y sus enlaces en el **OPL de
> display**, preservando la bisimetría canvas↔OPL del bosquejo. La suspensión es **solo de display**: el
> **OPL canónico** (el que alimenta parser, roundtrip e intercambio) se genera **siempre en régimen
> riguroso** (default, sin la relajación), de modo que el roundtrip y la persistencia quedan intactos. El
> **diagnóstico** (`R-NOM-PROC-1`, severidad advertencia/observación por-clase) **sigue emitiéndose**: la
> mesa acompaña sin bloquear e invita a nombrar el proceso con forma verbal. Al **graduar** el apunte a
> modelo, la supresión rigurosa vuelve a aplicar por sí sola (la relajación lee la especie viva).

## Realización en el código (ya implementada, gate verde, NO desplegada)

- `VisibilidadOpl.esApunte?: boolean` (opción de **display**, no del canónico).
- `entidadOplEsEmitible(entidad, esApunte)` / `enlaceOplEsEmitible(…, esApunte)`: en apunte no suprimen el
  placeholder de proceso. Propagado por el generador OPL (`generar.ts`, `procedural.ts`, `estructural.ts`,
  `abanico.ts`).
- `panel.ts`: el pase **canónico** (`textoOplActual`) sigue con `VISIBILIDAD_OPL_DEFAULT`; el pase **display**
  aplica `esApunte`. El `panelOplViewModel` deriva `esApunte` del índice de workspace (como el árbol/canvas).
- Leyes: `src/opl/generar.test.ts` («modo apunte relaja R-NOM-PROC-1…» + el R-NOM-PROC-1 riguroso intacto)
  y e2e `e2e/45-opl-proceso-apunte.spec.ts`. Gate `gate:refactor` PASS: check 3129/0 + smoke 302/0 + ledger 6/6.

## Qué NO cambia

- El **régimen riguroso** (modelos): R-NOM-PROC-1 suprime igual (test `R-NOM-PROC-1 suprime OPL de procesos placeholder` intacto).
- El **OPL canónico / roundtrip / intercambio**: idéntico (el pase canónico ignora `esApunte`).
- La **asimetría ontológica** objeto/proceso en régimen riguroso: se conserva; la excepción es exclusiva del apunte.
