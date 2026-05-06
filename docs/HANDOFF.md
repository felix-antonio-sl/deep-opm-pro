# HANDOFF - estado integrado y próximos pasos

**Fecha**: 2026-05-06
**Repositorio**: `deep-opm-pro`
**Corte**: MVP-alpha + rondas 1-9.5 + ronda 10 + ronda 11 (5 líneas cierre MVP-α + recalibración detector ronda 11) consolidadas sobre `main`
**Código verificado**: `main` tras ronda 11 — 5 features aditivas integradas + 22 reglas detector nuevas. **MVP-α 91.1% ponderado**.
**Documentación vigente**: este archivo reemplaza por completo el handoff anterior.

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

La **ronda 11** marcó el **cierre operativo de MVP-α**: tras dos rondas de
refactor estructural (8, 9, 9.5) y una ronda de features grandes (10), la
ronda 11 atacó las 67 HU vivas pendientes/parciales en EPICA-20 (árbol OPD),
EPICA-30 (persistencia + diálogos modales), EPICA-50 (panel OPL polish),
EPICA-10/11 (modelado canónico), EPICA-SHARED (transversales). Cinco líneas
paralelas con disjuntez por dominio conceptual y aditividad estricta.
**Cambio categórico**: cierre del primer hito presentable.

| Línea | Resultado integrado | HU cerradas |
|---|---|---:|
| L1 | Árbol OPD completo: atajos panel-locales (Ctrl+↑/↓, F2, Ctrl+E/Shift+E, Ctrl+D), `MenuContextualArbol` extendido con Buscar OPD, renombrado inline con selección de texto, helpers `expandirTodos`/`colapsarTodos` en `togglesArbol`, acciones puras `renombrarOpd`/`reordenarOpd`/`moverOpd` en `acciones-opd`, `DialogoGestionArbol` nuevo (Ctrl+D), reset doble-click del divisor a 280px (fallback histórico 240px), modo orden manual/automático configurable. | 12 |
| L2 | Persistencia + diálogos canónicos: `Modelo.descripcion?` aditivo + roundtrip JSON lossless, `PantallaInicio` nueva con grid recientes + telón + búsqueda, `DialogoCargarModelo` extendido (tiles/lista, búsqueda, ordenamiento por columna, glifos editable/candado/autosalvado), `DialogoGuardarComo` con descripción opcional, `DialogoVersiones` con toggle visible + política log-scale (10/sem/mes/máx 10), `DialogoArchivados` con toggle + auto-archivar 90d + restaurar, autosalvado cada 5 min con glifo, `MenuPrincipal` con Renombrar... + Cargar Ejemplo Organizacional, dynamic import de `MenuPrincipal` y `PantallaInicio` (bundle bajo objetivo). | 20 |
| L3 | Panel OPL polish: `panelOpl/Toolbar.tsx` nuevo con botones canónicos (123 numeración, posición lateral/inferior, minimizar/restaurar, AI Text placeholder, buscar/copiar/HTML), preferencias OPL aditivas en `PreferenciasUiUsuario.{oplPosicion?,oplNumeracionVisible?,oplMinimizado?,oplBloquesContraidos?}`, `Bloques` con indentación jerárquica + colapso persistido + `data-opl-nivel`, selección de enlace específico en oración multi-enlace vía `referenciaEnlaceEspecifico`, generadores OPL intactos (estructura invariante). | 8 |
| L4 | Modelado canónico: drag desde Toolbar al canvas con MIME `application/x-opm-tipo`, `MenuTipoEnlace` nuevo con tipos válidos vía `validarFirmaEnlace` + preview OPL + filtros por dirección, `BibliotecaCosa` lateral nueva con drag-drop al canvas y navegación a OPDs, `DialogoEstiloEnlace` + `SeccionEstilo` con paleta cerrada + copiar/pegar estilo entre enlaces, reanclar extremo enlace con `linkTools.SourceArrowhead/TargetArrowhead`, `eliminarEnlacesBatch` + `aplicarEstiloEnlacesBatch`, `MenuContextualEnlace` (right-click sobre enlaces). | 22 |
| L5 | Transversales + ledger: `OpmStore.readOnly: boolean` flag (default `false`); cuando `true`, `commitModelo` aborta con mensaje "Modelo en solo lectura. Usa Guardar como para crear copia editable.". Acción `activarReadOnly(activo)` en `acciones-ui`. Validación nominal completa con `validarNombreEntidad(modelo, entidadId, nombre, opdActivoId?)` que rechaza vacío y duplicado dentro del OPD activo. HU-50.015 verificado (generalización emite "es un/una" canónico). 22 reglas detector ronda 11 nuevas. | 6 (+ recalibración detector) |

