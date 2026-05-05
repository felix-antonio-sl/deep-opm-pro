# Línea 4 — Validaciones BehaviouralRule extendidas (EPICA-1C)

## 1. Misión

Extender el panel de avisos pasivos de cinco a nueve o diez reglas, portando reglas BehaviouralRule canónicas de OPCloud (`opm-extracted/src/app/models/consistency/behavioral.rules.ts`, 1231 LOC) al kernel propio. Cubrir HU-1C.013–019 con citas SSOT explícitas, navegación al elemento inválido y revalidación on-demand.

**Slice mínimo entregable**:
- 4-5 reglas nuevas en `validaciones.ts`, cada una con cita SSOT.
- Severidad explícita por regla (`error | advertencia | info`).
- `PanelAvisos.tsx` extendido con: cita SSOT clickeable, navegación al elemento (clic en aviso → cambia OPD activo + selecciona apariencia + zoom-fit si aplica).
- Botón "Revalidar" en el panel (HU-1C.018) o auto-revalidación tras cada acción del store.
- HU-1C.019 garantiza que cada regla tenga `citaSSOT: string` no vacío en `Aviso`.

**Pendientes explícitos** (no entran a este slice):
- Configuración por organización (Q1C.1).
- Auto-revalidación bajo cada cambio (Q1C.2): elegir on-demand vs reactiva en este slice; documentar.
- Lista detallada con expand/collapse de cosas inválidas por regla (HU-1C.016): aporte mínimo, lista plana basta.
- Revalidación parcial: solo full revalidation.

## 2. HU base (lectura obligatoria antes de codificar)

| HU | Path | Aporta |
|---|---|---|
| HU-1C.013 | `docs/historias-usuario-v2/epicas/epica-1c-canvas-validaciones.md` (1C.013) | Panel "Verificación metodológica" |
| HU-1C.014 | (mismo, 1C.014) | 5 reglas canónicas (extender a 9-10) |
| HU-1C.015 | (mismo, 1C.015) | Severidad con color y símbolo |
| HU-1C.017 | (mismo, 1C.017) | Navegar al elemento inválido |
| HU-1C.018 | (mismo, 1C.018) | Revalidar on-demand |
| HU-1C.019 | (mismo, 1C.019) | Citar sección SSOT en cada regla |

## 3. Anclaje a evidencia

- **SSOT**:
  - `opm-iso-19450-es.md` — `[V-237]`, `[V-238]` axiomas de estados; `[V-239]`, `[V-240]` axiomas de enlaces; `[Glos 3.39]`, `[Glos 3.58]`, `[Glos 3.71a]`, `[Glos 3.76]`.
  - `metodologia-opm-es.md` — reglas metodológicas canónicas (Buena modelación OPM).
