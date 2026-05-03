---
titulo: "Modelo de datos canónico — referencia y reglas"
fecha: 2026-05-03
estado: "activo"
ssot_viva: "/home/felix/projects/deep-opm-pro/app/src/modelo/tipos.ts"
verificado_por: "tools/validate-hu.ts"
---

## 1. SSOT viva = código

El modelo de datos canónico **vive en código**, no en este documento. Este archivo refleja `app/src/modelo/tipos.ts`. El TypeScript es ejecutable y verificable; el documento es interpretación humana. Cuando ambos divergen, **manda el código**.

Cuando se actualice `tipos.ts`, este documento se regenera o sincroniza explícitamente. El linter (`tools/validate-hu.ts`) verifica que ninguna HU canónica use raíces fuera de las permitidas.

## 2. Tipos primitivos

```ts
export type Id = string;
export type TipoEntidad = "objeto" | "proceso";
export type Esencia = "informacional" | "fisica";
export type Afiliacion = "sistemica" | "ambiental";

export type TipoEnlace =
  | "agregacion"
  | "agente"
  | "instrumento"
  | "consumo"
  | "resultado"
  | "efecto"
  | "invocacion";
```

Cobertura actual: 7 tipos de enlace implementados. La SSOT lista 16 (`linkType.*` en JOYAS §12). Los faltantes son **propuesta** (no implementados): `exhibicion`, `generalizacion`, `clasificacion`, `etiquetado`, `unidirectional`, `bidirectional`, `overtime-exception`, `undertime-exception`, `self-invocation`.

## 3. Entidades canónicas

### 3.1 `Entidad`

Cosa OPM (objeto o proceso) con identidad propia, independiente de su manifestación visual.

```ts
export interface Entidad {
  id: Id;
  tipo: TipoEntidad;
  nombre: string;
  esencia: Esencia;
  afiliacion: Afiliacion;
}
```

| Campo | Tipo | Persistente | Significado |
|---|---|---|---|
| `entidad.id` | `Id` (UUID) | sí | Identificador único en el modelo. |
| `entidad.tipo` | `"objeto" \| "proceso"` | sí | Categoría OPM. |
| `entidad.nombre` | `string` | sí | Nombre legible. |
| `entidad.esencia` | `"informacional" \| "fisica"` | sí | Eje de esencia [V-1]. |
| `entidad.afiliacion` | `"sistemica" \| "ambiental"` | sí | Eje de afiliación [V-1]. |

Defectos al crear: `esencia = "informacional"`, `afiliacion = "sistemica"` [V-1].

### 3.2 `Apariencia`

Manifestación visual de una `Entidad` en un `Opd` específico. Una entidad puede tener múltiples apariencias (en distintos OPDs o como múltiples instancias visuales).

```ts
export interface Apariencia {
  id: Id;
  entidadId: Id;
  opdId: Id;
  x: number;
  y: number;
  width: number;
  height: number;
}
```

| Campo | Tipo | Persistente | Significado |
|---|---|---|---|
| `apariencia.id` | `Id` | sí | Identificador único de la apariencia. |
| `apariencia.entidadId` | `Id` | sí | Referencia a `entidad.id`. |
| `apariencia.opdId` | `Id` | sí | Referencia a `opd.id` donde aparece. |
| `apariencia.x` | `number` | sí | Coordenada horizontal en el canvas. |
| `apariencia.y` | `number` | sí | Coordenada vertical. |
| `apariencia.width` | `number` | sí | Ancho en píxeles (default 135 [JOYAS §2]). |
| `apariencia.height` | `number` | sí | Alto en píxeles (default 60 [JOYAS §2]). |

### 3.3 `Enlace`

Enlace semántico entre dos entidades.

```ts
export interface Enlace {
  id: Id;
  tipo: TipoEnlace;
  origenId: Id;
  destinoId: Id;
  etiqueta: string;
}
```

| Campo | Tipo | Persistente | Significado |
|---|---|---|---|
| `enlace.id` | `Id` | sí | Identificador único. |
| `enlace.tipo` | `TipoEnlace` | sí | Categoría OPM del enlace. |
| `enlace.origenId` | `Id` | sí | Referencia a `entidad.id` origen. |
| `enlace.destinoId` | `Id` | sí | Referencia a `entidad.id` destino. |
| `enlace.etiqueta` | `string` | sí | Etiqueta legible (vacía por defecto). |

### 3.4 `AparienciaEnlace`

Manifestación visual de un `Enlace` en un `Opd`.

```ts
export interface AparienciaEnlace {
  id: Id;
  enlaceId: Id;
  opdId: Id;
  vertices: Array<{ x: number; y: number }>;
}
```

| Campo | Tipo | Persistente | Significado |
|---|---|---|---|
| `aparienciaEnlace.id` | `Id` | sí | Identificador único. |
| `aparienciaEnlace.enlaceId` | `Id` | sí | Referencia a `enlace.id`. |
| `aparienciaEnlace.opdId` | `Id` | sí | OPD donde se manifiesta. |
| `aparienciaEnlace.vertices` | `Array<{x,y}>` | sí | Puntos de quiebre del trazado manhattan. |

### 3.5 `Opd`

Diagrama de cosas y enlaces. Un modelo tiene un OPD raíz (SD) y opcionales OPDs hijos generados por descomposición.

```ts
export interface Opd {
  id: Id;
  nombre: string;
  padreId: Id | null;
  apariencias: Record<Id, Apariencia>;
  enlaces: Record<Id, AparienciaEnlace>;
}
```

