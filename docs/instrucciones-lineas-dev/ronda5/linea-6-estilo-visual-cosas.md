# Linea 6 — Estilo visual editable de cosas

## 1. Mision

Introducir el primer slice de estilado visual editable para cosas, manteniendo separacion estricta entre apariencia y semantica: controles de fill/borde/reset, persistencia de overrides y render JointJS que preserva señales OPM canonicas.

**Slice minimo entregable**: `Apariencia.estilo?` opcional, helper `estilos.ts`, controles de estilo para cosa seleccionada, fill y borde editables, reset a default, JSON lossless y OPL sin cambios ante cambios visuales.

**Fuera de slice**: fuentes/tamano/negrita/cursiva, offsets de texto, multi-seleccion batch, estilo de enlaces, copiar/pegar estilo y defaults organizacionales.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-14.001 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-14-canvas-styling.md` | Mostrar grupo Style al seleccionar cosa. |
| HU-14.002 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-14-canvas-styling.md` | Cambiar color de relleno con paleta. |
| HU-14.003 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-14-canvas-styling.md` | Cambiar color de borde preservando semantica de afiliacion. |
| HU-14.015 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-14-canvas-styling.md` | Resetear estilo de cosa al default. |
| HU-14.017 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-14-canvas-styling.md` | Persistir overrides de estilo sin eco OPL. |

## 3. Anclaje a evidencia

- **SSOT**: `opm-visual-es.md` V-63 declara colores informativos, no normativos; V-193-V-195 resguardan anclaje y rotulo integro; `opm-opl-es.md` §1 y §17 separan superficie textual de atributos visuales.
- **Corpus interno reusable**:
  - `opm-extracted/MODULES.md` lista `src/app/configuration/rappidEnviromentFunctionality/inspector/opmStyle.ts`, `keyboardShortcuts.ts` con `pasteOnlyFormatting`, y `styleCopyingDialog.component.ts`.
  - `opm-extracted/assets/INDEX.md` referencia `styleElement.svg` usado por `OpmObject` y `OpmProcess`.
  - `assets/svg/styleElement.svg` es icono canonico para controles de estilo.
  - `docs/JOYAS.md` §1 colores OPCloud (`#70E483`, `#3BC3FF`, `#586D8C`) y §3 tipografia Arial 14px semibold.
- **Estado actual del codigo**:
  - `app/src/modelo/tipos.ts` `Apariencia` no tiene campo `estilo`.
  - `app/src/render/jointjs/proyeccion.ts` calcula `stroke` desde tipo de entidad y afiliacion/esencia; no lee overrides.
  - `app/src/ui/InspectorEntidad.tsx` tiene controles de nombre/esencia/afiliacion/refinamiento/estados, no estilo.
  - `app/src/serializacion/json.ts` valida apariencias estrictamente; cualquier campo nuevo debe hidratar con default seguro.

## 4. Archivos permitidos

```text
app/src/modelo/tipos.ts                    EDIT aditivo
app/src/modelo/estilos.ts                  NUEVO
app/src/modelo/estilos.test.ts             NUEVO
app/src/render/jointjs/proyeccion.ts       EDIT aditivo acotado
app/src/render/jointjs/proyeccion.test.ts  EDIT aditivo
app/src/ui/InspectorEntidad.tsx            EDIT aditivo
app/src/ui/StyleControls.tsx               NUEVO
app/src/store.ts                           EDIT aditivo
app/src/store.test.ts                      EDIT aditivo
app/src/serializacion/json.ts              EDIT aditivo
app/src/serializacion/json.test.ts         EDIT aditivo
app/src/opl/generar.test.ts                EDIT aditivo negativo estilo
app/e2e/opm-smoke.spec.ts                  EDIT aditivo
assets/svg/styleElement.svg                LECTURA
docs/JOYAS.md                              LECTURA
opm-extracted/**                           LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No implementar estilo de enlaces; L4 posee etiquetas y bus, no estilo visual.
- No tocar `Toolbar.tsx`; usar `InspectorEntidad` o componente hijo.
- No cambiar colores semanticos default ni patrones de afiliacion/esencia.
- No permitir que estilo altere OPL.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.

## 6. Slice minimo shippeable

### Modelo

Extender `Apariencia`:

```ts
export interface EstiloApariencia {
  fill?: string;
  borderColor?: string;
}

export interface Apariencia {
  // ...
  estilo?: EstiloApariencia;
}
```

Helper:

```ts
export function aplicarEstiloApariencia(modelo: Modelo, opdId: Id, aparienciaId: Id, patch: EstiloApariencia): Resultado<Modelo>;
export function resetearEstiloApariencia(modelo: Modelo, opdId: Id, aparienciaId: Id): Resultado<Modelo>;
export function normalizarEstiloApariencia(value: unknown): EstiloApariencia | undefined;
```

Validar colores hex `#RGB`/`#RRGGBB` o paleta cerrada. Preferir paleta inicial pequena:

- default/limpiar
- `#70E483`
- `#3BC3FF`
- `#586D8C`
- `#ffffff`
- `#fef3c7`

### Operaciones

Store:

```ts
aplicarEstiloSeleccionado(patch: EstiloApariencia): void;
resetearEstiloSeleccionado(): void;
```

Debe localizar apariencia activa de la entidad seleccionada.

### Serializacion

`json.ts` valida `apariencia.estilo` como opcional, omite objeto vacio o lo normaliza a `undefined`, y conserva documentos legacy sin campo.

### Render

`proyeccion.ts` aplica:

- `fill` override al cuerpo, sin tocar capsulas de estado si eso rompe legibilidad.
- `borderColor` override al stroke, preservando `strokeDasharray` de afiliacion ambiental.
- seleccion/refinamiento siguen alterando grosor como ahora.

### OPL

No cambia. Agregar test que al modificar `Apariencia.estilo` la salida de `generarOpl` es identica.

### UX

Crear `StyleControls.tsx` dentro de `InspectorEntidad`:

- grupo "Style" visible solo con apariencia activa;
- swatches para fill y borde;
- boton "Reset";
- labels accesibles y sin texto explicativo largo en app.

### Cross-capa

Los overrides deben sobrevivir export/import JSON y guardar/cargar local de L2.

## 7. Tests obligatorios

- Unit modelo: aplicar fill y borderColor preserva otros campos de apariencia.
- Unit modelo: reset remueve `estilo`.
- Serializacion: hidrata legacy sin estilo y roundtrip con estilo.
- Render: fill/border override aparecen en attrs JointJS.
- Render: afiliacion ambiental conserva dash aunque cambie borde.
- OPL: cambiar estilo no cambia `generarOpl`.
- Smoke: seleccionar cosa, cambiar fill, guardar/cargar local si L2 ya esta integrada, resetear.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- Estilo visual no altera semantica ni OPL.
- Campo nuevo es opcional y vive en `Apariencia`, no en `Entidad`.
- Primer slice solo cubre cosas, no enlaces.
- Reset borra overrides esteticos, no toca esencia ni afiliacion.

## 10. Decisiones que tomas vos (documentar en commit)

- Paleta exacta inicial y si aceptas input hex libre.
- Si `fill` aplica a procesos y objetos por igual; HU dice cosa, por tanto ambos.
- Como manejar contraste texto/fill en esta ronda; minimo mantener texto legible.
- Si objeto vacio `{}` se serializa o se omite; preferir omitir.

## 11. Forma del entregable

Commits sugeridos:

- `feat(modelo): agrega overrides de estilo en apariencias`
- `feat(ui): permite editar estilo visual de cosas`
- `test(estilo): cubre render serializacion y opl invariante`

No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas y bloqueos.
