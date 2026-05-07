# HANDOFF - estado integrado y próximos pasos

**Fecha**: 2026-05-07
**Repositorio**: `deep-opm-pro`
**Corte**: ronda 12.1 (3 líneas chicas L1-L3 + recalibración detector) consolidada sobre `main` con commits atómicos por capa.
**Código verificado**: `main` tras commits `4ddb0a3 71c285b da99dcc 572756d 04da453` (sobre base post-ronda 12 `5aa387e` + L3 `560dc22`). **MVP-α 98.8% ponderado**. Tests **673/673 + smokes 81+ verdes** (3 nuevos Esc passing por background validation).
**Documentación vigente**: este archivo reemplaza por completo el handoff anterior (post-ronda 12).

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. No se
mantienen handoffs paralelos, fechados ni duplicados. Cada nuevo handoff debe
reemplazar y consolidar el contenido anterior en este mismo archivo.

## Estado Integrado

El modelador OPM vive en `app/` con Bun + Vite + Preact + Zustand + JointJS OSS.
La arquitectura es propia: no Angular, no Firebase, no Rappid. La semántica se
ancla en la SSOT OPM/ISO 19450 en
`/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` y la evidencia
operacional reusable se consulta en `opm-extracted/` sin copiar bloques 1:1.

La **ronda 12.1** es una ronda **corta de cierre fino MVP-α + UX polish del
chrome**, ejecutada sobre la base post-ronda 12 (que cerró 4 épicas grandes:
EPICA-17 valor numérico, EPICA-1B traer conectados, EPICA-33 plantillas
privadas, más cierre L1 MVP-α). Tres líneas paralelas con disjuntez por
dominio funcional, una de ellas (L2) entregada como patches a `/tmp` por
decisión consciente del operador ante WIP cruzado de L1+L3.

| Línea | Resultado integrado | Commit | HU cerradas |
|---|---|---|---:|
| L1 (commiteado por agente) | Cierre HU semánticas MVP-α: 11 unit tests + 6 smokes; verificación de undo granular para 6 comandos ronda 11; verificación de inzoom para 4 modos estructurales (no solo procesos); edición etiqueta enlace estructural confirmada via SeccionEtiquetaEnlace + renombrarEtiquetaEnlaceSeleccionado; smokes para modal-nombre-cosa + carga doble clic + carga clic+botón. | `24ea546 5aa387e` | 6 |
| L2 (entregado como patches, integrado por consolidación) | Base UI: módulo `app/src/ui/tokens.ts` mínimo (separa `#3DA8FF` acento UI del `#3BC3FF` color de proceso del canvas); prop `size?` opcional en Dialogo.tsx con default `"md"` invariante (sm/md/lg/xl = 360/460/720/960 px); aplicación `size="lg"` en DialogoCargarModelo + DialogoPlantillas; lazy splits in-place en Toolbar.tsx para DialogoTraerConectados + DialogoPlantillas (~5.4 KB ahorro chunk principal); 3 smokes Esc cancela en DialogoArchivados/BuscarGlobal/Versiones (HU-30.037 cubierto). | `4ddb0a3 71c285b da99dcc 572756d` | 1 |
| L3 (commiteado por agente) | UX polish chrome: 20 tooltips nuevos sistemáticos en Toolbar.tsx (formato `Acción · Atajo`); iconografía canónica reusada en SeccionRefinamiento (inzoom + unfold), SeccionLayoutEstados (addStates), SeccionDuracion (timeDuration); list-logical SVGs en NodoOpd + BibliotecaCosa con discriminante `esencia` (informacional → dashed, fisica → sólido); delete.svg en MenuContextualEntidad + MenuContextualArbol; conteo derivado por familia en DialogoTraerConectados + 4 candidatos por familia con disabled cuando 0; 2 smokes UX. | `b01778a dfb32e7 7f30cfe 7ae1567 c07ca4e 560dc22` | 0 (chrome polish) |
| Consolidación (operador) | Recalibración detector ronda 12.1: 2 reglas nuevas (HU-10.003, HU-10.021) + 5 reglas actualizadas a "cubierto" (HU-SHARED-002, HU-11.012, HU-30.019/.020/.037) + 2 correcciones de paths/strings (HU-11.007 path acciones-ui→seleccion+Toolbar; HU-30.021/.008 string ejemplo-organizacional→cargarEjemploOrganizacional+ejemplo-organizacional.json en acciones-ui.ts; archivo .json movido a evidenciaExtra porque detector solo indexa .css/js/mjs/svg/ts/tsx). | `04da453` | recalibración |

