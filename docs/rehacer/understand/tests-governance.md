# Dossier: verificación y gobernanza de opforja

**Área:** `app/src/leyes` (38 archivos, 5.845 líneas), `app/e2e` (76 archivos, 16.037
líneas), `app/scripts` (29 archivos, 7.278 líneas), `playwright*.config.ts`,
`eslint.config.js`, `tsconfig.json`, `bunfig.toml` y los gates de `app/package.json`.
**Método:** leí el código de cada ley y cada script de gobernanza, recorrí los nombres de
todas las pruebas E2E y leí en detalle unas quince especificaciones representativas.
Además ejecuté `bun test src/leyes`, `bun test scripts`, `bun test src` completo y la
suite Playwright completa (lane `chromium`), usando un Chromium local compatible y
servidores Vite levantados a mano (ver §2). No modifiqué nada del repositorio.

---

## 0. Resumen ejecutivo

1. **`src/leyes` concentra el mayor valor verificable del repositorio.** Unas dos
   terceras partes (≈3.900 de 5.845 líneas) son propiedades ejecutables sobre la semántica
   OPM y la simetría OPD↔OPL: roundtrip JSON, OPL reverse sin borrado por ausencia,
   distribución de enlaces de frontera al descomponer, orden de in-zoom bimodal,
   supresión de estados por aparición, ramas XOR en simulación, linealidad en
   composición, contención geométrica del in-zoom, etc. Casi todas son puras, rápidas
   (293 tests en ~1,1 s) y traen **controles de no tautología** explícitos, un rasgo de
   calidad poco común. Conviene portarlas casi tal cual, reescritas contra el nuevo
   kernel.
2. **Existe una capa de gobernanza autorreferente que conviene cortar.** Son tests que
   verifican documentos (`corpus-documental`, `manual-limites`), versiones declaradas
   en Markdown (`design-governance-audit`), conteos de identificadores `law-*` en los
   tests (`quality-ledger`), la paridad de una *skill* instalada en `~/.claude/skills`
   (`cordon-skill-audit`) o el estado de producción, KORA y Git (`cordon-estado`).
   Ninguno protege el modelado. Hay incluso una fila de
   `docs/roadmap/registro-conformidad-ssot.md` que existe **solo** para que
   `manual-limites.test.ts` tenga un control de no tautología: el documento se mantiene
   para satisfacer al test, y el test para vigilar al documento.
3. **Las E2E (337 tests en 69 archivos, más 4 amarras externas) tienen valor real, pero
   están muy acopladas.** Dependen de textos de UI, de `data-testid`, de valores CSS
   (`rgb(238, 236, 226)`), de conteos exactos de botones (`"●Sin guardar ⌃S"`), de
   módulos internos importados con `import("/src/store.ts")` (16 archivos) y de
   *tickets* históricos (192 menciones a `HU-`, `BUG-`, `ronda`, `L1..L6`, `Codex`).
   Hay 16 «tests lápida» que verifican que una función retirada **no** aparezca. Sin
   tipado: `tsconfig` no incluye `e2e/`, y al tiparlas con la configuración estricta
   aparecen 127 errores.
4. **Hallazgo de ejecución: los 14 fallos de `bun test src` no se deben a PostgreSQL.**
   Son fallos que dependen del orden de ejecución: `src/persistencia/backend.test.ts`
   deja estado mutable a nivel de módulo en `src/persistencia/backend.ts:29-35`
   (`observedSessionIdentity`, `documentLocalIdentity`, `sessionBoundaryVersion`), y
   ese estado contamina `src/store/modelo/*`. `acciones-anclaje.test.ts`,
   `acciones-piezas.test.ts` y `composicion-ux.test.ts` pasan en aislamiento, y
   `bun test src/store` da 389/389. El fallo se reproduce con
   `bun test src/persistencia/backend.test.ts src/store/modelo` (14 fallos).
5. **Hallazgo de ejecución: la suite E2E no arranca en un entorno limpio.**
   `bun run dev` ejecuta primero `tutor:corpus`
   (`scripts/generar-corpus-tutor.ts:52-59`), que lee el corpus KORA desde
   `kora_raiz_default` (`/home/felix/kora-knowledge`, en
   `docs/canon-opm/resolutor-urn.json`). Sin esa carpeta, los tres `webServer` de
   Playwright fallan. Además, `@playwright/test` 1.59 exige el Chromium 1217 y el entorno
   solo trae el 1194. La verificación de navegador depende así de una ruta absoluta de la
   máquina del autor, lo que contradice el propio AGENTS.md («no hardcodees rutas»).
   Sorteando ambos problemas (Vite manual y Chromium local), la suite dio **307/337**.
   Los 24 fallos estables son de infraestructura de test y ninguno es semántico: 15
   provienen de una carrera de arranque en el helper de la paleta `Ctrl+K`, 3 del menú
   contextual, 3 del corpus del tutor ausente y 1 de una tolerancia geométrica (§6.6).
6. **Recomendación central para la reescritura:** una pirámide de tres niveles:
   (a) propiedades del kernel, portadas desde `leyes/` y consolidadas;
   (b) pocas pruebas de integración store/OPL sin DOM;
   (c) unas 25-40 E2E de flujo, dirigidas por roles accesibles y por el JSON
   exportado, sin CSS, textos de *ticket* ni *imports* internos. Todo lo que verifica
   documentos, versiones, ledgers o skills sale del `test` del producto.

---

## 1. Inventario cuantitativo

| Superficie | Archivos | Líneas | Tests | Estado observado |
|---|---:|---:|---:|---|
| `src/leyes/*.test.ts` | 38 (+ `_fixtures/`) | 5.845 | 293 | 293/293 verde, 1,13 s |
| `scripts/*.test.{ts,mjs}` | 6 | ~452 | 30 | 30/30 verde, 3,8 s |
| `bun test src` (contexto) | 410 | ~70.000 | 3.682 | 3.666 pass / **14 fail por orden** |
| `e2e/*.spec.ts` (config base) | 69 | 16.037 (con helpers) | 337 | ver §6.6 |
| `e2e/amarra-*.preview.spec.ts` (external) | 3 | 683 | 4 | requieren bundles externos |
| `scripts/*` no-test | 23 | ~6.800 | — | 5 sin gate ni consumidor de CI |

Distribución de `src/leyes` por familia (líneas):

| Familia | Archivos | Líneas | Naturaleza |
|---|---|---:|---|
| Semántica OPM y bimodalidad | proyecciones, opl-reverse, refinamiento-cascadas, refinamiento-frontera, invocacion-implicita-bimodal, supresion-estados-aparicion, hechos-pegado, contencion-refinamiento | 1.837 | **núcleo** |
| Simulación | simulacion-unfold, simulacion-modos, simulacion-ramas, tiempo-enriquecimiento, enriquecimiento-cost | 633 | importante/marginal |
| Capa «categorial» (composición, equivalencia, razonamiento, integración S↔F) | composicion, equivalencia, razonamiento, integracion-ss-fs | 691 | importante |
| Ciclo apunte/boceto («taller») | taller-* (5) | 219 | importante |
| Anclaje/Centinela de drift | anclaje-* (7), calco-anclaje-contrato | 1.321 | marginal (feature de circunstancia) |
| Procedencia de bundle | procedencia-staleness | 160 | importante (consumidor hd-opm) |
| Store/UX | undo, silencio-readonly | 224 | importante |
| Arquitectura | dependencias-unidireccionales | 207 | importante (simplificable) |
| Documentales | corpus-documental, manual-limites, manual-sistemas-opm, manual-software-opm | 730 | 2 acreción + 2 mixtos |

---

## 2. Cómo se ejecuta hoy (y qué falló al intentarlo)

### 2.1 Gates declarados (`app/package.json`)

```json
"check": "bun run typecheck && bun run test",
"test": "bun test src",
"browser:smoke": "playwright test",
"browser:preview": "playwright test --config playwright.preview.config.ts e2e/25-produccion-preview.preview.spec.ts",
"browser:external": "playwright test --config playwright.external.config.ts",
"lint": "eslint src/",
"design:governance": "bun test scripts/design-governance-audit.test.mjs && bun run scripts/design-governance-audit.mjs",
"cordon:skill": "bun test scripts/cordon-skill-audit.test.ts && bun run scripts/cordon-skill-audit.ts",
"cordon:estado": "bun test scripts/cordon-estado.test.ts && bun run scripts/cordon-estado.ts",
"quality:gate": "bun run scripts/quality-ledger.mjs --markdown --check",
"gate:refactor": "bun test scripts/deploy.test.ts && bun run check && bun run lint && bun run build && bun run design:governance && bun run cordon:skill && bun run browser:smoke --workers=2 && bun run quality:gate",
"visual:audit": "node scripts/in-vivo-test.mjs",
"visual:deep": "node scripts/in-vivo-deep-checks.mjs",
"visual:exhaustivo": "node scripts/in-vivo-exhaustivo.mjs",
"ux:eval": "bun run scripts/evaluacion-ux-permanente.mjs",
```

- `bun test src` **no** incluye `scripts/` (los tests de scripts corren solo dentro de
  sus gates específicos).
- `gate:refactor` encadena ocho gates. Tres de ellos (`design:governance`,
  `cordon:skill` y `quality:gate`) son gobernanza autorreferente (§5).
- `in-vivo-*` se ejecutan con `node`, no con `bun`: dos runtimes para lo mismo.

### 2.2 Observaciones de ejecución en este entorno

| Comando | Resultado | Causa |
|---|---|---|
| `bun test src/leyes` | 293 pass, 1,13 s | — |
| `bun test scripts` | 30 pass, 3,8 s | — |
| `bun test src` | 3.666 pass / 14 fail | **contaminación entre archivos**, no Postgres (§7.1) |
| `bunx playwright test` | 0 tests: webServer falla | `tutor:corpus` exige KORA en `/home/felix/kora-knowledge` |
| Playwright con Vite manual | `browserType.launch: Executable doesn't exist … chromium_headless_shell-1217` | versión de navegador fijada por `@playwright/test ^1.59.1` |
| Playwright con config de scratch (`executablePath` → chromium-1194, `webServer` desactivado) | corre; resultado en §6.6 | — |

La configuración de scratch que usé (fuera del repositorio) fue:
`{...base, webServer: undefined, projects: base.projects.map(p => ({...p, use: {...p.use, launchOptions: {executablePath}}}))}`
y tres `bunx vite --port 5173|5174|5175` con `VITE_MOBILE_READONLY=true` y
`MODEL_REQUIRE_AUTH=true` en los puertos +1 y +2.

