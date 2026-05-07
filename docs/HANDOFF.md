# HANDOFF - estado integrado y próximos pasos

**Fecha**: 2026-05-07
**Repositorio**: `deep-opm-pro`
**Corte**: ronda 13 (UX foundation + cleanup TIER 1 + enmienda IFML) consolidada sobre `main`.
**Código verificado**: `main` tras `e0957af` y este handoff. **MVP-alpha 98.8% ponderado**, **103/103 smokes**, **871 unit tests**, `lint` verde, `build` OK.
**Documentación vigente**: este archivo reemplaza por completo el handoff anterior post-ronda 12.1.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. No se
mantienen handoffs paralelos, fechados ni duplicados. Cada nuevo handoff debe
reemplazar y consolidar el contenido anterior en este mismo archivo.

## Estado Integrado

El modelador OPM vive en `app/` con Bun + Vite + Preact + Zustand + JointJS OSS.
La arquitectura sigue siendo propia: no Angular, no Firebase, no Rappid. La
semántica se ancla en la SSOT OPM/ISO 19450 en
`/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` y la evidencia
operacional reusable se consulta en `opm-extracted/` sin copiar bloques 1:1.

La **ronda 13** ejecutó la recomendación primaria de la auditoría steipete:
primero **ronda 13.0** de cleanup TIER 1, luego una ronda grande de **UX
foundation TIER 2** con cuatro líneas paralelas. La auditoría IFML posterior
quedó absorbida como contrato de interacción para L1/L3/L4, sin abrir cambios
sistémicos fuera de scope.

La base antes de ronda 13 grande era `2bf85ca` (briefs ajustados con auditoría
IFML), más la limpieza 13.0 y el micro-fix e2e:

- `2a7543d` cerró ronda 13.0 TIER 1: tokens activos/sticky, split de smokes,
  detector strict y drop autorizado de stashes legacy.
- `80d947f` corrigió los selectores Demo tras la UX unificada L0.
- `2bf85ca` incorporó la auditoría IFML a los briefs ronda 13.

## Líneas Integradas Ronda 13

| Línea | Resultado integrado | Commits | Estado |
|---|---|---|---|
| L1 Toolbar split + lazy | `app/src/ui/Toolbar.tsx` quedó como orquestador de **59 LOC**. Se crearon componentes por modo en `app/src/ui/toolbar/`: `ToolbarBase`, `ToolbarCreacion`, `ToolbarSeleccion`, `ToolbarMultiseleccion`, `ToolbarMapaSistema` y `toolbarStyles`. `App.tsx` lazy-splitea `Timeline`, `TablaEnlaces`, `GestionArbolOpd` y `MapaSistema`. | `6784830` + glue `671aae6` | Verde |
| L2 tokens central + lint | `app/src/ui/tokens.ts` centraliza `colors`, `spacing`, `radii`, `shadows`, `typography` y `tokens`. Migración archivo por archivo en UI (70 commits de refactor). `app/eslint.config.js` bloquea literales hex en el scope UI migrado. 2 smokes visuales en `09-tokens-visual.spec.ts`. | `d308708..e292a25` | Verde |
| L3 checkers metodológicos | `app/src/modelo/checkers.ts` destila 6 checkers de OPCloud: forma verbal de proceso, objeto singular, contenido inzoom, contenido unfold, proceso que transforma y proceso sistémico conectado. `PanelMetodologia.tsx` es View derivada por DataFlow puro (`modelo -> verificarMetodologia(modelo)`), sin side-effects ni serialización. | `ba0e28a` + glue `671aae6` | Verde |
| L4 barra flotante contextual | `BarraHerramientasElemento.tsx` implementa CN-SOT piloto para cosa seleccionada con acciones: copiar/pegar estilo, agregar estado, inzoom, editar alias, editar imagen y más opciones. `BarraHerramientasElemento.test.ts` agrega 34 unit tests. Integración en `App.tsx` con colapso/reapertura del Inspector. | `350a2ff` + glue `671aae6` | Verde |
| Consolidación | Recalibra detector tras split Toolbar, regenera ledger, documenta cascadas y deja HANDOFF único. | `e0957af` + handoff final | Verde |

Commits auxiliares:

- `83c6474` define cortes operativos post-ronda13.
- `a7f0c29` fija guardrail OPL reverse alpha-lock: alpha no se cierra
  oficialmente hasta resolver HU-SHARED-007 / OPL inverso editable.

## Verificación

Loop verde final sobre el árbol integrado:

