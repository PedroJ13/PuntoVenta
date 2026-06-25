# TASK-061 - Handoff

Nombre del equipo/chat:
Ejecucion Tecnica

Modo:
Infra

Nombre de la tarea:
TASK-061 - Habilitar SCM pilot temporal y reintentar deploy API

Archivo de tarea:
`tasks/TASK-061.md`

## Nombre de tarea culminada

TASK-061 - Habilitar SCM pilot temporal y reintentar deploy API

## Status

entregada a revision

## Handoff

`tasks/TASK-061-HANDOFF.md`

## Resumen

Se habilito `basicPublishingCredentialsPolicies/scm allow:true` solo en la Function App pilot `func-puntoventa-pilot-eastus2`, se confirmo `basicPublishingCredentialsPolicies/ftp allow:false`, se refresco el publish profile en GitHub environment secret sin exponer valores y se re-ejecuto el workflow API pilot hasta quedar exitoso.

Web y API publicos responden `HTTP 200`. No se creo ni uso Azure SQL.

`scm allow:true` queda documentado como temporal para pilot. Debe migrarse a OIDC/RBAC y luego volver a `scm allow:false`.

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

## Politicas Azure

Estado antes:

```text
basicPublishingCredentialsPolicies/scm allow:false
basicPublishingCredentialsPolicies/ftp allow:false
```

Cambio aplicado:

```text
basicPublishingCredentialsPolicies/scm allow:true
basicPublishingCredentialsPolicies/ftp allow:false
```

Estado final:

```text
basicPublishingCredentialsPolicies/scm allow:true
basicPublishingCredentialsPolicies/ftp allow:false
```

Nota: `scm allow:true` queda solo como desbloqueo temporal del pilot. FTP quedo deshabilitado.

## Secret API

Se refresco el publish profile en GitHub environment secret sin imprimir valores:

```text
AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA  2026-06-25T04:43:21Z
```

No se guardo ningun secreto en repo, Markdown ni chat.

## Runs ejecutados

Primer reintento API despues de habilitar SCM, antes de refrescar el secret:

```text
Workflow: PuntoVenta API Pilot
Run: 28147335525
URL: https://github.com/PedroJ13/PuntoVenta/actions/runs/28147335525
Evento: workflow_dispatch
Estado: completed
Conclusion: failure
```

Bloqueo:

```text
Failed to fetch Kudu App Settings.
Unauthorized (CODE: 401)
```

Segundo reintento API despues de refrescar publish profile:

```text
Workflow: PuntoVenta API Pilot
Run: 28147401541
URL: https://github.com/PedroJ13/PuntoVenta/actions/runs/28147401541
Evento: workflow_dispatch
Estado: completed
Conclusion: success
```

Workflow Web verificado sin regresion:

```text
Workflow: PuntoVenta Web Pilot
Run: 28146063129
URL: https://github.com/PedroJ13/PuntoVenta/actions/runs/28146063129
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
| `scm allow:true` aplicado solo a Function App pilot | Cumple | Politica final `scm allow:true` en `func-puntoventa-pilot-eastus2`. |
| `ftp allow:false` confirmado | Cumple | Politica final `ftp allow:false`. |
| Workflow API pilot exitoso | Cumple | Run `28147401541` quedo `success`. |
| Web publica responde `HTTP 200` | Cumple | `curl` devuelve `HTTP/1.1 200 OK`. |
| API health publica responde `HTTP 200` | Cumple | `curl` devuelve `HTTP/1.1 200 OK`, storage fake y SQL no configurado. |
| No se crea ni usa Azure SQL | Cumple | Lista de recursos SQL vacia. |
| No se exponen secretos | Cumple | Secret refrescado por stdin/pipe; solo se documento nombre y timestamp. |
| Recomendacion clara para QA y OIDC/RBAC | Cumple | Ver recomendacion. |
| El handoff indica `Uso Azure SQL: No` | Cumple | Indicado en resumen y ambiente. |

## Recomendacion

Crear tarea QA publicado para validar Web/API pilot desde la superficie publica.

Crear tarea Infra posterior para migrar el deploy API a GitHub OIDC + `azure/login` + RBAC minimo y, cuando este funcionando, volver a `basicPublishingCredentialsPolicies/scm allow:false`.

## Hallazgos

### P0/P1

- Ninguno abierto para publicar QA tecnico: workflows Web/API estan exitosos y endpoints responden `HTTP 200`.

### P2/P3

- P2: `scm allow:true` queda como excepcion temporal de pilot y debe cerrarse con migracion a OIDC/RBAC.
- P2: CORS de API sigue amplio por compatibilidad MVP, ya documentado en `docs/PILOT_DEPLOY_CONFIG.md`.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
