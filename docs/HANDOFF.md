# HANDOFF — estado, decisiones, pendientes, riesgos

**Fecha**: 2026-05-04
**Sesion**: MVP-alpha inicial + EPICA-20 minimo + EPICA-12 in-zooming MVP
**Repositorio**: `deep-opm-pro`
**Repositorio hermano**: `opm-model-app` (fuente historica de historias de usuario; inventario vivo local en `docs/historias-usuario-v2/`)

---

## Politica de handoff unico

`docs/HANDOFF.md` es la unica memoria de traspaso vigente del proyecto. No se
mantienen handoffs paralelos, fechados ni duplicados. Cada vez que se genere un
handoff nuevo, debe reemplazar y consolidar el contenido anterior en este mismo
archivo.

## Handoff explicito del corte 2026-05-04

### Estado actual

- El repo ya no debe leerse como una app heredada: es un workspace de desarrollo nuevo basado en evidencia de OPCloud y SSOT OPM.
- `docs/historias-usuario-v2/` es el backlog vivo local: 48 epicas, 1,117 HU canonicas, 48 stubs, 0 violaciones de linter y 0 huerfanas v1->v2.
- `opm-extracted/` esta versionado y es la fuente preferente para consultar la logica observable de OPCloud antes de tocar `decompiled/`.
- `app/` contiene una app nueva Bun + Vite + Preact + Zustand + JointJS OSS, con kernel propio y sin copiar arquitectura Angular/Firebase/Rappid.
- EPICA-20 minimo quedo implementado: panel/arbol OPD con raiz `SD`, `opdActivoId` en store, navegacion desde UI, canvas JointJS y OPL filtrados por OPD activo.
- EPICA-12 in-zooming MVP quedo implementado para procesos: accion "Descomponer" desde inspector, operacion de kernel idempotente, `entidad.refinamiento`, OPD hijo `SDn`/`SDn.m`, nodo derivado `SDn: <Proceso> descompuesto`, navegacion automatica al hijo, apariencia del mismo proceso en OPD padre e hijo, tres subprocesos iniciales automaticos, OPL "se descompone en ... en esa secuencia" ordenado por `y` y JSON round-trip validado.
- La descomposicion ahora tiene contenido interno real: el OPD hijo renderiza el proceso refinado como contorno ampliado detras de objetos/procesos internos; los tres subprocesos iniciales quedan centrados y apilados dentro del contorno, y las nuevas cosas se colocan dentro del contorno.
- La redistribucion MVP de enlaces externos esta implementada: al descomponer se copian apariencias de extremos externos conectados al proceso padre; consumo/resultado no quedan en el contorno; se crean enlaces locales equivalentes hacia el primer subproceso interno por orden `y` y se conservan los enlaces del padre.
- La descomposicion es reversible desde UI: "Quitar descomposición" elimina el OPD hijo y su subarbol, limpia entidades/enlaces huerfanos, remueve el OPL de refinamiento y vuelve a un OPD activo valido.
- Auditoria visual SSOT/JointJS aplicada: firmas consumo/resultado/efecto corregidas, marcadores procedimentales basicos, agregacion con triangulo, routing manhattan basico, sin elipsis silenciosa en etiquetas, posicion inicial libre por OPD y toolbar compacta sin overflow.
- Integridad de import JSON endurecida: validacion estructural, referencial, firmas OPM, endpoints visibles por OPD y rechazo de enlaces invisibles antes de hidratar `Modelo`.
- Auditor in-vivo estabilizado: `app/scripts/in-vivo-test.mjs` genera `docs/REPORTE-EJECUTIVO.md`, `_resumen.json` y screenshots desde una sola ejecucion; sale con codigo distinto de cero ante criterios FAIL.
- Repo shaping aplicado: `README.md` reorientado a workspace de desarrollo, `NOTICE.md` agregado para separar codigo propio de material observacional/derivado y `app/bunfig.toml` configurado con Bun Security Scanner API.
- Dev server remoto probado en `http://138.201.53.205:5173/` con Vite escuchando en `0.0.0.0:5173`; `5174` debe permanecer cerrado.

