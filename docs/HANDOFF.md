# HANDOFF — Estado operativo del modelador OPM

**Fecha**: 2026-05-20
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**Último corte funcional**: Corte Dov-Dori: SSOT de puertos, ley temporal categorial y OPL unificado
**Último corte deploy**: `597859c chore(deploy): configura auth dedicado opforja`
**Corte**: Refactor categorial de consistencia modelo-vista-OPL cerrado, sobre producción single-user opforja operable.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. No crear handoffs paralelos. Los reportes/capturas regenerables viven ignorados por git; la memoria versionada queda aquí.

## Fuentes Normativas Y Técnicas

- Plan normativo refactor total: `docs/roadmap/refactorizacion-total-plan-normativo.md`.
- Plan activo render/UI: `docs/roadmap/render-ui-boundary-plan.md`.
- Plan produccion single-user SVG: `docs/roadmap/produccion-usuario-unico-svg-plan.md`.
- Brief UX/IFML historico: `docs/instrucciones-lineas-dev/ronda22/refactor-ux-ifml.md`.
- SSOT OPM: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Evidencia OPCloud preferente: `opm-extracted/` antes de `decompiled/`.
- Canon visual local: `docs/JOYAS.md` y `assets/svg/`.
- JointJS OSS: usar documentación oficial viva cuando se toque JointJS.

## Estado Actual

### Corte Dov-Dori Cerrado — SSOT Puertos, Ley Temporal Y OPL Único — 2026-05-20

Se resolvieron las tres críticas estructurales planteadas contra el
modelador:

1. **Modelo fantasma / fuga render**. El render JointJS ya no sincroniza
   puertos en tiempo de render. `proyectarModeloAJointCells` consume el
   modelo tal como está; la materialización canónica de puertos vive en
   operaciones, store e import/export.
2. **Error categorial temporal**. Las excepciones temporales
   (`excepcionSobretiempo`, `excepcionSubtiempo`,
   `excepcionSubSobretiempo`) quedan restringidas a `Proceso -> Proceso`,
   sin extremos `Estado`. La ley se preserva en creación, reanclaje,
   importación y diagnóstico de modelos ya corruptos.
3. **Cerebro OPL bifurcado**. La generación OPL plana e interactiva queda
   unificada sobre la misma representación lógica; el generador legacy en
   `modelo/opl/generador-opl.ts` pasa a ser wrapper de compatibilidad.

Decisiones:

- Los puertos son semántica serializable del modelo, no estética del
  render. El render puede proyectar, pero no corregir la verdad del store.
- La validación de firma sigue siendo el primer muro; la validación
  metodológica ahora también denuncia corrupción temporal si un modelo
  inválido entra por una ruta interna o legacy.
- No se eliminó `app/src/modelo/opl/generador-opl.ts`, porque scripts
  antiguos lo importan. Se lo redujo a wrapper para evitar doble motor.
- Se corrigió el auditor HU para aceptar el nombre consolidado real del
  diálogo `Abrir / importar modelo`, en vez de exigir el literal legacy
  `Cargar modelo`.

Artefactos principales:

- `app/src/render/jointjs/proyeccion.ts`
- `app/src/modelo/operaciones/enlaces.ts`
- `app/src/store/runtime.ts`
- `app/src/serializacion/json.ts`
- `app/src/modelo/validaciones.ts`
- `app/src/opl/generar.ts`
- `app/src/modelo/opl/generador-opl.ts`
- `app/src/render/jointjs/renderUiBoundary.test.ts`
- `app/src/modelo/operaciones.test.ts`
- `app/src/modelo/operaciones/enlaces.test.ts`
- `app/src/modelo/validaciones.test.ts`
- `app/src/serializacion/json.test.ts`
- `app/src/store/enlaces.test.ts`
- `app/src/opl/generar.test.ts`
- `docs/historias-usuario-v2/tools/progress-dashboard.mjs`
- `docs/roadmap/hu-progress.{md,html,json}` y
  `docs/roadmap/hu-progress-evidence.json`

Validación exacta:

```bash
cd app && bun run gate:refactor
# typecheck OK
# unit: 1456 pass / 0 fail
# lint src/ OK
# build OK
# browser:smoke: 206 passed
# Dashboard HU: Total 27.4%; MVP-alpha 86.2% (104/121); 89/105 reglas auto
# quality:gate PASS; leyes canonicas 6/6; compat detectors 0
```

Supuestos:

- Este corte no cambia funcionalidad de usuario ni diseño visual; corrige
  ubicación de invariantes y consistencia formal.
- Los JSON legacy sin `portId` son aceptados y normalizados al hidratarse.
- Los cambios de `docs/roadmap/hu-progress*` son regenerados por el gate y
  pertenecen al corte porque el ledger final depende de esa firma.

Pendientes:

- Mantener fuera de este commit los artefactos no relacionados que ya están
  sin trackear en `docs/bugs/`, `docs/audits/corte-visual-opcloud-derivado/`
  y `docs/instrucciones-lineas-dev/ronda22/`.
- Después del push, si se despliega producción, ejecutar el flujo de deploy
  opforja documentado y smoke autenticado sobre
  `https://opforja.sanixai.com/`.
- Próximo corte técnico razonable: endurecer la frontera de mutación directa
  del store para que `setState` interno no pueda inyectar modelos sin pasar
  por normalización/validación, o bien documentar formalmente ese bypass como
  herramienta solo-dev.

Riesgos:

- El full smoke Playwright había mostrado previamente dos arranques en blanco
  no deterministas en corridas aisladas; el gate exacto final pasó completo
  con 206/206. Si reaparece, tratarlo como flake de arranque Vite/Playwright,
  no como regresión de puertos, salvo evidencia nueva.
- Cualquier código futuro que construya enlaces manualmente debe pasar por
  operaciones o validación de importación; no escribir `modelo.enlaces`
  directo salvo tests de corrupción explícitos.

Prompt breve de continuación:

> Continuar desde `docs/HANDOFF.md`, sección "Corte Dov-Dori Cerrado — SSOT
> Puertos, Ley Temporal Y OPL Único — 2026-05-20". Verificar que `main`
> contiene el commit del corte y decidir el siguiente paso entre deploy
> opforja con smoke autenticado o endurecimiento de mutación directa del
> store (`setState`/normalización).

### Corte 4 Doc Uso Productivo Cerrado Lado Usuario — 2026-05-19

Se cerró el lado pendiente del Corte 4 del plan single-user SVG. El
cierre anterior (2026-05-18) cubría solo deploy/admin (`opforja.md`,
Dockerfile, Traefik); faltaba la doc desde el ángulo del usuario
operador del modelador, detectada por auditoría `jobs-web-ux` el
2026-05-19 (anti-patrón Tutorial Mountain + violaciones II/XII/XIII/XV
en el material existente).

Resultado:

- `docs/uso-productivo.md` es el doc único del usuario operador. Incluye
  resumen, entrar, crear primer modelo, tres operaciones diarias
  (`Ctrl+S` con chip de persistencia como señal canónica, `Ctrl+F`,
  `Ctrl+K`), respaldo manual como primary (cuándo, cómo descargar, cómo
  restaurar), export SVG del OPD activo, recetas por síntoma observable
  (chip dice `Sin guardar`; cerré sin guardar; navegador borró datos;
  app no carga), atajos útiles y límites honestos.
- `docs/deploy/opforja.md` queda como doc del **administrador** de la
  instancia; pierde §Datos Locales (movido al doc del usuario) y gana
  nota explícita de scope (admin, no usuario) y de que los datos del
  usuario viven en su navegador, no en infraestructura.
- `README.md` §Producción Privada colapsa de 5 bullets a 2 punteros:
  uno al doc del usuario, otro al doc del admin. Elimina duplicación
  previa.
- `docs/roadmap/produccion-usuario-unico-svg-plan.md` §Corte 4 actualiza
  resultado para reflejar cierre real (deploy + usuario), y §Corte 3
  Procedimiento Backup deja de duplicar el procedimiento JSON (apunta a
  `docs/uso-productivo.md` §Respaldo Manual).

Validación:

```bash
cd app && bun run typecheck
# OK — cambio solo en docs, sin impacto runtime
```

Siguiente corte recomendado:

- Corte 5 del plan single-user SVG: gate final de release local, registro
  de baseline final y smoke manual autenticado contra el dominio. Con
  Corte 3.5 y Corte 4 (lado usuario) ya cerrados, el plan queda listo
  para su cierre formal.

### Corte 3.5 Sustracción De Chrome Cerrado — 2026-05-18

Se completó la sustracción de chrome detectada por la auditoría UX 360° del
2026-05-18 (analisis inline contra los 15 principios `jobs-web-ux` y lectura
categorial `cat-thinking`). Las 6 críticas quedan implementadas en commits
atómicos sobre `main` local, sin push:

- `347cb08 refactor(ui): elimina bloque centrado de estado vacio en canvas`.
  El bloque "Iniciar SD" con sus 3 botones primarios + asistente sale del
  canvas. `EstadoVacioOpm` retiene un `HintInicioVacio` discreto abajo
  (microcopy literal: `Pulsa Objeto o Proceso arriba para empezar.`) y el
  Nudge "Conectar como resultado" cuando la firma proceso→objeto aplica.
- `ea26143 refactor(bienvenida): auto-abre ultimo reciente si existe`.
  `PantallaInicio` solo se muestra cuando no hay recientes; con ≥1 reciente
  y query vacío, autoabre el último directo, sin overlay.
- `a256740 refactor(bienvenida): mueve glosa OPM a drawer plegable`. La
  glosa OPM (Cosa/OPD/Apariencia/Enlace) sale del overlay por defecto y
  queda accesible vía botón `?` en el header del panel inicio. Recupera
  ~80 px verticales por default.
- `b3048ec refactor(persistencia): unifica chip y elimina sufijos dirty
  redundantes`. `ChipPersistencia` colapsa a 3 estados literales:
  `Sin guardar · Ctrl+S`, `Guardando…`, `Guardado · HH:mm`. Elimina la
  duplicación previa de estado dirty en el label de tab y en
  `+ Nuevo · sin guardar`.
