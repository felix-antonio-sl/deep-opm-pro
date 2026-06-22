# 99 — Invariantes globales y lista maestra de verificación

**Alcance**: invariantes semánticos y visuales del modelo OPM clasificados por aplicabilidad (automática / esquema / manual) y por capa propietaria (`opm-es` / `opl-es` / `opd-es` / `manual`); lista maestra de verificaciones por nivel (SD, SD1, SD2+, Cuant, Error, Global, Requisitos).
**Capa SSOT propietaria**: `metodologia-opm-es.md` §15, §16
**Aplicación en la app**: validador global, auditoría de conformidad, CI.

## Parte A — Tabla de invariantes (§15)

### A.1 Invariantes nominales y de tipo

| # | Invariante | Aplicación | Capa |
|---|---|---|---|
| I-01 | Nombre del proceso principal cumple política léxica de la capa textual activa | automático | `opl-es` |
| I-02 | Todos los nombres de cosas son singulares | automático | `opl-es` |
| I-03 | Grupo beneficiario es objeto físico | automático | `manual` |
| I-04 | Atributo del beneficiario es objeto informacional | automático | `manual` |
| I-05 | Exactamente un proceso principal por SD | esquema | `manual` |
| I-06 | Sinónimos de superficie resueltos a un nombre canónico por cosa | manual | `manual` |

### A.2 Invariantes de enlaces

| # | Invariante | Aplicación | Capa |
|---|---|---|---|
| I-07 | Enlace de agentes solo conecta a humanos (exclusividad) | manual | `opm-es` |
| I-08 | Enlace de instrumentos solo conecta a no humanos | manual | `opm-es` |
| I-09 | Todo habilitador persiste sin cambio neto tras el proceso | manual | `opm-es` |
| I-10 | Enlace de consumo/resultado no en contorno exterior de proceso descompuesto | automático | `opd-es` |
| I-11 | Todo subproceso conectado a al menos un transformado | automático | `manual` |
| I-12 | Enlaces estructurales son homogéneos (excepción: exhibición-caracterización) | automático | `opm-es` |
| I-13 | Enlaces escindidos con modificador de control no están permitidos | automático | `opd-es` |
| I-14 | Los enlaces no deben cruzar áreas ocupadas por cosas | manual | `opd-es` |

### A.3 Invariantes de estados

| # | Invariante | Aplicación | Capa |
|---|---|---|---|
| I-15 | Habilitadores y afectados ∈ Pre(P) ∩ Post(P); consumidos ∈ Pre(P) solo; resultantes ∈ Post(P) solo | manual | `opm-es` |
| I-16 | Estado cíclico (initial+final simultáneo) es válido para objetos con ciclos cerrados | manual | `manual` |
| I-17 | Salida no-determinista por defecto: sin estado especificado → probabilidad 1/n por estado | manual | `opm-es` |

### A.4 Invariantes visuales

| # | Invariante | Aplicación | Capa |
|---|---|---|---|
| I-18 | Objetos ambientales tienen contorno discontinuo | automático | `opd-es` |
| I-19 | Sistema exhibe proceso principal vía exhibición-caracterización | manual | `manual` |
| I-20 | Subprocesos paralelos tienen borde superior de elipse a la misma altura | manual | `opd-es` |
| I-21 | Las cosas no deben ocultarse mutuamente (excepción: plegado en puertos) | manual | `opd-es` |
| I-22 | Minimizar número de enlaces y cruces de enlaces en cada OPD | manual | `manual` |

### A.5 Invariantes de refinamiento y metamodelo

| # | Invariante | Aplicación | Capa |
|---|---|---|---|
| I-23 | Modelo bimodal: todo OPD tiene párrafo OPL equivalente | esquema | `opm-es` |
| I-24 | Un hecho del modelo aparece en al menos un OPD | esquema | `opm-es` |
| I-25 | Refinamiento no trivial: descomposición ≥ 2 subprocesos; despliegue ≥ 2 refinadores | automático | `manual` |
| I-26 | Cada OPD tiene identificador persistente distinto de su etiqueta visible `SDx.y` | esquema | `opm-es` |
| I-27 | Proceso que no entrega valor funcional directo al beneficiario DEBERÍA ser ambiental | manual | `manual` |

### A.6 Invariantes de sub-modelos

| # | Invariante | Aplicación | Capa |
|---|---|---|---|
| I-28 | Interfaz de sub-modelo congelada tras creación: sin nuevas cosas compartidas, sin renombrar, sin agregar estados | manual | `manual` |
| I-29 | Toda referencia inter-modelo explicita modelo propietario y modelo consumidor | manual | `opm-es` |
| I-30 | La especificación textual de un modelo compuesto preserva OPL local autocontenido por modelo individual | esquema | `opl-es` |
| I-31 | Las cosas referenciadas externamente no se renombran ni reciben estados nuevos en el modelo consumidor | manual | `manual` |

