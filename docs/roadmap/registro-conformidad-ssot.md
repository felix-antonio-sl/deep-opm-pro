# Registro de conformidad SSOT (R-CONF-7)

Registro vivo exigido por **R-CONF-7** (`reglas-opm-estrictas-es` v1.3.1, decisión
HITL 2026-06-11): toda regla DEBE de la SSOT sin implementación vigente queda
aquí **declarada** como programada (con destino) o como enmienda propuesta a la
spec propietaria. La brecha silenciosa está prohibida. Las reglas DEBE con
tráfico en el ciclo activo (export canónico, OPL aguas abajo, render para
skills) no se programan: son deuda exigible y viven en los cortes de
remediación.

**Cobertura declarada**: este registro nace del barrido 2026-06-11 sobre las
brechas conocidas — auditoría integral (`docs/auditorias/2026-06-11-…`),
violaciones V-1..V-8 del backlog contingencial y familia de export. No es una
re-auditoría línea-por-línea de la SSOT; cada auditoría futura que descubra una
brecha DEBE nueva la añade aquí o la cierra en el corte donde se encuentre.

**Mantenimiento**: el corte que cierra una fila la marca CERRADA con commit; lo
implementado o superado se elimina en el siguiente saneo (la historia git es la
red de recuperación, política de `docs/auditorias/README.md`).

## Declaraciones vigentes

