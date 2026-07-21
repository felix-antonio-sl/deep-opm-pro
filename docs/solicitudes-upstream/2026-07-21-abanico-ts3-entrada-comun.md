# Solicitud a custodio KORA/Forja — forma OPL de abanico TS3 con entrada común

**Fecha:** 2026-07-21 · **De:** opforja (`deep-opm-pro`) · **Para:** custodio KORA/Forja (`kora-pneuma`)

**Origen:** gate RED03 del contrato C01 de Hospitalización Domiciliaria (`hd-dt`).

**Naturaleza:** decisión doctrinal bloqueante previa a implementación. No cambia la validez OPM; solicita cerrar una superficie OPL y su inversa.

## Hecho que debe preservarse

El modelo contiene dos o más enlaces compactos TS3 de efecto que comparten:

- el mismo *proceso*;
- el mismo **objeto**;
- el mismo estado de entrada;
- estados de salida distintos;
- un único abanico XOR u OR que agrupa todas las ramas.

Caso mínimo C01:

```text
*Corregir Desajuste* cambia **Grado de Cobertura Asistencial Efectiva** de `insuficiente` a `suficiente`.
*Corregir Desajuste* cambia **Grado de Cobertura Asistencial Efectiva** de `insuficiente` a `insuficiente`.
```

Ambos enlaces pertenecen al mismo abanico XOR. El fact-set requerido conserva dos TS3, la entrada común `insuficiente`, las dos salidas y un solo XOR con ambas ramas.

## Silencio actual

`urn:fxsl:kb:spec-forja-opl-es` v1.3.1 R-FAN-5 canoniza únicamente abanicos de estado unilaterales:

- salida: `*P* cambia **Obj** a exactamente uno de \`s1\`, \`s2\` o \`s3\`.`;
- entrada: `*P* cambia **Obj** de exactamente uno de \`s1\`, \`s2\`.`.

La forma con una entrada común y varias salidas no está especificada. La implementación actual agrupa por entidad antes de considerar los estados y emite solo una rama TS3, lo que produce un falso verde con pérdida de fact-set.

## Decisión solicitada

Se propone canonizar, para XOR y OR, la forma:

```text
*P* cambia **Obj** de `entrada` a exactamente uno de `s1`, `s2` o `s3`.
*P* cambia **Obj** de `entrada` a al menos uno de `s1`, `s2` o `s3`.
```

Contrato propuesto:

1. Aplica solo cuando todas las ramas son TS3 compactas con proceso, objeto, entrada y operador comunes, y salidas distintas.
2. La generación agrupa todas las ramas en una oración sin perder la entrada común.
3. El parseo reconstruye un TS3 por salida, repite la entrada común en cada enlace y crea un único abanico con todas las ramas.
4. El roundtrip se decide por igualdad de fact-set, no por igualdad superficial del texto.
5. Si las ramas varían simultáneamente en entrada y salida, o no cumplen la precondición común, la forma agrupada no aplica y la herramienta debe fallar cerrado o emitir hechos individuales sin atribuirles un abanico falso.

## Alternativas descartadas

- Emitir solo `a exactamente uno de ...`: elimina el estado de entrada común.
- Emitir una sola TS3: elimina ramas del abanico.
- Emitir N TS3 sin representación del operador: conserva transiciones, pero pierde el XOR/OR.
- Inventar una sintaxis de pares `entrada→salida`: amplía el lenguaje más allá del caso necesario.

## Gate de cierre

La decisión debe quedar versionada en la SSOT propietaria y declarar la plantilla, sus precondiciones y la obligación de roundtrip. Solo después se implementará el cambio en opforja y se actualizará este registro con la versión y el commit doctrinal usados.
