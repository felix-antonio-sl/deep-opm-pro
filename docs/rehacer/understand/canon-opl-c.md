# Dossier normativo — `spec-forja-opl-es` v1.4.1, tramo C (líneas 2197–3136)

**Fuente**: `canon/spec-forja-opl-es/content.md` (v1.4.1, 3136 líneas).
**Tramo leído completo**: §18 EBNF formal OPL-ES · §19 roundtrip y bisimetría · §20 trazabilidad y gaps · §21 invariantes · §22 validación · §23 migración · §24 composición por interfaz · Apéndices A, B y C.
**Método**: lectura íntegra en tres bloques (2197–2596, 2597–2995, 2996–3136). Para detectar contradicciones hice un cotejo puntual con plantillas de §1–§12 del mismo documento (líneas 184, 222, 303, 324, 851–884, 894–929, 977, 1124, 1214–1263, 1456, 1505, 1654–1671, 2014–2020, 2182) y con `reglas-opm-estrictas-es` Anexo C (líneas 1500–1519). Esos cotejos se citan por número de línea. No seguí fuentes externas (`opm-opl-es`, SSOT-iso, etc.): solo cuenta el texto de los 4 documentos del canon.

**Convenciones del dossier**
- *Obligación*: tal como la expresa el canon (DEBE / NO DEBE / DEBERÍA / PUEDE, o formas equivalentes en mayúsculas como SE LIMITA, PERTENECEN, EXIGE, SE DEPRECIA, NO SE ADMITE). Si el canon no lo dice, lo marco **inferido**.
- *Consecuencia para la herramienta*: impedir · advertir · generar OPL · parsear OPL · renderizar · soportar operación · modelo de datos · exportar/importar · solo método humano · no aplica a la herramienta.
- **Precedencia declarada en el tramo** (R-§23-MIG-1): *"ante conflicto, la SSOT de canon (`urn:fxsl:kb:reglas-opm-estrictas-es`) sigue por encima de esta spec"*. Además rige R-§21-PRESC-CONS: *"Ante conflicto, la regla más específica o la cláusula declarada manda."*

---

## 1. §18 — EBNF formal OPL-ES (copia literal completa)

> Transcripción byte a byte de las líneas 2199–2615 del canon: párrafo introductorio más el bloque `ebnf` íntegro.

EBNF normativa consolidada (es-CL, sin transformación de idioma). Cubre todas las familias canonizadas en §1–§12: declaraciones base, identificadores, descripción de cosas, procedimentales (transformadores + habilitadores + control), condición, estructurales, estructuras fundamentales, gestión de contexto, multiplicidad/cardinalidad y ruta. Las producciones marcadas `(* ext §n *)` son extensiones declaradas de esta spec y no figuran en el Apéndice A de `opm-opl-es`: `(* ext §2.0 *)` clasificación combinada eco-OPCloud, `(* ext §6.2 *)` rasgo opcional `tiene un … opcional`, `(* ext §6.5 *)` sufijo de etiqueta de enlace, `(* ext §9 *)` oración compuesta/coordinada.

