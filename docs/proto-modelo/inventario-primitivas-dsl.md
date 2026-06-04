# Inventario de primitivas del DSL de autoría contra el catálogo de hechos OPL

**Item:** W1.4 del backlog contingencial (`docs/roadmap/backlog-contingencial.md:29`).
**Fecha:** 2026-06-04.
**Naturaleza:** análisis de solo lectura. No modifica producto. **Cierra el alcance de L2** (qué podrá garantizar el compilador proto→Modelo) y **fija el insumo de W4.1** (qué primitivas faltan al DSL).
**Custodia:** este documento vive en `deep-opm-pro` junto al resto de la familia proto-modelo (`gramatica-subdialecto-v0.md`).

## Marco

Tres superficies, no una:

- **Catálogo OPL (Lado A)** — qué hechos sabe *verbalizar* el forward (`opl/generadores/`), qué sabe *parsear* el reverse (`opl/parser/parsear.ts` → `planificar.ts`) y qué sabe *aplicar* el reverse al modelo (`opl/parser/aplicar.ts`). El reverse hoy está **cerrado a 23/23 clases estrictas** (memoria de proyecto; `aplicar.ts` invierte abanicos, modificadores, demoras y autoinvocación — ver §"Nota sobre el header obsoleto").
- **DSL de autoría (Lado B)** — la superficie programática `crearAutor()` en `app/src/autoria/dsl.ts`, que es lo que hoy usa el corpus HODOM para construir el modelo "a mano" (`hd-opm/scripts/generar-bundle-hodom.ts`, 188 destructura `entidad, atributo, atributoEstados, estados, opd, ver, enlazar, refDescomp, refDespliegue, refDespliegueExh, refDespliegueGen`).
- **Kernel (Lado C)** — las operaciones puras `Resultado<Modelo>` en `app/src/modelo/operaciones.ts` (barrel), `abanicos.ts`, `modificadores.ts`, `autoinvocacion.ts`, etc. Es el techo de lo que el DSL *podría* exponer con esfuerzo bajo (delegación directa) frente a lo que exige trabajo de kernel.

La tesis de W4.1: **el DSL es un subconjunto estrecho del kernel**. El forward verbaliza casi todo el kernel; el DSL deja afuera familias enteras que el corpus HODOM hoy **codifica por workaround** o **no puede codificar**.

## 1. Tabla maestra

Convención de la columna DSL: **sí** = primitiva/opción dedicada; **parcial** = se puede expresar pero con limitaciones (p.ej. sin las variantes que el forward sí emite); **no** = no hay superficie.

