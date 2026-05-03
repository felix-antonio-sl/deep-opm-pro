---
epica: "EPICA-41"
titulo: "Colaboración — chat del modelo"
slug: "colaboracion-chat"
doc_fuente: "opcloud-reverse/41-colaboracion-chat.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "W"
hu_emitidas: 17
hu_canonicas: 17
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Chat por modelo: panel lateral o popup flotante con mensajes en tiempo real, búsqueda, links internos y externos, contador de no leídos. Toda la épica es `W` para MVP (requiere backend de mensajería). Acceso gateado por permiso de lectura (HU-SHARED-003).

## 2. HU canónicas

### HU-41.001 — Activar "Chat del Modelo" con toggle en barra secundaria
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Toggle on/off. **Criterios:** botón visible para usuarios con lectura. **Patrones:** HU-SHARED-003. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [chat, toggle].

### HU-41.002 — Mostrar panel "Chat del Modelo" en panel izquierdo bajo OPD Navigator
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Ubicación canónica. **Criterios:** panel scrollable con mensajes. **Deps:** Bloqueada por HU-41.001. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [panel].

### HU-41.003 — Ver placeholder cuando no hay mensajes
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Estado vacío. **Criterios:** texto "Sin mensajes". **Deps:** Bloqueada por HU-41.002. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [empty].

### HU-41.004 — Enviar mensaje con Enter o botón
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Enviar comentario. **Criterios:** **Dado** texto + Enter, **cuando** termina, **entonces** se persiste. **Modelo:** `[propuesta]` `mensaje.modeloId`, `mensaje.autorId`, `mensaje.texto`, `mensaje.timestamp`. **Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-41.002. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [enviar, propuesta].

### HU-41.005 — Ver mensaje propio agregado a lista cronológica
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Feedback inmediato. **Criterios:** mensaje aparece en panel. **Deps:** Bloqueada por HU-41.004. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [feedback].

### HU-41.006 — Recibir mensajes de otros colaboradores en tiempo real
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Multi-usuario. **Criterios:** sync via canal de tiempo real (WebSocket o similar). **Deps:** Bloqueada por HU-41.004. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [tiempo-real].

### HU-41.007 — Ver timestamp relativo junto a cada mensaje
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Contexto temporal. **Criterios:** "hace 5 min", "ayer", etc. **Deps:** Bloqueada por HU-41.005. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [timestamp].

### HU-41.008 — Buscar mensajes con campo "Buscar" en el panel
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Encontrar mensaje pasado. **Criterios:** caja filtra. **Deps:** Bloqueada por HU-41.005. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [busqueda].

### HU-41.009 — Insertar link interno a modelo OPCloud
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Referenciar otro modelo. **Criterios:** sintaxis `[[modelo:id]]` se renderiza como enlace. **Deps:** Bloqueada por HU-41.004. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [link, interno].

### HU-41.010 — Insertar link externo (URL)
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** Compartir URL. **Criterios:** auto-detección + abrir en pestaña nueva. **Deps:** Bloqueada por HU-41.004. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [link, url].

### HU-41.011 — Detachar panel a popup flotante draggable
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Mover chat a ventana flotante. **Criterios:** botón "Detachar" convierte panel en popup. **Deps:** Bloqueada por HU-41.002. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [popup].

### HU-41.012 — Minimizar, maximizar y cerrar popup flotante
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Controles de ventana. **Criterios:** tres botones. **Deps:** Bloqueada por HU-41.011. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [popup].

### HU-41.013 — Cerrar panel con toggle y olvidar estado por modelo
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Toggle off oculta. **Criterios:** estado abierto/cerrado no persiste entre modelos. **Deps:** Bloqueada por HU-41.001. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [toggle].

### HU-41.014 — Ver contador de mensajes no leídos sobre toggle
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Notificación. **Criterios:** badge numérico. **Deps:** Bloqueada por HU-41.001. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [badge, no-leidos].

### HU-41.015 — Marcar mensajes como leídos automáticamente al tener panel abierto
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Auto-mark. **Criterios:** mensajes visibles en panel se marcan leídos. **Deps:** Bloqueada por HU-41.014. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [auto-mark].

### HU-41.016 — Gatear acceso al chat por permiso de lectura del modelo
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Solo lectores ven chat. **Criterios:** sin lectura, panel oculto. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-41.001. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [permisos].

### HU-41.017 — Permitir borrado de mensajes solo a rol admin
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Moderación. **Criterios:** solo AO puede eliminar mensajes. **Patrones:** HU-SHARED-003, HU-SHARED-005. **Deps:** Bloqueada por HU-41.005. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [moderacion].

## 3. Preguntas abiertas

| Q | Pregunta |
|---|---|
| Q41.1 | ¿Threading o cronología plana? |
| Q41.2 | ¿Quién recibe notificaciones de nuevos mensajes? |

## 4. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-003, HU-SHARED-005.
- Bloqueada por: EPICA-40 (permisos).
