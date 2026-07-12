# Corte C′·A — «Inspector legible» — diseño

**Fecha:** 2026-07-07 · **Estado:** REALIZADO Y DESPLEGADO; referencia de contrato · Deriva de
`docs/auditorias/2026-07-07-reauditoria-ux-diagramatica.md` (M-4 + m-6 + residuos M-5).
Radio disjunto del corte D-paleta en curso (CommandPalette/DialogoCargarModelo).

## Problema

El Inspector de entidad apila 6-7 secciones `FichaSeccion` **siempre expandidas**: 1803 px de
ficha en un panel de 852 px (2,1 pantallas) para una sola cosa; «Semántica» sola mide 845 px;
el Centinela añadió «Anclaje» como 7ª. El inspector vacío ofrece «Notas de mesa» sin contexto.
Y tres microcopy M-5 residuales viven en la misma superficie.

## Diseño

### 1. Primitiva de colapso — `app/src/ui/inspector/seccionColapso.ts` (nuevo)

Estado de plegado por sección, con **memoria de sesión** (`sessionStorage`), independiente por
clave y con default por sección.

- `claveColapso(id: string): string` → `"opm.inspector.colapso." + id`.
- `leerAbierta(id: string, pordefecto: boolean): boolean` — lee sessionStorage; si no hay
  entrada, devuelve `pordefecto`. Robusto a sessionStorage ausente (SSR/headless).
- `escribirAbierta(id: string, abierta: boolean): void`.
- `EVENTO_ABRIR = "opm:inspector-abrir-colapso"`.
- `abrirSeccionesDe(el: HTMLElement | null): void` — sube por ancestros con `[data-colapso-key]`
  y por cada uno escribe `abierta=true` + despacha `CustomEvent(EVENTO_ABRIR, {detail:{key}})`.
  Lo usan las quick-actions que enfocan una sección que pudo quedar plegada.

### 2. `FichaSeccion` colapsable — `app/src/ui/inspector/FichaSeccion.tsx`

Props nuevas: `colapsable?: boolean` (default `false`, retrocompatible), `defaultAbierta?: boolean`
(default `true`), `colapsoId?: string` (default = `kicker`).

- Cuando `colapsable`: el kicker pasa de `<p>` a `<button>` (header clicable, `aria-expanded`,
  `aria-controls`) con el texto del kicker + un chevron `▸/▾` (glifo texto, color `inkSoft`, sin
  colores/sombras nuevos → pasa `design:governance`). El `<section>` lleva `data-colapso-key`.
- Estado `abierta = useState(() => leerAbierta(colapsoId, defaultAbierta))`; toggle persiste vía
  `escribirAbierta`. `useEffect` suscribe a `EVENTO_ABRIR`: si `detail.key === colapsoId` → abre.
- Cuando cerrada, el `fichaContenido` **no se renderiza** (los inputs no existen → no roban foco/
  tab). El `data-testid="inspector-panel-*"` y `data-inspector-seccion` se conservan en el
  `<section>` (los tests/smoke ubican el bloque aunque esté plegado).
- No-colapsable: markup actual intacto.

Reusa la misma primitiva un `SeccionDisclosure` liviano para los sub-bloques internos de
«Semántica» (Avanzado, Notas de mesa) — mismo `data-colapso-key`, mismo evento.

### 3. Composición del Inspector de entidad — `InspectorEntidad.tsx`

- «Nombre» fuera del colapso (siempre visible).
- Abiertas por defecto: **Semántica**, **Enlaces**.
- Plegadas: **Refinamiento**, **Extensiones**, **Apariciones**, **Tamaño**.
- **Anclaje** (solo si `entidad.anclaje != null`): `defaultAbierta = hayDrift(entidad)` — abierta
  si el `driftMap` marca divergencia, plegada si al-día.
- Dentro de «Semántica»: núcleo directo (cobertura, Descripción, Estados, Esencia/Afiliación,
  +Atributo). Tras disclosures **cerrados**: «Avanzado» (Alias, Unidad, URLs, Imagen) y «Notas de
  mesa». El `SeccionAlias` conserva `data-testid="inspector-seccion-alias"` dentro del disclosure.

### 4. Expandir-al-navegar — `CodexSelectionAnnotation.tsx`

`enfocarSeccionInspector(testId)`: antes de `focus()/scrollIntoView`, llamar
`abrirSeccionesDe(seccion)` para expandir la sección plegada que contiene el objetivo (cubre la
quick-action «alias» → `inspector-seccion-alias`, hoy dentro del disclosure «Avanzado»).

### 5. Inspector vacío (m-6) — `Inspector.tsx`

`InspectorVacio`: solo «Selecciona un elemento.». `SeccionRegistroRatificar` y `SeccionAnclas`
(modelo/OPD) ya auto-gatean por contenido (se quedan). La `SeccionNotasMesa` de modelo pasa a un
`SeccionDisclosure` **cerrado** «Nota del modelo» (se puede crear, no grita).

### 6. Microcopy M-5

- `App.tsx:410` — `title="Selection"` → `"Selección"`.
- `App.tsx:277` — quitar `kicker="MARGINALIA"`; `CodexColHeader` omite el span de kicker cuando
  `kicker === ""` → el panel queda «OPL» a secas. (Los otros headers pasan kicker no vacío: intactos.)
- `SeccionNotasMesa.tsx` — placeholder `"Anotar para la re-elicitación…"` → `"Anotar duda o pendiente…"`.
- `Timeline.tsx` — cada fila muestra el ordinal `"1.º {nombre}"` en vez de la coordenada cruda `"Y {y}"`.

## Leyes / verificación (TDD)

- `seccionColapso.test.ts`: leer default sin storage; escribir↔leer; `abrirSeccionesDe` despacha
  el evento por ancestro; robusto a sessionStorage ausente.
- `FichaSeccion.test.tsx`: colapsable rinde botón con `aria-expanded`; toggle persiste; respeta
  `defaultAbierta`; se abre al recibir `EVENTO_ABRIR` con su clave; no-colapsable intacto.
- `Inspector.test`/`InspectorEntidad` (unit donde exista): vacío = solo la frase + disclosure
  cerrado de nota; Anclaje abre-si-drift.
- Microcopy: aserción de «Selección», ausencia de «MARGINALIA», placeholder llano, ordinal en Timeline.
- Gate: `cd app && bun run check && bun run lint && bun run design:governance && bun run browser:smoke`.
  Deploy = gate humano.

## Fuera de alcance (YAGNI)

No se re-arquitectura el Inspector ni se toca el kernel. No animaciones de colapso (mostrar/ocultar
directo). No persistencia cross-sesión (memoria de sesión, como pidió el audit). No se toca
CommandPalette/DialogoCargarModelo (radio del corte D).
