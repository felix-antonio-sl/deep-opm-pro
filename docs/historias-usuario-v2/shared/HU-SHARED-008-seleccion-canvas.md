---
id: "HU-SHARED-008"
titulo: "Selección y deselección de elementos en canvas"
fecha: 2026-05-03
estado: "activo"
tipo_patron: "transversal-ui"
absorbe: ["HU-11.005", "HU-11.006"]
---

## 1. Problema que resuelve

Casi cualquier gesto de canvas requiere "elemento seleccionado" como precondición (menú contextual, alternar afiliación, eliminar, agregar estado). Las épicas asumen el patrón sin definirlo. Este patrón canoniza:

- Cómo se selecciona uno o varios elementos.
- Cómo se distingue visualmente el seleccionado.
- Cómo se deselecciona.
- Qué entra como "elemento seleccionable" (entidad, apariencia, enlace, estado, sub-modelo).
- Multi-selección y rectángulo de selección.

## 2. HU canónica

### HU-SHARED-008 — Selección y deselección de canvas

**Actor primario:** MN, ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario.
**Superficie UI:** canvas-OPD.
**Gesto canónico:** clic, Ctrl+clic, arrastrar rectángulo en zona vacía.

**Historia:**
> Como modelador, quiero seleccionar uno o varios elementos del canvas con gestos consistentes para luego operar sobre ellos.

**Contexto de negocio:**
La SSOT no prescribe la afordancia de selección — es UI. OPCloud usa clic simple para seleccionar, Ctrl+clic para multi-selección, arrastre en vacío para rectángulo de selección. La canonización fija el contrato común a todas las épicas que asumen "elemento seleccionado".

**Criterios de aceptación:**
- **Dado** que clico una apariencia en el canvas, **cuando** la operación termina, **entonces** la apariencia queda seleccionada (cualquier selección previa se descarta) y se renderiza con borde resaltado.
- **Dado** que clico en zona vacía del canvas, **cuando** la operación termina, **entonces** toda selección previa se descarta.
- **Dado** que tengo una selección, **cuando** clico una apariencia con `Ctrl` (o `Cmd` en macOS), **entonces** la apariencia se agrega o quita de la selección sin afectar otras.
- **Dado** que arrastro desde zona vacía, **cuando** se forma un rectángulo y suelto, **entonces** todas las apariencias intersectadas por el rectángulo se seleccionan (se descarta selección previa, salvo si mantengo `Ctrl` durante el arrastre).
- **Dado** que tengo una selección, **cuando** presiono `Esc`, **entonces** toda selección se descarta.
- **Dado** que tengo elementos seleccionados, **cuando** los renderizado, **entonces** se les aplica un borde de selección (color y grosor por convención visual; ver §3).
- **Dado** que tengo elementos seleccionados, **cuando** invoco una operación (eliminar, alternar afiliación), **entonces** la operación se aplica a todos los seleccionados (cuando es semánticamente posible).
- **Dado** que el modo es read-only (HU-SHARED-003), **cuando** selecciono, **entonces** la selección funciona pero las acciones de escritura están ocultas.

**Reglas y restricciones:**
- Selección visual: borde de 2px, color azul `#3DA8FF` (compatibilidad con paleta JOYAS).
- La selección es estado UI transitorio (`ui.seleccionados: Id[]`), no persiste entre sesiones.
- Selección múltiple permitida solo entre elementos del mismo OPD.
- Operaciones masivas se aplican a la unión: alternar afiliación de 5 entidades aplica el cambio a las 5 (operación atómica con un solo entry en stack undo).
- Si una operación es inválida para algún elemento (ej. eliminar un agente cuando otro depende), la operación se aborta y se reporta el conflicto.

**Modelo de datos tocado:**
- `ui.seleccionados: Id[]` — transitorio (apariencias, no entidades).
- `ui.modoSeleccion: "simple" | "multi" | "rectangulo"` — transitorio.

**Dependencias:**
- Bloquea a: prácticamente todas las HU de gesto sobre canvas.

**Integraciones:**
- HU-SHARED-001 (menú contextual usa selección).
- HU-SHARED-005 (eliminar usa selección).
- HU-SHARED-002 (operaciones masivas entran como un solo undo).

**Notas de evidencia:**
- Fuente OPCloud: gestos observables en sandbox.
- Clase de afirmación: observado + canonizado.

**Prioridad:** M0.
**Tamaño:** M.
**Etiquetas:** [ux, transversal, canvas, seleccion].

## 3. Estilo visual de selección

| Estado | Borde | Sombra | Cursor |
|---|---|---|---|
| No seleccionado | color de tipo (verde lima objeto / cyan proceso) | sin halo | default |
| Seleccionado simple | mismo color + halo azul `#3DA8FF` 2px | sin sombra adicional | move |
| Multi-seleccionado | igual | igual | move |
| Hover (cursor encima, sin seleccionar) | mismo color + halo gris claro | sin sombra | pointer |

## 4. HU absorbidas

Lista viva. La mayoría de las HU específicas de "clic para seleccionar X" se absorben aquí.

- `HU-NN` — Seleccionar entidad para operar.
- `HU-NN` — Selección múltiple con `Ctrl+clic`.
- `HU-NN` — Selección por rectángulo.
- (Concretas a detectar al refactorizar cada épica.)
