# Dossier — documentación de producto y decisiones de opforja

**Área:** documentación de producto, método, decisiones, especificaciones y dirección
(`README.md`, `AGENTS.md`, `HANDOFF.md`, `NOTICE.md`, `docs/manual-opforja.md`,
`docs/uso-productivo.md`, `docs/manual-{sistemas,software,sanitarios}-opm.md`,
`docs/JOYAS.md`, `docs/specs/`, `docs/decisiones/`, `docs/roadmap/`,
`docs/superpowers/`, `docs/memorias-aprendizajes/`, `docs/render-headless.md`,
`docs/verify-reproducible.md`, `docs/cheatsheets/README.md`), más lectura de apoyo
de `docs/auditorias/` (actas que fundan decisiones), `docs/canon-opm/`,
`docs/bugs/HISTORY.md` (voz real del usuario) y de las leyes que gobiernan el corpus
(`app/src/leyes/corpus-documental.test.ts`, `manual-limites.test.ts`).

**Fecha del estudio:** 2026-09-30. **Base:** `main` en `8ada528`.

**Límites del estudio (declarados):**

- El clon es *shallow*: `git log` muestra solo 69 commits, desde 2026-07-26. La historia
  previa (abril–julio 2026) se reconstruye desde fechas y actas en `docs/`, el archivo
  de bugs (122 reportes desde 2026-05-13) y referencias cruzadas; no desde Git.
- El corpus KORA (SSOT de reglas OPM/Forja) **no está disponible** en este entorno
  (`/home/felix/...` no existe). Las reglas `R-*` se catalogan por su cita en los
  documentos y por los identificadores que el código implementa; no se leyó su texto
  normativo.
- Ejecuté (solo lectura, `bun -e`) la reproducción del §17 de la spec del producto
  integrado: la brecha de habilitadores **ya está cerrada** en el código actual
  (resultado `bloqueado`, diagnóstico «En espera: Vehiculo está en no disponible; el
  enlace requiere disponible»).

---

## 1. Propósito del producto (lo que no debe perderse)

### 1.1 Enunciado nuclear

`README.md:3-6`: «Modelador web de OPM/ISO 19450 para construir, revisar y mantener un
mismo modelo mediante sus dos expresiones coordinadas: el diagrama OPD y el lenguaje
OPL. Resuelve la brecha entre dibujar un sistema, describirlo con precisión y
conservar un artefacto persistente, verificable y exportable.»

`docs/manual-opforja.md:51-61` (§0) lo afina con la frase más importante de todo el
corpus: *opforja no es un dibujador genérico: una figura en el canvas vale solo si
porta un hecho OPM válido y ese hecho puede expresarse en OPL. Tampoco descubre la
verdad del dominio: las fuentes aportan evidencia e hipótesis, el dueño humano las
ratifica y opforja custodia que el significado aceptado se exprese con primitivas OPM
correctas.*

La promesa del Tutor (`superpowers/specs/2026-07-21-tutor-contextual-opforja-design.md`
§1) resume el reparto de autoridad: **«opforja custodia el formalismo, enseña el método
y hace visibles las consecuencias; el operador conserva la autoría del significado del
dominio».**

La spec objetivo (`docs/specs/opforja-producto-integrado.md:3`) propone una promesa
nueva: **«comprende lo que cambias»**, con unidad de trabajo «documento de sistema»
(`:13`).

### 1.2 Frontera estable (se repite coherentemente en todo el corpus)

| Dentro | Fuera |
|---|---|
| autoría bimodal OPD/OPL sobre un solo modelo | ser fuente de verdad de modelos de dominio (`AGENTS.md` Misión) |
| validación y diagnóstico por planos | ejecutar procesos reales, pipelines, despliegues (`manual-sistemas-opm.md` §1.1, §9.3) |
| persistencia, versiones, exportación reproducible | ingerir/interpretar automáticamente una base documental (§2.1, §9.3) |
| refinamiento con frontera preservada | ratificar hipótesis o inferir requisitos sin humano |
| reuso de piezas con procedencia | coedición multiusuario en tiempo real (§9.3; `uso-productivo.md:347`) |
| simulación conceptual (y muestreo numérico) | calcular colas, capacidad o analítica especializada (`manual-sanitarios-opm.md` §9) |
| trabajo con agentes bajo contratos | codegen o roundtrip código↔modelo (`manual-software-opm.md` §4.6, §7.4) |

La spec integrada añade fuera de alcance: marketplace, publicación autónoma,
simulación empresarial general, conversión universal entre formalismos (`:35`).

### 1.3 Separación de materiales (`NOTICE.md`)

- Código propio del modelador en `app/`; kernel OPM en `app/src/modelo/`; JointJS OSS
  «como adaptador de render».
- `assets/`, `config/`, `catalog/`, `fixtures/`, `webroot/`, `opm-extracted/` son
  evidencia observacional de OPCloud: **no se copia implementación** a `app/`.
- **Sin licencia open-source declarada.** Cualquier redistribución exige revisar
  licencias y material observacional. Esta restricción debe sobrevivir a la
  reescritura.

---

## 2. Usuarios reales y necesidades

### 2.1 Usuarios declarados vs. usuarios observados

Declarados (spec integrada `:21-27`): autor/modelador, especialista de dominio,
lector/revisor, responsable del documento, mantenedor de producto y corpus. Los
manuales apuntan además a agentes de IA, equipos de transformación, salubristas e
ingenieros de software.

Observados en la evidencia:

- **Un operador único y experto** (Félix): el `auth-identidad-v1.md` D1 lo dice sin
  ambigüedad («identidad durable single-operator»); el puente mesa↔skill fija
  «Usuario objetivo: Félix, experto, en el bucle skill↔mesa» (§2). Los 122 bugs del
  histórico son suyos. Modela sistemas sanitarios grandes (HODOM: 262 entidades,
  192 estados, 433 enlaces, 36 OPDs — acta 2026-06-04 D6.4) y una biblioteca de tipos
  (gist).
- **Agentes de software** que operan el producto desde fuera: la skill
  `modelamiento-opm` (Claude Code/Codex/OpenCode) vía portapapeles W6.0, CLI `mesa`,
  `render:headless` y `verify:reproducible`.
- **Novatos: sin evidencia.** Toda la ingeniería pedagógica (Tutor, 16 hojas rápidas,
  cinco manuales) apunta a usuarios que no aparecen en ningún registro. La evaluación
  con cinco personas (A01, T9) sigue pendiente (`roadmap/implementacion-producto-integrado.md:139-142`).

**Implicación para la reescritura:** diseñar para el experto que modela modelos
grandes, con buena legibilidad para un lector ocasional; no presuponer una audiencia
masiva de principiantes.

### 2.2 Necesidades extraídas del histórico de bugs (voz del usuario)

`docs/bugs/HISTORY.md` (114 bugs, 8 features, 2026-05-13 → 2026-07-09) muestra qué
duele de verdad. Agrupado:

1. **Fidelidad visual canónica OPM** (≈20 reportes): flechas de enlaces
   transformadores, marcador de autoinvocación, sombras de cosas físicas, forma de
   estados, contorno de procesos sistémicos refinados, anclaje centrado de enlaces,
   paridad de multiplicidad con OPCloud. → *El OPD debe verse como OPM canónico.*
2. **OPL correcto y completo** (≈15): multiplicidades, modificadores, enlaces
   estado-especificados, «cambia objeto a/desde estado», OPL que no desaparece por
   nombres no canónicos, OPL de Bocetos. → *OPL-ES fiel, siempre emitido.*
3. **Manipulación directa de estados y enlaces** (≈20): enlaces desde/hacia estados,
   mover/redimensionar estados dentro del objeto, «estado volador», split de enlace
   de efecto en par entrada/salida. → *El canvas debe tratar estados como extremos de
   primera clase.*
4. **Foco y navegación** (≈10): vista que se resetea al renombrar o refinar, crear la
   primera cosa en el centro, canvas infinito, breadcrumbs solapados, gesto que
   retrocede el navegador.
5. **Sustracción de chrome** (≈10): «saquemos el botón de paleta», «eliminar la barra
   inferior», «elimina todo el sistema de hover inferior», «sacar el mapa del
   sistema», «función de 100% canvas», paneles redimensionables y ocultables.
