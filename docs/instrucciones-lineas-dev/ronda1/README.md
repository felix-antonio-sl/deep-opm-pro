# Instrucciones de líneas de desarrollo paralelas

**Fecha**: 2026-05-04
**Base**: `main` @ commit `2887a09` — MVP-alpha consolidado
**Objetivo**: 5 líneas que avanzan en paralelo sobre tres ejes (procedural, estructural, UX de datos), apoyadas en HUv2 y `opm-extracted/`.

## 1. Filosofía operativa

- **No reinventar la rueda**: antes de inventar nada, consultar `assets/svg/`, `docs/JOYAS.md`, `opm-extracted/INDEX.md`, y `fixtures/`. La autoridad normativa es `opm-ssot-es`; OPCloud (vía `opm-extracted/`) operacionaliza pero no redefine semántica.
- **HU como contrato**: cada línea está anclada a HU específicas de `docs/historias-usuario-v2/`. No salirse del scope de esas HU sin justificación.
- **Aditividad**: estos cinco trabajos avanzan en paralelo. Cada uno debe entregar cambios **sólo aditivos** sobre el estado actual de `main`. No renombrar, no eliminar, no romper APIs públicas, no romper round-trip de JSON.
- **Loop verde obligatorio**: ninguna línea cierra sin `cd app && bun run check` verde. Si tocó UI: además `bun run browser:smoke`.

## 2. Reglas duras comunes (aplican a las 5 líneas)

1. **Cambios sólo aditivos** sobre el estado actual:
   - Tipos: extender uniones, añadir campos opcionales con default. Nunca renombrar campos.
   - Funciones: añadir parámetros con default; nunca cambiar firma existente.
   - JSON: campos nuevos deben ser opcionales y tener default al deserializar para que modelos persistidos previos sigan cargando.
2. **No tocar archivos fuera del scope declarado** en cada brief, incluso si parece útil. Si surge un cambio cross-line necesario, **detenerse y consultar** antes de hacerlo.
3. **Apoyarse en evidencia, no en imaginación**:
   - Markers de enlaces: SIEMPRE desde `assets/svg/links/{procedural,structural}/` vía `app/src/render/jointjs/linkAssets.ts`. Nunca redibujar.
   - Colores y dimensiones: `docs/JOYAS.md` (`#70E483` objetos, `#3BC3FF` procesos, `#586D8C` líneas, 135x60 default, Arial 14px semibold).
   - Plantillas OPL-ES: consultar `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md` y los ejemplos en `opm-extracted/_raw/` (búsqueda por verbo).
4. **Idiomas**: comunicación y documentación en es-CL; identificadores de código en inglés/español tal como ya están en el codebase. No introducir un tercer idioma.
5. **Test antes de cerrar**: cada línea agrega o extiende tests. Cobertura mínima por línea descrita en su brief.
6. **Commit en su rama de trabajo**: cada línea crea su commit (o serie corta de commits) antes de devolver el control. Mensaje en imperativo con prefijo `feat(...)` / `test(...)` / `refactor(...)` siguiendo el estilo de `git log`.

## 3. Stack y comandos

- Bun 1.3+, TypeScript strict, Preact 10 + Signals, Zustand 5, JointJS 3.7 core, Vite 6, Playwright.
- Working directory: `/home/felix/projects/deep-opm-pro`. Toda app vive en `app/`.

```bash
cd app

# Loop de verificación (obligatorio antes de cerrar línea)
bun run check          # typecheck + unit tests

# Verificación adicional para líneas de UI
bun run browser:smoke  # Playwright Chromium

# Si se introducen cambios pesados de render
bun run build          # vite build (warning JointJS esperado)

# Dev server para validación visual manual
bun run dev            # localhost:5173
```

## 4. Mapa de archivos por línea (ver tabla de colisiones)

