# Enmienda SSOT — bottom-up de primera clase + realización del Taller (para firma del custodio)

**Fecha:** 2026-07-07 · **De:** compuesto opforja (deep-opm-pro) · **Para:** custodio-kora (kora-pneuma)
**Naturaleza:** ENTREGABLE AUTOREADO del corte `B′⊕D-especies` (día 0). Realiza la Petición 2 de
`docs/solicitudes-upstream/2026-07-06-skill-v112-puente-directo.md` sobre la doctrina RESUELTA en
`docs/solicitudes-upstream/2026-07-06-taller-bottom-up-doctrina.md` (opción (a), primera clase).
**Gate de deploy:** el código de validez «OPD sin adoptar» y el nacimiento «todo nace apunte»
**no se despliegan** hasta que esta enmienda esté firmada y aplicada en pneuma (`kora check --strict` verde).
La mesa **eleva ANTES** de compilar; la firma es del custodio (HITL).

> **Cómo aplicar (custodio).** El texto de abajo es el contenido exacto a insertar, con su ubicación.
> Los archivos de prosa SSOT (`metodologia-forja-opm-es.md`, `spec-forja-opd-es.md`) se editan
> directamente en `~/kora-pneuma/artefactos/conocimiento/fxsl/` y se verifican con
> `python3 ~/kora-pneuma/kora.py velar` + `kora check --strict`. La skill `modelamiento-opm` v1.12.0
> se re-emite por el funtor `kora.py transmutar` (ver `[[reference_porte_skill_kora]]`), no editando
> el deploy. Tras aplicar: re-pinear el puente `docs/canon-opm/spec-forja-opd.md` y el cordón
> `cordon:skill` de deep-opm-pro a la versión nueva (mismo mecanismo que el bump v1.11.0).

---

## Por qué la enmienda es **menor** (la doctrina ya está latente)

La metodología ya legitima el arranque no-top-down; esta enmienda lo **nombra y eleva** a camino con
nombre propio, y declara su realización. No introduce doctrina nueva:

- **A1.1** ya dice: *«Práctica real = middle-out … "empezar por la función" fija la semilla conceptual,
  no obliga a construir top-down estricto.»*
- **A1.3 (MBRSE)** ya dice: *«el método NO exige reconstruir top-down … las observaciones pueden entrar
  en cualquier nivel de la jerarquía; el trabajo es middle-out con ciclos bottom-up y top-down.»*

Lo que faltaba: (1) un **nombre de primera clase** para el arranque bottom-up exploratorio; (2) su
**realización canónica** en el árbol de OPDs (OPD suelto + adopción); (3) declarar que «OPD sin adoptar»
es **condición del gate de export existente**, no una severidad nueva.

---

## Enmienda 1 — `metodologia-forja-opm-es.md`

### 1.a — Nueva subsección **A1.5** (insertar tras A1.4, antes de «## A2. Construcción del SD»)

```markdown
**A1.5 Arranque bottom-up de primera clase (bosquejo → reconciliación → SD0).** Forja reconoce dos
arranques **hermanos**, ambos de primera clase y subordinados a la misma ley de equivalencia OPD↔OPL y a
la función-semilla (A1.1):

- **SD-primero** (default del asistente guiado, A2): fija la función en el SD y refina hacia abajo (A3).
  Es el camino disciplinado del diseño forward.
- **Bottom-up (bosquejo)**: el modelador **PUEDE** trazar **fragmentos sueltos** —OPDs sin padre, hechos
  OPM locales— sin comprometer aún un SD, y reconciliarlos después hacia el SD0. Hace explícito lo que
  A1.1 (middle-out) y A1.3 (MBRSE) ya admiten: el arranque **no obliga** a decidir el SD antes del primer
  hecho.

Reglas de uso:
- El bosquejo es **OPM legítimo con rigor de cierre relajado**: los juicios de **validez de método** (SD
  sin proceso principal, densidad, nombres, refinamiento no trivial, preservación de frontera) se
  **observan**, no bloquean, mientras el material esté en régimen de bosquejo. La **integridad
  estructural NUNCA se relaja** (referencias colgantes, formato, geometría rechazan igual).
- La **reconciliación hacia el SD0** es el acto que **cobra el rigor**: al **graduar** el bosquejo a
  modelo, los juicios de validez vuelven **exigibles** y el reporte los muestra.
- El bottom-up **NO crea un mecanismo de refinamiento nuevo**: un fragmento suelto se incorpora al árbol
  por **adopción** (spec-forja-opd-es §10.4 R-OPD-REF-20) — fijar padre + declarar refinamiento en un
  gesto, **convergente por construcción** con el refinamiento top-down (mismo constructor, mismo estado
  final legislado).
*(anclaje: A1.1 middle-out; A1.3 MBRSE; realización spec-forja-opd-es §10.4 R-OPD-REF-20; doctrina
resuelta HITL custodio 2026-07-06, `2026-07-06-taller-bottom-up-doctrina.md`.)*
```

