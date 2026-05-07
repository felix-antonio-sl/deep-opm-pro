# Línea 3 — Destilar 6 methodological-checkers desde opm-extracted + panel visual

## 1. Misión

Crear `app/src/modelo/checkers.ts` (~250 LOC) con **6 checkers metodológicos destilados semánticamente** desde `opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/` (la única joya semántica nueva real de OPCloud según auditoría steipete §T2.3). Exponer `verificarMetodologia(modelo: Modelo): AvisoMetodologico[]` + integrar como **panel visual** (extensión `PanelAvisos` o nuevo `PanelMetodologia` — decisión final en línea según research del agente).

**Enmienda IFML absorbida**: `PanelMetodologia` se modela como View derivada por DataFlow (`modelo` → `verificarMetodologia(modelo)` → `AvisoMetodologico[]`), no como side-effect de Actions. Ver `docs/auditorias/2026-05-07-auditoria-ifml.md` §10 punto 4 (validación como SystemEvent OPM) y §4 `PanelAvisos`.

6 checkers a destilar (paths reales verificados con `ls`):

| Checker OPCloud | Path | Reglas semánticas |
|---|---|---|
| `ing-checker.ts` | `opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/ing-checker.ts` | Procesos en gerundio "-ing" → en español: terminan en `-ar`/`-er`/`-ir` (infinitivos verbales) o convención ISO 19450 §Procesos |
| `object-name-as-singular-checker.ts` | mismo path | Objetos en singular (no plural) |
| `inzoomed-content-checker.ts` | mismo path | In-zoom debe contener ≥2 cosas |
| `part-unfold-content-checker.ts` | mismo path | Unfold debe contener ≥2 partes |
| `transforming-process-checker.ts` | mismo path | Proceso debe tener al menos un Result/Consumption/Effect |
| `systemic-processes-main-function-checker.ts` | mismo path | Todos los procesos sistémicos conectados al SD principal vía links fundamentales o cadena in-zoom/unfold |

Adaptación al kernel propio (steipete §T2.3):

- `OPCloudUtils.isInstanceOfLogicalProcess(thing)` → `entidad.tipo === "proceso"`
- `OPCloudUtils.isInstanceOfLogicalObject(thing)` → `entidad.tipo === "objeto"`
- `model.logicalElements` → `Object.values(modelo.entidades)`
- `model.opds.filter(o => !o.isHidden)` → `Object.values(modelo.opds)`
- `vis.getAllLinks()` → reusar `entidadIdDeExtremo` + filtros sobre `modelo.enlaces`
- `proc.affiliation === Affiliation.Systemic` → `entidad.afiliacion === "sistémica"`
- `linkType.Result/Consumption/Effect` → ya hay tipo `TipoEnlace`

Slice mínimo entregable: 6 commits (1 por checker) + 1 `feat(modelo): tipos/avisos.ts` + 1 `feat(modelo): verificarMetodologia` orquestador + 1 `feat(ui): PanelMetodologia` (o extensión PanelAvisos) + 1 `test(modelo): checkers cubre ~150 casos` + 1 `test(e2e): smoke panel metodologia visible`.

**Fuera de slice**:

- **No tocar Toolbar.tsx** (territorio L1) ni `toolbar/*.tsx`.
- **No tocar `tokens.ts`** salvo importar (territorio L2).
- **No tocar `BarraHerramientasElemento.tsx`** (L4).
- **No tocar generadores OPL** (`app/src/opl/generadores/*.ts`, `app/src/modelo/opl/generador-opl.ts`).
- **No modificar Inspector secciones** (L4 podría leer InspectorEntidad para botón "···").
- **No modificar render JointJS**: avisos metodológicos son blandos (no errores), no se renderean como overlays canvas en ronda 13 (eso queda como mejora futura — badges sobre entidades inválidas).
- **No introducir SystemEvent/store side-effect nuevo** para recalcular avisos: la función es pura y el panel deriva en render.

