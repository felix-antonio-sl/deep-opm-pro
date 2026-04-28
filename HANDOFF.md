# HANDOFF — estado, decisiones, pendientes, riesgos

**Fecha**: 2026-04-28
**Sesion**: extraccion y analisis profundo de OPCloud (produccion + sandbox)
**Repositorio**: `deep-opm-pro`

---

## Estado actual

### Extraido y consolidado

| Artefacto | Estado | Ubicacion |
|-----------|--------|-----------|
| Bundle produccion (42 MB) | Descargado | `_local/bundles/` (gitignored) |
| Decompilacion (808 modulos, 91 MB) | Completa | `decompiled/` (gitignored) |
| Firebase config | Extraida | `config/firebase.json` |
| 28 rutas Angular | Extraidas | `config/routes.json` |
| 376 clases OPM | Catalogadas | `catalog/classes.txt` |
| 84 assets (73 SVG + 11 PNG) | Descargados | `assets/` |
| 6 modelos ejemplo del sandbox | Extraidos | `sandbox-data/` (18 JSON + 15 PNG + 11 OPL) |
| Procedimiento documentado | Completo | `PROCEDIMIENTO.md` |
| Joyas/hallazgos documentados | Completo | `JOYAS.md` |
| Script de regeneracion | Listo | `setup.sh` |

### NO obtenido

| Artefacto | Bloqueante | Razon |
|-----------|------------|-------|
| Cuenta en produccion | **Si** | `opcloud.systems` no permite self-registration ni SSO |
| Schema Firestore | **Si** | Requiere token de usuario autenticado |
| Formato export de modelos | **Si** | Sandbox es read-only; produccion requiere cuenta |
| Codigo del backend (Express/GAE) | No | No es publico |
| Source maps TypeScript | No | `--source-map=false` en el build |
| Modelos de la galeria de produccion | Parcial | El sandbox tiene 6 modelos demo; produccion podria tener mas |
| HAR de sesion autenticada | **Si** | Sin cuenta no se puede capturar |

---

## Decisiones tomadas

1. **No versionar `decompiled/` ni `_local/`**: material grande (140 MB combinado), propiedad de OPCloud Ltd., regenerable con `setup.sh`.

2. **Versionar `sandbox-data/`**: es material observacional propio, producto de nuestro analisis, sin codigo literal extenso.

3. **Estructura `assets/{svg,png}/`**: consolidar assets visuales bajo un solo directorio.

4. **Documentar hallazgos en `JOYAS.md`** como referencia central de descubrimientos, no dispersos en archivos separados.

5. **No incluir el bundle de sandbox ni su decompilacion**: enfocar el repo exclusivamente en la version comercial (`opcloud.systems`). El sandbox se uso solo como fuente de datos runtime.

6. **Usar `setup.sh` como unico punto de regeneracion**: descarga, decompila y baja assets en un solo comando.

---

## Supuestos

1. El hash del bundle de produccion (`a8737ee2a8ed30eb`) puede cambiar en futuros deploys. `setup.sh` tendria que actualizarse.

2. Las security rules de Firebase (`opcloud-trial`) seguiran bloqueando acceso publico a Firestore/RTDB.

3. El sandbox (`opcloud-sandbox.web.app`) seguira siendo una demo sin auth mientras OPCloud Ltd. lo mantenga.

4. La estructura del bundle webpack (y por tanto la decompilacion) se mantiene similar entre versiones — cambios mayores en Angular/Rappid podrian requerir ajustes en el analisis.

5. Los parametros visuales canonicos (135x60, colores, fuentes) son estables y no cambian entre versiones menores.

---

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigacion |
|--------|-------------|---------|------------|
| OPCloud cambia el hash del bundle | Media | Bajo | `setup.sh` usa variable; facil de actualizar |
| El sandbox desaparece o requiere auth | Baja | Medio | Los datos ya estan extraidos y guardados |
| La decompilacion pierde fidelidad en futuras versiones | Baja | Medio | webcrack es robusto; si falla, alternative: prettier + analisis manual |
| Cambio de licencia/terminos de OPCloud | Baja | Alto | El material observacional/documental es fair use; los bundles no se redistribuyen |
| El backend o Firebase project se migran | Baja | Bajo | La config extraida quedaria obsoleta; requeriria nueva extraccion |

---

## Pendientes priorizados

### Alta prioridad (bloquean analisis mas profundo)

1. **Obtener acceso autenticado a `opcloud.systems`**
   - Contactar a OPCloud Ltd. (`opcloud@technion.ac.il`) solicitando cuenta academica
   - Alternativa: encontrar un usuario existente dispuesto a compartir HAR
   - Si se consigue: capturar HAR completo → schema Firestore → formato export → API endpoints

### Media prioridad (profundizan comprension sin bloquear)

2. **Cruzar modelos del sandbox con el codigo decompilado**
   - Para cada cell del sandbox, encontrar su clase en el bundle
   - Mapear `data-type` → clase JavaScript → herencia

3. **Extraer todos los templates SVG del codigo decompilado**
   - Markers, filtros, shapes custom — buscar todos los string literales SVG

4. **Mapear el data model completo**
   - Relaciones entre `OpmModel` → `OpmOpd` → `OpmThing` → `OpmLink` → `OpmState`
   - Atributos de cada entidad

### Baja prioridad (perfeccionan)

5. **Automatizar la extraccion del sandbox**
   - Script de Playwright que extrae los 6 modelos en un solo run
   - Agregar a `setup.sh` como paso opcional

6. **Generar diagrama de arquitectura**
   - Component tree Angular
   - Data flow: UI → Rappid → Firebase/Backend

---

## Prompt de continuacion

```
Retomar HANDOFF.md en deep-opm-pro/. Estado: 808 modulos decompilados,
376 clases catalogadas, 6 modelos sandbox extraidos, Firebase config
completa, 73 SVGs canonicos. Pendiente critico: acceso autenticado a
opcloud.systems (no se pudo crear cuenta — signUp bloqueado, SSO
denegado). Evaluar vias alternativas: contacto academico a
opcloud@technion.ac.il, busqueda de HAR publicos, o analisis en
profundidad del codigo decompilado sin datos runtime de produccion.

Continuar con: [describir siguiente paso]
```
