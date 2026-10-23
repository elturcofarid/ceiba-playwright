// reporters/github-reporter.ts
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { Octokit } from '@octokit/rest';

export default class GitHubIssueReporter implements Reporter {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private enabled: boolean;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN, // Token de acceso personal o token de GitHub Actions
    });
    this.owner = process.env.GITHUB_OWNER || 'elturcofarid';
    this.repo = process.env.GITHUB_REPO || 'ceiba-playwright';

    // Solo actúa en CI, o en local si se activa explícitamente con GITHUB_REPORTER=true
    const activo = !!process.env.CI || process.env.GITHUB_REPORTER === 'true';
    this.enabled = activo && !!process.env.GITHUB_TOKEN;

    if (activo && !process.env.GITHUB_TOKEN) {
      console.warn('\n⚠️ GitHubIssueReporter desactivado: falta GITHUB_TOKEN.');
    }
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    if (!this.enabled) {
      return;
    }

    if (result.status !== 'failed' && result.status !== 'timedOut') {
      return;
    }

    // Si aún quedan reintentos, esperar al último intento para no reportar fallos intermitentes
    if (result.retry < test.retries) {
      return;
    }

    const title = `[Fallo en Test] ${test.title}`;
    const errorMsg = result.errors.map(e => e.message || e.stack).join('\n\n');

    try {
      // 1. Consultar issues abiertos en el repositorio
      const { data: issuesAbiertos } = await this.octokit.rest.issues.listForRepo({
        owner: this.owner,
        repo: this.repo,
        state: 'open',
        per_page: 100,
      });

      // 2. Buscar si ya existe un issue con el mismo título
      const issueExistente = issuesAbiertos.find(issue => issue.title === title);

      if (issueExistente) {
        console.log(`\nℹ️ El issue ya existe (#${issueExistente.number}). Se omite la creación para evitar duplicados.`);
        
        // Opcional: Agregar un comentario registrando la nueva falla
        await this.octokit.rest.issues.createComment({
          owner: this.owner,
          repo: this.repo,
          issue_number: issueExistente.number,
          body: `⚠️ **Reincidencia detectada**: El test volvió a fallar en la ejecución del ${new Date().toISOString()}.\n\n\`\`\`text\n${errorMsg}\n\`\`\``,
        });
        return;
      }

      // 3. Si no existe, crear el nuevo issue
      const body = `
### 🚨 Reporte Automático de Falla en Test E2E

* **Archivo:** \`${test.location.file}:${test.location.line}\`
* **Test:** ${test.title}
* **Resultado:** \`${result.status}\`
* **Duración:** ${(result.duration / 1000).toFixed(2)}s
* **Fecha:** ${new Date().toISOString()}

---

#### 📋 Detalles del Error
\`\`\`text
${errorMsg || 'No se capturó un mensaje de error específico.'}
\`\`\`

---
*Generado automáticamente por el suite de pruebas Playwright.*
`;

      try {
        await this.octokit.rest.issues.create({
          owner: this.owner,
          repo: this.repo,
          title,
          body,
          labels: ['bug', 'automated-test', 'qa'],
        });
        console.log(`\n✅ Issue creado en GitHub para el test: "${test.title}"`);
      } catch (err: any) {
        console.error(`\n❌ Error creando Issue en GitHub:`, err.message);
      }
    } catch (err: any) {
      console.error(`\n❌ Error consultando Issues en GitHub:`, err.message);
    }
  }
}