### 1.b — Nota en el preámbulo de **A2** (insertar tras la primera oración de «## A2. Construcción del SD»)

```markdown
> El asistente de las 11 etapas realiza el arranque **SD-primero**. El arranque **bottom-up** (A1.5) es
> su hermano legítimo para elicitación exploratoria: no pasa por este asistente hasta la **reconciliación**
> (graduación del bosquejo a modelo), momento en que estas 11 etapas se exigen sobre el SD resultante.
```

---

## Enmienda 2 — `spec-forja-opd-es.md` §10.4 (Árbol de OPDs, identidad y categorías)

### 2.a — Cláusula en **R-OPD-REF-14** (añadir al final de la regla existente, antes del `*(Rationale…)*`)

```markdown
«El árbol nace en SD» es el default del **arranque guiado** (SD-primero, metodologia §A2). El arranque
**bottom-up** (metodologia §A1.5) admite OPDs **sueltos** transitorios antes de existir el SD,
reconciliados por **adopción** (R-OPD-REF-20). El invariante «el SD contiene exactamente un proceso
sistémico» se **exige al graduar** el bosquejo a modelo, no durante el bosquejo (donde es observación).
```

### 2.b — Nueva regla **R-OPD-REF-20** (insertar tras R-OPD-REF-19, antes del párrafo «Realización opforja:»)

```markdown
- **R-OPD-REF-20** (extensión declarada) — **Taller bottom-up: OPD suelto, adopción y honestidad de
  export.** Realiza el arranque bottom-up de primera clase (metodologia §A1.5).
  - **OPD suelto**: un OPD con `padreId = null` que **NO es la raíz** del modelo (`opdRaizId`) — un
    fragmento fuera del árbol de refinamiento. Es un **estado transitorio legítimo** del arranque
    bottom-up, no un error ontológico (R-OPD-VAL-4, zona laxa). Los hechos OPM de un OPD suelto
    **emiten OPL** como cualquier OPD (la bisimetría es ciega a la condición de suelto).
  - **Adoptar** (verbo de autoría): declara un OPD suelto como refinamiento (in-zoom/unfold) de una cosa
    existente — **fija el padre** (el OPD donde la cosa aparece) **y declara el refinamiento** (slot de la
    entidad) en **UN gesto**. **Convergencia (precisa)**: adoptar y el refinamiento top-down convergen en
    el **mismo constructor de vínculo** (`establecerRefinamiento`) y alcanzan el **mismo estado de
    refinamiento** — slot de la entidad + padre del OPD hijo (convergencia por construcción, a nivel del
    **vínculo**). **NO** producen idéntico **contenido** del OPD hijo, y así debe ser: el top-down
    **auto-andamia** (infla el contorno, trae externos conectados y distribuye/escinde enlaces de
    frontera, R-OPD-REF-4/R-OPD-REF-11); **adoptar toma el suelto tal como el modelador lo dibujó**
    (acto bottom-up, sin imponer andamiaje). Adoptar respeta la **prohibición de ciclos** (R-OPD-REF-8).
    La **preservación de la firma de frontera** del proceso abstracto (R-OPD-REF-10) de un refinamiento
    adoptado **NO se impone en la adopción** —sería imponer rigor top-down a un acto bottom-up—: se
    **cobra en el gate de export canónico** (condición «OPD sin adoptar» + checker
    `DESCOMPOSICION_NO_PRESERVA_FRONTERA`), coherente con «el rigor se cobra al graduar».
  - **«OPD sin adoptar» NO es una clase de severidad nueva**: es una **condición del gate de export
    canónico existente** (R-OPD-CAN-1 / gate de densidad, §10.2/§11). En un **modelo**, el export
    canónico (`canon-diagrama`/`canon-documento`) **bloquea** con causa nombrada («OPDs sin adoptar: …»)
    hasta reconciliar; en un **bosquejo/apunte** (rigor relajado, metodologia §A1.5) es **observación** y
    el export se marca. La **edición NUNCA se bloquea**.
  - **Integridad estructural NUNCA degrada** por la presencia de sueltos: referencias colgantes, formato y
    geometría se rechazan igual, ciegas a la especie del modelo y a la banda del árbol.
  - **Proyección de navegación**: los sueltos se agrupan bajo una **banda «Taller»** al pie del árbol de
    OPDs; el OPD raíz de un bosquejo proyecta como «Hoja» (sin numeral SD anticipatorio). Ambas son
    **proyección humana de navegación** (R-OPD-REF-15), NO identidad; el export canónico las normaliza.
  *(Rationale: metodologia §A1.5; R-OPD-REF-8/10/14/15; R-OPD-VAL-4 zona laxa; R-OPD-CAN-1; doctrina
  resuelta HITL custodio 2026-07-06; working-artifact deep-opm-pro `2026-07-06-apuntes-taller-design.md`.
  Traza: `modelo/operaciones/refinamiento/establecer.ts` (`establecerRefinamiento`, `adoptarOpd`),
  `serializacion/perfilesExport.ts` (`gateDensidadCanonica`+condición sueltos), `ui/arbol/togglesArbol.ts`
  (banda Taller).)*
```

