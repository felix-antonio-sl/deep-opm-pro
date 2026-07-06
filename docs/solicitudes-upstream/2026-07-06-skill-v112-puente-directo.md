# Solicitud a custodio-kora — skill `modelamiento-opm` v1.12.0 (puente directo) + enmienda SSOT bottom-up

**Fecha:** 2026-07-06 · **De:** compuesto opforja (deep-opm-pro) · **Para:** custodio-kora (kora-pneuma)
**Origen:** programa «experiencia ágil mesa↔skill» (brainstorming + comité doble `steve-jobs`×`steipete` con `cat-thinking`). Specs gobernantes: `docs/superpowers/specs/2026-07-06-puente-directo-mesa-skill-design.md` · `docs/superpowers/specs/2026-07-06-apuntes-taller-design.md`.
**Naturaleza:** propuesta. La skill y el corpus OPM son SSOT read-only desde el repo; el compuesto **propone**, la escritura es HITL custodio-kora. Se eleva el **día 0** del build (en paralelo con la Ola 1) para que la firma esté lista cuando el código compile.

## Petición 1 — skill `modelamiento-opm` v1.12.0: camino primario directo

Hoy el bucle mesa↔skill viaja por el **portapapeles** (puente W6.0: el humano copia el contexto, pega en la sesión, re-emite el bundle, re-importa). La Ola 1 del puente construye un **CLI** (`mesa pull` / `mesa push`) que deja a la skill leer y escribir el estado del modelo directo contra el backend, autenticada por token de agente. La skill debe enseñar ese camino como **primario**:

- **`mesa pull` antes de trabajar** (base fresca) → trabajar el modelo/proto → **`mesa push`** con nota.
- **Reglas de método del puente** (que la skill debe portar):
  1. Nunca `push` sin validación local verde (el contrato de import duro).
  2. Respetar el **409** (la mesa avanzó bajo los pies): re-`pull`, jamás forzar.
  3. Sobre **base no ratificada** (el `pull` declara `Fuente: autosave no consolidado`): la skill lee y propone, pero **no cierra el loop con push** sin ratificación explícita del operador (bandera `--confirmado-por-operador`).
  4. **Carril por procedencia**: a un modelo **con sello** (nacido de un proto) se empuja el **bundle del compilador** (editar el proto y recompilar), nunca JSON artesanal; a un modelo **sin sello** (nacido en la mesa) el push libre es legítimo.
  5. Nota de versión con procedencia (`agente·<nota>`).
- El **puente W6.0 por portapapeles** queda como **fallback declarado** (sesión sin acceso al host).
- **Receta bottom-up disponible hoy** (mientras el corte B′⊕D no despliega): bosquejar fragmentos como **apuntes** (rigor relajado) y llevarlos al modelo madre por **composición de modelos**.

## Petición 2 — enmienda SSOT: bottom-up de primera clase (doctrina resuelta)

El operador-custodio resolvió (2026-07-06, `docs/solicitudes-upstream/2026-07-06-taller-bottom-up-doctrina.md`) que el arranque **bottom-up** es camino de **primera clase**, sin negar la graduación apunte→modelo. Enmiendas a redactar (firma del custodio ANTES del deploy del corte B′⊕D):

- **`metodologia-forja-opm-es`**: el arranque bottom-up (fragmentos → reconciliación → SD0) como camino de elicitación de primera clase, hermano del SD-primero (que sigue siendo el default del método guiado).
- **`spec-forja-opd-es` §10/§12**: realización del **Taller** (banda de OPDs sueltos, `Opd.padreId: null`, verbo «adoptar» = fijar padre + declarar refinamiento en un gesto) como extensión declarada. El código de validez «OPD sin adoptar» = condición del gate de export canónico existente (en modelo bloquea el documento, en apunte observa), NO una clase de severidad nueva. Integridad estructural NUNCA degrada.
- **Skill** (misma v1.12.0 o sucesiva): régimen bottom-up — cómo la skill acompaña fragmentos sin exigir SD y cuándo propone la reconciliación.

## Verificación de cierre (cuando se aplique)

`kora check --strict` verde tras las enmiendas; el puente `docs/canon-opm/spec-forja-opd.md` y el `resolutor-urn.json` resuelven la versión actualizada; el cordón `cordon:skill` de deep-opm-pro se re-pinea a la v1.12.0 (mismo mecanismo que el bump v1.11.0); el manual cita las reglas sin transcribirlas.

## Estado

**ABIERTA** — pendiente HITL custodio-kora. No bloquea el build headless de la Ola 1 (el código del puente no necesita la skill para funcionar); sí bloquea el **deploy** del corte B′⊕D (el código de validez nuevo espera la firma).
