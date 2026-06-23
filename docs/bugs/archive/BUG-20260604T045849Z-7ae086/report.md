# BUG-20260604T045849Z-7ae086

**Creado**: 2026-06-04T04:58:49.000Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: 2026-06-04 — `anchoCapsulaEstado` (render) pasa a 8 px/char (alineado a
entidad.ts) + margen de 6 px cuando el estado porta designación inicial/final;
`dimensionesConEstados` pasa el `Estado` completo para que la compensación participe.
Además se alineó la métrica de la librería de autoría (`autoria/layout.ts`:
`anchoPorTexto` con la misma fórmula de cápsula, cap 560→820) y se declaró el **alto
real** de cajas con estados (`altoPorTexto` = 100) para que el bundle nazca con las
dimensiones que el render produce (cierra la familia de solapes visuales V16-7).
Sellos: test de cápsula larga/designada en `composers/estados.test.ts` + test multi-fila
de drops en `autoria/layout.test.ts` (V16-5). Suite `bun test src`: 2020 pass.

## Texto

Las cápsulas (badges) de estado truncan la última letra del nombre en nombres largos:
`competente` se renderiza `competent`, `programada` → `programad`, `generado` → `generad`,
`despachado` → `despachad`, `consumido` → `consumid`, `ocupado` → `ocupad`. Confirmado **en
vivo** por el operador (no es artefacto del export PNG). El defecto golpea con más frecuencia
a los estados con designación inicial/final (stroke grueso).

## Evidencia (bundle HODOM v1.6, validación visual 2026-06-04)

- ≥8 ocurrencias en 37 OPDs: `competent[e]` (U5 Colaborador), `programad[a]` (M2.G Atención
  profesional programada; U9 Entrada de administración y Tipo de dosis), `generad[o]` (M2.G
  Residuo clínico), `tomad[a]` (M2.A.1 Muestra), `despachad[o]` (U2 Medicamento; U7 Hito de
  custodia), `consumid[o]` (U2 Insumo clínico), `ocupad[o]` (P2 Cupo HODOM).
- Capturas: `/home/felix/_TEMP_BORRAR/hodom-v16-opds-2026-06-04/` (05, 10, 16, 19, 23, 29,
  30, 37).
- Los nombres en el JSON están completos (verificado contra el bundle: `competente`, etc.).

## Causa raíz (localizada en código)

`anchoCapsulaEstado` (`app/src/render/jointjs/composers/estados.ts:27-31`) dimensiona la
cápsula con la heurística:

```ts
return Math.max(ESTADOS.minWidth, manual ?? 0, nombre.length * 7 + ESTADOS.paddingHorizontal * 2);
```

Dos subestimaciones combinadas:

1. **Factor 7 px/carácter** subestima la métrica real de la fuente serif en *cursiva* con que
   se renderizan los estados (los nombres de ENTIDAD usan factor 8: `entidad.ts:331`
   `nombre.length * 8 + 28`). En nombres ≥8-10 caracteres el déficit acumulado supera el ancho
   de un glifo → el clip del SVG recorta la última letra.
2. **El stroke grueso de la designación inicial/final no se compensa**: el borde más ancho
   consume píxeles interiores de la cápsula, agravando el recorte exactamente en los badges
   designados (patrón observado: casi todos los truncados son inicial/final).

## Fix sugerido

Mínimo: alinear el factor de estados al de entidades (≥8 px/char) + compensar el stroke de
designación (p. ej. `+ 2 * strokeDelta` cuando el estado es inicial/final). Robusto: medir con
`measureText` (canvas 2D, font itálica real) y cachear; misma utilidad para entidad y estado.
Sello: test visual/unitario con nombres de 10+ caracteres designados inicial/final
(`competente`, `programada`) verificando que el ancho calculado ≥ ancho medido del texto.

## Alcance

Solo render (la semántica y el OPL portan el nombre completo). Afecta legibilidad para el
lector institucional (SEREMI/DT) en todos los modelos con nombres de estado largos.