| Archivo | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|
| `app/src/modelo/tipos.ts` | aditivo | — | — | — | aditivo |
| `app/src/modelo/operaciones.ts` | aditivo | — | — | — | — |
| `app/src/modelo/operaciones.test.ts` | aditivo | — | — | — | — |
| `app/src/modelo/constantes.ts` | aditivo | — | — | — | — |
| `app/src/opl/generar.ts` | aditivo | — | sólo bug-fix | aditivo | — |
| `app/src/opl/generar.test.ts` | aditivo | — | MAYOR | — | — |
| `app/src/store.ts` | — | sólo lectura | — | aditivo | — |
| `app/src/main.tsx` | — | aditivo | — | — | — |
| `app/src/ui/App.tsx` | — | — | — | aditivo | — |
| `app/src/ui/Toolbar.tsx` | — | aditivo | — | — | — |
| `app/src/ui/Inspector.tsx` | aditivo | — | — | — | aditivo |
| `app/src/ui/PersistenciaJson.tsx` | — | aditivo | — | — | — |
| `app/src/ui/Dialogo.tsx` (NEW) | — | crear | — | — | — |
| `app/src/ui/Timeline.tsx` (NEW) | — | — | — | crear | — |
| `app/src/serializacion/json.ts` | — | — | — | — | aditivo |
| `app/src/serializacion/json.test.ts` | — | — | — | — | aditivo |
| `app/src/render/jointjs/linkAssets.ts` | aditivo | — | — | — | — |
| `app/src/render/jointjs/*` (otros) | — | — | — | — | aditivo |

**Colisiones esperadas y resolución**:
- `tipos.ts`: L1 y L5 ambos extienden tipos en regiones distintas → merge trivial.
- `Inspector.tsx`: L1 y L5 ambos agregan entradas de menú → merge trivial; conservar ambas.
- `opl/generar.ts`: L1 y L4 ambos extienden plantillas de verbos → casos disjuntos; merge trivial. L3 sólo edita si encuentra bug.

## 5. Protocolo de conciliación

Cuando las 5 líneas cierren, el patrón de fusión sugerido es **L3 → L2 → L4 → L1 → L5** (de menor a mayor riesgo de colisión, dejando estructurales/visuales para el final con la red de tests ya en `main`):

1. **L3 primero** (tests OPL): aporta red de seguridad para verificar que L1 y L4 no rompen plantillas existentes.
2. **L2** (UX seguridad): cero impacto en modelo/opl, sólo UI nueva — mergea sin tocar nada de las otras.
3. **L4** (timeline): toca `store.ts` y `opl/generar.ts` aditivamente; corre `bun run check` post-merge.
4. **L1** (despliegues estructurales): toca tipos+operaciones+opl. Esperable conflicto en `opl/generar.ts` (con L4) y `tipos.ts` (con L5) — ambos resolubles si los cambios son disjuntos.
5. **L5** (plegado parcial): última porque `tipos.ts` ya tendrá los cambios de L1; resolver merge de campos nuevos lado a lado.

Después de cada merge: `bun run check` + `bun run browser:smoke`. Si falla, parar y diagnosticar antes de seguir. No mergear "a ciegas".

## 6. Anclaje obligatorio a HUv2

Cada línea debe leer **al menos** las HU listadas en su brief antes de codificar. Las HU son contrato: si una decisión técnica entra en conflicto con criterios de aceptación, ganan los criterios. Si una HU es ambigua, ver "preguntas abiertas" al final de su épica y elegir el camino que minimiza retrabajo (documentarlo en el commit).

## 7. Brief por línea

| Línea | Brief |
|---|---|
| L1 | [linea-1-despliegues-estructurales.md](./linea-1-despliegues-estructurales.md) |
| L2 | [linea-2-seguridad-datos-ux.md](./linea-2-seguridad-datos-ux.md) |
| L3 | [linea-3-cobertura-opl-tests.md](./linea-3-cobertura-opl-tests.md) |
| L4 | [linea-4-timeline-paralelismo.md](./linea-4-timeline-paralelismo.md) |
| L5 | [linea-5-plegado-parcial.md](./linea-5-plegado-parcial.md) |
