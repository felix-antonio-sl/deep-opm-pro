# Acta — nominación y realización propia de OpForja del reuso de tipos (reemplaza «Template» y «Stereotype»)

**Fecha:** 2026-06-24 · **Tipo:** consenso deliberativo (skill `consenso-deliberativo` v1.0.1) · **Modo:** orquestación (3 subagentes reales, independencia epistémica)
**Panel:** **Steve Jobs** (gusto/sustracción/inevitabilidad) · **Steipete + `cat-thinking`** (rigor categorial + ejecución) · **Allan-Kelly + `mente-omega`** (pentamotor Φ/Ψ/Ξ/Δ/Σ + filtro de valor)
**Encargo del operador:** repensar DESDE CERO, de la forma más propia, lo que OpCloud llama *Template* y *Stereotype* — orgánica, funcional, canónica-OpForja, cognitivamente amable, rigurosa categorialmente. Nominar y realizar lo nuestro, no copiar.
**Resultado:** **CONSENSO** sobre el eje (triple aceptación) + 1 ciclo de corrección (3 objeciones críticas convergentes resueltas).

---

## Síntesis final (corregida)

OpForja **no tiene** «Template» ni «Stereotype». Tiene **dos verbos que el modelador ejecuta y un acto de gobernanza que los habilita**, sobre una sola estructura categorial.

### Nominación propia (autoridad)
- **Calcar → un Calco** (modo Σ): traer una **copia desacoplada**, identidad fresca, mutable, que **olvida el vínculo**. Es lo que D6 ya construyó (hoy mal-nombrado «estereotipo/vitrina/plantilla»): **renombrar a Calco**. Beneficiario: el **explorador/prototipador** (≈80% diario). No requiere biblioteca gobernada.
- **Anclar → un Anclaje (a una Pieza)** (modo Δ): traer una **referencia viva** a un tipo de biblioteca gobernada, que **preserva el vínculo** (herencia continua, view-only, validación activa). Es el kernel anchor (corte-1). Beneficiario: el **comparador** (gist: dos modelos comparables porque comparten Pieza). El nombre «Anclaje» es la **condición de auditabilidad**: el eval de composabilidad necesita nombrar el estado.
- **Pieza**: entrada de un **registro global gobernado** de tipos reusables. (Provisional — ver Riesgo: «Pieza» es el término más débil del trío de cara al modelador de dominio.)
- **Soltar**: convertir un Anclaje en Calco (Δ→Σ). Permitido, pero es **pérdida irreversible de comparabilidad** — se comunica con fricción proporcional al daño, no se trivializa.
- (Prohibidos en la cara: «Template», «Stereotype», «Vínculo{modo}».)

### Las tres capas (resuelven la tensión uno-vs-dos: operan en planos distintos)
- **KERNEL (mantenedor):** **una** estructura — la adjunción **Σ ⊣ Δ** inducida por un único funtor de reindexación `i : C_biblioteca → C_modelo`. Calco y Anclaje son sus **dos caras**, no dos subsistemas. **`Unlink = Σ`** (soltar un Anclaje y materializar un Calco son la misma operación). **Sin Π** (sin beneficiario), **sin bisimulación** (la composición de modelos es **pullback estático**, gate de CI), **sin `Vínculo{modo}` en la cara**.
- **FRONTERA (modelador):** **dos** sustantivos de primera clase (Calco / Anclaje), porque la diferencia mono-preservado/mono-olvidado es **diferencia de naturaleza, no un flag**. Cada uno con beneficiario nombrado.
- **PUERTA (cognición):** un gesto de entrada amable (traer una Pieza al canvas) con **default brutal** (Calcar es el default; el 80% no decide conscientemente). **La elección Calcar/Anclar se toma EN EL GESTO de traer desde la Pieza** (mientras el morfismo `i` existe) — **no** es «disponibilidad contextual» que el sistema infiera después (corrección crítica). La biblioteca de Piezas es un **origen distinto y visible**: traer de tu propio modelo solo Calca; traer de la biblioteca ofrece ambos, porque **ahí sí hay base**. Sin magia de aparición.