6. **Simulación** (≈10): rutas (paths), probabilidades en UI, estado inicial/final
   visible, pasos que se detienen a medio camino.
7. **Persistencia** (varios): «no puedo guardar», migración desde localStorage a
   backend.

Estas siete familias son más confiables como guía de producto que cualquier panel
deliberativo del corpus.

---

## 3. El método Forja (conocimiento durable)

Fuente de uso: `docs/manual-opforja.md` §1–§10; SSOT externa
`urn:fxsl:kb:metodologia-forja-opm-es` (v1.7.0 según `canon-opm/resolutor-urn.json`).
Resumen fiel de lo que el producto debe soportar:

### 3.1 Modelo mental mínimo (`manual-opforja.md:80-116`)

- **Función antes que forma**: todo modelo converge en la transformación que entrega
  valor y a quién; neutral respecto de la solución («cruzar el río», no «construir
  puente»).
- **Objeto existe / proceso transforma / estado es situación posible de un objeto.**
  Pregunta fundacional: ¿existe o sucede?
- **Transformee vs habilitador**: el transformee se consume, produce, crea, destruye o
  cambia; el **agente es exclusivamente persona o grupo de personas** (R-AG-1;
  software, IA, sensores y organizaciones abstractas no lo son, R-AG-1A/R-AG-1B,
  `:92-97`); el instrumento habilita sin transformarse.
- **OPD y OPL son dos caras del mismo hecho** (`:99-101`).
- **Refinamiento**: in-zoom/out-zoom (procesos), unfold/fold (estructura); la
  descomposición válida conserva la firma de frontera (`:103-105`).
- **Barro ontológico** (`:107-111`): ambigüedad que vuelve caro o falso el siguiente
  paso; conducta correcta = detenerse, nombrarlo, citar la regla, preguntar.
- **Siete preguntas antes de plasmar** (`:113-116`).

### 3.2 Flujo A0–A8 (`manual-opforja.md:120-165`)

A0 alternativas (≥3 conceptos) · A1 clasificación del sistema (artificial, natural,
social, sociotécnico) · **A1.5 dos arranques hermanos**: SD-primero y bottom-up por
Bocetos que se integran después · A2 construcción del SD en etapas 0–11 con compuerta
PASA/FALLA · A3 primer refinamiento que responde una pregunta (≥5 subprocesos = revisar
altitud) · A4 complejidad por OPDs conectados · A5 heurísticas · A6 control de flujo
solo si responde una pregunta de ejecución · A7 requisitos/errores/cuantitativo
(inferido no es norma) · **A8 validación tripartita**: bloqueos estructurales (no
avanzar) / mejoras metodológicas (avanzar con deuda declarada) / estilo; la validación
del stakeholder es una marca separada; los barridos de integridad se hacen sobre el
JSON canónico, no sobre el OPL emitido.

### 3.3 Dos ejes de exploración (`manual-opforja.md:167-184`)

- **Apunte** relaja el *cierre* (validez → observación al margen).
- **Bosquejo/Boceto** relaja el *orden de arranque* (OPDs sin padre).
- **La integridad referencial nunca se relaja.**
- Un Boceto sin integrar: en apunte se informa; en modelo **bloquea el export
  canónico**. Graduar no integra Bocetos. Reabrir en Taller es la inversa de graduar.

### 3.4 Construcción desde cero y refinamiento (§4–§5)

Once pasos del SD (`:220-241`) y la plantilla de cierre. Refinar declara qué se
refina, qué pregunta responde, qué frontera conserva, qué enlaces se distribuyen, qué
hechos se expresan/suprimen y qué OPL confirma la equivalencia (`:249-272`). Cuándo no
refinar (`:270-272`).

### 3.5 Diagnóstico honesto por planos (§8, `:503-515`)

validez · modalidad OPD · modalidad OPL · método · herramienta (brecha declarada,
R-CONF-7) · dominio (falta evidencia del operador). Checklist de cierre en `:511-515`.

### 3.6 Método extendido (manual de sistemas)

Durable y valioso, pero **más allá del producto**: ciclo
`evidencia → AS-IS → necesidad → alternativas → TO-BE → intervención → adopción →
evidencia → aprendizaje → mantenimiento o retiro` (`manual-sistemas-opm.md` §0);
ledger de evidencia (§2.2); ficha de trabajo (§2.3); brújula de cinco preguntas
(§3.1); AS-IS/TO-BE/TRANSICIÓN separados (§3.4); necesidad = beneficiario + cambio de
estado + condición + medida (§3.5); **sobre de autonomía** Decidir/Proponer/Elevar/No
hacer (§5.2, línea 501); «paralelizar ejecución, serializar significado» (§5.3); unidad
mínima delegable (§5.4); paquete de relevo (§5.6); gates PASS/N/A/WAIVER (§6.2).

---

## 4. Historia y decisiones que moldearon el producto (con su porqué)

Cronología reconstruida. Cada fila indica decisión, razón y si sigue vigente.

| Fecha | Decisión | Porqué | Vigencia |
|---|---|---|---|
| 2026-04-28 | Ingeniería inversa de OPCloud (`JOYAS.md`): colores, dimensiones 135×60, markers, router manhattan `padding:5 step:11`, puertos, wrapper de 15 px para hit-area, plantillas OPL | Paridad visual y semántica con la herramienta de referencia sin copiar código | Vigente como referencia; el render actual es propio (`ui-forja`) |
| 2026-05 | Reportes de bugs capturados in-app a `docs/bugs/` | Operador único prueba y reporta con screenshots para agentes | Sistema aún activo; índice sin bugs activos |
| 2026-06-04 | **Flujo canónico dominio→mesa** (acta): proto-modelo Markdown con OPL incrustado + compilador `app/src/autoria/` + pivote único `deep-opm-pro.modelo.v0`; byte-identidad del bundle HODOM como oráculo; re-pin gobernado; `AnclaNormativa` como tipo | Reconciliar dos líneas (hd-opm generaba bundles; opforja editaba) sin segundo esquema | Vigente en código (`autoria/`, sello de procedencia) |
| 2026-06-04 | **EQUILIBRIO**: asistencia IA y wizard **fuera** de la app; «el LLM genera afuera; la app ve y gestiona adentro» | Kernel determinista; la skill externa conduce E0–E2 | **Revertida** el 2026-09-23 (agente integrado) |
| 2026-06-04 | Persistencia a backend PostgreSQL (acta persistencia) | Techo de localStorage (~5–10 MB) con modelos escala HODOM | Vigente |
| 2026-06-10 | **Auth v1** single-operator (email+password scrypt, registro cerrado, cookie HMAC, tenant) | Recuperar el tenant desde cualquier navegador; re-proteger la instancia | Vigente |
| 2026-06-14/15 | **`Opd.ordenInzoom: Id[][]`** (bandas con cardinalidad) + sincronización canvas→campo | R-INV-2B prohíbe dibujar invocación implícita; el rayo era «doble vara» | Vigente; alta calidad |
| 2026-06-23 | D7 «modo boceto/pizarra» (garabato no-OPM dentro de un OPD) **revertido** | «no resultó como quería»: primitivas no-OPM contaminan el modelo | Lección durable: nada de dibujo libre |
| 2026-06-24→30 | **Reuso**: Calcar (copia desacoplada) / Anclar (referencia vigilada) / Pieza / Soltar; Centinela de Drift; Puerta de Anclaje; drift granular por pieza | Comparabilidad entre modelos que comparten tipos (gist ↔ HODOM) sin mutar esencia | Vigente, pero luego duplicado por `modelo/reuse/` (sept.) |
| 2026-06-30 | **Modo apunte**: flag `esApunte` gemelo de `esBiblioteca`; degradación por clase con whitelist fail-closed | Pensar en OPM legítimo sin que el rigor de cierre interrumpa | Vigente (línea dura) |
| 2026-07-06 | Apuntes + Taller bottom-up; «todo nace apunte»; constructor único `establecerRefinamiento`; puente mesa↔skill (CLI `mesa pull/push`) | Bosquejar sin ceremonia; que la skill lea/escriba sin transportar bytes | Parcialmente reemplazado (ver 07-27) |
| 2026-07-18 | Protocolo 2.0 del puente: `Testigo-Base`, commit atómico, Bearer de mínimo privilegio; CAS separado para modelo y workspace; épocas de sesión | El 409 antiguo no protegía un bundle nacido de un pull anterior (lección refutada en `notas-vitrina.md`) | Vigente |
| 2026-07-21 | **Tutor contextual** determinista (una voz por intención; callar/confirmar/orientar/preguntar/bloquear) | Enseñar el método en el punto de la decisión sin chat | Vigente (≈5,8 k líneas en `app/src/tutor/`) |
| 2026-07-27 | **Ciclo reversible**: Taller/Apunte ⇄ Modelos/Modelo; Boceto ⇄ OPD integrado; Biblioteca como rol; Archivo como retención | «Taller» nombraba dos escalas; graduar no tenía inversa | Vigente; contrato mejor escrito del área |
| 2026-08-09 | Saneo documental: retiro a `_archivo/` de specs, auditorías, notas | Reducir corpus sin consumidores | Vigente |
| 2026-09-02→09 | Familias de efectos por preestado; declaraciones no nucleares; mesa de exploración (fuente+propuesta hasta confirmar) | Casos reales de modelado | Vigente |
| 2026-09-10 | **Spec del producto integrado** (A01–A24): agente en tiempo real constitutivo desde I1 | Encargo del operador: «integrar el agente y optimizar el producto» | Candidato implementado (commit `8ada528`, 194 archivos, +24 703 líneas), **no desplegado** |
| 2026-09-23 | EQUILIBRIO revisado; evaluación de Jev (3 llamadas reales) | Validar un clasificador tipado como apoyo | Jev fuera de la ruta obligatoria |
| 2026-09-30 | Candidato consolidado; pendiente clave del proveedor (`mimo-v2.6-pro`) | — | `HANDOFF.md` abierto |

