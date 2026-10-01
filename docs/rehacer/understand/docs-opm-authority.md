# Dossier — Autoridad OPM disponible localmente (catálogo de reglas para la reescritura)

Área: `docs/manual-opm-puro.md`, `docs/canon-opm/*`, `docs/reference/**` (opmodel, opm-model-app,
PROCEDENCIA), `docs/cheatsheets/opm-puro.html`, `docs/cheatsheets/opforja-ontologia.html` (+ hojas
de control de flujo y "no bloqueado" por ser las que fijan reglas Forja), `docs/ejemplos/*.opl`.
Complementos leídos para contrastar: `docs/manual-opforja.md`, `docs/uso-productivo.md`
(Apunte/Taller), `docs/auditorias/2026-06-12-auditoria-ssot-corpus.md`,
`docs/roadmap/registro-conformidad-ssot.md`, `docs/specs/2026-06-14-invocacion-implicita-bimodal-design.md`,
`docs/JOYAS.md` §9–§13, y en código los puntos donde las reglas se aplican
(`app/src/modelo/operaciones/helpers.ts`, `operaciones/enlaces.ts`, `modificadores.ts`,
`estadosDesignaciones.ts`, `abanicos.ts`, `validaciones.ts`, `checkers.ts`,
`app/src/opl/generadores/*.ts`, `app/src/modelo/tipos/*.ts`).

Nada del repo fue editado. Todas las citas `archivo:línea` son del estado leído el 2026-09-30.

---

## 0. Resumen ejecutivo

1. **La autoridad normativa real no está en el repo.** Los cuatro "puentes"
   (`docs/canon-opm/*.md`) no contienen ninguna regla: solo apuntan por URN a una biblioteca
   KORA externa (`/home/felix/kora-knowledge` por defecto, `resolutor-urn.json:203`) que **no está
   instalada aquí**. La política editorial "no copiar el canon" (`manual-opforja.md:32-37`,
   `canon-opm/reglas-opm-estrictas.md:60-62`) deja al repo sin catálogo local verificable.
2. **La mejor fuente local es `docs/manual-opm-puro.md`** (2 035 líneas, didáctico, riguroso,
   agnóstico de herramienta, con IDs `R-*`/`AP-*` del canon `reglas-opm-estrictas-es` v1.5 y un
   Apéndice B de plantillas OPL-ES). Es de altísima calidad y se puede portar casi tal cual.
3. **`docs/reference/opm-model-app/reglas/` (44 archivos, 263 reglas `V-*`)** es la re-serialización
   más exhaustiva del corpus OPM-ES v2 (visual/OPL/metodología). Es histórica (abril 2026), cita
   código de otro repo y **contradice en ≥6 puntos al canon vigente** (ver §7). Útil como cantera,
   no como autoridad.
4. **El código es el contrato de facto de la superficie OPL** y diverge del canon local en ~15
   plantillas (ver §6). La reescritura debe decidir explícitamente qué superficie es canónica.
5. **Hay reglas Forja genuinas y valiosas** (Apunte/Modelo, Boceto/Integrar, integridad que nunca
   cede, validación tripartita, orden declarado de in-zoom) mezcladas con acreción (sellos de
   doctrina, tests sobre la prosa de los manuales, 16 hojas rápidas, matriz de 1 164 HU).
6. **Brechas semánticas importantes en código** frente al canon: no existe duración de proceso
   (solo de estado, herencia OPCloud); regla "subproceso no conecta al padre" prohíbe el bucle
   canónico de retorno al padre y decide la internalidad por geometría; objeto descompuesto emite
   "en esa secuencia" (orden temporal en objetos, prohibido por V-77/V-78).

Recomendación de fondo: **consolidar en el repo una única tabla de reglas ejecutable y versionada**
(familias de enlace × firma de extremos × modificadores × abanicos × plantilla OPL × severidad),
derivada del manual + auditoría 2026-06-12 + código vigente, y retirar los puentes, el resolutor
URN, el sello de doctrina y el material de referencia histórico a un archivo.

---

## 1. Inventario del área y veredicto por pieza

| Pieza | Líneas | Propósito real | Calidad | Veredicto |
|---|---:|---|---|---|
| `docs/manual-opm-puro.md` | 2 035 | Manual académico de OPM puro (Partes 0–VII, apéndices A–E). Cita R-*/AP-* del canon. | Excelente, coherente con auditoría 2026-06-12 | **keep** (portar como referencia normativa local primaria; recortar Parte 0/VII y el marco de "52 tensiones" a apéndice) |
| `docs/canon-opm/reglas-opm-estrictas.md` | 91 | Puente URN → KORA. Solo notas de versión. | Sin contenido normativo | **cut** (sustituir por catálogo local) |
| `docs/canon-opm/spec-forja-opd.md` | 70 | Puente URN (spec visual Forja v1.4.0). | Idem | **cut** |
| `docs/canon-opm/spec-forja-opl.md` | 92 | Puente URN (spec OPL Forja v1.4.1) + notas de enmienda (R-FAN-5A/5B, C-21b). | Idem; las notas son lo único útil | **cut** (rescatar R-FAN-5A/5B al catálogo) |
| `docs/canon-opm/metodologia-forja.md` | 100 | Puente URN (método v1.7.0) + changelog (LF-19, A1.5 bottom-up, ciclos Apunte⇄Modelo y Boceto⇄OPD). | Changelog útil | **cut** (rescatar las definiciones de ciclos) |
| `docs/canon-opm/resolutor-urn.json` | 41 | Mapa URN→path relativo a `KORA_RAIZ`; leído por `app/src/canon/resolutorUrn.ts` y `canon/doctrina.ts` (sello). | Datos puros, pero apunta a algo ausente | **cut** (con el sello de doctrina) |
| `docs/reference/README.md`, `PROCEDENCIA.md` | 30+82 | Declaran el material como histórico, no canon. | Correcto y honesto | **keep** (si se conserva el archivo histórico) |
| `docs/reference/opm-model-app/reglas/*.md` | ~9 000 | 263 reglas V-* re-serializadas en checklists, con "Aplicación en código" de otro repo. | Rica pero desactualizada y contradictoria en puntos | **simplify** → extraer al catálogo único y archivar |
| `…/ARQUITECTURA-CATEGORICA.md` | 1 371 | Constitución categórica (funtores, adjunciones, E1–E13, mónadas, lentes). | Intelectualmente interesante; mayormente [ASPIRACIONAL] | **cut** (conservar solo E1–E13 como invariantes en el catálogo) |
| `…/historias-usuario/*` | 1 894 | Metodología HU + matriz 48 épicas × 1 164 HU × 263 reglas. | Burocracia de planificación | **cut** |
| `…/design/ssot-decisiones-axiomaticas.md` | 329 | D1–D6 (existencia compartida cross-model, sub-modelo como par, Bring derivado, invocación familia, 3 categorías de OPD, separación de canales `y`). | Decisiones sólidas y vigentes | **keep** como ADR resumido (D1–D6 en 1 página) |
| `…/specs/modelo-json-canonico-v2.3.md` | 486 | Contrato JSON del repo legado (no es el de opforja). | Buen patrón (perfil canon vs importable, leyes de round-trip) | **cut** como contrato; **keep** las leyes de round-trip como idea |
| `…/adr/001-003` | 477 | Versionado de schema, deudas aceptadas (persona "Steipete"), persistencia 3 capas. | Histórico, incluye burocracia de agentes | **cut** |
| `docs/reference/opmodel/opl-first/*` | ~2 100 | ADR isomorfismo (4 leyes), effective visual slice, contrato pre-render, gramática OPL inicial (no canónica), plan JointJS, mapping SSOT-visual. | Las 4 leyes y el slice efectivo son valiosos; la gramática es errónea frente al canon | **simplify**: conservar las 4 leyes + contrato de slice (1 página); cortar el resto |
| `…/opmodel/ssot/candidate-extensions.md` | 149 | 13 hallazgos para devolver al canon (compound names, input/output legacy, V-115 por atlas, V-83 por aparición…). | Útil como lista de ambigüedades | **keep** (fusionar en §7 del catálogo) |
| `docs/cheatsheets/opm-puro.html` | 384 | Hoja rápida del manual OPM puro (17 tarjetas). | Muy buena, fiel al manual | **keep** (derivarla del catálogo) |
| `docs/cheatsheets/opforja-ontologia.html` | 120 | Vocabulario controlado (canónico = sinónimos) y 3 modos (sin control / sugerir / reforzar). | Correcta y honesta ("Sugerir" sin consumidor visible) | **simplify** (fusionar en una hoja de producto) |
| `docs/cheatsheets/opforja-control-flujo.html` | 131 | AND/XOR/OR, c/e/¬, excepciones, invocación, AP de control. | Buena | **keep/fusionar** con opm-puro |
| `docs/cheatsheets/opforja-no-bloqueado.html` | 125 | Integridad vs validez de método; Apunte y Taller. | Buena síntesis de reglas Forja | **keep/fusionar** |
| resto de hojas (13) | ~2 500 | Dominio, runbook, skill, patrones… | Proliferación | **cut/fusionar** (fuera de esta área) |
| `docs/ejemplos/lumbre-reservas.opl`, `puente-vecinal.opl` | 32+30 | OPL de ejemplo emitido por la herramienta (sin OPD). | Útiles como fixtures de roundtrip; muestran la superficie real | **keep** como fixtures de test (con corrección de nombres, ver §6.3) |

---

## 2. Mapa de autoridad y precedencia

### 2.1 Capas declaradas (corpus KORA, ausente)

| URN | Rol | Versión observada (`resolutor-urn.json`) |
|---|---|---|
| `urn:fxsl:kb:opm-es` | núcleo semántico/ontológico, glosario 3.x | (no mapeada) |
| `urn:fxsl:kb:opl-es` | superficie OPL-ES canónica, plantillas, EBNF (Apéndice A) | (no mapeada) |
| `urn:fxsl:kb:opd-es` | gramática visual, reglas `V-*` | (no mapeada) |
| `urn:fxsl:kb:manual-metodologico-opm-es` | método base | (no mapeada) |
| `urn:fxsl:kb:reglas-opm-estrictas-es` | **canon prescriptivo operativo de opforja** (R-*, AP-*, severidades, gates de bisimetría) | 1.5.0 (`resolutor-urn.json:205-208`) |
| `urn:fxsl:kb:spec-forja-opd-es` | realización visual Forja (R-OPD-*, GAP-OPD-*) | 1.4.0 |
| `urn:fxsl:kb:spec-forja-opl-es` | superficie OPL Forja (generar/parsear/roundtrip) | 1.4.1 |
| `urn:fxsl:kb:metodologia-forja-opm-es` | método Forja (A0–A8, LF-*) | 1.7.0 |
| `urn:fxsl:kb:opm-categorial-es` | lectura formal (R-CAT-*) | 1.3.0 |

Precedencia vigente (según puentes y `app/src/canon/doctrina.ts:14-19`):
`reglas-opm-estrictas-es > spec-forja-opd-es > spec-forja-opl-es > metodologia-forja-opm-es`, con las
capas base como *procedencia*. La precedencia histórica de opm-model-app era distinta
(`opm-es > opl-es > opd-es > manual`, `reference/opm-model-app/reglas/00-precedencia-autoridad.md` R-001):
**no mezclar**.

### 2.2 Familias de identificadores de regla (para no confundirlas)

| Prefijo | Origen | Ejemplos | Uso en reescritura |
|---|---|---|---|
| `R-<FAM>-n` | `reglas-opm-estrictas-es` (canon vigente) | R-AG-1, R-PROC-2, R-INV-2B, R-FAN-PROB-1 | **IDs a conservar** en el catálogo |
| `R-OPD-*`, `R-VIS-*`, `R-OPL-*`, `C-nn` | specs Forja | R-OPD-EST-3, R-OPD-HAB-4, R-OPD-REF-20, R-VIS-EXP-2 | conservar los que el código cita |
| `AP-nn` | anti-patrones del canon | AP-01…AP-30 | conservar |
| `LF-nn`, `A0…A8` | metodología Forja | LF-06, LF-19, A1.5, A8 | conservar solo A1.5/A8 |
| `V-n` | opd-es base (v2) vía opm-model-app | V-3, V-37, V-115, V-128 | usar como cita secundaria |
| `R-nnn` (R-200, R-1305…) | IDs **locales** de opm-model-app | — | **no** portar (colisionan con R-*) |
| `I-nn`, `IV-nn`, `D-nn` | invariantes de opm-model-app/99 | I-01…I-37 | fundir en catálogo |
| códigos kebab/SNAKE del código | `validaciones.ts` / `checkers.ts` | `agente-requiere-objeto-fisico`, `PROCESO_NO_TRANSFORMA` | unificar en un solo espacio de IDs |

