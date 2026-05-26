# Divergencias OPL: OPFORJA vs OPCloud — arbitraje por precedencia

**Fecha:** 2026-05-26
**Rama:** `codex/remediacion-gap-opl`
**Modo:** auditoría de alineación OPL (READ-ONLY sobre `app/src/**`).

## Fuentes

- **Eco OPCloud (observacional):** `docs/historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md` — §3 tabla de plantillas (D1/D5/T1/T2/T3/T5/T6/TS3) y §2 ejemplos (criterios de aceptación, agregación `consiste en`). El propio HU declara que las plantillas reales viven en `opm-opl-es.md` y que la tabla es "orientativa".
- **Canon supremo del repo (manda):** `docs/canon-opm/reglas-opm-estrictas.md` (§4.x plantillas: §403 agregación, §411 enumeración estados, §455 D5, §490–493 H1/H2/HS1/HS2, §547 RF1, §672 R-OPL-TRANS-4).
- **Canon externo:** `~/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md` (§3 designaciones, §5 habilitadores, §9 estructurales).
- **Emisión real OPFORJA:** `app/src/opl/generadores/{procedural,estructural,abanico,refinamiento}.ts` y `duracionMetadata.ts`/`designaciones.ts`.
- **Spec a actualizar:** `docs/canon-opm/spec-forja-opl.md`.

## Regla de arbitraje (precedencia)

1. **Canon supremo manda:** `reglas-opm-estrictas.md` + `opm-opl-es.md`.
2. **OPCloud / HU-eco es observacional.** No se adopta a ciegas.

Veredictos posibles: **adoptar-OPCloud** (forma OPCloud más rica/correcta y compatible con canon) · **rechazar-OPCloud** (OPCloud diverge del canon; mantener nuestra forma) · **revisar** (decisión del operador) · **ya-cerrada** (resuelta en commit previo).

## Tabla de divergencias

| ID | Forma OPCloud (HU) | Forma OPFORJA (código) | Canon supremo (§) | Veredicto | Sev. | Acción en spec-forja | GAP |
|----|--------------------|------------------------|-------------------|-----------|------|----------------------|-----|
| **D1** esencia/afiliación | `**Conductor** es un objeto físico y sistémico.` (combinada con «y») | combinada con «y» — `estructural.ts:28-29` (`oracionEntidad`); test `estructural.test.ts` | `opm-opl-es §3` D1; coordinación D5/D10 | **ya-cerrada** (commit `59ad3a9`) | ninguna (registrar como CERRADA) | — |
| **D5** estados | `**Objeto** puede ser \`e1\`, \`e2\` o \`e3\`.` | `**Objeto** puede estar …` — `duracionMetadata.ts:69` (`oracionEstados`); test `designaciones.test.ts:13` | `reglas §411`, §455 D5; **§672 R-OPL-TRANS-4: «`can be` DEBE transformarse en `puede estar`»**; `opm-opl-es §3.2` | **rechazar-OPCloud** | ninguna (código y spec §1.2/§2.x YA correctos; `puede ser` reservado a especialización XOR RX1/RX2 §554-555) | — |
| **Agregación** (RF1) | `**Sistema** consiste en **Parte1**, **Parte2** y **Parte3**.` | `**Todo** consta de **Parte**.` — `estructural.ts:63`; test `estructural.test.ts:14` | `reglas §403`, §547 RF1; `opm-opl-es §9` | **rechazar-OPCloud** | ninguna (código y spec §… YA `consta de`); registrar rechazo explícito | — |
| **T6** instrumento (H2) | `**Volante** requiere *Conducir*.` (sujeto = instrumento) | `*Proceso* requiere **Instrumento**.` (origen=instrumento, destino=proceso → emite destino+verbo+origen) — `procedural.ts:196` | `reglas §396`, §492 H2 / §677 spec: `*Proceso* requiere **Instrumento**.` | **rechazar-OPCloud** | ninguna (dirección OPFORJA = canon; la HU invierte sujeto/objeto) | — |
| **T5** agente (H1) | `**Conductor** maneja *Conducir*.` | `**Agente** maneja *Proceso*.` — `procedural.ts:192` | `reglas §395`, §490 H1 | **ya-cerrada** (coincide canon) | ninguna | — |
| **T1/T2/T3** transformadores | `*Proceso* consume/genera/afecta **Objeto**.` | idénticos — `procedural.ts:199-201` (consumo/resultado), `:381` (efecto/afecta) | `reglas §4.5`; `opm-opl-es §4` | **ya-cerrada** (coincide canon) | ninguna | — |
| **TS3** cambio estado | `*Proceso* cambia **Objeto** de \`e_in\` a \`e_out\`.` | idéntica — `procedural.ts:147` | `reglas §4.x TS3`; `opm-opl-es §6` | **ya-cerrada** (coincide canon) | ninguna | — |

