# Prestamo Bibliotecario

**Propósito:** Transformar un libro disponible en libro prestado, mediante un bibliotecario que registra la operacion en una boleta para un socio externo.

**Descripción:** Ancla Beta1 pedagogica multi-OPD. Biblioteca se despliega en SD-Biblioteca (Sucursal Central, Sucursal Barrial, Catalogo Digital). Procesar Prestamo se descompone en SD1 (Validar Socio -> Registrar Prestamo -> Entregar Libro). Estados Libro: disponible/prestado/atrasado.

**OPDs:** SD, SD1, SD2
**Entidades:** 12
**Enlaces:** 21
**Estados:** 3

## OPL-ES

```
SD del sistema Prestamo Bibliotecario.
Socio es un objeto fisico y ambiental.
Libro es un objeto fisico.
Bibliotecario es un objeto fisico y ambiental.
Biblioteca es un objeto fisico.
Procesar Prestamo es un proceso fisico.
Boleta de Prestamo es un objeto fisico.
Libro puede estar en disponible o prestado o atrasado.
Libro esta inicialmente en disponible.
Libro esta terminalmente en prestado.
Bibliotecario manipula Procesar Prestamo.
Procesar Prestamo usa Biblioteca.
Procesar Prestamo consume Socio.
Procesar Prestamo produce Boleta de Prestamo.
Procesar Prestamo cambia Libro de disponible a prestado.

SD1 del sistema Prestamo Bibliotecario.
Biblioteca es un objeto fisico.
Sucursal Central es un objeto fisico.
Sucursal Barrial es un objeto fisico.
Catalogo Digital es un objeto fisico.
Biblioteca consta de Sucursal Central.
Biblioteca consta de Sucursal Barrial.
Biblioteca consta de Catalogo Digital.

SD2 del sistema Prestamo Bibliotecario.
Procesar Prestamo es un proceso fisico.
Bibliotecario es un objeto fisico y ambiental.
Biblioteca es un objeto fisico.
Socio es un objeto fisico y ambiental.
Boleta de Prestamo es un objeto fisico.
Libro es un objeto fisico.
Validar Socio es un proceso fisico.
Registrar Prestamo es un proceso fisico.
Entregar Libro es un proceso fisico.
Libro puede estar en disponible o prestado o atrasado.
Libro esta inicialmente en disponible.
Libro esta terminalmente en prestado.
Bibliotecario manipula Validar Socio.
Bibliotecario manipula Registrar Prestamo.
Bibliotecario manipula Entregar Libro.
Validar Socio usa Biblioteca.
Registrar Prestamo usa Biblioteca.
Entregar Libro usa Biblioteca.
Validar Socio consume Socio.
Entregar Libro produce Boleta de Prestamo.
Validar Socio cambia Libro de disponible a prestado.
Registrar Prestamo cambia Libro de disponible a prestado.
Entregar Libro cambia Libro de disponible a prestado.
Validar Socio invoca Registrar Prestamo.
Registrar Prestamo invoca Entregar Libro.
```