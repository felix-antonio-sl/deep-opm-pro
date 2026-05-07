# SD Async

**Propósito:** Procesamiento asincrono con descomposicion en 3 sub-procesos independientes.

**Descripción:** SD con in-zooming asincrono: Main System Doing se descompone en First/Second/Third Processing. Sub-procesos invocados secuencialmente pero sin dependencia de estado (asincrono).

**OPDs:** SD, SD1
**Entidades:** 9
**Enlaces:** 10
**Estados:** 0

## OPL-ES

```
SD del sistema SD Async.
System Name es un objeto informatico.
System Handler es un objeto fisico.
System Tool Set es un objeto informatico.
Main Input es un objeto informatico.
Main System Doing es un proceso fisico.
Main Output es un objeto informatico.
System Name exhibe Main System Doing.
System Handler manipula Main System Doing.
Main System Doing consume Main Input.
Main System Doing usa System Name.
Main System Doing usa System Tool Set.
Main System Doing produce Main Output.

SD1 del sistema SD Async.
Main System Doing es un proceso fisico.
System Name es un objeto informatico.
System Handler es un objeto fisico.
Main Input es un objeto informatico.
System Tool Set es un objeto informatico.
Main Output es un objeto informatico.
First Processing es un proceso fisico.
Second Processing es un proceso fisico.
Third Processing es un proceso fisico.
System Name exhibe Main System Doing.
System Handler manipula Main System Doing.
First Processing consume Main Input.
Main System Doing usa System Name.
Main System Doing usa System Tool Set.
Third Processing produce Main Output.
First Processing invoca Second Processing.
Second Processing invoca Third Processing.
```