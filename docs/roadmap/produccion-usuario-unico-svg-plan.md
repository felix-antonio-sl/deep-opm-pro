# Plan Normativo Primera Produccion Single-User + SVG

**Fecha:** 2026-05-18  
**Repo:** `deep-opm-pro`  
**Alcance:** habilitar una primera version usable en produccion privada para un unico usuario local, con export SVG del OPD activo.  
**Estado:** Corte 0, Corte 1, Corte 2, Corte 3, Corte 4 y Corte 5 cerrados.
**Autoridad superior:** `AGENTS.md`, `docs/HANDOFF.md`, `docs/JOYAS.md`, `opm-extracted/`, SSOT OPM local y HU vivas.

## 1. Objetivo

Habilitar una primera version de produccion para el operador actual como usuario unico, sin backend, sin autenticacion externa y sin colaboracion multiusuario.

El entregable es una SPA estatica construible con Vite/Bun, operable en navegador moderno, con persistencia local existente y con export SVG del OPD activo como salida minima para compartir o archivar trabajo.

## 2. Lenguaje Normativo

- **DEBE** indica regla obligatoria.
- **NO DEBE** indica prohibicion.
- **PUEDE** indica opcion permitida.
- **DEBERIA** indica preferencia fuerte salvo evidencia contraria.
- **Corte** indica unidad atomica validable, reversible y commiteable.
- **Produccion single-user** indica uso privado por una sola persona en un navegador controlado, sin guarantees multi-tenant.

## 3. Alcance

El plan cubre:

- build estatico de produccion;
- seguridad minima de despliegue privado single-user;
- persistencia local como almacenamiento primario;
- export SVG del OPD activo;
- import/export JSON existente como respaldo manual;
- gates de calidad y smoke browser sobre flujos criticos;
- documentacion operativa minima para ejecutar y recuperar datos.

## 4. No Objetivos

Este plan NO DEBE:

1. Implementar autenticacion, cuentas, OAuth, Firebase, Firestore ni backend.
2. Resolver colaboracion, multiusuario, sharing remoto ni permisos.
3. Implementar export PDF completo.
4. Implementar ZIP de todos los OPDs.
5. Introducir JointJS+ ni plugins comerciales para export.
6. Cambiar semantica OPM, OPL, formato JSON ni assets canonicos.
7. Convertirse en continuacion automatica del plan de refactorizacion total.
8. Versionar `app/dist/`, screenshots, reportes o artefactos regenerables.
9. Tocar `decompiled/`, `_local/` ni directorios untracked existentes.

## 5. Supuestos Productivos

- El usuario unico es el operador actual.
- El entorno productivo inicial es privado: `localhost`, red local controlada o hosting estatico protegido fuera de la app.
- La identidad no vive dentro de la aplicacion en esta version.
- La persistencia productiva inicial es localStorage/workspace local existente; el respaldo portable es JSON exportado.
- El export SVG debe funcionar 100% en cliente.
- JointJS OSS renderiza el paper como SVG; el plugin oficial `format.toSVG` pertenece a JointJS+ segun la documentacion oficial, por lo que esta version DEBE serializar el SVG del `paper` real sin depender de JointJS+.

## 6. Criterios De Aceptacion Global

La version se considera primera produccion single-user cuando:

1. `bun run build` produce una SPA estatica sin warnings criticos.
2. `bun run gate:refactor` pasa completo.
3. El operador puede crear o cargar un modelo, editarlo, guardar localmente, cerrar/abrir navegador y recuperar el estado.
4. El operador puede exportar JSON como respaldo manual.
5. El operador puede exportar el OPD activo como `.svg` desde la vista normal de modelado.
6. El export SVG no incluye toolbar, inspector, OPL ni chrome de aplicacion.
7. La app no depende de secrets ni de servicios remotos para operar en este modo.
8. La documentacion indica claramente limites, backup y comando de build/preview.

## 7. Cortes Operativos

### Corte 0 - Plan Y Baseline

Objetivo:

Fijar este contrato operativo y registrar en handoff el nuevo foco productivo.

Alcance:

- Crear este plan.
- Registrar el plan como roadmap activo en `docs/HANDOFF.md`.
- No modificar codigo.

Gate:

```bash
git status --short --branch
```

Estado:

- Cerrado el 2026-05-18 en `025d245 docs(produccion): define plan single-user svg`.

### Corte 1 - Export SVG Del OPD Activo

Objetivo:

Exponer una accion directa y visible para descargar el OPD activo como SVG desde la vista normal del canvas.

Alcance:

- Reusar el `dia.Paper` vivo expuesto por `CanvasAdapterContext`.
- Serializar el SVG del paper real en cliente.
- Descargar un archivo `.svg` con nombre derivado del OPD/modelo.
- Mantener export del mapa de sistema existente.
- Agregar prueba unitaria de nombre/serializacion y smoke Playwright de descarga.

Reglas:

- NO DEBE usar JointJS+ ni asumir `paper.toSVG` como API OSS.
- NO DEBE exportar chrome UI: toolbar, inspector, menu, OPL, overlays HTML.
- NO DEBE cambiar la proyeccion JointJS ni el modelo.

Gates:

```bash
cd app && bun test src/render/jointjs/mapaExport.test.ts
cd app && bunx playwright test e2e/04-arbol-y-pestanas.spec.ts e2e/02-canvas-y-render.spec.ts --grep "Exportar OPD actual como SVG|renderiza todos los markers"
cd app && bun run gate:refactor
```

Estado:

- Cerrado el 2026-05-18 en `5efff99 feat(export): permite svg del opd activo`.

Resultado:

- El menu principal de la vista normal expone `Exportar OPD actual como SVG`.
- La accion usa el `dia.Paper` vivo desde `CanvasAdapterContext`; no usa globals
  ni plugin JointJS+.
- `mapaExport` prioriza la serializacion del SVG DOM del paper OSS y conserva
  el fallback historico para el mapa del sistema.
- El nombre de archivo se deriva de modelo + OPD + fecha.
- El smoke descarga el SVG y verifica contenido OPM basico sin chrome de
  aplicacion.

Validacion ejecutada:

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

### Corte 2 - Operacion Estatica Y Preview Productivo

Objetivo:

Hacer verificable que la app opera como build estatico y que los affordances no-productivos no rompen la experiencia.

Alcance:

- Documentar `bun run build` y `bun run preview`.
- Agregar smoke focal contra `vite preview` si falta cobertura.
- Revisar `CapturadorBugs`: en produccion estatica DEBE degradar sin romper el flujo o quedar claramente fuera del build productivo.
- Confirmar que no hay dependencia runtime de middleware Vite para el flujo principal.

Gate:

```bash
cd app && bun run build
cd app && bun run preview
```

Estado:

- Cerrado el 2026-05-18 en `1df6f8a test(produccion): valida preview estatico`.

Resultado:

- `app/package.json` agrega `browser:preview` para ejecutar un smoke focal
  contra el build servido por `vite preview`.
- `app/playwright.preview.config.ts` construye `dist` y sirve la SPA por
  `127.0.0.1:4173` con `bun run preview`.
- `playwright.config.ts` excluye `*.preview.spec.ts` del smoke normal para no
  duplicar el gate completo.
- `25-produccion-preview.preview.spec.ts` verifica que la SPA productiva carga,
  importa modelo, renderiza canvas JointJS, exporta SVG sin chrome y no expone
  el capturador de bugs en produccion sin opt-in.
- `CapturadorBugs` queda disponible por defecto solo en dev; en build
  productivo requiere `VITE_ENABLE_BUG_CAPTURE=true`.
- Si el capturador queda habilitado contra un hosting sin middleware, degrada
  con mensaje explicito cuando el endpoint responde HTML/404/405/501 sin JSON.

Validacion ejecutada:

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

### Corte 3 - Persistencia Local Y Backup Operable

Objetivo:

Cerrar el riesgo principal single-user: perder datos locales o no saber respaldarlos.

Alcance:

- Verificar guardado/carga local, autosalvado, dirty guard y JSON export/import.
- Documentar procedimiento de backup manual JSON.
- Agregar o focalizar smoke si el flujo no esta cubierto por el gate actual.

