// AsistenteNuevoModelo.tsx — modal del wizard de 12 etapas para nuevo modelo.
//
// SSOT: metodologia-opm-es.md §6.
// Contratos: consumir store.asistente, invocar acciones del store.
// UX: overlay bloqueante, navegacion adelante/atras, cancelar con confirmacion.
import { useRef, useState } from "preact/hooks";
import {
  ETAPA_AMBIENTALES,
  ETAPA_ATRIBUTO,
  ETAPA_BENEFICIARIO,
  ETAPA_BIENVENIDA,
  ETAPA_CONFIRMAR,
  ETAPA_ENTRADAS,
  ETAPA_FUNCION,
  ETAPA_HANDLER,
  ETAPA_HERRAMIENTAS,
  ETAPA_NOMBRE_SISTEMA,
  ETAPA_SALIDAS,
  TOTAL_ETAPAS,
  VERBOS_SALIDA,
  VERBO_SALIDA_ES,
  type DatosAsistente,
  type EtapaAsistente,
  type VerboSalida,
} from "../modelo/creacionWizard";
import { store, useOpmStore } from "../store";

// ─── Layout ──────────────────────────────────────────────────────────

const S = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } satisfies preact.JSX.CSSProperties,
  modal: {
    width: "620px",
    maxHeight: "85vh",
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 20px 60px rgba(16, 24, 40, 0.22)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  } satisfies preact.JSX.CSSProperties,
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 22px 8px",
    borderBottom: "1px solid #e4eaf1",
  },
  progressBar: {
    flex: 1,
    height: "6px",
    borderRadius: "3px",
    background: "#e4eaf1",
    overflow: "hidden",
  },
  progressFill: (pct: number) => ({
    width: `${pct}%`,
    height: "100%",
    borderRadius: "3px",
    background: "#3BC3FF",
    transition: "width 0.3s ease",
  }) satisfies preact.JSX.CSSProperties,
  etapaLabel: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#334155",
    whiteSpace: "nowrap",
  },
  body: {
    flex: 1,
    padding: "18px 22px",
    overflowY: "auto" as const,
    fontSize: "14px",
    color: "#1f2937",
    lineHeight: "1.6",
    minHeight: "180px",
  },
  title: {
    fontSize: "17px",
    fontWeight: 700,
    color: "#1a3763",
    marginBottom: "14px",
  },
  desc: {
    marginBottom: "14px",
    color: "#334155",
  },
  input: {
    width: "100%",
    maxWidth: "420px",
    padding: "8px 12px",
    border: "1px solid #c8d2df",
    borderRadius: "5px",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
    color: "#1f2937",
    background: "#fafbfc",
  } satisfies preact.JSX.CSSProperties,
  textarea: {
    width: "100%",
    maxWidth: "420px",
    minHeight: "64px",
    padding: "8px 12px",
    border: "1px solid #c8d2df",
    borderRadius: "5px",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
    color: "#1f2937",
    background: "#fafbfc",
    resize: "vertical" as const,
  } satisfies preact.JSX.CSSProperties,
  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },
  checkboxLabel: {
    fontSize: "14px",
    color: "#1f2937",
  },
  select: {
    padding: "6px 10px",
    border: "1px solid #c8d2df",
    borderRadius: "5px",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
    background: "#fafbfc",
  } satisfies preact.JSX.CSSProperties,
  footer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 22px 14px",
    borderTop: "1px solid #e4eaf1",
  },
  btnGroup: {
    display: "flex",
    gap: "8px",
  },
  btn: (primary: boolean): preact.JSX.CSSProperties => ({
    padding: "8px 18px",
    borderRadius: "5px",
    border: primary ? "1px solid #147aa5" : "1px solid #c8d2df",
    background: primary ? "#3BC3FF" : "#f9fbfd",
    color: primary ? "#0b2f3f" : "#1f2937",
    fontFamily: "Arial, sans-serif",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  }),
  skipBtn: {
    padding: "8px 18px",
    borderRadius: "5px",
    border: "1px dashed #c8d2df",
    background: "transparent",
    color: "#667085",
    fontFamily: "Arial, sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  mensaje: {
    fontSize: "13px",
    color: "#b91c1c",
    marginTop: "8px",
  },
  resumenLinea: {
    display: "flex",
    gap: "8px",
    marginBottom: "6px",
  },
  resumenLabel: {
    fontWeight: 700,
    color: "#334155",
    minWidth: "150px",
  },
  resumenValor: {
    color: "#1f2937",
  },
  itemTag: {
    display: "inline-block",
    padding: "2px 10px",
    margin: "2px 4px 2px 0",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 700,
    background: "#e4f0fd",
    color: "#147aa5",
  },
};

