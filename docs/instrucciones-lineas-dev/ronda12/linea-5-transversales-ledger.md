# Línea 5 — Transversales + ledger ronda 12 (recalibración detector + draft handoff + cascadas residuales)

## 1. Misión

Cerrar ronda 12 con la **capa explícita de cascadas + ledger** (patrón ronda 8-11 ineludible) y **documentar la remediación de la auditoría 2026-05-07**:

- **Recalibración del detector ronda 12**: agregar ~22 reglas nuevas en `progress-dashboard.mjs` para HU cerradas por L1+L2+L3+L4 + corregir cualquier preexistente desactualizada por refactor (drift de paths/strings).
- **Cascadas residuales**: capa final que resuelve choques de integración (typecheck, smokes, paths) que solo emergen al juntar las 4 líneas en `main`.
- **Remediación auditoría `docs/auditorias/2026-05-07-ssot-opm-extracted.md`**:
  - **RF-1 / R1** (paths errados): YA APLICADO antes de la ronda 12 (commit dedicado): `Logical/AggregationLink.ts` → `DrawnPart/Links/AggregationLink.ts` en `enlaces.ts`, `tipos/enlace.ts`, `tipos/abanico.ts`. L5 verifica que persiste en main + cita en HANDOFF.
  - **R4** (header `// Refs:` en `validaciones.ts`): YA APLICADO antes de la ronda 12 (mismo commit). L5 verifica.
  - **RF-2 / R2** (citas SSOT EPICA-30): cerrado parcialmente en L1 sobre HU residuales (HU-30.008/.019/.020/.021/.036/.037). Auditoría dirigida sobre las HU EPICA-30 cubiertas en rondas anteriores se DIFIERE a ronda 13+ (esfuerzo S, 1-2h).
  - **RF-3 / R3** (mapeo reglas consistency vs HU activas EPICA-1c/EPICA-15): se DIFIERE a ronda 13+ (esfuerzo M, 2-4h auditoría dirigida).
  - **R5** (linter de provenance SSOT en CI): se DIFIERE a ronda 13+ (esfuerzo M, 3-6h).
  - **RF-4 / R6** (referencia PNGs modelWizard): latente, se activa cuando HU del wizard entre a flujo. Sin acción ronda 12.
- **Draft `docs/HANDOFF.md` post-ronda-12**: borrador con MVP-α ≥98% + apertura MVP-β + decisiones nuevas + cascadas resueltas + sección dedicada §Auditoría 2026-05-07 (remediación aplicada y diferida). **Aplicación final en consolidación, no durante la línea**.
- **Verificación cierre métricas**: `bun run check`, `bun run browser:smoke`, `bun run build`, dashboard `--sync-real`.

Esta línea NO introduce features de producto. Es **chore + verificación + ledger + remediación auditoría**. Aditividad estricta sobre el detector + edición final del handoff único.

**Fuera de slice**:
- No tocar features (territorio L1/L2/L3/L4).
- No tocar UI/render salvo para consolidar choques.
- No introducir nuevas reglas de negocio.
- No reabrir contratos rondas 1-11.

## 2. Trabajo concreto

