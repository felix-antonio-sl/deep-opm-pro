export interface SessionMessagePort {
  mensaje: string | null;
  limpiarMensaje: () => void;
}