**Total HU nuevas cerradas ronda 11**: ~68 (incluyendo cubiertas indirectas).
Detector ronda 11: **92/92 reglas matched** (vs 72 baseline post-ronda-10).
**MVP-α: 50.0% → 91.1% ponderado** (+41.1 pts; objetivo de 80-90% superado).

## Cómo Se Decidió La Partición

La partición ronda 11 se diseñó usando **cat-thinking** sobre el corpus
`opm-extracted/`, SSOT OPM y el roadmap MVP-α, encarnando la persona
**steipete** (director de ejecución cognitiva). Categorialmente:

- **Coproducto disjunto** L1⊔L2⊔L3⊔L4⊔L5 sobre subcategorías por dominio conceptual (`urn:fxsl:kb:icas-universales`), con pullbacks pequeños declarados (zonas de contacto controladas en `acciones-canvas`, `Toolbar`, `MenuPrincipal`, `runtime`, `tipos/ui`).
- **Funtor extensión** sobre features faltantes (`urn:fxsl:kb:icas-extension`): tipos opcionales, exports nuevos, ningún rename.
- **Funtor faithful** sobre API ronda 10 (`urn:fxsl:kb:icas-preservacion`): contratos públicos preservados, JSON lossless verificado.
- **Adjunción libre/olvido** preservada (`urn:fxsl:kb:icas-adjunciones`): exposed-API estable / internal-structure crece.
- **V-model fase Validation** (`urn:fxsl:kb:icas-lifecycle`): cada HU cierra con criterio + smoke + regla detector.

Patrones canónicos OPCloud destilados (sin copiar 1:1):

1. **OPD tree con menú contextual** (`opm-extracted/.../treeViewService.ts`) → L1 árbol completo.
2. **Save/load workflow + dialogs** (`opm-extracted/.../save-as-dialog/`, `load-model-dialog/`) → L2 diálogos persistencia canónicos.
3. **OPL pane positioning** (`opm-extracted/.../oplPane.component.ts`) → L3 toolbar panel OPL.
4. **Drag from toolbar** (`opm-extracted/.../sideMenu.component.ts`) → L4 drag desde toolbar al canvas.
5. **Read-only flag propagation** → L5 `readOnly` con bloqueo central en `commitModelo`.

## Decisiones Vigentes

Decisiones nuevas de ronda 11:

- **Atajos panel-locales para árbol OPD**: `Ctrl+↑/↓`, `F2`, `Ctrl+E`, `Ctrl+Shift+E`, `Ctrl+D` registrados con contexto `panel-arbol` en `atajosTeclado.ts`. No interfieren con atajos globales del canvas o toolbar.
- **PantallaInicio con dynamic import**: el chunk de pantalla inicio se carga lazy para mantener el bundle principal bajo objetivo. Idem `MenuPrincipal`. Patrón consolidado: feature pesada lazy.
- **Política log-scale para versiones**: máximo 10 versiones totales con buckets por edad (24h/7d/30d/older). Versiones marcadas como `preservar?` quedan exentas.
- **Auto-archivar 90 días marca, no destruye**: modelos sin uso 90+ días se marcan `archivado=true, archivadoAuto=true`. Restaurar siempre disponible. Notificación al usuario en sesión.
- **Modo orden árbol configurable**: `modoOrdenArbol: "automatico" | "manual"` en preferencias UI. Automático recalcula desde Y de apariencia padre; manual respeta orden persistido.
- **Selección enlace específico en oración multi-enlace**: token interactivo registra `enlaceId` propio; click dispara selección granular, no global de la oración.
- **MenuTipoEnlace con preview OPL**: cada item muestra oración OPL preview (`Objeto consume Proceso`) memoizada por `(origenId, destinoId, tipo)`.
- **Drag desde Toolbar con MIME**: `application/x-opm-tipo` para botones cosa, `application/x-opm-entidad-id` para drag desde biblioteca. Onsdrop intercepta antes que JointJS.
- **DialogoEstiloEnlace con paleta cerrada**: 6 colores semánticos + 4 grosores + 3 estilos línea. Color picker custom queda fuera de MVP-α.
- **`copiarEstiloEnlace` con portapapeles in-memory**: `OpmStore.enlaceEstiloPortapapeles?: EnlaceEstilo` solo en runtime, no persistido. Atajos `Ctrl+Alt+C` / `Ctrl+Alt+V`.
- **Read-only como flag de runtime, no de modelo**: `OpmStore.readOnly: boolean` vive en store, no en `Modelo`. Bloqueo central en `commitModelo`. UI muestra indicadores; redirección Guardar→Guardar Como queda diferida (HU-30.036 pendiente para ronda 12).
- **Validación nominal completa**: `validarNombreEntidad(modelo, entidadId, nombre, opdActivoId?)` rechaza vacío y duplicado dentro del OPD activo. Mismo nombre permitido entre OPDs distintos. Llamado desde `renombrarEntidad` con OPD activo opcional.
- **MVP-α presentable**: 91.1% ponderado tras ronda 11. Estado demostrable a stakeholders. HU restantes (4 pendientes + 10 parciales) son afinaciones de UX o features menores que no bloquean validación.

