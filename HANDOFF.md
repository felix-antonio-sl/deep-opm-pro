# Continuidad

Estado vigente: canon 2.3.0, contenido de la 2.0.0 contrastado sólo con ISO/PAS 19450:2015; la revisión 2.1.0 se
retiró porque no se dispuso de la edición 2024 (DEC47, `canon/CAMBIOS-2.2.md`) y la 2.3.0 lee la Tabla 27 por la
disposición de sus celdas (DEC50, `canon/CAMBIOS-2.3.md`). B-44 está cerrada en el
producto: ningún evento sistémico externo inicia un subproceso cruzando el contorno, y el ambiental sí, como en
la PAS (DEC48); la invocación entre procesos no está sujeta a la regla (DEC49). La regla vive en
`nucleo/matriz.ts` (R-CX-DIST-2). Las demás diferencias entre producto y canon están en
`docs/conformidad.md` (B-39 a B-49). La historia de cada ola está en Git, `docs/decisiones.md` y
`docs/operacion.md`; la evidencia de validación se guarda fuera del repositorio.

## Pendiente

- **En curso (DEC50):** retirar los endurecimientos B-43 (refinamiento con un solo hijo), B-46 (escisión del TS3
  y control en la mitad de salida) y B-47 (caracteres de nombre); después, B-39 (estructurales etiquetados con
  estado, ISO §10.4.2). Cada uno va en su commit a la rama; `main` sólo con permiso del dueño.
- **Sin desplegar (DEC50):** producción sigue en `5e0003f0`.
- **Del dueño, operativo:** crear su cuenta con el comando protegido de `docs/operacion.md` §8.2 y hacer la prueba
  de humo humana del despliegue `5e0003f0`. La preview histórica se retira sólo cuando él avise
  (`docs/operacion.md` §9.4).

## Límites que no cambian

- La PAS 2015 resume algunas subcláusulas y no trae figuras: lo que dependía de ellas sigue «no verificable».
- B-40 (resultado al último subproceso, DEC45) y B-49 (extensiones del perfil) son decisiones declaradas, no
  defectos.
- Una suite verde no equivale a validación humana del modelado ni autoriza despliegue (DEC30).