### Artefactos relevantes

- Instrucciones activas para agentes: `AGENTS.md`.
- Mapa operativo del repo: `README.md`.
- Aviso de limites, autoria y material derivado: `NOTICE.md`.
- Estado y memoria operativa: `docs/HANDOFF.md`.
- Roadmap activo: `docs/roadmap/sprint-0.md`, `docs/roadmap/mvp-alpha.md`, `docs/roadmap/mvp-alpha-coverage.md`.
- Historias de usuario vivas: `docs/historias-usuario-v2/`.
- Evidencia OPCloud curada: `opm-extracted/INDEX.md`, `opm-extracted/MODULES.md`, `opm-extracted/assets/INDEX.md`.
- App nueva: `app/src/modelo/`, `app/src/render/jointjs/`, `app/src/store.ts`, `app/src/ui/`.
- Supply-chain app: `app/bunfig.toml`, `app/bun.lock`, `app/package.json`.
- Auditoria visual in-vivo: `app/scripts/in-vivo-test.mjs`.
- Reporte ejecutivo in-vivo vigente: `docs/REPORTE-EJECUTIVO.md`.

### Decisiones recientes

- Partir `app/` desde cero fue correcto: el desarrollo previo queda como leccion en `docs/archive/si-partiese-desde-0.md`, no como base a arrastrar.
- HU v2 reemplaza a HU v1 como backlog operativo; las v1 quedan archivadas para trazabilidad.
- JointJS OSS se usa como renderer/adaptador, no como modelo de dominio. El kernel OPM vive en `app/src/modelo/`.
- Undo/redo y dirty state usan snapshots de `Modelo` con profundidad 100. Es una decision temporal aceptable para MVP-alpha; comandos inversos quedan para cuando el costo o la auditoria granular lo justifiquen.
- `opm-extracted/` se consulta para semantica, valores visuales, routing, puertos, marcadores y OPL; no se copian bloques 1:1 a `app/`.
- Los tipos de enlace se eligen desde un selector compacto en la toolbar para evitar overflow en viewports de smoke y mantener el canvas operativo.
- El selector de tipo de enlace permanece inactivo hasta que haya una entidad origen seleccionada; evita falsa progresion de UX.
- `hidratarModelo` no debe emitir un `Modelo` si el JSON falla estructura, referencias, firmas OPM, visibilidad de endpoints en el OPD o deja enlaces sin apariencia.
- No se declara licencia open-source repo-wide en este corte por convivencia de codigo propio y evidencia OPCloud derivada; hasta definir politica explicita, `NOTICE.md` es el punto de verdad operativo.
- Bun Security Scanner API queda activo con `@socketsecurity/bun-security-scanner` en modo publico si no hay `SOCKET_API_KEY`; nuevas resoluciones usan edad minima de publicacion de 7 dias salvo `@types/bun`.

### Verificacion del corte

Ejecutado en `app/`:

- `bun run check` -> 43 tests verdes.
- `bun run security:scan` -> Socket free mode, 153 paquetes escaneados, 0 advisories.
- `bun run browser:smoke` -> 8 tests Playwright verdes.
- `bun run build` -> build OK; warning esperado de chunk grande por JointJS.
- `bun run visual:audit -- http://127.0.0.1:5173/` -> 51 OK, 0 FAIL, 0 WARN, 3 INFO; genera `docs/REPORTE-EJECUTIVO.md`, `app/test-results/in-vivo/_resumen.json` y 21 screenshots.

Capturas browser relevantes:

- `app/test-results/opm-demo-jointjs.png`
- `app/test-results/opm-opd-tree.png`
- `app/test-results/opm-drag-jointjs.png`
- `app/test-results/opm-dirty-undo-redo.png`
- `app/test-results/opm-link-tools-jointjs.png`
- `app/test-results/opm-agregacion-triangulo.png`
- `app/test-results/opm-descomposicion-opd-hijo.png`
- `app/test-results/opm-descomposicion-enlaces-externos.png`
- `app/test-results/in-vivo/11c-quitar-descomposicion.png`

