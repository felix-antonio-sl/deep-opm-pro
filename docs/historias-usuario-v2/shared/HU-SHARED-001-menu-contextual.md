---
id: "HU-SHARED-001"
titulo: "Menú contextual unificado"
fecha: 2026-05-03
estado: "activo"
tipo_patron: "transversal-ui"
absorbe: ["HU-10.019", "HU-10.020", "HU-12.001", "HU-13.005", "HU-32.007"]
---

## 1. Problema que resuelve

Cinco épicas duplican la mecánica de "menú contextual de tres puntos" sobre distintos contextos (cosa, estado, sub-modelo, apariencia, fila del árbol OPD). Cada épica define su propio juego de criterios, su propia regla de cierre y su propia lista de acciones. La duplicación produce inconsistencia (gestos distintos) y deuda de implementación.

Este patrón canoniza una sola mecánica de menú contextual con un *contrato* uniforme y un *catálogo* de acciones por contexto. Las HU absorbidas conservan su ID con stub que cita la especialización local (qué acciones aplican).

## 2. HU canónica

### HU-SHARED-001 — Menú contextual unificado

**Actor primario:** ME (modelador experto).
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; K secundario (acciones invocan kernel).
**Superficie UI:** canvas-OPD, panel lateral, árbol OPD.
**Gesto canónico:** clic derecho sobre un elemento, o clic sobre el botón "⋯" (tres puntos) que aparece al pasar el cursor.

**Historia:**
> Como modelador, quiero invocar un menú contextual estándar sobre cualquier elemento (cosa, estado, enlace, apariencia, sub-modelo, fila del árbol) para acceder a sus acciones aplicables sin perder el contexto.

**Contexto de negocio:**
La SSOT no prescribe la afordancia de "menú contextual" — es UI. OPCloud lo implementa con un halo radial sobre la cosa y un botón "⋯". Para el modelador, contar con un único patrón consistente reduce la carga cognitiva al cambiar de contexto. La canonización elimina la duplicación documental de 5 épicas.

**Criterios de aceptación:**
- **Dado** un elemento seleccionable en cualquier superficie, **cuando** hago clic derecho sobre él o clic sobre su botón `⋯`, **entonces** se abre un menú contextual posicionado junto al elemento.
- **Dado** que el menú está abierto, **cuando** se renderiza, **entonces** las acciones disponibles corresponden al **catálogo del contexto** (ver §3) y las acciones no aplicables están ocultas (no presentes), no deshabilitadas.
- **Dado** que el menú está abierto, **cuando** clico una acción, **entonces** se ejecuta y el menú se cierra.
- **Dado** que el menú está abierto, **cuando** clico fuera o presiono `Esc`, **entonces** el menú se cierra sin ejecutar acción.
- **Dado** que el modo es read-only, **cuando** abro el menú, **entonces** solo aparecen acciones de lectura (Inspeccionar, Copiar nombre); las acciones de escritura están ocultas. Ver HU-SHARED-003.

**Reglas y restricciones:**
- El menú es modal sobre el contexto: no se puede abrir un segundo menú sin cerrar el primero.
- El menú no oscurece el canvas completo; se ancla al elemento.
- La invocación múltiple sobre el mismo elemento (clic derecho repetido) reabre el menú actualizado.
- Sombra y estilo siguen JOYAS §1, §8.

**Modelo de datos tocado:**
- Estado UI transitorio: `ui.menuContextual = { abierto: bool, anclajeId: Id, contexto: ContextoMenu }` — transitorio, no persistente.

**Catálogos de acciones por contexto:** ver §3.

**Dependencias:**
- Bloquea a: muchas HU que dependen de gestos sobre elementos seleccionados.

**Integraciones:**
- HU-SHARED-002 (acciones de escritura entran al stack undo/redo).
- HU-SHARED-003 (filtrado por permisos).

**Notas de evidencia:**
- Fuente OPCloud: halo radial + botón `⋯`; observado en transcripciones de EPICA-10, EPICA-12, EPICA-13.
- Evidencia visual: [JOYAS §1] colores, [JOYAS §8] sombra.
- Clase de afirmación: observado + canonizado.

**Prioridad:** M1.
**Tamaño:** M.
**Etiquetas:** [ui, ux, transversal, menu-contextual].

## 3. Catálogos de acciones por contexto

Cada épica que absorbe esta shared declara su catálogo local. La estructura del catálogo es:

```
contexto: <nombre>
acciones-lectura: [...]
acciones-escritura: [...]
acciones-destructivas: [...]
```

| Contexto | Acciones de lectura | Acciones de escritura | Acciones destructivas |
|---|---|---|---|
| **Cosa (entidad+apariencia)** en canvas | Inspeccionar, Copiar nombre, Ver en árbol | Renombrar, Cambiar afiliación, Cambiar esencia, Aplicar estereotipo, Editar descripción | Eliminar (HU-SHARED-005) |
| **Estado** dentro de objeto | Inspeccionar | Renombrar estado, Designar inicial / final / Current, Editar duración | Eliminar estado |
| **Enlace** | Inspeccionar tipo y multiplicidad | Cambiar tipo, Editar etiqueta, Cambiar multiplicidad, Cambiar estilo | Eliminar enlace |
| **Apariencia** (cosa visual sin afectar entidad) | Inspeccionar | Mover al frente / atrás, Cambiar color, Re-anclar | Eliminar solo apariencia (no entidad) |
| **Sub-modelo** | Abrir, Inspeccionar metadatos | Renombrar referencia, Sincronizar | Desvincular |
| **Fila del árbol OPD** | Ver OPD, Inspeccionar | Renombrar OPD, Reordenar, Cambiar tipo refinamiento | Eliminar OPD (con cascada) |
| **Estereotipo** aplicado | Inspeccionar property set | Editar valores | Quitar aplicación |

## 4. Especialización local (cómo se cita en una HU absorbida)

```markdown
#### Ejemplo absorbido: HU-13.005 — Abrir menú contextual sobre estado

**Estado:** absorbida-en-shared (2026-05-03).
**Canónica:** HU-SHARED-001.
**Especialización local:**
- Contexto: Estado.
- Acciones-lectura: Inspeccionar.
- Acciones-escritura: Renombrar estado, Designar inicial, Designar final, Designar Current, Editar duración.
- Acciones-destructivas: Eliminar estado.
**Citas SSOT preservadas:** [V-237] designación Current; [Glos 3.71a] designación de estado.
**Fuente OPCloud:** opcloud-reverse/13-canvas-estados.md §3.2.
```

## 5. HU absorbidas (lista viva)

Lista de HU que se convierten en stub con redirección a HU-SHARED-001 al refactorizar cada épica:

- `HU-10.019` — Abrir menú contextual de cosa.
- `HU-10.020` — Acceder acciones del menú contextual.
- `HU-12.001` — Menú radial al hacer clic derecho sobre proceso (descomposición).
- `HU-12.003` — Acción "Descomponer" desde menú radial.
- `HU-13.005` — Menú contextual sobre estado (designaciones).
- `HU-17.NNN` — Menú contextual sobre clase / atributo / instancia.
- `HU-20.NNN` — Menú contextual sobre fila del árbol OPD.
- `HU-32.007` — Menú contextual sobre sub-modelo en canvas.
- (Otras detectadas durante la refactorización se agregan aquí.)
