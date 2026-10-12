# Continuidad

Canon vigente 2.3.0, sólo ISO/PAS 19450:2015 (DEC47/50); la lectura de Tabla 27 sigue inferida por falta de
figuras. DEC48/49 cierran B-44; DEC50 resuelve B-53/B-43/B-46/B-39 y declara las extensiones léxicas B-47.
La historia y decisiones están en Git y `docs/decisiones.md`; las brechas vigentes en `docs/conformidad.md`.

## Ola B-41

- **Mandato directo:** «Vamos con B-41. Actualiza la rama y continúa con pruebas completas y revisión
  independiente. Commit atómico y semántico y push solo a la rama; no toques main ni despliegues.» (DEC51;
  role=user, ID/fecha del mensaje no observables).
- **Rama:** `fxai/confident-feynman-bvw7k5`, actualizada por ff-only desde `b53ff2f6`. `main` no se modifica.
- **Incremento aceptado:** listas AND por producción sobre la Vista del OPD, miembros con identidad,
  estados/multiplicidades y tokens propios, contexto y modo conservados en hijos. Instrumento común con procesos
  enumerados según la producción informativa adoptada por el canon; prioridad proceso común y después instrumento
  común sobre miembros restantes. Abanicos XOR/OR excluidos, incluidos los que llevan ruta.
- **Comprobado:** check completo nuevo 3177/0, 1487283 expectativas, 74 archivos y TypeScript limpio; build web/servidor
  verde; nueva corrida 33/33 e2e tras la reparación, incluidos selección/realce, estado por ID, cantidad por
  inspector/OPL, UNDO y rechazo atómico.
  Playwright del repo en loopback, datos/cuenta sintéticos y 0 errores de página/solicitudes externas; Browser
  plugin no disponible. Los 104 casos específicos conservan DS10 y T-182; planificador y prueba histórica
  intactos. 116 archivos históricos, incluidos 106 SVG golden, idénticos a la base. La revisión independiente
  inicial reservó sólo el cierre gramatical A.4.3: RED nativo 10 fallos, reparación y focal nuevo 291/0.
  Dictamen final GLOBAL FAVORABLE dentro del alcance parcial: 55/0 sondas funcionales, 168 casos gramaticales
  PASS y once entradas negativas originales rechazadas; 301/301 fuentes y 18/18 artefactos verificados.
  `dictamen-b41-cierre.md`, SHA256 `a5bb4d256ba445b62232f8cd42ea2a1312f86194366f731390249972cb1149c3`.
  Evidencia fuera de Git en `/home/felix/.local/state/opforja/validaciones/b41-d_axuka7`.
- **Reserva explícita B-41:** controles E/C y excepciones conservan su gramática singular; quedan fuera la lista
  ilustrativa de procesos con agente común y las listas bifurcadas opcionales de etiquetados. No se afirma cobertura
  total de Figura 50/Anexo A, ni se cierran B-09/B-13/B-42.

## Pendiente

- **Entrega B-41:** un único commit semántico sólo en la rama, bajo DEC51; el historial de Git identifica
  la entrega y la igualdad HEAD/remoto acredita su publicación. Sin integración en `main` ni despliegue.
- **Siguiente paso:** elegir el siguiente incremento de modelado o una reserva B-41; no hay defecto material
  pendiente dentro del alcance comprobado de esta ola.
- **Incrementos posteriores, por elegir:** B-37 (caracterización con estado), B-42 (multiplicidad), B-45 (posición
  vertical), B-48 (plegado/probabilidad) y reservas B-41 restantes.
- **Operación del dueño:** el estado productivo consignado previamente y los pendientes de cuenta/prueba de humo/
  preview están en `docs/operacion.md` §8.2/§9.4; no se revalidan ni se intervienen en esta ola.

## Límites que no cambian

- La PAS 2015 resume algunas subcláusulas y no trae figuras: lo que dependía de ellas sigue «no verificable».
- B-40 (resultado al último subproceso, DEC45) y B-49 (extensiones del perfil) son decisiones declaradas, no
  defectos.
- Una suite verde no equivale a validación humana del modelado ni autoriza despliegue (DEC30).
