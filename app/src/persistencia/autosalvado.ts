export interface AutosalvadoEstado {
  activo: boolean;
  ultimo: number | null;
  salvando: boolean;
}

export interface AutosalvadoControl {
  iniciar(intervaloMs?: number): void;
  detener(): void;
  estado: () => AutosalvadoEstado;
  onEstado: (cb: (estado: AutosalvadoEstado) => void) => () => void;
}

/**
 * Crea un control de autosalvado periódico.
 *
 * Idempotente: si está salvando, ignora ticks; si no está dirty, no hace nada.
 * Intervalo por defecto: 5 minutos (300000 ms).
 *
 * Anclaje: HU-30.035 (brief L4 §6, autosalvado.ts).
 */
export function crearAutosalvado(opts: {
  esDirty: () => boolean;
  ejecutarSalvado: () => Promise<boolean | void>;
  intervaloMs?: number;
}): AutosalvadoControl {
  const INTERVALO = opts.intervaloMs ?? 5 * 60 * 1000; // 5 min default
  let timer: ReturnType<typeof setInterval> | null = null;
  let salvando = false;
  let ultimo: number | null = null;
  let ciclo = 0;
  const listeners = new Set<(estado: AutosalvadoEstado) => void>();

  const notificar = () => {
    const estado: AutosalvadoEstado = { activo: timer !== null, ultimo, salvando };
    for (const cb of listeners) cb(estado);
  };

  const tick = async () => {
    if (salvando) return;        // idempotente: ignora si ya está salvando
    if (!opts.esDirty()) return; // no dirty, no acción

    salvando = true;
    const cicloDelTick = ciclo;
    notificar();

    try {
      const completed = await opts.ejecutarSalvado();
      if (completed !== false && cicloDelTick === ciclo) ultimo = Date.now();
    } finally {
      salvando = false;
      notificar();
    }
  };

  return {
    iniciar(intervaloMs) {
      if (timer !== null) return; // ya iniciado
      ciclo += 1;
      timer = setInterval(tick, intervaloMs ?? INTERVALO);
      notificar();
    },

    detener() {
      if (timer === null) return;
      clearInterval(timer);
      timer = null;
      ciclo += 1;
      salvando = false;
      notificar();
    },

    estado() {
      return { activo: timer !== null, ultimo, salvando };
    },

    onEstado(cb) {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
  };
}