| Item | Aporte L5 |
|---|---|
| **Detector L1 (cierre MVP-α)** | ~4 reglas nuevas: HU-11.007 multi-al-todo wiring, HU-30.036 read-only redirect, HU-30.021 ejemplo organizacional, HU-11.001/HU-10.004/HU-30.037 agrupada (indicador modo sticky + descripción + cancelar Esc). |
| **Detector L2 (valor numérico)** | ~5 reglas nuevas: HU-17.011/.012 unidad+sintaxis compuesta, HU-17.013 crearAtributoEnObjeto, HU-17.014 esAtributo flag, HU-17.015 valorSlot kernel, HU-17.016/.017 OPL es valor + asignar valor. |
| **Detector L3 (traer conectados)** | ~6 reglas nuevas: HU-1B.001/.002 toolbar+diálogo, HU-1B.003/.004/.010/.016 traerConectadosBatch + idempotencia + no-op, HU-1B.005 halo/default, HU-1B.007/.008/.009 enlaces internos selección, HU-1B.011 layoutRadial, HU-1B.015 ocultarApariencia. |
| **Detector L4 (plantillas)** | ~6 reglas nuevas: HU-33.001/.002 archivo persistencia plantillas + Menú entrada, HU-33.003 ámbito enum, HU-33.006/.007/.008/.009 insertarPlantillaBatch, HU-33.010 halo temporal, HU-33.012/.014/.015 dialogo plantillas, HU-33.018 desacople (test file). |
| **Reglas L5 propias** | ~1 regla: detector ronda 12 baseline counts (informativa). |
| **Corrección de drift preexistente** | Tras refactors ronda 12 puede haber drift en reglas existentes: ej. `Toolbar.tsx` cambia paths internos, `acciones-canvas.ts` cambia firmas. Corregir cualquier regla que pase a `unmatched`. **Patrón ronda 11**: detector debe terminar en `N/N reglas matched`, cero unmatched. |
| **Cascadas residuales esperadas** | Hunks disjuntos en `Toolbar.tsx`, `acciones-canvas.ts`, `acciones-ui.ts`, `tipos/ui.ts`, `canvas/operacionesBatch.ts`, `e2e/opm-smoke.spec.ts` pueden chocar al merge final. L5 las concilia con principio "menor blast prima". |
| **Verificación remediación auditoría** | Tras merge L1-L4: (a) `grep -n "Logical/AggregationLink" app/src` debe retornar 0 matches (RF-1 cerrado); (b) `head -20 app/src/modelo/validaciones.ts` debe mostrar header `// Refs:` (R4 cerrado); (c) HU EPICA-30 cerradas en L1 deben tener cita SSOT (`[Met §`) en headers (RF-2 parcial). |
| **Draft HANDOFF post-ronda-12** | Reescribe `docs/HANDOFF.md` siguiendo el patrón ronda 11: §Estado Integrado, §Cómo Se Decidió La Partición (anclar a cat-thinking + steipete + URNs ICAS), §Decisiones Vigentes (preserva todas previas + agrega ronda 12), §Cascadas Gestionadas, §Auditoría 2026-05-07 (RF-1/R4 cerrados, RF-2 parcial, RF-3/R5 diferidos a ronda 13+, RF-4 latente), §Verificación, §Estado Por Dominio, §Pendientes Inmediatos, §Épicas Descartadas (preserva), §Cómo Continuar (apuntando a ronda 13 EPICA-32 + auditoría dirigida RF-3 + cierre RF-2 EPICA-30; ronda 14 EPICA-50 parser; linter SSOT R5 cuándo). **Solo se aplica en consolidación final, no durante la línea**. |
| **Verificación final** | `cd app && bun run check` (≥680 unit), `bun run browser:smoke` (≥90), `bun run build` (chunk principal <195 KB / <55 KB gzip). `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`: detector ≥110 reglas matched, MVP-α ≥98%, MVP-β +20-30 HU. |

## 3. Anclaje a evidencia

- **Patrón ronda 11 L5**: `docs/instrucciones-lineas-dev/ronda11/linea-5-transversales-ledger.md` — referencia canónica para esta línea.
- **`docs/historias-usuario-v2/tools/progress-dashboard.mjs`**: detector vive aquí. 92 reglas baseline post-ronda-11. **L5 ronda 12 agrega ~22 reglas; cero ruptura de reglas previas (corregir si hay drift).**
- **HANDOFF actual** (`docs/HANDOFF.md`): patrón a respetar; reescribe en consolidación.
- **Auditoría `docs/auditorias/2026-05-07-ssot-opm-extracted.md`**: marco SSOT-céntrico; RF-1/R4 ya aplicados pre-ronda-12; RF-2 parcial en L1; RF-3/R5 diferidos a ronda 13+.
- **`docs/historias-usuario-v2/00-METODOLOGIA.md §6`**: jerarquía SSOT y citas obligatorias.
- **`docs/historias-usuario-v2/06-PROVENANCE.md §2`**: política operativa de reuso (SVGs/dimensiones/colores/tipografía/plantillas OPL).
- **Reglas duras** (README §2): aditividad estricta, JSON lossless, OPL invariante salvo declaradas, cero rename, cero deps nuevas.

