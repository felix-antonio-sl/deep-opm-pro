# Continuidad

La fase A de `8d4e0b87` y el desglose del ensayo están completados. Se conservan
los originales e informes privados. El detalle de nueve OPD, 46 etiquetas,
26 multiplicidades, nueve rutas, 1055 campos y 203 errores está en:
`/home/felix/.local/state/opforja/ensayos/fase-a-8d4e0b87-uq1bjdwm/ensayo/revision-usuario/DETALLE-DESCARTES.md`.
Las propuestas de rescate no se aplicaron; los siete modelos conservan los errores
de modelado pendientes de revisión humana.

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
cosas o puntas. La revisión humana de los siete modelos sigue pendiente.

Félix autorizó la fase B con su mensaje directo: «Vamos con la fase b».
La preparación de `2dfe556f` está comprobada: respaldo PostgreSQL preliminar con
recuperación aislada, imagen construida y ensayo actual de siete modelos, cero
rechazos/fallos, dos autosaves y 16 versiones. Los 25 originales/versiones, los
índices y los siete JSON canónicos coinciden byteexactamente con fase A; descartes
y visibilidad se conservan. El diagnóstico vigente cuenta 121 errores, antes 203.
La imagen aislada pasó salud/versionado, 401 anónimo, login sintético, siete GET
byteexactos y CAS de los tres mayores. Esa prueba temporal ya se retiró. Evidencia:
`/home/felix/.local/state/opforja/ensayos/fase-b-2dfe556f-yqwxf9b_/`.

El corte está pendiente únicamente de la comprobación factual CC-17 (§9.4.1):
confirmar que no quedan documentos exclusivos del navegador viejo sin sincronizar
o recuperar; la pregunta al operador sigue pendiente. La migración real y el
despliegue no se ejecutaron; el stack viejo y la preview siguen intactos.
Después: congelar escritores viejos manteniendo PG, respaldar la fuente quieta,
migrar/verificar `opforja-datos`, ejecutar `./deploy/deploy.sh` y completar el smoke
humano. El secreto requerido está preparado en privado, sin instalarlo aún.