### A.7 Invariantes cuantitativos y de requisitos

| # | Invariante | Aplicación | Capa |
|---|---|---|---|
| I-32 | Probabilidades en abanico XOR probabilístico suman exactamente 1 | automático | `opm-es` |
| I-33 | Arquitectura del sistema produce al menos una capacidad emergente | manual | `manual` |
| I-34 | Si se usan requisitos, la trazabilidad usa enlaces estructurales y la convención `satisface` en OPL-ES | manual | `manual` |
| I-35 | Los procesos computacionales con cuerpo ejecutable se distinguen visualmente con `()` en el OPD | automático | `manual` |
| I-36 | La multiplicidad usa gramática canónica y parámetros únicos por modelo | automático | `opm-es` |
| I-37 | La recomposición de enlaces aplica matriz de precedencia y bloquea colisiones inválidas | automático | `opd-es` |

## Parte B — Lista maestra de verificación (§16)

Cada verificación indica **nivel**, condición, severidad y capa propietaria.

### B.1 Nivel SD

| Verificación | Condición | Severidad | Capa |
|---|---|---|---|
| Sistema clasificado | Tipo determinado (artificial/natural/social/socio-técnico) | CRÍTICA | `manual` |
| Propósito/resultado definido | Beneficiario + atributo + transición estados | CRÍTICA | `manual` |
| Función definida | Proceso principal + transformado principal | CRÍTICA | `manual` |
| Habilitadores presentes | ≥1 agente o instrumento | ALTA | `manual` |
| Entorno identificado | ≥1 objeto ambiental | MEDIA | `manual` |
| Ocurrencia del problema (si aplica) | Proceso ambiental causa estado negativo | MEDIA | `manual` |
| Reclasificación de instrumentos | Instrumentos con desgaste relevante reclasificados a afectado | MEDIA | `manual` |

### B.2 Nivel SD1

| Verificación | Condición | Severidad | Capa |
|---|---|---|---|
| Refinamiento correcto | Síncrono → descomposición; asíncrono → despliegue | ALTA | `manual` |
| Sin evento a no-primero | Eventos no a subprocesos intermedios (o justificación) | ALTA | `manual` |
| Enlaces escindidos resueltos | Ningún efecto subespecificado en descomposición múltiple | ALTA | `opd-es` |
| Estados expresados | Estados relevantes visibles y conectados | ALTA | `opd-es` |
| Tipo asíncrono correcto | Agregación para partes; generalización para tipos | ALTA | `manual` |
| Sin redundancia | Sin duplicación innecesaria de hechos del SD | MEDIA | `manual` |

### B.3 Nivel SD2+

| Verificación | Condición | Severidad | Capa |
|---|---|---|---|
| Precedencia de enlaces | Recomposición aplica matriz de precedencia | ALTA | `opd-es` |
| Árbol OPD válido | Etiquetado secuencial correcto | MEDIA | `opd-es` |
| Etiqueta visible vs identidad | `SDx.y` se usa solo para navegación; existe ID persistente recuperable | ALTA | `opm-es` |
| Coherencia de cambio de rol | Instrumento abstracto = afectado detallado solo si cambio neto = 0 | ALTA | `manual` |

### B.4 Nivel Cuantitativo

| Verificación | Condición | Severidad | Capa |
|---|---|---|---|
| Operandos explícitos | Operaciones no conmutativas con roles designados | MEDIA | `manual` |
| Flujo computacional | Atributos computacionales con tipo, alias y fórmula | MEDIA | `manual` |
| Validación de rangos | Rangos definidos para atributos con dominio acotado | MEDIA | `manual` |

### B.5 Nivel Errores temporales

| Verificación | Condición | Severidad | Capa |
|---|---|---|---|
| Manejo de excepciones | Procesos con límites de tiempo tienen enlaces de excepción | MEDIA | `opm-es` |
| Resolución de estado indeterminado | Afectados en transición resueltos por manejador de excepciones | MEDIA | `opm-es` |

### B.6 Nivel Global

