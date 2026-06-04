# Deliberación: flujo canónico dominio→OpForja y reconciliación de las dos líneas evolutivas

Fecha: 2026-06-04. Panel: **Besto** (mente-omega + cat-thinking), **Resto** (dov-dori + modelamiento-opm). Moderador: Claude. Modo: **orquestación** (subagentes reales aislados; skill `consenso-deliberativo`). Working files efímeros en `/tmp/mesa-flujo-canonico/`; **esta acta es la canónica**. Resultado: **CONSENSO** (triple aceptación de ambos expertos, ciclo 3).

## Pregunta del operador

Reconciliar las dos líneas evolutivas — **Línea A** (hd-opm: dominio → glosario + proto-modelo MD → `generar-bundle-hodom.ts` → bundle JSON, consumiendo `app/src/autoria/` desde 2026-06-03) y **Línea B** (OpForja: kernel + OPL bisimétrico + canvas + serialización única) — definiendo arquitectura unificada y flujo canónico desde la descripción del dominio hasta OPD/OPL en OpForja, con cumplimiento dual (OPM estricto + extensiones OpForja).

## 1. Síntesis final (v2+v3 consolidada)

### D1 — Arquitectura unificada: tres capas, un pivote formal

- **Capa-puente** (glosario × proto-modelo): las *instancias* viven en cada repo de dominio (`hd-opm/docs/`); la **gramática del sub-dialecto, el normalizador, los checkers y sus fixtures viven en `deep-opm-pro`** (custodio único; candidato a promoción a KORA al estabilizar).
- **Capa-compilador**: `app/src/autoria/` se queda en `deep-opm-pro` y se promueve a **producto de primera clase** — es EL compilador del flujo.
- **Capa-mesa**: OpForja importa, valida, refina interactivo, emite el forward canónico.
- **Pivote-máquina único e intacto**: `deep-opm-pro.modelo.v0` (`app/src/serializacion/json.ts`). No hay segundo esquema.
- Glosario y proto-modelo no son dos documentos sueltos: son las dos componentes de un mismo objeto (producto categorial), ligadas por L5.

### D2 — Proto-modelo: prosa de modelado con OPL incrustado + anclas estructuradas

- Estructura canónica: (i) **encabezados markdown** = árbol de OPDs/refinamientos; (ii) **bloques `opl`** = hechos en sub-dialecto OPL-ES laxo **cerrado por gramática** (no por ejemplos), con semántica **rechaza-con-diagnóstico** (el barro vuelve al humano, nunca se adivina); (iii) **prosa interbloque** = razonamiento del modelador, libre y NO compilable. Regla por defecto: *la prosa nunca se restringe; solo los hechos y las anclas tienen gramática*.
- **Trazabilidad normativa como problema de TIPO, no de enrutamiento**: las anclas legales (`DS art. N`, `NT §X`) y los `[RATIFICAR]` se compilan a un **tipo de primera clase `AnclaNormativa`** (extensión aditiva y opcional del formato; cardinalidad **entidad/enlace/OPD/modelo**; `[RATIFICAR]` = ancla con `estado: pendiente-ratificacion`). Molde de implementación ya existente en el formato: `SatisfaccionRequisito{ target: entidad|enlace }` (`extensiones.ts:32-37`); casillero SSOT: `R-DOC-7`/`R-BR-4`/`V-204` ("contenido meta del autor; no emite OPL nuclear" — no contamina la ontología objeto/proceso/estado).
- **Autoría natural, estructura asistida**: el modelador escribe "causal de exclusión por el DS art. 17" como siempre; el asistente LLM (E2) propone la extracción a estructura; el humano confirma. Fidelidad-experto en la superficie de autoría; estructura en el artefacto compilado.
- Punto de equilibrio laxitud/estructura del sub-dialecto: **decisión del operador en F0**.

### D3 — El compilador: `autoria/compilar/` (cuatro etapas, gaps declarados)

