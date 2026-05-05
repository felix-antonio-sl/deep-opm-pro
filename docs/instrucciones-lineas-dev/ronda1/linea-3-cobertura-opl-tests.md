# Línea 3 — Cobertura de tests OPL-ES por tipo de enlace canónico

## 1. Misión

`app/src/opl/generar.ts` (154 líneas) genera oraciones OPL-ES a partir del modelo. Hoy `generar.test.ts` existe pero su cobertura por tipo de enlace canónico es desconocida — y las líneas L1 (despliegues estructurales) y L4 (timeline + paralelismo) van a extender este archivo en paralelo. Sin red de tests previa, cualquier regresión va a pasar silenciosa.

Esta línea **no añade features**: añade tests que fijan el comportamiento actual de OPL-ES por cada tipo de enlace canónico ya implementado, contra las plantillas SSOT. Es la **red de seguridad** que permite mergear L1 y L4 con confianza.

**Bonus**: si en el camino se descubren bugs (plantilla incorrecta, tokenización mal hecha, orden de cláusulas inestable), corregirlos con commits separados y test que evidencia el bug previo.

## 2. HU base (lectura obligatoria antes de codificar)

| HU | Path | Aporta |
|---|---|---|
| HU-SHARED-007 | `docs/historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md` | Contrato canónico de eco OPL: bidireccionalidad, tokenización, orden |
| HU-50.001..50.028 | `docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Panel OPL: render, numeración, plantillas absorbidas en SHARED-007 |
| HU-12.012, 12.013, 12.014 | `docs/historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md` | Plantillas "se descompone en", "en esa secuencia", verbos de refinamiento |
| HU-12.017 | (mismo archivo) | Plantilla "en paralelo" para subprocesos en misma Y |

**Plantillas canónicas**: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md` — referencias `[OPL-ES T1]`, `[OPL-ES T2]`, `[OPL-ES T3]`, `[OPL-ES D1]`, `[OPL-ES D8]`, `[OPL-ES TS1]`, `[OPL-ES CX1]`, `[OPL-ES CX2]`, `[OPL-ES CX3]`. Estas son la fuente de verdad. Todo OPL emitido por `generar.ts` debe coincidir con una plantilla SSOT (o documentar la divergencia).

## 3. Anclaje a evidencia

- **SSOT plantillas**: `opm-opl-es.md` (path arriba). Buscar por marcadores `[OPL-ES Tx]` y `[OPL-ES Dx]`.
- **OPCloud (lectura)**: `opm-extracted/_raw/` — buscar implementaciones de generadores OPL. Específicamente: `rg "consumes|results|affects|exhibits|specializes|aggregates" opm-extracted/`.
- **Estado actual**: leer `app/src/opl/generar.ts` íntegro. Mapear qué tipos de enlace genera y con qué plantilla. Inventariar gaps vs. SSOT.
- **Tests existentes**: leer `app/src/opl/generar.test.ts` íntegro. Identificar qué ya cubre y qué falta.

## 4. Archivos permitidos (scope estricto)

```
app/src/opl/generar.test.ts                  ← MAJOR — agregar bloques por tipo de enlace
app/src/opl/generar.ts                       ← SOLO si encontrás bug; cambio mínimo y documentado
```

**Lectura permitida** (para construir fixtures de test):
- `app/src/modelo/operaciones.ts`: para construir modelos válidos en setup de tests.
- `app/src/modelo/tipos.ts`: para conocer la forma de los tipos.

**Prohibido**: tocar `app/src/modelo/*` (excepto lectura), `app/src/ui/*`, `app/src/render/*`, `app/src/store.ts`, `app/src/persistencia/*`.

## 5. Restricciones de no-colisión

1. **No tocar `generar.ts` salvo bug**. Si encontrás bug:
   - Primer commit: agregar test que fallar (rojo).
   - Segundo commit: arreglar `generar.ts` (verde).
   - Mensaje de commit: `fix(opl): <descripción del bug>`.
2. Los tests que agregues NO deben colisionar con los que L1 va a sumar (cobertura para `exhibicion`/`generalizacion`/`clasificacion`). Si tu inventario detecta que esos casos ya existen hoy, dejarlos a L1.
3. Los tests deben ser **deterministas**: usar IDs fijos en setup, no `crypto.randomUUID` en assertions.

## 6. Slice mínimo shippeable

Tests que cubren las plantillas SSOT actualmente implementadas en `generar.ts`. Inventario mínimo (verificar contra el código actual):