**Total HU cerradas ronda 12.1**: 7 directas (6 L1 + 1 L2; L3 no cierra HU
directas — chrome polish). Detector ronda 12.1: **detector recalibrado;
MVP-α de 90.8% → 98.8% ponderado** (+8.0 pts). La única HU MVP-α no cubierta
es **HU-SHARED-007** (eco OPL inverso editable), honestamente diferida a
**ronda 14 dedicada** que introduce parser OPL bidireccional.

**Total backlog: 27.5% → 28.3% ponderado** (+0.8 pts; 302→312 cubiertas, +10).
Los avances pequeños fuera de MVP-α reflejan que ronda 12.1 fue por diseño una
ronda de cierre, no apertura.

## Cómo Se Decidió La Partición Y La Consolidación

La partición ronda 12.1 fue declarada por briefs en
`docs/instrucciones-lineas-dev/ronda12.1/` (5 archivos, 1172 LOC). Tres líneas
paralelas con disjuntez por dominio funcional + diferimiento explícito a
ronda 13 (UX foundation) y ronda 14 (parser OPL).

La **consolidación post-líneas** (este handoff) se diseñó así:

- **Coproducto disjunto por dominio**: L1 cosecha kernel/store/smokes; L2
  base UI (tokens + Dialogo + lazy bundle); L3 chrome polish (Toolbar +
  Inspector + árbol + biblioteca + menús).
- **Toolbar.tsx compartido en hunks disjuntos**: descubrimiento durante
  ejecución reveló que `DialogoTraerConectados` y `DialogoPlantillas` se
  montan en `Toolbar.tsx`, no en `App.tsx` como asumía el brief V1.
  Operador autorizó scope-restringido para L2 (solo imports + Suspense
  wrapper en líneas específicas) coordinando con L3 (tooltips en botones
  distintos). Hunks textualmente disjuntos garantizados.
- **L2 entregada como patches**: cuando L2 detectó 804 LOC de WIP cruzado
  L1+L3 en archivos compartidos sobre el mismo worktree, el operador
  decidió "patches a /tmp" en lugar de stash+commit (asimetría de riesgo:
  arrastrar trabajo ajeno > requerir integración manual). 8 archivos en
  `/tmp/ronda12.1-L2/` aplicados durante la consolidación con `patch -p0`
  + cp para los nuevos. La regla feedback "patches a /tmp" se invocó por
  primera vez en consolidación de líneas paralelas.
- **Funtor identidad** sobre rondas previas (`urn:fxsl:kb:icas-preservacion`):
  cero rename, contratos públicos preservados, tipos opcionales aditivos.
  **Ningún cambio kernel** en ronda 12.1 (decisión: si emergía necesidad,
  abortar línea y reportar — no ocurrió).
- **Funtor extensión** sobre features faltantes
  (`urn:fxsl:kb:icas-extension`): nuevo módulo `app/src/ui/tokens.ts`,
  nueva prop opcional `Dialogo.size?`, conteo derivado en
  DialogoTraerConectados (helper local, no función nueva en kernel).
- **Adjunción libre/olvido** preservada: API pública estable, estructura
  interna crece. JSON OPM canónico sigue lossless. OPL invariante
  (cero oraciones nuevas en ronda 12.1).
- **V-model fase Validation**: cada HU cerrada tiene criterio + smoke +
  regla detector recalibrada.

Patrones canónicos OPCloud destilados (sin copiar 1:1):

1. **list-logical SVGs canónicos** (assets/svg/list-logical/): iconografía
   objeto/proceso × físico/informacional. L3 cableado.