1. **Normalizador** sub-dialecto → OPL-ES estricto (total sobre la gramática; rechaza el resto con diagnóstico).
2. **Lector de estructura** markdown → plan de OPDs/refinamientos vía `refDescomp`/`refDespliegue` del DSL (la jerarquía que el parser reverse rechaza por diseño: `parsear.ts:1123`, sellado por `parser.test.ts:240`).
3. **Parseador de oraciones**: reusa `opl/parser/parsear.ts` (verificado puro: texto→AST con nombres). La resolución nombres→ids es **código net-new** (resolutor incremental por-OPD, análogo al mapa `creadas` de `aplicar.ts:31`) — `planificar.ts` no es reusable (acoplado a modelo vivo).
4. **Emisor** → operaciones del DSL/kernel. Precondición: **inventario de primitivas del DSL contra el catálogo OPL 23/23** (gap ya identificado: abanicos XOR/OR — el DSL no los expone; el kernel sí, vía `formarAbanico`).

Roles fijados: **proto-modelo+compilador = bootstrap multi-OPD desde cero; parser OPL reverse = edición incremental dentro de un OPD en la mesa**. Complementarios, no competidores. El DSL imperativo queda como API programática subyacente y escape hatch declarado.

### D4 — DSL sobre operaciones validadas del kernel

`dsl.ts` se refunda sobre las operaciones `Resultado<Modelo>` (`creacion.ts:39`, `enlaces.ts:88`) — validación incremental en el punto de construcción, como ya hace `opl/parser/aplicar.ts`. El DSL **conserva la asignación de ids** para no alterar el esquema del bundle.

### D5 — Layout único

Núcleo de layout puro en `src/canvas/` (`Modelo × OpdId → PosicionSugerida[]`), adapters batch (autoría) e interactivo (mesa), **una sola tabla de constantes INZOOM** (mata la triplicación `descomposicion.ts:38` / `layoutSugerido.ts:63` / `autoria/layout.ts:10`). Sellado por L4. El núcleo absorbe la colocación de externos por ROL OPM de `autoria/layout.ts:88` (semánticamente superior).

### D6 — Contrato con hd-opm: byte-identidad conservada + re-pin gobernado

1. **La byte-identidad total del bundle v1.6 NO se retira**: hoy está verde (dogfood `diff -q` vacío) y es el oráculo más fuerte disponible. Toda fase que pueda preservarla, debe.
2. **Re-pin gobernado** cuando un cambio deliberado la haga imposible: (i) checks deterministas — canon nativo PASS, round-trip PASS, contención PASS, conteos del generador, OPL forward comparado **bajo vista fija** (condición de validez: el OPL es proyección de modelo×vista — `generar.ts:87,99`); (ii) **validación visual del operador** (Felix formalizado como oráculo de la geometría aprobada); (iii) bump explícito de versión; (iv) commit del nuevo golden con acta. El golden **se re-ancla, nunca se abandona**.
3. Ids domain-deterministas / canonicalización semántica: **opción futura con gatillo**, NO presupuesta (los ids de enlaces/apariciones/abanicos son posicionales: `dsl.ts:194,239,255`, `abanicos.ts:39`).
4. Conteo del golden vivo verificado por conteo directo del JSON: **262/192/433/36**. Los comentarios de control del generador están desactualizados (`generar-bundle-hodom.ts:9` y `:49` discrepan) — **pendiente menor devuelto a hd-opm**.

### D7 — Drift proto↔modelo: semilla con procedencia (tooling futuro, F5)

- El bundle emitido **portará** `{protoHash, glosarioHash, autoriaVersion, layoutVersion}` (no existe hoy; se construye en F5). Staleness definida sobre artefactos estables (hashes de archivos), no sobre ids internos.
- **Hasta F5, el proto-modelo sigue siendo el portador canónico de la trazabilidad legal**: su staleness reporta divergencia sin degradar su autoridad normativa (no es stale-y-descartable).
- "Semilla, no gemelo": el proto origina el modelo; la retro-propagación modelo→proto es evolución futura con gatillos declarados, no sincronía.

### D8 — Flujo canónico con gates estratificados

