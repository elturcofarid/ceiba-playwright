import { expect } from '@playwright/test';
import { When, Then } from '../support/fixtures';

Then('(que )el botón {string} está visible', async ({ basePage }, nombre: string) => {
  await expect(basePage.boton(nombre)).toBeVisible();
});

Then('(que )el botón {string} está habilitado', async ({ basePage }, nombre: string) => {
  const boton = basePage.boton(nombre);
  await expect(boton).toBeEnabled();
  await expect(boton).not.toHaveAttribute('data-disabled', 'true');
});

Then('(que )el botón {string} está deshabilitado', async ({ basePage }, nombre: string) => {
  const boton = basePage.boton(nombre);
  await expect(boton).toBeDisabled();
  await expect(boton).toHaveAttribute('data-disabled', 'true');
});

When('hago clic en el botón {string}', async ({ basePage }, nombre: string) => {
  await basePage.boton(nombre).click();
});