| Campo | Tipo | Persistente | Significado |
|---|---|---|---|
| `opd.id` | `Id` | sí | Identificador único. |
| `opd.nombre` | `string` | sí | Nombre del diagrama (ej. `SD`, `SD1`). |
| `opd.padreId` | `Id \| null` | sí | OPD padre en el árbol; `null` solo para el SD raíz. |
| `opd.apariencias` | `Record<Id, Apariencia>` | sí | Apariencias presentes en el OPD, indexadas por id. |
| `opd.enlaces` | `Record<Id, AparienciaEnlace>` | sí | Apariencias de enlace presentes. |

### 3.6 `Modelo`

Raíz del modelo persistido.

```ts
export interface Modelo {
  id: Id;
  nombre: string;
  opdRaizId: Id;
  opds: Record<Id, Opd>;
  entidades: Record<Id, Entidad>;
  enlaces: Record<Id, Enlace>;
  nextSeq: number;
}
```

| Campo | Tipo | Persistente | Significado |
|---|---|---|---|
| `modelo.id` | `Id` | sí | Identificador único del modelo. |
| `modelo.nombre` | `string` | sí | Nombre legible. |
| `modelo.opdRaizId` | `Id` | sí | Referencia al OPD raíz (SD). |
| `modelo.opds` | `Record<Id, Opd>` | sí | OPDs del modelo, indexados. |
| `modelo.entidades` | `Record<Id, Entidad>` | sí | Catálogo plano de entidades. |
| `modelo.enlaces` | `Record<Id, Enlace>` | sí | Catálogo plano de enlaces semánticos. |
| `modelo.nextSeq` | `number` | sí | Contador para nombres serializables (`Un Proceso 2`). |

## 4. Tipos auxiliares

```ts
export interface Posicion { x: number; y: number; }

export type Resultado<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
```

`Resultado<T>` es el tipo canónico de retorno de operaciones del kernel que pueden fallar (validaciones, mutaciones).

## 5. Propuestas (no implementadas en `tipos.ts`)

Las HU pueden citar campos en estas raíces, marcándolos `[propuesta]`. Cuando una HU `[propuesta]` se implemente, la propuesta debe migrar a `tipos.ts` antes o en el mismo PR.

### 5.1 `estado` `[propuesta]`

```ts
// PROPUESTA — no implementado
export interface Estado {
  id: Id;
  entidadId: Id; // entidad de tipo "objeto"
  nombre: string;
  designaciones: Array<"inicial" | "final" | "default" | "current">;
  duracion?: { min: number; nominal: number; max: number };
}
```

Razón: la SSOT [Glos 3.71a] define la designación de estado y [V-237] define `Current` como persistente.

### 5.2 `estereotipo` `[propuesta]`

```ts
// PROPUESTA — no implementado
export interface Estereotipo {
  id: Id;
  nombre: string;       // ej. "EmbeddedDeviceProperty"
  destino: "objeto" | "proceso" | "ambos";
  propiedades: Array<{ nombre: string; tipo: string }>;
  rangosPredefinidos?: Array<{ campo: string; rango: string }>;
}

export interface AplicacionEstereotipo {
  entidadId: Id;
  estereotipoId: Id;
  valores: Record<string, unknown>;
}
```

Razón: EPICA-A0 introduce mecanismo de extensión genérico.

### 5.3 `valueState` `[propuesta]`

```ts
// PROPUESTA — no implementado
export interface ValueState {
  entidadId: Id;       // objeto con slot de valor
  rangoSpec: string;   // ej. "[0, 100]"
  tipoPrimitivo: "number" | "integer" | "string" | "boolean" | "datetime";
  valorActual?: unknown;
}
```

Razón: EPICA-B3 define rangos y validación numérica como primitivas separadas del estado cualitativo [V-163, V-164].

## 6. Reglas de uso en HU

1. Toda HU canónica que toca el modelo declara los campos en `**Modelo de datos tocado:**`.
2. Solo se permiten raíces de §3 (implementadas) y §5 (propuestas marcadas).
3. Los campos se citan con backticks: `` `entidad.tipo` ``, `` `apariencia.x` ``.
4. La forma `cosa.*`, `thing.*`, `object.*`, `link.*`, `appearance.*` está prohibida y rechazada por el linter.
5. Cuando una HU introduce un campo nuevo en una raíz existente (ej. `entidad.descripcion`), lo declara como `[propuesta]` hasta que aparezca en `tipos.ts`.

## 7. Invariantes del modelo

- `apariencia.entidadId` debe referir una entidad existente en `modelo.entidades`.
- `apariencia.opdId` debe referir un OPD existente en `modelo.opds`.
- `enlace.origenId` y `enlace.destinoId` deben referir entidades existentes.
- `aparienciaEnlace.enlaceId` debe referir un enlace existente.
- `modelo.opdRaizId` debe referir un OPD existente.
- `opd.padreId` debe ser `null` para el SD raíz o referir un OPD existente sin formar ciclos.
- `modelo.nextSeq` se incrementa monotónicamente.
- Las claves de `opd.apariencias`, `opd.enlaces`, `modelo.opds`, `modelo.entidades`, `modelo.enlaces` coinciden con `id` del valor (índice consistente).

## 8. Defectos canónicos

| Operación | Defectos |
|---|---|
| Crear entidad (proceso u objeto) | `esencia = "informacional"`, `afiliacion = "sistemica"`, `nombre = "Un Proceso" \| "Un Objeto"` (con sufijo serial si colisiona). [V-1] |
| Crear apariencia | `width = 135`, `height = 60`. [JOYAS §2] |
| Crear enlace | `etiqueta = ""`. |
| Crear OPD raíz (SD) | `nombre = "SD"`, `padreId = null`. |
