# Línea 3 — Asistente 9→3 + reemplazo modal bienvenida

## Misión

Eliminar el Tutorial Mountain del producto:

1. Modal de bienvenida con 3 caminos equivalentes → canvas precargado con ejemplo + banner inline descartar.
2. Asistente guiado de 9 etapas → 3 etapas obligatorias: **Función principal → Beneficiario → Sembrar**.

## Items que cierra

1. **#6** Asistente 9 → 3 etapas. Las 6 etapas eliminadas (Atributos/Entradas/Salidas/Herramientas/Ambientales/Confirmar) NO regresan; su funcionalidad existe en el inspector tras crear el modelo.
2. **#7** Modal bienvenida → canvas precargado con ejemplo (System Diagram) + banner descartar.

## Decisiones bloqueadas

- 9 → 3 es eliminación pura. No usar AI. Inputs determinísticos.
- Modal de bienvenida con 3 caminos NO regresa.
- Default `NOMBRE_SISTEMA_DEFAULT = "Mi sistema"`; renombre vive en inspector.

## Archivos eliminados

- `app/src/ui/asistente/Bienvenida.tsx`
- `app/src/ui/asistente/EtapaAmbientales.tsx`
- `app/src/ui/asistente/EtapaAtributo.tsx`
- `app/src/ui/asistente/EtapaConfirmar.tsx`
- `app/src/ui/asistente/EtapaEntradas.tsx`
- `app/src/ui/asistente/EtapaHandler.tsx`
- `app/src/ui/asistente/EtapaHerramientas.tsx`
- `app/src/ui/asistente/EtapaNombreSistema.tsx`
- `app/src/ui/asistente/EtapaSalidas.tsx`

## Archivo nuevo

- `app/src/ui/asistente/EtapaSembrar.tsx` (fusión de preview + confirm)

## Flujo nuevo

- **Usuario nuevo entra**: canvas precarga System Diagram (8 entidades + estados). Banner inline arriba: "Estás viendo un ejemplo: System Diagram. Empieza vacío o sembrá un modelo con el asistente cuando lo necesites." con botones [Asistente guiado] [Empezar vacío] [×].
- **"Empezar vacío"**: pestaña reemplazable se rebautiza al vaciar, banner se cierra.
- **"Asistente guiado"**: wizard de 3 etapas (Función → Beneficiario → Sembrar) con preview + botón "Sembrar modelo".

## NO tocar

- Archivos cerrados por L1 (panelOpl, CommandPalette, BarraHerramientasElemento, PanelDiagnostico, etc.)
- Archivos cerrados por L2 (validaciones, diagnostico, checkers)
- Archivos cerrados por L4 (Inspector, store/uiPanel, acciones-entidad, e2e/inspector-focus)

## Commits sugeridos

```
refactor(asistente): poda wizard de 9 a 3 etapas (funcion, beneficiario, sembrar) (ronda23/L3 #6)
feat(onboarding): precarga ejemplo system-diagram cuando workspace vacio (ronda23/L3 #7)
refactor(bienvenida): suprime modal por default y agrega banner descartar (ronda23/L3 #7)
test(asistente): reescribe tests para flujo de 3 etapas (ronda23/L3)
e2e: spec onboarding canvas precargado (ronda23/L3)
```