### 2.c — Nota en la línea «Realización opforja:» de §10.4 (añadir al final del párrafo existente)

```markdown
Taller bottom-up (R-OPD-REF-20): OPD suelto = `padreId=null ∧ id≠opdRaizId`; constructor único de
refinamiento `establecerRefinamiento` invocado por igual por top-down (`descomponerProceso`/
`desplegarObjeto`) y por `adoptarOpd`; «OPD sin adoptar» como condición de `gateDensidadCanonica`; banda
«Taller» derivada en `construirArbol`.
```

---

## Enmienda 3 — `spec-forja-opd-es.md` §12 (Composición del OPD y rotulado)

### 3.a — Nota en **R-OPD-ROT-2** (placeholder de edición) — añadir al final de la regla

```markdown
Los rótulos de régimen de bosquejo (raíz «Hoja» del bosquejo, banda «Taller» de sueltos; R-OPD-REF-20)
son **proyección de edición** (R-OPD-REF-15): el export canónico los normaliza al esquema SD/refinamiento
tras la graduación. No portan identidad ni hecho OPM.
```

---

## Enmienda 4 — skill `modelamiento-opm` v1.12.0: régimen bottom-up

Ya elevada como Petición 2 de `2026-07-06-skill-v112-puente-directo.md`. Cuerpo a añadir (funtor
`transmutar`, no editar deploy): **cómo la skill acompaña fragmentos sin exigir SD**, y **cuándo propone
la reconciliación**:

```markdown
- **Régimen bosquejo (bottom-up, metodologia §A1.5).** Cuando el operador explora sin comprometer un SD,
  la skill NO exige SD-primero (relaja la Regla Dura #5 mientras dura el bosquejo). Acompaña fragmentos
  sueltos como hechos OPM locales; deja la validez de método en **observación**; jamás relaja integridad.
- **Cuándo proponer reconciliación.** La skill propone **graduar** (bosquejo→modelo) cuando: (a) el
  bosquejo tiene ≥1 OPD suelto adoptable a una cosa existente; (b) emerge un candidato claro a proceso
  sistémico (semilla-función); o (c) el operador pide cerrar/exportar canónico. Graduar es HITL del
  operador; la skill NO gradúa por su cuenta.
- **Adopción vía mesa.** La skill dispone del gesto `adoptar` a través del CLI de la mesa (mismo op que
  el top-down); nunca fabrica el refinamiento a mano en el JSON.
```

---

## Verificación de cierre (cuando el custodio aplique)

- [ ] `python3 ~/kora-pneuma/kora.py velar` verde tras editar los `.md` de prosa.
- [ ] `kora check --strict` verde (índice, URNs, cross-refs A1.5↔R-OPD-REF-20).
- [ ] Skill v1.12.0 re-emitida por `transmutar --target … --aplicar` (todos los targets), `velar` N/N.
- [ ] Puente `docs/canon-opm/spec-forja-opd.md` y `resolutor-urn.json` resuelven la versión nueva.
- [ ] Cordón `cordon:skill` de deep-opm-pro re-pineado a v1.12.0 (`CORDON_SKILL_ESPERADO.hashFuente`).
- [ ] El manual `docs/manual-opforja.md` cita R-OPD-REF-20 sin transcribirla.

## Estado

**ELEVADA 2026-07-07 — pendiente FIRMA HITL custodio-kora.** Bloquea el **deploy** del corte B′⊕D
(el código de validez «OPD sin adoptar» y el nacimiento «todo nace apunte» esperan la firma). **No
bloquea** el build ni los gates locales del corte.
