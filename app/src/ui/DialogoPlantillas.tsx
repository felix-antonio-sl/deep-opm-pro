import { useEffect, useMemo, useState } from "preact/hooks";
import templateIcon from "../../../assets/svg/template.svg";
import type { PlantillaIndice } from "../modelo/tipos";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";
import { Breadcrumb } from "./panelCarpetas/Breadcrumb";

/**
 * Catálogo de plantillas privadas con búsqueda y breadcrumb raíz.
 * Citas SSOT: [Met §8.8] plantillas crean copias locales desacopladas;
 * [JOYAS §1] reuso de icono/estilo visual canónico; [V-52]/[V-123].
 * Evidencia OPCloud: opm-extracted/src/app/dialogs/templates-import/templates-import.ts.
 */

const RAIZ_PLANTILLAS = [{ id: "plantillas-root", nombre: "Mis plantillas", padreId: null, creadoEn: 0 }];

export function DialogoPlantillas() {
  const abierto = useOpmStore((s) => s.dialogoPlantillasAbierto);
  const cerrar = useOpmStore((s) => s.cerrarDialogoPlantillas);
  const abrirGuardar = useOpmStore((s) => s.abrirDialogoGuardarPlantilla);
  const insertar = useOpmStore((s) => s.insertarPlantillaEnOpdActivo);
  const plantillas = useOpmStore((s) => s.plantillasGuardadas);
  const [query, setQuery] = useState("");
  const [queryFiltrada, setQueryFiltrada] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => setQueryFiltrada(query.trim().toLocaleLowerCase("es-CL")), 200);
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (abierto) setQuery("");
  }, [abierto]);

  const filtradas = useMemo(() => filtrarPlantillas(plantillas, queryFiltrada), [plantillas, queryFiltrada]);

  return (
    <Dialogo
      open={abierto}
      title="Plantillas"
      onCancel={cerrar}
      size="lg"
      actions={(
        <>
          <button type="button" style={style.secondaryButton} onClick={cerrar}>Cancelar</button>
          <button type="button" style={style.primaryButton} onClick={() => { cerrar(); abrirGuardar(); }}>Guardar nueva</button>
        </>
      )}
    >
      <div style={style.body} data-testid="dialogo-plantillas">
        <div style={style.header}>
          <Breadcrumb
            segmentos={RAIZ_PLANTILLAS}
            carpetaActualId="plantillas-root"
            onNavegarBreadcrumb={() => undefined}
          />
          <input
            aria-label="Buscar plantillas"
            placeholder="Buscar"
            style={style.search}
            value={query}
            onInput={(event) => setQuery(event.currentTarget.value)}
            data-testid="buscar-plantillas"
          />
        </div>
        {filtradas.length === 0 ? (
          <p style={style.empty} data-testid="plantillas-vacio">
            Sin plantillas en esta carpeta. Crea una desde Menú principal → Guardar como plantilla.
          </p>
        ) : (
          <div style={style.grid}>
            {filtradas.map((plantilla) => (
              <article key={plantilla.id} style={style.tile} data-testid="plantilla-tile">
                <img src={templateIcon} alt="" style={style.icon} />
                <div style={style.tileBody}>
                  <strong style={style.name}>{plantilla.nombre}</strong>
                  {plantilla.descripcion ? <span style={style.description}>{plantilla.descripcion}</span> : null}
                  <span style={style.meta}>Privado · {fechaCorta(plantilla.actualizadoEn)}</span>
                </div>
                <button
                  type="button"
                  style={style.insertButton}
                  onClick={() => insertar(plantilla.id)}
                  data-testid="insertar-plantilla"
                >
                  Insertar
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </Dialogo>
  );
}

function filtrarPlantillas(plantillas: PlantillaIndice[], query: string): PlantillaIndice[] {
  if (!query) return plantillas;
  return plantillas.filter((plantilla) => {
    const texto = `${plantilla.nombre} ${plantilla.descripcion ?? ""}`.toLocaleLowerCase("es-CL");
    return texto.includes(query);
  });
}

function fechaCorta(value: string): string {
  const fecha = new Date(value);
  if (Number.isNaN(fecha.getTime())) return value;
  return fecha.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const style = {
  // Ancho gobernado por `<Dialogo size="lg">` (ronda 12.1, [JOYAS §2]).
  body: { display: "grid", gap: "14px" },
  header: { display: "grid", gridTemplateColumns: "1fr 220px", gap: "12px", alignItems: "center" },
  search: { height: "34px", border: "1px solid #b9c5d4", borderRadius: "4px", padding: "0 10px", fontSize: "13px", fontWeight: 600 },
  grid: { display: "grid", gap: "8px", maxHeight: "420px", overflow: "auto" },
  tile: { display: "grid", gridTemplateColumns: "38px minmax(0, 1fr) auto", gap: "10px", alignItems: "center", minHeight: "68px", padding: "10px", border: "1px solid #d9e0ea", borderRadius: "6px", background: "#ffffff" },
  icon: { width: "30px", height: "34px" },
  tileBody: { display: "grid", minWidth: 0, gap: "3px" },
  name: { color: "#1f2937", fontSize: "13px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  description: { color: "#475467", fontSize: "12px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  meta: { color: "#667085", fontSize: "11px", fontWeight: 700 },
  empty: { margin: 0, padding: "20px 8px", color: "#667085", fontSize: "13px", fontWeight: 700, textAlign: "center" },
  insertButton: { height: "32px", padding: "0 12px", border: "1px solid #586D8C", borderRadius: "4px", background: "#586D8C", color: "#ffffff", cursor: "pointer", fontSize: "12px", fontWeight: 700 },
  primaryButton: { height: "34px", padding: "0 14px", border: "1px solid #586D8C", borderRadius: "4px", background: "#586D8C", color: "#ffffff", cursor: "pointer", fontSize: "13px", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 14px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#ffffff", color: "#475467", cursor: "pointer", fontSize: "13px", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