## 2. HU base

| HU | Estado actual | Aporte L3 |
|---|---|---|
| **Sin HU directa específica** | refactor estructural autorizado por brief steipete §T2.3 | 6 checkers + panel visual. Abre dominio nuevo "validación metodológica" complementario a la "validación de consistencia" ya existente (`app/src/modelo/validaciones.ts` post-T1.3). |

L3 abre **métrica nueva opcional** "modelo metodológicamente válido" que el operador puede registrar en ledger HU si decide formalizarlo (por ejemplo HU-VALIDA-METODOLOGIA-001..006 nuevo segmento). En ronda 13 no se introduce; queda como evidencia para ronda 14+.

## 3. Anclaje a evidencia

**Nivel 1 — SSOT (citas obligatorias)**:

- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md`:
  - §metodologia: workflow OPM canónico. **Cita obligatoria header `checkers.ts`**: `[Met §metodologia]`.
  - §inzoom: mecanismo refinamiento por contenido. **Cita InzoomedContentChecker**: `[Met §inzoom]`.
  - §unfold: mecanismo refinamiento por partes. **Cita PartUnfoldContentChecker**: `[Met §unfold]`.
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md`:
  - §3.55 Object: objetos en singular. **Cita ObjectNameAsSingularChecker**: `[Glos 3.55]`.
  - §3.69 Process: procesos como verbo (gerundio inglés / infinitivo español). **Cita IngProcessesNamesChecker**: `[Glos 3.69]`.
  - §Reglas semánticas: regla "proceso debe transformar". **Cita TransformingProcessChecker**: `[Glos 3.x reglas]`.
  - §Sistémica: afiliación canónica. **Cita SystemicProcessesMainFunctionChecker**: `[Glos 3.x sistémico]`.

**Nivel 2 — `app/src/modelo/tipos.ts`**: L3 puede crear `tipos/avisos.ts` aditivo + re-export desde `tipos.ts`. Coherencia con kernel: `entidad.tipo`, `entidad.afiliacion`, `enlace.tipo`, `enlace.refinamientoOpdId`.

**Nivel 3 — respaldo técnico (cita obligatoria al checker original)**:

- **`opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/`**: 6 archivos TS legibles (no decompilados Angular IVY). Listados en §1.
- **`docs/auditorias/2026-05-07-refactor-radical-steipete.md` §T2.3**: contrato L3.
- **`docs/auditorias/2026-05-07-auditoria-ifml.md` §4 y §10.4**: contrato de interacción L3; PanelMetodologia es ViewComponent derivado, no Action ni serialización.
- **Estado actual del código (verificado)**:
  - `app/src/modelo/tipos.ts`: re-exports de `tipos/{modelo,entidad,enlace,opd,apariencia,abanico,estado,opl,pestana,ui,plantilla,comunes}.ts`.
  - `app/src/modelo/tipos/`: 12 archivos de tipos. **NO existe `tipos/avisos.ts`** (L3 lo crea NUEVO).
  - `app/src/modelo/validaciones.ts`: post-T1.3 ronda 13.0 con header SSOT corregido. Contiene validaciones de consistencia (no metodológicas).
  - `app/src/ui/PanelAvisos.tsx`: existe (verificar contenido). Si está vacío o solo skeleton, L3 lo extiende; si tiene lógica densa, L3 crea `PanelMetodologia.tsx` hermano.
  - `app/src/canvas/reglasTraer.ts`: helper `tiposDeFamilia(familia)` y `entidadIdDeExtremo` (utilidades reusables para checkers).

## 4. Archivos permitidos

