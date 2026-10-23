import { Page } from '@playwright/test';

// Formulario de Keycloak (identidad.*) al que redirige la app si no hay sesión
export class LoginPage {
  readonly usuario;
  readonly password;
  readonly botonIngresar;

  constructor(readonly page: Page) {
    this.usuario = page.getByRole('textbox', { name: 'Username or email' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.botonIngresar = page.getByRole('button', { name: 'Sign In' });
  }

  async ingresar(email: string, password: string) {
    await this.usuario.fill(email);
    await this.password.fill(password);
    await this.botonIngresar.click();
  }
}
