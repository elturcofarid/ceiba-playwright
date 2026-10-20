import { test, expect } from '@playwright/test';

test.describe('Módulo de Pacientes - Suite Completa (TC-PAC-001 al TC-PAC-019)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/v/pacientes.listado');
    await expect(page.getByRole('heading', { name: 'Pacientes', level: 1 })).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // 1. BÚSQUEDA Y FILTRADO
  // ---------------------------------------------------------------------------

  test('TC-PAC-001: Búsqueda por documento exacto', async ({ page }) => {
    const docPrueba = '7601037';
    const input = page.getByRole('textbox', { name: 'Buscar por documento o nombre' });
    const botonBuscar = page.getByRole('button', { name: 'Buscar', exact: true });
    const tabla = page.getByRole('grid', { name: 'Pacientes' });

    await input.fill(docPrueba);
    await botonBuscar.click();

    const filaResultado = tabla.getByRole('row').filter({ hasText: docPrueba });
    await expect(filaResultado).toBeVisible();
  });

  test('TC-PAC-002: Búsqueda por coincidencia de nombre', async ({ page }) => {
    const nombrePrueba = 'Farid';
    const input = page.getByRole('textbox', { name: 'Buscar por documento o nombre' });
    const botonBuscar = page.getByRole('button', { name: 'Buscar', exact: true });
    const tabla = page.getByRole('grid', { name: 'Pacientes' });

    await input.fill(nombrePrueba);
    await botonBuscar.click();

    const filasCoincidentes = tabla.getByRole('row').filter({ hasText: nombrePrueba });
    await expect(filasCoincidentes.first()).toBeVisible();
  });

  test('TC-PAC-003: Búsqueda sin resultados', async ({ page }) => {
    const input = page.getByRole('textbox', { name: 'Buscar por documento o nombre' });
    const botonBuscar = page.getByRole('button', { name: 'Buscar', exact: true });
    const tabla = page.getByRole('grid', { name: 'Pacientes' });

    await input.fill('NO_EXISTE_99999999');
    await botonBuscar.click();

    // Valida presencia del mensaje de estado vacío o atributo data-empty
    const cuerpoTabla = tabla.locator('tbody');
    await expect(cuerpoTabla).toHaveAttribute('data-empty', 'true');
    await expect(cuerpoTabla).toContainText('Aún no hay pacientes registrados');
  });

  test('TC-PAC-004: Búsqueda con campo vacío', async ({ page }) => {
    const input = page.getByRole('textbox', { name: 'Buscar por documento o nombre' });
    const botonBuscar = page.getByRole('button', { name: 'Buscar', exact: true });
    const tabla = page.getByRole('grid', { name: 'Pacientes' });

    await input.clear();
    await botonBuscar.click();

    // Confirma que la tabla responde recargando registros o manteniendo el grid interactivo
    await expect(tabla).toBeVisible();
  });

  test('TC-PAC-005: Límite de caracteres en buscador (maxlength="60")', async ({ page }) => {
    const input = page.getByRole('textbox', { name: 'Buscar por documento o nombre' });

    await expect(input).toHaveAttribute('maxlength', '60');
    await input.fill('A'.repeat(80));
    await expect(input).toHaveValue('A'.repeat(60));
  });

  test('TC-PAC-006: Inyección de caracteres especiales en buscador', async ({ page }) => {
    const input = page.getByRole('textbox', { name: 'Buscar por documento o nombre' });
    const botonBuscar = page.getByRole('button', { name: 'Buscar', exact: true });

    // Escenario de inyección SQL / XSS básico
    const payload = "<script>alert('xss')</script>' OR '1'='1";
    await input.fill(payload);
    await botonBuscar.click();

    // La interfaz debe permanecer estable sin alertas no controladas ni fallos de renderizado
    await expect(page.getByRole('heading', { name: 'Pacientes', level: 1 })).toBeVisible();
    await expect(page.getByRole('grid', { name: 'Pacientes' })).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // 2. SELECCIÓN Y ESTADO DE ACCIONES
  // ---------------------------------------------------------------------------

  test('TC-PAC-007: Estado inicial del botón Modificar datos', async ({ page }) => {
    const botonModificar = page.getByRole('button', { name: 'Modificar datos' });

    await expect(botonModificar).toBeDisabled();
    await expect(botonModificar).toHaveAttribute('data-disabled', 'true');
  });

  test('TC-PAC-008: Habilitación tras selección en desplegable', async ({ page }) => {
    const botonSelector = page.getByRole('button', { name: /Paciente a modificar/i });
    const botonModificar = page.getByRole('button', { name: 'Modificar datos' });

    await expect(botonModificar).toBeDisabled();

    await botonSelector.click();
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();

    await listbox.getByRole('option').first().click();

    await expect(botonModificar).toBeEnabled();
    await expect(botonModificar).not.toHaveAttribute('data-disabled', 'true');
  });

  test('TC-PAC-009: Deshabilitación al limpiar selección', async ({ page }) => {
    const botonSelector = page.getByRole('button', { name: /Paciente a modificar/i });
    const botonModificar = page.getByRole('button', { name: 'Modificar datos' });

    // 1. Seleccionar paciente
    await botonSelector.click();
    const listbox = page.getByRole('listbox');
    await listbox.getByRole('option').first().click();
    await expect(botonModificar).toBeEnabled();

    // 2. Deseleccionar o escoger opción nula/vacía si el componente lo permite
    await botonSelector.click();
    const opcionVacia = listbox.getByRole('option', { name: /Seleccione|Limpiar/i });
    if (await opcionVacia.count() > 0) {
      await opcionVacia.click();
      await expect(botonModificar).toBeDisabled();
    }
  });

  test('TC-PAC-010: Clic en "Modificar datos" habilitado', async ({ page }) => {
    const botonSelector = page.getByRole('button', { name: /Paciente a modificar/i });
    const botonModificar = page.getByRole('button', { name: 'Modificar datos' });

    await botonSelector.click();
    await page.getByRole('listbox').getByRole('option').first().click();

    await expect(botonModificar).toBeEnabled();
    await botonModificar.click();

    // Valida que se abra el modal de modificación o cambie de vista
    const vistaOModalModificar = page.getByRole('dialog').or(page.getByRole('heading', { name: /Modificar|Editar/i }));
    await expect(vistaOModalModificar.first()).toBeVisible();
  });

  test('TC-PAC-011: Clic en "Actualizar documento"', async ({ page }) => {
    const botonActualizarDoc = page.getByRole('button', { name: 'Actualizar documento' });

    await expect(botonActualizarDoc).toBeEnabled();
    await botonActualizarDoc.click();

    // Valida despliegue del modal o diálogo correspondiente
    const dialogoActualizar = page.getByRole('dialog').or(page.getByRole('heading', { name: /Actualizar documento/i }));
    await expect(dialogoActualizar.first()).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // 3. REGISTRO Y NAVEGACIÓN
  // ---------------------------------------------------------------------------

  test('TC-PAC-012: Apertura de "Nuevo paciente"', async ({ page }) => {
    const botonNuevo = page.getByRole('button', { name: 'Nuevo paciente' });

    await expect(botonNuevo).toBeVisible();
    await botonNuevo.click();

    // Comprueba que navega o despliega el formulario de registro
    await expect(page.getByRole('dialog').or(page.getByRole('heading', { name: /Nuevo paciente|Registrar paciente/i }))).toBeVisible();
  });

  test('TC-PAC-013: Botón de Ayuda en cabecera', async ({ page }) => {
    const botonAyuda = page.getByRole('button', { name: 'Ayuda' });

    await expect(botonAyuda).toHaveAttribute('aria-expanded', 'false');
    await botonAyuda.click();
    await expect(botonAyuda).toHaveAttribute('aria-expanded', 'true');

    // Comprueba que el contenedor indicado en aria-controls ("panel-ayuda") es visible
    const panelAyuda = page.locator('#panel-ayuda');
    await expect(panelAyuda).toBeVisible();
  });

  test('TC-PAC-014: Botón Salir', async ({ page }) => {
    const botonSalir = page.locator('header.barra').getByRole('button', { name: 'Salir' });

    await expect(botonSalir).toBeVisible();
    await botonSalir.click();

    // Debe redireccionar fuera del portal autenticado hacia el login
    await expect(page).toHaveURL(/login|auth/i);
  });

  // ---------------------------------------------------------------------------
  // 4. TABLA DE RESULTADOS Y ORDENAMIENTO
  // ---------------------------------------------------------------------------

  test('TC-PAC-015: Renderizado del estado vacío inicial', async ({ page }) => {
    const tabla = page.getByRole('grid', { name: 'Pacientes' });
    const cuerpo = tabla.locator('tbody');

    await expect(cuerpo).toHaveAttribute('data-empty', 'true');

    const celdaVacia = cuerpo.getByRole('rowheader');
    await expect(celdaVacia).toHaveAttribute('colspan', '4');
    await expect(celdaVacia).toContainText('Aún no hay pacientes registrados');
  });

  test('TC-PAC-016: Ordenamiento por cabeceras de columna', async ({ page }) => {
    const colDocumento = page.getByRole('columnheader', { name: 'Documento' });
    const colNombre = page.getByRole('columnheader', { name: 'Nombre' });

    // React Aria marca las columnas ordenables con data-react-aria-pressable="true"
    await expect(colDocumento).toHaveAttribute('data-react-aria-pressable', 'true');
    await expect(colNombre).toHaveAttribute('data-react-aria-pressable', 'true');

    // Simular clic para ordenar por Documento
    await colDocumento.click();
    await expect(colDocumento).toHaveAttribute('aria-sort', /ascending|descending/i);

    // Simular clic para ordenar por Nombre
    await colNombre.click();
    await expect(colNombre).toHaveAttribute('aria-sort', /ascending|descending/i);
  });

  test('TC-PAC-017: Formato de Fecha de nacimiento y Estado', async ({ page }) => {
    // Ejecutar búsqueda o esperar a que existan filas con datos
    await page.getByRole('button', { name: 'Buscar', exact: true }).click();
    const tabla = page.getByRole('grid', { name: 'Pacientes' });
    const filaConDatos = tabla.getByRole('row').filter({ hasNot: page.getByText('Aún no hay pacientes registrados') }).first();

    if (await filaConDatos.count() > 0) {
      const celdas = filaConDatos.getByRole('gridcell');
      
      // Fecha en columna 3 (Formato AAAA-MM-DD o DD/MM/AAAA)
      const textoFecha = await celdas.nth(2).innerText();
      expect(textoFecha).toMatch(/^(\d{2}[/-]\d{2}[/-]\d{4}|\d{4}[/-]\d{2}[/-]\d{2})$/);

      // Estado en columna 4 (Valores controlados)
      const textoEstado = await celdas.nth(3).innerText();
      expect(['Activo', 'Inactivo', 'Pendiente']).toContain(textoEstado.trim());
    }
  });

  // ---------------------------------------------------------------------------
  // 5. ACCESIBILIDAD Y TECLADO (REACT ARIA)
  // ---------------------------------------------------------------------------

  test('TC-PAC-018: Secuencia de tabulación (Tab Index)', async ({ page }) => {
    const inputBusqueda = page.getByRole('textbox', { name: 'Buscar por documento o nombre' });
    const selectorModificar = page.getByRole('button', { name: /Paciente a modificar/i });
    const botonNuevo = page.getByRole('button', { name: 'Nuevo paciente' });
    const botonBuscar = page.getByRole('button', { name: 'Buscar', exact: true });

    // Posicionarse en el primer elemento interactivo
    await inputBusqueda.focus();
    await expect(inputBusqueda).toBeFocused();

    // Avanzar con Tab a través del flujo principal
    await page.keyboard.press('Tab');
    await expect(selectorModificar).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(botonNuevo).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(botonBuscar).toBeFocused();
  });

  test('TC-PAC-019: Control por teclado en el selector (Listbox)', async ({ page }) => {
    const selectorModificar = page.getByRole('button', { name: /Paciente a modificar/i });

    // Foco directo y apertura mediante tecla Enter o Espacio
    await selectorModificar.focus();
    await page.keyboard.press('Enter');

    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();

    // Navegación con flechas del teclado
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // El listbox debe cerrarse tras confirmar la opción
    await expect(listbox).toBeHidden();
  });

});