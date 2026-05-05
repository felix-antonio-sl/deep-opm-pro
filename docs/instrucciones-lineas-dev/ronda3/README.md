# Ronda 3 — Instrucciones de líneas de desarrollo paralelas

**Fecha**: 2026-05-05
**Base**: `main` @ commit `03bea55` — MVP-α + ronda 1 + ronda 2 cerradas
**Objetivo**: 5 líneas paralelas que avanzan los pendientes inmediatos del HANDOFF, ancladas en `docs/historias-usuario-v2/` y reutilizando sistemáticamente `opm-extracted/`.

## 1. Filosofía operativa

- **No reinventar**: antes de inventar, consultar `opm-extracted/INDEX.md`, `opm-extracted/MODULES.md`, `assets/svg/`, `docs/JOYAS.md`, `fixtures/`, y la SSOT canónica `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`. La autoridad normativa es la SSOT; OPCloud (vía `opm-extracted/`) operacionaliza pero no redefine semántica.
- **HU como contrato**: cada línea está anclada a HU específicas. No salirse del scope sin justificación documentada en commit.
- **Aditividad**: cambios solo aditivos sobre `main` actual. No renombrar, no eliminar APIs públicas, no romper round-trip de JSON. Modelos legacy deben cargar sin pérdida.
- **Modular por dominio**: privilegiar archivos nuevos disjuntos sobre expansión monolítica de `operaciones.ts` (ya en 1616/1700 LOC). Esta ronda prepara el terreno del refactor preventivo (pendiente 5 del HANDOFF) sin disparalo explícitamente.
- **Loop verde obligatorio**: ninguna línea cierra sin `cd app && bun run check` verde. Si tocó UI: además `bun run browser:smoke` verde.

## 2. Reglas duras comunes (aplican a las 5 líneas)

1. **Cambios solo aditivos**:
   - Tipos: extender uniones, añadir campos opcionales con default. Nunca renombrar campos existentes ni cambiar su tipo.
   - Funciones: añadir parámetros con default; nunca cambiar firmas existentes.
   - JSON: campos nuevos opcionales con default al deserializar; modelos persistidos previos deben seguir cargando sin pérdida.
2. **No tocar archivos fuera del scope declarado**. Si surge un cambio cross-line necesario, **detenerse y consultar**.
3. **Apoyarse en evidencia, no en imaginación**:
   - Markers de enlaces: SIEMPRE desde `assets/svg/links/{procedural,structural}/` vía `app/src/render/jointjs/linkAssets.ts`. Nunca redibujar marcadores de la SSOT.
   - Colores y dimensiones: `docs/JOYAS.md` y `opm-visual-es.md`.
   - Plantillas OPL-ES: `opm-opl-es.md` con cita literal en el commit.
4. **Reuso de `opm-extracted/` mandatorio**:
   - Antes de implementar regla, revisar `opm-extracted/src/app/models/consistency/behavioral.rules.ts` y `consistancy.model.ts`.
   - Antes de implementar enlace o componente, revisar `opm-extracted/src/app/models/components/` y `LogicalPart/` `VisualPart/`.
   - Antes de implementar render JointJS específico, revisar `opm-extracted/src/app/rappid-components/`.
   - Política: usar como **evidencia y guía estructural**, no copiar 1:1 (el código es derivado de ingeniería inversa).
5. **Anclaje SSOT obligatorio**: cada decisión semántica debe citar el archivo y sección de SSOT. Sin cita, no entra al modelo.
6. **Idiomas**: comunicación y documentación en es-CL; identificadores de código en español/inglés tal como ya están.
7. **Tests antes de cerrar**: cada línea agrega o extiende tests. Cobertura mínima descrita en su brief.
8. **Commit en su rama**: cada línea crea su(s) commit(s) antes de devolver el control. Mensajes en imperativo con prefijo `feat(...)` / `test(...)` / `refactor(...)` siguiendo el estilo de `git log`. Co-author footer estándar.
9. **No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`**. Esos archivos los actualiza la consolidación final, no las líneas individuales.

## 3. Stack y comandos

- Bun 1.3+, TypeScript strict, Preact 10 + Signals, Zustand 5, JointJS 3.7 core, Vite 6, Playwright.
- Working directory: `/home/felix/projects/deep-opm-pro`. Toda app vive en `app/`.

```bash
cd app

# Loop de verificación (obligatorio antes de cerrar línea)
bun run check          # typecheck + unit tests

# Verificación adicional para líneas con UI o render
bun run browser:smoke  # Playwright Chromium