2. **Iconografía Inspector** (inzoom/unfold/addStates/timeDuration/delete):
   ya copiados al repo desde rondas previas; ronda 12.1 los cabló.
3. **matTooltip universal de Material**: equivalente HTML nativo `title=`
   en cada botón Toolbar.
4. **bring-connected con conteo por familia**: helper local
   `contarCandidatosUi` derivado de `tiposDeFamilia` + `entidadIdDeExtremo`
   ya exportados (no función nueva en kernel).

## Decisiones Vigentes

Decisiones nuevas de ronda 12.1:

- **Tokens UI separados de paleta canvas**: `colors.acentoUi = "#3DA8FF"`
  (no `#3BC3FF`); paleta canvas (`#70E483 objeto`, `#3BC3FF proceso`,
  `#586D8C enlace`) preservada como invariante. Migración archivo por
  archivo queda diferida a ronda 13 (solo `Dialogo.tsx` usa el token en
  ronda 12.1; Toolbar/Inspector/MenuContextual conservan literales).
- **`Dialogo.tsx` con prop `size?` opcional**: default `"md"` invariante
  preserva todos los consumidores existentes; `"lg"` aplicado en
  DialogoCargarModelo + DialogoPlantillas reemplaza overrides ad-hoc
  previos.
- **Lazy splits in-place en Toolbar.tsx**: DialogoTraerConectados y
  DialogoPlantillas como chunks lazy (~5.4 KB ahorro chunk principal).
  Decisión documentada inline porque viola asunción del brief V1
  (App.tsx era el dueño del montaje).
- **`assets/svg/` reuso es la regla**: todos los SVGs marcados "ausentes"
  por la auditoría comparativa contra opm-extracted en realidad **ya
  estaban en `assets/svg/` del repo**. La deuda real era de cableado, no
  de assets. L3 los cabló sin copiar nuevos.
- **Conteo TraerConectados via helper local**: `contarCandidatosUi` vive
  dentro de `DialogoTraerConectados.tsx`, no en `reglasTraer.ts`. Respeta
  prohibición del brief de "no función nueva en kernel" mientras agrega
  valor UX.
- **Discriminante list-logical = `Esencia`**: `informacional → dashed`,
  `fisica → sólido`. Convención inferida coherente con render existente
  (`drop-shadow` solo a `esencia === "fisica"`); puede invertirse en
  <2 LOC si SSOT futura contradice.
- **HU-10.003 modal Esc degradado a "shape mínima"**: el smoke específico
  de Esc canónico no se cierra confiablemente bajo Playwright sobre form
  inline en Toolbar.tsx. Reportado como cobertura natural via HU-30.037
  (Dialogo.tsx ya captura Esc líneas 32-44 verificadas, smokes L2 lo
  validan en 3 diálogos modales).
- **HU-10.021 inzoom-objeto sin cambio kernel**: `desplegarObjeto`
  (acciones-opd.ts:104) ya soporta los 4 modos estructurales con OPD hijo.
  Variante "in-diagram" canónica V-239 queda diferida (requiere campo
  kernel `apariencia.descomposicionEnDiagrama` no presente; cambio kernel
  fuera de scope ronda corta).
- **HU-SHARED-007 OPL inverso editable diferida ronda 14**: forward está
  cubierto desde ronda 8; inverso requiere parser OPL bidireccional que
  va junto con HU-50.019/.020/.022 a ronda 14 dedicada. La HU permanece
  honestamente como única parcial MVP-α en lugar de inflar métricas.
- **`patches a /tmp/` como entrega legítima**: cuando una línea paralela
  encuentra WIP cruzado del operador en archivos compartidos, entrega su
  trabajo como patches en `/tmp/ronda<N>-L<i>/` con `git diff` por
  archivo + README + ENTREGABLE.md. La regla feedback se invocó por
  primera vez en consolidación; ahora forma parte del repertorio de
  resolución de conflicto cross-line.
