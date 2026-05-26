// VARIANT 4 — Codex (handoff reference)
//
// ⚠ NOTA DE HANDOFF
// Este archivo es una implementación React de referencia DEL CHROME de Codex.
// La región del canvas (símbolos OPM, enlaces, triángulos) está mockeada con
// SVG inline (CodexMainDiagram, CodexSubDiagram, CodexInspectorDiagram, +
// helpers CodexObject/CodexProcess/CodexState) ÚNICAMENTE para que las
// screenshots se vean completas en el handoff.
//
// En producción, esa región la renderiza JointJS. Al integrar:
//   1. Reemplaza el SVG inline por <div ref={paperContainerRef}/>.
//   2. Monta el Paper de JointJS allí.
//   3. Aplica los attrs definidos en handoff/08-jointjs-styling.md a los
//      shapes JointJS (codex.Object, codex.Process, codex.State).
//   4. Borra las funciones SVG inline mencionadas — ya no se necesitan.
//
// Editorial · marginalia · type-led. La página ES la interfaz.
// Sin barras laterales pesadas. OPL como notas al margen.
// Inria Serif + Inria Sans + JetBrains Mono.

const CX = {
  paper:        '#fafaf8',
  paperWarm:    '#eeece2',
  ink:          '#171511',
  inkMid:       '#5a564c',
  inkSoft:      '#807b6e',
  inkFaint:     '#b5b0a4',
  rule:         '#d3cec1',
  ruleStrong:   '#aea899',
  // Canon OPM (mantenido)
  green:        '#3a6b4d',
  blue:         '#26467a',
  olive:        '#7e8338',
  stateFill:    '#ece9e1',
  // Acento editorial (UI-only, reemplaza el magenta de Drafting)
  crimson:      '#8e2a2e',
};

const serif = 'Inria Serif, Georgia, serif';
const sans  = 'Inria Sans, system-ui, sans-serif';
const mono  = 'JetBrains Mono, ui-monospace, monospace';

// ───────────────────────────────────────────────────────────────────────────
// Tipografía canónica OPL (§1.7 opm-opl-es)
//   Objeto      → **bold**
//   Proceso     → ***bold italic***
//   Estado      → `monospace`
// ───────────────────────────────────────────────────────────────────────────

function OplObj({ children })   { return <b style={{ fontWeight: 700, fontStyle: 'normal' }}>{children}</b>; }
function OplProc({ children })  { return <span style={{ fontWeight: 700, fontStyle: 'italic' }}>{children}</span>; }
function OplState({ children }) { return <span style={{ fontFamily: mono, fontSize: '0.86em', color: CX.olive, letterSpacing: '0.02em' }}>{children}</span>; }

// ───────────────────────────────────────────────────────────────────────────
// CodexFrame — el marco compartido: header, columna izq, columna der, footer
// Recibe contenido del canvas y el contenido del panel derecho.
// ───────────────────────────────────────────────────────────────────────────

function CodexFrame({
  breadcrumb = ['sistema', 'system diagram'],
  meta = '20 oraciones · sin guardar',
  leftTree,
  rightPanel,
  canvas,
  floating,
  footerCenter,
  footerRight = '✓ ningún diagnóstico',
}) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: CX.paper, color: CX.ink,
      fontFamily: serif,
      display: 'grid',
      gridTemplateRows: '60px 1fr 44px',
      gridTemplateColumns: '210px 1fr 360px',
      gridTemplateAreas: `
        "head head head"
        "left canvas right"
        "foot foot foot"
      `,
      position: 'relative',
    }}>
      {/* HEAD */}
      <div style={{
        gridArea: 'head',
        borderBottom: `1px solid ${CX.rule}`,
        display: 'grid',
        gridTemplateColumns: '210px 1fr 360px',
        alignItems: 'stretch',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '0 22px',
          borderRight: `1px solid ${CX.rule}`,
        }}>
          <span style={{
            fontFamily: serif, fontStyle: 'italic', fontWeight: 400,
            fontSize: 22, color: CX.ink, letterSpacing: '-0.005em',
          }}>Opforja</span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 12,
          fontFamily: mono, fontSize: 11, color: CX.inkSoft, letterSpacing: '0.02em',
        }}>
          {breadcrumb.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: CX.inkFaint }}>·</span>}
              <span style={{
                color: i === breadcrumb.length - 1 ? CX.ink : CX.inkSoft,
                fontWeight: i === breadcrumb.length - 1 ? 500 : 400,
              }}>{c}</span>
            </React.Fragment>
          ))}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 22px', gap: 18,
          fontFamily: sans, fontSize: 12, color: CX.inkMid,
          borderLeft: `1px solid ${CX.rule}`,
        }}>
          <span style={{ fontStyle: 'italic' }}>{meta}</span>
          <span style={{
            fontFamily: mono, fontSize: 10,
            padding: '2px 7px', border: `1px solid ${CX.rule}`, color: CX.inkMid,
          }}>⌘K</span>
        </div>
      </div>

      {/* LEFT — Índice */}
      <div style={{
        gridArea: 'left',
        borderRight: `1px solid ${CX.rule}`,
        padding: '22px 22px 18px',
        display: 'flex', flexDirection: 'column', gap: 18,
        overflow: 'hidden',
      }}>
        {leftTree}
      </div>

      {/* CANVAS — área central */}
      <div style={{
        gridArea: 'canvas',
        position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}>
        {canvas}
        {floating}
      </div>

      {/* RIGHT — OPL / Inspector / etc */}
      <div style={{
        gridArea: 'right',
        borderLeft: `1px solid ${CX.rule}`,
        padding: '22px 24px 18px',
        display: 'flex', flexDirection: 'column', gap: 16,
        overflow: 'hidden',
      }}>
        {rightPanel}
      </div>

      {/* FOOTER */}
      <div style={{
        gridArea: 'foot',
        borderTop: `1px solid ${CX.rule}`,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        alignItems: 'center',
        padding: '0 22px',
        fontFamily: mono, fontSize: 10, color: CX.inkSoft, letterSpacing: '0.04em',
      }}>
        <span>23 may · v0.4 · f.s.</span>
        <span style={{ justifySelf: 'center', display: 'flex', gap: 18 }}>
          {footerCenter || (
            <>
              <CodexFooterKey k="O" label="objeto" color={CX.green}/>
              <CodexFooterKey k="P" label="proceso" color={CX.blue}/>
              <CodexFooterKey k="S" label="estado" color={CX.olive}/>
              <CodexFooterKey k="R" label="relación"/>
              <CodexFooterKey k="⌘K" label="comandos"/>
            </>
          )}
        </span>
        <span style={{ justifySelf: 'end', fontStyle: 'italic', fontFamily: serif, fontSize: 11, color: CX.inkMid }}>
          {footerRight}
        </span>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// CodexSelectionAnnotation — caption editorial anclada cerca de la selección.
// Marca de referencia (※ / dígito) + acciones en serif + meta en mono.
// ───────────────────────────────────────────────────────────────────────────

function CodexSelectionAnnotation({ top, left, right, bottom, mark, markBig, actions, meta, align = 'left' }) {
  const pos = {};
  if (top != null) pos.top = top;
  if (left != null) pos.left = left;
  if (right != null) pos.right = right;
  if (bottom != null) pos.bottom = bottom;
  const centered = left === '50%';
  return (
    <div style={{
      position: 'absolute', ...pos,
      transform: centered ? 'translateX(-50%)' : undefined,
      maxWidth: 540,
      background: CX.paper,
      padding: '6px 14px 8px',
      display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 14,
      fontFamily: serif, color: CX.ink,
      zIndex: 4,
      textAlign: align,
    }}>
      <span style={{
        gridRow: '1 / span 2', alignSelf: 'center', justifySelf: 'center',
        fontFamily: serif, fontSize: markBig ? 28 : 20, fontWeight: markBig ? 700 : 400,
        color: CX.crimson, lineHeight: 1,
        paddingTop: markBig ? 2 : 4,
        fontVariantNumeric: 'tabular-nums',
      }}>{mark}</span>
      <div style={{ fontSize: 13.5, display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', columnGap: 12, rowGap: 4 }}>
        {actions.map((a, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: CX.inkFaint }}>·</span>}
            <span style={{
              cursor: 'pointer',
              color: a.danger ? CX.crimson : (a.primary ? CX.ink : CX.inkMid),
              fontStyle: a.primary || a.danger ? 'italic' : 'normal',
              fontWeight: a.primary ? 600 : 400,
              display: 'inline-flex', alignItems: 'baseline', gap: 5,
            }}>
              {a.label}
              {a.kbd && <span style={{ fontFamily: mono, fontSize: 9.5, color: CX.inkSoft, letterSpacing: '0.04em' }}>{a.kbd}</span>}
            </span>
          </React.Fragment>
        ))}
      </div>
      <div style={{
        gridColumn: 2,
        marginTop: 4, paddingTop: 4,
        borderTop: `1px solid ${CX.rule}`,
        fontFamily: mono, fontSize: 9.5, color: CX.inkSoft, letterSpacing: '0.06em',
      }}>
        {meta}
      </div>
    </div>
  );
}

