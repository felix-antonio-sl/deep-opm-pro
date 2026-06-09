# Aserción de reproducibilidad / golden-harness (H2)

Reemplaza el ritual `md5sum` manual del **dogfood byte-idéntico** (regenerar el
bundle y comprobar que coincide con el artefacto versionado) por un comando
**pass/fail** con diagnóstico. Implementa el pedido upstream **H2**
(`hd-opm/docs/memorias-aprendizajes/solicitud-upstream-observabilidad-agente-2026-06-09.md`).

## Uso (CLI)

```bash
cd app
bun run verify:reproducible --proto  <md>   --golden <bundle.json> [--max-diff N]   # regenera y compara
bun run verify:reproducible --modelo <json> --golden <bundle.json> [--max-diff N]   # compara dos JSON
```

- `--proto`: compila (`compilarProto`) + emite (`emitirBundle`, `lanzarEnError:false`, sin sello) y compara contra el golden. Reporta además el `protoHash` actual (trazabilidad).
- `--modelo`: compara un JSON ya emitido contra el golden.
- Exit: `0` byte-idéntico · `1` difiere · `2` uso.

Salida en `FAIL`: qué **componente del sello** cambió (si ambos bundles lo portan) y las **primeras N líneas divergentes** con su número — la causa y el dónde, sin volcar el bundle completo.

## API de librería (`src/autoria/reproducibilidad.ts`, kernel puro)

```ts
compararReproducibilidad(jsonGenerado, jsonEsperado, { maxDiferencias? }) → ResultadoReproducibilidad
verificarReproducibilidad(autor, jsonEsperado, { maxDiferencias?, bundle? }) → ResultadoReproducibilidad
```

`ResultadoReproducibilidad`: `{ byteIdentico, bytesGenerado, bytesEsperado, procedencia?, primerasDiferencias[] }`.
- **Veredicto**: `byteIdentico = jsonGenerado === jsonEsperado` (string exacto = byte-identidad).
- **Causa**: `procedencia` (vía `compararProcedencia`) nombra el componente del sello divergente — solo cuando **ambos** bundles portan `modelo.procedencia`.
- **Dónde**: `primerasDiferencias` (hasta `maxDiferencias`, def. 5), cada una con nº de línea.

## Relación con H1 y límites

- **H1 ↔ H2**: el `procedencia.json` que emite `render:headless` (H1) es la **semilla** de la trazabilidad; H2 compone con el mismo sello (`autoria/procedencia.ts`).
- **Byte-identidad** es string exacto (lo que versiona el dogfood). El CLI `--proto` emite **sin sello** por defecto para ser byte-idéntico con goldens estándar (p. ej. el bundle HODOM de hd-opm, que no porta procedencia).
- **No toca** `procedencia.ts` ni el contrato del bundle: es una capa de verificación encima.

## Verificación

```bash
bun run verify:reproducible:smoke   # genera golden, PASS al regenerar, FAIL+líneas al alterar (sin navegador, rápido)
```