Gate:

```bash
cd app && bunx playwright test e2e/06-undo-redo-dirty.spec.ts e2e/11-beta1-catalogo-ancla.spec.ts e2e/25-produccion-backup.spec.ts
```

Estado:

- Cerrado el 2026-05-18 en `acdeb32 feat(produccion): agrega backup json descargable`.

Resultado:

- `PersistenciaJson` agrega `Descargar JSON`, que descarga el modelo activo en
  un archivo `.json` con nombre derivado del modelo y la fecha.
- `25-produccion-backup.spec.ts` cubre backup portable: descarga JSON, crea un
  modelo nuevo, reimporta el archivo descargado y compara conteos del modelo.
- La persistencia local, dirty guard, round-trip JSON y autosalvado quedan
  cubiertos por tests focales existentes y por el gate completo.

#### Procedimiento Minimo De Backup Manual JSON

Procedimiento autoritativo: `docs/uso-productivo.md` §Respaldo Manual.
El detalle paso a paso (cuando, como descargar, como restaurar,
limitaciones) vive ahi como SSOT del usuario operador. Esta seccion
queda como puntero para no duplicar.

Validacion ejecutada:

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

### Corte 4 - Documentacion De Uso Productivo Privado

Objetivo:

Dejar instrucciones autosuficientes para correr, actualizar, respaldar y
recuperar datos, separando el angulo del usuario operador del modelador del
angulo del administrador de la instancia.

Alcance:

- Crear/actualizar documento operativo bajo `docs/` desde el angulo del
  usuario operador del modelador.
- Incluir limites: sin auth de aplicacion, sin sync remoto, sin
  multiusuario, sin SLA.
- Incluir pasos de uso diario, backup JSON, export SVG, recetas por
  sintoma y atajos.
- Mantener doc separada del admin (deploy, certificado, rollback de
  contenedor) sin mezclarla con la del usuario.

Gate:

```bash
cd app && bun run build
```

Estado:

- Lado deploy cerrado el 2026-05-18 en commits del deploy opforja
  (`781a496`, `5f75b75`, `597859c`).
- Lado usuario operador cerrado el 2026-05-19 con `docs/uso-productivo.md`
  y refactor de `docs/deploy/opforja.md` + `README.md` para separar
  responsabilidades.

Resultado lado deploy (admin):

- `Dockerfile` compila la app Vite con Bun y sirve `app/dist` con Nginx en
  puerto interno `8080`.
- `docker-compose.yml` replica el patron `hdos-app`: servicio conectado a red
  Docker externa `web`, labels Traefik, TLS con `myresolver` y restart policy
  `unless-stopped`.
- A diferencia de `hdos-app`, el router `opforja` usa `opforja-auth@docker`
  porque esta app todavia no tiene auth interna.
- El usuario operativo Basic Auth es `fsanhuezal`; la contrasena no se versiona
  en claro y solo queda representada como hash APR1 en `docker-compose.yml`.
- `docs/deploy/opforja.md` deja comandos de deploy, verificacion, rollback y
  nota explicita de que los datos del usuario viven en su navegador, no en la
  infraestructura.

Resultado lado usuario (operador del modelador):

- `docs/uso-productivo.md` es el unico doc del usuario operador. Incluye:
  resumen, entrar, crear primer modelo, tres operaciones diarias
  (`Ctrl+S` con chip de persistencia como senal, `Ctrl+F`, `Ctrl+K`),
  respaldo manual como primary (cuando, como descargar, como restaurar),
  export SVG del OPD activo, recetas por sintoma observable (chip dice
  `Sin guardar`; cerre sin guardar; navegador borro datos; app no carga),
  atajos utiles y limites honestos.
- `README.md` §Producción Privada se reduce a dos punteros: uno al doc del
  usuario, otro al doc del admin. Elimina la duplicacion previa de cinco
  bullets.
- El procedimiento minimo de backup manual JSON deja de duplicarse: el
  apartado §Corte 3 abajo apunta al §Respaldo Manual de
  `docs/uso-productivo.md`.

Validacion ejecutada:

