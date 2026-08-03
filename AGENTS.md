# AGENTS.md

## Misión

Construir y mantener el modelador OPM/ISO 19450 de `app/`. El resultado debe preservar la semántica del modelo, la edición bimodal OPD/OPL y una experiencia verificable; este repositorio no es la fuente de modelos de dominio.

## Entrada y autoridad

- Empieza por `README.md` y la documentación enlazada desde `docs/README.md` que corresponda a la tarea. Lee `HANDOFF.md` solo si existe y retomas trabajo material inconcluso.
- Usa el corpus KORA/OpForja instalado como autoridad metodológica; no copies evidencia reconstruida ni inventes reglas OPM locales.
- Mantén separados el producto modelador, los modelos externos y las vistas derivadas.

## Arquitectura

- Trabaja normalmente en `app/`.
- Dirección de dependencias: `modelo -> store -> app`; renderizadores e interfaz consumen `app`, nunca al revés.
- Todo cambio semántico debe conservar simetría forward/reverse entre OPD y OPL.
- No hardcodees rutas a repositorios de dominio. Usa contratos de importación/exportación.
- Prefiere el menor incremento vertical observable; no refactorices capas vecinas por conveniencia.

## Verificación

Ejecuta desde `app/` la comprobación más focal y amplía según el riesgo:

```bash
bun run typecheck
bun run test
bun run lint
bun run build
bun run check
```

Para cambios de interacción o render, añade el smoke de navegador pertinente. Para cambios arquitectónicos o de gobernanza visual, usa los gates declarados en `app/package.json`. No declares roundtrip ni fidelidad visual sin observarlos.

## Entrega

- Revisa el diff y conserva trabajo ajeno.
- Despliega únicamente mediante `./deploy/deploy.sh` cuando la solicitud autorice despliegue; no sustituyas ese circuito por comandos Compose directos.
- Documenta límites reales: suite verde no equivale a validación humana del modelado.
- Si queda trabajo material inconcluso, usa un único `HANDOFF.md` raíz, estable y sin fecha; elimínalo al cerrar. No crees `MEMORY.md`, continuidades fechadas ni archivos de sesión.
