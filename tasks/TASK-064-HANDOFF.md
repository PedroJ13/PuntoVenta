# TASK-064 - Handoff

Nombre del equipo/chat:
Ejecucion Tecnica

Modo:
Infra

Nombre de la tarea:
TASK-064 - Restringir CORS API pilot a Web publicada

Archivo de tarea:
`tasks/TASK-064.md`

## Nombre de tarea culminada

TASK-064 - Restringir CORS API pilot a Web publicada

## Status

entregada a revision

## Handoff

`tasks/TASK-064-HANDOFF.md`

## Resumen

Se verifico la CORS efectiva publicada de la Function App pilot y quedo restringida al origen Web publicado `https://gray-beach-00a0f870f.7.azurestaticapps.net`. La configuracion Azure lista solo ese origen, `supportCredentials:false`, el origen permitido recibe `Access-Control-Allow-Origin` con la URL exacta y un origen externo no recibe header permisivo. El preflight externo queda rechazado por Azure.

La Web publicada responde `HTTP 200`, la API health responde `HTTP 200` y la API continua en storage fake con `sqlConfigured:false` y `sqlAvailable:false`. No se creo ni uso Azure SQL.

Uso Azure SQL: No.

## Ambiente

- Fecha: 2026-06-25
- Workspace: `C:\Work\Productos Digitales\PuntoVenta`
- Equipo/chat: Ejecucion Tecnica
- Modo: Infra
- Web URL: `https://gray-beach-00a0f870f.7.azurestaticapps.net/`
- API health URL: `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`
- Azure SQL creado o usado: No
- Secretos expuestos: No

## Configuracion CORS final

Comando:

```text
az functionapp cors show --resource-group rg-puntoventa-pilot-eastus2 --name func-puntoventa-pilot-eastus2 --output json
```

Resultado:

```json
{
  "allowedOrigins": [
    "https://gray-beach-00a0f870f.7.azurestaticapps.net"
  ],
  "supportCredentials": false
}
```

App settings no secretos confirmados:

```json
[
  {
    "name": "APP_ENV",
    "value": "pilot"
  },
  {
    "name": "PV_SQLSERVER_ENABLED",
    "value": "false"
  },
  {
    "name": "ALLOWED_ORIGINS",
    "value": "https://gray-beach-00a0f870f.7.azurestaticapps.net"
  }
]
```

## Verificacion HTTP publicada

Origen permitido:

```text
curl.exe -i --connect-timeout 15 -H "Origin: https://gray-beach-00a0f870f.7.azurestaticapps.net" https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health
```

Resultado relevante:

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://gray-beach-00a0f870f.7.azurestaticapps.net
storage=fake
sqlConfigured=false
sqlAvailable=false
```

Origen externo:

```text
curl.exe -i --connect-timeout 15 -H "Origin: https://example.invalid" https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health
```

Resultado relevante:

```text
HTTP/1.1 200 OK
sin Access-Control-Allow-Origin
storage=fake
sqlConfigured=false
sqlAvailable=false
```

Preflight permitido:

```text
curl.exe -i --connect-timeout 15 -X OPTIONS -H "Origin: https://gray-beach-00a0f870f.7.azurestaticapps.net" -H "Access-Control-Request-Method: GET" https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health
```

Resultado relevante:

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://gray-beach-00a0f870f.7.azurestaticapps.net
```

Preflight externo:

```text
curl.exe -i --connect-timeout 15 -X OPTIONS -H "Origin: https://example.invalid" -H "Access-Control-Request-Method: GET" https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health
```

Resultado:

```text
HTTP/1.1 400 The origin 'https://example.invalid' is not allowed.
Bad Request
```

Web publicada:

```text
curl.exe -I --connect-timeout 15 https://gray-beach-00a0f870f.7.azurestaticapps.net/
```

Resultado:

```text
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 15526
```

## Azure SQL

Comando:

```text
az resource list --resource-group rg-puntoventa-pilot-eastus2 --query "[?contains(type, 'Sql') || contains(type, 'sql')].{name:name,type:type}" --output json
```

Resultado:

```json
[]
```

## Cambios realizados

- `docs/PILOT_DEPLOY_CONFIG.md`: se actualizo la seccion CORS para reflejar la restriccion efectiva publicada y la excepcion local.
- `docs/CURRENT_BLOCKERS.md`: se movio CORS amplio a resueltos recientes.
- `docs/TASK_BOARD.md`: se movio `TASK-064` a `Needs Review`.
- `tasks/TASK-064.md`: se marco como `Needs Review` con criterios cumplidos.
- `tasks/TASK-064-HANDOFF.md`: se creo este handoff.

Nota tecnica: se creo el commit local `a6a8b17 Restrict pilot API CORS origin` con una mejora del adaptador Azure Functions para respetar `ALLOWED_ORIGINS`. El push remoto fue bloqueado por politica de aprobacion automatica; la verificacion publicada de esta tarea no depende de ese deploy porque la CORS efectiva ya esta restringida por Azure.

## Resultado por criterio

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| CORS pilot restringido al origen Web publicado | Cumple | Azure CORS lista solo la Web pilot; origen externo sin header permitido; preflight externo `400`. |
| Web publicada sigue cargando y consumiendo API | Cumple | Web `HTTP 200`; API acepta origen Web pilot y health `HTTP 200`. |
| API health publica responde `HTTP 200` | Cumple | Health con origen permitido devuelve `HTTP/1.1 200 OK`. |
| No se crea ni usa Azure SQL | Cumple | Recursos SQL `[]`; health `sqlConfigured:false`, `sqlAvailable:false`. |
| No se exponen secretos | Cumple | Solo se leyeron settings no secretos y configuracion CORS. |
| Recomendacion QA posterior | Cumple | Ver recomendacion. |
| Handoff indica `Uso Azure SQL: No` | Cumple | Indicado en resumen y ambiente. |

## Recomendacion

No requiere QA funcional completo posterior. Si Proyecto quiere cerrar formalmente el P2 de QA publicado, basta una QA ligera de Web/API publicada enfocada en CORS y health.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