- **opm-extracted/** (gold mine):
  - `opm-extracted/src/app/models/consistency/behavioral.rules.ts` (1231 LOC) — listar TODAS las reglas BehaviouralRule, mapear cuáles corresponden a HU-1C.014, identificar 4-5 con mayor valor M1 y SSOT respaldo claro.
  - `opm-extracted/src/app/models/consistency/structural.rules.ts` (298 LOC) — reglas estructurales para considerar.
  - `opm-extracted/src/app/models/consistency/consistancy.model.ts` (1528 LOC) — orquestador. **No copiar** la arquitectura; el kernel propio usa lente derivada sin caching, que ya es más limpia.
  - Buscar específicamente: `InstrumentWithAgentConsistency`, `OnlyOneLevelOfInstantiation`, `LegalConsumptionWarning`, `MultipleAgentsRule`, `ProcessWithoutInputOrOutput`, `EffectAndAgentSimultaneously`, `AggregationCycleRule`.
  - Comando inicial: `rg "class.*extends.*Rule|class.*Rule\b" opm-extracted/src/app/models/consistency/`.
- **Estado actual**:
  - `app/src/modelo/validaciones.ts` (211 LOC) — 5 reglas existentes. Patrón: función pura `validarModelo(modelo, opdActivoId): Aviso[]`.
  - `app/src/modelo/validaciones.test.ts` (295 LOC) — patrón de tests por regla.
  - `app/src/ui/PanelAvisos.tsx` — UI existente. Severidad por color ya implementada.
  - `app/src/store.ts` — acciones existentes para navegar a elemento (reutilizar).

## 4. Archivos permitidos (scope estricto)

```
app/src/modelo/validaciones.ts              EDIT aditivo (4-5 reglas nuevas)
app/src/modelo/validaciones.test.ts         EDIT aditivo
app/src/ui/PanelAvisos.tsx                  EDIT aditivo (cita SSOT clickeable, navegación, revalidar, lista expand/collapse)
app/src/store.ts                            EDIT aditivo (acción navegarAviso si no existe; auto-revalidación opcional)
```

**Lectura permitida**: cualquier archivo de `app/` y `opm-extracted/` para informarse sobre reglas.

**Prohibido**: editar `operaciones.ts`, `tipos.ts`, `serializacion`, `opl/`, `render/`, `Toolbar.tsx`, `Inspector.tsx`. Esta línea es **kernel-puro de validación + UI del panel de avisos**.

## 5. Restricciones de no-colisión

1. **`validaciones.ts`**: agregar reglas nuevas en bloques separados al final del array de reglas. No tocar reglas existentes.
2. **Tipo `Aviso` actual**: si ya tiene `citaSSOT: string`, reutilizar. Si no, **agregar campo opcional** sin romper API. Verificar.
3. **Severidad `info`**: si la implementación actual de PanelAvisos solo soporta `error | advertencia`, agregar `info` en azul. Verificar antes de inventar color.
4. **Navegación al elemento**: usar acciones existentes del store. Si no existe `navegarAviso`, agregar acción nueva en `store.ts` que: cambia `opdActivo`, selecciona el elemento, dispara zoom-fit si es viable.
5. **Auto-revalidación**: opcional. Si se implementa, hacerlo como `subscribe` desde el store al modelo, derivando avisos cada cambio. Sin caching. Si esto degrada performance en modelos grandes, postergar a ronda siguiente.

## 6. Slice mínimo shippeable

### 6.1 Reglas nuevas en `validaciones.ts`

Seleccionar 4-5 con mayor valor metodológico y SSOT clara. Sugerencia priorizada:

1. **`agente-requiere-objeto-fisico`** (severidad **error**): si un enlace `agente` apunta a un objeto que NO es físico (`entidad.naturaleza === "informacional"` o sin marca), generar aviso. Cita `[Glos 3.3]` agente, `[Glos 3.39]` objeto físico.

2. **`proceso-sin-entrada-ni-salida`** (severidad **advertencia**): proceso sin enlaces de consumo, agente, instrumento, resultado, efecto, ni invocación. Cita `[V-240]`. Ignorar procesos que son objetos descomposición (refinables todavía sin contenido).

3. **`instrumento-y-agente-simultaneos`** (severidad **advertencia**): proceso con agente y instrumento al mismo tiempo desde la misma entidad. Cita `[V-240]`. Útil para destacar diseño ambiguo.

4. **`solo-un-nivel-de-instanciacion`** (severidad **advertencia**): si hay clasificación A → B y B → C, advertir. Cita `[V-239]`.

5. **`consumo-doble-mismo-objeto`** (severidad **advertencia** — HU-15.025): mismo proceso consume dos veces el mismo objeto. Cita `[V-239]`.

Cada regla:
```ts
{
  id: "agente-requiere-objeto-fisico",
  severidad: "error",
  citaSSOT: "[Glos 3.3] [Glos 3.39]",
  ejecutar(modelo, opdActivoId): Aviso[] { /* ... */ }
}
```

Mapeo desde `opm-extracted/src/app/models/consistency/behavioral.rules.ts`: para cada regla del slice, citar en el commit la clase TypeScript de OPCloud que inspiró (no copiada). Ejemplo: `// Inspirado en OPCloud InstrumentWithAgentConsistency, validado contra SSOT [V-240]`.