Decisiones de rondas 1-10 que siguen vigentes (no se reabren):

- **OPL-ES como lente derivada**, **Hover OPL↔canvas estado UI**, **Eliminación de OPDs raíz disabled / hojas eliminan refinamiento**, **Bus de agregación derivado en render**, **Importación JSON no auto-persiste**, **Creación interna por posición**, **Apariencia.estilo invariante a OPL**, **`Modelo.estados` y `Modelo.abanicos` top-level**, **Extremos `ExtremoEnlace = { kind, id }`**, **Multiplicidad canónica + custom**, **Estilo de enlace**, **Vértices manuales y reanclaje**, **Tabla de enlaces global**, **Modelo post-asistente queda dirty**, **Workspace con jerarquía de carpetas**, **Árbol OPD expandido por default**, **Mapa del sistema = vista neutra**, **Abanicos OR/XOR canónicos**, **Multi-selección canónica**, **Operaciones batch atómicas en undo**, **Modo barra creación sticky**, **Multi-pestaña sesión-only**, **Bloques OPL jerárquicos**, **Workspace single-user MVP**, **Designaciones de estado con exclusiones SSOT**, **Alias/unidad/descripción/URLs en entidad**, **Duración canónica de estado**, **Plegado parcial persistido**, **Atajos centralizados**, **Divisor árbol/canvas**, **Toggle ocultar nombres del árbol**, **Diálogos custom con captura**, **Barrel re-export como contrato público**, **Slices Zustand con runtime singleton**, **Code splitting Vite con manualChunks**, **Tests legacy se preservan, solo se corrige lo que afloró**, **`validarFirmaEnlace` en `operaciones/helpers.ts` para evitar ciclo enlaces↔refinamiento**, **Anti-patrón `_siguienteGlobal` eliminado**, **Wrapper `paperOff` en `handlers/helpers.ts` para Backbone events**, **Undo per-pestaña vía `estadoModelo()`/`activarEstadoPestanas()`**, **Aditividad estricta para features**, **Cache imagen NO se serializa**, **Single-user EPICA-19**, **Exclusión imagen/estados visibles**, **`gridConfig` fuera del JSON OPM**, **Composer overlay separado del composer base**.

## Cascadas Gestionadas

Cascadas integradas durante la consolidación de ronda 11:

