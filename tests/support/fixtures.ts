import { test as base, createBdd } from 'playwright-bdd';
import { BasePage } from '../pages/BasePage';
import { Cabecera } from '../pages/componentes/Cabecera';
import { ListadoPacientesPage } from '../pages/pacientes/ListadoPacientesPage';

type Paginas = {
  basePage: BasePage;
  cabecera: Cabecera;
  listadoPacientes: ListadoPacientesPage;
};

// Punto único de extensión: cada Page Object se registra aquí como fixture.
export const test = base.extend<Paginas>({
  basePage: async ({ page }, use) => use(new BasePage(page)),
  cabecera: async ({ page }, use) => use(new Cabecera(page)),
  listadoPacientes: async ({ page }, use) => use(new ListadoPacientesPage(page)),
});

export const { Given, When, Then } = createBdd(test);
