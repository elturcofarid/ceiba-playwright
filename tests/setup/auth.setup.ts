import { test as setup, expect } from '@playwright/test';
import { ROLES, authFile, credentials } from '../support/auth/roles';
import { LoginPage } from '../pages/LoginPage';

for (const role of ROLES) {
  setup(`login como ${role}`, async ({ page }) => {
    const { email, password } = credentials(role);

    // La app redirige al formulario de Keycloak (identidad.*) si no hay sesión
    await page.goto('/');
    await new LoginPage(page).ingresar(email, password);

    // Esperar a volver a la app antes de guardar la sesión
    await expect(page).not.toHaveURL("/v/pacientes.listado/");

    await page.context().storageState({ path: authFile(role) });
  });
}