---

## 3. `src/leyes`: catálogo pieza por pieza

Convención de las leyes: cada archivo abre con un comentario que enuncia la ley, la
regla SSOT (R-…) o el acta que la originó y el **control de no tautología** (un mutante
que debería ponerla roja). Casi todas son puras sobre `Modelo`, usan `crearModelo`,
`crearObjeto`, `crearProceso`, `crearEnlace` y otras funciones del kernel, y desenvuelven
`Resultado<T>` con un `must()` local (20 copias en `leyes/`, 130 en todo `src`).

### 3.1 Semántica OPM y bimodalidad OPD/OPL (núcleo: portar)

#### `proyecciones.test.ts` (502 líneas)
- **Leyes:** `law-json-roundtrip` (l.42), `law-render-stable-metadata` (l.66),
  `law-refinement-thing-matrix` (l.112 y l.163: descomposición y despliegue simultáneos
  sobre una misma cosa, la «ortogonalidad ronda 15.2»), `law-refinement-removal`
  (l.186 y l.206: quitar un refinamiento no deja huérfanos).
- **Protege:** la identidad de ids tras `exportarModelo`→`hidratarModelo`; la matriz
  Thing × {descomposición, despliegue}; `padreId` del OPD hijo; la retirada limpia.
- **Acoplamiento:** importa `proyectarModeloAJointCells` (render) para
  `law-render-stable-metadata`, lo que hace que una ley de kernel dependa del
  renderizador (la propia `dependencias-unidireccionales` lo documenta como excepción
  de test).
- **Recomendación:** **keep**, separando la parte de render en un test del adaptador.

#### `opl-reverse.test.ts` (106 líneas): «law-opl-safe-lens»
- l.9: **no se borra por ausencia.** Quitar una línea del OPL no borra el hecho; el
  diagnóstico es `no-delete-by-absence` con severidad `info` y `patches` queda `[]`.
  Implementación: `opl/parser/planificar.ts:40`.
- l.29: preview puro (no muta el modelo); patches esperados `renombrar-entidad`,
  `cambiar-esencia`, `cambiar-afiliacion`.
- l.47: apply preserva hechos omitidos (enlaces, entidades y estados, id por id).
- l.61: la oración jerárquica «*X* se descompone en *A* y *B*.» crea el refinamiento
  y es **idempotente** (la segunda planificación da `[]`).
- **Regla bimodal sagrada:** el OPL es una lente segura. La edición textual nunca
  destruye hechos que el texto omite. **Portar tal cual.**

#### `invocacion-implicita-bimodal.test.ts` (216 líneas)
- El orden temporal de los subprocesos vive en `Opd.ordenInzoom: Id[][]`, bandas con
  cardinalidad paralela. Leyes:
  - l.25: `OPL(campo) == OPL(geometría equivalente)`, con la oración exacta
    `"*Atender* se descompone en paralelo *Evaluar* y *Registrar*, *Cerrar*, en esa secuencia."`.
  - l.43: el layout deriva las bandas Y **desde el campo** y lo impone sobre la geometría.
  - l.62: roundtrip estricto forward→reverse→forward **sin enlaces de invocación**
    (CX1 secuencia, CX2 paralelo, mixto).
  - l.90: `derivar ∘ layout = id_O` (sección de un cociente). La inversa **no** es ley,
    y el comentario lo explica (el retracto no es isomorfismo).
  - l.113: el flujo de simulación desde el campo coincide con el flujo desde rayos de
    invocación equivalentes.
- Implementación: `modelo/operaciones/refinamiento/helpers.ts:168`
  (`derivarOrdenInzoomDeGeometria`), `:195` (`aplicarOrdenInzoomDerivado`),
  `autoria/layout` (`aplicarLayoutCompleto`), `opl/generar`, `opl/parser` y el plan de
  simulación.
- Relacionada: `INVOCACION_REDUNDANTE_CON_ORDEN` es «bloqueo»
  (`modelo/diagnosticoSeveridad.ts`, entrada U5 / R-INV-2B §5.4).
- **Recomendación: keep, de las mejores leyes del repositorio.**

#### `refinamiento-cascadas.test.ts` (179 líneas)
- l.25 `law-refinement-projection`: al descomponer, los transformadores externos
  (consumo/resultado) se distribuyen a los subprocesos como enlaces
  `derivado.tipo = "enlace-externo-refinamiento"`, y no queda el aviso
  `visual-transformador-contorno-no-distribuido` (`modelo/diagnosticoVisual.ts:283`).
- l.39 `law-refinement-late-link`: un enlace externo creado **después** de descomponer
  se sincroniza en el hijo (`derivado.origen: "automatico"`, apariencia externa con
  `contextoRefinamiento.rol = "externo"`).
- l.62 `law-refinement-reorder`: mover subprocesos recalcula los derivados; el consumo
  va al primero en orden temporal y el resultado al último.
- l.91 `law-refinement-manual-reanchor`: reanclar a mano deja `origen: "manual"`.
- l.111 `law-refinement-complete-flow`: sin `visual-subproceso-sin-transformado`
  (`diagnosticoVisual.ts:308`) cuando todos los subprocesos transforman algo.
- Implementación: `modelo/operaciones/refinamiento/proyeccion.ts:174-269`
  (`redistribuirEnlacesExternosSiPrimerSubproceso`,
  `distribuirEnlaceExternoEnRefinamiento`, `proyectarEnlacesExternosEnRefinamiento`),
  `descomposicion.ts:72` (`descomponerProceso` crea «Proceso 1..3» y guarda
  `primeroId`/`ultimoId` en l.145-146).
- **Keep.**

#### `refinamiento-frontera.test.ts` (332 líneas): F-V1/F-V2
- Round-trip out-zoom∘in-zoom preserva la **firma de frontera** del proceso (l.113),
  el in-zoom es idempotente (l.127) y la correspondencia padre↔hijo de los derivados es
  completa y uno a uno (l.154), con controles contra derivados huérfanos o faltantes
  (l.182, l.194). La misma propiedad vale para despliegue de objeto (l.222-263): el
  despliegue **no** crea derivados de frontera (l.241).
- Implementación: `modelo/equivalencia/verticalidad.ts:19` (`firmaFronteraEntidad`),
  `:51` (`verifyBoundaryCorrespondence`), `preservacion.ts:27`
  (`observarPreservacionFrontera`).
- Mapea R-CAT-EQ-3 (`DESCOMPOSICION_NO_PRESERVA_FRONTERA`, «mejora»).
- **Keep**, con posible fusión con `equivalencia.test.ts`.

#### `supresion-estados-aparicion.test.ts` (117 líneas)
- La supresión de estados es **por aparición** (fibras independientes por OPD, l.42),
  la supresión global domina (l.60), son ortogonales (l.76: quitar la global no
  resucita la local), el render lo respeta (l.92) y el roundtrip conserva
  `estadosSuprimidos` (l.108).
- Implementación, el predicado completo en `modelo/visibilidadEstados.ts:70-73`:
  ```ts
  export function estadoVisibleEnAparicion(estado: Estado, apariencia: Apariencia): boolean {
    if (estado.suprimido) return false;
    return !(apariencia.estadosSuprimidos?.includes(estado.id) ?? false);
  }
  ```
- **Keep** (el roundtrip importa el renderizador; separar esa parte).

#### `hechos-pegado.test.ts` (64 líneas)
- Un enlace dibujado sobre un estado suprimido en esa aparición produce
  `severidad: "error-consistencia"` (`modelo/hechos/pegado.ts:39`), y la verificación
  es pura. La ley es: **un OPD no puede dibujar un enlace a algo que su aparición no
  muestra.** **Keep.**

#### `contencion-refinamiento.test.ts` (144 líneas): «LEY L7»
- En todo in-zoom, los internos quedan dentro del bbox del contorno y los externos
  fuera (l.38, anidado en l.55), con dos controles de no tautología que mueven a mano
  un interno fuera y un externo dentro (l.99, l.123).
- Implementación: `autoria/contencion.ts:41` (`clasificarContencionOpd`) sobre
  `autoria/layout`; fixture `autoria/_fixtures/cafetera`.
- **Keep** (regla visual OPM del in-zoom).

### 3.2 Simulación

| Archivo | Leyes | Implementación | Valor |
|---|---|---|---|
| `simulacion-unfold.test.ts` (55) | `pasoEfecto` rinde 1 sucesor de peso 1 sin abanicos; `desplegar` == iterar `ejecutarPaso`; pureza | `modelo/simulacion/runner` | importante: keep |
| `simulacion-modos.test.ts` (63) | determinista == default; los tres modos sin abanicos son lineales; `desplegarArbol` lineal | idem | keep, fusionar con unfold |
| `simulacion-ramas.test.ts` (258) | XOR de salida: cada rama produce su estado (BUG-1), sin contaminación entre ramas (BUG-6), reproducibilidad por semilla (BUG-2), distribución no fija (BUG-4), árbol exhaustivo (BUG-5), `resolverRamaSimulacion`, `decisionXorSimulacion` | idem | **núcleo del runner**: keep |
| `tiempo-enriquecimiento.test.ts` (118) | F-D1: ventana temporal y `eventosTemporales` de sobretiempo con umbral en `min` convertido a `s`; F-D3: resumen de corridas | `simulacion/enriquecimiento`, `operaciones.definirTiempoExcepcionEnlace`; exige **R-EXC-1A** (`modelo/operaciones/helpers.ts:140-145`: el proceso de manejo de excepción debe ser ambiental) | importante |
| `enriquecimiento-cost.test.ts` (139) | el costo es un monoide (suma, unidad 0, asociatividad) y la «Cost-category» (min,+) con cerradura de camino mínimo | `simulacion/costoCategoria` | **marginal**: matemática categorial sin consumidor visible en el flujo del usuario; cortar o mantener en un módulo opcional |

### 3.3 Capa «categorial»: composición, equivalencia, razonamiento, integración

- `composicion.test.ts` (124):
  - `law-composicion-respeta-lineal` (l.38, R-CAT-LIN-2): identificar un objeto
    `lineal` consumido en ambos lados produce `error-linealidad`
    (`modelo/composicion/linealidad.ts:22`).
  - Pureza (l.48, l.57).
  - Asociatividad módulo namespacing (l.97).
  - Composición bien tipada (l.113).
  - Implementación: `modelo/composicion/componer.ts:166`. Keep.
