# Inventario v2 de historias de usuario

**Fecha**: 2026-05-03
**Versión**: v2.1.0 (post-remediación categorial)
**Estado**: validado por linter (12 invariantes), 0 violaciones, 0 huérfanas v1→v2.

## Estructura

```
historias-usuario-v2/
├── 00-METODOLOGIA.md             # precedencia, formato HU, idioma, citas, ciclo
├── 01-GLOSARIO-NORMATIVO.md      # vocabulario único ES SSOT
├── 02-MODELO-DATOS.md            # documenta app/src/modelo/tipos.ts
├── 03-PATRONES-TRANSVERSALES.md  # índice de las 9 HU shared
├── 04-MAPA.md                    # índice de épicas + matriz inversa SSOT
├── 05-ROADMAP.md                 # cortes MVP α/β/γ/δ
├── 06-PROVENANCE.md              # linaje v1 → v2
├── shared/                       # 9 HU compartidas
├── epicas/                       # 48 épicas refactorizadas
└── tools/                        # herramientas verificadoras
    ├── validate-hu.ts            # linter (12 invariantes locales y globales)
    ├── grafo-dependencias.ts     # genera grafo DOT + métricas
    ├── audit-migracion.ts        # auditoría drift v1 → v2
    ├── grafo-deps-epicas.dot     # grafo inter-épica (Graphviz)
    ├── grafo-deps-detalle.dot    # grafo intra-HU
    ├── metricas-centralidad.md   # centralidad por épica
    └── reporte-migracion.md      # cobertura v1 → v2 por épica
```

## Cómo navegar

- Para entender el estándar: `00-METODOLOGIA.md`.
- Para vocabulario: `01-GLOSARIO-NORMATIVO.md`.
- Para encontrar una épica: `04-MAPA.md`.
- Para entender un patrón transversal: `03-PATRONES-TRANSVERSALES.md` y `shared/HU-SHARED-NNN-*.md`.

## Cómo verificar

```bash
# Linter completo (debe imprimir "Violaciones: 0")
bun run tools/validate-hu.ts

# Auditar avance real contra app y actualizar dashboard/ledger
node tools/progress-dashboard.mjs --sync-real

# Regenerar dashboard desde el ledger vigente sin reescanear codigo
node tools/progress-dashboard.mjs

# Generar grafo de dependencias y métricas de centralidad
bun run tools/grafo-dependencias.ts

# Auditar drift v1 → v2
bun run tools/audit-migracion.ts

# Renderizar el grafo (requiere graphviz)
dot -Tsvg tools/grafo-deps-epicas.dot -o /tmp/grafo-epicas.svg
```

## Invariantes verificados por el linter

### Locales (por HU canónica viva)

| ID | Invariante |
|---|---|
| L01 | Frontmatter homogéneo y completo. |
| L02 | Conteo `### HU-` consistente con `hu_emitidas`. |
| L03 | Campo `**Tipo:**` en `{opm-semantica, opcloud-ui, mixto}`. |
| L04 | HU `opm-semantica` con cita SSOT. |
| L05 | Terminología prohibida ausente del cuerpo. |
| L06 | Modelo de datos solo con raíces declaradas. |
| L07 | Dependencias apuntan a HU canónicas vivas. |
| L08 | Cada cita SSOT existe en el corpus. |
| L09 | Sin preguntas abiertas embebidas. |

### Globales (sobre el grafo del inventario)

| ID | Invariante | Lectura categorial |
|---|---|---|
| G01 | Aciclicidad de `Bloqueada por`. | `urn:fxsl:kb:icas-composicion` (asociatividad) |
| G02 | HU M0 no depende de HU no-M0. | `urn:fxsl:kb:icas-enriquecimiento` (preorden) |
| G03 | HU shared con transversalidad ≥ 3. | `urn:fxsl:kb:icas-universales` (universalidad) |
| G04 | Drift Spec↔Code controlado. | `urn:fxsl:kb:icas-lifecycle` (naturalidad) |
| G07 | `Patrones aplicados:` apunta a shared existente. | `urn:fxsl:kb:icas-comparacion` |
| G08 | Stubs declaran canónica explícita y existente. | `urn:fxsl:kb:icas-adjunciones` |
| G12 | `hu_canonicas`/`hu_stubs` del frontmatter coincide con la realidad. | `urn:fxsl:kb:icas-lifecycle` (consistencia) |

## Resumen cuantitativo

| Métrica | Valor |
|---|---:|
| Épicas | 48 |
| HU canónicas (en épicas) | 1.117 |
| HU shared | 9 |
| Stubs (absorbidas/fusionadas) | 48 |
| HU del v1 cubiertas en v2 | 1.164 / 1.164 (100%) |
| HU huérfanas v1→v2 | 0 |
| Violaciones de invariantes | 0 |
| Líneas totales de markdown | ~13.000 |

## Cambios vs v1

- Modelo de datos alineado al código vivo (`app/src/modelo/tipos.ts`).
- Terminología 100% ES SSOT en cuerpo (linter rechaza prohibiciones).
- 9 HU shared con HU-SHARED-003 formalizada como sheaf de permisos y HU-SHARED-007 con bisimulación coalgebraica canvas↔OPL-ES.
- IDs HU-NN.NNN inmutables; absorciones por stub con redirección verificada.
- Citas SSOT obligatorias y verificables por linter.
- Criterios Gherkin testeables.
- Aciclicidad de dependencias verificada.
- Conformidad de prioridad verificada (M0 no depende de no-M0).
- Cobertura completa v1 → v2 (0 huérfanas).

Ver `06-PROVENANCE.md` para detalle del linaje y `tools/reporte-migracion.md` para cobertura por épica.
