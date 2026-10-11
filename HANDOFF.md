# Continuidad

Estado vigente de `main`: canon 2.1 contra ISO 19450:2024 (DEC46, `canon/CAMBIOS-2.1.md`) y B-44
cerrada en el producto (`941469d`): ningún evento externo, de cualquier afiliación, inicia un subproceso
cruzando el contorno; la regla vive en `nucleo/matriz.ts` (R-CX-DIST-2). Las demás diferencias entre el
producto y el canon siguen declaradas en `docs/conformidad.md` (B-39 a B-52). La historia de cada ola está
en Git, en `docs/decisiones.md` y en `docs/operacion.md`; la evidencia de validación se guarda fuera del
repositorio, en el estado local de OpForja del dueño.

## Pendiente

- **Siguiente incremento de producto, por elegir.** Propuesto: B-39, estructurales etiquetados con
  estado (ISO §10.4.2). Alternativas en discusión: B-45 (bandas y posición vertical pueden divergir sin
  diagnóstico) y B-41 (enlaces AND del mismo tipo en una sola oración). No está iniciado.
- **Del dueño, operativo:** crear su cuenta con el comando protegido de `docs/operacion.md` §8.2 y hacer
  la prueba de humo humana del despliegue `5e0003f0`. La preview histórica se retira sólo cuando él avise
  (`docs/operacion.md` §9.4).

## Límites que no cambian

- La copia de ISO 19450:2024 usada para el canon 2.1 es de terceros y no se versiona; `CAMBIOS-2.1.md`
  la identifica sólo por tamaño y SHA256. No acredita autenticidad editorial ni certificación ISO.
- B-40 (resultado al último subproceso, DEC45) y B-49 (extensiones del perfil) son decisiones declaradas,
  no defectos.
- Una suite verde no equivale a validación humana del modelado ni autoriza despliegue (DEC30).