# Cuando hay cambios pesados de render
bun run build          # vite build (warning JointJS esperado, ~738 KB)

# Dev server para validación visual manual
bun run dev            # localhost:5173
```

## 4. Visión general de las 5 líneas

| ID | Título | Pendiente HANDOFF | HU eje | Tamaño | Riesgo |
|---|---|---|---|---|---|
| **L1** | Firma de Enlace con extremo Estado | 1 (L4-bis) | HU-13.014, HU-13.015, HU-13.018 | M | **alto** |
| **L2** | Abanicos lógicos O/XOR | 3 | HU-15.008–012 | M | medio |
| **L3** | Modificadores e invocación | 3 | HU-15.015, HU-15.016, HU-15.019 | M | medio |
| **L4** | Validaciones BehaviouralRule extendidas | 4 | HU-1C.013–019 | L | bajo |
| **L5** | Plegado parcial avanzado | 2 | HU-18.004–010 | M | medio |

Pendiente 5 (refactor `operaciones.ts`) y 6 (OPL bidireccional) quedan para ronda 4: la modularidad de esta ronda los prepara sin forzar el refactor.

## 5. Mapa de archivos por línea (tabla de colisiones)

Convención: `aditivo` = solo agregar. `nuevo` = archivo creado por esta línea. `lectura` = solo lectura, prohibido editar. Casilla vacía = sin contacto.

| Archivo | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|
| `app/src/modelo/tipos.ts` | aditivo (Enlace.origenId/destinoId, ExtremoEnlace) | aditivo (Abanico) | aditivo (modificador, probabilidad, demora, TipoEnlace nuevos) | — | — |
| `app/src/modelo/operaciones.ts` | aditivo acotado (validarFirmaEnlace, refrescarEnlacesExternosDerivados) | lectura | lectura | — | aditivo acotado (extraer/reinsertar wrapper) |
| `app/src/modelo/abanicos.ts` (nuevo) | — | **nuevo** | — | — | — |
| `app/src/modelo/modificadores.ts` (nuevo) | — | — | **nuevo** | — | — |
| `app/src/modelo/plegado.ts` | — | — | — | — | aditivo (extraerParte, reinsertarParte) |
| `app/src/modelo/validaciones.ts` | aditivo (firma estado en proceduralmente válidos) | — | — | aditivo (4-5 reglas nuevas) | — |
| `app/src/modelo/operaciones.test.ts` | aditivo | — | — | — | aditivo |
| `app/src/modelo/validaciones.test.ts` | aditivo | — | — | aditivo | — |
| `app/src/modelo/abanicos.test.ts` (nuevo) | — | **nuevo** | — | — | — |
| `app/src/modelo/modificadores.test.ts` (nuevo) | — | — | **nuevo** | — | — |
| `app/src/modelo/plegado.test.ts` | — | — | — | — | aditivo |
| `app/src/serializacion/json.ts` | aditivo (kind+id helper, lossless legacy) | aditivo (abanicos) | aditivo (modificador, demora, probabilidad) | — | aditivo (apariencias extraídas) |
| `app/src/serializacion/json.test.ts` | aditivo | aditivo | aditivo | — | aditivo |
| `app/src/opl/generar.ts` | aditivo (TS3 transición) | aditivo (XOR/O) | aditivo (evento, NO, invocación) | — | aditivo ("y N más") |
| `app/src/opl/generar.test.ts` | aditivo | aditivo | aditivo | — | aditivo |
| `app/src/render/jointjs/linkAssets.ts` | lectura | aditivo (XOR/O conectores) | aditivo (badges E/¬, zigzag invocación) | — | — |
| `app/src/render/jointjs/JointCanvas.tsx` | aditivo (puerto estado) | aditivo (overlay abanico) | aditivo (badge sobre línea) | — | aditivo (lista compacta) |
| `app/src/render/jointjs/factory.ts` (o equivalente) | aditivo | aditivo | aditivo | — | aditivo |
| `app/src/store.ts` | lectura | aditivo (acción crearAbanico, alternarOperador) | aditivo (acción aplicarModificador, crearInvocacion) | aditivo (acción navegarAviso) | aditivo (acción extraerParte) |
| `app/src/ui/Inspector.tsx` y partials | aditivo (selector extremo estado) | aditivo (sección Abanico) | aditivo (modificador, probabilidad, demora) | — | aditivo (botón extraer/reinsertar) |
| `app/src/ui/PanelAvisos.tsx` | — | — | — | aditivo (citas SSOT, navegación, revalidar) | — |
| `app/src/ui/Toolbar.tsx` | — | — | aditivo (botón invocación) | — | — |
| `app/src/completitud.test.ts` | aditivo (ExtremoKind, designaciones nuevas si aplica) | aditivo (OperadorAbanico) | aditivo (Modificador, TipoEnlace nuevos) | — | — |

Reglas de oro derivadas:
- **Solo L1 modifica `Enlace.origenId/destinoId`**. L2 lee, L3 agrega campos al lado pero no toca origenId/destinoId.
- **Cada línea con dominio nuevo crea su archivo `app/src/modelo/<dominio>.ts`** y solo expone wrappers minimal en `operaciones.ts` si hace falta (preferiblemente, no).
- **`store.ts` tolera ediciones aditivas de L2, L3, L4, L5** porque cada acción es una entrada nueva al objeto de Zustand. Conflicto tipo "merge trivial".

## 6. Protocolo de conciliación

Orden de merge final propuesto: **L4 → L1 → L5 → L2 → L3**.

1. **L4 primero**: cero overlap con kernel; aporta red de avisos extendida que detectará regresiones de las otras líneas si las hay.
2. **L1 segundo**: define la firma de Enlace para todo lo que viene. Si las otras se desarrollaron en paralelo respetando el scope, no chocan.
3. **L5 tercero**: aislada en plegado. Conflicto potencial mínimo en `operaciones.ts` (cada uno toca región distinta).
4. **L2 cuarto**: abanicos consume firma L1 si dirige ramas a estados (HU-15.013 queda fuera del slice; ver brief L2).
5. **L3 quinto**: modificadores e invocación. Última porque agrega más a `TipoEnlace` y `completitud.test.ts` ya tendrá las extensiones de L2.

Después de cada merge: `bun run check` + `bun run browser:smoke` + `bun run build`. Si falla, parar y diagnosticar antes de seguir.

**Si dos líneas se rompen mutuamente**: la línea con menor riesgo (L4) tiene precedencia. La línea con mayor blast radius (L1) absorbe el delta del rebase.

## 7. Anclaje obligatorio a HUv2 y SSOT

Cada brief lista las HU que cubre. Antes de codificar, leer **al menos**:
- Las HU del brief y sus dependencias declaradas.
- La sección SSOT citada (archivos en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`).
- El módulo correspondiente de `opm-extracted/` (rutas en cada brief).

