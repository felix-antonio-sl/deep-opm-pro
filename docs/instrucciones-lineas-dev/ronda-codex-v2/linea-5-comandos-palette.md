# L5 — Comandos · palette único

## Misión
Hacer del command palette `⌘K` la **vía única de comandos**: convertir la hamburguesa `☰` en *trigger* del mismo palette (retirar el menú lateral paralelo), agregar navegación `⌘1…⌘9` a SD raíz/SDN, y hacer que las etiquetas de atajo respeten la plataforma. **Ola 2** (depende de que L2 haya retirado el mount del menú lateral en `App.tsx`).

Cierra: **CRÍT-Comandos** (hamburguesa+palette coexisten), **⌘1-9 ausente**, **atajos hard-coded a Ctrl** (display).

## Anclaje a evidencia
- Spec: `ui-forja/05-interactions.md` §1 (navegación, ⌘.), §2 (palette vía única), §9 (secciones CREAR/NAVEGAR).
- Estado actual:
  - `ui/MenuPrincipal.tsx:84-180` es un menú lateral de 7 secciones paralelo; `ui/CommandPalette.tsx` ya es fiel (6 secciones, fuzzy, rail crimson).
  - El botón `☰` en `ToolbarBase.tsx:307` abre `MenuPrincipal`; el botón Buscar abre el palette. L2 ya retira el menú lateral del montaje → tu trabajo es re-rutear `☰` al palette.
  - Motor de atajos `ui/atajosTeclado.ts:167` ya mapea `ctrlKey||metaKey`; `formatearCombo:83-94` muestra glifos mac. Etiquetas estáticas hard-coded en `MenuPrincipal.tsx:88-100` y `ToolbarBase.tsx:393` (`⌘ K` fijo — coordinar con L2).
  - Navegación OPD: `app/ports/globalShortcutsPort.ts:236-239` (padre/hijo por flechas); falta `Ctrl/⌘+1..9`.

## Archivos permitidos
```
app/src/ui/MenuPrincipal.tsx              EDIT (convertir a trigger del palette o retirar)
app/src/ui/CommandPalette.tsx             EDIT (sección NAVEGAR a SDN si falta)
app/src/app/ports/globalShortcutsPort.ts  EDIT (⌘1-9)
app/src/ui/atajosTeclado.ts               EDIT (si hace falta registrar combos)
app/src/ui/**/*.test.ts(x)                EDIT (los afectados)
ui-forja/05-interactions.md               LECTURA
app/src/ui/toolbar/ToolbarBase.tsx        LECTURA (la etiqueta ⌘K la migra L2)
```

## Restricciones de no-colisión
- **Ola 2**: arrancar desde `main` con L2 mergeada (menú lateral ya retirado del montaje de `App.tsx`). No editar `App.tsx` ni `ToolbarBase.tsx` (solo lectura; la etiqueta de atajo del botón Buscar la corrige L2).
- No tocar opl/, render/, Inspector*, tokens.ts.

## Slice mínimo shippeable
1. **Una vía de comandos**: el handler de `☰` invoca el command palette (no el menú lateral). `MenuPrincipal` deja de ser superficie paralela (retirado o reconvertido a launcher del palette).
2. **⌘1-9**: en `globalShortcutsPort.ts`, registrar `Ctrl/⌘+1..9` → ir a SD raíz / SDN; agregar items NAVEGAR correspondientes en el palette.
3. **Atajos plataforma**: las etiquetas estáticas restantes (en `MenuPrincipal` si sobrevive) usan `formatearCombo`, no literales `Ctrl+...`.

## Tests obligatorios
- Unit: `globalShortcutsPort` registra ⌘1-9 y navega; `☰` abre el palette.
- Smoke `e2e/` del command palette / menú verde.

## Verificación
```bash
cd app && bun run check && bun run lint
```

## Decisiones bloqueadas (no reabrir)
- `⌘K` es la vía de comandos; no dos superficies paralelas.
- El motor ya es plataforma-agnóstico: el fix de atajos es solo de *display*.

## Decisiones que tomas vos (documentar en commit)
- Retirar `MenuPrincipal` por completo vs reconvertirlo en un thin launcher del palette (preservando testids si specs dependen de ellos).
- Mapeo exacto de `⌘1..9` (1=SD raíz, 2..9=SDN en orden del árbol).

## Forma del entregable
- Commits `feat(ui): L5 ⌘K vía única — ☰ dispara el palette`, `feat(ui): navegación ⌘1-9 a SD/SDN`, `fix(ui): etiquetas de atajo por plataforma`.
