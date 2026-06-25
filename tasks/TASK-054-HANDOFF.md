# TASK-054 - Handoff

Nombre del equipo/chat:
Ejecucion Tecnica

Modo:
Infra

Nombre de la tarea:
TASK-054 - Ejecutar primer deploy pilot Web API sin Azure SQL

Archivo de tarea:
`tasks/TASK-054.md`

## Nombre de tarea culminada

TASK-054 - Ejecutar primer deploy pilot Web API sin Azure SQL

## Status

bloqueada con evidencia parcial

## Handoff

`tasks/TASK-054-HANDOFF.md`

## Resumen

Se ejecuto deploy de API pilot a Azure Functions y Azure registro la funcion `httpApi`. El deploy Web pilot no completo porque SWA CLI falla en el binario local `StaticSitesClient.exe` con exit code 1. Los checks HTTP publicos desde este entorno tambien fallan a nivel TCP contra los hosts de Azure Functions y Static Web Apps, aunque la Function App figura `Running`, con `publicNetworkAccess=Enabled` y reglas de acceso `Allow all`.

Uso Azure SQL: No.

## Ambiente

- Fecha: 2026-06-24
- Workspace: `C:\Work\Productos Digitales\PuntoVenta`
- Equipo/chat: Ejecucion Tecnica
- Modo: Infra
- Static Web App: `swa-puntoventa-pilot-eastus2`
- Web URL: `https://gray-beach-00a0f870f.7.azurestaticapps.net`
- Function App: `func-puntoventa-pilot-eastus2`
- API base URL: `https://func-puntoventa-pilot-eastus2.azurewebsites.net`
- API deploy ejecutado: Si
- Web deploy ejecutado: No, bloqueado por SWA CLI local
- Azure SQL creado o usado: No
- Secretos guardados en repo: No

## Cambios correctivos realizados durante el deploy

Durante el primer deploy de API, Azure no registro funciones porque el trigger estaba bajo `api/functions/api/`. Se corrigio la estructura para Azure Functions clasico:

- De: `api/functions/api/function.json` y `api/functions/api/index.cjs`
- A: `api/httpApi/function.json` y `api/httpApi/index.cjs`

La funcion quedo como carpeta directa bajo la raiz del Function App y fue registrada por Azure.

## Comandos y evidencia

API deploy:

```text
func azure functionapp publish func-puntoventa-pilot-eastus2 --javascript
```

Resultado final:

```text
Deployment completed successfully.
Functions in func-puntoventa-pilot-eastus2:
    httpApi - [httpTrigger]
        Invoke url: https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/{*route}
```

Funcion registrada:

```text
az functionapp function list --resource-group rg-puntoventa-pilot-eastus2 --name func-puntoventa-pilot-eastus2 --query "[].{name:name,invokeUrlTemplate:invokeUrlTemplate}" --output json
```

Resultado:

```text
[
  {
    "invokeUrlTemplate": "https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/{*route}",
    "name": "func-puntoventa-pilot-eastus2/httpApi"
  }
]
```

Estado publico Function App:

```text
az functionapp show --resource-group rg-puntoventa-pilot-eastus2 --name func-puntoventa-pilot-eastus2 --query "{state:state,defaultHostName:defaultHostName,publicNetworkAccess:publicNetworkAccess,enabledHostNames:enabledHostNames}" --output json
```

Resultado resumido:

```text
state: Running
defaultHostName: func-puntoventa-pilot-eastus2.azurewebsites.net
publicNetworkAccess: Enabled
enabledHostNames: func-puntoventa-pilot-eastus2.azurewebsites.net, func-puntoventa-pilot-eastus2.scm.azurewebsites.net
```

Restricciones de acceso:

```text
az functionapp config access-restriction show --resource-group rg-puntoventa-pilot-eastus2 --name func-puntoventa-pilot-eastus2 --output json
```

Resultado resumido:

```text
ipSecurityRestrictions: Allow all
scmIpSecurityRestrictions: Allow all
```

HTTP check API:

```text
curl.exe -i https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health
```

Resultado desde este entorno:

```text
curl: (7) Failed to connect to func-puntoventa-pilot-eastus2.azurewebsites.net port 443
```

DNS/TCP:

```text
Resolve-DnsName func-puntoventa-pilot-eastus2.azurewebsites.net
Test-NetConnection func-puntoventa-pilot-eastus2.azurewebsites.net -Port 443
```

