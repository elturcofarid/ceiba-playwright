import { Page } from '@playwright/test';
import { Cabecera } from './componentes/Cabecera';

// Comportamiento compartido por todas las páginas de la app (ya autenticada)
export class BasePage {
  readonly cabecera: Cabecera;

  constructor(readonly page: Page) {
    this.cabecera = new Cabecera(page);
  }

  boton(nombre: string) {
    return this.page.getByRole('button', { name: nombre, exact: true });
  }
}
