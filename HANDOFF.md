# Continuidad

`main` incorpora los cuatro commits `3a3388d` → `7ccfb47`: DEC35–38, marca de control
a 32 px, avisos de oclusión y multiplicidad exacta/«al menos dos». La reparación
`d890ac7d` conserva cada cifra en matriz, OPL, JSON e inspector, sin una cota nueva.
El historial publicado permanece intacto.

| Asunto | Resultado vigente |
|---|---|
| DEC35 / H-06 | Entero exacto n ≥ 2 y `2..*`; retirado el límite accidental de seis cifras. El inspector conserva 400 cifras al foco/blur y recarga, sin acción ni cambio de revisión. El lector JSON conserva el literal y declara pérdidas en vez de inventar un entero por redondeo. |
| DEC37 / H-24, H-27 | Avisos sin bloqueo cuando etiqueta/multiplicidad tapa cosa o punta; marca de control a 32 px. Exports genuinos revisados individualmente. |
| DEC36 | B-07, B-37 y B-38 mantienen sus límites; B-10 sigue parcial para participaciones no ofrecidas. No hay ampliación del canon. |
| DEC38 | Candidato validado para el despliegue único; falta la frase textual del dueño que autorice ejecutarlo. |

Verificación de `d890ac7d`: `cd app && bun run check` verde, TSC sin errores,
2984 pruebas, cero fallos y 1.448.670 expectativas en 66 archivos; build verde y
29/29 recorridos e2e. Los 27 recorridos originales permanecen byteexactos.
Los RED del códec y del navegador real precedieron a las reparaciones. La misma
revisora independiente cerró ambos hallazgos y dio dictamen global favorable:
285 casos con comprobación racional independiente, 79 aserciones del códec,
siete fixtures en punto fijo, desconocidos de 40.000 niveles y componente Inspector
real con 400 cifras/cero acciones al foco y Tab. Lectura y runners finalizados.

Evidencia de esta ola: `/home/felix/.local/state/opforja/validaciones/main-7ccfb47-7a8eye4d/`.
El informe histórico completo de Wikipedia permanece en
`/home/felix/.local/state/opforja/evaluaciones/wikipedia-1d0218b1/reporte-opforja-wikipedia.html`;
esta ola no se presenta como una repetición de todos sus casos.

Publicación autorizada por la frase directa: «Commiteemos atómica y semánticamente
y colapsemos sobre la rama principal. Después pushea». ID/fecha originales no observables.
Siguiente paso: autorización textual para `./deploy/deploy.sh`, conservando cuentas
y modelos actuales. DEC38 fija el momento y exige esa autorización; no la concede.
La salud pública comprobada sigue devolviendo versión `1e0d3ab0`.

El corte inicial se hizo sin migración, por «omitimos la migración» y «OpForja nuevo
arranca con la biblioteca vacía». Se conservan el volumen PostgreSQL, su respaldo
y los ensayos. Sus originales están en `ensayos/fase-a-8d4e0b87-uq1bjdwm/` y
`ensayos/fase-b-2dfe556f-yqwxf9b_/`, bajo `/home/felix/.local/state/opforja/`.
La preview histórica sólo se retira cuando Félix avise; instrucciones en
`ensayos/fase-a-8d4e0b87-uq1bjdwm/revision-usuario/ACCESO.md` bajo esa misma raíz.
Su actividad no se verificó en esta ola. La creación de cuenta y la prueba de humo
humana del corte inicial no tienen cierre documentado aquí.
