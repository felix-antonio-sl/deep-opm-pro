---
id: "HU-SHARED-003"
titulo: "Permisos y modo read-only propagado"
fecha: 2026-05-03
estado: "activo"
tipo_patron: "transversal-kernel-ui"
absorbe: []
---

## 1. Problema que resuelve

250+ menciones a "permisos / read-only" se distribuyen en EPICA-40 (colaboración), EPICA-80 (config user/org), EPICA-31/32/35 (persistencia). No existe HU canónica que defina cómo el modo read-only se **propaga** a todas las superficies (canvas, paneles, menús, diálogos, atajos), cómo se calcula el permiso efectivo a partir de la matriz de permisos, ni cómo se distinguen los permisos por modelo de los permisos por organización.

Esta HU canoniza el cálculo del permiso efectivo y la regla de propagación.

## 2. HU canónica

### HU-SHARED-003 — Permisos y modo read-only propagado

**Actor primario:** RV (revisor / consumidor read-only).
**Actores secundarios:** ME, MN, AM, AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** K primario (cálculo del permiso); U secundario (propagación visual).
**Superficie UI:** todas las superficies.
**Gesto canónico:** ninguno explícito; el modo se aplica al cargar el modelo y se actualiza al cambiar permisos.

**Historia:**
> Como revisor con permiso de solo lectura, quiero que ninguna acción de escritura sea invocable y se evidencie visualmente, para no intentar modificar lo que no puedo guardar.

**Contexto de negocio:**
Un modelo puede ser cargado con tres permisos efectivos: `owner` (escritura libre + admin), `writer` (escritura limitada), `reader` (solo lectura). El permiso efectivo se calcula como intersección de (a) permisos del modelo, (b) permisos del folder/workspace, (c) rol en la organización. La regla "el más restrictivo gana".

**Criterios de aceptación:**
- **Dado** que cargo un modelo, **cuando** se calcula mi permiso efectivo, **entonces** se aplica la fórmula `permisoEfectivo = min(permisoModelo, permisoFolder, rolOrg)` con orden `reader < writer < owner`.
- **Dado** que mi permiso efectivo es `reader`, **cuando** el canvas se renderiza, **entonces** todas las apariencias se muestran con cursor por defecto (no `move`); ningún elemento es arrastrable.
- **Dado** que mi permiso efectivo es `reader`, **cuando** abro un menú contextual (HU-SHARED-001), **entonces** solo aparecen acciones de lectura.
- **Dado** que mi permiso efectivo es `reader`, **cuando** invoco un atajo de escritura (`Ctrl+Z`, `Delete`, `Enter` en diálogo de creación), **entonces** la acción es no-op y un toast informa "Modo solo lectura".
- **Dado** que mi permiso efectivo es `reader`, **cuando** abro un diálogo de edición (renombrar, propiedades), **entonces** los campos están deshabilitados y el botón de aceptar está oculto.
- **Dado** que mi permiso efectivo es `reader`, **cuando** intento guardar, **entonces** la operación es no-op y el indicador de dirty state (HU-SHARED-006) no aparece.
- **Dado** que el AM cambia mi permiso a `writer` mientras el modelo está cargado, **cuando** ocurre la sincronización, **entonces** la UI se rerrenderiza con el nuevo permiso sin recargar el modelo.

**Reglas y restricciones:**
- El permiso efectivo se almacena en `ui.permisoEfectivo: "reader" | "writer" | "owner"`.
- Cualquier subsistema que ejecuta operación de escritura debe consultar `ui.permisoEfectivo` antes de actuar.
- En `reader`: HU-SHARED-002 stack está deshabilitado (sin escrituras posibles).
- En `writer`: el usuario puede editar pero no cambiar permisos ni eliminar el modelo.
- En `owner`: acceso total.
- Cambios de permiso emiten evento que rerrenderiza menús, toolbars y atajos.

**Modelo de datos tocado:**
- Estado UI: `ui.permisoEfectivo: "reader" \| "writer" \| "owner"` — transitorio.
- `[propuesta]` `permiso.modeloId`, `permiso.actorId`, `permiso.nivel` — persistente; vive en backend o IndexedDB.

**Dependencias:**
- Bloquea a: HU-SHARED-001, HU-SHARED-002, HU-SHARED-005, HU-SHARED-006, y cualquier HU de escritura.

**Integraciones:**
- EPICA-40, EPICA-80 son los "orquestadores" del cambio de permiso. Esta HU es el "cliente" que reacciona.

**Notas de evidencia:**
- Fuente OPCloud: matriz O/W/R observada en sandbox y `opcloud-reverse/40-colaboracion-permisos.md`.
- Clase de afirmación: observado + canonizado.

**Prioridad:** M1 (post-MVP local single-user); M0 cuando se habilite multiusuario.
**Tamaño:** L.
**Etiquetas:** [kernel, ux, transversal, permisos, read-only, seguridad].

## 3. Tabla de propagación

