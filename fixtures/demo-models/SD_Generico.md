# SD Generico

**Propósito:** Plantilla generica de SD con agente, instrumentos, consumo, produccion y efecto con cambio de estado.

**Descripción:** Plantilla wizard canonica: System Name exhibe Main System Doing, System Handler + Tool Set como enablers, Main Input consumido, Main Output producido, Beneficiary con atributo de estado problematic→satisfactory.

**OPDs:** SD
**Entidades:** 8
**Enlaces:** 8
**Estados:** 2

## OPL-ES

```
SD del sistema SD Generico.
System Name es un objeto informatico.
System Handler es un objeto fisico.
System Tool Set es un objeto informatico.
Main Input es un objeto informatico.
Beneficiary Group es un objeto fisico.
Beneficiary Attribute es un objeto informatico.
Main System Doing es un proceso fisico.
Main Output es un objeto informatico.
Beneficiary Attribute puede estar en problematic o satisfactory.
Beneficiary Attribute esta inicialmente en problematic.
Beneficiary Attribute esta terminalmente en satisfactory.
System Name exhibe Main System Doing.
Beneficiary Group exhibe Beneficiary Attribute.
Main System Doing cambia Beneficiary Attribute de problematic a satisfactory.
System Handler manipula Main System Doing.
Main System Doing consume Main Input.
Main System Doing usa System Name.
Main System Doing usa System Tool Set.
Main System Doing produce Main Output.
```