# Canon local de OpForja

Estos cuatro documentos son la autoridad OPM local. Contienen sólo lo que funda ISO 19450, en español:
desde la versión 2.0.0 se revisaron cláusula por cláusula contra ISO/PAS 19450:2015 (DEC39–DEC45 en
`docs/decisiones.md`). La versión 2.2.0 restablece ese contenido y retira la revisión 2.1.0, que se apoyaba
en una edición 2024 de la que no se dispuso (DEC47, `CAMBIOS-2.2.md`). Lo propio de OpForja (producto,
extensiones, endurecimientos) vive en `perfil/`.

| Slug | Versión | SHA256 de `content.md` | Plano de autoridad |
|---|---|---|---|
| `reglas-opm-estrictas-es` | 2.2.0 | `a78ac6995e925b73314d798ce8ece1d8705c033689c722af4ed41cb1ab031107` | Reglas: ontología, validez de enlaces, refinamiento, bimodalidad |
| `spec-forja-opd-es` | 2.2.0 | `09fdaedb9b77151d3132271821b38c0a5ba703a4de0e2b4424a337a182f96af4` | Notación gráfica OPD |
| `spec-forja-opl-es` | 2.2.0 | `12db0911a9f6aec11f77768da7bcdd52c5f1caad71c9d218fbb1381bfd3cf3d0` | OPL-ES: vocabulario, plantillas, EBNF |
| `metodologia-forja-opm-es` | 2.2.0 | `2e80b452a0b027279743fe11f1edf87d8f6f868bbe37e3a348d6c719e4f37e4f` | Metodología |

Precedencia: reglas > spec-OPD / spec-OPL > metodología; ante duda manda la norma. El perfil se subordina al
canon; la especificación y el diseño se subordinan a ambos. Las versiones son locales al repositorio
(`estado: local`): no constituyen publicación en la KB de origen.

## Norma de referencia y límites

- Las citas `ISO §x` usan la numeración de ISO/PAS 19450:2015, el único texto disponible. No se dispone de
  ISO 19450:2024: el canon no afirma alineación con esa edición. El texto de la norma no se versiona aquí.
- El texto disponible resume algunas subcláusulas (6.1.6, 7.3.3–7.3.4, 8.1.1, 8.2.2, 9.1.2–9.1.4), no trae las
  entradas 3.77–3.83 del glosario y describe las figuras con texto. Lo que dependía de eso está marcado
  «no verificable» (por ejemplo la Tabla 27 de precedencia).
- Marcas del canon: `[informativo]` (sólo lo funda un anexo informativo, una NOTA, un EJEMPLO o una figura; nunca
  DEBE), `[localización]` (decisión de la realización española que no cambia el hecho), `[guía]` (método que
  aplica construcciones ISO sin agregar reglas; nunca DEBE).
- Cada documento conserva la numeración de secciones de su versión 1.x; los huecos son secciones trasladadas al
  perfil, que usa los mismos números.

`CAMBIOS-2.2.md` registra la retirada de la revisión 2.1.0 y lo que cambia fuera del canon.
`CAMBIOS-2.0.md` registra, regla por regla, el destino de cada entrada de las versiones 1.x (canon o perfil), la
corrección aplicada y las cláusulas que la fundan. Es la única traza de las procedencias antiguas (capas de la
KB, SSOT-*, V-nn), que el canon ya no cita.

Para actualizar: editar el documento, subir su versión, recalcular el SHA256 aquí y en `object.yaml`, registrar
el cambio en el registro de la versión nueva y revisar `perfil/`, `docs/especificacion.md`
y `docs/conformidad.md` en el mismo commit. Las decisiones vigentes están en `docs/decisiones.md`.