---

## 3. Catálogo de reglas OPM (ISO 19450 vía corpus OPM-ES) — sagradas

Convención: **[B]** = OPM base/ISO; **[F]** = regla o extensión Forja; **[C]** = código opforja la
aplica (con ubicación). "MPO" = `docs/manual-opm-puro.md`. "RL/nn" =
`docs/reference/opm-model-app/reglas/nn-*.md`.

### 3.1 Ontología: cosas

| # | Regla | Fuente | Código |
|---|---|---|---|
| O1 | Un elemento es **cosa** o **enlace**; una cosa es exactamente **objeto** o **proceso** (R-COSA-1, R-META-14). No hay "actores", "componentes" ni "actividades" como clases propias. | MPO:175-189 | `tipos/entidad.ts:16` `TipoEntidad = "objeto" \| "proceso"` |
| O2 | **Prueba objeto-proceso**: (1) asociación con el tiempo, (2) asociación verbal, (3) **transforma ≥1 objeto** (R-PROC-1/2). Sin transformación no hay proceso. | MPO:191-207 | `validaciones.ts:376-414` (`proceso-sin-entrada-ni-salida`), `checkers.ts:322` (`PROCESO_NO_TRANSFORMA`, severidad **bloqueo**, `diagnosticoSeveridad.ts:27-30`) |
| O3 | Habilitadores e invocaciones **no** satisfacen la obligación de transformar (R-PROC-2 / V-115). | MPO:201; RL/13 R-505 | `validaciones.ts:376-406` |
| O4 | **Procesos persistentes** (*Existir, Sostener, Mantener, Esperar*) solo si la temporalidad/esfuerzo sostenido es parte del hecho (R-PROC-5); se expresan con TS3 de entrada = salida (R-OPL-PERSIST-2). Si no hay esfuerzo → estructural etiquetado (heurística §22.1, AP-25). | MPO:223-235, 1381-1384 | parcial (`autoria/compilar/normalizador.ts:723` cita R-PROC-6/R-OPL-PERSIST-3) |
| O5 | **Perseverancia** no es canal visual: objeto = persistente, proceso = transitorio (V-2). | MPO:244; RL/10 R-204 | implícito |
| O6 | **Esencia** física/informacional; default **informacional** (V-1). Cosa mixta → **física** (heur. §9.11). | MPO:245, 264-266 | `tipos/entidad.ts:17` |
| O7 | **Afiliación** sistémica/ambiental; default **sistémica**. La frontera es decisión explícita por cosa, **nunca efecto del layout**. | MPO:246, 256-262 | `tipos/entidad.ts:18` |
| O8 | Herencia de afiliación: atributos de objetos ambientales son ambientales; procesos ejecutados por cosas ambientales son ambientales (R-OBJ-6/7, V-74). | MPO:252-254 | `modelo/afiliacionEfectiva.ts:4` (R-OPD-STR-13) |
| O9 | 2 formas × 2 contornos × 2 sombreados = **8 combinaciones** canónicas. | MPO:248-250; RL/10 R-205 | render |
| O10 | Seis principios (propósito, unificación FEC, valor funcional/beneficiario, función≠comportamiento, frontera, claridad vs completitud → jerarquía de OPDs) (R-PRIN-1..8). | MPO:346-371 | no aplicable |
| O11 | Un **atributo** es un objeto que caracteriza otra cosa; sus **valores son estados del atributo** (Glos 3.4/3.81). No hay primitiva "atributo". | MPO:309-318 | `Entidad.esAtributo`, `valorSlot` (`tipos/entidad.ts:124-125`) |
| O12 | **Propiedad** (inmutable en simulación: cardinalidades, etiquetas, rutas) ≠ **atributo** (mutable) (R-ATR-6). | MPO:322-326 | no modelado explícitamente |
| O13 | Tipos computacionales de atributo: `boolean, string, integer, float, double, short, long, enumerated`; dominio por intervalos `[0..100]`, `(0..*)`. | MPO:320-322; RL/73 R-3314 | `TipoValorSlot = "integer" \| "float" \| "char" \| "string"` (`tipos/entidad.ts:23`) — **subconjunto divergente** (incluye `char`, falta boolean/enumerated) |
| O14 | Estados-directos: un solo atributo relevante → valores como estados del objeto (heur. §9.12). | MPO:328-332 | libre |
| O15 | **Objetos específicos de estado**: un objeto con s estados deriva s especializaciones "refiere al estado de" (R-META-15/16, V-68). | MPO:334-342 | no implementado (avanzado) |

### 3.2 Estados y designaciones

| # | Regla | Fuente | Código |
|---|---|---|---|
| E1 | Estado = situación de un objeto; vive **solo dentro** de su objeto, no suelto (R-EST-1, V-4); es **atómico**. | MPO:211-214, 484-486 | `tipos/estado.ts:22-25` (`entidadId` obligatorio) |
| E2 | **No hay estados de proceso** (R-PROC-4, AP-12) → descomponer en subprocesos. | MPO:216-221 | `helpers.ts`/checker: estado solo en objeto (verificar al hidratar) |
| E3 | Objeto **sin estados no puede ser afectado**: solo creado/consumido (R-OBJ-2, V-5, V-7). | MPO:272-276 | `operaciones/enlaces.ts:117-128` (R-OPD-EST-3, rechazo en edición); checker `EFECTO_OBJETO_SIN_ESTADOS` = bloqueo (`diagnosticoSeveridad.ts:35-37`) |
| E4 | Designaciones: **inicial** (0..*, borde grueso), **final** (0..*, doble borde), **por defecto** (0..1, flecha diagonal abierta), **`Current` declarado** (0..1, glifo pin externo) (R-EST-2, V-6). | MPO:286-296 | `estadosDesignaciones.ts:4-26` |
| E5 | Un estado **puede ser inicial y final a la vez** (D10). Duplicarlo (`vacío_inicio`/`vacío_fin`) es AP-14. | MPO:298-302 | admitido |
| E6 | `Current` declarado (persistente) ≠ estado actual de runtime (efímero); canales y serialización distintos (R-EST-4, V-237/238). | MPO:304-307 | runtime en capa de simulación |
| E7 | Resultado **nunca** al estado inicial: al rectángulo o a estado no inicial (R-RES-1, AP-04, V-8). | MPO:691-695 | `operaciones/enlaces.ts:113-116` |
| E8 | Efecto solo-entrada (TS4) sin salida → estado **por defecto**, o distribución si no hay (R-EFE-3, V-9). | MPO:668-671 | simulación |
| E9 | Enlaces con estado especificado **anclan al rountangle** del estado, no al objeto (V-8/V-9). | RL/15 R-700 | `ExtremoEnlace.kind = "estado"` (`tipos/enlace.ts:32-41`) |
| E10 | Supresión de estados es **visual y por OPD**; el conjunto completo es la unión sobre OPDs (R-OPL-TOTAL-4/5). No suprimir un estado que participa en un enlace visible. | MPO:1113-1121; RL/33 | `Apariencia.estadosSuprimidos` (`tipos/apariencia.ts:66`) ✔; **además** `Estado.suprimido` global (`tipos/estado.ts:30`) — no canónico, ver §7 |
| E11 | Nombres de estado en **minúsculas**, forma pasiva/descriptiva (R-NOM-EST-1). | MPO:524 | `nombresCanonicos.ts:32-35` (fuerza minúscula en OPL); checker `ESTADO_NOMBRE_CANONICO` (`checkers.ts:195-212`) |
| E12 | **[F/código]** `default` y `current` son **mutuamente excluyentes** en el mismo estado. | — | `estadosDesignaciones.ts:17,24` — **no está en el canon local**; RL/11 R-303 dice "hasta cuatro designaciones simultáneas" |

### 3.3 Familias de enlace y firmas de extremos (tabla contractual)

Cinco familias base + una extensión Forja (MPO:593-617; RL/13 R-500..R-502; auditoría #12
resuelta en canon v1.4.0 como **sexta familia "Excepción procedimental"**).