| Superficie | En `reader` | En `writer` | En `owner` |
|---|---|---|---|
| Canvas: arrastrar | Bloqueado | Habilitado | Habilitado |
| Canvas: doble clic crear | Bloqueado | Habilitado | Habilitado |
| Menú contextual | Solo acciones de lectura | Acciones de escritura visibles | Todas |
| Diálogos de edición | Deshabilitados | Habilitados | Habilitados |
| Atajos de escritura | No-op + toast | Funcionan | Funcionan |
| Stack undo/redo | Stack vacío y oculto | Funciona | Funciona |
| Botón guardar | Oculto | Visible | Visible |
| Indicador dirty | Oculto | Funciona | Funciona |
| Compartir / cambiar permisos | Oculto | Oculto | Visible |
| Eliminar modelo | Bloqueado | Bloqueado | Visible (con confirmación) |

## 4. Lectura categorial — sheaf de permisos sobre superficies

Esta sección formaliza la propagación distribuida de permisos como **sheaf** sobre la categoría de superficies UI. Anclada a `urn:fxsl:kb:icas-topoi`.

### 4.1 Lattice de permisos

El espacio de permisos es un poset finito totalmente ordenado:

```
reader ≤ writer ≤ owner
```

El meet (`∧`) y el join (`∨`) son los operadores de orden. La regla "el más restrictivo gana" es el **meet**:

```
permisoEfectivo = permisoModelo ∧ permisoFolder ∧ rolOrg
```

Como meet de un lattice finito, esta operación es **asociativa, conmutativa, idempotente** y respeta la cota superior (`owner`). Estas son leyes verificables, no convenciones.

### 4.2 Sitio de superficies

Sea `Surf` la categoría cuyos objetos son las superficies UI ({canvas, menú-contextual, diálogo-edición, atajos, stack-undo, botón-guardar, indicador-dirty, modal-compartir, …}) y cuyos morfismos son las inclusiones funcionales (canvas ⊆ canvas+menú-contextual, etc.).

`Surf` actúa como **sitio**: cada superficie tiene una *cubierta* dada por las superficies que dependen de ella (la propagación natural cuando cambia un permiso).

### 4.3 Presheaf de permisos

Para cada usuario `u`, el presheaf `P_u : Surf^op → Lattice` asigna a cada superficie su permiso efectivo:

```
P_u(canvas)              = permisoEfectivo
P_u(menú-contextual)     = permisoEfectivo
P_u(diálogo-edición)     = permisoEfectivo
…
```

### 4.4 Condición de pegado (sheaf)

El presheaf `P_u` es **sheaf** sobre `Surf` si: dadas secciones locales `(p_i ∈ P_u(S_i))` en una cubierta `(S_i → S)` que coinciden en los solapamientos `(p_i|_{S_i ∩ S_j} = p_j|_{S_i ∩ S_j})`, existe una única sección global `p ∈ P_u(S)` cuya restricción a cada `S_i` da `p_i`.

**Operacionalización**: cuando el AM cambia el permiso del usuario `u` desde "writer" a "reader" mientras `u` tiene el modelo cargado, todas las superficies UI deben converger a "reader" coherentemente. Es decir:

- canvas: bloquea arrastre.
- menú-contextual: oculta acciones de escritura.
- diálogo-edición: deshabilita campos.
- atajos: convierte a no-op.
- stack-undo: vacía y oculta.
- botón-guardar: oculta.

La consistencia de estas restricciones simultáneas es exactamente la condición de pegado: las "secciones locales" de cada superficie son compatibles porque todas se derivan del mismo `permisoEfectivo` (por meet) calculado en el clasificador de subobjetos extendido del topos `Shv(Surf)`.

### 4.5 Morfismo geométrico al cambiar permisos

Un cambio de permiso `permisoModelo: writer → reader` induce un **morfismo geométrico** `f: Shv(Surf)_writer → Shv(Surf)_reader` con par adjunto `f^* ⊣ f_*`:

- `f^*` (imagen inversa): proyecta el permiso restrictivo a cada superficie, preservando límites finitos (la conjunción de permisos sigue siendo conjunción).
- `f_*` (imagen directa): "promueve" la sección reader como cota superior de las nuevas restricciones.

**Implicación práctica**: el cambio se propaga en una sola transacción que, por preservación de límites, no puede dejar la UI en estado inconsistente.

### 4.6 Test de conformidad (verificable)

Invariantes que un test de integración debe verificar:

1. **Idempotencia del meet**: aplicar el mismo cambio de permiso dos veces produce el mismo estado UI.
2. **Conmutatividad del meet**: el orden de evaluación (modelo → folder → rol) no cambia el resultado.
3. **Pegado**: tras cambio de permiso, ninguna superficie queda en un nivel inferior al `permisoEfectivo`.
4. **Pegado**: tras cambio de permiso, ninguna superficie queda en un nivel superior al `permisoEfectivo`.
5. **Atomicidad**: la propagación se aplica como una transacción única en la UI (no hay frame intermedio con estado mixto).

## 5. HU absorbidas

Lista viva. Cada épica de colaboración / persistencia que toca permisos absorbe sus HU específicas en este patrón:

- `HU-40.NNN` — todas las HU de "vista read-only en canvas".
- `HU-31.NNN` — visibilidad de folders por permiso.
- `HU-32.NNN` — sub-models en read-only heredado.
- `HU-35.NNN` — búsqueda restringida por permiso.
- `HU-30.NNN` — operaciones de save/restore filtradas por permiso.
- (Otras detectadas durante la refactorización.)