function CodexFooterKey({ k, label, color }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        fontFamily: mono, fontSize: 9.5,
        padding: '1px 5px', border: `1px solid ${color || CX.rule}`,
        color: color || CX.inkMid, letterSpacing: '0.06em',
      }}>{k}</span>
      <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 11, color: CX.inkMid, letterSpacing: 0 }}>{label}</span>
    </span>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Componentes tipográficos: secciones del índice y de la marginalia OPL
// ───────────────────────────────────────────────────────────────────────────

function CodexColHeader({ kicker, title, side }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <div>
        <div style={{
          fontFamily: sans, fontSize: 10, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: CX.inkSoft,
        }}>{kicker}</div>
        <div style={{
          fontFamily: serif, fontWeight: 700, fontSize: 22,
          marginTop: 4, color: CX.ink, letterSpacing: '-0.01em',
        }}>{title}</div>
      </div>
      {side && <span style={{
        fontFamily: mono, fontSize: 10, color: CX.inkSoft, letterSpacing: '0.04em',
      }}>{side}</span>}
    </div>
  );
}

function CodexTreeRow({ label, code, counts, level = 0, current, mark, marker, italic }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 10,
      padding: '4px 0',
      paddingLeft: level * 18,
      position: 'relative',
      borderBottom: `1px dotted ${CX.rule}`,
      color: current ? CX.ink : CX.inkMid,
      fontFamily: serif, fontStyle: italic ? 'italic' : 'normal',
      fontWeight: current ? 600 : 400,
      fontSize: 14, letterSpacing: '-0.005em',
    }}>
      {marker && (
        <span style={{ position: 'absolute', left: level * 18 - 10, color: CX.inkFaint, fontSize: 10 }}>{marker}</span>
      )}
      {code && (
        <span style={{ fontFamily: mono, fontSize: 10, color: current ? CX.ink : CX.inkSoft, letterSpacing: '0.04em' }}>
          {code}
        </span>
      )}
      <span style={{ flex: 1 }}>{label}</span>
      {mark && <span style={{
        fontFamily: mono, fontSize: 9, color: CX.crimson, letterSpacing: '0.08em', textTransform: 'lowercase',
      }}>{mark}</span>}
      {counts && (
        <span style={{ fontFamily: mono, fontSize: 9.5, color: CX.inkSoft, letterSpacing: '0.04em' }}>
          {counts}
        </span>
      )}
    </div>
  );
}

