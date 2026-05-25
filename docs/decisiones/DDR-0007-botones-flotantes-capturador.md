# DDR 0007 · Capturador de bugs sin botones flotantes

**Fecha:** 2026-05-25  
**Estado:** aceptada  
**Autoridad:** `ui-forja/GOVERNANCE.md` §2, §5; auditoría visual 2026-05-25 item 4

## Contexto

La auditoría visual del 25 de mayo detectó dos botones circulares fijos en el borde inferior derecho del canvas: `Capturar bug` y `Ver bugs y features`. Aunque ambas acciones son útiles para desarrollo, su forma de floating action button no pertenece al canon Codex de Opforja: el chrome debe usar tipografía, hairlines y command palette, no controles flotantes permanentes.

## Decisión

Se eliminan los botones flotantes del chrome.

El capturador de bugs queda disponible por:

- `Ctrl+Alt+B` para abrir captura directa.
- Command palette `⌘K` → `Capturar bug`.
- Command palette `⌘K` → `Bugs y features`.

El componente `CapturadorBugs` sigue montado como servicio local para renderizar los diálogos y escuchar eventos, pero no pinta triggers permanentes.

## Consecuencias

- El canvas queda libre de FABs y cumple `ui-forja` item I.1.
- La funcionalidad de captura y ledger se conserva en desarrollo.
- La superficie visible de comandos queda centralizada en command palette.
- Los tests E2E verifican ausencia de FABs y disponibilidad de comandos.
