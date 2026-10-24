import { expect } from '@playwright/test';
import { Given, When, Then } from '../../support/fixtures';

Then('se abre el formulario de nuevo paciente', async ({ listadoPacientes }) => {
  await expect(listadoPacientes.formularioNuevoPaciente).toBeVisible();
});

Given('que el panel de ayuda está cerrado', async ({ cabecera }) => {
  await expect(cabecera.botonAyuda).toHaveAttribute('aria-expanded', 'false');
});

Then('el panel de ayuda está abierto', async ({ cabecera }) => {
  await expect(cabecera.botonAyuda).toHaveAttribute('aria-expanded', 'true');
  await expect(cabecera.panelAyuda).toBeVisible();
});

When('cierro sesión', async ({ cabecera }) => {
  await cabecera.cerrarSesion();
});

Then('soy redirigido al login', async ({ page }) => {
  await expect(page).toHaveURL(/login|auth/i);
});