- `cf3fafb refactor(inspector): rediseña branch vacio con identidad del
  modelo`. `InspectorVacio` muestra nombre del modelo (editable inline al
  click), línea de conteos `N objetos · M procesos · K OPDs · editado
  HH:mm`, y única acción `Renombrar modelo`. Eliminado el bloque
  "ATAJOS PARA EMPEZAR" y el botón gigante "JSON del modelo".
- `c5b0727 refactor(toolbar): oculta + atributo deshabilitado y rotula
  buscar`. "+ Atributo" solo se renderiza si la selección es un objeto
  que admite atributo. El botón de búsqueda de comandos pasa de "⌕"
  solo a "⌕ Buscar" con label legible.

Validación:

```bash
cd app && bun run gate:refactor
# typecheck OK; check OK; lint src/ OK; build OK
# browser:smoke: 196 passed / 0 failed
# Bundle 454.29 kB / 122.46 kB gzip; leyes 6/6; compat 0; Gate ledger PASS
```

Nota sobre flake corregido: un primer paso del gate detectó el smoke
`e2e/11-beta1-busqueda.spec.ts:63` como rojo. La causa fue una race
condition pre-existente: el test hacía `.fill()` sobre el input del
diálogo antes de que el `setTimeout(focus, 50ms)` interno de
`DialogoBuscarCosas` corriera; con el dialog ya visible pero el
componente aún no procesando inputs, la query escrita quedaba sin efecto
y `apariciones` se mantenía en el estado vacio "Escribe para buscar".
El helper `modeloDosOpds()` mantiene `nombre: "SD1"` para `opd-2`; el
catálogo no cambió. Fix sin tocar fixtures: agregar
`await expect(input).toBeVisible()` y `await expect(input).toBeFocused()`
antes del `.fill()`, alineando el test con el patrón ya documentado en
`:106` y `:157` del mismo archivo.

Siguiente corte recomendado:

- Corte 4 del plan single-user SVG: documentación productiva privada
  (build, preview, backup JSON, export SVG, rollback, límites) contra
  la UI ya saneada por Corte 3.5.

### Deploy Privado Opforja Cerrado — 2026-05-18

Se desplego la app en `https://opforja.sanixai.com` siguiendo el patron local de
`hdos-app`: Docker Compose, red Docker externa `web`, Traefik con TLS
`myresolver` y contenedor reiniciable.

Resultado:

- `Dockerfile` compila `app/` con Bun y sirve `app/dist` con Nginx en `8080`.
- `docker-compose.yml` publica `opforja.sanixai.com` por Traefik.
- La ruta queda protegida con `opforja-auth@docker`, porque esta SPA todavia no
  tiene auth interna; `hdos-app` si la tiene.
- El usuario operativo Basic Auth es `fsanhuezal`; la contrasena queda fuera de
  la documentacion versionada y el compose mantiene solo el hash APR1.
- `docs/deploy/opforja.md` documenta deploy, verificacion, backup y rollback.
- Let's Encrypt emitio certificado para `CN = opforja.sanixai.com`.

Validacion:

```bash
cd app && bun run build
# OK

docker compose config
# OK

docker compose up -d --build
# opforja started

docker compose ps
# opforja Up, healthy

docker exec opforja wget -qO- http://127.0.0.1:8080/healthz
# ok

curl -I https://opforja.sanixai.com
# HTTP/2 401; WWW-Authenticate: Basic realm="traefik"

curl -sS -o /tmp/opforja-auth-ok.html -w '%{http_code} %{content_type} %{size_download}\n' -u 'fsanhuezal:<secreto-local>' https://opforja.sanixai.com/
# 200 text/html 1373

curl -sS -o /tmp/opforja-auth-bad.txt -w '%{http_code} %{content_type} %{size_download}\n' -u 'fsanhuezal:wrong' https://opforja.sanixai.com/
# 401 text/plain 17

printf '' | openssl s_client -servername opforja.sanixai.com -connect opforja.sanixai.com:443 2>/dev/null | openssl x509 -noout -subject -issuer -dates
# subject=CN = opforja.sanixai.com; issuer=Let's Encrypt R13
```

Siguiente corte recomendado:

- Corte 5 del plan: gate final de release local, registro de baseline final y
  smoke manual autenticado sobre el dominio.

### Produccion Single-User SVG — Corte 3 Backup JSON Operable Cerrado — 2026-05-18

Se cerro el riesgo operativo principal del uso single-user local: el usuario ya
puede generar un respaldo portable del modelo activo y restaurarlo sin depender
solo de `localStorage`.

Resultado:

- `PersistenciaJson` expone `Descargar JSON` desde
  `Menu principal > Importar/Exportar JSON...`.
- La descarga usa nombre derivado del modelo y fecha (`modelo-YYYY-MM-DD.json`)
  y conserva el formato serializado `deep-opm-pro.modelo.v0`.
- `25-produccion-backup.spec.ts` cubre el flujo completo: importar modelo,
  descargar backup, crear modelo nuevo, reimportar el archivo descargado y
  comparar los conteos del modelo restaurado.
- La persistencia local, dirty guard, round-trip JSON y autosalvado quedan
  cubiertos por tests focales existentes y por el gate completo.
- El procedimiento minimo de backup manual quedo documentado en
  `docs/roadmap/produccion-usuario-unico-svg-plan.md`.

Commit atomico:

- `acdeb32 feat(produccion): agrega backup json descargable`

Validacion:

```bash
cd app && bun test src/persistencia/local.test.ts src/persistencia/autosalvado.test.ts src/store/persistencia.test.ts src/serializacion/json.test.ts
# 79 pass / 0 fail

cd app && bunx playwright test e2e/06-undo-redo-dirty.spec.ts e2e/11-beta1-catalogo-ancla.spec.ts e2e/25-produccion-backup.spec.ts
# 19 passed

cd app && bun run browser:preview
# 1 passed

cd app && bun run gate:refactor
# typecheck OK; 1410 pass / 0 fail / 5266 expect; lint src/ OK; build OK; browser:smoke 196 passed
# Dashboard HU: Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto; firma de fuentes vigente
# Quality gate PASS: bundle 457.31 kB / 122.82 kB gzip; leyes 6/6; compat detectors 0
```

Siguiente corte recomendado:

- Corte 4 del plan: documentacion de uso productivo privado. Debe quedar como
  guia operable breve: build, preview, backup JSON, export SVG, rollback y
  limites conocidos para uso single-user.

### Produccion Single-User SVG — Corte 2 Operacion Estatica Cerrado — 2026-05-18

Se verifico que la app opera como build estatico servido por `vite preview` y
que los affordances no-productivos no rompen la experiencia single-user.

Resultado:

- `browser:preview` ejecuta un smoke focal contra `dist` servido por
  `bun run preview` en `127.0.0.1:4173`.
- `playwright.preview.config.ts` construye y sirve el build productivo para ese
  smoke.
- `playwright.config.ts` excluye `*.preview.spec.ts` del smoke normal; el gate
  principal no duplica el preview productivo.
- El smoke productivo carga la SPA, importa un modelo, renderiza el canvas,
  descarga SVG del OPD activo y verifica que no arrastra chrome.
- `CapturadorBugs` queda fuera de builds productivos por defecto; solo se
  habilita con `VITE_ENABLE_BUG_CAPTURE=true`.
- Si el capturador se habilita contra un hosting sin middleware, degrada con
  mensaje explicito en vez de romper la app.

Commit atomico:

- `1df6f8a test(produccion): valida preview estatico`

Validacion:

```bash
cd app && bun run typecheck
# OK

cd app && bunx playwright test e2e/10-capturador-bugs.spec.ts
# 4 passed

cd app && bun run browser:preview
# 1 passed

cd app && bun run gate:refactor
# typecheck OK; 1410 pass / 0 fail / 5266 expect; lint src/ OK; build OK; browser:smoke 195 passed
# Dashboard HU: Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto; firma de fuentes vigente
# Quality gate PASS: bundle 457.31 kB / 122.81 kB gzip; leyes 6/6; compat detectors 0
```

Siguiente corte recomendado:

- Corte 4 del plan: documentacion de uso productivo privado, usando el backup
  JSON operable ya cerrado en Corte 3.

### Render/UI Boundary — Corte 2 Chrome UI Slots Cerrado — 2026-05-18

Se cerro el plan acotado de frontera `render/jointjs`/UI. `JointCanvas`
mantiene estado e interaccion JointJS, pero dejo de poseer componentes chrome
concretos del canvas.

Resultado:

- `JointCanvas` recibe slots obligatorios `renderMenuTipoEnlace` y
  `renderRenombradoInline`.
- `JointCanvas` ya no importa `MenuTipoEnlace`, `RenombradoInline` ni
  `ui/motion`.
- `JointCanvasFeedbackBoundary` monta el chrome UI concreto y conserva el
  adapter Zustand de feedback creado en Corte 1.
- `renderUiBoundary.test.ts` blinda que `render/jointjs` no vuelva a importar
  chrome UI concreto ni helpers UI de motion.
- Los flujos observables de menu de tipo de enlace, renombrado inline,
  feedback, tabla de enlaces y export SVG quedan preservados.

Commit atomico:

- `808559b refactor(render): desacopla chrome ui del canvas`

Validacion:

```bash
cd app && bun run gate:refactor
# typecheck OK; 1410 pass / 0 fail / 5266 expect; lint src/ OK; build OK; browser:smoke 194 passed
# Dashboard HU: Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto; firma de fuentes vigente
# Quality gate PASS: bundle 465.66 kB / 125.20 kB gzip; leyes 6/6; compat detectors 0
```

Deuda residual medida:

- `JointCanvasFeedbackBoundary` sigue siendo el boundary UI combinado para
  feedback y chrome slots. Renombrarlo puede hacerse luego si aporta claridad,
  pero no bloquea la frontera.
- `render/jointjs/overlayCanvas/*` todavia usa `ui/tokens`; aceptado como
  presentacion de overlays, no como ownership de componentes chrome.
- `render/jointjs/handlers/zoom.ts` todavia importa `atajosTeclado`; queda como
  deuda menor separada de este plan.

### Produccion Single-User SVG — Corte 1 Export OPD Activo Cerrado — 2026-05-18