```bash
cd app
bun run check          # 871 pass / 0 fail / 2913 expect() / 85 archivos
bun run lint           # eslint src/ui/ verde
bun run build          # build OK
bun run browser:smoke  # 103 passed
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Build final:

| Chunk | KB minificado | KB gzip |
|---|---:|---:|
| `index-*.js` (principal) | **229.74** | **61.83** |
| `feature-asistente-*.js` | 311.06 | 81.18 |
| `vendor-jointjs-*.js` | 470.77 | 129.72 |
| `feature-dialogos-pesados-*.js` | 64.89 | 17.11 |
| `feature-mapa-*.js` | 14.43 | 4.70 |
| `MenuPrincipal-*.js` | 13.03 | 3.69 |
| `Timeline-*.js` (lazy ronda 13) | 7.04 | 2.68 |
| `TablaEnlaces-*.js` (lazy ronda 13) | 6.17 | 2.16 |
| `GestionArbolOpd-*.js` (lazy ronda 13) | 6.19 | 2.42 |
| `DialogoPlantillas-*.js` | 4.22 | 1.66 |
| `DialogoTraerConectados-*.js` | 3.15 | 1.40 |

El objetivo histórico `index <= 195 kB` **no se alcanzó**. Los lazy splits
pedidos sí se emitieron, pero el crecimiento neto de L2 tokens + L3 panel +
L4 barra + glue de App dejó el chunk principal en 229.74 kB. Esto queda como
deuda explícita de bundle; no se invadió scope para forzar recortes.

Estado HU post-recalibración:

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance |
|---|---:|---:|---:|---:|---:|---:|
| Total backlog | 1126 | 312 | 23 | 413 | 378 | **28.3%** |
| MVP-alpha | 121 | **120** | **1** | **0** | 0 | **98.8%** |

Detector: **102/102 reglas matched** sobre **374 archivos fuente**. La única
advertencia de ledger sigue siendo `HU-13.005` duplicada, legado pre-ronda-8.

## Cascadas Gestionadas

| Cascada | Resolución |
|---|---|
| **L2 llegó commiteada con 74 commits antes que L1/L3/L4**. | Se respetó su historia: `d308708..e292a25` queda como secuencia archivo-por-archivo. No se squasheó para preservar trazabilidad de migración tokens. |
| **L1 y L4 compartían `App.tsx`; L3 también necesitaba montar `PanelMetodologia`**. | Se separaron commits puros por dominio (`ba0e28a`, `350a2ff`, `6784830`) y un commit de integración `671aae6` para App + smokes cruzados. |
| **`Toolbar.tsx` era SSOT de muchas reglas detector**. | Tras el split, la evidencia se movió a `toolbar/ToolbarBase.tsx`, `ToolbarCreacion.tsx`, `ToolbarMultiseleccion.tsx` y `ToolbarSeleccion.tsx`. `e0957af` recalibra 12 referencias sin cambiar cobertura real. |
| **Dashboard cayó temporalmente a 86.2% MVP-alpha** al regenerar. | Diagnóstico: no era regresión funcional, sino reglas buscando strings en el archivo viejo. Recalibración devolvió `98.8%`, `120 cubiertas / 1 parcial / 0 pendientes`. |
| **IFML H-1/H-3/H-4/O-4/O-7 presionaban scope**. | No se abordaron en ronda 13 grande. Quedan diferidos a ronda 13.1 IFML flow cleanup: modal-stack real, reemplazo de CustomEvents, breadcrumbs y TablaEnlaces como vista XOR. |
| **Atajos duplicados en Toolbar/App**. | L1 migró atajos materiales restantes a `registrarAtajosAplicacion` en `App.tsx`; Toolbar no registra `keydown`. Ctrl+S/Z/Y quedan centralizados. |
| **`window.dispatchEvent("opm:nueva-cosa")` legacy sigue existiendo**. | No se agregó ningún CustomEvent nuevo. El reemplazo del bridge legacy se difiere a ronda 13.1 porque cruza render handlers, App y ToolbarBase. |
| **PanelMetodologia podía convertirse en Action side-effect**. | Se implementó como View derivada por DataFlow puro; no escribe store, no serializa, no tiene trigger incremental. |
| **Barra flotante podía duplicar Inspector**. | Se pilotó como complemento CN-SOT: acciones rápidas sobre selección única y botón `...` para colapsar/reabrir Inspector. CN-MOT queda declarado pero no implementado. |
| **L4 copiar/pegar estilo opera sobre enlaces, no entidades**. | Decisión explícita: usa el primer enlace visual incidente de la cosa seleccionada porque las acciones existentes son de enlace y no se permitían acciones store nuevas. |
| **Bundle objetivo incumplido**. | Documentado como deuda. No se recorta a ciegas; siguiente intervención debe medir composición de `index` antes de mover más chunks. |

## Decisiones Vigentes Nuevas

- **Toolbar por modo del editor**: `Toolbar.tsx` es orquestador, no contenedor
  monolítico. La división canónica es por estado de uso:
  `Base`, `Creacion`, `Seleccion`, `Multiseleccion`, `MapaSistema`.
- **`toolbarStyles.ts` es styles SSOT del toolbar**. No reintroducir estilos
  inline dispersos en componentes toolbar nuevos.
- **Tokens centralizados para chrome UI**: usar `app/src/ui/tokens.ts` para
  colores, spacing, radii, shadows y typography del chrome. La paleta canvas
  semántica de JOYAS (`#70E483`, `#3BC3FF`, `#586D8C`) sigue intacta en render.