// ─── Etapas ──────────────────────────────────────────────────────────

function Bienvenida() {
  return (
    <div>
      <h3 style={S.title}>Bienvenida</h3>
      <p style={S.desc}>
        Este asistente te guiara paso a paso para crear un nuevo modelo OPM.
        Comenzaremos identificando el proceso principal del sistema y
        continuaremos con el beneficiario, atributos, agentes y mas.
      </p>
      <p style={S.desc}>
        Al finalizar, tu modelo quedara sembrado en el lienzo con un layout
        radial automatico y el panel OPL pre-poblado. Podras continuar
        modelando de inmediato.
      </p>
      <p style={{ ...S.desc, color: "#667085", fontSize: "13px" }}>
        Las etapas marcadas como opcionales se pueden saltar. Al confirmar
        podras revisar todo antes de crear el modelo.
      </p>
    </div>
  );
}

function EtapaFuncionPrincipal({ valor, onChange }: { valor: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h3 style={S.title}>Etapa 2 de {TOTAL_ETAPAS} — Funcion Principal</h3>
      <p style={S.desc}>
        ¿Cual es la funcion principal del sistema? Es el proceso central
        que entrega valor al beneficiario. Debe terminar en "ing" o su
        equivalente en espanol (ando/iendo).
      </p>
      <input
        style={S.input}
        placeholder="Ej: Conducir, Procesar Pedidos"
        value={valor}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => { if (e.key === "Enter") siguiente(); }}
        autoFocus
      />
    </div>
  );
}

function EtapaBeneficiario({ valor, onChange }: { valor: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h3 style={S.title}>Etapa 3 de {TOTAL_ETAPAS} — Beneficiario</h3>
      <p style={S.desc}>
        ¿Quien es el beneficiario principal del sistema? Es la persona o grupo
        que recibe el valor generado por la funcion principal.
      </p>
      <input
        style={S.input}
        placeholder="Ej: Conductor, Cliente"
        value={valor}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => { if (e.key === "Enter") siguiente(); }}
        autoFocus
      />
    </div>
  );
}

function EtapaAtributo(
  { valor, onChange }: {
    valor: { nombre: string; estadoEntrada: string; estadoSalida: string } | null;
    onChange: (v: { nombre: string; estadoEntrada: string; estadoSalida: string } | null) => void;
  },
) {
  const a = valor ?? { nombre: "", estadoEntrada: "", estadoSalida: "" };
  const set = (patch: Partial<typeof a>) => onChange({ ...a, ...patch });
  return (
    <div>
      <h3 style={S.title}>Etapa 4 de {TOTAL_ETAPAS} — Atributo Relevante <span style={{ fontWeight: 400, color: "#667085" }}>(opcional)</span></h3>
      <p style={S.desc}>
        Si el beneficiario tiene un atributo que cambia con el proceso,
        indicalo aqui junto con su estado de entrada y salida.
      </p>
      <input
        style={{ ...S.input, marginBottom: "8px" }}
        placeholder="Atributo relevante (ej: Satisfaccion)"
        value={a.nombre}
        onInput={(e) => set({ nombre: (e.target as HTMLInputElement).value })}
      />
      <input
        style={{ ...S.input, marginBottom: "8px" }}
        placeholder="Estado de entrada (ej: insatisfecho)"
        value={a.estadoEntrada}
        onInput={(e) => set({ estadoEntrada: (e.target as HTMLInputElement).value })}
      />
      <input
        style={S.input}
        placeholder="Estado de salida (ej: satisfecho)"
        value={a.estadoSalida}
        onInput={(e) => set({ estadoSalida: (e.target as HTMLInputElement).value })}
      />
    </div>
  );
}