```ebnf
(* ===== A.1 — Estructura del documento ===== *)
parrafo_opl_es = oracion_opl_es, { salto_de_linea, oracion_opl_es } ;
oracion_opl_es = oracion_formal_opl_es, "." ;
oracion_formal_opl_es = oracion_de_descripcion_de_cosa
 | oracion_procedimental
 | oracion_estructural
 | oracion_de_gestion_de_contexto
 | oracion_compuesta ;  (* ext §9 *)

(* ===== A.2 — Declaraciones base ===== *)
digito_no_cero = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' ;
digito_decimal = '0' | digito_no_cero ;
entero_positivo = digito_no_cero, {digito_decimal} ;
nombre_simple = letra, {caracter_de_cadena} ;
nombre = nombre_simple, { " ", nombre_simple } ;
segmento_etiqueta_opd = "SD", [entero_positivo] ;
palabra_capitalizada = letra_mayuscula, {caracter_de_cadena} ;
palabra_no_capitalizada = letra_minuscula, {caracter_de_cadena} ;
frase_no_capitalizada = palabra_no_capitalizada, { " ", palabra_no_capitalizada } ;
letra = letra_mayuscula | letra_minuscula ;
letra_mayuscula = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
 | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
 | 'Á' | 'É' | 'Í' | 'Ó' | 'Ú' | 'Ñ' | 'Ü' ;
letra_minuscula = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
 | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
 | 'á' | 'é' | 'í' | 'ó' | 'ú' | 'ñ' | 'ü' ;
caracter_de_cadena = letra | digito_decimal | '-' | '_' ;
identificador_de_tipo = "boolean" | "string" | tipo_numerico | "enumerated" ;
tipo_numerico = [prefijo], "integer" | "float" | "double" | "short" | "long" ;
prefijo = "unsigned " | "signed " ;
restriccion_de_participacion = singular_inferior | singular_superior | plural_inferior | plural_superior
 | ( "0" | limite_de_participacion, [ " a ", limite_de_participacion ] ) ;
singular_inferior = "un" | "una" | "un opcional" | "una opcional" | "al menos un" | "al menos una" ;
singular_superior = "exactamente un" | "exactamente una" ;
plural_inferior = "al menos dos" ;
plural_superior = "dos o más" ;
limite_de_participacion = entero_positivo | nombre_simple ;
unidad_de_medida = nombre_simple ;
numero_decimal = [ "-" ], ( "0" | entero_positivo ), [ ".", digito_decimal, {digito_decimal} ] ;
nombre_de_valor = nombre_simple | numero_decimal ;
limite_de_rango = nombre_de_valor | "*" ;
delimitador_inferior_de_rango = "[" | "(" ;
delimitador_superior_de_rango = "]" | ")" ;
intervalo_de_rango = delimitador_inferior_de_rango, limite_de_rango, "..", limite_de_rango, delimitador_superior_de_rango ;
expresion_de_rango = intervalo_de_rango, { ", ", intervalo_de_rango } ;
clausula_de_rango = " es ", ( nombre_de_valor | expresion_de_rango )
 | " varía de ", nombre_de_valor, " a ", nombre_de_valor ;

(* ===== A.3 — Identificadores ===== *)
identificador_de_objeto = nombre_singular_de_objeto, [ " en ", unidad_de_medida ], [ clausula_de_rango ] ;
identificador_de_proceso = nombre_singular_de_proceso | nombre_singular_de_proceso, " proceso" ;
identificador_de_cosa = identificador_de_objeto | identificador_de_proceso ;
identificador_de_estado = palabra_no_capitalizada ;
expresion_de_etiqueta = frase_no_capitalizada ;
nombre_singular_de_objeto = palabra_capitalizada, { " ", palabra_capitalizada | palabra_no_capitalizada } ;
nombre_singular_de_proceso = palabra_capitalizada, { " ", palabra_capitalizada | palabra_no_capitalizada } ;
estado_de_entrada = identificador_de_estado ;
estado_de_salida = identificador_de_estado ;
objeto_con_opcion_de_estado = identificador_de_objeto, [ " en ", identificador_de_estado ] ;
objeto_origen = identificador_de_objeto ;
objeto_destino = identificador_de_objeto ;
proceso_origen = identificador_de_proceso ;
proceso_destino = identificador_de_proceso ;
objeto_todo = identificador_de_objeto ;
proceso_todo = identificador_de_proceso ;
objeto_general = identificador_de_objeto ;
proceso_general = identificador_de_proceso ;
clase_de_objeto = identificador_de_objeto ;
clase_de_proceso = identificador_de_proceso ;
objeto_especial = identificador_de_objeto ;
objeto_con_estado = identificador_de_objeto, " en ", identificador_de_estado ;
nombre_de_modelo = nombre ;
etiqueta_visible_de_opd = segmento_etiqueta_opd, { ".", entero_positivo } ;
opd_padre = etiqueta_visible_de_opd ;
opd_hijo = etiqueta_visible_de_opd ;
identificador_de_proceso_activo = identificador_de_proceso ;
max_duracion_unidades_tiempo = nombre_de_valor, " unidades-tiempo" ;
min_duracion_unidades_tiempo = nombre_de_valor, " unidades-tiempo" ;
lista_de_estados = identificador_de_estado, { ", ", identificador_de_estado }, [ " o ", identificador_de_estado ] ;
lista_de_objetos = identificador_de_objeto, { ", ", identificador_de_objeto }, [ " y ", identificador_de_objeto ] ;
lista_de_procesos = identificador_de_proceso, { ", ", identificador_de_proceso }, [ " y ", identificador_de_proceso ] ;
lista_de_atributos = identificador_de_objeto, { ", ", identificador_de_objeto }, [ " y ", identificador_de_objeto ] ;
lista_de_operadores = identificador_de_proceso, { ", ", identificador_de_proceso }, [ " y ", identificador_de_proceso ] ;
lista_de_objetos_especiales = lista_de_objetos ;
lista_de_procesos_especiales = lista_de_procesos ;
lista_de_objetos_instancia = lista_de_objetos ;
lista_de_procesos_instancia = lista_de_procesos ;
lista_de_objetos_con_estado = objeto_con_estado, { ", ", objeto_con_estado }, [ " y ", objeto_con_estado ] ;
(* espejo de opm-opl-es A.5: el efecto admite multiplicidad por objeto (reglas §6.7 R-MULT-1/V-23); solo el slot de objeto la lleva, R-MULT-1A *)
objeto_procedimental = [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado ;
lista_de_objetos_procedimentales = objeto_procedimental, { ", ", objeto_procedimental }, [ " y ", objeto_procedimental ] ;
etiqueta_directa = expresion_de_etiqueta ;
etiqueta_nula_definida_por_usuario = expresion_de_etiqueta ;

(* ===== A.4 — Descripción de cosas ===== *)
oracion_de_descripcion_de_cosa = oracion_de_propiedad_generica
 | oracion_de_clasificacion_combinada  (* ext §2.0 *)
 | oracion_de_enumeracion_de_estados
 | oracion_de_estados_iniciales
 | oracion_de_estados_finales
 | oracion_de_estado_por_defecto
 | oracion_de_estado_current
 | oracion_de_tipo_de_dato ;
oracion_de_tipo_de_dato = identificador_de_objeto, " es de tipo ", identificador_de_tipo ;
oracion_de_propiedad_generica = identificador_de_cosa, " es ", ( esencia | afiliacion | perseverancia ) ;
(* ext §2.0 — clasificación combinada eco-OPCloud (R-ENT-3): esencia y afiliación en UNA oración
   con sustantivo de tipo; los adjetivos concuerdan con el sustantivo, no con la cosa. *)
oracion_de_clasificacion_combinada = identificador_de_cosa, " es un ", ( "objeto" | "proceso" ), " ",
 ( esencia_combinada | afiliacion_combinada | ( esencia_combinada, " y ", afiliacion_combinada ) ) ;  (* ext §2.0 *)
esencia_combinada = "físico" | "informacional" ;  (* ext §2.0 *)
afiliacion_combinada = "sistémico" | "ambiental" ;  (* ext §2.0 *)
oracion_de_enumeracion_de_estados = identificador_de_objeto, " puede estar ", lista_de_estados, [", y otros estados"] ;
oracion_de_estados_iniciales = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es inicial" ;
oracion_de_estados_finales = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es final" ;
oracion_de_estado_por_defecto = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es por defecto" ;
oracion_de_estado_current = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es declarado `Current`" ;
esencia = "física" | "informacional" ;
afiliacion = "ambiental" | "sistémica" ;
perseverancia = "persistente" | "transitoria" ;

(* ===== A.5 — Procedimentales ===== *)
oracion_procedimental = oracion_transformadora | oracion_habilitadora | oracion_de_invocacion | oracion_de_control ;
oracion_transformadora = oracion_de_consumo | oracion_de_resultado | oracion_de_efecto | oracion_de_cambio ;
(* multiplicidad procedimental (reglas §6.7 R-MULT-1 / V-23; §10.1): los slots de objeto admiten
   restricción de participación antepuesta; los slots de proceso NO la llevan (R-MULT-1A). *)
oracion_de_consumo = identificador_de_proceso, " consume ", [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado ;
oracion_de_resultado = identificador_de_proceso, " genera ", [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado ;
oracion_de_efecto = identificador_de_proceso, " afecta ", lista_de_objetos_procedimentales ;
oracion_de_cambio = oracion_de_cambio_entrada_salida | oracion_de_cambio_solo_entrada | oracion_de_cambio_solo_salida
 | oracion_de_cambio_entrada_comun_salida_fan ;
frase_de_cambio_entrada_salida = identificador_de_objeto, " de ", estado_de_entrada, " a ", estado_de_salida ;
frase_de_cambio_solo_entrada = identificador_de_objeto, " de ", estado_de_entrada ;
frase_de_cambio_solo_salida = identificador_de_objeto, " a ", estado_de_salida ;
oracion_de_cambio_entrada_salida = identificador_de_proceso, " cambia ", frase_de_cambio_entrada_salida ;
oracion_de_cambio_solo_entrada = identificador_de_proceso, " cambia ", frase_de_cambio_solo_entrada ;
oracion_de_cambio_solo_salida = identificador_de_proceso, " cambia ", frase_de_cambio_solo_salida ;
oracion_de_cambio_entrada_comun_salida_fan = identificador_de_proceso, " cambia ", identificador_de_objeto,
 " de ", estado_de_entrada, " a ", operador_de_fan, " ", lista_de_estados ;
oracion_habilitadora = oracion_de_agente | oracion_de_instrumento ;
oracion_de_agente = [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado, " maneja ", identificador_de_proceso ;
oracion_de_instrumento = identificador_de_proceso, " requiere ", [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado ;
oracion_de_control = oracion_de_evento | oracion_de_condicion | oracion_de_excepcion ;
oracion_de_evento = oracion_de_evento_de_consumo | oracion_de_evento_de_efecto
 | oracion_de_evento_de_agente | oracion_de_evento_de_instrumento ;
oracion_de_evento_de_consumo = [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado, " inicia ", identificador_de_proceso,
 ", que consume ", identificador_de_objeto ;
oracion_de_evento_de_efecto = [ restriccion_de_participacion, " " ], identificador_de_objeto, " inicia ", identificador_de_proceso,
 ", que afecta ", identificador_de_objeto ;
oracion_de_evento_de_agente = [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado, " inicia y maneja ", identificador_de_proceso ;
oracion_de_evento_de_instrumento = [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado, " inicia ", identificador_de_proceso,
 ", que requiere ", objeto_con_opcion_de_estado ;
oracion_de_invocacion = identificador_de_proceso, " invoca ", lista_de_procesos
 | identificador_de_proceso, " se invoca a sí mismo" ;
oracion_de_excepcion = oracion_de_excepcion_por_sobretiempo | oracion_de_excepcion_por_subtiempo ;
oracion_de_excepcion_por_sobretiempo = identificador_de_proceso_activo,
 " ocurre si duración de ", identificador_de_proceso, " excede ", max_duracion_unidades_tiempo ;
oracion_de_excepcion_por_subtiempo = identificador_de_proceso_activo,
 " ocurre si duración de ", identificador_de_proceso, " es menor que ", min_duracion_unidades_tiempo ;
oracion_de_ruta = "Por ruta ", cadena_etiqueta, ", ", oracion_procedimental ;
cadena_etiqueta = nombre ;
(* Abanicos lógicos: el complemento puede coordinar bajo cuantificador de fan *)
operador_de_fan = "exactamente uno de" | "al menos uno de" ;

(* ===== A.6 — Condición ===== *)
oracion_de_condicion = oracion_transformadora_condicional | oracion_habilitadora_condicional ;
oracion_transformadora_condicional = oracion_de_consumo_condicional
 | oracion_de_consumo_condicional_con_estado
 | oracion_de_efecto_condicional ;
oracion_de_consumo_condicional = ( identificador_de_proceso, " ocurre si ", identificador_de_objeto,
 " existe, en cuyo caso ", identificador_de_objeto, " se consume, de lo contrario ",
 identificador_de_proceso, " se omite" )
 | ( "Si ", identificador_de_objeto, " existe entonces ", identificador_de_proceso,
 " ocurre y consume ", identificador_de_objeto, ", de lo contrario se omite ", identificador_de_proceso ) ;
oracion_de_consumo_condicional_con_estado = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " está en ", estado_de_entrada, ", en cuyo caso ",
 identificador_de_objeto, " se consume, de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_de_efecto_condicional = oracion_de_efecto_condicional_simple
 | oracion_de_efecto_entrada_salida_condicional
 | oracion_de_efecto_entrada_condicional
 | oracion_de_efecto_salida_condicional ;
oracion_de_efecto_condicional_simple = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " existe, en cuyo caso ", identificador_de_proceso,
 " afecta ", identificador_de_objeto, ", de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_de_efecto_entrada_salida_condicional = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " está en ", estado_de_entrada, ", en cuyo caso ",
 identificador_de_proceso, " cambia ", identificador_de_objeto, " de ", estado_de_entrada,
 " a ", estado_de_salida, ", de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_de_efecto_entrada_condicional = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " está en ", estado_de_entrada, ", en cuyo caso ",
 identificador_de_proceso, " cambia ", identificador_de_objeto, " de ", estado_de_entrada,
 ", de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_de_efecto_salida_condicional = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " existe, en cuyo caso ", identificador_de_proceso,
 " cambia ", identificador_de_objeto, " a ", estado_de_salida,
 ", de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_habilitadora_condicional = oracion_de_agente_condicional | oracion_de_instrumento_condicional ;
oracion_de_agente_condicional = ( objeto_con_opcion_de_estado, " maneja ",
 identificador_de_proceso, " si ", identificador_de_objeto, " existe, de lo contrario ",
 identificador_de_proceso, " se omite" )
 | ( objeto_con_opcion_de_estado, " maneja ", identificador_de_proceso, " si ",
 identificador_de_objeto, " está en ", identificador_de_estado, ", de lo contrario ",
 identificador_de_proceso, " se omite" ) ;
oracion_de_instrumento_condicional = ( identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " existe, de lo contrario ", identificador_de_proceso, " se omite" )
 | ( identificador_de_proceso, " ocurre si ", identificador_de_objeto, " está en ",
 identificador_de_estado, ", de lo contrario ", identificador_de_proceso, " se omite" ) ;

(* ===== A.7 — Multiplicidad, expresión y listas bifurcadas ===== *)
restriccion_de_expresion = "donde ", nombre, ( ( operacion_logica, nombre_de_valor )
 | ( inicio_conjunto, ( nombre | nombre_de_valor ), { ",", ( nombre | nombre_de_valor ) }, fin_conjunto ) ) ;
operacion_logica = "=" | "<" | ">" | "<=" | ">=" ;
inicio_conjunto = " en {" ;
fin_conjunto = "}" ;
conjunto_de_cosas_objeto = cosa_objeto, [ { ", ", cosa_objeto } ], " y ", ( cosa_objeto | "más" ),
 [ ( ", ordenados por ", criterio_de_orden ) | ( ", en esa secuencia" ) ] ;
conjunto_de_cosas_proceso = cosa_proceso, [ { ", ", cosa_proceso } ], " y ", ( cosa_proceso | "más" ),
 [ ( ", ordenados por ", criterio_de_orden ) | ( ", en esa secuencia" ) ] ;
criterio_de_orden = nombre ;
cosa_objeto = [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado ;
cosa_proceso = [ restriccion_de_participacion, " " ], identificador_de_proceso ;
oracion_de_especializacion_xor_objeto = oracion_basica_xor_objeto | oracion_xor_objeto_separada_por_comas ;
oracion_basica_xor_objeto = objeto_especial, " puede ser ", identificador_de_objeto, " o ", identificador_de_objeto ;
oracion_xor_objeto_separada_por_comas = objeto_especial, " puede ser uno de ",
 identificador_de_objeto, { ", ", identificador_de_objeto }, " o ", identificador_de_objeto ;
oracion_de_herencia_multiple_objeto = objeto_especial, " es ", lista_de_objetos_generales ;
lista_de_objetos_generales = " un ", identificador_de_objeto,
 [ { " un ", identificador_de_objeto } ], " y un ", identificador_de_objeto ;

(* ===== A.8 — Estructurales (enlaces etiquetados) ===== *)
oracion_estructural = oracion_de_enlace_estructural_etiquetado | oracion_de_agregacion
 | oracion_de_caracterizacion | oracion_de_rasgo_opcional  (* ext §6.2 *)
 | oracion_de_especializacion | oracion_de_instanciacion ;
oracion_de_enlace_estructural_etiquetado = oracion_etiquetado_unidireccional | oracion_etiquetado_bidireccional ;
oracion_etiquetado_unidireccional = oracion_etiquetado_unidireccional_simple | oracion_etiquetado_bifurcada ;
oracion_etiquetado_unidireccional_simple = oracion_etiquetado_nullTag_objeto
 | oracion_etiquetado_nullTag_proceso | oracion_etiquetado_nonNullTag_objeto | oracion_etiquetado_nonNullTag_proceso ;
oracion_etiquetado_nullTag_objeto = [restriccion_de_participacion, " "],
 objeto_origen, etiqueta_nula_unidireccional, [restriccion_de_participacion, " "], objeto_destino ;
oracion_etiquetado_nullTag_proceso = [restriccion_de_participacion, " "],
 proceso_origen, etiqueta_nula_unidireccional, [restriccion_de_participacion, " "], proceso_destino ;
oracion_etiquetado_nonNullTag_objeto = [restriccion_de_participacion, " "],
 objeto_origen, " ", etiqueta_directa, " ", [restriccion_de_participacion, " "], objeto_destino,
 [", ", restriccion_de_expresion] ;
oracion_etiquetado_nonNullTag_proceso = [restriccion_de_participacion, " "],
 proceso_origen, " ", etiqueta_directa, " ", [restriccion_de_participacion, " "], proceso_destino ;
etiqueta_nula_unidireccional = " se relaciona con " | etiqueta_nula_definida_por_usuario ;
oracion_etiquetado_bifurcada = oracion_bifurcada_nullTag_objeto | oracion_bifurcada_nullTag_proceso
 | oracion_bifurcada_nonNullTag_objeto | oracion_bifurcada_nonNullTag_proceso ;
oracion_bifurcada_nullTag_objeto = [restriccion_de_participacion, " "], objeto_origen,
 etiqueta_nula_unidireccional, conjunto_de_cosas_objeto ;
oracion_bifurcada_nullTag_proceso = [restriccion_de_participacion, " "], proceso_origen,
 etiqueta_nula_unidireccional, conjunto_de_cosas_proceso ;
oracion_bifurcada_nonNullTag_objeto = [restriccion_de_participacion, " "], objeto_origen,
 " ", etiqueta_directa, " ", conjunto_de_cosas_objeto ;
oracion_bifurcada_nonNullTag_proceso = [restriccion_de_participacion, " "], proceso_origen,
 " ", etiqueta_directa, " ", conjunto_de_cosas_proceso ;
oracion_etiquetado_bidireccional = oracion_bidireccional_asimetrica_objeto
 | oracion_bidireccional_asimetrica_proceso | oracion_bidireccional_simetrica_objeto
 | oracion_bidireccional_simetrica_proceso ;
oracion_bidireccional_asimetrica_objeto = ( [restriccion_de_participacion, " "],
 objeto_origen, etiqueta_directa_bidireccional, [restriccion_de_participacion, " "], objeto_destino,
 [", ", restriccion_de_expresion] )
 | ( [restriccion_de_participacion, " "], objeto_destino, etiqueta_inversa_bidireccional,
 [restriccion_de_participacion, " "], objeto_origen, [", ", restriccion_de_expresion] ) ;
oracion_bidireccional_simetrica_objeto = ( [restriccion_de_participacion, " "],
 objeto_origen, " y ", [restriccion_de_participacion, " "], objeto_destino, " son ", etiqueta_simetrica )
 | ( [restriccion_de_participacion, " "], objeto_origen, " y ", [restriccion_de_participacion, " "],
 objeto_destino, etiqueta_nula_bidireccional ) ;
oracion_bidireccional_asimetrica_proceso = ( [restriccion_de_participacion, " "],
 proceso_origen, etiqueta_directa_bidireccional, [restriccion_de_participacion, " "], proceso_destino )
 | ( [restriccion_de_participacion, " "], proceso_destino, etiqueta_inversa_bidireccional,
 [restriccion_de_participacion, " "], proceso_origen ) ;
oracion_bidireccional_simetrica_proceso = ( [restriccion_de_participacion, " "],
 proceso_origen, " y ", [restriccion_de_participacion, " "], proceso_destino, " son ", etiqueta_simetrica )
 | ( [restriccion_de_participacion, " "], proceso_origen, " y ", [restriccion_de_participacion, " "],
 proceso_destino, etiqueta_nula_bidireccional ) ;
etiqueta_simetrica = expresion_de_etiqueta ;
etiqueta_directa_bidireccional = expresion_de_etiqueta ;
etiqueta_inversa_bidireccional = expresion_de_etiqueta ;
etiqueta_nula_bidireccional = " se relacionan" | etiqueta_nula_definida_por_usuario ;

(* ===== A.9 — Estructuras fundamentales ===== *)
oracion_de_agregacion = oracion_de_agregacion_objeto | oracion_de_agregacion_proceso ;
oracion_de_agregacion_objeto = objeto_todo, " consta de ", lista_de_partes_objeto ;
oracion_de_agregacion_proceso = proceso_todo, " consta de ", lista_de_partes_proceso ;
lista_de_partes_objeto = parte_objeto, [ { ", ", parte_objeto } ], " y ", ( parte_objeto | "al menos otra parte" ) ;
lista_de_partes_proceso = parte_proceso, [ { ", ", parte_proceso } ], " y ", ( parte_proceso | "al menos otra parte" ) ;
parte_objeto = [restriccion_de_participacion, " "], identificador_de_objeto ;
parte_proceso = [restriccion_de_participacion, " "], identificador_de_proceso ;
oracion_de_caracterizacion = oracion_de_caract_objeto | oracion_de_caract_proceso ;
oracion_de_caract_objeto = identificador_de_objeto, " exhibe ",
 ( lista_de_atributos | lista_de_operadores | lista_de_atributos, ", así como ", lista_de_operadores ) ;
oracion_de_caract_proceso = identificador_de_proceso, " exhibe ",
 ( lista_de_operadores | lista_de_atributos | lista_de_operadores, ", así como ", lista_de_atributos ) ;
(* ext §6.2 — RF2o rasgo opcional: extensión declarada de producto; el reverse acepta además
   la variante plural « tiene … opcionales » que el generador no emite. *)
oracion_de_rasgo_opcional = identificador_de_cosa, " tiene ", ( "un " | "una " ),
 identificador_de_objeto, " opcional" ;  (* ext §6.2 *)
oracion_de_especializacion = oracion_de_especializacion_objeto | oracion_de_especializacion_proceso
 | oracion_de_especializacion_estado | oracion_de_especializacion_individual
 | oracion_de_especializacion_xor_objeto | oracion_de_herencia_multiple_objeto ;
oracion_de_especializacion_objeto = lista_de_objetos_especiales, " son ", identificador_de_objeto ;
oracion_de_especializacion_proceso = lista_de_procesos_especiales, " son ", identificador_de_proceso ;
oracion_de_especializacion_estado = lista_de_objetos_con_estado, " son ", objeto_con_estado ;
oracion_de_especializacion_individual = identificador_de_objeto, " es ", articulo, identificador_de_objeto ;
articulo = "un " | "una " ;
oracion_de_instanciacion = oracion_de_instanciacion_objeto | oracion_de_instanciacion_proceso ;
oracion_de_instanciacion_objeto = identificador_de_objeto, " es una instancia de ", identificador_de_objeto
 | lista_de_objetos_instancia, " son instancias de ", identificador_de_objeto ;
oracion_de_instanciacion_proceso = identificador_de_proceso, " es una instancia de ", identificador_de_proceso
 | lista_de_procesos_instancia, " son instancias de ", identificador_de_proceso ;

(* ===== A.10 — Gestión de contexto ===== *)
oracion_de_gestion_de_contexto = oracion_de_despliegue | oracion_de_plegado
 | oracion_de_descomposicion | oracion_de_recomposicion
 | oracion_de_composicion_intermodelo | oracion_de_referencia_externa ;
oracion_de_composicion_intermodelo = opd_hijo, " es una vista de sub-modelo de ", nombre_de_modelo
 | opd_hijo, " referencia el sub-modelo ", nombre_de_modelo, " desde ", opd_padre ;
oracion_de_referencia_externa = identificador_de_objeto, " en ", opd_hijo, " es referencia externa a ",
 identificador_de_objeto, " del modelo propietario ", nombre_de_modelo ;
oracion_de_despliegue = oracion_de_despliegue_objeto | oracion_de_despliegue_proceso ;
oracion_de_despliegue_objeto = oracion_de_despliegue_objeto_inespecificado
 | oracion_de_despliegue_objeto_todo | oracion_de_despliegue_objeto_general
 | oracion_de_despliegue_objeto_clase | oracion_de_despliegue_objeto_exhibidor ;
oracion_de_despliegue_objeto_inespecificado = identificador_de_objeto,
 " se despliega en ", lista_de_atributos, [", así como ", lista_de_operadores] ;
oracion_de_despliegue_objeto_todo = objeto_todo, " desde ", opd_padre,
 " se despliega por partes en ", opd_hijo, " en ", lista_de_partes_objeto ;
oracion_de_despliegue_objeto_general = objeto_general, " desde ", opd_padre,
 " se despliega por especialización en ", opd_hijo, " en ", lista_de_objetos_especiales ;
oracion_de_despliegue_objeto_clase = clase_de_objeto, " desde ", opd_padre,
 " se despliega por instanciación en ", opd_hijo, " en ", lista_de_objetos_instancia ;
oracion_de_despliegue_objeto_exhibidor = identificador_de_objeto, " desde ", opd_padre,
 " se despliega por rasgos en ", opd_hijo, " en ", lista_de_atributos, [", así como ", lista_de_operadores] ;
oracion_de_despliegue_proceso = oracion_de_despliegue_proceso_inespecificado
 | oracion_de_despliegue_proceso_todo | oracion_de_despliegue_proceso_general
 | oracion_de_despliegue_proceso_clase | oracion_de_despliegue_proceso_exhibidor ;
oracion_de_despliegue_proceso_inespecificado = identificador_de_proceso,
 " se despliega en ", lista_de_operadores, [", así como ", lista_de_atributos] ;
oracion_de_despliegue_proceso_todo = proceso_todo, " desde ", opd_padre,
 " se despliega por partes en ", opd_hijo, " en ", lista_de_partes_proceso ;
oracion_de_despliegue_proceso_general = proceso_general, " desde ", opd_padre,
 " se despliega por especialización en ", opd_hijo, " en ", lista_de_procesos_especiales ;
oracion_de_despliegue_proceso_clase = clase_de_proceso, " desde ", opd_padre,
 " se despliega por instanciación en ", opd_hijo, " en ", lista_de_procesos_instancia ;
oracion_de_despliegue_proceso_exhibidor = identificador_de_proceso, " desde ", opd_padre,
 " se despliega por rasgos en ", opd_hijo, " en ", lista_de_operadores, [", así como ", lista_de_atributos] ;
oracion_de_plegado = oracion_de_plegado_objeto | oracion_de_plegado_proceso ;
oracion_de_plegado_objeto = identificador_de_objeto, " se pliega en ", opd_padre ;
oracion_de_plegado_proceso = identificador_de_proceso, " se pliega en ", opd_padre ;
oracion_de_descomposicion = oracion_de_descomposicion_en_diagrama
 | oracion_de_descomposicion_en_nuevo_diagrama | oracion_de_descomposicion_objeto_en_diagrama
 | oracion_de_descomposicion_objeto_en_nuevo_diagrama ;
(* alineación §7.1 plantilla Mixta: grupos paralelos intercalados en cualquier posición de la
   secuencia; corrige el bloque paralelo terminal « y en paralelo » de la base A.10, nunca emitido. *)
elemento_de_secuencia_mixta = identificador_de_proceso | ( "paralelo ", lista_de_procesos ) ;
lista_de_secuencia_mixta = elemento_de_secuencia_mixta, { ", ", elemento_de_secuencia_mixta },
 [ ( " y " | " e " | ", y " | ", e " ), elemento_de_secuencia_mixta ] ;
oracion_de_descomposicion_en_diagrama = ( identificador_de_proceso, " se descompone en ",
 lista_de_procesos, ", en esa secuencia", [", así como ", lista_de_objetos_en_zoom] )
 | ( identificador_de_proceso, " se descompone en paralelo ", lista_de_procesos,
 [", así como ", lista_de_objetos_en_zoom] )
 | ( identificador_de_proceso, " se descompone en ", lista_de_secuencia_mixta,
 ", en esa secuencia", [", así como ", lista_de_objetos_en_zoom] ) ;
oracion_de_descomposicion_en_nuevo_diagrama = ( identificador_de_proceso, " desde ", opd_padre,
 " se descompone en ", opd_hijo, " en ", lista_de_procesos, ", en esa secuencia",
 [", así como ", lista_de_objetos_en_zoom] )
 | ( identificador_de_proceso, " desde ", opd_padre,
 " se descompone en ", opd_hijo, " en paralelo ", lista_de_procesos, [", así como ", lista_de_objetos_en_zoom] )
 | ( identificador_de_proceso, " desde ", opd_padre,
 " se descompone en ", opd_hijo, " en ", lista_de_secuencia_mixta,
 ", en esa secuencia", [", así como ", lista_de_objetos_en_zoom] ) ;
oracion_de_descomposicion_objeto_en_diagrama = identificador_de_objeto, " se descompone en ",
 lista_de_objetos, ", en esa secuencia", [", así como ", lista_de_procesos_en_zoom] ;
oracion_de_descomposicion_objeto_en_nuevo_diagrama = identificador_de_objeto, " desde ", opd_padre,
 " se descompone en ", opd_hijo, " en ", lista_de_objetos, ", en esa secuencia",
 [", así como ", lista_de_procesos_en_zoom] ;
lista_de_objetos_en_zoom = lista_de_objetos ;
lista_de_procesos_en_zoom = lista_de_procesos ;
oracion_de_recomposicion = oracion_de_recomposicion_proceso | oracion_de_recomposicion_objeto ;
oracion_de_recomposicion_proceso = identificador_de_proceso, " se recompone desde ", opd_hijo ;
oracion_de_recomposicion_objeto = identificador_de_objeto, " se recompone desde ", opd_hijo ;

(* ===== ext §9 — Oración compuesta / coordinada ===== *)
(* Extensión de esta spec: NO figura en Apéndice A de opm-opl-es. Coordina N hechos
   atómicos en UNA línea con sub-spans; cada hecho conserva ref+hint propios. *)
oracion_compuesta = oracion_compuesta_predicado_coordinado
 | oracion_compuesta_destino_enumerado
 | oracion_compuesta_sujeto_coordinado ;
conector_serial = ", " | " y " | " e " | " o " | " u " ;
oracion_compuesta_predicado_coordinado = identificador_de_proceso, " ",
 predicado_procedimental, { ", ", predicado_procedimental }, conector_final, predicado_procedimental ;
predicado_procedimental = ( "consume ", objeto_con_opcion_de_estado )
 | ( "genera ", objeto_con_opcion_de_estado )
 | ( "afecta ", lista_de_objetos )
 | ( "requiere ", objeto_con_opcion_de_estado )
 | ( "cambia ", frase_de_cambio_entrada_salida )
 | ( "consume ", operador_de_fan, " ", lista_de_objetos ) ;
oracion_compuesta_destino_enumerado = ( identificador_de_objeto, " exhibe ", lista_de_objetos )
 | ( identificador_de_objeto, " consta de ", lista_de_partes_objeto ) ;
oracion_compuesta_sujeto_coordinado = lista_de_objetos, " ", verbo_concordado_plural,
 " ", objeto_con_opcion_de_estado ;
verbo_concordado_plural = "consumen" | "generan" | "afectan" | "requieren" | "manejan" ;
conector_final = " y " | " e " | " o " | " u " ;
salto_de_linea = "\n" ;

(* ===== ext §6.5 — Sufijo de etiqueta de enlace ===== *)
(* Extensión declarada de producto: el generador adjunta la etiqueta de usuario de un enlace
   (procedimental o estructural fundamental) como sufijo tras el punto terminal de la oración
   base; el parser extrae el sufijo antes de cotejar la oración. Traza: procedural.ts·conEtiquetaEnlace
   (~273) / parsear.ts·ETIQUETA_SUFIX (línea 5) / aplicar.ts (patch fijar-etiqueta-enlace). *)
sufijo_de_etiqueta_de_enlace = " [etiqueta: ", expresion_de_etiqueta, "]" ;  (* ext §6.5 *)
oracion_con_etiqueta_de_enlace = oracion_opl_es, sufijo_de_etiqueta_de_enlace ;  (* ext §6.5 *)
```

