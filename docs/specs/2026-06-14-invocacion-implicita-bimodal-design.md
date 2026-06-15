# Invocación implícita bimodal — diseño (R-INV-2B vs M23)

Estado: diseño aprobado (brainstorming + panel deliberativo ratificado por el operador, 2026-06-14).
Alcance de este documento: **Fase 1** (capacidad en opforja). Las Fases 2 (corpus) y 3 (migración HODOM) se resumen para contexto y tendrán su propio spec→plan.

## 1. Problema

En un in-zoom de proceso, el orden de ejecución de los subprocesos tiene hoy **tres portadores simultáneos** en los modelos generados por el compilador de autoría (caso testigo: HODOM):

1. enlaces de invocación **explícitos** entre hermanos (decisión de Mesa **M23**; regla local **R22-3** que los mantiene «porque son la única realización textual del orden»);
2. la **banda Y** (geometría), que `autoria/layout.ts` deriva del nivel topológico de esas invocaciones;
3. la oración OPL **«en paralelo… en esa secuencia»**, que `generadores/refinamiento.ts` deriva de la banda Y.

Eso produce la **doble vara**: el rayo dibujado + la verticalidad expresan el mismo hecho, lo que **viola R-INV-2B** del corpus (`reglas-opm-estrictas-es §5.4`): *«en invocación implícita NO DEBE dibujarse enlace explícito»*.

**Causa raíz** (verificada en código): no hay conflicto de doctrina. R-INV-2/2A/2B/2C ya hacen el orden secuencial/paralelo **implícito por mandato** y prohíben dibujarlo. El problema es una **brecha de herramienta**: opforja v0 solo sabe derivar el OPL del orden desde enlaces de invocación **explícitos**, y la premisa de R22-3 («el rayo es la única realización textual») es **factualmente falsa** — `refinamiento.ts:150` ya deriva «en esa secuencia» de la geometría, no del enlace.

## 2. Dictamen del panel (frontera implícito/explícito) — RATIFICADO

Panel deliberativo en modo orquestación: `dov-dori` (semántica OPM), `cat-thinking`/polymath (estructura categorial), `custodio-kora` (coherencia de corpus). Consenso ratificado por el operador.

| Caso | Clase | Realización |
|---|---|---|
| 1 secuencial 1→1 · 2 paralelo misma altura · 3 AND-join síncrono total | **IMPLÍCITO** | campo de orden (bandas con cardinalidad); OPL «en paralelo… en esa secuencia»; sin rayo. R-INV-2/2A/2C + R-CX-SYNC-1 |
| 4 reactivo por evento (LF-06) | **EXPLÍCITO — enlace de *evento*, no rayo** | error de categoría tratarlo como invocación; ya tiene portador (oración de evento); fuera del campo de orden. R-OPD-INV-3 |
| 5 autoinvocación/bucle · 7 salto fuera de orden · 8 cross-OPD | **EXPLÍCITO (rayo IV1/IV2)** | única realización honesta; sobreviven. R-OPD-INV-1/4; R-INV-1 |
| 6 demora | **DISUELTO** | no existe «demora sobre invocación implícita» (verificado en SSOT `metodologia-opm-es.md:784` + OPCloud `opm-extracted`: la duración es propiedad del proceso, `getDurationManager().getTimeDuration()`). Espera intra-secuencia ⇒ subproceso **«Esperar N»** reificado (implícito); `después de N` solo cuelga de un rayo ya-explícito (R-OPD-INV-5) |
| join parcial / disyuntivo (OR) | **fuera de alcance** | es abanico/decisión con realización explícita propia; el campo de orden simple no lo cubre y no se fuerza |

Condición estructural unánime: el campo de orden es **secuencia de bandas con cardinalidad** (`Id[][]`), nunca lista plana (pierde el join) ni matriz de pares (invariante O(N²) — la deuda categorial del repo).

## 3. Decisión de representación

