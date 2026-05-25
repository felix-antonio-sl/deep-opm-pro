# Auditoría · Incumplimientos Codex

**Captura:** `CleanShot 2026-05-25 at 12.00.09.jpg`
**Fecha:** 25 mayo 2026
**Versión Codex:** v1.1
**Cobertura estimada actual:** ~92%
**Cobertura objetivo tras correcciones:** ~96%
**Estado de resolución:** aplicado en código y cubierto por tests focales.

## Resolución aplicada

- Breadcrumb del header: `sistema · system diagram`.
- Onboarding: overlay top-right, acciones inline italic y dismiss persistido en `localStorage`.
- Inspector vacío: sólo placeholder italic, sin metadatos ni CTA de renombrado.
- OPL toolbar: acciones-palabra sin cajas; filtro por selección sin checkbox.
- Footer: `VIEW Edición`.
- `LIVE`: eliminado de OPL/Inspector.
- Canvas: viewport JointJS sin scrollbar nativa visible.
- Capturador de bugs: sin FABs; disponible por `Ctrl+Alt+B` y command palette. Decisión documentada en `docs/decisiones/DDR-0007-botones-flotantes-capturador.md`.

---

## △ Críticas

### 1. Botones-chip persisten en el chrome
**Artículo afectado:** I.1 — *tipografía antes que UI*

Tienen background/border de caja, deberían ser palabras inline:

- **`Asistente guiado`** — botón filled oscuro sobre el banner. Debe ser link italic crimson.
- **`Empezar vacío`** — botón outline. Debe ser link italic inkMid separado por `·`.
- **`Renombrar modelo`** — botón ancho en el inspector vacío. Debe ser inline `renombrar modelo` en serif.
- **`Diagnóstico del modelo`** + pill `0 sugerencias` — caja con border. Y además es **redundante** con `✓ ningún diagnóstico` del footer-right. Eliminar el del inspector.
- **`Nº` / `Editar`** en el panel OPL — toggles en cajas. Deben ser palabras subrayables.
- **`Copiar` / `HTML`** — cajas. Deben ser links inline al pie del panel: `copiar · html · exportar`.

### 2. Banner de onboarding sigue siendo banner ancho
**Referencia:** Ola 3 ajuste 3.1

`Estás viendo un ejemplo: System Diagram` ocupa una franja completa del canvas. Debe ser **overlay sutil top-right** del canvas en italic serif 12px color `inkSoft`, con `×` que persiste el dismiss en `localStorage`. Y las dos acciones del banner como links inline (ver punto 1).

### 3. Inspector vacío muestra metadatos del modelo
**Referencia:** Ola 3 ajuste 3.3

`System Diagram · Selecciona un objeto…` arriba del botón `Renombrar modelo` reintroduce el patrón "contadores en chrome" que se rechazó explícitamente. El empty state del inspector debe ser solo italic:

> *Selecciona un objeto, proceso o enlace para ver sus propiedades aquí.*

Nada más. El `renombrar` va al command palette → sección `MODELO`.

### 4. Botones flotantes circulares bottom-right
**Artículos afectados:** I.1, IX

Dos círculos negros con glifo blanco aparecen abajo a la derecha. **No están documentados** en el handoff. Si son toggles de modo o vistas, deben vivir en el command palette → sección `VISTA`. Codex no admite floating action buttons.

---

## △ Altas

### 5. Breadcrumb central solo dice `SD`
**Referencia:** Ola 3 ajuste 5.1

Debe ser:

```
sistema · system diagram
```

Con separador `·` en `inkFaint` y último item bold + ink. Hoy solo `SD` en mono — pierde contexto.

### 6. Glifos de toolbar sin color de clase
**Referencia:** Ola 2 ajuste 3.3

`□ Objeto`, `○ Proceso`, `◇ Estado`, `→ Relación` — los glifos están en gris (`ink` o `inkSoft`), no en su color canónico:

| Glifo | Color esperado | Stroke |
|---|---|---|
| `□` | `--cx-opm-green` (verde) | 1.5 |
| `○` | `--cx-opm-blue` (azul) | 1.5 |
| `◇` | `--cx-opm-olive` (olive) | 1.2 |
| `→` | `--cx-ink` | 1 |

El kbd al final (`O`, `P`, `S`, `R`) está OK pero le falta el border del color de clase también.

### 7. Checkbox `Filtrar por selección`
**Artículo afectado:** I.1

Debe ser palabra subrayable: cuando activo, `filtrar por selección` con underline ink; cuando inactivo, en `inkSoft` sin underline. No checkbox.

