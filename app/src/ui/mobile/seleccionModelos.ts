import type { Modelo } from "../../modelo/tipos";

// Helpers puros del selector de modelos del shell mobile-readonly (auth v1
// cerró la capa de identidad; esto cierra el hueco de selección que
// MobileReadonlyApp delegaba a "la futura capa de tenants/auth").

/** true ⇔ el modelo es el SD vacío de sesión (sin ninguna cosa). */
export function modeloSinContenido(modelo: Modelo): boolean {
  return Object.keys(modelo.entidades).length === 0;
}

export interface ContextoAutoAbrir {
  modeloVacio: boolean;
  /** El usuario ya tocó la navegación: no quitarle el control. */
  yaInteractuo: boolean;
}

/** Auto-switch inicial a Modelos: evita un canvas vacío y respeta la navegación explícita. */
export function debeAutoAbrirModelos(contexto: ContextoAutoAbrir): boolean {
  return contexto.modeloVacio && !contexto.yaInteractuo;
}
