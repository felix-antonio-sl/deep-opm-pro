---
titulo: "Metodología — Inventario v2 de historias de usuario del modelador OPM"
fecha: 2026-05-03
version: "v2.0.0"
estado: "activo"
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
fuente_modelo_datos: "/home/felix/projects/deep-opm-pro/app/src/modelo/tipos.ts"
fuente_evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
linter: "tools/validate-hu.ts"
---

## 1. Propósito

Define el formato canónico, la precedencia normativa, el vocabulario obligatorio y el ciclo de vida de cada historia de usuario del inventario v2 del modelador OPM. Sustituye `historias-usuario/00-METODOLOGIA-HU.md` (v1) y resuelve los cinco gaps documentados en `historias-usuario/DIAGNOSTICO-PILOTO-EPICA-10.md`.

La unidad de análisis es la historia de usuario (HU). Una HU describe un comportamiento observable atómico con beneficiario identificable, criterios de aceptación testables y trazabilidad bidireccional a la fuente normativa (SSOT OPM) y a la evidencia de producto (OPCloud).

## 2. Precedencia de fuentes

```
SSOT OPM v3.0.0  >  app/src/modelo/tipos.ts  >  evidencia OPCloud  >  opcloud-reverse/
```

1. **SSOT OPM v3.0.0** — autoridad semántica, visual y textual. Consta de cuatro capas:
   - `opm-iso-19450-es.md` — semántica base + glosario (3.1–3.83 + E1).
   - `opm-visual-es.md` — gramática visual (V-0…V-240+).
   - `opm-opl-es.md` — plantillas OPL-ES (T1–T3, D1–D13, TS1–TS5).
   - `metodologia-opm-es.md` — procedimiento de construcción del SD.
2. **`app/src/modelo/tipos.ts`** — SSOT viva del modelo de datos. Define `Entidad`, `Apariencia`, `Enlace`, `AparienciaEnlace`, `Opd`, `Modelo`. Toda HU cita campos por nombre exacto en TypeScript.
3. **Evidencia OPCloud** — `JOYAS.md`, `assets/`, `decompiled/`, `fixtures/`, `catalog/`, `config/`. Referencia de implementación de producto verificada por ingeniería inversa.
4. **`opcloud-reverse/`** — corpus original de transcripciones; trazabilidad histórica únicamente.

Conflictos: la SSOT manda. Si OPCloud diverge de la SSOT, la HU describe el comportamiento SSOT y registra la divergencia OPCloud como nota.

## 3. Sistema de IDs

- HU canónicas: `HU-NN.NNN` donde `NN` es la épica (decimal o hexadecimal corto: `10`, `1A`, `B3`, `D1`) y `NNN` es secuencial dentro de la épica.
- HU shared: `HU-SHARED-NNN` (namespace propio).
- Los IDs son **inmutables**. Una HU absorbida o fusionada conserva su ID con stub que redirige a la canónica.
- Las renumeraciones están prohibidas.

## 4. Tipos de HU

Toda HU canónica declara uno de tres valores en `**Tipo:**`:

| Tipo | Significado | Cita obligatoria | Prioridad típica |
|---|---|---|---|
| `opm-semantica` | La SSOT exige este comportamiento. Si se omite, el modelo no es OPM conforme. | `[V-xxx]` y/o `[Glos 3.x]` y/o `[OPL-ES …]` | M0 |
| `opcloud-ui` | Afordance observada en OPCloud, no exigida por la SSOT. Puede divergir o diferirse. | `[JOYAS §x]` si toca render; razón explícita si no cita SSOT. | M1, S, C |
| `mixto` | Necesidad genérica (SSOT) con implementación referencial (OPCloud). | SSOT + JOYAS. | M0/M1 |

El linter rechaza cualquier otro valor (capturando los 19 valores erróneos del corpus v1).

## 5. Niveles categóricos

Cada HU declara `**Nivel categórico:**` con notación primaria + secundarios:

| Nivel | Dominio |
|---|---|
| K | Kernel, tipos, validadores, reglas semánticas |
| V | Render visual, canvas, vocabulario gráfico |
| L | Lentes derivadas: OPL, árbol OPD, mapas, tablas |
| P | Persistencia, workspace, versionado, serialización |
| U | UI, gestos, popups, modales, toolbars |
| C | Configuración usuario / organización |
| X | Integración externa (import, export, runtime) |
| D | Dominio o profile específico |

Convención: el primario es el nivel donde la HU produce su efecto principal; los secundarios son los que la HU toca como integraciones.

## 6. Formato canónico de una HU

Cada HU vive como sección markdown de tercer nivel (`### HU-…`). Estructura obligatoria de la HU canónica:

