# Línea 4 — Inspector tabs + focus

## Misión

Separar semántica vs presentación en el inspector. Default brutal extendido: crear → focus auto en input Nombre.

## Items que cierra

1. **#11** Mover Tamaño/Ancho/Alto/Ajustar texto/Volver auto del tab Refinamiento al tab Estilo.
2. **#15** Focus automático en input Nombre del inspector al crear objeto/proceso desde toolbar.

## Mecanismo elegido (Opción A — bus en store)

- Campo `solicitarFocusNombre: Id | null` en `OpmStore` (slice UI).
- `crearObjetoDemo`/`crearProcesoDemo` lo setean junto a la selección.
- `useEffect` en `InspectorEntidad` matchea por `entidad.id`, dispara `focus()` + `select()` en `requestAnimationFrame`, luego invoca `consumirFocusNombre()`.

## Subproblema resuelto: atajos globales con input focuseado

El sistema global de atajos trata cualquier `HTMLInputElement` focuseado como contexto `modal-input` y descarta atajos (salvo Esc/Enter). Sin mitigación, focuseo automático rompía Ctrl+Z, Ctrl+S, Delete.

Solución local: helper `reenviarComboGlobalDesdeInput` en `onKeyDown` del input intercepta combos Ctrl/Meta+X y Delete puro, los re-dispatcha al `window` con `composed:true`. Target del evento clonado es window → registry global resuelve. Tipeo y navegación intactos.

## Archivos permitidos

- `app/src/ui/InspectorEntidad.tsx` (move SeccionTamano + ref/onKeyDown/useEffect)
- `app/src/store/tipos.ts` (`solicitarFocusNombre: Id | null`)
- `app/src/store/sliceTypes.ts`
- `app/src/store/uiPanel.ts`
- `app/src/store/modelo/acciones-entidad.ts` (emite señal)
- `app/e2e/inspector-focus.spec.ts` (nuevo, 4 tests)

## NO tocar

- panelOpl, CommandPalette, BarraHerramientasElemento, PanelDiagnostico (L1)
- validaciones, diagnostico (L2)
- asistente, Bienvenida, creacionWizard, EstadoVacioOpm (L3)
- OPL templates ni `leyes/`

## Decisiones bloqueadas

- Sigue siendo 5 tabs (Semántica/Enlaces/Refinamiento/Apariciones/Estilo).
- Tamaño pertenece a Estilo.
- Input Nombre se enfoca Y selecciona el texto por default.

## Commits sugeridos

```
refactor(inspector): mueve seccion Tamano de Refinamiento a Estilo (ronda23/L4 #11)
feat(inspector): focus automatico en input Nombre al crear elemento (ronda23/L4 #15)
test(inspector): cubre focus default y nueva ubicacion de Tamano (ronda23/L4)
```