### 6.2 PanelAvisos UI extendido

- Cada `Aviso` muestra:
  - Símbolo según severidad (`⛔` `⚠` `ℹ` o equivalente sin emoji si JOYAS lo prohíbe; usar texto `[E]` `[A]` `[I]`).
  - Mensaje.
  - Cita SSOT clickeable (al click: si el archivo de SSOT está disponible, abrir o destacar; mínimo, mostrar cita en el detalle).
  - Botón "Ir al elemento" (si `aviso.elementoId` está presente).
- Botón "Revalidar" en cabecera del panel: dispara recálculo manual (HU-1C.018).
- Filtros opcionales por severidad (toggles).

### 6.3 Acción de navegación

En `store.ts`:
```ts
navegarAviso(aviso: Aviso): void
// implementación: si aviso.opdId existe, cambiar opdActivo; seleccionar aviso.elementoId
```

Si la acción ya existe con otro nombre, reutilizar.

### 6.4 Cita SSOT en `Aviso`

Si el tipo `Aviso` no tiene `citaSSOT: string`, **agregar campo obligatorio** en reglas nuevas. Para reglas existentes, agregarlo como opcional y rellenar gradualmente. Documentar la migración.

## 7. Tests obligatorios

### Unit tests (estimado +15 tests; 3 por regla)
Por cada regla nueva:
- Caso positivo (regla detecta violación).
- Caso negativo (regla NO detecta donde no hay violación).
- Caso borde o edge (modelo vacío, OPD activo distinto, etc.).

### Smoke browser (estimado +1 test)
- Crear modelo con violación deliberada (ej. agente sobre objeto informacional) → verificar aviso emergente con severidad correcta y cita SSOT → clic en "Ir al elemento" → verificar navegación → corregir → revalidar → aviso desaparece.

## 8. Verificación

```bash
cd app
bun run check          # +15 unit tests
bun run browser:smoke  # +1 smoke
```

## 9. Decisiones bloqueadas (no reabrir)

- Lente derivada sin caching, consistente con las 5 reglas existentes. Razón: simplicidad y correctness sobre performance prematura.
- Severidad limitada a `error | advertencia | info`. No agregar más niveles.
- Cita SSOT obligatoria en reglas nuevas.
- No copiar 1:1 código de `behavioral.rules.ts` de OPCloud. Inspirar y reescribir contra SSOT propia.

## 10. Decisiones que tomás vos (documentar en commit)

- Selección final de 4-5 reglas nuevas: justificar por valor metodológico y disponibilidad de SSOT clara.
- Auto-revalidación reactiva vs solo on-demand: documentar trade-off.
- Formato de cita SSOT en UI: tooltip vs chip clickeable. Elegir y documentar.
- Migración de `Aviso.citaSSOT` para reglas existentes: aditivo opcional vs obligatorio. Elegir y documentar.

## 11. Forma del entregable

Commits sugeridos:
- `feat(validaciones): regla agente-requiere-objeto-fisico [Glos 3.3]`.
- `feat(validaciones): regla proceso-sin-entrada-ni-salida [V-240]`.
- `feat(validaciones): regla instrumento-y-agente-simultaneos [V-240]`.
- `feat(validaciones): regla solo-un-nivel-de-instanciacion [V-239]`.
- `feat(validaciones): regla consumo-doble-mismo-objeto [V-239]`.
- `feat(ui): PanelAvisos con cita SSOT clickeable y navegacion`.
- `feat(ui): boton Revalidar y filtros por severidad`.
- `test(...)` separado o integrado.

Co-author footer estándar.