### 1.1 Restricciones de §18 (texto literal, líneas 2617–2634)

> Restricciones (RFC 2119):
> 
> - **R-§18-LEX-1** (`opm-opl-es A.2`, `reglas §4.14·R-OPL-LEX-1/2/3`): el alfabeto léxico ADMITE letras ASCII, vocales acentuadas, `ñ`, `ü` (mayúscula/minúscula); `caracter_de_cadena` SE LIMITA a letra, dígito decimal, `-` y `_`; `nombre_simple` COMIENZA con letra. Los no-terminales normativos SE ESCRIBEN en `snake_case`.
> - **R-§18-PART-1** (`A.2`, `reglas §4.14·R-OPL-PART-1`): las restricciones de participación textuales PERTENECEN al conjunto cerrado `un/una`, `un/una opcional`, `al menos un/una`, `exactamente un/una`, `al menos dos`, `dos o más`, o límites numéricos/paramétricos (`0`, `m a n`).
> - **R-§18-RANGO-1** (`A.2`, `A.7`, `reglas §4.14·R-OPL-RANGO-1/2/3`): el rango textual USA `valor`, `varía de X a Y`, o intervalos `[..]`/`(..)` con `*` exclusivamente como límite abierto; la restricción de expresión INICIA con `donde`; las operaciones lógicas SON el conjunto ASCII `=`, `<`, `>`, `<=`, `>=`. Cualquier símbolo Unicode equivalente DEBE normalizarse a ASCII o declararse como extensión de visualización.
> - **R-§18-CONJ-1** (`A.7`, `reglas §4.14·R-OPL-CONJ-1`): la pertenencia a conjunto SE EMITE con `en { ... }`.
> - **R-§18-LISTA-1** (`A.3`, `A.7`, `reglas §4.14·R-OPL-LISTA-1/2`): las listas SEPARAN miembros intermedios con coma y el último con `y`/`o` (alternancia `e`/`u` por fonética), SIN coma de Oxford; las listas bifurcadas TERMINAN en `más`, `ordenados por criterio` o `en esa secuencia` solo donde la producción lo permita.
> - **R-§18-NORM-1**: el parser NORMALIZA la entrada a la forma ASCII canónica antes de cotejar producciones; los caracteres del alfabeto extendido (acentos, `ñ`, `ü`) SE PRESERVAN en los nombres pero las operaciones lógicas y delimitadores SE NORMALIZAN a ASCII.
> - **R-§18-EXT-1** (ext `§9`): la `oracion_compuesta` es extensión de esta spec, no del Apéndice A. Coordina N hechos atómicos en UNA línea; cada hecho coordinado CONSERVA su `ref` y su sub-span (`hint`). NO SE ADMITE la fusión opaca que descarte tokens/refs por hecho. La coordinación de sujeto SOLO SE EMITE cuando el canon define el plural concordado.
> 
> GAPs de derivación sin soporte (producciones derivables de esta EBNF sin generador ni parser hoy):
> 
> - GAP-DONDE-EXPRESION (§18·A.7): la `restriccion_de_expresion` (`donde …`) es derivable pero sin generador ni parser (`donde` solo aparece en comentarios de `parsear.ts`); derivación-sin-soporte.
> - GAP-RANGO-TEXTUAL (§18·A.2): los intervalos de rango (`intervalo_de_rango`/`expresion_de_rango`, `[..]`/`(..)`) y la `clausula_de_rango` son derivables pero sin generador ni parser; GAP-VARIA cubre solo el verbo `varía de … a`.
> 
> Trazabilidad de parser: `app/src/opl/parser/parsear.ts` reconoce el **subconjunto soportado** de producciones (el detalle vive en la tabla §20); las producciones derivables sin soporte llevan GAP nombrado (GAP-DONDE-EXPRESION, GAP-RANGO-TEXTUAL, GAP-DESPLIEGUE-DEDICADO, GAP-RECOMPONE, GAP-PLIEGA). Tipos de la superficie reconocida en `app/src/opl/parser/tipos.ts`.
> 
> Rationale: `opm-opl-es A.0–A.10` (gramática formal OPL-ES) + `reglas §4.14` (EBNF normativa). La extensión `oracion_compuesta` traza a §9 de esta spec.

### 1.2 Reglas de §18: obligación y consecuencia para la herramienta

| ID | Enunciado preciso | Obligación (canon) | Consecuencia para la herramienta |
|---|---|---|---|
| R-§18-LEX-1 | Alfabeto: letras ASCII, vocales acentuadas, `ñ`, `ü` (mayúsculas y minúsculas). `caracter_de_cadena` ∈ {letra, dígito, `-`, `_`}. `nombre_simple` empieza con letra. No-terminales normativos en `snake_case`. | ADMITE / SE LIMITA / COMIENZA (equivale a DEBE) | **Parsear OPL** con ese léxico. **Generar OPL** solo con nombres lexicables. La consecuencia de modelo de datos es *inferida*: nombres de cosa formados por palabras que empiezan con mayúscula (`nombre_singular_de_*`) y estados de una sola palabra en minúscula (`identificador_de_estado = palabra_no_capitalizada`, sin espacios). La herramienta debería advertir cuando un nombre no se pueda expresar en OPL. La regla de `snake_case` rige el documento, no la herramienta. |
| R-§18-PART-1 | Las restricciones de participación textuales forman un conjunto cerrado: `un/una`, `un/una opcional`, `al menos un/una`, `exactamente un/una`, `al menos dos`, `dos o más`, o límites numéricos/paramétricos (`0`, `m a n`). | PERTENECEN (DEBE) | **Modelo de datos**: la multiplicidad se limita a ese conjunto. **Generar/parsear OPL**: solo esas formas. Según A.3/A.5 y R-MULT-1A (citada en el comentario EBNF), la multiplicidad solo va en slots de **objeto**; los slots de proceso NO la llevan. Esto es **impedir** en la UI. |
| R-§18-RANGO-1 | Rango textual: `es valor`, `varía de X a Y` o intervalos `[..]`/`(..)`, con `*` solo como límite abierto. La restricción de expresión inicia con `donde`. Operadores lógicos ASCII: `=`, `<`, `>`, `<=`, `>=`. Todo símbolo Unicode equivalente DEBE normalizarse a ASCII o declararse extensión de visualización. | USA / INICIA / SON / DEBE | **Parsear OPL** con normalización Unicode→ASCII. **Generar OPL** en ASCII. Aviso: GAP-VARIA, GAP-RANGO-TEXTUAL y GAP-DONDE-EXPRESION declaran que hoy no hay generador ni parser, así que el canon lo exige sin haberlo realizado nunca. |
| R-§18-CONJ-1 | La pertenencia a conjunto se emite con `en { ... }`. | SE EMITE (DEBE) | **Generar OPL** (dentro de `restriccion_de_expresion`; ver GAP-DONDE-EXPRESION). |
| R-§18-LISTA-1 | Las listas separan los miembros intermedios con coma y el último con `y`/`o` (`e`/`u` según la fonética), SIN coma de Oxford. Las listas bifurcadas terminan en `más`, `ordenados por criterio` o `en esa secuencia` solo donde la producción lo permita. | SEPARAN / TERMINAN (DEBE) | **Generar OPL**: el conector final se elige por fonética del término siguiente (R-VERB-KW-2, l.185: el canon solo dice "condición fonética del término siguiente"; que sea `y→e` ante /i/ y `o→u` ante /o/ es **inferido**). **Parsear OPL**: aceptar `y/e/o/u`. Ojo: las producciones `lista_de_*` de la EBNF no incluyen `e`/`u` (ver GAP §13). |
| R-§18-NORM-1 | El parser normaliza la entrada a la forma ASCII canónica antes de cotejar. Los acentos, `ñ` y `ü` se preservan en los nombres; los operadores lógicos y delimitadores se normalizan a ASCII. | NORMALIZA / SE PRESERVAN (DEBE) | **Parsear OPL**: paso previo de normalización. Por §20.1/§5.4 incluye aceptar la grafía legacy `despues de` además de `después de`. |
| R-§18-EXT-1 | `oracion_compuesta` es extensión de la spec. Coordina N hechos atómicos en UNA línea; cada hecho conserva su `ref` y su sub-span (`hint`). NO SE ADMITE una fusión opaca que descarte tokens o refs por hecho. La coordinación de sujeto SOLO SE EMITE cuando el canon define el plural concordado. | CONSERVA / NO SE ADMITE / SOLO SE EMITE (DEBE / NO DEBE) | **Generar OPL** con tokens por hecho (para renderizar interacción por sub-span). **Parsear OPL**: descomponer la compuesta en sus hechos. La capacidad de componer es condicional (hoy GAP-COMPOSICION); los invariantes son obligatorios si se implementa. |
| GAP-DONDE-EXPRESION | `restriccion_de_expresion` (`donde …`) derivable pero sin generador ni parser. | (derivación sin soporte) | Decisión de alcance: implementar, o declarar fuera del subconjunto soportado con diagnóstico `unsupported-kernel`. |
| GAP-RANGO-TEXTUAL | Intervalos de rango y `clausula_de_rango` derivables, sin generador ni parser. | (derivación sin soporte) | Igual que el anterior. |
| Trazabilidad de parser (l.2632) | `parsear.ts` reconoce un **subconjunto soportado**. Las producciones derivables sin soporte llevan un GAP nombrado. | inferido | **Parsear OPL**: el parser nuevo debe declarar explícitamente qué subconjunto reconoce (ver R-§19-SIM-2). Los nombres de archivo son circunstanciales. |

### 1.3 Inventario de familias de oración de la EBNF → obligación de generar/parsear

La columna "Ejemplo literal" usa solo la gramática; los marcadores tipográficos (`**`, `*`, backticks) no forman parte de la EBNF, salvo en `oracion_de_estado_current` (ver GAP §13).

| Familia (no-terminal) | Forma literal (resumen de la producción) | Obligación | Consecuencia |
|---|---|---|---|
| `oracion_de_tipo_de_dato` | `X es de tipo {boolean\|string\|[unsigned \|signed ]integer\|float\|double\|short\|long\|enumerated}` | DEBE (inferido de la EBNF normativa); GAP-TIPO: sin generador | generar/parsear |
| `oracion_de_propiedad_generica` | `X es {física\|informacional\|ambiental\|sistémica\|persistente\|transitoria}` | DEBE (D1–D6 son entrada reverse válida, l.379) | parsear (forma atómica); el generador prefiere la combinada |
| `oracion_de_clasificacion_combinada` (ext §2.0) | `X es un {objeto\|proceso} {físico\|informacional}[ y {sistémico\|ambiental}]` o solo afiliación | DEBERÍA (l.222: "Preferida en emisión OPFORJA") | generar (forma preferida) y parsear |
| `oracion_de_enumeracion_de_estados` | `X puede estar s1, s2 o s3[, y otros estados]` | DEBE | generar/parsear |
| `oracion_de_estados_iniciales/finales/por_defecto/current` | `Estado s de X es {inicial\|final\|por defecto\|declarado \`Current\`}` | DEBE (D7–D9, D13). D10 `inicial y final` falta en la EBNF (l.303) | generar/parsear |
| `oracion_de_consumo` / `oracion_de_resultado` | `P consume [mult ]X[ en s]` / `P genera [mult ]X[ en s]` | DEBE | generar/parsear |
| `oracion_de_efecto` | `P afecta [mult ]X[ en s], … y …` | DEBE | generar/parsear |
| `oracion_de_cambio_*` | `P cambia X de s1 a s2` · `P cambia X de s1` · `P cambia X a s2` · `P cambia X de s1 a {exactamente uno de\|al menos uno de} s2, s3 o s4` | DEBE | generar/parsear |
| `oracion_de_agente` / `oracion_de_instrumento` | `[mult ]X[ en s] maneja P` / `P requiere [mult ]X[ en s]` | DEBE | generar/parsear; agente solo humano (R-HAB-AG-1, l.623) → advertir |
| `oracion_de_evento_*` | `X[ en s] inicia P, que consume X` · `X inicia P, que afecta X` · `X[ en s] inicia y maneja P` · `X[ en s] inicia P, que requiere X[ en s]` | DEBE | generar/parsear |
| `oracion_de_invocacion` | `P invoca Q[, R y S]` · `P se invoca a sí mismo` | DEBE | generar/parsear (con `después de <demora>` según §5.4, que falta en la EBNF) |
| `oracion_de_excepcion_*` | `H ocurre si duración de P excede <v> unidades-tiempo` · `… es menor que <v> unidades-tiempo` | DEBE | generar/parsear; realización `<valor> <unidad>` (l.884) |
| `oracion_de_ruta` | `Por ruta L, <oracion_procedimental>` | DEBE (R-OPL-RUTA-1, l.1813) | generar/parsear; la producción es inalcanzable desde `parrafo_opl_es` (GAP) |
| `oracion_de_condicion` (A.6) | `P ocurre si X existe, en cuyo caso X se consume, de lo contrario P se omite` · variante `Si X existe entonces P ocurre y consume X, de lo contrario se omite P` · `P ocurre si X está en s, en cuyo caso X se consume, …` · efecto simple con `existe` · cambio condicional con `está en s` (entrada-salida / entrada) · salida con `existe` · agente `X maneja P si X {existe\|está en s}, de lo contrario P se omite` · instrumento `P ocurre si X {existe\|está en s}, de lo contrario P se omite` | DEBE | generar/parsear |
| `oracion_de_especializacion_xor_objeto` | `X puede ser A o B` / `X puede ser uno de A, B o C` | DEBE (canónico); GAP-XOR-FEATURE/PARSER | generar/parsear (pendiente) |
| `oracion_de_herencia_multiple_objeto` | `X es un A … y un B` | DEBE (derivable) | generar/parsear (producción defectuosa, ver GAP) |
| `oracion_etiquetado_*` (SE1–SE5) | `[m ]A se relaciona con [m ]B` · `A <etiqueta> B[, donde …]` · bifurcadas `A <etiqueta> B, C y {D\|más}[, ordenados por c\|, en esa secuencia]` · bidireccional `A <directa> B` / `B <inversa> A` · simétrica `A y B son <etiqueta>` · `A y B se relacionan` | DEBE; GAP-TAG-PARSER / GAP-SSE-PARSER | generar/parsear |
| `oracion_de_agregacion` | `Todo consta de A, B y {C\|al menos otra parte}` | DEBE | generar/parsear |
| `oracion_de_caracterizacion` | `X exhibe A, B y C[, así como P y Q]` (objeto) / `P exhibe Q …[, así como A …]` (proceso) | DEBE | generar/parsear |
| `oracion_de_rasgo_opcional` (ext §6.2) | `X tiene {un\|una} A opcional`; el reverse acepta también `tiene … opcionales` | PUEDE (extensión de producto) | generar/parsear |
| `oracion_de_especializacion_*` | `A, B y C son G` · `A en s1 y B en s2 son G en s` · `A es {un\|una} G` | DEBE | generar/parsear |
| `oracion_de_instanciacion_*` | `I es una instancia de C` / `I1 y I2 son instancias de C` | DEBE | generar/parsear |
| `oracion_de_composicion_intermodelo` / `oracion_de_referencia_externa` | `SDn es una vista de sub-modelo de M` · `SDn referencia el sub-modelo M desde SDp` · `X en SDn es referencia externa a Y del modelo propietario M` | derivable (sin regla que lo exija en el tramo) | candidata a sobreingeniería (multi-modelo) |
| `oracion_de_despliegue_*` | `X se despliega en A y B[, así como …]` · `X desde SDp se despliega por {partes\|especialización\|instanciación\|rasgos} en SDh en …` | derivable; GAP-DESPLIEGUE-DEDICADO (la emisión real reusa el verbo de la relación fundamental, l.1252) | generar: reusar `consta de`/`exhibe`/`son`/`son instancias de` |
| `oracion_de_plegado_*` | `X se pliega en SDp` | canónico; GAP-PLIEGA; parser con `unsupported-kernel` | parsear → advertir sin mutar |
| `oracion_de_descomposicion_*` | `P se descompone en A, B y C, en esa secuencia[, así como X]` · `P se descompone en paralelo A y B[, así como X]` · mixta `P se descompone en A, paralelo B y C, y D, en esa secuencia` · variantes `P desde SDp se descompone en SDh en …` · objeto `X se descompone en A y B, en esa secuencia[, así como P]` | DEBE | generar/parsear (el reverse crea el refinamiento y el orden, no los miembros; §20.1) |
| `oracion_de_recomposicion_*` | `P se recompone desde SDh` | canónico; GAP-RECOMPONE | pendiente |
| `oracion_compuesta_*` (ext §9) | `P consume A, genera B y afecta C` · `X exhibe A, B y C` · `X consta de …` · `A y B {consumen\|generan\|afectan\|requieren\|manejan} C` | condicional (forma objetivo, GAP-COMPOSICION) | generar/parsear con sub-spans |
| `sufijo_de_etiqueta_de_enlace` (ext §6.5) | `<oración>. [etiqueta: texto]` | PUEDE (R-EST-TAG-3, l.1124) | generar/parsear (extraer el sufijo antes de cotejar) |


