# Comprar Pan

**Propósito:** Transformar dinero en pan mediante un cliente y un panadero que operan en la panaderia.

**Descripción:** Ancla Beta1 secundaria liviana. SD unico, 5 enlaces (dos agentes, un instrumento, consumo, resultado). Sin descomposicion ni estados; util para validar el catalogo simple sobre un modelo plano.

**OPDs:** SD
**Entidades:** 6
**Enlaces:** 5
**Estados:** 0

## OPL-ES

```
SD del sistema Comprar Pan.
Cliente es un objeto fisico y ambiental.
Dinero es un objeto fisico.
Panadero es un objeto fisico y ambiental.
Panaderia es un objeto fisico.
Comprar Pan es un proceso fisico.
Pan es un objeto fisico.
Cliente manipula Comprar Pan.
Panadero manipula Comprar Pan.
Comprar Pan usa Panaderia.
Comprar Pan consume Dinero.
Comprar Pan produce Pan.
```