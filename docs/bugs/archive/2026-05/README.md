# Archivo de bugs resueltos — rondas 18-25 (mayo 2026)

**Fecha de cierre administrativo**: 2026-05-22.

## Operación

Archivo masivo de 42 reportes de bug capturados in-vivo entre el
2026-05-07 y el 2026-05-21 y resueltos durante las rondas 18-25 del
ciclo de remediación UI/UX y refinamiento del modelo OPM. Cada bug se
movió desde `docs/bugs/` a `docs/bugs/archive/2026-05/` sin modificar
el contenido de su `report.md`, `payload.json` ni `screenshots/`.

40 de los 42 corresponden a defectos cerrados por commits específicos
(la mayoría con tag explícito `BUG-...` en el mensaje). 2 corresponden
a bugs obsoletos: el refactor arquitectónico de rondas 19-23 los hizo
desaparecer en estado, sin commit dedicado.

## Tabla bug → commit

| Bug ID corto | Commit | Cierre |
|---|---|---|
| 19b234 | dd315ec | fix(ui): aclara creacion continua |
| 2dae09 | a46e106 | fix(ui): deduplica ejemplo organizacional |
| 617932 | refactor general | iconos rediseñados en ronda23 (chrome editorial) — obsoleto |
| 372334 | 6d26146 | fix(opl,tests): despliegue fuera del padre |
| d78ae2 | refactor general | botones inactivos del despliegue — obsoleto post-rediseño contextual |
| 692129 | eb9f42e | refactor visual chrome (ronda18) |
| 13e330 | 1e55a72 | fix(toolbar): menu Tipos validos cierra con Esc |
| 91e001 | e5a0613 | fix(modelo): Delete cross-OPD |
| 13c786 | e5a0613 | fix(store): unicidad global de nombres canonicos |
| ad652b | 4f7dc66 | fix(menu-principal): monta MenuPrincipal en App.tsx |
| 9e8ac5 | 96d671d | fix(toolbar-mas): portal a body |
| a0dc5f | edfbc68 | feat(layout-sugerido): redisena autolayout OPCloud |
| e749eb | edfbc68 | feat(layout-sugerido): unfold no usa contención |
| 40280f | edfbc68 | feat(layout-sugerido): inzoom distribuye horizontal |
| 1fc4d2 | 554d0ca | fix(enlaces-estados): endpoints id+selector y z=20 |
| 70e055 | refactor general (ronda19 fase0-ux 6c831e3) | despliegue de mejoras |
| 898270 | refactor general (ronda19-23 chrome editorial) | densidad reducida |
| 696858 | fc7c2e6 | merge(BUG-696858): Inspector pane resizable |
| 365788 | 331ad45 | fix(canvas): muestra flechas de invocacion |
| 02b906 | 6b9a68f | fix(refinamiento): evita expandir derivados al mover |
| 1c2cc0 | edfbc68 | autolayout padre+hijos estructurales |
| 029d2b | edfbc68 | autolayout sandbox opcloud-like |
| d4931c | 2cb02b5 | fix(persistencia): dirtyModelo deriva de dirty |
| 81916b | 08c0702 | fix(visual): markers instrumento/agente y badge condicion |
| 63cc7f | 187562a | fix(visual): badges modificador c/e/¬ sobre el enlace |
| 4c1753 | 3e2332e | fix(visual): marker resultado vuelve a swallowtail |
| 842217 | c1ec59d | fix(canvas): evita crash al angular enlaces ruteados |
| 8826ba | f6bf54a | fix(canvas): alinea anclas de triangulos estructurales |
| faff73 | 331ad45 | fix(canvas): muestra flechas de invocacion |
| 7b26e5 | e485af5 | fix(fixtures): aproxima sd sync al sandbox opcloud |
| 2866a4 | 26a82ac | fix(fixtures): aproxima sd async al sandbox opcloud |
| 362df1 | 8bfb5e0 | fix(ui): densifica arbol opd |
| 359c5c | 64dd5aa | refactor(canvas): unifica evaluacion preventiva de enlaces |
| 09c0d4 | dae1eec | fix(refinamiento): evita confinar objetos contextuales |
| b64eb0 | ad9f762 | fix(canvas): endereza remate de invocacion |
| 8af9a8 | abe4646 | fix(modelo): exige puertos exactos en abanicos |
| 72ab52 | 0ceb325 | feat(ui): permite crear fans desde el inspector |
| d237be | 061ea8e | fix(ui): permite subir imagenes locales |
| bddc4e | 98bf949 | fix(refinamiento): proyecta fans derivados |
| fe34b6 | e01b89f | fix(opl): resuelve referencias pendientes en edición libre |
| a054e1 | e01b89f | fix(opl): resuelve referencias pendientes en edición libre |
| 7d8b75 | 21bfb39 | fix(opl): abanico OR/XOR respeta modificador condicion |

Confianza alta donde el commit message cita el bug ID o donde el fix
toca exactamente la superficie reportada en el screenshot. "refactor
general" marca bugs absorbidos por una transformación más amplia
(autolayout OPCloud-like, chrome editorial ronda23, fase0-ux ronda19).

## Backlog activo en `docs/bugs/`

Quedan 8 carpetas BUG-* fuera del archivo, sin defecto funcional
pendiente:

**4 reproducibles UX** — mejoras de microcopy/discoverability detectadas
durante rondas 24-25 pero que el equipo decidió no tratar como bugs:

- `BUG-20260513T050858Z-ad9486` — canvas infinito + zoom menos sensible.
- `BUG-20260519T175216Z-94a7c9` — simplificar/normalizar funciones desde UX.
- `BUG-20260520T180813Z-63276a` — quitar texto MODELAR/CONECTAR/AYUDA (parcialmente cubierto por ronda25/L1 III.A; queda residual).
- `BUG-20260520T180859Z-77e6cf` — barra contextual sin propósito visible para el operador.

**4 incertidumbres cosméticas** — defectos visuales menores pendientes
de verificación contra sandbox OPCloud, no funcionales:

- `BUG-20260513T050729Z-c3b971` — extremos de enlace dejan distancia al contorno.
- `BUG-20260513T185113Z-702609` — triángulos estructurales no perfectamente alineados.
- `BUG-20260513T190626Z-05c5f7` — enlaces múltiples no se sobreponen, se separan.
- `BUG-20260519T200211Z-62ee85` — OPL no representa especificación de estados de enlaces.

## Política de archivo

Los reportes nuevos del capturador integrado siguen escribiéndose en
`docs/bugs/`. Cada cierre semestral (o cuando el directorio supere las
~40 carpetas), los bugs resueltos o absorbidos por refactor se mueven
en bloque a `docs/bugs/archive/YYYY-MM/` con un README equivalente al
presente que documente bug → commit y el estado del backlog vivo.

Los `report.md` archivados son inmutables. Si un bug archivado
re-aparece, se captura uno nuevo en `docs/bugs/` con referencia
explícita al archivado.