---

## 2. §19 — Roundtrip, bisimetría e invariantes de equivalencia

Propósito declarado: *"OPFORJA mantiene una correspondencia bidireccional entre el OPD (modelo) y el panel OPL (texto). Esta sección fija qué significa esa correspondencia, dónde es total y dónde es parcial."*

| ID | Enunciado preciso | Obligación | Consecuencia para la herramienta |
|---|---|---|---|
| R-§19-SIM-1 | Para todo modelo válido, el generador DEBE producir prosa OPL que el parser reverse reconozca **sin diagnósticos de severidad `error`**. El forward (modelo→texto) es total sobre el kernel cubierto. | DEBE | **Generar OPL** total, y **parsear OPL** lo generado sin errores. Criterio de aceptación: `parsear(generar(m))` no produce errores para todo `m` válido. |
| R-§19-SIM-2 | El reverse (texto→modelo) es total SOLO sobre el subconjunto que el aplicador soporta. Las producciones reconocibles pero no aplicables DEBEN diagnosticarse con `unsupported-kernel` (severidad `warning`) y NO DEBEN mutar el modelo. | DEBE / NO DEBE | **Parsear OPL** + **advertir**: reconocer, avisar y no aplicar. El subconjunto aplicable debe estar declarado. |
| R-§19-SIM-3 | Un fixture marcado `bisimetricaEstricta` EXIGE igualdad línea por línea entre `generar(modelo)` y `generar(aplicar(parsear(generar(modelo))))` partiendo de un modelo vacío. La cobertura se amplía agregando fixtures, no tocando el framework. | EXIGE (DEBE) | **Parsear OPL** (verificación): suite de roundtrip. Desde un modelo vacío, el texto generado reconstruye un modelo que vuelve a generar el mismo texto. |
| R-§19-DISP-1 | Las líneas **solo-display** (plegado/despliegue de §12, presentación de §13) se generan para lectura pero NO se revierten como mutaciones. Editarlas NO DEBE producir patches; el parser DEBE tratarlas como ruido informativo. | NO DEBE / DEBE | **Parsear OPL**: clasificar esas líneas y descartarlas. **Renderizar**: se ven, pero no son editables con efecto. |
| R-§19-DISP-2 | Las líneas **parseables** (hechos atómicos de §3–§8 y composición de §9) son las únicas portadoras de mutación reverse. La frontera display/parseable DEBE ser explícita en el clasificador del parser. | SON / DEBE | **Parsear OPL**: el clasificador de líneas es explícito. |
| R-§19-LENS-1 | La **ausencia** de una línea en el texto editado NO DEBE borrar el hecho del modelo. El planificador DEBE emitir `no-delete-by-absence` (severidad `info`) y NO generar patches destructivos por omisión. *"El borrado es una acción explícita, nunca inferida por sustracción de prosa."* | NO DEBE / DEBE | **Parsear OPL** + **soportar operación**: la edición de texto nunca borra. Borrar un hecho exige un gesto explícito (en el canvas o con un comando de borrado). Esto choca con la intuición de "borrar la línea borra el hecho" y es decisivo para el diseño de la UX del panel OPL. Coincide con R-OPL-EDIT-4 (l.2020) y R-OPL-FALLO-8 (l.2182). |
| R-§19-LENS-2 | La planificación (preview) NO DEBE mutar el modelo aunque proponga patches; el modelo solo cambia al aplicar. El preview es puro. | NO DEBE | **Soportar operación**: parsear → previsualizar → confirmar/aplicar, en dos fases, con un preview sin efectos. |
| R-§19-LENS-3 | Al aplicar patches no destructivos, los hechos omitidos en el texto (enlaces, entidades, estados) DEBEN preservarse idénticos: `exportarModelo(aplicar(modelo, patchesVacíos)) == exportarModelo(modelo)`. | DEBE | **Soportar operación** / **exportar**: aplicar un conjunto vacío es la identidad, y la exportación es determinista. |
| R-§19-COMP-1 | Componer N hechos en una `oracion_compuesta` y luego parsearla DEBE rendir exactamente el mismo conjunto de hechos, ni más ni menos. La composición es una transformación de superficie: identidad sobre el conjunto de hechos. | DEBE | **Generar/parsear OPL**: `parsear(componer(F)) = F` como conjunto (Apéndice A.3 cita R-COMP-REV-2). |
| R-§19-COMP-2 | Cada hecho coordinado DEBE conservar su `ref` y su sub-span (`hint`); la coordinación NO DEBE fusionar tokens opacamente. La descomposición es la inversa exacta de la composición. | DEBE / NO DEBE | **Generar OPL** con tokens por hecho; **renderizar** hover/clic por sub-span. |
| R-§19-ROT-1 | Cuando la bisimetría sea parcial, la spec DEBE declararlo y el fixture DEBE marcarse no estricto (`bisimetricaEstricta=false`), validando solo el forward hasta cerrar la brecha. | DEBE | **Parsear OPL** (verificación): cada caso no bisimétrico se declara. Para la herramienta nueva, es preferible listar explícitamente las construcciones que son solo forward. |

### 2.1 Tabla §19.5 "Dónde se rompe la bisimetría" (literal)

| Caso | Estado | Convención |
|------|--------|------------|
| Producción reconocida sin aplicador | parcial | `unsupported-kernel` (warning), sin mutación; bisimetría no exigida hasta cubrir el aplicador |
| Línea solo-display editada | no aplica | tratada como ruido; sin patch |
| Reordenamiento de líneas equivalentes | tolerado | el conjunto de hechos es invariante al orden; el generador reimpone orden canónico (§16) |
| Variante léxica de superficie (display) normalizable | tolerado | el parser normaliza a ASCII canónico (§18) antes de cotejar |

Consecuencias adicionales (**inferido** de §19.5):
- **Parsear OPL**: la semántica del texto es un *conjunto* de hechos, no una secuencia. Reordenar líneas no produce cambios.
- **Generar OPL**: el orden canónico (§16) se reimpone siempre al regenerar.

### 2.2 Diagnósticos nombrados en §19 (y su cotejo con §17)

| Código | Severidad | Cuándo |
|---|---|---|
| `unsupported-kernel` | `warning` | producción reconocida sin aplicador; no muta (R-§19-SIM-2). En §17 (l.2014/2182) aparece como la razón `inversa-no-soportada`. |
| `no-delete-by-absence` | `info` | línea ausente en el texto editado; no borra (R-§19-LENS-1). |
| (errores) | `error` | no deben aparecer al parsear lo generado (R-§19-SIM-1). |


---

## 3. §20 — Trazabilidad y gaps

| ID | Enunciado preciso | Obligación | Consecuencia |
|---|---|---|---|
| R-§20-AUD-1 | La tabla §20 es el punto de partida de la auditoría de alineación spec↔código. Toda fila con estado `GAP-*` DEBE resolverse en esa auditoría: cerrando el código, corrigiendo la emisión no canónica, añadiendo el fixture o reclasificando el hecho. Ninguna fila `GAP-*` se resuelve dentro de la spec. | DEBE | **No aplica a la herramienta en ejecución.** Para el rehecho, cada GAP pide una decisión explícita: implementar o reclasificar/excluir, declarando el subconjunto soportado. |
| Nota de vigencia (2026-06-12) | El último pase forward completo de la tabla es anterior al 2026-06-11; el re-forward completo queda en backlog (`deep-opm-pro/docs/HANDOFF.md`). | informativa | Circunstancial. La tabla está desactualizada por declaración propia. |
| Leyenda | `alineado` · `GAP-código` (canónica sin generador y/o parser) · `GAP-spec` (símbolo de código sin entrada en la spec) · `GAP-VERIFY` (traza no confirmada). | informativa | No aplica. |

### 3.1 §20.1 filtrada: qué exige el canon a la herramienta (se omiten nombres de archivo y símbolos del código v0)

Las columnas "Generador", "Parser" y "Fixture" del original trazan a `app/src/opl/**` de deep-opm-pro v0 y son **circunstanciales**. Aquí conservo lo normativo: el constructo, el estado declarado y la consecuencia para la herramienta nueva.

| Sección | Constructo canónico | Estado en canon | Consecuencia para la herramienta (rehecho) |
|---|---|---|---|
| §1.1 | `varía de … a` (rango) | GAP-VARIA | canónico sin realizar: generar/parsear, o excluir con diagnóstico |
| §1.1 | `es de tipo` | GAP-TIPO | ídem |
| §1.1 / §6.3 | `puede ser` (especialización XOR) | GAP-XOR-FEATURE · GAP-XOR-PARSER | ídem ("feature pendiente") |
| §1.1 / §7.3 | `se refina por …` (CX4) | GAP-REFINA | ídem; **no hay producción EBNF** para `se refina` |
| §1.1 / §7.2 | `se pliega en` (plegado total CX5/CX6) | GAP-PLIEGA | el parser lo reconoce con `unsupported-kernel` y no aplica plegado ("diseño de corte") |
| §1.1 / §7.1 | `se recompone desde` (CX7/CX8) | GAP-RECOMPONE | canónico sin realizar |
| §2.1 | Entidad (objeto/proceso) | alineado | generar |
| §2.1 | Supresión de placeholder (R-ENT-2) | alineado (procesos) · GAP-PLACEHOLDER-OBJETO | generar: suprimir el OPL de las cosas placeholder, incluidos los objetos `Objeto`/`Objeto_N` (según el frontmatter v1.3.0, R-ENT-2-APUNTE lo neutraliza en la especie *apunte*) |
| §2.3 | Estados `puede estar` | alineado | generar |
| §2.4 | Designación de estado | alineado | generar |
| §2.5 | Valor de atributo `es valor` | alineado | generar (**sin producción EBNF** como oración) |
| §2.6 | Formato nominal `Instancia : Clase` | GAP-NOMBRE-INSTANCIA | canónico sin realizar |
| §2.7 / §2.8 | Esencia / afiliación | alineado | generar (forma combinada) |
| §3.1–§3.3 | `consume` / `genera` / `afecta` | alineado | generar/parsear |
| §3.4 | TS3 `de … a …` | alineado (fixtures estrictas) | generar/parsear, bisimétrico |
| §3.5 / §3.6 | TS4 `de` / TS5 `a` | alineado (estrictas) · GAP-PROCEDENCIA-ESCIND | generar/parsear |
| §4.1 / §4.2 | Agente `maneja` / instrumento `requiere` (+ estado/evento/cond/negada) | alineado · GAP-NEGADA-REVERSE | generar/parsear; la variante negada es **solo emisión** (sin bisimetría) |
| §4.x | Habilitador con estado HS1/HS2 | alineado (estricta) | generar/parsear |
| §4.x | Abanico de instrumento/agente e inversos (`es requerido por`, `es manejado por`) | alineado · GAP-FIXTURE-ABANICO-HABILITADOR | generar/parsear (**sin producción EBNF**) |
| §5.1 | Evento `inicia` | alineado | generar/parsear |
| §5.1 / §5.2 | Evento o condición sobre **resultado** / **invocación** | cerrado: **degrada a la forma base** | generar: al emitir, se descarta el modificador inválido y se emite el enlace base; la UI debería impedirlo (inferido) |
| §5.2 | Condición `ocurre si … en cuyo caso … de lo contrario` | alineado | generar/parsear |
| §5.3 | Excepción sobre-/subtiempo | alineado | generar/parsear |
| §5.4 | Invocación / autoinvocación (+ `después de <demora>`) | alineado (estrictas) | generar/parsear; `despues de` legacy aceptado |
| §6.1–§6.4 | `consta de` / `exhibe` / `son`·`es un` / `es una instancia de` | alineado (agregación y generalización estrictas) · GAP-NOMBRE-INSTANCIA | generar/parsear |
| §6.5 | Etiquetado SE1–SE5 | GAP-TAG-PARSER · GAP-FIXTURE-TAGGED | generar; parser pendiente |
| §6.5 | Sufijo `[etiqueta: …]` (R-EST-TAG-3) | alineado | PUEDE: generar/parsear |
| §6.6 | Etiquetado con estado SSE1–SSE7 | GAP-SSE-PARSER · GAP-FIXTURE-SSE | generar; parser pendiente |
| §7.1 | Descomposición CX1/CX2 (`en esa secuencia`, `paralelo`) | orden cerrado; residual: materialización de miembros | parsear: crea el refinamiento (idempotente, OPD hijo vacío) y reconstruye el orden (`ordenInzoom`) con **verificación por inversa**; si hay discrepancia, rechaza con `warning` y sin patch. Los miembros **no** se crean: diagnóstico `info`; el alta de subprocesos es un gesto del canvas |
| §7.2 | Despliegue por relación fundamental (CX3) | alineado | generar reusando el verbo fundamental; parsear por regex estructurales |
| §7.2 | Plegado parcial | alineado | generar (display) |
| §7.4 / §7.5 | Visibilidad de estados por OPD · marca temporal solo en descomposición de proceso | alineado | generar |
| §8 / §8.3 | Distribución/migración de enlaces por OPD · colisión de rol / precedencia | alineado (kernel del modelo) | soportar operación (modelo) |
| §7.7 / §9 | Guard anti-coordinación en refinamiento | cerrado-no-aplica | — |
| §7.6 | Fan bajo evento + cuantificador (C-19) | parcial; GAP-FAN-EVENTO | generar/parsear parcial |
| §7.6 | Fan resultado+condición (C-20, `puede generarse`) | cerrado: degrada a fan base; `puede generarse` retirado | generar: no emitir `puede generarse` |
| §7.6 | Fan probabilístico `Pr=p` (C-22) | alineado | generar `Pr=p`; el parser **descarta** `Pr=p` como anotación (la probabilidad no se reconstruye en reverse) |
| §7.6 | Fan `m de f` (R-FAN-8) | GAP-FAN-M | canónico sin realizar (solo `m=1`) |
| §9 | Composición eje (a), predicados coordinados | GAP-COMPOSICION · GAP-COMP-REVERSE | forma objetivo sin generador |
| §11 | Etiqueta de ruta | alineado · GAP-FIXTURE-RUTA | generar/parsear |
| §12–§13 | Display por OPD / orden / bloques | alineado | renderizar |
| §14.x / §14.5 | Panel OPL interactivo / tokens / refs · clic→foco | alineado | renderizar + soportar operación (navegación desde un token a su elemento) |
| §15 / §15.x | Edición OPL clasificada / aplicación · mutación por hecho (sub-span) | alineado | parsear + soportar operación |
| §16 | Visibilidad de esencia / orden canónico | alineado | generar (opciones de visibilidad) |
| §18 | Diagnóstico / fail-fast | alineado | parsear: resultado tipado (éxito o diagnóstico) |

### 3.2 §20.2 Índice de GAPs (literal)