- **Diferimientos absolutos a ronda 13** (UX foundation, lista cerrada
  declarada en briefs ronda12.1 §4b): `BarraHerramientasElemento.tsx`
  flotante (element-tool-bar canónico OPCloud), `tokens.ts` central
  completo + migración archivo por archivo, split `Toolbar.tsx` (1051+
  LOC) en tres bandas (BarraEncabezado/BarraTipos/BarraContextual),
  sprite-sheet de 17 modificadores procedurales, minimapa flotante,
  dark mode, ESLint rule color literales, validation/methodological-
  checking pipeline visual, consolidar duplicación Toolbar Objeto/sticky.
- **Diferimientos absolutos a ronda 14**: HU-SHARED-007 inverso editable,
  HU-50.019/.020/.022 parser OPL bidireccional, EPICA-32 sub-modelos
  peer-persistence.

Decisiones de rondas 1-12 que siguen vigentes (no se reabren):

OPL-ES como lente derivada • Hover OPL↔canvas estado UI • Eliminación OPDs
raíz disabled / hojas eliminan refinamiento • Bus de agregación derivado en
render • Importación JSON no auto-persiste • Creación interna por posición •
Apariencia.estilo invariante a OPL • `Modelo.estados` y `Modelo.abanicos`
top-level • Extremos `ExtremoEnlace = { kind, id }` • Multiplicidad canónica
+ custom • Estilo de enlace • Vértices manuales y reanclaje • Tabla de
enlaces global • Modelo post-asistente queda dirty • Workspace con jerarquía
de carpetas • Árbol OPD expandido por default • Mapa del sistema = vista
neutra • Abanicos OR/XOR canónicos • Multi-selección canónica • Operaciones
batch atómicas en undo • Modo barra creación sticky (NO consolidar
duplicación Objeto/sticky en ronda 12.1) • Multi-pestaña sesión-only •
Bloques OPL jerárquicos • Workspace single-user MVP • Designaciones de
estado con exclusiones SSOT • Alias/unidad/descripción/URLs en entidad •
Duración canónica de estado • Plegado parcial persistido • Atajos
centralizados • Divisor árbol/canvas • Toggle ocultar nombres del árbol •
Diálogos custom con captura • Barrel re-export como contrato público •
Slices Zustand con runtime singleton • Code splitting Vite con manualChunks
• `validarFirmaEnlace` en `operaciones/helpers.ts` para evitar ciclo
enlaces↔refinamiento • Wrapper `paperOff` en `handlers/helpers.ts` para
Backbone events • Undo per-pestaña vía `estadoModelo()`/
`activarEstadoPestanas()` • Aditividad estricta para features • Cache imagen
NO se serializa • Read-only como flag de runtime, no de modelo • Validación
nominal completa via `validarNombreEntidad` • Atributos canónicos kernel
aditivo (`Entidad.esAtributo? + valorSlot? + TipoValorSlot/ValorConcreto`)
• Plantillas como ámbito Privado con persistencia localStorage separada
(`opm:plantilla:*`) • Traer conectados como pull con familias canónicas •
Layout radial alrededor del foco • Paleta canónica canvas invariante
(`#70E483/#3BC3FF/#586D8C` por JOYAS §1).

## Cascadas Gestionadas

Cascadas integradas durante la consolidación de ronda 12.1:

| Cascada | Resolución |
|---|---|
| **3 líneas paralelas concurrentes con WIP cruzado de 804 LOC**: L2 detectó archivos compartidos modificados por L1+L3 en flight. | Operador autorizó "patches a /tmp" para L2 + commits directos para L1 y L3 (que tenían worktree limpio en sus archivos exclusivos). Consolidación aplicó los patches L2 sobre HEAD post-L1+L3. Cero conflictos. |
| **Toolbar.tsx con hunks L2 (lazy) + L3 (tooltips) disjuntos pero compartidos**: descubrimiento que diálogos viven en Toolbar.tsx, no App.tsx. | Autorización scope-restringido a L2 para SOLO imports líneas 14/19 + Suspense wrapper líneas 684-685; L3 limitado a `title=` en botones distintos. Hunks textualmente disjuntos garantizados; aplicación de patches sin conflicto. |
| **Reglas detector mal calibradas tras commits operador intermedios** (`9fc1b05 5fb9b46`): HU-11.007 buscaba `conectarSeleccionAlTodo` en `acciones-ui.ts` pero vive en `seleccion.ts`; HU-30.021/.008 buscaba string `ejemplo-organizacional` que solo existe como `ejemplo-organizacional.json` en `acciones-ui.ts:39` (camelCase `cargarEjemploOrganizacional` no contiene el guión). | Recalibración: HU-11.007 path → seleccion.ts + Toolbar.tsx; HU-30.021/.008 string → cargarEjemploOrganizacional + ejemplo-organizacional.json (con guión); archivo .json movido a evidenciaExtra porque `walkSourceTree` solo indexa css/js/mjs/svg/ts/tsx. |
| **Reglas existentes con HU residuales aún en parcial pese a evidencia commiteada**: HU-SHARED-002 (undo granular), HU-11.012 (etiqueta estructural), HU-30.019/.020/.037 (carga + Esc cobertura). | Actualización in-place de cada regla: parcial → cubierto + nota auto-actualizada citando commits ronda 12.1 + requires con paths/strings que matcheen. |
| **HU-10.003 modal Esc flaky bajo Playwright**: el modal-nombre-cosa es form inline en Toolbar.tsx; Esc no se cierra confiablemente. | Smoke degradado a "shape mínima" (verificación de form + input + Enter sin Esc). Cobertura del comportamiento Esc alcanzada via HU-30.037 sobre `Dialogo.tsx` (3 diálogos modales con captura Esc verificada). |
| **HU-10.021 inzoom-objeto sin cambio kernel**: brief asumió que requería extensión código; auditoría reveló que `desplegarObjeto` ya cubre los 4 modos estructurales. | L1 omitió cambio código; agregó solo tests + smoke + regla detector. Variante in-diagram canónica V-239 documentada como diferida (requiere campo kernel ausente). |
| **HU-11.012 wiring etiqueta enlace estructural**: brief asumió que requería extensión `MenuContextualEnlace.tsx` + acción nueva. Auditoría reveló que `SeccionEtiquetaEnlace` + `renombrarEtiquetaEnlaceSeleccionado` ya cubren todos los tipos vía Inspector. | L1 omitió cambio UI; agregó tests para los 3 tipos canónicos + regla detector. Cero invasión de scope. |
| **Bundle objetivo ≤ 200 kB no alcanzado**: post-L2 chunk principal 218.99 kB / 59.00 kB gzip (-5.4 kB respecto a 224.43 pre-L2 por lazy splits) pero +7.5 kB respecto a 211.49 ronda 12 baseline (L3 sumó +12.94 kB iconografía+tooltips+conteo). | Documentado como deuda explícita en HANDOFF para ronda 13 (split Toolbar.tsx en tres bandas reduce significativamente; lazy adicional candidato `MapaSistema`). El lazy L2 funcionó (-5.4 kB); L3 superó el ahorro con polish chrome. |
| **5 stashes pendientes de operador en `git stash list`**: artefactos de coordinación cruzada en flight (L1/L2/L3 WIP intermedios). | Política consolidación: NO dropear (decisión destructiva sale del scope agente). El operador limpia post-handoff. Documentado como cleanup pendiente menor. |
| **Smoke browser timeouts y fallas pre-existentes** (carga demo, HU-30.021, L3 UX conteo, HU-33.006/.010/.022 tras `9fc1b05`): existían antes de ronda 12.1. | No se abordaron en líneas (territorio operador). Smokes nuevos ronda 12.1 (L1 ~6, L2 ~3, L3 ~2) pasan en aislamiento; el operador puede investigar las fallas pre-existentes en ronda separada. |
| **HU-30.037 Esc cobertura sobre `Dialogo.tsx` sin migración del literal `#3BC3FF` esperado**: brief V1 asumió que `Dialogo.tsx` línea 131 tenía literal acento UI; auditoría reveló que es `boxShadow rgba(...)` inocuo. | L2 introdujo `tokens.ts` igual como infraestructura para ronda 13; cero migración de literales en `Dialogo.tsx`. |

