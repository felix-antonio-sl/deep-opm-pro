# OpForja rehecho — tablero

Rama `rehacer`. Pasos 1+2 publicados en `26935f4`, paso 3 en `5d23f8a`; dirección verificó paridad remota y árbol limpio en cada publicación. Paso 4 publicado en `69aee956`, verificado por dirección; WP-9 publicado `2abecc6`, verificado por dirección; WP-13 cerrado en este commit; DETENIDO EN H2. [Bitácora íntegra](docs/rehacer/bitacora.md) · [Decisiones 1–32](docs/rehacer/DECISIONS.md) · [Conformidad](docs/conformidad.md) · [Plan](docs/rehacer/plan/README.md).

## Autoridad directa vigente

> «Un commit semántico por paso, siempre con check verde, y push a origin/rehacer. Revisión una vez por ola, contra el canon y con modelos reales. Detente solo en H2, en H3 o ante una contradicción real del contrato. Toda autorización tiene que ser una frase textual mía. Sin despliegue, sin producción, sin migración real, sin merge a main, sin leer .env ni credenciales.»
> «unamos 1  o 2 en un solo commit»
> «Con check verde, sigue el plan: WP-9 (con VAL) → WP-13 → H2 → WP-10 → WP-12 → WP-14 → WP-15 → WP-16 → WP-17 → WP-19 → H3.»

Son frases role=user del dueño, transmitidas por dirección; ID/fecha originales no expuestos. La segunda resolvió unir pasos 1+2 en el primer commit GREEN, ya publicado. Dirección posee Git/aceptación; una única escritora realiza el incremento autorizado. Citas completas en bitácora.

## Paquetes y decisiones resueltas

| Paquete / etapa | Estado |
|---|---|
| WP-0/1/2/4p/6/8a/11/3a/3b/5/7 | Publicados históricos; continuidad en bitácora, sin recertificación narrativa. |
| WP-8b / WP-4r / corte gráfico | Publicados `31ea8ad` / `f4e16b8` / `e53fb47`; el último fue un corte RED reservado. |
| Pasos 1+2 · DEC30/29 | Historia íntegra, protocolo ligero y conformidad compacta; abanicos sólo con extremo común en borde de cosa. Retirados FANLOCAL/B31/B32/B33, búsqueda de empaquetado/radios adaptados/vértices locales. |
| Paso 3 · DEC31/32 | Tabla27 temporal e internas elevadas ocultas; check1830/0/TSC0. |
| Paso 4 · dictamen | S2–S7/G1–G5 y coherencia/trazabilidad integrados; check1906/0/TSC0/exit0. Revisión única favorable, aceptado y publicado `69aee956`; paridad remota,0/0,árbol limpio verificados por dirección. |
| WP-9 (VAL) → WP-13 → H2 | WP-9 con VAL y siete suites/corpus completo: check2653/0/TSC0/exit0; T1922940,09ms. WP-9 publicado `2abecc6`; WP-13 cerrado en este commit: check2756/0/TSC0/exit0, revisión conjunta GLOBAL_FAVORABLE y aceptación técnica de dirección. DETENIDO EN H2. |
| WP-10 →12→14→15→16→17→19→H3 | Pendientes en orden autorizado; H3 exige suite/e2e/build y revisión de modelos reales. |

## Revisión y siguiente paso

Ola1–4: revisión favorable y publicación69aee956. Evidencia en bitácora; UI/producto completo/ISO pendientes.

Dirección acepta WP-13/criterios H2 tras revisión conjunta GLOBAL_FAVORABLE. Dirección conserva Git y verifica la publicación en el recibo de entrega. DETENIDO EN H2; próximo WP-10 al retomar. IndexedDB real y probe Vite verdes; build completo exit1 por main.tsx ausente (WP-14). UI/WP-10 no iniciados.

## Asuntos abiertos reales

- B15 conserva límites de layout importado y avisos; cinco dibujos diagnosticados no son exports canónicos. WP-9 acredita sólo las superficies y límites de conformidad; UI/WP-10 siguen pendientes.
- WP-18: imagen Docker futura tras WP-14 y permiso operativo; no se reabre infraestructura, migración ni despliegue real.
- Ninguna contradicción material nueva demostrada. H2/H3 siguen siendo las condiciones de detención autorizadas.
