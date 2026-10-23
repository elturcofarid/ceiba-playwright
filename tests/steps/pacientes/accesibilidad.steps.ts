import { expect, Locator } from '@playwright/test';
import { DataTable } from 'playwright-bdd';
import { When, Then } from '../../support/fixtures';
import { ListadoPacientesPage } from '../../pages/pacientes/ListadoPacientesPage';

// Nombres legibles usados en los .feature -> localizador del Page Object
const elementos: Record<string, (listado: ListadoPacientesPage) => Locator> = {
  'buscador': listado => listado.buscador,
  'selector de paciente': listado => listado.selectorPaciente,
  'botón Nuevo paciente': listado => listado.botonNuevoPaciente,
  'botón Buscar': listado => listado.botonBuscar,
};

function elemento(listado: ListadoPacientesPage, nombre: string) {
  const localizar = elementos[nombre];
  if (!localizar) throw new Error(`Elemento desconocido "${nombre}". Disponibles: ${Object.keys(elementos).join(', ')}`);
  return localizar(listado);
}

When('pongo el foco en el {string}', async ({ listadoPacientes }, nombre: string) => {
  const destino = elemento(listadoPacientes, nombre);
  await destino.focus();
  await expect(destino).toBeFocused();
});

Then('al presionar Tab el foco recorre en orden:', async ({ page, listadoPacientes }, tabla: DataTable) => {
  for (const [nombre] of tabla.raw()) {
    await page.keyboard.press('Tab');
    await expect(elemento(listadoPacientes, nombre)).toBeFocused();
  }
});

When('abro el selector de paciente con el teclado', async ({ page, listadoPacientes }) => {
  await listadoPacientes.selectorPaciente.focus();
  await page.keyboard.press('Enter');
  await expect(listadoPacientes.opcionesPaciente).toBeVisible();
});

When('elijo la siguiente opción con el teclado', async ({ page }) => {
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
});

Then('el selector de paciente se cierra', async ({ listadoPacientes }) => {
  await expect(listadoPacientes.opcionesPaciente).toBeHidden();
});