| Etapa | Artefacto | Gate | Responsable |
|---|---|---|---|
| E0 Anclar función | propósito raíz + beneficiario + **≥3 conceptos de solución (A0.1)** + **clasificación del sistema (A1.2)** + SD0 | función transformadora con un solo verbo; divergencia antes de converger | **humano** (LLM propone conceptos) |
| E1 Glosario | términos con rol/esencia/afiliación + relaciones | sin barro; cada término destinado al modelo | **LLM** (`modelamiento-opm`) + humano confirma |
| E2 Proto-modelo | markdown D2 (incl. anclas inline naturales → extracción asistida) | bimodalidad de cada hecho; refinamiento motivado; sub-dialecto válido | **LLM** propone, **humano** valida |
| E3 Alineación | reporte glosario↔proto | L5 sin huérfanos, bidireccional | **checker determinista** + LLM semántico |
| E4 Compilación | `…modelo.v0.json` + `.opl` (+ procedencia desde F5) | L1; L2; `validarModelo` PASS; canon nativo; L8 | **checker determinista** |
| E5 Importación | pestaña en OpForja | `validarReferenciasOpd`; R-CAT-EQ | **kernel/leyes** |
| E6 Refinamiento | modelo editado + OPL forward | diagnóstico tripartito; staleness declarada (desde F5) | **mesa** + LLM crítica conceptual |

El "asistente al modelador" = skill `modelamiento-opm` operando en E1/E2 sobre el repo de dominio; el asistente in-app de OpForja asiste en E6. Factorización epistémica: **verificar = determinista; validar = LLM + humano; servir = humano**.

### D9 — Leyes que sellan los contratos (todas falsificables con fixture negativo)

| Ley | Contenido |
|---|---|
| L1 | Normalizador total e idempotente sobre la gramática cerrada del sub-dialecto; rechaza-con-diagnóstico fuera de ella. Falsación primera: corpus de 52 bloques `opl` de hd-opm v1.9 |
| L2 | `compilar(proto)` preserva hechos — **acotada a clases con operación-destino**; registro público de exclusiones: abanicos (hasta primitiva DSL, F4) y clase-ancla (hasta `AnclaNormativa`, F5). Ninguna exclusión silenciosa |
| L3 | Golden total de bytes hd-opm + protocolo de re-pin gobernado (D6) |
| L4 | Layout único: batch ≡ interactivo para el mismo Modelo; una sola tabla INZOOM |
| L5 | Alineación glosario↔proto: todo término con ≥1 hecho y viceversa |
| L6 | Procedencia y staleness (futura, F5) |
| L7 | Contención de refinamiento elevada a ley nombrada (desde `bundle.ts` `verificarContencion`) |
| L8 | Toda ancla normativa del proto se compila a `AnclaNormativa` de primera clase (entidad/enlace/OPD/modelo), enumerable y exhibida estructurada. **Hasta F5: trazabilidad nivel-hecho DECLARADA FUERA DE LA GARANTÍA. RR-3 resuelta en diseño, diferida en ejecución** |

### D10 — Plan de transición (ninguna fase rompe a hd-opm)

| Fase | Contenido | Gate |
|---|---|---|
| **F0** | Gramática cerrada del sub-dialecto + normalizador-prototipo sobre los 52 bloques de hd-opm + inventario de primitivas DSL vs catálogo OPL + **diseño de `AnclaNormativa`** (sobre el molde `SatisfaccionRequisito{target}`) + **decisión del operador: punto laxitud/estructura** | cobertura medida o rediseño; inventario publicado |
| **F1** | Protocolo de re-pin gobernado documentado (D6) | protocolo aprobado por el operador |
| **F2** | Layout único (D5) | byte-identidad si el algoritmo se preserva; cambio deliberado → re-pin |
| **F3** | DSL sobre kernel (D4), conservando esquema de ids | byte-identidad; cambio de ids → re-pin con oráculo compuesto bajo vista fija |
| **F4** | `autoria/compilar/`: primitivas faltantes al DSL → normalizador → lector de estructura → resolutor incremental → emisor; hd-opm migra OPD-por-OPD | L1+L2+L3 verdes por OPD migrado |
| **F5** | Procedencia/staleness (L6) + **implementación `AnclaNormativa`** (kernel/serialización/compilador/checker L8 + exhibición read-only en mesa) + registro [RATIFICAR] | fixture negativo de cada ley falla como debe; un ancla nivel-enlace real de hd-opm round-tripea estructurada |

Restricción de implementación F5 (consignada por Resto): el OPL forward de un ancla sigue la disciplina `R-BR-4`/`R-DOC-7` — capa meta declarada (a lo sumo estilo `«…»`), nunca oración OPL nuclear.

