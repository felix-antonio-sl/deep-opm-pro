# Canon local de OpForja

Estos cuatro documentos son la autoridad OPM local, en español. La revisión **2.1.0** usa el texto y las
figuras recuperados de **ISO 19450:2024** para resolver las reservas de la fuente incompleta 2015 y actualizar
las citas. Lo propio de OpForja sigue en `perfil/`; los cambios documentales conservan el comportamiento del
producto. DEC39–45 y `CAMBIOS-2.0.md` conservan la historia; DEC46 registra el encargo de recuperación.

| Slug | Versión | SHA256 de `content.md` | Plano de autoridad |
|---|---|---|---|
| `reglas-opm-estrictas-es` | 2.1.0 | `b5495da638895402adda67655d0d9950ad687e35cf1874b35c7b42830578de68` | Reglas: ontología, validez de enlaces, refinamiento, bimodalidad |
| `spec-forja-opd-es` | 2.1.0 | `f3e3bd9647e4dade7d37671dd37b768b2ef0ee088b32fa149de3fa36176855c4` | Notación gráfica OPD |
| `spec-forja-opl-es` | 2.1.0 | `02fb8c1fe3d6c03b15d17373d9256c0b8cf7628e5a51a12a9b93e1f7672f6d0f` | OPL-ES: vocabulario, plantillas, EBNF |
| `metodologia-forja-opm-es` | 2.1.0 | `5265ad661b177f3a5e86085cafde97f8acb862da5fd6b90a5e76db294795d06a` | Metodología |

Precedencia: reglas > spec-OPD / spec-OPL > metodología; ante duda manda la norma. El perfil se subordina al
canon; la especificación y el diseño se subordinan a ambos. Las versiones aquí son locales al repositorio:
`estado: local` y `publication.status: local` no constituyen aprobación o publicación en KORA.

## Norma de referencia y límites

- Las citas ISO vigentes usan numeración **2024**. Las secciones internas del canon y del perfil conservan
  sus números 1.x; las citas históricas a 2015 no se reescriben como si ya hubieran usado 2024.
- [CAMBIOS-2.1.md](CAMBIOS-2.1.md) identifica la copia de terceros por tamaño y SHA256 (sin su ubicación), el contraste
  con la ficha oficial y la muestra, las cláusulas recuperadas y las figuras observadas. El texto de la norma y las
  imágenes de sus páginas se conservan fuera de Git.
- Se resuelven la falta de Tabla 27 y las reservas por cláusulas resumidas o figuras ausentes. La obtención
  del PDF no acredita autenticidad editorial de cada byte ni auditoría exhaustiva de todas las capacidades;
  la correspondencia gráfica y la EBNF conservan las reservas internas observadas y descritas en el registro.
- Diferencias que siguen en el producto: [docs/conformidad.md](../docs/conformidad.md), incluidas B-44
  (evento externo al contorno, de cualquier afiliación), B-50 (esencia primaria), B-51 (tipografía OPL) y B-52
  (propiedades genéricas). Una actualización de citas no las implementa.
- Marcas: `[informativo]` para anexos B–D, NOTAS, EJEMPLOS o figuras como única fuente; nunca DEBE.
  `[localización]` para realización española que conserva el hecho; `[guía]` para método sin reglas nuevas.
  Cuando una cláusula normativa prescribe el mismo glifo mostrado por una figura, se cita también la cláusula.

[CAMBIOS-2.0.md](CAMBIOS-2.0.md) registra el destino de las entradas 1.x y la separación canon/perfil.
[CAMBIOS-2.1.md](CAMBIOS-2.1.md) registra la recuperación, la numeración 2024 y las correcciones de esta revisión.
Las procedencias antiguas KB, SSOT-* y V-nn siguen como historia, sin darles crédito normativo nuevo.

Para actualizar: editar el documento, subir su versión, recalcular el SHA256 aquí y en `object.yaml`, registrar
el cambio en el registro de la versión y revisar `perfil/`, `docs/especificacion.md` y `docs/conformidad.md`
en el mismo commit. Las decisiones vigentes están en [docs/decisiones.md](../docs/decisiones.md).