### 8. `Edicion` sin tilde en footer
**Regla afectada:** R-DOC-8 — *redacción normativa con acentos en español ordinario*

`VIEW Edicion` → `VIEW Edición`.

### 9. Sufijo `LIVE` redundante
**Referencia:** consistencia

`MARGINALIA / OPL · LIVE` y `INSPECTOR / Selection · LIVE`. Si significa "auto-actualización", está bien como concepto, pero **dos veces el mismo tag** en pantalla recarga. Mover a un solo indicador global discreto, o eliminarlo si no aporta info accionable.

---

## △ Medias

### 10. Hamburguesa `≡` junto al wordmark sin background
**Estatus:** correcto visualmente, **verificar comportamiento**.

Debe abrir el command palette (`⌘K`), no un menú clásico.

### 11. Caret `▾ SD` cuando SD no tiene hijos

Hay un caret `▾` antes de `SD` — implica nodo expandible. Si SD no tiene hijos (SD1 aún no existe), el caret no debe aparecer. Solo cuando hay hijos.

### 12. Scrollbar visible en bottom-right del canvas

Un scroll horizontal en la parte inferior del área canvas. Si el canvas usa JointJS, el pan ya gestiona el viewport — no debe haber scrollbar nativa. Verificar `overflow: hidden` en el paper container.

### 13. Header del Inspector dice `System Diagram` en estado vacío

Confunde: parece que está mostrando el modelo seleccionado como entidad. Solo debe poblarse cuando hay selección de un cell del canvas. En vacío: solo el kicker `INSPECTOR · Selection` (o sin `LIVE` por punto 9) + el texto italic del empty state.

---

## △ Bajas

### 14. `Asistente guiado` flujo conceptual
**Estatus:** buen flujo conceptual. Mantener cuando se aplique la corrección del punto 1.

### 15. Breadcrumb `SD · OPD raíz` sobre el canvas central
**Estatus:** funcional, sugerencia.

Está bien, pero podría usar lower-case + middle dot consistente:

```
sd · opd raíz
```

---

## ✓ Lo que está bien (mantener)

- Wordmark `Opforja` en italic serif ✓
- Tab `System Diagram` con border-bottom crimson activo ✓
- `editor vacío · ⌘K` en italic ✓
- **Layout espejado** (OPL izquierda, Índice + Inspector derecha) ✓ DDR 0002 aplicado correctamente
- Footer keys con kbd outline ✓
- Empty states de canvas y OPL con voz Codex italic ✓
- `✓ ningún diagnóstico` italic en footer-right ✓
- Hairlines en lugar de shadows ✓
- Empty state OPL: *«Sin OPL todavía. Inserta una cosa con la toolbar para que las oraciones aparezcan aquí en español.»* — voz perfecta ✓

---

## Prioridad de fix

| Ola | Items | Esfuerzo |
|---|---|---|
| **Hoy** | 1, 2, 3, 5, 8, 11, 12, 13 | 2–3 horas |
| **Mañana** | 4 (decidir destino de los floating buttons), 6, 7, 9 | 4–6 horas |
| **Pulido** | 14, 15 | < 1 hora |

Cuando apliques **1 + 2 + 3 + 5 + 8** la cobertura sube de ~92% a ~96%.

Los **floating buttons (item 4)** son el item de mayor impacto conceptual: hay que decidir si son legítimos (entonces moverlos al palette → `VISTA`) o no (entonces eliminarlos). Documentar la decisión en un DDR nuevo (0007).

---

## Checklist accionable para PR

```
□ 1.a  Asistente guiado → link italic crimson inline
□ 1.b  Empezar vacío → link italic inkMid inline
□ 1.c  Renombrar modelo → command palette MODELO + remover botón inspector
□ 1.d  Diagnóstico del modelo (inspector) → eliminar (redundante con footer)
□ 1.e  Nº / Editar / Copiar / HTML → palabras subrayables al pie del panel OPL
□ 2    Banner onboarding → overlay sutil top-right del canvas
□ 3    Inspector vacío → solo texto italic, sin metadatos ni botón
□ 4    DDR 0007 sobre floating buttons + decisión (eliminar / mover a palette)
□ 5    Breadcrumb → "sistema · system diagram"
□ 6    Glifos toolbar con color canónico de clase
□ 7    Filtrar por selección → palabra subrayable, no checkbox
□ 8    "Edicion" → "Edición"
□ 9    LIVE → unificar o eliminar
□ 11   Caret ▾ del árbol condicional a hijos
□ 12   overflow: hidden en paper container
□ 13   Inspector header sin "System Diagram" en estado vacío
□ bun run visual:gate verde
```