Se abrio un plan nuevo y acotado para primera produccion privada de usuario
unico, con persistencia local existente y export SVG del OPD activo como salida
minima. No incluye auth, backend, multiusuario, PDF ni ZIP de todos los OPDs.

Resultado:

- `docs/roadmap/produccion-usuario-unico-svg-plan.md` define cortes 0-5 para
  habilitar v0 single-user. Corte 0, Corte 1, Corte 2 y Corte 3 quedan cerrados.
- El menu principal de la vista normal expone `Exportar OPD actual como SVG`;
  la vista de mapa conserva su export PNG/SVG existente.
- La accion usa el `dia.Paper` vivo desde `CanvasAdapterContext` y serializa el
  SVG DOM del paper OSS. No usa `globalThis.__opmJointAdapter` ni JointJS+.
- `mapaExport` prioriza el camino OSS (`paper.el.querySelector("svg")`) y
  conserva fallback historico para mapa.
- `mapaExport.test.ts` cubre serializacion SVG DOM sin `paper.toSVG`.
- `02-canvas-y-render.spec.ts` descarga el SVG, verifica textos OPM y comprueba
  que no arrastra chrome de aplicacion.

Commits atomicos:

- `025d245 docs(produccion): define plan single-user svg`
- `5efff99 feat(export): permite svg del opd activo`

Validacion:

```bash
cd app && bun test src/render/jointjs/mapaExport.test.ts
# 6 pass / 0 fail

cd app && bunx playwright test e2e/02-canvas-y-render.spec.ts --grep "Exportar OPD actual como SVG|renderiza todos los markers"
# 2 passed

cd app && bun run gate:refactor
# typecheck OK; 1409 pass / 0 fail / 5265 expect; lint src/ OK; build OK; browser:smoke 194 passed
# Dashboard HU: Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto; firma de fuentes vigente
# Quality gate PASS: bundle 465.35 kB / 125.28 kB gzip; leyes 6/6; compat detectors 0
```

Siguiente corte recomendado:

- Corte 4 del plan: documentacion de uso productivo privado, con pasos de
  build, preview, backup JSON, export SVG y rollback.

### Render/UI Boundary — Corte 1 Feedback Port Cerrado — 2026-05-18

Se abrio un plan nuevo y acotado para la frontera `render/jointjs`/UI, sin
convertirlo en Corte 11 automatico de la refactorizacion total.

Resultado:

- `docs/roadmap/render-ui-boundary-plan.md` define alcance, no objetivos, dos
  cortes y gates. Corte 1 quedo cerrado; Corte 2 queda cerrado en la seccion
  superior de este handoff.
- `render/jointjs` ya no importa `zustandFeedbackPort` ni
  `useZustandFeedbackOverlays`.
- `JointCanvas` recibe `feedbackPort` y overlays por props; la suscripcion
  Zustand queda en `app/src/ui/JointCanvasFeedbackBoundary.tsx`.
- `hoverTooltip` usa un puerto minimo `setHoverTooltip/clearHoverTooltip`.
- `OverlayLayer` recibe overlays ya resueltos, sin conocer Zustand.
- `renderUiBoundary.test.ts` blinda que `render/jointjs` no vuelva a importar el
  adapter concreto de feedback Zustand.

Validacion:

```bash
cd app && bun test src/store/feedback.test.ts src/render/jointjs/overlayCanvas/avisos.test.ts src/render/jointjs/overlayCanvas/hoverTooltipContent.test.ts src/app/ports/diagnosticsPort.test.ts src/app/ports/canvasInteractionPort.test.ts src/render/jointjs/jointCanvasAdapter.test.ts src/render/jointjs/renderUiBoundary.test.ts
# 16 pass / 0 fail

cd app && bunx playwright test e2e/11-beta1-validacion-metodologica.spec.ts e2e/02-canvas-y-render.spec.ts e2e/11-beta1-tabla-enlaces.spec.ts --grep "panel metodologia|ErrorBadge inline|HoverTooltip|ciclo de feedback|renderiza todos los markers|renderiza modificadores|arrastra una cosa JointJS|lista, filtra|resalta filas filtradas|resalta extremo de estado|edicion de etiqueta"
# 12 passed

cd app && bun run gate:refactor
# typecheck OK; 1407 pass / 0 fail / 5261 expect; lint src/ OK; build OK; browser:smoke 193 passed
# Dashboard HU: Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto; firma de fuentes vigente
# Quality gate PASS: bundle 465.17 kB / 125.23 kB gzip; leyes 6/6; compat detectors 0
```

Deuda residual:

- `render/jointjs/overlayCanvas/*` todavia usa `ui/tokens`; aceptado como
  presentacion de overlays, no como ownership directo de chrome UI.
- `render/jointjs/handlers/zoom.ts` todavia importa `atajosTeclado`; queda como
  deuda menor separada de Corte 1.

### Refactorizacion Total — Corte 10 Auditoria De Proceso Cerrado — 2026-05-18

La rama `main` queda con el gate de refactor endurecido contra falsos verdes de
proceso. El ultimo commit funcional del corte es `e125981`.

Resultado arquitectonico/proceso:

- `gate:refactor` deja de depender de `cd .. && cd app`; ejecuta el dashboard HU
  desde `app/` usando la ruta cwd-safe del script.
- `lint` se amplia de `src/ui/` a `src/`, alineado con la refactorizacion real
  que ya movio fronteras a `app`, `render`, `modelo`, `opl` y `store`.
- `progress-dashboard.mjs` agrega `--dry-run` para auditar sin escribir ledger ni
  reportes, y guarda una firma `sha256` de las fuentes auditadas.
- `quality-ledger.mjs --check` compara la firma actual de
  `app/src`, `app/e2e`, `app/scripts` y `assets/svg/links` contra
  `hu-progress.json`; si el dashboard HU esta stale o sin firma, el gate falla.
- El umbral de bundle queda expresado como baseline `124.62 kB gzip` + margen
  `5 kB`, sin cambiar el limite operativo `129.62 kB gzip`.
- `crearZustandContextualActionExecutionPort` deja de devolver todo `OpmStore`
  por tipado estructural y entrega solo el snapshot declarado.
- `zustandEntityInspectorPorts` conserva lecturas frescas post-mutacion donde
  son necesarias, pero deja de invocar `store.getState()` para renombrar estados
  cuando ya tiene la accion capturada por el adapter.
- El plan normativo y el quality ledger quedan alineados con Corte 10.

Commits atomicos del corte:

- `e125981 refactor(app): acota adaptadores zustand residuales`
- `bfbaa15 fix(quality): bloquea dashboard hu stale`

Validacion de cierre:

```bash
cd app && bun run gate:refactor
# typecheck OK; 1406 pass / 0 fail / 5260 expect; lint src/ OK; build OK; browser:smoke 193 passed
# Dashboard HU: Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto; firma de fuentes vigente
# Quality gate PASS: bundle 464.55 kB / 124.90 kB gzip; leyes 6/6; compat detectors 0
```

Deuda residual medida, fuera de Corte 10:

- `JointCanvas` todavia renderiza chrome UI concreto; el feedback desde render
  quedo cerrado en Render/UI boundary Corte 1.
- Quedan puertos type-only acoplados a `OpmStore`; no migrar masivamente sin
  agrupar por frontera y contrato verificable.
- `zustandGlobalShortcutsPort`, `zustandNewModelAssistantPort` y algunos puertos
  de persistencia/inspector conservan `store.getState()` por comandos compuestos
  o lectura fresca deliberada.
- `HU-50.004` permanece pendiente real: posicion lateral del panel OPL.

### Refactorizacion Total — Corte 9 Cascadas De Efectos Cerrado — 2026-05-18

La rama `main` queda lista para sincronizar con `origin/main` tras el cierre documental de este handoff. El ultimo commit funcional del corte es `3caef2b`.

Resultado arquitectonico/proceso:

- `quality-ledger.mjs` ahora tiene modo `--check` con umbrales de baseline: bundle principal <= 129.62 kB gzip, leyes canonicas 6/6, compat detectors 0, MVP-alpha >= 104 cubiertas + 1 parcial y 89/105 reglas auto. `app/package.json` agrega `quality:gate` y `gate:refactor`.
- La dependencia productiva de UI sobre `globalThis.__opmJointAdapter` queda eliminada. `JointCanvas` publica el adapter por `CanvasAdapterContext`; el global queda solo como hook de debug/in-vivo.
- `App.tsx` deja de importar el store y de registrar atajos con `store.getState()` directo. Los atajos viven en `globalShortcutsPort` con adaptador `zustandGlobalShortcutsPort`.
- `ui/ejecutarAccionContextual.ts` deja de leer Zustand directamente; consume un puerto de ejecucion contextual con adaptador Zustand.
- `zustandLinksTablePort` elimina el snapshot imperativo para renombrar etiquetas y usa selecciones/actions capturadas por el adapter.
- Ocho puertos hoja dejan de tiparse contra `OpmStore`: `HelpPort`, `EditabilityPort`, `WelcomeScreenPort`, `ToolbarOverflowPort`, `MobileReviewPort`, `HistoryPort`, `SessionMessagePort` y `SystemMapViewportPort`.
- El auditor HU actualiza evidencia de atajos y persistencia hacia `app/src/app/ports/globalShortcutsPort.ts`; los reportes `hu-progress.*` quedan regenerados sin caida de reglas.
- El plan normativo agrega explicitamente `Corte 9 - Cascadas De Efectos Y Fronteras Residuales`.

Commits atomicos del corte:

- `d154147 fix(quality): convierte ledger en gate`
- `c973cec refactor(render): expone adapter canvas por contexto`
- `7b73b76 refactor(ports): explicita puertos hoja`
- `800ed77 refactor(app): mueve atajos globales a puerto`
- `4a68304 refactor(app): aísla ejecución contextual del store`
- `3caef2b refactor(app): elimina snapshot imperativo en tabla enlaces`
- `e42616f fix(roadmap): actualiza evidencia de atajos movidos`
- `989d711 docs(refactor): registra cierre corte cascadas`

Validacion de cierre:

```bash
cd app && bun run gate:refactor
# typecheck OK; 1406 pass / 0 fail; lint OK; build OK; browser:smoke 193 passed
# Dashboard HU: Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto
# Quality gate PASS: bundle 463.61 kB / 124.75 kB gzip; leyes 6/6; compat detectors 0
```