| Cascada | Resolución |
|---|---|
| **Bug typecheck en `acciones-entidad.ts`**: integración L4 (BibliotecaCosa drag-drop) usaba variable `opdId` en lugar de `opdActivoId` destructurado del get(). | Corregido en líneas 100 y 111 antes de commit. Smoke test L4 valida flujo completo. |
| **`tipos/ui.ts` absorbe campos L1 + L2 + L3 sin choque**: PreferenciasUiUsuario crece con árbol (`modoOrdenArbol`), recientes (L2), OPL (`oplPosicion`, `oplNumeracionVisible`, `oplMinimizado`, `oplBloquesContraidos`). | Todos campos opcionales aditivos. JSON roundtrip lossless verificado. |
| **`acciones-canvas.ts` integra acciones L3 (panel OPL) + L4 (modelado)**. | Hunks disjuntos por sección. `cambiarPosicionOpl`/`minimizarOpl` (L3) vs `reanclarExtremoEnlaceSeleccionado`/`copiarEstiloEnlaceAlPortapapeles` (L4). |
| **`acciones-ui.ts` integra L1 (`abrirGestionArbol`) + L2 (versiones/archivados) + L4 (modal estilo enlace) + L5 (`activarReadOnly`)**. | Cada acción independiente. `commitModelo` central como punto de bloqueo read-only. |
| **`Toolbar.tsx` integra L2 (autosalvado glifo) + L4 (drag handlers cosas)**. | Hunks disjuntos por sección JSX. |
| **`commitModelo` con check read-only**: necesita acceder al store sin shadowing del `estadoActual` local. | Refactor: usar `storeApi?.getState()` directo en el guard read-only para evitar shadowing con la variable local `estadoActual` declarada después. |
| **L5 paused en agente externo**: precondición de orden de merge no se cumplía (worktree con WIP no commiteado). | Patrón ronda 10: el operador entrega 4 líneas integradas en worktree; consolidación commitea L1-L4 como integración + ejecuta L5 directamente. |
| **Detector con duplicate-id warnings**: reglas viejas de ronda 10 cubrían IDs que ronda 11 actualiza. | Removido: HU-10.001/.002 parcial vieja, HU-SHARED-009 parcial vieja. Reducido HU-50.001/.015/.016 → HU-50.001/.016 (HU-50.015 va a regla L5 nueva). HU-10.007/.008/.010/.011/.025/.026 parcial vieja → HU-10.007/.025 cubierto. |
| **5 reglas detector inicialmente unmatched**: paths/strings divergían del WIP final. | Corregidas: HU-50.023/.024/.025 ahora apuntan a `panelOpl/Toolbar.tsx`; HU-20.014 a `ArbolOpd.tsx`; HU-20.017/.018/.019 a `store/uiPanel.ts`; HU-20.020/.021/.022 a `ArbolOpd.tsx` y `uiPanel.ts`; HU-11.016/.017 a `enlaceEstilo.ts` y `store/tipos.ts`. Tras corrección: 92/92. |
| **Smoke 854 conocido flaky**: `confirma cambios sin guardar antes de crear un modelo nuevo`. | Heredado de ronda 9. Reintento generalmente verde. No bloqueante. |

## Verificación

Loop verde de consolidación de ronda 11 sobre `main`:

```bash
cd app
bun run check          # typecheck OK; 624 unit tests pass / 2544 expects / 0 fail
bun run browser:smoke  # 72/72 Playwright smoke pass (~1.3 min)
bun run build          # OK; chunk principal 181.34 kB / 47.82 kB gzip
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Bundle generado:

| Chunk | KB minificado | KB gzip |
|---|---:|---:|
| `index-*.js` (chunk principal) | 181.34 | 47.82 |
| `vendor-jointjs-*.js` (lazy) | 470.77 | 129.72 |
| `feature-asistente-*.js` (lazy) | 275.20 | 71.40 |
| `vendor-*.js` | 134.37 | 47.14 |
| `feature-dialogos-pesados-*.js` (lazy) | 60.72 | 16.61 |
| `MenuPrincipal-*.js` (lazy, NUEVO) | 11.02 | 3.28 |
| `feature-modales-*.js` (lazy) | 10.88 | 3.81 |
| `feature-mapa-*.js` (lazy) | 13.82 | 4.67 |
| `vendor-preact-*.js` | 19.86 | 7.91 |
| `ModalImagenObjeto-*.js` (lazy) | 4.16 | 1.67 |
| `vendor-zustand-*.js` | 0.34 | 0.25 |
| `vendor-jointjs-*.css` | 46.28 | 32.49 |

Crecimiento de bundle vs base ronda 10: chunk principal +17 KB (164→181 KB).
Dentro del tope documentado (<185 KB / <50 KB gzip). Lazy chunks adicionales:
`MenuPrincipal` (~11 KB), `feature-dialogos-pesados` creció +14 KB para
absorber `DialogoVersiones` y `DialogoArchivados` extendidos.

Estado HU post-recalibración detector ronda 11 (`--sync-real`):

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance |
|---|---:|---:|---:|---:|---:|---:|
| Total backlog | 1126 | 266 | 33 | 449 | 378 | **24.6%** |
| MVP-α | 121 | 107 | 10 | 4 | 0 | **91.1%** |

Detector: **92/92 reglas matched** sobre archivos fuente. 22 reglas nuevas
agregadas para evidencias ronda 11; 6 reglas preexistentes deduplicadas
o actualizadas para reflejar nuevos paths/strings.

Diagnóstico vigente: 1 advertencia de inventario por ID duplicado
`HU-13.005` (legado pre-ronda-8).

## Estado Por Dominio

- **Modelo/kernel**: estable. Ronda 11 agregó `Modelo.descripcion?` aditivo (L2) + `validarNombreEntidad` (L5). Cero rename.
- **Render**: composers ronda 8-10 estables + `panelOpl/Toolbar.tsx` nuevo ronda 11 L3. JointCanvas con `cablearResize` (ronda 10 L1) + `RenombradoInline` (ronda 10 L3) + image overlay (ronda 10 L4). `linkTools.SourceArrowhead/TargetArrowhead` (ronda 11 L4) para reanclar extremo.
- **OPL**: lente derivada estable. Generadores ronda 8-9.5 sin tocar. Ronda 11 L3 agrega indentación jerárquica + colapso bloques + selección enlace específico SOLO en `Bloques.tsx` (UI), nunca en generadores. HU-50.015 verificado: "es un/una" para generalización emite canónicamente.
- **UI/store**: Inspector con secciones ronda 8 + `SeccionTamano`/`SeccionImagen` (ronda 10) + `SeccionEstilo` (ronda 11 L4). PanelOpl con `panelOpl/Toolbar.tsx` nuevo (ronda 11 L3). Árbol OPD con atajos panel-locales + `DialogoGestionArbol` (ronda 11 L1). Slices store ronda 8 + ronda 9.5 + nuevas acciones ronda 10 + ~20 acciones nuevas ronda 11. Runtime singleton en `store/runtime.ts` con bloqueo read-only.
- **Persistencia**: JSON conserva todos los campos OPM + `Modelo.descripcion?`. Workspace con jerarquía de carpetas, archivado, versiones, búsqueda global, autosalvado cada 5 min. Auto-archivar 90 días marca (no destruye). Política log-scale para versiones (máx 10).
- **Auditoría**: detector calibrado 92/92 reglas matched. Cobertura HU 24.6% ponderado / MVP-α **91.1%**.

## Pendientes Inmediatos

Tras ronda 11, MVP-α está **91.1% cubierto**. Las **4 HU pendientes + 10 parciales** restantes son:

**Pendientes MVP-α (4)**:

- **HU-10.004** [S] — Editar descripción opcional (cosas). Ya hay `SeccionDescripcion`; falta verificar wiring completo o actualizar regla detector a evidencia más específica.
- **HU-11.001** [M0] — Crear cosa y partes en secuencia sobre el mismo OPD. Modo barra creación sticky ya existe; falta evidencia detectada explícita.
- **HU-11.007** [M1] — Conectar multi-selección al todo con un solo gesto. `conectarMultiAlTodo` existe en `operacionesBatch`; falta wiring UI canónico.
- **HU-30.036** [S] — Redirigir Guardar→Guardar Como en read-only. L5 declaró diferida por blast en muchas acciones; queda para ronda 12.

**Parciales MVP-α (10)**:

- **HU-SHARED-002** [M0] — Pila de undo/redo (granular). Cubierto operacionalmente; falta verificar test de cada comando ronda 10/11.
- **HU-SHARED-007** [M0] — Eco OPL sincronizado. Cubierto operacionalmente; verificar emisión de N oraciones de agregación cuando multi-al-todo.
- **HU-10.003** [M0] — Modal nombre tras crear. Existe `data-testid="modal-nombre-cosa"` (L4); afinar smoke.
- **HU-10.021** [C] — Descomposición de objeto en mismo diagrama. Despliegue por inzoom funciona; verificar para objetos.
- **HU-11.012** [M0] — Crear enlace estructural etiquetado. Exhibición/generalización/clasificación + etiqueta funcionan; falta cobertura completa.
- **HU-30.008** [M0] — Persistir payload OPM íntegro. Verificar nuevos campos opcionales (gridConfig, imagen, descripcion) están todos en exportarModelo.
- **HU-30.019/.020** [M0] — Cargar con doble clic / clic + botón. Cubierto operacionalmente; afinar smoke.
- **HU-30.021** [S] — Cargar Ejemplo Global. Botón existe; falta JSON canónico.
- **HU-30.037** [M0] — Cancelar modal con Cancelar o Esc sin persistir. Wrapper `Dialogo.tsx` ya captura Esc; cobertura completa pendiente.

**Pendientes que siguen vivos para post-MVP-α**:

- **HU de kernel grandes**: EPICA-17 slot de valor numérico, EPICA-32 sub-modelos, EPICA-33 plantillas. **Próxima ronda 12** candidata.
- **EPICA-50 OPL bidireccional fase profunda** (HU-50.019/.020/.022): requiere parser. Ronda 12+.
- **EPICA-1B traer conectados**: candidata ronda 12.
- **EPICA-19 pool organizacional** (HU-19.004..006): multi-user, diferida.
- **EPICA-60/61 export PDF/SVG papel**, **EPICA-71 CSV import**: bloqueadas por regla "no introducir dependencias nuevas".
- **EPICA-31 carpetas/permisos**: single-user MVP no necesita. Diferida.
- **Smoke 854 flaky**: ocasional, no bloqueante. Conocido desde ronda 9.

Sub-archivo más grande post-ronda-11: `app/src/store/modelo/acciones-canvas.ts`
~595 LOC (vs 559 post-ronda-10). Crece por L3 (4 acciones panel OPL) + L4 (3
acciones modelado) + L5 (1 acción readOnly). Particionable si crece, no urgente.

## Épicas Descartadas Del Proyecto

| Épica | Título | Fecha de descarte | Razón |
|---|---|---|---|
| 70 | Importación OPCAT 4.2 (.opx) | 2026-05-05 | Fuera de alcance del proyecto |
| 91 | Modo tutorial / tooltips guiados / asistencia pedagógica | 2026-05-05 | Fuera de alcance del proyecto |

Las HU de estas épicas se conservan en sus archivos como referencia
histórica y trazabilidad SSOT, pero **no deben asignarse a ninguna ronda
de desarrollo, no deben aparecer en briefs de líneas paralelas, ni deben
contar como pendientes en el roadmap operativo**. Decisión irreversible
salvo nueva instrucción explícita del operador.

## Cómo Continuar

1. Leer este `docs/HANDOFF.md` y `docs/roadmap/hu-progress.md`.
2. **MVP-α 91.1%**: estado presentable y demostrable. Cierre estricto de las 14 HU restantes (4 pendientes + 10 parciales) puede hacerse en una **ronda 12 corta** (1-2 líneas paralelas) o absorberse como afinaciones puntuales en la ronda que aborde EPICA-17/32/33.
3. Para nueva ronda paralela:
   - Heredar el formato de `docs/instrucciones-lineas-dev/ronda11/` (10 secciones README + 11 secciones por brief).
   - Asumir cadenas de efecto kernel→render→OPL→UI.
   - Para features aditivas: tipos opcionales (`?:`), exports nuevos, ningún rename. Si una HU requiere romper firmas, dedicar ronda completa a refactor.
   - Si hay refactor estructural, **recalibrar el detector ANTES de cerrar la ronda**, no después. Patrón consolidado en rondas 8-11.
   - Reservar el último commit del ciclo para una capa explícita de cascadas resueltas.
   - **Próximas rondas recomendadas**:
     - Ronda 12 corta (cierre MVP-α 100%): 14 HU restantes + smoke 854 stabilization.
     - Ronda 13: EPICA-17 slot de valor numérico (kernel grande).
     - Ronda 14: EPICA-32 sub-modelos (persistencia peer).
     - Ronda 15: EPICA-33 plantillas (artefacto reutilizable).
4. Antes de diseñar, consultar `opm-extracted/`, `assets/svg/`, `docs/JOYAS.md` y la SSOT OPM.
5. Cerrar cada cambio con `bun run check`; si toca UI/render: `bun run browser:smoke`; si toca proyección o bundle: `bun run build`.
6. Regenerar auditoría con `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real` antes de publicar un cierre de ronda. **Mantener ≥92/N reglas matched y MVP-α ≥91%; tras ronda 12 esperado MVP-α ≥98%.**
