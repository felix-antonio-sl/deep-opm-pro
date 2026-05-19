# SD Async

**Propósito:** Replicar el sandbox SD and SD1 asynchronous process.

**Descripción:** SD raiz con atributo beneficiario y SD1 asincronico unfolded con First/Second/Third/Forth Processing, Main I/O Output y atributo I/O.

**OPDs:** SD, SD1
**Entidades:** 14
**Enlaces:** 23
**Estados:** 2

## OPL-ES

```
SD del sistema SD Async.
System Name es un objeto informatico.
System Handler es un objeto fisico.
System Tool Set es un objeto informatico.
Main Input es un objeto informatico.
Beneficiary Group es un objeto fisico.
Beneficiary Relevant Attribute es un objeto informatico.
Main System Doing es un proceso informatico.
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

SD1 del sistema SD Async.
Main System Doing es un proceso informatico.
First Processing es un proceso informatico.
Second Processing es un proceso informatico.
Third Processing es un proceso informatico.
Forth Processing es un proceso informatico.
Main I/O Output es un objeto informatico.
I/O Object's Relevant Attribute es un objeto informatico.
System Name es un objeto informatico.
System Handler es un objeto fisico.
Main Input es un objeto informatico.
System Tool Set es un objeto informatico.
Main Output es un objeto informatico.
Main System Doing consta de First Processing.
Main System Doing consta de Second Processing.
Main System Doing consta de Third Processing.
Main System Doing consta de Forth Processing.
System Name consta de System Tool Set.
System Name exhibe Main System Doing.
Main I/O Output exhibe I/O Object's Relevant Attribute.
System Handler manipula Main System Doing.
Main System Doing consume Main Input.
Main System Doing usa System Name.
Main System Doing usa System Tool Set.
First Processing afecta I/O Object's Relevant Attribute.
Second Processing afecta I/O Object's Relevant Attribute.
Third Processing afecta I/O Object's Relevant Attribute.
Forth Processing produce Main Output.
```