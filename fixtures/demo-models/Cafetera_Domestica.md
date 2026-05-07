# Cafetera Domestica

**Propósito:** Transformar cafe molido y agua en cafe hecho, mediante una persona y una cafetera.

**Descripción:** Ejemplo canonico del wizard SD del manual metodologico OPM. Modelo minimo con consumo, produccion, agente e instrumento.

**OPDs:** SD
**Entidades:** 6
**Enlaces:** 5
**Estados:** 0

## OPL-ES

```
SD del sistema Cafetera Domestica.
Persona es un objeto fisico y ambiental.
Cafe Molido es un objeto fisico.
Agua es un objeto fisico.
Cafetera es un objeto fisico.
Hacer Cafe es un proceso fisico.
Cafe Hecho es un objeto fisico.
Hacer Cafe consume Cafe Molido.
Hacer Cafe consume Agua.
Hacer Cafe produce Cafe Hecho.
Persona manipula Hacer Cafe.
Hacer Cafe usa Cafetera.
```