# language: es
@pacientes @navegacion
Característica: Registro y navegación desde el listado de pacientes

  Antecedentes:
    Dado que estoy en el listado de pacientes

  @TC-PAC-012
  Escenario: Apertura de Nuevo paciente
    Dado que el botón "Nuevo paciente" está visible
    Cuando hago clic en el botón "Nuevo paciente"
    Entonces se abre el formulario de nuevo paciente

  @TC-PAC-013
  Escenario: Botón de Ayuda en la cabecera
    Dado que el panel de ayuda está cerrado
    Cuando hago clic en el botón "Ayuda"
    Entonces el panel de ayuda está abierto

  # Cerrar sesión puede invalidar en Keycloak la sesión compartida por los demás tests
  @TC-PAC-014 @logout
  Escenario: Cerrar sesión con el botón Salir
    Cuando cierro sesión
    Entonces soy redirigido al login
