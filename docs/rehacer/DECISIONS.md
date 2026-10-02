# Decisiones del dueño del producto y del orquestador (fijas para el diseño)

## Del dueño (textuales)
- «Rehaz OpForja con plena libertad creativa y de transformación, manteniendo siempre un respeto absoluto por los principios, la semántica y las reglas de OPM.» Objetivo: más usable, ágil, limpia, intuitiva, elegante, liviana, coherente. Eliminar sobreingeniería, lastre, burocracia y complejidad acumulada. Simplificar con criterio sin sobresimplificar.
- «más simple aún. acá está el canon actualizado. ni más ni menos»: el canon son EXACTAMENTE 4 documentos (reglas-opm-estrictas-es 1.5.0, spec-forja-opd-es 1.4.0, spec-forja-opl-es 1.4.1, metodologia-forja-opm-es 1.7.0). Scratchpad: canon/<slug>/content.md. Especificación derivada: understand/CANON.md (248 requisitos T-NNN).
- Persistencia (respuesta explícita 2026-09-30): **«Servidor mínimo»** — el mismo cliente + un servicio pequeño con UNA cuenta y los modelos guardados como archivos JSON (`deep-opm-pro.modelo.v0`) en el servidor. Conserva el acceso desde cualquier navegador. Sin PostgreSQL. Migración única de los modelos actuales de PostgreSQL a archivos.

## Del orquestador (derivadas del alcance «ni más ni menos»)
- Alcance del producto = lo que CANON.md exige a la herramienta (+ infraestructura mínima: cuenta, abrir/guardar/listar/eliminar modelos, exportar). Lo que CANON.md §0.4 lista como «no entra» NO se implementa: simulación, bilingüismo, sub-modelos/composición, Bocetos/Apunte/Taller/Graduar/Biblioteca/versiones, estereotipos/requisitos, anclaje/drift/calcar, capa computacional, Pr/m-de-f, negación, demora, semi-plegado, vistas/Bring/mapa, estilado autoral, agente LLM integrado, tutor, mesa, revisión compartida, lector portátil, captura de bugs, modo móvil de solo lectura.
- Deshacer/rehacer: el canon no lo exige ni lo prohíbe; es afordancia básica de editor, no hecho OPM. Se conserva solo si su costo es trivial (snapshots inmutables).
- Formato: se lee y escribe `deep-opm-pro.modelo.v0` (mismo sobre y nombres de campo del núcleo actual, Records por id) para compatibilidad con los modelos existentes y con bundles externos (Apéndice F: «No emitir formato distinto»). Campos de extensiones retiradas se ignoran al importar y se reportan como no representados.
- Registro de conformidad (R-CONF-7): un único documento del repo que declara cada DEBE no implementado (brecha silenciosa prohibida).
- Canon vendorizado en el repo (los 4 documentos, tal cual) como autoridad local; se retiran puentes/resolutor URN.
- Idioma: UI, OPL y docs en español es-CL; el código de dominio usa el vocabulario del canon en español (como el formato v0 y los tipos de CANON.md §1.2), de forma consistente en todo el código.
- No desplegar (no autorizado). Mantener `./deploy/deploy.sh` como único circuito, adaptado al nuevo servicio.
- Decisiones pendientes del canon (CANON.md §10.3) con default conforme: RX1/RX2 diferidos (`unsupported-canonical`), descomposición de objeto diferida y declarada, agente solo desde objeto físico (proxy declarado por el método).

## Material adicional obligatorio (llegó después de los arquitectos)
`understand/SYNTHESIS.md` (1.212 líneas, en especial §3.9 casos límite, §7 dolores de UX en vivo y del histórico de bugs, §8 riesgos de sobresimplificación —21 ítems—, §10 correcciones del crítico con sondas ejecutables: estado real de cada ★), `understand/ux-en-vivo.md` y `understand/bugs-auditorias.md`. El diseño final DEBE resolver explícitamente cada riesgo de §8 y cada ítem de §10.2 marcado FALTA/CONTRADICE/PARCIAL.

