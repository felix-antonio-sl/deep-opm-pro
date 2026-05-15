import type { Entidad, Id } from "../modelo/tipos";

export type SuperficieAccionContextual = "barra-flotante" | "menu-contextual" | "command-palette";

export type AccionContextualId =
  | "copiar-estilo"
  | "pegar-estilo"
  | "agregar-estado"
  | "inzoom"
  | "unfold"
  | "editar-alias"
  | "editar-imagen"
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
}

export interface ContextoAccionesEntidad {
  entidad: Entidad | null;
  enlaceEstiloId: Id | null;
  hayEstiloEnPortapapeles: boolean;
  inspectorAbierto: boolean;
  multi: boolean;
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
  const tieneEnlaceOperable = !!ctx.enlaceEstiloId;

  return [
    accion("copiar-estilo", "Copiar estilo", "barra-copiar-estilo", "apariencia", tieneEnlaceOperable, {
      texto: "Copiar",
      visible: tieneEnlaceOperable,
      superficies: ["barra-flotante", "menu-contextual", "command-palette"],
      atajo: "Ctrl+Alt+C",
    }),
    accion("pegar-estilo", "Pegar estilo", "barra-pegar-estilo", "apariencia", tieneEnlaceOperable && ctx.hayEstiloEnPortapapeles, {
      texto: "Pegar",
      visible: tieneEnlaceOperable,
      superficies: ["barra-flotante", "menu-contextual", "command-palette"],
      atajo: "Ctrl+Alt+V",
    }),
    accion("agregar-estado", "Agregar estado", "barra-agregar-estado", "edicion", !!esObjeto, {
      visible: !!esObjeto,
      superficies: ["barra-flotante", "menu-contextual", "command-palette"],
    }),
    accion("inzoom", "Inzoom (descomposición)", "barra-inzoom", "refinamiento", esCosa, {
      superficies: ["barra-flotante", "menu-contextual", "command-palette"],
      atajo: "Shift+I",
    }),
    accion("unfold", "Unfold (despliegue)", "barra-unfold", "refinamiento", esCosa, {
      superficies: ["barra-flotante", "menu-contextual", "command-palette"],
      atajo: "Shift+U",
    }),
    accion("editar-alias", "Editar alias", "barra-editar-alias", "edicion", !!esObjeto, {
      visible: esCosa,
      superficies: ["barra-flotante", "menu-contextual", "command-palette"],
    }),
    accion("editar-imagen", "Editar imagen", "barra-editar-imagen", "apariencia", !!esObjeto, {
      texto: "Img",
      visible: !!esObjeto,
      superficies: ["barra-flotante", "menu-contextual", "command-palette"],
    }),
    accion("mas-opciones", ctx.inspectorAbierto ? "Cerrar Inspector lateral" : "Abrir Inspector lateral", "barra-mas-opciones", "navegacion", esCosa, {
      texto: "···",
      superficies: ["barra-flotante"],
    }),
    accion("traer-conectados", "Traer conectados...", "accion-traer-conectados", "enlaces", esCosa, {
      superficies: ["menu-contextual", "command-palette"],
      atajo: "Ctrl+Shift+T",
    }),
    accion("traer-conectados-default", "Traer conectados", "accion-traer-conectados-default", "enlaces", esCosa, {
      superficies: ["menu-contextual", "command-palette"],
    }),
    accion("traer-enlaces", "Traer enlaces entre seleccionadas", "accion-traer-enlaces", "enlaces", ctx.multi, {
      visible: ctx.multi,
      superficies: ["menu-contextual", "command-palette"],
    }),
    accion("ocultar-apariencia", "Ocultar de este OPD", "accion-ocultar-apariencia", "peligro", esCosa, {
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
  };
}
