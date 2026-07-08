# Notas de aprendizaje — corte B′⊕D (apuntes desatendidos + Taller bottom-up + especies)

Una lección por entrada, resumen de una línea al inicio. Se actualiza, no se duplica.

## La verificación de plan por LECTURA no sustituye la ejecución TDD
Cuatro revisores adversariales leyeron el plan y ninguno vio que `crearOpdSuelto` usara
`siguienteId(modelo,"opd")` = `opd-${nextSeq}`, que en un modelo recién nacido (`nextSeq===1`,
raíz `opd-1`) produce `opd-1` y **sobrescribiría la raíz** — justo el flujo bottom-up canónico
(«nace apunte → traza suelto»). El TDD lo materializó de inmediato. Regla: para generación de ids
sobre modelos frescos, ejecuta; no confíes solo en la lectura.

## `crearModelo` fija la raíz `opd-1` sin consumir `nextSeq`
La raíz nace con id `opd-1` mientras `nextSeq` sigue en 1 (id out-of-band). Toda op que cree un OPD
nuevo debe **saltar ids ya existentes** (`while (modelo.opds[\`opd-${seq}\`]) seq += 1`) y dejar
`nextSeq` en el siguiente valor, o colisiona con la raíz. (`operaciones/opdSuelto.ts`.)

## Convergencia por factorización del vínculo (identidad por construcción)
`descomponerProceso` y `desplegarObjeto` ya hacían dos cosas al vincular (`opdHijo.padreId` +
`fijarRefinamiento`). Extraer ese par como `establecerRefinamiento` y hacer que top-down y `adoptarOpd`
lo invoquen igual hace la convergencia **literal en el código** (descomposicion.ts:125,
despliegue.ts:138), no un test extensional. El refactor preservó las 198 pruebas del baseline sin tocar
una sola. R-OPD-REF-20.

## El gate de export vivía en rutas MUERTAS; las canónicas vivas son PNG/ZIP + documento
`exportarModeloConPerfil` no tiene llamadores de producción. Las realizaciones canónicas VIVAS de
`canon-diagrama` son las rutas PNG por-OPD y PNG-ZIP (`CommandPalette.tsx`) y el documento canónico
(`acciones-canvas.ts::copiarCanonDocumentoAlPortapapeles`). Un gate que solo cubra la función JSON es
andamiaje de test que no cierra la ley «export honesto». Verificar SIEMPRE qué ruta está viva antes de
gatear (la invariante EXPORT-GATE se cumple sobre las rutas reales, no las declaradas).

## Nacimiento apunte: id pre-generado + especie INDEX-ONLY (no en el record)
«Todo nace apunte con autosave desde el primer trazo» exige que el recién nacido persista de inmediato
para adquirir id. `guardarComoLocal` persiste vía backend con `.then`: leer `modeloPersistidoId` en el
mismo tick da null → marcaría modelo plano. La implementación (mejor que el plan original): **pre-generar
el id** con `crearIdModeloLocal()` y enhebrarlo, y marcar `esApunte` **solo en la entrada de índice**,
NO en el record persistido. Sutileza load-bearing: meter `esApunte` al record (vía
`construirModeloPersistido`) lo **re-infectaría al sincronizar el índice** y des-graduaría el apunte —
la especie es propiedad del ÍNDICE, no del payload del modelo. Un solo write atómico, sin race.
Verificado por test (`await` de tick) y e2e 41. (`nacerApunte`, `acciones-ui.ts`.)

## Acoplamiento latente: `DialogoGraduar` lee el modelo ACTIVO
`confirmarGraduacion` solo renombra si `esActivo` y el diálogo muestra la validez del modelo activo.
Seguro HOY porque `abrirGraduar` se invoca solo desde `CintaApunte` (apunte activo). Si se cableara
«Graduar» por-fila en el gestor para un apunte NO activo, mostraría la validez/nombre equivocados y
descartaría el nombre elegido en silencio. La spec §6 NO pide graduación por-fila (el chip muta solo
porque deriva de `especieDe`); no exponerla. Blindaje preventivo: guardar contra
`modeloId !== modeloPersistidoId` en `abrirGraduar`, o parametrizar el diálogo por `modeloId`.

## La verificación de plan por lectura mejora el diseño, pero el TDD/ejecución lo cierra
Dos veces un constructor/verificador mejoró mi plan sobre el terreno: (1) `crearOpdSuelto` vs colisión
con la raíz; (2) especie index-only vs por-record. Y la verificación adversarial refinó la DOCTRINA
(convergencia = vínculo, no contenido). Regla: el brief fija el QUÉ y las trampas conocidas; deja el
CÓMO fino al ejecutor, que ve la realidad del código.
