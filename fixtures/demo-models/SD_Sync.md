# SD Sync

**Propósito:** Replicar el sandbox SD and SD1 synchronous process.

**Descripción:** SD raiz con atributo beneficiario y SD1 sincronico con First/Second/Third/Last Processing, Temp Object y Main I/O Output.

**OPDs:** SD, SD1
**Entidades:** 17
**Enlaces:** 35
**Estados:** 2

## OPL-ES

```
SD del sistema SD Sync.
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

SD1 del sistema SD Sync.
Main System Doing es un proceso fisico.
First Processing es un proceso fisico.
Second Processing es un proceso fisico.
Third Processing es un proceso fisico.
System Name es un objeto informatico.
System Handler es un objeto fisico.
System Tool Set es un objeto informatico.
Main Input es un objeto informatico.
Beneficiary Relevant Attribute es un objeto informatico.
Main Output es un objeto informatico.
Last Processing es un proceso fisico.
SD1 Main Input es un objeto informatico.
Main I/O Output es un objeto informatico.
I/O Object Relevant Attribute es un objeto informatico.
Temp Object es un objeto informatico.
SD1 Main Output es un objeto informatico.
Beneficiary Relevant Attribute puede estar en problematic o satisfactory.
Beneficiary Relevant Attribute esta inicialmente en problematic.
Beneficiary Relevant Attribute esta terminalmente en satisfactory.
System Name exhibe Main System Doing.
Main I/O Output exhibe I/O Object Relevant Attribute.
First Processing cambia Beneficiary Relevant Attribute de problematic a satisfactory.
Second Processing cambia Beneficiary Relevant Attribute de problematic a satisfactory.
Third Processing cambia Beneficiary Relevant Attribute de problematic a satisfactory.
System Handler manipula First Processing.
System Handler manipula Second Processing.
System Handler manipula Third Processing.
First Processing consume Main Input.
First Processing usa System Name.
Second Processing usa System Name.
Third Processing usa System Name.
First Processing usa System Tool Set.
Second Processing usa System Tool Set.
Third Processing usa System Tool Set.
Third Processing produce Main Output.
First Processing consume SD1 Main Input.
First Processing afecta I/O Object Relevant Attribute.
First Processing produce Temp Object.
Second Processing consume Temp Object.
Second Processing afecta I/O Object Relevant Attribute.
Third Processing afecta I/O Object Relevant Attribute.
Third Processing afecta Temp Object.
Last Processing consume Temp Object.
Last Processing produce SD1 Main Output.
First Processing invoca Second Processing.
Second Processing invoca Third Processing.
Third Processing invoca Last Processing.
```