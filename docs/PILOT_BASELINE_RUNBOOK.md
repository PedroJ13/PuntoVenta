# Pilot Baseline Runbook

## Proposito

Baseline operativo reproducible para PuntoVenta Web/API pilot sin Azure SQL. Este documento no contiene secretos ni valores de tokens.

## Estado esperado

- Web publicada en Azure Static Web Apps.
- API publicada en Azure Functions.
- API deploy por GitHub OIDC + RBAC, sin publish profile.
- `basicPublishingCredentialsPolicies/scm`: `allow:false`.
- `basicPublishingCredentialsPolicies/ftp`: `allow:false`.
- CORS de API restringido a la Web pilot.
- Azure SQL fuera del baseline.

## URLs publicas

| Superficie | URL |
| --- | --- |
| Web pilot | `https://gray-beach-00a0f870f.7.azurestaticapps.net/` |
| API base | `https://func-puntoventa-pilot-eastus2.azurewebsites.net` |
| API health | `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health` |

## Recursos Azure

| Recurso | Nombre |
| --- | --- |
| Resource group | `rg-puntoventa-pilot-eastus2` |
| Static Web App | `swa-puntoventa-pilot-eastus2` |
| Function App | `func-puntoventa-pilot-eastus2` |
| Region | `eastus2` |

## Workflows GitHub Actions

| Workflow | Archivo | Trigger | Criterio de exito |
| --- | --- | --- | --- |
| PuntoVenta Web Pilot | `.github/workflows/puntoventa-web-pilot.yml` | `workflow_dispatch` o push en `app/**` | Run en `success`; Web URL responde `HTTP 200`. |
| PuntoVenta API Pilot | `.github/workflows/puntoventa-api-pilot.yml` | `workflow_dispatch` o push en `api/**` | Run en `success`; `npm run check` pasa; API health responde `HTTP 200`. |

## Autenticacion de deploy

### Web

Static Web Apps usa el secret del environment `pilot`:

```text
AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA
```

El valor del token vive fuera del repositorio.

### API

Azure Functions usa GitHub OIDC + `azure/login@v2` + RBAC minimo.

Secrets/config esperados en GitHub environment `pilot`, sin valores en repo:

```text
AZURE_CLIENT_ID
AZURE_TENANT_ID
AZURE_SUBSCRIPTION_ID
```

Identidad documentada:

```text
displayName: gha-puntoventa-functions-pilot
role: Website Contributor
scope: Function App func-puntoventa-pilot-eastus2
federated credential subject: repo:PedroJ13/PuntoVenta:environment:pilot
```

El API pilot no debe usar publish profile. El secret `AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA` debe permanecer retirado del environment `pilot`.

## App settings API

Settings no secretos esperados:

| Setting | Valor |
| --- | --- |
| `APP_ENV` | `pilot` |
| `PV_SQLSERVER_ENABLED` | `false` |
| `ALLOWED_ORIGINS` | `https://gray-beach-00a0f870f.7.azurestaticapps.net` |

No configurar `SQL_CONNECTION_STRING` en este baseline.

## CORS API pilot

Estado esperado:

```text
allowedOrigins:
- https://gray-beach-00a0f870f.7.azurestaticapps.net
supportCredentials: false
```

Comprobacion de origen permitido:

```powershell
curl.exe -i --connect-timeout 15 -H "Origin: https://gray-beach-00a0f870f.7.azurestaticapps.net" https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health
```

Debe devolver:

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://gray-beach-00a0f870f.7.azurestaticapps.net
```

Comprobacion de origen externo:

```powershell
curl.exe -i --connect-timeout 15 -X OPTIONS -H "Origin: https://example.invalid" -H "Access-Control-Request-Method: GET" https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health
```

Debe devolver rechazo de Azure, por ejemplo:

```text
HTTP/1.1 400 The origin 'https://example.invalid' is not allowed.
```

## Politicas de publicacion Function App

Estado esperado:

```text
basicPublishingCredentialsPolicies/scm allow:false
basicPublishingCredentialsPolicies/ftp allow:false
```

Checks:

```powershell
az resource show --resource-group rg-puntoventa-pilot-eastus2 --resource-type Microsoft.Web/sites/basicPublishingCredentialsPolicies --parent sites/func-puntoventa-pilot-eastus2 --name scm --query properties.allow --output tsv
az resource show --resource-group rg-puntoventa-pilot-eastus2 --resource-type Microsoft.Web/sites/basicPublishingCredentialsPolicies --parent sites/func-puntoventa-pilot-eastus2 --name ftp --query properties.allow --output tsv
```

Ambos deben devolver:

```text
false
```

## Checks de salud no destructivos

Web:

```powershell
curl.exe -I --connect-timeout 15 https://gray-beach-00a0f870f.7.azurestaticapps.net/
```

Resultado esperado:

```text
HTTP/1.1 200 OK
Content-Type: text/html
```

API:

```powershell
curl.exe -i --connect-timeout 15 https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health
```

Resultado esperado:

```text
HTTP/1.1 200 OK
storage=fake
sqlConfigured=false
sqlAvailable=false
```

Azure SQL fuera:

```powershell
az resource list --resource-group rg-puntoventa-pilot-eastus2 --query "[?contains(type, 'Sql') || contains(type, 'sql')].{name:name,type:type}" --output json
```

Resultado esperado:

```json
[]
```

## Regla de seguridad

- No guardar tokens, publish profiles, passwords ni connection strings en archivos.
- No imprimir valores de secrets en handoffs.
- No crear Azure SQL sin tarea explicita futura.
- No relajar `scm allow:false` o `ftp allow:false` salvo tarea Infra con motivo y cierre posterior.
