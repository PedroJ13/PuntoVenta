# Pilot Baseline Runbook

## Proposito

Baseline operativo reproducible para PuntoVenta Web/API pilot con Azure SQL activo para la API. Este documento no contiene secretos ni valores de tokens.

## Estado esperado

- Web publicada en Azure Static Web Apps.
- API publicada en Azure Functions.
- API deploy por GitHub OIDC + RBAC, sin publish profile.
- `basicPublishingCredentialsPolicies/scm`: `allow:false`.
- `basicPublishingCredentialsPolicies/ftp`: `allow:false`.
- CORS de API restringido a la Web pilot.
- Azure SQL pilot activo con serverless bajo, auto-pause y locks `CanNotDelete`.
- API health debe reflejar SQL configurado y disponible despues del probe de health.

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
| SQL Server | `sqlserver-puntoventa-pilot-brazilsouth` |
| SQL Database | `sqldb-puntoventa-pilot` |
| SQL Region | `brazilsouth` |

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
| `PV_SQLSERVER_ENABLED` | `true` |
| `ALLOWED_ORIGINS` | `https://gray-beach-00a0f870f.7.azurestaticapps.net` |

Settings secretos o sensibles esperados en Azure Functions, sin valores en repo:

- `SQL_CONNECTION_STRING`
- variables `PV_SQLSERVER_*` sensibles si aplican, sin exponer passwords.

No imprimir connection strings, usuarios sensibles, passwords ni valores de secrets en logs o handoffs.

## Azure SQL pilot

Azure SQL fue provisionado por `TASK-074`, ajustado por `TASK-077` y conectado a la API por `TASK-075`.

Recursos:

| Recurso | Valor |
| --- | --- |
| SQL Server | `sqlserver-puntoventa-pilot-brazilsouth` |
| FQDN | `sqlserver-puntoventa-pilot-brazilsouth.database.windows.net` |
| SQL Database | `sqldb-puntoventa-pilot` |
| Region SQL | `brazilsouth` |
| Resource group | `rg-puntoventa-pilot-eastus2` |

Guardrails esperados:

| Control | Valor esperado |
| --- | --- |
| Service objective | `GP_S_Gen5_1` |
| Compute model | `Serverless` |
| Min capacity | `0.5` |
| Auto-pause | `15` minutos |
| Backup redundancy | `Local` |
| Zone redundant | `false` |
| TLS minimo | `1.2` |
| PITR / short-term retention | `7` dias |
| Differential backup interval | `12` horas |
| Public network access | `Enabled`, restringido por firewall |

Locks esperados:

- `lock-puntoventa-sqlserver-pilot-cannotdelete`
- `lock-puntoventa-sqldb-pilot-cannotdelete`

Datos esperados del baseline:

- Solo datos ficticios/demo y ventas de smoke.
- No datos reales.
- Tenant demo: `PV-DEMO-LOCAL`.
- No cambiar `PV_SQLSERVER_COMPANY_TAX_ID` a tenant real sin tarea Backend/API o Infra posterior.

Nota de region:

`eastus2` no acepto nuevos Azure SQL Database servers durante `TASK-074`; se uso `brazilsouth` por aprobacion explicita del usuario, alineado con la region usada por PuntoClub para SQL.

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
storage=sql-local
sqlConfigured=true
sqlAvailable=true
catalog=sql-local
openAccounts=sql-local
cashShifts=sql-local
sales=sql-local
reports=sql-local
```

Nota: `sql-local` es la etiqueta historica del API para repositorios SQL. En el pilot publicado actual corresponde a Azure SQL segun `docs/PILOT_DEPLOY_CONFIG.md` y los handoffs `TASK-075`/`TASK-076`.

Azure SQL activo:

```powershell
az resource list --resource-group rg-puntoventa-pilot-eastus2 --query "[?contains(type, 'Sql') || contains(type, 'sql')].{name:name,type:type}" --output json
```

Resultado esperado minimo:

```json
[
  {
    "name": "sqlserver-puntoventa-pilot-brazilsouth",
    "type": "Microsoft.Sql/servers"
  },
  {
    "name": "sqlserver-puntoventa-pilot-brazilsouth/sqldb-puntoventa-pilot",
    "type": "Microsoft.Sql/servers/databases"
  }
]
```

Checks no destructivos de SQL:

```powershell
az sql db show --resource-group rg-puntoventa-pilot-eastus2 --server sqlserver-puntoventa-pilot-brazilsouth --name sqldb-puntoventa-pilot --query "{name:name,currentServiceObjectiveName:currentServiceObjectiveName,computeModel:computeModel,autoPauseDelay:autoPauseDelay,minCapacity:minCapacity,zoneRedundant:zoneRedundant,currentBackupStorageRedundancy:currentBackupStorageRedundancy}" --output json

az sql db str-policy show --resource-group rg-puntoventa-pilot-eastus2 --server sqlserver-puntoventa-pilot-brazilsouth --database sqldb-puntoventa-pilot --query "{retentionDays:retentionDays,diffBackupIntervalInHours:diffBackupIntervalInHours}" --output json

az lock list --resource-group rg-puntoventa-pilot-eastus2 --query "[?contains(name, 'puntoventa')].{name:name,level:level,scope:id}" --output table
```

## Regla de seguridad

- No guardar tokens, publish profiles, passwords ni connection strings en archivos.
- No imprimir valores de secrets en handoffs.
- No cargar datos reales sin tarea explicita futura, fuente aprobada y rollback/mitigacion.
- No borrar ni limpiar datos demo/smoke sin tarea explicita, respaldo y decision documentada.
- No relajar `scm allow:false` o `ftp allow:false` salvo tarea Infra con motivo y cierre posterior.
