# Ronda 28 — Vuelta 360° estética Bauhaus computacional

**Fecha**: 2026-05-23
**Dirección estética elegida por el operador**: Bauhaus computacional (Dieter Rams + Otl Aicher + Karl Gerstner). Precisión nórdica, retícula visible, geometría matemática, cero decoración.
**Base commit**: `675d30d` (cierre Ronda 27 III.A).
**Último commit**: `52126f9 docs(handoff): cierre Ronda 28 visual Bauhaus computacional`.
**Bundle producción**: `index-v_YL0nbo.js` desde 2026-05-23 07:54 GMT.

## Estructura

```
ronda28-bauhaus-2026-05/
├── README.md                             (este archivo)
├── 00-mockup-previo.png                  (referencia visual canónica entregada antes del despacho)
├── mockup.html                           (HTML standalone del mockup; abrir en navegador)
├── ronda28-prod-01-entrada.png           (entrada producción tras deploy)
├── ronda28-prod-02-seleccion.png         (proceso seleccionado en cinabrio + inspector + OPL)
├── ronda28-prod-03-asistente.png         (asistente guiado etapa 1/3 Bauhaus)
├── ronda28-prod-04-mobile.png            (modo revisión mobile con bottom nav)
└── ronda28-prod-final.png                (captura full-page final)
```

## Design system aplicado

### Paleta
- `--ink: #0A0A0A` (no negro puro)
- `--paper: #FAFAFA` (no blanco puro)
- `--ink-90..ink-04` (escala de grises)
- `--accent: #C8392F` (cinabrio — único acento cromático, reservado para selección/focus/danger)
- `--focus: #1F3FA6` (ultramar — solo focus-visible ring)
- `--warning: #8A3D2D` (terracota apagada)

### Tipografía
- Display/UI: **Inter Tight** self-hosted (variable axis 100-900)
- Mono: **JetBrains Mono** self-hosted (variable axis)
- Tracking: -0.01em body, +0.08em uppercase labels, +0.12em marca OPFORJA
- Tabular numbers activadas globalmente

### Retícula
- Base 8px (todos padding/margin/gap múltiplos)
- Stroke chrome/inspector/OPL: 1.5px
- Stroke canvas: 2px (presencia en densidad)
- Border-radius: 0px en chrome, 2px en cards

### Sombras
- Solo planas (`offset 4-12px 4-12px 0 0 var(--ink-15)`)
- Cero blur, cero glassmorphism, cero gradientes

### Animaciones
- 150ms ease-out en todo
- Cero spring, cero parallax

## Canvas — CANON-V2 (decisión integrada)

Tras análisis crítico del mockup, se decidió **NO eliminar la heurística cromática OPM en el canvas**:

| Elemento | Fill | Stroke |
|---|---|---|
| Objeto (rect) | `#EFF7EB` verde papel 12% sat | ink 2px |
| Proceso (ellipse) | `#E8F0F8` azul papel 10% sat | ink 2px |
| Enlace | — | ink 2px |
| Selección | — | cinabrio 2.5px + handles cuadrados cinabrio |

**Markers diferenciados por tipo de enlace** (canónicos OPM):
- Consumo/Resultado: triángulo lleno ink
- Efecto: doble flecha
- Instrumento: lollipop vacío (círculo paper + stroke ink)
- Agente: lollipop lleno (círculo ink)
- Invocación: rombo vacío
- Agregación: triángulo lleno ink
- Generalización: triángulo vacío
- Exhibición: triángulo doble

## Ejecución

6 líneas paralelas + 1 hotfix en 30 commits totales:

| Línea | Scope | Commits |
|---|---|---|
| L1 | Tokens Bauhaus + fuentes self-hosted | 4 |
| L2 | Chrome (toolbar + menús + marca OPFORJA) | 4 |
| L3 | Inspector + panel OPL + diagnóstico + árbol OPD | 4 + 1 hotfix |
| L4 | Canvas CANON-V2 + markers diferenciados | 4 |
| L5 | Diálogos + asistente 3 etapas + bienvenida + modales | 5 |
| L6 | Iconografía Unicode + mobile + Timeline + FlashToast + CapturadorBugs | 5 |
| docs | HANDOFF + README + capturas | 3 |

## Loop verde

- `bun run check`: **1560 unit / 0 fail / 5594 expects**
- `bun run browser:smoke`: **219 smoke / 0 fail / 1 skip**

## Lección de concurrencia

Los 4 agentes paralelos de Ola 2 (L2+L3+L5+L6) trabajando en archivos centrales generaron carreras de escritura que se resolvieron con commits frecuentes + `git commit --only` por archivo. L1 cerró sola en Ola 1 sin colisión. El hotfix del L3 nació de un detalle geométrico subestimado: el reorden del grid del treeitem dejó el badge UNFOLD/INZOOM en el centro exacto del click target, interceptando `treeitem.click()` de Playwright (5 smoke tests rotos hasta el fix).

## Pendiente

- §III.B del veredicto jobs-web-ux original (copilot contextual generalizado) sigue siendo decisión de producto separada.