### Por tipo de enlace canónico actual
- **`agregacion`**: `*Todo* consta de *Parte1*, *Parte2* y *Parte3*.`
- **`agente`**: `*Agente* maneja *Proceso*.` (verificar verbo exacto)
- **`instrumento`**: `*Proceso* requiere *Instrumento*.`
- **`consumo`**: `*Proceso* consume *Cosa*.`
- **`resultado`**: `*Proceso* produce *Cosa*.` o `*Proceso* genera *Cosa*.` (verificar)
- **`efecto`**: `*Proceso* afecta *Cosa*.`
- **`invocacion`**: verificar plantilla en `generar.ts`.

### Por mecanismo de refinamiento
- **Descomposición de proceso (existente)**: `*Padre* se descompone en *SubA*, *SubB* y *SubC*, en esa secuencia.` cuando hay orden Y.
- **Despliegue de objeto (existente, agregación)**: `*Objeto* se despliega en *Parte1*, *Parte2* y *Parte3* como partes.` o variante; verificar.

### Casos de orden y agrupación
- Orden por `apariencia.y` ascendente (luego `x` como desempate).
- "en esa secuencia" cuando todos los subprocesos tienen `y` distintos.
- "en paralelo" cuando dos o más subprocesos comparten `y`. **Si esto NO está implementado, no agregar test rojo — dejar TODO documentado y delegar a L4**.

### Casos de borde
- Modelo vacío → OPL vacío.
- OPD activo distinto del raíz → sólo emite oraciones del OPD activo.
- Entidad sin enlaces → su declaración (`*X* es un objeto.` o similar) sale igual.

### Forma de assertion
- Comparar **string exacto** de la oración (incluyendo asteriscos de tokenización).
- Si el orden de las cláusulas dentro de una oración no es determinista, **eso es un bug** — registrar y arreglar.

## 7. Tests obligatorios — esqueleto sugerido

```ts
import { describe, it, expect } from "bun:test";
import { generar } from "./generar";
import { crearModelo, crearObjeto, crearProceso, crearEnlace } from "../modelo/operaciones";
// ... etc.

describe("OPL-ES — tipos de enlace canónicos", () => {
  it("agregacion emite 'consta de'", () => { /* ... */ });
  it("agente emite '<verbo>'", () => { /* verificar verbo SSOT */ });
  // ...
});

describe("OPL-ES — descomposición de proceso", () => {
  it("emite 'se descompone en' con secuencia ordenada por y", () => { /* ... */ });
  it("emite 'en paralelo' con subprocesos en misma y", () => {
    // Si está implementado: assertion exacta.
    // Si NO: skip con TODO comment apuntando a L4.
  });
});

describe("OPL-ES — despliegue de objeto (agregación)", () => {
  it("emite 'se despliega en … como partes'", () => { /* ... */ });
});

describe("OPL-ES — bordes", () => {
  it("modelo vacío produce OPL vacío", () => { /* ... */ });
  it("OPD activo distinto al raíz filtra correctamente", () => { /* ... */ });
});
```

Adaptar la firma exacta de `generar` y los helpers según la API real. Si hace falta un helper de fixture de modelo, ponerlo dentro del mismo `generar.test.ts` (no crear archivos auxiliares por ahora).

## 8. Verificación

```bash
cd app
bun run check          # typecheck + unit tests OBLIGATORIO verde
bun run test src/opl   # foco en los nuevos
```

Cobertura mínima exigida: **al menos un test por cada tipo de enlace en la unión `TipoEnlace` actual + dos tests para refinamiento (descomposición y despliegue) + un test de borde**. Total esperable: 10-15 tests nuevos.

## 9. Decisiones bloqueadas (no reabrir)

- Tests usan **string exacto**. Razón: snapshots dinámicos enmascaran cambios sutiles.
- IDs en setup son **fijos** (`obj-1`, `proc-1`, etc.) si la API lo permite, o se construyen con helpers que retornan IDs y se interpolan en la assertion.
- Cualquier bug encontrado se corrige en commit separado con `fix(opl): ...`.

## 10. Decisiones que tomás vos (documentar en commit)

- Si existe un fixture de modelo en `app/src/opl/generar.test.ts` actual, reusarlo. Si no, escribir el más pequeño que cubra el caso.
- Si encontrás divergencia entre `generar.ts` y SSOT que no es claramente bug (ambigüedad), abrir TODO y elegir SSOT como referencia para el test (pasará rojo, será información valiosa para Felix).

## 11. Forma del entregable

- Commits separados:
  - `test(opl): cobertura por tipo de enlace canonico` (verde, todo aditivo).
  - `fix(opl): <bug>` + `test(opl): regresion <bug>` si correspondiera (rojo→verde).
- Co-author footer estándar.
- No tocar HU ni HANDOFF.
