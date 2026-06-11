# Registro de conformidad SSOT (R-CONF-7)

Registro vivo exigido por **R-CONF-7** (`reglas-opm-estrictas-es` v1.3.1, decisión
HITL 2026-06-11): toda regla DEBE de la SSOT sin implementación vigente queda
aquí **declarada** como programada (con destino) o como enmienda propuesta a la
spec propietaria. La brecha silenciosa está prohibida. Las reglas DEBE con
tráfico en el ciclo activo (export canónico, OPL aguas abajo, render para
skills) no se programan: son deuda exigible y viven en los cortes de
remediación.

**Cobertura declarada**: este registro nace del barrido 2026-06-11 sobre las
brechas conocidas — auditoría integral (`docs/auditorias/2026-06-11-…`),
violaciones V-1..V-8 del backlog contingencial y familia de export. No es una
re-auditoría línea-por-línea de la SSOT; cada auditoría futura que descubra una
brecha DEBE nueva la añade aquí o la cierra en el corte donde se encuentre.

**Mantenimiento**: el corte que cierra una fila la marca CERRADA con commit; lo
implementado o superado se elimina en el siguiente saneo (la historia git es la
red de recuperación, política de `docs/auditorias/README.md`).

## Declaraciones vigentes

| Regla / familia | Exigencia | Estado | Declaración R-CONF-7 |
|---|---|---|---|
| R-VIS-EXP-2 / R-OPD-CAN-1 (perfiles `canon-diagrama`/`canon-documento`) | DEBE declarar ambos perfiles | **CERRADA 2026-06-11** (`3a2db18c`) | Implementada: `serializacion/perfilesExport.ts` + gate de densidad + documento canónico en paleta. |
| R-VIS-EXP-1/3/4/6 (canon = lo que persiste en export; UI transitoria fuera) | DEBE (definicionales) | Cubiertas por diseño | Implementadas por construcción: el filtro de perfil excluye extensiones meta; capturas de canvas no son evidencia de canonicidad (sin superficie que las trate como tal). |
| R-VIS-EXP-5 (elemento persistente solo en un perfil ⇒ atributo de perfil) | DEBE | **PROGRAMADA** | Satisfacciones y procedencia persisten solo en `canon-documento`; hoy declarado en la doc del módulo (`perfilesExport.ts`). Formalizar como atributo de perfil en la próxima iteración del export. Sin tráfico que lo exija aún. |
| R-VIS-EXPORT-1A..1E (V-226..V-235: default declarado, sin chrome, trazabilidad raster, viewport sin recorte, overlays declarados) | DEBEN | **PROGRAMADA** (verificación formal) | Cubiertas de hecho por el render headless H1 y el export PNG (sin chrome, viewport completo); falta la pasada de verificación formal contra V-226..V-235. Programada junto al siguiente corte de export. |
| R-OPD-HAB-4 (+matriz §6.5; habilita R-ROL-UNIC-1, R-PREC-1..5) — unicidad de rol por par objeto-proceso | DEBE | **PROGRAMADA** (P2, V-3) | Hoy no se impide el segundo enlace procedimental sobre el mismo par. Destino: cortes de remediación post-auditoría (kernel ruidoso). |
| V-4 — proceso de manejo de excepción sin validar afiliación ambiental | DEBE | **PROGRAMADA** (P3) | Validación pendiente en kernel; el desvío ejecutable ya existe (remediación corte 3). |
| V-5 — efecto a objeto sin estados: solo checker blando | DEBE (SSOT exige rechazo) | **PROGRAMADA** (P3) | Criterio del dictamen §10: migrar de aviso a kernel cuando la regla SSOT es DEBE. Checker `B-4`/`EFECTO_SIN_TRANSICION` ya avisa. |
| V-6 — afiliación no heredada por cadena estructural en render | DEBE | **PROGRAMADA** (P3) | Render no hereda afiliación; sin impacto en persistencia ni OPL. |
| V-8 — `normalizarColoresSvg` descarta alfa en export SVG | DEBE (fidelidad de export) | **PROGRAMADA** (P3) | Pérdida de canal alfa en SVG headless; afecta fidelidad visual, no semántica. |
| V-7 — deriva documental §18.2 (dashes/pin current) | — | **ENMIENDA PROPUESTA** | El código es la realización vigente y correcta; la spec (`spec-forja-opd-es` §18.2) quedó atrás. Corresponde enmienda documental en KORA, no cambio de herramienta. |
| Out-zoom (mecanismo de refinamiento OPM) | Canónico en SSOT | **PROGRAMADA** | Sin superficie de autoría (oportunidad anotada: reutilizar `equivalencia/`). Declarado como capacidad no implementada; no hay modelo productivo que lo demande aún. |
| GAPs §22 `spec-forja-opd-es` (GAP-OPD-UIFORJA-08*) | varios | **PROGRAMADOS** | Backlog vivo en `docs/roadmap/` (frente #4 del HANDOFF). |

## Cerradas por la remediación 2026-06-11 (referencia)

V-1 (modificadores `c`/`e` en kernel+import), V-2 (AP-04), «puede ser» fuera del
parseo de estados, pérdidas silenciosas del reverse con diagnóstico, gate de
densidad cableado a `validarModelo`, linealidad con exención XOR, TAGGED-ITALIC,
`Pr = p` (commits `58b752e5`, `2766eb74`, `1f88c69a`, `2cd26a3d`).
