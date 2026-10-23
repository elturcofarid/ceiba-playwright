import { expect } from '@playwright/test';
import { Given, When, Then } from '../../support/fixtures';
import { ListadoPacientesPage } from '../../pages/pacientes/ListadoPacientesPage';

const { MENSAJE_VACIO } = ListadoPacientesPage;

Given('que estoy en el listado de pacientes', async ({ listadoPacientes }) => {
  await listadoPacientes.abrir();
});

// ---------------------------------------------------------------------------
// Búsqueda
// ---------------------------------------------------------------------------

When('busco el paciente {string}', async ({ listadoPacientes }, criterio: string) => {
  await listadoPacientes.buscar(criterio);
});

When('busco con el campo de búsqueda vacío', async ({ listadoPacientes }) => {
  await listadoPacientes.buscarSinCriterio();
});

When('escribo {int} caracteres en el buscador', async ({ listadoPacientes }, cantidad: number) => {
  await listadoPacientes.buscador.fill('A'.repeat(cantidad));
});

Then('el buscador declara un máximo de {int} caracteres', async ({ listadoPacientes }, maximo: number) => {
  await expect(listadoPacientes.buscador).toHaveAttribute('maxlength', String(maximo));
});

Then('el buscador contiene {int} caracteres', async ({ listadoPacientes }, cantidad: number) => {
  await expect(listadoPacientes.buscador).toHaveValue('A'.repeat(cantidad));
});

Then('veo un paciente con {string} en los resultados', async ({ listadoPacientes }, texto: string) => {
  await expect(listadoPacientes.filasCon(texto).first()).toBeVisible();
});

Then('el listado de pacientes permanece estable', async ({ listadoPacientes }) => {
  await expect(listadoPacientes.titulo).toBeVisible();
  await expect(listadoPacientes.tabla).toBeVisible();
});

// ---------------------------------------------------------------------------
// Tabla
// ---------------------------------------------------------------------------

Then('la tabla de pacientes está visible', async ({ listadoPacientes }) => {
  await expect(listadoPacientes.tabla).toBeVisible();
});

Then('la tabla de pacientes muestra el estado vacío', async ({ listadoPacientes }) => {
  await expect(listadoPacientes.cuerpoTabla).toHaveAttribute('data-empty', 'true');
  await expect(listadoPacientes.cuerpoTabla).toContainText(MENSAJE_VACIO);
});

Then('la celda de estado vacío ocupa {int} columnas', async ({ listadoPacientes }, columnas: number) => {
  await expect(listadoPacientes.celdaVacia).toHaveAttribute('colspan', String(columnas));
  await expect(listadoPacientes.celdaVacia).toContainText(MENSAJE_VACIO);
});

Given('que la columna {string} es ordenable', async ({ listadoPacientes }, columna: string) => {
  // React Aria marca las columnas ordenables con data-react-aria-pressable="true"
  await expect(listadoPacientes.columna(columna)).toHaveAttribute('data-react-aria-pressable', 'true');
});

When('ordeno por la columna {string}', async ({ listadoPacientes }, columna: string) => {
  await listadoPacientes.ordenarPor(columna);
});

Then('la columna {string} queda ordenada', async ({ listadoPacientes }, columna: string) => {
  await expect(listadoPacientes.columna(columna)).toHaveAttribute('aria-sort', /ascending|descending/i);
});

Then('los pacientes listados tienen fecha de nacimiento y estado con formato válido', async ({ listadoPacientes, $test }) => {
  const filaConDatos = listadoPacientes.primeraFilaConDatos();

  $test.skip(await filaConDatos.count() === 0, 'No hay pacientes con datos para validar el formato');

  const celdas = filaConDatos.getByRole('gridcell');

  // Fecha en columna 3 (AAAA-MM-DD o DD/MM/AAAA)
  expect(await celdas.nth(2).innerText()).toMatch(/^(\d{2}[/-]\d{2}[/-]\d{4}|\d{4}[/-]\d{2}[/-]\d{2})$/);

  // Estado en columna 4 (valores controlados)
  expect(['Activo', 'Inactivo', 'Pendiente']).toContain((await celdas.nth(3).innerText()).trim());
});