`Opd.ordenInzoom?: Id[][]` en el **OPD hijo de descomposición**. Secuencia de bandas; cada banda es el conjunto de entidadIds de subprocesos en paralelo. Ejemplo (M1.3):

```
[[o.eval-medica, o.eval-enfermeria, o.eval-prof], [o.consolidacion], [o.educacion]]
```

- El orden es **atributo de la descomposición**, no relación entre pares ni coordenada (mejora R-IDP-0A: el orden es declarado; la coordenada Y lo *realiza*, no es su fuente).
- **Opcional** ⇒ retrocompatible: ausente = fallback al comportamiento actual (banding por topología de invocaciones + OPL desde geometría). Ningún modelo existente se rompe; el golden hd-opm sigue byte-idéntico hasta la Fase 3.

## 4. Diseño de la Fase 1 — 7 unidades

### U1 · Modelo + serialización
- `modelo/tipos/opd.ts`: añadir `ordenInzoom?: Id[][]` (vecino de `ordenLocal`).
- `serializacion/validarOpds.ts`: validar que cada Id existe y es un subproceso (interno de descomposición) del OPD; sin duplicados; cobertura = subconjunto de los subprocesos (los no listados caen a fallback). Rechazo ruidoso si un Id no es subproceso del OPD.
- `serializacion/json.ts`: hidratación retrocompat (ausente ⇒ `undefined`).
- **Interfaz:** dato puro del modelo; sin dependencias de render ni OPL.

### U2 · Layout (`autoria/layout.ts`)
- Extender el gancho existente `ordenInzoom: Map<Id, Id[]>` → `Map<Id, Id[][]>` (bandas con cardinalidad).
- Leerlo de `opd.ordenInzoom` (no solo del DSL `Autor`).
- Presente ⇒ banda Y por índice de banda; misma banda ⇒ misma Y (paralelos). Ausente ⇒ `nivelTopologicoInvocacion` (fallback intacto).
- **Dependencia:** U1.

### U3 · OPL forward (`generadores/refinamiento.ts`)
- `describirProcesosTemporales`: si `opd.ordenInzoom` presente, derivar las bandas de él; si no, agrupar por Y (actual). Misma oración de salida.
- **Invariante:** OPL(campo) == OPL(geometría equivalente) — defendido por ley en U7.
- **Dependencia:** U1.

### U4 · OPL reverse (`parser/parsear.ts`, `planificar.ts`, `aplicar.ts`)
- Cerrar `GAP-CX-PARSER`: parsear «… se descompone en [paralelo] A, B y C, D, en esa secuencia …» → reconstruir las bandas → patch nuevo `set-orden-inzoom` que setea `opd.ordenInzoom` del refinamiento **existente** (no crea ni borra refinamientos — eso sigue siendo gesto de canvas, según `parsear.ts:1157`).
- **Dependencia:** U1, U3 (simetría).

### U5 · Diagnóstico (kernel, NO render)
- Checker permanente en `src/modelo/` (diagnóstico tripartito): **«invocación redundante con orden de descomposición»** — un enlace de invocación entre subprocesos que el `ordenInzoom` ya expresa como transición de banda adyacente es doble vara y viola R-INV-2B. Nuevo AP (numeración a coordinar con el corpus en Fase 2).
- Severidad: a decidir (propuesta: **mejora** mientras coexistan modelos legacy; **bloqueo** tras Fase 3). El render **no se parchea** (sigue dibujando lo que existe); la ley vive donde está la verdad.
- **Dependencia:** U1.

### U6 · Simulación (`modelo/simulacion/fases.ts`, runner)
- El runner deriva el flujo secuencial del `ordenInzoom`: siguiente paso = siguiente banda; **AND-join** = esperar a toda la banda previa (R-CX-SYNC-1). Los enlaces explícitos legítimos (5/7/8) siguen disparando como hoy (`TIPOS_RESULTADO` los conserva).
- Garantiza que retirar los rayos implícitos en Fase 3 **no regresiona** la simulación de descomposiciones secuenciales.
- **Dependencia:** U1.