| Verificación | Condición | Severidad | Capa |
|---|---|---|---|
| Claridad | Ningún OPD excede 20-25 entidades | MEDIA | `manual` |
| Alcance interior/exterior | Objetos interiores solo existen en alcance de su proceso padre | MEDIA | `opm-es` |
| Coherencia de nombres | Sin nombres duplicados no resueltos | ALTA | `manual` |
| Aplicación de ontología | Nivel configurado (Sugerir o Aplicar) | MEDIA | `manual` |
| Informatividad del modelo | Clasificación ejecutada; sin enlaces de precedencia faltantes críticos | MEDIA | `manual` |
| Mapa del sistema | Generado para modelos con >10 OPDs | MEDIA | `manual` |
| Constructos de especificación | OPD + OPL + OPM spec completos en orden en anchura | MEDIA | `manual` |
| Referencia inter-modelo explícita | Sub-modelos y referencias externas declarados explícitamente | ALTA | `opm-es` |
| OPL local por modelo | Cada modelo individual conserva especificación textual autocontenida | MEDIA | `opl-es` |
| Refinamiento no trivial | Descomposición ≥ 2 subprocesos; despliegue ≥ 2 refinadores | ALTA | `manual` |
| Profundidad justificada | Cada nivel de refinamiento agrega ≥ 1 transformado/estado/enlace nuevo | MEDIA | `manual` |
| Procesos ambientales | Procesos de ciclo de vida sin valor funcional directo son ambientales | MEDIA | `manual` |
| Contrato de sub-modelo | Interfaz congelada; sin adiciones post-creación | ALTA | `manual` |
| Frontera propietario/consumidor | Consumidor no renombra ni agrega estados a referencias externas | ALTA | `manual` |
| Plegado en puertos | Usado donde disposición física de componentes es relevante | BAJA | `manual` |
| Objetos implícitos | Objetos implícitos en texto fuente identificados y modelados | ALTA | `manual` |

### B.7 Nivel Requisitos

| Verificación | Condición | Severidad | Capa |
|---|---|---|---|
| Trazabilidad estructural | Si se usan requisitos, enlaces estructurales + `satisface` en OPL-ES | MEDIA | `manual` |

## Parte C — Invariantes visuales derivados de la SSOT visual

Además de los anteriores, los invariantes visuales más críticos cruzados con la auditoría del 2026-04-23:

| # | Invariante | Aplicación | Ref. |
|---|---|---|---|
| IV-01 | Forma: rectángulo (objeto), elipse (proceso), rountangle (estado) | automático | §1.1 |
| IV-02 | Contorno discontinuo ≡ afiliación ambiental | automático | V-2, V-71 |
| IV-03 | Sombra ≡ esencia física; plano ≡ informacional | automático | V-124 |
| IV-04 | Contorno grueso (sw=3) en refinable | automático | V-33, V-69 |
| IV-05 | Estado inicial: borde grueso; final: doble borde | automático | V-6 |
| IV-06 | Estado `porDefecto` declarable y serializable (sin glifo en autoría; reservado a runtime) | automático | V-6, V-237, R-303 |
| IV-07 | Estado `actualPersistente` declarable y serializable (sin glifo en autoría; reservado a runtime) | automático | V-133, V-54, R-309 |
| IV-08 | Vértice del triángulo apunta al refinable | automático | V-3 |
| IV-09 | Topología interna del triángulo preservada (exhibición ≠ agregación) | automático | V-128 |
| IV-10 | Enlaces con estado anclan al rountangle del estado | automático | V-8, V-9 |
| IV-11 | Rayo de invocación con punta cerrada | automático | V-1.5 |
| IV-12 | Rótulo íntegro y contenido en bounding box | automático | V-194, V-195 |
| IV-13 | Auto-viewport en export | automático | V-199 |
| IV-14 | Grid suprimida en canon | automático | V-196 |
| IV-15 | Handles UI distinguibles de piruletas | manual | V-191 |
| IV-16 | Proceso activo no confundible con refinable | manual | V-132 |
| IV-17 | Canon-diagrama sin chrome de edición | automático | V-227 |
| IV-18 | Tiempo fluye arriba→abajo en descomposición | manual | V-35, V-55 |
| IV-19 | Subprocesos paralelos a misma altura | manual | V-32 |
| IV-20 | Prohibición transitiva de refinamiento cíclico | automático | V-100 |

## Parte D — Estado consolidado de conformidad visual

La auditoría visual 2026-04-23
(`docs/design/archive/auditoria-ssot-visual-2026-04-23.md`) es histórica: varios
hallazgos fueron cerrados en ciclos posteriores. Esta tabla es el estado
operativo vigente al 2026-04-25 y prevalece para priorización interna junto
con `BACKLOG.md`.

