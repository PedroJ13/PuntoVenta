# TASK-052 - Handoff

Nombre del equipo/chat:
Ejecucion Tecnica

Modo:
Infra

Nombre de la tarea:
TASK-052 - Provisionar recursos pilot Web API sin Azure SQL

Archivo de tarea:
`tasks/TASK-052.md`

## Nombre de tarea culminada

TASK-052 - Provisionar recursos pilot Web API sin Azure SQL

## Status

entregada a revision

## Handoff

`tasks/TASK-052-HANDOFF.md`

## Resumen

Se provisionaron recursos Azure minimos para ambiente `pilot` de Web estatica + API, sin crear Azure SQL y sin ejecutar deploy funcional. Se aplicaron guardrails basicos: Storage con TLS 1.2 y blob publico deshabilitado, Function App con HTTPS only, Static Web App Free y Log Analytics con cuota diaria de 0.5 GB.

Uso Azure SQL: No.

## Ambiente

- Fecha: 2026-06-24
- Workspace: `C:\Work\Productos Digitales\PuntoVenta`
- Equipo/chat: Ejecucion Tecnica
- Modo: Infra
- Suscripcion Azure: `as_main`
- Region: `eastus2`
- Resource group: `rg-puntoventa-pilot-eastus2`
- Recursos Azure creados o modificados: Si, solo Web/API/observabilidad.
- Azure SQL creado: No
- Uso DB cloud: No
- Uso Azure SQL: No
- Deploy ejecutado: No
- Secretos guardados en repo: No

## Recursos

| Recurso | Nombre | SKU / plan | URL / nota |
| --- | --- | --- | --- |
| Resource group | `rg-puntoventa-pilot-eastus2` | - | Contenedor pilot. |
| Storage Account | `stpuntoventapiloteastus2` | `Standard_LRS` | Blob publico deshabilitado, TLS 1.2. |
| Log Analytics | `log-puntoventa-pilot-eastus2` | `PerGB2018` | Retencion 30 dias, cuota diaria 0.5 GB. |
| Application Insights | `appi-puntoventa-pilot-eastus2` | Workspace-based | Enlazado a Log Analytics. |
| Function App | `func-puntoventa-pilot-eastus2` | Consumption `Y1` | `https://func-puntoventa-pilot-eastus2.azurewebsites.net` |
| App Service plan | `EastUS2Plan` | `Y1` | Creado por Function App consumption. |
| Static Web App | `swa-puntoventa-pilot-eastus2` | `Free` | `https://gray-beach-00a0f870f.7.azurestaticapps.net` |

## Comandos ejecutados

```text
az account show --output json
```

```text
az group create --name rg-puntoventa-pilot-eastus2 --location eastus2 --tags project=PuntoVenta environment=pilot managedBy=Codex task=TASK-052 --output json
```

```text
az storage account create --name stpuntoventapiloteastus2 --resource-group rg-puntoventa-pilot-eastus2 --location eastus2 --sku Standard_LRS --kind StorageV2 --min-tls-version TLS1_2 --allow-blob-public-access false --tags project=PuntoVenta environment=pilot managedBy=Codex task=TASK-052 --output json
```

```text
az monitor log-analytics workspace create --workspace-name log-puntoventa-pilot-eastus2 --resource-group rg-puntoventa-pilot-eastus2 --location eastus2 --tags project=PuntoVenta environment=pilot managedBy=Codex task=TASK-052 --output json
```

```text
az extension add --name application-insights --only-show-errors
```

```text
az monitor app-insights component create --app appi-puntoventa-pilot-eastus2 --resource-group rg-puntoventa-pilot-eastus2 --location eastus2 --workspace log-puntoventa-pilot-eastus2 --tags project=PuntoVenta environment=pilot managedBy=Codex task=TASK-052 --output json
```

```text
az functionapp create --resource-group rg-puntoventa-pilot-eastus2 --consumption-plan-location eastus2 --runtime node --runtime-version 22 --functions-version 4 --name func-puntoventa-pilot-eastus2 --storage-account stpuntoventapiloteastus2 --app-insights appi-puntoventa-pilot-eastus2 --tags project=PuntoVenta environment=pilot managedBy=Codex task=TASK-052 --output json
```

```text
az staticwebapp create --name swa-puntoventa-pilot-eastus2 --resource-group rg-puntoventa-pilot-eastus2 --location eastus2 --sku Free --tags project=PuntoVenta environment=pilot managedBy=Codex task=TASK-052 --output json
```

```text
az resource update --ids <function-app-resource-id> --set properties.httpsOnly=true --output json
```

```text
az monitor log-analytics workspace update --resource-group rg-puntoventa-pilot-eastus2 --workspace-name log-puntoventa-pilot-eastus2 --quota 0.5 --output json
```

## Verificacion ejecutada

```text
az resource list --resource-group rg-puntoventa-pilot-eastus2 --query "[].{name:name,type:type,location:location,sku:sku.name}" --output table
```

Resultado resumido:

```text
stpuntoventapiloteastus2       eastus2     Standard_LRS
log-puntoventa-pilot-eastus2   eastus2
appi-puntoventa-pilot-eastus2  eastus2
func-puntoventa-pilot-eastus2  eastus2
EastUS2Plan                    eastus2     Y1
swa-puntoventa-pilot-eastus2   eastus2     Free
```

## Resultado por criterio

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| Recursos pilot para Web + API quedan provisionados o bloqueo claro documentado | Cumple | RG, SWA, Function App, Storage, App Insights y Log Analytics creados. |
| No se crea Azure SQL | Cumple | Lista de recursos no contiene SQL Server ni SQL Database. |
| No se guardan secrets en repo | Cumple | No se escribieron tokens, publish profiles ni connection strings. |
| URLs/nombres/sku quedan documentados | Cumple | Tabla de recursos en este handoff. |
| Handoff indica costos/guardrails y `Uso Azure SQL: No` | Cumple | SWA Free, Function Y1, Storage LRS, Log quota 0.5 GB/dia. |

## Hallazgos

### P0/P1

- Ninguno.

### P2/P3

- P3: `az functionapp create` devolvio inicialmente `httpsOnly=false`; se corrigio con `az resource update`.
- P3: Log Analytics se creo inicialmente sin cuota diaria; se ajusto a 0.5 GB/dia.
- P3: App Insights command requirio instalar extension `application-insights` de Azure CLI.

## Pendientes o riesgos

- `TASK-053` debe configurar deploy y App Settings sin guardar secrets en repo.
- Function App aun no tiene codigo desplegado.
- Static Web App aun no tiene contenido desplegado.
- Azure SQL permanece fuera del alcance.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
