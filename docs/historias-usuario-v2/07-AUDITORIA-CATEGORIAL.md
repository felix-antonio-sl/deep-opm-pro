---
titulo: "Auditoría categorial — estado del inventario v2 post-remediación"
fecha: 2026-05-03
estado: "convergido"
metodo: "cat-thinking skill (24 URNs ICAS-BoK)"
---

## 1. Propósito

Documenta el estado del inventario v2 tras la remediación iterativa guiada por análisis categorial. Anclado a `urn:fxsl:kb:icas-sintesis` y específicas según aplica.

Este es el reporte **post-remediación** (Iter 5, convergencia). El reporte original de auditoría categorial 360° produjo recomendaciones R1–R8; aquí se documenta cuáles se aplicaron y cuáles se declararon fuera de alcance con justificación.

## 2. Estado de cada recomendación original

| ID | Recomendación | Estado | Artefacto |
|---|---|---|---|
| R1 | Linter de invariantes globales | ✓ APLICADO | `tools/validate-hu.ts` (12 invariantes) |
| R2 | Grafo de dependencias renderizado | ✓ APLICADO | `tools/grafo-dependencias.ts`, `tools/grafo-deps-*.dot`, `tools/metricas-centralidad.md` |
| R3 | Demover/justificar shared sub-instanciados | ✓ VERIFICADO (todas pasan umbral 3) | linter G03 |
| R4 | Reformular HU-SHARED-003 como sheaf | ✓ APLICADO | `shared/HU-SHARED-003-permisos-readonly.md §4` |
| R5 | Bisimulación canvas↔OPL-ES verificable | ✓ APLICADO | `shared/HU-SHARED-007-eco-opl.md §4` |
| R6 | Auditoría drift v1→v2 | ✓ APLICADO (0 huérfanas) | `tools/audit-migracion.ts`, `tools/reporte-migracion.md` |
| R7 | Sub-tipos para `mixto` | ⊘ FUERA DE ALCANCE | (ver §5.1) |
| R8 | CI hook co-evolución | ⊘ FUERA DE ALCANCE | (ver §5.2) |

## 3. Invariantes verificables instalados

### 3.1 Locales (por HU canónica viva)

L01–L09 capturan las propiedades de cada HU individual: frontmatter, tipo válido, citas SSOT, terminología prohibida, modelo de datos, dependencias canónicas, citas existentes, sin preguntas embebidas. Cita `urn:fxsl:kb:icas-preservacion` (funtor `Cite` faithful) y `urn:fxsl:kb:icas-comparacion` (sin drift terminológico).

### 3.2 Globales (sobre el grafo del inventario)

| ID | Invariante | URN | Lectura |
|---|---|---|---|
| G01 | Aciclicidad de `Bloqueada por:` | `urn:fxsl:kb:icas-composicion` | asociatividad y well-foundedness |
| G02 | Conformidad de prioridad | `urn:fxsl:kb:icas-enriquecimiento` | preorden compatible con composición |
| G03 | Universalidad shared (umbral ≥ 3) | `urn:fxsl:kb:icas-universales` | colímites con factorización mínima |
| G04 | Drift Spec↔Code | `urn:fxsl:kb:icas-lifecycle` | naturalidad entre `Spec` y `Code` |
| G07 | `Patrones aplicados` apunta a shared existente | `urn:fxsl:kb:icas-comparacion` | no hay transformaciones naturales fantasma |
| G08 | Stub apunta a canónica viva | `urn:fxsl:kb:icas-adjunciones` | stub ⊣ canónica con counit definida |
| G12 | Conteos en frontmatter coinciden con realidad | `urn:fxsl:kb:icas-lifecycle` | no hay drift en metadatos |

## 4. Lecturas categoriales formalizadas

### 4.1 Sheaf de permisos (HU-SHARED-003)

`urn:fxsl:kb:icas-topoi`. El espacio de superficies UI se modela como sitio `Surf` con cubiertas dadas por dependencias funcionales. El presheaf `P_u: Surf^op → Lattice` asigna a cada superficie el permiso efectivo del usuario `u`. La condición de pegado garantiza propagación coherente cuando el AM cambia un permiso. Cinco invariantes verificables (idempotencia, conmutatividad, pegado superior, pegado inferior, atomicidad) convierten lo que era heurística disciplinada en propiedad testeable.

### 4.2 Bisimulación coalgebraica canvas↔OPL-ES (HU-SHARED-007)

`urn:fxsl:kb:icas-efectos`. Se exhibe coalgebra `α: M → F(M)` con `F(M) = Canvas_render(M) × OPL_oraciones(M)`. La relación bisimilar `R ⊆ M × M` se define como `(M_1, M_2) ∈ R ⟺ F(M_1) = F(M_2)`. Diez invariantes (INV-1..INV-10) listados son testeables como `bun:test`: estilo no afecta semántica, imagen no afecta semántica, renombrado propaga, descomposición preserva entidad única, idempotencia, etc.

### 4.3 Funtor `Migrate: SpecV1 → SpecV2`