```markdown
### HU-{EPICA}.{NNN} — {título breve en imperativo}

**Actor primario:** {código} ({rol}).
**Actores secundarios:** {códigos} (opcional).
**Tipo:** {opm-semantica | opcloud-ui | mixto}.
**Nivel categórico:** {primario}; {secundarios}.
**Superficie UI:** {barra-principal | canvas-opd | panel-opl-es | …}.
**Gesto canónico:** {arrastrar | clic | doble-clic | atajo | diálogo | …}.

**Historia:**
> Como {actor}, quiero {acción observable} para {beneficio concreto}.

**Contexto de negocio:**
{2-4 oraciones: qué exige la SSOT, cómo lo implementa OPCloud, por qué importa.}

**Criterios de aceptación:**
- **Dado** {precondición}, **cuando** {acción}, **entonces** {consecuencia observable con valor o predicado verificable}.
- {…}

**Reglas y restricciones:**
- {primero las SSOT con su cita; luego las OPCloud como referencia.}

**Modelo de datos tocado:**
- `entidad.campo` — {tipo} — persistente | transitorio.
- `apariencia.campo` — {tipo} — persistente | transitorio.

**Patrones aplicados:**
- {ver HU-SHARED-NNN}, {…} (opcional).

**Dependencias:**
- **Bloqueada por:** HU-{ID} ({razón}).
- **Bloquea a:** HU-{ID} ({razón}).

**Integraciones:**
- {otros subsistemas que reaccionan}.

**Notas de evidencia:**
- Fuente normativa: {[V-xxx], [Glos 3.x], [OPL-ES …]}.
- Fuente OPCloud: {`opcloud-reverse/{doc}.md` §{sección}}.
- Evidencia visual: {[JOYAS §x], `assets/svg/…`, `fixtures/…`}.
- Clase de afirmación: {confirmado por SSOT | observado + confirmado | inferido | hipótesis | abierto}.

**Prioridad:** {M0 | M1 | S | C | W}.
**Tamaño:** {XS | S | M | L | XL}.
**Etiquetas:** [{tag1}, {tag2}, …].
```

## 7. Formato de stub

Una HU absorbida en un patrón shared o fusionada en otra HU canónica conserva su ID con un stub corto:

### 7.1 Absorbida en shared

```markdown
### HU-13.005 — Abrir menú contextual sobre estado [absorbida en HU-SHARED-001]

**Estado:** absorbida-en-shared (2026-05-03).
**Canónica:** HU-SHARED-001 — Menú contextual unificado.
**Especialización local:** acciones disponibles para Estado:
  - Eliminar estado
  - Designar como inicial / final / Current
  - Editar duración
**Citas SSOT preservadas:** [V-237], [Glos 3.71a].
**Fuente OPCloud:** opcloud-reverse/13-canvas-estados.md §3.2.
```

### 7.2 Fusionada en HU canónica

```markdown
### HU-10.005 — Confirmar nombre con Enter o botón [fusionada en HU-10.003]

**Estado:** fusionada (2026-05-03).
**Canónica:** HU-10.003 §criterios de aceptación.
**Razón:** subset de HU-10.003 (variante de gesto, no nivel de HU).
```

Los stubs no se validan en su cuerpo (no requieren citas SSOT, ni modelo de datos, ni criterios). Se cuentan en el linter como `stubs`, separadamente de las canónicas vivas.

## 8. Niveles de prioridad

| Prioridad | Significado | Conteo objetivo (post-consolidación) |
|---|---|---|
| **M0** | Must-have kernel OPM. Sin esto, el producto no es OPM. | ~150 |
| **M1** | Must-have producto. Usabilidad mínima real. | ~180 |
| **S** | Should-have. Diferencial de productividad. | ~430 |
| **C** | Could-have. Conveniencia y pulido. | ~210 |
| **W** | Won't-have en MVP. Diferido por infra externa. | ~100 |

Regla: una HU no puede ser M0 si depende de una que no es M0.

## 9. Tamaños

| Tamaño | Esfuerzo |
|---|---|
| XS | ≤ 2 horas |
| S | ½ – 1 día |
| M | 2 – 3 días |
| L | 1 – 2 semanas |
| XL | > 2 semanas |

## 10. Idioma y terminología

- Español (es-CL) en cuerpo, títulos, criterios y reglas.
- Identificadores de código en su forma TypeScript (`entidad.tipo`, `apariencia.x`).
- Anglicismos solo dentro de `**Notas de evidencia:**` cuando se cita literalmente OPCloud, entre comillas.
- Términos OPM canónicos: ver `01-GLOSARIO-NORMATIVO.md`. La equivalencia EN se menciona entre paréntesis solo la primera vez en cada épica y solo cuando ayuda a interoperar con literatura OPM/OPCloud.
- El linter rechaza términos prohibidos en cuerpo de HU canónica (`thing`, `affiliation`, `essence`, `in-zooming`, `unfolding`, `enabler`, `transformee`, `aggregation` sin guión, `hover`, `informatical`, `stateful`).

