# Pilot Deploy Config

## Estado

Configuracion de deploy pilot para PuntoVenta Web + API sin Azure SQL.

Este documento no contiene valores secretos.

Runbook operativo reproducible: `docs/PILOT_BASELINE_RUNBOOK.md`.

## Recursos destino

- Static Web App: `swa-puntoventa-pilot-eastus2`
- Web URL: `https://gray-beach-00a0f870f.7.azurestaticapps.net`
- Function App: `func-puntoventa-pilot-eastus2`
- API base URL: `https://func-puntoventa-pilot-eastus2.azurewebsites.net`
- Resource group: `rg-puntoventa-pilot-eastus2`
- Region: `eastus2`

## Workflows

| Workflow  | Archivo                                      | Ruta publicada | Autenticacion                                  |
| --------- | -------------------------------------------- | -------------- | ---------------------------------------------- |
| Web pilot | `.github/workflows/puntoventa-web-pilot.yml` | `app/`         | `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`   |
| API pilot | `.github/workflows/puntoventa-api-pilot.yml` | `api/`         | GitHub OIDC + `azure/login` + RBAC minimo      |

Ambos workflows se pueden ejecutar manualmente con `workflow_dispatch`.

## App Settings configurados en Azure Functions

| Setting                | Valor                                                |
| ---------------------- | ---------------------------------------------------- |
| `APP_ENV`              | `pilot`                                              |
| `PV_SQLSERVER_ENABLED` | `false`                                              |
| `ALLOWED_ORIGINS`      | `https://gray-beach-00a0f870f.7.azurestaticapps.net` |

`SQL_CONNECTION_STRING` esta configurado en Azure Functions como secreto runtime, sin valor en repo. La API sigue con `PV_SQLSERVER_ENABLED=false` hasta `TASK-075`.

## CORS

La Function App permite solo el origen Web pilot:

```text
https://gray-beach-00a0f870f.7.azurestaticapps.net
```

Configuracion esperada:

```text
allowedOrigins:
- https://gray-beach-00a0f870f.7.azurestaticapps.net
supportCredentials: false
```

Validacion no destructiva:

```text
curl.exe -i -H "Origin: https://gray-beach-00a0f870f.7.azurestaticapps.net" https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health
```

El origen permitido debe recibir `Access-Control-Allow-Origin` con la URL Web
pilot exacta. Un origen externo no debe recibir ese header y el preflight externo
debe ser rechazado por Azure.

Excepcion local: el servidor local de desarrollo puede conservar CORS amplio para
compatibilidad con pruebas MVP locales. La restriccion anterior aplica al pilot
publicado.

## GitHub secrets/config fuera del repo

Crear o mantener en GitHub environment `pilot`:

- `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`
- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`

No pegar valores de tokens, publish profiles ni secretos en archivos, issues, handoffs ni logs.

La API pilot ya no debe usar publish profile. El secret `AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA` fue retirado del environment `pilot` tras migrar a OIDC/RBAC.

## Azure Functions publishing policies

Estado esperado tras `TASK-063`:

- `basicPublishingCredentialsPolicies/scm`: `allow:false`
- `basicPublishingCredentialsPolicies/ftp`: `allow:false`

## Azure SQL

Azure SQL pilot fue provisionado por `TASK-074`, pero la API publicada sigue con repositorios fake/fallback hasta `TASK-075`.

Recursos:

- SQL Server: `sqlserver-puntoventa-pilot-brazilsouth`
- SQL Server FQDN: `sqlserver-puntoventa-pilot-brazilsouth.database.windows.net`
- SQL Database: `sqldb-puntoventa-pilot`
- Region SQL: `brazilsouth`

Guardrails:

- SKU/objetivo: `GP_S_Gen5_1`
- Compute model: serverless
- Min capacity: `0.5`
- Auto-pause: `15` minutos
- Backup redundancy: `Local`
- Zone redundant: `false`
- TLS minimo: `1.2`
- PITR / short-term retention: `7` dias
- Differential backup interval: `12` horas
- Public network access: `Enabled`, restringido por reglas firewall a IPs outbound actuales de la Function App
- Locks `CanNotDelete`:
  - `lock-puntoventa-sqlserver-pilot-cannotdelete`
  - `lock-puntoventa-sqldb-pilot-cannotdelete`

App Settings:

- `SQL_CONNECTION_STRING` configurado en Azure Functions sin exponer valor.
- `PV_SQLSERVER_ENABLED=false` hasta que `TASK-075` conecte API, aplique migraciones/smoke y habilite persistencia real.

Nota operativa:

`eastus2` no acepto crear nuevos Azure SQL Database servers en esta suscripcion durante `TASK-074`; se uso `brazilsouth` por aprobacion explicita del usuario, alineado con la region usada por PuntoClub para SQL.