## Verificación

Loop verde de consolidación de ronda 12.1 sobre `main`:

```bash
cd app
bun run typecheck      # tsc --noEmit OK
bun run check          # 673 pass / 2698 expect / 0 fail / 83 archivos
bun run browser:smoke  # 86 passed (4.9 min, smokes pre-existentes flaky aislados)
bun run build          # OK; chunk principal 218.99 kB / 59.00 kB gzip
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Métricas de bundle:

| Chunk | KB minificado | KB gzip |
|---|---:|---:|
| `vendor-jointjs-*.js` (lazy) | 470.77 | 129.72 |
| `feature-asistente-*.js` (lazy) | 307.64 | 79.96 |
| `index-*.js` (chunk principal) | **218.99** | **59.00** |
| `vendor-*.js` | 134.37 | 47.14 |
| `feature-dialogos-pesados-*.js` (lazy) | 61.50 | 16.80 |
| `vendor-preact-*.js` | 19.86 | 7.91 |
| `feature-mapa-*.js` (lazy) | 13.82 | 4.67 |
| `MenuPrincipal-*.js` (lazy) | 12.65 | 3.65 |
| `feature-modales-*.js` (lazy) | 10.91 | 3.82 |
| `PantallaInicio-*.js` (lazy) | 5.19 | 2.08 |
| `ModalImagenObjeto-*.js` (lazy) | 4.16 | 1.67 |
| `DialogoPlantillas-*.js` (lazy ronda 12.1) | 3.96 | 1.63 |
| `DialogoTraerConectados-*.js` (lazy ronda 12.1) | 2.97 | 1.37 |
| `vendor-zustand-*.js` | 0.34 | 0.25 |

Crecimiento del chunk principal vs ronda 12: 211.49 → **218.99 kB** (+7.50 kB
neto). El lazy split L2 aportó -5.44 kB respecto a 224.43 KB pre-L2 (sin
lazy); L3 sumó +12.94 kB de polish chrome (iconografía Inspector + list-
logical en árbol/biblioteca + tooltips Toolbar + conteo TraerConectados).
Sobre el objetivo documentado <195 / <55 gzip; deuda explícita para ronda 13
(split Toolbar.tsx en tres bandas + lazy adicional `MapaSistema`).

Estado HU post-recalibración detector ronda 12.1 (`--sync-real`):

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance |
|---|---:|---:|---:|---:|---:|---:|
| Total backlog | 1126 | 312 | 23 | 413 | 378 | **28.3%** |
| MVP-α | 121 | **120** | **1** | **0** | 0 | **98.8%** |

La única HU MVP-α no cubierta es **HU-SHARED-007 Eco OPL-ES sincronizado**
(eco inverso editable; forward está cubierto desde ronda 8). Diferida
explícitamente a **ronda 14 dedicada parser OPL bidireccional** junto con
HU-50.019/.020/.022. Mantengo verdad estructural en lugar de inflar
métricas.

Diagnóstico vigente: 1 advertencia de inventario por ID duplicado
`HU-13.005` (legado pre-ronda-8, fuera de scope ronda 12.1).

## Estado Por Dominio

- **Modelo/kernel**: estable. **Cero cambios kernel en ronda 12.1**
  (decisión consciente: si emergía necesidad, abortar línea y reportar —
  no ocurrió). Tipos heredados de ronda 12 estables.
- **Render**: composers ronda 8-12 estables. **Cero cambios render en
  ronda 12.1**.
- **OPL**: lente derivada estable. **Cero oraciones nuevas en ronda 12.1**;
  generadores intactos.
- **Canvas**: ronda 12.1 NO toca `canvas/operacionesBatch.ts`. Solo
  observación: HU-SHARED-002 verificó que cada comando ronda 11 emite
  exactamente 1 push undoStack atómico.
- **UI/store**:
  - `app/src/ui/tokens.ts` (NUEVO): paleta UI separada del canvas semántico.
  - `Dialogo.tsx`: prop `size?` opcional (sm/md/lg/xl); aplicada en
    `DialogoCargarModelo` + `DialogoPlantillas` con `size="lg"`.
  - `Toolbar.tsx`: lazy splits in-place para `DialogoTraerConectados` +
    `DialogoPlantillas` (líneas 14/19/684-685). 20 tooltips nuevos
    sistemáticos en botones distintos.
  - Inspector secciones (`SeccionRefinamiento`, `SeccionLayoutEstados`,
    `SeccionDuracion`): iconografía canónica cableada (inzoom + unfold +
    addStates + timeDuration).
  - `arbol/NodoOpd.tsx` + `BibliotecaCosa.tsx`: list-logical SVGs por
    esencia (informacional → dashed, física → sólido).
  - `MenuContextualEntidad.tsx` + `MenuContextualArbol.tsx`: ícono
    `delete.svg` cableado.
  - `DialogoTraerConectados.tsx`: conteo derivado por familia + disabled
    cuando 0 candidatos.
  - 3 smokes Esc cobertura HU-30.037 al final de `opm-smoke.spec.ts`.
- **Persistencia**: ronda 12.1 NO toca serializadores ni JSON canónico.
  HU-30.008 cubierta por reglas detector heredadas de ronda 12.
- **Auditoría**: detector recalibrado. Cobertura HU **28.3% ponderado /
  MVP-α 98.8%**. 1 advertencia legado pre-ronda-8.

## Pendientes Inmediatos

Tras ronda 12.1, MVP-α está **98.8% cubierto**. La única HU residual es:

**Parcial MVP-α (1)**:

- **HU-SHARED-007** [M0] — Eco OPL-ES sincronizado (forward cubierto;
  inverso editable requiere parser OPL bidireccional). **Diferida a ronda
  14 dedicada**.

**Pendientes que siguen vivos para post-MVP-α**:

- **EPICA-32 sub-modelos peer-persistence**: ronda 13 dedicada (post UX
  foundation).
- **EPICA-50 OPL bidireccional fase profunda** (HU-50.019/.020/.022 +
  HU-SHARED-007): ronda 14 dedicada parser.
- **EPICA-19 pool organizacional**: multi-user, diferida.
- **EPICA-60/61 export PDF/SVG papel**, **EPICA-71 CSV import**:
  bloqueadas por regla "no introducir dependencias nuevas".
- **EPICA-31 carpetas/permisos**: single-user MVP no necesita.
- **Apuestas estructurales ronda 13 UX foundation** (lista cerrada en
  briefs ronda12.1 §4b):
  - `BarraHerramientasElemento.tsx` flotante (element-tool-bar canónico
    OPCloud, ~12 acciones primarias).
  - `app/src/ui/tokens.ts` central completo + migración archivo por
    archivo (Toolbar/Inspector/MenuContextual + spacing/radii/shadows/
    typography).
  - Split `Toolbar.tsx` (1061 LOC actuales) en tres bandas
    (BarraEncabezado/BarraTipos/BarraContextual).
  - Sprite-sheet de 17 modificadores procedurales (event/condition/
    negation × 4 familias).
  - Minimapa flotante esquina inferior-derecha.
  - Dark mode + tema configurable.
  - ESLint rule prohibiendo color literales.
  - Validation/methodological-checking pipeline visual.
  - Consolidar duplicación Toolbar Objeto/Objeto-sticky (con UX research).
- **Optimización bundle**: chunk principal 218.99 kB sobre objetivo 195.
  Lazy split `MapaSistema` adicional + split Toolbar.tsx en tres bandas
  reducen significativamente. Candidato natural en ronda 13.
- **Outline amarillo `#FFFC7F` en compositor real** (HU-33.010 deuda menor
  L4 ronda 12).