- **ESLint de literales hex en UI**: `bun run lint` es gate real. Nuevos
  literales hex en UI deben entrar por `tokens.ts` o justificarse fuera de
  scope migrado.
- **PanelMetodologia es derivado, no persistido**: `AvisoMetodologico[]` no
  forma parte del JSON OPM canónico.
- **BarraHerramientasElemento es CN-SOT piloto**: solo selección única en ronda
  13. CN-MOT/multi-selección queda para ronda posterior.
- **No nuevos CustomEvents**: cualquier interacción nueva debe modelarse como
  Event -> handler/Action nombrada -> Flow explícito. Los CustomEvents legacy
  se reemplazan juntos en ronda 13.1, no por partes.
- **Alpha-lock OPL reverse**: aunque MVP-alpha operativo está en 98.8%, no se
  declara alpha cerrada hasta resolver HU-SHARED-007 (OPL inverso editable).

Decisiones de rondas previas que siguen vigentes:

OPL-ES como lente derivada; JSON OPM lossless; no Firebase; no Rappid; read-only
como flag runtime; validación nominal `validarNombreEntidad`; modo barra
creación sticky; multi-pestaña sesión-only; operaciones batch atómicas en undo;
catálogo de demos kernel-construible; agente IA como instrumento; `assets/svg/`
como fuente canónica; `opm-extracted/` como referencia semántica, no fuente para
copiar código 1:1.

## Estado Por Dominio

- **Modelo/kernel**: L3 agrega `checkers.ts` como análisis derivado puro. No
  cambia `Modelo`, serialización ni operaciones canónicas. `tipos/avisos.ts`
  define `AvisoMetodologico`, `CodigoChecker`, `SeveridadAviso`.
- **UI/chrome**: Toolbar normalizado por modo; tokens central; barra flotante
  contextual; panel metodológico; App integra lazy splits y paneles.
- **Render JointJS**: sin cambios en handlers ni composers durante la
  consolidación final. L4 calcula posición de la barra leyendo bbox DOM/JointJS,
  sin tocar `JointCanvas` ni `customShapes`.
- **OPL**: sin cambios en generadores OPL. Guardrail `a7f0c29` documenta que
  parser inverso queda bloqueante alpha.
- **Persistencia**: sin cambios de formato ni serializadores. Checkers y avisos
  no se persisten.
- **Tests**: suite unitaria sube a 871 tests; smokes browser suben a 103 y
  pasan completos.
- **Roadmap/detector**: reglas recalibradas por split Toolbar; métricas alpha
  preservadas.

## Pendientes Inmediatos

**Bloqueante alpha real**:

- **HU-SHARED-007**: eco OPL-ES sincronizado inverso editable. Forward canvas ->
  OPL está cubierto; OPL -> canvas libre requiere parser/edición formal. Este
  es el único parcial MVP-alpha.

**Ronda 13.1 recomendada: IFML flow cleanup**:

- Modal-stack LIFO real (H-1).
- Reemplazar `window.dispatchEvent("opm:nueva-cosa")`.
- Reemplazar `window.dispatchEvent("deep-opm-pro:exportar-mapa")`.
- Breadcrumbs CN-BREAD.
- TablaEnlaces como tercera vista XOR de `CanvasArea`.
- Revisar `ToolbarBase` para mover bridges modeless legacy fuera del toolbar si
  el reemplazo de CustomEvents lo permite.

**Ronda 14 recomendada: OPL reverse alpha-lock**:

- HU-SHARED-007.
- HU-50.019/.020/.022 parser OPL bidireccional.
- Decidir convergencia entre `app/src/opl/` y
  `app/src/modelo/opl/generador-opl.ts` sin romper el forward actual.

**Deuda técnica viva**:

- Bundle principal 229.74 kB sobre objetivo histórico 195 kB. Medir composición
  antes de mover más código a lazy.
- `HU-13.005` duplicada en ledger pre-ronda-8.
- CN-MOT multi-selección para `BarraHerramientasElemento`.
- Eventual centralización de bridges legacy de `ToolbarBase`.
- EPICA-32 sub-modelos peer-persistence sigue post-alpha.

## Cómo Continuar

1. Leer este `docs/HANDOFF.md` y `docs/roadmap/hu-progress.md`.
2. Para UX/flujo inmediato, abrir **ronda 13.1 IFML flow cleanup**. Mantenerla
   separada de OPL reverse.
3. Para cierre alpha formal, abrir **ronda 14 OPL reverse** con parser y evals
   estrictos. No mezclar con UI polish.
4. Antes de crear soluciones nuevas, consultar en orden:
   `assets/svg/`, `assets/png/`, `docs/JOYAS.md`, `opm-extracted/`, SSOT OPM.
5. Cerrar cada ronda con:
   - `cd app && bun run check`
   - `cd app && bun run lint`
   - `cd app && bun run build`
   - `cd app && bun run browser:smoke`
   - `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`
6. Si una línea paralela encuentra WIP cruzado, usar el patrón validado de
   patches a `/tmp/<ronda>-L<n>/` antes de mezclar commits.