**Patrón de la historia:** muchas decisiones de interfaz se revierten en días o
semanas, cada una justificada por un «panel» de personas sintéticas:

- Centinela D2 «sincronizado NO se marca» (06-26) → chip de tres estados que sí lo
  marca (06-29, `gesto-anclar-puerta-design.md` §2(c)).
- Modo apunte corrección 8 «promoción = ausencia de sección, sin UI propia de
  graduación» (06-30) → diálogo de graduación de cuatro planos con «Graduar con
  pendientes» (07-27).
- Apuntes-Taller §6 «Trabajo = apuntes y modelos juntos; el ítem no salta» (07-06) →
  Taller y Modelos separados (07-27).
- «Taller» = banda de OPDs sueltos (07-06) → «Taller» = espacio de Apuntes y «Bocetos»
  = banda local (07-27).
- EQUILIBRIO «IA fuera de la app, sin proxy LLM» (06-04) → servicio agéntico dentro
  del producto (09-23).

Las **invariantes semánticas** (integridad nunca degrada, identidad conservada,
una dimensión por transición, validez por whitelist) sobrevivieron a todas las
reversiones: son lo portable. La **superficie** (nombres, zonas, chips) fue inestable.

---

## 5. La dirección «producto integrado»

### 5.1 Qué propone (`docs/specs/opforja-producto-integrado.md`)

- **Documento de sistema** con propósito, identidad, declaraciones, vistas, fuentes,
  asuntos abiertos y revisiones (`:13`).
- **Agencia integrada desde el primer incremento** (`:15-17`): intención persistente,
  herramientas, eventos, corrección durante ejecución, cierre. «Esta decisión sustituye
  la secuencia anterior que situaba la ayuda integrada al final.»
- **Superficie**: el sistema ocupa el foco; OPL coordinado con nivel y selección;
  entrada «Qué quieres conseguir»; índice y propiedades contextuales, «no son tres
  columnas obligatorias» (`:101-105`). Laptop de 13" para autoría; teléfono para
  lectura y observación (`:127`).
- Tabla de gestos (`:107-117`): tocar, renombrar desde OPD u OPL, cambiar relación
  desde su frase, **Ver por dentro (navegar) ≠ Describir por dentro (crear
  refinamiento)**, Detener, Ensayar, Compartir.
- Teclado: Enter confirma, Escape abandona, Cmd/Ctrl+Z deshace la última intención
  (`:123`). Una propuesta **no mueve el viewport** (`:125`).

### 5.2 Requisitos que conviene conservar (independientes del runtime agéntico)

| Id | Requisito (resumen) | Línea |
|---|---|---|
| DOC-01 | identidad estable de documento, entidades, estados, enlaces, OPDs; aparición = representación local | `:79` |
| DOC-02 | propósito progresivo, sin formulario inicial | `:81` |
| DOC-03 | planos separados: declaración, fuente, propuesta, hipótesis, supuesto, derivado, revisión | `:83` |
| DOC-05 | fuente propietaria: derivado se propone a la fuente o se bifurca explícitamente | `:89-91` |
| DOC-06/07 | procedencia de afirmaciones; revisión humana con actor, versión, alcance | `:93-95` |
| OPM-01..10 | invariantes OPM (ver §6) | `:241-257` |
| TX-01 | ninguna salida parcial se incorpora como grafo inválido | `:223` |
| TX-02/03 | base vigente; en el primer corte, base cambiada invalida | `:225-227` |
| TX-04 | idempotencia por identidad de cambio | `:229` |
| TX-05 | **deshacer por inversa semántica**, no por snapshot | `:231` |
| SIM-01..06 | escenario separado; satisfecho/incumplido/desconocido; omisión antes de espera; habilitadores | `:261-279` |
| READ-01..04 | revisión compartida fija; observación anclada legible aunque el referente desaparezca | `:283-289` |
| REUSE-01 | pieza con función, frontera, versión, perfil, procedencia; firma ≠ equivalencia | `:291-295` |
| SAVE-01..05 | «Guardado aquí» ≠ «Sincronizado»; conflicto conserva ambas ramas; fallo local ofrece descarga | `:301-311` |
| MIG-01..04 | migración sin pérdida silenciosa; regímenes preservados; perfil fijado; retiro por recorrido | `:346-352` |

### 5.3 Contratos del circuito agéntico (`:213-219`, citados textualmente)

| Contrato | Información obligatoria |
|---|---|
| ContextSnapshot | Documento, destino de trabajo identificado como vigente o variante, revisión, huella de trabajo local pendiente, alcance, referencias, fuentes autorizadas, perfil normativo y capacidades efectivas |
| TaskIntent | Identidad de tarea y destino vigente/variante, resultado, alcance, exclusiones, criterio de suficiencia, fuentes, autoridad y presupuesto |
| ChangeSet | Identidad idempotente, tarea y autor, destino vigente/variante, base, operaciones tipadas, elementos leídos y escritos, versiones de fuentes, supuestos y decisiones dependientes, explicación del cambio y resultados de comprobación |
| CommitReceipt | Identidad de cambio, resultado inequívoco, revisión anterior y posterior, efectos aplicados y vínculo a la operación inversa |
| TaskEvent | Identidad de evento y tarea, secuencia, estado, revisión pertinente y referencias a resultados; sin razonamiento interno como requisito de auditoría |

Diagrama de responsabilidades (`:193-207`): intención + documento + fuentes → tarea →
(agente | edición directa) → **operación semántica** → validar base/autoridad/
invariantes → commit atómico + recibo → OPD/OPL y persistencia → eventos.

**La idea valiosa que hay que portar**: *editor, interfaz textual, agente integrado y
clientes externos usan el mismo contrato de efectos* (`:191`). Un solo circuito
«operación tipada → validación → commit con recibo e inversa» sirve a humanos y
máquinas.

### 5.4 Aceptación A01–A24 (`:393-418`)

Catálogo de pruebas refutables, muy útil como suite de aceptación de la reescritura.
Agrupadas:

- **Bimodalidad y comprensión**: A01 (corregir un estado desde texto o figura sin
  explicación previa), A10 (exportar texto local/resumen/total con alcance explícito),
  A23 (resumir OPL, omitir una línea, producción sin aplicador, oración compuesta).
- **Agencia**: A02–A07, A20, A22, A24 (multipaso con XOR preservado, corrección en
  vuelo, no ampliar mandato por selección, no sobrescribir edición humana, Detener
  concurrente con commit, deshacer con edición intercalada, fuente que intenta
  escalar permisos, vigencia de dependencias, suspensión y continuación).