Resultado resumido:

```text
DNS resuelve a IPv4.
PingSucceeded: True
TcpTestSucceeded: False
```

Web deploy:

```text
swa deploy --app-location . --output-location . --env production --resource-group rg-puntoventa-pilot-eastus2 --app-name swa-puntoventa-pilot-eastus2 --no-use-keychain
```

Resultado:

```text
Deployment failed with exit code 1
The deployment binary exited with code 1.
StaticSitesClient.exe
```

Reintento con token temporal en variable de entorno, sin imprimir el valor y limpiando `.env`:

```text
$token = az staticwebapp secrets list --name swa-puntoventa-pilot-eastus2 --resource-group rg-puntoventa-pilot-eastus2 --query "properties.apiKey" -o tsv
$env:SWA_CLI_DEPLOYMENT_TOKEN = $token
swa deploy --app-location . --output-location . --env production --no-use-keychain
Remove-Item -LiteralPath .env -Force -ErrorAction SilentlyContinue
```

Resultado:

```text
Deployment failed with exit code 1
The deployment binary exited with code 1.
```

Confirmacion de limpieza:

```text
Test-Path app\.env
```

Resultado:

```text
False
```

HTTP check Web:

```text
curl.exe -I https://gray-beach-00a0f870f.7.azurestaticapps.net/
```

Resultado desde este entorno:

```text
curl: (7) Failed to connect to gray-beach-00a0f870f.7.azurestaticapps.net port 443
```

Confirmacion de Azure SQL fuera del alcance:

```text
az resource list --resource-group rg-puntoventa-pilot-eastus2 --query "[?contains(type, 'Sql') || contains(type, 'sql')].{name:name,type:type}" --output json
```

Resultado:

```text
[]
```

## Verificacion local ejecutada

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
npx prettier --check httpApi/function.json httpApi/index.cjs test/azureFunctionsAdapter.test.js eslint.config.js
```

Resultado:

```text
All matched files use Prettier code style!
```

## Resultado por criterio

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| Web pilot publica responde | No cumple / bloqueado | SWA CLI falla en `StaticSitesClient.exe`; no hubo deploy Web completado. |
| API pilot health responde | No verificable desde este entorno | API deploy y funcion `httpApi` registrados; HTTP check falla TCP hacia Azure host. |
| No se usa Azure SQL | Cumple | No hay recursos SQL en el resource group y no se configuro connection string cloud. |
| URLs y evidencia quedan documentadas | Cumple | URLs, comandos y resultados documentados en este handoff. |
| Queda recomendacion clara para QA publicado | Cumple | Ver seccion siguiente. |
| El handoff indica `Uso Azure SQL: No` | Cumple | Indicado en resumen y ambiente. |

## Recomendacion para QA publicado

No enviar todavia a QA publicado como flujo completo. Primero resolver el deploy Web con una de estas opciones:

- Ejecutar los workflows de GitHub Actions cuando existan los secrets `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA` y `AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA`.
- Reintentar SWA CLI desde una maquina donde `StaticSitesClient.exe` pueda ejecutar correctamente.
- Validar HTTP desde una red/navegador externo que pueda conectar por 443 a `*.azurewebsites.net` y `*.azurestaticapps.net`.

Despues de eso, crear tarea QA publicada para validar:

- `GET /api/health` en `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`
- Web en `https://gray-beach-00a0f870f.7.azurestaticapps.net`
- Confirmar que el piloto sigue sin Azure SQL.

## Hallazgos

### P0/P1

- P1: Web pilot no quedo desplegada porque SWA CLI falla en `StaticSitesClient.exe` con exit code 1.
- P1: Verificacion HTTP publica no fue posible desde este entorno por fallo TCP a los hosts Azure, aun con DNS resuelto y Function App publica.

### P2/P3

- P2: API publicada quedo registrada en Azure Functions, pero falta confirmar `/api/health` desde una red que pueda abrir 443 al host.
- P2: El primer intento de SWA CLI genero `app/.env`; se elimino sin abrirlo ni copiar valores, y se confirmo `Test-Path app\.env = False`.
- P3: Para piloto operativo, falta tarea Web Dev para configurar por defecto el API base URL publicado; hoy la Web mantiene fallback local/override manual.

## Movimiento de tablero

- De: Assigned
- A: Blocked