```bash
cd app && bun run build
# OK

docker compose config
# OK

docker compose up -d --build
# opforja started

docker exec opforja wget -qO- http://127.0.0.1:8080/healthz
# ok

curl -I https://opforja.sanixai.com
# HTTP/2 401; WWW-Authenticate: Basic realm="traefik"

curl -sS -o /tmp/opforja-auth-ok.html -w '%{http_code} %{content_type} %{size_download}\n' -u 'fsanhuezal:<secreto-local>' https://opforja.sanixai.com/
# 200 text/html 1373

curl -sS -o /tmp/opforja-auth-bad.txt -w '%{http_code} %{content_type} %{size_download}\n' -u 'fsanhuezal:wrong' https://opforja.sanixai.com/
# 401 text/plain 17
```

### Corte 5 - Gate Final De Release Local

Objetivo:

Cerrar el baseline de primera produccion single-user.

Alcance:

- Ejecutar `gate:refactor`.
- Ejecutar smoke focal de export SVG y persistencia.
- Actualizar `docs/HANDOFF.md` y `docs/roadmap/quality-ledger.md`.
- Commit atomico de cierre y push controlado.

Gate:

```bash
cd app && bun run gate:refactor
```

Estado:

- Cerrado el 2026-05-20 con el baseline final de primera produccion
  single-user.

Resultado:

- `gate:refactor` pasa completo: typecheck, 1481 unitarios, lint, build,
  209 smokes browser, dashboard HU sincronizado y `quality:gate` verde.
- El smoke productivo `browser:preview` pasa sobre `vite preview`: la SPA
  estatica carga, exporta SVG y mantiene bug capture fuera del build sin
  opt-in.
- El auditor HU quedo alineado con la refactorizacion vigente de enlaces:
  las reglas de abanico automatico, enlace desde fila plegada y Mover Puerto
  apuntan a `transaccionEnlace`, `acciones-enlace` e `InspectorEnlace`.
- `quality-ledger` y `HANDOFF` registran el baseline final.
- `opforja.sanixai.com` queda redeployado con contenedor healthy, Basic Auth
  externo y health checks internos OK.

Validacion ejecutada:

```bash
cd app && bun run gate:refactor
# typecheck OK; 1481 pass / 0 fail / 5527 expect; lint OK; build OK
# browser:smoke 209 passed
# Dashboard HU: Total 27.4%; MVP-alpha 104/121 + 1 parcial (86.2%); 89/105 reglas auto
# quality:gate PASS; leyes canonicas 6/6; compat detectors 0

cd app && bun run browser:preview
# 1 passed

docker compose up -d --build
docker compose ps
docker exec opforja wget -qO- http://127.0.0.1:8080/healthz
docker exec opforja wget -qO- http://bug-capture:3000/healthz
# opforja healthy; healthz ok; bug-capture {"ok":true}
```

## 8. Riesgos Y Decisiones

- **Riesgo:** localStorage no es backup confiable.  
  **Decision:** para v0 single-user se acepta si JSON export queda documentado como respaldo manual obligatorio.

- **Riesgo:** SVG serializado desde DOM puede depender de estilos externos.  
  **Decision:** Corte 1 cubre descarga funcional; fidelidad avanzada, metadata XML, OPL comentario y optimizacion quedan fuera de v0 y pertenecen a EPICA-61 completa.

- **Riesgo:** bug capture usa middleware Vite en dev/preview.  
  **Decision:** no es requisito de produccion single-user; si aparece roto en build estatico, se degrada o se oculta.

- **Riesgo:** sin auth no hay proteccion si se publica en internet.  
  **Decision:** `opforja.sanixai.com` queda publicado como deploy privado con
  Basic Auth de Traefik (`opforja-auth@docker`). Si se requiere internet
  abierto, el siguiente plan debe ser auth de aplicacion, no retirar la barrera.

## 9. Criterio De Cierre

Este plan queda cerrado cuando el usuario puede operar la app como herramienta privada real, conservar su trabajo localmente, respaldarlo por JSON y exportar el OPD activo como SVG, con `gate:refactor` verde y limites productivos documentados.
