# Continuidad

La fase A de `8d4e0b87` y el desglose del ensayo están completados. Se conservan
los originales e informes privados. El detalle de nueve OPD, 46 etiquetas,
26 multiplicidades, nueve rutas, 1055 campos y 203 errores está en:
`/home/felix/.local/state/opforja/ensayos/fase-a-8d4e0b87-uq1bjdwm/ensayo/revision-usuario/DETALLE-DESCARTES.md`.
Las propuestas de rescate no se aplicaron. Por la nueva decisión del dueño, los
modelos viejos y su revisión quedan fuera del corte; los ensayos se conservan.

La preview `8d4e0b87` continúa por instrucción de Félix en el contenedor propio
`opforja-revision-8d4e0b87-5me5hdtl`, puerto `127.0.0.1:32926`, con copias
byteexactas de los siete modelos y cuenta sintética. Su acceso y eliminación están en:
`/home/felix/.local/state/opforja/ensayos/fase-a-8d4e0b87-uq1bjdwm/revision-usuario/ACCESO.md`.
Eliminar únicamente esta instancia y su directorio temporal cuando Félix avise;
preservar el ensayo original. La preview conserva su versión y datos.

T-192 quedó publicado: calentamiento más cinco identidades frescas, corpus completo
sin retención de respuestas y límite de 3000 ms. El candidato B-36 parte de
`67542738`. La respuesta directa fue «B-36: conservar el modelo (recomendado)».
Exportar conserva el OPL actual, avisa estados no expresados en ningún bloque y ofrece
una elección explícita para mostrarlos mediante operaciones nativas y un UNDO.
JSON permanece exacto. La reparación serial mínima del planificador distingue las
dimensiones compatibles de designación y conserva los slots únicos por objeto;
no cambia reglas, gramática ni operaciones. B-36 y las diez parciales siguen vigentes.

Las regresiones RED y la evidencia nueva de esta ola se conservan en:
`/home/felix/.local/state/opforja/ensayos/b36-67542738/`.
Focal de parser y flujo: 77 pruebas, cero fallos. El check nuevo pasó con TSC verde,
2960 pruebas, cero fallos y 1447380 aserciones en 66 archivos (98,20 s);
T-192 dio una mediana de 2545,57 ms bajo el límite de 3000 ms. Build verde y
27/27 recorridos e2e con Chromium 1217, incluidos los 26 originales y el flujo B-36.
La revisión independiente final es favorable: focal propio 77/0, recorrido 27
1/1 y capturas del aviso/estado expresado observadas. Las cuatro suites originales
se conservaron como prefijos byteexactos. Candidato aceptado técnicamente dentro
del alcance declarado; publicación y paridad se comprueban en Git. El primer
commit, de designaciones, pasó además su check separado: 2942/0, TSC verde.
El siguiente trabajo de producto es B-15: etiquetas y multiplicidades que pisan
cosas o puntas; no forma parte de este corte operativo.

Félix autorizó la fase B con su mensaje directo: «Vamos con la fase b».
La preparación de `2dfe556f` está comprobada: respaldo PostgreSQL preliminar con
recuperación aislada, imagen construida y ensayo actual de siete modelos, cero
rechazos/fallos, dos autosaves y 16 versiones. Los 25 originales/versiones, los
índices y los siete JSON canónicos coinciden byteexactamente con fase A; descartes
y visibilidad se conservan. El diagnóstico vigente cuenta 121 errores, antes 203.
La imagen aislada pasó salud/versionado, 401 anónimo, login sintético, siete GET
byteexactos y CAS de los tres mayores. Esa prueba temporal ya se retiró. Evidencia:
`/home/felix/.local/state/opforja/ensayos/fase-b-2dfe556f-yqwxf9b_/`.

Decisión nueva del dueño: «omitimos la migración» y «OpForja nuevo arranca con la
biblioteca vacía», citada íntegramente en `docs/decisiones.md`. Quedan sin efecto
CC-17, congelamiento, respaldo final, ensayo nuevo, migración, `--verificar` y
revisión de los siete modelos y sus 121 errores. Se conserva el volumen PG sin
montar tras el corte, el respaldo y todos los ensayos; la preview sigue intacta.

El corte sin migración está ejecutado: `./deploy/deploy.sh` terminó con código 0,
versión `1e0d3ab0`, en `https://opforja.sanixai.com`. Salud/HTML 200, sesión anónima
401 y bundle con la misma versión. `opforja-datos` no existía antes del deploy y su
control inicial encontró cero archivos/modelos y ninguna cuenta. El secreto quedó
fuera de Git con permisos `0600`; PG está conservado sin montar, el respaldo
byteexacto y la preview intacta. El producto conserva el árbol `app/` validado en
`2dfe556f`; los commits del corte sólo documentan la decisión y el resultado.

Siguiente paso del dueño: crear la cuenta con su clave, entrar, crear un modelo,
editarlo, ver «Guardado», recargar y comprobar persistencia. Esa aceptación humana
está pendiente; el agente no creó cuenta ni modelos en producción.