| Regla / familia | Exigencia | Estado | Declaración R-CONF-7 |
|---|---|---|---|
| R-VIS-EXP-2 / R-OPD-CAN-1 (perfiles `canon-diagrama`/`canon-documento`) | DEBE declarar ambos perfiles | **CERRADA 2026-06-11** (`3a2db18c`) | Implementada: `serializacion/perfilesExport.ts` + gate de densidad + documento canónico en paleta. |
| R-VIS-EXP-1/3/4/6 (canon = lo que persiste en export; UI transitoria fuera) | DEBE (definicionales) | Cubiertas por diseño | Implementadas por construcción: el filtro de perfil excluye extensiones meta; capturas de canvas no son evidencia de canonicidad (sin superficie que las trate como tal). |
| R-VIS-EXP-5 (elemento persistente solo en un perfil ⇒ atributo de perfil) | DEBE | **CERRADA 2026-06-12** | `ATRIBUTOS_DE_PERFIL` en `perfilesExport.ts` — declaración ejecutable (el filtro de perfil la consume como única fuente): `satisfaccionesRequisito` y `procedencia` son atributos del perfil `canon-documento`, con test que verifica la exclusividad. |
| R-VIS-EXPORT-1A..1E (V-226..V-235) | DEBEN | **CERRADA 2026-06-12** (verificación formal) | Veredicto por regla: **V-226** defaults declarados (`PERFIL_DEFAULT_DIAGRAMA`/`_DOCUMENTO`). **V-227** sin chrome: grid y toasts viven fuera del SVG (verificado); halos de selección y capa joint-tools se REMUEVEN del SVG exportado (`removerChromeEdicionSvg`, balanceo de grupos). **V-228** rótulos en ink, cromatismo en bordes/decoraciones (tokens Codex). **V-229/V-230** estructura de `canon-documento` declarada en `emitirDocumentoCanonico`; markdown no cromático. **V-231** export parcial identificado (título `modelo — OPD` en OPL por OPD; nombre de archivo en PNG por OPD). **V-232** el documento canónico porta procedencia → referencia recuperable al modelo completo. **V-233** el PNG deriva del SVG a dimensiones de contenido reales (dash/contornos preservados). **V-234** encuadre por `getContentBBox` + padding (sin recorte de símbolos). **V-235** fondo blanco = capa documental declarada (opción); el canal de simulación (`sim-*`/`data-opm-sim`) se CONSERVA deliberadamente: export con simulación activa = snapshot de simulación declarado (R-OPD-SIM-6), coherente completo. |
| R-OPD-HAB-4 (R-ROL-UNIC-1, R-PREC-1..3) — unicidad de rol por par objeto-proceso | DEBE | **CERRADA 2026-06-12** (núcleo editor) | `crearEnlace` rechaza el rol doble (transformado vs habilitador, R-ROL-UNIC-1) y el duplicado exacto; los derivados del refinamiento no cuentan como rol declarado. Los transformadores duplicados planos sin abanico los acusa el checker `PAR_TRANSFORMADOR_DUPLICADO` (las ramas se agrupan DESPUÉS de crearse — R-PREC-1/3 gobiernan recomposición, no edición). Residuo: la recomposición por fuerza semántica §6.5/§6.6 (R-OPD-REF-13) pertenece al corte de out-zoom/plegado (fila out-zoom). Fixtures SD Async corregidos: co-aparición del enlace global por OPD en vez de duplicarlo. |
| V-4 — proceso de manejo de excepción sin validar afiliación ambiental | DEBE | **CERRADA 2026-06-11** | R-EXC-1A en la firma (`validarFirmaEnlace`): excepción temporal exige manejo ambiental — gatea creación, DSL e import (precedente modificadores). Roundtrip reverse verificado sano (el aplicador crea afiliaciones en fase 1, enlaces en fase 2). |
| V-5 — efecto a objeto sin estados: solo checker blando | DEBE (el editor restringe) | **CERRADA 2026-06-11** | Guard R-OPD-EST-3 en `crearEnlace` (el editor restringe; el import legacy hidrata y el checker acusa el residual). `ssotRef` del checker corregido a R-OPD-EST-3. Fixtures de producto SD Sync/Async corregidos a canónicos. |
| V-6 — afiliación no heredada por cadena estructural en render | DEBE | **CERRADA 2026-06-11** | `esAfiliacionEfectivaAmbiental` (kernel puro, `modelo/afiliacionEfectiva.ts`): herencia por cadena de exhibición consumida por el composer de entidad — atributo de cosa ambiental se renderiza discontinuo (R-OPD-STR-13). |
| V-8 — `normalizarColoresSvg` descarta alfa en export SVG | DEBE (fidelidad de export) | **CERRADA 2026-06-11** | La normalización solo colapsa el caso opaco (alfa=1) a `rgb`; el alfa semántico (<1, p.ej. sombra de esencia física 0.68) se preserva. |
| V-7 — deriva documental §18.2 (dashes/pin current) | — | **CERRADA 2026-06-11** (enmienda) | Enmendada en KORA: `spec-forja-opd-es` v1.0.4 (commit `017dc1b9`) reconcilia §18.2 (dashes del canal runtime), §18.3 (current declarado `●` vs anillo de runtime) y R-OPD-SIM-2 (anillo crimson sobre cápsula; pin gota solo para inicial) con la realización vigente, verificada contra `composers/halos.ts`/`enlace.ts`/`entidad.ts`. |
| Out-zoom (mecanismo de refinamiento OPM) | Canónico en SSOT | **PROGRAMADA** | Sin superficie de autoría (oportunidad anotada: reutilizar `equivalencia/`). Declarado como capacidad no implementada; no hay modelo productivo que lo demande aún. |
| GAPs §22 `spec-forja-opd-es` (GAP-OPD-UIFORJA-08*) | varios | **PARCIAL** | Mitad documental CERRADA 2026-06-12 (auditoría de coherencia del corpus): `ui-forja/08-jointjs-styling.md` reconciliado por remisión y `GOVERNANCE.md` elevado a v1.2 con `spec-forja-opd-es` en su cadena de precedencia (R-§25-MIG-2 cumplida en lo documental). Residual: realización en código (estado-pill, marcadores exhibición/instancia, straight-only) — backlog frente #4. |

## Cerradas por la remediación 2026-06-11 (referencia)

V-1 (modificadores `c`/`e` en kernel+import), V-2 (AP-04), «puede ser» fuera del
parseo de estados, pérdidas silenciosas del reverse con diagnóstico, gate de
densidad cableado a `validarModelo`, linealidad con exención XOR, TAGGED-ITALIC,
`Pr = p` (commits `58b752e5`, `2766eb74`, `1f88c69a`, `2cd26a3d`).

## Mapeo de gates del Anexo C categorial (delegado por `reglas-opm-estrictas-es`)