| GAP | Origen | Descripción |
|-----|--------|-------------|
| GAP-VARIA | §1.1 | `varía de … a` canónico, sin generador. |
| GAP-TIPO | §1.1 | `es de tipo` canónico, sin generador. |
| GAP-XOR-FEATURE | §1.1 / §6.3 | `puede ser` (especialización XOR) canónico, reclasificado como feature pendiente; `es un` ya cubre la generalización individual. |
| GAP-XOR-PARSER | §6.3 | `puede ser` sin regex estructural en `astEstructural`. |
| GAP-REFINA | §1.1 / §7.3 | `se refina por …` (CX4) canónico, sin generador autónomo ni parser. |
| GAP-PLIEGA | §1.1 / §7.2 | `se pliega en` (plegado total CX5/CX6) canónico, sin generador; el parser lo reconoce (`parsear.ts·parsearContexto`, familia `plegado`, warning `unsupported-kernel`) pero el reverse no aplica plegado por diseño de corte (`planificar.ts·planificarContexto` solo aplica descomposición/despliegue). Existe plegado parcial. |
| GAP-RECOMPONE | §1.1 / §7.1 | `se recompone desde` (CX7/CX8) canónico, sin generador ni parser. |
| GAP-PLACEHOLDER-OBJETO | §2.1 | Rama objeto de R-ENT-2 sin implementar: `entidadOplEsEmitible` retorna `true` para objetos placeholder (`checkers.ts` sí los reconoce: `Objeto`/`Objeto_N`); la supresión de procesos placeholder está cerrada (`esNombreProcesoPlaceholder` conectado en `generar.ts`). |
| GAP-NOMBRE-INSTANCIA | §2.6 / §6.4 | Formato nominal `Instancia : Clase` sin generador dedicado. |
| GAP-FIXTURE-EFECTO | §3.3 | Cerrado: `enlace-efecto-simple`. |
| GAP-FIXTURE-TS3 | §3.4 | Cerrado: `cambio-estado-ts3` y `cambio-estado-ts3-compacto` son fixtures estrictas. |
| GAP-PARSE-TS4 | §3.5 | Cerrado: regex de `cambia … de \`estado\`` sin `a` verificada por fixture estricta. |
| GAP-FIXTURE-TS4 | §3.5 | Cerrado: `cambio-estado-ts4-solo-entrada` es fixture estricta. |
| GAP-PROCEDENCIA-ESCIND | §3.5 | Metadato de procedencia escindido no rastreado en este pase. |
| GAP-PARSE-TS5 | §3.6 | Cerrado: regex de `cambia … a \`estado\`` sin `de` verificada por fixture estricta. |
| GAP-FIXTURE-TS5 | §3.6 | Cerrado: `cambio-estado-ts5-solo-salida` es fixture estricta. |
| GAP-FIXTURE-HS | §4.x | Cerrado: `habilitador-con-estado-hs` es fixture estricta. |
| GAP-NEGADA-REVERSE | §3.4 / §4.1 / §4.2 | La variante negada (extensión declarada, ver §3.4) es emisión-only: `procedural.ts` la emite pero no existe ruta de parseo; sin bisimetría. |
| GAP-FIXTURE-ABANICO-HABILITADOR | §4.x | Cobertura de parseo del fan de instrumento/agente e inversos verificada (2026-06-12, `ABANICO_VERBO_RE_LIST` + `parsearAbanicoDirecto`), pero sin fixture ni test de parser dedicado que la defienda contra regresión. |
| GAP-FIXTURE-EVENTO | §5.1 | Cerrado: `evento-consumo-canonico`. |
| GAP-EVENTO-RESULTADO | §5.1 | Cerrado: evento sobre resultado degrada a resultado base. |
| GAP-EVENTO-INVOCACION | §5.1 | Cerrado: evento sobre invocación degrada a invocación base. |
| GAP-CONDICION-RESULTADO | §5.2 | Cerrado: condición sobre resultado degrada a resultado base; `puede generarse` retirado. |
| GAP-CONDICION-INVOCACION | §5.2 | Cerrado: condición sobre invocación degrada a invocación base. |
| GAP-EXC-UNIDADES-LITERAL | §5.3 | Cerrado por ajuste-spec: `unidades-tiempo` es metavariable realizada como valor+unidad. |
| GAP-FIXTURE-INVOCACION | §5.4 | Cerrado: `invocacion-con-demora-tilde`, `autoinvocacion-con-demora-tilde` y `evento-invocacion-degrada-base`. |
| GAP-INVOCACION-TILDE | §5.4 | Cerrado: emisión canónica `después de`; parser acepta grafía legacy sin tilde. |
| GAP-FIXTURE-AGREGACION | §6.1 | Cerrado: `enlace-estructural-agregacion` (estricta). |
| GAP-FIXTURE-EXHIBICION | §6.2 | Cerrado: `enlace-estructural-exhibicion`. |
| GAP-FIXTURE-GENERALIZACION | §6.3 | Cerrado: `enlace-estructural-generalizacion` (estricta). |
| GAP-FIXTURE-CLASIFICACION | §6.4 | Cerrado: `enlace-estructural-clasificacion`. |
| GAP-TAG-PARSER | §6.5 | `se relaciona con` / `se relacionan` / etiquetas de usuario sin regex en `astEstructural`. |
| GAP-FIXTURE-TAGGED | §6.5 | Sin fixture roundtrip dedicado de etiquetado. |
| GAP-SSE-PARSER | §6.6 | Etiquetados con estado especificado heredan GAP-TAG-PARSER (sin regex). |
| GAP-FIXTURE-SSE | §6.6 | Sin fixture dedicado de estructural con estado especificado. |
| GAP-FIXTURE-ESTRUCTURALES | §6.x | Cerrado para relaciones fundamentales; etiquetado sigue separado en GAP-TAG-PARSER / GAP-FIXTURE-TAGGED. |
| GAP-CX-PARSER | §7.1 | Orden cerrado: `parsear.ts·parsearContexto` + patch `crear-refinamiento` reconstruyen el refinamiento (idempotente, OPD hijo vacío; miembros no se crean: diagnóstico `info`); la marca `en esa secuencia`/`paralelo` SÍ se reconstruye → `opd.ordenInzoom` (`planificarOrdenInzoom` + `set-orden-inzoom`, verificación por inversa). Residual: materialización de la lista de refinadores (intencional, por gesto). |
| GAP-FIXTURE-DESCOMPOSICION | §7.1 | Orden cerrado: roundtrip estricto del orden en `leyes/invocacion-implicita-bimodal.test.ts` (CX1/CX2/mixta sobre `opd.ordenInzoom`). Sin fixture en `fixtures-roundtrip.ts` por diseño (miembros del hijo irrecuperables desde modelo vacío). |
| GAP-DESPLIEGUE-DEDICADO | §7.2 / §18 | Superficies dedicadas A.10 (`se despliega por partes/especialización/instanciación/rasgos en`) derivadas en §18 pero sin generador ni declaración de sustitución; la emisión vigente reusa el verbo de la relación fundamental. |
| GAP-COMP-GUARDA | §7.7 / §9 | Cerrado-no-aplica: guard pendiente solo cuando exista GAP-COMPOSICION; hoy la protección es por construcción atómica. |
| GAP-FAN-EVENTO | §7.6 | Parcial: efecto con objeto común y procesos alternativos cerrado; otros roles bajo evento siguen sin generador. |
| GAP-FAN-RESULTADO-COND | §7.6 | Cerrado: fan resultado+condición degrada a fan base; `puede generarse` retirado. |
| GAP-PROB-SUPERFICIE | §7.6 | Cerrado: export OPL emite `Pr=p` y retira el sufijo porcentual legacy. |
| GAP-FAN-M | §7.6 | Sin generador para `exactamente m de f` / `al menos m de f` (solo `m=1`). |
| GAP-COL-RESOLUCION | §8.3 | Cerrado por ajuste-spec: vive en kernel `modelo/**`, no exige generador OPL de reporte. |
| GAP-COMPOSICION | §9 | Sin capa que coordine predicados de distinto verbo bajo sujeto-proceso compartido (eje a). |
| GAP-COMP-REVERSE | §9 | Parser no descompone una línea de predicados coordinados de distinto verbo (R-COMP-REV-1). |
| GAP-FIXTURE-RUTA | §11 | Sin fixture bisimétrica estricta de ruta en `fixtures-roundtrip.ts`; forward y reverse confirmados (`oracionEnlaceConRuta` / `RUTA_PREFIJO_RE` / `definirRutaEtiqueta`), defendidos por `parser.test.ts`. |
| GAP-DONDE-EXPRESION | §18 | `restriccion_de_expresion` (`donde …`) derivable de la EBNF, sin generador ni parser; derivación-sin-soporte. |
| GAP-RANGO-TEXTUAL | §18 | Intervalos de rango (`[..]`/`(..)`, `expresion_de_rango`, `clausula_de_rango`) derivables, sin generador ni parser; GAP-VARIA cubre solo el verbo `varía de … a`. |

**Síntesis de GAPs abiertos que el canon mantiene como canónicos** (candidatos a decisión de alcance del rehecho): GAP-VARIA, GAP-TIPO, GAP-XOR-FEATURE/PARSER, GAP-REFINA, GAP-PLIEGA, GAP-RECOMPONE, GAP-PLACEHOLDER-OBJETO, GAP-NOMBRE-INSTANCIA, GAP-NEGADA-REVERSE, GAP-TAG-PARSER, GAP-SSE-PARSER, GAP-DESPLIEGUE-DEDICADO, GAP-FAN-EVENTO, GAP-FAN-M, GAP-COMPOSICION, GAP-COMP-REVERSE, GAP-DONDE-EXPRESION, GAP-RANGO-TEXTUAL. Los GAP-FIXTURE-* y GAP-PROCEDENCIA-ESCIND son de test o metadato del código v0 y no se trasladan.

### 3.3 §20.3 Cobertura inversa

Barrido de los exports de `app/src/opl/**` de v0 (`oracionEnlaceConRuta`, `emitirEspecializacion`, `planificarEdicionOplLibre`, tipos `OplToken`, etc.), con `GAP-spec` = 0 tras la reclasificación. **No aplica a la herramienta nueva**: es trazabilidad a nombres de código v0. Lo único que conserva valor conceptual es que el modelo de tokens (`OplReferencia`/`OplToken`/`OplLineaInteractiva`/`OplTokenHint`) y el AST/patch (`OracionOplAst`/`PatchOplPropuesto`/`PrevisualizacionOplReverse`) existen como conceptos de §14/§15/§19.

---

## 4. §21 — Invariantes

### 4.1 §21.1 Invariantes prescriptivos del documento (perfil KORA/MD `spec`)

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-§21-PRESC-CONS | NO DEBEN coexistir reglas incompatibles sin cláusula de precedencia explícita; ante conflicto manda la regla más específica o la cláusula declarada. | NO DEBEN | **No aplica a la herramienta.** Sirve para arbitrar las contradicciones listadas en §13 de este dossier. |
| R-§21-PRESC-AUTO | Cada regla DEBE entenderse con su contexto local. | DEBE | No aplica (documento). |
| R-§21-PRESC-CIRC | Ninguna regla se justifica solo remitiendo a otra regla opaca; toda cadena termina en una fuente sustantiva (SSOT, ley, test). | NO DEBE / DEBE | No aplica (documento). |
| R-§21-PRESC-LANG | El documento se redacta en es-CL; se admiten anglicismos técnicos inevitables (`roundtrip`, `lens`, `display`, `EBNF`). | DEBE | No aplica. Por analogía (inferido), la UI y el OPL de la herramienta van en es-CL. |
| R-§21-PRESC-ENF | Toda tabla de validación DEBE incluir la columna `Enforcement`. | DEBE | No aplica. |
| R-§21-PRESC-INTEG | El documento cierra con la tríada Invariantes → Validación → Migración y usa `Rationale:` (nunca `Traces to:`). | DEBE | No aplica. |

### 4.2 §21.2 Invariantes OPL del dominio (literal + consecuencia)

| Invariante | Enunciado (literal) | Origen | Obligación | Consecuencia para la herramienta |
|---|---|---|---|---|
| **R-§21-OPL-VOCAB** Vocabulario cerrado | Los verbos, cópulas y conectores OPL PERTENECEN a un conjunto cerrado; ningún sinónimo libre es admisible. | §1 | DEBE / NO DEBE | **Generar OPL** solo con vocabulario cerrado. **Parsear OPL**: rechazar los sinónimos con un diagnóstico, sin adivinar. |
| **R-§21-OPL-TIPO** Tipografía portadora de tipo | El tipo de cada token (objeto, proceso, estado) SE CODIFICA tipográficamente: **objeto** (negrita), *proceso* (cursiva), `estado` (monoespaciado). La tipografía es semántica, no decorativa. | §2, §13 | DEBE | **Renderizar** el panel OPL con negrita/cursiva/monoespaciado según el tipo. En la exportación de texto, la codificación Markdown `**X**` / `*P*` / `` `s` `` es la usada en todos los ejemplos (inferido). |
| **R-§21-OPL-MOD** Un modificador por enlace | Cada enlace ADMITE como máximo un modificador de control; la combinación de modificadores en un mismo enlace está PROHIBIDA. | §8 | DEBE / NO DEBE | **Impedir**: el modelo de datos del enlace tiene un único campo de modificador (∅ \| evento \| condición), y la UI no permite combinarlos. |
| **R-§21-OPL-SPAN** Preservación de sub-span | La composición de prosa DEBE preservar el `ref` y el sub-span (`hint`) de cada hecho coordinado; sin fusión opaca. | §9 | DEBE | **Generar OPL** con tokens tipados (texto + ref) y **renderizar** interacción por token. |
| **R-§21-OPL-DISP** Display vs canónico | Existe una forma canónica (parseable, ordenada por §16) y formas de display (plegado, presentación); ambas DEBEN ser distinguibles y la canónica es la única autoritativa para reverse. | §16, §19.2 | DEBE | **Renderizar** las líneas de display con distinción visual. **Parsear OPL** solo la canónica. |

---

## 5. §22 — Validación

Valores de `Enforcement` (gobernanza KORA §7): `schema`, `lint`, `runtime`, `eval`, `manual`.

| Clase de regla | Cómo se verifica | Artefacto | Enforcement |
|----------------|------------------|-----------|-------------|
| Plantillas y vocabulario fijo (§1–§8) | unit sobre el generador: que las frases emitidas coincidan con las plantillas y usen solo el vocabulario cerrado | `app/src/opl/generadores/*.test.ts` | lint, eval |
| Roundtrip bisimétrico (§19.1, §19.4) | framework build→generar→parsear+aplicar→generar; igualdad línea-por-línea en fixtures estrictos | `app/src/opl/roundtrip.test.ts`, `fixtures-roundtrip.ts` | eval |
| Bisimetría / ley `safe-lens` (§19.3) | leyes ejecutables: no-borrado-por-ausencia, preview puro, preservación de hechos, unsupported-kernel sin mutación | `app/src/leyes/opl-reverse.test.ts` | eval |
| Estilo prescriptivo: RFC 2119, sin grasa, sin EN↔ES (§21.1) | lint de redacción donde sea automatizable + revisión humana del resto | gate de docs + revisión | lint, manual |
| Cobertura de GAPs (huecos de canon abiertos) | rastreo de GAPs declarados contra fixtures/leyes que los cierren | revisión de seguimiento de GAPs | manual |
| Conformidad KORA/MD familia `spec` (§21.1·INTEG) | tríada Invariantes→Validación→Migración presente; frontmatter y trazabilidad `Rationale:` correctos | revisión contra gobernanza KORA | manual |

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| (encabezado §22) | *"Toda regla de esta spec se verifica por alguno de los mecanismos declarados."* | inferido DEBE | **Verificación del producto**: el rehecho necesita, como mínimo, (1) tests de plantillas del generador, (2) roundtrip bisimétrico sobre fixtures y (3) leyes *safe-lens* (no borrar por ausencia, preview puro, preservación de hechos, `unsupported-kernel` sin mutación). Las rutas de archivo son de v0 y circunstanciales. |
| R-§22-ENF-1 | Toda fila de toda tabla de validación DEBE declarar su `Enforcement`. | DEBE | No aplica a la herramienta (documento). |
| R-§22-ENF-2 | `eval`/`lint`/`schema`/`runtime` DEBEN apuntar a un artefacto ejecutable concreto; `manual` DEBE nombrar el procedimiento. | DEBE | No aplica a la herramienta (gobernanza). |

---

## 6. §23 — Migración

Texto literal: *"Esta spec es un **major bump 1.0.0**: consolida en un solo documento autoritativo lo que antes vivía disperso, y cambia la fuente de verdad operativa de OPL en OPFORJA."*

| Antes | Ahora |
|-------|-------|
| OPL repartido entre `opm-opl-es` (gramática OPL-ES) y `reglas-opm-estrictas-es §4` (reglas de canon) | `spec-forja-opl-es` es la SSOT OPL bidireccional/operativa única de OPFORJA |
| Para resolver una duda OPL había que cruzar dos fuentes y reconciliarlas a mano | una sola fuente con trazabilidad `Rationale:` hacia ambas |
| La implementación (generadores/parser/leyes) se alineaba contra canon implícito | la implementación se alinea contra esta spec, vía la tabla de trazabilidad §20 |

| ID | Enunciado preciso | Obligación | Consecuencia |
|---|---|---|---|
| R-§23-MIG-1 | La implementación DEBE alinearse contra esta spec usando la tabla §20. Toda divergencia código↔spec es deuda. **Ante conflicto, `reglas-opm-estrictas-es` sigue por encima de esta spec.** | DEBE | **No aplica en ejecución**; para el rehecho fija la **precedencia**: reglas > spec OPL. |
| R-§23-MIG-2 | Los GAPs heredados DEBEN re-rastrearse contra esta spec y cerrarse vía fixtures/leyes (§22), no vía notas sueltas. | DEBE | Gobernanza del rehecho: cada GAP se cierra con un test o se declara fuera de alcance. |
| R-§23-DEP-1 | SE DEPRECIA consultar las dos fuentes dispersas (`opm-opl-es` + `reglas §4`) como ruta primaria para OPL. Se conservan como SSOT de canon OPM general y `Rationale:`. | SE DEPRECIA (DEBE) | No aplica. Coherente con la instrucción del usuario (solo 4 documentos). |
| R-§23-DEP-2 | NO SE ADMITE redactar reglas OPL nuevas fuera de esta spec; toda regla nueva entra aquí con `Rationale:` y `Enforcement`. | NO DEBE | **No aplica a la herramienta**; prohíbe inventar reglas OPL locales en el código (coherente con AGENTS.md). |

