# language: es
@pacientes @tabla
Característica: Tabla de resultados y ordenamiento

  Antecedentes:
    Dado que estoy en el listado de pacientes

  @TC-PAC-015
  Escenario: Renderizado del estado vacío inicial
    Entonces la tabla de pacientes muestra el estado vacío
    Y la celda de estado vacío ocupa 4 columnas

  @TC-PAC-016
  Esquema del escenario: Ordenamiento por la columna <columna>
    Dado que la columna "<columna>" es ordenable
    Cuando ordeno por la columna "<columna>"
    Entonces la columna "<columna>" queda ordenada

    Ejemplos:
      | columna   |
      | Documento |
      | Nombre    |

  @TC-PAC-017
  Escenario: Formato de fecha de nacimiento y estado
    Cuando busco con el campo de búsqueda vacío
    Entonces los pacientes listados tienen fecha de nacimiento y estado con formato válido
