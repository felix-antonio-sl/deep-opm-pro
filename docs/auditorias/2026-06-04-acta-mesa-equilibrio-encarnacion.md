# Deliberación: evaluación de la decisión EQUILIBRIO (LLM afuera, gestión adentro)

Fecha: 2026-06-04. Panel canónico: **Asto** (agente `salud/salubrista` + skill `hospitalizacion-domiciliaria`), **Besto** (mente-omega + cat-thinking), **Resto** (dov-dori + modelamiento-opm). Moderador/encarnador: Claude. Modo: **encarnación** (un contexto, tres voces, propuestas secuenciales sin retro-contaminación; identidades leídas de sus fuentes antes de proponer). Resultado: **CONSENSO** (ciclo 2/3). Evalúa la decisión EQUILIBRIO del backlog contingencial; complementa (no reabre) el acta `2026-06-04-acta-mesa-flujo-canonico-dominio-opforja.md`.

## 1. Síntesis final — EQUILIBRIO VALIDADA con 5 correcciones

La decisión "el LLM genera afuera; la app ve y gestiona los artefactos adentro" (paquete de dominio + paneles + ciclo de re-elicitación) es **correcta en su factorización** y queda condicionada a:

- **C1 — Registro [RATIFICAR] tipificado (la app registra, no decide):** `{clave estable nacida en el proto; nivel de autoridad requerido: operador-modelado | mesa | DT/SEREMI/legal; estado: pendiente → anotado-en-mesa → ratificado-con-fuente; fuente/acta; responsable; fecha/edad}`. La marca in-app es el estado intermedio "anotado-en-mesa" (persistido y exportable); "ratificado" exige fuente; el modelo y el proto solo cambian vía re-elicitación por la skill.
- **C2 — Tres leyes del ciclo:** (i) **L9 convergencia**: un pendiente ratificado y re-elicitado NO reaparece pendiente (falsable con fixture); (ii) **paquete sellado en emisión**: todas las componentes emitidas juntas por el compilador, hash único (extiende L6); (iii) **log con schema versionado y consumidor comprometido**: `modelamiento-opm` gana el estado `re-elicitar` que lo consume (cambio en KORA — derivar a custodio-kora/kora-skills); sin consumidor, no se construye el export.
- **C3 — Seguridad como gate de release:** W6.1 se construye, pero **no se despliegan paquetes de dominio a la instancia pública sin re-protección** (Basic Auth u otra; procedimiento en HANDOFF §Riesgos) o se usan local-only. El material de gobernanza pre-decisional de HODOM (decisiones frontera-dura DT/SEREMI/legal, glosario institucional) no es publicable. Decisión HITL de despliegue reservada a Felix. (El modelo OPM no porta datos de pacientes — es conceptual; la sensibilidad es de gobernanza institucional.)
- **C4 — Mínimo que sirve:** orden interno de W6: paquete → registro+export → paneles ricos. Glosario en la mesa con enforcement **máximo "sugerir"**, integrando el mecanismo de colisión de nombres ya existente (no un segundo diálogo).
- **C5 — Formato de transporte declarado:** el envoltorio es `deep-opm-pro.paquete.v0` — versionado, validado al abrir, emitido únicamente por el compilador. **No rivaliza con el pivote único**: el `modelo.v0` interior viaja intacto (el paquete transporta, no modela).

## 2. Razonamiento consolidado

- Las tres propuestas convergieron en validar la factorización (continuidad del artefacto [Asto]; adjunción generación/gestión [Besto]; contenido meta R-DOC-7 sin tercer canal de verdad [Resto]) y divergieron en el estatus de la "ratificación" in-app.
- La crítica cruzada produjo el diseño de C1: Asto exigió autoridad institucional y fuente; Resto la devolvió al canal de modelado (ratificar = acto de modelado, supuesto→hecho) pero aceptó la tipificación de niveles de autoridad (no todo [RATIFICAR] es frontera-dura); Besto exigió que la marca tuviera estado persistente (pura lectura = ANTI-ESTERILIDAD) y reclasificó la seguridad de Asto como gate de release, no de diseño.
- Refutación ciclo 1: **Resto demolió la síntesis v1** con una crítica — el envoltorio era un segundo formato de intercambio sin gobernanza, semilla del tercer esquema que el acta madre prohibió. Corrección C5 (formato de transporte declarado, emitido solo por el compilador). Dos menores absorbidas (persistencia del estado anotado [Besto]; edad/dueño en el registro [Asto]).
- Refutación ciclo 2: sin objeciones. Triple aceptación de los tres.

## 3. Aportes por experto

### Asto (salubrista + hospitalizacion-domiciliaria)
- La distinción **registro ≠ acto administrativo**: en HODOM hay decisiones que exceden al operador (frontera-dura DT/SEREMI/legal); el click no ratifica — registra con fuente.
- El **gate de seguridad**: instancia pública sin auth + material de gobernanza pre-decisional = exposición inaceptable; re-proteger o local-only antes del primer paquete.
- Operativa del registro: **edad y dueño** de cada pendiente (los pendientes sin dueño envejecen invisibles).