Deuda residual medida, fuera de Corte 9:

- `JointCanvas` todavia renderiza chrome UI concreto (`MenuTipoEnlace`, `RenombradoInline`) y sincroniza feedback desde render. La dependencia global quedo cerrada, pero la frontera render/UI completa requiere corte propio con pruebas visuales.
- Quedan 33 puertos type-only bajo `app/src/app/ports/*Port.ts` acoplados a `OpmStore`; el primer lote seguro ya fue migrado, pero no se debe hacer migracion masiva sin agrupar por frontera.
- Algunos adaptadores Zustand conservan `store.getState()` por lectura fresca deliberada o comandos compuestos (`zustandPersistencePort`, `zustandNewModelAssistantPort`, `zustandEntityInspectorPorts`). Requieren cortes focalizados.
- `HU-50.004` permanece pendiente real: posicion lateral del panel OPL. No se implemento para no mezclar feature con refactor.

### Refactorizacion Total — Corte 8 Consistencia Transversal Cerrado — 2026-05-18

La rama `main` queda lista para sincronizar con `origin/main` tras el cierre documental de este handoff. El ultimo commit funcional del corte es `ca471db`.

Resultado arquitectonico/proceso:

- El plan normativo agrega explicitamente `Corte 8 - Consistencia Transversal Y Cierre De Drift`, para resolver la contradiccion previa entre "no hay Corte 8" y el trabajo real de auditoria solicitado.
- `PanelOpl` deja de re-exportar el helper `panelOplMinimizadoEfectivo`; `App` y el test consumen el helper desde `app/viewmodels/panelOplViewModel`.
- El auditor HU separa reglas OPL que antes estaban acopladas artificialmente: numeracion, minimizado/restauracion, AI Text placeholder y posicion lateral ya no se bloquean entre si.
- El auditor HU actualiza rutas obsoletas hacia superficies vigentes: `PanelDiagnostico`, `DialogoConfiguracion`, `BibliotecaDock` y `DialogoPlantillas`.
- El duplicado `HU-13.005` deja de ser inventariable en `HU-SHARED-001`; el dashboard queda sin diagnosticos de duplicate-id.
- `vite.config.ts` elimina el alias `@app` no usado y consolida chunks manuales para cerrar el warning circular `feature-dialogos-pesados <-> feature-modales`.
- `quality-ledger.md` queda alineado con el baseline vivo de Corte 8: bundle principal 463.44 kB / 124.62 kB gzip, leyes 6/6, compat detectors 0.

Commits atomicos del corte:

- `7827563 refactor(opl): mueve helper visual al viewmodel`
- `3b91747 fix(roadmap): separa evidencia hu opl`
- `ca471db fix(build): elimina chunk circular manual`
- `c692199 fix(roadmap): actualiza reglas hu vigentes`
- `docs(refactor): registra cierre corte consistencia` (este handoff)

Validacion de cierre:

```bash
cd app && bun run check
# typecheck OK; 1406 pass / 0 fail
cd app && bun run lint
# OK
cd app && bun run build
# build OK, sin warning de chunk circular
cd app && bun run browser:smoke
# 193 passed
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
# Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto; 0 diagnosticos
cd app && bun run scripts/quality-ledger.mjs --markdown
# Canonical laws 6/6; Compat detectors 0; MVP-alpha 104/121 (86.2%); Auto rules 89/105
```

Deuda residual medida, fuera de Corte 8:

- `render/jointjs` aun importa piezas UI/feedback concretas en algunas integraciones. Resolverlo requiere corte propio de frontera render/UI, no un cleanup documental.
- `App.tsx` y `ui/ejecutarAccionContextual.ts` aun usan `store.getState()` para atajos/global commands. Migrar eso a comandos/puertos debe hacerse como corte de aplicacion.
- Varios puertos bajo `app/src/app/ports/*Port.ts` todavia son contratos tipados desde `OpmStore`; el patron correcto ya existe en `OplPort`, `DiagnosticsPort`, `PersistencePort` y `WorkspacePort`, pero migrar los restantes no debe hacerse masivamente.
- `HU-50.004` permanece pendiente real: posicion lateral del panel OPL. No se implemento para no mezclar feature con consistencia.

### Refactorizacion Total — Corte 7 Limpieza De Compatibilidad Temporal Cerrado — 2026-05-18

La rama `main` queda lista para sincronizar con `origin/main` tras el cierre documental de este handoff. El ultimo commit funcional del corte es `eb2ccd3`.

Resultado arquitectonico:

- Se elimino el wrapper temporal `app/src/ui/panelMetodologiaIssues.ts`; la severidad visible vive directamente en `app/src/modelo/diagnosticoSeveridad.ts`.
- Se retiro el alias legacy `sincronizarOverlayAbanicoEnDrag`; el contrato vigente es `sincronizarOverlayAbanicoConDrag`.
- `OpmStore` ya no expone `designarEstadoInicial` ni `designarEstadoFinal`; la frontera vigente es `designarEstadoComo`. Las funciones puras de dominio se conservaron.
- La auditoria HU dejo de depender de detectores sinteticos/legacy en `proyeccion.ts`, `store.ts`, wrappers UI y aliases de arbol; ahora apunta a composers, view-models o superficies reales.
- Se eliminaron wrappers y re-exports muertos: `DialogoGestionArbol.tsx`, `AsistenteNuevoModelo.tsx` y el re-export test-only de `sugerirEnlaceResultado` en `EstadoVacioOpm.tsx`.
- La proyeccion JointJS ya no lee configuracion global temporal (`globalThis.__deepOpm...`); usa defaults canonicos o opciones explicitas.
- `render/jointjs/mapaSistema.ts` dejo de funcionar como barrel amplio de helpers canvas y expone solo la frontera JointJS/tipos esperada.
- Se corrigio una carrera real del smoke: `CommandPalette` ahora captura `Escape` como modal aunque el input aun no haya recibido foco.
- Se preservaron compatibilidades con consumidores reales: hidratar JSON legacy, `descomponerProceso`/`desplegarObjeto`, y `guardarComoLocal`/`guardarComoLocalConDescripcion`.

Commits atomicos del corte:

- `5951eba refactor(diagnostico): retira wrapper temporal de severidad`
- `2a62de3 refactor(render): elimina alias legacy de abanico drag`
- `1af1f52 refactor(store): elimina aliases deprecated de estados`
- `7fd2e80 refactor(roadmap): reemplaza detector legacy de proyeccion`
- `12be09a docs(roadmap): actualiza detectores hu legacy`
- `ca40238 refactor(ui): elimina aliases legacy del arbol`
- `5a51caf refactor(ui): elimina wrapper muerto de gestion arbol`
- `cfb8aa9 refactor(ui): elimina reexport test-only de estado vacio`
- `7fb204b refactor(ui): elimina wrapper legacy del asistente`
- `4af17d3 refactor(render): elimina opciones globales legacy`
- `212ce02 refactor(render): reduce barrel del mapa sistema`
- `d9aa3d8 refactor(store): retira detector compat heredado`
- `eb2ccd3 fix(ui): estabiliza cierre escape de command palette`

Validacion de cierre:

```bash
cd app && bun run check
# typecheck OK; 1406 pass / 0 fail
cd app && bun run build
# build OK; warning no bloqueante: circular chunk feature-dialogos-pesados <-> feature-modales
cd app && bun run browser:smoke
# 193 passed
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
# Total 22.3%; MVP-alpha 83.4%; 1 advertencia diagnostica por HU-13.005 duplicada
cd app && bun run scripts/quality-ledger.mjs --markdown
# Canonical laws 6/6; Compat detectors 0; Auto rules 81/102
```

Notas de frontera:

- El plan normativo `docs/roadmap/refactorizacion-total-plan-normativo.md` define cortes 0-7; con este corte queda cubierto el ultimo corte operativo declarado.
- La siguiente unidad recomendable no es "Corte 8" dentro del mismo plan, sino una auditoria de cierre contra los indicadores del plan y, si procede, un nuevo plan normativo acotado para deuda residual.
- El warning de build sobre chunk circular queda registrado como deuda de empaquetado; no bloquea el corte porque no se introdujo en esta limpieza y el build produce artefactos validos.
- Los directorios no versionados existentes bajo `docs/audits/`, `docs/bugs/` y `docs/instrucciones-lineas-dev/ronda22/` siguen fuera del corte.

### Refactorizacion Total — Corte 6 Store Por Capacidades Reales Cerrado — 2026-05-18

La rama `main` queda sincronizada con `origin/main` tras `45145da`.

Resultado arquitectonico:

- `ModeloSlice` deja de declararse como union literal extensa en `sliceTypes.ts`; el contrato vive en `app/src/store/modelo/contrato.ts` como capacidades nombradas (`MODELO_SLICE_CAPABILITIES`) y claves derivadas (`MODELO_SLICE_KEYS`).
- `AtajosSlice` queda tipado como capacidad propia en `app/src/store/atajos.ts`, sin depender de `Pick<OpmStore, ...>`.
- Las derivaciones de mapa (`descriptorMapaFiltrado`, `estadisticasModelo`) salen del store y viven como selectores puros en `app/src/store/mapaSelectors.ts`.
- `SystemMapDataPort` deja de tiparse contra miembros de `OpmStore`; expone tipos explicitos de descriptor, estadisticas y navegacion.
- `designarEstadoInicial` y `designarEstadoFinal` se conservan como aliases compatibles, pero quedan deprecated y delegan a `designarEstadoComo`.
- `MapaSistema` sincroniza paper y cells con `useLayoutEffect` para no declarar la vista visible antes de instalar las celdas JointJS.
- No se elimino compatibilidad usada por UI, no se cambio formato JSON, no se cambiaron reglas OPM/OPL y no se agregaron funcionalidades.

Commits atomicos del corte:

- `33ec412 refactor(store): explicita contrato de modelo por capacidades`
- `ec0f469 refactor(store): tipa atajos como capacidad propia`
- `e15ba55 refactor(store): mueve derivaciones de mapa a selectores`
- `737002f refactor(store): centraliza designacion de estados`
- `45145da fix(ui): sincroniza mapa antes de pintar`

