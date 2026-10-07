# Avisos de autoría y licencias

El código propio del modelador rehecho está en `app/`.
No se declara una licencia general para este repositorio.

Dependencias de ejecución fijadas en `app/package.json`:

- Preact 10.29.1, licencia MIT; ©2015–present Jason Miller.
  Texto primario: `app/node_modules/preact/LICENSE`.
- Inria Serif 5.2.8, SIL Open Font License 1.1; ©2017 The Inria Serif
  Project Authors (BlackFoundryCom/InriaFonts).
  Texto primario: `app/node_modules/@fontsource/inria-serif/LICENSE`.
  La fuente regular e itálica se incrusta en SVG/HTML canónicos, mediante
  `app/src/opd/fuente.ts`. La licencia de la fuente se conserva al redistribuirla.

`canon/` contiene las cuatro obras del dueño vendorizadas como autoridad OPM local.
Sus versiones y hashes figuran en `canon/LEEME.md`.
El material observacional de OPCloud se retiró del árbol y permanece en el historial
Git. No se atribuye licencia ni autorización de redistribución a ese material;
purgar el historial requiere una decisión del dueño.
