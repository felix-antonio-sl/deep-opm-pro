import type { Enlace, Entidad, Id } from "../modelo/tipos";

export type SuperficieAccionContextual = "barra-flotante" | "menu-contextual" | "command-palette";

export type AccionContextualId =
  | "cambiar-tipo-enlace"
  | "copiar-estilo"
  | "pegar-estilo"
  | "agregar-estado"
  | "inzoom"
  | "unfold"
  | "quitar-descomposicion"
  | "quitar-despliegue"
  | "editar-alias"
  | "editar-imagen"
  | "eliminar-seleccion"
  | "agregar-como-partes"
  | "alinear-seleccion"
  | "distribuir-seleccion"
  | "mas-opciones"
  | "traer-conectados"
  | "traer-conectados-default"
  | "traer-enlaces"
  | "ocultar-apariencia";

export interface AccionContextual {
  id: AccionContextualId;
  label: string;
  testId: string;
  categoria: "refinamiento" | "edicion" | "apariencia" | "enlaces" | "navegacion" | "peligro";
  visible: boolean;
  enabled: boolean;
  superficies: readonly SuperficieAccionContextual[];
  texto?: string;
  atajo?: string;
  destructiva?: boolean;
  /**
   * Ronda23 L1 #10: términos extra para la búsqueda del command palette.
   * Permite mantener match por nomenclatura OPM en inglés ("inzoom"/"unfold")
   * cuando el label visible se traduce a castellano ("Descomponer"/"Desplegar").
   */
  aliasBusqueda?: readonly string[];
}

export type ActionEventKind = "normal" | "exceptional";

export interface ActionEvent {
  actionId: AccionContextualId;
  kind: ActionEventKind;
  reason?: string;
}

export interface ContextoAccionesEntidad {
  entidad: Entidad | null;
  enlace?: Enlace | null;
  enlaceEstiloId: Id | null;
  hayEstiloEnPortapapeles: boolean;
  inspectorAbierto: boolean;
  multi: boolean;
  seleccionadosCount?: number;
}

/**
 * Catalogo unico de acciones contextuales para una cosa/apariencia.
 *
 * IFML §7.3/§7.4/§7.10: BarraHerramientasElemento, MenuContextualEntidad y
 * CommandPalette deben ser renderings de la misma estructura de acciones. Este
 * modulo es deliberadamente puro: decide disponibilidad/visibilidad, no ejecuta
 * handlers ni toca el store.
 */