## Respuestas a las preguntas abiertas (SYNTHESIS §9) — fijas
1. RX1/RX2 (DR-10): diferidos; el parser responde `unsupported-canonical`; declarado en el registro.
2. Descomposición de objeto (DR-23): diferida y declarada en el registro (no se ofrece en la UI; parser `unsupported-canonical`).
3. Agente (DR-5): proxy «objeto físico» del método; sin dato «humano» adicional.
4. Unidades (DR-18): mapeo es-CL fijo singular/plural (ms→milisegundo(s), sec→segundo(s), min→minuto(s), hour→hora(s), day→día(s), week→semana(s), month→mes(es), year→año(s)).
5. Deshacer/rehacer: SÍ, por instantáneas inmutables del modelo (barato); no es hecho OPM.
6. Versiones: sin versiones en la UI. El servidor conserva, por robustez, las últimas N copias previas de cada archivo (rotación simple en disco, sin UI, recuperables por el operador). JSON descargable siempre disponible.
7. Pestañas y carpetas: NO. Una lista simple de modelos (nuevo, abrir, renombrar, eliminar a papelera, importar, descargar).
8. Login: una cuenta (DECISIONS: servidor mínimo). Sin PostgreSQL.
9. Simulación y probabilidades: se RETIRAN (canon §0.4; «ni más ni menos»).
10. Búsqueda: SÍ, mínima («Buscar» por nombre de cosa u OPD → navegar/seleccionar; es canal UI previsto por R-OPD-UI-1). Tabla de enlaces: NO (inspector + OPL bastan).
11. Lector móvil y capturador de bugs: fuera. La app es usable en anchos estrechos sin modo aparte.
12. Modelos productivos con extensiones: se importan; el migrador lista cada pérdida (campo no representado) en un reporte visible; nada se pierde en silencio. La migración única desde PostgreSQL escribe además un reporte por modelo.
13. hd-opm / skill / CLI mesa: el contrato externo es el JSON v0 + la API HTTP de modelos. El servidor acepta además un token Bearer opcional (variable de entorno) equivalente a la cuenta, para que agentes externos lean/escriban modelos por la misma API. Se retira el CLI mesa y el protocolo de testigo.
14. Forma del bundle: v0 tal cual (mapas por id, `opds[].apariencias`, `opds[].enlaces` emitido como lista derivada), mismo `formato`.
15. JointJS: se reemplaza por render SVG propio (golden SVG como red de regresión).
16. Canon en el repo: `canon/` con los 4 documentos tal cual; registro de conformidad en `docs/conformidad.md` mantenido junto al código (sin test autorreferente de prosa).
17. `opm-extracted/`, `assets/`, `fixtures/` (salvo los bundles v0 de `fixtures/demo-models/*.json`, que pasan a fixtures de test), `config/`, `catalog/`, `webroot/`, `ui-forja/`, `setup.sh`: se retiran del árbol (el historial Git queda).
18. Estados: crear un estado pide su nombre (uno por gesto; sin placeholders, DR-11). In-zoom: crea el OPD hijo con el contenedor y SIN subprocesos semilla; el modelador los crea con nombre; AP-13 advierte hasta ≥2.
19. Convención de nombres: la léxica EBNF se valida al nombrar (error visible, sin normalización silenciosa); R-NOM-* son advertencias metodológicas.
20. Se abandonan la clasificación compuesta y el AND agrupado en la emisión (reglas 9.2 manda D1/D3 atómicas); el parser sigue aceptando la combinada R-ENT-3.
21. IV2 nace sin demora.
22. Selección múltiple mínima: SÍ (shift-clic; mover, eliminar/quitar, y seleccionar ≥2 enlaces para formar abanico). Sin portapapeles.
23. = 18.
24. `canon-documento` = archivo HTML autocontenido (árbol OPD + por cada OPD su SVG canónico y su OPL). Además export OPL Markdown, SVG por OPD y JSON v0.

## Decisiones de revisión del dueño (2026-10-02) — fijas
25. **D1 y D4 concuerdan en género** (`**Bodeguero** es físico.`, `**Caja** es física.`), con el género de la cosa (masculino por defecto). El parser acepta ambas formas. DESIGN lo recoge como DS-26.
26. **La simulación se retira** (confirmado tras revisar su uso histórico). Queda declarada en el registro de conformidad (modo runtime vacío, B-21; T-323 en B-25).
27. **Contrato para agentes externos: JSON v0 + API HTTP del servidor mínimo con token Bearer** (DESIGN §8). Se retiran el CLI `mesa` y su protocolo de testigo. Tarea externa a este repositorio: actualizar las referencias de la skill `modelamiento-opm` en KORA cuando el servidor nuevo esté desplegado.
28. **La implementación se hace en una sesión nueva**, a partir del plan empaquetado en `plan/` (`plan/README.md`, `plan/PROMPT.md`, `plan/plan.json`). Esta sesión no implementa.