- `equivalencia.test.ts` (79), R-CAT-EQ-2: `compareBoundarySignature` es reflexiva,
  simétrica y pura, y declara `scope: "boundary-signature"`
  (`modelo/equivalencia/verificar.ts:35`). El registro de conformidad aclara que
  *«igualdad de firma de frontera no demuestra identidad, bisimulación…»*. Keep y
  fusionar con `refinamiento-frontera`.
- `razonamiento.test.ts` (182): `derivar` es puro y determinista; todo lo derivado
  lleva `inferido: true` y referencia solo hechos declarados en `hechosDe`
  («no inventa»); `impacto-aguas-abajo` es transitivo y dirigido (con un control que
  excluye lo que está aguas arriba). Separa lo declarado de lo inferido. Keep.
- `integracion-ss-fs.test.ts` (306): toda referencia de la traza de simulación está
  denotada en los hechos F0; lo que S transiciona, F3 lo reconoce; componer preserva la
  simulabilidad; el in-zoom simulado ejerce la firma de frontera. **Importante pero
  sobredimensionado:** el vocabulario («F0», «F3», «Ss↔Fs», «haz», «sección») es
  andamiaje de ingeniero sin reflejo en el producto. **Simplificar** a 3 o 4 tests
  con nombres llanos.

### 3.4 Ciclo apunte/boceto («taller»: R-OPD-REF-20, R-OPD-REF-15)

| Archivo | Ley | Implementación |
|---|---|---|
| `taller-integridad-ciega.test.ts` (23) | una apariencia con `entidadId` colgante se rechaza igual en un OPD suelto que en la raíz | `serializacion/validarApariencias.ts:36` |
| `taller-export-honesto.test.ts` (44) | un modelo con OPD sin adoptar **bloquea** el export canónico con la causa «sin integrar»; un apunte no bloquea; el perfil `intercambio` ignora el gate; mismo gate para ZIP | `serializacion/perfilesExport.ts:73-84` (`gateOpdsSinAdoptar`) |
| `taller-rigor-al-graduar.test.ts` (44) | un código degradable es `estilo` en apunte y `mejora` al graduar; la integridad es `bloqueo` siempre | `modelo/diagnosticoSeveridad.ts:113-176` (`CODIGOS_VALIDEZ_DEGRADABLES_APUNTE`, `severidadDiagnostico`) |
| `taller-convergencia.test.ts` (75) | top-down y adopción producen el **mismo hecho de vínculo** (slot + `padreId`); ambos rechazan ciclos; adoptar **no** andamia la frontera (bottom-up) | `modelo/operaciones/refinamiento/establecer.ts:49-110` (constructor único, aciclicidad R-OPD-REF-8 en l.63) |
| `taller-sin-especie-nueva.test.ts` (33) | `especieDe` solo produce `{modelo, apunte, biblioteca}` | `persistencia/especie.ts:13` |

- Las cuatro primeras codifican reglas reales de ciclo de vida: el apunte es un modelo
  con validez relajada, nunca con integridad relajada. **Keep.**
- `taller-sin-especie-nueva` es una **guardia de proceso** («no crear una cuarta
  especie», que viene de una regla de CLAUDE.md sobre deuda categorial). Prueba un
  `if/else` de tres ramas. **Cut**: en la reescritura, un tipo discriminado lo hace
  innecesario.

### 3.5 Anclaje y Centinela de drift (1.321 líneas)

Es la funcionalidad de reutilización con **referencia viva** a una «Pieza» de una
«biblioteca» (otro `Modelo` persistido, típicamente la «greda gist»). Incluye la
detección de *drift* por hash semántico y las operaciones re-sincronizar y soltar.

| Archivo | Contenido |
|---|---|
| `anclaje-mecanismo.test.ts` (92) | anclar no copia (0 entidades nuevas), la referencia apunta fuera del modelo y no toca `estereotipoId` |
| `calco-anclaje-contrato.test.ts` (82) | el Calco (`injertarEstereotipo`) crea entidades sin `anclaje`; el Anclaje no crea entidades |
| `anclaje-centinela.test.ts` (222) | `evaluarDrift` (`modelo/operaciones/anclaje.ts:73`): igual ⇒ `sincronizado`, distinto ⇒ `divergente`, `null` ⇒ `no-resuelto`; ciclo anclar→divergir→re-sincronizar→soltar; guardas de «falla ruidoso» |
| `anclaje-quietud.test.ts` (171) | la firma semántica no cambia ante roundtrip ni re-layout: **cero falsos positivos** |
| `anclaje-sensibilidad.test.ts` (143) | cada campo `firmado` que muta da `divergente` (23 mutaciones); cada campo `excluido` que muta da `sincronizado` (13) |
| `anclaje-particion.test.ts` (89) | instancias `Required<T>` máximas cuyas claves coinciden con `PARTICION_*` (`modelo/submodelos/firmaSemantica.ts:45-192`) |
| `anclaje-composabilidad.test.ts` (248) | fixture hermético `fixture-anclaje-v0.json` (14 kB, copiado de `gist-opm@be59117`): el Calco-adversarial nunca entra al `driftMap`; invariancia de eje; **importa `construirResolverHashVivo` desde `store/modelo/acciones-anclaje`** (una ley de kernel que depende del store) |
| `anclaje-pieza-grano.test.ts` (274) | grano fino: `firmaPieza` (`modelo/submodelos/estado.ts:57`) mide la vecindad de radio 1; mutar una pieza ajena no cambia el veredicto; una pieza ausente da `divergente`; una biblioteca no leída da `no-resuelto` |

- **Evaluación.** Técnicamente impecable: la «pinza» quietud/sensibilidad/partición es
  el mejor ejemplo del repositorio de un test que ataca falsos positivos y falsos
  negativos a la vez. Pero la funcionalidad no pertenece a OPM/ISO 19450. Responde a
  una circunstancia (reutilizar la ontología gist en modelos de dominio externos), su
  historia está en cinco actas (`docs/auditorias/2026-06-24…2026-06-30`) y suma 3 E2E
  (34, 35, 36), 3 amarras externas y una cinta de modo biblioteca (35-cinta).
- **Recomendación: simplify.** Si la reescritura conserva el anclaje, basta con **un**
  archivo de unas 250 líneas: mecanismo, drift y la pinza quietud/sensibilidad sobre
  una biblioteca pequeña construida en el test. La idea de `PARTICION_*` (un
  `Record<keyof T, "firmado"|"excluido">` exhaustivo por tipos) **vale la pena
  portarla** como patrón para cualquier firma o diff semántico, por ejemplo para
  «¿cambió el modelo?» o `dirty`. El fixture cross-repo y las amarras se cortan.

### 3.6 Procedencia de bundle: `procedencia-staleness.test.ts` (160)

- El sello `procedencia` (`protoHash`, `autoriaVersion`, `layoutVersion` y
  `doctrinaVersion` opcional) viaja en `modelo.procedencia`, sobrevive al roundtrip y
  detecta la edición posterior del proto (nombra la componente divergente con ambos
  valores). Un bundle **sin** sello queda byte-idéntico. El campo legacy `glosarioHash`
  se tolera y se descarta. Un sello malformado se rechaza con un diagnóstico que
  contiene `procedencia`. Un `doctrinaVersion` vacío se rechaza.
- Implementación: `autoria/procedencia` (`construirSello`, `compararProcedencia`),
  `autoria/bundle` (`emitirBundle`).
- Es un **contrato** con el consumidor hd-opm (goldens byte a byte). **Keep** si la
  reescritura mantiene el compilador de proto (`autoria/`); en otro caso, migrar.

### 3.7 Store y UX

- `undo.test.ts` (71), `law-opl-apply-undo-atomicity`:
  `store.getState().aplicarEdicionOplLibre(...)` con varios patches produce **una**
  entrada en `pestana.historialUndo`; `deshacer` restaura byte a byte
  (`exportarModelo`) y `rehacer` reaplica. Es un contrato de atomicidad del undo para
  ediciones OPL. **Keep.**
- `silencio-readonly.test.ts` (153), «silencio-cero»: bajo `readOnly`, toda acción
  mutadora (`crearObjetoDemo`, `crearProcesoDemo`, `crearEnlaceEntreEntidades`,
  `agregarEstadoSmart`, `descomponerSeleccionada`, `elegirTipoEnlace`,
  `iniciarConexionDesdeApariencia`) cumple tres cláusulas: (1) no muta, (2) deja
  `mensaje` poblado y (3) no emite un *flash* «✓». En simulación, el mensaje nombra
  «Modo simulación» y «⎋». **Keep** como principio: un bloqueo nunca es mudo ni miente.
- Ambos tests dependen del store singleton (`import { store } from "../store"`), con
  `beforeEach` que reimporta un modelo. El singleton global es justamente lo que produce
  la contaminación de §7.1. En la reescritura: `crearStore()` por test.

### 3.8 Arquitectura: `dependencias-unidireccionales.test.ts` (207)

- L7: las capas fuente (`modelo`, `store`, `serializacion`, `opl`, `canvas`,
  `persistencia`) no importan de `render`. La *allowlist* está congelada vacía y hay un
  control de no tautología que escribe un archivo temporal
  `modelo/__l7_fixture_violacion_render.ts` con un import prohibido y verifica que se
  detecte. L8: el kernel no depende de `opl`, `serializacion`, `persistencia`, `store`,
  `app` ni `ui`; `app` no importa de `ui` ni de `render`; `store` no importa de `app`.
- Es un buen *fitness test*, pero **escribe dentro de `src/`** durante el test (riesgo si
  aborta: el `afterAll` borra, aunque un `kill -9` deja basura) y reimplementa un
  analizador de imports por regex.
- **Simplify:** una regla `no-restricted-imports` o `import/no-restricted-paths` de ESLint
  por capa, o un test de 40 líneas sin escribir en disco. **Se conserva la dirección**
  `modelo → store → app → ui/render` de AGENTS.md.

### 3.9 Leyes documentales

