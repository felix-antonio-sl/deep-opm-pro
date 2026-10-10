# Continuidad

## Canon 2.0 y siguiente incremento

Encargo vigente: «Puedes darle continuidad a esto ?». El canon 2.0 de
`0d8ee595`, DEC39–44 (`94a73bb8`), DEC45 (`2936011c`) y la corrección documental
B-37 (`ac163e50`) están integrados en `main` por avance rápido y publicados.
HEAD, origin/main y el remoto coincidieron en `ac163e50` al verificar ese corte.
Sus cuatro SHA256 coinciden con
`canon/LEEME.md` y los metadatos. Las remisiones de IDs no son definiciones
duplicadas. Se corrige B-37: RF5 y su glifo ya están definidos por el canon,
aunque el producto aún no los ofrece. No se cambia el canon ni el producto
en esta corrección documental.

Verificación nueva de `0d8ee595`: TSC sin errores; 2984 pruebas aprobadas,
cero fallos y 1.448.670 expectativas en 66 archivos (103,45 s). Los cinco
fallos de entorno del informe anterior no se reprodujeron en este host.
La comprobación final del árbol corregido también pasa: TSC sin errores,
2984/0 y 1.448.670 expectativas en 66 archivos (105,25 s). La revisión documental
contrasta B-37 con R-STRE-2, RF5 y R-OPD-STR-14; el código de producto permanece
intacto y las cuatro huellas del canon siguen coincidiendo. La referencia
disponible sigue siendo ISO/PAS 19450:2015; no se afirma alineación con la
edición 2024 ni revisión íntegra de la norma a partir de estas comprobaciones.

Próximo incremento: B-44. Una sonda con operaciones nativas reproduce que
`crearEnlace` admite consumo con evento desde un objeto sistémico externo al
primer subproceso, sin diagnóstico y con forma válida. Los cuatro controles
(condición sistémica, evento/condición ambiental y evento sistémico interno)
son aceptados. Evidencia: `/tmp/opforja-canon2.v7icmW/sonda-b44-antes.json`.
Hay que impedir el cruce tanto en edición directa como en distribución y
diagnóstico de modelos cargados, conservando los controles legales y DEC45.
B-40 es el default elegido por el dueño y B-49 registra extensiones; no se
eliminan como si fueran defectos. La selección de alcance para la siguiente
ola sigue presentada al dueño; todavía no se aplica una corrección de producto.

## Cierre histórico DEC35–38

`main` incorpora los cuatro commits `3a3388d` → `7ccfb47`: DEC35–38, marca de control
a 32 px, avisos de oclusión y multiplicidad exacta/«al menos dos». La reparación
`d890ac7d` conserva cada cifra en matriz, OPL, JSON e inspector, sin una cota nueva.
El historial publicado permanece intacto.

| Asunto | Resultado vigente |
|---|---|
| DEC35 / H-06 | Entero exacto n ≥ 2 y `2..*`; retirado el límite accidental de seis cifras. El inspector conserva 400 cifras al foco/blur y recarga, sin acción ni cambio de revisión. El lector JSON conserva el literal y declara pérdidas en vez de inventar un entero por redondeo. |
| DEC37 / H-24, H-27 | Avisos sin bloqueo cuando etiqueta/multiplicidad tapa cosa o punta; marca de control a 32 px. Exports genuinos revisados individualmente. |
| DEC36 | B-07, B-37 y B-38 mantienen sus límites; B-10 sigue parcial para participaciones no ofrecidas. No hay ampliación del canon. |
| DEC38 | Desplegado `5e0003f0` tras la respuesta directa «Autorizo», citada en `docs/decisiones.md`. Salud, versión, bundle y pantalla «Entrar» comprobados. |

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
El dueño respondió directamente «Autorizo» a la solicitud específica de desplegar
`5e0003f0`, conservando cuentas/modelos y sin migración. `./deploy/deploy.sh`
terminó con código 0: salud/cabecera/bundle `5e0003f0`, HTML 200 y sesión anónima 401.
Chromium observó «Entrar», DOM listo y cero errores de página o solicitudes externas;
la espera inicial `networkidle` venció y la comprobación posterior verificó el DOM
real. El volumen `opforja-datos:/datos` mantiene cero archivos, con metadatos idénticos.
Siguiente paso del dueño: crear la cuenta con el comando protegido de
`docs/operacion.md` §8.2 y realizar la prueba de humo humana.

El corte inicial se hizo sin migración, por «omitimos la migración» y «OpForja nuevo
arranca con la biblioteca vacía». Se conservan el volumen PostgreSQL, su respaldo
y los ensayos. Sus originales están en `ensayos/fase-a-8d4e0b87-uq1bjdwm/` y
`ensayos/fase-b-2dfe556f-yqwxf9b_/`, bajo `/home/felix/.local/state/opforja/`.
La preview histórica sólo se retira cuando Félix avise; instrucciones en
`ensayos/fase-a-8d4e0b87-uq1bjdwm/revision-usuario/ACCESO.md` bajo esa misma raíz.
La preview está activa y mantuvo ID y tiempo de arranque durante el despliegue.
La creación de cuenta y la prueba de humo humana siguen pendientes.
