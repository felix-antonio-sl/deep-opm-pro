# Canon local de OpForja

Estos cuatro documentos son la autoridad OPM local. Contienen sólo lo que funda ISO 19450, en español:
desde la versión 2.0.0 se revisaron cláusula por cláusula contra ISO/PAS 19450:2015 (DEC39–DEC45 en
`docs/decisiones.md`). La versión 2.2.0 restablece ese contenido y retira la revisión 2.1.0, que se apoyaba
en una edición 2024 de la que no se dispuso (DEC47, `CAMBIOS-2.2.md`). La 2.3.0 adopta la lectura inferida de
la Tabla 27 de precedencia (DEC50, `CAMBIOS-2.3.md`). Lo propio de OpForja (producto,
extensiones, endurecimientos) vive en `perfil/`. La spec-OPL 2.3.1 adopta el ejemplo informativo de agente
común de §14.2.2.4.1/Figura 50, fuera del Anexo A (`CAMBIOS-2.3.1.md`); los otros tres documentos siguen 2.3.0.

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

`CAMBIOS-2.3.md` registra la matriz de precedencia inferida. `CAMBIOS-2.2.md` registra la retirada de la
revisión 2.1.0 y lo que cambia fuera del canon.
`CAMBIOS-2.0.md` registra, regla por regla, el destino de cada entrada de las versiones 1.x (canon o perfil), la
corrección aplicada y las cláusulas que la fundan. Es la única traza de las procedencias antiguas (capas de la
KB, SSOT-*, V-nn), que el canon ya no cita.

Para actualizar: editar el documento, subir su versión, recalcular el SHA256 aquí y en `object.yaml`, registrar
el cambio en el registro de la versión nueva y revisar `perfil/`, `docs/especificacion.md`
y `docs/conformidad.md` en el mismo commit. Las decisiones vigentes están en `docs/decisiones.md`.