### Cuarto actor (corrección crítica de bootstrap)
- **CURADOR de biblioteca** (admin-only): la biblioteca de Piezas se **produce**, no solo se consume. Falta el **verbo de fundación**: **promover** un tipo (p. ej. del bundle gist) a **Pieza gobernada** del registro. **No es gesto de modelador — es gobernanza**, y es **exactamente lo que la doctrina custodio-kora (a) debe legislar**. La grieta de bootstrap (huevo-y-gallina: no se ancla sin Pieza, no hay Pieza sin fundarla) y la condición doctrinal (a) **son el mismo hueco**. Sin este verbo, el Anclaje no puede arrancar.

### Invariantes irreducibles (kernel)
- **(i) Gobernanza de base — EVOLUTIVA, no solo «gobernada»:** las mutaciones de una Pieza deben ser **morfismos `b→b'`** (versión compatible) sobre los que `Δ` **re-levanta** (= herencia continua = el valor real del comparador). Distinguir de **CONGELADA** (referencia-a-snapshot). Meta = evolutiva; congelada es piso temporal honesto **solo si se declara**.
- **(ii) Functorialidad de `Δ`** como ley falsable (`Δ(id)=id`, `Δ(g∘f)=Δg∘Δf`) — requiere **ids estables/deterministas** upstream; hoy **enunciada, no verde**.
- **(iii) `Anclar` = view+validate, JAMÁS muta esencia** (estrictamente más conservador que OpCloud, que sí muta esencia). Argumento para desbloquear (a).
- **(iv) Decisión Σ/Δ irrevocable en el injerto:** el Calco es **terminal en procedencia** — puede llevar etiqueta histórica «calcado de X» como **dato muerto de auditoría**, jamás como morfismo vivo; **no habilita re-anclar**.
- **(v) `Σ` no tiene sección** (ningún gesto reconstruye el morfismo de base desde un Calco): ley falsable explícita que hace verdadera la prohibición Calco→Anclaje y el «Soltar = pérdida».

### Sello estratificado (corrección crítica — un solo sello plano miente por omisión)
```
Calco (renombre de D6) ......... DESPLEGADO / validado
kernel-anchor .................. CORTE-1 en código (gate 2818/0; nombres provisionales "Stereotype*" a migrar a "Anclaje*")
leyes-adjunción (ii Δ-funtorial, v Σ-sin-sección, eval Template-adversarial-mutacional) ... ENUNCIADAS, NO verdes
registro-de-Piezas + verbo-de-fundación (curador) + PUERTA contextual ..................... NO construido (atado a doctrina (a))
doctrina custodio-kora (a) R-VIS-STEREO-1: forma OPL del anchor + ¿promover-a-Pieza legal? . PENDIENTE [HITL externo]
```

### Ejecución (blast honesto)
La unificación **real** del kernel (construir el funtor `i` único del que deriven Σ y Δ) **toca persistencia/round-trip = corte propio**, NO un sub-paso del renombre. Lo **ship-able ahora** es la adjunción **como conjunto de leyes falsables** (en `src/leyes/`) que ambos subsistemas existentes (Calco/graft desplegado + Anclaje/anchor corte-1) deben satisfacer — **coherencia por contrato, no fusión de código**. El corte-1 ya va por esa vía.

---

## Razonamiento consolidado

Los tres convergieron, desde lentes incompatibles, en **rechazar la jerga OpCloud** y **nominar por el acto del modelador**. La tensión central —¿uno o dos conceptos visibles?— se **disolvió por capas**: kernel unificado por la adjunción (Steipete), cara bifurcada en dos verbos (Allan), entrada amable con default (Jobs). La refutación adversarial fue el verdadero filtro: **dos lentes distintas (gusto + categoría) atacaron el mismo defecto** («disponibilidad contextual»), lo que probó que era real y no preferencia; y **el filtro de valor (Allan) encontró el actor olvidado** (el curador) que ninguno de los otros vio, anclándolo a la condición doctrinal (a). La síntesis corregida no diluye: cada grieta tiene su cierre falsable (iv, v, verbo-de-fundación, sello-estratificado).

## Aportes por experto