### Pendientes inmediatos

1. Ampliar smoke de undo/redo por operacion: eliminar, renombrar, mover, esencia, afiliacion, crear/eliminar enlace y vertices.
2. Completar in-zooming mas alla del MVP: edicion/reordenamiento del timeline top-to-bottom, reasignacion manual de enlaces externos entre subprocesos, split de `effect` y enlaces estado-especificos.
3. Implementar unfold/despliegue de objetos y distinguirlo explicitamente de in-zooming de procesos.
4. Persistencia local real: IndexedDB o storage estructurado con lista de modelos.
5. Dialogo Guardar / Descartar / Cancelar cuando exista navegacion real entre modelos.
6. Definir politica de licencia explicita para codigo propio vs. material observacional antes de redistribucion publica.
7. OPL bidireccional queda fuera hasta estabilizar parser y mas kernel.

### Supuestos

- Para MVP-alpha, snapshots de modelo son suficientemente pequenos y reversibles.
- La app puede seguir sin backend ni auth mientras se valida modelado local.
- OPCloud informa UX y comportamiento, pero SSOT OPM manda cuando haya tension semantica.
- El siguiente avance puede mantenerse antes de una nueva profundizacion JointJS si se limita a timeline/reasignacion de in-zooming o unfold/despliegue desde el kernel.

### Riesgos

- `opm-extracted/` es material derivado de ingenieria inversa: usarlo como evidencia, no como fuente copiada.
- No hay licencia repo-wide declarada; tratar redistribucion publica como bloqueada hasta decision explicita.
- El scanner de Socket corre en modo publico si no hay `SOCKET_API_KEY`; CI/org policy requiere configurar credencial.
- La app ya crea y elimina OPDs hijos por in-zooming de procesos, crea tres subprocesos iniciales, permite contenido interno, emite OPL en secuencia y redistribuye enlaces externos al primer subproceso por `y`; unfold/despliegue de objetos, reordenamiento avanzado del timeline y split de efectos siguen pendientes.
- Dirty state no tiene confirmacion de salida hasta que exista navegacion/cierre de modelos.
- El bundle de JointJS genera warning de tamano; no es bloqueante para MVP-alpha, pero puede exigir code splitting luego.

### Prompt breve de continuacion

```
Retoma `docs/HANDOFF.md` en `deep-opm-pro`. Estado: EPICA-20 minimo
implementado con arbol OPD, raiz SD, `opdActivoId`, canvas JointJS y OPL por
OPD activo. EPICA-12 in-zooming MVP implementado para descomponer procesos:
kernel idempotente, OPD hijo `SDn`/`SDn.m`, nodo `SDn: <Proceso>
descompuesto`, navegacion automatica, OPL "se descompone en", JSON round-trip,
contenido interno dentro del contorno, tres subprocesos iniciales automaticos,
OPL en secuencia por `y`, redistribucion de enlaces externos al primer
subproceso interno por `y` y smoke browser. La descomposicion ya puede quitarse
desde UI con limpieza de subarbol OPD, entidades/enlaces huerfanos y fallback
de OPD activo.
Auditoria visual SSOT/JointJS aplicada, import JSON endurecido y supply-chain
scanner configurado. Ultimo loop verde del slice actual: `bun run check` (43
tests), `bun run browser:smoke` (8 tests), `bun run build`; `security:scan` y
visual audit quedaron verdes en el corte anterior.

Continuar profundizando in-zooming: edicion/reordenamiento del timeline
top-to-bottom, reasignacion manual de enlaces externos, split de `effect`; luego
unfold/despliegue de objetos.
```

---

## Estado actual

### Ingenieria inversa OPCloud (deep-opm-pro)

