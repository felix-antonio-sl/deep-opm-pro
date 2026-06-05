# Proto-modelo OPM — Otorgamiento de permiso de edificación (DOM municipal)

Fecha: 2026-06-05 (v0.1 — primer borrador del segundo dominio).
Propósito: **experimento de falsación de generalidad** del compilador `autoria/compilar`
(deep-opm-pro): la gramática del sub-dialecto solo se falsó contra el estilo HODOM.
Este proto se escribió con naturalidad de modelador del dominio urbanístico chileno,
SIN ajustar las oraciones a lo que el normalizador acepta. Las divergencias que el
compilador reporte son el RESULTADO del experimento, no errores a esconder.

Dominio: tramitación de un permiso de edificación ante la Dirección de Obras
Municipales (DOM). Normativa de anclaje: LGUC (DFL 458, Ley General de Urbanismo y
Construcciones), OGUC y Ley 19.880 (procedimiento administrativo).

## SD0 — Sistema

La función del sistema es otorgar permisos de edificación conforme a la normativa
urbanística vigente. El beneficiario es el solicitante (propietario o su arquitecto
patrocinante); la autoridad resolutiva es el Director de Obras Municipales.

```opl
Municipalidad es física y sistémica.
Municipalidad exhibe Otorgamiento de permiso de edificación como su operación.
Otorgamiento de permiso de edificación es físico y sistémico.
Solicitante es físico y ambiental.
Arquitecto patrocinante es físico y ambiental.
Director de Obras Municipales es físico y sistémico.
Director de Obras Municipales maneja Otorgamiento de permiso de edificación.
Proyecto de edificación es informacional y ambiental.
Expediente de permiso es informacional y sistémico.
Expediente de permiso puede estar en uno de los estados 'ingresado', 'en revisión', 'observado', 'aprobado' o 'rechazado'.
Permiso de edificación es informacional y sistémico.
Otorgamiento de permiso de edificación requiere Proyecto de edificación.
Otorgamiento de permiso de edificación requiere Instrumento de planificación territorial vigente.
Instrumento de planificación territorial vigente es informacional y ambiental.
Otorgamiento de permiso de edificación cambia Expediente de permiso de 'ingresado' a 'aprobado'.
Otorgamiento de permiso de edificación genera Permiso de edificación (LGUC art. 116).
```

## SD1 — In-zoom del Otorgamiento

El macro-proceso sigue la secuencia administrativa clásica: ingreso, revisión,
resolución. La revisión puede observar el proyecto; el solicitante subsana y el
expediente vuelve a revisión (ciclo de subsanación, LGUC art. 118).

```opl
Otorgamiento de permiso de edificación se descompone en Ingreso de la solicitud, Revisión técnica del proyecto y Resolución del permiso en esa secuencia.
Ingreso de la solicitud, Revisión técnica del proyecto y Resolución del permiso son físicas y sistémicas.
Ingreso de la solicitud genera Expediente de permiso en estado 'ingresado'.
Ingreso de la solicitud requiere Certificado de informaciones previas.
Certificado de informaciones previas es informacional y sistémico.
Revisión técnica del proyecto cambia Expediente de permiso de 'ingresado' a 'en revisión'.
Revisión técnica del proyecto requiere Cuadro de normas urbanísticas.
Cuadro de normas urbanísticas es informacional y sistémico.
Acta de observaciones es informacional y sistémica.
Acta de observaciones puede estar 'emitida' o 'subsanada'.
Revisión técnica del proyecto genera Acta de observaciones cuando el proyecto incumple la OGUC.
Revisión técnica del proyecto cambia Expediente de permiso de 'en revisión' a 'observado' cuando emite observaciones.
Subsanación de observaciones es física y ambiental.
Solicitante maneja Subsanación de observaciones.
Expediente de permiso en 'observado' inicia Subsanación de observaciones.
Subsanación de observaciones cambia Acta de observaciones de 'emitida' a 'subsanada'.
Subsanación de observaciones cambia Expediente de permiso de 'observado' a 'en revisión'.
Resolución del permiso requiere Comprobante de pago de derechos municipales.
Comprobante de pago de derechos municipales es informacional y ambiental.
Resolución del permiso cambia Expediente de permiso a 'aprobado' o 'rechazado'.
Resolución del permiso genera Permiso de edificación cuando el expediente se aprueba.
Resolución del permiso está acotada por un plazo de 30 días (LGUC art. 118).
Resolución del permiso notifica al Solicitante la resolución adoptada.
Director de Obras Municipales maneja Resolución del permiso [RATIFICAR: ¿aplica silencio administrativo positivo de la Ley 19.880 al vencer el plazo?].
```

## SD1.R — In-zoom de la Revisión técnica

La revisión técnica se reparte por especialidad. La admisibilidad es previa y
formal; arquitectura y cálculo corren sobre el fondo del proyecto [B1].

```opl
Revisión técnica del proyecto se descompone en Revisión de admisibilidad, Revisión de arquitectura y Revisión de cálculo estructural.
Revisión de admisibilidad, Revisión de arquitectura y Revisión de cálculo estructural son físicas y sistémicas.
Revisión de admisibilidad requiere Expediente de permiso.
Revisión de arquitectura requiere Planos de arquitectura.
Planos de arquitectura son informacionales y ambientales.
Revisión de cálculo estructural requiere Memoria de cálculo.
Memoria de cálculo es informacional y ambiental.
Revisión de arquitectura detecta Incumplimiento normativo.
Incumplimiento normativo es informacional y sistémico.
Revisión de admisibilidad precede a Revisión de arquitectura.
```

## U1 — Despliegue del Expediente

El expediente es el agregado documental del trámite (OGUC §5.1.6).

```opl
Expediente de permiso se despliega en Solicitud firmada, Planos de arquitectura, Especificaciones técnicas y Certificado de informaciones previas.
Solicitud firmada es informacional y ambiental.
Especificaciones técnicas son informacionales y ambientales.
Expediente de permiso exhibe Fecha de ingreso.
Fecha de ingreso es informacional y sistémica.
```
