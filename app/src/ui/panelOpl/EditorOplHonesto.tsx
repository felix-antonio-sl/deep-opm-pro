// [JOYAS §1-3] Editor OPL libre con contrato honesto: 4 grupos visuales
// (texto, sentencias reconocidas, cambios aplicables, no aplicables), botón
// "Aplicar N cambios" con conteo y tooltip por razón en líneas no aplicables.
// Cierre del informe UI/UX 2026-05-07 línea 147: antes de aplicar debe quedar
// claro qué cambios modificarán el modelo y cuáles son sólo texto.
//
// Ronda 26 / L6 B4: además de los 4 grupos, cuando hay ≥1 línea no aplicable
// por `forma-no-reconocida` o `inversa-no-soportada` (familias generadas
// automáticamente desde el canvas — abanicos, eventos, condiciones,
// excepciones), se muestra un aviso contextual sobre el editor. El mensaje
// NO lista las familias soportadas (esa lista crece a medida que L1/L2/L5
// merguen sus parsers); lista las NO soportadas, que es la frontera honesta
// hoy. Los tooltips por línea complementan con la razón concreta.
import { useMemo } from "preact/hooks";
import {
  clasificarEdicionOpl,
  etiquetaBotonAplicar,
  type LineaClasificada,
} from "../../opl/clasificadorEdicion";
import type { PrevisualizacionOplReverse } from "../../opl/parser";
import { editorOplStyles as style } from "./styles";

/**
 * Mensaje canonico para el aviso contextual sobre familias no editables.
 * Estable: si cambia, los smokes que lo asserten también deben actualizarse.
 * El texto NO menciona las familias soportadas (descripcion, estados,
 * enlaces procedurales, enlaces estructurales) — solo las NO soportadas hoy.
 */
export const AVISO_FAMILIAS_NO_EDITABLES_TEXTO =
  "Algunas oraciones son generadas automáticamente desde el canvas y no pueden editarse desde aquí (abanicos, eventos, condiciones, excepciones).";

/**
 * Devuelve `true` si entre las líneas clasificadas hay ≥1 marcada como
 * `no-aplicable` por una razón estructural (familia OPL no soportada por el
 * parser/aplicador reverse), no por error de usuario (sintaxis, ambigüedad).
 * Exportado para tests; el componente lo usa internamente.
 */
export function hayLineasGeneradasDelCanvas(lineas: LineaClasificada[]): boolean {
  return lineas.some(
    (linea) =>
      linea.estado === "no-aplicable" &&
      (linea.razon?.codigo === "forma-no-reconocida" ||
        linea.razon?.codigo === "inversa-no-soportada"),
  );
}

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

  // Ronda 26 / L6 B4: cuando hay líneas no aplicables por familias generadas
  // desde el canvas, mostrar el aviso contextual sobre el textarea.
  const mostrarAvisoNoEditables = hayLineasGeneradasDelCanvas(clasificacion.lineas);

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
        <aside
          data-testid="panel-opl-editor-ayuda"
          style={style.ayuda}
          aria-label="Ayuda de sintaxis del editor OPL"
        >
          <div style={style.ayudaTitulo}>Sintaxis OPL en markdown</div>
          <p style={style.ayudaTexto}>
            Edita una oración por línea. Usá <strong>**negritas**</strong> para
            cosas (objetos, procesos) y <em>*itálicas*</em> para estados. Cada
            cambio reconocido se muestra en <strong>Cambios aplicables</strong>;
            al pulsar <strong>Aplicar</strong> se sincronizan con el modelo.
          </p>
          <pre style={style.ayudaEjemplo} aria-label="Ejemplo de sintaxis OPL">
            **Bomba** es un objeto físico y sistémico.{"\n"}
            **Bomba** puede ser *encendida* o *apagada*.
          </pre>
        </aside>
        {mostrarAvisoNoEditables ? (
          <aside
            data-testid="panel-opl-editor-aviso-no-editables"
            style={style.avisoNoEditables}
            role="note"
            aria-label="Aviso sobre oraciones generadas desde el canvas"
          >
            {AVISO_FAMILIAS_NO_EDITABLES_TEXTO}
          </aside>
        ) : null}
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
  // Para razones estructurales (familias generadas desde el canvas) extiende
  // el tooltip con una nota explícita sobre el origen, ayudando al usuario a
  // entender por qué la oración no es editable desde texto libre.
  const esFamiliaCanvas =
    linea.estado === "no-aplicable" &&
    (linea.razon?.codigo === "forma-no-reconocida" ||
      linea.razon?.codigo === "inversa-no-soportada");
  const tooltip = linea.estado === "no-aplicable" && linea.razon
    ? esFamiliaCanvas
      ? `${linea.razon.texto} — esta oración se genera automáticamente desde el canvas; editala allí. (${linea.razon.citaSsot})`
      : `${linea.razon.texto} (${linea.razon.citaSsot})`
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