| Familia | Tipo (`TipoEnlace`) | Origen → Destino | Extremo estado admitido | `e`/`c` | Abanico XOR/OR | Plantilla base |
|---|---|---|---|---|---|---|
| Transformadora | `consumo` | Objeto → Proceso | origen (TS1) | sí | sí | T1 / TS1 |
| Transformadora | `resultado` | Proceso → Objeto | destino no inicial (TS2) | **nunca** (R-MOD-1..4, AP-01/02) | sí, sin e/c (AP-03) | T2 / TS2 |
| Transformadora | `efecto` | Objeto ↔ Proceso | entrada y/o salida (TS3/TS4/TS5) | sí (no en mitades escindidas, AP-08) | sí | T3 / TS3-5 |
| Habilitadora | `agente` | Objeto (humano) → Proceso | origen (HS1) | sí | sí (convergente admitido, auditoría #32) | H1 / HS1 |
| Habilitadora | `instrumento` | Objeto → Proceso | origen (HS2) | sí | sí | H2 / HS2 |
| Invocación | `invocacion` | Proceso → Proceso (auto-invocación admitida) | no | **nunca** (AP-10) | sí, sin e/c | IV1 / IV2 |
| Excepción [F: 6ª familia] | `excepcionSobretiempo` / `excepcionSubtiempo` / `excepcionSubSobretiempo`[F] | Proceso fuente → Proceso de manejo | no | nunca | — | EX1 / EX2 |
| Estructural fundamental | `agregacion` | Obj→Obj o Proc→Proc (misma perseverancia, R-STRF-1/V-24) | **no** | nunca (AP-09) | — | RF1 |
| Estructural fundamental | `exhibicion` | **4 combinaciones** obj/proc × atributo/operación (R-STRF-2, V-25/26) | no | nunca | — | RF2 / RF2b |
| Estructural fundamental | `generalizacion` | misma perseverancia | no | nunca | — | RF3 / RF3b / RX / RH1 |
| Estructural fundamental | `clasificacion` | misma perseverancia | no | nunca | — | RF4 / RF4b |
| Estructural etiquetada | `etiquetado` (uni) | homogénea (obj↔obj, proc↔proc) | sí (SSE1-3) | nunca | — | SE1 / SE2 / SSE |
| Estructural etiquetada | `etiquetadoBidireccional` (bi/recíproco) | homogénea | sí, **excepto estado solo en destino** (V-30, AP-11) | nunca | — | SE3 / SE4 / SE5 / SSE4-7 |

Implementación de referencia (alta calidad, portar casi tal cual):
`app/src/modelo/operaciones/helpers.ts:58-148` (`validarFirmaEnlace`). Detalles relevantes:

- `helpers.ts:67-69`: estructural fundamental rechaza extremos Estado (V-237/V-239).
- `helpers.ts:70-80`: etiquetados homogéneos; bidireccional rechaza estado solo en destino (V-30).
- `helpers.ts:99-103`: **agente exige `origen.esencia === "fisica"`** — proxy necesario (humano ⇒
  físico) de R-AG-1; la humanidad en sí no es verificable automáticamente.
- `helpers.ts:119-129`: efecto admite Proceso→Objeto, Estado→Proceso (entrada) y Objeto→Proceso
  solo como rama de abanico.
- `helpers.ts:135-146`: excepción Proceso→Proceso, sin estados, y **manejador debe ser ambiental**
  (R-EXC-1A / R-OPD-CTL-6; RL/16 R-809, RL/51 R-2107). Regla canónica Forja; semánticamente
  discutible (ver §7) pero es canon.

Otras reglas de enlace:

| # | Regla | Fuente | Código |
|---|---|---|---|
| L1 | **Unicidad de rol**: un objeto/estado tiene exactamente un rol respecto de un proceso: transformado **o** habilitador (R-ROL-UNIC-1, V-11). En colisión prevalece el transformador. | MPO:621-624, 734-739 | `operaciones/enlaces.ts:1040-1110` (`validarUnicidadRolPar`, R-OPD-HAB-4); `validaciones.ts:416-441` |
| L2 | Doble rol en **procesos distintos** es legítimo (agente de uno, afectado de otro). | MPO:734-739 | admitido |
| L3 | **Agente = solo personas o grupos de personas** (R-AG-1, AP-05). Robots, software, IA, sensores, organizaciones abstractas → instrumento (R-AG-1A/1B). | MPO:710-716; manual-opforja:92-96 | `helpers.ts:99-103`; `validaciones.ts:359-373` |
| L4 | Habilitador que desaparece durante ejecución detiene el proceso; afectado queda indeterminado (R-AG-2, V-10). | MPO:723-725 | simulación |
| L5 | Instrumento con desgaste relevante → reclasificar como **afectado** + atributo de degradación + proceso de mantenimiento (R-AG-3/4). | MPO:726-730 | método |
| L6 | Co-agentes = AND implícito (varios enlaces), no "Grupo de Agentes" artificial (heur. §9.18). | MPO:731-733 | admitido |
| L7 | Consumido **desaparece al inicio**; resultante **aparece al completar**; afectado sale de su estado al iniciar y entra al de salida al completar; entre medio **indeterminado e indisponible** (R-EFE-2/2A/2B, V-49). | MPO:675-687 | `modelo/simulacion/*` |
| L8 | Consumo gradual requiere **tasa** en el enlace y **cantidad** como atributo, simultáneamente (R-CONS-2/3). | MPO:696-698 | `Enlace.tasa/unidadesTasa` (`tipos/enlace.ts:79-81`) |
| L9 | Pre(P) = consumidos + afectados (entrada) + habilitadores; Post(P) = resultantes + afectados (salida) (R-ECA-2/3). Explica la asimetría del resultado. | MPO:625-630, 782-790 | `simulacion/runner.ts:158-198` (R-EJEC-6, R-ECA-2) |
| L10 | Constructo básico = **2 cosas + 1 enlace** (R-META-10, V-60); enlace = origen, destino, conector, línea, símbolo, etiqueta?, ruta? (R-META-13). | MPO:1613-1617 | modelo |
| L11 | **[código]** Un enlace requiere dos extremos distintos, ambos con apariencia en el OPD donde se crea. | — | `operaciones/enlaces.ts:109,141-143` |

### 3.4 Control: eventos, condiciones, espera

| # | Regla | Fuente | Código |
|---|---|---|---|
| C1 | `e` y `c` **no son enlaces nuevos**: anotan un transformador o habilitador (R-ECA-4). | MPO:745-747 | `Enlace.modificador` (`tipos/enlace.ts:33,67`) |
| C2 | Sin modificador → el proceso **espera**; con `c` → **se omite** (bypass) y el control sigue; con `e` → dispara la evaluación y **el evento se pierde** tras evaluar, con o sin éxito (R-ECA-1). | MPO:749-757 | simulación |
| C3 | `e` es el segmento objeto→proceso, nunca el de retorno (V-12). | RL/16 R-801 | — |
| C4 | Múltiples eventos = **OR**; múltiples condiciones = **AND para ejecutar, OR para omitir**; **la omisión precede a la espera** (R-EJEC-7/8). | MPO:759-764, 1466-1473 | `simulacion/*` (R-EJEC-7/8) |
| C5 | **Resultado no admite `e` ni `c`** (R-MOD-1..4, AP-01/02): lo que no existe antes no dispara ni condiciona. | MPO:782-790 | `modificadores.ts:202-204` |
| C6 | `e`/`c` sobre **estructurales** o **invocación** = error de categoría (AP-09/10); sobre excepción tampoco. | MPO:792-795 | `modificadores.ts:199-204` |
| C7 | `c`+`e` en el mismo enlace: **zona no canonizada** (AP-28) → control externo explícito. | MPO:792-793; hoja control-flujo | el modelo solo admite **un** modificador por enlace (consistente) |
| C8 | Mitades escindidas TS4/TS5 **no admiten** modificadores (AP-08, V-41). | MPO:1160-1161 | `modificadores.ts:205-207` |
| C9 | Un proceso **omitido no dispara** sus invocaciones de salida (R-EJEC-9). | MPO:1478-1480 | simulación |
| C10 | NOT no existe en OPM: se modela con estados `existente`/`no-existente` (§10.6). | MPO:1009-1012 | — |
| C11 | **[F]** Negación `¬` (modificador `"no"`) es extensión Forja/opforja fuera del núcleo ISO; solo se emite si el consumidor declara soporte. | hoja control-flujo §6.1 | `Modificador = "condicion" \| "evento" \| "no"` (`tipos/enlace.ts:33`); OPL `procedural.ts:367-400` |
| C12 | Anti-patrón: enlace sin `c` para recurso que puede no llegar → **interbloqueo**. | MPO:755-757 | método |

### 3.5 Excepciones temporales y duración

| # | Regla | Fuente | Código |
|---|---|---|---|
| X1 | Duración de **proceso**: (mín, esperada, máx) + distribución opcional, mostrada dentro de la elipse `Procesar [min] (30.0, 45.6, 60.0)` (V-45). | MPO:799-800, 1493-1497 | **no existe duración de proceso en el modelo** (§7-G1) |
| X2 | Sobretiempo `/` si real > máx; subtiempo `//` si real < mín. Familia autónoma proceso→proceso (R-EXC-1B). | MPO:797-808 | `TipoEnlace` + `tiempoMaximo/tiempoMinimo` en el **enlace** (`tipos/enlace.ts:82-89`) |
| X3 | Subtiempo como **detector de omisión** (duración 0 < mín). | MPO:810-813 | — |
| X4 | El manejo de excepción es el único mecanismo que **resuelve el estado indeterminado** de un afectado cuyo proceso abortó. | MPO:813-816 | — |
| X5 | Unidades: `ms, sec, min, hour, day, week, month, year` (+ abreviaturas históricas). | RL/51 R-2102 | `UnidadTiempo = "ms"\|"s"\|"min"\|"h"\|"dia"\|"sem"\|"mes"\|"año"` (`tipos/estado.ts:13`) — vocabulario propio |
| X6 | Sin distribución toda instancia dura lo esperado (irreal); con distribución cada instancia muestrea. | MPO:1495-1497 | `DistribucionSimulacion` (en atributos, `tipos/entidad.ts:25`) |
| X7 | **[F]** `excepcionSubSobretiempo` (ambos umbrales en un enlace). | — | `tipos/enlace.ts:29`; OPL `procedural.ts:237-238` — extensión no documentada en canon local |

### 3.6 Invocación

| # | Regla | Fuente | Código |
|---|---|---|---|
| I1 | Invocación proceso→proceso (rayo con **punta**); equivale a un objeto transitorio suprimido. Auto-invocación = bucle. | MPO:818-828; RL/12 R-404 | `TipoEnlace "invocacion"`; `modelo/autoinvocacion.ts` |
| I2 | **Invocación implícita**: dentro de un proceso descompuesto el tiempo fluye de arriba hacia abajo; la terminación de un subproceso invoca al inmediatamente inferior (R-INV-2). Misma altura del borde superior = **paralelo** (R-INV-2A); del grupo paralelo, **el último en terminar** invoca al siguiente (R-INV-2C). | MPO:830-837 | `Opd.ordenInzoom` (`tipos/opd.ts:29-36`) |
| I3 | La fuente de verdad del orden es el **orden declarado**; la coordenada Y lo realiza, no lo define (R-IDP-0A). | MPO:839-841 | `Opd.ordenInzoom?: Id[][]` (bandas); spec invocación §3 |
| I4 | **Doble vara prohibida**: no dibujar rayo entre subprocesos ya ordenados por posición (R-INV-2B/2D). Rayo explícito solo para **bucles** (auto-invocación o **retorno al padre**), **saltos fuera de orden** y **cruces entre OPDs**. | MPO:841-845 | checker `INVOCACION_REDUNDANTE_CON_ORDEN` = bloqueo (`checkers.ts:512-550`, `diagnosticoSeveridad.ts:50-53`) |
| I5 | Reactivo por evento: subprocesos activados por eventos desde estados distintos son **asíncronos** (V-59); se modela con enlace de **evento**, no con rayo (R-OPD-INV-3). | RL/21 R-1007; spec invocación §2 | — |
| I6 | Demora: no existe demora sobre invocación implícita; espera intra-secuencia = subproceso *Esperar N*; "después de N" solo sobre rayo explícito (R-OPD-INV-5). | spec invocación §2 | `Enlace.demora` solo en `invocacion` (`modificadores.ts:103`) |
| I7 | Objeto transiente creado y consumido sin observación → suprimirlo y usar invocación (AP-26). | MPO:847-855 | método |
| I8 | Invocación implícita solo en descomposición de **proceso**; en descomposición de **objeto** la posición codifica disposición, no tiempo (V-77/V-78). | RL/21 R-1005/1006 | **violado** por OPL de objeto descompuesto (§6.2-D10) |

### 3.7 Estructurales fundamentales y herencia

| # | Regla | Fuente | Código |
|---|---|---|---|
| S1 | Triángulo con **vértice al refinable**, base a refinadores (R-TRI-1, V-3). | MPO:449-455 | render (en el modelo opforja el enlace va **refinable → refinador**: `estructural.ts:68-78`) |
| S2 | Topología interna es canal normativo: relleno = agregación; triángulo interior = exhibición; vacío = generalización; círculo interior = clasificación (R-TRI-2, V-128). Perderla es no conforme. | MPO:456-461 | render |
| S3 | Agregación: partes transformables independientemente del todo (R-STRF-4, V-57). | MPO:864-868 | — |
| S4 | Exhibición: rasgo = atributo (objeto) u operación (proceso); única relación estructural heterogénea; "así como" separa atributos de operaciones (RF2b). | MPO:870-881 | `helpers.ts:86-88` |
| S5 | Generalización: **herencia total** de partes, rasgos, etiquetados y procedimentales; lo heredado **no se redibuja** (R-HER-1, AP-29); herencia múltiple (RH1, V-28); sobreescritura (R-HER-5, V-75); la instancia especializada no existe sin la general (R-HER-6). | MPO:885-896 | parcial (`modelo/inheritedFanGuard.ts`) |
| S6 | **Atributo discriminante**: cada especialización exhibe el atributo en un estado; máximo de especializaciones = producto cartesiano de valores (R-HER-4, V-29). | MPO:898-906 | — |
| S7 | Clasificación-instanciación **no distingue colección completa/incompleta** (R-STRF-3, V-27); instancia visual (apariencia) ≠ instancia lógica (R-INS-2, V-101); "instancia" es relativa al sistema de discurso. | MPO:927-937 | — |
| S8 | Salvo exhibición, refinable y refinadores comparten perseverancia (R-STRF-1, V-24). | MPO:941-944 | `helpers.ts:81-98` |
| S9 | **Colección incompleta**: barra bajo el triángulo; OPL "…y al menos otra parte / otro rasgo / otra especialización". | MPO:477-478, 866-868, 1768 | — |
| S10 | "**puede estar**" = estados (estar); "**puede ser**" = especialización disyuntiva (ser) (R-OPL-RF-5, RX1/RX2). | MPO:908-920 | `duracionMetadata.ts:65-70` usa `puede estar` ✔ |
| S11 | Estructurales **no se distribuyen** al descomponer y **no se abstraen** al recomponer (V-105). | MPO:1137; RL/32 R-1315 | — |

### 3.8 Estructurales etiquetados

| # | Regla | Fuente |
|---|---|---|
| T1 | Uni con etiqueta (punta abierta): `**Origen** etiqueta **Destino**.` (SE1); sin etiqueta: `se relaciona con` (SE2). | MPO:950-953 |
| T2 | Bidireccional (arpones, dos etiquetas): dos oraciones SE3; recíproco (una etiqueta): `**O** y **D** son etiqueta.` (SE4) / `se relacionan.` (SE5). | MPO:954-956 |
| T3 | Etiqueta = frase breve en minúscula que actúa como verbo/predicado (R-OPL-SE-1). Bidireccional con etiquetas iguales = recíproco (R-STRE-1, V-56). | MPO:957-959 |
| T4 | Variantes con estado SSE1–SSE7; bi/recíproco no existen con estado solo en destino (AP-11, V-30). | MPO:960-962; RL/72 R-3204 |
| T5 | Requisitos se trazan con etiquetado `satisface` (estructural, nunca procedimental). | RL/52 R-2218/2219 |

### 3.9 Abanicos lógicos y probabilidad

| # | Regla | Fuente | Código |
|---|---|---|---|
| F1 | **AND** = enlaces separados sin arco (predeterminado); **XOR** = un arco discontinuo ("exactamente uno de"); **OR** = dos arcos concéntricos ("al menos uno de"). | MPO:966-975 | `OperadorAbanico = "O" \| "XOR"` (`tipos/abanico.ts:12`) — AND implícito ✔ |
| F2 | Abanico **convergente** (N→1 extremo común) o **divergente** (1→N); arco en el extremo convergente/común (R-FAN-GEO-1/2, V-16/17). | MPO:982-984 | `Abanico.puertoComun` (`tipos/abanico.ts:23`) |
| F3 | XOR/OR aplican a **todas** las familias procedimentales (consumo, resultado, efecto, agente, instrumento, invocación) (V-15); `e`/`c` en ramas se ponen en cada enlace, nunca en resultado ni invocación (AP-03/AP-10). | MPO:984-986; auditoría #49 | `abanicos.ts:370-372` (solo procedimentales), `:378` homogéneos, `:387-391` puerto común, `:363` ≥2 enlaces, `:397` un enlace ∈ un solo abanico |
| F4 | Abanicos **convergentes de habilitadores admitidos** ("*P* es manejado por exactamente uno de **A** o **B**"). | MPO:979-980, 1785; auditoría #32 | soportado |
| F5 | Probabilístico: siempre **XOR**; cada rama `Pr=p`; **suma exactamente 1** (R-PROB-1, V-18). | MPO:988-992 | `abanicos.ts:129` (solo XOR), `:477-492` (todas las ramas, suma 1 ±1e-9) |
| F6 | Régimen R-FAN-PROB-1: (A) pesos conocidos → anotar, suma 1; (B) alternativas ordinarias → nada; (C) probabilístico **sin pesos** → declararlo, sin inventar ni uniforme silencioso. | MPO:992-1002 | caso C **PROGRAMADO** (registro de conformidad); uniforme solo en simulación, no persistido |
| F7 | m-de-f ("exactamente/al menos m de f", f>2) anotado junto al arco. | MPO:1006-1008 | no implementado |
| F8 | **[F]** R-FAN-5A/5B, C-21b: abanico TS3 con **estado de entrada común** y salidas alternativas es reversible; variar entrada y salida a la vez **falla cerrada**. | canon-opm/spec-forja-opl.md:84-92 | `opl/generadores/abanico.ts:71`, `parser/tipos.ts:226-242` |
| F9 | No-determinismo: proceso que genera objeto con n estados sin especificar → 1/n por estado (**regla de simulación, no licencia de modelado**). Resultado simple ≡ XOR de resultados con estado (V-19). | MPO:1500-1503; RL/15 R-713 | simulación |

### 3.10 Multiplicidad, rutas, escenarios

| # | Regla | Fuente | Código |
|---|---|---|---|
| M1 | Multiplicidad `?` (0..1), `*` (0..*), `+` (1..*), sin símbolo (1..1), rangos, listas, expresiones parametrizadas, restricciones (`=,≠,<,≤,≥,∈`), delimitadores `[ ]`/`( )`. | RL/16 R-821/822; RL/73 R-3312/3313 | `validarMultiplicidad` (acepta `1, +, *, ?, 0..1, 2..*, 2..N, 1..5`; `operaciones/enlaces.ts:67-69`) — **subconjunto** |
| M2 | Multiplicidad en etiquetados, agregación y procedimentales; **no en procesos** (V-23). Nombres de parámetros únicos en el modelo (V-21). | RL/16 R-823/825 | — |
| M3 | OPL de cardinalidad: `un/una X opcional`, `al menos un/una X`, `b **X**` (parámetro). | RL/73 R-3312; RL/72 R-3218 | `refsHints.ts:190-204` |
| M4 | **Etiqueta de ruta**: al salir se sigue el enlace cuya etiqueta coincide con la de entrada; `Por ruta etiqueta, *P* consume **O**.`; un **escenario** = conjunto de etiquetas de ruta; conjunto de escenarios = repertorio de comportamiento. | MPO:1013-1019 | `Enlace.rutaEtiqueta`; `procedural.ts:31-36` |
| M5 | Ruta sobre habilitadores: **canónica condicionada** (conflicto interno §4.12 vs §11.2 del canon, auditoría #9/#35/#39). | auditoría | — |
| M6 | Objetos booleanos (`sí`/`no`) + condiciones = si-entonces-sino; generalizable a n estados. | MPO:1020-1023 | patrón |

### 3.11 Refinamiento y abstracción

**Pares canónicos** (MPO:1049-1054; RL/30 R-1100): expresión↔supresión (estados);
despliegue↔plegado (estructura, **asíncrono**); descomposición↔recomposición (comportamiento,
**síncrono**); referencia a sub-modelo↔desconexión (inter-modelo). Bring/"traer conectados" es
**operador derivado**, no refinamiento (V-243, D3).

| # | Regla | Fuente | Código |
|---|---|---|---|
| R1 | Descomposición (in-zoom) síncrona: el padre espera a todos (R-REF-SYNC-1); despliegue asíncrono, sin secuencia (R-REF-SYNC-2). Orden fijo → descomposición; funciones independientes → despliegue por agregación; variantes → generalización. | MPO:1056-1078 | `TipoRefinamiento`, `ModoDespliegueObjeto` (`tipos/entidad.ts:19-20`) |
| R2 | **No trivialidad**: descomposición ≥2 subprocesos; despliegue ≥2 refinadores (R-REF-NTRIV-1..3, AP-13). | MPO:1082-1084 | `checkers.ts:245-315` (`INZOOM/UNFOLD_CONTENIDO_INSUFICIENTE`, mejora) |
| R3 | Esencia, perseverancia y **nombre no cambian** al refinar (R-REF-4, V-95..97). | MPO:1085-1086 | existencia única en `Entidad` |
| R4 | **Sin ciclos** de refinamiento, chequeo transitivo (R-REF-1, AP-16, V-100). | MPO:1087-1088 | `operaciones/refinamiento/establecer.ts:63-65` (R-OPD-REF-8) |
| R5 | **Contorno grueso** en el refinable, en padre e hijo, para in-zoom y unfold **a nuevo OPD**; el despliegue intradiagrama no lo produce (V-33/69/70). | MPO:1089-1091; RL/10 R-210/211 | render |
| R6 | Profundidad justificada: un OPD que no agrega transformados/estados/enlaces sobra. | MPO:1092-1094 | método |
| R7 | Una entidad puede tener **descomposición y despliegue simultáneos** (ortogonales). Ramas hermanas de distinto tipo (SD1 descomposición, SD2 despliegue). | RL/30 R-1127 | `Entidad.refinamientos: Partial<Record<TipoRefinamiento, SlotRefinamiento>>` (`tipos/entidad.ts:121`) |
| R8 | En el hijo: el refinable es **contenedor**; las cosas conectadas al refinado en el padre se copian como **externos** (V-79..81); en despliegue solo hijos estructurales directos (V-82); externos no se refinan en ese OPD (V-83); estructurales al contenedor visibles, procedimentales se distribuyen (V-91/92); enlaces irrelevantes invisibles (V-94). | RL/30 R-1108..1120 | `ContextoRefinamientoApariencia.rol = "contorno"\|"interno"\|"externo"` (`tipos/apariencia.ts:15-25`) |
| R9 | Externos solo por *pullback* desde el refinado en el padre, no por vecindad de subprocesos. | opmodel/13-pre-render §In-zoom slice contract | — |
| R10 | **Alcance interior/exterior es semántico, no posicional**: mover un externo dentro de la elipse no lo vuelve interior; interiores se eliminan en cascada con el padre (V-84/85). | MPO:1358-1364 | **violado parcialmente**: `validaciones.ts:309-330` decide internalidad con `dentroDe(apariencia, contorno)` (§7-G3) |
| R11 | Cambio de rol entre niveles: instrumento en SD / afectado en SD1 válido **solo si** el cambio neto abstracto es cero (R-ROL-1, V-42); si no, afectado en ambos (R-ROL-3); solo en descomposición (V-112). | MPO:1163-1172 | — |
| R12 | Consistencia de hechos: un OPD no contradice a otro; refinar/abstraer no es contradicción (R-CONSIST-1/2, V-98). | MPO:1189-1194 | `equivalencia/` (firma de frontera) |
| R13 | **[F]** Firma de frontera: una descomposición válida conserva roles netos de entrada/salida/habilitación del padre; igualdad de firma es condición necesaria, no identidad ni bisimulación (R-CAT-EQ-2/3). | manual-opforja:103-105, 254-256; registro de conformidad | `DESCOMPOSICION_NO_PRESERVA_FRONTERA` (`checkers.ts:134`) |
| R14 | Semi-plegado: solo agregación; por refinador; indicador = número de **ocultos**; por OPD; sin plantilla OPL propia (V-116..120). | RL/34 | `ModoPlegado = "completo"\|"parcial"\|"plegado"\|"desplegado"` (`tipos/apariencia.ts:11`) |
| R15 | Simplificación de OPD sobrecargado prohibida si crea procedimentales directos entre procesos pares sin semántica (R-SIMP-2). Importancia ∝ OPD más alto (R-IMP-1). | MPO:1206-1214 | — |
| R16 | **[F]** Out-zoom/recomposición: **PROGRAMADA**, sin superficie de autoría. | registro de conformidad | no implementado |

**Tabla normativa de distribución al descomponer** (MPO:1130-1139; RL/31 R-1201; V-36..41,
V-103..112):

| Enlace del padre | ¿Puede quedar en el contorno? | Distribución |
|---|---|---|
| Consumo | **Prohibido** (V-37, AP-06) | primer subproceso (provisional) → reasignar al que consume |
| Resultado | **Prohibido** (V-37, AP-06) | último subproceso (provisional) → reasignar al que genera |
| Efecto sin estados | permitido | a todos |
| Efecto entrada-salida (TS3) | — | **escisión obligatoria**: TS4 en subproceso temprano, TS5 en tardío; única vía (V-40, V-110, AP-07); mitades sin e/c (AP-08) |
| Agente / Instrumento | permitido | a todos o a los subprocesos donde se requiere |
| Estructural | no se distribuye | permanece en el contenedor |
| Evento desde objeto **sistémico** | **prohibido cruzar la frontera** (V-38, AP-21) | — |
| Evento desde objeto **ambiental** | permitido cruzar con contingencia (V-108) | — |
| Sin subprocesos aún | respaldo temporal al contenedor (V-106) | — |

Evento a subproceso **no inicial** exige verificar que los previos pueden omitirse (AP-27).
Invocación implícita padre→primero, sub→siguiente, último→padre (RL/31 R-1222).
Código: `Enlace.efectoEscindido`, `estadoEntradaId/estadoSalidaId`, `derivado`
(`tipos/enlace.ts:50-57, 91-98`); proyección `operaciones/refinamiento/proyeccion.ts`.

**Recomposición — fuerza semántica** (MPO:1174-1187; RL/32 R-1300..1315):

Matriz transformadora B↔P1 × B↔P2: efecto+efecto=efecto; efecto+resultado=resultado;
efecto+consumo=consumo; **resultado+resultado = inválido**; **consumo+consumo = inválido** (AP-30,
V-43); resultado+consumo = **efecto** solo si hay continuidad de identidad y estados trazables
(R-PREC-3). Transformador > habilitador (V-44). Orden de 12 niveles:
evento de consumo > consumo = resultado > condición de consumo > evento de efecto > efecto >
condición de efecto > evento de agente > agente > condición de agente > evento de instrumento >
instrumento > condición de instrumento ("el evento fortalece, la condición debilita"). La fuerza
semántica **solo resuelve colisiones**, no autoriza fusionar hechos ni se usa en simulación.
Código: checker `PAR_TRANSFORMADOR_DUPLICADO` = bloqueo (`checkers.ts:337-375`);
`consumo-doble-mismo-objeto` (`validaciones.ts:445-470`).

### 3.12 Árbol de OPDs, identidad y vistas

| # | Regla | Fuente | Código |
|---|---|---|---|
| A1 | SD = OPD raíz; SD → SD1 → SD1.1… El OPL total = concatenación de párrafos en **orden de navegación** del árbol (R-OPL-TOTAL-1). | MPO:1098-1102 | `modelo.opdRaizId`, `Opd.padreId`, `ordenLocal` (`tipos/opd.ts:14-28`) |
| A2 | `SD1.2` es **proyección humana de navegación**, no identidad; todo OPD tiene **ID persistente**; referencias externas usan el ID (R-IDP-0..3, AP-17, V-246..250). Tres canales: orden temporal, orden de navegación, identidad (D6). | MPO:1104-1111 | `Opd.id` |
| A3 | SD contiene **exactamente un proceso sistémico** (V-46); puede tener ambientales. Excepción: vistas de sub-modelo (V-186). | RL/40 R-1700 | checker `SD_SIN_PROCESO_PRINCIPAL` (`checkers.ts:681`, **mejora**) |
| A4 | Tres categorías de OPD: **jerárquico** (por refinamiento), **vista anclada** (mapa del sistema, sub-modelo, requisitos), **vista ad hoc**; ninguna vista crea hechos (R-VIEW-2, V-114, D5). | MPO:1198-1205 | `Opd.vista?: OpdVista`; `generar.ts:69-74` (vista genérica no emite OPL) |
| A5 | Solo OPDs jerárquicos **hoja** son eliminables; vistas por su política (V-113/245). | RL/40 R-1711/1712 | `modelo/opdEliminacion.ts` |
| A6 | Mapa del sistema recomendado a partir de ~10 OPDs. Modelos detallados: 5–10 niveles. | MPO:1204-1205, 1592-1593 | `canvas/mapa` |
| A7 | Legibilidad **20–25 cosas por OPD** (V-50); sin oclusión, minimizar cruces (V-51). | MPO:488-494 | `validaciones.ts:85` (`canon-diagrama-densidad`) |

### 3.13 Metamodelo, apariencias y sub-modelos

| # | Regla | Fuente | Código |
|---|---|---|---|
| MM1 | Modelo = OPDs + OPL + metadatos de identidad (+ 0..* sub-modelos). | MPO:1607-1611; RL/41 R-1800 | `tipos/modelo.ts` |
| MM2 | **Existencia única** (nombre, esencia, estados) vs **apariencia local** por OPD (vista geométrica) vs **referencia externa** (préstamo cross-model sin propiedad) (V-123, D1). Eliminar apariencia ≠ eliminar cosa. | RL/41 R-1808/1809; uso-productivo:17-35 | `Entidad` vs `Apariencia` (`tipos/apariencia.ts:33-67`) |
| MM3 | Unicidad nominal a nivel de modelo; sinónimos se resuelven, homónimos se separan (V-47, AP-22). Conflicto de nombre se resuelve explícitamente, nunca con reescritura silenciosa (V-222). | MPO:1396-1398 | `operaciones/colisionNombre.ts` |
| MM4 | Apariencias duplicadas en el mismo OPD: silueta desplazada (§1.8). | RL/41 R-1816 | `apariencias[].instancia` |
| MM5 | Sub-modelos: DAG; OPL local autocontenido por modelo (no se colapsa); la existencia pertenece al propietario; el consumidor no renombra, no agrega estados, no modifica (R-META-4/5/6/8, AP-18); contrato de interfaz congelado; cruce en ejecución = transición explícita de frontera. | MPO:1216-1241 | `modelo/submodelos.ts`; OPL CM `composicionIntermodelo.ts` |
| MM6 | Estado de carga es propiedad de la **referencia**: cargado-sincronizado / cargado-no-sincronizado / no-cargado (V-256). | RL/42 R-1910 | `submodelos[*].estado` (`documentPolicy.ts:117`) |

### 3.14 Ejecución (ciclo ECA)

1. Evento (OR) consumido al evaluar; 2. condiciones antes que todo, fallo → omitir (la omisión
precede a la espera); 3. precondición Pre(P) completa, si falta algo no condicional → esperar;
4. inicio: consumidos desaparecen, afectados salen de su estado; 5. ejecución con duración
(muestreo), excepciones por umbrales; 6. término: resultantes nacen, afectados entran al estado de
salida, invocaciones de salida disparan (salvo omitido) (MPO:1462-1480). Descomposición: control
recursivo al subproceso más profundo y retorno al padre al completar el último (MPO:1516-1519).
Un enlace no implica comportamiento hasta que existan **instancias operacionales** (R-INS-4).

### 3.15 Reglas visuales OPD (subordinadas; lo que es canal normativo)

- Formas: rectángulo = objeto, elipse = proceso, rountangle **dentro** del objeto = estado
  (MPO:420-424). Contorno discontinuo ≡ ambiental; sombra ≡ física; defaults no se marcan.
- **El color es informativo, no normativo** (R-COLOR-1/2): semántica en forma, contorno,
  sombreado y topología (MPO:431-434).
- Decoraciones (MPO:438-447): punta cerrada = transformadores; piruleta negra = agente; blanca =
  instrumento (en el extremo del proceso, origen limpio); rayo con punta = invocación; punta abierta =
  etiquetado uni; arpón = bi/recíproco.
- Marcas sobre enlaces: `e`, `c`, `/`, `//`, `Pr=p`, etiqueta estructural en itálica, etiqueta de
  ruta (no en itálica, para no confundirla) (MPO:463-473; RL/12 R-406).
- Indicadores: colección incompleta (barra), supresión de estados (`...`), contorno grueso =
  refinado en otro OPD (MPO:475-486).
- Canon de export (RL/01): lo que no persiste en un export canónico es UI; canon-diagrama
  (vectorial, por OPD) y canon-documento (por modelo, con OPL); handles/grid/overlays/tokens de
  runtime/marcas de validación fuera del canon; rótulos íntegros (sin elipsis); política de
  **canvas limpio** para validación (V-219). Código: `serializacion/perfilesExport.ts` (R-VIS-EXP-2,
  R-OPD-CAN-1).
- Marcas de simulación: proceso activo con canal reservado distinto del contorno grueso; estado
  actual runtime con glifo externo; tokens solo en snapshot declarado (RL/50).

---

## 4. OPL-ES canónico (plantillas exactas del corpus local)

### 4.1 Principios de la superficie

- Bimodalidad / **hecho único** (R-BI-0, R-BI-DUAL-1): OPD y OPL son proyecciones del mismo
  hecho; toda afirmación gráfica tiene oración y viceversa; editar uno regenera el otro; el parser
  ante ambigüedad **rechaza, no inventa** (R-BI-2) (MPO:407-414, 1838-1842; manual-opforja:494-496).
- Orden sujeto-verbo-complemento del OPL-EN preservado (R-OPL-6).
- **Ser vs estar** (R-OPL-2): *estar* para estados; *ser* para invariantes.
- Estado **sigue** al objeto con "en": `**Usuario** en `activo` maneja *Procesar*.` (R-OPL-4).
- Pasiva refleja ("se consume", "se omite") (R-OPL-5).
- Artículos omitidos salvo "es un/una", "de lo contrario", "al menos" (R-OPL-3); sin "a" personal.
- **Tipografía** (R-OPL-TYPO-1): **objeto** en negrita, *proceso* en cursiva, `estado` en
  monoespaciado (MPO:513-515). Código: `refsHints.ts:172-180`, `nombresCanonicos.ts`.
- Listas: coma + "y" final; "e" ante i-/hi-, "u" ante o-/ho- (RL/72 R-3217; RL/73 R5/R6).
- Un idioma OPL por modelo; cambio de idioma = regeneración completa (RL/70 R-3019).
- OPL por OPD enumera solo estados visibles en ese OPD (R-OPL-TOTAL-4/5, R-CX-EST-1).

### 4.2 Nombres

| Clase | Regla | Válidos | Inválidos |
|---|---|---|---|
| Objeto | sustantivo **singular**, palabras léxicas capitalizadas (R-NOM-OBJ-1) | **Ingrediente**, **Torta de Manzana** | «Ingredientes» |
| Plural | **Conjunto de X** (inanimados), **Grupo de X** (humanos) (R-NOM-OBJ-2) | **Conjunto de Platos**, **Grupo de Comensales** | «Los Platos» |
| Proceso | forma **deverbal**: infinitivo o nominalización (-ción, -miento, -aje, o sin sufijo: *Despacho*, *Cierre*, *Ingreso*, *Traslado*) (R-NOM-PROC-1, ampliada por auditoría); 2–4 palabras (R-NOM-PROC-2) | *Preparar Empanadas*, *Verificación de Identidad* | «Sistema», «Gestión» como comodín |
| Estado | **minúsculas**, forma pasiva/descriptiva (R-NOM-EST-1) | `vacío`, `pre-cortada` | «Vacío» |

Fuente: MPO:517-528. Código: `nombresCanonicos.ts:37-91` (acepta `-ar/-er/-ir/-izar/-ion/-aje/-miento/-ing`
en primera o última palabra), checkers `PROCESO_NOMBRE_FORMA_VERBAL`, `OBJETO_NOMBRE_SINGULAR`
(sugerencia), `ESTADO_NOMBRE_CANONICO` (advertencia) en `checkers.ts:195-240`.

### 4.3 Vocabulario fijo

Verbos (MPO:534-545): consume · genera · afecta · cambia … de … a · maneja · requiere · inicia ·
invoca · ocurre · se omite · consta de · exhibe · son / es un·una · es una instancia de ·
se relaciona con · puede estar · puede ser · se descompone en … en esa secuencia · se despliega en.
Palabras clave (MPO:547-549): si · en cuyo caso · de lo contrario · exactamente uno de · al menos uno
de · así como · por ruta · en esa secuencia · duración de · excede · es menor que · (y RL/70 R-3015:
de, a, un/una opcional, al menos un/una, al menos otro/a).

### 4.4 Plantillas (fuente: MPO Apéndice B 1695-1789 + RL/70-73)

**Descripción de cosas y estados**

| ID | Plantilla |
|---|---|
| D1–D4 | `**Cosa** es física.` / `… es informacional.` / `… es ambiental.` / `… es sistémica.` |
| D11/D12 | `**Cosa** es persistente.` / `… es transitoria.` |
| D5 | `**Objeto** puede estar `e1`, `e2` o `e3`.` |
| D6 | `**Objeto** puede estar `e1`, …, y otros estados.` |
| D7/D8/D9 | `Estado `s` de **Objeto** es inicial.` / `… es final.` / `… es por defecto.` |
| D10 | `Estado `s` de **Objeto** es inicial y final.` |
| D13 | `Estado `s` de **Objeto** es declarado `Current`.` |
| Persistente | `*Mantener Presión* cambia **Tanque** de `presurizado` a `presurizado`.` |

**Transformadores**: T1 `*Procesar* consume **Consumido**.` · T2 `*Procesar* genera **Resultado**.` ·
T3 `*Procesar* afecta **Afectado**.` · TS1 `*Proceso* consume **Objeto** en `estado`.` ·
TS2 `*Proceso* genera **Objeto** en `estado`.` · TS3 `*Proceso* cambia **Objeto** de `entrada` a `salida`.` ·
TS4 `*Proceso* cambia **Objeto** de `entrada`.` · TS5 `*Proceso* cambia **Objeto** a `salida`.`

**Habilitadores**: H1 `**Agente** maneja *Proceso*.` · HS1 `**Agente** en `estado` maneja *Proceso*.` ·
H2 `*Proceso* requiere **Instrumento**.` · HS2 `*Proceso* requiere **Instrumento** en `estado`.`

**Eventos**: ET1 `**Objeto** inicia *Proceso*, que consume **Objeto**.` · ET2 `… que afecta **Objeto**.` ·
EH1 `**Agente** inicia y maneja *Proceso*.` · EH2 `**Instrumento** inicia *Proceso*, que requiere **Instrumento**.` ·
ETS1 `**Objeto** en `estado` inicia *Proceso*, que consume **Objeto**.` ·
ETS2 `**Objeto** en `entrada` inicia *Proceso*, que cambia **Objeto** de `entrada` a `salida`.` ·
ETS3 `… que cambia **Objeto** de `entrada`.` · ETS4 `**Objeto** en cualquier estado inicia *Proceso*, que cambia **Objeto** a `destino`.` ·
EHS1 `**Agente** en `estado` inicia y maneja *Proceso*.` · EHS2 `**Instrumento** en `estado` inicia *Proceso*, que requiere **Instrumento** en `estado`.`

**Condiciones** (patrón trimembre): CT1 `*Proceso* ocurre si **Objeto** existe, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite.` ·
CT2 `*Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* afecta **Objeto**, de lo contrario *Proceso* se omite.` ·
CH1 `**Agente** maneja *Proceso* si **Agente** existe, de lo contrario *Proceso* se omite.` ·
CH2 `*Proceso* ocurre si **Instrumento** existe, de lo contrario *Proceso* se omite.` ·
CS1 `*Proceso* ocurre si **Objeto** está en `estado`, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite.` ·
CS2 `… está en `entrada`, en cuyo caso *Proceso* cambia **Objeto** de `entrada` a `salida`, de lo contrario …` ·
CS3 `… de `entrada`, …` · CS4 `*Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* cambia **Objeto** a `salida`, …` ·
CS5 `**Agente** maneja *Proceso* si **Agente** está en `estado`, de lo contrario *Proceso* se omite.` ·
CS6 `*Proceso* ocurre si **Instrumento** está en `estado`, de lo contrario *Proceso* se omite.`

**Excepción e invocación**: EX1 `*Manejo* ocurre si duración de *Fuente* excede máx-duración unidades-tiempo.` ·
EX2 `*Manejo* ocurre si duración de *Fuente* es menor que mín-duración unidades-tiempo.` ·
IV1 `*Invocador* invoca *Invocado*.` · IV2 `*Invocador* se invoca a sí mismo.`

**Estructurales**: RF1 `**Todo** consta de **Parte1**, **Parte2** y **Parte3**.` ·
RF2 `**Exhibidor** exhibe **Atributo1** y **Atributo2**.` · RF2b `… exhibe **Atributo1** así como *Operación1*.` ·
RF3 `**E1** y **E2** son **General**.` · RF3b `**E** es un **General**.` (género: es una **Máquina**) ·
RX1 `**Especial** puede ser **G1** o **G2**.` · RX2 `… puede ser uno de **G1**, **G2** o **G3**.` ·
RH1 `**Especial** es un **General1** y un **General2**.` · RF4 `**Instancia** es una instancia de **Clase**.` ·
RF4b `**I1** e **I2** son instancias de **Clase**.` · colección incompleta `… y al menos otra parte / otro rasgo / otra especialización.` ·
SE1 `**Origen** etiqueta **Destino**.` · SE2 `**Origen** se relaciona con **Destino**.` ·
SE3 `**Origen** etiqueta-f **Destino**.` + `**Destino** etiqueta-b **Origen**.` (dos oraciones) ·
SE4 `**Origen** y **Destino** son etiqueta.` · SE5 `**Origen** y **Destino** se relacionan.` ·
SSE1 `**Origen** en `estado` etiqueta **Destino**.` · SSE2 `**Origen** etiqueta **Destino** en `estado`.` ·
SSE3 `**Origen** en `sa` etiqueta **Destino** en `sb`.` · SSE4 `**Origen** en `sa` etiqueta-f **Destino**.` ·
SSE5 `**Destino** etiqueta-b **Origen** en `sa`.` · SSE6 `**Origen** en `sa` y **Destino** en `sb` son etiqueta.` ·
SSE7 `**Destino** y **Origen** en `sa` son etiqueta.`
Atributo discriminante: `**Auto** exhibe **Medio de Desplazamiento** en `tierra`.`

**Gestión de contexto**: CX1 `*Proceso* se descompone en *P1*, *P2* y *P3*, en esa secuencia.` ·
CX2 `*Proceso* se descompone en paralelo *P1* y *P2*.` · mixta `*Proceso* se descompone en *A*, paralelo *B* y *C*, y *D*, en esa secuencia.` ·
CX3 `**Cosa** se despliega en SD1 en **T1**, **T2** y **T3**.` · CX4 `SD se refina por descomposición de *Proceso* en SD1.` ·
CX5–CX8 `*Proceso*/**Objeto** se pliega en el OPD padre.` / `… se recompone desde `diagrama`.` ·
Asíncrona: `*Proceso* se descompone en *P1*, *P2* y *P3*.` (sin "en esa secuencia") + oraciones de evento.

**Inter-modelo**: CM1 `SD1.1 es una vista de sub-modelo de Modelo Subsistema.` ·
CM2 `SD1.1 referencia el sub-modelo Modelo Subsistema desde SD1.` ·
CM3 `**Cosa** en SD1.1 es referencia externa a **Cosa** del modelo propietario Modelo Principal.`

**Operadores y otros**: XOR `*P* consume exactamente uno de **A**, **B** o **C**.` · OR `*P* genera al menos uno de **A**, **B** o **C**.` ·
XOR agente convergente `*P* es manejado por exactamente uno de **A** o **B**.` · XOR resultado convergente `Exactamente uno de *Aprobar* o *Rechazar* genera **Dictamen**.` ·
Evento+XOR: insertar "inicia"; condición+XOR: "si … existe/está en … de lo contrario … se omite"; OR: "al menos" ·
Ruta `Por ruta etiqueta, *Proceso* consume **Objeto**.` · Valor `**Atributo** de **Objeto** es valor.` ·
Rango `**Atributo** de **Objeto** varía de X a Y.` · Valores `**Atributo** de **Objeto** puede estar `v1`, `v2` o `v3`.` ·
Tipo `**Objeto** es de tipo tipo-id.` · Cardinalidad `un/una **X** opcional`, `al menos un/una **X**`, `b **X**` ·
Probabilidad: `Pr=p` numérico universal.

Reglas R1–R21 de transformación EN→ES: `reference/opm-model-app/reglas/73-…md` R-3317 (útil para un
parser bilingüe; el idioma se detecta por el verbo principal R1).

### 4.5 Ejemplos canónicos (fixtures de oro)

- SD de *Preparar Empanadas*, 12 oraciones (MPO:557-570): usar como golden test de SD mínimo
  (incluye `**Receta** es ambiental.` — solo propiedad no default — y
  `**Receta** se relaciona con **Sistema de Preparación de Empanadas**.`).
- Lavado de platos: `Estado `vacío` de **Lavavajillas** es inicial y final.`; TS3 sobre atributo:
  `*Lavar y Secar Platos* cambia **Limpieza** de **Conjunto de Platos** de `sucia` a `limpia`.`
- Escisión: `*Leer* cambia **Informe** de `borrador`.` + `*Firmar* cambia **Informe** a `aprobado`.`
- Vehículos (discriminante), caja fuerte (AND vs XOR de agentes), custodios 2 de 3 (m-de-f).

---

## 5. Método (canon Forja y base) — lo que conviene conservar como guía, no como gate duro

- Clasificación previa del sistema: artificial / natural (sin propósito ni agentes humanos; se
  modela "resultado"; etapa 10 = `NO APLICA`) / social / socio-técnico (MPO:1277-1288).
- Asistente SD etapas 0–11, cada etapa cierra con un **hecho decidido** (MPO:1290-1331; RL/80
  R-4002/4003/4018). Compuerta SD (MPO:1333-1337): propósito y función CRÍTICA; ≥1 habilitador,
  OPL legible, nombres, exhibición del proceso por el sistema, ningún instrumento como agente ALTA;
  entorno y ocurrencia del problema MEDIA.
- Sistema exhibe el proceso principal: `**Sistema de Preparación de Empanadas** exhibe *Preparar Empanadas*.`
- Elaboración de SD1 en 7 pasos; verificación SD1 (cada subproceso ≥1 transformado CRÍTICA;
  consumo/resultado no en contorno CRÍTICA; escisiones, estados expresados, tipo correcto ALTA)
  (MPO:1341-1356).
- Heurísticas §22 (MPO:1379-1405) y anti-patrones §23 (MPO:1407-1426) — catálogo AP-* a conservar.
- Severidad CRÍTICA/ALTA/MEDIA/BAJA ≈ DEBE/DEBERÍA/advertencia/estética (RL/80 R-4017).

---

## 6. Superficie OPL real de opforja vs canon local (divergencias con ubicación)

La reescritura debe elegir **una** superficie canónica y hacer que el parser la acepte en ambos
sentidos. Hoy el código es el contrato de facto; varias divergencias están **declaradas** como
extensión en spec-forja-opl (según auditoría), otras no.

### 6.1 Coinciden (conservar)

T1–T3, TS1–TS5, H1/H2, HS1/HS2 (vía `nombreOplExtremo`, `refsHints.ts:182-188`), ET1/ET2,
EH1/EH2 (`procedural.ts:280-311`), CT1/CT2, CH1/CH2, CS2/CS4-CS6 (`procedural.ts:313-365`),
EX1/EX2 (`:233-236`), IV1/IV2 (`:213-214, 231-232`), RF1/RF2/RF3/RF3b/RF4/RF4b
(`estructural.ts:67-79`), SE1/SE2/SE4/SE5 (`procedural.ts:261-272`), ruta `Por ruta X, …`
(`procedural.ts:31-36, 165`), D5 con `puede estar` (`duracionMetadata.ts:65-70`), D7/D8
(`duracionMetadata.ts:33-35`), tipografía negrita/cursiva/monoespaciado.

### 6.2 Divergencias

| # | Constructo | Canon local | Código | Ubicación | Estado/propuesta |
|---|---|---|---|---|---|
| D1 | Clasificación de cosa | D1–D4 atómicas (`**Receta** es ambiental.`), solo lo no-default | `**X** es un objeto físico y ambiental.` (compuesta, estilo OPCloud); con visibilidad "siempre" emite también defaults | `estructural.ts:35-49` | Declarada extensión R-ENT-3 (auditoría #7/#42). Decidir: emitir solo no-defaults por defecto; aceptar ambas en parser |
| D2 | D9 / D13 | `es por defecto.` / `es declarado `Current`.` | `es Default.` / `es Current.` | `duracionMetadata.ts:59-63` | **Error de superficie**: corregir a canon |
| D3 | D5 con designaciones | `puede estar `a` o `b`.` + oraciones D7-D10 separadas | añade `(inicial)` entre paréntesis dentro de la lista **y** emite D7/D8 aparte | `duracionMetadata.ts:37-40, 65-70` | Redundancia no canónica; cortar paréntesis |
| D4 | Duración | de **proceso**, dentro de la elipse | oración inglesa-transliterada de **estado**: "`min`, `nom`, y `max` u Duracion Minima, Esperada y Maxima de `s`, respectivamente." (sin tildes) | `duracionMetadata.ts:42-45`; `tipos/estado.ts:29` | Herencia OPCloud (JOYAS §9); **cortar** y modelar duración de proceso |
| D5 | Unidad | `[u]` en rótulo (V-161) / tipo `es de tipo` | `**X** tiene unidad `u`.` | `duracionMetadata.ts:20-22` | extensión no canónica; decidir |
| D6 | SE3 bidireccional | dos oraciones | una oración `**O** f **D**, y **D** b **O**.` | `procedural.ts:269` | alinear o declarar |
| D7 | CS1 consumo condicionado con estado | `…, en cuyo caso **Objeto** se consume, …` | `…, en cuyo caso *P* consume **O** en `s`, …` | `procedural.ts:334` | alinear |
| D8 | Exhibición opcional | `**X** exhibe un **Y** opcional` (cardinalidad) | `**X** tiene un **Y** opcional.` (RF2o) | `estructural.ts:71-73` | declarada extensión de producto (auditoría #41) |
| D9 | CX2 paralelo | `*P* se descompone en paralelo *P1* y *P2*.` | además existe `*A* y *B* ocurren en paralelo.` (solo usada por tests: código muerto) | `refinamiento.ts:105-107` | cortar |
| D10 | Descomposición de **objeto** | sin orden temporal (V-77/V-78) | `**O** se descompone en A, B en esa secuencia, así como *P*.` | `refinamiento.ts:86-94` | **error semántico**: quitar "en esa secuencia" en objetos |
| D11 | Lista de 2 en CX1 | `*P1* y *P2*` | `*P1*, *P2*` (coma sin "y") | `refinamiento.ts:305-308` | alinear con `listarOpl` |
| D12 | CX3 despliegue | `se despliega en SD1 en **T1**…` | `**X** se despliega en **T1**…` (sin etiqueta de OPD) | `refinamiento.ts:76, 324` | la del código es mejor (la etiqueta no es identidad); declararla canon Forja |
| D13 | Conjunciones | "e" ante i-/hi-, "u" ante o-/ho- | siempre "y"/"o" | `refsHints.ts:259-269` | implementar alternancia |
| D14 | Instrumento posesivo | H2 | `**Objeto** se maneja con **Instrumento**.` si el proceso empieza por "manejar"/"conducir" y hay un efecto | `procedural.ts:461-490` | hack de circunstancia (paridad OPCloud *Driver Rescuing*): **cortar** |
| D15 | Etiqueta en enlace procedimental | no existe plantilla | sufijo `[etiqueta: X]` | `procedural.ts:274-278` | decidir (¿ruta?) |
| D16 | Negación | no existe en OPM | `*P* no consume **O**.` etc. | `procedural.ts:367-400` | extensión Forja declarada (¬); conservar marcada |
| D17 | Demora | solo en rayo explícito | `invoca *X* después de N` | `procedural.ts:214, 232` | coincide con R-OPD-INV-5 |
| D18 | Probabilidad | `Pr=p` en ramas de abanico XOR | además `Pr=p` en enlaces **evento** sueltos (`definirProbabilidad` exige modificador evento) | `modificadores.ts:62-87`; `procedural.ts:492-494` | dos semánticas para un campo; ver §8 |
| D19 | Proceso en inglés | infinitivo o nominalización es-CL | aceptada terminación `-ing` | `nombresCanonicos.ts:80` | residuo bilingüe; decidir |
| D20 | Capitalización de nombres | palabras léxicas capitalizadas ("Torta de Manzana") | no se valida; ejemplos usan sentence case ("Ventana solicitada", "Validación de disponibilidad") | `docs/ejemplos/*.opl`; `nombresCanonicos.ts:27-30` | **decidir convención** (escala de nombrado §A2.3 de metodología Forja no disponible localmente) |

### 6.3 Observaciones sobre `docs/ejemplos/*.opl`

- Usan D1 compuesta (`es un objeto informacional y sistémico.`) para **todas** las cosas, incluidos
  defaults → OPL ruidoso (13 de 32 líneas en `lumbre-reservas.opl:1-13`).
- Condición sobre instrumento con estado (CS6) bien formada (`lumbre-reservas.opl:24,26,29-30`).
- `**Persona aprobadora**` agente físico ambiental — correcto; `**Equipo de préstamo**` agente como
  grupo humano con nombre no conforme a R-NOM-OBJ-2 (debería ser **Grupo de Préstamo**).
- `**Ventana solicitada** exhibe **Sala** y **Intervalo**.` (`lumbre-reservas.opl:19`) — Sala es un
  objeto físico ambiental tratado como atributo de una entidad informacional: dudoso
  metodológicamente (herencia de afiliación O8 haría ambiental a los rasgos de un ambiental, no al
  revés).
- No hay SD con proceso principal ni exhibición del sistema: son fragmentos (Apunte), no modelos.

---

## 7. Conflictos, ambigüedades y brechas detectadas (para arbitrar antes de reescribir)

### 7.1 Conflictos entre fuentes

| # | Tema | Fuente A | Fuente B | Resolución vigente / propuesta |
|---|---|---|---|---|
| K1 | Nº de familias | 5 familias (RL/13 R-500, V-239) | 6ª familia "excepción" extensión Forja (MPO:596-606); canon v1.4.0 | **6 familias** en Forja, declarando la sexta como extensión |
| K2 | `c`+`e` en un enlace | "puede portar ambas (evento condicional)" (RL/16 R-805) | zona no canonizada AP-28 (MPO:792-793) | AP-28: no combinar; modelo con un solo modificador ✔ |
| K3 | Abanico convergente de habilitadores | "no aplica" (RL/16 R-816) | admitido (MPO:979-980, 1785; auditoría #32) | **admitido** |
| K4 | Probabilidad sin anotar | default uniforme 1/n (RL/16 R-819) | R-FAN-PROB-1 exige `Pr=p` o declarar "sin pesos" (MPO:992-1002) | R-FAN-PROB-1; caso C programado |
| K5 | Designaciones simultáneas | hasta 4 en un estado (RL/11 R-303) | código: default ⊕ current excluyentes (`estadosDesignaciones.ts:17,24`) | decidir; no hay base local para la exclusión |
| K6 | Dirección de enlaces estructurales | origen = refinador, destino = refinable (RL/14 R-601) | opforja: origen = refinable (`estructural.ts:68-78`) | contrato opforja: **refinable → refinador**; documentarlo |
| K7 | R-NOM-PROC-1 | solo -ar/-er/-ir/-ción/-miento (RL/70 R-3000) | deverbales irregulares aceptados (auditoría "residuo") | ampliar (Despacho, Ingreso, Cierre, Traslado) |
| K8 | Manejador de excepción ambiental | V-4.4 base + R-EXC-1A (rechazo duro en `helpers.ts:140-145`) | MPO no lo menciona; ejemplos de dominio con manejadores internos | conservar (es canon) pero **verificar con KORA** si es DEBE o convención visual |
| K9 | V-115 por OPD o por atlas | por OPD (verifier histórico: 42 falsos positivos) | por atlas (candidate-extensions #12) | **por atlas**; el código omite procesos descompuestos (`validaciones.ts:389`) ✔ |
| K10 | Precedencia de capas | opm-es > opl-es > opd-es > método (RL/00 R-001) | reglas > spec-opd > spec-opl > método (puentes, `doctrina.ts:14-19`) | la vigente es la segunda |
| K11 | Límite 20–25 cosas | regla V-50 (MPO:490) | "heurística Forja" (hoja opm-puro, tarjeta Complejidad) | tratarlo como advertencia MEDIA |
| K12 | Gramática OPL histórica | `Agua es un objeto, físico.`, `Hervir requiere 5min.` (duración con el verbo del instrumento), `Agua en caliente` (`opmodel/opl-first/opl-grammar.md`) | canon | **no portar** esa gramática |

### 7.2 Brechas semánticas del código frente al canon

| # | Brecha | Evidencia | Impacto |
|---|---|---|---|
| G1 | No existe **duración de proceso** (mín/esperada/máx/distribución); solo `Estado.duracion` (herencia "state time" de OPCloud) y umbrales en el enlace de excepción | `tipos/estado.ts:13-20, 29`; `objetoDuracion.ts:5-17`; `grep` sin resultados en `Entidad` | EX1/EX2 y simulación estocástica no tienen su soporte canónico (X1, X6) |
| G2 | `subproceso-no-conecta-al-padre` marca **error** cualquier enlace padre↔subproceso interno, incluida la invocación de **retorno al padre** (bucle canónico) | `validaciones.ts:309-360`; MPO:843-845; RL/84 R-4409 | prohíbe un patrón canónico |
| G3 | Internalidad decidida por **geometría** (`dentroDe(apariencia, contorno)`) en validaciones | `validaciones.ts:150-161, 316-320`; `dentroDe` en `:532` | contradice R10 (alcance semántico, no posicional), aunque el modelo sí tiene `contextoRefinamiento.rol` |
| G4 | Objeto descompuesto con "en esa secuencia" | `refinamiento.ts:86-94` | contradice V-77/V-78 |
| G5 | `Estado.suprimido` global además de la supresión por aparición | `tipos/estado.ts:30`; `tipos/apariencia.ts:48-66`; `duracionMetadata.ts:23,69` | la supresión global oculta el estado del OPL de **todos** los OPDs: rompe R-OPL-TOTAL-5 (unión) |
| G6 | Tipos computacionales incompletos (`char` no canónico; faltan boolean, enumerated, double…) | `tipos/entidad.ts:23` vs MPO:320-322 | menor |
| G7 | Unidades de tiempo con vocabulario propio (`dia`, `sem`, `mes`, `año`) | `tipos/estado.ts:13` vs X5 | serialización no alineada con EX1/EX2 |
| G8 | m-de-f, objetos específicos de estado, out-zoom, caso C probabilístico: no implementados | registro de conformidad; §3.9/§3.11 | declarar como brechas (R-CONF-7) |
| G9 | Agente = objeto **físico** como único control automático | `helpers.ts:99-103` | necesario pero no suficiente; mantener + advertencia metodológica |

### 7.3 Ambigüedades abiertas del corpus (candidate-extensions + auditoría)

- Compound names `X de Y` dependen del orden de declaración en el parser (candidate #2): la
  gramática debe reconocerlos independientemente del orden.
- `input`/`output` como alias legacy de consumo/resultado (candidate #3): no son tipos canónicos.
- Cláusula "así como" de in-zoom: solo enumerar **internos del refinamiento**, no participantes
  externos (candidate #7).
- System boundary no es entidad visual: la frontera vive en la afiliación de cada cosa
  (candidate #10). Nunca dibujar cajas de sistema normativas.
- V-83 requiere semántica por aparición (candidate #13).
- Ruta sobre habilitadores: contradicción interna del canon (§3.10 M5).
- Multiplicidad sobre efecto sin slot en EBNF A.5 (residuo único declarado en
  `canon-opm/spec-forja-opl.md:65-68`).

---

## 8. Reglas propias de Forja (distinguidas del estándar)

| # | Regla Forja | Qué es | Fuente | Código | Valor |
|---|---|---|---|---|---|
| FJ1 | **Especies de documento**: Apunte / Modelo / Biblioteca (rol de Modelo) | Apunte relaja el **cierre** (gates de validez bajan a observación), nunca la integridad ni la semántica | manual-opforja:167-184; uso-productivo:64-89 | `documentPolicy.ts:4,50-55` (`esApunte`, `esBiblioteca`) | **core** del producto |
| FJ2 | **Graduar** (Apunte→Modelo) / **Reabrir en Taller** (Modelo→Apunte) conservan ID y hechos; graduar exige integridad, puede llevar deuda formal y Bocetos pendientes; no integra Bocetos ni acredita validación humana | ciclo del documento (R-CAN-BOCETO-1..4) | canon-opm/reglas-opm-estrictas.md:78-84; metodologia-forja.md:181-185 | `graduarApunte` (workspace), `taller-*.test.ts` | core |
| FJ3 | **Boceto** = OPD sin padre que no es la raíz (bottom-up, A1.5, R-OPD-REF-20); **Integrar** (como descomposición o despliegue: fija padre + refinamiento con el mismo constructor top-down, `adoptarOpd`, `origen:"adopcion"`) / **Devolver a Bocetos** (inversa sin pérdida) / **Eliminar refinamiento** (destructiva, distinta) | ciclo del componente | manual-opforja:133-144, 264-269; uso-productivo:91-116; spec-forja-opd.md:121-127 | `opdSueltos.ts:9-18`; `ContextoRefinamientoApariencia.origen` (`tipos/apariencia.ts:24`) | core |
| FJ4 | En un **Modelo**, un Boceto **bloquea el export canónico**; en un Apunte es observación y la salida declara el bosquejo | gate de export | uso-productivo:108-113; hoja no-bloqueado | `perfilesExport.ts` | important |
| FJ5 | **Integridad nunca cede** (referencias colgantes, formato, geometría); **validez de método** cede en Apunte | dos naturalezas de gate | hoja no-bloqueado; uso-productivo:78-83 | `diagnosticoSeveridad.ts` (ORDEN_INZOOM_REFERENCIA_INVALIDA "nunca degrada") | core |
| FJ6 | **Validación tripartita A8**: bloqueos estructurales / mejoras metodológicas (avanzar con deuda declarada) / estilo; validación humana es marca aparte; barridos de integridad sobre JSON canónico, no sobre OPL | severidad | manual-opforja:161-165 | `SeveridadIssue = "bloqueo"\|"mejora"\|"estilo"` (`diagnosticoSeveridad.ts:5`) | core |
| FJ7 | Excepción de apunte a **R-ENT-2**: en Apunte los placeholders emiten OPL | superficie | `generar.ts:77-78`; `perfilesExport.ts:172` | idem | marginal |
| FJ8 | **Orden declarado de in-zoom** `ordenInzoom: Id[][]` (bandas con cardinalidad; la Y lo realiza) | refuerzo de R-IDP-0A/R-INV-2 | spec invocación §3 | `tipos/opd.ts:29-36`; `refinamiento.ts:246-298` | core (portar) |
| FJ9 | **Firma de frontera** como condición necesaria de sustitución/descomposición (R-CAT-EQ-2/3) | equivalencia observacional | registro de conformidad | `modelo/equivalencia/`, `DESCOMPOSICION_NO_PRESERVA_FRONTERA` | important |
| FJ10 | **Recurso lineal** (se consume, no se copia) (R-CAT-LIN-2) | extensión categorial | registro | `Entidad.lineal` (`tipos/entidad.ts:145`), `RECURSO_LINEAL_MULTIPLES_CONSUMIDORES` | marginal |
| FJ11 | Negación `¬` (modificador `no`) | extensión fuera de ISO | hoja control-flujo | `tipos/enlace.ts:33` | marginal (declarar) |
| FJ12 | `excepcionSubSobretiempo` | extensión | — | `tipos/enlace.ts:29` | marginal |
| FJ13 | Superficies OPL extendidas: D1 compuesta (R-ENT-3), `tiene un … opcional` (RF2o) | superficie | auditoría #7/#41 | §6.2 D1/D8 | decidir |
| FJ14 | **Piezas** (Calco = identidad fresca; Anclaje = referencia viva vigilada por Centinela de Drift, R-OPD-ROT-9; Re-sincronizar; Soltar) | reuso gobernado | manual-opforja:526-540 | `Entidad.anclaje`, `leyes/anclaje-*.test.ts` (8 archivos) | marginal/acreción (ver §9) |
| FJ15 | Estereotipo `<<Nombre>>` como marca meta opcional, no cuenta como cosa (R-VIS-STEREO-1/R-OPD-ROT-6); `<<Requirement>>` canónico | extensión declarada | manual-opforja:536-540; RL/52 | `Entidad.estereotipoId` | important (requisitos) |
| FJ16 | Ontología organizacional: vocabulario controlado canónico = sinónimos; modos sin control / sugerir / reforzar (hacia adelante, sin trazabilidad por entidad) | capa léxica de producto, **no** taxonomía OPM | hoja ontología | `modelo/ontologia.ts` | marginal (Sugerir no tiene consumidor visible) |
| FJ17 | `preguntaGuia` por OPD (pregunta metodológica del refinamiento), no OPL nuclear | tutor | `tipos/opd.ts:18-21` | idem | marginal |
| FJ18 | R-CONF-7: toda brecha de un DEBE se declara (deuda exigible o programación); brecha silenciosa prohibida | gobernanza | registro de conformidad | `leyes/manual-limites.test.ts` | keep la idea, cut la maquinaria |
| FJ19 | Anclas normativas, declaraciones no nucleares, notas de mesa, mesa de exploración, ficha de trabajo, revisiones humanas | contenido meta del autor (V-204), no emiten OPL | `anclasNormativas.ts:1-4`; `documentPolicy.ts:94-127` | varios mapas en `Modelo` | acreción probable (≥6 colecciones meta) |
| FJ20 | SD-primero **y** bottom-up como arranques de primera clase; A0 (≥3 conceptos alternativos); "cinco o más subprocesos al abrir el central = revisar altitud" | método | manual-opforja:126-150 | tutor/UI | important |

---

## 9. Olores de sobreingeniería, burocracia y lastre en el área

1. **Puentes vacíos + resolutor a un corpus ausente.** 4 documentos de 70–100 líneas que solo
   dicen "no soy la SSOT" + notas de reconciliación fechadas; `resolutor-urn.json` con
   `kora_raiz_default: /home/felix/kora-knowledge` (`:203`) y comentarios contradictorios
   (PROCEDENCIA dice `~/kora-pneuma/...`, manual-opforja:650 dice `/home/felix/kora-pneuma`).
   Resultado: ningún agente ni humano puede verificar una regla sin una máquina concreta.
2. **Sello de doctrina**: `app/src/canon/doctrina.ts` lee y hashea las 4 SSOT en "orden canónico
   load-bearing" para firmar bundles (`autoria/procedencia.ts:64`). Gobernanza autorreferente sin
   valor para el usuario del modelador.
3. **Tests sobre la prosa**: `app/src/leyes/corpus-documental.test.ts` (315 líneas) exige favicon
   SVG en data-URI, tablas con `aria-label`, ausencia de `Ctrl+N`/`Ctrl+O`, ausencia de voseo
   ("Relajá", "Probá"); `manual-limites.test.ts`, `manual-sistemas-opm.test.ts`,
   `manual-software-opm.test.ts` parsean tablas Markdown de manuales. Burocracia documental dentro
   de la suite de producto.
4. **Material histórico de ~16 500 líneas** en `docs/reference/` con IDs locales `R-nnn` que
   colisionan con los `R-*` del canon, "Aplicación en código" que apunta a `src/render/jointjs/*`
   de otro repo, estados "deuda actual" ya cerrados, y una matriz de 1 164 HU.
5. **Formalismo aspiracional**: ARQUITECTURA-CATEGORICA (1 371 líneas, mónadas/lentes/operads
   [ASPIRACIONAL]), SELLOs "cat-thinking" en comentarios de tipos (`tipos/apariencia.ts:57-61`),
   "presheaf", "fibra", "anticadena" en comentarios de código; el propio registro reconoce que
   "igualdad de firma no demuestra identidad, bisimulación ni adjunción".
6. **Duplicación de fuentes de verdad en tipos**: `Estado.esInicial/esFinal` + `designaciones[]`
   (`tipos/estado.ts:26-28`, reconciliados en `estadosDesignaciones.ts:58-65`);
   `Enlace.modificador` + `subtipoModificador` (mapeo 1:1, `modificadores.ts:241-251`);
   `Abanico.puertoComun` + `puertoEntidadId` legacy (`tipos/abanico.ts:23-28`);
   probabilidad en `Enlace.probabilidad` **y** en `Abanico.decision.pesos` (`abanicos.ts:143-158`);
   `Estado.suprimido` global + `Apariencia.estadosSuprimidos`; `Entidad.refinamientos` + legacy
   `RefinamientoEntidad`.
7. **Dos (o tres) sistemas de validación paralelos**: `validaciones.ts` (reglaId kebab-case,
   severidad error/advertencia/info) y `checkers.ts` (códigos SNAKE, severidad
   advertencia/sugerencia) + `diagnosticoSeveridad.ts` (bloqueo/mejora/estilo) +
   `diagnosticoVisual.ts`; el mismo hecho se reporta dos veces y se "colapsa" después
   (`validaciones.ts:377-379`, `:465-469`).
8. **Paridad OPCloud como circunstancia**: `oracionInstrumentoPosesiva` (`procedural.ts:461-490`),
   oración de duración transliterada (`duracionMetadata.ts:42-45`), `paridadOpcloud.ts`,
   `capacidadesOpcloud.test.ts`, campos `requisitos`/`mostrarRequisitos` "OPCloud requirements" en
   `Enlace`; `DistribucionSimulacion` con 7 distribuciones en atributos.
9. **Código muerto mantenido por tests**: `oracionParalelo` (`refinamiento.ts:105-107`) solo
   usado en `refinamiento.test.ts:61-62`.
10. **16 hojas rápidas** con reglas de mantenimiento propias (README de cheatsheets) y ley
    editorial; varias se solapan (control de flujo ⊂ opm-puro; ontología/no-bloqueado ⊂ manual).
11. **Proliferación de vocabulario de gobierno**: "cordón", "órganos", "mesa", "bestia", "pneuma",
    "custodio-kora", "panel deliberativo", "SELLO", "corte C2/C3/D4", "Steipete"… que no
    corresponden a conceptos OPM ni de producto.

---

## 10. Contratos que la reescritura debe respetar o migrar (vista de autoridad)

Citados textualmente cuando son contrato (definidos en `app/src/modelo/tipos/`):

```ts
// tipos/enlace.ts:14-34
export type TipoEnlace =
  | "agregacion" | "exhibicion" | "generalizacion" | "clasificacion"
  | "etiquetado" | "etiquetadoBidireccional"
  | "agente" | "instrumento" | "consumo" | "resultado" | "efecto"
  | "invocacion" | "excepcionSobretiempo" | "excepcionSubtiempo" | "excepcionSubSobretiempo";
export type Modificador = "condicion" | "evento" | "no";
export interface ExtremoEnlace { kind: "entidad" | "estado"; id: Id; portId?: Id; }
```

```ts
// tipos/entidad.ts:16-19, 108-113
export type TipoEntidad = "objeto" | "proceso";
export type Esencia = "informacional" | "fisica";
export type Afiliacion = "sistemica" | "ambiental";
export type TipoRefinamiento = "descomposicion" | "despliegue";
export interface Entidad { id: Id; tipo: TipoEntidad; nombre: string; esencia: Esencia;
  afiliacion: Afiliacion; refinamientos?: Partial<Record<TipoRefinamiento, SlotRefinamiento>>; /* … */ }
```

```ts
// tipos/estado.ts:12, 22-30 ; tipos/abanico.ts:12, 20-32 ; tipos/opd.ts:14-37
export type DesignacionEstado = "inicial" | "final" | "default" | "current";
export interface Estado { id: Id; entidadId: Id; nombre: string; esInicial?: boolean;
  esFinal?: boolean; designaciones?: DesignacionEstado[]; duracion?: DuracionTemporal; suprimido?: boolean; /* … */ }
export type OperadorAbanico = "O" | "XOR";   // AND = ausencia de abanico
export interface Opd { id: Id; nombre: string; padreId: Id | null; ordenInzoom?: Id[][]; /* … */ }
```

Invariantes de contrato derivados del canon que el formato debe poder expresar:

- Los 15 tipos de enlace y la **tabla de firmas** de §3.3 (portar `validarFirmaEnlace`).
- Extremo-estado vs extremo-entidad (TS1–TS5, HS, SSE) y la transición compacta TS3
  `estadoEntradaId/estadoSalidaId` + mitades escindidas `efectoEscindido{grupoId, enlacePadreId, rol}`.
- Un único modificador por enlace; probabilidad **solo** en ramas de abanico XOR (proponer migrar
  la probabilidad-de-evento a un campo propio o eliminarla).
- AND implícito (no se persiste abanico AND).
- `ordenInzoom` como fuente de verdad del orden; Y como fallback retrocompatible.
- Identidad persistente de OPD independiente de `SDx.y`; existencia única de entidades con
  apariencias por OPD; supresión de estados **por aparición**.
- Especie del documento (`esApunte`/`esBiblioteca`) y Bocetos (`padreId === null` ≠ raíz) como
  datos, no como regla de UI.
- **Añadir** (migración): duración de proceso `{unidad, min, esperada, max, distribucion?}`;
  normalizar unidades a `ms|sec|min|hour|day|week|month|year`.
- Para el resolutor URN: si se conserva, reducirlo a un campo `canonVersion` en el bundle; no leer
  el disco en runtime.

Leyes de verificación que valen como contrato (opmodel ADR-003, `10-isomorphism-architecture.md:125-156`):
(1) roundtrip textual `render(compile(parse(opl))) ≡ opl` normalizado; (2) todo hecho aparece en al
menos un OPD (colímite del atlas; I-24); (3) `compile(render(S)) ≅ S`; (4) **ortogonalidad
layout/semántica**: mover cajas no altera el modelo — con la excepción declarada de que en
opforja la Y fue portadora del orden temporal, ahora sustituida por `ordenInzoom`.

---

## 11. Recomendaciones para la reescritura (área de autoridad)

1. **Un solo catálogo local, ejecutable y versionado** (`docs/opm/reglas.md` + tabla de datos
   `reglas.json` o TS): por regla, `{id canónico (R-*/AP-*), enunciado 1 línea, familia, severidad
   (bloqueo/mejora/estilo), relajable en Apunte (sí/no), dónde se aplica (edición / diagnóstico /
   simulación / OPL), plantilla OPL asociada, fuente}`. Generar desde ahí los mensajes del
   diagnóstico y las hojas rápidas. Semilla: §3 y §4 de este dossier.
2. **Conservar `manual-opm-puro.md`** como manual didáctico (recortar Parte 0/VII y el marco de 52
   tensiones a un apéndice opcional); **derivar** la hoja `opm-puro.html` del catálogo.
3. **Cortar** puentes `canon-opm/*`, `resolutor-urn.json`, `canon/doctrina.ts`, sello de doctrina,
   leyes editoriales sobre prosa; **archivar** `docs/reference/` fuera del árbol vivo (o a un tag
   git), rescatando D1–D6, las 4 leyes, el contrato de slice efectivo y candidate-extensions.
4. **Fijar la superficie OPL canónica de opforja** resolviendo §6.2 (mínimo: D2, D3, D4, D10, D11,
   D13, D14 son errores; D1, D6, D8, D12, D15, D16 son decisiones a declarar).
5. **Cerrar brechas semánticas G1–G5** antes de agregar funciones: duración de proceso; bucle de
   retorno al padre; internalidad semántica; objeto descompuesto sin secuencia; supresión solo por
   aparición.
6. **Unificar validación** en un único motor de reglas con un espacio de IDs y tres severidades
   (FJ6) y la distinción integridad/validez (FJ5).
7. **Separar extensiones Forja** (¬, sub-sobretiempo, lineal, D1 compuesta, RF2o, estereotipos,
   ontología organizacional) en una sección "extensiones declaradas" del catálogo, cada una con su
   justificación de uso o marca de retiro.

---

## 12. Partes de alta calidad para portar casi tal cual

- `docs/manual-opm-puro.md` §1–§24 y Apéndices A–C (definiciones, porqués, autoevaluación).
- `docs/cheatsheets/opm-puro.html` (17 tarjetas, fiel al manual).
- `app/src/modelo/operaciones/helpers.ts:58-148` (`validarFirmaEnlace`): tabla de firmas compacta,
  exhaustiva (`satisfies never`), con mensajes accionables.
- `app/src/modelo/operaciones/enlaces.ts:90-188` (`crearEnlace`: AP-04, R-OPD-EST-3, unicidad de
  rol, visibilidad en OPD) y `:1040-1110` (`validarUnicidadRolPar`, con su comentario sobre ramas de
  abanico pre-agrupación).
- `app/src/modelo/modificadores.ts:198-208` (régimen de modificadores AP-01/02/03/08/10).
- `app/src/modelo/abanicos.ts:354-397, 477-492` (reglas de formación de abanico y suma de
  probabilidades).
- `app/src/opl/generadores/procedural.ts` (salvo D6/D7/D14/D15) y `estructural.ts` como base del
  generador; `refinamiento.ts:246-298` (bandas desde `ordenInzoom`).
- Tablas de distribución (§3.11) y de fuerza semántica (RL/31, RL/32) como especificación de un
  futuro out-zoom.
- `docs/auditorias/2026-06-12-auditoria-ssot-corpus.md` §"Conflicto y redundancia" y §"Paquete":
  el mejor registro local de cómo se resolvieron las contradicciones del canon.
- `docs/reference/opm-model-app/design/ssot-decisiones-axiomaticas.md` D1–D6 (resumible a 1 página).
