# Auditoría UX nivel Jobs — opforja (2026-06-12)

**Método**: skill `jobs-web-ux` (15 principios constitucionales + catálogo de anti-patrones), modo `auditar-interfaz`. Auditoría **in-vivo** sobre dev server (`main` f008f8d1): 17 capturas, flujos ejercitados de primera mano — arranque, creación O/P/S por teclado, enlace 1-click y por modo R, in-zoom, simulación conceptual (paso/fases), command palette, tabla de enlaces, abrir/importar, viewport mobile. Capturas en `app/test-results/ux-audit/` (efímeras, no versionadas).

**Norte del veredicto**: ¿la app es inevitable? ¿el copy es interfaz? ¿cada elemento sobrevive la carga de prueba de inclusión?

---

## Veredicto ejecutivo

La base de opforja es **excepcional** para un modelador técnico y no se toca: cero tutorial, keyboard-first real, identidad visual propia, y un arma que ningún competidor tiene — la **bisimetría OPL como feedback semántico continuo** (cada gesto en el canvas produce una oración en español en <100ms; el usuario *lee* lo que acaba de modelar). El producto tiene opinión. No es genérico ni irrecuperable.

Los problemas reales son tres, en orden: **(1) integridad de modo rota** — la edición sigue viva dentro de la simulación y las acciones bloqueadas mueren en silencio; **(2) el surface de poder es ilegible** — la paleta trunca sus etiquetas y su ranking traiciona la intención escrita; **(3) el producto se acusa a sí mismo** — siembra placeholders y luego los denuncia con sugerencias, mientras el inspector entierra lo frecuente bajo lo raro.

---

## CRÍTICO

### C-1 · Fuga de modos: la edición vive dentro de la simulación — y falla en silencio
**Principios violados**: VI (el humano dirige… un modo coherente), VIII (reversibilidad → previsibilidad), XIII (estado del sistema), XV (copy). **Anti-patrón**: Copy Negligence en su forma extrema — ni siquiera hay un "algo salió mal"; hay *nada*.

**Evidencia** (reproducido en vivo): dentro del modo simulación —
1. Click en `Cliente` lo selecciona y muestra las quick-actions de **edición** («Descomp. · Desplegar · estado · Img · Alias»).
2. Presionar `R` activa el **modo enlace**: todas las figuras se iluminan con targets verdes "conectables".
3. Click en el destino (`Facturar 2`): el enlace **no se crea** (readOnly lo bloquea en el store) y **no pasa nada visible**. Sin mensaje, sin shake, sin nada. Los targets verdes siguen invitando.

El sistema invita a actuar y se traga la acción. Es la violación más grave del producto: rompe el contrato de previsibilidad en el modo más vistoso (el que se le muestra a terceros).

**Solución**:
- En modo simulación, **suprimir** las quick-actions de edición y los atajos `O/P/S/R` (gate por `contextoSimulacion !== null` en `atajos.ts` y en el render de la barra contextual). La barra contextual en sim muestra solo lectura: nombre · tipo · «Inspector».
- Toda acción bloqueada por readOnly **habla**, siempre, vía el canal `mensaje` ya existente:
  > «Modo simulación: el modelo es de solo lectura. Sal con ⎋ para editar.»
- Regla general (ley candidata en `src/leyes/`): ningún early-return por readOnly sin `mensaje`. El silencio es el bug, no el bloqueo.

---

## MAYOR

### M-1 · La command palette trunca sus etiquetas
**Principios**: XI (densidad sin caos), XV. La paleta es EL surface del power user y muestra «Abrir como pe…», «Abrir gesti…», «Buscar co…», «Cerrar moda…», «Exportar JSON al portap…» — con espacio en blanco abundante en el propio modal. Tres columnas con headers (MODELO/CREAR/NAVEGAR) que **compiten** con los chips de categoría por ítem (ARCHIVO/EDICION/VISTA): dos taxonomías simultáneas.

**Solución**: una sola columna a lo ancho del modal (o dos máximo), label completo siempre — el verbo y el objeto no se truncan jamás. Eliminar los headers de grupo; el chip derecho ya clasifica. «Cerrar modal (Escape)» no es un comando: fuera de la lista (carga de prueba de inclusión: nadie lo busca, Escape ya está en el footer).