### Notas de verificación

- **D5 — punto crítico de la auditoría.** El HU-SHARED-007 propaga `puede ser` para estados en su tabla §3 y en el criterio de aceptación («se emite `**Objeto** puede ser \`estado1\`…`»). Esto es una **mala traducción OPCloud de "can be"**: el canon reserva `puede ser` exclusivamente para especialización XOR (`reglas §569 R-OPL-RF-5`, §554-555 RX1/RX2; spec §1.2 R-VERB-EST-1/2). OPFORJA YA emite `puede estar` correctamente. **El defecto está en el texto del HU, no en el código.**
- **T6 — la HU invierte la dirección.** OPCloud (vía HU) escribe el instrumento como sujeto (`**Volante** requiere *Conducir*`), lo que es semánticamente erróneo: el dependiente es el proceso, no el instrumento. OPFORJA y el canon (§677) ponen el *proceso* como sujeto. RECHAZAR la forma HU.
- **Sustantivo de tipo / perseverancia.** Revisado: OPCloud (HU) NO coordina perseverancia en la oración de designación; la incluye en el sustantivo de tipo (`es un objeto`/`es un proceso`) sin enumerar "estático/dinámico". OPFORJA hace lo mismo (esencia+afiliación coordinadas con «y», tipo en el sustantivo). Sin divergencia adicional.

## Estimación de gap actualizada

| Veredicto | Nº | Formas |
|-----------|----|--------|
| ya-cerrada | 4 | D1, T5, T1/T2/T3, TS3 |
| rechazar-OPCloud | 3 | D5 (estados), Agregación, T6 (dirección) |
| adoptar-OPCloud | 0 | — |
| revisar | 0 | — |

**GAP de código nuevo:** **0.** Ninguna divergencia abre `GAP-OPCLOUD-*`. En todos los casos donde OPCloud difiere, **el canon manda y OPFORJA ya está alineado al canon**. Las tres divergencias `rechazar-OPCloud` son defectos en el texto del HU-SHARED-007 (evidencia observacional mal traducida), no brechas de implementación.

**Acción recomendada (no de código):** corregir el HU-SHARED-007 §3 para que su tabla "orientativa" no propague `puede ser` en estados ni invierta T6 — pero el HU declara explícitamente que `opm-opl-es.md` es la fuente, por lo que es opcional/cosmético. Sin ola asignada (no toca `app/src`).

## Resumen

- **0 adoptar / 3 rechazar / 4 ya-cerradas.** Cero GAP de código.
- El eje del hallazgo es que **OPCloud (HU-eco) NO es fiel al canon en 3 formas** y OPFORJA correctamente NO las copió.
- **Las 3 de mayor valor:**
  1. **D5 `puede ser` (estados)** — *rechazar-OPCloud*. OPCloud mal-tradujo "can be"; el canon (§672 R-OPL-TRANS-4) obliga `puede estar`; `puede ser` es exclusivo de especialización XOR. OPFORJA correcto.
  2. **Agregación `consiste en`** — *rechazar-OPCloud*. Canon §403/§547 manda `consta de`. OPFORJA correcto.
  3. **T6 dirección `**Volante** requiere *Conducir*`** — *rechazar-OPCloud*. La HU invierte sujeto/objeto; canon §677 = `*Proceso* requiere **Instrumento**`. OPFORJA correcto.
