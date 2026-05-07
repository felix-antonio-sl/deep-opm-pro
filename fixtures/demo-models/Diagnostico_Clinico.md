# Diagnostico Clinico

**Propósito:** Transformar un paciente no-diagnosticado en diagnosticado, mediante un medico y su historia clinica.

**Descripción:** SD canonico con estados (no-diagnosticado / diagnosticado) y efecto a nivel entidad. Dos instrumentos.

**OPDs:** SD
**Entidades:** 5
**Enlaces:** 4
**Estados:** 2

## OPL-ES

```
SD del sistema Diagnostico Clinico.
Medico es un objeto fisico y ambiental.
Paciente es un objeto fisico y ambiental.
Historia Clinica es un objeto fisico.
Sistema Clinico es un objeto fisico.
Diagnosticar es un proceso fisico.
Paciente puede estar en no-diagnosticado o diagnosticado.
Paciente esta inicialmente en no-diagnosticado.
Paciente esta terminalmente en diagnosticado.
Diagnosticar cambia Paciente de no-diagnosticado a diagnosticado.
Medico manipula Diagnosticar.
Diagnosticar usa Historia Clinica.
Diagnosticar usa Sistema Clinico.
```