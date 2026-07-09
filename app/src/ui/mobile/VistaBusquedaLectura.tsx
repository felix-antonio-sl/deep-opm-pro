/**
 * VistaBusquedaLectura.tsx — Búsqueda normalizada multi-sección para mobile readonly.
 *
 * Motor: matching por inclusión normalizada (no fuzzy scoring).
 * Secciones: OPDs, Entidades, OPL, Issues (opcional).
 * Toggle diagnóstico: off por default, persistido en localStorage.
 */

import { useMemo, useState } from "preact/hooks";
import type { Modelo, Id } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import { generarOpl } from "../../opl/generar";
import { listarAvisosDiagnostico } from "../../modelo/diagnostico";
import { leerIncluirDiagnostico, guardarIncluirDiagnostico } from "./preferenciasMovil";
import { tokens } from "../tokens";

export type BusquedaHitClase = "opd" | "entidad" | "enlace" | "oracion-opl" | "issue";

export interface BusquedaHit {
  id: string;
  clase: BusquedaHitClase;
  titulo: string;
  subtitulo?: string;
  onClick: () => void;
}

interface Props {
  modelo: Modelo;
  opdActivoId: string;
  onSeleccionarEntidad: (id: Id) => void;
  onSeleccionarOpd: (id: Id) => void;
  onCerrar: () => void;
}

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function VistaBusquedaLectura({ modelo, opdActivoId, onSeleccionarEntidad, onSeleccionarOpd, onCerrar }: Props) {
  const [query, setQuery] = useState("");
  const [incluirDiagnostico, setIncluirDiagnostico] = useState(leerIncluirDiagnostico());
  // Especie del modelo en lectura: en un apunte el OPL emite placeholders
  // (excepción de apunte a R-ENT-2), igual que el panel de escritorio.
  const esApunte = useOpmStore((s) => s.indice.modelos.some((m) => m.id === modelo.id && m.esApunte === true));
  const q = normalizar(query.trim());

  const hits = useMemo(() => {
    const resultados: BusquedaHit[] = [];
    if (q.length === 0) return resultados;

    // OPDs
    for (const opd of Object.values(modelo.opds)) {
      if (normalizar(opd.nombre).includes(q)) {
        resultados.push({
          id: `opd-${opd.id}`,
          clase: "opd",
          titulo: opd.nombre,
          onClick: () => onSeleccionarOpd(opd.id),
        });
      }
    }

    // Entidades
    for (const entidad of Object.values(modelo.entidades)) {
      if (normalizar(entidad.nombre).includes(q)) {
        resultados.push({
          id: `entidad-${entidad.id}`,
          clase: "entidad",
          titulo: entidad.nombre,
          subtitulo: entidad.tipo === "proceso" ? "Proceso" : "Objeto",
          onClick: () => onSeleccionarEntidad(entidad.id),
        });
      }
    }

    // OPL (oraciones) — en un apunte emite también los placeholders (excepción
    // de apunte a R-ENT-2): la lectura móvil cuenta lo mismo que el panel.
    try {
      const lineas = generarOpl(modelo, opdActivoId, { esencia: "siempre", esApunte });
      for (let i = 0; i < lineas.length; i++) {
        const linea = lineas[i];
        if (!linea || !normalizar(linea).includes(q)) continue;
        resultados.push({
          id: `opl-${i}`,
          clase: "oracion-opl",
          titulo: linea.trim(),
          onClick: () => {}, // No-op por ahora: solo lectura
        });
      }
    } catch {
      // OPL puede fallar en modelos incompletos
    }

    // Issues (diagnóstico)
    if (incluirDiagnostico) {
      const avisos = listarAvisosDiagnostico(modelo, { tipo: "opd", opdId: opdActivoId });
      for (const aviso of avisos) {
        if (normalizar(aviso.mensaje).includes(q)) {
          resultados.push({
            id: `issue-${aviso.codigo}`,
            clase: "issue",
            titulo: aviso.mensaje,
            subtitulo: aviso.severidad,
            onClick: () => {},
          });
        }
      }
    }

    return resultados;
  }, [q, modelo, opdActivoId, incluirDiagnostico, esApunte, onSeleccionarEntidad, onSeleccionarOpd]);

  const toggleDiagnostico = () => {
    const nuevo = !incluirDiagnostico;
    setIncluirDiagnostico(nuevo);
    guardarIncluirDiagnostico(nuevo);
  };

  return (
    <div data-testid="mobile-busqueda-vista" style={style.container}>
      <div style={style.header}>
        <input
          data-testid="mobile-busqueda-input"
          type="search"
          placeholder="Buscar..."
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          style={style.input}
          autoFocus
        />
        <button type="button" onClick={onCerrar} style={style.cerrar}>✕</button>
      </div>
      <label style={style.toggle}>
        <input
          data-testid="mobile-busqueda-toggle-diagnostico-input"
          type="checkbox"
          checked={incluirDiagnostico}
          onChange={toggleDiagnostico}
        />
        <span data-testid="mobile-busqueda-toggle-diagnostico">Buscar también en diagnóstico</span>
      </label>
      <div style={style.resultados}>
        {hits.length === 0 && q.length > 0 ? (
          <p style={style.vacio}>Sin resultados</p>
        ) : (
          hits.map((hit) => (
            <button
              key={hit.id}
              data-testid="mobile-busqueda-hit"
              type="button"
              style={style.hit}
              onClick={() => { hit.onClick(); onCerrar(); }}
            >
              <span style={style.titulo}>{hit.titulo}</span>
              {hit.subtitulo ? <span style={style.subtitulo}>{hit.subtitulo}</span> : null}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

const style: Record<string, preact.JSX.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    background: tokens.colors.fondoApp,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: `${tokens.spacing.sm}px`,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
  },
  input: {
    flex: "1 1 0",
    minWidth: 0,
    padding: `${tokens.spacing.sm}px`,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
    borderRadius: 0,
    fontSize: `${tokens.typography.fs.fs13}px`,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
  },
  cerrar: {
    flex: "0 0 auto",
    padding: `${tokens.spacing.sm}px`,
    border: 0,
    background: "transparent",
    color: tokens.colors.inkSoft,
    cursor: "pointer",
    fontSize: `${tokens.typography.fs.fs14}px`,
  },
  toggle: {
    display: "flex",
    alignItems: "center",
    gap: `${tokens.spacing.sm}px`,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
    fontSize: `${tokens.typography.fs.fs11}px`,
    color: tokens.colors.inkSoft,
    cursor: "pointer",
  },
  resultados: {
    flex: "1 1 0",
    minWidth: 0,
    overflow: "auto",
    padding: `${tokens.spacing.sm}px 0`,
  },
  vacio: {
    padding: `${tokens.spacing.md}px`,
    textAlign: "center",
    color: tokens.colors.inkSoft,
    fontSize: `${tokens.typography.fs.fs13}px`,
  },
  hit: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    border: 0,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
    background: "transparent",
    cursor: "pointer",
    textAlign: "left",
    color: tokens.colors.ink,
  },
  titulo: {
    fontSize: `${tokens.typography.fs.fs13}px`,
    fontWeight: tokens.typography.weights.bold,
  },
  subtitulo: {
    fontSize: `${tokens.typography.fs.fs11}px`,
    color: tokens.colors.inkSoft,
  },
};
