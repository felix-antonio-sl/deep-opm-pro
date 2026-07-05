# Solicitud a custodio-kora — D3: re-sync skill `modelamiento-opm` a versiones vivas + bump v1.11.0 + bloque «Límites de la mesa»

**Fecha:** 2026-06-24 · **De:** compuesto opforja (deep-opm-pro) · **Para:** custodio-kora (kora-pneuma)
**Origen:** corte **D3 / D-SKILL** del compuesto (spec `docs/superpowers/specs/2026-06-22-compuesto-opforja-design.md` §5.1; roadmap `docs/roadmap/cortes.md` «C-skill (D3)»).
**Naturaleza:** propuesta. La skill es SSOT read-only desde el repo; el compuesto **propone**, la escritura es HITL custodio-kora.

> **RESUELTA 2026-07-06 (despacho HITL custodio-kora).** Skill `modelamiento-opm` **v1.11.0** (base real 1.10.1 — el 2026-07-05 una corrección absorbió el último delta bestia). Petición 1: anclaje canónico con versiones vivas adjuntas **post-doctrina** (reglas **1.4.1** · opd **1.2.0** —la enmienda R-OPD-ROT-6/ROT-9 del mismo despacho— · opl **1.2.2** · metodología **1.5.1**) + nota del resolutor vivo. Petición 2: bump y re-emisión (`kora.py transmutar`) a los 3 runtimes, sellos idénticos (`hash-fuente sha256:1445de4a…`). Petición 3 (lectura): el cuerpo no citaba versiones inline; **deuda real encontrada y corregida**: la tabla de capacidades citaba el «dock de biblioteca» retirado por la PUERTA — reemplazada por superficie «Piezas» + filas nuevas (estereotipos D6, Anclaje/Centinela). Petición 4: sección «Límites de la mesa» añadida con el bullet gist-anchor **corregido** contra el estado vigente (anclar/Calcar/Centinela desplegados; faltan `promover-a-Pieza`, C6/C7, resolución externa completa, C9/C10). Cierre en deep-opm-pro: `CORDON_SKILL_ESPERADO` → v1.11.0 + hash nuevo; `cordon:skill` **OK**; `velar` 12/12.