function CodexOPLNote({ n, body, selected, marginalia, severity }) {
  return (
    <div style={{ position: 'relative', marginBottom: 12 }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '28px 1fr',
        gap: 10,
        fontFamily: serif, fontSize: 13.5, lineHeight: 1.55,
        color: selected ? CX.ink : CX.inkMid,
        textWrap: 'pretty',
      }}>
        <span style={{
          fontFamily: mono, fontSize: 10.5, color: selected ? CX.crimson : CX.inkSoft,
          letterSpacing: '0.04em', paddingTop: 3,
        }}>{n}</span>
        <span style={{
          borderBottom: selected ? `1px solid ${CX.crimson}55` : 'none',
        }}>{body}</span>
      </div>
      {marginalia && (
        <div style={{
          marginLeft: 38, marginTop: 4,
          fontFamily: serif, fontStyle: 'italic', fontSize: 11,
          color: severity === 'critica' ? CX.crimson : severity === 'alta' ? CX.olive : CX.inkSoft,
          letterSpacing: '-0.005em',
          display: 'flex', alignItems: 'baseline', gap: 6,
        }}>
          <span style={{ fontFamily: mono, fontStyle: 'normal', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {severity === 'critica' ? '△ crítica' : severity === 'alta' ? '△ alta' : '— nota'}
          </span>
          <span>{marginalia}</span>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Diagram (canon OPM en estética Codex): trazos hairline, fills transparentes,
// índices como notas al pie, etiquetas en serif.
// ───────────────────────────────────────────────────────────────────────────

function CodexObject({ x, y, w = 200, h = 78, idx, label }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={CX.green} strokeWidth="1.5"/>
      <text x={x + w/2} y={y + h/2 + 5} textAnchor="middle"
            fontFamily={serif} fontWeight="400" fontSize="17" fill={CX.ink}>{label}</text>
      <text x={x} y={y + h + 14}
            fontFamily={mono} fontSize="9.5" fill={CX.inkSoft} letterSpacing="0.08em">{idx}</text>
    </g>
  );
}

function CodexProcess({ cx, cy, rx, ry, idx, label }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={CX.blue} strokeWidth="1.5"/>
      <text x={cx} y={cy + 5} textAnchor="middle"
            fontFamily={serif} fontWeight="400" fontStyle="italic" fontSize="17" fill={CX.ink}>{label}</text>
      <text x={cx - rx} y={cy + ry + 14}
            fontFamily={mono} fontSize="9.5" fill={CX.inkSoft} letterSpacing="0.08em">{idx}</text>
    </g>
  );
}

function CodexState({ x, y, w, h, label }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h/2} fill={CX.stateFill} stroke={CX.olive} strokeWidth="1.2"/>
      <text x={x + w/2} y={y + h/2 + 4} textAnchor="middle"
            fontFamily={serif} fontStyle="italic" fontSize="13" fill={CX.ink}>{label}</text>
    </g>
  );
}

function CodexMainDiagram({ underlined }) {
  // OPM topology cf. screenshot original
  return (
    <svg viewBox="0 0 1140 760" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <marker id="cx-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0,1 L9,5 L0,9" fill="none" stroke={CX.ink} strokeWidth="1"/>
        </marker>
      </defs>

      {/* Fila 1: objetos sistémicos */}
      <CodexObject x={70}  y={70} idx="o.01" label="System Name"/>
      <CodexObject x={310} y={70} idx="o.02" label="System Handler"/>
      <CodexObject x={550} y={70} idx="o.03" label="System Tool Set"/>
      <CodexObject x={810} y={70} w={220} idx="o.04" label="Beneficiary Group"/>

      {/* Fila 2 */}
      <CodexObject x={70} y={250} idx="o.05" label="Main Input"/>

      {/* Compound object: Beneficiary Relevant Attribute */}
      <g>
        <rect x="780" y="240" width="320" height="180" fill="none" stroke={CX.green} strokeWidth="1.5"/>
        <text x="940" y="270" textAnchor="middle"
              fontFamily={serif} fontWeight="400" fontSize="17" fill={CX.ink}>Beneficiary Relevant Attribute</text>
        {underlined === 'o.06' && (
          <line x1="845" y1="278" x2="1035" y2="278" stroke={CX.crimson} strokeWidth="1"/>
        )}
        <text x="780" y="434" fontFamily={mono} fontSize="9.5" fill={CX.inkSoft} letterSpacing="0.08em">o.06</text>
        <CodexState x={815} y={320} w={130} h={42} label="problematic"/>
        <CodexState x={960} y={320} w={130} h={42} label="satisfactory"/>
      </g>

      {/* Process */}
      <CodexProcess cx={490} cy={460} rx={160} ry={62} idx="p.01" label="Main System Doing"/>

      {/* Output */}
      <CodexObject x={390} y={620} idx="o.07" label="Main Output"/>

      {/* Aggregation triangle (System Name composes 02/03/05) */}
      <g stroke={CX.ink} strokeWidth="1.2" fill="none">
        <line x1="170" y1="148" x2="170" y2="190"/>
        <polygon points="155,190 185,190 170,215" fill="none"/>
        <line x1="170" y1="215" x2="170" y2="250"/>
        <line x1="158" y1="208" x2="410" y2="148" opacity="0.55"/>
        <line x1="182" y1="208" x2="650" y2="148" opacity="0.55"/>
      </g>

      {/* Exhibition triangle (Beneficiary Group ↔ Relevant Attribute) */}
      <g stroke={CX.ink} strokeWidth="1.2" fill="none">
        <line x1="920" y1="148" x2="920" y2="190"/>
        <rect x="908" y="190" width="24" height="24"/>
        <line x1="920" y1="214" x2="920" y2="240"/>
      </g>

      {/* Arrows */}
      <line x1="270" y1="304" x2="345" y2="430" stroke={CX.ink} strokeWidth="1" markerEnd="url(#cx-arrow)"/>
      <line x1="490" y1="522" x2="490" y2="618" stroke={CX.ink} strokeWidth="1" markerEnd="url(#cx-arrow)"/>
      <path d="M 642 430 Q 720 380 815 343" fill="none" stroke={CX.ink} strokeWidth="1" markerEnd="url(#cx-arrow)"/>
    </svg>
  );
}

function CodexSubDiagram({ selectedIds = [] }) {
  // SD1 in-zoom: Beneficiary Relevant Attribute decompuesto en 3 sub-attrs
  const sel = (id) => selectedIds.includes(id);
  return (
    <svg viewBox="0 0 1140 720" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <marker id="cx2-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0,1 L9,5 L0,9" fill="none" stroke={CX.ink} strokeWidth="1"/>
        </marker>
      </defs>

      <CodexObject x={70} y={110} w={210} h={80} idx="o.04" label="Beneficiary Group"/>
      <CodexProcess cx={180} cy={340} rx={110} ry={50} idx="p.01" label="Main System Doing"/>

      {/* Compound being in-zoomed */}
      <g>
        <rect x="380" y="80" width="700" height="540" fill="none" stroke={CX.green} strokeWidth="1.5"/>
        <text x="730" y="115" textAnchor="middle"
              fontFamily={serif} fontWeight="500" fontSize="20" fill={CX.ink}>Beneficiary Relevant Attribute</text>
        <text x="380" y="635" fontFamily={mono} fontSize="9.5" fill={CX.inkSoft} letterSpacing="0.08em">o.06 · in-zoom</text>

        {/* 3 sub-attrs */}
        {[0,1,2].map(i => {
          const id = `o.06.${i+1}`;
          const isSelected = sel(id);
          return (
            <g key={i}>
              <rect x={500} y={170 + i*100} width={460} height={70} fill="none" stroke={CX.green} strokeWidth="1.5"/>
              <text x={730} y={210 + i*100} textAnchor="middle"
                    fontFamily={serif} fontWeight="400" fontSize="16" fill={CX.ink}>
                Beneficiary Relevant Attribute {i+1}
              </text>
              <text x={500} y={256 + i*100} fontFamily={mono} fontSize="9" fill={CX.inkSoft} letterSpacing="0.08em">{id}</text>
              {isSelected && (
                <line x1={620} y1={222 + i*100} x2={840} y2={222 + i*100} stroke={CX.crimson} strokeWidth="1"/>
              )}
            </g>
          );
        })}

        {/* States */}
        <CodexState x={580} y={500} w={130} h={42} label="problematic"/>
        <CodexState x={750} y={500} w={130} h={42} label="satisfactory"/>

        {/* Aggregation triangle within compound */}
        <g stroke={CX.ink} strokeWidth="1.2" fill="none">
          <line x1="730" y1="130" x2="730" y2="155"/>
          <polygon points="715,155 745,155 730,180"/>
          <line x1="715" y1="172" x2="500" y2="200" opacity="0.55"/>
          <line x1="745" y1="172" x2="960" y2="200" opacity="0.55"/>
          <line x1="730" y1="180" x2="730" y2="200" opacity="0.55"/>
        </g>
      </g>

      {/* Exhibition: Beneficiary Group ↔ Compound */}
      <g stroke={CX.ink} strokeWidth="1.2" fill="none">
        <line x1="280" y1="150" x2="340" y2="150"/>
        <rect x="340" y="138" width="22" height="22"/>
        <line x1="362" y1="150" x2="380" y2="150"/>
      </g>

      {/* Arrow process → compound */}
      <line x1="290" y1="340" x2="378" y2="340" stroke={CX.ink} strokeWidth="1" markerEnd="url(#cx2-arrow)"/>
    </svg>
  );
}

function CodexInspectorDiagram({ selectedId = 'o.06' }) {
  return (
    <svg viewBox="0 0 1140 620" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <marker id="cx3-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0,1 L9,5 L0,9" fill="none" stroke={CX.ink} strokeWidth="1"/>
        </marker>
      </defs>

      <CodexObject x={70}  y={60} idx="o.01" label="System Name"/>
      <CodexObject x={310} y={60} idx="o.02" label="System Handler"/>
      <CodexObject x={550} y={60} idx="o.03" label="System Tool Set"/>
      <CodexObject x={790} y={60} w={220} idx="o.04" label="Beneficiary Group"/>

      <CodexObject x={70} y={220} idx="o.05" label="Main Input"/>

      {/* SELECTED compound object */}
      <g>
        <rect x="760" y="210" width="320" height="160" fill="none" stroke={CX.green} strokeWidth="1.5"/>
        <text x="920" y="240" textAnchor="middle"
              fontFamily={serif} fontWeight="500" fontSize="17" fill={CX.ink}>Beneficiary Relevant Attribute</text>
        {/* Selection underline (crimson editorial mark) */}
        <line x1="785" y1="250" x2="1055" y2="250" stroke={CX.crimson} strokeWidth="1.2"/>
        <text x="760" y="384" fontFamily={mono} fontSize="9.5" fill={CX.crimson} letterSpacing="0.08em">o.06 · seleccionado</text>
        <CodexState x={795} y={290} w={130} h={42} label="problematic"/>
        <CodexState x={940} y={290} w={130} h={42} label="satisfactory"/>
      </g>

      <CodexProcess cx={460} cy={420} rx={140} ry={58} idx="p.01" label="Main System Doing"/>
      <CodexObject x={360} y={550} idx="o.07" label="Main Output"/>

      {/* Aggregation */}
      <g stroke={CX.ink} strokeWidth="1.2" fill="none">
        <line x1="170" y1="138" x2="170" y2="172"/>
        <polygon points="155,172 185,172 170,196"/>
        <line x1="170" y1="196" x2="170" y2="220"/>
        <line x1="158" y1="190" x2="410" y2="138" opacity="0.55"/>
        <line x1="182" y1="190" x2="650" y2="138" opacity="0.55"/>
      </g>

      {/* Arrows */}
      <line x1="270" y1="274" x2="320" y2="390" stroke={CX.ink} strokeWidth="1" markerEnd="url(#cx3-arrow)"/>
      <line x1="460" y1="478" x2="460" y2="548" stroke={CX.ink} strokeWidth="1" markerEnd="url(#cx3-arrow)"/>
      <path d="M 600 410 Q 690 360 795 320" fill="none" stroke={CX.ink} strokeWidth="1" markerEnd="url(#cx3-arrow)"/>
    </svg>
  );
}

// Wrapper que centra el SVG y aplica padding tipográfico
function CodexCanvas({ children, label, zoom = '100%' }) {
  return (
    <div style={{
      flex: 1, position: 'relative',
      padding: '24px 32px 12px',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 4, paddingBottom: 6,
        borderBottom: `1px solid ${CX.rule}`,
      }}>
        <span style={{ fontFamily: mono, fontSize: 9.5, color: CX.inkSoft, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{ fontFamily: mono, fontSize: 10, color: CX.inkSoft, letterSpacing: '0.04em' }}>
          {zoom}
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// SCENE 1 — Editor principal
// ───────────────────────────────────────────────────────────────────────────

function CodexEditor() {
  return (
    <CodexFrame
      leftTree={(
        <>
          <CodexColHeader kicker="Índice" title="OPDs"/>
          <div>
            <CodexTreeRow code="SD" label="sistema (raíz)" current level={0} marker="▸"/>
            <CodexTreeRow code="SD1" label="in-zoom de o.06" level={1} italic/>
            <CodexTreeRow label="nuevo OPD hijo" level={1} italic mark="+"/>
          </div>
          <div style={{ flex: 1 }}/>
          <div style={{
            fontFamily: serif, fontStyle: 'italic', fontSize: 11.5,
            color: CX.inkMid, lineHeight: 1.5,
            borderTop: `1px solid ${CX.rule}`, paddingTop: 12,
            textWrap: 'pretty',
          }}>
            «El SD precede a cualquier refinamiento; debe ser simple y claro, con mínimos detalles técnicos.»
            <div style={{ fontFamily: mono, fontStyle: 'normal', fontSize: 9, color: CX.inkSoft, letterSpacing: '0.1em', marginTop: 6 }}>
              metodología §6
            </div>
          </div>
        </>
      )}
      canvas={(
        <CodexCanvas label="SD · OPD raíz">
          <CodexMainDiagram/>
        </CodexCanvas>
      )}
      floating={(
        <>
          {/* Hint sutil "estás viendo un ejemplo" como inline note, no banner */}
          <div style={{
            position: 'absolute', top: 36, right: 44,
            fontFamily: serif, fontStyle: 'italic', fontSize: 12, color: CX.inkSoft,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            ejemplo precargado
            <span style={{
              fontFamily: sans, fontWeight: 600, fontSize: 11,
              padding: '4px 10px', border: `1px solid ${CX.ink}`, color: CX.ink, letterSpacing: '0.02em',
              cursor: 'pointer',
            }}>asistente guiado</span>
            <span style={{
              fontFamily: sans, fontSize: 11, color: CX.inkMid, letterSpacing: '0.02em',
              cursor: 'pointer',
            }}>empezar vacío ✕</span>
          </div>
        </>
      )}
      rightPanel={(
        <>
          <CodexColHeader kicker="Marginalia · OPL" title="System Diagram" side="24"/>
          <div style={{ overflowY: 'hidden', flex: 1, marginRight: -8, paddingRight: 8 }}>
            <CodexOPLNote n="01" body={<><OplObj>System Name</OplObj> es informacional.</>}/>
            <CodexOPLNote n="02" body={<><OplObj>System Name</OplObj> es sistémico.</>}/>
            <CodexOPLNote n="03" body={<><OplObj>System Name</OplObj> consta de <OplObj>System Handler</OplObj>, <OplObj>System Tool Set</OplObj> y <OplObj>Main Input</OplObj>.</>}/>
            <CodexOPLNote n="04" body={<><OplObj>Beneficiary Group</OplObj> es físico.</>}/>
            <CodexOPLNote n="05" body={<><OplObj>Beneficiary Group</OplObj> es ambiental.</>}
              marginalia="beneficiarios externos al sistema → ambiental (metodología §5)"
              severity="alta"/>
            <CodexOPLNote n="06" body={<><OplObj>Beneficiary Group</OplObj> exhibe <OplObj>Beneficiary Relevant Attribute</OplObj>.</>}/>
            <CodexOPLNote n="07" body={<><OplObj>Beneficiary Relevant Attribute</OplObj> puede estar <OplState>problematic</OplState> o <OplState>satisfactory</OplState>.</>}/>
            <CodexOPLNote n="08" body={<><OplProc>Main System Doing</OplProc> consume <OplObj>Main Input</OplObj>.</>}/>
            <CodexOPLNote n="09" body={<><OplProc>Main System Doing</OplProc> genera <OplObj>Main Output</OplObj>.</>}/>
            <CodexOPLNote n="10" body={<><OplProc>Main System Doing</OplProc> cambia <OplObj>Beneficiary Relevant Attribute</OplObj> de <OplState>problematic</OplState> a <OplState>satisfactory</OplState>.</>}/>
          </div>
          <div style={{
            paddingTop: 10, borderTop: `1px solid ${CX.rule}`,
            display: 'flex', justifyContent: 'space-between',
            fontFamily: sans, fontSize: 11, color: CX.inkMid,
          }}>
            <span>ver 14 más</span>
            <span style={{ display: 'flex', gap: 12 }}>
              <span>copiar</span><span>html</span><span>exportar</span>
            </span>
          </div>
        </>
      )}
    />
  );
}

// ───────────────────────────────────────────────────────────────────────────
// SCENE 2 — Command palette (⌘K)
// ───────────────────────────────────────────────────────────────────────────

function CodexCommand() {
  const sections = [
    { title: 'modelo', items: [
      ['guardar', '⌘S'],
      ['guardar como…', '⌘⇧S'],
      ['nuevo modelo', '⌘N'],
      ['abrir / importar…', '⌘O'],
      ['renombrar modelo', '⌘R'],
    ]},
    { title: 'crear', items: [
      ['nuevo objeto', 'O'],
      ['nuevo proceso', 'P'],
      ['nuevo estado en objeto seleccionado', 'S'],
      ['nueva relación', 'R'],
      ['nuevo OPD hijo (in-zoom)', '⌘⇧I'],
    ]},
    { title: 'navegar', items: [
      ['ir al SD raíz', '⌘1'],
      ['ir a SD1', '⌘2'],
      ['mapa del sistema', '⌘M'],
      ['siguiente OPD', '⌘↓'],
    ]},
    { title: 'exportar', items: [
      ['OPD actual como SVG', null],
      ['modelo como JSON', null],
      ['OPL como HTML', null],
    ]},
    { title: 'vista', items: [
      ['alias visibles', '✓'],
      ['descripciones visibles', '✓'],
      ['cuadrícula', '—'],
      ['biblioteca dock', '✓'],
    ]},
    { title: 'asistente', items: [
      ['iniciar asistente SD', '⌘⇧A'],
      ['ir a etapa actual del asistente', null],
    ]},
  ];
  return (
    <CodexFrame
      leftTree={<CodexEditorLeftDimmed/>}
      canvas={(
        <div style={{ position: 'relative', flex: 1, opacity: 0.3 }}>
          <CodexCanvas label="SD · OPD raíz">
            <CodexMainDiagram/>
          </CodexCanvas>
        </div>
      )}
      floating={(
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          paddingTop: 90,
          background: `${CX.paper}cc`, backdropFilter: 'blur(2px)',
        }}>
          <div style={{
            width: 620, maxHeight: 620,
            background: CX.paper,
            border: `1px solid ${CX.ruleStrong}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              padding: '18px 22px',
              borderBottom: `1px solid ${CX.rule}`,
              display: 'flex', alignItems: 'baseline', gap: 14,
            }}>
              <span style={{ fontFamily: mono, fontSize: 11, color: CX.crimson, letterSpacing: '0.14em' }}>⌘K</span>
              <input
                placeholder="buscar comando, archivo, oración OPL…"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  fontFamily: serif, fontStyle: 'italic', fontSize: 22, color: CX.ink,
                }}
              />
              <span style={{ fontFamily: mono, fontSize: 10, color: CX.inkSoft, letterSpacing: '0.08em' }}>esc</span>
            </div>
            <div style={{
              flex: 1, overflow: 'hidden', padding: '14px 0',
              display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 0, rowGap: 0,
            }}>
              {sections.map((sec, i) => (
                <div key={sec.title} style={{
                  padding: '8px 22px 18px',
                  borderBottom: i < sections.length - 2 ? `1px dotted ${CX.rule}` : 'none',
                  borderRight: i % 2 === 0 ? `1px dotted ${CX.rule}` : 'none',
                }}>
                  <div style={{
                    fontFamily: sans, fontSize: 9.5, letterSpacing: '0.22em',
                    textTransform: 'uppercase', color: CX.inkSoft, marginBottom: 8,
                  }}>{sec.title}</div>
                  {sec.items.map(([label, k], j) => (
                    <div key={j} style={{
                      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                      padding: '4px 0', gap: 14,
                      fontFamily: serif, fontSize: 13.5, color: CX.ink,
                      background: i === 0 && j === 0 ? CX.paperWarm : 'transparent',
                      borderLeft: i === 0 && j === 0 ? `2px solid ${CX.crimson}` : '2px solid transparent',
                      paddingLeft: i === 0 && j === 0 ? 8 : 0,
                    }}>
                      <span>{label}</span>
                      {k && <span style={{
                        fontFamily: mono, fontSize: 10, color: CX.inkSoft,
                        letterSpacing: '0.04em',
                      }}>{k}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{
              padding: '10px 22px', borderTop: `1px solid ${CX.rule}`,
              display: 'flex', justifyContent: 'space-between',
              fontFamily: mono, fontSize: 10, color: CX.inkSoft, letterSpacing: '0.08em',
            }}>
              <span>↑↓ navegar · ↵ ejecutar · ⌘. ayuda</span>
              <span style={{ fontStyle: 'italic', fontFamily: serif, fontSize: 11, color: CX.inkMid }}>
                f.s. · v0.4 · opforja
              </span>
            </div>
          </div>
        </div>
      )}
      rightPanel={<CodexEditorRightDimmed/>}
    />
  );
}

function CodexEditorLeftDimmed() {
  return (
    <div style={{ opacity: 0.3 }}>
      <CodexColHeader kicker="Índice" title="OPDs"/>
      <CodexTreeRow code="SD" label="sistema (raíz)" current marker="▸"/>
      <CodexTreeRow code="SD1" label="in-zoom" level={1} italic/>
    </div>
  );
}
function CodexEditorRightDimmed() {
  return (
    <div style={{ opacity: 0.3 }}>
      <CodexColHeader kicker="Marginalia · OPL" title="System Diagram" side="24"/>
      <div style={{ marginTop: 8 }}>
        <CodexOPLNote n="01" body={<><OplObj>System Name</OplObj> es informacional.</>}/>
        <CodexOPLNote n="02" body={<><OplObj>System Name</OplObj> es sistémico.</>}/>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// SCENE 3 — Multi-selección en SD1
// ───────────────────────────────────────────────────────────────────────────

function CodexMulti() {
  return (
    <CodexFrame
      breadcrumb={['sistema', 'system diagram', 'sd1']}
      meta="34 oraciones · sin guardar"
      footerRight="△ 3 sugerencias"
      leftTree={(
        <>
          <CodexColHeader kicker="Índice" title="OPDs"/>
          <div>
            <CodexTreeRow code="SD" label="sistema (raíz)" level={0}/>
            <CodexTreeRow code="SD1" label="in-zoom de o.06" current level={1} marker="▸"/>
            <CodexTreeRow label="nuevo OPD hijo" level={1} italic mark="+"/>
          </div>
          <div style={{ flex: 1 }}/>
          <div style={{
            padding: 14, background: CX.paperWarm, border: `1px solid ${CX.rule}`,
            fontFamily: serif, fontSize: 12, color: CX.inkMid, lineHeight: 1.5,
          }}>
            <div style={{
              fontFamily: mono, fontSize: 9, color: CX.crimson, letterSpacing: '0.16em',
              textTransform: 'uppercase', marginBottom: 6,
            }}>△ alta · profundidad</div>
            <span style={{ fontStyle: 'italic' }}>
              cada nivel de refinamiento debe agregar al menos un transformado, estado o enlace nuevo respecto del padre.
            </span>
          </div>
        </>
      )}
      canvas={(
        <CodexCanvas label="SD1 · in-zoom de Beneficiary Relevant Attribute" zoom="120%">
          <CodexSubDiagram selectedIds={['o.06.1', 'o.06.2', 'o.06.3']}/>
          <CodexSelectionAnnotation
            bottom={26}
            left={'50%'}
            mark="3"
            markBig
            actions={[
              { label: 'alinear' },
              { label: 'distribuir' },
              { label: 'partes' },
              { label: 'inspeccionar', primary: true },
              { label: 'eliminar', kbd: '⌫', danger: true },
            ]}
            meta="3 seleccionadas · partes de o.06 · profundidad justificada"
          />
        </CodexCanvas>
      )}
      rightPanel={(
        <>
          <CodexColHeader kicker="Marginalia · OPL" title="SD1" side="10"/>
          <div style={{
            fontFamily: sans, fontSize: 11, color: CX.inkMid, letterSpacing: '0.02em',
            display: 'flex', gap: 12, marginTop: -8,
          }}>
            <span style={{ fontStyle: 'italic', color: CX.crimson }}>filtrado · selección</span>
            <span>ver SD (24)</span>
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <CodexOPLNote n="01" body={<><OplObj>Beneficiary Relevant Attribute</OplObj> es informacional.</>}/>
            <CodexOPLNote n="02" body={<><OplObj>Beneficiary Relevant Attribute</OplObj> puede estar <OplState>problematic</OplState> o <OplState>satisfactory</OplState>.</>}/>
            <CodexOPLNote n="03" body={<>Estado <OplState>problematic</OplState> de <OplObj>Beneficiary Relevant Attribute</OplObj> es inicial.</>}/>
            <CodexOPLNote n="04" body={<>Estado <OplState>satisfactory</OplState> de <OplObj>Beneficiary Relevant Attribute</OplObj> es final.</>}/>
            <CodexOPLNote n="05" selected body={<><OplObj>Beneficiary Relevant Attribute</OplObj> consta de <OplObj>Attribute 1</OplObj>, <OplObj>Attribute 2</OplObj> y <OplObj>Attribute 3</OplObj>.</>}
              marginalia="profundidad justificada: agregar transformado, estado o enlace nuevo en cada nivel"
              severity="alta"/>
            <CodexOPLNote n="06" selected body={<><OplObj>Attribute 1</OplObj> es informacional.</>}/>
            <CodexOPLNote n="07" selected body={<><OplObj>Attribute 2</OplObj> es informacional.</>}/>
            <CodexOPLNote n="08" selected body={<><OplObj>Attribute 3</OplObj> es informacional.</>}/>
            <CodexOPLNote n="09" body={<><OplObj>Beneficiary Group</OplObj> exhibe <OplObj>Beneficiary Relevant Attribute</OplObj>.</>}/>
          </div>
        </>
      )}
    />
  );
}

// ───────────────────────────────────────────────────────────────────────────
// SCENE 4 — Inspector de objeto
// ───────────────────────────────────────────────────────────────────────────

function CodexInspector() {
  return (
    <CodexFrame
      meta="24 oraciones · 1 seleccionado"
      leftTree={(
        <>
          <CodexColHeader kicker="Índice" title="OPDs"/>
          <CodexTreeRow code="SD" label="sistema (raíz)" current marker="▸"/>
          <CodexTreeRow code="SD1" label="in-zoom de o.06" level={1} italic/>
          <CodexTreeRow label="nuevo OPD hijo" level={1} italic mark="+"/>
          <div style={{ flex: 1 }}/>
          <div style={{
            fontFamily: serif, fontStyle: 'italic', fontSize: 12,
            color: CX.inkMid, lineHeight: 1.5, borderTop: `1px solid ${CX.rule}`, paddingTop: 12,
          }}>
            «Cosas de igual clase comparten base cromática y tipográfica.»
            <div style={{ fontFamily: mono, fontStyle: 'normal', fontSize: 9, color: CX.inkSoft, letterSpacing: '0.1em', marginTop: 6 }}>
              visual V-209
            </div>
          </div>
        </>
      )}
      canvas={(
        <CodexCanvas label="SD · OPD raíz">
          <CodexInspectorDiagram/>
          <CodexSelectionAnnotation
            top={420}
            right={40}
            mark="※"
            actions={[
              { label: 'descomponer', kbd: '⌘D' },
              { label: 'desplegar' },
              { label: 'alias' },
              { label: 'imagen' },
              { label: 'inspector', primary: true },
            ]}
            meta="o.06 · objeto · informacional · sistémico"
          />
        </CodexCanvas>
      )}
      rightPanel={(
        <div style={{
          display: 'grid',
          gridTemplateRows: 'minmax(0, 1fr) auto minmax(0, 0.7fr)',
          height: '100%', gap: 0, margin: '-22px -24px -18px',
        }}>
          {/* INSPECTOR (top) */}
          <div style={{
            padding: '22px 24px 16px',
            display: 'flex', flexDirection: 'column', gap: 12,
            overflow: 'hidden',
          }}>
            <div>
              <div style={{
                fontFamily: mono, fontSize: 9.5, color: CX.crimson, letterSpacing: '0.18em', textTransform: 'uppercase',
              }}>o.06 · seleccionado</div>
              <div style={{
                fontFamily: serif, fontWeight: 700, fontSize: 22, marginTop: 6,
                lineHeight: 1.1, color: CX.ink, letterSpacing: '-0.01em',
              }}>Beneficiary Relevant Attribute</div>
              <div style={{
                marginTop: 4, fontFamily: serif, fontStyle: 'italic', fontSize: 11.5, color: CX.inkMid,
              }}>objeto · informacional · sistémico</div>
            </div>

            {/* Compact ficha: 5 secciones, todas más densas para dejar espacio a OPL abajo */}
            <CodexInspectInline k="esencia" options={['informacional', 'física']} active={0}/>
            <CodexInspectInline k="afiliación" options={['sistémica', 'ambiental']} active={0}/>

            <CodexInspectSection label="Valor" compact>
              <CodexInspectField k="tipo" v="texto" select/>
              <CodexInspectField k="unidad" v="—"/>
              <CodexInspectField k="valor actual" v="—" mono/>
              <CodexInspectField k="simulación" v="off"/>
            </CodexInspectSection>

            <CodexInspectSection label="Estados" compact right={<span style={{ fontFamily: sans, fontSize: 10.5, color: CX.ink, cursor: 'pointer' }}>+ nuevo</span>}>
              <CodexStateRow name="problematic" flags={['inicial', 'actual']}/>
              <CodexStateRow name="satisfactory" flags={['final']}/>
            </CodexInspectSection>

            <CodexInspectSection label="Otros" compact>
              <CodexInspectInline k="layout" options={['horizontal', 'vertical']} active={0}/>
              <CodexInspectField k="imagen" v="sin adjuntar" link="+ agregar"/>
            </CodexInspectSection>
          </div>

          {/* Hairline divider visual (más pesado para indicar split de paneles) */}
          <div style={{
            borderTop: `1px solid ${CX.ruleStrong}`,
            background: CX.paperWarm,
            padding: '6px 24px',
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            fontFamily: sans, fontSize: 9.5, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: CX.inkSoft,
          }}>
            <span>Marginalia · OPL</span>
            <span style={{
              fontFamily: mono, fontSize: 9, letterSpacing: '0.06em',
              textTransform: 'lowercase', color: CX.crimson, fontStyle: 'italic',
            }}>filtrado · o.06 · 4/24 ✕</span>
          </div>

          {/* OPL filtrado (bottom) */}
          <div style={{
            padding: '12px 24px 18px',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <CodexOPLNote n="13" body={<><OplObj>Beneficiary Relevant Attribute</OplObj> es informacional.</>}/>
              <CodexOPLNote n="14" body={<><OplObj>Beneficiary Relevant Attribute</OplObj> es sistémico.</>}/>
              <CodexOPLNote n="15" body={<><OplObj>Beneficiary Relevant Attribute</OplObj> puede estar <OplState>problematic</OplState> o <OplState>satisfactory</OplState>.</>}/>
              <CodexOPLNote n="22" body={<><OplProc>Main System Doing</OplProc> cambia <OplObj>Beneficiary Relevant Attribute</OplObj> de <OplState>problematic</OplState> a <OplState>satisfactory</OplState>.</>}/>
            </div>
            <div style={{
              paddingTop: 8, borderTop: `1px dotted ${CX.rule}`,
              fontFamily: sans, fontSize: 10.5, color: CX.inkMid,
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span style={{ cursor: 'pointer', fontStyle: 'italic', fontFamily: serif, fontSize: 11.5 }}>limpiar filtro</span>
              <span style={{ cursor: 'pointer' }}>copiar · html</span>
            </div>
          </div>
        </div>
      )}
    />
  );
}

function CodexInspectSection({ label, children, right, compact }) {
  return (
    <div style={{ paddingTop: compact ? 8 : 12, borderTop: `1px solid ${CX.rule}` }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: compact ? 3 : 6,
      }}>
        <div style={{
          fontFamily: sans, fontSize: 9.5, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: CX.inkSoft,
        }}>{label}</div>
        {right}
      </div>
      {children}
    </div>
  );
}

function CodexInspectField({ k, v, select, mono: useMono, link }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '4px 0',
      fontFamily: serif, fontSize: 12.5, color: CX.ink,
    }}>
      <span style={{ fontStyle: 'italic', color: CX.inkMid }}>{k}</span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{
          fontFamily: useMono ? mono : serif, fontSize: useMono ? 11 : 12.5,
          color: v === '—' || v === 'off' || v === 'sin adjuntar' ? CX.inkSoft : CX.ink,
        }}>{v}{select && <span style={{ color: CX.inkSoft, marginLeft: 6 }}>▾</span>}</span>
        {link && (
          <span style={{ fontFamily: sans, fontSize: 10.5, color: CX.ink, cursor: 'pointer' }}>{link}</span>
        )}
      </span>
    </div>
  );
}

function CodexInspectInline({ k, options, active }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '5px 0',
      fontFamily: serif, fontSize: 13, color: CX.ink,
    }}>
      <span style={{ fontStyle: 'italic', color: CX.inkMid }}>{k}</span>
      <span style={{ display: 'flex', gap: 10 }}>
        {options.map((o, i) => (
          <React.Fragment key={o}>
            {i > 0 && <span style={{ color: CX.inkFaint }}>·</span>}
            <span style={{
              color: i === active ? CX.ink : CX.inkSoft,
              fontWeight: i === active ? 600 : 400,
              borderBottom: i === active ? `1px solid ${CX.ink}` : 'none',
              cursor: 'pointer',
            }}>{o}</span>
          </React.Fragment>
        ))}
      </span>
    </div>
  );
}

function CodexStateRow({ name, flags }) {
  const ALL_FLAGS = [
    ['inicial', false], ['final', false], ['actual', false], ['por defecto', false], ['duración', false], ['suprimir', true],
  ];
  return (
    <div style={{
      padding: '8px 0', borderBottom: `1px dotted ${CX.rule}`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6,
        fontFamily: serif, fontSize: 14, color: CX.ink,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: 4, background: CX.stateFill, border: `1px solid ${CX.olive}`, display: 'inline-block',
        }}/>
        <span style={{ fontStyle: 'italic', flex: 1 }}>{name}</span>
      </div>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8,
        fontFamily: sans, fontSize: 11, letterSpacing: '0.02em',
      }}>
        {ALL_FLAGS.map(([f, danger]) => {
          const on = flags.includes(f);
          return (
            <span key={f} style={{
              cursor: 'pointer',
              color: on ? CX.ink : (danger ? CX.crimson : CX.inkSoft),
              fontWeight: on ? 600 : 400,
              borderBottom: on ? `1px solid ${CX.ink}` : 'none',
              fontStyle: danger && !on ? 'italic' : 'normal',
            }}>{f}</span>
          );
        })}
      </div>
    </div>
  );
}

window.CodexEditor = CodexEditor;
window.CodexCommand = CodexCommand;
window.CodexMulti = CodexMulti;
window.CodexInspector = CodexInspector;