| Archivo | Qué verifica | Clasificación |
|---|---|---|
| `corpus-documental.test.ts` (315) | cada doc principal tiene exactamente un H1; enlaces y anclas locales válidos; cada hoja rápida HTML declara `lang="es-CL"`, favicon SVG autocontenido, `text-decoration:underline`, `color-scheme: light; --paper: #fff`, tablas con `aria-label`; prohíbe `Ctrl+N`, `Ctrl+O`, voseo (`Relajá`, `Probá`), etiquetas `HOY/CORTO/FUERA`, «Revisión nueva»; **~40 `toContain`/`not.toContain` de frases literales** en `manual-opforja.md` y hojas (p. ej. `"responde \`409\` y no escribe nada"`, `"W6.0"`, `"\`92dbbaa7\`"`); incluso verifica el **texto de `scripts/in-vivo-*.mjs`** (`resolve(DIR_SHOTS, "_reporte.md")`) | **acreción**: un lint editorial ejecutado como test de producto. Cut (si interesa, un `docs:lint` fuera de `bun test src`) |
| `manual-limites.test.ts` (179) | la sección §L de `docs/manual-opforja.md` no contradice `docs/roadmap/registro-conformidad-ssot.md` (tokenizador, *stopwords*, matching de filas CERRADA/PROGRAMADA/PARCIAL) | **acreción autorreferente pura**: el registro conserva una fila CERRADA **solo** como control de este test (registro l.≈24: «La fila cerrada se conserva como control de no-tautología de `app/src/leyes/manual-limites.test.ts`; no representa backlog.»). Cut |
| `manual-sistemas-opm.test.ts` (112) | cada bloque ```opl``` del manual y cada línea de `docs/ejemplos/puente-vecinal.opl` (30 líneas) se parsea como una oración soportada; importar da 11 entidades, 15 enlaces, 10 estados y 0 avisos; roundtrip OPL→modelo→OPL→modelo con texto idéntico; distingue agente de instrumento | **mixto**: el fixture `.opl` + roundtrip es una excelente prueba de regresión del parser. El acoplamiento al Markdown del manual es acreción. Simplify: mover los `.opl` a fixtures del parser |
| `manual-software-opm.test.ts` (124) | idem con `lumbre-reservas.opl` (32 líneas: 13 entidades, 16 enlaces, 10 estados); parser de `cambia … de … a …` y de condición con `de lo contrario … se omite` | mixto: igual que el anterior |

---

## 4. Catálogo de reglas OPM codificadas en esta área (sagradas)

Las leyes no **implementan** reglas, pero son su **especificación ejecutable**. Cada fila
indica dónde se enuncia (test) y dónde se aplica (código). Una reescritura debe
conservar la regla y su test.

| # | Regla (id SSOT si existe) | Enunciado operativo | Test | Implementación |
|---|---|---|---|---|
| 1 | Lente OPL segura | editar el OPL nunca borra un hecho por ausencia de su oración (`no-delete-by-absence`, info) | `leyes/opl-reverse.test.ts:9,47` | `opl/parser/planificar.ts:40`, `opl/clasificadorEdicion.ts:193` |
| 2 | Idempotencia de OPL jerárquico | «X se descompone en A y B» crea el refinamiento una sola vez | `opl-reverse.test.ts:61` | `opl/parser` (`crear-refinamiento`) |
| 3 | Roundtrip JSON | export/hidratar preserva ids, refinamientos, `padreId` y referencias | `proyecciones.test.ts:42` | `serializacion/json.ts` (`FORMATO` en l.19) |
| 4 | Matriz de refinamiento | objeto y proceso admiten descomposición (in-zoom) y despliegue (unfold), **simultáneos** | `proyecciones.test.ts:112,163` | `modelo/operaciones/refinamiento/{descomposicion,despliegue}.ts` |
| 5 | Retirada sin huérfanos | quitar descomposición o despliegue elimina el OPD hijo y el slot | `proyecciones.test.ts:186,206` | `refinamiento/helpers.ts:38` (`quitarRefinamientoEntidad`) |
| 6 | Distribución de frontera (R-OPD-REF-4/11) | al descomponer, consumo va al primer subproceso y resultado al último, como derivados; el contorno no conserva transformadores sin distribuir | `refinamiento-cascadas.test.ts:25,62`; e2e `05:547` | `refinamiento/proyeccion.ts:174-269`, `descomposicion.ts:145-146`; aviso `diagnosticoVisual.ts:283` |
| 7 | Enlace tardío | un enlace externo posterior al in-zoom se proyecta al hijo | `refinamiento-cascadas.test.ts:39` | `proyeccion.ts:190` |
| 8 | Reanclaje manual | un derivado reanclado queda `origen:"manual"` y sobrevive al reorden | `refinamiento-cascadas.test.ts:91`; e2e `05:640` | `operaciones.reanclarEnlaceExternoDerivado` |
| 9 | Subproceso transforma (R-PROC-2) | un subproceso sin transformado es aviso; un proceso que no transforma es `PROCESO_NO_TRANSFORMA` = «bloqueo» | `refinamiento-cascadas.test.ts:111` | `diagnosticoVisual.ts:308`, `diagnosticoSeveridad.ts` (`PROCESO_NO_TRANSFORMA`) |
| 10 | Preservación de frontera (R-CAT-EQ-3) | out-zoom∘in-zoom preserva la firma; correspondencia derivados↔padre 1:1; el despliegue no crea derivados | `refinamiento-frontera.test.ts:113-318` | `modelo/equivalencia/verticalidad.ts:19,51`, `preservacion.ts:27` |
| 11 | Igualdad de firma de frontera (R-CAT-EQ-2) | reflexiva, simétrica y pura; rotulada `boundary-signature` (no es equivalencia total) | `equivalencia.test.ts:52-73` | `modelo/equivalencia/verificar.ts:35` |
| 12 | Orden de in-zoom bimodal (R-INV-2B, §5.4) | `ordenInzoom: Id[][]` gobierna la geometría (bandas Y), el OPL («paralelo … en esa secuencia»), el reverse y la simulación; invocación redundante con el orden = bloqueo | `invocacion-implicita-bimodal.test.ts:25-113` | `refinamiento/helpers.ts:125,168,195`; `diagnosticoSeveridad.ts` (`INVOCACION_REDUNDANTE_CON_ORDEN`, `ORDEN_INZOOM_REFERENCIA_INVALIDA`) |
| 13 | Contención de in-zoom | internos ⊆ bbox del contorno; externos fuera | `contencion-refinamiento.test.ts:38-123` | `autoria/contencion.ts:41`; aviso `visual-externo-dentro-contorno` |
| 14 | Visibilidad de estados | global domina a local; local por aparición; ortogonales; persiste | `supresion-estados-aparicion.test.ts:42-108` | `modelo/visibilidadEstados.ts:70-73` |
| 15 | Pegado OPD | un enlace no puede terminar en un estado oculto en esa aparición (`error-consistencia`) | `hechos-pegado.test.ts:52` | `modelo/hechos/pegado.ts:39` |
| 16 | Linealidad (R-CAT-LIN-2) | un recurso `lineal` consumido por dos consumidores tras componer da `error-linealidad`; `RECURSO_LINEAL_MULTIPLES_CONSUMIDORES` | `composicion.test.ts:38` | `modelo/composicion/linealidad.ts:22` |
| 17 | Composición (R-CAT-COMP-2) | pura, asociativa módulo ids, no introduce errores | `composicion.test.ts:48-113` | `modelo/composicion/componer.ts:166` |
| 18 | Inferencia marcada | todo hecho derivado lleva `inferido: true` y no inventa referencias | `razonamiento.test.ts` | `modelo/razonamiento` |
| 19 | XOR en simulación | la rama elegida determina la transición; ramas independientes; semilla reproducible | `simulacion-ramas.test.ts` | `modelo/simulacion/runner` |
| 20 | Excepción temporal (R-EXC-1A / R-OPD-CTL-6) | el proceso de manejo de excepción debe ser **ambiental**; el sobretiempo se dispara cuando la duración supera `tiempoMaximo` | `tiempo-enriquecimiento.test.ts:52-82` | `modelo/operaciones/helpers.ts:140-145` |
| 21 | Integridad no degrada (R-OPD-REF-20) | una referencia colgante se rechaza en OPD suelto y en raíz; la integridad es `bloqueo` también en apunte | `taller-integridad-ciega.test.ts:13`, `taller-rigor-al-graduar.test.ts:38` | `serializacion/validarApariencias.ts:36`; `diagnosticoSeveridad.ts:113-176` |
| 22 | Export honesto (R-OPD-REF-20) | un OPD sin adoptar bloquea el export canónico en un modelo; en un apunte es observación | `taller-export-honesto.test.ts:14-37` | `serializacion/perfilesExport.ts:73-84` |
| 23 | Rigor al graduar (R-OPD-REF-15) | la misma señal pasa de `estilo` (apunte) a su severidad real al graduar | `taller-rigor-al-graduar.test.ts:32` | `diagnosticoSeveridad.ts:170-176` |
| 24 | Convergencia de refinamiento (R-OPD-REF-20, R-OPD-REF-8) | top-down y adopción producen el mismo vínculo; aciclicidad; adoptar no andamia | `taller-convergencia.test.ts:21-58` | `refinamiento/establecer.ts:40-110` |
| 25 | Colisión de nombre (unicidad de cosa) | crear o renombrar con un nombre existente ofrece «Reutilizar» (misma entidad, nueva aparición), «Usar otro nombre» o «Cancelar» | e2e `29-colision-nombre.spec.ts:74-216` | `modelo/operaciones/colisionNombre.ts:37` |
| 26 | Transiciones TS3 en OPL | consumo desde un estado + resultado a un estado = «*P* cambia **O** de \`a\` a \`b\`.»; no se emiten las formas parciales | e2e `07:361,382,434` | `opl/generadores/procedural.ts` |
| 27 | Enumeración de estados | «**O** puede estar \`a\` o \`b\`» (ser/estar §1.5) | e2e `07:318` | `opl/generar` |
| 28 | Agente vs instrumento | «maneja» = agente; «requiere» = instrumento; agente exige objeto físico (`agente-requiere-objeto-fisico`, R-AG-1) | `manual-sistemas-opm.test.ts` (agente/instrumento) | `opl/parser`, `modelo/validaciones.ts` |
| 29 | Condición | «*P* ocurre si **O** está en \`s\`, de lo contrario *P* se omite.» = condición con base instrumento | `manual-software-opm.test.ts` | `opl/parser` |
| 30 | Atomicidad del undo | una aplicación OPL con N patches es 1 entrada de undo | `undo.test.ts:13`; e2e `06:397` | `store` (`aplicarEdicionOplLibre`) |

Tabla de severidades que las leyes fijan
(`modelo/diagnosticoSeveridad.ts:19-54`, contrato visible al usuario): son «bloqueo»
`PROCESO_NO_TRANSFORMA`, `EFECTO_OBJETO_SIN_ESTADOS`, `PAR_TRANSFORMADOR_DUPLICADO`,
`INVOCACION_REDUNDANTE_CON_ORDEN` y `ORDEN_INZOOM_REFERENCIA_INVALIDA`; el resto es
«mejora». `CODIGOS_VALIDEZ_DEGRADABLES_APUNTE` (l.113) enumera 36 códigos que en
apunte pasan a «estilo».

---

## 5. Gobernanza en `scripts/`: pieza por pieza

| Script | Líneas | Qué hace | Gate | Veredicto |
|---|---:|---|---|---|
| `cordon-estado.ts` (+test 134) | 126 | imprime un tablero: versión de URNs KORA (`resolverUrn`), SHA/upstream de Git, árbol de `docs`, hash del manual, skills Claude y Codex, build servido en producción (regex sobre el bundle minificado: ``title:`build ${x}` ``), `/healthz`, `/session`, deriva fuente↔deploy | `cordon:estado` (manual) | **simplify/cut**: el único dato operativo útil (SHA servido == HEAD) ya lo verifica `deploy/deploy.sh:35-47` al desplegar. El resto es «control plane» de un ecosistema (KORA, skills) ajeno al modelador |
| `cordon-skill-audit.ts` (+test 75) | 82 | lee `~/.claude/skills/<skill>/SKILL.md` y `~/.agents/skills`, parsea `<!-- kora:sello -->`, compara versión y hash con `CORDON_SKILL_ESPERADOS` (`src/canon/selloSkill.ts:109-122`, pines `2.1.0`/`3.1.0`, `sha256:…`), o calcula un *fingerprint* de 11 archivos | dentro de `gate:refactor` | **cut**: verifica la instalación local de una skill de agente, no el producto. Hace que un gate del modelador dependa del `$HOME` del operador. `src/canon/selloSkill.ts` también sobra |
| `quality-ledger.mjs` | 123 | (1) presupuesto del bundle principal ≤ 124,62 + 5 kB gzip; (2) cuenta apariciones de strings `law-[a-z0-9-]+` en `*.test.ts` y exige que existan 6 «leyes canónicas» (con alias `law-store-undo-atomicity → law-opl-apply-undo-atomicity`); (3) cuenta comentarios `Compat detector` (máximo 0) | `quality:gate` | **simplify**: conservar solo (1) como `size-limit` de 10 líneas. (2) y (3) son autorreferentes: verifican que existan *palabras* en tests, no conducta |
| `design-governance-audit.mjs` (+test 37) | 242 | exige que `ui-forja/GOVERNANCE.md` contenga las frases `reglas-opm-estrictas.md`, `SSOT suprema`, `OPL ← canvas → Índice + Inspector` y **`bun run design:governance`** (el documento debe nombrar al gate que lo verifica); alinea `**Versión:** 1.2` entre 5 artefactos; compara `ui-forja/tokens.json` con `src/ui/tokens.ts` (colores, strokes, tipografía, radios 0, sombras `none`); prohíbe sombras con *offset* en `src/ui` y `src/render/jointjs` | `design:governance` | **simplify**: la sincronía de tokens se resuelve generando una fuente desde la otra (o eliminando `tokens.json`); radios y sombras pueden ser una regla de lint. El resto es **cut** |
| `evaluacion-ux-permanente.mjs` (+test 45) | 486 | recorrido Playwright de 13 «criterios» (carga, crear SD, enlace click-click y drag, refinamiento, 8 OPDs, avisos, OPL filtrado, auto-layout, persistencia, móvil 390) que genera un reporte Markdown con capturas en `ronda21/`; su test **solo prueba el serializador del reporte** | `ux:eval` (manual) | **cut**: duplica la suite E2E, sin gate, con nombres de «ronda» |
| `fixtures-ux-regresion.mjs` | 39 | elige tres fixtures (chico, mediano, grande) por nombre desde `src/modelo/fixtures` («System Diagram», «OnStar System», «OPM Structure Meta Model») | usado por `ux:eval` | cut junto con `ux:eval`; los fixtures en sí pueden servir para benchmarks |
| `in-vivo-test.mjs` | 821 | auditoría ad hoc en navegador real (secciones 0-3: runtime, bienvenida, SSOT visual) que escribe `test-results/in-vivo/_reporte.md` | `visual:audit` (manual, **node**) | **cut** |
| `in-vivo-deep-checks.mjs` | 381 | criterios A-I (descomposición, redistribución, marcadores, *routing*, *link tools*, round-trip JSON, *self-link*); **URL por defecto `http://138.201.53.205:5173/`**, una IP fija; selectores frágiles (`aside input`, botón «Descomponer») | `visual:deep` (manual) | **cut** (lo útil ya está en e2e 05/07/14) |
| `in-vivo-exhaustivo.mjs` | 905 | bloques 0-12 contra **producción** (`https://opforja.sanixai.com/`): tablet, móvil, persistencia, *palette*, IFML, importación corrupta, HODOM v1.6 (261 entidades) pasado por argumento | `visual:exhaustivo` (manual) | **cut**; conservar la idea de «modelo grande» como prueba de rendimiento con un fixture sintético |
| `verify-reproducible.ts` (+smoke 66) | 101 | CLI: `--proto <md>` o `--modelo <json>` contra `--golden`; exit 0/1/2; nombra la componente del sello divergente y las primeras N líneas distintas | `verify:reproducible` (consumidor hd-opm) | **keep** (contrato externo pequeño); el smoke puede ser un `bun test` |
| `render-headless.ts` (+smoke 150) | 201 | CLI: compila el proto, levanta **Vite en proceso** (`strictPort`) y Chromium, llama a `window.__opmRenderHeadless__` y escribe `00-indice.json`, `NN-slug.png/svg`, `opl.md`, `reporte.md` y `avisos.json` | `render:headless` (consumidor agente) | **keep** como contrato; implementación simplificable (un build estático más una página de render en lugar de Vite dev) |
| `bug-index.ts` | 17 | regenera `docs/bugs/INDEX.md` desde `src/server/bugIndex` | `bug:index` | **cut** junto con el capturador de bugs: `bug-capture-api.ts` es **un contenedor de producción** (`Dockerfile:43-47`) que escribe reportes en el repositorio. Reemplazar por *issues* |
| `deploy.test.ts` | 95 | ejecuta `deploy/deploy.sh` con *stubs* de `git`, `docker` y `curl`: espera `--wait`, confirma el SHA servido, exige 401 anónimo en `/session`, marca `-dirty` ignorando `docs/bugs/` | primer paso de `gate:refactor` | **keep** (pequeño, protege el circuito de despliegue de AGENTS.md) |

