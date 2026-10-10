# Cambios del canon 2.0.0

Registro regla por regla del paso de las versiones 1.x a 2.0.0 (2026-10-10), revisadas cláusula por cláusula contra
ISO/PAS 19450:2015 (DEC39–DEC45 en `docs/decisiones.md`). Cada documento conserva la numeración de secciones de su
versión 1.x; lo que salió del canon vive en `perfil/` con el mismo ID y el mismo número de sección.

Destinos: `canon` (queda, con o sin corrección), `perfil` (sale al documento del perfil indicado), `fusionada`
(alias o remisión a otra regla), `eliminada-duplicada` (repetía una definición; queda la remisión). «Cambio» resume
la corrección; «ISO» da las cláusulas que la fundan. Las procedencias antiguas (SSOT-*, V-nn, capas de la KB) no
se conservan en el canon: este registro es su única traza.

## reglas-opm-estrictas-es 1.5.0 → 2.0.0

Integración: las tablas de plantillas de §4 quedan como índice (ID → sección de spec-OPL) porque spec-OPL es el único
documento que define el texto de cada plantilla. Los avisos «ver perfil …» que señalaban reglas trasladadas se retiraron
del canon: su destino está en esta tabla.

Perfil: `perfil/reglas-opforja.md`. Entradas: canon 552, eliminada-duplicada 70, fusionada 12, perfil 323; nuevas 32.

### Secciones

| Sección | Título | Destino |
|---|---|---|
| Definición | Definición | perfil |
| Mapa de familia Forja | Mapa de familia Forja | perfil |
| Definiciones | Definiciones | ambos |
| Precedencia | Precedencia | perfil |
| Convenciones | Convenciones | canon |
| Convención de citas | Convención de citas | perfil |
| Contrato prescriptivo de exhaustividad | Contrato prescriptivo de exhaustividad | perfil |
| Conformidad OPM | Conformidad OPM | ambos |
| Principios de modelado como reglas | Principios de modelado como reglas | canon |
| §2 | 2. Ontología de entidades | canon |
| §2.1 | 2.1 Cosas (`thing`, glosario 3.76) | canon |
| §2.2 | 2.2 Objetos (3.39) | ambos |
| §2.3 | 2.3 Procesos (3.58) | ambos |
| §2.4 | 2.4 Nombres válidos (OPL-ES) | canon |
| §2.5 | 2.5 Qué NO puede ser una cosa | ambos |
| §2.6 | 2.6 Estados (3.68) | ambos |
| §2.7 | 2.7 Instancias | ambos |
| §2.8 | 2.8 Modelo conceptual, ejecución y realización | ambos |
| §2.9 | 2.9 Metamodelo OPM | ambos |
| §3 | 3. Reglas visuales del OPD | canon |
| §3.1 | 3.1 Primitivas geométricas (`SSOT-visual §1.1`) | canon |
| §3.2 | 3.2 Producto cartesiano Forma × Contorno × Profundidad (`V-1`, `§1.4`) | canon |
| §3.3 | 3.3 Contorno (`§1.2`) | canon |
| §3.4 | 3.4 Profundidad/sombra (`§1.3`) | ambos |
| §3.5 | 3.5 Colores canónicos (`§1.1b`) | ambos |
| §3.6 | 3.6 Tipografía y rotulado | perfil |
| §3.7 | 3.7 Decoraciones de extremo de enlace (`§1.5`) | ambos |
| §3.8 | 3.8 Símbolos triangulares (relaciones estructurales fundamentales, `§1.7`) | ambos |
| §3.9 | 3.9 Marcas textuales sobre enlaces (`§1.6`) | canon |
| §3.10 | 3.10 Indicadores auxiliares (`§1.8`) | ambos |
| §3.11 | 3.11 Anidamiento permitido | canon |
| §3.12 | 3.12 Tamaños, layout y grid | ambos |
| §4 | 4. Reglas gramaticales OPL-ES | canon |
| §4.0 | 4.0 Contrato textual OPL-ES (`SSOT-opl §0`) | canon |
| §4.1 | 4.1 Convenciones tipográficas Markdown (`SSOT-opl §1.7`) | perfil |
| §4.2 | 4.2 Decisiones de diseño OPL-ES (`§1`) | canon |
| §4.3 | 4.3 Vocabulario fijo de verbos (`§2`) | ambos |
| §4.4 | 4.4 Plantillas — cosas (`§3`) | ambos |
| §4.5 | 4.5 Plantillas — enlaces transformadores (`§4`) | canon |
| §4.6 | 4.6 Plantillas — enlaces habilitadores (`§5`) | canon |
| §4.7 | 4.7 Plantillas — enlaces de evento (`§6`) | canon |
| §4.8 | 4.8 Plantillas — enlaces de condición (`§7`) | ambos |
| §4.9 | 4.9 Plantillas — excepción e invocación (`§8`) | canon |
| §4.10 | 4.10 Plantillas — enlaces estructurales (`§9`) | canon |
| §4.11 | 4.11 Plantillas — gestión de contexto (`§10`) | ambos |
| §4.12 | 4.12 Etiquetas de ruta (`§13`) | ambos |
| §4.13 | 4.13 Atributos y valores (`§14`) | ambos |
| §4.14 | 4.14 EBNF normativa | ambos |
| §4.15 | 4.15 Equivalencia EN↔ES de ida y vuelta (`§18.4`) | ambos |
| §4.16 | 4.16 Transformación sistemática EN→ES (`SSOT-opl §15`) | ambos |
| §4.17 | 4.17 Política de idioma y modelos mixtos (`SSOT-opl §18`) | perfil |
| §5 | 5. Enlaces — taxonomía estricta | canon |
| §5.1 | 5.1 Familias canónicas de enlace (`V-239`, extensión Forja: 6.ª familia) | ambos |
| §5.2 | 5.2 Enlaces transformadores (`SSOT-iso §Enlaces transformadores`) | canon |
| §5.3 | 5.3 Enlaces habilitadores (`SSOT-iso §Enlaces habilitadores`) | ambos |
| §5.4 | 5.4 Enlaces de invocación (`SSOT-iso §Enlaces de invocación`, `V-240`) | ambos |
| §5.5 | 5.5 Enlaces estructurales fundamentales (`SSOT-iso §Enlaces estructurales`) | ambos |
| §5.6 | 5.6 Enlaces estructurales etiquetados (`SSOT-iso §Enlaces estructurales`, `§8.1`) | canon |
| §5.7 | 5.7 Enlaces de excepción (`SSOT-iso §Enlaces de control: condiciones y excepciones`) | ambos |
| §5.8 | 5.8 Principio de unicidad del enlace procedimental (`V-11`, `SSOT-iso §Panorama de enlaces`) | canon |
| §6 | 6. Modificadores y combinaciones | canon |
| §6.1 | 6.1 Naturaleza de los modificadores (`SSOT-iso §Enlaces de control`, `V-12`) | canon |
| §6.2 | 6.2 Lado de aplicación: INPUT-only | canon |
| §6.3 | 6.3 Asimetría consumo / resultado bajo `e` y `c` | canon |
| §6.4 | 6.4 Otras combinaciones de modificadores | ambos |
| §6.5 | 6.5 Resolución de colisión de rol — fuerza semántica | canon |
| §6.6 | 6.6 Matriz de precedencia transformadora (recomposición) | ambos |
| §6.7 | 6.7 Multiplicidad y cardinalidad (`SSOT-iso §Cardinalidades`, `SSOT-opl §12`) | canon |
| §6.8 | 6.8 Probabilidad (`SSOT-iso §Operadores lógicos`) | canon |
| §7 | 7. Abanicos lógicos (XOR / OR) | canon |
| §7.1 | 7.1 Geometría (`SSOT-visual §5`) | canon |
| §7.2 | 7.2 Aplicabilidad por familia (`V-15`, `SSOT-visual §5.5`) | canon |
| §7.3 | 7.3 Plantillas OPL-ES (`SSOT-opl §11.2`, `§11.3`) | canon |
| §7.4 | 7.4 Combinación con modificadores (`SSOT-opl §11.4`) | ambos |
| §7.5 | 7.5 Resultado-fan-XOR como expansión de resultado simple a objeto con estados (`V-19`) | canon |
| §7.6 | 7.6 m-de-f combinatorial (`SSOT-metod §10.5`) | perfil |
| §8 | 8. Refinamiento | canon |
| §8.1 | 8.1 Mecanismos canónicos (`SSOT-iso §Gestión de contexto`, `SSOT-visual §10.1`, `SSOT-metod §8.1`) | ambos |
| §8.2 | 8.2 Descomposición síncrona vs despliegue asíncrono | canon |
| §8.3 | 8.3 Refinamiento no trivial (`SSOT-metod §7.1`) | perfil |
| §8.4 | 8.4 Enlaces escindidos (`V-40`, `V-110`, `SSOT-iso §Enlaces transformadores escindidos`, `SSOT-opl §4.2 nota TS4/TS5`) | ambos |
| §8.5 | 8.5 Distribución de enlaces al descomponer (`SSOT-visual §11`, `SSOT-metod §7.4`) | ambos |
| §8.6 | 8.6 Contenedor y elementos externos (`V-79`–`V-85`) | ambos |
| §8.7 | 8.7 Identidad persistente vs etiqueta visible (`V-246`–`V-250`) | perfil |
| §8.8 | 8.8 Restricciones de refinamiento | ambos |
| §8.9 | 8.9 Cambio de rol entre niveles (`V-42`, `V-111`, `V-112`, `SSOT-metod §9.4`) | ambos |
| §8.10 | 8.10 SD, árboles, vistas y OPL completo | ambos |
| §8.11 | 8.11 Descomposición y recomposición como operaciones de herramienta | ambos |
| §9 | 9. Relación OPD↔OPL (bisimetría) | canon |
| §9.1 | 9.1 Principio (`V-65`, `SSOT-iso §Representación bimodal`) | canon |
| §9.2 | 9.2 Tabla de bisimetría (canónica) | canon |
| §9.3 | 9.3 Casos donde la bisimetría se rompe / requiere convención | ambos |
| §9.4 | 9.4 Principio de consistencia de hechos (`V-98`, `SSOT-iso §Principio de consistencia`) | canon |
| §9.5 | 9.5 Importancia proporcional (`V-99`) | ambos |
| §10 | 10. Escenarios OPD<->OPL — reglas de edición, importación y bloqueo | perfil |
| §10.1 | 10.1 Principio de hecho único | ambos |
| §10.2 | 10.2 Política de importación OPL | perfil |
| §10.3 | 10.3 Política de edición OPD | perfil |
| §11 | 11. Anti-patrones — reglas de prohibición | perfil |
| §11.1 | 11.1 Tabla maestra de anti-patrones | ambos |
| §11.2 | 11.2 Zonas no canonizadas (silencios de la SSOT) | ambos |
| §12 | 12. Aplicación a `deep-opm-pro` | perfil |
| Anexos | Anexos | canon |
| Anexo A | Anexo A — Checklist de cierre OPD<->OPL | ambos |
| Anexo B | Anexo B — Desarrollo prescriptivo de cobertura `SSOT-visual` | ambos |
| Anexo C | Anexo C — Extensión categorial de opforja (linealidad, equivalencia funcional, composición) | perfil |

### Reglas

| ID | Línea 1.x | Destino | Sección 2.0 | Cambio | ISO |
|---|---|---|---|---|---|
| — | 25 | perfil | Definición | sin cambio |  |
| — | 25 | perfil | Definición | sin cambio |  |
| — | 27 | perfil | Definición | sin cambio |  |
| — | 31 | perfil | Mapa de familia Forja | sin cambio |  |
| — | 35 | perfil | Mapa de familia Forja | sin cambio |  |
| — | 36 | perfil | Mapa de familia Forja | sin cambio |  |
| — | 37 | perfil | Mapa de familia Forja | sin cambio |  |
| — | 38 | perfil | Mapa de familia Forja | sin cambio |  |
| — | 39 | perfil | Mapa de familia Forja | sin cambio |  |
| — | 41 | perfil | Mapa de familia Forja | sin cambio |  |
| — | 41 | perfil | Mapa de familia Forja | sin cambio |  |
| — | 41 | perfil | Mapa de familia Forja | sin cambio |  |
| — | 41 | perfil | Mapa de familia Forja | sin cambio |  |
| — | 41 | perfil | Mapa de familia Forja | sin cambio |  |
| — | 41 | perfil | Mapa de familia Forja | sin cambio |  |
| — | 47 | perfil | Definiciones | sin cambio |  |
| — | 48 | perfil | Definiciones | sin cambio |  |
| — | 49 | perfil | Definiciones | sin cambio |  |
| — | 50 | perfil | Definiciones | sin cambio |  |
| — | 51 | perfil | Definiciones | sin cambio |  |
| — | 52 | perfil | Definiciones | sin cambio |  |
| — | 53 | perfil | Definiciones | sin cambio |  |
| — | 54 | perfil | Definiciones | sin cambio |  |
| — | 55 | fusionada→ R-BI-DUAL-1 | Definiciones | fusionada: la bimodalidad es DEBE (ISO §6.2.1), no capacidad; queda en R-BI-DUAL-1 | 6.2.1 |
| — | 59 | perfil | Precedencia | sin cambio |  |
| — | 61 | perfil | Precedencia | sin cambio |  |
| — | 63 | perfil | Precedencia | sin cambio |  |
| — | 65 | perfil | Precedencia | sin cambio |  |
| — | 65 | perfil | Precedencia | sin cambio |  |
| — | 67 | perfil | Precedencia | sin cambio |  |
| — | 69 | perfil | Precedencia | sin cambio |  |
| — | 75 | perfil | Convención de citas | sin cambio |  |
| — | 82 | perfil | Convención de citas | sin cambio |  |
| R-DOC-1 | 86 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| R-DOC-2 | 87 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| R-DOC-3 | 88 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| R-DOC-4 | 89 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| R-DOC-4A | 90 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| R-DOC-4B | 91 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| R-DOC-4C | 92 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| R-DOC-5 | 93 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| R-DOC-6 | 94 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| R-DOC-7 | 95 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| R-DOC-8 | 96 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| — | 102 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| — | 103 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| — | 104 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| — | 105 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| — | 106 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| — | 108 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| — | 114 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| — | 115 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| — | 116 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| — | 117 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| — | 118 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| — | 120 | perfil | Contrato prescriptivo de exhaustividad | sin cambio |  |
| R-CONF-1 | 126 | canon | Conformidad OPM | corregida: R-CONF-1: usar sólo los símbolos de la cláusula 4 y los elementos de las cláusulas 7 a 12 con el significado que les asigna la norma (5 a)). | 5 |
| R-CONF-2 | 127 | canon | Conformidad OPM | corregida: R-CONF-2: cumplir R-CONF-1 y el enfoque y esquema de modelado de las cláusulas 6 y 14 (5 b)). | 5, 6, 14 |
| R-CONF-3 | 128 | canon | Conformidad OPM | corregida: R-CONF-3: cumplir R-CONF-1, guiar y ayudar al usuario a cumplir R-CONF-2 y soportar OPL según la EBNF del Anexo A (5 c)). | 5, A |
| R-CONF-4 | 130 | canon | Conformidad OPM | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 5 |
| R-CONF-5 | 131 | canon | Conformidad OPM | corregida: R-CONF-5: una herramienta que no guía ni ayuda al usuario a cumplir la conformidad completa no es conforme como herramienta (5 c)2). | 5 |
| R-CONF-6 | 132 | perfil | Conformidad OPM | sin cambio |  |
| R-CONF-7 | 133 | perfil | Conformidad OPM | sin cambio |  |
| R-PRIN-1 | 137 | canon | Principios de modelado | corregida: R-PRIN-1: la función del sistema y el propósito de modelado DEBEN guiar el alcance y el grado de detalle del modelo (6.1.1). | 6.1.1, 14.1 |
| R-PRIN-2 | 138 | canon | Principios de modelado | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 6.1.1, 14.1 |
| R-PRIN-3 | 139 | canon | Principios de modelado | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 6.1.2, 3.43 |
| R-PRIN-4 | 140 | canon | Principios de modelado | corregida: R-PRIN-4: el proceso que provee el valor funcional DEBE expresar la función del sistema tal como la percibe su beneficiario principal (6.1.3). | 3.23, 6.1.3 |
| R-PRIN-5 | 141 | canon | Principios de modelado | corregida: R-PRIN-5: el modelador DEBERÍA distinguir función y comportamiento (6.1.4). | 6.1.4 |
| R-PRIN-6 | 142 | canon | Principios de modelado | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 6.1.5, 7.3.3, 7.3.4 |
| R-PRIN-7 | 143 | canon | Principios de modelado | corregida: R-PRIN-7: el entorno DEBE ser una colección de cosas fuera del sistema que pueden interactuar con él, con afiliación ambiental (6.1.5, 7.3.3). | 6.1.5 |
| R-PRIN-8 | 144 | canon | Principios de modelado | corregida: R-PRIN-8: el grado de detalle DEBE equilibrar claridad y completitud mediante los mecanismos de refinamiento-abstracción (6.1.6, 14.1, 14.2.1). | 6.1.6, 14.1, 14.2.1 |
| R-PRIN-9 | 145 | canon | Principios de modelado | corregida: R-PRIN-9: todo OPD, también el orientado a un interesado, pertenece al mismo modelo y NO DEBE contradecir hechos de otro OPD (14.2.3). | 6.1.1, 14.2.3, B.4 |
| — | 153 | canon | §2.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 7.3.1, 3.76 |
| — | 157 | canon | §2.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 3.39, 7.1.2, 3.50, A.4.4.2 |
| — | 158 | canon | §2.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 3.58, 7.2.2, 3.50, A.4.4.2 |
| R-COSA-1 | 162 | canon | §2.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 7.3.1, 6.2.2 |
| R-COSA-2 | 163 | canon | §2.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 3.50, 7.3.3, A.4.4.2 |
| R-COSA-3 | 164 | canon | §2.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 3.76, 3.68 |
| R-OBJ-1 | 168 | canon | §2.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 3.39, 7.1.1 |
| R-OBJ-2 | 169 | canon | §2.2 | corregida: R-OBJ-2: …un objeto sin estados NO puede ser afectado: como transformado sólo puede crearse o consumirse; puede además ser habilitador (3.2 Nota 1, 3.17). | 3.66, 3.67, 3.2, 3.15 |
| R-OBJ-3 | 170 | canon | §2.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 7.3.3, 7.3.4, A.4.4.2 |
| R-OBJ-4 | 174 | canon | §2.2 | corregida: R-OBJ-4: un objeto PUEDE declarar tipo ∈ {boolean, string, [unsigned] integer, float, double, short, long, enumerated} («Objeto es de tipo T», A.4.4.3). | A.3.2, A.4.4.3 |
| R-OBJ-5 | 175 | canon | §2.2 | corregida: R-OBJ-5: la esencia por defecto de una cosa es informacional (A.4.4.2); la esencia primaria del sistema es la de la mayoría de sus cosas (3.55, 7.3.4). | 3.55, 7.3.4, A.4.4.2 |
| R-OBJ-6 | 176 | perfil | §2.2 | decidir → perfil (política: sin base en la PAS); marcada [extensión], verificar con la IS 2024 | 7.3.3, 7.3.4 |
| R-OBJ-7 | 177 | perfil | §2.2 | decidir → perfil (política: sin base en la PAS) | 7.3.3, 6.1.5 |
| R-PROC-1 | 181 | canon | §2.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 3.58, 7.2.1, 6.2.3 |
| R-PROC-2 | 182 | canon | §2.3 | corregida: R-PROC-2: todo proceso DEBE transformar al menos un objeto por consumo, resultado o efecto; un habilitador no satisface el requisito (7.2.1, 3.17). | 3.58, 7.2.1, 7.3.2, 3.17 |
| R-PROC-2A | 183 | perfil | §2.3 | decidir → perfil (política: «proceso persistente» contradice ISO §3.50); anotada [extensión] | 3.50, 7.3.3, A.4.4.2 |
| R-PROC-3 | 184 | canon | §2.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 7.2.1 |
| R-PROC-4 | 185 | canon | §2.3 | corregida: marcada [informativo]; Lo funda 3.68 Nota 1 (nota a la entrada), que también sugiere subprocesos; el canon no lo eleva a DEBE. | 3.68 |
| R-PROC-5 | 186 | perfil | §2.3 | decidir → perfil (política: «proceso persistente»); anotada [extensión] | 3.50, 7.3.3, A.4.4.2, C.4 |
| R-PROC-6 | 187 | perfil | §2.3 | sin cambio |  |
| R-PROC-7 | 188 | perfil | §2.3 | decidir → perfil (política: «proceso persistente»); anotada [extensión] | 3.50, 3.2 |
| R-NOM-OBJ-1 | 192 | canon | §2.4 | corregida: R-NOM-OBJ-1: un nombre de objeto DEBE ser una frase nominal capitalizada (A.3.3) y DEBERÍA ser singular (B.6.2). | A.3.3, B.6.2, B.6.5 |
| R-NOM-OBJ-2 | 193 | canon | §2.4 | corregida: R-NOM-OBJ-2: un objeto de varios miembros DEBERÍA nombrarse con «Conjunto» (inanimados) o «Grupo» (humanos) más el nombre singular (B.6.2). | B.6.2 |
| R-NOM-PROC-1 | 194 | canon | §2.4 | corregida: R-NOM-PROC-1: un nombre de proceso DEBE ser una frase capitalizada (A.3.3) y DEBERÍA terminar en la forma verbal española equivalente al gerundio (B.6.3). | A.3.3, B.6.3 |
| R-NOM-PROC-2 | 195 | canon | §2.4 | corregida: R-NOM-PROC-2: un nombre de proceso DEBERÍA tener a lo sumo cuatro palabras (B.6.3). | B.6.3 |
| R-NOM-PROC-3 | 196 | canon | §2.4 | decidir → canon [localización] (directiva: capitalización con excepción de artículos y preposiciones breves) | A.3.3, B.6.5 |
| R-NOM-EST-1 | 197 | canon | §2.4 | corregida: R-NOM-EST-1: un nombre de estado DEBE comenzar en minúscula (A.4.2) y DEBERÍA usar forma pasiva (B.6.4). | A.4.2, B.6.4, B.6.5 |
| R-NOM-ETIQ-1 | 198 | canon | §2.4 | corregida: R-NOM-ETIQ-1: una etiqueta de enlace estructural DEBE ser una frase que comienza en minúscula (A.4.2). | A.4.2, B.6.5 |
| — | 204 | canon | §2.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 3.76, 3.68 |
| — | 205 | canon | §2.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 3.16, 6.2.2 |
| — | 206 | canon | §2.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 3.4, 10.3.1 |
| — | 207 | perfil | §2.5 | sin cambio |  |
| — | 208 | perfil | §2.5 | sin cambio |  |
| R-EST-1 | 212 | canon | §2.6 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 3.68, 7.3.5.2 |
| R-EST-2 | 213 | canon | §2.6 | corregida: R-EST-2: un estado PUEDE designarse inicial, final o por defecto (7.3.5.3); los demás estados no llevan designación. | 7.3.5.3, C.4 |
| — | 217 | canon | §2.6 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 7.3.5.4, A.4.4.4, C.4 |
| — | 218 | canon | §2.6 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 7.3.5.4, A.4.4.4 |
| — | 219 | canon | §2.6 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 7.3.5.4, A.4.4.4, C.4 |
| — | 220 | perfil | §2.6 | sin cambio | C.4, 3.69 |
| — | 221 | canon | §2.6 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 7.3.5.2 |
| R-EST-3 | 223 | canon | §2.6 | corregida: R-EST-3: un mismo estado PUEDE ser inicial y final (7.3.5.3 no los excluye). | 7.3.5.3, A.4.4.4 |
| R-EST-4 | 224 | perfil | §2.6 | sin cambio |  |
| R-INS-1 | 228 | canon | §2.7 | corregida: R-INS-1: crear una cosa en el modelo conceptual implica que puede existir al menos una instancia operacional de ella o de una especialización (10.3.5.1 NOTA 2). | 10.3.5.1, 3.29 |
| R-INS-2 | 229 | canon | §2.7 | corregida: R-INS-2: DEBE distinguirse instancia de modelo (3.28) de instancia operacional (3.29); repetir una cosa en otro o el mismo OPD es aparición del mismo elemento (B.4, B.5), no instancia. | 3.28, 3.29, B.4, B.5 |
| R-INS-3 | 230 | canon | §2.7 | corregida: R-INS-3: el rótulo de una instancia PUEDE mostrarse como «Instancia : Clase» (10.3.5.1, Figuras 26–27); la OPL es «Instancia is an instance of Clase». | 10.3.5.1 |
| R-INS-4 | 231 | canon | §2.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 6.2.6.1 |
| R-INS-6 | 232 | perfil | §2.7 | sin cambio | 10.3.4.2, 10.3.5.1 |
| R-EJEC-1 | 236 | canon | §2.8 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 6.2.6.1 |
| R-EJEC-3 | 237 | perfil | §2.8 | sin cambio |  |
| R-EJEC-6 | 238 | perfil | §2.8 | sin cambio |  |
| R-EJEC-7 | 239 | canon | §2.8 | corregida: R-EJEC-7: si al iniciarse el proceso no existe la instancia operacional del objeto con `c`, la precondición falla y el control omite el proceso (9.5.3). | 9.5.3.1, 9.5.3.2, 8.2.1 |
| R-EJEC-8 | 240 | canon | §2.8 | corregida: R-EJEC-8: el proceso sólo se ejecuta si se satisface la precondición de todo el conjunto preproceso; la falta de cualquier objeto con `c` lo omite (9.5.3). | 9.5.3.1, 8.2.2 |
| R-EJEC-9 | 241 | canon | §2.8 | corregida: R-EJEC-9: al completarse un proceso, el control inicia de inmediato el proceso invocado; un proceso omitido no se completa y no invoca (9.5.2.5.1, NOTA 1). | 9.5.2.5.1, 9.5.2.5 |
| R-EJEC-10 | 242 | perfil | §2.8 | sin cambio |  |
| R-META-1 | 246 | canon | §2.9 | corregida: R-META-1: un modelo OPM DEBE expresarse como conjunto de OPDs y su especificación OPL equivalente (6.2.1; C.2). | 6.2.1, C.2 |
| R-META-2 | 247 | canon | §2.9 | corregida: R-META-2: según el metamodelo (C.2, informativo), un OPD consta de constructos y cada constructo de un conjunto de cosas y uno de enlaces. | C.2, C.3 |
| R-META-3 | 248 | canon | §2.9 | corregida: R-META-3: un párrafo OPL DEBE ser una secuencia de oraciones OPL terminadas en punto (A.4.1); frases y frases reservadas son del metamodelo informativo (C.2). | A.4.1, C.2 |
| R-META-4 | 249 | perfil | §2.9 | sin cambio | C.2 |
| R-META-5 | 250 | canon | §2.9 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 6.2.1 |
| R-META-6 | 251 | perfil | §2.9 | sin cambio |  |
| R-META-7 | 252 | perfil | §2.9 | sin cambio |  |
| R-META-8 | 253 | perfil | §2.9 | sin cambio |  |
| R-META-9 | 254 | perfil | §2.9 | sin cambio |  |
| R-META-10 | 255 | canon | §2.9 | corregida: R-META-10: un constructo básico consta de exactamente dos cosas y un enlace (C.3, informativo). | C.3 |
| R-META-11 | 256 | canon | §2.9 | corregida: marcada [informativo]; Informativo y redactado sin elevar. | C.3 |
| R-META-12 | 257 | perfil | §2.9 | sin cambio |  |
| R-META-13 | 258 | canon | §2.9 | corregida: R-META-13: un enlace une dos cosas y consta de origen, destino y conector; el conector, de línea, símbolo, etiqueta opcional y etiqueta de ruta opcional (C.4). | C.4, 3.36 |
| R-META-14 | 259 | fusionada→ R-COSA-1 | §2.9 | fusionada: Fusionar con R-COSA-1. | 7.3.1 |
| R-META-15 | 260 | canon | §2.9 | corregida: R-META-15: un objeto con s estados representa s objetos específicos de estado, cada uno especialización del objeto que refiere a un estado (C.4, informativo). | C.4 |
| R-META-16 | 261 | canon | §2.9 | corregida: R-META-16: el objeto específico de estado se enlaza por enlace etiquetado «refiere a» cuyo destino es el estado (C.4, Fig. C.6). | C.4, 10.4.2.3 |
| — | 271 | eliminada-duplicada→ spec-OPD §2.1, §3.1 | §3.1 | fila de notación gráfica: la define spec-OPD §2.1, §3.1; el canon remite | 4, 7.1.2 |
| — | 272 | eliminada-duplicada→ spec-OPD §2.1, §3.1 | §3.1 | fila de notación gráfica: la define spec-OPD §2.1, §3.1; el canon remite | 4, 7.2.2 |
| — | 273 | eliminada-duplicada→ spec-OPD §2.1, §3.1 | §3.1 | fila de notación gráfica: la define spec-OPD §2.1, §3.1; el canon remite | 7.3.5.2 |
| — | 277 | eliminada-duplicada→ spec-OPD §2.1 | §3.2 | fila de notación gráfica: la define spec-OPD §2.1; el canon remite | 4, 7.3.3, C.4 |
| — | 281 | eliminada-duplicada→ spec-OPD §2.1 | §3.2 | fila de notación gráfica: la define spec-OPD §2.1; el canon remite | 4, C.4 |
| — | 282 | eliminada-duplicada→ spec-OPD §2.1 | §3.2 | fila de notación gráfica: la define spec-OPD §2.1; el canon remite | 4, C.4 |
| — | 283 | eliminada-duplicada→ spec-OPD §2.1 | §3.2 | fila de notación gráfica: la define spec-OPD §2.1; el canon remite | 4, C.4 |
| — | 284 | eliminada-duplicada→ spec-OPD §2.1 | §3.2 | fila de notación gráfica: la define spec-OPD §2.1; el canon remite | 4, C.4 |
| — | 285 | eliminada-duplicada→ spec-OPD §2.1 | §3.2 | fila de notación gráfica: la define spec-OPD §2.1; el canon remite | 4, C.4 |
| — | 286 | eliminada-duplicada→ spec-OPD §2.1 | §3.2 | fila de notación gráfica: la define spec-OPD §2.1; el canon remite | 4, C.4 |
| — | 287 | eliminada-duplicada→ spec-OPD §2.1 | §3.2 | fila de notación gráfica: la define spec-OPD §2.1; el canon remite | 4, C.4 |
| — | 288 | eliminada-duplicada→ spec-OPD §2.1 | §3.2 | fila de notación gráfica: la define spec-OPD §2.1; el canon remite | 4, C.4 |
| — | 290 | eliminada-duplicada→ spec-OPD §2.1 | §3.2 | fila de notación gráfica: la define spec-OPD §2.1; el canon remite | 7.3.4, A.4.4.2 |
| — | 294 | eliminada-duplicada→ spec-OPD §2.1, §10.1 | §3.3 | fila de notación gráfica: la define spec-OPD §2.1, §10.1; el canon remite | 4, C.4 |
| — | 295 | eliminada-duplicada→ spec-OPD §2.1, §10.1 | §3.3 | fila de notación gráfica: la define spec-OPD §2.1, §10.1; el canon remite | 4, C.4 |
| — | 296 | eliminada-duplicada→ spec-OPD §2.1, §10.1 | §3.3 | fila de notación gráfica: la define spec-OPD §2.1, §10.1; el canon remite | 14.2.1.2, 14.2.1.3 |
| R-CTRN-1 | 298 | eliminada-duplicada→ spec-OPD §2.1 | §3.3 | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §2.1» | 14.2.3, 7.3.3 |
| R-CTRN-1A | 299 | eliminada-duplicada→ spec-OPD §2.1 | §3.3 | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §2.1» | 14.2.3, 7.3.3 |
| R-CTRN-2 | 301 | eliminada-duplicada→ spec-OPD §10.1 | §3.3 | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §10.1» | 14.2.1.2, 14.2.1.3 |
| — | 305 | eliminada-duplicada→ spec-OPD §2.1 | §3.4 | fila de notación gráfica: la define spec-OPD §2.1; el canon remite | 4, C.4 |
| — | 306 | eliminada-duplicada→ spec-OPD §2.1 | §3.4 | fila de notación gráfica: la define spec-OPD §2.1; el canon remite | 4, C.4 |
| R-SOMB-1 | 308 | eliminada-duplicada→ spec-OPD §2.1 | §3.4 | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §2.1» | 4, C.4 |
| R-SOMB-2 | 309 | perfil | §3.4 | sin cambio |  |
| R-SOMB-3 | 310 | fusionada→ R-SOMB-1 | §3.4 | fusionada: Fusionar con R-SOMB-1. | 4, C.4 |
| R-COLOR-1 | 314 | fusionada→ R-COLOR-2 | §3.5 | fusionada: Fusionar en R-COLOR-2. |  |
| R-COLOR-2 | 315 | eliminada-duplicada→ spec-OPD §2.1 | §3.5 | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §2.1» | 4, 5, C.4 |
| R-COLOR-3 | 316 | perfil | §3.5 | sin cambio |  |
| R-ROT-1 | 320 | perfil | §3.6 | sin cambio |  |
| R-ROT-2 | 321 | perfil | §3.6 | sin cambio |  |
| R-ROT-3 | 322 | perfil | §3.6 | sin cambio |  |
| R-ROT-4 | 323 | perfil | §3.6 | sin cambio |  |
| — | 329 | eliminada-duplicada→ spec-OPD §4.1, §5, §7.2, §8.1 | §3.7 | fila de notación gráfica: la define spec-OPD §4.1, §5, §7.2, §8.1; el canon remite | 9.3.1, 9.3.2, 4 |
| — | 330 | eliminada-duplicada→ spec-OPD §4.1, §5, §7.2, §8.1 | §3.7 | fila de notación gráfica: la define spec-OPD §4.1, §5, §7.2, §8.1; el canon remite | 9.4.1, 9.5.2.2 |
| — | 331 | eliminada-duplicada→ spec-OPD §4.1, §5, §7.2, §8.1 | §3.7 | fila de notación gráfica: la define spec-OPD §4.1, §5, §7.2, §8.1; el canon remite | 9.4.2, 9.5.2.2 |
| — | 332 | eliminada-duplicada→ spec-OPD §4.1, §5, §7.2, §8.1 | §3.7 | fila de notación gráfica: la define spec-OPD §4.1, §5, §7.2, §8.1; el canon remite | 9.5.2.5 |
| — | 333 | eliminada-duplicada→ spec-OPD §4.1, §5, §7.2, §8.1 | §3.7 | fila de notación gráfica: la define spec-OPD §4.1, §5, §7.2, §8.1; el canon remite | 10.2.1 |
| — | 334 | eliminada-duplicada→ spec-OPD §4.1, §5, §7.2, §8.1 | §3.7 | fila de notación gráfica: la define spec-OPD §4.1, §5, §7.2, §8.1; el canon remite | 10.2.3, 10.2.4 |
| R-DEC-1 | 336 | eliminada-duplicada→ spec-OPD §5 | §3.7 | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §5» | 9.4.1, 9.4.2 |
| R-DEC-1A | 337 | perfil | §3.7 | sin cambio |  |
| R-DEC-2 | 338 | perfil | §3.7 | sin cambio |  |
| R-DEC-2A | 339 | perfil | §3.7 | sin cambio |  |
| — | 345 | eliminada-duplicada→ spec-OPD §7.1 | §3.8 | fila de notación gráfica: la define spec-OPD §7.1; el canon remite | 10.3.2 |
| — | 346 | eliminada-duplicada→ spec-OPD §7.1 | §3.8 | fila de notación gráfica: la define spec-OPD §7.1; el canon remite | 10.3.3.1 |
| — | 347 | eliminada-duplicada→ spec-OPD §7.1 | §3.8 | fila de notación gráfica: la define spec-OPD §7.1; el canon remite | 10.3.4.1 |
| — | 348 | eliminada-duplicada→ spec-OPD §7.1 | §3.8 | fila de notación gráfica: la define spec-OPD §7.1; el canon remite | 10.3.5.1 |
| R-TRI-1 | 350 | eliminada-duplicada→ spec-OPD §7.1 | §3.8 | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §7.1» | 10.3.2, 10.3.3.1, 10.3.4.1, 10.3.5.1 |
| R-TRI-1A | 351 | eliminada-duplicada→ spec-OPD §7.1 | §3.8 | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §7.1» | 10.3.2, 10.3.4.1 |
| R-TRI-2 | 352 | eliminada-duplicada→ spec-OPD §7.1 | §3.8 | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §7.1» | 10.3.2, 10.3.3.1, 10.3.4.1, 10.3.5.1 |
| R-TRI-2A | 353 | eliminada-duplicada→ spec-OPD §7.1 | §3.8 | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §7.1» | 5 |
| R-TRI-3 | 354 | perfil | §3.8 | sin cambio |  |
| — | 360 | eliminada-duplicada→ spec-OPD §6 | §3.9 | fila de notación gráfica: la define spec-OPD §6; el canon remite | 9.5.2.1 |
| — | 361 | eliminada-duplicada→ spec-OPD §6 | §3.9 | fila de notación gráfica: la define spec-OPD §6; el canon remite | 9.5.3.1 |
| — | 362 | eliminada-duplicada→ spec-OPD §6 | §3.9 | fila de notación gráfica: la define spec-OPD §6; el canon remite | 9.5.4.2 |
| — | 363 | eliminada-duplicada→ spec-OPD §6 | §3.9 | fila de notación gráfica: la define spec-OPD §6; el canon remite | 9.5.4.3 |
| — | 364 | eliminada-duplicada→ spec-OPD §6 | §3.9 | fila de notación gráfica: la define spec-OPD §6; el canon remite | 12.7 |
| — | 365 | eliminada-duplicada→ spec-OPD §6 | §3.9 | fila de notación gráfica: la define spec-OPD §6; el canon remite | 10.2.1 |
| — | 366 | eliminada-duplicada→ spec-OPD §6 | §3.9 | fila de notación gráfica: la define spec-OPD §6; el canon remite | 13 |
| R-MARCA-1 | 368 | eliminada-duplicada→ spec-OPD §6 | §3.9 | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §6» | 5, 11.1, 11.2, 11.3 |
| — | 374 | eliminada-duplicada→ spec-OPD §3.3, §7.1, §9, §10.4 | §3.10 | fila de notación gráfica: la define spec-OPD §3.3, §7.1, §9, §10.4; el canon remite | 10.3.2, 10.3.3.1, 10.3.4.1 |
| — | 375 | eliminada-duplicada→ spec-OPD §3.3, §7.1, §9, §10.4 | §3.10 | fila de notación gráfica: la define spec-OPD §3.3, §7.1, §9, §10.4; el canon remite | B.5 |
| — | 376 | eliminada-duplicada→ spec-OPD §3.3, §7.1, §9, §10.4 | §3.10 | fila de notación gráfica: la define spec-OPD §3.3, §7.1, §9, §10.4; el canon remite | 14.2.1.1 |
| — | 377 | eliminada-duplicada→ spec-OPD §3.3, §7.1, §9, §10.4 | §3.10 | fila de notación gráfica: la define spec-OPD §3.3, §7.1, §9, §10.4; el canon remite | 11.1 |
| — | 378 | perfil | §3.10 | sin cambio |  |
| — | 384 | eliminada-duplicada→ spec-OPD §10.1 | §3.11 | fila de notación gráfica: la define spec-OPD §10.1; el canon remite | 7.3.5.2, 14.2.1.3 |
| — | 385 | eliminada-duplicada→ spec-OPD §10.1 | §3.11 | fila de notación gráfica: la define spec-OPD §10.1; el canon remite | 14.2.1.3 |
| — | 386 | eliminada-duplicada→ spec-OPD §10.1 | §3.11 | fila de notación gráfica: la define spec-OPD §10.1; el canon remite | 7.3.5.2, 5 |
| R-ANID-1 | 388 | eliminada-duplicada→ spec-OPD §10.1 | §3.11 | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §10.1» | 14.2.1.3 |
| R-ANID-1A | 389 | eliminada-duplicada→ spec-OPD §10.1 | §3.11 | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §10.1» | 14.2.1.3 |
| R-LAY-1 | 393 | perfil | §3.12 | sin cambio de texto; anotada [endurecimiento]; la pauta ISO B.3 queda en spec-OPD §11 | B.3 |
| R-LAY-2 | 394 | perfil | §3.12 | sin cambio de texto; anotada [endurecimiento]; la pauta ISO B.3 queda en spec-OPD §11 | B.3 |
| R-LAY-3 | 395 | perfil | §3.12 | sin cambio |  |
| R-LAY-4 | 396 | eliminada-duplicada→ spec-OPD §8.1 | §3.12 | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §8.1» | 14.2.1.3, 14.2.2.2 |
| R-OPL-TEXT-1 | 404 | canon | §4.0 | corregida: OPL-ES es la expresión textual en español del OPL de ISO 19450 (A.1); toda oración canónica DEBE corresponder a una producción del Anexo A. | A.1, 6.2.1 |
| R-OPL-TEXT-2 | 405 | canon | §4.0 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 6.2.1, A.1 |
| R-OPL-TEXT-3 | 406 | canon | §4.0 | corregida: Toda mención textual de enlace, refinamiento, multiplicidad u operador DEBE denotar el mismo hecho que su construcción gráfica (6.2.1). | 6.2.1 |
| R-OPL-TEXT-4 | 407 | canon | §4.0 | corregida: marcada [localización]; La PAS sólo define OPL en inglés; la equivalencia EN↔ES es el contrato fundante de OPL-ES y se queda. | A.1 |
| — | 413 | perfil | §4.1 | sin cambio | 10.2.1 |
| — | 414 | perfil | §4.1 | sin cambio | 10.2.1 |
| — | 415 | perfil | §4.1 | sin cambio | 10.2.1 |
| R-OPL-TYPO-1 | 417 | perfil | §4.1 | sin cambio |  |
| R-OPL-TYPO-2 | 418 | perfil | §4.1 | sin cambio |  |
| R-OPL-1 | 422 | canon | §4.2 | corregida: Adjetivos y participios de las plantillas DEBEN concordar en género y número con el nombre de la cosa; la tabla muestra la forma del comodín. | A.4.4.2 |
| R-OPL-2 | 423 | canon | §4.2 | corregida: «estar» para estados de objeto; «ser» para valor de atributo (11.3), tipo, especialización e instanciación. | A.4.4.4, 11.3 |
| R-OPL-3 | 424 | canon | §4.2 | corregida: «es un/una» sólo en especialización simple de objetos e instanciación («es una instancia de»); la especialización de procesos va sin artículo. | A.4.6.5, 10.3.4.1 |
| R-OPL-4 | 428 | canon | §4.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.1, A.4.3 |
| R-OPL-5 | 429 | canon | §4.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.1 |
| R-OPL-6 | 430 | canon | §4.2 | corregida: marcada [localización]; Regla de localización que asegura la correspondencia producción a producción con el Anexo A; sin contraparte en la PAS. | A.4 |
| R-OPL-7 | 431 | fusionada→ R-OPL-6 | §4.2 | fusionada: Complemento de R-OPL-6; fusionar ambas en una sola regla. | A.4 |
| R-OPL-8 | 432 | canon | §4.2 | corregida: marcada [localización]; Gramática española; no altera el hecho. |  |
| R-OPL-9 | 433 | canon | §4.2 | corregida: Un identificador PUEDE llevar pospuesto «proceso»/«procesos» u «objeto»/«objetos», en singular o plural (A.4.2). | A.4.2 |
| R-OPL-10 | 434 | canon | §4.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.2 |
| — | 440 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.1.2 |
| — | 441 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.1.3 |
| — | 442 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.1.4 |
| — | 443 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.3.2 |
| — | 444 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.2.2, A.4.5.3.2 |
| — | 445 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.2.3 |
| — | 446 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.1 |
| — | 447 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.5 |
| — | 448 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.1, 9.5.4.2 |
| — | 449 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.1 |
| — | 450 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.1 |
| — | 451 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.1 |
| — | 452 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.2 |
| — | 453 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.3.1 |
| — | 454 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.4.1 |
| — | 455 | canon | §4.3 | corregida: Especialización singular: «es un/una» (objetos); «es» (procesos). | 10.3.4.1, A.4.6.5 |
| — | 456 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.5.1 |
| — | 457 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.2.2 |
| — | 458 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.3.2 |
| — | 459 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.3 |
| — | 460 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.4 |
| — | 461 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.1, A.4.7.4 |
| — | 462 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.1.2, A.4.7.2 |
| — | 463 | canon | §4.3 | corregida: Añadir «se refina por despliegue de … en» (is refined by unfolding). | 14.2.2.6.1.4 |
| — | 464 | canon | §4.3 | corregida: Plegado: «es plegado de» + OPD hijo. | A.4.7.3 |
| — | 465 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.7.5 |
| R-OPL-VERB-1 | 467 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.5.2.2, A.4.5.3.2 |
| R-OPL-VERB-2 | 468 | perfil | §4.3 | sin cambio |  |
| — | 474 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.1 |
| — | 475 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.1 |
| — | 476 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.1, 9.5.3.2 |
| — | 477 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.3.2 |
| — | 478 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.3.2 |
| — | 479 | canon | §4.3 | corregida: «e» ante sonido /i/ (i-, hi- + consonante). | A.4.3, 12.1 |
| — | 480 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.3 |
| — | 481 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.3.1, A.4.7.4 |
| — | 482 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.2 |
| — | 483 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.2 |
| — | 484 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.2, 10.3.3.1 |
| — | 485 | canon | §4.3 | corregida: Añadir «opcional» + plural = 0..* («“0..*” … OPL syntax of “optional”»). | 11.1, Table 16 |
| — | 486 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 11.1 |
| — | 487 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 13 |
| — | 488 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.4.2 |
| — | 489 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.4.2 |
| — | 490 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.4.3 |
| — | 491 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.1 |
| R-OPL-KW-1 | 493 | canon | §4.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.3.1 |
| R-OPL-KW-2 | 494 | canon | §4.3 | corregida: marcada [localización]; Ortografía española de «and»/«or»; alinear la tabla l.479-480. |  |
| D1 | 500 | canon | §4.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.2 |
| D2 | 501 | canon | §4.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.2 |
| D3 | 502 | canon | §4.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.2 |
| D4 | 503 | canon | §4.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.2, 7.3.4 |
| D5 | 504 | canon | §4.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.4, 9.2.3 |
| D6 | 505 | canon | §4.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.4 |
| D7 | 506 | canon | §4.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.4 |
| D8 | 507 | canon | §4.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.4 |
| D9 | 508 | canon | §4.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.4 |
| D10 | 509 | canon | §4.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.4, Table 26 |
| D11 | 510 | canon | §4.4 | decidir → canon: oración literal de ISO A.4.4.2 con nota de que la PAS no da a la perseverancia otra semántica que ISO §3.50 | A.4.4.2, 3.50, 7.3.3 |
| D12 | 511 | canon | §4.4 | decidir → canon: oración literal de ISO A.4.4.2 con nota (ISO §3.50) | A.4.4.2, 3.50 |
| D13 | 512 | perfil | §4.4 | sin cambio | 3.69 |
| R-OPL-PERSIST-1 | 514 | perfil | §4.4 | sin cambio | 3.50, 7.3.3 |
| R-OPL-PERSIST-2 | 515 | perfil | §4.4 | sin cambio | 9.3.3.2, D.2 |
| R-OPL-PERSIST-3 | 516 | perfil | §4.4 | sin cambio |  |
| T1 | 522 | canon | §4.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.1.2 |
| T2 | 523 | canon | §4.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.1.3 |
| T3 | 524 | canon | §4.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.1.4 |
| TS1 | 525 | canon | §4.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.1 |
| TS2 | 526 | canon | §4.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.2 |
| TS3 | 527 | canon | §4.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.3.2 |
| TS4 | 528 | canon | §4.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.3.3 |
| TS5 | 529 | canon | §4.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.3.4 |
| — | 531 | canon | §4.5 | corregida: TS4/TS5 son también la superficie de las mitades de un efecto entrada-salida escindido (Tabla 25); el texto no distingue ambos casos. | Table 25, 9.3.3.3, 9.3.3.4 |
| — | 532 | canon | §4.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | Table 25 |
| — | 533 | canon | §4.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.3.3, 9.5.2.3, 9.5.3.3 |
| H1 | 539 | canon | §4.6 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.2.2 |
| H2 | 540 | canon | §4.6 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.2.3 |
| HS1 | 541 | canon | §4.6 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.4.1 |
| HS2 | 542 | canon | §4.6 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.4.2 |
| ET1 | 548 | canon | §4.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.1 |
| ET2 | 549 | canon | §4.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.1 |
| EH1 | 550 | canon | §4.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.2 |
| EH2 | 551 | canon | §4.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.2 |
| ETS1 | 552 | canon | §4.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.3 |
| ETS2 | 553 | canon | §4.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.3 |
| ETS3 | 554 | canon | §4.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.3 |
| ETS4 | 555 | canon | §4.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.3 |
| EHS1 | 556 | canon | §4.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.4 |
| EHS2 | 557 | canon | §4.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.4 |
| CT1 | 563 | canon | §4.8 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.1 |
| CT2 | 564 | canon | §4.8 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.1 |
| CH1 | 565 | canon | §4.8 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.2, A.4.5.4.3 |
| CH2 | 566 | canon | §4.8 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.2 |
| CS1 | 567 | canon | §4.8 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.3 |
| CS2 | 568 | canon | §4.8 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.3 |
| CS3 | 569 | canon | §4.8 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.3 |
| CS4 | 570 | canon | §4.8 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.3 |
| CS5 | 571 | canon | §4.8 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.4.1 |
| CS6 | 572 | canon | §4.8 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.4.2 |
| R-OPL-COND-ALT-1 | 574 | canon | §4.8 | corregida: Cada oración de condición tiene una sintaxis alternativa ISO («Si **Objeto** existe entonces *Proceso* ocurre y consume **Objeto**, de lo contrario se omite *Proceso*.»); listarlas como plantillas, no como tolerancia del | 9.5.3.1, 9.5.3.2, 9.5.3.3, 9.5.3.4 |
| R-OPL-COND-ALT-2 | 575 | perfil | §4.8 | sin cambio |  |
| R-OPL-SUP-1 | 576 | perfil | §4.8 | sin cambio |  |
| EX1 | 582 | canon | §4.9 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.4.2, A.4.5.4.5 |
| EX2 | 583 | canon | §4.9 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.4.3 |
| IV1 | 584 | canon | §4.9 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.5 |
| IV2 | 585 | canon | §4.9 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.5 |
| SE1 | 591 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.2.1 |
| SE2 | 592 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.2.2 |
| SE3 | 593 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.2.3 |
| SE4 | 594 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.2.4 |
| SE5 | 595 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.2.4 |
| RF1 | 596 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.2 |
| RF2 | 597 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.3.1 |
| RF2b | 598 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.3.1, A.4.6.3.2 |
| RF3 | 599 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.4.1 |
| RF3b | 600 | canon | §4.10 | corregida: «**Especialización** es un **General**.» (objeto); «*Especialización* es *General*.» (proceso). | 10.3.4.1, A.4.6.5 |
| RF4 | 601 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.5.1 |
| RF4b | 602 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.5.1 |
| RX1 | 603 | canon | §4.10 | corregida: «**Especial** puede ser o bien **General1** o bien **General2**.» | A.4.6.5 |
| RX2 | 604 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.6.5 |
| RH1 | 605 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.6.5 |
| — | 607 | canon | §4.10 | corregida: «… y al menos otra parte», «… y al menos otro atributo», «… y al menos otra operación», «… y al menos otra especialización». | 10.3.2, 10.3.3.1, 10.3.4.1 |
| R-OPL-SE-1 | 609 | canon | §4.10 | corregida: La etiqueta es una frase que empieza en minúscula (A.4.2) y DEBERÍA expresar la relación al leerse en la oración (10.2.1). | A.4.2, 10.2.1 |
| R-OPL-SE-2 | 610 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.2.1, A.4.6.2.2, 10.3.3.1 |
| R-OPL-SE-3 | 611 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.6.2.2, 11.1 |
| R-OPL-SE-4 | 612 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.6.2.2 |
| R-OPL-SE-5 | 613 | canon | §4.10 | corregida: «se relaciona con»/«se relacionan» son las etiquetas nulas por defecto (10.2.2, 10.2.4); el modelador PUEDE fijar otra etiqueta por defecto (A.4.6.2.2). | 10.2.2, 10.2.4, A.4.6.2.2 |
| R-OPL-RF-1 | 614 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.6.3, A.4.6.5, A.4.6.6 |
| R-OPL-RF-2 | 615 | canon | §4.10 | corregida: La caracterización DEBE usar «exhibe» (10.3.3.1). | 10.3.3.1 |
| R-OPL-RF-3 | 616 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.6.5 |
| R-OPL-RF-4 | 617 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.5.1 |
| R-OPL-RF-5 | 618 | canon | §4.10 | corregida: Especialización XOR: «puede ser o bien … o bien …» o «puede ser uno de …». | A.4.6.5 |
| R-OPL-RF-6 | 619 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.6.5 |
| SSE1 | 625 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.4.2.2 |
| SSE2 | 626 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.4.2.3 |
| SSE3 | 627 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.4.2.4 |
| SSE4 | 628 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.4.2.5 |
| SSE5 | 629 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.4.2.5 |
| SSE6 | 630 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.4.2.8 |
| SSE7 | 631 | canon | §4.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.4.2.7 |
| — | 633 | canon | §4.10 | corregida: Las variantes bidireccional y recíproca existen también con estado sólo en destino (10.4.2.5, 10.4.2.7). | 10.4.2.1, 10.4.2.5, 10.4.2.7 |
| CX1 | 639 | canon | §4.11 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.1, A.4.7.4 |
| CX2 | 640 | canon | §4.11 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.2 |
| CX3 | 641 | canon | §4.11 | corregida: «**Cosa** se despliega en **T1**, **T2** y **T3**.» (14.2.1.2) y, en nuevo OPD, «**Cosa** desde SD se despliega por partes en SD1 en …» (A.4.7.2). | 14.2.1.2, A.4.7.2 |
| CX4 | 642 | canon | §4.11 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.6.1.4 |
| CX5 | 643 | canon | §4.11 | corregida: «*Proceso* es plegado de SD1.» (OPD hijo) | A.4.7.3 |
| CX6 | 644 | canon | §4.11 | corregida: «**Objeto** es plegado de SD1.» (OPD hijo) | A.4.7.3 |
| CX7 | 645 | canon | §4.11 | corregida: «*Proceso* se recompone desde SD1.» (OPD hijo, sin marca de estado) | A.4.7.5 |
| CX8 | 646 | canon | §4.11 | corregida: «**Objeto** se recompone desde SD1.» | A.4.7.5 |
| CM1 | 647 | perfil | §4.11 | sin cambio | 14.2.2.6.1.5 |
| CM2 | 648 | perfil | §4.11 | sin cambio | 14.2.2.6.1.5 |
| CM3 | 649 | perfil | §4.11 | sin cambio | 14.2.2.6.1.5 |
| R-OPL-CX-ID-1 | 651 | perfil | §4.11 | sin cambio |  |
| R-OPL-CM-1 | 652 | perfil | §4.11 | sin cambio |  |
| R-OPL-CX-1 | 653 | canon | §4.11 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.7.2, 14.2.1.2 |
| R-OPL-CX-2 | 654 | canon | §4.11 | corregida: Un despliegue en nuevo OPD PUEDE declarar OPD padre, OPD hijo y clase de despliegue (A.4.7.2); la forma mínima es «**Cosa** se despliega en …» (14.2.1.2). | 14.2.1.2, A.4.7.2 |
| R-OPL-CX-3 | 655 | canon | §4.11 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.7.4 |
| R-OPL-CX-4 | 656 | canon | §4.11 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.7.4, 3.34, 3.35 |
| R-OPL-CX-5 | 657 | canon | §4.11 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.2, A.4.7.4 |
| R-OPL-CX-6 | 658 | canon | §4.11 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.7.4 |
| R-OPL-CX-7 | 659 | canon | §4.11 | corregida: Plegado y recomposición DEBEN referir al OPD hijo (A.4.7.3, A.4.7.5). | A.4.7.3, A.4.7.5 |
| — | 663 | canon | §4.12 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 13 |
| — | 664 | canon | §4.12 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 13 |
| R-OPL-RUTA-1 | 666 | eliminada-duplicada→ spec-OPL R-OPL-RUTA-1 (spec-OPL §11.1) | §4.12 | la definición queda en spec-OPL (plantilla/notación); el canon conserva la referencia por ID | 13 |
| R-OPL-RUTA-2 | 667 | eliminada-duplicada→ spec-OPL R-OPL-RUTA-2 (spec-OPL §11.1) | §4.12 | la definición queda en spec-OPL (plantilla/notación); el canon conserva la referencia por ID | 13, A.3.1 |
| R-OPL-RUTA-3 | 668 | perfil | §4.12 | sin cambio de texto; anotada [endurecimiento] (ISO §13 no restringe la ruta) | 13, A.1 |
| — | 674 | canon | §4.13 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 11.3, 10.3.3.2.2 |
| — | 675 | canon | §4.13 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.3.2, 10.3.3.2.2 |
| — | 676 | canon | §4.13 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.4, 10.3.3.2.2, 10.3.4.3 |
| R-ATR-1 | 678 | canon | §4.13 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 3.4, 10.3.3.1 |
| R-ATR-2 | 679 | canon | §4.13 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.3.2.1 |
| — | 680 | perfil | §4.13 | sin cambio |  |
| R-ATR-3 | 682 | canon | §4.13 | corregida: Un atributo PUEDE especificar unidad de medida (7.3.5.5), escrita «**Atributo** en unidad» (A.4.2). | 7.3.5.5, A.4.2 |
| R-ATR-4 | 683 | perfil | §4.13 | sin cambio |  |
| R-ATR-5 | 684 | perfil | §4.13 | sin cambio |  |
| R-ATR-6 | 685 | canon | §4.13 | corregida: Una propiedad (3.60) es anotación de elemento, no atributo; multiplicidades, etiquetas de ruta y etiquetas estructurales son propiedades. | 3.60 |
| R-OPL-EBNF-1 | 689 | canon | §4.14 | corregida: La EBNF del Anexo A de ISO 19450 es normativa; la gramática OPL-ES DEBE corresponderle producción a producción y vivir en el canon. | A.1, A.3.1 |
| R-OPL-EBNF-2 | 690 | perfil | §4.14 | sin cambio |  |
| R-OPL-EBNF-3 | 691 | perfil | §4.14 | sin cambio | A.3.2 |
| R-OPL-EBNF-4 | 692 | canon | §4.14 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.1 |
| R-OPL-EBNF-5 | 693 | canon | §4.14 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.1 |
| R-OPL-EBNF-6 | 694 | canon | §4.14 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.1 |
| R-OPL-LEX-1 | 695 | canon | §4.14 | corregida: marcada [localización]; La PAS sólo tiene letras ASCII; ampliarlas es condición de un OPL en español. | A.3.2 |
| R-OPL-LEX-2 | 696 | canon | §4.14 | corregida: caracter_de_cadena = letra \| dígito \| '-' \| '\|' \| '&' \| '/' \| ' ' (A.3.2). | A.3.2, B.6.2 |
| R-OPL-LEX-3 | 697 | canon | §4.14 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.3.2 |
| R-OPL-TIPO-1 | 698 | canon | §4.14 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.3.2 |
| R-OPL-TIPO-2 | 699 | canon | §4.14 | corregida: El tipo `integer` PUEDE llevar el prefijo `unsigned` (A.3.2). | A.3.2 |
| R-OPL-PART-1 | 700 | canon | §4.14 | corregida: un/una, un/una opcional (0..1), opcional + plural (0..*), al menos un/una (1..*), muchos/as, número o «n a m»; nombre en plural si puede haber más de una instancia (11.1). | A.3.2, 11.1, Table 16 |
| R-OPL-RANGO-1 | 701 | canon | §4.14 | corregida: Un rango textual usa «es valor» o «varía de X a Y» (A.3.2); la multiplicidad usa «n a m» o «qmin..qmax» cerrado (11.1). | A.3.2, 11.1, 11.3 |
| R-OPL-RANGO-2 | 702 | canon | §4.14 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.3.2 |
| R-OPL-RANGO-3 | 703 | canon | §4.14 | corregida: Los operadores de restricción son =, <, >, <=, >= (A.3.2). | A.3.2 |
| R-OPL-CONJ-1 | 704 | canon | §4.14 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.3.2 |
| R-OPL-LISTA-1 | 705 | canon | §4.14 | corregida: Exceptuar las producciones ISO con coma serial («, y otros estados», listas de zoom de objetos). | A.4.3 |
| R-OPL-LISTA-2 | 706 | canon | §4.14 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.6.2.2 |
| R-OPL-EQ-1 | 710 | canon | §4.15 | corregida: Un nombre de proceso PUEDE ser frase de infinitivo (equivalente del gerundio inglés) o frase nominal singular (A.3.3). | A.3.3, B.6.3 |
| R-OPL-EQ-2 | 711 | perfil | §4.15 | sin cambio |  |
| R-OPL-EQ-3 | 712 | canon | §4.15 | corregida: marcada [localización]; Contrato de localización; coherente con la bimodalidad. | 6.2.1 |
| R-OPL-EQ-4 | 713 | perfil | §4.15 | sin cambio |  |
| R-OPL-EQ-5 | 714 | perfil | §4.15 | sin cambio |  |
| R-OPL-TRANS-1 | 718 | perfil | §4.16 | sin cambio |  |
| R-OPL-TRANS-2 | 719 | fusionada→ R-OPL-4 | §4.16 | fusionada: Duplica R-OPL-4. | 9.3.1 |
| R-OPL-TRANS-3 | 720 | canon | §4.16 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.4, 9.5.3.3 |
| R-OPL-TRANS-4 | 721 | canon | §4.16 | corregida: «can be» + estados → «puede estar»; «can be either … or» / «can be one of» + cosas → «puede ser o bien … o bien» / «puede ser uno de». | A.4.4.4, A.4.6.5 |
| R-OPL-TRANS-5 | 722 | canon | §4.16 | corregida: «from» → «de» en cambios de estado y «desde» ante OPD padre (A.4.7); «to» → «a»; «of» → «de». | 9.3.3.2, A.4.7.2 |
| R-OPL-TRANS-6 | 723 | canon | §4.16 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.2 |
| R-OPL-TRANS-7 | 724 | canon | §4.16 | corregida: Añadir «then» → «entonces» y «bypass» → «se omite» (sintaxis alternativa). | 9.5.3.1, 9.5.3.2 |
| R-OPL-TRANS-8 | 725 | canon | §4.16 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.1 |
| R-OPL-TRANS-9 | 726 | canon | §4.16 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 13 |
| R-OPL-TRANS-10 | 727 | canon | §4.16 | corregida: «initial», «final», «default» → «inicial», «final», «por defecto». | A.4.4.4 |
| R-OPL-TRANS-11 | 728 | perfil | §4.16 | sin cambio |  |
| R-OPL-LANG-1 | 732 | perfil | §4.17 | sin cambio |  |
| R-OPL-LANG-2 | 733 | perfil | §4.17 | sin cambio |  |
| R-OPL-LANG-3 | 734 | perfil | §4.17 | sin cambio |  |
| R-OPL-LANG-4 | 735 | perfil | §4.17 | sin cambio |  |
| R-OPL-LANG-5 | 736 | perfil | §4.17 | sin cambio |  |
| R-OPL-LANG-6 | 737 | perfil | §4.17 | sin cambio |  |
| R-OPL-LANG-7 | 738 | perfil | §4.17 | sin cambio |  |
| — | 746 | canon | §5.1 | corregida: Todo enlace es procedimental o estructural (6.2.4). Procedimental: transformador, habilitador o de control (8.1.1); de control: evento (incluida la invocación, 9.5.2.5), condición y excepción (9.5.1). Estructural: etique | 6.2.4, 8.1.1, 9.5.1, 9.5.2.5, 10.1, 3.57 |
| — | 750 | canon | §5.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 8.1.1, 9.1.1 |
| — | 751 | canon | §5.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 8.1.1, 9.2.1 |
| — | 752 | canon | §5.1 | corregida: La invocación es un enlace de control de tipo evento entre dos procesos (9.5.2.5), no una familia aparte. | 9.5.2.5.1, 9.5.1, 3.57 |
| — | 753 | canon | §5.1 | corregida: La excepción es un enlace de control proceso→proceso (9.5.1, 9.5.4), junto a evento y condición. | 9.5.1, 9.5.4, 3.57 |
| — | 754 | canon | §5.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.1, 10.3.1 |
| — | 755 | canon | §5.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.1, 10.2, 10.4.2.1 |
| — | 757 | perfil | §5.1 | sin cambio de texto; anotada: en el canon la excepción y la invocación son enlaces de control (ISO §9.5.1) | 9.5.1 |
| — | 763 | canon | §5.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.1, 9.5.2.1.1 |
| — | 764 | canon | §5.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.2 |
| — | 765 | canon | §5.2 | corregida: Efecto básico: flecha bidireccional con puntas cerradas; TS3/TS4/TS5: par de flechas de punta simple (entrada y salida). | 9.5.2.1.2, 9.3.3.2, 9.3.3.3, 9.3.3.4 |
| R-CONS-1 | 769 | canon | §5.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.1.2, 9.3.1 |
| R-CONS-2 | 770 | canon | §5.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.1 |
| R-CONS-3 | 771 | canon | §5.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.1 |
| R-RES-1 | 772 | canon | §5.2 | corregida: Un enlace de resultado hacia un objeto con estado inicial DEBERÍA conectarse al rectángulo o a un estado distinto del inicial (9.3.2). | 9.3.2, 12.7 |
| R-EFE-1 | 773 | canon | §5.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.1.4, 3.2, 3.15 |
| R-EFE-2 | 774 | canon | §5.2 | corregida: Iniciado el proceso afector, el afectado sale de su estado de entrada (9.3.3.2 NOTE 1). | 9.3.3.2 |
| R-EFE-2A | 775 | canon | §5.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.3.2 |
| R-EFE-2B | 776 | canon | §5.2 | corregida: marcada [informativo]; 9.3.3.2 NOTE 2; el canon lo enuncia en indicativo, sin elevarlo. | 9.3.3.2 |
| R-EFE-3 | 777 | canon | §5.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.3.3, 9.5.3.3.3 |
| — | 783 | canon | §5.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.4.1, 9.2.2, 3.3 |
| — | 784 | canon | §5.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.4.2, 3.30 |
| R-AG-1 | 786 | canon | §5.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 3.3, 9.2.2 |
| R-AG-1A | 787 | canon | §5.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 3.30, 9.2.3 |
| R-AG-1B | 788 | perfil | §5.3 | sin cambio | 3.30 |
| R-AG-2 | 790 | canon | §5.3 | corregida: Si un habilitador deja de existir durante la ejecución, el proceso se detiene y el afectado queda indeterminado (9.2.3 EXAMPLE 3; 9.3.3.2 NOTE 2). | 9.2.3, 9.4.1, 9.4.2, 9.3.3.2 |
| R-AG-3 | 792 | perfil | §5.3 | sin cambio |  |
| R-AG-4 | 793 | perfil | §5.3 | sin cambio |  |
| — | 799 | canon | §5.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.5.1 |
| — | 800 | canon | §5.4 | corregida: Autoinvocación: par de enlaces de invocación que salen del proceso, se unen cabeza con cola y vuelven a él. | 9.5.2.5.2 |
| R-INV-1 | 802 | canon | §5.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.5.1 |
| R-INV-1A | 803 | canon | §5.4 | corregida: La invocación es un enlace de control (evento proceso→proceso, 9.5.2.5), distinto de transformadores y habilitadores. | 9.5.1, 9.5.2.5.1 |
| R-INV-2 | 804 | canon | §5.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.1 |
| R-INV-2A | 805 | canon | §5.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.1, 14.2.2.2 |
| R-INV-2B | 806 | canon | §5.4 | corregida: el canon conserva la regla ISO (la invocación implícita no requiere enlace dibujado; el explícito no es inválido, ISO §14.2.2.1, Figura 48); la prohibición de producto queda en perfil §5.4 como fragmento [endurecimiento] | 14.2.2.1 |
| R-INV-2C | 807 | canon | §5.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.1, 14.2.2.2 |
| R-INV-2D | 808 | perfil | §5.4 | sin cambio de texto; anotada: el orden declarado es representación de producto; la semántica es la disposición vertical (canon R-INV-2) |  |
| — | 812 | perfil | §5.4 | sin cambio |  |
| — | 813 | perfil | §5.4 | sin cambio | 14.2.2.4.2 |
| — | 814 | perfil | §5.4 | sin cambio | 9.5.2.5 |
| — | 815 | perfil | §5.4 | sin cambio |  |
| — | 816 | perfil | §5.4 | sin cambio |  |
| — | 818 | perfil | §5.4 | sin cambio |  |
| — | 824 | canon | §5.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.2, 10.3.1 |
| — | 825 | canon | §5.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.3.1, 10.1 |
| — | 826 | canon | §5.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.4.1, 10.3.1 |
| — | 827 | canon | §5.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.5.1, 10.3.1 |
| R-STRF-1 | 829 | canon | §5.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.1 |
| R-STRF-2 | 830 | canon | §5.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.1 |
| R-STRF-2A | 831 | canon | §5.5 | corregida: Un objeto o un proceso exhibidor PUEDE tener atributos (rasgos objeto) y operaciones (rasgos proceso); sólo objeto-operación y proceso-atributo son mixtas. | 10.3.3.1 |
| R-STRF-3 | 832 | canon | §5.5 | corregida: La clasificación-instanciación no distingue colección completa e incompleta (10.3.5.1 NOTE 3). | 10.3.5.1 |
| R-STRF-4 | 833 | perfil | §5.5 | decidir → perfil (política: R-STRF-4 sin base en la PAS) | 10.3.2, 11.1 |
| R-HER-1 | 834 | canon | §5.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.4.2 |
| R-HER-2 | 835 | canon | §5.5 | corregida: Una cosa PUEDE heredar de más de un general (10.3.4.2). | 10.3.4.2 |
| R-HER-3 | 836 | canon | §5.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.4.3 |
| R-HER-4 | 837 | canon | §5.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.4.3 |
| R-HER-5 | 838 | canon | §5.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.4.2 |
| R-HER-6 | 839 | canon | §5.5 | corregida: En ejecución, la instancia especializada no existe sin la instancia general (10.3.4.2 NOTE). | 10.3.4.2 |
| R-HER-7 | 840 | canon | §5.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.4.2 |
| R-HER-8 | 841 | perfil | §5.5 | sin cambio |  |
| — | 847 | canon | §5.6 | corregida: Flecha de punta abierta con la etiqueta junto al trazo. | 10.2.1 |
| — | 848 | canon | §5.6 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.2.2 |
| — | 849 | canon | §5.6 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.2.3 |
| — | 850 | canon | §5.6 | corregida: Añadir: sin etiqueta, la etiqueta por defecto es «están relacionados» («are related»). | 10.2.4 |
| R-STRE-1 | 852 | canon | §5.6 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.2.4 |
| — | 858 | canon | §5.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.4.2 |
| — | 859 | canon | §5.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.4.3 |
| R-EXC-1 | 861 | canon | §5.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.4.2, 9.5.4.3 |
| R-EXC-1A | 862 | perfil | §5.7 | sin cambio de texto; anotada [endurecimiento] | 9.5.4.2, 9.5.4.3 |
| R-EXC-1B | 863 | canon | §5.7 | corregida: La excepción es un enlace de control proceso→proceso (9.5.1); e/c sólo anotan enlaces entrantes objeto→proceso, nunca una excepción. | 9.5.1, 3.13 |
| R-EXC-2 | 864 | canon | §5.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.4.2 |
| R-EXC-3 | 865 | canon | §5.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.4.3 |
| R-EXC-4 | 866 | canon | §5.7 | corregida: Duration PUEDE especializarse en mínima, esperada y máxima, y PUEDE tener la propiedad Distribución de Duración (9.5.4.1). | 9.5.4.1 |
| R-EXC-4A | 867 | canon | §5.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.4.1 |
| R-EXC-5 | 868 | canon | §5.7 | corregida: La unidad temporal del sistema es la unidad por defecto; un proceso con otra unidad la declara (D.7). | D.7, 9.5.4.2 |
| R-ROL-UNIC-1 | 872 | canon | §5.8 | corregida: Un objeto o estado DEBE tener exactamente un rol respecto de un proceso al que se enlaza, con un solo enlace procedimental (8.1.2, 14.2.4.1); al abstraer, el conflicto se resuelve por fuerza semántica (14.2.4). | 8.1.2, 14.2.4.1, 14.2.4.5 |
| — | 880 | canon | §6.1 | corregida: e/c son modificadores de control que anotan un enlace transformador o habilitador entrante y lo convierten en enlace de control (evento o condición). | 3.13, 9.5.1, 8.1.1 |
| — | 884 | canon | §6.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.1 |
| — | 885 | canon | §6.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.1 |
| — | 886 | canon | §6.1 | corregida: Sin condición, la precondición no satisfecha hace esperar al proceso (9.5.1 NOTE 2; 9.3.1). | 9.3.1, 9.5.1 |
| R-ECA-1 | 888 | canon | §6.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 8.2.1 |
| R-ECA-2 | 889 | canon | §6.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 8.2.2, 3.54 |
| R-ECA-3 | 890 | canon | §6.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 8.2.2, 3.52 |
| R-ECA-4 | 891 | canon | §6.1 | corregida: marcada [informativo]; La cita del canon remite a C.4 (informativo); 9.5.x lo respalda («annotated link»). | C.4, 9.5.2.1.1 |
| R-MOD-0A | 895 | fusionada→ R-ECA-2 | §6.2 | fusionada: Fusionar con R-ECA-2. | 8.2.2, 3.54 |
| R-MOD-0B | 896 | fusionada→ R-ECA-3 | §6.2 | fusionada: Fusionar con R-ECA-3. | 8.2.2, 3.52 |
| — | 902 | canon | §6.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.1.1, 9.5.2.3.1, 9.5.3.1.1, 9.5.3.3.1 |
| — | 903 | canon | §6.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.1 |
| — | 904 | canon | §6.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.1.2, 9.5.2.3.2, 9.5.2.3.3, 9.5.2.3.4, 9.5.3.1.2, 9.5.3.3.2, 9.5.3.3.3, 9.5.3.3.4 |
| — | 905 | canon | §6.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.2.1, 9.5.2.4.1, 9.5.3.2.1, 9.5.3.4.1 |
| — | 906 | canon | §6.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.2.2, 9.5.2.4.2, 9.5.3.2.2, 9.5.3.4.2 |
| R-MOD-1 | 908 | canon | §6.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.1, 9.5.2, 9.5.3, 12.5 |
| R-MOD-2 | 909 | canon | §6.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.1, 8.2.2 |
| R-MOD-3 | 910 | canon | §6.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.1, 8.2.2 |
| R-MOD-4 | 911 | canon | §6.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.1, 9.5.2.1.3 |
| R-MOD-5 | 912 | fusionada→ R-FUERZA-1 | §6.3 | fusionada: Fusionar con R-FUERZA-1 y citar 14.2.4.5. | 14.2.4.5 |
| — | 918 | canon | §6.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.3, 9.5.3.4 |
| — | 919 | canon | §6.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.3, 9.5.2.4 |
| — | 920 | perfil | §6.4 | sin cambio | 9.5.1 |
| — | 921 | canon | §6.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.1, 3.13 |
| — | 922 | canon | §6.4 | corregida: e/c no anotan invocaciones: ISO sólo los define sobre enlaces entrantes objeto→proceso (9.5.1) y la invocación ya es un evento (9.5.2.5). | 9.5.1, 9.5.2.5.1 |
| — | 923 | perfil | §6.4 | sin cambio | 9.5.2.3.3, 9.5.2.3.4, 9.5.3.3.3, 9.5.3.3.4, 14.2.2.4.3 |
| — | 927 | canon | §6.5 | corregida: Citar 14.2.4.1 en lugar de SSOT-visual §13.3. | 14.2.4.1 |
| — | 930 | canon | §6.5 | corregida: Citar 14.2.4.3 y añadir: los enlaces con estado especificado preceden a los básicos. | 14.2.4.3 |
| — | 936 | canon | §6.5 | corregida: Citar 14.2.4.4. | 14.2.4.4 |
| — | 943 | canon | §6.5 | corregida: Citar 14.2.4.5 en lugar de SSOT-visual §13.5. | 14.2.4.5 |
| — | 944 | canon | §6.5 | corregida: Coincide con 14.2.4.5. | 14.2.4.5 |
| — | 945 | canon | §6.5 | corregida: Coincide con 14.2.4.5. | 14.2.4.5 |
| — | 946 | canon | §6.5 | corregida: Coincide con 14.2.4.5. | 14.2.4.5 |
| — | 947 | canon | §6.5 | corregida: Coincide con 14.2.4.5. | 14.2.4.5 |
| — | 948 | canon | §6.5 | corregida: Coincide con 14.2.4.5. | 14.2.4.5 |
| — | 949 | canon | §6.5 | corregida: Coincide con 14.2.4.5. | 14.2.4.5 |
| — | 950 | canon | §6.5 | corregida: Coincide con 14.2.4.5. | 14.2.4.5 |
| — | 951 | canon | §6.5 | corregida: Coincide con 14.2.4.5. | 14.2.4.5 |
| — | 952 | canon | §6.5 | corregida: Coincide con 14.2.4.5. | 14.2.4.5 |
| — | 953 | canon | §6.5 | corregida: Coincide con 14.2.4.5. | 14.2.4.5 |
| — | 954 | canon | §6.5 | corregida: Coincide con 14.2.4.5. | 14.2.4.5 |
| R-FUERZA-1 | 956 | canon | §6.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.4.5, 9.5.1 |
| R-FUERZA-2 | 957 | canon | §6.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.4.5 |
| R-FUERZA-3 | 958 | canon | §6.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.4.4 |
| R-FUERZA-4 | 959 | canon | §6.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.4.4 |
| — | 963 | canon | §6.6 | corregida: Citar 14.2.4.2/Tabla 27 en lugar de SSOT-visual §13.1. | 14.2.4.2 |
| — | 967 | canon | §6.6 | decidir → canon: se conserva la matriz, marcada «no verificable: depende de figuras ausentes en la fuente»; revisar con la IS 2024 | 14.2.4.2 |
| — | 968 | canon | §6.6 | decidir → canon: fila conservada, «no verificable» (Tabla 27) | 14.2.4.2 |
| — | 969 | canon | §6.6 | decidir → canon: fila conservada, «no verificable» (Tabla 27) | 14.2.4.2 |
| R-PREC-1 | 971 | canon | §6.6 | decidir → canon marcada «no verificable» (Tabla 27 sin figuras); revisar con la IS 2024 | 14.2.4.2 |
| R-PREC-2 | 972 | canon | §6.6 | corregida: Cuando resultado y consumo compiten, prevalece el efecto (14.2.4.2). | 14.2.4.2 |
| R-PREC-3 | 973 | perfil | §6.6 | sin cambio |  |
| R-PREC-4 | 974 | perfil | §6.6 | sin cambio |  |
| R-PREC-5 | 975 | canon | §6.6 | corregida: DEBE; excepción del cambio neto nulo (R-ROL-1, Tabla 25 NOTA 2) para coherencia con metodología A5.4 | 14.2.4.3 |
| — | 981 | canon | §6.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 11.1 |
| — | 982 | canon | §6.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 11.1 |
| — | 983 | canon | §6.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 11.1 |
| — | 984 | canon | §6.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 11.1 |
| R-MULT-1 | 986 | canon | §6.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 11.1 |
| R-MULT-1A | 987 | canon | §6.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 11.1, 11.2 |
| R-MULT-1B | 988 | canon | §6.7 | corregida: La repetición secuencial de un proceso se expresa con un proceso recurrente y un contador (11.2 NOTE 2). | 11.2 |
| R-MULT-1C | 989 | canon | §6.7 | corregida: Los subprocesos paralelos síncronos o asíncronos de un proceso descompuesto son otro mecanismo de iteración (11.2 NOTE 2). | 11.2 |
| — | 991 | canon | §6.7 | corregida: Rangos qmín..qmáx cerrados; varios rangos separados por coma (en OPL «..» = «a», coma = «o»); «*» sólo en 0..* y 1..*. | 11.1, 11.3 |
| — | 993 | canon | §6.7 | corregida: En OPD los glifos =, ≠, <, ≤, ≥, {…}, ∈ son ISO (11.2); en OPL la EBNF usa =, <, >, <=, >= y «in {…}» (A.3.2). | 11.2, A.3.2 |
| R-MULT-2 | 995 | canon | §6.7 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 11.2 |
| — | 999 | canon | §6.8 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.7 |
| — | 999 | canon | §6.8 | corregida: El 1/n es semántica del modelo (12.7) y sólo para resultado sin estado especificado hacia objeto de n estados sin estado inicial; no hay default para ramas de abanico. | 12.7 |
| R-PROB-1 | 1001 | canon | §6.8 | corregida: Un abanico probabilístico DEBE ser XOR divergente (12.7). | 12.7 |
| R-PROB-1A | 1002 | canon | §6.8 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.2, 12.7 |
| — | 1012 | canon | §7.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.1 |
| — | 1013 | canon | §7.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.2 |
| — | 1014 | canon | §7.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.2 |
| R-FAN-GEO-1 | 1016 | canon | §7.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.2 |
| R-FAN-GEO-2 | 1017 | canon | §7.1 | corregida: Todo abanico es convergente o divergente, salvo el de efecto, que se distingue por objetos múltiples o procesos múltiples (Tabla 19). | 12.3 |
| — | 1023 | canon | §7.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.3 |
| — | 1024 | canon | §7.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.3 |
| — | 1025 | canon | §7.2 | corregida: Efecto: abanico de objetos múltiples (N objetos↔1 proceso) o de procesos múltiples (N procesos↔1 objeto) (Tabla 19). | 12.3 |
| — | 1026 | canon | §7.2 | corregida: Agente convergente y divergente: ambos en la EBNF normativa (A.4.5.3.2) y en 12.2 EXAMPLE; registrar que 12.3/Tabla 20 sólo admite divergente. | 12.3, 12.2, A.4.5.3.2 |
| — | 1027 | canon | §7.2 | corregida: Instrumento convergente y divergente: ambos en A.4.5.3.3; registrar la contradicción con 12.3/Tabla 20. | 12.3, A.4.5.3.3 |
| — | 1028 | canon | §7.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.3 |
| R-FAN-HAB-1 | 1030 | canon | §7.2 | corregida: Varios habilitadores al mismo proceso son AND (12.1); el abanico XOR/OR convergente de habilitadores está en A.4.5.3.2–3 y 12.2 EXAMPLE, contra 12.3. | 12.1, 12.2, 12.3, A.4.5.3.2, A.4.5.3.3 |
| — | 1036 | canon | §7.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.3, A.4.5.2 |
| — | 1037 | canon | §7.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.3, A.4.5.2 |
| — | 1038 | canon | §7.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.3, A.4.5.2 |
| — | 1039 | canon | §7.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.3, A.4.5.2 |
| — | 1040 | canon | §7.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.3, A.4.5.2 |
| — | 1041 | canon | §7.3 | corregida: Exactamente uno de *P*, *Q* o *R* afecta **B**. / Al menos uno de *P*, *Q* o *R* afecta **B**. | 12.3, A.4.5.2 |
| — | 1042 | canon | §7.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.3, A.4.5.3.2 |
| — | 1043 | canon | §7.3 | corregida: Exactamente uno de **A**, **B** o **C** maneja *P*. / Al menos uno de **A**, **B** o **C** maneja *P*. | A.4.5.3.2, 12.2 |
| — | 1044 | canon | §7.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.3, A.4.5.3.3 |
| — | 1045 | canon | §7.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.5.3.3 |
| — | 1046 | canon | §7.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.3, A.4.5.4 |
| — | 1047 | canon | §7.3 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.3, A.4.5.4 |
| — | 1051 | canon | §7.4 | corregida: Usar las oraciones de las Tablas 22–23: «B inicia exactamente uno de P, Q o R, que consume B» / «…, en cuyo caso el proceso que ocurre afecta B». | 12.5, 12.6 |
| — | 1053 | canon | §7.4 | corregida: **B** inicia exactamente uno de *P*, *Q* o *R*, en cuyo caso el proceso que ocurre afecta **B**. | 12.5 |
| — | 1055 | canon | §7.4 | corregida: Usar las oraciones de las Tablas 22–23, con «estos procesos se omiten». | 12.5, 12.6 |
| — | 1057 | canon | §7.4 | corregida: Exactamente uno de *P*, *Q* o *R* ocurre si **B** existe, en cuyo caso el proceso que ocurre afecta **B**; de lo contrario, estos procesos se omiten. | 12.5 |
| R-FAN-EST-1 | 1059 | canon | §7.4 | corregida: Añadir: salvo el abanico de efecto con modificador de control, que no tiene versión con estado (12.6). | 12.4, 12.6 |
| R-FAN-PROB-1 | 1060 | canon | §7.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.7 |
| R-FAN-PROB-1 | 1060 | canon | §7.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.7 |
| R-FAN-PROB-1 | 1060 | perfil | §7.4 | caso (C) «declarado probabilístico sin pesos» llevado al perfil §7.4 como fragmento [extensión]; el canon conserva la definición ISO (ISO §12.7) | 12.7 |
| — | 1064 | canon | §7.5 | corregida: Añadir: sólo si el objeto no tiene estado inicial; con estado inicial se crea en él con Pr 1.0, o con 1/m si hay m iniciales (12.7). | 12.7 |
| — | 1066 | canon | §7.5 | corregida: Sin estado especificado: 1/n por estado; si hay estado inicial, 1.0 (o 1/m con m iniciales) (12.7). | 12.7 |
| — | 1068 | canon | §7.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.1, 12.5 |
| R-FAN-M-1 | 1072 | perfil | §7.6 | sin cambio |  |
| R-FAN-M-2 | 1073 | perfil | §7.6 | sin cambio |  |
| R-FAN-M-3 | 1074 | perfil | §7.6 | sin cambio |  |
| R-FAN-M-4 | 1075 | perfil | §7.6 | sin cambio |  |
| — | 1085 | canon | §8.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.1, 14.2.1.1, 3.70, 3.71 |
| — | 1086 | canon | §8.1 | corregida: Ámbito: «estructura (sin transferencia de control); aplica a objetos y procesos; en procesos modela refinamiento asíncrono». | 14.2.1.2, 3.22 |
| — | 1087 | canon | §8.1 | corregida: Ámbito: «procesos: orden temporal parcial y control; objetos: orden espacial o lógico». | 14.2.1.3, 3.34, 3.35 |
| — | 1088 | perfil | §8.1 | sin cambio de texto; anotada: ISO §14.2.1 define tres pares; la referencia a sub-modelo es operación de producto | 14.2.1 |
| R-REF-MEC-1 | 1090 | canon | §8.1 | corregida: Citar 14.2.1.2 y nombrar los pares (despliegue de partes/plegado de participación, etc.). | 14.2.1.2, 10.3.1 |
| R-REF-SYNC-1 | 1094 | canon | §8.2 | corregida: El refinamiento síncrono DEBE modelarse con descomposición (14.2.2.5); el control vuelve al proceso descompuesto al completarse su último subproceso habilitado (14.2.2.1). | 14.2.2.5, 14.2.2.1 |
| R-REF-SYNC-2 | 1095 | canon | §8.2 | corregida: Citar 14.2.2.5, 3.22 Nota 2 y 14.2.1.2 NOTE 5; precisar «despliegue por agregación de un proceso». | 14.2.2.5, 3.22, 14.2.1.2 |
| R-REF-NTRIV-1 | 1099 | perfil | §8.3 | sin cambio | A.4.3, A.4.7.4, 14.2.2.4.3 |
| R-REF-NTRIV-2 | 1100 | perfil | §8.3 | sin cambio | 10.3.1 |
| R-REF-NTRIV-3 | 1101 | perfil | §8.3 | sin cambio |  |
| R-ESCIND-0 | 1105 | canon | §8.4 | corregida: Conservar la distinción y el alcance de la prohibición (Tabla 25 NOTE 1 frente a 9.5.2.3.3–4 y 9.5.3.3.3–4); sacar la cláusula de procedencia y parseo. | 14.2.2.4.3, Tabla 25, 9.3.3.3, 9.3.3.4, 9.5.2.3.3, 9.5.3.3.3 |
| R-ESCIND-1 | 1106 | canon | §8.4 | corregida: Si el proceso descompuesto tiene más de un subproceso, el TS3 queda subespecificado hasta asignar entrada y salida a subprocesos de forma temporalmente factible: a uno solo, o escindido (TS4 temprano, TS5 tardío). | 14.2.2.4.3 |
| R-ESCIND-2 | 1107 | canon | §8.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | Tabla 25 |
| R-ESCIND-3 | 1108 | canon | §8.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | Tabla 25 |
| R-ESC-1 | 1110 | canon | §8.4 | corregida: marcada [informativo]; Solo lo funda la NOTE 1 de la Tabla 25; el canon lo eleva a prohibición. Contenido fiel. | Tabla 25 |
| R-ESC-1A | 1111 | perfil | §8.4 | sin cambio de texto (ya declarada endurecimiento) |  |
| — | 1117 | canon | §8.5 | corregida: Añadir que la migración es inicial o por defecto y que el modelador puede moverla (NOTE 2). | 14.2.2.4.1 |
| — | 1118 | canon | §8.5 | corregida: por defecto se ancla al primer subproceso y el modelador lo reasigna (ISO §14.2.2.4.1, NOTA 2 [informativo]); la fila original (resultado al último) queda en perfil §8.5 como [desviación declarada] por decisión del dueño | 14.2.2.4.1 |
| — | 1119 | canon | §8.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.4.1 |
| — | 1120 | canon | §8.5 | corregida: «Asignar a uno o dos subprocesos de forma temporalmente factible; si son dos, par escindido TS4/TS5». | 14.2.2.4.3 |
| — | 1121 | canon | §8.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.4.1 |
| — | 1122 | canon | §8.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.4.1 |
| — | 1123 | perfil | §8.5 | decidir → perfil (ISO §14.2.2.4.1 sólo da semántica distributiva a los procedimentales); anotada [extensión] | 14.2.2.4.1 |
| — | 1124 | canon | §8.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.4.2 |
| — | 1125 | canon | §8.5 | corregida: «PUEDE cruzar; el modelador DEBERÍA modelar cómo se maneja la contingencia». | 14.2.2.4.2 |
| R-DIST-1 | 1127 | canon | §8.5 | corregida: Citar 14.2.2.4.1 en lugar de V-37. | 14.2.2.4.1 |
| R-DIST-1A | 1128 | canon | §8.5 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.4.1 |
| R-HIJO-1 | 1132 | canon | §8.6 | corregida: En descomposición, el refinable rodea a sus refinados; en despliegue, aparece unido a ellos por enlaces estructurales fundamentales; en ambos casos con contorno grueso en los dos OPD. | 14.2.1.3, 14.2.1.2 |
| R-HIJO-2 | 1133 | perfil | §8.6 | sin cambio |  |
| R-HIJO-3 | 1134 | perfil | §8.6 | sin cambio | C.5.1 |
| R-HIJO-4 | 1135 | perfil | §8.6 | sin cambio |  |
| R-HIJO-5 | 1136 | perfil | §8.6 | sin cambio |  |
| R-HIJO-6 | 1137 | perfil | §8.6 | sin cambio |  |
| R-IDP-0 | 1141 | perfil | §8.7 | sin cambio |  |
| R-IDP-0A | 1142 | perfil | §8.7 | sin cambio de texto; la nota de perfil §5.4 fija que la fuente semántica es la disposición vertical (ISO §14.2.2.1) | 14.2.2.1, 14.2.2.2, D.4 |
| R-IDP-0B | 1143 | perfil | §8.7 | sin cambio |  |
| R-IDP-0C | 1144 | perfil | §8.7 | sin cambio |  |
| R-IDP-1 | 1146 | perfil | §8.7 | sin cambio |  |
| R-IDP-1A | 1147 | perfil | §8.7 | sin cambio |  |
| R-IDP-2 | 1149 | perfil | §8.7 | sin cambio |  |
| R-IDP-3 | 1151 | perfil | §8.7 | sin cambio |  |
| R-REF-1 | 1155 | canon | §8.8 | corregida: «El árbol de procesos OPD y la jerarquía de despliegue son árboles: NO DEBEN tener ciclos». | 14.2.2.6.1.1, 14.2.1.2 |
| R-REF-2 | 1156 | perfil | §8.8 | sin cambio |  |
| R-REF-3 | 1157 | perfil | §8.8 | sin cambio |  |
| R-REF-4 | 1158 | canon | §8.8 | corregida: Citar 14.2.3 y B.4 (el mismo elemento en otro OPD). | 14.2.3, B.4 |
| R-ROL-1 | 1162 | canon | §8.9 | corregida: Nota: un objeto puede figurar como instrumento en el OPD abstracto y como afectado en uno descendiente cuando su estado inicial coincide con el final (Tabla 25 NOTE 2). | Tabla 25, 14.2.4.3 |
| R-ROL-2 | 1163 | perfil | §8.9 | sin cambio de texto; anotada [endurecimiento] | Tabla 25 |
| R-ROL-3 | 1164 | canon | §8.9 | corregida: Citar 14.2.4.3. | 14.2.4.3, 14.2.3 |
| R-SD-1 | 1168 | canon | §8.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.1 |
| R-SD-2 | 1169 | canon | §8.10 | corregida: DEBERÍA en lugar de DEBE. | 14.1 |
| R-SD-3 | 1170 | canon | §8.10 | corregida: «PUEDE ser explícito (estados de entrada y salida del beneficiario, o valores inicial y final de sus atributos) o implícito (el beneficiario es afectado)». | 14.1 |
| R-SD-4 | 1171 | canon | §8.10 | corregida: DEBE contener exactamente un proceso sistémico; PUEDE contener procesos ambientales. Citar 14.2.2.6.1.3. | 14.2.2.6.1.3, 3.75 |
| R-ARB-1 | 1172 | canon | §8.10 | corregida: Nodos: OPD creados por descomposición (síncronos) o por despliegue de agregación (asíncronos) en nuevo diagrama. | 3.45, 14.2.2.6.1.1 |
| R-ARB-2 | 1173 | canon | §8.10 | corregida: Mencionar el bosque: un árbol por cada objeto refinable. | 3.44, 14.2.2.6.1.2 |
| R-ARB-3 | 1174 | canon | §8.10 | corregida: Conservar la etiqueta SD de la raíz; quitar la remisión a la identidad persistente (producto). | 14.2.2.6.1.3 |
| R-ARB-4 | 1175 | canon | §8.10 | corregida: Usar «NombreProceso» también en el despliegue (árbol de procesos) y añadir la oración «SDn se refina por … en SDn+1». | 14.2.2.6.1.4 |
| R-CAN-BOCETO-1 | 1176 | perfil | §8.10 | sin cambio |  |
| R-CAN-BOCETO-2 | 1181 | perfil | §8.10 | sin cambio |  |
| R-CAN-BOCETO-3 | 1185 | perfil | §8.10 | sin cambio |  |
| R-CAN-BOCETO-4 | 1190 | perfil | §8.10 | sin cambio |  |
| R-OPL-TOTAL-1 | 1196 | canon | §8.10 | corregida: Es la sucesión de párrafos de todos los OPD; DEBERÍA abrir con título; el orden suele ser SD y luego en anchura, salvo otro que elija el modelador (NOTE 2). | 14.2.2.6.2, Tabla 26 |
| R-OPL-TOTAL-2 | 1197 | canon | §8.10 | corregida: Quitar «cargado». | 14.2.2.6.2 |
| R-OPL-TOTAL-3 | 1198 | perfil | §8.10 | sin cambio |  |
| R-OPL-TOTAL-4 | 1199 | canon | §8.10 | corregida: Citar 14.2.1.1 y añadir la frase reservada «u otros estados» del símbolo de supresión. | 14.2.1.1 |
| R-OPL-TOTAL-5 | 1200 | canon | §8.10 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.1.1 |
| R-VIEW-1 | 1201 | canon | §8.10 | corregida: Citar 14.2.2.6.1.5 (no 14.2.1); añadir que la herramienta DEBERÍA ofrecer vistas como OPD con OPL. | 14.2.2.6.1.5 |
| R-VIEW-2 | 1202 | perfil | §8.10 | decidir → perfil (más estricta que ISO §14.2.3; producto sin vistas) | 14.2.2.6.1.5, 14.2.3 |
| R-VIEW-3 | 1203 | perfil | §8.10 | sin cambio |  |
| R-VIEW-4 | 1204 | canon | §8.10 | corregida: Mantener la primera parte; quitar el «NO DEBE confundirse» y añadir las vistas de modelo obligatorias (lista de cosas, árbol de procesos, árboles de objetos). | 14.2.2.6.1.5 |
| R-BRING-1 | 1205 | perfil | §8.10 | sin cambio |  |
| R-SIMP-1 | 1206 | canon | §8.10 | decidir → canon [informativo] (ISO C.5.2), PUEDE | C.5.2 |
| R-SIMP-2 | 1207 | canon | §8.10 | corregida: Formularla como consecuencia de la firma normativa: ningún procedimental, salvo invocación y excepción, une dos procesos. | C.5.2, 9.5.1 |
| R-OPD-OP-1 | 1211 | canon | §8.11 | decidir → canon [informativo] (ISO C.5.1), sin DEBE | C.5.1 |
| R-OPD-OP-2 | 1212 | canon | §8.11 | decidir → canon [informativo] (ISO C.5.1), sin DEBE | C.5.1 |
| R-OPD-OP-3 | 1213 | perfil | §8.11 | sin cambio |  |
| R-OPD-OP-4 | 1214 | perfil | §8.11 | sin cambio |  |
| R-OPD-OP-5 | 1215 | perfil | §8.11 | sin cambio | 10.3.4.1 |
| R-OPD-OP-6 | 1216 | perfil | §8.11 | sin cambio | B.6.2 |
| R-OPD-OP-7 | 1217 | perfil | §8.11 | sin cambio | B.6.2 |
| R-BI-DUAL-1 | 1225 | canon | §9.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 6.2.1 |
| R-BI-TAB-1 | 1229 | canon | §9.2 | corregida: Presentar la tabla como correspondencia normativa; la función de gate va a producto. | 6.2.1 |
| — | 1233 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.2, C.4 |
| — | 1234 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.2, 7.3.4 |
| — | 1235 | canon | §9.2 | corregida: «Contorno discontinuo (de trazos)», aplicable a rectángulo y elipse. | A.4.4.2, C.4 |
| — | 1236 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.2, C.4 |
| — | 1237 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 7.3.5.2, A.4.4.4 |
| — | 1238 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 7.3.5.4, A.4.4.4 |
| — | 1239 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 7.3.5.4, A.4.4.4 |
| — | 1240 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 7.3.5.4, A.4.4.4 |
| — | 1241 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | A.4.4.4, Tabla 26 |
| — | 1242 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.1.2 |
| — | 1243 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.1.3 |
| — | 1244 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.1.4 |
| — | 1245 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.3.3.2 |
| — | 1246 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.2.2 |
| — | 1247 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.2.3 |
| — | 1248 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.1 |
| — | 1249 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.3.1 |
| — | 1250 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.2.5.1 |
| — | 1251 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.2 |
| — | 1252 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.3.1 |
| — | 1253 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.4.1 |
| — | 1254 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 10.3.5.1 |
| — | 1255 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.1.3, 14.2.2.1 |
| — | 1256 | canon | §9.2 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 12.2 |
| — | 1257 | canon | §9.2 | corregida: «Dos arcos discontinuos concéntricos». | 12.2 |
| — | 1258 | canon | §9.2 | corregida: «*Manejo* ocurre si la duración de *Fuente* excede máx-duración unidades-de-tiempo.»; marca: barra corta oblicua junto al proceso destino. | 9.5.4.2 |
| R-BR-1 | 1262 | canon | §9.3 | corregida: El plegado o despliegue parcial emite OPL de los refinados visibles, con la frase de relación parcial («y otras partes»). | 14.2.1.2, 10.3.2 |
| R-BR-2 | 1263 | perfil | §9.3 | sin cambio |  |
| R-BR-3 | 1264 | perfil | §9.3 | sin cambio |  |
| R-BR-4 | 1265 | perfil | §9.3 | sin cambio |  |
| R-BR-5 | 1266 | perfil | §9.3 | sin cambio |  |
| R-CONSIST-1 | 1270 | canon | §9.4 | corregida: Añadir (a): todo hecho afirmado en un OPD es verdadero para todo el modelo. | 14.2.3 |
| R-CONSIST-2 | 1271 | canon | §9.4 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.3 |
| R-IMP-1 | 1275 | canon | §9.5 | decidir → canon [informativo] (ISO B.2), sin DEBE | B.2 |
| R-IMP-2 | 1276 | perfil | §9.5 | sin cambio | B.2 |
| R-ESC-OP-1 | 1282 | perfil | §10 | sin cambio |  |
| R-ESC-OP-2 | 1283 | perfil | §10 | sin cambio |  |
| R-ESC-OP-3 | 1284 | perfil | §10 | sin cambio |  |
| R-ESC-OP-4 | 1285 | perfil | §10 | sin cambio |  |
| R-BI-0 | 1289 | canon | §10.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 6.2.1, C.2 |
| R-BI-0A | 1290 | perfil | §10.1 | sin cambio |  |
| R-BI-0B | 1291 | perfil | §10.1 | sin cambio |  |
| R-BI-1 | 1293 | perfil | §10.1 | sin cambio |  |
| R-BI-2 | 1295 | perfil | §10.1 | sin cambio |  |
| R-BI-3 | 1297 | perfil | §10.1 | sin cambio |  |
| R-BI-4 | 1299 | perfil | §10.1 | sin cambio |  |
| R-IMPORT-1 | 1305 | perfil | §10.2 | sin cambio |  |
| R-IMPORT-2 | 1306 | perfil | §10.2 | sin cambio |  |
| R-IMPORT-3 | 1307 | perfil | §10.2 | sin cambio |  |
| R-IMPORT-4 | 1308 | perfil | §10.2 | sin cambio |  |
| R-IMPORT-5 | 1309 | perfil | §10.2 | sin cambio |  |
| R-IMPORT-6 | 1310 | perfil | §10.2 | sin cambio |  |
| R-IMPORT-7 | 1311 | perfil | §10.2 | sin cambio |  |
| R-IMPORT-8 | 1312 | perfil | §10.2 | sin cambio |  |
| R-EDIT-1 | 1318 | perfil | §10.3 | sin cambio |  |
| R-EDIT-2 | 1319 | perfil | §10.3 | sin cambio |  |
| R-EDIT-3 | 1320 | perfil | §10.3 | sin cambio |  |
| R-EDIT-4 | 1321 | perfil | §10.3 | sin cambio |  |
| R-EDIT-5 | 1322 | perfil | §10.3 | sin cambio |  |
| R-EDIT-6 | 1323 | perfil | §10.3 | sin cambio |  |
| R-EDIT-7 | 1324 | perfil | §10.3 | sin cambio |  |
| R-EDIT-8 | 1325 | perfil | §10.3 | sin cambio |  |
| R-AP-0 | 1329 | perfil | §11 | sin cambio |  |
| R-AP-0A | 1330 | perfil | §11 | sin cambio |  |
| R-AP-0B | 1331 | perfil | §11 | sin cambio |  |
| R-AP-0C | 1332 | perfil | §11 | sin cambio |  |
| AP-01 | 1338 | canon | §11.1 | corregida: Formularlo como regla: no existe enlace de resultado con «c»; el modificador solo anota enlaces entrantes. | 9.5.1 |
| AP-02 | 1339 | canon | §11.1 | corregida: Ídem AP-01 para «e». | 9.5.1 |
| AP-03 | 1340 | canon | §11.1 | corregida: Ídem AP-01. | 9.5.1, 12.5 |
| AP-04 | 1341 | canon | §11.1 | corregida: DEBERÍA conectarse al rectángulo o a un estado no inicial. | 9.3.2 |
| AP-05 | 1342 | canon | §11.1 | corregida: Un agente es humano o grupo humano; lo no humano es instrumento. | 3.3, 9.2.2 |
| AP-06 | 1343 | canon | §11.1 | corregida: acción = anclar por defecto al primer subproceso y reasignar (R-DIST-3); la acción de producto (resultado al último) queda en perfil §8.5 como [desviación declarada] por decisión del dueño | 14.2.2.4.1 |
| AP-07 | 1344 | canon | §11.1 | corregida: Rechazar el TS3 que quede subespecificado en el contorno; sustituto: asignarlo a un subproceso o escindirlo. | 14.2.2.4.3 |
| AP-08 | 1345 | canon | §11.1 | corregida: marcada [informativo]; Funda solo una NOTE; alcance correcto (no aplica al standalone). | Tabla 25 |
| AP-09 | 1346 | canon | §11.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 9.5.1, 3.13 |
| AP-10 | 1347 | canon | §11.1 | corregida: Justificación: c/e solo anotan enlaces entrantes objeto→proceso (9.5.1); la invocación ya es un enlace de evento entre procesos. | 9.5.1, 9.5.2.5.1 |
| AP-11 | 1348 | perfil | §11.1 | sin cambio de texto; anotada [endurecimiento]: bloquea construcciones válidas (ISO §10.4.2.5, §10.4.2.7) | 10.4.2.5, 10.4.2.7 |
| AP-12 | 1349 | canon | §11.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 7.3.5.1, A.4.4.4, 3.70 |
| AP-13 | 1350 | perfil | §11.1 | sin cambio |  |
| AP-14 | 1351 | perfil | §11.1 | sin cambio | A.4.4.4 |
| AP-15 | 1352 | perfil | §11.1 | sin cambio |  |
| AP-16 | 1353 | canon | §11.1 | corregida: Igual que R-REF-1. | 14.2.2.6.1.1 |
| AP-17 | 1354 | perfil | §11.1 | sin cambio |  |
| AP-18 | 1355 | perfil | §11.1 | sin cambio |  |
| AP-19 | 1356 | perfil | §11.1 | sin cambio |  |
| AP-20 | 1357 | canon | §11.1 | corregida: Formularlo como regla gráfica: exhibición con triángulo interior negro, clasificación con círculo interior negro. | 10.3.3.1, 10.3.5.1 |
| AP-21 | 1358 | canon | §11.1 | sin cambio (cita ISO en lugar de SSOT-*/V-*) | 14.2.2.4.2 |
| AP-22 | 1359 | perfil | §11.1 | sin cambio | B.6.2 |
| AP-23 | 1360 | perfil | §11.1 | sin cambio |  |
| AP-24 | 1361 | perfil | §11.1 | sin cambio |  |
| AP-25 | 1362 | perfil | §11.1 | sin cambio |  |
| AP-26 | 1363 | perfil | §11.1 | sin cambio | 9.5.2.5.1 |
| AP-27 | 1364 | perfil | §11.1 | sin cambio | 14.2.2.4.2 |
| AP-28 | 1365 | perfil | §11.1 | sin cambio |  |
| AP-29 | 1366 | perfil | §11.1 | sin cambio |  |
| AP-30 | 1367 | canon | §11.1 | decidir → canon marcada «no verificable» (Tabla 27); formulada como regla, sin «bloquear» | 14.2.4.2, Tabla 27 |
| R-ZNC-1 | 1371 | perfil | §11.2 | sin cambio |  |
| R-ZNC-2 | 1372 | perfil | §11.2 | sin cambio |  |
| — | 1376 | perfil | §11.2 | sin cambio |  |
| — | 1377 | canon | §11.2 | corregida: Añadir que un resultado sin estado hacia un objeto con estados implica 1/n por estado. | 12.7 |
| R-APP-0 | 1383 | perfil | §12 | sin cambio |  |
| R-APP-1 | 1384 | perfil | §12 | sin cambio |  |
| R-APP-2 | 1385 | perfil | §12 | sin cambio |  |
| R-APP-3 | 1386 | perfil | §12 | sin cambio |  |
| R-APP-4 | 1387 | perfil | §12 | sin cambio |  |
| R-APP-5 | 1388 | perfil | §12 | sin cambio |  |
| R-APP-6 | 1389 | perfil | §12 | sin cambio |  |
| R-APP-7 | 1390 | perfil | §12 | sin cambio |  |
| R-ANEXO-CHECK-1 | 1398 | canon | Anexo A | corregida: se conserva en el canon como encabezado de las comprobaciones fundadas en ISO; los gates de producto y la severidad van al perfil, que la cita |  |
| — | 1402 | perfil | Anexo A | sin cambio |  |
| — | 1403 | canon | Anexo A | corregida: «… un estructural conecta un estado fuera de las formas 10.4.1–10.4.2 (caracterización con estado y etiquetados con estado) …». | 10.4.1, 10.4.2, 9.5.2.5.1, C.5.2 |
| — | 1404 | canon | Anexo A | corregida: Mantener el dueño y un solo estado por defecto; quitar «Current», que no es designación ISO (solo Anexo C). | 7.3.5, A.4.4.4, 6.2.6.1 |
| — | 1405 | canon | Anexo A | corregida: se quita «metadato de vista»; gate OPL bidireccional (ISO §6.2.1) | 6.2.1 |
| — | 1406 | perfil | Anexo A | sin cambio |  |
| — | 1407 | canon | Anexo A | corregida: «… resultado, estructural, invocación, excepción o par escindido (Tabla 25 NOTE 1) reciben c/e». | 9.5.1, 9.5.2.3.3, 9.5.2.3.4, 9.5.3.3.3, 9.5.3.3.4, Tabla 25 |
| — | 1408 | canon | Anexo A | corregida: Falla si contradice al padre, crea un ciclo en el árbol o cambia nombre, esencia o perseverancia; quitar «replica layout» y «motivado». | 14.2.3, 14.2.2.6.1.1 |
| — | 1409 | canon | Anexo A | corregida: «… o TS3 queda subespecificado (sin asignar a uno o dos subprocesos)»; citar 14.2.2.4. | 14.2.2.4.1, 14.2.2.4.3 |
| — | 1410 | perfil | Anexo A | sin cambio |  |
| — | 1411 | perfil | Anexo A | sin cambio |  |
| — | 1412 | perfil | Anexo A | sin cambio |  |
| — | 1413 | perfil | Anexo A | sin cambio |  |
| R-ANEXO-VIS-1 | 1417 | perfil | Anexo B | sin cambio |  |
| R-ANEXO-VIS-2 | 1418 | perfil | Anexo B | sin cambio |  |
| R-ANEXO-VIS-3 | 1419 | perfil | Anexo B | sin cambio |  |
| R-ANEXO-VIS-4 | 1420 | perfil | Anexo B | sin cambio |  |
| R-VIS-EXP-1 | 1424 | perfil | Anexo B | sin cambio |  |
| R-VIS-EXP-2 | 1425 | perfil | Anexo B | sin cambio |  |
| R-VIS-EXP-3 | 1426 | perfil | Anexo B | sin cambio |  |
| R-VIS-EXP-4 | 1427 | perfil | Anexo B | sin cambio |  |
| R-VIS-EXP-5 | 1428 | perfil | Anexo B | sin cambio |  |
| R-VIS-EXP-6 | 1429 | perfil | Anexo B | sin cambio |  |
| R-VIS-CAPA-1 | 1430 | perfil | Anexo B | sin cambio |  |
| R-VIS-CAPA-2 | 1431 | perfil | Anexo B | sin cambio |  |
| R-VIS-CAPA-3 | 1432 | perfil | Anexo B | sin cambio |  |
| R-VIS-CAPA-4 | 1433 | perfil | Anexo B | sin cambio |  |
| R-VIS-PRIM-1 | 1434 | perfil | Anexo B | sin cambio |  |
| R-VIS-TRI-1 | 1435 | eliminada-duplicada→ spec-OPD §7.1 | Anexo B | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §7.1» | 10.3.2, 10.3.4.1 |
| R-VIS-TRI-2 | 1436 | perfil | Anexo B | sin cambio |  |
| R-VIS-AUX-1 | 1437 | perfil | Anexo B | sin cambio |  |
| R-VIS-AUX-2 | 1438 | perfil | Anexo B | sin cambio |  |
| R-VIS-CONSTRUCT-1 | 1439 | fusionada→ R-META-10, R-META-13 | Anexo B | fusionada: Metamodelo del Anexo C elevado a DEBE; duplica R-META. | C.2, C.3 |
| R-VIS-EST-1 | 1440 | eliminada-duplicada→ spec-OPD §3.1 | Anexo B | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §3.1» | 7.3.5.2 |
| R-VIS-EST-2 | 1441 | eliminada-duplicada→ spec-OPD §3.1 | Anexo B | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §3.1» | 10.3.3.2.1, 7.3.5.5 |
| R-VIS-FAN-1 | 1442 | eliminada-duplicada→ spec-OPD §6.3 | Anexo B | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §6.3» | 12.1 |
| R-VIS-RUTA-1 | 1443 | eliminada-duplicada→ spec-OPD §6.4 | Anexo B | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §6.4» | 13 |
| R-VIS-MULT-1 | 1444 | eliminada-duplicada→ spec-OPD §9 | Anexo B | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §9» | 11.1 |
| R-VIS-HER-1 | 1445 | eliminada-duplicada→ spec-OPD §7.1 | Anexo B | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §7.1» | 10.3.4.2, 10.3.4.3 |
| R-VIS-HER-2 | 1446 | perfil | Anexo B | sin cambio | 10.3.4.2 |
| R-VIS-REF-1 | 1447 | eliminada-duplicada→ spec-OPD §10.1 | Anexo B | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §10.1» | 14.2.1.3, 14.2.2.1 |
| R-VIS-CTRL-1 | 1448 | canon | Anexo B | corregida: Añadir: si no hay siguiente, el control vuelve al proceso descompuesto. | 14.2.2.4.2 |
| R-VIS-DUR-1 | 1449 | perfil | Anexo B | sin cambio | 9.5.4.1, D.7 |
| R-VIS-DUR-2 | 1450 | perfil | Anexo B | sin cambio |  |
| R-VIS-SD-1 | 1451 | fusionada→ R-SD-4 | Anexo B | fusionada: Duplica R-SD-4: unificar. | 14.2.2.6.1.3 |
| R-VIS-NOM-1 | 1452 | canon | Anexo B | corregida: Nombres únicos en el modelo (B.6; lo presupone 14.2.2.6.1.4). | B.6.2, B.6.3, 14.2.2.6.1.4 |
| R-VIS-REDIR-1 | 1453 | perfil | Anexo B | sin cambio |  |
| R-VIS-CONS-1 | 1454 | perfil | Anexo B | sin cambio |  |
| R-VIS-APP-1 | 1455 | eliminada-duplicada→ spec-OPD §10.4 | Anexo B | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §10.4» | B.4, 14.2.3 |
| R-VIS-ASYNC-1 | 1456 | eliminada-duplicada→ spec-OPD §8.1 | Anexo B | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §8.1» | 14.2.2.5 |
| R-VIS-INZOOM-1 | 1457 | fusionada→ R-OPD-OP-1, R-OPD-OP-2 | Anexo B | fusionada: Duplica R-OPD-OP-1/2. | C.5.1 |
| R-VIS-MODELO-1 | 1458 | eliminada-duplicada→ spec-OPD §10.4 | Anexo B | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §10.4» | C.2, 14.2.2.6.2 |
| R-VIS-SUPR-1 | 1459 | eliminada-duplicada→ spec-OPD §3.3 | Anexo B | notación gráfica: la define spec-OPD (dueño del plano, decisión de coordinación); el canon conserva el ID como referencia «ver spec-OPD §3.3» | 14.2.1.1 |
| R-VIS-HIJO-1 | 1460 | perfil | Anexo B | sin cambio de texto; anotada: rige sólo la presentación; la distribución ISO está en canon reglas §8.5 | 14.2.2.4.1, 14.2.1.3 |
| R-VIS-DIST-1 | 1461 | perfil | Anexo B | sin cambio |  |
| R-VIS-SEMI-1 | 1462 | perfil | Anexo B | sin cambio |  |
| R-VIS-SOMB-1 | 1463 | perfil | Anexo B | sin cambio | 14.2.3 |
| R-VIS-LEX-1 | 1464 | perfil | Anexo B | sin cambio |  |
| R-VIS-RUN-1 | 1465 | perfil | Anexo B | sin cambio |  |
| R-VIS-RUN-2 | 1466 | perfil | Anexo B | sin cambio |  |
| R-VIS-RUN-3A | 1467 | perfil | Anexo B | sin cambio |  |
| R-VIS-RUN-3B | 1468 | perfil | Anexo B | sin cambio |  |
| R-VIS-RUN-3C | 1469 | perfil | Anexo B | sin cambio |  |
| R-VIS-RUN-3E | 1470 | perfil | Anexo B | sin cambio |  |
| R-VIS-STEREO-1 | 1471 | perfil | Anexo B | sin cambio |  |
| R-VIS-STEREO-2 | 1472 | perfil | Anexo B | sin cambio |  |
| R-VIS-REQ-1 | 1473 | perfil | Anexo B | sin cambio |  |
| R-VIS-COMP-1 | 1474 | perfil | Anexo B | sin cambio |  |
| R-VIS-COMP-2 | 1475 | perfil | Anexo B | sin cambio |  |
| R-VIS-COMP-3 | 1476 | perfil | Anexo B | sin cambio |  |
| R-VIS-SUB-1 | 1477 | perfil | Anexo B | sin cambio |  |
| R-VIS-SUB-2 | 1478 | perfil | Anexo B | sin cambio |  |
| R-VIS-SUB-3 | 1479 | perfil | Anexo B | sin cambio |  |
| R-VIS-LAYOUT-1 | 1480 | perfil | Anexo B | sin cambio |  |
| R-VIS-MODO-1 | 1481 | perfil | Anexo B | sin cambio |  |
| R-VIS-AUTOR-1 | 1482 | perfil | Anexo B | sin cambio |  |
| R-VIS-AUTOR-2 | 1483 | perfil | Anexo B | sin cambio |  |
| R-VIS-VAL-1 | 1484 | perfil | Anexo B | sin cambio |  |
| R-VIS-EXPORT-1A | 1485 | perfil | Anexo B | sin cambio |  |
| R-VIS-EXPORT-1B | 1486 | perfil | Anexo B | sin cambio |  |
| R-VIS-EXPORT-1C | 1487 | perfil | Anexo B | sin cambio |  |
| R-VIS-EXPORT-1D | 1488 | perfil | Anexo B | sin cambio |  |
| R-VIS-EXPORT-1E | 1489 | perfil | Anexo B | sin cambio |  |
| R-VIS-FAM-1 | 1490 | perfil | Anexo B | sin cambio de texto; anotada: el «cuarto par» es operación de producto (ISO §14.2.1) | 14.2.1 |
| R-VIS-XMODEL-1 | 1491 | perfil | Anexo B | sin cambio |  |
| R-VIS-BRING-1A | 1492 | perfil | Anexo B | sin cambio |  |
| R-VIS-BRING-1B | 1493 | perfil | Anexo B | sin cambio |  |
| R-VIS-BRING-1C | 1494 | perfil | Anexo B | sin cambio |  |
| R-VIS-BRING-1D | 1495 | perfil | Anexo B | sin cambio |  |
| R-VIS-BRING-1E | 1496 | perfil | Anexo B | sin cambio |  |
| R-VIS-BRING-1F | 1497 | perfil | Anexo B | sin cambio |  |
| R-VIS-BRING-1G | 1498 | perfil | Anexo B | sin cambio |  |
| R-ANEXO-CAT-0 | 1502 | perfil | Anexo C | sin cambio |  |
| R-CAT-LIN-1 | 1506 | perfil | Anexo C | sin cambio |  |
| R-CAT-LIN-2 | 1507 | perfil | Anexo C | sin cambio |  |
| R-CAT-EQ-1 | 1511 | perfil | Anexo C | sin cambio |  |
| R-CAT-EQ-2 | 1512 | perfil | Anexo C | sin cambio |  |
| R-CAT-EQ-3 | 1513 | perfil | Anexo C | sin cambio |  |
| R-CAT-COMP-1 | 1517 | perfil | Anexo C | sin cambio |  |
| R-CAT-COMP-2 | 1518 | perfil | Anexo C | sin cambio |  |
| R-CAT-COMP-3 | 1519 | perfil | Anexo C | sin cambio |  |
| — | 1523 | perfil | Anexo C | sin cambio |  |
| R-COSA-4 |  | canon | §2.1 | nueva | 7.3.2 |
| R-OBJ-8 |  | canon | §2.2 | nueva | 7.1.1 |
| R-INS-7 |  | canon | §2.7 | nueva | 10.3.5.2, 3.29 |
| D14 |  | canon | §4.4 | nueva | A.4.4.4 |
| D15 |  | canon | §4.4 | nueva | A.4.4.4 |
| D16 |  | canon | §4.4 | nueva | A.4.4.4 |
| D17 |  | canon | §4.4 | nueva | A.4.4.4, C.6.2 |
| D18 |  | canon | §4.4 | nueva | A.4.4.3 |
| D19 |  | canon | §4.4 | nueva | A.4.4.2 |
| RF2c |  | canon | §4.10 | nueva | 10.3.3.1 |
| RF3c |  | canon | §4.10 | nueva | 10.3.4.1, A.4.6.5 |
| RF5 |  | canon | §4.10 | nueva | 10.4.1 |
| R-OPL-SE-6 |  | canon | §4.10 | nueva | 10.4.2.1, 10.4.2.7, 10.4.2.8 |
| CX9 |  | canon | §4.11 | nueva | 14.2.2.6.1.4 |
| CX10 |  | canon | §4.11 | nueva | A.4.7.2 |
| CX11 |  | canon | §4.11 | nueva | A.4.7.4 |
| CX12 |  | canon | §4.11 | nueva | A.4.7.4, 14.2.2.2 |
| CX13 |  | canon | §4.11 | nueva | A.4.7.4, 14.2.1.3 |
| R-ATR-7 |  | canon | §4.13 | nueva | 11.3 |
| R-RES-2 |  | canon | §5.2 | nueva | 9.3.2 |
| R-INV-3 |  | canon | §5.4 | nueva | 14.2.2.1 |
| R-STRF-5 |  | canon | §5.5 | nueva | 10.3.2, 10.3.3.1, 10.3.4.1 |
| R-STRE-2 |  | canon | §5.6 | nueva | 10.4.1, 10.4.2.1, Tabla 15 |
| R-FUERZA-5 |  | canon | §6.5 | nueva | 14.2.4.3 |
| R-MULT-4 |  | canon | §6.7 | nueva | 11.1 |
| R-PROB-2 |  | canon | §6.8 | nueva | 12.7 |
| R-PROB-3 |  | canon | §6.8 | nueva | 12.7 |
| R-REF-MEC-2 |  | canon | §8.1 | nueva | 14.2.1.2 |
| R-DIST-2 |  | canon | §8.5 | nueva | 14.2.2.4.1 |
| R-DIST-3 |  | canon | §8.5 | nueva | 14.2.2.4.1 |
| R-DIST-4 |  | canon | §8.5 | nueva | 14.2.2.4 |
| R-OPL-TOTAL-6 |  | canon | §8.10 | nueva | 14.2.2.6.2, Tabla 26, 14.2.2.6.1.4 |

### Reglas nuevas (hechos ISO que faltaban)

| ID | Sección | Tema | ISO |
|---|---|---|---|
| R-COSA-4 | §2.1 | Prueba objeto-proceso | 7.3.2 |
| R-OBJ-8 | §2.2 | Persistencia temporal del objeto | 7.1.1 |
| R-INS-7 | §2.7 | Clase de proceso e instancia de proceso | 10.3.5.2, 3.29 |
| D14 | §4.4 | Objeto con un único estado | A.4.4.4 |
| D15 | §4.4 | Varios estados iniciales | A.4.4.4 |
| D16 | §4.4 | Varios estados finales | A.4.4.4 |
| D17 | §4.4 | Oración combinada de estados | A.4.4.4, C.6.2 |
| D18 | §4.4 | Descripción de tipo | A.4.4.3 |
| D19 | §4.4 | Propiedades genéricas combinadas | A.4.4.2 |
| RF2c | §4.10 | Exhibición de exhibidor proceso | 10.3.3.1 |
| RF3c | §4.10 | Especialización de estado | 10.3.4.1, A.4.6.5 |
| RF5 | §4.10 | Caracterización con estado especificado | 10.4.1 |
| R-OPL-SE-6 | §4.10 | Estructurales con estado sin etiqueta | 10.4.2.1, 10.4.2.7, 10.4.2.8 |
| CX9 | §4.11 | Refinamiento entre OPD por despliegue | 14.2.2.6.1.4 |
| CX10 | §4.11 | Despliegues tipados con OPD padre e hijo | A.4.7.2 |
| CX11 | §4.11 | Descomposición en nuevo OPD | A.4.7.4 |
| CX12 | §4.11 | Descomposición mixta secuencial-paralela | A.4.7.4, 14.2.2.2 |
| CX13 | §4.11 | Descomposición de objetos | A.4.7.4, 14.2.1.3 |
| R-ATR-7 | §4.13 | Rango de valor de atributo | 11.3 |
| R-RES-2 | §5.2 | Resultado a lo largo del tiempo | 9.3.2 |
| R-INV-3 | §5.4 | Precondición de cada subproceso y retorno del control | 14.2.2.1 |
| R-STRF-5 | §5.5 | Colección incompleta | 10.3.2, 10.3.3.1, 10.3.4.1 |
| R-STRE-2 | §5.6 | Validez de los estructurales con estado (corrige el gate Firma) | 10.4.1, 10.4.2.1, Tabla 15 |
| R-FUERZA-5 | §6.5 | Precedencia de enlaces con estado especificado | 14.2.4.3 |
| R-MULT-4 | §6.7 | Multiplicidad por defecto, formas y rangos cerrados | 11.1 |
| R-PROB-2 | §6.8 | Probabilidad con estado inicial | 12.7 |
| R-PROB-3 | §6.8 | OPL del abanico probabilístico | 12.7 |
| R-REF-MEC-2 | §8.1 | Despliegue en el diagrama, en diagrama nuevo y parcial | 14.2.1.2 |
| R-DIST-2 | §8.5 | Habilitador en el contorno | 14.2.2.4.1 |
| R-DIST-3 | §8.5 | Anclaje por defecto de consumo y resultado al primer subproceso (default de producto: perfil §8.5) | 14.2.2.4.1 |
| R-DIST-4 | §8.5 | Instancias operacionales al distribuir | 14.2.2.4 |
| R-OPL-TOTAL-6 | §8.10 | Forma del OPL del sistema completo | 14.2.2.6.2, Tabla 26, 14.2.2.6.1.4 |

## spec-forja-opd-es 1.4.0 → 2.0.0

Perfil: `perfil/opd-opforja.md`. Entradas: canon 154, fusionada 12, perfil 247; nuevas 6.

### Secciones

| Sección | Título | Destino |
|---|---|---|
| Definición | Definición | ambos |
| Definiciones | Definiciones | ambos |
| Precedencia | Precedencia | ambos |
| Convenciones | Convenciones | ambos |
| §1 | Regla rectora: canonicidad por persistencia en export | perfil |
| §2 | Cosas: las ocho representaciones | ambos |
| §2.1 | Producto cartesiano canónico | ambos |
| §2.2 | Realización opforja | perfil |
| §3 | Estados y designaciones | ambos |
| §3.1 | Glifo y contención | ambos |
| §3.2 | Designaciones persistentes | ambos |
| §3.3 | Supresión de estados | ambos |
| §4 | Enlaces transformadores | ambos |
| §4.1 | Familia y direcciones | ambos |
| §4.2 | Variantes con estado especificado | ambos |
| §5 | Enlaces habilitadores | ambos |
| §6 | Modificadores de control, excepciones y operadores lógicos | ambos |
| §6.1 | Marcas de control `e` / `c` / `¬` | ambos |
| §6.2 | Excepciones temporales | ambos |
| §6.3 | Operadores lógicos AND / XOR / OR | ambos |
| §6.4 | Etiquetas de ruta y escenarios | ambos |
| §7 | Enlaces estructurales | ambos |
| §7.1 | Relaciones fundamentales: topología interna del triángulo | ambos |
| §7.2 | Estructurales etiquetados (tagged) | ambos |
| §7.3 | Semi-plegado | ambos |
| §8 | Invocación, tiempo y duración | ambos |
| §8.1 | Invocación | ambos |
| §8.2 | Duración | ambos |
| §9 | Multiplicidad y cardinalidad | ambos |
| §10 | Refinamiento y gestión de contexto | ambos |
| §10.1 | Los cuatro pares refinamiento↔abstracción | ambos |
| §10.2 | Distribución y escisión de enlaces | ambos |
| §10.3 | Precedencia de recomposición | canon |
| §10.4 | Árbol de OPDs, identidad y categorías | ambos |
| §11 | Layout y routing | ambos |
| §12 | Composición del OPD y rotulado | ambos |
| §13 | Canvas, modos e interacción | perfil |
| §14 | Interacción OPD↔OPL (lado canvas) | perfil |
| §15 | Edición visual | ambos |
| §16 | Configuración que afecta al OPD | perfil |
| §17 | Fallos, validación y marcas de diagnóstico | perfil |
| §18 | Catálogo formal normativo | perfil |
| §18.1 | Paleta (tokens Codex) | perfil |
| §18.2 | Trazos, dashes y radios | perfil |
| §18.3 | Marcadores (paths literales) | perfil |
| §18.4 | Z-order y tipografía | perfil |
| §19 | Equivalencia bimodal y frontera modal | ambos |
| §20 | Simulación visual | ambos |
| §21 | Exportación canónica | perfil |
| §22 | Trazabilidad y gaps | perfil |
| §22.1 | Tabla maestra | perfil |
| §22.2 | Índice de GAPs | perfil |
| §22.3 | Cobertura inversa | perfil |
| §23 | Invariantes | ambos |
| §23.1 | Invariantes prescriptivos del documento | perfil |
| §23.2 | Invariantes visuales del dominio | ambos |
| §24 | Validación | perfil |
| §25 | Migración | perfil |
| §25.1 | Qué cambia | perfil |
| §25.2 | Qué migrar | perfil |
| §25.3 | Qué se deprecia | perfil |
| Apéndice A | Mapa de cobertura contra opd-es (V-0..V-263) | perfil |
| Apéndice B | Ejemplo end-to-end (visual) | canon |
| Apéndice C | Índice de IDs de esta spec | perfil |

### Reglas

| ID | Línea 1.x | Destino | Sección 2.0 | Cambio | ISO |
|---|---|---|---|---|---|
| — | 30 | perfil | Definición | sin cambio |  |
| — | 36 | canon | Definiciones | sin cambio | 7.3.1, 7.1.2, 7.2.2 |
| — | 37 | canon | Definiciones | sin cambio | 7.3.5.2 |
| — | 38 | canon | Definiciones | sin cambio | 4, 9.5.1, 9.5.2.5, 12.2 |
| — | 39 | canon | Definiciones | sin cambio | 9.4.1, 9.4.2 |
| — | 41 | canon | Definiciones | sin cambio | C.3 |
| — | 42 | canon | Definiciones | corregida: Abanico: ≥2 enlaces procedimentales del mismo tipo con un punto común en la misma cosa, con semántica XOR u OR; el extremo común es el extremo convergente (12.2). Los enlaces AND no forman abanico (12.1); en abanicos de efecto se distingue por múltiples objetos o múltiples procesos (Tabla 19). | 12.1, 12.2, Tabla 19 |
| — | 43 | canon | Definiciones | corregida: el sombreado como símbolo de la esencia física se marca [informativo] (ISO §4, Figura C.10) | 7.3.3, 4, C.4 |
| — | 44 | canon | Definiciones | corregida: contorno discontinuo marcado [informativo]; la afiliación por defecto se cita en ISO §7.3.4 | 7.3.3, 7.3.4, C.4 |
| — | 45 | canon | Definiciones | corregida: perseverancia estática/dinámica (términos de ISO §7.3.3) | 7.3.3 |
| — | 46 | canon | Definiciones | corregida: término «conjunto de objetos previo al proceso» con Pre(P) como notación | 9.5.1, 3.54 |
| — | 47 | canon | Definiciones | corregida: «refinador» → «refinado» (contrato de términos) | 3.61, 3.62, 3.35 |
| — | 48 | canon | Definiciones | sin cambio | 14.2.1.3 |
| — | 49 | perfil | Definiciones | sin cambio | B.4 |
| — | 50 | perfil | Definiciones | sin cambio | B.4 |
| — | 63 | perfil | Precedencia | sin cambio |  |
| — | 67 | perfil | Precedencia | sin cambio |  |
| — | 79 | perfil | Convenciones | sin cambio |  |
| — | 83 | perfil | Convenciones | sin cambio |  |
| — | 87 | perfil | Convenciones | sin cambio |  |
| — | 95 | perfil | Convenciones | sin cambio |  |
| — | 103 | perfil | Convenciones | sin cambio |  |
| — | 111 | perfil | Convenciones | sin cambio |  |
| — | 131 | canon | §2.1 | corregida: marcado [informativo] (Figuras C.10–C.11) | 7.3.3, 4, C.4 |
| — | 135 | canon | §2.1 | sin cambio | 7.1.2, 7.2.2 |
| — | 136 | canon | §2.1 | corregida: «profundidad» → «sombreado»; marcado [informativo] | C.4, 4 |
| — | 137 | canon | §2.1 | corregida: marcado [informativo] | C.4, 4 |
| R-OPD-COSA-1 | 139 | canon | §2.1 | sin cambio | 7.3.1, 7.3.3 |
| R-OPD-COSA-2 | 140 | canon | §2.1 | corregida: esencia por defecto «no verificable»; se añade la esencia primaria (ISO §7.3.4, §3.55); el preset pasa al perfil | 7.3.4, 3.55 |
| R-OPD-COSA-3 | 141 | canon | §2.1 | corregida: [informativo] con DEBERÍA; supresión de sombras de UI y reforzadores al perfil | C.4, 4 |
| R-OPD-COSA-4 | 142 | canon | §2.1 | sin cambio | 14.2.3, B.4 |
| R-OPD-COSA-5 | 143 | perfil | §2.1 | sin cambio |  |
| — | 145 | canon | §2.1 | corregida: ejemplo [informativo] (Figura C.11) | C.4 |
| R-OPD-COSA-7 | 163 | canon | §2.1 | sin cambio (se mueve a §2.1; cita R-PROC-4) | 3.68, 7.3.5.2 |
| — | 167 | perfil | §2.2 | sin cambio |  |
| — | 167 | perfil | §2.2 | sin cambio | 6.1.5, 14.1 |
| — | 169 | canon | §2.1 | corregida: cita ISO §6.2.1 y §A.4.4.2 | 6.2.1, A.4.4.2 |
| R-OPD-EST-1 | 175 | canon | §3.1 | corregida: sin «región inferior» ni bloqueo de editor (al perfil) | 7.3.5.2, 3.68 |
| R-OPD-EST-2 | 176 | perfil | §3.1 | sin cambio; [endurecimiento] |  |
| R-OPD-EST-3 | 177 | fusionada→ R-EFE-1 | §3.1 | corregida: remisión a R-EFE-1; la restricción del editor pasa al perfil | 3.2 |
| R-OPD-EST-4 | 178 | canon | §3.1 | sin cambio | 7.3.5.5, 10.3.3.2, 11.3 |
| — | 186 | canon | §3.2 | sin cambio | 7.3.5.4, A.4.4.4 |
| — | 187 | canon | §3.2 | sin cambio | 7.3.5.4, A.4.4.4 |
| — | 188 | canon | §3.2 | corregida: «abierta» y «entrante» quedan no verificables (figura ausente) | 7.3.5.4, A.4.4.4 |
| — | 189 | perfil | §3.2 | sin cambio | C.4 |
| — | 190 | canon | §3.2 | sin cambio | 7.3.5.2 |
| R-OPD-EST-5 | 192 | canon | §3.2 | corregida: [informativo] PUEDE; doble marca no verificable; el anti-patrón de duplicar estados pasa al perfil | 14.2.2.6, 14.2.1.3 |
| R-OPD-EST-5 | 192 | perfil | §3.2 | corregida: «cosa-estado» → «estado» |  |
| R-OPD-EST-7 | 194 | canon | §3.2 | corregida: forma de la punta no verificable; el glifo vigente pasa al perfil | 7.3.5.4 |
| R-OPD-EST-8 | 198 | canon | §3.3 | corregida: supresión por OPD según ISO §14.2.1.1; los niveles global/local pasan al perfil | 14.2.1.1 |
| R-OPD-EST-9 | 199 | canon | §3.3 | corregida: Cuando un objeto muestra un subconjunto propio de sus estados (al menos uno, no todos), DEBE exhibir en su esquina inferior derecha el símbolo de supresión: un estado pequeño con elipsis. | 14.2.1.1 |
| R-OPD-EST-10 | 200 | perfil | §3.3 | sin cambio |  |
| — | 204 | canon | §3.3 | se integra en R-OPD-EST-9 con «, y otros estados» (A.4.4.4) | 14.2.1.1, A.4.4.4 |
| — | 210 | canon | §4.1 | corregida: taxonomía ISO (procedimentales: transformadores, habilitadores, de control; estructurales); se elimina la excepción como «familia autónoma» y el conteo de seis familias, que contradicen ISO §9.5.1 | 8.1.1, 9.5.1, 9.5.2.5, 10.1 |
| — | 214 | canon | §4.1 | sin cambio | 9.5.2.1, 9.3.1 |
| — | 215 | canon | §4.1 | sin cambio | 9.3.2 |
| — | 216 | canon | §4.1 | corregida: Efecto básico: flecha bidireccional con puntas cerradas. Efecto entrada-salida: par de flechas de punta cerrada (estado de entrada→proceso, proceso→estado de salida). | 9.5.2.1, 9.3.3.2 |
| — | 217 | canon | §4.1 | corregida: Efecto especificado en entrada: par de flechas, del estado de entrada al proceso y del proceso al objeto sin estado. Efecto especificado en salida: del objeto sin estado al proceso y del proceso al estado de salida. | 9.3.3.3, 9.3.3.4, Tabla 3 |
| R-OPD-TR-1 | 219 | canon | §4.1 | corregida: la geometría swallowtail pasa al perfil | 9.3, 9.5.2.5 |
| R-OPD-TR-2 | 220 | canon | §4.1 | sin cambio | 9.1.5 |
| R-OPD-TR-3 | 221 | fusionada→ R-RES-1 | §4.1 | corregida: modalidad DEBERÍA (ISO §9.3.2); la definición única es R-RES-1 | 9.3.2 |
| R-OPD-TR-4 | 222 | fusionada→ R-EFE-3 | §4.1 | corregida: remisión a la regla dueña de reglas | 9.3.3.3 |
| R-OPD-TR-5 | 223 | fusionada→ R-ROL-UNIC-1 | §4.1 | corregida: remisión a R-ROL-UNIC-1; en recomposición rige R-OPD-REF-13 (ISO §14.2.4.2) | 8.1.2, 14.2.3, 14.2.4.2 |
| R-OPD-TR-8 | 224 | fusionada→ R-PROC-2 | §4.1 | corregida: remisión a la regla dueña de reglas | 7.2.1, 7.3.2, 6.2.3 |
| R-OPD-TR-8 | 224 | perfil | §4.1 | sin cambio; [extensión] (proceso persistente: contradice ISO §3.50) |  |
| R-OPD-TR-6 | 228 | canon | §4.2 | corregida: El extremo con estado especificado se ancla al rountangle; en efectos especificados en entrada o salida, el otro enlace del par se ancla al objeto. | 8.1.3, 9.3.1, 9.3.2, 9.3.3 |
| R-OPD-TR-7 | 229 | canon | §4.2 | corregida: asignación temporalmente factible (par en un subproceso o escindido); ninguna mitad escindida lleva e/c (Tabla 25 NOTE 1, ISO §9.5.1); la exclusividad de la escisión pasa al perfil como [endurecimiento] | 14.2.2.4.3 |
| R-OPD-TR-7 | 229 | perfil | §4.2 | sin cambio; [endurecimiento] | 14.2.2.4.3 |
| R-OPD-TR-7 | 229 | canon | §4.2 | corregida: por resolución del contrato ninguna mitad escindida lleva e/c (Tabla 25 NOTE 1; ISO §9.5.1); queda en canon R-OPD-TR-7 | 9.5.2.3 |
| — | 233 | perfil | §4.2 | sin cambio | 14.2.4.3, 14.2.3 |
| — | 235 | canon | §4.2 | sin cambio | 9.1.2, 9.1.3, 9.1.4, Tabla 3 |
| — | 241 | canon | §5 | sin cambio | 9.2.2, Tabla 2, 9.4.1 |
| — | 242 | canon | §5 | sin cambio | 9.2.3, Tabla 2, 9.4.2 |
| R-OPD-HAB-1 | 244 | fusionada→ R-AG-1A | §5 | corregida: remisión a la regla dueña de reglas | 9.2.2, 9.2.3 |
| R-OPD-HAB-2 | 245 | canon | §5 | corregida: handles y anclas de UI pasan al perfil | 9.4.1, 9.4.2 |
| R-OPD-HAB-3 | 246 | canon | §5 | sin cambio | 9.4.1, 9.4.2 |
| R-OPD-HAB-4 | 247 | fusionada→ R-ROL-UNIC-1 | §5 | corregida: remisión a R-ROL-UNIC-1; el bloqueo de editor pasa al perfil | 8.1.2 |
| R-OPD-HAB-4 | 247 | fusionada→ R-ROL-UNIC-1 | §5 | corregida: remisión a R-ROL-UNIC-1; el bloqueo de editor pasa al perfil | 14.2.4.1 |
| — | 251 | canon | §5 | sin cambio | 9.2.2, 9.2.3, 9.4.1, 9.4.2 |
| R-OPD-CTL-1 | 257 | canon | §6.1 | corregida: e/c son modificadores de control que anotan un enlace transformador o habilitador entrante y lo convierten en enlace de control (3.13); no agregan cosas ni enlaces. | 3.13, 8.1.1, 9.5.1 |
| R-OPD-CTL-2 | 258 | canon | §6.1 | corregida: «¬» pasa al perfil como [extensión] | 9.5.2.1, 9.5.3.2 |
| R-OPD-CTL-3 | 259 | canon | §6.1 | corregida: el bloqueo de editor pasa al perfil; se añade la mitad escindida a lo prohibido | 9.5.1 |
| R-OPD-CTL-4 | 260 | canon | §6.1 | corregida: se quita el «segmento de retorno»; varios eventos: cada uno inicia la evaluación y el AND recae sobre los objetos (ISO §3.18, §12.1; decisión del dueño) | 9.5.1, 9.5.2.1 |
| — | 269 | canon | §6.2 | sin cambio | 9.5.4.2 |
| — | 270 | canon | §6.2 | sin cambio | 9.5.4.3 |
| R-OPD-CTL-6 | 272 | canon | §6.2 | corregida: decoración del extremo no verificable; la afiliación ambiental del manejador pasa al perfil | 9.5.4.1, 9.5.4.2, 9.5.4.3 |
| R-OPD-CTL-6 | 272 | perfil | §6.2 | sin cambio; [endurecimiento] | 9.5.4 |
| — | 280 | canon | §6.3 | sin cambio | 12.1 |
| — | 281 | canon | §6.3 | sin cambio | 12.2 |
| — | 282 | canon | §6.3 | sin cambio (nota: ISO §12.6 lo llama doble arco punteado) | 12.2, 12.6 |
| R-OPD-CTL-7 | 284 | canon | §6.3 | corregida: foco en el extremo común; en el efecto, varios objetos o varios procesos (Tabla 19); se elimina «agente e instrumento solo admiten divergente» | 12.2, Tabla 19 |
| R-OPD-CTL-7 | 284 | canon | §6.3 | corregida: abanicos de agente e instrumento en ambas direcciones (decisión del dueño; ISO §12.2 Figura 38, §A.4.5.3; nota sobre la Tabla 20) | 12.3, Tabla 20, 12.2, A.4.5.3 |
| R-OPD-CTL-8 | 285 | canon | §6.3 | sin cambio | 12.3, 12.4, 12.5 |
| R-OPD-CTL-8 | 285 | canon | §6.3 | corregida: incoherencia de ISO §12.5 anotada; prevalece ISO §9.5.1 (decisión del dueño) | 9.5.1, 12.5 |
| — | 287 | canon | §6.3 | corregida: el Rationale del ejemplo cita ISO §9.5.1 en lugar del nodo de decisión de AP-10 | 9.5.1, 12.5 |
| R-OPD-CTL-9 | 290 | perfil | §6.3 | sin cambio; [extensión] |  |
| R-OPD-CTL-10 | 291 | canon | §6.3 | corregida: 1/n sólo para el caso de ISO §12.7; el abanico probabilístico es XOR divergente; la realización pasa al perfil | 12.7 |
| R-OPD-CTL-10 | 291 | canon | §6.3 | corregida: 1/n sólo para el caso de ISO §12.7; el abanico probabilístico es XOR divergente; la realización pasa al perfil | 12.7 |
| R-OPD-CTL-11 | 292 | canon | §6.3 | corregida: Resultado simple a objeto con estados ≡ abanico XOR por estado, salvo que haya estado inicial: entonces se crea en él con probabilidad 1.0 (o 1/m entre m iniciales). | 12.7 |
| R-OPD-CTL-12 | 298 | canon | §6.4 | corregida: la coincidencia se funda en ISO §13; «escenario» pasa al perfil como [extensión] | 13 |
| — | 300 | canon | §6.4 | corregida: la realización pasa al perfil | 13 |
| — | 308 | canon | §7.1 | sin cambio | 10.3.2 |
| — | 309 | canon | §7.1 | sin cambio | 10.3.3.1 |
| — | 310 | canon | §7.1 | sin cambio | 10.3.4.1 |
| — | 311 | canon | §7.1 | sin cambio | 10.3.5.1 |
| R-OPD-STR-1 | 313 | canon | §7.1 | corregida: importación de símbolos pasa al perfil | 10.3.2, 10.3.3.1, 10.3.4.1, 10.3.5.1 |
| R-OPD-STR-2 | 314 | canon | §7.1 | corregida: triángulos auxiliares de edición pasan al perfil | 10.3.2 |
| R-OPD-STR-3 | 315 | canon | §7.1 | corregida: cita R-STRF-1 y R-STRF-2 como reglas de validez | 10.1, 10.3.1, 10.3.3.1 |
| R-OPD-STR-4 | 316 | canon | §7.1 | corregida: barra que cruza la línea vertical bajo el triángulo; el GAP pasa al perfil | 10.3.2, 10.3.3.1, 10.3.4.1, 10.3.5.1 |
| R-OPD-STR-6 | 318 | canon | §7.1 | corregida: Los elementos heredables (partes, rasgos, enlaces etiquetados y procedimentales) aplican a la especialización por herencia aunque no se dibujen en ella. | 10.3.4.2, 10.3.4.3 |
| R-OPD-STR-13 | 319 | perfil | §7.1 | sin cambio; [extensión] |  |
| — | 329 | canon | §7.2 | sin cambio | 10.2.1 |
| — | 330 | canon | §7.2 | sin cambio | 10.2.2 |
| — | 331 | canon | §7.2 | sin cambio; la alineación de etiquetas se añade como R-OPD-STR-15 | 10.2.3 |
| — | 332 | canon | §7.2 | sin cambio | 10.2.4 |
| R-OPD-STR-7 | 334 | fusionada→ R-STRE-1 | §7.2 | corregida: remisión a la regla dueña de reglas | 10.2.3, 10.2.4 |
| R-OPD-STR-8 | 335 | perfil | §7.2 | sin cambio | 10.2.1 |
| R-OPD-STR-9 | 336 | canon | §7.2 | corregida: Estructurales etiquetados con estado: siete clases (10.4.2.1); en bidireccional y recíproco el estado puede ir en un extremo cualquiera o en ambos. | 10.4.2.1, 10.4.2.5, 10.4.2.7 |
| R-OPD-STR-10 | 337 | perfil | §7.2 | sin cambio; [extensión] | 10.1 |
| R-OPD-STR-10 | 337 | perfil | §7.2 | sin cambio; [extensión] |  |
| R-OPD-STR-10 | 337 | perfil | §7.2 | sin cambio; [extensión] |  |
| R-OPD-STR-11 | 343 | perfil | §7.3 | sin cambio; [extensión] | 14.2.1.2 |
| R-OPD-STR-12 | 344 | perfil | §7.3 | corregida: presentación de producto, no hecho del modelo; [extensión] | 6.2.1 |
| — | 346 | perfil | §7.3 | sin cambio |  |
| — | 348 | canon | §7.3 | corregida: el plegado parcial emite «y al menos otro/otra …» (ISO §A.4.6.3); el semi-plegado pasa al perfil | 14.2.1.2, A.4.6.3, 6.2.1 |
| R-OPD-INV-1 | 354 | canon | §8.1 | corregida: la invocación es enlace de evento (ISO §9.5.2.5), no familia autónoma | 9.5.2.5 |
| R-OPD-INV-1 | 354 | canon | §8.1 | corregida: la invocación es enlace de evento (ISO §9.5.2.5), no familia autónoma | 9.5.2.5, 9.5.1 |
| R-OPD-INV-2 | 355 | canon | §8.1 | corregida: tolerancia según ISO §14.2.2.2; se quita la cita a «figuras ISO 1087-1112» | 14.2.2.1, 14.2.2.2 |
| R-OPD-INV-3 | 356 | canon | §8.1 | corregida: El refinamiento asíncrono DEBE modelarse con despliegue de agregación (no con in-zoom), con un enlace de evento por subproceso. | 14.2.2.5, 14.2.2.4.2 |
| R-OPD-INV-4 | 357 | canon | §8.1 | corregida: se conserva como [informativo] (ISO §9.5.2.5.1 NOTE 2) por la regla de contenido informativo del contrato; el patrón bucle pasa al perfil | 9.5.4.3, D.4 |
| R-OPD-INV-9 | 359 | perfil | §8.1 | sin cambio; [extensión] por decisión del dueño (el orden lo da la posición vertical, ISO §14.2.2.1–§14.2.2.2, §D.4) | 14.2.2.1, 14.2.1.3, D.4 |
| R-OPD-INV-6 | 365 | canon | §8.2 | corregida: remite a R-EXC-4/R-EXC-5; forma compacta [informativo] (ISO §D.7) | 9.5.4.1, D.7 |
| R-OPD-INV-6 | 365 | perfil | §8.2 | sin cambio | D.7 |
| R-OPD-INV-6 | 365 | perfil | §8.2 | sin cambio | D.7 |
| R-OPD-INV-8 | 367 | canon | §8.2 | corregida: marcado [informativo] | D.5 |
| — | 373 | canon | §9 | sin cambio | 11.1 |
| — | 374 | canon | §9 | sin cambio | 11.1 |
| — | 375 | canon | §9 | sin cambio | 11.1 |
| — | 376 | canon | §9 | sin cambio | 11.1 |
| R-OPD-MUL-1 | 378 | canon | §9 | sin cambio | 11.1, 11.2 |
| R-OPD-MUL-2 | 379 | canon | §9 | corregida: Rangos cerrados qmín..qmáx; conjuntos de rangos separados por coma; 0..* como extremo abierto. | 11.1 |
| R-OPD-MUL-2 | 379 | canon | §9 | sin cambio | 11.1, 11.2 |
| R-OPD-MUL-3 | 380 | canon | §9 | corregida: Las restricciones gráficas usan =, ≠, <, ≤, ≥, {…} e «in» (∈); una superficie ASCII es representación de herramienta. | 11.2 |
| R-OPD-MUL-4 | 381 | canon | §9 | corregida: la cláusula de simulación pasa al perfil | 13, 3.60 |
| R-OPD-MUL-5 | 382 | canon | §9 | corregida: La tasa de consumo o generación es propiedad del enlace (con atributo de cantidad en el objeto); sin ella la transformación es inmediata. | 9.3.1, 9.3.2 |
| — | 386 | canon | §9 | corregida: frases OPL [localización], 2..* «al menos dos» (decisión del dueño), sede en spec-OPL §10.1 | 11.1 |
| — | 394 | canon | §10.1 | corregida: tres pares (ISO §14.2.1) | 14.2.1, 14.2.1.1 |
| — | 395 | canon | §10.1 | sin cambio | 14.2.1.2, 3.22, 14.2.2.5 |
| — | 396 | canon | §10.1 | sin cambio | 14.2.1.3, 14.2.2.5 |
| — | 397 | perfil | §10.1 | sin cambio; [extensión] fuera de la lista cerrada de ISO §14.2.1 | 14.2.1 |
| R-OPD-REF-1 | 399 | canon | §10.1 | corregida: El refinable se agranda en el in-zoom (intra o nuevo diagrama); el contorno grueso en padre e hijo corresponde sólo a in-zoom y despliegue en nuevo diagrama. | 14.2.1.2, 14.2.1.3 |
| R-OPD-REF-2 | 400 | canon | §10.1 | corregida: sin R-IDP-0A; el orden lo da la posición vertical (decisión del dueño) | 14.2.1.3, 14.2.2.1, D.4 |
| R-OPD-REF-3 | 401 | canon | §10.1 | corregida: se conserva como [informativo] (ISO §C.5.1, Figuras C.19–C.20) por la regla de contenido informativo del contrato | C.5 |
| R-OPD-REF-4 | 402 | perfil | §10.1 | sin cambio | 14.2.1.3 |
| R-OPD-REF-6 | 404 | perfil | §10.1 | corregida: los procedimentales al contenedor se dibujan al contorno (canon R-OPD-REF-11) | 14.2.1.3 |
| R-OPD-REF-7 | 405 | perfil | §10.1 | sin cambio; [endurecimiento] | 10.3.1, 10.3.2 |
| R-OPD-REF-8 | 406 | fusionada→ R-REF-1 | §10.1 | corregida: remisión a la regla dueña de reglas | 3.45, 14.2.2.6.1.1 |
| R-OPD-REF-9 | 407 | canon | §10.1 | corregida: remite a R-REF-4, R-CONSIST-1/2 y R-IMP-1 | 14.2.3 |
| R-OPD-REF-9 | 407 | canon | §10.1 | corregida: remite a R-REF-4, R-CONSIST-1/2 y R-IMP-1 | B.2 |
| — | 414 | canon | §10.2 | sin cambio | 14.2.2.4.1 |
| — | 415 | canon | §10.2 | corregida: por defecto al primer subproceso; el modelador lo reasigna (ISO §14.2.2.4.1) | 14.2.2.4.1 |
| — | 416 | canon | §10.2 | sin cambio | 14.2.2.4.1 |
| — | 417 | canon | §10.2 | corregida: asignación temporalmente factible; las mitades no son TS4/TS5 | 14.2.2.4.3 |
| — | 418 | canon | §10.2 | sin cambio; se añade R-OPD-REF-21 (habilitador al contorno) | 14.2.2.4.1 |
| — | 419 | perfil | §10.2 | sin cambio | 14.2.2.4.1 |
| — | 420 | canon | §10.2 | sin cambio | 14.2.2.4.2 |
| — | 421 | canon | §10.2 | corregida: DEBERÍA modelar la contingencia (ISO §14.2.2.4.2) | 14.2.2.4.2 |
| R-OPD-REF-11 | 423 | canon | §10.2 | corregida: «respaldo temporal» pasa al perfil | 14.2.2.4.1, 14.2.1.2 |
| R-OPD-REF-12 | 424 | canon | §10.2 | sin cambio | 14.2.2.4.2 |
| R-OPD-REF-13 | 428 | canon | §10.3 | corregida: se añade la precedencia por estado especificado (ISO §14.2.4.3) y el orden de doce niveles; matriz de la Tabla 27 conservada como no verificable; se quita la supresión del alcance | 14.2.4.2, 14.2.4.3, 14.2.4.5, Tabla 27 |
| R-OPD-REF-14 | 432 | fusionada→ R-SD-4 | §10.4 | corregida: remisión a la regla dueña de reglas | 14.2.2.6.1.3 |
| R-OPD-REF-14 | 432 | perfil | §10.4 | sin cambio |  |
| R-OPD-REF-14 | 432 | canon | §10.4 | corregida: la raíz SD del árbol se enuncia en R-OPD-REF-15 | 3.45, 14.2.2.6.1.1 |
| R-OPD-REF-14 | 432 | perfil | §10.4 | sin cambio |  |
| R-OPD-REF-15 | 433 | canon | §10.4 | corregida: la identidad persistente pasa al perfil; remite a R-IDP-1 y R-ARB-3 | 14.2.2.6.1.3 |
| R-OPD-REF-16 | 434 | canon | §10.4 | corregida: reducida a ISO §14.2.2.6.1.5; las tres categorías pasan al perfil | 14.2.2.6.1 |
| R-OPD-REF-17 | 435 | canon | §10.4 | corregida: [informativo] PUEDE (ISO §B.4, §B.5); «instancia visual» → «aparición» | B.4, 14.2.3, 7.3.1 |
| R-OPD-REF-17 | 435 | canon | §10.4 | corregida: [informativo] PUEDE (ISO §B.4, §B.5); «instancia visual» → «aparición» | B.5 |
| R-OPD-REF-18 | 436 | canon | §10.4 | corregida: reducida a ISO §6.2.1 y §14.2.2.6.2; sub-modelos pasan al perfil | 14.2.2.6, 6.2.1 |
| — | 472 | canon | §10.4 | corregida: el estado del parser pasa al perfil | 14.2.1.2, 14.2.1.3, 14.2.2.6.1.4 |
| R-OPD-LAY-1 | 476 | canon | §11 | corregida: se conserva la parte de ISO §B.3 como [informativo] con DEBERÍA; el re-ruteo de export pasa al perfil | B.3 |
| R-OPD-LAY-2 | 477 | canon | §11 | corregida: NO DEBERÍA [informativo] (ISO §B.3); el gate de export pasa al perfil como [endurecimiento] | B.3 |
| R-OPD-ROT-1 | 489 | canon | §12 | corregida: el negro en canon-diagrama pasa al perfil | 7.1.2, 7.2.2 |
| R-OPD-ROT-2 | 490 | perfil | §12 | sin cambio | 7.3.5.5, D.5, D.7 |
| R-OPD-ROT-3 | 491 | perfil | §12 | sin cambio | B.6 |
| R-OPD-ROT-4 | 492 | canon | §12 | corregida: marcado [informativo] | 10.3.5.1 |
| R-OPD-ROT-6 | 494 | perfil | §12 | corregida: «sexta familia» → «clase de enlace no definida por ISO 19450»; [extensión] |  |
| R-OPD-EDIT-2 | 519 | canon | §15 | corregida: OPL canónico, no necesariamente el mostrado; estilo autoral y cambio de tipo pasan al perfil | 6.2.1 |
| R-OPD-EDIT-5 | 522 | canon | §15 | corregida: consumo y resultado al primer subproceso (ISO §14.2.2.4.1); se elimina «resultado al último» | 14.2.2.4.1 |
| R-OPD-CFG-4 | 531 | perfil | §16 | sin cambio; la esencia primaria de ISO pasa a R-OPD-COSA-2 | 7.3.4, 3.55 |
| R-OPD-VAL-4 | 538 | perfil | §17 | sin cambio |  |
| AP-01/02 | 543 | perfil | §17 | sin cambio | 9.5.1 |
| AP-03 | 544 | perfil | §17 | sin cambio | 9.5.1, 12.5 |
| AP-04 | 545 | perfil | §17 | sin cambio | 9.3.2 |
| AP-05 | 546 | perfil | §17 | sin cambio | 9.2.2 |
| AP-06 | 547 | perfil | §17 | sin cambio | 14.2.2.4.1 |
| AP-07/08 | 548 | perfil | §17 | sin cambio | 14.2.2.4.3, 9.5.2.3 |
| AP-09/10 | 549 | perfil | §17 | sin cambio | 9.5.1 |
| AP-11 | 550 | perfil | §17 | sin cambio | 10.4.2.5 |
| AP-12 | 551 | perfil | §17 | sin cambio | 3.68 |
| AP-13 | 552 | perfil | §17 | sin cambio | 10.3.1 |
| AP-14 | 553 | perfil | §17 | sin cambio |  |
| AP-15 | 554 | perfil | §17 | sin cambio | 7.3.1 |
| AP-16 | 555 | perfil | §17 | sin cambio | 14.2.2.6.1.1 |
| AP-20 | 558 | perfil | §17 | sin cambio | 10.3 |
| AP-21 | 559 | perfil | §17 | sin cambio | 14.2.2.4.2 |
| AP-22 | 560 | perfil | §17 | sin cambio | B.6.2, 14.2.2.6.1.4 |
| AP-25 | 563 | perfil | §17 | sin cambio |  |
| AP-27 | 564 | perfil | §17 | sin cambio | 14.2.2.4.2 |
| AP-30 | 565 | perfil | §17 | sin cambio | Tabla 27 |
| R-OPD-BIM-1 | 628 | canon | §19 | corregida: sin citas V-n; constructo básico [informativo] | 6.2.1, C.3 |
| R-OPD-BIM-3 | 630 | canon | §19 | corregida: la lista de ornamentales pasa al perfil | 6.2.1, 14.2.2.1 |
| R-OPD-BIM-4 | 631 | canon | §19 | corregida: La perseverancia no tiene glifo propio: la porta la forma. Las marcas de ejecución no son hechos del modelo. | 6.2.1, 7.3.3 |
| R-OPD-BIM-5 | 632 | canon | §19 | corregida: Resultado simple ≡ XOR por estados sólo sin estado inicial (12.7). | 12.7, 10.2.4, 14.2.1.1 |
| R-OPD-BIM-6 | 633 | perfil | §19 | sin cambio |  |
| R-OPD-SIM-5 | 641 | canon | §20 | corregida: semántica de instancias operacionales (ISO §14.2.2.4); el límite de bucle pasa al perfil | 14.2.2.4, 9.5.1 |
| R-OPD-SIM-7 | 643 | fusionada→ R-AG-2 | §20 | corregida: remisión a R-AG-2, [informativo] (ISO §9.2.3 EXAMPLE 3) | 9.2.3 |
| R-§23-PRESC-CONS | 749 | perfil | §23.1 | sin cambio |  |
| R-§23-PRESC-AUTO | 750 | perfil | §23.1 | sin cambio |  |
| R-§23-PRESC-CIRC | 751 | perfil | §23.1 | sin cambio |  |
| R-§23-PRESC-LANG | 752 | perfil | §23.1 | sin cambio |  |
| R-§23-OPD-VOCAB | 760 | canon | §23.2 | corregida | 4 |
| R-§23-OPD-TOPO | 761 | perfil | §23.2 | sin cambio |  |
| R-§23-OPD-TIEMPO | 764 | canon | §23.2 | sin cambio | 14.2.1.3, 14.2.2.1, D.4 |
| R-§23-OPD-BIM | 766 | canon | §23.2 | corregida | 6.2.1 |
| — | 856 | canon | Apéndice B | corregida: rehecho según la Figura 53 y la Tabla 26 de ISO, sin colores | 14.2.2.6, Tabla 26 |
| — | 26 | perfil | Definición | sin cambio |  |
| — | 26 | perfil | Definición | sin cambio |  |
| — | 40 | perfil | Definiciones | sin cambio |  |
| — | 51 | perfil | Definiciones | sin cambio |  |
| — | 52 | perfil | Definiciones | sin cambio |  |
| — | 53 | perfil | Definiciones | sin cambio |  |
| — | 54 | perfil | Definiciones | sin cambio |  |
| — | 55 | perfil | Definiciones | sin cambio |  |
| — | 59 | perfil | Precedencia | sin cambio |  |
| — | 61 | perfil | Precedencia | sin cambio |  |
| — | 65 | perfil | Precedencia | sin cambio |  |
| — | 99 | perfil | Convenciones | sin cambio |  |
| — | 107 | perfil | Convenciones | sin cambio |  |
| — | 115 | perfil | §1 | sin cambio |  |
| R-OPD-CAN-1 | 117 | perfil | §1 | sin cambio |  |
| R-OPD-CAN-2 | 118 | perfil | §1 | sin cambio |  |
| R-OPD-CAN-3 | 119 | perfil | §1 | sin cambio |  |
| R-OPD-CAN-4 | 120 | perfil | §1 | sin cambio |  |
| R-OPD-CAN-5 | 121 | perfil | §1 | sin cambio |  |
| — | 153 | perfil | §2.2 | sin cambio |  |
| — | 154 | perfil | §2.2 | sin cambio |  |
| — | 155 | perfil | §2.2 | sin cambio |  |
| — | 156 | perfil | §2.2 | sin cambio |  |
| — | 157 | perfil | §2.2 | sin cambio |  |
| — | 158 | perfil | §2.2 | sin cambio |  |
| — | 159 | perfil | §2.2 | sin cambio |  |
| — | 160 | perfil | §2.2 | sin cambio |  |
| R-OPD-COSA-6 | 162 | perfil | §2.2 | sin cambio |  |
| R-OPD-COSA-8 | 164 | perfil | §2.2 | sin cambio |  |
| R-OPD-COSA-9 | 165 | perfil | §2.2 | sin cambio |  |
| — | 180 | perfil | §3.1 | sin cambio |  |
| R-OPD-EST-6 | 193 | perfil | §3.2 | sin cambio |  |
| — | 202 | perfil | §3.3 | sin cambio |  |
| — | 231 | perfil | §4.2 | sin cambio |  |
| — | 249 | perfil | §5 | sin cambio |  |
| R-OPD-CTL-5 | 261 | perfil | §6.1 | sin cambio |  |
| — | 263 | perfil | §6.1 | sin cambio |  |
| — | 274 | perfil | §6.2 | sin cambio |  |
| — | 294 | perfil | §6.3 | sin cambio |  |
| R-OPD-STR-5 | 317 | perfil | §7.1 | sin cambio |  |
| — | 321 | perfil | §7.1 | sin cambio |  |
| — | 323 | perfil | §7.1 | sin cambio |  |
| — | 339 | perfil | §7.2 | sin cambio |  |
| R-OPD-INV-5 | 358 | perfil | §8.1 | sin cambio |  |
| R-OPD-INV-5 | 358 | perfil | §8.1 | sin cambio |  |
| — | 361 | perfil | §8.1 | sin cambio |  |
| R-OPD-INV-7 | 366 | perfil | §8.2 | sin cambio |  |
| — | 384 | perfil | §9 | sin cambio |  |
| R-OPD-REF-5 | 403 | perfil | §10.1 | sin cambio |  |
| R-OPD-REF-10 | 408 | perfil | §10.1 | sin cambio |  |
| R-OPD-REF-19 | 437 | perfil | §10.4 | sin cambio |  |
| R-OPD-REF-20 | 438 | perfil | §10.4 | sin cambio |  |
| R-OPD-REF-20 | 441 | perfil | §10.4 | sin cambio |  |
| R-OPD-REF-20 | 445 | perfil | §10.4 | sin cambio |  |
| R-OPD-REF-20 | 453 | perfil | §10.4 | sin cambio |  |
| R-OPD-REF-20 | 458 | perfil | §10.4 | sin cambio |  |
| R-OPD-REF-20 | 462 | perfil | §10.4 | sin cambio |  |
| — | 470 | perfil | §10.4 | sin cambio |  |
| R-OPD-LAY-3 | 478 | perfil | §11 | sin cambio |  |
| R-OPD-LAY-4 | 479 | perfil | §11 | sin cambio |  |
| R-OPD-LAY-5 | 480 | perfil | §11 | sin cambio |  |
| R-OPD-LAY-6 | 481 | perfil | §11 | sin cambio |  |
| R-OPD-LAY-7 | 482 | perfil | §11 | sin cambio |  |
| R-OPD-LAY-8 | 483 | perfil | §11 | sin cambio |  |
| R-OPD-LAY-9 | 484 | perfil | §11 | sin cambio |  |
| R-OPD-LAY-10 | 485 | perfil | §11 | sin cambio |  |
| R-OPD-ROT-5 | 493 | perfil | §12 | sin cambio |  |
| R-OPD-ROT-7 | 495 | perfil | §12 | sin cambio |  |
| R-OPD-ROT-7 | 495 | perfil | §12 | sin cambio |  |
| R-OPD-ROT-8 | 496 | perfil | §12 | sin cambio |  |
| R-OPD-ROT-9 | 497 | perfil | §12 | sin cambio |  |
| R-OPD-UI-1 | 501 | perfil | §13 | sin cambio |  |
| R-OPD-UI-2 | 502 | perfil | §13 | sin cambio |  |
| R-OPD-UI-3 | 503 | perfil | §13 | sin cambio |  |
| R-OPD-UI-3 | 503 | perfil | §13 | sin cambio |  |
| R-OPD-UI-4 | 504 | perfil | §13 | sin cambio |  |
| R-OPD-UI-5 | 505 | perfil | §13 | sin cambio |  |
| R-OPD-UI-6 | 506 | perfil | §13 | sin cambio |  |
| R-OPD-INT-1 | 512 | perfil | §14 | sin cambio |  |
| R-OPD-INT-2 | 513 | perfil | §14 | sin cambio |  |
| R-OPD-INT-3 | 514 | perfil | §14 | sin cambio |  |
| R-OPD-EDIT-1 | 518 | perfil | §15 | sin cambio |  |
| R-OPD-EDIT-3 | 520 | perfil | §15 | sin cambio |  |
| R-OPD-EDIT-4 | 521 | perfil | §15 | sin cambio |  |
| R-OPD-EDIT-6 | 523 | perfil | §15 | sin cambio |  |
| R-OPD-EDIT-7 | 524 | perfil | §15 | sin cambio |  |
| R-OPD-CFG-1 | 528 | perfil | §16 | sin cambio |  |
| R-OPD-CFG-2 | 529 | perfil | §16 | sin cambio |  |
| R-OPD-CFG-3 | 530 | perfil | §16 | sin cambio |  |
| R-OPD-VAL-1 | 535 | perfil | §17 | sin cambio |  |
| R-OPD-VAL-2 | 536 | perfil | §17 | sin cambio |  |
| R-OPD-VAL-3 | 537 | perfil | §17 | sin cambio |  |
| R-OPD-VAL-5 | 539 | perfil | §17 | sin cambio |  |
| AP-17 | 556 | perfil | §17 | sin cambio |  |
| AP-19 | 557 | perfil | §17 | sin cambio |  |
| AP-23 | 561 | perfil | §17 | sin cambio |  |
| AP-24 | 562 | perfil | §17 | sin cambio |  |
| R-OPD-VAL-6 | 567 | perfil | §17 | sin cambio |  |
| — | 571 | perfil | §18 | sin cambio |  |
| — | 577 | perfil | §18.1 | sin cambio |  |
| — | 578 | perfil | §18.1 | sin cambio |  |
| — | 579 | perfil | §18.1 | sin cambio |  |
| — | 580 | perfil | §18.1 | sin cambio |  |
| — | 581 | perfil | §18.1 | sin cambio |  |
| — | 582 | perfil | §18.1 | sin cambio |  |
| — | 583 | perfil | §18.1 | sin cambio |  |
| — | 584 | perfil | §18.1 | sin cambio |  |
| — | 585 | perfil | §18.1 | sin cambio |  |
| — | 591 | perfil | §18.2 | sin cambio |  |
| — | 592 | perfil | §18.2 | sin cambio |  |
| — | 593 | perfil | §18.2 | sin cambio |  |
| — | 594 | perfil | §18.2 | sin cambio |  |
| — | 595 | perfil | §18.2 | sin cambio |  |
| — | 596 | perfil | §18.2 | sin cambio |  |
| — | 597 | perfil | §18.2 | sin cambio |  |
| — | 598 | perfil | §18.2 | sin cambio |  |
| — | 599 | perfil | §18.2 | sin cambio |  |
| — | 600 | perfil | §18.2 | sin cambio |  |
| — | 601 | perfil | §18.2 | sin cambio |  |
| — | 607 | perfil | §18.3 | sin cambio |  |
| — | 608 | perfil | §18.3 | sin cambio |  |
| — | 609 | perfil | §18.3 | sin cambio |  |
| — | 610 | perfil | §18.3 | sin cambio |  |
| — | 611 | perfil | §18.3 | sin cambio |  |
| — | 612 | perfil | §18.3 | sin cambio |  |
| — | 613 | perfil | §18.3 | sin cambio |  |
| — | 619 | perfil | §18.4 | sin cambio |  |
| — | 620 | perfil | §18.4 | sin cambio |  |
| — | 621 | perfil | §18.4 | sin cambio |  |
| — | 622 | perfil | §18.4 | sin cambio |  |
| — | 623 | perfil | §18.4 | sin cambio |  |
| — | 624 | perfil | §18.4 | sin cambio |  |
| R-OPD-BIM-2 | 629 | perfil | §19 | sin cambio |  |
| R-OPD-SIM-1 | 637 | perfil | §20 | sin cambio |  |
| R-OPD-SIM-2 | 638 | perfil | §20 | sin cambio |  |
| R-OPD-SIM-3 | 639 | perfil | §20 | sin cambio |  |
| R-OPD-SIM-4 | 640 | perfil | §20 | sin cambio |  |
| R-OPD-SIM-6 | 642 | perfil | §20 | sin cambio |  |
| R-OPD-EXP-1 | 647 | perfil | §21 | sin cambio |  |
| R-OPD-EXP-2 | 648 | perfil | §21 | sin cambio |  |
| R-OPD-EXP-3 | 649 | perfil | §21 | sin cambio |  |
| R-OPD-AUD-1 | 657 | perfil | §22 | sin cambio |  |
| — | 659 | perfil | §22 | sin cambio |  |
| — | 663 | perfil | §22.1 | sin cambio |  |
| — | 721 | perfil | §22.2 | sin cambio |  |
| — | 741 | perfil | §22.3 | sin cambio |  |
| R-§23-PRESC-ENF | 753 | perfil | §23.1 | sin cambio |  |
| R-§23-PRESC-INTEG | 754 | perfil | §23.1 | sin cambio |  |
| R-§23-OPD-CANAL | 762 | perfil | §23.2 | sin cambio |  |
| R-§23-OPD-EXPORT | 763 | perfil | §23.2 | sin cambio |  |
| R-§23-OPD-PROY | 765 | perfil | §23.2 | sin cambio |  |
| — | 770 | perfil | §24 | sin cambio |  |
| — | 774 | perfil | §24 | sin cambio |  |
| — | 775 | perfil | §24 | sin cambio |  |
| — | 776 | perfil | §24 | sin cambio |  |
| — | 777 | perfil | §24 | sin cambio |  |
| — | 778 | perfil | §24 | sin cambio |  |
| — | 779 | perfil | §24 | sin cambio |  |
| — | 780 | perfil | §24 | sin cambio |  |
| — | 781 | perfil | §24 | sin cambio |  |
| — | 782 | perfil | §24 | sin cambio |  |
| R-§24-ENF-1 | 784 | perfil | §24 | sin cambio |  |
| — | 788 | perfil | §25 | sin cambio |  |
| — | 812 | perfil | §25.1 | sin cambio |  |
| — | 813 | perfil | §25.1 | sin cambio |  |
| — | 814 | perfil | §25.1 | sin cambio |  |
| R-§25-MIG-1 | 818 | perfil | §25.2 | sin cambio |  |
| R-§25-MIG-2 | 819 | perfil | §25.2 | sin cambio |  |
| R-§25-MIG-3 | 820 | perfil | §25.2 | sin cambio |  |
| R-§25-DEP-1 | 824 | perfil | §25.3 | sin cambio |  |
| R-§25-DEP-2 | 825 | perfil | §25.3 | sin cambio |  |
| — | 829 | perfil | Apéndice A | sin cambio |  |
| — | 852 | perfil | Apéndice A | sin cambio |  |
| — | 860 | perfil | Apéndice C | sin cambio |  |
| R-OPD-CTL-13 |  | canon | §6.3 | nueva | 12.5, 12.6, Tabla 22, Tabla 23 |
| R-OPD-STR-14 |  | canon | §7.1 | nueva | 10.4.1, Figura 28 |
| R-OPD-STR-15 |  | canon | §7.2 | nueva | 10.2.3, 10.4.2.5, 10.4.2.7 |
| R-OPD-INV-10 |  | canon | §8.1 | nueva | 14.2.2.1, D.4 |
| R-OPD-MUL-6 |  | canon | §9 | nueva | 11.3 |
| R-OPD-REF-21 |  | canon | §10.2 | nueva | 14.2.2.4.1 |
| — | 415 | perfil | §10.2 | sin cambio; [desviación declarada] por decisión del dueño: OpForja ancla por defecto el resultado al último subproceso; el default normativo (canon) es el primero (ISO §14.2.2.4.1, NOTE 2 [informativo]) | 14.2.2.4.1 |
| R-OPD-EDIT-5 | 522 | perfil | §15 | sin cambio; [desviación declarada] por decisión del dueño: OpForja ancla por defecto el resultado al último subproceso; el default normativo (canon) es el primero (ISO §14.2.2.4.1, NOTE 2 [informativo]) | 14.2.2.4.1 |
| — |  | canon | §4.1 | nueva: faltante «Taxonomía de enlaces de control» cubierto en el párrafo de clasificación | 8.1.1, 9.5.1, 9.5.2.5, 9.5.4 |
| — |  | canon | §6.3 | nueva: faltante «Creación en el estado inicial» cubierto dentro de R-OPD-CTL-11 | 12.7 |
| — |  | canon | §8.1 | nueva: faltante «Refinamiento síncrono y asíncrono» cubierto dentro de R-OPD-INV-3 | 14.2.2.5 |
| — |  | canon | §10.3 | nueva: faltante «Precedencia por estado especificado» cubierto dentro de R-OPD-REF-13 | 14.2.4.3 |
| — |  | canon | §2.1 | nueva: faltante «Esencia primaria del sistema» cubierto dentro de R-OPD-COSA-2 | 7.3.4, 3.55 |

### Reglas nuevas (hechos ISO que faltaban)

| ID | Sección | Tema | ISO |
|---|---|---|---|
| R-OPD-CTL-13 | §6.3 | Abanicos con modificador de control (evento y condición), con estado salvo el de efecto, y contraparte OR | 12.5, 12.6, Tabla 22, Tabla 23 |
| R-OPD-STR-14 | §7.1 | Enlace de caracterización con estado especificado | 10.4.1, Figura 28 |
| R-OPD-STR-15 | §7.2 | Alineación de etiquetas del lado del arpón en el bidireccional; una etiqueta alineada en el recíproco | 10.2.3, 10.4.2.5, 10.4.2.7 |
| R-OPD-INV-10 | §8.1 | Entrada y salida del control en el contexto de descomposición; Exception Exiting [informativo] | 14.2.2.1, D.4 |
| R-OPD-MUL-6 | §9 | Restricción de valor de atributo junto al extremo del atributo, distinta de la multiplicidad | 11.3 |
| R-OPD-REF-21 | §10.2 | Habilitador anclado al contorno: conecta con al menos un subproceso | 14.2.2.4.1 |

## spec-forja-opl-es 1.4.1 → 2.0.0

Perfil: `perfil/opl-opforja.md`. Entradas: canon 443, eliminada-duplicada 20, fusionada 41, perfil 454; nuevas 22.

### Secciones

| Sección | Título | Destino |
|---|---|---|
| Definición | Definición | ambos |
| Definiciones | Definiciones | ambos |
| Precedencia | de fuentes | ambos |
| Convenciones | Convenciones | ambos |
| §1 | Vocabulario fijo de verbos y cópulas | ambos |
| §1.1 | Enum de verbos y cópulas | ambos |
| §1.2 | Reglas duras de `puede estar` vs `puede ser` | canon |
| §1.3 | Palabras clave y conectores fijos | canon |
| §1.4 | Divergencias entre fuentes canónicas | canon |
| §2 | Entidades | ambos |
| §2.0 | Reglas duras transversales | ambos |
| §2.1 | Objeto | ambos |
| §2.2 | Proceso | ambos |
| §2.3 | Estado y enumeración de estados | ambos |
| §2.4 | Designación de estado | ambos |
| §2.5 | Atributo y valor | ambos |
| §2.6 | Instancia | ambos |
| §2.7 | Esencia (física / informacional) | ambos |
| §2.8 | Afiliación (sistémica / ambiental) | ambos |
| §3 | Enlaces transformadores | ambos |
| §3.0 | Asimetría consumo / resultado bajo modificadores | ambos |
| §3.1 | Consumo (T1, TS1) | ambos |
| §3.2 | Resultado (T2, TS2) | ambos |
| §3.3 | Efecto (T3) | ambos |
| §3.4 | Efecto entrada-salida (TS3) | ambos |
| §3.5 | Efecto escindido / parcial — solo entrada (TS4) | ambos |
| §3.6 | Efecto escindido / parcial — solo salida (TS5) | ambos |
| §4 | Enlaces habilitadores | ambos |
| §4.0 | Reglas duras transversales — agente vs instrumento | ambos |
| §4.1 | Agente (H1, HS1) | ambos |
| §4.2 | Instrumento (H2, HS2) | ambos |
| §4.3 | GAPs de cobertura — habilitadores | perfil |
| §5 | Modificadores de control | ambos |
| §5.0 | Reglas duras transversales — naturaleza y lado de aplicación | ambos |
| §5.1 | Evento (E\*) | ambos |
| §5.2 | Condición (C\*) | ambos |
| §5.3 | Excepción — sobretiempo (EX1) y subtiempo (EX2) | ambos |
| §5.4 | Invocación (IV1) y autoinvocación (IV2) | ambos |
| §5.5 | GAPs de cobertura — modificadores de control | perfil |
| §6 | Enlaces estructurales | ambos |
| §6.0 | Reglas duras transversales — perseverancia, firma y herencia | canon |
| §6.1 | Agregación-participación (RF1) | ambos |
| §6.2 | Exhibición-caracterización (RF2, RF2b) | ambos |
| §6.3 | Generalización-especialización (RF3, RF3b; XOR RX1, RX2; herencia múltiple RH1) | ambos |
| §6.4 | Clasificación-instanciación (RF4, RF4b) | ambos |
| §6.5 | Etiquetados — unidireccional, bidireccional y recíproco (SE1–SE5) | ambos |
| §6.6 | Estructurales con estado especificado (SSE1–SSE7) | ambos |
| §6.7 | GAPs de cobertura — enlaces estructurales | perfil |
| §7 | Refinamiento / gestión de contexto | ambos |
| §7.0 | Reglas duras transversales de refinamiento | ambos |
| §7.1 | Descomposición / recomposición de proceso (in-zoom / out-zoom, CX1, CX2) | ambos |
| §7.2 | Despliegue / plegado de cosa (unfolding / folding, CX3, CX5, CX6) | ambos |
| §7.3 | Refinamiento explícito entre OPDs (CX4) | ambos |
| §7.4 | Expresión / supresión de estados como refinamiento | ambos |
| §7.5 | Descomposición síncrona vs despliegue asíncrono | ambos |
| §7.6 | Distribución de enlaces al descomponer | ambos |
| §7.6.1 | Enlaces escindidos (remite §3 TS4/TS5) | ambos |
| §7.7 | Zona prohibida de composición en contexto de refinamiento / despliegue | perfil |
| §7.8 | GAPs de cobertura — refinamiento / gestión de contexto | perfil |
| §8 | Combinatoria a nivel de modelo | ambos |
| §8.0 | Reglas duras de combinación | ambos |
| §8.1 | Abanicos lógicos XOR / OR / AND | ambos |
| §8.2 | Multiplicidad / cardinalidad en combinación con rol y abanico | ambos |
| §8.3 | Matriz de combinaciones relevantes | ambos |
| §8.3.1 | Colisión de rol y precedencia de recomposición (delegación a `reglas §6.5`/`§6.6`) | ambos |
| §8.4 | Zonas no-canonizadas explícitas | ambos |
| §8.5 | GAPs de cobertura — combinatoria | perfil |
| §9 | Composición de oraciones y prosa OPL | ambos |
| §9.0 | Regla maestra — composición a nivel de token, nunca fusión opaca | perfil |
| §9.1 | Ejes de coordinación y conectores | ambos |
| §9.2 | Reglas de elegibilidad | perfil |
| §9.3 | Zonas prohibidas de composición | ambos |
| §9.4 | Reverse / roundtrip | perfil |
| §9.5 | Configuración display-vs-canónico | ambos |
| §9.6 | Traza a código y GAPs | perfil |
| §10 | Multiplicidad y cardinalidad | ambos |
| §10.1 | Tabla canónica símbolo → rango → OPL-ES | canon |
| §10.2 | Rangos, intervalos y restricciones | ambos |
| §10.3 | Combinatoria | perfil |
| §11 | Etiquetas de ruta | ambos |
| §11.1 | Plantillas | ambos |
| §12 | Plegado y despliegue de OPL (display) | ambos |
| §12.1 | Agrupación y orden de la OPL completa | ambos |
| §12.2 | Plegado parcial | ambos |
| §13 | Presentación del panel OPL | perfil |
| §13.1 | Orden global de las oraciones | perfil |
| §13.2 | Numeración | perfil |
| §13.3 | Plegado-display | perfil |
| §13.4 | Visibilidad de esencia | perfil |
| §13.5 | Minimizar el panel | perfil |
| §14 | Interacción OPL↔OPD | perfil |
| §14.1 | Modelo de tokens y referencias | perfil |
| §14.2 | Hover bidireccional | perfil |
| §14.3 | Navegación por click | perfil |
| §14.4 | Filtrado por selección/referencia | perfil |
| §14.5 | Resolución por sub-span en oraciones compuestas | perfil |
| §15 | Edición de OPL | perfil |
| §15.1 | Clasificación de líneas editadas | perfil |
| §15.2 | Razones de no-aplicabilidad | perfil |
| §15.3 | Mapeo edición → mutación | perfil |
| §15.4 | Editable inline vs bloqueado | perfil |
| §15.5 | Edición de nombres y propiedades de enlace | perfil |
| §15.6 | Edición de oraciones compuestas | perfil |
| §16 | Configuración/opciones que afectan OPL | perfil |
| §16.1 | Visibilidad de esencia | perfil |
| §16.2 | Modo prosa atómica vs compuesta | perfil |
| §16.3 | Numeración | perfil |
| §17 | Modos de fallo, validación y ambigüedad | perfil |
| §17.1 | Contrato de error del parser | perfil |
| §17.2 | Oraciones no parseables y ambiguas | perfil |
| §17.3 | Colisión de nombre desde OPL | perfil |
| §17.4 | Partial-parse: rechazo vs suspensión | perfil |
| §18 | EBNF formal OPL-ES | ambos |
| §19 | Roundtrip, bisimetría e invariantes de equivalencia | perfil |
| §19.1 | Simetría global OPD↔OPL | perfil |
| §19.2 | Parseado vs solo-display | perfil |
| §19.3 | Ley `safe-lens` | perfil |
| §19.4 | Invariante de descomposición de prosa compuesta | perfil |
| §19.5 | Dónde se rompe la bisimetría | perfil |
| §20 | Trazabilidad y gaps | perfil |
| §20.1 | Tabla maestra | perfil |
| §20.2 | Índice de GAPs | perfil |
| §20.3 | Cobertura inversa | perfil |
| §21 | Invariantes | ambos |
| §21.1 | Invariantes prescriptivos del documento | perfil |
| §21.2 | Invariantes OPL del dominio | ambos |
| §22 | Validación | perfil |
| §23 | Migración | perfil |
| §23.1 | Qué cambia respecto del canon disperso previo | perfil |
| §23.2 | Qué migrar | perfil |
| §23.3 | Qué se deprecia | perfil |
| §24 | Composición por interfaz (modelo ∘ modelo) | perfil |
| Apéndice A | — Ejemplo end-to-end | ambos |
| A.1 | Vocabulario del modelo | canon |
| A.2 | OPL atómica (una oración, un hecho — §2–§8) | canon |
| A.3 | OPL prosaica / compuesta (§9) del mismo modelo | ambos |
| A.4 | Refinamiento (§7) — descomposición síncrona de *Despachar* | canon |
| Apéndice B | — Patrones OPL sociotécnicos y agénticos | perfil |
| B.1 | Actor–rol–autoridad — estatus `canon` | perfil |
| B.2 | Agente–autonomía — estatus `canon` | perfil |
| B.3 | Decisión — estatus `canon` | perfil |
| B.4 | Efecto pendiente — estatus `extensión declarada` | perfil |
| B.5 | Supervisión humana HITL — estatus `canon` | perfil |
| Apéndice C | — Índice de IDs | perfil |
| C.1 | IDs de oración (hechos atómicos) | perfil |
| C.2 | IDs de regla por dominio | perfil |
| §2.9 | Perseverancia | canon |
| §2.10 | Tipo de dato | canon |

### Reglas

| ID | Línea 1.x | Destino | Sección 2.0 | Cambio | ISO |
|---|---|---|---|---|---|
| — | 26 | perfil | Definición | sin cambio |  |
| — | 28 | perfil | Definición | sin cambio |  |
| — | 34 | perfil | Definiciones | sin cambio | A.4.1, 12.1 |
| — | 37 | canon | Definiciones | corregida: Hecho del modelo: relación entre dos cosas o estados del modelo (3.38); cosas y estados son elementos, no hechos.; la fila v1.4.1 con su traza a código queda además en el perfil | 3.38 |
| — | 41 | canon | Definiciones | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 7.3.3, A.4.4.2 |
| — | 42 | canon | Definiciones | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 7.3.3, 7.3.4, A.4.4.2 |
| — | 44 | canon | Definiciones | corregida: Plegado (folding): abstracción inversa del despliegue que oculta los refinados (partes, rasgos, especializaciones, instancias) de un refinable desplegado (3.22).; la fila v1.4.1 con su traza a código queda además en el perfil | 3.22, 14.2.1.2, A.4.7.3 |
| — | 51 | perfil | Precedencia | sin cambio |  |
| — | 53 | perfil | Precedencia | sin cambio |  |
| — | 55 | perfil | Precedencia | sin cambio |  |
| — | 63 | perfil | Convenciones | sin cambio | Introducción, 11.3 |
| — | 67 | perfil | Convenciones | sin cambio |  |
| — | 71 | perfil | Convenciones | sin cambio |  |
| — | 75 | perfil | Convenciones | sin cambio |  |
| — | 91 | perfil | Convenciones | sin cambio |  |
| — | 93 | perfil | Convenciones | sin cambio |  |
| — | 94 | perfil | Convenciones | sin cambio |  |
| — | 95 | perfil | Convenciones | sin cambio |  |
| — | 96 | perfil | Convenciones | sin cambio |  |
| — | 97 | perfil | Convenciones | sin cambio |  |
| — | 99 | perfil | Convenciones | sin cambio |  |
| — | 103 | perfil | §1 | corregida: marcador [endurecimiento] | 3.42, A.1, A.4.5.3 |
| — | 111 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 9.1.2, A.4.5.2.2 |
| — | 112 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 9.1.3, 9.1.5, A.4.5.2.3 |
| — | 113 | canon | §1.1 | corregida: Familia: T3 (TS3–TS5 usan «cambia»).; la fila v1.4.1 con su traza a código queda además en el perfil | 9.1.4, A.4.5.2.4 |
| — | 114 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 9.3.3.2, 9.3.3.3, 9.3.3.4, A.4.5.2.5 |
| — | 115 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 9.2.2, 3.3, A.4.5.3 |
| — | 116 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 9.2.3, A.4.5.3 |
| — | 117 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 9.5.2, A.4.5.4 |
| — | 118 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 9.5.2.5 |
| — | 119 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 9.5.3, 9.5.4.2, 9.5.4.3 |
| — | 120 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 9.5.3.1, 9.5.3.2 |
| — | 121 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 9.5.3.1 |
| — | 122 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 9.5.3.1, A.4.5.4 |
| — | 123 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 10.3.2, A.4.6.3 |
| — | 124 | canon | §1.1 | corregida: exhibe: el exhibidor exhibe rasgos (atributos u operaciones) que lo caracterizan.; la fila v1.4.1 con su traza a código queda además en el perfil | 10.3.3.1, 3.20 |
| — | 126 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 10.3.4.1, A.4.6.5 |
| — | 127 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | A.4.6.5 |
| — | 128 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 10.3.5.1, A.4.6.6 |
| — | 129 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 10.2.2, A.4.6.2 |
| — | 130 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | A.3.2, 10.3.3.2, 11.3 |
| — | 131 | canon | §1.1 | corregida: es de tipo: el objeto declara su tipo (boolean, string, numérico, enumerated).; la fila v1.4.1 con su traza a código queda además en el perfil | A.4.4.3 |
| — | 132 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | A.4.4.4 |
| — | 133 | canon | §1.1 | corregida: puede ser: la especialización enumera generales mutuamente excluyentes: «**E** puede ser o bien **G1** o **G2**» / «puede ser uno de **G1**, **G2** o **G3**».; la fila v1.4.1 con su traza a código queda además en el perfil | A.4.6.5 |
| — | 134 | canon | §1.1 | corregida: se descompone: la cosa (proceso u objeto) se descompone (in-zooming) en sus partes.; la fila v1.4.1 con su traza a código queda además en el perfil | 3.34, 3.35, A.4.7.4 |
| — | 135 | canon | §1.1 | sin cambio; la fila v1.4.1 con su traza a código queda además en el perfil | 14.2.1.2, A.4.7.2 |
| — | 136 | canon | §1.1 | corregida: se refina: refinamiento entre OPDs por descomposición (in-zooming) o por despliegue (unfolding).; la fila v1.4.1 con su traza a código queda además en el perfil | 14.2.2.6 |
| — | 137 | canon | §1.1 | corregida: Plegado: «**Cosa** es el plegado de OPD-hijo» (A.4.7.3).; la fila v1.4.1 con su traza a código queda además en el perfil | A.4.7.3, 3.22 |
| — | 138 | canon | §1.1 | corregida: Out-zooming: «**Cosa** se recompone desde OPD-hijo» (A.4.7.5), como inverso del in-zooming.; la fila v1.4.1 con su traza a código queda además en el perfil | A.4.7.5, 3.48, 3.49 |
| — | 142 | canon | §1.1 | sin cambio | A.4.5.4 |
| R-VERB-EST-1 | 149 | canon | §1.2 | sin cambio | A.4.4.4, 7.3.5 |
| R-VERB-EST-2 | 155 | canon | §1.2 | corregida: Correcto: «**Auto Anfibio** puede ser o bien **Vehículo Terrestre** o **Vehículo Acuático**.» | A.4.6.5 |
| — | 165 | canon | §1.3 | sin cambio | 9.5.3, A.4.5.4 |
| — | 166 | canon | §1.3 | sin cambio | 9.5.3.1 |
| — | 167 | canon | §1.3 | sin cambio | 9.5.3.1, 9.5.3.2 |
| — | 168 | canon | §1.3 | sin cambio | A.4.5.2.5, A.3.2 |
| — | 169 | canon | §1.3 | sin cambio | A.4.5.2.5, A.3.2 |
| — | 170 | canon | §1.3 | corregida: «e» ante palabra que empieza por el sonido /i/ (i-, hi-), salvo diptongo (hie-, hia-). | 12.1, A.4.3 |
| — | 171 | canon | §1.3 | sin cambio | A.4.3, 12.2 |
| — | 172 | canon | §1.3 | sin cambio | A.4.6.4 |
| — | 173 | canon | §1.3 | sin cambio | 12.2 |
| — | 174 | canon | §1.3 | sin cambio | 12.2 |
| — | 175 | canon | §1.3 | sin cambio | 10.3.2, 10.3.3.1, A.4.6.3 |
| — | 176 | canon | §1.3 | sin cambio | 11.1, A.3.2 |
| — | 177 | canon | §1.3 | sin cambio | 11.1 |
| — | 178 | canon | §1.3 | sin cambio | 13 |
| — | 179 | canon | §1.3 | sin cambio | 9.5.4.2, 9.5.4.3 |
| — | 180 | canon | §1.3 | sin cambio | 9.5.4.2 |
| — | 181 | canon | §1.3 | sin cambio | 9.5.4.3 |
| — | 182 | canon | §1.3 | sin cambio | A.4.7.4, A.4.6.2 |
| R-VERB-KW-1 | 184 | fusionada→ R-OPL-KW-1 | §1.3 | corregida: alias de R-OPL-KW-1 | Introducción, A.4 |
| R-VERB-KW-2 | 185 | fusionada→ R-OPL-KW-2 | §1.3 | corregida: alias de R-OPL-KW-2 |  |
| DIV-1 | 193 | canon | §1.4 | corregida: Plegado y out-zooming pertenecen al enum por A.4.7.3 y A.4.7.5, con su forma «es el plegado de OPD-hijo» / «se recompone desde OPD-hijo». | A.4.7.3, A.4.7.5 |
| DIV-2 | 194 | canon | §1.4 | sin cambio | A.4.4.4 |
| — | 202 | canon | §2 | sin cambio | A.4.4 |
| R-ENT-1 | 208 | fusionada→ R-COSA-1 | §2.0 | corregida: alias de R-COSA-1 | 7.3.1, 3.76 |
| R-ENT-3 | 220 | canon | §2.0 | corregida: Oración de propiedades genéricas (A.4.4.2): «**Cosa** es {esencia} y {afiliación}», con la perseverancia en la misma oración; se omiten los valores por defecto. | A.4.4.2, A.4.2, 9.3.3.2 |
| ENT-OBJ | 230 | canon | §2.1 | sin cambio | A.3.3, B.6.2 |
| ENT-OBJ | 232 | canon | §2.1 | corregida: redactada de nuevo con cita ISO | A.4.4.2, 6.2.1 |
| ENT-OBJ | 236 | canon | §2.1 | corregida: redactada de nuevo con cita ISO | B.6.5, A.3.3 |
| ENT-PROC | 252 | canon | §2.2 | corregida: redactada de nuevo con cita ISO | A.3.3, B.6.3 |
| ENT-PROC | 254 | canon | §2.2 | sin cambio | 3.68 |
| ENT-PROC | 264 | canon | §2.2 | corregida: Eliminar. Sin cambio neto de estado en el OPD abstracto, el objeto es instrumento (Tabla 25 NOTE 2); TS3 exige estados de entrada y salida distintos. | 9.3.3.2, Tabla 25, 3.50, A.4.4.2 |
| D5 | 275 | canon | §2.3 | sin cambio | A.4.4.4, 9.3.3.2 |
| D6 | 276 | canon | §2.3 | corregida: redactada de nuevo con cita ISO | A.4.4.4, 14.2.1.1 |
| ENT-EST | 278 | canon | §2.3 | sin cambio | A.4.4.4 |
| ENT-EST | 282 | canon | §2.3 | corregida: Estados en minúscula (A.4.2); DEBERÍAN tener forma pasiva (B.6.4, informativo); backticks como tipografía local. | A.4.2, B.6.4, B.6.5 |
| R-ENT-EST-1 | 285 | fusionada→ R-VERB-EST-1 | §2.3 | corregida: alias de R-VERB-EST-1 | A.4.4.4 |
| R-ENT-EST-2 | 289 | fusionada→ R-EST-1 | §2.3 | corregida: alias de R-EST-1 | 3.68, 7.3.5.2 |
| D7 | 303 | eliminada-duplicada→ D13 (perfil reglas-opforja §4.4) | §2.4 | corregida: D7–D10 en canon spec-OPL §2.4; D13 (`Current`) sin base en la norma, definida en perfil reglas-opforja §4.4 y citada en el perfil opl-opforja §2.4 | A.4.4.4, 7.3.5.3, Tabla 25 |
| D13 | 303 | eliminada-duplicada→ D13 (perfil reglas-opforja §4.4) | §2.4 | corregida: D7–D10 en canon spec-OPL §2.4; D13 (`Current`) sin base en la norma, definida en perfil reglas-opforja §4.4 y citada en el perfil opl-opforja §2.4 | 3.69, Anexo C |
| ENT-DESIG | 305 | canon | §2.4 | corregida: redactada de nuevo con cita ISO | Tabla 25 |
| ENT-DESIG | 307 | canon | §2.4 | corregida: Quitar la cláusula del placeholder (producto). | A.4.4.4 |
| ENT-DESIG | 309 | canon | §2.4 | corregida: Palabras clave de designación: inicial, final, por defecto, inicialmente, finalmente; añadirlas a §1.3. | A.4.4.4 |
| ENT-ATR | 324 | canon | §2.5 | sin cambio | 11.3, 10.3.3.2.2 |
| ENT-ATR | 325 | canon | §2.5 | sin cambio | A.3.2, 10.3.3.2.2 |
| ENT-ATR | 326 | canon | §2.5 | sin cambio | 7.3.5.5, 10.3.3.2.1 |
| R-ENT-ATR-1 | 331 | fusionada→ R-ATR-1 | §2.5 | corregida: alias de R-ATR-1 | 3.4, 10.3.3.1 |
| R-ENT-ATR-2 | 334 | fusionada→ R-ATR-2 | §2.5 | corregida: alias de R-ATR-2 | 7.3.5.5, 10.3.3.2.1 |
| ENT-INS | 356 | canon | §2.6 | corregida: En OPL la instancia se nombra sin sufijo de clase y su clase se declara con «es una instancia de» (10.3.5.1); «Instancia : Clase» es rótulo OPD. | 10.3.5.1 |
| ENT-INS | 358 | canon | §2.6 | sin cambio | 10.3.5.1, A.4.6.6 |
| R-ENT-INS-1 | 361 | canon | §2.6 | corregida: Distinguir la instancia refinada (10.3.5, relación entre cosas distintas) de la instancia operacional (3.29); la reaparición de una cosa en otro OPD es copia de la misma cosa (B.5, informativo), no instancia. | 10.3.5.1, 3.28, 3.29, B.5 |
| ENT-INS | 365 | canon | §2.6 | corregida: Una copia de la cosa no emite oración de instanciación; sus hechos pueden reaparecer en el párrafo OPL de cada OPD (6.2.1). | 14.2.3, 6.2.1, B.5 |
| ENT-ESENCIA | 383 | canon | §2.7 | corregida: La esencia por defecto es informacional (A.4.4.2); un valor explícito prevalece sobre el defecto. | A.4.4.2, 3.55 |
| ENT-ESENCIA | 385 | canon | §2.7 | corregida: Incluir física, informacional, sistémica, ambiental, persistente y transitoria en la tabla §1.3. | A.4.4.2 |
| ENT-AFILIA | 403 | perfil | §2.8 | corregida: marcador [endurecimiento] | 7.3.4, 14.2.2.6 |
| — | 421 | canon | §3 | sin cambio | A.4.5.2.1 |
| R-TR-ASIM-1 | 427 | fusionada→ R-MOD-2 | §3.0 | corregida: alias de R-MOD-2 | 9.5.2.1.1, 9.5.3.1.1, 8.2.2 |
| R-TR-ASIM-2 | 429 | fusionada→ R-MOD-3 | §3.0 | corregida: alias de R-MOD-3 | 9.5.2, 9.5.3, 8.2.2, 12.5 |
| R-TR-ASIM-3 | 435 | canon | §3.0 | sin cambio | 9.5.2.1, 9.5.2.3, 9.5.3.3 |
| T1 | 446 | canon | §3.1 | sin cambio | 9.1.2, A.4.5.2.2 |
| TS1 | 447 | canon | §3.1 | sin cambio | 9.3.1 |
| T1 | 448 | canon | §3.1 | corregida: *Proceso* consume n **Objetos**. (multiplicidad antepuesta, objeto en plural, verbo concordado con el proceso singular) | 11.1 |
| T1 | 450 | canon | §3.1 | sin cambio | 9.1.5 |
| T1 | 452 | canon | §3.1 | corregida: Quitar la cláusula del placeholder (R-ENT-2, producto). | 12.2 |
| T1 | 456 | canon | §3.1 | sin cambio | 9.3.1 |
| T1 | 458 | canon | §3.1 | corregida: Enlaces del mismo tipo desde/hacia el mismo proceso DEBEN coordinarse con «y» en una sola oración (12.1); no se mezclan familias. | 12.1 |
| T2 | 475 | canon | §3.2 | sin cambio | 9.1.3, A.4.5.2.3 |
| TS2 | 476 | canon | §3.2 | sin cambio | 9.3.2 |
| T2 | 477 | canon | §3.2 | corregida: *Proceso* genera n **Objetos**. | 11.1 |
| T2 | 479 | canon | §3.2 | sin cambio | 9.1.5 |
| R-RES-1 | 481 | canon | §3.2 | corregida: Un enlace de resultado hacia un objeto con estado inicial DEBERÍA conectarse al rectángulo o a un estado distinto del inicial (9.3.2). | 9.3.2, 12.7 |
| T2 | 485 | canon | §3.2 | sin cambio | 9.3.2 |
| T3 | 504 | canon | §3.3 | sin cambio | 9.1.4, A.4.5.2.4 |
| T3 | 505 | canon | §3.3 | corregida: *Proceso* afecta n **Objetos**. | 11.1 |
| R-EFE-1 | 507 | canon | §3.3 | corregida: El efecto exige objeto con estados (3.2); entre el inicio y el fin del proceso el afectado está en transición (9.3.3.2 NOTE 1), sin DEBE. | 3.2, 3.15, 9.3.3.2 |
| T3 | 509 | canon | §3.3 | sin cambio | 9.3.3.1 |
| T3 | 513 | canon | §3.3 | sin cambio | 9.1.4 |
| R-OPL-PERSIST-2 | 521 | canon | §3.3 | corregida: Eliminar; sin cambio neto de estado el objeto es instrumento en ese OPD (Tabla 25 NOTE 2). | 9.3.3.2, Tabla 25, 3.50 |
| TS3 | 532 | canon | §3.4 | sin cambio | 9.3.3.2, A.4.5.2.5 |
| ETS2 | 533 | canon | §5.1 | sin cambio | 9.5.2.3 |
| CS2 | 534 | canon | §5.2 | sin cambio | 9.5.3.3 |
| TS3 | 539 | canon | §3.4 | sin cambio | 9.3.3.2, 9.5.2.3, 9.5.3.3 |
| TS3 | 541 | canon | §3.4 | sin cambio | A.4.5.2.5, 12.2 |
| TS3 | 545 | canon | §3.4 | sin cambio | A.4.5.2.5 |
| TS3 | 553 | canon | §3.4 | corregida: Al hacer in-zooming de P en ≥2 subprocesos, el TS3 queda subespecificado; el modelador DEBE asignar el par a un subproceso o escindirlo (TS4 en uno temprano, TS5 en uno tardío). | 14.2.2.4.3 |
| TS4 | 563 | canon | §3.5 | sin cambio | 9.3.3.3, A.4.5.2.5 |
| R-ESCIND-0 | 566 | canon | §3.5 | corregida: Fragmento escindido: sin modificadores de control (Tabla 25 NOTE 1). Origen por parseo y metadato, a la documentación de OpForja. | 14.2.2.4.3, Tabla 25 |
| R-EFE-3 | 567 | canon | §3.5 | sin cambio | 9.3.3.3, 9.5.2.3, 9.5.3.3 |
| TS4 | 569 | canon | §3.5 | sin cambio | 9.3.3.3 |
| TS4 | 571 | canon | §3.5 | corregida: redactada de nuevo con cita ISO | Tabla 25 |
| TS4 | 575 | canon | §3.5 | sin cambio | A.4.5.2.5 |
| TS4 | 577 | canon | §3.5 | sin cambio | 14.2.2.4.3, Tabla 25 |
| TS5 | 591 | canon | §3.6 | sin cambio | 9.3.3.4, A.4.5.2.5 |
| TS5 | 593 | canon | §3.6 | corregida: TS5 = efecto con estado de salida especificado (ISO §9.3.3.4); «mitad de salida» del TS3 escindido; mismo texto OPL, el contexto separa | Tabla 25, 9.5.2.3, 9.5.3.3 |
| TS5 | 595 | canon | §3.6 | sin cambio | 9.3.3.4 |
| TS5 | 597 | canon | §3.6 | corregida: sólo la mitad de entrada de un TS3 escindido carece de versión con control (ISO Tabla 25 NOTE 1); TS5 admite control (ISO §9.5.1) | Tabla 25 |
| TS5 | 601 | canon | §3.6 | sin cambio | A.4.5.2.5 |
| TS5 | 603 | canon | §3.6 | sin cambio | Tabla 25 |
| — | 1653 | canon | §9.1 | sin cambio | 10.3.2, 10.3.3, A.4.3, A.4.6.3 |
| — | 1654 | canon | §9.1 | corregida: (c) sujeto coordinado: varios agentes de un proceso o varias especializaciones/instancias de un general. Ejemplo: «**A** y **B** manejan *P*.» | 12.1, A.4.5.3.2, A.4.5.2.2, A.4.6.5 |
| — | 1656 | canon | §9.1 | sin cambio | 12.2, A.4.3, A.4.5.2.2 |
| R-COMP-EJE-1 | 1658 | fusionada→ R-OPL-LISTA-1 | §9.1 | corregida: alias de R-OPL-LISTA-1 | A.4.3 |
| R-COMP-EJE-3 | 1666 | canon | §9.1 | corregida: Los enlaces del mismo tipo que comparten vértice (estructural) o proceso (procedimental, AND) DEBEN expresarse en una sola oración con lista: «**Auto** consta de **Motor**, **Chasis** y **Rueda**.», «*P* consume **A**, **B** y **C**.» | 10.3.2, 10.3.3, 10.3.4, 12.1, A.4.6.3 |
| R-COMP-EJE-4 | 1671 | canon | §9.1 | corregida: El sujeto coordinado DEBE usarse cuando varios agentes manejan el mismo proceso (12.1) y en especialización/instanciación múltiple; NO existe para consumo, resultado, efecto ni instrumento, cuyo sujeto es el proceso. | 12.1, A.4.5.3.2, A.4.6.5 |
| R-COMP-EJE-5 | 1675 | canon | §9.1 | sin cambio | 12.2 |
| R-COMP-ZP-1 | 1697 | canon | §9.3 | corregida: Las especializaciones de un mismo general se expresan con una sola oración «**Auto** y **Camión** son **Vehículo**.» (A.4.6.5); el despliegue en el mismo OPD no añade una oración distinta (14.2.1.2). | 10.3.4, A.4.6.5, 14.2.1.2 |
| R-COMP-CFG-1 | 1721 | canon | §9.5 | corregida: Para enlaces AND del mismo tipo y proceso, la OPL canónica es UNA oración con lista (12.1); la emisión atómica por enlace no es OPL conforme, y si el producto la ofrece es una vista fuera del canon. | 12.1, 6.2.1 |
| — | 1747 | canon | §10 | corregida: La multiplicidad es una restricción de participación sobre el número de instancias operacionales del objeto en un extremo de enlace; no es cosa ni enlace. | 11.1, 9.5.1 |
| — | 1753 | canon | §10.1 | sin cambio | 11.1, Tabla 16, A.3.2 |
| — | 1754 | canon | §10.1 | corregida: `*` → «opcionales» antepuesto al nombre en plural (p. ej. «está equipado con opcionales **Bolsas de aire**»); «(cero o más)» es glosa de la tabla, no superficie. | 11.1, Tabla 16, A.3.2 |
| — | 1755 | canon | §10.1 | sin cambio | 11.1, Tabla 16 |
| — | 1756 | canon | §10.1 | sin cambio | 11.1, Tabla 16, A.3.2 |
| R-MULT-1 | 1758 | eliminada-duplicada→ reglas §6.7 | §10.1 | corregida: definición única en reglas §6.7; aquí se cita | 11.1, 11.2 NOTE 1 |
| R-MULT-1A | 1764 | eliminada-duplicada→ reglas §6.7 | §10.1 | corregida: definición única en reglas §6.7; aquí se cita | 11.1, 11.2 NOTE 2, A.4.6.3 |
| R-MULT-1B | 1766 | eliminada-duplicada→ reglas §6.7 | §10.1 | corregida: definición única en reglas §6.7; aquí se cita | 11.2 NOTE 2 |
| R-MULT-1C | 1770 | eliminada-duplicada→ reglas §6.7 | §10.1 | corregida: definición única en reglas §6.7; aquí se cita | 11.2 NOTE 2, 14.2.2.5 |
| R-MULT-2 | 1772 | eliminada-duplicada→ reglas §6.7 | §10.1 | corregida: definición única en reglas §6.7; aquí se cita | 11.2 |
| — | 1776 | canon | §10.2 | corregida: Un rango DEBE anotarse qmín..qmáx y es cerrado (incluye ambos extremos); varios rangos se separan por coma; en OPL «..» se realiza «a» y la coma «o» (p. ej. «3 a 5 o 8 a 10 **Máquinas**»). | 11.1 |
| — | 1778 | canon | §10.2 | sin cambio | 11.2, A.3.2 |
| — | 1786 | perfil | §10.3 | sin cambio |  |
| — | 1810 | canon | §11.1 | corregida: redactada de nuevo con cita ISO | 13, A.1 |
| — | 1811 | canon | §11.1 | corregida: redactada de nuevo con cita ISO | 13, A.1 |
| R-OPL-RUTA-1 | 1813 | canon | §11.1 | corregida: redactada de nuevo con cita ISO | 13, A.1 |
| R-OPL-RUTA-2 | 1819 | canon | §11.1 | corregida: La etiqueta de ruta es una propiedad del enlace procedimental; los enlaces con la misma etiqueta se alinean (entrada y salida de la misma ruta). | 13 |
| R-OPL-RUTA-3 | 1821 | eliminada-duplicada→ R-OPL-RUTA-3 (perfil reglas-opforja §4.12) | §11.1 | corregida: definición única en perfil reglas-opforja §4.12; aquí sólo se cita | 13, A.1 |
| — | 1828 | canon | §11.1 | corregida: redactada de nuevo con cita ISO | 13, A.1 |
| — | 1829 | canon | §11.1 | corregida: redactada de nuevo con cita ISO | 13 |
| R-OPL-DISP-1 | 1845 | canon→ R-BI-DUAL-1 | §12.1 | corregida: alias de R-BI-DUAL-1; agrupación por OPD = párrafo por OPD (ISO §6.2.1, §A.4.1) | 6.2.1, A.4.1 |
| R-OPL-DISP-3 | 1853 | canon | §12.2 | corregida: El párrafo OPL de cada OPD expresa sólo los hechos visibles en ese OPD; en el OPD más abstracto, la cosa refinada en un OPD nuevo lleva su oración de plegado o de alejamiento («… is folding of SDn» / «… is out zoom from SDn»). | 6.2.1, 14.2.1.2, 14.2.3, A.4.7.3, A.4.7.5 |
| R-OPL-CFG-3 | 2113 | perfil | §16.2 | corregida: se añade que la opción no alcanza a los enlaces AND del mismo tipo, cuya OPL canónica es una sola oración (canon spec-OPL R-COMP-CFG-1; ISO §12.1) | 12.1 |
| R-§21-OPL-VOCAB | 2869 | canon | §21.2 | corregida: Los verbos, cópulas y conectores OPL DEBEN pertenecer al vocabulario reservado de la gramática (Anexo A); no se admiten sinónimos. | A.1, A.3.1, A.4 |
| R-§21-OPL-TIPO | 2870 | perfil | §21.2 | sin cambio | Introducción, A.3.3 |
| R-§21-OPL-MOD | 2871 | canon | §21.2 | corregida: La PAS define enlaces de evento (e) o de condición (c); la combinación de ambos sobre un mismo enlace no está definida (zona no canonizada). | 9.5.1 |
| — | 2938 | canon | Apéndice A | corregida: ejemplo rehecho [informativo] con plantillas canónicas; la forma compuesta A.3 queda en el perfil | 12.1, 14.2.3, A.4.5.2, A.4.6.5 |
| Servicio | 3028 | perfil | B.1 | sin cambio | 9.2.2, 9.2.3 |
| — | 3037 | perfil | B.2 | sin cambio | 9.2.2 |
| — | 3061 | perfil | B.4 | sin cambio | 9.2.2, A.4.5.3.2 |
| — | 615 | canon | §4 | sin cambio | 9.2, Tabla 2, A.4.5.3 |
| R-HAB-AG-1 | 623 | fusionada→ R-AG-1 | §4.0 | corregida: alias de R-AG-1 | 9.2.2, Tabla 2, 3.3 |
| R-HAB-AG-2 | 627 | fusionada→ R-AG-1A | §4.0 | corregida: alias de R-AG-1A | 9.2.2, 9.2.3, Tabla 2 |
| R-HAB-AG-3 | 633 | fusionada→ R-AG-2 | §4.0 | corregida: alias de R-AG-2 | Tabla 2, 9.4.1, 9.4.2, 9.2.3 EXAMPLE 3, Tablas 6, 8 |
| R-HAB-AG-4 | 637 | perfil | §4.0 | sin cambio |  |
| R-HAB-AG-5 | 641 | fusionada→ R-ROL-UNIC-1 | §4.0 | corregida: alias de R-ROL-UNIC-1 | 8.1.2, 14.2.4.1, 14.2.4.3 |
| H1 | 650 | canon | §4.1 | sin cambio | 9.2.2, A.4.5.3.2 |
| HS1 | 651 | canon | §4.1 | sin cambio | 9.4.1, Tabla 4 |
| H1 | 652 | canon | §4.1 | corregida: Con multiplicidad: «2 **Agentes** manejan *Proceso*.» (11.1); con varios agentes: «**A** y **B** manejan *Proceso*.» (12.1). | 11.1, 12.1, A.4.5.3.2 |
| EH1 | 653 | canon | §5.1 | corregida: Corregir la remisión: «remite a §5.1». | 9.5.2.2.1, A.4.5.4.2 |
| CH1 | 654 | canon | §5.2 | corregida: Corregir la remisión: «remite a §5.2». | 9.5.3.2.1, 9.5.3.4.1, Tablas 11, 13 |
| H1 | 657 | canon | §4.1 | sin cambio | Tabla 2, 9.2.2 |
| H1 | 659 | canon | §4.1 | sin cambio | 12.2, 12.3, Tabla 20, A.4.5.3.2 |
| H1 | 663 | canon | §4.1 | sin cambio | 9.2.2, A.4.5.3.2 |
| H2 | 682 | canon | §4.2 | sin cambio | 9.2.3, A.4.5.3.3 |
| HS2 | 683 | canon | §4.2 | sin cambio | 9.4.2, Tabla 4 |
| H2 | 684 | canon | §4.2 | corregida: Sólo por lista AND de procesos: «*P1*, *P2* y *P3* requieren **Instrumento**.» (12.1; cf. Figura 50). Eliminar «por multiplicidad». | 11.1, 11.2 NOTE 2, 12.1, 14.2.2.4.1 Fig. 50 |
| EH2 | 685 | canon | §5.1 | corregida: Corregir la remisión: «remite a §5.1». | 9.5.2.2.2, A.4.5.4.2 |
| CH2 | 686 | canon | §5.2 | corregida: Corregir la remisión: «remite a §5.2». | 9.5.3.2.2, 9.5.3.4.2, Tablas 11, 13 |
| H2 | 689 | canon | §4.2 | sin cambio | Tabla 2, 9.2.3 |
| H2 | 691 | canon | §4.2 | corregida: Suprimir la frase de reclasificación por desgaste (fuera). | Tabla 20, 12.2 |
| H2 | 695 | canon | §4.2 | sin cambio | 9.2.2, 9.2.3, A.4.5.3 |
| — | 718 | canon | §5 | corregida: Los modificadores `e` y `c` anotan un enlace transformador o habilitador de entrada y denotan el enlace de evento o de condición correspondiente; evento, condición y excepción son enlaces de control (9.5.1) y la invocación es un enlace de evento (9.5.2.5). | 9.5.1, 9.5.2.5, 9.5.4 |
| — | 724 | canon | §5.0 | sin cambio | 9.5.1 |
| R-MOD-NAT-1 | 726 | fusionada→ R-ECA-4 | §5.0 | corregida: alias de R-ECA-4 | 9.5.1 |
| R-MOD-NAT-2 | 730 | canon | §5.0 | sin cambio | 9.5.1, 9.5.1 NOTE 2, 9.5.3.1.1 |
| R-MOD-INPUT-1 | 734 | fusionada→ R-MOD-4 | §5.0 | corregida: alias de R-MOD-4 | 9.5.1, 8.2.2 |
| R-MOD-INPUT-2 | 738 | fusionada→ R-MOD-1 | §5.0 | corregida: alias de R-MOD-1 | 9.5.1, 12.5 |
| R-MOD-CAT-1 | 744 | canon | §5.0 | corregida: Un modificador `e`/`c` NO DEBE anotar un enlace estructural ni un enlace de invocación (9.5.1). | 9.5.1, 10.1, 9.5.2.5 |
| R-MOD-CAT-2 | 748 | fusionada→ R-ESC-1 | §5.0 | corregida: alias de R-ESC-1 | 14.2.2.4.3, Tabla 25 NOTE 1 |
| R-MOD-CAT-3 | 752 | perfil | §5.0 | corregida: marcador [endurecimiento] | 9.5.1 |
| ET1 | 761 | canon | §5.1 | sin cambio | 9.5.2.1.1, Tabla 5 |
| ET2 | 762 | canon | §5.1 | sin cambio | 9.5.2.1.2, Tabla 5 |
| EH1 | 763 | canon | §5.1 | sin cambio | 9.5.2.2.1, Tabla 6 |
| EH2 | 764 | canon | §5.1 | sin cambio | 9.5.2.2.2, Tabla 6 |
| ETS1 | 765 | canon | §5.1 | sin cambio | 9.5.2.3.1, Tabla 7 |
| ETS2 | 766 | canon | §5.1 | sin cambio | 9.5.2.3.2, Tabla 7, A.4.5.4.2 |
| ETS3 | 767 | canon | §5.1 | sin cambio | 9.5.2.3.3, A.4.5.4.2 |
| ETS4 | 768 | canon | §5.1 | sin cambio | 9.5.2.3.4, A.4.5.4.2 |
| EHS1 | 769 | canon | §5.1 | sin cambio | 9.5.2.4.1, Tabla 8 |
| EHS2 | 770 | canon | §5.1 | sin cambio | 9.5.2.4.2, Tabla 8 |
| Emisi | 772 | canon | §5.1 | sin cambio | 9.5.2.1.1, A.4.5.4.2 |
| Supresi | 774 | canon | §5.1 | corregida: **B** inicia exactamente uno de *P*, *Q* o *R*, en cuyo caso el proceso que ocurre afecta **B**. | 12.5, Tabla 22 |
| Orden | 778 | canon | §5.1 | sin cambio | A.4.5.4.2 |
| Composabilidad | 780 | canon | §5.1 | corregida: varios eventos sobre un proceso: cada uno inicia una evaluación de la precondición (ISO §3.18, §9.5.2); se sustituye la «semántica OR» por R-MOD-NAT-3 | 12.1, 9.5.1 NOTE 1 |
| — | 787 | canon | §5.1 | sin cambio | 9.5.2.1.2, 8.2.2 |
| CT1 | 800 | canon | §5.2 | sin cambio | 9.5.3.1.1, A.4.5.4.3 |
| CT2 | 801 | canon | §5.2 | sin cambio | 9.5.3.1.2, Tabla 10 |
| CH1 | 802 | canon | §5.2 | sin cambio | 9.5.3.2.1, Tabla 11 |
| CH2 | 803 | canon | §5.2 | sin cambio | 9.5.3.2.2, Tabla 11 |
| CS1 | 804 | canon | §5.2 | sin cambio | 9.5.3.3.1, Tabla 12 |
| CS2 | 805 | canon | §5.2 | sin cambio | 9.5.3.3.2, Tabla 12 |
| CS3 | 806 | canon | §5.2 | sin cambio | 9.5.3.3.3, Tabla 12 |
| CS4 | 807 | canon | §5.2 | sin cambio | 9.5.3.3.4, Tabla 12 |
| CS5 | 808 | canon | §5.2 | sin cambio | 9.5.3.4.1, Tabla 13 |
| CS6 | 809 | canon | §5.2 | sin cambio | 9.5.3.4.2, Tabla 13 |
| Estructura | 811 | canon | §5.2 | corregida: La oración de condición transformadora tiene rama positiva («en cuyo caso …») y negativa; la de habilitador sólo la negativa (9.5.3.2). | 9.5.3, A.4.5.4.3 |
| R-COND-RAMA-1 | 813 | canon | §5.2 | sin cambio | 9.5.1, 9.5.3.1.1 |
| R-COND-RAMA-2 | 817 | canon | §5.2 | corregida: Emitir «**Objeto** se consume»; aceptar en parseo también la activa «*Proceso* consume **Objeto**» de la Tabla 10. | 9.5.3.1.1, Tabla 10 |
| Emisi | 823 | canon | §5.2 | sin cambio | 9.5.3.1, 9.5.3.3 |
| Supresi | 825 | canon | §5.2 | corregida: Realizar el abanico condicional con las formas de Tablas 22–23 (procesos en el extremo divergente); otras formas, extensión fuera del canon. | 12.5, Tabla 22, Tabla 23 |
| Orden | 829 | canon | §5.2 | sin cambio | 9.5.3.1, 9.5.3.2 |
| Composabilidad | 831 | canon | §5.2 | corregida: Citar 9.5.3 y 12.1 en lugar de SSOT-metod. | 9.5.3.1.1, 12.1 |
| R-OPL-COND-ALT-1 | 835 | canon | §5.2 | corregida: Las sintaxis alternativas «Si … existe entonces …, de lo contrario se omite *Proceso*» de las diez condiciones de 9.5.3 son OPL válida y DEBEN reconocerse; la emisión prefiere la principal. | 9.5.3.1–9.5.3.4, A.4.5.4.3 |
| — | 838 | canon | §5.2 | sin cambio | 9.5.3.1.2 |
| EX1 | 851 | canon | §5.3 | sin cambio | 9.5.4.2, A.4.5.4.5 |
| EX2 | 852 | canon | §5.3 | sin cambio | 9.5.4.3, A.4.5.4.5 |
| Naturaleza | 855 | canon | §5.3 | corregida: El enlace de excepción es un enlace de control proceso→proceso (9.5.1, 9.5.4). | 9.5.1, 9.5.4 |
| R-EXC-AMBIENTAL-1 | 857 | perfil | §5.3 | corregida: marcador [endurecimiento] | 9.5.4.2, 9.5.4.3 |
| R-EXC-DUR-1 | 862 | canon | §5.3 | corregida: El sobretiempo se refiere a la Duración Máxima del proceso fuente y el subtiempo a su Duración Mínima (9.5.4). | 9.5.4.2, 9.5.4.3, 9.5.4.1 |
| Supresi | 868 | canon | §5.3 | corregida: Fundar en 9.5.1, no en R-MOD-CAT-1. | 9.5.1 |
| Orden | 872 | canon | §5.3 | sin cambio | 9.5.4.2, 9.5.4.3 |
| Composabilidad | 874 | canon | §5.3 | corregida: sobretiempo y subtiempo de una misma fuente se expresan cada uno con su oración EX1/EX2; la variante combinada queda en el perfil [extensión] | 9.5.4.1 |
| IV1 | 893 | canon | §5.4 | sin cambio | 9.5.2.5.1, Tabla 9 |
| IV2 | 895 | canon | §5.4 | sin cambio | 9.5.2.5.2, Tabla 9 |
| IV1 | 897 | canon | §5.4 | sin cambio | Tabla 21, A.4.5.4.4 |
| IV1 | 898 | canon | §5.4 | sin cambio | Tabla 21, A.4.5.4.4 |
| Naturaleza | 900 | canon | §5.4 | corregida: La invocación es un enlace de evento proceso→proceso (9.5.2.5). | 9.5.2.5.1, 9.5.2.5.2 |
| R-IV-1 | 902 | fusionada→ R-INV-1 | §5.4 | corregida: alias de R-INV-1 | 9.5.2.5.1, 9.5.1 |
| R-IV-2 | 906 | canon | §5.4 | sin cambio | 14.2.2.1, 14.2.2.2 |
| R-IV-3 | 910 | canon | §5.4 | corregida: La invocación NO DEBE portar modificador `e`/`c` (9.5.1). | 9.5.1 |
| Emisi | 914 | canon | §5.4 | corregida: Suprimir «invocan en plural por multiplicidad» y la demora (extensión fuera del canon). | 9.5.2.5, 11.1 |
| Supresi | 916 | canon | §5.4 | sin cambio | 14.2.2.1, Tabla 21 |
| Orden | 920 | canon | §5.4 | sin cambio | A.4.5.4.4 |
| Composabilidad | 922 | canon | §5.4 | corregida: Varias invocaciones desde el mismo invocador se expresan en una sola oración: «*P* invoca *Q* y *R*.» (12.1; lista de A.4.5.4.4). | 12.1, A.4.5.4.4 |
| — | 948 | canon | §6 | corregida: Quitar del conjunto cerrado «tiene un … opcional» (extensión) y añadir «puede ser o bien … o …» (A.4.6.5). | 10.1, A.4.6 |
| R-EST-PERS-1 | 954 | fusionada→ R-STRF-1 | §6.0 | corregida: alias de R-STRF-1 | 10.3.1, 10.3.4.1 |
| R-EST-PERS-2 | 958 | fusionada→ R-STRF-2 | §6.0 | corregida: alias de R-STRF-2 | 10.1, 10.3.3.1 |
| R-EST-DIR-1 | 962 | canon | §6.0 | corregida: Fundar en Tabla 14 (forward/reverse), no en estructural.ts. | 10.3.1, Tabla 14, A.4.6.3, A.4.6.5, A.4.6.6 |
| R-EST-HER-1 | 966 | canon | §6.0 | corregida: La especialización hereda partes, rasgos, enlaces etiquetados y procedimentales del general (10.3.4.2); los heredados están implícitos y no se repiten en el OPL (10.3.5.1 NOTE 4). | 10.3.4.2, 10.3.5.1 NOTE 4 |
| RF1 | 975 | canon | §6.1 | sin cambio | 10.3.2, A.4.6.3.1 |
| RF1 | 976 | canon | §6.1 | corregida: Eliminar la variante plural del todo; la multiplicidad se antepone a cada parte (11.1 b). | 11.1, A.4.6.3.1 |
| RF1i | 977 | canon | §6.1 | sin cambio | 10.3.2, A.4.6.3.1 |
| RF1 | 979 | canon | §6.1 | corregida: Suprimir «constan»; mantener todo-sujeto y lista con «y/e». | 10.3.2, A.4.3 |
| RF1 | 981 | canon | §6.1 | corregida: Los hechos heredados están implícitos y no se repiten (10.3.5.1 NOTE 4); el placeholder es producto. | 10.3.5.1 NOTE 4, 10.3.4.2 |
| RF1 | 985 | canon | §6.1 | sin cambio | A.4.6.3.1 |
| RF1 | 987 | canon | §6.1 | corregida: Las partes de un mismo todo se enumeran en una sola oración (A.4.6.3.1); la zona prohibida de composición sale del canon. | A.4.6.3.1, 12.1 |
| RF2 | 1004 | canon | §6.2 | sin cambio | 10.3.3.1, A.4.6.3.2 |
| RF2b | 1005 | canon | §6.2 | corregida: **Exhibidor** exhibe **Atributo1**, así como *Operación1*. — y para exhibidor proceso: *Exhibidor* exhibe *Operación1*, así como **Atributo1**. | 10.3.3.1, A.4.6.3.2 |
| RF2 | 1007 | canon | §6.2 | corregida: Eliminar el plural por multiplicidad del exhibidor. | 11.1, 11.2 NOTE 1, A.4.6.3.2 |
| RF2o | 1009 | perfil | §6.2 | sin cambio | 11.1, 11.2 NOTE 1, A.4.6.3.2 |
| RF2 | 1011 | canon | §6.2 | sin cambio | 10.1, 10.3.3.1 |
| RF2 | 1015 | canon | §6.2 | corregida: Objeto: atributos, así como operaciones; proceso: operaciones, así como atributos. | 10.3.3.1 NOTE, A.4.6.3.2 |
| RF2 | 1017 | canon | §6.2 | corregida: Los rasgos de un exhibidor se enumeran en una oración (A.4.6.3.2); zona prohibida, fuera. | A.4.6.3.2 |
| RF2 | 1023 | canon | §6.2 | corregida: «**Atributo** de **Objeto** es valor» es la oración de exhibición de A.4.6.4 (rasgo de exhibidor, 10.3.3.2.2), distinta de la de caracterización con «exhibe». | 10.3.3.2.2, 11.3, A.4.6.4 |
| RF3 | 1034 | canon | §6.3 | sin cambio | 10.3.4.1, A.4.6.5 |
| RF3b | 1035 | canon | §6.3 | sin cambio | 10.3.4.1 Fig. 24, A.4.6.5 |
| RX1 | 1036 | canon | §6.3 | corregida: **Especial** puede ser o bien **General1** o bien **General2**. | A.4.6.5 |
| RX2 | 1037 | canon | §6.3 | sin cambio | A.4.6.5 |
| RH1 | 1038 | canon | §6.3 | sin cambio | 10.3.4.2, A.4.6.5 |
| RF3 | 1039 | canon | §6.3 | sin cambio | 10.3.4.1, A.4.6.5 |
| RF3 | 1041 | canon | §6.3 | sin cambio | Tabla 14, A.4.6.5 |
| RF3 | 1043 | canon | §6.3 | sin cambio | 10.3.4.1, 10.3.4.2 |
| R-EST-GEN-1 | 1046 | fusionada→ R-OPL-RF-5 | §6.3 | corregida: alias de R-OPL-RF-5 | A.4.6.5 |
| R-EST-GEN-2 | 1052 | fusionada→ R-OPL-RF-6 | §6.3 | corregida: alias de R-OPL-RF-6 | 10.3.4.2, A.4.6.5 |
| RF3 | 1058 | canon | §6.3 | sin cambio | A.4.6.5 |
| RF3 | 1060 | perfil | §6.3 | sin cambio |  |
| RF4 | 1077 | canon | §6.4 | sin cambio | 10.3.5.1, A.4.6.6 |
| RF4b | 1078 | canon | §6.4 | sin cambio | 10.3.5.1, A.4.6.6 |
| R-STRF-3 | 1080 | canon | §6.4 | sin cambio | 10.3.5.1 NOTE 3, A.4.6.6 |
| RF4 | 1082 | canon | §6.4 | corregida: Misma perseverancia (10.3.1); la distinción apariencia/instancia lógica va a la documentación de producto. | 10.3.1, B.5 |
| RF4 | 1086 | canon | §6.4 | sin cambio | A.4.6.6 |
| RF4 | 1088 | perfil | §6.4 | sin cambio |  |
| SE1 | 1103 | canon | §6.5 | sin cambio | 10.2.1 |
| SE2 | 1104 | canon | §6.5 | sin cambio | 10.2.2 |
| SE3 | 1105 | canon | §6.5 | sin cambio | 10.2.3 |
| SE4 | 1106 | canon | §6.5 | sin cambio | 10.2.4 |
| SE5 | 1107 | canon | §6.5 | sin cambio | 10.2.4 |
| SE1 | 1109 | canon | §6.5 | corregida: La etiqueta es una frase del modelador que se distingue tipográficamente (10.2.1 NOTE). | 10.1, 10.2.1 NOTE |
| R-STRE-1 | 1111 | perfil | §6.5 | sin cambio | 10.2.4 |
| R-OPL-SE-5 | 1113 | canon | §6.5 | corregida: El modelador PUEDE fijar una etiqueta nula por defecto distinta (10.2.2 NOTE; A.4.6.2.2). | 10.2.2 NOTE, A.4.6.2.2 |
| R-EST-TAG-1 | 1116 | fusionada→ R-OPL-SE-2 | §6.5 | corregida: alias de R-OPL-SE-2 | 10.1 |
| R-EST-TAG-2 | 1120 | fusionada→ R-OPL-SE-5 | §6.5 | corregida: alias de R-OPL-SE-5 | 10.2.2, 10.2.4 |
| SE1 | 1130 | canon | §6.5 | sin cambio | 10.2, A.4.6.2 |
| SE1 | 1132 | canon | §6.5 | corregida: La lista bifurcada PUEDE llevar «, ordenados por <criterio>» y, sólo tras éste, «, en esa secuencia»; restricciones de participación en ambos extremos. | 11.1 a), A.4.6.2.2 |
| SE3 | 1138 | perfil | §6.5 | sin cambio | 10.2.3, 10.2.4 |
| SSE1 | 1149 | canon | §6.6 | sin cambio | 10.4.2.2, Tabla 15 |
| SSE2 | 1150 | canon | §6.6 | sin cambio | 10.4.2.3, Tabla 15 |
| SSE3 | 1151 | canon | §6.6 | sin cambio | 10.4.2.4, Tabla 15 |
| SSE4 | 1152 | canon | §6.6 | sin cambio | 10.4.2.5, Tabla 15 |
| SSE5 | 1153 | canon | §6.6 | corregida: Presentar SSE4+SSE5 como un solo tipo (dos oraciones) y añadir el bidireccional con estado en ambos extremos (10.4.2.6). | 10.4.2.5, Tabla 15 |
| SSE6 | 1154 | canon | §6.6 | sin cambio | 10.4.2.8, Tabla 15 |
| SSE7 | 1155 | canon | §6.6 | sin cambio | 10.4.2.7, Tabla 15 |
| SSE1 | 1157 | canon | §6.6 | sin cambio | 10.4.2 |
| R-EST-SSE-1 | 1160 | canon | §6.6 | corregida: redactada de nuevo con cita ISO | 10.4.2.5, 10.4.2.7, Tabla 15 |
| SSE1 | 1166 | canon | §6.6 | sin cambio | 10.4.2 |
| — | 1187 | canon | §7 | corregida: La gestión de contexto expresa la relación de refinamiento entre OPDs; los refinados y sus enlaces son hechos del modelo sujetos a 14.2.3. | 14.2.1, 14.2.3, 14.2.1.2 |
| R-CX-0 | 1195 | perfil | §7.0 | sin cambio | 10.3.1, 14.2.1.2 |
| R-CX-1 | 1199 | fusionada→ R-REF-4 | §7.0 | corregida: alias de R-REF-4 | 14.2.3, 10.3.1 |
| CX1 | 1214 | canon | §7.1 | sin cambio | 14.2.1.3, 14.2.2.1, A.4.7.4 |
| CX2 | 1215 | canon | §7.1 | sin cambio | 14.2.2.2, A.4.7.4 |
| CX1 | 1216 | canon | §7.1 | sin cambio | 14.2.2.2 Fig. 49, A.4.7.4 |
| CX1 | 1217 | canon | §7.1 | corregida: *Proceso* se descompone en *P1* y *P2*, en esa secuencia, así como **ObjetoInterno**. | A.4.7.4 |
| CX1 | 1219 | canon | §7.1 | corregida: El orden temporal se deriva de la altura del punto superior de cada subproceso (14.2.2.1); suprimir el umbral ≥2. | 14.2.2.1, 14.2.2.2 |
| CX1 | 1225 | canon | §7.1 | corregida: *proceso* → `se descompone en` → [`paralelo`] subprocesos [`, en esa secuencia`] [`, así como` objetos internos]. | A.4.7.4 |
| CX1 | 1227 | canon | §7.1 | corregida: Los subprocesos se enumeran en una sola oración (A.4.7.4); zona prohibida, fuera. | A.4.7.4 |
| R-ROL-1 | 1233 | canon | §7.1 | corregida: Citar la NOTE 2 de Tabla 25; suprimir «solo en descomposición». | 14.2.2.4.3 Tabla 25 NOTE 2 |
| CX3 | 1244 | canon | §7.2 | corregida: **Cosa** se despliega en **T1**, **T2** y **T3**. — o con OPDs: «**Todo** de SD se despliega por partes en SD1 en **P1** y **P2**.» (A.4.7.2). | 14.2.1.2, A.4.7.2 |
| CX3 | 1245 | canon | §7.2 | corregida: En el mismo OPD el despliegue se expresa con la oración estructural (agregación: «consta de»); en OPD nuevo con «se despliega en» o la forma específica de A.4.7.2. | 14.2.1.2, A.4.7.1 |
| CX5 | 1250 | canon | §7.2 | corregida: **Objeto** es plegado de SD1. / *Proceso* es plegado de SD1. | A.4.7.3 |
| CX5 | 1254 | canon | §7.2 | corregida: La oración de plegado equivale al contorno grueso del refinable cuyo despliegue produce un OPD hijo (A.4.7.3). | 14.2.1.2, A.4.7.3 |
| R-CX-DESP-1 | 1257 | fusionada→ R-REF-MEC-1 | §7.2 | corregida: alias de R-REF-MEC-1 | 14.2.1.2 |
| R-CX-DESP-2 | 1260 | canon | §7.2 | corregida: Fundar en A.4.7.2 (sin «in that sequence») y 14.2.1.2 NOTE 5; advertir que el in-zoom de objeto sí lleva «en esa secuencia». | 14.2.1.2 NOTE 5, A.4.7.2 |
| CX3 | 1268 | canon | §7.2 | corregida: Adoptar los órdenes de A.4.7.2/A.4.7.3 («X de SD se despliega por … en SD1 en …»; «X es plegado de SD1»). | A.4.7.2, A.4.7.3 |
| CX3 | 1276 | canon | §7.2 | corregida: Los refinados se conectan por enlaces estructurales fundamentales (14.2.1.2); R-ROL-2 sale del canon. | 14.2.1.2 |
| CX4 | 1287 | canon | §7.3 | sin cambio | 14.2.2.6.1.4 |
| CX4 | 1288 | canon | §7.3 | corregida: SD se refina por despliegue de *Proceso* en SD1. | 14.2.2.6.1.4, 14.2.2.6.1.2 |
| CX4 | 1290 | canon | §7.3 | sin cambio | 14.2.2.6.1.4, 14.2.2.6.2 |
| CX4 | 1292 | perfil | §7.3 | sin cambio | 10.3.1 |
| CX-EST | 1308 | canon | §7.4 | sin cambio | 14.2.1, 14.2.1.1 |
| R-OPL-TOTAL-4 | 1310 | canon | §7.4 | sin cambio | 14.2.1.1 |
| R-CX-EST-1 | 1313 | canon | §7.4 | corregida: Añadir: con supresión parcial, la enumeración termina en «u otros estados» (14.2.1.1). | 7.3.5, 14.2.1.1 |
| R-CX-EST-2 | 1316 | canon | §7.4 | sin cambio | 14.2.1.1 |
| R-CX-SYNC-1 | 1337 | fusionada→ R-REF-SYNC-1 | §7.5 | corregida: alias de R-REF-SYNC-1 | 14.2.2.1, 14.2.2.5 |
| R-CX-SYNC-2 | 1340 | fusionada→ R-CX-DESP-2 | §7.5 | corregida: alias de R-CX-DESP-2 | 14.2.2.5, 14.2.1.2 NOTE 5 |
| CX-DIST | 1359 | eliminada-duplicada→ reglas §8.5 | §7.6 | corregida: definición única en reglas §8.5; aquí se cita | 14.2.2.4.1 |
| CX-DIST | 1360 | canon | §7.6 | corregida: el canon sigue la norma (ISO §14.2.2.4): consumo y resultado se anclan por defecto al primer subproceso y el modelador los reasigna; el perfil conserva el defecto de OpForja (resultado al último) como [desviación declarada] | 14.2.2.4.1 |
| CX-DIST | 1361 | eliminada-duplicada→ reglas §8.5 | §7.6 | corregida: definición única en reglas §8.5; aquí se cita | 14.2.2.4.1, 14.2.1.3 Fig. 46 |
| CX-DIST | 1362 | eliminada-duplicada→ reglas §8.5 | §7.6 | corregida: definición única en reglas §8.5; aquí se cita | 14.2.2.4.3 |
| CX-DIST | 1363 | eliminada-duplicada→ reglas §8.5 | §7.6 | corregida: definición única en reglas §8.5; aquí se cita | 14.2.2.4.1 Fig. 50 |
| CX-DIST | 1364 | eliminada-duplicada→ reglas §8.5 | §7.6 | corregida: definición única en reglas §8.5; aquí se cita | 14.2.2.4.1 Fig. 50 |
| CX-DIST | 1365 | eliminada-duplicada→ reglas §8.5 | §7.6 | corregida: definición única en reglas §8.5; aquí se cita | 14.2.2.4.1 |
| CX-DIST | 1366 | eliminada-duplicada→ reglas §8.5 | §7.6 | corregida: definición única en reglas §8.5; aquí se cita | 14.2.2.4.2 |
| CX-DIST | 1367 | eliminada-duplicada→ reglas §8.5 | §7.6 | corregida: definición única en reglas §8.5; aquí se cita | 14.2.2.4.2 |
| R-CX-DIST-1 | 1370 | canon→ R-DIST-1 | §7.6 | corregida: alias de R-DIST-1 (canon reglas §8.5); el anclaje por defecto sigue ISO §14.2.2.4 (primer subproceso); la parte «resultado→último» pasa al perfil como [desviación declarada] | 14.2.2.4.1 |
| R-CX-DIST-2 | 1373 | eliminada-duplicada→ reglas §8.5 | §7.6 | corregida: definición única en reglas §8.5; aquí se cita | 14.2.2.4.2 |
| R-CX-ESC-1 | 1381 | fusionada→ R-ESCIND-1 | §7.6.1 | corregida: alias de R-ESCIND-1 | 14.2.2.4.3 |
| R-CX-ESC-2 | 1382 | fusionada→ R-ESCIND-2 | §7.6.1 | corregida: alias de R-ESCIND-2 | Tabla 25 |
| R-CX-ESC-3 | 1383 | fusionada→ R-ESCIND-3 | §7.6.1 | corregida: alias de R-ESCIND-3 | Tabla 25 |
| R-CX-ESC-4 | 1384 | fusionada→ R-ESC-1 | §7.6.1 | corregida: alias de R-ESC-1 | Tabla 25 NOTE 1 |
| — | 1431 | perfil | §8 | sin cambio | 9.5.1, 11, 12, 13 |
| — | 1438 | perfil | §8 | sin cambio |  |
| R-COMB-1 | 1444 | perfil | §8.0 | sin cambio |  |
| R-COMB-2 | 1448 | canon | §8.0 | sin cambio | 9.5.1 |
| R-COMB-3 | 1452 | perfil | §8.0 | sin cambio | 9.5.1, 9.5.4 |
| R-COMB-4 | 1456 | canon | §8.0 | corregida: La probabilidad se expresa «con probabilidad p» tras cada cosa del abanico, no como sufijo final `Pr=p`. | 12.7 |
| R-COMB-5 | 1460 | canon | §8.0 | corregida: Por ruta L, *P* consume **A** y **B**. (la ruta no impide la conjunción). | 13 Fig. 44, 12.1 |
| R-COMB-6 | 1464 | canon | §8.0 | sin cambio | 11.1, 11.2 NOTE 2 |
| FAN-XOR | 1472 | canon | §8.1 | corregida: Un abanico agrupa n≥2 enlaces del mismo tipo con extremo común y semántica XOR u OR (12.2); el AND es el grupo de enlaces que no se tocan (12.1). | 12.1, 12.2 |
| FAN-AND | 1478 | canon | §8.1 | corregida: AND: una sola oración con «y» («*Cocinar* consume **Agua** y **Sal**.»). | 12.1 |
| FAN-XOR | 1479 | canon | §8.1 | sin cambio | 12.2 |
| FAN-OR | 1480 | canon | §8.1 | sin cambio | 12.2 |
| R-FAN-1 | 1482 | canon | §8.1 | corregida: El AND se realiza con «y» en una sola oración; NO DEBE inventarse «todos de». Correcto: «*Cocinar* consume **Agua** y **Sal**.» | 12.1 |
| R-FAN-2 | 1488 | canon | §8.1 | corregida: Correcto (efecto, procesos alternativos): «Exactamente uno de *P*, *Q* o *R* afecta **B**.» | 12.2, Tablas 17–21 |
| R-FAN-3 | 1496 | canon | §8.1 | corregida: Adoptar las formas de Tablas 22–23; el patrón sobre abanico convergente de objetos y el fallback mixto, fuera. | 12.5, Tabla 22, Tabla 23 |
| R-FAN-4 | 1501 | canon | §8.1 | corregida: **B** inicia exactamente uno de *P*, *Q* o *R*, en cuyo caso el proceso que ocurre afecta **B**. | 12.5, Tabla 22, 9.5.1 |
| R-FAN-5 | 1505 | canon | §8.1 | corregida: Cada rama PUEDE especificar estado (12.4); el abanico conserva su verbo: «*P* genera exactamente uno de **Obj** en `s1`, **Obj** en `s2` u **Obj** en `s3`.» | 12.4, 12.7 Fig. 40 |
| R-FAN-5A | 1509 | canon | §8.1 | corregida: redactada de nuevo con cita ISO | 12.4, 12.6 |
| R-FAN-6 | 1521 | fusionada→ R-PROB-3 | §8.1 | corregida: alias de R-PROB-3 | 12.7 |
| R-FAN-7 | 1525 | eliminada-duplicada→ reglas §7.5 | §8.1 | corregida: definición única en reglas §7.5; aquí se cita | 12.7 |
| R-FAN-8 | 1529 | perfil | §8.1 | sin cambio |  |
| MULT-COMB | 1537 | canon | §8.2 | corregida: ?→«un/una opcional»; *→«opcionales» (plural); +→«al menos un/una»; rango «qmín a qmáx», varios rangos con «o»; sin intervalos abiertos. | 11.1, Tabla 16, 11.2 |
| R-MULT-COMB-1 | 1539 | fusionada→ R-OPL-PART-1 | §8.2 | corregida: alias de R-OPL-PART-1 | 11.1, 11.2 NOTE 2 |
| R-MULT-COMB-2 | 1543 | perfil | §8.2 | sin cambio | 11.1, 12.2, A.4.3 |
| R-MULT-COMB-3 | 1547 | fusionada→ R-MULT-2 | §8.2 | corregida: alias de R-MULT-2 | 11.2, 11.2 NOTE 2 |
| C-01 | 1557 | canon | §8.3 | sin cambio | 9.5.2.1.1 |
| C-02 | 1558 | canon | §8.3 | sin cambio | 9.5.3.1.1 |
| C-03 | 1559 | canon | §8.3 | sin cambio | 9.5.1 |
| C-04 | 1560 | canon | §8.3 | sin cambio | 9.5.1 |
| C-05 | 1561 | canon | §8.3 | sin cambio | 9.5.2.1.2 |
| C-06 | 1562 | canon | §8.3 | sin cambio | 9.5.3.1.2 |
| C-07 | 1563 | canon | §8.3 | sin cambio | 9.5.2.2.1 |
| C-08 | 1564 | canon | §8.3 | sin cambio | 9.5.3.2.1 |
| C-09 | 1565 | canon | §8.3 | sin cambio | 9.5.2.2.2 |
| C-10 | 1566 | canon | §8.3 | sin cambio | 9.5.3.2.2 |
| C-11 | 1567 | canon | §8.3 | sin cambio | Tabla 17 |
| C-12 | 1568 | canon | §8.3 | sin cambio | Tabla 17 |
| C-13 | 1569 | canon | §8.3 | corregida: Añadir OR divergente y los abanicos convergentes de resultado de Tabla 17. | Tabla 18 |
| C-14 | 1570 | canon | §8.3 | sin cambio | Tabla 19 |
| C-15 | 1571 | canon | §8.3 | sin cambio | Tabla 20, 12.2 EXAMPLE, A.4.5.3.2 |
| C-16 | 1572 | canon | §8.3 | sin cambio | Tabla 20, A.4.5.3.3 |
| C-17 | 1573 | canon | §8.3 | sin cambio | Tabla 21 |
| C-18 | 1574 | canon | §8.3 | corregida: Usar las formas de Tablas 22–23 (objeto común, procesos alternativos). | 12.5, Tabla 23 |
| C-19 | 1575 | canon | §8.3 | corregida: **B** inicia exactamente uno de *P*, *Q* o *R*, en cuyo caso el proceso que ocurre afecta **B**. | Tabla 22 |
| C-19b | 1576 | canon | §8.3 | corregida: Consumo: «**B** inicia exactamente uno de *P*, *Q* o *R*, que consume **B**.»; agente: «… inicia y maneja exactamente uno de …»; instrumento: «… , que requiere **B**.» | 12.5, 12.6, Tabla 23 |
| C-20 | 1577 | canon | §8.3 | sin cambio | 9.5.1, 12.5 |
| C-21 | 1578 | canon | §8.3 | corregida: Abanico de estados conserva el verbo del rol (genera/consume/cambia según corresponda). | 12.4, 12.7 |
| C-21b | 1579 | canon | §8.3 | corregida: redactada de nuevo con cita ISO | 12.4 |
| C-22 | 1580 | canon | §8.3 | corregida: *P* genera **A** con probabilidad 0.6 o **B** con probabilidad 0.4. | 12.7 |
| C-23 | 1581 | canon | §8.3 | sin cambio | 12.7 |
| C-24 | 1582 | canon | §8.3 | corregida: Siguiendo la ruta L1, *P* consume **A**. (con lista AND permitida). | 13 Fig. 44 |
| C-26 | 1584 | perfil | §8.3 | sin cambio | 9.5.1 |
| C-27 | 1585 | canon | §8.3 | sin cambio | 9.5.1, 10.1 |
| C-28 | 1586 | canon | §8.3 | corregida: invocación × `e`/`c`: inválida (9.5.1). | 9.5.1 |
| C-29 | 1587 | canon | §8.3 | corregida: Citar Tabla 25 NOTE 1. | Tabla 25 NOTE 1 |
| C-30 | 1588 | canon | §8.3 | sin cambio | 8.1.2, 14.2.4 |
| C-31 | 1589 | canon | §8.3 | sin cambio | 14.2.4.2, Tabla 27 |
| — | 1599 | perfil | §8.4 | sin cambio |  |
| — | 1603 | perfil | §8.4 | sin cambio | 9.5.1 |
| — | 1604 | canon | §8.4 | sin cambio | 12.7 |
| — | 1605 | canon | §8.4 | corregida: Mover a la lista de combinaciones inválidas. | 9.5.1 |
| — | 1606 | perfil | §8.4 | sin cambio | 12.5 |
| R-ZNC-COMB-1 | 1608 | perfil | §8.4 | sin cambio |  |
| — | 2199 | canon | §18 | corregida: La base de §18 traduce el Anexo A de ISO 19450 producción a producción; toda producción sin contraparte en A.3–A.4 se marca (* ext *) o (* fuera del Anexo A: cláusula n *). | A.1, A.2 |
| — | 2203 | canon | §18 | sin cambio | A.4.1 |
| — | 2205 | canon | §18 | corregida: oracion_formal_opl_es = oracion_de_descripcion_de_cosa \| oracion_procedimental \| oracion_estructural \| oracion_de_gestion_de_contexto ; | A.4.1 |
| — | 2212 | canon | §18 | sin cambio | A.3.2 |
| — | 2215 | canon | §18 | sin cambio | A.3.2 |
| — | 2217 | canon | §18 | corregida: redactada de nuevo con cita ISO | A.3.3, 14.2 |
| — | 2218 | canon | §18 | sin cambio | A.3.2 |
| — | 2220 | canon | §18 | corregida: frase_no_capitalizada = palabra_no_capitalizada, { " ", ( palabra_no_capitalizada \| palabra_capitalizada ) } ; | A.3.2 |
| — | 2221 | canon | §18 | corregida: redactada de nuevo con cita ISO | A.3.2 |
| — | 2228 | canon | §18 | corregida: caracter_de_cadena = letra \| digito_decimal \| '-' \| '\|' \| '&' \| '/' \| ' ' ; | A.3.2 |
| — | 2229 | canon | §18 | sin cambio | A.3.2, A.4.4.3 |
| — | 2230 | canon | §18 | corregida: prefijo = "unsigned " ; | A.3.2 |
| — | 2232 | canon | §18 | sin cambio | A.3.2, 11.1 |
| — | 2234 | canon | §18 | corregida: singular_minuscula = "un" \| "una" \| "un opcional" \| "una opcional" \| "al menos un" \| "al menos una" ; singular_mayuscula = "Un" \| "Una" \| "Un opcional" \| "Una opcional" \| "Al menos un" \| "Al menos una" ; plural_minuscula = "opcionales" \| "muchos" \| "muchas" ; plural_mayuscula = "Opcionales" \| "Muchos" \| "Muchas" ; | A.3.2, 11.1 |
| — | 2238 | canon | §18 | corregida: limite_de_participacion = entero_positivo \| numero_real_positivo \| nombre_simple ; | A.3.2, 11.1 |
| — | 2239 | canon | §18 | corregida: unidad_de_medida = nombre ; | A.3.3 |
| — | 2240 | canon | §18 | corregida: numero_real_positivo = {digito_decimal}, ".", digito_decimal, {digito_decimal} ; nombre_de_valor = nombre \| numero_decimal ; | A.3.2, A.3.3 |
| — | 2242 | perfil | §18 | sin cambio | 11.1, 11.3, A.3.2 |
| — | 2247 | canon | §18 | corregida: clausula_de_rango = " es ", nombre_de_valor \| " varía de ", nombre_de_valor, " a ", nombre_de_valor ; | A.3.2, 11.3 |
| — | 2251 | canon | §18 | corregida: Añadir: nombre_singular_de_objeto, " objeto", [...] \| nombre_plural_de_objeto, " en ", unidad_de_medida, [...] \| nombre_plural_de_objeto, " objetos", [...] ; | A.4.2, 11.1 |
| — | 2252 | canon | §18 | corregida: identificador_de_proceso = nombre_singular_de_proceso, [" proceso"] \| nombre_plural_de_proceso, [" procesos"] ; | A.4.2 |
| — | 2253 | canon | §18 | sin cambio | A.4.2 |
| — | 2254 | canon | §18 | sin cambio | A.4.2 |
| — | 2255 | canon | §18 | sin cambio | A.4.2 |
| — | 2256 | canon | §18 | corregida: nombre_singular_de_objeto = palabra_capitalizada, { " ", ( palabra_capitalizada \| palabra_no_capitalizada ) } ; (ídem proceso) y añadir nombre_plural_de_objeto / nombre_plural_de_proceso. | A.3.3, A.3.1 |
| — | 2258 | canon | §18 | sin cambio | A.4.4.4 |
| — | 2260 | canon | §18 | sin cambio | A.4.3 |
| — | 2261 | canon | §18 | corregida: objeto_origen = objeto_con_opcion_de_estado ; objeto_destino = objeto_con_opcion_de_estado ; | A.4.6.2.2, 10.4.2 |
| — | 2263 | canon | §18 | sin cambio | A.4.6.2.2, A.4.6.3.1, A.4.6.5, A.4.6.6 |
| — | 2272 | canon | §18 | sin cambio | A.4.6.5 |
| — | 2273 | perfil | §18 | sin cambio |  |
| — | 2274 | canon | §18 | corregida: redactada de nuevo con cita ISO | A.3.3, 14.2.2.6 |
| — | 2277 | canon | §18 | sin cambio | A.4.4.4 |
| — | 2278 | canon | §18 | corregida: max_duracion_unidades_tiempo = nombre_de_valor, " ", unidad_de_medida ; min_duracion_unidades_tiempo = nombre_de_valor, " ", unidad_de_medida ; | A.3.3, 9.5.4.2, 9.5.4.3 |
| — | 2280 | canon | §18 | corregida: lista_de_estados_o = e \| e, {", ", e}, (" o " \| " u "), e ; lista_de_estados_y = e \| e, {", ", e}, (" y " \| " e "), e ; | A.4.3 |
| — | 2281 | canon | §18 | corregida: lista_de_objetos = o \| o, {", ", o}, (" y " \| " e "), o ; (ídem procesos, atributos, operadores) | A.4.3, A.4.6.3.2 |
| — | 2285 | canon | §18 | sin cambio | A.4.6.5, A.4.6.6 |
| — | 2289 | canon | §18 | sin cambio | A.4.6.5 |
| — | 2291 | canon | §18 | sin cambio | A.4.3, 11.1 |
| — | 2293 | canon | §18 | sin cambio | A.4.6.2.2 |
| — | 2297 | canon | §18 | corregida: oracion_de_descripcion_de_cosa = oracion_de_propiedad_generica \| oracion_de_tipo_de_dato \| oracion_de_descripcion_de_estado ; oracion_de_descripcion_de_estado = enumeración \| iniciales \| finales \| por defecto \| combinada ; | A.4.4.1, A.4.4.4 |
| — | 2305 | canon | §18 | sin cambio | A.4.4.3 |
| — | 2306 | canon | §18 | corregida: oracion_de_propiedad_generica = identificador_de_cosa, " es ", propiedad, { (", " \| " y "), propiedad } ; con a lo sumo una de cada clase | A.4.4.2 |
| — | 2309 | perfil | §18 | sin cambio | A.4.4.2 |
| — | 2313 | canon | §18 | corregida: objeto, " está en ", estado \| objeto, " puede estar ", lista_de_estados_o \| objeto, " puede estar ", e, {", ", e}, ", y otros estados" ; | A.4.4.4 |
| — | 2314 | canon | §18 | corregida: traducción fiel del Anexo A | A.4.4.4 |
| — | 2316 | canon | §18 | corregida: traducción fiel del Anexo A | A.4.4.4 |
| — | 2317 | perfil | §18 | sin cambio | 3.69 |
| — | 2318 | canon | §18 | sin cambio | A.4.4.2 |
| — | 2323 | canon | §18 | sin cambio | A.4.5.1, A.4.5.2.1, A.4.5.4.1 |
| — | 2327 | canon | §18 | corregida: oracion_de_consumo = identificador_de_proceso, " consume ", lista_de_objetos_procedimentales \| oracion_de_consumo_selectiva ; | A.4.5.2.2, 11.1 |
| — | 2328 | canon | §18 | corregida: oracion_de_resultado = identificador_de_proceso, " genera ", lista_de_objetos_procedimentales \| oracion_de_resultado_selectiva ; | A.4.5.2.3, 11.1 |
| — | 2329 | canon | §18 | corregida: oracion_de_efecto = identificador_de_proceso, " afecta ", lista_de_objetos_con_multiplicidad \| oracion_de_efecto_selectiva ; (sin estado) | A.4.5.2.4 |
| — | 2330 | canon | §18 | corregida: " cambia ", lista_de_frases_de_cambio_* ; con lista = frase {", " frase} " y " frase, más las variantes select | A.4.5.2.5 |
| — | 2338 | canon | §18 | corregida: Xor: " a uno de ", lista_de_estados_o ; Or: " a ", lista_de_estados_o ; y añadir la simétrica en la entrada (" de ", lista, " a ", estado). | A.4.5.2.5, 12.2 |
| — | 2340 | canon | §18 | sin cambio | A.4.5.3.1 |
| — | 2341 | canon | §18 | corregida: oracion_de_agente = objeto_procedimental, " maneja ", proceso \| lista_de_objetos_procedimentales(≥2), " manejan ", proceso \| oracion_de_agente_selectiva ; | A.4.5.3.2, 11.1 |
| — | 2342 | canon | §18 | corregida: oracion_de_instrumento = identificador_de_proceso, " requiere ", lista_de_objetos_procedimentales \| oracion_de_instrumento_selectiva ; | A.4.5.3.3, 11.1 |
| — | 2343 | canon | §18 | sin cambio | A.4.5.4.1 |
| — | 2344 | canon | §18 | sin cambio | A.4.5.4.2 |
| — | 2346 | canon | §18 | sin cambio | A.4.5.4.2, 9.5.2.1, 11.1 |
| — | 2348 | canon | §18 | corregida: Añadir: objeto " en " e_in " inicia " P ", que cambia " frase_de_cambio_entrada_salida \| … ", que cambia " O " de " e_in \| O " en cualquier estado inicia " P ", que cambia " O " a " e_out ; | A.4.5.4.2, 9.5.2.3 |
| — | 2350 | canon | §18 | sin cambio | A.4.5.4.2, 9.5.2.2 |
| — | 2351 | canon | §18 | sin cambio | A.4.5.4.2, 9.5.2.2 |
| — | 2353 | canon | §18 | sin cambio | A.4.5.4.4, 9.5.2.5 |
| — | 2355 | canon | §18 | sin cambio | A.4.5.4.5, 9.5.4.2, 9.5.4.3 |
| — | 2360 | canon | §18 | corregida: Hacerla alcanzable (oracion_procedimental \| oracion_de_ruta) y marcarla (* fuera del Anexo A: cl. 13, Fig. 44 *). | A.1, 13 |
| — | 2363 | perfil | §18 | sin cambio | 12.2, A.4.5.2.2 |
| — | 2366 | canon | §18 | sin cambio | A.4.5.4.3 |
| — | 2370 | canon | §18 | sin cambio | A.4.5.4.3, 9.5.3.1 |
| — | 2375 | canon | §18 | corregida: Añadir \| "Si ", O, " en ", e, " existe entonces ", P, " ocurre y consume ", O, ", de lo contrario se omite ", P ; | A.4.5.4.3, 9.5.3.3 |
| — | 2378 | canon | §18 | corregida: Añadir a cada una la alternativa ISO «…, de lo contrario se omite P» / «Si O existe entonces P ocurre y afecta O, de lo contrario se omite P». | A.4.5.4.3, 9.5.3.1, 9.5.3.3 |
| — | 2397 | canon | §18 | corregida: Ligar ambos objetos al mismo agente y añadir la alternativa «Si O existe entonces O maneja P, de lo contrario se omite P». | A.4.5.4.3, 9.5.3.2, 9.5.3.4 |
| — | 2404 | canon | §18 | corregida: Añadir \| "Si ", objeto_con_opcion_de_estado, " existe entonces ", P, " ocurre, de lo contrario se omite ", P ; | A.4.5.4.3, 9.5.3.2, 9.5.3.4 |
| — | 2410 | canon | §18 | sin cambio | A.3.2 |
| — | 2412 | canon | §18 | sin cambio | A.3.2 |
| — | 2415 | canon | §18 | corregida: conjunto = cosa \| ( cosa, {", ", cosa}, " y ", ( cosa \| "más" ) ), [ ", ordenados por ", criterio, [ ", en esa secuencia" ] ] ; | A.4.6.2.2 |
| — | 2422 | canon | §18 | corregida: oracion_basica_xor_objeto = objeto_especial, " puede ser o bien ", objeto_general, " o bien ", objeto_general ; y añadir la variante de proceso. | A.4.6.5 |
| — | 2426 | canon | §18 | corregida: lista_de_objetos_generales = articulo, identificador_de_objeto, { ", ", articulo, identificador_de_objeto }, " y ", articulo, identificador_de_objeto ; | A.4.6.5 |
| — | 2431 | canon | §18 | corregida: Añadir oracion_de_exhibicion (A.4.6.4) y quitar oracion_de_rasgo_opcional de la base. | A.4.6.1 |
| — | 2434 | canon | §18 | sin cambio | A.4.6.2.1, A.4.6.2.2 |
| — | 2438 | canon | §18 | sin cambio | A.4.6.2.2 |
| — | 2447 | canon | §18 | corregida: etiqueta_nula_unidireccional = " se relaciona con " \| " se relacionan con " \| " ", etiqueta_nula_definida_por_usuario, " " ; | A.4.6.2.2, 10.2.2 |
| — | 2448 | canon | §18 | sin cambio | A.4.6.2.2 |
| — | 2458 | canon | §18 | corregida: Rodear etiqueta_directa_bidireccional y etiqueta_inversa_bidireccional con " ". | A.4.6.2.3 |
| — | 2466 | canon | §18 | corregida: etiqueta_nula_bidireccional = " se relacionan" ; (la etiqueta de usuario ya entra por " son ", etiqueta_simetrica) | A.4.6.2.3, 10.2.4 |
| — | 2478 | canon | §18 | sin cambio | A.4.6.2.3 |
| — | 2484 | canon | §18 | sin cambio | A.4.6.3.1, 10.3.2 |
| — | 2487 | perfil | §18 | sin cambio | A.4.6.3.1 |
| — | 2491 | canon | §18 | corregida: Añadir las formas parciales: «exhibe lista y al menos otro atributo», «… y al menos otra operación» y la parcial con «así como». | A.4.6.3.2, 10.3.3.1 |
| — | 2500 | canon | §18 | corregida: Reagrupar por objeto/proceso/estado y añadir las variantes faltantes (parcial, básica de proceso, XOR y herencia de procesos). | A.4.6.5 |
| — | 2503 | canon | §18 | corregida: Exigir ≥2 especiales para «son» y añadir oracion_basica_de_especializacion_proceso = proceso_especial, " es ", proceso_general ; | A.4.6.5 |
| — | 2505 | canon | §18 | corregida: Añadir la básica «O en s es un O' en s'» y la parcial «…, y otras especializaciones son …». | A.4.6.5 |
| — | 2506 | canon | §18 | sin cambio | A.4.6.5 |
| — | 2508 | canon | §18 | sin cambio | A.4.6.6, 10.3.5.1 |
| — | 2515 | canon | §18 | corregida: Quitar composicion_intermodelo y referencia_externa. | A.4.7.1 |
| — | 2518 | perfil | §18 | sin cambio |  |
| — | 2522 | canon | §18 | sin cambio | A.4.7.2 |
| — | 2536 | canon | §18 | sin cambio | A.4.7.2 |
| — | 2549 | canon | §18 | corregida: oracion_de_plegado_objeto = identificador_de_objeto, " es plegado de ", opd_hijo ; (ídem proceso) | A.4.7.3 |
| — | 2552 | canon | §18 | sin cambio | A.4.7.4 |
| — | 2557 | canon | §18 | corregida: Rehacer el comentario: sigue la OPL de 14.2.2.2 (Fig. 49), que generaliza la tercera alternativa de A.4.7.4; no es «corrección local». | 14.2.2.2, A.4.7.4 |
| — | 2560 | canon | §18 | sin cambio | A.4.7.4, 14.2.2.1 |
| — | 2566 | canon | §18 | sin cambio | A.4.7.4 |
| — | 2574 | canon | §18 | sin cambio | A.4.7.4 |
| — | 2579 | canon | §18 | sin cambio | A.4.7.4 |
| — | 2581 | canon | §18 | sin cambio | A.4.7.5 |
| — | 2591 | perfil | §18 | sin cambio |  |
| — | 2592 | perfil | §18 | sin cambio | A.4.5 |
| — | 2599 | perfil | §18 | sin cambio | A.4.5.2.2, 12.2 |
| — | 2600 | perfil | §18 | sin cambio | A.4.6.3.1, A.4.6.3.2 |
| — | 2602 | perfil | §18 | sin cambio | A.4.5.3.2 |
| — | 2606 | canon | §18 | corregida: Mover salto_de_linea a la base (A.1/A.2). | A.3.3, A.4.1 |
| R-§18-LEX-1 | 2619 | fusionada→ R-OPL-LEX-1 | §18 | corregida: alias de R-OPL-LEX-1 | A.3.2 |
| R-§18-PART-1 | 2620 | fusionada→ R-OPL-PART-1 | §18 | corregida: alias de R-OPL-PART-1 | A.3.2, 11.1 |
| R-§18-RANGO-1 | 2621 | fusionada→ R-OPL-RANGO-1 | §18 | corregida: alias de R-OPL-RANGO-1 | A.3.2, 11.1, 11.3 |
| R-§18-CONJ-1 | 2622 | fusionada→ R-OPL-CONJ-1 | §18 | corregida: alias de R-OPL-CONJ-1 | A.3.2 |
| R-§18-LISTA-1 | 2623 | fusionada→ R-OPL-LISTA-1 | §18 | corregida: alias de R-OPL-LISTA-1 | A.4.3, A.4.6.2.2 |
| — | 1 | perfil | Definiciones | sin cambio |  |
| — | 22 | perfil | Definición | sin cambio |  |
| — | 35 | perfil | Definiciones | sin cambio |  |
| — | 36 | perfil | Definiciones | sin cambio |  |
| — | 38 | perfil | Definiciones | sin cambio |  |
| — | 39 | perfil | Definiciones | sin cambio |  |
| — | 40 | perfil | Definiciones | sin cambio |  |
| — | 43 | perfil | Definiciones | sin cambio |  |
| — | 45 | perfil | Definiciones | sin cambio |  |
| — | 49 | perfil | Precedencia | sin cambio |  |
| — | 83 | perfil | Convenciones | sin cambio |  |
| — | 87 | perfil | Convenciones | sin cambio |  |
| — | 109 | perfil | §1.1 | sin cambio |  |
| — | 125 | perfil | §1.1 | sin cambio |  |
| — | 141 | perfil | §1.1 | sin cambio |  |
| GAP-VARIA | 143 | perfil | §1.1 | sin cambio |  |
| R-ENT-2 | 212 | perfil | §2.0 | sin cambio |  |
| R-ENT-2-APUNTE | 216 | perfil | §2.0 | sin cambio |  |
| ENT-OBJ | 234 | perfil | §2.1 | sin cambio |  |
| ENT-OBJ | 238 | perfil | §2.1 | sin cambio |  |
| ENT-OBJ | 240 | perfil | §2.1 | sin cambio |  |
| GAP-PLACEHOLDER-OBJETO | 244 | perfil | §2.1 | sin cambio |  |
| ENT-PROC | 256 | perfil | §2.2 | sin cambio |  |
| ENT-PROC | 262 | perfil | §2.2 | sin cambio |  |
| ENT-EST | 280 | perfil | §2.3 | sin cambio |  |
| ENT-EST | 291 | perfil | §2.3 | sin cambio |  |
| ENT-EST | 293 | perfil | §2.3 | sin cambio |  |
| ENT-DESIG | 313 | perfil | §2.4 | sin cambio |  |
| ENT-ATR | 328 | perfil | §2.5 | sin cambio |  |
| ENT-ATR | 340 | perfil | §2.5 | sin cambio |  |
| ENT-ATR | 342 | perfil | §2.5 | sin cambio |  |
| ENT-ATR | 344 | perfil | §2.5 | sin cambio |  |
| ENT-ATR | 346 | perfil | §2.5 | sin cambio |  |
| GAP-NOMBRE-INSTANCIA | 371 | perfil | §2.6 | sin cambio |  |
| ENT-ESENCIA | 379 | perfil | §2.7 | sin cambio |  |
| ENT-ESENCIA | 381 | perfil | §2.7 | sin cambio |  |
| ENT-ESENCIA | 389 | perfil | §2.7 | sin cambio |  |
| ENT-AFILIA | 399 | perfil | §2.8 | sin cambio |  |
| ENT-AFILIA | 401 | perfil | §2.8 | sin cambio |  |
| ENT-AFILIA | 409 | perfil | §2.8 | sin cambio |  |
| ENT-AFILIA | 411 | perfil | §2.8 | sin cambio |  |
| R-TR-ASIM-4 | 437 | perfil | §3.0 | sin cambio |  |
| T1 | 454 | perfil | §3.1 | sin cambio |  |
| T1 | 460 | perfil | §3.1 | sin cambio |  |
| T1 | 462 | perfil | §3.1 | sin cambio |  |
| T1 | 464 | perfil | §3.1 | sin cambio |  |
| T2 | 487 | perfil | §3.2 | sin cambio |  |
| T2 | 489 | perfil | §3.2 | sin cambio |  |
| T2 | 493 | perfil | §3.2 | sin cambio |  |
| T3 | 515 | perfil | §3.3 | sin cambio |  |
| T3 | 519 | perfil | §3.3 | sin cambio |  |
| TS3 | 535 | perfil | §3.4 | corregida: marcador [extensión] |  |
| TS3 | 537 | perfil | §3.4 | sin cambio |  |
| TS3 | 547 | perfil | §3.4 | sin cambio |  |
| TS3 | 549 | perfil | §3.4 | sin cambio |  |
| TS3 | 551 | perfil | §3.4 | sin cambio |  |
| TS4 | 579 | perfil | §3.5 | sin cambio |  |
| TS4 | 581 | perfil | §3.5 | sin cambio |  |
| GAP-PROCEDENCIA-ESCIND | 583 | perfil | §3.5 | sin cambio |  |
| TS5 | 605 | perfil | §3.6 | sin cambio |  |
| TS5 | 607 | perfil | §3.6 | sin cambio |  |
| — | 1624 | perfil | §9 | corregida: marcador [extensión] |  |
| R-COMP-MAESTRA-1 | 1632 | perfil | §9.0 | sin cambio |  |
| R-COMP-MAESTRA-2 | 1638 | perfil | §9.0 | sin cambio |  |
| R-COMP-MAESTRA-3 | 1642 | perfil | §9.0 | sin cambio |  |
| — | 1644 | perfil | §9.0 | sin cambio |  |
| — | 1652 | perfil | §9.1 | sin cambio |  |
| — | 1655 | perfil | §9.1 | sin cambio |  |
| R-COMP-EJE-2 | 1664 | perfil | §9.1 | corregida: marcador [extensión]; presentación fuera del canon (canon spec-OPL R-COMP-CFG-1) |  |
| R-COMP-ELEG-1 | 1681 | perfil | §9.2 | sin cambio |  |
| R-COMP-ELEG-2 | 1683 | perfil | §9.2 | sin cambio |  |
| R-COMP-ELEG-3 | 1687 | perfil | §9.2 | sin cambio |  |
| R-COMP-ELEG-4 | 1691 | perfil | §9.2 | sin cambio |  |
| R-COMP-ZP-2 | 1703 | perfil | §9.3 | sin cambio |  |
| R-COMP-ZP-3 | 1705 | perfil | §9.3 | sin cambio |  |
| R-COMP-REV-1 | 1711 | perfil | §9.4 | sin cambio |  |
| R-COMP-REV-2 | 1715 | perfil | §9.4 | sin cambio |  |
| — | 1717 | perfil | §9.4 | sin cambio |  |
| R-COMP-CFG-2 | 1725 | perfil | §9.5 | sin cambio |  |
| GAP-COMPOSICION | 1731 | perfil | §9.6 | sin cambio |  |
| GAP-COMP-GUARDA | 1737 | perfil | §9.6 | sin cambio |  |
| GAP-COMP-REVERSE | 1741 | perfil | §9.6 | sin cambio |  |
| R-MULT-3 | 1780 | perfil | §10.2 | sin cambio |  |
| — | 1792 | perfil | §10.3 | sin cambio |  |
| — | 1795 | perfil | §10.3 | sin cambio |  |
| — | 1796 | perfil | §10.3 | sin cambio |  |
| — | 1823 | eliminada-duplicada→ R-OPL-RUTA-3 (perfil reglas-opforja §4.12) | §11.1 | corregida: fundamento de R-OPL-RUTA-3, cuya definición única está en perfil reglas-opforja §4.12 |  |
| — | 1830 | perfil | §11.1 | sin cambio |  |
| — | 1831 | perfil | §11.1 | sin cambio |  |
| — | 1832 | perfil | §11.1 | sin cambio |  |
| — | 1833 | perfil | §11.1 | sin cambio |  |
| — | 1841 | perfil | §12 | sin cambio |  |
| R-OPL-DISP-2 | 1847 | perfil | §12.1 | sin cambio |  |
| R-OPL-DISP-4 | 1857 | perfil | §12.2 | sin cambio |  |
| — | 1868 | perfil | §12.2 | sin cambio |  |
| — | 1869 | perfil | §12.2 | sin cambio |  |
| — | 1877 | perfil | §13 | sin cambio |  |
| R-OPL-PANEL-1 | 1881 | perfil | §13.1 | sin cambio |  |
| R-OPL-PANEL-2 | 1885 | perfil | §13.1 | sin cambio |  |
| R-OPL-PANEL-3 | 1891 | perfil | §13.2 | sin cambio |  |
| R-OPL-PANEL-4 | 1899 | perfil | §13.3 | sin cambio |  |
| R-OPL-PANEL-5 | 1905 | perfil | §13.4 | sin cambio |  |
| R-OPL-PANEL-6 | 1911 | perfil | §13.5 | sin cambio |  |
| — | 1913 | perfil | §13.5 | sin cambio |  |
| — | 1921 | perfil | §13.5 | sin cambio |  |
| — | 1929 | perfil | §14 | sin cambio |  |
| R-OPL-INT-1 | 1933 | perfil | §14.1 | sin cambio |  |
| R-OPL-INT-2 | 1937 | perfil | §14.1 | sin cambio |  |
| R-OPL-INT-3 | 1943 | perfil | §14.2 | sin cambio |  |
| R-OPL-INT-4 | 1951 | perfil | §14.3 | sin cambio |  |
| — | 1953 | perfil | §14.3 | sin cambio |  |
| R-OPL-INT-5 | 1957 | perfil | §14.4 | sin cambio |  |
| R-OPL-INT-6 | 1963 | perfil | §14.5 | sin cambio |  |
| — | 1974 | perfil | §14.5 | sin cambio |  |
| — | 1982 | perfil | §15 | sin cambio |  |
| R-OPL-EDIT-1 | 1988 | perfil | §15.1 | sin cambio |  |
| — | 1992 | perfil | §15.1 | sin cambio |  |
| — | 1993 | perfil | §15.1 | sin cambio |  |
| — | 1994 | perfil | §15.1 | sin cambio |  |
| — | 1995 | perfil | §15.1 | sin cambio |  |
| — | 1997 | perfil | §15.1 | sin cambio |  |
| R-OPL-EDIT-2 | 1999 | perfil | §15.1 | sin cambio |  |
| R-OPL-EDIT-3 | 2005 | perfil | §15.2 | sin cambio |  |
| — | 2009 | perfil | §15.2 | sin cambio |  |
| — | 2010 | perfil | §15.2 | sin cambio |  |
| — | 2011 | perfil | §15.2 | sin cambio |  |
| — | 2012 | perfil | §15.2 | sin cambio |  |
| — | 2013 | perfil | §15.2 | sin cambio |  |
| — | 2014 | perfil | §15.2 | sin cambio |  |
| — | 2015 | perfil | §15.2 | sin cambio |  |
| — | 2016 | perfil | §15.2 | sin cambio |  |
| — | 2018 | perfil | §15.2 | sin cambio |  |
| R-OPL-EDIT-4 | 2020 | perfil | §15.2 | sin cambio |  |
| R-OPL-EDIT-5 | 2026 | perfil | §15.3 | sin cambio |  |
| — | 2030 | perfil | §15.3 | sin cambio |  |
| — | 2031 | perfil | §15.3 | sin cambio |  |
| — | 2032 | perfil | §15.3 | sin cambio |  |
| — | 2033 | perfil | §15.3 | sin cambio |  |
| — | 2034 | perfil | §15.3 | sin cambio |  |
| — | 2035 | perfil | §15.3 | sin cambio |  |
| — | 2036 | perfil | §15.3 | sin cambio |  |
| — | 2037 | perfil | §15.3 | sin cambio |  |
| — | 2038 | perfil | §15.3 | sin cambio |  |
| — | 2039 | perfil | §15.3 | sin cambio |  |
| R-OPL-EDIT-6 | 2043 | perfil | §15.3 | sin cambio |  |
| R-OPL-EDIT-7 | 2049 | perfil | §15.4 | sin cambio |  |
| — | 2053 | perfil | §15.4 | sin cambio |  |
| — | 2054 | perfil | §15.4 | sin cambio |  |
| — | 2055 | perfil | §15.4 | sin cambio |  |
| — | 2056 | perfil | §15.4 | sin cambio |  |
| — | 2058 | perfil | §15.4 | sin cambio |  |
| R-OPL-EDIT-8 | 2064 | perfil | §15.5 | sin cambio |  |
| R-OPL-EDIT-9 | 2070 | perfil | §15.6 | sin cambio |  |
| — | 2087 | perfil | §16 | sin cambio |  |
| R-OPL-CFG-1 | 2093 | perfil | §16.1 | sin cambio |  |
| — | 2097 | perfil | §16.1 | sin cambio |  |
| — | 2098 | perfil | §16.1 | sin cambio |  |
| — | 2099 | perfil | §16.1 | sin cambio |  |
| — | 2101 | perfil | §16.1 | sin cambio |  |
| R-OPL-CFG-2 | 2105 | perfil | §16.1 | sin cambio |  |
| R-OPL-CFG-4 | 2119 | perfil | §16.3 | sin cambio |  |
| — | 2127 | perfil | §16.3 | sin cambio |  |
| — | 2131 | perfil | §16.3 | sin cambio |  |
| R-OPL-FALLO-1 | 2141 | perfil | §17.1 | sin cambio |  |
| R-OPL-FALLO-2 | 2145 | perfil | §17.1 | sin cambio |  |
| R-OPL-FALLO-3 | 2151 | perfil | §17.2 | sin cambio |  |
| R-OPL-FALLO-4 | 2155 | perfil | §17.2 | sin cambio |  |
| R-OPL-FALLO-5 | 2161 | perfil | §17.3 | sin cambio |  |
| R-OPL-FALLO-6 | 2165 | perfil | §17.3 | sin cambio |  |
| R-OPL-FALLO-7 | 2171 | perfil | §17.4 | sin cambio |  |
| — | 2175 | perfil | §17.4 | sin cambio |  |
| — | 2176 | perfil | §17.4 | sin cambio |  |
| — | 2177 | perfil | §17.4 | sin cambio |  |
| — | 2178 | perfil | §17.4 | sin cambio |  |
| R-OPL-FALLO-8 | 2182 | perfil | §17.4 | sin cambio |  |
| — | 2190 | perfil | §17.4 | sin cambio |  |
| — | 2191 | perfil | §17.4 | sin cambio |  |
| — | 2498 | perfil | §18 | sin cambio |  |
| — | 2588 | perfil | §18 | sin cambio |  |
| — | 2613 | perfil | §18 | sin cambio |  |
| R-§18-NORM-1 | 2624 | perfil | §18 | sin cambio |  |
| R-§18-EXT-1 | 2625 | perfil | §18 | sin cambio |  |
| GAP-DONDE-EXPRESION | 2629 | perfil | §18 | sin cambio |  |
| GAP-RANGO-TEXTUAL | 2630 | perfil | §18 | sin cambio |  |
| — | 2632 | perfil | §18 | sin cambio |  |
| R-§19-SIM-1 | 2642 | perfil | §19.1 | sin cambio |  |
| R-§19-SIM-2 | 2643 | perfil | §19.1 | sin cambio |  |
| R-§19-SIM-3 | 2644 | perfil | §19.1 | sin cambio |  |
| R-§19-DISP-1 | 2648 | perfil | §19.2 | sin cambio |  |
| R-§19-DISP-2 | 2649 | perfil | §19.2 | sin cambio |  |
| R-§19-LENS-1 | 2655 | perfil | §19.3 | sin cambio |  |
| R-§19-LENS-2 | 2656 | perfil | §19.3 | sin cambio |  |
| R-§19-LENS-3 | 2657 | perfil | §19.3 | sin cambio |  |
| R-§19-COMP-1 | 2661 | perfil | §19.4 | sin cambio |  |
| R-§19-COMP-2 | 2662 | perfil | §19.4 | sin cambio |  |
| — | 2668 | perfil | §19.5 | sin cambio |  |
| — | 2669 | perfil | §19.5 | sin cambio |  |
| — | 2670 | perfil | §19.5 | sin cambio |  |
| — | 2671 | perfil | §19.5 | sin cambio |  |
| R-§19-ROT-1 | 2673 | perfil | §19.5 | sin cambio |  |
| R-§20-AUD-1 | 2681 | perfil | §20 | sin cambio |  |
| Nota | 2683 | perfil | §20 | sin cambio |  |
| — | 2685 | perfil | §20 | sin cambio |  |
| — | 2694 | perfil | §20.1 | sin cambio |  |
| GAP-VARIA | 2767 | perfil | §20.2 | sin cambio |  |
| GAP-TIPO | 2768 | perfil | §20.2 | sin cambio |  |
| GAP-XOR-FEATURE | 2769 | perfil | §20.2 | sin cambio |  |
| GAP-XOR-PARSER | 2770 | perfil | §20.2 | sin cambio |  |
| GAP-REFINA | 2771 | perfil | §20.2 | sin cambio |  |
| GAP-PLIEGA | 2772 | perfil | §7.2 | sin cambio |  |
| GAP-RECOMPONE | 2773 | perfil | §20.2 | sin cambio |  |
| GAP-PLACEHOLDER-OBJETO | 2774 | perfil | §20.2 | sin cambio |  |
| GAP-NOMBRE-INSTANCIA | 2775 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-EFECTO | 2776 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-TS3 | 2777 | perfil | §3.4 | sin cambio |  |
| GAP-PARSE-TS4 | 2778 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-TS4 | 2779 | perfil | §20.2 | sin cambio |  |
| GAP-PROCEDENCIA-ESCIND | 2780 | perfil | §20.2 | sin cambio |  |
| GAP-PARSE-TS5 | 2781 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-TS5 | 2782 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-HS | 2783 | perfil | §20.2 | sin cambio |  |
| GAP-NEGADA-REVERSE | 2784 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-ABANICO-HABILITADOR | 2785 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-EVENTO | 2786 | perfil | §20.2 | sin cambio |  |
| GAP-EVENTO-RESULTADO | 2787 | perfil | §20.2 | sin cambio |  |
| GAP-EVENTO-INVOCACION | 2788 | perfil | §20.2 | sin cambio |  |
| GAP-CONDICION-RESULTADO | 2789 | perfil | §20.2 | sin cambio |  |
| GAP-CONDICION-INVOCACION | 2790 | perfil | §20.2 | sin cambio |  |
| GAP-EXC-UNIDADES-LITERAL | 2791 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-INVOCACION | 2792 | perfil | §20.2 | sin cambio |  |
| GAP-INVOCACION-TILDE | 2793 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-AGREGACION | 2794 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-EXHIBICION | 2795 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-GENERALIZACION | 2796 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-CLASIFICACION | 2797 | perfil | §20.2 | sin cambio |  |
| GAP-TAG-PARSER | 2798 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-TAGGED | 2799 | perfil | §20.2 | sin cambio |  |
| GAP-SSE-PARSER | 2800 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-SSE | 2801 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-ESTRUCTURALES | 2802 | perfil | §20.2 | sin cambio |  |
| GAP-CX-PARSER | 2803 | perfil | §20.2 | sin cambio |  |
| GAP-FIXTURE-DESCOMPOSICION | 2804 | perfil | §7.8 | sin cambio |  |
| GAP-DESPLIEGUE-DEDICADO | 2805 | perfil | §7.8 | sin cambio |  |
| GAP-COMP-GUARDA | 2806 | perfil | §9.6 | sin cambio |  |
| GAP-FAN-EVENTO | 2807 | perfil | §20.2 | sin cambio |  |
| GAP-FAN-RESULTADO-COND | 2808 | perfil | §20.2 | sin cambio |  |
| GAP-PROB-SUPERFICIE | 2809 | perfil | §20.2 | sin cambio |  |
| GAP-FAN-M | 2810 | perfil | §8.5 | sin cambio |  |
| GAP-COL-RESOLUCION | 2811 | perfil | §20.2 | sin cambio |  |
| GAP-COMPOSICION | 2812 | perfil | §9.6 | sin cambio |  |
| GAP-COMP-REVERSE | 2813 | perfil | §9.6 | sin cambio |  |
| GAP-FIXTURE-RUTA | 2814 | perfil | §20.2 | sin cambio |  |
| GAP-DONDE-EXPRESION | 2815 | perfil | §20.2 | sin cambio |  |
| GAP-RANGO-TEXTUAL | 2816 | perfil | §20.2 | sin cambio |  |
| — | 2822 | perfil | §20.3 | sin cambio |  |
| — | 2846 | perfil | §20.3 | sin cambio |  |
| — | 2854 | perfil | §21.1 | sin cambio |  |
| R-§21-PRESC-CONS | 2858 | perfil | §21.1 | sin cambio |  |
| R-§21-PRESC-AUTO | 2859 | perfil | §21.1 | sin cambio |  |
| R-§21-PRESC-CIRC | 2860 | perfil | §21.1 | sin cambio |  |
| R-§21-PRESC-LANG | 2861 | perfil | §21.1 | sin cambio |  |
| R-§21-PRESC-ENF | 2862 | perfil | §21.1 | sin cambio |  |
| R-§21-PRESC-INTEG | 2863 | perfil | §21.1 | sin cambio |  |
| R-§21-OPL-SPAN | 2872 | perfil | §21.2 | sin cambio |  |
| R-§21-OPL-DISP | 2873 | perfil | §21.2 | sin cambio |  |
| — | 2879 | perfil | §22 | sin cambio |  |
| — | 2883 | perfil | §22 | sin cambio |  |
| — | 2884 | perfil | §22 | sin cambio |  |
| — | 2885 | perfil | §19.5 | sin cambio |  |
| — | 2886 | perfil | §22 | sin cambio |  |
| — | 2887 | perfil | §22 | sin cambio |  |
| — | 2888 | perfil | §22 | sin cambio |  |
| R-§22-ENF-1 | 2890 | perfil | §22 | sin cambio |  |
| R-§22-ENF-2 | 2891 | perfil | §22 | sin cambio |  |
| — | 2897 | perfil | §23 | sin cambio |  |
| — | 2901 | perfil | §23.1 | sin cambio |  |
| R-§23-MIG-1 | 2909 | perfil | §23.2 | sin cambio |  |
| R-§23-MIG-2 | 2910 | perfil | §23.2 | sin cambio |  |
| R-§23-DEP-1 | 2914 | perfil | §23.3 | sin cambio |  |
| R-§23-DEP-2 | 2915 | perfil | §23.3 | sin cambio |  |
| — | 2923 | perfil | §24 | sin cambio |  |
| R-§24-COMP-1 | 2926 | perfil | §24 | sin cambio |  |
| R-§24-COMP-2 | 2927 | perfil | §24 | sin cambio |  |
| R-§24-COMP-3 | 2928 | perfil | §24 | sin cambio |  |
| R-§24-COMP-4 | 2929 | perfil | §24 | sin cambio |  |
| — | 2985 | perfil | A.3 | sin cambio |  |
| — | 3020 | perfil | Apéndice B | sin cambio |  |
| — | 3022 | perfil | B.1 | sin cambio |  |
| — | 3035 | perfil | B.2 | sin cambio |  |
| — | 3046 | perfil | B.3 | sin cambio |  |
| — | 3055 | perfil | B.4 | sin cambio |  |
| — | 3066 | perfil | B.5 | sin cambio |  |
| — | 3083 | perfil | C.1 | sin cambio |  |
| — | 3101 | perfil | C.2 | sin cambio |  |
| H1 | 655 | perfil | §4.1 | corregida: marcador [extensión] |  |
| H1 | 661 | perfil | §4.1 | sin cambio |  |
| H1 | 665 | perfil | §4.1 | sin cambio |  |
| H1 | 667 | perfil | §4.1 | sin cambio |  |
| H1 | 669 | perfil | §4.1 | sin cambio |  |
| H1 | 671 | perfil | §4.1 | sin cambio |  |
| H2 | 687 | perfil | §4.1 | corregida: marcador [extensión] |  |
| H2 | 693 | perfil | §4.2 | sin cambio |  |
| H2 | 697 | perfil | §4.2 | sin cambio |  |
| H2 | 699 | perfil | §4.2 | sin cambio |  |
| H2 | 701 | perfil | §3.1 | sin cambio |  |
| H2 | 704 | perfil | §3.1 | sin cambio |  |
| H2 | 705 | perfil | §4.2 | sin cambio |  |
| GAP-FIXTURE-HS | 713 | perfil | §4.3 | sin cambio |  |
| GAP-FIXTURE-ABANICO-HABILITADOR | 714 | perfil | §4.3 | sin cambio |  |
| Tokenizaci | 776 | perfil | §5.1 | sin cambio |  |
| Reverse | 782 | perfil | §5.1 | sin cambio |  |
| Roundtrip | 784 | perfil | §5.1 | sin cambio |  |
| GAP-EVENTO-RESULTADO | 788 | perfil | §5.1 | sin cambio |  |
| GAP-EVENTO-INVOCACION | 789 | perfil | §5.1 | sin cambio |  |
| Tokenizaci | 827 | perfil | §5.2 | sin cambio |  |
| Reverse | 833 | perfil | §5.2 | sin cambio |  |
| GAP-CONDICION-RESULTADO | 839 | perfil | §5.2 | sin cambio |  |
| GAP-CONDICION-INVOCACION | 840 | perfil | §5.2 | sin cambio |  |
| EX1 | 853 | perfil | §5.3 | corregida: marcador [extensión] |  |
| Emisi | 866 | perfil | §5.3 | sin cambio |  |
| Roundtrip | 878 | perfil | §5.3 | sin cambio |  |
| GAP-EXC-UNIDADES-LITERAL | 882 | perfil | §5.3 | sin cambio |  |
| Nota | 884 | perfil | §5.3 | sin cambio |  |
| IV1 | 894 | perfil | §5.4 | corregida: marcador [extensión] |  |
| IV2 | 896 | perfil | §5.4 | corregida: marcador [extensión] |  |
| Tokenizaci | 918 | perfil | §5.4 | sin cambio |  |
| Roundtrip | 926 | perfil | §5.4 | sin cambio |  |
| — | 930 | perfil | §5.4 | sin cambio |  |
| GAP-EVENTO-RESULTADO | 938 | perfil | §5.5 | sin cambio |  |
| GAP-EVENTO-INVOCACION | 939 | perfil | §5.5 | sin cambio |  |
| GAP-FIXTURE-EVENTO | 940 | perfil | §5.5 | sin cambio |  |
| GAP-EXC-UNIDADES-LITERAL | 941 | perfil | §5.5 | sin cambio |  |
| GAP-INVOCACION-TILDE | 942 | perfil | §5.5 | sin cambio |  |
| RF1 | 983 | perfil | §6.1 | sin cambio |  |
| RF1 | 989 | perfil | §6.1 | sin cambio |  |
| RF1 | 991 | perfil | §6.1 | sin cambio |  |
| RF1 | 993 | perfil | §6.1 | sin cambio |  |
| RF2o | 1006 | perfil | §6.2 | corregida: marcador [extensión] |  |
| RF2 | 1013 | perfil | §6.2 | sin cambio |  |
| RF2 | 1019 | perfil | §6.2 | sin cambio |  |
| RF2 | 1021 | perfil | §6.2 | sin cambio |  |
| RF3 | 1056 | perfil | §6.3 | sin cambio |  |
| GAP-XOR-PARSER | 1062 | perfil | §6.3 | sin cambio |  |
| RF3 | 1064 | perfil | §6.1 | sin cambio |  |
| GAP-XOR-FEATURE | 1068 | perfil | §6.3 | sin cambio |  |
| RF4 | 1084 | perfil | §6.4 | sin cambio |  |
| RF4 | 1090 | perfil | §6.4 | sin cambio |  |
| RF4 | 1092 | perfil | §6.4 | sin cambio |  |
| R-EST-TAG-3 | 1124 | perfil | §6.5 | corregida: marcador [extensión] |  |
| SE1 | 1128 | perfil | §6.5 | sin cambio |  |
| GAP-TAG-PARSER | 1134 | perfil | §6.5 | sin cambio |  |
| SE1 | 1136 | perfil | §6.5 | sin cambio |  |
| SSE1 | 1164 | perfil | §6.6 | sin cambio |  |
| GAP-SSE-PARSER | 1170 | perfil | §6.6 | sin cambio |  |
| SSE1 | 1172 | perfil | §6.6 | sin cambio |  |
| GAP-XOR-FEATURE | 1180 | perfil | §6.7 | sin cambio |  |
| GAP-TAG-PARSER | 1181 | perfil | §6.7 | sin cambio |  |
| GAP-NOMBRE-INSTANCIA | 1182 | perfil | §6.7 | sin cambio |  |
| GAP-FIXTURE-ESTRUCTURALES | 1183 | perfil | §6.7 | sin cambio |  |
| — | 1189 | perfil | §7 | sin cambio |  |
| R-CX-2 | 1203 | perfil | §7.0 | sin cambio |  |
| CX1 | 1221 | perfil | §7.1 | sin cambio |  |
| CX1 | 1223 | perfil | §7.1 | sin cambio |  |
| GAP-CX-PARSER | 1229 | perfil | §7.1 | sin cambio |  |
| GAP-FIXTURE-DESCOMPOSICION | 1231 | perfil | §7.1 | sin cambio |  |
| CX3 | 1252 | perfil | §7.2 | sin cambio |  |
| CX3 | 1266 | perfil | §7.2 | sin cambio |  |
| CX3 | 1270 | perfil | §7.2 | sin cambio |  |
| CX3 | 1272 | perfil | §7.2 | sin cambio |  |
| CX3 | 1274 | perfil | §7.2 | sin cambio |  |
| CX4 | 1294 | perfil | §7.3 | sin cambio |  |
| GAP-REFINA | 1296 | perfil | §7.3 | sin cambio |  |
| CX4 | 1298 | perfil | §7.3 | sin cambio |  |
| CX-EST | 1320 | perfil | §7.4 | sin cambio |  |
| CX-EST | 1322 | perfil | §7.4 | sin cambio |  |
| CX-EST | 1324 | perfil | §7.4 | sin cambio |  |
| CX-EST | 1328 | perfil | §7.4 | sin cambio |  |
| CX-DIST | 1377 | eliminada-duplicada→ reglas §8.5 | §7.6 | corregida: definición única en reglas §8.5; aquí se cita |  |
| R-CX-COMP-1 | 1397 | perfil | §7.7 | sin cambio |  |
| R-CX-COMP-2 | 1403 | perfil | §7.7 | sin cambio |  |
| R-CX-COMP-3 | 1407 | perfil | §7.7 | sin cambio |  |
| GAP-COMP-GUARDA | 1411 | perfil | §9.6 | sin cambio |  |
| GAP-CX-PARSER | 1417 | perfil | §7.8 | sin cambio |  |
| GAP-PLIEGA | 1418 | perfil | §7.2 | sin cambio |  |
| GAP-DESPLIEGUE-DEDICADO | 1419 | perfil | §7.8 | sin cambio |  |
| GAP-RECOMPONE | 1420 | perfil | §7.8 | sin cambio |  |
| GAP-REFINA | 1421 | perfil | §7.8 | sin cambio |  |
| GAP-FIXTURE-DESCOMPOSICION | 1422 | perfil | §7.8 | sin cambio |  |
| GAP-COMP-GUARDA | 1423 | perfil | §9.6 | sin cambio |  |
| R-FAN-5B | 1517 | perfil | §8.1 | sin cambio |  |
| C-25 | 1583 | canon | §8.3 | corregida: C-25 válida por ISO §13 (R-OPL-RUTA-2); la restricción de producto queda en el perfil (C-25, parte de producto) citando R-OPL-RUTA-3 |  |
| — | 1593 | perfil | §8.3.1 | sin cambio |  |
| GAP-FAN-EVENTO | 1614 | perfil | §8.5 | sin cambio |  |
| GAP-FAN-RESULTADO-COND | 1615 | perfil | §8.5 | sin cambio |  |
| GAP-PROB-SUPERFICIE | 1616 | perfil | §8.5 | sin cambio |  |
| GAP-FAN-M | 1617 | perfil | §8.5 | sin cambio |  |
| GAP-COL-RESOLUCION | 1618 | perfil | §8.5 | sin cambio |  |
| CX-DIST | 1360 | perfil | §7.6 | corregida: [desviación declarada] (decisión del dueño, 2026-10-10): OpForja ancla por defecto el resultado al último subproceso; ISO §14.2.2.4 fija el primero y su NOTE 2 permite un defecto de herramienta modificable; brecha a declarar en docs/conformidad.md | 14.2.2.4 |
| R-CX-DIST-1 | 1370 | perfil | §7.6 | corregida: parte de producto, [desviación declarada] resultado al último subproceso por defecto (ISO §14.2.2.4, subcláusula 14.2.2.4.1 y NOTE 2) | 14.2.2.4 |

### Reglas nuevas (hechos ISO que faltaban)

| ID | Sección | Tema | ISO |
|---|---|---|---|
| D19 | §2.0 | oración de propiedades genéricas (esencia, afiliación, perseverancia); plantilla del catálogo canon reglas §4.4 | A.4.4.2 |
| D14 | §2.3 | objeto con un solo estado; plantilla del catálogo canon reglas §4.4 | A.4.4.4 |
| D15 | §2.4 | estados iniciales múltiples; catálogo canon reglas §4.4 | A.4.4.4 |
| D16 | §2.4 | estados finales múltiples; catálogo canon reglas §4.4 | A.4.4.4 |
| D17 | §2.4 | designación combinada inicial/final; catálogo canon reglas §4.4 | A.4.4.4 |
| D11 | §2.9 | perseverancia persistente (oración literal ISO A.4.4.2) | A.4.4.2 |
| D12 | §2.9 | perseverancia transitoria (oración literal ISO A.4.4.2) | A.4.4.2 |
| D18 | §2.10 | declaración de tipo de dato; catálogo canon reglas §4.4 | A.4.4.3, A.3.2 |
| R-MOD-NAT-3 | §5.0 | varios eventos sobre un proceso: cada uno inicia la evaluación; AND sobre los objetos de la precondición | 3.18, 9.5.1, 12.1 |
| RF2c | §6.2 | exhibidor proceso: operaciones antes que atributos; catálogo canon reglas §4.10 | 10.3.3.1, A.4.6.3 |
| RF5 | §6.2 | caracterización con estado especificado (atributo discriminante); catálogo canon reglas §4.10 | 10.4.1 |
| RF3c | §6.3 | especialización de estados; catálogo canon reglas §4.10 | A.4.6.5 |
| CX9 | §7.3 | refinamiento entre OPD por despliegue; catálogo canon reglas §4.11 | 14.2.2.6 |
| CX10 | §7.2 | despliegue en diagrama nuevo con OPD padre e hijo y forma específica; catálogo canon reglas §4.11 | A.4.7.2 |
| CX11 | §7.1 | descomposición en diagrama nuevo con OPD padre e hijo; catálogo canon reglas §4.11 | 14.2.1.3, A.4.7.4 |
| CX12 | §7.1 | descomposición mixta: tramo secuencial y grupo paralelo; catálogo canon reglas §4.11 | 14.2.2.2, A.4.7.4 |
| CX13 | §7.1 | descomposición de objeto; catálogo canon reglas §4.11 | 14.2.1.3, A.4.7.4 |
| C-32 | §8.3 | abanico convergente de resultado (ISO Tabla 17) |  |
| C-33 | §8.3 | abanico divergente de consumo (ISO Tabla 18) |  |
| C-34 | §8.3 | abanico convergente de agentes (ISO §12.2, Figura 38) | 12.2, A.4.5.3 |
| C-35 | §8.3 | abanico convergente de instrumentos (ISO §A.4.5.3) | A.4.5.3 |
| ENT-PERS | §2.9 | entrada de perseverancia (D11, D12) | 7.3.3, A.4.4.2, 3.50 |

## metodologia-forja-opm-es 1.7.0 → 2.0.0

Perfil: `perfil/metodo-opforja.md`. Entradas: canon 148, eliminada-duplicada 4, fusionada 5, perfil 205; nuevas 28.

### Secciones

| Sección | Título | Destino |
|---|---|---|
| §0 | Contrato | ambos |
| §0.1 | Naturaleza / Definición | ambos |
| §0.2 | Precedencia | ambos |
| §0.3 | Invariante de pureza | canon |
| §0.4 | Autonomía y no duplicación | perfil |
| §0.5 | Cómo leer / Convenciones | ambos |
| §A0 | Antes de la semilla | ambos |
| §A0.1 | Divergencia de conceptos | perfil |
| §A0.2 | Función vs. comportamiento | canon |
| §A0.3 | Intención → función → forma | perfil |
| §A0.4 | Equivalencia observacional (y A0.4a) | perfil |
| §A1 | Principio rector y clasificación | ambos |
| §A1.1 | Regla rectora | ambos |
| §A1.2 | Clasificación del sistema | ambos |
| §A1.3 | Modo reverse / MBRSE | perfil |
| §A1.4 | Modos de aplicación real | perfil |
| §A1.5 | Taller y arranque bottom-up | perfil |
| §A1.6 | Propósito y alcance (nueva) | canon |
| §A1.7 | Función, estructura y comportamiento (nueva) | canon |
| §A1.8 | Frontera del sistema (nueva) | canon |
| §A2 | Construcción del SD | ambos |
| §A2.1 | Reclasificación por desgaste | ambos |
| §A2.2 | Doble rol | canon |
| §A2.3 | Nombrado y esencia por defecto | ambos |
| §A2.4 | Lentes parciales del SD | perfil |
| §A2.5 | Ocurrencia del problema | canon |
| §A2.6 | Beneficio distribuido | perfil |
| §A2.7 | Contenido mínimo del SD (nueva) | canon |
| §A2.8 | Guías de nombres (nueva) | canon |
| §A3 | Refinamiento | ambos |
| §A3.1 | Descomposición | ambos |
| §A3.2 | Despliegue | canon |
| §A3.3 | Identidad de la descomposición | ambos |
| §A3.4 | Distribución de enlaces | ambos |
| §A3.5 | Invocación implícita | canon |
| §A3.6 | Expresión/supresión de estados | canon |
| §A3.7 | Habilitador en el contorno (nueva) | canon |
| §A3.8 | Desvíos de la línea de tiempo (nueva) | canon |
| §A3.9 | Conjunto completo de estados (nueva) | canon |
| §A3.10 | Conflicto consumo-resultado (nueva) | canon |
| §A4 | Gestión de complejidad → Comprensión del modelo | ambos |
| §A4.1 | Mecanismos | ambos |
| §A4.2 | Profundidad | ambos |
| §A4.3 | Árbol OPD e identidad / Importancia | ambos |
| §A4.4 | Contrato de sub-modelo | perfil |
| §A4.5 | Simplificación | canon |
| §A4.6 | Viewpack arquitectónico | perfil |
| §A4.7 | Contenido de un OPD nuevo (nueva) | canon |
| §A4.8 | Representación de elementos y copias múltiples (nueva) | canon |
| §A4.9 | Despliegue en el mismo diagrama o en uno nuevo (nueva) | canon |
| §A4.10 | Árbol OPD y mapa del sistema (nueva) | canon |
| §A5 | Heurísticas (IDs §9.n → A5.n) | ambos |
| §A6 | Control de flujo | ambos |
| §A7 | Cuantitativo, excepciones y requisitos | ambos |
| §A8 | Invariantes y validación | ambos |
| §A8.1 | Validación tripartita / continua | ambos |
| §A8.2 | Invariantes nucleares | ambos |
| §A8.3 | Consistencia de hechos (nueva) | canon |
| Frontera rectora | Frontera rectora | perfil |
| Parte B | Catálogo de lecciones forja (B.0, B.1, LF-01..LF-19) | perfil |
| Apéndice F | Realización opforja (F, F.1, F.2) | perfil |
| Bitácora | Bitácora del artefacto | perfil |

### Reglas

| ID | Línea 1.x | Destino | Sección 2.0 | Cambio | ISO |
|---|---|---|---|---|---|
| 0 | 19 | perfil | Preámbulo de §0 en el perfil | sin cambio |  |
| 0.1 | 25 | perfil | §0.1 | sin cambio (el canon 0.1 se reescribe como Definición del alcance ISO) |  |
| 0.2 | 28 | perfil | §0.2 | sin cambio (el canon 0.2 se reescribe con la precedencia del LEEME) |  |
| 0.2 | 29 | perfil | §0.2 | sin cambio |  |
| 0.2 | 30 | perfil | §0.2 | sin cambio; el canon 0.2 conserva sólo «un enunciado [guía] nunca autoriza un hecho que reglas prohíbe» |  |
| 0.2 | 31 | perfil | §0.2 | sin cambio |  |
| 0.2 | 32 | perfil | §0.2 | sin cambio |  |
| 0.3 | 35 | canon | §0.3 | corregida: [guía]; enumera elementos de ISO §6.2.2, estados y los tres pares de §14.2.1 |  |
| 0.4 | 37 | perfil | §0.4 | sin cambio |  |
| 0.4 | 37 | perfil | §0.4 | sin cambio |  |
| 0.5a | 39 | canon | §0.5 | corregida: declara shall/shall not/should/should not/may; en [guía] no hay DEBE | Prólogo (ISO/IEC Directives) |
| 0.5b | 39 | canon | §0.5 | corregida: ejemplos OPL-ES sin tipografía portadora de tipo | 6.2.1 |
| 0.5c | 39 | perfil | §0.5 | sin cambio [extensión]: tipografía de producto como portadora de tipo | Introducción |
| A0.1 | 47 | perfil | §A0.1 | sin cambio | 6.1.4 |
| A0.2a | 49 | canon | §A0.2 | corregida: función = proceso que provee valor funcional (ISO §3.23); DEBERÍA distinguir (ISO §6.1.4) en A0.2b; independencia de arquitectura como [guía] A0.2c | 6.1.4, 3.23, 3.5 |
| A0.3 | 51 | perfil | §A0.3 | sin cambio |  |
| A0.4 | 53 | perfil | §A0.4 | sin cambio |  |
| A0.4a | 55 | perfil | §A0.4 | sin cambio; nota: firma acotada a cosas presentes en el padre |  |
| A0.4a | 55 | perfil | §A0.4 | sin cambio; nota: firma acotada a cosas presentes en el padre |  |
| A0.4a | 55 | perfil | §A0.4 | sin cambio; nota: firma acotada a cosas presentes en el padre |  |
| A1.1a | 59 | canon | §A1.1 | corregida: primer paso = identificar el proceso que provee valor (ISO §6.1.3, shall); el orden posterior es [guía] A1.1b | 6.1.3, 6.1.1, 14.1 |
| A1.1c | 59 | canon | §A1.1 | corregida: equilibrio claridad/completitud (ISO §6.1.6) y consistencia de hechos (ISO §14.2.3), no subordinación | 6.1.6, 14.2.3, 6.2.1 |
| A1.1e | 59 | canon | §A1.1 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica |  |
| A1.1f | 59 | perfil | §A1.1 | sin cambio [extensión] (cláusula del Boceto) |  |
| A1.2a | 61 | canon | §A1.2 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica; se retira «pre-etapa obligatoria»; no exime de A2.7 | B.1 |
| A1.2b | 65 | canon | §A1.2 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica |  |
| A1.2 | 66 | perfil | §A1.2 | corregida: fila conservada en la tabla del perfil con nota: un sistema natural también muestra beneficiario y función (ISO §14.1, §3.75) | 14.1, 3.75 |
| A1.2 | 67 | perfil | §A1.2 | sin cambio; nota define los «5 componentes» |  |
| A1.2 | 68 | perfil | §A1.2 | sin cambio |  |
| A1.2 | 70 | perfil | §A1.2 | sin cambio; «§9.11 en A5» → A5.11 |  |
| A1.3 | 72 | perfil | §A1.3 | sin cambio |  |
| A1.3 | 77 | perfil | §A1.3 | sin cambio |  |
| A1.3 | 78 | perfil | §A1.3 | sin cambio |  |
| A1.3 | 79 | perfil | §A1.3 | sin cambio |  |
| A1.3 | 80 | perfil | §A1.3 | sin cambio |  |
| A1.3 | 84 | perfil | §A1.3 | sin cambio |  |
| A1.4 | 93 | perfil | §A1.4 | sin cambio |  |
| A1.4 | 93 | perfil | §A1.4 | sin cambio |  |
| A1.5 | 99 | perfil | §A1.5 | sin cambio |  |
| A1.5 | 101 | perfil | §A1.5 | sin cambio |  |
| A1.5 | 105 | perfil | §A1.5 | sin cambio |  |
| A1.5 | 112 | perfil | §A1.5 | sin cambio |  |
| A1.5 | 119 | perfil | §A1.5 | sin cambio |  |
| A1.5 | 122 | perfil | §A1.5 | sin cambio |  |
| A1.5 | 129 | perfil | §A1.5 | sin cambio |  |
| A1.5 | 133 | perfil | §A1.5 | sin cambio |  |
| A1.5 | 135 | perfil | §A1.5 | sin cambio |  |
| A1.5 | 140 | perfil | §A1.5 | sin cambio |  |
| A1.5 | 144 | perfil | §A1.5 | corregida: la ruta al documento de diseño ausente se sustituye por su descripción |  |
| A2 | 151 | canon | §A2 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica; cierra con hecho o con decisión registrada (hallazgo de etapas 5/10) | 14.1 |
| A2 | 153 | perfil | §A2 | sin cambio |  |
| A2#0 | 161 | canon | §A2 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica |  |
| A2#1 | 162 | canon | §A2 | sin cambio (ejemplo localizado a OPL-ES) | 6.1.3, B.6.3 |
| A2#2 | 163 | canon | §A2 | corregida: se retira «objeto físico» (no lo exige la PAS) | B.6.2, 3.6 |
| A2#3 | 164 | canon | §A2 | corregida: valor explícito (estados o valores de atributo) o implícito (ISO §14.1); sin «atributo informacional» ni «2 por defecto» | 14.1 |
| A2#4 | 165 | canon | §A2 | corregida: la etapa se llama «operando principal»; la función es el proceso (ISO §3.23) | 3.23, 6.1.3 |
| A2#5 | 166 | canon | §A2 | corregida: «sin agentes humanos» pasa a decisión registrada | 3.3, 3.30, 9.2.2 |
| A2#6b | 167 | canon | §A2 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica; se añade A2#6a (nombre del sistema = nombre del modelo, ISO §14.2.2.6) | 14.2.2.6.1.3 |
| A2#7 | 168 | canon | §A2 | sin cambio | 3.30, 3.17, 9.2.3 |
| A2#8 | 169 | canon | §A2 | sin cambio | 7.2.1, 9.1.1, 9.3.3 |
| A2#9 | 170 | canon | §A2 | sin cambio [informativo] para el símbolo | 6.1.5, 4, C.4 (Fig. C.10) |
| A2#10 | 171 | canon | §A2 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica; «NO APLICA» pasa a decisión registrada | 14.2.2.6.1.3 |
| A2#11 | 172 | perfil | §A2 | sin cambio; «(§A8)» → «(A8.1)» |  |
| A2.1a | 174 | canon | §A2.1 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica | 3.17, Tabla 25 NOTA 2 |
| A2.1b | 174 | perfil | §A2.1 | sin cambio [extensión] (vía R-AG-3A) |  |
| A2.1c | 174 | perfil | §A2.1 | sin cambio [endurecimiento] |  |
| A2.2a | 176 | canon | §A2.2 | sin cambio | 8.1.2 |
| A2.2b | 176 | canon | §A2.2 | sin cambio | 8.1.2, 14.2.4.3 |
| A2.2c | 176 | canon | §A2.2 | sin cambio | 7.3.3, 3.3 |
| A2.2d | 176 | canon | §A2.2 | corregida: [guía]; frase de «sistemas de tarea» generalizada | 3.3, 3.6 |
| A2.3a | 179 | canon | §A2.3 | corregida: nivel (i) = forma verbal sola; tope de cuatro palabras (ISO §B.6.3); sin «gerundiva» | B.6.3 |
| A2.3b | 179 | canon | §A2.3 | corregida: [localización] [guía]: infinitivo o sustantivo deverbal en lugar del gerundio inglés; se retira la justificación por lifting (va al perfil A2.3e) | B.6.3 |
| A2.3e | 179 | perfil | §A2.3 | sin cambio; «§0.2» → «0.2» |  |
| A2.3c | 180 | canon | §A2.3 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica | B.6.1 |
| A2.3d | 181 | canon | §A2.3 | corregida: sólo el valor por defecto ISO §7.3.4; «declarar sólo si difiere» y la remisión al Apéndice F van al perfil A2.3f | 7.3.4 |
| A2.3f | 181 | perfil | §A2.3 | sin cambio [extensión] |  |
| A2.4 | 183 | perfil | §A2.4 | sin cambio |  |
| A2.5 | 185 | canon | §A2.5 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica; incluye el socio-técnico |  |
| A2.6 | 187 | perfil | §A2.6 | sin cambio |  |
| A3.1a | 191 | canon | §A3.1 | sin cambio | 14.2.1.3 |
| A3.1b | 191 | canon | §A3.1 | sin cambio | 14.2.1.3, D.4 |
| A3.1c | 191 | canon | §A3.1 | corregida: ≥1 transformado (ISO §3.58); umbral ≥2 subprocesos → uno o más (ISO §A.4.3); el ≥2 va al perfil A3.1h [endurecimiento] | 3.58, A.4.3, A.4.7.4 |
| A3.1d | 191 | canon | §A3.1 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica | C.5.1 |
| A3.1e | 191 | canon | §A3.1 | sin cambio | 14.2.2.2, D.4 |
| A3.1f | 191 | canon | §A3.1 | corregida: «preferida» → DEBE (ISO §14.2.2.5, shall) | 14.2.2.5 |
| A3.1g | 191 | canon | §A3.1 | corregida: orden vertical semántico con desvíos de D.4; la verificación por animación va al perfil A3.1i | 14.2.1.3, 14.2.2.1, D.4, D.1 |
| A3.1h | 191 | perfil | §A3.1 | sin cambio [endurecimiento] (≥2 subprocesos) |  |
| A3.1i | 191 | perfil | §A3.1 | sin cambio [extensión]; «(§A8)» → «(A8.1)» |  |
| A3.1j | 191 | perfil | §A3.1 | sin cambio [extensión] (~5 subprocesos humano-máquina, caso externo) |  |
| A3.2a | 193 | canon | §A3.2 | corregida: asíncrono → agregación (DEBE); refinados «uno o más» (ISO §10.3.1) en lugar de ≥2 | 14.2.2.5, 10.3.1 |
| A3.2b | 197 | canon | §A3.2 | sin cambio (tabla convertida en una regla) | 14.2.1.2 |
| A3.2b | 198 | canon | §A3.2 | sin cambio (tabla convertida en una regla) | 14.2.1.2 |
| A3.2b | 199 | canon | §A3.2 | sin cambio (tabla convertida en una regla) | 14.2.1.2 |
| A3.2b | 200 | canon | §A3.2 | sin cambio (tabla convertida en una regla) | 14.2.1.2 |
| A3.2c | 202 | canon | §A3.2 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica; «subproceso» → «refinado» |  |
| A3.2d | 202 | canon | §A3.2 | corregida: colección incompleta [informativo] salvo en clasificación-instanciación; la OPL expresa sólo los refinados mostrados (shall) | 14.2.1.2 NOTA 3, 10.3.5.1 |
| A3.3a | 204 | canon | §A3.3 | sin cambio | 14.2.1.3 |
| — | 205 | eliminada-duplicada→ A3.3b | §A3.3 | cita «opd-es V-77/V-78» retirada (procedencia) |  |
| A3.3b | 205 | canon | §A3.3 | sin cambio; se retira la cita a la capa visual base (procedencia: opd-es V-77/V-78) | 14.2.1.3 |
| A3.3c | 206 | canon | §A3.3 | corregida: alcance = refinable, subprocesos, atributos y enlaces (ISO §14.2.1.3); «recrear para mover» va al perfil A3.3d | 14.2.1.3, C.5.1 |
| A3.3d | 206 | perfil | §A3.3 | sin cambio [extensión] (recrear para mover de alcance) |  |
| A3.3e | 207 | perfil | §A3.3 | sin cambio |  |
| A3.4a | 213 | canon | §A3.4 | corregida: efecto básico distribuye; el par entrada-salida especificado se escinde (A3.4b) | 14.2.2.4.1, 14.2.2.4.3 |
| A3.4c | 214 | canon | §A3.4 | sin cambio | 14.2.2.4.1 |
| A3.4c | 215 | canon | §A3.4 | corregida: el resultado se asigna por defecto al primer subproceso, no al último (ISO §14.2.2.4) | 14.2.2.4.1 |
| A3.4k | 215 | canon | §A3.4 | nueva etiqueta [guía]: el resultado se reasigna al subproceso que lo genera, normalmente el último (decisión del dueño 2026-10-10; el defecto normativo sigue en A3.4c) | 14.2.2.4 |
| A3.4l | 215 | perfil | §A3.4 | nueva [desviación declarada]: OpForja asigna por defecto el resultado al último subproceso (decisión del dueño 2026-10-10: «al descomponer el resultado vaya en el último»); ISO §14.2.2.4.1 fija el primero y su NOTA 2 permite un defecto de herramienta modificable; el integrador lo declara en docs/conformidad.md | 14.2.2.4.1, 14.2.2.4 NOTA 2 |
| A3.4d | 216 | canon | §A3.4 | corregida: añade el DEBERÍA de la contingencia ambiental | 14.2.2.4.2 |
| A3.4e | 218 | canon | §A3.4 | sin cambio | 14.2.2.4.1 |
| A3.4f | 218 | canon | §A3.4 | sin cambio | 14.2.2.4.3, Tabla 25 |
| A3.4g | 218 | canon | §A3.4 | corregida: se enuncia como la NOTA 1: no hay versiones de control de la mitad escindida de entrada | Tabla 25 NOTA 1 |
| A3.4h | 218 | canon | §A3.4 | corregida: un evento sistémico externo no inicia ningún subproceso; sin excepción por verificación; sólo eventos internos desvían (D.4) | 14.2.2.4.2, D.4 |
| A3.4c | 219 | fusionada→ A3.4c | §A3.4 | corregida: consumo y resultado migran por defecto al primer subproceso; los habilitadores pueden quedar en el contorno; la conducta de herramienta va al perfil A3.4j | 14.2.2.4.1 |
| A3.4j | 219 | perfil | §A3.4 | sin cambio [extensión] |  |
| — | 220 | eliminada-duplicada→ A3.4i | §A3.4 | puntero «`opd-es` §13» sustituido por reglas §6.5–§6.6 |  |
| A3.4i | 220 | canon | §A3.4 | corregida: norma ISO §14.2.4 (no capa visual); remite a reglas §6.5–§6.6; Tabla 27 no verificable; conflicto consumo/resultado en A3.10 | 14.2.4.3, 14.2.4.4, 14.2.4.2 |
| A3.5 | 222 | canon | §A3.5 | sin cambio | 14.2.2.1 |
| A3.6a | 224 | canon | §A3.6 | corregida: PUEDE suprimir lo no necesario en el contexto de cada OPD (may), no mandato | 14.2.1.1 |
| A3.6c | 224 | canon | §A3.6 | corregida: «en transición» (ISO §B.6.4, §D.6) en lugar de «indeterminado/indisponible» | B.6.4, D.6, 14.2.2.4 |
| A4.1a | 232 | canon | §A4.1 | sin cambio (tabla convertida en una regla) | 14.2.1 |
| A4.1a | 233 | canon | §A4.1 | sin cambio (tabla convertida en una regla) | 14.2.1, 14.2.1.2 |
| A4.1a | 234 | canon | §A4.1 | sin cambio (tabla convertida en una regla) | 14.2.1, 14.2.1.1 |
| A4.1c | 235 | perfil | §A4.1 | corregida: [extensión]: no es mecanismo canónico; ISO fija tres pares (ISO §14.2.1) | 14.2.1 |
| A4.1b | 237 | canon | §A4.1 | corregida: vistas de modelo (ISO §14.2.2.6); el operador de canvas va al perfil A4.1d | 14.2.2.6.1.5, 14.2.1 |
| A4.1d | 237 | perfil | §A4.1 | sin cambio [extensión] (operador `Bring`) |  |
| A4.2a | 239 | canon | §A4.2 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica | B.3 |
| A4.2b | 239 | canon | §A4.2 | corregida: DEBERÍA [informativo], «cosas» en lugar de «entidades» | B.3 |
| A4.2c | 239 | perfil | §A4.2 | sin cambio |  |
| — | 241 | eliminada-duplicada→ A4.3 | §A4.3 | remisión a la regla anti-«gran ficha», inexistente |  |
| A4.3 | 241 | canon | §A4.3 | corregida: «en general proporcional» (ISO §B.2) [informativo]; se retira la remisión anti-«gran ficha» (sin destino) | B.2, 14.1 |
| A4.3b | 241 | perfil | §A4.3 | sin cambio [extensión] | 14.2.2.6.1.3 |
| A4.3c | 241 | perfil | §A4.3 | sin cambio [extensión] | 14.2.2.6.1.1 |
| A4.3d | 241 | perfil | §A4.3 | sin cambio [extensión] (OPD hoja eliminable) |  |
| A4.4 | 243 | perfil | §A4.4 | sin cambio [extensión] |  |
| A4.5 | 245 | canon | §A4.5 | corregida: opción PUEDE [informativo]; sin «renumerar» ni fórmula de reducción neta | C.5.2 |
| A4.6 | 247 | perfil | §A4.6 | sin cambio |  |
| A5.1a | 253 | canon | §A5.1 | corregida: [guía] sin el término «proceso persistente»: un candidato que no transforma no es proceso (ISO §3.58); la parte «entrada = salida» va al perfil A5.1b | 10.2.1, 10.1 |
| A5.1b | 253 | perfil | §A5.1 | sin cambio [extensión]; nota sobre ISO §3.50 |  |
| A5.2 | 254 | canon | §A5.2 | sin cambio [informativo] | 9.5.2.5.1 NOTA 2 |
| A5.4 | 255 | canon | §A5.4 | sin cambio [informativo] | Tabla 25 NOTA 2 |
| A5.5 | 256 | canon | §A5.5 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica |  |
| A5.6 | 257 | canon | §A5.6 | corregida: los procedimentales unen objeto y proceso salvo los de control entre procesos (invocación, excepción) | 10.1, 10.3.1, 10.3.3.1, 9.5.1 |
| A5.8 | 258 | canon | §A5.8 | sin cambio | 10.3.4.3, 10.4.1 |
| A5.9 | 259 | canon | §A5.9 | corregida: lista ISO §10.3.4.2: partes, rasgos, estructurales etiquetados y procedimentales; sustitución de participantes, no «sobreescribir estados» | 10.3.4.2 |
| A5.11 | 260 | canon | §A5.11 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica | 7.3.3 |
| A5.12a | 261 | canon | §A5.12 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica; ejemplo traducido a OPL-ES; resuelve el choque con LF-02.7 por la excepción de nombre informativo | 7.3.5.5 |
| A5.13b | 262 | canon | §A5.13 | corregida: refactor de 4 pasos como DEBE (ISO §10.3.4.2, shall) en A5.13b; abstracción del SD y sub/sobreespecificación como [guía] A5.13a/A5.13c | 10.3.4.2 |
| A5.14a | 263 | canon | §A5.14 | corregida: cita ISO §7.3.2; el defecto «sustantivo = objeto» queda no verificable (A5.14b) | 7.3.2 |
| A5.15 | 264 | canon | §A5.15 | corregida: nombres únicos y apariciones [informativo]; el «nombre canónico interno» va al perfil A5.15b | B.6.2, B.6.3, B.4, B.5 |
| A5.15b | 264 | perfil | §A5.15 | sin cambio [extensión]; nota: glosario externo |  |
| — | 265 | eliminada-duplicada→ A5.18b | §A5.18 | el ✗ «Agent Group» contradice ISO §3.3 y no pasa al perfil | 3.3 |
| A5.18a | 265 | canon | §A5.18 | corregida: AND en una oración (ISO §12.1); un grupo de humanos PUEDE ser un único agente (ISO §3.3): se retira el ✗ «Agent Group» | 12.1, 3.3, B.6.2 |
| A5.19 | 266 | canon | §A5.19 | sin cambio | 7.3.5.3, 14.2.2.4.3 (Fig. 53) |
| A5.20 | 267 | canon | §A5.20 | corregida: unidad y rango (ISO §7.3.5.5, §11.3); tipos computacionales, alias e intervalos abiertos van al perfil A5.20b | 7.3.5.5, 11.3 |
| A5.20b | 267 | perfil | §A5.20 | sin cambio [extensión] |  |
| A5.21 | 268 | canon | §A5.21 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica | D.3 |
| A5.22 | 269 | canon | §A5.22 | corregida: se mantiene la especialización porque la Figura C.6 dice «State-Specific Product is a Product» y además «refers to» el estado | C.4 (Fig. C.5–C.6) |
| A5.23 | 270 | canon | §A5.23 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica; la vía «proceso state-preserving» va al perfil A5.23b | 10.1 |
| A5.23b | 270 | perfil | §A5.23 | sin cambio |  |
| A5.24 | 271 | perfil | §A5 | sin cambio; ID «§9.24» → A5.24 |  |
| A5.25 | 272 | perfil | §A5 | sin cambio; ID «§9.25» → A5.25 |  |
| A5.26 | 273 | perfil | §A5 | sin cambio; ID «§9.26» → A5.26 |  |
| A5.27 | 274 | perfil | §A5 | sin cambio; ID «§9.27» → A5.27 |  |
| A5.28 | 275 | perfil | §A5 | sin cambio; ID «§9.28» → A5.28 |  |
| A5.29 | 276 | perfil | §A5 | sin cambio; ID «§9.29» → A5.29 |  |
| A5.30 | 277 | perfil | §A5 | sin cambio; ID «§9.30» → A5.30 |  |
| A5.31 | 278 | perfil | §A5 | sin cambio; ID «§9.31» → A5.31 |  |
| A5.32 | 279 | perfil | §A5 | sin cambio; ID «§9.32» → A5.32 |  |
| A5.33 | 280 | perfil | §A5 | sin cambio; ID «§9.33» → A5.33 |  |
| A5.34 | 281 | perfil | §A5 | sin cambio; ID «§9.34» → A5.34 |  |
| A5.35 | 282 | perfil | §A5 | sin cambio; ID «§9.35» → A5.35 |  |
| A5.36 | 283 | perfil | §A5 | sin cambio; ID «§9.36» → A5.36 |  |
| A5.37 | 284 | perfil | §A5 | sin cambio; ID «§9.37» → A5.37 |  |
| A5.38 | 285 | perfil | §A5 | sin cambio; ID «§9.38» → A5.38 |  |
| A6a | 289 | canon | §A6 | sin cambio | 9.5.1 |
| A6b | 289 | canon | §A6 | corregida: un solo enunciado; se retira la etiqueta inglesa | 9.5.3.1 |
| A6c | 290 | canon | §A6 | corregida: cada evento inicia por sí solo la evaluación (ISO §3.18); el AND recae sobre los objetos de la precondición (ISO §12.1) | 12.1, 9.5.1, 9.5.3.1 |
| A6d | 291 | canon | §A6 | sin cambio [informativo] | D.5 |
| A6e | 292 | canon | §A6 | corregida: XOR exactamente uno, OR al menos uno (ISO §12.2), suma 1 (ISO §12.7); abanicos de habilitadores en ambas direcciones; «m de f» va al perfil A6k | 12.2, 12.7 |
| A6k | 292 | perfil | §A6 | sin cambio [extensión] («m de f»); nota ISO §12.2 |  |
| A6l | 293 | perfil | §A6 | sin cambio [extensión]; nota: no ISO ni bimodal |  |
| A6f | 294 | canon | §A6 | sin cambio | 13 |
| A6g | 295 | canon | §A6 | corregida: autoinvocación (ISO §9.5.2.5) y proceso recurrente con contador (ISO §11.2 NOTA 2); patrones como [guía] A6h; conjunto-miembro al perfil A6m | 9.5.2.5.2, 11.2, D.4 |
| A6h | 295 | canon | §A6 | nueva etiqueta: patrones de Dori (bucle explícito, espera, objeto de decisión) como [guía] | 9.5.2.5, 9.5.3, 9.5.4 |
| A6m | 295 | perfil | §A6 | sin cambio [extensión] (conjunto-miembro) |  |
| A6i | 296 | canon | §A6 | corregida: 1/n sólo sin estado inicial; 1 con un inicial; 1/m con m iniciales (ISO §12.7); objeto booleano como [guía] en A6h | 12.7 |
| A6j | 297 | canon | §A6 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica; «escenario» → «recorrido de ejecución» |  |
| A6n | 298 | perfil | §A6 | sin cambio [extensión] | 11.3 |
| A7a | 302 | canon | §A7 | sin cambio | 9.3.1, 9.5.4.1 |
| A7b | 303 | canon | §A7 | corregida: PUEDE (NOTA 1, can); el flujo computacional de la misma línea va al perfil A7g | 9.3.1 NOTA 1 |
| A7g | 303 | perfil | §A7 | sin cambio [extensión] (flujo computacional, alias, soft/hard: OPCloud) |  |
| A7h | 304 | perfil | §A7 | sin cambio |  |
| A7i | 305 | perfil | §A7 | sin cambio |  |
| A7j | 306 | perfil | §A7 | sin cambio |  |
| A7c | 307 | canon | §A7 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica | 10.3.4.3 |
| A7d | 308 | canon | §A7 | corregida: enlaces de excepción conformes; el manejador como [guía] A7e | 9.5.4.2, 9.5.4.3 |
| A7e | 308 | canon | §A7 | nueva etiqueta: manejador de excepción como [guía] | 9.5.4, D.7 |
| A7f | 309 | canon | §A7 | corregida: desviación corregida: [guía] con traza estructural etiquetada sólo objeto–objeto; el texto original va al perfil A7k con nota de corrección | 10.1, 10.2.1 |
| A7k | 309 | perfil | §A7 | corregida: nota de traza sólo objeto–objeto (ISO §10.1) | 10.1 |
| A7l | 310 | perfil | §A7 | sin cambio |  |
| A7m | 311 | perfil | §A7 | sin cambio |  |
| A7n | 312 | perfil | §A7 | sin cambio |  |
| A7o | 313 | perfil | §A7 | sin cambio |  |
| A7p | 314 | perfil | §A7 | sin cambio |  |
| A7q | 315 | perfil | §A7 | sin cambio |  |
| A7r | 316 | perfil | §A7 | sin cambio [endurecimiento] |  |
| A8.1 | 320 | perfil | §A8.1 | sin cambio |  |
| A8.1 | 321 | perfil | §A8.1 | sin cambio |  |
| A8.1 | 322 | perfil | §A8.1 | sin cambio |  |
| A8.1 | 323 | perfil | §A8.1 | sin cambio |  |
| A8.1a | 326 | canon | §A8.1 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica | 6.2.1 |
| A8 | 327 | perfil | §A8 | sin cambio |  |
| A8 | 328 | perfil | §A8.1 | sin cambio; nota: el corte de bucles es PUEDE de runtime (reglas R-EJEC-10) |  |
| A8 | 329 | perfil | §A8 | sin cambio |  |
| A8 | 330 | perfil | §A8 | sin cambio |  |
| A8 | 331 | perfil | §A8 | sin cambio |  |
| A8.2a | 337 | canon | §A8.2 | corregida: atribuido a ISO §14.2.2.6, no a «manual» | 14.2.2.6.1.3, 3.75 |
| A8.2b | 338 | canon | §A8.2 | sin cambio | 3.3, 3.30 |
| A8.2c | 339 | canon | §A8.2 | sin cambio | 3.17 |
| A8.2d | 340 | canon | §A8.2 | corregida: queda como [guía] sin DEBE, citando la construcción ISO que aplica |  |
| A8.2e | 341 | canon | §A8.2 | sin cambio [informativo] | 4, C.4 (Fig. C.10) |
| A8.2f | 342 | canon | §A8.2 | sin cambio | 14.2.2.4.1 |
| A8.2g | 343 | canon | §A8.2 | corregida: atribuido a ISO §3.58, no a «manual» | 3.58 |
| A8.2h | 344 | canon | §A8.2 | sin cambio | 6.2.1 |
| A8.2i | 345 | canon | §A8.2 | sin cambio | 6.2.1, 14.2.2.6.2 |
| A8.2j | 346 | canon | §A8.2 | sin cambio | 10.1, 10.3.1 |
| A8.2k | 347 | canon | §A8.2 | corregida: definiciones ISO §3.52/§3.54; habilitadores en el conjunto posterior: no verificable | 3.52, 3.54, 8.2.2 |
| A8.2 | 348 | perfil | §A8.2 | sin cambio [endurecimiento] (ISO admite un refinado) | 10.3.1, A.4.3 |
| A8.2l | 349 | canon | §A8.2 | corregida: acotado al SD: todo proceso distinto de la función es ambiental (ISO §14.2.2.6) | 14.2.2.6.1.3, 6.1.5 |
| A8.2 | 350 | perfil | §A8.2 | sin cambio [extensión] |  |
| A8.2 | 351 | perfil | §A8.2 | sin cambio [extensión] |  |
| A8.2 | 352 | perfil | §A8.2 | sin cambio [extensión] |  |
| A8.2m | 353 | canon | §A8.2 | sin cambio | 7.3.5.3 |
| A8.2n | 354 | canon | §A8.2 | corregida: 1/n salvo estados iniciales (ISO §12.7) | 12.7 |
| A8.2o | 355 | canon | §A8.2 | corregida: DEBERÍA [informativo]: guía de legibilidad, no invariante | B.3 |
| A8.2p | 356 | canon | §A8.2 | sin cambio | B.6.2, A.3.3 |
| A8 | 359 | perfil | §A8.2 | sin cambio; nota: una cosa sin aparición viola A8.2i |  |
| A8 | 360 | perfil | §A8.2 | sin cambio |  |
| Frontera | 370 | perfil | Apéndice F | sin cambio |  |
| Frontera | 371 | perfil | Apéndice F | sin cambio |  |
| Frontera | 372 | perfil | Apéndice F | sin cambio |  |
| Frontera | 373 | perfil | Apéndice F | sin cambio |  |
| Frontera | 375 | perfil | Apéndice F | sin cambio |  |
| B.0 | 381 | perfil | Parte B | sin cambio |  |
| B.1 | 397 | perfil | Parte B | sin cambio |  |
| B.1 | 398 | perfil | Parte B | sin cambio |  |
| B.1 | 399 | perfil | Parte B | sin cambio |  |
| LF-01 | 405 | perfil | Parte B | sin cambio | 10.3.3 |
| LF-01 | 407 | perfil | Parte B | sin cambio |  |
| LF-01.6 | 409 | perfil | Parte B | sin cambio |  |
| LF-01 | 410 | perfil | Parte B | corregida: nota: ejemplo con «y» y «de Objeto» según spec-OPL | A.4.6.4, 10.3.3.1 |
| LF-01 | 413 | perfil | Parte B | corregida: nota: COLAPSAR ⟺ ¬SEPARAR |  |
| A5.12b | 417 | fusionada→ A5.12b | §A5.12 | corregida: principio ISO llevado al canon como A5.12b («rasgo» por «propiedad»); el texto de la lección sigue en perfil LF-02 | 3.4, 3.60, 10.3.3.1 |
| LF-02 | 419 | perfil | Parte B | sin cambio [endurecimiento] (nota) | 3.46, 14.2.1.3 |
| LF-02.6 | 421 | perfil | Parte B | sin cambio |  |
| LF-02 | 422 | perfil | Parte B | sin cambio; nota: excepción de nombre informativo (canon A5.12a) | 10.3.3.1 |
| A3.6b | 429 | fusionada→ A3.6b | §A3.6 | sin cambio; el texto de la lección sigue en perfil LF-03 | 14.2.1.1 |
| A3.6b | 431 | fusionada→ A3.6b | §A3.6 | sin cambio; el texto de la lección sigue en perfil LF-03 | 14.2.1.1, 14.2.3 NOTA |
| LF-03 | 432 | perfil | Parte B | corregida: nota: la supresión por OPD es general; «solo en descomposición» atañe a la supresión calculada | 14.2.1.1 |
| LF-03 | 433 | perfil | Parte B | corregida: nota: oculto ⇔ suprimido-global ∨ suprimido-local |  |
| LF-03 | 434 | perfil | Parte B | sin cambio; nota: símbolo y «o otros estados» | 14.2.1.1 |
| LF-04 | 441 | perfil | Parte B | sin cambio |  |
| LF-04 | 443 | perfil | Parte B | sin cambio |  |
| LF-04.6 | 445 | perfil | Parte B | sin cambio |  |
| A3.2d | 453 | fusionada→ A3.2d | §A3.2 | corregida: plegado parcial = subconjunto de refinados con colección incompleta (ISO §14.2.1.2); el compactado con contador queda en perfil LF-05 | 14.2.1.2 NOTA 3–4, 10.3.2 |
| LF-05 | 455 | perfil | Parte B | sin cambio |  |
| LF-05 | 457 | perfil | Parte B | corregida: nota: el semi-plegado no emite OPL; el plegado parcial usa la oración de colección incompleta | 10.3.2, A.4.6.3 |
| LF-05 | 458 | perfil | Parte B | sin cambio |  |
| LF-06 | 465 | perfil | Parte B | corregida: nota: ISO usa despliegue por agregación para lo asíncrono (ISO §14.2.2.5, Figura 54) | 14.2.2.5, 14.2.2.4.2 |
| LF-06 | 467 | perfil | Parte B | corregida: nota: disparados por evento sin orden fijo → despliegue por agregación | 14.2.2.5 |
| LF-06.6 | 469 | perfil | Parte B | sin cambio |  |
| LF-07.2 | 477 | perfil | Parte B | sin cambio |  |
| LF-07.4 | 479 | perfil | Parte B | sin cambio |  |
| LF-07.6 | 481 | perfil | Parte B | sin cambio |  |
| LF-08.2 | 489 | perfil | Parte B | sin cambio |  |
| LF-08.4 | 491 | perfil | Parte B | sin cambio |  |
| LF-08.6 | 493 | perfil | Parte B | sin cambio |  |
| LF-09.2 | 501 | perfil | Parte B | sin cambio |  |
| LF-09.4 | 503 | perfil | Parte B | sin cambio |  |
| LF-09.6 | 505 | perfil | Parte B | sin cambio |  |
| LF-10.2 | 513 | perfil | Parte B | sin cambio |  |
| LF-10.4 | 515 | perfil | Parte B | sin cambio |  |
| LF-10.6 | 517 | perfil | Parte B | sin cambio |  |
| LF-11.2 | 525 | perfil | Parte B | sin cambio |  |
| LF-11.4 | 527 | perfil | Parte B | sin cambio |  |
| LF-11.6 | 529 | perfil | Parte B | sin cambio |  |
| LF-12.2 | 537 | perfil | Parte B | sin cambio |  |
| LF-12.4 | 539 | perfil | Parte B | sin cambio |  |
| LF-12.6 | 541 | perfil | Parte B | sin cambio |  |
| LF-13.2 | 549 | perfil | Parte B | sin cambio |  |
| LF-13.4 | 551 | perfil | Parte B | sin cambio |  |
| LF-13.6 | 553 | perfil | Parte B | sin cambio |  |
| LF-14.2 | 561 | perfil | Parte B | sin cambio |  |
| LF-14.4 | 563 | perfil | Parte B | sin cambio |  |
| LF-14.6 | 565 | perfil | Parte B | sin cambio |  |
| LF-15.2 | 573 | perfil | Parte B | sin cambio |  |
| LF-15.4 | 575 | perfil | Parte B | sin cambio |  |
| LF-15.6 | 577 | perfil | Parte B | sin cambio |  |
| LF-16.2 | 585 | perfil | Parte B | sin cambio |  |
| LF-16.4 | 587 | perfil | Parte B | sin cambio |  |
| LF-16.6 | 589 | perfil | Parte B | sin cambio |  |
| LF-17.2 | 597 | perfil | Parte B | sin cambio |  |
| LF-17.4 | 599 | perfil | Parte B | sin cambio |  |
| LF-17.6 | 601 | perfil | Parte B | sin cambio |  |
| LF-18.2 | 609 | perfil | Parte B | sin cambio |  |
| LF-18.4 | 611 | perfil | Parte B | sin cambio |  |
| LF-18.6 | 613 | perfil | Parte B | sin cambio |  |
| LF-19.2 | 621 | perfil | Parte B | sin cambio |  |
| LF-19.3 | 622 | perfil | Parte B | sin cambio |  |
| LF-19.4 | 623 | perfil | Parte B | sin cambio |  |
| LF-19.5 | 624 | perfil | Parte B | sin cambio |  |
| LF-19.7 | 626 | perfil | Parte B | sin cambio |  |
| LF-19.9 | 628 | perfil | Parte B | sin cambio |  |
| LF-19.10 | 629 | perfil | Parte B | sin cambio |  |
| F | 636 | perfil | Apéndice F | sin cambio |  |
| F | 638 | perfil | Apéndice F | sin cambio |  |
| F | 639 | perfil | Apéndice F | sin cambio; nota [endurecimiento] del mínimo de dos estados |  |
| F | 640 | perfil | Apéndice F | sin cambio |  |
| F | 641 | perfil | Apéndice F | sin cambio |  |
| F | 642 | perfil | Apéndice F | sin cambio |  |
| F | 643 | perfil | Apéndice F | sin cambio |  |
| F | 645 | perfil | Apéndice F | sin cambio |  |
| F | 645 | perfil | Apéndice F | sin cambio |  |
| F | 647 | perfil | Apéndice F | sin cambio |  |
| F | 649 | perfil | Apéndice F | sin cambio; nota: esencia física ≠ humano |  |
| F.1 | 653 | perfil | Apéndice F | sin cambio |  |
| F.1 | 655 | perfil | Apéndice F | sin cambio |  |
| F.2 | 670 | perfil | Apéndice F | sin cambio; nota: política de runtime |  |
| F.2 | 671 | perfil | Apéndice F | sin cambio |  |
| F.2 | 672 | perfil | Apéndice F | sin cambio |  |
| F.2 | 673 | perfil | Apéndice F | sin cambio |  |
| F.2 | 674 | perfil | Apéndice F | sin cambio |  |
| F.2 | 675 | perfil | Apéndice F | corregida: rutas de código inexistentes retiradas del texto (constan en procedencia_retirada) |  |
| Bitácora | 681 | perfil | Bitácora | sin cambio; se añade una fila 2026-10-10 |  |
| A1.6 |  | canon | §A1.6 | nueva | 6.1.1 |
| A1.7 |  | canon | §A1.7 | nueva | 6.1.2 |
| A1.8 |  | canon | §A1.8 | nueva | 6.1.5, 7.3.4 |
| A2#6a |  | canon | §A2 | nueva | 14.2.2.6 |
| A2.7a |  | canon | §A2.7 | nueva | 14.1 |
| A2.7b |  | canon | §A2.7 | nueva | 14.1 |
| A2.7c |  | canon | §A2.7 | nueva | 14.1 |
| A2.7d |  | canon | §A2.7 | nueva | 14.2.2.6, 3.75 |
| A2.8a |  | canon | §A2.8 | nueva | B.6.2 |
| A2.8b |  | canon | §A2.8 | nueva | B.6.2, B.6.3 |
| A2.8c |  | canon | §A2.8 | nueva | B.6.2 |
| A2.8d |  | canon | §A2.8 | nueva | B.6.4 |
| A2.8e |  | canon | §A2.8 | nueva | B.6.5 |
| A3.7 |  | canon | §A3.7 | nueva | 14.2.2.4 |
| A3.8a |  | canon | §A3.8 | nueva | D.4 |
| A3.8b |  | canon | §A3.8 | nueva | D.4 |
| A3.9a |  | canon | §A3.9 | nueva | 14.2.1.1 |
| A3.9b |  | canon | §A3.9 | nueva | 14.2.1.1 |
| A3.10 |  | canon | §A3.10 | nueva | 14.2.4.2 |
| A4.7 |  | canon | §A4.7 | nueva | B.3 |
| A4.8a |  | canon | §A4.8 | nueva | B.4, 14.2.3 |
| A4.8b |  | canon | §A4.8 | nueva | B.5 |
| A4.9 |  | canon | §A4.9 | nueva | 14.2.1.2 |
| A4.10a |  | canon | §A4.10 | nueva | 14.2.2.6, 3.45 |
| A4.10b |  | canon | §A4.10 | nueva | 14.2.2.6, 3.44 |
| A4.10c |  | canon | §A4.10 | nueva | 14.2.2.6 |
| A8.3a |  | canon | §A8.3 | nueva | 14.2.3 |
| A8.3b |  | canon | §A8.3 | nueva | 14.2.3 |

### Reglas nuevas (hechos ISO que faltaban)

| ID | Sección | Tema | ISO |
|---|---|---|---|
| A1.6 | §A1.6 | Propósito y función guían alcance y detalle | 6.1.1 |
| A1.7 | §A1.7 | Unificación de función, estructura y comportamiento | 6.1.2 |
| A1.8 | §A1.8 | Frontera del sistema y afiliación por defecto | 6.1.5, 7.3.4 |
| A2#6a | §A2 | Nombre del sistema = nombre del modelo | 14.2.2.6 |
| A2.7a | §A2.7 | Propósito, alcance y función como base del contenido del modelo | 14.1 |
| A2.7b | §A2.7 | Contenido mínimo del SD y párrafo OPL sucinto | 14.1 |
| A2.7c | §A2.7 | SD sólo con lo central; refinamiento gradual | 14.1 |
| A2.7d | §A2.7 | Un solo proceso sistémico en el SD; procesos ambientales permitidos | 14.2.2.6, 3.75 |
| A2.8a | §A2.8 | Nombres de objeto en singular; Conjunto/Grupo | B.6.2 |
| A2.8b | §A2.8 | Prefijo o sufijo «de» del refinable para nombres únicos | B.6.2, B.6.3 |
| A2.8c | §A2.8 | Nombres de varias palabras | B.6.2 |
| A2.8d | §A2.8 | Estados en participio pasivo | B.6.4 |
| A2.8e | §A2.8 | Convención de mayúsculas [localización] | B.6.5 |
| A3.7 | §A3.7 | Habilitador en el contorno conecta al menos un subproceso | 14.2.2.4 |
| A3.8a | §A3.8 | Desvíos de la línea de tiempo: eventos internos y Exception Exiting | D.4 |
| A3.8b | §A3.8 | Punto de referencia y tolerancia de altura | D.4 |
| A3.9a | §A3.9 | Conjunto completo de estados = unión entre OPD | 14.2.1.1 |
| A3.9b | §A3.9 | Símbolo de supresión y «o otros estados» | 14.2.1.1 |
| A3.10 | §A3.10 | Consumo contra resultado al abstraer → efecto | 14.2.4.2 |
| A4.7 | §A4.7 | Reglas prácticas de contenido de un OPD | B.3 |
| A4.8a | §A4.8 | Principio de representación de elementos | B.4, 14.2.3 |
| A4.8b | §A4.8 | Convención de copias múltiples | B.5 |
| A4.9 | §A4.9 | Despliegue en el mismo diagrama o en uno nuevo | 14.2.1.2 |
| A4.10a | §A4.10 | Árbol de procesos OPD y etiquetas de arista | 14.2.2.6, 3.45 |
| A4.10b | §A4.10 | Árboles de objetos OPD | 14.2.2.6, 3.44 |
| A4.10c | §A4.10 | Mapa del sistema y vistas de modelo | 14.2.2.6 |
| A8.3a | §A8.3 | Principio de consistencia de hechos | 14.2.3 |
| A8.3b | §A8.3 | Refinamiento y abstracción no son contradicción | 14.2.3 |