- **Continuidad documental**: A08 (abrir Apunte/Modelo/Biblioteca/Boceto anteriores),
  A09 (renumerar, navegar, vista, refinar, auto-layout conserva `ordenInzoom`).
- **Lectura compartida**: A11 (revisión desde teléfono), A12 (observación sobrevive al
  referente).
- **Ensayos**: A13 (habilitador presente/ausente/incompatible), A14 (omisión antes de
  espera), A15 (alcanzabilidad ≠ ejecutabilidad).
- **Autonomía**: A16 (offline), A17 (dos clientes, sin último-escritor-gana), A18
  (paquete sin proveedor LLM).
- **Piezas**: A19, A21 (firma igual no implica conducta igual).

### 5.5 Estado real (`roadmap/implementacion-producto-integrado.md`, `HANDOFF.md`)

- I1–I6 «implementados» con 3 682 pruebas verdes y 16 escenarios de navegador.
- **Cero inferencia real** con el proveedor elegido (falta la clave). Cero evaluación
  humana. Latencias p95 no medidas. Chunk del editor ≈1 MB. No desplegado.
- Se implementó en **un único commit** de 24 703 líneas (`8ada528`), contrario al
  principio de la propia spec de incrementos verticales (`:360`) y de `AGENTS.md`
  («menor incremento vertical observable»).

### 5.6 Juicio sobre la dirección

Lo correcto y durable: documento con identidad, planos separados, un circuito común
de efectos, inversa semántica, persistencia honesta, revisión fija compartible,
simulación que distingue omisión/espera/indeterminación, pieza con procedencia.

Lo que parece prematuro: un runtime agéntico completo (leases, presupuestos
reservados, eventos con cursor, recibos, «Continuar» tras suspensión) antes de una
sola inferencia real y antes de evidencia de uso; lector portátil offline con service
worker; cola de sincronización local con IndexedDB para un operador único. La
reescritura debería tratar al agente como **cliente más del mismo contrato de
operaciones** (igual que el CLI `mesa`), no como subsistema con estado propio, hasta
que el uso lo justifique.

---

## 6. Reglas OPM y reglas de producto citadas (sagradas)

El texto normativo vive en KORA (no disponible aquí). Esta tabla cataloga cada regla
tal como la usa el corpus del repositorio, con su ubicación documental y su
realización en código cuando los documentos la nombran. **La reescritura debe
conservar el comportamiento, no necesariamente el identificador.**

### 6.1 Ontología y agencia

| Regla | Contenido (según el corpus) | Dónde se cita | Realización |
|---|---|---|---|
| R-AG-1 | agente = exclusivamente persona o grupo de personas | `manual-opforja.md:94`; `manual-sistemas-opm.md` §4.2; spec integrada OPM-01 `:243`, `:170` | checkers de agente humano (whitelist de validez degradable) |
| R-AG-1A / R-AG-1B | software, IA, sensores, organizaciones abstractas no son agentes → instrumento | `manual-opforja.md:95`; sanitario P4, P21 | idem |
| R-PROC (familia) | sin transformee no hay proceso | sanitario P6; `manual-opforja.md:224` | checkers de transformee |
| R-NOM-PROC-1 | nombrar el proceso como transformación, no área; escala de nombrado §A2.3 | `manual-opforja.md:225` | checkers de nombres |
| — | estados pertenecen a objetos; un proceso no tiene estados | spec OPM-01 `:243`; Tutor §5.1 | kernel |
| — | transformación y habilitación no se intercambian | spec OPM-01 | kernel / checkers |
| — | afiliación (sistémica/ambiental) no depende del layout | `manual-opforja.md:235-237, 580` | kernel |

### 6.2 Bimodalidad y OPL

| Regla | Contenido | Dónde |
|---|---|---|
| R-BI-DUAL-1, R-BI-4 | todo hecho incorporado tiene correspondencia OPD/OPL; editar en una modalidad produce la misma operación | spec OPM-02 `:244` |
| R-OPL-TOTAL-1..5 | resumen y OPL local indican alcance; acceso al OPL completo | spec OPM-03 `:245` |
| R-§19-SIM-2, R-§19-DISP-1/2, R-§19-LENS-1..3, R-§19-COMP-1/2 | omitir una oración no borra; producción sin aplicador no muta; oración compuesta examinable | spec OPM-10 `:257` |
| — | una oración atómica = un hecho; el parser rechaza o suspende ante ambigüedad, no inventa | `manual-opforja.md:489-501` |
| — | bimodalidad garantizada solo para plantillas que el parser declara soportadas | `manual-opforja.md:498-501` |
| R-FAN-5 / R-FAN-7 | abanico multi-destino declarado; correspondencia estado→rama explícita | sanitario Apéndice A (P13) |
| R-FAN-PROB-1 caso C | distinguir «probabilístico declarado, pesos pendientes» de alternativas ordinarias | `registro-conformidad-ssot.md` — **PROGRAMADA** (brecha) |
| R-DOC-7, R-BR-4, V-204 | contenido meta del autor no emite OPL nuclear (anclas normativas, notas) | acta 2026-06-04 D2 y F5 |
| R-ENT-2-APUNTE | regla de emisión OPL en Apunte en todas las superficies | spec integrada `:250, :356` |

### 6.3 Refinamiento, orden y vistas

| Regla | Contenido | Dónde | Código |
|---|---|---|---|
| R-REF-1..4 | crear detalle exige pregunta útil, frontera preservada, sin ciclos | spec OPM-05 `:247` | `refinamiento/`, `preguntaGuia` |
| R-CAT-EQ-1..3 | igualdad de firma de frontera acredita solo lo comparado; no bisimulación | spec REUSE `:295`; registro | `compareBoundarySignature` (`modelo/equivalencia/`) ; `DESCOMPOSICION_NO_PRESERVA_FRONTERA` (`checkers.ts`, `diagnosticoSeveridad.ts`) |
| R-CAT-LIN-1/2 | recurso lineal; varios consumidores = mejora, no bloqueo | Tutor §2.4; registro | `RECURSO_LINEAL_MULTIPLES_CONSUMIDORES` |
| R-CAT-COMP-2 | composición sin duplicación, referencias válidas, asociatividad, tipado | registro | `modelo/composicion/`, `leyes/composicion.test.ts` |
| R-INV-1 | invocación explícita (rayo) | spec invocación implícita §2 | render |
| R-INV-2/2A/2B/2C | orden secuencial/paralelo implícito **por mandato**; **no dibujar rayo** en invocación implícita | `specs/2026-06-14-invocacion-implicita-bimodal-design.md` §1-§2 | `Opd.ordenInzoom`, `INVOCACION_REDUNDANTE_CON_ORDEN` |
| R-INV-2D | invocación condicional (rama XOR) es explícita, no entra al campo de orden | `notas-invocacion-implicita.md` (última sección) | fixtures HODOM |
| R-CX-SYNC-1 | AND-join síncrono total = banda paralela | spec invocación §2 | `simulacion/fases.ts`, plan |
| R-OPD-INV-1..5 | rayo IV1/IV2 para autoinvocación, salto, cross-OPD; evento no es invocación; `después de N` solo sobre rayo explícito | spec invocación §2 | render/OPL |
| R-IDP-0A | el orden es declarado; la coordenada Y lo realiza | spec invocación §3; spec integrada OPM-06 | `derivarOrdenInzoomDeGeometria` (`operaciones/refinamiento/helpers.ts`) |
| R-LAY-4, R-INV-2D | mover para legibilidad y auto-layout conservan orden y bandas; si no pueden, no aplican | spec OPM-06 `:248` | layout |
| R-VIEW-1..4, R-BRING-1 | navegar, materializar vista y crear refinamiento son distintas; la vista no crea hechos | spec OPM-04 `:246` | vistas/submodelos |
| R-OPD-REF-20 | realización del arranque bottom-up (Bocetos) | `manual-opforja.md:134` | `adoptarOpd`, `establecerRefinamiento` |
| R-CAN-BOCETO-1..4 | documento conserva identidad Apunte⇄Modelo; componente conserva identidad Boceto⇄OPD integrado; Bocetos bloquean export canónico, no graduación | `canon-opm/reglas-opm-estrictas.md` (nota v1.5.0); spec OPM-08 | `gateDensidadCanonica` (`serializacion/perfilesExport.ts`) |
| — | supresión de estados es decisión de vista (per-OPD); no suprimir estado que participa en enlace visible | `manual-opforja.md:260-261` | `leyes/supresion-estados-aparicion.test.ts` |
| — | Eliminar refinamiento destruye subárbol y nunca es la inversa de Integrar | `uso-productivo.md:104-106`; ciclo reversible §2.3 | UI + kernel |
| Out-zoom | recomposición canónica | registro — **PROGRAMADA** (brecha) | — |

