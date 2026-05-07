import editAliasIcon from "../../../../assets/svg/editAlias.svg";
import editUnitsIcon from "../../../../assets/svg/editUnits.svg";
import type { Entidad, TipoValorSlot, ValorConcreto } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";

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
}

const TIPOS: Array<{ value: TipoValorSlot; label: string }> = [
  { value: "integer", label: "Entero" },
  { value: "float", label: "Decimal" },
  { value: "char", label: "Carácter" },
  { value: "string", label: "Texto" },
];

export function SeccionAtributo({ entidad, derivado, onUnidad, onTipo, onValor }: Props) {
  const slot = entidad.valorSlot;
  return (
    <section style={styles.section} data-testid="inspector-seccion-atributo">
      <div style={styles.header}>
        <span style={style.label}>Atributo</span>
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
        <span style={style.label}>Valor</span>
        <input
          style={style.input}
          value={slot?.valor ?? ""}
          placeholder={slot?.placeholder ?? "value"}
          onChange={(event) => onValor(event.currentTarget.value)}
          data-testid="atributo-valor-input"
        />
      </label>
    </section>
  );
}

const styles = {
  section: {
    display: "grid",
    gap: "8px",
    marginBottom: "14px",
    padding: "10px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#f9fbfd",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  badge: {
    color: "#1f2937",
    background: "#e8eef5",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "11px",
    fontWeight: 700,
  },
  labelIcon: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#475467",
    fontSize: "12px",
    fontWeight: 700,
  },
  icon: {
    width: "14px",
    height: "14px",
  },
  select: {
    width: "100%",
    height: "34px",
    padding: "0 10px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    color: "#1f2937",
    background: "#ffffff",
    outlineColor: "#586D8C",
    fontSize: "13px",
    fontWeight: 600,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
