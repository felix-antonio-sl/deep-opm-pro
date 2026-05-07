# Ejemplo organizacional

**Propósito:** Transformar necesidades de clientes en servicios entregados, mediante personas como agentes y Agente IA + Organizacion como instrumentos.

**Descripción:** Ejemplo organizacional canonico: SD con 8 entidades (7+1), wizard completo. Agente IA como instrumento (no agente: OPM §agente requiere entidad fisica). SD1 con in-zooming a 3 sub-procesos encadenados por invocacion.

**OPDs:** SD, SD1
**Entidades:** 11
**Enlaces:** 12
**Estados:** 0

## OPL-ES

```
SD del sistema Ejemplo organizacional.
Cliente es un objeto fisico y ambiental.
Necesidad es un objeto informatico.
Persona es un objeto fisico y ambiental.
Agente IA es un objeto informatico.
Organizacion es un objeto informatico.
Servicio es un objeto informatico.
Aprendizaje es un objeto informatico.
Entregar Valor es un proceso fisico.
Entregar Valor consume Necesidad.
Entregar Valor produce Servicio.
Entregar Valor produce Aprendizaje.
Persona manipula Entregar Valor.
Entregar Valor usa Agente IA.
Entregar Valor usa Organizacion.
Entregar Valor afecta Cliente.

SD1 del sistema Ejemplo organizacional.
Entregar Valor es un proceso fisico.
Necesidad es un objeto informatico.
Servicio es un objeto informatico.
Aprendizaje es un objeto informatico.
Persona es un objeto fisico y ambiental.
Agente IA es un objeto informatico.
Organizacion es un objeto informatico.
Cliente es un objeto fisico y ambiental.
Analizar Necesidad es un proceso fisico.
Disenar Solucion es un proceso fisico.
Validar Entrega es un proceso fisico.
Analizar Necesidad consume Necesidad.
Validar Entrega produce Servicio.
Validar Entrega produce Aprendizaje.
Persona manipula Entregar Valor.
Entregar Valor usa Agente IA.
Entregar Valor usa Organizacion.
Entregar Valor afecta Cliente.
Analizar Necesidad invoca Disenar Solucion.
Disenar Solucion invoca Validar Entrega.
```