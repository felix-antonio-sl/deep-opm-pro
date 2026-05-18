# System Diagram

**Propósito:** Representar el System Diagram generico publicado en OPCloud sandbox.

**Descripción:** Replica funcional de fixtures/system-diagram: proceso central, input, output, handler, tool set y atributo beneficiario con estados problematic/satisfactory.

**OPDs:** SD
**Entidades:** 8
**Enlaces:** 8
**Estados:** 2

## OPL-ES

```
SD del sistema System Diagram.
System Name es un objeto informatico.
System Handler es un objeto fisico.
System Tool Set es un objeto informatico.
Main Input es un objeto informatico.
Beneficiary Group es un objeto fisico.
Beneficiary Relevant Attribute es un objeto informatico.
Main System Doing es un proceso fisico.
Main Output es un objeto informatico.
Beneficiary Relevant Attribute puede estar en problematic o satisfactory.
Beneficiary Relevant Attribute esta inicialmente en problematic.
Beneficiary Relevant Attribute esta terminalmente en satisfactory.
System Name exhibe Main System Doing.
Beneficiary Group exhibe Beneficiary Relevant Attribute.
Main System Doing cambia Beneficiary Relevant Attribute de problematic a satisfactory.
System Handler manipula Main System Doing.
Main System Doing consume Main Input.
Main System Doing usa System Name.
Main System Doing usa System Tool Set.
Main System Doing produce Main Output.
```