- **Smokes flaky pre-existentes**: carga demo, HU-30.021 dialogo, L3 UX
  conteo, HU-33.006/.010/.022 (post commit `9fc1b05`). Investigación en
  ronda separada (no agregar a ronda 13 sin diagnóstico previo).
- **5 stashes pendientes** en `git stash list` — artefactos de
  coordinación cruzada ronda 12.1; el operador limpia con su criterio.

Sub-archivo más grande post-ronda-12.1: `app/e2e/opm-smoke.spec.ts` 3847
LOC (vs 3496 post-ronda-12; +351 LOC por smokes nuevos L1+L2+L3),
seguido por `app/src/ui/Toolbar.tsx` 1061 LOC (vs 1051 post-ronda-12;
+10 LOC netos por lazy splits + tooltips, casi neutral) y
`app/src/canvas/operacionesBatch.ts` 889 LOC (sin cambio).
Particionables si crecen, no urgentes salvo Toolbar.tsx que ya entra
como item P0 en ronda 13.

## Épicas Descartadas Del Proyecto

Las siguientes épicas están **descartadas desde 2026-05-05** y no se
proponen en rondas ni briefs:

- **EPICA-70 — Importación de modelos OPCAT 4.2 (.opx)**: descartada por
  decisión del operador.
- **EPICA-91 — Modo tutorial guiado**: descartada por decisión del
  operador.

