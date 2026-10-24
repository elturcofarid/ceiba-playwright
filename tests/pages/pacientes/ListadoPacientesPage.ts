import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ListadoPacientesPage extends BasePage {
  static readonly URL = '/v/pacientes.listado';
  static readonly MENSAJE_VACIO = 'No hay pacientes que coincidan';

  readonly titulo;
  readonly buscador;
  readonly botonBuscar;
  readonly botonNuevoPaciente;
  readonly selectorPaciente;
  readonly opcionesPaciente;
  readonly tabla;
  readonly cuerpoTabla;
  readonly celdaVacia;
  readonly vistaModificarPaciente;
  readonly dialogoActualizarDocumento;
  readonly formularioNuevoPaciente;

  constructor(page: Page) {
    super(page);
    this.titulo = page.getByRole('heading', { name: 'Pacientes', level: 1 });
    this.buscador = page.getByRole('textbox', { name: 'Buscar por documento o nombre' });
    this.botonBuscar = this.boton('Buscar');
    this.botonNuevoPaciente = this.boton('Nuevo paciente');
    this.selectorPaciente = page.getByRole('button', { name: /Paciente a modificar/i });
    this.opcionesPaciente = page.getByRole('listbox');
    this.tabla = page.getByRole('grid', { name: 'Pacientes' });
    this.cuerpoTabla = this.tabla.locator('tbody');
    this.celdaVacia = this.cuerpoTabla.getByRole('rowheader');
    this.vistaModificarPaciente = page.getByRole('region', { name: 'Identificación' });
    this.dialogoActualizarDocumento = page.getByRole('region', { name: 'El documento anterior se conserva en el historial' });
    this.formularioNuevoPaciente = page.getByRole('dialog')
      .or(page.getByRole('heading', { name: /Nuevo paciente|Registrar paciente/i }));
  }

  async abrir() {
    await this.page.goto(ListadoPacientesPage.URL);
    await expect(this.titulo).toBeVisible();
  }

  // ---------------------------------------------------------------------------
  // Búsqueda
  // ---------------------------------------------------------------------------

  async buscar(criterio: string) {
    await this.buscador.fill(criterio);
    await this.botonBuscar.click();
  }

  async buscarSinCriterio() {
    await this.buscador.clear();
    await this.botonBuscar.click();
  }

  // ---------------------------------------------------------------------------
  // Tabla
  // ---------------------------------------------------------------------------

  filasCon(texto: string) {
    return this.tabla.getByRole('row').filter({ hasText: texto });
  }

  // Solo filas con celdas de datos: excluye la cabecera y la fila de estado vacío
  primeraFilaConDatos() {
    return this.tabla.getByRole('row').filter({ has: this.page.getByRole('gridcell') }).first();
  }

  columna(nombre: string) {
    return this.page.getByRole('columnheader', { name: nombre });
  }

  async ordenarPor(columna: string) {
    await this.columna(columna).click();
  }

  // ---------------------------------------------------------------------------
  // Selector de paciente
  // ---------------------------------------------------------------------------

  async abrirSelectorPaciente() {
    await this.selectorPaciente.click();
    await expect(this.opcionesPaciente).toBeVisible();
  }

  async seleccionarPrimerPaciente() {
    await this.abrirSelectorPaciente();
    await this.opcionesPaciente.getByRole('option').first().click();
  }

  opcionLimpiarSeleccion() {
    return this.opcionesPaciente.getByRole('option', { name: /Seleccione|Limpiar/i });
  }
}
