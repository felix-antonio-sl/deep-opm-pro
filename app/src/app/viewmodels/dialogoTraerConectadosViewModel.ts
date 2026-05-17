import { useMemo } from "preact/hooks";
import { FAMILIAS_TRAER, tiposDeFamilia, type FamiliaTraerConectados } from "../../canvas/reglasTraer";
import { entidadIdDeExtremo } from "../../modelo/extremos";
import type { Id, Modelo } from "../../modelo/tipos";
import { useOpmStore } from "../../store";

export type ConteosFamiliaTraer = Record<FamiliaTraerConectados, number>;

function conteosVacios(): ConteosFamiliaTraer {
  return {
    "procedural-habilitador": 0,
    "procedural-transformador": 0,
    direccional: 0,
    estructural: 0,
  };
}

export function contarCandidatosTraer(modelo: Modelo, entidadFocoId: Id, familia: FamiliaTraerConectados): number {
  const tipos = new Set(tiposDeFamilia(familia));
  if (tipos.size === 0) return 0;
  let total = 0;
  for (const enlace of Object.values(modelo.enlaces)) {
    if (!tipos.has(enlace.tipo)) continue;
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (origen === entidadFocoId || destino === entidadFocoId) total += 1;
  }
  return total;
}

function resolverEntidadFoco(modelo: Modelo, seleccionId: Id | null, seleccionados: readonly Id[]): Id | null {
  const candidatos = [seleccionId, ...seleccionados];
  for (const id of candidatos) {
    if (id && modelo.entidades[id]) return id;
  }
  return null;
}

export function useDialogoTraerConectadosViewModel() {
  const abierto = useOpmStore((s) => s.dialogoTraerConectadosAbierto);
  const cerrar = useOpmStore((s) => s.cerrarDialogoTraerConectados);
  const traer = useOpmStore((s) => s.traerConectadosSeleccionado);
  const ultima = useOpmStore((s) => s.indice.preferenciasUi?.traerConectadosUltimo);
  const modelo = useOpmStore((s) => s.modelo);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);

  const entidadFocoId = useMemo(
    () => resolverEntidadFoco(modelo, seleccionId, seleccionados),
    [modelo, seleccionId, seleccionados],
  );

  const conteos = useMemo(() => {
    const out = conteosVacios();
    if (!entidadFocoId) return out;
    for (const familia of FAMILIAS_TRAER) {
      out[familia] = contarCandidatosTraer(modelo, entidadFocoId, familia);
    }
    return out;
  }, [modelo, entidadFocoId]);

  return {
    abierto,
    cerrar,
    traer,
    ultima,
    conteos,
  };
}

export type DialogoTraerConectadosViewModel = ReturnType<typeof useDialogoTraerConectadosViewModel>;
