---
id: "HU-SHARED-007"
titulo: "Eco OPL-ES sincronizado con el modelo"
fecha: 2026-05-03
estado: "activo"
tipo_patron: "transversal-lente"
absorbe: ["HU-10.016", "HU-50.007", "HU-50.008", "HU-50.009", "HU-50.010", "HU-50.011", "HU-50.012", "HU-50.014"]
---

## 1. Problema que resuelve

El panel OPL-ES es la lente textual del modelo. Cada operación sobre el canvas debe propagarse al panel y, recíprocamente, edición en el panel debe propagarse al canvas (EPICA-50). HU-10.016 (eco al crear cosa) y HU-50.NNN (panel persistente) duplican el contrato. Este patrón canoniza la propagación bidireccional y los formatos de oración.

## 2. HU canónica

### HU-SHARED-007 — Eco OPL-ES sincronizado

**Actor primario:** MN, ME.
**Tipo:** opm-semantica.
**Nivel categórico:** L primario (lente derivada); K secundario (semántica OPL).
**Superficie UI:** panel OPL-ES.
**Gesto canónico:** ninguno explícito; el panel reacciona a cambios.

**Historia:**
> Como modelador, quiero que el panel OPL-ES refleje fielmente el modelo OPM en todo momento, generando oraciones canónicas tras cada cambio, para verificar la semántica del modelo en lenguaje natural.

**Contexto de negocio:**
La SSOT [Glos 3.42] define OPL como la lente textual canónica del modelo. La SSOT `opm-opl-es.md` define plantillas T1–T3, D1–D13, TS1–TS5 con verbos canónicos en español. OPCloud genera OPL en inglés con plantillas internas; deep-opm-pro genera OPL-ES con las plantillas SSOT.

**Criterios de aceptación:**
- **Dado** que creo una entidad, **cuando** la creación termina, **entonces** el panel OPL-ES emite la oración correspondiente: `*Un Proceso* es un proceso informacional y sistémico.` [OPL-ES D1] o `**Un Objeto** es un objeto informacional y sistémico.` [OPL-ES D1].
- **Dado** que cambio `entidad.afiliacion` o `entidad.esencia`, **cuando** el cambio termina, **entonces** la oración correspondiente se actualiza en vivo.
- **Dado** que renombro una entidad, **cuando** la operación termina, **entonces** todas las oraciones que mencionan esa entidad se reemiten con el nuevo nombre.
- **Dado** que creo un enlace, **cuando** la operación termina, **entonces** el panel emite la oración de la familia correspondiente: `**Conductor** maneja *Rescatar*.` [OPL-ES T5] (agente), `*Cocinar* consume **Ingrediente**.` [OPL-ES T1] (consumo), `**Sistema** consiste en **Parte1**, **Parte2** y **Parte3**.` [OPL-ES] (agregación), etc.
- **Dado** que elimino una entidad o enlace, **cuando** la operación termina, **entonces** las oraciones correspondientes desaparecen del panel.
- **Dado** que estoy en un OPD descompuesto, **cuando** el panel se renderiza, **entonces** las oraciones corresponden al OPD activo (no a todo el modelo).
- **Dado** que un objeto tiene estados, **cuando** se renderiza, **entonces** se emite `**Objeto** puede ser `estado1`, `estado2` o `estado3`.` [OPL-ES D5] con cursiva/negrita/monoespaciado correctas.
- **Dado** que edito una oración OPL-ES y confirmo, **cuando** la operación termina, **entonces** el cambio se propaga al canvas (cuando la edición es semánticamente válida; ver EPICA-50 para detalle de qué edición es válida).

**Reglas y restricciones:**
- Plantillas OPL-ES SSOT son la fuente. No se inventan plantillas locales.
- Convenciones tipográficas: **negrita** para objetos, *cursiva* para procesos, `monoespaciado` para estados.
- El idioma de las oraciones es español (OPL-ES). El inglés solo aparece en notas de evidencia.
- El panel se actualiza dentro del mismo tick que el cambio del canvas (sincrónico, no eventual).
- La generación es determinística: igual modelo → igual OPL.
- En modo read-only, las oraciones se muestran pero no son editables.

