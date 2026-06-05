# Contrato de migración gradual familia-V → `modelamiento-opm`

**Fecha:** 2026-06-05
**Estado:** contrato operativo inicial, sin cambio de producto.
**Autoridad inmediata:** P3 ratificado por Felix en `docs/HANDOFF.md` y `docs/roadmap/backlog-contingencial.md` (`P3-NORMALIZAR-PROTO`).
**Artefacto relacionado:** `docs/proto-modelo/gramatica-subdialecto-v0.md` § Familia V.

## Decisión

Los mapeos de léxico abierto de dominio (`V1`..`V17`) dejan de crecer como responsabilidad del compilador y migran gradualmente a `modelamiento-opm` E2, estado `normalizar-proto`.

La skill estandariza el proto antes de compilar:

- verbos de dominio hacia OPL-ES cerrado;
- citas normativas hacia el estándar de proto (`cuerpo normativo`, `localizador`, `articulos/seccion`, `target`, `claveProto`, `estado`, `nivelAutoridad`);
- barro léxico o normativo como pendiente explícito, no como hecho.

El compilador queda como verificador determinista de OPL-ES cerrado y emisor reproducible de `deep-opm-pro.modelo.v0`.

## Frontera

Este contrato NO retira todavía `mapearFamiliaV()` de `app/src/autoria/compilar/normalizador.ts`. Lo declara como adaptador legacy transitorio para preservar HODOM, los fixtures vigentes y la byte-identidad.

No se agregan nuevas reglas V en el compilador salvo corrección de bug con prueba negativa. Un nuevo verbo abierto debe resolverse en la skill y volver como OPL-ES estricto, enlace etiquetado ya decidido, ancla pendiente o rechazo explícito.

Lectura categorial usada solo como heurística de ingeniería: el compilador debe comportarse como preservador de identidad/composición (`urn:fxsl:kb:icas-preservacion`). No es una norma OPM ni aumenta el vocabulario del modelador.

## Invariantes

1. **Byte-identidad por defecto.** La migración no cambia el bundle HODOM ni su golden hasta un re-pin deliberado.
2. **Ningún LLM toca el bundle.** La skill puede proponer superficies y ledgers; el compilador emite determinísticamente.
3. **Verbos abiertos no inflan el enum OPL.** Se traducen a primitivas existentes, enlace etiquetado, ancla pendiente o rechazo.
4. **Lo normativo se estandariza antes de compilar.** El compilador no interpreta juicio normativo ni corrige referencias incompletas.
5. **Rechazar es válido.** Una oración no normalizable es barro devuelto al operador, no fracaso del flujo.
6. **Compatibilidad observable.** Mientras el adaptador legacy exista, debe reportar qué regla V usó y permitir medir deuda restante.

## Fases

| Fase | Objetivo | Salida |
|---|---|---|
| F0 | Publicar este contrato | Documento versionado y handoff actualizado |
| F1 | Inventariar `V1`..`V17` como ledger skill-side | Tabla por regla: superficie, decisión semántica, salida E2 esperada, fixture positivo/negativo |
| F2 | Agregar fixtures de equivalencia | Pares `proto laxo familia-V` → `proto E2 estricto` y resultado HODOM equivalente, sin cambiar comportamiento del compilador |
| F3 | Instrumentar modo auditoría | Conteo `usoFamiliaV` por compilación/reporte; default no bloqueante |
| F4 | Migrar pilotos a proto E2 | HODOM y segundo dominio compilan con `usoFamiliaV == 0` en modo auditoría |
| F5 | Cambiar default a estricto | `mapearFamiliaV()` sale del camino normal; se conserva solo flag legacy si hace falta reproducibilidad histórica |

## Contrato de compatibilidad

Durante F0-F4:

- `normalizador.ts` conserva `mapearFamiliaV()` como adaptador heredado.
- Toda regla V aplicada conserva `{ original, regla }` o emisión compuesta equivalente.
- Ninguna regla V cambia semántica sin fixture negativo y corrida HODOM.
- Las 4 oraciones HODOM en reflexión siguen rechazadas; son guardas contra normalización complaciente.
- Las salidas de la skill deben poder compararse contra el adaptador: mismo hecho OPM, misma ancla pendiente cuando aplique, o rechazo explícito con causa.

Una regla V queda lista para salir del compilador cuando cumpla:

1. fixture laxo→E2 documentado;
2. fixture negativo que demuestre que la skill no absorbe barro;
3. piloto HODOM sin regresión;
4. segundo dominio sin duplicados por absorción;
5. auditoría `usoFamiliaV` en cero para los OPDs migrados.

## Fixtures mínimos

Los fixtures documentales de F1/F2 deben cubrir al menos:

- `V1/V2/V13`: guardas y condiciones, incluyendo binariedad de estado.
- `V8/V9/V10/V11/V17`: relaciones etiquetadas y colas como anclas pendientes.
- `V14/V15`: disyunciones y la restricción de abanicos homogéneos.
- `V16`: `notifica a` como generación de `Notificación` + relación `dirigido a`.
- Rechazos persistentes: `proyecta`, `determinan ... como`, `Otros profesionales según prestaciones`, `habilita Vehículo ... para`.
- Normativa abierta: cuerpos libres con localizador (`LGUC art. 116`, `OGUC §5.1.6`, `Código Civil art. 1545`, `ISO 19450 §7.3`) y negativos sin localizador claro.

## Gates

Sin cambios de código:

- `git diff --check`
- revisión de referencias en `docs/HANDOFF.md` y `docs/roadmap/backlog-contingencial.md`

Con cambios al compilador o fixtures:

- `cd app && bun test src/autoria`
- `cd app && bun run check`
- piloto HODOM y reporte de cobertura
- regeneración byte-idéntica en `hd-opm` cuando el cambio pueda tocar el bundle

## Riesgos

- **Doble fuente transitoria:** skill y compilador pueden divergir si se actualiza uno sin ledger de equivalencia.
- **Falsa estrictitud:** que el proto pase por el compilador legacy no prueba que ya esté normalizado por E2.
- **Absorción normativa:** una cita mal extraída puede volver a crear entidades duplicadas; R9 y `detectarDuplicadosPorAbsorcion` siguen siendo guardas obligatorios.
- **WIP concurrente:** el árbol actual tiene trabajo ajeno en render/modelo/bugs; esta migración debe evitar mezclar documentación normativa con cambios visuales o de interacción.

## Prompt breve de continuación

Retomar desde `docs/proto-modelo/contrato-migracion-familia-v-skill.md`. F0 está documentada: `mapearFamiliaV()` sigue como adaptador legacy, pero P3 manda que léxico abierto y estándar normativo vivan en `modelamiento-opm` E2 (`normalizar-proto`). Siguiente paso: F1, inventariar `V1`..`V17` como ledger skill-side con superficie, salida E2 esperada, fixtures positivos/negativos y criterio de retiro; no tocar default del compilador hasta tener HODOM/segundo dominio equivalentes y byte-identidad verde.
