# HANDOFF - estado integrado y próximos pasos

**Fecha**: 2026-05-05  
**Repositorio**: `deep-opm-pro`  
**Corte**: MVP-alpha + rondas 1, 2, 3 y 4 consolidadas sobre `main`  
**Código verificado**: `main` @ `3c63c1e` (`feat(modelo): completa plegado parcial anidable`)  
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

La ronda 4 quedó integrada con cinco commits de línea y un commit posterior de
normalización documental/auditoría:

| Línea | Commit | Resultado integrado |
|---|---|---|
| L1 | `92e335e` | Conectores lógicos canónicos O/XOR para abanicos desde `assets/svg/links/logical/`, sin texto visible de marcador. |
| L2 | `cb181ae` | Gesto directo sobre cápsula de estado para crear enlace procedural hacia `ExtremoEnlace.kind = "estado"`. |
| L3 | `dd17d39` | `Enlace.rutaEtiqueta?`, rutas hacia estados, OPL `Por ruta ...`, JSON lossless y etiquetas de ruta en render. |
| L4 | `8d7bd17` | Auto-invocación como `tipo: "invocacion"` proceso->mismo proceso, demora default `1s`, loop JointJS y OPL IV2. |
| L5 | `3c63c1e` | Plegado parcial anidable: filas activas, orden compacto configurable, enlaces desde fila plegada sin extraer. |

Los briefs de ejecución de ronda quedaron en
`docs/instrucciones-lineas-dev/ronda4/` como registro de partición, scopes y
protocolo de conciliación.

## Decisiones Vigentes

- `Modelo.estados` y `Modelo.abanicos` son top-level. La identidad lógica no se
  mezcla con apariencias de OPD.
- Los extremos de enlace usan `ExtremoEnlace = { kind: "entidad" | "estado"; id }`.
  Los extremos a estado son válidos solo para enlaces procedurales.
- `rutaEtiqueta` es metadata opcional de `Enlace`; se normaliza con trim y no se
  serializa cuando queda vacía para cumplir `exactOptionalPropertyTypes`.
- Los abanicos O/XOR agrupan ramas con puerto compartido exacto. Cuando hay rutas,
  OPL lista ramas individuales para no perder destino ni estado.
- La auto-invocación no introduce un nuevo `TipoEnlace`; se representa como
  `invocacion` con origen y destino en el mismo proceso.
- `Apariencia.ordenPartes?` permite alternar orden `alfabetico`/`creacion` en
  plegado parcial sin romper modelos legacy.
- Las filas de plegado parcial son targets de interacción estables: seleccionan
  parte, exponen nesting y pueden participar en creación de enlaces sin extraer.

## Cascadas Gestionadas

- **Render JointJS**: `proyeccion.ts` sigue como punto de composición, pero la
  lógica nueva vive en helpers (`abanicoOverlay.ts`, `estadoTargets.ts`,
  `rutaLabels.ts`, `autoinvocacionLoop.ts`, `plegadoNesting.ts`).
- **JSON estricto**: campos nuevos opcionales (`rutaEtiqueta`, `ordenPartes`) se
  hidratan con defaults seguros, validan tipo y preservan documentos legacy.
- **OPL**: se integran TS3/TS4/TS5 para estados, `Por ruta ...` para ramas
  etiquetadas y auto-invocación con demora.
- **Gestos UI**: `jointSelector` usa `closest("[joint-selector]")` para capturar
  clicks sobre `tspan`; esto estabiliza cápsulas de estado y filas plegadas.
- **Auditoría HU**: `progress-dashboard.mjs` fue normalizado para reconocer los
  helpers nuevos de ronda 4. El ledger ya no mantiene brechas obsoletas de
  HU-13.014, HU-15.010/011 ni HU-15.020.

## Verificación

Último loop verde de consolidación:

```bash
cd app
bun run check          # typecheck + 250 unit tests, 1390 expect()
bun run browser:smoke  # 28 Playwright smoke passed
bun run build          # OK; warning esperado de chunk Vite > 500 kB
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Estado HU tras sincronizar evidencia real:

| Segmento | Cubiertas | Parciales | Pendientes | Diferidas | Avance |
|---|---:|---:|---:|---:|---:|
| Total backlog | 87 | 52 | 609 | 378 | 10.6% |
| M0 | 54 | 30 | 46 | 0 | 54.1% |
| MVP-alpha | 28 | 24 | 69 | 0 | 29.8% |
| MVP-beta | 46 | 23 | 124 | 0 | 32.4% |

Diagnóstico vigente: 1 advertencia de inventario por ID duplicado `HU-13.005`
entre `epica-13-canvas-estados.md` y `HU-SHARED-001-menu-contextual.md`. No es
fallo de app ni de consolidación.

## Estado Por Dominio

- **Modelo/kernel**: creación básica, firmas de enlace, estados, abanicos,
  multiplicidad, modificadores, invocación, rutas, auto-invocación,
  descomposición, despliegue de objetos y plegado parcial avanzado están
  cubiertos por tests unitarios.
- **Render**: assets canónicos de enlaces procedimentales, estructurales y
  lógicos se proyectan desde `assets/svg/links/`. Los overlays nuevos evitan
  texto visible de marcador.
- **UI/store**: Inspector y canvas cubren creación/edición de estados, rutas,
  auto-invocación, orden de partes plegadas, extracción/reinserción y enlaces
  desde filas plegadas.
- **Persistencia**: JSON conserva estados, extremos, multiplicidad,
  modificadores, rutas, plegado, apariencias extraídas y orden de partes.
- **Auditoría**: `docs/roadmap/hu-progress.{md,html,json}` y
  `hu-progress-evidence.json` fueron regenerados con `--sync-real`.

## Pendientes Inmediatos

- EPICA-50: OPL inversa sigue pendiente: numeración, resaltado cruzado,
  filtrado por selección y edición OPL->canvas.
- EPICA-30/34: flujo de persistencia tipo workspace aún es M0 abierto
  (hamburguesa, guardar como, diálogo de carga, modelo nuevo vacío formal).
- EPICA-20: eliminación segura de OPDs hoja/internos todavía pendiente.
- EPICA-11: bus vertical único de agregación y renombrado de etiqueta de enlace
  siguen abiertos.
- EPICA-1C: creación directa de cosa interna correcta dentro de contenedor sigue
  pendiente.
- EPICA-14: estilado visual editable de cosas/enlaces sigue en 0% de avance.
- Deuda técnica: `app/src/modelo/operaciones.ts` continúa grande; cualquier
  nueva capacidad debe preferir módulos de dominio y wrappers mínimos.
- Deuda de build: Vite advierte por chunk JS grande (~794 kB minificado);
  posponer code splitting hasta que el corte funcional lo justifique.

## Cómo Continuar

1. Leer este `docs/HANDOFF.md` y `docs/roadmap/hu-progress.md`.
2. Elegir pendientes desde M0/MVP-alpha o abrir una nueva ronda paralela desde
   el tablero vigente.
3. Antes de diseñar, consultar `opm-extracted/`, `assets/svg/`, `docs/JOYAS.md`
   y la SSOT OPM.
4. Cerrar cada cambio con `bun run check`; si toca UI/render, sumar
   `bun run browser:smoke`; si toca proyección o bundle, sumar `bun run build`.
5. Regenerar auditoría con
   `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`
   antes de publicar un cierre de ronda.
