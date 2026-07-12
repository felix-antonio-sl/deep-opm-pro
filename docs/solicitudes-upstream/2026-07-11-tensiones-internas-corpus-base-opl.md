# Corrección documental — 4 tensiones internas del corpus OPM-ES — PENDIENTE

**Fecha:** 2026-07-11 · **De:** compuesto opforja (deep-opm-pro) · **Para:** custodio-kora (kora-pneuma)
**Naturaleza:** bug documental de las **capas base** (no de la familia Forja), detectado por la
verificación adversarial doble del paquete educativo OPM puro (`docs/manual-opm-puro.md` +
`docs/cheatsheets/opm-puro.html`, commit deep-opm-pro `4a32e2e5`, 2026-07-09). Cada hallazgo fue
refutado de primera mano contra los archivos antes de elevarse. **No bloquea nada**: severidad
baja, pero las cuatro divergencias viven en superficie que los artefactos derivados citan textualmente
(manuales, cheat sheets, ejemplos de enseñanza), por lo que conviene sanearlas en la fuente.

**Criterio de arbitraje usado por la mesa mientras tanto:** ante divergencia de superficie textual,
manda `opl-es` (capa textual propietaria por contrato editorial del corpus); el manual educativo ya
sigue esa regla. Esta solicitud pide que la fuente deje de divergir.

---

## Tensión 1 — Colección incompleta: «y otras partes» vs «y al menos otra parte»

- **Evidencia:** `opm-es.md:763` ejemplifica
  `**Lavavajillas** consta de **Compartimento de Jabón** y otras partes.`
  mientras `opl-es §9.3` (`:396`) canoniza el token de colección incompleta para agregación:
  `…and at least one other part.` → `…y al menos otra parte.`
  («…y otros estados» sí es canónico, pero para **estados** — plantilla D6; el ejemplo lo cruza a partes.)
- **Recomendación (única):** corregir el ejemplo de `opm-es.md:763` a
  `**Lavavajillas** consta de **Compartimento de Jabón** y al menos otra parte.`
  **Porqué:** la superficie textual es propiedad de `opl-es`; el ejemplo de la capa semántica debe
  realizarla, no improvisar una variante que ningún parser conforme acepta (R-OPL-LISTA-1,
  `reglas:705`).

## Tensión 2 — Género del ejemplo Limpieza: `sucio/limpio` vs `sucia/limpia`

- **Evidencia:** el mismo ejemplo canónico aparece en masculino en `opm-es.md:769-778`
  (enumeración `puede estar \`sucio\` o \`limpio\``, designaciones inicial/final y la oración TS3
  `cambia … de \`sucio\` a \`limpio\``) y en femenino en `opl-es §14` (`:577-580`:
  `puede estar \`sucia\` o \`limpia\``, `Estado \`sucia\` … es inicial.`).
- **Recomendación (única):** feminizar las cuatro oraciones del ejemplo en `opm-es.md`
  (líneas 769-771 y 778) a `sucia`/`limpia`.
  **Porqué:** R-OPL-1 fija masculino solo como *default de plantilla*, ajustable al género natural
  del sustantivo concreto — y el sustantivo es **Limpieza**. `opl-es` ya lo publica en femenino;
  es `opm-es` el que quedó sin ajustar.

## Tensión 3 — SE2 objeto↔proceso en el ejemplo §16 vs R-OPL-SE-2

- **Evidencia:** `opl-es §16` tabula y emite
  `**Receta** se relaciona con *Preparar Empanadas*.` (`:661` fila «Etiquetado (nulo) | Receta |
  *Preparar Empanadas* | SE2» y `:680` la oración), es decir un estructural etiquetado nulo con
  firma **objeto↔proceso**. Eso tensiona con:
  - **R-OPL-SE-2** (`reglas-opm-estrictas-es:610`): «los enlaces estructurales etiquetados OPL-ES
    DEBEN emitirse como objeto↔objeto o proceso↔proceso; mezclas objeto↔proceso pertenecen a
    exhibición-caracterización cuando son canónicas»;
  - la propia capa semántica (`opm-es §Enlaces estructurales`): los estructurales conectan objetos
    con objetos o procesos con procesos, **excepto** exhibición-caracterización.
  A diferencia de las tensiones 1-2, aquí hay **decisión de fondo**: o el ejemplo está mal, o la
  regla necesita una excepción declarada.