## 2. Razonamiento consolidado

- **F2 (propuestas independientes)**: Besto propuso colapsar el "doble-F" haciendo del OPL-ES canónico la fuente, compilada por una **extensión batch del parser reverse**; Resto propuso proto-modelo como **modalidad-puente laxa** (sub-dialecto normalizable) compilada por **`autoria/`**, con el reverse acotado a edición en mesa.
- **F3 (críticas cruzadas)**: Resto demostró con evidencia dura que el parser reverse **rechaza refinamientos desde OPL libre por diseño** (`parsear.ts:1123`; 45 oraciones de refinamiento arman los 36 OPDs de hd-opm) y que el proto-modelo real es ~70% prosa normativa no-OPL (O-R1). **Besto verificó la evidencia y declaró caído el mecanismo central de su propia propuesta** — lealtad a la verdad estructural. A su vez, Besto abrió la única crítica de la fase contra Resto (O-B2): el funtor OPL-estricto→`autoria/` no existía y reintroducía el doble-F; más cuatro mayores (totalidad de la normalización no probada; drift sin ley; descentralización con derivación inválida; golden de bytes frágil).
- **F4-F6 (síntesis y ciclos)**: la síntesis v1 resolvió O-B2 con el compilador de 4 etapas, pero **inventó un "golden semántico sin geometría" que el panel demolió en ciclo 1** (7 críticas: ids posicionales `dsl.ts:194,239,255`; `Apariencia` funde geometría con semántica de vista; OPL forward es vista-dependiente; DSL sin primitiva de abanico; trazabilidad normativa sin ley; oráculo verde retirado por uno inconstruible). La v2 corrigió conservando la byte-identidad + re-pin gobernado, pero su L8 enrutó las anclas por un canal inexistente (`reporteExtra` no entra al bundle — `bundle.ts:143`; `modelo.descripcion` colapsa por `join(" ")`; los enlaces no tienen campo) — **ambos expertos encontraron el mismo hecho**; Resto lo sostuvo como crítica porque v2 reclamaba cerrar RR-3 sin instanciar la estructura. La v3 reparó por la rama correcta (problema de **tipo**, no de enrutamiento): `AnclaNormativa` de primera clase + honestidad "resuelta en diseño, diferida en ejecución".
- **Ciclo 3**: ninguna objeción crítica ni menor nueva. Besto verificó que la extensión aditiva compone con D6 (serialización allowlist-por-construcción = funtor de inclusión fiel; byte-identidad sobre opcional ausente). Resto verificó el casillero SSOT (`R-DOC-7`/`V-204`) y el molde vivo (`<<Requirement>>`). **Triple aceptación de ambos.**
- Correcciones notables del proceso: Besto retiró su propia RB-2 tras recontar el JSON vivo (262/192/433/36 — los comentarios del generador eran los stale); la síntesis v1 del moderador fue demolida dos veces y reconstruida desde la evidencia del panel.

## 3. Aportes por experto

### Besto (mente-omega + cat-thinking)
- Diagnóstico del **doble-F** (dos compiladores sin ley de preservación) como anti-patrón raíz de la divergencia entre líneas.
- **O-B2** (única crítica de F3): el funtor OPL-estricto→`autoria/` faltante — forzó el diseño explícito del compilador de 4 etapas.
- Exigencia de **gramática cerrada** (no por ejemplos) para la totalidad del normalizador (O-B1) y de **ley de drift** (O-B3) → L6.
- Demolición del golden semántico v1: **RB-1** (ids posicionales, N5), RB-4 (no retirar un oráculo verde por uno inconstruible) — dio la forma final de D6.
- Verificación de la **composición aditiva** `AnclaNormativa`↔D6 (allowlist faithful, ciclo 3).
- Concesión ejemplar: verificó la evidencia contraria y declaró falso su propio mecanismo central (F3); retiró RB-2 con recuento directo (c2).

