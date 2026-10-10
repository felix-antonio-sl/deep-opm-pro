# Perfil OpForja

Reglas propias de OpForja que no funda ISO 19450: realización de producto (render, lienzo, panel, parser,
edición, importación, exportación, diagnósticos), extensiones y endurecimientos. Salieron del canon al publicar
su versión 2.0.0 (DEC40 en `docs/decisiones.md`); ninguna se borró del producto.

| Documento | Origen | Contenido |
|---|---|---|
| `reglas-opforja.md` | `reglas-opm-estrictas-es` 1.5.0 | gobernanza, reglas de herramienta, anti-patrones de producto, Anexos A (comprobaciones de producto), B y C |
| `opd-opforja.md` | `spec-forja-opd-es` 1.4.0 | geometría, medidas, colores, tipografía, capas, lienzo, interacción, edición, export; §18.3 marcadores literales |
| `opl-opforja.md` | `spec-forja-opl-es` 1.4.1 | generación y análisis, panel, plegado de presentación, edición, configuración, modos de fallo, roundtrip |
| `metodo-opforja.md` | `metodologia-forja-opm-es` 1.7.0 | flujo de producto (Taller, Bocetos), lecciones forja LF-nn, casos externos, realización en el bundle |

Reglas del perfil:
- Se subordina al canon y no lo contradice. Lo más estricto que ISO se marca `[endurecimiento]`; lo que la
  extiende, `[extensión]`; lo que se aparta de un valor por defecto normativo por decisión del dueño,
  `[desviación declarada]`. Cada uno tiene su brecha en `docs/conformidad.md`.
- Conserva el ID y el número de sección de la versión 1.x: el §n de un documento del perfil es el §n de su
  documento de origen. Una regla repartida aparece en el canon con su ID y aquí como «(ID, parte de producto)».
- Las pruebas del producto leen este texto: T-003 (`app/src/pruebas/trazabilidad.test.ts`) exige los IDs de las
  reglas de contexto en canon o perfil, y `app/src/opd/marcadores.test.ts` lee los literales de
  `opd-opforja.md` §18.3.
