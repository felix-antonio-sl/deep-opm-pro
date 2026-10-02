# Canon local de OpForja

Estos cuatro documentos vendorizados son la autoridad OPM local. Se conservan tal cual.

| Slug | Versión | SHA256 de `content.md` | Plano de autoridad |
|---|---|---|---|
| `reglas-opm-estrictas-es` | 1.5.0 | `b3d59d0de851447e11e2f95200edd706b1c5eb39d05f6f452a6ead022d8f1ac1` | Reglas |
| `spec-forja-opd-es` | 1.4.0 | `8ce15bb0515aef31a63f83f4d5c4247c961a36ff2cc0ecb83cab52e1866c8cd8` | Especificación OPD |
| `spec-forja-opl-es` | 1.4.1 | `1dd9eca263340cb6cfeed361cf44329d2e6c677f03416d444e81bd847536fcc4` | Especificación OPL |
| `metodologia-forja-opm-es` | 1.7.0 | `6414104938129e3b0e07c43c1476fe71ff09e847333b0ebafda664a4560faeb2` | Metodología |

Precedencia: reglas > spec-OPD / spec-OPL > metodología.
Ante conflicto, estos documentos mandan sobre la especificación derivada y el diseño.

Las URN citadas en los `object.yaml` que no están aquí no son autoridad local.

Para actualizar: reemplazar la carpeta completa, recalcular el SHA256 y revisar
`docs/especificacion.md` y `docs/conformidad.md` en el mismo commit. Durante la
implementación se aplica el mapa temporal de `docs/rehacer/plan/README.md`.
