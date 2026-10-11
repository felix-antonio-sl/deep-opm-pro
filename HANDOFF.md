# Continuidad

Estado vigente de `main`: canon 2.2.0, contenido de la 2.0.0 contrastado sólo con ISO/PAS 19450:2015; la revisión
2.1.0 se retiró porque no se dispuso de la edición 2024 (DEC47, `canon/CAMBIOS-2.2.md`). B-44 está cerrada en el
producto: ningún evento sistémico externo inicia un subproceso cruzando el contorno, y el ambiental sí, como en
la PAS (DEC48); la regla vive en `nucleo/matriz.ts` (R-CX-DIST-2). Prohibirlo también a la invocación desde un
proceso sistémico exterior es endurecimiento declarado. Las demás diferencias entre producto y canon están en
`docs/conformidad.md` (B-39 a B-49 y B-53). La historia de cada ola está en Git, `docs/decisiones.md` y
`docs/operacion.md`; la evidencia de validación se guarda fuera del repositorio.

## Pendiente

- **Siguiente incremento de producto, por elegir.** Propuesto: B-39, estructurales etiquetados con estado
  (ISO §10.4.2). Alternativas en discusión: B-45 (bandas y posición vertical pueden divergir sin diagnóstico)
  y B-41 (enlaces AND del mismo tipo en una sola oración). No está iniciado.
- **Del dueño:** decidir si la invocación desde un proceso sistémico exterior sigue rechazada al cruzar el contorno
  (endurecimiento de B-44) o se admite, porque ISO §14.2.2.4.2 sólo nombra objetos y estados.
- **Del dueño, operativo:** crear su cuenta con el comando protegido de `docs/operacion.md` §8.2 y hacer la prueba
  de humo humana del despliegue `5e0003f0`. La preview histórica se retira sólo cuando él avise
  (`docs/operacion.md` §9.4).

## Límites que no cambian

- La PAS 2015 resume algunas subcláusulas y no trae figuras: lo que dependía de ellas sigue «no verificable».
- B-40 (resultado al último subproceso, DEC45) y B-49 (extensiones del perfil) son decisiones declaradas, no
  defectos.
- Una suite verde no equivale a validación humana del modelado ni autoriza despliegue (DEC30).
