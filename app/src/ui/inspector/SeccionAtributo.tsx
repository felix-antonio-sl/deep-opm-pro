// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import editAliasIcon from "../../../../assets/svg/editAlias.svg";
import editUnitsIcon from "../../../../assets/svg/editUnits.svg";
import { parametrosSimulacionPorDefecto } from "../../modelo/simulacion/parametros";
import type {
  ConfiguracionSimulacionNumerica,
  ConfiguracionSimulacionTextual,
  DistribucionSimulacion,
  Entidad,
  FilaTextualSimulacion,
  ParametrosSimulacionEntidad,
  TipoValorSlot,
  ValorConcreto,
} from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";

/**
 * Inspector de atributo con slot de valor.
 *
 * SSOT: [Glos 3.4] atributo, [V-161] unidad en rótulo, [V-163] slot de valor,
 * [OPL-ES §14] "Atributo es valor [Unidad].", [JOYAS §3] tipografía canvas.
 * Assets canónicos: assets/svg/editAlias.svg, assets/svg/editUnits.svg.
 */

interface Props {
  entidad: Entidad;
  derivado: boolean;
  onUnidad: (value: string) => void;
  onTipo: (tipo: TipoValorSlot) => void;
  onValor: (value: ValorConcreto) => void;
  onSimulacion: (parametros: ParametrosSimulacionEntidad | undefined) => void;
}

const TIPOS: Array<{ value: TipoValorSlot; label: string }> = [
  { value: "integer", label: "Entero" },
  { value: "float", label: "Decimal" },
  { value: "char", label: "Carácter" },
  { value: "string", label: "Texto" },
];

const DISTRIBUCIONES: Array<{ value: DistribucionSimulacion; label: string }> = [
  { value: "uniform", label: "Uniforme" },
  { value: "normal", label: "Normal" },
  { value: "bernoulli", label: "Bernoulli" },
  { value: "geometric", label: "Geométrica" },
  { value: "poisson", label: "Poisson" },
  { value: "exponential", label: "Exponencial" },
  { value: "binomial", label: "Binomial" },
];