| Artefacto | Estado | Ubicacion |
|-----------|--------|-----------|
| Bundle produccion (42 MB) | Descargado | `_local/bundles/` (gitignored) |
| Decompilacion (808 modulos, 91 MB) | Completa | `decompiled/` (gitignored) |
| Firebase config | Extraida | `config/firebase.json` |
| 28 rutas Angular | Extraidas | `config/routes.json` |
| Inventario de assets referenciados | Curado | `config/assets.json` |
| Config edX (Technion) | Descargado | `config/edx.config.json` |
| 376 clases OPM | Catalogadas | `catalog/classes.txt` |
| Modulos clave con mapeo | Catalogados | `catalog/modules.md` |
| 84 assets (73 SVG + 11 PNG) | Descargados | `assets/` |
| HTML raiz y favicon | Capturados | `webroot/` |
| 7 grupos de modelos del sandbox | Extraidos y organizados | `fixtures/{empty-model,onstar-system,opm-meta-model,sd-async,sd-sync,system-diagram,meta}/` |
| Joyas/hallazgos tecnicos | Documentados | `docs/JOYAS.md` |
| Procedimiento de extraccion | Documentado | `docs/PROCEDIMIENTO.md` |
| Script de regeneracion | Listo | `setup.sh` |
| Instrucciones para agentes | Creado | `AGENTS.md` |
| Backlog HU local v2 | Validado | `docs/historias-usuario-v2/` |
| Roadmap operativo | Creado | `docs/roadmap/` |

### Desarrollo de software (backlog HU local)

| Artefacto | Estado | Ubicacion |
|-----------|--------|-----------|
| Metodologia HU v2 | Completa | `docs/historias-usuario-v2/00-METODOLOGIA.md` |
| Auditoria categorial HU | Completa | `docs/historias-usuario-v2/07-AUDITORIA-CATEGORIAL.md` |
| EPICA-10 (creacion-cosas) | revision-piloto | piloto manual completo |
| EPICA-11 a EPICA-50 (10 epicas M0) | revision-piloto | rebasadas contra SSOT + evidencia OPCloud |
| EPICA-14 a EPICA-D1 (37 epicas M1-W) | revision-piloto | rebasadas via agentes |
| Total v2: 48/48 epicas, 1,117 HU canonicas + 48 stubs | validado | 0 violaciones de linter, 0 huerfanas v1→v2 |

### App nueva (`app/`)

| Artefacto | Estado | Ubicacion |
|-----------|--------|-----------|
| Kernel OPM minimo | Implementado | `app/src/modelo/` |
| OPL-ES forward | Implementado | `app/src/opl/` |
| JSON export/import | Implementado | `app/src/serializacion/` |
| UI Preact/Zustand | Implementado | `app/src/ui/` |
| Adapter JointJS OSS | Implementado minimo | `app/src/render/jointjs/` |
| Dirty state + undo/redo | Implementado minimo | `app/src/store.ts`, `app/src/store.test.ts`, `app/src/ui/Toolbar.tsx` |
| Arbol OPD + OPD activo | Implementado minimo | `app/src/ui/ArbolOpd.tsx`, `app/src/store.ts`, `app/e2e/opm-smoke.spec.ts` |
| Descomposicion reversible de proceso a OPD hijo | Implementado minimo | `app/src/modelo/operaciones.ts`, `app/src/ui/Inspector.tsx`, `app/e2e/opm-smoke.spec.ts` |
| Smoke navegador | Implementado, 7 casos | `app/e2e/opm-smoke.spec.ts` |

### NO obtenido (sin cambios)

| Artefacto | Bloqueante | Razon |
|-----------|------------|-------|
| Cuenta en produccion | **Si** | `opcloud.systems` no permite self-registration ni SSO |
| Schema Firestore | **Si** | Requiere token de usuario autenticado |
| Formato export de modelos | **Si** | Sandbox es read-only; produccion requiere cuenta |
| Codigo del backend (Express/GAE) | No | No es publico |
| Source maps TypeScript | No | `--source-map=false` en el build |
| HAR de sesion autenticada | **Si** | Sin cuenta no se puede capturar |

