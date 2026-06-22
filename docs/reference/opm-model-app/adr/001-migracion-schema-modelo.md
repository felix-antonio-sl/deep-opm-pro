# ADR 001 — Estrategia de migración del schema `Modelo`

**Fecha**: 2026-04-21
**Estado**: aceptado
**Categoría**: F-03 del BACKLOG (deuda cerrada por este ADR)

## Contexto

El schema del `Modelo` OPM vive en `src/nucleo/tipos.ts` y se serializa a
JSON en los fixtures (`fixtures/ejemplos/*.json`). Hoy hay **7 fixtures
activos** + 25 snapshots que dependen de la forma exacta del schema.

A lo largo del proyecto el schema ha evolucionado incrementalmente:
- v1.1 → v2.3 con 10 parches (documentados en `docs/archive/2026-04/HANDOFF-NUCLEO-2026-04-18.md`).
- Migración de `Apariencia` plana a discriminated union + `Layout` separado
  (C-01 + C-02 del ciclo 2026-04-21).
- Agregado de `Modelo.layouts` paralelo a `Modelo.apariencias`.

Todas las migraciones anteriores se manejaron **in situ** (refactor atómico
+ migrador para fixtures antiguos) pero sin una estrategia declarada.

Futuras migraciones probables incluyen:
- Cambiar `TipoCosa` a discriminated union más rico (ej. agregar
  `"abstracto"` para stereotypes abstractos).
- Separar Apariencia semántica de Layout aún más (C-02 ya lo hizo pero
  quedan campos mezclados como `fijada`, `modo`).
- Introducir un concepto de "profile" o "dominio" explícito en el Modelo
  (hoy viven como Estereotipo genérico; podría promoverse).
- Soportar content-addressed IDs (hash-based) además de URN-based para
  D_HSC (FEAT-03).

## Decisión

Adoptar **schema versioning explícito** con **migradores in-place** y
**retro-compatibilidad del JSON**. Tres principios:

### 1. Versión declarada en el JSON

Cada fixture serializado llevará un campo `schema_version` al inicio:

```json
{
  "schema_version": "2.3.0",
  "meta": { ... },
  "cosas": [ ... ],
  ...
}
```

Hoy muchos fixtures no lo tienen; se agrega progresivamente cuando sean
tocados. Al cargar, `hidratarModelo` inspecciona `schema_version` y aplica
cascada de migradores hasta la versión actual.

### 2. Migradores como funciones puras encadenables

Estructura propuesta (futura):

```
src/nucleo/migrador/
  index.ts                    — orquestador que aplica cadena desde
                                 <version JSON> hasta <version actual>.
  v2-1-0-a-v2-2-0.ts          — migrador entre dos versiones consecutivas.
  v2-2-0-a-v2-3-0.ts
  v2-3-0-a-v3-0-0.ts
  ...
```

Cada migrador es `(jsonEntrada: unknown): unknown` puro, sin side effects.
`hidratarModelo` aplica solo las necesarias según el pin de versión.

### 3. Retro-compatibilidad del JSON preservada por tanto tiempo como sea
práctico

Cuando cambia la forma interna del `Modelo` TS (p.ej. `Apariencia` union),
el JSON en disco puede quedarse plano — la hidratación hace el mapping.
Esto ya se aplicó en C-01 + C-02 (fixtures JSON no cambiaron pese a que
`Apariencia` interna es ahora discriminated union + Layout separado).

**Criterio de ruptura**: solo cuando la retro-compat cueste más que
migrar los 7 fixtures (ej. si la hidratación requiere lógica > 100
líneas de branches, conviene migrar los JSON una vez).

## Alternativas consideradas

### Alt A — Schema siempre igual al TS (sin retro-compat)
Obligaría a migrar los fixtures en cada cambio. Simple pero pesado.
Rechazado: 7 fixtures hoy, + los que lleguen de dominios futuros.

### Alt B — Sistema de migraciones tipo Drizzle/Prisma (ORM-like)
Esquema: archivo YAML/SQL + CLI `migrate up/down`. Overkill para un
modelo en memoria de ~50 tipos. Rechazado.

### Alt C — Zod/io-ts runtime validation con transformers
Hace la validación de schema explícita + permite transformar en el mismo
paso. Interesante pero agregaría deps + refactor grande del validator
hard-coded. Considerar en un ciclo futuro si crece la presión.

## Consecuencias

### Positivas

- Cualquier fixture creado con schema viejo puede cargarse sin tocar el JSON.
- Cambios al kernel no bloquean en fixtures; las migraciones se acumulan
  como historial.
- Habilita importar modelos de otros tools OPM (OPCloud export, etc.) con
  adapter en la capa de migración.

### Negativas

- Los migradores son código de mantenimiento perpetuo. Uno por cada salto
  de versión (aunque triviales si el cambio es aditivo).
- Complejidad de la función `hidratarModelo` crece con el número de
  migradores.

### Mitigaciones

- Consolidar periódicamente: si hay N migradores, reescribir el fixture
  base con la versión actual y deprecar migradores anteriores.
- Tests de snapshot cubren el efecto neto sin preocuparse de la cadena.

## Acciones inmediatas (tras este ADR)

- Agregar `schema_version: "2.3.0"` a los 7 fixtures activos en el próximo
  commit que los toque (no ahora para no inflar este ADR).
- Documentar que el agente debe consultar este ADR antes de mover un
  campo del schema `Modelo`.

## Revisión

Cuando se toque el schema por N-ésima vez sin seguir esta estrategia, o
cuando aparezcan fixtures externos que no podemos migrar, revisar el ADR
y evaluar si Zod/io-ts runtime validation es el siguiente paso.
