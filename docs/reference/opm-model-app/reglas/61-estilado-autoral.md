# 61 — Estilado autoral

**Alcance**: capa paralela de apariencia aplicada por el modelador, defaults y coherencia, reserva de canales, rótulo, bitmap decorativo, tamaño y aspect ratio, normalización léxica, exportación.
**Capa SSOT propietaria**: `opm-visual-es.md` §22
**Aplicación en la app**: paleta autoral, opciones de UI, exportador.

## Reglas

### R-2500: V-207 — Admisibilidad del estilado autoral

- Enunciado: el estilado autoral es admisible siempre que NO colisione con los canales visuales reservados a la gramática OPM, a la simulación, a la validación ni a la UI de edición.
- Referencia SSOT: V-207
- Aplicación en código: el estilado autoral se aplica tras verificar conformidad con canales reservados.

### R-2501: V-208 — Default convergente al esquema canónico

- Enunciado: en ausencia de estilado autoral explícito, toda implementación conforme DEBE converger a un esquema por defecto coherente con §1.1b, §16.1 y la tipografía canónica declarada.
- Referencia SSOT: V-208
- Aplicación en código: la paleta default aplica los colores canónicos (objeto verde, proceso azul oscuro, estado verde oliva).

### R-2502: V-209 — Coherencia intra-OPD

- Enunciado: dentro de un mismo OPD, las cosas de igual clase semántica DEBEN compartir la misma base cromática y tipográfica, salvo variante autoral explícitamente declarada.
- Referencia SSOT: V-209
- Aplicación en código: la paleta aplica colores por clase de forma uniforme; variantes requieren declaración explícita.

### R-2503: V-210 — Canales reservados no reutilizables

- Enunciado: el estilado autoral NO puede reutilizar sin distinción:
  - rojo, amarillo de alerta o verde de conformidad como semántica tácita
  - discontinuidad de borde para marcar operaciones transitorias
  - cromatismo o halo reservado a simulación
  - marcas reservadas a validación o error
- Referencia SSOT: V-210
- Aplicación en código: validador de estilado advierte si se usan estos canales sin semántica apropiada.

### R-2504: V-211 — Rótulo con legibilidad obligatoria

- Enunciado: la familia tipográfica, peso, tamaño, color y alineación del rótulo pertenecen a la capa autoral. Sin embargo, el rótulo NO puede salir del bounding box visible NI perder legibilidad por contraste insuficiente.
- Referencia SSOT: V-211
- Aplicación en código: validador de rótulo verifica contraste mínimo y contención.

### R-2505: V-212 — Sin truncamiento silencioso

- Enunciado: el canon-diagrama NO admite truncamiento silencioso del rótulo. La herramienta DEBE expandir, reubicar o rechazar el resize antes que exportar una elipsis NO declarada.
- Referencia SSOT: V-212
- Aplicación en código: exportador verifica integridad del rótulo; si no cabe, aborta o declara variante.

### R-2506: V-213 — Bitmap decorativo sin ocluir

- Enunciado: una implementación puede permitir imagen bitmap decorativa dentro de una cosa, pero esa imagen NO puede ocluir contorno, sombreado, estados ni rótulo. Su estatus es **decorativo, NO semántico**, salvo que la SSOT lo promueva explícitamente.
- Referencia SSOT: V-213
- Aplicación en código: bitmap en capa inferior, con opacidad controlada para no ocluir geometría OPM.

### R-2507: V-214 — Prioridad a geometría OPM sobre bitmap

- Enunciado: cuando el refinamiento o el contenido interno entre en conflicto con el bitmap decorativo, la prioridad la tiene siempre la **geometría OPM interna**. La imagen DEBE suprimirse, atenuarse o quedar excluida del canon exportado.
- Referencia SSOT: V-214
- Aplicación en código: al refinar una cosa con bitmap, el bitmap se suprime automáticamente o se desplaza.

### R-2508: V-215 — Tamaño con bandas de aspect ratio

- Enunciado: el tamaño de una cosa puede variar por decisión autoral, pero NO hasta el punto de impedir legibilidad, contención del rótulo o identificación de sus decoraciones. La implementación DEBE declarar bandas de aspect ratio admisibles o una política de autoajuste equivalente.
- Referencia SSOT: V-215
- Aplicación en código: ADR documenta bandas por clase de cosa.

### R-2509: V-216 — Normalización léxica trazable

- Enunciado: la normalización léxica organizacional, los alias de casing o las reescrituras automáticas del rótulo NO pueden aplicarse silenciosamente como si fueran mero estilado. DEBEN ser trazables como política de normalización o como metadato reversible del modelo.
- Referencia SSOT: V-216
- Aplicación en código: cada normalización deja registro reversible; el modelador puede revertir.

### R-2510: V-217 — Normalización en export

- Enunciado: salvo declaración contraria del perfil de export, el canon-documento y el canon-diagrama DEBEN normalizar el estilado autoral hacia el esquema canónico de la SSOT. El estilado autoral se conserva como capa editable del canvas, NO como condición de conformidad del artefacto exportado.
- Referencia SSOT: V-217
- Aplicación en código: exportador aplica normalización; el perfil puede declarar preservación autoral explícita.

### R-2511: Esquema por defecto

- Enunciado: el esquema por defecto incluye:
  - **Objeto**: rectángulo, borde verde, fondo transparente/blanco
  - **Proceso**: elipse, borde azul oscuro, fondo transparente/blanco
  - **Estado**: rountangle, borde verde oliva, fondo gris claro
  - **Enlaces**: negros por defecto
  - **Tipografía**: sans-serif, negro, tamaño proporcional al bounding box
