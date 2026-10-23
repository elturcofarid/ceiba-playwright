# language: es
@pacientes @accesibilidad
Característica: Accesibilidad y navegación por teclado

  Antecedentes:
    Dado que estoy en el listado de pacientes

  @TC-PAC-018
  Escenario: Secuencia de tabulación
    Cuando pongo el foco en el "buscador"
    Entonces al presionar Tab el foco recorre en orden:
      | selector de paciente |
      | botón Nuevo paciente |
      | botón Buscar         |

  @TC-PAC-019
  Escenario: Control por teclado del selector de paciente
    Cuando abro el selector de paciente con el teclado
    Y elijo la siguiente opción con el teclado
    Entonces el selector de paciente se cierra
