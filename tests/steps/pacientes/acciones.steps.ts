import { expect } from '@playwright/test';
import { Given, When, Then } from '../../support/fixtures';

Given('(que )selecciono el primer paciente del selector', async ({ listadoPacientes }) => {
  await listadoPacientes.seleccionarPrimerPaciente();
});

When('limpio la selección del paciente', async ({ listadoPacientes, $test }) => {
  await listadoPacientes.abrirSelectorPaciente();
  const opcionVacia = listadoPacientes.opcionLimpiarSeleccion();

  $test.skip(await opcionVacia.count() === 0, 'El selector no ofrece una opción para limpiar la selección');

  await opcionVacia.click();
});

Then('se abre la vista de modificación del paciente', async ({ listadoPacientes }) => {
  await expect(listadoPacientes.vistaModificarPaciente).toBeVisible();
});

Then('se abre el diálogo de actualizar documento', async ({ listadoPacientes }) => {
  await expect(listadoPacientes.dialogoActualizarDocumento).toBeVisible();
});
