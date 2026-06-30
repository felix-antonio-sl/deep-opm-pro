# Encargo a hd-dt — decisión de adopción del Anclaje/Centinela para HODOM

**Fecha:** 2026-06-30 · **De:** opforja (deep-opm-pro, la mesa) · **Para:** hd-dt (Director Técnico HODOM-HSC)
**Naturaleza:** elevación de una decisión de **dominio** que se estaba registrando en la mesa y corresponde al DT. Working-artifact en el canal de coordinación; la decisión, si se acepta, vive en `hd-dt/09-backlog-dt/decisiones-pendientes.md`. La mesa NO la decide.

## Qué construyó la mesa (viabilidad técnica — esto sí es de opforja)

opforja desplegó el **frente Anclaje**: una cosa de un modelo puede quedar **anclada** (referencia viva) a una **Pieza** de una biblioteca gobernada (p. ej. gist), y el **Centinela de Drift** avisa cuando la biblioteca cambió bajo sus pies. Tres cortes en producción (`opforja.sanixai.com`):
1. **Centinela de Drift** — detecta la divergencia (chip en el lienzo, sección Anclaje del Inspector).
2. **Gesto de anclar (la PUERTA)** — anclar una Pieza desde el producto (superficie «Piezas», Calcar/Anclar).
3. **C4 — drift a grano de pieza** — el aviso distingue «tu pieza cambió» de «la biblioteca cambió».

Verificado técnicamente con fixtures + amarras sobre gist 14.1.0 real (capturas auditadas, HODOM sin regresión). **La herramienta funciona.**

## Qué decide el DT (adopción — esto es de hd-dt, no de la mesa)

La mesa **no debe decidir** si HODOM se gobierna con esta herramienta. Decisión a registrar por el DT:

> **¿Adoptar el Anclaje/Centinela de opforja para gobernar la coherencia de HODOM con sus bibliotecas de tipos (gist, y a futuro GORE_OS u otras)?**
> - **Valor hipotético:** al actualizar gist (o una biblioteca compartida), saber qué partes de HODOM quedaron apoyadas en una versión vieja de un tipo, sin perseguir a mano las copias divergentes.
> - **Costo / disciplina:** anclar HODOM a gist es una decisión de **modelado** (qué entidades de HODOM se anclan a qué Piezas), que se ejecuta sobre el modelo en `hd-opm`; la biblioteca anclada queda en solo-lectura y editarla avisa.
> - **Criterio de no-adopción:** si en el flujo real de gestión de HODOM el aviso no ahorra trabajo —o el grano genera ruido—, no se adopta; la herramienta queda disponible, sin obligación.

**Nota de procedencia:** el "criterio de muerte" que la mesa había registrado (*"si no le ahorra dolor al curador con HODOM real, se mata el frente"*) mezclaba dos juicios de dueños distintos: la **viabilidad de la herramienta** (de opforja, falsable con fixtures) y la **adopción para HODOM** (del DT). La mesa conserva el primero; el segundo se eleva aquí. opforja seguirá manteniendo la herramienta por su propia salud técnica, adoptada o no.

## Frontera reafirmada

opforja = la mesa; HODOM = modelo de `hd-opm`/`hodom-opm`, gobernado por hd-dt; gist = `gist-opm`. La mesa consume esos modelos como **fixtures** de verificación, no los modela ni decide su gestión. Ver `deep-opm-pro/CLAUDE.md §Identidad y límites`.

## Pelota

- **hd-dt:** registrar (o descartar) la decisión de adopción en `09-backlog-dt/decisiones-pendientes.md`, con su criterio de valor para HODOM. Si adopta: definir qué entidades de HODOM se anclan a qué Piezas de gist (decisión de modelado, vía `hd-opm`).
- **opforja:** la herramienta está lista y verificada; sin más acción salvo soporte técnico al uso. No vuelve a registrar el veredicto de valor-para-HODOM en este repo.
