# Apuntes desatendidos + Taller bottom-up de primera clase — diseño (Corte B′)

**Fecha:** 2026-07-06 · **Estado:** diseño para aprobación del operador · **Doctrina:** resuelta por el operador-custodio 2026-07-06 (`docs/solicitudes-upstream/2026-07-06-taller-bottom-up-doctrina.md`, opción (a): bottom-up de primera clase, graduación apunte→modelo conservada).

## 1. Función esencial

Bosquejar OPM **sin ceremonia**: abrir una hoja y trazar, sin nombrar, sin carpeta, sin SD exigido, con fragmentos sueltos legítimos — y que cada bosquejo tenga **camino de ascenso** (fragmento→modelo, hoja→modelo) cuando madure. El rigor se cobra al graduar, no al explorar.

## 2. Granularidad del apunte (la decisión de empaquetado)

**Unidad de bosquejo = la HOJA: un apunte = un record de persistencia** (el `esApunte` existente). No se crea ninguna especie contenedora nueva.

- **Por qué hoja y no cuaderno-entidad**: la hoja reusa TODO lo construido — autosave, versiones, pull/push del puente, degradación por especie, exclusión mutua, graduación por toggle. Un «cuaderno» como entidad agregaría una tercera especie contenedora (deuda categorial) sin función que la hoja no cubra: el cuaderno ES la banda «Apuntes» del gestor (agrupación virtual por especie + recencia, no entidad persistida).
- **Dentro de la hoja, el grano fino = el FRAGMENTO**: un OPD (suelto o no). Una hoja puede tener 1..N OPDs sin árbol completo exigido.
- **Tres ascensos, tres granos**:
  1. **Hoja→modelo** (graduación, grano grueso): el toggle existente, ahora con *momento de graduación* — al desmarcar, la mesa pide nombre definitivo/carpeta y muestra el reporte de validez que pasa de observación a exigible.
  2. **Fragmento→otro modelo** (grano medio): composición de modelos existente, u adopción (§4) si el destino es el mismo modelo.
  3. **Fragmento→raíz del propio apunte** (grano fino): adoptar dentro de la hoja al ir emergiendo el SD0 — el camino bottom-up puro.

## 3. Entrada desatendida (cero decisiones antes del primer trazo)

- **«Nuevo apunte»** en paleta, gestor y atajo: abre AL INSTANTE, sin diálogo. Auto-nombre `Apunte AAAA-MM-DD·n` (renombrable después, nunca antes). Sin carpeta (los apuntes viven en la banda «Apuntes», fuera del sistema de carpetas por diseño). Autosave desde el primer trazo.
- El OPD raíz del apunte nace como **«Hoja 1»** sin ceremonia SD: los diagnósticos de método (SD-primero, cierre) degradan a observación por especie — la maquinaria por-clase existente.
- El OPL se sigue **derivando en vivo** (bisimetría intacta: un apunte es OPM legítimo con rigor relajado, no un canal aparte — la SSOT se respeta al 100%).

## 4. Taller bottom-up (en toda especie, primera clase)

- **OPD suelto**: crear un OPD sin padre (`Opd.padreId: null` adicional — el tipo ya lo admite). Gesto: «Nuevo OPD suelto» (árbol + paleta).
- **Árbol**: los sueltos viven bajo una banda **«Taller»** al pie del árbol de OPDs, con contadores como el resto.
- **Verbo «adoptar»**: desde un OPD suelto → elegir la cosa destino (objeto/proceso de cualquier OPD del árbol) y la modalidad (in-zoom / unfold) → un gesto fija `padreId` + declara el refinamiento. No inventa semántica: produce el MISMO estado que el camino top-down.
- **Código de validez nuevo «OPD sin adoptar»**: en **modelo** = bloquea solo el **export canónico** (jamás la edición); en **apunte** = observación (entra a `CODIGOS_VALIDEZ_DEGRADABLES_APUNTE`). Los hechos OPM de un OPD suelto SÍ emiten OPL (no son meta).
- **Integridad estructural: NUNCA degrada** — invariante intocable (referencias colgantes rechazan igual en el Taller).

## 5. Enmienda SSOT (entregable del corte, firma del custodio ANTES del deploy)

- `metodologia-forja-opm-es`: el arranque bottom-up (fragmentos→reconciliación→SD0) como **camino de elicitación de primera clase**, hermano del SD-primero (que sigue siendo el default del método guiado).
- `spec-forja-opd-es` §10: realización del Taller (banda, OPD suelto, adoptar) como extensión declarada.
- Skill `modelamiento-opm` (misma solicitud que v1.12.0 del puente o sucesiva): el régimen bottom-up — cómo la skill acompaña fragmentos sin exigir SD, y cuándo propone la reconciliación.
- La mesa NO despliega el código de validez nuevo antes de la firma (lección del despacho 2026-07-06: la mesa eleva ANTES).

## 6. Leyes y verificación

| Ley | Falsación |
|---|---|
| **Convergencia de caminos** | adoptar un OPD suelto ≡ haber creado el refinamiento top-down: los dos caminos producen modelos semánticamente iguales (comparación por firma semántica). |
| **Rigor al graduar** | hoja con fragmentos sueltos gradúa → los códigos degradados vuelven exigibles y el reporte los muestra; el toggle inverso los degrada de nuevo. |
| **Integridad ciega a la especie** | referencia colgante en OPD suelto de un apunte → rechaza igual. |
| **Export honesto** | modelo formal con OPD sin adoptar → export canónico bloquea con causa nombrada; apunte → exporta con marca de apunte. |
| **Entrada desatendida** | «Nuevo apunte» → hoja editable en < 1 gesto, sin diálogo previo (e2e). |

## 7. Fuera de alcance

Cuaderno como entidad persistida (la banda basta) · des-adopción (soltar del árbol) · adopción de subgrafos parciales (el grano es el OPD) · sincronización de fragmentos entre hojas.