## 11. Citas SSOT inline

Formato obligatorio:

| Cita | Significado | Fuente |
|---|---|---|
| `[V-xxx]` | Regla visual | `opm-visual-es.md` |
| `[Glos 3.x]` o `[Glos E1]` | Término del glosario | `opm-iso-19450-es.md` |
| `[OPL-ES Tx]` / `[OPL-ES Dx]` / `[OPL-ES TSx]` | Plantilla textual OPL-ES | `opm-opl-es.md` |
| `[Met §x]` | Sección de la metodología SSOT | `metodologia-opm-es.md` |
| `[JOYAS §x]` | Parámetro visual canónico OPCloud | `docs/JOYAS.md` |

El linter verifica que cada `[V-xxx]`, `[Glos 3.x]` y `[OPL-ES …]` exista realmente en la SSOT.

## 12. Modelo de datos

La SSOT del modelo es `app/src/modelo/tipos.ts`. Las raíces permitidas en `**Modelo de datos tocado:**` son:

- `entidad.*` (Object o Process; `tipo`, `nombre`, `esencia`, `afiliacion`).
- `apariencia.*` (manifestación visual de una entidad en un OPD; `x`, `y`, `width`, `height`).
- `enlace.*` (enlace entre entidades; `tipo`, `origenId`, `destinoId`, `etiqueta`).
- `aparienciaEnlace.*` (manifestación visual de un enlace; `vertices`).
- `opd.*` (`nombre`, `apariencias`, `enlaces`).
- `modelo.*` (`nombre`, `opdRaizId`, `opds`, `entidades`, `enlaces`, `nextSeq`).
- `estado.*` (propuesta — no implementado en `tipos.ts`).
- `estereotipo.*` (propuesta — no implementado en `tipos.ts`).

Los campos no implementados se marcan `[propuesta]` en la HU. Ver `02-MODELO-DATOS.md`.

## 13. Patrones transversales

Nueve patrones transversales viven en `shared/HU-SHARED-NNN-*.md`. Una HU que invoca un patrón shared lo cita en `**Patrones aplicados:**` y, si la lógica completa coincide con el patrón, se convierte en stub absorbido. Si solo coincide parcialmente (especialización local), permanece canónica con cita.

## 14. Trazabilidad

Cada HU canónica cita:
- **Fuente normativa primaria:** una o más de [V-xxx], [Glos 3.x], [OPL-ES …].
- **Fuente OPCloud:** ruta a `opcloud-reverse/`, sección y, si aplica, frame.
- **Evidencia visual:** [JOYAS §x], `assets/svg/...`, `fixtures/...`.
- **Clase de afirmación:** confirmado por SSOT | observado + confirmado | inferido | hipótesis | abierto.

## 15. Preguntas abiertas

Las preguntas sin resolver viven en una sección `## Preguntas abiertas derivadas` al final de cada épica, con código `Q{EPICA}.{N}`. Las HU bloqueadas por una pregunta abierta lo declaran en `**Dependencias:**` con etiqueta `requires-clarification` y no se activan hasta resolverla.

El linter rechaza preguntas (`?¿`, "(pregunta abierta)") embebidas en cuerpo de HU canónica.

## 16. Ciclo de vida

```
borrador → revisada → validada (SSOT + linter) → implementable → en-curso → cubierta-e2e
```

Una HU se considera `validada` cuando pasa el linter completo y un humano confirma que sus criterios son testables. `cubierta-e2e` cuando hay test end-to-end que verifica todos sus criterios.

## 17. Lo que este inventario NO hace

- No inventa funcionalidad ausente en la SSOT y en OPCloud.
- No genera soluciones de novo sin verificar la pila de evidencia (assets → JOYAS → decompiled → fixtures → catalog → config).
- No reproduce literalmente OPCloud — el objetivo es informar el modelador OPM.
- No copia la arquitectura de OPCloud (Firebase, Angular). SVGs, dimensiones, colores, tipografía y plantillas OPL se reutilizan; la arquitectura es propia (Bun + Vite + Preact + JointJS + Zustand).
- No prioriza de forma definitiva — la prioridad es orientativa y se refina en `05-ROADMAP.md`.

## 18. Referencias

- SSOT OPM v3.0.0: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`
- Modelo vivo: `app/src/modelo/tipos.ts`
- Evidencia OPCloud: `JOYAS.md`, `assets/`, `decompiled/`, `fixtures/`, `catalog/`, `config/`
- Inventario v1 (histórico): `docs/archive/historias-usuario-v1/` (post cierre)
- Diagnóstico de gaps v1: `docs/archive/historias-usuario-v1/DIAGNOSTICO-PILOTO-EPICA-10.md`
- Anti-patrón documentado: `docs/archive/si-partiese-desde-0.md`
