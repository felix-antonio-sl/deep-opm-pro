# Continuidad

## Canon 2.1 y siguiente incremento

Encargo vigente, directo del dueño: «Trata de recuperar lo que falta de la ISO 2024 y resuelve lo pendiente»
(DEC46). Base de este incremento: main `64046edd`; árbol limpio al comenzar. El canon 2.0, DEC39–45
y su revisión contra la fuente 2015 permanecen en Git; no se duplican ni se reescribe esa historia.

Se recuperó un PDF público de ISO 19450:2024 con 168 páginas, texto y figuras, conservado fuera de Git.
Fuente, contraste, huella, alcance y reservas: `canon/CAMBIOS-2.1.md`. La revisión local 2.1 actualiza
las cuatro fuentes, metadatos, citas de glosario, Tabla 27, estados, excepciones, duración, léxico,
esencia primaria y reglas de ejecución/refinamiento. No modifica código, pruebas ni datos de producto.

Las reservas por fuente resumida o figura ausente se resuelven con evidencia. Las contradicciones
internas de la norma quedan declaradas; no se afirma auditoría exhaustiva ni certificación ISO.
B-44 comprende ahora evento externo al contorno de cualquier afiliación; B-47 retira el falso carácter
literal «|». B-50/51/52 registran esencia primaria, tipografía OPL y propiedades genéricas. B-43
conserva la reserva específica de agregación, sin extenderla a todos los refinamientos. Se reconoce
el mantenimiento descrito por ISO; B-16 declara la clasificación restrictiva del parser para D11/D12.

Verificación final posterior a todas las correcciones: TSC exit0; suite íntegra 2984/0,
1.448.670 expectativas en 66 archivos, 109,76 s, exit0. Se ejecutan los dos componentes
de `app/package.json` check con `--no-env-file`, sin cargar .env. Control documental:
249 referencias ISO explícitas/implícitas con encabezado, cero citas faltantes, 943 definiciones
de lista del corpus de ocho documentos sin propietario duplicado y cuatro huellas/metadatos coherentes.
La misma revisora independiente dio dictamen global documental favorable y QUIETO_FIN_LECTURA;
verificó 19/19 archivos del freeze `ecfdbc953359748f2c08e7d947cc02da7e51b7dc27247771443deb9b483dc6b2`
y la huella de la fuente. Se acepta este cierre documental dentro del alcance declarado, sin dar
por cerradas conformidad funcional, aceptación humana, autenticidad editorial exhaustiva o publicación KORA.

Próximo incremento de producto: B-44 contra §14.2.2.4.2 de 2024, con RED y cobertura de creación,
distribución, importación/diagnóstico y controles legales de condiciones y eventos internos. La sonda
histórica `/tmp/opforja-canon2.v7icmW/sonda-b44-antes.json` reprodujo el permiso de evento sistémico
externo; sus controles ambientales correspondían a la fuente 2015 y no prueban el nuevo alcance.
Conservar DEC45 y las identidades. La presente actualización documental no aplica esa reparación
ni despliega. B-40 y B-49 conservan decisiones de producto y extensiones declaradas.

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
