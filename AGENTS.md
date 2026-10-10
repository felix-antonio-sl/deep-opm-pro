# AGENTS.md

## Misión
Construir y mantener el modelador OPM/ISO 19450 de `app/`: un solo modelo, dos expresiones
(OPD y OPL) simétricas y persistencia fiable. Este repositorio no es fuente de modelos de dominio.

## Autoridad
1. `canon/` (4 documentos 2.0, sólo ISO/PAS 19450:2015 en español; versiones en `canon/LEEME.md`) es la
   autoridad OPM local. Precedencia: reglas > spec-OPD / spec-OPL > metodología.
   `perfil/` reúne las reglas propias de OpForja (producto, extensiones, endurecimientos), con los IDs y la
   numeración del canon 1.x; se subordina al canon y nunca lo contradice.
2. `docs/especificacion.md` deriva del canon y del perfil (T-NNN, DR-n); `docs/decisiones.md` fija las
   decisiones del dueño y DS-n.
3. `docs/conformidad.md` declara todo DEBE no cumplido. La brecha silenciosa está prohibida.
No inventes reglas OPM locales. Si el canon no decide, aplica la válvula de simplicidad
(especificación §0.5) y regístrala.

## Arquitectura
- Código en `app/`. Dependencias: `nucleo → codec | opl | opd → editor → ui`; `servidor → codec`;
  `opl` y `opd` no se importan entre sí. `src/arquitectura.test.ts` lo hace cumplir.
- La validez de enlaces vive solo en `nucleo/matriz.ts`; cada oración OPL solo en
  `opl/plantillas.ts`; toda mutación es una operación de `nucleo/operaciones.ts` y pasa por
  `editor.ejecutar`. No dupliques reglas en la UI ni en el parser.
- Todo cambio semántico conserva el roundtrip estricto OPD↔OPL y el punto fijo del códec.
- Vocabulario de dominio del canon en español; identificadores ASCII.
- Prefiere el menor incremento vertical observable; no refactorices capas vecinas por conveniencia.

## Verificación
Desde `app/`: `bun run check`. Añade solo lo que corresponda: el escenario e2e afectado para
interacción; `bun run golden` y revisión visual de cada SVG cambiado para render; `bun run build`
para empaquetado; `bun test ../deploy` al tocar `deploy/`. No declares roundtrip ni fidelidad
visual sin observarlos. El título de cada prueba de un requisito empieza por su T-ID.

## Lista de cierre (canon reglas Anexo A y perfil reglas-opforja Anexo A; R-ANEXO-CHECK-1)
Todo cambio de modelado, parser, generador OPL, import/export o render canónico se revisa contra:
- Identidad (perfil): cosa, estado, enlace y OPD con id persistente, nunca `SDx.y` ni nombre (codec, forma).
- Firma: clase, dirección y tipos de extremos; ningún procedimental objeto-objeto ni invocación o excepción a
  objeto; estructural a estado sólo en las formas de ISO §10.4 y la especialización de estado; las que el
  producto no ofrece están declaradas en conformidad (matriz).
- Estado: todo estado con objeto dueño; sin doble por defecto; `Current` es extensión de perfil, nunca runtime
  (estados, forma).
- OPL: todo hecho nuclear visible emite plantilla canónica (generar, roundtrip-*).
- Parseo (perfil): toda oración aceptada reconstruye el mismo hecho; nunca entidades plausibles (analizar, editor-opl).
- Modificadores: `c/e` sólo en enlaces transformadores o habilitadores entrantes; nunca en resultado, estructural,
  invocación, excepción ni mitad de entrada escindida; el producto los niega también en la mitad de salida
  (endurecimiento declarado) (matriz).
- Refinamiento: el hijo agrega detalle y no contradice al padre; sin ciclos (refinamiento, proyeccion, frontera).
- Distribución: consumo/resultado no quedan en el contorno; ningún evento sistémico cruza el contorno; TS3 asignado
  a uno o dos subprocesos (el producto lo escinde por defecto; el resultado va al último, DEC45) (refinamiento).
- Vistas (perfil): no hay vistas tipificadas en el producto (registro B-16).
- UI (perfil): handles, overlays, guías y validación separados del canon; sin grilla (exportar, golden, e2e 18–19).
- Export (perfil): `canon-diagrama`/`canon-documento` declarados; una captura nunca es evidencia (exportar).
- Deuda (perfil): toda zona no canonizada queda registrada.

## Registro de conformidad
Todo diff que agregue, quite o cambie una fila de `NO_OFRECIDO`, `NO_SOPORTADAS`,
`NO_CANONIZADAS` o `CATALOGO`, o el estado de un DEBE, actualiza `docs/conformidad.md` en el
mismo commit. Cada fila de esas tablas lleva su `registro: 'B-nn'`.

## Entrega
- Revisa el diff y conserva trabajo ajeno.
- Despliega solo con `./deploy/deploy.sh` y solo cuando la solicitud lo autorice.
- Documenta límites reales: una suite verde no equivale a validación humana del modelado.
- Trabajo material inconcluso: un único `HANDOFF.md` en la raíz, estable y sin fecha; elimínalo
  al cerrar. No crees `MEMORY.md`, continuidades fechadas ni archivos de sesión.
