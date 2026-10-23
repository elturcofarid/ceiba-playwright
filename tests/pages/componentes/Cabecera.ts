import { expect, Page } from '@playwright/test';

export class Cabecera {
  readonly botonAyuda;
  // Contenedor referenciado por aria-controls del botón Ayuda
  readonly panelAyuda;
  readonly botonSalir;

  constructor(readonly page: Page) {
    this.botonAyuda = page.getByRole('button', { name: 'Ayuda', exact: true });
    this.panelAyuda = page.getByRole('complementary', { name: 'Ayuda' });
    this.botonSalir = page.getByRole('button', { name: 'Cerrar la ayuda', exact: true });
  }

  async cerrarSesion() {
    await expect(this.botonSalir).toBeVisible();
    await this.botonSalir.click();
  }
}