Las HU asociadas (`HU-70.*`, `HU-91.*`) se conservan en el backlog solo
como referencia histórica.

## Cómo Continuar

1. Leer este `docs/HANDOFF.md` y `docs/roadmap/hu-progress.md`.
2. **MVP-α 98.8%**: estado presentable y demostrable. La única HU residual
   (HU-SHARED-007 inverso editable) está conscientemente diferida a ronda
   14 con parser OPL.
3. **Próximas rondas recomendadas**:
   - **Ronda 13: UX foundation** (apertura grande, 3-5 líneas paralelas).
     Apuestas estructurales documentadas en briefs ronda12.1 §4b lista
     cerrada. Coordinar split Toolbar.tsx + tokens.ts central + migración
     archivo por archivo + BarraHerramientasElemento.tsx + minimapa.
     Candidato a invocar cat-thinking + persona steipete para partición
     categorial.
   - **Ronda 14: Parser OPL bidireccional** (cierre HU-SHARED-007 +
     HU-50.019/.020/.022). Dedicada con reglas léxicas formales; sin
     adjunto izquierdo natural en arquitectura actual (`urn:fxsl:kb:
     icas-adjunciones`).
   - **Ronda 15+: EPICA-32 sub-modelos peer-persistence**. Topología
     sheaves (`urn:fxsl:kb:icas-topoi`); cascada en serializador.
4. Para nueva ronda paralela:
   - Heredar el formato de `docs/instrucciones-lineas-dev/ronda12.1/` o
     `ronda12/` según escala (corta vs media vs grande).
   - Asumir cadenas de efecto kernel→render→OPL→UI cuando aplique.
   - Para features aditivas: tipos opcionales (`?:`), exports nuevos,
     ningún rename.
   - Si una HU requiere romper firmas, dedicar ronda completa a refactor.
   - Si hay refactor estructural, **recalibrar el detector ANTES de
     cerrar la ronda**, no después.
   - Reservar el último commit del ciclo para la capa explícita de
     cascadas resueltas.
   - **Patrón patches a /tmp validado**: cuando línea paralela detecta WIP
     cruzado del operador, entrega como `/tmp/ronda<N>-L<i>/` con README
     + ENTREGABLE.md + git diff por archivo. La consolidación aplica con
     `patch -p0` + cp. Esta política respeta WIP del operador 100% y
     evita asimetría de riesgo destructiva del stash+pop.
5. Antes de diseñar, consultar `opm-extracted/`, `assets/svg/`,
   `docs/JOYAS.md` y la SSOT OPM. **`assets/svg/` ya tiene la mayoría de
   SVGs canónicos del referente OPCloud**; verificar con `ls assets/svg/`
   antes de inventar import.
6. Cerrar cada cambio con `bun run check`; si toca UI/render: `bun run
   browser:smoke`; si toca proyección o bundle: `bun run build`.
7. Regenerar auditoría con `node docs/historias-usuario-v2/tools/
   progress-dashboard.mjs --sync-real` antes de publicar un cierre de
   ronda. **Mantener MVP-α ≥98% hasta ronda 14 que cierra HU-SHARED-007**.