---

## Decisiones tomadas

1. **No versionar `decompiled/` ni `_local/`**: material grande (140 MB), propiedad de OPCloud Ltd., regenerable con `setup.sh`.

2. **Versionar `fixtures/` reestructurado por modelo**: el antiguo `sandbox-data/` con 42 archivos planos se reorganizo en 7 carpetas por modelo (`fixtures/{empty-model,onstar-system,opm-meta-model,sd-async,sd-sync,system-diagram,meta}/`).

3. **Agrupar documentacion en `docs/`**: `HANDOFF.md`, `JOYAS.md`, `PROCEDIMIENTO.md` movidos de raiz a `docs/`.

4. **Mover capturas raiz a `webroot/`**: `index.html` y `favicon.ico` movidos de raiz a `webroot/`.

5. **Crear `AGENTS.md`** con principio rector: verificar 8 niveles de insumos OPCloud (assets → JOYAS → decompiled → fixtures → catalog → config) antes de generar soluciones de novo. Arquitectura final puede diferir; SVGs, dimensiones, colores y plantillas OPL se reutilizan directamente.

6. **SSOT OPM v3.0.0 como autoridad normativa**: `opm-iso-19450-es.md` → `opm-visual-es.md` → `opm-opl-es.md` en ese orden. OPCloud es evidencia de producto, no autoridad normativa.

7. **Clasificar cada HU por tipo**: `opm-semantica` (exigido por SSOT, M0), `opcloud-ui` (afordance OPCloud, puede divergir), `mixto` (necesidad generica, implementacion referencial).

8. **Referencias SSOT inline en HU**: formato `[V-xxx]` (reglas visuales), `[Glos 3.x]` (glosario), `[OPL-ES Txxx]` (plantillas textuales), `[JOYAS §x]` (valores visuales canonicos).

9. **Terminologia espanola canonica SSOT** en todas las HU: `afiliacion`, `esencia`, `descomposicion`, `informacional`, `enlace`, `cosa`.

10. **No incluir el bundle de sandbox ni su decompilacion**: enfocar el repo exclusivamente en version comercial (`opcloud.systems`).

11. **2026-05-03: cambio de politica — versionar `opm-extracted/`** (~8 MiB, 349 archivos OPM legibles + 84 assets + 3 indices). Es derivado curado del split de `decompiled/deobfuscated.js` (mina principal: 344 modulos OPM concatenados) + `decompiled/37084.js` (chunk Angular: 282 OPM + libs npm) + 14 chunks lazy-loaded pequenos. Pipeline en 3 pasos en `opm-extracted/tools/`:
    - `extract.mjs`: splitter por marcador `// CONCATENATED MODULE: ./src/app/<path>`, descarta libs npm, des-indenta closure webpack.
    - `refactor.mjs`: 6 pasadas — resolver `name /* RealName */.exportkey -> RealName`, limpiar `_X__WEBPACK_IMPORTED_MODULE_N__ -> X`, renombrar prefijos de concatenacion, eliminar self-assigns.
    - `build-index.mjs`: emite `INDEX.md` (486 clases), `MODULES.md` (349 archivos), `assets/INDEX.md` (84 assets con cross-reference).
    Fundamento: el riesgo legal de "fair use observacional" sobre material decompilado se documenta explicitamente; la finalidad de `opm-extracted/` es servir como spec ejecutable de OPM/ISO 19450 para construir `app/` con stack divergente (Preact != Angular). No se copia codigo 1:1 a `app/`.

12. **2026-05-03: app nueva desde cero en `app/`**. Stack operativo: Bun + Vite + Preact + Zustand + JointJS OSS. El dominio vive en TypeScript propio (`app/src/modelo/`); JointJS es adaptador de render.

13. **2026-05-03: HU v2 como backlog vivo**. `docs/historias-usuario-v2/` reemplaza `docs/historias-usuario/` para desarrollo activo. `docs/roadmap/` define el corte operativo para no arrastrar las 1,117 HU a cada cambio.