### 6.4 Simulación

| Regla | Contenido | Dónde |
|---|---|---|
| R-EJEC-6..9 y tabla §6.1 | distinguir habilitación base ausente, condición incumplida y evento; **la omisión se decide antes de la espera** | spec SIM-03/06 `:265-277`, §17 `:519` |
| — | el ensayo nunca altera el modelo base; «desconocido» es conocimiento del escenario, no estado del dominio | SIM-01/02 |
| — | «existe una trayectoria» ≠ «todas»; truncamiento ≠ imposibilidad; prohibidos defaults silenciosos | SIM-04 `:271` |
| — | valor uniforme de abanico probabilístico solo durante simulación, **nunca se persiste** | registro; `manual-opforja.md:598` |
| — | la duración es propiedad del proceso; «Esperar N» se reifica como subproceso | spec invocación §2 caso 6 |

Estado observado 2026-09-30: `simulacion/enablers.ts` existe y la reproducción de
§17 ya bloquea («En espera…»).

### 6.5 Reglas de producto (no ISO, pero invariantes que protegen el modelo)

| Regla | Contenido | Dónde | Código |
|---|---|---|---|
| **Línea dura del Apunte** | se relaja la validez (→ observación); la integridad estructural **siempre bloquea** | `superpowers/specs/2026-06-30-modo-apunte-design.md:29-47` | `validarIntegridad.ts::validarReferenciasOpd` no conoce `esApunte` |
| **Degradar por clase, whitelist fail-closed** | solo códigos de validez listados degradan; un código nuevo conserva severidad | idem `:85-94` | `CODIGOS_VALIDEZ_DEGRADABLES_APUNTE` (`diagnosticoSeveridad.ts:113`, uso `:174`) |
| Exclusión apunte ⊕ biblioteca | estados legales `(Apunte,Trabajo)`, `(Modelo,Trabajo)`, `(Modelo,Biblioteca)` | ciclo reversible `:57-59`; Tutor §3.2 | `persistencia/workspace.ts`, `especie.ts` |
| L1–L5 del ciclo reversible | identidad documental; identidad del componente; una dimensión por transición; integridad no negociable; estado de preparación derivado, no persistido | `superpowers/specs/2026-07-27-...:99-126` | `leyes/taller-*.test.ts` |
| Graduar aumenta rigor, no certifica | cuatro planos: integridad, integración, cierre formal, validación humana («no registrada») | idem `:85-95` | diálogo de graduación |
| Anclar = view + validate; no muta esencia | Soltar = Calco; Calco→Anclaje prohibido | `gesto-anclar-puerta-design.md:29-36`; acta nominación (iii)-(v) | `operaciones/anclaje.ts` |
| Drift biblioteca-nivel honesto | «la biblioteca cambió», nunca «tu pieza cambió»; no-resuelto ≠ divergente | Centinela D1 y §5 | `evaluarDriftModelo`, `firmaBiblioteca` |
| Señales UI no reutilizan signos OPM | selección, autoría agéntica, preview y error no usan contornos ni marcadores con significado OPM; cero crimson para alarma | spec OPM-07 `:249`; Centinela D3 | `ui-forja`, `design:governance` |
| Renderer nunca es fuente de verdad | estado derivado se calcula en store y se pasa al render | Centinela D7; `AGENTS.md` | `leyes/dependencias-unidireccionales.test.ts` |
| Apariencia ≠ entidad | una entidad se muestra en un OPD solo si tiene aparición allí; quitar aparición no borra la entidad | `uso-productivo.md:17-35` | kernel |
| R-CONF-7 | toda regla `DEBE` sin implementación se declara (programada, parcial o remitida); brecha silenciosa prohibida | `manual-opforja.md:197`; registro | `registro-conformidad-ssot.md`, `leyes/manual-limites.test.ts` |
| `[RATIFICAR]` no es marca genérica | solo estado de un ancla normativa upstream `pendiente-ratificacion`; opforja no la ratifica | Tutor §2.4 | `anclasNormativas`, `logDecisiones` |
| Anclaje visual | chip de tres estados en tinta; no emite OPL nuclear | R-OPD-ROT-9 (`manual-opforja.md:528`) | `composers/entidad.ts` |
| Marca meta `<<Nombre>>` | opcional en OPL; no cuenta como cosa | R-VIS-STEREO-1 / R-OPD-ROT-6 (`manual-opforja.md:537`) | `Entidad.estereotipoId` |
| LF-19 | checkers de estados distinguen flujo, caracterización y ambiental-observado; barridos sobre JSON canónico | `canon-opm/metodologia-forja.md`; `manual-opforja.md:512-513` | checkers |

---

## 7. Contratos de datos que una reescritura debe respetar o migrar

### 7.1 Formato persistido

- **`deep-opm-pro.modelo.v0`**: pivote único (acta 2026-06-04 D1); definido por
  `app/src/serializacion/json.ts` y `app/src/modelo/tipos/*`; reutilizado por el
  paquete portátil (`serializacion/portablePackage.ts:9`). Extensiones **aditivas y
  opcionales** (`modelo/tipos/extensiones.ts:88,134,208,300`). Modelos legados
  hidratan sin materializar campos ausentes.
- `Opd` (`modelo/tipos/opd.ts`): `padreId: Id | null` (`:17`; `null` no raíz =
  Boceto), `preguntaGuia?: string` (`:21`; trim, cadena vacía rechazada, no emite
  OPL), `ordenInzoom?: Id[][]` (`:36`; forma normal: partición total o `undefined`;
  `<2` bandas ⇒ `undefined`).
- Registro persistido (`persistencia/modelos.ts:17,24`): `esBiblioteca?`,
  `esApunte?`, `archivado`, `autosalvado`; exclusión mutua; al graduar `esApunte`
  queda **ausente**, no `false`. Deuda anotada: al tercer flag migrar a producto
  `rigor × rol` restringido (apuntes-taller §2-bis).
- `Entidad.anclaje = { piezaId, biblioteca: { modeloId, frozenAtHash, nombre } }`
  (+ `frozenAtPieza` por acta C4); `Entidad.estereotipoId` (nombre heredado de
  plantilla local).
- `contextoRefinamiento` ampliado con `tipo:"despliegue"` y `origen:"adopcion"`
  (ciclo reversible §5.5) para retirar solo la apariencia creada por Integrar.
- `AnclaNormativa` con `estado: pendiente-ratificacion | vigente`, cardinalidad
  entidad/enlace/OPD/modelo (acta 06-04 D2).
- `declaracionesNoNucleares`: ID, afirmación, targets resolubles, propietario
  semántico, procedencia, estado de aserción, evaluación opcional (ausencia = «no
  aplica») (`manual-opforja.md:364-370`).
- Sello de procedencia `{ protoHash, autoriaVersion, layoutVersion }` +
  `doctrinaVersion?` (`manual-opforja.md:321-322, 626`); el servidor comprueba forma,
  no firma criptográfica.
- `FichaTrabajo` (Tutor `:364`): `preguntaHabilitante`, `duenoSignificado`,
  `responsableDecision`, `tiposModelo`, `criterioSuficiencia`, `vidaUtil`,
  `revisarCuando`; `lentesConocimiento?: ("sistemas"|"software"|"salud")[]` (`:409-412`).
- Estado transitorio **no persistido**: `estadoCierre` (Listo formalmente / Con
  pendientes) derivado al listar (ciclo reversible §5.4); `driftMap` (Centinela §3).

### 7.2 HTTP, sesión y agente