### Resto (dov-dori + modelamiento-opm)
- **Función-como-semilla del sistema de modelamiento** (transformar conocimiento experto en modelo OPM renderizable conservando trazabilidad) — el ancla teleológica de toda la síntesis.
- **Evidencia decisiva de F3**: el parser reverse no construye jerarquía de OPDs por diseño (`parsear.ts:1123`) → fijó los roles bootstrap/mantenimiento.
- **O-R1**: el proto-modelo real es prosa de modelado normativa con OPL incrustado, no "OPL con ruido" → fijó D2.
- **RR-2**: el OPL forward es proyección de modelo×vista (`generar.ts:87,99`) → condición "bajo vista fija" del oráculo de re-pin.
- **RR2-1/RR2-2** (crítica del ciclo 2): la trazabilidad es problema de tipo, no de enrutamiento → `AnclaNormativa`; y el hallazgo SSOT que la legitima (`R-DOC-7`/`V-204`, molde `SatisfaccionRequisito`).
- Tabla E0-E6 de gates con responsables; detección de la omisión metodológica A0.1/A1.2 (RR-5); honestidad temporal de L6 (RR-6).

## 4. Supuestos aceptados

| Supuesto | Levantado por | Por qué se acepta |
|---|---|---|
| El sub-dialecto laxo es normalizable por función determinista a OPL-estricto | Resto | Condicionado a gramática cerrada (Besto O-B1) y a falsación empírica sobre los 52 bloques de hd-opm ANTES de construir encima (gate F0) |
| `autoria/` es dominio-agnóstica (sin acoplamiento HODOM residual) | Resto | Verificado por Besto en F3 (grep exhaustivo sin coincidencias) |
| La extensión aditiva del formato no rompe bundles existentes | Moderador/v3 | Demostrado por Besto en c3: serialización allowlist-por-construcción; precedente `abanicos ?? {}` |
| hd-opm migra incrementalmente; el DSL convive con el compilador hasta L1+L2+L3 verdes por OPD | Besto | Aceptado por ambos; gate F4 |
| El operador acepta proto/glosario en el repo de dominio con formato custodiado centralmente | Resto + resolución D1 | Preserva dependencias y evita fragmentación (O-B4) |

## 5. Riesgos pendientes

| Riesgo | Levantado por | Severidad | Mitigación |
|---|---|---|---|
| La gramática cerrada no cubre el dominio real → flujo atascado en traducción manual | Resto (F2) | Alta | F0 mide cobertura sobre corpus real ANTES de construir; rechaza-con-diagnóstico devuelve el barro al humano |
| Clase-ancla y abanicos fuera de L2 hasta F4/F5 — deuda visible pero real | Resto RR2-4 / Besto RB-5 | Media | Registro público de exclusiones; gates de F4/F5 los reincorporan |
| Re-pin gobernado nunca ejercido bajo cambio real de layout (operabilidad no probada) | ambos (c2/c3) | Media | Primer ejercicio real en F2 como confirmación |
| Promover `autoria/` a producto crea superficie de mantenimiento que compite con la mesa | Resto (F2) | Media | Leyes L3/L4 como red; alcance acotado a compilador+layout |
| Techo localStorage de OpForja (~5-10MB; v1.6 = 654KB → ~7-15 modelos escala-HODOM con versiones) | Moderador (dossier) | Media | No bloquea E5; conecta con auditoría de persistencia EN PAUSA (`2026-06-04-persistencia-backend.md`) |
| Comentarios de conteo de hd-opm desactualizados (golden vivo = 262/192/433/36) | Besto RB-2/c2 | Baja | Pendiente menor devuelto a hd-opm |

## 6. Incertidumbres

- **Cobertura real del sub-dialecto**: no se sabrá hasta F0 (corpus de 52 bloques). Si la cobertura es baja, D2 exige rediseño del punto laxitud/estructura — decisión reservada al operador.
- **Forma final de `AnclaNormativa`**: comprometida la cardinalidad y el carácter meta (no-nuclear); la forma concreta se diseña en F0 sobre el molde `SatisfaccionRequisito`.
- **Cuántas primitivas faltan al DSL** además de abanicos: el inventario F0 lo dirá; L2 nace acotada a propósito.
- La divergencia de confianza entre expertos es mínima (0.88 vs 0.85) y ambos señalan las mismas tres confirmaciones de operabilidad pendientes — no hay riesgo que un experto vea y el otro no.

## 7. Confianza por experto