| # | Estado | Invariante | Dueño / evidencia | Siguiente acción |
|---|---|---|---|---|
| D-01 | cerrado | V-128 topología exhibición ≠ agregación | `BACKLOG.md` OBS-05; `crear-link.ts` + `markers.ts` | Mantener en snapshots/render. |
| D-02 | cerrado | V-3 vértice de triángulo apunta al refinable | `BACKLOG.md` OBS-06; `markers.ts` | Mantener en snapshots/render. |
| D-03 | cerrado | V-8/V-9 enlaces con estado anclan al rountangle | `BACKLOG.md` AUDIT-D03; `pass-enlaces.ts` | Mantener geometrías TS1..TS5. |
| D-04 | cerrado por diseño | V-6/V-54 `porDefecto` y `actualPersistente` | `BACKLOG.md` AUDIT-D04; R-303/R-309 | Glifos reservados a runtime, no al canvas de autoría. |
| D-05 | cerrado | V-1.5 invocación con punta cerrada | `markers.ts` `MARKER_RAYO` | Mantener en snapshots/render. |
| D-06 | abierto | V-35/V-55 orden vertical explícito en descomposición | `src/render/layout/index.ts` deuda de orden Y | Implementar tiebreaker de orden temporal en layout. |
| D-07 | abierto | V-51 envelope proporcional y sin cruces graves | auditoría `ev-ams` SD1.1.1; passes de layout | Ajustar envelope, zonas externas y agrupamiento de agregadores. |
| D-08 | abierto | V-194/V-195 rótulos íntegros y labels sin colisión | `BACKLOG.md` OBS-04; labels `"communicates via"` | Routing/placement con detección de colisión. |
| D-09 | cerrado | V-33/V-69 contorno grueso también para objetos refinables | `crear-cosa.ts` aplica `esRefinable ? 3 : 1.5` | Mantener cobertura latente. |
| D-10 | abierto | V-199 auto-viewport en export canónico | `BACKLOG.md` FEAT-09; export SVG/PDF aún abierto | Resolver dentro de export canónico, no en canvas editable. |

Sprint 0 de aceptación visual agrega el contrato operativo en
`docs/design/archive/aceptacion-visual-opd-opl-2026-04-25.md`.

## Parte E — Checklist operativo de commit

Antes de cualquier commit que afecte render, fixtures o kernel:

- [ ] `bun run check` → verde
- [ ] `bun run check:reglas` → invariantes automáticos con dueño operativo
- [ ] `bun run test` → `N/N iguales` (snapshots)
- [ ] `git diff --stat` coherente con la intención declarada en el commit
- [ ] Si cambió fixture: verificar que no introduce coords hardcodeadas
- [ ] Si cambió render: verificar que respeta una regla `V-*` citada
- [ ] Si cambió kernel: justificar bajo presión múltiple (≥ 2 dominios lo piden)
- [ ] Si cambió dominio/suite: no contaminar roadmap del motor
- [ ] Si cambió SSOT symlink: ADR obligatorio

## Parte F — Aplicabilidad por herramienta

| Capacidad de la herramienta | Invariantes que aplica automáticamente |
|---|---|
| Validador de nombres | I-01, I-02, I-06 |
| Validador de enlaces | I-07..I-14 |
| Validador de refinamiento | I-25, I-20, IV-18..IV-20 |
| Validador de estados | I-15, I-16, I-17 |
| Renderer canónico | IV-01..IV-17 |
| Exportador | V-0..V-0e, V-227, V-233, V-234, V-199 |
| Gestor de sub-modelos | I-28..I-31 |
| Motor de simulación | B.5, IV-16, V-54, V-139 |

## Parte G — Usar esta lista

1. **En PRs**: cada PR que afecte `src/nucleo/`, `src/render/` o fixtures DEBE identificar qué invariantes toca y por qué el cambio los sigue cumpliendo.
2. **En reviews**: cruzar el diff con esta tabla; buscar invariantes implicados; verificar cobertura.
3. **En auditorías periódicas** (ej. trimestrales): ejecutar la verificación B.6 global; documentar hallazgos como deuda o como bug.
4. **En onboarding**: usar esta lista para aprender qué es conformidad vs estilo.

## Referencias cruzadas

- Precedencia de capas: `00-precedencia-autoridad.md`
- Canon y export: `01-canon-exportacion.md`, `63-exportacion-canonica.md`
- Validación operativa: `62-validacion-marcas-error.md`
- Primitivas y forma: `10-primitivas-cosas.md`, `11-estados-designaciones.md`, `12-enlaces-decoraciones-marcas.md`
- Refinamiento: `30-refinamiento-entre-opds.md`
- Navegación e identidad: `40-navegacion-arbol-identidad.md`
- Sub-modelos: `42-sub-modelos-inter-modelo.md`
- Metodología SD/SD1/gobernanza: `80..82`
- Auditoría actual: `docs/design/archive/auditoria-ssot-visual-2026-04-23.md`
- Backlog: `BACKLOG.md`
