# OPM Structure Meta Model

**Propósito:** Mostrar la estructura de OPM como modelo: OPD, OPL, constructos, cosas y enlaces.

**Descripción:** Equivalente kernel reducido de fixtures/opm-meta-model. Incluye SD raiz y despliegues de OPD Construct, Thing y Link para ejercitar arbol OPD y enlaces estructurales.

**OPDs:** SD, SD1, SD2, SD3
**Entidades:** 25
**Enlaces:** 24
**Estados:** 0

## OPL-ES

```
SD del sistema OPM Structure Meta Model.
OPM Model es un objeto informatico.
System es un objeto informatico.
OPD Set es un objeto informatico.
OPL Spec es un objeto informatico.
OPM Stereotype es un objeto informatico.
OPD es un objeto informatico.
OPL Paragraph es un objeto informatico.
OPD Construct es un objeto informatico.
OPL Sentence es un objeto informatico.
Link Set es un objeto informatico.
Link es un objeto informatico.
Thing Set es un objeto informatico.
Thing es un objeto informatico.
Name es un objeto informatico.
Phrase es un objeto informatico.
Reserved Phrase es un objeto informatico.
OPM Model exhibe System.
OPM Model consta de OPD Set.
OPM Model consta de OPL Spec.
OPM Model es de tipo OPM Stereotype.
OPD Set consta de OPD.
OPL Spec consta de OPL Paragraph.
OPL Paragraph consta de OPL Sentence.
OPD consta de OPD Construct.
OPD Construct exhibe OPL Sentence.
OPD Construct consta de Link Set.
OPD Construct consta de Thing Set.
Link Set consta de Link.
Thing Set consta de Thing.
Thing exhibe Name.
Phrase es de tipo Reserved Phrase.

SD1 del sistema OPM Structure Meta Model.
OPD Construct es un objeto informatico.
Construct Link Set es un objeto informatico.
Construct Thing Set es un objeto informatico.
Construct OPL Sentence es un objeto informatico.
OPD Construct consta de Construct Link Set.
OPD Construct consta de Construct Thing Set.
OPD Construct consta de Construct OPL Sentence.

SD2 del sistema OPM Structure Meta Model.
Thing es un objeto informatico.
Linked Thing es un objeto informatico.
OPM Object es un objeto informatico.
OPM Process es un objeto informatico.
Thing es de tipo Linked Thing.
Thing es de tipo OPM Object.
Thing es de tipo OPM Process.

SD3 del sistema OPM Structure Meta Model.
Link es un objeto informatico.
Source es un objeto informatico.
Connector es un objeto informatico.
Destination es un objeto informatico.
Link consta de Source.
Link consta de Connector.
Link consta de Destination.
```