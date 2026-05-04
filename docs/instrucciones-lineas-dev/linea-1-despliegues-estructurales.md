# Línea 1 — Despliegues estructurales (exhibición · generalización · clasificación) + OPL diferenciado

## 1. Misión

Hoy, `desplegarObjeto` (`app/src/modelo/operaciones.ts:148`) está cableado a un único modo: agregación-participación con tres partes iniciales. La SSOT OPM reconoce **cuatro mecanismos** de despliegue como refinamiento estructural:

| Modo | Enlace generado | Verbo OPL-ES |
|---|---|---|
| `agregacion` (ya existe) | agregación-participación | "se despliega en … como partes" / "consta de" |
| `exhibicion` | exhibición-característica | "exhibe" |
| `generalizacion` | generalización-especialización | "es un / es una" |
| `clasificacion` | clasificación-instanciación | "es una instancia de" |

La línea **parametriza** la operación existente (`modo: "agregacion" | "exhibicion" | "generalizacion" | "clasificacion"`, default `"agregacion"`), extiende `TipoEnlace` con los tres nuevos, ajusta firmas en `validarFirmaEnlace`, y diferencia los verbos OPL-ES por modo. Reusa toda la maquinaria existente: la estructura del OPD hijo es idéntica, la reversibilidad por subárbol funciona uniformemente, los markers SVG vienen de `assets/svg/links/structural/`.

**Slice mínimo entregable**: cuatro modos funcionando con submenú "Desplegar como…" en Inspector, OPL-ES diferenciada, JSON round-trip, tests por modo. Sin nuevos markers SVG dedicados (usar los existentes con etiqueta de tipo en propiedades del enlace) — agregar markers correctos como segundo incremento sólo si queda tiempo.

## 2. HU base (lectura obligatoria antes de codificar)

| HU | Path | Aporta |
|---|---|---|
| HU-12.014 | `docs/historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md` (sección 12.014) | Distinguir verbos OPL: descompone vs despliega |
| HU-17.013 | `docs/historias-usuario-v2/epicas/epica-17-canvas-objetos-avanzados.md` (sección 17.013) | Atributo vía exhibición-característica |
| HU-17.028 | `docs/historias-usuario-v2/epicas/epica-17-canvas-objetos-avanzados.md` (sección 17.028) | OPD `SDn: <Obj> desplegado` |
| HU-50.013 | `docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` (sección 50.013) | Plantilla "se despliega en" |
| HU-50.015 | `docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` (sección 50.015) | Plantilla "es un / es una" |
| HU-12.027 (referencia) | `docs/historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md` (sección 12.027) | Reversibilidad por subárbol |

Adicionalmente: `docs/historias-usuario-v2/03-PATRONES-TRANSVERSALES.md` para el patrón de extensión de `TipoEnlace`.

## 3. Anclaje a evidencia

