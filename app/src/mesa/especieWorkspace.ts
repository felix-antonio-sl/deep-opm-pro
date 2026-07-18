import { especieDe, type Especie } from "../persistencia/especie";
import {
  marcarApunte,
  marcarBiblioteca,
  type WorkspaceIndice,
} from "../persistencia/workspace";
import type { VersionResumen } from "../modelo/tipos";

/**
 * Cruza el índice de workspace (`GET /__deep-opm/workspace` →
 * `{ indice: { modelos: [...] } }`) por id de modelo, decodificando la especie
 * de cada entry con `especieDe` (mismo decode que usa el resto del repo —
 * NO se re-deriva aquí). Existe porque el record de Postgres (`GET
 * /modelos/:id`) NO persiste `esApunte`/`esBiblioteca`: esos dos flags viven
 * HOY solo en el índice de workspace, así que quien necesite la especie real
 * de un modelo (CLI `mesa`, guard biblioteca de `evaluarPush`, etc.) debe
 * cruzar contra este índice en vez de leerla del record del modelo.
 *
 * Pura (sin red, sin CLI): un modelo AUSENTE del índice simplemente no
 * aparece en el mapa devuelto — el llamador decide el default ("modelo").
 */
export function mapaEspeciePorModelo(
  indice: { modelos: Array<{ id: string; esApunte?: boolean; esBiblioteca?: boolean }> },
): Map<string, Especie> {
  const mapa = new Map<string, Especie>();
  for (const modelo of indice.modelos) {
    mapa.set(modelo.id, especieDe(modelo));
  }
  return mapa;
}

/** Registra una especie mutable y limpia flags fantasma incompatibles. */
export function establecerEspecieCreada(
  indice: WorkspaceIndice,
  modeloId: string,
  especie: Exclude<Especie, "biblioteca">,
): WorkspaceIndice {
  const conEntrada = indice.modelos.some((modelo) => modelo.id === modeloId)
    ? indice
    : {
        ...indice,
        modelos: [...indice.modelos, { id: modeloId, carpetaId: null }],
      };
  if (especie === "apunte") return marcarApunte(conEntrada, modeloId, true);
  return marcarBiblioteca(marcarApunte(conEntrada, modeloId, false), modeloId, false);
}

/** Refleja en el índice la revisión confirmada por la misma transacción. */
export function registrarVersionEnWorkspace(
  indice: WorkspaceIndice,
  modeloId: string,
  version: VersionResumen,
): WorkspaceIndice {
  const entrada = indice.modelos.find((modelo) => modelo.id === modeloId) ?? {
    id: modeloId,
    carpetaId: null,
  };
  const versiones = [
    version,
    ...(entrada.versiones ?? []).filter((item) => item.id !== version.id),
  ];
  return {
    ...indice,
    modelos: [
      ...indice.modelos.filter((modelo) => modelo.id !== modeloId),
      { ...entrada, versiones },
    ],
    recientes: [
      modeloId,
      ...indice.recientes.filter((id) => id !== modeloId),
    ].slice(0, 10),
  };
}
