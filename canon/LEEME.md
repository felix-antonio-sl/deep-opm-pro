# Canon local de OpForja

Estos cuatro documentos son la autoridad OPM local. Contienen sólo lo que funda ISO 19450, en español,
revisado cláusula por cláusula contra ISO/PAS 19450:2015. Lo propio de OpForja (producto, extensiones,
endurecimientos) vive en `perfil/`. La historia de versiones y procedencias está en Git.

| Slug | Versión | SHA256 de `content.md` | Plano de autoridad |
|---|---|---|---|
| `reglas-opm-estrictas-es` | 2.3.0 | `65aa693210b2b07aa23ed0909e73624462ab18e35a1f1c1f9173865154a6e84d` | Reglas: ontología, validez de enlaces, refinamiento, bimodalidad |
| `spec-forja-opd-es` | 2.3.0 | `f4baa9af2d72dcd860772c2a2de8abe09386eacf99a928abf7d84c63aa30f2bc` | Notación gráfica OPD |
| `spec-forja-opl-es` | 2.3.1 | `173ba96b65113e8a2e820089c1e536c7f2778bd5196a387f09ec5fbd849a5867` | OPL-ES: vocabulario, plantillas, EBNF |
| `metodologia-forja-opm-es` | 2.3.0 | `0d1eb46b848e1bf7fb0f5fee4bb9ad1938600d032968f079d4cd5cdec2cadc9b` | Metodología |

Precedencia: reglas > spec-OPD / spec-OPL > metodología; ante duda manda la norma. El perfil se subordina al
canon; la especificación y el diseño se subordinan a ambos. Las versiones son locales al repositorio
(`estado: local`): no constituyen publicación en la KB de origen.

## Norma de referencia y límites

- Las citas `ISO §x` usan la numeración de ISO/PAS 19450:2015, el único texto disponible. No se dispone de
  ISO 19450:2024: el canon no afirma alineación con esa edición. El texto de la norma no se versiona aquí.
- El texto disponible resume algunas subcláusulas (6.1.6, 7.3.3–7.3.4, 8.1.1, 8.2.2, 9.1.2–9.1.4), no trae las
  entradas 3.77–3.83 del glosario y describe las figuras con texto. Lo que dependía de eso está marcado
  «no verificable». La Tabla 27 de precedencia se lee por la disposición de sus celdas, como lectura inferida.
- Marcas del canon: `[informativo]` (sólo lo funda un anexo informativo, una NOTA, un EJEMPLO o una figura; nunca
  DEBE), `[localización]` (decisión de la realización española que no cambia el hecho), `[guía]` (método que
  aplica construcciones ISO sin agregar reglas; nunca DEBE).
- Cada documento conserva la numeración de secciones de su versión 1.x; los huecos son secciones trasladadas al
  perfil, que usa los mismos números.

Para actualizar: editar el documento, subir su versión, recalcular el SHA256 aquí y en `object.yaml`, explicar el
cambio en el mensaje del commit y revisar `perfil/`, `docs/especificacion.md`
y `docs/conformidad.md` en el mismo commit. Las decisiones vigentes están en `docs/decisiones.md`.
