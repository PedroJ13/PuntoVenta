# TASK-063 - Handoff

Nombre del equipo/chat:
Ejecucion Tecnica

Modo:
Infra

Nombre de la tarea:
TASK-063 - Migrar API deploy pilot a OIDC RBAC y apagar SCM

Archivo de tarea:
`tasks/TASK-063.md`

## Nombre de tarea culminada

TASK-063 - Migrar API deploy pilot a OIDC RBAC y apagar SCM

## Status

entregada a revision

## Handoff

`tasks/TASK-063-HANDOFF.md`

## Resumen

Se migro el workflow `PuntoVenta API Pilot` de publish profile a GitHub OIDC + `azure/login` + RBAC minimo. Se creo una app registration/service principal sin client secret, se agrego federated credential para el environment `pilot`, se asigno `Website Contributor` con scope en la Function App pilot, se configuro GitHub environment secrets con IDs no secretos y se publico el workflow actualizado.

El workflow API quedo exitoso usando OIDC/RBAC. Luego se elimino el secret de publish profile del environment `pilot`, se volvio `basicPublishingCredentialsPolicies/scm allow:false` y se confirmo `basicPublishingCredentialsPolicies/ftp allow:false`. Web y API publicos responden `HTTP 200`. No se creo ni uso Azure SQL.

Uso Azure SQL: No.

## Ambiente

- Fecha: 2026-06-25
- Workspace: `C:\Work\Productos Digitales\PuntoVenta`
- Equipo/chat: Ejecucion Tecnica
- Modo: Infra
- Repo GitHub: `PedroJ13/PuntoVenta`
- Branch: `main`
- Commit workflow OIDC: `32a7491 Migrate API pilot workflow to OIDC`
- Web URL: `https://gray-beach-00a0f870f.7.azurestaticapps.net/`
- API health URL: `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`
- Azure SQL creado o usado: No
- Secretos expuestos: No

## Identidad OIDC/RBAC

App registration / service principal:

```text
displayName: gha-puntoventa-functions-pilot
appId: dba65970-ecdb-4e3c-89b2-5fea88fc4032
client secret: No
```

Federated credential:

```text
name: github-pilot-environment
issuer: https://token.actions.githubusercontent.com
subject: repo:PedroJ13/PuntoVenta:environment:pilot
audiences: api://AzureADTokenExchange
```

RBAC:

```text
role: Website Contributor
scope: /subscriptions/.../resourceGroups/rg-puntoventa-pilot-eastus2/providers/Microsoft.Web/sites/func-puntoventa-pilot-eastus2
```

GitHub environment secrets configurados sin valores:

```text
AZURE_CLIENT_ID
AZURE_TENANT_ID
AZURE_SUBSCRIPTION_ID
```

Secret eliminado por quedar obsoleto:

```text
AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA
```

## Workflow

Archivo actualizado:

```text
.github/workflows/puntoventa-api-pilot.yml
```

Cambios relevantes:

```text
permissions:
  id-token: write
  contents: read

uses: azure/login@v2
with:
  client-id: ${{ secrets.AZURE_CLIENT_ID }}
  tenant-id: ${{ secrets.AZURE_TENANT_ID }}
  subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

Azure/functions-action@v1 sin publish-profile
```

Commit/push:

```text
32a7491 Migrate API pilot workflow to OIDC
push origin main: exitoso
```

## Runs ejecutados

Primer run OIDC:

```text
Workflow: PuntoVenta API Pilot
Run: 28174437058
URL: https://github.com/PedroJ13/PuntoVenta/actions/runs/28174437058
Head SHA: 32a749158464501d7bfa3f7cbb7d58a15d6c6648
Evento: workflow_dispatch
Estado: completed
Conclusion: success
```

Run final despues de eliminar publish profile y apagar SCM:

```text
Workflow: PuntoVenta API Pilot
Run: 28174634037
URL: https://github.com/PedroJ13/PuntoVenta/actions/runs/28174634037
Head SHA: 32a749158464501d7bfa3f7cbb7d58a15d6c6648
Evento: workflow_dispatch
Estado: completed
Conclusion: success
```

## Politicas Azure finales

```text
basicPublishingCredentialsPolicies/scm allow:false
basicPublishingCredentialsPolicies/ftp allow:false
```

## Smoke HTTP publico

Web:

```text
curl.exe -I --connect-timeout 15 https://gray-beach-00a0f870f.7.azurestaticapps.net/
```

Resultado:

```text
HTTP/1.1 200 OK
Content-Length: 15526
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

## Azure SQL

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
| Workflow API usa OIDC/RBAC y queda exitoso | Cumple | Runs `28174437058` y `28174634037` en `success`. |
| No se usan publish profiles para API deploy | Cumple | Workflow ya no referencia `publish-profile`; secret publish profile eliminado del environment `pilot`. |
| `scm allow:false` restaurado | Cumple | Politica final `scm allow:false`. |
| `ftp allow:false` confirmado | Cumple | Politica final `ftp allow:false`. |
| API health publica responde `HTTP 200` | Cumple | `curl` devuelve `HTTP/1.1 200 OK`, storage fake y SQL no configurado. |
| Web publica responde `HTTP 200` | Cumple | `curl` devuelve `HTTP/1.1 200 OK`. |
| No se crea ni usa Azure SQL | Cumple | Lista de recursos SQL vacia. |
| No se exponen secretos | Cumple | No se crearon client secrets; solo se documentaron nombres/IDs no secretos. |
| Handoff indica `Uso Azure SQL: No` | Cumple | Indicado en resumen y ambiente. |

## Recomendacion

Proyecto puede procesar el cierre de la excepcion SCM temporal. El siguiente paso razonable es mantener QA publicado aprobado como baseline pilot y crear tareas separadas solo para riesgos P2 restantes, como CORS amplio y futura persistencia real.

## Hallazgos

### P0/P1

- Ninguno.

### P2/P3

- P2: CORS amplio de compatibilidad MVP permanece como riesgo tecnico ya documentado en `docs/PILOT_DEPLOY_CONFIG.md` y `tasks/TASK-062-HANDOFF.md`.
- P2: La API publicada sigue en storage fake sin Azure SQL, esperado para este deploy pilot.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
