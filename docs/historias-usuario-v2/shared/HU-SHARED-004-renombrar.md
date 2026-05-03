---
id: "HU-SHARED-004"
titulo: "Renombrar entidad con validación nominal"
fecha: 2026-05-03
estado: "activo"
tipo_patron: "transversal-kernel-ui"
absorbe: ["HU-1C.010", "HU-11.014"]
---

## 1. Problema que resuelve

Tres HU canónicas en v1 cubren el renombrado con colisión nominal en distintos contextos (entidad, estado, OPD). Cada una declara su propia regla de unicidad, su propia normalización y su propio tratamiento de colisión. La duplicación produce reglas inconsistentes (una usa case-insensitive, otra case-sensitive). Este patrón canoniza el contrato.

## 2. HU canónica

### HU-SHARED-004 — Renombrar con validación nominal

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categórico:** K primario (validación de unicidad); U secundario (diálogo).
**Superficie UI:** diálogo de nombre, edición inline.
**Gesto canónico:** doble clic sobre etiqueta o acción "Renombrar" en menú contextual.

**Historia:**
> Como modelador, quiero renombrar una entidad existente con la misma mecánica que al nombrarla por primera vez, recibiendo aviso si el nombre colisiona con otra entidad del mismo tipo.

**Contexto de negocio:**
La SSOT [Glos 3.76] exige que cada cosa tenga un nombre. Implícitamente exige unicidad por tipo dentro del modelo: dos procesos no pueden llamarse igual; un objeto y un proceso sí pueden compartir nombre. OPCloud lo implementa con un popup que aparece sobre la cosa al doble-clic. La validación nominal se delega a HU-SHARED-009.

**Criterios de aceptación:**
- **Dado** que selecciono una entidad y elijo "Renombrar", **cuando** la acción se invoca, **entonces** se abre el diálogo con el nombre actual preseleccionado.
- **Dado** que el diálogo está abierto, **cuando** escribo un nombre nuevo, **entonces** la validación nominal (HU-SHARED-009) se ejecuta en vivo y muestra un indicador (verde si válido, ámbar si advertencia, rojo si inválido).
- **Dado** que el nombre nuevo es válido, **cuando** confirmo con `Enter` o "Aceptar", **entonces** `entidad.nombre` se actualiza, el panel OPL-ES se sincroniza (HU-SHARED-007), el cambio entra al stack undo (HU-SHARED-002) y el diálogo se cierra.
- **Dado** que el nombre nuevo colisiona con otra entidad del mismo tipo (case-insensitive, normalizado), **cuando** confirmo, **entonces** se muestra un toast "Ya existe un proceso/objeto con ese nombre" y el foco vuelve al campo de texto.
- **Dado** que el diálogo está abierto, **cuando** cancelo (`Esc` o clic fuera), **entonces** el nombre original se mantiene y el diálogo se cierra sin emitir cambio.
- **Dado** que el modo es read-only (HU-SHARED-003), **cuando** intento renombrar, **entonces** el diálogo no se abre.

**Reglas y restricciones:**
- Unicidad por tipo: dos `entidad.tipo == "proceso"` no pueden tener el mismo `entidad.nombre` normalizado. Un objeto y un proceso pueden compartir nombre.
- Normalización de nombre para comparación: lowercase + trim de espacios laterales + colapso de espacios múltiples a uno.
- Si "Auto Format" está activado, el nombre se capitaliza con title-case al confirmar; si está desactivado (HU-10.006), se preserva exactamente como se escribió.
- El renombrado no afecta `entidad.id`.
- El renombrado no rompe enlaces existentes (referencian `id`, no `nombre`).

**Modelo de datos tocado:**
- `entidad.nombre` — string — persistente.

**Dependencias:**
- Bloquea a: cualquier HU que asuma renombrado uniforme.
- Bloqueada por: HU-10.001/002 (entidad existente).

**Integraciones:**
- HU-SHARED-002 (entra al stack undo).
- HU-SHARED-007 (panel OPL-ES se sincroniza).
- HU-SHARED-009 (validación nominal).
- HU-SHARED-006 (estado dirty se activa).

**Notas de evidencia:**
- Fuente normativa: [Glos 3.76] cosa nombrada.
- Fuente OPCloud: popup observable en sandbox.
- Clase de afirmación: inferido + canonizado.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [kernel, ui, transversal, renombrar, validacion-nominal].

## 3. Variantes contextuales

| Contexto | Diferencia respecto al patrón |
|---|---|
| **Estado dentro de objeto** | Unicidad: dos estados del mismo objeto no pueden tener mismo nombre. La validación es local al objeto. [V-... estado] |
| **OPD (árbol)** | Unicidad: dos OPDs del mismo modelo no pueden tener mismo nombre. |
| **Estereotipo aplicado** | Renombrar el alias del estereotipo, no el estereotipo en sí. |
| **Sub-modelo (referencia)** | Renombra solo la referencia local, no el modelo referenciado. |

## 4. HU absorbidas

- `HU-1C.007` — Detectar colisión nominal al renombrar entidad.
- `HU-1C.010` — Renombrar cosa actual.
- `HU-11.014` — Renombrar entidad seleccionada.
- `HU-13.NNN` — Renombrar estado (variante: scope local al objeto).
- `HU-20.NNN` — Renombrar OPD (variante: scope local al modelo).
