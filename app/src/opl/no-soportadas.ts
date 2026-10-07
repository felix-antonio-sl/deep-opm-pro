import type { CodigoOpl } from './analizar';
interface LimiteOpl { readonly patron: RegExp; readonly codigo: CodigoOpl; readonly regla: string; readonly registro: string; }
/** Reconocimiento de límites: la prosa no se degrada a un grafo plausible. */
export const NO_CANONIZADAS: readonly LimiteOpl[] = [
    { patron: /\*[^*]+\* es persistente\.|\*\*[^*]+\*\* es transitori[oa]\./u, codigo: 'non-canonical', regla: 'R-OPL-DESC-1', registro: 'B-16' },
    { patron: /puede ser .*`|\binicia e invoca\b|\bpuede generarse\b|\binvoca .* si .* ocurre\b/u, codigo: 'non-canonical', regla: 'R-MOD-INPUT-2', registro: 'B-16' },
    { patron: /(?:exactamente uno de|al menos uno de).*\bPr=/u, codigo: 'unsupported-canonical', regla: 'R-FAN-PR-1', registro: 'B-16' },
    { patron: /\bPr=|\bFANLOCAL\b|\bfan local\b|\b(?:XOR|OR|AND)\b/u, codigo: 'non-canonical', regla: 'R-CONF-6', registro: 'B-16' },
    { patron: /\binicia .* (?:ocurre si|de lo contrario)|\bestá en .* afecta .* de lo contrario/u, codigo: 'non-canonical', regla: 'AP-28', registro: 'B-16' }
];
export const NO_SOPORTADAS: readonly LimiteOpl[] = [
    { patron: /\bpuede ser\b/u, codigo: 'unsupported-canonical', regla: 'R-OPL-RF-5', registro: 'B-01' },
    { patron: /\*\*[^*]+\*\* se descompone en\b/u, codigo: 'unsupported-canonical', regla: 'R-OPL-CX-4', registro: 'B-02' },
    { patron: /\b(?:consumen|generan|afectan|requieren|manejan|invocan)\b/u, codigo: 'unsupported-canonical', regla: 'DR-12', registro: 'B-09' },
    { patron: /\b(?:exactamente un(?:a)?|al menos dos|dos o más|\d+(?: a \d+)?) \*\*/u, codigo: 'unsupported-canonical', regla: 'R-§18-PART-1', registro: 'B-10' },
    { patron: /\bse despliega por (?:partes|especialización|instanciación|rasgos) en\b/u, codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-11' },
    { patron: /^Por ruta .* (?:maneja|requiere|afecta|invoca|cambia)\b/u, codigo: 'unsupported-canonical', regla: 'R-OPL-RUTA-2', registro: 'B-07' },
    { patron: /\bes (?:persistente|transitoria|transitorio)\.$/u, codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-16' },
    { patron: /\bes de tipo\b|\bvaría de\b|\bdonde\b|\ben \{|\b(?:se refina por|se pliega|se recompone|referencia el sub-modelo|vista de sub-modelo|referencia externa)\b/u, codigo: 'unsupported-canonical', regla: 'R-§19-SIM-2', registro: 'B-16' },
    // «X tiene un **Y** opcional» (atributo opcional) no se soporta; «X tiene un opcional **Y**» es un etiquetado con «?».
    { patron: /\btiene (?:un|una) \*\*[^*]+\*\* opcional\b|\b(?:después de|no maneja|no requiere|no consume|no genera|no afecta|no cambia|ordenados por)\b|\[etiqueta:/u, codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-16' },
    { patron: /^\*[^*]+\* (?:consume|genera|afecta|requiere|cambia) .*?(?:, | [ye] )(?:consume|genera|afecta|requiere|cambia) \*\*/u, codigo: 'unsupported-canonical', regla: 'R-§18-EXT-1', registro: 'B-16' },
    { patron: /\bexcede .* y .*es menor que\b/u, codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-16' }
];