---

## 7. §24 — Composición por interfaz (modelo ∘ modelo)

Texto marco (literal): *"La composición une dos modelos identificando entidades de **interfaz compartida**. «Horizontal» distingue este gesto del refinamiento vertical; no afirma dualidad categorial. NO introduce verbo OPL nuevo: el OPL compuesto es la unión deduplicada de párrafos, con la entidad compartida una sola vez."*

| ID | Enunciado preciso | Obligación | Consecuencia |
|---|---|---|---|
| R-§24-COMP-1 | Dos modelos PUEDEN componerse identificando un conjunto de entidades compartidas (mapeo `entidad_B → entidad_A`). La sugerencia por defecto empareja por **nombre normalizado + mismo tipo OPM**; la identidad por id solo vale si el nombre también coincide. | PUEDE | **Soportar operación (opcional)**: importar un modelo B dentro de A con un preview del mapeo de interfaz. Espejo de R-CAT-COMP-1 (reglas l.1517). |
| R-§24-COMP-2 | En el OPL compuesto, una entidad compartida DEBE emitir sus designaciones **una sola vez**; sus enlaces de ambos modelos DEBEN consolidarse bajo esa identidad, sin duplicar la entidad ni su apariencia. Las entidades no compartidas de B se namespacean (ids) conservando su nombre OPL. | DEBE (si se compone) | **Generar OPL** deduplicado + **soportar operación** (fusión con remapeo de ids). Leyes citadas: `law-composicion-no-duplica`, `law-composicion-sin-refs-colgantes`. |
| R-§24-COMP-3 | La composición DEBE ser asociativa módulo namespacing (`(A∘B)∘C` y `A∘(B∘C)` dan el mismo OPL salvo ids) y NO DEBE introducir oraciones OPL inválidas que no estuvieran ya en A o B. | DEBE / NO DEBE | **Soportar operación**: la fusión es pura y determinista. Leyes: `law-composicion-asociativa`, `law-composicion-bien-tipada`. |
| R-§24-COMP-4 | La composición es **no bloqueante y reversible**. Si crea un conflicto de recurso lineal (objeto `lineal` consumido por procesos de ambos modelos), DEBE **advertirse, no impedirse**. | DEBE | **Advertir** + deshacer. Depende de la designación `lineal` (R-CAT-LIN-1, reglas l.1506: *"NO es designación ISO 19450 y NO DEBE alterar la gramática visual ni OPL base"*). |
| Traza a código | `app/src/modelo/composicion/componer.ts` (`componerModelos`: namespacing + dedup + remapeo). *"Estos verifican invariantes operativos; no prueban la propiedad universal de pushout."* | informativa | Circunstancial. |


---

## 8. Apéndice A — Ejemplo end-to-end (literal, líneas 2940–3016)

> Declarado: *"Ejemplo de referencia para fixtures y para enseñanza de la spec."* Obligación: inferido. Consecuencia: fixture candidato de roundtrip, pero antes hay que corregirlo (ver 8.1).

> Modelo completo y pequeño: **sistema de despacho de pedidos**. Reúne todas las familias canonizadas en §2–§10: entidad (objeto físico/informacional, estado), transformador (consumo/resultado/efecto/cambio), habilitador (agente/instrumento), modificador de control (evento/condición), estructural (agregación/exhibición/especialización/instanciación), abanico (XOR), multiplicidad y refinamiento (descomposición síncrona). Las oraciones respetan el vocabulario y plantillas de §1–§9.
> 
> ### A.1 Vocabulario del modelo
> 
> - **Objetos**: **Pedido** (informacional, estados `pendiente`/`despachado`), **Inventario** (físico, estado `disponible`/`agotado`), **Embalaje** (físico, insumo consumido), **Bulto** (físico, resultado), **Guía** (informacional, resultado), **Furgón** (físico), **Bicicleta** (físico), **Repartidor** (físico, agente humano), **Cliente** (físico, beneficiario), **Sistema De Despacho** (informacional, sistema), **Zona** (informacional) con especializaciones **Zona Urbana** / **Zona Rural**.
> - **Proceso raíz**: *Despachar* (descompone en *Preparar*, *Embalar*, *Entregar*).
> - **Atributo**: **Prioridad** de **Pedido**.
> 
> ### A.2 OPL atómica (una oración, un hecho — §2–§8)
> 
> Entidad y estado (§2):
> 
> - **Pedido** es informacional.
> - **Pedido** puede estar `pendiente` o `despachado`.
> - **Inventario** es físico.
> - **Inventario** puede estar `disponible` o `agotado`.
> - **Pedido** exhibe **Prioridad**.
> 
> Estructural (§6):
> 
> - **Sistema De Despacho** consta de **Furgón**, **Repartidor** e **Inventario**.
> - **Zona Urbana** y **Zona Rural** son **Zona**.
> - **Bulto** es una instancia de **Inventario**.
> 
> Transformador (§3):
> 
> - *Despachar* consume **Embalaje**.
> - *Despachar* genera **Guía**.
> - *Despachar* afecta **Inventario**.
> - *Despachar* cambia **Pedido** de `pendiente` a `despachado`.
> 
> Habilitador (§4):
> 
> - **Repartidor** maneja *Despachar*. (único enlace procedimental de **Repartidor** hacia *Despachar*: humano = agente, R-HAB-AG-1/5; el instrumento se realiza vía el abanico XOR de abajo, `reglas §5.3`)
> 
> Modificador de control (§5):
> 
> - **Embalaje** inicia *Despachar*, que consume **Embalaje**.
> - *Despachar* ocurre si **Inventario** está en `disponible`, en cuyo caso *Despachar* afecta **Inventario**, de lo contrario *Despachar* se omite.
> 
> Abanico XOR (§8.1) y multiplicidad (§10):
> 
> - *Despachar* requiere exactamente uno de **Furgón** o **Bicicleta**. (objetos no humanos; las ramas del fan suprimen la oración H2 individual, §4.2)
> - *Despachar* genera al menos una **Guía**.
> 
> ### A.3 OPL prosaica / compuesta (§9) del mismo modelo
> 
> La forma compuesta coordina hechos con eje compartido en una sola línea, **preservando un sub-span y una `ref` por hecho** (R-COMP-MAESTRA-1/2):
> 
> - Eje (a) — predicado coordinado, sujeto-proceso compartido (**forma objetivo**; hoy sin generador, `GAP-COMPOSICION` §9.6):
>   `*Despachar* consume **Embalaje**, genera **Guía** y afecta **Inventario**.`
> - Eje (b) — destino enumerado estructural:
>   `**Sistema De Despacho** consta de **Furgón**, **Repartidor** e **Inventario**.`
> 
> **Anotación de tokens/refs (§9.0) sobre la oración compuesta del eje (a):**
> 
> | sub-span | tipo de hecho | `ref` |
> | --- | --- | --- |
> | `*Despachar*` | proceso (sujeto compartido) | proceso:despachar |
> | `consume **Embalaje**` | transformador consumo | enlace:consumo · objeto:embalaje |
> | `genera **Guía**` | transformador resultado | enlace:resultado · objeto:guia |
> | `afecta **Inventario**` | transformador efecto | enlace:efecto · objeto:inventario |
> 
> `refs` de la línea = unión sin duplicados de las cuatro filas (R-COMP-MAESTRA-2, vía `refsUnicasPorTipoId`); el hover sobre `genera` resuelve `enlace:resultado`, no la primera `ref` (R-COMP-MAESTRA-3). Orden estable por fuerza semántica consumo→resultado→efecto (R-COMP-ELEG-3). Los enlaces de instrumento no se coordinan aquí: viven bajo el abanico XOR de A.2, y un fan se realiza como oración de abanico, no por coordinación copulativa (§4.2). `parsear(componer(F)) = F` como conjunto (R-COMP-REV-2).
> 
> ### A.4 Refinamiento (§7) — descomposición síncrona de *Despachar*
> 
> OPD hijo SD1: *Despachar* se descompone en sus subprocesos en secuencia temporal (primero arriba, último abajo):
> 
> - *Despachar* se descompone en *Preparar*, *Embalar* y *Entregar*, en esa secuencia.
> - *Preparar* consume **Embalaje**. *Preparar* cambia **Pedido** de `pendiente`.
> - *Embalar* genera **Bulto**.
> - *Entregar* cambia **Pedido** a `despachado`. *Entregar* afecta **Cliente**.
> 
> Nota (§7): el enlace de consumo de **Embalaje** y el de resultado de **Guía** NO viven en el contorno de *Despachar* en el OPD hijo: migran al primer/último subproceso y se reasignan (R-CX-DIST-1/2). El cambio de estado `pendiente`→`despachado` se escinde: entrada en *Preparar*, salida en *Entregar* (R-ESC-1).
> 
> Rationale: §2–§10 (todas las familias); §9.0 (composición a nivel de token); §7.5–§7.6 (distribución de enlaces y escisión de cambio de estado en descomposición síncrona). Ejemplo de referencia para fixtures y para enseñanza de la spec.

### 8.1 Validación del Apéndice A contra la EBNF §18 y contra el propio canon

| Línea del ejemplo | Veredicto | Motivo |
|---|---|---|
| `**Pedido** es informacional.` | derivable | `oracion_de_propiedad_generica` (esencia `informacional`). No es la forma preferida (l.222/379 prefieren `es un objeto informacional`). |
| `**Inventario** es físico.` | **NO derivable** | `esencia = "física" \| "informacional"`: la forma atómica usa el femenino `física` (D1, l.379) y la combinada exige `es un objeto físico`. `es físico` no existe en la gramática. Lo mismo ocurre en B.1 (`Repartidor es físico`) y B.5 (`Supervisor es físico`). |
| `**Pedido** puede estar \`pendiente\` o \`despachado\`.` | derivable | |
| `**Pedido** exhibe **Prioridad**.` | derivable | lista de un solo elemento. |
| `**Sistema De Despacho** consta de **Furgón**, **Repartidor** e **Inventario**.` | **NO derivable literalmente** | `lista_de_partes_objeto` solo admite `" y "` como conector final; `e` falta en la EBNF aunque R-§18-LISTA-1 y R-VERB-KW-1/2 lo exigen. |
| `**Zona Urbana** y **Zona Rural** son **Zona**.` | derivable | |
| `**Bulto** es una instancia de **Inventario**.` | derivable | Semánticamente dudoso: Bulto es resultado de *Embalar* e Inventario es un stock. No es una regla, pero es un ejemplo pobre. |
| `*Despachar* consume **Embalaje**.` + `**Embalaje** inicia *Despachar*, que consume **Embalaje**.` | **inconsistente** | El evento es un modificador sobre el enlace de consumo (l.718: *"Un modificador NO es una familia de enlace: anota un enlace base preexistente"*). Emitir la base y el evento para el mismo par duplica el hecho, o supone dos enlaces del mismo tipo entre el mismo par. |
| `*Despachar* afecta **Inventario**.` + `*Despachar* ocurre si **Inventario** está en \`disponible\`, en cuyo caso *Despachar* afecta **Inventario**, …` | **inconsistente y NO derivable** | Mismo problema de duplicación (efecto base y efecto condicional). Además, la EBNF no tiene un efecto condicional con `está en` que termine en `afecta`: `oracion_de_efecto_condicional_simple` usa `existe`, y las variantes con `está en` usan `cambia`. |
| `*Despachar* genera **Guía**.` + `*Despachar* genera al menos una **Guía**.` | **inconsistente** | Mismo resultado con y sin multiplicidad: o hay duplicación o hay dos enlaces. |
| `*Despachar* cambia **Pedido** de \`pendiente\` a \`despachado\`.` | derivable | |
| `**Repartidor** maneja *Despachar*.` | derivable | |
| `*Despachar* requiere exactamente uno de **Furgón** o **Bicicleta**.` | **NO derivable** | `oracion_de_instrumento` no admite `operador_de_fan`, y `exactamente uno de` no pertenece a `restriccion_de_participacion`. El abanico de habilitadores es canónico en §4.x/§8 pero no tiene producción. |
| A.3 `*Despachar* consume **Embalaje**, genera **Guía** y afecta **Inventario**.` | derivable | `oracion_compuesta_predicado_coordinado` (forma objetivo; GAP-COMPOSICION). |
| A.4 `*Despachar* se descompone en *Preparar*, *Embalar* y *Entregar*, en esa secuencia.` | derivable | |
| A.4 `*Preparar* cambia **Pedido** de \`pendiente\`.` / `*Entregar* cambia **Pedido** a \`despachado\`.` | derivable | escisión TS4/TS5 (R-ESC-1). |
| Nota A.4 (consumo de Embalaje y resultado de Guía migran al primer/último subproceso) | **incompleto** | En SD1 no hay ninguna línea `*Entregar* genera **Guía**.`; el efecto sobre Inventario tampoco se distribuye; `Bulto` y `Cliente` aparecen solo en SD1. |


---

## 9. Apéndice B — Patrones OPL sociotécnicos y agénticos (literal, líneas 3018–3077)

> Anclado a `app/src/modelo/simulacion/sociotecnico.ts` (runtime de simulación de v0). Obligación: los patrones son "composición de constructos canónicos"; no crean reglas nuevas. Consecuencia: no aplica a la herramienta como requisito. Solo ilustra R-HAB-AG-1 (agente = humano; servicio → instrumento).

> ## Apéndice B — Patrones OPL sociotécnicos y agénticos
> 
> Patrones recurrentes del runtime sociotécnico/agéntico de OPFORJA, expresados **siempre como composición de constructos canónicos** de §2–§9. Anclados a `app/src/modelo/simulacion/sociotecnico.ts`. Ninguna primitiva nueva: cada patrón reusa entidad+estado, habilitador, abanico, condición/evento, excepción e invocación. Estatus etiquetado por patrón: `canon` (composición pura de §2–§9) · `extensión declarada` (superficie operativa sobre el canon, ya declarada en la spec) · `no-canonizado` (aún sin realización canónica cerrada).
> 
> ### B.1 Actor–rol–autoridad — estatus `canon`
> 
> El actor (`ActorSim.tipo` = humano/equipo/servicio/sistema-externo) es un **objeto**; el rol se realiza vía habilitador (§4): **agente** si el actor es humano (`R-HAB-AG-1`, agente exclusivo de humanos), **instrumento** si es servicio/sistema-externo. La disponibilidad (`EstadoDisponibilidadActorSim`) son **estados** (§2.5).
> 
> - **Repartidor** es físico. **Repartidor** puede estar `disponible`, `ocupado` o `no-disponible`.
> - **Repartidor** maneja *Despachar*. (actor humano → habilitador agente; rol = participación en el proceso)
> - **Servicio De Ruteo** maneja *Calcular Ruta*. → **incorrecto**; un servicio NO es humano. Forma canónica:
>   `*Calcular Ruta* requiere **Servicio De Ruteo**.` (actor no humano → habilitador instrumento)
> - Disponibilidad como condición de habilitación (CS5/CS6, §5.2):
>   `**Repartidor** maneja *Despachar* si **Repartidor** está en \`disponible\`, de lo contrario *Despachar* se omite.`
> 
> Composición: objeto + estado + habilitador + condición con estado. El equipo (`tipo:equipo`) se nombra **Grupo** (plural humano, §1).
> 
> ### B.2 Agente–autonomía — estatus `canon`
> 
> El agente (`AgenteSim`) es un **objeto informacional** (R-OBJ-1) vinculado a su actor por estructural (§6); el nivel de autonomía (`NivelAutonomiaSim`) son **estados**; la política (`PoliticaAutonomiaSim` con `porDefecto`/`acciones`/`herramientas`) se realiza como **atributo** (exhibición §6.2) y se refina (§7) en política por acción y por herramienta.
> 
> - **Agente** es informacional. **Agente** puede estar `bloqueado`, `requiere-aprobación` o `autónomo`.
> - **Actor** consta de **Agente**. (vínculo `AgenteSim.actorId` → agregación)
> - **Agente** exhibe **Política**.
> - **Política** se descompone en **Política Por Defecto**, **Política Por Acción** y **Política Por Herramienta**. (refinamiento del atributo)
> 
> Composición: objeto informacional + estados + estructural + exhibición + refinamiento. Sin primitiva nueva.
> 
> ### B.3 Decisión — estatus `canon`
> 
> La decisión (`DecisionSim`) es un **proceso**; el resultado (`EstadoResultadoDecisionSim`) es un **estado** de la decisión bajo **abanico XOR** (§8.1); la precedencia de política (`resolverNivelAutonomia`: herramienta > acción > porDefecto) se realiza como **condición** (§5.2).
> 
> - *Decidir* cambia **Decisión** a exactamente uno de `permitida`, `suspendida` o `bloqueada`.
> - *Decidir* ocurre si **Política** está en `autónomo`, en cuyo caso *Decidir* cambia **Decisión** a `permitida`, de lo contrario *Decidir* se omite. (precedencia como condición de estado)
> 
> Composición: proceso + abanico XOR de estado-salida + condición con estado. Mapea `evaluarDecisionSociotecnica`.
> 
> ### B.4 Efecto pendiente — estatus `extensión declarada`
> 
> El efecto (`TipoEfectoSim` = ask-human/tool-call/http/python/mqtt/sql/ros/genai) es un **proceso invocado** vía **enlace de invocación** (§5.4, IV1); la aprobación humana es **condición/evento**; el escalamiento por demora es **excepción/sobretiempo** (§5.3, EX1).
> 
> - *Decidir* invoca *Llamar Herramienta*. (IV1: proceso→proceso; un proceso de efecto por `TipoEfectoSim`)
> - *Decidir* invoca exactamente uno de *Preguntar Humano* o *Llamar Herramienta*. (abanico XOR de invocación, §5.4)
> - *Aprobar* maneja *Preguntar Humano*. → HITL (agente humano, ver B.5)
> - *Escalar* ocurre si duración de *Preguntar Humano* excede 30 minutos. (sobretiempo; *Escalar* ambiental, R-EXC-AMBIENTAL-1)
> 
> Estatus `extensión declarada`: la familia de efectos `ask-human/tool-call/http/python/mqtt/sql/ros/genai` se nombra como conjunto de *procesos* invocados; la invocación, el abanico y la excepción son canon, pero la **taxonomía de tipos de efecto** es nomenclatura operativa del runtime, no un constructo OPL nuevo. La forma `invoca … si … ocurre` VIOLA R-IV-3/R-MOD-CAT-1 y ya no se exporta: GAP-CONDICION-INVOCACION está cerrado por degradación a invocación base (§5.2).
> 
> ### B.5 Supervisión humana HITL — estatus `canon`
> 
> La aprobación humana = **condición** (§5.2) + **agente humano** (§4, R-HAB-AG-1). El `EfectoSim` de tipo `ask-human` que `crearEfectoAprobacion` produce se realiza como proceso *Preguntar Humano* manejado por un actor humano.
> 
> - **Supervisor** es físico. **Supervisor** puede estar `disponible` o `no-disponible`.
> - **Supervisor** maneja *Aprobar*. (agente humano; HITL)
> - *Aprobar* ocurre si **Decisión** está en `suspendida`, en cuyo caso *Aprobar* cambia **Decisión** de `suspendida` a `permitida`, de lo contrario *Aprobar* se omite.
> - **Supervisor** inicia *Aprobar*, que afecta **Decisión**. (evento de disparo, §5.1)
> 
> Composición: objeto humano + estados + habilitador agente + condición con estado + evento. Sin primitiva nueva; HITL es composición pura.
> 
> Rationale: `sociotecnico.ts` (tipos `ActorSim`/`AgenteSim`/`DecisionSim`/`EfectoSim`/`ResultadoDecisionSim`); §2 (entidad/estado), §4 (habilitador agente/instrumento, R-HAB-AG-1), §5.1–§5.4 (evento/condición/excepción/invocación), §6 (estructural/exhibición), §7 (refinamiento), §8.1 (abanico XOR), §9 (composición). Todo patrón es composición de constructos canónicos; ninguna primitiva nueva.