- **Steve Jobs:** la **sustracción de jerga** (cero «Template/Stereotype»); el **default brutal** que protege al 80%; la **prohibición Calco→Anclaje** (honestidad de procedencia, confirmada categorialmente); la **decisión-en-el-gesto** (no propiedad ambiente); concedió que «Anclaje» **es la herramienta del comparador, no deuda** (su mudez le fallaba al 20%).
- **Steipete + cat-thinking:** el **kernel de una adjunción Σ⊣Δ** (Unlink=Σ); los invariantes **(iv) Calco-terminal-en-procedencia**, **(v) Σ-sin-sección**, **(i) gobernanza evolutiva**; el **blast honesto** (leyes, no fusión de kernel); que `Δ` no muta esencia; **Π fuera**.
- **Allan-Kelly + mente-omega:** la **nominación verbo→rastro** (Calcar/Calco, Anclar/Anclaje); **dos beneficiarios** (explorador/comparador); **«Anclaje» = condición de auditabilidad**; el **cuarto actor (curador) + verbo de fundación**; el **sello estratificado**; el filtro de valor que rechaza Π/Plantilla-contenedora sin beneficiario.

## Supuestos aceptados
- La dualidad mono-preservado/mono-olvidado es **estructural** (verificada en pneuma, `icas-adjunciones`), no léxica.
- Ids de Pieza **estables/deterministas** entre versiones (o `Δ` no es funtorial).
- El veredicto de alcance previo (Opción A, set mínimo de validación, B-paridad rechazada) **sigue vigente**.

## Riesgos pendientes
- **Bootstrap sin verbo de fundación** hasta que (a) legisle «promover a Pieza» (admin/curador). Sin él, el Anclaje es promesa de catálogo.
- **Gobernada-congelada construida creyendo que es evolutiva** (el equipo toma el camino fácil; el operador cree que compró herencia continua).
- **Re-nominación del corte-1**: usa nombres provisionales `Stereotype*`/`estereotipoAnclaje` (jerga OpCloud); deben migrar a la nominación propia `Anclaje*` (deuda asumida, adaptador backwards-compat).
- **«Pieza»** podría ser bonita-sin-tracción para el modelador de dominio (quizá solo el curador la toca de frente).
- **«Soltar comunica la pérdida»** necesita encarnación (fricción proporcional, no toast ignorable).

## Incertidumbres
- Frecuencia real con que el explorador-80% trae desde una Pieza (define si la fricción de ver «Anclar» importa) — Jobs la escala como dato a medir.
- Qué dictará el custodio-kora (a) sobre promover-a-Pieza y la forma OPL del anclaje.

## Confianza por experto (no promediada)
- **Steve Jobs:** crítica «disponibilidad contextual» 0.8 (deriva del canon, no de preferencia); 3 aceptaciones 0.85 (hechas contra su propio interés — concedió que su mudez fallaba al 20%).
- **Steipete:** ALTA en frontera+sustracción+kernel; crítica Σ-procedencia resuelta por (iv); auto-corrección honesta del blast (su propia tesis «kernel unificado» reclasificada a leyes-no-fusión).
- **Allan-Kelly:** N1 (alta) en frontera dos-por-dos y kernel una-adjunción; N2 (media-alta) en default+prohibición, **condicionada a cerrar el bootstrap** — cerrada por el verbo de fundación. Confianza sube a alta con la corrección.

Señal unánime: el **eje es robusto**; las tres grietas eran de completitud (un gesto mal ubicado, un actor olvidado, un sello plano), todas con cierre falsable incorporado.

## Metadatos
- Modo: **orquestación** (3 subagentes reales, independencia verificable).
- Fases: convocar · proponer (independiente) · criticar (cruzada 3×2) · sintetizar · refutar (adversarial 3×) · corregir (1 ciclo) · declarar (consenso).
- Objeciones críticas resueltas: **3** (disponibilidad-contextual → decisión-en-gesto + invariante iv; bootstrap → cuarto actor/verbo de fundación; sello plano → sello estratificado).
- No requirió árbitro HITL (steve-jobs ya en panel; no hubo disenso irreductible).
