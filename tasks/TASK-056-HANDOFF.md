# TASK-056 - Handoff

Nombre del equipo/chat:
Ejecucion Tecnica

Modo:
Infra

Nombre de la tarea:
TASK-056 - Desbloquear deploy Web pilot y validar endpoints publicos

Archivo de tarea:
`tasks/TASK-056.md`

## Nombre de tarea culminada

TASK-056 - Desbloquear deploy Web pilot y validar endpoints publicos

## Status

entregada a revision con bloqueo documentado

## Handoff

`tasks/TASK-056-HANDOFF.md`

## Resumen

Se intento desbloquear el deploy Web pilot revisando las rutas disponibles. GitHub Actions no queda ejecutable desde esta sesion porque `gh auth status` reporta token invalido y la Static Web App no tiene `repositoryUrl`/`branch` conectados en Azure. No se repitio un deploy real con SWA CLI porque `TASK-054` ya documento fallo de `StaticSitesClient.exe`; un `swa deploy --dry-run` desde `app/` no devolvio evidencia util y expiro. Los smoke HTTP publicos siguen fallando por conexion TCP desde este entorno.

Uso Azure SQL: No.

## Ambiente

- Fecha: 2026-06-24
- Workspace: `C:\Work\Productos Digitales\PuntoVenta`
- Equipo/chat: Ejecucion Tecnica
- Modo: Infra
- Static Web App: `swa-puntoventa-pilot-eastus2`
- Web URL: `https://gray-beach-00a0f870f.7.azurestaticapps.net`
- Function App: `func-puntoventa-pilot-eastus2`
- API health URL: `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`
- Deploy Web ejecutado: No, bloqueo documentado
- Azure SQL creado o usado: No
- Secretos guardados en repo: No

## Evidencia de GitHub Actions

```text
git remote -v
```

Resultado:

```text
origin https://github.com/PedroJ13/PuntoVenta.git (fetch)
origin https://github.com/PedroJ13/PuntoVenta.git (push)
```

```text
gh auth status
```

Resultado:

```text
The token in default is invalid.
```

Conclusion: no se puede confirmar o disparar workflows desde esta sesion con `gh`.

## Evidencia Azure Static Web Apps

```text
az staticwebapp show --name swa-puntoventa-pilot-eastus2 --resource-group rg-puntoventa-pilot-eastus2 --query "{name:name,defaultHostname:defaultHostname,repositoryUrl:repositoryUrl,branch:branch,sku:sku.name}" --output json
```

Resultado:

```text
{
  "branch": null,
  "defaultHostname": "gray-beach-00a0f870f.7.azurestaticapps.net",
  "name": "swa-puntoventa-pilot-eastus2",
  "repositoryUrl": null,
  "sku": "Free"
}
```

Conclusion: la SWA existe en Free, pero no esta conectada a un repo/branch desde Azure. Para usar GitHub Actions, se requiere que los cambios esten en GitHub y que existan los secrets configurados en el repo/ambiente.

## Evidencia Azure Functions

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

Conclusion: la funcion API sigue registrada.

## Smoke HTTP publico

Web:

```text
curl.exe -I --connect-timeout 15 https://gray-beach-00a0f870f.7.azurestaticapps.net/
```

Resultado:

```text
curl: (7) Failed to connect to gray-beach-00a0f870f.7.azurestaticapps.net port 443
```

API:

```text
curl.exe -i --connect-timeout 15 https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health
```

Resultado:

```text
curl: (7) Failed to connect to func-puntoventa-pilot-eastus2.azurewebsites.net port 443
```

Conclusion: desde este entorno no se puede validar HTTP publico por 443 contra los hosts Azure.

## Azure SQL

```text
az resource list --resource-group rg-puntoventa-pilot-eastus2 --query "[?contains(type, 'Sql') || contains(type, 'sql')].{name:name,type:type}" --output json
```

Resultado:

```text
[]
```

## Git y secrets

```text
git status --short --branch
```

Resultado resumido:

```text
## main
M app/README.md
M app/src/apiClient.js
M docs/TASK_BOARD.md
?? tasks/TASK-055-HANDOFF.md
?? tasks/TASK-056.md
```

Nota: el working tree tiene muchos cambios previos no relacionados ya presentes en la ronda.

Busqueda de secretos en archivos relevantes:

```text
Select-String -Path app\src\apiClient.js,app\README.md,tasks\TASK-055-HANDOFF.md,tasks\TASK-056.md,.github\workflows\puntoventa-web-pilot.yml,.github\workflows\puntoventa-api-pilot.yml,docs\PILOT_DEPLOY_CONFIG.md -Pattern 'password|secret|token|connection string|InstrumentationKey|AccountKey|publish profile|apiKey' -CaseSensitive:$false
```

Resultado:

```text
Solo nombres de GitHub Secrets, GITHUB_TOKEN y texto documental. No hay valores reales.
```

```text
Test-Path app\.env
```

Resultado:

```text
False
```

## Resultado por criterio

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| Web pilot publica responde, o bloqueo exacto queda documentado | Cumple con bloqueo | HTTP falla TCP; SWA existe pero no hay deploy confirmado ni repo/branch conectado. |
| API pilot health responde, o bloqueo de red/ambiente queda documentado con evidencia | Cumple con bloqueo | API `httpApi` registrada; HTTP falla TCP desde este entorno. |
| No se crea ni usa Azure SQL | Cumple | Lista de recursos SQL vacia. |
| No quedan secrets en repo | Cumple | Busqueda solo encuentra nombres/referencias; `app\.env` no existe. |
| Queda recomendacion clara para QA publicado o siguiente desbloqueo | Cumple | Ver seccion siguiente. |
| El handoff indica `Uso Azure SQL: No` | Cumple | Indicado en resumen y ambiente. |

## Recomendacion

No enviar todavia a QA publicado.

Siguiente desbloqueo recomendado:

1. Reautenticar `gh` o usar GitHub web UI.
2. Confirmar que estos secrets existan en GitHub repo/ambiente `pilot`:
   - `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`
   - `AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA`
3. Subir/mergear los cambios locales pendientes, especialmente `TASK-055`.
4. Ejecutar workflow `PuntoVenta Web Pilot`.
5. Validar desde una red externa:
   - `https://gray-beach-00a0f870f.7.azurestaticapps.net/`
   - `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`

## Hallazgos

### P0/P1

- P1: Web pilot sigue sin deploy publico validado; bloqueo por credenciales GitHub invalidas y SWA sin repo/branch conectado.
- P1: HTTP publico no verificable desde este entorno por fallo TCP hacia SWA y Function App.

### P2/P3

- P2: API sigue registrada en Azure Functions, pero `/api/health` requiere validacion externa.
- P2: Los cambios de `TASK-055` estan locales; GitHub Actions no los puede desplegar hasta que esten en GitHub.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