## 4. Archivos permitidos

```text
docs/historias-usuario-v2/tools/progress-dashboard.mjs   EDIT extiende (~22 reglas nuevas + corregir drift)
docs/HANDOFF.md                                          EDIT en consolidación final (NO durante línea WIP)
docs/instrucciones-lineas-dev/ronda12/                   LECTURA (no editar briefs ya emitidos)
app/src/**                                               LECTURA (resolver cascadas en hunks específicos solo si emergen al merge)
app/e2e/opm-smoke.spec.ts                                EDIT solo si hay smoke flaky tras merge
opm-extracted/**                                         LECTURA
docs/historias-usuario-v2/**                             LECTURA (no editar HU files)
docs/roadmap/                                            LECTURA (regenerar en consolidación)
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones de no-colisión

- **No tocar archivos features de L1/L2/L3/L4** salvo cascada estrictamente necesaria documentada.
- **No reabrir contratos** rondas 1-11.
- **No introducir reglas detector** que no apunten a evidencia real (todas las reglas deben matchear paths + strings reales).
- **No editar HU files** en `docs/historias-usuario-v2/epicas/`.
- **No correr `--sync-real` si una línea quedó incompleta**: si L1/L2/L3/L4 no terminó, marcar dependencia y pausar L5.
- **HANDOFF se actualiza al final**, no durante consolidación de líneas individuales.

## 6. Comportamiento esperado

- **Reglas detector** se agregan al final del array de reglas en `progress-dashboard.mjs` con formato canónico:
  ```javascript
  { huId: "HU-17.015", paths: ["app/src/modelo/tipos/entidad.ts"], strings: ["valorSlot", "TipoValorSlot"], estado: "cubierto" },
  ```
  donde `estado` es `"cubierto" | "parcial"` según el aporte.
- **Drift correction**: tras `bun run check` verde post-merge L1+L2+L3+L4, ejecutar dashboard `--sync-real` para detectar reglas unmatched. Cada unmatched se corrige editando paths/strings al estado real.
- **Atomicidad de regla**: una regla cubre 1-4 HU. Reglas agrupadas si las HU son el mismo dominio + comparten evidencia.
- **Cierre verde obligatorio**: si dashboard reporta unmatched > 0, NO consolidar. Iterar hasta `N/N matched`.
- **HANDOFF reemplaza al previo**: política de handoff único — reescribir, no acumular.
- **Sección §Cómo Se Decidió La Partición** del nuevo HANDOFF debe citar URNs ICAS-BoK (`urn:fxsl:kb:icas-extension`, `urn:fxsl:kb:icas-universales`, `urn:fxsl:kb:icas-adjunciones`, `urn:fxsl:kb:icas-preservacion`, `urn:fxsl:kb:icas-lifecycle`, `urn:fxsl:kb:icas-calidad-riesgo`) tal como ronda 11 lo hizo.

## 7. Pruebas requeridas

L5 no agrega tests de producto. **Pruebas son las verificaciones del detector + métricas globales**:

```bash
cd app
bun run check          # ≥680 unit, ≥2700 expects, 0 fail
bun run browser:smoke  # ≥90 smokes, smoke 854 estable
bun run build          # chunk principal < 195 KB / < 55 KB gzip
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Salida esperada del dashboard:

- HU vivas: 1126
- Total: ~28% ponderado (avance por nueva apertura MVP-β)
- MVP-α: ≥98% ponderado
- MVP-β: nueva métrica activa con +20-30 HU cubiertas
- Detector: ≥110/110 reglas matched
- Diagnósticos: ≤1 advertencia (HU-13.005 duplicado legado, conocido)

Si MVP-α < 98%, registrar en HANDOFF las HU residuales con rationale.

## 8. Métricas esperadas