| # | Clase de hecho OPL | Forward (generador) | Reverse (parser→aplica) | Primitiva DSL (`archivo:línea`) | Operación kernel disponible | Uso en HODOM (corpus / workaround) |
|---|---|---|---|---|---|---|
| 1 | Cosa: objeto/proceso + esencia + afiliación | sí · `estructural.ts:35 oracionEntidad` | sí · `aplicar.ts:71 crear-entidad` | **sí** · `dsl.ts:118 entidad()` | `crearObjeto/crearProceso` + `cambiarEsencia/cambiarAfiliacion` | sí (250 `entidad`) |
| 2 | Atributo (objeto inf./sist. con value slot) | sí · `estructural.ts:51 oracionValorAtributo` | parcial · `parsear.ts:1100 parsearMetadata "X es V"` (valor); el slot no se reconstruye | **sí** · `dsl.ts:134 atributo()` / `:142 atributoEstados()` | (azúcar sobre `entidad` + flag `esAtributo`/`valorSlot`) | sí (`atributo`/`atributoEstados`) |
| 3 | Valor de atributo (`X es V [unidad]`) | sí · `estructural.ts:51` | parcial · `parsearMetadata` valor/unidad; no setea `valorSlot.valor` ni `unidad` por op kernel | **parcial** · DSL no expone setear valor; kernel sí | `asignarValorAtributo`, `cambiarTipoValorAtributo` (barrel `operaciones.ts:36`) | no |
| 4 | Estados (state set ≥2) | sí · `designaciones.ts`/`duracionMetadata.ts:65 oracionEstados` | sí · `aplicar.ts:97 sincronizar-estados` | **sí** · `dsl.ts:148 estados()` | `crearEstadosIniciales`, `renombrarEstado`, `agregarEstado` | sí (63 `estados`) |
| 5 | Designación de estado (inicial/final/default/current) | sí · `designaciones.ts:25 oracionDesignacionEstado` | sí · `aplicar.ts:109 aplicar-designacion-estado` | **parcial** · `dsl.ts:148 estados(…, inicial, final)` cubre inicial/final; **default/current NO** | `designarEstadoInicial/Final` (barrel `:52`); default/current vía `designaciones` del estado | sí (inicial/final; `:719`) |
| 6 | Duración de estado (min/nom/max) | sí · `duracionMetadata.ts:42 formatearDuracion` | **no** (no parsea "Duracion Minima/Esperada/Maxima") | **no** · DSL no expone `estado.duracion` | escritura directa de `estado.duracion` (no hay op dedicada) | no |
| 7 | Procedimental: agente (`maneja`) | sí · `procedural.ts:214` | sí · `crear-enlace` | **sí** · `dsl.ts:232 enlazar(…, "agente")` | `crearEnlace` | sí (64) |
| 8 | Procedimental: instrumento (`requiere`) | sí · `procedural.ts:216` | sí | **sí** · `enlazar(…, "instrumento")` | `crearEnlace` | sí (82) |
| 9 | Procedimental: consumo (`consume`) | sí · `procedural.ts:221` | sí | **sí** · `enlazar(…, "consumo")` | `crearEnlace` | sí (1) |
| 10 | Procedimental: resultado (`genera`) | sí · `procedural.ts:223` | sí | **sí** · `enlazar(…, "resultado")` | `crearEnlace` | sí (60) |
| 11 | Procedimental: efecto (`afecta`) | sí · `procedural.ts:225/387` | sí | **sí** · `enlazar(…, "efecto")` | `crearEnlace` | sí (93) |
| 12 | Procedimental: invocación (`invoca`) | sí · `procedural.ts:227` | sí | **sí** · `enlazar(…, "invocacion")` | `crearEnlace`/`crearInvocacion` | sí (38) |
| 13 | Transición de estado escindida TS3 (consumo `de s1`+resultado `a s2`) | sí · `procedural.ts:141 transicionesEstado` | sí | **sí** · `enlazar` con `entrada:`/`salida:` sobre el destino | `crearEnlace` a extremos estado (`extremoEstado`) | sí (51 `entrada` / 54 `salida`) |
| 14 | Transición TS3 compacta (efecto entidad→entidad con `estadoEntradaId/SalidaId`) | sí · `procedural.ts:387 oracionEfecto` (BUG-f314c4) | sí · ETS2 reancla al metadato | **no** · `dsl.ts:252` solo escribe `estadoEntradaId/SalidaId` cuando el destino es entidad y opts.entrada/salida nombran estados *de ese destino* — no el caso compacto proceso→objeto | escritura directa del par en el enlace efecto | no (HODOM usa la vía escindida #13) |
| 15 | Transición parcial TS4 (`cambia X a s` / solo entrada) | sí · `procedural.ts:406-411` | sí | **parcial** · vía `entrada:` o `salida:` sola | `crearEnlace` estado-parcial | parcial |
| 16 | Habilitador con estado HS (`Operador en \`s\` maneja`) | sí · `procedural.ts:320/325` | sí · gramática HS | **parcial** · `enlazar` con extremo `{estado, entidad}` en origen (vía `extremo()` `tipos.ts:13`) | `crearEnlace` a `extremoEstado` | parcial (se usa estado-en-extremo) |
| 17 | Modificador evento (E) | sí · `procedural.ts:276 oracionEvento` | sí · `planificar.ts` evento → `aplicarModificador` | **parcial** · `enlazar(…, {modificador:"evento"})` `dsl.ts:245` | `aplicarModificador(…, "evento")` | sí (9 `modificador:"evento"`) |
| 18 | Modificador condición (C) | sí · `procedural.ts:309 oracionCondicion` | sí · `planificar.ts` condicion | **parcial** · `enlazar(…, {modificador:"condicion"})` `dsl.ts:245` | `aplicarModificador(…, "condicion")` | no |
| 19 | Modificador NO (negación) | sí · `procedural.ts:347 oracionNegada` | parcial · forward emite; reverse no lo planifica como `no` | **no** · `dsl.ts:244` solo mapea evento/condicion; `"no"` cae a `modificador` sin subtipo | `aplicarModificador(…, "no")` | no |
| 20 | Probabilidad de evento (`Pr=…`) | sí · `procedural.ts:472 sufijoProbabilidad` | parcial · parser **descarta** el sufijo (`parsear.ts:713`) | **no** | `definirProbabilidad` (`modificadores.ts:62`) | no |
| 21 | Demora de invocación (`después de Ns`) | sí · `procedural.ts:228` | sí · `aplicar.ts:225 definirDemora` | **no** · `OpcionesEnlace` (`tipos.ts:16`) no tiene `demora` | `definirDemora` (`modificadores.ts:89`) | no |
| 22 | Autoinvocación (`se invoca a sí mismo`) | sí · `procedural.ts:209 esAutoInvocacion` | sí · `aplicar.ts:161 crearAutoInvocacion` | **no** · no hay método; un `enlazar(self,self,"invocacion")` no desvía a la op kernel | `crearAutoInvocacion` (`autoinvocacion.ts:5`) | no |
| 23 | Excepción sobretiempo/subtiempo (`ocurre si duración … excede/menor que`) | sí · `procedural.ts:229-234` | sí · `parsear.ts:534 parsearExcepcion` | **no** | `definirTiempoExcepcionEnlace` (barrel `:128`) | no |
| 24 | Estructural: agregación (`consta de`) | sí · `estructural.ts:68` | sí · `planificar.ts estructural` | **sí** · `enlazar(…, "agregacion")` | `crearEnlace` | sí (102) |
| 25 | Estructural: exhibición (`exhibe` / `tiene … opcional`) | sí · `estructural.ts:70` | sí | **sí** · `enlazar(…, "exhibicion")` | `crearEnlace` | sí (29) |
| 26 | Estructural: generalización (`es un` / `son`) | sí · `estructural.ts:75` | sí | **sí** · `enlazar(…, "generalizacion")` | `crearEnlace` | sí (6 — **es el workaround de XOR**, ver #30) |
| 27 | Estructural: clasificación/instanciación (`es una instancia de`) | sí · `estructural.ts:77` | sí | **sí** · `enlazar(…, "clasificacion")` | `crearEnlace` | no |
| 28 | Enlace etiquetado/tagged (`X <verbo> Y`) | sí · `procedural.ts:257 oracionTagged` | **no** (parser no invierte tagged) | **sí** · `enlazar(…, "etiquetado", {etiqueta})` | `crearEnlace` tipo etiquetado | sí (10 `etiquetado`) |
| 29 | Etiquetado bidireccional + backwardTag | sí · `procedural.ts:265` | **no** | **parcial** · `enlazar(…, "etiquetadoBidireccional")` existe pero `OpcionesEnlace` no tiene `backwardTag` | `definirBackwardTag` (barrel `:127`) | no |
| 30 | **Abanico XOR/OR** (`exactamente/al menos uno de …`) | sí · `abanico.ts:44 oracionAbanico` | sí · `aplicar.ts:405 formarAbanico` | **no** · ningún método forma abanicos | `formarAbanico` (`abanicos.ts:23`) · `alternarOperadorAbanico` · `definirProbabilidadesAbanico` | **workaround**: HODOM modela XOR vía gen-spec (un proceso general + N especializaciones por `generalizacion`), comentado explícitamente como "abanico XOR" (`generar-bundle-hodom.ts:166,387,877,1638-1640`) — NO usa `formarAbanico` (0 llamadas) |
| 31 | Multiplicidad de extremo (prefijo `2..N`, `+`, `*`) | sí · `refsHints nombreOplConMultiplicidad`; parser `parsear.ts:17` | sí · `crear-enlace` propaga `multiplicidad*` | **parcial** · `enlazar(…, {multiplicidadDestino})` `dsl.ts:254`; **no** hay `multiplicidadOrigen` | `ajustarMultiplicidad`/`validarMultiplicidad` (barrel `:58`) | parcial (8 `multiplicidadDestino`; sin origen) |
| 32 | Ruta etiquetada (`Por ruta <et>, …`) | sí · `procedural.ts:31 oracionEnlaceConRuta` | sí · `parsear.ts:138` prefijo ruta | **no** · `OpcionesEnlace` no tiene `rutaEtiqueta` | escritura de `enlace.rutaEtiqueta` (`rutas.ts`) | sí (15 etiquetas, pero como **etiqueta de enlace** `etiqueta:`, no como ruta-OPL formal) |
| 33 | Etiqueta de enlace (`[etiqueta: …]`) | sí · `procedural.ts:270 conEtiquetaEnlace` | sí · `parsear.ts:5 ETIQUETA_SUFIX` | **sí** · `enlazar(…, {etiqueta})` `dsl.ts:251` | `crearEnlace` con `etiqueta` | sí (16 `etiqueta:`) |
| 34 | Tasa (rate) de consumo/resultado/efecto | sí (metadata) | parcial | **no** | `definirTasaEnlace` (barrel `:128`) | no |
| 35 | Requisitos de enlace | sí (metadata) | parcial | **no** | `definirRequisitosEnlace`, `crearRequisito`, `marcarEntidadComoRequisito` (barrel `:128,:140`) | sí (1 `requisito`, vía edición fuera del DSL) |
| 36 | Refinamiento por descomposición (in-zoom de proceso) | sí · `refinamiento.ts:82 oracionDescomposicion` | parcial · `parsearContexto` (`parsear.ts:1110`) **no aplica** (warning `unsupported-kernel`) | **sí** · `dsl.ts:169 refDescomp()` | `descomponerProceso` (barrel `:19`) | sí (26) |
| 37 | Refinamiento por despliegue/agregación (unfold) | sí · `refinamiento.ts:76` | parcial · contexto no-aplicable | **sí** · `dsl.ts:173 refDespliegue()` | `desplegarObjeto` | sí (10) |
| 38 | Despliegue por exhibición | sí · `refinamiento.ts:77` | parcial | **sí** · `dsl.ts:177 refDespliegueExh()` | `desplegarObjeto` modo exhibicion | sí (3) |
| 39 | Despliegue por generalización | sí · `refinamiento.ts:78` | parcial | **sí** · `dsl.ts:181 refDespliegueGen()` | `desplegarObjeto` modo generalizacion | sí (1; soporte del workaround XOR #30) |
| 40 | Plegado parcial (`se lista con … N más`) | sí · `plegado.ts:11` | informacional · `parsear.ts:1069` (vista, no muta) | **no** (es vista, no autoría) | `plegarGrupoEstructural` (barrel `:71`) | n/a (vista) |
| 41 | Procesos en paralelo (`… ocurren en paralelo`) | sí · `refinamiento.ts:105 oracionParalelo` | **no** | **no** (derivado de geometría in-zoom) | derivado del layout | indirecto |
| 42 | Submodelos (conectar/materializar) | parcial | no | **no** | `conectarSubmodelo`, … (barrel `:147`) | no |
| 43 | Ontología organizacional | parcial | no | **no** | `definirOntologiaOrganizacional` (barrel `:133`) | no |
| 44 | OPD (declaración + jerarquía padre) | n/a (estructura) | n/a | **sí** · `dsl.ts:103 opd()` | (estructura de modelo) | sí |
| 45 | Aparición (`ver` — geometría inicial) | n/a | n/a | **sí** · `dsl.ts:186 ver()` (+ `estadosSuprimidos`) | apariencias (`moverApariencia`…) | sí |
| 46 | Descripción/metadata de cosa (`se describe como`) | sí · `duracionMetadata.ts:23` | parcial · `parsearMetadata` descripcion | **sí** · `entidad(…, descripcion)` `dsl.ts:118` | (campo `descripcion`) | sí (descripciones embebidas) |

## 2. Registro de exclusiones de L2

Lo que el compilador proto→Modelo (L2) **no podrá garantizar** hasta cerrar cada hueco. Es el complemento operativo de las exclusiones ya declaradas en el backlog (`backlog-contingencial.md:95`: "abanicos (hasta W4.1) y clase-ancla (hasta W5.1)"). Aquí se priorizan **por presión real del corpus HODOM**.

> **CERRADAS por W4.1 (2026-06-04).** La Tanda 1 (esfuerzo bajo, delegación 1:1 al kernel) quedó **implementada y cubierta por tests** en el DSL: abanico XOR/OR (#30), multiplicidad de origen (#31), demora de invocación (#21), autoinvocación (#22), modificador NO (#19) y designaciones default/current (#5). Superficie: `app/src/autoria/dsl.ts` (`abanico()`, `autoinvocacion()`, `designarEstado()`, y `OpcionesEnlace.multiplicidadOrigen|demora|modificador:"no"` en `tipos.ts`). Tests: `app/src/autoria/dsl-primitivas.test.ts` (23 tests: feliz + error de kernel + round-trip OPL por primitiva). Cambios ADITIVOS puros (golden HODOM no las usa; byte-identidad intacta). Las entradas marcadas `~~CERRADA W4.1~~` abajo dejan de ser exclusiones; las demás siguen abiertas.

### Prioridad ALTA — el corpus ya las necesita y hoy las falsea por workaround

1. ~~**Abanico XOR/OR (#30).**~~ **CERRADA W4.1.** Exclusión rectora resuelta: `dsl.ts:abanico()` delega en `formarAbanico` (replica el pin de puerto compartido del reverse, `aplicar.ts:390-405`, antes de delegar). Elimina la necesidad del workaround gen-spec de HODOM. *(Contexto histórico: HODOM modelaba 6 causales XOR como `generalizacion`+`refDespliegueGen`, comentado "abanico XOR de SD1" en `generar-bundle-hodom.ts:166,387,877,1640`.)*
2. ~~**Multiplicidad de origen (#31).**~~ **CERRADA W4.1.** `OpcionesEnlace.multiplicidadOrigen` escribe el campo espejo de `multiplicidadDestino`; el forward emite el prefijo (`*Despachar* consume 2 **Pedidos**.`). *(Contexto: HODOM usaba 8 `multiplicidadDestino`; el lado origen era inexpresable.)*

### Prioridad MEDIA — soportadas por forward+reverse, sin presión inmediata pero dentro del catálogo 23/23

3. ~~**Demora de invocación (#21)**~~ **CERRADA W4.1.** `OpcionesEnlace.demora` delega en `definirDemora` (kernel); solo legal en invocación, error temprano en caso contrario.
4. ~~**Autoinvocación (#22)**~~ **CERRADA W4.1.** `dsl.ts:autoinvocacion(opd, proceso, demora?)` delega en `crearAutoInvocacion`; método dedicado, no ambiguo con un self-link manual.
5. ~~**Modificador NO (#19)**~~ **CERRADA W4.1 (lado DSL).** `enlazar(…, {modificador:"no"})` ahora mapea el subtipo `"no"` (antes caía a `undefined`); el forward verbaliza la negación. **Nota:** el *reverse* sigue sin planificar `no` (es trabajo de parser, no de DSL); la garantía de round-trip de L2 sobre `no` queda pendiente de W4.2.
6. **Excepciones sobretiempo/subtiempo (#23)** — forward+reverse completos; sin superficie DSL ni en `OpcionesEnlace`. *(Tanda 2, fuera de W4.1.)*
7. **TS3 compacta (#14)** — la transición como metadato del enlace efecto entidad→entidad; el DSL solo arma la vía escindida. *(Tanda 2, fuera de W4.1.)*

### Designaciones default/current (#5) — CERRADA W4.1

`dsl.ts:designarEstado(entidad, estado, designacion)` escribe `estado.designaciones` (espejo de inicial/final de `estados()`); el forward emite `… en \`s\` es Default|Current`. Completa la fila #5 de la tabla maestra, que estaba en **parcial** (solo inicial/final).

### Prioridad BAJA — fuera del catálogo estricto, o vista, o sin demanda de corpus

8. **Probabilidad de evento (#20)** — el parser la **descarta** (`parsear.ts:713`); el round-trip no la conserva. Kernel `definirProbabilidad` existe.
9. **Tasa (#34), Requisitos (#35), backwardTag (#29)** — metadata de enlace con op kernel pero sin reverse OPL ni superficie DSL. HODOM toca `requisito` una vez, fuera del DSL.
10. **Ruta-OPL formal (#32)** — HODOM usa `etiqueta:` de enlace, no la ruta-OPL `Por ruta …`; presión nula hoy.
11. **Tagged/etiquetado en reverse (#28/#29), duración de estado (#6), submodelos (#42), ontología (#43)** — el forward emite tagged y duración pero el **reverse no los invierte**; quedan fuera de cualquier garantía de bisimetría de L2 con o sin DSL.

## 3. Recomendación para W4.1 / F4

Orden por **(esfuerzo, presión de corpus)**. Regla: primero lo que **delega directo** a una operación kernel ya existente (esfuerzo bajo, riesgo de byte-identidad nulo bajo W3.2), después lo que exige diseño nuevo.

### Tanda 1 — delegación directa al kernel (esfuerzo BAJO; el kernel ya existe)

Añadir a la superficie del DSL (o a `OpcionesEnlace`) métodos/opciones que llaman 1:1 a operaciones presentes:

| Primitiva DSL a añadir | Delega a (kernel) | Justificación |
|---|---|---|
| `abanico(opd, enlaceIds, operador)` | `formarAbanico` (`abanicos.ts:23`) + `alternarOperadorAbanico` | **Cierra la exclusión rectora L2.** Elimina el workaround gen-spec de HODOM. Reverse ya lo invierte. |
| `OpcionesEnlace.multiplicidadOrigen` | propagación a `crearEnlace` (espejo del destino ya soportado) | simétrico a lo existente; cero diseño nuevo |
| `OpcionesEnlace.demora` | `definirDemora` (`modificadores.ts:89`) | trivial; reverse ya la aplica |
| `autoinvocacion(opd, proceso, demora?)` | `crearAutoInvocacion` (`autoinvocacion.ts:5`) | método dedicado evita ambigüedad self-link |
| `OpcionesEnlace.modificador: "no"` (mapear subtipo) | `aplicarModificador(…, "no")` | corrige `dsl.ts:244` (hoy ignora "no") |
| designación default/current en `estados()` o método aparte | `designaciones` del estado (espejo de inicial/final) | completa #5 |

### Tanda 2 — opción/superficie con validación, kernel existente pero firma nueva (esfuerzo MEDIO)

| Primitiva | Delega a | Nota |
|---|---|---|
| `OpcionesEnlace.excepcion: {tipo:"max"\|"min", valor, unidad}` | `definirTiempoExcepcionEnlace` (barrel `:128`) | forward+reverse completos; solo falta envoltura |
| `OpcionesEnlace.tasa` / `.requisitos` / `.backwardTag` | `definirTasaEnlace` / `definirRequisitosEnlace` / `definirBackwardTag` | metadata; sin reverse OPL — documentar que no round-trip-ea |
| TS3 compacta explícita | escritura de `estadoEntradaId/SalidaId` en enlace efecto | hoy solo se logra con la vía escindida |

### Tanda 3 — sin op kernel dedicada o fuera de garantía de bisimetría (esfuerzo ALTO o descartar de L2)

| Caso | Razón |
|---|---|
| Duración de estado (#6) | no hay op kernel dedicada (escritura directa de `estado.duracion`) ni reverse; valor marginal |
| Probabilidad (#20) | el parser la descarta — añadirla al DSL no la haría round-trip-ear; primero arreglar reverse |
| Submodelos (#42), Ontología (#43) | fuera del catálogo 23/23 y sin demanda de HODOM; **dejar fuera de L2 explícitamente** |
| Tagged en reverse (#28) | el forward emite pero el reverse no invierte; exponerlo en DSL no cierra la bisimetría — es trabajo de **parser**, no de DSL |

**Veredicto de alcance L2 (lo que W1.4 fija):** el compilador puede garantizar bisimetría sobre las **familias que el reverse ya invierte** (cosas, estados, designaciones inicial/final/default/current, procedimentales con/sin estado, transiciones TS3-TS5, modificadores evento/condición, demora, autoinvocación, excepciones, estructurales binarias, abanicos XOR/OR, multiplicidad, ruta, etiqueta). **Quedan fuera de la garantía** hasta cerrar su hueco: tagged/bidireccional en reverse, duración de estado, probabilidad, tasa/requisitos/backwardTag, NO en reverse, submodelos, ontología, y la **clase-ancla** (W5.1, ya excluida por backlog). La Tanda 1 de arriba es el camino crítico: con seis envolturas de bajo esfuerzo, L2 absorbe el abanico XOR/OR y elimina el principal workaround del corpus HODOM.

## Nota sobre el header obsoleto de `fixtures-roundtrip.ts`

El comentario de cabecera de `app/src/opl/fixtures-roundtrip.ts:13-18` afirma que el aplicador "NO inversa todavía modificadores, rutas, multiplicidades, refinamientos, abanicos". **Está desactualizado**: las fixtures `fixtureEventoConsumo`, `fixtureInvocacionTilde`, `fixtureAutoInvocacionTilde`, `fixtureHabilitadorConEstado` (todas `bisimetricaEstricta: true`) y la memoria de proyecto ("reverse OPL completo: catálogo 23/23 estricto") confirman que `aplicar.ts` hoy invierte modificadores, demoras, autoinvocación y abanicos (`aplicar.ts:405 formarAbanico`, `:225 definirDemora`, `:161 crearAutoInvocacion`). El inventario de arriba refleja el estado **real** del reverse, no el header. (No se edita el archivo en este análisis de solo lectura; queda anotado para W4.2.)
