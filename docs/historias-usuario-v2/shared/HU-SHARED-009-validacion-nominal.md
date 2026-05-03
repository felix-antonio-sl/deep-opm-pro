---
id: "HU-SHARED-009"
titulo: "Validación nominal (unicidad y normalización)"
fecha: 2026-05-03
estado: "activo"
tipo_patron: "transversal-kernel"
absorbe: ["HU-1C.007", "HU-1C.012"]
---

## 1. Problema que resuelve

La validación de nombres se distribuye entre HU-1C.012 (colisión nominal en creación), HU-1C.007/010 (renombrado), HU-50.NNN (nombres únicos en panel OPL), HU-13.NNN (estados con nombre único). Cada una declara su propia regla. Este patrón canoniza el contrato.

## 2. HU canónica

### HU-SHARED-009 — Validación nominal

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario.
**Superficie UI:** diálogos, edición inline.
**Gesto canónico:** ninguno explícito; la validación se invoca por kernel.

**Historia:**
> Como modelador, quiero que el sistema rechace o normalice nombres que romperían la unicidad o la legibilidad del modelo, recibiendo aviso claro de la razón.

**Contexto de negocio:**
La SSOT [Glos 3.76] exige que cada cosa tenga un nombre. La unicidad por tipo es necesaria para que la OPL sea inequívoca: dos procesos con el mismo nombre producirían oraciones ambiguas. La SSOT no prescribe la regla exacta de unicidad; este patrón la fija.

**Criterios de aceptación:**
- **Dado** que se intenta nombrar una entidad nueva o renombrar una existente, **cuando** la validación se ejecuta, **entonces** se aplican estas reglas en orden:
  1. **Trim** de espacios laterales.
  2. **Colapso** de espacios múltiples internos a uno solo.
  3. Si "Auto Format" está activado, **capitalización title-case** (Primera Letra Mayúscula); si está desactivado (HU-10.006), preservar exactamente.
  4. **Verificación de no vacío**: nombre normalizado debe tener ≥ 1 carácter no-espacio. Si vacío → error.
  5. **Verificación de unicidad** por tipo dentro del scope (ver §3): comparación case-insensitive sobre el nombre normalizado.
  6. **Verificación de longitud**: ≤ 200 caracteres. Si excede → error.
- **Dado** que el nombre colisiona con otra entidad del mismo tipo, **cuando** estoy en creación inicial con nombre por defecto, **entonces** se aplica sufijo serial automático: `Un Proceso 2`, `Un Proceso 3`, etc., usando `modelo.nextSeq`.
- **Dado** que el nombre colisiona con otra entidad del mismo tipo, **cuando** estoy en renombrado explícito, **entonces** la operación falla con mensaje "Ya existe un proceso/objeto con ese nombre".
- **Dado** que el nombre es válido, **cuando** confirmo, **entonces** la validación retorna `Resultado.ok` con el nombre normalizado.
- **Dado** que el nombre es inválido, **cuando** confirmo, **entonces** la validación retorna `Resultado.error` con mensaje legible.

**Reglas y restricciones:**
- La normalización es idempotente: aplicar dos veces produce el mismo resultado.
- La comparación de unicidad usa lowercase + colapso de espacios para que "Un Proceso" y "un proceso" se consideren colisión.
- Caracteres unicode permitidos: letras, dígitos, espacios, guiones, paréntesis, signos de puntuación comunes.
- Caracteres prohibidos: caracteres de control, tabulaciones, saltos de línea.
- La regla de unicidad **no aplica entre tipos**: un objeto y un proceso pueden compartir nombre.
- La regla de unicidad para estados es local al objeto que los contiene, no global.
- La regla de unicidad para OPDs es local al modelo.

**Modelo de datos tocado:**
- `entidad.nombre` — string normalizado.
- `modelo.nextSeq` — incremento monotónico para sufijo serial.

**Dependencias:**
- Bloquea a: HU-10.001 (creación con default), HU-10.003 (nombrado con popup), HU-SHARED-004 (renombrado).
- Bloqueada por: HU-10.001/002 (existencia de entidades para verificar colisión).

**Integraciones:**
- HU-SHARED-004 (renombrado).
- HU-10.001, HU-10.002 (creación con sufijo serial).

**Notas de evidencia:**
- Fuente normativa: [Glos 3.76] cosa nombrada.
- Fuente OPCloud: serialización observable.
- Clase de afirmación: inferido + canonizado.

**Prioridad:** M0.
**Tamaño:** M.
**Etiquetas:** [kernel, transversal, validacion, nombres].

## 3. Scopes de unicidad

| Elemento | Scope | Regla |
|---|---|---|
| `entidad` (objeto/proceso) | modelo | Único por `entidad.tipo` dentro del modelo. |
| `estado` | objeto | Único dentro del objeto que los contiene. |
| `opd` | modelo | Único en `modelo.opds`. |
| `enlace.etiqueta` | — | No requiere unicidad; vacía por defecto. |
| `estereotipo` `[propuesta]` | modelo | Único por nombre de estereotipo. |

## 4. Mensajes de error canónicos

```
NombreVacio          : "El nombre no puede estar vacío."
NombreDemasiadoLargo : "El nombre excede 200 caracteres."
CaracterInvalido     : "El nombre contiene caracteres no permitidos."
ColisionNominal      : "Ya existe un {tipo} con el nombre «{nombre}»."
```

## 5. HU absorbidas

- `HU-1C.012` — Sufijo serial al colisionar con default.
- `HU-1C.007` — Detectar colisión al renombrar (variante).
- (Otras detectadas durante la refactorización.)
