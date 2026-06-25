# Pilot Deploy Config

## Estado

Configuracion de deploy pilot para PuntoVenta Web + API sin Azure SQL.

Este documento no contiene valores secretos.

## Recursos destino

- Static Web App: `swa-puntoventa-pilot-eastus2`
- Web URL: `https://gray-beach-00a0f870f.7.azurestaticapps.net`
- Function App: `func-puntoventa-pilot-eastus2`
- API base URL: `https://func-puntoventa-pilot-eastus2.azurewebsites.net`
- Resource group: `rg-puntoventa-pilot-eastus2`
- Region: `eastus2`

## Workflows

| Workflow  | Archivo                                      | Ruta publicada | Secret requerido                               |
| --------- | -------------------------------------------- | -------------- | ---------------------------------------------- |
| Web pilot | `.github/workflows/puntoventa-web-pilot.yml` | `app/`         | `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`   |
| API pilot | `.github/workflows/puntoventa-api-pilot.yml` | `api/`         | `AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA` |

Ambos workflows se pueden ejecutar manualmente con `workflow_dispatch`.

## App Settings configurados en Azure Functions

| Setting                | Valor                                                |
| ---------------------- | ---------------------------------------------------- |
| `APP_ENV`              | `pilot`                                              |
| `PV_SQLSERVER_ENABLED` | `false`                                              |
| `ALLOWED_ORIGINS`      | `https://gray-beach-00a0f870f.7.azurestaticapps.net` |

No se configuro `SQL_CONNECTION_STRING` porque Azure SQL esta fuera del primer deploy.

## CORS

La Function App permite el origen:

```text
https://gray-beach-00a0f870f.7.azurestaticapps.net
```

Nota: el adaptador local todavia agrega CORS amplio para mantener compatibilidad MVP.
Antes de piloto real con usuarios externos, acotar CORS en codigo o configuracion
efectiva.

## Secrets pendientes fuera del repo

Crear en GitHub Secrets del ambiente/repositorio:

- `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA`

No pegar estos valores en archivos, issues, handoffs ni logs.

## Azure SQL

Azure SQL queda fuera:

- No hay SQL Server Azure.
- No hay SQL Database Azure.
- No hay connection string cloud.
- La API publicada debe iniciar con repositorios fake/fallback.