### Besto (mente-omega + cat-thinking)
- **Identidad estable de pendientes/anclas nacida en el proto** (los ids del bundle son posicionales — RB-1 del acta madre); sin clave estable el ciclo no compone (`icas-identidad-relacion`).
- **L9 convergencia del ciclo** (`icas-protocolos`) y **paquete sellado en emisión** (`icas-universales`).
- **ANTI-ESTERILIDAD**: export-log sin consumidor comprometido = ceremonia write-only; schema versionado + estado `re-elicitar` en la skill.
- Reclasificación de la seguridad como **gate de release** (no bloquea construir).

### Resto (dov-dori + modelamiento-opm)
- **Ratificar es acto de modelado** (supuesto→hecho): pertenece al canal E0-E2 (skill); la app anota intención — coherente con D7 (proto portador canónico hasta F5).
- Paneles del paquete = **contenido meta (R-DOC-7), read-only** — jamás segunda superficie de edición (bimodalidad sin tercer canal).
- Glosario en mesa: enforcement **máx "sugerir"** (forzar invade la autoría del operador único).
- **La crítica que volteó la síntesis v1**: el envoltorio como segundo formato sin gobernanza → C5.

## 4. Supuestos aceptados

| Supuesto | Levantado por | Por qué se acepta |
|---|---|---|
| Re-proteger la instancia es viable cuando se necesite | Asto | Procedimiento documentado en HANDOFF §Riesgos; decisión HITL de Felix |
| Las claves estables de pendientes/anclas se diseñan en F0/W1.5 | Besto | Ya era parte del diseño de AnclaNormativa; se extiende a pendientes |
| `modelamiento-opm` es actualizable para ganar `re-elicitar` | Besto | Vive en KORA; cambio fuera de este repo, derivado a custodio |
| El paquete porta los [RATIFICAR] desde el proto con procedencia | Resto | Mecánica de D7/L6 ya consensuada |

## 5. Riesgos pendientes

| Riesgo | Levantado por | Severidad | Mitigación |
|---|---|---|---|
| Exposición de gobernanza pre-decisional en instancia pública | Asto | **Alta** | C3: gate de release; HITL de despliegue |
| Teatro de gobernanza (marcas sin acto real) | Asto | Media | C1: "ratificado" exige fuente; tipificación de autoridad |
| Pendientes fantasma (anotados que nunca se re-elicitan) | Asto/Besto | Media | Estado "anotado-en-mesa" visible con edad; L9 |
| Log write-only sin consumidor | Besto | Media | C2: no construir export sin el estado `re-elicitar` comprometido |
| Sobre-formalización del log / de W6 | Besto/Resto | Baja | C4: mínimo que sirve; paneles ricos esperan |

## 6. Incertidumbres

- La forma concreta de la clave estable de pendientes (¿hash de texto+sección? ¿id explícito en el proto?) — se decide en F0 junto a AnclaNormativa.
- Si el estado "anotado-en-mesa" persiste en workspace local o viaja en el export del paquete — diseño de W6.5.
- Cuándo decidirá Felix la re-protección de la instancia (condiciona el primer despliegue de paquetes, no su construcción).

## 7. Confianza por experto

| Experto | Confianza | Justificación | Qué la subiría |
|---|---|---|---|
| Asto | N4 (0.84) | Gobernanza tipificada, no teatral; exposición controlada por gate | Re-protección ejercida; primer registro con fuente real de Mesa |
| Besto | N4 (0.85) | Las tres leyes cierran el ciclo; falta operarlas | Schema del log consumido por la skill en un ciclo real completo |
| Resto | N4 (0.86) | Pivote único preservado (C5); ratificación devuelta al canal de modelado | Clave estable en F0 + un [RATIFICAR] real round-tripeando proto→paquete→log→proto |

(Sin promediar; la cercanía con condiciones de subida idénticas es convergencia genuina.)

## 8. Metadatos de la deliberación

- modo de realización: **encarnación** (identidades leídas: `salubrista/AGENT.md`, `hospitalizacion-domiciliaria/SKILL.md`, `mente-omega/SKILL.md`, `cat-thinking/SKILL.md`, `dov-dori.md`, `modelamiento-opm/SKILL.md`)
- ciclos de refutación ejecutados: **2 / max 3**
- objeciones críticas resueltas: **1** (Resto: envoltorio como segundo formato sin gobernanza → C5)
- objeciones menores registradas: **2** (persistencia del estado anotado; edad/dueño del registro)
- resultado: **CONSENSO** — triple aceptación de los tres expertos
- decisiones derivadas: actualizar W6 del backlog contingencial (C1-C5); derivar a custodio-kora la extensión `re-elicitar` de `modelamiento-opm`; nueva ley **L9** se suma al catálogo del acta madre; decisión HITL de despliegue (re-protección) queda abierta para Felix
