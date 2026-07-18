/**
 * Mapa de títulos humanos para reglas de diagnóstico (UI-facing).
 *
 * Ronda23 L2 #2: el panel y los badges hoy muestran el slug interno
 * (`agregacion-misma-esencia`, `PROCESO_NOMBRE_FORMA_VERBAL`, ...). Eso es
 * vocabulario de implementación. El usuario debe ver un título humano que
 * describa el problema con sujeto + verbo + complemento.
 *
 * Contrato: `id` / `codigo` / `reglaId` NO cambian (son contrato de tests,
 * serialización y testids). Solo agregamos un campo de presentación
 * (`titulo`) derivado de aquí.
 *
 * Convención de redacción:
 *   - Castellano natural, con tildes RAE.
 *   - Patrón: sujeto + verbo + complemento.
 *   - Sin guiones ni snake_case.
 *   - Capitalizado en la primera palabra.
 *   - Corto: idealmente < 60 caracteres.
 *
 * Fallback `tituloDeRegla(reglaId)`: si el slug no está mapeado, se
 * normaliza (kebab/snake → espacios, primera mayúscula). Garantiza que
 * cualquier regla nueva tenga un título legible aunque el autor olvide
 * registrarla.
 */

/**
 * Mapa reglaId -> título humano. Las claves cubren tres familias:
 *   - validaciones estructurales (`validaciones.ts`, kebab-case).
 *   - checkers metodológicos (`checkers.ts`, SNAKE_UPPER).
 *   - diagnóstico visual (`diagnosticoVisual.ts`, `visual-*`).
 */
const TITULO_POR_REGLA: Record<string, string> = {
  // ── validaciones estructurales (validaciones.ts) ──────────────────
  "agregacion-misma-esencia": "Agregación mezcla esencia",
  "generalizacion-mismo-tipo": "Generalización entre tipos distintos",
  "estructural-no-acepta-extremo-estado": "Enlace estructural apunta a un estado",
  "excepcion-temporal-proceso-proceso": "Excepción temporal mal conectada",
  "procedural-no-objeto-objeto": "Enlace procedural entre objetos",
  "estructural-sin-duplicar": "Enlace estructural duplicado",
  "orden-estructural-huerfano": "Orden estructural sin enlace vigente",
  "subproceso-no-conecta-al-padre": "Subproceso interno enlazado al padre",
  "agente-requiere-objeto-fisico": "Agente no es objeto físico",
  "proceso-sin-entrada-ni-salida": "Proceso sin entradas ni salidas",
  "instrumento-y-agente-simultaneos": "Mismo objeto es agente e instrumento",
  "solo-un-nivel-de-instanciacion": "Cadena de instanciación de más de un nivel",
  "consumo-doble-mismo-objeto": "El mismo objeto se consume dos veces",
  "imagen-estados-excluyentes": "Imagen interior y estados visibles a la vez",
  "ambiental-dentro-contorno": "Cosa ambiental fuera del contorno",

  // ── checkers metodológicos (checkers.ts) ──────────────────────────
  SD_SIN_PROCESO_PRINCIPAL: "SD sin proceso principal",
  PROCESO_NOMBRE_FORMA_VERBAL: "Nombre de proceso no es canónico",
  ESTADO_NOMBRE_CANONICO: "Estado tiene nombre no canónico",
  OBJETO_NOMBRE_SINGULAR: "Nombre de objeto no está en singular",
  OBJETO_AMBIENTAL_SIN_CONTORNO_DISCONTINUO: "Objeto ambiental contradice su rol",
  INZOOM_CONTENIDO_INSUFICIENTE: "Descomposición con muy poco contenido",
  INZOOM_NOMBRES_PLACEHOLDER_HIJOS: "Refinadores esperan nombre",
  UNFOLD_CONTENIDO_INSUFICIENTE: "Despliegue con muy poco contenido",
  PROCESO_NO_TRANSFORMA: "Proceso no transforma ningún objeto",
  PROCESO_SISTEMICO_DESCONECTADO: "Proceso sistémico desconectado del principal",
  DESCOMPOSICION_SIN_SUBPROCESOS: "Descomposición sin subprocesos",

  // ── diagnóstico visual (diagnosticoVisual.ts) ─────────────────────
  "visual-apariencia-entidad-inexistente": "Apariencia sin entidad lógica",
  "visual-apariencia-opd-inconsistente": "Apariencia declara OPD equivocado",
  "visual-geometria-apariencia-invalida": "Geometría de apariencia no renderizable",
  "visual-puerto-coordenadas-invalidas": "Puerto fuera del rango 0..1",
  "visual-contexto-refinamiento-huerfano": "Contexto de refinamiento huérfano",
  "visual-parte-extraida-huerfana": "Parte extraída sin padre ni parte",
  "visual-enlace-opd-inconsistente": "Apariencia de enlace en OPD equivocado",
  "visual-enlace-extremo-logico-inexistente": "Extremo de enlace sin entidad lógica",
  "visual-simbolo-estructural-invalido": "Símbolo estructural con posición no finita",
  "visual-label-enlace-invalida": "Etiqueta de enlace con posición no finita",
  "visual-solape-apariencias": "Apariencias se solapan visualmente",
  "visual-enlace-modelo-inexistente": "Apariencia de enlace sin enlace lógico",
  "visual-enlace-extremo-no-visible": "Enlace con extremo no visible en el OPD",
  "visual-externo-dentro-contorno": "Cosa externa dentro del contorno",
  "visual-transformador-contorno-no-distribuido": "Transformador no se proyecta al subproceso",
  "visual-subproceso-sin-transformado": "Subproceso interno no transforma nada",
  "visual-vertices-enlace-invalidos": "Vértices de enlace no finitos",
  "visual-puerto-enlace-inexistente": "Enlace referencia puerto ausente",
  "visual-puerto-enlace-interior": "Enlace ancla en puerto interior",
};

/**
 * Devuelve el título humano para un reglaId. Si la regla no está mapeada,
 * usa un fallback de normalización (kebab/snake → espacios, primera letra
 * mayúscula). Esto garantiza que reglas nuevas tengan un título legible
 * incluso si el autor olvidó registrarlas en {@link TITULO_POR_REGLA}.
 */
export function tituloDeRegla(reglaId: string): string {
  const directo = TITULO_POR_REGLA[reglaId];
  if (directo) return directo;
  return normalizarSlug(reglaId);
}

function normalizarSlug(slug: string): string {
  const limpio = slug.replaceAll("_", " ").replaceAll("-", " ").trim();
  if (limpio.length === 0) return slug;
  return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase();
}
