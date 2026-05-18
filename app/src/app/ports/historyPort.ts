export interface HistoryPort {
  deshacer: () => void;
  rehacer: () => void;
  puedeDeshacer: boolean;
  puedeRehacer: boolean;
}