### M-2 · El ranking de la paleta traiciona la intención escrita
**Principio**: XII. Evidencia: escribir `abrir` + Enter ejecutó **«Tabla de Enlaces»**, no «Abrir / importar modelo». El usuario escribió el verbo exacto del comando que quería y obtuvo otra cosa.

**Solución**: prefix-match sobre el *label* domina siempre al fuzzy-match sobre descripción/términos extra. Si la query es prefijo del label de algún comando, esos van primero, en orden de uso reciente.

### M-3 · El producto siembra placeholders y luego los denuncia
**Principios**: IV (default brutal a medias), XIII, I. Evidencia: «Descomponer» siembra `Facturar 1/2/3`; `S` siembra `estado1/estado2`. El diagnóstico salta de 1 → **10 sugerencias** acusando exactamente el scaffolding que el producto acaba de crear. El usuario recibe ruido por obedecer. Y renombrar exige seleccionar cada placeholder y editar en el inspector (3-5 gestos por nombre).

**Solución**:
- Al sembrar, **rename encadenado inline**: el primer placeholder queda en edición de nombre; Enter confirma y salta al siguiente; Escape conserva el nombre sembrado. Cero clicks para nombrar los tres.
- Mientras un placeholder no haya sido tocado, sus sugerencias se **agrupan en una sola**: «3 subprocesos esperan nombre.» El contador de diagnóstico no explota por scaffolding propio.

### M-4 · Inspector sin jerarquía de frecuencia
**Principios**: XI, I. Toda selección despliega 8+ secciones expandidas: Semántica, Notas de mesa, Esencia, Afiliación, Enlaces, Refinamiento, **Extensiones** (5 botones de requisitos/submodelos, casi siempre disabled), Apariciones, Tamaño, Timeline. El 90% de los gestos necesita Nombre, Estados y Enlaces.

**Solución**: Nombre + Semántica abiertos; el resto **colapsado con memoria por sesión**. «Extensiones» entera detrás de un solo disclosure. La sección Tamaño solo si la apariencia tiene override manual.

### M-5 · Jerga interna y bilingüismo en el chrome
**Principio**: XV — el copy es UI. Evidencia literal:
| Hoy | Debe decir |
|---|---|
| `INSPECTOR / Selection` | `INSPECTOR / Selección` |
| `Anotar para la re-elicitación…` | `Anotar duda o pendiente…` |
| Timeline: `Facturar 1 · Y 2483` | `1.º Facturar 1` (la coordenada Y **nunca** se muestra) |
| `MARGINALIA / OPL` | `OPL` a secas (MARGINALIA es jerga del design system) |
| placeholder etiqueta: `componente critico` | `componente crítico` |
| título de ventana: `Modelador OPM` | `Opforja` |

### M-6 · La barra de simulación se contradice
**Principio**: XIII. Evidencia: corriendo a mitad de paso, el status dice «**Listo para simular** · paso 1 de 3 · **completado**» (¿listo o completado?); el contador «proc completado 00/03» convive con la fase "completado" activa.

**Solución**: estados mutuamente exclusivos en `textoProgresoVivo`: «Listo para simular» SOLO en `preparado` sin fase activa; corriendo → «Simulando · paso 1 de 3 · fase: completado». El rótulo de fase nunca se concatena donde puede leerse como estado de la corrida.

---

## MENOR

