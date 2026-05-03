---
titulo: "Patrones transversales — índice de HU shared"
fecha: 2026-05-03
estado: "activo"
---

## 1. Propósito

Catálogo de las 9 HU shared del inventario v2. Cada HU shared captura un patrón que aparece en 5 o más épicas y se canoniza con un solo contrato. Las HU específicas que aplican el patrón se convierten en stubs con redirección + especialización local.

## 2. Catálogo de patrones

| ID | Título | Tipo | Capa | HU absorbidas (resumen) |
|---|---|---|---|---|
| **HU-SHARED-001** | [Menú contextual unificado](shared/HU-SHARED-001-menu-contextual.md) | UI | U | HU-10.019, HU-10.020, HU-12.001, HU-13.005 (varias), HU-17.NN, HU-20.011, HU-31.026, HU-32.007, HU-A1.001 |
| **HU-SHARED-002** | [Pila de deshacer / rehacer](shared/HU-SHARED-002-undo-redo.md) | Kernel | K | HU-90.008, HU-90.009 |
| **HU-SHARED-003** | [Permisos y modo read-only propagado](shared/HU-SHARED-003-permisos-readonly.md) | Kernel | K, U | EPICA-40 entera, HU-31.* (visibilidad), HU-32.* (sub-models), HU-30.036 |
| **HU-SHARED-004** | [Renombrar con validación nominal](shared/HU-SHARED-004-renombrar.md) | Kernel | K | HU-1C.007, HU-1C.010, HU-11.014, HU-13.004, HU-20.014 |
| **HU-SHARED-005** | [Eliminar con scope (apariencia/OPD/modelo)](shared/HU-SHARED-005-eliminar-con-scope.md) | Kernel | K | HU-11.021, HU-11.022, HU-1C.020, HU-1C.022, HU-31.010, HU-13.006 |
| **HU-SHARED-006** | [Estado dirty del modelo](shared/HU-SHARED-006-dirty-state.md) | Kernel | K | HU-10.022, HU-30.004 |
| **HU-SHARED-007** | [Eco OPL-ES sincronizado](shared/HU-SHARED-007-eco-opl.md) | Lente | L | HU-10.016, HU-50.007–015 (la mayoría), HU-A0.011 |
| **HU-SHARED-008** | [Selección y deselección de canvas](shared/HU-SHARED-008-seleccion-canvas.md) | UI | U | HU-11.005, HU-11.006 (selección múltiple) |
| **HU-SHARED-009** | [Validación nominal](shared/HU-SHARED-009-validacion-nominal.md) | Kernel | K | HU-1C.012 (sufijo serial), HU-1C.007 (colisión) |

## 3. Aplicación de un patrón

Una HU canónica que aplica un patrón shared lo cita explícitamente en `**Patrones aplicados:**`. Cuando la HU completa coincide con el patrón, se convierte en stub absorbido (ver `00-METODOLOGIA.md §7.1`).

Ejemplo de invocación inline en cuerpo de HU:

```markdown
**Patrones aplicados:**
- HU-SHARED-002 (entra al stack undo).
- HU-SHARED-003 (read-only bloquea).
- HU-SHARED-007 (panel OPL-ES emite oración).
```

## 4. Estadísticas de absorción

Reducción neta por consolidación con shared (estimado al cierre del v2):

| Categoría | HU absorbidas |
|---|---|
| Menú contextual (HU-SHARED-001) | ~18 stubs |
| Permisos (HU-SHARED-003) | ~30 stubs (mayoría EPICA-40) |
| Eco OPL (HU-SHARED-007) | ~12 stubs (mayoría EPICA-50) |
| Renombrar (HU-SHARED-004) | ~6 stubs |
| Eliminar (HU-SHARED-005) | ~8 stubs |
| Selección canvas (HU-SHARED-008) | ~4 stubs |
| Otros | ~5 stubs |
| **Total stubs** | **~83** |

(Más fusiones intra-épica como HU-10.005 ⊂ HU-10.003.)

## 5. Cuándo crear una nueva HU shared

Criterios:
- El patrón aparece en ≥ 5 épicas distintas con la misma mecánica.
- Existe un contrato común (entradas, salidas, invariantes) reutilizable.
- La duplicación documental introduce inconsistencia.

Si el patrón aparece en 2-4 épicas, mejor referenciar entre ellas con cross-link sin crear shared.