- Auth v1 (`specs/auth-identidad-v1.md`): tablas `opforja_accounts`,
  `opforja_account_tenants` (rol fijo `owner`); cookie HMAC `opforja_session`
  `{tenantId, userId, auth: true}`, 30 días, rotación en login; `POST
  /__deep-opm/auth/login|logout`, `GET /__deep-opm/session` (401 sin sesión),
  `/healthz` público; `MODEL_REQUIRE_AUTH=true`. Error uniforme «Credenciales
  inválidas». Rollback = flag a `false`.
- Familias de rutas observadas en `app/src/server`: `/__deep-opm/modelos`
  (`/versiones`, `/autosave`), `/__deep-opm/workspace`, `/__deep-opm/review`
  (`/grants`), `/__deep-opm/agent`, `POST /__deep-opm/bug-reports` (sidecar).
- Token de agente: `MODEL_AGENT_TOKEN` (≥48 chars) + `MODEL_AGENT_IDENTITY`
  (`tenantId:userId`); comparación en tiempo constante; **mínimo privilegio**: lee y
  crea commits por el endpoint atómico; escrituras heredadas → `403`
  (`manual-opforja.md:385-388`).
- **`Testigo-Base`** (`manual-opforja.md:413-424`): identifica modelo + revisión y
  contenido guardados + contenido del autosave o su ausencia; el servidor lo
  revalida dentro de la transacción; `409` y cero escrituras si cambió. Workspace con
  revisión monotónica propia (CAS separado, `notas-vitrina.md`). Intención tipada de
  reapertura `reopening:{kind:"reopen"}` (ciclo reversible §5.2). Ante `404/405/501`
  el cliente **aborta**, no degrada.
- CLI `mesa` (`manual-opforja.md:390-411`): `modelos`, `pull`, `recuperar`,
  `preflight-retiro`, `push --base --nota [--especie] [--confirmado-por-operador]`;
  push sin delta no crea revisión; modelo con sello exige bundle compilado.
- Leyes del puente (`puente-directo-mesa-skill-design.md:89-99`): determinismo del
  generador, **counit `pull∘push` preserva**, **clausura `push∘pull` sin delta =
  no-op**, push inválido no toca, fast-forward, especie.

### 7.3 Herramientas para agentes

- `render:headless` (`docs/render-headless.md`): salida `00-indice.json`,
  `NN-slug.{png,svg}`, `opl.md`, `reporte.md`, `avisos.json`, `ledger.json`,
  `procedencia.json`, `conteos.json`; advertencias de canon no abortan; fallo
  estructural → `error.txt` + exit 1; hook solo bajo `VITE_HEADLESS_RENDER`, eliminado
  por DCE.
- `verify:reproducible` (`docs/verify-reproducible.md`): exit `0` idéntico · `1`
  difiere · `2` uso; nombra componente del sello divergente y primeras N líneas.

### 7.4 Perfiles de exportación (`uso-productivo.md:272-285`)

`intercambio` (JSON, no certifica conformidad) · `canon-documento` (Markdown con
portada, métricas, árbol, OPL, procedencia) · `canon-diagrama` (PNG por OPD o ZIP) ·
auxiliares (OPL Markdown, diagnóstico JSON). Las imágenes no contienen chrome.

---

## 8. Inventario documental: durable vs. burocracia, con recomendación

Leyenda: **K** keep (portar casi tal cual) · **S** simplify · **C** cut (o retirar a
historia/Git).

### 8.1 Raíz

| Documento | Propósito | Clase | Rec. | Justificación |
|---|---|---|---|---|
| `README.md` (60 l.) | propósito, límites, entrada | durable | **S** | Bueno; retirar referencias a `cordon:estado`, `browser:external` y al plan activo. |
| `AGENTS.md` (41 l.) | contrato de trabajo para agentes | durable | **K** | Breve y correcto (dependencias, bimodalidad, verificación proporcional, un solo `HANDOFF`). Ajustar la frase sobre KORA si el canon se vuelve opcional. |
| `CLAUDE.md` | adaptador `@AGENTS.md` | durable | **K** | Una línea. |
| `HANDOFF.md` | continuidad de sesión (clave de API, portapapeles) | circunstancia | **C** | Por regla propia debe desaparecer al cerrar; contiene detalles de sesión. |
| `NOTICE.md` | separación legal código propio / material OPCloud | durable | **K** | Obligación real; sin licencia declarada. |

### 8.2 Manuales y guías

| Documento | Propósito | Clase | Rec. | Justificación |
|---|---|---|---|---|
| `uso-productivo.md` (361 l.) | guía de interfaz | núcleo | **S** | Necesaria, pero con deriva (mobile «solo lectura», «sin sharing» vs revisión compartida; dos indicadores de guardado). Reescribir con la nueva UI; que atajos se generen del registro real (ya lo hace `Ctrl+K › Atajos`). |
| `manual-opforja.md` (667 l.) | método Forja + humano/agente | núcleo | **S** | §0–§10 y apéndices A–B son el mejor conocimiento durable. §A.6 (CLI, 100 líneas) pertenece a `mesa --help`. No menciona Tutor ni agente integrado. |
| `manual-sistemas-opm.md` (1 045 l.) | ciclo de transformación de sistemas | durable, fuera del producto | **S** (mover) | Valioso como guía metodológica, pero no documenta el producto. Llevar al corpus externo o a una sección «guías»; §9 (frontera de capacidad) debe derivarse del código. |
| `manual-software-opm.md` (735 l.) | perfil software | durable, fuera del producto | **C** del repo (mover) | Recetas de ingeniería de software; el producto no genera código ni ejecuta pipelines. |
| `manual-sanitarios-opm.md` (929 l.) | perfil sanitario, 24 piezas-decisión | durable de dominio | **C** del repo (mover) | Contradice la frontera «el repo no es fuente de dominio»; incluye un veto de circunstancia (`:47`, no citar `hd-opm`/`hodom-opm`). Pertenece al corpus salubrista. |
| `cheatsheets/README.md` + 16 HTML | proyecciones rápidas | derivado | **S** | 16 hojas con ley de estructura (`corpus-documental.test.ts`) y además insumo del corpus del Tutor. Reducir a 2–3 (básico, OPM puro, atajos) generadas. |
| `JOYAS.md` (302 l.) | constantes observadas de OPCloud | referencia técnica | **K** (mover a `reference/`) | Muy útil para fidelidad visual (135×60, markers, routing). Mantener la advertencia de NOTICE. |
| `render-headless.md`, `verify-reproducible.md` | uso de herramientas para agentes | operativo | **S** | Fusionar en una página «herramientas para agentes» o en `--help`. |

### 8.3 Especificaciones y decisiones

| Documento | Propósito | Clase | Rec. | Justificación |
|---|---|---|---|---|
| `specs/opforja-producto-integrado.md` (519 l.) | spec objetivo, A01–A24 | dirección | **S** | Conservar §4 (DOC), §7 (contrato común), §8 (OPM), §9 (SIM), §10–§11, §15 (A01–A24). Cortar §2 (estado de partida), §13 (evolución de contratos KORA), §16 (fuentes Jobs), §17 (testigo ya resuelto). |
| `specs/README.md` | índice de specs y reemplazos | burocracia necesaria | **S** | Existe porque hay specs en dos directorios; desaparece al consolidar. |
| `specs/auth-identidad-v1.md` | contrato de auth | contrato | **K** (compactar) | Tablas, cookie, endpoints, rollback. Quitar «DESPLEGADO» y conteos de smoke. |
| `specs/2026-06-14-invocacion-implicita-bimodal-design.md` | `ordenInzoom` | contrato OPM | **K** (§1–§4) | Tabla implícito/explícito (§2) y representación (§3) son conocimiento OPM sagrado. Cortar Fases 2–3 de HODOM. |
| `specs/2026-06-15-orden-inzoom-canvas-sync-design.md` | cara 4 de la bimodalidad | contrato | **K** | Forma normal, guard de idempotencia, hook solo en drag manual, ley `derivar ∘ layout = id`. Alta calidad. |
| `superpowers/specs/2026-06-26-corte-centinela-drift-ui-design.md` | drift UI | contrato de feature | **S** | Si el Anclaje sobrevive: fusionar con Puerta en un solo contrato «Reuso». Conservar D1, D3, D6, D7. |
| `superpowers/specs/2026-06-29-gesto-anclar-puerta-design.md` | gesto Calcar/Anclar | contrato de feature | **S** | Idem; conservar «Unlink = Σ» traducido a lenguaje llano y el chip de tres estados. |
| `superpowers/specs/2026-06-30-modo-apunte-design.md` | Apunte | contrato | **S** | Conservar §1 (línea dura) y corrección 4; el resto quedó superado. |
| `superpowers/specs/2026-07-06-apuntes-taller-design.md` | Taller bottom-up | histórico | **C** | Reemplazado; su §2-bis (dos ejes rigor×rol) se integra al ciclo reversible. |
| `superpowers/specs/2026-07-06-puente-directo-mesa-skill-design.md` | puente | histórico parcial | **C** | El protocolo vigente está en el manual; las leyes counit/clausura viven en tests. |
| `superpowers/specs/2026-07-21-tutor-contextual-opforja-design.md` (1 176 l.) | Tutor | contrato sobredimensionado | **S** fuerte | Conservar §1, §3 (principios), §3.2 (tres ejes), §4 (gramática), §5.1 (voz). Cortar §8.1 (unión de 21 snapshots), §11, §14 (18 cortes), §17 (lectura categorial). |
| `superpowers/specs/2026-07-27-taller-modelos-ciclo-reversible-design.md` | ciclo reversible | contrato | **K** (§1–§5, §10) | El mejor contrato de producto del área. Cortar §8 (bitácora P0–P5 de despliegue) y §9. |
| `superpowers/README.md` | explica el nombre del directorio | burocracia | **C** | Relocalizar specs y borrar. |
| `decisiones/README.md` | índice de decisiones vigentes | útil | **K** (compactar) | Tabla corta y bien pensada. |
| `decisiones/equilibrio-llm.md` | reparto kernel/LLM | decisión | **S** | Conservar: el LLM nunca muta el modelo por sí solo; la edición manual funciona con el servicio caído. Explicitar que la decisión se invirtió y por qué. |

