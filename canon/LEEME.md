# Canon local de OpForja

Estos cuatro documentos son la autoridad OPM local. Contienen sólo lo que funda ISO 19450, en español:
desde la versión 2.0.0 se revisaron cláusula por cláusula contra ISO/PAS 19450:2015 (DEC39–DEC45 en
`docs/decisiones.md`). Lo propio de OpForja (producto, extensiones, endurecimientos) vive en `perfil/`.

| Slug | Versión | SHA256 de `content.md` | Plano de autoridad |
|---|---|---|---|
| `reglas-opm-estrictas-es` | 2.0.0 | `26ca831347210b441c98de948aff883ce13ff91597bc0d82bab322eed5d879f9` | Reglas: ontología, validez de enlaces, refinamiento, bimodalidad |
| `spec-forja-opd-es` | 2.0.0 | `7a9ce98ca62dcef829ea7fafab21a354cecd74a0a767283debd0281a4d3f2af9` | Notación gráfica OPD |
| `spec-forja-opl-es` | 2.0.0 | `b715034a542fde7fb1cf341d91062085c99ec515379bb8f58bfe5f92158e17da` | OPL-ES: vocabulario, plantillas, EBNF |
| `metodologia-forja-opm-es` | 2.0.0 | `c0ebf16b95214485b2ef2085109fb110902687579cc469b9aa8906316b1e6813` | Metodología |

Precedencia: reglas > spec-OPD / spec-OPL > metodología; ante duda manda la norma. El perfil se subordina al
canon; la especificación y el diseño se subordinan a ambos.

## Norma de referencia y límites

- Las citas `ISO §x` usan la numeración de ISO/PAS 19450:2015, el único texto disponible. La alineación con
  ISO 19450:2024 queda pendiente hasta tener su texto. El texto de la norma no se versiona en este repositorio.
- El texto disponible resume algunas subcláusulas (6.1.6, 7.3.3–7.3.4, 8.1.1, 8.2.2, 9.1.2–9.1.4), no trae las
  entradas 3.77–3.83 del glosario y describe las figuras con texto. Lo que dependía de eso está marcado
  «no verificable» (por ejemplo la Tabla 27 de precedencia).
- Marcas del canon: `[informativo]` (sólo lo funda un anexo informativo, una NOTA, un EJEMPLO o una figura; nunca
  DEBE), `[localización]` (decisión de la realización española que no cambia el hecho), `[guía]` (método que
  aplica construcciones ISO sin agregar reglas; nunca DEBE).
- Cada documento conserva la numeración de secciones de su versión 1.x; los huecos son secciones trasladadas al
  perfil, que usa los mismos números.

`CAMBIOS-2.0.md` registra, regla por regla, el destino de cada entrada de las versiones 1.x (canon o perfil), la
corrección aplicada y las cláusulas que la fundan. Es la única traza de las procedencias antiguas (capas de la
KB, SSOT-*, V-nn), que el canon ya no cita.

Para actualizar: editar el documento, subir su versión, recalcular el SHA256 aquí y en `object.yaml`, registrar
el cambio en `CAMBIOS-2.0.md` (o en el registro de la versión nueva) y revisar `perfil/`, `docs/especificacion.md`
y `docs/conformidad.md` en el mismo commit. Las decisiones vigentes están en `docs/decisiones.md`.