`reglas-opm-estrictas-es` Anexo C (R-CAT-*) declara las reglas en forma agnóstica
y delega aquí la identificación concreta de cada gate ejecutable (R-ANEXO-CAT-0,
conforme a R-APP-0/R-APP-1: el canon no incrusta nombres de archivos/funciones de
la app). Mapeo regla → gate verificable:

| Regla (Anexo C) | Gate ejecutable | Ubicación |
|---|---|---|
| R-CAT-LIN-2 (conflicto de linealidad) | `law-composicion-respeta-lineal` | `app/src/leyes/composicion.test.ts` · `app/src/modelo/composicion/linealidad.ts` |
| R-CAT-EQ-2 (equivalencia por firma de frontera) | `verificarEquivalencia` | `app/src/modelo/equivalencia/{verificar,index}.ts` · `app/src/leyes/equivalencia.test.ts` |
| R-CAT-EQ-3 (in-zoom ↔ out-zoom preserva frontera) | checker `DESCOMPOSICION_NO_PRESERVA_FRONTERA` | `app/src/modelo/diagnosticoSeveridad.ts` · `app/src/modelo/checkers-preservacion-frontera.test.ts` |
| R-CAT-COMP-2 (composición: 4 propiedades) | `law-composicion-{no-duplica,sin-refs-colgantes,asociativa,bien-tipada}` | `app/src/leyes/composicion.test.ts` · `app/src/modelo/composicion/componer.test.ts` (2 de las 4 viven aquí) |

## Enmienda del corpus 2026-06-14 — paquete deliberado de la auditoría de coherencia

Auditoría de coherencia del corpus (`docs/auditorias/2026-06-12-auditoria-ssot-corpus.md`),
paquete-pausa deliberado en panel (dov-dori × polymath/cat-thinking × custodio-kora) y
arbitrado por el operador. Materializado en KORA — `reglas-opm-estrictas-es` **v1.4.0**,
capas base y specs co-enmendadas. Decisiones implementadas (sin pendientes ejecutables):

| Decisión | Materialización en SSOT |
|---|---|
| Excepción = 6.ª familia de enlace | `reglas §5.1` (familia 4), `R-EXC-1B`; co-enmiendas `opm-iso §Control`, `opm-visual §4.4`, `spec-opl §5.3`, `spec-opd §scope` |
| Partición plantillas OPL (gate vs superficie) | `reglas §Mapa de familia` (reglas conserva tablas como gate R-BI-TAB-1; spec-opl dueña de superficie; desempate: manda reglas) |
| Abanicos convergentes de habilitadores | `reglas §7.2/§7.3` (`R-FAN-HAB-1`, AND por defecto), co-enmiendas `opm-visual §5.5`, `opm-opl §11.2` |
| `Pr=p` DEBE + modo «probabilístico sin pesos» | `reglas §6.8`, `R-FAN-PROB-1` (casos A/B/C; procedencia `metod-opm §10.14`) |
| Ruta sobre habilitadores: doctrina única | `reglas §11.2` (fila retirada) + `§4.12 R-OPL-RUTA-3` (domicilio único); `spec-opl §8.3/§8.4` alineados |
| R-NOM-PROC-1 ampliada a deverbal es-CL | `reglas §3` R-NOM-PROC-1 (criterio deverbal, no lista de sufijos; checker B-6 = realización) |
| Mecánicos | `§9.2` plantillas exactas (R-BI-TAB-1), `§6.5` alcance recomposición, `R-CONF-7` sin sello fechado, `R-ROT-4`→`SSOT-visual §20.1`, Anexo C agnóstico + este mapeo, `R-INV-2C` (grupo paralelo) |

**#24-2 — RESUELTO 2026-06-14 (decisión del operador)**: grid de edición **inactiva
por defecto**. El código se alineó a lo que `ui-forja/08` ya prescribía (`drawGrid:false`):
`app/src/canvas/grid.ts` `GRID_DEFAULT.activa` `true → false`. `spec-opd R-OPD-UI-6`
ya delegaba el default a ui-forja (sin cambio); la grid sigue configurable por usuario
y suprimida en export. El paquete-pausa queda **sin brechas vivas**.