export function accionesContextualesEntidad(ctx: ContextoAccionesEntidad): AccionContextual[] {
  const esObjeto = ctx.entidad?.tipo === "objeto";
  const esCosa = !!ctx.entidad;
  const esEnlace = !!ctx.enlace;
  const esMulti = ctx.multi || (ctx.seleccionadosCount ?? 0) >= 2;
  const tieneEnlaceOperable = !!ctx.enlace || !!ctx.enlaceEstiloId;
  const tieneDescomposicion = !!ctx.entidad?.refinamientos?.descomposicion;
  const tieneDespliegue = !!ctx.entidad?.refinamientos?.despliegue;
  const superficiesEstiloEnlace: readonly SuperficieAccionContextual[] = esEnlace
    ? ["barra-flotante", "menu-contextual", "command-palette"]
    : ["menu-contextual", "command-palette"];

  return [
    accion("cambiar-tipo-enlace", "Editar propiedades del enlace", "barra-cambiar-tipo-enlace", "enlaces", esEnlace, {
      texto: "Propiedades",
      visible: esEnlace,
      superficies: ["barra-flotante", "command-palette"],
    }),
    accion("copiar-estilo", "Copiar formato", "barra-copiar-estilo", "apariencia", tieneEnlaceOperable, {
      texto: "Copiar",
      visible: tieneEnlaceOperable,
      superficies: superficiesEstiloEnlace,
      atajo: "Ctrl+Alt+C",
    }),
    accion("pegar-estilo", "Pegar formato", "barra-pegar-estilo", "apariencia", tieneEnlaceOperable && ctx.hayEstiloEnPortapapeles, {
      texto: "Pegar",
      visible: tieneEnlaceOperable && ctx.hayEstiloEnPortapapeles,
      superficies: superficiesEstiloEnlace,
      atajo: "Ctrl+Alt+V",
    }),
    accion("agregar-estado", "Agregar estado", "barra-agregar-estado", "edicion", !!esObjeto, {
      visible: !!esObjeto,
      superficies: ["barra-flotante", "menu-contextual", "command-palette"],
    }),
    // Ronda23 L1 #10: castellano canónico ("Descomponer"/"Desplegar"). El
    // identificador interno y los test-ids siguen siendo `inzoom`/`unfold`
    // para no romper el contrato con barras, palette y handlers existentes.
    // Los aliasBusqueda mantienen el match por terminología OPM en inglés
    // (in-zoom/inzoom/unfold/despliegue) en el command palette.
    accion("inzoom", "Descomponer", "barra-inzoom", "refinamiento", esCosa, {
      visible: esCosa,
      superficies: ["barra-flotante", "menu-contextual", "command-palette"],
      atajo: "Shift+I",
      aliasBusqueda: ["inzoom", "in-zoom", "descomposicion"],
    }),
    accion("unfold", "Desplegar", "barra-unfold", "refinamiento", esCosa, {
      visible: esCosa,
      superficies: ["barra-flotante", "menu-contextual", "command-palette"],
      atajo: "Shift+U",
      aliasBusqueda: ["unfold", "despliegue"],
    }),
    accion("quitar-descomposicion", "Quitar inzoom", "accion-quitar-descomposicion", "refinamiento", tieneDescomposicion, {
      visible: tieneDescomposicion,
      superficies: ["menu-contextual", "command-palette"],
      destructiva: true,
    }),
    accion("quitar-despliegue", "Quitar despliegue", "accion-quitar-despliegue", "refinamiento", tieneDespliegue, {
      visible: tieneDespliegue,
      superficies: ["menu-contextual", "command-palette"],
      destructiva: true,
    }),
    accion("editar-alias", "Editar alias", "barra-editar-alias", "edicion", esCosa, {
      visible: esCosa,
      superficies: ["barra-flotante", "menu-contextual", "command-palette"],
    }),
    accion("editar-imagen", "Editar imagen", "barra-editar-imagen", "apariencia", !!esObjeto, {
      texto: "Img",
      visible: !!esObjeto,
      superficies: ["barra-flotante", "menu-contextual", "command-palette"],
    }),
    accion("eliminar-seleccion", "Eliminar selección", "barra-eliminar-seleccion", "peligro", esMulti, {
      texto: "Eliminar",
      visible: esMulti,
      superficies: ["barra-flotante", "command-palette"],
      destructiva: true,
      atajo: "Delete",
    }),
    accion("agregar-como-partes", "Agregar como partes", "barra-agregar-como-partes", "enlaces", esMulti, {
      texto: "Partes",
      visible: esMulti,
      superficies: ["barra-flotante", "command-palette"],
      atajo: "Ctrl+Alt+T",
    }),
    accion("alinear-seleccion", "Alinear selección", "barra-alinear-seleccion", "apariencia", esMulti, {
      texto: "Alinear ▾",
      visible: esMulti,
      superficies: ["barra-flotante", "command-palette"],
    }),
    accion("distribuir-seleccion", "Distribuir selección", "barra-distribuir-seleccion", "apariencia", esMulti, {
      texto: "Distribuir ▾",
      visible: esMulti,
      superficies: ["barra-flotante", "command-palette"],
    }),
    // Ronda23 L1 #12: el audit reportaba el botón cerrado del inspector con
    // glifo "···" (significa "más opciones", no "cerrar"). El render actual
    // ya usa el texto descriptivo "Inspector" con `aria-label` específico
    // ("Cerrar Inspector lateral" / "Abrir Inspector lateral"), así que no
    // hay glifo ambiguo que reemplazar. Se conserva el texto "Inspector".
    accion("mas-opciones", ctx.inspectorAbierto ? "Cerrar Inspector lateral" : "Abrir Inspector lateral", "barra-mas-opciones", "navegacion", esCosa || esEnlace || esMulti, {
      texto: "Inspector",
      superficies: ["barra-flotante"],
    }),
    accion("traer-conectados", "Traer conectados...", "accion-traer-conectados", "enlaces", esCosa, {
      visible: esCosa,
      superficies: ["menu-contextual", "command-palette"],
      atajo: "Ctrl+Shift+T",
    }),
    accion("traer-conectados-default", "Traer conectados", "accion-traer-conectados-default", "enlaces", esCosa, {
      visible: esCosa,
      superficies: ["menu-contextual", "command-palette"],
    }),
    accion("traer-enlaces", "Traer enlaces entre seleccionadas", "accion-traer-enlaces", "enlaces", ctx.multi, {
      visible: ctx.multi,
      superficies: ["barra-flotante", "menu-contextual", "command-palette"],
    }),
    accion("ocultar-apariencia", "Ocultar de este OPD", "accion-ocultar-apariencia", "peligro", esCosa, {
      visible: esCosa,
      superficies: ["menu-contextual", "command-palette"],
      destructiva: true,
      atajo: "Ctrl+H",
    }),
  ];
}

export function accionesParaSuperficie(
  acciones: readonly AccionContextual[],
  superficie: SuperficieAccionContextual,
): AccionContextual[] {
  return acciones.filter((accion) => accion.visible && accion.superficies.includes(superficie));
}

function accion(
  id: AccionContextualId,
  label: string,
  testId: string,
  categoria: AccionContextual["categoria"],
  enabled: boolean,
  extra: Partial<Omit<AccionContextual, "id" | "label" | "testId" | "categoria" | "enabled">> = {},
): AccionContextual {
  return {
    id,
    label,
    testId,
    categoria,
    enabled,
    visible: extra.visible ?? true,
    superficies: extra.superficies ?? ["command-palette"],
    ...(extra.texto ? { texto: extra.texto } : {}),
    ...(extra.atajo ? { atajo: extra.atajo } : {}),
    ...(extra.destructiva ? { destructiva: true } : {}),
    ...(extra.aliasBusqueda ? { aliasBusqueda: extra.aliasBusqueda } : {}),
  };
}