Validacion de cierre:

```bash
cd app && bun run check
# typecheck OK; 1407 pass / 0 fail
cd app && bun run build
# build OK
cd app && bun run browser:smoke
# 193 passed
cd app && bun test src/store/modelo/contrato.test.ts src/store/modelo.test.ts
# 5 pass / 0 fail
cd app && bun test src/store/atajos.test.ts src/ui/CommandPalette.test.ts
# 9 pass / 0 fail
cd app && bun test src/store/mapaSelectors.test.ts src/store/mapa.test.ts src/render/jointjs/mapaSistema.test.ts
# 30 pass / 0 fail
```

Notas de frontera:

- `OpmStore` sigue siendo fachada de sesion; el corte redujo contratos efectivos y dependencias tipadas, no intento borrar Zustand.
- `guardarComoLocal` y `guardarComoLocalConDescripcion` no se colapsaron porque la auditoria encontro comportamiento divergente; tratarlos requiere corte propio o pruebas de migracion.
- La compatibilidad de aliases de estado queda marcada para Corte 7 solo si no hay consumidores activos.
- El siguiente corte normativo recomendado es Corte 7: Limpieza De Compatibilidad Temporal. Debe empezar por wrappers/aliases sin consumidores, con verificacion previa de call sites.

### Refactorizacion Total — Corte 5 OPL Y Diagnostico Como Capacidades Cerrado — 2026-05-18

La rama `main` queda sincronizada con `origin/main` tras `cf43571`.

Resultado arquitectonico:

- `OplPort` y `DiagnosticsPort` dejan de tiparse contra `OpmStore`; exponen contratos explicitos basados en tipos de dominio.
- `app/src/opl/panel.ts` concentra la derivacion del panel OPL: lineas, texto, bloques jerarquicos, filtros por seleccion/busqueda, referencia activa y preview del editor libre.
- `PanelOpl` queda como consumidor del view-model; la generacion OPL, filtros e inverse editing ya no quedan dispersos dentro del componente.
- `app/src/modelo/diagnosticoSeveridad.ts` concentra la clasificacion visible de severidades metodologicas (`bloqueo`, `mejora`, `estilo`) sin cambiar los codigos actuales.
- `app/src/app/viewmodels/panelDiagnosticoViewModel.ts` deriva issues de diagnostico, grupos visibles y navegacion desde `AvisoDiagnostico`; `PanelDiagnostico` queda limitado a render y estado visual local.
- `DiagnosticsPort` expone `listarAvisos(alcance)` y compone avisos del OPD activo; `arbolOpdViewModel` consume ese contrato en vez de importar directo el calculo de diagnostico.
- `render/jointjs/overlayCanvas/avisos.ts` se mantiene usando la funcion pura `listarAvisosDiagnostico(modelo, alcance)` porque recibe `modelo` explicitamente y actua como utilidad de render; no se abrio radio innecesario.
- No se cambiaron frases OPL, severidades/citas SSOT, formato JSON, reglas de validacion, comportamiento visible ni semantica OPM.

Commits atomicos del corte:

- `42f7bf9 refactor(app): tipa puertos opl diagnostico`
- `9ea442f refactor(opl): extrae derivacion de panel`
- `37a544c refactor(diagnostico): extrae derivacion de panel`
- `cf43571 refactor(diagnostico): expone calculo por puerto`

Validacion de cierre:

```bash
cd app && bun test src/opl src/modelo/checkers.test.ts src/modelo/validaciones.test.ts
# 338 pass / 0 fail
cd app && bun run browser:smoke -- e2e/03-opl-panel.spec.ts e2e/11-beta1-validacion-metodologica.spec.ts
# 19 passed
cd app && bun run check
# typecheck OK; 1401 pass / 0 fail
cd app && bun run build
# build OK
```

Notas de frontera:

- `OpmStore` sigue siendo fachada de sesion; el corte solo reduce el contrato consumido por OPL/diagnostico.
- `panelMetodologiaIssues.ts` queda como re-export temporal para compatibilidad de imports existentes; la fuente nueva de severidad visible vive en `modelo/diagnosticoSeveridad.ts`.
- El siguiente corte normativo recomendado es Corte 6: Store Por Capacidades Reales. Debe enfocarse en reagrupar slices/contratos efectivos, no en nuevas superficies UI.

### Refactorizacion Total — Corte 4 Persistencia Y Workspace Como Infraestructura Cerrado — 2026-05-18

La rama `main` queda sincronizada con `origin/main` tras `91d247a`.

Resultado arquitectonico:

- `app/src/persistencia/workspaceStorage.ts` concentra lectura/escritura del índice workspace y preferencias UI booleanas, sin depender de `localStorage` global.
- `PersistencePort` y `WorkspacePort` dejan de tiparse contra `OpmStore`; describen contratos explícitos para persistencia, workspace, carpetas, versiones y búsqueda.
- `app/src/persistencia/versiones.ts` expone `ResultadoVersion<T>` con códigos (`storage_no_disponible`, `storage_escritura_fallida`, `storage_lectura_fallida`, `storage_borrado_fallido`, `version_no_encontrada`, `snapshot_no_encontrado`, `snapshot_corrupto`) y mantiene wrappers compatibles `crearVersion`, `restaurarVersion`, `eliminarVersion`.
- Los callers de store para crear/restaurar/eliminar versiones consumen los resultados tipados sin `try/catch` genérico en el camino esperado.
- Puertos adyacentes de workspace/persistencia (`VersionHistoryPort`, `SearchDialogsPort`, `CommandPalettePort`) dejan de depender de `OpmStore`.
- No se cambio formato JSON exportado, claves `localStorage`, backend, UX visible, semantica OPM ni serialización.

Commits atomicos del corte:

- `36c8498 refactor(persistencia): extrae storage de workspace`
- `6c09e9c refactor(app): tipa puerto de persistencia`
- `1bee048 refactor(app): tipa puerto de workspace`
- `261f76f refactor(persistencia): tipa resultados de versiones`
- `91d247a refactor(app): desacopla puertos de workspace del store`

Validacion de cierre:

```bash
cd app && bun run check
# typecheck OK; 1390 pass / 0 fail
cd app && bun run build
# build OK
cd app && bun test src/persistencia src/serializacion
# 131 pass / 0 fail
cd app && bun run browser:smoke -- e2e/06-undo-redo-dirty.spec.ts e2e/01-carga-y-workspace.spec.ts
# 22 passed
```

Notas de frontera:

- `OpmStore` sigue existiendo como fachada de sesión y compatibilidad; el corte no intenta borrar Zustand.
- Persistencia local y versionado ya devuelven resultados tipados en la frontera nueva, pero flujos más grandes de guardar/cargar siguen orquestados desde slices por compatibilidad.
- Quedan otros puertos de UI fuera del alcance de Corte 4 que todavía usan `OpmStore`; deben tratarse solo cuando un corte normativo lo exija.

### Refactorizacion Total — Corte 3 JointJS Como Adapter Cerrado — 2026-05-17

La rama `main` quedo sincronizada con `origin/main` tras `5c5cde4`.

Resultado arquitectonico:

- `JointCanvas` ya no crea directamente `dia.Graph`/`dia.Paper`; delega montaje, destruccion, debug hook, namespace y grid en `app/src/render/jointjs/jointCanvasAdapter.ts`.
- `CanvasInteractionPort` explicita la frontera que el renderer consume desde sesion, seleccion y comandos de modelo, sin duplicar estado ni crear otro store.
- La sincronizacion de cells proyectadas (`resetCells` + dimensiones de paper) vive en el adapter; `proyectarModeloAJointCells` permanece puro.
- El handler de tooltip de hover/foco sale de `JointCanvas` a `handlers/hoverTooltip.ts`, manteniendo el componente como orquestador.
- No se cambio JointJS, geometria canonica, markers, metadata OPM, OPL, formato de persistencia ni UX visible.

Commits atomicos del corte:

- `fdc8e0a refactor(render): extrae adapter de canvas jointjs`
- `dd7fd37 refactor(app): introduce puerto de interaccion canvas`
- `9e6b841 refactor(render): mueve sync de cells al adapter jointjs`
- `e407292 refactor(render): extrae handler de tooltip canvas`
- `5c5cde4 docs(refactor): registra cierre corte jointjs adapter`

Validacion de cierre:

```bash
cd app && bun run check
# typecheck OK; 1379 pass / 0 fail
cd app && bun run build
# build OK
cd app && bun run browser:smoke -- e2e/02-canvas-y-render.spec.ts e2e/11-beta1-tabla-enlaces.spec.ts
# 23 passed
```

Documentacion JointJS OSS consultada para el corte:

- `https://docs.jointjs.com/learn/features/diagram-basics/paper/`
- `https://docs.jointjs.com/api/dia/Graph/`
- `https://docs.jointjs.com/4.0/learn/features/customizing-shapes/cell-namespaces/`

### Refactorizacion Total — Corte 1 ViewModels UI Cerrado — 2026-05-17

La rama `main` queda sincronizada con `origin/main` tras `495cc19`.

Resultado arquitectonico:

- `rg "useOpmStore" app/src/ui -l` no reporta archivos.
- Los componentes UI siguen renderizando y gestionando interaccion visual, pero ya no leen Zustand directamente.
- `app/src/app/viewmodels/` actua como fachada temporal sobre el store para pantallas, dialogos, toolbar, mapa, command palette, asistente, arbol, inspectors y chrome.
- No se cambio semantica OPM, textos visibles, layout intencional ni formato de persistencia.
- Se mantuvo JointJS como adapter visual; el corte no movio proyeccion ni geometria.

Commits atomicos recientes de cierre:

- `495cc19 refactor(ui): extrae viewmodel de toolbar base`
- `3d67c08 refactor(ui): extrae viewmodel de barra contextual`
- `4f1c273 refactor(ui): extrae viewmodel de command palette`
- `b70fac1 refactor(ui): extrae viewmodel de mapa sistema`
- `3907535 refactor(ui): extrae viewmodel de menu principal`
- `7911635 refactor(ui): extrae viewmodel de asistente`
- `cd002e3 refactor(ui): extrae viewmodel de capturador bugs`
- `5662d9f refactor(ui): extrae viewmodel de arbol opd`
- `6a6f843 refactor(ui): extrae viewmodel de toolbar creacion`
- `951eb7b refactor(ui): extrae viewmodel de pantalla inicio`
- `d278715 refactor(ui): extrae viewmodel de plantillas`
- `c26c58b refactor(ui): extrae viewmodel de gestion opd`