function EtapaHandler(
  { esHandler, agentes, onEsHandler, onAgentes }: {
    esHandler: boolean;
    agentes: string[];
    onEsHandler: (v: boolean) => void;
    onAgentes: (v: string[]) => void;
  },
) {
  const [nuevo, setNuevo] = useState("");
  const agregar = () => {
    const t = nuevo.trim();
    if (t.length === 0) return;
    if (agentes.some((a) => a.toLowerCase() === t.toLowerCase())) return;
    onAgentes([...agentes, t]);
    setNuevo("");
  };
  return (
    <div>
      <h3 style={S.title}>Etapa 5 de {TOTAL_ETAPAS} — Handler del Sistema</h3>
      <p style={S.desc}>
        El handler es el agente humano que opera el sistema. Puede ser el
        mismo beneficiario u otra persona.
      </p>
      <label style={S.checkbox}>
        <input
          type="checkbox"
          checked={esHandler}
          onChange={(e) => onEsHandler((e.target as HTMLInputElement).checked)}
        />
        <span style={S.checkboxLabel}>El beneficiario es tambien el handler del sistema</span>
      </label>
      {!esHandler && (
        <div style={{ marginTop: "10px" }}>
          <p style={S.desc}>Agentes adicionales (presiona Enter para agregar):</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
            {agentes.map((a, i) => (
              <span key={i} style={S.itemTag}>
                {a}
                <button
                  type="button"
                  onClick={() => onAgentes(agentes.filter((_, j) => j !== i))}
                  style={{ marginLeft: "6px", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              style={S.input}
              placeholder="Nombre del agente"
              value={nuevo}
              onInput={(e) => setNuevo((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); agregar(); } }}
            />
            <button type="button" style={S.btn(false)} onClick={agregar}>Agregar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function EtapaNombreSistema({ valor, onChange }: { valor: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h3 style={S.title}>Etapa 6 de {TOTAL_ETAPAS} — Nombre del Sistema</h3>
      <p style={S.desc}>
        ¿Como se llama el sistema? Por defecto se usa el nombre del proceso
        principal seguido de "System", pero puedes personalizarlo.
      </p>
      <input
        style={S.input}
        placeholder="Ej: Sistema de Conduccion"
        value={valor}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => { if (e.key === "Enter") siguiente(); }}
        autoFocus
      />
    </div>
  );
}

function EtapaHerramientas(
  { valor, onChange }: { valor: string[]; onChange: (v: string[]) => void },
) {
  const [nuevo, setNuevo] = useState("");
  const agregar = () => {
    const t = nuevo.trim();
    if (t.length === 0) return;
    if (valor.some((a) => a.toLowerCase() === t.toLowerCase())) return;
    onChange([...valor, t]);
    setNuevo("");
  };
  return (
    <div>
      <h3 style={S.title}>Etapa 7 de {TOTAL_ETAPAS} — Herramientas <span style={{ fontWeight: 400, color: "#667085" }}>(opcional)</span></h3>
      <p style={S.desc}>
        ¿Que instrumentos o herramientas usa el sistema? Son objetos que el
        proceso necesita para operar, pero no consume.
      </p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
        {valor.map((h, i) => (
          <span key={i} style={S.itemTag}>
            {h}
            <button
              type="button"
              onClick={() => onChange(valor.filter((_, j) => j !== i))}
              style={{ marginLeft: "6px", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        <input
          style={S.input}
          placeholder="Nombre de la herramienta"
          value={nuevo}
          onInput={(e) => setNuevo((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); agregar(); } }}
        />
        <button type="button" style={S.btn(false)} onClick={agregar}>Agregar</button>
      </div>
    </div>
  );
}

function EtapaEntradas(
  { valor, onChange }: { valor: string[]; onChange: (v: string[]) => void },
) {
  const [nuevo, setNuevo] = useState("");
  const agregar = () => {
    const t = nuevo.trim();
    if (t.length === 0) return;
    if (valor.some((a) => a.toLowerCase() === t.toLowerCase())) return;
    onChange([...valor, t]);
    setNuevo("");
  };
  return (
    <div>
      <h3 style={S.title}>Etapa 8 de {TOTAL_ETAPAS} — Entradas <span style={{ fontWeight: 400, color: "#667085" }}>(opcional)</span></h3>
      <p style={S.desc}>
        ¿Que objetos consume o transforma el proceso? Son las entradas
        del sistema.
      </p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
        {valor.map((e, i) => (
          <span key={i} style={S.itemTag}>
            {e}
            <button
              type="button"
              onClick={() => onChange(valor.filter((_, j) => j !== i))}
              style={{ marginLeft: "6px", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        <input
          style={S.input}
          placeholder="Nombre de la entrada"
          value={nuevo}
          onInput={(e) => setNuevo((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); agregar(); } }}
        />
        <button type="button" style={S.btn(false)} onClick={agregar}>Agregar</button>
      </div>
    </div>
  );
}

interface ItemSalida {
  nombre: string;
  verbo: VerboSalida;
}

function EtapaSalidas(
  { valor, onChange }: { valor: ItemSalida[]; onChange: (v: ItemSalida[]) => void },
) {
  const [nombre, setNombre] = useState("");
  const [verbo, setVerbo] = useState<VerboSalida>("creates");
  const agregar = () => {
    const t = nombre.trim();
    if (t.length === 0) return;
    if (valor.some((s) => s.nombre.toLowerCase() === t.toLowerCase())) return;
    onChange([...valor, { nombre: t, verbo }]);
    setNombre("");
    setVerbo("creates");
  };
  return (
    <div>
      <h3 style={S.title}>Etapa 9 de {TOTAL_ETAPAS} — Salidas <span style={{ fontWeight: 400, color: "#667085" }}>(opcional)</span></h3>
      <p style={S.desc}>
        ¿Que objetos produce el proceso? Pueden ser creados, afectados o
        cambiados por el proceso.
      </p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
        {valor.map((s, i) => (
          <span key={i} style={S.itemTag}>
            {s.nombre} ({VERBO_SALIDA_ES[s.verbo]})
            <button
              type="button"
              onClick={() => onChange(valor.filter((_, j) => j !== i))}
              style={{ marginLeft: "6px", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <input
          style={S.input}
          placeholder="Nombre de la salida"
          value={nombre}
          onInput={(e) => setNombre((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); agregar(); } }}
        />
        <select
          style={S.select}
          value={verbo}
          onChange={(e) => setVerbo((e.target as HTMLSelectElement).value as VerboSalida)}
        >
          {VERBOS_SALIDA.map((v) => (
            <option key={v} value={v}>{VERBO_SALIDA_ES[v]}</option>
          ))}
        </select>
        <button type="button" style={S.btn(false)} onClick={agregar}>Agregar</button>
      </div>
    </div>
  );
}

function EtapaAmbientales(
  { cosas, seleccionados, onToggle }: {
    cosas: string[];
    seleccionados: string[];
    onToggle: (v: string[]) => void;
  },
) {
  if (cosas.length === 0) {
    return (
      <div>
        <h3 style={S.title}>Etapa 10 de {TOTAL_ETAPAS} — Objetos Ambientales <span style={{ fontWeight: 400, color: "#667085" }}>(opcional)</span></h3>
        <p style={S.desc}>
          No hay objetos creados todavia. Puedes marcar objetos como
          ambientales mas tarde desde el inspector.
        </p>
      </div>
    );
  }
  return (
    <div>
      <h3 style={S.title}>Etapa 10 de {TOTAL_ETAPAS} — Objetos Ambientales <span style={{ fontWeight: 400, color: "#667085" }}>(opcional)</span></h3>
      <p style={S.desc}>
        Marca los objetos que son externos al sistema (ambientales).
      </p>
      {cosas.map((c) => (
        <label key={c} style={S.checkbox}>
          <input
            type="checkbox"
            checked={seleccionados.includes(c)}
            onChange={() => {
              if (seleccionados.includes(c)) {
                onToggle(seleccionados.filter((s) => s !== c));
              } else {
                onToggle([...seleccionados, c]);
              }
            }}
          />
          <span style={S.checkboxLabel}>{c}</span>
        </label>
      ))}
    </div>
  );
}

function EtapaConfirmar({ datos }: { datos: Partial<DatosAsistente> }) {
  return (
    <div>
      <h3 style={S.title}>Etapa 11 de {TOTAL_ETAPAS} — Confirmar y Crear Modelo</h3>
      <p style={S.desc}>
        Revisa los datos ingresados antes de sembrar el modelo. Al confirmar
        se creara el SD con layout radial y podras continuar modelando.
      </p>
      <div style={{ background: "#f9fbfd", borderRadius: "6px", padding: "12px 16px", marginBottom: "12px" }}>
        <div style={S.resumenLinea}>
          <span style={S.resumenLabel}>Funcion principal:</span>
          <span style={S.resumenValor}>{datos.funcionPrincipal || <em style={{ color: "#b91c1c" }}>(pendiente)</em>}</span>
        </div>
        <div style={S.resumenLinea}>
          <span style={S.resumenLabel}>Beneficiario:</span>
          <span style={S.resumenValor}>{datos.beneficiario || <em style={{ color: "#b91c1c" }}>(pendiente)</em>}</span>
        </div>
        {datos.atributo?.nombre && (
          <div style={S.resumenLinea}>
            <span style={S.resumenLabel}>Atributo:</span>
            <span style={S.resumenValor}>{datos.atributo.nombre} [{datos.atributo.estadoEntrada} → {datos.atributo.estadoSalida}]</span>
          </div>
        )}
        <div style={S.resumenLinea}>
          <span style={S.resumenLabel}>Handler:</span>
          <span style={S.resumenValor}>{datos.beneficiarioEsHandler ? "Beneficiario es handler" : (datos.agentesAdicionales ?? []).join(", ") || "(pendiente)"}</span>
        </div>
        <div style={S.resumenLinea}>
          <span style={S.resumenLabel}>Nombre del sistema:</span>
          <span style={S.resumenValor}>{datos.nombreSistema || <em style={{ color: "#b91c1c" }}>(pendiente)</em>}</span>
        </div>
        {(datos.herramientas?.length ?? 0) > 0 && (
          <div style={S.resumenLinea}>
            <span style={S.resumenLabel}>Herramientas:</span>
            <span style={S.resumenValor}>{datos.herramientas!.join(", ")}</span>
          </div>
        )}
        {(datos.entradas?.length ?? 0) > 0 && (
          <div style={S.resumenLinea}>
            <span style={S.resumenLabel}>Entradas:</span>
            <span style={S.resumenValor}>{datos.entradas!.join(", ")}</span>
          </div>
        )}
        {(datos.salidas?.length ?? 0) > 0 && (
          <div style={S.resumenLinea}>
            <span style={S.resumenLabel}>Salidas:</span>
            <span style={S.resumenValor}>{datos.salidas!.map((s) => `${s.nombre} (${VERBO_SALIDA_ES[s.verbo]})`).join(", ")}</span>
          </div>
        )}
        {(datos.ambientales?.length ?? 0) > 0 && (
          <div style={S.resumenLinea}>
            <span style={S.resumenLabel}>Ambientales:</span>
            <span style={S.resumenValor}>{datos.ambientales!.join(", ")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────

let _siguienteGlobal: (() => void) | null = null;
function siguiente() {
  _siguienteGlobal?.();
}

export function AsistenteNuevoModelo() {
  const asistente = useOpmStore((s) => s.asistente);
  const mensaje = useOpmStore((s) => s.mensaje);

  if (!asistente) return null;

  const etapa = asistente.etapaActual;
  const datos = asistente.datos;
  const cancelado = asistente.cancelado;

  const pct = ((etapa + 1) / TOTAL_ETAPAS) * 100;

  const setDatos = (parcial: Partial<DatosAsistente>) => {
    store.getState().siguienteEtapa(parcial);
  };
  _siguienteGlobal = () => {
    // No avanza automaticamente; el boton Siguiente maneja la logica
  };

  const handleSiguiente = () => {
    const state = store.getState();
    if (!state.asistente) return;

    const et = state.asistente.etapaActual;

    // Si es etapa opcional, permitir saltar sin validar
    const esOpcional = [ETAPA_ATRIBUTO, ETAPA_HANDLER, ETAPA_HERRAMIENTAS, ETAPA_ENTRADAS, ETAPA_SALIDAS, ETAPA_AMBIENTALES].includes(et);

    if (esOpcional) {
      // Avanzar directamente
      const sig = Math.min(et + 1, 11) as EtapaAsistente;
      store.setState((s) => {
        if (!s.asistente) return {};
        return { asistente: { ...s.asistente, etapaActual: sig } };
      });
      return;
    }

    // Etapa obligatoria: validacion mediante siguienteEtapa del store
    store.getState().siguienteEtapa({});
  };

  const handleSaltar = () => {
    const state = store.getState();
    if (!state.asistente) return;
    const sig = Math.min(state.asistente.etapaActual + 1, 11) as EtapaAsistente;
    store.setState((s) => {
      if (!s.asistente) return {};
      return { asistente: { ...s.asistente, etapaActual: sig } };
    });
  };

  const handleAnterior = () => {
    store.getState().etapaAnterior();
  };

  const handleCancelar = () => {
    store.getState().cancelarAsistente();
  };

  const handleConfirmar = () => {
    store.getState().confirmarAsistente();
  };

  const handleDescartarConfirmado = () => {
    store.setState({ asistente: null });
  };

  const handleCancelarConfirmacion = () => {
    const state = store.getState();
    if (!state.asistente) return;
    store.setState({ asistente: { ...state.asistente, cancelado: false } });
  };

  const esOpcional = [ETAPA_ATRIBUTO, ETAPA_HANDLER, ETAPA_HERRAMIENTAS, ETAPA_ENTRADAS, ETAPA_SALIDAS, ETAPA_AMBIENTALES].includes(etapa);

  // Keys: ESC = cancelar
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancelar();
    }
  };

  // Lista de cosas para ambientales (todas las creadas como nombres)
  const cosasParaAmbientales = ((): string[] => {
    const nombres: string[] = [];
    if (datos.funcionPrincipal?.trim()) nombres.push(datos.funcionPrincipal.trim());
    if (datos.beneficiario?.trim()) nombres.push(datos.beneficiario.trim());
    if (datos.atributo?.nombre.trim()) nombres.push(datos.atributo.nombre.trim());
    if (datos.nombreSistema?.trim()) nombres.push(datos.nombreSistema.trim());
    for (const a of datos.agentesAdicionales ?? []) { if (a.trim()) nombres.push(a.trim()); }
    for (const h of datos.herramientas ?? []) { if (h.trim()) nombres.push(h.trim()); }
    for (const e of datos.entradas ?? []) { if (e.trim()) nombres.push(e.trim()); }
    for (const s of datos.salidas ?? []) { if (s.nombre.trim()) nombres.push(s.nombre.trim()); }
    return nombres;
  })()
    .filter((n) => n !== datos.funcionPrincipal?.trim()) // excluir proceso central
    .sort((a, b) => a.localeCompare(b, "es"));

  return (
    <div
      style={S.backdrop}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      ref={(el: HTMLElement | null) => el?.focus()}
    >
      <div style={S.modal} role="dialog" aria-modal="true" aria-label="Asistente nuevo modelo">
        {/* Header con barra de progreso */}
        <div style={S.header}>
          <span style={S.etapaLabel}>Etapa {etapa + 1} de {TOTAL_ETAPAS}</span>
          <div style={S.progressBar}>
            <div style={S.progressFill(pct)} />
          </div>
        </div>

        {/* Cuerpo */}
        <div style={S.body}>
          {cancelado ? (
            <div>
              <h3 style={S.title}>¿Descartar el asistente?</h3>
              <p style={S.desc}>Perderas los datos ingresados hasta ahora.</p>
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <button type="button" style={S.btn(true)} onClick={handleDescartarConfirmado}>
                  Si, descartar
                </button>
                <button type="button" style={S.btn(false)} onClick={handleCancelarConfirmacion}>
                  No, continuar
                </button>
              </div>
            </div>
          ) : (
            <>
              {etapa === ETAPA_BIENVENIDA && <Bienvenida />}

              {etapa === ETAPA_FUNCION && (
                <EtapaFuncionPrincipal
                  valor={datos.funcionPrincipal ?? ""}
                  onChange={(v) => store.setState((s) => {
                    if (!s.asistente) return {};
                    return { asistente: { ...s.asistente, datos: { ...s.asistente.datos, funcionPrincipal: v } } };
                  })}
                />
              )}

              {etapa === ETAPA_BENEFICIARIO && (
                <EtapaBeneficiario
                  valor={datos.beneficiario ?? ""}
                  onChange={(v) => store.setState((s) => {
                    if (!s.asistente) return {};
                    return { asistente: { ...s.asistente, datos: { ...s.asistente.datos, beneficiario: v } } };
                  })}
                />
              )}

              {etapa === ETAPA_ATRIBUTO && (
                <EtapaAtributo
                  valor={datos.atributo ?? null}
                  onChange={(v) => store.setState((s) => {
                    if (!s.asistente) return {};
                    return { asistente: { ...s.asistente, datos: { ...s.asistente.datos, atributo: v } } };
                  })}
                />
              )}

              {etapa === ETAPA_HANDLER && (
                <EtapaHandler
                  esHandler={datos.beneficiarioEsHandler ?? true}
                  agentes={datos.agentesAdicionales ?? []}
                  onEsHandler={(v) => store.setState((s) => {
                    if (!s.asistente) return {};
                    return { asistente: { ...s.asistente, datos: { ...s.asistente.datos, beneficiarioEsHandler: v } } };
                  })}
                  onAgentes={(v) => store.setState((s) => {
                    if (!s.asistente) return {};
                    return { asistente: { ...s.asistente, datos: { ...s.asistente.datos, agentesAdicionales: v } } };
                  })}
                />
              )}

              {etapa === ETAPA_NOMBRE_SISTEMA && (
                <EtapaNombreSistema
                  valor={datos.nombreSistema ?? ""}
                  onChange={(v) => store.setState((s) => {
                    if (!s.asistente) return {};
                    return { asistente: { ...s.asistente, datos: { ...s.asistente.datos, nombreSistema: v } } };
                  })}
                />
              )}

              {etapa === ETAPA_HERRAMIENTAS && (
                <EtapaHerramientas
                  valor={datos.herramientas ?? []}
                  onChange={(v) => store.setState((s) => {
                    if (!s.asistente) return {};
                    return { asistente: { ...s.asistente, datos: { ...s.asistente.datos, herramientas: v } } };
                  })}
                />
              )}

              {etapa === ETAPA_ENTRADAS && (
                <EtapaEntradas
                  valor={datos.entradas ?? []}
                  onChange={(v) => store.setState((s) => {
                    if (!s.asistente) return {};
                    return { asistente: { ...s.asistente, datos: { ...s.asistente.datos, entradas: v } } };
                  })}
                />
              )}

              {etapa === ETAPA_SALIDAS && (
                <EtapaSalidas
                  valor={datos.salidas ?? []}
                  onChange={(v) => store.setState((s) => {
                    if (!s.asistente) return {};
                    return { asistente: { ...s.asistente, datos: { ...s.asistente.datos, salidas: v } } };
                  })}
                />
              )}

              {etapa === ETAPA_AMBIENTALES && (
                <EtapaAmbientales
                  cosas={cosasParaAmbientales}
                  seleccionados={datos.ambientales ?? []}
                  onToggle={(v) => store.setState((s) => {
                    if (!s.asistente) return {};
                    return { asistente: { ...s.asistente, datos: { ...s.asistente.datos, ambientales: v } } };
                  })}
                />
              )}

              {etapa === ETAPA_CONFIRMAR && (
                <EtapaConfirmar datos={datos} />
              )}

              {mensaje && <div style={S.mensaje}>{mensaje}</div>}
            </>
          )}
        </div>

        {/* Footer con botones */}
        {!cancelado && (
          <div style={S.footer}>
            <div>
              {etapa > ETAPA_BIENVENIDA && etapa < ETAPA_CONFIRMAR && (
                <button type="button" style={S.btn(false)} onClick={handleAnterior}>
                  Anterior
                </button>
              )}
            </div>
            <div style={S.btnGroup}>
              {etapa < ETAPA_CONFIRMAR && (
                <button type="button" style={S.btn(false)} onClick={handleCancelar}>
                  Cancelar
                </button>
              )}
              {etapa < ETAPA_CONFIRMAR && esOpcional && (
                <button type="button" style={S.skipBtn} onClick={handleSaltar}>
                  Saltar
                </button>
              )}
              {etapa < ETAPA_CONFIRMAR && (
                <button type="button" style={S.btn(true)} onClick={handleSiguiente}>
                  Siguiente
                </button>
              )}
              {etapa === ETAPA_CONFIRMAR && (
                <>
                  <button type="button" style={S.btn(false)} onClick={handleAnterior}>
                    Anterior
                  </button>
                  <button type="button" style={S.btn(true)} onClick={handleConfirmar}>
                    Confirmar y crear modelo
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