### U7 · Pruebas (`leyes/`, `opl/.../roundtrip.test.ts`, fixture)
- Fixture estricta CX1 (secuencia), CX2 (paralelo), CX-mixta (paralelo dentro de secuencia) con `ordenInzoom` y **sin** enlaces de invocación → roundtrip forward→reverse→forward idéntico sobre `ordenInzoom`.
- Ley: `layout(ordenInzoom)` produce las bandas correctas.
- Ley de compat: `OPL(campo)` == `OPL(geometría equivalente)`.
- Test sim: flujo desde campo == flujo desde enlaces equivalentes.

## 5. Retrocompatibilidad y gate
- Todo opcional y aditivo. HODOM **no se toca** en Fase 1 ⇒ golden hd-opm byte-idéntico (usa enlaces → fallback).
- Gate: `bun run check` (typecheck + unit) + roundtrip nuevo verde + `bun run gate:refactor` antes de cerrar.

## 6. Riesgos (heredados del panel)
- **Falso verde / pérdida silenciosa (BLOQUEANTE de orden):** retirar rayos antes de cerrar U4 (reverse) degrada la bimodalidad en reverse aunque el forward pase. Orden obligatorio: U1 → U3 → U4 (+fixture) → (Fase 3 retira) → re-pin. No invertir.
- **Migración con guard (Fase 3):** retirar solo enlaces entre bandas adyacentes en orden descendente sin salto; preservar 4/5/7/8. Un salto/cross-OPD que casualmente apunte hacia abajo NO se retira.
- **AND-join parcial:** si en HODOM hay joins parciales/heterogéneos, salen del campo (abanico explícito). Verificar en la migración.
- **Re-pin del golden (Fase 3):** diff no vacío deliberado (desaparecen enlaces invocación hermano→hermano); documentar para no disparar alarma en `verify:reproducible`/H2.

## 7. Fases siguientes (contexto, spec propio)
- **Fase 2 (KORA):** nota de frontera (8 casos) en `reglas §5.4`; espejo en `spec-forja-opd §8.1`; cerrar `GAP-CX-PARSER` + `GAP-FIXTURE-DESCOMPOSICION` en `spec-forja-opl §7.1`; aclarar `R-IDP-0A` (orden declarado, coordenada lo realiza).
- **Fase 3 (hd-opm):** retirar rayos redundantes (guard), poblar `ordenInzoom`, reificar «Esperar N» donde haya demora intra-secuencia, preservar 4/5/7/8, **derogar R22-3**, re-pin gobernado del golden, re-importar/re-sellar en opforja.

## 8. Trazas de evidencia
- Corpus: `reglas-opm-estrictas-es.md` R-INV-1..2C (L853-858), R-IDP-0A; `spec-forja-opd-es.md` §8.1 R-OPD-INV-1..5 (L404-408); `spec-forja-opl-es.md` §7.1 CX1/CX2/mixta + GAP-CX-PARSER (L1250-1267); `metodologia-opm-es.md:784` («Esperar»), §861-863 (duración propiedad).
- OPCloud: `opm-extracted/_raw/81330.js:1147` (Time Duration), `84072.js:1191` (getDurationManager), `84072.js` (enlaces de tiempo: solo Overtime/Undertime/Invocation; sin delay/wait).
- opforja: `autoria/layout.ts:57-63,122,471-500` (gancho ordenInzoom + nivelTopologicoInvocacion); `generadores/refinamiento.ts:92-102,150,249-261` (OPL desde geometría); `parser/parsear.ts:1139,1157` (GAP-CX-PARSER); `modelo/simulacion/fases.ts:21` (TIPOS_RESULTADO); `modelo/tipos/opd.ts` (ordenLocal vecino).
