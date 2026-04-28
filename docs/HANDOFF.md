# HANDOFF — estado, decisiones, pendientes, riesgos

**Fecha**: 2026-04-28
**Sesion**: consolidacion de ingenieria inversa + rebasamiento de 48 epicias HU contra SSOT OPM v3.0.0 + refactorizacion de estructura
**Repositorio**: `deep-opm-pro`
**Repositorio hermano**: `opm-model-app` (historias de usuario en `docs/historias-usuario/`)

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

### Desarrollo de software (opm-model-app)

| Artefacto | Estado | Ubicacion |
|-----------|--------|-----------|
| Metodologia HU revisada | Completa | `docs/historias-usuario/00-METODOLOGIA-HU.md` |
| Diagnostico piloto (5 patrones) | Completo | `docs/historias-usuario/DIAGNOSTICO-PILOTO-EPICA-10.md` |
| EPICA-10 (creacion-cosas) | revision-piloto | piloto manual completo |
| EPICA-11 a EPICA-50 (10 epicas M0) | revision-piloto | rebasadas contra SSOT + evidencia OPCloud |
| EPICA-14 a EPICA-D1 (37 epicas M1-W) | revision-piloto | rebasadas via agentes |
| Total: 48/48 epicas, 1,164 HU | revision-piloto | todas con campos `Tipo:` y referencias SSOT |

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
| Cambio de licencia OPCloud | Baja | Alto | Material observacional es fair use |
| Backend/Firebase se migran | Baja | Bajo | Config extraida obsoleta |
| Deriva entre HU revisadas y SSOT futura | Media | Medio | Referencias [V-xxx] permiten re-verificar puntualmente |

---

## Pendientes priorizados

### Alta prioridad

1. **Obtener acceso autenticado a `opcloud.systems`** (sin cambios)
2. **Iniciar desarrollo del kernel OPM** usando las HU M0 (11 epicias, 275 HU) como backlog, los insumos de `deep-opm-pro/` como evidencia de producto, y `si-partiese-desde-0.md` como guia de lo que NO repetir.

### Media prioridad

3. **Cruzar fixtures con decompilado**: para cada cell JSON en `fixtures/`, encontrar su clase en `decompiled/`.
4. **Extraer templates SVG del decompilado**: markers, filtros, shapes custom.

### Baja prioridad

5. **Actualizar INDICE-HU.md y MATRIZ-HU-REGLAS-SSOT.md** con conteos post-revision (cambiaron prioridades, tipos y referencias SSOT).
6. **Automatizar extraccion del sandbox** con Playwright.

---

## Prompt de continuacion

```
Retomar HANDOFF.md en deep-opm-pro/docs/. Estado: 808 modulos decompilados,
376 clases catalogadas, 7 grupos de fixtures (44 archivos), 84 assets,
Firebase config completa, AGENTS.md con principio rector de 8 niveles.

Historias de usuario en opm-model-app/: 48/48 epicias rebasadas contra
SSOT OPM v3.0.0 + evidencia OPCloud (1,164 HU preservadas, 59K lineas).
Cada HU clasificada como opm-semantica/opcloud-ui/mixto con referencias
SSOT inline [V-xxx]/[Glos 3.x]/[OPL-ES Txxx]/[JOYAS §x].

Meta inmediata: iniciar desarrollo del kernel OPM usando las 275 HU M0
como backlog, los insumos de deep-opm-pro/ como evidencia de producto,
y si-partiese-desde-0.md como guia de lecciones aprendidas. Las HU
opm-semantica definen que construir; las opcloud-ui informan como
OPCloud lo resolvio (divergencia permitida si SSOT lo justifica).

Pendiente critico: acceso autenticado a opcloud.systems (sin cambios).

Continuar con: [describir siguiente paso]
```
