# TASK-053 - Handoff

Nombre del equipo/chat:
Ejecucion Tecnica

Modo:
Infra

Nombre de la tarea:
TASK-053 - Configurar deploy Web API sin secrets en repo

Archivo de tarea:
`tasks/TASK-053.md`

## Nombre de tarea culminada

TASK-053 - Configurar deploy Web API sin secrets en repo

## Status

entregada a revision

## Handoff

`tasks/TASK-053-HANDOFF.md`

## Resumen

Se configuro el camino de deploy pilot para Web estatica y API sin guardar secretos en el repositorio y sin incluir Azure SQL. Quedaron workflows GitHub Actions para publicar `app/` en Azure Static Web Apps y `api/` en Azure Functions, mas App Settings/CORS pilot configurados en Azure.

Uso Azure SQL: No.

## Ambiente

- Fecha: 2026-06-24
- Workspace: `C:\Work\Productos Digitales\PuntoVenta`
- Equipo/chat: Ejecucion Tecnica
- Modo: Infra
- Resource group: `rg-puntoventa-pilot-eastus2`
- Static Web App: `swa-puntoventa-pilot-eastus2`
- Web URL: `https://gray-beach-00a0f870f.7.azurestaticapps.net`
- Function App: `func-puntoventa-pilot-eastus2`
- API base URL: `https://func-puntoventa-pilot-eastus2.azurewebsites.net`
- Azure SQL creado o usado: No
- Secretos guardados en repo: No
- Deploy ejecutado: No

## Cambios realizados

- Se agrego `.github/workflows/puntoventa-api-pilot.yml`.
- Se agrego `.github/workflows/puntoventa-web-pilot.yml`.
- Se agrego `docs/PILOT_DEPLOY_CONFIG.md`.
- Se actualizo `docs/README.md` para incluir el documento de deploy pilot.
- Se configuraron App Settings de Function App para `APP_ENV=pilot`, `PV_SQLSERVER_ENABLED=false` y `ALLOWED_ORIGINS` apuntando al dominio de Static Web Apps.
- Se configuro CORS de Function App para permitir la URL pilot de la Web.

## Secrets requeridos fuera del repo

Crear en GitHub Secrets del ambiente/repositorio antes de ejecutar los workflows:

- `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA`

No se guardaron valores reales de secrets, tokens, publish profiles ni connection strings.

## Verificacion ejecutada

```text
npm run check
```

Resultado:

```text
tests 47
pass 47
fail 0
```

```text
npx prettier --check ../docs/PILOT_DEPLOY_CONFIG.md ../.github/workflows/puntoventa-api-pilot.yml ../.github/workflows/puntoventa-web-pilot.yml
```

Resultado:

```text
All matched files use Prettier code style!
```

```text
git diff --check -- .github/workflows/puntoventa-api-pilot.yml .github/workflows/puntoventa-web-pilot.yml docs/PILOT_DEPLOY_CONFIG.md api/host.json api/httpApi/function.json api/httpApi/index.cjs api/src/http/azureFunctionsAdapter.js api/test/azureFunctionsAdapter.test.js api/package.json api/eslint.config.js api/README.md docs/README.md tasks/TASK-051.md tasks/TASK-052.md tasks/TASK-053.md docs/TASK_BOARD.md tasks/TASK-051-HANDOFF.md tasks/TASK-052-HANDOFF.md
```

Resultado:

```text
sin errores de whitespace
```

Busqueda de secretos en archivos de deploy:

```text
Select-String -Path .github\workflows\puntoventa-api-pilot.yml,.github\workflows\puntoventa-web-pilot.yml,docs\PILOT_DEPLOY_CONFIG.md,tasks\TASK-053.md -Pattern 'password|secret|token|connection string|InstrumentationKey|AccountKey|publish profile|apiKey' -CaseSensitive:$false
```

Resultado:

```text
Solo referencias por nombre a GitHub Secrets, GITHUB_TOKEN y documentacion de secrets. No se encontraron valores reales.
```

## Resultado por criterio

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| Deploy Web/API queda configurado o bloqueo claro documentado | Cumple | Workflows creados y App Settings/CORS configurados; secrets reales quedan pendientes fuera del repo. |
| Secrets se referencian por nombre, sin valores reales en repo | Cumple | Workflows usan `${{ secrets.* }}`; doc solo enumera nombres. |
| Azure SQL sigue fuera del alcance | Cumple | `PV_SQLSERVER_ENABLED=false`; no hay connection string cloud. |
| Checks locales relevantes pasan | Cumple | `npm run check`, Prettier y `git diff --check`. |
| El handoff indica `Uso Azure SQL: No` | Cumple | Indicado en resumen y ambiente. |

## Hallazgos

### P0/P1

- Ninguno.

### P2/P3

- P2: No se pudieron crear GitHub Secrets desde esta sesion porque `gh auth status` reporto token invalido para la cuenta local. Los workflows quedan configurados, pero no podran desplegar hasta que esos secrets existan en GitHub.
- P3: La Web actual no tiene configurado por defecto el API base URL publicado; el cliente usa fallback local y override por `localStorage.pvApiBaseUrl`. Para piloto operativo conviene una tarea Web Dev de configuracion runtime/build-time del API base URL.

## Pendientes o riesgos

- Crear los dos GitHub Secrets fuera del repositorio.
- Ejecutar `TASK-054` como primer deploy pilot y validar URL Web + `/api/health`.
- Mantener Azure SQL fuera del primer deploy.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
