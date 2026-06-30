# Acta — C4: drift granular a nivel de PIEZA (vecindad RADIO-1)

**Fecha:** 2026-06-30 · **Tipo:** nota de corte (implementación) · **Estado:** kernel + leyes + amarra in-vivo VERDES; sin merge a `main`, sin deploy (worktree aislado).

Cierra el ítem que el spec del Centinela (`2026-06-26-corte-centinela-drift-ui-design.md` §9) declaró fuera de alcance: «drift granular por-Pieza (C4)». El diseño fue ratificado por el curador antes de construir.

## Qué cambió

El Centinela medía drift a **grano biblioteca**: mutar CUALQUIER pieza de gist marcaba `divergente` a TODA cosa anclada a esa biblioteca (ruido «toda la biblioteca cambió»). C4 baja el grano a la **vecindad RADIO-1** de la Pieza.

- **Frontera de `firmaPieza`** (ratificada): la entidad-pieza + sus estados (`entidadId===piezaId`) + sus enlaces incidentes (origen/destino resuelven a la pieza o a uno de sus estados — los vecinos entran **por id, no por contenido**) + abanicos cuyos `enlaceIds` intersecten. Reusa `proyectar` + las `PARTICION_*` (misma SSOT de la firma de biblioteca) + el mismo `ordenarJson` + FNV-1a.
- **Contrato ADITIVO:** `Anclaje.frozenAtPieza?: string` (opcional). Su **presencia** decide el grano. `biblioteca.frozenAtHash` queda REQUERIDO e intacto. Rollback = dejar de poblar `frozenAtPieza` ⇒ todo cae a grano biblioteca.
- **Pieza ausente** (biblioteca leída, pero la Pieza ya no existe) ⇒ `divergente` vía centinela `CENTINELA_PIEZA_AUSENTE` (NO un 4º `EstadoDrift`, NO `no-resuelto`).
- **Re-sync sube el grano:** re-sincronizar moderniza un anclaje legacy a grano pieza (escribe `frozenAtPieza`).
- **Resolutor del store:** `construirResolverHashVivo` pasa de mapa `modeloId→hash` a `modeloId→Modelo|null` (bibliotecas hidratadas), porque dos anclajes a la misma biblioteca con piezas distintas necesitan hashes vivos distintos; computa `firmaPieza`/`firmaBiblioteca` por-anclaje según grano (`firmaVivaAnclaje`).

## Dónde se prueba

- **Ley nueva** `src/leyes/anclaje-pieza-grano.test.ts` (42 tests): quietud-pieza (presentación + mutación ajena ⇒ `sincronizado`), sensibilidad-pieza (vecindad de A ⇒ `divergente`), pieza ausente, y la **composición INVERSA de la amarra 2b**: dos cosas ancladas a piezas DISTINTAS de la misma biblioteca; mutar la pieza de A ⇒ A `divergente`, **B `sincronizado`**. Verificado falsable: al romper la lógica de vecindad (firmaPieza hashea de más) la mandíbula inversa enrojece; restaurada, verde.
- **Leyes legacy** (`anclaje-mecanismo/sensibilidad/centinela/quietud/composabilidad`, `calco-anclaje-adjuncion`) verdes vía grano biblioteca (sin `frozenAtPieza`).
- **e2e** `34`/`36` verdes (grano biblioteca, gesto + bundle). **Amarra nueva** `e2e/amarra-pieza-grano.preview.spec.ts` (excluida del smoke) sobre gist real: anclar `ent-Assignment` por el gesto (congela `frozenAtPieza`), mutar `ent-Account` (pieza AJENA) ⇒ el ⟳ NO aparece (sigue `sincronizado`); mutar `ent-Assignment` misma ⇒ `divergente`. Capturas en `app/test-results/amarra-pieza-grano/`.

## Pendiente (no en este corte)

Fase 4 del frente (cierre de valor): merge + reconciliación + deploy lo hace el operador. «Qué campo cambió» (diff de campo) y panel-resumen agregado siguen fuera de alcance.