- **Recomendación (única):** corregir el **ejemplo**, no la regla: re-apuntar la fila SE2 de §16 a
  firma homogénea — `**Receta** se relaciona con **Sistema de Preparación de Empanadas**.` —
  actualizando la tabla de enlaces (`:661`) y el párrafo OPL (`:680`), y su eco en OPL-EN.
  **Porqué:** (a) la homogeneidad estructural es semántica de capa base, no capricho de la spec —
  relajarla por un ejemplo invertiría la jerarquía de autoridad; (b) el propósito didáctico de la
  fila (mostrar un etiquetado **nulo**) se preserva intacto con destino objeto; (c) la alternativa
  de remodelar la **Receta** como instrumento (`*Preparar Empanadas* requiere **Receta**.`) es
  semánticamente defendible pero cambia el *contenido* del ejemplo (la tabla la lista deliberadamente
  como ambiental con etiquetado nulo), tocando más de lo que el saneamiento exige.

## Tensión 4 — «Todo procedimental es no homogéneo» excluye invocación y excepción

- **Evidencia:** `manual-metodologico-opm-es §9.6` (`:611`) prescribe que todos los enlaces
  procedimentales son no homogéneos (objeto↔proceso), pero el mismo corpus declara dos familias
  procedimentales con firma proceso→proceso:
  - invocación, en `opm-es` (glosario 3.31 y §Enlaces procedimentales) y `opl-es §8.2`;
  - excepción autónoma, en `opm-es §Enlaces procedimentales` y
    `reglas-opm-estrictas-es §5.1` (extensión Forja declarada).
  La definición 3.57 de `opm-es` también restringe «relación procedimental» a objeto/estado↔proceso,
  por lo que el mismo desajuste aparece en glosario y método.
- **Recomendación (única):** acotar la regla de homogeneidad: transformadores y habilitadores
  DEBEN ser no homogéneos; invocación y excepción DEBEN conectar proceso→proceso; los
  estructurales DEBEN ser homogéneos salvo exhibición-caracterización. Ajustar en la misma
  enmienda la definición 3.57 para que «procedimental» abarque ambas firmas.
  **Porqué:** conserva todas las realizaciones ya legisladas y corrige la generalización, sin
  reclasificar enlaces ni crear excepciones ad hoc en los derivados.

---

## Cómo aplicar (custodio)

1. Editar `~/kora-pneuma/artefactos/conocimiento/fxsl/opm-es.md` (tensiones 1-2 y definición 3.57
   de la tensión 4), `~/kora-pneuma/artefactos/conocimiento/fxsl/opl-es.md` (tensión 3: §16,
   tabla de enlaces + párrafos OPL-ES/OPL-EN) y
   `~/kora-pneuma/artefactos/conocimiento/fxsl/manual-metodologico-opm-es.md` (§9.6, tensión 4),
   con bump de versión + changelog en frontmatter de cada pieza modificada.
2. `python3 ~/kora-pneuma/kora.py velar`.
3. Avisar a la mesa (deep-opm-pro) para retirar las notas transitorias. Desde el saneamiento de
   convergencia del 2026-07-12, `docs/manual-opm-puro.md` y
   `docs/cheatsheets/opm-puro.html` ya siguen preventivamente R-OPL-SE-2 y declaran la firma
   procedimental por subtipo; las tensiones 1-2 también estaban resueltas en los derivados a
   favor de `opl-es`. La propagación pendiente es, por tanto, retirar la advertencia cuando el
   corpus quede firmado, no cambiar nuevamente la semántica enseñada.