**Modelo de datos tocado:**
- Lente derivada de `modelo.*`. No persiste oraciones; las regenera por consulta.

**Dependencias:**
- Bloquea a: cualquier HU que verifique OPL.
- Bloqueada por: HU-10.001/002 (entidades existentes).

**Integraciones:**
- EPICA-50 (panel OPL-ES con todas sus afordancias).
- HU-SHARED-002 (cambio entra al stack).
- HU-SHARED-003 (read-only deshabilita edición).

**Notas de evidencia:**
- Fuente normativa: [OPL-ES T1–T3] transformadores, [OPL-ES D1–D13] propiedades, [OPL-ES TS1–TS5] transformadores con estado.
- Fuente OPCloud: motor `38452.js` y plantillas observadas.
- Clase de afirmación: confirmado por SSOT + observado.

**Prioridad:** M0.
**Tamaño:** L.
**Etiquetas:** [opl, kernel, lente, transversal, sincronizacion].

## 3. Plantillas OPL-ES de referencia (extracto)

| Plantilla | Forma | Ejemplo |
|---|---|---|
| D1 | `**Objeto** es un objeto {esencia} y {afiliacion}.` | `**Conductor** es un objeto físico y sistémico.` |
| D1 (proceso) | `*Proceso* es un proceso {esencia} y {afiliacion}.` | `*Rescatar* es un proceso informacional y sistémico.` |
| D5 | `**Objeto** puede ser `e1`, `e2` o `e3`.` | `**Vehículo** puede ser `detenido`, `en marcha` o `accidentado`.` |
| T1 | `*Proceso* consume **Objeto**.` | `*Cocinar* consume **Ingrediente**.` |
| T2 | `*Proceso* genera **Objeto**.` | `*Cocinar* genera **Plato**.` |
| T3 | `*Proceso* afecta **Objeto**.` | `*Calentar* afecta **Agua**.` |
| T5 (agente) | `**Habilitador** maneja *Proceso*.` | `**Conductor** maneja *Conducir*.` |
| T6 (instrumento) | `**Habilitador** requiere *Proceso*.` | `**Volante** requiere *Conducir*.` |
| TS3 | `*Proceso* cambia **Objeto** de `e_in` a `e_out`.` | `*Cocinar* cambia **Huevo** de `crudo` a `cocido`.` |

(Las plantillas reales viven en `opm-opl-es.md`. Esta tabla es un extracto orientativo.)

## 4. Lectura categorial — bisimulación coalgebraica canvas ↔ OPL-ES

Esta sección formaliza la sincronización canvas↔OPL-ES como **bisimulación** sobre coalgebras del modelo. Anclada a `urn:fxsl:kb:icas-efectos`.

### 4.1 Coalgebra de observación

Definimos el funtor de observación bimodal:

```
F(M) = Canvas_render(M) × OPL_oraciones(M)
```

donde `M` es un estado del modelo (snapshot de `modelo.entidades`, `modelo.enlaces`, `modelo.opds`).

La coalgebra `α: M → F(M)` produce, para cada estado del modelo, el par (render visual, lista de oraciones OPL-ES). Esta coalgebra es **determinística**: igual `M` ⇒ igual `F(M)`.

### 4.2 Relación de bisimulación R

Definimos la relación `R ⊆ M × M` entre dos estados como:

```
(M_1, M_2) ∈ R   sii   F(M_1) = F(M_2)
```

Esto es: dos estados son bisimilares si producen el mismo render y las mismas oraciones OPL-ES.

Esta R es la **bisimulación máxima** del sistema, en el sentido de `urn:fxsl:kb:icas-efectos §bisimulacion`.

### 4.3 Invariantes de bisimulación verificables

Estos son tests ejecutables que el sistema debe pasar:

**INV-1 (estilo no afecta semántica)**: para todo `M` y todo cambio de estilo `M' = M + Δ_estilo` (donde `Δ_estilo` modifica `apariencia.estilo` sin tocar `entidad/enlace`), `(M, M') ∈ R` proyectado al sub-funtor `OPL_oraciones`. Es decir: `OPL_oraciones(M) = OPL_oraciones(M')`. Esto canoniza HU-19.015.

**INV-2 (imagen no afecta semántica)**: para todo cambio en `apariencia.imagen`, `OPL_oraciones(M) = OPL_oraciones(M')`. Canoniza HU-19.015.

**INV-3 (renombrado propaga)**: si `M' = M[entidad.nombre := nuevo]`, entonces:
  - `OPL_oraciones(M')` reemplaza todas las menciones del nombre antiguo por el nuevo.
  - El número de oraciones es idéntico: `|OPL_oraciones(M')| = |OPL_oraciones(M)|`.

**INV-4 (descomposición preserva entidad única)**: para todo `M` con entidad `E`, si `M' = M[descomponer(E)]`, entonces:
  - `Canvas_render(M').apariencias` contiene **dos** apariencias de `E` (padre + hijo).
  - `modelo.entidades(M')` contiene **una sola** `E` (HU-12.007).
  - `OPL_oraciones(M')` incluye todas las oraciones de `M` más exactamente una de descomposición.

**INV-5 (creación atómica)**: tras `crearEntidad(M, tipo)`:
  - `Canvas_render(M')` agrega exactamente una apariencia.
  - `OPL_oraciones(M')` agrega exactamente una oración [OPL-ES D1].
  - El stack undo (HU-SHARED-002) crece en una entrada.

**INV-6 (eliminación cascada)**: tras `eliminarEntidad(M, E, scope=modelo)`:
  - `OPL_oraciones(M')` no contiene oraciones que mencionen `E`.
  - `Canvas_render(M')` no contiene apariencias de `E`.
  - Ningún enlace del modelo referencia `E`.

**INV-7 (idempotencia de OPL)**: regenerar OPL desde el mismo `M` produce la misma lista (en orden):
  - `OPL_oraciones(M) ≡ OPL_oraciones(M)` palabra por palabra.
  - Sin variaciones aleatorias entre invocaciones.

### 4.4 Test de bisimulación bidireccional (HU-50.022)

Para edición inversa OPL → canvas, la bisimulación se exige también:

**INV-8 (edición OPL idempotente)**: si edito una oración OPL con texto exactamente igual al actual, `M` no cambia: `M' = M`.

**INV-9 (edición OPL determinística)**: para una edición OPL semánticamente válida, hay un único `M'` resultante. La función `aplicarEdicionOPL: (M, edicion) → M'` es total y determinística.

**INV-10 (round-trip)**: `OPL_oraciones(aplicarEdicionOPL(M, "renombrar X a Y")) = OPL_oraciones(M)[X ↦ Y]`. Es decir: editar OPL produce el efecto exacto en OPL después de la edición.

### 4.5 Implementación de tests

Los invariantes INV-1..INV-10 son verificables como tests `bun:test`. Cada uno corresponde a un test que:

1. Construye un modelo `M` representativo.
2. Aplica la transformación.
3. Compara `F(M_antes)` y `F(M_despues)` según el invariante.
4. Falla si la igualdad esperada no se cumple.

Cuando estos tests existan, el contrato bisimulación de `HU-SHARED-007` deja de ser heurística y pasa a ser propiedad verificada (`urn:fxsl:kb:icas-procesos §testing`).

## 5. HU absorbidas

- `HU-10.016` — Eco OPL-ES al crear cosa.
- `HU-50.007` — Verbalizar essence/affiliation.
- `HU-50.008` a `HU-50.014` — Verbalizaciones de enlaces estructurales/procedurales/estados/refinamiento.
- (EPICA-50 mantiene como canónicas las HU sobre afordancias propias del panel: filtros, búsqueda, edición inversa, copia. Las HU de "eco" se absorben aquí.)
