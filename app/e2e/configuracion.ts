/** Coordenada exclusiva del harness; ningún dato o servicio de producción. */
export function puertoE2e(entrada: string | undefined): number {
 if(entrada===undefined)return 8787;
 if(!/^\d+$/.test(entrada))throw new Error('OPFORJA_E2E_PUERTO debe ser decimal entero entre1y65535');
 const n=Number(entrada);if(!Number.isSafeInteger(n)||n<1||n>65535)throw new Error('OPFORJA_E2E_PUERTO fuera de1..65535');
 return n;
}
export const puerto=puertoE2e(process.env.OPFORJA_E2E_PUERTO);
export const BASE=`http://127.0.0.1:${puerto}`;
