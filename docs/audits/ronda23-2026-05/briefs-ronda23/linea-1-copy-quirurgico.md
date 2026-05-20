# Línea 1 — Copy quirúrgico no-OPL

## Misión

Cerrar 9 hallazgos del audit que son cambios estrictos de copy, microcopy o ícono, sin tocar reglas semánticas del modelo ni OPL canónico.

## Items que cierra

1. **#1** Tildes castellanas en strings JSX (`proximamente`, `accion`, `sistemico`, `funcion`, `guiara`, `automatico`, `podras`, `mas`, `Cual`, `espanol`).
2. **#3** Eliminar duplicado "Abrir gestión del árbol OPD" en command palette (Ctrl+D dos veces).
3. **#4** Reescribir descripciones del palette donde description == título.
4. **#5** Ocultar botón "AI BETA · proximamente (beta)" del panel OPL (vaporware).
5. **#9** Cambiar `"N issues"` → `"N sugerencia/s"` con concordancia. SOLO render, no variable interna.
6. **#10** Unificar mini-toolbar: "Inzoom (descomposición)" → "Descomponer", "Unfold (despliegue)" → "Desplegar".
7. **#12** Reemplazar ícono "···" como cierre del inspector por algo semántico.
8. **#13** Cambiar ícono `⌘` del bottom nav mobile (OPDs) por algo semántico.
9. **#14** Placeholders del inspector: `{alias}` → `"ej: cliente"`, `[unidad]` → `"ej: kg"`.

## Archivos permitidos

- `app/src/ui/panelOpl/Toolbar.tsx` (AI BETA)
- `app/src/ui/CommandPalette.tsx` (dedup + descripciones)
- `app/src/ui/BarraHerramientasElemento.tsx` (mini-toolbar)
- `app/src/ui/PanelDiagnostico.tsx` (conteo display)
- `app/src/ui/InspectorEntidad.tsx` (placeholders)
- `app/src/ui/Inspector.tsx` (icono cierre)
- `app/src/ui/asistente/Etapa*.tsx` (tildes — preservar estructura)
- `app/src/ui/mobileReviewPort/*.tsx` (icono OPDs)

## NO tocar

- `app/src/leyes/opl*.ts`, `app/src/modelo/opl*.ts` (OPL canónico)
- `app/src/modelo/validaciones.ts`, `diagnostico.ts` (L2)
- `Asistente.tsx`, `creacionWizard.ts` (L3)
- Variables `issues` en TS (solo render)
- IDs de reglas

## Commits sugeridos

```
fix(copy): tildes castellano en strings de UI (ronda23/L1 #1)
fix(palette): elimina duplicado abrir-arbol-opd y reescribe descripciones (ronda23/L1 #3 #4)
chore(opl): oculta boton AI Text hasta que la feature funcione (ronda23/L1 #5)
fix(diagnostico): concordancia plural N sugerencias en panel (ronda23/L1 #9)
style(toolbar): renombra Inzoom/Unfold a Descomponer/Desplegar (ronda23/L1 #10)
fix(inspector): reemplaza icono cierre y placeholders ejemplificados (ronda23/L1 #12 #14)
style(mobile): icono OPDs semantico en bottom nav (ronda23/L1 #13)
```