Otros scripts del directorio que no son de gobernanza, pero que **no deberían vivir
aquí**:

- `model-persistence-api.ts` (1.148 líneas) es **el servidor backend de producción**
  (`Bun.serve`, migraciones SQL `opforja_*`, rutas `/__deep-opm/{session,workspace,modelos,auth,agent,review}`;
  `Dockerfile:58-64`).
- `auth-cuenta.ts` es el CLI de cuentas. `mesa-cli.ts` (577) es el CLI `mesa pull/push`.
- `generar-*` son generadores de fixtures. `probe-agent-provider.ts` prueba el proveedor
  LLM. `generar-corpus-tutor.ts` (250) y `render-tutor-markdown.ts` (220) materializan el
  corpus del tutor desde KORA.

En la reescritura, `server/`, `cli/` y `tools/` deben separarse de las utilidades de
verificación.

### 5.1 El circuito autorreferente, explícito

```
docs/manual-opforja.md §L ──(manual-limites.test.ts)──▶ docs/roadmap/registro-conformidad-ssot.md
       ▲                                                          │
       └────── «La fila cerrada se conserva como control de no-tautología de manual-limites.test.ts» ◀┘

ui-forja/GOVERNANCE.md ──debe contener la frase──▶ "bun run design:governance" ──que verifica──▶ ui-forja/GOVERNANCE.md

quality-ledger.mjs ──exige que existan los strings──▶ "law-json-roundtrip", … en *.test.ts
                                                     (renombrar un test rompe el gate; borrar la aserción no)

corpus-documental.test.ts ──lee el texto de──▶ scripts/in-vivo-*.mjs ──que escriben──▶ test-results/…/_reporte.md
```

Ninguna de estas flechas pasa por el comportamiento del modelador.

---

## 6. `e2e/`: Playwright

### 6.1 Configuración y *lanes*

- `playwright.config.ts`: tres `webServer` (dev en `PW_PORT`; `+1` con
  `VITE_MOBILE_READONLY=true`; `+2` con `MODEL_REQUIRE_AUTH=true`), `reuseExistingServer: true`,
  `timeout 30s`, `expect 5s`, `trace: retain-on-failure`. Tres proyectos:
  - `chromium`: todo menos mobile, auth y preview.
  - `mobile`: `mobile-readonly.spec.ts`.
  - `auth`: `auth`, `revision-reader`, `revision-owner`, `refinement-proposal` y
    `reusable-pieces`.
- `playwright.preview.config.ts`: `bun run build && vite preview :4173` para
  `25-produccion-preview.preview.spec.ts`.
- `playwright.external.config.ts`: reutiliza el *webServer* desktop con
  `reuseExistingServer:false` para `amarra-*.preview.spec.ts`. Lee
  `OPFORJA_GIST_BUNDLE` y `OPFORJA_SD0_BUNDLE`.
- El backend en dev es `src/server/devModelPersistence.ts`: monta **el mismo handler
  de producción** (`crearModelPersistenceFetchHandler`) sobre `crearRepoMemoria` (sin
  Postgres) con el secreto dev
  `"deep-opm-dev-preview-session-secret-no-produccion"`; cada contexto de navegador es un
  tenant aislado. **Este diseño es bueno y conviene conservarlo.** La cuenta sembrada del
  lane auth es `CUENTA_DEV_AUTH` (`dev@opforja.local`).
- **Punto débil:** `bun run dev` ⇒ `tutor:corpus` ⇒ KORA en `/home/felix/kora-knowledge`
  (§2.2). La E2E no es reproducible fuera de la máquina del autor.

### 6.2 Helpers

- `_smoke-helpers.ts` (1.211 líneas, «extraídos de opm-smoke.spec.ts en ronda 13.0 T1.4
  steipete; movimiento mecánico»):
  - Unas 40 funciones de navegación: palette, menú, inspector y pestañas.
  - 13 fábricas de modelos JSON (`modeloMarkersCanonicos`, `modeloAbanicoLogico`,
    `modeloTransicionEstados`…), que son la mejor parte.
  - El tipo `ExportadoModelo`.
  - `jsonEditor(page)`, que lee el estado del modelo **abriendo el diálogo
    «Abrir/Importar», pulsando «Exportar» y leyendo un `textarea`**. Cada aserción sobre
    el modelo cuesta así una navegación de UI.