### 9.1 Validación del Apéndice B

| Línea | Veredicto | Motivo |
|---|---|---|
| B.1 `*Calcular Ruta* requiere **Servicio De Ruteo**.` | correcto | Aplica R-HAB-AG-1: un actor no humano va como instrumento. Consecuencia: **advertir** si un agente no está marcado como humano (inferido; exige que el modelo sepa qué objetos son humanos). |
| B.1 `**Repartidor** maneja *Despachar* si **Repartidor** está en \`disponible\`, de lo contrario *Despachar* se omite.` | derivable | `oracion_de_agente_condicional` (CS5/CS6). |
| B.2 `**Agente** es informacional.` | **contradice R-HAB-AG-1** | R-HAB-AG-1 (l.623): *"el enlace de agente y el término 'agente' DEBEN reservarse EXCLUSIVAMENTE para humanos o grupos de humanos"*. Aquí se nombra "Agente" a un objeto informacional. |
| B.2 `**Actor** consta de **Agente**.` | **NO derivable** | `lista_de_partes_objeto` exige al menos dos partes o `al menos otra parte`. Lo mismo pasa con el ejemplo de R-EST-TAG-3 (l.1124) `**Todo** consta de **Parte**.` |
| B.2 `**Política** se descompone en **Política Por Defecto**, **Política Por Acción** y **Política Por Herramienta**.` | **NO derivable** | `oracion_de_descomposicion_objeto_en_diagrama` exige `, en esa secuencia`. Por otro lado, R-CX-DESP-2 (l.1260) prohíbe la marca temporal en el despliegue. |
| B.3 `*Decidir* cambia **Decisión** a exactamente uno de \`permitida\`, \`suspendida\` o \`bloqueada\`.` | **NO derivable** | Es canónico (R-FAN-5, l.1505), pero la EBNF solo tiene fan de salida con entrada común (`de s a exactamente uno de …`). |
| B.3 `*Decidir* ocurre si **Política** está en \`autónomo\`, en cuyo caso *Decidir* cambia **Decisión** a \`permitida\`, …` | **semánticamente mal formado** | La condición recae sobre Política y el cambio sobre Decisión: son dos enlaces fundidos en una oración condicional que, por plantilla, habla del mismo objeto. Además, `autónomo` es un estado de **Agente** (B.2), no de **Política**. |
| B.4 `*Aprobar* maneja *Preguntar Humano*.` | **inválido** | `maneja` exige un **objeto** humano como origen (R-HAB-AG-1; `oracion_de_agente` = objeto `maneja` proceso), y *Aprobar* es un proceso. |
| B.4 `*Decidir* invoca exactamente uno de *Preguntar Humano* o *Llamar Herramienta*.` | **NO derivable** | Canónico en §5.4 (l.897), pero `oracion_de_invocacion` no tiene `operador_de_fan`. |
| B.4 `*Escalar* ocurre si duración de *Preguntar Humano* excede 30 minutos.` | **NO derivable** | La EBNF fija el literal `" unidades-tiempo"`. La nota de §5.3 (l.884) manda realizarlo como `<valor> <unidad>`, pero la EBNF no se ajustó. |
| B.5 `**Supervisor** inicia *Aprobar*, que afecta **Decisión**.` | **semánticamente mal formado** | En un evento de efecto, el objeto disparador y el afectado son el mismo. Aquí son distintos. Además Supervisor ya es agente de *Aprobar*, así que correspondería `inicia y maneja`. |


---

## 10. Apéndice C — Índice de IDs (literal, líneas 3079–3136)

> Obligación: informativa. Consecuencia: taxonomía de IDs útil para etiquetar plantillas del generador y los tests (inferido). No impone comportamiento.


Familias de identificadores de regla y de oración usados en §1–§23, con su sección de origen. Las IDs de oración (D*, T*/TS*, H*/HS*, E*, C*, RF*/RX*/RH*, SE*/SSE*, CX*, EX*, IV*) etiquetan hechos OPL atómicos; las IDs de regla (`R-*`) etiquetan normas con `Rationale:`/`Enforcement`.

### C.1 IDs de oración (hechos atómicos)

| Familia | Significado | Sección |
| --- | --- | --- |
| D1–D13 | Designaciones de entidad (esencia/afiliación/perseverancia) | §2 |
| T1–T3 / TS1–TS5 | Transformadores: T1 consumo, T2 resultado, T3 efecto; TS* variantes con estado | §3 |
| H1–H2 / HS1–HS2 | Habilitadores: H1 agente, H2 instrumento; HS* con estado | §4 |
| ET1–ET2 / EH1–EH2 / ETS* / EHS* | Eventos: transformador/habilitador, con/sin estado | §5.1 |
| CT1–CT2 / CH1–CH2 / CS1–CS6 | Condiciones: transformador/habilitador/con estado | §5.2 |
| EX1–EX2 | Excepción: EX1 sobretiempo, EX2 subtiempo | §5.3 |
| IV1–IV2 | Invocación / autoinvocación | §5.4 |
| RF1–RF4 (+RF2b/RF3b/RF4b) / RX1–RX2 / RH1 | Relaciones estructurales fundamentales: RF1 agregación, RF2 exhibición, RF3 generalización (RX* XOR, RH1 herencia múltiple), RF4 clasificación | §6 |
| SE1–SE5 | Estructurales etiquetados: etiqueta de usuario, `se relaciona con`/`se relacionan`, bidireccional, recíproco | §6.5 |
| SSE1–SSE7 | Estructurales con estado especificado | §6 |
| CX1–CX8 | Refinamiento / gestión de contexto (in-zoom, despliegue, escisión) | §7 |
| CL | Token de composición / línea OPL | §9 |
| EBNF | Producciones de la gramática formal | §18 |

### C.2 IDs de regla por dominio

| Prefijo de regla | Dominio | Sección |
| --- | --- | --- |
| R-ENT-*, R-OBJ-*, R-PROC-*, R-COSA-* | Entidad / objeto / proceso / cosa | §2 |
| R-EST-*, R-ATR-*, R-VERB-EST-* | Estado / atributo / verbo de estado (`puede estar`) | §2 |
| R-INS-*, R-ENT-INS-*, R-PRIN-9 | Instrumento / principio | §2,§4 |
| R-CONS-*, R-RES-*, R-EFE-*, R-ESC-*, R-ESCIND-* | Transformadores y escisión de cambio de estado | §3 |
| R-TR-ASIM-* | Asimetría transformadora | §3 |
| R-AG-*, R-HAB-AG-*, R-HER-* | Agente (humano) / habilitador / herramienta | §4 |
| R-MOD-*, R-MOD-INPUT-*, R-MOD-CAT-*, R-MOD-NAT-* | Modificadores de control (categoría/input/naturaleza) | §5 |
| R-ECA-*, R-COND-RAMA-*, R-OPL-COND-ALT-*, R-OPL-SUP-* | Evento-condición-acción / ramas de condición | §5.1,§5.2 |
| R-EXC-*, R-EXC-AMBIENTAL-*, R-EXC-DUR-* | Excepción / sobretiempo-subtiempo | §5.3 |
| R-IV-*, R-INV-* | Invocación | §5.4 |
| R-STRE-*, R-STRF-*, R-EST-TAG-*, R-EST-HER-*, R-EST-GEN-*, R-EST-DIR-*, R-EST-PERS-* | Estructurales y sus variantes con estado | §6 |
| R-OPL-SE-* | Realización OPL de estructurales | §6 |
| R-IDP-*, R-ROL-*, R-CX-*, R-REF-*, R-DIST-*, R-ESC-* | Refinamiento / contexto / distribución de enlaces | §7 |
| R-OPL-RF-*, R-OPL-CX-*, R-OPL-TOTAL-* | OPL de refinamiento / despliegue total | §7 |
| R-COMB-*, R-ZNC-*, R-FAN-*, R-FAN-EST-*, R-FAN-PROB-*, R-FAN-M-*, R-PROB-* | Combinatoria / abanicos (XOR/OR/probabilístico) | §8 |
| R-FUERZA-*, R-PREC-* | Colisión de roles / fuerza / precedencia (propiedad de `reglas §6.5`/`§6.6`, citadas en §8.3.1) | §8 |
| R-COMP-MAESTRA-*, R-COMP-EJE-*, R-COMP-ELEG-*, R-COMP-ZP-*, R-COMP-REV-*, R-COMP-CFG-* | Composición de oraciones / prosa OPL | §9 |
| R-MULT-*, R-MULT-COMB-* | Multiplicidad y cardinalidad | §10 |
| R-OPL-RUTA-* | Etiquetas de ruta | §11 |
| R-OPL-DISP-* | Plegado / despliegue de display | §12 |
| R-OPL-PANEL-* | Presentación del panel OPL | §13 |
| R-OPL-INT-* | Interacción OPL↔OPD | §14 |
| R-OPL-EDIT-* | Edición de OPL | §15 |
| R-OPL-CFG-* | Configuración/opciones que afectan OPL | §16 |
| R-OPL-FALLO-* | Modos de fallo / validación / ambigüedad | §17 |
| R-OPL-LEX-*, R-OPL-PART-*, R-OPL-RANGO-*, R-OPL-CONJ-*, R-OPL-LISTA-* | Léxico / partículas / EBNF | §18 |
| R-OPL-VERB-*, R-VERB-KW-*, R-OPL-KW-* | Vocabulario verbal / palabras clave | §1 |
| R-OPL-PERSIST-*, R-OPL-TRANS-* | Persistencia de estado / transformación en OPL | §3,§5 |
| R-ARB-* | Arbitraje canon/OPCloud | §1 |
| R-§23-MIG-*, R-§23-DEP-* | Migración / depreciación | §23 |

Rationale: índice derivado por extracción (`rg` de patrones de ID sobre §1–§23); facilita navegación cruzada regla↔oración↔sección y auditoría de cobertura (§20 trazabilidad, §22 validación). Las IDs sociotécnicas/agénticas del Apéndice B son composiciones de las familias anteriores, no nuevas familias de ID.

---

## 11. Requisitos consolidados para la herramienta (tramo C)