Validacion acumulada del cierre de Corte 1:

```bash
cd app && bun run typecheck
cd app && bun run build
cd app && bun test src/ui/BarraHerramientasElemento.test.ts
cd app && bun test src/ui/CommandPalette.test.ts
cd app && bun test src/render/jointjs/mapaSistema.test.ts
cd app && bun test src/store/uiPanel.test.ts src/ui/toolbar/ToolbarCreacion.test.ts
cd app && bun run browser:smoke -- e2e/15-superficie-contextual.spec.ts
cd app && bun run browser:smoke -- e2e/12-command-palette.spec.ts
cd app && bun run browser:smoke -- e2e/04-arbol-y-pestanas.spec.ts
cd app && bun run browser:smoke -- e2e/12-toolbar-overflow.spec.ts e2e/02-canvas-y-render.spec.ts e2e/21-estado-vacio-opm.spec.ts
```

Resultados observados:

```text
typecheck OK
build OK
BarraHerramientasElemento: 53 pass / 0 fail
CommandPalette: 4 pass / 0 fail
mapaSistema: 13 pass / 0 fail
uiPanel + ToolbarCreacion: 4 pass / 0 fail
superficie contextual: 11 passed
command palette: 5 passed
arbol y pestanas: 6 passed
toolbar + canvas + estado vacio: 25 passed
```

Siguiente corte normativo recomendado:

- Entrar a Corte 2 del plan: puertos de aplicacion sobre el store existente.
- No hacer otra ronda de viewmodels cosmeticos: el valor ahora esta en que viewmodels grandes dependan de puertos pequenos (`ModelCommandPort`, `SelectionPort`, `OplPort`, `PersistencePort`) en vez de `useOpmStore`.
- Primer candidato pragmatico: consolidar `app/src/app/ports/` existente y migrar 1-2 viewmodels de alto trafico (`toolbarCreacionViewModel`, `jointCanvasViewModel` o `tablaEnlacesViewModel`) a puertos ya creados, sin segundo store global.

### Refactorizacion Total — Corte 2 Puertos De Aplicacion Iniciado — 2026-05-17

Avance posterior al cierre de Corte 1:

- `ea7257a refactor(app): usa puertos en toolbar creacion`
  - `toolbarCreacionViewModel` consume `ModelCommandPort` y `SelectionPort` para comandos de enlace y seleccion.
  - Validado con typecheck, build, `ToolbarCreacion.test.ts` y `e2e/24-conexion-anchor.spec.ts`.
- `1f58233 refactor(app): introduce puerto de sesion canvas`
  - Nuevo `CanvasSessionPort` para estado de sesion/presentacion del canvas.
  - `jointCanvasViewModel` queda compuesto por puertos de comandos, seleccion y sesion canvas.
  - Validado con typecheck, build, `proyeccion.test.ts`, `halos.test.ts` y `e2e/02-canvas-y-render.spec.ts`.
- `9ce1e7f refactor(app): introduce puerto de navegacion opd`
  - Nuevo `OpdNavigationPort` para `modelo`, `opdActivoId` y `cambiarOpdActivo`.
  - `breadcrumbViewModel` deja de depender directo del store.
  - Validado con typecheck, build y `e2e/04-arbol-y-pestanas.spec.ts`.
- `f908717 refactor(app): introduce puerto de arbol opd`
  - Nuevo `OpdTreePort` para acciones/estado especificos del arbol OPD.
  - `arbolOpdViewModel` depende de `OpdNavigationPort` + `OpdTreePort`.
  - Validado con typecheck, build, `bun test src/store.test.ts -t "mapa del sistema"` y `e2e/04-arbol-y-pestanas.spec.ts`.
- `938d78e refactor(app): introduce puerto de tabla enlaces`
  - `tablaEnlacesViewModel` consume `LinksTablePort`.
  - Validado con typecheck, build, suite unitaria completa y smokes de tabla/superficie contextual.
- `0b40679 refactor(app): introduce puerto de inspector enlaces`
  - `inspectorEnlaceViewModel` consume `LinkInspectorPort` dividido internamente por sesion, propiedades, endpoints, grupo estructural, estilo y eliminacion.
  - Validado con typecheck, build, suite unitaria completa y smokes de canvas/enlaces/tabla.
- `7b41642 refactor(app): introduce puerto de paleta comandos`
  - `commandPaletteViewModel` consume `CommandPalettePort`.
  - Validado con typecheck, build, `CommandPalette.test.ts` y smoke `e2e/12-command-palette.spec.ts`.
- `450d85d refactor(app): introduce puertos de chrome e historial`
  - `toolbarBaseViewModel` empieza a depender de `ToolbarChromePort` y `HistoryPort`.
  - Validado con typecheck, build, suite unitaria completa y smokes de toolbar/command palette/undo-redo.
- `f2b1b73 refactor(app): introduce puerto de creacion modelo`
  - Nuevo `ModelCreationPort` para creacion de objeto/proceso/atributo y modal de nombre de cosa.
  - Validado con typecheck, build, suite unitaria completa y smokes de canvas/toolbar/conexion.
- `6b1ec89 refactor(app): usa puerto de seleccion en toolbar`
  - `toolbarBaseViewModel` reutiliza `SelectionPort` para seleccion pasiva y acciones de seleccionar entidad/enlace.
  - Validado con typecheck, suite unitaria completa y tests focales de seleccion.
- `5722eba fix(ui): prioriza escape de dialogos modales`
  - Corrige carrera de Escape entre `Dialogo`, registry global de atajos y `ToolbarMas`.
  - Validado con typecheck, unitarios de atajos/dialogos/toolbar y smoke `HU-33.022`.
- `915f45c refactor(app): introduce puerto de controles workbench`
  - Nuevo `WorkbenchViewControlsPort` para alias/descripciones, modo imagen, grid, configuracion, layout sugerido, biblioteca dock, mapa y simulacion.
  - Validado con typecheck, build, suite unitaria completa y 33 smokes seriales de workbench.
- `5dc9acf refactor(app): introduce puerto de acciones batch seleccion`
  - Nuevo `SelectionBatchActionsPort` compartido por toolbar base y barra contextual.
  - Validado con typecheck, build, suite unitaria completa y 43 smokes de canvas/toolbar/residual.
- `9020873 refactor(app): introduce puerto de acciones enlace`
  - Nuevo `LinkContextActionsPort` compartido por toolbar base y barra contextual para copiar/pegar estilo, portapapeles de estilo y borrado contextual de enlaces.
  - Validado con typecheck, build, suite unitaria completa y 39 smokes de canvas/residual.
- `ebad43c refactor(app): introduce puerto de autosalvado`
  - Nuevo `AutosavePort` para estado y ciclo iniciar/detener autosalvado.
  - `toolbarBaseViewModel` y `toolbarViewModel` dejan de leer autosalvado directo desde Zustand.
  - Validado con typecheck, build, suite unitaria completa y 19 smokes de dirty/undo/toolbar.
- `aff840c refactor(app): reutiliza puerto de navegacion opd en toolbar`
  - `toolbarBaseViewModel` reutiliza `OpdNavigationPort` para `modelo` y `opdActivoId`.
  - Validado con typecheck, build, unitarios focales y smoke `e2e/12-toolbar-overflow.spec.ts`.
- `7774a55 refactor(app): introduce puerto de vista mapa`
  - Nuevo `MapViewPort` para `vistaMapaActiva`, `abrirVistaMapa` y `cerrarVistaMapa`.
  - `WorkbenchViewControlsPort` deja de mezclar responsabilidad de mapa.
  - Validado con typecheck, build, suite unitaria completa y smokes de toolbar/arbol/mapa.
- `4577949 refactor(app): reutiliza puertos en barra contextual`
  - `barraHerramientasElementoViewModel` reutiliza `OpdNavigationPort` y `SelectionPort` para lectura de modelo/OPD/seleccion.
  - Validado con typecheck, build, suite unitaria completa y 28 smokes de canvas/superficie contextual.
- `fe3361f refactor(app): introduce puerto de acciones de elemento`
  - Nuevo `SelectedElementActionsPort` para acciones de estado/refinamiento/imagen sobre el elemento seleccionado.
  - `barraHerramientasElementoViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, suite unitaria completa y 43 smokes de canvas/superficie/refinamiento.
- `64b673b refactor(app): reutiliza puertos en toolbar creacion`
  - `toolbarCreacionViewModel` reutiliza `ModelCreationPort` y `OpdNavigationPort` para modo de creacion y modelo.
  - Validado con typecheck, build, suite unitaria completa y 20 smokes de conexion/canvas.
- `7283f91 refactor(app): introduce puerto de modo interaccion`
  - Nuevo `InteractionModePort` para `modoEnlace` y `modoSeleccion`.
  - `toolbarCreacionViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, suite unitaria completa y 20 smokes de conexion/canvas.
- `fa9d140 refactor(app): introduce puerto de controles mapa`
  - Nuevo `SystemMapControlsPort` para refresco de mapa, auto-refresh y panel de estadisticas.
  - `toolbarMapaSistemaViewModel` queda sin dependencia directa a `useOpmStore`; `mapaSistemaViewModel` reutiliza el puerto para controles compartidos.
  - Validado con typecheck, build, suite unitaria completa y smokes de arbol/mapa/toolbar.
- `224c7c5 refactor(app): reutiliza puertos en mapa sistema`
  - `mapaSistemaViewModel` reutiliza `OpdNavigationPort` para `modelo` y `MapViewPort` para cierre de mapa.
  - Validado con typecheck, build, suite unitaria completa y smoke `e2e/04-arbol-y-pestanas.spec.ts`.
