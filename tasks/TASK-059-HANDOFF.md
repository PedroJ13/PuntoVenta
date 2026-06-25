# TASK-059 - Handoff

Nombre del equipo/chat:
Ejecucion Tecnica

Modo:
Infra

Nombre de la tarea:
TASK-059 - Ejecutar workflows pilot desde GitHub UI y validar URLs externas

Archivo de tarea:
`tasks/TASK-059.md`

## Nombre de tarea culminada

TASK-059 - Ejecutar workflows pilot desde GitHub UI y validar URLs externas

## Status

entregada a revision con bloqueo de pipeline documentado

## Handoff

`tasks/TASK-059-HANDOFF.md`

## Resumen

Se ejecutaron manualmente los workflows pilot por GitHub Actions con `workflow_dispatch`. Ambos runs terminaron en `failure` por falta de credenciales/secrets efectivos para deploy. La Web publica y el endpoint API health si responden desde esta sesion. No se creo ni uso Azure SQL.

Uso Azure SQL: No.

## Ambiente

- Fecha: 2026-06-25
- Workspace: `C:\Work\Productos Digitales\PuntoVenta`
- Equipo/chat: Ejecucion Tecnica
- Modo: Infra
- Repo GitHub: `PedroJ13/PuntoVenta`
- Branch: `main`
- Head SHA ejecutado: `07dc0240dd28986a3c38cf69535fa6323c27352e`
- Web URL: `https://gray-beach-00a0f870f.7.azurestaticapps.net/`
- API health URL: `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`
- Azure SQL creado o usado: No
- Secretos expuestos: No

## Evidencia GitHub

Autenticacion GitHub CLI:

```text
gh auth status
```

Resultado:

```text
Logged in to github.com account PedroJ13
Token scopes: gist, read:org, repo, workflow
```

Workflows activos:

```text
PuntoVenta API Pilot active 301838508
PuntoVenta Web Pilot active 301838509
```

Secrets revisados sin exponer valores:

```text
gh secret list --repo PedroJ13/PuntoVenta --env pilot
gh secret list --repo PedroJ13/PuntoVenta --json name,updatedAt
gh api repos/PedroJ13/PuntoVenta/environments/pilot/secrets
```

Resultado:

```text
No aparecen secrets configurados a nivel repo ni ambiente pilot desde gh.
```

Secrets requeridos:

- `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA`

## Runs ejecutados

API:

```text
Workflow: PuntoVenta API Pilot
Run: 28144820179
URL: https://github.com/PedroJ13/PuntoVenta/actions/runs/28144820179
Evento: workflow_dispatch
Estado: completed
Conclusion: failure
```

Bloqueo exacto:

```text
No credentials found. Add an Azure login action before this action.
Deployment Failed.
```

Interpretacion: el workflow API no recibio publish profile efectivo y la accion intento autenticacion RBAC sin `azure/login`.

Web:

```text
Workflow: PuntoVenta Web Pilot
Run: 28144819391
URL: https://github.com/PedroJ13/PuntoVenta/actions/runs/28144819391
Evento: workflow_dispatch
Estado: completed
Conclusion: failure
```

Bloqueo exacto:

```text
deployment_token was not provided.
The deployment_token is required for deploying content.
```

Interpretacion: el workflow Web no recibio `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`.

## Smoke HTTP publico

Web:

```text
curl.exe -I --connect-timeout 15 https://gray-beach-00a0f870f.7.azurestaticapps.net/
```

Resultado:

```text
HTTP/1.1 200 OK
Content-Type: text/html
```

API:

```text
curl.exe -i --connect-timeout 15 https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health
```

Resultado:

```text
HTTP/1.1 200 OK
{"data":{"status":"ok","app":"PuntoVenta API","storage":"fake","storageDetails":{"catalog":"fake","openAccounts":"fake","cashShifts":"fake","sales":"fake","reports":"fake","sqlConfigured":false,"sqlAvailable":false}}}
```

## Azure control plane

Static Web App:

```text
name: swa-puntoventa-pilot-eastus2
defaultHostname: gray-beach-00a0f870f.7.azurestaticapps.net
sku: Free
```

Function App:

```text
name: func-puntoventa-pilot-eastus2
state: Running
defaultHostName: func-puntoventa-pilot-eastus2.azurewebsites.net
httpsOnly: true
```

Azure SQL:

```text
az resource list --resource-group rg-puntoventa-pilot-eastus2 --query "[?contains(type, 'Sql') || contains(type, 'sql')].{name:name,type:type}" --output json
```

Resultado:

```text
[]
```

## Resultado por criterio

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| Workflows pilot ejecutados con resultado documentado | Cumple con failure documentado | Runs `28144820179` y `28144819391`. |
| Web publica responde | Cumple | `curl` devuelve `HTTP/1.1 200 OK`. |
| API health publica responde | Cumple | `curl` devuelve `HTTP/1.1 200 OK`, storage fake y SQL no configurado. |
| No se crea ni usa Azure SQL | Cumple | Lista de recursos SQL vacia; health indica `sqlConfigured:false`. |
| No se exponen secretos | Cumple | Solo se listaron nombres/ausencia; no se leyeron valores. |
| Decision clara | Cumple | Ver recomendacion. |
| El handoff indica `Uso Azure SQL: No` | Cumple | Indicado en resumen y ambiente. |

## Recomendacion

No crear QA publicado completo todavia.

Siguiente desbloqueo recomendado:

1. Configurar los secrets requeridos en GitHub repo o ambiente `pilot`.
2. Re-ejecutar `PuntoVenta API Pilot` y `PuntoVenta Web Pilot`.
3. Crear QA publicado cuando ambos workflows queden exitosos y los endpoints sigan respondiendo.

## Hallazgos

### P0/P1

- P1: Pipeline Web no es reproducible porque falta `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA` efectivo para Actions.
- P1: Pipeline API no es reproducible porque falta `AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA` efectivo, o una configuracion alternativa con `azure/login`.

### P2/P3

- P2: Las URLs publicas responden actualmente, pero esa publicacion no queda respaldada por runs exitosos de GitHub Actions.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