14. **2026-05-03: undo/redo por snapshots para MVP-alpha**. Profundidad 100, redo se purga tras nueva operacion, save no purga undo, dirty se computa contra snapshot guardado.

---

## Supuestos

1. El hash del bundle de produccion (`a8737ee2a8ed30eb`) puede cambiar en futuros deploys. `setup.sh` tendria que actualizarse.

2. Las security rules de Firebase (`opcloud-trial`) seguiran bloqueando acceso publico.

3. El sandbox seguira siendo demo sin auth mientras OPCloud Ltd. lo mantenga.

4. Los parametros visuales canonicos (135x60, colores #70E483/#3BC3FF/#586D8C, Arial 14px semibold) son estables.

5. Las 48 epicias HU revisadas contienen trazabilidad suficiente para iniciar desarrollo sin re-auditar el corpus `opcloud-reverse/`. Las preguntas abiertas (561 en total) no bloquean implementacion de kernel OPM.

---

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigacion |
|--------|-------------|---------|------------|
| OPCloud cambia hash del bundle | Media | Bajo | `setup.sh` usa variable |
| Sandbox desaparece o requiere auth | Baja | Medio | Datos ya extraidos en `fixtures/` |
| Decompilacion pierde fidelidad | Baja | Medio | webcrack es robusto |
| Cambio de licencia OPCloud | Baja | Alto | Material observacional es fair use; `opm-extracted/` se etiqueta explicitamente como derivado curado para divergencia de stack (no clonacion) |
| Backend/Firebase se migran | Baja | Bajo | Config extraida obsoleta |
| Deriva entre HU revisadas y SSOT futura | Media | Medio | Referencias [V-xxx] permiten re-verificar puntualmente |

---

## Pendientes priorizados

### Alta prioridad

1. **Obtener acceso autenticado a `opcloud.systems`** (sin cambios)
2. **Continuar MVP-alpha profundizando in-zooming y luego unfold** usando `docs/roadmap/sprint-0.md`, `docs/roadmap/mvp-alpha.md`, `docs/roadmap/mvp-alpha-coverage.md`, las HU v2 M0 locales, los insumos de `deep-opm-pro/` como evidencia de producto, y `docs/archive/si-partiese-desde-0.md` como guia de lo que NO repetir. Ya existe contenido interno y redistribucion automatica al primer subproceso; falta multiple subproceso, timeline, reasignacion manual y split de `effect`.

### Media prioridad

3. **Cruzar fixtures con decompilado**: para cada cell JSON en `fixtures/`, encontrar su clase en `decompiled/`.
4. **Extraer templates SVG del decompilado**: markers, filtros, shapes custom.

### Baja prioridad

5. **Actualizar INDICE-HU.md y MATRIZ-HU-REGLAS-SSOT.md** con conteos post-revision (cambiaron prioridades, tipos y referencias SSOT).
6. **Automatizar extraccion del sandbox** con Playwright.

---

## Prompt de continuacion

```
Retomar `docs/HANDOFF.md` en `deep-opm-pro`. Estado: EPICA-20 minimo
implementado con arbol OPD, raiz SD, `opdActivoId`, canvas JointJS y OPL por
OPD activo. EPICA-12 in-zooming MVP implementado para descomponer procesos en
OPD hijo con kernel idempotente, nodo `SDn: <Proceso> descompuesto`, navegacion
automatica, JSON round-trip, contenido interno dentro del contorno, tres
subprocesos iniciales automaticos, OPL en secuencia por `y`, redistribucion de
enlaces externos al primer subproceso interno por `y`, eliminacion de
descomposicion y smoke browser. Auditoria visual SSOT/JointJS aplicada. Ultimo
loop verde del slice actual: `bun run check`, `bun run browser:smoke`, `bun run
build`.

Continuar con edicion/reordenamiento del timeline top-to-bottom, reasignacion
manual de enlaces externos, split de `effect` y luego unfold/despliegue de
objetos.
```