| Experto | Confianza | Justificación | Qué la subiría |
|---|---|---|---|
| Besto | **N4-alto (0.88)** | Cuerpo D1/D3/D4/D5/D8/L4/L5/L7 N5; D6+compatibilidad aditiva N5 (demostrada en serialización); L8/D2-anclas N4 (tipo aún no implementado, por construcción) | F5 con fixture round-trip nivel-enlace verde; primer re-pin real en F2; conteos hd-opm reconciliados |
| Resto | **N4 (0.85)** | Diseño ontológicamente correcto con casillero SSOT y molde vivo; lo que resta es ejecución, no diseño | F0 entregando `AnclaNormativa` sobre el molde existente; round-trip estructurado del ancla «frontera clínico↔programa (excl. art. 17)»; re-pin ejercido |

(No se promedia; la cercanía de ambos niveles con idénticas condiciones de subida es señal de convergencia genuina, no de cortesía.)

## 8. Metadatos de la deliberación

- modo de realización: **orquestación** (8 subagentes reales aislados a lo largo de 4 fases)
- ciclos de refutación ejecutados: **3 / max 3**
- objeciones críticas resueltas: **9** (1 en F3 [O-B2] + 7 en ciclo 1 [RB-1,3,4,5; RR-1,2,3] + 1 en ciclo 2 [RR2-1/2])
- objeciones menores registradas: **8** (entre ellas: L2 acotada, conteos hd-opm, tensión laxitud/estructura, restricción OPL-meta de anclas)
- concesiones cruzadas: Besto retiró su mecanismo central (F3) y su RB-2 (c2); Resto aceptó la condición de gramática cerrada (O-B1) y la custodia central del formato (O-B4)
- resultado: **CONSENSO** — triple aceptación registrada de ambos expertos (Besto c2 ratificada en c3; Resto c3)
- decisiones reservadas al operador (HITL): (1) punto de equilibrio laxitud/estructura del sub-dialecto (F0); (2) aprobación del protocolo de re-pin (F1); (3) prioridad del plan F0-F5 frente al backlog vigente

## Adenda — Resolución HITL del operador (2026-06-04, mismo día)

Felix resolvió las tres decisiones reservadas:

1. **Laxitud del sub-dialecto: "bastante libre".** Consecuencia de diseño para F0: la gramática se diseña AMPLIA (múltiples variantes de superficie por tipo de hecho), el peso se desplaza hacia el normalizador y la extracción asistida por LLM (que propone, el humano confirma), y el rechaza-con-diagnóstico sigue siendo la frontera dura. El gate de F0 (cobertura sobre los 52 bloques de hd-opm) se mide con la gramática amplia; si la libertad rompe la totalidad de L1, el rediseño vuelve al operador.
2. **Protocolo de re-pin: APROBADO** en principio. F1 queda reducida a documentarlo; el primer ejercicio natural es la validación visual pendiente del bundle v1.6 (hito ya declarado en hd-opm).
3. **Backlog: contingencial.** El backlog previo (HU v2 + `cortes-operativos.md` 2026-05-07) queda **congelado operativamente, no eliminado**. El corte vigente pasa a ser `docs/roadmap/backlog-contingencial.md`, derivado de esta acta + las tres funciones OpCloud validadas como candidatas in-app deterministas (ontología organizacional, requirement views, stereotypes/requisitos).

**Aclaración del operador (mismo día, posterior a la adenda):** la asistencia AI y el wizard permanecen **FUERA de la app** — se ratifica la decisión EPICA-34→delta de cortes-operativos 2026-05-07 (anulando un pivot in-app tentativo considerado más temprano). El flujo E0-E2 opera vía skill externa (`modelamiento-opm` en Claude Code sobre el repo de dominio); OpForja participa desde E5 (importación) en adelante. Sin proxy LLM en alcance.

**Refinamiento EQUILIBRIO (mismo día):** el operador pidió equilibrio — que lo generado por la skill **se pueda ver y gestionar en la app**. Resolución: *el LLM genera afuera; la app ve y gestiona los artefactos adentro*. Los artefactos de la skill (glosario, reporte de compilación, anclas, registro [RATIFICAR], procedencia) viajan con el bundle como **paquete de dominio** con superficie de gestión en OpForja; la gestión in-app se exporta como log de decisiones/divergencias que alimenta la siguiente ronda de la skill (**ciclo de re-elicitación**). Detalle operativo en W6 del backlog contingencial.
