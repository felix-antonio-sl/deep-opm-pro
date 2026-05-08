# L3 — Issues separados por estructura/metodología/legibilidad

## 1. Misión

Hacer **gobernable** la deuda metodológica. Hoy `PanelMetodologia` muestra 21 mejoras como una columna estrecha sin distinguir niveles. Un modelador no sabe qué bloquea, qué es mejora y qué es preferencia visual. La meta es separar issues en **3 niveles** con resumen que diga `0 bloqueos / 21 mejoras / 0 estilo`.

**Slice mínimo entregable**:
1. Clasificador `clasificarSeveridad(aviso)` que mapea cada aviso existente a `bloqueo | mejora | estilo`.
2. PanelMetodologia muestra 3 secciones colapsables con conteo: `Bloqueos (0)`, `Mejoras metodologia (21)`, `Estilo/legibilidad (0)`.
3. Resumen en el panel: `0 bloqueos estructurales / 21 mejoras metodologicas / 0 sugerencias de estilo`.
4. Cada issue mantiene navegación click → centrar entidad afectada (ya existe).
5. Cada issue muestra: regla canónica (cita SSOT corta), razón, acción sugerida en una sola línea.

**Pendientes explícitos fuera de slice**:
- No reimplementar el motor de validaciones; solo se clasifica el output existente.
- No mover el panel a una bandeja flotante (eso es ronda 20+ Fase 2).
- No agregar issues nuevos al motor; solo reorganizar los actuales.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-50.001 | `docs/historias-usuario-v2/EPICA-50-validacion-metodologica/HU-50-001-clasificacion-severidad-issues.md` (NUEVO) | Define los 3 niveles |
| HU-50.002 | (idem epic) | Define UI con secciones colapsables |
| HU-60.005 | `docs/historias-usuario-v2/EPICA-60-opl-bimodal/HU-60-005-issues-no-rompen-lectura-opl.md` (NUEVO si no existe) | El panel issues no debe truncar OPL |

## 3. Anclaje a evidencia

