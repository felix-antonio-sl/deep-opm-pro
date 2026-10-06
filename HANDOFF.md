# OpForja rehecho — tablero

Rama `rehacer`. [Bitácora íntegra](docs/rehacer/bitacora.md) · [Decisiones 1–32](docs/rehacer/DECISIONS.md) · [Conformidad](docs/conformidad.md) · [Plan](docs/rehacer/plan/README.md).

## Autoridad directa vigente

> «Un commit semántico por paso, siempre con check verde, y push a origin/rehacer. Revisión una vez por ola, contra el canon y con modelos reales. Detente solo en H2, en H3 o ante una contradicción real del contrato. Toda autorización tiene que ser una frase textual mía. Sin despliegue, sin producción, sin migración real, sin merge a main, sin leer .env ni credenciales.»
> «unamos 1  o 2 en un solo commit»
> «Con check verde, sigue el plan: WP-9 (con VAL) → WP-13 → H2 → WP-10 → WP-12 → WP-14 → WP-15 → WP-16 → WP-17 → WP-19 → H3.»
> «continúa sin parar a informarme mientras no tengas un problema significativo»

Frases directas role=user transmitidas por dirección; ID/fecha originales no expuestos. La unión1+2 se consumó. La última reanudó después del corte H2. Una única escritora; Git/aceptación de dirección.

## Paquetes

| Paquete / etapa | Estado |
|---|---|
| WP-0/1/2/4p/6/8a/11/3a/3b/5/7 | Publicados históricos, evidencia en bitácora. |
| WP-8b / WP-4r / corte gráfico | `31ea8ad` / `f4e16b8` / `e53fb47`; el último fue corte RED reservado. |
| Pasos1+2 /3 /4 | Publicados `26935f4` / `5d23f8a` / `69aee956`; ola1–4 favorable. DEC29–32 aplicadas, sin dominios locales retirados. |
| WP-9 / WP-13 / H2 | Publicados `2abecc6` / `bc22451d`; revisión conjunta favorable y H2 detenido, luego reanudado directamente. Paridad remota verificada por dirección. |
| WP-10 | Publicado `c94178fa`, paridad verificada por dirección; check2783/0/TSC0/exit0. 49OPDs auto, cinco documentos estrictos ofrecidos; tres modelos conservan gates. Ocho metas verdes y perfil262/192/433/36; históricos200×40 intactos. |
| WP-12 | Cerrado en este commit, aceptado técnicamente por dirección: check2815/0/TSC0/exit0,25casos con fuente falsa y CLI compilada. Revisión única ola4 pendiente. |
| WP-14→15→16→17→19→H3 | Próximos tras relevo. H3 exige suite/e2e/build y modelos reales; imagenDocker requiere permiso aparte. |

## Siguiente paso y límites

Dirección aceptó técnicamente WP-12 bajo el mandato directo vigente; próximo WP-14 sólo tras relevo. Originales/versiones/tenants/Informe, ensayo y verificación pasan con fuente falsa; ninguna conexión real ni lectura de env/credenciales. Tres guardas privadas y colación mantienen paridad de datos/reglas, ocho umbrales y corpus histórico; T192 completa2805,57ms. Git y publicación siguen en dirección.

Diez parciales, B15/layout importado, documentos diagnosticados y UI/ISO permanecen limitados. IndexedDB/probe compilado acreditados en H2; build completo exit1 por entrada main.tsx prevista WP14. WP-18/imagenDocker requiere autorización aparte, fuera de H3; sin infraestructura/migración/despliegue real.
