# Solicitud a custodio-kora — estereotipos y vitrinas: R-VIS-STEREO-1 (SSOT visual) + capacidad en la skill

**Fecha:** 2026-06-22 · **De:** compuesto opforja (deep-opm-pro) · **Para:** custodio-kora (kora-pneuma)
**Origen:** entregable **D6** del compuesto (spec `docs/superpowers/specs/2026-06-22-compuesto-opforja-design.md` §3 D6 / roadmap E1).
**Naturaleza:** propuesta — el compuesto **propone** sobre pneuma; la escritura es HITL custodio-kora. kora-pneuma es SSOT inmutable de solo lectura desde el repo; este documento es el working-artifact de la propuesta.

## Contexto: lo implementado en la herramienta (D6.1–D6.4)

opforja ganó un **sistema de estereotipos nativo, 100% propio** (no fork de OpCloud), con paridad-o-superior al `<<Requirement>>` de OpCloud. Cuatro sub-cortes, todos gate-verde y golden HODOM byte-idéntico:

- **D6.1** — `Entidad.estereotipoId?: Id` (reemplaza el legacy `estereotipo?: "requirement"` con adaptador backwards-compat); catálogo aditivo `Modelo.estereotipos?` (hermano de `anclasNormativas`, excluido de `validarModelo` nuclear / conteo OPL / checkers); `requirement` reconstruido como **estereotipo de fábrica**; contrato de import **duro** (un `estereotipoId` que no resuelve a fábrica ni catálogo se rechaza, simétrico a `ordenInzoom`).
- **D6.2** — `Estereotipo.plantilla?` = **plantilla de subgrafo OPM** (cosas+estados+enlaces, con un ancla); motor `injertarEstereotipo` que **clona-e-injerta** identidad fresca (espeja `cloneStereotypeToOpd` + `replaceClonedStereotypeToActualThing`); el ancla clonada recibe el `estereotipoId`.
- **D6.3** — render canvas **`<<Nombre>>`** sobre toda cosa con `estereotipoId` (paleta CODEX, no crimson).
- **D6.4** — **vitrinas**: galería UI agrupada (marcadores / objetos / enlaces / patrones compuestos) con injerto 1-clic + guardar-selección-como-estereotipo.

El estereotipo es **contenido META del autor** (mismo estatuto que `AnclaNormativa`/`NotaMesa`): no emite OPL nuclear, no cuenta como cosa, no altera `validarModelo` nuclear. La **aplicación** a una cosa (`Entidad.estereotipoId`) sí es dato del modelo y se realiza visualmente.

## Petición 1 — `R-VIS-STEREO-1` en `urn:fxsl:kb:spec-forja-opd-es` (SSOT visual/OPD)

Canonizar la realización visual del estereotipo. Texto propuesto (el custodio ajusta forma/numeración):

> **R-VIS-STEREO-1 (realización del estereotipo).** Una cosa OPM puede portar un **estereotipo** — una marca de clasificación de modelado que NO es una primitiva ontológica nueva (un requisito sigue siendo un **objeto OPM estereotipado**, cf. R-4604 del corpus opm-model-app). Realización:
> - **Canvas (DEBE):** la cosa estereotipada rotula su estereotipo como `<<Nombre>>` (doble ángulo) junto a su nombre.
> - **OPL (PUEDE):** la mención del estereotipo en OPL (`«Nombre»`) es opcional; al ser contenido meta, su ausencia del OPL nuclear es conforme y NO altera el conteo ni la bisimetría (roundtrip). opforja v1 lo omite del OPL nuclear deliberadamente.
> - **No hay estereotipos de enlace:** un estereotipo se aplica a cosas (objeto/proceso) o se materializa como **plantilla de subgrafo** injertable (cosas+enlaces reales). Marcar un *enlace* con estereotipo sería una sexta familia de enlace encubierta — **prohibido**.
> - El `propositoDeModelado` del estereotipo es el owner de valor del catálogo (por qué/cuándo usarlo).

Procedencia sugerida: evidencia OpCloud `regFileStereotype{G,NonG}.svg`, `cloneStereotypeToOpd`/`replaceClonedStereotypeToActualThing` (OpmModel), y R-4604 (`docs/reference/opm-model-app/reglas/86-metodologia-requisitos.md`). Espejo recomendado en `reglas-opm-estrictas-es` solo si el custodio juzga que la marca toca validez (no parece: es realización, no regla de bien-formado).

## Petición 2 — capacidad en la skill `urn:kora:artefacto:modelamiento-opm`

Añadir al cuerpo de la skill (o a sus referencias) una nota de capacidad: opforja expone **estereotipos en vitrinas** y un **motor de injerto de plantillas de subgrafo**. El agente que conduce un modelo puede:

- enumerar el catálogo (`enumerarEstereotipos`) y **injertar** un estereotipo (subgrafo reusable) en el OPD activo;
- **capturar** una selección como estereotipo nuevo (`crearEstereotipoDesdeSeleccion`) para reusar un patrón de dominio;
- leer que el estereotipo es meta (no emite OPL, no rompe la bisimetría) y que su realización es `<<Nombre>>` en canvas.

Esto materializa el norte del sueño: el conocedor de dominio cura sus patrones reusables y los reincorpora. El shape exacto lo define el código (`app/src/modelo/estereotipos.ts`, `app/src/modelo/operaciones/injertoEstereotipo.ts`, `app/src/modelo/tipos/extensiones.ts`); la skill lo cita por URN, no lo transcribe.

## Frontera y estado

- **Bestia (`~/kora/...`) = congelada**, no se toca. La doctrina viva se autora en kora-pneuma.
- Mientras la petición 1 no aterrice, R-VIS-STEREO-1 vive como **realización declarada** en este working-artifact + el manual del repo (`docs/manual-opforja.md`, citado por URN); la cadena de precedencia (reglas > spec-opd > ui-forja > impl) se respeta: la herramienta NO inventa regla de validez, solo realiza visualmente una marca meta.
- **Catálogo multi-ámbito / permisos** (gestión OpCloud de scopes y permisos de estereotipos) = **paridad declarada-no-implementada** (fuera del alcance de D6, por valor).

## Verificación de cierre (cuando se aplique)

`kora check --strict` verde tras añadir R-VIS-STEREO-1 a `spec-forja-opd-es`; el puente `docs/canon-opm/spec-forja-opd.md` y el `resolutor-urn.json` resuelven el URN actualizado; el manual del repo cita R-VIS-STEREO-1 sin transcribirlo.
