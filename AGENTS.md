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

Para cambios de código, usa por defecto desde `app/`:

```bash
bun run check
```

Añade únicamente la comprobación que corresponda al cambio: tests focales para
semántica OPD/OPL, el escenario de navegador afectado para interacción o render,
`build` para empaquetado/corpus y los gates declarados en `app/package.json` para
refactors transversales o gobierno visual. No acumules controles no relacionados ni
declares roundtrip o fidelidad visual sin observarlos.

## Entrega

- Revisa el diff y conserva trabajo ajeno.
- Despliega únicamente mediante `./deploy/deploy.sh` cuando la solicitud autorice despliegue; no sustituyas ese circuito por comandos Compose directos.
- Documenta límites reales: suite verde no equivale a validación humana del modelado.
- Si queda trabajo material inconcluso, usa un único `HANDOFF.md` raíz, estable y sin fecha; elimínalo al cerrar. No crees `MEMORY.md`, continuidades fechadas ni archivos de sesión.