Si una HU es ambigua, ver "preguntas abiertas" al final de su épica y elegir el camino que minimiza retrabajo, documentando la decisión en el commit.

## 8. Brief por línea

| Línea | Brief |
|---|---|
| L1 | [linea-1-firma-enlace-estado.md](./linea-1-firma-enlace-estado.md) |
| L2 | [linea-2-abanicos-logicos.md](./linea-2-abanicos-logicos.md) |
| L3 | [linea-3-modificadores-enlace.md](./linea-3-modificadores-enlace.md) |
| L4 | [linea-4-validaciones-behavioural.md](./linea-4-validaciones-behavioural.md) |
| L5 | [linea-5-plegado-parcial-avanzado.md](./linea-5-plegado-parcial-avanzado.md) |

Prompt para asignar cualquier línea a un agente: [prompt-asignacion.md](./prompt-asignacion.md).

## 9. Verificación al cierre de la ronda

Cuando las 5 líneas estén integradas en `main`, verificar:

```bash
cd app
bun run check          # >= 175 unit tests verdes esperados (163 base + ~15 por línea)
bun run browser:smoke  # >= 25 smoke tests verdes esperados (20 base + 1-2 por línea)
bun run build          # verde, drift de bundle aceptable (< +50 KB respecto a 738 KB)
```

Métricas esperadas post-ronda 3:
- HU M0 cerradas adicionales: HU-13.014, HU-13.015, HU-13.018, HU-15.008–012, HU-15.019.
- HU M1 cerradas adicionales: HU-15.015, HU-15.016, HU-1C.013–019, HU-18.004–006, HU-18.009, HU-18.010.
- EPICA-13 cerrada a M0 (HU-13.014 era el último bloqueante).
- EPICA-1C cerrada a M1 (con 9-10 reglas total en `validaciones.ts`).
- `operaciones.ts` se mantiene <1700 LOC; los dominios nuevos viven en archivos disjuntos.

`docs/HANDOFF.md` se reescribe en consolidación: pendientes 1, 2, 3, 4 cerrados o reducidos; pendientes 5 (refactor) y 6 (OPL bidireccional) reordenan como prioridad de ronda 4.