- **m-1** Conectar con `R` aplica tipo por defecto (consumo) **en silencio**. El default es correcto; falta el anuncio junto al gesto: «Consumo: Cliente → Facturar 2 · cambia el tipo desde el Inspector».
- **m-2** Diálogo «Abrir modelo»: dos buscadores apilados y dos vacíos que dicen lo mismo («Sin modelos en esta carpeta.» ×2); sección «JSON» (→ «Importar JSON»); vacío sin CTA (→ «Aún no hay modelos. Crea uno nuevo o importa un JSON.»); footer «Cancelar Abrir» sin primario visual.
- **m-3** Las quick-actions contextuales se superponen a figuras y enlaces en diagramas densos (evidencia: «Inspector» pisando el rectángulo de Cliente). Reposicionar con detección de colisión contra el bbox de la selección.
- **m-4** Mobile: el canvas no re-encuadra al cambiar el viewport (Cliente cortado al borde). `fitToContent` on-resize ya existe en el kernel del canvas infinito — cablearlo al evento.
- **m-5** `Ctrl+T` aparece en dos comandos distintos de la paleta («Abrir como pestaña» y «Abrir pestaña»): o son el mismo comando duplicado o uno miente.
- **m-6** El inspector vacío («Selecciona un elemento.») ya ofrece «Notas de mesa»: feature de método antes que de contexto. En vacío, solo la frase.

---

## Lo que ya está al nivel — no tocar

1. **Cero tutorial, onboarding ejemplar**: estado vacío con «O objeto · P proceso · R relación», chip «editor vacío · ⌘K», y la sugerencia de siguiente paso («Siguiente paso: conectar **Facturar** que produce **Cliente** [Conectar como resultado]») que crea el primer enlace en 1 click. Primera entidad creada y nombrada en <10 segundos. Principios II y IV cumplidos como pocos productos.
2. **Bisimetría OPL como feedback continuo** — el diferenciador. Cada gesto se verbaliza al instante en español legible. Es trazabilidad semántica nativa (VII en espíritu) y nadie más la tiene.
3. **Keyboard-first real** (XII): O/P/S/R crean, ⌘K completo, atajos visibles en chips y `kbd` inline.
4. **Estado del sistema en el chrome** (XIII): «● Sin guardar ⌃S · ● Auto», contador de oraciones, diagnóstico no-modal colapsado.
5. **Identidad visual propia** (III): el lenguaje editorial Codex (marginalia, hairlines, mono para metadata) hace la app reconocible a 3 metros.

## Anti-patrones del catálogo: presencia

| Anti-patrón | ¿Presente? |
|---|---|
| Copy Negligence | **Sí** — en su forma extrema: silencio total en bloqueos readOnly (C-1) |
| Tutorial Mountain | No — ejemplar al revés |
| Loading Limbo | No — todo es síncrono e instantáneo |
| Settings Paralysis | No |
| Undo Gap | No detectado (undo cubierto por leyes) |

## Recomendación única

**Corte "integridad de modo + silencio cero"** (~2 días):
1. C-1 completo: modo simulación suprime toda affordance de edición; todo early-return por readOnly emite `mensaje`; ley en `src/leyes/` que lo fije.
2. M-1 + M-2: paleta a una columna sin truncado + ranking prefix-first.

Eso repara la confianza (el producto nunca más se traga una acción) y el poder (el surface experto se vuelve legible), que son las dos cosas que un tercero nota en los primeros cinco minutos. M-3..M-6 entran en el corte siguiente.

---

## EJECUTADO 2026-06-12 (mismo día): C-1 + M-1/M-2 + hallazgo extra

El corte recomendado se implementó con TDD (ver HANDOFF § corte UX «integridad de modo + silencio cero»). Hallazgos adicionales durante la ejecución:

- **El silencio era además MENTIRA**: 8 flashes de éxito («✓ Enlace creado», «✓ Objeto creado», …) corrían incondicionales tras un commit rechazado por solo-lectura. La ley `silencio-readonly.test.ts` los cazó todos.
- **Escape no salía de la simulación** pese a que la barra promete «⎋ salir» — la cascada de Escape nunca incluyó `salirModoSimulacion`. Corregido (el copy ahora es verdad).
- La superficie contextual viva en desktop es `CodexSelectionAnnotation`, no `BarraHerramientasElemento` (solo mobile) — el gate readOnly se aplicó en ambas.

**Pendiente de esta auditoría (corte siguiente)**: M-3 (placeholders con rename encadenado + agrupación de sugerencias), M-4 (inspector con jerarquía de frecuencia), M-5 (jerga del chrome — microcopy literal en la tabla), M-6 (estados contradictorios de la barra sim), m-1..m-6.