### 8.4 Roadmap, notas y registros

| Documento | Propósito | Clase | Rec. | Justificación |
|---|---|---|---|---|
| `roadmap/README.md` | criterios para abrir trabajo | principio útil | **S** | Las tres señales (bug reproducible, evidencia de uso, decisión explícita) son un buen filtro anti-acreción; conservarlas en `AGENTS.md`. |
| `roadmap/implementacion-producto-integrado.md` | bitácora de implementación | estado | **C** al cerrar | Se declara retirable; hoy duplica `HANDOFF.md`. |
| `roadmap/registro-conformidad-ssot.md` | brechas R-CONF-7 | conocimiento + burocracia | **S** | Conservar las dos brechas reales (out-zoom, R-FAN-PROB-1 C) como lista de «no soportado» visible en la app/diagnóstico. Eliminar la fila CERRADA que existe solo para alimentar un test. |
| `memorias-aprendizajes/notas-invocacion-implicita.md` | lecciones de ingeniería | durable | **K** (fusionar) | «Verificar por inversa», «leyes no tautológicas», «el campo opcional degenera exactamente al comportamiento previo»: patrones de primer nivel para OPL reverse. |
| `memorias-aprendizajes/notas-vitrina.md` | lecciones de concurrencia | mixto | **S** | Conservar: época de sesión cancela trabajo asíncrono; CAS separado por agregado; contrato atómico no degrada. Cortar trivia de componentes. |
| `memorias-aprendizajes/README.md` | índice | burocracia | **C** | |
| `canon-opm/*.md` (4 puentes) + `resolutor-urn.json` | resolver URN → KORA | infraestructura | **S** | Los puentes repiten notas de versión; basta el JSON. Corregir la raíz por defecto (JSON dice `/home/felix/kora-knowledge`; `manual-opforja.md:650` dice `/home/felix/kora-pneuma`). Nada debe hardcodear un home de usuario. |
| `docs/README.md` (132 l.) | índice + jerarquía de 7 niveles + contrato editorial | mixto | **S** | Conservar la tabla «Elige tu ruta». Reducir la jerarquía de autoridad a tres niveles (solicitud/AGENTS → canon OPM → código y tests). |
| `docs/bugs/` (122 reportes + INDEX/HISTORY/statuses) | ledger de bugs in-app | circunstancia | **S** | El archivo es evidencia valiosa de necesidades; el capturador que escribe al repo y el sidecar son operación de un solo usuario. Usar un tracker externo o dejarlo como herramienta de desarrollo opcional. |
| `docs/auditorias/` (actas) | procedencia de decisiones | historia | **S** | Destilar cada acta en una fila de `decisiones/`; el resto a Git. |

---

## 9. Olores de sobreingeniería, burocracia y acreción (con ejemplos)

### 9.1 Gobierno documental autorreferente

- **Tests que fijan frases literales de los manuales.**
  `app/src/leyes/corpus-documental.test.ts` exige, entre otras, que
  `uso-productivo.md` contenga «el clic no fuerza por sí mismo el guardado» y que
  `manual-opforja.md` contenga «`Testigo-Base`», «responde `409` y no escribe nada»,
  «workspace también porta una revisión monotónica», «no una firma criptográfica»;
  y prohíbe frases antiguas («Equivalencia funcional = misma firma»). Editar prosa
  exige editar tests. Similar: `manual-limites.test.ts` exige que toda capacidad de
  §L tenga fila PROGRAMADA y que el registro conserve una fila CERRADA como «control
  de no-tautología» (`registro-conformidad-ssot.md:175-176`).
- **Hojas rápidas con ley estructural** (idioma, H1, favicon SVG embebido, tablas con
  `aria-label`, prohibición de `Ctrl+N`/voseo), y además **insumo del build**: el
  corpus del Tutor se genera en cada `dev`/`build` (`tutor:corpus`), con checksums
  (commit `b45b886` «reconciliar checksums tras propagación P4»).
- **Jerarquía de autoridad de siete niveles** (`docs/README.md`) + precedencia en
  `decisiones/README.md` + precedencia en cada spec + «reglas estrictas > spec-OPD >
  ui-forja > impl». Cuatro formulaciones de la misma idea.
- **Especificaciones en dos directorios** con un índice que explica la clasificación y
  un README que explica por qué se llama `superpowers`.

### 9.2 Estado y bitácora dentro de documentos durables

Pese a la regla «no se mantiene una instantánea paralela del estado»
(`docs/README.md`), hay estado por todas partes: «DESPLEGADO Y OPERATIVO» (auth),
«REALIZADO Y DESPLEGADO» (Centinela, Puerta, Apunte), la bitácora P0–P5 con la ventana
«04:35:21Z – 07:49:33Z», «3 h 14 min», «los ocho agregados regresaron al baseline»
(ciclo reversible §8), conteos de pruebas en `HANDOFF.md` y en el plan, commits
«docs(handoff): …» (≈12 de 69 commits visibles son solo de continuidad/ops).

### 9.3 Legitimación por paneles sintéticos y vocabulario categorial

- Decisiones firmadas por «Steve Jobs», «Dov Dori», «steipete», «Allan-Kelly»,
  «mente-omega», «cat-thinking», «custodio-kora», con «confianza N4-alto (0.88)» y
  «triple aceptación» (acta 06-04 §7; acta nominación). La spec integrada aclara que
  son «perspectivas sintéticas» (`:9`), pero siguen siendo la fuente de autoridad de
  la interfaz.
- Teoría de categorías para justificar gestos de UI: «adjunción Σ ⊣ Δ», «Unlink = Σ»,
  «pushout», «counit», «retracto (split mono/epi)», «producto rigor×rol restringido»,
  seguidos de descargos («no es teorema», «no autoriza llamar funtor fiel»). Aporta
  poco al usuario y encarece la lectura. Las propiedades útiles se expresan mejor como
  leyes de test en lenguaje llano (idempotencia, inversa, conservación).
- Jerga idiosincrática: «barro», «mesa», «vitrina», «cordón», «Centinela»,
  «amarras», «criterio de muerte», «palabras de carpintero», «default brutal».
  Algunas son buenas metáforas internas; en producto deben ser vocabulario llano.

### 9.4 Mecanismos superpuestos para una misma necesidad

