# Proyecto - Adopcion de tooling local

Este documento es para el chat **Proyecto** de PuntoVenta. Su objetivo es evitar instalar o mover tooling antes de cerrar el baseline local.

## Contexto

La maquina ya tiene herramientas globales disponibles:

```text
git
gh
az
aws
node
npm
func
swa
rg
sqlcmd
playwright
gitleaks
lighthouse
eslint
prettier
stylelint
vitest
azurite
SQL Server Express local
```

SQL Server local confirmado:

```text
Server: localhost\SQLEXPRESS
Edition: SQL Server 2022 Express
Auth principal: Windows Authentication
```

## Prioridad actual

No instalar mas tooling dentro del repo hasta cerrar validacion local y consolidar Git.

Orden recomendado:

1. Baseline local.
2. Git limpio.
3. ESLint + Prettier.
4. Scripts raiz de checks comunes.
5. Playwright + axe cuando QA local este estable.
6. SWA CLI solo si Proyecto abre tarea concreta de Static Web Apps.

## Baseline local primero

Instruir a Ejecucion Tecnica / Infra a confirmar:

```powershell
git status --short --branch
node --version
npm --version
sqlcmd -S localhost\SQLEXPRESS -E -Q "SELECT @@VERSION"
func --version
az --version
swa --version
```

Si `az` falla desde Codex por permisos de perfil, probar desde PowerShell normal antes de reinstalar.

## API y app local

Confirmar lo ya existente antes de agregar herramientas:

- API local responde health/smoke.
- App estatica local abre.
- Tests actuales con `node --test` siguen pasando.
- Documentacion de smoke SQL local esta actualizada.
- `.gitignore` excluye logs, temporales y secretos.

## Primer tooling dentro del repo

Solo despues del baseline:

```powershell
npm install -D eslint prettier
```

Scripts deseados, ajustados al repo:

```json
{
  "scripts": {
    "lint": "eslint .",
    "format:check": "prettier --check .",
    "check": "npm run lint && npm run format:check"
  }
}
```

No hacer reformat masivo. Aplicar formato solo a archivos tocados o cuando Proyecto apruebe una tarea dedicada.

## Playwright despues

Cuando QA local este estable:

```powershell
npm install -D @playwright/test @axe-core/playwright
```

Smoke recomendado:

- home/app local;
- ruta critica de venta;
- flujo no destructivo;
- responsive desktop/mobile;
- accesibilidad basica con axe.

## SWA CLI

`swa` ya esta instalado globalmente en la maquina, pero no debe usarse como requisito hasta que haya tarea concreta de Azure Static Web Apps.

Verificar:

```powershell
swa --version
```

## Seguridad y secretos

Antes de commits:

```powershell
gitleaks detect --source . --no-git
rg ".env|connectionString|sig=|password|token|SAS|local.settings.json"
```

No subir:

```text
.env
local.settings.json
logs con connection strings
capturas con secretos
archivos temporales de pruebas
```

## Fuera de alcance inicial

- No Azure SQL/cloud antes de validar local.
- No deploy sin tarea explicita.
- No instalar herramientas por adelantado dentro del repo.
- No Storybook.
- No OpenAPI/Swagger hasta que el contrato API lo amerite.
- No mezclar tooling con cambios funcionales.

## Criterio de exito

La fase inicial queda lista cuando:

- Baseline local verificado.
- Git limpio.
- Temporales/logs fuera del repo.
- Comandos locales documentados.
- Luego, y solo luego, se abre tarea pequena para ESLint/Prettier.