> **Actualización 2026-06-30 (re-secuencia de versión).** El `v1.10.0` originalmente
> pedido aquí **lo tomó el corte «modo apunte»** (portado a pneuma + re-emitido el
> 2026-06-30; sello v1.10.0 con `§Regimen apunte` + Regla Dura #28). Esta solicitud D3
> se re-numera a **`v1.11.0`**. Además, el bloque «Límites de la mesa» (Petición 4)
> quedó **parcialmente obsoleto**: el bullet de *anclaje referencial cross-modelo
> (gist-anchor)* como «en diseño, no implementado / hoy hay Plantilla/Template, no
> anchor vivo» ya **no es cierto** — el gesto de anclar (la PUERTA) y C4 (drift granular
> a nivel de pieza) se desplegaron el 2026-06-30. Revisar ese bloque contra el estado
> vigente (`docs/HANDOFF.md`) antes de aplicarlo.

## Contexto verificado (2026-06-24)

La skill desplegada `~/.claude/skills/modelamiento-opm/SKILL.md` está en `version: 1.9.0` (sello del cuerpo). Su tabla de **anclaje canónico** cita los 4 URNs de la SSOT forja **sin versión adjunta**. Las versiones **vivas** en pneuma (según `docs/canon-opm/resolutor-urn.json`, observadas) son:

| URN | Versión viva (pneuma) |
|---|---|
| `urn:fxsl:kb:reglas-opm-estrictas-es` | **1.4.1** |
| `urn:fxsl:kb:spec-forja-opd-es` | **1.1.2** |
| `urn:fxsl:kb:spec-forja-opl-es` | **1.2.2** |
| `urn:fxsl:kb:metodologia-forja-opm-es` | **1.5.1** |

El cuerpo de la skill tiene una sección **«Qué NO hace la app por la skill»** (división de labor app↔skill), pero **no** un bloque **«Límites de la mesa»** (frontera de capacidad del sistema de trabajo). Son distintos.

## Petición 1 — re-sincronizar la procedencia (`fuente:` / anclaje canónico) a versiones vivas

Adjuntar a cada URN del anclaje canónico la versión viva que la skill consulta hoy: reglas **1.4.1** · opd **1.1.2** · opl **1.2.2** · metodología **1.5.1**. Formato a criterio del custodio (sufijo `(vX.Y.Z)` o columna «versión»). Esto hace legible, en el deploy, contra qué versión de la SSOT se modeló — el testigo que el corte C1 del cordón ya consume del sello.

## Petición 2 — bump de la skill a `v1.11.0`

`version: 1.10.0 → 1.11.0` en el sello (la base ya **no** es 1.9.0: el corte «modo apunte» llevó la fuente a v1.10.0 el 2026-06-30). Cambio menor aditivo (re-sync + bloque nuevo, sin reescritura del método). `hash-fuente` se recalcula en la re-emisión.

## Petición 3 — confirmar (NO reescribir) la alineación del cuerpo con la SSOT viva

Leer las 4 SSOT en sus versiones vivas y **confirmar** que el cuerpo de la skill sigue alineado; reportar deuda si algún pasaje describe comportamiento de una versión anterior. **Acción de lectura, no reescritura masiva** — el método de la mesa no cambia en D3.

## Petición 4 — añadir bloque «Límites de la mesa» (frontera de capacidad)

Nuevo bloque que declare explícitamente lo que la **mesa** (la skill conduciendo opforja como sistema de trabajo) **NO** puede hacer hoy, para que el agente que la ejerce no prometa lo imposible. Contenido propuesto (el custodio ajusta forma):

> **Límites de la mesa (capacidad, 2026-06-24).** opforja como mesa de la skill **no** soporta hoy:
> - **out-zoom automático** (descomposición reversa generada): el in-zoom se declara; el out-zoom es manual.
> - **diff de modelos / versiones** (comparación estructural visual): `diff.ts` fue retirado como cola colgante.
> - **export a PDF real**: `pdf.ts` retirado; la exportación canónica es Markdown determinista (`emitirDocumentoCanonico`).
> - **cosimulación / co-simulación numérica avanzada** (techo T2 / F-D4): la simulación es de un modelo, no co-simulación federada.
> - **federación de modelos** (techo T3) y **multiusuario concurrente por modelo** (techo T1).
> - **razonamiento / inferencia automática** OWL-DL u OPM (techo T4): la mesa modela y valida, no infiere.
> - **anclaje referencial cross-modelo** (gist-anchor / Stereotype real, fibración): **en diseño, no implementado** (bloqueado por doctrina + consenso de alcance + greda-bundle). Hoy hay **Plantilla/Template** (D6, copia desacoplada), no anchor vivo.
>
> Esto es frontera de **capacidad de la mesa**, distinta de «Qué NO hace la app por la skill» (división de labor: la app no aporta semántica de dominio; eso lo trae la skill).

## Nota de gobernanza

El check **version-match** del cordón (C1) vive **en deep-opm-pro** (`app/scripts/cordon-skill-audit.ts`, ya implementado 2026-06-24, lee el `version` del sello del deploy) — **NO** es un 14º check de `velar` en pneuma. D3 solo re-sincroniza el contenido de la skill; el testigo de versión es del consumidor.

## Verificación de cierre (cuando se aplique)

Tras la re-emisión: el sello del deploy declara `version: 1.11.0` (re-secuenciado 2026-06-30, ver nota de Actualización arriba — el modo apunte tomó v1.10.0); el anclaje canónico cita las 4 versiones vivas; existe el bloque «Límites de la mesa». En deep-opm-pro, actualizar `CORDON_SKILL_ESPERADO` (`app/src/canon/selloSkill.ts`) a `v1.11.0` + nuevo `hash-fuente` — el gate `cordon:skill` rompe si el deploy queda en `v1.10.0` (deploy stale), forzando la actualización consciente.