| Necesidad | Realizaciones coexistentes |
|---|---|
| **Reutilizar** | plantillas locales de subgrafo (`estereotipoId`, «Piezas / Este modelo»); Calco/Anclaje/Centinela (`operaciones/anclaje.ts`, 7 leyes `anclaje-*`); `modelo/reuse/piece.ts` (copia con linaje + referencia protegida vía `submodelos`, sept.); composición por interfaz (`composicion/`) |
| **Trabajar con agente** | puente W6.0 por portapapeles; CLI `mesa pull/push` con `Testigo-Base`; mesa de exploración (fuente + propuesta); runtime agéntico integrado (`server/agent/`); Jev evaluado |
| **Régimen del documento** | `esApunte`/`esBiblioteca` + `especieDe()` + `documentPolicy.ts` (`deriveDocumentPolicy`) + `estadoCierre` derivado |
| **Guardar / historia** | guardado backend, autosave, versiones manuales, revisiones con CAS, recibos de cambio, snapshot/diario/historial en IndexedDB, cola de sincronización, paquete portátil, JSON descargado |
| **Deshacer** | pila de snapshots del store (`commitModelo`) + historial de intenciones con inversa semántica (`intentHistory`) |
| **Enseñar** | 5 manuales + manual OPM puro + 16 hojas + Tutor (5,8 k líneas) + mensajes del diagnóstico |

### 9.5 Verificación proliferante

29 scripts en `app/package.json` (tres configuraciones de Playwright, `gate:refactor`,
`design:governance`, `cordon:estado`, `cordon:skill`, `quality:gate`,
`visual:audit/deep/exhaustivo`, `ux:eval`, `bug:index`, `bug-capture:api`…) y 39
archivos en `src/leyes/`. `AGENTS.md` ya pide no acumular controles, pero la
superficie existe. `cordon:estado` contrasta fuente, canon, skill y producción:
gobernanza del ecosistema del operador más que del producto.

### 9.6 Rigidez de compatibilidad con repos externos

Byte-identidad del bundle HODOM como oráculo (acta 06-04 D6), re-pin gobernado,
«golden hd-opm byte-idéntico» condicionando el diseño de `ordenInzoom` (spec
§3, §5; notas «crear-y-borrar para no renumerar IDs»). Es una restricción de un
consumidor externo propio que moldea el kernel.

### 9.7 Nombres dobles (interno vs visible)

`adoptarOpd`/«Integrar», «OPD suelto»/«Boceto», `estereotipoId`/«Pieza» o «plantilla»,
`Injertar`/«Calcar», `origen:"adopcion"`, `BibliotecaDock` retirado,
«Vitrina de estereotipos»/«Piezas». Las specs piden no renombrar internamente
(«370+ refs»). La reescritura puede alinear nombres de una vez.

### 9.8 Contradicciones y deriva documental detectadas

1. `uso-productivo.md:347,350` «sin sharing remoto con permisos por modelo», «mobile
   es solo lectura» vs. «Compartir revisión» y lector móvil (`:174-177`; A11).
2. `manual-sistemas-opm.md:533` «Humano y agente trabajan por turnos» vs. TX-02/A05
   (agente concurrente con edición humana).
3. `manual-sistemas-opm.md:788` §9.2 PROPUESTO «contexto de trabajo determinista» y
   «ancla de fuente genérica» ≈ ya realizados como ContextSnapshot y adaptadores de
   fuente.
4. `manual-opforja.md` no menciona el Tutor ni el agente integrado; su pista agente
   solo cubre la skill externa.
5. `decisiones/equilibrio-llm.md` conserva el título de una decisión que se invirtió.
6. Raíz KORA: `resolutor-urn.json` = `/home/felix/kora-knowledge`;
   `manual-opforja.md:650` = `/home/felix/kora-pneuma`.
7. Spec §17 describe una brecha de habilitadores que ya no se reproduce.
8. Dos indicadores de guardado descritos a la vez (`uso-productivo.md:140-157`).

---

## 10. Partes de alta calidad que vale la pena portar casi tal cual

1. **El enunciado de propósito y frontera** (`manual-opforja.md` §0; `NOTICE.md`).
2. **El modelo mental mínimo y el flujo A0–A8** (§1–§2), el ejemplo end-to-end de
   despacho de pedidos con errores intencionales (§10) y el glosario (Apéndice A).
3. **La línea dura Apunte** (validez degrada, integridad nunca) con whitelist
   fail-closed.
4. **El contrato del ciclo reversible**: cuatro líneas «cada línea cambia una sola
   dimensión» (`:25-30`), L1–L5, la tabla de transiciones con precondición/efectos/
   preserva/recuperación (`:130-139`), la separación de cuatro planos al graduar.
5. **`ordenInzoom`**: tabla implícito/explícito (8 casos), bandas `Id[][]`, forma normal,
   sincronización solo en drag manual, guard de idempotencia.
6. **Patrón «verificar por inversa»** para OPL reverse ambiguo (re-emitir con el mismo
   forward y comparar; si difiere, advertir sin patch).
7. **Leyes no tautológicas** (usar geometría que contradice el campo para que el test
   solo pase si se lee el campo).
8. **El protocolo `Testigo-Base` + commit atómico + CAS por agregado + época de
   sesión**: concurrencia segura sin coedición.
9. **Honestidad epistémica** como principio de copy: «Guardado aquí» vs «Sincronizado»,
   «la biblioteca cambió» (no «tu pieza»), «no-resuelto» ≠ «divergente», «En este
   escenario…», firma de frontera ≠ equivalencia, cobertura de requisito ≠ prueba
   pasada, graduar ≠ validación humana.
10. **Tutor: gramática de una voz** (callar/confirmar/orientar/preguntar/bloquear el
    gesto), profundidad progresiva Ahora/Criterio/Fundamento, sin chat/avatar/puntaje,
    y la experiencia icónica «refinar con una pregunta» (`preguntaGuia`).
11. **Tabla de gestos de la spec integrada**, en particular «Ver por dentro» ≠
    «Describir por dentro» y «una propuesta no mueve el viewport».
12. **A01–A24** como suite de aceptación.
13. **Sobre de autonomía** (Decidir/Proponer/Elevar/No hacer) y «paralelizar ejecución,
    serializar significado».
14. **Tres señales para abrir trabajo** (`roadmap/README.md`).
15. **Constantes visuales de OPCloud** (`JOYAS.md`) para fidelidad del OPD.

---

## 11. Recomendaciones para la reescritura (desde esta área)

1. **Un solo circuito de efectos** (operación tipada → validación de base, autoridad e
   invariantes → commit atómico con recibo e inversa) para UI, OPL, CLI y agente. Es la
   mejor idea de la spec integrada y reemplaza varios canales paralelos.
2. **Un solo mecanismo de reuso** con dos modos visibles (copiar / referenciar con
   aviso de cambio) y procedencia; retirar la duplicación Anclaje vs `reuse/piece` vs
   plantillas locales.
3. **Un solo indicador de guardado** con estados verdaderos; **una sola historia**
   (versiones y revisiones) y **un solo undo** (inverso por intención).
4. **Documentación en cuatro piezas**: README (qué es), AGENTS (cómo trabajar), guía
   de uso (derivada donde sea posible del registro de comandos), manual del método
   (§0–§10 de `manual-opforja.md` depurado). Manuales de dominio (sistemas, software,
   salud) al corpus externo.
5. **Decisiones como tabla corta con porqué**, sin actas ni paneles; historia en Git.
6. **Tests de documentación limitados a enlaces y ejemplos OPL ejecutables**
   (como `manual-sistemas-opm.test.ts`, que parsea y hace roundtrip del OPL publicado).
   Nunca asertar prosa literal.
7. **Brechas R-CONF-7 visibles en la app** (capacidad no soportada declarada en el
   diagnóstico o en la ayuda), no solo en un registro Markdown.
8. **Agente como cliente del contrato**, empezando por el CLI y una entrada de intención
   simple; ampliar a tareas con presupuesto, eventos y suspensión solo con uso real
   observado.
9. **Priorizar las siete familias de necesidades del histórico de bugs** (fidelidad
   visual canónica, OPL correcto, estados como extremos de primera clase, foco,
   sustracción de chrome, simulación con rutas, persistencia confiable).
10. **Sin rutas de usuario hardcodeadas** (`/home/felix/...`) ni acoplamiento a la
    byte-identidad de un repo externo en el kernel; la compatibilidad con
    `deep-opm-pro.modelo.v0` se garantiza por importador y golden tests propios.
