# language: es
@pacientes @busqueda
Característica: Búsqueda y filtrado de pacientes
  Como usuario de caja
  Quiero buscar pacientes por documento o nombre
  Para encontrar rápidamente su información

  Antecedentes:
    Dado que estoy en el listado de pacientes

  @TC-PAC-001
  Escenario: Búsqueda por documento exacto
    Cuando busco el paciente "1004356836"
    Entonces veo un paciente con "1004356836" en los resultados

  @TC-PAC-002
  Escenario: Búsqueda por coincidencia de nombre
    Cuando busco el paciente "Prueba automatizada"
    Entonces veo un paciente con "Prueba automatizada" en los resultados

  @TC-PAC-003
  Escenario: Búsqueda sin resultados
    Cuando busco el paciente "NO_EXISTE_99999999"
    Entonces la tabla de pacientes muestra el estado vacío

  @TC-PAC-004
  Escenario: Búsqueda con campo vacío
    Cuando busco con el campo de búsqueda vacío
    Entonces la tabla de pacientes está visible

  @TC-PAC-005
  Escenario: Límite de caracteres en el buscador
    Cuando escribo 80 caracteres en el buscador
    Entonces el buscador declara un máximo de 60 caracteres
    Y el buscador contiene 60 caracteres

  @TC-PAC-006 @seguridad
  Escenario: Inyección de caracteres especiales en el buscador
    Cuando busco el paciente "<script>alert('xss')</script>' OR '1'='1"
    Entonces el listado de pacientes permanece estable
