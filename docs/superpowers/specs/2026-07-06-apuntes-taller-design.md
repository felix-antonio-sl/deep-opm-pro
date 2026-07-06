# Apuntes desatendidos + Taller bottom-up + realización en el gestor — diseño (Corte B′⊕D-especies)

**Fecha:** 2026-07-06 · **Estado:** aprobado; mejorado por comité doble (`steve-jobs` + `steipete` con `cat-thinking`) y re-ratificado por el operador («todo nace apunte»). · **Doctrina:** bottom-up de primera clase, resuelta por el operador-custodio (`docs/solicitudes-upstream/2026-07-06-taller-bottom-up-doctrina.md`). **La solicitud de enmienda SSOT se eleva el DÍA 0** (en paralelo con la Ola 1), para que la firma esté lista cuando este corte compile.

**Fusión (arbitraje sobre el comité):** B′ y la parte de especies del gestor comparten la misma superficie (la representación de especies) — se construyen como UN corte para pagar la integración una sola vez (pushout sobre lo compartido). La higiene pura del gestor (sin especies) se adelantó a la Ola 1.

## 1. Función esencial

Bosquejar OPM **sin ceremonia** — abrir y trazar, sin nombrar, sin carpeta, sin SD exigido, con fragmentos sueltos legítimos — con **caminos de ascenso** por grano cuando el bosquejo madura. El rigor se cobra al graduar.

## 2. Granularidad: la HOJA

**Un apunte = una hoja = un record de persistencia** (el `esApunte` existente). Cero especie contenedora nueva: el «cuaderno» es la zona del gestor (agrupación virtual), no una entidad. Grano fino = el **fragmento** (un OPD, suelto o no). Tres ascensos: hoja→modelo (graduar), fragmento→otro modelo (composición existente), fragmento→raíz del propio apunte (adoptar — el bottom-up puro).

## 2-bis. Ontología de dos ejes (jobs — gobierna la superficie y la migración futura)

`apunte/modelo/biblioteca` **no son tres hermanas**: son dos ejes ortogonales — **RIGOR** (`explora→cierra`; apunte y modelo son el mismo material en dos grados de madurez, conectados por `graduar`/`degradar`) y **ROL** (`trabajo/fuente`; biblioteca = modelo cerrado con rol de estante solo-lectura). La exclusión `esApunte ⊕ esBiblioteca` es la implicación entre ejes `fuente ⇒ cierra`. Consecuencias:
- **Hoy**: no refactorizar el encoding (CLAUDE.md manda esperar el trigger); pero la UI y el vocabulario NO reifican tres hermanas (ver §6).
- **Al trigger del 3er flag**: el discriminado correcto es el **producto rigor×rol restringido** (3 de 4 combinaciones legales), NO el coproducto plano de 3.
- El decode se concentra en `especieDe()` (fundación de la Ola 1).

## 3. Nacimiento: una sola puerta

**«Nuevo» abre AL INSTANTE una hoja explorando** (apunte = objeto inicial del eje rigor): sin diálogo, auto-nombre `Apunte AAAA-MM-DD` (sin sufijo de máquina; la identidad es el id, los nombres pueden repetirse — el CLI exige id ante ambigüedad), sin carpeta, autosave desde el primer trazo. El OPD raíz nace como **«Hoja»** (sin numeral anticipatorio) y sin ceremonia SD (los diagnósticos de método degradan a observación por especie).
- **No existe «Nuevo modelo» como puerta humana**: modelo es lo que un apunte se vuelve al **graduar** — el momento de graduación pide nombre definitivo/carpeta y muestra el reporte de validez que pasa de observación a exigible. Formalidad desde el minuto cero = graduar de inmediato (un gesto).
- **Carve-out de máquina**: `mesa push` al crear declara especie explícita (`--especie`, spec del puente §5.5) — la explicitud se conserva para el canal automatizado.
- El OPL se deriva en vivo siempre (bisimetría intacta; el apunte es OPM legítimo con rigor relajado — SSOT al 100%).

## 4. Taller bottom-up (primera clase, en toda especie)

- **OPD suelto** = la rama `null` del coproducto `Opd.padreId: Id | null` que el tipo ya admite (jobs: cero estructura nueva; se realiza un caso latente). Gesto: «Nuevo OPD suelto» (árbol + paleta). Los sueltos viven bajo la banda **«Taller»** al pie del árbol.
- **Constructor único `establecerRefinamiento(padre, hijo, modalidad)`** (comité, unánime): el camino top-down (crear hijo y vincular) y el verbo **«adoptar»** (tomar un suelto existente y vincular) invocan **el mismo op del kernel**. La convergencia es identidad-por-construcción; queda UNA regresión por firma semántica (comparador existente de `firmaSemantica.ts`).
- **«OPD sin adoptar» NO es clase de severidad nueva** (jobs): es una **condición más del gate de export canónico existente** (`gateDensidadCanonica`): en modelo, el export canónico bloquea con causa nombrada; en apunte, observación. La edición no se bloquea jamás. Los hechos OPM de un OPD suelto SÍ emiten OPL.
- **Integridad estructural: NUNCA degrada** (invariante intocable).

## 5. Enmienda SSOT (día 0, firma del custodio ANTES del deploy)

- `metodologia-forja-opm-es`: bottom-up (fragmentos→reconciliación→SD0) como camino de elicitación de primera clase, hermano del SD-primero (default del método guiado).
- `spec-forja-opd-es` §10/§12: realización del Taller (banda, OPD suelto, adoptar) como extensión declarada.
- Skill `modelamiento-opm`: régimen bottom-up (acompañar fragmentos sin exigir SD; cuándo proponer la reconciliación) — en la misma solicitud v1.12.0 del puente o sucesiva.

## 6. Realización en el gestor (la parte D-especies fusionada)

- **Dos zonas por ROL**, no tres bandas (jobs): **«Trabajo»** = apuntes y modelos JUNTOS, orden por recencia, con **chip de rigor** (Apunte/Modelo) como atributo de la fila — al graduar, **el chip muta in-situ, el ítem no salta** (maduró, no cambió de naturaleza); **«Bibliotecas»** = el estante solo-lectura, aparte.
- Carpetas (sidebar de la Ola 1) aplican a modelos cerrados; el apunte vive sin carpeta y entra al sistema al graduar.
- CTA de vacío: «**Nuevo** · **Importar JSON**» (una puerta).

## 7. Leyes y verificación

| Ley | Falsación |
|---|---|
| **Convergencia por construcción** | top-down y adoptar invocan `establecerRefinamiento` (test estructural) + UNA regresión por firma semántica de ambos caminos. |
| **Rigor al graduar** | hoja con sueltos gradúa → los códigos degradados vuelven exigibles y el reporte los muestra; degradar los relaja de nuevo; el chip de rigor muta in-situ en el gestor. |
| **Integridad ciega a la especie** | referencia colgante en OPD suelto de un apunte → rechaza igual. |
| **Export honesto** | modelo con OPD sin adoptar → export canónico bloquea con causa; apunte → exporta con marca. |
| **Entrada desatendida** | «Nuevo» → hoja editable en un gesto, sin diálogo (e2e). |
| **Sin especie nueva** | inventario de flags de especie en persistencia = {esApunte, esBiblioteca} antes y después del corte (test de contrato). |

## 8. Fuera de alcance

Cuaderno como entidad · des-adopción · adopción de subgrafos parciales (el grano es el OPD) · migración del encoding de especies (espera su trigger; su forma ya está decidida en §2-bis).