export function SeccionAtributo({ entidad, derivado, onUnidad, onTipo, onValor, onSimulacion }: Props) {
  const slot = entidad.valorSlot;
  const simActiva = entidad.simulacion?.simulable === true;
  const config = entidad.simulacion?.configuracion ?? parametrosSimulacionPorDefecto(entidad).configuracion;
  const modo = config?.modo ?? "textual";
  const puedeNumerica = slot?.tipo === "integer" || slot?.tipo === "float";
  const numericConfig: ConfiguracionSimulacionNumerica = config?.modo === "numerica"
    ? config
    : parametrosSimulacionPorDefecto({ ...entidad, valorSlot: slot ? { ...slot, tipo: slot.tipo === "integer" ? "integer" : "float" } : { tipo: "float", placeholder: "value" } }).configuracion as ConfiguracionSimulacionNumerica;
  const textualConfig: ConfiguracionSimulacionTextual = config?.modo === "textual"
    ? config
    : parametrosSimulacionPorDefecto({ ...entidad, valorSlot: slot ? { ...slot, tipo: slot.tipo === "char" ? "char" : "string" } : { tipo: "string", placeholder: "value" } }).configuracion as ConfiguracionSimulacionTextual;
  const setConfig = (siguiente: ConfiguracionSimulacionNumerica | ConfiguracionSimulacionTextual) => {
    onSimulacion({ simulable: true, configuracion: siguiente });
  };
  const setNumero = (campo: keyof ConfiguracionSimulacionNumerica, value: string) => {
    setConfig({ ...numericConfig, [campo]: numeroOpcional(value) });
  };
  return (
    <section style={styles.section} data-testid="inspector-seccion-atributo">
      <div style={styles.header}>
        <span class="opm-label-uppercase" style={style.label}>Atributo</span>
        <span style={styles.badge}>{slot ? "numérico" : derivado ? "objeto" : "texto"}</span>
      </div>
      <label style={style.field}>
        <span style={styles.labelIcon}>
          <img src={editUnitsIcon} alt="" style={styles.icon} />
          Unidad
        </span>
        <input
          style={style.input}
          value={entidad.unidad ?? ""}
          placeholder="[unidad]"
          onInput={(event) => onUnidad(event.currentTarget.value)}
          data-testid="atributo-unidad-input"
        />
      </label>
      <label style={style.field}>
        <span style={styles.labelIcon}>
          <img src={editAliasIcon} alt="" style={styles.icon} />
          Tipo de valor
        </span>
        <select
          style={styles.select}
          value={slot?.tipo ?? "string"}
          onChange={(event) => onTipo(event.currentTarget.value as TipoValorSlot)}
          data-testid="atributo-tipo-select"
        >
          {TIPOS.map((tipo) => <option key={tipo.value} value={tipo.value}>{tipo.label}</option>)}
        </select>
      </label>
      <label style={style.field}>
        <span class="opm-label-uppercase" style={style.label}>Valor</span>
        <input
          style={style.input}
          value={slot?.valor ?? ""}
          placeholder={slot?.placeholder ?? "value"}
          onChange={(event) => onValor(event.currentTarget.value)}
          data-testid="atributo-valor-input"
        />
      </label>
      <div style={styles.simBlock} data-testid="atributo-simulacion">
        <label style={styles.checkRow}>
          <input
            type="checkbox"
            checked={simActiva}
            onChange={(event) => {
              onSimulacion(event.currentTarget.checked ? parametrosSimulacionPorDefecto(entidad) : undefined);
            }}
            data-testid="atributo-simulacion-toggle"
          />
          Simulación
        </label>
        {simActiva ? (
          <>
            <div style={styles.modeRow}>
              <button
                type="button"
                style={modo === "numerica" ? styles.modeButtonActive : styles.modeButton}
                disabled={!puedeNumerica}
                onClick={() => setConfig(numericConfig)}
                data-testid="atributo-simulacion-modo-numerica"
              >
                Numérica
              </button>
              <button
                type="button"
                style={modo === "textual" ? styles.modeButtonActive : styles.modeButton}
                onClick={() => setConfig(textualConfig)}
                data-testid="atributo-simulacion-modo-textual"
              >
                Textual
              </button>
            </div>
            {modo === "numerica" && puedeNumerica ? (
              <div style={styles.paramGrid}>
                <label style={styles.compactField}>
                  <span class="opm-label-uppercase" style={style.label}>Distribución</span>
                  <select
                    style={styles.select}
                    value={numericConfig.distribucion}
                    onChange={(event) => setConfig(configConDistribucion(numericConfig, event.currentTarget.value as DistribucionSimulacion))}
                    data-testid="atributo-simulacion-distribucion"
                  >
                    {DISTRIBUCIONES.map((dist) => <option key={dist.value} value={dist.value}>{dist.label}</option>)}
                  </select>
                </label>
                <label style={styles.checkRowSmall}>
                  <input
                    type="checkbox"
                    checked={numericConfig.entero ?? slot?.tipo === "integer"}
                    onChange={(event) => setConfig({ ...numericConfig, entero: event.currentTarget.checked })}
                    data-testid="atributo-simulacion-entero"
                  />
                  Entero
                </label>
                <NumeroInput label="Rango min" value={numericConfig.rangoMin} onInput={(value) => setNumero("rangoMin", value)} testid="atributo-simulacion-rango-min" />
                <NumeroInput label="Rango max" value={numericConfig.rangoMax} onInput={(value) => setNumero("rangoMax", value)} testid="atributo-simulacion-rango-max" />
                {numericConfig.distribucion === "uniform" ? (
                  <>
                    <NumeroInput label="Min" value={numericConfig.uniformMin} onInput={(value) => setNumero("uniformMin", value)} testid="atributo-simulacion-uniform-min" />
                    <NumeroInput label="Max" value={numericConfig.uniformMax} onInput={(value) => setNumero("uniformMax", value)} testid="atributo-simulacion-uniform-max" />
                  </>
                ) : null}
                {numericConfig.distribucion === "normal" ? (
                  <>
                    <NumeroInput label="Mu" value={numericConfig.normalMu} onInput={(value) => setNumero("normalMu", value)} testid="atributo-simulacion-normal-mu" />
                    <NumeroInput label="Sigma" value={numericConfig.normalSigma} onInput={(value) => setNumero("normalSigma", value)} testid="atributo-simulacion-normal-sigma" />
                  </>
                ) : null}
                {(numericConfig.distribucion === "bernoulli" || numericConfig.distribucion === "geometric") ? (
                  <NumeroInput label="P" value={numericConfig.probabilidad} onInput={(value) => setNumero("probabilidad", value)} testid="atributo-simulacion-probabilidad" />
                ) : null}
                {numericConfig.distribucion === "binomial" ? (
                  <>
                    <NumeroInput label="n" value={numericConfig.binomialN} onInput={(value) => setNumero("binomialN", value)} testid="atributo-simulacion-binomial-n" />
                    <NumeroInput label="P" value={numericConfig.binomialP} onInput={(value) => setNumero("binomialP", value)} testid="atributo-simulacion-binomial-p" />
                  </>
                ) : null}
                {(numericConfig.distribucion === "poisson" || numericConfig.distribucion === "exponential") ? (
                  <NumeroInput label="Lambda" value={numericConfig.lambda} onInput={(value) => setNumero("lambda", value)} testid="atributo-simulacion-lambda" />
                ) : null}
              </div>
            ) : null}
            {modo === "textual" ? (
              <label style={style.field}>
                <span class="opm-label-uppercase" style={style.label}>Valores ponderados</span>
                <textarea
                  style={styles.textarea}
                  value={textoTextual(textualConfig.valores)}
                  onInput={(event) => setConfig({ modo: "textual", valores: filasTextualesDesdeTexto(event.currentTarget.value) })}
                  data-testid="atributo-simulacion-textual"
                />
              </label>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}

function NumeroInput({ label, value, onInput, testid }: { label: string; value: number | undefined; onInput: (value: string) => void; testid: string }) {
  return (
    <label style={styles.compactField}>
      <span class="opm-label-uppercase" style={style.label}>{label}</span>
      <input
        type="number"
        style={style.input}
        value={value ?? ""}
        onInput={(event) => onInput(event.currentTarget.value)}
        data-testid={testid}
      />
    </label>
  );
}

function numeroOpcional(value: string): number | undefined {
  const limpio = value.trim();
  if (!limpio) return undefined;
  const numero = Number(limpio);
  return Number.isFinite(numero) ? numero : undefined;
}

function textoTextual(valores: readonly FilaTextualSimulacion[]): string {
  return valores.map((item) => `${item.texto}: ${item.porcentaje}`).join("\n");
}

function filasTextualesDesdeTexto(texto: string): FilaTextualSimulacion[] {
  const lineas = texto.split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter(Boolean)
    .map((linea) => {
      const match = /^(?<texto>.*?)(?::\s*(?<porcentaje>-?\d+(?:\.\d+)?))?$/.exec(linea);
      const etiqueta = (match?.groups?.texto ?? linea).trim();
      const porcentajeRaw = match?.groups?.porcentaje;
      const porcentaje = porcentajeRaw === undefined ? undefined : Number(porcentajeRaw);
      return { texto: etiqueta, porcentaje: Number.isFinite(porcentaje) ? porcentaje : undefined };
    })
    .filter((item) => item.texto.length > 0);
  if (lineas.length === 0) return [{ texto: "valor", porcentaje: 100 }];
  const sumaFija = lineas.reduce((sum, item) => sum + (item.porcentaje ?? 0), 0);
  const sinPeso = lineas.filter((item) => item.porcentaje === undefined).length;
  const pesoRelleno = sinPeso > 0 ? Math.max(0, (100 - sumaFija) / sinPeso) : 0;
  return lineas.map((item) => ({ texto: item.texto, porcentaje: item.porcentaje ?? pesoRelleno }));
}

function configConDistribucion(
  base: ConfiguracionSimulacionNumerica,
  distribucion: DistribucionSimulacion,
): ConfiguracionSimulacionNumerica {
  const siguiente: ConfiguracionSimulacionNumerica = { ...base, distribucion };
  if (distribucion === "uniform") {
    return { ...siguiente, uniformMin: siguiente.uniformMin ?? 0, uniformMax: siguiente.uniformMax ?? 1 };
  }
  if (distribucion === "normal") {
    return { ...siguiente, normalMu: siguiente.normalMu ?? 0, normalSigma: siguiente.normalSigma ?? 1 };
  }
  if (distribucion === "bernoulli" || distribucion === "geometric") {
    return { ...siguiente, probabilidad: siguiente.probabilidad ?? 0.5 };
  }
  if (distribucion === "binomial") {
    return { ...siguiente, binomialN: siguiente.binomialN ?? 1, binomialP: siguiente.binomialP ?? 0.5 };
  }
  return { ...siguiente, lambda: siguiente.lambda ?? 1 };
}

const styles = {
  section: {
    display: "grid",
    gap: "8px",
    marginBottom: "14px",
    padding: "10px",
    border: `1px solid ${tokens.colors.bordeIntermedio}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  badge: {
    color: tokens.colors.textoPrimario,
    background: tokens.colors.chromeNeutralSuave,
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    padding: "2px 6px",
    fontSize: "11px",
    fontWeight: 700,
  },
  labelIcon: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: tokens.colors.textoSecundario,
    fontSize: "12px",
    fontWeight: 700,
  },
  icon: {
    width: "14px",
    height: "14px",
  },
  simBlock: {
    display: "grid",
    gap: "8px",
    paddingTop: "2px",
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: tokens.colors.textoPrimario,
    fontSize: "12px",
    fontWeight: 700,
  },
  checkRowSmall: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    minHeight: "32px",
    color: tokens.colors.textoSecundario,
    fontSize: "12px",
    fontWeight: 700,
  },
  modeRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "6px",
  },
  modeButton: {
    height: "30px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoSecundario,
    fontSize: "12px",
    fontWeight: 700,
  },
  modeButtonActive: {
    height: "30px",
    border: `1px solid ${tokens.colors.acentoUi}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.acentoUiSuave,
    color: tokens.colors.textoPrimario,
    fontSize: "12px",
    fontWeight: 800,
  },
  paramGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  compactField: {
    display: "grid",
    gap: "4px",
  },
  textarea: {
    width: "100%",
    minHeight: "74px",
    resize: "vertical",
    padding: "8px 10px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    color: tokens.colors.textoPrimario,
    background: tokens.colors.fondoChrome,
    outlineColor: tokens.colors.chromeNeutral,
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  select: {
    width: "100%",
    height: "34px",
    padding: "0 10px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    color: tokens.colors.textoPrimario,
    background: tokens.colors.fondoChrome,
    outlineColor: tokens.colors.chromeNeutral,
    fontSize: "13px",
    fontWeight: 600,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
