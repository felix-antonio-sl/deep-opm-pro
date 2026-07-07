/** Auto-nombre de un apunte recién nacido: «Apunte AAAA-MM-DD» (fecha local).
 *  La identidad real es el id; los nombres PUEDEN repetirse (el CLI exige id
 *  ante ambigüedad). Sin sufijo de máquina. Ref: diseño §3. */
export function nombreApunteDeFecha(fecha: Date): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `Apunte ${y}-${m}-${d}`;
}