`urn:fxsl:kb:icas-lifecycle §Versionado como transformación natural`. El funtor de migración se evidencia por `tools/audit-migracion.ts`: 1.164 HU del v1 → 1.117 canónicas + 48 stubs en v2 (cobertura 100%, 0 huérfanas). Funtor faithful sobre todas las épicas.

## 5. Recomendaciones declaradas fuera de alcance

### 5.1 R7 — Sub-tipos para `mixto`

**Recomendación original**: refinar el coproducto `{opm-semantica, opcloud-ui, mixto}` con sub-tipos `mixto-extension`, `mixto-runtime`, etc.

**Decisión**: heurística disciplinada actual es suficiente. El refinamiento sin código consumidor sería **sobre-formalización** (`urn:fxsl:kb:icas-patrones §heuristicas vs metodos formales`).

**Reactivar si**: aparece patrón de uso que requiere distinción operacional (ej. tooling distinto para `mixto-extension` vs `mixto-runtime`).

### 5.2 R8 — CI hook co-evolución SSOT/tipos.ts/v2

**Recomendación original**: hook git pre-push que rechaza cambios en `tipos.ts` sin actualizar `02-MODELO-DATOS.md`, y cambios en SSOT que invaliden citas existentes.

**Decisión**: requiere infra externa al inventario documental (CI/git hooks). Fuera de alcance documental. La verificación local `tools/check-all.sh` permite ejecutarla manual o desde un CI futuro.

**Reactivar si**: se establece pipeline de CI para deep-opm-pro y se escribe el job de validación.

### 5.3 Stack undo como cofree comonad

**Comentario**: `urn:fxsl:kb:icas-agencia` y `urn:fxsl:kb:icas-efectos` permiten leer `HU-SHARED-002` como cofree comonad sobre el funtor de operaciones. Lectura útil pedagógicamente, pero exigir construcción explícita sin ganancia operacional sería sobre-formalización. Se mantiene como heurística disciplinada documentada.

### 5.4 Modos simulación/edición como free monad / cofree comonad

**Comentario**: EPICA-B0 introduce alternancia de modos. Cita: `urn:fxsl:kb:icas-agencia §pattern runs on matter`. Reformular formalmente exigiría construir el free monad de planes y la cofree comonad de canvas; el costo intelectual es alto y el valor para la fase actual del producto es bajo. Se deja anotado para Fase post-MVP.

## 6. Verificación de convergencia

Ejecutar:

```bash
bash docs/historias-usuario-v2/tools/check-all.sh
```

Salida esperada:

```
Linter:    rc=0
Migración: rc=0
Grafo:     rc=0
Todo pasa
```

## 7. Iteraciones de remediación

| Iter | Acción principal | Violaciones encontradas | Violaciones tras remediar |
|---|---|---:|---:|
| 0 (v2 inicial) | Linter mínimo (8 invariantes) | 0 | 0 |
| 1 | Linter expandido (G01–G06) | 25 | 0 (tras corrección masiva de prioridades) |
| 2 | Verificadores G07/G08 | 1 | 0 |
| 3 | Verificador G12 (conteos) | 12 | 0 (tras corregir frontmatters) |
| 4 | Reformulación sheaf + bisimulación | 0 | 0 |
| 5 | Auditoría final | 0 | 0 |

## 8. Distinción formal vs heurístico (post-remediación)

**Formal y verificado por linter** (teorema/lema con prueba ejecutable):
- Funtor `Cite: Spec → SSOT_OPM` con citas existentes (L08).
- Funtor `Impl: Spec → Code` con dominio restringido a propuestas declaradas (G04).
- Funtor `Migrate: SpecV1 → SpecV2` faithful (audit-migración).
- Aciclicidad de la categoría `Spec` (G01).
- Compatibilidad de prioridad con composición (G02).
- Universalidad shared con umbral verificado (G03).
- Naturalidad de `Patrones aplicados` (G07).
- Adjunción stub ⊣ canónica con codomain válido (G08).

**Formal con invariantes documentados pero no automatizables aún**:
- Sheaf de permisos (HU-SHARED-003 §4): cinco invariantes documentados como tests pendientes.
- Bisimulación canvas↔OPL-ES (HU-SHARED-007 §4): diez invariantes documentados como tests pendientes.

**Heurístico disciplinado**:
- Stack undo como cofree comonad (HU-SHARED-002): lectura útil sin construcción exhibida.
- Modos simulación/edición como free/cofree (EPICA-B0): analogía documentada.
- Pilares 00-06 como objeto terminal del poset documental: heurística estructural.

## 9. Estado de convergencia

**Linter**: 0 violaciones sobre 12 invariantes.
**Migración**: 100% cobertura, 0 huérfanas.
**Sheaf y bisimulación**: formalizados con invariantes verificables documentados.
**Recomendaciones residuales**: R7 y R8 declaradas fuera de alcance con justificación.

El inventario está en **estado convergido** según los criterios categoriales aplicables. Cualquier remediación futura emerge cuando:

1. Se introducen nuevas HU (re-auditar con `check-all.sh`).
2. `app/src/modelo/tipos.ts` evoluciona (re-auditar G04).
3. Se implementan los tests de bisimulación / sheaf documentados (promueven heurísticas a teoremas verificables).
4. Aparece presión real para R7 o R8 (datos de uso, infra de CI).
