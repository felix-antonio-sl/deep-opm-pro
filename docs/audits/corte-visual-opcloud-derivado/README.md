# Corte visual derivado de OPCloud — consolidado en ronda 22

**Fecha**: 2026-05-14
**Estado**: integrado en documento autoritativo de ronda 22.

---

## Documento autoritativo

El análisis arquitectónico OPCloud vs deep-opm-pro, la evaluación categorial (skill `cat-thinking`, corpus ICAS-BoK) y el análisis IFML — junto con los dos pushouts independientes (`overlayCanvas` y features sueltas) — **fueron consolidados** dentro del brief activo de ronda 22:

`/home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda22/refactor-ux-ifml.md`

Esa versión consolidada es la única autoritativa. Codex y operador deben referirse a ella para ejecución.

## Contenido aquí preservado únicamente como puntero

- §0.1 del consolidado contiene el **marco categorial** completo (diagnóstico `F_DOP` vs `F_OPC`, adjunción `Rappid ⊣ JointJS_OSS`, bisimulación sin equivalencia natural).
- §9 del consolidado contiene los **dos pushouts categoriales independientes** (Pushout A `overlayCanvas` con vértice `{BboxTracker, OverlayStore}` y piezas A0–A4; Pushout B con piezas B1–B4).
- §10 del consolidado contiene el **DAG global de dependencias** y el mapeo Pushout ↔ Sprint.
- §15 del consolidado contiene los **contratos categoriales globales** verificables.
- §17 del consolidado contiene la **trazabilidad completa** (URNs ICAS-BoK + patrones IFML XY-Z).

## Doc autoritativo relacionado de enlaces

Las brechas funcionales del dominio OPM (no visual) continúan tratadas en:

`docs/audits/opcloud-enlaces-pendientes/README.md` — exception/time links, forked tagged, smoke UI tagged, OPX.

La Pieza B4 (Labels avanzados) del consolidado coordina con ese documento autoritativo.