- **OPM SSOT**: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` (refinamiento estructural), `opm-opl-es.md` (plantillas de OPL-ES por tipo de enlace).
- **OPCloud (lectura, NO copia)**: `opm-extracted/INDEX.md` — buscar `Exhibition`, `Generalization`, `Classification`, `Specialization`. Verificar visualmente cómo OPCloud denomina y renderiza estos enlaces. `opm-extracted/MODULES.md` para el mapa.
- **JOYAS**: `docs/JOYAS.md` — colores, dimensiones, tipografía, marcadores estructurales (triángulo de generalización, etc.).
- **Markers SVG**: `assets/svg/links/structural/` y la tabla operativa en `app/src/render/jointjs/linkAssets.ts` — agregar entradas para los tres nuevos tipos.
- **Fixtures**: `fixtures/` puede contener ejemplos con generalización; usar como verificación.

## 4. Archivos permitidos (scope estricto)

```
app/src/modelo/tipos.ts                      ← extender TipoEnlace + RefinamientoEntidad si necesario
app/src/modelo/operaciones.ts                ← parametrizar desplegarObjeto, extender validarFirmaEnlace, ajustar agregaciones iniciales
app/src/modelo/operaciones.test.ts           ← tests por modo
app/src/modelo/constantes.ts                 ← firmas (qué tipos pueden aparecer entre qué entidades)
app/src/opl/generar.ts                       ← plantillas por modo
app/src/opl/generar.test.ts                  ← AGREGAR; no reemplazar lo que la L3 introduzca (cambios disjuntos)
app/src/ui/Inspector.tsx                     ← submenú "Desplegar como…"
app/src/render/jointjs/linkAssets.ts         ← entradas para markers nuevos
```

Cualquier otro archivo: **prohibido**. Si surge una necesidad cross-archivo no contemplada, detenerse y documentar en el commit como TODO.

## 5. Restricciones de no-colisión

1. `desplegarObjeto(modelo, opdPadreId, objetoId)` **debe seguir funcionando con la firma actual**. Estrategia: añadir parámetro `modo: "agregacion" | "exhibicion" | "generalizacion" | "clasificacion" = "agregacion"` al final.
2. `TipoEnlace` se **extiende** (no reemplaza). Los enlaces persistidos como `"agregacion"`, `"agente"`, etc. siguen cargándose sin cambio.
3. `validarFirmaEnlace` debe aceptar los tres tipos nuevos pero **rechazar** combinaciones inválidas (ej: generalización proceso↔proceso es válida; objeto↔proceso no lo es).
4. Las plantillas OPL-ES que se agreguen a `opl/generar.ts` deben respetar el orden de aparición ya establecido (caso primero por id de tipo).
5. **Decisión arquitectural fijada (no reabrir)**: `TipoEnlace` se mantiene **flat**. NO introducir una dimensión paralela `naturaleza: "procedural" | "estructural"`. Si se necesita inferir naturaleza, hacerlo con una función pura `naturalezaDeEnlace(tipo)` en `constantes.ts`.

## 6. Slice mínimo shippeable

Lo que debe quedar funcionando al cerrar la línea:

1. `desplegarObjeto(m, opd, obj, "agregacion")` ↔ comportamiento idéntico al actual.
2. `desplegarObjeto(m, opd, obj, "exhibicion")` ↔ crea OPD hijo `SDn`, tres atributos iniciales conectados al objeto por enlace `"exhibicion"`. Reversible con `quitarDespliegueObjeto` sin cambios.
3. `desplegarObjeto(m, opd, obj, "generalizacion")` ↔ crea OPD hijo `SDn`, tres especializaciones iniciales conectadas por enlace `"generalizacion"`.
4. `desplegarObjeto(m, opd, obj, "clasificacion")` ↔ crea OPD hijo `SDn`, tres instancias iniciales conectadas por enlace `"clasificacion"`.
5. `validarFirmaEnlace` acepta los tres tipos nuevos con las firmas correctas según SSOT (verificar en `opm-iso-19450-es.md`).
6. `opl/generar.ts` emite verbos diferenciados (`exhibe`, `es un/una`, `es una instancia de`) según el `modo` del despliegue del OPD activo.
7. **Inspector**: el botón "Desplegar" (existente) se transforma en submenú con cuatro entradas: "Como partes (agregación)", "Como atributos (exhibición)", "Como especializaciones", "Como instancias". La acción default permanece compatible.
8. **JSON round-trip**: modelos serializados con los tres tipos nuevos cargan idénticos.
9. **Markers**: usar markers existentes (triángulo de agregación, etc.). Si los SVG canónicos para exhibición/generalización/clasificación ya existen en `assets/svg/links/structural/`, agregarlos a `linkAssets.ts`. Si no, dejar TODO documentado y usar el marker estructural genérico.

**Pendiente explícito** (no entra en este slice, dejar TODO):
- Reasignación manual de "qué partes/atributos iniciales se generan" — por ahora siempre tres con nombres genéricos.
- Plegado parcial sobre los tres modos nuevos (eso es L5).

## 7. Tests obligatorios

En `app/src/modelo/operaciones.test.ts`, agregar bloques:

- `desplegarObjeto - modo agregacion (regresión)`: confirma comportamiento previo intacto.
- `desplegarObjeto - modo exhibicion`: verifica creación de OPD hijo, tres entidades iniciales, tres enlaces de tipo `exhibicion`.
- `desplegarObjeto - modo generalizacion`: idem con `generalizacion`.
- `desplegarObjeto - modo clasificacion`: idem con `clasificacion`.
- `quitarDespliegueObjeto - modo X`: para cada uno de los nuevos modos, verifica reversibilidad limpia.
- `validarFirmaEnlace - exhibicion/generalizacion/clasificacion`: casos válidos e inválidos.
- `JSON round-trip - despliegue exhibicion/generalizacion/clasificacion`: el JSON serializado se carga idéntico (verificar en `app/src/serializacion/json.test.ts` mediante extensión, sin reemplazar tests existentes).

En `app/src/opl/generar.test.ts`, agregar:

- `OPL - despliegue exhibicion emite "exhibe"`.
- `OPL - despliegue generalizacion emite "es un / es una"`.
- `OPL - despliegue clasificacion emite "es una instancia de"`.

## 8. Verificación

```bash
cd app
bun run check          # typecheck + unit tests OBLIGATORIO verde
bun run browser:smoke  # smoke browser; debería seguir verde si Inspector se mantiene retro-compatible
```

Si introducís markers nuevos en `linkAssets.ts`, ejecutar también `bun run dev` y validar visualmente que los markers cargan sin errores en consola.

## 9. Decisiones bloqueadas (no reabrir)

- `TipoEnlace` flat (sin dimensión `naturaleza`). Punto 5.5.
- Default del parámetro `modo` es `"agregacion"`. Cualquier código existente que llame `desplegarObjeto(m, opd, obj)` seguirá funcionando.
- El despliegue siempre crea OPD hijo `SDn` (igual que el actual). NO se considera el "despliegue en mismo diagrama" en este slice (eso es HU-10.021, fuera de scope).

## 10. Decisiones que tomás vos (documentar en commit)

- Cantidad inicial de partes/atributos/especializaciones/instancias: por defecto 3, igual que agregación. Si hay evidencia en `opm-extracted/` o JOYAS de un default distinto por modo, usalo y documentalo.
- Nombres iniciales: "Atributo 1/2/3", "Especialización 1/2/3", "Instancia 1/2/3" salvo que `opm-extracted/` sugiera mejor.
- Etiqueta del OPD hijo: `SDn: <Objeto> desplegado` (igual que el actual). NO cambiar el patrón.

## 11. Forma del entregable

- Uno o varios commits en imperativo, prefijo `feat(modelo)` para extensión del kernel, `feat(opl)` para verbos, `feat(ui)` para Inspector, `test(...)` para tests.
- Mensaje de commit con co-author footer estándar del repo.
- No tocar `docs/HANDOFF.md` ni HUs (son SSOT del backlog, no del avance de implementación de este slice).