- SSOT: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md` §"niveles de calidad" + `opm-iso-19450-es.md` §"validaciones estructurales".
- Corpus reusable:
  - `app/src/modelo/validaciones.ts` (motor existente).
  - `app/src/modelo/checkers/` (validadores específicos).
  - `app/src/ui/PanelMetodologia.tsx` (presentación actual).
  - `app/src/ui/PanelAvisos.tsx` (validación estructural ya separada).
  - `opm-extracted/INDEX.md` clases `OpcatValidator`, `MethodologicalChecker`.
- Estado actual: `Aviso` en `validaciones.ts` no tiene campo de severidad explícito; tiene `tipo` (regla) y `severidad` opcional.

## 4. Archivos permitidos

```
app/src/modelo/validaciones/clasificador.ts                    NUEVO (clasificarSeveridad)
app/src/modelo/validaciones/clasificador.test.ts               NUEVO
app/src/ui/PanelMetodologia.tsx                                EDIT aditivo (3 secciones)
app/src/ui/PanelAvisos.tsx                                     LECTURA (referencia visual)
app/src/ui/tokens.ts                                           EDIT aditivo (severidades visuales)
app/src/modelo/validaciones.ts                                 LECTURA
app/src/modelo/checkers/*                                      LECTURA
app/e2e/12-validacion-metodologica.spec.ts (existente o NUEVO) EDIT aditivo
docs/historias-usuario-v2/EPICA-50-validacion-metodologica/HU-50-001-clasificacion-severidad-issues.md NUEVO
docs/historias-usuario-v2/EPICA-50-validacion-metodologica/HU-50-002-panel-secciones-colapsables.md NUEVO
```

## 5. Restricciones de no-colisión

- **No tocar el motor**. Solo `clasificarSeveridad` lee el `Aviso` y devuelve label de severidad. Si una regla no tiene severidad clara: default `mejora`.
- **L1 NO toca PanelMetodologia**. Sin colisión.
- **L4 NO toca PanelMetodologia ni PanelAvisos**. Sin colisión.

## 6. Slice mínimo shippeable

### `clasificador.ts`

```ts
export type SeveridadIssue = "bloqueo" | "mejora" | "estilo";

export function clasificarSeveridad(aviso: Aviso): SeveridadIssue {
  // Mapeo determinista por aviso.tipo (string). Tabla cerrada.
  // Bloqueos: validaciones estructurales que rompen modelo (ej: enlace cíclico,
  //           refinamiento ortogonal violado).
  // Mejoras: validaciones metodológicas (ej: proceso sin transformación,
  //          agente no humano).
  // Estilo: sugerencias visuales (ej: nombre demasiado largo).
  return TABLA_SEVERIDAD[aviso.tipo] ?? "mejora";
}

export function resumenSeveridades(avisos: Aviso[]): { bloqueos: number; mejoras: number; estilo: number } { ... }
```

### PanelMetodologia con secciones

```tsx
const grupos = useMemo(() => agruparPorSeveridad(avisos), [avisos]);

return (
  <section data-testid="panel-metodologia" aria-label="Validacion metodologica">
    <header>
      <h3>Validación</h3>
      <span style={style.resumen}>
        {grupos.bloqueos.length} bloqueos · {grupos.mejoras.length} mejoras · {grupos.estilo.length} estilo
      </span>
    </header>
    <details open={grupos.bloqueos.length > 0}>
      <summary>Bloqueos estructurales ({grupos.bloqueos.length})</summary>
      <ListaIssues items={grupos.bloqueos} severidad="bloqueo" />
    </details>
    <details open={grupos.mejoras.length > 0 && grupos.bloqueos.length === 0}>
      <summary>Mejoras metodológicas ({grupos.mejoras.length})</summary>
      <ListaIssues items={grupos.mejoras} severidad="mejora" />
    </details>
    <details>
      <summary>Estilo/legibilidad ({grupos.estilo.length})</summary>
      <ListaIssues items={grupos.estilo} severidad="estilo" />
    </details>
  </section>
);
```

Cada `ListaIssues` mantiene los click handlers existentes para centrar y navegar.

### Tokens nuevos (ejemplo)

```ts
severidad: {
  bloqueo: { fondo: tokens.colors.errorFondo, borde: tokens.colors.errorBorde, texto: tokens.colors.errorTexto },
  mejora: { fondo: tokens.colors.advertenciaFondo, borde: tokens.colors.advertenciaBorde, texto: tokens.colors.alertaTexto },
  estilo: { fondo: tokens.colors.fondoNeutral, borde: tokens.colors.bordeChrome, texto: tokens.colors.textoSecundario },
}
```

## 7. Tests obligatorios

- Unit (~10 tests nuevos):
  - `clasificarSeveridad` para cada `aviso.tipo` conocido (al menos 8 casos).
  - `resumenSeveridades` cuenta correctamente con avisos vacíos, mixtos y todos del mismo tipo.
- Smoke (~2 tests nuevos):
  - `panel metodologia agrupa avisos por severidad y muestra resumen`.
  - `colapsar seccion de mejoras oculta items pero conteo persiste`.

## 8. Verificación

```bash
cd app
bun run check
bun run lint
bun run browser:smoke
bun run build
```

Audit visual:
- A 1280x720, abrir un fixture con avisos (OnStar, Cafetera, App modeladora deseada).
- Verificar que se lee `0 bloqueos / X mejoras / Y estilo` sin truncamiento.
- Cumplir criterio §P1 informe UX: leer warning metodológico completo a 1280x720 sin palabras partidas.

## 9. Decisiones bloqueadas (no reabrir)

- **3 severidades, no más**. `bloqueo / mejora / estilo`.
- **Default severidad**: `mejora` cuando el aviso no está en la tabla.
- **No tocar el motor**. Solo se clasifica el output.

## 10. Decisiones que tomas vos (documentar en commit)

- Lista exacta de `aviso.tipo` por severidad (idealmente decidir leyendo cada checker).
- Si la sección de bloqueos se mantiene siempre abierta o solo cuando count > 0.
- Color exacto de cada severidad dentro de la paleta existente.

## 11. Forma del entregable

- Commit 1: `feat(validaciones): clasificador de severidad bloqueo/mejora/estilo` — clasificador puro + tests.
- Commit 2: `feat(panel-metodologia): secciones colapsables con resumen por severidad`.
- Commit 3: `test(e2e): panel metodologia agrupa avisos y resumen visible`.
- Co-author footer estándar.
- No tocar HANDOFF.md ni motor de validaciones.