- Referencia SSOT: §1.1b, V-208, V-63
- Aplicación en código: `paleta.ts` implementa este default.

### R-2512: V-228 — Rótulos en negro en canon-diagrama

- Enunciado: en el canon-diagrama los rótulos dentro del grafo permanecen en **negro por defecto**, salvo que la SSOT promueva expresamente otro comportamiento. El cromatismo de clase se preserva primariamente en bordes, líneas y decoraciones semánticas.
- Referencia SSOT: V-228
- Aplicación en código: paleta canon-diagrama fija color de texto a negro.

### R-2513: V-230 — Cromatismo en canon-documento

- Enunciado: los listados textuales del canon-documento pueden extender el cromatismo de clase a nombres fuera del grafo, siempre que el perfil lo declare y no contradiga el canon-diagrama.
- Referencia SSOT: V-230
- Aplicación en código: canon-documento puede usar color en índices si se declara.

### R-2514: Autoral vs semántico — principio rector

- Enunciado: el estilado autoral **NO altera la semántica** del modelo. La misma cosa puede tener diferentes estilados autorales en diferentes instalaciones, pero la gramática OPM debe ser reconocible.
- Referencia SSOT: V-207
- Aplicación en código: auditoría de conformidad se aplica a la gramática, no al estilado.

### R-2515: Aspect ratio: rangos recomendados

- Enunciado: rangos recomendados (documentados en ADR):
  - Objeto: 0.4 ≤ h/w ≤ 2.0
  - Proceso: 0.3 ≤ h/w ≤ 1.5
  - Estado: 0.3 ≤ h/w ≤ 1.2
- Referencia SSOT: V-215 (la SSOT obliga a declarar, no prescribe valores)
- Aplicación en código: validador emite warning fuera de rango.

### R-2516: Contraste mínimo de rótulo

- Enunciado: el contraste entre rótulo y fondo DEBE cumplir un mínimo recuperable (ej. ratio WCAG AA ≥ 4.5:1 para texto normal). Si el fondo es bitmap o imagen decorativa, verificar contraste contra la zona donde cae el texto.
- Referencia SSOT: V-211 (legibilidad obligatoria)
- Aplicación en código: validador de rótulo chequea contraste.

### R-2517: Consistencia tipográfica

- Enunciado: una vez elegida la familia tipográfica autoral, DEBE mantenerse consistente en todo el OPD y preferentemente en todo el modelo.
- Referencia SSOT: V-209
- Aplicación en código: la paleta incluye familia tipográfica única por modelo.

### R-2518: Variantes autorales declaradas

- Enunciado: toda variante autoral (uso distinto de color en una cosa concreta, tipografía distinta, tamaño distinto) DEBE declararse como excepción explícita, no como incoherencia tácita.
- Referencia SSOT: V-209
- Aplicación en código: el modelo admite `apariencia.estiloAutoral` como override explícito.

### R-2519: Bitmap con licencia y referencia

- Enunciado: si se incorpora bitmap decorativo en el canon, DEBE resolverse al exportar (V-236) o declararse referenciado. No se admite ruta relativa implícita al filesystem.
- Referencia SSOT: V-236
- Aplicación en código: bitmaps embebidos o por URI; no paths locales.

### R-2520: Política de estilado por perfil

- Enunciado: el perfil de export puede declarar:
  - **normalizado**: aplica esquema canónico; descarta estilado autoral
  - **preservado**: mantiene estilado autoral, verifica que no colisione con canales reservados
- Referencia SSOT: V-217
- Aplicación en código: flag `preservarEstilado: boolean` en configuración de export.

## Checklist

- [ ] Defaults convergentes al esquema canónico
- [ ] Coherencia intra-OPD en clase semántica
- [ ] No reutilizar canales reservados sin distinción
- [ ] Rótulo legible y contenido en bounding box
- [ ] Sin truncamiento silencioso
- [ ] Bitmap decorativo no ocluye geometría OPM
- [ ] Geometría prevalece sobre bitmap en conflicto
- [ ] Bandas de aspect ratio declaradas por clase
- [ ] Normalización léxica trazable y reversible
- [ ] Export normaliza por defecto; preserva solo si perfil lo declara
- [ ] Rótulos en negro en canon-diagrama
- [ ] Cromatismo de clase en canon-documento si se declara
- [ ] Contraste de rótulo ≥ mínimo
- [ ] Familia tipográfica consistente por modelo
- [ ] Variantes autorales como excepciones declaradas
- [ ] Bitmaps resueltos en export, no paths locales

## Antipatrones

- Usar rojo para un objeto "importante" (reservado a validación)
- Borde discontinuo autoral en una cosa sistémica (colisiona con ambiental)
- Bitmap decorativo que oculta parcialmente el rótulo
- Normalización silenciosa de mayúsculas ("sistema" → "Sistema") sin registro
- Tipografía distinta en cada cosa del mismo OPD
- Rótulo azul oscuro en canon-diagrama (debe ser negro por defecto)

## Referencias cruzadas

- Primitivas (defaults): `10-primitivas-cosas.md`
- Canon y export: `01-canon-exportacion.md`, `63-exportacion-canonica.md`
- UI y afordances: `60-ui-afordances-canvas.md`
- Layout y rótulo: `20-layout-visual-opd.md`
- Validación: `62-validacion-marcas-error.md`
- Estereotipos (normalización): `52-estereotipos-requirement.md`