- Los archivos 01-08 importan entre 46 y 52 símbolos del helper cada uno (residuo del
  *split* mecánico), aunque usan pocos.
- `_colapso-helpers.ts`: abre secciones plegadas del Inspector.

### 6.3 Clasificación por valor

**A. Semántica OPM y simetría OPD↔OPL a través de la UI (núcleo; portar como
escenarios)**

| Spec | Qué protege |
|---|---|
| `02-canvas-y-render` (755) | markers canónicos de enlaces; abanicos O/XOR «sin texto de marcador»; modificadores evento/condición; subtipo NO; mover puerto; fan desde ramas; par transformador duplicado ⇒ bloqueo; auto-invocación con demora; agregación = triángulo; atributo numérico «Nombre [Unidad] {alias}» y valor en OPL; exportar PNG y ZIP |
| `03-opl-panel` (396) | OPL↔canvas sincronizados; renombrar desde OPL; edición libre con preview y conteo de cambios; ruta con coma; agrupación por OPD; selección de un enlace concreto en una oración multi-enlace |
| `05-refinamiento-y-plegado` (882) | descomponer o desplegar proceso y objeto, navegación al hijo, contención de subprocesos, quitar refinamiento, doble refinamiento, plegado parcial, **redistribución consumo→primero / resultado→último**, reanclaje manual |
| `06-undo-redo-dirty` (460) | *dirty*, undo/redo de crear, renombrar, mover, esencia, vértices y extraer partes (un solo undo), `beforeunload` |
| `07-enlaces-avanzados` (669) | multiplicidad canvas↔OPL↔JSON; estados con cápsulas; TS3 «cambia de … a …»; rutas en abanicos; *split* de efecto sin objeto sintético; bus de agregación; traer conectados; ocultar apariencia sin borrar la entidad |
| `14-canvas-fidelity`, `15-estado-ciudadano`, `16-enlaces-estados`, `24-conexion-anchor`, `29-colision-nombre`, `30-reanclaje-estructural`, `43-enlace-libre` | el estado como ciudadano de primera clase (selección, F2, reorden, borrado), extremos a estados, reglas de unicidad de nombre, conexión por *anchor* o teclado |
| `12-beta2-modo-simulacion`, `30-simulacion-numerica` | entrar, paso, correr, reiniciar y salir; decisión XOR inline; edición sellada en simulación (C-1); tabla N=5 y CSV |
| `20-opl-editor-honesto`, `28-opl-visibilidad-esencia`, `45-opl-proceso-apunte`, `document-depth` | editor OPL con grupos reconocidas/aplicables/no aplicables; filtro de esencia; OPL local vs completo |
| `25-produccion-backup` | backup JSON ⇒ reimportar ⇒ idéntico |

**B. Flujo de producto (importante; portar reducido)**: `01-carga-y-workspace`,
`04-arbol-y-pestanas`, `11-beta1-busqueda`, `11-beta1-tabla-enlaces`,
`11-beta1-validacion-metodologica`, `12-command-palette`, `15-superficie-contextual`,
`20-inspector-tabs`, `21-estado-vacio-opm`, `31-gestion-modelos`,
`32-composicion-modelos`, `33-backend-only-persistencia`, `40-taller-bottom-up`,
`41-nacimiento-apunte`, `42-gestor-dos-zonas`, `46-versiones-tutor`, `auth`,
`mobile-readonly`, `offline-document`, `sync-conflicts`, `revision-owner` y
`revision-reader`, `document-continuity`, `inspector-focus`.

**C. Funcionalidades de circunstancia (marginal; decidir con el alcance del producto)**:

- `10-capturador-bugs` (7 tests), `13-ifml-flujos-visuales` (verifica que
  **no** haya un listener `opm:nueva-cosa` en `window`, un detalle interno de migración),
  `20-biblioteca-dock` (verifica que una función **pausada no aparezca**),
  `22-responsive-review`, `23-inspector-resize`, `33-anclas-inspector` y
  `44-breadcrumb-overlap`.
- `34-centinela-drift` (401), `35-cinta-biblioteca`, `35-piezas-puerta` (249) y
  `36-puerta-anclaje-drift` (250): el anclaje.
- `40-vitrina-revision`, `45-tutor-contextual` (340), `47-mesa-exploracion`,
  `markdown-source`, `agent-opl-editing`, `agent-workbench`, `refinement-proposal`,
  `reusable-pieces`, `scenario-explanation`, `portable-reader` y las tres
  `amarra-*.preview`.

**D. Gobernanza visual o de chrome (acreción)**:

- `09-tokens-visual`: guarda PNG en `test-results/`, **sin comparar nada**; solo exige
  `pageErrors == []`.
- `12-toolbar-overflow`: exige exactamente 5 botones con labels
  `["●Sin guardar ⌃S","ObjetoO","ProcesoP","EstadoS","RelaciónR"]` y justifica el número
  con un «veredicto jobs-web-ux III.A».
- `27-visual-compliance-25-05`: `toHaveCSS("background-color","rgba(0, 0, 0, 0)")`,
  `border-top-style: none` y la ausencia de «LIVE».
- `11-dialogo-layout-regression`: el portal a `body` es válido; el resto sobra.
- En `08-mvp-alpha-residual`, la mitad son tests `HU-30.037 Esc cancela …` repetidos por
  diálogo.

### 6.4 Olores concretos

1. **16 «tests lápida»** que prueban la *ausencia* de funciones retiradas:
   - `01:132` «no expone selector de ejemplos».
   - `03:385` «no ofrece acciones de IA pendientes».
   - `04:280` «mapa del sistema retirado».
   - `08:195` «biblioteca dock pausada».
   - `10:46` «no expone FABs».
   - `12-command-palette:77` «no expone asistente, ejemplos ni plantillas».
   - `12-toolbar-overflow:94` «⋯ Más desaparece», y `:169`.
   - `15-superficie:366`, `20-biblioteca-dock:11`, `20-inspector-tabs:283`,
     `45-tutor:294` y otros.

   Congelan decisiones de producto pasadas, no conducta.
2. **Acoplamiento a CSS y tokens:** 28 `toHaveCSS` (19 en `04-arbol-y-pestanas`) y 7
   literales `rgb(...)`. Un cambio de paleta rompe tests de semántica OPL
   (`03:77` exige `rgb(238, 236, 226)` al pasar el cursor sobre un token OPL).
3. **Internos del producto en la E2E:** 16 archivos hacen
   `page.evaluate(() => import("/src/store.ts"))`, `/src/serializacion/json.ts` o
   `/src/persistencia/backend.ts`. `sync-conflicts.spec.ts` llega a hacer
   `store.setState({modeloPersistidoId, revisionBasePorModelo, dirty…})` y a construir
   un `createDocumentPersistencePort` con transporte falso **dentro del navegador**: es un
   test unitario disfrazado de E2E. Se rompen al renombrar un archivo interno.
4. **`page.route` para simular el backend** en 16 archivos, pese a que ya existe el
   backend en memoria del dev server. Hay dos mecanismos de *fake* backend.
5. **Historia incrustada en los nombres:** 192 menciones de `HU-xx`, `BUG-2026…`,
   `ronda N`, `L1..L6`, `Codex v1.1`, `steipete`, `III.A cierre`. Explican por qué nació
   el test, pero no qué comportamiento se protege.
6. **Efectos colaterales:** 41 `page.screenshot({path:"test-results/…"})` sin aserción y
   45 archivos repiten a mano el patrón `pageErrors` (un *fixture* lo haría una vez).
7. **Sin tipado:** `tsconfig.json` incluye solo `src/**` y `scripts/*.ts`. Al tipar `e2e/`
   con la misma configuración estricta aparecen **127 errores** (TS2339, TS2345, TS18048
   y TS2307 por los imports `/src/…`).
8. **Estado del modelo leído vía UI:** `jsonEditor(page).inputValue()` abre un diálogo
   cada vez. Un gancho de test de solo lectura (p. ej. `window.__opforja.exportar()` bajo
   un flag dev) o la API de persistencia en memoria sería más rápido y menos frágil.
9. **Fijación de navegador:** `@playwright/test ^1.59.1` exige el Chromium 1217 y el
   entorno trae el 1194.

### 6.5 Lo que vale la pena portar casi tal cual

- Las **13 fábricas de modelos** de `_smoke-helpers.ts:544-1130` (markers canónicos,
  abanico lógico, transición de estados, rutas en abanico, bus de agregación, consumo
  duplicado, mover puerto…). Son fixtures JSON pequeñas que ejercitan justo las
  distinciones OPM difíciles. Conviene moverlas a fixtures compartidas por unit y E2E.
- El diseño **adversarial** de `34-centinela-drift` (sin hash hardcodeado; muta la
  biblioteca persistida después de congelar) como patrón, aunque la funcionalidad se
  simplifique.
- Las aserciones de doble canal: acción en el canvas ⇒ oración OPL exacta ⇒ JSON
  exportado. Es la verificación de simetría OPD/OPL/persistencia que exige AGENTS.md.
- `mobile-readonly.spec.ts`: el invariante «ningún gesto muta el modelo» (drag, resize,
  link, tap, cambio de tab, búsqueda, pinch) es valioso y barato.

### 6.6 Resultado observado de la suite E2E (lane `chromium`, 4 *workers*)

- Corrida completa (337 tests, lanes chromium, mobile y auth): **307 passed y 30 failed
  en 14,8 min**.
- Re-ejecución de los fallidos (`--last-failed`) con los servidores ya calientes:
  6 pasan (fallos de arranque en frío: el primer test de cada lane, con 5 s de `expect`
  contra el grafo Vite frío) y **24 fallan de forma estable**. Otra re-ejecución en
  serie de `10-capturador-bugs` y `33-anclas-inspector` dio 11 de 12 fallos:
  deterministas en este entorno.
- Causas de los 24 fallos estables:

| Causa | Tests | Diagnóstico |
|---|---:|---|
| Carrera de arranque: `Ctrl+K` antes de que el editor monte sus atajos | 15 (01:132, 04:157, 07:183, 07:222, 08:58, 09:20, 10:* ×6, 33:* ×4) | `abrirMenuPrincipal`, `ejecutarComandoPalette` y `abrirCapturadorDesdePalette` pulsan `Control+k` justo después de `page.goto("/")` sin `esperarWorkbenchInicial`. El propio helper reconoce: «The editor bootstraps asynchronously … A cold Vite graph may finish after the load event.» No existe un **contrato de "app lista"** (un `data-ready` o evento) y cada spec lo resuelve (o no) a su manera |
| Acción de menú contextual no encontrada | 3 (07:497, 07:523, 07:543) | `menu.getByTestId("accion-traer-conectados").click()` agota 30 s. Probable deriva entre el helper y el menú contextual actual |
| Tolerancia geométrica | 1 (21:76) | «primera cosa queda centrada»: recibido 99 px contra `< 90`, sensible al viewport o al *timing* |
| Corpus del tutor ausente | 3 (45:11, 45:63, 45:256) | esperan `:target` y el título «Reglas OPM estrictas — SSOT prescriptiva» servidos desde `.tutor-corpus/`, que no se pudo generar sin KORA (§7.2) |
| Atajo global | 1 (10:40) | `Ctrl+Shift+B` no abre «Capturar bug» (misma carrera de arranque) |

- **Lectura.** Ninguno de los 24 fallos apunta a una regresión semántica OPM. Todos los
  specs del grupo A que dependen de la simetría OPD↔OPL↔JSON pasaron (02, 03, 05, 06,
  la mayoría de 07, 14, 15, 16, 24, 29, 30, 43, 12-simulación, 20-opl-editor), salvo
  los que se atascan en la carrera de arranque o en el menú contextual. La fragilidad
  está en la **infraestructura de la E2E**: disponibilidad, helpers de compatibilidad
  y dependencia de KORA.
- Los *shims* de compatibilidad del helper lo confirman: `LABEL_MENU_A_COMANDO`
  («Compatibilidad: los specs invocaban acciones del menú por su label visible»),
  `TOOLBAR_MAS_A_COMANDO` («Preserva la firma `clickToolbarMasItem` para no tocar los
  specs», que mapea `data-testid="toolbar-mas-*"` retirados a comandos de la paleta).
  **Los tests conservan vivo el vocabulario de una UI que ya no existe.**

---

## 7. Hallazgos de ejecución

### 7.1 Los 14 fallos de `bun test src`: orden, no PostgreSQL

- Los fallos son `componerConModeloGuardado — UX del Piso 1` (3),
  `anclarPiezaBiblioteca` (2), `cargarYEvaluarDrift` (6), `reSincronizarAnclajeEntidad`
  (2) y `soltarAnclajeEntidad` (1). Mensajes típicos: `driftMap[id]` es `undefined` en
  lugar de `"sincronizado"`, o `mensaje` = «Modelo importado» en lugar de «No se pudo
  leer la biblioteca».
- En aislamiento pasan: `bun test src/store/modelo/acciones-anclaje.test.ts` (11/11),
  `composicion-ux.test.ts` (5/5) y `bun test src/store` (389/389).
- Reproducción mínima: `bun test src/persistencia/backend.test.ts src/store/modelo` da
  14 fallos.
- Causa: `src/persistencia/backend.ts:29-35` mantiene
  `let observedSessionIdentity`, `let documentLocalIdentity = {status…}`,
  `let sessionBoundaryVersion` y `let pendingSessionRequest` a nivel de módulo.
  `backend.test.ts` los deja (p. ej. tras el caso 401) en un estado que hace que las
  acciones del store no consulten el *mock* de `fetch`. Hay estado de sesión global
  compartido entre tests y ningún `reset` exportado.
- **Lección para la reescritura:** nada de singletons de módulo con estado de sesión ni
  store global importado por los tests. Usar fábricas (`crearStore(deps)`,
  `crearCliente(fetch)`).

### 7.2 La verificación de navegador depende de KORA local

`scripts/generar-corpus-tutor.ts:52-59` lee `resolver.kora_raiz_default`
(`/home/felix/kora-knowledge`) salvo que exista `TUTOR_CANON_ROOT`, y aborta si falta.
Como `dev` y `build` lo ejecutan primero, **toda la E2E y el build dependen de esa ruta**.
Solución: el corpus del tutor debe ser opcional (degradación limpia) o venir
precompilado en el repositorio (`TUTOR_CORPUS_PREBUILT=1` ya existe para Docker).

### 7.3 Lint casi vacío

- `eslint.config.js` aplica **una sola regla** (colores literales `#hex` en `src/ui/**`) e
  ignora justo los archivos más grandes de UI: `App.tsx`, `Toolbar.tsx`, `toolbar/**`,
  `BarraHerramientasElemento.tsx` y `PanelMetodologia.tsx`.
- Además define un plugin falso `react-hooks` con `exhaustive-deps: noOpRule` para que
  los comentarios `eslint-disable react-hooks/exhaustive-deps` no fallen, junto con
  `reportUnusedDisableDirectives: false`.
- Veredicto: **simplify**. Conservar la regla de tokens sin *ignores* o reemplazarla por
  estilos centralizados, eliminar el plugin falso y agregar la frontera de capas (§3.8)
  como regla de imports.

### 7.4 Configuración de TypeScript: alta calidad

`tsconfig.json`: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
`noImplicitOverride`, `noFallthroughCasesInSwitch`, `noImplicitReturns`,
`jsxImportSource: preact`. **Keep tal cual** y añadir `e2e/**` (o un `tsconfig.e2e.json`)
al `check`. Los `.mjs` de scripts quedan sin tipar: migrarlos a `.ts` o cortarlos.

### 7.5 `bunfig.toml`

`minimumReleaseAge = 604800` (7 días, con excepción `@types/bun`) y el escáner
`@socketsecurity/bun-security-scanner` endurecen la cadena de suministro a bajo costo.
**Keep**, advirtiendo que el escáner requiere red al instalar.

---

## 8. Contratos que una reescritura debe respetar o migrar

1. **Formato persistido:** `{"formato":"deep-opm-pro.modelo.v0","modelo":{…}}`
   (`serializacion/json.ts:19`, `portablePackage.ts:9`). Todas las leyes y E2E lo usan;
   `anclaje-quietud` y `anclaje-composabilidad` lo construyen a mano:
   `hidratarModelo(JSON.stringify({ formato: FORMATO, modelo }))`.
2. **`Resultado<T>`** (`modelo/tipos/comunes.ts:14-16`):
   ```ts
   export type Resultado<T, E = string> =
     | { ok: true; value: T }
     | { ok: false; error: E };
   ```
   Idioma de todas las operaciones del kernel. `must()` en los tests.
3. **Forma completa de los tipos persistidos.** `anclaje-particion.test.ts:32-72` es, de
   hecho, el **inventario más compacto de todos los campos** de `Entidad`, `Estado`,
   `Enlace`, `Opd`, `Abanico`, `Apariencia` y `AparienciaEnlace`, con valores de ejemplo
   (p. ej. `Enlace.efectoEscindido: { grupoId, enlacePadreId, rol: "entrada" }`,
   `Enlace.derivado: { tipo: "enlace-externo-refinamiento", refinamientoId, enlacePadreId }`,
   `Opd.ordenInzoom: Id[][]`, `Apariencia.contextoRefinamiento: { tipo, refinableEntidadId, rol: "contorno" }`,
   `Abanico.decision: { modo: "uniforme", objetoId }`). Conviene usarlo como *checklist*
   de migración.
4. **Partición semántica** (`modelo/submodelos/firmaSemantica.ts:45-192`): la
   clasificación campo a campo entre significado (`firmado`) y presentación
   (`excluido`). Regla del custodio: «geometría/visual = excluido; estructura/relación/valor = firmado».
   Es la definición operativa de qué es semántica en el modelo, útil más allá del
   anclaje (diff, *dirty*, merge).
5. **Extremos de enlace:** `{ kind: "entidad" | "estado", id }`. La E2E tolera además la
   forma legacy `string` (`ExtremoExportado` en `_smoke-helpers.ts:1197`), que puede
   exigir migración al importar modelos antiguos.
6. **Procedencia de bundle:** `modelo.procedencia` con `protoHash` y otros (3 componentes
   obligatorios, `doctrinaVersion` opcional no vacío, `glosarioHash` legacy tolerado y
   descartado).
7. **API del store usada por las leyes:** `importarJson`, `aplicarEdicionOplLibre`,
   `deshacer`, `rehacer`, `puedeRehacer`, `pestanasAbiertas[].historialUndo`,
   `pestanaActivaId`, `readOnly`, `mensaje`, `modoEnlace`, `seleccionId`,
   `iniciarModoSimulacion`, `salirModoSimulacion`, `contextoSimulacion`,
   `crearObjetoDemo`, `crearProcesoDemo`, `crearEnlaceEntreEntidades`,
   `agregarEstadoSmart`, `descomponerSeleccionada`, `elegirTipoEnlace`,
   `iniciarConexionDesdeApariencia`, `cargarYEvaluarDrift`, `driftMap`; y
   `feedbackStore.overlays`. No son contrato externo, pero sí la **semántica de
   interacción** que hay que reproducir.
8. **HTTP (dev == prod handler):** `/__deep-opm/session`, `/workspace`, `/modelos`,
   `/auth`, `/agent`, `/review`, `/bug-reports` y `/healthz`. `deploy.sh` exige **401**
   anónimo en `/session` y el SHA en un asset `/assets/*.js`.
9. **CLIs de consumidor agente:**
   - `render:headless --proto|--modelo --out [--fondo] [--solo-opd] [--url] [--port]`,
     con salida `00-indice.json`, `NN-slug.{png,svg}`, `opl.md`, `reporte.md` y
     `avisos.json`, y el gancho `window.__opmRenderHeadless__` bajo
     `VITE_HEADLESS_RENDER=true` (`render/jointjs/headlessRender.ts:81`).
   - `verify:reproducible --proto|--modelo --golden [--max-diff]`, con exit 0/1/2.
   - `mesa pull/push/modelos/recuperar`.
10. **Fixtures OPL de referencia:** `docs/ejemplos/puente-vecinal.opl` (30 líneas, forma
    11/15/10) y `docs/ejemplos/lumbre-reservas.opl` (32 líneas, forma 13/16/10), con
    roundtrip estable.
11. **Fixture hermético de anclaje:** `src/leyes/_fixtures/fixture-anclaje-v0.json`
    (formato `gist-opm.fixture-anclaje.v0`), solo si el anclaje se conserva.
12. **Variables de E2E:** `PW_PORT`, `VITE_MOBILE_READONLY`, `MODEL_REQUIRE_AUTH`,
    `VITE_HEADLESS_RENDER`, `OPFORJA_GIST_BUNDLE`, `OPFORJA_SD0_BUNDLE`,
    `TUTOR_CANON_ROOT` y `TUTOR_CORPUS_PREBUILT`.

---

