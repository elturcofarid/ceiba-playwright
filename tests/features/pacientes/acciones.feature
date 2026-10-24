# language: es
@pacientes @acciones
Característica: Selección de paciente y estado de las acciones
  Como usuario de caja
  Quiero que las acciones sobre un paciente se habiliten solo cuando corresponde
  Para evitar modificar datos sin haber elegido un paciente

  Antecedentes:
    Dado que estoy en el listado de pacientes

  @TC-PAC-007
  Escenario: Estado inicial del botón Modificar datos
    Entonces el botón "Modificar datos" está deshabilitado

  @TC-PAC-008
  Escenario: Habilitación tras seleccionar un paciente
    Dado que el botón "Modificar datos" está deshabilitado
    Cuando selecciono el primer paciente del selector
    Entonces el botón "Modificar datos" está habilitado

  @TC-PAC-009
  Escenario: Deshabilitación al limpiar la selección
    Dado que selecciono el primer paciente del selector
    Y el botón "Modificar datos" está habilitado
    Cuando limpio la selección del paciente
    Entonces el botón "Modificar datos" está deshabilitado

  @TC-PAC-010
  Escenario: Abrir la modificación de datos de un paciente
    Dado que selecciono el primer paciente del selector
    Y el botón "Modificar datos" está habilitado
    Cuando hago clic en el botón "Modificar datos"
    Entonces se abre la vista de modificación del paciente

  @TC-PAC-011
  Escenario: Abrir la actualización de documento
    Dado que el botón "Actualizar documento" está habilitado
    Cuando hago clic en el botón "Actualizar documento"
    Entonces se abre el diálogo de actualizar documento
