# L4 — OPD tree como navegación primaria con badges

## 1. Misión

Promover el **árbol OPD** de utilidad secundaria a navegación primaria del modelo. Hoy los controles `Nom`/`Cod`/`Ord: Auto`/`Ord: Manual`/`...` son crípticos; los nodos no comunican tipo de refinamiento (`Inzoom` vs `Unfold`) ni estado de validación. La meta es que en un modelo con 8 OPDs, el modelador identifique en 5 segundos cuál es SD raíz, cuál es in-zoom, cuál es unfold y dónde hay deuda metodológica.

**Slice mínimo entregable**:
1. Labels claros: `Mostrar nombres / Mostrar códigos / Orden automático / Orden manual / Más opciones`.
2. Cada OPD muestra:
   - Tipo de refinamiento como badge textual breve (`SD`, `Inzoom`, `Unfold`).
   - Conteo objetos/procesos/enlaces.
   - Indicador de issues si los OPD tiene avisos no resueltos.
3. Acciones inline: `Abrir`, `Renombrar`, `Crear refinamiento`.
4. Click en badge `Inzoom` o `Unfold` lleva al refinador padre.

**Pendientes explícitos fuera de slice**:
- No reemplazar el árbol completo por una vista lista.
- No fusionar árbol + biblioteca (eso es Fase 2).
- No tocar la lógica de refinamiento (slot dual ya está estable desde ronda 15.2).

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-30.001 | `docs/historias-usuario-v2/EPICA-30-arbol-opd/HU-30-001-labels-claros-controles.md` (NUEVO) | Define labels en español |
| HU-30.002 | (idem epic) | Badges por tipo de refinamiento |
| HU-30.003 | (idem epic) | Conteos y indicador de issues |
| HU-40.001 | `docs/historias-usuario-v2/EPICA-40-refinamiento-opd/HU-40-001-navegacion-refinador.md` (NUEVO) | Click en badge salta a refinador |

## 3. Anclaje a evidencia

- SSOT: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §"refinamiento descomp/despliegue".
- Corpus reusable:
  - `app/src/ui/ArbolOpd.tsx` (~700 LOC).
  - `app/src/modelo/refinamientos.ts` helpers (`obtenerRefinamiento`, `refinaA`).
  - `opm-extracted/INDEX.md` clases `OpdTreeComponent`, `OpdNodeComponent`.
  - `assets/svg/toolbar/inzoom.svg`, `unfold.svg` para iconos canónicos.
- Estado actual: `ArbolOpd.tsx` muestra árbol con `getByRole("treeitem", { name: /SD/ })`. Smokes lo localizan así.

## 4. Archivos permitidos

```
app/src/ui/ArbolOpd.tsx                                   EDIT aditivo
app/src/ui/ArbolOpd/NodoOpd.tsx (nuevo si no existe)      NUEVO o EDIT
app/src/ui/ArbolOpd/badges.ts                             NUEVO (calcularBadges)
app/src/ui/ArbolOpd/badges.test.ts                        NUEVO
app/src/ui/ArbolOpd/arbolOpdStyles.ts                     EDIT aditivo
app/src/ui/tokens.ts                                      EDIT aditivo (badges)
app/src/modelo/refinamientos.ts                           LECTURA
docs/historias-usuario-v2/EPICA-30-arbol-opd/HU-30-001-labels-claros-controles.md NUEVO
docs/historias-usuario-v2/EPICA-30-arbol-opd/HU-30-002-badges-tipo-refinamiento.md NUEVO
docs/historias-usuario-v2/EPICA-30-arbol-opd/HU-30-003-conteos-y-indicador-issues.md NUEVO
docs/historias-usuario-v2/EPICA-40-refinamiento-opd/HU-40-001-navegacion-refinador.md NUEVO
```

## 5. Restricciones de no-colisión

- **No tocar** `modelo/refinamientos.ts` ni `store`. La info de refinamiento se lee con helpers existentes.
- **L3 NO toca ArbolOpd**. L3 solo toca PanelMetodologia. Si L3 expone "OPD afectado" en cada issue, L4 puede leer ese flag para badge "tiene issues" — coordinar vía contrato leve sin acoplamiento.

## 6. Slice mínimo shippeable

### `badges.ts` (lógica pura)