- `c096639 refactor(app): introduce puerto de mensajes de sesion`
  - Nuevo `SessionMessagePort` para `mensaje` y `limpiarMensaje`.
  - `mensajeFlashViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, `MensajeFlashBridge.test.ts` y `feedback.test.ts`.
- `6b3bea9 refactor(app): introduce puertos de modales de metadatos`
  - Nuevos `EntityMetadataModalPort` y `StateDurationModalPort`.
  - `modalImagenObjetoViewModel`, `modalUrlsObjetoViewModel` y `modalDuracionEstadoViewModel` quedan sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de metadata/duracion y smoke `e2e/02-canvas-y-render.spec.ts`.
- `8f17d94 refactor(app): introduce puerto de revision mobile`
  - Nuevo `MobileReviewPort` para tabs del modo revision mobile.
  - `modoRevisionMobileViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, `ModoRevisionMobile.test.tsx` y smoke `e2e/22-responsive-review.spec.ts`.
- `8c07ae5 refactor(app): introduce puerto de dialogo configuracion`
  - Nuevo `ConfigurationDialogPort` con grid normalizado en adapter.
  - `dialogoConfiguracionViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build y smokes `e2e/11-dialogo-layout-regression.spec.ts` + `e2e/12-toolbar-overflow.spec.ts`.
- `d814e30 refactor(app): introduce puerto de pestanas de sesion`
  - Nuevo `SessionTabsPort` para pestanas abiertas, activa, cambio/cierre/reordenamiento y guardado local del cierre dirty.
  - `barraPestanasViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de pestanas/persistencia/runtime y smoke `e2e/04-arbol-y-pestanas.spec.ts`.
- `08b631e refactor(app): reutiliza puertos en menu principal`
  - `menuPrincipalViewModel` empieza a reutilizar puertos existentes de chrome, pestanas, persistencia, workspace, mapa, workbench, navegacion OPD y seleccion.
  - `PersistencePort` incorpora `abrirCargarModelo`.
  - Validado con typecheck, build, unitarios focales y smoke `e2e/12-toolbar-overflow.spec.ts`.
- `e1ce0c0 refactor(app): introduce puertos complementarios de menu`
  - Nuevos `HelpPort`, `ModelBootstrapPort`, `SearchDialogsPort` y `TemplateDialogsPort`.
  - `LinksTablePort`, `PersistencePort` y `EntityMetadataModalPort` incorporan openers nombrables.
  - `menuPrincipalViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios focales y smokes de toolbar, command palette y tabla de enlaces.
- `5ea674a refactor(app): reutiliza puertos en inspector raiz`
  - `inspectorViewModel` reutiliza `OpdNavigationPort`, `SelectionPort` y `PersistencePort`.
  - Validado con typecheck, build, unitarios de inspector y smokes de superficie contextual, tabs de inspector y catalogo/ancla.
- `22be80b refactor(app): introduce puerto de overflow toolbar`
  - Nuevo `ToolbarOverflowPort` para `ToolbarMas`.
  - `toolbarMasViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de UI panel/toolbar y smoke `e2e/12-toolbar-overflow.spec.ts`.
- `ed91881 refactor(app): introduce puerto de pantalla inicio`
  - Nuevo `WelcomeScreenPort`; `pantallaInicioViewModel` reutiliza puertos de bootstrap, navegacion, persistencia y workspace.
  - Validado con typecheck, build, `PantallaInicio.test.ts`, `persistencia.test.ts` y smoke `e2e/21-estado-vacio-opm.spec.ts`.
- `e329b31 refactor(app): introduce puerto de editabilidad`
  - Nuevo `EditabilityPort` para `readOnly`.
  - `estadoVacioOpmViewModel` reutiliza `OpdNavigationPort`, `ModelCommandPort`, `ModelBootstrapPort` y `EditabilityPort`.
  - Validado con typecheck, build, unitarios focales de estados y smoke `e2e/21-estado-vacio-opm.spec.ts`.
- `a936dc2 refactor(app): amplia puerto de plantillas`
  - `TemplateDialogsPort` cubre catalogo, guardado e insercion de plantillas.
  - `dialogoPlantillasViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de plantillas/batch y smokes residuales/toolbar.
- `b810701 refactor(app): introduce puerto de historial versiones`
  - Nuevo `VersionHistoryPort` para dialogo de versiones, creacion manual, restauracion, eliminacion y toggle de visibilidad.
  - `dialogoVersionesViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de versiones/persistencia y smoke residual completa.
- `277f1bc refactor(app): introduce puerto de timeline`
  - Nuevo `TimelinePort`; `timelineViewModel` reutiliza `OpdNavigationPort` y `SelectionPort`.
  - Validado con typecheck y build.
- `5dbe3f2 refactor(app): introduce puerto de traer conectados`
  - Nuevo `BringConnectedDialogPort`; el viewmodel reutiliza navegacion OPD y seleccion para conteos.
  - Validado con typecheck, build, `operacionesBatch.test.ts` y smoke `e2e/07-enlaces-avanzados.spec.ts`.
- `5810c17 refactor(app): introduce puertos de busqueda`
  - `SearchDialogsPort` queda como opener; nuevos subpuertos para busqueda intra-modelo y global.
  - `busquedaCosasViewModel` y `busquedaGlobalViewModel` quedan sin dependencia directa al store.
  - Validado con typecheck, build, unitarios de workspace/busqueda y 33 smokes de busqueda/workspace/residual.
- `7d00655 refactor(app): introduce puerto de gestion arbol opd`
  - Nuevo `OpdTreeManagementPort`; `gestionArbolOpdViewModel` queda aislado del puerto ancho del arbol lateral.
  - Validado con typecheck, build, unitarios OPD/arbol y smoke `e2e/04-arbol-y-pestanas.spec.ts`.
- `d312f46 refactor(app): introduce puerto de contexto bugs`
  - Nuevo `BugCaptureContextPort` con helper puro para contexto store+navegador.
  - `capturadorBugsViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitario del shape y smoke `e2e/10-capturador-bugs.spec.ts`.
- `f52b7cf refactor(app): introduce puertos de mapa sistema`
  - Nuevos puertos de datos, viewport y filtros del mapa; `mapaSistemaViewModel` queda sin store directo.
  - Validado con typecheck, build, unitarios de mapa y smokes de arbol/mapa/toolbar.
- `7c54039 refactor(app): introduce puerto de asistente modelo`
  - Nuevo `NewModelAssistantPort`; las mutaciones imperativas del wizard salen del viewmodel.
  - Validado con typecheck, build, unitarios de asistente/estado vacio y smoke `e2e/21-estado-vacio-opm.spec.ts`.
- `881d931 refactor(app): introduce puertos de app shell`
  - Nuevos puertos shell-only para workbench/layout/modos y overlays.
  - `appShellViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios focales y 32 smokes de canvas/arbol/toolbar/mobile.
- `24fc92c refactor(app): introduce puertos de inspector entidad`
  - Nuevos subpuertos para shell, semantica, metadata, estilo, refinamiento y estados del inspector de entidad.
  - `inspectorEntidadViewModel` queda sin dependencia directa a `useOpmStore`; el caso `crearEstadosConNombres` conserva la lectura post-mutacion en el adapter.
  - Validado con typecheck, build, 28 unitarios focales y 62 smokes de canvas/inspector/refinamiento/enlaces.

Estado arquitectonico del ultimo corte:

- `toolbarBaseViewModel` queda sin dependencia directa a `useOpmStore`; se compone por puertos pequenos (`ToolbarChromePort`, `HistoryPort`, `ModelCreationPort`, `SelectionPort`, `WorkbenchViewControlsPort`, `LinkContextActionsPort`, `SelectionBatchActionsPort`, `AutosavePort`, `OpdNavigationPort`, `MapViewPort`).
- `barraHerramientasElementoViewModel` queda sin dependencia directa a `useOpmStore`; se compone por `OpdNavigationPort`, `SelectionPort`, `SelectedElementActionsPort`, `SelectionBatchActionsPort` y `LinkContextActionsPort`.
- `toolbarViewModel` queda sin dependencia directa a `useOpmStore`; consume `AutosavePort` y `MapViewPort`.
- `toolbarCreacionViewModel` queda sin dependencia directa a `useOpmStore`; se compone por `ModelCommandPort`, `ModelCreationPort`, `OpdNavigationPort`, `SelectionPort` e `InteractionModePort`.
- `toolbarMapaSistemaViewModel` queda sin dependencia directa a `useOpmStore`; consume `SystemMapControlsPort`.
- `menuPrincipalViewModel`, `barraPestanasViewModel`, `inspectorViewModel`, `toolbarMasViewModel`, `pantallaInicioViewModel`, `estadoVacioOpmViewModel`, `mensajeFlashViewModel`, `modoRevisionMobileViewModel`, `dialogoConfiguracionViewModel`, `dialogoPlantillasViewModel`, `dialogoVersionesViewModel`, `timelineViewModel`, `dialogoTraerConectadosViewModel`, `busquedaCosasViewModel`, `busquedaGlobalViewModel`, `gestionArbolOpdViewModel`, `capturadorBugsViewModel`, `mapaSistemaViewModel`, `asistenteNuevoModeloViewModel`, `appShellViewModel`, `inspectorEntidadViewModel` y los viewmodels de modales de metadata quedan sin dependencia directa a `useOpmStore`.
- `rg "useOpmStore|from \"../../store\"|from '../../store'" app/src/app/viewmodels -n` no reporta resultados.
- No se introdujo segundo store, estado duplicado ni DI global.

Estado pendiente observado tras `24fc92c`:

- `rg "useOpmStore" app/src/app/viewmodels -l` reporta 0 viewmodels directos.
- Siguiente orden recomendado del plan normativo: entrar a Corte 3 con `JointCanvas`/render y handlers como adapters hacia puertos/eventos, manteniendo proyeccion pura testeable; no iniciar otro refactor UI cosmetico.

Regla operativa nueva: antes de migrar otro viewmodel, preferir reutilizar un puerto existente. Crear un puerto nuevo solo si representa una capacidad nombrable y reusable, no una coleccion accidental de selectors.

### Post-Brief HODOM Denso — Foco De Estados OPM — 2026-05-16

La rama `main` queda preparada para sincronizarse con `origin/main` tras `993e1f9`, que corrige la precisión OPM del foco temporal iniciado en `daa3bc3`:

- `TablaEnlaces` ya no degrada extremos `estado` a la entidad contenedora al construir `idsResaltadosTemporales`; conserva el `estado.id` cuando el enlace apunta a una cápsula.
- La proyección JointJS agrega halo `selection-halo` con `targetKind: "estado"` sobre la cápsula interna visible, usando geometría compartida `rectCapsulaEstado`.
- Si el estado no está visible por plegado parcial o supresión, el foco degrada al objeto contenedor para evitar selecciones invisibles.
- Los halos de entidad existentes quedan estables: metadata previa sin `targetKind` para no romper consumidores actuales.
- E2E nuevo cubre el flujo real: filtro en tabla sobre enlace `s-pendiente -> Aprobar`, botón `Resaltar filtrados`, enlace resaltado, halo en `s-pendiente`, sin halo falso en `o-pedido`.

Validación del corte:

```bash
cd app && bun run typecheck
cd app && bun test src/render/jointjs/proyeccion.test.ts src/render/jointjs/composers/halos.test.ts
# 59 pass / 0 fail
cd app && bun run browser:smoke -- e2e/11-beta1-tabla-enlaces.spec.ts
# 6 passed
cd app && bun run lint
cd app && bun run test
# 1373 pass / 0 fail
cd app && bun run build
cd app && bun run browser:smoke
# 193 passed / 0 fail
```

### Post-Brief HODOM Denso — 2026-05-16

La rama `main` queda preparada para sincronizarse con `origin/main` tras `daa3bc3`, que conecta `TablaEnlaces` con foco visual en el canvas:

- Búsqueda textual por origen, destino, etiqueta, tipo, familia y OPD.
- Filtro por familia `Procedurales` / `Estructurales` / `Todos`.
- Contador accesible `filtrados/total` con desglose procedurales/estructurales y visibles en el OPD activo.
- Botón de limpieza de filtros.
- Botón `Resaltar filtrados` que no cierra la tabla, cambia al primer OPD relevante si el filtro no tiene enlaces visibles en el OPD actual y resalta enlaces + extremos como subgrafo temporal.
- `idsResaltadosTemporales` vuelve a participar en la proyección JointJS, sin contaminar la selección real del store.
- Smokes específicos sobre modelo mixto de 10 enlaces para cubrir búsqueda + familia + foco visual sin romper edición, eliminación ni navegación existente.

Prueba directa con HODOM v1.1 real:

```bash
# Cargado por browser contra http://127.0.0.1:5173/
# Contador inicial: 113 de 113 enlaces · 83 procedurales · 30 estructurales · 21 visibles en SD-0 — Establecimiento HODOM
# Búsqueda "Paciente": 19 enlaces resaltados · 7 visibles en SD-0 — Establecimiento HODOM
# Foco canvas: 5 enlaces con wrapper resaltado + 4 halos de extremos
# pageErrors: []
```

Validación del corte:

```bash
cd app && bun run typecheck
cd app && bun run browser:smoke -- e2e/11-beta1-tabla-enlaces.spec.ts
# 5 passed
cd app && bun run lint
cd app && bun run test
# 1371 pass / 0 fail
cd app && bun run build
cd app && bun run browser:smoke
# 192 passed / 0 fail
cd app && node scripts/in-vivo-test.mjs http://127.0.0.1:5173/
# OK=57 FAIL=0 WARN=0 INFO=2
```

### UX/IFML Ronda 22 — 2026-05-16

La rama `main` quedó sincronizada con `origin/main` tras el commit `08b3753`, que reemplaza la sonda in-vivo obsoleta por una auditoría alineada a la UI actual:

- Carga/bienvenida y mini-glosa OPM.
- Chrome IFML desktop: `ViewPoint` default, clusters `Modelar`/`Conectar`/`Ayuda`, menú principal y `CommandPalette`.
- Catalogo de ejemplos reseteado a OPCloud sandbox: `System Diagram`, `SD Sync`, `SD Async`, `OnStar System`, `OPM Structure Meta Model`, `Modelo Vacio`. `OnStar System` es tambien el unico ejemplo del libro curado conservado por respaldo formativo.
- Overlay feedback: `BarraHerramientasElemento`, `ErrorBadge`, `HoverTooltip`, `FlashToast`.
- Conexión por `MenuTipoEnlace` y submodo accesible `conectando`.
- Import JSON multi-OPD y navegación del árbol.
- Mobile review 390x844: tabs `Canvas`/`OPDs`/`OPL`/`Issues`, sin overflow horizontal.

Resultado de la última auditoría:

```bash
cd app
node scripts/in-vivo-test.mjs http://127.0.0.1:5173/
# OK=57 FAIL=0 WARN=0 INFO=2
# pageerror=0 console.error=0 console.warn=0 requestfailed=0
```

El script genera `docs/REPORTE-EJECUTIVO.md` y `app/test-results/in-vivo/`, ambos ignorados por git según `.gitignore`.

## Validación Reciente

Ejecutado sobre el estado actual (`e407292`):

```bash
cd app && bun run check
cd app && bun run build
cd app && bun run browser:smoke -- e2e/02-canvas-y-render.spec.ts e2e/11-beta1-tabla-enlaces.spec.ts
```

Resultado:

```text
typecheck OK via check
1379 unit tests passed / 0 fail
build OK
23 browser smoke passed / 0 fail
```

Última auditoría in-vivo completa sigue siendo la de `08b3753`/`63dd213`; este corte no cambió el script in-vivo ni la semantica OPM, solo la frontera JointJS/app/render.

Validación HODOM v1.1 realizada sobre el corte funcional previo de foco canvas:

```bash
cd app
bun -e 'import { readFileSync } from "node:fs"; import { hidratarModelo } from "./src/serializacion/json"; import { proyectarModeloAJointCells } from "./src/render/jointjs/proyeccion"; const raw = readFileSync("/home/felix/projects/hd-hsc-os/docs/models/opm-hodom-bundle-v1.1.json", "utf8"); const hidratado = hidratarModelo(raw); if (!hidratado.ok) throw new Error(hidratado.error); const modelo = hidratado.value; const proyecciones = Object.keys(modelo.opds).map((opdId) => ({ opdId, cells: proyectarModeloAJointCells(modelo, opdId, null, null).length })); console.log(JSON.stringify({ entidades: Object.keys(modelo.entidades).length, enlaces: Object.keys(modelo.enlaces).length, opds: Object.keys(modelo.opds).length, proyecciones }, null, 2));'
# entidades=46 enlaces=113 opds=5
# opd-sd0=43 cells, opd-sd1=97, opd-sd1-2=38, opd-eq-salud-hd=19, opd-cap-op-hd=15
```

## Commits Relevantes Del Cierre UX/IFML

- `993e1f9 feat(ux): enfoca extremos de estado filtrados`
- `63dd213 docs: registra foco hodom en canvas`
- `96d5097 feat(ux): filtra tabla de enlaces densa`
- `daa3bc3 feat(ux): enfoca enlaces filtrados en canvas`
- `08b3753 test(ux): actualiza auditoria in vivo`
- `de67395 refactor(a11y): unifica fuente de avisos`
- `84a96f2 test(a11y): cubre ciclo de feedback`
- `5ac1319 fix(a11y): ajusta contraste de warning`
- `d9b85c1 fix(a11y): respeta reduced motion`
- `38762ea fix(a11y): describe hover tooltip al foco`
- `15d9077 fix(a11y): anuncia cambios de viewpoint`
- `f5486db fix(a11y): navega tabs del inspector con flechas`
- `f10ce76 refactor(ifml): tipa eventos de acciones contextuales`
- `76b1911 feat(a11y): permite conectar por teclado`
- `d7c2c1d feat(ux): guia conexion por anchors`
- `97abbb8 feat(ifml): declara contexto canonico del workbench`
- `976ef1d refactor(ux): ordena menu principal por intencion`

## Workspace No Consolidado

Hay artefactos no trackeados en `docs/audits/`, `docs/bugs/` y `docs/instrucciones-lineas-dev/ronda22/`. Son insumos/artefactos de trabajo previos; no promoverlos sin una decisión explícita de alcance.

También pueden existir salidas regenerables ignoradas:

- `docs/REPORTE-EJECUTIVO.md`
- `app/test-results/in-vivo/`
- `app/dist/`

## Pendientes Post-Corte 10

El brief UX/IFML y la refactorizacion total 0-10 quedan cerrados para los cortes
auditados. Los cortes de modelos densos ya mejoraron `TablaEnlaces`, conectaron
sus filtros con foco visual en canvas y corrigieron el foco de extremos
`estado`; los cortes 8-10 cerraron consistencia, cascadas y proceso.

Pendiente arquitectonico recomendado:

- Abrir un plan normativo nuevo y acotado si se decide atacar deuda residual de frontera render/UI, comandos globales o puertos aun tipados desde `OpmStore`.
- No llamar a ese trabajo "continuacion automatica" de Corte 10: debe declarar alcance, no objetivos y gates propios.
- Mantener `OpmStore` como fachada compatible mientras los puertos restantes se vuelven contratos explicitos.
- Seguir usando `bun run check`, `bun run lint`, `bun run build`, `bun run browser:smoke`, `progress-dashboard --sync-real` y `quality-ledger` como cierre de loop para cortes de refactor.

Pendientes funcionales a retomar despues o como pressure tests:

- **Mini-mapa / mapa del sistema más operativo**: navegación visual para modelos densos.
- **Import/export OPX real**: interoperabilidad más allá del JSON local.
- **Modelos densos HODOM**: profundizar filtros de canvas, mini-mapa y performance perceptual con 5 OPDs y 113 enlaces.
- **Enlaces OPCloud avanzados**: forked tagged links, smoke UI específico para tagged/bidirectional + exception/time.
- **Comentarios/notas**: EPICA-42 sigue fuera del modo mobile review productivo; hoy se comunica como no disponible.

## Prompt De Continuación

Retomar desde este `docs/HANDOFF.md` y el plan `docs/roadmap/refactorizacion-total-plan-normativo.md`.

Siguiente bloque recomendado: decidir si se abre un plan nuevo para deuda residual de frontera, empezando por uno de tres frentes: render/UI, comandos globales fuera de `App`, o puertos restantes que todavia dependen tipadamente de `OpmStore`.
