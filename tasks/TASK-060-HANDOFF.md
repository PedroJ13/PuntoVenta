# TASK-060 - Handoff

Nombre del equipo/chat:
Ejecucion Tecnica

Modo:
Infra

Nombre de la tarea:
TASK-060 - Configurar secrets GitHub pilot y re-ejecutar workflows

Archivo de tarea:
`tasks/TASK-060.md`

## Nombre de tarea culminada

TASK-060 - Configurar secrets GitHub pilot y re-ejecutar workflows

## Status

entregada a revision con bloqueo API documentado

## Handoff

`tasks/TASK-060-HANDOFF.md`

## Resumen

Se configuraron los dos secrets requeridos en el ambiente GitHub `pilot` sin exponer valores. El workflow Web pilot se re-ejecuto y quedo exitoso. El workflow API pilot se re-ejecuto y fallo con un bloqueo distinto: el publish profile ya llega al workflow, pero Azure Kudu responde `401` porque la Function App tiene `basicPublishingCredentialsPolicies/scm` en `allow:false`.

No se habilito SCM basic publishing porque es un cambio de seguridad persistente y requiere decision/aprobacion explicita. No se creo ni uso Azure SQL.

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

## Secrets GitHub

Se configuraron en el ambiente `pilot` sin imprimir valores:

```text
AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA
AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA
```

Evidencia sin valores:

```text
AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA     2026-06-25T04:04:06Z
AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA  2026-06-25T04:04:12Z
```

## Runs ejecutados

API:

```text
Workflow: PuntoVenta API Pilot
Run: 28146062282
URL: https://github.com/PedroJ13/PuntoVenta/actions/runs/28146062282
Evento: workflow_dispatch
Estado: completed
Conclusion: failure
```

Bloqueo exacto:

```text
Successfully parsed SCM credential from publish-profile format.
Using SCM credential for authentication, GitHub Action will not perform resource validation.
Failed to acquire app settings from https://<scmsite>/api/settings with publish-profile
Failed to fetch Kudu App Settings.
Unauthorized (CODE: 401)
Deployment Failed.
```

Politica Azure relacionada:

```text
basicPublishingCredentialsPolicies/scm
allow: false
```

Web:

```text
Workflow: PuntoVenta Web Pilot
Run: 28146063129
URL: https://github.com/PedroJ13/PuntoVenta/actions/runs/28146063129
Evento: workflow_dispatch
Estado: completed
Conclusion: success
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
Last-Modified: Thu, 25 Jun 2026 04:05:11 GMT
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
| Secrets requeridos configurados sin exponer valores | Cumple | `gh secret list --env pilot` muestra ambos nombres con timestamp. |
| Workflow API pilot exitoso o bloqueo documentado | Cumple con bloqueo | Run `28146062282` falla por Kudu `401` y `scm allow:false`. |
| Workflow Web pilot exitoso o bloqueo documentado | Cumple | Run `28146063129` quedo `success`. |
| Web publica responde | Cumple | `curl` devuelve `HTTP/1.1 200 OK`. |
| API health publica responde | Cumple | `curl` devuelve `HTTP/1.1 200 OK`, storage fake y SQL no configurado. |
| No se crea ni usa Azure SQL | Cumple | Lista de recursos SQL vacia. |
| Decision clara | Cumple | Ver recomendacion. |
| El handoff indica `Uso Azure SQL: No` | Cumple | Indicado en resumen y ambiente. |

## Recomendacion

No crear QA publicado completo todavia.

Siguiente desbloqueo recomendado, elegir una opcion:

1. Aprobar explicitamente habilitar `basicPublishingCredentialsPolicies/scm allow:true` para `func-puntoventa-pilot-eastus2`, manteniendo FTP en `allow:false`, y reintentar el workflow API con publish profile.
2. Cambiar el workflow API a autenticacion Azure federada/RBAC con `azure/login`, creando la credencial federada y permisos necesarios, para evitar publish profile con SCM basic publishing.

Cuando API y Web queden con workflows exitosos y los endpoints sigan en `HTTP 200`, crear tarea QA publicado.

## Hallazgos

### P0/P1

- P1: API deploy por GitHub Actions sigue bloqueado porque Kudu rechaza el publish profile con `401` mientras `basicPublishingCredentialsPolicies/scm` esta en `allow:false`.

### P2/P3

- P2: Web deploy ya es reproducible por GitHub Actions.
- P2: API publicada responde actualmente, pero el pipeline API aun no queda reproducible.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