```ts
export interface BadgesNodoOpd {
  tipo: "raiz" | "inzoom" | "unfold";
  cuentaObjetos: number;
  cuentaProcesos: number;
  cuentaEnlaces: number;
  tieneIssues: boolean;
  refinadorId: Id | null; // entidad cuyo refinamiento crea este OPD
}

export function calcularBadges(modelo: Modelo, opdId: Id, avisos: Aviso[]): BadgesNodoOpd {
  // Calcula desde modelo.opds[opdId] + helpers de refinamiento + avisos.
}
```

### `NodoOpd.tsx`

```tsx
<li role="treeitem" aria-label={...}>
  <button onClick={abrir} data-testid={`tree-node-${opdId}`}>
    <span style={style.tipoBadge} data-tipo={badges.tipo}>{labelTipo(badges.tipo)}</span>
    <span style={style.nombre}>{nombreVisible}</span>
    <span style={style.contador} aria-label={`${badges.cuentaObjetos} objetos, ${badges.cuentaProcesos} procesos, ${badges.cuentaEnlaces} enlaces`}>
      {badges.cuentaObjetos}o · {badges.cuentaProcesos}p · {badges.cuentaEnlaces}e
    </span>
    {badges.tieneIssues ? <span style={style.issueDot} aria-label="Tiene avisos" /> : null}
  </button>
  {badges.refinadorId ? (
    <button onClick={() => navegarARefinador(badges.refinadorId)} title={`Ir al ${badges.tipo === "inzoom" ? "proceso" : "objeto"} refinador`}>
      ↗
    </button>
  ) : null}
</li>
```

### Labels claros

| Antes | Después |
|---|---|
| `Nom` | `Nombres` |
| `Cod` | `Códigos` |
| `Ord: Auto` | `Orden automático` |
| `Ord: Manual` | `Orden manual` |
| `...` | `Más opciones` |

Mantener `data-testid` actuales si los smokes los usan.

## 7. Tests obligatorios

- Unit (~12 tests nuevos):
  - `calcularBadges` para SD raíz (tipo=raiz, refinadorId=null).
  - `calcularBadges` para descomposición (tipo=inzoom, refinadorId=proceso).
  - `calcularBadges` para despliegue (tipo=unfold, refinadorId=objeto).
  - `calcularBadges` cuenta objetos/procesos/enlaces correctamente.
  - `calcularBadges` detecta issues por OPD afectado.
- Smoke (~2 tests nuevos):
  - `arbol OPD muestra badges Inzoom/Unfold y conteos correctos en fixture multi-OPD`.
  - `click en boton refinador navega al OPD del padre y selecciona la entidad`.

## 8. Verificación

```bash
cd app
bun run check
bun run lint
bun run browser:smoke
bun run build
```

Audit visual:
- Cargar fixture `App modeladora OPM deseada` (8 OPDs).
- Verificar que en 5 segundos se identifica SD raíz, in-zoom y unfold.
- Cumplir criterio §P1 informe UX: badges textuales legibles, conteos visibles.

## 9. Decisiones bloqueadas (no reabrir)

- **3 tipos de badge únicamente**: `raiz / inzoom / unfold`. No mezclar con otros conceptos.
- **No mover el árbol** del lado izquierdo. Solo enriquecerlo.
- **Compatible con orden automático y manual** existente. No cambiar la lógica de orden.

## 10. Decisiones que tomas vos (documentar en commit)

- Si el contador es `5o · 3p · 7e` o `5/3/7` o `O5 P3 E7`.
- Color exacto del dot de issues (recomendado: `tokens.colors.errorRojo` con borde `tokens.colors.errorBordeSuave`).
- Si el botón "ir a refinador" usa flecha unicode `↗` o un SVG inline.

## 11. Forma del entregable

- Commit 1: `feat(arbol-opd): badges de tipo refinamiento y conteos por OPD`.
- Commit 2: `feat(arbol-opd): navegacion al refinador via boton ↗`.
- Commit 3: `style(arbol-opd): labels claros en es-CL para controles`.
- Commit 4: `test(arbol-opd): badges y navegacion refinador cubiertos`.
- Co-author footer estándar.
- No tocar HANDOFF.md ni `modelo/refinamientos.ts`.
