// [JOYAS §1-3] Editor OPL libre con contrato honesto: 4 grupos visuales
// (texto, sentencias reconocidas, cambios aplicables, no aplicables), botón
// "Aplicar N cambios" con conteo y tooltip por razón en líneas no aplicables.
// Cierre del informe UI/UX 2026-05-07 línea 147: antes de aplicar debe quedar
// claro qué cambios modificarán el modelo y cuáles son sólo texto.
//
// Tokens-only, sin hex literales nuevos. Preserva todos los testIds previos
// (`panel-opl-editor-libre`, `panel-opl-editor-textarea`,
// `panel-opl-editor-aplicar`, `panel-opl-editor-preview`,
// `panel-opl-editor-diagnosticos`) para que los smokes existentes sigan
// resolviendo, y agrega testIds nuevos por grupo y por línea clasificada.
import { useMemo } from "preact/hooks";
import {
  clasificarEdicionOpl,
  etiquetaBotonAplicar,
  type LineaClasificada,
} from "../../opl/clasificadorEdicion";
import type { PrevisualizacionOplReverse } from "../../opl/parser";
import { editorOplStyles as style } from "./styles";

interface EditorOplHonestoProps {
  texto: string;
  preview: PrevisualizacionOplReverse | null;
  onTexto: (texto: string) => void;
  onAplicar: () => void;
  onCancelar: () => void;
}

export function EditorOplHonesto(props: EditorOplHonestoProps) {
  const clasificacion = useMemo(
    () => clasificarEdicionOpl(props.texto, props.preview),
    [props.texto, props.preview],
  );

  const aplicables = clasificacion.lineas.filter((l) => l.estado === "aplicable");
  const noAplicables = clasificacion.lineas.filter((l) => l.estado === "no-aplicable");
  const reconocidas = clasificacion.lineas.filter(
    (l) => l.estado === "aplicable" || l.estado === "no-aplicable" || l.estado === "sin-cambio",
  );

  const labelAplicar = etiquetaBotonAplicar(clasificacion.resumen.aplicables);
  const puedeAplicar = clasificacion.resumen.aplicables > 0;

  return (
    <section
      style={style.layout}
      data-testid="panel-opl-editor-libre"
      aria-label="Editor OPL honesto"
    >
      <div style={style.grupo} data-grupo="texto">
        <h4 style={style.titulo}>Texto editado</h4>
        <textarea
          data-testid="panel-opl-editor-textarea"
          aria-label="Editor OPL libre"
          value={props.texto}
          spellcheck={false}
          style={style.textarea}
          onInput={(event) => props.onTexto((event.currentTarget as HTMLTextAreaElement).value)}
        />
      </div>

      <div style={style.grupo} data-grupo="reconocidas" data-testid="editor-opl-grupo-reconocidas">
        <h4 style={style.titulo}>
          Sentencias reconocidas
          <span
            data-testid="editor-opl-contador-reconocidas"
            style={style.contadorPillNeutro}
            aria-label={`${reconocidas.length} sentencias reconocidas`}
          >
            {reconocidas.length}
          </span>
        </h4>
        {reconocidas.length === 0 ? (
          <p style={style.listaVacia}>Aún no hay sentencias OPL reconocidas en el texto.</p>
        ) : (
          <ul style={style.lista}>
            {reconocidas.map((linea) => (
              <LineaItem key={linea.numero} linea={linea} variante="reconocida" />
            ))}
          </ul>
        )}
      </div>

      <div style={style.grupo} data-grupo="aplicables" data-testid="editor-opl-grupo-aplicables">
        <h4 style={style.titulo}>
          Cambios aplicables
          <span
            data-testid="editor-opl-contador-aplicables"
            style={style.contadorPillExito}
            aria-label={`${aplicables.length} cambios aplicables`}
          >
            {aplicables.length}
          </span>
        </h4>
        {aplicables.length === 0 ? (
          <p style={style.listaVacia}>Sin cambios que modifiquen el modelo todavía.</p>
        ) : (
          <ul style={style.lista} data-testid="panel-opl-editor-preview">
            {aplicables.map((linea) => (
              <LineaItem key={linea.numero} linea={linea} variante="aplicable" />
            ))}
          </ul>
        )}
      </div>

      <div style={style.grupo} data-grupo="no-aplicables" data-testid="editor-opl-grupo-no-aplicables">
        <h4 style={style.titulo}>
          No aplicables
          <span
            data-testid="editor-opl-contador-no-aplicables"
            style={style.contadorPillAlerta}
            aria-label={`${noAplicables.length} líneas no aplicables`}
          >
            {noAplicables.length}
          </span>
        </h4>
        {noAplicables.length === 0 ? (
          <p style={style.listaVacia}>Ninguna línea bloquea la aplicación.</p>
        ) : (
          <ul style={style.lista} data-testid="panel-opl-editor-diagnosticos">
            {noAplicables.map((linea) => (
              <LineaItem key={linea.numero} linea={linea} variante="no-aplicable" />
            ))}
          </ul>
        )}
      </div>

      <footer style={style.footer}>
        <span style={style.resumenInline} data-testid="editor-opl-resumen">
          {clasificacion.resumen.aplicables} aplicable{clasificacion.resumen.aplicables === 1 ? "" : "s"} ·{" "}
          {clasificacion.resumen.noAplicables} bloqueada{clasificacion.resumen.noAplicables === 1 ? "" : "s"}
        </span>
        <button
          type="button"
          data-testid="panel-opl-editor-cancelar"
          style={style.btnBase}
          onClick={props.onCancelar}
        >
          Cancelar
        </button>
        <button
          type="button"
          data-testid="panel-opl-editor-aplicar"
          aria-label={labelAplicar}
          disabled={!puedeAplicar}
          onClick={props.onAplicar}
          style={{
            ...style.btnBase,
            ...(puedeAplicar ? style.btnPrimarioActivo : style.btnDisabled),
          }}
        >
          {labelAplicar}
        </button>
      </footer>
    </section>
  );
}

function LineaItem(props: {
  linea: LineaClasificada;
  variante: "reconocida" | "aplicable" | "no-aplicable";
}) {
  const { linea, variante } = props;
  const itemStyle: preact.JSX.CSSProperties = {
    ...style.itemBase,
    ...(linea.estado === "aplicable"
      ? style.itemAplicable
      : linea.estado === "no-aplicable"
        ? style.itemNoAplicable
        : style.itemSinCambio),
  };
  // Tooltip: para no aplicables el title incluye razón canónica + cita SSOT.
  const tooltip = linea.estado === "no-aplicable" && linea.razon
    ? `${linea.razon.texto} (${linea.razon.citaSsot})`
    : undefined;

  return (
    <li
      style={itemStyle}
      data-testid={`editor-opl-linea-${linea.numero}`}
      data-estado={linea.estado}
      title={tooltip}
    >
      <span style={style.numeroLinea}>L{linea.numero}</span>
      <div>
        <div style={style.textoLinea}>{linea.texto || "(línea vacía)"}</div>
        {variante === "aplicable" && linea.descripcionCambio ? (
          <div style={style.cambioDescripcion}>{linea.descripcionCambio}</div>
        ) : null}
        {variante === "no-aplicable" && linea.razon ? (
          <div style={style.razonLinea}>
            {linea.razon.texto}
            <span style={style.citaSsot}>({linea.razon.citaSsot})</span>
          </div>
        ) : null}
      </div>
    </li>
  );
}