| Req | Requisito | Obligación | Tipo | Fuente |
|---|---|---|---|---|
| OPLC-01 | El generador produce OPL para todo modelo válido, y el parser propio lo reconoce sin diagnósticos `error`. | DEBE | generar-opl | R-§19-SIM-1 |
| OPLC-02 | El reverse aplica solo el subconjunto declarado. Una producción reconocida sin aplicador emite `unsupported-kernel` (warning) y no muta el modelo. | DEBE / NO DEBE | parsear-opl | R-§19-SIM-2 |
| OPLC-03 | Suite de roundtrip estricta: `generar(m) == generar(aplicar(parsear(generar(m))))` línea por línea, desde un modelo vacío. Las brechas se marcan como fixtures no estrictos y se declaran. | DEBE (EXIGE) | parsear-opl | R-§19-SIM-3, R-§19-ROT-1 |
| OPLC-04 | Las líneas solo-display (plegado/despliegue, presentación) no generan patches; el clasificador display/parseable es explícito. | NO DEBE / DEBE | parsear-opl | R-§19-DISP-1/2, R-§21-OPL-DISP |
| OPLC-05 | Borrar una línea del texto nunca borra el hecho: se emite `no-delete-by-absence` (info). El borrado es explícito. | NO DEBE | operación | R-§19-LENS-1 |
| OPLC-06 | Edición OPL en dos fases: el preview es puro y el modelo solo cambia al aplicar. | NO DEBE | operación | R-§19-LENS-2 |
| OPLC-07 | Aplicar patches no destructivos preserva todo lo omitido. `export(aplicar(m, [])) == export(m)`. | DEBE | exportar-importar | R-§19-LENS-3 |
| OPLC-08 | El texto se interpreta como un conjunto de hechos: reordenar líneas no cambia el modelo y el generador reimpone el orden canónico. | inferido (tolerado) | parsear-opl | §19.5 |
| OPLC-09 | El parser normaliza a la forma ASCII canónica (operadores y delimitadores) y preserva acentos, `ñ` y `ü` en los nombres. Acepta variantes legacy normalizables (`despues de`). | DEBE | parsear-opl | R-§18-NORM-1, R-§18-RANGO-1 |
| OPLC-10 | Léxico de nombres: letras (incluidas á é í ó ú ñ ü), dígitos, `-`, `_`; los nombres de cosa son palabras capitalizadas y los estados una sola palabra en minúscula. Advertir los nombres no expresables en OPL. | DEBE (léxico) / inferido (advertencia) | parsear-opl | R-§18-LEX-1 |
| OPLC-11 | Multiplicidad limitada al conjunto cerrado (`un/una`, `un/una opcional`, `al menos un/una`, `exactamente un/una`, `al menos dos`, `dos o más`, `0`, `m a n`), solo en slots de objeto. | DEBE | modelo-de-datos | R-§18-PART-1, R-MULT-1A (citada) |
| OPLC-12 | Listas con coma y `y`/`o` final, alternancia `e`/`u` por fonética, sin coma de Oxford (salvo la mixta de descomposición). | DEBE | generar-opl | R-§18-LISTA-1 |
| OPLC-13 | Vocabulario OPL cerrado: el generador no usa sinónimos y el parser no los acepta como hechos. | DEBE / NO DEBE | generar-opl | R-§21-OPL-VOCAB |
| OPLC-14 | Tipografía semántica en el panel OPL: objeto en negrita, proceso en cursiva, estado en monoespaciado. | DEBE | renderizar | R-§21-OPL-TIPO |
| OPLC-15 | Como máximo un modificador de control (evento o condición) por enlace; combinarlos está prohibido. | NO DEBE (PROHIBIDA) | impedir | R-§21-OPL-MOD |
| OPLC-16 | Tokens con `ref` + sub-span por hecho, también en oraciones compuestas. Hover/clic resuelve el hecho del sub-span, no la primera ref de la línea. | DEBE | renderizar | R-§18-EXT-1, R-§19-COMP-2, R-§21-OPL-SPAN, A.3 |
| OPLC-17 | Si hay oraciones compuestas: `parsear(componer(F)) = F` como conjunto. El sujeto se coordina solo con plural concordado canónico. | DEBE | parsear-opl | R-§19-COMP-1, R-§18-EXT-1 |
| OPLC-18 | Familias de oración de la EBNF que se generan y parsean: tipo de dato, designaciones de esencia/afiliación/perseverancia (atómicas y combinadas), estados y designaciones de estado, consumo/resultado/efecto/cambio (TS3–TS5 y fan de salida con entrada común), agente/instrumento (con estado), eventos, invocación/autoinvocación, excepciones, condiciones, ruta, agregación, exhibición, especialización (incluida la XOR `puede ser` y la herencia múltiple), instanciación, etiquetados SE*, descomposición CX1/CX2/mixta. | DEBE (EBNF normativa) | generar-opl | §18 A.4–A.10 |
| OPLC-19 | Designación combinada preferida en la emisión: `X es un {objeto\|proceso} {físico\|informacional}[ y {sistémico\|ambiental}]`. Las formas atómicas se aceptan en reverse. | DEBERÍA | generar-opl | ext §2.0, l.222/379 |
| OPLC-20 | Prefijo de ruta `Por ruta L, <oración procedimental>`, expresión fija. | DEBE | generar-opl | §18 `oracion_de_ruta`, R-OPL-RUTA-1 |
| OPLC-21 | Invocación con demora `… invoca Q después de <demora>`; el parser acepta además `despues de`. | DEBE (grafía canónica) | parsear-opl | §20.1 §5.4, GAP-INVOCACION-TILDE |
| OPLC-22 | Excepción EX1/EX2 realizada con `<valor> <unidad>`; sin cota se usa el respaldo (`su duración máxima`). | DEBE | generar-opl | EBNF A.5 + nota §5.3 citada en §20.2 |
| OPLC-23 | Evento o condición sobre enlace de resultado o de invocación: la forma emitida degrada a la base. `puede generarse` no se emite. La UI no debería permitir crearlos. | DEBE (cerrado) / inferido (impedir) | generar-opl | §20.1 §5.1/§5.2/§7.6 |
| OPLC-24 | Fan probabilístico: emitir `Pr=p`. El parser lo trata como anotación y la probabilidad no se reconstruye (brecha de bisimetría a declarar). | DEBE (según §20) | generar-opl | §20.1 C-22 |
| OPLC-25 | Reverse de `se descompone en`: crea el refinamiento de forma idempotente con OPD hijo vacío, reconstruye el orden (`en esa secuencia`/`paralelo`) con verificación por inversa (si hay discrepancia: warning y sin patch). No crea los miembros (info); estos se agregan con gestos en el canvas. | DEBE (diseño declarado) | parsear-opl | §20.1 §7.1, GAP-CX-PARSER |
| OPLC-26 | `se pliega en` se reconoce en el parser con `unsupported-kernel` y no aplica plegado. | inferido | advertir | §20.1 §7.2, GAP-PLIEGA |
| OPLC-27 | Suprimir el OPL de las cosas placeholder (procesos y también objetos `Objeto`/`Objeto_N`; excepción: especie *apunte*). | DEBE (R-ENT-2 citada) | generar-opl | §20.1 §2.1, GAP-PLACEHOLDER-OBJETO |
| OPLC-28 | Construcciones canónicas no realizadas en v0 (GAP-VARIA, TIPO, XOR, REFINA, RECOMPONE, NOMBRE-INSTANCIA, TAG/SSE-PARSER, FAN-M, FAN-EVENTO, NEGADA-REVERSE, DESPLIEGUE-DEDICADO, DONDE-EXPRESION, RANGO-TEXTUAL, COMPOSICION): decidir implementar o excluir con diagnóstico explícito. | DEBE (resolver en auditoría) | parsear-opl | R-§20-AUD-1, R-§23-MIG-2 |
| OPLC-29 | Sufijo opcional de etiqueta de enlace `<oración>. [etiqueta: texto]`, extraído antes de cotejar. | PUEDE | parsear-opl | ext §6.5, R-EST-TAG-3 |
| OPLC-30 | Rasgo opcional `X tiene {un\|una} A opcional` (el reverse acepta el plural `opcionales`). | PUEDE (extensión de producto) | parsear-opl | ext §6.2 |
| OPLC-31 | Composición de modelos por interfaz compartida (emparejar por nombre normalizado + tipo; por id solo si el nombre coincide). | PUEDE | operación | R-§24-COMP-1 |
| OPLC-32 | Si se compone: designaciones de la entidad compartida una sola vez, enlaces consolidados, namespacing de ids de B conservando los nombres OPL, sin refs colgantes. | DEBE | generar-opl | R-§24-COMP-2 |
| OPLC-33 | Composición asociativa módulo ids y sin introducir OPL inválido. | DEBE / NO DEBE | operación | R-§24-COMP-3 |
| OPLC-34 | Composición no bloqueante y deshacible. El conflicto de recurso `lineal` se advierte y no se impide. | DEBE | advertir | R-§24-COMP-4 |
| OPLC-35 | Agente solo humano (o grupo de humanos). Un actor no humano va como instrumento. Advertir `maneja` desde un no humano o desde un proceso. | DEBE (R-HAB-AG-1 citada) / inferido (advertir) | advertir | Apéndice B.1, l.623 |
| OPLC-36 | El proceso de manejo de excepción es ambiental. | DEBE (R-EXC-AMBIENTAL-1 citada) | advertir | Apéndice B.4, l.857 |
| OPLC-37 | Verificación ejecutable mínima: tests de plantillas y vocabulario del generador, roundtrip bisimétrico y leyes safe-lens. | inferido (DEBE por §22) | parsear-opl | §22 |
| OPLC-38 | Precedencia al arbitrar: `reglas-opm-estrictas-es` > `spec-forja-opl-es`; ante conflicto interno manda la regla más específica o la cláusula declarada. | DEBE | no-herramienta | R-§23-MIG-1, R-§21-PRESC-CONS |
| OPLC-39 | No inventar reglas OPL fuera del canon. | NO DEBE | no-herramienta | R-§23-DEP-2 |
| OPLC-40 | Resultado tipado de la edición: éxito o diagnóstico (fail-fast), con razones clasificadas. | inferido | parsear-opl | §20.1 fila §18 |

---

## 12. Sobreingeniería o contenido circunstancial en el tramo (para una herramienta simple)

1. **Trazabilidad a deep-opm-pro v0 en todo §18–§24**: rutas y símbolos (`parsear.ts·ETIQUETA_SUFIX (línea 5)`, `procedural.ts·conEtiquetaEnlace (~273)`, `aplicar.ts`, `planificarEdicionOplLibre`, `aplicarPatchesOpl`, `exportarModelo`, `fixtures-roundtrip.ts`, flag `bisimetricaEstricta`, `leyes/opl-reverse.test.ts`, `componer.ts`, `sociotecnico.ts`). Son circunstanciales; el rehecho conserva la ley y descarta los nombres.
2. **§20 completo** (tabla maestra, índice de GAPs, cobertura inversa): es auditoría del código v0. Declara su propia obsolescencia ("Nota de vigencia 2026-06-12", backlog en `deep-opm-pro/docs/HANDOFF.md`). Solo sirve como lista de construcciones canónicas pendientes.
3. **§21.1 y §22 (gobernanza KORA/MD)**: invariantes del documento (tríada, `Rationale:`, columna `Enforcement`, lint de redacción), no de la herramienta.
4. **§23 Migración**: historia de consolidación documental ("major bump 1.0.0"), deprecación de `opm-opl-es`. Sin efecto en la herramienta.
5. **§24 Composición por interfaz**: toda la capacidad es `PUEDE`, con leyes categoriales (`law-composicion-*`), pushout/structured cospan y la designación `lineal` (Anexo C de reglas: *"NO es designación ISO 19450"*). Candidata clara a quedar fuera de una herramienta simple.
6. **Apéndice B**: patrones del runtime de simulación sociotécnica/agéntica (`ActorSim`, `AgenteSim`, `TipoEfectoSim` = ask-human/tool-call/http/python/mqtt/sql/ros/genai). No hay requisito OPL nuevo; es contexto de un producto previo.
7. **Extensiones de producto en la EBNF**: `(* ext §2.0 *)` "clasificación combinada eco-OPCloud" (herencia OPCloud), `(* ext §6.5 *)` sufijo `[etiqueta: …]`, `(* ext §6.2 *)` rasgo opcional. La combinada es la forma preferida y vale mantenerla; las otras dos son `PUEDE`.
8. **Producciones multi-modelo**: `oracion_de_composicion_intermodelo` (`es una vista de sub-modelo de`, `referencia el sub-modelo … desde`) y `oracion_de_referencia_externa` (`modelo propietario`). Son derivables, pero ninguna regla del tramo las exige.
9. **`identificador_de_tipo`** con tipos de lenguaje de programación (`unsigned/signed integer/float/double/short/long`) y **`oracion_de_estado_current`** (`declarado \`Current\``): superficie de bajo valor para un modelador simple.
10. **Despliegue con etiquetas de OPD** (`X desde SD1 se despliega por partes en SD1.1 en …`) y descomposición en "nuevo diagrama": el propio canon dice que la emisión real reusa el verbo fundamental (GAP-DESPLIEGUE-DEDICADO). Doble superficie innecesaria.
11. **`restriccion_de_expresion` (`donde …`) e intervalos de rango `[..]`/`(..)`**: nunca se implementaron (GAP-DONDE-EXPRESION, GAP-RANGO-TEXTUAL). Candidatos a exclusión explícita.
12. **Verificación por inversa del orden in-zoom y AST de bandas**: mecánica de implementación, no ley.
13. **Probabilidad `Pr=p`** en fans, que el parser descarta: superficie forward-only.

---

## 13. GAPs y contradicciones internas detectadas

**A. La EBNF declara cobertura total pero no la tiene.** §18 dice *"Cubre todas las familias canonizadas en §1–§12"*, pero faltan producciones para plantillas canónicas del mismo documento:
- abanicos de consumo/resultado/efecto/agente/instrumento/invocación (`requiere exactamente uno de A o B`, `invoca exactamente uno de Q o R`, l.897, R-FAN-*);
- fan unilateral de estado `cambia X a exactamente uno de s1, s2 o s3` y `cambia X de exactamente uno de …` (R-FAN-5, l.1505);
- fan bajo evento `B inicia exactamente uno de P, Q o R, y es afectado por el proceso que ocurre` (R-FAN-4);
- `Pr=p`;
- `después de <demora>` (IV1/IV2 con demora, l.894–896);
- variante negada;
- `Atributo de Objeto es valor` (l.324);
- `Estado s de X es inicial y final` (D10, l.303);
- `se refina por …` (CX4);
- plural `invocan`;
- inversos `es requerido por` / `es manejado por`;
- `m de f`.

Varios ejemplos de los Apéndices A y B usan estas formas. Consecuencia: la EBNF no alcanza como gramática completa del parser, y el rehecho tiene que ampliarla o declarar el subconjunto.

**B. Producciones inalcanzables o sin uso.** `oracion_de_ruta` no figura en `oracion_procedimental` ni en `oracion_formal_opl_es`. `oracion_con_etiqueta_de_enlace` no es alcanzable desde `parrafo_opl_es`. `conector_serial` no se usa. `oracion_de_especializacion_xor_objeto` y `oracion_de_herencia_multiple_objeto` están definidas en A.7 y solo son alcanzables vía `oracion_de_especializacion` en A.9 (válido, pero disperso).

**C. Defectos de precedencia EBNF** (la concatenación `,` liga más que `|`):
- `nombre_singular_de_objeto = palabra_capitalizada, { " ", palabra_capitalizada | palabra_no_capitalizada }` deja la palabra en minúscula sin el espacio previo;
- `tipo_numerico = [prefijo], "integer" | "float" | …` aplica el prefijo solo a `integer`;
- `oracion_de_caract_objeto` tiene alternativas ambiguas (atributos y operadores son léxicamente idénticos).

**D. Espacios y puntuación rotos.** `oracion_de_herencia_multiple_objeto = objeto_especial, " es ", lista_de_objetos_generales` con `lista_de_objetos_generales = " un ", …, [ { " un ", … } ], " y un ", …` produce `X es  un A un B y un C`: doble espacio y sin comas.

**E. Literal `unidades-tiempo` en la EBNF frente a su realización.** La EBNF fija `" unidades-tiempo"`. §5.3 (l.884) y §20.2 (GAP-EXC-UNIDADES-LITERAL "cerrado por ajuste-spec") dicen que es una metavariable realizada como `<valor> <unidad>`. La EBNF no se ajustó; B.4 (`excede 30 minutos`) no es derivable.

**F. Listas.** `lista_de_*` deja opcional el conector final (admite `A, B, C`) y no incluye `e`/`u`, lo que contradice R-§18-LISTA-1 y R-VERB-KW-1/2. A.2 usa `… e **Inventario**`. `lista_de_secuencia_mixta` admite `", y "`/`", e "` (coma de Oxford), contra el "SIN coma de Oxford" de R-§18-LISTA-1, aunque §7.1 lo justifica en la plantilla mixta.

**G. Concordancia de esencia.** La EBNF solo tiene formas femeninas (`física`, `sistémica`) en la oración atómica y masculinas (`físico`, `sistémico`) solo en la combinada con `un objeto/proceso`. Los apéndices usan `**Inventario** es físico.`, `**Repartidor** es físico.` y `**Supervisor** es físico.`, que no son derivables.

**H. Orden de complementos en la descomposición.** §7.1 (l.1225) fija el orden `[, así como objetos] [, en esa secuencia]`. La EBNF fija `, en esa secuencia` antes de `[, así como …]`. Son contradictorios.

**I. Descomposición de objeto con marca temporal obligatoria.** `oracion_de_descomposicion_objeto_*` exige `, en esa secuencia`, pero R-CX-DESP-2 (l.1260) prohíbe la marca temporal en el despliegue, R-CX-SYNC-1 atribuye el orden temporal a la descomposición de *proceso*, y B.2 omite la marca (no derivable).

**J. Agregación de una sola parte.** `lista_de_partes_*` exige al menos dos partes. R-EST-TAG-3 (`**Todo** consta de **Parte**.`) y B.2 (`**Actor** consta de **Agente**.`) usan una sola parte.

**K. Condición con estado sobre efecto.** La EBNF no tiene `P ocurre si X está en s, en cuyo caso P afecta X, …`; A.2 la usa.

**L. Duplicación de hechos en el Apéndice A.** Aparecen a la vez la oración base y la oración con modificador o multiplicidad para el mismo par y tipo de enlace (consumo/evento de Embalaje, efecto/condición de Inventario, `genera Guía`/`genera al menos una Guía`). Choca con "una oración, un hecho" (A.2) y con R-§21-OPL-MOD.

**M. Errores de modelado en el Apéndice B.**
- `*Aprobar* maneja *Preguntar Humano*`: un proceso como agente, contra R-HAB-AG-1 y contra `oracion_de_agente`.
- Objeto informacional llamado **Agente**, contra la reserva del término en R-HAB-AG-1.
- Condición sobre Política con cambio sobre Decisión (B.3), cuando `autónomo` es un estado de Agente.
- Evento de Supervisor que afecta a Decisión (B.5): el disparador no coincide con el afectado, y el agente debería ir con `inicia y maneja`.

**N. Apéndice A.4 incompleto.** La nota dice que el resultado Guía migra al último subproceso, pero no hay oración que lo realice. El efecto sobre Inventario no se distribuye.

**O. Estatus de despliegue: display o parseable.** R-§19-DISP-1 clasifica "plegado/despliegue de §12" como solo-display y sin reverse. §20.1 §7.2 dice que el despliegue CX3 se parsea con las regex estructurales y reconstruye el refinamiento `despliegue`. Hay que fijar la frontera.

**P. Bisimetría no declarada en §19.5.** `Pr=p` se descarta en reverse (§20.1 C-22) y la variante negada es solo emisión (GAP-NEGADA-REVERSE). Ninguna figura en la tabla §19.5 de roturas de bisimetría, lo que contradice R-§19-ROT-1 ("DEBE declararlo explícitamente").

**Q. Forward total frente a GAPs.** R-§19-SIM-1 afirma que el forward es total "sobre el kernel cubierto". Sin embargo, §20 lista construcciones canónicas sin generador (VARIA, TIPO, XOR, REFINA, PLIEGA, RECOMPONE, NOMBRE-INSTANCIA, FAN-M…). La totalidad es relativa a un kernel que nunca se define.

**R. Tipografía dentro y fuera de la EBNF.** La EBNF modela texto plano, pero `oracion_de_estado_current` incluye backticks literales (`` `Current` ``), mientras los estados normales no los llevan. Todos los ejemplos usan Markdown (`**`, `*`, backticks) como codificación del tipo (R-§21-OPL-TIPO). No está definido si el parser recibe texto con o sin marcadores. Objetos y procesos son léxicamente idénticos en la EBNF (`nombre_singular_de_objeto` ≡ `nombre_singular_de_proceso`), así que el parser necesita resolver contra el modelo o apoyarse en la tipografía.

**S. Composición de oraciones.**
- `oracion_compuesta_sujeto_coordinado` usa `lista_de_objetos` como sujeto de `consumen/generan/afectan/requieren`, cuando el sujeto debería ser un proceso.
- Con `manejan`, el complemento es `objeto_con_opcion_de_estado`, cuando debería ser un proceso.
- `oracion_compuesta_destino_enumerado` duplica exactamente `oracion_de_caract_objeto` y `oracion_de_agregacion_objeto` (ambigüedad de derivación).
- `predicado_procedimental` con `afecta lista_de_objetos` choca con `conector_final` (doble rol de `y`).

**T. Versionado y dependencias obsoletas.** §23 se autodenomina "major bump 1.0.0" y §24 "minor bump 1.1.0", pero el documento es v1.4.1. Las marcas `(* ext §n *)` se definen por diferencia con el "Apéndice A de `opm-opl-es`", una fuente excluida del canon por el usuario y que el frontmatter lista en `depende`. La frase "esta spec es autocontenida" se cumple solo en parte.

**U. GAP-PLACEHOLDER-OBJETO.** §20 lo mantiene abierto, pero el frontmatter (delta v1.3.0, R-ENT-2-APUNTE) lo neutraliza para la especie *apunte*. §20 no se actualizó con esa excepción.