## 9. Olores de sobreingeniería (ejemplos concretos)

1. **Gobernanza que se vigila a sí misma:** §5.1 (manual↔registro,
   GOVERNANCE↔gate, ledger↔strings `law-*`).
2. **Actas como origen de tests:** comentarios del tipo «Acta gobernante:
   docs/auditorias/2026-06-26-acta-quietud-firma-centinela.md (iteración 3, Ley 2 …
   Ratificación HITL del custodio)». La ley depende de un documento de proceso para ser
   comprensible; el enunciado debería estar en el test.
3. **Vocabulario categorial en superficie de ingeniería:** «pinza», «mandíbula»,
   «fibras», «haz de hechos F0», «sección del cociente», «Δ/Σ», «Cost-category»,
   «pullback», «retracto split mono/epi». Parte de ello es riguroso (la ley de sección
   del in-zoom está bien pensada), pero sube el costo de lectura y de portabilidad.
4. **Tests de proceso de desarrollo:** `taller-sin-especie-nueva` («no crear una cuarta
   especie», regla de CLAUDE.md), `dependencias-unidireccionales (b)` («el *allowlist*
   está congelado en VACÍO»: un test que afirma que un array literal del propio test es
   `[]`).
5. **Duplicación de mecanismos:**
   - Tres formas de *fake* backend: `devModelPersistence` en memoria, `page.route` en
     16 E2E y `instalarBackendMock` en tests del store.
   - Dos runtimes: `node` para `in-vivo-*`, `bun` para el resto.
   - Tres generaciones de recorridos de navegador: e2e, `in-vivo-*` y `ux:eval`.
   - Dos fuentes de tokens: `ui-forja/tokens.json` y `src/ui/tokens.ts`, sincronizadas
     por un auditor.
6. **Capa de «control plane» del ecosistema** dentro del producto: `cordon-estado`,
   `cordon-skill-audit`, `src/canon/{selloSkill,resolutorUrn,doctrina}.ts` y
   `docs/canon-opm/resolutor-urn.json`. Todo existe para observar KORA y skills de
   agente, no el modelador.
7. **Dev tooling desplegado en producción:** el capturador de bugs (UI, API en su propio
   contenedor, `docs/bugs/`, `bug:index`, 7 E2E).
8. **Repetición:** 130 copias de `must()`, `entidadPorNombre` y `eid` en cada archivo;
   el patrón `pageErrors` escrito a mano 45 veces; imports masivos de helpers.
9. **E2E que prueban decisiones de maquetación** (número exacto de botones, `rgba(0, 0, 0, 0)`,
   «no LIVE»), frágiles ante cualquier rediseño, que justamente es el objetivo de la
   reescritura.

---

## 10. Estrategia de verificación recomendada para la reescritura

**Nivel 1: propiedades del kernel (`bun test`, sin DOM, < 2 s).**
- Portar el catálogo de §4 en unos **8 archivos temáticos**: `opl-lente` (1-2, 26-29),
  `serializacion` (3, 5, 21), `refinamiento` (4, 6-10, 12-13, 24), `estados` (14-15),
  `composicion` (11, 16-18), `simulacion` (19-20), `apunte` (21-23), `undo` (30).
- Conservar los **controles de no tautología** (mutantes explícitos) como convención.
- Un único `test-utils.ts` con `must`, `idPorNombre` y constructores.
- Fixtures compartidas: las 13 fábricas de `_smoke-helpers.ts`, los dos `.opl` de
  referencia y un modelo grande sintético para rendimiento.

**Nivel 2: integración sin navegador (`bun test`).**
- Store creado por fábrica, con persistencia inyectada (repositorio en memoria real, no
  `fetch` falso) para undo, *read-only* hablante y ciclo apunte→modelo.
- Arquitectura: la regla de imports por capa en lint.

**Nivel 3: E2E de flujo (Playwright, 25-40 tests).**
- Escenarios por capacidad: crear SD mínimo; enlazar (click y teclado); estados y TS3;
  in-zoom y unfold con distribución de frontera; OPL: editar, aplicar y deshacer;
  colisión de nombre; simulación con XOR; guardar, cargar y versiones; importar y
  exportar JSON/PNG; móvil de solo lectura; auth.
- Localizar **por rol accesible y nombre**, y verificar el modelo por el JSON exportado
  (gancho de lectura dev) y por el OPL visible. **Nada de CSS, tickets, conteos de chrome
  ni `import("/src/…")`.**
- Un *fixture* Playwright para `pageErrors`, `e2e/` tipado en `check` y el backend en
  memoria del dev server como único *fake*.
- El corpus del tutor no debe bloquear `dev`.

**Fuera del `test` del producto:** lint editorial de `docs/` (opcional), tablero
operativo (opcional, un comando `status`) y todo lo relativo a KORA y skills (que
pertenece a su propio repositorio).

**Gates:** `check` = typecheck (src + e2e) + `bun test` + lint. `smoke` = Playwright.
`build` + presupuesto de bundle. `deploy.test` solo al tocar `deploy/`. Se eliminan
`design:governance`, `cordon:*`, `quality:gate` (salvo el presupuesto de tamaño),
`visual:*` y `ux:eval`.

---

## 11. Veredicto keep / simplify / cut por pieza

| Pieza | Veredicto | Justificación |
|---|---|---|
| `leyes/opl-reverse` | **keep** | lente OPL segura: regla bimodal sagrada |
| `leyes/proyecciones` | keep (separar render) | roundtrip, matriz de refinamiento, retirada limpia |
| `leyes/refinamiento-cascadas` | keep | distribución de frontera (R-OPD-REF-4/11) |
| `leyes/refinamiento-frontera` + `equivalencia` | keep, fusionar | F-V1/F-V2, R-CAT-EQ-2/3 |
| `leyes/invocacion-implicita-bimodal` | **keep tal cual** | `ordenInzoom` gobierna las cuatro caras; de lo mejor del repositorio |
| `leyes/supresion-estados-aparicion`, `hechos-pegado` | keep | visibilidad de estados y pegado |
| `leyes/contencion-refinamiento` | keep | contención del in-zoom con controles |
| `leyes/simulacion-ramas` | keep | XOR, semilla, independencia |
| `leyes/simulacion-unfold` + `simulacion-modos` | simplify (fusionar) | propiedades triviales repetidas |
| `leyes/tiempo-enriquecimiento` | keep | sobretiempo con R-EXC-1A |
| `leyes/enriquecimiento-cost` | cut (o módulo opcional) | Cost-category sin uso de producto visible |
| `leyes/composicion`, `razonamiento` | keep | linealidad; inferencia marcada |
| `leyes/integracion-ss-fs` | simplify | 306 líneas de vocabulario F/S para 4 propiedades |
| `leyes/taller-{integridad-ciega,export-honesto,rigor-al-graduar,convergencia}` | keep | ciclo apunte con integridad no degradable |
| `leyes/taller-sin-especie-nueva` | cut | guardia de proceso; un tipo discriminado la vuelve innecesaria |
| `leyes/anclaje-*` (7) + `calco-anclaje-contrato` | simplify → 1 archivo, o cut con la funcionalidad | técnica excelente, funcionalidad de circunstancia; portar el patrón de partición |
| `leyes/_fixtures/fixture-anclaje-v0.json` | cut | copia cross-repo con adaptaciones manuales |
| `leyes/procedencia-staleness` | keep si se mantiene `autoria/` | contrato con goldens de hd-opm |
| `leyes/undo` | keep | atomicidad del undo OPL |
| `leyes/silencio-readonly` | keep (store por fábrica) | un bloqueo habla y no miente |
| `leyes/dependencias-unidireccionales` | simplify → regla de lint | conservar la dirección de capas, sin escribir en `src/` |
| `leyes/corpus-documental` | **cut** | lint editorial y aserciones de frases literales en docs |
| `leyes/manual-limites` | **cut** | circuito autorreferente manual↔registro |
| `leyes/manual-{sistemas,software}-opm` | simplify | conservar los `.opl` como fixtures del parser; desacoplar del Markdown |
| `e2e` grupo A (§6.3) | keep → reescribir como ~20 escenarios | simetría OPD/OPL/JSON observable |
| `e2e` grupo B | simplify → ~12 escenarios | flujos de producto esenciales |
| `e2e` grupo C | decidir con el alcance | sigue a la funcionalidad |
| `e2e` grupo D y los 16 tests lápida | **cut** | congelan maquetación y decisiones pasadas |
| `e2e/_smoke-helpers.ts` | simplify | conservar las fábricas de modelos; reemplazar `jsonEditor` por un gancho de lectura |
| `e2e/amarra-*.preview` + `playwright.external.config.ts` | cut (o repositorio del dominio) | dependen de bundles externos |
| `playwright.config.ts` (3 lanes) | simplify | mobile y auth como proyectos con `webServer` propio, o flags por test; conservar el backend en memoria |
| `playwright.preview.config.ts` | keep | smoke del build real |
| `scripts/deploy.test.ts` | keep | protege el circuito `deploy.sh` |
| `scripts/verify-reproducible*` | keep | CLI pequeño para el consumidor |
| `scripts/render-headless*` | keep (simplificar implementación) | «ojos» del agente consumidor |
| `scripts/quality-ledger.mjs` | simplify → presupuesto de bundle | quitar el conteo de `law-*` y los *compat detectors* |
| `scripts/design-governance-audit*` | cut (tokens de fuente única) | frases en docs, versiones en 5 archivos |
| `scripts/cordon-skill-audit*` + `src/canon/selloSkill.ts` | cut | skill del agente, no producto |
| `scripts/cordon-estado*` | cut (o `status` mínimo) | *control plane* del ecosistema |
| `scripts/in-vivo-*` (3) | cut | sondas ad hoc sin gate, IP fija, duplican e2e |
| `scripts/evaluacion-ux-permanente*` + `fixtures-ux-regresion` | cut | recorrido duplicado; su test solo prueba el reporte |
| `scripts/bug-index.ts` (+ capturador) | cut | tooling de desarrollo desplegado |
| `scripts/model-persistence-api.ts`, `auth-cuenta.ts`, `mesa-cli.ts` | mover (`server/`, `cli/`) | no son scripts de verificación |
| `tsconfig.json` | keep + incluir `e2e/` | flags estrictos de alta calidad |
| `eslint.config.js` | simplify | una regla con *ignores* estratégicos y un plugin falso |
| `bunfig.toml` | keep | endurecimiento de supply chain |
| `gate:refactor` | simplify | de 8 pasos a `check` + `smoke` + `build` |
