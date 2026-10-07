# Documentación de OpForja

Un solo modelo persistente, expresado como OPD y OPL. Las reglas viven en el canon;
estas entradas explican el uso, la integración y las decisiones del producto.

| Necesidad | Documento |
|---|---|
| Usar el modelador y conocer sus gestos | [Guía](guia.md) |
| Integrar por JSON v0 y HTTP | [Formato y API](formato-v0.md) |
| Operar, respaldar o recuperar | [Operación](operacion.md) |
| Examinar lo cumplido y sus límites | [Conformidad](conformidad.md) |
| Comprender decisiones y mitigaciones | [Decisiones](decisiones.md) |
| Consultar requisitos T-NNN y DR-n | [Especificación derivada](especificacion.md) |
| Consultar la autoridad OPM primaria | [Canon vendorizado](../canon/LEEME.md) |

Las instrucciones operativas no autorizan despliegues, migraciones o acceso a datos.
La historia del rehecho y sus fallos se conserva en Git hasta el publicado
`89aaa3a5c618a35611137654de96c115621daaba`, bajo `docs/rehacer/` y `HANDOFF.md`.
No se reescribe ese historial al retirar los documentos temporales del árbol.
