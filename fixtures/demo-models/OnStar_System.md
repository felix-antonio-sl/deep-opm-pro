# OnStar System

**Propósito:** Rescatar a un conductor en peligro mediante el sistema OnStar y un asesor.

**Descripción:** Ejemplo clasico OPM del estandar ISO 19450. Agregacion estructural (OnStar System consta de GPS, Cellular Network, VCIM, OnStar Console), agente (OnStar Advisor), instrumento (OnStar System) y efecto sobre Driver.

**OPDs:** SD
**Entidades:** 8
**Enlaces:** 7
**Estados:** 0

## OPL-ES

```
SD del sistema OnStar System.
Driver es un objeto fisico y ambiental.
OnStar System es un objeto fisico.
GPS es un objeto fisico.
Cellular Network es un objeto fisico.
VCIM es un objeto fisico.
OnStar Console es un objeto fisico.
Driver Rescuing es un proceso fisico.
OnStar Advisor es un objeto fisico.
OnStar System consta de GPS.
OnStar System consta de Cellular Network.
OnStar System consta de VCIM.
OnStar System consta de OnStar Console.
OnStar Advisor manipula Driver Rescuing.
Driver Rescuing usa OnStar System.
Driver Rescuing afecta Driver.
```