```text
app/src/modelo/checkers.ts                              NUEVO (~250 LOC: 6 checkers + verificarMetodologia)
app/src/modelo/checkers.test.ts                         NUEVO (~150 LOC: ~150 tests cubriendo casos válidos/inválidos por checker)
app/src/modelo/tipos/avisos.ts                          NUEVO (~50 LOC: tipo AvisoMetodologico + Severidad)
app/src/modelo/tipos.ts                                 EDIT aditivo (re-export de tipos/avisos.ts)
app/src/ui/PanelAvisos.tsx                              EDIT extensión aditiva (si decide extender)
app/src/ui/PanelMetodologia.tsx                         NUEVO (~200 LOC: si decide panel hermano)
app/src/ui/App.tsx                                      EDIT aditivo (montar PanelMetodologia condicional, en zona del layout no ocupada por L1 lazy ni L4 flotante)
app/src/ui/tokens.ts                                    LECTURA (importar tokens.colors.alertaAmbar/exitoVerde para renderizar avisos)
app/e2e/06-undo-redo-dirty.spec.ts                      EDIT aditivo (1 smoke panel metodologia visible con modelo demo)
app/e2e/01-carga-y-workspace.spec.ts                    EDIT aditivo (1 smoke checkers ejecutan al cargar modelo)
opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/  LECTURA
docs/HANDOFF.md                                         LECTURA
docs/auditorias/2026-05-07-refactor-radical-steipete.md LECTURA
docs/auditorias/2026-05-07-auditoria-ifml.md            LECTURA
docs/JOYAS.md                                           LECTURA
assets/svg/**                                           LECTURA
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones de no-colisión

- **No tocar `app/src/ui/Toolbar.tsx`** (L1) ni `toolbar/*.tsx`.
- **No tocar `tokens.ts`** salvo lectura (L2).
- **No tocar `BarraHerramientasElemento.tsx`** (L4).
- **No tocar `InspectorEntidad.tsx`** ni `Inspector*` (L4 puede leer).
- **No tocar generadores OPL** (`app/src/opl/generadores/*.ts`, `app/src/modelo/opl/generador-opl.ts`).
- **No tocar serializadores**: `AvisoMetodologico` se calcula en runtime, NO se serializa.
- **No tocar render JointJS**: cero overlays canvas para avisos en ronda 13.
- **No tocar `progress-dashboard.mjs`**: consolidación operador.
- **No tocar `acciones-canvas.ts`, `acciones-ui.ts`**: los avisos son derivados puros del modelo (función pura `Modelo → AvisoMetodologico[]`), no requieren acciones store.
- **No crear triggers incrementales ni SystemEvents**: IFML reconoce que sería ideal, pero ronda 13 implementa DataFlow derivado simple; optimización incremental queda para ronda futura si hay benchmark >500 entidades.
- **App.tsx en zona compartida con L1 (lazy) y L4 (flotante)**: L3 monta `PanelMetodologia` en una zona del layout sin chocar. Hunks disjuntos. **Coordinación de orden**: L1 → L4 → L3.

## 6. Slice mínimo shippeable

### 6.1 Tipo `AvisoMetodologico`

```typescript
// app/src/modelo/tipos/avisos.ts
// [Met §metodologia] avisos metodologicos blandos (no errores) derivados de checkers OPM.

export type SeveridadAviso = "info" | "advertencia" | "sugerencia";

export type CodigoChecker =
  | "PROCESO_NOMBRE_FORMA_VERBAL"
  | "OBJETO_NOMBRE_SINGULAR"
  | "INZOOM_CONTENIDO_INSUFICIENTE"
  | "UNFOLD_CONTENIDO_INSUFICIENTE"
  | "PROCESO_NO_TRANSFORMA"
  | "PROCESO_SISTEMICO_DESCONECTADO";

export interface AvisoMetodologico {
  codigo: CodigoChecker;
  severidad: SeveridadAviso;
  entidadId?: string;       // si el aviso refiere a una entidad
  opdId?: string;           // si refiere a un OPD
  mensaje: string;          // es-CL legible para el usuario
  rationale?: string;       // explicación SSOT-anclada (link a Met §, Glos §)
}
```

### 6.2 `checkers.ts` orquestador + 6 funciones

```typescript
// app/src/modelo/checkers.ts (~250 LOC)
// [Met §metodologia] [Glos 3.55] [Glos 3.69] verificacion metodologica.
// Refs: opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/*
//       (destilacion semantica; lógica reescrita para kernel propio).

import type { Modelo } from "./tipos/modelo";
import type { Entidad } from "./tipos/entidad";
import type { Enlace } from "./tipos/enlace";
import type { AvisoMetodologico } from "./tipos/avisos";

export function verificarMetodologia(modelo: Modelo): AvisoMetodologico[] {
  return [
    ...checkProcesoNombreFormaVerbal(modelo),
    ...checkObjetoNombreSingular(modelo),
    ...checkInzoomContenido(modelo),
    ...checkUnfoldContenido(modelo),
    ...checkProcesoTransforma(modelo),
    ...checkProcesoSistemicoConectado(modelo),
  ];
}

function checkProcesoNombreFormaVerbal(modelo: Modelo): AvisoMetodologico[] {
  // [Glos 3.69] procesos como verbo (infinitivo en es-CL: -ar/-er/-ir o sustantivado).
  // Reglas relajadas: aceptar tambien sustantivos verbales ("Producción", "Montaje").
  // Refs: opm-extracted/.../ing-checker.ts
  const procesos = Object.values(modelo.entidades).filter((e) => e.tipo === "proceso");
  return procesos
    .filter((p) => !esFormaVerbalValida(p.nombre))
    .map((p) => ({
      codigo: "PROCESO_NOMBRE_FORMA_VERBAL" as const,
      severidad: "sugerencia" as const,
      entidadId: p.id,
      mensaje: `El proceso "${p.nombre}" no parece estar en forma verbal canónica.`,
      rationale: "ISO 19450 §3.69 Process: nombrar como verbo (infinitivo o sustantivo verbal).",
    }));
}

function esFormaVerbalValida(nombre: string): boolean {
  // Heurística es-CL: termina en -ar/-er/-ir (infinitivo) o es sustantivo verbal terminado en -ción/-sión/-aje/-miento.
  // Tolerante con palabras compuestas y mayúsculas.
  const lower = nombre.trim().toLowerCase();
  return /(?:ar|er|ir|ción|sión|aje|miento|izar)$/.test(lower);
}

// ... 5 funciones análogas: checkObjetoNombreSingular, checkInzoomContenido, etc.
```

### 6.3 Decisión panel UI

**Opción A** — Extender `PanelAvisos.tsx`:
- Si `PanelAvisos` ya muestra advertencias generales, agregar tab/sección "Metodología" con `verificarMetodologia(modelo)` reactivo.
- Pro: un solo panel. Contra: si PanelAvisos tiene lógica densa, mezcla dominios.

**Opción B** — Nuevo `PanelMetodologia.tsx` hermano:
- Componente nuevo aislado, recibe `modelo` por props o `useOpmStore`, renderea lista de avisos agrupados por severidad.
- Pro: dominio aislado, futura iteración independiente. Contra: nuevo elemento UI a posicionar.

**Recomendación**: revisar `PanelAvisos.tsx` actual; si <100 LOC con lógica simple, opción A; si >100 LOC con dominio claro de "consistencia/errores", opción B con `PanelMetodologia` hermano (panel fluido o tabbed con PanelAvisos según UX).

Renderizado:
```tsx
// PanelMetodologia.tsx (opción B)
import { tokens } from "./tokens";
import { useOpmStore } from "../store/runtime";
import { verificarMetodologia } from "../modelo/checkers";

export function PanelMetodologia() {
  const modelo = useOpmStore((s) => s.modelo);
  const avisos = verificarMetodologia(modelo);

  if (avisos.length === 0) return null;  // o mensaje "Modelo metodológicamente válido"

  return (
    <div data-testid="panel-metodologia" style={/* tokens */}>
      <h3>Avisos metodológicos ({avisos.length})</h3>
      <ul>
        {avisos.map((a) => (
          <li key={`${a.codigo}-${a.entidadId ?? "global"}`}
              data-testid={`aviso-${a.codigo}`}
              style={{ color: severidadColor(a.severidad) }}>
            <strong>{a.codigo}</strong>: {a.mensaje}
            {a.rationale && <small>{a.rationale}</small>}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 6.4 Integración en `App.tsx`

`PanelMetodologia` se monta en una zona del layout no ocupada por L1 lazy ni L4 flotante. Candidato: zona inferior junto a `PanelOpl` o como tab en `PanelAvisos`. Verificar layout actual antes de decidir.

## 7. Tests obligatorios

**Unit tests (~150 nuevos)** en `checkers.test.ts`:

- 5-10 tests por checker (caso válido + casos inválidos representativos):
  - `checkProcesoNombreFormaVerbal`: "Procesar" ✓, "Proceso" ✗ (sustantivo no verbal), "Producción" ✓, "Montaje" ✓, "ABC" ✗.
  - `checkObjetoNombreSingular`: "Cliente" ✓, "Clientes" ✗, "Análisis" ✓ (invariable), "Datos" ✗.
  - `checkInzoomContenido`: in-zoom con 0 cosas ✗, 1 cosa ✗, 2+ cosas ✓.
  - `checkUnfoldContenido`: análogo.
  - `checkProcesoTransforma`: proceso sin Result/Consumption/Effect ✗, con uno ✓.
  - `checkProcesoSistemicoConectado`: proceso sistémico aislado ✗, conectado al SD principal ✓.

- 1 test integración `verificarMetodologia(modeloDemoCafetera)` que retorna 0 avisos (demo canónico debe ser válido).
- 1 test integración con modelo intencionalmente inválido (avisos esperados explícitos).

**Smoke browser** (`app/e2e/06-undo-redo-dirty.spec.ts`, `01-carga-y-workspace.spec.ts`), 2 nuevos:

- `06-*`: tras crear cosa con nombre inválido, `[data-testid="panel-metodologia"]` muestra aviso correspondiente.
- `01-*`: cargar `Cafetera Doméstica` (demo canónico), `[data-testid="panel-metodologia"]` muestra cero avisos o mensaje "modelo válido".

## 8. Verificación

```bash
cd app
bun run check          # 675 → ~825 (con +150 tests checkers)
bun run browser:smoke  # 93 → ~95 (con +2 smokes panel)
bun run build          # main chunk + ~3 kB por checkers + panel; sigue ≤ 195 kB post-L1 lazy
```

Verificar:

- `app/src/modelo/checkers.ts` ≤ 300 LOC.
- `app/src/modelo/checkers.test.ts` cubre los 6 checkers + integración.
- `app/src/modelo/tipos/avisos.ts` exportado desde `tipos.ts`.
- `app/src/ui/PanelMetodologia.tsx` (o extensión PanelAvisos) monta correctamente.
- Demo canónico Cafetera Doméstica produce 0 avisos.

## 9. Decisiones bloqueadas (no reabrir)

- **`AvisoMetodologico` NO se serializa**: derivado puro del modelo, calculado en runtime. JSON lossless preservado.
- **Avisos son blandos** (sugerencia/advertencia/info), NO errores. NO bloquean operaciones del usuario.
- **Heurística es-CL para forma verbal**: tolerante con sustantivos verbales (`-ción`, `-sión`, `-aje`, `-miento`, `-izar`) además de infinitivos. NO usar lista exhaustiva de verbos (mantenibilidad).
- **NO renderizar avisos como overlays canvas en ronda 13**: ronda futura podría hacerlo (badges sobre entidades inválidas) con event gatillante.
- **NO modificar generadores OPL**: avisos son sobre semantica del modelo, no sobre la lente OPL.
- **NO copiar 1:1 desde opm-extracted**: destilación semántica, lógica reescrita para kernel propio. Cita obligatoria al checker original en cada función.

## 10. Decisiones que tomas vos (documentar en commit)

- **Opción A (extender PanelAvisos) vs Opción B (PanelMetodologia hermano)**: decidir tras leer `PanelAvisos.tsx` actual. Documentar elección en commit + rationale.
- **Heurística exacta de `esFormaVerbalValida`**: el slice §6.2 propone regex tolerante; ajustar tras tests con nombres reales del catálogo demo (Cafetera/OnStar/Diagnóstico/Logística/Async/CalControl/Organizacional).
- **Mensajes en es-CL**: cada checker emite mensaje legible. Documentar tabla final.
- **Severidad por checker**: el slice usa "sugerencia" para nombres y "advertencia" para estructurales (in-zoom, transformación). Ajustar si emerge consenso distinto.
- **Layout de `PanelMetodologia`**: posición exacta en App.tsx (lateral, inferior, tabbed). Verificar que no choca con L1 lazy ni L4 flotante.
- **Modelo IFML exacto del panel**: documentar si queda como `PanelAvisos` extendido (mismo ViewContainer) o `PanelMetodologia` hermano (ViewComponent/List derivado). En ambos casos, entrada = DataFlow desde `modelo`, salida opcional = NavigationFlow al elemento afectado.
- **Si checker requiere helper kernel nuevo** (ej. `cosasEnInzoom(opdId)`), agregarlo en `app/src/canvas/reglasTraer.ts` o `app/src/modelo/operaciones/refinamiento/*.ts` SOLO si es trivialmente puro y aditivo. Si requiere refactor mayor, **abortar y reportar**.
- **Si demo Cafetera produce avisos inesperados**: documentar y decidir si (a) ajustar heurística, (b) corregir demo (ronda 14 fixtures), o (c) aceptar como evidencia de imperfección del demo.

## 11. Forma del entregable

Al cierre de L3, declarar:

- Hash final del último commit en main.
- LOC delta por archivo (`git diff --stat HEAD~10 HEAD` aprox 10 commits).
- Output de `bun run check`, `bun run browser:smoke`, `bun run build` (último tail).
- Lista de commits creados en orden + rationale por uno.
- Decisiones declaradas (§10): opción A/B, heurística forma verbal, mensajes, severidades, layout panel.
- Conteo de tests: ~150 unit nuevos (5-10 por checker × 6) + 2 integración + 2 smokes.
- Tabla de avisos producidos por cada demo del catálogo (Cafetera/OnStar/Diagnóstico/Logística/Async/CalControl/Organizacional): conteo por checker.
- Mapa IFML L3: DataFlow `modelo → avisos`, ViewComponent elegido y cualquier NavigationFlow "Ir al elemento".
- Confirmación archivos no tocados (de §5).

Commits sugeridos (orden):

1. `feat(modelo): tipo AvisoMetodologico + SeveridadAviso + CodigoChecker (T2.3 steipete)`
2. `feat(modelo): checker proceso forma verbal (T2.3; refs ing-checker opm-extracted)`
3. `feat(modelo): checker objeto singular (T2.3; refs object-name-as-singular)`
4. `feat(modelo): checker inzoom contenido ≥2 (T2.3; refs inzoomed-content)`
5. `feat(modelo): checker unfold contenido ≥2 (T2.3; refs part-unfold-content)`
6. `feat(modelo): checker proceso transforma (T2.3; refs transforming-process)`
7. `feat(modelo): checker proceso sistemico conectado (T2.3; refs systemic-processes-main-function)`
8. `feat(modelo): verificarMetodologia orquestador + integracion`
9. `feat(ui): PanelMetodologia (o extension PanelAvisos) con avisos agrupados por severidad`
10. `test(modelo): cobertura ~150 tests por checker + 2 integracion`
11. `test(e2e): smokes panel metodologia visible + demo canonico cero avisos`

Cada commit debe dejar la rama verde. Co-author si aplica.

Si dudás de un caso límite: detente y reporta al operador antes de actuar.