- **Reglas detector consolidadas**: ~22 nuevas (L1: ~4, L2: ~5, L3: ~6, L4: ~6, L5: ~1).
- **Total reglas**: 92 → ~114.
- **Build**: cero impacto.
- **Tests**: cero impacto (L5 no agrega tests).

## 9. Loop verde y commits

```bash
cd app
bun run check
bun run browser:smoke
bun run build
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Commits sugeridos (orden):

1. `chore(cascadas): resolver hunks disjuntos Toolbar/acciones tras merge L1+L2+L3+L4` *(si emergen)*
2. `chore(ledger): recalibra detector ronda 12 (~22 reglas nuevas, ~92→~114)`
3. `chore(handoff): cierra ronda 12 — MVP-α ≥98% + apertura MVP-β` *(en consolidación final)*

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **Reglas L1/L2/L3/L4 declaradas pero evidencia no merged**: si una línea quedó incompleta, las reglas no matchean. | Coordinación: L5 corre AL FINAL. Si línea incompleta, marcar dependencia + pausar. Patrón ronda 11. |
| **Drift en reglas previas**: refactors L1-L4 pueden cambiar paths que ronda 8-11 declararon. | Tras merge, run `--sync-real`; cualquier unmatched se corrige antes de cerrar L5. |
| **HANDOFF muy largo o desactualizado**: tentación de mantener histórico. | Política handoff único: reescribir reemplazando, no agregar. Decisiones rondas 1-11 que siguen vigentes se citan compactas; cascadas resueltas se documentan en su sección dedicada. |
| **Cascadas inesperadas tras merge**: integración puede romper en formas no anticipadas en briefs. | Documentar en HANDOFF §Cascadas Gestionadas con rationale resolución. Si cascada requiere refactor estructural, NO reabrir contratos: documentar en briefs ronda 13. |
| **Métrica MVP-α < 98%**: si una HU residual no cierra. | Documentar rationale en HANDOFF (HU sin evidencia code-side, HU con peso M0/M1 que requiere ronda 13). MVP-α 95-97% sigue siendo válido como cierre presentable; documentar la asíntota. |
| **MVP-β métrica nueva inestable**: el detector puede no calibrar bien con cobertura tan inicial. | MVP-β como métrica informativa en ronda 12 (no objetivo). Estabilizar en rondas 13-14 cuando haya más cobertura. |
| **Bundle grew >195 KB**: si los nuevos chunks empujan el principal. | Lazy chunks adicionales para `DialogoPlantillas` y `DialogoTraerConectados` si crecen > 6 KB. Patrón ronda 11 L2 (PantallaInicio lazy). |

## 11. Salida esperada

Al cierre de L5 + consolidación, el operador debe poder:

- Confiar en que el detector reporta ≥110/110 reglas matched, cero unmatched.
- Ver MVP-α ≥98% en dashboard (cierre presentable estricto).
- Ver MVP-β como nueva métrica con +20-30 HU cubiertas (apertura confirmada).
- Leer un HANDOFF post-ronda-12 limpio que reemplaza al de ronda 11, con cita explícita a la decisión categorial de ruta C asimétrica + URNs ICAS.
- Iniciar ronda 13 (EPICA-32 sub-modelos peer-persistence dedicada) sobre base estable.

**Estado proyecto post-ronda-12 esperado**: cierre del primer hito presentable (MVP-α ≥98%) + apertura controlada de MVP-β con 3 épicas grandes seleccionadas por blast aditivo. EPICA-32 (sub-modelos peer) y HU-50 parser bidireccional explícitamente diferidas a rondas 13-14 dedicadas. Cero deuda estructural pendiente.

**Remediación auditoría 2026-05-07**: RF-1 (paths errados) y R4 (header validaciones.ts) cerrados pre-ronda-12; RF-2 (citas SSOT EPICA-30) cerrado parcialmente sobre HU residuales en L1; RF-3 (delta consistency rules) y R5 (linter SSOT en CI) diferidos a ronda 13+. RF-4/R6 (PNGs modelWizard) latente. Marco SSOT-céntrico aplicado retroactivamente al README ronda 12 (§1, §5, §5b, §5c, §5d, §9).
