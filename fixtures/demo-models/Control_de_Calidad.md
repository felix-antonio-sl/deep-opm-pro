# Control de Calidad

**Propósito:** Transformar un producto no-inspeccionado en aprobado, mediante un inspector que usa un estandar de calidad.

**Descripción:** SD con estados en objeto transformee (no-inspeccionado / aprobado) y efecto a nivel entidad. Dos instrumentos.

**OPDs:** SD
**Entidades:** 5
**Enlaces:** 4
**Estados:** 2

## OPL-ES

```
SD del sistema Control de Calidad.
Producto es un objeto fisico y ambiental.
Inspector es un objeto fisico y ambiental.
Estandar de Calidad es un objeto fisico.
Inspeccionar es un proceso fisico.
Sistema de Inspeccion es un objeto fisico.
Producto puede estar en no-inspeccionado o aprobado.
Producto esta inicialmente en no-inspeccionado.
Producto esta terminalmente en aprobado.
Inspeccionar cambia Producto de no-inspeccionado a aprobado.
Inspector manipula Inspeccionar.
Inspeccionar usa Estandar de Calidad.
Inspeccionar usa Sistema de Inspeccion.
```